# Contributing

## When a new skill is justified

The collection is deliberately small — a set an author can hold in their head, not a hundred micro-skills nobody remembers. Before proposing one, answer both:

1. **Does an existing skill already cover it?** A new *section* inside `awesome-security-audit` beats a new skill that fires on the same request. Add the skill only when the trigger space is genuinely different — a user asking for it would not think to ask for the existing one.
2. **Is the trigger describable in one sentence a model can match?** If the activation condition needs a paragraph of "it depends", the skill is really two skills or none.

A new skill must also say what it is *not* for, naming the sibling that handles that case. Overlapping descriptions are how an agent picks the wrong skill.

## Frontmatter contract

```yaml
---
name: awesome-<topic>            # identical to the folder name — CI checks this
description: "<capability>. Use when <triggers, including phrases a user would type>. Do not use for <case> — use <sibling skill>."
license: MIT
metadata:
  author: <name>
  tags: ["…"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-<topic>"
---
```

- The `description` is the only thing an agent sees before activation: it carries the triggers, including quoted user phrasings and any non-English ones the skill supports.
- Keep it under 1024 characters (CI checks) and quote it whenever it contains a colon.

## Structure

Two body templates are in use — follow whichever matches the skill:

- **Process skills** (standards, review, debugging): mission line → When to Activate → Work Process as numbered phases → domain checklists → Output Format with a populated example → verification/checklist → Anti-patterns.
- **Read-only audits** (landing, performance, SEO): scope and method → tracks or mechanics → *What not to flag* → Output with a verdict, per-finding evidence, and an explicit `NOT ASSESSED` for anything unchecked.

Every audit skill needs a *What not to flag* section. False positives are the failure mode that makes a report unusable, and they are cheaper to prevent in the skill than to argue about in review.

## Framework- and stack-agnostic

A skill is installed once and fires on whatever repo the user happens to be in. It must be useful there. The rule:

**A skill is stack-agnostic unless its domain *is* a stack — and where the domain is a stack, the description says so.**

A *domain* boundary is legitimate: `awesome-accessibility-audit`, `awesome-seo-audit`, and `awesome-landing-audit` are about the web because accessibility, search indexing, and landing pages are web things; `awesome-git-history-reset` is about git because that is the artifact it rewrites. A *stack* boundary inside a general domain is not: error handling, logging, naming, dependency risk, and client hardening exist in every language, so a skill covering them may not be a TypeScript skill wearing a general title.

### Three patterns that satisfy it

Reuse whichever fits; all three are already in the collection, so match the incumbent shape rather than inventing a fourth.

1. **The "other runtimes" line** — a section whose mechanism is runtime-bound ends with one bullet mapping the same rule onto the other runtimes. `awesome-performance-audit` does this per track (`**Other runtimes** — same finding, different mechanism: thread-pool starvation (JVM, .NET), a blocked async executor (asyncio, tokio), GIL-bound workers`), and `awesome-code-standards` does it per core section.
2. **The detect-the-stack step** — the method's early phase reads the indicator files and picks the applicable checks before any checking starts. `awesome-security-audit` step 3: `Indicator files (package.json, requirements.txt, go.mod, framework configs) tell you which checks matter`. `awesome-dependency-audit` names its six ecosystems in step 1; `awesome-db-audit` requires naming the engine and version and marking engine-specific findings.
3. **The mechanism-file split** — when one platform's mechanisms would otherwise dominate a checklist, the rules go in the main file runtime-independently and the platform mechanics go in their own `references/` file, loaded only when that platform is the target. `awesome-leak-audit` splits `client-hardening.md` (rules) from `browser-client.md` (browser mechanisms).

### What a reviewer checks

- **Examples don't all share one language.** A single language may carry the worked example, but then the rule around it gets the per-language mapping. Count the code fences: all one language in a skill whose title says "universal" is the failure.
- **The description doesn't claim wider coverage than the body delivers.** If the frontmatter says "extension, mobile app, SPA, CLI, SDK", a CLI author has to get something out of the body. Narrow the description or widen the body — a description writing cheques the body doesn't cash is the bug.
- **Vendor tooling names its alternative.** A skill that leans on a host CLI (`gh`, `glab`) or a vendor API gives the equivalent for the other hosts, or declares that gate **unavailable** for them — never silently passed. Same for package managers, formatters, and test runners: `tsc --noEmit` is fine as an example when it reads "or the project's equivalent".
- **Anything genuinely universal stays unqualified.** Don't bolt a per-language list onto a rule that has no per-language variation — that's noise, and it dilutes the lines that carry real mapping.

**Half of this is enforced in CI, half in review.** The `single-language skills carry a per-language mapping` job fails a skill with three or more worked examples that are all in one language and no `Other languages`/`Other runtimes` block — that is the failure mode that actually happened, so it has a guard. The threshold is deliberate: one or two examples may sit in a single language. Everything else — a description claiming wider coverage than the body delivers, a vendor CLI with no named alternative, a per-language list bolted onto a rule that has no per-language variation — is a review check. If a PR trips one of those, say so in review with the specific section and the pattern above that fixes it.

## Rating vocabularies

Two, so two reports never mean different things by the same word:

- **Findings** — `Critical / High / Medium / Low / Informational`, rated on impact and reachability. Use only the top three where the lower tiers carry no meaning.
- **Verdict** — `SHIP / FIX / BLOCK` for audits that gate a release, always paired with `NOT ASSESSED`.

`awesome-code-review` keeps its own reviewer-comment buckets (`Critical / Suggestions / Nice to have`) because those address an author, not a release gate. Do not invent a fourth scale.

Confidence is separate from severity, and three scales are sanctioned — each tied to what it gates: `awesome-code-review` scores findings 1–10 (≤6 becomes a question, not a finding); `awesome-security-audit` uses High/Medium buckets (Medium goes to "Needs verification"); `awesome-code-cleanup` uses Strong / Worth exploring / Speculative for refactor leads. A new skill reuses whichever of these matches its gating need — it does not invent a fourth confidence scale either.

## Deliberate duplication

Skills are self-contained: each one is installed and read alone, so a rule that must fire in two skills is written in both. That is a design choice, not drift — do not "fix" it by extracting a shared file. What is not acceptable is two skills contradicting each other; when a shared rule changes, update every copy in the same PR.

## Verification

Every skill ends in a check that proves its own claim: the command to run, the output to read, and only then the conclusion. A skill that produces findings says how each one would be confirmed or killed; a skill that changes code names the test that fails without the change.

## Before opening a PR

CI runs these — running them locally takes seconds:

- Frontmatter is valid: `name` matches the folder, `description` present, ≤1024 chars, balanced quoting, `license` and `metadata` present.
- The skill count matches `skills/`, the README table, the README install line, and `llms.txt` — a new skill is added to all three.
- Code fences are balanced, and every `skills/<name>` link in the catalogue resolves.
- Every `awesome-*` skill named inside a skill body resolves to an existing skill folder, and every `references/`/`scripts/` file a `SKILL.md` names exists on disk.
- Single-language skills carry a per-language mapping: three or more same-language examples require an `Other languages`/`Other runtimes` block.
- The two `leak-sweep` scripts (`.sh`/`.ps1`) keep identical category labels.
- `python3 skills/awesome-humanize-en/scripts/check_markers.py` passes.

State in the PR which repeated engineering task the skill covers and which existing skill you checked it against first.
