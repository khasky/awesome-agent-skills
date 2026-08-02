---
name: awesome-code-standards
description: "Universal coding standards: naming, structure, immutability, error handling, type safety, plus backend layering and frontend architecture/motion patterns for consistent code. Use when starting a project or module, refactoring to team conventions, setting up lint/format rules, onboarding, or when the user says 'coding standards', 'naming conventions', 'code style', 'стандарты кода'. Discovers and follows the project's own conventions first; these rules fill the gaps. Do not use for a repo-wide comment/noise cleanup pass (use awesome-code-cleanup) or for designing the API error contract (use awesome-error-standards)."
license: MIT
metadata:
  author: Khasky
  tags: ["coding-standards", "conventions", "naming", "code-quality"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-code-standards"
---

# Coding Standards

Apply consistent naming, structure, and patterns so code is readable and maintainable across the team.

## When to Activate

- Starting a new project or module
- Refactoring to match team conventions
- Setting up or updating lint/format/type-check rules
- Reviewing code for consistency
- Onboarding: documenting or applying coding conventions
- Enforcing naming, formatting, or structural consistency

## Core Principles

1. **Readability first** — Code is read more than written; clear names and structure beat clever tricks.
2. **KISS** — Simplest solution that works; avoid over-engineering and premature optimization.
3. **DRY** — Extract common logic into functions/modules; avoid copy-paste.
4. **YAGNI** — Don't build for speculative future needs; add complexity when required.
5. **Immutability** — Prefer const; avoid mutating arguments or shared state; use spread/copy where needed.

## Work Process (when applying standards)

1. **Discover project conventions** — Scan existing code: naming (camelCase vs snake_case), file layout, import style, test patterns. Check for CONTRIBUTING, .eslintrc, .prettierrc, or editorconfig.
2. **Identify violations** — Compare changed or new code against those conventions and the rules below.
3. **Suggest concrete fixes** — Rename symbols, extract functions, add types, fix formatting. Prefer one logical edit per suggestion.
4. **Document exceptions** — If the project has an exception (e.g. "use any here for legacy"), note it rather than "fixing" it without context.

## Naming Conventions

### Variables and functions

```typescript
// GOOD: Descriptive, verb-noun for functions
const marketSearchQuery = 'election';
const isUserAuthenticated = true;
async function fetchMarketData(marketId: string) {}
function calculateSimilarity(a: number[], b: number[]) {}

// BAD: Unclear or noun-only for actions
const q = 'election';
const flag = true;
async function market(id: string) {}
function similarity(a, b) {}
```

### Constants

- UPPER_SNAKE for true constants (e.g. `MAX_RETRIES`, `API_BASE_URL`).
- Or project convention (some codebases use camelCase for config objects).

### Types and interfaces

- PascalCase: `User`, `OrderItem`, `ApiResponse<T>`.
- Suffix with role if helpful: `CreateUserRequest`, `UserResponse`.

### Files

- Components: PascalCase (`Button.tsx`, `UserProfile.tsx`).
- Utilities/hooks: camelCase (`formatDate.ts`, `useAuth.ts`).
- Types: camelCase with `.types` or `.d` as project uses (`market.types.ts`).

## Immutability (critical)

```typescript
// GOOD: Spread and new references
const updatedUser = { ...user, name: 'New Name' };
const updatedArray = [...items, newItem];

// BAD: Direct mutation
user.name = 'New Name';
items.push(newItem);
```

## Error Handling

```typescript
// GOOD: Validate, throw or return with context
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw new Error('Failed to fetch data');
  }
}

// BAD: No handling or swallowed errors
async function fetchData(url: string) {
  const response = await fetch(url);
  return response.json();
}
```

## Async and concurrency

```typescript
// GOOD: Parallel when independent
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats(),
]);

// BAD: Sequential when unnecessary
const users = await fetchUsers();
const markets = await fetchMarkets();
const stats = await fetchStats();
```

## Type Safety

```typescript
// GOOD: Explicit types, no any
interface Market {
  id: string;
  name: string;
  status: 'active' | 'resolved' | 'closed';
}
function getMarket(id: string): Promise<Market> { /* ... */ }

// BAD: any or untyped
function getMarket(id: any): Promise<any> { /* ... */ }
```

## Comments and docs

- **Explain why, not what** — "Use exponential backoff to avoid overwhelming the API" not "Increment retry count." A comment that only restates the code is noise; delete it or rename the code so it isn't needed.
- **Plain ASCII punctuation** — Write comments the way a developer types them: `-` not `—`, `...` not `…`, straight quotes, no decorative glyphs or emoji. Typographic glyphs in a comment are an AI-generation tell, not house style. (Comment text only — never string literals, identifiers, or data.)
- **JSDoc for public APIs** — Summary, @param, @returns, @throws, optional @example. Match project style.
- **No commented-out code** — Remove or explain in a ticket; use version control for history.

That is the bar for code you are writing or touching now. For a repo-wide pass over existing comments — deciding what to delete, condense, or fix, with the false-positive boundaries and the behavior-preserving verification gate — use **awesome-code-cleanup**, which owns that procedure.

## File and project structure

- Follow existing layout (e.g. `src/app/`, `src/components/`, `src/lib/`).
- One main export per file unless the project uses barrel files or index re-exports.
- Group imports: stdlib → third-party → local; alphabetical or by path per project.

## Backend layering and boundaries (when applicable)

- **Three-model split** — keep DTO/API models, domain models, and persistence/ORM models separate. One `User` object flowing through transport, business logic, and storage traps API shape to table shape and makes every refactor touch every layer.
- **Layer-placement heuristic** — needs HTTP status codes → edge/controller; needs business rules → service; needs tables/indexes/ORM → repository. Flow one direction: `controller -> service -> repository -> gateway`.
- **Cross-cutting concerns once at the edge** — auth, validation, rate-limit, request IDs, logging live in the HTTP pipeline (global middleware/hooks or route-scoped setup), never hand-copied into each handler. The rule: do not repeat policy by hand in every endpoint.
- **Errors don't know transport** — services and repositories throw domain errors; one global handler maps them to status codes.
- **Contract-first** — OpenAPI (or equivalent) is the single source of truth for request/response shapes; generate typed clients from it and fail CI on spec drift.

```typescript
// GOOD: service throws a domain error; the global handler maps NotFoundError -> 404
throw new NotFoundError('market', id);

// BAD: business logic reaches into HTTP transport
return res.status(404).json({ error: 'not found' });
```

This section only places the layers. Designing the error envelope, HTTP status mapping, and retry policy in depth is **awesome-error-standards**' job — go there when the task is the error contract itself.

## Code smells to fix

| Smell | Action |
|-------|--------|
| Function > ~50 lines | Split into smaller functions with clear names |
| Deep nesting (5+ levels) | Use early returns or extract functions |
| Magic numbers | Extract named constants (e.g. `MAX_RETRIES`, `DEBOUNCE_MS`) |
| Long parameter list | Use options object or split into smaller types |
| Duplicate logic in two places | Extract to shared function or module |
| `{count && <X/>}` in JSX | Renders literal `0`/`NaN` when falsy — use an explicit ternary `count > 0 ? <X/> : null` |
| Component defined inside another component | Hoist it out — a nested definition is a new type each render and remounts, losing state |
| State derivable from props/state kept in `useState`+`useEffect` | Derive it during render (or use a keyed reset) — no effect needed |

Numeric thresholds are a starting point, not a law; a documented repo standard always wins, and don't re-flag what a linter or type-checker already enforces. Before inventing a pattern, search the codebase — the problem is often already solved somewhere; reuse it rather than adding a second way to do the same thing.

## Frontend rendering and motion (when applicable)

- **Animate only compositor properties** — `transform` and `opacity`. Never animate layout properties (`width`, `height`, `top`, `margin`) — they trigger reflow every frame; use the FLIP technique for position changes.
- **Never interleave layout reads and writes in one frame** — batch reads (`getBoundingClientRect`, `offsetWidth`) before writes to avoid layout thrashing.
- **Prefer `animation-timeline: view()/scroll()`** over JS scroll-event listeners for scroll-linked animation; use `will-change` surgically and remove it after.
- Sensible defaults: `text-balance` on headings, `text-pretty` on body, `tabular-nums` for numeric columns, `h-dvh` over `h-screen`, interactions under ~200ms, one accent color per view, a fixed z-index scale.

## Frontend architecture (when applicable)

- **Feature-first folders** — product code (pages, feature components, state, feature-scoped API adapters, tests) lives together in a feature/module folder. Shared folders hold only cross-app primitives: design system, app shell, routing bootstrap, global config, i18n. Anti-patterns: a `shared`/`common`/`utils` bucket with no boundary; a giant global `components/`; a folder per one-file throwaway.
- **Colocate** — a component or hook that matters keeps its test, story, styles, and an `index.ts` re-export next to it.
- **Route-level code-splitting is the default perf win** — lazy-load route chunks; keep dashboard-sized deps out of the initial bundle when the landing page doesn't need them. Profile before hand-optimizing components. (Distinct from the compositor/animation rules above — this is bundle shape, not frame budget.)
- **Consume the API contract, don't re-type it** — generate TypeScript types from the same OpenAPI spec the backend owns instead of hand-duplicating request/response shapes. Use a server-state library (e.g. TanStack Query) so loading/error/retry stay uniform. Map errors once (a single `parseApiError`) and surface the server `request_id` in error UI so user reports line up with server logs.

## Checklist (when enforcing)

- [ ] Naming matches project (camelCase/PascalCase/snake_case)
- [ ] No direct mutation of arguments or shared state
- [ ] Errors handled and propagated with context
- [ ] No unnecessary `any`; types explicit at boundaries
- [ ] Public APIs documented (JSDoc or project standard)
- [ ] Files and structure match existing layout
- [ ] No magic numbers; constants named
- [ ] Lint and format rules pass (if project has them)

## Anti-patterns

| Anti-pattern | Better approach |
|--------------|-----------------|
| "It's just a small script" | Apply same naming and structure; future readers will thank you |
| Commenting out code "for later" | Delete; use git history or a ticket |
| Fixing only the file in scope | If touching a pattern, suggest project-wide convention or follow-up |
| Adding style rules without tooling | Prefer ESLint/Prettier/editorconfig so format is automatic |

## Integration

- If the project has a style guide, CONTRIBUTING, or lint/format config, align with it first. Override only when the user explicitly asks.
- Suggest concrete edits (rename, extract function, add type) rather than only listing rules.
