import Link from "next/link";

export function CalibrationModeLink({ disabled, onOpen }: { disabled: boolean; onOpen: () => void }) {
  return (
    <section className="panel calibration-mode-link" aria-labelledby="calibration-mode-link-title">
      <span className="eyebrow">System setup</span>
      <h2 id="calibration-mode-link-title">Calibration</h2>
      <p>Configure motor IDs and hardware middle positions.</p>
      <Link
        className={`button button--secondary ${disabled ? "button--disabled" : ""}`}
        href="/engg1101/robotic-arm-controller/calibration"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onOpen();
        }}
      >
        Open Calibration Mode
      </Link>
    </section>
  );
}
