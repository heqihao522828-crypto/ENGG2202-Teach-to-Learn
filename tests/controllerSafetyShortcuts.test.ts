import test from "node:test";
import assert from "node:assert/strict";
import {
  BAUD_RATE_OPTIONS,
  formatBaudRateDisplay
} from "../app/engg1101/robotic-arm-controller/controller/baudRateDisplay.ts";
import {
  handleEmergencyStopKeyDown,
  registerEmergencyStopShortcut
} from "../app/engg1101/robotic-arm-controller/controller/keyboardEmergencyStop.ts";

test("baud rates display as plain decimal digits without changing their numeric values", () => {
  assert.equal(formatBaudRateDisplay(115200), "115200");
  assert.notEqual(formatBaudRateDisplay(115200), "115,200");
  assert.equal(formatBaudRateDisplay(1000000), "1000000");
  assert.deepEqual(BAUD_RATE_OPTIONS, [9600, 57600, 115200, 500000, 1000000]);
  assert.equal(typeof BAUD_RATE_OPTIONS[2], "number");
});

test("Space prevents scrolling and invokes the canonical emergency-stop callback once", () => {
  let stopCount = 0;
  let preventDefaultCount = 0;
  const emergencyStop = () => { stopCount += 1; };

  handleEmergencyStopKeyDown(
    { code: "Space", repeat: false, preventDefault: () => { preventDefaultCount += 1; } },
    emergencyStop
  );

  assert.equal(stopCount, 1);
  assert.equal(preventDefaultCount, 1);
});

test("keyboard repeat and non-Space keys do not invoke emergency stop", () => {
  let stopCount = 0;
  let preventDefaultCount = 0;
  const emergencyStop = () => { stopCount += 1; };
  const preventDefault = () => { preventDefaultCount += 1; };

  handleEmergencyStopKeyDown({ code: "Space", repeat: true, preventDefault }, emergencyStop);
  handleEmergencyStopKeyDown({ code: "Enter", repeat: false, preventDefault }, emergencyStop);

  assert.equal(stopCount, 0);
  assert.equal(preventDefaultCount, 0);
});

test("the route-scoped shortcut registers once and removes the same listener on cleanup", () => {
  const added: Array<(event: KeyboardEvent) => void> = [];
  const removed: Array<(event: KeyboardEvent) => void> = [];
  const target = {
    addEventListener: (_type: "keydown", listener: (event: KeyboardEvent) => void) => added.push(listener),
    removeEventListener: (_type: "keydown", listener: (event: KeyboardEvent) => void) => removed.push(listener)
  };

  const cleanup = registerEmergencyStopShortcut(() => undefined, target);
  assert.equal(added.length, 1);

  cleanup();
  assert.equal(removed.length, 1);
  assert.equal(removed[0], added[0]);
});
