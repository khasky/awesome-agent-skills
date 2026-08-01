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

## Rating vocabularies

Two, so two reports never mean different things by the same word:

- **Findings** — `Critical / High / Medium / Low / Informational`, rated on impact and reachability. Use only the top three where the lower tiers carry no meaning.
- **Verdict** — `SHIP / FIX / BLOCK` for audits that gate a release, always paired with `NOT ASSESSED`.

`awesome-code-review` keeps its own reviewer-comment buckets (`Critical / Suggestions / Nice to have`) because those address an author, not a release gate. Do not invent a fourth scale.

## Deliberate duplication

Skills are self-contained: each one is installed and read alone, so a rule that must fire in two skills is written in both. That is a design choice, not drift — do not "fix" it by extracting a shared file. What is not acceptable is two skills contradicting each other; when a shared rule changes, update every copy in the same PR.

## Verification

Every skill ends in a check that proves its own claim: the command to run, the output to read, and only then the conclusion. A skill that produces findings says how each one would be confirmed or killed; a skill that changes code names the test that fails without the change.

## Before opening a PR

CI runs these — running them locally takes seconds:

- Frontmatter is valid: `name` matches the folder, `description` present, ≤1024 chars, balanced quoting, `license` and `metadata` present.
- The skill count matches `skills/`, the README table, the README install line, and `llms.txt` — a new skill is added to all three.
- Code fences are balanced, and every `skills/<name>` link in the catalogue resolves.
- `python3 skills/awesome-humanize-en/scripts/check_markers.py` passes.

State in the PR which repeated engineering task the skill covers and which existing skill you checked it against first.
