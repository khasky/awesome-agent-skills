---
name: awesome-git-history-rebuild
description: "Erases a repository's git history and rebuilds it as a curated commit series over the same tree — source analysis, a split plan the user approves or re-splits another way, the repo's own commit rules obeyed (commitlint, hooks, CONTRIBUTING, the existing log), paced timestamps, and safety throughout: permission and ruleset preflight, a verified mirror backup, a confirmation gate before every irreversible step, and a fresh-clone tree-hash proof that no file was lost; optionally re-cuts tags and releases. Use when asked to 'clean the history and commit it in parts', 'rewrite the history as readable commits', 'split the codebase into proper commits', 'redo the commit log so the changelog reads well', or in Russian 'очистить историю и закоммитить по частям', 'разбить проект на нормальные коммиты', 'переписать историю для changelog'. Do not use to collapse a history into one commit (awesome-git-history-reset) or to fix commit authorship (awesome-git-author-rewrite)."
license: MIT
metadata:
  author: Khasky
  tags: ["git", "history-rewrite", "commit-splitting", "conventional-commits", "release", "force-push", "safety"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-git-history-rebuild"
---

# Git History Rebuild

Discard a repository's published history and replay the **same file tree** as a sequence of commits that reads like the work was done in order: dependencies before the code that uses them, each module its own commit, tests and docs where the repo's own convention puts them, messages in the repo's own format, timestamps spaced instead of stamped to one second. The tree at the end is byte-for-byte what it was at the start — only the path to it is rewritten.

**Why the ceremony:** this is an irreversible, outward-facing rewrite of a shared remote, and it is strictly more dangerous than a plain squash. It destroys every commit *and* invents a new structure to replace them, so a mistake is not just lost history — it is a published history that misrepresents the work. Each gate below closes a specific way that goes wrong: pushing without write access, erasing a contributor's attribution, discovering at commit 14 that the commit-msg hook rejects the format, shipping a changelog full of features that were never split that way, or re-tagging a version that a package registry already froze.

## Core principle

**NOTHING IRREVERSIBLE UNTIL FIVE THINGS HOLD:** write access is confirmed, a mirror backup exists and is verified, the repository's own commit rules are read and obeyed, the user has approved the exact commit plan, and the user has confirmed the force-push itself. If any one is missing, stop at that gate.

Four invariants hold throughout:

- **Never operate on the user's existing checkout.** All work happens in a *fresh clone* in a scratch directory. If the result is wrong, the scratch clone is disposable and the user's working copy was never touched.
- **The tree is sacred; only the history is rewritten.** Every tracked path lands in exactly one commit, and the tree must diff clean against the old tip — once locally before the push, and once more in a fresh clone of the remote afterwards. A rebuild that changes a file has failed, however good the log looks.
- **Never invent work that did not happen.** Split along seams that exist in the final tree. A `fix:` commit is honest only when the tree actually carries the fix; a fabricated bug-and-repair arc is a lie in the changelog, and this skill does not write one. See `references/commit-splitting-patterns.md`.
- **The repository's rules outrank this skill's defaults.** If `CONTRIBUTING.md`, a commitlint config, a hook, or the existing log says commits look a certain way, that is the format — always, including when this skill's default is nicer.

## Invocation

```
/awesome-git-history-rebuild <repository-url-or-path> [branch] [--commits N] [--pace 1-3|3-6|6-12|<min>-<max>] [--mode story|bisectable] [--release <version>]
```

- `<repository-url-or-path>` — required. A remote URL (`https://…`, `git@…`) or a local path. A local path with no remote is supported: everything runs except the push. A directory that is not a git repository at all is supported too — there is no history to erase and nothing to compare against, so Phases 1, 8 and 9 are skipped and the skill becomes "initialize with a curated history".
- `[branch]` — optional. Defaults to the **detected** default branch. Never hardcode `main`.
- `--commits N` — optional target count. Otherwise proposed from repo size (see the granularity table in `references/commit-splitting-patterns.md`).
- `--pace` — optional gap range between commit timestamps. Default `1-3` minutes.
- `--mode` — `story` (default: logical layered split; intermediate commits are not guaranteed to build) or `bisectable` (fewer, coarser commits, each verified to build).
- `--release <version>` — optional. After the push, delete the old releases and tags and cut this version. Omitted means tags and releases are left alone.

If the user invokes the skill without a target, ask for one before doing anything else.

## Tooling check (run first)

- `git --version` — required. Everything destructive is plain git.
- **A host CLI** — optional but strongly preferred: `gh` (GitHub) or `glab` (GitLab) verify write permission, branch protection, open pull requests and fork count *before* the destructive step, and are the only way to delete a release. Without one, write access cannot be confirmed until the push itself — say so explicitly and proceed only after the user accepts that blind spot. For Bitbucket, Gitea/Forgejo, Azure DevOps or a plain SSH remote, assume no CLI and treat those gates as **unavailable, not passed**.
- **The repo's own toolchain** (`npm`/`pnpm`, `cargo`, `go`, `python`, …) — needed only in `--mode bisectable` and to validate messages against a commitlint hook. Detect it; never assume it.
- `gitleaks version` — optional. A history being erased is the last chance to notice a secret in it; without gitleaks, report that history was **not** scanned.

Confirm each is on `PATH` (exit 0) before relying on it.

---

## Phase 0 — Preflight and access verification (stop gates)

Every failure here is a hard stop, not a warning to push past. Everything in this phase is read-only.

1. **Parse the target.** A URL gives `<owner>/<repo>`; a local path is cloned into scratch in Phase 1 so the user's checkout is never the workspace. For a local path, check the user's own checkout is clean first (`git status --porcelain` empty) — uncommitted or untracked work is **not** carried into the clone and would silently vanish from the rebuild.

### A — Identity and credentials

The push has to be *someone*, and every commit is stamped with that identity. Establish who, and through which credential, before anything else.

2. **A git identity exists and is the intended one.** An unset or wrong `user.email` produces a whole rebuilt history attributed to nobody, or to the wrong account:
   ```
   git config user.name && git config user.email
   git config --show-origin user.email          # which config file won — global, local, or a conditional include
   ```
   Empty → stop; ask for the identity to commit as. A machine with several git identities (personal and work) is exactly where this goes wrong silently, so quote the resolved email back to the user before continuing.

3. **The host credential is authenticated, and as whom:**
   ```
   gh auth status                               # GitHub: account, host, token scopes, protocol
   glab auth status                             # GitLab: host and user
   ssh -T git@github.com                        # SSH remote: prints the account the key authenticates as
   git config credential.helper                 # HTTPS remote: which store answers
   ```
   Multiple logged-in accounts, or an SSH key that resolves to a different account than `gh auth status` reports, is a hard stop until the user says which one pushes. This is the check that catches "the commits went out under the wrong account" *before* the rewrite instead of after.

4. **Token scopes cover what this run needs.** `gh auth status` prints the scopes; compare against the work:
   - `repo` (GitHub) / `write_repository` (GitLab) — the force-push itself.
   - **`workflow` (GitHub)** — required if any commit contains `.github/workflows/**`. A rebuild re-adds every workflow file, so a token without this scope has the push **rejected** with `refusing to allow an OAuth App to create or update workflow`. Almost every repo with CI hits this; check it now.
   - `repo` again for deleting releases in Phase 10.
   - **SSO / SAML** — an org that enforces single sign-on needs the token explicitly authorized for it (`gh auth status` flags it; an unauthorized token returns 403 with an SSO header). Stop and have the user authorize it.

5. **Hard rule — the remote's owner must match the pushing identity.**
   ```
   gh api user -q .login                        # GitHub
   glab api user                                # GitLab — read `username` from the JSON
   ```
   With a host CLI, compare `<owner>` to the authenticated login, case-insensitive; for an org- or group-owned repo the names will not match, so fall back to the write-permission check below as proof. Without one, match `<owner>` against `user.name` or the local-part of `user.email`. Mismatch → stop, report both sides, and continue only on the user's explicit confirmation that they mean to rewrite a repo owned by another account.

### B — Permission on the remote

6. **Read access and existence** — the cheapest real check:
   ```
   git ls-remote <repository-url>
   ```
   Non-zero exit or an auth prompt → stop. Wrong URL, private repo without credentials, or no network.

7. **Write permission, stated by the host** (needs a host CLI):
   ```
   gh repo view <owner>/<repo> --json viewerPermission,isFork,parent,forkCount,isArchived,visibility
   glab api projects/<url-encoded-path>     # permissions, archived, forked_from_project, forks_count, mirror
   ```
   GitHub: `viewerPermission` must be `WRITE`, `MAINTAIN` or `ADMIN` — `READ` or `null` means the push cannot succeed. GitLab: the effective level under `permissions.project_access` or `permissions.group_access` must be ≥ `40` (Maintainer); `30` (Developer) cannot force-push a protected branch. URL-encode the GitLab path (`group/sub/repo` → `group%2Fsub%2Frepo`).

8. **Write permission, proven by the wire** — the only check that does not depend on a CLI, and the one that catches a deploy key, a read-only token or an expired credential:
   ```
   git push --dry-run origin HEAD:refs/heads/<branch>
   ```
   Run it from a clone of the current tip, so it is a genuine no-op that still performs the server-side permission handshake. `403`, `denied`, or an auth prompt → stop. Without a host CLI this is the *primary* write-access gate, and its result must be reported as such.

9. **The repository accepts writes at all.** `isArchived` / `archived` true → **stop**: an archived repo is read-only and every push is rejected until it is unarchived. A GitLab project with `mirror: true` is a *pull* mirror — it overwrites whatever is pushed to it on its next sync, so a rebuild there is silently reverted; stop and say so.

### C — Rules that reject a push

Each of these fails *at push time*, after the backup and the whole rebuild are done. That is the expensive way to learn them.

10. **Classic branch protection:**
    ```
    gh api repos/<owner>/<repo>/branches/<branch>/protection
    glab api projects/<url-encoded-path>/protected_branches/<branch>
    ```
    `404` means unprotected — good. A `200` with force-push disallowed, required reviews, linear history or required status checks → stop; the user lifts protection or grants a bypass first (GitHub: Settings → Branches; GitLab: Settings → Repository → Protected branches, where `allow_force_push` is the field that matters).

11. **Rulesets — the check most runs forget.** GitHub rulesets are a separate system from classic protection: the protection endpoint answers `404` while a ruleset still blocks the push. Ask for the *effective* rules on the branch:
    ```
    gh api repos/<owner>/<repo>/rules/branches/<branch>
    gh api repos/<owner>/<repo>/rulesets                      # includes org-level rules inherited by the repo
    ```
    Anything in the result blocks or constrains the rebuild, and each maps to a different fix:
    - `non_fast_forward` → force-push is forbidden outright. Hard stop.
    - `required_signatures` → **every rebuilt commit must be signed**; feed that into Phase 2 before the plan is built, not after 25 unsigned commits exist.
    - `required_linear_history`, `required_status_checks`, `pull_request` → the branch cannot take a direct push at all.
    - `commit_message_pattern`, `commit_author_email_pattern`, `committer_email_pattern` → a server-side format rule that every rebuilt message and identity must satisfy. Read the regex and hand it to Phase 2 as a binding constraint.
    - `tag` rulesets → they govern Phase 10; record them now.

12. **Server-side hooks on self-managed hosts** (GitLab push rules, Gerrit, Bitbucket Server hooks) — a self-managed instance can enforce a commit-message regex, a maximum file size, or a "no force push" rule that no API exposes cleanly:
    ```
    glab api projects/<url-encoded-path>/push_rule
    ```
    Present → treat its `commit_message_regex`, `max_file_size` and `member_check` fields as binding constraints on the plan. No API and no CLI → declare it an **unverified** blind spot rather than a passed gate.

### D — Repository state and blast radius

13. **Detect the default branch** (unless one was passed):
    ```
    git ls-remote --symref <repository-url> HEAD
    ```
    The `ref:` line names it. Use its short name as `<branch>`; never hardcode `main`.

14. **Hard rule — more than one branch stops the run.** Other branches keep the old history reachable, so the "clean history" is incomplete, and they usually hold work about to be stranded:
    ```
    git ls-remote --heads <repository-url>
    ```
    More than one → stop, list them, and hand the user the choice: continue (only `<branch>` is rebuilt) or abort. Never decide this alone.

15. **Open pull / merge requests:**
    ```
    gh pr list --repo <owner>/<repo> --state open
    glab mr list --repo <owner>/<repo>
    ```
    Any open PR references commits that will not exist. Surface the list; the user closes or merges them first.

16. **Forks** (`forkCount` / `forks_count` from step 7). Above zero → say plainly that every forker keeps the old history and the rewrite cannot reach them.

17. **What the push will set off.** A force-push of N commits is not a quiet event: it fires webhooks, can start a CI run per commit, and on some setups deploys. Read the triggers before pushing:
    ```
    grep -rl 'on:' .github/workflows/ | xargs grep -l 'push'      # which workflows react to a push
    ```
    Then say plainly what will happen: how many workflow runs, whether any of them deploys or publishes, whether a mirror job will re-push elsewhere, and whether the branch backs GitHub Pages (a force-push republishes the site). If a push triggers a deploy or a publish, that is a decision for the user, not a side effect to discover afterwards.

18. **Hard rule — more than one author in the history stops the run.** A rebuild re-authors *everything* to the person running it:
    ```
    git log --format='%an <%ae>' <branch> | sort | uniq -c | sort -rn
    ```
    Two or more real authors → **stop**. Erasing someone else's commits erases their attribution, breaks a DCO/CLA audit trail, and in a repo that took outside contributions is not the user's call to make alone. Continue only if the user explicitly confirms they own or have permission for every contribution, and offer the honest alternative: keep the other authors as `Co-authored-by:` trailers on the commits that carry their code (`references/repo-convention-discovery.md` has the trailer format).

19. **Published version tags** — check before promising anything about releases. If any tag matches a version published to an immutable registry (npm, PyPI, crates.io, the Go module proxy, Maven Central, NuGet), deleting or moving it is a **hard stop** in Phase 10: those registries freeze a version to a content hash, and a re-tagged version makes consumers fail checksum verification rather than upgrade. Note the finding now; enforce it there.

20. **Secret scan of the history being discarded** (if `gitleaks` is present) — this is the last moment anyone will look at those commits:
    ```
    gitleaks git . --no-banner
    ```
    Findings → stop and tell the user to **rotate** the exposed credential. The rewrite does not make a leaked secret unrecoverable — forks, caches and existing clones keep it — so rotation is the part that protects them. No gitleaks → state that history was not scanned.

### E — Local capacity

21. **Room and limits on this machine.** Three copies of the repository exist during the run (the user's checkout, the mirror backup, the scratch clone), plus a fourth for the Phase 9 verification clone. Check free disk against `du -sh .git` before starting. Also check what the host will refuse to accept: GitHub rejects any single file over 100 MB and warns above 50 MB, and a push over ~2 GB fails outright.
    ```
    git -C <repo> rev-list --objects --all | git -C <repo> cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' | awk '$1=="blob" && $2>52428800'
    ```
    A hit means those blobs are already in the history (grandfathered or LFS) — confirm LFS is configured before re-pushing them, or the rebuild's push is the moment the limit is enforced. Keep the scratch clone and the backup **outside** the repository being rewritten.

### F — The gate

22. **Report the preflight matrix, then confirm.** List every check as `pass` / `fail` / **`unavailable`** — an unrunnable check is a disclosed blind spot, never a silent pass:

    ```text
    identity <name> <email> (from <config file>) · credential <account> via <ssh|https> · scopes <list>
    owner match ✓ · write ✓ (API + dry-run push) · archived ✗ · mirror ✗
    protection: none · rulesets: <none | required_signatures | …> · push rules: <none | unavailable>
    branches 1 · open PRs 0 · forks 3 · authors 1 · published tags <list> · push triggers <N workflows, deploys?>
    ```

23. **Confirmation gate #1.** State the scope, then get an explicit yes:

    > This will erase all `N` commits on `<branch>` of `<owner>/<repo>` and replace them with a rebuilt series over the identical file tree. Nothing is touched yet — the next steps are a verified backup and a read-only analysis, and you will approve the exact commit list before anything is pushed. Proceed?

---

## Phase 1 — Backup (mandatory, verified)

The mirror clone is the only rollback path. Make it before anything else.

```
git clone --mirror <repository-url> <repo>-backup-<shortsha>.git
cd <repo>-backup-<shortsha>.git
git rev-list --all --count                       # > 0
git log --oneline -1 <branch>                    # record as OLD_SHA
git fsck --full                                  # no missing or broken objects
git log --format='%h %ad %an %s' --date=short <branch> > ../old-history.txt
```

`old-history.txt` is not decoration: the old subjects are the best available evidence of what actually happened, and strategy **C** in Phase 4 rebuilds directly from them.

**Git LFS:** `git lfs ls-files` non-empty → a mirror clone holds pointers, not blobs. Run `git lfs fetch --all` inside the backup, or the backup cannot restore the files.

Record the rollback command and report the backup's absolute path:

```
git push --force <repository-url> OLD_SHA:refs/heads/<branch>
```

**Never delete the backup as part of this skill.**

---

## Phase 2 — Read the repository's own rules

Defaults are for repos that have no opinion. Most have one, in more than one place. Discovery matrix, precedence and message templates per convention: `references/repo-convention-discovery.md`. In short, collect:

- **Stated rules** — `CONTRIBUTING*`, `.github/CONTRIBUTING.md`, `README` contribution section, `docs/` development and release runbooks.
- **Enforced rules** — `commitlint.config.*`, `.commitlintrc*`, `.husky/`, `core.hooksPath`, `.pre-commit-config.yaml`, `lefthook.yml`, `.gitlint`, `.gitmessage` (via `commit.template`), a PR-title lint or DCO check in `.github/workflows/`.
- **Release tooling** that reads commits — `.versionrc*`, `release-please-config.json`, `.releaserc*`, `.changeset/`, `cliff.toml`. These decide which commit types reach the changelog, which is half of what makes the rebuilt log worth doing.
- **The old log itself** (from the backup) — the strongest signal, because it is what the repo actually did:
  ```
  git -C <backup> log --format='%s' -200 | sort | uniq -c | sort -rn
  ```
  Infer: conventional (`type(scope): …`) versus sentence-case versus `[Area] …` versus a ticket prefix; the **scope vocabulary already in use**; typical subject length; whether bodies and trailers appear.

Reuse the existing scope vocabulary; never invent a parallel one (`auth`, not `authentication`). Present a short rules card — convention, allowed types, known scopes, hooks that will run, sign-off requirement, signing — and have the user confirm it before the plan is built on top of it.

**Sign-off and signing:** a DCO check means every rebuilt commit needs `-s`. `commit.gpgsign=true` (or a repo that shows Verified badges) means every rebuilt commit must be signed with the current key, and the old signatures are gone either way — say so.

---

## Phase 3 — Analyze the source

Read the tree that will be committed. The unit of analysis is the tracked path, and the output is a module map the split is derived from.

1. **Inventory.** `git ls-files` is the authoritative list — the rebuild commits exactly these paths, nothing else:
   ```
   git ls-files | wc -l
   git ls-files | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn
   ```

2. **Classify every path** into: entry/bootstrap · build and tooling config · dependency manifests and lockfiles · generated or vendored · core domain modules · adapters and integrations · UI · assets, i18n and media · tests · CI/CD · docs · legal and community files. The per-ecosystem mapping (which files are which in Node, Rust, Go, Python, Java, PHP, Ruby, .NET, mobile, monorepos) is in `references/commit-splitting-patterns.md`.

3. **Order by dependency direction.** Read the imports and order leaf modules before their consumers — a module lands in a commit *after* everything it imports. This single rule is what makes the log read as work rather than as an alphabetical dump.

4. **Find the real seams** for anything that is not a plain `feat`: a guard clause with its own test, a workaround with a comment naming the platform bug, a cache or index added over an existing path, a formatting-only file. Those are honest `fix`, `perf`, `refactor` and `style` commits because the artifact is in the tree. Nothing else earns those types.

5. **Size the work.** Lines per proposed group, so no commit is a 4000-line wall and none is a one-line orphan.

**Scale limit:** above ~1500 tracked files or ~200k lines, analyze at directory level rather than per file, propose a coarse split, and say explicitly that the grouping is directory-derived rather than import-derived.

Report the map in one screen: layers, module count, file count, line count, generated paths excluded from the "real code" count.

---

## Phase 4 — Propose the commit plan (approval loop)

Build the default plan from the layered strategy in `references/commit-splitting-patterns.md`, then present it as a table. Nothing is executed from this phase; it repeats until the user approves.

```text
 #  type(scope)          subject                                     paths                        files  ±lines  changelog
 1  chore                scaffold the <stack> workspace              package.json, tsconfig…         12    +420  hidden
 2  feat(storage)        persist state in a lock-guarded store       src/storage/**                   4    +610  Features
 …
```

Alongside the table, always show:

- **Coverage proof** — `N tracked paths, all assigned exactly once, 0 unassigned`. An unassigned path is a stop, not a rounding error.
- **Changelog preview** — the sections a generated changelog would contain, given the repo's release tooling and hidden types.
- **Mode and pacing** — `story` or `bisectable`, and the gap range about to be used.
- **What the plan does not claim** — in `story` mode, that intermediate commits are not built or tested.

Then ask for one of:

- **Approve** — proceed to Phase 5.
- **Adjust** — merge, split, reorder or rename individual rows; re-present the table.
- **Re-split another way** — offer the alternatives by name, and rebuild the whole table under the chosen one:
  - **A. Layered** (default) — infrastructure → domain → adapters → UI → tests → CI → docs.
  - **B. Feature-vertical** — one commit per user-visible capability, full stack each.
  - **C. Reconstructed** — follow the *real* old history from `old-history.txt`, condensed into its actual topics. The most honest shape available when the old log is rich.
  - **D. Coarse or fine** — the same strategy at a different granularity (5–9 commits versus 20–40).
  - **E. Changelog-first** — grouped so the generated release notes read as a feature list, hidden types swept into setup commits.
  - **F. Manual** — the user supplies or edits the grouping directly; this skill only validates coverage and message format.

Never proceed on silence or a vague "looks fine" — the approval must name the table.

---

## Phase 5 — Pacing and timestamps

Commits created in a loop share one timestamp to the second, which is the one detail that makes a rebuilt history unreadable as a sequence. Ask two questions:

1. **Gap between commits** — `1–3 min` (default) · `3–6 min` · `6–12 min` · custom range.
2. **How the gap is applied** — *synthetic* (default: dates computed on a ladder ending now, no waiting) or *real* (the run actually sleeps between commits; a 25-commit rebuild at 1–3 minutes takes roughly an hour).

Synthetic dates set both the author and committer date, with a random gap per step so the spacing is not a metronome:

```bash
MIN=60; MAX=180; N=<commit count>
gaps=(); total=0
for ((i=1;i<N;i++)); do g=$((MIN + RANDOM % (MAX-MIN+1))); gaps+=($g); total=$((total+g)); done
T=$(( $(date +%s) - total ))            # first commit; the last lands at "now"
OFF=$(git log -1 --format=%ad --date=format:%z 2>/dev/null || echo +0000)

# per commit i:  after committing, advance T
GIT_AUTHOR_DATE="@$T $OFF" GIT_COMMITTER_DATE="@$T $OFF" git commit -m "<subject>"
T=$(( T + gaps[i] ))
```

```powershell
$min=60; $max=180; $n=<commit count>
$gaps = 1..($n-1) | ForEach-Object { Get-Random -Minimum $min -Maximum ($max+1) }
$t = [int][double]::Parse((Get-Date -UFormat %s)) - ($gaps | Measure-Object -Sum).Sum
$off = (Get-Date -Format zzz) -replace ':',''
$env:GIT_AUTHOR_DATE = "@$t $off"; $env:GIT_COMMITTER_DATE = $env:GIT_AUTHOR_DATE
```

`@<epoch> <offset>` is git's portable date form — no `date -d` versus `date -r` split between GNU and BSD.

**Honesty boundary.** Spacing the user's own commits over their own tree is presentation. Backdating to a period the work did not happen in, to claim priority, meet a deadline, qualify for a contest or program, or to make one person's work look like another's, is fabricated evidence — refuse it and say why. If the user asks for a ladder that ends anywhere other than "now", ask what the date is for before setting it.

---

## Phase 6 — Replay the tree as commits

In the scratch clone, on the target branch. Nothing here touches the remote.

```
git checkout --orphan <rebuild-branch>
git rm -r --cached . -q                 # working tree untouched; index emptied
git status --porcelain | wc -l          # every tracked path now shows as untracked — record this count
```

**Validate every message before the first commit.** A commit-msg hook that rejects row 14 halfway through is a wasted rebuild:

```
for each planned subject:  echo "<subject>" | npx --no-install commitlint     # or the repo's own validator
```

Then, per row of the approved plan:

```
git add -- <paths of this row>
git diff --cached --name-only            # must equal the planned path set exactly
GIT_AUTHOR_DATE=… GIT_COMMITTER_DATE=… git commit -m "<subject>" [-m "<body>"] [-s]
```

- **Hooks run.** Never `--no-verify` by default: a repo that enforces a rule means it. If a `pre-commit` hook fails on an intermediate partial tree (a type-checker or a full-project linter that cannot see files not yet committed), stop and hand the user the choice — coarsen the split so each commit is self-consistent, or accept `--no-verify` for intermediate commits only, disclosed in the final report. If a hook *rewrites* files (formatters via lint-staged), the Phase 7 tree check will catch the drift; do not paper over it.
- **`--mode bisectable`** — run the repo's build or test command after each commit; a failure stops the run at that commit for regrouping.
- **Keep a running counter** of paths committed against the inventory total, so a gap is visible at the commit that caused it and not at the end.

Submodules and LFS: `git add` on a submodule path re-adds the gitlink, and LFS pointers commit like any other file — both survive the replay as long as `.gitmodules` and `.gitattributes` are in the same or an earlier commit than the paths they govern.

---

## Phase 7 — Verify the rebuilt history

Every check runs before the push. A failure here is a regroup, not a warning.

```
git status --porcelain                   # EMPTY — nothing left uncommitted
git diff --stat <OLD_SHA> HEAD           # EMPTY — the tree is identical to the old tip
git rev-list --count HEAD                # equals the approved plan's row count
git log --format='%ad' --date=iso        # strictly increasing, gaps inside the chosen range
git log --format='%an <%ae>' | sort -u   # exactly the intended identity (plus co-authors, if any)
git log --format='%s' | <validator>      # every subject passes the repo's own commit lint
```

`git diff <OLD_SHA> HEAD` printing anything is a hard stop: the rebuild changed a file. Usually an ignored or untracked path that `git add` did or did not pick up, or a formatter hook that rewrote a file mid-replay. Fix the cause and replay; never push a tree that differs from what was there.

If the repo has changelog tooling, run its dry run now (`npx commit-and-tag-version --dry-run`, `npx release-please …`, `git cliff --unreleased`) and show the user the notes their new history produces. This is the deliverable they asked for — confirm it reads well *before* the push, when regrouping is still free.

---

## Phase 8 — Force-push (the irreversible step)

**Confirmation gate #2.** Quote the exact numbers back, then get an explicit yes:

> Pushing replaces `<N_old>` commits on `<branch>` of `<owner>/<repo>` with `<N_new>` rebuilt commits (`<OLD_SHA>` → `<NEW_SHA>`). The old commits become unreachable from the remote tip; the verified backup at `<path>` is the only way back. Open PRs break; forks keep the old history. Proceed?

```
git push --force-with-lease=<branch>:<OLD_SHA> origin <branch>
git ls-remote origin <branch>            # sha equals the new HEAD
```

`--force-with-lease`, never a bare `--force`: it aborts if someone pushed after the backup was taken. Rejected as *stale info* → a new commit landed; stop and restart from Phase 1 against the new tip rather than steamrolling it. Rejected as *protected branch*, *non-fast-forward* or *unsigned commit* → a protection or ruleset gate (Phase 0, steps 10–11) was skipped or has been added since.

---

## Phase 9 — Prove the published tree matches the old one

Phase 7 proved the *local* rebuild. This proves what the host actually serves — a separate fact, and the one the user cares about: after the republication, is the code on the remote still exactly the code that was there before the history was erased. Push failures are loud, but a partial push, a filter that rewrote files on the way out (`.gitattributes` renormalization, an LFS misconfiguration), or a branch that was not the one everyone reads are all quiet.

Clone the pushed result fresh — never re-check the workspace that produced it, which would only prove it agrees with itself:

```
git clone --branch <branch> <repository-url> <repo>-verify
cd <repo>-verify
git remote add backup <absolute path to *-backup-*.git>
git fetch backup 'refs/heads/*:refs/backup/*'
```

Then four checks, cheapest and strongest first:

```
git rev-parse refs/backup/<branch>^{tree}        # old root tree hash
git rev-parse HEAD^{tree}                        # new root tree hash — MUST be identical
git diff --stat refs/backup/<branch> HEAD        # EMPTY (names the files if the hashes differ)
diff <(git ls-tree -r --name-only refs/backup/<branch> | sort) \
     <(git ls-tree -r --name-only HEAD | sort)   # EMPTY — no path added, dropped or renamed
git ls-files | wc -l                             # equals the Phase 3 inventory count
```

Equal root tree hashes are a complete proof of content identity: a git tree hash covers every path, every blob's content, and every file mode, recursively. Two histories with the same root tree hash are the same code, byte for byte. The other three checks exist to *localize* a mismatch, not to add certainty.

Any mismatch → **stop and roll back before touching anything else** (the Rollback section below), then report what differed. Do not attempt to patch the difference forward on the remote; restore the old tip, and re-run from Phase 6 once the cause is understood.

Two things this proof does not cover, and both belong in the report rather than in a claim of completeness:

- **Untracked and ignored files** were never in the history and are not on the remote either — before and after are equally empty of them, which is correct, not a loss.
- **Working-tree bytes after checkout** can legitimately differ from the old checkout when `.gitattributes` renormalizes line endings or LFS smudges pointers. That is a checkout-filter difference, not a content loss — but if the repo has such filters, verify one representative file by hand (`git show refs/backup/<branch>:<path> | git hash-object --stdin` against `git rev-parse HEAD:<path>`) so the report says which it was.

Report the two tree hashes verbatim. `<OLD_TREE> == <NEW_TREE>` is the line that answers "did we lose anything".

---

## Phase 10 — Tags and releases (optional, per item)

Only if the user asked for it. Skipping this phase leaves every existing tag pointing into the old history, which keeps those objects alive — say so rather than implying the wipe was total.

**Hard stop first:** any tag whose version is published to an immutable registry (npm, PyPI, crates.io, the Go module proxy, Maven Central, NuGet, a signed container tag) must not be deleted or moved. Those registries pin a version to content; re-tagging makes consumers fail checksum verification instead of upgrading. The only safe move is a **new, higher version**.

Deleting a release is not free: its uploaded assets and their download counts are gone for good, and any auto-updater that reads "the latest release" finds nothing until a new one is published. State both, per release, before deleting.

```
gh release delete <tag> --yes --cleanup-tag     # GitHub: release + its tag
glab release delete <tag>                       # GitLab: release; delete the tag separately
git tag -d <tag>                                # local
git push origin :refs/tags/<tag>                # remote, if the host CLI did not
```

Ask per item; never batch-delete tags. Then cut the new version with **the repository's own tooling**, not by hand — `pnpm release`/`commit-and-tag-version`, `semantic-release`, `release-please`, `changeset publish`, `cargo release`, `poetry version`, or the plain `git tag -a v<version> -m` the repo already uses. Follow its documented runbook if `docs/` has one, and let CI publish if that is how the repo publishes.

---

## Phase 11 — Report

```text
Repository:   <owner>/<repo>  (branch <branch>)
Rebuild:      <OLD_SHA> → <NEW_SHA>   (<N_old> commits → <N_new>)
Strategy:     layered | feature-vertical | reconstructed | changelog-first | manual   (mode: story | bisectable)
Convention:   <detected convention>, enforced by <hook/CI>  — every subject validated
Content:      local  git diff <OLD_SHA>..<NEW_SHA> empty — tree identical, 0 files lost
Published:    tree <OLD_TREE> == <NEW_TREE> in a fresh clone of the remote; <N> paths, none added or dropped
Coverage:     <N> tracked paths, each in exactly one commit
Pacing:       <range>, synthetic|real timestamps, first <ts> → last <ts>
Backup:       <absolute path>  (verified: N commits, fsck clean[, LFS blobs fetched])
Secret scan:  clean | FINDINGS (rotate now) | not scanned (no gitleaks)
Releases:     untouched | <tags deleted>, <version> cut via <tooling>
Verified:     ls-remote tip = <NEW_SHA>; status clean; N commits; lint pass; changelog dry run OK
              fresh clone re-checked against the backup — root tree hashes equal
```

**Manual residuals — say these plainly, they cannot be done by command:**

- **Open PRs** reference commits that no longer exist; close or recreate them.
- **Forks and existing clones** keep the old history; a rewrite cannot reach them.
- **Intermediate commits are not built** in `story` mode — `git bisect` across this history is unreliable by construction.
- **`--no-verify` was used** on intermediate commits, if it was. Name which.
- **A leaked secret**, if one was found, still needs rotating.
- **The backup** stays until the user confirms the remote is good. This skill never deletes it.

## Rollback

The backup restores the exact pre-rebuild state:

```
git push --force <repository-url> OLD_SHA:refs/heads/<branch>
git -C <backup> push --force origin 'refs/tags/*:refs/tags/*'    # if tags were deleted
```

Deleted **releases** do not come back — a release object and its uploaded assets are gone once deleted, even when the tag is restored. That asymmetry is why Phase 10 is opt-in, last, and per item.

## Guardrails

- The user's own checkout is off-limits; all work happens in a scratch clone with a verified mirror backup beside it.
- Read-only until confirmation gate #1; nothing leaves the machine until gate #2.
- Every stop gate is a real stop: owner mismatch, multiple branches, multiple authors, no write access, protected branch, unassigned path, non-empty tree diff, a published tree that does not match the backup, published-version tag, or a missing approval — each halts the run.
- The published result is proved, not assumed: a fresh clone of the remote is compared to the backup by root tree hash, and a mismatch rolls back before anything else happens.
- The plan is approved as a table, by the user, before a single commit is made — and re-split on request rather than defended.
- No invented history: no fabricated bug-fix arcs, no commit describing work the tree does not contain, no backdating that would function as evidence.
- The repo's convention, hooks and release tooling win over this skill's defaults, every time.
- `--force-with-lease`, never bare `--force`. The backup and any ref the user did not name are never deleted here.
- This is for a repository the user owns and authorizes. It is not a way to erase a co-contributor's attribution, and it is not a way to scrub a secret from a public project's past — for that, rotate the secret.

## References

- `references/commit-splitting-patterns.md` — how large OSS projects split work into commits (git, the Linux kernel, OpenStack, Angular/Conventional Commits), the layer order, granularity by repo size, honest commit types, the six re-split strategies, per-ecosystem file mapping, and the anti-patterns.
- `references/repo-convention-discovery.md` — where a repo states and enforces its commit rules, precedence between sources, inferring the format from the existing log, message templates per convention, DCO and signing, and how to handle hooks during the replay.
