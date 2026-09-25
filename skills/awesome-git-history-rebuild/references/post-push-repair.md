# Post-push repair

Detail behind Phase 10 (reconcile), Phase 11 (contributors cache) and Phase 12 (tags and releases): the diagnostic and API commands, the caveats to check before running the branch-rename fix, and the exact deletion commands. Read the matching section while running that phase.

## Phase 10 — reconcile

Phase 9 proved the published tree is byte-identical to the one that went in. That proof is what makes this phase both safe and necessary: the files step 22 found are still making claims about a history that no longer exists, and they were carried across unchanged *because* the rebuild is forbidden to touch content. Repairing them is a normal commit, not a second rewrite.

## Phase 11 — contributors cache

The rename is itself logged. `branch_creation` and `branch_deletion` rows for `<branch>` and `<branch>-tmp` land in the activity log seconds apart, and that pattern beside a `force_push` is a recognisable signature of exactly this procedure. It is a reason to state the cost at gate #1, never a reason to skip a rebuild the user asked for — and never a reason to attempt a variant that hides it, because none exists.
Diagnostics — what they are and are not for. These read the *graph*, so they say whether a cache rebuild can succeed at all; they never say whether the sidebar currently needs one:
```bash
REPO=<owner>/<repo>
git log --all --format='%an <%ae> | %cn <%ce>' | grep -i <old-name>   # expect no output
git ls-remote origin 'refs/pull/*' | wc -l                            # merged PR refs keep old commits, and their authors, alive
gh api "repos/$REPO/contributors"       --jq '.[] | "\(.login) \(.contributions)"'
gh api "repos/$REPO/stats/contributors" --jq '.[] | "\(.author.login) \(.total)"'
```
`stats/contributors` answers `202` with an empty body while GitHub recomputes it — retry a few seconds later rather than reading the blank as a result. A non-zero `refs/pull/*` count is the usual reason an entry never clears: those refs live outside the branch, the rebuild does not touch them, and this skill does not delete them. Say so instead of promising the sidebar will clear — and say it as a caveat on the attempt, not as a reason to skip an attempt the user asked for.
```bash
gh api -X POST "repos/$REPO/branches/<branch>/rename"     -f new_name=<branch>-tmp
gh api -X POST "repos/$REPO/branches/<branch>-tmp/rename" -f new_name=<branch>
```
Then reload the repository page with a hard refresh (`Ctrl+F5`) — the sidebar is also cached client-side as a Turbo snapshot, so a normal reload can hand back the old markup.
Before running it:

- Re-check protection — `gh api "repos/$REPO/branches/<branch>/protection"`. A `404 Branch not protected` means there is nothing to lose; otherwise verify the rules again after the second rename.
- Do not push between the two commands. In that window the branch does not exist under its real name.
- The rename does fire workflow events. Verify, never assume it is silent. Observed on a public repo: `main` → `main-tmp` → `main` produced two `delete`-event runs *and* a `push`-event run on the restored branch — `head_sha` unchanged, no commit involved. Anything keyed to `on: push: branches: [<branch>]` or `on: delete` runs. Re-read the triggers from Phase 0, step 19 and say what will fire before renaming.
- A mirror or cleanup job that prunes is the real hazard in that window. While the branch is renamed away, a `--prune` mirror sees it as deleted and tries to delete it downstream. In the observed run the downstream refused — `remote: GitLab: The default branch of a project cannot be deleted.` — and the mirror survived on the luck of both sides naming the default branch the same. A downstream whose default branch is named differently loses the branch. If a mirror exists: pause it, or accept the risk deliberately, and re-verify the downstream tip and tags afterwards.
- `422 Validation Failed — New branch already exists` on the second rename is usually a stale read, not a conflict. Check `git ls-remote --heads origin`; if it shows only `<branch>-tmp`, the rename simply has not propagated and the call retries clean. Treating the 422 as a hard failure abandons the repository on the temporary name — the worst outcome this phase has.
- After the second rename, `git ls-remote --heads` can list both names. Re-read before touching anything: the extra ref is normally a stale response that is gone on the next call, and deleting on the first reading risks deleting the branch that was just restored.
- Open pull requests are retargeted automatically by GitHub.
- Local clones need nothing as long as the name comes back unchanged.
Still listed afterwards → escalate in cost order, and state the cost of each before doing it: block the account (reported as immediate, reversible), transfer the repository to another account and back (reported as instantaneous; a transfer drops Actions secrets), contact Support (the standing answer is that no manual recompute trigger exists). Deleting and recreating the repository costs every release and its uploaded assets, the Actions history, the watchers and the creation date — last resort, rarely warranted.
Preventing the next one: a wrong identity almost always comes from a global `git config`. Pin it per repository, using the numeric noreply address so a later account rename does not break attribution:
```bash
git config --local user.name  "<login>"
git config --local user.email "<id>+<login>@users.noreply.github.com"
```
Background, sources and the community threads behind each escalation: <https://gist.github.com/khasky/3939637b842510c4ff44d2e4d84acd0f>. This phase is GitHub-specific — for any other host, report the sidebar as unverified rather than assuming the same trick exists.

## Phase 12 — tags and releases

```
gh release delete <tag> --yes --cleanup-tag     # GitHub: release + its tag
glab release delete <tag>                       # GitLab: release; delete the tag separately
git tag -d <tag>                                # local
git push origin :refs/tags/<tag>                # remote, if the host CLI did not
```
Re-pointing a tag instead of deleting it is usually dishonest, and the run must say so rather than offer it as a middle path. A rebuilt commit was never the tree that release shipped, so moving `v0.1.0` onto one makes the release page claim a provenance it does not have. Offer it only where the rebuilt series genuinely contains a commit whose tree matches that release, and say which check proved it.
Then cut the new version with the repository's own tooling, not by hand — `pnpm release`/`commit-and-tag-version`, `semantic-release`, `release-please`, `changeset publish`, `cargo release`, `poetry version`, or the plain `git tag -a v<version> -m` the repo already uses. Follow its documented runbook if `docs/` has one, and let CI publish if that is how the repo publishes.
