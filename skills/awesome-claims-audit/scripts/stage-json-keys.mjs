#!/usr/bin/env node
// Stage a few JSON keys out of files that also carry someone else's unfinished work.
//
// A copy fix in a locale catalog lands in the same N files an in-flight feature is
// editing. `git add` takes the file, not the change, and `git add -p` is
// interactive, so the usual answer is to commit both — which pushes unfinished work
// under a message that does not describe it.
//
// This builds each index entry by hand instead: HEAD's version of the file with only
// the named top-level keys copied over from the working copy, hashed into the object
// store and written to the index. The working tree is never touched, so the
// unrelated edits stay exactly where they were, uncommitted.
//
//   node stage-json-keys.mjs --repo <dir> --keys keyA,keyB -- locales/*/messages.json
//
// --indent must match the file's own formatting (default 2). A mismatch stages the
// whole file reformatted and buries the real change.
//
// Always read `git diff --cached` afterwards: this script cannot know which of the
// changes in a file are yours.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const files = argv.includes("--") ? argv.slice(argv.indexOf("--") + 1) : [];
const repo = resolve(flag("repo", "."));
const keys = (flag("keys") ?? "").split(",").map((k) => k.trim()).filter(Boolean);
const indent = Number(flag("indent", "2"));

if (keys.length === 0 || files.length === 0) {
  console.error("usage: stage-json-keys.mjs --repo <dir> --keys k1,k2 [--indent N] -- <file>...");
  process.exit(2);
}

const git = (args, opts = {}) => execFileSync("git", args, { cwd: repo, encoding: "utf8", ...opts });

for (const rel of files) {
  // A path handed in by the shell may be absolute after glob expansion.
  const path = (rel.startsWith(repo) ? rel.slice(repo.length + 1) : rel).replace(/\\/g, "/");
  const head = JSON.parse(git(["show", `HEAD:${path}`]));
  const current = JSON.parse(readFileSync(join(repo, path), "utf8"));

  let changed = 0;
  for (const key of keys) {
    if (!(key in current)) {
      console.error(`${path}: the working copy has no key \`${key}\``);
      process.exit(1);
    }
    if (JSON.stringify(head[key]) !== JSON.stringify(current[key])) changed++;
    head[key] = current[key];
  }
  if (changed === 0) {
    console.log(`skip  ${path} (named keys already match HEAD)`);
    continue;
  }

  const blob = Buffer.from(`${JSON.stringify(head, null, indent)}\n`, "utf8");
  // --path so the same clean filters apply that `git add` would have applied.
  const sha = git(["hash-object", "-w", "--path", path, "--stdin"], { input: blob }).trim();
  git(["update-index", "--cacheinfo", `100644,${sha},${path}`]);
  console.log(`stage ${path} (${changed} key${changed === 1 ? "" : "s"})`);
}

console.log("\nreview before committing:  git diff --cached");
