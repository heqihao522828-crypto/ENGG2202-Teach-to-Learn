import { useEffect } from "react";
import { useMotorIdSetup } from "../calibration/useMotorIdSetup";
import type { useRobotController } from "../controller/useRobotController";

type RobotController = ReturnType<typeof useRobotController>;

export function MotorIdSetupSection({ controller, onWriteStateChange }: { controller: RobotController; onWriteStateChange: (inProgress: boolean) => void }) {
  const setup = useMotorIdSetup({
    connected: controller.connected,
    controllerBusy: controller.busy,
    eStopLatched: controller.eStopLatched,
    ping: controller.motorIdSetup.ping,
    detect: controller.motorIdSetup.detect,
    assign: controller.motorIdSetup.assign
  });

  useEffect(() => onWriteStateChange(setup.operationInProgress), [onWriteStateChange, setup.operationInProgress]);

  return (
    <section className="calibration-section motor-id-setup" aria-labelledby="motor-id-setup-title">
      <h2 id="motor-id-setup-title">Motor ID Setup</h2>
      <p className="motor-id-warning" role="alert">Only one servo should be connected while changing its ID.</p>

      <div className="motor-id-detected">
        <span>Detected Motor ID</span>
        <strong>{setup.detectedId ?? "—"}</strong>
      </div>

      <button className="button button--secondary" disabled={!setup.interactionEnabled} onClick={() => void setup.detectMotorId()}>
        {setup.stage === "scanning" ? "Detecting..." : "Detect Motor ID"}
      </button>

      <label className="motor-id-destination">
        <span>New Motor ID</span>
        <select value={setup.requestedId} disabled={!setup.interactionEnabled} onChange={(event) => setup.setRequestedId(Number(event.target.value))}>
          {controller.motors.map((motor) => <option value={motor.id} key={motor.id}>{motor.id} — {motor.name}</option>)}
        </select>
      </label>

      <button className="button button--primary" disabled={!setup.canAssign} onClick={() => void setup.assignMotorId()}>
        {setup.operationInProgress && setup.stage !== "scanning" ? "Setting ID..." : "Set Motor ID"}
      </button>

      <p className={`calibration-result ${setup.error ? "calibration-result--error" : ""}`} aria-live="polite">
        {setup.error ?? setup.message}
      </p>
    </section>
  );
}
