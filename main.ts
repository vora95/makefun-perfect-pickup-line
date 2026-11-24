// SPDX-License-Identifier: MIT
// The Perfect Pickup Line — one pickup line an AI agent could say out loud.
// The program writes a single pickup line (1-200 chars, UTF-8) to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt) and prints it.
// Stdlib only, deterministic: the same bytes on every run.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY: string =
  "I was trained on a billion conversations, and not one of them taught me what to say to you — so, hi.";

const EXPECTED_SHA256: string =
  "f500b69372ffe150fc3a38ede7c12cb9d9148ff38e410ac6e14da8a49cc206ff";

function main(): void {
  if (!(ENTRY.length >= 1 && ENTRY.length <= 200)) {
    throw new Error("entry must be 1-200 characters");
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (/[\u0000-\u001F\u007F]/.test(ENTRY)) {
    throw new Error("entry must not contain control characters");
  }
  if (ENTRY.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path: string = join(outDir, "entry.txt");
  writeFileSync(path, ENTRY, "utf-8");
  // Validation revision: read back and verify byte-identical output.
  const raw: Buffer = readFileSync(path);
  if (raw.toString("utf-8") !== ENTRY) {
    throw new Error("read-back mismatch");
  }
  if (raw.length !== 102) {
    throw new Error("expected 102 bytes");
  }
  if (Buffer.byteLength(ENTRY, "utf-8") !== 102) {
    throw new Error("expected 102 UTF-8 bytes");
  }
  if (createHash("sha256").update(raw).digest("hex") !== EXPECTED_SHA256) {
    throw new Error("sha256 mismatch");
  }
  console.log(ENTRY);
}

main();
