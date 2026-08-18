import type { CalibrationProfile } from "../calibration/calibrationStorage";
import {
  cloneInitialPose,
  createCalibrationFingerprint,
  type InitialPose,
  type MotorId
} from "../initialPose/initialPoseStorage";

export const LATEST_RECORDING_STORAGE_KEY = "aem.robot-arm.latest-recording";
export const RECORDING_SCHEMA_VERSION = 1;
export const MAX_RECORDING_DURATION_MS = 5 * 60 * 1000;
export const MAX_RECORDING_FRAMES = 3000;

const MOTOR_IDS: MotorId[] = [1, 2, 3, 4, 5];

export type RecordedPoseFrame = {
  elapsedMs: number;
  positions: InitialPose;
};

export type RecordedSequence = {
  version: 1;
  createdAt: string;
  durationMs: number;
  requestedSampleRateHz: number;
  actualSampleRateHz: number;
  initialPose: InitialPose;
  frames: RecordedPoseFrame[];
  calibrationFingerprint: string;
  invalidation?: {
    reason: "motor-ids-changed" | "hardware-middle-changed";
    invalidatedAt: string;
  };
};

export type RecordingLoadResult = {
  recording: RecordedSequence | null;
  error: string | null;
};

function parsePose(value: unknown, label: string): { pose: InitialPose | null; error: string | null } {
  if (!value || typeof value !== "object") {
    return { pose: null, error: `${label} must contain five motor positions.` };
  }
  const source = value as Record<string, unknown>;
  const keys = Object.keys(source).sort();
  if (keys.length !== MOTOR_IDS.length || keys.some((key, index) => key !== String(MOTOR_IDS[index]))) {
    return { pose: null, error: `${label} must contain exactly motor IDs 1–5.` };
  }
  const pose = {} as InitialPose;
  for (const id of MOTOR_IDS) {
    const position = source[String(id)];
    if (!Number.isFinite(position) || !Number.isInteger(position)) {
      return { pose: null, error: `${label}, motor ID ${id}, must be a finite integer.` };
    }
    pose[id] = position as number;
  }
  return { pose, error: null };
}

export function validateRecordedSequence(value: unknown): RecordingLoadResult {
  if (!value || typeof value !== "object") {
    return { recording: null, error: "Saved recording is not a valid object." };
  }
  const candidate = value as Partial<RecordedSequence>;
  if (candidate.version !== RECORDING_SCHEMA_VERSION) {
    return { recording: null, error: "Saved recording uses an unsupported schema version." };
  }
  if (typeof candidate.createdAt !== "string" || Number.isNaN(Date.parse(candidate.createdAt))) {
    return { recording: null, error: "Saved recording has an invalid creation date." };
  }
  if (
    !Number.isFinite(candidate.durationMs) ||
    !Number.isInteger(candidate.durationMs) ||
    (candidate.durationMs as number) < 0 ||
    (candidate.durationMs as number) > MAX_RECORDING_DURATION_MS
  ) {
    return { recording: null, error: "Saved recording duration is invalid." };
  }
  if (
    !Number.isFinite(candidate.requestedSampleRateHz) ||
    !Number.isInteger(candidate.requestedSampleRateHz) ||
    (candidate.requestedSampleRateHz as number) < 1 ||
    (candidate.requestedSampleRateHz as number) > 10
  ) {
    return { recording: null, error: "Saved recording sample rate is invalid." };
  }
  if (
    !Number.isFinite(candidate.actualSampleRateHz) ||
    (candidate.actualSampleRateHz as number) < 0 ||
    (candidate.actualSampleRateHz as number) > 100
  ) {
    return { recording: null, error: "Saved recording actual sample rate is invalid." };
  }
  if (typeof candidate.calibrationFingerprint !== "string" || candidate.calibrationFingerprint.length === 0) {
    return { recording: null, error: "Saved recording is missing calibration revision data." };
  }
  let invalidation: RecordedSequence["invalidation"];
  if (candidate.invalidation !== undefined) {
    if (
      (candidate.invalidation.reason !== "motor-ids-changed" && candidate.invalidation.reason !== "hardware-middle-changed") ||
      typeof candidate.invalidation.invalidatedAt !== "string" ||
      Number.isNaN(Date.parse(candidate.invalidation.invalidatedAt))
    ) {
      return { recording: null, error: "Saved recording has invalid motor-assignment metadata." };
    }
    invalidation = { ...candidate.invalidation };
  }
  const initial = parsePose(candidate.initialPose, "Recorded Initial Position");
  if (!initial.pose) {
    return { recording: null, error: initial.error };
  }
  if (!Array.isArray(candidate.frames) || candidate.frames.length < 2 || candidate.frames.length > MAX_RECORDING_FRAMES) {
    return { recording: null, error: `Saved recording must contain 2–${MAX_RECORDING_FRAMES} complete frames.` };
  }

  const frames: RecordedPoseFrame[] = [];
  let previousElapsed = -1;
  for (let index = 0; index < candidate.frames.length; index += 1) {
    const frame = candidate.frames[index] as Partial<RecordedPoseFrame> | null;
    if (
      !frame ||
      !Number.isFinite(frame.elapsedMs) ||
      !Number.isInteger(frame.elapsedMs) ||
      (frame.elapsedMs as number) < 0 ||
      (frame.elapsedMs as number) < previousElapsed ||
      (frame.elapsedMs as number) > (candidate.durationMs as number)
    ) {
      return { recording: null, error: `Saved recording frame ${index + 1} has an invalid timestamp.` };
    }
    const parsed = parsePose(frame.positions, `Saved recording frame ${index + 1}`);
    if (!parsed.pose) {
      return { recording: null, error: parsed.error };
    }
    previousElapsed = frame.elapsedMs as number;
    frames.push({ elapsedMs: previousElapsed, positions: parsed.pose });
  }

  return {
    recording: {
      version: 1,
      createdAt: candidate.createdAt,
      durationMs: candidate.durationMs as number,
      requestedSampleRateHz: candidate.requestedSampleRateHz as number,
      actualSampleRateHz: candidate.actualSampleRateHz as number,
      initialPose: initial.pose,
      frames,
      calibrationFingerprint: candidate.calibrationFingerprint,
      ...(invalidation ? { invalidation } : {})
    },
    error: null
  };
}

