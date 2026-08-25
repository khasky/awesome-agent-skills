#!/usr/bin/env node
// Mutation test for check-claims.mjs: break one claim at a time, confirm the check
// that owns it names the finding, restore.
//
// A checker that has only ever printed PASS has proven nothing. The classic failure
// is a check that looks for a value ANYWHERE in a file which still contains it in a
// second map — green while the map a reader actually sees is broken. Run this after
// writing or editing checks, and add a mutation whenever you add one.
//
//   node prove-checks.mjs --config claims.config.json
//
// Each file is restored from an in-memory copy, never from git, so uncommitted work
// survives. If the process is killed mid-run, `git diff` shows the one mutation left
// behind.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const configPath = resolve(flag("config", "claims.config.json"));
if (!existsSync(configPath)) {
  console.error(`no config at ${configPath}`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const ROOT = resolve(dirname(configPath), config.root ?? ".");
const CHECKER = flag("checker", join(here, "check-claims.mjs"));
const mutations = config.mutations ?? [];

if (mutations.length === 0) {
  console.error("the config carries no `mutations` — every check is unproven");
  process.exit(2);
}

const at = (rel) => (isAbsolute(rel) ? rel : join(ROOT, rel));
const runChecker = () => {
  try {
    return execFileSync("node", [CHECKER, "--config", configPath], { encoding: "utf8" });
  } catch (error) {
    // A non-zero exit is the expected result while a mutation is in place.
    return error.stdout ?? "";
  }
};

const ids = new Set(config.checks.map((c) => c.id));
let failures = 0;

for (const { check, file, from, to } of mutations) {
  if (!ids.has(check)) {
    console.log(`SETUP-FAIL ${check}: no check with that id in the config`);
    failures++;
    continue;
  }
  const path = at(file);
  const original = readFileSync(path, "utf8");
  if (!original.includes(from)) {
    console.log(`SETUP-FAIL ${check}: anchor missing in ${file} — the copy moved, re-point this mutation`);
    console.log(`           looked for: ${from}`);
    failures++;
    continue;
  }

  writeFileSync(path, original.replace(from, to));
  const output = runChecker();
  writeFileSync(path, original);

  if (output.includes(`[${check}]`)) {
    console.log(`CAUGHT  ${check}`);
  } else {
    failures++;
    console.log(`MISSED  ${check}`);
    const reported = output.split("\n").filter((line) => line.startsWith("  ["));
    console.log(reported.length ? reported.join("\n") : "        (the checker reported nothing at all)");
  }
}

const restored = runChecker();
if (restored.includes("no drift")) {
  console.log("\nrestored: checker green again");
} else {
  failures++;
  console.log(`\nRESTORE-FAIL — the tree did not come back clean:\n${restored}`);
}

process.exit(failures ? 1 : 0);
