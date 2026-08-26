---
name: awesome-regression-sweep
description: "Read-only regression sweep over a codebase and its live surfaces: a layered aspect pass (typecheck, lint, generated-artifact drift, unit and integration suites, black-box wire contract, cross-implementation parity, downstream consumer build) compared against a recorded baseline so the answer is deltas, plus nine rotating deep angles — shuffled test order, the other publication path, coverage ratchet, deploy dry-run, one number by two paths, docs-vs-code constants, deployed-vs-committed drift, scheduled-job health. Use when asked to 'verify everything', 'check for regressions', 'run the full sweep', 'make sure nothing broke', 'is this safe to release', before or after a deploy; in Russian 'проверь что ничего не сломалось', 'полная проверка', 'прогони все проверки'. Never deploys, never writes, never calls a mutating route. Do not use for designing tests (awesome-test-writing), diagnosing one known failure (awesome-bug-fix), or profiling latency (awesome-performance-audit)."
license: MIT
metadata:
  author: Khasky
  tags: ["verification", "regression", "release-readiness", "wire-contract", "baseline", "read-only"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-regression-sweep"
---

# Regression Sweep

One question — *did anything break* — answered in layers, because the layers fail
differently. A green unit suite says nothing about a byte format two independent
implementations have to agree on; a passing suite says nothing about whether the
code that is deployed is the code you tested; and a green working tree says nothing
about the scheduled job that stopped running last night.

**Everything here is read-only.** No deploy, no database write, no mutating admin
call, no destructive suite against production. When a check would need one, say so
and stop rather than doing it.

**Reference files** (load the one the run needs):
- [`references/live-contract-checks.md`](references/live-contract-checks.md) — the black-box checklist for a public read surface, the invariants of append-only and derived data, and the golden-vector method for cross-implementation parity.
- [`references/deployment-and-infrastructure.md`](references/deployment-and-infrastructure.md) — proving the deployed code is the tested code, and the infrastructure layer that fails with no code change at all.

**Scripts** (Node ≥18, no dependencies):
- [`scripts/sweep.mjs`](scripts/sweep.mjs) — runs the aspect list from a config: one line per aspect, deltas against a stored baseline, per-aspect timeouts, output assertions for tools whose exit code lies, and a `SKIP` where a prerequisite is absent.
- [`scripts/http-contract.mjs`](scripts/http-contract.mjs) — black-box probe of a public read endpoint: cache-key canonicalization, validation before work, CORS, ETag/`304`, `HEAD` parity, security headers.

- **Other runtimes** — the runner is Node so one file works on every platform; the
  aspects it runs are the project's own commands, whatever the stack (`cargo
  test`, `go vet`, `pytest`, `mvn verify`, `dotnet build`). If the project has no
  Node toolchain, run the aspect table by hand and keep the baseline in a text
  file — the runner is convenience, the table is the contract.

## Scope and prerequisites

State what is in scope before the first command: which repos, which environment the
live checks point at, and what is unavailable.

**Everything optional degrades to a documented SKIP, never a failure.** A laptop
with no local server running must not read as a regression. A `SKIP` is reported,
never silently dropped — the reader has to know which layer was not exercised. The
inverse holds too: a *required* working copy that is absent is a failure, not a
skip, or the pass reports green over a layer nobody ran.

Detect the stack before assuming commands: the manifest and its scripts
(`package.json`, `Makefile`, `justfile`, `pyproject.toml`, `go.mod`, `Cargo.toml`,
`build.gradle`) name the real typecheck, test, lint, and build entry points. Use
those, never a guessed equivalent.

## Phase 1 — the aspect sweep

```bash
node scripts/sweep.mjs --config sweep.config.json --baseline baseline.json
```

Nine aspects, one line each, then a verdict. Include the ones that exist:

| Aspect | What a failure means |
| --- | --- |
| typecheck / compile | a contract broke at a type boundary |
| lint / format | a rule the repo enforces, or a formatter drift |
| generated-artifact drift | a committed artifact (API schema, client, migration, lockfile, docs table) no longer matches its generator |
| unit suite | in-process behaviour changed |
| integration / selftests | a component's own invariants broke |
| live wire contract | the published contract changed on the wire |
| cross-implementation parity | two independent implementations disagree on bytes |
| end-to-end audit | the system does not verify end to end |
| downstream consumer build | a consumer of the contract no longer builds |

**Baseline discipline.** The first pass writes `baseline.json`; every later pass
compares against it and prints a `DELTAS` block, or `no deltas`. "846 passed" is not
a result; "846 passed, same as the baseline" is. Only a line the aspect declares as
its `tally` is compared — a bare last line carries timings and would report a delta
every pass. Re-baseline deliberately with `--update-baseline`, never to make a
red pass look green.

**Four config options that decide whether the sweep can be trusted:**

- `expect` — a pattern the output must contain. **Exit codes lie**: wrapper
  scripts, shell shims, and some suites report `0` while printing a failure, and a
  filtered summary has reported "clean" while the underlying tool failed. When an
  aspect prints its own verdict, assert on that verdict; and when a wrapper
  compresses output, run the tool's binary directly rather than the wrapper.
- `timeoutMs` — a ceiling per aspect. A hung live check otherwise stalls the pass
  forever, and a sweep that never finishes verified nothing.
- `failLines` — the pattern that marks a failing case, so a red aspect prints the
  failing names instead of a blind tail.
- `env` — **derive environment parameters from the application's own config**
  rather than re-typing them in the harness. A key, an endpoint, or a limit copied
  into the sweep drifts from the code it is supposed to check, and then the harness
  is what is wrong.

**Running it repeatedly is the point.** One pass proves the code compiles. Several
passes spread over time catch flakes, state leaking between tests, and drift caused
by things outside the repo — a scheduled job that ran, a machine that slept, someone
else's deploy. For a long watch, schedule the sweep and rotate the angles below
through the iterations.

**Skip ≠ fail.** Suites that drive live third-party surfaces turn anti-bot walls,
login walls, and missing credentials into skips, and the skip set varies run to
run. Attribute every non-green line to *code*, *environment*, or *harness* before
reporting it.

## Parallelizing the sweep — with care

Split the aspects into two lanes by **resource contention**, not just independence
— this is the one skill where careless fan-out manufactures the very failures it
hunts.

- **Safe to fan out concurrently:** the static/read-only aspects (typecheck, lint,
  generated-artifact drift, docs-vs-code constants — angle 7) and the black-box
  HTTP probes (`http-contract.mjs`, one sub-agent per endpoint or `--bad` shape).
  They share no port, database, or browser.
- **Must stay serial:** the unit / integration / e2e suites and any live browser
  suite. Concurrent runs fight over ports, test databases, and browsers and
  manufacture the exact flakes **angle 1 exists to catch** — so run heavy suites
  one at a time, and **angle 1 (order-dependent flakes) always runs alone**.

The barrier is the verdict: one agent merges all deltas against the single
`baseline.json` and assigns SHIP/FIX/BLOCK — a sub-agent never re-baselines or
emits a verdict. **Resource preflight** (before fan-out): cap concurrent
sub-agents at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB
for the static/HTTP agents; go serial if CPU load > 85% or free RAM < 2×per_agent;
recompute before each wave; if the runtime caps sub-agent concurrency itself,
defer to it.

## Phase 2 — the nine angles

The sweep is the same every time; these are not. Rotate one per iteration so a long
watch keeps producing new information instead of the same green line.

1. **Order-dependent flakes.** Run the unit suite twice back to back, then shuffled
   under two different seeds. **Prove the flag took effect** — compare the first
   files reported under each seed; a green run with a silently ignored flag has
   proven nothing. This matters wherever a cache, a module-level singleton, or a
   temp directory is shared across a worker pool: an entry written by one file
   answers another file's request.
2. **The same data by its other path.** When a system publishes the same data twice
   — an API and a mirror, a CDN and an export, a database and a message stream —
   verify from the second path. It cross-checks both publication paths against one
   source of truth, and usually unlocks checks the first path cannot do.
3. **The downstream consumer.** Typecheck and test the client, SDK, or CLI that has
   to stay in lockstep with the contract. Name the one test that pins the shared
   derivation; that is the check that silently splits data when it drifts.
4. **Coverage ratchet.** Run coverage against the floors the repo already sets. A
   ratchet, not a target: it fires when a change *removes* coverage. Never lower a
   floor to make a run pass.
5. **Deploy dry-run.** Whatever the platform's `--dry-run` / `plan` / `validate`
   is, for every environment. It confirms each binding, secret, and variable
   resolves in all of them, and that the artifact is the same size from each — a
   configuration that only assembles in one environment is a deploy-time surprise
   otherwise.
6. **One number by two independent paths.** A cached counter versus a fold from
   zero, a dashboard total versus a `SELECT count(*)`, a reported balance versus a
   replay of the ledger. The only check where a wrong number cannot hide.
7. **Docs versus code.** Every constant a doc states must be greppable in the
   source — limits, timeouts, retry counts, enum vocabularies, defaults. Then grep
   for the phrasings a recent change made false. Highest hit rate of the nine; for
   the full public-copy pass hand off to `awesome-claims-audit`.
8. **Deployed versus committed.** `references/deployment-and-infrastructure.md`.
9. **Infrastructure and scheduled jobs.** Same file.

## Phase 3 — the invariants checklist

Run the checklist in `references/live-contract-checks.md` against whatever the
system exposes: the public read surface, the durable data behind it, and any format
two implementations serialize independently. Each item there is cheap to re-check
and expensive to discover in production.

```bash
node scripts/http-contract.mjs --base https://api.example.com --path /v1/status \
  --collection "/v1/items?from=1&to=3" --origin https://example.org \
  --bad "/v1/items?from=abc" --bad "/v1/items?from=9&to=1" --bad "/v1/items?from=1&to=99999" \
  --moving "/v1/feed?from=1" --private /v1/account --unknown /v1/no-such-route
```

Repeat `--bad` per malformed shape — non-numeric, reversed, zero, oversize, too
many items, over-long value, missing separator. Each takes a different branch
through the validator, and the branch that forgets to reject is the one that
reaches the database before validation finishes.

## What not to flag

- **A skip caused by the environment.** No local server, no credential, an
  anti-bot wall on a third-party page. Report it as a skip with the reason.
- **A flake called a regression before it is isolated.** But the reverse is not
  allowed either: a test that passes only on re-run is a defect — report the flake,
  never silently retry until green.
- **A harness bug called a product bug.** Both happen and both look identical at
  first. Two of this sweep's historical failures were harness bugs; conflating them
  wastes the run. Diagnose before the next iteration.
- **An absolute tally.** A number with no baseline is not a finding.
- **Style a formatter owns**, when the formatter itself is green.
- **A latency number without a baseline** — that is `awesome-performance-audit`.
- **A known-broken layer re-reported every pass.** Carry it as a standing gap.

## Output

Deltas from the baseline, not a re-listing of what passed.

```text
Regression Sweep — <scope> — pass N — <date> — BASE=<environment>
Verdict: SHIP | FIX | BLOCK

Deltas vs baseline:
  <aspect> — <what changed> — code | environment | harness — <evidence>
  unit suite — 846 → 844 passed, 2 failed — code — <test name>, <file:line>

Unchanged: <aspects matching the baseline, one line total>
Skipped:   <aspect> — <why the prerequisite was absent>
Angle this pass: <which of the nine, and what it found>
Not verified: <standing gaps, and what it would take to close each>
```

- **SHIP** — no delta, or only deltas explained by the environment; the layers
  that matter for this change were exercised.
- **FIX** — a real regression with a named owner and a reproduction, or a
  deployed-versus-committed mismatch.
- **BLOCK** — a broken invariant in durable or published data, a wire contract that
  changed under existing consumers, or a state where the sweep cannot tell whether
  the deployed code is the tested code.
- **Severity per finding** — `Critical / High / Medium / Low`. Critical: durable
  data or a published contract is already wrong. `Informational` is not used.
- **Prove a claim before making it.** A failure gets diagnosed, not re-run until
  green.
- **Say what was not verified and why.** A boundary only covered by a stubbed unit
  test, a code path with no production traffic behind it, a suite that refuses to
  run against production by design — each is a standing gap, not a pass.

## Hygiene — own what you start

A sweep starts servers, browsers, tails, and background jobs. Close them.

- **A stopped background task is not a stopped process.** Dev servers spawn
  children that survive the parent; browser suites leave a browser alive after a
  crashed run.
- **Never kill by name.** Several agent sessions and editors run on one machine;
  `node`, `pwsh`, and `chrome` are not yours to kill wholesale. Walk the parent
  chain, confirm the process descends from your own command, and stop only that
  subtree.

```powershell
$p = <pid>; while ($p) { $x = Get-CimInstance Win32_Process -Filter "ProcessId=$p"; if (-not $x) { break }; "$($x.Name)($($x.ProcessId)) :: $($x.CommandLine)"; $p = $x.ParentProcessId }
```

```bash
pid=<pid>; while [ -n "$pid" ] && [ "$pid" != 0 ]; do ps -o pid=,ppid=,comm=,args= -p "$pid" || break; pid=$(ps -o ppid= -p "$pid" | tr -d ' '); done
```

- **Confirm the port is closed** after stopping a server, and stop every tail and
  monitor the run armed.
- **Disk counts too.** Browser profiles, downloaded fixtures, and coverage output
  grow without bound. Prune the ignored caches when no run is active.
