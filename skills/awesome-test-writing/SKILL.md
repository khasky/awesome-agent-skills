---
name: awesome-test-writing
description: "Designs and writes tests that catch real regressions — placement (unit/integration/E2E), factories and fixtures, behavior-first assertions, characterization tests for legacy code, property/fuzz tests for parsers. Use when asked to 'write tests', 'add test coverage', 'test this module', 'напиши тесты', when a bug fix needs its regression test, or when awesome-bug-fix, awesome-code-review, or awesome-security-audit calls for a failing or regression test. Do not use for judging existing tests in a review — use awesome-code-review; not for diagnosing the bug itself — use awesome-bug-fix."
license: MIT
metadata:
  author: Khasky
  tags: ["testing", "quality", "regression", "fixtures"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-test-writing"
---

# Test Writing

Write tests that fail when the behavior breaks and stay green through refactors. The deliverable is not coverage — it is a tripwire: for every realistic way the code under test could regress, at least one test goes red. A test that cannot fail against broken code is documentation wearing a test's costume.

## When to Activate

- "Write tests for X", "add coverage", "this module has no tests".
- A bug fix needs its regression test (awesome-bug-fix hands off here).
- A review or audit finding says "needs a test" (awesome-code-review, awesome-security-audit, awesome-dependency-audit).
- Legacy code needs a safety net before a refactor (characterization tests).

Do **not** activate to review test quality in a diff (awesome-code-review Phase 4 owns that) or to find the root cause of a failure (awesome-bug-fix).

## Work Process

1. **Discover the incumbent setup first** — runner, assertion style, fixture/factory conventions, file placement, naming pattern. New tests match the repo's existing shape; never introduce a second test framework or a parallel convention. No runner at all → propose the ecosystem default and wait for approval (it is a new dependency).
2. **Read the code under test end to end** — public seams, inputs, outputs, side effects, error paths. The seam you test through must be one a caller actually uses; needing to export a private function to test it is a design signal to report, not to work around.
3. **Choose placement by the lowest level that can catch the defect** — pure logic gets unit tests; wiring, queries, and contracts get integration tests; only critical user flows get E2E. A bug that a unit test can catch, caught only by an E2E suite, costs 100× per run forever.
4. **Design the case list before writing code** — happy path, boundaries (empty, one, many, max), error paths (invalid input, dependency failure, timeout), and the bug class this code invites (off-by-one in pagination, timezone in date math, race in check-then-act). Write the list down; each case becomes one test with one behavioral focus.
5. **Write behavior-first** — assert observable outcomes through the public seam (return value, state change, emitted event, recorded call), never internals (private fields, call order of helpers). Test name states scenario and expectation ("rejects expired token with 401", not "test token 2").
6. **Prove every test can fail** — run the new test against intentionally broken code (revert the fix, flip the branch, break the constant) and watch it go red, then restore and watch it go green. A regression test is proven both ways: fails without the fix, passes with it. A test that has never failed has proven nothing.
7. **Run the suite and report** — full relevant scope, exit code read, flaky behavior reported (a test passing only on re-run is a defect, not a pass — quarantine and report, never silently retry to green).

## Rules by area

- **Fixtures and factories** — each test owns its data: factories with per-test overrides, no shared mutable seed corpus, no test depending on another test's leftovers. Integration tests get per-test isolation (transaction rollback, per-test schema, or unique keys).
- **Determinism** — freeze time and run under `TZ=UTC`; seed or inject randomness; never `sleep` — wait on a condition with a deadline. A test that depends on wall clock, network weather, or execution order is flaky by construction.
- **Mocking** — mock only what the process doesn't own (external HTTP, third-party SDKs, payment providers); real code for everything inside the boundary. When mocking, assert the request made to the mock (payload, headers, idempotency key), not only the canned response's effect.
- **Characterization tests (legacy)** — before refactoring untested code, pin its current observable behavior with tests that assert what it *does* (including the weird parts), not what it should do; they are the safety net that makes the refactor verifiable, and they get revisited once behavior is intentionally changed.
- **Property and fuzz tests** — anything parsing untrusted bytes (file formats, protocol frames, user markup) gets property-based or fuzz coverage with the failing corpus committed as regression seeds; example-based tests alone systematically miss the inputs attackers try. A standing hostile-input fixture set (`../../etc/passwd`, `' OR 1=1--`, `<img onerror=…>`, 10MB strings, RTL/zero-width Unicode) runs against every input-handling seam. Harness rules (determinism, size validation, resetting global state), per-ecosystem fuzzers (libFuzzer/AFL++/cargo-fuzz/Atheris/Go), sanitizer builds (ASan/UBSan), coverage-as-signal, and `wycheproof` crypto vectors are in [references/fuzzing.md](references/fuzzing.md).
- **Coverage** — a weak signal, never the goal: use it to find untested *branches* you meant to test, not to chase a number. 100% coverage with mirror assertions is 0% protection.
- **Mutation testing — the suite-level version of step 6** — step 6 proves one test can fail; mutation testing asks whether the *suite* notices when the code changes. A tool rewrites the production code (flip a comparison, swap a boundary, drop a statement, return a constant) and reports which mutants no survivors killed. A surviving mutant is a hole with a name: a line the suite executes but does not check. Run it scoped — one module, the one carrying money, auth, or a parser — never the whole repo on a first pass; a full-repo mutation run is minutes-to-hours of CPU for a report nobody reads. Tools per ecosystem: Stryker (JS/TS, .NET, Scala), `mutmut`/`cosmic-ray` (Python), PIT (JVM), `cargo-mutants` (Rust), `go-mutesting` (Go). Act on survivors, not on the score — a mutation percentage chased for its own sake buys the same padding as a coverage number. Equivalent mutants (a change that cannot alter observable behavior) are noise: mark them and move on.
- **Other languages** — everything above is runner-independent; only the mechanism names change (fake timers vs `freezegun` vs injected clocks; `t.Parallel()` isolation vs transaction rollback). Discover the idiom from the repo's existing tests, not from another ecosystem's habits.

## Output Format

```text
Tests written — <module / behavior> — <N> tests

Cases covered:
- <scenario> → <expectation>   [unit|integration|e2e]
...

Proven to fail: <which mutation/revert made each go red>
Run: <command> → <N passed, 0 failed, exit 0>
Not covered (and why): <cases deferred, with reason — not silence>
```

## Anti-patterns

| Anti-pattern | Instead |
|---|---|
| Mirror assertion — expected value computed the same way as the code | Hardcode the known-correct value from the spec or a hand calculation |
| Change-detector test — snapshot of internals that fires on any redesign | Assert the observable contract; snapshot only true output surfaces |
| Assertion roulette — many bare asserts, unclear which failed | One behavioral focus per test; messages on non-obvious asserts |
| Testing the mock — asserting the stub returned what it was told to | Assert the system's behavior around the mock, and the request into it |
| New framework beside the incumbent runner | The repo's runner, even if another is nicer |
| Coverage-driven padding — trivial getters tested, error paths bare | Case list from behavior and risk, boundaries and failures first |
| A test written after the fix and never seen red | Revert the fix, watch red, restore, watch green — both ways, every time |
