---
name: awesome-grammar-check
description: "Advisory copy-edit of prose — reports grammar, logic, and flow issues as suggestions without rewriting the text. Use when the user asks to 'check grammar', 'proofread', 'copy-edit', 'find errors in', or 'review the writing' of an article, email, doc, or post, and wants to keep control of the wording. Not for removing AI-generated voice/markers (use awesome-humanize-en) and not for rewriting or de-bloating Markdown in place (use awesome-document-style)."
license: MIT
metadata:
  author: Khasky
  tags: ["writing", "editing", "grammar", "proofreading", "copy-edit"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-grammar-check"
---

# Grammar Check

Advisory copy-editor. It **suggests, it does not rewrite** — the author keeps the pen. It scans prose across three named categories, returns located fixes with a reason, leads with the few that matter, and checks the text against its own purpose.

This is the correctness/clarity lane, distinct from its siblings:
- Removing AI-generation tells (clichés, artifacts, machine rhythm) → **awesome-humanize-en**.
- Rewriting or de-bloating a Markdown document in place → **awesome-document-style**.
- awesome-grammar-check never rewrites the whole text and never removes "AI voice" — it flags concrete errors and hands them back.

## Inputs

The user provides text (pasted or a file path) and, optionally:
- `objective` — what the text is for (persuade investors, explain a feature, onboard a user). Judged at the end.
- `audience` — who reads it (sets the register bar).
- `style-guide` — AP or Chicago (drives Oxford comma, numerals, capitalization). Default: infer from the text, note the assumption.
- `variant` — US / UK / AU English. Regional spellings are consistency, not errors.

## Three-category scan

Run all three; a real edit usually surfaces items in each.

### 1. Grammar (mechanics)
Subject-verb agreement, tense consistency and drift, pronoun agreement and vague reference ("it"/"this" with no clear antecedent), comma splices and run-ons, dangling/misplaced modifiers, homophones (their/there, its/it's, affect/effect), parallelism in lists, article and preposition slips, punctuation inside/outside quotes per the style guide.

### 2. Logic
The highest-value category and the one generic proofreaders miss:
- **Unsupported claim** — a factual assertion with no basis. Fix by adding the number/proof, or narrow the claim.
- **Causation without evidence (post-hoc)** — "launched in Q3, so adoption rose" states cause from sequence. Fix by supplying the mechanism/number ("adoption rose 25% the next month, driven by the onboarding change") or downgrading to correlation. The repair **adds evidence, never a hedge**.
- **Contradiction** — two statements that can't both hold; flag the pair.
- **Vague quantifier** — "many", "significantly", "most users" with nothing behind it → ask for the figure or cut the intensifier.

### 3. Flow
Missing or jarring transitions, choppy runs of same-length sentences, overuse of the passive where an actor exists, buried lede (the point arrives three sentences late), redundancy (the same idea restated), and jargon the stated audience won't parse.

## What NOT to flag

- Intentional sentence fragments and a punchy register in marketing/creative copy — ask before "correcting" style.
- Rhetorical devices (deliberate repetition, a one-word sentence for emphasis).
- Regional-variant spellings that are internally consistent (colour vs color) — flag only a *mix* within one document.
- Informal register in a message or a personal note — grammar rules bend by genre.
- Code, commands, identifiers, quotations, and foreign-language spans — out of scope; leave them.
- Under ~40 words: give grammar/logic notes if any, but skip a readability verdict — the sample is too short.

## Output

1. **Summary line** — error counts by category (Grammar N · Logic N · Flow N), and whether the text reads as ready / needs-work.
2. **Top 3–5 fixes** — the highest-impact ones first, each labeled **Critical / Important / Minor**, so the author fixes what matters before the long tail.
3. **Full table** — `# | Location (quote) | Category | Issue | Suggested fix | Why`. Keep the suggestion minimal and quote the span; do not rewrite surrounding text. Explain the "Why" in plain terms, no grammar jargon the author would have to look up.
4. **Objective/tone check** (only if `objective` was given) — one line on whether the text serves its purpose and the tone fits the audience.

Advisory mode is the default and the only mode: return the list, never a rewritten document. If the user then says "apply them", apply only the fixes they name.

## Self-check before sending

- Every item is a real error or a clearly-labeled subjective suggestion — not a style preference dressed as a rule.
- Objective errors and subjective suggestions are visibly separated.
- Nothing inside code/quotes/foreign spans was flagged.
- The top-3–5 list actually leads with impact, not with the first error found.
