import type { RecordAndPlayMode } from "./useRecordAndPlay";

export function formatRecordPlayTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

export function simpleRecordPlayStatus(mode: RecordAndPlayMode): "Idle" | "Recording" | "Playing" {
  if (["preparing-recording", "moving-to-initial", "releasing-torque", "recording", "stopping-recording"].includes(mode)) return "Recording";
  if (["preparing-playback", "playing", "stopping-playback"].includes(mode)) return "Playing";
  return "Idle";
}

export function contextualStopAction(mode: RecordAndPlayMode): "recording" | "playback" | null {
  if (mode === "recording") return "recording";
  if (["preparing-playback", "playing"].includes(mode)) return "playback";
  return null;
}

export function playbackProgress(startedAt: number, now: number, speed: number, durationMs: number): number {
  return Math.min(durationMs, Math.max(0, (now - startedAt) * speed));
}
