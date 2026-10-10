# Hazard shapes

Small code shapes that compile, pass a skim and make the wrong call easy to write later. Language-neutral: map each to the reader's own language. Each is a heuristic, a reason to look at this hunk, not a violation; report one only where the diff creates it, and drop it where the repo's linter or type checker already blocks it.

| Shape | Why it bites | What to suggest |
|---|---|---|
| Adjacent parameters of the same primitive type (two ids, two amounts, two strings in a row) | Swapping the arguments compiles and runs; the bug surfaces as wrong data, far from the call | Distinct wrapper types, or a single options object with named fields |
| A boolean flag parameter that switches behavior, or two booleans that interact | The call site reads `f(true, false)`; combinations nobody meant are expressible | An enum or two named functions; make the invalid combination unrepresentable |
| `value || default` (or the language's falsy-default equivalent) where `0`, `false` or the empty string is a legitimate value | A real zero or empty string is silently replaced by the default | A nullish-only default, or an explicit presence check |
| A default that hides a decision: currency, tenant, region, retry count, timeout | The caller never chose it, so a wrong value ships unnoticed and the choice is invisible in review | Make the parameter required, or name the default as a constant with a comment on why that value |
| A destructive or bulk operation (delete, update, export) where an empty or missing filter means everything | An unset variable or empty list upstream turns a targeted call into a table-wide one | Reject an empty filter, require an explicit "all" argument, and cap the affected row count |
| A promise or async call that is started and never awaited, or work fired and forgotten | Errors vanish, ordering is lost, and the process may exit before the work finishes | Await it, or hand it to a named background mechanism that logs failure |
| A focused or skipped test marker left in (`.only`, `.skip`, `fdescribe`, a conditional skip with no reason) | The suite goes green while most tests never ran | Remove the marker; if the skip is deliberate, give it a reason and a ticket |
