import test from "node:test";
import assert from "node:assert/strict";
import { SMS_STS_MAX_POSITION, SMS_STS_MIN_POSITION, buildWritePositionPacket, decodeWritePositionPacket } from "../app/engg1101/robotic-arm-controller/webserial/scservo.ts";

test("native recording endpoints remain valid protocol positions", () => {
  for (const position of [SMS_STS_MIN_POSITION, 2048, SMS_STS_MAX_POSITION]) {
    assert.equal(decodeWritePositionPacket(buildWritePositionPacket(1, position, 1, 0))?.rawPosition, position);
  }
});
test("native packet builder rejects out-of-range recorded positions", () => {
  assert.throws(() => buildWritePositionPacket(1, -1, 1, 0));
  assert.throws(() => buildWritePositionPacket(1, 4096, 1, 0));
});

