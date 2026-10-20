# Pacing and timestamps

Detail behind Phase 5: the flat-band problem, the earliest-date source table for an `anchored` span, and how the gaps are generated and verified. Read this while choosing timestamps.

## The flat-band problem

A flat band of a few minutes produces near-identical gaps everywhere, with no gap wider than a coffee break. A real history mixes seconds with overnight breaks, so its widest gap is hours, not minutes, and its mean is dominated by the long pauses.

## Step 1a — recovering the earliest date for an `anchored` span

   Step 1a — recover the earliest date, cheapest source first. Stop at the first one that answers; each later source costs more and reaches further back:

   | Source | Command | What it proves |
   | --- | --- | --- |
   | The backup | `git -C <backup> log --reverse --format='%ad' --date=iso <branch> \| head -1` | first commit of the history being replaced |
   | Every ref in the backup, not just the branch | `git -C <backup> log --reverse --all --format='%ad' --date=iso \| head -1` | an older commit on a tag or another branch |
   | `refs/pull/*` | already fetched in Phase 0, step 16 — reuse `git rev-list $refs --not <branch> \| tail -1 \| xargs git log -1 --format='%ad' --date=iso` | commits kept alive by pull-request refs, frequently older than the branch |
   | Repository creation | `gh repo view <owner>/<repo> --json createdAt` (step 7 already fetches it) | when the repository was made — a floor for anything not imported |
   | The activity log | `gh api --paginate "repos/<owner>/<repo>/activity?per_page=100" --jq '.[].timestamp' \| sort \| head -1` | the oldest push the host still records |
   | Erased history | `awesome-git-history-salvage` | commits no ref reaches: the `before` SHAs in the activity log, fetched by SHA over the git protocol |

   The activity log answers newest first and 100 rows a page, so the last row of the first page is the oldest of the newest hundred, not the earliest push. Page until exhausted and take the minimum over every row. If paging stops early (an error, a rate limit), the date is only "no later than the earliest row seen": report it as truncated and do not anchor to it.

   When the cheap sources disagree with each other, that disagreement is the finding. A repository created in April whose oldest reachable commit is dated August has had something erased between the two, and that gap is exactly what salvage reads. Report both dates and offer the escalation rather than silently taking the later one.

   Escalating to salvage. Call the Skill tool with "awesome-git-history-salvage", pointed at the same repository. It is read-only and needs no gate of its own, it reconstructs every commit the repository has ever held from the activity log and the PR refs, and it returns their dates. Take its earliest and use it as the anchor. Two limits belong in the report: the activity log is what makes it possible, so a repository whose erased history predates the log's coverage cannot be reached this way, and a salvage that returns nothing is a fact to state, not a reason to invent a date.

   The anchor is evidence, not permission. Starting the ladder at a date the repository can be shown to have existed is honest. Starting it earlier, or anchoring to a date salvage did not actually return, is backdating with extra steps — and the first commit of the rebuilt series carries that date forever, in a field anyone can read.

## Gap generation and verification

In-session gaps come from a mixture rather than a uniform range — mostly short, occasionally long. Session breaks are inserted on top, and the whole ladder is scaled to the chosen span:

Draw one gap per commit from this mixture: about 55% between 30 seconds and 4 minutes, 30% between 4 and 20 minutes, 12% between 20 and 75 minutes, 3% between 75 minutes and 3 hours. Turn `SESSIONS - 1` of those gaps, spread evenly through the series so two never touch, into overnight breaks of 3 to 16 hours. Scale every gap by the same factor so the gaps sum to the chosen span, start the ladder that far back from now, and give each commit the running time as both `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` in the form `@<epoch> <offset>` (for example `GIT_AUTHOR_DATE="@1718000000 +0200"`), with the offset taken from the old history's last commit (`git log -1 --format=%ad --date=format:%z`).

`@<epoch> <offset>` is git's portable date form — no `date -d` versus `date -r` split between GNU and BSD. Take the offset from the old history rather than from the machine: a rebuild whose timezone differs from every commit it replaced announces itself.

Both date fields move together. `GIT_AUTHOR_DATE` alone leaves the committer date at the real clock, which lands the whole series on today and splits the log into two timelines — the ladder in `%ad`, one clustered instant in `%cd`. Setting both keeps the commit objects internally consistent with the plan the user approved, and it is what every date-rewriting tool (`filter-branch`, `filter-repo --commit-callback`, `rebase --committer-date-is-author-date`) does. Read them back in Phase 7 with `git log --format='%h %ad %cd'`; both fields carry the same ladder, so both are checked against it.

Verify the shape in Phase 7, against the backup — the model is worth nothing if it was not applied:

Read the author timestamps of the rebuilt series and of the backup's old branch in order (`git log --reverse --format=%at`), take the differences between neighbours, and compare their minimum, maximum and mean: the rebuilt series must show the mixture above, with overnight breaks as its widest gaps, not a flat band.
