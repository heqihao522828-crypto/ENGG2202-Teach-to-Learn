type EmergencyStop = () => void;

interface KeyboardListenerTarget {
  addEventListener(type: "keydown", listener: (event: KeyboardEvent) => void): void;
  removeEventListener(type: "keydown", listener: (event: KeyboardEvent) => void): void;
}

export function handleEmergencyStopKeyDown(
  event: Pick<KeyboardEvent, "code" | "repeat" | "preventDefault">,
  emergencyStop: EmergencyStop
): void {
  if (event.code !== "Space" || event.repeat) return;

  event.preventDefault();
  emergencyStop();
}

export function registerEmergencyStopShortcut(
  emergencyStop: EmergencyStop,
  target: KeyboardListenerTarget = window
): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    handleEmergencyStopKeyDown(event, emergencyStop);
  };

  target.addEventListener("keydown", onKeyDown);
  return () => target.removeEventListener("keydown", onKeyDown);
}
