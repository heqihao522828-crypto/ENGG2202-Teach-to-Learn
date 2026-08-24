"use client";

import Link from "next/link";
import { CalibrationModeLink } from "./components/CalibrationModeLink";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { GlobalControls } from "./components/GlobalControls";
import { InitialPositionPanel } from "./components/InitialPositionPanel";
import { JointTestControls } from "./components/JointTestControls";
import { RecordAndPlayPanel } from "./components/RecordAndPlayPanel";
import { SerialConsole } from "./components/SerialConsole";
import { useSharedRobotController } from "./controller-provider";

export function ControllerPageClient() {
  const controller = useSharedRobotController();

  return (
    <main className="app-shell">
      <Link href="/engg1101" className="controller-back-link">‹ ENGG1101</Link>
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">RA</div>
          <div>
            <span className="eyebrow">ENGG1101 · Web Serial · ST3215</span>
            <h1>Robot Arm Control Station</h1>
          </div>
        </div>

        <div className="header-metrics" aria-label="Controller summary">
          <div><span>Servos</span><strong>{controller.summary.configuredMotors}</strong></div>
          <div><span>Positions known</span><strong>{controller.summary.knownPositions}/5</strong></div>
          <div><span>Mode</span><strong>{controller.eStopLatched ? "Stopped" : "Manual"}</strong></div>
        </div>
      </header>

      {!controller.serialSupported && (
        <div className="browser-warning" role="alert">
          Web Serial is not supported in this browser. Use Google Chrome or Microsoft Edge on a desktop computer.
        </div>
      )}

      <ConnectionPanel
        serialSupported={controller.serialSupported}
        connected={controller.connected}
        busy={controller.busy}
        activeAction={controller.activeAction}
        baudRate={controller.baudRate}
        eStopLatched={controller.eStopLatched}
        onBaudRateChange={controller.setBaudRate}
        onConnect={() => void controller.connect()}
        onDisconnect={() => void controller.disconnect()}
        onEmergencyStop={() => void controller.emergencyStop()}
        onResetEmergencyStop={controller.resetEmergencyStop}
      />

      <section className={`status-banner status-banner--${controller.status.tone}`} aria-live="polite">
        <span className="status-banner__label">Controller status</span>
        <strong>{controller.status.message}</strong>
        {controller.activeAction && <span className="activity-indicator">Working: {controller.activeAction}</span>}
      </section>

      <div className="controller-layout">
        <div className="controller-main">
          <InitialPositionPanel controller={controller} />
          <RecordAndPlayPanel controller={controller} />
          <JointTestControls controller={controller} />
        </div>

        <aside className="controller-sidebar">
          <GlobalControls
            connected={controller.connected}
            busy={controller.busy}
            motionDisabled={controller.motionDisabled}
            homeAvailability={controller.homeAvailability}
            moveAllDisabled={controller.moveAllDisabled}
            eStopLatched={controller.eStopLatched}
            speed={controller.speed}
            acceleration={controller.acceleration}
            onSpeedChange={controller.setSpeed}
            onAccelerationChange={controller.setAcceleration}
            onMoveAll={() => void controller.moveAll()}
            onReadAll={() => void controller.readAll()}
            onHomeAll={() => void controller.homeAll()}
            onTorqueOn={() => void controller.setAllTorque(true)}
            onTorqueOff={() => void controller.setAllTorque(false)}
          />
          <CalibrationModeLink
            disabled={controller.busy}
            onOpen={() => {
              controller.leaveControllerPage();
              controller.calibration.begin();
            }}
          />
        </aside>
      </div>

      <SerialConsole logs={controller.logs} onClear={controller.clearLogs} />

      <footer className="app-footer">
        <span>ENGG1101 robot arm controller</span>
        <span>Protocol: FeelTech / SCS packet format</span>
      </footer>
    </main>
  );
}
