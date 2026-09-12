#!/usr/bin/env node
// The fingerprint repurpose/sources.md records for a run's source (references/run-memory.md): the
// extracted text with case and whitespace normalised, hashed, so the same text pasted twice matches.
//
//   node scripts/fingerprint.mjs <source-folder-or-file>
//
// Prints 16 hex characters. Node 18+, no dependencies.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const target = process.argv[2];
if (!target || !existsSync(target)) {
  console.log("usage: node scripts/fingerprint.mjs <source-folder-or-file>");
  process.exit(2);
}
const files = statSync(target).isDirectory()
  ? readdirSync(target).sort().map((f) => join(target, f)).filter((f) => statSync(f).isFile())
  : [target];
const text = files.map((f) => readFileSync(f, "utf8")).join("\n").toLowerCase().replace(/\s+/g, " ").trim();
console.log(createHash("sha256").update(text).digest("hex").slice(0, 16));
