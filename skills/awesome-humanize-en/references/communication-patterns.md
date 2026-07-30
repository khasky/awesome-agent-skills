# Communicative patterns (#22–25)

Leftover conversational format, out-of-place apologies, and the servile tone of an assistant. Cross-references to the unambiguous markers and to the model fingerprints are added at the end.

> When to load: when analyzing text that may have been copied out of a chat (article, post, email, form, inquiry).

---

## 22. 🔴 Leftover chat turns & unfilled templates

**Word markers:**
- "Hope this helps!"
- "Certainly!"
- "Of course!"
- "You're absolutely right"
- "Would you like me to…"
- "Let me know if…"
- "I'd be happy to!"
- "Subject: …" (an AI email subject line)
- "Dear editor…" (the stock opener of an AI-written Wikipedia talk-page comment)
- `[insert name]`, `[add date]`, `[add link]`, `[citation needed]` — unfilled placeholders

**Problem.** The AI leaves scraps of its conversation with the user, plus unfilled placeholders. This is a **definitive tell**: one such marker means the text was almost certainly copied out of a chat without review.

**Before:**
> Here's a brief overview of the French Revolution. Hope this helps! Let me know if you'd like me to expand any section in more detail.

**After:**
> The French Revolution began in 1789. A financial crisis and food shortages led to mass unrest.

**Cross-check.** If a #22 marker is found in the text — always run `chatbot-artifacts.md`: unambiguous markers such as `:contentReference[oaicite:N]`, `oai_citation:`, or links carrying `utm_source=chatgpt.com` are often right nearby.

---

## 23. 🟡 Knowledge-limit disclaimers

**Word markers:**
- "as of [date]"
- "as of my last update"
- "while specific details are limited"
- "based on the available information"
- "as of my knowledge cutoff"
- "in the provided search results"

**Problem.** The AI leaves hesitant disclaimers about the limits of its knowledge. Often it produces a claim right after the disclaimer anyway — that is the signal.

**Before:**
> While specific details about the company's founding are limited in the available sources, it appears to have been established sometime in the 1990s.

**After:**
> According to its registration documents, the company was founded in 1994.

If there is no fact, better not to state it at all than to wrap it in a disclaimer.

---

## 24. 🟡 Sycophantic tone

**Problem.** Overly positive, servile language and praise for "what a great question" — the stock opening of a ChatGPT reply, left uncleaned when the text was copied.

**Markers:**
- "Great question!"
- "You're absolutely right!"
- "Excellent point!"
- "That's a really deep observation…"
- "What a thoughtful thing to consider…"

**Before:**
> Great question! You're absolutely right that this is a complex topic. As for the economic factors — that's an excellent point.

**After:**
> The economic factors you mention are genuinely relevant here.

**Relation to #22.** A sycophantic tone usually travels with other leftover chat turns. If you find one, look for the rest.

---

### 24a. 🟡 Pseudo-therapeutic register & fake liveliness

A new generation of stylistic fingerprints: told that it "sounds dry", the model began to imitate engagement — and the imitation itself became the marker. The peak was the spring-2025 GPT-4o mode that OpenAI rolled back for excessive sycophancy.

**Three typical forms:**

1. *Pseudo-therapeutic care* — a coach's register in a context that does not call for it:
   - "You're not wrong to feel that way."
   - "The very fact of it is a quiet affirmation."
   - "You're still here. You're real."
2. *Chains of one-clause nodding sentences* — templated sentence fragments:
   - "Short. Punchy. Deliberate. Reflective."
3. *Pseudo-Socratic questions with empty answers:*
   - "Why? Because. And for what? For this."

**Marker.** These devices repeat templately — several times per text, with an identical structure. In a living author, sentence fragments and rhetorical questions are rare and carry real weight.

**What to do.** Cut the therapeutic formulas entirely; splice the nodding chains back into an ordinary sentence; give a rhetorical question a substantive answer, or drop the question.

**False-positive boundary.** Sentence fragments are a legitimate literary device (fiction, columns, ads), and a therapeutic register is at home in writing by actual therapists. The tell is templated repetition and a mismatch with the genre — not the device itself. A single expressive break in the rhythm from a columnist is normal.

**Relation to #24.** This is the same servility, next generation: the model flatters not with praise but with imitated empathy and a "lively" rhythm.

---

