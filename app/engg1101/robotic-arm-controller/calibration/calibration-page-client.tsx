"use client";

import { useRouter } from "next/navigation";
import { CalibrationPage } from "../components/CalibrationPage";
import { useSharedRobotController } from "../controller-provider";

export function CalibrationPageClient() {
  const controller = useSharedRobotController();
  const router = useRouter();

  return (
    <CalibrationPage
      controller={controller}
      onBack={() => router.push("/engg1101/robotic-arm-controller")}
    />
  );
}
