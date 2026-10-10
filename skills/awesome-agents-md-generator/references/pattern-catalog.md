# Pattern catalog

The dimensions Phase 3 mines. Each lists where the evidence lives, what makes an observation a rule, and the kind of line it usually produces. A dimension that turns up nothing project-specific is recorded as such in the working notes and gets no section in the file — an empty "Error handling" heading teaches an agent nothing.

Stack-agnostic by design: the evidence sources are named by role (the lockfile, the task runner, the test config), and the agent maps them to whatever the project uses.

## Contents

- Stack and toolchain
- Layout and ownership
- Module boundaries and dependency direction
- Naming
- File shape
- Types, schemas and validation
- Error handling
- Logging and observability
- Configuration, environment and secrets
- Data access and migrations
- Entry points: routes, handlers, commands, jobs
- UI and state (where a frontend exists)
- Concurrency and async
- Wiring, registries and extension points
- Testing
- Generated, vendored and protected files
- Dependencies
- Git, commits and pull requests
- Documentation and i18n
- Recipes from co-change history
- Pitfalls

## Stack and toolchain

- Evidence: manifests, lockfiles, toolchain pin files, container base images, CI setup steps.
- A rule when: a version is pinned somewhere a tool reads, or CI installs exactly one version. Write the pin file's path beside the version so the next reader updates one place.
- Typical line: which package manager (from the lockfile present), which runtime version (from the pin), which workspace tool drives the monorepo.
- Watch for: two lockfiles for two package managers — a Split to report, not a rule to pick.
- Runtime version drift: collect every pin (version file, manifest engines field, container base image, CI setup step). When the version that builds differs from the version that runs, or two pins disagree, it is a Split, not a rule — the report names both pins with their paths; the file stays silent on which to use.

## Layout and ownership

- Evidence: the top two levels of the tree, workspace config, CODEOWNERS, per-directory READMEs.
- A rule when: a directory has one clear job the code confirms (everything under it is one kind of thing).
- Typical line: a short map — one line per top-level directory that an agent would otherwise open to find out. Directories whose name already says it all are left out.

## Module boundaries and dependency direction

- Evidence: import statements, grouped by source directory and target directory; path aliases; lint rules that restrict imports; architecture tests.
- Method: for each pair of layers, count imports in each direction. A direction with zero edges one way and many the other is a rule; a handful of back-edges against hundreds is a rule with named exceptions.
- Typical line: "code in `<lower>/` never imports from `<upper>/`; shared types live in `<shared>/`". If a lint rule enforces it, point to the lint command instead.

## Naming

- Evidence: file names per directory, exported symbol names, test file names, database table and column names, route paths, environment variable prefixes, branch names in the log.
- Method: bucket names by case style and suffix per directory; a directory where 80% share a form has a rule. Suffix conventions (`<name>.service`, `use<Name>`, `<Name>Error`) are the most valuable finds — they are what a new file must copy to be discovered by globs, loaders and reviewers.
- Enforced when: a linter rule or a loader glob requires it. The glob is the better citation: breaking it is not a style issue, it is a file that never loads.

## File shape

- Evidence: exemplary files of each kind — one handler, one component, one model, one test.
- A rule when: the same skeleton repeats (default vs named exports, one class per file, an index/barrel re-exporting a directory, a header comment).
- Typical line: "new `<kind>` files follow `<path/to/exemplar>`" — one pointer beats a pasted template, which goes stale the day the exemplar changes.

## Types, schemas and validation

- Evidence: type-check config strictness, schema libraries in the manifest, where validation calls sit relative to entry points, casts and escape hatches counted per directory.
- A rule when: boundary input is validated in one consistent place, or escape hatches are near zero outside one known directory.
- Typical line: where schemas live, where input must be validated, which escape hatch is banned and which directory is the exception.

## Error handling

- Evidence: error class hierarchy, throw sites vs return-value errors, catch blocks, the error envelope HTTP handlers emit, the central error handler.
- A rule when: one mechanism dominates — a base error type, a result type, a single handler that maps errors to responses.
- Typical line: "throw subclasses of `<BaseError>` from `<path>`; never catch-and-ignore; the handler in `<path>` maps them to responses". Counter-instances go to the report, not into the file as exceptions an agent might imitate.

## Logging and observability

- Evidence: the logger import, call sites of raw print or console output, structured fields repeated across calls, redaction helpers, tracing setup.
- A rule when: one logger is used nearly everywhere, or raw output is banned by a lint rule.
- Typical line: which logger to import, which fields every line carries, what must never be logged.

## Configuration, environment and secrets

- Evidence: the environment template file, the config loader, references to environment variables in code, secret-manager clients, `.gitignore` entries.
- A rule when: configuration is read through one module rather than scattered environment reads.
- Typical line: "read config through `<module>`, never directly from the environment; new variables go into `<template file>` and `<loader>`". Variable names only; values never, even from a template.

