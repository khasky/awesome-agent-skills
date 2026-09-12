# Fidelity — the notes format, the claims ledger, and proving a fix changed nothing

The source is the boundary, and this file is how the boundary is checked rather than asserted. Three rules sit underneath everything here, each taken from measured failures rather than taste:

- A check needs an anchor outside the writer. A model asked to review its own text without the source or a script in front of it finds factual inconsistencies at close to chance, and an instruction to "be accurate" measurably increases overgeneralization instead of reducing it. So every fidelity step below compares against `source/`, the notes, or a count, never against the writer's memory of what the source said.
- Separation beats a joint reading. Verification questions answered without the draft in view catch errors a reading of the draft next to the source misses.
- Findings, never scores. A judge's number drifts with length, position and its own style; a finding names the rule it breaks and quotes the text that breaks it, so a second reader can check it.

## The source-notes format

`source-notes.md` is written in Phase 1 and every later phase is checked against it. Each fact-bearing line carries an ID in square brackets, and every line that comes from a place in the source carries that place as `(at pN)`, the paragraph number in the extracted text under `source/`. The gate reads both, so the format is exact:

- `Source paragraphs: N` on a line of its own at the top, counted on the extracted text (blank-line separated blocks). The coverage check and the anchor check measure against it.
- The point — one sentence, no ID.
- Candidate ideas — three, each one sentence naming a mechanism or consequence, followed by the IDs of the lines it rests on. The interview shows them; the chosen one is recorded in `campaign.md`, and the other two go to its backlog section (Phase 6) with their IDs, so the next run can start there.
- Supporting claims — `[C1]`, `[C2]`, one line each in the source's own terms, each with `(at pN)`.
- Numbers — `[N1]`, verbatim, with the condition the source attached, each with `(at pN)`. A number without its condition is not repurposable.
- Derivations — `[D1]`: the author's own arithmetic or reading, written in Phase 4 under "The author's own angle" (`references/authored-style.md`), each line naming the IDs it was computed from and showing the computation, and marked as the author's when it is a reading rather than a sum. A `[D]` line is the one addition to the notes allowed after Phase 1, because it introduces no fact the source lacks, only a combination of facts it has; the gate grounds a post's derived numbers against it. A `[D]` line never carries a measurement, a benchmark or an outcome.
- Scope and hedges — `[S1]`: who or what a finding covers (a population, a platform, a hardware tier), preview or beta status, the source's own `may`, `can`, `in our tests`, a result reported in the past tense, a sample size. Compression turns a narrow finding into a general one more often than it does anything else; this section is what a post's sentence is narrowed back to.
- Quotable lines — `[Q1]`, verbatim, in quotation marks, with `(at pN)`.
- Named things — `[E1]`, spelled the way the source spells them.
- What surprised the reader — the counterintuitive part, which a source usually buries in the middle rather than leading with, pointing at the IDs that carry it. It feeds the candidate ideas and the opener; it is never a claim of its own.
- The honest exception — the one limit a reader would hit first, pointing at its IDs. The post's caveat comes from here. Where the source names no limit, this line says so, and the caveat is taken from the Phase 4 verification or narrowed from Scope and hedges; it is never invented to fill the slot.
- Provenance, and What the source does NOT say, as described in `SKILL.md` Phase 1.
- Not transferable to text — only for a spoken source (Phase 1): the demos, the references to something on screen, the audience moments and the live-only asides, each with `(at pN)`, so no post points at a thing the reader cannot see.

## The unit, saved

The unit is written once, whole, and saved as `unit.md` beside the notes after the Phase 4 humanity pass and before any platform version exists. It is the baseline two checks need: the echo check counts a phrase that turns up in more than three posts without being in the unit as boilerplate the adaptation stamped on, and the fidelity pass compares every version's point against the unit's.

## The claims ledger

Pass 1 of Phase 5 writes `claims.md` beside the notes: one table row per atomic claim per post, the claim in subject-and-action form so an entity doing the wrong thing shows as a wrong row, and the IDs that support it.

```text
| post | claim | ref |
| --- | --- | --- |
| linkedin | <subject> <action> <object, with its condition> | C2, N1 |
| x | <subject> <action> | S1 |
```

