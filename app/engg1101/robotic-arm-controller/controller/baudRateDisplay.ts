export const BAUD_RATE_OPTIONS = [9600, 57600, 115200, 500000, 1000000] as const;

export function formatBaudRateDisplay(baudRate: number): string {
  return String(baudRate);
}
