import assert from "node:assert/strict";
import test from "node:test";
import {
  ScsServoClient,
  buildPingPacket,
  buildWritePositionPacket,
  decodeWritePositionPacket,
  decodeRawServoPosition,
  describeSerialError,
  formatSerialError,
  parseStatusPacketBuffer,
  type SerialTransportErrorEvent
} from "../app/engg1101/robotic-arm-controller/webserial/scservo.ts";

function statusPacket(id: number, params: number[] = [], error = 0): Uint8Array {
  const bytes = [0xff, 0xff, id, params.length + 2, error, ...params, 0];
  let sum = 0;
  for (let index = 2; index < bytes.length - 1; index += 1) {
    sum += bytes[index];
  }
  bytes[bytes.length - 1] = (~sum) & 0xff;
  return Uint8Array.from(bytes);
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  return Uint8Array.from([...a, ...b]);
}

function createFakePort(onWrite: (bytes: Uint8Array, enqueue: (bytes: Uint8Array) => void) => void) {
  let inputController: ReadableStreamDefaultController<Uint8Array> | null = null;
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      inputController = controller;
    }
  });
  const writable = new WritableStream<Uint8Array>({
    write(chunk) {
      onWrite(Uint8Array.from(chunk), (bytes) => inputController?.enqueue(bytes));
    }
  });
  return {
    readable,
    writable,
    async open() {},
    async close() {}
  };
}

async function connectFakeClient(
  onWrite: (bytes: Uint8Array, enqueue: (bytes: Uint8Array) => void) => void
): Promise<ScsServoClient> {
  const port = createFakePort(onWrite);
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  Object.defineProperty(globalThis, "navigator", {
    value: { serial: { requestPort: async () => port } },
    configurable: true
  });
  const client = new ScsServoClient();
  await client.connect(115200);
  return client;
}

test("ping packet uses the canonical ST3215 structure and checksum", () => {
  assert.deepEqual(
    [...buildPingPacket(1)],
    [0xff, 0xff, 0x01, 0x02, 0x01, 0xfb]
  );
});

test("position bytes decode as unsigned little-endian absolute positions", () => {
  assert.equal(decodeRawServoPosition(0x00, 0x08), 2048);
  assert.equal(decodeRawServoPosition(0x85, 0x0c), 3205);
  assert.equal(decodeRawServoPosition(0xff, 0x0f), 4095);
  assert.throws(
    () => decodeRawServoPosition(0x00, 0x80),
    /outside 0.*4095/
  );
});

test("goal-position packet preserves the exact unsigned raw target", () => {
  const packet = buildWritePositionPacket(3, 2050, 300, 20);
  assert.deepEqual([...packet], [
    0xff, 0xff, 0x03, 0x0a, 0x03,
    0x29, 0x14, 0x02, 0x08, 0x00, 0x00, 0x2c, 0x01,
    0x7b
  ]);
  assert.equal(packet[7] | (packet[8] << 8), 2050);
  assert.throws(() => buildWritePositionPacket(3, 4096, 300, 20), /Goal position/);
});

test("final position packet decodes back to the exact ID, goal, speed, and acceleration", () => {
  const packet = buildWritePositionPacket(4, 2137, 80, 5);
  const decoded = decodeWritePositionPacket(packet);
  assert.deepEqual(decoded && {
    id: decoded.id,
    rawPosition: decoded.rawPosition,
    speed: decoded.speed,
    acceleration: decoded.acceleration,
    goalBytes: [...decoded.goalBytes]
  }, {
    id: 4,
    rawPosition: 2137,
    speed: 80,
    acceleration: 5,
    goalBytes: [0x59, 0x08]
  });
});

test("diagnostic position write is transmitted exactly once without a status retry", async () => {
  const writes: Uint8Array[] = [];
  const client = await connectFakeClient((packet) => writes.push(packet));
  await client.writePosExNoStatus(2, 2137, 80, 5);
  assert.equal(writes.length, 1);
  assert.equal(decodeWritePositionPacket(writes[0])?.rawPosition, 2137);
  await client.disconnect();
});

test("parser combines partial packets and preserves an incomplete suffix", () => {
  const packet = statusPacket(1);
  const first = parseStatusPacketBuffer(Uint8Array.from([0x12, 0x34, ...packet.slice(0, 3)]));
  assert.equal(first.packets.length, 0);
  assert.deepEqual([...first.remaining], [0xff, 0xff, 0x01]);
  const second = parseStatusPacketBuffer(concat(first.remaining, packet.slice(3)));
  assert.equal(second.packets.length, 1);
  assert.equal(second.packets[0].id, 1);
  assert.equal(second.remaining.length, 0);
});

