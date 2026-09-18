# Domain — PR replies, issue replies, review comments

Covers replies on pull requests and issues, code-review comments, and discussion-thread responses. Short-answer weighting: factuality, specificity, templatedness first; density and tone matter less at this length, but a short reply drowning in filler still fails density.

The tells here are editorial heuristics, not measured findings, except where `sources.md` says otherwise.

## Human baseline

Direct, specific, proportional. Maintainers answer the point in the first sentence, quote the exact code or error, disagree plainly, and say "I don't know" or "won't fix" when that is the truth. Terseness is the norm, not rudeness. Read the thread and the maintainer's other replies first and match that register, not a universal politeness standard. With no thread to sample, this baseline applies.

## AI tells in this domain

| Tell | Fix |
|---|---|
| Praise or thanks opener by reflex: "Great catch!", "Thanks for the detailed report!" | Open with the answer. Thank people when it is genuinely warranted (a first contribution, unusual effort), not as a reflex |
| Restating the question or issue before answering | Delete; the thread already contains it |
| A wall of bullets for a one-sentence answer | One sentence. Length proportional to stakes |
| Hedged non-answers: "There could be several factors…", both-sides mush | Commit: the most likely cause, the check that confirms it, or an honest "I don't know" |
| Boilerplate empathy on bug reports: "I understand how frustrating this must be" | Ask for the repro detail you actually need |
| Sign-offs: "Hope this helps!", "Let me know if you have any questions!" | End at the content |
| Promising work in the reply ("I'll look into this") when the fix is at hand | Do it, then link the commit |
| Perfectly uniform comment structure across a review: every comment praise + issue + suggestion | Vary. Some comments are one word ("nit: typo"), some are paragraphs |

## Rules

1. Answer first. Verdict or answer in sentence one; reasoning after, only as needed.
2. Cite artifacts: `file.py:214`, the commit SHA, the error text verbatim, the doc link. A claim about code points at the code.
3. Disagree plainly with a reason ("This breaks the retry path, see #388"). No apology wrapper, no praise sandwich.
4. State uncertainty honestly and cheaply: "not sure, does it reproduce on 2.4?" beats three hedged paragraphs.
5. Wontfix and out-of-scope: say so, give one reason, link the policy or the issue where it was decided. Do not soften it into ambiguity the reporter must decode.
6. In review comments, mark severity the way the repo already does (blocking vs nit).

## Whitelist

Terse, unadorned replies are the human default in dev venues, not a tell. Issue and PR templates are containers by convention; the tell is filler inside them.
