import { useState } from "react";
import type { MotorIdWriteStage, ServoProbeResult } from "../webserial/scservo";

export type MotorIdSetupStage = "idle" | "scanning" | "checking-destination" | MotorIdWriteStage | "success" | "error";
type Outcome<T> = { ok: true; value: T } | { ok: false; error: string };

interface UseMotorIdSetupOptions {
  connected: boolean;
  controllerBusy: boolean;
  eStopLatched: boolean;
  ping: (id: number) => Promise<Outcome<boolean>>;
  detect: (onProgress: (id: number) => void) => Promise<Outcome<ServoProbeResult | null>>;
  assign: (currentId: number, newId: number, onStage: (stage: MotorIdWriteStage) => void) => Promise<Outcome<{ changed: boolean; verifiedId: number }>>;
}

export function useMotorIdSetup(options: UseMotorIdSetupOptions) {
  const [detectedId, setDetectedId] = useState<number | null>(null);
  const [verifiedCurrentId, setVerifiedCurrentId] = useState<number | null>(null);
  const [requestedId, setRequestedId] = useState(1);
  const [stage, setStage] = useState<MotorIdSetupStage>("idle");
  const [message, setMessage] = useState("Ready to detect a connected servo.");
  const [error, setError] = useState<string | null>(null);
  const operationInProgress = !["idle", "success", "error"].includes(stage);
  const interactionEnabled = options.connected && !options.controllerBusy && !options.eStopLatched && !operationInProgress;
  const canAssign = interactionEnabled && verifiedCurrentId !== null && requestedId >= 1 && requestedId <= 5;

  const detectMotorId = async () => {
    if (!interactionEnabled) return;
    setStage("scanning");
    setError(null);
    setDetectedId(null);
    setVerifiedCurrentId(null);
    setMessage("Scanning...");
    const result = await options.detect(() => undefined);
    if (!result.ok) {
      setStage("error");
      setError(`Motor detection failed: ${result.error}`);
      return;
    }
    if (!result.value?.found) {
      setStage("error");
      setError("No motor detected.");
      return;
    }
    setDetectedId(result.value.id);
    setVerifiedCurrentId(result.value.id);
    setStage("success");
    setMessage(`Detected ID ${result.value.id}.`);
  };

  const assignMotorId = async () => {
    const currentId = verifiedCurrentId;
    if (!interactionEnabled || currentId === null) {
      setStage("error");
      setError("Detect and verify the connected motor before setting its ID.");
      return false;
    }
    setError(null);
    if (requestedId !== currentId) {
      setStage("checking-destination");
      setMessage(`Checking destination ID ${requestedId}...`);
      const conflict = await options.ping(requestedId);
      if (!conflict.ok) {
        setStage("error");
        setError(`Destination check failed: ${conflict.error}`);
        return false;
      }
      if (conflict.value) {
        setStage("error");
        setError(`Destination ID ${requestedId} is already in use.`);
        return false;
      }
    }
    let activeWriteStage: MotorIdWriteStage = "checking-current";
    setMessage("Setting motor ID...");
    const result = await options.assign(currentId, requestedId, (nextStage) => {
      activeWriteStage = nextStage;
      setStage(nextStage);
    });
    if (!result.ok) {
      setStage("error");
      setError(`${activeWriteStage.replace(/-/g, " ")} failed: ${result.error}`);
      return false;
    }
    setDetectedId(result.value.verifiedId);
    setVerifiedCurrentId(result.value.verifiedId);
    setStage("success");
    setMessage(`Motor ID changed to ${result.value.verifiedId}.`);
    return true;
  };

  return {
    detectedId,
    verifiedCurrentId,
    requestedId,
    setRequestedId,
    stage,
    message,
    error,
    operationInProgress,
    interactionEnabled,
    canAssign,
    detectMotorId,
    assignMotorId
  };
}
