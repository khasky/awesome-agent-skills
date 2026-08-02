# awesome-leak-audit

Audits a public-facing client — browser extension, mobile/desktop app, SPA, CLI, SDK, any open-sourced client that talks to a private backend — so its public surface stays self-contained: it may reveal the calls it makes and the data it exchanges, but nothing about how the backend works.

The risk is everything beyond the unavoidable: comments explaining server logic, disclosed rate limits and anti-abuse mechanics, backend tech-stack and infra names, private repo paths, test scaffolding that documents server behavior, and secrets sitting one bundle-step from publication. Each of those is free reconnaissance for an attacker.

The method: **scope the public/private boundary → sweep for leaks → harden the client → remediate → verify → report.**

## What it checks

- **Disclosure leaks** — backend stack and infra identifiers, anti-abuse/rate-limit/quota mechanics, auth internals, secrets, test code that encodes server behavior, server-explaining comments, dead code hardcoding server policy.
- **Client-side hardening** — capability minimization, cross-context caller validation, token storage and egress, untrusted data reaching an interpreter, build-time config gating, source-bundle hygiene, supply-chain quick pass. Stated runtime-independently, with the browser mechanisms split into their own reference so a native, desktop, or CLI client isn't audited against an extension checklist.
- **API over-disclosure** — separating the necessary minimum (endpoints, payload shapes, `status → UI` mappings) from over-disclosure (server-side processing, limits the client doesn't need).

The rewrite rule it applies to comments, strings, and docs:

> Client code may state the contract (what input produces what observable result). It must not explain what or why the server does it.

## Folder map

| Path | What's inside |
|---|---|
| `SKILL.md` | The method the agent follows |
| `references/leak-taxonomy.md` | What to hunt, why it matters, starter search patterns |
| `references/rewrite-rules.md` | The comment/string rewrite rule with before/after examples |
| `references/client-hardening.md` | Client-side security checklist, runtime-independent |
| `references/browser-client.md` | The browser half of that checklist — extension permissions, storage tiers, DOM/CSS sinks, bundler config, npm lifecycle scripts |
| `references/report-template.md` | Output report structure |
| `scripts/leak-sweep.sh` | Parameterized ripgrep sweep to seed the audit — customize its `PRODUCT_TERMS` with the product's own private vocabulary |

## Usage

Ask in your own words — the skill triggers on intent:

- "Audit this repo for anything that leaks backend details before we open-source it."
- "Does the extension disclose our rate limits or server internals?"
- "Is this client safe to publish? Check secrets and comments."

Or run the sweep standalone: `scripts/leak-sweep.sh path/to/public/client`

Defensive by design: it reduces a client's public attack surface; it does not build exploits. Run it on code you own or are authorized to audit.

Installation for every agent is covered in the [repo root README](../../README.md#install).
