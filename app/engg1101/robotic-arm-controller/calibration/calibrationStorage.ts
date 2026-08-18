import { MOTOR_CONFIGS } from "../controller/motors";

export const CALIBRATION_STORAGE_KEY = "aem.robot-arm.calibration";

export type CalibrationProfile = {
  version: 6;
  hardwareMiddleConfigured: boolean;
  calibratedAt: string | null;
  servoIds: number[];
  revision: string;
  savedAt: string;
};

export type CalibrationValidationResult =
  | { valid: true; profile: CalibrationProfile }
  | { valid: false; error: string };

const ids = () => MOTOR_CONFIGS.map((motor) => motor.id);
const revision = () => `hardware-middle-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function createDefaultCalibration(savedAt = new Date().toISOString()): CalibrationProfile {
  return { version: 6, hardwareMiddleConfigured: false, calibratedAt: null, servoIds: ids(), revision: "unconfigured", savedAt };
}

export function createHardwareCalibrationProfile(calibratedAt = new Date().toISOString()): CalibrationProfile {
  return { version: 6, hardwareMiddleConfigured: true, calibratedAt, servoIds: ids(), revision: revision(), savedAt: calibratedAt };
}

export function validateCalibrationProfile(value: unknown): CalibrationValidationResult {
  if (!value || typeof value !== "object") return { valid: false, error: "Calibration must be a JSON object." };
  const candidate = value as Partial<CalibrationProfile>;
  if (candidate.version !== 6) return { valid: false, error: "Unsupported calibration version." };
  if (typeof candidate.hardwareMiddleConfigured !== "boolean") return { valid: false, error: "Hardware-middle status is missing." };
  if (!Array.isArray(candidate.servoIds) || candidate.servoIds.join(",") !== ids().join(",")) return { valid: false, error: "Calibration must contain servo IDs 1–5." };
  if (typeof candidate.revision !== "string" || !candidate.revision) return { valid: false, error: "Calibration revision is missing." };
  if (typeof candidate.savedAt !== "string" || Number.isNaN(Date.parse(candidate.savedAt))) return { valid: false, error: "Calibration timestamp is invalid." };
  if (candidate.calibratedAt !== null && (typeof candidate.calibratedAt !== "string" || Number.isNaN(Date.parse(candidate.calibratedAt)))) return { valid: false, error: "Hardware calibration timestamp is invalid." };
  return { valid: true, profile: candidate as CalibrationProfile };
}

export function loadCalibration(): CalibrationProfile {
  const fallback = createDefaultCalibration();
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(CALIBRATION_STORAGE_KEY);
    if (!stored) return fallback;
    const result = validateCalibrationProfile(JSON.parse(stored));
    // Versions 1–5 contained software centers. They are deliberately ignored.
    return result.valid ? result.profile : fallback;
  } catch { return fallback; }
}

export function hasPersistedCalibration(): boolean { return loadCalibration().hardwareMiddleConfigured; }

export function persistCalibration(profile: CalibrationProfile): void {
  const result = validateCalibrationProfile(profile);
  if (!result.valid) throw new Error(result.error);
  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(result.profile));
}

export function parseCalibrationJson(json: string): CalibrationValidationResult {
  try { return validateCalibrationProfile(JSON.parse(json)); }
  catch { return { valid: false, error: "The selected file is not valid JSON." }; }
}
