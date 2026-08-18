import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { NATIVE_MIDDLE_POSITION } from "../calibration/positionMapping";
import { evaluateStableRawPosition, useCalibration } from "../calibration/useCalibration";
import { useInitialPose } from "../initialPose/useInitialPose";
import { captureCompletePose } from "../initialPose/captureCompletePose";
import type { InitialPose, MotorId } from "../initialPose/initialPoseStorage";
import { useRecordAndPlay } from "../recording/useRecordAndPlay";
import {
  ScsServoClient,
  buildWritePositionPacket,
  decodeWritePositionPacket,
  SMS_STS_MAX_SERVO_ID,
  SMS_STS_MIN_SERVO_ID,
  SMS_STS_SERVO_MODE,
  SMS_STS_NATIVE_MIDDLE,
  buildCalibrationOfsPacket,
  formatSerialError,
  type ServoExchangeDiagnostics,
  type ServoDiagnosticEvent,
  type ServoProbeResult,
  type MotorIdWriteResult,
  type MotorIdWriteStage,
  type SerialTrafficEvent,
  type SerialTransportErrorEvent
} from "../webserial/scservo";
import { createInitialMotorState } from "./motors";
import {
  HOME_ARRIVAL_TOLERANCE,
  buildHomeCommand,
  createNativeHomeTargets,
  detectTargetCrossing,
  sendHomeCommandsOnce,
  updateHomeWatchdog,
  type HomeWatchdogState
} from "./homeMovement";
import { getHomeAvailability } from "./homeAvailability";
import {
  getLogicalMovementRange,
  validateLogicalTarget
} from "./movementLimits";
import type {
  ControllerStatus,
  LogEntry,
  LogKind,
  MotorKey,
  MotorState
} from "./types";

const MAX_LOG_ENTRIES = 160;
const HOME_WATCHDOG_POLL_MS = 120;
const HOME_WATCHDOG_TIMEOUT_MS = 8000;
const CENTER_SAMPLE_DELAY_MS = 40;
const DIAGNOSTIC_HOME_SPEED = 80;
const DIAGNOSTIC_HOME_ACCELERATION = 5;
const DIAGNOSTIC_HOME_POLL_MS = 100;
const DIAGNOSTIC_HOME_TIMEOUT_MS = 10000;

export type CenterDiagnostic = {
  motorId: number;
  expectedMiddle: number;
  currentRaw: number;
  currentLogical: number;
  difference: number;
  samples: readonly number[];
  passed: boolean;
  message: string;
};

