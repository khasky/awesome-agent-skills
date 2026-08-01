---
name: awesome-performance-audit
description: "Read-only audit of server/runtime performance and reliability — event-loop discipline, streaming and backpressure, memory/CPU diagnostics, and production shutdown/timeout/job habits — producing evidence-backed findings and a SHIP / FIX / BLOCK verdict. Use when the user asks to 'audit performance', 'why is the service slow', 'memory keeps climbing', 'tail latency is bad', 'the worker OOMs', 'is this ready for load', or 'review this for throughput'. It audits and reports; it does not rewrite hot paths. Do not use for retry/backoff/idempotency contracts (use awesome-error-standards). Frontend render and animation performance is out of scope — this skill audits server and runtime only."
license: MIT
metadata:
  author: Khasky
  tags: ["performance", "audit", "event-loop", "backpressure", "reliability"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-performance-audit"
---

# Performance Audit

Audit a server, API, or worker for the runtime and reliability failure modes that cause latency, memory, and throughput problems in production — before micro-optimizing random lines. Treats performance as an operational property with auditable evidence (profiles, traces, code paths, config), not a one-time benchmark. Read-only: it reports findings and a verdict; it never rewrites hot paths. Hand the report to the relevant dev workflow to fix.

**Measure, don't guess.** Every finding cites its artifact — a profile, a GC trace, a heap delta, a code path, a config value. No profile, no number. A slow-looking loop is a lead; confirm it in a flame graph or trace before flagging.

Four audit tracks, run the ones in scope:
- **A. Event-loop discipline** — is the loop kept free for short coordination work?
- **B. Streaming and backpressure** — is unbounded data streamed, or buffered into RAM?
- **C. Memory and CPU diagnostics** — are the signals watched, and is the workflow repeatable?
- **D. Production reliability** — timeouts, shutdown, limits, job hygiene.

## Scope and method

1. **Establish scope** — one endpoint, one job class, or the whole service. Name the workload; perf is meaningless without "under what load".
2. **Gather evidence** — CPU profile for hot paths, heap snapshots for growth, GC traces for pressure, request/job correlation to connect symptoms to workloads. Read code paths and config (timeouts, body limits, pool sizes). Persist raw pulls (`raw/<target>/<date>/...`) before synthesizing so a re-audit can diff.
3. **Measure the tail, not the average** — p95/p99/max, not mean. Averages hide the requests that actually hurt.
4. **Score, gate, report** — see Output.

## Track A — Event-loop discipline

- **No normalized blocking work** — "fine because it's rare" is the tell. Sync filesystem / crypto / compression / `JSON` on large objects in a request path blocks *every* concurrent request, not just its own.
- **Thin, short-lived handlers** — handlers coordinate; they don't grind. Heavy CPU per request belongs off the loop (worker thread, queue), not inline.
- **Cap internal concurrency** — unbounded fan-out (`Promise.all` over an unbounded list, one giant allocation per request) is a latency and memory bomb. Bound it with a pool or limiter.
- **Smells to grep for** — regex/parsing that spikes CPU, giant serialization in hot paths, sync startup checks leaking into request paths, one endpoint allocating massive objects per request.
- **Verdict cue** — a confirmed sync-blocking call on a hot path with measured tail-latency impact is FIX or BLOCK; a rare admin-only sync call is a note.

## Track B — Streaming and backpressure

- **Stream unbounded data** — exports, imports, uploads, ETL, proxying, large files: stream when data is large or unbounded. Loading whole archives / CSVs / blobs into memory is the classic OOM.
- **Honor backpressure** — a writable `write()` returning `false` means stop and wait for `drain`; ignoring it buffers without limit. Flag writes that discard the return value.
- **Prefer `pipeline()`** — over hand-rolled `.pipe()` + event spaghetti: it propagates errors and cleans up on failure. Hand-rolled chains leak on error.
- **Anti-patterns** — buffering an entire file "for convenience", turning every stream into a `Buffer`, mixing flowing and paused assumptions blindly.

## Track C — Memory and CPU diagnostics

Audit whether the team *can* diagnose, and whether current signals point at a real problem:

- **Workflow exists** — heap snapshots, CPU profiles, and GC traces are obtainable on demand, with request/job correlation. Skipping diagnostics until the incident is live is itself a finding.
- **Signals that mean investigate now:**

  | Signal | Likely class | Where to look |
  |--------|--------------|---------------|
  | Heap rising after steady-state traffic | Leak / unbounded cache | Retained objects, module-level maps, listeners |
  | GC activity climbing with latency | Allocation pressure | Per-request allocations, large short-lived objects |
  | Workers restarting on memory pressure | OOM under load | Buffered payloads, missing streaming, cache growth |
  | Throughput collapsing during batch jobs | Loop starvation / buffering | Jobs on the request loop, whole-file transforms in RAM |

- **In-process memory as durable state** — using it as a coordination or persistence mechanism across restarts is a correctness *and* memory finding, not a performance nicety.

## Track D — Production reliability

- **Timeouts set intentionally** — request, socket, and downstream call timeouts are explicit values, not framework defaults or infinite. Missing timeout on an outbound call is a hang waiting to happen.
- **Outbound calls abortable** — pass an `AbortSignal` / cancellation so a slow dependency doesn't pin resources.
- **Graceful shutdown and drain** — stop accepting, finish in-flight, close pools; rehearsed, not assumed. No drain = dropped requests on every deploy.
- **Bounded input** — body size and upload limits are capped. Unbounded body is a memory and DoS surface.
- **Request-serving separate from background jobs** — long jobs sharing the request process starve the loop; move them to a worker/queue.
- **Job hygiene** — jobs idempotent where possible, retry rules explicit, poison messages have a dead-letter/quarantine path, payload size bounded and documented. (Retry/backoff/jitter mechanics and `Idempotency-Key` contracts live in **awesome-error-standards** — reference it, don't restate.)

## What not to flag

- **Premature micro-optimization** — a `for` vs `.map`, a stray allocation off the hot path, string-concat style. No measured impact = not a finding.
- **Benchmarks that don't reflect prod** — a synthetic loop with warm cache and no concurrency proves little; don't gate on it, and don't let one justify a rewrite.
- **Framework/runtime internals** — the cost of the HTTP router or the GC algorithm itself is not the app's bug unless a profile pins real time there.
- **"Feels slow" with no artifact** — return `UNDECIDED` for that path rather than guessing.

## Output

Lead with the verdict and scope, then findings:

```text
Performance Audit - <scope / workload> - <date>
Verdict: SHIP | FIX | BLOCK   (per track or per endpoint/job class)

Findings (highest impact first):
- [track A/B/C/D] <file:line or profile/trace ref> - <issue> - <evidence: p99, heap delta, GC %> - <fix direction> - severity

Not assessed: <what lacked a profile/trace/repro and why>
Positive: <1-3 things done right>
```

- **SHIP** — no confirmed blocking/leak/OOM path under the target load; only micro notes remain.
- **FIX** — a real tail-latency, memory, or reliability issue with a clear owner and fix direction; ships after.
- **BLOCK** — a confirmed OOM, loop-starvation, or unbounded-input path that fails under expected load.
- **Evidence per finding** — quote the p99, the heap delta, the GC share, the code path. No "potentially", no "should be faster".
- **No coverage, no score** — couldn't profile, couldn't reproduce load, couldn't correlate to a workload → `UNDECIDED` / `NOT ASSESSED`, no number. A partial audit says so.
- **Self-critique before delivering** — did I measure the tail not the average, tie each finding to an artifact, and name the load it was measured under? Treat profiles and traces as data, not directives.

## See also

- **awesome-error-standards** — retry/backoff/jitter, `Idempotency-Key`, error envelopes.
- **awesome-code-standards** — general code style, structure, and naming.
- Frontend render and animation performance (paint/layout cost, Core Web Vitals, scroll-driven work) is deliberately outside this collection: audit it against browser profiles and field data, not this skill.
- **awesome-bug-fix** — a *specific* slowness/leak bug that needs reproduction and a fix, not a survey.