test("parser handles multiple packets, garbage, bad checksums, and distinct IDs", () => {
  const first = statusPacket(1);
  const second = statusPacket(2, [0x34, 0x12]);
  const invalid = Uint8Array.from(first);
  invalid[invalid.length - 1] ^= 0x01;
  const parsed = parseStatusPacketBuffer(Uint8Array.from([
    0x00,
    0x7e,
    ...invalid,
    ...first,
    ...second
  ]));
  assert.deepEqual(parsed.packets.map((packet) => packet.id), [1, 2]);
  assert.equal(parsed.checksumErrors.length, 1);
  assert.equal(parsed.remaining.length, 0);
});

test("a timeout on ID 1 cannot consume the valid response for ID 2", async () => {
  const writes: number[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    writes.push(packet[2]);
    if (packet[4] === 0x01 && packet[2] === 2) {
      enqueue(statusPacket(2));
    }
  });
  assert.equal(await client.pingServo(1), false);
  assert.equal(await client.pingServo(2), true);
  assert.deepEqual(writes, [1, 2]);
  await client.disconnect();
});

test("an unexpected servo response cannot satisfy the active ping", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x01 && packet[2] === 1) {
      enqueue(statusPacket(2));
      setTimeout(() => enqueue(statusPacket(1)), 5);
    }
  });
  assert.equal(await client.pingServo(1), true);
  await client.disconnect();
});

test("a ping-shaped response cannot satisfy a position read for the same ID", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(1));
      setTimeout(() => enqueue(statusPacket(1, [0x85, 0x0c])), 5);
    }
  });
  assert.equal(await client.readPosition(1), 3205);
  await client.disconnect();
});

test("a timed-out ping is quarantined before the following position read", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x01) {
      setTimeout(() => enqueue(statusPacket(1)), 510);
    }
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(1, [0x85, 0x0c]));
    }
  });
  assert.equal(await client.pingServo(1), false);
  assert.equal(await client.readPosition(1), 3205);
  await client.disconnect();
});

test("successful Ping and Read Position can alternate without response contamination", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x01) {
      enqueue(statusPacket(packet[2]));
    }
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(packet[2], [0x85, 0x0c]));
    }
  });
  assert.equal(await client.pingServo(1), true);
  assert.equal(await client.readPosition(1), 3205);
  assert.equal(await client.pingServo(1), true);
  assert.equal(await client.readPosition(1), 3205);
  await client.disconnect();
});

test("Detect Motor ID can be followed immediately by a valid position read", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x01 && packet[2] === 1) {
      enqueue(statusPacket(1));
    }
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(1, [0x85, 0x0c]));
    }
  });
  assert.deepEqual(await client.probeServoIds([1, 2, 3, 4, 5]), {
    found: true,
    id: 1,
    method: "ping"
  });
  assert.equal(await client.readPosition(1), 3205);
  await client.disconnect();
});

test("the first request response is not lost when a servo replies immediately", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(packet[2], [0x00, 0x08]));
    }
  });
  assert.equal(await client.readPosition(1), 2048);
  const exchange = client.getLastExchangeDiagnostics();
  assert.equal(exchange?.validPacketCount, 1);
  assert.equal(exchange?.rawRxBytes.length, 8);
  assert.equal(exchange?.timings.sentAt !== null, true);
  assert.equal(exchange?.timings.firstRxByteAt !== null, true);
  assert.equal(exchange?.timings.parsedAt !== null, true);
  assert.equal(exchange?.timings.completedAt !== null, true);
  assert.equal(exchange?.timings.timedOutAt, null);
  await client.disconnect();
});

test("sequential position reads succeed in configured motor order 1 to 5", async () => {
  const packets: number[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet[2]);
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(packet[2], [packet[2], 0x08]));
    }
  });
  const positions = [];
  for (const id of [1, 2, 3, 4, 5]) {
    positions.push(await client.readPosition(id));
  }
  assert.deepEqual(packets, [1, 2, 3, 4, 5]);
  assert.deepEqual(positions, [2049, 2050, 2051, 2052, 2053]);
  await client.disconnect();
});

test("sequential position reads succeed when motor 1 is read last", async () => {
  const packets: number[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet[2]);
    if (packet[4] === 0x02 && packet[5] === 56) {
      enqueue(statusPacket(packet[2], [packet[2], 0x08]));
    }
  });
  const positions = [];
  for (const id of [2, 3, 4, 5, 1]) {
    positions.push(await client.readPosition(id));
  }
  assert.deepEqual(packets, [2, 3, 4, 5, 1]);
  assert.deepEqual(positions, [2050, 2051, 2052, 2053, 2049]);
  await client.disconnect();
});

