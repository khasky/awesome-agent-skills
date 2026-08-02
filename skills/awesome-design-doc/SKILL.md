---
name: awesome-design-doc
description: "Produces a design document or ADR for a feature or architectural decision: requirements and scale numbers first, real alternatives with trade-offs, a recommendation grounded in the requirements, explicit non-goals and migration path. Use when asked to 'write a design doc', 'write an ADR', 'design this feature/system', 'which approach should we take', 'спроектируй', or when awesome-code-review requests an ADR for a load-bearing decision. Do not use for auditing an existing architecture — use awesome-architecture-audit; not for HTTP resource modeling details — use awesome-api-design."
license: MIT
metadata:
  author: Khasky
  tags: ["design", "adr", "architecture", "planning"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-design-doc"
---

# Design Doc / ADR

Turn a feature request or architectural question into a decision a team can execute and a future reader can retrace. The core discipline: requirements and numbers before components, real alternatives before a recommendation, and a recommendation before the end — a document that tours options without choosing is a meeting agenda, not a design.

## When to Activate

- "Design X", "how should we build Y", "write a design doc / ADR / RFC".
- A reviewer flagged a load-bearing decision that needs an ADR (awesome-code-review hands the format here).
- Two credible approaches exist and the choice is expensive to reverse.

Do **not** activate for reversible everyday choices (naming, a helper's location) — an ADR for those is noise; the three-condition test below decides.

## When an ADR is warranted

All three, or don't write one:
1. **Expensive to reverse** — schema, public API shape, persisted format, event name, framework/storage choice, service boundary.
2. **Crosses a boundary** — more than one module, team, or service must honor it.
3. **The context would be lost** — six months from now, the "why" is not recoverable from the code.

One-page ADR for a single decision; full design doc when the feature needs a data model, API surface, and rollout plan together.

## Work Process

1. **Requirements before components** — functional requirements as testable statements, then the constraints that shape the design: expected scale (users, QPS, data volume and growth), latency targets, consistency needs (what must be read-your-write, what can lag), availability expectations, compliance boundaries. Getting the scope wrong makes a technically impressive design solve the wrong problem — clarify with the user before designing, not after.
2. **Back-of-envelope the load** — requests/sec, storage/year, working-set size, fan-out per action. Three lines of arithmetic kill more bad designs than any diagram; a design without numbers is a vibe. State the assumptions so a reader can re-run the math when the assumptions age.
3. **Sketch the contract before the internals** — the API endpoints or events in/out, and the data model's core entities with their invariants. The contract exposes scope errors while they are still cheap (`awesome-api-design` for HTTP resource detail).
4. **Generate 2–3 genuine alternatives** — including the simplest thing that could work ("do nothing" or "a cron job and a table" is often a legitimate contender). An alternative added only to be knocked down is padding; each one gets its honest best case.
5. **Evaluate on the trade-off axes the requirements activate** — not a fixed rubric: consistency vs availability, sync vs async, SQL vs NoSQL, monolith-extension vs new service, build vs buy, latency vs cost. For each active axis, say which side the requirements favor and why. Skip axes with no tension — padding dilutes the load-bearing analysis.
6. **Recommend, grounded in requirements** — one recommendation, tied by name to the requirements that drove it ("eventual consistency suffices because the feed tolerates 30s lag — that unlocks the cheaper fan-out-on-read"). State what new information would flip the decision.
7. **Name non-goals, risks, and the path** — explicit non-goals (what this deliberately does not solve, so scope creep has to argue with a sentence), the top risks with their mitigations, the migration/rollout order for existing data and consumers, and the rollback story (`rules`-level deploy discipline applies; a design that cannot roll out incrementally gets that called out here, not discovered in the PR).

## ADR format

```text
# ADR-<n>: <decision, stated as a decision>
Status: proposed | accepted | superseded by ADR-<m>
Date: <date>

Context: <the forces — requirements, constraints, numbers — that make this a decision at all>
Decision: <what we will do, one paragraph, active voice>
Alternatives considered: <each with its honest best case and why it lost against the requirements>
Consequences: <what becomes easier, what becomes harder, what debt is accepted knowingly>
Non-goals: <what this decision deliberately does not cover>
```

## Output Format

Full design doc: Title → Problem & requirements (with numbers) → Proposed design (contract first, then internals) → Alternatives & trade-offs → Recommendation → Non-goals → Risks & mitigations → Rollout & rollback → Open questions (marked, not hidden). Deliver as a Markdown file in the repo's docs convention (`docs/adr/`, `docs/design/`, or where existing docs live — discover, don't invent).

## Self-check before delivering

- The three-condition test verdict is stated in one line — why this decision earned a document at all.
- Every scale number traces to a stated assumption a reader can re-run; a number with no assumption is a vibe with digits.
- A recommendation exists, cites the requirements that drove it by name, and states what new information would flip it.
- Re-read each alternative as its advocate: if one collapses under its own best case, it was a straw man — replace it or drop it.
- Non-goals, rollback, and marked open questions are present; any requirement you invented rather than confirmed is moved to Open questions or deleted.

## Anti-patterns

| Anti-pattern | Instead |
|---|---|
| Component shopping — naming technologies before requirements | Requirements and numbers first; technology falls out of them |
| Trade-off tour with no recommendation | End every comparison in a recommendation tied to a requirement |
| Straw-man alternatives | Each alternative argued at its honest best before it loses |
| Invented requirements ("we might need multi-region") | Only stated or confirmed requirements; speculation goes to Non-goals |
| ADR spam — a document per reversible choice | The three-condition test; reversible choices get a code comment |
| Design without a rollout | Migration order, backward compatibility, and rollback in the doc |
| Open questions silently resolved by omission | An explicit Open questions section the reader can answer |