export type ServoBusTestReport = {
  test: string;
  txPacket: string;
  rxByteCount: number;
  rawRx: string;
  validPacketCount: number;
  checksumErrorCount: number;
  unexpectedPacketIds: number[];
  parsedServoId: number | null;
  result: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function formatBytes(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function timeStamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function subscribeToBrowserEnvironment(): () => void {
  return () => undefined;
}

function getWebSerialSupport(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.serial !== "undefined";
}

function formatExchangeTimings(exchange: ServoExchangeDiagnostics | null): string {
  if (!exchange) {
    return "timings unavailable";
  }
  const { timings } = exchange;
  const relative = (value: number | null) =>
    value === null ? "none" : `${Math.max(0, Math.round(value - timings.queuedAt))} ms`;
  return [
    `queued: 0 ms`,
    `sent: ${relative(timings.sentAt)}`,
    `first RX: ${relative(timings.firstRxByteAt)}`,
    `parsed: ${relative(timings.parsedAt)}`,
    `completed: ${relative(timings.completedAt)}`,
    `timeout: ${relative(timings.timedOutAt)}`
  ].join(", ");
}

export function useRobotController() {
  const clientRef = useRef<ScsServoClient | null>(null);
  const movementSequenceVersionRef = useRef(0);
  if (clientRef.current === null) {
    clientRef.current = new ScsServoClient();
  }

  const [baudRate, setBaudRate] = useState(115200);
  const [connected, setConnected] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const activeActionRef = useRef<string | null>(null);
  const [eStopLatched, setEStopLatched] = useState(false);
  const [allMotorsReleased, setAllMotorsReleased] = useState(false);
  const calibration = useCalibration(connected);
  const initialPose = useInitialPose(
    connected,
    calibration.savedProfile,
    calibration.hasSavedMidpoint
  );
  const [speed, setSpeedState] = useState(300);
  const [acceleration, setAccelerationState] = useState(20);
  const [motors, setMotors] = useState<MotorState[]>(() =>
    createInitialMotorState().map((motor) => {
      const range = getLogicalMovementRange();
      return {
        ...motor,
        min: range.minimum,
        max: range.maximum,
        home: NATIVE_MIDDLE_POSITION,
        target: NATIVE_MIDDLE_POSITION
      };
    })
  );
  const [status, setStatus] = useState<ControllerStatus>({
    tone: "neutral",
    message: "Choose the serial device to begin."
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [servoDiagnostics, setServoDiagnostics] = useState({
    lastTxPacket: null as string | null,
    lastRxPacket: null as string | null,
    lastParsedServoId: null as number | null,
    lastPingResult: "Not run",
    txByteCount: 0,
    rawRxByteCount: 0,
    validPacketCount: 0,
    unexpectedPacketIdCount: 0,
    timeoutCount: 0,
    checksumErrorCount: 0,
    lastRawRx: null as string | null,
    lastTestReport: null as ServoBusTestReport | null
  });
  const [centerDiagnostics, setCenterDiagnostics] = useState<Partial<Record<number, CenterDiagnostic>>>({});
  const [diagnosticHomeSides, setDiagnosticHomeSides] = useState<Record<number, { negative: boolean; positive: boolean }>>({
    2: { negative: false, positive: false },
    4: { negative: false, positive: false }
  });
  const diagnosticHomeVerified = useMemo<Record<number, boolean>>(() => ({
    2: diagnosticHomeSides[2].negative && diagnosticHomeSides[2].positive,
    4: diagnosticHomeSides[4].negative && diagnosticHomeSides[4].positive
  }), [diagnosticHomeSides]);
  const nextLogId = useRef(1);
  const pendingLogsRef = useRef<LogEntry[]>([]);
  const logFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextMovementCommandId = useRef(1);
  const invalidateRecordingForMotorIdChangeRef = useRef<() => void>(() => undefined);

  const serialSupported = useSyncExternalStore(
    subscribeToBrowserEnvironment,
    getWebSerialSupport,
    () => false
  );

  const pushLog = useCallback((kind: LogKind, message: string) => {
    const entry: LogEntry = {
      id: nextLogId.current,
      timestamp: timeStamp(),
      kind,
      message
    };
    nextLogId.current += 1;
    pendingLogsRef.current.push(entry);
    if (logFlushTimerRef.current !== null) return;
    logFlushTimerRef.current = setTimeout(() => {
      logFlushTimerRef.current = null;
      const pending = pendingLogsRef.current.splice(0);
      if (pending.length > 0) {
        setLogs((previous) => [...previous, ...pending].slice(-MAX_LOG_ENTRIES));
      }
    }, 0);
  }, []);

  useEffect(() => () => {
    if (logFlushTimerRef.current !== null) clearTimeout(logFlushTimerRef.current);
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (!client) {
      return;
    }

    const onTraffic = (event: SerialTrafficEvent) => {
      pushLog(event.direction, `${event.direction.toUpperCase()}  ${formatBytes(event.bytes)}`);
      if (event.direction === "tx") {
        const movement = decodeWritePositionPacket(event.bytes);
        if (movement) {
          const sequence = nextMovementCommandId.current++;
          pushLog(
            "system",
            `WRITE POSITION #${sequence}: ID ${movement.id}, goal raw ${movement.rawPosition}, speed ${movement.speed}, acceleration ${movement.acceleration}, goal bytes ${formatBytes(movement.goalBytes)}`
          );
        }
      }
      setServoDiagnostics((previous) => event.direction === "tx"
        ? {
            ...previous,
            lastTxPacket: formatBytes(event.bytes),
            txByteCount: previous.txByteCount + event.bytes.length
          }
        : {
            ...previous,
            lastRawRx: formatBytes(event.bytes),
            rawRxByteCount: previous.rawRxByteCount + event.bytes.length
          });
    };
    const onDiagnostic = (event: ServoDiagnosticEvent) => {
      switch (event.kind) {
        case "ping-tx":
          pushLog("system", `ID SETUP TX PING ID ${event.id}: ${formatBytes(event.bytes)}`);
          break;
        case "packet-rx":
          setServoDiagnostics((previous) => ({
            ...previous,
            lastRxPacket: formatBytes(event.bytes),
            lastParsedServoId: event.id,
            validPacketCount: previous.validPacketCount + 1
          }));
          pushLog("system", `ID SETUP RX: ${formatBytes(event.bytes)}`);
          break;
        case "ping-success":
          setServoDiagnostics((previous) => ({
            ...previous,
            lastPingResult: `PING SUCCESS ID ${event.id}`
          }));
          pushLog("system", `PING SUCCESS ID ${event.id}`);
          break;
        case "ping-timeout":
          setServoDiagnostics((previous) => ({
            ...previous,
            lastPingResult: `PING TIMEOUT ID ${event.id}`
          }));
          pushLog("warning", `PING TIMEOUT ID ${event.id}`);
          break;
        case "response-timeout":
          setServoDiagnostics((previous) => ({
            ...previous,
            timeoutCount: previous.timeoutCount + 1
          }));
          if (event.instruction !== 0x01) {
            pushLog("warning", `READ TIMEOUT ID ${event.id}`);
          }
          break;
        case "position-decoded":
          pushLog("system", `Position response ID ${event.id}`);
          pushLog("system", `RX: ${formatBytes(event.bytes)}`);
          pushLog("system", `decodedRawPosition: ${event.rawPosition}`);
          break;
        case "checksum-error":
          setServoDiagnostics((previous) => ({
            ...previous,
            checksumErrorCount: previous.checksumErrorCount + 1
          }));
          pushLog("warning", `RX checksum rejected: ${formatBytes(event.bytes)}`);
          break;
        case "unexpected-id":
          setServoDiagnostics((previous) => ({
            ...previous,
            unexpectedPacketIdCount: previous.unexpectedPacketIdCount + 1
          }));
          pushLog("warning", `Ignored unexpected servo response from ID ${event.id}.`);
          break;
        case "unexpected-response-shape":
          pushLog(
            "warning",
            `Ignored servo ${event.id} response with ${event.actualParams} parameter byte(s); pending command requires ${event.expectedParams}.`
          );
          break;
        case "serial-opened":
          pushLog("system", `Serial opened: baudRate=${event.baudRate} bufferSize=${event.bufferSize}`);
          break;
        case "rx-overrun-detected":
          pushLog("warning", "Serial RX buffer overrun detected. Attempting automatic RX recovery...");
          setStatus({ tone: "warning", message: "Temporary serial receive-buffer overrun detected; recovering." });
          break;
        case "rx-overrun-recovered":
          pushLog("system", "Serial RX recovered after buffer overrun.");
          setStatus({ tone: "success", message: "Serial receive recovered after a temporary buffer overrun." });
          break;
        case "transport-stage":
          if (process.env.NODE_ENV === "development") {
            const health = event.health;
            pushLog(
              "system",
              `${event.operation}${event.servoId === null ? "" : ` ID ${event.servoId}`}: ${event.stage}; ` +
              `session=${health.sessionId}, readable=${health.portReadable}, writable=${health.portWritable}, ` +
              `readerActive=${health.readerLoopActive}, writerAvailable=${health.writerAvailable}, ` +
              `pending=${health.pendingRequestCount}, queue=${health.queueLength}, maxQueue=${health.maxCommandQueueDepth}, ` +
              `rxBytes=${health.rxBytesTotal}, rxPackets=${health.rxPacketsParsed}, overruns=${health.bufferOverruns}, ` +
              `recoveries=${health.successfulOverrunRecoveries}/${health.failedOverrunRecoveries}, bufferSize=${health.configuredBufferSize ?? "none"}`
            );
          }
          break;
      }
    };
    const onTransportError = (event: SerialTransportErrorEvent) => {
      const health = event.health;
      const detail = [
        "SERIAL ERROR",
        `operation: ${event.operation}`,
        `servoId: ${event.servoId ?? "none"}`,
        `stage: ${event.stage}`,
        `name: ${event.name}`,
        `message: ${event.message}`,
        `constructor: ${event.constructorName}`,
        `connected: ${client.connected}`,
        `sessionId: ${health.sessionId}`,
        `portReadable: ${health.portReadable}`,
        `portWritable: ${health.portWritable}`,
        `readerActive: ${health.readerLoopActive}`,
        `readerAvailable: ${health.readerAvailable}`,
        `writerAvailable: ${health.writerAvailable}`,
        `pendingRequests: ${health.pendingRequestCount}`,
        `queueLength: ${health.queueLength}`,
        `activeOperation: ${activeActionRef.current ?? "none"}`,
        `timestamp: ${event.timestamp}`,
        `stack: ${event.stack ?? "unavailable"}`
      ].join("\n");
      pushLog("error", detail);
      console.error("Serial transport failure", event.error, event);
      if (event.fatal) {
        setConnected(false);
        setStatus({
          tone: "error",
          message: event.message.startsWith("Serial connection failed after repeated receive-buffer overruns")
            ? "Serial connection failed after repeated receive-buffer overruns. Reconnect the device."
            : `Serial transport error: ${event.name}: ${event.message}. Reconnect the device.`
        });
      }
    };
    client.setTrafficListener(onTraffic);
    client.setDiagnosticListener(onDiagnostic);
    client.setTransportErrorListener(onTransportError);

    return () => {
      client.setTrafficListener(null);
      client.setDiagnosticListener(null);
      client.setTransportErrorListener(null);
      void client.disconnect().catch(() => undefined);
    };
  }, [pushLog]);

  const reportServoBusTest = useCallback((
    test: string,
    exchange: ServoExchangeDiagnostics | null,
    result: string
  ): ServoBusTestReport => {
    const report: ServoBusTestReport = {
      test,
      txPacket: exchange ? formatBytes(exchange.txPacket) : "NONE",
      rxByteCount: exchange?.rawRxBytes.length ?? 0,
      rawRx: exchange && exchange.rawRxBytes.length > 0 ? formatBytes(exchange.rawRxBytes) : "NONE",
      validPacketCount: exchange?.validPacketCount ?? 0,
      checksumErrorCount: exchange?.checksumErrorCount ?? 0,
      unexpectedPacketIds: exchange?.unexpectedPacketIds ?? [],
      parsedServoId: exchange?.lastParsedServoId ?? null,
      result
    };
    setServoDiagnostics((previous) => ({ ...previous, lastTestReport: report }));
    pushLog("system", `TEST: ${test}`);
    pushLog("system", `TX: ${report.txPacket}`);
    pushLog("system", `RX bytes: ${report.rxByteCount}`);
    pushLog("system", `RX: ${report.rawRx}`);
    pushLog("system", `TIMING: ${formatExchangeTimings(exchange)}`);
    pushLog("system", `RESULT: ${report.result}`);
    return report;
  }, [pushLog]);

  const updateMotor = useCallback(
    (key: MotorKey, update: Partial<MotorState> | ((motor: MotorState) => Partial<MotorState>)) => {
      setMotors((previous) =>
        previous.map((motor) => {
          if (motor.key !== key) {
            return motor;
          }
          const patch = typeof update === "function" ? update(motor) : update;
          return { ...motor, ...patch };
        })
      );
    },
    []
  );

  const setMotorTarget = useCallback(
    (key: MotorKey, target: number) => {
      updateMotor(key, (motor) => {
        const nextTarget = Number.isFinite(target) ? Math.round(target) : motor.target;
        const validation = validateLogicalTarget({
          motor,
          logicalTarget: nextTarget,
          calibration: calibration.savedProfile
        });
        const invalid = !validation.valid;
        return {
          target: nextTarget,
          activity: invalid ? "error" : motor.activity === "error" ? "idle" : motor.activity,
          message: invalid
            ? validation.valid ? motor.message : validation.error
            : motor.activity === "error" ? "Target updated" : motor.message
        };
      });
    },
    [calibration.savedProfile, updateMotor]
  );

  const jogMotor = useCallback(
    (key: MotorKey, direction: -1 | 1) => {
      updateMotor(key, (motor) => {
        const nextTarget = Math.round(motor.target + direction * motor.jogStep);
        const validation = validateLogicalTarget({
          motor,
          logicalTarget: nextTarget,
          calibration: calibration.savedProfile
        });
        const invalid = !validation.valid;
        return {
          target: nextTarget,
          activity: invalid ? "error" : "idle",
          message: invalid
            ? validation.valid ? motor.message : validation.error
            : `Target jogged ${direction > 0 ? "+" : "−"}${motor.jogStep}`
        };
      });
    },
    [calibration.savedProfile, updateMotor]
  );

  useEffect(() => {
    // Calibration changes replace the native coordinate metadata used by each motor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotors((previous) => previous.map((motor) => {
      const range = getLogicalMovementRange();
      const validation = validateLogicalTarget({
        motor,
        logicalTarget: motor.target,
        calibration: calibration.savedProfile
      });
      return {
        ...motor,
        min: range.minimum,
        max: range.maximum,
        home: NATIVE_MIDDLE_POSITION,
        activity: validation.valid ? motor.activity === "error" ? "idle" : motor.activity : "error",
        message: validation.valid
          ? motor.activity === "error" ? "Target updated" : motor.message
          : validation.error
      };
    }));
  }, [calibration.savedProfile]);

  const runAction = useCallback(
    async (
      label: string,
      action: (client: ScsServoClient) => Promise<void>,
      options: {
        requiresConnection?: boolean;
        successMessage?: string;
        onError?: (message: string) => void;
        preserveStatusOnAbort?: boolean;
      } = {}
    ): Promise<boolean> => {
      const client = clientRef.current;
      if (!client) {
        return false;
      }
      if ((options.requiresConnection ?? true) && !client.connected) {
        setStatus({ tone: "warning", message: "Connect to a serial device first." });
        pushLog("warning", `${label} blocked: serial device is disconnected.`);
        return false;
      }

      setActiveAction(label);
      activeActionRef.current = label;
      pushLog("system", `${label} started.`);
      try {
        await action(client);
        const message = options.successMessage ?? `${label} completed.`;
        setStatus({ tone: "success", message });
        pushLog("system", message);
        return true;
      } catch (error) {
        const message = formatSerialError(error);
        options.onError?.(message);
        if (error instanceof DOMException && error.name === "AbortError") {
          return false;
        }
        setStatus({
          tone: "error",
          message: label !== "Connect" && !client.connected
            ? `Serial transport error: ${message}. Reconnect the device.`
            : `${label} failed: ${message}`
        });
        pushLog("error", `${label} failed: ${message}`);
        return false;
      } finally {
        if (activeActionRef.current === label) {
          activeActionRef.current = null;
        }
        setActiveAction((current) => current === label ? null : current);
      }
    },
    [pushLog]
  );

  const validateLogicalPose = useCallback((pose: InitialPose) => {
    const validated = motors.map((motor) => ({
      motor,
      validation: validateLogicalTarget({
        motor,
        logicalTarget: pose[motor.id as MotorId],
        calibration: calibration.savedProfile
      })
    }));
    const invalid = validated.find((entry) => !entry.validation.valid);
    if (invalid && !invalid.validation.valid) {
      throw new Error(invalid.validation.error);
    }
    return validated as Array<{
      motor: MotorState;
      validation: { valid: true; rawTarget: number };
    }>;
  }, [calibration.savedProfile, motors]);

  const moveToLogicalPose = useCallback(async (
    client: ScsServoClient,
    pose: InitialPose,
    signal?: AbortSignal
  ) => {
    const validated = validateLogicalPose(pose);
    const sequenceVersion = movementSequenceVersionRef.current;
    signal?.throwIfAborted();
    for (const entry of validated) {
      signal?.throwIfAborted();
      if (movementSequenceVersionRef.current !== sequenceVersion) {
        throw new DOMException("Movement sequence cancelled.", "AbortError");
      }
      await client.writePosEx(
        entry.motor.id,
        entry.validation.rawTarget,
        speed,
        acceleration
      );
      signal?.throwIfAborted();
      if (movementSequenceVersionRef.current !== sequenceVersion) {
        throw new DOMException("Movement sequence cancelled.", "AbortError");
      }
    }
  }, [acceleration, speed, validateLogicalPose]);

  const readRawPose = useCallback(async (
    client: ScsServoClient,
    signal?: AbortSignal
  ): Promise<InitialPose> => {
    return captureCompletePose(motors, (id) => client.readPosition(id), signal);
  }, [motors]);

  const readLogicalPose = useCallback(async (
    client: ScsServoClient,
    signal?: AbortSignal
  ): Promise<InitialPose> => {
    return readRawPose(client, signal);
  }, [readRawPose]);

  const setAllTorqueWithClient = useCallback(async (
    client: ScsServoClient,
    enabled: boolean,
    signal?: AbortSignal
  ) => {
    for (const motor of motors) {
      signal?.throwIfAborted();
      await client.setTorque(motor.id, enabled);
      signal?.throwIfAborted();
    }
  }, [motors]);

  const connect = useCallback(async () => {
    if (!serialSupported) {
      setStatus({
        tone: "error",
        message: "Web Serial is unavailable. Use Chrome or Edge on HTTPS or localhost."
      });
      return;
    }

    const ok = await runAction(
      "Connect",
      async (client) => {
        await client.connect(baudRate);
      },
      {
        requiresConnection: false,
        successMessage: "Serial link established. Read positions before the first move."
      }
    );
    if (ok) {
      setConnected(true);
      setEStopLatched(false);
      setDiagnosticHomeSides({
        2: { negative: false, positive: false },
        4: { negative: false, positive: false }
      });
    }
  }, [baudRate, runAction, serialSupported]);

  const disconnect = useCallback(async () => {
    const client = clientRef.current;
    if (!client) {
      return;
    }
    setActiveAction("Disconnect");
    activeActionRef.current = "Disconnect";
    try {
      await client.disconnect();
      setConnected(false);
      setEStopLatched(false);
      setDiagnosticHomeSides({
        2: { negative: false, positive: false },
        4: { negative: false, positive: false }
      });
      setStatus({ tone: "neutral", message: "Serial link closed." });
      pushLog("system", "Serial link closed.");
    } catch (error) {
      const message = formatSerialError(error);
      setStatus({ tone: "error", message: `Disconnect failed: ${message}` });
      pushLog("error", `Disconnect failed: ${message}`);
    } finally {
      activeActionRef.current = null;
      setActiveAction(null);
    }
  }, [pushLog]);

  const moveMotor = useCallback(
    async (key: MotorKey) => {
      const motor = motors.find((candidate) => candidate.key === key);
      if (!motor || eStopLatched) {
        if (eStopLatched) {
          setStatus({ tone: "warning", message: "Reset the software stop before moving." });
        }
        return;
      }

      const validation = validateLogicalTarget({
        motor,
        logicalTarget: motor.target,
        calibration: calibration.savedProfile
      });
      if (!validation.valid) {
        setStatus({ tone: "error", message: validation.error });
        pushLog("warning", `Move blocked: ${validation.error}`);
        updateMotor(key, { activity: "error", message: "Target is outside the protocol position range" });
        return;
      }

      updateMotor(key, { activity: "commanded", message: "Move command in progress" });
      const ok = await runAction(`Move ${motor.name}`, async (client) => {
        await client.writePosEx(motor.id, validation.rawTarget, speed, acceleration);
      });
      updateMotor(key, {
        activity: ok ? "commanded" : "error",
        message: ok ? `Target ${motor.target} acknowledged` : "Move command failed"
      });
    },
    [acceleration, calibration.savedProfile, eStopLatched, motors, pushLog, runAction, speed, updateMotor]
  );

  const readMotor = useCallback(
    async (key: MotorKey) => {
      const motor = motors.find((candidate) => candidate.key === key);
      if (!motor) {
        return;
      }

      updateMotor(key, { activity: "reading", message: "Reading position" });
      let rawPosition: number | null = null;
      const ok = await runAction(`Read ${motor.name}`, async (client) => {
        rawPosition = await client.readPosition(motor.id);
      });
      if (ok && rawPosition !== null) {
        pushLog("system", `Servo ID: ${motor.id}`);
        pushLog("system", `native position: ${rawPosition}`);
        updateMotor(key, {
          current: rawPosition,
          rawCurrent: rawPosition,
          activity: "idle",
          message: `Position ${rawPosition}`
        });
      } else {
        updateMotor(key, { activity: "error", message: "Position read failed" });
      }
    },
    [motors, pushLog, runAction, updateMotor]
  );

  const pingMotor = useCallback(
    async (key: MotorKey) => {
      const motor = motors.find((candidate) => candidate.key === key);
      if (!motor) {
        return;
      }
      const ok = await runAction(`Ping ${motor.name}`, async (client) => {
        await client.ping(motor.id);
      });
      updateMotor(key, {
        activity: ok ? "idle" : "error",
        message: ok ? "Servo responded" : "No valid response"
      });
    },
    [motors, runAction, updateMotor]
  );

  const pingSetupServoId = useCallback(async (id: number) => {
    let responded = false;
    let error = "Servo did not respond.";
    const ok = await runAction(
      `Ping servo ID ${id}`,
      async (client) => {
        let failure: string | null = null;
        try {
          responded = await client.pingServo(id);
        } catch (caught) {
          failure = caught instanceof Error ? caught.message : String(caught);
          throw caught;
        } finally {
          reportServoBusTest(
            `Ping ID ${id}`,
            client.getLastExchangeDiagnostics(),
            failure ?? (responded ? `Success: servo ID ${id} responded.` : "Timeout")
          );
        }
      },
      { onError: (message) => { error = message; } }
    );
    return ok ? { ok: true as const, value: responded } : { ok: false as const, error };
  }, [reportServoBusTest, runAction]);

  const scanSetupServoIds = useCallback(async (
    ids: readonly number[],
    onProgress: (id: number) => void,
    shouldCancel?: () => boolean,
    stopAfterFirst = true
  ) => {
    let found: number[] = [];
    let error = "ID scan failed.";
    const ok = await runAction(
      "Detect connected servo IDs",
      async (client) => {
        found = await client.scanServoIds((id) => {
          onProgress(id);
          pushLog("system", `Scanning servo ID ${id}…`);
        }, ids, shouldCancel, stopAfterFirst);
        reportServoBusTest(
          ids.length > 5 ? "Scan Full ID Range" : "Ping IDs 1–5",
          client.getLastExchangeDiagnostics(),
          found.length > 0 ? `Responding ID${found.length === 1 ? "" : "s"}: ${found.join(", ")}` : "No response"
        );
      },
      { onError: (message) => { error = message; } }
    );
    return ok ? { ok: true as const, value: found } : { ok: false as const, error };
  }, [pushLog, reportServoBusTest, runAction]);

  const detectSetupServoIds = useCallback(async (onProgress: (id: number) => void) => {
    let probe: ServoProbeResult | null = null;
    let error = "ID probe failed.";
    const ok = await runAction(
      "Probe connected servo IDs 1–5",
      async (client) => {
        probe = await client.probeServoIds([1, 2, 3, 4, 5], (id) => {
          onProgress(id);
          pushLog("system", `Probing servo ID ${id} by ping, then model-number read fallback…`);
        });
        const result = probe as ServoProbeResult | null;
        reportServoBusTest(
          "Detect Motor ID",
          client.getLastExchangeDiagnostics(),
          result?.found
            ? result.method === "ping"
              ? `Detected ID ${result.id} by ping.`
              : `Detected ID ${result.id} by model-number read (${result.modelNumber}).`
            : "No response at IDs 1–5"
        );
      },
      { onError: (message) => { error = message; } }
    );
    return ok
      ? { ok: true as const, value: probe as ServoProbeResult | null }
      : { ok: false as const, error };
  }, [pushLog, reportServoBusTest, runAction]);

  const scanFullSetupServoIds = useCallback((
    onProgress: (id: number) => void,
    shouldCancel: () => boolean
  ) => scanSetupServoIds(
    Array.from(
      { length: SMS_STS_MAX_SERVO_ID - SMS_STS_MIN_SERVO_ID + 1 },
      (_, index) => index + SMS_STS_MIN_SERVO_ID
    ),
    onProgress,
    shouldCancel
  ), [scanSetupServoIds]);

  const readSetupServoPosition = useCallback(async (id: number) => {
    let position: number | null = null;
    let error = "Position read failed.";
    const ok = await runAction(
      `Read position from servo ID ${id}`,
      async (client) => {
        let failure: string | null = null;
        try {
          position = await client.readPosition(id);
        } catch (caught) {
          failure = caught instanceof Error ? caught.message : String(caught);
          throw caught;
        } finally {
          reportServoBusTest(
            `Read Position ID ${id}`,
            client.getLastExchangeDiagnostics(),
            failure ?? (position === null ? "No valid response" : `Position: ${position}`)
          );
        }
      },
      { onError: (message) => { error = message; } }
    );
    return ok && position !== null
      ? { ok: true as const, value: position as number }
      : { ok: false as const, error };
  }, [reportServoBusTest, runAction]);

  const readSetupServoModelNumber = useCallback(async (id: number) => {
    let modelNumber: number | null = null;
    let error = "Model-number read failed.";
    const ok = await runAction(
      `Read model number from servo ID ${id}`,
      async (client) => {
        let failure: string | null = null;
        try {
          modelNumber = await client.readServoModelNumber(id);
        } catch (caught) {
          failure = caught instanceof Error ? caught.message : String(caught);
          throw caught;
        } finally {
          reportServoBusTest(
            `Read Model Number ID ${id}`,
            client.getLastExchangeDiagnostics(),
            failure ?? (modelNumber === null ? "No valid response" : `Model number: ${modelNumber}`)
          );
        }
      },
      { onError: (message) => { error = message; } }
    );
    return ok && modelNumber !== null
      ? { ok: true as const, value: modelNumber as number }
      : { ok: false as const, error };
  }, [reportServoBusTest, runAction]);

  const readSetupServoIdRegister = useCallback(async (id: number) => {
    let registerId: number | null = null;
    let error = "Servo ID register read failed.";
    const ok = await runAction(
      `Read ID register through servo ID ${id}`,
      async (client) => {
        let failure: string | null = null;
        try {
          registerId = await client.readServoIdRegister(id);
        } catch (caught) {
          failure = caught instanceof Error ? caught.message : String(caught);
          throw caught;
        } finally {
          reportServoBusTest(
            `Read Servo ID Register through ID ${id}`,
            client.getLastExchangeDiagnostics(),
            failure ?? (registerId === null ? "No valid response" : `ID register value: ${registerId}`)
          );
        }
      },
      { onError: (message) => { error = message; } }
    );
    return ok && registerId !== null
      ? { ok: true as const, value: registerId as number }
      : { ok: false as const, error };
  }, [reportServoBusTest, runAction]);

  const changeSetupServoId = useCallback(async (
    currentId: number,
    newId: number,
    onStage: (stage: MotorIdWriteStage) => void
  ) => {
    let result: MotorIdWriteResult | null = null;
    let error = "Motor ID assignment failed.";
    const ok = await runAction(
      `Assign servo ID ${newId}`,
      async (client) => {
        result = await client.changeAndVerifyServoId(currentId, newId, onStage);
      },
      { onError: (message) => { error = message; } }
    );
    if (ok) {
      const assignmentResult = result as MotorIdWriteResult | null;
      if (assignmentResult?.changed) {
        initialPose.invalidateForMotorIdChange();
        invalidateRecordingForMotorIdChangeRef.current();
      }
    }
    return ok && result
      ? { ok: true as const, value: result as MotorIdWriteResult }
      : { ok: false as const, error };
  }, [initialPose.invalidateForMotorIdChange, runAction]);

  const verifySetupServoIds = useCallback(
    () => scanSetupServoIds(motors.map((motor) => motor.id), () => undefined, undefined, false),
    [motors, scanSetupServoIds]
  );

  const setAllHardwareMiddles = useCallback(async () => {
    const results: Record<number, { before: number; after: number; passed: boolean }> = {};
    const changed: number[] = [];
    let failedId: number | null = null;
    const ok = await runAction("Set hardware middle positions", async (client) => {
      pushLog("system", "Hardware-middle preflight: checking IDs 1–5, servo mode, and released torque before any persistent write.");
      for (const motor of motors) {
        await client.ping(motor.id);
        const mode = await client.readServoMode(motor.id);
        if (mode !== SMS_STS_SERVO_MODE) throw new Error(`Motor ${motor.id} is in mode ${mode}; expected servo position mode 0.`);
        const torque = await client.readTorqueState(motor.id);
        if (torque !== 0) throw new Error(`Motor ${motor.id} torque is not released (register 40 = ${torque}).`);
      }
      for (const motor of motors) {
        failedId = motor.id;
        pushLog("system", `Motor ${motor.id}: verify response and configuration.`);
        await client.ping(motor.id);
        const before = await client.readPosition(motor.id);
        const packet = buildCalibrationOfsPacket(motor.id);
        pushLog("system", `Motor ${motor.id} before calibration raw: ${before}`);
        pushLog("system", `Motor ${motor.id} EEPROM unlock: not required by official CalibrationOfs.`);
        pushLog("system", `Motor ${motor.id} CalibrationOfs TX (write register 40 = 128): ${formatBytes(packet)}`);
        await client.calibrationOfs(motor.id);
        changed.push(motor.id);
        pushLog("system", `Motor ${motor.id} EEPROM lock: not required by official CalibrationOfs.`);
        await delay(CENTER_SAMPLE_DELAY_MS);
        const samples = [await client.readPosition(motor.id), await client.readPosition(motor.id), await client.readPosition(motor.id)];
        const stable = evaluateStableRawPosition(samples);
        if (!stable.stable) throw new Error(`Motor ${motor.id} feedback was unstable after calibration: ${samples.join(", ")}.`);
        const after = stable.rawPosition;
        const passed = Math.abs(after - SMS_STS_NATIVE_MIDDLE) <= 8;
        results[motor.id] = { before, after, passed };
        pushLog("system", `Motor ${motor.id} after calibration raw: ${after}; verification: ${passed ? "PASS" : "FAIL"}`);
        if (!passed) throw new Error(`Motor ${motor.id} verification failed: expected ${SMS_STS_NATIVE_MIDDLE} ± 8, received ${after}.`);
        failedId = null;
      }
    }, { onError: (message) => calibration.setFailure(`${message} Hardware calibration changed IDs [${changed.join(", ") || "none"}]${failedId ? ` and stopped at ID ${failedId}` : ""}.`) });
    if (!ok) return;
    const profile = calibration.completeHardwareCalibration(results);
    initialPose.invalidateForMotorIdChange();
    invalidateRecordingForMotorIdChangeRef.current();
    setCenterDiagnostics(Object.fromEntries(Object.entries(results).map(([id, result]) => [Number(id), { motorId: Number(id), expectedMiddle: SMS_STS_NATIVE_MIDDLE, currentRaw: result.after, currentLogical: result.after, difference: result.after - SMS_STS_NATIVE_MIDDLE, samples: [result.after], passed: result.passed, message: result.passed ? "PASS: native feedback is at hardware middle." : "FAIL" }])));
    setMotors((previous) => previous.map((motor) => ({ ...motor, home: NATIVE_MIDDLE_POSITION, target: NATIVE_MIDDLE_POSITION, current: results[motor.id].after, rawCurrent: results[motor.id].after })));
    void profile;
  }, [calibration, initialPose.invalidateForMotorIdChange, motors, pushLog, runAction]);

  const moveAll = useCallback(async () => {
    if (eStopLatched) {
      setStatus({ tone: "warning", message: "Reset the software stop before moving." });
      return;
    }
    const pose = Object.fromEntries(
      motors.map((motor) => [motor.id, motor.target])
    ) as InitialPose;
    try {
      validateLogicalPose(pose);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus({ tone: "error", message: `Move all blocked: ${message}` });
      pushLog("warning", `Move all blocked before transmission: ${message}`);
      return;
    }
    const ok = await runAction(
      "Move all joints",
      async (client) => moveToLogicalPose(client, pose)
    );
    setMotors((previous) =>
      previous.map((motor) => ({
        ...motor,
        activity: ok ? "commanded" : "error",
        message: ok ? `Target ${motor.target} acknowledged` : "Move-all sequence failed"
      }))
    );
  }, [eStopLatched, motors, moveToLogicalPose, pushLog, runAction, validateLogicalPose]);

  const readAll = useCallback(async () => {
    let rawPose: InitialPose | null = null;
    const ok = await runAction("Read all positions", async (client) => {
      rawPose = await readRawPose(client);
    });
    setMotors((previous) =>
      previous.map((motor) => {
        const rawReading = rawPose?.[motor.id as MotorId];
        const logicalReading = rawReading;
        return {
          ...motor,
          current: logicalReading ?? motor.current,
          rawCurrent: rawReading ?? motor.rawCurrent,
          activity: ok ? "idle" : "error",
          message: logicalReading !== undefined
            ? `Position ${logicalReading}`
            : "Read-all sequence failed"
        };
      })
    );
  }, [readRawPose, runAction]);

  const captureAndSaveInitialPose = useCallback(async () => {
    if (eStopLatched) {
      const message = "Initial Position capture blocked: reset Emergency Stop first.";
      initialPose.reportStatus("warning", message);
      setStatus({ tone: "warning", message });
      return false;
    }
    if (!calibration.hasSavedMidpoint) {
      const message = "Set the hardware middle before capturing an Initial Position.";
      setStatus({ tone: "warning", message });
      pushLog("warning", `Initial Position capture blocked: ${message}`);
      return false;
    }
    let captured: InitialPose | null = null;
    let failureMessage = "Position read failed.";
    const ok = await runAction(
      "Capture & save Initial Position",
      async (client) => {
        captured = await readLogicalPose(client);
      },
      { onError: (message) => { failureMessage = message; } }
    );

    if (!ok || !captured) {
      const message = `Initial Position capture failed: ${failureMessage}. Previous saved position was unchanged.`;
      initialPose.reportStatus("error", message);
      setStatus({ tone: "error", message });
      pushLog("error", message);
      return false;
    }

    if (!initialPose.saveCapturedPose(captured)) {
      const message = "Initial Position capture failed validation. Previous saved position was unchanged.";
      setStatus({ tone: "error", message });
      pushLog("warning", message);
      return false;
    }
    const savedCapture = captured;

    setMotors((previous) => previous.map((motor) => ({
      ...motor,
      current: savedCapture[motor.id as MotorId],
      rawCurrent: savedCapture[motor.id as MotorId],
      activity: "idle",
      message: "Current position captured and saved"
    })));
    const message = initialPose.savedProfile ? "Initial Position updated." : "Initial Position saved.";
    setStatus({ tone: "success", message });
    pushLog("system", `${message} Fresh sequential reads were used for all five motors.`);
    return true;
  }, [calibration.hasSavedMidpoint, eStopLatched, initialPose.reportStatus, initialPose.saveCapturedPose, initialPose.savedProfile, pushLog, readLogicalPose, runAction]);

  const moveToInitialPosition = useCallback(async () => {
    if (eStopLatched) {
      const message = "Move to Initial Position blocked: reset Emergency Stop first.";
      initialPose.reportStatus("warning", message);
      setStatus({ tone: "warning", message });
      return false;
    }
    const loadable = initialPose.getLoadablePose();
    if (!loadable.valid) {
      const message = `Move to Initial Position blocked: ${loadable.error}`;
      initialPose.reportStatus("error", message);
      setStatus({ tone: "error", message });
      pushLog("warning", message);
      return false;
    }
    try {
      validateLogicalPose(loadable.pose);
    } catch (error) {
      const message = `Move to Initial Position blocked: ${error instanceof Error ? error.message : String(error)}`;
      initialPose.reportStatus("error", message);
      setStatus({ tone: "error", message });
      return false;
    }
    const ok = await runAction("Move to Initial Position", (client) => moveToLogicalPose(client, loadable.pose), {
      successMessage: "Moved to Initial Position."
    });
    if (!ok) return false;
    setMotors((previous) => previous.map((motor) => ({
      ...motor,
      target: loadable.pose[motor.id as MotorId],
      activity: motor.activity === "error" ? "idle" : motor.activity,
      message: "Moved to Initial Position"
    })));
    initialPose.reportStatus("success", "Moved to Initial Position.");
    return true;
  }, [eStopLatched, initialPose.getLoadablePose, initialPose.reportStatus, moveToLogicalPose, pushLog, runAction, validateLogicalPose]);

  const clearSavedInitialPosition = useCallback(() => {
    const ok = initialPose.clearInitialPose();
    if (ok) {
      const message = "Saved Initial Position cleared. Calibration, targets, and robot position were unchanged.";
      setStatus({ tone: "neutral", message });
      pushLog("system", message);
    }
    return ok;
  }, [initialPose.clearInitialPose, pushLog]);

  const verifyCalibrationMiddle = useCallback(async (motorId: number) => {
    const motor = motors.find((candidate) => candidate.id === motorId);
    if (!motor) return;
    let diagnostic: CenterDiagnostic | null = null;
    const ok = await runAction(`Verify ${motor.name} middle`, async (client) => {
      const samples: number[] = [];
      for (let sample = 0; sample < 3; sample += 1) {
        samples.push(await client.readPosition(motor.id));
        if (sample < 2) await delay(CENTER_SAMPLE_DELAY_MS);
      }
      const stable = evaluateStableRawPosition(samples);
      if (!stable.stable) {
        throw new Error(`Motor ${motor.id} position is unstable. Samples: ${samples.join(", ")}.`);
      }
      const difference = stable.rawPosition - NATIVE_MIDDLE_POSITION;
      const passed = Math.abs(difference) <= 8;
      diagnostic = {
        motorId: motor.id,
        expectedMiddle: NATIVE_MIDDLE_POSITION,
        currentRaw: stable.rawPosition,
        currentLogical: stable.rawPosition,
        difference,
        samples,
        passed,
        message: passed
          ? "PASS: Native feedback matches the hardware middle."
          : `FAIL: Native middle = ${NATIVE_MIDDLE_POSITION}; current feedback = ${stable.rawPosition}.`
      };
      pushLog("system", `VERIFY MIDDLE Motor ${motor.id}: expected ${NATIVE_MIDDLE_POSITION}, samples ${samples.join(", ")}, median ${stable.rawPosition}, difference ${difference}, ${passed ? "PASS" : "FAIL"}`);
    });
    if (ok && diagnostic) {
      setCenterDiagnostics((previous) => ({ ...previous, [motor.id]: diagnostic as CenterDiagnostic }));
    }
  }, [calibration.savedProfile, motors, pushLog, runAction]);

  const verifyCalibrationIdMapping = useCallback(async () => {
    let possibleCollision = false;
    const ok = await runAction("Verify calibration ID mapping", async (client) => {
      pushLog("system", `HARDWARE MIDDLE METADATA: revision ${calibration.savedProfile.revision}; IDs ${calibration.savedProfile.servoIds.join(", ")}`);
      for (const motor of motors) {
        const pinged = await client.pingServo(motor.id);
        if (!pinged) throw new Error(`ID ${motor.id} did not respond to Ping.`);
        const raw = await client.readPosition(motor.id);
        const exchange = client.getLastExchangeDiagnostics();
        possibleCollision ||= Boolean(
          exchange && (exchange.checksumErrorCount > 0 || exchange.unexpectedPacketIds.length > 0 || exchange.validPacketCount > 1)
        );
        pushLog("system", `ID MAPPING: UI Motor ${motor.id} (${motor.name}) -> Ping ID ${motor.id}, Read ID ${motor.id}, fresh native ${raw}`);
      }
      pushLog(possibleCollision ? "warning" : "system", possibleCollision
        ? "Possible duplicate-ID/bus collision detected from overlapping, unexpected, or malformed responses. No IDs were changed."
        : "ID mapping verified at the packet-address level; IDs 1–5 each answered Ping and individual Read Position.");
    });
    if (ok) {
      setStatus({
        tone: possibleCollision ? "warning" : "success",
        message: possibleCollision
          ? "Possible duplicate-ID/bus collision detected. Review the serial log."
          : "ID mapping verified at the packet-address level. Confirm physical joint identity while testing one motor at a time."
      });
    }
  }, [calibration.savedProfile, motors, pushLog, runAction]);

  const homeDiagnosticMotor = useCallback(async (motorId: number) => {
    if (motorId !== 2 && motorId !== 4) return;
    if (eStopLatched) {
      setStatus({ tone: "warning", message: "Reset the software stop before diagnostic homing." });
      return;
    }
    const motor = motors.find((candidate) => candidate.id === motorId);
    if (!motor) return;
    let crossed = false;
    let timedOut = false;
    let finalRaw: number | null = null;
    let finalLogical: number | null = null;
    let startingSide: "negative" | "positive" | null = null;
    const feedbackRaw: number[] = [];
    const ok = await runAction(`Diagnostic Home Motor ${motor.id}`, async (client) => {
      const startingRaw = await client.readPosition(motor.id);
      const command = buildHomeCommand({ id: motor.id, name: motor.name, currentRaw: startingRaw });
      const initialDelta = startingRaw - NATIVE_MIDDLE_POSITION;
      startingSide = initialDelta < -HOME_ARRIVAL_TOLERANCE
        ? "negative"
        : initialDelta > HOME_ARRIVAL_TOLERANCE ? "positive" : null;
      if (startingSide === null) {
        throw new Error(`Motor ${motor.id} is already at center. Move it clearly to one side before running the diagnostic.`);
      }
      const packet = buildWritePositionPacket(motor.id, command.rawTarget, DIAGNOSTIC_HOME_SPEED, DIAGNOSTIC_HOME_ACCELERATION);
      const decoded = decodeWritePositionPacket(packet);
      if (!decoded || decoded.id !== motor.id || decoded.rawPosition !== NATIVE_MIDDLE_POSITION) {
        throw new Error(`Motor ${motor.id} diagnostic Home packet failed goal verification.`);
      }
      pushLog("system", `DIAGNOSTIC HOME Motor ${motor.id} (${motor.name}): native middle ${NATIVE_MIDDLE_POSITION}, starting ${startingRaw}, goal ${command.rawTarget}`);
      pushLog("system", `DIAGNOSTIC HOME Motor ${motor.id}: encoded goal bytes ${formatBytes(decoded.goalBytes)}, decoded TX goal ${decoded.rawPosition}, speed ${decoded.speed}, acceleration ${decoded.acceleration}`);
      pushLog("system", `Motor ${motor.id} MOVE attempt 1 (single send; retries disabled).`);
      await client.writePosExNoStatus(motor.id, command.rawTarget, DIAGNOSTIC_HOME_SPEED, DIAGNOSTIC_HOME_ACCELERATION);

      const startedAt = Date.now();
      let settledSamples = 0;
      while (Date.now() - startedAt < DIAGNOSTIC_HOME_TIMEOUT_MS) {
        await delay(DIAGNOSTIC_HOME_POLL_MS);
        const rawPosition = await client.readPosition(motor.id);
        const logicalPosition = rawPosition;
        const crossing = detectTargetCrossing(startingRaw, rawPosition);
        const motion = await client.readMotionFeedback(motor.id);
        feedbackRaw.push(rawPosition);
        finalRaw = rawPosition;
        finalLogical = logicalPosition;
        pushLog("system", `DIAGNOSTIC HOME Motor ${motor.id} feedback: raw ${rawPosition}, logical ${logicalPosition}, delta ${crossing.currentDelta}, present speed ${motion.presentSpeed}, moving ${motion.moving}`);
        if (crossing.crossed) {
          crossed = true;
          movementSequenceVersionRef.current += 1;
          await client.setTorque(motor.id, false);
          throw new Error(`Motor ${motor.id} crossed its calibrated center without stopping.`);
        }
        if (Math.abs(crossing.currentDelta) <= HOME_ARRIVAL_TOLERANCE && !motion.moving) {
          settledSamples += 1;
          if (settledSamples >= 3) break;
        } else {
          settledSamples = 0;
        }
      }
      timedOut = Date.now() - startedAt >= DIAGNOSTIC_HOME_TIMEOUT_MS;
      if (timedOut) {
        await client.setTorque(motor.id, false);
        throw new Error(`Motor ${motor.id} did not settle at its calibrated center before the diagnostic timeout.`);
      }
      pushLog("system", `DIAGNOSTIC HOME Motor ${motor.id} complete: feedback raw sequence [${feedbackRaw.join(", ")}], final raw ${finalRaw}, final logical ${finalLogical}, crossed center ${crossed}.`);
    }, { preserveStatusOnAbort: true });

    if (ok && !crossed && !timedOut && startingSide !== null) {
      const passedSide = startingSide;
      setDiagnosticHomeSides((previous) => {
        const updatedSides = { ...previous[motorId], [passedSide]: true };
        return { ...previous, [motorId]: updatedSides };
      });
    }
    if (finalRaw !== null && finalLogical !== null) {
      updateMotor(motor.key, {
        rawCurrent: finalRaw,
        current: finalLogical,
        activity: ok ? "idle" : "error",
        message: ok ? "Diagnostic Home passed from this starting side" : "Diagnostic Home failed"
      });
    }
    if (crossed) {
      setEStopLatched(true);
      setStatus({ tone: "error", message: `Motor ${motor.id} crossed its calibrated center without stopping. Torque was disabled for that motor.` });
    }
  }, [calibration.savedProfile, eStopLatched, motors, pushLog, runAction, updateMotor]);

  const homeAll = useCallback(async () => {
    const availability = getHomeAvailability({
      connected,
      eStopLatched,
      activeOperation: activeAction,
      configuredIds: motors.map((motor) => motor.id)
    });
    pushLog("system", `Home availability: connected=${connected}, emergencyStop=${eStopLatched}, busy=${activeAction !== null}, activeOperation=${activeAction ?? "none"}, hardwareMiddleConfigured=${calibration.savedProfile.hardwareMiddleConfigured}, disabledReason=${availability.allowed ? "none" : availability.reason}`);
    if (!availability.allowed) {
      setStatus({ tone: "warning", message: availability.reason });
      return;
    }
    const nativeTargets = createNativeHomeTargets(motors);
    const homeTargets = motors.map((motor) => ({ ...motor, target: nativeTargets.find((target) => target.id === motor.id)!.target }));
    // Reflect the intentional Home pose immediately; state updates never transmit commands.
    setMotors((previous) => previous.map((motor) => ({ ...motor, target: NATIVE_MIDDLE_POSITION })));
    const homeOutcome: { abortedMotorId: number | null } = { abortedMotorId: null };
    const finalReadings: Record<number, { raw: number; logical: number }> = {};
    const ok = await runAction(
      "Move all to home",
      async (client) => {
        const commands = [];
        pushLog("system", `HOME ALL: ${nativeTargets.map(({ id, target }) => `ID ${id} -> target ${target}`).join(", ")}`);
        pushLog("system", "HOME watchdog: fresh pre-move position reads starting.");
        for (const motor of motors) {
          const currentRaw = await client.readPosition(motor.id);
          const command = buildHomeCommand({
            id: motor.id,
            name: motor.name,
            currentRaw
          });
          commands.push(command);
          finalReadings[motor.id] = { raw: currentRaw, logical: command.currentLogical };
          const packet = buildWritePositionPacket(motor.id, command.rawTarget, speed, acceleration);
          pushLog("system", `HOME Motor ${motor.id} (${motor.name})`);
          pushLog("system", `currentRaw: ${command.currentRaw}`);
          pushLog("system", `nativeMiddle: ${NATIVE_MIDDLE_POSITION}`);
          pushLog("system", `currentLogical: ${command.currentLogical}`);
          pushLog("system", `logicalTarget: ${command.logicalTarget}`);
          pushLog("system", `calculatedRawTarget: ${command.rawTarget}`);
          pushLog("system", `packetRawTarget: ${packet[7] | (packet[8] << 8)}`);
          pushLog("system", `encodedTargetBytes: ${formatBytes(packet.slice(7, 9))}`);
          pushLog("system", `finalPacket: ${formatBytes(packet)}`);
        }

        await sendHomeCommandsOnce(commands, async (id, rawTarget) => {
          const commandId = nextMovementCommandId.current;
          nextMovementCommandId.current += 1;
          pushLog("system", `QUEUE: Motor ${id} command #${commandId}, target raw = ${rawTarget}`);
          pushLog("system", `TX intent: Motor ${id} command #${commandId}, target raw = ${rawTarget}`);
          await client.writePosEx(id, rawTarget, speed, acceleration);
        });

        const movingCommands = commands.filter((command) =>
          Math.abs(command.currentLogical - NATIVE_MIDDLE_POSITION) > HOME_ARRIVAL_TOLERANCE
        );
        const watchdogStates = new Map<number, HomeWatchdogState>();
        for (const command of movingCommands) {
          watchdogStates.set(command.id, {
            previousDistance: Math.abs(command.currentLogical - NATIVE_MIDDLE_POSITION),
            consecutiveAwaySamples: 0
          });
        }
        const startedAt = Date.now();
        let pending = movingCommands;
        while (pending.length > 0 && Date.now() - startedAt < HOME_WATCHDOG_TIMEOUT_MS) {
          await delay(HOME_WATCHDOG_POLL_MS);
          const stillMoving = [];
          for (const command of pending) {
            const rawPosition = await client.readPosition(command.id);
            const result = updateHomeWatchdog(
              rawPosition,
              watchdogStates.get(command.id) ?? null
            );
            watchdogStates.set(command.id, result.state);
            finalReadings[command.id] = { raw: rawPosition, logical: result.logicalPosition };
            pushLog(
              "system",
              `HOME WATCH Motor ${command.id}: raw ${rawPosition}, logical ${result.logicalPosition}, distance ${result.distance}, away count ${result.state.consecutiveAwaySamples}`
            );
            if (result.abort) {
              homeOutcome.abortedMotorId = command.id;
              movementSequenceVersionRef.current += 1;
              for (const motor of motors) {
                try {
                  await client.setTorque(motor.id, false);
                } catch (error) {
                  const detail = error instanceof Error ? error.message : String(error);
                  pushLog("error", `Home abort torque-off failed for Motor ${motor.id}: ${detail}`);
                }
              }
              throw new Error(`Motor ${command.id} is moving away from its calibrated middle.`);
            }
            if (result.distance > HOME_ARRIVAL_TOLERANCE) {
              stillMoving.push(command);
            }
          }
          pending = stillMoving;
        }
        if (pending.length > 0) {
          pushLog("warning", `HOME watchdog timed out while waiting for Motor ${pending.map((command) => command.id).join(", ")}; no additional movement command was sent.`);
        }
      },
      { preserveStatusOnAbort: true }
    );
    setMotors(homeTargets.map((motor) => ({
      ...motor,
      current: finalReadings[motor.id]?.logical ?? motor.current,
      rawCurrent: finalReadings[motor.id]?.raw ?? motor.rawCurrent,
      activity: ok ? "commanded" : "error",
      message: ok ? `Home target ${NATIVE_MIDDLE_POSITION} acknowledged` : "Home sequence failed"
    })));
    if (homeOutcome.abortedMotorId !== null) {
      setEStopLatched(true);
      const message = `Home aborted: Motor ${homeOutcome.abortedMotorId} is moving away from its calibrated middle.`;
      setStatus({ tone: "error", message });
      pushLog("error", `${message} Torque was disabled for all configured motors; operator reset is required.`);
      return;
    }
  }, [acceleration, activeAction, calibration.savedProfile.hardwareMiddleConfigured, connected, eStopLatched, motors, pushLog, runAction, speed]);

  const setMotorTorque = useCallback(async (key: MotorKey, enabled: boolean) => {
    const motor = motors.find((candidate) => candidate.key === key);
    if (!motor) {
      return;
    }
    if (enabled && eStopLatched) {
      setStatus({ tone: "warning", message: "Reset the software stop before enabling torque." });
      return;
    }
    await runAction(
      `${enabled ? "Enable" : "Release"} ${motor.name} torque`,
      async (client) => { await client.setTorque(motor.id, enabled); }
    );
  }, [eStopLatched, motors, runAction]);

  const setAllTorque = useCallback(
    async (enabled: boolean) => {
      if (enabled && eStopLatched) {
        setStatus({ tone: "warning", message: "Reset the software stop before enabling torque." });
        return;
      }
      const ok = await runAction(enabled ? "Enable all torque" : "Release all torque", async (client) => {
        await setAllTorqueWithClient(client, enabled);
      });
      if (ok) setAllMotorsReleased(!enabled);
    },
    [eStopLatched, runAction, setAllTorqueWithClient]
  );

  const busy = activeAction !== null;
  const runRecordAndPlayOperation = useCallback(
    (
      label: string,
      operation: (client: ScsServoClient) => Promise<void>,
      onError: (message: string) => void
    ) => runAction(label, operation, { onError, preserveStatusOnAbort: true }),
    [runAction]
  );
  const recordAndPlay = useRecordAndPlay({
    connected,
    eStopLatched,
    controllerBusy: busy,
    hasSavedCalibration: calibration.hasSavedMidpoint,
    calibration: calibration.savedProfile,
    getSavedInitialPose: initialPose.getLoadablePose,
    runOperation: runRecordAndPlayOperation,
    readLogicalPose: (client, signal) => readLogicalPose(client, signal),
    moveToLogicalPose: (client, pose, signal) => moveToLogicalPose(client, pose, signal),
    setAllTorque: (client, enabled, signal) => setAllTorqueWithClient(client, enabled, signal),
    pushLog
  });
  useEffect(() => {
    invalidateRecordingForMotorIdChangeRef.current = recordAndPlay.invalidateForMotorIdChange;
  }, [recordAndPlay.invalidateForMotorIdChange]);

  const emergencyStop = useCallback(async () => {
    movementSequenceVersionRef.current += 1;
    recordAndPlay.cancelActive();
    setEStopLatched(true);
    setStatus({
      tone: "warning",
      message: "Software stop latched. Sending torque-off commands to all configured servos."
    });
    pushLog("warning", "SOFTWARE STOP latched by operator.");

    const client = clientRef.current;
    if (!client?.connected) {
      pushLog("warning", "Torque-off commands were not sent because the serial link is closed.");
      return;
    }

    setActiveAction("Software stop");
    const failures: string[] = [];
    try {
      for (const motor of motors) {
        try {
          await client.setTorque(motor.id, false);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${motor.name}: ${message}`);
          pushLog("error", `Torque-off failed for ${motor.name}: ${message}`);
        }
      }

      if (failures.length === 0) {
        setStatus({
          tone: "warning",
          message: "Software stop latched and torque-off was acknowledged by all five servos."
        });
      } else {
        setStatus({
          tone: "error",
          message: `Software stop remains latched; ${failures.length} torque-off command(s) failed.`
        });
      }
    } finally {
      setActiveAction((current) => current === "Software stop" ? null : current);
    }
  }, [motors, pushLog, recordAndPlay.cancelActive]);

  const resetEmergencyStop = useCallback(() => {
    setEStopLatched(false);
    setStatus({
      tone: "warning",
      message: "Software stop reset. Torque remains off until explicitly enabled."
    });
    pushLog("warning", "Software stop reset; torque was not automatically re-enabled.");
  }, [pushLog]);

  const clearLogs = useCallback(() => {
    pendingLogsRef.current = [];
    setLogs([]);
  }, []);

  const leaveControllerPage = useCallback(() => {
    movementSequenceVersionRef.current += 1;
    recordAndPlay.cancelActive();
  }, [recordAndPlay.cancelActive]);

  const motionDisabled = !connected || busy || eStopLatched;
  const homeAvailability = getHomeAvailability({
    connected,
    eStopLatched,
    activeOperation: activeAction,
    configuredIds: motors.map((motor) => motor.id)
  });
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      pushLog("system", `Home availability: connected=${connected}, emergencyStop=${eStopLatched}, busy=${busy}, activeOperation=${activeAction ?? "none"}, hardwareMiddleConfigured=${calibration.savedProfile.hardwareMiddleConfigured}, disabledReason=${homeAvailability.allowed ? "none" : homeAvailability.reason}`);
    }
  }, [activeAction, busy, calibration.savedProfile.hardwareMiddleConfigured, connected, eStopLatched, pushLog]);
  const targetValidity = useMemo(() => Object.fromEntries(
    motors.map((motor) => [
      motor.key,
      validateLogicalTarget({
        motor,
        logicalTarget: motor.target,
        calibration: calibration.savedProfile
      }).valid
    ])
  ) as Record<MotorKey, boolean>, [calibration.savedProfile, motors]);
  const moveAllDisabled = motionDisabled || motors.some((motor) => !targetValidity[motor.key]);

  const summary = useMemo(
    () => ({
      knownPositions: motors.filter((motor) => motor.current !== null).length,
      configuredMotors: motors.length
    }),
    [motors]
  );

  return {
    serialSupported,
    baudRate,
    setBaudRate,
    connected,
    busy,
    activeAction,
    eStopLatched,
    allMotorsReleased,
    leaveControllerPage,
    speed,
    setSpeed: (value: number) => setSpeedState(clamp(value, 0, 4095)),
    acceleration,
    setAcceleration: (value: number) => setAccelerationState(clamp(value, 0, 255)),
    motors,
    status,
    logs,
    summary,
    motionDisabled,
    homeAvailability,
    moveAllDisabled,
    targetValidity,
    connect,
    disconnect,
    setMotorTarget,
    jogMotor,
    moveMotor,
    readMotor,
    pingMotor,
    motorIdSetup: {
      ping: pingSetupServoId,
      detect: detectSetupServoIds,
      scanFull: scanFullSetupServoIds,
      readPosition: readSetupServoPosition,
      readModelNumber: readSetupServoModelNumber,
      readIdRegister: readSetupServoIdRegister,
      assign: changeSetupServoId,
      verifyConfigured: verifySetupServoIds,
      diagnostics: servoDiagnostics
    },
    moveAll,
    readAll,
    homeAll,
    setMotorTorque,
    setAllTorque,
    emergencyStop,
    resetEmergencyStop,
    clearLogs,
    calibration: {
      ...calibration,
      setAllHardwareMiddles,
      centerDiagnostics,
      verifyMiddle: verifyCalibrationMiddle,
      verifyIdMapping: verifyCalibrationIdMapping,
      homeDiagnosticMotor,
      diagnosticHomeVerified,
      diagnosticHomeSides
    },
    initialPosition: {
      ...initialPose,
      captureAndSave: captureAndSaveInitialPose,
      moveToInitial: moveToInitialPosition,
      clear: clearSavedInitialPosition
    },
    recordAndPlay
  };
}
