import type { InitialPose, MotorId } from "./initialPoseStorage";

type PoseMotor = { id: number; name: string };

/** Fresh-reads a complete pose in configured order and never returns partial data. */
export async function captureCompletePose(
  motors: readonly PoseMotor[],
  readPosition: (id: number) => Promise<number>,
  signal?: AbortSignal
): Promise<InitialPose> {
  const pose = {} as InitialPose;
  for (const motor of motors) {
    signal?.throwIfAborted();
    try {
      pose[motor.id as MotorId] = await readPosition(motor.id);
      signal?.throwIfAborted();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`${motor.name}, ID ${motor.id}: ${detail}`);
    }
  }
  return pose;
}
