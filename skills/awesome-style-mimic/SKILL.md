---
name: awesome-style-mimic
description: "Learns a website's writing style by deep-crawling it in a live browser and distills a reusable style guide (voice, tone rules, lexicon, rhythm, structure templates, verbatim golden samples), then rewrites any documents or page sources in that voice with a cross-document consistency pass. Use when the user says 'learn the style of <site>', 'изучи стиль сайта', 'create a style guide from my website', or wants text rewritten in a learned voice: 'rewrite this in the style of <site>', 'перепиши в стиле', 'apply this style guide to these docs'. Learn mode needs browser automation (Playwright MCP or equivalent); apply mode needs only a style-guide file and works on Markdown, HTML, and component sources. Do not use for removing AI voice from English text — use awesome-humanize-en; for line-editing Markdown without a target voice — use awesome-document-style; for translation — use awesome-translate-ru-en."
license: MIT
metadata:
  author: Khasky
  tags: ["writing", "style", "brand-voice", "crawling", "rewriting"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-style-mimic"
---

# Style mimic — learn a site's voice, rewrite anything in it

Two modes sharing one artifact: **Learn** deep-crawls a website and produces a self-contained
style guide; **Apply** rewrites documents in that guide's voice so a whole batch reads as one
author. The guide file is the only thing that crosses sessions — everything else is working
state.

Bundled files (load on demand):

- `scripts/crawl-ingest.mjs` — the crawl engine: state, corpus writes, link filtering, serial
  classification, quotas, stop criterion. Learn mode runs it; never reimplement it by hand.
- `references/rewriter-contract.md` — the per-document rewriter instructions Apply mode gives
  each subagent verbatim.
- `references/example-styles/` — complete style guides produced by Learn mode (buffer.com,
  hubspot.com, zapier.com, ahrefs.com, semrush.com, hootsuite.com, clickup.com, linktr.ee).
  The format reference, and directly usable with Apply mode. Their samples are SYNTHETIC —
  composed to demonstrate each register, not quoted from the sites (the publishable policy
  below).

## Mode dispatch

- Argument is a URL → **Learn mode**.
- Arguments are a style-guide path + a file/folder target → **Apply mode**.
- Ambiguous → ask.

## Learn mode

Output: `styles/<host>.md` (host without `www.`). Working state: `style-crawl/<host>/`
(`state.json`, `corpus/`, `analysis/`) — resumable, deletable after the guide lands.

### 0. Browser preflight

Learn mode drives a real browser through whatever automation the agent has — Playwright MCP
(`--extension` bridge to the user's live Chrome, or a spawned browser), or an equivalent
browser tool; without one, say so and stop (a plain HTTP fetch tool cannot render JS-heavy
sites and silently misses content — do not degrade to it without telling the user).

With the Playwright MCP bridge: list tabs first (a lone `about:blank` means the bridge is not
attached — stop and have the user fix it); never touch the bridge's own `connect.html` tab;
open ONE working tab and reuse it. Warn the user the browser is busy while the crawl runs.
Dismiss cookie/consent banners once on the first page — they pollute extracted text.

### 1. Crawl loop (BFS by real links — no sitemap.xml)

All bookkeeping lives in the bundled ingester:

```
node <skill-dir>/scripts/crawl-ingest.mjs --dump dump-<host>.json --dir style-crawl/<host> [--origin <url>]
```

It ingests a dump of fetched pages and prints one JSON line: `nextBatch` (up to 8 URLs),
counters, coverage %, `done`. No `--dump` → just re-read state; that is also how a crawl
RESUMES after interruption. First run needs `--origin`.

The loop is two tool calls per batch of 8 pages:

1. **Fetch batch** — one browser-evaluate call that `fetch()`es the batch same-origin inside
   the page, parses each response with `DOMParser`, strips
   `nav,header,footer,script,style,noscript,svg,iframe,form,aside` plus
   `[role="navigation"],[aria-hidden="true"]`, and returns
   `[{requested, url, title, text (≤30k chars), links[]}]` per page (~250 ms pause between
   fetches). Save the result to a file (Playwright MCP: the `filename` parameter on
   `browser_evaluate`), named `dump-<host>.json` — page text must stay OUT of the
   conversation context, and the host-specific name keeps concurrent sessions from clobbering
   each other. Insert `\n` before closing block tags before parsing so `textContent` keeps
   paragraph breaks:

```js
html = html.replace(/<\/(p|div|h[1-6]|li|section|article|ul|ol|blockquote|tr)>/gi, '\n</$1>');
```

2. **Ingest** — run the script; feed its `nextBatch` into the next fetch. Repeat until
   `done: true`.

Fast-path validity check: extract the FIRST page twice — live (navigated tab) and via
`fetch()` — and compare. Empty or much shorter fetch text → the site is JS-rendered: fall
back to per-page navigation + a settle wait + the same extraction in the live DOM, still
dumping to the file and ingesting with the same script (single-page dumps are fine).

Rules:

- Read-only: navigation and DOM reads only; never click actions or type into forms (consent
  dismissal excepted). The script already skips login/cart/account paths, media files,
  `.md`/`.txt` page mirrors, feeds, and localized mirrors (`/es`, `/fr`, …) — style is
  learned from the primary language.
- One crawl at a time machine-wide; never crawl the same host from two sessions (shared
  `state.json` corrupts).
- Mid-crawl steering by editing `state.json` between batches is allowed: trim a low-value
  serial quota (author bios, changelog entries), or purge noise the skip-list missed
  (legal archive years, malformed URLs) — remove such URLs from `frontier` AND `discovered`
  so coverage math stays honest.
- Report the ingester's counter line to the user every ~3 batches.

### 2. Serial pages and the stop criterion (handled by the script)

Serial = templated pages whose count can run to thousands (blog posts, products, glossary
terms, tags). The script samples them (default quota 18 per pattern) instead of exhausting
them: auto-serial path patterns plus automatic promotion when ≥8 URLs share a
`<prefix>/<varying-last-segment>` template. `done` fires at ≥80% coverage of NON-serial
pages with all quotas met, or an empty frontier. Safety cap 300 pages: on `capHit: true`,
STOP and tell the user the real coverage — never present a capped crawl as full.

### 3. Analysis fan-out (parallel, from disk)

Split `corpus/*.md` into batches of ~15 files; spawn one subagent per batch, all
concurrently. Each reads its files and writes STYLE observations (not content summaries) to
`style-crawl/<host>/analysis/batch-N.md` with fixed sections: **Lexicon / Voice & POV /
Rhythm / Structure / Formatting / Genre notes / Golden-sample candidates** (3–5 verbatim
excerpts ≤120 words with source file and why), returning only a 5-line summary.
**Resource preflight** before spawning: cap concurrency at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`,
`per_agent` ≈ 0.7 GB for these read-only agents; go serial if CPU load > 85% or free RAM <
2×per_agent; recompute before each wave; if the runtime caps sub-agent concurrency itself, defer to it.

### 4. Synthesis

One agent (or the main context) reads all `analysis/batch-*.md`, reconciles (majority wins;
genre differences become sub-profiles, not contradictions), and writes `styles/<host>.md`
with exactly these sections: **Voice profile · Tone rules (Do/Don't) · Lexicon · Rhythm &
syntax · Structure (with the site's invariant CTA strings quoted verbatim) · Formatting
habits · Genre notes · Samples · Rewrite instructions**. The guide must be self-contained —
Apply sessions see only this file. See `references/example-styles/buffer.com.md` for the
target shape and depth.

Two sample policies — pick by the guide's destination, ask when unclear:

- **Private/local guide (default): golden samples** — 8–10 verbatim excerpts across genres,
  each verified letter-for-letter against its corpus file before inclusion (drop or fix any
  that don't match), labeled with genre and source URL. Verbatim anchors give Apply mode the
  highest fidelity.
- **Publishable guide: synthetic samples** — the excerpts are COMPOSED by you in the
  described style about invented, generic subject matter: no sentence taken from the site, no
  real claims or people, no source URLs. Section opens with "Composed to demonstrate the
  register — not text from the site." Short phrase-level microcopy patterns (CTA strings,
  verdict openers) may stay verbatim. Converting an existing golden-sample guide to
  publishable = rewrite only its samples section this way and strip sample attributions.

## Apply mode

Inputs: a style-guide path + a target (file or folder). Read the guide FIRST, fully — its
**Golden samples** anchor the tone; its **Rewrite instructions** override defaults below.

### Target resolution

Single file → one rewrite. Folder → glob prose-bearing sources (`.md .mdx .txt .html .htm
.astro .svelte .vue .jsx .tsx` — component files: copy strings only), skipping
`node_modules`, build output, lockfiles, pure code/config. List the set first when >20 files.

### Output rules

Target inside a git repo (`git -C <target> rev-parse --show-toplevel` exits 0) → ask which
mode, unless the user already named one:

1. **Separate worktree (recommended)** — `git -C <repo-root> worktree add -b
   restyle/<style-name> <repo-root>-restyle`, rewrite in-place inside the worktree, user
   reviews with `git diff` and merges or removes it (their call, never yours). Worktrees cut
   from HEAD — warn if `git status` shows uncommitted changes on target files.
2. **Mirror folder** — `<target-name>-styled/` next to the target; originals untouched.
3. **In-place** — only on explicit request; warn first on a dirty working tree.

Non-repo target → mirror folder by default; in-place only on explicit request.

### Fan-out and the one-author guarantee

One subagent per file, spawned in parallel. Each subagent gets: the style-guide path, one
source path, one output path, the file mode (markdown/html/component), and the FULL text of
`references/rewriter-contract.md` — identical guide + identical contract per file is what
keeps one authorial voice across the batch. Never relay a summary of the guide; each
subagent reads the guide file itself. A failed file gets one retry, then is reported — never
silently dropped. **Resource preflight** before spawning: cap concurrency at
`min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB for these read/write
agents; go serial if CPU load > 85% or free RAM < 2×per_agent; recompute before each wave; if
the runtime caps sub-agent concurrency itself, defer to it.

After all rewrites land (2+ files), run ONE consistency-pass subagent over the whole output
set (for >15 files: first/last 3 paragraphs plus a middle excerpt each): find cross-document
drift — lexicon used in one file but violated in another, tone shifts, inconsistent
heading/CTA patterns — fix findings directly with edits, return the `path: what changed`
list. Report that list to the user; it is the evidence the batch reads as one author.

## Verification (both modes)

- Learn: the final report cites the ingester's numbers (pages visited, non-serial coverage %,
  serial patterns sampled, failures) — from `state.json`, not memory — and states that every
  golden sample was grep-verified verbatim against the corpus.
- Apply: the final report lists files rewritten/skipped/failed, the consistency-pass fix
  list, and where the originals are (untouched mirror / worktree branch / in-place).
- Both: anything unverifiable (a capped crawl, a file the rewriter refused) is stated
  explicitly, never implied as done.

## Anti-patterns

- Crawling `sitemap.xml` instead of real navigation links — sitemaps list URLs the site's own
  linking never surfaces and miss the link-graph signal of what matters.
- Letting page text into the conversation context during the crawl (dump to disk; context
  compaction must not be able to lose corpus data).
- Presenting a capped or partial crawl as full coverage.
- Style guides padded with abstractions ("friendly but professional") instead of quotable
  mechanics (exact CTA strings, verdict-first FAQ openers, em-dash pivots).
- Rewriters translating the source document (style transfers across languages; words do not),
  inventing facts, or "improving" content beyond voice/rhythm/lexicon/formatting.
- Publishing a golden-sample guide as-is — verbatim excerpts of someone else's site do not
  belong in a public repo; convert to synthetic samples first (the publishable policy above).
