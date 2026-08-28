# Repository convention discovery

A rebuilt history that ignores the repo's own commit rules is worse than the history it replaced: it fails the hooks, breaks the release tooling, and reads as foreign to everyone who works there. Run this discovery before building the commit plan, and treat what it finds as binding.

## Discovery matrix

| Where to look | What it settles |
| --- | --- |
| `CONTRIBUTING.md`, `.github/CONTRIBUTING.md`, `docs/CONTRIBUTING*` | The stated format, allowed types and scopes, sign-off, PR expectations |
| `README.md` contribution section | Same, for repos too small for a CONTRIBUTING |
| `docs/**` — development, releasing, maintainers runbooks | How releases are cut and what the commits feed |
| `commitlint.config.*`, `.commitlintrc*`, `package.json#commitlint` | The **enforced** format: types, scopes, subject case, max lengths |
| `.husky/commit-msg`, `.husky/pre-commit` | Which hooks fire on every commit, and with what |
| `core.hooksPath` (`git config core.hooksPath`), `.githooks/` | Hooks outside `.git/hooks` — easy to miss, still enforced |
| `.pre-commit-config.yaml`, `lefthook.yml`, `.lefthook/` | Non-Node hook frameworks; may reformat files mid-commit |
| `.gitmessage` + `commit.template` | A message template the project wants used |
| `.gitlint`, `gitlint` in CI | Enforced subject/body rules outside the Node world |
| `.github/workflows/**` | PR-title lint, commitlint action, DCO check, changelog generation |
| `.versionrc*`, `release-please-config.json`, `.releaserc*`, `.changeset/`, `cliff.toml` | Which commit types reach the changelog and how versions bump |
| `.git-blame-ignore-revs` | The repo separates formatting commits and records them |
| `CODEOWNERS`, `.mailmap` | Multiple contributors — relevant to the multi-author gate |
| **The existing log** | What the repo actually did, which outranks what a doc claims |

## Precedence

1. **An enforced rule** (a hook or a CI check that fails the build) — non-negotiable; a plan that violates it cannot be executed.
2. **A stated rule** (CONTRIBUTING, README, docs) — followed unless it contradicts an enforced rule, in which case surface the contradiction to the user rather than picking silently.
3. **The existing log's observed style** — fills every gap the first two leave: scope vocabulary, subject length, whether bodies are used, capitalization.
4. **This skill's defaults** — only where all three above are silent.

## Reading the style out of the old log

The backup holds the evidence. Run these against it, not against the rebuilt branch:

```bash
git -C <backup> log --format='%s' -200                      # the raw subjects
git -C <backup> log --format='%s' -200 | grep -cE '^[a-z]+(\([a-z0-9./-]+\))?!?: '   # conventional?
git -C <backup> log --format='%s' -200 | sed -nE 's/^[a-z]+\(([^)]+)\).*/\1/p' | sort | uniq -c | sort -rn
git -C <backup> log --format='%s' -200 | awk '{print length}' | sort -n | uniq -c    # subject length
git -C <backup> log --format='%b' -50 | grep -cE '^(Signed-off-by|Co-authored-by|Closes|Fixes|Refs)'
```

Decide from the counts, not from one sample:

