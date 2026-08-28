# Commit splitting patterns

How large, long-lived projects decide where one commit ends and the next begins — and how to apply that to a tree that already exists. Read this before proposing a commit plan.

## Where these rules come from

Four sources agree almost word for word, which is why the rules below are treated as settled rather than as one project's taste:

- **git's own `SubmittingPatches`** — "Make separate commits for logically separate changes." "If your description starts to get too long, that's a sign that you probably need to split up your commit to finer grained pieces." Subject: ~50 characters, `area: lowercase summary`, no full stop, imperative mood. Body: what is wrong without the change, why this fix is better, what alternatives were discarded.
- **The Linux kernel's `submitting-patches`** — "Separate each logical change into a separate patch." A bug fix and a performance improvement in the same driver are two patches. The tree must build and run after *every* patch in the series, so `git bisect` never lands on a broken state. Series longer than ~15 patches get posted in batches.
- **OpenStack's `GitCommitMessages`** — the sharpest statement of the rule: "If a code change can be split into a sequence of patches/commits, then it should be split." Named anti-patterns: whitespace mixed with functional change, two unrelated features in one commit, a giant feature commit that should have been refactor → new API → use of the new API. Metadata trailers go last.
- **Angular / Conventional Commits** — `type(scope): summary`, types `feat, fix, docs, refactor, perf, test, build, ci, chore`, scope from a fixed vocabulary (the package or area a changelog reader would recognize), summary in present tense, not capitalized, no period. This is the format tooling reads: it decides the version bump and the changelog sections.

## The seven rules

1. **One logical change per commit.** The test is the message: if the subject needs an "and", or the body needs a list, it is two commits.
2. **Dependencies before consumers.** A module lands after everything it imports. This is what makes a log read as work rather than as a directory listing.
3. **Mechanical apart from behavioral.** A rename, a move, a format, an import reshuffle — never in the same commit as a change that alters behavior. Reviewers cannot see a bug inside 900 renamed lines.
4. **Generated and vendored files get their own commit.** Lockfiles, `go.sum`, generated clients, compiled protobufs, minified bundles, checked-in `dist/`. Mixing them into a feature commit buries the human-written diff.
5. **Formatting alone, and record it.** A repo-wide reformat is one commit, referenced afterwards in `.git-blame-ignore-revs` so `git blame` stays useful.
6. **Each commit is a state someone could ship** — the kernel's bisect rule. On a rebuild from a finished tree this is often unaffordable; that is exactly the difference between `--mode bisectable` and `--mode story`, and the mode belongs in the report rather than being quietly assumed.
7. **The message says why.** The diff already says what. A subject that restates the filenames is a wasted line.

## Default strategy: layered

The default plan orders commits by dependency depth, which for almost any codebase produces this shape:

| Layer | Typical content | Usual type |
| --- | --- | --- |
| 1. Scaffold | manifests, lockfile, formatter/linter config, entry point, `.gitignore`, icons | `chore` / `build` |
| 2. Foundations | types and models, storage, config loading, shared utilities | `feat` |
| 3. Domain modules | one commit per module, leaf-first | `feat(<module>)` |
| 4. Adapters | HTTP clients, platform integrations, auth, external protocols | `feat(<adapter>)` |
| 5. Wiring | the layer that exposes the domain: command registry, router, public API surface | `feat(api)` |
| 6. Interface | UI shell, then components, then i18n and assets | `feat(ui)`, `feat(i18n)` |
| 7. Hardening | the real seams — guards, workarounds, caches, indexes | `fix`, `perf`, `refactor` |
| 8. Tests | wherever the repo's convention puts them (see below) | `test` or folded in |
| 9. Automation | CI workflows, release scripts, hooks, dependabot | `ci`, `chore` |
| 10. Documentation | README, CONTRIBUTING, docs/, screenshots, community files | `docs` |

**Tests: with the feature or after it?** Follow the repo. Angular-style projects require the test in the same commit as the `feat`/`fix` and reject it separately; kernel-style projects and most Go repos do the same. A repo whose log shows standalone `test:` commits gets standalone test commits. Default when nothing indicates either way: fold the test into the commit that adds the code it covers, and use a separate `test:` commit only for test infrastructure (fixtures, harness, setup files).

