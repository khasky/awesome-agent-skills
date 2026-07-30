# Language patterns (#10–15) + extensions for English + universal tells

Specific vocabulary and syntactically bulky constructions that LLMs gravitate toward. The base patterns #10–15 and their extensions #15a–15f draw on the English Wikipedia "Signs of AI writing", the WikiProject AI Cleanup, and consistent community observation.

> When to load: always when analyzing connected English prose.

---

## 10. 🔴 Overuse of AI vocabulary

**List:** delve, tapestry, testament, boasts, nestled, underscore, leverage, seamless, robust, showcase, realm, landscape, navigate, foster, pivotal, crucial, vibrant, intricate, multifaceted, comprehensive, meticulous, bustling, "treasure trove".

**Problem.** These words show up together far too often in generated text. One on its own can be perfectly fine; five or more in a single paragraph is almost always AI.

**Before:** In today's landscape, it is crucial to delve into the rich tapestry of robust, seamless solutions that showcase our comprehensive vision.

**After:** It matters that all the pieces work together.

---

## 11. 🟡 Avoiding "to be"

**Markers:** serves as, stands as, functions as, represents, acts as, boasts — anything used in place of a plain "is".

**Problem.** AI dodges the plain "X is Y" and swaps in bulkier turns. The habit is reinforced by training on encyclopedic and popular-science corpora, where "serves as / functions as" is the house style.

**Before:** The gallery serves as an exhibition space.

**After:** The gallery is an exhibition space.

---

## 12. 🟡 Negative parallelism

**Markers:** not only… but also…; it's not just X, it's Y; more than just X; not so much X as Y.

**Problem.** AI overuses balancing constructions to fake "depth". The "it's not just X, it's Y" frame is one of the most reliable English tells noted in the English Wikipedia "Signs of AI writing".

**Before:** This isn't just a tool — it's a revolution. It's more than just an update.

**After:** This tool meaningfully changes the workflow.

---

## 13. 🔴 Rule of three

**Problem.** AI forces ideas, adjectives, or examples into groups of exactly three to manufacture rhythm and an appearance of completeness.

**Sub-variant — symmetric sections.** AI generates sections of equal length and structure (exactly 3 pros, exactly 3 cons, exactly 3 takeaways). Living text is asymmetric — one section may run a paragraph, the next a single sentence.

**Before:** The event features talks, panels, and networking. Attendees will gain innovation, inspiration, and industry insight.

**After:** The event has talks and panels. Between sessions there's time to mingle.

**False-positive boundary.** The rule of three is a rhetorical figure that runs from Aristotle to Caesar ("veni, vidi, vici"). In fiction and opinion writing it is the norm. See `false-positives.md`.

---

## 14. 🟢 Elegant variation / synonym chasing

**Problem.** In training, generative LLMs are penalized for repetition. So in place of one word, a cascade of synonyms: "the protagonist", "the main character", "the central figure", "the hero" across adjacent sentences.

**Before:** The protagonist faced hardship. The main character overcame every obstacle. The central figure emerged victorious.

**After:** The protagonist faced hardship but came through it.

---

## 15. 🟡 False ranges / merism

**Problem.** AI reaches for the "from X to Y" frame where X and Y do not form a real scale. The device — a merism, pairing two extremes to stand for a whole — reads as profound while saying almost nothing.

**Before:** Our journey takes us from the Big Bang to dark matter, from the singularity to quantum mechanics.

**After:** The book covers the origin of the universe and quantum physics.

---

## Extensions

### 15a. 🟡 Dangling / misplaced modifiers with broken subject unity

**Source:** English Wikipedia "Signs of AI writing"; the classic dangling-modifier error of English grammar.

**Problem.** The model predicts the next word without registering that an introductory participial phrase must share its subject with the main clause. The result is the textbook "Walking to the station, my hat blew off" — the hat wasn't walking.

**Typical forms:**
- "Using this method, results improve." (people use the method, not the results)
- "Having analyzed the data, it becomes clear." (who analyzed? "it becomes clear" is impersonal — there is no subject)
- "By applying this model, efficiency increases." (who applies the model?)
- "Considering the situation, several options emerge." (who is considering?)

**Marker:** an -ing/-ed opener followed by an impersonal or metonymic main clause.

**Fix:** rewrite as a full sentence with an explicit subject.

**Before:** Using this method, results improve.

**After:** When the team applied the method, results improved by 30%.

**False-positive boundary.** A grammatically correct participial phrase is normal ("Having left the service, he began to write"). The marker fires only when subject unity is broken.

---

### 15b. 🟡 Hedging cascade

