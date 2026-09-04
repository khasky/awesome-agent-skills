# Smell baseline

The fixed set of design smells the Standards axis carries even when a repository documents no conventions of its own. Catalogued in Martin Fowler's _Refactoring_ (2nd ed., ch. 3); the phrasing here is compressed to what a reviewer needs at the diff.

Two rules bind the whole list:

- **The repository overrides.** A documented standard always wins. Where the repo endorses something this list would flag (a deliberate Middle Man in an anti-corruption layer, primitives everywhere in a hot path), suppress the smell rather than arguing with the house style.
- **Every entry is a heuristic, never a violation.** Report it as "possible Feature Envy here", with the hunk quoted, and let the author disagree. A smell is a reason to look, not a verdict. Skip anything a linter or type-checker already enforces — a review that repeats tooling wastes the round.

Each smell reads *what it is on this diff* → *the direction of the fix*.

| Smell | What it looks like in the diff | Fix direction |
|---|---|---|
| **Mysterious Name** | A function, variable or type whose name does not say what it does or holds | Rename it; if no honest name comes, the design under it is murky |
| **Duplicated Code** | The same logic shape in more than one hunk or file of this change | Extract the shape once, call it from both sites |
| **Long Function** | A function that has grown past the point where its steps read as one idea | Extract the steps that have their own names; guard clauses over nesting |
| **Long Parameter List** | Parameters accumulating on a call the change touches | Bundle the ones that travel together into a type, or pass the object that already holds them |
| **Feature Envy** | A method reaching into another object's data more than its own | Move the method onto the data it envies |
| **Data Clumps** | The same few fields or parameters keep travelling together — a type wanting to be born | Bundle them into one type and pass that |
| **Primitive Obsession** | A string or number standing in for a domain concept with its own rules (money, ids, units) | Give the concept a small type of its own |
| **Repeated Switches** | The same `switch` or `if`-cascade on the same type recurring across the change | Polymorphism, or one map both sites read |
| **Shotgun Surgery** | One logical change forcing scattered edits across many files in this diff | Gather what changes together into one module |
| **Divergent Change** | One file edited in this diff for several unrelated reasons | Split it so each module changes for one reason |
| **Speculative Generality** | Abstraction, parameters or hooks added for needs the spec does not have | Delete it; inline back until a real second caller shows up |
| **Message Chains** | Long `a.b().c().d()` navigation the caller should not depend on | Hide the walk behind one method on the first object |
| **Middle Man** | A class or function that mostly delegates onward | Cut it; call the real target directly |
| **Insider Trading** | Two modules trading private detail through a back channel | Move the shared thing to one owner, or introduce an explicit interface |
| **Refused Bequest** | A subclass or implementer ignoring or overriding most of what it inherits | Drop the inheritance; use composition |
| **Comments as deodorant** | A comment explaining what a confusing block does | Rename or extract until the comment is unnecessary; keep comments for *why* |

## Which of these belong in the review

- **Only where the diff creates or worsens them.** A smell that already lived in the file and is untouched by the change is a note at most; demanding its cleanup inside an unrelated PR is scope creep with a citation attached.
- **Ranked with everything else.** These compete for the round's five to seven slots against correctness and security findings, and they usually lose. One structural smell that explains several others is worth reporting; a list of twelve is a wall the author will scroll past.
- **With a location and a direction.** "Possible Data Clumps at `orders.ts:88` — `userId, tenantId, locale` travel together through four signatures in this diff; a `RequestContext` type would carry them" is actionable. "This could be cleaner" is not.
