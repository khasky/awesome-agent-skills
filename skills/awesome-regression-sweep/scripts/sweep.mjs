#!/usr/bin/env node
// One pass over every aspect a change can break. Read-only: it runs the commands
// the config names and nothing else — no deploy, no write, no mutating call.
//
// One line per aspect, then a verdict. The output is meant to be DIFFED against the
// previous pass: "846 passed" is not a result, "846 passed, same as the baseline"
// is. A missing prerequisite is a SKIP, never a failure — a laptop with no local
// server running must not read as a regression.
//
//   node sweep.mjs --config sweep.config.json [--only <substring>]
//
// Config:
//   { "root": ".",                       // aspect cwd paths are relative to this
//     "env":  { "BASE": "http://127.0.0.1:8787" },   // defaults for ${VAR}; the real env wins
//     "aspects": [
//       { "label": "typecheck", "cwd": "server", "run": "npx tsc --noEmit" },
//       { "label": "unit suite", "cwd": "server", "run": "npm test", "tally": "Tests +\\d+ .*" },
//       { "label": "wire contract", "run": "node http-contract.mjs --base ${BASE} --path /v1/status",
//         "requires": { "url": "${BASE}/health" } },
//       { "label": "site build", "cwd": "site", "run": "npm run build", "optional": true } ] }
//
// SKIP_LIVE=1 skips every aspect that needs a URL to answer.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const configPath = resolve(flag("config", "sweep.config.json"));
if (!existsSync(configPath)) {
  console.error(`no config at ${configPath} — see SKILL.md, "Phase 1 — the aspect sweep"`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const ROOT = resolve(dirname(configPath), config.root ?? ".");
const only = flag("only");
const env = { ...config.env, ...process.env };

const expand = (s) => String(s).replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => env[name] ?? "");
const at = (rel) => (isAbsolute(rel) ? rel : join(ROOT, rel));
const trim = (line, n = 90) => (line.length > n ? `${line.slice(0, n - 1)}…` : line);

const line = (state, label, rest = "") => console.log(`${state.padEnd(6)}${label.padEnd(28)}${rest}`);

async function answers(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "manual" });
    return response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

const aspects = (config.aspects ?? []).filter((a) => !only || a.label.includes(only));
let failed = 0;
let skipped = 0;

console.log(`=== ${new Date().toISOString().slice(11, 19)}Z sweep | ${Object.entries(config.env ?? {}).map(([k]) => `${k}=${env[k]}`).join(" ")} ===`);

for (const aspect of aspects) {
  const cwd = aspect.cwd ? at(expand(aspect.cwd)) : ROOT;
  if (!existsSync(cwd)) {
    // A missing OPTIONAL working copy is a skip; a missing required one is a
    // failure, or the run reports ALL GREEN over a layer nobody exercised.
    if (aspect.optional) {
      skipped++;
      line("SKIP", aspect.label, `${aspect.cwd} not present`);
    } else {
      failed++;
      line("FAIL", aspect.label, `${aspect.cwd} not present — mark the aspect "optional": true if that is expected`);
    }
    continue;
  }

  const needsUrl = aspect.requires?.url;
  if (needsUrl && process.env.SKIP_LIVE === "1") {
    skipped++;
    line("SKIP", aspect.label, "SKIP_LIVE=1");
    continue;
  }
  if (needsUrl && !(await answers(expand(needsUrl)))) {
    skipped++;
    line("SKIP", aspect.label, `nothing answering on ${expand(needsUrl)}`);
    continue;
  }
  if (aspect.requires?.path && !existsSync(at(expand(aspect.requires.path)))) {
    skipped++;
    line("SKIP", aspect.label, `${aspect.requires.path} not present`);
    continue;
  }

  const command = expand(aspect.run);
  const result = spawnSync(command, { cwd, shell: true, encoding: "utf8", env });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const lines = output.split("\n").map((l) => l.trimEnd()).filter(Boolean);

  // A tally regex keeps the one line worth comparing across passes.
  const tally = aspect.tally ? lines.filter((l) => new RegExp(aspect.tally).test(l)).pop() : undefined;
  const summary = trim((tally ?? lines[lines.length - 1] ?? "").replace(/\s+/g, " "));

  if (result.status === 0) {
    line("OK", aspect.label, summary);
  } else {
    failed++;
    line("FAIL", aspect.label, `rc=${result.status ?? "signal"}  ${summary}`);
    console.log(lines.slice(-25).map((l) => `      ${l}`).join("\n"));
  }
}

console.log(`VERDICT: ${failed === 0 ? "ALL GREEN" : `${failed} ASPECT(S) FAILED`}${skipped ? ` (${skipped} skipped)` : ""}`);
process.exitCode = failed === 0 ? 0 : 1;
