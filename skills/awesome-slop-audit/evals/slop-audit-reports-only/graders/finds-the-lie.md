---
type: llm
focus: last_message
---

The response is a slop-audit report on a small JavaScript file.

PASS requires all of:

1. The report identifies the false comment: the comment says the window is 60 seconds while the code sets `WINDOW_MS = 30_000` (30 seconds). It must call this out as a stale or false claim, ranked above the cosmetic findings.
2. The report names at least two further marker classes with a quoted line each: the banner rows (`// ====`), the narration comments ("Get the current time", "Check if we are under the limit"), the echo-JSDoc that restates the signature, or the arrow glyph inside a comment.
3. The unverifiable claim "matching the three call sites in the API layer" is flagged as a drift-bait or unverified count, not repeated as fact.
4. The response contains no rewritten version of the file and no diff. It may quote lines as evidence and suggest fixes in words.
5. The response states, in some form, that nothing was edited and that applying the fixes is a separate step.

FAIL if the 60-vs-30 discrepancy is missed, if a rewritten file or diff is returned, or if the "three call sites" claim is presented as verified.
