#!/usr/bin/env node
// One pass over every aspect a change can break. Read-only: it runs the commands
// the config names and nothing else — no deploy, no write, no mutating call.
//
// One line per aspect, then a verdict. With --baseline the run also reports DELTAS
// against the previous pass, because "846 passed" is not a result and "846 passed,
// same as the baseline" is. A missing prerequisite is a SKIP, never a failure — a
// laptop with no local server running must not read as a regression.
//
//   node sweep.mjs --config sweep.config.json [--baseline baseline.json]
//                  [--update-baseline] [--only <substring>]
//
// Config:
//   { "root": ".",                       // aspect cwd paths are relative to this
//     "env":  { "BASE": "http://127.0.0.1:8787" },   // defaults for ${VAR}; the real env wins
//     "timeoutMs": 900000,               // default per-aspect ceiling (optional)
//     "aspects": [
//       { "label": "typecheck", "cwd": "server", "run": "npx tsc --noEmit" },
//       { "label": "unit suite", "cwd": "server", "run": "npm test",
//         "tally": "Tests +\\d+ .*", "failLines": "^ *(FAIL|×)" },
//       { "label": "end-to-end audit", "run": "node audit.mjs --api ${BASE}",
//         "expect": "RESULT: PASS", "timeoutMs": 900000,
//         "requires": { "url": "${BASE}/health" } },
//       { "label": "site build", "cwd": "site", "run": "npm run build", "optional": true } ] }
//
// `expect` exists because exit codes lie: wrappers, shims and some suites report 0
// while printing a failure. When it is set, a zero exit that never matched the
// pattern is a failure.
//
// SKIP_LIVE=1 skips every aspect that needs a URL to answer.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

