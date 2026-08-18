import test from "node:test";
import assert from "node:assert/strict";
import { SMS_STS_NATIVE_MIDDLE, buildCalibrationOfsPacket, buildWritePositionPacket, decodeWritePositionPacket } from "../app/engg1101/robotic-arm-controller/webserial/scservo.ts";

test("the canonical native ST3215 middle is 2048", () => assert.equal(SMS_STS_NATIVE_MIDDLE, 2048));
test("Home/native middle encodes directly with no coordinate conversion", () => {
  const decoded = decodeWritePositionPacket(buildWritePositionPacket(2, SMS_STS_NATIVE_MIDDLE, 300, 20));
  assert.equal(decoded?.rawPosition, 2048);
});
test("Home commands all five IDs, including Motors 2 and 4, exactly once", () => {
  const packets = [1, 2, 3, 4, 5].map((id) => buildWritePositionPacket(id, SMS_STS_NATIVE_MIDDLE, 300, 20));
  assert.deepEqual(packets.map((packet) => decodeWritePositionPacket(packet)?.id), [1, 2, 3, 4, 5]);
  assert.ok(packets.every((packet) => decodeWritePositionPacket(packet)?.rawPosition === SMS_STS_NATIVE_MIDDLE));
});
test("individual native target encodes unchanged", () => {
  assert.equal(decodeWritePositionPacket(buildWritePositionPacket(4, 2500, 100, 5))?.rawPosition, 2500);
});
test("official CalibrationOfs writes value 128 to torque-enable register 40", () => {
  assert.deepEqual([...buildCalibrationOfsPacket(2)], [0xff, 0xff, 2, 4, 3, 40, 128, 78]);
});