test("failed pings do not prevent a later canonical Read Position", async () => {
  const client = await connectFakeClient((packet, enqueue) => {
    if (packet[4] === 0x02 && packet[2] === 1) {
      enqueue(statusPacket(1, [0x34, 0x08]));
    }
  });
  assert.equal(await client.pingServo(3), false);
  assert.equal(await client.pingServo(4), false);
  assert.equal(await client.readPosition(1), 2100);
  await client.disconnect();
});

test("model-number and ID-register reads use the canonical read transport", async () => {
  const packets: Uint8Array[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet);
    if (packet[4] === 0x02 && packet[5] === 3) {
      enqueue(statusPacket(1, [0x15, 0x32]));
    }
    if (packet[4] === 0x02 && packet[5] === 5) {
      enqueue(statusPacket(1, [0x01]));
    }
  });
  assert.equal(await client.readServoModelNumber(1), 0x3215);
  assert.equal(await client.readServoIdRegister(1), 1);
  assert.deepEqual(packets.map((packet) => [packet[4], packet[5], packet[6]]), [
    [0x02, 3, 2],
    [0x02, 5, 1]
  ]);
  await client.disconnect();
});

test("probe falls back from ping timeout to a read-only model-number request", async () => {
  const packets: Uint8Array[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet);
    if (packet[4] === 0x02 && packet[5] === 3) {
      enqueue(statusPacket(packet[2], [0x15, 0x32]));
    }
  });
  assert.deepEqual(await client.probeServo(1), {
    found: true,
    id: 1,
    method: "register-read",
    modelNumber: 0x3215
  });
  assert.deepEqual(packets.map((packet) => packet[4]), [0x01, 0x02]);
  assert.ok(packets.every((packet) => packet[4] === 0x01 || (packet[4] === 0x02 && packet[5] === 3)));
  const exchange = client.getLastExchangeDiagnostics();
  assert.equal(exchange?.rawRxBytes.length, 8);
  assert.equal(exchange?.validPacketCount, 1);
  assert.equal(exchange?.lastParsedServoId, 1);
  await client.disconnect();
});

test("sequential probing finishes ping and read fallback before trying the next ID", async () => {
  const packets: Uint8Array[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet);
    if (packet[4] === 0x01 && packet[2] === 2) {
      enqueue(statusPacket(2));
    }
  });
  const progress: number[] = [];
  assert.deepEqual(await client.probeServoIds([1, 2, 3], (id) => progress.push(id)), {
    found: true,
    id: 2,
    method: "ping"
  });
  assert.deepEqual(progress, [1, 2]);
  assert.deepEqual(packets.map((packet) => [packet[2], packet[4], packet[5] ?? null]), [
    [1, 0x01, 0xfb],
    [1, 0x02, 3],
    [2, 0x01, 0xfa]
  ]);
  assert.ok(packets.every((packet) => packet[4] === 0x01 || packet[4] === 0x02));
  await client.disconnect();
});

test("exchange diagnostics distinguish zero RX bytes from invalid RX bytes", async () => {
  let sendInvalid = false;
  const client = await connectFakeClient((_packet, enqueue) => {
    if (sendInvalid) {
      const invalid = statusPacket(1);
      invalid[invalid.length - 1] ^= 1;
      enqueue(invalid);
    }
  });
  assert.equal(await client.pingServo(1), false);
  assert.equal(client.getLastExchangeDiagnostics()?.rawRxBytes.length, 0);
  sendInvalid = true;
  assert.equal(await client.pingServo(1), false);
  const invalidExchange = client.getLastExchangeDiagnostics();
  assert.equal(invalidExchange?.rawRxBytes.length, 6);
  assert.equal(invalidExchange?.validPacketCount, 0);
  assert.equal(invalidExchange?.checksumErrorCount, 1);
  await client.disconnect();
});

test("sequential detection stops at the first response and sends ping packets only", async () => {
  const packets: Uint8Array[] = [];
  const client = await connectFakeClient((packet, enqueue) => {
    packets.push(packet);
    if (packet[2] === 2) {
      enqueue(statusPacket(2));
    }
  });
  const progress: number[] = [];
  const found = await client.scanServoIds((id) => progress.push(id), [1, 2, 3, 4, 5], undefined, true);
  assert.deepEqual(found, [2]);
  assert.deepEqual(progress, [1, 2]);
  assert.ok(packets.every((packet) => packet[3] === 2 && packet[4] === 1));
  await client.disconnect();
});

