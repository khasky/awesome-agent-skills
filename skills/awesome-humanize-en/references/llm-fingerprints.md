# Large language model fingerprints — state as of July 2, 2026

This file is a reference to the characteristic tells of individual models. Signals fall into two levels:

- **Unambiguous markers** (identify AI with roughly 99% probability) — all collected in `chatbot-artifacts.md`. These are regular expressions for internal-citation tags, UTM tags, and the names of internal tools.
- **Stylistic tells** (soft signals, must be combined) — collected in this file. These are lexis, syntax, structural preferences. **For English text these stylistic tells are the primary signal:** the marker phrases below (e.g. "It's important to note that…", "delve into", "tapestry", emoji bullets) are themselves the evidence, not a translation layer over some other language.

Tells evolve every 6–8 weeks as new model versions ship. **Freshness of this file: through August 31, 2026**, after which reassessment is mandatory.

> When to load: when working with fresh 2025–2026 text; when you need to tell which model produced a text; when preparing regexes for batch processing.

> **Note on file structure.** This reference is deliberately built symmetrically: each vendor follows one template (release dates → tells table → typical openers). The symmetry here is navigational convenience, not a generation signal. Do not confuse it with pattern #13 "symmetric sections" from `language-patterns.md`, where symmetry inside authored content is treated as an AI tell.

> **Scientific confirmation of the approach.** The very idea that "each model has its own hand" is now backed by research: Sun et al. ("Idiosyncrasies in Large Language Models", arXiv:2502.12150) showed that models are as distinguishable by style as people are by idiolect. Among the confirmed cross-family differences: ChatGPT and Grok tend to drift into "broad context" and write longer; Gemini and Claude answer noticeably more tersely. What is typical of GPT-5 is not necessarily typical of GPT-4 or Gemini — the tells below are tied to versions on purpose.
>
> **Also.** The machine hand is visible even in bare syntax, without any lexis: a Texas group (arXiv:2602.15514) showed that models prefer direct word order and avoid inversions and colloquial constructions, and a classifier built on 96 of Biber's stylometric features separates machine text from human text at 93–98% accuracy even across different corpora. Next-generation detectors (DivEye, 2025) additionally measure the uniformity of information density: a model spreads facts in an even layer, whereas a human alternates dense and light passages. For manual checking this means: look not only at "which words" but at "what rhythm".

---

## Confidence of the tells

| Code | Meaning |
|---|---|
| **C** | Confirmed — documented in the English Wikipedia "Signs of AI writing". |
| **O** | Observed — seen consistently in community feedback and evaluation reviews. |
| **Cond** | Conditional — depends on the system prompt, may be absent. |

| Level | Meaning |
|---|---|
| **H** | High — almost certainly AI on a single tell. Used only for unambiguous markers. |
| **M** | Medium — needs to combine with tells from other categories. |
| **L** | Low — weak signal, not used on its own. |

---

## OpenAI

**Current, summer 2025 – spring 2026:**
- GPT-5.5 (codename "Spud", April 23, 2026) — flagship, a fully multimodal architecture.
- GPT-5.5 Instant (May 5, 2026) — the standard model in ChatGPT across all user tiers.
- GPT-5.5 Pro and GPT-5.5 Thinking — for paid tiers, aimed at hard tasks and step-by-step reasoning.
- Previous: GPT-5.4 (March 5, 2026), the GPT-5.x line since October 2025.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| "It's important to note that…" as a paragraph opener | M | C | Canonical GPT tell since 2023; has not disappeared in the 5.x line. |
| "delve into", "delving into" | L | O | Sharply reduced in 5.x, but frequency is still above human. |
| "tapestry", "a rich tapestry of" | L | O | Beloved of GPT-4o; weakened in 5.x. |
| "navigating the complexities of…" | M | O | Persistent in 5.x. |
| Em-dash in a three-part construction X — Y — Z | M | O | Strengthened in 5.x per community feedback. |
| "First, … Second, … Finally, …" template out of nowhere | M | O | Persists in 5.x. |
| Closing question "Would you like me to…" at the end of an article | H | C | English Wikipedia §5.1. Unambiguous tell. |
| Image descriptions with "the image shows", "we can see" in text where they don't belong | M | Cond | Appeared in 5.5 because of the multimodal architecture. |
| "Let me break this down step by step", "I'll approach this systematically" | M | Cond | Strengthened in 5.5 Pro/Thinking by reasoning training. |

