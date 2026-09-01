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

## Rules

1. **The problem before the topic.** The first paragraph is the concrete situation that forced the question. No real situation → the honest genre is "notes on X", not a war story; never invent the incident.
2. **One opinion minimum**, stated as the author's, with the condition under which it does not hold.
3. **Depth by interest, not symmetry.** The section that surprised you earns several times the words of the setup.
4. **Numbers carry conditions, claims carry links, code carries a "this runs" guarantee or a disclaimer.** Everything factual traces to the knowledge map.
5. **Question-sequence check** before writing: if the sections answer *what is X → why X matters → how to X → conclusion*, restructure around what actually happened.
6. **Promotion is a disclosure, not a frame.** The product appears where the work touched it, and the affiliation is stated plainly. An article that also exists on the user's own site sets the canonical URL on every copy that supports one — one piece syndicated, not several competing originals.
7. **Tags per the platform's norm**, from the live check — not a keyword pile. They belong in the platform's own tag field, carried as a `tags` frontmatter list, never appended to the body as bare words.
8. **Emoji, where the campaign uses them at all: three to five across a whole article, and headings are half the point.** A heading takes one at its end — `## What it costs to leave one running 🤑`, `## What I would take away 🧐` — on two or three headings out of five, never on all of them. The rest go in the prose, after the sentence that earned the reaction rather than beside it. Headings and body share one budget, so several paragraphs in a row with none is correct.
9. **Use the formatting the platform actually has, headings first.** An article is a scanned document, so its sections carry real headings, its emphasis is real bold and italic, and its lists are real lists. Shipping one as an undifferentiated wall of paragraphs wastes the only structural affordance the long-form platforms give. What "real" means is per-platform and comes from `platforms.md` and the Phase 3 check: markdown typed literally on `devto`, `hashnode`, `hackernoon` and `write-as`; a rich editor where formatting is applied to a selection rather than typed on `medium` and `telegraph`; and a hard ceiling of two heading levels on `telegraph`. **Markdown pasted into a rich editor publishes as visible `##` characters**, which is the failure this rule exists to prevent, so the post file keeps its markdown and the composer step is what differs.
