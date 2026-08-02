# Category checklists

The working checklists for the ten audit categories. Read this file before walking the attack surface; the SKILL.md table only names the categories — the checks live here.

## 1. Injection

- **SQL** — No string concatenation of user input into SQL. Use parameterized queries or a safe ORM. Check raw queries and `execute(f"...")`-style code.
- **Command / shell** — No unsanitized user input in `exec`, `system`, `eval`, or shell commands. Use allowlists and parameterized execution.
- **HTML / XSS** — User-controlled data encoded for context (HTML entity, attribute, URL). Use templating that auto-escapes or a dedicated encoding function. Avoid `innerHTML` or raw HTML with user input.
- **LDAP / XML** — If applicable, use parameterized or safe APIs; avoid concatenating user input into queries or XML.
- **NoSQL operator injection** — `db.users.find({username: req.body.username})` with an object payload (`{"$gt": ""}`) matches everything. Type-check/coerce inputs to scalars before building queries.
- **Deserialization** — Every ecosystem has a pickle equivalent. Find this project's primitive (`pickle`, `ObjectInputStream`, `YAML.load`, `Marshal`, `BinaryFormatter`, `unserialize`) and treat it as a sink for untrusted data.
- **Unicode / control-character smuggling** — Input feeding an LLM prompt, a terminal, a shell, or a parser can hide instructions in non-printing characters. Grep for: bidi isolates `⁦-⁩` and RTL override `‮` (display-reversal), the invisible **tag block `\U000E0000-\U000E007F`** (instruction smuggling), zero-width `​-‍﻿`, ANSI escapes `\x1b\[|\x1b\]`, null-byte `\x00` truncation, and base64 blobs hidden in comments (`[#;].*[A-Za-z0-9+/]{20,}={0,2}`). Normalize/strip or reject before the sink.

**Example (bad vs good):**

```python
# BAD
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# GOOD
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```

## 2. Secrets and credentials

- **No hardcoded** — Passwords, API keys, tokens, or connection strings must not appear in source or config committed to the repo.
- **Fail open vs fail secure** — `env.get('SECRET') or 'default'` ships a working default: Critical. `env['SECRET']` that crashes when unset: safe. Grep leads: `getenv.*\) or ['"]`, `process\.env\.[A-Z_]+ \|\| ['"]`, `ENV\.fetch.*default:` — a hit is a lead, not a verdict; trace whether the default can reach production before reporting.
- **Storage** — Use environment variables or a secrets manager. Document in .env.example or config docs; never commit .env or real secrets.
- **Detection coverage** — Beyond API keys and passwords: connection strings, URL-embedded auth tokens (`https://user:pass@…`), JWTs, SSH/PEM private keys, crypto-wallet addresses. Enumerate the secret *surface*, not just source: defaults, persisted state, logs, and CI artifacts all leak.
- **Leak sinks** — Grep the ways secrets escape at runtime: `env`/`printenv` dumps, `declare -p`/`export -p`/`typeset -p`, a bare `set`, reads of `/proc/*/environ`, error messages that echo config, secrets inlined in shell/bash-history commands. Extend the same grep to the secret-manager CLIs, whose whole job is to print a credential to stdout — `op read`, `op item get`, `vault kv get`, `vault read`, `aws secretsmanager get-secret-value`, `aws ssm get-parameter`, `aws configure export-credentials`, `gcloud secrets versions access`, `gcloud auth print-access-token`, `gcloud auth print-identity-token`, `az account get-access-token`, `security find-generic-password`, `gh auth token`, `doppler secrets`, `doppler run`, `kubectl get secret … -o yaml|json|jsonpath|go-template`, and `curl`/`wget` invocations carrying `TOKEN|SECRET|PASSWORD|API_KEY|ACCESS_KEY`. In a script, a CI step, or an agent session these land in a log or a transcript; the sink is whatever reads that log.
- **Scanner choice** — Tools trade recall for precision (roughly: Gitleaks ~high-recall/low-precision, TruffleHog ~low-recall/high-precision via live validation, GitGuardian/detect-secrets ~high-precision). Layer them: a high-recall scanner at pre-commit (tolerate false positives to catch early), a validating scanner in CI, monitoring on the repo. ~Half of leaked credentials are "generic" secrets a regex ruleset misses, so don't rely on one tool.
- **Scanner invocation** — Cite the current command form, not the deprecated one: gitleaks 8.19 replaced `detect`/`protect` with `git` (history), `directory` (working tree), and `stdin` (pipe) — `protect --staged` → `gitleaks git --pre-commit --staged`, `detect --no-git` → `gitleaks directory`. Exit codes are the contract: `0` clean, `1` leak-or-error, `126` unknown flag — a CI step that ignores the exit code is decoration. Suppression is explicit and reviewable: inline `#gitleaks:allow` on a knowingly-committed test secret, a fingerprint in `.gitleaksignore`, or `--baseline-path` to report only what is new; a suppression with no comment naming why is itself a finding.
- **Scanner blind spots** — A clean scan proves the scanned set is clean, nothing more; state the boundary in the report instead of implying repo-wide coverage. Four gaps recur: (1) `.gitignore`d paths — staged-file and working-tree scans build their file list from `git ls-files --others --exclude-standard` and `git diff`, so a secret in `secrets/`, `*.local`, or an untracked `.env` is invisible to every git-scoped gate; (2) anything outside the work tree — a memory store, a `~/.config` file, or a scratch directory the tooling never walks; (3) entropy gating — detection fires on high-entropy values or recognizable vendor prefixes (`ghp_`, `github_pat_`, `AKIA`, `sk-ant-`, `sk-proj-`, `npm_`, `AIza`, `xox?-`, `glpat-`, `dop_v1_`), so a short low-entropy secret under a generic variable name passes untouched; (4) redactors that walk JSON string *values* only — a secret appearing as an object key survives masking. Mark uncovered areas `NOT ASSESSED`.
- **History** — Secrets live in git history, not just the working tree: a current-tree scan misses committed-then-removed keys (use gitleaks/trufflehog). If a secret was ever committed — or otherwise exposed: pasted into an `.env` on a shared or dev machine, printed to a terminal or log — treat it as burned: rotating it is the fix; deleting the line or rewriting history is not enough.
- **Logs and errors** — Do not log secrets, tokens, or full credentials. Redact or omit.

