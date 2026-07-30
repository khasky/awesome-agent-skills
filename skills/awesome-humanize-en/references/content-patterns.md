# Content patterns (#1–9)

Meaning-level tells that expose manufactured generality and the absence of real expertise. Extensions and sub-variants are added at the end.

> When to load: always when analyzing substantive text (articles, posts, essays, biographies, descriptions of companies / places / events).

---

## 1. 🔴 Regression to the mean (averaging)

**Problem.** The model smooths concrete facts into broad, admiring, but empty descriptions (puffery). Specific roles and achievements get swapped for generic epithets — "eminent", "titan", "luminary", "renowned", "groundbreaking".

**Sub-variant — "horoscope" statements.** Phrases so general they fit any subject. "It plays an important role in everyone's life." "Everyone faces challenges like these." If a sentence can be dropped into an article about anything at all without losing meaning, that is the tell.

**Before:** He was a true titan of his field, whose contributions forever changed the industry.

**After:** He was the lead architect of the ARM processor's instruction set.

**Test signal.** Swap the subject of the text for anything else (a chair, medicine, medieval Japan). If the sentence still reads as sensible, it is #1.

---

## 2. 🟡 Inflated significance and "legacy"

**Markers:** a testament to, marks a turning point, underscores the importance, plays a key / crucial / pivotal role, lays the foundation, left an indelible mark, deeply rooted, in an ever-changing landscape, a turning point, reflects broader trends, enduring significance, cemented its place, became a milestone.

**Problem.** The model tries to give any fact an artificial depth by inflating what it means.

**Before:** The company's founding in 1989 marked a turning point in the history of the industry, laying the foundation for future innovation.

**After:** The company opened in 1989 and started with regional projects.

---

## 3. 🟡 Emphasis on notability and media presence

**Markers:** widely covered in the media, earned critical acclaim, featured in leading outlets, maintains an active social media presence, independent sources confirm, has been recognized by experts.

**Problem.** The model tries to prove importance by listing outlets, with no context for what those outlets actually said.

**Before:** Her opinion has been cited by The New York Times, BBC, and Forbes.

**After:** In a 2024 Forbes interview she argued that AI regulation should focus on outcomes rather than methods.

---

## 4. 🟡 Superficial analysis (present-participle tails)

**Markers:** highlighting…, reflecting…, underscoring…, showcasing…, symbolizing…, illustrating…, reinforcing…, demonstrating…, shaping…, cementing….

**Problem.** The model tacks a present-participle clause onto the end of a sentence to fake depth. Often the action is attributed to an inanimate fact: "the date underscores the importance", "the event showcases a trend".

**Before:** The building's architecture uses blue and green tones, echoing the natural beauty of the region and symbolizing the community's connection to the land.

**After:** The architect chose blue and green. He said the colors reminded him of the local landscape.

---

## 5. 🟡 Promotional and travel-brochure language

**Markers:** unique, innovative, groundbreaking, cutting-edge, unparalleled, breathtaking, stunning, must-visit, hidden gem, nestled in, in the heart of (the region), vibrant, rich cultural heritage, harmonious blend, the perfect place, immersive, authentic.

**Problem.** The model reaches for brochure copy instead of neutral description.

**Before:** Nestled in the picturesque heart of the region, this unique town is a true hidden gem with a rich cultural heritage and breathtaking natural beauty.

**After:** The town is known for its weekly market and an 18th-century church.

---

## 6. 🔴 Vague attributions

**Markers:** experts believe, studies suggest, researchers note, critics point out, observers say, many sources confirm, industry reports, a number of analysts, community members.

**Problem.** The model pins opinions on abstract "experts" with no concrete citation. Often it is a hallucination: a pointer to a source that does not exist or is irrelevant.

**Before:** Experts believe the river plays a vital role in the regional ecosystem. Researchers note its unique characteristics.

**After:** According to a 2019 study by the Institute of Ecology, the river is home to several endemic fish species.

