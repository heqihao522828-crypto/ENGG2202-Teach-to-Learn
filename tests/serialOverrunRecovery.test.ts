import assert from "node:assert/strict";
import test from "node:test";
import {
  PREFERRED_SERIAL_BUFFER_SIZE,
  SERIAL_BUFFER_SIZE_FALLBACKS,
  ScsServoClient,
  SerialReceiveOverrunError,
  isBufferOverrunError
} from "../app/engg1101/robotic-arm-controller/webserial/scservo.ts";

function statusPacket(id: number, params: number[] = []): Uint8Array {
  const bytes = [0xff, 0xff, id, params.length + 2, 0, ...params, 0];
  let sum = 0;
  for (let index = 2; index < bytes.length - 1; index += 1) sum += bytes[index];
  bytes[bytes.length - 1] = (~sum) & 0xff;
  return Uint8Array.from(bytes);
}

function installPort(port: object): void {
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  Object.defineProperty(globalThis, "navigator", {
    value: { serial: { requestPort: async () => port } },
    configurable: true
  });
}

async function waitUntil(predicate: () => boolean, timeoutMs = 500): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error("Timed out waiting for serial state change.");
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

function createRecoveringPort() {
  let controller: ReadableStreamDefaultController<Uint8Array>;
  let currentReadable: ReadableStream<Uint8Array>;
  const streams: ReadableStream<Uint8Array>[] = [];
  const writes: Uint8Array[] = [];
  let onWrite: (packet: Uint8Array) => void = () => undefined;

  const replaceReadable = () => {
    currentReadable = new ReadableStream<Uint8Array>({
      start(nextController) {
        controller = nextController;
      }
    });
    streams.push(currentReadable);
  };
  replaceReadable();

  const writable = new WritableStream<Uint8Array>({
    write(chunk) {
      const packet = Uint8Array.from(chunk);
      writes.push(packet);
      onWrite(packet);
    }
  });

  return {
    get readable() { return currentReadable; },
    writable,
    writes,
    streams,
    setOnWrite(callback: (packet: Uint8Array) => void) { onWrite = callback; },
    enqueue(bytes: Uint8Array) { controller.enqueue(bytes); },
    failReadable(error: Error) {
      const failed = currentReadable;
      controller.error(error);
      replaceReadable();
      return failed;
    },
    async open() {},
    async close() {}
  };
}

test("Web Serial opens with explicit framing and preferred buffer size", async () => {
  const options: SerialPortOpenOptions[] = [];
  const readable = new ReadableStream<Uint8Array>();
  const writable = new WritableStream<Uint8Array>();
  const port = {
    readable,
    writable,
    async open(value: SerialPortOpenOptions) { options.push(value); },
    async close() {}
  };
  installPort(port);
  const client = new ScsServoClient();
  await client.connect(115200);
  assert.deepEqual(options, [{
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    flowControl: "none",
    bufferSize: PREFERRED_SERIAL_BUFFER_SIZE
  }]);
  assert.equal(client.getTransportHealth().configuredBufferSize, 8192);
  await client.disconnect();
});

test("buffer-size rejection falls back, while unrelated open errors do not", async () => {
  const attempted: number[] = [];
  const port = {
    readable: new ReadableStream<Uint8Array>(),
    writable: new WritableStream<Uint8Array>(),
    async open(options: SerialPortOpenOptions) {
      attempted.push(options.bufferSize ?? 0);
      if (options.bufferSize === 8192) throw new TypeError("bufferSize is not supported by this driver");
    },
    async close() {}
  };
  installPort(port);
  const client = new ScsServoClient();
  await client.connect(57600);
  assert.deepEqual(attempted, [8192, 4096]);
  assert.deepEqual([...SERIAL_BUFFER_SIZE_FALLBACKS], [8192, 4096, 1024]);
  assert.equal(client.getTransportHealth().configuredBufferSize, 4096);
  await client.disconnect();

  const unrelatedAttempts: number[] = [];
  const permissionError = new DOMException("Permission denied", "NotAllowedError");
  const deniedPort = {
    readable: new ReadableStream<Uint8Array>(),
    writable: new WritableStream<Uint8Array>(),
    async open(options: SerialPortOpenOptions) {
      unrelatedAttempts.push(options.bufferSize ?? 0);
      throw permissionError;
    },
    async close() {}
  };
  installPort(deniedPort);
  await assert.rejects(new ScsServoClient().connect(115200), (error) => error === permissionError);
  assert.deepEqual(unrelatedAttempts, [8192]);
});

