import type { LogEntry } from "../controller/types";

interface SerialConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function SerialConsole({ logs, onClear }: SerialConsoleProps) {
  return (
    <details className="panel console-panel" open>
      <summary>
        <div>
          <span className="eyebrow">Diagnostics</span>
          <h2>Serial console</h2>
        </div>
        <span className="console-count">{logs.length} entries</span>
      </summary>

      <div className="console-toolbar">
        <div className="console-legend" aria-label="Log category legend">
          <span><i className="legend-dot legend-dot--tx" />TX</span>
          <span><i className="legend-dot legend-dot--rx" />RX</span>
          <span><i className="legend-dot legend-dot--error" />Error</span>
        </div>
        <button className="text-button" onClick={onClear} disabled={logs.length === 0}>
          Clear console
        </button>
      </div>

      <div className="console" role="log" aria-live="polite" aria-relevant="additions">
        {logs.length === 0 ? (
          <p className="console-empty">Connect a device to begin capturing serial traffic.</p>
        ) : (
          logs.map((entry) => (
            <div className={`console-line console-line--${entry.kind}`} key={entry.id}>
              <time>{entry.timestamp}</time>
              <span className="console-kind">{entry.kind.toUpperCase()}</span>
              <code>{entry.message}</code>
            </div>
          ))
        )}
      </div>
    </details>
  );
}
