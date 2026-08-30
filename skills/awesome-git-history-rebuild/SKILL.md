---
name: awesome-git-history-rebuild
description: "Erases a repository's git history and rebuilds it as a curated commit series over the same tree: a split plan the user approves (proposed here, or supplied by awesome-commit-plan and validated first), the repo's own commit rules obeyed (commitlint, hooks, CONTRIBUTING), paced timestamps anchorable to the earliest evidenced activity (recovered via awesome-git-history-salvage when refs fall short), signed commits, and safety throughout: a verified mirror backup, a confirmation gate before every irreversible step, a tree-hash proof nothing was lost. It repairs the files describing the erased history (changelog links, badges, pinned shas) and states what the host keeps permanently. Use when asked to 'clean the history and commit it in parts', 'rewrite the history as readable commits', or in Russian 'очистить историю и закоммитить по частям', 'переписать историю для changelog'. Do not use to collapse a history into one commit (awesome-git-history-reset) or to fix commit authorship (awesome-git-author-rewrite)."
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

**NOTHING IRREVERSIBLE UNTIL SIX THINGS HOLD:** write access is confirmed, a mirror backup exists and is verified, the repository's own commit rules are read and obeyed, the user has approved the exact commit plan, the user has answered what happens to the existing tags, releases and contributors sidebar, and the user has confirmed the force-push itself. If any one is missing, stop at that gate.

Five invariants hold throughout:

- **Never operate on the user's existing checkout.** All work happens in a *fresh clone* in a scratch directory. If the result is wrong, the scratch clone is disposable and the user's working copy was never touched.
- **The tree is sacred through Phase 9; only the history is rewritten.** Every tracked path lands in exactly one commit, and the tree must diff clean against the old tip — once locally before the push, and once more in a fresh clone of the remote afterwards. A rebuild that changes a file has failed, however good the log looks. Files whose *content* describes the erased history (a changelog, a badge, a pinned sha) are repaired in Phase 10, as one approved commit on top of the proven tip — never inside the rebuild, and never as a second rewrite.
- **Never invent work that did not happen.** Split along seams that exist in the final tree. A `fix:` commit is honest only when the tree actually carries the fix; a fabricated bug-and-repair arc is a lie in the changelog, and this skill does not write one. See `references/commit-splitting-patterns.md`.
- **The repository's rules outrank this skill's defaults.** If `CONTRIBUTING.md`, a commitlint config, a hook, or the existing log says commits look a certain way, that is the format — always, including when this skill's default is nicer.
- **What survives the rebuild is the user's call, not the run's.** Tags, releases, the contributors sidebar, the tree's own references to the erased history, and the merged pull requests whose commits leave the branch — all five outlive the rewritten branch. Each is asked at gate #1 and executed as answered. "I checked and there was nothing to do" is the failure mode this exists to prevent: an API response is not the rendered page, and a cost the run judges too high is a fact to report, not a decision to take.
- **What the host records is disclosed, never chased.** The force-push, the branch rename and every tag deletion are written to the repository's public activity log, which has no delete endpoint and no documented expiry. The run states that before the push and does not spend a step trying to bury it — an append-only log answers a second rewrite with a second row.

## Invocation

```
/awesome-git-history-rebuild <repository-url-or-path> [branch] [--plan <file>] [--commits N] [--span <duration>] [--sessions N]
                             [--mode story|bisectable] [--tags keep|delete] [--releases keep|delete] [--contributors clean|skip]
                             [--drift fix|disclose] [--merged-prs attribute|skip] [--sign auto|on|off] [--release <version>]
```

- `<repository-url-or-path>` — required. A remote URL (`https://…`, `git@…`) or a local path. A local path with no remote is supported: everything runs except the push. A directory that is not a git repository at all is supported too — there is no history to erase and nothing to compare against, so Phases 1, 8, 9 and 10 are skipped and the skill becomes "initialize with a curated history".
- `[branch]` — optional. Defaults to the **detected** default branch. Never hardcode `main`.
- `--plan <file>` — optional. A commit plan written before this run, usually by `awesome-commit-plan`: commits numbered `#1` to `#N`, each with its message and its exact file set. Given one, Phase 4 **validates and presents** it instead of proposing a split of its own, and Phase 3 narrows to what that validation needs. Without it, the split is built here exactly as before. Ask for a plan file at the start (see below) rather than assuming the user has none.
- `--commits N` — optional target count, ignored under `--plan`. Otherwise proposed from repo size (see the granularity table in `references/commit-splitting-patterns.md`).
- `--span <duration|anchored>` — optional wall-clock length the rebuilt ladder covers, ending at "now" (`4h`, `3d`, `2w`). Default: the span the replaced history actually occupied, measured from the backup. `anchored` instead starts the ladder at the repository's **earliest evidenced activity**, which can predate the history being replaced — the date is recovered in Phase 5, escalating to `awesome-git-history-salvage` when the current refs do not reach far enough. Any span longer than the measured one and not backed by such evidence is backdating and needs a stated reason (Phase 5).
- `--sessions N` — optional number of sittings the span is split into. Default `clamp(round(span ÷ 24 h), 1, 6)`.
- `--mode` — `story` (default: logical layered split; intermediate commits are not guaranteed to build) or `bisectable` (fewer, coarser commits, each verified to build).
- `--tags`, `--releases`, `--contributors`, `--drift`, `--merged-prs` — optional. Pre-answer the five end-state decisions so the run needs no interactive gate for them. **Omitting them does not choose a default: the run must ask** (Phase 0, step 26). There is no "leave it alone" fallback the run may take on its own.
- `--sign auto|on|off` — optional. `auto` (default) signs when the repo, the account or a `required_signatures` ruleset already indicates signing, and asks otherwise. `on` requires a working signing key and fails the preflight without one; `off` is a stated choice, recorded in the report.
- `--release <version>` — optional. After the push, cut this version with the repository's own release tooling. Implies `--tags delete --releases delete` unless those are given explicitly.

If the user invokes the skill without a target, ask for one before doing anything else.

**Ask where the split comes from, once, at the start.** Two paths reach the same Phase 6, and the user picks:

- **A plan file they already have** (`--plan`) — written by `awesome-commit-plan`, or by hand. Its commits are already grouped and worded, and `awesome-commit-plan` additionally proves the ladder builds, which is the property `--mode bisectable` otherwise has to establish here. This run validates it against the tree, presents it as the Phase 4 table, and takes approval on that table like any other.
- **No plan** — the split is proposed here, as it always was. This stays the default when the user has nothing prepared.

Ask before the backup, alongside gate #1, and never assume the absence of `--plan` means the user has no file. A plan that exists and is not used costs the run its cheapest input.

**Five things outlive the rebuild, and none of them is the run's to decide:** what happens to the existing **tags**, to the **releases** attached to them, to the **contributors sidebar**, to the **files whose content describes the erased history** (a generated changelog is the usual one), and to the **merged pull requests** whose commits leave the branch while their records do not. All five are asked at gate #1, before the backup, and executed in Phases 10–12 exactly as answered. A run that reaches Phase 13 having quietly left any of them alone has skipped a decision, not made one.

**One thing outlives it that nobody decides:** the host's own log of the force-push. Phase 0, step 18 states what it keeps and for how long, before the push rather than after it.

## Tooling check (run first)

- `git --version` — required. Everything destructive is plain git.
- **A host CLI** — optional but strongly preferred: `gh` (GitHub) or `glab` (GitLab) verify write permission, branch protection, open pull requests and fork count *before* the destructive step, and are the only way to delete a release. Without one, write access cannot be confirmed until the push itself — say so explicitly and proceed only after the user accepts that blind spot. For Bitbucket, Gitea/Forgejo, Azure DevOps or a plain SSH remote, assume no CLI and treat those gates as **unavailable, not passed**.
- **The repo's own toolchain** (`npm`/`pnpm`, `cargo`, `go`, `python`, …) — needed only in `--mode bisectable` and to validate messages against a commitlint hook. Detect it; never assume it.
- `gitleaks version` — optional. A history being erased is the last chance to notice a secret in it; without gitleaks, report that history was **not** scanned.

Confirm each is on `PATH` (exit 0) before relying on it.

**Shell.** Detect the platform before running anything (`uname -s`, or `$IsWindows` in PowerShell) and pick the shell from that check rather than from habit. The `bash` blocks below are POSIX shell — arithmetic `for ((…))`, `RANDOM`, `awk`, `wc`, `xargs`, `while read` — and PowerShell parses none of it. On Windows run them in Git Bash, which ships with Git for Windows and carries every one of those tools. Where a PowerShell twin is given (the timestamp ladder in Phase 5), the two are equivalent: run the one matching the detected platform, never both.

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
   - `repo` again for deleting releases in Phase 12, and for the branch rename in Phase 11.
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
   gh repo view <owner>/<repo> --json viewerPermission,isFork,parent,forkCount,isArchived,visibility,createdAt
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
    - `tag` rulesets → they govern Phase 12; record them now.

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

