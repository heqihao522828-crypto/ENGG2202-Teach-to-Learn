const INST_PING = 0x01;
const INST_READ = 0x02;
const INST_WRITE = 0x03;

export const SMS_STS_TORQUE_ENABLE = 40;
export const SMS_STS_MODE = 33;
export const SMS_STS_SERVO_MODE = 0;
export const SMS_STS_CALIBRATE_MIDDLE = 128;
const ADDR_ACC = 41;
const ADDR_PRESENT_POSITION_L = 56;
const ADDR_PRESENT_SPEED_L = 58;
const ADDR_MOVING = 66;

// Waveshare ST3215 uses the Feetech SMS_STS register map.
export const SMS_STS_MODEL_L = 3;
export const SMS_STS_MODEL_H = 4;
export const SMS_STS_ID = 5;
export const SMS_STS_LOCK = 55;
export const SMS_STS_MIN_SERVO_ID = 0;
export const SMS_STS_MAX_SERVO_ID = 253;
export const SMS_STS_MIN_POSITION = 0;
export const SMS_STS_MAX_POSITION = 4095;
export const SMS_STS_NATIVE_MIDDLE = 2048;

const DEFAULT_TIMEOUT_MS = 250;
const PING_TIMEOUT_MS = 500;
const POST_TIMEOUT_RX_QUIET_MS = 50;

export const PREFERRED_SERIAL_BUFFER_SIZE = 8192;
export const SERIAL_BUFFER_SIZE_FALLBACKS = [PREFERRED_SERIAL_BUFFER_SIZE, 4096, 1024] as const;
const MAX_OVERRUN_RECOVERIES = 3;
const OVERRUN_WINDOW_MS = 10_000;
const MAX_COMMAND_QUEUE_LENGTH = 32;
const READABLE_RECOVERY_ATTEMPTS = 5;
const READABLE_RECOVERY_DELAY_MS = 20;
const MAX_PENDING_LISTENER_EVENTS = 512;

export interface SerialTrafficEvent {
  direction: "tx" | "rx";
  bytes: Uint8Array;
}

export type ServoDiagnosticEvent =
  | { kind: "ping-tx"; id: number; bytes: Uint8Array }
  | { kind: "packet-rx"; id: number; bytes: Uint8Array }
  | { kind: "ping-success"; id: number }
  | { kind: "ping-timeout"; id: number }
  | { kind: "response-timeout"; id: number; instruction: number }
  | { kind: "position-decoded"; id: number; rawPosition: number; bytes: Uint8Array }
  | { kind: "checksum-error"; bytes: Uint8Array }
  | { kind: "unexpected-id"; id: number }
  | { kind: "unexpected-response-shape"; id: number; expectedParams: number; actualParams: number }
  | { kind: "serial-opened"; baudRate: number; bufferSize: number }
  | { kind: "rx-overrun-detected" }
  | { kind: "rx-overrun-recovered" }
  | { kind: "transport-stage"; operation: string; servoId: number | null; stage: string; health: SerialTransportHealth };

export type SerialTransportHealth = {
  sessionId: number;
  portReadable: boolean;
  portWritable: boolean;
  readerLoopActive: boolean;
  readerAvailable: boolean;
  writerAvailable: boolean;
  pendingRequestCount: number;
  queueLength: number;
  activeCommand: boolean;
  maxCommandQueueDepth: number;
  rxBytesTotal: number;
  rxPacketsParsed: number;
  bufferOverruns: number;
  successfulOverrunRecoveries: number;
  failedOverrunRecoveries: number;
  configuredBufferSize: number | null;
  recoveringReadStream: boolean;
  closing: boolean;
};

export type SerialErrorDescription = {
  name: string;
  message: string;
  constructorName: string;
  stack: string | null;
};

export type SerialTransportErrorEvent = SerialErrorDescription & {
  error: unknown;
  operation: string;
  servoId: number | null;
  stage: string;
  timestamp: string;
  fatal: boolean;
  health: SerialTransportHealth;
};

export type ServoExchangeDiagnostics = {
  txPacket: Uint8Array;
  rawRxBytes: Uint8Array;
  validPacketCount: number;
  checksumErrorCount: number;
  unexpectedPacketIds: number[];
  lastParsedServoId: number | null;
  timings: {
    queuedAt: number;
    sentAt: number | null;
    firstRxByteAt: number | null;
    parsedAt: number | null;
    completedAt: number | null;
    timedOutAt: number | null;
  };
};

export type ServoProbeResult =
  | { found: true; id: number; method: "ping" }
  | { found: true; id: number; method: "register-read"; modelNumber: number }
  | { found: false; id: number };

type TrafficListener = (event: SerialTrafficEvent) => void;
type DiagnosticListener = (event: ServoDiagnosticEvent) => void;
type TransportErrorListener = (event: SerialTransportErrorEvent) => void;

export type StatusPacket = {
  id: number;
  error: number;
  params: number[];
  bytes: Uint8Array;
};

type PendingServoRequest = {
  kind: "ping" | "read" | "write";
  expectedIds: readonly number[];
  expectedParameterCount: number;
};

export type MotorIdWriteStage =
  | "checking-current"
  | "checking-destination"
  | "unlocking"
  | "writing-id"
  | "locking"
  | "verifying";

export type MotorIdWriteResult = { changed: boolean; verifiedId: number };

export class ServoTimeoutError extends Error {
  constructor(ids: readonly number[]) {
    super(`Serial read timeout waiting for servo ${ids.join(" or ")}.`);
    this.name = "ServoTimeoutError";
  }
}

function loByte(value: number): number {
  return value & 0xff;
}

function hiByte(value: number): number {
  return (value >> 8) & 0xff;
}

