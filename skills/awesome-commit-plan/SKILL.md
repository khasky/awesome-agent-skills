---
name: awesome-commit-plan
description: "Turns a codebase into a commit plan: a navigation map of its modules and their dependency direction, then a split where every commit builds and tests on its own, so the series is bisectable end to end. Each commit is verified by replaying the ladder in a scratch clone against the repository's own gates, never asserted. Messages follow a strict ruleset that keeps machine-written prose out of the log. The only output is a plan file numbered #1 to #N, no dates, no preamble. Use when asked to 'split this project into commits', 'plan the commit history for this repo', 'how should I break this into commits', 'prepare a bisectable commit series', or in Russian 'разбей проект на коммиты', 'составь план коммитов', 'как разбить это на коммиты'. Takes a repository URL or a local path: '/awesome-commit-plan <url-or-path>'. Do not use to execute the plan against git history — that is awesome-git-history-rebuild; not to squash an existing history — awesome-git-history-reset; not to review a diff — awesome-code-review."
license: MIT
metadata:
  author: Khasky
  tags: ["git", "commit-splitting", "bisect", "conventional-commits", "code-analysis", "planning"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-commit-plan"
---

# Commit Plan

Read a codebase, map how its parts depend on each other, and split it into a commit series where **every commit builds and its tests pass**. The output is one file: the commits, numbered `#1` to `#N`, each with its message and its exact file set. Nothing is committed, nothing is pushed, and the repository under analysis is never written to.

**Why the plan is a separate artifact:** a split is a claim about a codebase — that these files form a unit, that this module compiles without the one landing three commits later, that this test has a subject to test. Claims are cheap to write and expensive to discover wrong at commit 14 of 40. A plan file is reviewable before any of that, re-splittable on one word from the user, and executable later by hand or by `awesome-git-history-rebuild`.

## Core principle

**BISECTABLE IS A MEASURED PROPERTY, NOT A DESIGN GOAL.** A plan that says every commit builds has claimed something; a plan whose ladder was replayed in a scratch clone with the repository's own build and test commands run at every step has proven it. Phase 5 does the replay. A commit that fails its gate is regrouped and the ladder re-run — never shipped with a note that it "should" work.

Four invariants hold throughout:

- **Read-only against the user's code.** All work happens in a scratch clone or a temporary worktree. The user's checkout is never staged, committed, cleaned or checked out. If the run dies halfway, nothing of theirs moved.
- **Every tracked path lands in exactly one commit.** Coverage is proven by set arithmetic against `git ls-files`, not by inspection. An unassigned path is a stop.
- **Never invent work that did not happen.** Split along seams that exist in the final tree. A `fix:` commit is honest only when the tree carries the fix; a fabricated bug-and-repair arc is a lie that reaches the changelog.
- **The repository's own rules outrank this skill's defaults.** A commitlint config, a hook, `CONTRIBUTING.md` or the existing log decides the message format, always, including where this skill's default is nicer.

## Invocation

```
/awesome-commit-plan <repository-url-or-path> [--out <file>] [--commits N] [--granularity coarse|default|fine]
                     [--verify full|build|off] [--strategy layered|vertical|manual] [--slice on|off]
```

- `<repository-url-or-path>` — required. A remote URL (`https://…`, `git@…`), a local git repository, or a plain directory of source with no git at all. **If it is missing, ask for it before doing anything else** and do not guess from the working directory.
- `--out <file>` — plan file path. Default `<repo-name>-commits.txt` next to the repository.
- `--commits N` — target commit count. Otherwise proposed from repository size (Phase 4).
- `--granularity` — `coarse` (subsystem per commit), `default`, or `fine` (module per commit, sliced files).
- `--verify` — `full` (default: build and test at every commit), `build` (compile or typecheck only), `off` (no replay; the plan then says so in the report and the word *bisectable* is not used).
- `--strategy` — `layered` (default), `vertical` (one commit per user-visible capability), or `manual` (the user supplies the grouping; this skill validates coverage, order and messages only).
- `--slice on|off` — whether a single large file may be introduced across several commits as partial content. Default `on` for `fine`, `off` otherwise.

## Tooling check (run first)

- `git --version` — required.
- **The repository's own toolchain** — needed for `--verify full` and `build`. Detect it from the manifests; never assume it. Missing toolchain is not a silent downgrade: report it and ask whether to continue at `--verify off`.
- A host CLI (`gh`, `glab`) — not needed. This skill reads code, not a remote.

**Shell.** Detect the platform before running anything (`uname -s`, or `$IsWindows` in PowerShell) and pick the shell from that check rather than from habit. The `bash` blocks below are POSIX shell — they lean on `awk`, `sort`, `uniq`, `head`, and `2>/dev/null`, none of which PowerShell parses. On Windows run them in Git Bash, which ships with Git for Windows and carries all of them. The plain git commands run the same everywhere.

---

## Phase 0 — Target, scope and workspace

1. **Resolve the target.** A URL is cloned into scratch. A local path is *copied or cloned* into scratch — the user's directory is the source, never the workspace. A directory with no `.git` is initialized in scratch so path inventory and the verification ladder have something to run against.

2. **Establish the file universe.** What the plan may assign, and what it must not:
   ```bash
   git ls-files                                  # tracked: the authoritative list
   git status --porcelain                        # uncommitted work — ask before including
   git ls-files --others --exclude-standard      # untracked but not ignored
   git ls-files --others --ignored --exclude-standard | head   # ignored: never planned
   ```
   For a non-git directory, the universe is every file except what a present `.gitignore` excludes, and the run says so.

   **Uncommitted or untracked work is a question, not a default.** Including it changes what the plan covers; excluding it silently produces a plan that does not reproduce the tree the user is looking at. Ask, quote the count, and record the answer.

3. **Exclude what must not be planned as source:** generated output and build directories, vendored trees, lockfiles' own caches, binary artifacts that are not assets, anything matched by an existing `.gitignore`. Lockfiles themselves are **not** excluded — they are tracked and they land with their manifest (Phase 4).

4. **Detect the gates.** The commands the verification ladder will run, read from the repository rather than assumed:
   - build or compile: `package.json` scripts, `cargo build`, `go build ./...`, `tsc --noEmit`, `mvn -q compile`, `dotnet build`, a `Makefile` target
   - test: the runner the repository actually configures
   - lint and format: only when the repository enforces them in CI or a hook
   Record each gate's exact command and whether it is available on this machine. A gate that cannot run is **unavailable**, and unavailable is reported, never counted as passed.

5. **Size the work.** Tracked path count, total lines, largest files, language mix. Above ~1500 paths or ~200k lines, switch to directory-level analysis, say so explicitly, and default to `--granularity coarse`.

---

## Phase 1 — Load the rules into memory

Read both, in this order, before a single message is drafted:

1. **`references/commit-message-rules.md`** — the subject and body ruleset this skill writes to. It is not advisory: every message in the plan file is checked against its section 9 checklist in Phase 6.
2. **The repository's own rules**, which override it on any conflict:
   ```bash
   ls commitlint.config.* .commitlintrc* .husky/ .pre-commit-config.yaml lefthook.yml .gitmessage 2>/dev/null
   git config core.hooksPath
   git log --format='%s' -200 | sort | uniq -c | sort -rn      # what the repo actually does
   ```
   Extract: the convention (conventional, `[Area] …`, sentence case, ticket prefix), the **allowed type list**, the **scope vocabulary already in use**, subject length limits, whether bodies and trailers appear, and any server-side message pattern.

Present a one-screen rules card — convention, types, known scopes, hooks that will run, sign-off — and carry it into Phase 6. Reuse the existing scope vocabulary; never invent a parallel one (`auth`, not `authentication`).

---

## Phase 2 — Build the navigation map

This is the phase the split is derived from, and it is worth reading the code for. A map assembled from filenames alone produces an alphabetical dump wearing commit messages.

1. **Inventory by area:**
   ```bash
   git ls-files | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn
   ```

2. **Classify every path** into: entry and bootstrap · dependency manifests and lockfiles · build and tooling config · core domain modules · adapters and integrations · UI · assets, i18n and media · tests · CI/CD · docs · legal and community files · generated or vendored.

3. **Read the dependency direction.** For every source file, extract what it imports from inside the repository, and build the edge list. This is the map's spine:
   ```bash
   # JS/TS
   git grep -nE "^\s*(import|export) .*from '\.|require\('\." -- '*.ts' '*.tsx' '*.js'
   # Rust
   git grep -nE '^\s*(use crate::|mod )' -- '*.rs'
   # Go
   git grep -nE '^\s*"<module-path>/' -- '*.go'
   # Python
   git grep -nE '^\s*(from|import) (\.|<package>)' -- '*.py'
   ```
   Then derive, and report:
   - **leaves** — files that import nothing internal. These can land first.
   - **depth** — longest path from a leaf to each file. Depth is the commit order.
   - **cycles** — mutually importing files. A cycle cannot be split; its members land in one commit, and the map names them so the split does not try.
   - **fan-in hotspots** — a file many others import. It lands early, and it defines a commit boundary.

4. **Find the entry points and the wiring.** The main, the app bootstrap, the plugin registration, the route table, the command registry. These are usually the *last* code commit, because they reference everything.

5. **Find the honest seams** for anything that is not a plain `feat`: a guard clause with its own test, a workaround with a comment naming a platform bug, an index or cache over an existing path, a formatting-only file. Those are honest `fix`, `perf`, `refactor` and `style` commits **because the artifact is in the tree**. Nothing else earns those types.

6. **Map the test files to their subjects.** A test that lands before the module it imports fails the suite at that commit and breaks the ladder. Every test path is bound to the path set it covers.

Report the map in one screen: layers, module count, leaves, max depth, cycles, hotspots, generated paths excluded, gates detected. This map is what the user reviews before the split, and it is what makes the split arguable rather than arbitrary.

---

## Phase 3 — The bisectability rules

A commit is **bisectable-safe** when the cumulative tree at that commit satisfies all of these. They are listed with the failure each one prevents, because each was learned by a ladder breaking at exactly that point.

| Rule | Failure it prevents |
| --- | --- |
| A file lands **after** every internal file it imports | the compile fails on an unresolved import |
| A test lands **with or after** its subject | the suite fails, or worse, silently collects zero tests and exits non-zero |
| A manifest and its lockfile land **together** | a hand-split lockfile no longer resolves, and proves nothing |
| A config file lands **with or before** the first file it governs | a formatter or type-checker runs with different rules than the plan assumed |
| Members of an import cycle land **together** | neither half compiles alone |
| A generated artifact lands **with its generator** | the build regenerates it and the tree diverges |
| A registration lands **with or after** the thing registered | a handler table references a symbol that does not exist |
| An asset referenced at build time lands **with or before** its reference | the bundler fails on a missing file, which no type-checker catches |
| A file that only *runs* under a platform guard may land any time | a `cfg`-gated module is dead code, not a broken build — but a linter with warnings-as-errors may disagree, so check the gate, not the intuition |

**The gate ladder is stated, not pretended.** Not every gate is green from commit #1: a test runner exits non-zero with no test files, a linter flags an unused module, a web build needs an entry point. So each gate has a **first commit from which it passes**, that number is measured in Phase 5, and a commit is required to pass only the gates that are applicable and available at its point in the ladder. A plan that claims "green from #1" for a gate that cannot be is not bisectable, it is unverified.

---

## Phase 4 — Split

Build the plan from the map. Defaults, in order of preference:

**Layered (default):** manifests and workspace config → build and lint tooling → data model and types → leaf modules by ascending depth → adapters and integrations → UI primitives → screens → wiring and entry points → tests that were not bound to earlier commits → CI → docs → community files.

**Vertical (`--strategy vertical`):** one commit per user-visible capability, full stack each. Honest only when the modules genuinely partition that way; a shared core forces a first commit that is a layer anyway.

Granularity, proposed from size and overridable:

| Tracked paths | Coarse | Default | Fine |
| --- | --- | --- | --- |
| under 50 | 5-8 | 8-15 | 15-25 |
| 50-150 | 8-12 | 15-30 | 30-60 |
| 150-500 | 12-20 | 25-45 | 45-90 |
| over 500 | 15-25 | 30-60 | directory-level only |

Two shaping rules:

- **No commit is a wall and none is an orphan.** A 4000-line commit hides its own review; a one-line commit that could have joined its neighbour is noise. Report lines per commit and flag both tails.
- **Slicing a file is allowed but never free.** In `--slice on`, a large file may be introduced across several commits (a crate root that grows a module line per commit, a command surface that grows an entry per command). Each slice must still satisfy Phase 3. Record the slice note in the plan file; the executor has to cut it by hand.

**Coverage proof, before anything else is shown:**

```text
tracked paths <T> · assigned <T> · unassigned 0 · assigned twice 0
```

Unassigned is a stop. Assigned twice is a stop. Neither is a rounding error.

Then present the table and let the user approve, adjust, or re-split at a different granularity or strategy. Never proceed on silence or "looks fine" — the approval names the table.

---

## Phase 5 — Verify the ladder

This is what separates a plan from a guess. Skipped only at `--verify off`, and then the report says the plan is **unverified** and drops the word bisectable.

In the scratch clone, on an orphan branch, replay the approved plan and run the gates:

```bash
git checkout --orphan plan-verify
git rm -r --cached . -q                 # index emptied, working tree untouched

# per commit N of the plan
git add -- <paths of commit N>
git diff --cached --name-only           # must equal the planned path set exactly
git commit -q -m "#N"                   # placeholder message; real messages come in Phase 6
<build gate>                            # e.g. pnpm exec tsc --noEmit
<test gate>                             # e.g. cargo test
```

Record per commit: which gates ran, which passed, which were **not applicable yet**. Then:

- **A gate that fails at commit N is a split defect, not a gate defect.** Regroup — usually by moving one file earlier or merging two commits — and re-run from N. Never reorder blindly; go back to the map and find the edge that was missed.
- **A gate that fails at every commit including the last** is a pre-existing failure in the source, not something the split caused. Report it as such and continue; the plan cannot fix a broken build.
- **Slow gates:** for a full test suite over many commits, offer `--verify build` for the whole ladder plus the full suite at the last commit, and state exactly that in the report.

Then delete the scratch branch. The verification produced knowledge, not artifacts.

Output of this phase is the gate ladder:

```text
gate                     first green   verified at commits
typecheck                #1            1-24 pass
cargo test               #4            4-24 pass
lint (warnings as errors) #12          12-24 pass
web build                #21           21-24 pass
full test suite          #24           24 pass
```

---

## Phase 6 — Write the messages

Draft every subject and body against `references/commit-message-rules.md`, with the repository's own convention overriding it on conflict. The rules in one line each:

- subject `type(scope): imperative lowercase`, 70 characters or fewer, no trailing period, scope from the repository's own vocabulary
- **no body by default** — write one only where the reasoning is not visible in the diff. Expect a body on well under half the commits
- at most four paragraphs, wrapped under 80, ordered problem, mechanism, decision
- plain ASCII, no backticks; identifiers bare
- no enumerations, no explanatory colon, no contrast frame, no invented past, no consequence half, no count that can be recounted, no reference to another commit in the plan, no flourish
- what must survive the cut: incident provenance, hard-won behaviour of a third party, a deliberate refusal, a constant with its reason, a wire-format note, a security boundary

Then run the section 9 checklist over every drafted message, and validate against the repository's own linter where one exists:

```bash
echo "<subject>" | npx --no-install commitlint       # or the repo's validator
```

A message that fails the repository's hook is a defect found now, in a text file, instead of at commit 14 of the execution.

---

## Phase 7 — Write the plan file

Exact format, the template and a worked example: `references/plan-file-format.md`. In short:

- The file **starts with commit `#1`**. No title, no summary, no how-to-execute section, no legend.
- Commits are numbered `#1` to `#N`, plain, no prefix letter.
- **No dates and no timestamps anywhere.** Pacing belongs to whatever executes the plan.
- Each commit carries its subject, its optional body, and its file list with a count.
- A sliced file carries its slice note on the same line.
- Nothing else. No gate columns, no rationale for the split, no alternatives section, no closing notes.

Everything the file does not carry — the map, the coverage proof, the gate ladder, the granularity choice, what could not be verified — goes in the chat report, which is where a reviewer reads it once and a file does not have to carry it forever.

---

## Phase 8 — Report

Lead with the verdict, then the evidence:

```text
plan: <N> commits over <T> tracked paths, written to <path>
coverage: <T> assigned, 0 unassigned, 0 duplicated
verification: <full|build|off> — <N>/<N> commits pass every applicable gate
gate ladder: <the table from Phase 5>
messages: <N> validated against <commitlint|the repo's log convention>, <N> carry a body
map: <L> layers, <M> modules, <C> import cycles collapsed into one commit each
not verified: <gates unavailable on this machine, and why>
```

Then state plainly, without being asked:

- every gate that could **not** run, and what that leaves unproven
- any pre-existing failure the ladder inherited from the source
- any file whose placement was a judgement call rather than a dependency fact
- what executing the plan still requires — this skill produced a document, and nothing in git has changed

**Do not offer to execute the plan.** Rewriting history is `awesome-git-history-rebuild`, which has the backup, the permission preflight and the confirmation gates that this skill deliberately does not carry.

---

## What this skill does not do

| Not this | Use instead |
| --- | --- |
| Rewrite history, commit, or push | awesome-git-history-rebuild |
| Squash an existing history into one commit | awesome-git-history-reset |
| Fix the author identity on commits | awesome-git-author-rewrite |
| Recover commits from an erased history | awesome-git-history-salvage |
| Judge whether the code is any good | awesome-code-review, awesome-architecture-audit |
| Write the tests the ladder runs | awesome-test-writing |
