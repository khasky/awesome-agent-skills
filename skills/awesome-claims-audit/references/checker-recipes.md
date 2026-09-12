# Mechanical check recipes

The claims whose truth is a *value* in code are the ones a machine can settle. Public copy and the code that decides it have no build-time link, so a renamed constant leaves a sentence somewhere else that is simply false: nothing fails, the page just lies. This file is the catalogue of what to assert and how to prove the assertion can fail. How you run the checks is yours — a search, a throwaway program in whatever language the repository already uses, a reading pass where the surface is small. What matters is that each check owns one claim, reports one line, and fails loud.

## The discipline behind every check

- **One check, one claim.** A check that would report two unrelated findings is two checks: what proves it works can only prove one thing at a time.
- **Anchor on the sentence, not the file.** Record the claim sentence the check is about, and narrow the search to the block that holds it. "Somewhere in this page" is how a check stays green after a rewrite deleted what it guarded.
- **A stale pattern is a finding, not a pass.** When the thing a check looks for stops matching, the answer is *the claim this check anchors on is gone, re-point it*, never silence. A check that silently finds nothing is decoration.
- **Narrow to the block.** A file that holds the same value twice (a prerendered map and a runtime one, a list and its optional twin) will answer with the copy you did not mean. Capture the block first, then match inside it.
- **Watch the near-miss identifier.** An `optional_permissions` block answering for `permissions` is the most common wrong answer in this audit. Whatever you search with has to exclude the neighbour that merely looks right.
- **Normalize before comparing.** Copy uses curly quotes and apostrophes where a catalog uses straight ones, wraps differently, and may or may not end in a period. Compare through those differences or a typographic difference reads as drift.
- **One is an idiom.** English renders a count of one as words, not a digit ("about a minute"), so a check on a number needs the alternative wording for that value or it breaks the day the constant drops to one.
- **Pair a quote with its use.** When a check asserts the copy quotes a label, it also asks whether the copy still quotes anything at all: once the site stops quoting, the check guards nothing and is deleted rather than left green.
- **Write the finding as the defect.** Each check carries the sentence that lands in the report: "the FAQ no longer states the real code lifetime", not "checks the FAQ".
- **Name what you did not check.** Every run reports the claims deliberately left unassessed and why, so the gaps are reproducible instead of forgotten.

## The six kinds

**Value** — prose that states a constant. Read the constant from the code that owns it, convert it the way the copy presents it (seconds into minutes, bytes into megabytes), and assert the copy says that. The mirror form asserts a phrasing is *gone*.

**Mentions** — every item of a declared list appears in the copy, one at a time. Two shapes matter and both are worth asserting: the page names each declared item, and no page *denies* one ("no such permission is requested" beside a manifest that requests it).

**List parity** — two lists that must agree. Decide the direction deliberately: equality, or one list a subset of the other (a roadmap the API would reject is a subset claim; a label map covering a closed enum is the reverse). With three lists in play — client, server, site — check all three pairs: any two agreeing proves nothing about the third. Known-deliberate exceptions are listed explicitly, never tolerated silently.

**Proximity** — two statements that must not share a neighbourhood. Some claims are false only in company: an openness claim is true of the list it introduces until someone folds a gated item into the same paragraph. Fix an anchor sentence, a window of text around it, what must not appear inside that window and what must. A missing anchor is reported, never passed.

**Existence** — a link or path the copy offers resolves to something real. Any one of the plausible targets existing is a pass; none existing is a finding.

**Retired** — a sentence that was false once and must not come back. Every finding this audit fixes earns a phrase here, with the reason it was wrong. It is the cheapest guard against a revert, a copy-paste from an old draft, or a translation memory refilling the old wording.

## Two recipes worth copying

**A quoted UI label.** The source is the string catalog entry, reached by its key; the target is the page that quotes it. A renamed label then fails here instead of confusing a user. Curate these by hand — only a person can tell which quoted phrase is claiming to *be* the interface.

**A documented flag.** Copy-pasteable commands are the claim shape that fails loudest: every flag the documentation shows must be one the program actually reads, which is a subset claim in one direction. Check the package name in the same pass — an install-and-run line resolves the package *named* like the binary, which is often not the package that ships it.

## Proving a check can fail

A check that has only ever passed has proven nothing. For each one, break the claim it owns — change the copy to a wrong value, in a working copy you can restore — and confirm that this check, by name, reports it. Then restore. Read three distinct outcomes:

- **Caught.** The check fires on the drift it claims to own.
- **Missed.** The check is looking somewhere too broad. The recurring cause is a whole-file search where the file holds the value twice, so breaking one copy leaves the other answering. Narrow it to the block and give each copy its own check.
- **Setup failed.** The copy moved, so the break could not be applied. The anchor needs re-pointing; the check itself may be fine.

Two conditions around the proof: start from a tree that has no findings, or a real one will be read as your own break, and finish by confirming the surface is back exactly as it was — anything left modified is a mutation that did not restore. Prove a new check in the same edit that adds it; unproven checks accumulate silently.

## Keeping the map and the checks in step

The claim-source map says which claim classes are covered mechanically; the checks say what is really asserted. They drift apart exactly the way copy drifts from code — a check is renamed or dropped and the map still promises coverage nobody has. Compare them in both directions: a row promising coverage no check provides, and a check no row accounts for. The map is what the next audit reads before deciding where a claim lives, so an over-promising map sends it to the wrong file.

## Committing a copy fix out of a shared file

A copy fix lands in files an in-flight feature is also editing — every locale catalog, in practice. Staging takes the file, not the change, so the usual answer commits someone else's unfinished work under a message that does not describe it. Stage the change key by key instead: build the staged version from the committed file plus only the values you changed, leave the working tree untouched so the unrelated edits stay uncommitted, and match the file's own indentation exactly — a mismatch stages the whole file reformatted and buries the real change. Read the staged diff afterwards: nothing you do here can know which of the changes in a file are yours.
