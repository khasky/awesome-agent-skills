# Leak taxonomy

The categories of disclosure to hunt in a public client. For each: **what it is**, **why it leaks**, and **starter patterns** (ripgrep syntax, case-insensitive). Patterns are *leads* — read every hit in context, and expand the lists with the product's own vocabulary from Phase 1 (its real backend stack, service names, defense names, env-var prefixes). `scripts/leak-sweep.sh` bundles these into one pass.

Search the **whole** repo, not just application source: tests/e2e, `docs/`, `README`/`CHANGELOG`, CI/workflow YAML, `.env*` and `.example` twins, build/config files, package manifests, and locale/i18n files (they ship inside the package).

---

## 1. Private repo & path references

**What:** names of private sibling repos, monorepo-relative paths that escape the public repo, "we split this out of…" notes, links to internal dashboards/issue trackers.
**Why:** maps your private surface and confirms what else exists to probe. Cross-repo relative paths (`../../private-thing`) also break once the repo is standalone, so they're both a leak and a bug.

```
\.\./\.\./            # relative paths climbing out of the repo
(private|internal|admin|backend|infra|monorepo)-[a-z0-9-]+
--filter\s+\./        # workspace/monorepo package filters that only work in the parent
(dashboards?|grafana|kibana|datadog|sentry)\.[a-z0-9.-]+/
```

## 2. Backend tech stack & infrastructure identifiers

**What:** the server framework, language, database, cache, queue, hosting/CDN, and their CLI/config filenames appearing in comments, docs, error strings, or CI deny-lists.
**Why:** narrows the attack surface (known CVEs, default misconfigs, provider-specific abuse paths). The client never needs to name the server's stack.

```
(postgres|mysql|mongo|redis|sqlite|dynamo|cassandra|neon|planetscale|supabase)
(cloudflare|lambda|vercel|netlify|fastly|fly\.io|heroku|kubernetes|k8s|nginx|envoy)
(wrangler|terraform|pulumi|serverless\.yml|\.dev\.vars|docker-compose)
(durable\s?object|queue\s?consumer|cron\s?trigger|worker\s?binding)   # confirm it means the backend, not a Web Worker/job queue
```

## 3. Anti-abuse, rate-limiting & quota mechanics

**What:** comments/strings/identifiers describing how the backend throttles, scores, or blocks: rate-limit keying (per-IP/per-account/per-ASN), quotas, cooldown windows, risk scoring, shadow-ban, soft-drop/silent-discard, tombstones, proof-of-work/captcha internals, difficulty/nonce, breadth caps.
**Why:** the single most valuable thing to hide. Every disclosed threshold or keying tells an attacker exactly how to stay under it. Note: the client may *react* to a `429`/`Retry-After` — that's fine; what leaks is *explaining the server's policy*.

```
(rate.?limit|ratelimit|throttl|cooldown|quota|breadth.?cap)
(per-ip|per-account|per-asn|per-device|per-user)\s+(limit|throttle|cap)
(shadow.?ban|soft.?drop|silent(ly)?.?(drop|discard|reject)|tombstone|deweight|down.?rank)
(proof.?of.?work|hashcash|difficulty|nonce|captcha|turnstile|recaptcha)\b
(risk\s?(score|gate|engine)|abuse\s?(score|gate)|sybil|fraud\s?score)
```

## 4. Authentication & account internals

**What:** server-side auth policy stated in the client: session/JWT TTLs, OTP expiry/lockout windows, disposable-email or domain-allowlist gates, email-hash/pepper details, lockout thresholds.
**Why:** reveals account-takeover and enumeration parameters. Keep user-relevant policy in *visible* UI copy ("code expires in 10 minutes"); cut the *internal* framing ("server-side disposable-domain check", "30-day JWT", "domain allowlist gate").

```
(jwt|session|token|refresh).{0,20}(ttl|expir|lifetime|30.?day|24.?hour)
(otp|one.?time).{0,20}(expir|lockout|attempts?|window)
(disposable|allow.?list|allowlist|deny.?list|blocklist|domain\s?gate)
(pepper|hmac\s?secret|email\s?hash|salt).{0,20}(server|backend)
```

## 5. Secrets & credentials

**What:** live keys/tokens/passwords in the tree, **and** real values in git-ignored files that a *source bundle* would still ship (store "reviewable sources" zip, `npm pack`, directory backup) because the bundler ignores `.gitignore`. Also test credentials, fixtures, and tokens in e2e specs.
**Why:** direct compromise. Untracked ≠ safe: verify the bundler's exclude list, not just `git status`.