function checksum(bytes: number[]): number {
  let sum = 0;
  for (let index = 2; index < bytes.length - 1; index += 1) {
    sum += bytes[index];
  }
  return (~sum) & 0xff;
}

function monotonicNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function buildPacket(id: number, instruction: number, params: number[]): Uint8Array {
  const length = params.length + 2;
  const packet = [0xff, 0xff, id, length, instruction, ...params, 0x00];
  packet[packet.length - 1] = checksum(packet);
  return new Uint8Array(packet);
}

export function buildPingPacket(id: number): Uint8Array {
  validateNormalServoId(id);
  return buildPacket(id, INST_PING, []);
}

export function buildWritePositionPacket(
  id: number,
  position: number,
  speed: number,
  acc: number
): Uint8Array {
  validateNormalServoId(id);
  validateIntegerRange(position, SMS_STS_MIN_POSITION, SMS_STS_MAX_POSITION, "Goal position");
  validateIntegerRange(speed, 0, 4095, "Speed");
  validateIntegerRange(acc, 0, 255, "Acceleration");
  return buildPacket(id, INST_WRITE, [
    ADDR_ACC,
    acc,
    loByte(position),
    hiByte(position),
    0,
    0,
    loByte(speed),
    hiByte(speed)
  ]);
}

export class SerialReceiveOverrunError extends Error {
  constructor() {
    super("Servo response lost due to serial receive overrun.");
    this.name = "SerialReceiveOverrunError";
  }
}

export function isBufferOverrunError(error: unknown): boolean {
  return describeSerialError(error).name === "BufferOverrunError";
}

export function isBufferSizeOptionError(error: unknown): boolean {
  const detail = describeSerialError(error);
  return (detail.name === "TypeError" || detail.name === "RangeError") && /buffer\s*size|buffersize/i.test(detail.message);
}

export function describeSerialError(error: unknown): SerialErrorDescription {
  const candidate = typeof error === "object" && error !== null
    ? error as { name?: unknown; message?: unknown; stack?: unknown; constructor?: { name?: unknown } }
    : null;
  const name = typeof candidate?.name === "string" && candidate.name.length > 0
    ? candidate.name
    : "UnknownError";
  const message = typeof candidate?.message === "string" && candidate.message.length > 0
    ? candidate.message
    : String(error);
  const constructorName = typeof candidate?.constructor?.name === "string" && candidate.constructor.name.length > 0
    ? candidate.constructor.name
    : typeof error;
  return {
    name,
    message,
    constructorName,
    stack: typeof candidate?.stack === "string" && candidate.stack.length > 0 ? candidate.stack : null
  };
}

export function formatSerialError(error: unknown): string {
  const detail = describeSerialError(error);
  return detail.name === "Error" ? detail.message : `${detail.name}: ${detail.message}`;
}

/** Exact FTServo SMS_STS::CalibrationOfs packet: write 128 to torque-enable (40). */
export function buildCalibrationOfsPacket(id: number): Uint8Array {
  validateNormalServoId(id);
  return buildPacket(id, INST_WRITE, [SMS_STS_TORQUE_ENABLE, SMS_STS_CALIBRATE_MIDDLE]);
}

export type DecodedWritePositionPacket = {
  id: number;
  rawPosition: number;
  speed: number;
  acceleration: number;
  goalBytes: Uint8Array;
};

export function decodeWritePositionPacket(packet: Uint8Array): DecodedWritePositionPacket | null {
  if (
    packet.length !== 14 || packet[0] !== 0xff || packet[1] !== 0xff ||
    packet[3] !== 0x0a || packet[4] !== INST_WRITE || packet[5] !== ADDR_ACC
  ) {
    return null;
  }
  const decoded = {
    id: packet[2],
    acceleration: packet[6],
    rawPosition: packet[7] | (packet[8] << 8),
    speed: packet[11] | (packet[12] << 8),
    goalBytes: Uint8Array.from(packet.slice(7, 9))
  };
  validateNormalServoId(decoded.id);
  validateIntegerRange(decoded.rawPosition, SMS_STS_MIN_POSITION, SMS_STS_MAX_POSITION, "Goal position");
  return decoded;
}

function decodeSignedMagnitude15(lowByte: number, highByte: number): number {
  const value = lowByte | (highByte << 8);
  return (value & 0x8000) !== 0 ? -(value & 0x7fff) : value;
}

export type ServoMotionFeedback = {
  presentSpeed: number;
  moving: boolean;
};

export function parseStatusPacketBuffer(bytes: Uint8Array): {
  packets: StatusPacket[];
  remaining: Uint8Array;
  checksumErrors: Uint8Array[];
} {
  let buffer = Uint8Array.from(bytes);
  const packets: StatusPacket[] = [];
  const checksumErrors: Uint8Array[] = [];

  while (buffer.length > 0) {
    let header = -1;
    for (let index = 0; index + 1 < buffer.length; index += 1) {
      if (buffer[index] === 0xff && buffer[index + 1] === 0xff) {
        header = index;
        break;
      }
    }
    if (header < 0) {
      buffer = buffer[buffer.length - 1] === 0xff
        ? buffer.slice(buffer.length - 1)
        : new Uint8Array(0);
      break;
    }
    if (header > 0) {
      buffer = buffer.slice(header);
    }
    if (buffer.length < 4) {
      break;
    }
    const length = buffer[3];
    if (length < 2) {
      buffer = buffer.slice(1);
      continue;
    }
    const packetLength = length + 4;
    if (buffer.length < packetLength) {
      break;
    }
    const packetBytes = Uint8Array.from(buffer.slice(0, packetLength));
    if (packetBytes[packetLength - 1] !== checksum([...packetBytes])) {
      checksumErrors.push(packetBytes);
      buffer = buffer.slice(1);
      continue;
    }
    packets.push({
      id: packetBytes[2],
      error: packetBytes[4],
      params: Array.from(packetBytes.slice(5, packetLength - 1)),
      bytes: packetBytes
    });
    buffer = buffer.slice(packetLength);
  }
  return { packets, remaining: buffer, checksumErrors };
}

