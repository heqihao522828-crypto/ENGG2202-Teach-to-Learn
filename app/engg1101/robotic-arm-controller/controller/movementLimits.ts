import type { CalibrationProfile } from "../calibration/calibrationStorage";
import { NATIVE_MAX_POSITION, NATIVE_MIN_POSITION, validateNativePosition } from "../calibration/positionMapping";
import type { InitialPose, MotorId } from "../initialPose/initialPoseStorage";
import { MOTOR_CONFIGS } from "./motors";
import type { MotorConfig } from "./types";

export const ABSOLUTE_RAW_POSITION_MIN = NATIVE_MIN_POSITION;
export const ABSOLUTE_RAW_POSITION_MAX = NATIVE_MAX_POSITION;
export type MovementTargetValidation = { valid: true; rawTarget: number } | { valid: false; error: string };
export function getLogicalMovementRange() { return { minimum: NATIVE_MIN_POSITION, maximum: NATIVE_MAX_POSITION }; }
export function validateLogicalTarget({ motor, logicalTarget }: { motor: MotorConfig; logicalTarget: number; calibration: CalibrationProfile }): MovementTargetValidation {
  try { return { valid: true, rawTarget: validateNativePosition(logicalTarget, `${motor.name} target`) }; }
  catch { return { valid: false, error: `${motor.name} target ${logicalTarget} is outside the native servo range ${NATIVE_MIN_POSITION}–${NATIVE_MAX_POSITION}.` }; }
}
export function validateLogicalPose(pose: InitialPose, calibration: CalibrationProfile, label: string): string | null {
  for (const motor of MOTOR_CONFIGS) {
    const result = validateLogicalTarget({ motor, logicalTarget: pose[motor.id as MotorId], calibration });
    if (!result.valid) return `${label}: ${result.error}`;
  }
  return null;
}
