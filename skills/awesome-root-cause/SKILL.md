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
