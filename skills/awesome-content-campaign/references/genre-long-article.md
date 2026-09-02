# Genre — the long-form article

Covers every platform whose Genre column in `platforms.md` names this file: the ones whose native unit is an article rather than a feed post. That table is the single list and owns the structural facts (editor type, tags, canonical URL, editorial review), together with the Phase 3 live check; this file is about register.

## Human baseline

Motivated by a problem the author actually hit. Uneven by design: five paragraphs on the part that turned out to be interesting, one line on the setup steps nobody argues about. Contains at least one dead end, at least one opinion the reader could disagree with, and numbers with their conditions attached. First person and contractions are normal. Code is real and was run, or is labeled as a sketch.

**Frequency is per campaign, not per day.** These communities treat a stream of announcements as spam. Where a platform reviews submissions editorially, submission is not publication and the schedule must say so; the user's own site publishes instantly and still does not want an article a day.

## AI tells in this genre

| Tell | Fix |
| --- | --- |
| The topic survey opening: "In the world of distributed systems…" | Open at the incident, the bug, or the number that made you look |
| Listicle in a trench coat: prose that is secretly "The first… The second… The third…" | Either an honest list or real prose with an argument |
| Fractal summaries: every section announces what it will say, says it, then recaps | Say it once, at the level where it lives |
| Invented concept labels coined mid-article ("the configuration-drift paradox") | Plain description, or the established term |
| Symmetric coverage: every alternative gets an equal paragraph and none gets a verdict | Commit to a recommendation, and state what would change it |
| No failure anywhere — every step worked, every benchmark confirmed the thesis | Include what broke and what you would skip next time; the dead end is the part readers trust |
| Generic code (`foo`, `my_service`) that was never executed | Real snippets from the actual work, or an explicit "sketch, not run" |
| Benchmarks with no conditions | Machine, version, dataset size, run count — or do not print the number |
| The both-sides conclusion plus a future-outlook paragraph | End on the recommendation or the open question |
| Headings restated by their own first sentence | Delete one of the two |
| Tags dumped as a line of bare words under the last paragraph | These platforms have a tag input; tags go to frontmatter and the prose ends on prose |
| A URL parked alone under the closing line | The closing sentence carries it: `…worth reading in full: <url>` |
| A title that is two sentences joined by a full stop, or runs past ~70 characters | One headline, 50–60 characters, no terminal period; the rest is the first paragraph's job |
| Emoji on some headings and not others | One surface for the whole piece: all headings, or none and the prose instead |
| A bare URL sitting as plain text, or a link shoved into parentheses mid-sentence | Apply the editor's link control to real words; give the link its own closing clause |
| A third-party tool named with no idea what it is | One identifying clause at first mention |
| Literary vocabulary nobody says out loud (`duller`, `says it outright`, `myriad`) | The spoken word: `more boring`, `says it plainly`, `many` |

## Rules

1. **The problem before the topic.** The first paragraph is the concrete situation that forced the question. No real situation → the honest genre is "notes on X", not a war story; never invent the incident.
2. **One opinion minimum**, stated as the author's, with the condition under which it does not hold.
3. **Depth by interest, not symmetry.** The section that surprised you earns several times the words of the setup.
4. **Numbers carry conditions, claims carry links, code carries a "this runs" guarantee or a disclaimer.** Everything factual traces to the knowledge map.
5. **Question-sequence check** before writing: if the sections answer *what is X → why X matters → how to X → conclusion*, restructure around what actually happened.
6. **Promotion is a disclosure, not a frame.** The product appears where the work touched it, and the affiliation is stated plainly. An article that also exists on the user's own site sets the canonical URL on every copy that supports one — one piece syndicated, not several competing originals.
7. **Tags per the platform's norm**, from the live check — not a keyword pile. They belong in the platform's own tag field, carried as a `tags` frontmatter list, never appended to the body as bare words.
8. **Emoji, where the campaign uses them at all: pick ONE surface for the whole article and stay on it.** Either they live in the prose, three to five across the piece, placed after the sentence that earned the reaction; or one sits at the end of **every** section heading. Never both, and never a subset — two headings wearing 🧐 and 🤔 while the other four go bare is the pattern readers notice, because it looks like the writer got bored halfway. A heading run is all-or-nothing: if the fifth heading has no emoji that fits, the article uses the prose surface instead. The article's own title is outside this choice and may carry one either way.

   **The check before shipping:** count headings, count how many carry an emoji. The only passing answers are 0 and all of them.