export function decodeRawServoPosition(lowByte: number, highByte: number): number {
  if (
    !Number.isInteger(lowByte) || lowByte < 0 || lowByte > 0xff ||
    !Number.isInteger(highByte) || highByte < 0 || highByte > 0xff
  ) {
    throw new Error("Position response bytes must be unsigned byte values.");
  }
  // ST3215 present-position registers 56/57 are returned low byte first.
  const rawPosition = lowByte | (highByte << 8);
  if (rawPosition < SMS_STS_MIN_POSITION || rawPosition > SMS_STS_MAX_POSITION) {
    throw new Error(
      `Decoded raw servo position ${rawPosition} is outside ${SMS_STS_MIN_POSITION}–${SMS_STS_MAX_POSITION}.`
    );
  }
  return rawPosition;
}

export class ScsServoClient {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>> | null = null;
  private rxBuffer: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
  private trafficListener: TrafficListener | null = null;
  private diagnosticListener: DiagnosticListener | null = null;
  private transportErrorListener: TransportErrorListener | null = null;
  private readLoopPromise: Promise<void> | null = null;
  private readerLoopActive = false;
  private closing = false;
  private commandTail: Promise<void> = Promise.resolve();
  private queueLength = 0;
  private maxCommandQueueDepth = 0;
  private statusWaiter: {
    request: PendingServoRequest;
    resolve: (packet: StatusPacket) => void;
    reject: (error: Error) => void;
    timer: number;
  } | null = null;
  private activeExchange: ServoExchangeDiagnostics | null = null;
  private lastExchange: ServoExchangeDiagnostics | null = null;
  private responseQuarantineUntil = 0;
  private activeCommandQueuedAt: number | null = null;
  private sessionId = 0;
  private readerSessionId = 0;
  private writerSessionId = 0;
  private failedSessionId = 0;
  private disconnectInFlight: Promise<void> | null = null;
  private configuredBufferSize: number | null = null;
  private rxBytesTotal = 0;
  private rxPacketsParsed = 0;
  private bufferOverruns = 0;
  private successfulOverrunRecoveries = 0;
  private failedOverrunRecoveries = 0;
  private recentOverruns: number[] = [];
  private recoveringReadStream = false;
  private recoveryPromise: Promise<void> | null = null;
  private resolveRecovery: (() => void) | null = null;
  private rejectRecovery: ((error: Error) => void) | null = null;
  private pendingListenerEvents: Array<
    { type: "traffic"; event: SerialTrafficEvent } |
    { type: "diagnostic"; event: ServoDiagnosticEvent }
  > = [];
  private listenerFlushTimer: ReturnType<typeof setTimeout> | null = null;

  get connected(): boolean {
    return this.port !== null && (this.reader !== null || this.recoveringReadStream) &&
      this.writer !== null && !this.closing;
  }

  setTrafficListener(listener: TrafficListener | null): void {
    this.trafficListener = listener;
  }

  setDiagnosticListener(listener: DiagnosticListener | null): void {
    this.diagnosticListener = listener;
  }

  setTransportErrorListener(listener: TransportErrorListener | null): void {
    this.transportErrorListener = listener;
  }

  getTransportHealth(): SerialTransportHealth {
    return {
      sessionId: this.sessionId,
      portReadable: this.port?.readable !== null && this.port?.readable !== undefined,
      portWritable: this.port?.writable !== null && this.port?.writable !== undefined,
      readerLoopActive: this.readerLoopActive,
      readerAvailable: this.reader !== null && this.readerSessionId === this.sessionId,
      writerAvailable: this.writer !== null && this.writerSessionId === this.sessionId,
      pendingRequestCount: this.statusWaiter ? 1 : 0,
      queueLength: this.queueLength,
      activeCommand: this.activeCommandQueuedAt !== null,
      maxCommandQueueDepth: this.maxCommandQueueDepth,
      rxBytesTotal: this.rxBytesTotal,
      rxPacketsParsed: this.rxPacketsParsed,
      bufferOverruns: this.bufferOverruns,
      successfulOverrunRecoveries: this.successfulOverrunRecoveries,
      failedOverrunRecoveries: this.failedOverrunRecoveries,
      configuredBufferSize: this.configuredBufferSize,
      recoveringReadStream: this.recoveringReadStream,
      closing: this.closing
    };
  }

  getLastExchangeDiagnostics(): ServoExchangeDiagnostics | null {
    return this.lastExchange ? cloneExchange(this.lastExchange) : null;
  }

  async connect(baudRate: number): Promise<void> {
    if (!navigator.serial) {
      throw new Error("Web Serial is not available in this browser.");
    }
    if (this.disconnectInFlight) {
      await this.disconnectInFlight;
    }
    if (this.port) {
      throw new Error("A serial port is already open.");
    }

    const nextSessionId = this.sessionId + 1;
    let port: SerialPort | null = null;
    let reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>> | null = null;
    let writer: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>> | null = null;
    try {
      port = await navigator.serial.requestPort();
      this.configuredBufferSize = await this.openWithBufferFallback(port, baudRate);
      reader = port.readable?.getReader() ?? null;
      writer = port.writable?.getWriter() ?? null;
      if (!reader || !writer) {
        throw new Error("Cannot access serial read/write streams.");
      }
    } catch (error) {
      this.configuredBufferSize = null;
      try {
        reader?.releaseLock();
      } catch {
        // Preserve the original connection error.
      }
      try {
        writer?.releaseLock();
      } catch {
        // Preserve the original connection error.
      }
      try {
        await port?.close();
      } catch {
        // Preserve the original connection error.
      }
      this.emitTransportError(error, "connect", null, "open/acquire stream locks", true);
      throw error;
    }

    this.sessionId = nextSessionId;
    this.failedSessionId = 0;
    this.rxBytesTotal = 0;
    this.rxPacketsParsed = 0;
    this.bufferOverruns = 0;
    this.successfulOverrunRecoveries = 0;
    this.failedOverrunRecoveries = 0;
    this.maxCommandQueueDepth = 0;
    this.port = port;
    this.reader = reader;
    this.writer = writer;
    this.readerSessionId = nextSessionId;
    this.writerSessionId = nextSessionId;
    this.closing = false;
    this.rxBuffer = new Uint8Array(0);
    this.recentOverruns = [];
    this.recoveringReadStream = false;
    this.readerLoopActive = true;
    this.readLoopPromise = this.runReadLoop(reader, nextSessionId);
    this.emitDiagnostic({ kind: "serial-opened", baudRate, bufferSize: this.configuredBufferSize });
    this.emitTransportStage("connect", null, "reader loop started");
  }

