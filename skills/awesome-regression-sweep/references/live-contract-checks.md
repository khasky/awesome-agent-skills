# Live contract and data invariants

The invariants that have actually been broken, or nearly broken, in production
systems — grouped by the layer that owns them. Each is cheap to re-check and
expensive to discover from a user report.

`scripts/http-contract.mjs` automates most of the first section. The rest need the
note beside them.

## The public read surface

A cached, publicly readable endpoint is the surface with the most invariants and
the fewest tests, because every one of them is invisible from inside the process.

- **The cache key is built from *parsed* parameters, never the raw URL.** An
  unknown `?probe=x`, reordered parameters, and zero-padded numbers must all
  collapse onto one entry. Otherwise the cache is decorative: an attacker appends a
  random parameter and every request reaches the database.
- **Repeated parameters are deduplicated and sorted.** `?id=3,01,1,003` and
  `?id=1,3` are the same request and must return the same body, each distinct value
  once, in a stable order.
- **Nothing reads the database before validation finishes.** A `4xx` is never
  cached, so a query that runs *before* the input is rejected is a free
  amplification lever. Prove it with every malformed shape separately, because each
  takes a different branch: a non-numeric value, a reversed range, zero or negative,
  a range wider than the cap, more list items than the cap, a value longer than the
  cap, and a compound value missing its separator. One of those branches is the one
  that forgets.
- **CORS is uniform across every branch** — success, error, `304`, an unknown path's
  `404`, and the `OPTIONS` preflight alike. A header that appears only on `200`
  breaks every browser client the moment something goes wrong, and the `404` leaves
  the handler by a third route that is easy to forget. Confirm the inverse too: a
  path that is *not* public still refuses an unlisted origin.
- **Never credentialed on a public path.** `Access-Control-Allow-Credentials`
  beside a wildcard origin is a bug even when browsers reject the pair.
- **A strong `ETag` and a bodiless `304`.** The `304` keeps the `ETag` and the CORS
  headers, and transfers zero bytes; a stale `If-None-Match` still gets the full
  body.
- **No `Vary` on a shared cache entry.** One entry serving every client cannot vary
  by a request header — a `Vary` there silently multiplies the cache or serves the
  wrong variant.
- **An open-ended view is not `immutable`.** A range query with no upper bound is a
  *moving* view: its content grows. Only a closed, complete range earns
  `immutable`.
- **`HEAD` mirrors the `GET` status and transfers zero bytes.** Measure the
  transferred size, not the size of the file the client wrote — `curl -I` writes
  headers into that file, which is how a "HEAD returns a body" false positive
  appears.
- **Security headers survive on every branch**, including errors: `nosniff`, a
  frame policy, a referrer policy.

## Durable and append-only data

- **A sequence that must be dense is checked globally, not inside a window.** Fetch
  the whole range and compare `max(seq) - min(seq) + 1` with the row count. A hole
  in an append-only log can stop every downstream consumer permanently.
- **The value that was hashed is the value that was stored — at every writer.** A
  timestamp floored to the minute before hashing must be stored floored. A second
  writer that skips the flooring publishes a record nobody can recompute, and the
  error surfaces months later at verification time, not at write time.
- **A closed vocabulary is rejected at the boundary**, with a specific error. Free
  text that reaches a permanent, publicly mirrored record cannot be taken back.
- **Tombstones and corrections point backwards and are complete.** A record that
  supersedes another references a distinct *earlier* entry, carries the sentinel the
  format defines, and covers every entry of whatever it erases. Partial coverage is
  the invariant that looks fine in a spot check and fails an audit.
- **Retention claims match the sweep that implements them.** A row that no job ever
  deletes is retained forever, whatever the policy document says.

## Cross-implementation parity

When two independently maintained implementations serialize the same format — a
server and a standalone verifier, a producer and a consumer SDK, an exporter and an
importer — nothing in either build pins them together. An end-to-end audit covers
the shapes the live data already contains; parity vectors cover the shapes it does
*not* — a code never yet emitted, a granularity just changed. That is exactly where
drift hides.

The method:

1. **Generate the vectors inside the real runtime**, not a mock. The point is to
   capture what the production serializer emits, including whatever its platform
   does to numbers, string encoding, and key order.
2. **Emit them as data** (JSON on stdout, or a written file) and keep them under
   version control next to the check.
3. **Replay them in the other implementation** and compare byte for byte, or hash
   for hash.
4. **Delete the generator from the suite.** It is a generator, not a test; leaving
   it in makes every run rewrite the vectors it is supposed to check against.
5. **Regenerate whenever the format, the vocabulary, or the granularity changes** —
   and treat a diff in the regenerated vectors as a finding until someone confirms
   the change was intended.

Two traps:

- **Test reporters capture stdout.** A generator that prints its vectors through a
  runner usually needs the runner's console-intercept disabled, or the line
  disappears and the file is written empty. Verify the file is non-empty before
  trusting a `PASS`.
- **Vectors that only cover today's data prove nothing about tomorrow's.** Include
  every enum value, both sides of every optional field, and at least one historical
  shape the format still has to accept.

## Reconciling one number by two paths

Where a system reports a total, find the second path to it and compare: a cached
counter against a fold from zero, an aggregate table against `count(*)`, a
dashboard against the ledger it summarizes. A single number arriving by one path is
unfalsifiable — it is right by definition. Two paths make it checkable, and this is
the check that catches double-counting, silent write failures, and a cache nobody
invalidated.
