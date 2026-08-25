---
name: awesome-slop-audit
description: "Audits a repository for machine-written 'AI slop' markers across every surface — code, comments, tests, docs, configs and CI — against a field-verified catalog: glyph pockets, stale and false comments, change-narration, drift-bait numbers, template stamps, misleading prefixes, impossible defensiveness, copy-paste drift, em-dash saturation and negative-parallelism prose fingerprints. Every suspect is verified against the code before it is reported, absence is proven per category, and an opt-in fix phase executes the user's selection with the rename / test-title / injected-source traps accounted for. Use when asked to 'find AI slop', 'does this code look AI-written', 'find machine-written or vibe-coding markers', 'de-slop the repo', or in Russian 'найди AI-slop', 'проверь код на следы ИИ', 'что выдаёт код, написанный нейросетью'. Do not use for the comment-craft pass itself (awesome-code-cleanup), prose line-editing (awesome-document-style, awesome-humanize-en), or public-claims-vs-code drift (awesome-claims-audit)."
license: MIT
metadata:
  author: Khasky
  tags: ["audit", "ai-slop", "vibe-coding", "detection", "code-quality", "cleanup"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-slop-audit"
---

# AI Slop Audit

A **slop marker** is anything that makes a reader think "a machine wrote this and
nobody read it". Three classes, in descending order of harm:

1. **Lies** — statements the code disproves: a comment claiming "three use sites"
   over five, a README documenting a 15s default the code sets to 13s, a rationale
   explaining a mechanism that no longer exists. Highest value: these mislead the
   next reader every day they survive.
2. **Noise** — formulaic filler: narration comments, echo-JSDoc, banner rows,
   template comments stamped verbatim across sibling files, copy-pasted test
   strophes, an 8-step CI setup block pasted into 7 jobs.
3. **Fingerprints** — uniform stylistic tics: typographic glyphs where a keyboard
   author would type ASCII, em-dash saturation, "X, not Y" contrast in every third
   config comment, bold-lead + emoji bullet lists, rule-of-three phrasing.

The core discipline: **verify before flagging, and prove absence too**. Dense
commentary is not slop — a comment that checks out against the code (recount the
constant, re-derive the number, grep the callers) is an *anti*-signal: machine
writing narrates, incident-anchored writing survives verification. An audit that
reports "cat 5 stale comments: zero confirmed — spot-checked 10 claims, all
accurate" is worth as much as one that finds ten lies. Never flag what you have
not checked; never "fix" a comment to say something you have not confirmed.

Not for: judging code quality in general (awesome-code-review,
awesome-architecture-audit), rewriting prose voice (awesome-humanize-en), or
generated/vendored files — those are excluded, not audited.

## Marker catalog

Categories are numbered so partitioned sub-audits report against the same list.

### Comments (1–8)

1. Narration/tutorial: "check if…", "loop through…", "this function…".
2. Echo-JSDoc: restates the signature, param lists that add nothing.
3. Banner rows: `// ====`, `// ----`, `/* ---------- Name ---------- */`.
4. Typographic glyphs in comment text: `— – … → ⇒ ↔ ≤ ≥ ± ≈ × ≠`, curly quotes,
   decorative bullets, emoji, non-breaking spaces. A hand-typed comment uses
   `-`, `->`, `<=`, `~`, `x`.
5. Stale or false claims: drifted counts, version-pinned numbers, removed
   mechanisms, misplaced doc blocks sitting above the wrong definition.
6. Change-narration: "now uses", "updated to", "used to be", "extracted from
   X so that…" — history of the edit instead of purpose of the code. Distinguish
   from incident provenance ("a standing timer once made this NaN"), which is
   load-bearing regression context and stays.
7. Drift-bait precision: "9,315 bytes measured off x.js, 5.4%", "~517 root
   entries in v17", "~30 modules import this" — measured numbers that silently
   rot on the next build/bump/refactor. Point at the mechanism or gate that
   enforces the property instead of the number it produced today.
8. Template stamps: the same sentence stamped verbatim across N sibling files.
   Accurate one-line pointers may stay; flag the pattern so the owner knows.

### Code (9–15)

9. Vague names: `data`, `result`, `item`, `helper`, `processX`, `handleThing`.
10. Misleading affordances: a `DEFAULT_*` prefix with no override path, an
    options object nothing ever passes, a wrapper adapting nothing. Check the
    affordance is real before flagging — `opts.x ?? DEFAULT_X` earns the prefix.
11. Impossible defensiveness: try/catch around calls that cannot throw
    (`getComputedStyle` on attached elements, `querySelectorAll` with a literal
    selector), environment guards for environments the import graph proves
    unreachable (`typeof document` in a module only content scripts import).
    Trust-boundary validation is the opposite of this — leave it.
12. Copy-paste drift pairs: two near-identical helpers where one has since
    fixed a bug the other still carries (two CSS-alpha parsers, one reading
    `color(... / 0)` as unpainted and the other as painted). The drift, not the
    duplication, is the finding — unifying it is a behavior fix, not cleanup.
13. Magic numbers with an explaining comment instead of a name; bare
    `setTimeout(fn, 500)` where a test elsewhere already names the delay.
14. Redundant type annotations restating inference.
15. Intra-file inconsistency: `instanceof` checks beside bare casts for the
    same shape, `setTimeout` beside `self.setTimeout`, one `/** */` block among
    `//` siblings — multi-session generation without a unifying read.

### Tests (16–19)

16. Vague titles ("works correctly") and step-narration comments.
17. Fake precision: assertions pinning irrelevant detail — `toBe("solid 2px")`
    where the requirement is "a visible focus ring" (`!== "none"`, width > 0).
18. Twin blocks and repeated mock strophes: the same 15-line assertion block or
    10 copies of an auth-mock setup, extractable into one local helper.
19. Bare sleeps: `waitForTimeout(1500)` with no rationale where the suite
    otherwise annotates or polls.

### Docs, configs, CI (20–25)

20. Em-dash saturation and 2+ dashes per sentence; middot-joined lists
    (`a · b · c`); `…`/`→`/`✅`/`❌` decoration in plain markdown.
21. Negative-parallelism epidemic: "X, not Y" as the default rhetorical shape
    across docs *and* config comments. One is style; dozens are a fingerprint.
22. LLM list shape: emoji + bold lead + em dash, ten bullets in identical
    rhythm; badge walls with "coming soon" placeholders; rule-of-three prose.
23. Redundant restatement: a diagram restating the bullet list above it, the
    same rationale in the file header and the section.
24. Copy-pasted CI blocks: the same setup steps in every job, drifting
    independently — composite-action / template material.
25. Narrated config keys: `# Browser locale.` above `BROWSER_LOCALE=`.

### The glyph-pocket heuristic

When comments are ASCII-disciplined but glyphs concentrate in one pocket — test
titles, error strings, doc tables — a sanitizer pass ran and skipped string
literals. The pocket pattern is itself evidence of machine generation plus
mechanical cleanup, and tells you exactly where to sweep next.

## What is NOT slop — look-alikes that must survive

| Looks like | Is actually | Test |
| --- | --- | --- |
| Emoji in source | The product's own data (emoji picker, reactions) | Is it in a string literal/dataset the feature ships? |
| Long site-quirk comments in e2e | Hard-won operational knowledge about live third-party DOM | Does it encode a verified behavior you could not re-derive cheaply? |
| "once made … NaN" history | Incident provenance pinning a regression rationale | Does the history justify a present design decision? |
| Repeated type lists in a test | A deliberate contract pin (a shared const would defeat it) | Does the test say so, or does deleting it weaken the pin? |
| Em dashes all over the docs | The project's own documented house style | Read the repo's style rules before flagging prose. |
| Defensive catch-everything in probes | Code driving live sites where anything throws | Is the swallow reasoned (a comment says why absorbing is correct)? |
| Two similar formatters with different rounding | Deliberate semantic divergence (ours vs platform-mimicking) | Is the difference intentional? Cross-link them, never merge. |

## Phase 0 — Recon

1. Snapshot `git status` / `git diff --stat`. **Already-dirty files are the
   user's WIP: exclude them from the audit and the fix pass, and never commit
   them.** Re-check before committing — WIP can appear mid-session.
2. Scope to tracked files; exclude generated (`__generated__`, codegen, locks),
   vendored, data tables, locale trees, binary assets.
3. Read the repo's rules (AGENTS.md / CLAUDE.md / CONTRIBUTING): formatter
   width, comment policy, and — critical for public repos — disclosure rules.
   A fix pass must never reintroduce private detail, and protected wording
   (credentials, backend mechanics) is off-limits even for a glyph swap.
4. Inventory line counts; beyond ~5k lines split into **disjoint** partitions
   (~5–10k each along directory boundaries) and run one read-only subagent per
   partition in parallel. Disjoint is what makes the later parallel fix safe.

## Phase 1 — Audit (read-only)

Each partition agent reads every in-scope file fully and reports:

- Per finding: `file:line | category# | evidence quote ≤10 words | suggested
  fix | risk low/med/high | strength Strong / Worth-exploring / Speculative`.
  Be honest about Speculative — most findings in a healthy repo are.
- Repeated patterns aggregate to one line with a count and file list, never N
  copies.
- **Verified non-findings**: which categories came back empty, and what was
  checked to prove it (constants recounted, callers grepped, claims re-derived).
- Per-category counts and a 3-line density verdict: low / medium / high, and
  whether the repo reads machine-written or hand-maintained.

The merged report ranks by impact (lies first, then drift pairs, then
fingerprints), separates policy findings (disclosure leaks found in passing go
to the top, outside the slop ranking), and ends with a **do-not-do list**: the
look-alikes above found in this repo, named, so a later fix pass does not
"clean" them.

Domain caveats are part of each agent's brief, not an afterthought: name the
product's data (so emoji/glyphs in it are never flagged), name the wire
contracts and pinned identifiers (so nothing suggests renaming them), name the
trust boundaries (so their defensiveness is not "over-defense").

## Phase 2 — Fix pass (opt-in, scoped)

Only on explicit request, and only the findings the user selected — restate
what is in and out of scope before editing. Partition editors along the same
disjoint boundaries; verification is centralized (agents do not run lint/tests
— parallel runs collide).

The traps, each learned the expensive way:

- **Test titles are load-bearing.** Before renaming one, grep CI workflows and
  package scripts for `-g`/`--grep` filters carrying the title, and check for
  `__screenshots__`/snapshot directories keyed by sanitized title. Keyed or
  filtered → skip and report.
- **Strings compared against the outside world are data.** Never normalize a
  literal matched against product UI, DOM content, or locale strings — even
  when it carries the exact glyph you are sweeping. Only test-authored
  error/log messages are fair game.
- **Injected source stays self-contained.** A helper serialized into a page
  (`String(fn)`, `page.evaluate`) cannot gain imports, and its export site is
  part of the contract — unify implementations by moving the body, keep a
  re-export.
- **Renames need a repo-wide grep first** — including e2e, scripts and any
  sibling packages the main tsconfig does not cover. An affordance prefix
  stays where the override path is real.
- **A drift-pair unification is a behavior change.** Label it as the fix it
  is, pin both sides with tests (the corrected case on each), and put it in
  its own `fix:` commit — never buried in the cleanup diff.
- **The formatter will react.** Renames change line lengths; arrays collapse,
  import order shifts. Run the formatter check centrally after the pass and
  apply its targeted fixes rather than hand-wrapping.
- **Excluded scope is excluded.** If the user picked categories, the lies you
  found in the others stay unfixed — list them in the report instead.

## Phase 3 — Verification

Run the repo's own full gate and read real output, not wrapper summaries:
every tsconfig (main, e2e, scripts), lint with warnings as errors, docs lint,
unit suite, browser/component suite if titles or test code changed, a
list/dry-run of any runner too expensive to execute (it still proves every
spec imports), build plus any size budgets. Validate proposed commit messages
against the repo's commitlint config when one exists. State plainly what
remains unverified — live-site suites, CI runners a composite-action change
has not executed on — instead of implying total coverage.

## Phase 4 — Report and commits

Lead with the verdict and the verification evidence. Fixes partition into
commits by concern — behavior fix, cleanup refactor, CI, docs — and **each
commit must compile alone**: a rename's import-graph pulls its consumer files
into the same commit even when they "belong" elsewhere. Propose the messages
in the repo's own convention; committing is the user's call.
