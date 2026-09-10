# Domain — tickets and work orders

Covers issue tickets, tasks, work orders, and bug reports you file (replies to them are `dev-replies.md`). Short-answer weighting.

Adapted from the domain rules of [sepia](https://github.com/Nanako0129/sepia) (MIT); the tells are editorial heuristics, not measured findings, except where `sources.md` says otherwise.

## Human baseline

Imperative, minimal, complete enough. The assignee can start without asking a question and knows when they are done. A tracker's field template is a container, not a tell.

## AI tells in this domain

| Tell | Fix |
|---|---|
| Novel-length background before the ask | Context is only what the assignee does not already know; link the rest |
| A description that restates the title in sentences | The description starts where the title stops |
| Obvious steps enumerated ("1. Open the repository. 2. Locate the file…") | Only the non-obvious steps and the exact commands |
| Vague acceptance: "works correctly", "improved performance" | Testable criteria: the command to run and the output that means done ("p95 < 200ms on the staging load test") |
| Every template field filled with prose for completeness | Empty is a valid value; "N/A" beats a paragraph of nothing |
| Round scope words: "refactor the module", "clean up" | The concrete boundary: which files and functions are in, which are explicitly out |

## Rules

1. Title = outcome, not activity ("Retry queue drops jobs on redeploy", not "Investigate queue issue").
2. Bug tickets: exact repro (versions, commands, input), expected vs actual with real output pasted, frequency. If you cannot reproduce it, say what you tried.
3. Acceptance criteria are testable or they are not criteria.
4. Link, do not repeat: prior tickets, the design doc, the alert. One source of truth.
5. Priority and estimate honest and bare, no justification paragraphs.
