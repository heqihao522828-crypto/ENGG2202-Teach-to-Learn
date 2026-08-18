import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  contextualStopAction,
  formatRecordPlayTime,
  playbackProgress,
  simpleRecordPlayStatus
} from "../app/engg1101/robotic-arm-controller/recording/recordPlayPresentation.ts";

test("Record and Play uses one concise timer format", () => {
  assert.equal(formatRecordPlayTime(0), "00:00");
  assert.equal(formatRecordPlayTime(65_999), "01:05");
});

test("the contextual Stop action dispatches recording and playback correctly", () => {
  assert.equal(contextualStopAction("idle"), null);
  assert.equal(contextualStopAction("recording"), "recording");
  assert.equal(contextualStopAction("playing"), "playback");
  assert.equal(contextualStopAction("preparing-playback"), "playback");
});

test("the compact status exposes only Idle, Recording, or Playing", () => {
  assert.equal(simpleRecordPlayStatus("idle"), "Idle");
  assert.equal(simpleRecordPlayStatus("moving-to-initial"), "Recording");
  assert.equal(simpleRecordPlayStatus("playing"), "Playing");
  assert.equal(simpleRecordPlayStatus("error"), "Idle");
});

test("playback timer follows speed and clamps at recorded duration", () => {
  assert.equal(playbackProgress(1_000, 4_000, 1, 10_000), 3_000);
  assert.equal(playbackProgress(1_000, 4_000, 2, 10_000), 6_000);
  assert.equal(playbackProgress(1_000, 20_000, 1, 10_000), 10_000);
});

test("the normal Record and Play card exposes only the compact controls", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/components/RecordAndPlayPanel.tsx", import.meta.url), "utf8");
  for (const visible of ["Record and Play", "Start", "Stop", "Play", "record-play__timer"]) {
    assert.match(source, new RegExp(visible));
  }
  for (const removed of ["Frames", "Actual sample rate", "Recorded", "Calibration", "Delete Recording", "Playback speed", "Recording sample rate"]) {
    assert.doesNotMatch(source, new RegExp(removed));
  }
});

test("the visible timer is independent of a saved recording while idle", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/components/RecordAndPlayPanel.tsx", import.meta.url), "utf8");
  assert.match(source, /useState\(0\)/);
  assert.doesNotMatch(source, /useState\(feature\.recording\?\.durationMs/);
  assert.doesNotMatch(source, /setDisplayElapsedMs\(feature\.recording\?\.durationMs/);
});

test("playback terminal states reset rather than retain playback progress", () => {
  const source = readFileSync(new URL("../app/engg1101/robotic-arm-controller/components/RecordAndPlayPanel.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /retainedPlaybackTime/);
  assert.match(source, /if \(feature\.mode === "stopping-recording" \|\| feature\.mode === "recording-ready"\)/);
  assert.match(source, /setDisplayElapsedMs\(0\);/);
});

