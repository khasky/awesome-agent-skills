# Client-side hardening checklist

Orthogonal to leaks: is the client itself exploitable, regardless of what it discloses? Walk each item, report `file:line` findings with a severity guess, and prefer cheap, behavior-preserving hardening.

**Runtime-independent by design.** Every rule below is stated as the property to hold; the mechanism that holds it differs per platform, and each section names the ones to look for. Not every item applies to every client type (extension / mobile / desktop / SPA / CLI / SDK) — skip what's irrelevant and say so in the report.

For a browser extension, SPA, or web SDK, read [`browser-client.md`](browser-client.md) alongside this file: it carries the browser mechanisms (extension permissions, storage tiers, DOM sinks, bundler config, npm lifecycle scripts) that implement these rules.

## 1. Capabilities and scopes (minimize)

**Rule:** the client declares the narrowest capability set its code actually exercises, and every declared capability is reachable from real code.

- Flag both directions: **over-declared** (a capability nothing uses) and **under-declared** (code reaching for a capability the manifest never asks for). A wildcard scope is its own finding.
- Where to look per platform: extension/app manifest permissions and host patterns (→ `browser-client.md`), Android `<uses-permission>` and exported components, iOS entitlements and `Info.plist` usage strings, macOS sandbox entitlements, OAuth scope strings, a CLI's filesystem and network reach, an SDK's required host-app grants.
- Prefer no cross-context entry point at all; where one exists, validate the caller (§2).
- Escalate at point of use rather than requesting everything at install where the platform supports it.

## 2. Cross-context entry points (high value)

**Rule:** every message, RPC, or IPC handler that reaches a privileged action (auth, delete, token read, config write) proves *who* called it before acting, and validates *what* it was sent.

- **Identify the caller by identity, not by transport.** "It arrived over our channel" is not authentication; the channel is usually reachable by anything on the device or in the page.
- Where the entry points live per platform: `postMessage` and extension messaging (→ `browser-client.md`), Android exported Activities/Services/Receivers and Intent extras, iOS/macOS XPC and custom URL schemes, Electron `ipcMain` handlers and preload bridges, Unix domain sockets, Windows named pipes, D-Bus, and any localhost HTTP port the client opens — a local port is callable by every process and, without CSRF protection, by any web page.
- **Schema-validate every payload** before dispatch: allowed message types, field types, length and range caps, URL scheme (`https:` only), enum membership. Parse, don't trust.
- **Least-authority responses** — return the minimum the caller needs (an `authed` boolean to an untrusted context, not the account email).

## 3. Auth token handling

**Rule:** the token lives in the most protected store the platform offers, leaves only toward your own API origin, is cleared on every end-of-session event, and never appears in a log.

- **Storage** — use the platform's protected credential store, not a general-purpose one: OS keychain/keyring for desktop and CLI clients (Keychain, Credential Manager/DPAPI, libsecret), Keystore-backed storage on Android, Keychain with the right accessibility class on iOS, the ephemeral trusted-context store in an extension (→ `browser-client.md`). Never persist a token where an untrusted context on the same device or origin can read it.
- **Egress** — the token attaches *only* to requests to your API origin: a compile-time `https://` constant, never a runtime- or input-influenced URL, never an `http://` fallback. Grep every `Authorization`/bearer attach site and confirm the target is fixed.
- **Lifecycle** — clear on `401`, sign-out, account deletion, and fresh install. Check no second copy lingers (retry markers, queued requests, pending-deletion state) after the clear.
- **Logging** — redact `authorization`/`token`/`email`/`code` from any debug logging, and gate debug logging to dev/unpacked builds.

## 4. Untrusted data reaching an interpreter

**Rule:** data the client did not author — from the network, from a scraped page, from another process, from a file it was pointed at — never reaches something that interprets it as code or markup without escaping or validation.

- Trace source→sink rather than grepping for sink names alone; the finding is the *path*, not the presence of a sink.
- Sinks by platform: HTML, CSS, and JS-evaluation sinks in a web client (→ `browser-client.md`), WebView `loadUrl("javascript:…")` and `addJavascriptInterface` on mobile, shell and process-spawn calls in a CLI (`exec`, `system`, shell-interpolated arguments), SQL in a local database, template engines, deserializers, and format strings.
- Scheme-gate any URL built from untrusted data (`http(s):` only) before it is opened, rendered, or followed.

## 5. Network layer

**Rule:** untrusted input cannot influence *where* a request goes, only what it carries in validated fields.

- Fixed endpoint paths; input confined to encoded query values and length/shape-validated body fields.
- Origin restricted to your API host by an `https://`-only constant plus whatever host allow-list the platform declares.
- Certificate validation is never disabled — no `rejectUnauthorized: false`, `verify=False`, `InsecureSkipVerify: true`, or a trust-all TLS handler outside an explicitly local-only path. Certificate pinning where the platform supports it (native mobile and desktop); a web client generally cannot pin, so the fixed constant plus the host allow-list is its practical maximum.

## 6. Build-time configuration hygiene

**Rule:** a production build cannot be repointed at an attacker's backend, and the shipped artifact carries no secret, no internal hostname, and no debug metadata.

- **Backend-override gating** — if the build honors an env override for the API base, resolve it at build time and, in production mode, accept only known-good values so a rejected value never reaches the artifact. A runtime-only check is not enough: the build tool may have already inlined the string.
- **No secrets or debug metadata in the shipped artifact** — build it and grep. Per platform: source maps in a web bundle (→ `browser-client.md`), `BuildConfig` fields and unstripped debug symbols on Android, `Info.plist` entries and dSYMs on iOS, values baked in via linker flags (`-ldflags -X`) or embedded resources in a compiled binary.
- **Source bundles** — anything you ship as "reviewable sources" (store submission, package tarball, a directory backup) is built by a tool that does **not** honor `.gitignore`. Confirm its exclude list drops `.env`, `.env.*`, and every test-credential file, then build the bundle and grep it. Untracked is not safe.
- Keep a CI step that fails the build on any of the above (a deny-regex over the artifact plus a secret scanner such as gitleaks).

## 7. Remote config and remote code

**Rule:** anything the client fetches at runtime and then *acts on* is served by you, schema-validated, and never executed.

- Config, feature flags, adapter/rule lists: your origin only, validated against a schema, with a safe fallback when validation fails. Static or compiled-in is safer — prefer it.
- No dynamic import of a remote URL, no remote script or plugin injection, no `eval` of fetched content, no writing fetched content to a path that is later executed.

## 8. Supply chain (quick pass)

**Rule:** nothing runs during dependency install or build that you have not read.

- Install- and build-time hooks execute with the developer's or runner's privileges before any of your code does. Find this ecosystem's version: npm lifecycle scripts (→ `browser-client.md`), `setup.py`/PEP 517 build backends in Python, `build.rs` in Rust, Gradle build scripts and plugins on Android, CocoaPods/SwiftPM plugin phases, Makefiles invoked by the build.
- Pin risky transitive dependencies and block unexpected build scripts where the package manager allows it.
- This is a quick pass, not a full dependency audit — hand deep dependency review to a dedicated tool or skill.

## Severity guide

- **High** — a privileged entry point callable by an untrusted context; a token readable by an untrusted context on the same device or origin; an untrusted-data-to-interpreter path; a production build repointable to an arbitrary backend.
- **Medium** — over-broad capabilities; a token in a broadly-readable store with no compromise path proven; a missing artifact/secret CI scan.
- **Low / informational** — UI-spoofing surfaces with no secret behind them, platform-limitation permissions, a persistent install-id header (privacy, if disclosed).
