interface GlobalControlsProps {
  connected: boolean;
  busy: boolean;
  motionDisabled: boolean;
  homeAvailability: { allowed: boolean; reason?: string };
  moveAllDisabled: boolean;
  eStopLatched: boolean;
  speed: number;
  acceleration: number;
  onSpeedChange: (value: number) => void;
  onAccelerationChange: (value: number) => void;
  onMoveAll: () => void;
  onReadAll: () => void;
  onHomeAll: () => void;
  onTorqueOn: () => void;
  onTorqueOff: () => void;
}

export function GlobalControls({
  connected,
  busy,
  motionDisabled,
  homeAvailability,
  moveAllDisabled,
  eStopLatched,
  speed,
  acceleration,
  onSpeedChange,
  onAccelerationChange,
  onMoveAll,
  onReadAll,
  onHomeAll,
  onTorqueOn,
  onTorqueOff
}: GlobalControlsProps) {
  return (
    <section className="panel global-controls" aria-labelledby="global-controls-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Coordinated operation</span>
          <h2 id="global-controls-title">Global controls</h2>
        </div>
        <span className={`mode-pill ${eStopLatched ? "mode-pill--danger" : ""}`}>
          {eStopLatched ? "STOP LATCHED" : "MANUAL MODE"}
        </span>
      </div>

      <div className="motion-settings">
        <label>
          <span>Speed</span>
          <div className="input-with-unit">
            <input
              type="number"
              value={speed}
              min={0}
              max={4095}
              onChange={(event) => onSpeedChange(Number(event.target.value))}
              disabled={busy}
            />
            <small>0–4095</small>
          </div>
        </label>
        <label>
          <span>Acceleration</span>
          <div className="input-with-unit">
            <input
              type="number"
              value={acceleration}
              min={0}
              max={255}
              onChange={(event) => onAccelerationChange(Number(event.target.value))}
              disabled={busy}
            />
            <small>0–255</small>
          </div>
        </label>
      </div>

      <div className="global-action-grid">
        <button className="button button--primary button--large" onClick={onMoveAll} disabled={moveAllDisabled}>
          Move all targets
        </button>
        <button className="button button--secondary button--large" onClick={onReadAll} disabled={!connected || busy}>
          Read all positions
        </button>
        <button className="button button--secondary button--large" onClick={onHomeAll} disabled={!homeAvailability.allowed} title={homeAvailability.allowed ? "Return all five motors to native hardware middle." : homeAvailability.reason}>
          Move all to home
        </button>
        <button className="button button--secondary" onClick={onTorqueOn} disabled={motionDisabled}>
          Enable all torque
        </button>
        <button className="button button--warning" onClick={onTorqueOff} disabled={!connected || busy}>
          Release all torque
        </button>
      </div>

      {!homeAvailability.allowed && <p className="safety-note" role="status">Home unavailable: {homeAvailability.reason}</p>}

      <p className="safety-note">
        Commands are sent sequentially to servo IDs 1–5. “Move all” is not a synchronized bus-write operation.
      </p>
    </section>
  );
}
