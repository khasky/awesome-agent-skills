# Unambiguous markers — traces of copy-paste from chatbots

English Wikipedia §6 "Markup" and §7 "Citations". These are **unambiguous tells**: one such marker in text written outside a programmer's technical documentation means the text was almost certainly copied from an AI answer without review.

This file holds the tells that are caught by regular expressions. The sibling `llm-fingerprints.md` holds the soft stylistic tells of specific models, which work only in combination. The empirical verification of the regexes in this file is in `test-fixtures.md`.

> When to load: when copy-paste from a chat is suspected, when working with publishable text, when editing an article before publishing to Wikipedia or a blog, when checking any text that claims independent authorship.

---

## A. Current model generation (2025–2026)

### A.1. OpenAI internal citation tags

| Marker | What it is | Regular expression |
|---|---|---|
| `:contentReference[oaicite:N]{index=N}` | Internal citation tag in ChatGPT output | `:contentReference\[oaicite:\d+\]\{index=\d+\}` |
| `oai_citation:N‡title` | Alternative internal-citation format | `oai_citation:\d+‡` |
| `oaicite:N` | Truncated form of the tag | `oaicite:\d+` |

**Source:** English Wikipedia §6.4.

**What to do.** Remove entirely; format the citations in the text by hand, verifying the source.

---

### A.2. OpenAI web-search tags

| Marker | What it is | Regular expression |
|---|---|---|
| `turn0search0`, `turnNsearchN` | Search-result identifier in ChatGPT internal links | `turn\d+search\d+` |
| `turn0fetch0`, `turnNfetchN` | Fetched-page identifier | `turn\d+fetch\d+` |
| `turn0file2`, `turnNfileN` | file_search chunk identifier; surfaces in text as `fileciteturn0file2` or the doubled `fileciteturn0file2turn0file6` | `turn\d+file\d+` |

**Source:** English Wikipedia §6.3; OpenAI developer forum (October 2025) — file_search markers leak into finished text regularly, especially with structured output; strongest on GPT-5.2.

**What to do.** Find the real source links, verify they open and support the claims, and substitute them. Doubled `turn…file…` markers run together with no space — delete the whole chain, not just the first one.

---

### A.3. Chatbot UTM tags

Links inside the text often carry UTM tags added by the chatbot itself for tracking.

| Marker | Who adds it | Regular expression |
|---|---|---|
| `?utm_source=chatgpt.com` | OpenAI ChatGPT (web and app) | `[?&]utm_source=chatgpt\.com` |
| `?utm_source=openai` | OpenAI tools (generic API format) | `[?&]utm_source=openai` |

**Source:** English Wikipedia §7.6.

**What to do.** Remove the UTM parameter from the link, verify it still resolves to the same place, and keep the clean address.

---

### A.4. Attachment and card tags

| Marker | Who adds it | Regular expression |
|---|---|---|
| `attached_file://path` | OpenAI ChatGPT when files are uploaded | `attached_file:\/\/` |
| `grok_card://id` | xAI Grok when referencing an X (formerly Twitter) post card | `grok_card:\/\/` |
| `vertexaisearch.cloud.google.com/grounding-api-redirect/` | Google Gemini, grounded web-search links | `vertexaisearch\.cloud\.google\.com/grounding-api-redirect` |

**What to do.** Replace with the real source, or delete the link and restate the claim without it.

---

### A.5. Other markup markers

| Marker | What it is | Regular expression |
|---|---|---|
| `attribution`, `attributableIndex` | Internal markup fields in JSON tool responses | `\battributableIndex\b` |
| `[citation:N]` with no later definition | Perplexity and other search-AI style | `\[citation:\d+\]` |

**False-positive boundary.** `[1]:`, `[2]:` in text can be normal Markdown reference-link markup. Flag only if there is no matching footnote list at the end of the document.

---

### A.6. New-platform markers

Formats that appeared or became common in 2025–2026. Each is confirmed by an external source and run through the fixtures in `test-fixtures.md`.

