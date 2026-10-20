![Awesome Agent Skills](.github/banner.jpg)

# Awesome Agent Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Emojery](https://api.emojery.app/badge/github/khasky/awesome-agent-skills.svg)](https://emojery.app/react?t=github/khasky/awesome-agent-skills)

Skills for AI coding agents: code review, test writing, design docs, debugging, security audits, refactoring, and cleaning up AI-written code and text. Each skill is a folder with a `SKILL.md` in the [Agent Skills](https://agentskills.io) format, distilled from public collections and large open-source practice, then sharpened on real repositories.

Works with Claude Code, Claude.ai, OpenAI Codex, Gemini CLI, Cursor, GitHub Copilot, opencode, Amp, Windsurf, Antigravity, Kilo Code, Qwen Code, and any other agent that supports the standard.

## Contents

- [Awesome Agent Skills](#awesome-agent-skills)
  - [Contents](#contents)
  - [Quick start](#quick-start)
  - [Install as a plugin](#install-as-a-plugin)
  - [Skills](#skills)
    - [Code review](#code-review)
    - [Code quality and refactoring](#code-quality-and-refactoring)
    - [Testing](#testing)
    - [Design and planning](#design-and-planning)
    - [Understanding a codebase](#understanding-a-codebase)
    - [Debugging and reliability](#debugging-and-reliability)
    - [Audits](#audits)
    - [Git and repository operations](#git-and-repository-operations)
    - [Agent maintenance](#agent-maintenance)
    - [Writing and text](#writing-and-text)
    - [Content marketing](#content-marketing)
  - [Usage examples](#usage-examples)
  - [Skill dependencies](#skill-dependencies)
  - [Skill format](#skill-format)
  - [Contributing](#contributing)
  - [Related](#related)
  - [License](#license)

## Quick start

```bash
git clone https://github.com/khasky/awesome-agent-skills.git
cd awesome-agent-skills
npx skills add ./skills -g -s "*" -a claude-code codex gemini-cli -y
```

The [skills CLI](https://github.com/vercel-labs/skills) installs every skill globally into Claude Code, Codex, and Gemini CLI. Change `-a` to pick agents (`-a "*"` installs to every detected agent). To skip the clone, `npx skills add khasky/awesome-agent-skills` installs straight from GitHub.

Update with `git pull` in the clone, or `npx skills update -g` if the CLI copied instead of linking (check `ls -l ~/.agents/skills`: an entry with no link target is a copy). Re-run `skills add` to pick up new skills.

## Install as a plugin

The plugin installs every skill at once and updates with the repository. Pick the plugin or the Quick start, not both.

| Agent | Install | Update | Uninstall |
|---|---|---|---|
| Claude Code | `/plugin marketplace add khasky/awesome-agent-skills`, then `/plugin install awesome-agent-skills@awesome-agent-skills` | `/plugin marketplace update awesome-agent-skills`, or auto-update under `/plugin` → Marketplaces | `/plugin uninstall awesome-agent-skills@awesome-agent-skills` |
| Codex | `codex plugin marketplace add khasky/awesome-agent-skills`, then `codex plugin add awesome-agent-skills@awesome-agent-skills` | `codex plugin marketplace upgrade awesome-agent-skills`, then the `add` again | `codex plugin remove awesome-agent-skills@awesome-agent-skills` |
| GitHub Copilot CLI | `copilot plugin marketplace add khasky/awesome-agent-skills`, then `copilot plugin install awesome-agent-skills@awesome-agent-skills` | `copilot plugin update awesome-agent-skills` | `copilot plugin uninstall awesome-agent-skills` |
| Gemini CLI | `gemini extensions install https://github.com/khasky/awesome-agent-skills` (add `--auto-update` to follow the repository) | `gemini extensions update awesome-agent-skills` | `gemini extensions uninstall awesome-agent-skills` |
| Qwen Code | `qwen extensions install https://github.com/khasky/awesome-agent-skills` | `qwen extensions update awesome-agent-skills` | `qwen extensions uninstall awesome-agent-skills` |
| Cursor | `git clone https://github.com/khasky/awesome-agent-skills ~/.cursor/plugins/local/awesome-agent-skills`, then **Developer: Reload Window** | `git pull` in that folder | delete the folder |
| Antigravity CLI | clone the repository, then `agy plugin install <clone>` | `git pull` in the clone, then the `install` again | `agy plugin uninstall awesome-agent-skills` |
| Kilo Code CLI | clone the repository, then add its `skills` folder to `~/.config/kilo/kilo.jsonc`: `"skills": { "paths": ["C:/repos/awesome-agent-skills/skills"] }` | `git pull` in the clone | remove the path |

Qwen Code prefixes a plugin skill with the extension name: `awesome-agent-skills:awesome-code-review`. CI installs the plugin into Claude Code, Codex, Copilot CLI and Gemini CLI on every push; the other rows follow each agent's documentation.

## Skills

### Code review

| Skill | What it does |
| --- | --- |
| [awesome-code-review](skills/awesome-code-review) | Reviews diffs and PRs for correctness, security, and team standards |
| [awesome-code-review-feedback](skills/awesome-code-review-feedback) | Responds to review feedback: verify before implementing, clarify, push back with reasoning |
| [awesome-code-review-jury](skills/awesome-code-review-jury) | Second opinion: blind reviewers on different models, a judge that cross-examines them and returns one verdict |

### Code quality and refactoring

| Skill | What it does |
| --- | --- |
| [awesome-code-standards](skills/awesome-code-standards) | Naming, structure, and patterns for consistent code across a team |
| [awesome-code-cleanup](skills/awesome-code-cleanup) | Behavior-preserving cleanup of AI-like code noise: comments, dead code, vague names, over-abstraction |
| [awesome-dependency-upgrade](skills/awesome-dependency-upgrade) | Executes dependency upgrades in risk-classified batches, with changelog-driven majors and verification between steps |

### Testing

| Skill | What it does |
| --- | --- |
| [awesome-test-writing](skills/awesome-test-writing) | Designs and writes tests that catch real regressions, every test proven able to fail |
| [awesome-regression-sweep](skills/awesome-regression-sweep) | Read-only verification sweep against a recorded baseline: typecheck, lint, tests, wire contracts, deploy drift |
| [awesome-test-gap-audit](skills/awesome-test-gap-audit) | Read-only audit of missing, weak, stale or mis-scoped tests, ranked P0–P3, with a worklist for awesome-test-writing |

### Design and planning

| Skill | What it does |
| --- | --- |
| [awesome-design-doc](skills/awesome-design-doc) | Design docs and ADRs: requirements first, real alternatives, a grounded recommendation, non-goals and rollout |
| [awesome-api-design](skills/awesome-api-design) | Designs or reviews HTTP API shape before code: resources, versioning, pagination, idempotency |
| [awesome-plan-simplify](skills/awesome-plan-simplify) | Simplifies a written plan against the code it changes: over-engineering, redundant guards, contradictions, as ranked cuts |

### Understanding a codebase

| Skill | What it does |
| --- | --- |
| [awesome-code-explainer](skills/awesome-code-explainer) | Explains how a codebase works as one illustrated page: purpose, stack, structure, main flow, where to start reading, every claim cited |
| [awesome-code-docs](skills/awesome-code-docs) | Generates a full technical documentation set along the dependency graph: architecture, per-module and API reference, flows, operations, how-to guides |

### Debugging and reliability

| Skill | What it does |
| --- | --- |
| [awesome-bug-fix](skills/awesome-bug-fix) | Reproduce → isolate root cause → fix → verify; no random edits |
| [awesome-root-cause](skills/awesome-root-cause) | Root-cause analysis for incidents and process problems with no failing test: 5 Whys, fishbone, PDCA, A3 |
| [awesome-error-standards](skills/awesome-error-standards) | Consistent error handling, retries, and user-facing messages |
| [awesome-logging-standards](skills/awesome-logging-standards) | Structured logging, levels, and PII handling |

### Audits

All audits are read-only and end in a SHIP / FIX / BLOCK verdict where they gate a release.

| Skill | What it does |
| --- | --- |
| [awesome-architecture-audit](skills/awesome-architecture-audit) | Whole-project design: module boundaries, dependency direction, docs-vs-code drift, extensibility |
| [awesome-security-audit](skills/awesome-security-audit) | Injection, secrets, auth, dependency CVEs, CI/CD exposure, crypto misuse, with CWE-mapped fixes |
| [awesome-pentest](skills/awesome-pentest) | Authorization-gated penetration test per PTES and OWASP: scoping, recon, exploitation-to-proof, CWE/CVSS findings, retest |
| [awesome-leak-audit](skills/awesome-leak-audit) | What a public client (extension, app, SPA, CLI) reveals about the private backend; client hardening |
| [awesome-accessibility-audit](skills/awesome-accessibility-audit) | WCAG checks, each finding carrying its fix |
| [awesome-seo-audit](skills/awesome-seo-audit) | Crawling, indexing, on-page, structured data, rendering, hreflang, links, visibility to LLMs and agents |
| [awesome-performance-audit](skills/awesome-performance-audit) | Event loop, backpressure, memory and CPU, timeouts, retries, queues, Core Web Vitals, bundles |
| [awesome-database-audit](skills/awesome-database-audit) | Schema anti-patterns, query and index fit, integrity, concurrency, migrations, tenancy |
| [awesome-privacy-audit](skills/awesome-privacy-audit) | What personal data the code holds, where it flows, retention and deletion, consent, exposure |
| [awesome-dependency-audit](skills/awesome-dependency-audit) | Supply chain: lockfiles, typosquats, install scripts, CVE reachability, licenses |
| [awesome-landing-audit](skills/awesome-landing-audit) | Landing page conversion structure: primary CTA, form friction, message match, trust elements |
| [awesome-claims-audit](skills/awesome-claims-audit) | Public claims (site, README, store listing, privacy policy) against the code that decides them, then fixes drift |
| [awesome-slop-audit](skills/awesome-slop-audit) | AI-slop markers across code, tests, docs and CI, ranked and handed to awesome-code-cleanup |

### Git and repository operations

| Skill | What it does |
| --- | --- |
| [awesome-git-commit-plan](skills/awesome-git-commit-plan) | Plans a codebase as a bisectable commit series, each commit verified to build and test alone in a scratch clone |
| [awesome-git-history-reset](skills/awesome-git-history-reset) | Wipes a repo's history to a single Initial commit and force-pushes, behind a verified backup, secret scan and confirmation gate |
| [awesome-git-author-rewrite](skills/awesome-git-author-rewrite) | Rewrites a wrong author/committer identity across commits and force-pushes, behind the same gates |
| [awesome-git-history-rebuild](skills/awesome-git-history-rebuild) | Replays the same tree as a curated commit series from an approved plan, with a tree-hash proof that nothing was lost |
| [awesome-git-history-salvage](skills/awesome-git-history-salvage) | Read-only recovery of every commit a repo ever held, force-pushed history included |

### Agent maintenance

| Skill | What it does |
| --- | --- |
| [awesome-agents-md-generator](skills/awesome-agents-md-generator) | Writes an agent-agnostic `AGENTS.md` from the codebase's real commands, conventions and boundaries, with counted evidence |
| [awesome-skills-purge](skills/awesome-skills-purge) | Removes installed skills from every agent on the machine behind a keep list, an archive and a confirmation gate |

### Writing and text

| Skill | What it does |
| --- | --- |
| [awesome-copywriting](skills/awesome-copywriting) | Short product copy: headlines, descriptions, buttons, empty states, error messages, subject lines, CTAs |
| [awesome-humanize-en](skills/awesome-humanize-en) | Removes signs of AI generation from English text: cliches, filler, sycophancy, fake sources, chatbot markers |
| [awesome-document-style](skills/awesome-document-style) | Line-edits Markdown into clear, specific, publication-ready prose |
| [awesome-grammar-check](skills/awesome-grammar-check) | Advisory copy-edit: grammar, logic, and flow issues as suggestions, without rewriting |
| [awesome-translate-ru-en](skills/awesome-translate-ru-en) | Russian → English translation that preserves structure, formatting, and the author's voice |
| [awesome-style-mimic](skills/awesome-style-mimic) | Learns a website's writing style into a reusable style guide, then rewrites documents in that voice |

### Content marketing

| Skill | What it does |
| --- | --- |
| [awesome-content-voice](skills/awesome-content-voice) | Builds a reusable profile of the user's own writing voice from their posts, files, samples or an interview |
| [awesome-content-campaign](skills/awesome-content-campaign) | Plans a scheduled batch of platform-fit posts about a product, every claim traced to evidence |
| [awesome-content-repurpose](skills/awesome-content-repurpose) | Turns one text into three posts covering every platform: a long read, a regular and a short post |
| [awesome-content-image-adapter](skills/awesome-content-image-adapter) | Adapts one image into a horizontal 16:9 and a vertical 9:16 version for social platforms |
| [awesome-content-publisher](skills/awesome-content-publisher) | Publishes a post batch to the user's own accounts through their live browser, with dedup and scheduling |

## Usage examples

Skills trigger on intent, so plain requests work. Naming a skill makes the choice deterministic:

- "Use **awesome-code-review** on the diff against `main`."
- "**awesome-bug-fix** for this error: reproduce first, root cause before any fix — [paste logs]."
- "Audit this repo with **awesome-leak-audit** before we open-source it."
- "**awesome-humanize-en**: remove the AI voice from this draft."

They also chain: implement → **awesome-code-cleanup** → **awesome-code-review** before merge. Or: **awesome-content-campaign** → review the drafts → **awesome-content-publisher**.

The four skills that rewrite a published history or post to live accounts (**awesome-git-history-reset**, **awesome-git-history-rebuild**, **awesome-git-author-rewrite**, **awesome-content-publisher**) run only when you name them explicitly, never on a matching request alone.

## Skill dependencies

Some skills read a reference file that ships with another skill instead of keeping their own copy, so one vocabulary or platform table has one source. The plugin and the Quick start install every skill, and nothing breaks. Installing a single skill (`npx skills add ... -s <name>`) leaves these links dangling: install the skills in its row too.

| Skill | Reads from other skills |
| --- | --- |
| awesome-code-cleanup | `awesome-architecture-audit/references/design-vocabulary.md`, `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md` |
| awesome-code-standards | `awesome-humanize-en/references/lexicon.md` |
| awesome-content-campaign | `awesome-content-publisher/references/browser-interaction.md`, `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md` |
| awesome-content-image-adapter | `awesome-content-campaign/references/platforms.md` |
| awesome-content-publisher | `awesome-content-campaign/references/platforms.md`, `awesome-content-repurpose/references/authored-style.md`, `awesome-content-repurpose/references/forms.md` |
| awesome-content-repurpose | `awesome-content-campaign/references/platforms.md`, `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md` |
| awesome-content-voice | `awesome-content-publisher/references/browser-interaction.md` |
| awesome-document-style | `awesome-humanize-en/references/chatbot-artifacts.md`, `awesome-humanize-en/references/domain-*.md`, `awesome-humanize-en/references/language-patterns.md`, `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md`, `awesome-humanize-en/references/structural-style-patterns.md` |
| awesome-git-commit-plan | `awesome-humanize-en/references/lexicon.md` |
| awesome-grammar-check | `awesome-humanize-en/references/spelling-variants.md` |
| awesome-pentest | `awesome-security-audit/references/checklists.md` |
| awesome-root-cause | `awesome-humanize-en/references/domain-postmortems.md` |
| awesome-slop-audit | `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md` |
| awesome-style-mimic | `awesome-content-publisher/references/browser-interaction.md`, `awesome-humanize-en/references/spelling-variants.md` |
| awesome-test-writing | `awesome-architecture-audit/references/design-vocabulary.md` |
| awesome-translate-ru-en | `awesome-humanize-en/references/lexicon.md`, `awesome-humanize-en/references/spelling-variants.md` |

`scripts/lint.py` fails when this table and the links in the skills disagree.

## Skill format

Each skill follows the [Agent Skills specification](https://agentskills.io/specification):

```text
skills/<skill-name>/
├── SKILL.md          # required: YAML frontmatter (name, description) + instructions
└── references/       # optional: detailed docs the agent loads on demand
```

A skill is Markdown and nothing else: no scripts, templates or fixtures, so nothing here runs the author's code on your machine. The frontmatter `description` tells the agent when to activate; the body loads only on activation, and `references/` only when needed.

Reports share two vocabularies: findings are rated `Critical / High / Medium / Low / Informational`, and release-gating audits end in `SHIP / FIX / BLOCK`, paired with `NOT ASSESSED` for what could not be checked.

## Contributing

One gate, the same locally and in CI:

```bash
python3 scripts/lint.py          # run the gates by hand
python3 scripts/test_lint.py     # prove each gate fails on a broken copy
python3 scripts/install-hooks.py # once per clone: run them before every commit
```

Each skill went through three passes: a survey of public collections and documented practice (kernel patch rules, OWASP, WCAG, PTES, NIST SP 800-115), a distillation that keeps only what changes an agent's output, and rounds of use on real repositories. Skills are self-contained, portable, stack-agnostic, and end with the check that proves the claim.

## Related

- [Awesome AGENTS.md](https://github.com/khasky/awesome-agents-md) — the base, tool-agnostic ruleset every agent imports. Rules keep everyday work in line; skills here handle the jobs you name. Install both.
- [Agent MCP Integrations](https://github.com/khasky/agent-mcp-integrations) — MCP servers that connect agents to browsers, cloud, databases, infra, and domain APIs.
- [Claude Code Token Optimization](https://github.com/khasky/claude-code-token-optimization) — the token-efficiency layer.
- [Claude Code Security Audit](https://github.com/khasky/claude-code-security-audit) — the layered security-audit workflow.

## License

Released under the [MIT license](LICENSE). The [awesome-humanize-en](skills/awesome-humanize-en) skill adapts material from [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) and, for its venue rules, editing-trace tests and evidence ledger, from [sepia](https://github.com/Nanako0129/sepia); [awesome-seo-audit](skills/awesome-seo-audit) cross-checked its Google-policy detail against [claude-seo](https://github.com/AgriciDaniel/claude-seo), from which it also took the falsifiability line on every recommendation, the fix-ordering rule and the refusal of unsafe fetch targets, and took its collection mechanics from [on-page-seo](https://github.com/AgriciDaniel/on-page-seo); its two-axis verdict follows [claude-seo-ai](https://github.com/Hainrixz/claude-seo-ai) and its evidence-and-confidence contract follows [Agentic-SEO-Skill](https://github.com/Bhanunamikaze/Agentic-SEO-Skill). [awesome-agents-md-generator](skills/awesome-agents-md-generator) takes its section set and its differences-only nested files from [agentseed](https://github.com/avinshe/agentseed), and its file format from [agents.md](https://agents.md/). [awesome-code-explainer](skills/awesome-code-explainer) takes its signals-first method, its input forms and its reading-path and open-questions sections from [ExplainThisRepo](https://github.com/calchiwo/ExplainThisRepo). [awesome-code-docs](skills/awesome-code-docs) takes its dependency-graph method — symbol resolution, topological order, bottom-up summaries — from [AutoDocs](https://github.com/TrySita/AutoDocs).
