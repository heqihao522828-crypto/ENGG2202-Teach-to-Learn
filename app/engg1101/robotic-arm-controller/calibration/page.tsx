import type { Metadata } from "next";
import { CalibrationPageClient } from "./calibration-page-client";

export const metadata: Metadata = {
  title: "Calibration Mode | ENGG1101 Robot Arm",
  description: "Configure ST3215 motor IDs and hardware middle positions.",
};

export default function RobotArmCalibrationPage() {
  return <CalibrationPageClient />;
}