## 3. Authentication and authorization

- **Authentication** — Protected routes require valid auth (session, JWT, API key). Check is performed server-side on every request.
- **Authorization** — After auth, check that the user is allowed to perform the action (e.g. access this resource, this tenant). Do not trust client-supplied role or scope.
- **Client-readable session state is forgeable** — a session object decoded from a cookie or JWT without server-side verification (`getSession()`-style helpers, hand-parsed cookies) is attacker-controlled input; authorization decisions must use the verified check (`getUser()`-style call or signature verification against the issuer). Edge middleware that cannot verify tokens may refresh sessions but never enforce access. CWE-345.
- **IDOR** — Verify that resource IDs belong to the current user or that the user has permission. Example: `GET /orders/123` must check that order 123 belongs to the authenticated user.
- **Multi-tenant** — Test horizontal escalation between tenants explicitly: can tenant A's valid session read or mutate tenant B's data by swapping IDs?
- **Fail secure on exceptions** — An exception inside an auth/permission check must deny. `except: return True` / `catch { return true }` near auth code = Critical. Grep leads: `except.*return True`, `catch.*return true`.
- **Account enumeration** — Login, reset, and signup return uniform responses AND uniform timing ("if the account exists, an email was sent").
- **Session/credential floors (ASVS)** — Password ≥12 chars plus a breached-password check; session tokens ≥128-bit entropy; session ID regenerated after login (fixation); cookies `Secure`/`HttpOnly`; anti-automation on credential endpoints. Citing the ASVS item (e.g. V2.1.1) alongside CWE makes findings more defensible.
- **Check-then-act races (TOCTOU)** — Balance/quota/limit checks followed by a separate mutation must be atomic (transaction, lock, conditional update); same for file existence-then-use.
- **State-machine / workflow bypass** — Multi-step flows (checkout, KYC, onboarding, approval) enforce order and completion server-side. Can a step be skipped, replayed, or reached directly (POST straight to the final endpoint) without the prior ones? Client-enforced sequencing is not enforcement. CWE-841.
- **Replay and idempotency** — Requests that move money, grant access, or mutate state carry an idempotency key or nonce and reject duplicates; webhooks verify signature *and* timestamp/nonce against replay. A safe-to-retry GET is fine; a replayable POST that double-charges or double-grants is the finding. CWE-294.
- **Step-up / elevated assurance** — MFA is not a one-time login checkbox. Sensitive actions (billing changes, admin operations, security-setting edits) require *fresh* verification, not just "MFA was used at login". Confirm the code defines how long elevated assurance lasts and re-prompts when it expires, and that account-recovery / password-reset flows can't silently downgrade to single-factor and become an MFA bypass. CWE-308, OWASP A07, ASVS V2.
- **Impersonation and support access** — Admin/support impersonation must be bounded and audited. Logs keep `actor` distinct from `effective_user` (who acted vs who they acted as), impersonation is time-boxed and scoped, and destructive actions stay gated. Impersonation with no audit trail or guardrails is the finding — not impersonation itself. CWE-778, OWASP A09, ASVS V7.
- **Refresh-token hygiene** — Refresh tokens are privileged: rotate on each use, bind to client/context (device, audience), and detect anomalous reuse — presenting an already-rotated refresh token is a compromise signal that must revoke the whole token family, not just fail the request. Confirm explicit revocation on logout, password change, and offboarding, not only short access-token TTLs. CWE-613, OWASP A07, ASVS V3.
- **Default and admin** — No default or backdoor credentials; admin or elevated actions require explicit authorization.

