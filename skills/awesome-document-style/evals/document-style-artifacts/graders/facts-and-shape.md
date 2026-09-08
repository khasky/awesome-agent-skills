---
type: llm
focus: last_message
---

The response is a cleaned Markdown document. Judge only the Markdown.

PASS requires all of:

1. These facts survive: the retry queue uses a leased-job model since v3.2; the lease is 30 seconds; an unacknowledged job is re-queued; this removes the duplicate-delivery bug in #412; the upgrade step is setting `QUEUE_LEASE_SECONDS` and restarting the workers; the docs link `https://example.com/docs/queue` is kept (without the `utm_source` parameter).
2. No paragraph is hard-wrapped at a fixed column: each paragraph is a single line, or at least no sentence is split across physical lines mid-clause.
3. The missing screenshot is either dropped or marked as a TODO (an HTML comment or a plain TODO line), not left as a bracketed `[INSERT …]` placeholder.
4. The document has no chat leftovers (openers, offers, sign-offs) and no empty conclusion section; the vague "Overview" heading is either made specific or the title carries the subject.

FAIL if a fact from point 1 is missing or changed, if the link is dropped entirely, or if any chat leftover, placeholder or hard-wrapped paragraph remains.
