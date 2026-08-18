interface ConnectionPanelProps {
  serialSupported: boolean;
  connected: boolean;
  busy: boolean;
  activeAction: string | null;
  baudRate: number;
  eStopLatched: boolean;
  onBaudRateChange: (value: number) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onEmergencyStop: () => void;
  onResetEmergencyStop: () => void;
}

export function ConnectionPanel({
  serialSupported,
  connected,
  busy,
  activeAction,
  baudRate,
  eStopLatched,
  onBaudRateChange,
  onConnect,
  onDisconnect,
  onEmergencyStop,
  onResetEmergencyStop
}: ConnectionPanelProps) {
  return (
    <section className="connection-panel" aria-label="Serial connection controls">
      <div className="connection-main">
        <div className="connection-state" aria-live="polite">
          <span
            className={`status-dot ${connected ? "status-dot--online" : "status-dot--offline"}`}
            aria-hidden="true"
          />
          <div>
            <span className="eyebrow">Serial link</span>
            <strong>{connected ? "Connected" : "Disconnected"}</strong>
            <small>{busy ? activeAction : serialSupported ? "Web Serial ready" : "Unsupported browser"}</small>
          </div>
        </div>

        <label className="compact-field">
          <span>Baud rate</span>
          <select
            value={baudRate}
            onChange={(event) => onBaudRateChange(Number(event.target.value))}
            disabled={busy || connected}
          >
            <option value={9600}>9,600</option>
            <option value={57600}>57,600</option>
            <option value={115200}>115,200</option>
            <option value={500000}>500,000</option>
            <option value={1000000}>1,000,000</option>
          </select>
        </label>

        <div className="connection-actions">
          <button
            className="button button--primary"
            onClick={onConnect}
            disabled={busy || connected || !serialSupported}
          >
            Connect device
          </button>
          <button
            className="button button--secondary"
            onClick={onDisconnect}
            disabled={busy || !connected}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className={`stop-panel ${eStopLatched ? "stop-panel--latched" : ""}`}>
        <button
          className="stop-button"
          onClick={onEmergencyStop}
          disabled={!connected || eStopLatched}
          aria-pressed={eStopLatched}
        >
          <span>STOP</span>
          <small>Release all torque</small>
        </button>
        <div className="stop-copy">
          <strong>{eStopLatched ? "Software stop latched" : "Software emergency stop"}</strong>
          <span>This is not a substitute for a wired, power-cutting emergency stop.</span>
          {eStopLatched && (
            <button className="text-button" onClick={onResetEmergencyStop} disabled={busy}>
              Reset software stop
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
