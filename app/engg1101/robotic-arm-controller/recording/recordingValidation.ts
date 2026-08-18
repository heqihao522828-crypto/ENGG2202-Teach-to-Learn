import type { CalibrationProfile } from "../calibration/calibrationStorage";
import { validateLogicalPose } from "../controller/movementLimits";
import {
  createCalibrationFingerprint,
  type InitialPose
} from "../initialPose/initialPoseStorage";
import type { RecordedSequence } from "./recordingStorage";
import { validateRecordedSequence } from "./recordingStorage";

export const RECORDING_CALIBRATION_MISMATCH_MESSAGE =
  "Calibration or motor assignment changed after this recording was created. Record the sequence again.";

export function validateLogicalPoseForMovement(
  pose: InitialPose,
  calibration: CalibrationProfile,
  label: string
): string | null {
  return validateLogicalPose(pose, calibration, label);
}

export function validateRecordingForPlayback(
  value: unknown,
  calibration: CalibrationProfile
): { recording: RecordedSequence | null; error: string | null } {
  const structural = validateRecordedSequence(value);
  if (!structural.recording) {
    return structural;
  }
  const recording = structural.recording;
  if (recording.invalidation?.reason === "motor-ids-changed") {
    return { recording: null, error: RECORDING_CALIBRATION_MISMATCH_MESSAGE };
  }
  const fingerprintMatches =
    recording.calibrationFingerprint === createCalibrationFingerprint(calibration);
  const initialError = validateLogicalPoseForMovement(
    recording.initialPose,
    calibration,
    "Recorded Initial Position"
  );
  if (initialError) {
    return {
      recording: null,
      error: fingerprintMatches
        ? initialError
        : `${RECORDING_CALIBRATION_MISMATCH_MESSAGE} ${initialError}`
    };
  }
  for (let index = 0; index < recording.frames.length; index += 1) {
    const error = validateLogicalPoseForMovement(
      recording.frames[index].positions,
      calibration,
      `Frame ${index + 1}`
    );
    if (error) {
      return {
        recording: null,
        error: fingerprintMatches
          ? error
          : `${RECORDING_CALIBRATION_MISMATCH_MESSAGE} ${error}`
      };
    }
  }
  if (!fingerprintMatches) {
    return { recording: null, error: RECORDING_CALIBRATION_MISMATCH_MESSAGE };
  }
  return { recording, error: null };
}