test("a buffer overrun replaces only the reader, clears partial bytes, and preserves the session", async () => {
  const port = createRecoveringPort();
  let moveWrites = 0;
  port.setOnWrite((packet) => {
    if (packet[4] === 0x03 && packet[5] === 41) {
      moveWrites += 1;
      port.enqueue(Uint8Array.from([0xff, 0xff, packet[2]]));
      port.failReadable(new DOMException("Buffer overrun", "BufferOverrunError"));
    } else if (packet[4] === 0x01) {
      port.enqueue(statusPacket(packet[2]));
    }
  });
  installPort(port);
  const client = new ScsServoClient();
  await client.connect(115200);
  const failedStream = port.streams[0];

  await assert.rejects(
    client.writePosEx(1, 2100, 100, 10),
    (error) => error instanceof SerialReceiveOverrunError && /response lost/.test(error.message)
  );
  await waitUntil(() => client.getTransportHealth().successfulOverrunRecoveries === 1);

  const health = client.getTransportHealth();
  assert.equal(client.connected, true);
  assert.equal(health.bufferOverruns, 1);
  assert.equal(health.failedOverrunRecoveries, 0);
  assert.equal(health.rxPacketsParsed, 0);
  assert.equal(failedStream.locked, false);
  assert.equal(port.streams[1].locked, true);
  assert.equal(port.streams.filter((stream) => stream.locked).length, 1);

  assert.equal(await client.pingServo(1), true);
  assert.equal(moveWrites, 1, "an uncertain movement command must never be resent");
  assert.equal(client.getTransportHealth().rxPacketsParsed, 1);
  await client.disconnect();
});

test("repeated overruns become fatal, but a physical read disconnect is fatal immediately", async () => {
  const port = createRecoveringPort();
  installPort(port);
  const client = new ScsServoClient();
  await client.connect(115200);

  for (let count = 1; count <= 3; count += 1) {
    port.failReadable(new DOMException("Buffer overrun", "BufferOverrunError"));
    await waitUntil(() => client.getTransportHealth().successfulOverrunRecoveries === count);
    assert.equal(client.connected, true);
  }
  port.failReadable(new DOMException("Buffer overrun", "BufferOverrunError"));
  await waitUntil(() => !client.connected);
  assert.equal(client.getTransportHealth().bufferOverruns, 4);
  assert.equal(client.getTransportHealth().failedOverrunRecoveries, 1);

  const disconnectedPort = createRecoveringPort();
  installPort(disconnectedPort);
  const disconnectedClient = new ScsServoClient();
  await disconnectedClient.connect(115200);
  disconnectedPort.failReadable(new DOMException("The device was lost", "NetworkError"));
  await waitUntil(() => !disconnectedClient.connected);
  assert.equal(disconnectedClient.getTransportHealth().bufferOverruns, 0);
});

test("BufferOverrunError classification is narrow and the command queue is bounded", async () => {
  assert.equal(isBufferOverrunError(new DOMException("Buffer overrun", "BufferOverrunError")), true);
  assert.equal(isBufferOverrunError(new DOMException("Device lost", "NetworkError")), false);

  let releaseFirstWrite!: () => void;
  const firstWrite = new Promise<void>((resolve) => { releaseFirstWrite = resolve; });
  let writeCount = 0;
  const port = {
    readable: new ReadableStream<Uint8Array>(),
    writable: new WritableStream<Uint8Array>({
      write() {
        writeCount += 1;
        return writeCount === 1 ? firstWrite : undefined;
      }
    }),
    async open() {},
    async close() {}
  };
  installPort(port);
  const client = new ScsServoClient();
  await client.connect(115200);
  const commands = Array.from({ length: 33 }, () => client.writePosExNoStatus(1, 2048, 100, 10));
  await assert.rejects(commands[32], /Serial command queue is full \(32 commands\)/);
  assert.equal(client.getTransportHealth().queueLength, 32);
  assert.equal(client.getTransportHealth().maxCommandQueueDepth, 32);
  releaseFirstWrite();
  await Promise.all(commands.slice(0, 32));
  await client.disconnect();
});

