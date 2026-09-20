# Creativity - what the dial moves, and what it never moves

The interview asks for a level 1 to 3 (`SKILL.md` Phase 1). This file says what each level permits, what it requires, and what stays fixed at every level. Read it at Phase 1, before the brief, because the level changes what Phase 6 plans and what Phase 9 counts.

## 1. The problem the dial exists to solve

A pack can satisfy every rule in this skill and still read as machine-made, because the rules decide one shape and the run applies it to whatever came in. Two packs built from unrelated sources were measured against each other while this file was written: 11 sentence-opening phrases were shared across both packs, 108 times in total, every one of them an anchor stem; a fifth of the files carried a byte-identical block sequence; and both packs kept almost every sentence between 15 and 35 words. Nothing was false and nothing was copied. They were the same skeleton wearing two subjects.

So the dial does not add decoration. It decides how much of the skeleton the run is allowed to choose for itself, and how much of the phrasing is written once and reused.

A second finding binds the whole file: the fix for uniform rhythm is not a prescribed rhythm. Mechanical long-short-long alternation is its own fingerprint, and a pack that alternates on a schedule has traded one tell for a newer one. Every rhythm rule below therefore sets a **spread** and bans **clustering**, and none of them prescribes an order.

## 2. The floor no level lifts

The dial governs shape and phrasing. It never governs truth, and it never buys license to invent. At level 3 exactly as at level 1:

- every number keeps the condition it was verified under, every peer stays the one Phase 3 locked, every command stays line-for-line what the source or the official page shows;
- no fabricated first-person experience, no manufactured stakes, no invented specifics, no performed candor, no contrarian stance the source does not support. A higher level asks for a more human voice, not for material the run does not have;
- hard caps, the frontmatter contract, the footer byte-for-byte, the platform tag fields, the media and publishing separation;
- ASCII punctuation, no semicolons. Both are rendering and tell decisions rather than style ones: the em dash reads as machine-made in this genre now, and a run of semicolons is the plainest tell a body can carry;
- the caveat's content, the privacy line and any safety-bearing sentence. Their wording may move at levels 2 and 3; what they oblige the reader to do may not;
- the source promise and the module coverage of `references/fidelity.md`. A livelier pack that quietly drops half the source is a worse pack.

When a level's permission and the floor disagree, the floor wins and the report says which sentence it held back.

## 3. The run fingerprint

Variation that comes from a coin toss cannot be re-run, reviewed or explained. Variation that comes from the source can. Before Phase 6, compute one small number from the source itself and use it to index the catalogs:

```text
fingerprint = (count of [C] claims
               + 3 x count of [M] modules
               + count of characters in the primary subject
               + count of [N] numbers) mod 12
```

Two different sources give different fingerprints, so two packs differ structurally without anyone choosing to differ. The same source gives the same fingerprint, so a second run is explainable and a defect is reproducible. Record it in `editorial-brief.md` beside the level, and name it in the report.

Where a catalog has `k` entries, the run starts at `fingerprint mod k` and walks forward, which is what keeps the first choice from being the first row of every table on every run.

## 4. The levels

| Level | Name | In one sentence |
| --- | --- | --- |
| 1 | Normal | The rhythm opens, the frames speak like a person, and part of the pack takes a documented alternate shape chosen by the fingerprint. |
| 2 | Medium | The register leads the structure, anchors carry registered variants, and openers may be invented rather than picked. |
| 3 | High | The pack is composed as a writer would compose it, from the module map rather than from the blueprint, with the floor intact and the repetition checks tightened. |

Level 1 is the floor of the dial and the default answer. There is no level below it: a setting that only reproduced the blueprint produced packs that were uniform without being safer, and safety lives in section 2, which every level carries in full.

### What each axis does per level