- `post` is the platform slug (or the whole filename; the gate keeps the last field).
- `ref` is one or more IDs from the notes, or `UNSUPPORTED`. An unsupported claim is a finding whatever it says; the fix is to remove the claim or find the note line that carries it, never to add a note line after the fact.
- A post with no rows is a finding: a post that asserts nothing checkable is either empty or unaudited.
- Framing is not a claim. Having read it, tried it or preferred it is the author's frame (`SKILL.md` Phase 4) and gets no row; a result inside that frame does, and it needs an ID like any other.

The gate checks the ledger mechanically: every row's IDs exist in the notes, no `UNSUPPORTED` survives, every post has rows, and a long-form post drawing on a source of 30 paragraphs or more cites something from its middle third, because summaries are measurably less faithful to the middle of a long text and a long read that only uses the introduction and the conclusion has usually skipped the part that carried the argument.

Every post file also carries `source_anchor: pN` or `pN-pM`, the paragraphs its idea draws on, so the fidelity pass reads one region of the source against it instead of the whole text.

## The mechanical checks against the source

`node scripts/gate.mjs repurpose/<slug>/posts --notes repurpose/<slug>/source-notes.md` adds, on top of the checks that need nothing but the posts:

- grounding — every number, every product or version identifier (a token with a digit or an inner capital) and every quotation of four words or more in a post appears in the notes or in `source/`; quotations match verbatim. An added entity or a changed number is the commonest error compression makes, and it is the one a reader cannot see.
- absolute — `always`, `never`, `guarantees`, `proves`, `eliminates`, `completely`, `entirely`, `perfectly`, `flawless`, `without exception` and `100%` in a post when the source never used the word. The author's own habits in the first person are exempt; a claim about the thing is not.
- anchor, ledger, coverage — as above.
- echo (run level) — a phrase in more than three posts that the unit never had.

These are presence checks, and they are deliberately narrow: a number that is present can still have lost its condition, and a claim whose words all appear in the source can still invert it. That is what the judgment passes are for.

## Checks in a fresh context

Three readings are made by a reader that did not write the posts. Where the runtime has subagents, each is a read-only subagent handed only the files named; otherwise each is done after the drafting context is closed, and the report says the separation was sequential rather than real.

1. Claim verification — given the ledger rows and `source/`, never the posts, it answers for each row whether the cited lines support it, with the condition intact. A row that fails is a fidelity finding on every post that carries it.
2. Cold read of the point — given one post and nothing else, it writes the post's point in one sentence. When that sentence does not match The point in the notes, the post has inverted or drifted the source even if every claim in it is true, which is the error a claim-by-claim check cannot see.
3. Register — pass 4 of Phase 5, given the posts and `references/authored-style.md` but not the drafting history. It quotes the one sentence in each post most likely to read as machine-written, and that quote counts only when it maps to a named rule; a hunch with no rule behind it is noise from the judge, not a finding.

## The shape of a finding

Every judgment finding, in every pass, has three parts, and one without them is not reported:

- the quoted span, verbatim from the post;
- the rule it breaks, named: a gate check, a section of `references/authored-style.md`, or a rule of `SKILL.md` Phase 4;
- a verdict: `SHIP` (noted, no change), `FIX` (a wording change in place), or `REWRITE` (back to the notes).

The Phase 5 gate row a post lands on follows from its verdicts.

## A wording fix is proved harmless

A fix in place is allowed to change wording and nothing else, and the edits most likely to flip a claim are exactly the small ones: removing a contrast frame, cutting a hedge, tightening a sentence. So before any in-place fix, the post is copied to `repurpose/<slug>/before/` under the same filename, and after the fix the gate runs with `--before repurpose/<slug>/before`. It compares the two versions' numbers, identifiers and count of negations (`not`, `no`, `never`, `without`, `none`, `nothing`, `cannot`, `n't`); any difference is a drift finding and the post goes back to pass 1. The copy is deleted when the run's files are final.

## The rewrite budget

A post gets at most two rewrites. A rewrite replaces the version before it only when it adds no fidelity finding and carries no more findings in total; otherwise the earlier version stays and the next rewrite starts from it. A post still failing after the second rewrite stays `status: draft`, its open findings go into `campaign.md` with their quoted spans, and the report names it. An endless loop that ends in a post better than the last one only by luck is the failure this prevents.