const configPath = resolve(flag("config", "sweep.config.json"));
if (!existsSync(configPath)) {
  console.error(`no config at ${configPath} — see SKILL.md, "Phase 1 — the aspect sweep"`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const ROOT = resolve(dirname(configPath), config.root ?? ".");
const only = flag("only");
const baselinePath = flag("baseline") ? resolve(flag("baseline")) : null;
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
const observed = {};
let failed = 0;
let skipped = 0;

console.log(`=== ${new Date().toISOString().slice(11, 19)}Z sweep | ${Object.entries(config.env ?? {}).map(([k]) => `${k}=${env[k]}`).join(" ")} ===`);

for (const aspect of aspects) {
  const record = (state, summary) => {
    observed[aspect.label] = { state, ...(aspect.tally ? { summary } : {}) };
  };

  const cwd = aspect.cwd ? at(expand(aspect.cwd)) : ROOT;
  if (!existsSync(cwd)) {
    // A missing OPTIONAL working copy is a skip; a missing required one is a
    // failure, or the run reports ALL GREEN over a layer nobody exercised.
    if (aspect.optional) {
      skipped++;
      record("SKIP", "");
      line("SKIP", aspect.label, `${aspect.cwd} not present`);
    } else {
      failed++;
      record("FAIL", "");
      line("FAIL", aspect.label, `${aspect.cwd} not present — mark the aspect "optional": true if that is expected`);
    }
    continue;
  }

  const needsUrl = aspect.requires?.url;
  if (needsUrl && process.env.SKIP_LIVE === "1") {
    skipped++;
    record("SKIP", "");
    line("SKIP", aspect.label, "SKIP_LIVE=1");
    continue;
  }
  if (needsUrl && !(await answers(expand(needsUrl)))) {
    skipped++;
    record("SKIP", "");
    line("SKIP", aspect.label, `nothing answering on ${expand(needsUrl)}`);
    continue;
  }
  if (aspect.requires?.path && !existsSync(at(expand(aspect.requires.path)))) {
    skipped++;
    record("SKIP", "");
    line("SKIP", aspect.label, `${aspect.requires.path} not present`);
    continue;
  }

  const timeout = aspect.timeoutMs ?? config.timeoutMs;
  const result = spawnSync(expand(aspect.run), {
    cwd,
    shell: true,
    encoding: "utf8",
    env,
    ...(timeout ? { timeout, killSignal: "SIGKILL" } : {}),
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const lines = output.split("\n").map((l) => l.trimEnd()).filter(Boolean);

  // A tally regex keeps the one line worth comparing across passes.
  const tally = aspect.tally ? lines.filter((l) => new RegExp(aspect.tally).test(l)).pop() : undefined;
  const summary = trim((tally ?? lines[lines.length - 1] ?? "").replace(/\s+/g, " "));

  const timedOut = result.error?.code === "ETIMEDOUT" || (timeout && result.signal === "SIGKILL");
  const outputLies = result.status === 0 && aspect.expect && !new RegExp(aspect.expect).test(output);

  if (timedOut) {
    failed++;
    record("FAIL", summary);
    line("FAIL", aspect.label, `timed out after ${timeout}ms — the aspect never finished, nothing was verified`);
  } else if (outputLies) {
    failed++;
    record("FAIL", summary);
    line("FAIL", aspect.label, `exit 0, but the output never matched /${aspect.expect}/ — the command reports failure in its output`);
    console.log(lines.slice(-15).map((l) => `      ${l}`).join("\n"));
  } else if (result.status === 0) {
    record("OK", summary);
    line("OK", aspect.label, summary);
  } else {
    failed++;
    record("FAIL", summary);
    line("FAIL", aspect.label, `rc=${result.status ?? "signal"}  ${summary}`);
    // The failing test names beat a blind tail, when the runner marks them.
    const named = aspect.failLines ? lines.filter((l) => new RegExp(aspect.failLines).test(l)).slice(0, 15) : [];
    console.log((named.length ? named : lines.slice(-25)).map((l) => `      ${l}`).join("\n"));
  }
}

console.log(`VERDICT: ${failed === 0 ? "ALL GREEN" : `${failed} ASPECT(S) FAILED`}${skipped ? ` (${skipped} skipped)` : ""}`);

if (baselinePath) {
  const exists = existsSync(baselinePath);
  if (!exists || has("update-baseline")) {
    // A filtered pass must not drop the aspects it never ran from the baseline.
    const previous = exists && only ? JSON.parse(readFileSync(baselinePath, "utf8")) : {};
    const merged = { ...previous, ...observed };
    writeFileSync(baselinePath, `${JSON.stringify(merged, null, 2)}\n`);
    console.log(`baseline ${exists ? "updated" : "written"}: ${baselinePath} (${Object.keys(merged).length} aspect${Object.keys(merged).length === 1 ? "" : "s"})`);
  } else {
    const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
    const deltas = [];
    for (const [label, now] of Object.entries(observed)) {
      const then = baseline[label];
      if (!then) {
        deltas.push(`${label} — new aspect, no baseline — ${now.state}`);
        continue;
      }
      // Only a declared `tally` line is compared: a bare last line carries timings
      // and would report a delta on every pass.
      if (then.state !== now.state) deltas.push(`${label} — ${then.state} → ${now.state}${now.summary ? ` "${now.summary}"` : ""}`);
      else if (now.summary !== undefined && then.summary !== now.summary) deltas.push(`${label} — ${now.state}, tally moved: "${then.summary}" → "${now.summary}"`);
    }
    // With --only the pass was deliberately narrowed; the rest are not missing.
    if (!only) {
      for (const label of Object.keys(baseline)) {
        if (!(label in observed)) deltas.push(`${label} — in the baseline, not run this pass`);
      }
    }
    if (deltas.length === 0) console.log(`no deltas vs baseline (${Object.keys(observed).length} aspects, ${baselinePath})`);
    else {
      console.log(`DELTAS vs baseline (${baselinePath}):`);
      for (const delta of deltas) console.log(`  ${delta}`);
    }
  }
}

process.exitCode = failed === 0 ? 0 : 1;
