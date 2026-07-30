# Client-side hardening checklist

Orthogonal to leaks: is the client itself exploitable, regardless of what it discloses? Walk each item, report `file:line` findings with a severity guess, and prefer cheap, behavior-preserving hardening. Not every item applies to every client type (extension / mobile / SPA / CLI / SDK) — skip what's irrelevant and say so.

## 1. Permissions & scopes (minimize)

- Request the narrowest permissions/host scopes that actually work. Flag any broader than the code uses (`<all_urls>`, `tabs`, `scripting`, wildcard OAuth scopes, broad filesystem/network access).
- Restrict web-accessible resources / exported surfaces to the origins that need them.
- Prefer no cross-context entry points (`externally_connectable`, `onMessageExternal`, exported IPC) unless required; if present, validate the caller.

## 2. IPC / message-handler validation (high value)

For every message/RPC/postMessage handler that reaches a privileged action (auth, delete, token read, config write):
- **Validate the sender.** Reject messages whose sender isn't your own code. For browser extensions: check `sender.id === runtime.id`; for MAIN-world ↔ isolated-world bridges, check `event.origin` and `event.source`.
- **Gate by origin, not by transport.** A privileged action should be callable only from your own trusted pages, checked by the sender's **origin** (e.g. `sender.url` starts with your extension/app origin), not by whether it came from a tab — your own privileged pages often run *in* tabs, and a compromised content script also has a tab. Distinguish "content-script/untrusted context" from "own privileged page" explicitly.
- **Schema-validate every payload** before dispatch: allowed message types, field types, length/range caps, URL scheme (`https:` only), enum membership. Parse, don't trust.
- **Least-authority responses:** don't return more than the caller needs (e.g. return an `authed` boolean to a content script, not the account email).

## 3. Auth token handling

- **Storage:** prefer a store not readable by untrusted contexts. In extensions, `storage.local` is readable by every context including content scripts on third-party hosts; `storage.session` with a trusted-contexts access level removes that (at the cost of persistence — a conscious tradeoff). Never persist tokens in a place page JS can read.
- **Egress:** the token must attach *only* to requests to your API origin — a compile-time `https://` constant, never a page-influenced URL, never an `http://` fallback. Grep every `Authorization`/bearer attach site and confirm the URL is fixed.
- **Lifecycle:** clear the token on `401`, sign-out, account deletion, and fresh install. Check no second copy lingers (retry markers, pending-deletion state) after clear.
- **Logging:** redact `authorization`/`token`/`email`/`code` from any debug logging, and gate debug logging to unpacked/dev builds.

## 4. DOM injection / XSS

- Grep for HTML-string sinks: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`, framework `v-html`/`{@html}`, `eval`, `new Function`, string-arg `setTimeout`/`setInterval`.
- Any sink fed by **page-derived** data (DOM you scraped) or **server-derived** data (counts, names, emoji, messages) is an XSS vector. Prefer text nodes / framework escaping; render into a shadow root or sanitize.
- Scheme-gate any href/URL you render from page or server data (allow `http(s):` only; `rel="noopener"` on target-blank links).

## 5. Network layer

- Fixed endpoint paths only; page/DOM input confined to encoded query values and length/shape-validated body fields.
- Origin restricted to your API host via an `https://`-only constant + declared host permissions. (TLS pinning is usually unavailable to web clients — the constant + host allow-list is the practical maximum.)
- No way for page content to influence the request target beyond the intended key.

## 6. Build-time configuration hygiene

- **Backend-override gating:** if the build honors `VITE_API_BASE`/`API_URL`/env overrides, ensure a **production** build can't be silently repointed to an arbitrary origin. Resolve the override at build time and, in production mode, accept only known-good values (e.g. the staging base an e2e build needs); reject others so they never reach the artifact — including the manifest/host permission and the bundled string. (A pure runtime check can still leave the rejected string inlined by the bundler; do it at the `define`/build layer.)
- **No secrets or sourcemaps in the shipped artifact.** Build it and grep: no `*.map`, no `sourceMappingURL`, no secret patterns, no `localhost`/`127.0.0.1`, no internal hostnames.
- **Source bundles:** if you ship "reviewable sources" (store submission, `npm pack`), confirm the exclude list drops `.env`, `.env.*`, and any secret/test-credential file. Build the bundle and grep it — don't trust `.gitignore` to cover the bundler.
- Keep a CI step that fails the build on any of the above (deny-regex over the artifact + a secret scanner like gitleaks).

## 7. Remote config / remote code

- Does the client fetch config, feature flags, adapter/rule lists, or *code* at runtime? If yes: served over your origin only, schema-validated, and never `eval`'d. Static/compiled-in is safer — prefer it.
- No dynamic `import()` of remote URLs, no remote script injection.

## 8. Supply chain (quick pass)

- `postinstall`/lifecycle scripts: what do they run? Flag anything fetching or executing remote content at install.
- Pin risky transitive deps; block unexpected build scripts (`onlyBuiltDependencies`/equivalent). This is a quick pass, not a full dependency audit — hand off deep dep review to a dedicated tool.

## Severity guide

- **High** — privileged IPC callable by an untrusted context; token readable by page/content-script; XSS sink on server/page data; production build repointable to an arbitrary backend.
- **Medium** — over-broad permissions; token in a broadly-readable store with no compromise path proven; missing artifact/secret CI scan.
- **Low / informational** — open shadow root (UI spoof, no secret), platform-limitation permissions, persistent install-id header (privacy, if disclosed).
