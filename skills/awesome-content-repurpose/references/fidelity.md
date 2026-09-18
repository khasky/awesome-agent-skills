# Fidelity - the evidence model and the checks that keep the source central

Every check here compares against `source/`, the notes, or a count, never against the writer's memory of what the source said. Findings name a rule and quote a span; nothing is scored.

## 1. Evidence notes

`source-notes.md` opens with `Source paragraphs: N`, `Source type`, `Primary subject`, `Source promise`, then evidence lines, each with its position `(at pN)` where it comes from the source:

```text
[C1] <claim in the source's own terms> (at pN)
[N1] <number + the exact condition the source attaches> (at pN)
[S1] <scope, hedge, preview status, population, platform> (at pN)
[Q1] "<verbatim quotation>" (at pN)
[E1] <exact product, model or tool spelling>
[V1] <verified current fact>  source: <official URL>  checked: <date>  propagation: core | local | long-only | omit-short
[X1] source said: <stale statement>  current: <verified correction>  source: <URL>  checked: <date>  propagation: ...
[D1] <derived value>  inputs: N1, V2  calculation: <explicit arithmetic>
```

A number without its condition is not reusable. A `[D]` line combines grounded numbers and never invents a measurement. `local` is the default propagation; `core` is reserved for a fact that changes the reader's main decision; exact windows, alias and deprecation history, policy and jurisdiction wording are `long-only` or `omit-short`.

## 2. The module map

```text
[M1] <module name>
role: primary-path | secondary-path | decision-axis | caveat | troubleshooting | auxiliary-detail
portable takeaway: <one sentence that survives a hard cap>
medium details: <supporting specifics for feeds>
deep details: <raw rates, exact windows, policy wording, alias history, long config>
representation: prose | list | steps | code/config | table | mixed
evidence: C#, N#, S#, Q#, E#
```

At most 2 `primary-path` modules. The map is structural evidence: a post can be accurate in every sentence and still be unfaithful when it drops most modules for one derived theme. For a guide, module coverage is a first-class check; for the other source types the modules follow the blueprints in `platform-specs.md` section 5.

## 3. Ledgers

`claims.md`, one row per atomic factual claim per post: `| post | claim | evidence |`. Every factual claim has evidence; framing and opinion need no row; no `UNSUPPORTED` survives; quotations stay verbatim; a volatile claim cannot rest on old source text alone when verification was required.

`coverage.md`, one row per post: `| post | modules present | modules grouped or omitted, with the platform reason |`. A long-form version that omits core modules without a platform reason fails.

## 4. Verification is correction and support, not expansion

Research may validate a claim, update a stale value, name or command, supply the current value a source-requested comparison needs, or settle a caveat that changes usability. It may not discover a new theme and make it the article, add a detailed policy regime to a source that gives a generic warning, add unrelated benchmarks, or build a framework from adjacent documentation. Long-form balance: source-origin facts at least twice the externally added ones, corrections of stale claims exempt.

## 5. Comparison peers

Resolve once, before any draft, and lock for the run:

1. the exact model the source or user names;
2. else the exact family or tier named;
3. else, when only a provider or product brand is named, rung 2 of that provider's current flagship family, counting rungs from the top of its own pricing page (rung 1 premium, rung 2 standard, rung 3 and below small); rung 1 only when the family has two rungs; a tier the source names by name fixes the rung for every family; both peers sit at the same rung; record the page, the ladder and the rung;
4. else omit the peer.

Never the peer: a client's current default model, a premium top rung, a preview, a reasoning-only or specialist model, a product-bound model, or any model chosen because its page was easier to find. When a routine tier and a premium tier are both named, the routine tier is the headline peer and each family's premium rung is an optional extra line in `proof-full`. Up to two provider families. Every ratio: verified API against verified API, like units, input and output distinguished, peak and off-peak distinguished, recorded as `[D]`, one range per peer, rounded to a readable range. A same-provider tier table is supporting detail, never the proof. Changing a peer on one platform is drift.

## 6. Correction locality

A `[X]` correction repairs the stale statement where it occurs. The current correct name goes into every block silently. The sentence explaining the change appears once, in the relevant setup section, on the two deepest surfaces at most, unless the correction is `core` (it changes the reader's decision), in which case one sentence travels to every surface that carries that decision and may carry an `as of <date>` qualifier. A correction repeated across sections, or promoted to its own section without being a source module, is drift.

The same budget binds source-derived deep details: exact clock windows, jurisdiction and storage wording, retired names, long diagnostic sequences appear on at most 2 files, inside their module, on the deepest surfaces; a workload cost example on at most 3.

## 7. Commands

Publish a command only if it appears in the source and remains valid, or was corrected or confirmed by current official documentation. Never infer a variable name or flag from a similar tool, and never add a launch line, a variable or a step to a block because it seems implied: a setup block is the source's lines and nothing else. A remote script URL may appear in a code block when the official source documents it; it is never a frontmatter link. The minimal setup block per primary path is identical on every surface that shows it.

## 8. Personal framing

Voice is not evidence. Allowed without a ledger row: `I would use`, `I like the separation between`, `for me the useful part is`, `I have been looking at X as Y`. Not allowed without source or user evidence: `I tested`, `we deployed`, `it saved us`, `it caught`. A personal frame that carries a measurable outcome needs a row.

## 9. Title drift

A title fails when it no longer names the primary subject or turns a practical guide into a generic essay. Cold test: could this title be reused unchanged for ten unrelated tools? Then it is too abstract.

## 10. Clean run

By default ignore runtime memory, previous posts and previous briefs; derive type, modules and anchors from the supplied source; verify normally; ask the four interview questions. Stability across reruns comes from the classification, the module map, the anchors and the blueprints, never from replaying prior prose.

## 11. Drift after editing

After any wording fix re-check numbers, model and tool names, negations, peers, commands, module coverage and the caveat against the copy taken before the fix. A shorter version may omit detail; it may not change a claim.

## 12. Finding format

```text
post:
span:
rule:
verdict: FIX | REWRITE
```

`REWRITE` for source-promise drift, major module loss on a long surface, an unsupported current claim, wrong voice, or the wrong source type's structure. `FIX` for local wording or format. An anchor defect is fixed in `anchors.md` and every carrier is rebuilt.
