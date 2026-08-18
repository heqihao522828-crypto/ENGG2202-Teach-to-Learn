import { useEffect, useState } from "react";
import type { useRobotController } from "../controller/useRobotController";
import {
  contextualStopAction,
  formatRecordPlayTime,
  playbackProgress,
  simpleRecordPlayStatus
} from "../recording/recordPlayPresentation";

type RobotController = ReturnType<typeof useRobotController>;

export function RecordAndPlayPanel({ controller }: { controller: RobotController }) {
  const feature = controller.recordAndPlay;
  const [displayElapsedMs, setDisplayElapsedMs] = useState(0);
  const stopAction = contextualStopAction(feature.mode);
  const status = simpleRecordPlayStatus(feature.mode);

  useEffect(() => {
    if (!controller.connected || controller.eStopLatched) {
      return;
    }
    if (feature.mode === "recording") {
      const startedAt = performance.now() - feature.elapsedMs;
      const timer = window.setInterval(() => setDisplayElapsedMs(performance.now() - startedAt), 200);
      return () => window.clearInterval(timer);
    }
    if (feature.mode === "playing") {
      const startedAt = performance.now();
      const duration = feature.recording?.durationMs ?? 0;
      const timer = window.setInterval(() => {
        const progress = playbackProgress(startedAt, performance.now(), feature.playbackSpeed, duration);
        setDisplayElapsedMs(progress);
      }, 200);
      return () => window.clearInterval(timer);
    }

    // Preserve the just-stopped recording time for this mount only. A saved
    // recording must never become the idle timer value on a fresh page load.
    if (feature.mode === "stopping-recording" || feature.mode === "recording-ready") {
      return;
    }

    const resetTimer = window.setTimeout(() => setDisplayElapsedMs(0), 0);
    return () => window.clearTimeout(resetTimer);
  }, [controller.connected, controller.eStopLatched, feature.elapsedMs, feature.mode, feature.playbackSpeed, feature.recording?.durationMs]);

  const handleStop = () => {
    if (stopAction === "recording") feature.stopRecording();
    if (stopAction === "playback") {
      setDisplayElapsedMs(0);
      feature.stopPlayback();
    }
  };

  return (
    <section className="panel record-play" aria-labelledby="record-play-title">
      <div className="record-play__heading">
        <h2 id="record-play-title">Record and Play</h2>
        <span className={`record-play__mode record-play__mode--${status.toLowerCase()}`}>{status}</span>
      </div>

      <output className="record-play__timer" aria-label="Record and Play timer">
        {formatRecordPlayTime(!controller.connected || controller.eStopLatched ? 0 : displayElapsedMs)}
      </output>

      <div className="record-play__actions">
        <button
          className="button button--primary"
          disabled={feature.startDisabledReason !== null}
          title={feature.startDisabledReason ?? undefined}
          onClick={() => {
            if (window.confirm("Move the arm to the saved Initial Position, then release all five motors and start recording?")) {
              setDisplayElapsedMs(0);
              void feature.startRecording();
            }
          }}
        >
          Start
        </button>
        <button className="button button--warning" disabled={stopAction === null} onClick={handleStop}>Stop</button>
        <button
          className="button button--secondary"
          disabled={feature.playDisabledReason !== null}
          title={feature.playDisabledReason ?? undefined}
          onClick={() => {
            if (window.confirm("Playback will enable motor torque and move all five joints through the recorded sequence. Keep the robot workspace clear.")) {
              setDisplayElapsedMs(0);
              void feature.playRecording();
            }
          }}
        >
          Play
        </button>
      </div>
    </section>
  );
}