| Signal | Convention |
| --- | --- |
| Most subjects match `type(scope): summary` | Conventional Commits — reuse the scope list the second command prints |
| `subsystem: lowercase summary`, no type vocabulary | git/kernel style |
| `[Area] Capitalized summary` | React-style bracket prefix |
| `ABC-123: summary` or `[ABC-123]` | Ticket-prefixed — ask the user for the ticket IDs, or omit the prefix and say so |
| Capitalized imperative sentences, no prefix | Plain style (this repo's own logs, many small projects) |

Whatever the family, copy its **case, punctuation and length** too. A conventional repo whose subjects are all lowercase and under 60 characters does not want a 90-character capitalized one.

## Message templates

```text
Conventional      type(scope): summary in imperative, lowercase, no period
                  <blank>
                  Body: what was wrong / why this way. Wrap at 72.
                  <blank>
                  BREAKING CHANGE: ...        Closes #12

git / kernel      area: summary in imperative, lowercase, no period
                  <blank>
                  Problem, then why this change is the right fix.
                  <blank>
                  Signed-off-by: Name <email>

Bracketed         [Area] Summary in imperative
Ticket-prefixed   ABC-123: summary in imperative
Plain             Summary in imperative, capitalized, no period
```

Rules that hold across all of them: imperative mood ("add", not "added"/"adds"), no "This commit…", no "I"/"we", no "now"/"currently", no patch-set chatter ("rebased", "fixed review comments"), and machine-readable trailers last.

## Scopes

- Take the vocabulary from the old log first, then from the directory names of the modules being committed.
- Never rename an established scope (`auth`, not `authentication`), never invent a synonym for one that exists, and never scope a commit that spans the whole repo.
- A commitlint config with `scope-enum` is a closed list — a scope outside it fails the hook. Read it before writing the plan.

## Trailers, sign-off and signing

- **DCO** — a `dco.yml` workflow, a "Signed-off-by" requirement in CONTRIBUTING, or a `Signed-off-by` line on most old commits means every rebuilt commit needs `git commit -s`. The name and email in the trailer must match the committer.
- **Co-authored-by** — the honest way to keep another contributor's attribution when their code survives into the rebuilt tree. One trailer per co-author, last lines of the body, exactly `Co-authored-by: Name <email>`; hosts parse it and credit the person on the commit.
- **Issue references** — `Closes #N` / `Fixes #N` only for issues that genuinely exist and that the code in that commit resolves. A rebuilt history referencing issues at random creates false cross-links in the tracker.
- **Signing** — `git config commit.gpgsign` true, or `Verified` badges on the old commits, means the rebuild signs too (`-S`, or the configured `gpg.format=ssh` key). The old signatures cannot survive a rewrite; every rebuilt commit is signed by whoever runs the rebuild, which is worth stating in the report.

## Hooks during the replay

Hooks fire on every rebuilt commit. Know which, and what each does, before commit #1.

- **`commit-msg`** (commitlint, gitlint) — validates the subject. **Pre-validate every planned message** before starting the replay, so a rejection surfaces at planning time:
  ```bash
  echo "feat(storage): persist profiles in a lock-guarded store" | npx --no-install commitlint
  ```
  A Node hook needs the dependencies installed — run the repo's install command first, or the hook fails for a reason that has nothing to do with the message.
- **`pre-commit`** (lint-staged, formatters, type-checkers) — two failure modes. It may **reject** an intermediate commit because a partial tree does not type-check, and it may **rewrite** staged files, which changes the tree the rebuild is supposed to preserve. If either happens, stop and hand the user the choice: coarsen the split so each commit is self-consistent, or accept `--no-verify` for intermediate commits and disclose it in the report. Never bypass a hook silently.
- **`pre-push`** — runs once at the force-push; make sure its command can actually pass on the rebuilt branch.
- **`prepare-commit-msg`** — may inject a template or a ticket ID. Let it; then re-read the resulting subjects during Phase 7 validation, because what it injects is what the log will show.

## Release tooling

Whatever reads commits also constrains them. Identify it and match its expectations:

| Tooling | Reads | Notes for the plan |
| --- | --- | --- |
| `commit-and-tag-version` / `standard-version` | Conventional Commits since the last tag | `.versionrc*` lists which types are hidden; it writes the changelog, the bump and the tag |
| `semantic-release` | Conventional Commits on the release branch | Version is derived, never chosen by hand; a rebuilt history changes what it computes |
| `release-please` | Conventional Commits | Opens a release PR; `release-please-config.json` holds the type/section map |
| Changesets | `.changeset/*.md` files, not commits | Commit messages do not drive the version — say so, and keep the changeset files in the commit that adds the feature |
| `git-cliff` | Conventional Commits, `cliff.toml` groups | Grouping is fully configurable; read the config before assuming sections |
| `cargo release`, `poetry version`, `bumpversion` | The version file, not the log | The log still matters for humans; the bump does not depend on it |
| Nothing detected | — | Follow the log's own style; propose no changelog claims the repo cannot generate |

Run the tooling's dry run against the rebuilt branch before pushing, and show the user the notes it produces.
