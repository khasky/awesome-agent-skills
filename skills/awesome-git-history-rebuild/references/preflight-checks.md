# Preflight checks

The exact commands, per-host branching and extended rationale behind every numbered check in Phase 0 — read while running that phase, one section at a time. This file never decides anything on its own: the threshold that stops the run is stated in `SKILL.md`, not here.

Contents:
- A — Identity and credentials
- B — Permission on the remote
- C — Rules that reject a push
- D — Repository state and blast radius
- E — Local capacity
- F — The gate
- Phase 1 — backup and rollback commands

## A — Identity and credentials

The push has to be *someone*, and every commit is stamped with that identity. Establish who, and through which credential, before anything else.
   ```
   git config user.name && git config user.email
   git config --show-origin user.email          # which config file won — global, local, or a conditional include
   ```
   ```
   gh auth status                               # GitHub: account, host, token scopes, protocol
   glab auth status                             # GitLab: host and user
   ssh -T git@github.com                        # SSH remote: prints the account the key authenticates as
   git config credential.helper                 # HTTPS remote: which store answers
   ```
   ```
   gh api user -q .login                        # GitHub
   glab api user                                # GitLab — read `username` from the JSON
   ```

## B — Permission on the remote

   ```
   git ls-remote <repository-url>
   ```
   ```
   gh repo view <owner>/<repo> --json viewerPermission,isFork,parent,forkCount,isArchived,visibility,createdAt
   glab api projects/<url-encoded-path>     # permissions, archived, forked_from_project, forks_count, mirror
   ```
   ```
   git push --dry-run origin HEAD:refs/heads/<branch>
   ```

## C — Rules that reject a push

Each of these fails *at push time*, after the backup and the whole rebuild are done. That is the expensive way to learn them.
    ```
    gh api repos/<owner>/<repo>/branches/<branch>/protection
    glab api projects/<url-encoded-path>/protected_branches/<branch>
    ```
    ```
    gh api repos/<owner>/<repo>/rules/branches/<branch>
    gh api repos/<owner>/<repo>/rulesets                      # includes org-level rules inherited by the repo
    ```
    ```
    glab api projects/<url-encoded-path>/push_rule
    ```