## 4. Sensitive data

- **In transit** — Use HTTPS/TLS for sensitive traffic; no sensitive data in URL query params.
- **In responses** — Do not return PII, secrets, or internal details beyond what the client needs. Mask or omit fields as appropriate.
- **In logs** — No PII (email, phone, etc.) or secrets in log messages. Use structured logging with redaction if the project supports it.
- **In errors** — Do not expose stack traces, SQL, or internal paths to end users; log them server-side only.

## 5. Dependencies

- **Known vulnerabilities** — Run the project's dependency scanner (e.g. `npm audit`, `pip audit`, `go list -m all` with a CVE DB). Address critical/high; document or accept risk for others with justification. Note direct vs transitive in each finding (dependency path, e.g. `express > send > mime`). No fix available → check whether the vulnerable code path is reachable from your code before accepting or escalating.
- **Install-time execution** — A package's install scripts run with the developer's or runner's privileges before a single line is imported: check whether CI installs with `--ignore-scripts`, and treat a dependency that requires them as a reviewed exception.
- **Supply chain** — Require a committed lockfile with frozen CI installs; version ranges in application manifests are fine when the lockfile freezes them — flag a missing or ignored lockfile, not the ranges (build-time executors still get exact pins). Review new dependencies before adding. Prefer well-maintained, widely used packages; an unmaintained package with zero CVEs is still a supply-chain finding. Check for dependency confusion (internal package names resolvable from the public registry) and typosquats; verify provenance where supported (`npm audit signatures`). For a full dependency-graph pass (name authenticity, licenses, reachability), use **awesome-dependency-audit**.

## 6. Configuration and deployment

- **Safe defaults** — Debug or admin endpoints disabled or protected in production. No default passwords or open-by-default settings.
- **Fail-open control paths** — a control whose error branch grants access instead of denying it: `except: return True`, `if err != nil { allow }`, an auth check wrapped in a `try` that swallows and continues, a rate limiter that lets traffic through when its backing store is unreachable, a feature flag defaulting to the permissive side. Read the failure branch of every control, not just its success path — a security control that fails open is off during exactly the outage an attacker triggers. (Availability-critical limiters may fail open by decision; that is a documented choice, and its absence from the docs is the finding.)
- **Sharp edges — APIs that are unsafe in their default form** — the call is spelled correctly and still wrong by default: a verify/validate parameter that defaults to off, a parse function that executes on untrusted input (`yaml.load` vs `safe_load`, `pickle.loads`, `xml` parsers with entity resolution on), a compare that short-circuits, a "quote" helper that only escapes one context. Flag the call site, name the safe sibling, and check whether the same call appears elsewhere (see the variant sweep in the main file).
- **CORS and headers** — CORS restricted to allowed origins; security headers (e.g. CSP, HSTS, X-Frame-Options) set where applicable.
- **File upload** — Validate type and size; store outside web root or with strict permissions; do not execute uploaded content.
- **Serverless** — Audit execution-role IAM (least privilege) and check for plaintext secrets in function logs (e.g. CloudWatch).
- **Behind a WAF/CDN** — The WAF masks origin vulnerabilities; audit and test the origin directly.
- **Security logging** — Auth failures and access-control denials must be logged (their absence is a Low/Medium finding); still never log secrets.
- **SRI** — Third-party CDN scripts on web clients carry `integrity` attributes (Subresource Integrity), or are self-hosted.
- **Cloud posture** (when infra is in scope) — S3/bucket public-read, IAM policies with inline `AdministratorAccess` or `*:*`, RDS/disk encryption-at-rest off, CloudTrail/audit-log not all-regions, security groups exposing SSH/DB to `0.0.0.0/0`. Layer-specific scanners: Trivy/Grype (containers/images), Prowler/ScoutSuite/Checkov (cloud/IaC).

