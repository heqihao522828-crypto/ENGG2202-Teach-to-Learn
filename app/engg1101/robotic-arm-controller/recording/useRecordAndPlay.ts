import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalibrationProfile } from "../calibration/calibrationStorage";
import { MOTOR_CONFIGS } from "../controller/motors";
import type { LogKind } from "../controller/types";
import {
  cloneInitialPose,
  type InitialPose,
  type MotorId
} from "../initialPose/initialPoseStorage";
import type { ScsServoClient } from "../webserial/scservo";
import {
  clearLatestRecording,
  createRecordedSequence,
  invalidateLatestRecordingForMotorIdChange,
  loadLatestRecording,
  MAX_RECORDING_DURATION_MS,
  MAX_RECORDING_FRAMES,
  persistLatestRecording,
  type RecordedPoseFrame,
  type RecordedSequence
} from "./recordingStorage";
import {
  validateLogicalPoseForMovement,
  validateRecordingForPlayback
} from "./recordingValidation";

export const INITIAL_POSITION_TOLERANCE = 10;
export const INITIAL_POSITION_TIMEOUT_MS = 10_000;
export const RECORD_POSITION_CHANGE_THRESHOLD = 2;
export const RECORD_KEYFRAME_INTERVAL_MS = 1000;
const TORQUE_RELEASE_SETTLE_MS = 250;
const MAX_CONSECUTIVE_SAMPLE_FAILURES = 3;

export type RecordAndPlayMode =
  | "idle"
  | "preparing-recording"
  | "moving-to-initial"
  | "releasing-torque"
  | "recording"
  | "stopping-recording"
  | "recording-ready"
  | "preparing-playback"
  | "playing"
  | "stopping-playback"
  | "playback-stopped"
  | "complete"
  | "error";

type OperationRunner = (
  label: string,
  operation: (client: ScsServoClient) => Promise<void>,
  onError: (message: string) => void
) => Promise<boolean>;

type UseRecordAndPlayOptions = {
  connected: boolean;
  eStopLatched: boolean;
  controllerBusy: boolean;
  hasSavedCalibration: boolean;
  calibration: CalibrationProfile;
  getSavedInitialPose: () =>
    | { valid: true; pose: InitialPose }
    | { valid: false; error: string };
  runOperation: OperationRunner;
  readLogicalPose: (client: ScsServoClient, signal: AbortSignal) => Promise<InitialPose>;
  moveToLogicalPose: (
    client: ScsServoClient,
    pose: InitialPose,
    signal: AbortSignal,
    source: "initial" | "playback"
  ) => Promise<void>;
  setAllTorque: (client: ScsServoClient, enabled: boolean, signal: AbortSignal) => Promise<void>;
  pushLog: (kind: LogKind, message: string) => void;
};

function monotonicNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.reject(new DOMException("Operation cancelled.", "AbortError"));
  }
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Operation cancelled.", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function changedEnough(previous: RecordedPoseFrame | undefined, next: InitialPose, elapsedMs: number): boolean {
  if (!previous || elapsedMs - previous.elapsedMs >= RECORD_KEYFRAME_INTERVAL_MS) {
    return true;
  }
  return MOTOR_CONFIGS.some((motor) =>
    Math.abs(next[motor.id as MotorId] - previous.positions[motor.id as MotorId]) >=
      RECORD_POSITION_CHANGE_THRESHOLD
  );
}

function outsideArrivalTolerance(actual: InitialPose, target: InitialPose): string[] {
  return MOTOR_CONFIGS.filter((motor) =>
    Math.abs(actual[motor.id as MotorId] - target[motor.id as MotorId]) > INITIAL_POSITION_TOLERANCE
  ).map((motor) => {
    const id = motor.id as MotorId;
    return `${motor.name} (ID ${id}): actual ${actual[id]}, target ${target[id]}`;
  });
}

function isRecordingMode(mode: RecordAndPlayMode): boolean {
  return [
    "preparing-recording",
    "moving-to-initial",
    "releasing-torque",
    "recording",
    "stopping-recording"
  ].includes(mode);
}

function isPlaybackMode(mode: RecordAndPlayMode): boolean {
  return ["preparing-playback", "playing", "stopping-playback"].includes(mode);
}

