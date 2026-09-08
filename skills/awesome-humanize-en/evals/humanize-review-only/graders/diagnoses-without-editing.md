---
type: llm
focus: last_message
---

The response should be a diagnosis of the paragraph, not a rewrite of it.

PASS requires all of:

1. The response contains no rewritten or "improved" version of the paragraph — no alternative wording offered as a replacement text. Quoting short spans of the original as evidence is fine and expected.
2. At least three distinct tells are named, each with a quoted span from the paragraph as evidence (for example the "In today's fast-paced" opener, "It's important to note", "plays a pivotal role", the "isn't just a tool; it's a mindset" contrast, the rule-of-three list, "In conclusion", "Hope this helps!").
3. The evidence lines come before the verdict, and the verdict is stated as a count or cluster judgement ("N tells across M categories", "cluster", "probably machine-written"), not as a percentage probability of AI authorship.
4. "Hope this helps!" is identified as a leftover chat turn (an instant marker), not merely as a stylistic weakness.

FAIL if the response rewrites the paragraph, gives a probability like "85% AI", names fewer than three tells, or omits quoted evidence.