| Axis | 1 | 2 | 3 |
| --- | --- | --- | --- |
| **Structure** | blueprint default per class, with up to a third of the files taking an alternate from section 6 and the long forms taking one section-order variant, both by fingerprint | every class re-planned: the blueprint is the fallback, the register is the lead; no two files in a class share a section order | composed from the module map; the blueprint informs, it does not decide; a class may carry two different takes on the same source |
| **Anchors** | verbatim, with the frame prose around them written per platform | 2 to 3 registered variants per anchor, each verified once, assigned per class, never per post | re-voiced per post, with numbers, conditions, peers and named cases frozen; the audit compares facts, not strings |
| **Rhythm** | spread floor B (section 5), fragments allowed above the hard caps | spread floor C, fragments common, one self-correction and one hedge per long form | spread floor C with no ceiling, one-word sentences allowed anywhere above the hard caps |
| **Openers, titles, closings** | catalogs plus register-native moves, distributions as Phase 6 states them | invented moves allowed when they pass the opener tests in `references/authored-style.md` | free, with the three opener tests and the title spine the only survivors |
| **Register authority** | sets lexicon, emoji baseline, question habit and heading style | decides structure, length target inside the band, and which platforms get the long treatment | decides everything the floor does not |
| **Frame liberty** | contractions, direct address, one aside per long form | idiom, hedges, visible self-correction, opinion stated plainly | humor, running voice, asides anywhere, the author's own vocabulary |
| **Surface norms** | tag counts anywhere inside the platform's range, emoji as `references/platform-specs.md` states them under the family cap | the register may take a surface to its floor where the platform's own natives sit there | the register decides, with the platform's discovery floor the only limit |
| **Echo and specificity** | the thresholds in `references/authored-style.md` section 11 | tightened: no prose sentence in 2 files, every claim carries a named referent | tightest: no 6-word span in 2 files, and every post carries at least one detail no other post in the pack carries |

The last row is the inversion that makes the dial safe. As format constraints loosen, sameness constraints tighten, because repetition is the tell that survives every other change.

## 5. Rhythm, as spread rather than as pattern

The floors below come from published posts measured on 2026-09-19 on the platforms this skill writes for, not from another project's numbers. Two long posts by different authors in different families were measured sentence by sentence:

```text
technical write-up   57 sentences, mean 20.5, spread 2 to 65,
                     39% inside the 10-to-20-word band,
                     longest run of near-equal sentences 4,
                     one sentence under 7 words per 195 words

career essay        109 sentences, mean 14.7, spread 2 to 40,
                     39% inside the band,
                     longest run of near-equal sentences 4,
                     one sentence under 7 words per 59 words
```

Feed posts on four networks ran shorter, with sentence means between 5 and 17 words. The packs this skill produced before the dial sat at a standard deviation near 4, with almost nothing under 10 words or over 35.

Two things follow, and the second one corrected an earlier draft of this file. Human prose is far more spread than the packs were. It is also **not** free of repetition: a run of four consecutive near-equal sentences turned up in both posts, so a rule forbidding three would flag real writing as machine-made.

The floors, per level, measured on the prose of one file after the frontmatter, excluding code, lists, the tag line and the footer:

```text
floor B (level 1)   longest at least 25 words longer than the shortest
                    at most 60% inside the band
                    at least 1 sentence under 7 words per 300 words of body
                    at most 4 consecutive sentences within 3 words of each other

floor C (levels 2-3) longest at least 30 words longer than the shortest
                    at most 50% inside the band
                    at least 1 sentence under 7 words per 200 words of body
                    at most 4 consecutive sentences within 3 words of each other
                    paragraph lengths on a long form span at least 1 to 5 sentences
```

Both measured posts clear floor C, which is the point: the floor describes writing that exists rather than a target invented for the skill. A file under 200 words of prose is measured on the spread and the run only, since the short-sentence rate needs a body to be a rate of.

Hard caps are exempt from the band percentage and the short-sentence rate, and keep the run limit: three or four sentences of near-equal length inside 280 characters is most of what makes a short post read as generated.

**The run limit is one-directional.** It forbids monotony. It does not ask for alternation, and a file whose lengths read long-short-long-short-long has failed the spirit of the floor while passing its arithmetic: report it and rewrite it.

## 6. Structure alternates

The blueprint table in `references/platform-specs.md` is the level-0 default, not the only legal shape. These are the moves a run may apply to a file, chosen by fingerprint, subject to the per-level count in the table above. Each move keeps the class's caps, its coverage mode and its link count.

| Move | What changes | Where it is safe |
| --- | --- | --- |
| `order-swap` | the economics section and the troubleshooting section trade places | long forms, mini-blogs |
| `caveat-first` | the limit opens the body instead of closing it | community surfaces, feeds |
| `gotcha-lead` | the failure the reader will hit opens the post, the setup follows | long forms, `reddit`, `telegram` |
| `story-lead` | one concrete situation from the source opens, then the mechanism | feeds, mini-blogs, essay-family sources |
| `answer-first` | the recommendation opens, the body earns it backwards | community surfaces, `quora`, `daily-dev` |
| `merge-sections` | two adjacent secondary modules share one heading | long forms over their band |
| `split-proof` | the proof splits into a rates block early and a ranges block at the close | deep articles only |
| `heading-voice` | headings state the finding instead of naming the module | every surface with headings, levels 1 and up |
| `no-headings` | a long form runs as continuous prose with bold leads | mini-blogs, `wonderful-dev`, levels 2 and up |
| `list-to-prose` | a task list becomes two sentences | anywhere a list would be the third in the file |
| `prose-to-list` | a dense paragraph becomes a short list | feeds and community surfaces only |
| `close-on-question` | the closing question replaces the closing stance | where the blueprint allows a question at all |
| `close-on-detail` | the post ends on the smallest concrete fact rather than a judgment | every class, levels 2 and up |

