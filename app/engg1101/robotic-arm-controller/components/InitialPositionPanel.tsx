import type { useRobotController } from "../controller/useRobotController";

type RobotController = ReturnType<typeof useRobotController>;

export function InitialPositionPanel({ controller }: { controller: RobotController }) {
  const initialPosition = controller.initialPosition;
  const incompatible = initialPosition.savedProfile !== null && !initialPosition.isValid;
  const badge = initialPosition.savedProfile
    ? initialPosition.isValid ? "Saved" : "Needs recapture"
    : "Not saved";
  const operation = controller.activeAction;
  const capturing = operation === "Capture & save Initial Position";
  const moving = operation === "Move to Initial Position";
  const captureDisabled = !controller.connected || controller.eStopLatched || controller.busy || !controller.calibration.hasSavedMidpoint;
  const moveDisabled = captureDisabled || !initialPosition.isValid;
  const savedAt = initialPosition.savedProfile
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(initialPosition.savedProfile.savedAt))
    : null;

  return (
    <section className="panel initial-position" aria-labelledby="initial-position-title">
      <div className="initial-position__heading">
        <div>
          <h2 id="initial-position-title">Initial Position</h2>
          <p>Save the robot&apos;s current pose as the starting position for Record and Play.</p>
        </div>
        <span className={`initial-position__badge ${incompatible ? "initial-position__badge--error" : ""}`}>
          <span aria-hidden="true">●</span> {badge}
        </span>
      </div>

      <div className="initial-position__meta">
        <span>Status: <strong>{badge}</strong></span>
        {savedAt && <span>Saved: <time dateTime={initialPosition.savedProfile?.savedAt}>{savedAt}</time></span>}
      </div>

      <div className={`initial-position__status initial-position__status--${initialPosition.status.tone}`} aria-live="polite">
        {!controller.calibration.hasSavedMidpoint
          ? "Set the hardware middle before using Initial Position."
          : incompatible ? "Initial Position needs to be recaptured." : initialPosition.status.message}
      </div>

      <div className="initial-position__actions">
        <button className="button button--primary" disabled={captureDisabled} onClick={() => void initialPosition.captureAndSave()}>
          {capturing ? "Capturing..." : "Capture & Save Initial Position"}
        </button>
        <button className="button button--secondary" disabled={moveDisabled} onClick={() => void initialPosition.moveToInitial()}>
          {moving ? "Moving..." : "Move to Initial Position"}
        </button>
        <button
          className="text-button initial-position__clear"
          disabled={!initialPosition.savedProfile || controller.busy}
          onClick={() => {
            if (window.confirm("Clear the saved Initial Position? This will not move the robot.")) initialPosition.clear();
          }}
        >
          Clear
        </button>
      </div>
    </section>
  );
}
