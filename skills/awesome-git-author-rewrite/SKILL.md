---
name: awesome-git-author-rewrite
description: "Rewrites the author and committer identity on a commit — or on every commit carrying a wrong identity — and force-pushes it, safely: account-ownership and write-access checks, a verified mirror backup, a counted hash blast radius, and an explicit confirmation gate before anything irreversible. Takes a commit URL plus the replacement identity: '/awesome-git-author-rewrite <commit-url> --name '<Name>' --email '<email>''. Use when asked to 'fix the commit author', 'wrong email on my commits', 'commit shows the wrong account', 'change the author name and email on a commit', 're-attribute commits to my account', 'commits are not linked to my GitHub profile', or in Russian 'переписать автора коммита', 'исправить email в коммитах', 'коммиты не привязаны к аккаунту'. Do not use to collapse a whole history into one commit — use awesome-git-history-reset; not to change a commit message only (that is git commit --amend or rebase --reword)."
license: MIT
metadata:
  author: Khasky
  tags: ["git", "history-rewrite", "commit-author", "force-push", "repository-ops", "safety"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-git-author-rewrite"
---

# Git Author Rewrite

Replace the identity stamped on a commit — the `author` and `committer` name/email headers — with an identity the user actually owns, then force-push. The file tree, the commit messages, and the dates are preserved byte-for-byte; only the identity headers and, as a consequence, every affected commit hash change.

**Why the ceremony:** identity lives *inside* the commit object, so changing it changes the commit's hash, and every descendant commit's hash with it. That makes this an irreversible rewrite of a shared remote, not an edit. The steps below each close a specific way it goes wrong: rewriting a hash range far larger than the user pictured, pushing without write access, replacing one unowned email with another unowned email so the attribution still doesn't land, silently invalidating signatures, or force-pushing over a teammate's commit you never saw. A second clone that never got reset will push the old identity back the next day.

## Core principle

**NOTHING IRREVERSIBLE UNTIL FIVE THINGS HOLD:** the new identity is proven to belong to the user's account, write access is confirmed, a mirror backup exists and is verified, the hash blast radius has been counted and shown, and the user has explicitly confirmed. If any one is missing, stop at that gate.

Four invariants hold throughout:

- **Never operate on the user's existing checkout.** Work in a *fresh clone* in a scratch directory. If the rewrite is wrong, the scratch clone is disposable and the user's working copy was never touched.
- **Author and committer are two different fields.** Rewriting only the author leaves the old address in the object and on the host's commit page ("X authored and Y committed"). Rewrite both unless the user asks for one.
- **One commit is never one commit.** Rewriting commit `C` rewrites every commit that has `C` as an ancestor. Count them and show the number before asking for confirmation.
- **Never delete the backup, and never delete a remote ref, without asking.** The backup is the only rollback path.

## Invocation

```
/awesome-git-author-rewrite <commit-url> --name '<Git Author Name>' --email '<git@email>' [--scope commit|identity] [--field author|committer|both]
```

- `<commit-url>` — required. A web URL to a commit on any host (GitHub, GitLab, Bitbucket, Gitea/Forgejo, Azure DevOps), or `<repository-url>#<sha>` for a host whose URL shape you don't recognize.
- `--name` / `--email` — required. The replacement identity. If either is missing, ask before anything else.
- `--scope` — optional. `commit` (default): only the commit in the URL. `identity`: every commit in the repository whose author or committer email matches the one found on that commit — usually what the user means when several commits are wrong.
- `--field` — optional, defaults to `both`.

If the user invokes the skill without a URL, ask for one before doing anything else.

## Tooling check (run first)

- `git --version` — required.
- `git filter-repo --version` — **preferred rewrite engine.** It is what git's own documentation points to, it preserves author and committer dates, and it *strips* signatures that the rewrite invalidates instead of leaving a broken one behind. Install: `pip install git-filter-repo` (all platforms), `brew install git-filter-repo` (macOS), the distro package on Linux (`apt install git-filter-repo`, `dnf install git-filter-repo`), `scoop install git-filter-repo` (Windows).
- `git filter-branch` — the always-present fallback, used only when `filter-repo` is absent and the user does not want to install it. It is deprecated, it is slow, and it keeps the now-invalid `gpgsig` header — say so before using it.
- **A host CLI** — optional but strongly preferred: it verifies that the *new* email belongs to the user's account, plus write permission, branch protection, and open pull/merge requests, *before* the destructive step. Without one, none of those can be checked — say so explicitly and proceed only after the user accepts that blind spot.

Confirm each is on `PATH` (exit 0) before relying on it. Never assume `filter-repo` or a host CLI is installed.

**Which host CLI.** Detect the host from the URL, then use its tool:

| Host | CLI | Check it's present | Generic escape hatch |
|---|---|---|---|
| GitHub | `gh` | `gh --version` | `gh api <endpoint>` |
| GitLab (SaaS or self-managed) | `glab` | `glab --version` | `glab api <endpoint>` (`--hostname` for self-managed) |
| Bitbucket, Gitea/Forgejo, Azure DevOps, plain SSH remote | none assumed | — | the host's REST API over `curl` with a token, if the user supplies one |

For a host with no CLI and no token, treat every gate below that needs one as **unavailable**, not as passed: list which checks you could not run, and get the user's explicit acceptance before Phase 1. An unrunnable gate is a blind spot to disclose, never a gate to skip silently.

**Windows note.** The `filter-branch` fallback is a multi-line POSIX shell script; PowerShell quoting will mangle it. Run it in Git Bash (`bash -lc '…'` or a Git Bash window) — `filter-repo` invocations are safe in either shell.

---

## Phase 0 — Input, identity, and access verification (stop gates)

Do every check your available tools allow. Each failure is a hard stop, not a warning to push past.

1. **Parse the commit URL** into a clone URL, an `owner/repo` path, and a SHA:

   | Host | URL shape | Notes |
   |---|---|---|
   | GitHub | `https://github.com/<owner>/<repo>/commit/<sha>` | also `/pull/<n>/commits/<sha>` — same commit, PR view |
   | GitLab | `https://<host>/<group>/<subgroup>/<repo>/-/commit/<sha>` | everything before `/-/` is the project path |
   | Bitbucket | `https://bitbucket.org/<workspace>/<repo>/commits/<sha>` | plural `commits` |
   | Gitea / Forgejo | `https://<host>/<owner>/<repo>/commit/<sha>` | self-hosted host varies |
   | Azure DevOps | `https://dev.azure.com/<org>/<project>/_git/<repo>/commit/<sha>` | may carry `?refName=` query |

   Strip query strings and fragments. The SHA in a URL is often abbreviated — resolve it to the full hash in step 4. **A commit URL under a fork points at the fork**, not the upstream: the repo path in the URL is the repo you are about to rewrite. Confirm with the user if the path is not the one they named.

2. **Read access + existence** — the cheapest real check:
   ```
   git ls-remote <clone-url>
   ```
   Non-zero exit or an auth prompt → stop. The URL is wrong, the repo is private and you're unauthenticated, or the network is down.

3. **Fresh clone into a scratch directory** — never the user's checkout:
   ```
   git clone <clone-url> <scratch>/<repo>-rewrite
   cd <scratch>/<repo>-rewrite
   ```

4. **The commit exists, and this is the identity on it:**
   ```
   git rev-parse <sha>^{commit}                                   # full SHA; fails if the commit isn't here
   git show -s --format='A: %an <%ae>%nC: %cn <%ce>%nD: %ad / %cd' <sha>
   ```
   Record the full SHA as `TARGET_SHA` and the old email as `OLD_EMAIL`. Show both lines to the user: the author and the committer are frequently *different* identities, and which ones are wrong decides the scope. A `fatal: bad object` here means the commit is not reachable from any fetched ref — it may live only in a PR ref or another fork; stop and ask rather than guessing.

5. **Validate the replacement identity.** An email with no `@`, a display name pasted into the email field, or a placeholder is a stop. If the user wants GitHub's private form, it is exactly `<id>+<login>@users.noreply.github.com`:
   ```
   gh api user -q '"\(.id)+\(.login)@users.noreply.github.com"'
   ```

6. **Hard rule — the new email must belong to the user's account.** This is the gate that decides whether the whole operation achieves anything: a host links a commit to a profile only when the author email is a *verified* address on that account (or its noreply form). Rewrite to an unverified address and the commit still shows an unlinked plain name — the rewrite burned the history for nothing.
   ```
   gh api user/emails -q '.[] | select(.verified) | .email'    # GitHub; needs the user:email scope
   glab api user                                               # GitLab — read `email`; /user/emails lists the rest
   ```
   `glab api` has no field-selection flag: it prints JSON, so read the field yourself rather than piping through a `jq` you haven't confirmed is installed. If the call 403s on scope (`gh auth refresh -s user:email` fixes it) or no CLI exists, declare the gate **unavailable** and tell the user to confirm the address by hand (GitHub: Settings → Emails; GitLab: Preferences → Emails). Not in the verified list → **stop and report it**; do not rewrite to an address the account does not own.

7. **Hard rule — the repo owner must match your git identity.** Rewriting someone else's repo is almost always a wrong clone URL or a colleague's project:
   ```
   git config user.name
   git config user.email
   gh api user -q .login                 # GitHub — the account that will actually push
   glab api user                         # GitLab — read `username`
   ```
   For an org- or group-owned repo the logins won't match by name — fall back to the write-permission check in step 10 as proof. With no host CLI, match `<owner>` against `git config user.name` or the local-part of `git config user.email`. Mismatch → **stop and report it**, naming the repo owner and the local identity side by side; proceed only on explicit user confirmation.

8. **Decide the scope, and count what it costs.** Both numbers go in the confirmation gate.
   ```
   git log --all --format='%H %ae %ce' | grep -c '<OLD_EMAIL>'      # commits carrying the old identity
   git log --all --format='%ae%n%ce' | sort -u                       # every identity in the repo
   git rev-list --all --count                                        # total commits, for the after-check
   ```
   - `--scope commit` → the rewrite set is `TARGET_SHA` alone.
   - `--scope identity` → the rewrite set is every commit above. If that count is greater than one and the user asked for `commit`, **show the number and ask** — leaving nine of ten bad commits in place is rarely the intent.

9. **Blast radius — how many hashes change.** Every descendant of the earliest rewritten commit is re-hashed, and that number, not the number of bad commits, is what the user is actually agreeing to:
   ```
   git branch -a --contains <earliest-rewritten-sha>                       # branches affected
   git tag --contains <earliest-rewritten-sha>                             # tags that move — or go stale
   git rev-list --count --ancestry-path <earliest-rewritten-sha>..<branch> # descendants, per branch
   ```
   `--ancestry-path` is what makes the third command exact: without it the range also counts side-branch commits merged in later, which keep their hashes. The count excludes the commit itself — **add 1**. Run it for each branch from the first command; a rewritten commit on a branch not in that list is impossible, so that list is the complete push set. State the result as `N of M commits change hash`.

10. **Write / admin permission** (needs a host CLI):
    ```
    gh repo view <owner>/<repo> --json viewerPermission,isFork,forkCount
    glab api projects/<url-encoded-path>        # read permissions, forked_from_project, forks_count
    ```
    GitHub: `viewerPermission` must be `WRITE`, `MAINTAIN`, or `ADMIN`; `READ` / `null` → stop, you cannot push. GitLab: the effective `access_level` under `permissions.project_access` (or `permissions.group_access`) must be ≥ `40` (Maintainer) — `30` (Developer) cannot force-push a protected branch. URL-encode the GitLab path: `group/sub/repo` → `group%2Fsub%2Frepo`.

11. **Branch protection** (needs a host CLI) — a force-push to a protected branch is *rejected at push time*, after the rewrite is already done:
    ```
    gh api repos/<owner>/<repo>/branches/<branch>/protection
    glab api projects/<url-encoded-path>/protected_branches/<branch>
    ```
    A `200` with force-push disallowed → stop; the user lifts protection or grants a bypass first (GitHub: Settings → Branches; GitLab: Settings → Repository → Protected branches, field `allow_force_push`). A `404` means unprotected — good.

12. **Open pull / merge requests** (needs a host CLI) — they reference the old hashes and break:
    ```
    gh pr list --repo <owner>/<repo> --state open
    glab mr list --repo <owner>/<repo>          # defaults to open MRs
    ```
    Any open PR/MR whose commits are in the blast radius → surface the list; the user closes or merges them first.

13. **Signatures** — a rewrite invalidates every signature it touches, because the signature covers the identity headers:
    ```
    git log --format='%h %G?' <earliest-rewritten-sha>~1..HEAD      # G good, U untrusted, N none, B bad
    ```
    Any `G`/`U` in range → tell the user those commits come out **unsigned** (`filter-repo` strips the dead signature; `filter-branch` keeps it and the host then renders "Unverified"). Re-signing means re-committing with `-S` afterwards and is not part of this skill.

14. **Forks and other clones** (fork count from step 10). A rewrite cannot reach either. Say both plainly: every forker keeps the old identity, and **any other machine with a clone will push the old history straight back** unless it is reset — the exact command lands in the Phase 7 report.

15. **Confirmation gate.** State exactly what will happen, then get an explicit yes:

    > This will rewrite `<field>` from `<Old Name> <OLD_EMAIL>` to `<New Name> <new@email>` on **N commit(s)** in `<owner>/<repo>`, changing the hash of **M of T commits** across branches `<list>` (and tags `<list>`), then force-push. The old hashes become unreachable from the remote tip (a verified backup is kept locally). Signatures on these commits are lost. Open PRs break; forks and other clones keep the old identity. Proceed?

    No explicit confirmation → stop here. Everything up to this point was read-only.

---

## Phase 1 — Backup (mandatory, verified)

A mirror clone is the rollback path. Make it before touching anything.

```
git clone --mirror <clone-url> <scratch>/<repo>-backup-<shortsha>.git
cd <scratch>/<repo>-backup-<shortsha>.git
git rev-list --all --count            # must be > 0 — record as OLD_COUNT
git show-ref --heads                  # record each branch tip: OLD_SHA per branch
git show -s --format=%T <OLD_SHA>     # record OLD_TREE per branch — Phase 3 compares against it
git fsck --full                       # no missing or broken objects
```

`OLD_TREE` is recorded here, from the backup, because the working clone loses the old objects during Phase 2's cleanup: after that, `git diff <OLD_SHA> HEAD` answers `fatal: bad object`, while comparing tree hashes still proves the content is untouched.

Record every branch tip. Rollback, if ever needed:

```
git push --force <clone-url> <OLD_SHA>:refs/heads/<branch>
```

Report the backup's absolute path. **Never delete it as part of this skill.**

---

## Phase 2 — Rewrite the identity

Run in the working clone from Phase 0 step 3, not in the mirror.

### Preferred: `git filter-repo`

**Scope `identity`** — a mailmap is the exact tool for "this address is really that person", and it covers author, committer, and tagger in one pass:

```
printf '%s\n' 'New Name <new@email> <OLD_EMAIL>' > ../identity.mailmap
git filter-repo --mailmap ../identity.mailmap
```

Add one line per bad address to catch several at once. Names in a mailmap are matched loosely; the email is the reliable key, so key on `OLD_EMAIL`.

**Scope `commit`** — target the single original hash:

```
git filter-repo --commit-callback '
if commit.original_id == b"<TARGET_SHA>":
    commit.author_name     = b"New Name"
    commit.author_email    = b"new@email"
    commit.committer_name  = b"New Name"
    commit.committer_email = b"new@email"
'
```

Drop the two `committer_*` lines for `--field author`, the two `author_*` lines for `--field committer`.

Two behaviours to expect and handle, not to be surprised by:

- **`filter-repo` removes the `origin` remote** after a rewrite, on purpose, so nothing pushes by reflex. Re-add it in Phase 4.
- **It refuses to run outside a fresh clone** unless forced. That refusal is a feature — if you hit it, you are in the wrong directory. Do not reach for `--force` to silence it.

### Fallback: `git filter-branch` (only without `filter-repo`)

In Git Bash. `--` separates filter-branch's options from the rev-list arguments that select refs; `--branches --tags` is what makes it cover the whole repository instead of just `HEAD`.

```
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter '
NEW_NAME="New Name"
NEW_EMAIL="new@email"
OLD_EMAIL="old@email"
# --scope commit: guard on the hash instead — [ "$GIT_COMMIT" = "<TARGET_SHA>" ]
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
  export GIT_AUTHOR_NAME="$NEW_NAME";    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]; then
  export GIT_COMMITTER_NAME="$NEW_NAME"; export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
' -- --branches --tags
```

Then drop the two sets of refs that still point at the old objects. Skip either one and every verification below keeps reporting the old address — from history that is genuinely still there:

```
git for-each-ref --format='%(refname)' refs/original | xargs -n1 git update-ref -d
git remote remove origin                       # refs/remotes/origin/* still hold the old identity
git reflog expire --expire=now --all && git gc --prune=now
```

`filter-branch` rewrites `refs/heads` and `refs/tags` only, so a plain clone keeps a full copy of the old history under `refs/remotes/origin/*`. Dropping the remote is exactly what `filter-repo` does for itself; Phase 4 re-adds it.

Use an exact `=` match on the address. A substring match (`case "$GIT_AUTHOR_EMAIL" in *acme*`) is the right tool only when the user explicitly wants a whole domain rewritten — and then it needs saying out loud, because it will catch addresses nobody listed.

---

## Phase 3 — Verify before pushing

Nothing here touches the remote. Run all five; each one catches a different failure.

```
git log --all --format='%ae%n%ce' | sort -u          # 1. OLD_EMAIL must be gone
git show -s --format='A: %an <%ae>%nC: %cn <%ce>%nD: %ad / %cd' <NEW_SHA>   # 2. target commit
git rev-list --all --count                            # 3. must equal OLD_COUNT
git show -s --format=%T <branch>                      # 4. must equal OLD_TREE, per branch
git log --format='%h %an <%ae>' -5                    # 5. eyeball the tip
```

1. `OLD_EMAIL` still present → some ref still points into the old history: `filter-branch` run without `--branches --tags`, `refs/original` not pruned, or the `origin` remote-tracking refs still in place. Re-run `git log --branches --tags --format='%ae%n%ce' | sort -u` — if *that* is clean, the residue is only in refs you are not pushing, and Phase 2's cleanup was skipped. Fix it and re-check; do not push on a `--all` that still shows the old address.
2. The identity is the new one **and the dates are unchanged**. A changed author date means the wrong tool was used (an interactive rebase, not a filter) — start over from the backup.
3. A different commit count means commits were dropped or merges were flattened. Stop; a filter must not change the shape of the graph.
4. A different tree hash → the file tree changed. This must never happen for an identity rewrite: same tree hash, different commit hash, is the whole shape of a correct result. Stop and restore from the backup.
5. Sanity check by eye before anything irreversible.

Also confirm every branch and tag from Phase 0 step 9 still exists locally (`git branch -a`, `git tag`). A branch that never made it into the working clone will be left un-rewritten on the remote, and the old identity survives through it.

---

## Phase 4 — Force-push (the irreversible step)

The remote is gone by now (`filter-repo` removes it; the fallback's cleanup does too). Re-add it, then push each rewritten branch with a **lease** rather than a bare `--force`, so a commit that landed after your clone aborts the push instead of being destroyed:

```
git remote add origin <clone-url>                                  # removed during Phase 2
git push --force-with-lease=<branch>:<OLD_SHA> origin <branch>     # one line per branch
```

- Rejected as *stale info* → someone pushed after your backup. Stop and re-run from Phase 1 against the new tip. Never switch to `--force` to steamroll it.
- Rejected as *protected branch* → step 11 was skipped or protection was added since; lift it and retry.
- **Tags that contain a rewritten commit moved too.** A lease does not apply to them; push them explicitly and only the ones the user names: `git push --force origin refs/tags/<tag>`. A tag left un-pushed keeps the old identity reachable and the rewrite incomplete; a tag force-pushed after a release changes what that release points at. Name the tradeoff per tag, never batch it.

---

## Phase 5 — Verify on the host

The local repo being right proves nothing about what the remote and the profile page show.

```
git ls-remote origin <branch>                        # tip matches the new local HEAD
gh api repos/<owner>/<repo>/commits/<NEW_SHA> -q '.commit.author.email, .commit.committer.email, .author.login'
glab api projects/<url-encoded-path>/repository/commits/<NEW_SHA>    # read author_email, committer_email
```

- The two emails must be the new address.
- **`.author.login` must not be `null`.** That field is the host's own answer to "is this commit linked to an account" — a non-null login is the proof the attribution worked, and `null` means the email is not verified on the account (back to Phase 0 step 6). It is the single most useful check in this skill, because everything else can be perfect while the commit still shows an unlinked name.
- No host CLI → open the commit page in a browser and check that the avatar and account link render, and state in the report that verification was visual, not programmatic.

---

## Phase 6 — Fix what produced the wrong identity

The wrong email came from a git config, and if it is still there the next commit reintroduces it. Fixing the history without fixing the source is a symptom fix.

```
git config --show-origin --get user.email          # in the user's real checkout — which file set it
git config --global user.email                     # the usual culprit
```

- Wrong globally → `git config --global user.email '<new@email>'` and `user.name`, after confirming with the user.
- Right globally but wrong in one repo → the repo-local value wins; fix it there.
- Several identities on purpose (work and personal) → the durable fix is a conditional include in `~/.gitconfig`, not a per-repo edit that gets forgotten on the next clone:
  ```
  [includeIf "gitdir:~/work/"]
      path = ~/.gitconfig-work
  ```
- If a second machine is involved, the same config is wrong there too. Say so; you cannot fix it from here.

---

## Phase 7 — Report

Close with what happened, the evidence, and what the user must still do by hand:

```text
Repository:   <owner>/<repo>
Rewrite:      <Old Name> <old@email> → <New Name> <new@email>   (author + committer)
Scope:        N commit(s) rewritten; M of T commits changed hash
Branches:     <branch> <OLD_SHA> → <NEW_SHA>   (+ one line per branch)
Tags:         <tag> force-pushed | left at old hash (old identity still reachable)
Content:      tree <OLD_TREE> unchanged — same tree hash before and after, no files changed
Dates:        author/committer dates unchanged
Identities:   git log --all: only <new@email> remains | also <bot@address> (expected)
Backup:       <absolute path to *-backup-*.git>   (verified: OLD_COUNT commits, fsck clean)
Host check:   commit.author.email = <new@email>; author.login = <login> (attribution linked)
Signatures:   N commits lost their signature | none were signed
Config fix:   git config --global user.email now <new@email> | unchanged (was correct)
```

**Manual residuals (cannot be done by command):**

- **Every other clone** — on any other machine, the old history will be pushed back the next time someone commits there. Each one needs, before its next push:
  ```
  git fetch origin && git reset --hard origin/<branch>
  ```
  A stale clone is the single most common way this rewrite silently undoes itself.
- **Open PRs** — close or recreate; they reference commits that no longer exist.
- **Forks** — keep the old identity; a rewrite cannot reach them.
- **Old commits stay reachable by direct SHA** on every major host until its garbage collection runs, and the host will not promise when. If the old address must actually disappear, the reliable paths are a support request (GitHub Support can drop the dangling commits) or deleting and recreating the repository — and for a repo about to be made public, do it **before** publication, not after.
- **A `.mailmap` file does not solve this.** It rewrites what *git's own* output shows locally; the host reads the raw email out of the commit object and displays that. This is why the history has to change.
- **Contribution graph** — GitHub counts a commit toward the profile only when it sits on the default branch (or `gh-pages`) with an email tied to the account. Attribution can be correct on the commit page while the graph takes time to reflect it.
- **Co-author trailers** — `Co-Authored-By:` lines live in the commit *message*, which an identity rewrite does not touch. If the old address appears there too, say so; changing it is a message rewrite (`filter-repo --replace-message`), a separate decision.
- **Backup** — tell the user where it is and that they can delete it once the remote is confirmed good. The skill never deletes it.

## Guardrails

- The user's own checkout is off-limits. All work happens in a fresh scratch clone plus a mirror backup.
- Read-only until the Phase 0 confirmation gate. Everything before it can be safely abandoned.
- Every stop gate is a real stop: an unverified new email, an owner/identity mismatch, no write access, a protected branch, a changed commit count, a non-empty tree diff, or no user confirmation — each halts the skill.
- The two hard rules are absolute: the new email must be verified on the pushing account, and the repo owner must match the local identity. Neither is decided by the agent alone.
- Author and committer are rewritten together unless the user picks one; the blast radius is counted and shown before, not after.
- `--force-with-lease` on branches, never a bare `--force`; tags are force-pushed one at a time, only the ones the user names.
- The backup and any remote ref the user didn't name are never deleted by this skill.
- This re-attributes commits on a repo the user controls, to an identity the user owns. It is not a way to attribute someone else's work to a different person, and the account-ownership gate is what keeps it that way.
