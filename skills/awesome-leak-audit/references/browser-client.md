# Browser-client hardening (extensions, SPAs, web SDKs)

The browser-specific half of the hardening pass. Load it **in addition to** `client-hardening.md` — that file carries the runtime-independent rules (caller validation, token handling, egress, build config, supply chain) and this one carries the browser mechanisms that implement them. Skip this file entirely for a native mobile, desktop, CLI, or server-side SDK client.

## 1. Extension permissions and install warnings

- Map each requested permission to its install-warning weight: `storage`, `alarms`, `activeTab`, and `scripting` alone are warning-silent; broad host access and `tabs` scare users at install.
- Request `tabs` only if you read `.url`/`.title` — tab id and index don't need it. The standard fix for a permission you need rarely is point-of-use escalation via `optional_permissions`.
- `<all_urls>` and wildcard host patterns are their own finding when the code only ever touches a known set of origins.
- Restrict `web_accessible_resources` to the origins that need them; prefer no `externally_connectable` / `onMessageExternal` at all, and validate the caller where one exists.

## 2. Message-handler validation (browser mechanisms)

Implements the caller-validation rule in `client-hardening.md` §2.

- **Extension messaging** — check `sender.id === runtime.id` to reject messages from other extensions.
- **Own privileged page vs content script** — gate by the sender's **origin** (`sender.url` starts with your extension origin), not by whether the message arrived from a tab: your own privileged pages often run *in* tabs, and a compromised content script also has one.
- **MAIN ↔ isolated world bridges and cross-frame `postMessage`** — check `event.origin` against an allowlist and check `event.source`. An `origin.includes('example.com')` substring test passes `example.com.evil.tld`; compare the full origin.

## 3. Storage tiers for sensitive values

Implements the token-storage rule in `client-hardening.md` §3.

- `storage.session` (ephemeral, trusted-contexts access level) over `storage.local` (on-device, readable by every context including content scripts on third-party hosts) over `storage.sync`.
- Never put tokens or PII in `storage.sync` — it replicates to the vendor's servers and to every signed-in device.
- `localStorage`/`sessionStorage` in a page context are readable by any script that lands on that origin, XSS included; a token there is a token an injected script can take.

## 4. DOM injection / XSS

Run this source→sink, not as a grep for bad function names.

- **Attacker-influenced sources** — `location.hash`, `location.search`, `window.name`, `document.referrer`, `postMessage` data, the scraped page DOM, and server-derived values (counts, names, emoji, messages).
- **HTML-string sinks** — `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`, framework `v-html` / `{@html}`, `eval`, `new Function`, string-argument `setTimeout`/`setInterval`.
- **CSS-value sinks** — `style.cssText`, `CSSStyleSheet.insertRule`. Untrusted CSS enables exfiltration and timing tricks; it is not a cosmetic sink.
- Walk each sink back to its source. Server-side escaping ends where the URL fragment begins — the fragment never reaches the server.
- Prefer text nodes and framework escaping; render into a shadow root or sanitize. Scheme-gate any href or URL built from page/server data (allow `http(s):` only) and put `rel="noopener"` on target-blank links.

## 5. Privileged-page CSP

- Privileged extension and app pages set `frame-ancestors 'none'` in their CSP (clickjacking).
- An open shadow root is a UI-spoofing surface, not a secret leak — Low unless it renders privileged content.

## 6. Bundler and build-time configuration

Implements the build-config rule in `client-hardening.md` §6 with the JS toolchain's specifics.

- **Backend-override gating** — if the build honors `VITE_API_BASE` / `API_URL` / similar env overrides, resolve the override at the `define`/build layer and, in production mode, accept only known-good values (e.g. the staging base an e2e build needs). A pure runtime check still leaves the rejected string inlined by the bundler, so it must be rejected before the artifact is written — including in the manifest and host permissions.
- **Shipped artifact** — build it and grep: no `*.map`, no `sourceMappingURL`, no secret patterns, no `localhost`/`127.0.0.1`, no internal hostnames.
- **Source bundles** — a store submission zip or `npm pack` output does **not** honor `.gitignore`. Confirm the `files`/`.npmignore`/submission exclude list drops `.env`, `.env.*`, and any test-credential file, then build the bundle and grep it.

## 7. npm supply chain

Implements `client-hardening.md` §8 for the npm ecosystem.

- `postinstall` and other lifecycle scripts run with the developer's or runner's privileges before a single line is imported. Flag anything fetching or executing remote content at install; check whether CI installs with `--ignore-scripts`.
- Block unexpected build scripts (`onlyBuiltDependencies` or the package manager's equivalent) and pin risky transitive dependencies.
- Quick provenance check on a suspicious package: `npm view <pkg> --json` (unpacked size, file count, repository link) against what it claims, then read the real source from the tarball rather than the README.