Two rules bind the moves at every level: no file changes more than two moves at once, and no two files in one presentation class take the same combination. A class whose files all took `heading-voice` has a new template rather than variety.

## 7. Anchors under the dial

The anchor layer is what makes the pack one family, and it is also the loudest source of sameness. The compromise is registered variation rather than free paraphrase.

- **Level 1.** One string per anchor, verbatim, with the frame prose around it written per platform.
- **Level 2.** Each anchor may carry 2 or 3 variants. Every variant is written in `anchors.md`, verified once against the same evidence line, and assigned to whole presentation classes rather than to individual posts. A reader who follows the author on three feeds meets one wording; a reader who also reads the long form meets a second. Numbers, units, conditions, peer names and the named cases of the split are identical across variants, and the audit compares those, not the prose.
- **Level 3.** The anchor is a fact set rather than a string: the proof carries the subject tier, each peer with its own range, and the basis; the split carries its named cheap-path tasks and its named escalation cases and its escalation target; the caveat carries the things not to send and the alternative. Each post writes them in its own words, and the audit checks that every element of the fact set is present and unchanged in meaning. A post that drops a peer, merges two ranges, or softens the caveat into advice fails, exactly as it would at level 1.

Whatever the level, a number never varies, a peer never swaps, and the `setup-` blocks never change at all: code is not prose and re-voicing a command is a defect at every level.

## 8. Tell density rather than a ban list

A banned-word list produces prose that dodges the list. Count instead, per 200 words of body: a single machine-favored construction is noise, three in one paragraph is a rewrite. What counts as one:

- a nominalization where a verb was available, a transition word that names a relation the sentence order already shows (`additionally`, `moreover`, `furthermore`), a triad where the material has two items or four;
- the `not X, but Y` frame, the `it is not only ... but also` frame, an announced thought (`the key insight is that`), a summary that restates the paragraph above it;
- a stock intensifier (`crucial`, `pivotal`, `robust`, `seamless`, `powerful`), an abstraction standing where a named thing belongs;
- a sentence whose subject is the post itself.

The count is reported per file at levels 2 and 3, where the looser frames make these easier to slip in. Technical terms that are the only precise word for the thing are not tells and are not counted, and a construction quoted from the source keeps its quotation marks and is exempt.

## 9. What the level does to the audit

Phase 9 reads the level and applies the matching thresholds. Findings carry a severity, and the severity decides what blocks delivery:

```text
P0  floor breach: a fact, a number, a peer, a command, a cap, a frontmatter key,
    an invented specific, a missing module. Blocks at every level.
P1  the level's own requirement missed: rhythm floor, structure-alternate count,
    anchor-variant assignment, echo threshold, register mismatch. Blocks.
P2  polish inside the level's allowance. Reported, fixed where cheap, never blocking.
```

Numbers the report carries, per level and per file where the check is per file: the fingerprint, the level, sentence count, mean and spread, shortest and longest, the share inside the 10-to-20-word band, the longest run of near-equal sentences, fragments used, structure moves applied, anchor variants in play, tells per 200 words at levels 2 and 3, and the echo counts at the level's threshold.

Count them. A number that was not counted is not reported: an asserted rhythm score is the same fabrication this skill refuses everywhere else.

## 10. Anti-patterns of the dial

- Treating a higher level as permission to invent a detail, a result, a stake or an opinion the source does not carry. That is the one thing no level allows.
- Prescribed alternation: writing long-short-long to satisfy a spread floor.
- Applying one alternate to a whole class, which is how a new template is born.
- Paraphrasing an anchor at level 1 because the post felt repetitive. The frame around it is what varies there.
- Re-voicing a `setup-` block, a config block or a command at any level.
- Letting a register loosen the caveat, the privacy sentence or a safety-bearing line.
- Reporting rhythm numbers that were never counted, or a fingerprint that was never computed.
- Raising the level to rescue a thin source. A source with two facts produces a short pack at every level.