## 25. 🟡 Generic positive conclusions

**Problem.** Vague, upbeat endings with no specifics.

**Markers:**
- "The future looks bright."
- "Exciting times lie ahead."
- "This is a step in the right direction."
- "They continue their journey toward excellence."
- "This is only the beginning."
- "The possibilities are endless."

**Before:**
> The company's future looks bright. Exciting times lie ahead, and they continue their journey toward excellence.

**After:**
> The company plans to open two new branches next year.

A concrete plan beats abstract optimism. If there is no concrete content, the conclusion can simply be deleted — the text loses nothing.

---

## Extension: mid-sentence cutoff

### 25a. 🟡 Mid-sentence cutoff

**Problem.** The text ends in the middle of a sentence, or even mid-word — no period, no completed thought. Older versions of ChatGPT stopped generating when they hit the response limit and waited for the user to press "continue"; if the author copied the reply before that, the end of the text is lost. English Wikipedia treats the sign as historical (mostly 2023–2024), but it still turns up in older text and pairs well with #22: a cutoff plus leftover chat turns is a near-certain diagnosis.

**Markers:**
- The last sentence is unfinished: "In addition, the company plans to expand"
- The text breaks off on an open parenthesis, a colon, or a comma.
- The last list item is empty or holds one or two words while the previous ones were fully developed.

**Boundaries.** A cutoff can also be human: a sloppy paste from the clipboard, a chunk lost while moving text between programs, an unfinished draft. English Wikipedia adds a separate warning: a cutoff can also mean someone copied another person's text from a limited preview (the paywalled preview of a paid article). On its own it is a weak signal; the diagnosis is made in combination with #22–#25 or markers from `chatbot-artifacts.md`.

**What to do.** Finish the broken thought in keeping with its sense, or delete the unfinished fragment. Then check the whole text: since the end was lost in copying, other chunks may have been lost in the middle too.

---

## Extension: unavailability with speculation

### 23a. 🟡 Statement of unavailability with speculation

**Problem.** The heir to the #23 disclaimers in the era of web-search models. When a RAG model finds no sources on a topic (or finds no data in an attached document), it will not admit this plainly. Instead it produces a knowledge-limit-style disclaimer — "this information is not publicly disclosed", "the exact figures are not published" — and immediately builds on it a speculation about what that information "likely" is and why it matters. English Wikipedia ("Signs of AI writing") describes this as a distinct tell of search-enabled models.

**Word markers:**
- "this information is not publicly available", "the data is not disclosed", "the details are not published"
- then: "however, it is likely…", "most probably…", "it can be assumed that…", "it appears that…"
- closing with a significance judgment: "…which underscores the company's secrecy", "…which speaks to the scale of the project"

**Difference from an honest disclaimer.** A living author who cannot find the data either stays silent or plainly writes "I couldn't find this" — and builds no conclusions on the void. The AI turns the absence of information into a paragraph of text.

**Before:**
> The company's exact revenue is not disclosed; however, given the scale of its operations, it likely runs into the hundreds of millions of dollars, which underscores its significant role in the market.

**After:**
> The company does not publish financial statements.

**What to do.** Delete the speculative part entirely; keep only the verifiable fact (or nothing). Check the neighboring paragraphs: this pattern often sits next to #6 (vague attributions) and source fabrication — see `source-fabrication.md`.

---

## Cross-references to other files

| If found | See also | Action |
|---|---|---|
| #22 leftover chat turns | `chatbot-artifacts.md` | Run the regexes for unambiguous markers — they almost always turn up |
| #22 "Subject: …" at the start | `chatbot-artifacts.md` (email subject lines) | An AI-written email — usually rewrite it entirely |
| #23 knowledge-limit disclaimers | `llm-fingerprints.md` (legacy of GPT-3.5/4) | Text from 2023–2024 — characteristic of the older GPT models |
| #24 sycophantic tone + closing question | `llm-fingerprints.md` (Claude) | "I'd be happy to help" is a stock Claude opener; "Certainly!", "Great question!" are the primary English openers |
| #25 generic positive conclusions | `content-patterns.md` #7 | "Challenges and prospects" — the kindred pattern in the content layer |
| #25a mid-sentence cutoff | `chatbot-artifacts.md` | A cutoff often sits near leftover markers; a cutoff with no other signs is not a diagnosis |