## D — Repository state and blast radius

    ```
    git ls-remote --symref <repository-url> HEAD
    ```
    ```bash
    git rev-list --count <branch>                          # total commits
    git ls-tree -r --name-only <branch> | wc -l            # tracked paths (works in a bare clone too)
    for h in $(git rev-list <branch>); do
      echo "$(git show --name-only --format='' $h | grep -c .) $h $(git log -1 --format=%s $h)"
    done | sort -rn | head -5                              # files per commit, largest first
    git log --format='%an' <branch> | grep -c '\[bot\]'    # bot commits inside that total
    ```
    ```bash
    git ls-remote --heads <repository-url>
    # per other branch — 0 ahead means <branch> already contains every one of its commits
    gh  api "repos/<owner>/<repo>/compare/<branch>...<other>" --jq '.ahead_by'
    glab api "projects/<url-encoded-path>/repository/compare?from=<branch>&to=<other>" --jq '.commits | length'
    ```
    Ask the host, not the local clone: `git branch -r --merged` only sees remote-tracking refs this checkout happens to have fetched, so a branch that was never fetched reads as unmerged and produces exactly the false stop this step exists to avoid. Without a host CLI, fetch the heads first (`git fetch origin 'refs/heads/*:refs/remotes/origin/*'` — it writes remote-tracking refs, the one non-read-only act in this phase) or declare the classification unavailable and let the user judge the list.

    ```
    gh pr list --repo <owner>/<repo> --state open
    gh pr list --repo <owner>/<repo> --state all --limit 100 --json number,state
    glab mr list --repo <owner>/<repo>
    ```
    Every PR record survives the rewrite permanently, and none of them can be deleted. A pull request is a row in the host's database keyed by repository and number — title, author, timeline, and its own `refs/pull/N/*` refs — and not one of its fields depends on the branch's commit graph. Rewriting `refs/heads/<branch>` cannot reach it. GitHub has no deletion path either: the GraphQL schema carries `deleteIssue`, `deletePullRequestReview` and `deletePullRequestReviewComment` but no `deletePullRequest`, and `DELETE /repos/{owner}/{repo}/pulls/{n}` answers `404` because the endpoint does not exist. So Insights → Pulse keeps listing the merged PRs, the PR tab keeps its full list, and the only way to clear either is deleting and recreating the repository — which also costs every issue, star, watcher, release and its assets, the Actions history and secrets, the traffic stats and the creation date. Say this at gate #1, in those terms, because a user who asked for a clean history usually believes it covers this too.

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

    They are also permanent, which is the part users do not expect. `refs/pull/N/head` is a ref, so everything it reaches is *reachable*, and garbage collection by definition never touches it. A PR branched off the old tip drags its whole ancestry along: in a measured case, 20 PR refs kept 88 commits of an erased history alive — back to its original `Initial commit` — retrievable in perpetuity by anyone who runs `git fetch origin 'refs/pull/*/head:refs/pr/*'`. Quote the count and the oldest subject at gate #1: it is the honest ceiling on "the old history is gone".

    Merged PRs are real work whose record survives while its commits do not — offer to reconcile them. The rebuild re-authors the tree to one identity, so a `dependabot[bot]` PR that reads "Merged commit `abc1234` into `<branch>`" points at a commit the branch no longer contains, while the bumped version it produced sits in the lockfile of the new history with nobody's name on it. That contradiction is visible on the PR page itself, without any forensics. Two things can honestly be done, and the choice is decision #5 at step 26:

    - Carry the outcome into the plan. Group the paths that hold each merged PR's result — the manifest and lockfile for a dependency bump, the workflow file for an action bump — into their own commit, crediting the bot and naming the PR numbers:
      ```text
      chore(deps): bump the dependencies dependabot opened PRs for

      Refs: #15, #16, #17, #18, #19, #20
      Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
      ```
      Read the bot's exact address out of the old history (`git -C <backup> log --format='%an <%ae>' | grep '\[bot\]' | sort -u`); never type a noreply id from memory. The same shape works for any merged human PR whose result is identifiable in the final tree.
    - What cannot be done, so do not offer it: a merged PR cannot be re-pointed, re-merged, renumbered or recreated under its own number — the record is keyed to the repository and the number, and no API writes it. Synthesizing a merge commit for a diff the final tree does not contain is inventing history, the same rule that forbids fabricated `fix:` arcs. A bump whose *before* state exists nowhere in the tree can be attributed, never re-enacted.

    ```bash
    gh api "repos/<owner>/<repo>/activity?per_page=100" \
      --jq '.[] | "\(.timestamp) \(.activity_type) \(.ref) \(.before[0:7])..\(.after[0:7])"'
    curl -s "https://archive.softwareheritage.org/api/1/origin/<repository-url>/visits/"   # third-party snapshot?
    ```

    Four records, three of which never expire:
    - The activity log (`/repos/{owner}/{repo}/activity`, rendered at Insights → Activity) keeps every `push`, `force_push`, `branch_creation`, `branch_deletion` and `pr_merge` with both SHAs and the actor — including the rows this run is about to add, the Phase 11 branch rename, and every tag deletion Phase 12 performs. There is no delete endpoint, the reference documents no retention window, its `time_period` filter accepts `year`, and a repository months old returns rows back to its creation. It is world-readable on a public repo. Nothing overwrites it, either: an append-only log answers a second rewrite with a second `force_push` row, so an attempt to bury the first doubles the evidence. Do not spend a step on it — state it.
    - The events feed (`/repos/{owner}/{repo}/events`, the account's public feed, the Atom feeds) carries the same pushes with a 30-day window since 2025-01-30. That one does expire, and it is the only part that does.
    - The organization audit log keeps its own `git.push` entries on org-owned repositories, under the org's retention and outside the user's control.
    - Third-party copies — Software Heritage, a GitLab/Codeberg mirror the repo pushes to itself, any existing clone — hold the pre-rewrite history beyond the host's reach entirely. A mirror the repo's own CI maintains will happily receive the rewritten history *and* keep serving whatever it already had unless it prunes; check both sides.

    ```
    grep -rl 'on:' .github/workflows/ | xargs grep -l 'push'      # which workflows react to a push
    ```
    Then say plainly what will happen: how many workflow runs, whether any of them deploys or publishes, whether a mirror job will re-push elsewhere, and whether the branch backs GitHub Pages (a force-push republishes the site). If a push triggers a deploy or a publish, that is a decision for the user, not a side effect to discover afterwards.
    ```
    git log --format='%an <%ae>' <branch> | sort | uniq -c | sort -rn
    ```

    ```bash
    git ls-remote --tags <repository-url>
    gh release list --repo <owner>/<repo>                       # tag, latest flag, published date
    gh release view <tag> --repo <owner>/<repo> --json assets --jq '.assets[] | "\(.name) \(.downloadCount)"'
    glab release list --repo <owner>/<repo>
    ```

    Three findings, each of which changes the answer the user should give:
    - Immutable-registry publication. If any tag matches a version published to npm, PyPI, crates.io, the Go module proxy, Maven Central or NuGet, deleting or moving it is a hard stop in Phase 11: those registries freeze a version to a content hash, and a re-tagged version makes consumers fail checksum verification rather than upgrade. Check the name rather than assuming (`https://registry.npmjs.org/<name>`, `https://index.crates.io/…`); a manifest with `private: true` or `publish = false` settles it too.
    - Uploaded assets and their download counts, per release. They do not come back — a mirror backup restores tags, never a release object or its binaries.
    - Anything that reads "the latest release" — an auto-updater endpoint (Tauri, Sparkle, electron-updater), an install script, a docs badge. Deleting every release breaks it until a new one is cut. Grep the tree for the updater endpoint before claiming otherwise.

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
    - `CHANGELOG.md` — the usual worst case, and the one that indicts the rebuild by itself. A generated changelog is a list of commit links and `compare/vA...vB` URLs; after the rewrite every one of them 404s against the repository that ships them. Its headings also describe releases whose tags Phase 12 may be about to delete, and it carries dates: a changelog entry for a release on the 27th, inside a tree whose commit adding the release tooling is dated the 28th, is a self-refuting pair any reader hits without opening an API.
    - README and docs badges — `v/release`, download counts, "latest release" links. Deleting the releases empties them; they render as `no releases`, not as an error anyone notices in review.
    - `CITATION.cff` (`commit:`, `version:`, `date-released:`), `SECURITY.md` supported-version tables, issue templates that enumerate versions, a docs page quoting a tag.
    - Self-referencing pins — these break at runtime, not just visually. `uses: <owner>/<repo>@<sha>` in the repo's own workflows, a `.pre-commit-config.yaml` `rev:` pointing at this repo, an install script curling `raw.githubusercontent.com/<owner>/<repo>/<sha>/…`, a Go pseudo-version naming a commit. A sha that leaves the history takes the thing that pins it with it.
    - Manifest version versus the tags about to go. `package.json` at `0.2.0` with `v0.2.0` deleted leaves the repository claiming a version nothing points at.

    Then check chronology, not just links. Sort the planned commit dates against every date written *inside* the tree — changelog headings, release notes, `date-released`, dated docs and runbooks. A commit dated after the artifact it is supposed to have produced is the tell no timestamp model repairs, and it is cheap to avoid while the plan is still a table. Report each conflicting pair; a plan that cannot be ordered to satisfy them is a plan to re-split in Phase 4, not a line in the final report.

    ```
    gitleaks git . --no-banner
    ```

## E — Local capacity

    ```
    git -C <repo> rev-list --objects --all | git -C <repo> cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' | awk '$1=="blob" && $2>52428800'
    ```
    A hit means those blobs are already in the history (grandfathered or LFS) — confirm LFS is configured before re-pushing them, or the rebuild's push is the moment the limit is enforced. Keep the scratch clone and the backup outside the repository being rewritten.

## F — The gate

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

## Phase 1 — backup and rollback commands

```
git clone --mirror <repository-url> <repo>-backup-<shortsha>.git
cd <repo>-backup-<shortsha>.git
git rev-list --all --count                       # > 0
git log --oneline -1 <branch>                    # record as OLD_SHA
git fsck --full                                  # no missing or broken objects
git log --format='%h %ad %an %s' --date=short <branch> > ../old-history.txt
```
```
git push --force <repository-url> OLD_SHA:refs/heads/<branch>
```