See also `source-fabrication.md` — a separate class of cases involving forged DOIs and ISBNs.

---

## 7. 🟢 Formulaic "challenges and prospects"

**Markers:** despite its success, faces a number of challenges, despite these challenges, it continues to thrive, the future looks promising, prospects for growth, in an era of uncertainty.

**Problem.** The model bolts on formulaic sections about "challenges" and "the future" with no specifics.

**Before:** Despite its industrial growth, the city faces the typical challenges of urbanization. Despite these challenges, the city continues to thrive.

**After:** After three IT parks opened in 2015, traffic congestion worsened. In 2022 the municipality began a project to upgrade the storm drainage.

---

## 8. 🟡 Officialese, corporate jargon and nominalizations

**Markers:** utilize (for "use"), in order to (for "to"), pursuant to, leverage, facilitate, at this point in time (for "now"), in the event that (for "if"), with regard to, in a timely manner; nominalizations that bury the verb — "make a decision" for "decide", "provide assistance" for "help", "conduct an investigation" for "investigate", "give consideration to" for "consider".

**Problem.** English AI text drifts into a stiff, official register — especially when asked to sound "professional" or "formal". Plain verbs get wrapped in nouns and prepositions, and short words get swapped for long Latinate ones.

**Before:** The organization utilizes its existing competencies in order to facilitate the provision of consulting services to its clients.

**After:** We advise clients, drawing on our experience.

**False-positive boundary.** In legal documents, contracts, and statutes this register is mandatory and expected. See `false-positives.md`.

---

## 9. 🟡 Text about the text

**Problem.** The opening of an article or paragraph describes the article itself rather than the subject. The heading is treated as the grammatical subject. This shows up most when an LLM is asked to "write an article about…" — it meta-comments on its own output.

**Before:** "The 10 Best Films…" is a curated list that covers the major genres and periods of cinema, reflecting the diversity of the modern film industry.

**After:** 2023 saw the release of films such as *Oppenheimer*, *Barbie*, and *Anatomy of a Fall*.

---

## Cross-links to adjacent classes

The base content patterns (#1–9) are stable; they cross-link to adjacent classes:

- On finding **#1 Regression to the mean** — also check `false-positives.md`, the section "Rhetorical figures in literary prose".
- On finding **#6 Vague attributions** — always run it through `source-fabrication.md` (DOI/ISBN checks, author lifespan checks against publication dates).
- On finding **#3 Emphasis on media presence** in comments, drafts, or wiki talk pages — see `chatbot-artifacts.md` (unambiguous markers such as `:contentReference[oaicite:N]` are often nearby).

---

## Extension: RAG-era pseudo-attribution

### 6a. 🟡 Named pseudo-attribution of the RAG era

**Problem.** The classic pattern #6 pins opinions on abstract "experts". Web-search models (RAG) have learned to look more convincing: they attach a shallow significance-claim to a **named** source — "Roger Ebert underscored the film's enduring influence", "The Guardian noted the project's significance" — whether or not the source says anything of the kind. English Wikipedia ("Signs of AI writing") describes this as a new form of superficial analysis: the construction is the same as in #4 (a significance verdict delivered by a participial tail), but with a real name in place of "experts".

**Markers:** name of a critic / outlet + a significance verb ("underscored", "noted", "highlighted", "hailed as landmark") + an abstract category ("influence", "contribution", "significance", "legacy") — with no quotation and no concrete fact drawn from the source.

**Difference from honest attribution.** A real writer citing Ebert reports a specific judgment or quote ("Ebert called the staircase scene the best of the decade"). The model attributes generic praise that cannot be verified against the passage.

**What to do.** Open the source. If the claim is not there, it is a forged attribution: delete it or replace it with a real quote. Always run `source-fabrication.md` — next to a pseudo-attribution the citation itself often leads nowhere.

**Before:** Film critic Roger Ebert underscored the film's enduring influence on American cinema.

**After:** In his review for the Chicago Sun-Times, Roger Ebert noted that the final scene was shot in a single take with no cuts.
