---
name: awesome-leak-audit
description: "Audit a public-facing client (browser extension, mobile/desktop app, SPA, CLI, SDK, or any open-sourced client that talks to a private backend) so its public surface stays self-contained and doesn't help attackers. Use when asked to review a repo for leaked backend internals, secrets, or abuse-enabling disclosure; to check that comments/docs/tests don't reveal server-side mechanics (rate limits, anti-abuse, quotas, test backdoors, infra/tech stack, DB/schema, env-var names); to scrub a client before open-sourcing or a store/app-store submission; or for client-side security hardening (permissions, IPC/message sender validation, auth-token handling, DOM/XSS sinks, build-time config, secret bundling). Triggers: 'audit for leaks', 'does this leak backend details', 'is this safe to make public', 'what does our API disclose', 'harden the client'. Do not use for server-side vulnerability hunting — use awesome-security-audit."
license: MIT
metadata:
  author: Khasky
  tags: ["security", "audit", "client", "leak-prevention"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-leak-audit"
---

# Public Client Leak Audit

Audit a **public** client codebase that talks to a **private** backend. Goal: the public surface must be *self-contained* — it may reveal the calls it makes and the data shapes it exchanges (unavoidable for any shipped client), but nothing beyond that. Every extra detail about how the server works is free reconnaissance for an attacker and a lever for abuse.

This skill produces three things: a **findings list** (leaks + client-side security holes, each with `file:line` and severity), a set of **applied fixes**, and a **report** with residual recommendations.

**Reference files** (load on demand — read the one you need, don't inline all of them):
- [`references/leak-taxonomy.md`](references/leak-taxonomy.md) — the categories of disclosure to hunt, why each matters, and starter search patterns.
- [`references/rewrite-rules.md`](references/rewrite-rules.md) — the comment/string rewrite rule with before/after examples; how to decide keep-vs-cut.
- [`references/client-hardening.md`](references/client-hardening.md) — runtime-independent client-side security checklist (capabilities, cross-context entry points, tokens, network, build config, supply chain).
- [`references/browser-client.md`](references/browser-client.md) — the browser half of that checklist (extension permissions, storage tiers, DOM/CSS sinks, bundler config, npm lifecycle scripts). Load it *with* `client-hardening.md` for an extension, SPA, or web SDK; skip it for a native, desktop, or CLI client.
- [`references/report-template.md`](references/report-template.md) — the output report structure.
- [`scripts/leak-sweep.sh`](scripts/leak-sweep.sh) / [`scripts/leak-sweep.ps1`](scripts/leak-sweep.ps1) — the same parameterized ripgrep sweep, for POSIX shells and for native Windows PowerShell (customize the pattern arrays per product). Run whichever matches the shell you are in; their output matches.

## The core mental model

Sort every disclosure into one of two buckets:

- **Necessary-minimum** (keep): the endpoints the client calls, the request/response shapes it actually sends and receives, its own retry/backoff/debounce choices, input validation caps, and the `status → UI behavior` mapping. A public client cannot hide these; pretending otherwise is security theater.
- **Over-disclosure** (fix): anything describing *what the server does with a request*, server-side limits/quotas the client doesn't strictly need, endpoints the shipped client never calls, error branches that mirror internal server logic, anti-abuse mechanics, infra/tech-stack identifiers, private repo/paths, and test scaffolding that encodes backend behavior.

**The rewrite rule.** Client code and tests may state the *contract* ("HTTP 422 → show the unsupported-provider message"). They must not explain *what or why the server does* it ("the server runs a disposable-domain check and rejects with 422"). When a comment explains server behavior, either delete it or reduce it to the client-observable contract. See `references/rewrite-rules.md`.

## Workflow

Scale effort to the request: a quick "does this leak anything" is phases 1–2; "scrub before open-sourcing" or "full audit" is all six. For a large codebase, fan out phase 2 across parallel read-only agents (one per taxonomy cluster) and merge their `file:line` findings — but do the scoping in phase 1 yourself first, and pass every agent the public/private boundary from phase 1 or an unavoidable disclosure gets mis-flagged. Keep phase 4 remediation single-writer and serial — parallel editors of the same files collide. **Resource preflight** (before fan-out): cap concurrent read-only agents at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB; go serial if CPU load > 85% or free RAM < 2×per_agent; recompute before each wave; if the runtime caps sub-agent concurrency itself, defer to it.

### Phase 1 — Scope the public/private boundary

Before searching, establish what "private" means for *this* product. Do not skip this — the whole audit is relative to this boundary.
- Identify the public artifact(s) under audit and the private counterparts (backend, admin tools, infra, monorepo siblings). Ask the user or infer from a `AGENTS.md`/`README`/`CONTRIBUTING` if the split isn't obvious.
- List the product's backend stack, hosting, DB, anti-abuse mechanisms, and any test/staging affordances — so you recognize a leak when you see one. If you don't know them, that's the first question to the user.
- Write down what counts as necessary-minimum for this client (its real endpoints and payloads) so you don't waste effort flagging the unavoidable.

### Phase 2 — Sweep for leaks

Walk the taxonomy in `references/leak-taxonomy.md`. Cover the whole repo, not just `src/`: tests/e2e, docs, README/CHANGELOG, CI/workflow files, `.env*` and their `.example` twins, build/config files, package manifests (scripts, `postinstall`), and locale/i18n strings (they ship inside the package). Run `scripts/leak-sweep.sh <target-dir>` (or `scripts/leak-sweep.ps1 <target-dir>` on native Windows) as a starting sweep, then read the hits in context — a pattern match is a lead, not a verdict. For each real finding record `file:line`, a short quote, and a one-clause reason. An area that came back clean is not recorded and never reaches the report — it costs the reader tokens and gives them nothing to act on. Only an area you could **not** check gets written down, with the reason.

For each confirmed leak, sketch the attacker's next step as a one-line attack path — leaked detail → what it enables → why it matters — and rate severity by how *easy* the abuse is, not only how bad the worst case would be.

In vendored/third-party code, add a supply-chain quick pass for obfuscation patterns: long `atob` strings, `String.fromCharCode` chains, `\xNN` escape runs. Extend description–behavior mismatch to dependencies: a package advertising "zero deps / no telemetry" that phones home is the same tell — check `npm view <pkg> --json` (unpacked size, file count) against the claim, then read the actual source from the tarball (`curl -sL $(npm view <pkg> dist.tarball) | tar -xzO package/index.js | head`).

Also pre-scan the repo for hidden instructions an attacker planted for *your* agent: `grep -rn "<!--" --include=*.md` (HTML-comment instructions in docs the agent reads), base64 blobs in comments, `jq '.scripts' package.json` (install-time hooks), and `.claude/`/agent-config files calling `curl|wget|nc|base64|eval|exec`.

When the repo ships agent configuration of its own — a hook manifest, an MCP server list, a plugin or skill folder — audit it as shipped executable code, because that is what it is on the next contributor's machine. Enumerate every hook as `EVENT:path — gated|ungated — network:yes(host)|no` and treat three shapes as findings: a hook that fires on every tool call with no project-relevance gate; an outbound call to a host the README never mentions, with no opt-out; and a manifest description a reader could believe while the code does more (broader file access, an install step, a data upload). Two more belong here: a skill, hook, or tool that fetches its instructions or code from a URL at run time defeats every version pin unless the fetched content is hash-pinned and fails closed, and a marketplace or plugin source referenced by branch rather than a release tag or SHA re-installs whatever that ref points to today.

Frame leaks as taint chains — source→sink data flow — not just "a secret is present": credential→network sink (exfiltration), file-read→network sink, external-input→code-exec. Distinguish direct flow from variable-mediated flow (the secret passes through one or more intermediates before the sink).

Two novel lenses worth a dedicated pass:
- **Permission diff** — for a client that declares capabilities (extension manifest, MCP tool list, app entitlements): flag both *under-declared* (code uses a capability it never declares) and *over-declared* (declares a capability it never uses); a wildcard scope is its own finding.
- **Description–behavior mismatch** — does the client actually do what its docs, comments, and store listing claim? A gap either misleads users or hides undisclosed behavior.
- **Unicode deception** — homoglyph identifiers, right-to-left overrides, and mixed-script names hide backdoors and exfil targets from a skim.

Pay special attention to two high-value, easy-to-miss classes:
- **Secrets one step from publication** — real values in git-ignored `.env*` files that a *source bundle* (store/app-store "reviewable sources" zip, `npm pack`, a directory backup) would include because the bundler doesn't honor `.gitignore`. Untracked ≠ safe.
- **Test/e2e code** — deterministic test credentials, special query params, endpoints the shipped client never calls, and comments narrating server internals. This is where backend behavior leaks most often, because tests document expected server responses.

### Phase 3 — Client-side hardening

Run `references/client-hardening.md`. This is orthogonal to leaks: it's about the client being exploitable regardless of what it discloses. Prioritize caller validation on privileged cross-context entry points, auth-token storage and egress, untrusted data reaching an interpreter, over-broad capabilities, and build-time config that lets a poisoned build repoint the backend or bundle a secret.

**Pick the mechanism file for the client type.** `client-hardening.md` states each rule runtime-independently and names where the mechanism lives per platform. For a browser extension, SPA, or web SDK, read `references/browser-client.md` alongside it — that file carries the extension permission model, storage tiers, DOM/CSS sink list, bundler config gating, and npm lifecycle-script pass. For a native mobile, desktop, CLI, or server-side SDK client, skip it and follow the per-platform pointers in the main checklist instead (exported components and Intents, XPC and URL schemes, `ipcMain` and preload bridges, local sockets and ports, the OS keychain, the platform's build-metadata and symbol stripping). Say in the report which of the two you ran, so a reader knows what was and wasn't in scope.

Keep three adversaries in mind while hardening: the **scoundrel** (controls config or input maliciously), the **lazy developer** (copy-pastes the first example — are the safe defaults also the easy ones?), and the **confused developer** (swaps parameters — is misuse loud or silent?).

### Phase 4 — Remediate

Apply the fixes. Order of impact:
1. Close secret-leak channels first (exclude `.env*`/secret files from source bundles; move real values out of committed-adjacent files).
2. Apply the rewrite rule to leaking comments/strings/docs; prefer *renaming code* so a comment becomes unnecessary over rewording the comment.
3. Delete dead code that hardcodes server policy (session TTLs, quotas, removed endpoints).
4. Trim tests/docs to the client-observable contract; keep the flow working, cut the narration.
5. Land the hardening changes with tests.

Behavior-preserving is the default: keep public API contracts, storage keys, message names, and request/response shapes stable unless the task explicitly wants a functional change.

### Phase 5 — Verify

Prove you didn't break anything and didn't miss anything:
- Run the project's typecheck, unit tests, lint, and a production build. Capture real exit codes (a `cmd | tail` pipe reports the tail's status, hiding a failed build — run without the pipe or use `PIPESTATUS`/`set -o pipefail`).
- Re-run the leak sweep; confirm the intended patterns are now zero (except deliberate ones).
- Scan the **built artifact** and any **source bundle** for secrets, sourcemaps, and internal strings — grep `dist/`/build output and the sources zip. Don't rely on source-tree cleanliness alone.
- Sweep any **source maps you ship or submit for store review** (`.map` files carry original comments, internal paths, and dead code) with the same leak taxonomy as the built artifact.
- Confirm legitimate flows still work (e.g. a staging/e2e build that *is* allowed to differ still resolves correctly).

### Phase 6 — Report

Write the report per `references/report-template.md`: findings by severity, applied changes, residual recommendations (secret rotation, git-history exposure, consciously-deferred tradeoffs), and the verification evidence. Note that **git history is not fixable retroactively** — a removed secret or a descriptive commit subject stays in the log; recommend rotation and future commit-message hygiene rather than a rewrite of a public repo's history.

## Guardrails

- Don't over-flag the unavoidable. Endpoints, payload shapes, and `status → UI` mappings are necessary-minimum; flagging them erodes trust in the report.
- A pattern hit is a lead. Read it in context before calling it a leak — "epoch" is usually a timestamp, "worker" might be a Web Worker, "durable" might be a queue, not Durable Objects.
- Keep user-facing strings that state a *user-relevant* policy (e.g. "codes expire in 10 minutes"); cut the *internal* framing in the non-visible description/comment next to it.
- This skill audits your own / authorized code to reduce its public attack surface. It is defensive: reducing disclosure and hardening the client, not building exploits.
