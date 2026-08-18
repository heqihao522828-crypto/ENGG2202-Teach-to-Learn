import { useEffect, useState } from "react";
import type { useRobotController } from "../controller/useRobotController";
import { MotorIdSetupSection } from "./MotorIdSetupSection";

type RobotController = ReturnType<typeof useRobotController>;

export function CalibrationPage({ controller, onBack }: { controller: RobotController; onBack: () => void }) {
  const [idWriteInProgress, setIdWriteInProgress] = useState(false);
  const settingMiddle = controller.activeAction === "Set hardware middle positions" || controller.activeAction === "Release all torque";

  useEffect(() => {
    const title = document.title;
    document.title = "Calibration Mode · Robot Arm Control Station";
    return () => { document.title = title; };
  }, []);

  const setHardwareMiddle = async () => {
    if (!controller.connected || controller.eStopLatched || controller.busy || idWriteInProgress) return;
    await controller.setAllTorque(false);
    await controller.calibration.setAllHardwareMiddles();
  };

  return (
    <main className="calibration-page">
      <header className="calibration-page__header">
        <div>
          <span className="eyebrow">Persistent servo configuration</span>
          <h1>Calibration Mode</h1>
          <p>Configure motor IDs and the native hardware middle.</p>
        </div>
        <button className="button button--secondary" disabled={idWriteInProgress || controller.busy} onClick={onBack}>Back to Controller</button>
      </header>

      <MotorIdSetupSection controller={controller} onWriteStateChange={setIdWriteInProgress} />

      <section className="calibration-section hardware-middle-setup" aria-labelledby="hardware-middle-title">
        <h2 id="hardware-middle-title">Hardware Middle Position</h2>
        <p>Support and position the arm at the desired middle pose, then set the current servo positions as the hardware middle.</p>
        <button
          className="button button--primary button--large"
          disabled={!controller.connected || controller.eStopLatched || controller.busy || idWriteInProgress}
          onClick={() => void setHardwareMiddle()}
        >
          {settingMiddle ? "Setting Hardware Middle..." : "Set Current Pose as Hardware Middle"}
        </button>
        <p className={`calibration-result calibration-result--${controller.calibration.status.tone}`} aria-live="polite">
          Status: {controller.calibration.status.message}
        </p>
      </section>
    </main>
  );
}