export function useRecordAndPlay(options: UseRecordAndPlayOptions) {
  const initialLoad = useMemo(() => loadLatestRecording(), []);
  const [mode, setMode] = useState<RecordAndPlayMode>(initialLoad.recording ? "recording-ready" : "idle");
  const [recording, setRecording] = useState<RecordedSequence | null>(initialLoad.recording);
  const [message, setMessage] = useState(initialLoad.error ?? "No recording has been captured yet.");
  const [requestedSampleRateHz, setRequestedSampleRateHzState] = useState(5);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(initialLoad.recording?.durationMs ?? 0);
  const [frameCount, setFrameCount] = useState(initialLoad.recording?.frames.length ?? 0);
  const [actualSampleRateHz, setActualSampleRateHz] = useState(initialLoad.recording?.actualSampleRateHz ?? 0);
  const operationAbortRef = useRef<AbortController | null>(null);
  const cancellationReasonRef = useRef<"user" | "emergency-stop" | "disconnect" | null>(null);
  const stopRecordingRequestedRef = useRef(false);
  const mountedRef = useRef(true);

  const compatibility = useMemo(() => {
    if (!recording) {
      return { compatible: false, error: "No saved recording." };
    }
    const result = validateRecordingForPlayback(
      recording,
      options.calibration
    );
    return result.recording
      ? { compatible: true, error: null }
      : { compatible: false, error: result.error ?? "Recording is not compatible." };
  }, [options.calibration, recording]);

  useEffect(() => () => {
    mountedRef.current = false;
    operationAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!options.connected || options.eStopLatched) {
      cancellationReasonRef.current = options.eStopLatched ? "emergency-stop" : "disconnect";
      operationAbortRef.current?.abort();
    }
  }, [options.connected, options.eStopLatched]);

  const setRequestedSampleRateHz = useCallback((value: number) => {
    setRequestedSampleRateHzState(Math.max(1, Math.min(10, Math.round(value))));
  }, []);

  const setPlaybackSpeed = useCallback((value: number) => {
    if ([0.5, 1, 1.5, 2].includes(value)) {
      setPlaybackSpeedState(value);
    }
  }, []);

  const waitForArrival = useCallback(async (
    client: ScsServoClient,
    target: InitialPose,
    signal: AbortSignal
  ) => {
    const deadline = monotonicNow() + INITIAL_POSITION_TIMEOUT_MS;
    let outside: string[] = [];
    while (monotonicNow() <= deadline) {
      const actual = await options.readLogicalPose(client, signal);
      outside = outsideArrivalTolerance(actual, target);
      if (outside.length === 0) {
        return;
      }
      await wait(200, signal);
    }
    throw new Error(`Initial Position was not reached within 10 seconds. Outside tolerance: ${outside.join("; ")}.`);
  }, [options]);

  const startRecording = useCallback(async () => {
    if (isRecordingMode(mode) || isPlaybackMode(mode)) {
      return;
    }
    if (!options.connected || options.eStopLatched || options.controllerBusy || !options.hasSavedCalibration) {
      setMode("error");
      setMessage("Recording cannot start until serial is connected, calibration is valid, and the controller is idle.");
      return;
    }
    const saved = options.getSavedInitialPose();
    if (!saved.valid) {
      setMode("error");
      setMessage(saved.error);
      return;
    }
    const initialSnapshot = cloneInitialPose(saved.pose);
    const poseError = validateLogicalPoseForMovement(
      initialSnapshot,
      options.calibration,
      "Saved Initial Position"
    );
    if (poseError) {
      setMode("error");
      setMessage(poseError);
      return;
    }

    const abortController = new AbortController();
    operationAbortRef.current = abortController;
    cancellationReasonRef.current = null;
    stopRecordingRequestedRef.current = false;
    setMode("preparing-recording");
    setMessage("Preparing the saved Initial Position snapshot.");
    setElapsedMs(0);
    setFrameCount(0);
    setActualSampleRateHz(0);

    let operationError = "Recording failed.";
    let operationHandledError = false;
    const ok = await options.runOperation("Record posture sequence", async (client) => {
      const signal = abortController.signal;
      let torqueReleased = false;
      const frames: RecordedPoseFrame[] = [];
      let recordingStart = 0;
      let finalDuration = 0;
      let completedSampleCycles = 0;
      let terminalError: string | null = null;
      let cleanStopReason = "Recording stopped by user.";

      const readCompleteSample = async (): Promise<InitialPose> => {
        let firstError: unknown;
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            return await options.readLogicalPose(client, signal);
          } catch (error) {
            firstError = error;
            if (signal.aborted || attempt === 1) {
              throw error;
            }
            options.pushLog("warning", "A complete recording sample failed; retrying once.");
          }
        }
        throw firstError;
      };

      const appendFrame = (positions: InitialPose, force: boolean) => {
        const elapsed = Math.max(0, Math.round(monotonicNow() - recordingStart));
        if (force && frames.length >= MAX_RECORDING_FRAMES) {
          frames[frames.length - 1] = {
            elapsedMs: elapsed,
            positions: cloneInitialPose(positions)
          };
        } else if (force || changedEnough(frames[frames.length - 1], positions, elapsed)) {
          frames.push({ elapsedMs: elapsed, positions: cloneInitialPose(positions) });
        }
        setFrameCount(frames.length);
        finalDuration = elapsed;
        setElapsedMs(elapsed);
        setActualSampleRateHz(elapsed > 0
          ? Math.round((completedSampleCycles * 1000 / elapsed) * 10) / 10
          : 0);
      };

      try {
        signal.throwIfAborted();
        setMode("moving-to-initial");
        setMessage("Enabling torque and moving to the saved Initial Position.");
        await options.setAllTorque(client, true, signal);
        await options.moveToLogicalPose(client, initialSnapshot, signal, "initial");
        await waitForArrival(client, initialSnapshot, signal);

        setMode("releasing-torque");
        setMessage("Initial Position confirmed. Releasing all five motors.");
        await options.setAllTorque(client, false, signal);
        torqueReleased = true;
        await wait(TORQUE_RELEASE_SETTLE_MS, signal);

        recordingStart = monotonicNow();
        setMode("recording");
        setMessage("Recording complete five-motor posture frames.");
        let nextSampleAt = recordingStart;
        let consecutiveFailures = 0;
        const intervalMs = 1000 / requestedSampleRateHz;

        while (!stopRecordingRequestedRef.current && !signal.aborted) {
          if (frames.length >= MAX_RECORDING_FRAMES - 1) {
            cleanStopReason = `Recording stopped at the ${MAX_RECORDING_FRAMES}-frame limit.`;
            break;
          }
          if (monotonicNow() - recordingStart >= MAX_RECORDING_DURATION_MS) {
            cleanStopReason = "Recording stopped at the five-minute duration limit.";
            break;
          }
          try {
            const positions = await readCompleteSample();
            const validationError = validateLogicalPoseForMovement(
              positions,
              options.calibration,
              "Recorded sample"
            );
            if (validationError) {
              throw new Error(validationError);
            }
            completedSampleCycles += 1;
            appendFrame(positions, frames.length === 0);
            consecutiveFailures = 0;
          } catch (error) {
            if (signal.aborted) {
              throw error;
            }
            consecutiveFailures += 1;
            const detail = error instanceof Error ? error.message : String(error);
            options.pushLog("error", `Recording sample cycle ${consecutiveFailures} failed: ${detail}`);
            if (consecutiveFailures >= MAX_CONSECUTIVE_SAMPLE_FAILURES) {
              terminalError = `Recording stopped because position reads repeatedly failed for ${detail}`;
              break;
            }
          }
          nextSampleAt += intervalMs;
          const remaining = nextSampleAt - monotonicNow();
          if (remaining > 0 && !stopRecordingRequestedRef.current) {
            await wait(remaining, signal);
          } else if (remaining <= 0) {
            nextSampleAt = monotonicNow();
          }
        }

        if (!signal.aborted) {
          setMode("stopping-recording");
          setMessage("Finishing the active sample and capturing the final posture.");
          try {
            const finalPose = await readCompleteSample();
            const finalError = validateLogicalPoseForMovement(
              finalPose,
              options.calibration,
              "Final recorded sample"
            );
            if (finalError) {
              throw new Error(finalError);
            }
            appendFrame(finalPose, true);
          } catch (error) {
            options.pushLog("warning", `Final recording read was not saved: ${error instanceof Error ? error.message : String(error)}`);
          }
        }

        if (frames.length < 2) {
          terminalError = terminalError ?? "No meaningful posture sequence was captured; at least two complete frames are required.";
          if (recording) {
            setElapsedMs(recording.durationMs);
            setFrameCount(recording.frames.length);
            setActualSampleRateHz(recording.actualSampleRateHz);
          }
        } else {
          const completed = createRecordedSequence(
            initialSnapshot,
            frames,
            Math.max(finalDuration, frames[frames.length - 1]?.elapsedMs ?? 0),
            requestedSampleRateHz,
            finalDuration > 0 ? completedSampleCycles * 1000 / finalDuration : 0,
            options.calibration
          );
          persistLatestRecording(completed);
          setRecording(completed);
          setElapsedMs(completed.durationMs);
          setFrameCount(completed.frames.length);
          setActualSampleRateHz(completed.actualSampleRateHz);
        }

        if (terminalError) {
          operationError = terminalError;
          setMode("error");
          setMessage(`${terminalError} Motor torque remains released.`);
          options.pushLog("error", terminalError);
          throw new Error(terminalError);
        } else {
          setMode("recording-ready");
          setMessage(`${cleanStopReason} Motor torque remains released.`);
        }
      } catch (error) {
        operationHandledError = true;
        const detail = error instanceof Error ? error.message : String(error);
        operationError = detail;
        if (torqueReleased && frames.length >= 2) {
          try {
            const partial = createRecordedSequence(
              initialSnapshot,
              frames,
              Math.max(finalDuration, frames[frames.length - 1]?.elapsedMs ?? 0),
              requestedSampleRateHz,
              finalDuration > 0 ? completedSampleCycles * 1000 / finalDuration : 0,
              options.calibration
            );
            persistLatestRecording(partial);
            setRecording(partial);
            setElapsedMs(partial.durationMs);
            setFrameCount(partial.frames.length);
            setActualSampleRateHz(partial.actualSampleRateHz);
          } catch (storageError) {
            options.pushLog("error", `Complete frames could not be preserved: ${storageError instanceof Error ? storageError.message : String(storageError)}`);
          }
        } else if (recording) {
          setElapsedMs(recording.durationMs);
          setFrameCount(recording.frames.length);
          setActualSampleRateHz(recording.actualSampleRateHz);
        }
        if (mountedRef.current) {
          setMode("error");
          setMessage(torqueReleased
            ? `${detail} Motor torque remains released.`
            : `${detail} Torque was not released.`);
        }
        throw error;
      }
    }, (error) => {
      operationError = error;
    });

    operationAbortRef.current = null;
    if (!ok && !operationHandledError && mountedRef.current) {
      setMode("error");
      setMessage(operationError);
    }
  }, [mode, options, recording, requestedSampleRateHz, waitForArrival]);

  const stopRecording = useCallback(() => {
    if (mode === "recording") {
      stopRecordingRequestedRef.current = true;
      setMode("stopping-recording");
      setMessage("Stopping after the active sample and one final fresh read.");
    }
  }, [mode]);

  const playRecording = useCallback(async () => {
    if (isRecordingMode(mode) || isPlaybackMode(mode) || !recording) {
      return;
    }
    if (!options.connected || options.eStopLatched || options.controllerBusy || !options.hasSavedCalibration) {
      setMode("error");
      setMessage("Playback cannot start until serial is connected, calibration is valid, and the controller is idle.");
      return;
    }
    const validation = validateRecordingForPlayback(
      recording,
      options.calibration
    );
    if (!validation.recording) {
      setMode("error");
      setMessage(validation.error ?? "Recording validation failed.");
      return;
    }
    const playbackSnapshot = validation.recording;
    const abortController = new AbortController();
    operationAbortRef.current = abortController;
    cancellationReasonRef.current = null;
    setMode("preparing-playback");
    setMessage("Prevalidating the full recording before movement.");
    let operationError = "Playback failed.";
    let playbackCancelled = false;

    const ok = await options.runOperation("Play posture sequence", async (client) => {
      const signal = abortController.signal;
      try {
        signal.throwIfAborted();
        await options.setAllTorque(client, true, signal);
        await options.moveToLogicalPose(client, playbackSnapshot.initialPose, signal, "playback");
        await waitForArrival(client, playbackSnapshot.initialPose, signal);

        setMode("playing");
        setMessage("Playing the recorded posture sequence.");
        const playbackStart = monotonicNow();
        let nextIndex = 0;
        while (nextIndex < playbackSnapshot.frames.length) {
          signal.throwIfAborted();
          const elapsed = monotonicNow() - playbackStart;
          const nextDueAt = playbackSnapshot.frames[nextIndex].elapsedMs / playbackSpeed;
          if (elapsed < nextDueAt) {
            await wait(nextDueAt - elapsed, signal);
            continue;
          }
          let dueIndex = nextIndex;
          while (
            dueIndex + 1 < playbackSnapshot.frames.length &&
            playbackSnapshot.frames[dueIndex + 1].elapsedMs / playbackSpeed <= monotonicNow() - playbackStart
          ) {
            dueIndex += 1;
          }
          if (dueIndex > nextIndex) {
            options.pushLog("warning", `Playback timing fell behind; coalesced ${dueIndex - nextIndex} obsolete frame(s).`);
          }
          await options.moveToLogicalPose(
            client,
            playbackSnapshot.frames[dueIndex].positions,
            signal,
            "playback"
          );
          nextIndex = dueIndex + 1;
        }
        setMode("complete");
        setMessage("Playback complete.");
      } catch (error) {
        operationError = error instanceof Error ? error.message : String(error);
        if (signal.aborted) {
          playbackCancelled = true;
          setMode("playback-stopped");
          setMessage(cancellationReasonRef.current === "emergency-stop"
            ? "Playback stopped by the software emergency stop."
            : cancellationReasonRef.current === "disconnect"
              ? "Playback stopped because serial disconnected."
              : "Playback stopped by user.");
          throw error;
        }
        setMode("error");
        setMessage(operationError);
        throw error;
      }
    }, (error) => {
      operationError = error;
    });
    operationAbortRef.current = null;
    if (!ok && !playbackCancelled && mountedRef.current) {
      setMode("error");
      setMessage(operationError);
    }
  }, [mode, options, playbackSpeed, recording, waitForArrival]);

  const stopPlayback = useCallback(() => {
    if (mode === "playing" || mode === "preparing-playback") {
      setMode("stopping-playback");
      setMessage("Stopping playback after the active coordinated frame.");
      cancellationReasonRef.current = "user";
      operationAbortRef.current?.abort();
    }
  }, [mode]);

  const cancelActive = useCallback((reason: "emergency-stop" | "disconnect" = "emergency-stop") => {
    cancellationReasonRef.current = reason;
    operationAbortRef.current?.abort();
  }, []);

  const deleteRecording = useCallback(() => {
    if (isRecordingMode(mode) || isPlaybackMode(mode)) {
      return false;
    }
    try {
      clearLatestRecording();
      setRecording(null);
      setMode("idle");
      setMessage("Latest recording deleted. Initial Position and calibration were unchanged.");
      setElapsedMs(0);
      setFrameCount(0);
      setActualSampleRateHz(0);
      return true;
    } catch (error) {
      setMode("error");
      setMessage(error instanceof Error ? error.message : "Latest recording could not be deleted.");
      return false;
    }
  }, [mode]);

  const invalidateForMotorIdChange = useCallback(() => {
    if (!recording) {
      return;
    }
    try {
      const invalidated = invalidateLatestRecordingForMotorIdChange(recording);
      setRecording(invalidated);
      setMode("error");
      setMessage("Calibration or motor assignment changed after this recording was created. Record the sequence again.");
    } catch (error) {
      setMode("error");
      setMessage(error instanceof Error ? error.message : "Recording invalidation could not be saved.");
    }
  }, [recording]);

  const initialPoseResult = options.getSavedInitialPose();
  const recordingActive = isRecordingMode(mode);
  const playbackActive = isPlaybackMode(mode);
  const startDisabledReason = !options.connected
    ? "Connect Web Serial first."
    : options.eStopLatched
      ? "Reset the software emergency stop first."
      : options.controllerBusy || recordingActive || playbackActive
        ? "Wait for the active controller operation to finish."
        : !options.hasSavedCalibration
          ? "Set the hardware middle for all motors first."
          : !initialPoseResult.valid
            ? initialPoseResult.error
            : null;
  const playDisabledReason = !recording
    ? "Capture a recording first."
    : !options.connected
      ? "Connect Web Serial first."
      : options.eStopLatched
        ? "Reset the software emergency stop first."
        : options.controllerBusy || recordingActive || playbackActive
          ? "Wait for the active controller operation to finish."
          : !compatibility.compatible
            ? compatibility.error
            : null;

  return {
    mode,
    recording,
    message,
    elapsedMs,
    frameCount,
    actualSampleRateHz,
    requestedSampleRateHz,
    setRequestedSampleRateHz,
    playbackSpeed,
    setPlaybackSpeed,
    recordingActive,
    playbackActive,
    compatibility,
    savedInitialPositionValid: initialPoseResult.valid,
    startDisabledReason,
    playDisabledReason,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    cancelActive,
    invalidateForMotorIdChange,
    deleteRecording
  };
}
