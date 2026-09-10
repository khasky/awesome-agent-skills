# Domain — technical articles and blog posts

Covers engineering blog posts, tutorials, architecture write-ups, experience reports. The richest domain: article-like weighting, the discourse pass in `structure-pass.md` (#26–31), and the full sentence-level catalogs.

Adapted from the domain rules of [sepia](https://github.com/Nanako0129/sepia) (MIT); the tells are editorial heuristics, not measured findings, except where `sources.md` says otherwise. The four tells marked (9a–9d) also live in `content-patterns.md` as patterns, so they count toward the tell total.

## Human baseline

Motivated by a real problem the author actually hit. Uneven by design: deep where it got interesting, one line where it did not. Contains at least one dead end, at least one opinion the reader could disagree with, and numbers with their conditions attached. First person and contractions are normal.

## AI tells in this domain

| Tell | Fix |
|---|---|
| The topic-survey opening: "In the world of distributed systems…", a definition of the thing every reader already knows | Open at the incident, the bug, the number that made you look |
| Listicle in a trench coat (9b): prose that is secretly "The first… The second… The third…" | Either honest structure (a real list or table) or real prose with an argument |
| Fractal summaries: every section announces, tells, recaps | Say it once, at the level where it lives (`structure-pass.md` #30) |
| Invented concept labels (9a): "the observability paradox", "configuration drift syndrome" coined mid-post | Plain description, or an established term |
| Symmetric coverage: every alternative gets a paragraph, none gets a verdict | Commit to a recommendation and give the case that would change your mind (`structure-pass.md` #29) |
| No failure anywhere (9d): every step worked, benchmarks confirm the thesis | Include what broke, what you tried first, what you would skip next time. Models systematically omit the dead end, and it is the part readers trust |
| Generic code examples (9c) with `foo` and `my_service` that were never run | Real, runnable, tested snippets from the actual work, or an explicit "sketch, not run" |
| Benchmarks with no conditions (9c) | Machine, version, dataset size, number of runs, or do not print the number |
| The both-sides conclusion plus future outlook | End on the recommendation or the open question you actually have (`structure-pass.md` #31) |

## Rules

1. The problem before the topic. First paragraph: the concrete situation that forced the question. If there is no real situation, the honest genre is "notes on X", not a war story; never fabricate the incident.
2. One opinion minimum, stated as yours, with the disagreement condition ("if your writes are under 1k/s, ignore all of this").
3. Depth budget by interest, not symmetry: the section that surprised you gets five times the words of the setup steps.
4. Numbers carry conditions; claims carry links; code carries a "this runs" guarantee or a disclaimer.
5. Question-sequence check (#27): if the sections read *what is X, why X matters, how to X, conclusion*, restructure around what actually happened.
6. Voice: first person, contractions, an aside or two. The measured human markers (stance, unevenness, lived specifics) are the same ones expert readers use to judge "a person wrote this".
