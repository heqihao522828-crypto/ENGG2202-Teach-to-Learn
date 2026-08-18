export type MotorKey = "base" | "shoulder" | "elbow" | "wrist" | "gripper";

export interface MotorConfig {
  key: MotorKey;
  id: number;
  name: string;
  description: string;
  min: number;
  max: number;
  home: number;
  jogStep: number;
}

export type MotorActivity = "idle" | "commanded" | "reading" | "error";

export interface MotorState extends MotorConfig {
  target: number;
  current: number | null;
  rawCurrent: number | null;
  activity: MotorActivity;
  message: string;
}

export type LogKind = "system" | "tx" | "rx" | "warning" | "error";

export interface LogEntry {
  id: number;
  timestamp: string;
  kind: LogKind;
  message: string;
}

export type StatusTone = "neutral" | "success" | "warning" | "error";

export interface ControllerStatus {
  tone: StatusTone;
  message: string;
}
