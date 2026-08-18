import type { ReactNode } from "react";
import SiteShell from "../../components/site-shell";
import { RobotControllerProvider } from "./controller-provider";
import "./controller.css";

export default function RoboticArmControllerLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <div className="robot-controller">
        <RobotControllerProvider>{children}</RobotControllerProvider>
      </div>
    </SiteShell>
  );
}
