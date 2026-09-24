# Run memory - optional, never an answer key

The skill works from a clean install: no previous post set, no source-specific brief, no source-specific facts ship with it, and nothing about the output depends on memory being present.

## 1. Opt-in

A normal invocation ignores every runtime memory file. Only `--use-memory` reads them, and even then the six interview questions (language, idea, voice, emoji, creativity, footer) are asked again and no source-specific prose, title, link, anchor or brief is reused.

Files, all in the agent's scratch root under `repurpose/`, never in the invocation directory:

| File | Holds | Never holds |
| --- | --- | --- |
| `defaults.md` | platform subset, output folder preference, frontmatter link maximum | language, idea, voice, emoji, any source fact |
| `rules.md` | general writing rules learned from the user's corrections, each with its date and run slug | source facts, model sentences |
| `sources.md` | one line per finished run: fingerprint, source, date, output folder, fact-check date | previous wording, titles, links, briefs |
| `platform-cache.md` | volatile platform mechanics when explicitly checked: platform, fact, value, date, source URL | anything editorial |

## 2. `rules.md`

A correction becomes a rule when the user said it in words and it applies beyond this source: a pattern of what to do or avoid, never a sentence to reuse. Merge duplicates, replace contradictions and delete the replaced rule, consolidate past thirty. The packaged reference files outrank a stale runtime rule unless the user changed the rule after install.

## 3. `sources.md`

A fingerprint match tells the user the source was processed before and where the files went. It never loads the earlier output.

## 4. Out of scope

Publication time, timezone, attachments, alt text, publish status, queues and cadence are never remembered or written here. Presentation (openers, closings, proof sentences, titles) is regenerated every run from the source and the catalogs; semantic decisions may be stable, wording is not stored.