## Granularity

| Tracked source files | Commits | Notes |
| --- | --- | --- |
| < 20 | 3–6 | anything finer is theatre |
| 20–80 | 8–15 | the common case |
| 80–250 | 15–30 | one commit per module becomes the natural unit |
| 250–800 | 25–40 | group by subsystem, not by file |
| > 800 | 30–45, directory-derived | say explicitly that grouping is by directory, not by import graph |

Two hard bounds regardless of size: no commit under ~10 lines unless it is genuinely a one-line concern (a badge, a config flag), and no commit over ~1500 lines of human-written code unless the file itself is that big and indivisible. Generated files are exempt from the upper bound — that is why they are their own commit.

## Which type a commit has actually earned

A rebuilt history is derived from a finished tree, so every commit type must be justified by something visible *in that tree*. This is the honesty rule from the skill body, made concrete:

| Type | Earned by | Never by |
| --- | --- | --- |
| `feat` | code that provides a capability the tree did not have without it | splitting one feature into three to pad the changelog |
| `fix` | a guard, a null check with a comment, a workaround naming a platform bug, a regression test | inventing a bug the tree never had, so the log looks iterative |
| `perf` | a cache, an index, a batched call, a memoization the code visibly contains | any commit whose diff is only "code was written" |
| `refactor` | a shared helper extracted from duplicated call sites, a module boundary the tree clearly has | renaming things during the rebuild to manufacture a refactor commit |
| `style` | files the formatter owns, split out because they are formatting only | ordinary code that happens to be formatted |
| `docs`, `test`, `ci`, `build`, `chore` | the files themselves | — |

If the split needs a commit type the tree cannot support, the split is wrong, not the tree.

## Human-iteration shapes

Real logs are not perfectly layered, and a rebuild that is *too* clean reads as generated. These shapes are legitimate because they follow the tree, not a script:

- **Scaffold, then the first vertical slice.** Real projects get one end-to-end path working before broadening. If the tree has an obvious first capability, it lands early and completely.
- **A module, then its follow-up.** When a module contains a clearly separable hardening artifact (the guard, the retry, the platform workaround), it is honest to land the module and then the artifact — that is how it was written.
- **Deps early, deps again later.** A lockfile bump that a later module obviously required belongs next to that module, not all at the front.
- **CI once there is something to build.** A workflow commit before the code it builds is an artifact of alphabetical thinking.
- **Docs after the thing they document**, and the README's screenshots after the UI exists.
- **The community and legal files** (`LICENSE`, issue templates, funding, security policy) land as one late housekeeping commit in most repos, not scattered.

What is **not** legitimate: a `fix:` commit that repairs code the same series just deliberately wrote wrong, a `revert:` of a commit that never existed, or padding the count with cosmetic splits. The changelog is read by users; fictional entries in it are a lie with a version number attached.

## The six re-split strategies

Offer these by name when the user rejects the proposed table.

- **A. Layered** (default) — the table above. Best for a first release and for a changelog that should read as a feature list.
- **B. Feature-vertical** — one commit per user-visible capability, each spanning backend, UI and tests. Best when the audience is users rather than reviewers, and when modules are thin.
- **C. Reconstructed** — rebuild the *actual* old history from `old-history.txt`: keep its real topics and order, condensing runs of `wip`/`fix typo`/`chore: sync` into the meaningful commit they belong to. The most honest shape available, and the right default when the old log has 30+ real commits with real subjects.
- **D. Coarse or fine** — the same strategy at a different granularity. Coarse (5–9) for a small library; fine (25–40) when the changelog is the deliverable.
- **E. Changelog-first** — group so the generated release notes read well: every user-visible capability its own `feat`, everything the tooling hides (`chore`, `ci`, `docs`, `style`) swept into as few commits as possible. Check the result with the repo's own changelog dry run before approval.
- **F. Manual** — the user dictates the grouping. This skill then only validates coverage (every path exactly once), message format against the repo's rules, and the tree diff.

Strategies can be mixed per layer — layered for infrastructure, feature-vertical above it, is a common and readable outcome.

## Anti-patterns

