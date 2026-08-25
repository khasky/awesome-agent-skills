#!/usr/bin/env node
// The mechanical half of a claims audit: every public statement whose truth is a
// value in code, asserted against that value.
//
// Public copy and the code that decides it have no build-time link, so a renamed
// constant leaves a sentence somewhere else that is simply false — nothing fails,
// the page just lies. Each check below encodes one claim. A check whose pattern
// stops matching THROWS rather than passing: a parser that silently finds nothing
// would turn this file into decoration. The same rule covers the copy side — a
// target may declare the `anchor` sentence it is asserting about, so a check whose
// claim was deleted reports "re-point me" instead of a green line.
//
//   node check-claims.mjs --config claims.config.json
//
// Read-only. One line per check, findings tallied, exit 1 on drift, exit 2 on a
// broken config. See references/checker-recipes.md for the config schema.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const configPath = resolve(flag("config", "claims.config.json"));
if (!existsSync(configPath)) {
  console.error(`no config at ${configPath} — see references/checker-recipes.md`);
  process.exit(2);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const ROOT = resolve(dirname(configPath), config.root ?? ".");
const EXTENSIONS = config.extensions ?? [".md", ".html", ".astro", ".vue", ".svelte", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".txt", ".yml", ".yaml"];

const findings = [];
const notes = [];
const add = (check, message) => findings.push({ check, message });

const at = (rel) => (isAbsolute(rel) ? rel : join(ROOT, rel));
const read = (rel) => readFileSync(at(rel), "utf8");
const rx = (pattern, flags = "") => new RegExp(pattern, flags);
const escape = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Typographic quotes, wrapped lines and a trailing period are copy decisions, not
 *  claims. Normalizing both sides keeps a curly apostrophe from reading as drift. */
const norm = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ");
const normValue = (v) => norm(v).replace(/\.$/, "").trim();

/** A check that cannot read its own source is broken, never passing. */
class BrokenCheck extends Error {}
const must = (value, what) => {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    throw new BrokenCheck(`could not parse ${what} — the source shape changed, fix the config before trusting this check`);
  }
  return value;
};

const scopeOf = (spec) => {
  const src = read(spec.file);
  return spec.within ? must(rx(spec.within).exec(src)?.[1], `the \`within\` block of ${spec.file}`) : src;
};

function extractList(spec, role) {
  const items = [...scopeOf(spec).matchAll(rx(spec.pattern, "g"))].map((m) => m[spec.group ?? 1]);
  return must(items, `${role} (${spec.pattern}) in ${spec.file}`);
}

function extractValue(spec) {
  const scope = scopeOf(spec);
  const mode = spec.extract ?? "string";
  if (mode === "count-matches") return [...must([...scope.matchAll(rx(spec.pattern, "g"))], `matches of ${spec.pattern} in ${spec.file}`)].length;

  const raw = must(rx(spec.pattern).exec(scope)?.[spec.group ?? 1], `${spec.pattern} in ${spec.file}`);
  if (mode === "count-strings") return must([...raw.matchAll(/"([^"]*)"|'([^']*)'/g)], `quoted items in ${spec.file}`).length;
  if (mode !== "number") return raw;

  const n = Number(String(raw).replace(/[_,\s]/g, ""));
  if (!Number.isFinite(n)) throw new BrokenCheck(`\`${raw}\` in ${spec.file} is not a number — fix the pattern`);
  return spec.divide ? n / spec.divide : spec.multiply ? n * spec.multiply : n;
}

const corpora = new Map();
function corpus(paths) {
  const key = JSON.stringify(paths);
  if (corpora.has(key)) return corpora.get(key);
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (EXTENSIONS.includes(extname(entry.name))) files.push(full);
    }
  };
  for (const p of paths) {
    const full = at(p);
    if (!existsSync(full)) throw new BrokenCheck(`corpus path ${p} does not exist`);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
  must(files, `corpus files under ${paths.join(", ")}`);
  const text = files.map((f) => readFileSync(f, "utf8")).join("\n");
  corpora.set(key, text);
  return text;
}

const bodyOf = (target) => (target.normalize ? norm(read(target.file)) : read(target.file));

/** A target may name the sentence it asserts about. When that sentence is gone the
 *  check has nothing to guard — say so instead of reporting a pass. */
function anchored(id, target) {
  if (!target.anchor) return true;
  if (rx(target.anchor).test(bodyOf(target))) return true;
  add(id, `${target.file}: the claim this check anchors on is gone (/${target.anchor}/) — re-point the check or delete it`);
  return false;
}

/** `{value}` / `{item}` are data — escaped before they meet the regex. */
function assertPattern(id, target, rawPattern, token, value, subject) {
  if (!anchored(id, target)) return;
  const shown = target.normalize ? normValue(value) : String(value);
  const pattern = rx(rawPattern.split(token).join(escape(shown)));
  const hit = pattern.test(bodyOf(target));
  if (target.absent && hit) add(id, `${target.file} matches /${pattern.source}/ — ${target.why ?? `it contradicts ${subject}`}`);
  if (!target.absent && !hit) add(id, `${target.file} no longer matches /${pattern.source}/ — ${target.why ?? `the copy drifted from ${subject}`}`);
}

/** The other direction: a pair whose copy side vanished guards nothing. */
function requireUse(check, items) {
  if (!check.requireUse) return;
  const text = norm(corpus(check.requireUse));
  for (const item of items) {
    if (!text.includes(normValue(item))) add(check.id, `nothing in the corpus quotes "${item}" any more — drop the pair from this check or restore the copy`);
  }
}