**Source:** English Wikipedia "Signs of AI writing"; consistent observation of GPT-4.x/5.x output.

**Problem.** AI stacks qualifiers to avoid committing to a claim.

**Typical forms:**
- "Perhaps, in some cases, depending on the circumstances, this might be useful."
- "It appears that, under certain conditions, this could potentially…"
- "Generally speaking, as a rule, in most situations…"

**Marker.** Three or more hedges in one sentence: perhaps, possibly, arguably, generally, in some cases, depending on, typically, in most, likely, under certain conditions.

**What to do.** Keep at most one hedge, or drop them all and make a direct claim backed by a source.

**Before:** Perhaps, in some cases, depending on the approach, this strategy might prove effective.

**After:** In a 2023 study, the strategy lifted conversion by 12%.

---

### 15c. 🟡 Transition crutches and conclusion filler

**Source:** Composite — English Wikipedia "Signs of AI writing" (lexical diversity; signs of human writing) and community observation.

**Problem.** AI marks every logical turn with the same connective.

**Transition crutches (mid-text):**
- "However, it's worth noting that…"
- "That said, it's important to understand…"
- "Furthermore, it should be emphasized that…"
- "It is important to note that…"
- "With that in mind, one must consider…"

**Conclusion filler (at the end):**
- "In conclusion…"
- "To sum up…"
- "Ultimately, we can see that…"
- "All in all…"
- "In summary, it is clear that…"

**Marker.** A connective or closing formula in every second or third paragraph. A living writer varies transitions and sometimes uses none at all.

**What to do.** Either delete it outright (the paragraph often opens better without it) or replace it with a concrete, content-bearing transition.

**Before:** However, it's worth noting that this approach has limits. […] In conclusion, the choice depends on context.

**After:** This approach has limits. […] The choice depends on context.

---

### 15d. 🟢 Abrupt style shift within one text

**Source:** English Wikipedia "Signs of AI writing" — "Pronounced shift in writing style".

**Problem.** One paragraph is stiff officialese, the next is chatty, then formal again. A sign of stitching together pieces from different prompts or different models.

**Marker.** Within a single document, a change of register with no logical bridge (not a literary device).

**What to do.** Pick one register and bring the whole text to it.

**False-positive boundary.** A deliberate literary tonal shift — between dialogue and narration, or between an ironic and a serious section — is normal. The marker fires only on an unmotivated shift.

---

## Extensions from the 2026 catalogs

### 15e. 🟡 Formulaic multi-word collocations / AI-favourite phrases

**Source:** English Wikipedia "Signs of AI writing"; community observation of default LLM phrasing. (This slot was repurposed for the English edition — in humanizer-ru it held "semantic shift through the English field", a Russian-specific tell that has no counterpart in English.)

**Problem.** Where a specific writer would choose a concrete phrase, the model reaches for the single most statistically frequent multi-word formula. This is distinct from the single words in #10 above — these are fixed multi-word phrases the model produces by default.

**Typical forms:**
- "a testament to"
- "plays a pivotal role"
- "rich tapestry"
- "navigate the complexities"
- "at the heart of"
- "when it comes to"
- "in today's fast-paced world"
- "a wide range of"
- "plays a crucial role"
- "stands as a beacon"

**Marker.** The phrasing is the most generic option on offer, dropped in where a real writer would name something concrete. The tell is density plus vagueness, not any single phrase.

**What to do.** Replace the formula with the specific thing meant, or cut it. "Plays a pivotal role in the economy" → "employs 40% of the workforce".

**False-positive boundary.** An established idiom used sparingly is fine. The tell is density and vagueness — three or four of these in one paragraph, each standing in for a concrete detail.

---

### 15f. 🟢 Lack of idiom / figurative language

**Source:** arXiv:2405.09279 — language models handle idioms poorly across languages; community observation.

**Problem.** English text of any real length almost always carries some figurative phrasing: "cut corners", "a long shot", "back to square one". Machine text avoids it, preferring flat, literal wording.

**Marker.** A text of ~3000 characters with not a single idiom, saying, or colloquial turn is a weak signal. It works only in combination with other tells: this is a sign of absence, and on its own it proves nothing (see `false-positives.md`, "Ineffective indicators" — the difference here is that the signal is tied to length and genre).

**What to do.** When humanizing, restore one or two apt idioms; do not stuff idioms into every paragraph (overuse is itself a tell — see #24a in `communication-patterns.md`).

**False-positive boundary.** Scientific papers, documentation, and legal texts are idiom-sparse by norm. Apply this only to journalism, blogs, and personal writing.