## 7. LLM / AI integration (when the project calls LLMs or runs agents)

- **Output handling** — LLM output that reaches SQL, shell, DOM, `eval`, or tool-call sinks is attacker-influenced input; trace `llm.complete(...) → sink` like any other injection.
- **Prompt assembly** — User or retrieved content concatenated into instructions. Delimiters reduce, not eliminate, injection — the real finding is "untrusted input + LLM output reaching a privileged sink", not "no delimiter tags".
- **System prompt secrets** — Credentials, keys, or authorization rules embedded in the system prompt: assume extractable.
- **Tool surface** — Agent tools follow least privilege; destructive tools sit behind an approval gate; no admin credentials in agent context — short-lived scoped tokens instead.
- **Cost and abuse** — Per-user token/cost caps and timeouts on completion endpoints.
- **Agentic setups** — MCP servers and plugins pinned and allowlisted (tool poisoning is supply chain); generated code executed only in a sandbox; inter-agent messages authenticated; a kill switch / circuit breaker exists.
- **Tool shadowing** — A tool description on one connected server that references, redefines, or redirects a tool on another server; review the tool roster across servers together — per-server review misses the cross-server attack.
- **Toxic tool combinations** — Grade compositions, not single tools: a reader of untrusted content plus any outbound channel (mail, HTTP, commit) composes into exfiltration even when each tool alone looks benign. Map tools to untrusted-input / sensitive-data / external-write and flag the flows that chain all three.
- **Runtime-fetched instructions** — A skill, plugin, or tool that downloads instructions or code from a URL at run time defeats version pinning; finding unless the fetched content is hash-pinned and fails closed. Also sweep tool descriptions and skill files for hidden Unicode (zero-width, bidi overrides, tag block `\U000E0000-\U000E007F`) and decode what's found as the evidence.
- **Cross-user memory / context leakage** — Shared caches, vector stores, and conversation memory key on the user/tenant, so one user's data never surfaces in another's context or retrieval results.

## 8. Business logic and abuse (product-abuse paths)

Distinct from the code-vulnerability categories above: these are flows that work *as coded* but that an attacker or abusive user turns to their advantage. Walk the abuse paths the product actually exposes.

- **Rate-limit bypass** — Limits enforced server-side and per-identity, not per-IP alone (rotating IPs/proxies defeat IP-only). Check the limit can't be reset by casing/whitespace in a key, a second endpoint reaching the same action, or a batch/GraphQL query fanning out under one request.
- **Duplicate / concurrent actions** — Vote, claim, redeem, submit once — enforced with a unique constraint or atomic guard, not a read-then-write. Fire the request 100× in parallel: does the invariant hold?
- **Coupon / payment / refund abuse** — Discount codes have per-user and global caps; refunds can't exceed the charge or be issued twice; price/quantity/currency come from the server, never the client. Trace the money path for negative amounts, integer overflow, and re-applied stacked discounts.
- **Denial-of-wallet / resource exhaustion** — Unauthenticated or cheap requests that trigger expensive server work (LLM calls, image processing, fan-out emails, large exports) need per-identity caps and a global circuit breaker. The attack is cost, not downtime — one user runs up the bill. (Runtime-capacity angle → `awesome-performance-audit`; the cost-abuse angle stays here.)
- **Privilege laundering** — A user routes a forbidden action through a feature that runs with higher privilege (an integration, a shared automation, an admin-invoked job) to do indirectly what they can't do directly.
- **Notification / spam abuse** — Email/SMS/push endpoints an attacker aims at third parties (join-spam, reset-email flooding) or uses to burn a paid quota. Rate-limit per sender and per target.
- **Scraping and bulk export** — Enumerable IDs, unthrottled list/search endpoints, and export features let one account exfiltrate the whole dataset. Cursor limits and per-account volume caps, not just per-request page size.
- **Fake accounts at scale** — Beyond enumeration (uniform responses/timing, under auth): confirm signup can't be automated to seed abuse — anti-automation on the abusable action, not only at signup.
- **Workflow / moderation bypass** — Content or actions that must pass review can't reach the published/trusted state through an alternate path that skips the check.

