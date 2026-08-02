---
name: awesome-api-design
description: "Designs or reviews the shape of an HTTP API before code exists — resource modeling, versioning strategy, pagination, idempotency, filtering, and how the error contract plugs in. Use when asked to 'design the API', 'review my API design', 'how should we version / paginate', 'add an endpoint' at the design stage, or when awesome-design-doc needs the API contract detailed. Do not use for the error envelope internals and retry semantics — use awesome-error-standards; not for auth/injection review of implemented handlers — use awesome-security-audit; not for auditing an implemented codebase's architecture — use awesome-architecture-audit."
license: MIT
metadata:
  author: Khasky
  tags: ["api", "design", "rest", "versioning", "pagination"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-api-design"
---

# API Design

Shape an HTTP API so its consumers can build against it for years without a breaking surprise. The contract is the product: URLs, methods, payloads, errors, and evolution rules are decided here, deliberately — everything left implicit becomes an accidental contract the first client depends on.

## When to Activate

- "Design the API for X", "review this API design / OpenAPI spec", "how should we version / paginate / handle retries".
- A design doc needs its API section made concrete (awesome-design-doc hands off here).
- A new endpoint is being added to an existing API and must match its conventions.

Do **not** activate to define the error envelope's fields or retry classification (awesome-error-standards owns that contract) or to audit implemented handlers for vulnerabilities (awesome-security-audit).

## Work Process

1. **Inventory the incumbent conventions** — an existing API's casing, id format, pagination style, and envelope win over any guideline here: consistency within one API beats global best practice. Only a new API starts from the defaults below.
2. **Model resources, not procedures** — nouns with identity and lifecycle (`/orders/{id}`), actions as state transitions on them (`POST /orders/{id}/cancel` when a pure verb is unavoidable — never `/doCancelOrder`). Nest at most one level deep; deeper hierarchies become query filters (`/comments?post_id=…`), because every nesting level hardcodes an ownership assumption into every client URL.
3. **Decide the evolution rules before v1 ships** — additive changes (new optional field, new endpoint) go in place; anything breaking (remove/rename/retype a field, tighten validation) only ever creates a new version. Publish that taxonomy with the API so consumers know what is safe to ignore. Evolve by layering — a redesigned abstraction ships beside the old one and existing integrations keep working until their owners move; deprecation is announced with a sunset window, never enforced by an in-place change.
4. **Design list endpoints for growth** — opaque cursor pagination (encode the `(sort_key, id)` position, return `has_more` + `next_cursor` in a list envelope) over offset, which skips and duplicates rows under concurrent writes and dies on deep pages. Filtering and sorting are an allowlist of named parameters over indexed fields, never a pass-through to the query layer.
5. **Make unsafe methods retry-safe** — mutations accept an `Idempotency-Key`; same key + same body replays the stored response, same key + different body is 409. Without it, every client retry is a potential duplicate side effect. (Retry classification and the envelope format: **awesome-error-standards**.)
6. **Specify concurrency and partial updates** — updates that can conflict get optimistic concurrency (`ETag` + `If-Match`, 409 with the current version on mismatch); PATCH semantics are declared (merge-patch vs replace), and an empty PATCH is rejected, not silently a no-op.
7. **Write the contract down as the source of truth** — an OpenAPI/schema document that generates or validates the implementation, not prose that drifts from it. Ids are opaque and prefixed (`ord_…`), timestamps ISO 8601 UTC, money integer minor units with currency, enums closed with a documented default for unknown values on the consumer side.

## Design review checklist

When reviewing an existing design, walk the same decisions as findings:

- Naming and casing consistent across every endpoint; no mixed `camelCase`/`snake_case` payloads.
- No verbs in resource paths except modeled state transitions; no RPC-style `/getX` endpoints beside REST resources.
- Every list endpoint paginated from day one — retrofitting pagination is a breaking change.
- Every mutation idempotent-by-key or documented as naturally idempotent.
- Error responses reference one stable envelope (**awesome-error-standards**) — not per-endpoint improvisation.
- Versioning and deprecation policy stated; no "we'll decide when we break something".
- Webhooks the API sends are treated as public surface: signed, versioned, redeliverable — same contract discipline as endpoints.
- Nothing in the response a client shouldn't see: internal ids, flags, or fields leaking through by serializer default.

## Output Format

```text
API Design — <scope> — <date>

Contract decisions:
- <area: resources | versioning | pagination | idempotency | concurrency> — <decision> — <the consumer consequence it buys>
...

Spec: <OpenAPI/schema skeleton or diff, when producing one>
Deviations from incumbent conventions: <each with its justification, or "none">
Open questions: <decisions needing the user, with a recommended default each>
```

## Self-check before delivering

- Run the design review checklist above against your own output — a finding in your own design gets fixed before delivery, not shipped with a caveat.
- Every contract decision names the consumer consequence it buys; "because best practice" is not a justification — delete or justify.
- Step 1 has evidence: name the incumbent spec, routes, or client code actually inspected. Defaults applied to an API that has conventions is the failure mode.
- Every mutation in the design answers the retry question (idempotency key or naturally idempotent — stated which); every list endpoint answers the growth question.
- Each open question carries a recommended default; a bare question pushes the design work back to the reader.

## Anti-patterns

| Anti-pattern | Instead |
|---|---|
| Offset pagination on a growing table | Opaque cursor over an indexed sort key |
| Breaking change hidden as a "fix" | New version; the old shape never changes under a client |
| Per-endpoint error shapes | One envelope, one shared client-side parser |
| Sequential integer ids in URLs | Opaque prefixed ids; sequence leaks volume and invites enumeration |
| `PUT` that silently drops unknown fields | Declared PATCH semantics; strict validation with named rejections |
| Prose spec that trails the implementation | Machine-readable contract that generates or gates the code |
| Designing for the first client's screen | Resources model the domain; view composition belongs to the client |
