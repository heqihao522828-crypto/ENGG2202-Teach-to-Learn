import { useState } from "react";
import type { useRobotController } from "../controller/useRobotController";
import { MotorCard } from "./MotorCard";

type RobotController = ReturnType<typeof useRobotController>;

export function JointTestControls({ controller }: { controller: RobotController }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={`panel joint-test-controls ${expanded ? "joint-test-controls--expanded" : ""}`} aria-labelledby="joint-test-controls-title">
      <div className="joint-test-controls__header">
        <div>
          <h2 id="joint-test-controls-title">Joint Test Controls</h2>
          <p>Move and read individual joints for manual testing.</p>
        </div>
        <button
          className="text-button joint-test-controls__toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls="joint-test-controls-content"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Collapse ▲" : "Expand ▼"}
        </button>
      </div>

      {expanded && (
        <div id="joint-test-controls-content" className="joint-test-controls__content">
          <div className="joint-test-controls__motors">
            {controller.motors.map((motor) => (
              <MotorCard
                key={motor.key}
                motor={motor}
                connected={controller.connected}
                busy={controller.busy}
                motionDisabled={controller.motionDisabled}
                targetInvalid={!controller.targetValidity[motor.key]}
                onTargetChange={controller.setMotorTarget}
                onJog={controller.jogMotor}
                onMove={(key) => void controller.moveMotor(key)}
                onRead={(key) => void controller.readMotor(key)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
