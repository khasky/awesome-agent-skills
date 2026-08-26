---
name: awesome-root-cause
description: "Structured root-cause analysis for incidents, recurring failures, and process problems that have no failing test to run — 5-Whys, fishbone, PDCA, and a one-page A3 write-up. Use for a postmortem, incident retro, 'why does this keep happening', quality or process breakdown, or 'find the root cause' of a non-code issue. For an actual code bug with a reproducible failure, use awesome-bug-fix instead."
license: MIT
metadata:
  author: Khasky
  tags: ["incident", "postmortem", "root-cause", "process", "reliability"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-root-cause"
---

# Root Cause Analysis

Find the real cause of an incident, a recurring failure, or a process problem — the kind with no failing test to reproduce — and drive it to a durable countermeasure. Blame-free by design: the goal is a systemic fix, not a person to fault.

## When to use vs awesome-bug-fix

- **This skill** — an outage retro, a "this keeps breaking", a data-quality or handoff or deploy-process problem, a near-miss. The failure lives in process, environment, or coordination, and you can't just run it and watch it fail.
- **awesome-bug-fix** — a specific code bug with a reproduction. If you can write a failing test, use that skill; come here when there's nothing to run.

If the problem is a mix (a code bug that a broken process let ship), fix the bug in awesome-bug-fix and use this skill on the process that allowed it.

## Workflow

### 1. Frame the problem
State it as an observable gap, not a solution or a culprit: current condition vs expected condition, when it started, how often, blast radius, and how you know (the evidence — logs, tickets, timeline). If you can't state the gap concretely, gather more before analyzing.

### 2. Widen the candidates (fishbone)
Before drilling, sweep six cause categories so you don't fixate on the obvious one — **People, Process, Technology, Environment, Methods, Materials**. List candidate contributors under each. Root causes sit in **Process** or **Methods** far more often than in Technology; a purely technical cause is the exception, not the default.

### 3. Drill each real candidate (5-Whys)
For each surviving candidate, ask "why" down the chain. Two rules:
- **Stop at a systemic gap, not a person.** If a chain bottoms out at "human error", keep going: "why was that error possible?" — the true root is a missing validation, a missing automation, or an unclear procedure. A cause you can't fix by changing a person is the one worth finding.
- **The count isn't magic.** Stop when you reach a cause that, if removed, prevents the *class* of problem — whether that's three whys or seven. Don't pad to five.

Each chain ends in a candidate root cause backed by evidence, not assertion.

**Parallelizing the dig (many candidates).** The fishbone sweep (step 2) and the 5-Whys chains (step 3) are independent, read-only evidence digs — fan out one sub-agent per cause category or per surviving candidate, each gathering its own logs, tickets, and timeline. Barrier at step 4: the parent dedupes chains that converged on the same systemic gap, applies the "one class, not one instance" test, and ranks countermeasures across the full set — a per-chain agent proposes candidates, it never writes the final countermeasures. **Resource preflight** (before fan-out): cap concurrent sub-agents at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB for read-only evidence agents; go serial if CPU load > 85% or free RAM < 2×per_agent; recompute before each wave; if the runtime caps sub-agent concurrency itself, defer to it.

### 4. Countermeasures (Poka-Yoke first)
For each confirmed root cause, prefer prevention that makes recurrence structurally hard over "be more careful":
- make the bad state impossible (a guard, a required field, a check in CI) over a reminder;
- automate the manual step that failed;
- clarify or delete the ambiguous procedure.
Rank fixes by impact × feasibility ÷ effort. Name an owner for each.

### 5. Verify with PDCA
Treat each countermeasure as an experiment, not a done deal:
- **Plan** — state a *quantifiable* success criterion before changing anything ("zero recurrences over 4 weeks", "handoff errors down from 3/wk to 0").
- **Do** — apply one countermeasure.
- **Check** — measure against the criterion; use a server-side/independent signal, not self-report.
- **Act** — keep, adjust, or revert.
If three cycles show no movement, the root cause is wrong — return to step 3.

## Output: one-page A3

Deliver a compact report, not a wall of prose:

```text
Title / date / owner

Background       — why this matters, in 1–2 lines
Current condition — the gap, with evidence (metric, timeline)
Target           — the measurable desired state
Root cause(s)    — from the 5-Whys chains, each with its evidence
Countermeasures  — fix | owner | prevents recurrence how
Verification plan — success criterion + PDCA check date
Follow-up        — open items, what to watch
```

## Guardrails

- **Blame-free.** Name systems and steps, not individuals. "The deploy had no staging gate", not "X deployed without testing".
- **Evidence over narrative.** Every root cause cites what shows it (a log line, a ticket, a timeline entry). A plausible story is a hypothesis until the evidence backs it.
- **No coverage, no verdict.** If the timeline or data needed to reach a root cause is missing, say what's missing and stop at candidate causes — don't manufacture a tidy root cause to close the report.
- **One class, not one instance.** A countermeasure that only fixes this exact occurrence, not the class, is incomplete — say so.

## Example A3

Recurring failure: nightly deploys rolling back at the migration step.

```text
Nightly deploy failures / 2026-03-14 / owner: platform on-call

Background       — 6 of 14 nightly deploys rolled back in two weeks; each burns ~40 min of on-call time and delays the release train.
Current condition — 6/14 failed, all at the migration step, all with `lock timeout` on `orders` (pipeline runs 812, 817, 819, 823-825; timeline in #deploys).
Target           — zero migration-caused rollbacks across 4 consecutive weeks.
Root cause(s)    — the nightly analytics job holds a long transaction on `orders`, and nothing sequences it against the deploy, so overlap is chance (run logs 812/817/823 overlap by 4-11 min). The migrate step sets no lock wait, so one contended statement fails the whole deploy (`deploy.yml`, migrate step).
Countermeasures  — analytics publishes a completion gate the deploy waits on | platform | overlap becomes impossible, not unlikely. Migrate step sets an explicit lock timeout and retries once | platform | contention degrades to a retry, not a rollback.
Verification plan — criterion: 0 migration rollbacks over 4 weeks, read from pipeline run records, not on-call recall; PDCA check 2026-04-11.
Follow-up        — audit other jobs holding long transactions on `orders`; open question: can analytics move off the primary?
```