14. **Measure the shape of the existing history — the number this whole decision hangs on.** Commit *subjects* are not the signal: a log can be flawless Conventional Commits with scopes and a generated changelog and still be one dump with follow-ups bolted on. What a rebuild fixes is the **distribution of the tree across commits**, so measure it here, before the gate — not in Phase 3, after the backup:
    ```bash
    git rev-list --count <branch>                          # total commits
    git ls-tree -r --name-only <branch> | wc -l            # tracked paths (works in a bare clone too)
    for h in $(git rev-list <branch>); do
      echo "$(git show --name-only --format='' $h | grep -c .) $h $(git log -1 --format=%s $h)"
    done | sort -rn | head -5                              # files per commit, largest first
    git log --format='%an' <branch> | grep -c '\[bot\]'    # bot commits inside that total
    ```
    Run it read-only against the user's existing checkout, or — when only a URL was given and nothing is cloned yet — against a bare clone in scratch (`git clone --bare`, the same one the dry-run push in step 8 needs). Report **concentration** = files in the largest commit ÷ tracked paths. Above ~50%, one commit carries the tree and everything after it is a follow-up — the case this skill exists for, however good the subjects look. Below ~20% with a conventional log, the history is already granular and the user should hear that before approving a rewrite. Report the number and let the user weigh it; never substitute an impression of the subject lines for this measurement.

15. **Hard rule — a second branch with unmerged work stops the run.** Other branches keep the old history reachable, so the "clean history" is incomplete, and they usually hold work about to be stranded:
    ```bash
    git ls-remote --heads <repository-url>
    # per other branch — 0 ahead means <branch> already contains every one of its commits
    gh  api "repos/<owner>/<repo>/compare/<branch>...<other>" --jq '.ahead_by'
    glab api "projects/<url-encoded-path>/repository/compare?from=<branch>&to=<other>" --jq '.commits | length'
    ```
    Classify before stopping. A branch the tip **already contains** — a stale `dependabot/*`, a landed feature branch — strands nothing: list it as debris the user may delete, not as a stop. A branch **ahead by one or more commits** is a real stop: list them and hand the user the choice — continue (only `<branch>` is rebuilt, the others keep pointing into the old history) or abort. Never decide this alone.

    Ask the host, not the local clone: `git branch -r --merged` only sees remote-tracking refs this checkout happens to have fetched, so a branch that was never fetched reads as unmerged and produces exactly the false stop this step exists to avoid. Without a host CLI, fetch the heads first (`git fetch origin 'refs/heads/*:refs/remotes/origin/*'` — it writes remote-tracking refs, the one non-read-only act in this phase) or declare the classification **unavailable** and let the user judge the list.

16. **Pull / merge requests — open ones block, and *all* of them outlive the rebuild:**
    ```
    gh pr list --repo <owner>/<repo> --state open
    gh pr list --repo <owner>/<repo> --state all --limit 100 --json number,state
    glab mr list --repo <owner>/<repo>
    ```
    Any open PR references commits that will not exist. Surface the list; the user closes or merges them first.

    **Every PR record survives the rewrite permanently, and none of them can be deleted.** A pull request is a row in the host's database keyed by repository and number — title, author, timeline, and its own `refs/pull/N/*` refs — and not one of its fields depends on the branch's commit graph. Rewriting `refs/heads/<branch>` cannot reach it. GitHub has no deletion path either: the GraphQL schema carries `deleteIssue`, `deletePullRequestReview` and `deletePullRequestReviewComment` but **no `deletePullRequest`**, and `DELETE /repos/{owner}/{repo}/pulls/{n}` answers `404` because the endpoint does not exist. So **Insights → Pulse keeps listing the merged PRs**, the PR tab keeps its full list, and the only way to clear either is deleting and recreating the repository — which also costs every issue, star, watcher, release and its assets, the Actions history and secrets, the traffic stats and the creation date. Say this at gate #1, in those terms, because a user who asked for a clean history usually believes it covers this too.

    Those refs are also the reason the wipe is never total. Count the refs, then count what they keep alive that the branch does not. Run the fetch in the scratch bare clone from step 14, never in the user's checkout — it writes twenty-odd remote-tracking refs, the same non-read-only exception step 15 already carves out, and it does not belong in a working copy the user has to live with:
    ```bash
    git ls-remote origin 'refs/pull/*' | wc -l
    git fetch origin 'refs/pull/*/head:refs/remotes/pr/*'
    refs=$(git for-each-ref --format='%(refname)' refs/remotes/pr)
    git rev-list $refs --not <branch> | wc -l                       # commits still served, absent from the tip
    git rev-list $refs --not <branch> | tail -1 | xargs git log -1 --format='%h %ad %s' --date=short
    git rev-list $refs --not <branch> | while read h; do git log -1 --format='%an <%ae>' $h; done | sort | uniq -c
    ```
    Report all three. Old commits reachable this way are what defeats the contributors cleanup in Phase 11 — a bot or a co-author whose commits sit on a PR ref stays reachable no matter how the branch is rebuilt.

    **They are also permanent, which is the part users do not expect.** `refs/pull/N/head` is a ref, so everything it reaches is *reachable*, and garbage collection by definition never touches it. A PR branched off the old tip drags its whole ancestry along: in a measured case, 20 PR refs kept **88** commits of an erased history alive — back to its original `Initial commit` — retrievable in perpetuity by anyone who runs `git fetch origin 'refs/pull/*/head:refs/pr/*'`. Quote the count and the oldest subject at gate #1: it is the honest ceiling on "the old history is gone".

    **Merged PRs are real work whose record survives while its commits do not — offer to reconcile them.** The rebuild re-authors the tree to one identity, so a `dependabot[bot]` PR that reads "Merged commit `abc1234` into `<branch>`" points at a commit the branch no longer contains, while the bumped version it produced sits in the lockfile of the new history with nobody's name on it. That contradiction is visible on the PR page itself, without any forensics. Two things can honestly be done, and the choice is decision #5 at step 26:

    - **Carry the outcome into the plan.** Group the paths that hold each merged PR's result — the manifest and lockfile for a dependency bump, the workflow file for an action bump — into their own commit, crediting the bot and naming the PR numbers:
      ```text
      chore(deps): bump the dependencies dependabot opened PRs for

      Refs: #15, #16, #17, #18, #19, #20
      Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
      ```
      Read the bot's exact address out of the old history (`git -C <backup> log --format='%an <%ae>' | grep '\[bot\]' | sort -u`); never type a noreply id from memory. The same shape works for any merged human PR whose result is identifiable in the final tree.
    - **What cannot be done, so do not offer it:** a merged PR cannot be re-pointed, re-merged, renumbered or recreated under its own number — the record is keyed to the repository and the number, and no API writes it. Synthesizing a merge commit for a diff the final tree does not contain is inventing history, the same rule that forbids fabricated `fix:` arcs. A bump whose *before* state exists nowhere in the tree can be attributed, never re-enacted.

17. **Forks** (`forkCount` / `forks_count` from step 7). Above zero → say plainly that every forker keeps the old history and the rewrite cannot reach them.

