---
name: awesome-code-cleanup
description: 'Repo-wide cleanup of AI-like code noise: comments to a strict bar (delete narration, condense bloat, fix stale, keep load-bearing), a read-only audit mode, an opt-in refactor mode for vague names and over-abstraction, a detection mode for dead code and logical inconsistencies, and an execution mode applying what another audit found; cleanup stays behavior-preserving. Use when asked to clean up or condense comments, remove "obvious" or AI-generated comments, make code self-documenting, de-slop vibe-coded files, apply a YAGNI/KISS pass, apply a slop audit''s findings, or to find unused code, orphan modules, unused exports, unused i18n keys or env vars, or code-vs-docs drift — "find dead code", "fix what the audit found", "чистка комментариев", "убери лишние комментарии", "почисти код", "найди мёртвый код", "логические несоответствия". Do not use to de-slop prose or Markdown — use awesome-humanize-en or awesome-document-style; for the read-only marker sweep use awesome-slop-audit, whose report it executes.'
license: MIT
metadata:
  author: Khasky
  tags: ["refactoring", "cleanup", "comments", "code-quality"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-code-cleanup"
---

# Code Cleanup

Audit and clean every code comment in a repository (or a scoped part of it) so the code follows: comments only when strictly necessary; the code itself is authoritative and self-documenting; kept comments are 1–2 lines where possible. The pass is strictly behavior-preserving — a comment pass that changes behavior is a failed pass.

Every comment gets one of four verdicts:

| Verdict | When | Action |
|---|---|---|
| **DELETE** | Restates code, narrates flow, tutorial-style, echoes a signature | Remove |
| **CONDENSE** | Load-bearing but bloated | Compress to 1–2 lines, keep the essence |
| **FIX** | Stale, misplaced, or contradicts the code | Verify against code, rewrite accurately (or delete) |
| **KEEP** | Dense gotcha/contract that genuinely needs its length | Leave intact, flag in report |

The FIX class is the highest-value work. Redundant comments are noise; stale comments are lies. A real pass regularly finds comments claiming constants that changed ("10,000 rows" over `VOLUME = 2_000`), explanations of mechanisms that no longer exist, JSDoc stranded above the wrong function, and references to deleted files. Always verify a suspicious comment against the actual code before rewording it — and never "fix" a comment to say something you haven't confirmed.

## Modes

- **Comment pass (default)** — the phased pipeline below, comments only.
- **Audit (read-only)** — when the user asks to audit or review without editing: run Phase 0 recon and the Phase 1 analysis, edit nothing, and return findings instead of diffs. For each finding report: file:line, the smell, the suggested change, risk level (low / medium / high), recommendation strength (Strong / Worth exploring / Speculative — be honest about the last one), whether it can be fixed behavior-preservingly, and the verification command that would prove it. Shape each as `Symptom → Consequence → Remedy` — a smell with no concrete consequence and no remedy is noise, not a finding; where a named principle backs it (Fowler smell, Ousterhout shallow module, Hyrum's Law), cite it. Rank findings by impact and safety, and end with a "do not do" list — changes that look tempting but would touch public API or behavior. Cover comments plus the refactor-mode smells below.
- **Refactor (on explicit request)** — extends the pass beyond comments to the code smells of AI-generated or vibe-coded files (see the REFACTOR MODE rulebook). Same phases, same NEVER list, same regression gate; every structural edit is held to the rename bar — provably behavior-preserving or not done.
- **Detection (on request)** — when the user asks to find dead/unused code or logical inconsistencies ("find dead code", "найди мёртвый код", "неиспользуемый код", "логические несоответствия"): the DETECTION MODE pipeline — mechanical sweeps, evidence-contract subagents, execute-to-verify. Findings first; fixes only for the findings the user picks.
- **Execution (given a findings list)** — the user arrives with a report from `awesome-slop-audit`, `awesome-architecture-audit`, or a reviewer, and wants it applied. The list replaces Phase 1's own analysis; everything else holds — Phase 0 recon still runs (the report may predate the current tree), the rulebook still governs each edit, the FIX-PASS TRAPS below apply per finding, and Phase 2 still verifies. Restate what is in and out of scope before the first edit: a user who picked three categories gets three categories, and the lies found in the others are re-listed unfixed, never quietly swept in.

Not for: functional changes or feature work, formatting-only churn (run the project formatter instead), generated/vendored code, or prose documents (use awesome-document-style).

This skill is the only one in the set that edits for these reasons. `awesome-slop-audit` finds the markers and stops; `awesome-architecture-audit` reports drift and stops; both hand their findings here. When a report arrives, treat its every claim as a lead to re-verify, not a verdict to apply — the audit checked against a tree that may have moved, and a stale finding applied verbatim writes a new lie.

## Phase 0 — Recon (do this before any edit)

1. **Snapshot the working tree.** Run `git status` and `git diff --stat`. Save the current diff to a scratchpad file as a baseline. Any already-dirty file is likely the user's work in progress: **exclude those files from the pass** and say so — mixing cleanup into someone's uncommitted WIP wrecks their commit hygiene and risks reverting their work.
2. **Define scope.** Git-tracked code files only. Exclude: generated code (`__generated__`, codegen output, lockfiles), vendored code, machine-generated data (locales, emoji/data tables), binary assets, applied database migrations (migration tools checksum the files — even a comment edit breaks the checksum), and prose docs (README, CONTRIBUTING, docs/) — prose is a different editing discipline; only include it if the user asks. Config-file comments (build configs, CI) are in scope; comments inside JSON "//"-key conventions count as config docs. When asked to clean a PR or branch, scope to the files its diff touches and nothing else.
3. **Check repo rules.** Read AGENTS.md / CLAUDE.md / CONTRIBUTING for the repo's comment and formatting policy. Two rules commonly override generic instinct:
   - **Public repos with private siblings:** rewording a comment must never (re)introduce private detail — backend internals, internal file paths, private repo names, security mechanics. When condensing a deliberately vague comment, keep it vague.
   - **Formatter line width:** never reflow lines to satisfy a length limit; repos often set a very high formatter width on purpose. No formatter runs over whole files.
4. **Inventory and partition.** Count lines per area (`git ls-files | xargs wc -l` filtered to code). For anything beyond ~5k lines, split into **disjoint partitions** (~5–10k lines each, along the repo's own directory boundaries — source modules, test suites, build scripts, whatever its layout is) and run one parallel subagent per partition. Disjoint means no file appears in two partitions — that is what makes parallel editing safe without worktrees. In refactor mode, weight recently-churned files first (`git log --oneline --since=...` or `git log --format= --name-only | sort | uniq -c | sort -rn`): cleanup pays off where change concentrates, and untouched code rarely needs it. **Resource preflight** (before spawning the partition agents): cap concurrency at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB for these read/edit agents (they run no tests — verification is centralized in Phase 2); go serial if CPU load > 85% or free RAM < 2×per_agent; recompute before each wave; if the runtime caps sub-agent concurrency itself, defer to it.

## Phase 1 — The cleanup itself (per partition)

Read every in-scope file fully — grep sweeps find keywords, not bad comments. Apply the rulebook:

### DELETE
- Comments restating the code or narrating control flow ("check if…", "loop through…", "return the…").
- Tutorial-style / "this function…" comments where the name already says it.
- JSDoc that only repeats the signature; param lists that add nothing.
- In tests: step narration ("click the button", "assert that…") — assertion messages and test titles already carry it.
- Duplicates: the same fact stated in a file header and again at the definition — keep one (prefer the definition site).
- Cross-references to things that resolve to nothing in the repo: deleted bug-note files, planning-doc item numbers ("Item 5 —", "BUG #3" when the bugs file is gone), private session artifacts. If the reference carries knowledge, keep the knowledge, drop the dead pointer. Exception: keep the label when it is pinned in an immutable test title.

### CONDENSE (to 1–2 lines, keeping the essence)
- Load-bearing but bloated: non-obvious WHY, workarounds, invariants, safety boundaries, browser/platform/site quirks.
- Code that runs against live third-party systems (e2e suites, scrapers, adapters) encodes hard-won operational knowledge — there the job is **compression, not deletion**. Losing a verified gotcha costs far more than the lines save.
- A >2-line comment that genuinely needs its length (a dense multi-quirk rationale, a protocol contract) may stay — flag it in the report instead of butchering it.

### FIX
- Verify against the code first, then rewrite short and accurate — or delete if the code is now self-evident.
- Watch for: numbers/constants that drifted, "most reliable" claims the neighboring comment contradicts, descriptions of removed functions, headers calling a mature suite a "PoC", misplaced JSDoc (move it to the right definition).
- A comment that compensates for unclear code is a smell in the code, not the comment: in a default pass keep the comment and list the recommended refactor in the report; in refactor mode fix the code and delete the comment.
- **Normalize AI-slop punctuation in comments** — a developer typing a comment reaches for keyboard characters, not typographic glyphs. In comment text, replace the em/en-dash `—`/`–` with a plain `-` (or reword), the ellipsis `…` with `...`, curly quotes `" " ' '` with straight `"` `'`, and decorative bullet/arrow glyphs (`▸ ► ▪ ● ◦ ‣ → ⇒`) with `-` or plain words; strip stray emoji (`✅ ❌ 🚀`) and non-breaking/zero-width spaces. These are machine-generation tells — a comment carrying several is itself a signal the block was AI-written and worth a closer read. Edit only the comment text; **never** touch these characters inside string literals, regexes, identifiers, or data, and leave a glyph that is genuinely load-bearing (a comment documenting that exact character, or intentional non-ASCII in a non-English codebase's own convention).
- **Strip markdown backticks from comment text** — wrapping an identifier in backticks is documentation habit, not how a developer types a comment: `` // Path only - the query is logged in `query`, so it is dropped from the URL `` becomes `// Path only - the query is logged in query, so it is dropped from the URL`. Same for `` // ... for the log's `url` field ``. Exception: doc comments a tool actually renders as markdown (TSDoc/JSDoc tooltips, rustdoc `///`, published docstrings) — there the backticks are functional formatting, keep them.

### REFACTOR MODE ONLY (skip in a default comment pass)

- Rename vague identifiers (`data`, `result`, `item`, `temp`, `helper`, `manager`, `processor`, `handler`, `utils`, `processData`, `handleThing`) to domain-specific names — local and non-exported only; renaming public exports or serialized fields needs explicit approval. Source new names from the domain terms already used in nearby code, tests, database fields, API docs, and UI labels. Before applying, produce a rename table — old → new, scope, reason, public-API risk — and apply only the low-risk rows.
- Inline one-off helpers that hide more than they clarify; extract a helper only when it names a real domain concept or removes real duplication.
- Dismantle overengineering: Base/Abstract/Factory/Manager layers with a single real implementation, options objects with mostly unused fields, wrappers around one-line library calls, adapters that adapt nothing, indirection that hides the call flow. Keep an abstraction that encodes a real domain boundary, public contract, test seam (one adapter = hypothetical seam, two = real), platform boundary, or security boundary.
- **Chesterton's Fence** — before deleting anything, understand *why* it exists. Check `git blame`/history and callers; code that looks dead may guard a rare path, a platform quirk, or a known bug. If you can't explain why it's there, don't remove it yet.
- Remove dead branches, unused parameters/types/wrappers, and speculative extension points; deduplicate repeated logic.
- Deletion test, sharper: would removing this concentrate complexity in one place, or just scatter it to callers? "Concentrates" is the signal to delete; "scatters" means leave it.
- Simplify nested conditionals with guard clauses when that matches local style.
- Do not add dependencies, abstractions, broad try/catch, logging, caching, retries, or defensive branches the existing behavior doesn't require.
- **No tests over the target? Write characterization tests first** — lightweight tests capturing current input/output behavior — before any structural edit, and state that confidence is limited by their coverage.
- **Ranking candidates:** score a suspicious module 1–5 on interface complexity, behavior per call, testability, locality, and stability; average ≤2 = strong candidate. Deletion test for shallow modules: if deleting it and inlining its logic would not make callers more complex, it is shallow.
- **Anti-over-simplification — simplify ≠ shrink:** no nested ternaries or dense one-liners to save lines; don't merge unrelated concerns into one function; expanding a cryptic one-liner into named intermediate steps is a valid simplification. Hot paths: ugly code may be intentionally optimized — check before "cleaning" hand-tuned loops.
- **One concern per pass:** first make it work, then make it clear, then make it efficient — don't chase all three at once. Complete and verify each pass before the next.
- **Design it twice for a non-trivial interface reshape:** before committing to one interface for the module, sketch 2–3 genuinely different ones (minimal entry points / maximal flexibility / optimize the common caller / ports-and-adapters) and compare them on depth, locality, and where the seam falls. Pick or hybridize — don't refactor into the first shape that comes to mind.

**What NOT to flag (each refactor smell has a legitimate form):**
- Domain terminology that matches how the team's experts actually speak is not a vague name.
- A `switch`/`match` over an external protocol or a closed enum is not "missing polymorphism".
- DTOs, persistence models, and API-payload types are allowed to be data-only (no behavior).
- A composition root wiring concrete implementations together is not a dependency-inversion violation.
- Temporary duplication during an in-progress migration is not debt — leave it until the migration lands.

### DETECTION MODE (dead code and logical inconsistencies, on request)

Findings-first: everything below is read-only until the user picks what to fix. Every finding carries one of three classes: **dead-code** (no consumer anywhere), **test-only-export** (only its own tests consume it — often a deliberate seam; check for a marker comment like "Exported for the test suite" before flagging), **inconsistency** (two artifacts disagree: comment vs code, doc vs CI, constant vs constant, regex vs the labels it claims to match).

1. **Mechanical sweep first** — cheap, high-precision, before any subagent:
   - Typecheck with unused checks forced on (`tsc --noEmit --noUnusedLocals --noUnusedParameters` or equivalent) even when the repo doesn't enable them.
   - Unused-export sweep, scripted: extract every `export`ed name, word-boundary-grep each across the whole repo; zero hits outside the defining file = dead, hits only in its own test file = test-only-export. Conservative by design: a hit in a string or comment counts as "used".
   - Orphan modules no import reaches (mind imports that carry the file extension — a sweep keyed on the bare basename misses `./lib/x.mjs`).
   - Cross-artifact key sets: i18n catalogs vs code references, env vars read vs documented, config keys defined vs consumed, package scripts vs CI/docs/hooks.
   - Dependencies nothing imports.
   - **Generated-mirror pitfall:** a codegen'd copy of a catalog (a bundled fallback of the same messages, a generated map) makes every key look referenced. Exclude generated files from "used" evidence — they mirror the source, they don't consume it.
2. **Partitioned hunt** for what mechanics can't see. Subagent contract (on top of the one below): each finding as `path:line — [class] — one-sentence finding — evidence`, where evidence for every "unused" claim is a repo-wide grep the agent actually ran, including the bare string for dynamic/string-keyed references; unsure = confidence LOW or drop it. What agents catch that scripts don't: unreachable branches the assignment site already rules out, subsumed pattern-list entries (an early specific selector a later generic one swallows, when the consumer ignores order), regexes that cannot match what their own comment claims, duplicated logic that silently diverged, docs claiming CI runs a check whose title no workflow filter matches.
3. **Verify by execution, not by review.** Before a finding reaches the report, run the claim: paste the regex into the runtime against the exact label, call the function with the boundary value, evaluate the selector against the real structure. A plausible reading of the source is not evidence. Recurring classes that survive every eyeball pass and die in one `node -e` line: `\w`/`\b` are ASCII-only in JS regexes even with `/u` (Cyrillic and other non-Latin atoms silently never match); `querySelectorAll` never matches its own root element; number-formatting tiers where rounding crosses the boundary after the tier was chosen; an `.env.example` the loader reads as a live base layer (a filled-in value there is configuration, not documentation).
4. **Fixing (opt-in, per finding).** Dead code: delete under the Chesterton's Fence rule above. Test-only exports: keep deliberate seams, add the repo's marker comment where it's missing. Inconsistencies: fix the wrong side. This is the one sanctioned exception to the NEVER list's "no behavior changes" — a detection fix exists to change behavior, gated on the user picking the finding and on a **regression pin**: a test that provably fails on the pre-fix code. Golden/pin tests encoding the old wrong value update in the same change; stated counts in docs ("169 keys") get re-derived, not trusted. Then the full Phase 2 verification, plus the narrowest end-to-end check the touched surface has.

### FIX-PASS TRAPS

Each of these has a legitimate-looking edit on one side and a broken build, a silent behavior change, or a lost CI job on the other. They bind every mode, and they are the reason an audit's findings are not applied as written.

- **A test title can be load-bearing.** The NEVER list already forbids editing one; the reason matters when a refactor-mode rename would drag a title along. Before touching anything a title contains, grep CI workflows and package scripts for `-g`/`--grep` filters carrying it, and check for `__screenshots__`/snapshot directories keyed by the sanitized title. Filtered or keyed means the title is a contract with the runner: skip it and report.
- **Rename greps must cover what the typechecker does not.** A repo-wide grep means e2e suites, build and release scripts, and sibling packages the main tsconfig never loads — a rename that typechecks clean still breaks the package nobody compiled.
- **Injected source stays self-contained.** A helper serialized into a page (`String(fn)`, `page.evaluate` bodies) cannot gain imports, and its export site is part of the contract. Unify two such implementations by moving the body and keeping a re-export; never by adding an import to the injected side.
- **Unifying a drifted duplicate pair is a behavior change, not cleanup.** Two near-identical helpers where one fixed a bug the other still carries: choosing which behavior survives is a fix. Pin both sides with tests covering the corrected case, label it as the fix it is, and give it its own commit — never bury it in a cleanup diff.
- **Strings measured against the outside world are data.** A literal compared against product UI, DOM content, or locale strings keeps its exact glyphs even when they are the ones being swept. Error and log messages the tests themselves author are the only fair game.
- **The formatter reacts to renames.** Line lengths change, arrays collapse, import order shifts. Run the formatter check centrally after the pass and take its targeted fixes rather than hand-wrapping anything (hand-wrapping to a width is forbidden by Phase 0.3 regardless).

### NEVER
- No behavior changes. No edits to string literals, regexes, selectors, CSS values, CSS class names, exported/public names, signatures, test titles, assertions, fixture values, test snapshots, wire-contract shapes, storage keys, message names, database columns.
- Keep functional comment-directives: linter pragmas (biome-ignore, eslint-disable), `@ts-expect-error`, SPDX/license headers, shebangs, `/// <reference>`, source-map markers.
- Keep TODO/FIXME; if one looks obsolete, flag it — don't resolve or delete it in a comment pass.
- Comments inside string literals (templated code, `page.evaluate` bodies) are code content — leave them unless clearly safe.
- Allowed code change in a default comment pass, sparingly: renaming a **local** variable or non-exported helper within the same file, only when the rename makes a comment deletable and is unambiguously behavior-preserving. In refactor mode this allowance widens to the REFACTOR MODE rulebook — under the same proof bar. No logic edits, no new abstractions, no added comments except a short replacement of a confusing one. **Any such edit turns the pass into a refactor for that file — refactoring only, never a functional change.** This is the critical criterion of the whole skill: if there is any doubt an edit is behavior-identical (shadowing, dynamic access by name, string-keyed lookups, serialization), leave the code alone. Every rename and structural edit must be declared in the report and pass the regression gate in Phase 2.

### Subagent contract (when partitioned)
Give each agent: its exact file scope, the rulebook above, the repo-specific rules from Phase 0.3, and "do NOT run lint/tests" (verification is centralized — parallel test runs collide). Require each agent to:
- self-verify with `git diff -U0 -- <scope>` filtered to non-comment changed lines → must be empty (blank lines aside). If the agent made declared renames, every non-comment changed line must map 1:1 to a declared rename — any unexplained line is a defect to fix before reporting;
- report per file: counts (deleted / condensed / fixed / renames), 1–2 notable examples, every stale comment it FIXED (these are findings, not just edits), the >2-line comments it KEPT with a one-word reason (gotcha/quirk/contract/safety), and anything it was unsure about and left alone;
- if the user edits files mid-flight (it happens): re-read before editing, never revert changes it didn't make, and avoid the user's freshly-edited hunks.

## Phase 2 — Centralized verification

After all partitions are done, run in the main session:

1. **Lint** — read the real output; a wrapper/filter can print a fake "clean" over real errors, so trust exit codes over summaries and re-run the raw binary if output looks suspiciously terse. Warnings as errors where the repo configures that, plus its docs lint when one exists.
2. **Typecheck — every config in the repo**, not the default one: main, e2e, scripts, and any sibling package with its own. A pass that renamed anything typechecks clean under the config that never loaded the file it broke.
3. **Unit tests** (full run), plus any project selftests for other touched repos, plus the browser or component suite when test code was touched at all. A runner too expensive to execute still gets a list or dry run — that alone proves every spec still imports.
4. **Formatter check.** Renames shift line lengths and import order; take the formatter's own targeted fixes instead of hand-editing what it flags.
5. **Regression gate for renames and structural edits.** If any partition declared code renames or refactor-mode edits, this gate is a hard blocker: run the narrowest tests covering each touched file's module in addition to the full suite, and re-check each renamed identifier for name-based dynamic access (grep the name as a string across the repo). For such a file, treat any test failure as **caused by the pass until proven otherwise** — the burden of proof is reversed relative to comment-only files. If an edit cannot be proven safe, revert it (and restore the comment it replaced); losing one cleanup is cheaper than one regression.
6. **Failure triage (comment-only files).** A comment-only pass cannot cause a behavior failure — but prove it, don't assert it: (a) show the involved files' diff is comment-only (`git diff -U0` + non-comment filter), (b) look for evidence the failure predates the pass (old failure artifacts/screenshots, failing at HEAD), (c) re-run the failing test in isolation to separate flake from stable failure. Report pre-existing failures honestly as pre-existing — with the evidence — and do not paper over them.

## Phase 3 — Report

Lead with the outcome: net line delta and the verification verdict. State wins concretely, never as generic benefit words — "locality: related bugs now concentrate in one module", not "cleaner code" or "easier to maintain". Then:
- per-partition highlights, with the **stale-comment fixes called out individually** (they're the interesting findings);
- flags for the owner: possibly-dead code discovered along the way, obsolete TODOs, terminology left anchored, kept-long comments;
- proposed commit messages in the repo's own convention (validated against its commitlint config when one exists), partitioned by concern — behavior fix, cleanup refactor, CI, docs — and never one commit spanning all four. **Each commit must compile alone:** a rename's import graph pulls its consumer files into the same commit even when they belong to another concern. A drift-pair unification or any other detection-mode fix is a `fix:`, kept out of the cleanup commit. Do not commit unless asked.
