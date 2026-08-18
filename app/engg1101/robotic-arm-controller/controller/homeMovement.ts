import { NATIVE_MIDDLE_POSITION } from "../calibration/positionMapping";
import type { MotorConfig } from "./types";
export const HOME_ARRIVAL_TOLERANCE = 12;
export const HOME_AWAY_MARGIN = 8;
export const HOME_AWAY_SAMPLE_LIMIT = 2;
export type HomeCommand = { id: number; name: string; currentRaw: number; currentLogical: number; logicalTarget: number; rawTarget: number };
export type HomeWatchdogState = { previousDistance: number; consecutiveAwaySamples: number };
export function createNativeHomeTargets(motors: readonly MotorConfig[]): Array<{ id: number; target: number }> {
  return motors.map((motor) => ({ id: motor.id, target: NATIVE_MIDDLE_POSITION }));
}
export function detectTargetCrossing(startingRaw: number, currentRaw: number, target = NATIVE_MIDDLE_POSITION, tolerance = HOME_ARRIVAL_TOLERANCE) {
  const initialDelta = startingRaw - target; const currentDelta = currentRaw - target;
  return { crossed: Math.abs(initialDelta) > tolerance && ((initialDelta > 0 && currentDelta < -tolerance) || (initialDelta < 0 && currentDelta > tolerance)), initialDelta, currentDelta };
}
export function buildHomeCommand({ id, name, currentRaw }: { id: number; name: string; currentRaw: number }): HomeCommand {
  return { id, name, currentRaw, currentLogical: currentRaw, logicalTarget: NATIVE_MIDDLE_POSITION, rawTarget: NATIVE_MIDDLE_POSITION };
}
export async function sendHomeCommandsOnce(commands: readonly HomeCommand[], writePosition: (id: number, target: number) => Promise<void>) { for (const command of commands) await writePosition(command.id, command.rawTarget); }
export function updateHomeWatchdog(position: number, previous: HomeWatchdogState | null, awayMargin = HOME_AWAY_MARGIN, awaySampleLimit = HOME_AWAY_SAMPLE_LIMIT) {
  const distance = Math.abs(position - NATIVE_MIDDLE_POSITION);
  const movedFarther = previous !== null && distance > previous.previousDistance + awayMargin;
  const consecutiveAwaySamples = movedFarther ? previous.consecutiveAwaySamples + 1 : 0;
  return { state: { previousDistance: distance, consecutiveAwaySamples }, logicalPosition: position, distance, abort: consecutiveAwaySamples >= awaySampleLimit };
}