| Marker | Who leaves it | Regular expression |
|---|---|---|
| `[^N^]` | Microsoft Copilot and Bing: footnote link on copy of an answer | `\[\^\d+\^\]` |
| `【N†source】`, `【N:M†source】` | OpenAI Assistants (file search): citation marker, corner brackets + dagger | `【\d+(?::\d+)?†source】` |
| `citeturn0file0`, `citeturn2search5` | ChatGPT: control citation marker that reached the text on copy from the stream | `citeturn\d+[a-z]+\d+` |
| `](sandbox:/mnt/data/…)` | ChatGPT (data analysis): broken download link to a file in the container | `\]\(sandbox:/mnt/data/` |

**Sources.** Microsoft Learn (Copilot footnote format); OpenAI documentation and developer discussions (the `【N†source】` file-search marker, the `citeturn` stream); OpenAI help and community (the `sandbox:/mnt/data/` link when the download button fails to render).

**False-positive boundaries.**

- `[^N^]` — the double `^` insertion is required. A normal Markdown footnote `[^1]` (single `^`) is valid markup, not a tell. The regex requires `^` on both sides of the number. In programmers' Markdown files (README, docs) the marker `[^1^]` can appear when a Copilot citation is quoted and then hand-edited — in that case treat it as a soft signal, not unambiguous, and require a combination with other tells.
- `【…】` — corner brackets alone occur in Japanese text and in decorative styling. The tell is only the run "number + dagger `†` + `source`" inside them.
- `citeturn` — the joined spelling is caught. A phrase with spaces ("cite, then turn to…") does not trigger.
- `sandbox:/mnt/data/` — only counts as a tell inside a Markdown link `](sandbox:/mnt/data/…)`. The words "sandbox" and "/mnt/data" separately in technical text are fine.

**What to do.** Remove the marker. For `sandbox:/mnt/data/`, ask the author for the file itself or its contents — the link is dead outside the ChatGPT session where the file was created.

---

### A.7. Invisible and control characters

Markers that are invisible to the eye when reading, but survive copy-paste and unambiguously give away the origin of the text.

| Marker | Who leaves it | Regular expression |
|---|---|---|
| Unicode chars `U+E200`–`U+E204` (private use area) | OpenAI ChatGPT: control separators for citations and hidden blocks | `[\ue200-\ue204]` |
| `<think>…</think>` — leftover reasoning tag | DeepSeek R1/V4 and other open models with a reasoning mode (via API and local run) | `</?think>` |

**On the `U+E200`–`U+E204` chars.** ChatGPT wraps internal citations in invisible control characters: `\ue200` — start of a reference block, `\ue201` — end, `\ue202` — data type, `\ue203`/`\ue204` — bounds of hidden content. In copied text the marker looks like `\ue200cite\ue202turn0search3\ue201` — the characters are invisible, the text seems clean. Important: in this form the word `citeturn` is broken by the char `\ue202`, so the regex `citeturn\d+[a-z]+\d+` from section A.6 does **not** catch it — you need the range `[\ue200-\ue204]`. Confirmed by analysis of OpenAI conversation exports and developer discussions on the OpenAI forum.

**On `<think>`.** Models with an exposed reasoning trace (DeepSeek R1 and successors, distillations onto Llama/Qwen) emit reasoning inside `<think>…</think>` tags. When copied out of "raw" interfaces (API, local run, half-finished wrappers), the tag or its closing half is left in the text. This is a formalization of a tell already described in `llm-fingerprints.md` (DeepSeek section): "reasoning traces left in the output."

**False-positive boundaries.**

- The Unicode private-use area (`U+E000`–`U+F8FF`) is used by icon fonts: text pulled from a web page may contain icon characters. Only the narrow range `U+E200`–`U+E204` counts as a tell; other characters in the area are not.
- `<think>` in an article **about** language models, in code, or in technical documentation is a quotation or an example, not a tell. The signal works in connected prose that is not about how neural networks are built.

**What to do.** Delete invisible characters (after deletion, run A.2/A.6 — `turn…` markers are usually nearby). Delete the `<think>…</think>` block whole, contents included: the reasoning was not meant for publication.

---

### A.8. "Source+digit" run-ons

