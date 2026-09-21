# Revision - the draft is fast, the passes are where the post is made

Writing and judging at the same time produces one of two failures: a careful first sentence and a careless last one, or a body so evenly polished that no person wrote it. Separate them. The draft is written quickly and is allowed to be rough; every later pass has one job, one exit condition, and a count that says it is finished.

Passes run per file, but a pass finishes across the whole pack before the next one starts. Drafting file 12 in the register that pass 3 gave file 3 is how a pack ends up uniform.

## 1. Pass 0 - draft, fast

Write every file to its blueprint and band without stopping to improve a sentence. No re-reading a paragraph before the post is finished, no polishing an opener twice, no switching to another file mid-body.

What a draft may be: rough, over-long inside its band, blunt, missing the closing line's rhythm.

What a draft may never be: missing an anchor the class carries, carrying a fact with no evidence line behind it, or inventing a number to hold a sentence together. Speed is allowed against style, never against fidelity.

Exit: every requested file exists, every anchor the class requires is present, every body is inside its band's ceiling.

## 2. Pass 1 - claims, formulations, sources

The pass that decides whether the pack is true. It is done with the source pages open, not from memory of them.

Write `claims.md` while it runs, one row per assertive sentence in the pack:

```text
file            the platform slug
span            the sentence, verbatim
evidence        [C#] [N#] [V#] [D#] - the line in source-notes.md it rests on
url             the page that settles it, opened this run
verdict         holds | over-stated | scope-drift | stale | unsupported | derived-ok
```

A sentence that asserts nothing (a transition, a question, a stance the voice allows) carries `-` in `evidence` and is skipped. A sentence that asserts something and has no evidence line is not softened into vagueness: it is verified, or it is cut.

The failure classes to look for, in this order, because each is a different repair:

- **Unsupported.** The post states something the source does not and no page was opened for it. Cut it, or verify it and add the `[V#]` line.
- **Over-stated.** The source hedges and the post asserts. `usually` became `always`, `in our tests` became a general claim, `can` became `does`. Restore the hedge in the source's own strength.
- **Scope drift.** The source's condition disappeared: a platform, a version, a plan tier, a region, a workload shape. A number without its condition is the commonest form and the most damaging, because it reads as a fact and is a fact only inside a window the reader cannot see.
- **Stale.** The value was right when the source was written. Correct it per the correction-locality rule in `fidelity.md`, and record the `as of` where the state is temporary.
- **Peer mismatch.** A comparison names a rung the source did not, or the two sides sit at different rungs.
- **Causal overreach.** The source reports that two things happen together and the post says one causes the other.

Then the links, every one of them, in every file:

- Open it. A URL that 404s, redirects to a documentation root, or lands on a login wall is a finding, not a link.
- Read the page and confirm it still says what the post says it says. Documentation moves: a page that carried the command last quarter may now point elsewhere, and the post's sentence is wrong even though the URL resolves.
- Check the anchor text against the destination. A link labelled as pricing that opens a product overview is a broken promise even at HTTP 200.
- Record the check in the `url` column of `claims.md`, so the audit can see the pass ran rather than being told it did.

Exit: every assertive sentence has a verdict, no verdict is `unsupported` or `over-stated`, every URL in every file opened and confirmed this run.

## 3. Pass 2 - structure and section boundaries

Only shape moves here; no sentence is rewritten for sound.

Group each long body into its **top-level parts** - not its headings, its parts. A part is a stretch the reader could stop after and still have something whole: the setup, the economics, the routing decision, the caveats, the closing. A heading names a step; a part is a movement. Most long reads have three to five.

Then place separators on the platforms whose editors carry one, per the support table in `platform-specs.md` section 11a:

- A separator marks a **part** boundary, never a heading boundary. A body with eleven headings and eleven separators has marked nothing.
- At most one per part boundary, and no long read carries more than three. Measured on published articles: separators are rarer than writers assume - two of four sampled dev.to long reads used none at all, and the ones that used them put them around the closing matter rather than between every section.
- Never two in a row, never directly under the H1, never between a heading and the paragraph it introduces.
- Where a heading already marks the boundary clearly, the separator is redundant. Use it where the register changes without a heading, before a closing that steps back from the body, or between two parts that would otherwise read as one.
- On a platform with no separator, the same boundaries are carried by the headings and by a short bridging sentence, never by a row of dashes typed as text.

Also in this pass: the code blocks sit inside the part they belong to, the links sit where the class says, the diagram is where the blueprint puts it, and the block shape matches the class.

Short files have no parts, and this is where they are read as a sequence instead. Take each one line by line and ask what the line before it made the reader expect: the author enters, something sends them looking, the finding lands, the number bears it out. A line that answers nothing the line above it raised is where the post fell apart into a stack, and moving it rarely fixes that - the connective sentence it needed was never written. The arc and its two load-bearing rules are in `SKILL.md` Phase 7.

Exit: every long file has its parts listed in `platform-plan.md`, its separator count inside the rule, and no literal separator characters on a platform that renders none.

## 4. Pass 3 - language, until a person wrote it

The rhythm floors in `creativity.md` section 5 are the measurable half and they are checked here. This pass is the other half: what a reader feels rather than counts.

Read the whole body top to bottom, out loud where that is possible, and fix:

- **Sentences that only announce the next one.** `Let us look at the numbers.` `Here is how it works.` Delete them; the next sentence is the content.
- **Paragraph openers that repeat.** Three consecutive paragraphs opening on the subject's name, or on `The`, or on a participle, read as generated. Vary what the paragraph starts on, not only its words.
- **The missing concrete.** Each part carries at least one detail only someone who did the thing would write: the window that has to be restarted, the file the script backs up, the hour the rate changes. A part with no such detail is the part a reader skims.
- **Uniform paragraph length.** Five paragraphs of four sentences each is a machine's default. The spread matters more than the mean.
- **The tricolon habit.** Three-item lists inside sentences are fine once or twice and become a tic at four.
- **Contractions and plain verbs** where the voice allows them, held consistently through the file rather than drifting.
- **Tense and person consistency** inside a part. A switch mid-paragraph is a tell.
- **The closing line.** Read it alone. A closing that could end any post on the topic ends none of them.
- **Emphasis, last.** This is the pass where a marked span is added or removed, because it is the first pass that reads the whole body as a reader does. Ask of every candidate whether the sentence already carries the stress on its own; where it does, the mark comes out. Where it does not and the source carries a genuine outlier, mark it inside the class ceiling in `authored-style.md` section 10 and write the reason in `variation-plan.md`.

The lexicon bans in `authored-style.md` section 7 and the tell-density rule in `creativity.md` section 8 are counted here rather than eyeballed.

Exit: the rhythm floor for the level is met by count, no check above has an open finding, and the file has been read end to end once without stopping.

## 5. Pass 4 - the pack, not the file

The last pass reads the pack sideways rather than each file top to bottom: openers against each other, closings against each other, titles against each other, the anchors for drift. This is where the variation bounds in `SKILL.md` Phase 6 are checked, and where a pack that passed file by file is caught repeating itself.

## 6. What the passes are not

- Not a loop until it feels right. Each pass has an exit condition and stops there.
- Not a licence to keep rewriting anchors. Anchors are fixed in `anchors.md`; a pass that wants to improve one fixes it there and rebuilds every file that carries it.
- Not a substitute for the audit. Phase 9 counts what these passes were supposed to have produced, and a pass that was skipped shows up there as a count that does not hold.
- Not four full rewrites. Pass 0 writes the text; passes 1 to 4 change what needs changing and leave the rest alone.
