import type { Metadata } from "next";
import { ControllerPageClient } from "./controller-page-client";

export const metadata: Metadata = {
  title: "Robot Arm Controller | ENGG1101",
  description: "Control the ENGG1101 ST3215 robot arm over Web Serial.",
};

export default function RoboticArmControllerPage() {
  return <ControllerPageClient />;
}
