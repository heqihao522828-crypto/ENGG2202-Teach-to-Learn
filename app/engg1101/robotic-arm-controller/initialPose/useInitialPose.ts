import { useCallback, useMemo, useState } from "react";
import type { CalibrationProfile } from "../calibration/calibrationStorage";
import { validateLogicalPose } from "../controller/movementLimits";
import {
  clearInitialPoseProfile,
  cloneInitialPose,
  createCalibrationFingerprint,
  createCoordinateFingerprint,
  loadInitialPoseProfile,
  persistInitialPoseProfile,
  type InitialPose,
  type InitialPoseProfile
} from "./initialPoseStorage";

type InitialPoseStatus = {
  tone: "neutral" | "success" | "warning" | "error";
  message: string;
};

export function useInitialPose(
  _connected: boolean,
  calibration: CalibrationProfile,
  hasSavedMidpoint: boolean
) {
  const initialLoad = useMemo(() => loadInitialPoseProfile(), []);
  const [savedProfile, setSavedProfile] = useState<InitialPoseProfile | null>(initialLoad.profile);
  const [storageError, setStorageError] = useState<string | null>(initialLoad.error);
  const [status, setStatus] = useState<InitialPoseStatus>({
    tone: initialLoad.error ? "error" : "neutral",
    message: initialLoad.error ?? (initialLoad.profile ? "Initial Position is saved." : "Initial Position is not saved.")
  });

  const currentCoordinateFingerprint = createCoordinateFingerprint(calibration);
  const currentCalibrationFingerprint = createCalibrationFingerprint(calibration);
  const savedValidationErrors = useMemo(() => {
    if (!hasSavedMidpoint) return ["Set the hardware middle before using Initial Position."];
    if (!savedProfile) return storageError ? [storageError] : [];
    if (savedProfile.invalidation?.reason === "motor-ids-changed") {
      return ["Motor IDs changed after this Initial Position was saved. Capture the Initial Position again."];
    }
    if (savedProfile.coordinateFingerprint !== currentCoordinateFingerprint) {
      return ["Calibration changed after this Initial Position was saved. Capture the Initial Position again."];
    }
    const error = validateLogicalPose(savedProfile.positions, calibration, "Saved Initial Position");
    return error ? [error] : [];
  }, [calibration, currentCoordinateFingerprint, hasSavedMidpoint, savedProfile, storageError]);

  const saveCapturedPose = useCallback((pose: InitialPose): boolean => {
    if (!hasSavedMidpoint) {
      setStatus({ tone: "error", message: "Set the hardware middle before capturing an Initial Position." });
      return false;
    }
    const validationError = validateLogicalPose(pose, calibration, "Initial Position capture");
    if (validationError) {
      setStatus({ tone: "error", message: validationError });
      return false;
    }
    const profile: InitialPoseProfile = {
      version: 1,
      positions: cloneInitialPose(pose),
      savedAt: new Date().toISOString(),
      calibrationFingerprint: currentCalibrationFingerprint,
      coordinateFingerprint: currentCoordinateFingerprint
    };
    const replacing = savedProfile !== null;
    try {
      persistInitialPoseProfile(profile);
      setSavedProfile(profile);
      setStorageError(null);
      setStatus({ tone: "success", message: replacing ? "Initial Position updated." : "Initial Position saved." });
      return true;
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Initial Position could not be saved." });
      return false;
    }
  }, [calibration, currentCalibrationFingerprint, currentCoordinateFingerprint, hasSavedMidpoint, savedProfile]);

  const reportStatus = useCallback((tone: InitialPoseStatus["tone"], message: string) => {
    setStatus({ tone, message });
  }, []);

  const clearInitialPose = useCallback((): boolean => {
    try {
      clearInitialPoseProfile();
      setSavedProfile(null);
      setStorageError(null);
      setStatus({ tone: "neutral", message: "Initial Position cleared." });
      return true;
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Initial Position could not be cleared." });
      return false;
    }
  }, []);

  const invalidateForMotorIdChange = useCallback(() => {
    setStatus({ tone: "warning", message: "Initial Position needs to be recaptured." });
    if (!savedProfile) return;
    const invalidated: InitialPoseProfile = {
      ...savedProfile,
      invalidation: { reason: "motor-ids-changed", invalidatedAt: new Date().toISOString() }
    };
    try {
      persistInitialPoseProfile(invalidated);
      setSavedProfile(invalidated);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Initial Position invalidation could not be saved.");
    }
  }, [savedProfile]);

  const getLoadablePose = useCallback(():
    | { valid: true; pose: InitialPose }
    | { valid: false; error: string } => {
    if (!savedProfile) return { valid: false, error: storageError ?? "No saved Initial Position is available." };
    if (savedValidationErrors.length > 0) return { valid: false, error: savedValidationErrors[0] };
    return { valid: true, pose: cloneInitialPose(savedProfile.positions) };
  }, [savedProfile, savedValidationErrors, storageError]);

  return {
    savedProfile,
    savedPose: savedProfile ? cloneInitialPose(savedProfile.positions) : null,
    isValid: savedProfile !== null && savedValidationErrors.length === 0,
    validationErrors: savedValidationErrors,
    status,
    saveCapturedPose,
    reportStatus,
    clearInitialPose,
    invalidateForMotorIdChange,
    getLoadablePose
  };
}
