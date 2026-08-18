import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Joint Test Controls starts collapsed and uses an accessible toggle", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/components/JointTestControls.tsx");
  assert.match(source, /Joint Test Controls/);
  assert.doesNotMatch(source, /Joint Calibration/);
  assert.match(source, /useState\(false\)/);
  assert.match(source, /aria-expanded=\{expanded\}/);
  assert.match(source, /aria-controls="joint-test-controls-content"/);
  assert.match(source, /expanded &&/);
  assert.match(source, /Expand/);
  assert.match(source, /Collapse/);
});

test("individual joint cards render Move and Read without Ping or Home buttons", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/components/MotorCard.tsx");
  const actions = source.slice(source.indexOf('<div className="motor-actions">'), source.indexOf("</div>", source.indexOf('<div className="motor-actions">')));
  assert.match(actions, />\s*Move \{motor\.name\}/);
  assert.match(actions, />\s*Read\s*</);
  assert.doesNotMatch(actions, /Ping/);
  assert.doesNotMatch(actions, /Home/);
  assert.doesNotMatch(source, />\s*Home\s*</);
});

test("controller layout separates manual testing from Calibration Mode", () => {
  const source = readSource("../app/engg1101/robotic-arm-controller/controller-page-client.tsx");
  const sidebar = source.slice(source.indexOf('<aside className="controller-sidebar">'), source.indexOf("</aside>"));
  const main = source.slice(source.indexOf('<div className="controller-main">'), source.indexOf("</div>\n      </div>"));
  assert.ok(sidebar.indexOf("<GlobalControls") < sidebar.indexOf("<CalibrationModeLink"));
  assert.doesNotMatch(sidebar, /JointTestControls/);
  assert.match(main, /<InitialPositionPanel/);
  assert.match(main, /<RecordAndPlayPanel/);
  assert.match(main, /<JointTestControls/);
  assert.ok(main.indexOf("<RecordAndPlayPanel") < main.indexOf("<JointTestControls"));
  assert.match(readSource("../app/engg1101/robotic-arm-controller/components/CalibrationModeLink.tsx"), /robotic-arm-controller\/calibration/);
});

test("desktop sidebar is sticky and mobile layout is one column", () => {
  const css = readSource("../app/engg1101/robotic-arm-controller/controller.css");
  assert.match(css, /\.controller-sidebar\s*\{[\s\S]*?position: sticky/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*?\.controller-layout\s*\{[\s\S]*?grid-template-columns: 1fr/);
  assert.match(css, /\.joint-test-controls__motors\s*\{[\s\S]*?repeat\(auto-fit/);
});

test("global Home remains and Calibration Mode has distinct sidebar navigation", () => {
  assert.match(readSource("../app/engg1101/robotic-arm-controller/components/GlobalControls.tsx"), /Move all to home/);
  const link = readSource("../app/engg1101/robotic-arm-controller/components/CalibrationModeLink.tsx");
  assert.match(link, /Open Calibration Mode/);
  assert.match(link, /motor IDs and hardware middle positions/);
});