const KINDS = {
  /** A number, duration, or name in prose, tied back to the constant behind it. */
  value(check) {
    const value = extractValue(check.source);
    const subject = `${check.source.file} (= ${value})`;
    for (const target of check.targets) {
      // A value of 1 usually renders as an idiom ("about a minute"), not as a digit.
      const pattern = target.patternWhen?.[String(value)] ?? target.pattern;
      assertPattern(check.id, target, pattern, "{value}", value, subject);
    }
    requireUse(check, [value]);
  },

  /** Two lists that have to name the same things — a catalog and a copy table, a
   *  closed enum and the label map that renders it, one list per repo. */
  "list-parity"(check) {
    const ignore = new Set(check.ignore ?? []);
    const a = extractList(check.a, "list A").filter((x) => !ignore.has(x));
    const b = extractList(check.b, "list B").filter((x) => !ignore.has(x));
    const nameA = check.a.label ?? check.a.file;
    const nameB = check.b.label ?? check.b.file;
    const mode = check.mode ?? "equal";
    if (mode !== "b-subset-of-a") for (const x of a) if (!b.includes(x)) add(check.id, `${nameA} has \`${x}\`; ${nameB} does not`);
    if (mode !== "a-subset-of-b") for (const x of b) if (!a.includes(x)) add(check.id, `${nameB} has \`${x}\`; ${nameA} does not`);
  },

  /** Every item of a list must (or must not) appear in the copy, one pattern per
   *  item. The `absent` form catches copy that DENIES something the code declares. */
  mentions(check) {
    const items = extractList(check.source, "the mentioned list");
    for (const item of items) {
      for (const target of check.targets) assertPattern(check.id, target, target.template, "{item}", item, `\`${item}\` in ${check.source.file}`);
    }
    requireUse(check, items);
  },

  /** Two statements that must not share a neighbourhood — an openness claim with a
   *  gated endpoint folded into it, a guarantee that lost its qualifier. */
  proximity(check) {
    const body = check.normalize ? norm(read(check.file)) : read(check.file);
    const anchor = rx(check.anchor).exec(body);
    if (!anchor) {
      add(check.id, `${check.file}: the claim this check anchors on is gone (/${check.anchor}/) — re-point the check or delete it`);
      return;
    }
    const before = check.window?.before ?? check.window ?? 600;
    const after = check.window?.after ?? check.window ?? 600;
    const window = body.slice(Math.max(0, anchor.index - before), anchor.index + anchor[0].length + after);
    for (const forbidden of check.forbid ?? []) {
      if (rx(forbidden).test(window)) add(check.id, `${check.file}: /${forbidden}/ sits within ${before}/${after} characters of "${anchor[0]}" — ${check.why ?? "the two claims contradict each other"}`);
    }
    for (const required of check.require ?? []) {
      if (!rx(required).test(window)) add(check.id, `${check.file}: /${required}/ no longer sits near "${anchor[0]}" — ${check.why ?? "the qualifier this claim depends on is gone"}`);
    }
  },

  /** A link, slug, or asset the copy offers that resolves to nothing. */
  exists(check) {
    const candidates = Array.isArray(check.resolve) ? check.resolve : [check.resolve];
    for (const match of new Set(extractList(check.source, "the offered paths"))) {
      const tried = candidates.map((c) => c.split("{match}").join(match));
      if (!tried.some((p) => existsSync(at(p)))) add(check.id, `${check.source.file} offers \`${match}\`, which resolves to nothing (tried ${tried.join(", ")})`);
    }
  },

  /** Sentences that were false once. Cheap insurance against a revert. */
  retired(check) {
    const text = norm(corpus(check.corpus));
    for (const phrase of check.phrases) if (text.includes(norm(phrase.text))) add(check.id, `"${phrase.text}" is back — ${phrase.why}`);
  },
};

/** Every `file:` anywhere in a check, so an optional check can skip cleanly. */
function filesOf(node, out = []) {
  if (Array.isArray(node)) for (const n of node) filesOf(n, out);
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "file" && typeof v === "string") out.push(v);
      else filesOf(v, out);
    }
  }
  return out;
}

for (const check of config.checks) {
  const run = KINDS[check.kind];
  if (!run) {
    console.error(`unknown check kind \`${check.kind}\` in \`${check.id}\``);
    process.exit(2);
  }
  const missing = filesOf(check).filter((f) => !existsSync(at(f)));
  if (missing.length && check.optional) {
    notes.push(`${check.id} — ${missing.join(", ")} not present`);
    console.log(`SKIP  ${check.id}`);
    continue;
  }

  const before = findings.length;
  try {
    run(check);
  } catch (error) {
    add(check.id, error instanceof BrokenCheck ? error.message : `check crashed: ${error.message}`);
  }
  const own = findings.length - before;
  console.log(`${own === 0 ? "PASS" : "FAIL"}  ${check.id}${own ? ` (${own})` : ""}`);
}

for (const note of notes) console.log(`      skipped: ${note}`);

// Carried in the config so the same gaps appear in every report, not only the one
// written by whoever remembered them.
for (const gap of config.notAssessed ?? []) console.log(`NOT ASSESSED  ${gap.claim} — ${gap.why}`);

if (findings.length === 0) {
  console.log("\nno drift: every mechanically checkable claim matches its source");
  process.exit(0);
}

console.log(`\n${findings.length} finding(s):`);
for (const f of findings) console.log(`  [${f.check}] ${f.message}`);
process.exit(1);
