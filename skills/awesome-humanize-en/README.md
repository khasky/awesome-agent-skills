# awesome-humanize-en

Removes the traces of machine generation from English text. English adaptation of [humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) by Vladimir-Human (MIT); the pattern catalog and file architecture originate in that project and are adapted and rewritten here for English.

Detects and fixes 36 patterns of machine-written English (25 base + 11 extensions), built on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) and [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup). `SKILL.md` is a map with a decision tree; the full pattern descriptions load on demand from `references/`.

## Folder map

| Path | What's inside |
|---|---|
| `SKILL.md` | Map, decision tree, severity scale, pre-submit checklist |
| `references/content-patterns.md` | Content patterns: averaging, inflated significance, vague attributions |
| `references/language-patterns.md` | Language patterns: AI vocabulary, rule of three, hedging, formulaic collocations |
| `references/structural-style-patterns.md` | Structure and style: em-dashes, emoji lists, Markdown residue, boilerplate headings |
| `references/communication-patterns.md` | Chat leftovers: sycophancy, disclaimers, generic conclusions |
| `references/chatbot-artifacts.md` | Unambiguous copy-paste markers with regexes (`:contentReference`, `?utm_source=chatgpt.com`, `[cite_start]`, zero-width chars, …) |
| `references/source-fabrication.md` | Citation checks: dead DOIs, non-existent ISBNs, impossible dates |
| `references/false-positives.md` | What is NOT an AI tell (fiction, legal, academic registers) |
| `references/llm-fingerprints.md` | Stylistic tells by vendor, current as of July 2026 |
| `references/test-fixtures.md` | Reference samples for every regex |
| `scripts/check_markers.py` | Runs every regex over samples; `--scan file.md` checks arbitrary text |

## Usage

```text
/awesome-humanize-en [paste text]
```

Or naturally: "Humanize this text", "remove the AI voice", "check this for AI".

**Before:**

> 🚀 **Innovation:** This software is undoubtedly a testament to our commitment to quality. Moreover, it delivers a seamless, intuitive, and powerful user experience — ensuring efficiency. Experts believe this is a revolution.

**After:**

> We added batch processing, keyboard shortcuts, and offline mode. Testers say tasks finish faster.

Installation for every agent is covered in the [repo root README](../../README.md#install).
