---
name: awesome-document-style
description: "Clean and line-edit Markdown documents for clear, specific, publication-ready prose. Use when asked to de-bloat, de-template, remove chatbot artifacts, fix vague wording, settle whether numbers are written as digits or spelled out, or make Markdown read like careful human editorial writing. Do not use to fabricate facts or bypass detectors."
license: MIT
metadata:
  author: Khasky
  tags: ["writing", "editing", "markdown", "cleanup"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-document-style"
---

# Document Style

## Principle

Edit for clarity, specificity, continuity, and factual honesty.

Do not try to trick AI detectors. Do not add fake imperfections, fake anecdotes, slang, typos, or unsupported personal details. Preserve the author's meaning. If a claim is unsupported, narrow it, mark it as needing a source, or remove it.

## Input rules

- Work only on the Markdown document or file paths the user provides.
- Preserve YAML frontmatter, code blocks, commands, tables with real data, footnotes, links, and citations unless they are clearly broken.
- Do not invent sources, numbers, dates, author names, product features, benchmark results, quotes, or case studies.
- If a citation marker looks like an internal chatbot artifact, remove the artifact and keep or repair the underlying real citation only if it exists.
- If the document contains placeholders, either fill them from context or mark them as TODO. Do not leave publishing placeholders in final prose.

## Pass 1: Mechanical artifact cleanup

Search for and remove or flag these classes of artifacts:

- Unresolved chatbot citation and tool markers: `:contentReference[oaicite:N]`, `oai_citation:N`, `turn0search0` and its `turn\d+(search|fetch|file|image)\d+` siblings, `[cite_start]`, `[cite: N]`, `[attached_file:N]`, `grok_card://`, `vertexaisearch` grounding-redirect links.
- AI-tool URL parameters:
  - `utm_source=chatgpt.com`
  - `utm_source=openai`
  - `utm_source=claude.ai`
  - `utm_source=perplexity.ai`
  - `utm_source=copilot.com`
- Visible placeholders:
  - `[Your Name]`
  - `[INSERT SOURCE]`
  - `[Describe section]`
  - `2025-XX-XX`
  - HTML comments that say add, insert, fill, replace, or TODO
- Zero-width or invisible formatting characters.
- Chat UI leftovers:
  - “Certainly”
  - “Great question”
  - “I hope this helps”
  - “As an AI language model”
  - “Would you like me to”
  - “Here’s a polished version”

The markers above are enough to run this pass standalone. If the `awesome-humanize-en` skill is installed alongside this one, its `references/chatbot-artifacts.md` carries the full catalog — every marker with its regex, its source, and its false-positive boundary — and is worth opening for an unfamiliar marker or an ambiguous match.

## Pass 2: Markdown structure cleanup

- Keep Markdown simple and readable in plain text.
- Do not hard-wrap prose to a fixed column width. Keep each paragraph on a single continuous line of any length and let the editor soft-wrap — lines are not capped at 80, 100, or any other limit. Do not insert manual line breaks inside a paragraph, list item, or heading. If the document is already hard-wrapped at a fixed column (a common AI default of ~100 characters, which splits one sentence across several physical lines, breaks reading flow, and creates noisy diffs), reflow it: join the split lines back into one line per paragraph. Insert a line break only where Markdown needs one: between paragraphs, between list items, and around headings, code blocks, and tables.
- Use one `#` title only if the document needs it.
- Do not skip heading levels.
- Replace vague headings with specific headings.
  - Bad: `## Overview`
  - Better: `## How the retry queue handles failed payments`
  - Renaming a heading breaks its anchor links: check for inbound `#anchor` links and a TOC first; when they exist, flag the rename as a suggestion instead of applying it.
- Remove decorative horizontal rules unless they separate distinct document sections.
- Prefer straight quotes (`'` `"`) and a hyphen or comma-set clause over a gratuitous em-dash (`—`) in the prose you write or rewrite — flawless hand-set typography reads as machine output in plain text. Do not touch: quotes/dashes inside code, commands, or fenced blocks; a deliberate typographic document (a published/formatted article) where the style is consistent and intentional; or a glyph inside a quotation or proper name. Never convert to guillemets or any national style. This is about the characters, not meaning — do not change wording to remove a dash.
- Write a number a reader could count or verify as digits, not words — `9 supported sites`, `4 permissions`, `2 clicks`, `12 months` — including 0–9 and at the start of a sentence. A group of digits has a different shape from a group of letters, so it survives the scan that skips the words around it ([NN/g eyetracking](https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/)); spelled out, the same fact dissolves into the sentence. Headings, table cells, and any one-line summary take digits first — those are the lines a reader lands on.
  - Keep words where the number is not data: `one` as a pronoun or inside a fixed term (“one person, one vote”, “which one”, “one-time code”, “one-click”), a bare pronoun pair (“the two agree”, “all three”), vague scale used as rhetoric (“thousands of throwaway profiles”, “by the hundred”), and magnitudes whose zeros stop being readable (“24 billion”, not `24,000,000,000`).
  - Never mix the two forms in one sentence: “600 emoji, not six defaults” is the bug. When a rhetorical `one` sits next to the count, recast the sentence or leave both as words rather than digit-plus-word.
  - Keep one thousands separator per document (`50,000`, not `50 000` in one paragraph and `40,000` in the next), and hyphenate compound modifiers: `2-day-old post`, `6-digit code`.
  - The print style guides say the opposite for 1–9 (AP spells out one–nine, Chicago one–one hundred) because they are print rules. If the document declares a house style, or the author ran `awesome-grammar-check` with a `style-guide` argument, that declaration wins over this bullet — say which rule you applied.
- Remove excessive bold. Use bold for UI labels or essential emphasis only.
- Convert tiny tables into prose unless the table contains comparable data.
- Use ordered lists only for sequences. Use unordered lists only for genuinely parallel items.
- Collapse “Key Takeaways”, “In Summary”, and “Conclusion” sections unless they contain new information.

## Pass 3: Language cleanup

Remove filler, inflated importance, and generic AI-like phrasing.

Prefer:

- Concrete nouns over abstract labels.
- Active voice over passive voice.
- One precise verb over stacked modifiers.
- Specific evidence over “experts say”, “studies show”, or “many believe”.
- Short direct transitions over polished signposting.

Watch for and rewrite:

- Filler adverbs of ease: “simply”, “just”, “easily”, “obviously”, “of course”
- “It is important to note that...”
- “In today’s fast-paced landscape...”
- “This comprehensive guide explores...”
- “plays a crucial/pivotal/key role...”
- “underscores/highlights/showcases...”
- “robust/seamless/cutting-edge/innovative...”
- “not only X but also Y”
- “from X to Y” ranges used for drama rather than meaning
- forced groups of three
- vague positive endings such as “the future looks bright”
- prose narrating its last revision instead of the current state — “has been updated to”, “now uses”, “previously” (fine in changelogs and migration guides)
- summary-stamp openers as a move (any label announcing a summary before delivering it: “In conclusion”, “Here’s the TL;DR:”), and redundant plain-language restatement (“in other words…”, “put simply…”) that repeats an already-made point
- circular/tautological definitions (“the system enables users to use the functionality”) and noun stacking (“production-ready deployment system infrastructure”)

That list is the working bar for this pass. If `awesome-humanize-en` is installed alongside, its `references/language-patterns.md` extends it with the wider filler and cliché catalog, and `references/structural-style-patterns.md` (#16) covers the em-dash and bold-overuse policy behind Pass 2 — both with false-positive boundaries. Neither is required to finish this pass.

## Pass 4: Specificity and source discipline

For every paragraph, ask:

1. What concrete fact, instruction, example, or decision does this add?
2. Could this paragraph apply unchanged to 100 other documents?
3. Does the sentence claim more than the source or context supports?
4. Does it assert causation without evidence (post-hoc)? "Launched in Q3, so adoption rose" is a logic error — either supply the proof ("adoption rose 25% the next month, driven by the onboarding change") or downgrade to correlation. This is a repair that *adds evidence*, never a hedge.
5. Is the heading specific enough for a reader scanning the page?
6. Are names, filenames, variables, and section labels unambiguous?
7. Will this content drift? Screenshots, UI step lists, and hardcoded version numbers go stale fastest — flag them with a TODO comment if you cannot verify they are current.
8. Would a scanning reader find the answer in 15 seconds? Check the headings, code-block placement, and the first 100 words.

Intentional style deviations are not errors: sentence fragments in marketing copy or a deliberately punchy register may be the author's choice — ask before normalizing them.

If a paragraph adds no concrete information, delete it.

If a claim is too broad, narrow it.

If a source is missing, add:

`<!-- TODO: source needed for this claim. -->`

Do not hide uncertainty behind polished prose.

## Pass 5: Output format

Never hard-wrap paragraphs to a fixed width (see Pass 2): one paragraph is one line. If the input arrives already hard-wrapped, reflow it to that style — do not preserve the broken wrapping.

Before delivering, re-check that later passes did not undo earlier ones (e.g. a Pass 3 rewrite re-introducing a hard-wrapped line, a filler opener, or a placeholder).

If editing files:

- Modify the Markdown file directly.
- Return a concise summary of changes.
- Mention any TODOs or source gaps.
- Do not include a long explanation of your editing process.

If editing pasted text:

- Return the cleaned Markdown.
- Then add `## Editorial notes` with at most six short bullets.
- Do not include generic praise.

If the user asks for an audit trail:

- Return a change table `# | Original | Correction | Reason` instead of prose notes, separating objective fixes (artifacts, broken structure) from subjective suggestions (wording), so the author can accept or reject each edit.
- Lead with the **top 3–5 highest-impact fixes** (label them Critical / High / Medium) above the full table, so the author fixes what matters first.
