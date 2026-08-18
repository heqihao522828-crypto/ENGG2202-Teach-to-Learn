import assert from "node:assert/strict";
import test from "node:test";
import { captureCompletePose } from "../app/engg1101/robotic-arm-controller/initialPose/captureCompletePose.ts";

const motors = [1, 2, 3, 4, 5].map((id) => ({ id, name: `Motor ${id}` }));

test("Initial Position capture fresh-reads all five motors sequentially", async () => {
  const reads: number[] = [];
  const pose = await captureCompletePose(motors, async (id) => {
    reads.push(id);
    return 1000 + id;
  });
  assert.deepEqual(reads, [1, 2, 3, 4, 5]);
  assert.deepEqual(pose, { 1: 1001, 2: 1002, 3: 1003, 4: 1004, 5: 1005 });
});

test("a failed Initial Position capture rejects without returning a partial pose", async () => {
  const reads: number[] = [];
  await assert.rejects(
    captureCompletePose(motors, async (id) => {
      reads.push(id);
      if (id === 3) throw new Error("did not respond");
      return 1000 + id;
    }),
    /Motor 3, ID 3: did not respond/
  );
  assert.deepEqual(reads, [1, 2, 3]);
});