9. **The title is a headline, not the article's thesis sentence.** Aim for **50 to 60 characters, hard cap 70**, six to ten words, and no terminal period. It names the subject and states the point, and it stops there: a second sentence bolted on with a full stop is two headlines fighting, and it is the shape that gets truncated in search results and in every feed that shows the title alone. `Two Claude Code sessions can message each other` (46) is the headline; `Two Claude Code sessions can message each other. That does not stop them overwriting your files.` (95) is that headline plus the article's first paragraph, and it published as a URL nobody can read.

   **The title becomes the URL** on `devto`, `medium`, `substack`, `hashnode` and `write-as` — every word is slugged into the permalink, so a 95-character title produces `…-that-does-not-stop-them-overwriting-your-files-5f2p`. Write the title short and let the opening paragraph carry the rest of the thought.

10. **The image goes inside the article, directly under the title, before the first section heading** — and into the platform's cover field as well where one exists. A cover slot alone is not enough: several platforms render it small, crop it, or hide it in the feed card only, so the reader scrolling the piece never meets it. Placing it as the first body element after the title is what puts it in front of them, and it is what the author's own earlier articles do. Where the platform has no cover field, the in-body position is the only one.

11. **Name what a tool is the first time it appears.** A reader who does not already know the ecosystem cannot follow a paragraph that compares three products by bare name. The first mention of anything beyond the main subject carries a short identifying clause: what kind of thing it is and, where it matters, how it is switched on. `Agent Teams is the experimental mode where one lead session spawns and supervises teammates, behind CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` and `MCP Agent Mail is the closest third-party attempt` both do this; `Agent Teams does not change this. MCP Agent Mail gets closest with file reservations` assumes the reader already knows both, and loses everyone who does not.

12. **Plain spoken American English.** The register is a competent person explaining something out loud, so the vocabulary stays at the level people actually speak. Rare and literary words are the tell that a machine reached for a synonym: `duller`, `says it outright`, `thus`, `hence`, `myriad`, `plethora`, `albeit`, `heretofore`, `bespoke`, `salient`, `veritable`, `wherein`. Write `less exciting` or `more boring`, `says it plainly` or `spells it out`, `so`, `many`. The test: would you say this word to a colleague at a desk? No → replace it.

13. **A URL in the body is a real link, and never sits in parentheses.** Rich editors do not linkify pasted text, so a bare URL publishes as dead characters — select the words and apply the editor's own link control (`medium`, `substack`, `tumblr`, `telegraph`), or write real markdown where markdown renders. And a link belongs to the sentence that points at it, not stuffed into a bracket mid-clause: `Anthropic says it plainly in the docs (https://…): two agents editing one file…` reads as a citation dumped into a footnote; write the sentence, then hand over the link at its end.

14. **Use the formatting the platform actually has, headings first.** An article is a scanned document, so its sections carry real headings, its emphasis is real bold and italic, and its lists are real lists. Shipping one as an undifferentiated wall of paragraphs wastes the only structural affordance the long-form platforms give. What "real" means is per-platform and comes from `platforms.md` and the Phase 3 check: markdown typed literally on `devto`, `hashnode`, `hackernoon` and `write-as`; a rich editor where formatting is applied to a selection rather than typed on `medium` and `telegraph`; and a hard ceiling of two heading levels on `telegraph`. **Markdown pasted into a rich editor publishes as visible `##` characters**, which is the failure this rule exists to prevent, so the post file keeps its markdown and the composer step is what differs.