## 9. CI/CD and build pipeline

The workflow files are executable code holding repository credentials, and they are the least-reviewed files in most repos. Audit them whenever they are in scope.

- **Unpinned actions** — a third-party action referenced by tag or branch (`uses: owner/action@v3`) executes whatever that mutable ref points to today. Full commit SHA only. CWE-1357.
- **Untrusted code in a privileged trigger** — `pull_request_target` and `workflow_run` run with secrets and write scope against the base repo. Checking out or executing PR-head code inside them is remote code execution by design (poisoned pipeline execution). CWE-913.
- **Script injection via expressions** — `${{ github.event.pull_request.title }}` (or branch name, issue body, commit message) interpolated into a `run:` block is expanded before the shell parses it: attacker-controlled text becomes shell code. Values pass through `env:` and are used as quoted variables. CWE-94.
- **Over-broad token scope** — no top-level `permissions:` means the default token scope; a job that only reads should not hold write. CWE-250.
- **Long-lived cloud credentials** — static `AWS_ACCESS_KEY_ID`/service-account JSON in repo secrets where the provider supports OIDC federation with short-lived tokens. CWE-798.
- **Cross-trust cache and artifact reuse** — a cache key or artifact writable by a fork PR job and consumed by a release, signing, or deploy job crosses the trust boundary. CWE-349.
- **Runner exposure** — self-hosted runners serving public-fork PRs, or non-ephemeral runners leaking state between jobs. CWE-269.
- **Secret handling** — secrets echoed for debugging, written to artifacts, or passed as command-line arguments visible in process listings. CWE-532.

## 10. Cryptographic misuse

- **Broken primitive for the role** — MD5 or SHA-1 used for signatures, tokens, or integrity (CWE-327/328). The role decides: MD5 for a cache key or file dedup is fine.
- **Weak randomness** — `Math.random()`, `rand()`, a timestamp, or a PID used for tokens, session ids, salts, nonces, or reset codes instead of a CSPRNG. CWE-338/330.
- **Broken mode or nonce reuse** — ECB, or a static/reused IV/nonce with CBC or GCM; unauthenticated ciphertext where an AEAD was available. CWE-327/323.
- **Non-constant-time comparison** — `===`, `==`, or `strcmp` on a token, MAC, or signature — a timing oracle. CWE-208. The constant-time call is necessary, not sufficient: a length check or an early `return` *before* it (`if len(a) != len(b): return False`), a short-circuiting loop the compiler generates from a hand-rolled comparison, or a secret-dependent branch/table index around it leaks the same information. In compiled languages the optimizer can rewrite a hand-written constant-time loop into a branching one — use the language's vetted primitive (`hmac.compare_digest`, `crypto.timingSafeEqual`, `subtle.ConstantTimeCompare`, `subtle` crates) rather than a loop that only looks branch-free in source.
- **Secrets outliving their use in memory** — keys, passwords, and derived material left in long-lived buffers, logged objects, error payloads, or a global config after the operation that needed them. Where the language allows it (Rust, C/C++, Go), the zeroization must be the kind the compiler may not elide — `zeroize`/`explicit_bzero`/`SecureZeroMemory`, not a plain overwrite the optimizer deletes as a dead store. In garbage-collected runtimes, note it as a bounded limitation instead of pretending it is solved: prefer immutable short-lived values, avoid copying the secret into strings, and never place it in a structure that gets serialized. CWE-226/316.
- **Password hashing** — a fast hash (SHA-256, single-round) instead of argon2id/bcrypt/scrypt, an unsalted hash, or a cost factor that has never been re-tuned. CWE-916.
- **JWT verification** — accepting `alg: none`, not pinning the expected algorithm (HS/RS confusion turns the public key into a signing key), or skipping `exp`/`iss`/`aud`. CWE-347.
- **Hand-rolled crypto** — a custom cipher, padding, key-derivation, or signature scheme where a vetted library exists. CWE-1240.
- **No rotation path** — keys or signing secrets with no key id and no way to re-encrypt, so compromise cannot be recovered from. CWE-320.
- **Disabled certificate validation** — `rejectUnauthorized: false`, `verify=False`, `InsecureSkipVerify: true` outside an explicitly local-only path. CWE-295.
