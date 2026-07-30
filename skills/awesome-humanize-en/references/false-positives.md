# What is NOT an AI tell — false-positive boundaries

Based on English Wikipedia "Signs of AI writing", §11 "Ineffective indicators" and §10 "Signs of human writing", and the WikiProject AI Cleanup guidance.

This file is mandatory reading before you rule on machine origin. Without it the skill will mutilate literary, academic, and legal writing by flagging it as AI. The chief risk is a **false positive** — editing a living person's text on the pretext that it is machine-made.

> When to load: always. Especially when working with literary prose, poetry, academic writing, a legal document, a philosophical essay, a translation, and when analyzing any text written before 2022.

---

## The main rule

**No single soft tell from this skill is sufficient grounds for the verdict "this text was written by AI".** Only these are sufficient:

- One **unambiguous marker** from `chatbot-artifacts.md` (for example, `:contentReference[oaicite:0]`).
- A confirmed **source fabrication** from `source-fabrication.md`.
- A **combination of three or more** soft tells from **different categories** (content, language, structural).

Every soft tell, taken alone, shows up in the writing of real people. It is their combination that gives away the machine.

---

## What is NOT an AI tell by itself

### 1. The em-dash in literary prose

The em-dash is a normal authorial device in the English tradition:

- Emily Dickinson built her poems on dashes — "Because I could not stop for Death — / He kindly stopped for me —". The dash is her signature punctuation, not a stray keystroke.
- Modern literary journalism and the personal essay use the em-dash freely, as a substitute for parentheses, colons, and commas, to control pace and set off an aside.

**When the em-dash is a tell:** only in combination with other markers (the rule of three, machine vocabulary, leftover chat turns), and only in the wrong genre — a neutral report, a contract, an instruction manual. See `structural-style-patterns.md` #16. A dash-heavy short story or column is craft, not a machine trace.

---

### 2. Curly / smart quotes from macOS / iOS autocorrect

Typographic (curly) quotes — `"…"`, `'…'` — are inserted automatically by Apple's system autocorrect whenever you type a straight quote in almost any app. If the author writes on an Apple device, those quotes will appear in **every** text they produce, including a fully human one. A Word document with "Smart Quotes" on does the same thing.

**When quotes are a tell:** only when the quote style is **mixed within a single document** (straight `"…"` in one paragraph, curly `"…"` in the next — a sign of stitched-together sources), or when clean typographic quotes appear in a **casual plain-text medium** where autocorrect does not run (a code comment, a raw terminal paste, a plain-text config). See `structural-style-patterns.md` #18.

---

### 3. The rule of three in rhetorical prose

The tricolon is a rhetorical figure as old as classical oratory. It runs through the canon of English-language public speech:

- "Veni, vidi, vici" (Caesar).
- "Life, liberty, and the pursuit of happiness" (US Declaration of Independence).
- "…government of the people, by the people, for the people" (Lincoln, Gettysburg Address).
- "Blood, sweat, and tears" (the popular form of Churchill's tricolon).

The rule of three is the foundation not only of oratory but of opinion writing: the column, the essay, the piece of reportage, the by-lined feature deliberately use triple lists and parallel structure as a device of emphasis. That is the craft of a writer, not a machine trace.

**When the rule of three is a tell:** in a technical text, where triple constructions are out of place; or when it recurs in every second or third sentence; or when triples pile up **alongside tells from other categories** (machine vocabulary, leftover chat turns, inflated significance) while the text itself has no point of view and no specifics. See `language-patterns.md` #13.

---

### 4. "Delve", "in the realm of", "tapestry" in academic text

English-language critics singled out **"delve"** as the canonical GPT-4 tell, and "in the realm of", "tapestry", "intricate", "nuanced" travel with it. But all of these were ordinary academic and literary English long before 2022 — a humanities scholar has always "delved into the archive" and written about "the rich tapestry of" a period.

**When "delve" is a tell:** only in a non-academic context where the word looks foreign and imported — "Let's delve into this topic" at the head of a marketing post, or "a tapestry of flavors" in a restaurant blurb. The word itself is not the signal; the mismatch between register and genre is. See `language-patterns.md` #10 (the tell is the **cluster** of these words, five-plus per paragraph, not any one of them).

---

### 5. Officialese / legalese in a legal document

In a contract, a statute, an appellate brief, or a filing to a government body, formal legal language is mandatory. "Pursuant to", "hereinafter", "in accordance with", "for the purpose of", "notwithstanding the foregoing", "the party of the first part" are standard legal vocabulary, without which the document does not do its job.

**When officialese is a tell:** only in a **non-legal** text — a marketing article, a news item, a personal blog — where the stiff Latinate register has no business being. See `content-patterns.md` #8, whose false-positive boundary points back here.

---

### 6. Long, complex sentences by literary authors

Faulkner, Henry James, Proust (in translation), David Foster Wallace, and Virginia Woolf run sentences of many lines with multiple levels of subordination. That is part of the style, not a defect.

**When long sentences are a tell:** in a technical or news text, where plainness is the norm; or when the sentences are **all** roughly the same length. The real signal is not length but the **absence of rhythmic variation** — a human writer alternates a long, winding sentence with a short, blunt one. A wall of uniform, evenly measured sentences is the machine tell; a wall of long ones by an author with a voice is not.

---

### 7. Title Case in headings — NOT a tell in English

**This is the critical English flip.** In many languages, forcing Title Case onto a heading is an obvious calque from English and a genuine tell. In **English it is the opposite**: Title Case in headings — "Early Life and Education", "Career and Achievements" — is a normal, standard heading convention (AP and Chicago both codify title case). English Wikipedia's "Signs of AI writing" lists Title Case among its **ineffective indicators** (§11): it does **not** indicate AI. Do not flag Title Case here.

The genuinely useful heading tell in English is a different thing — the **choice of boilerplate, generic heading words** ("Introduction", "Overview", "Conclusion", "Key Takeaways", "Final Thoughts"), not their capitalization. That is what `structural-style-patterns.md` #21a "Boilerplate section headings" captures. Cross-reference it, and do not confuse it with capitalization. See also §12 below, "Ineffective indicators".

---

### 8. A period at the end of list items

Some style guides require a full stop at the end of every bullet; others forbid it. That is an editorial choice, not AI.

---

### 9. Markdown in personal notes

Programmers, researchers, and note-takers in Obsidian, Notion, and Bear use Markdown every day. `**bold**` in their draft is normal.

**When Markdown is a tell:** only in a medium that cannot render it — a personal email in Outlook, a printed booklet, a plain-text message — where the literal `**`, `#`, and `[text](url)` show up as raw characters. See `structural-style-patterns.md` #20.

---

### 10. High lexical density in a translator's English

A translator working from Japanese, Chinese, or German often produces a more "bookish" English, dense with nouns and passive constructions, because they carry the source language's compression across. That is a feature of translated text, not an AI tell.

---

### 11. Academic and scientific register

A research paper, a dissertation, a textbook, or a literature review requires, by genre, exactly what would look machine-made elsewhere. Before editing an academic text, account for the following:

- **The passive voice and impersonal constructions** ("it was shown that", "is discussed below", "it should be noted") are the norm of scientific style, not a reason to edit.
- **"Represents", "constitutes", "serves as"** are standard scholarly turns of phrase in an academic text, not pattern #11. Swap them for plain "is" only in a non-academic context.
- **A cascade of hedges** ("in a number of cases", "under certain conditions", "as a rule") is academic caution, not pattern #15b (the hedging cascade). A scientist is obliged to bound the scope of a claim.
- **Logical connectives** ("thus", "therefore", "it follows that", "consequently") are the joints of an argument, not pattern #15c (transition crutches). In genuine reasoning they carry meaning.
- **Negative parallelism** ("not so much X as Y") is a normal move of scientific argument, not pattern #12 on its own.
- **Clichés** ("plays an important role", "is of interest") are worn but permissible turns in scientific prose, not pattern #1 by themselves.

**When it is nonetheless a tell:** when these academic turns appear in a **non-academic** text (a marketing post, a personal blog); or when unambiguous markers from `chatbot-artifacts.md` sit alongside them; or when the density of empty hedges is so high that the text carries **not one verifiable claim**. Popular-science writing sits in between: the same set is admissible there, but at a lower concentration.

---

### 12. Ineffective indicators

English Wikipedia's "Signs of AI writing" carries a dedicated §11 on signals the community often *thinks* are machine-made but which **do not work** for identifying AI. A false accusation drives away real authors, so these signals are forbidden as grounds for a verdict:

- **Perfect grammar and spelling.** Plenty of people write flawlessly — professional editors, copywriters, careful writers, non-native speakers who over-correct. Clean prose proves editing, not a machine.
- **Mixing casual and formal register.** Engineers, young writers, and people with a lively voice write this way. In a collaborative document it is simply the trace of several hands.
- **A "dry" or "lifeless" feel.** Machine text is identified by the concrete patterns in this skill, not by a general impression of dullness. Stiff, joyless prose from a human is an everyday thing.
- **A "too-smart" vocabulary.** AI overuses a **specific** list of words (`language-patterns.md` #10), not any hard word at all. A rich vocabulary on its own is a sign of a well-read author.
- **Title Case in headings** (see §7 above). A standard English convention; not a tell.
- **Letter-format framing** — a greeting, a signature, a "Subject:" line — is not a tell on its own: business correspondence was built this way long before neural networks. What works is the accompanying tells: emoji/bullet lists (`structural-style-patterns.md` #17), unfilled placeholders like `[insert name]` (`communication-patterns.md` #22), a mid-sentence cutoff (`communication-patterns.md` #25a).
- **Standalone transition words.** "Moreover", "Furthermore", "Notably" are endorsed by many style guides. The tell is a high density of specific transition crutches (`language-patterns.md` #15c), not one connective.
- **The absence of sources.** Modern chatbots search the web and happily scatter links (whether accurate is another matter). A text with no links is just a text with no links.

---

### 13. Different error types in humans and models

Errors in a text are **not** proof of human authorship: models make mistakes too, but **differently**. Use error character as a refining layer, not a verdict:

- **Human errors:** typos from adjacent keys ("teh", "hte"), *its / it's*, *their / there / they're*, *your / you're*, missing commas (including the dropped Oxford comma), and inconsistent quote or dash use across one text.
- **Machine errors:** subject–verb agreement drift in long clauses ("the set of results *are*…"), a dropped or dangling referent (a "this" or "it" that points to nothing), and one word repeated across adjacent sentences — all amid otherwise flawless spelling and punctuation. The tell is the combination of a *local* slip with *global* perfection.
- **Perfect typography is relative to genre.** Flawless em-dashes and curly quotes in a **messenger message or a quick comment** are a weak machine signal — a real person does not hand-set typography while texting. The same clean typography in a **published article** is normal copyediting, not a tell (see §2).

Deliberately inserting typos to make a text "look human" is bad advice: errors are not a marker in either direction.

---

### 14. Non-standard spaces and "sterile" typography

The companion to section A.10 of `chatbot-artifacts.md`. Invisible and non-standard characters have many innocent, human sources:

- **The narrow no-break space `U+202F`** is standard French typography and standard professional layout; Word, InDesign, and automatic typographic tools insert it on their own. Text from a translator, a typesetter, or a publishing pipeline is not a tell.
- **Zero-width characters** enter text on export from a web CMS (soft-hyphen hints), from some mailing services, and on copy-paste from websites. Before you judge, ask where the text came from.
- **`U+FEFF` at the start of a file** is a byte-order mark (BOM) — an encoding artifact, not a watermark.
- **The reverse does not work either.** A total **absence** of em-dashes, or a "suspiciously clean" set of glyphs, is proof of neither human nor machine: 2026 editorial policies in places demand "zero em-dashes", people write that way on purpose, and models are trivially told "don't use em-dashes". Typography is a refining layer, never the verdict.

---

## What argues FOR human authorship

English Wikipedia §10 "Signs of human writing". These indicators lower the probability of AI:

### A. The age of the text relative to large language models

Text written **before November 2022** (the launch of ChatGPT) is almost certainly human. Text from before 2018 is human as near to certain as makes no difference.

Check: document metadata (file creation date, archive publication date, the Wayback Machine's first-capture date).

### B. The author can explain their word choices

If the author can tell you why they phrased it this way, which edit they rejected, which variant they weighed, that is a sign of human work. Asked to explain, a model tends to hallucinate the justification.

### C. A sharp, witty, or provocative stance

AI is trained on a neutral corpus and drifts toward hedging. Text with a definite, pointed position — with a joke, with irony, with harsh criticism — is more often human.

### D. A personal detail that is hard to invent

A specific place, date, name, or event known only to participants is a sign of real experience. AI either dodges specifics or hallucinates them, at which point the detail fails a check.

### E. Admission of uncertainty and mixed feelings

"I don't know", "this is a judgment call", "I'm not sure", "I have mixed feelings" are natural turns of living speech. AI is trained to radiate confidence.

### F. Human syntax

English Wikipedia extended §10 with an observation confirmed by a corpus study (Reinhart et al., PNAS, 2025): a set of constructions is statistically far more frequent in human writing than in model output. For English:

- **Plain "is / are"** over "constitutes" / "represents": "the company has three offices", "this is a mistake" — the machine prefers "the company boasts", "this circumstance represents" (pattern #11 in reverse; see `language-patterns.md` #11).
- **Plain verbs** in place of bookish synonyms: "wrote" (not "authored"), "used" (not "utilized"), "died" (not "passed away"), "tried" (not "attempted"), "made" (not "crafted").
- **Categorical claims**: "the best", "the only", "the first" — the machine is trained to soften and avoids the superlative without a hedge.
- **Everyday intensifiers and hedges**: "very", "maybe", "usually" — living speech is full of them; the machine substitutes "extremely", "potentially", "in most cases".
- **Wordy, colloquial connectors**: "because of the fact that", "in order to", "the fact that" — a person writes uneconomically, while the machine smooths these into "because" and "to".

Each item is a weak signal; they work by accumulation. A text saturated with plain "is", plain verbs, and categorical judgments is almost certainly human.

---

## Algorithm for boundaries

Before editing a text under suspicion of AI:

1. **Account for genre.** Fiction → the rule of three, the em-dash, long sentences are normal. Contract → officialese is normal. Translation → bookish English is normal.

2. **Account for the source.** Mac / iOS → curly quotes are normal. Programmer → Markdown in notes is normal.

3. **Account for age.** Before 2022 → AI is extremely unlikely. Before 2018 → ruled out.

4. **Count the tells by category.** If every marker comes from one category (only em-dashes, only officialese, only Markdown), it is almost certainly a stylistic feature, not AI.

5. **Look for unambiguous markers.** If even one marker from `chatbot-artifacts.md` is present, it is AI beyond doubt. If none is, you need a combination of three tells from **different** categories.

6. **Ask the author, if possible.** Asking them to explain their word choices is the best check of all.

---

## What to do on a false positive

If the analysis flags a text as AI but the boundary criteria above point to possible human authorship:

- Do not edit the text without the author's consent.
- Point out the specific tells that raised the flag.
- Ask the author to check and confirm or refute them.
- If the author is unavailable, mark the text as "needs review" — but **do not edit without confirmation**.

The governing principle: it is better to miss a piece of AI text than to ruin a person's living text.