  private async openWithBufferFallback(port: SerialPort, baudRate: number): Promise<number> {
    for (let index = 0; index < SERIAL_BUFFER_SIZE_FALLBACKS.length; index += 1) {
      const bufferSize = SERIAL_BUFFER_SIZE_FALLBACKS[index];
      try {
        await port.open({
          baudRate,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
          flowControl: "none",
          bufferSize
        });
        return bufferSize;
      } catch (error) {
        const hasFallback = index + 1 < SERIAL_BUFFER_SIZE_FALLBACKS.length;
        if (!hasFallback || !isBufferSizeOptionError(error)) {
          throw error;
        }
      }
    }
    throw new Error("No supported Web Serial buffer size was found.");
  }

  async disconnect(): Promise<void> {
    if (this.disconnectInFlight) {
      return this.disconnectInFlight;
    }
    const cleanup = this.disconnectTransport();
    this.disconnectInFlight = cleanup;
    try {
      await cleanup;
    } finally {
      if (this.disconnectInFlight === cleanup) {
        this.disconnectInFlight = null;
      }
    }
  }

  private async disconnectTransport(): Promise<void> {
    this.closing = true;
    this.rejectStatusWaiter(new Error("Serial input stream closed."));
    const reader = this.reader;
    const writer = this.writer;
    const port = this.port;
    const readLoopPromise = this.readLoopPromise;
    this.reader = null;
    this.writer = null;
    this.port = null;
    this.readerSessionId = 0;
    this.writerSessionId = 0;
    this.finishRecovery(new Error("Serial input stream closed."));

    if (reader) {
      try {
        await reader.cancel();
      } catch {
        // Ignore cancellation errors on close.
      }
      try {
        await readLoopPromise;
      } catch {
        // The read-loop error was already sent to the active command.
      }
      try {
        reader.releaseLock();
      } catch {
        // A failed stream can already have released its lock.
      }
    }
    this.readLoopPromise = null;
    this.readerLoopActive = false;

    if (writer) {
      try {
        writer.releaseLock();
      } catch {
        // A failed stream can already have released its lock.
      }
    }
    let closeError: unknown = null;
    try {
      if (port) {
        await port.close();
      }
    } catch (error) {
      closeError = error;
    } finally {
      this.rxBuffer = new Uint8Array(0);
      this.activeExchange = null;
      this.responseQuarantineUntil = 0;
      this.commandTail = Promise.resolve();
      this.queueLength = 0;
      this.activeCommandQueuedAt = null;
      this.configuredBufferSize = null;
      this.recentOverruns = [];
      this.recoveringReadStream = false;
      this.pendingListenerEvents = [];
      if (this.listenerFlushTimer !== null) {
        clearTimeout(this.listenerFlushTimer);
        this.listenerFlushTimer = null;
      }
    }
    if (closeError !== null) {
      throw closeError;
    }
  }

  async ping(id: number): Promise<number> {
    if (!await this.pingServo(id)) {
      throw new ServoTimeoutError([id]);
    }
    return id;
  }