A link render error in ChatGPT: instead of a footnote, the source name concatenated with a number reaches the text — `Wikipedia+1`, and with several sources a whole chain with no spaces: `IT Governance+3ISO+3ISO+3`, `Microsoft Learn+3Google Cloud+3`. Described in English Wikipedia ("Signs of AI writing", the section on citation-markup errors) next to the already-familiar `contentReference` and `oai_citation`.

| Marker | Who leaves it | Regular expression |
|---|---|---|
| Run-on `Name+digitName+digit` | OpenAI ChatGPT: footnote render error | `[A-Za-z)]\+\d+[A-Z]` |

The regex catches only the **concatenated** form: a number followed immediately by the capital letter of the next source. That is what makes it unambiguous.

**False-positive boundaries.**

- The single form (`Wikipedia+1.` at the end of a sentence) is not caught by the regex — deliberately: "word+number" occurs in math, versions, and tiers ("C++11", "the x+1 formula", "5+ for effort"). Look for the single form by eye: the name of a known site or publication glued to `+1`/`+2`/`+3`, in text that cites sources, is almost certainly the same artifact.
- Model and product names of the form `digit+digit` ("A52+128 GB") do not trigger: there must be a letter before the plus and a capital letter after the number.

**What to do.** Delete the run-on whole and verify the claim it was attached to: the source link is gone from the text, and the fact is left unsupported.

---

### A.9. Gemini citation tags

When analyzing uploaded documents (especially PDFs), Gemini inserts internal source-anchor tags. On copy of the answer they "leak" into the text.

| Marker | Who leaves it | Regular expression |
|---|---|---|
| `[cite_start]` at the start of sentences | Google Gemini: internal marker for the start of a cited fragment during PDF analysis | `\[cite_start\]` |
| `[cite: 8]`, `[Cite: 12]` after claims | Google Gemini: reference to a source fragment | `\[[Cc]ite:\s?\d+\]` |

**Confirmation.** The official Google Gemini support forum (thread "How do I get Gemini to stop adding `[cite_start]`…", June 2025, platinum-expert reply): the marker is part of the citation mechanism that "leaks" into the output, most often with the Google Workspace extension enabled. The existence of a whole class of scrubber utilities (for example the Chrome extension "Gemini AI Cite Scrubber" that strips `[Cite: 8]`) confirms how widespread the artifact is.

**False-positive boundaries.**

- The Wikipedia template `[citation needed]` and the DeepSeek marker `[citation:3]` do not match the regexes (they have their own rules — see A.5).
- The word "cite" in code or BibTeX/LaTeX documentation (`\cite{smith2024}`) uses curly braces, not square; does not trigger.

**What to do.** Delete the markers. As in A.8: the claim the marker was attached to is left unsupported — verify the fact or find the real source.

---

### A.10. Non-standard spaces and Unicode watermarks

From August 2, 2026, Article 50 of the EU AI Act applies: the output of generative systems must be "machine-detectable" (the code of practice was published June 10, 2026). The expected consequence is a rise in invisible text marking. Two mechanisms already observed:

| Marker | Who leaves it | Regular expression |
|---|---|---|
| Zero-width characters `U+200B`–`U+200D`, `U+2060`, `U+FEFF` in connected text | OpenAI o3/o4-mini and successors (spring 2025 observations); also seen in other models | `[\u200b-\u200d\u2060\ufeff]` |
| Homoglyph spaces: narrow no-break `U+202F`, thin `U+2009`, `U+2004`, ideographic `U+3000` instead of a normal space | Seen in long ChatGPT o3/o4-mini answers (Rumi analysis, April 2025; OpenAI called it "a side effect of reinforcement learning") | 🟡 manual review only, not in the regex run |

**On zero-width characters.** Invisible to the eye, they survive copy-paste (including into Google Docs). In text typed by a human in an editor or a messenger, there is nowhere for them to come from. The regex is included in the automated `check_markers.py` run.

**On homoglyph spaces.** They look like a normal space and differ only by code. Single occurrences mean nothing; the tell is a systematic pattern (for example, every Nth space replaced). Deliberately not in the regex run — the false-positive risk is too high (see the boundaries).