18. **The host's record of the rewrite — public, permanent, and not deletable.** A force-push is logged by the host independently of the commit graph, so "the history is clean" is a true statement about `git log` and a false one about the repository page. Read the log now, so the numbers at gate #1 are measured rather than asserted:

    ```bash
    gh api "repos/<owner>/<repo>/activity?per_page=100" \
      --jq '.[] | "\(.timestamp) \(.activity_type) \(.ref) \(.before[0:7])..\(.after[0:7])"'
    curl -s "https://archive.softwareheritage.org/api/1/origin/<repository-url>/visits/"   # third-party snapshot?
    ```

    Four records, three of which never expire:

    - **The activity log** (`/repos/{owner}/{repo}/activity`, rendered at **Insights → Activity**) keeps every `push`, `force_push`, `branch_creation`, `branch_deletion` and `pr_merge` with both SHAs and the actor — including the rows this run is about to add, the Phase 11 branch rename, and every tag deletion Phase 12 performs. There is no delete endpoint, the reference documents no retention window, its `time_period` filter accepts `year`, and a repository months old returns rows back to its creation. It is world-readable on a public repo. **Nothing overwrites it, either:** an append-only log answers a second rewrite with a second `force_push` row, so an attempt to bury the first doubles the evidence. Do not spend a step on it — state it.
    - **The events feed** (`/repos/{owner}/{repo}/events`, the account's public feed, the Atom feeds) carries the same pushes with a **30-day** window since 2025-01-30. That one does expire, and it is the only part that does.
    - **The organization audit log** keeps its own `git.push` entries on org-owned repositories, under the org's retention and outside the user's control.
    - **Third-party copies** — Software Heritage, a GitLab/Codeberg mirror the repo pushes to itself, any existing clone — hold the pre-rewrite history beyond the host's reach entirely. A mirror the repo's own CI maintains will happily receive the rewritten history *and* keep serving whatever it already had unless it prunes; check both sides.

    Deleting and recreating the repository is the only thing that clears the activity log, and it costs everything step 16 lists plus the creation date — which is itself evidence, since a repository whose first commit predates its own creation date reads as a rebuild at a glance. It is not a cleanup step; do not offer it as one.

19. **What the push will set off.** A force-push of N commits is not a quiet event: it fires webhooks, can start a CI run per commit, and on some setups deploys. Read the triggers before pushing:
    ```
    grep -rl 'on:' .github/workflows/ | xargs grep -l 'push'      # which workflows react to a push
    ```
    Then say plainly what will happen: how many workflow runs, whether any of them deploys or publishes, whether a mirror job will re-push elsewhere, and whether the branch backs GitHub Pages (a force-push republishes the site). If a push triggers a deploy or a publish, that is a decision for the user, not a side effect to discover afterwards.

20. **Hard rule — more than one *human* author in the history stops the run.** A rebuild re-authors *everything* to the person running it:
    ```
    git log --format='%an <%ae>' <branch> | sort | uniq -c | sort -rn
    ```
    Split the result before judging it. **Bots have no attribution to erase** — `dependabot[bot]`, `github-actions[bot]`, `renovate[bot]`, anything whose name ends in `[bot]` or whose address is an app's `users.noreply.github.com` alias: report their commit count as a matrix line and move on. Two or more **human** authors → **stop**. Erasing someone else's commits erases their attribution, breaks a DCO/CLA audit trail, and in a repo that took outside contributions is not the user's call to make alone. Continue only if the user explicitly confirms they own or have permission for every contribution, and offer the honest alternative: keep the other authors as `Co-authored-by:` trailers on the commits that carry their code (`references/repo-convention-discovery.md` has the trailer format).

21. **Tags, releases and what deleting them would cost** — the facts behind the step 26 decision, gathered before the gate rather than argued after the push:

    ```bash
    git ls-remote --tags <repository-url>
    gh release list --repo <owner>/<repo>                       # tag, latest flag, published date
    gh release view <tag> --repo <owner>/<repo> --json assets --jq '.assets[] | "\(.name) \(.downloadCount)"'
    glab release list --repo <owner>/<repo>
    ```

    Three findings, each of which changes the answer the user should give:

    - **Immutable-registry publication.** If any tag matches a version published to npm, PyPI, crates.io, the Go module proxy, Maven Central or NuGet, deleting or moving it is a **hard stop** in Phase 11: those registries freeze a version to a content hash, and a re-tagged version makes consumers fail checksum verification rather than upgrade. Check the name rather than assuming (`https://registry.npmjs.org/<name>`, `https://index.crates.io/…`); a manifest with `private: true` or `publish = false` settles it too.
    - **Uploaded assets and their download counts**, per release. They do not come back — a mirror backup restores tags, never a release object or its binaries.
    - **Anything that reads "the latest release"** — an auto-updater endpoint (Tauri, Sparkle, electron-updater), an install script, a docs badge. Deleting every release breaks it until a new one is cut. Grep the tree for the updater endpoint before claiming otherwise.

    Note all three now, quote them at step 26, enforce the hard stop in Phase 12.

22. **References to the erased history inside the tree that survives it.** The rebuild keeps every file byte-for-byte — including the files whose *content* is a claim about the history. Those do not break loudly. They keep rendering, with links that 404, versions nothing points at, and dates that contradict the log beside them. Two of the step 26 answers depend on this list, so build it here.

    ```bash
    # commit shas quoted anywhere in the tree — then ask which of them the new history will still contain
    git grep -hoE '\b[0-9a-f]{7,40}\b' -- ':!*.lock' ':!*lock.yaml' ':!*lock.json' ':!*.sum' | sort -u |
      while read s; do git cat-file -e "$s^{commit}" 2>/dev/null && echo "$s $(git log -1 --format=%s $s)"; done
    # links that resolve against the host rather than against git
    git grep -nE '/(commit|compare|releases/tag|releases/download)/' -- '*.md' '*.json' '*.ya?ml' '*.cff' '*.toml'
    # badges whose content comes from a release that Phase 12 may delete
    git grep -nE 'shields\.io/github/(v/release|downloads|release-date|commits-since)'
    # version claims a tag deletion would strand
    git grep -nE '"version"|^version *=|^version:' -- package.json Cargo.toml pyproject.toml '*.cff'
    ```

    What turns up, and what leaving it costs:

    - **`CHANGELOG.md` — the usual worst case, and the one that indicts the rebuild by itself.** A generated changelog is a list of commit links and `compare/vA...vB` URLs; after the rewrite every one of them 404s against the repository that ships them. Its headings also describe releases whose tags Phase 12 may be about to delete, and it carries dates: a changelog entry for a release on the 27th, inside a tree whose commit adding the release tooling is dated the 28th, is a self-refuting pair any reader hits without opening an API.
    - **README and docs badges** — `v/release`, download counts, "latest release" links. Deleting the releases empties them; they render as `no releases`, not as an error anyone notices in review.
    - **`CITATION.cff`** (`commit:`, `version:`, `date-released:`), **`SECURITY.md`** supported-version tables, issue templates that enumerate versions, a docs page quoting a tag.
    - **Self-referencing pins — these break at runtime, not just visually.** `uses: <owner>/<repo>@<sha>` in the repo's own workflows, a `.pre-commit-config.yaml` `rev:` pointing at this repo, an install script curling `raw.githubusercontent.com/<owner>/<repo>/<sha>/…`, a Go pseudo-version naming a commit. A sha that leaves the history takes the thing that pins it with it.
    - **Manifest version versus the tags about to go.** `package.json` at `0.2.0` with `v0.2.0` deleted leaves the repository claiming a version nothing points at.

    **Then check chronology, not just links.** Sort the planned commit dates against every date written *inside* the tree — changelog headings, release notes, `date-released`, dated docs and runbooks. A commit dated after the artifact it is supposed to have produced is the tell no timestamp model repairs, and it is cheap to avoid while the plan is still a table. Report each conflicting pair; a plan that cannot be ordered to satisfy them is a plan to re-split in Phase 4, not a line in the final report.

    Repairing any of this changes file content, which Phase 9's tree-identity proof forbids inside the rebuild. It happens in **Phase 10**, as its own commit on top of the proven tip — decision #4 at step 26.

23. **Secret scan of the history being discarded** (if `gitleaks` is present) — this is the last moment anyone will look at those commits:
    ```
    gitleaks git . --no-banner
    ```
    Findings → stop and tell the user to **rotate** the exposed credential. The rewrite does not make a leaked secret unrecoverable — forks, caches and existing clones keep it — so rotation is the part that protects them. No gitleaks → state that history was not scanned.

### E — Local capacity

24. **Room and limits on this machine.** Three copies of the repository exist during the run (the user's checkout, the mirror backup, the scratch clone), plus a fourth for the Phase 9 verification clone. Check free disk against `du -sh .git` before starting. Also check what the host will refuse to accept: GitHub rejects any single file over 100 MB and warns above 50 MB, and a push over ~2 GB fails outright.
    ```
    git -C <repo> rev-list --objects --all | git -C <repo> cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' | awk '$1=="blob" && $2>52428800'
    ```
    A hit means those blobs are already in the history (grandfathered or LFS) — confirm LFS is configured before re-pushing them, or the rebuild's push is the moment the limit is enforced. Keep the scratch clone and the backup **outside** the repository being rewritten.

### F — The gate

25. **Report the preflight matrix, then confirm.** List every check as `pass` / `fail` / **`unavailable`** — an unrunnable check is a disclosed blind spot, never a silent pass:

    ```text
    identity <name> <email> (from <config file>) · credential <account> via <ssh|https> · scopes <list>
    owner match ✓ · write ✓ (API + dry-run push) · archived ✗ · mirror ✗
    protection: none · rulesets: <none | required_signatures | …> · push rules: <none | unavailable>
    signing <key type, host knows it | none configured | required by ruleset>
    history <N> commits · largest commit <F>/<T> tracked paths (<P>%) · bot commits <B>
    branches 1 (+<M> merged, strand nothing) · open PRs 0 · forks 3
    PR records <N> — survive permanently, undeletable; Pulse and the PR tab keep showing them
    refs/pull/* <N> keeping <C> commits permanently reachable, oldest <sha> "<subject>" <date> — GC never collects them
    merged PRs <N> · reconcilable via attribution: <yes: paths … | no: outcome not identifiable in the tree>
    human authors 1 · bot authors <list> · push triggers <N workflows, deploys?>
    host record: activity log permanent (<N> force_push rows already) · events 30 d · audit log <org|n/a>
                 third-party copies <none | Software Heritage <date> | mirror <url>>
    tree references: <N> shas quoted (<M> leave the history) · <N> host links · badges <list> · pins <list>
    chronology: <consistent | CHANGELOG 0.2.0 dated 08-27 vs planned release-tooling commit 08-28>
    tags <list> · releases <N> (assets <n>, downloads <n>) · registry-published <none|list> · reads-latest-release <updater|none>
    ```

26. **Collect the five end-state decisions — before the backup, not after the push.** The rebuild replaces a branch; it does not replace what hangs off the old history. Five things survive it, each is the user's call, each is irreversible or outward-facing, and each is far cheaper to answer now than to discover in Phase 13. Ask all five together with gate #1, quote the step-21 and step-22 findings as the cost, and carry the answers verbatim into Phases 10–12.

    - **Tags** — delete every tag that points into the old history, delete a named subset, or keep them. Say what keeping costs: those tags hold the old commits reachable, so the wipe is not total, and a tag that is no longer an ancestor of the new tip breaks any tooling that computes a range from the last release (`git describe`, changelog generators, "commits since"). Say what deleting costs: the hard stop of step 21 applies per tag, and a tag cannot be re-pointed honestly at a rebuilt commit that was never the tree that release shipped.
    - **Releases** — delete the releases attached to those tags, or keep them. Per release, state the cost **before** the answer: the uploaded assets and their download counts are gone for good, the mirror backup restores the tag but never the release object, and anything reading "the latest release" finds nothing until a new one is cut.
    - **Contributors sidebar** — run the Phase 11 cache rebuild after the push, or leave it. Say plainly that the push is the only moment it is cheap, and that **no API call can answer this question**: `repos/<owner>/<repo>/contributors` and the rendered sidebar are fed by different caches, so a clean API read is not evidence the page is clean. Only the user can open `https://github.com/<owner>/<repo>` and see who is still listed there.
    - **Tree references (decision #4)** — repair the step-22 findings in a Phase 10 commit on top, or leave them and disclose. Name the files and what each currently claims. Say what repairing costs: one extra commit that changes content, visible in the log and approved as its own diff, and a regenerated changelog that no longer matches the release notes already published on the host. Say what leaving costs: a changelog whose every commit link 404s against its own repository, badges reading `no releases`, pins that break at runtime, and any date conflict found in step 22 sitting in the tree permanently. A generated file is the cheap case — the tooling rewrites it; a hand-written one is the user's text and this skill does not reword it.
    - **Merged pull requests (decision #5)** — carry their outcome into the plan with attribution and `Refs: #N` trailers, or leave the records contradicting the new history. Quote the count from step 16 and which PRs have an identifiable result in the final tree. Say what attributing costs: nothing but a commit boundary the plan has to respect. Say what leaving costs: `<N>` PR pages that permanently claim a merge into a branch whose history does not contain it, and bot or contributor work that the new log credits to one identity.

    **None of these has a default the run may take.** Silence is not "keep", a clean API read is not "nothing to clear", and a cost the run judges too high is not a decision — it is a fact to state and hand over. Record all five answers verbatim in the Phase 13 report; a deferred answer is reported as deferred, never as a choice.

27. **Confirmation gate #1.** State the scope and the measured shape, then take the decision through the agent's **structured-question UI** — every gate in this skill is asked that way, never as a paragraph ending in a question mark. Proceed / stop is one question; the five end-state decisions are their own questions with their costs as the option descriptions, so the user picks rather than composes a reply. A gate answered in free prose is a gate whose record is a sentence someone has to re-read to know what was agreed:

    > This will erase all `N` commits on `<branch>` of `<owner>/<repo>` and replace them with a rebuilt series over the identical file tree. `<F>` of `<T>` tracked paths currently land in one commit (`<subject>`).
    >
    > What it will **not** touch, and cannot: `<N>` pull request records and their Insights → Pulse history — undeletable — and `<C>` commits that stay permanently reachable through `refs/pull/*`, oldest `<sha> "<subject>" <date>`. The force-push itself is written to this repository's public activity log (`Insights → Activity`), which has no delete endpoint and no expiry; the 30-day events feed is the only part that ages out. `<N>` third-party copies already hold the old history.
    >
    > Nothing is touched yet — the next steps are a verified backup and a read-only analysis, and you will approve the exact commit list before anything is pushed. Proceed? And: tags — `<delete | keep>`? releases — `<delete | keep>` (`<N>` releases, `<n>` assets, `<n>` downloads)? contributors sidebar — `<clean | leave>`? tree references — `<repair in a follow-up commit | leave and disclose>` (`<file list>`)? merged PRs — `<attribute in the plan | leave>` (`<N>`)?

    The PR-and-activity paragraph is a disclosure, not a sixth decision — there is no action to offer, which is exactly why it has to be said before the backup rather than discovered in Phase 13.

    Report the facts — the concentration number, every stop gate, what the push sets off, what each of the five end-state answers costs, and what the host logs permanently — and let the user weigh them. The user invoked this skill on purpose: a low concentration number is a finding to state plainly, not a case to argue, and an impression that "the log already looks conventional" is not a finding at all.

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

**Sign-off:** a DCO check means every rebuilt commit needs `-s`.

**Signing — the one property of a rebuild a reader can verify cryptographically, and the default this skill argues for.** A signature covers the commit object; every object here is new, so the old signatures do not survive under any strategy. That leaves two outcomes and they are not equivalent: a rebuild that signs replaces a Verified history with a Verified history, and one that does not hands anyone reading it a whole log of `"verified": false` — a single API field that summarises the rewrite more compactly than any other check. Signing is honest here precisely because it makes no claim about the past: it attests that *this* identity made *these* objects, which is exactly what happened.

Detect what the repository and the account already do, then decide:

```bash
git config --get commit.gpgsign; git config --get gpg.format; git config --get user.signingkey
gh api "repos/<owner>/<repo>/commits?per_page=30" --jq '.[].commit.verification.verified' | sort | uniq -c
ssh-add -l                                     # SSH signing keys the agent holds
gpg --list-secret-keys --keyid-format=long     # GPG keys
gh api user/ssh_signing_keys --jq '.[].title'  # keys the host will actually trust for signatures
```

- A `required_signatures` ruleset (step 11) makes signing **mandatory** — the push is rejected without it, so this is settled before Phase 4, not discovered at Phase 8.
- `--sign on` with no usable key is a preflight failure, not a fallback to unsigned.
- **A key the host does not know produces `Unverified` on every commit, which is worse than plain unsigned.** For SSH signing the key must be registered as a *signing* key, not only as an authentication key — they are separate lists on GitHub, and the same public key in the wrong one silently yields `Unverified`. Confirm with `gh api user/ssh_signing_keys` before committing 30 objects.
- Signing costs a passphrase prompt per commit unless the agent holds the key; load it before Phase 6 rather than answering 30 prompts.

Whatever is chosen, Phase 7 verifies it against the objects (`%G?`) and Phase 9 verifies it against the host — never by assumption.

---

## Phase 3 — Analyze the source

Read the tree that will be committed. The unit of analysis is the tracked path, and the output is a module map the split is derived from.

**Under `--plan`, this phase narrows but does not disappear.** The grouping is already decided, so steps 3 to 5 are not needed to *build* one — but step 1 is what proves the plan covers the tree that is actually here, and step 2 is what catches a plan written against a different revision. Run steps 1 and 2, skip the rest, and say in the report that the map was not rebuilt.

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

## Phase 4 — Propose or validate the commit plan (approval loop)

### With `--plan` — validate what was supplied

A plan file is an input, not an authority. It was written against a tree, and this run has to prove it is *this* tree. Parse it into rows of `#N`, subject, body, path set, then check all five before showing anything:

1. **Coverage against the real tree.** Set-difference the plan's paths against `git ls-files`. Report both directions verbatim:
   ```bash
   comm -23 <(git ls-files | sort) <(plan_paths | sort)     # in the tree, not in the plan
   comm -13 <(git ls-files | sort) <(plan_paths | sort)     # in the plan, not in the tree
   ```
   Either list non-empty is a **stop**. A path missing from the plan would never be committed; a path in the plan that does not exist means the plan predates the current tree, and every row after it is suspect. Offer the two honest options: regenerate the plan with `awesome-commit-plan` against this revision, or hand-patch the named rows and re-validate.
2. **No path assigned twice** without a slice note. A duplicate assignment silently drops the earlier version.
3. **Order satisfies dependency direction.** Read the imports (Phase 3, step 3) and check that no file lands before something it imports. A violation is not fatal — it is a warning that `--mode bisectable` will turn into a failed build at that commit — so name the row and let the user decide.
4. **Messages pass the repository's own rules.** Feed every subject through the validator found in Phase 2 (`commitlint`, a `commit-msg` hook, a server-side pattern from step 11). A message the hook rejects is caught here, in a text file, not at commit 14 of the replay.
5. **The types are honest against this tree.** A `fix:` row whose paths carry no fix, a `perf:` row with no such artifact — Phase 3's seam rule applies to a supplied plan exactly as it does to a generated one.

Then present the parsed plan as the same table below, marked as *supplied*, and take the same approval. The user may still adjust or re-split; a re-split abandons the file and builds the plan here, which the report records.

**What the plan file does not carry, and this run still decides:** timestamps and pacing (Phase 5 — a plan file has no dates by design), signing, sign-off, trailers, and every gate-#1 answer. A supplied plan shortens Phase 4, not the ceremony around it.

### Without `--plan` — build one

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
- **Mode and pacing** — `story` or `bisectable`, plus the span and session count about to be used, and whether the span was measured from the old history or chosen by the user.
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
  - **F. Manual** — the user supplies or edits the grouping directly; this skill only validates coverage and message format. A plan file passed with `--plan` is this strategy, already written down.

Never proceed on silence or a vague "looks fine" — the approval must name the table.

---

## Phase 5 — Pacing and timestamps

Commits created in a loop share one timestamp to the second, which is the first thing that makes a rebuilt history unreadable as a sequence. A flat random band fixes only half of it: the metronome goes, and what is left is a distribution no real work has ever produced.

**Measured — a 33-commit rebuild on a flat 3–6 minute band, against the 39-commit history it replaced:**

```text
                    rebuilt (flat band)      the history it replaced
gap min                       194 s                     2 s
gap max                       355 s                64 741 s   (18 hours)
gap mean                      274 s                 4 639 s
```

Real work is bursty. A typo fix lands two seconds after the commit before it, then nothing happens until the next morning. A ladder whose widest gap is under six minutes across a whole project says "generated" more loudly than a shared timestamp does. **Model sessions, not a band.**

Three questions:

1. **Span** — how long the ladder covers, ending at "now". Offer all three, in this order, and say which evidence backs each:

   - **A. Measured (default)** — the wall-clock span of the history being replaced (`last author date − first author date`, read from the backup made in Phase 1). The one thing about the timing that is not invented: it is how long the work in *this* history took.
   - **B. Anchored to the repository's earliest evidenced activity** — the ladder starts at the first date the repository can be shown to have existed, which is often earlier than anything the backup reaches. Use it when the current history is not the repository's first: a history erased once before, a squash that collapsed months into one commit, an import. Recovering that date is step 1a below.
   - **C. Stated by the user** — any duration. Longer than A or B without evidence is backdating; take it if the user asks, and record in the report that it was chosen rather than measured.

   A repository with no history to measure has neither A nor B from git alone — B may still work from the host, and if both come back empty, ask for the span outright rather than picking one.

   **Step 1a — recover the earliest date, cheapest source first.** Stop at the first one that answers; each later source costs more and reaches further back:

   | Source | Command | What it proves |
   | --- | --- | --- |
   | The backup | `git -C <backup> log --reverse --format='%ad' --date=iso <branch> \| head -1` | first commit of the history being replaced |
   | Every ref in the backup, not just the branch | `git -C <backup> log --reverse --all --format='%ad' --date=iso \| head -1` | an older commit on a tag or another branch |
   | `refs/pull/*` | already fetched in Phase 0, step 16 — reuse `git rev-list $refs --not <branch> \| tail -1 \| xargs git log -1 --format='%ad' --date=iso` | commits kept alive by pull-request refs, frequently older than the branch |
   | Repository creation | `gh repo view <owner>/<repo> --json createdAt` (step 7 already fetches it) | when the repository was made — a floor for anything not imported |
   | The activity log | `gh api "repos/<owner>/<repo>/activity?per_page=100" --jq '.[-1].timestamp'` | the oldest push the host still records |
   | Erased history | **`awesome-git-history-salvage`** | commits no ref reaches: the `before` SHAs in the activity log, fetched by SHA over the git protocol |

   **When the cheap sources disagree with each other, that disagreement is the finding.** A repository created in April whose oldest reachable commit is dated August has had something erased between the two, and that gap is exactly what salvage reads. Report both dates and offer the escalation rather than silently taking the later one.

   **Escalating to salvage.** Run `awesome-git-history-salvage` against the same repository. It is read-only and needs no gate of its own, it reconstructs every commit the repository has ever held from the activity log and the PR refs, and it returns their dates. Take its earliest and use it as the anchor. Two limits belong in the report: the activity log is what makes it possible, so a repository whose erased history predates the log's coverage cannot be reached this way, and a salvage that returns nothing is a fact to state, not a reason to invent a date.

   **The anchor is evidence, not permission.** Starting the ladder at a date the repository can be shown to have existed is honest. Starting it earlier, or anchoring to a date salvage did not actually return, is backdating with extra steps — and the first commit of the rebuilt series carries that date forever, in a field anyone can read.

2. **Sessions** — how many sittings the span is split into. Default `clamp(round(span ÷ 24 h), 1, 6)`, roughly one per day. Gaps inside a sitting are minutes; gaps between sittings are hours.
3. **How the gap is applied** — *synthetic* (default: dates computed on a ladder, nothing waits) or *real* (the run sleeps between commits; only viable for a handful of commits at a short pace).

In-session gaps come from a mixture rather than a uniform range — mostly short, occasionally long. Session breaks are inserted on top, and the whole ladder is scaled to the chosen span:

```bash
N=<commit count>; SPAN=<seconds>; SESSIONS=<S>      # the last commit lands at "now"

# One draw: ~55% under 4 min, ~30% under 20 min, ~12% under 75 min, ~3% up to 3 h.
draw() { local r=$((RANDOM % 100))
  if   [ $r -lt 55 ]; then echo $((  30 + RANDOM %  211))
  elif [ $r -lt 85 ]; then echo $(( 240 + RANDOM %  961))
  elif [ $r -lt 97 ]; then echo $((1200 + RANDOM % 3301))
  else                     echo $((4500 + RANDOM % 6301)); fi; }

gaps=(); for ((i=1;i<N;i++)); do gaps[i]=$(draw); done

# SESSIONS-1 of those gaps become overnight breaks, spread evenly so two never touch.
for ((s=1;s<SESSIONS;s++)); do gaps[$(( s * N / SESSIONS ))]=$(( 3*3600 + RANDOM % (13*3600) )); done

# Scale the shape to the requested span, then start the ladder that far back.
raw=0; for ((i=1;i<N;i++)); do raw=$((raw + gaps[i])); done
total=0; for ((i=1;i<N;i++)); do gaps[i]=$(( gaps[i] * SPAN / raw )); total=$((total + gaps[i])); done
T=$(( $(date +%s) - total ))
OFF=$(git log -1 --format=%ad --date=format:%z 2>/dev/null || echo +0000)

# per commit i:  commit, then advance
GIT_AUTHOR_DATE="@$T $OFF" GIT_COMMITTER_DATE="@$T $OFF" git commit -m "<subject>"
T=$(( T + ${gaps[$i]:-0} ))
```

```powershell
# Same ladder, same arithmetic; only the date plumbing differs.
$t   = [int][double]::Parse((Get-Date -UFormat %s)) - $total
$off = (Get-Date -Format zzz) -replace ':',''
$env:GIT_AUTHOR_DATE = "@$t $off"; $env:GIT_COMMITTER_DATE = $env:GIT_AUTHOR_DATE
```

`@<epoch> <offset>` is git's portable date form — no `date -d` versus `date -r` split between GNU and BSD. Take the offset from the old history rather than from the machine: a rebuild whose timezone differs from every commit it replaced announces itself.

**Both date fields move together.** `GIT_AUTHOR_DATE` alone leaves the committer date at the real clock, which lands the whole series on today and splits the log into two timelines — the ladder in `%ad`, one clustered instant in `%cd`. Setting both keeps the commit objects internally consistent with the plan the user approved, and it is what every date-rewriting tool (`filter-branch`, `filter-repo --commit-callback`, `rebase --committer-date-is-author-date`) does. Read them back in Phase 7 with `git log --format='%h %ad %cd'`; both fields carry the same ladder, so both are checked against it.

**Verify the shape in Phase 7, against the backup** — the model is worth nothing if it was not applied:

```bash
span() { git ${1:+-C "$1"} log --reverse --format='%at' ${2:-HEAD} |
         awk 'NR>1{d=$1-p; if(!n||d<mn)mn=d; if(d>mx)mx=d; s+=d; n++} {p=$1}
              END{print "min="mn"s max="mx"s mean="int(s/n)"s n="n}'; }
span                       # rebuilt
span <backup> main         # what it replaced
```

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
GIT_AUTHOR_DATE="@$T $OFF" GIT_COMMITTER_DATE="@$T $OFF" git commit -m "<subject>" [-m "<body>"] [-s] [-S]
```

Both date fields come from the Phase 5 ladder. `-S` when signing was chosen or a ruleset requires it — and if the plan carries merged-PR attribution (decision #5), those rows get their `Refs:` and `Co-authored-by:` trailers as `-m` bodies here, not bolted on afterwards.

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
git log --format='%ad' --date=iso        # strictly increasing; run the Phase 5 `span` check against the backup
git log --format='%ad %cd' --date=iso |  # both fields carry the same ladder — no commit left on the real clock
  awk '$1" "$2 != $3" "$4 {n++} END{print n+0" commits where ad != cd (expect 0)"}'
git log --format='%G?' | sort | uniq -c  # if signing: every line G, never N — U means the host will show Unverified
git log --format='%an <%ae>' | sort -u   # exactly the intended identity (plus co-authors, if any)
git log --format='%s' | <validator>      # every subject passes the repo's own commit lint
```

Two content checks belong here as well, because both are free to fix now and permanent after the push:

```bash
# every sha quoted in the tree still resolves in the history about to be published (step 22's list)
git grep -hoE '\b[0-9a-f]{7,40}\b' -- ':!*.lock' ':!*lock.yaml' ':!*.sum' | sort -u |
  while read s; do git cat-file -e "$s^{commit}" 2>/dev/null || echo "dangling: $s"; done
# no commit is dated after an artifact in the tree that it is supposed to have produced
git log --format='%h %ad %s' --date=short | grep -iE 'release|changelog|version'
```

Dangling references and chronology conflicts are **not** hard stops — the tree is not editable here by design — but they must be quoted back to the user now, because Phase 10 is the only place they get fixed and its answer was given at gate #1 on a list that this check either confirms or corrects.

`git diff <OLD_SHA> HEAD` printing anything is a hard stop: the rebuild changed a file. Usually an ignored or untracked path that `git add` did or did not pick up, or a formatter hook that rewrote a file mid-replay. Fix the cause and replay; never push a tree that differs from what was there.

If the repo has changelog tooling, run its dry run now (`npx commit-and-tag-version --dry-run`, `npx release-please …`, `git cliff --unreleased`) and show the user the notes their new history produces. This is the deliverable they asked for — confirm it reads well *before* the push, when regrouping is still free.

---

## Phase 8 — Force-push (the irreversible step)

**Confirmation gate #2 — the last one before anything irreversible.** Quote the exact numbers back, then ask through the **structured-question UI**: *push now* · *stop and keep the local rebuild* · *show the commit list again first*. This is the point of no return for a shared remote, and "confirm the push and I'll run it" is the weakest possible way to ask for it — it reads as narration, it can be answered by a passing "ok", and it leaves no record of which of the three the user meant:

> Pushing replaces `<N_old>` commits on `<branch>` of `<owner>/<repo>` with `<N_new>` rebuilt commits (`<OLD_SHA>` → `<NEW_SHA>`). The old commits become unreachable from the remote tip; the verified backup at `<path>` is the only way back. Open PRs break; forks keep the old history. Proceed?

```
git push --force-with-lease=<branch>:<OLD_SHA> origin <branch>
git ls-remote origin <branch>            # sha equals the new HEAD
```

`--force-with-lease`, never a bare `--force`: it aborts if someone pushed after the backup was taken. Rejected as *stale info* → a new commit landed; stop and restart from Phase 1 against the new tip rather than steamrolling it. Rejected as *protected branch*, *non-fast-forward* or *unsigned commit* → a protection or ruleset gate (Phase 0, steps 10–11) was skipped or has been added since.

---

## Phase 9 — Prove the published tree matches the old one

Phase 7 proved the *local* rebuild. This proves what the host actually serves — a separate fact, and the one the user cares about: after the republication, is the code on the remote still exactly the code that was there before the history was erased. Push failures are loud, but a partial push, LFS objects that never reached the LFS server, a branch that was not the one everyone reads, and someone else's push landing between the backup and the force-push are all quiet.

A push does not rewrite anything in flight: `git push` transfers objects that already exist, byte for byte, and `.gitattributes` renormalization runs back at `git add`. So what this phase catches is *which objects arrived and under which ref* — never an object that changed on the way out.

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
diff <(git ls-tree -r refs/backup/<branch> | sort) \
     <(git ls-tree -r HEAD | sort)               # EMPTY — same paths, same modes, same blob shas
git ls-files | wc -l                             # equals the Phase 3 inventory count
```

Compare the full `ls-tree` lines, not `--name-only`. A mode-only change — `100644` to `100755`, which a `chmod` or a checkout on a filesystem that reports the exec bit will produce — moves the root hash while leaving a name-only diff empty, so the localizer goes silent at exactly the moment it is needed. `mode sha path` costs the same and names the offending blob.

Equal root tree hashes are a complete proof of content identity for everything git stores itself: a tree hash covers every path, every blob's content, and every file mode git records (`100644`, `100755`, `120000` for a symlink, `160000` for a submodule gitlink), recursively. Two histories with the same root tree hash carry the same code, byte for byte. The other three checks exist to *localize* a mismatch, not to add certainty.

Any mismatch → **stop and roll back before touching anything else** (the Rollback section below), then report what differed. Do not attempt to patch the difference forward on the remote; restore the old tip, and re-run from Phase 6 once the cause is understood.

Four things this proof does not cover, and all four belong in the report rather than in a claim of completeness. The first two are the ones that can actually lose data, so check them whenever the repo has LFS or submodules and give each its own line in Phase 13:

- **LFS content.** Under Git LFS the tracked blob is a ~130-byte pointer and the bytes live on the LFS server. Equal tree hashes prove the *pointers* match and say nothing about whether the objects were uploaded — the one case where "the hashes match" and "the files are there" genuinely come apart, and the reason a rebuild can pass every check above and still serve broken files. Repo has LFS → verify separately in the fresh clone (`git lfs fsck`, and `git lfs ls-files -s` against the same listing from the backup) and report that result on its own line.
- **Submodule contents.** A gitlink entry carries the submodule's commit sha, so an equal tree proves the *pointer* is unchanged. It says nothing about the submodule repository still serving that commit. Run `git submodule update --init` in the verification clone and report it, or state the submodules as unverified.
- **Untracked and ignored files** were never in the history and are not on the remote either — before and after are equally empty of them, which is correct, not a loss.
- **Working-tree bytes after checkout** can legitimately differ from the old checkout when `.gitattributes` renormalizes line endings or LFS smudges pointers. That is a checkout-filter difference, not a content loss — but if the repo has such filters, verify one representative file by hand (`git show refs/backup/<branch>:<path> | git hash-object --stdin` against `git rev-parse HEAD:<path>`) so the report says which it was.

Report the two tree hashes verbatim. `<OLD_TREE> == <NEW_TREE>` is the line that answers "did we lose anything".

---

## Phase 10 — Reconcile the tree with its new history (decision #4 from gate #1, executed)

Phase 9 proved the published tree is byte-identical to the one that went in. That proof is what makes this phase both safe and necessary: the files step 22 found are still making claims about a history that no longer exists, and they were carried across unchanged *because* the rebuild is forbidden to touch content. Repairing them is a normal commit, not a second rewrite.

Run it or skip it according to the gate-#1 answer. Skipping is legitimate when the user chose it; leaving a changelog whose every link 404s without saying so is not.

**Ordering.** If the answer at step 26 deletes tags, run this phase **after** Phase 12 — a changelog regenerated against tags that are about to disappear drifts again the moment they do. If tags are kept, run it here, before the deletion window opens. Either way, say in the report which order was used.

Everything in this phase is **one commit on top of the rebuilt tip** — never an amendment to a rebuilt commit, never a force-push:

1. **Let the tooling regenerate what the tooling owns.** `npx commit-and-tag-version --skip.tag --skip.commit`, `git cliff -o CHANGELOG.md`, `release-please`, `changeset version`. A hand-edited changelog in a repo that generates one drifts again at the next release, so the generator is the fix and hand-editing is not.
2. **Repair by hand only what no tooling owns** — badges, `CITATION.cff`, a `SECURITY.md` version table, self-referencing `uses:`/`rev:`/raw-URL pins, and the manifest version if Phase 12 removes the tag that named it. Repoint a pin at a sha that exists in the new history, or at a tag/branch instead of a sha.
3. **Show the full diff and get an explicit yes before committing it.** This is the only place the skill changes file content, and the user approved a rebuild, not an edit. A hand-written paragraph that merely *mentions* the old history is the user's prose: quote it and ask, never reword it silently.
4. **Commit in the repo's own convention** (`docs(changelog): regenerate against the rebuilt history`), signed and dated exactly like the rest of the run, and push it as an ordinary fast-forward.
5. **Re-run the step-22 greps against the new tip.** Whatever still resolves to nothing is named in the Phase 13 report, file by file, not left implied by "reconciled".

**When it cannot be done honestly, say so and stop.** If the old changelog entries describe releases whose tags are being *kept*, their links still resolve and regenerating would delete accurate history. If the release notes already published on the host quote the old commits, a regenerated file now disagrees with them — that is a disclosure, and the host's release bodies are not this phase's to edit. A changelog pointing into a history the repository no longer serves is a fact to report; it is never a file to quietly rewrite into a version of events that did not happen.

---

## Phase 11 — Contributors cache (the user's answer from gate #1, executed)

The rebuild re-authored every commit to the person running it, so after Phase 9 the commit graph holds exactly one identity. GitHub's **Contributors** sidebar does not follow: it is a cached index, not a live read of the graph, and a force-push replaces the refs without ever invalidating it. The old account keeps appearing — for days, in reported cases.

Run this phase, or skip it, according to the answer collected at gate #1 (step 26). Skipping is a legitimate answer *the user gives*; it is never one the run makes for them, and "the fix renames the default branch, which seemed like a lot for a cosmetic entry" is a cost to have stated at step 26, not a decision to take in Phase 11.

**The rename is itself logged.** `branch_creation` and `branch_deletion` rows for `<branch>` and `<branch>-tmp` land in the activity log seconds apart, and that pattern beside a `force_push` is a recognisable signature of exactly this procedure. It is a reason to state the cost at gate #1, never a reason to skip a rebuild the user asked for — and never a reason to attempt a variant that hides it, because none exists.

**The API is not the sidebar — this is the trap this phase exists to avoid.** `repos/<owner>/<repo>/contributors`, `stats/contributors` and the rendered repository page are fed by *different* caches. The API commonly answers with the new, correct list within seconds of the push while `https://github.com/<owner>/<repo>` still shows every account that ever committed. So:

- A clean API read is **not** evidence that the page is clean, and reporting "the API returns only `<login>`, nothing to clear" is reporting the wrong cache.
- The run cannot see the rendered page. Only the user can — that is exactly why the question belongs to them and is asked at gate #1.
- If the user answered *clean* at gate #1, run the rename regardless of what the API says. If they answered *leave*, say in Phase 13 that the sidebar was left as it is and may still list the old accounts.

**Diagnostics — what they are and are not for.** These read the *graph*, so they say whether a cache rebuild can succeed at all; they never say whether the sidebar currently needs one:

```bash
REPO=<owner>/<repo>
git log --all --format='%an <%ae> | %cn <%ce>' | grep -i <old-name>   # expect no output
git ls-remote origin 'refs/pull/*' | wc -l                            # merged PR refs keep old commits, and their authors, alive
gh api "repos/$REPO/contributors"       --jq '.[] | "\(.login) \(.contributions)"'
gh api "repos/$REPO/stats/contributors" --jq '.[] | "\(.author.login) \(.total)"'
```

`stats/contributors` answers `202` with an empty body while GitHub recomputes it — retry a few seconds later rather than reading the blank as a result. A non-zero `refs/pull/*` count is the usual reason an entry never clears: those refs live outside the branch, the rebuild does not touch them, and this skill does not delete them. Say so instead of promising the sidebar will clear — and say it as a caveat on the attempt, not as a reason to skip an attempt the user asked for.

**The fix — rename the default branch, then rename it back.** This is what forces the index to rebuild; force-pushing, deleting and recreating the branch, and pushing empty commits do not:

```bash
gh api -X POST "repos/$REPO/branches/<branch>/rename"     -f new_name=<branch>-tmp
gh api -X POST "repos/$REPO/branches/<branch>-tmp/rename" -f new_name=<branch>
```

Then reload the repository page with a hard refresh (`Ctrl+F5`) — the sidebar is also cached client-side as a Turbo snapshot, so a normal reload can hand back the old markup.

Before running it:

- Re-check protection — `gh api "repos/$REPO/branches/<branch>/protection"`. A `404 Branch not protected` means there is nothing to lose; otherwise verify the rules again after the second rename.
- **Do not push between the two commands.** In that window the branch does not exist under its real name.
- **The rename does fire workflow events. Verify, never assume it is silent.** Observed on a public repo: `main` → `main-tmp` → `main` produced two `delete`-event runs *and* a `push`-event run on the restored branch — `head_sha` unchanged, no commit involved. Anything keyed to `on: push: branches: [<branch>]` or `on: delete` runs. Re-read the triggers from Phase 0, step 19 and say what will fire before renaming.
- **A mirror or cleanup job that prunes is the real hazard in that window.** While the branch is renamed away, a `--prune` mirror sees it as deleted and tries to delete it downstream. In the observed run the downstream refused — `remote: GitLab: The default branch of a project cannot be deleted.` — and the mirror survived on the luck of both sides naming the default branch the same. A downstream whose default branch is named differently loses the branch. If a mirror exists: pause it, or accept the risk deliberately, and re-verify the downstream tip and tags afterwards.
- **`422 Validation Failed — New branch already exists` on the second rename is usually a stale read, not a conflict.** Check `git ls-remote --heads origin`; if it shows only `<branch>-tmp`, the rename simply has not propagated and the call retries clean. Treating the 422 as a hard failure abandons the repository on the temporary name — the worst outcome this phase has.
- **After the second rename, `git ls-remote --heads` can list both names.** Re-read before touching anything: the extra ref is normally a stale response that is gone on the next call, and deleting on the first reading risks deleting the branch that was just restored.
- Open pull requests are retargeted automatically by GitHub.
- Local clones need nothing as long as the name comes back unchanged.

Still listed afterwards → escalate in cost order, and state the cost of each before doing it: **block the account** (reported as immediate, reversible), **transfer the repository to another account and back** (reported as instantaneous; a transfer drops Actions secrets), **contact Support** (the standing answer is that no manual recompute trigger exists). Deleting and recreating the repository costs every release and its uploaded assets, the Actions history, the watchers and the creation date — last resort, rarely warranted.

**Preventing the next one:** a wrong identity almost always comes from a global `git config`. Pin it per repository, using the numeric noreply address so a later account rename does not break attribution:

```bash
git config --local user.name  "<login>"
git config --local user.email "<id>+<login>@users.noreply.github.com"
```

Background, sources and the community threads behind each escalation: <https://gist.github.com/khasky/3939637b842510c4ff44d2e4d84acd0f>. This phase is GitHub-specific — for any other host, report the sidebar as unverified rather than assuming the same trick exists.

---

## Phase 12 — Tags and releases (the user's answer from gate #1, executed)

Execute the tag and release answers collected at gate #1 (step 26) — that is what this phase is, and there is no branch of it where the run decides for itself. *Keep* is a legitimate answer and needs no action beyond the report; it is legitimate because the user gave it, not because the run judged deletion too expensive. If the answer names a subset, delete exactly that subset.

Keeping tags leaves every one of them pointing into the old history, which keeps those objects reachable — say so in Phase 13 rather than implying the wipe was total.

Every deletion here writes its own `branch_deletion` row for `refs/tags/<tag>` into the activity log, with the tag name and the sha it pointed at. Deleting tags does not remove the record that they existed; it records that they were removed. State that with the rest of the step-18 disclosure rather than after the fact.

**Hard stop first:** any tag whose version is published to an immutable registry (npm, PyPI, crates.io, the Go module proxy, Maven Central, NuGet, a signed container tag) must not be deleted or moved. Those registries pin a version to content; re-tagging makes consumers fail checksum verification instead of upgrading. The only safe move is a **new, higher version**.

Deleting a release is not free: its uploaded assets and their download counts are gone for good, and any auto-updater that reads "the latest release" finds nothing until a new one is published. State both, per release, before deleting.

```
gh release delete <tag> --yes --cleanup-tag     # GitHub: release + its tag
glab release delete <tag>                       # GitLab: release; delete the tag separately
git tag -d <tag>                                # local
git push origin :refs/tags/<tag>                # remote, if the host CLI did not
```

Confirm each item against the gate-#1 answer before deleting it; never batch-delete a set wider than the one named there. A tag the user did not name is not deleted, and a tag whose version turned out to be registry-published is refused with the reason, even if the answer said "delete all" — that is the one stop this phase applies against the user's own instruction, and it is reported, not silently honoured.

**Re-pointing a tag instead of deleting it is usually dishonest, and the run must say so rather than offer it as a middle path.** A rebuilt commit was never the tree that release shipped, so moving `v0.1.0` onto one makes the release page claim a provenance it does not have. Offer it only where the rebuilt series genuinely contains a commit whose tree matches that release, and say which check proved it.

Then cut the new version with **the repository's own tooling**, not by hand — `pnpm release`/`commit-and-tag-version`, `semantic-release`, `release-please`, `changeset publish`, `cargo release`, `poetry version`, or the plain `git tag -a v<version> -m` the repo already uses. Follow its documented runbook if `docs/` has one, and let CI publish if that is how the repo publishes.

---

## Phase 13 — Report

```text
Repository:   <owner>/<repo>  (branch <branch>)
Rebuild:      <OLD_SHA> → <NEW_SHA>   (<N_old> commits → <N_new>)
Strategy:     layered | feature-vertical | reconstructed | changelog-first | manual   (mode: story | bisectable)
Plan source:  supplied <file> (validated: coverage exact, <N> rows, order clean) | built in Phase 4
Convention:   <detected convention>, enforced by <hook/CI>  — every subject validated
Content:      local  git diff <OLD_SHA>..<NEW_SHA> empty — tree identical, 0 files lost
Published:    tree <OLD_TREE> == <NEW_TREE> in a fresh clone of the remote; <N> paths, none added or dropped
Coverage:     <N> tracked paths, each in exactly one commit
Pacing:       span <duration> (measured from the old history | anchored to <date> via <source> | chosen by the user), <N> sessions,
              synthetic|real timestamps, first <ts> → last <ts>, offset <±hhmm> (matches the old history)
              gaps  min <a>s / max <b>s / mean <c>s   vs replaced  min <x>s / max <y>s / mean <z>s
Dates:        author and committer both on the ladder — %ad == %cd on <N>/<N> commits, offset <±hhmm>
Signing:      <N>/<N> signed with <ssh|gpg key id>, host reports verified=true | unsigned as answered
              | unsigned — no key configured and none required
Backup:       <absolute path>  (verified: N commits, fsck clean[, LFS blobs fetched])
Secret scan:  clean | FINDINGS (rotate now) | not scanned (no gitleaks)
Decisions:    tags <keep|delete: list> · releases <keep|delete: list> · contributors <clean|leave>
              · tree references <repair|disclose> · merged PRs <attribute|leave>   — all five asked at gate #1
Tree refs:    <N> shas quoted, <M> left the history · <N> host links · badges <list> · pins <list>
              → repaired in <sha> "<subject>" (run <before|after> Phase 12) | left as answered, still dangling: <files>
              chronology <consistent | conflicts left in the tree: list>
Contributors: left as answered (leave) | cache rebuilt via branch rename — <accounts cleared | still listed, N refs/pull/* keep them>
Pull requests: <N> records untouched and undeletable; Insights → Pulse still lists <M> merged
              <C> commits still served via refs/pull/* that the new tip does not contain, by <authors>
              — permanently reachable, never garbage-collected; oldest <sha> "<subject>" <date>
              <N> merged PRs attributed in <commits> via Refs/Co-authored-by | left unreconciled as answered
Host record:  activity log now carries <N> force_push + <N> branch rename + <N> tag deletion rows for this
              branch — public, permanent, no delete endpoint. Events feed ages out in 30 days.
              Third-party copies holding the old history: <none | Software Heritage <date> | mirror <url>>
Tags:         kept as answered <list> (they keep the old commits reachable) | deleted <list> | refused <tag: registry-published>
Releases:     kept as answered <list, assets intact> | deleted <list, N assets and their download counts gone>
              <version> cut via <tooling>, if one was
Verified:     ls-remote tip = <NEW_SHA>; status clean; N commits; lint pass; changelog dry run OK
              fresh clone re-checked against the backup — root tree hashes equal
```

Every line of the `Decisions:` row is quoted from the user's gate-#1 answer. A run that cannot fill one in did not ask — say "not asked", never "untouched", because the two read the same to a reader and mean opposite things about who chose.

The `Host record:` row is not a decision and not a failure — it is the part of the outcome the user cannot change, reported at the same volume as the parts they can.

**Manual residuals — say these plainly, they cannot be done by command:**

- **Open PRs** reference commits that no longer exist; close or recreate them.
- **Forks and existing clones** keep the old history; a rewrite cannot reach them.
- **Intermediate commits are not built** in `story` mode — `git bisect` across this history is unreliable by construction.
- **`--no-verify` was used** on intermediate commits, if it was. Name which.
- **The contributors sidebar** still lists the old accounts if the gate-#1 answer was *leave*, and can keep listing them even after a cache rebuild if merged `refs/pull/*` refs hold their commits. Ask the user to check the rendered page — the run never saw it, and the API does not answer for it.
- **The pull request history is untouched and cannot be cleaned.** Every PR keeps its number, title, author and timeline, **Insights → Pulse** keeps reporting the merged ones, and no API deletes a PR — only deleting and recreating the repository would, at the cost of every issue, star, watcher, release and asset, the Actions history and secrets, the traffic stats and the creation date. Give the counts from Phase 0 step 16: `<N>` PR records, and `<C>` commits still served through `refs/pull/*` that the new tip does not contain, by `<authors>`. Those commits are **reachable refs, so garbage collection never removes them** — the old history stays retrievable from this repository indefinitely, by anyone, with `git fetch origin 'refs/pull/*/head:refs/pr/*'`. That is why the wipe is not total, why a bot can stay in the sidebar, and why "the old commits will be GC'd eventually" is true only of commits no PR ref reaches.
- **Merged PRs left unreconciled** (decision #5 answered *leave*) each keep a page saying they were merged into `<branch>` at a sha the branch no longer contains. Name the count. If they were attributed instead, name the commits that carry the `Refs:` and `Co-authored-by:` trailers.
- **Kept tags** hold the old commits reachable, so the old history is not gone from the remote. Name them.
- **The history reads as a rebuild to anyone who checks**, and no pacing model, signature or date policy changes that. Say it once, plainly, with the four things that give it away, rather than letting the user believe the dates are the whole story:
  - `git log --diff-filter=M` is empty — every path is added once and never modified, so the whole series is `+N −0`. A real history deletes lines.
  - The host's activity log carries the `force_push` with both SHAs, the actor and the real timestamp, publicly and permanently (Phase 0, step 18).
  - `refs/pull/*` still serves `<C>` commits of the old history, oldest `<date>`, retrievable with one `git fetch`.
  - Files in the tree — a changelog, a badge, a manifest version — describe the history that was erased, unless Phase 10 repaired them.

  The point of the rebuild is a log that is **readable**, not a log that is unfalsifiable. A user who wants the second thing is asking for something no tool provides, and should hear that in one sentence at gate #1 instead of discovering it from a stranger's forensic write-up.
- **The activity log cannot be cleared, overwritten or aged out** (30 days applies only to the events feed). Deleting and recreating the repository is the only thing that removes it, at the cost of every issue, PR, star, watcher, release, asset, Actions history, secret, traffic stat — and the creation date, which is itself evidence. It is not offered here.
- **A leaked secret**, if one was found, still needs rotating.
- **The backup** stays until the user confirms the remote is good. This skill never deletes it.

## Rollback

The backup restores the exact pre-rebuild state:

```
git push --force <repository-url> OLD_SHA:refs/heads/<branch>
git -C <backup> push --force origin 'refs/tags/*:refs/tags/*'    # if tags were deleted
```

Deleted **releases** do not come back — a release object and its uploaded assets are gone once deleted, even when the tag is restored. That asymmetry is why Phase 12 runs last, item by item, and only on an answer the user gave before the backup existed.

## Guardrails

- The user's own checkout is off-limits; all work happens in a scratch clone with a verified mirror backup beside it.
- Read-only until confirmation gate #1; nothing leaves the machine until gate #2.
- A gate written as a sentence the user answers in prose. Both gates and all five end-state decisions are structured questions with their options and costs on screen.
- Every stop gate is a real stop: owner mismatch, multiple branches, multiple authors, no write access, protected branch, unassigned path, non-empty tree diff, a published tree that does not match the backup, published-version tag, or a missing approval — each halts the run.
- The published result is proved, not assumed: a fresh clone of the remote is compared to the backup by root tree hash, and a mismatch rolls back before anything else happens.
- Whether a rebuild is worth doing is answered with the Phase 0 concentration measurement and decided by the user; the run reports the number and the stop gates, it does not talk the user out of the task it was invoked for.
- The plan is approved as a table, by the user, before a single commit is made — and re-split on request rather than defended. A plan supplied with `--plan` is validated against this tree first, and a coverage mismatch stops the run rather than being reconciled quietly.
- Tags, releases, the contributors sidebar, the tree's references to the erased history and the merged pull requests are decided by the user at gate #1 and executed verbatim in Phases 10–12. The run never leaves one alone by its own judgment, never treats silence as "keep", and never reads a clean `contributors` API response as an answer about a rendered page it cannot see. A cost the run thinks is too high is a fact to state at the gate, not a decision to make after it.
- File content is changed in Phase 10 only, as one commit on top of a tip whose tree was already proved identical, with the diff approved. Never inside the rebuild, never by amending a rebuilt commit, never with a second force-push.
- No invented history: no fabricated bug-fix arcs, no commit describing work the tree does not contain, no synthesized merge for a PR whose diff is not in the final tree.
- Both date fields carry the approved ladder, and Phase 7 checks them against it rather than assuming the loop applied them. Signing is offered and verified against the objects and the host, never assumed.
- A span anchored to an earlier date is backed by a source that returned that date — the backup, a pull-request ref, the host's creation date or activity log, or a salvage run. An anchor no source produced is backdating, and the run says so instead of writing it into the first commit.
- The host's record of the rewrite — the activity log, the rename rows, the tag deletions, the surviving PR refs — is measured before the push and reported after it. The run never tries to erase, overwrite or outrun it, and never implies to the user that it did.
- The repo's convention, hooks and release tooling win over this skill's defaults, every time.
- `--force-with-lease`, never bare `--force`. The backup and any ref the user did not name are never deleted here.
- This is for a repository the user owns and authorizes. It is not a way to erase a co-contributor's attribution, and it is not a way to scrub a secret from a public project's past — for that, rotate the secret.

## References

- `references/commit-splitting-patterns.md` — how large OSS projects split work into commits (git, the Linux kernel, OpenStack, Angular/Conventional Commits), the layer order, granularity by repo size, honest commit types, the six re-split strategies, per-ecosystem file mapping, and the anti-patterns.
- `references/repo-convention-discovery.md` — where a repo states and enforces its commit rules, precedence between sources, inferring the format from the existing log, message templates per convention, DCO and signing, and how to handle hooks during the replay.
- `awesome-git-history-salvage` (sibling skill) — read-only reconstruction of every commit the repository has ever held, erased history included. Phase 5 escalates to it for the `anchored` span when the current refs do not reach the repository's first activity.
- `awesome-commit-plan` (sibling skill) — writes the plan file `--plan` takes: a navigation map from import direction, a split proven bisectable by replaying the ladder against the repository's own gates, and messages written to a strict anti-slop ruleset. Read-only, so it can run on a repository long before anyone decides to rewrite its history.
