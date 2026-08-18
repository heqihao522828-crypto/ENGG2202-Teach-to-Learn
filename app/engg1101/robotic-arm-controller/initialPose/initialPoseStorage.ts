import type { CalibrationProfile } from "../calibration/calibrationStorage";
import { NATIVE_MAX_POSITION, NATIVE_MIN_POSITION } from "../calibration/positionMapping";
import { MOTOR_CONFIGS } from "../controller/motors";

export const INITIAL_POSE_STORAGE_KEY = "aem.robot-arm.initial-pose";

export type MotorId = 1 | 2 | 3 | 4 | 5;
export type InitialPose = Record<MotorId, number>;
export type InitialPoseInvalidationReason = "motor-ids-changed" | "hardware-middle-changed";

export type InitialPoseProfile = {
  version: 1;
  positions: InitialPose;
  savedAt: string;
  calibrationFingerprint: string;
  coordinateFingerprint: string;
  invalidation?: {
    reason: InitialPoseInvalidationReason;
    invalidatedAt: string;
  };
};

export type InitialPoseLoadResult = {
  profile: InitialPoseProfile | null;
  error: string | null;
};

const MOTOR_IDS = MOTOR_CONFIGS.map((motor) => motor.id as MotorId);

function stableFingerprint(parts: Array<string | number>): string {
  const source = parts.join("|");
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `v1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createCoordinateFingerprint(profile: CalibrationProfile): string {
  return stableFingerprint([profile.version, profile.revision, ...profile.servoIds]);
}

export function createCalibrationFingerprint(profile: CalibrationProfile): string {
  return createCoordinateFingerprint(profile);
}

export function cloneInitialPose(pose: InitialPose): InitialPose {
  return Object.fromEntries(MOTOR_IDS.map((id) => [id, pose[id]])) as InitialPose;
}

export function validateInitialPoseAgainstCalibration(
  pose: InitialPose,
  calibration: CalibrationProfile
): string[] {
  void calibration;
  const errors: string[] = [];
  for (const motor of MOTOR_CONFIGS) {
    const position = pose[motor.id as MotorId];
    if (!Number.isFinite(position) || !Number.isInteger(position)) {
      errors.push(`${motor.name} position must be a finite integer.`);
      continue;
    }
    if (
      position < NATIVE_MIN_POSITION ||
      position > NATIVE_MAX_POSITION
    ) {
      errors.push(
        `${motor.name} position ${position} is outside the allowed range ${NATIVE_MIN_POSITION}–${NATIVE_MAX_POSITION}.`
      );
    }
  }
  return errors;
}

export function validateInitialPoseProfile(value: unknown): InitialPoseLoadResult {
  if (!value || typeof value !== "object") {
    return { profile: null, error: "Saved Initial Position is not a valid object." };
  }
  const candidate = value as Partial<InitialPoseProfile>;
  if (candidate.version !== 1) {
    return { profile: null, error: "Saved Initial Position uses an unsupported schema version." };
  }
  if (!candidate.positions || typeof candidate.positions !== "object") {
    return { profile: null, error: "Saved Initial Position is missing its five motor positions." };
  }
  const keys = Object.keys(candidate.positions).sort();
  if (keys.length !== MOTOR_IDS.length || keys.some((key, index) => key !== String(MOTOR_IDS[index]))) {
    return { profile: null, error: "Saved Initial Position must contain exactly motor IDs 1–5." };
  }
  if (typeof candidate.savedAt !== "string" || Number.isNaN(Date.parse(candidate.savedAt))) {
    return { profile: null, error: "Saved Initial Position has an invalid timestamp." };
  }
  if (
    typeof candidate.calibrationFingerprint !== "string" ||
    candidate.calibrationFingerprint.length === 0 ||
    typeof candidate.coordinateFingerprint !== "string" ||
    candidate.coordinateFingerprint.length === 0
  ) {
    return { profile: null, error: "Saved Initial Position is missing calibration revision data." };
  }

  const positions = {} as InitialPose;
  for (const id of MOTOR_IDS) {
    const position = (candidate.positions as Record<number, unknown>)[id];
    if (!Number.isFinite(position) || !Number.isInteger(position)) {
      return { profile: null, error: `Saved Initial Position for motor ID ${id} must be a finite integer.` };
    }
    positions[id] = position as number;
  }

  let invalidation: InitialPoseProfile["invalidation"];
  if (candidate.invalidation !== undefined) {
    if (
      (candidate.invalidation.reason !== "motor-ids-changed" && candidate.invalidation.reason !== "hardware-middle-changed") ||
      typeof candidate.invalidation.invalidatedAt !== "string" ||
      Number.isNaN(Date.parse(candidate.invalidation.invalidatedAt))
    ) {
      return { profile: null, error: "Saved Initial Position has invalid review metadata." };
    }
    invalidation = { ...candidate.invalidation };
  }

  return {
    profile: {
      version: 1,
      positions,
      savedAt: candidate.savedAt,
      calibrationFingerprint: candidate.calibrationFingerprint,
      coordinateFingerprint: candidate.coordinateFingerprint,
      ...(invalidation ? { invalidation } : {})
    },
    error: null
  };
}

export function loadInitialPoseProfile(): InitialPoseLoadResult {
  if (typeof window === "undefined") {
    return { profile: null, error: null };
  }
  try {
    const stored = window.localStorage.getItem(INITIAL_POSE_STORAGE_KEY);
    if (!stored) {
      return { profile: null, error: null };
    }
    return validateInitialPoseProfile(JSON.parse(stored));
  } catch {
    return { profile: null, error: "Saved Initial Position could not be read." };
  }
}

export function persistInitialPoseProfile(profile: InitialPoseProfile): void {
  const result = validateInitialPoseProfile(profile);
  if (!result.profile) {
    throw new Error(result.error ?? "Initial Position is invalid.");
  }
  window.localStorage.setItem(INITIAL_POSE_STORAGE_KEY, JSON.stringify(result.profile));
}

export function clearInitialPoseProfile(): void {
  window.localStorage.removeItem(INITIAL_POSE_STORAGE_KEY);
}

export function getSavedInitialPose(calibration: CalibrationProfile): InitialPose | null {
  const loaded = loadInitialPoseProfile();
  if (!loaded.profile || loaded.profile.invalidation) {
    return null;
  }
  if (loaded.profile.coordinateFingerprint !== createCoordinateFingerprint(calibration)) {
    return null;
  }
  if (validateInitialPoseAgainstCalibration(loaded.profile.positions, calibration).length > 0) {
    return null;
  }
  return cloneInitialPose(loaded.profile.positions);
}