## Data access and migrations

- Evidence: ORM or query-builder usage, raw query sites, repository/data-access directories, migration folder, migration tool config, seed scripts.
- A rule when: data access goes through one layer, and migrations follow one tool's workflow.
- Typical line: how to create a migration (the command, not a hand-written file, if the tool generates one), that applied migrations are immutable, where queries are allowed to live.

## Entry points: routes, handlers, commands, jobs

- Evidence: router registration, handler directories, CLI command registration, job and queue definitions, cron config.
- A rule when: entry points follow one registration path. This dimension usually feeds a recipe rather than a rule.

## UI and state (where a frontend exists)

- Evidence: component directories, styling approach (one of CSS modules, utility classes, CSS-in-JS, plain stylesheets — count them), state management library, data-fetching layer, design-system package, accessibility lint rules.
- A rule when: one styling approach and one data-fetching path dominate. Two styling systems side by side is usually a Migration — check which one new files use.

## Concurrency and async

- Evidence: async style (promises vs callbacks, async runtime choice), locks, worker pools, transaction helpers, cancellation and timeout helpers.
- A rule when: a helper wraps the risky primitive and raw use of the primitive is rare — then the rule is "use the helper".

## Wiring, registries and extension points

- Evidence: dependency-injection containers, plugin registries, index files that list every implementation, tests that iterate over a registry, feature-flag definitions.
- Why it matters most: this is where an agent's new code compiles, passes its own test, and still does nothing, because the registration step was skipped. Every registry found here becomes a line in the matching recipe.

## Testing

- Evidence: test runner config, test file locations and names, fixture and factory directories, mocking library and how often it is used against what, snapshot files, test tags or markers for slow and integration suites, coverage thresholds, services CI starts for tests.
- Rules to settle: where a test for a given source file goes; the name pattern the runner globs; how to run one; what is mocked and what is real (count mocks of the database or network versus test containers or fakes); how integration tests are separated and what they need running; whether snapshots are updated by a command and reviewed.
- Typical line: "unit tests beside the source as `<pattern>`; integration tests under `<dir>`, need `<service>` (started by `<command>`)".

## Generated, vendored and protected files

- Evidence: "generated" or "do not edit" headers, generator configs and their output paths, vendored directories, lockfiles, applied migrations, CODEOWNERS entries for narrow teams, files CI checks for drift.
- Every item here becomes a Never line with its regeneration command: "never edit `<path>` by hand; run `<command>`".

## Dependencies

- Evidence: the manifest, lockfile, update-bot config, internal packages, any allow or deny list.
- A rule when: the project restricts how dependencies are added (a workspace protocol for internal packages, a pinned-exact policy, an approval step). Adding a dependency is an Ask first line in almost every project; state it only when the evidence shows a policy, otherwise it is generic.

## Git, commits and pull requests

- Evidence: the last few hundred commit subjects, branch names, PR and issue templates, commit-lint config, changelog tooling, release config, version files that must be bumped together.
- Method: classify commit subjects — conventional prefixes, ticket references, imperative mood, length. A form in 80% of recent commits is a rule; commit-lint config makes it Enforced.
- Typical line: the subject format, what a PR must contain (from the template), files that move together on a release.

## Documentation and i18n

- Evidence: docs directory, docstring coverage per public surface, generated API docs, translation files and the extraction command, hard-coded user-facing strings counted outside translation calls.
- A rule when: user-facing strings go through a translation layer with near-zero exceptions, or public APIs carry docstrings a doc generator consumes.

## Recipes from co-change history

A recipe is an ordered list of the files a recurring change touches. It is derived, not imagined:

1. Pick a change kind the map suggests (a new endpoint, entity, page, migration, plugin, CLI command, locale).
2. Find three or more commits that introduced one: search subjects and added-file names, not only messages.
3. List the files each touched. Files present in most of them form the recipe; files present in one are incidental.
4. Order the steps by dependency — schema before handler, registry entry after the implementation, generated client after the schema — and attach each step's command where one exists.
5. Cross-check against the current tree: a step pointing at a file that no longer exists means the recipe changed; take the newest commits as authoritative.

With fewer than three examples, a recipe may still be written from the registry and wiring evidence alone, marked in the report as derived from structure rather than history.

## Pitfalls

Pitfalls are rules the code learned the hard way, and they rarely show as a majority pattern — one guard, one comment, one revert. They are admitted on a different test: a written reason in the code or the history, not a count.

- Evidence: comments with warning markers, reverted commits and the fix that followed, tests named after issues, retry or ordering code with an explanatory comment, "must" and "never" in comments and docs.
- Typical line: a Never or Ask first line with its reason in one clause, and the path where the guard lives.
