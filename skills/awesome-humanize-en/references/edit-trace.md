# The editing trace — what a rewrite adds is its own fingerprint

Everything else in this skill hunts the *generation* trace: the words, shapes and structures a model produces. This file guards the *editing* trace: what an editor (human or model) leaves behind when it rewrites someone else's text. The two are different and are checked differently.

**Why it is a separate check.** Measured on English (Shan, Lee and Hao 2026, `sources.md` `SHAN-EDIT-2026`; read second-hand, see the ledger note), machine-edited texts differ from their human sources in a way that is the *reverse* of the generation footprint: generation raises entropy and lexical diversity, editing lowers entropy slightly and cuts the share of content words sharply. Read plainly: an editor's fingerprint is the filler it pours in around the content, not the words it changes. That is why the edit budget in `structure-pass.md` skews replace and delete over insert, and why the tests below run before any rewrite is delivered.

## Two tests, run before delivering a standard, deep or voice-match edit

- **Deletion test**, on every word or phrase you added: strike it. If the sentence still parses and still says the same thing, it was filler. Delete it.
- **Reversion test**, on every replacement: put back what it replaced. If the old wording was sound and said the same in fewer words, keep the old.

**Repair fails both tests and stays.** The article or preposition a broken sentence needs, the subject a split run-on needs, the verb that replaces a nominalization, the reordering that makes an ungrammatical sentence grammatical. Repair is not growth.

**The passage must not end longer than it began**, with one exception: real specificity the author supplied (a name, a number, an object, an action from lived detail). Generic detail added to "fix" vagueness is the documented machine repair and makes the text worse.

## What to restore — the underused human register

Instruction-tuned models systematically suppress the items below (Reinhart et al. 2025, `sources.md` `REINHART-STYLE-2025`: usage at a fraction of the human rate). They may be restored *to the degree the genre and the author's voice allow*, sprinkled, never poured, and only under one condition: the same edit removed filler somewhere in the passage, and the passage did not end longer. An item restored to hit a target rate is the over-correction fingerprint in `structure-pass.md`.

| Restore | Examples |
|---|---|
| Contractions | don't, it's, wouldn't |
| Discourse particles and fillers | well, anyway, just, really, actually |
| Plain causal connectives | because, so |
| Hedges and emphatics of ordinary speech | almost, sort of, for sure, obviously |
| Negation | "no answer was good enough" |
| Pro-verb do | "and she did" |
| Plain speech tags | *says* and *said* on repeat are human; rotating *notes, observes, remarks, muses* is machine elegance |
| First and second person, direct questions | where the point of view permits |
| Blunt or coarse language | where the register genuinely calls for it |

This table is the working form of the "Human syntax" list in `false-positives.md` §F, which describes the same items as signs of a human author. Here they are edits; there they are evidence. Do not read the table as a target: a text that has none of them is not thereby machine-written.

## Density fails in both directions, and register must not drift

- A trimmed answer that lost a required caveat, the next action, or the one number the reader came for fails density just as an inflated one does. Cut filler, not content.
- A rewrite must not come out more promotional, more upbeat, or more confident than its source. Deleting hedges of genuine doubt, adding warmth, or upgrading "seems to" into a flat claim moves stance, and stance is not the editor's to move (see Intensity levels in `SKILL.md`).

## Relation to the other checks

`structure-pass.md` and the pattern catalogs hunt the generation trace before the rewrite; this file guards the editing trace after it; `SKILL.md` Anchor verification guards meaning across the two. Run all three; none substitutes for another.
