# Awesome Agent Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Emojery](https://api.emojery.app/badge/github/khasky/awesome-agent-skills.svg)](https://emojery.app/react?t=github/khasky/awesome-agent-skills)

Skills for AI coding agents: code review, test writing, design docs, debugging, security audits, refactoring, and cleaning up AI-written code and text. Each skill is a folder with a `SKILL.md` in the [Agent Skills](https://agentskills.io) format — install by copying it into your agent's skills directory.

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
    - [Writing and text](#writing-and-text)
  - [Install](#install)
  - [Usage examples](#usage-examples)
  - [Skill format](#skill-format)
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

The [skills CLI](https://github.com/vercel-labs/skills) symlinks all 31 skills globally into Claude Code, Codex, and Gemini CLI, pointing them at your clone. Change `-a` to pick agents (`-a "*"` installs to every detected agent); add `--copy` to write independent copies instead of symlinks.

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
| [awesome-code-cleanup](skills/awesome-code-cleanup) | Repo-wide cleanup of AI-like code noise: comments by default, plus a read-only audit mode and a refactor mode for vague names, dead code, and over-abstraction — behavior-preserving |
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
| [awesome-security-audit](skills/awesome-security-audit) | Checks for injection, secrets, auth issues, dependency CVEs, CI/CD pipeline exposure, and crypto misuse |
| [awesome-pentest](skills/awesome-pentest) | Authorization-gated penetration-test engagement: scoping and rules of engagement, recon, attack-surface mapping, testing, exploitation-to-proof, and a findings report with CWE/CVSS and retest — drives the audit siblings and follows PTES/OWASP WSTG/NIST 800-115 |
| [awesome-leak-audit](skills/awesome-leak-audit) | Keeps a public client (extension, app, SPA, CLI) from leaking backend internals; client hardening |
| [awesome-accessibility-audit](skills/awesome-accessibility-audit) | WCAG-oriented a11y checks and fixes |
| [awesome-seo-audit](skills/awesome-seo-audit) | Read-only SEO + AI-discoverability audit: technical SEO, programmatic-page safety, agent/LLM readability, with a SHIP/FIX/BLOCK verdict |
| [awesome-performance-audit](skills/awesome-performance-audit) | Read-only server/runtime performance and reliability audit: event loop, streams/backpressure, memory diagnostics, graceful shutdown, resilience topology (circuit breakers, retry budgets, queue bounds), with a SHIP/FIX/BLOCK verdict |
| [awesome-db-audit](skills/awesome-db-audit) | Read-only database-layer audit: schema anti-patterns (EAV, imprecise types), query/index fit, integrity and concurrency, migration hygiene and tenancy, with a SHIP/FIX/BLOCK verdict |
| [awesome-dependency-audit](skills/awesome-dependency-audit) | Read-only supply-chain audit of the dependency graph: lockfile discipline, typosquats and hallucinated package names, install-script exposure, CVE reachability, licenses — with a SHIP/FIX/BLOCK verdict |
| [awesome-landing-audit](skills/awesome-landing-audit) | Read-only structural audit of landing/marketing pages: single CTA, form friction, message match, trust elements, CLS-safe banners — mechanics, not copy |
| [awesome-claims-audit](skills/awesome-claims-audit) | Audits public claims (site, README, store listing, privacy policy, docs) against the constants, manifests and catalogs that decide them — mechanical checks with a mutation proof, then a fix phase |

### Git and repository operations

| Skill | What it does |
| --- | --- |
| [awesome-git-history-reset](skills/awesome-git-history-reset) | Wipes a repo's git history to a single Initial commit and force-pushes — safely: access checks, verified mirror backup, secret scan, and a confirmation gate before anything irreversible |
| [awesome-git-author-rewrite](skills/awesome-git-author-rewrite) | Rewrites the author/committer identity on a commit (or every commit with a wrong identity) from its URL and force-pushes — account-ownership and access checks, verified mirror backup, counted hash blast radius, host-side attribution proof |

### Writing and text

| Skill | What it does |
| --- | --- |
| [awesome-humanize-en](skills/awesome-humanize-en) | Removes signs of AI generation from English text: 36 patterns, regex markers, source-fabrication checks |
| [awesome-document-style](skills/awesome-document-style) | Line-edits Markdown into clear, specific, publication-ready prose |
| [awesome-grammar-check](skills/awesome-grammar-check) | Advisory copy-edit — grammar, logic, and flow issues as suggestions, without rewriting the text |
| [awesome-translate-ru-en](skills/awesome-translate-ru-en) | Russian → English translation that preserves structure, formatting, and the author's voice |
| [awesome-style-mimic](skills/awesome-style-mimic) | Learns a website's writing style into a reusable style guide (live-browser deep crawl), then rewrites documents in that voice with a cross-document consistency pass |

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

They also chain: implement → **awesome-code-cleanup** in audit mode (read-only findings) → apply the cleanup → **awesome-code-review** before merge.

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

## Design principles

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
