import type { MotorConfig, MotorState } from "./types";

// These defaults preserve the full FeelTech/SCS logical position range used by
// the original application.
export const MOTOR_CONFIGS: readonly MotorConfig[] = [
  {
    key: "base",
    id: 1,
    name: "Base",
    description: "Robot base rotation",
    min: 0,
    max: 4095,
    home: 2048,
    jogStep: 50
  },
  {
    key: "shoulder",
    id: 2,
    name: "Shoulder",
    description: "Primary lift joint",
    min: 0,
    max: 4095,
    home: 2048,
    jogStep: 50
  },
  {
    key: "elbow",
    id: 3,
    name: "Elbow",
    description: "Arm extension joint",
    min: 0,
    max: 4095,
    home: 2048,
    jogStep: 50
  },
  {
    key: "wrist",
    id: 4,
    name: "Wrist",
    description: "End-effector orientation",
    min: 0,
    max: 4095,
    home: 2048,
    jogStep: 50
  },
  {
    key: "gripper",
    id: 5,
    name: "Gripper",
    description: "End-effector open / close",
    min: 0,
    max: 4095,
    home: 2048,
    jogStep: 25
  }
] as const;

export function createInitialMotorState(): MotorState[] {
  return MOTOR_CONFIGS.map((motor) => ({
    ...motor,
    target: motor.home,
    current: null,
    rawCurrent: null,
    activity: "idle",
    message: "Awaiting command"
  }));
}
