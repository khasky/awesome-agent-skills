---
name: awesome-git-history-reset
description: "Erases a repository's entire git history and replaces it with a single fresh commit, then force-pushes — safely: access checks, a verified mirror backup, a secret scan, and an explicit confirmation gate before anything irreversible. Use when asked to 'wipe git history', 'squash all commits into one', 'reset history to a single Initial commit', 'start the history fresh', 'clean/erase the commit log', or in Russian 'очистить историю git', 'схлопнуть все коммиты в один', 'переписать историю с нуля'. Takes a repository URL: '/awesome-git-history-reset <repository-url>'. Do not use to squash a feature branch before merge (that's an interactive rebase) or to remove one secret from history (that's git-filter-repo + rotation)."
license: MIT
metadata:
  author: Khasky
  tags: ["git", "history-rewrite", "force-push", "repository-ops", "safety"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-git-history-reset"
---

# Git History Reset

Collapse a repository's **entire** history into one fresh `Initial commit` and force-push it, so the published commit log starts clean. The file tree is preserved byte-for-byte; only the history leading to it is discarded.

**Why the ceremony:** this is an irreversible, outward-facing rewrite of a shared remote. Once you force-push, every old commit on the default branch is gone from the tip, open pull requests break, and anyone who cloned or forked keeps the old history anyway. The steps below are not bureaucracy — each one closes a specific way this goes wrong: pushing without write access, discovering too late that the branch was protected, losing content in the squash, or force-pushing over a teammate's commit you never saw.

## Core principle

**NOTHING IRREVERSIBLE UNTIL FOUR THINGS HOLD:** write access is confirmed, a mirror backup exists and is verified, the history is scanned for secrets, and the user has explicitly confirmed the wipe. If any one is missing, stop at that gate.

Three invariants hold throughout:

- **Never operate on the user's existing checkout.** Always work in a *fresh clone* in a scratch directory. If the push fails or the result is wrong, the scratch clone is disposable and the user's own working copy was never touched.
- **Never assume the default branch is `main`.** Detect it from the remote. Rewriting the wrong branch, or one that isn't the default, silently leaves the real history in place.
- **Never delete the backup, and never delete a remote ref, without asking.** The backup is the only rollback path. Extra branches and tags may be the user's, not stale.

## Invocation

```
/awesome-git-history-reset <repository-url> [branch] [--message "Initial commit"]
```

- `<repository-url>` — required. HTTPS or SSH (`https://github.com/owner/repo.git` or `git@github.com:owner/repo.git`).
- `[branch]` — optional. Defaults to the remote's **detected** default branch. Only pass this to target a non-default branch.
- `--message` — optional. The single commit's message. If omitted, Phase 0 asks for it at preflight (default `Initial commit`).

If the user invokes the skill without a URL, ask for one before doing anything else.

## Tooling check (run first)

- `git --version` — required. Everything destructive is plain git; the host tooling below only powers the *preflight gates*.
- **A host CLI** — optional but strongly preferred: it verifies write/admin permission, branch protection, open pull/merge requests, and fork count *before* the destructive step. Without one, write access can't be confirmed until the push itself, and the protection/PR/fork warnings are unavailable — say so explicitly and proceed only after the user accepts that blind spot.
- `gitleaks version` — optional: scans history for secrets before the rewrite. Without it, note that history was **not** scanned.

Confirm each is on `PATH` (exit 0) before relying on it. Never assume a host CLI or `gitleaks` is installed.

**Which host CLI.** Detect the host from the remote URL, then use its tool. The gates in Phase 0 give the command for each:

| Host | CLI | Check it's present | Generic escape hatch |
|---|---|---|---|
| GitHub | `gh` | `gh --version` | `gh api <endpoint>` |
| GitLab (SaaS or self-managed) | `glab` | `glab --version` | `glab api <endpoint>` (`--hostname` for self-managed) |
| Bitbucket, Gitea/Forgejo, Azure DevOps, plain SSH remote | none assumed | — | the host's REST API over `curl` with a token, if the user supplies one |

For a host with no CLI and no token, treat every gate below that needs one as **unavailable**, not as passed: list which checks you could not run, and get the user's explicit acceptance before Phase 1. An unrunnable gate is a blind spot to disclose, never a gate to skip silently.

---

## Phase 0 — Preflight and access verification (stop gates)

Do every check that your available tools allow. Each failure is a hard stop, not a warning to push past.

1. **Parse the URL** into `<owner>/<repo>`; keep the URL verbatim for git, derive `owner/repo` for `gh`.

2. **Read access + existence** — the cheapest real check:
   ```
   git ls-remote <repository-url>
   ```
   Non-zero exit or auth prompt → stop. The URL is wrong, the repo is private and you're unauthenticated, or the network is down.

3. **Hard rule — the remote's owner must match your git identity.** Rewriting history on a repo you don't own is almost always a mistake (wrong clone URL, a colleague's repo, an upstream you meant to fork). Compare the repo owner against the identity that will push:
   ```
   git config user.name
   git config user.email

   gh api user -q .login              # GitHub — the account that will actually push
   glab api user                      # GitLab — read `username` from the JSON
   ```
   `glab api` has no field-selection flag: it prints JSON, so read the field yourself rather than piping through a `jq` you haven't confirmed is installed. The repo owner is `<owner>` (from the URL, or `gh repo view <owner>/<repo> --json owner` / the `namespace.full_path` field of `glab api projects/<url-encoded-path>`). With a host CLI present, the authoritative comparison is `<owner>` vs the authenticated login, case-insensitive; for an org- or group-owned repo the logins won't match by name — fall back to the write-permission check in step 6 as proof of ownership. With no host CLI, match `<owner>` against `git config user.name` or the local-part of `git config user.email`.
   Mismatch → **stop and report it**: name the repo owner and your local git identity side by side, and do not proceed until the user *explicitly* confirms they intend to rewrite a repo owned by a different account. Hard stop, not a warning to skip.

4. **Detect the default branch** (unless a branch was passed):
   ```
   git ls-remote --symref <repository-url> HEAD
   ```
   Read the `ref:` line — that ref (e.g. `refs/heads/main`) is the default branch. Use its short name as `<branch>`. Do not hardcode `main`.

5. **Hard rule — more than one branch means stop and ask.** Extra branches keep the old history reachable (so the "clean history" is incomplete), and usually mean the repo holds work you're about to strand.
   ```
   git ls-remote --heads <repository-url>
   ```
   More than one branch → **stop, list every branch, and offer the user the choice explicitly: continue anyway (only `<branch>` is rewritten; the other branches keep their full history) or abort.** Do not decide this yourself. Exactly one branch → continue.

6. **Write / admin permission** (needs a host CLI):
   ```
   gh repo view <owner>/<repo> --json viewerPermission,isFork,parent,forkCount
   glab api projects/<url-encoded-path>       # read permissions, forked_from_project, forks_count
   ```
   GitHub: `viewerPermission` must be `WRITE`, `MAINTAIN`, or `ADMIN`; `READ` / `null` → stop, you cannot push. GitLab: the effective `access_level` under `permissions.project_access` (or `permissions.group_access`) must be ≥ `40` (Maintainer) — `30` (Developer) cannot force-push a protected branch and usually cannot push to the default one. Note whether the repo is a fork (`isFork` / `forked_from_project`) — rewriting a fork's history is fine but doesn't touch the upstream; make sure that's what the user wants.

   URL-encode the GitLab project path: `group/sub/repo` → `group%2Fsub%2Frepo`. Inside a checkout of that project, `glab api projects/:fullpath` substitutes it for you.

7. **Branch protection** (needs a host CLI) — force-push to a protected default branch will be *rejected at push time*, after the backup and squash are already done:
   ```
   gh api repos/<owner>/<repo>/branches/<branch>/protection
   glab api projects/<url-encoded-path>/protected_branches/<branch>
   ```
   A `200` with force-push disallowed, or required reviews / linear-history / status checks → stop and tell the user to lift protection or grant a bypass first (GitHub: Settings → Branches; GitLab: Settings → Repository → Protected branches, where `allow_force_push` is the field that matters). A `404` means the branch is unprotected — good.

8. **Open pull / merge requests** (needs a host CLI) — they reference old commits and break on a wholesale rewrite:
   ```
   gh pr list --repo <owner>/<repo> --state open
   glab mr list --repo <owner>/<repo>         # defaults to open MRs; --all would add closed and merged
   ```
   Any open PR/MR → surface the list. The user should close or merge them first; proceeding will orphan their base commits.

9. **Forks** (from step 6 — `forkCount` on GitHub, `forks_count` on GitLab) — a rewrite cannot reach a fork; every forker keeps a full copy of the old history. If the count is above zero, say so plainly: this is not a way to make the old history unrecoverable.

10. **Commit message.** Ask the user what to name the single commit the whole history collapses into — unless `--message` was already passed on invocation. Offer `Initial commit` as the default so they can accept it in one word. Record the answer as `<message>`; Phase 3 commits with it verbatim, and the confirmation gate below quotes it back.

11. **Confirmation gate.** State exactly what will happen, then get an explicit yes:

   > This will permanently erase all history on `<branch>` of `<owner>/<repo>` and replace it with a single commit (`<message>`), then force-push. Old commits will be unrecoverable from the remote tip (a verified backup is kept locally). Open PRs will break; existing forks keep the old history. Proceed?

   No explicit confirmation → stop here. Everything up to this point was read-only.

---

## Phase 1 — Backup (mandatory, verified)

A mirror clone is the rollback path. Make it before touching anything.

```
git clone --mirror <repository-url> <repo>-backup-<shortsha>.git
```

Then **verify** it — an unverified backup is not a backup:

```
cd <repo>-backup-<shortsha>.git
git rev-list --all --count            # must be > 0
git log --oneline -1 <branch>         # record this as OLD_SHA
git fsck --full                       # no missing/broken objects
```

Record `OLD_SHA` (the pre-rewrite tip) — later phases prove no content was lost against it, and it's the exact ref to restore from if the user ever wants to roll back:

```
# rollback, if ever needed:
git push --force <repository-url> OLD_SHA:refs/heads/<branch>
```

Report the backup's absolute path. **Never delete it as part of this skill.**

---

## Phase 2 — Secret scan of history (before the rewrite)

A force-push does **not** remove a leaked secret: it survives in forks, in the host's dangling-commit cache, and in anyone's existing clone. Finding one now changes the plan from "rewrite" to "rewrite **and rotate**."

Clone a normal (non-mirror) working copy — you'll reuse it for the squash:

```
git clone <repository-url> <work>
cd <work>
git checkout <branch>
```

If `gitleaks` is available:

```
gitleaks detect --source . --no-banner
```

- Findings → **stop and tell the user to rotate the exposed credentials.** The rewrite can still proceed afterward, but rotation is the part that actually protects them; the force-push is cosmetic for an exposed secret.
- Clean → continue.
- No `gitleaks` → state that history was **not** scanned and recommend installing it if secrets in old commits are a concern: `winget install gitleaks` (Windows), `brew install gitleaks` (macOS/Linuxbrew), the distro package on Linux (`apt install gitleaks`, `pacman -S gitleaks`, `dnf install gitleaks`), or a release binary from the project's GitHub releases where the distro has none.

---

## Phase 3 — Squash to a single commit (orphan method)

In the working clone, on the target branch:

```
git checkout --orphan fresh
git add -A
git commit -m "<message>"          # default: "Initial commit"
git branch -D <branch>
git branch -m fresh <branch>
```

**Verify no content was lost** — the whole point is a clean history over an *identical* tree:

```
git log --oneline                  # exactly one commit
git diff --stat <OLD_SHA> HEAD      # MUST be empty — same tree as the old tip
```

If `git diff <OLD_SHA> HEAD` shows anything, stop: the squash changed the file tree (usually an untracked or ignored file that `git add -A` did or didn't pick up). Do not push a tree that differs from what was there.

---

## Phase 4 — Force-push (the irreversible step)

Use `--force-with-lease`, not a bare `--force`: it aborts if someone pushed to `<branch>` after your clone, so you never silently overwrite a commit you never saw.

```
git push --force-with-lease=<branch>:<OLD_SHA> origin <branch>
```

- Rejected as *stale info* → a new commit landed after your backup. Stop, re-run from Phase 1 against the new tip; do not switch to `--force` to steamroll it.
- Rejected as *protected branch* → Phase 0 step 7 was skipped or protection was added since; lift it and retry.

Verify the remote tip is now the new commit:

```
git ls-remote origin <branch>       # sha matches your new HEAD, not OLD_SHA
```

---

## Phase 5 — Prune local history

Drop the old objects from the working clone so it reflects the clean state:

```
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

Verify:

```
git rev-list --all --count          # 1
git fsck --unreachable              # old commits gone (empty or only expected)
```

---

## Phase 6 — Remote cleanup (only with per-item confirmation)

The rewrite only touched `<branch>`. Any **other** branch or tag still points into the old history, which keeps those objects alive and the "clean history" incomplete.

```
git ls-remote --heads --tags origin
```

- Only `<branch>` remains → nothing to do.
- Other refs exist → **list them for the user and ask per ref.** These may be release tags or teammates' branches, not stale debris. Delete only the ones the user names, one at a time:
  ```
  git push origin --delete <branch-or-tag>
  ```
  **Deleting a tag orphans the release built on it** — on GitHub and GitLab alike the release object and its notes/assets survive, but its tag link goes dead. Warn the user per tag before deleting, and note the tradeoff: keeping the tag leaves the old history reachable through it (the reset stays cosmetic for `<branch>`); deleting it completes the wipe but breaks the release.
- Tidy local remote-tracking refs:
  ```
  git remote prune origin
  ```

Never batch-delete refs. Never assume a tag is disposable.

---

## Phase 7 — Report

Close with what happened, the evidence, and what the user must still do by hand:

```text
Repository:   <owner>/<repo>  (branch <branch>)
Rewrite:      <OLD_SHA> → <NEW_SHA>  (N commits → 1)
Content:      git diff <OLD_SHA>..<NEW_SHA> empty — tree identical, no files lost
Backup:       <absolute path to *-backup-*.git>  (verified: N commits, fsck clean)
Secret scan:  clean | FINDINGS (rotate now) | not scanned (no gitleaks)
Verified:     ls-remote tip = <NEW_SHA>; local rev-list = 1; fsck clean
```

**Manual residuals (cannot be done by command):**

- **Open PRs** — close or recreate; they reference commits that no longer exist.
- **Forks** — keep a full copy of the old history; a rewrite can't reach them.
- **Full erasure guarantee** — a force-push leaves the old commits dangling and cache-reachable for a while on every major host. The only reliable way to drop them is to delete the repository and recreate it (GitHub: Settings → Delete repository; GitLab: Settings → General → Advanced → Delete project, which is a delayed deletion on some plans). On a self-managed host, ask the administrator what its garbage-collection schedule actually is rather than assuming.
- **Leaked secret** — if the scan (or the user) found one, rotate it. The rewrite does not make it unrecoverable.
- **Backup** — tell the user where it is and that they can delete it once they've confirmed the remote is good. The skill never deletes it.

## Guardrails

- The user's own checkout is off-limits. All work happens in a fresh scratch clone and a mirror backup.
- Read-only until the Phase 0 confirmation gate. Everything before it can be safely abandoned.
- Every stop gate is a real stop: owner/identity mismatch, more than one remote branch, no write access, protected branch, secrets found without a rotation plan, tree diff after squash, or no user confirmation — each halts the skill, not a warning to skip.
- The two hard rules are absolute: a repo owner that doesn't match your git identity halts and reports; more than one remote branch halts and hands the continue-or-abort choice to the user. Neither is decided by the agent alone.
- `--force-with-lease`, never bare `--force`, so a concurrent push aborts you instead of being destroyed.
- The backup and any remote ref the user didn't name are never deleted by this skill.
- This rewrites history on a repo the user controls and authorizes. It is not a way to scrub a secret from a public project's past (forks and caches defeat that) — for that, rotate the secret; the rewrite is secondary.