**False-positive boundaries.**

- `U+202F` is standard in French typography (before `;`, `!`, `?`) and in professional layout; Word and InDesign insert narrow no-break spaces automatically. Text from layout or from a French translator is not a tell.
- Zero-width characters occur in text pulled from a web CMS (line-break hints) and in the emails of some mailing services (recipient marking). Before ruling — ask where the text came from.
- `U+FEFF` at the very start of a file is a BOM (byte-order mark), an encoding artifact, not AI.
- The Google SynthID watermark works at the word-choice level, leaves no invisible characters, and is removed by paraphrase — its presence is not checked by this section.

**What to do.** Delete the invisible characters (normalize the spaces), then run A.2/A.6/A.7 — `turn…` markers may remain nearby. Remember: their absence proves nothing, and removing such marking is trivial.

---

## B. The old generation (2023–2024)

Kept unchanged (no regressions). Rarer in the modern corpus, but still common in old blogs, on forums, and in student papers.

| Marker | Who leaves it | Source |
|---|---|---|
| "As of my last knowledge update…" | OpenAI GPT-3.5/4 (2023) | Eng. Wikipedia §12.1 |
| "I cannot browse the internet" in phrases that claim to be current | OpenAI GPT-3.5 | Eng. Wikipedia §5.2 |
| "As of my knowledge cutoff in [Sept 2021 / Jan 2022 / Apr 2023]" | OpenAI GPT-3.5/4 | Eng. Wikipedia §5.2 |
| "I'm sorry, but as an AI language model…" | early OpenAI GPT-3.5 releases | Eng. Wikipedia §12.3 |
| "As a large language model, I cannot…" | early GPT-3.5/4 disclaimers | Eng. Wikipedia §12.3 |
| `&#8217;`, `&#8220;`, `&#8221;` — HTML entities instead of punctuation | old models from various vendors | Eng. Wikipedia — the section on broken markup |

---

## C. Dialogue imitation in discussions

**Source:** English Wikipedia, the "Talk pages" observations.

When articles are nominated for deletion, editors (often newcomers) try to defend their position with the help of AI. It shows in templated phrases:

- "Subject: Request to edit a Wikipedia article"
- "Dear Wikipedia editors,"
- "I hope this message finds you well."
- "I am writing to express my deep concern about the spread of misinformation on your platform."
- "I have identified an area of the article that requires an update/improvement."

**What to do.** If this shows up in an edit discussion or in an email — it is almost certainly a full AI answer, not edited by a human. Better to write your own text from scratch.

---

## D. Broken markup as a tell

| Marker | What it is | Where to read more |
|---|---|---|
| Mixing Markdown and wikitext in one text | AI switches between the two markups, losing the thread | Eng. Wikipedia §6.2 "Broken wikitext" |
| `[[Category:...]]`, `{{template}}` in text not meant for Wikipedia | AI leaves wiki-markup code in ordinary text | Eng. Wikipedia §6.6 "Non-existent or out-of-place categories" |
| Horizontal rules `---` before every heading | A calque of the chatbot's built-in formatting rules | Eng. Wikipedia §4.8 |

---

## Links to other files

| If a marker is found from | Immediately check |
|---|---|
| Section A (current generation) | `source-fabrication.md` — fabricated source links are often nearby |
| Section B (old generation) | `communication-patterns.md` #23 — related to knowledge-limit disclaimers |
| Section C (discussions) | `communication-patterns.md` #22 — related to leftover chat turns |
| Section D (broken markup) | `structural-style-patterns.md` #20–21 — related to Markdown residue |

---

## The principle of using regular expressions

All the regexes above are verified empirically — see `test-fixtures.md`. Each regex passed three levels of checking:

1. **Positive sample.** The regex finds the marker in real AI output.
2. **Negative sample.** The regex does not trigger on similar text unrelated to AI (programmer documentation, a quotation from an English article).
3. **Boundary sample.** The regex does not break on empty strings, multiple matches, Unicode.

If a new regex is added to the skill — it must pass these three checks before publication.
