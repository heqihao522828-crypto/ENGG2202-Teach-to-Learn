import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Motor ID Setup exposes only the production Detect and Set workflow", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/components/MotorIdSetupSection.tsx");
  assert.match(source, /Detect Motor ID/);
  assert.match(source, /Set Motor ID/);
  assert.match(source, /Detected Motor ID/);
  for (const removed of ["Ping Current ID", "Ping ID 1", "Read Position", "Model Number", "Diagnostics", "Last TX", "Last RX", "checksum", "timeout", "checkbox"]) {
    assert.doesNotMatch(source, new RegExp(removed, "i"));
  }
});

test("detected ID is internally verified and Set performs its destination conflict check", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/calibration/useMotorIdSetup.ts");
  assert.match(source, /setVerifiedCurrentId\(result\.value\.id\)/);
  assert.match(source, /const conflict = await options\.ping\(requestedId\)/);
  assert.match(source, /is already in use/);
  assert.match(source, /options\.assign\(currentId, requestedId/);
  assert.doesNotMatch(source, /confirmedSingleMotor|pingCurrent/);
});

test("Hardware Middle is one direct action with no steps or confirmation UI", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/components/CalibrationPage.tsx");
  assert.match(source, /Hardware Middle Position/);
  assert.match(source, /Set Current Pose as Hardware Middle/);
  assert.match(source, /await controller\.setAllTorque\(false\)/);
  assert.match(source, /await controller\.calibration\.setAllHardwareMiddles\(\)/);
  assert.doesNotMatch(source, /Step [123]|calibration-steps|checkbox|Verify IDs|Release All Motors|Enable All Motors/);
});

test("hardware-middle production workflow remains sequential and verifies each motor", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/controller/useRobotController.ts");
  const start = source.indexOf("const setAllHardwareMiddles");
  const workflow = source.slice(start, source.indexOf("const moveAll", start));
  assert.match(workflow, /for \(const motor of motors\)/);
  assert.match(workflow, /await client\.calibrationOfs/);
  assert.match(workflow, /await client\.readPosition/);
  assert.match(workflow, /verification failed/);
});

test("Calibration Mode uses a proper Next.js route without Vite hash routing", () => {
  const link = readSource("../app/engg1101/robotic-arm-controller/components/CalibrationModeLink.tsx");
  const page = readSource("../app/engg1101/robotic-arm-controller/calibration/page.tsx");
  assert.match(link, /\/engg1101\/robotic-arm-controller\/calibration/);
  assert.match(page, /CalibrationPageClient/);
  assert.doesNotMatch(link + page, /#\/calibration/);
});

