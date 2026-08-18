import { SMS_STS_MAX_POSITION, SMS_STS_MIN_POSITION, SMS_STS_NATIVE_MIDDLE } from "../webserial/scservo";

export const NATIVE_MIDDLE_POSITION = SMS_STS_NATIVE_MIDDLE;
export const NATIVE_MIN_POSITION = SMS_STS_MIN_POSITION;
export const NATIVE_MAX_POSITION = SMS_STS_MAX_POSITION;

export function validateNativePosition(position: number, label = "Native position"): number {
  if (!Number.isInteger(position) || position < NATIVE_MIN_POSITION || position > NATIVE_MAX_POSITION) {
    throw new Error(`${label} must be an integer from ${NATIVE_MIN_POSITION} to ${NATIVE_MAX_POSITION}.`);
  }
  return position;
}
