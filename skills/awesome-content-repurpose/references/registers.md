# Registers - reading the subject family and writing in its register

A source type says how the material is organised (`guide/tutorial`, `benchmark/report`, `essay/opinion` and the rest, in `SKILL.md` Phase 0). A subject family says how people who write about that subject actually sound. The two are independent: a tutorial about a deployment pipeline and a tutorial about a morning routine share a structure and share almost nothing else.

Read this file at Phase 0, right after the source type is decided. What the family decides depends on the creativity level (`references/creativity.md` section 4): at level 1 it sets the lexicon, the emoji baseline, the question habit and the heading style, and at levels 2 and 3 it leads the structure as well.

## 1. Deciding the family

Read the signals in this order and stop at the first family whose signals the source actually carries. A source with two families' signals takes the one its own title and first section carry, and the report names the runner-up.

| Signal in the source | Family |
| --- | --- |
| commands, configuration keys, environment variables, install lines, several setup paths | `dev-howto` |
| architecture, protocols, data flow or trade-offs explained without a command to run | `eng-concept` |
| one failure, its symptom, the investigation and what it turned out to be | `incident` |
| measurements, a method, a table of results, conditions attached to numbers | `research-data` |
| a version, a changelog, what shipped, what it replaces | `release` |
| hiring, teams, promotion, burnout, what a job is becoming, what a skill is worth | `career-industry` |
| money as the subject rather than as a number inside something else: pricing, margins, budgets, what a thing costs to run | `business-money` |
| interfaces, layout, typography, naming, what a user sees and how it reads | `design-ux` |
| a first-person experience whose point is the experience, not a technique | `personal-essay` |
| a concept taught from zero, with analogies and deliberately small steps | `learning` |

An unlisted subject takes the family it most nearly behaves like and the report says which, rather than inventing an eleventh row here.

## 2. The families

Rhythm columns are word counts per sentence on prose, matching the floors in `references/creativity.md` section 5. `Ask` is whether a question to the reader is native, and it governs the exclamation mark too: only `sometimes` and `often` families may carry one at all (`references/authored-style.md` section 10). `Emoji` is the baseline before the interview count is applied, and the interview answer never raises a family that sits at zero above one per post - except on a deep article or a mini-blog, where the baseline rises by exactly one because the same count is a different density across fifteen hundred words.

| Family | Rhythm | Structure habits | Opener habits | Closing habits | Ask | Emoji |
| --- | --- | --- | --- | --- | --- | --- |
| `dev-howto` | mean 18-24, wide spread, long sentences around blocks | block then one or two sentences, state what the block buys before showing it, order follows the work | the outcome the reader gets, or the state they are in before it | the limit, the next step, or what to do when it breaks | rare | none |
| `eng-concept` | mean 16-22, longest sentences of any family | claim, mechanism, consequence, then the case it fails in | a distinction the reader already half-knows, stated sharply | a judgment the writer commits to | rare | none |
| `incident` | mean 12-20, short sentences at the turns | chronology, and the wrong hypothesis kept in rather than cleaned out | the symptom as it appeared, in the writer's own terms | what the class of failure teaches, one line, no moral | sometimes | none |
| `research-data` | mean 18-26, conditions attached in subordinate clauses | method, result, what it does not show, why it might be wrong | the question the measurement answers | the limitation, stated before anyone else says it | rare | none |
| `release` | mean 12-18, shortest of the technical families | what changed, who it affects, how to get it | the change itself, no preamble | the upgrade path or the link | no | at most one |
| `career-industry` | mean 12-18, many sentences under 7 words | short sections with conversational headings, personal observation before any general claim | a scene or an observation about people, not a thesis | an invitation, or the writer's own position stated plainly | often | none to one |
| `business-money` | mean 16-22 | number, what it buys, the comparison, the caveat about the comparison | the figure that changes the decision | what the reader should do with the number | sometimes | at most one |
| `design-ux` | mean 14-20 | principle paired immediately with the case it applies to | the concrete problem, named | the rule of thumb, stated as a rule of thumb | sometimes | at most one |
| `personal-essay` | mean 11-17, the widest spread, fragments normal | scenes, not sections, and the point arrives late | a moment, a sentence long | the thought the piece was written to reach | often | none to one |
| `learning` | mean 12-18, deliberately plain | one idea per section, an analogy per idea, a check the reader can do | what the reader will be able to do afterwards | the smallest next thing to try | often | one or two |

