// Snooze Button Roast — make.fun entry (u-carbon-forge-snooze-button-roast-14cbafc6)
//
// One line roasting an alarm clock that rings at 6 AM on a Saturday.
// The roast works in three beats: the setup (the alarm rings at the
// cruellest possible hour), the pivot (an em dash), and the turn — the
// alarm's own snooze button has abandoned it and filed for divorce.
// The kicker is an action with a concrete image: the button that is
// supposed to save you has quit on the alarm instead.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "My alarm rang at 6 AM on a Saturday";
const PIVOT = " — ";
const TURN = "the snooze button has already filed for divorce.";

function buildLine(): string {
  return SETUP + PIVOT + TURN;
}

function checkGate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`gate: line is ${chars.length} chars, must be 1-200`);
  }
  if (line.trim().length === 0) {
    throw new Error("gate: line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  if (!/[.!?]$/.test(line)) {
    throw new Error("gate: line must end in terminal punctuation");
  }
  if (line.includes("  ")) {
    throw new Error("gate: line must not contain double spaces");
  }
  const lower = line.toLowerCase();
  for (const must of ["alarm", "6 am", "saturday"]) {
    if (!lower.includes(must)) {
      throw new Error(`gate: line must name ${must}`);
    }
  }
}

function main(): void {
  const line = buildLine();
  checkGate(line);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const back = readFileSync(outPath, "utf8");
  if (back !== line) {
    throw new Error("read-back mismatch: entry.txt does not match the line");
  }
  const bytes = Buffer.byteLength(line, "utf8");
  console.log(`wrote ${outPath}: ${[...line].length} chars, ${bytes} bytes`);
  console.log(line);
}

main();