export function createRecordedSequence(
  initialPose: InitialPose,
  frames: RecordedPoseFrame[],
  durationMs: number,
  requestedSampleRateHz: number,
  actualSampleRateHz: number,
  calibration: CalibrationProfile
): RecordedSequence {
  const roundedDuration = Math.max(0, Math.min(MAX_RECORDING_DURATION_MS, Math.round(durationMs)));
  const recording: RecordedSequence = {
    version: 1,
    createdAt: new Date().toISOString(),
    durationMs: roundedDuration,
    requestedSampleRateHz,
    actualSampleRateHz: Math.max(0, Math.round(actualSampleRateHz * 10) / 10),
    initialPose: cloneInitialPose(initialPose),
    frames: frames.map((frame) => ({
      elapsedMs: Math.min(roundedDuration, Math.max(0, Math.round(frame.elapsedMs))),
      positions: cloneInitialPose(frame.positions)
    })),
    calibrationFingerprint: createCalibrationFingerprint(calibration)
  };
  const validated = validateRecordedSequence(recording);
  if (!validated.recording) {
    throw new Error(validated.error ?? "Recording is invalid.");
  }
  return validated.recording;
}

export function loadLatestRecording(): RecordingLoadResult {
  if (typeof window === "undefined") {
    return { recording: null, error: null };
  }
  try {
    const stored = window.localStorage.getItem(LATEST_RECORDING_STORAGE_KEY);
    return stored ? validateRecordedSequence(JSON.parse(stored)) : { recording: null, error: null };
  } catch {
    return { recording: null, error: "Saved recording could not be read." };
  }
}

export function persistLatestRecording(recording: RecordedSequence): void {
  const validated = validateRecordedSequence(recording);
  if (!validated.recording) {
    throw new Error(validated.error ?? "Recording is invalid.");
  }
  window.localStorage.setItem(LATEST_RECORDING_STORAGE_KEY, JSON.stringify(validated.recording));
}

export function clearLatestRecording(): void {
  window.localStorage.removeItem(LATEST_RECORDING_STORAGE_KEY);
}

export function invalidateLatestRecordingForMotorIdChange(
  recording: RecordedSequence
): RecordedSequence {
  const invalidated: RecordedSequence = {
    ...recording,
    invalidation: {
      reason: "motor-ids-changed",
      invalidatedAt: new Date().toISOString()
    }
  };
  persistLatestRecording(invalidated);
  return invalidated;
}
