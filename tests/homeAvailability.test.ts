import test from "node:test";
import assert from "node:assert/strict";
import { getHomeAvailability } from "../app/engg1101/robotic-arm-controller/controller/homeAvailability.ts";

const normal = { connected: true, eStopLatched: false, activeOperation: null, configuredIds: [1, 2, 3, 4, 5] } as const;

test("Home is available for a connected idle controller", () => assert.deepEqual(getHomeAvailability(normal), { allowed: true }));
test("Home availability has no Motor 2 or Motor 4 diagnostic prerequisite", () => assert.equal(getHomeAvailability(normal).allowed, true));
test("Home availability has no software center, mechanical limit, Initial Position, or recording prerequisite", () => assert.equal(getHomeAvailability(normal).allowed, true));
test("Home is blocked while Emergency Stop is latched", () => {
  const result = getHomeAvailability({ ...normal, eStopLatched: true });
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.match(result.reason, /Emergency Stop/);
});
test("Home is blocked during an EEPROM operation and restored afterward", () => {
  assert.equal(getHomeAvailability({ ...normal, activeOperation: "Set hardware middle positions" }).allowed, false);
  assert.equal(getHomeAvailability(normal).allowed, true);
});
test("Home requires the complete configured ID set", () => assert.equal(getHomeAvailability({ ...normal, configuredIds: [1, 2, 3, 4] }).allowed, false));

