# Finding verification and false-positive control

A lead is not a finding. This file is the pass that turns a candidate into a defensible finding — or kills it. Run it on **every** candidate before it reaches the report; a report's credibility is set by its worst false positive, not its best true finding. The main skill's confidence gate (vulnerable pattern *and* attacker-controlled input, both confirmed by reading the code) is the floor — this is the rest of the wall.

## The candidate worklist

Every grep hit, scanner line, and "this looks dangerous" is a candidate, not a finding. Persist them as a worklist and drive each to an explicit verdict — never leave one eyeballed-and-forgotten. The failure this prevents is enumerating fifty candidates, checking five, and calling the tree clean.

| ID | file:line | Bug class | Entry point | Verdict |
|----|-----------|-----------|-------------|---------|
| c1 | orders.ts:142 | IDOR | `GET /api/orders/:id` (authed) | CONFIRMED |
| c2 | export.py:88 | SQLi | `POST /export` (anon) | TRACED-SAFE — parameterized in `db.query` |
| c3 | avatar.go:31 | SSRF | `url` param (authed) | NEEDS-POC — filter present, redirect untested |

Three verdicts, and only three: **CONFIRMED** (survives every check below), **TRACED-SAFE** (a control makes it safe — name the control), **NEEDS-POC** (real-looking, not yet proven — the specific open question stated). A candidate you cannot resolve moves to the report's *Needs verification* section with the question attached, never silently dropped.

## Step 0 — Restate the claim in your own words

Before any analysis, state the bug precisely: **what** the vulnerability is, the **alleged root cause** (file:line), the **trigger**, the **claimed impact**, the **threat model** (privilege the code runs at, what the attacker already holds), and the **bug class**. Half of false positives collapse here — the claim does not make coherent sense once stated precisely. If you cannot restate it clearly, that is the finding: it is not ready.

## Route: standard vs deep

- **Standard** — clear specific claim, single component, well-understood class, no concurrency, straightforward source→sink. Work the four confirmations below linearly.
- **Deep** — ambiguous claim, cross-component path (3+ modules), race/TOCTOU/async in the trigger, logic bug with no clear spec, or standard came back inconclusive. Trace each hop as its own step; where a bug class has extra requirements, apply the class notes below.

Default to standard; escalate to deep the moment a linear read stops fitting.

## The four confirmations (a finding must answer all four)

1. **Reachability** — the concrete entry point and the caller privilege required. "An unauthenticated attacker who can reach `POST /api/export`." Not "if someone calls this."
2. **Control** — which part of the dangerous value the attacker controls, shown as the source→sink chain.
3. **Impact** — which invariant breaks and what the attacker gains. Reachability is not impact; a claim of "full DB read" needs a row you actually read, not an injectable parameter plus an inference.
4. **No mitigating control** — check for the middleware, framework default, WAF rule, DB constraint, or upstream caller that already sanitizes. "None found" is a valid answer, but it must be looked for, not assumed.

## Adversarial revalidation (try to kill it)

The four confirmations build the finding; this pass attacks it. Run it on every CONFIRMED candidate:

- **Re-derive it adversarially.** Assume the code is safe and go find the control that makes it so. A finding that survives a genuine attempt to disprove it is one you can defend in a remediation meeting.
- **Confirm the sink still receives your value.** Re-trace the last hop — a refactor often slips a validator or encoder between source and sink that the first read glided past.
- **Reject the biasing thoughts.** "This pattern looks dangerous," "similar code was vulnerable elsewhere," "it's clearly critical," "the scanner flagged it" — none of these is analysis. Each demands the full trace for *this* instance.

## Already-fixed check (revalidate against what ships)

The tree you are reading may lag the fix, or the fix may sit on a branch you have not pulled. One already-patched finding teaches the reader to distrust the whole report.

```bash
git log --oneline <checkout>..origin/main -- <file>   # a fix on main you are not reading
git log -S'<dangerous token>' --oneline -- <file>     # when this line last changed, toward what
git blame -L <line>,<line> <file>                      # the commit that introduced it, for context
```

## Bug-class notes (supplement the four confirmations)

- **Injection (SQL/command/template/LDAP/XPath)** — the question is not "is there a filter" but "do the filter and the interpreter agree on the grammar." Confirm the sink is the string-built path, not the parameterized one next to it.
- **Authorization / IDOR** — check the *query*, not the decorator: is the object scoped to the caller's tenant/user, or only looked up by ID? A valid session is authentication, not authorization.
- **Memory safety (C/C++/unsafe Rust)** — length arithmetic before the bounds check, attacker-influenced `memcpy` size, signed/unsigned conversion, use-after-free on the error path. State the mathematical bound the attacker escapes.
- **Race / TOCTOU** — name the two operations and the window; a check-then-use with no lock or transaction between them. Confirm the window is reachable under real concurrency, not just theoretically.
- **Integer** — the overflow/underflow, and that the wrapped value reaches a size, index, or allocation.
- **Crypto** — a misuse (reused nonce, unauthenticated ciphertext, non-constant-time compare), not a primitive-strength complaint. Deep crypto review is its own pass — see the crypto category in `checklists.md`.
- **Info disclosure / DoS** — a designed rejection (explicit 429, buffer-full reject, intentional error return) is not a bug; a `panic`/crash at the same boundary is. For DoS, describe the amplification and preconditions rather than running it.
- **Deserialization** — confirm the sink deserializes attacker bytes with a gadget-reachable type, not a fixed internal shape.

## Batch triage and exploit chains

When verifying many candidates: run Step 0 for all of them first (obvious false positives collapse immediately), route each independently, then — after individual verdicts — check for **chains**. Findings that individually failed a confirmation may combine into a viable attack (an info leak that supplies the ID for an IDOR, an SSRF that reaches an unauthenticated internal service). Report the components individually *and* the chain as its own finding at the chain's severity.

## Invariants before a finding leaves draft

Four mechanical checks — run them over every finding, each maps to a way reports have actually gone wrong:

1. **Every finding cites at least one piece of evidence** — a command and its output, a request/response, the proving code lines. Support that is only a code reading makes it a *candidate*; label it so.
2. **Confirmed status and low confidence cannot coexist.** If you would not bet on it, downgrade the status or say plainly what would settle it — this is how a speculative finding acquires unearned authority.
3. **Every reproduction runs without asking you a question**, or names the environment it cannot leave (an offline sample, a lab-only target, a credential the reader must supply).
4. **A claim of obtained access or data has evidence of that specific claim** — the row you read, not the injectable parameter and an inference about what lies behind it.

A finding that fails one of these does not get quietly dropped: it moves back to the worklist with the reason attached, so a later pass knows what would promote it.