  async pingServo(id: number): Promise<boolean> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const packet = buildPingPacket(id);
      this.emitDiagnostic({ kind: "ping-tx", id, bytes: Uint8Array.from(packet) });
      try {
        const response = await this.requestStatus(packet, [id], PING_TIMEOUT_MS);
        this.emitDiagnostic({ kind: "ping-success", id: response.id });
        return response.id === id;
      } catch (error) {
        if (error instanceof ServoTimeoutError) {
          this.emitDiagnostic({ kind: "ping-timeout", id });
          return false;
        }
        throw error;
      }
    });
  }

  async tryPing(id: number): Promise<boolean> {
    return this.pingServo(id);
  }

  async scanServoIds(
    onProgress?: (id: number) => void,
    ids: readonly number[] = Array.from(
      { length: SMS_STS_MAX_SERVO_ID - SMS_STS_MIN_SERVO_ID + 1 },
      (_, index) => index + SMS_STS_MIN_SERVO_ID
    ),
    shouldCancel?: () => boolean,
    stopAfterFirst = false
  ): Promise<number[]> {
    const found: number[] = [];
    for (const id of ids) {
      if (shouldCancel?.()) {
        break;
      }
      onProgress?.(id);
      if (await this.pingServo(id)) {
        found.push(id);
        if (stopAfterFirst) {
          break;
        }
      }
      if (shouldCancel?.()) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return found;
  }

  async probeServo(id: number): Promise<ServoProbeResult> {
    validateNormalServoId(id);
    if (await this.pingServo(id)) {
      return { found: true, id, method: "ping" };
    }
    try {
      const modelNumber = await this.readServoModelNumber(id);
      return { found: true, id, method: "register-read", modelNumber };
    } catch (error) {
      if (error instanceof ServoTimeoutError) {
        return { found: false, id };
      }
      throw error;
    }
  }

  async probeServoIds(
    ids: readonly number[],
    onProgress?: (id: number) => void,
    shouldCancel?: () => boolean
  ): Promise<ServoProbeResult | null> {
    for (const id of ids) {
      if (shouldCancel?.()) {
        break;
      }
      onProgress?.(id);
      const result = await this.probeServo(id);
      if (result.found) {
        return result;
      }
      if (shouldCancel?.()) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return null;
  }

  async unlockServoEeprom(id: number): Promise<void> {
    await this.writeRegisterByte(id, SMS_STS_LOCK, 0);
  }

  async writeServoId(currentId: number, newId: number): Promise<void> {
    validateNormalServoId(currentId);
    validateNormalServoId(newId);
    await this.enqueueCommand(async () => {
      await this.requestStatus(
        buildPacket(currentId, INST_WRITE, [SMS_STS_ID, newId]),
        [currentId, newId]
      );
    });
  }

  async lockServoEeprom(id: number): Promise<void> {
    await this.writeRegisterByte(id, SMS_STS_LOCK, 1);
  }

  async changeAndVerifyServoId(
    currentId: number,
    newId: number,
    onStage?: (stage: MotorIdWriteStage) => void
  ): Promise<MotorIdWriteResult> {
    validateNormalServoId(currentId);
    validateNormalServoId(newId);

    onStage?.("checking-current");
    await this.ping(currentId);
    if (newId === currentId) {
      return { changed: false, verifiedId: currentId };
    }

    onStage?.("checking-destination");
    if (await this.pingServo(newId)) {
      throw new Error(`Destination ID ${newId} is already in use.`);
    }

    let idMayHaveChanged = false;
    try {
      onStage?.("unlocking");
      await this.unlockServoEeprom(currentId);

      onStage?.("writing-id");
      idMayHaveChanged = true;
      await this.writeServoId(currentId, newId);

      onStage?.("locking");
      await this.lockServoEeprom(newId);

      onStage?.("verifying");
      const verifiedId = await this.ping(newId);
      if (verifiedId !== newId) {
        throw new Error(`Verification returned servo ID ${verifiedId}, expected ${newId}.`);
      }
      return { changed: true, verifiedId };
    } catch (error) {
      if (idMayHaveChanged) {
        try {
          await this.lockServoEeprom(newId);
        } catch {
          try {
            await this.lockServoEeprom(currentId);
          } catch {
            // Preserve the original stage error.
          }
        }
      } else {
        try {
          await this.lockServoEeprom(currentId);
        } catch {
          // Preserve the original stage error.
        }
      }
      throw error;
    }
  }

  async setTorque(id: number, enabled: boolean): Promise<void> {
    validateNormalServoId(id);
    await this.enqueueCommand(async () => {
      await this.requestStatus(
        buildPacket(id, INST_WRITE, [SMS_STS_TORQUE_ENABLE, enabled ? 1 : 0]),
        [id]
      );
    });
  }

  async readTorqueState(id: number): Promise<number> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const response = await this.requestRegisterRead(id, SMS_STS_TORQUE_ENABLE, 1);
      return response.params[0];
    });
  }

  async readServoMode(id: number): Promise<number> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const response = await this.requestRegisterRead(id, SMS_STS_MODE, 1);
      return response.params[0];
    });
  }

  async calibrationOfs(id: number): Promise<void> {
    const packet = buildCalibrationOfsPacket(id);
    await this.enqueueCommand(async () => {
      await this.requestStatus(packet, [id]);
    });
  }

  async writePosEx(id: number, position: number, speed: number, acc: number): Promise<void> {
    const packet = buildWritePositionPacket(id, position, speed, acc);
    await this.enqueueCommand(async () => {
      await this.requestStatus(packet, [id]);
    });
  }

  async writePosExNoStatus(id: number, position: number, speed: number, acc: number): Promise<void> {
    const packet = buildWritePositionPacket(id, position, speed, acc);
    await this.enqueueCommand(async () => {
      // Diagnostic motion deliberately sends once without treating a missing WRITE
      // status response as grounds to retry the physical command.
      await this.finishResponseQuarantine();
      await this.writePacket(packet, "writePosExNoStatus", id);
    });
  }

  async readPosition(id: number): Promise<number> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const response = await this.requestRegisterRead(id, ADDR_PRESENT_POSITION_L, 2);
      const rawPosition = decodeRawServoPosition(response.params[0], response.params[1]);
      this.emitDiagnostic({
        kind: "position-decoded",
        id,
        rawPosition,
        bytes: Uint8Array.from(response.bytes)
      });
      return rawPosition;
    });
  }

  async readMotionFeedback(id: number): Promise<ServoMotionFeedback> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      // Speed is at 58/59 and Moving is at 66 in the SMS_STS register map.
      // Reading the contiguous range is read-only and gives one coherent snapshot.
      const response = await this.requestRegisterRead(id, ADDR_PRESENT_SPEED_L, ADDR_MOVING - ADDR_PRESENT_SPEED_L + 1);
      return {
        presentSpeed: decodeSignedMagnitude15(response.params[0], response.params[1]),
        moving: response.params[ADDR_MOVING - ADDR_PRESENT_SPEED_L] !== 0
      };
    });
  }

  async readServoModelNumber(id: number): Promise<number> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const response = await this.requestRegisterRead(id, SMS_STS_MODEL_L, 2);
      return response.params[0] | (response.params[1] << 8);
    });
  }

  async readServoIdRegister(id: number): Promise<number> {
    validateNormalServoId(id);
    return this.enqueueCommand(async () => {
      const response = await this.requestRegisterRead(id, SMS_STS_ID, 1);
      return response.params[0];
    });
  }

  private async writeRegisterByte(id: number, address: number, value: number): Promise<void> {
    validateNormalServoId(id);
    await this.enqueueCommand(async () => {
      await this.requestStatus(buildPacket(id, INST_WRITE, [address, value]), [id]);
    });
  }

  private async requestRegisterRead(id: number, address: number, length: number): Promise<StatusPacket> {
    const response = await this.requestStatus(
      buildPacket(id, INST_READ, [address, length]),
      [id]
    );
    if (response.params.length < length) {
      throw new Error(`Register response returned ${response.params.length} byte(s); expected ${length}.`);
    }
    return response;
  }

  private enqueueCommand<T>(operation: () => Promise<T>): Promise<T> {
    if (this.queueLength >= MAX_COMMAND_QUEUE_LENGTH) {
      return Promise.reject(new Error(`Serial command queue is full (${MAX_COMMAND_QUEUE_LENGTH} commands).`));
    }
    const queuedAt = monotonicNow();
    this.queueLength += 1;
    this.maxCommandQueueDepth = Math.max(this.maxCommandQueueDepth, this.queueLength);
    const run = async () => {
      this.activeCommandQueuedAt = queuedAt;
      try {
        if (this.recoveryPromise) {
          await this.recoveryPromise;
        }
        return await operation();
      } finally {
        this.activeCommandQueuedAt = null;
        this.queueLength = Math.max(0, this.queueLength - 1);
      }
    };
    const result = this.commandTail.then(run, run);
    this.commandTail = result.then(() => undefined, () => undefined);
    return result;
  }

  private async requestStatus(
    packet: Uint8Array,
    expectedIds: readonly number[],
    timeoutMs = DEFAULT_TIMEOUT_MS
  ): Promise<StatusPacket> {
    if (this.recoveryPromise) {
      await this.recoveryPromise;
    }
    await this.finishResponseQuarantine();
    const request = pendingRequestFromPacket(packet, expectedIds);
    const operation = request.kind === "ping" ? "pingServo" : request.kind === "read" ? "readRegister" : "writeRegister";
    const servoId = expectedIds[0] ?? null;
    this.assertTransportHealthy(operation, servoId, "preflight");
    const exchange: ServoExchangeDiagnostics = {
      txPacket: Uint8Array.from(packet),
      rawRxBytes: new Uint8Array(0),
      validPacketCount: 0,
      checksumErrorCount: 0,
      unexpectedPacketIds: [],
      lastParsedServoId: null,
      timings: {
        queuedAt: this.activeCommandQueuedAt ?? monotonicNow(),
        sentAt: null,
        firstRxByteAt: null,
        parsedAt: null,
        completedAt: null,
        timedOutAt: null
      }
    };
    this.activeExchange = exchange;
    let response: Promise<StatusPacket>;
    try {
      this.emitTransportStage(operation, servoId, "register waiter");
      try {
        response = this.waitForStatus(request, timeoutMs);
      } catch (error) {
        this.handleTransportFailure(error, operation, servoId, "register waiter");
        throw error;
      }
      this.emitTransportStage(operation, servoId, "waiter registered");
      try {
        await this.writePacket(packet, operation, servoId);
      } catch (error) {
        this.rejectStatusWaiter(toError(error));
        try {
          await response;
        } catch {
          // Consume the waiter rejection before preserving the write error.
        }
        throw error;
      }
      this.emitTransportStage(operation, servoId, "waiting response");
      try {
        const status = await response;
        this.emitTransportStage(operation, servoId, "response received");
        return status;
      } catch (error) {
        if (error instanceof ServoTimeoutError) {
          exchange.timings.timedOutAt = monotonicNow();
          this.emitDiagnostic({
            kind: "response-timeout",
            id: expectedIds[0],
            instruction: packet[4]
          });
          this.emitTransportStage(operation, servoId, "response timeout");
        }
        throw error;
      }
    } finally {
      if (exchange.timings.completedAt === null && exchange.timings.timedOutAt === null) {
        exchange.timings.completedAt = monotonicNow();
      }
      this.lastExchange = cloneExchange(exchange);
      if (this.activeExchange === exchange) {
        this.activeExchange = null;
      }
    }
  }

  private waitForStatus(request: PendingServoRequest, timeoutMs: number): Promise<StatusPacket> {
    if (this.statusWaiter) {
      throw new Error("A servo response waiter is already active.");
    }
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        if (this.statusWaiter?.timer !== timer) {
          return;
        }
        this.statusWaiter = null;
        this.responseQuarantineUntil = Date.now() + POST_TIMEOUT_RX_QUIET_MS;
        reject(new ServoTimeoutError(request.expectedIds));
      }, timeoutMs);
      this.statusWaiter = { request, resolve, reject, timer };
    });
  }

  private async finishResponseQuarantine(): Promise<void> {
    const remaining = this.responseQuarantineUntil - Date.now();
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    if (this.responseQuarantineUntil > 0) {
      // Any incomplete bytes left after a timed-out request belong to that stale exchange.
      this.rxBuffer = new Uint8Array(0);
      this.responseQuarantineUntil = 0;
    }
  }

  private rejectStatusWaiter(error: Error): void {
    const waiter = this.statusWaiter;
    if (!waiter) {
      return;
    }
    window.clearTimeout(waiter.timer);
    this.statusWaiter = null;
    waiter.reject(error);
  }

  private dispatchStatus(packet: StatusPacket): void {
    this.emitDiagnostic({ kind: "packet-rx", id: packet.id, bytes: Uint8Array.from(packet.bytes) });
    if (this.activeExchange) {
      this.activeExchange.validPacketCount += 1;
      this.activeExchange.lastParsedServoId = packet.id;
      this.activeExchange.timings.parsedAt = monotonicNow();
    }
    const waiter = this.statusWaiter;
    if (!waiter || !waiter.request.expectedIds.includes(packet.id)) {
      this.activeExchange?.unexpectedPacketIds.push(packet.id);
      this.emitDiagnostic({ kind: "unexpected-id", id: packet.id });
      return;
    }
    if (packet.error !== 0) {
      window.clearTimeout(waiter.timer);
      this.statusWaiter = null;
      waiter.reject(new Error(`Servo ${packet.id} error code: ${packet.error}`));
      return;
    }
    if (packet.params.length !== waiter.request.expectedParameterCount) {
      this.emitDiagnostic({
        kind: "unexpected-response-shape",
        id: packet.id,
        expectedParams: waiter.request.expectedParameterCount,
        actualParams: packet.params.length
      });
      return;
    }
    window.clearTimeout(waiter.timer);
    this.statusWaiter = null;
    waiter.resolve(packet);
  }

  private async runReadLoop(
    initialReader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
    sessionId: number
  ): Promise<void> {
    let reader = initialReader;
    try {
      while (!this.closing && sessionId === this.sessionId) {
        let result: ReadableStreamReadResult<Uint8Array<ArrayBufferLike>>;
        try {
          result = await reader.read();
        } catch (error) {
          if (!isBufferOverrunError(error) || this.closing) {
            throw error;
          }
          reader = await this.recoverFromBufferOverrun(reader, sessionId);
          continue;
        }
        if (result.done) {
          if (!this.closing) {
            throw new Error("Serial input stream closed.");
          }
          break;
        }
        if (!result.value) {
          continue;
        }
        this.rxBytesTotal += result.value.byteLength;
        if (this.activeExchange) {
          this.activeExchange.rawRxBytes = concatBytes(
            this.activeExchange.rawRxBytes,
            result.value
          );
          if (this.activeExchange.timings.firstRxByteAt === null) {
            this.activeExchange.timings.firstRxByteAt = monotonicNow();
          }
        }
        this.emitTraffic("rx", result.value);
        this.rxBuffer = concatBytes(this.rxBuffer, result.value);
        const parsed = parseStatusPacketBuffer(Uint8Array.from(this.rxBuffer));
        this.rxBuffer = parsed.remaining;
        this.rxPacketsParsed += parsed.packets.length;
        for (const invalid of parsed.checksumErrors) {
          if (this.activeExchange) {
            this.activeExchange.checksumErrorCount += 1;
          }
          this.emitDiagnostic({ kind: "checksum-error", bytes: invalid });
        }
        for (const packet of parsed.packets) {
          this.dispatchStatus(packet);
        }
      }
    } catch (error) {
      if (!this.closing) {
        const waiter = this.statusWaiter;
        const operation = waiter?.request.kind === "ping" ? "pingServo" : waiter?.request.kind === "read" ? "readRegister" : "serialReader";
        const servoId = waiter?.request.expectedIds[0] ?? null;
        this.rejectStatusWaiter(toError(error));
        this.handleTransportFailure(error, operation, servoId, "reader.read");
      }
    } finally {
      if (sessionId === this.sessionId) {
        this.readerLoopActive = false;
      }
    }
  }

  private emitTraffic(direction: SerialTrafficEvent["direction"], bytes: Uint8Array): void {
    this.queueListenerEvent({ type: "traffic", event: { direction, bytes: Uint8Array.from(bytes) } });
  }

  private emitDiagnostic(event: ServoDiagnosticEvent): void {
    this.queueListenerEvent({ type: "diagnostic", event });
  }

  private queueListenerEvent(event: typeof this.pendingListenerEvents[number]): void {
    if (this.pendingListenerEvents.length >= MAX_PENDING_LISTENER_EVENTS) {
      this.pendingListenerEvents.shift();
    }
    this.pendingListenerEvents.push(event);
    if (this.listenerFlushTimer !== null) return;
    this.listenerFlushTimer = setTimeout(() => {
      this.listenerFlushTimer = null;
      const events = this.pendingListenerEvents.splice(0);
      for (const pending of events) {
        if (pending.type === "traffic") this.trafficListener?.(pending.event);
        else this.diagnosticListener?.(pending.event);
      }
    }, 0);
  }

  private emitTransportStage(operation: string, servoId: number | null, stage: string): void {
    this.emitDiagnostic({ kind: "transport-stage", operation, servoId, stage, health: this.getTransportHealth() });
  }

  private emitTransportError(
    error: unknown,
    operation: string,
    servoId: number | null,
    stage: string,
    fatal: boolean
  ): void {
    const detail = describeSerialError(error);
    this.transportErrorListener?.({
      error,
      ...detail,
      operation,
      servoId,
      stage,
      timestamp: new Date().toISOString(),
      fatal,
      health: this.getTransportHealth()
    });
  }

  private assertTransportHealthy(operation: string, servoId: number | null, stage: string): void {
    const healthy = this.port !== null && this.port.readable !== null && this.port.writable !== null &&
      this.reader !== null && this.writer !== null && this.readerSessionId === this.sessionId &&
      this.writerSessionId === this.sessionId && this.readerLoopActive && !this.closing;
    if (!healthy) {
      const error = new DOMException("The current serial session has no usable reader/writer streams.", "InvalidStateError");
      this.handleTransportFailure(error, operation, servoId, stage);
      throw error;
    }
  }

  private async recoverFromBufferOverrun(
    failedReader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
    sessionId: number
  ): Promise<ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>> {
    const now = Date.now();
    this.bufferOverruns += 1;
    this.recentOverruns = this.recentOverruns.filter((timestamp) => now - timestamp <= OVERRUN_WINDOW_MS);
    this.recentOverruns.push(now);
    this.emitDiagnostic({ kind: "rx-overrun-detected" });
    this.rxBuffer = new Uint8Array(0);
    this.responseQuarantineUntil = 0;
    this.beginRecovery();
    this.rejectStatusWaiter(new SerialReceiveOverrunError());

    if (this.recentOverruns.length > MAX_OVERRUN_RECOVERIES) {
      const error = new Error("Serial connection failed after repeated receive-buffer overruns. Reconnect the device.");
      this.failedOverrunRecoveries += 1;
      this.finishRecovery(error);
      throw error;
    }

    if (this.reader === failedReader) {
      this.reader = null;
      this.readerSessionId = 0;
    }
    try {
      failedReader.releaseLock();
    } catch {
      // The errored stream may already have released its reader lock.
    }

    try {
      for (let attempt = 0; attempt < READABLE_RECOVERY_ATTEMPTS; attempt += 1) {
        if (this.closing || sessionId !== this.sessionId || !this.port || !this.port.writable) {
          throw new Error("Serial port became unavailable during receive recovery.");
        }
        const readable = this.port.readable;
        if (readable && !readable.locked) {
          const replacement = readable.getReader();
          this.reader = replacement;
          this.readerSessionId = sessionId;
          this.successfulOverrunRecoveries += 1;
          this.finishRecovery();
          this.emitDiagnostic({ kind: "rx-overrun-recovered" });
          return replacement;
        }
        await new Promise((resolve) => setTimeout(resolve, READABLE_RECOVERY_DELAY_MS));
      }
      throw new Error("A replacement serial readable stream did not become available.");
    } catch (error) {
      this.failedOverrunRecoveries += 1;
      this.finishRecovery(toError(error));
      throw error;
    }
  }

  private beginRecovery(): void {
    this.recoveringReadStream = true;
    if (!this.recoveryPromise) {
      this.recoveryPromise = new Promise<void>((resolve, reject) => {
        this.resolveRecovery = resolve;
        this.rejectRecovery = reject;
      });
      void this.recoveryPromise.catch(() => undefined);
    }
  }

  private finishRecovery(error?: Error): void {
    const resolve = this.resolveRecovery;
    const reject = this.rejectRecovery;
    this.recoveryPromise = null;
    this.resolveRecovery = null;
    this.rejectRecovery = null;
    this.recoveringReadStream = false;
    if (error) reject?.(error);
    else resolve?.();
  }

  private handleTransportFailure(error: unknown, operation: string, servoId: number | null, stage: string): void {
    if (this.failedSessionId === this.sessionId || this.closing) {
      return;
    }
    this.failedSessionId = this.sessionId;
    this.emitTransportError(error, operation, servoId, stage, true);
    this.closing = true;
    this.rejectStatusWaiter(toError(error));
    void this.disconnect().catch((cleanupError) => {
      this.emitTransportError(cleanupError, "disconnect", servoId, "fatal transport cleanup", false);
    });
  }

  private async writePacket(packet: Uint8Array, operation: string, servoId: number | null): Promise<void> {
    this.assertTransportHealthy(operation, servoId, "writer preflight");
    const writer = this.writer;
    if (!writer) {
      throw new Error("Serial port is not connected.");
    }
    this.emitTransportStage(operation, servoId, "writer.ready");
    try {
      await writer.ready;
    } catch (error) {
      this.handleTransportFailure(error, operation, servoId, "writer.ready");
      throw error;
    }
    this.emitTraffic("tx", packet);
    if (this.activeExchange) {
      this.activeExchange.timings.sentAt = monotonicNow();
    }
    this.emitTransportStage(operation, servoId, "writer.write");
    try {
      await writer.write(packet);
    } catch (error) {
      this.handleTransportFailure(error, operation, servoId, "writer.write");
      throw error;
    }
    this.emitTransportStage(operation, servoId, "write complete");
  }
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

