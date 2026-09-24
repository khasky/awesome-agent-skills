# Revision - the draft is fast, the passes are where the post is made

Writing and judging at the same time produces one of two failures: a careful first sentence and a careless last one, or a body so evenly polished that no person wrote it. Separate them. The draft is written quickly and is allowed to be rough; every later pass has one job, one exit condition, and a count that says it is finished.

The long form goes through every pass before the regular is derived from it, because a fact fixed after derivation has to be fixed three times. The regular and the short then take passes 1 to 3 each, and pass 4 reads the three together.

## 1. Pass 0 - draft, fast

Write the form to its shape and under its ceiling without stopping to improve a sentence. No re-reading a paragraph before the form is finished, no polishing an opener twice.

What a draft may be: rough, blunt, missing the closing line's rhythm.

What a draft may never be: missing an anchor the form carries, carrying a fact with no evidence line behind it, or inventing a number to hold a sentence together. Speed is allowed against style, never against fidelity.

Exit: the form exists, every anchor it carries is present, the body is under its ceiling.

## 2. Pass 1 - claims, formulations, sources

The pass that decides whether the form is true, done with the source pages open, not from memory of them. Write `claims.md` while it runs, one row per assertive sentence:

```text
form            short | regular | long
span            the sentence, verbatim
evidence        [C#] [N#] [V#] [D#] - the line in source-notes.md it rests on
url             the page that settles it, opened this run
verdict         holds | over-stated | scope-drift | stale | unsupported | derived-ok
```

A sentence that asserts nothing (a transition, a stance the voice allows) carries `-` in `evidence` and is skipped. A sentence that asserts something with no evidence line is verified or cut, never softened into vagueness.

The failure classes, in this order, because each is a different repair:

- **Unsupported.** The form states something the source does not and no page was opened for it.
- **Over-stated.** The source hedges and the form asserts: `usually` became `always`, `the most common shape` became `most`, `about a dozen` became `twelve`. Restore the hedge in the source's own strength.
- **Scope drift.** The source's condition disappeared: a platform, a version, a plan tier, a region, a workload shape. A number without its condition is the commonest form of it.
- **Count drift.** One population read as another: repositories counted as templates, queried items counted as answered ones, a named list of examples turned into a total.
- **Stale.** The value was right when the source was written. Correct it per the correction-locality rule in `fidelity.md`.
- **Causal overreach.** The source reports that two things happen together and the form says one causes the other.

Then the links, every one in the form: open it, read the page, confirm it still says what the form says it says, and check the label against the destination. Record the check in the `url` column.

Exit: every assertive sentence has a verdict, none is `unsupported` or `over-stated`, every URL opened this run.

## 3. Pass 2 - structure

Only shape moves here; no sentence is rewritten for sound.

The long form is grouped into its top-level parts, not its headings: a part is a stretch the reader could stop after and still have something whole. Most long reads have three to five. A `***` or `---` rule inside the long body marks a part boundary, never a heading boundary, at most three of them, never under a heading and never two in a row. The one before the footer is part of the footer block and does not count.

The regular form is read as a sequence of sections, each earning its heading by carrying something the others do not. The short form has no parts. It is read line by line, asking what the line before it made the reader expect: the author enters, something sends them looking, the finding lands, the number bears it out, the verdict closes. A line that answers nothing the line above raised is where the post fell apart into a stack.

Exit: the parts of the long form are listed in the run notes, the separator count is inside the rule, and the short form reads as one passage.

## 4. Pass 3 - language, until a person wrote it

The rhythm floors in `creativity.md` section 4 are the measurable half and are checked here. This pass is the other half: what a reader feels rather than counts. Read the form top to bottom and fix:

- **Sentences that only announce the next one.** `Let us look at the numbers.` Delete them.
- **Paragraph openers that repeat.** Three consecutive paragraphs opening on the subject's name, or on `The`, read as generated.
- **The missing concrete.** Each part carries at least one detail only someone who did the thing would write.
- **Uniform paragraph length.** Five paragraphs of four sentences each is a machine's default.
- **The tricolon habit.** Three-item lists inside sentences become a tic at four.
- **Tense and person consistency** inside a part.
- **The closing line.** Read it alone. A closing that could end any post on the topic ends none of them.
- **Emphasis, last.** A marked span stays only where the sentence cannot carry the stress alone and the source carries a genuine outlier.

The lexicon bans in `authored-style.md` section 7 and the tell-density rule in `creativity.md` section 5 are counted here rather than eyeballed.

Exit: the rhythm floor for the level is met by count, no check above has an open finding, and the form has been read end to end once without stopping.

## 5. Pass 4 - the three forms together

Read the three side by side: the openers against each other, the closings against each other, the titles against each other, and every anchor for drift. The facts must match exactly and the sentences must not. A regular or short sentence that is a long-form sentence with a word moved is rewritten. Two forms ending on the same closing is a rewrite of one of them.

## 6. What the passes are not

- Not a loop until it feels right. Each pass has an exit condition and stops there.
- Not a licence to keep rewriting anchors. An anchor is fixed in `anchors.md` and every form that carries it is rebuilt.
- Not a substitute for the audit in `SKILL.md` Phase 9, which counts what these passes were supposed to have produced.
- Not four full rewrites. Pass 0 writes the text; passes 1 to 4 change what needs changing and leave the rest alone.