## 3. Lexicon, by family

What each family's writers say, and what marks a text as written from outside it. None of this licenses a claim the source does not carry.

- `dev-howto`: exact identifiers, versions and flags in code, display names in prose, imperative verbs. Avoid: `powerful`, `seamless`, `effortless`, and any adjective about how easy the reader will find it.
- `eng-concept`: the domain's own nouns, used precisely and defined once when the audience is broad. Avoid: analogies that have to be maintained for three paragraphs.
- `incident`: plain past tense, the tools named, the wrong turn admitted. Avoid: retrospective omniscience, where the writer knew all along.
- `research-data`: the measured quantity with its unit and its condition, hedges where the evidence hedges. Avoid: a verdict the numbers do not carry.
- `release`: the version, the date the reader needs, the migration cost. Avoid: the announcement voice (`we are thrilled`), superlatives, and a feature list with no consequence.
- `career-industry`: how people talk about work out loud, second person where the reader is implicated. Avoid: management language (`leverage`, `align`, `upskill`) and advice with no cost attached.
- `business-money`: the currency, the period, the unit of the rate. Avoid: a ratio without both sides, and a saving with no baseline.
- `design-ux`: the artifact named (the label, the empty state, the control), the user's action as the verb. Avoid: `delightful`, `intuitive`, and taste stated as fact.
- `personal-essay`: concrete nouns, ordinary words, the writer's own idiom. Avoid: the lesson announced before it is earned.
- `learning`: short words, one new term at a time, the analogy that survives one sentence. Avoid: jargon the piece never defines, and false reassurance.

## 4. Platform norms measured against these families

Measured on 2026-09-19 across the platforms this skill writes for. These are the natives' habits, not instructions to copy wholesale: the interview answers and the caps still bind, and a promotional block or a house rule in `references/platform-specs.md` wins where they conflict.

- Article platforms carry the family almost unchanged: a technical piece there used no emoji, no questions to the reader and headings that stated findings, while a career piece on the same platform ran a third shorter per sentence, used many sentences under seven words and closed by inviting replies.
- Professional feeds run one idea per line with blank lines between them, a hook line first, and numbers early. A dense paragraph reads as an article pasted into a feed.
- Fediverse surfaces run short: sentence means between five and thirteen words, anecdote and blunt opinion, and trending posts frequently carrying no hashtags at all. Tags there still serve discovery, so the run keeps the platform's floor rather than copying a zero.
- The largest microblog and the newer one both showed posts with no hashtags and no emoji, built either from one long sentence or from a run of very short ones, with a result-led first line.
- Developer community surfaces use the platform's own category tags rather than topic hashtags, and ask the room direct questions as a normal register rather than as a closing device.
- Long-form newsletter and publication surfaces put a specific personal claim in the subtitle rather than a list of the sections.

## 5. What the family never decides

- Whether a fact is true, which peer the comparison uses, what a command says, or what the caveat obliges the reader to do.
- The hard caps, the depth bands, the frontmatter contract, the footer's placement or the tag fields.
- Whether a module appears. Coverage belongs to `references/fidelity.md`, and a register that would drop the privacy section is overruled.
- The voice the interview selected. A family sets register, not person: a `personal-essay` source under neutral third person stays in third person.

## 6. Anti-patterns

- Choosing a family from the topic's vocabulary rather than from what the source does. A piece about a payments API that teaches a protocol is `eng-concept`, not `business-money`.
- Writing every platform in the family's register and ignoring the surface. The family sets the voice, the platform still sets the shape.
- Using a family to justify an emoji count the interview did not authorise, or a question on a surface whose blueprint has none.
- Switching family between files of one pack. The pack has one subject and therefore one family, with the runner-up named in the report and used nowhere.
