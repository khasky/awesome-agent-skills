# Awesome Agent Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Emojery](https://api.emojery.app/badge/github/khasky/awesome-agent-skills.svg)](https://emojery.app/react?t=github/khasky/awesome-agent-skills)

Skills for AI coding agents: code review, test writing, design docs, debugging, security audits, refactoring, and cleaning up AI-written code and text. Each skill is a folder with a `SKILL.md` in the [Agent Skills](https://agentskills.io) format — install by copying it into your agent's skills directory.

Distilled from the most-used public collections and the documented practice of large open-source projects, then sharpened over several rounds on real, production-ready repositories.

Compatible with Claude Code, Claude.ai, OpenAI Codex, Gemini CLI, Cursor, GitHub Copilot, opencode, Amp, and any other agent that supports the standard. See [Install](#install) for exact paths.

## Contents

- [Awesome Agent Skills](#awesome-agent-skills)
  - [Contents](#contents)
  - [Quick start](#quick-start)
  - [Skills](#skills)
    - [Code review](#code-review)
    - [Code quality and refactoring](#code-quality-and-refactoring)
    - [Testing](#testing)
    - [Design and planning](#design-and-planning)
    - [Debugging and reliability](#debugging-and-reliability)
    - [Audits](#audits)
    - [Git and repository operations](#git-and-repository-operations)
    - [Agent maintenance](#agent-maintenance)
    - [Writing and text](#writing-and-text)
    - [Content marketing](#content-marketing)
  - [Picking between similar skills](#picking-between-similar-skills)
  - [Install](#install)
  - [Usage examples](#usage-examples)
  - [Skill format](#skill-format)
  - [How these were built](#how-these-were-built)
  - [Design principles](#design-principles)
    - [Which layer to install](#which-layer-to-install)
  - [Related](#related)
  - [License](#license)

## Quick start

Clone once, then symlink every skill into your agents — a later `git pull` keeps them all in sync:

```bash
git clone https://github.com/khasky/awesome-agent-skills.git
cd awesome-agent-skills
npx skills add ./skills -g -s "*" -a claude-code codex gemini-cli -y
```

The [skills CLI](https://github.com/vercel-labs/skills) symlinks all skills globally into Claude Code, Codex, and Gemini CLI, pointing them at your clone. Change `-a` to pick agents (`-a "*"` installs to every detected agent); add `--copy` to write independent copies instead of symlinks.

Keep them current:

```bash
cd awesome-agent-skills && git pull   # updates every symlinked skill in place
```

Re-run the `skills add` command to pick up skills added since. Then just ask the agent naturally ("review this diff against main") or invoke a skill explicitly (`/awesome-code-review` in Claude Code and Cursor, `$awesome-code-review` in Codex).

Prefer not to clone? `npx skills add khasky/awesome-agent-skills` installs straight from GitHub — but it won't auto-sync with `git pull`.

## Skills

### Code review

| Skill | What it does |
| --- | --- |
| [awesome-code-review](skills/awesome-code-review) | Reviews diffs and PRs for correctness, security, and team standards |
| [awesome-code-review-feedback](skills/awesome-code-review-feedback) | Responds to review feedback: verify before implementing, clarify, push back with reasoning |

### Code quality and refactoring

| Skill | What it does |
| --- | --- |
| [awesome-code-standards](skills/awesome-code-standards) | Naming, structure, and patterns for consistent code across a team |
| [awesome-code-cleanup](skills/awesome-code-cleanup) | Repo-wide cleanup of AI-like code noise: comments by default, plus read-only audit, refactor, dead-code/inconsistency detection, and an execution mode that applies another audit's findings — cleanup passes behavior-preserving, detection findings execution-verified. The only skill here that edits for these reasons |
| [awesome-dependency-upgrade](skills/awesome-dependency-upgrade) | Executes dependency upgrades safely: risk-classified batches, changelog-driven majors, overrides with removal conditions, verification between steps |

### Testing

| Skill | What it does |
| --- | --- |
| [awesome-test-writing](skills/awesome-test-writing) | Designs and writes tests that catch real regressions: placement ladder, behavior-first assertions, characterization tests, property/fuzz for parsers — every test proven able to fail |
| [awesome-regression-sweep](skills/awesome-regression-sweep) | Read-only multi-layer verification sweep against a recorded baseline: aspect pass, live wire contract, cross-implementation parity, deployed-vs-committed drift, nine rotating deep angles |

### Design and planning

| Skill | What it does |
| --- | --- |
| [awesome-design-doc](skills/awesome-design-doc) | Produces design docs and ADRs: requirements and numbers first, real alternatives, a recommendation tied to requirements, non-goals and rollout |
| [awesome-api-design](skills/awesome-api-design) | Designs or reviews HTTP API shape before code: resource modeling, versioning by layering, cursor pagination, idempotency keys |

### Debugging and reliability

| Skill | What it does |
| --- | --- |
| [awesome-bug-fix](skills/awesome-bug-fix) | Reproduce → isolate root cause → fix → verify; no random edits |
| [awesome-root-cause](skills/awesome-root-cause) | Root-cause analysis for incidents and process problems with no failing test: 5-Whys, fishbone, PDCA, one-page A3 |
| [awesome-error-standards](skills/awesome-error-standards) | Consistent error handling, retries, and user-facing messages |
| [awesome-logging-standards](skills/awesome-logging-standards) | Structured logging, levels, and PII handling |

### Audits

| Skill | What it does |
| --- | --- |
| [awesome-architecture-audit](skills/awesome-architecture-audit) | Read-only whole-project audit: architecture and module boundaries, docs-vs-code fidelity, YAGNI/KISS/SOLID, and extensibility (build-from-source, add-a-provider), with a SHIP/FIX/BLOCK verdict and a prioritized recommendations report |
| [awesome-security-audit](skills/awesome-security-audit) | Read-only check for injection, secrets, auth issues, dependency CVEs, CI/CD pipeline exposure, and crypto misuse — findings carry their remediation, applying it is the owner's call |
| [awesome-pentest](skills/awesome-pentest) | Authorization-gated penetration-test engagement: scoping and rules of engagement, recon, attack-surface mapping, testing, exploitation-to-proof, and a findings report with CWE/CVSS and retest — drives the audit siblings and follows PTES/OWASP WSTG/NIST 800-115 |
| [awesome-leak-audit](skills/awesome-leak-audit) | Keeps a public client (extension, app, SPA, CLI) from leaking backend internals; client hardening |
| [awesome-accessibility-audit](skills/awesome-accessibility-audit) | Read-only WCAG-oriented a11y checks, each finding carrying its fix as a reviewable snippet |
| [awesome-seo-audit](skills/awesome-seo-audit) | Read-only SEO + AI-discoverability audit: technical SEO, programmatic-page safety, agent/LLM readability, with a SHIP/FIX/BLOCK verdict |
| [awesome-performance-audit](skills/awesome-performance-audit) | Read-only server/runtime performance and reliability audit: event loop, streams/backpressure, memory diagnostics, graceful shutdown, resilience topology (circuit breakers, retry budgets, queue bounds), with a SHIP/FIX/BLOCK verdict |
| [awesome-database-audit](skills/awesome-database-audit) | Read-only database-layer audit: schema anti-patterns (EAV, imprecise types), query/index fit, integrity and concurrency, migration hygiene and tenancy, with a SHIP/FIX/BLOCK verdict |
| [awesome-dependency-audit](skills/awesome-dependency-audit) | Read-only supply-chain audit of the dependency graph: lockfile discipline, typosquats and hallucinated package names, install-script exposure, CVE reachability, licenses — with a SHIP/FIX/BLOCK verdict |
| [awesome-landing-audit](skills/awesome-landing-audit) | Read-only structural audit of landing/marketing pages: single CTA, form friction, message match, trust elements, CLS-safe banners — mechanics, not copy |
| [awesome-claims-audit](skills/awesome-claims-audit) | Audits public claims (site, README, store listing, privacy policy, docs) against the constants, manifests and catalogs that decide them — mechanical checks with a mutation proof, then a fix phase |
| [awesome-slop-audit](skills/awesome-slop-audit) | Read-only audit of a repo for machine-written "AI slop" markers across code, tests, docs and CI — a verified catalog of lies, noise and fingerprints, absence proven per category, findings ranked and handed to awesome-code-cleanup, which applies them |

### Git and repository operations

| Skill | What it does |
| --- | --- |
| [awesome-git-commit-plan](skills/awesome-git-commit-plan) | Reads a codebase and plans its commit history — a navigation map from import direction, a split where every commit builds and tests alone, proven by replaying the ladder in a scratch clone against the repo's own gates, messages written to a strict anti-slop ruleset, output as one plan file numbered #1 to #N with no dates. Read-only; feeds awesome-git-history-rebuild |
| [awesome-git-history-reset](skills/awesome-git-history-reset) | Wipes a repo's git history to a single Initial commit and force-pushes — safely: access checks, verified mirror backup, secret scan, and a confirmation gate before anything irreversible |
| [awesome-git-author-rewrite](skills/awesome-git-author-rewrite) | Rewrites the author/committer identity on a commit (or every commit with a wrong identity) from its URL and force-pushes — account-ownership and access checks, verified mirror backup, counted hash blast radius, host-side attribution proof |
| [awesome-git-history-rebuild](skills/awesome-git-history-rebuild) | Erases a history and replays the same tree as a curated commit series — source analysis, an approved split plan (re-splittable), the repo's own commit rules and hooks, paced timestamps, permission/ruleset preflight, verified backup, a fresh-clone tree-hash proof that nothing was lost, and an optional contributors-cache cleanup |
| [awesome-git-history-salvage](skills/awesome-git-history-salvage) | Read-only reconstruction of every commit a repo has ever held, erased history included — merges current refs, pull-request refs, mirror backups and every ref state in the host's activity log, fetching unreachable commits by SHA over the git protocol, which serves what the REST API refuses |

### Agent maintenance

| Skill | What it does |
| --- | --- |
| [awesome-skills-purge](skills/awesome-skills-purge) | Removes installed skills from every agent on the machine behind a keep list (one collection, this skill alone, or named skills) — a home-wide sweep for skill roots, per-entry link-vs-real classification, links deleted as links, git work trees protected as sources, archive and confirmation gate before anything goes, platform detected at run time |

### Writing and text

| Skill | What it does |
| --- | --- |
| [awesome-humanize-en](skills/awesome-humanize-en) | Removes signs of AI generation from English text: 36 patterns, a discourse layer that fixes structure before style, regex markers, source-fabrication checks |
| [awesome-document-style](skills/awesome-document-style) | Line-edits Markdown into clear, specific, publication-ready prose |
| [awesome-grammar-check](skills/awesome-grammar-check) | Advisory copy-edit — grammar, logic, and flow issues as suggestions, without rewriting the text |
| [awesome-translate-ru-en](skills/awesome-translate-ru-en) | Russian → English translation that preserves structure, formatting, and the author's voice |
| [awesome-style-mimic](skills/awesome-style-mimic) | Learns a website's writing style into a reusable style guide (live-browser deep crawl), then rewrites documents in that voice with a cross-document consistency pass |

### Content marketing

| Skill | What it does |
| --- | --- |
| [awesome-content-voice](skills/awesome-content-voice) | Builds one reusable author-voice profile from whatever evidence exists — own posts read through the live browser, files, pasted samples, or an interview plus a tuned archetype: counted absence signals, per-platform register, protected personal tics, and a source-and-confidence stamp |
| [awesome-content-campaign](skills/awesome-content-campaign) | Builds a scheduled batch of platform-fit marketing posts from any sources (repos, sites, files): knowledge map with claim tracing, dated platform-limit and best-time checks, one content unit fanned out per platform with strict per-platform uniqueness, per-genre register, a two-stage self-audit, one dated file per slot plus a campaign manifest |
| [awesome-content-repurpose](skills/awesome-content-repurpose) | Turns one existing text (a link, a file, pasted notes) into platform-native posts: source notes every claim traces to, selection over summary with a different idea per platform, per-genre registers and dated limits reused from the campaign skill, a two-stage audit, files first and publishing as a handoff |
| [awesome-content-graphics](skills/awesome-content-graphics) | Makes the one image a post ships with, offline: a set of at least 20 self-contained HTML/CSS graphics rendered locally from the caller's facts and the user's own look inputs (brand palette, reference images, an approved render), with two gates — the headline as text first, the picture from a gallery second — so the skill never picks the image for the user |
| [awesome-content-publisher](skills/awesome-content-publisher) | Publishes a post batch to the user's own accounts through their live browser (Playwright MCP bridge): bridge/format/login preflights, a persistent dedup ledger, timezone-aware scheduling with day-long waits, sequential human-paced posting with read-back verification, and an opt-in read-only engagement harvest |

## Picking between similar skills

Some skills sit next to each other on purpose: they share a file format, a target, or a vocabulary. The overlap is real — what separates them is one question, in the last column. Names are shortened there; every skill links from the tables above.

| These look alike | Shared ground | What decides |
| --- | --- | --- |
| awesome-code-review · awesome-architecture-audit | Both read code and rank findings on the same severity scale | One diff or PR before merge → code-review. The whole project — boundaries, docs-vs-code fidelity, extensibility, SHIP/FIX/BLOCK → architecture-audit. |
| awesome-code-review · awesome-code-review-feedback | Two ends of one review thread | Writing the review → code-review. Answering comments you received → code-review-feedback. |
| awesome-security-audit · awesome-pentest | Same vulnerability classes, same CWE mapping | Static white-box read of your own code, no gate → security-audit. Active probing of a live target, hard-gated behind written authorization → pentest. |
| awesome-security-audit · awesome-leak-audit | Both ask what an attacker gains | Exploitable server-side flaws → security-audit. What a shipped public client reveals about the private backend → leak-audit. |
| awesome-security-audit · awesome-dependency-audit | Both report CVEs | Vulnerabilities in code you wrote → security-audit. The dependency graph itself — lockfiles, typosquats, install scripts, reachability → dependency-audit. |
| awesome-dependency-audit · awesome-dependency-upgrade | Same package set, two halves of one job | Decide what is risky → audit. Execute the bumps in verified batches → upgrade. |
| awesome-performance-audit · awesome-database-audit | Both answer "why is this slow" | Runtime behavior — event loop, memory, streams, resilience topology → performance-audit. The static data layer — schema, index-vs-predicate fit, migrations → database-audit. |
| awesome-bug-fix · awesome-root-cause | Both refuse to fix before the cause is known | A failure you can reproduce on command → bug-fix. An incident or process problem with nothing runnable to fail → root-cause. |
| awesome-test-writing · awesome-regression-sweep | Both live in the test suite | Designing and writing tests → test-writing. Running every layer against a recorded baseline and reporting deltas → regression-sweep. |
| awesome-seo-audit · awesome-landing-audit · awesome-accessibility-audit | Three read-only audits of the same public page | Found and parsed by search and LLMs → seo-audit. Structure that converts — CTA, form friction, message match → landing-audit. Usable by everyone, WCAG → accessibility-audit. |
| awesome-claims-audit · awesome-architecture-audit | Both catch drift between what is written and what the code does | Public claims — site, store listing, privacy policy, README → claims-audit. Internal docs against the codebase they describe → architecture-audit. |
| awesome-slop-audit · awesome-code-cleanup | Both target machine-written noise in a repo | They chain rather than compete: slop-audit finds and ranks across code, tests, docs and CI, and never edits; code-cleanup executes — its own comment and naming pass, or the report slop-audit produced. |
| awesome-code-standards · awesome-code-cleanup | Both govern how code reads | Prescribe conventions for work being written → code-standards. Sweep noise out of what already exists → code-cleanup. |
| awesome-git-commit-plan · awesome-git-history-rebuild | The same split, planned then executed | Read-only, produces the numbered plan → commit-plan. Erases the history and replays the tree to that plan → history-rebuild. |
| awesome-git-history-reset · awesome-git-history-rebuild | Both erase history and force-push, behind the same safety gates | One Initial commit → history-reset. A curated series over the identical tree → history-rebuild. |
| awesome-git-history-salvage · awesome-git-history-reset | Both act on a history that is about to be, or already was, rewritten | Recover and list every commit that ever existed, writing nothing → history-salvage. Destroy and replace → history-reset. |
| awesome-design-doc · awesome-api-design | Both run before code exists | The system — requirements, alternatives, recommendation, rollout → design-doc. The HTTP surface — resources, versioning, pagination, idempotency → api-design. |
| awesome-error-standards · awesome-logging-standards | Both shape what happens on failure | The error contract — types, envelopes, status mapping, retries → error-standards. What gets written down — levels, structure, PII → logging-standards. |
| awesome-humanize-en · awesome-document-style · awesome-grammar-check | Three passes over the same English text | Strip AI fingerprints → humanize-en. Line-edit for clarity and specificity → document-style. Suggest without touching the text → grammar-check. |
| awesome-style-mimic · awesome-content-voice | Both write the same section set, so either file feeds a rewrite or a campaign | A site's brand voice, learned by crawling it → style-mimic. The author's own voice from their own evidence, with consent, counted absence and a confidence stamp → content-voice. |
| awesome-content-campaign · awesome-content-repurpose | Both write platform-native posts into the file format the publisher reads | Product sources plus a schedule → content-campaign. One existing text, no schedule → content-repurpose. |
| awesome-content-campaign · awesome-content-publisher | Two halves of one shipping pipeline | Write the post files → content-campaign. Post them to your accounts through your own browser → content-publisher. |

## Install

The Quick start covers Claude Code, Codex, and Gemini CLI. For any other agent — or to install by hand without the CLI — a skill is just a folder: copy it into the directory your agent reads. Most agents also read the shared `.agents/skills/` path, so one copy can serve several tools at once. To stay in sync with `git pull`, symlink from your clone instead of copying (`ln -s`).

| Agent | Project path | Global path | Docs |
| --- | --- | --- | --- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` | [docs](https://code.claude.com/docs/en/skills) |
| OpenAI Codex | `.agents/skills/` | `~/.agents/skills/` | [docs](https://developers.openai.com/codex/skills) |
| Gemini CLI | `.gemini/skills/` or `.agents/skills/` | `~/.gemini/skills/` or `~/.agents/skills/` | [docs](https://geminicli.com/docs/cli/skills/) |
| Cursor | `.cursor/skills/` or `.agents/skills/` | `~/.cursor/skills/` or `~/.agents/skills/` | [docs](https://cursor.com/docs/context/skills) |
| GitHub Copilot | `.github/skills/` or `.agents/skills/` | `~/.copilot/skills/` or `~/.agents/skills/` | [docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| opencode | `.opencode/skills/` or `.agents/skills/` | `~/.config/opencode/skills/` | [docs](https://opencode.ai/docs/skills/) |
| Amp | `.agents/skills/` | `~/.agents/skills/` | [docs](https://ampcode.com/manual#agent-skills) |
| Windsurf | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | [docs](https://docs.windsurf.com/windsurf/cascade/skills) |
| Antigravity | `.agents/skills/` (legacy `.agent/skills/`) | `~/.gemini/antigravity/skills/` | [docs](https://antigravity.google/docs/skills) |

- **Claude.ai (web):** zip a skill folder and upload it under **Settings → Skills**.
- **Gemini CLI** can also install straight from a repo URL: `gemini skills install <repo-url> --consent`.
- Restart or reload the agent after copying so it picks up new skills.

## Usage examples

Skills trigger on intent — plain requests work. Explicit mentions make the choice deterministic:

- "Use **awesome-code-review** on the diff against `main`: Critical / Suggestions / Nice to have, with file:line references."
- "Here are the review comments — use **awesome-code-review-feedback**: agree, clarify, or push back with evidence."
- "**awesome-bug-fix** for this error: reproduce first, root cause before any fix — [paste logs]."
- "**awesome-security-audit** the files touched by this change (auth, injection, secrets)."
- "Audit this repo with **awesome-leak-audit** before we open-source it."
- "**awesome-humanize-en**: remove the AI voice from this draft."
- "**awesome-translate-ru-en**: mirror `docs-ru/` into `docs-en/` — same structure, translate each file."

They also chain: implement → **awesome-code-cleanup** in audit mode (read-only findings) → apply the cleanup → **awesome-code-review** before merge. Or: **awesome-content-campaign** from your repo and site → review the drafts → **awesome-content-publisher** ships them on schedule.

## Skill format

Each skill follows the [Agent Skills specification](https://agentskills.io/specification):

```text
skills/<skill-name>/
├── SKILL.md          # required: YAML frontmatter (name, description) + instructions
├── references/       # optional: detailed docs the agent loads on demand
└── scripts/          # optional: helper scripts
```

**No `README.md` inside a skill folder.** A skill folder holds only what the agent reads: `SKILL.md` and the files it names. What each skill is for and when to reach for it belongs here in the root README (the tables above), so a reader compares skills in one place instead of opening 28 folders. Where a skill ships `references/` or `scripts/`, `SKILL.md` itself maps them — an agent that skips the map skips the files.

The frontmatter `description` tells the agent when to activate the skill; the body loads only after activation, and `references/` files only when needed — so a large skill still costs little context until used.

Two rating vocabularies are shared across the collection, so two reports never mean different things by the same word:

- **Findings** — `Critical / High / Medium / Low / Informational`, rated on impact and reachability. A skill may truncate the scale from the bottom — top four where `Informational` carries no meaning (architecture, database), top three where `Low` doesn't either (accessibility, copy-editing, landing mechanics) — and its output section states which tiers it uses. Never reorder or rename tiers.
- **Verdict** — `SHIP / FIX / BLOCK`, for read-only audits that gate a release (landing, performance, SEO), always paired with `NOT ASSESSED` for anything that could not be checked.

`awesome-code-review` keeps its own reviewer-comment buckets (`Critical / Suggestions / Nice to have`) because those are addressed to an author, not to a release gate.

## How these were built

Three passes per skill:

1. **Survey** — the widely-used public skill and prompt collections, plus the documented practice of projects that do the job at scale: kernel and git patch-series rules, OpenStack's commit guide, Conventional Commits, OWASP, WCAG, PTES, NIST 800-115.
2. **Distill** — keep what changes an agent's output, drop what it already does untold. A rule that survives is one an agent gets wrong without it. Borrowed material is cited where it is used.
3. **Iterate on real work** — every skill is run on production-ready repositories, revised from what it got wrong, and run again. The phases, stop gates and output formats here are what those rounds left standing, not what looked good in the draft.

## Design principles

- **Distilled, not invented** — each skill starts from what large OSS projects and the most-used public collections already do, and keeps only the parts that change an agent's behavior.
- **Field-tested** — every skill went through several rounds on real, production-ready repositories, revised after each one.
- **Self-contained** — every skill is complete in this repo; no chasing external links or docs.
- **Few, not many** — a small set that covers repeated engineering work, not a hundred micro-skills nobody remembers.
- **Portable** — plain `SKILL.md` per the open spec, stack-agnostic, nothing vendor-specific baked in.
- **Verification-first** — skills end with the check that proves the claim: run the command, read the output, then say "done".

### Which layer to install

A rule is a standing constraint the agent honors without being asked; a skill is a procedure you invoke, with phases and an output contract. The two layers overlap by design: `rules/code-review.md` in [Awesome AGENTS.md](https://github.com/khasky/awesome-agents-md) sets the bar every review must meet, `awesome-code-review` here runs the review and produces the report. Install both — rules keep everyday work in line, skills handle the jobs you name.

## Related

Part of a set of agent tooling — pick the layer you need:

- **Awesome Agent Skills** — *this repo:* portable `SKILL.md` skills every agent loads — code review, debugging, security and leak audits, code and text cleanup.
- [Awesome AGENTS.md](https://github.com/khasky/awesome-agents-md) — the base, tool-agnostic ruleset every agent imports (one `AGENTS.md`).
- [Agent MCP Integrations](https://github.com/khasky/agent-mcp-integrations) — MCP servers that connect agents to browsers, cloud, databases, infra, and domain APIs.
- [Claude Code Token Optimization](https://github.com/khasky/claude-code-token-optimization) — the token-efficiency layer (RTK, LSP, Context7, `codebase-memory-mcp`, claude-mem, Caveman, Ponytail).
- [Claude Code Security Audit](https://github.com/khasky/claude-code-security-audit) — the layered security-audit workflow (deep audit, continuous guardrails, scanners).

## License

Released under the [MIT license](LICENSE). The [awesome-humanize-en](skills/awesome-humanize-en) skill adapts MIT-licensed material from [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) by Vladimir-Human — with credit kept inline where it's used.