function concatBytes(
  a: Uint8Array<ArrayBufferLike>,
  b: Uint8Array<ArrayBufferLike>
): Uint8Array<ArrayBufferLike> {
  return Uint8Array.from([...a, ...b]);
}

function pendingRequestFromPacket(
  packet: Uint8Array,
  expectedIds: readonly number[]
): PendingServoRequest {
  const instruction = packet[4];
  if (instruction === INST_PING) {
    return { kind: "ping", expectedIds, expectedParameterCount: 0 };
  }
  if (instruction === INST_READ) {
    const requestedLength = packet[6];
    if (!Number.isInteger(requestedLength) || requestedLength < 1) {
      throw new Error("Register-read packet has an invalid requested length.");
    }
    return { kind: "read", expectedIds, expectedParameterCount: requestedLength };
  }
  if (instruction === INST_WRITE) {
    return { kind: "write", expectedIds, expectedParameterCount: 0 };
  }
  throw new Error(`Unsupported servo instruction ${instruction}.`);
}

function cloneExchange(exchange: ServoExchangeDiagnostics): ServoExchangeDiagnostics {
  return {
    txPacket: Uint8Array.from(exchange.txPacket),
    rawRxBytes: Uint8Array.from(exchange.rawRxBytes),
    validPacketCount: exchange.validPacketCount,
    checksumErrorCount: exchange.checksumErrorCount,
    unexpectedPacketIds: [...exchange.unexpectedPacketIds],
    lastParsedServoId: exchange.lastParsedServoId,
    timings: { ...exchange.timings }
  };
}

function validateNormalServoId(id: number): void {
  if (!Number.isInteger(id) || id < SMS_STS_MIN_SERVO_ID || id > SMS_STS_MAX_SERVO_ID) {
    throw new Error(`Servo ID must be an integer from ${SMS_STS_MIN_SERVO_ID} to ${SMS_STS_MAX_SERVO_ID}.`);
  }
}

function validateIntegerRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} must be an integer from ${min} to ${max}.`);
  }
}
