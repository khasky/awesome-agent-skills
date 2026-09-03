---
name: awesome-slop-audit
description: "Read-only audit of a repository for machine-written 'AI slop' markers across every surface — code, comments, tests, docs, configs and CI — against a verified catalog: glyph pockets, stale and false comments, change-narration, drift-bait numbers, template stamps, misleading prefixes, impossible defensiveness, copy-paste drift and negative-parallelism prose fingerprints. Every suspect is verified against the code before it is reported, absence is proven per category, and the ranked findings hand off to awesome-code-cleanup, which owns every edit. Use when asked to 'find AI slop', 'does this code look AI-written', 'find machine-written or vibe-coding markers', or in Russian 'найди AI-slop', 'проверь код на следы ИИ', 'что выдаёт код, написанный нейросетью'. Do not use to fix what it finds — it never edits a file; the fix pass and the comment-craft pass live in awesome-code-cleanup. Not for prose line-editing (awesome-document-style, awesome-humanize-en) or public-claims-vs-code drift (awesome-claims-audit)."
license: MIT
metadata:
  author: Khasky
  tags: ["audit", "ai-slop", "vibe-coding", "detection", "code-quality"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-slop-audit"
---

# AI Slop Audit

**This skill reads and reports. It never edits.** Every fix its findings call for
— the comment rewrite, the rename, the drift-pair unification, the CI template
extraction — is executed by `awesome-code-cleanup`, which owns the editing bar,
the behavior-preserving proof and the regression gate. Splitting it this way is
what lets the catalog below range over docs and CI without a second skill
rewriting the same line.

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

The core discipline: **verify before flagging, and prove absence to yourself too**.
Dense commentary is not slop — a comment that checks out against the code (recount
the constant, re-derive the number, grep the callers) is an *anti*-signal: machine
writing narrates, incident-anchored writing survives verification. Proving a
category empty is what earns the right to say the repo is clean; it is not
something to write up. Never flag what you have not checked; never "fix" a comment
to say something you have not confirmed.

**The proof stays internal.** A category that came back empty is not a report line,
and the report carries no per-category clean table — the reader acts on findings,
and everything else is scrolling. An audit that found nothing anywhere says so in
one sentence and stops.

Not for: applying any of it (awesome-code-cleanup), judging code quality in
general (awesome-code-review, awesome-architecture-audit), rewriting prose voice
(awesome-humanize-en), or generated/vendored files — those are excluded, not
audited.

## Marker catalog

Categories are numbered so partitioned sub-audits report against the same list.

### Comments (1–8)

1. Narration/tutorial: "check if…", "loop through…", "this function…".
2. Echo-JSDoc: restates the signature, param lists that add nothing.
3. Banner rows: `// ====`, `// ----`, `/* ---------- Name ---------- */`.
4. Typographic glyphs in comment text: `— – … → ⇒ ↔ ≤ ≥ ± ≈ × ≠`, curly quotes,
   decorative bullets, emoji, non-breaking spaces. A hand-typed comment uses
   `-`, `->`, `<=`, `~`, `x`. Markdown backticks around identifiers belong here
   too (`` // the query is logged in `query` ``) — except in doc comments a tool
   renders as markdown (TSDoc, rustdoc, published docstrings).
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
   user's WIP: exclude them from the audit** and say so. Auditing a half-written
   file reports findings against code the author is still moving, and the fix
   pass that receives the report would collide with their uncommitted work.
2. Scope to tracked files; exclude generated (`__generated__`, codegen, locks),
   vendored, data tables, locale trees, binary assets.
3. Read the repo's rules (AGENTS.md / CLAUDE.md / CONTRIBUTING): formatter
   width, comment policy, and — critical for public repos — disclosure rules.
   Carry them into the report: wording protected for disclosure reasons
   (credentials, backend mechanics, a deliberately vague comment) is off-limits
   to the fix pass even for a glyph swap, and the fix pass only knows that if
   this audit names it on the finding.
4. Inventory line counts; beyond ~5k lines split into **disjoint** partitions
   (~5–10k each along directory boundaries) and run one read-only subagent per
   partition in parallel. Disjoint is what makes coverage accountable — every
   file audited once, by one agent, so a category proven empty is proven across
   the whole scope. **Resource preflight** before spawning them: cap concurrency at
   `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB for these
   read-only agents; go serial if CPU load > 85% or free RAM < 2×per_agent;
   recompute before each wave; if the runtime caps sub-agent concurrency itself,
   defer to it.

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

## Phase 2 — Report and handoff

Lead with the density verdict and the evidence behind it. Then the ranked
findings, the policy findings above them, and the do-not-do list.

Three things the report owes the fix pass that reads it, because they are
cheap to see while auditing and expensive to rediscover while editing:

- **Which findings are not fixable as written.** A test title a CI `--grep`
  filter or a snapshot directory keys on, a literal compared against product
  UI or locale strings, a helper serialized into a page that cannot gain
  imports: record the constraint next to the finding. The fix pass re-checks
  it before editing, and a finding that arrives without the note gets checked
  from scratch anyway.
- **Which findings are behavior changes wearing cleanup clothes.** A drift-pair
  unification decides which of two behaviors survives. Say so on the finding so
  it is never bundled into a cleanup diff.
- **The exact scope each finding sits in.** File, line, category number. A fix
  pass runs on the user's selection, and the categories left out stay unfixed
  by design.

Then stop. Fixing is `awesome-code-cleanup`: it takes this report, applies the
selection, and owns the verification gate that proves the edits changed
nothing they should not have. This skill has verified its claims against the
code (Phase 1) and has nothing to verify beyond them, because it wrote no
diff — say that plainly rather than implying a gate ran.