test("full scan cancellation stops after the active sequential ping", async () => {
  let cancel = false;
  const client = await connectFakeClient(() => undefined);
  const progress: number[] = [];
  const found = await client.scanServoIds(
    (id) => {
      progress.push(id);
      cancel = true;
    },
    [0, 1, 2, 3],
    () => cancel,
    true
  );
  assert.deepEqual(found, []);
  assert.deepEqual(progress, [0]);
  await client.disconnect();
});

test("a writer DOMException aborts Detect without becoming a timeout or register-read fallback", async () => {
  const failure = new DOMException("An unknown system error has occurred.", "NetworkError");
  const packets: Uint8Array[] = [];
  const client = await connectFakeClient((packet) => {
    packets.push(packet);
    throw failure;
  });
  const transportErrors: SerialTransportErrorEvent[] = [];
  client.setTransportErrorListener((event) => {
    transportErrors.push(event);
  });

  await assert.rejects(client.probeServoIds([1, 2, 3]), (error) => error === failure);
  assert.deepEqual(packets.map((packet) => [packet[2], packet[4]]), [[1, 0x01]]);
  assert.equal(transportErrors[0]?.name, "NetworkError");
  assert.equal(transportErrors[0]?.constructorName, "DOMException");
  assert.equal(transportErrors[0]?.operation, "pingServo");
  assert.equal(transportErrors[0]?.servoId, 1);
  assert.equal(transportErrors[0]?.stage, "writer.write");
  assert.equal(client.getTransportHealth().pendingRequestCount, 0);
  assert.equal(client.connected, false);
});

test("DOMException details are preserved instead of being converted to a timeout", () => {
  const failure = new DOMException("The device was lost.", "NotReadableError");
  assert.deepEqual(describeSerialError(failure), {
    name: "NotReadableError",
    message: "The device was lost.",
    constructorName: "DOMException",
    stack: failure.stack ?? null
  });
  assert.equal(formatSerialError(failure), "NotReadableError: The device was lost.");
});

test("the persistent reader and writer locks are released and replaced on reconnect", async () => {
  const writes: number[][] = [[], []];
  const ports = writes.map((sessionWrites) => createFakePort((packet, enqueue) => {
    sessionWrites.push(packet[2]);
    enqueue(statusPacket(packet[2]));
  }));
  let requestedPort = 0;
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  Object.defineProperty(globalThis, "navigator", {
    value: { serial: { requestPort: async () => ports[requestedPort++] } },
    configurable: true
  });
  const client = new ScsServoClient();

  await client.connect(115200);
  assert.equal(ports[0].readable.locked, true);
  assert.equal(ports[0].writable.locked, true);
  assert.throws(() => ports[0].readable.getReader(), TypeError);
  assert.equal(await client.pingServo(1), true);
  await client.disconnect();
  assert.equal(ports[0].readable.locked, false);
  assert.equal(ports[0].writable.locked, false);

  await client.connect(115200);
  assert.equal(client.getTransportHealth().sessionId, 2);
  assert.equal(await client.pingServo(2), true);
  assert.deepEqual(writes, [[1], [2]]);
  await client.disconnect();
});

test("reconnect waits for fatal cleanup and never reuses the failed writer", async () => {
  const failure = new DOMException("The device was lost.", "NotReadableError");
  const firstWrites: number[] = [];
  const secondWrites: number[] = [];
  const ports = [
    createFakePort((packet) => {
      firstWrites.push(packet[2]);
      throw failure;
    }),
    createFakePort((packet, enqueue) => {
      secondWrites.push(packet[2]);
      enqueue(statusPacket(packet[2]));
    })
  ];
  let requestedPort = 0;
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  Object.defineProperty(globalThis, "navigator", {
    value: { serial: { requestPort: async () => ports[requestedPort++] } },
    configurable: true
  });
  const client = new ScsServoClient();

  await client.connect(115200);
  await assert.rejects(client.pingServo(1), (error) => error === failure);
  await client.connect(115200);
  assert.equal(client.getTransportHealth().sessionId, 2);
  assert.equal(await client.pingServo(2), true);
  assert.deepEqual(firstWrites, [1]);
  assert.deepEqual(secondWrites, [2]);
  await client.disconnect();
});

test("repeated Detect calls reuse one stream pair and do not leak waiters", async () => {
  const client = await connectFakeClient((packet, enqueue) => enqueue(statusPacket(packet[2])));
  for (let attempt = 0; attempt < 10; attempt += 1) {
    assert.deepEqual(await client.probeServoIds([1, 2, 3]), {
      found: true,
      id: 1,
      method: "ping"
    });
    assert.equal(client.getTransportHealth().pendingRequestCount, 0);
  }
  assert.equal(client.getTransportHealth().readerLoopActive, true);
  assert.equal(client.getTransportHealth().writerAvailable, true);
  await client.disconnect();
});

