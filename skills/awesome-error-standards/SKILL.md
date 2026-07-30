---
name: awesome-error-standards
description: "Applies consistent error handling, logging, and user-facing messages: typed errors, operational-vs-programmer classification, API error envelopes, HTTP status mapping. Use when adding or refactoring error handling, designing an API error contract, reviewing failure paths, or when the user says 'error handling', 'consistent errors', 'обработка ошибок'."
license: MIT
metadata:
  author: Khasky
  tags: ["error-handling", "reliability", "api", "patterns"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-error-standards"
---

# Error Handling Patterns

Apply consistent patterns for throwing, catching, logging, and surfacing errors so failures are predictable and debuggable without leaking internals.

## When to Activate

- Implementing or refactoring error handling in an API or app
- User asks for "error handling", "how to handle errors", or "consistent errors"
- Reviewing code for proper failure handling
- Defining or documenting error contract for a service or API

## Core Principles

- **Operational vs programmer errors** — Classify first. Operational failures (network timeout, invalid input, missing record) are expected: handle, retry, or surface them. Programmer errors (undefined access, broken invariant) are bugs: crash loudly or restart the process rather than limping on with corrupted state.
- **Make the bug impossible, not just fixed** — A single-point fix stops one path; defense in depth stops the class. Prefer prevention left of production, in order: (1) make invalid states unrepresentable in the type system (discriminated unions, branded/opaque types) so bad states won't compile; (2) validate at the boundary; (3) runtime guards; (4) error boundaries. For a high-value invariant, guard it at more than one layer and test that bypassing an outer layer still gets caught by an inner one (deliberately skip Layer 1, verify Layer 2 catches it; confirm mocks don't silently disable a validation).
- **Fail at startup, not in production** — Validate all required config, env vars, and connections at init and refuse to boot on failure, rather than discovering a missing value on the first request.
- **Fail fast** — Validate inputs and preconditions early; throw or return errors with clear messages. Do not continue with invalid state.
- **Do not swallow** — Avoid empty catch or broad catch that ignores; log and/or rethrow or return a result type. Propagate with context.
- **Structured errors** — Use a consistent shape (e.g. code, message, details) for API errors and for logs. Typed error classes or codes help callers handle by type.
- **User vs developer** — User-facing messages are safe and actionable; developer-facing detail (stack, internal message, request id) in logs or debug only. Never expose stack traces or SQL to end users.

## Work Process

1. **Identify boundaries** — Where do errors originate (validation, DB, external API, auth)? Where are they handled (route handler, middleware, top-level)? Ensure every layer either handles or propagates with context.
2. **Define error shape** — For API: HTTP status + body envelope (code, message, optional details). For code: error class or result type. Match existing project pattern if present.
3. **Map errors to HTTP (for APIs)** — Validation → 400 or 422; auth → 401; authz → 403; not found → 404; conflict → 409; server → 500. Do not return 200 with `success: false` for errors. Pick ONE style for validation failures (400 vs 422), document it, and apply it across every endpoint — mixed behavior breaks generated clients and callers' error branching.
4. **Log before respond** — Log error with context (request id, user id if safe, operation) at appropriate level (error/warn). Then return user-safe response.
5. **Validate and sanitize** — Use schema (Zod, Pydantic, etc.) at API boundary; return field-level validation errors in consistent format.

## API Error Response

