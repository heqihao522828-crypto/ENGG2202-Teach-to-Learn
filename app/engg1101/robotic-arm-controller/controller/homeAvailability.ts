export type HomeAvailability = { allowed: true } | { allowed: false; reason: string };

export function getHomeAvailability({ connected, eStopLatched, activeOperation, configuredIds }: {
  connected: boolean;
  eStopLatched: boolean;
  activeOperation: string | null;
  configuredIds: readonly number[];
}): HomeAvailability {
  if (!connected) return { allowed: false, reason: "Connect to the controller first." };
  if (eStopLatched) return { allowed: false, reason: "Reset Emergency Stop before returning Home." };
  if (activeOperation) return { allowed: false, reason: `${activeOperation} is currently running.` };
  if (configuredIds.join(",") !== "1,2,3,4,5") return { allowed: false, reason: "Home requires configured servo IDs 1–5." };
  return { allowed: true };
}