| Anti-pattern | Why it fails |
| --- | --- |
| One commit per directory | Directories are not logical changes; `src/` as one commit is the whole project |
| Alphabetical order | Puts consumers before their dependencies and reads as machine output |
| A "final touches" commit | Collects unrelated leftovers — the definition of the thing being avoided |
| Every file its own commit | Unreviewable, unbisectable, and obviously synthetic |
| Formatting mixed into features | The named anti-pattern in every source above |
| Lockfile inside a feature commit | Buries a 30-line diff under 4000 generated lines |
| Invented `fix` arcs | Fabricated changelog entries; see the honesty rule |
| Scopes invented on the spot | Fragments the changelog vocabulary the repo already has |

## Per-ecosystem file mapping

Which paths belong to which layer, for the ecosystems most likely to turn up. Use it to classify quickly; the import graph still decides the order within layers.

```text
Node / TypeScript   scaffold: package.json, lockfile, tsconfig*, vite/webpack/rollup config, eslint|biome, .npmrc
                    generated: dist/, build/, *.min.*, generated API clients, lockfile
                    code: src/** by module; UI in components/, pages/, app/; i18n in locales/, i18n/
                    tests: *.test.*, *.spec.*, __tests__/, e2e/, playwright/, cypress/
Rust                scaffold: Cargo.toml, Cargo.lock, rust-toolchain, build.rs, .cargo/
                    code: src/lib.rs + one commit per module file/folder; bins in src/bin/
                    tests: tests/ (integration), benches/; unit tests live inside the module file
Go                  scaffold: go.mod, go.sum, Makefile, tools.go
                    generated: *_gen.go, *.pb.go, mocks/  — always their own commit
                    code: cmd/ last (it wires everything), internal/ and pkg/ leaf-first
                    tests: *_test.go — same commit as the code, by near-universal Go convention
Python              scaffold: pyproject.toml, setup.cfg, requirements*.txt, poetry.lock, tox.ini
                    code: package dir, leaf modules before __init__ re-exports and CLI entry points
                    tests: tests/, conftest.py (conftest with the harness, not with a feature)
Java / Kotlin       scaffold: pom.xml or build.gradle(.kts), gradle wrapper, settings.gradle
                    code: src/main/** by package, leaf-first; resources with the code that reads them
                    tests: src/test/**
PHP / Ruby / .NET   scaffold: composer.json+lock, Gemfile+lock, *.csproj/sln, config/
                    code: app/ or lib/ or src/ by namespace; migrations are their own commit, in date order
Mobile              scaffold: Gradle/Xcode project files, Package.resolved, Podfile.lock, entitlements
                    assets: app icons, launch screens, adaptive icons — one commit, not scattered
Monorepo            scaffold once at the root (workspace config, turbo/nx config, shared tsconfig),
                    then per package leaf-first; scope every commit with the package name
Any                 CI: .github/workflows/**, .gitlab-ci.yml, Jenkinsfile, scripts/ci/
                    community: LICENSE, SECURITY, CODE_OF_CONDUCT, issue/PR templates, funding
                    infra: Dockerfile, compose files, terraform/, k8s/, helm/ — their own commit
```

**Other ecosystems:** classify by role, not by extension — every project has the same six roles (dependency manifest, build config, generated output, source modules, tests, automation and docs), and the layer order above applies unchanged once each path is assigned to one of them.

## Changelog weighting

If the repo generates release notes from commits, the split decides what users read. Check which types the tooling hides — `.versionrc*`, `release-please-config.json`, `.releaserc*`, `cliff.toml` — and place work accordingly:

- Types that reach the changelog (usually `feat`, `fix`, `perf`, sometimes `refactor` and `revert`) should each describe something a user would recognize. "add the settings page" beats "add SettingsPage.tsx".
- Types the tooling hides (`chore`, `ci`, `docs`, `style`, `test`, `build`) are the right home for scaffolding, tooling and housekeeping — this is why the scaffold commit is `chore` and not `feat`.
- A breaking change is marked the way the repo marks it (`!` after the type, or a `BREAKING CHANGE:` footer) and always carries a body. A rebuilt first release with no predecessor has nothing to break — do not manufacture one for emphasis.
- Run the tooling's dry run against the rebuilt history before the push. The generated notes are the deliverable; reading them is the only real check that the split works.