**Standard envelope:**

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address", "code": "invalid_format" }
    ]
  }
}
```

- **code** — Machine-readable (e.g. `validation_error`, `not_found`, `rate_limit_exceeded`). Clients can switch on this.
- **message** — Human-readable, safe to show to user. No stack traces or internal paths.
- **details** — Optional; for validation, list field-level errors. Omit for generic 500.
- **request_id / trace_id** — Optional in envelope or headers for support; do not expose internals.

**HTTP status:** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error. Use semantically; do not use 200 for errors.

## Retrying failed calls (client side)

Classify every failure by whether a retry can help — retrying a non-retryable error just wastes time and can double effects:

- **Never retry** (fix the request): 400, 401, 403, 404, 415, most 422 — the input or auth is wrong, retrying won't change it.
- **Retry after modifying the request**: 402 (top up / change plan), some 422 (adjust payload). Not a blind retry.
- **Retry with backoff**: 429, 500, 502, 503, 504 — transient. Cap attempts (~5) and total wait (~30s); use exponential backoff **with jitter** to avoid thundering herds.

Rules:
- **Honor the server's signal** — respect `Retry-After` and `X-RateLimit-Reset`/`X-RateLimit-*` headers over your own timer when present.
- **Idempotency-Key on retried state-mutating requests** — a POST/PATCH that charges, creates, or sends can succeed on the server while the response is lost; a naive retry double-charges. Send a stable idempotency key so the server dedupes.
- **Streaming (SSE/websocket)** — errors arrive as an in-stream event (an `error` event or a terminal frame), not as an HTTP status, because the status was already 200 when the stream opened. Handle the stream's error channel explicitly, not just the initial response code.

## Code Patterns

**Typed errors (recommended):**

```typescript
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}
// Caller: catch (e) { if (e instanceof NotFoundError) return res.status(404).json(...); }
```

**Layered handling:** Lower layers throw or return Result; route handler or middleware catches and maps to HTTP + log. Do not catch at every layer; propagate and handle at boundary.

**Async:** Use try/catch in async functions; ensure promise rejections are handled (e.g. global handler or .catch) so they are logged and not unhandled. Register boundary handlers for `unhandledRejection`/`uncaughtException` (or the platform's equivalent): log with context, then exit for programmer errors — do not resume on corrupted state.

## Logging with Errors

- **Level:** error for failures that need attention; warn for recoverable (e.g. retry, fallback).
- **Content:** Log message, error type, stack (server-side only), request_id. Do not log secrets or full PII.
- **Once:** Log at the boundary where you handle the error; avoid logging the same error at every layer.
- **Safe serialization:** In log/error paths use a safe serializer (`safeStringify`, structured logger's own serializer), not raw `JSON.stringify` — it throws on circular references and `BigInt`, which can crash the very handler trying to report the failure.

## Rules

- Match existing project patterns (error classes, response shape, logging). If none exist, introduce a minimal consistent pattern and document it.
- Do not expose internal details (stack traces, DB errors, file paths) to end users; log them server-side only.
- Validation errors: return 400/422 with field-level details, not 500.

## Silent failures

The hardest class: it starts fine, returns 200, and quietly does nothing (or the wrong thing). Diagnose in order: unwired/unregistered component → undefined reference resolving to a no-op → type/signal mismatch dropping the payload → a swallowed error (`catch {}`, `|| true`) → sampling/filtering upstream making a downstream metric silently wrong. Never conclude a feature is absent because a key was rejected — look up that component's *own* key before shipping a degraded config, and disclose any tool/method substitution rather than reporting the original as missing.

## Checklist

- [ ] Inputs validated at boundary; validation errors returned in standard shape
- [ ] Errors mapped to correct HTTP status (no 200 for errors)
- [ ] User-facing message safe and actionable; detail in logs only
- [ ] Errors logged with context (request id, operation) before responding
- [ ] No empty catch; either handle, log and rethrow, or return result type

## Anti-patterns

| Anti-pattern | Better approach |
|--------------|-----------------|
| 200 OK with `{ success: false, error: "..." }` | Use proper HTTP status (4xx/5xx) and error body |
| Empty catch block | Log and rethrow, or return Err(result); document if intentionally ignoring |
| Discarded errors: `_ := f()` in Go, bare `except:` in Python, unchecked `Close()` | Handle the error, or document in place why ignoring is safe |
| `panic()` / `process.exit()` inside library code for operational errors | Return or throw a typed error; let the boundary decide |
| Logging full request/response on error | Log ids and summary; redact secrets and PII |
| Exposing stack trace to client | Log stack server-side; return generic message to client |
| Different error shape per endpoint | Use one envelope (code, message, details) across API |
| Transport-aware domain errors: services or repositories returning/throwing framework response objects or HTTP status codes | Throw transport-agnostic typed errors; exactly one global handler maps them to HTTP — business logic stays decoupled from delivery, easier to reuse and test |
