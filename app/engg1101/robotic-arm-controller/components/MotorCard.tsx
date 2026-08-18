import type { MotorKey, MotorState } from "../controller/types";

interface MotorCardProps {
  motor: MotorState;
  connected: boolean;
  busy: boolean;
  motionDisabled: boolean;
  targetInvalid: boolean;
  onTargetChange: (key: MotorKey, target: number) => void;
  onJog: (key: MotorKey, direction: -1 | 1) => void;
  onMove: (key: MotorKey) => void;
  onRead: (key: MotorKey) => void;
}

export function MotorCard({
  motor,
  connected,
  busy,
  motionDisabled,
  targetInvalid,
  onTargetChange,
  onJog,
  onMove,
  onRead
}: MotorCardProps) {
  const currentPercent =
    motor.current === null ? null : ((motor.current - motor.min) / (motor.max - motor.min)) * 100;
  const targetPercent = ((motor.target - motor.min) / (motor.max - motor.min)) * 100;

  return (
    <article className={`motor-card motor-card--${motor.activity} ${targetInvalid ? "motor-card--target-invalid" : ""}`}>
      <header className="motor-card__header">
        <div>
          <span className="motor-index">ID {motor.id}</span>
          <h3>{motor.name}</h3>
          <p>{motor.description}</p>
        </div>
        <span className={`motor-state motor-state--${motor.activity}`}>
          {motor.activity === "commanded" ? "Commanded" : motor.activity}
        </span>
      </header>

      <div className="position-readout">
        <div>
          <span>Current / Native</span>
          <strong>{motor.current ?? "—"}</strong>
          <small>Raw {motor.rawCurrent ?? "—"}</small>
        </div>
        <div>
          <span>Target</span>
          <strong>{motor.target}</strong>
        </div>
      </div>

      <div className="position-track" aria-hidden="true">
        {currentPercent !== null && (
          <span className="position-track__current" style={{ left: `${currentPercent}%` }} />
        )}
        <span className="position-track__target" style={{ left: `${targetPercent}%` }} />
      </div>

      <label className="slider-field">
        <span className="sr-only">{motor.name} target position</span>
        <input
          type="range"
          min={motor.min}
          max={motor.max}
          value={Math.min(motor.max, Math.max(motor.min, motor.target))}
          onChange={(event) => onTargetChange(motor.key, Number(event.target.value))}
          disabled={busy}
          aria-invalid={targetInvalid}
        />
        <span className="range-labels">
          <small>{motor.min}</small>
          <small>{motor.max}</small>
        </span>
      </label>

      <div className="target-editor">
        <button
          className="jog-button"
          onClick={() => onJog(motor.key, -1)}
          disabled={busy}
          aria-label={`Decrease ${motor.name} target by ${motor.jogStep}`}
        >
          −{motor.jogStep}
        </button>
        <label>
          <span>Target position</span>
          <input
            type="number"
            min={motor.min}
            max={motor.max}
            value={motor.target}
            onChange={(event) => onTargetChange(motor.key, Number(event.target.value))}
            disabled={busy}
            aria-invalid={targetInvalid}
          />
        </label>
        <button
          className="jog-button"
          onClick={() => onJog(motor.key, 1)}
          disabled={busy}
          aria-label={`Increase ${motor.name} target by ${motor.jogStep}`}
        >
          +{motor.jogStep}
        </button>
      </div>

      <div className="motor-actions">
        <button
          className="button button--primary"
          onClick={() => onMove(motor.key)}
          disabled={motionDisabled || targetInvalid}
        >
          Move {motor.name}
        </button>
        <button
          className="button button--secondary"
          onClick={() => onRead(motor.key)}
          disabled={!connected || busy}
        >
          Read
        </button>
      </div>

      <footer className="motor-card__footer">
        <span>{motor.message}</span>
        <span>
          Range {motor.min}–{motor.max}
        </span>
      </footer>
    </article>
  );
}
