#!/usr/bin/env node
// Cross-check the claim-source map against the checker config.
//
// The map says which claim classes are automated; the config says what is actually
// asserted. They drift apart exactly the way copy drifts from code — a check is
// renamed or deleted and the map still promises coverage nobody has. This compares
// the two and names both directions of the gap.
//
// Mark an automated row in the map with the check that owns it:
//
//   | **auto:permissions** which capabilities the app requests | build config | … |
//
//   node map-coverage.mjs --map claim-source-map.md --config claims.config.json
//
// Read-only. Exit 1 when the map and the config disagree.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const mapPath = resolve(flag("map", "claim-source-map.md"));
const configPath = resolve(flag("config", "claims.config.json"));
for (const [what, path] of [["map", mapPath], ["config", configPath]]) {
  if (!existsSync(path)) {
    console.error(`no ${what} at ${path}`);
    process.exit(2);
  }
}

const map = readFileSync(mapPath, "utf8");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const claimed = new Map();
for (const match of map.matchAll(/\*\*auto:([a-z0-9-]+)\*\*(.*)/g)) {
  claimed.set(match[1], match[2].split("|")[0].trim());
}
const implemented = new Set((config.checks ?? []).map((c) => c.id));

const problems = [];
for (const [id, row] of claimed) {
  if (!implemented.has(id)) problems.push(`the map claims \`${id}\` is automated (${row || "row"}), but no check with that id exists`);
}
for (const id of implemented) {
  if (!claimed.has(id)) problems.push(`check \`${id}\` runs, but no map row claims it — add the row, or the next audit re-derives where that claim lives`);
}

const rows = (map.match(/^\|/gm) ?? []).length;
console.log(`map rows: ${rows}   automated rows: ${claimed.size}   checks: ${implemented.size}`);

if (problems.length === 0) {
  console.log("map and config agree");
  process.exit(0);
}
console.log(`\n${problems.length} mismatch(es):`);
for (const problem of problems) console.log(`  ${problem}`);
process.exit(1);