```
(sk_live_|rk_live_|ghp_|github_pat_|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-)
-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----
(api[_-]?key|secret|password|passwd|token|bearer)\s*[:=]\s*['"][^'"]{8,}
```
Then check the **source-bundle config** (e.g. a store/AMO `zip.excludeSources`, `.npmignore`, `files` in `package.json`, `.dockerignore`) actually excludes `.env`, `.env.*`, and any secret-bearing file. Build the bundle and grep it.

## 6. Test / QA / e2e code encoding backend behavior

**What:** deterministic test accounts + fixed OTP/codes, "test-mode" server exemptions, special query params (`?fresh=1`, `?debug=1`, bypass flags), endpoints the shipped client never calls (`/health`, `/debug`, admin routes), and comments narrating server responses ("the server shadow-bans after N", "counted normally because allow-listed").
**Why:** tests are the #1 place backend internals leak, because they document expected server behavior. A test account with a static credential is also a live backdoor if it isn't strictly scoped.

```
(test|e2e|qa|dummy|fake).{0,20}(otp|code|token|account|user|email)
\?(fresh|debug|test|bypass|admin|internal)=
/(health|healthz|debug|__debug|internal|admin|metrics)\b   # confirm the shipped client never calls it
(deterministic|allow.?listed|test.?mode|test.?only).{0,30}(server|backend|worker|counted|exempt)
```

## 7. Explanatory comments about server behavior

**What:** any comment whose subject is *the server*, not the client — "the server does X", "the backend rejects…", "after this reaches the API it…", "processed server-side as…".
**Why:** pure over-disclosure with no client benefit. Apply the rewrite rule (`references/rewrite-rules.md`): cut to the client-observable contract or delete.

```
(the\s+(server|backend|worker|api)\s+(does|will|then|rejects|drops|records|marks|validates|processes|checks))
(server|backend|internally|behind\s+the\s+scenes)\s*[-—:]
//.*(after|once).*(reaches|hits|arrives at).*(server|backend|api)
```

## 8. Dead code hardcoding server policy

**What:** unused message types, handlers, constants, or fields that no live caller exercises but that bake in a server value (a 30-day TTL computed client-side, a removed endpoint, a quota constant).
**Why:** it discloses policy while adding zero function. Confirm it's dead (grep for senders/callers), then delete it.

Method: for each suspicious constant/handler, grep the codebase for who *sends*/*reads* it. Zero non-definition, non-test hits → dead → remove.

## 9. Docs, changelog & commit messages

**What:** README/CONTRIBUTING/docs paragraphs describing backend architecture, staging/prod differences, "how a new X goes live server-side", data-wipe schedules, and commit subjects naming server mechanisms ("defer to server gate", "remove proof-of-work challenge").
**Why:** the same over-disclosure in prose. Keep contributor-relevant workflow; cut the internal *why/how*. **Commit history can't be rewritten safely on a public repo** — note removed-but-historical leaks for rotation and future hygiene, don't attempt a rewrite.

```
(production|prod|staging).{0,40}(only|differs|recognizes|enables|server.?side|wiped|reset)
(maintainer|admin)\s+enables?\s+it\s+(server.?side|in\s+the\s+backend)
```

## 10. Data / serialization / protocol internals

**What (product-specific):** if the client participates in a shared protocol (transparency log, sync/CRDT, crypto epochs, merkle proofs, signed checkpoints), watch for comments explaining the *server's* side of the protocol beyond what the client needs to produce/verify its own messages.
**Why:** reveals invariants an attacker can target to forge or desync. The client's own serialization is necessary-minimum; the server's processing of it is not.

Search the product's protocol vocabulary (from Phase 1): `epoch`, `checkpoint`, `merkle`, `tree_size`, `witness`, `anchor`, `sequence`, etc. — and read each hit to separate "what the client emits" (keep) from "what the server does with it" (cut).

---

## Recording findings

For every confirmed leak: `path:line` · short quote · one-clause reason · severity (see below). Keep a parallel **"checked, clean"** list of the areas you swept with nothing to report — it's what makes the audit credible.

**Severity guide:**
- **Critical** — live secret in-tree or one bundle-step from publication; a working backdoor (static test credential with server exemption).
- **High** — anti-abuse mechanics, rate-limit keying, or auth-policy internals disclosed; private repo/infra map.
- **Medium** — backend tech-stack identifiers, staging/prod internals in docs, dead code hardcoding policy.
- **Low / informational** — user-facing policy strings, borderline identifiers, monorepo path artifacts (also a bug), git-history-only exposure.
