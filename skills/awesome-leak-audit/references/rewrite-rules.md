# Rewrite rules

How to fix a leaking comment, string, or doc without deleting information the reader legitimately needs.

## The rule

> Client code and tests may state the **contract** — what input produces what observable result. They must not explain **what or why the server does** it.

The client is allowed to know, and to say, "I send this request and handle these responses." It is not allowed to narrate the server's internal decision. Concretely:

- **Keep:** `HTTP 422 → show the "unsupported address" message`. This is a `status → UI` mapping; the client must branch on it, so it's necessary-minimum.
- **Cut:** `the server runs a disposable-domain check and rejects with 422, surfaced as the unsupported-provider message`. The *why the server returns 422* is server internals with no client benefit.

## The keep-vs-cut test

Ask of each comment/string: **would deleting it change how the client behaves or how a maintainer edits the client?**
- If it only describes the server's reasoning, mechanism, limits, or processing → **cut** (or reduce to the contract).
- If it states a client-side intent, constraint, or a platform/protocol requirement the *client* must honor → **keep**.
- If it's a *user-facing* string stating a user-relevant policy ("your code expires in 10 minutes") → **keep the visible string**, but cut any internal framing in the adjacent non-visible description/comment ("HTTP 423 server lockout after N wrong attempts").

## Prefer renaming over rewording

If a comment exists to explain what a function/variable/branch does, the better fix is usually to **rename the code so the comment becomes unnecessary**, then delete the comment. A self-descriptive name (`retryAfterServerCooldown` → just `retryAfter`) leaks nothing and needs no narration. Name things after the *observable client role*, not the server mechanism they correspond to. Refactors for this must be behavior-preserving.

## Before / after (generic)

**Server-behavior comment → contract only**
```diff
- // The client no longer blocks by domain — the server rejects the disposable
- // address with 422, surfaced as the server-side unsupported-provider message.
+ // A disposable address fails sign-in with the unsupported-provider message.
```

**Leaking a private backend env-var name → drop it**
```diff
- // The worker treats it as a second deterministic test account
- // (env TEST_AUTH_EMAIL_FOR_DELETION).
+ // A second disposable test account used only by the deletion test.
```

**Disclosing cache/anti-abuse mechanics in a test → client-observable wording**
```diff
- // Public counts are eventually consistent (per-target edge cache, s-maxage 60
- // + stale-while-revalidate); wait the cache out and re-read.
+ // Public counts update with a short delay; wait for them to settle and re-read.
```

**Rate-limit keying in a shipped locale description → generic**
```diff
- "description": "Notice shown when a code was requested recently (per-IP throttle)."
+ "description": "Notice shown when a code was requested recently."
```

**Endpoint the client never calls, used only as a probe → use a real endpoint**
```diff
- const res = await fetch(new URL("/health", apiBase)); // liveness probe
+ // Reachability via the same read endpoint the client already uses.
+ const res = await fetch(new URL("/reactions/count", apiBase));
```

**Dead handler hardcoding a server TTL → delete the whole path**
```diff
- // Unused message: returns when the account was authed, derived from the
- // server's 30-day session lifetime.
- case "identity":
-   sendResponse({ authedAt: expiresAt * 1000 - 30 * 24 * 60 * 60 * 1000 });
-   break;
```
(Confirm no live sender first; remove the type from the message union and guards too.)

**Docs: prod-gate internals → contributor-relevant workflow**
```diff
- The production API only records reactions for sites it already recognizes; a new
- site goes live when a maintainer enables it server-side, so until then a
- production build's click is optimistic-only. All staging data is wiped weekly.
+ New sites work against the public staging API before they go live in production —
+ the environment for testing a new-site build end-to-end. Staging data is
+ periodically reset.
```

## What NOT to sanitize

Don't strip the necessary-minimum in a burst of caution — it makes the client harder to maintain and doesn't improve security:
- The endpoint paths the client calls and the request/response fields it uses.
- The client's own retry/backoff/debounce constants and input-validation caps (frame them as *client* choices, which they are).
- Standard handling of `401`/`403`/`429`/`Retry-After` (reacting to a status is not disclosing the policy behind it).
- Comments capturing genuine client-side intent, browser/platform constraints, or public-protocol requirements.
