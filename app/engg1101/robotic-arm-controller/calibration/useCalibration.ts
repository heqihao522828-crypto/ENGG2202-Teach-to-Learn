import { useCallback, useRef, useState } from "react";
import {
  createHardwareCalibrationProfile,
  hasPersistedCalibration,
  loadCalibration,
  parseCalibrationJson,
  persistCalibration,
  type CalibrationProfile
} from "./calibrationStorage";

export const CENTER_SAMPLE_TOLERANCE = 8;
export type StableRawPositionResult =
  | { stable: true; rawPosition: number; samples: readonly number[]; spread: number }
  | { stable: false; samples: readonly number[]; spread: number };

export function evaluateStableRawPosition(samples: readonly number[], tolerance = CENTER_SAMPLE_TOLERANCE): StableRawPositionResult {
  if (samples.length < 3 || samples.some((sample) => !Number.isInteger(sample) || sample < 0 || sample > 4095)) return { stable: false, samples, spread: Infinity };
  const ordered = [...samples].sort((a, b) => a - b);
  const spread = ordered[ordered.length - 1] - ordered[0];
  return spread > tolerance ? { stable: false, samples, spread } : { stable: true, rawPosition: ordered[Math.floor(ordered.length / 2)], samples, spread };
}

type CalibrationStatus = { tone: "neutral" | "success" | "warning" | "error"; message: string };

export function useCalibration(_connected: boolean) {
  void _connected;
  const [savedProfile, setSavedProfile] = useState<CalibrationProfile>(loadCalibration);
  const [hasSavedMidpoint, setHasSavedMidpoint] = useState(hasPersistedCalibration);
  const [status, setStatus] = useState<CalibrationStatus>({ tone: "neutral", message: "Release and support the motors, pose the arm, then set the hardware middle." });
  const [verification, setVerification] = useState<Partial<Record<number, { before: number; after: number; passed: boolean }>>>({});
  const previousRevision = useRef(savedProfile.revision);

  const completeHardwareCalibration = useCallback((results: Record<number, { before: number; after: number; passed: boolean }>) => {
    const profile = createHardwareCalibrationProfile();
    persistCalibration(profile);
    previousRevision.current = profile.revision;
    setSavedProfile(profile);
    setHasSavedMidpoint(true);
    setVerification(results);
    setStatus({ tone: "success", message: "Hardware middle calibration completed and verified for IDs 1–5." });
    return profile;
  }, []);
  const setFailure = useCallback((message: string) => setStatus({ tone: "error", message }), []);
  const begin = useCallback(() => setStatus({ tone: "neutral", message: "Release and support the motors, pose the arm, then set the hardware middle." }), []);
  const importJson = useCallback((json: string) => {
    const result = parseCalibrationJson(json);
    if (!result.valid) { setFailure(result.error); return false; }
    persistCalibration(result.profile); setSavedProfile(result.profile); setHasSavedMidpoint(result.profile.hardwareMiddleConfigured); return true;
  }, [setFailure]);
  return { savedProfile, hasSavedMidpoint, status, verification, dirty: false, begin, discard: () => undefined, importJson, completeHardwareCalibration, setFailure };
}
