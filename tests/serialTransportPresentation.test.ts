import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("fatal serial failures clear connected UI state and expose the real transport error", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/controller/useRobotController.ts", import.meta.url), "utf8");
  assert.match(source, /setTransportErrorListener\(onTransportError\)/);
  assert.match(source, /setConnected\(false\)/);
  assert.match(source, /Serial transport error: \$\{event\.name\}: \$\{event\.message\}/);
  assert.match(source, /console\.error\("Serial transport failure", event\.error, event\)/);
});

test("the transport owns one initial reader, one recovery reader, and one persistent writer acquisition site", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/webserial/scservo.ts", import.meta.url), "utf8");
  assert.equal(source.match(/\.getReader\(\)/g)?.length, 2);
  assert.equal(source.match(/\.getWriter\(\)/g)?.length, 1);
  assert.match(source, /reader\.releaseLock\(\)/);
  assert.match(source, /writer\.releaseLock\(\)/);
});

test("the critical RX loop queues listener work instead of invoking UI listeners inline", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/webserial/scservo.ts", import.meta.url), "utf8");
  assert.match(source, /private emitTraffic[\s\S]*this\.queueListenerEvent/);
  assert.match(source, /private emitDiagnostic[\s\S]*this\.queueListenerEvent/);
  assert.match(source, /this\.listenerFlushTimer = setTimeout/);
});

test("record sampling and playback await each cycle instead of overlapping or flooding commands", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/recording/useRecordAndPlay.ts", import.meta.url), "utf8");
  assert.match(source, /while \(!stopRecordingRequestedRef\.current[\s\S]*const positions = await readCompleteSample\(\)/);
  assert.match(source, /await options\.moveToLogicalPose\([\s\S]*nextIndex = dueIndex \+ 1/);
  assert.doesNotMatch(source, /setInterval\([^)]*readCompleteSample/);
});

