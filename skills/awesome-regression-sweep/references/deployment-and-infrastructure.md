# Deployed versus committed, and the infrastructure layer

Two layers a green working tree says nothing about: whether the code you verified
is the code that is running, and whether the platform under it is healthy. Both
fail without a single line of code changing.

Everything here is read-only: reads, `git` inspection, and platform queries. No
deploy, no write, no mutating administrative call.

## Is the thing you tested the thing that is running

Two checks, both cheap, and neither is optional before saying "verified".

**Fingerprint the deployment.** Pick a behaviour only the current code has — a
header it started sending, a parameter it started normalizing, a field it started
returning — and observe it on the deployed environment:

```bash
curl -s -D - -o /dev/null https://api.example.com/v1/status | grep -iE "^(etag|access-control-allow-origin)"
curl -s "https://api.example.com/v1/items?id=3,01,1,003" | head -c 120   # normalized order proves the new build
```

A version endpoint is the honest version of this when one exists — and when it
reports a build id or commit SHA, compare it with `git rev-parse HEAD` directly.

**Then prove the deployed state is the tested state:**

```bash
git log --oneline -3
git diff --stat HEAD -- <the paths that get deployed>
```

An empty diff over the deployed paths means the commit that was deployed is
byte-identical to what the sweep just verified. A dirty tree means the sweep
verified something that is not running — and that is a finding, not a footnote.

**Run the repo's own post-deploy gates**, once a deployment exists — a smoke
script, a black-box suite, a synthetic check. Against a staging environment, never
production, when the suite is anything other than strictly read-only. A suite that
refuses to run against production by design is a feature; do not talk it into
running.

## The status page is not evidence of freshness

A status page reports *health*, and its thresholds are deliberately loose because
a quiet system ages legitimately. One has reported `operational` for four hours
while the thing it monitors had stopped advancing. Compare the numbers directly
instead:

```bash
curl -s https://api.example.com/v1/checkpoint     # what the publisher last published
# then the newest record: the tail of the collection endpoint, or max(id) via SQL
```

A published position well below the newest record, for longer than one period of
whatever advances it, means ticks are being lost.

## Scheduled jobs

The layer that fails silently: the job stops, nothing errors, and the data simply
stops moving.

- **Watch a tick rather than guess.** Tail the platform's logs across the next
  scheduled boundary, filtered to scheduled events and errors — plain request lines
  drown them.
- **A missed tick and a failing tick look identical from the data.** The logs are
  the only place that distinguishes them.
- **Overlap and idempotency.** If a tick can start while the previous one is still
  running, confirm the job is safe to run twice; if it cannot, confirm the guard
  exists and check what happens when it fires.
- **Time boundaries are where they break** — a tick at the top of the hour, the
  month rollover, the daylight-saving jump. Note which of those the current pass
  actually observed.

## Managed and serverless data stores

Read-only queries answer most infrastructure questions faster than a dashboard:

```sql
SELECT (SELECT max(id)   FROM the_log)          AS newest_record,
       (SELECT count(*)  FROM the_log)          AS rows,
       (SELECT max(position) FROM checkpoints)  AS published,
       current_setting('max_connections')       AS max_connections,
       (SELECT count(*) FROM pg_stat_activity)  AS connections,
       (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle in transaction') AS idle_in_tx
```

- **Read the compute's start time.** If it equals the moment you made the request,
  the compute was *suspended* and your request cold-started it. On a low-traffic
  deployment this is the failure that eats scheduled ticks: the tick is the first
  thing to touch a sleeping compute, it opens several connections at once across
  parallel work, and the proxy refuses the burst.
- **A suspend timeout of `0` usually means "platform default", not "never".** Read
  the platform's own definition before concluding the compute stays warm.
- **Diagnose before blaming a code change.** A healthy connection table *alongside*
  a connection-refusal error is the signature of a cold start, not of a leak. The
  fix is a warm path or a serialized connection strategy, not a rollback.
- **Idle-in-transaction connections are a code finding**, not an infrastructure
  one: something opened a transaction and never closed it.

## Reporting this layer

Say plainly which environment each observation came from, and separate three
outcomes that look alike in a log: the code is wrong, the environment is degraded,
the harness is wrong. Anything you could not observe — a tick that did not occur
during the window, a path with no production traffic — is a standing gap, not a
pass.
