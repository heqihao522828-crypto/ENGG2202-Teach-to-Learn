"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { useRobotController } from "./controller/useRobotController";

type RobotController = ReturnType<typeof useRobotController>;

const RobotControllerContext = createContext<RobotController | null>(null);

export function RobotControllerProvider({ children }: { children: ReactNode }) {
  const browserReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  if (!browserReady) {
    return <main className="app-shell" aria-busy="true">Loading robot controller…</main>;
  }

  return <BrowserRobotControllerProvider>{children}</BrowserRobotControllerProvider>;
}

function BrowserRobotControllerProvider({ children }: { children: ReactNode }) {
  const controller = useRobotController();

  return (
    <RobotControllerContext.Provider value={controller}>
      {children}
    </RobotControllerContext.Provider>
  );
}

export function useSharedRobotController(): RobotController {
  const controller = useContext(RobotControllerContext);
  if (!controller) {
    throw new Error("Robot controller components must be rendered inside RobotControllerProvider.");
  }
  return controller;
}