**Typical English openers and closers** (soft primary signals): "Certainly!", "Of course!", "Great question!" as answer openers; "It's worth noting that…" as a connective; "Would you like me to…" as a closing question; "Hope this helps!" as a sign-off.

**Empirical check on English output (May 31, 2026).** GPT-5.5 (xHigh) was run on neutral English prompts with no "write like an AI" instruction, to see the default style. What actually surfaced in every sample:

| What was observed | Pattern | Frequency |
|---|---|---|
| Rule of three: "circulation, energy, and focus", "pulse, sleep, activity, and workouts" | #13 | in each of 3 samples |
| Negative parallelism "not only at university but also in professional life" | #12 | confirmed |
| Transition crutch "Moreover," | #15c | confirmed |
| Inflated significance "the perfect start to your day", "a reliable companion" | #2 | confirmed |
| Markdown `###` heading in a reply where blog prose was requested | #20/#21 | in the blog post |
| Closing call with an exclamation "Start small, and you'll feel the difference!" | #25 | in marketing and blog text |

Unlike the Russian edition (where the English lexis never surfaces in Russian output), in English the lexical tells "delve" and "It's important to note" (#10) appear right alongside the structural ones — so both layers are in play at once. Conclusion: for fresh English text the priority signals are the rule of three (#13), negative parallelism (#12), transition crutches (#15c), and inflated significance (#2), reinforced by the "It's important to note"/"delve" lexis (#10).

---

## Anthropic Claude

**Current, summer 2025 – summer 2026:**
- Claude Fable 5 (`claude-fable-5`, June 9, 2026; access suspended June 12 on a US government requirement — export control, restored globally July 1, 2026) — the sitting flagship, a Mythos-class model with safety restrictions. Detail that matters for the skill: queries on restricted topics (cybersecurity) are handled silently, invisibly to the user, by Claude Opus 4.8 — so two model styles can mix within a single conversation.
- Claude Mythos 5 (June 9, 2026) — the same base intelligence as Fable 5 but with the restrictions removed; access only for approved US organizations (Project Glasswing), not encountered in ordinary text.
- Claude Sonnet 5 (`claude-sonnet-5`, June 30, 2026) — a new-generation workhorse: 1-million context, output up to 128K, adaptive thinking on by default, a new tokenizer. Stylistic tells are still accumulating — until the next review, apply the Sonnet 4.6 tells.
- Claude Opus 4.8 (`claude-opus-4-8`, May 28, 2026) — the previous flagship, and still the fallback model for Fable 5's blocked queries. Stated emphasis on "honesty": the model more often flags uncertainty outright. Practical consequence (applies to the 5 line as well): uncertainty disclaimers by themselves are no longer an anti-tell — cross-check #23/#23a by meaning, not by the mere presence of a disclaimer.
- Claude Opus 4.7 (April 16, 2026), Claude Haiku 4.5 (`claude-haiku-4-5-20251001`, October 15, 2025) — previous generations.
- Claude Sonnet 4.6 (`claude-sonnet-4-6`, February 17, 2026) — price/quality balance, 1-million context.
- Knowledge cutoff: January 2026 for Opus and Sonnet, July 2025 for Haiku.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| "I'd be happy to help" | H | C | English Wikipedia §5.1. Classic Claude opener. |
| "Let me [verb] this for you" | M | O | Persistent from Claude 2 through 4.7. |
| Lists with a bold first word: "**Implementation**: …", "**Performance**: …" | M | O | Claude likes structure with bolded inline headings inside a list. |
| Triple construction with em-dash: "X — and Y — and Z" | L | O | Weak tell; humans do it too. |
| "It's worth noting that…" (the formal variant) | L | O | A close cousin of GPT's "It's important to note". |
| Hedging cascade "in some cases, depending on, it might be" | M | O | Strengthened in 4.x training. |
| Intermediate reasoning steps left uncleaned before the answer (Adaptive thinking in Opus 4.7, Sonnet 4.6) | M | Cond | New 2026 tell, seen more often in long answers. |
| "Let me think through this…" with an explicit reasoning trace (Extended thinking in Sonnet 4.6, Haiku 4.5) | M | Cond | New 2026 tell. |

**Typical English openers and closers:** "I'd be happy to help!", "Certainly, I can help with that", "Great question!" as openers; "It's worth noting…", "That said," as connectives; "Let me know if you'd like me to clarify." as a sign-off.

Note that because Fable 5 silently reroutes restricted queries to Opus 4.8, a single conversation may show mixed tells — a terser, disclaimer-heavy Opus register spliced into Fable 5 prose. Do not read the switch itself as an anti-tell.

---

## Google Gemini

**Current, summer 2025 – spring 2026:**
- Gemini 3.5 Flash (the standard model since May 19, 2026, after Google I/O 2026) — lightweight, action-oriented.
- Gemini 3.5 Pro (launch scheduled for June 2026; not yet released at the time this file was compiled).
- Gemini Omni Flash — on-demand video generation, for paid tiers.
- Gemini Spark — a background agent, in beta for the AI Ultra tier.
- Antigravity 2.0 — an agentic coding platform.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Lists with emoji bullets (🚀 **Speed**: …) | H | C | English Wikipedia. Gemini overuses this especially heavily. See also `structural-style-patterns.md` #17. |
| Footnotes like `[1]`, `[2]` at the end even for trivial facts | M | C | English Wikipedia §2.2. |
| "As an AI, I…" — reduced in 2.x, sometimes returns in 3.5 on certain prompts | M | Cond | |
| Structure "heading → 3–4 bullets → 'Sources:' at the end" | M | O | Especially in grounded search mode. |
| Markdown tables out of nowhere (where prose would read more naturally) | M | O | English Wikipedia §4.5. |
| "I've scheduled this for you", "I'll handle X in the background" (Spark agent mode) | M | Cond | New 2026 tell. |
| Text description of a generated video ("the video shows…") | M | Cond | New 2026 tell, from multimodality. |
| The address `vertexaisearch.cloud.google.com` in links | H | C | Unambiguous tell. See `chatbot-artifacts.md`. |
| Deep Research mode: a long report with sections, heavy footnoting, and a "Sources" block of dozens of links | M | Cond | New 2026 tell. Differs from ordinary Gemini in length and link density; the report format alone is not a tell — count it only alongside machine lexis. |

**Typical English markers:** 🚀, 💡, ✅ as list bullets; "Here's what I found:" as an opener; a standalone "Sources:" section at the end.

---

## xAI Grok

**Current as of May 2026:**
- Grok 4.3 (May 13, 2026) — flagship.
- Retired May 15, 2026: `grok-4`, `grok-4-fast`, `grok-code-fast-1` (requests are redirected to 4.3).
- Grok 5 is in training on the Colossus 2 supercluster; release date not announced.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| The `grok_card://` marker | H | C | Unambiguous. See `chatbot-artifacts.md`. |
| Links to `x.com/...` or `twitter.com/...` without an explicit user request | M | O | Grok is trained on the X corpus and pulls links in automatically. |
| Manufactured dry humor and sarcasm out of nowhere: "Well, surprise — it works" | L | O | Weak tell, hard to distinguish from human. |
| "Direct answer + caveat" structure: "Yes, X. But here's the thing —" | L | O | |
| Fewer hedges than GPT and Claude (deliberately trained in Musk's style) | L | O | More of an anti-tell. |
| "I'll search X for you", "Let me check X.com" (4.3 agent mode) | M | Cond | New 2026 tell. |
| Crude expressions, profanity, and slang in fun mode | Cond | Cond | Only if fun mode is on. Without it, ordinary prose. |

Because Grok is trained on the English-language X corpus, its tells surface almost entirely in English output; there is no separate localized layer to track.

---

## DeepSeek

**Current, spring 2026:**
- DeepSeek-V4-Pro (1.6 trillion parameters, 862 billion active, 1-million context, MIT license).
- DeepSeek-V4-Flash (292 billion base, 158 billion active).
- Engram memory architecture — conditional memory carried across requests.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Reasoning residue left in the output: `<think>...</think>` blocks or their remnants | H | O | Famous for the R1 line; V4-Pro continues the pattern. Caught by the regex `</?think>` — see `chatbot-artifacts.md`, section A.7. |
| Mixing Chinese and English in rare cases where the training data "leaks" | M | O | |
| Excessively long reasoning chains before a short answer | M | O | |
| References to "previous context", "as we discussed" in the first turn of a conversation (an Engram conditional-memory artifact) | M | Cond | New 2026 tell. |
| A strong bias toward math-proof / code structure even in creative prompts | L | O | |

---

## Qwen (Alibaba)

**Current as of May 2026:**
- Qwen3.7 Max and Qwen3.7 Plus.
- Previous: Qwen3.6 (April 2026, the new Gated Delta Network attention architecture), Qwen3.5 (February 2026), Qwen3-Coder-Next (specialized for programming).

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Occasionally a Chinese character slips into English text (training-data "leakage") | M | O | |
| Very formal politeness: "I'm pleased to provide you with…" | L | O | |
| Technical explanations that reason out loud even when not asked | M | O | Especially Qwen3-Coder-Next. |
| Knowledge of Chinese realities, holidays, and culture even in general answers | L | Cond | Not a tell of AI as such, but a tell of Qwen relative to other models. |

---

## Meta — the Llama legacy, the new Muse Spark

Context matters for the skill. Meta went through a paradigm shift:

- Llama 4 (April 2025, open weights) — Meta's last open model.
- **On April 8, 2026** Meta Superintelligence Labs (led by Alexandr Wang) launched **Muse Spark** — a closed commercial model that replaced Llama in Meta's consumer products (Meta AI in Instagram, WhatsApp, Facebook Messenger).

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Llama 4 (legacy): fewer characteristic tells than GPT and Claude — trained on open corpora with less insistent tuning | L | O | |
| Llama 4 (legacy): occasionally "I'm an AI assistant, and…" | M | O | |
| Muse Spark in "Contemplating Mode": multiple sub-agents return parallel answers, sometimes stitched together with seams like "Considering this from another angle, …", repeating 2–3 times | M | Cond | New 2026 tell. |
| Muse Spark inside the Instagram, WhatsApp, or Facebook context: platform-binding artifacts | L | Cond | |

---

## Mistral

**Current, summer 2025 – spring 2026:**
- Mistral Large 3 (late 2025, MoE 675 billion, 41 billion active, 256K context).
- Mistral Small 4 (early 2026).
- Magistral — a line trained with verifiable rewards (RLVR), for step-by-step reasoning.
- Ministral 3 (8 billion, 14 billion) — for on-device use.
- Voxtral TTS — an open speech-synthesis model.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Less inclined to hedge than GPT and Claude (a French tradition?) | L | O | More of an anti-tell. |
| French "leaks" rarely, but: "Bien sûr, …" at the start of an English answer | M | O | |
| Explicit verifiable steps "Step 1: …, Step 2: …, Verification: …" in tasks that did not call for it (Magistral) | M | Cond | New 2026 tell, from training with verifiable rewards. |
| Ministral on-device: a "drier", shorter style because of compression | L | Cond | |

---

## Perplexity

**Current, spring 2026:**
- The Sonar line: `sonar`, `sonar-pro`, `sonar-reasoning`, `sonar-reasoning-pro`, `sonar-deep-research`. Answers are always built on web search.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Footnotes `[1]`, `[2]` next to every claim, numbered across the whole answer | M | C | Sonar numbers sources by default and the marker can't be turned off. The link list sits at the end or in a separate response field. |
| Structure "direct answer → bullet points → source list" | M | O | Sonar's search-output template. |
| Footnote density above human: 1–2 per sentence | M | O | `sonar-pro` places roughly twice as many links as the standard model. |

**False-positive boundary.** By themselves, footnotes `[1]`, `[2]` are normal citation markup. It is a tell only when there is no matching source list at the end, or when the footnote density is unnaturally high. See `chatbot-artifacts.md`, section A.5.

---

## Amazon Nova

**Current, winter 2025 – spring 2026:**
- The Nova 2 line was unveiled at AWS re:Invent in December 2025, with broad rollout in early 2026. Models: Nova 2 Lite, Nova 2 Pro, Nova 2 Sonic (speech), Nova 2 Omni (preview). Access mostly through Amazon Bedrock.

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| A neutral-corporate tone leaning toward feature enumeration | L | O | Weak tell, hard to distinguish from a human business style. |
| Traces of adjustable reasoning depth ("extended thinking"): an expanded train of thought before a short conclusion | M | Cond | New 2026 tell, depends on the setting. |
| Structural traces of agentic automation (Nova Act): step-by-step descriptions of browser actions | M | Cond | Only in agent mode. |

**Note.** Nova is still thinly represented in consumer text; data on stable tells is scarce — this section is subject to refinement at the next scheduled review.

---

## Cohere

**Current, spring 2026:**
- Command A+ (`command-a-plus-05-2026`, May 2026) — flagship, Cohere's first MoE model, Apache 2.0 license, multimodal, 48 languages. Previous: the Command R / R+ line (latest versions `08-2024`), Command R7B (December 2024).

**Stylistic tells:**

| Tell | Level | Confidence | Note |
|---|---|---|---|
| Tuned for source-grounded retrieval (RAG): a structured answer with explicit references to documents | M | O | Command is tuned for enterprise document search from the outset. |
| A very formal, "report-like" tone even in simple answers | L | O | Weak tell. |

**Note.** Like Nova, Cohere is rarely seen in consumer text — more often inside enterprise document-search systems than in everyday writing.

---

## Vendor-independent universal tells

These tells show up equally across all models. If present, it is AI regardless of which model produced it.

| Tell | Where described | Where in this skill |
|---|---|---|
| Forced rule of three | English Wikipedia | Yes, pattern #13 |
| Negative parallelisms ("not just X, but Y") | English Wikipedia | Yes, pattern #12 |
| Inflated significance ("plays a key role", "stands as a testament to") | English Wikipedia | Yes, pattern #2 |
| Vague attributions ("experts believe") | English Wikipedia | Yes, patterns #5 and #6 |
| Hedging cascade | English Wikipedia + community observations | `language-patterns.md` #15b |
| Transition crutches ("However, it's worth noting that…") | English Wikipedia + community observations | `language-patterns.md` #15c |
| Filler closing turns ("In conclusion, it's worth noting…") | English Wikipedia + community observations | `language-patterns.md` #15c |
| Knowledge-limit disclaimers | English Wikipedia | Yes, pattern #23 |
| Curly quotes in ordinary text (not from a Mac user) | English Wikipedia | Yes, pattern #18 |
| Unfilled templates ([NAME], [DATE]) | English Wikipedia | Yes, part of pattern #22 |

---

## Regulatory layer: marking required by law

From **August 2, 2026**, Article 50 of the EU AI Act applies: providers of generative systems must mark their output (text, audio, images, video) in a machine-readable form, and deployers must label deepfakes and certain AI publications. The code of practice on the transparency of AI content was published by the European Commission on June 10, 2026 (signing is voluntary; the obligations themselves are law).

What this means for the skill:

- **Expect a rise in invisible text marking.** The technical candidates are character-level tricks (see `chatbot-artifacts.md` A.10) and word-choice statistical watermarks (Google SynthID). The A.10 check becomes a mandatory step for text obtained after August 2026.
- **Absence of marking proves nothing.** SynthID and similar schemes are removed by paraphrase; character-level ones by swapping the characters out. The reverse is also true: a legal watermark is not a sign of "bad" text, only a sign of origin.
- **Don't mix the layers.** A watermark answers "was this text generated"; the skill answers "does the text still carry traces of generation". These are different tasks; do not merge the verdicts.

**Scientific base (English and universal).** The model-idiolect and syntactic findings noted at the top of this file are language-agnostic. Reinhart et al. (PNAS 2025) show that human syntax is statistically distinguishable from machine syntax (the basis for the "Human syntax" item in `false-positives.md`); Sun et al. (arXiv:2502.12150) document per-model idiosyncrasies (idiolects); the syntactic-stylometry study (arXiv:2602.15514) separates machine from human text without any lexical cues at 93–98% accuracy; and DivEye (2025) adds information-density uniformity as a detector signal. There is no separate tell catalog for any single language — the universal patterns #1–#25 apply across the board.

---

## Rules for using fingerprints

1. **Never render a verdict on a single soft tell.** At least three different categories.
2. **One unambiguous marker is enough.** A single `:contentReference[oaicite:0]` means AI with roughly 99% probability.
3. **Don't attribute the model to the user.** The skill says "the text carries AI tells", not "GPT-5.5 wrote this". Model attribution can only ever be a reference note.
4. **Account for genre.** An em-dash in literary prose is the norm. In a corporate email it is a tell.
5. **Account for date.** A 2023 text with "as an AI language model" is not a tell — it is the historical norm for GPT-3.5.

---

## Freshness and update procedure

Stylistic tells evolve every 6–8 weeks with each sub-release. The unambiguous markers in `chatbot-artifacts.md` live longer — until a vendor changes its tool-output format.

This file needs updating:

- When any major vendor changes its flagship (roughly every 6–8 weeks in 2025–2026).
- When a new generation ships (X.0 → X+1.0) — a full review of the stylistic tells.
- When a new vendor appears with more than 5% market share.

Minimum: reassess every 90 days.

**Last reviewed:** July 2, 2026.

**Next scheduled review:** September 30, 2026. Unscheduled — August 2, 2026 (Article 50 of the EU AI Act takes effect: check which forms of text marking have actually appeared at the major providers).

**Sources for review:**

- English Wikipedia "Wikipedia:Signs of AI writing".
- WikiProject AI Cleanup.
- Reddit communities: r/ChatGPT, r/ClaudeAI, r/Bard, r/LocalLLaMA — community observations.
- Model release notes from Anthropic, OpenAI, Google, xAI — official changes.
