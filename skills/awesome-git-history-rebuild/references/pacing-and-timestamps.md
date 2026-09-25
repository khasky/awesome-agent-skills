# Pacing and timestamps

Detail behind Phase 5: the measured-vs-flat-band example, the earliest-date source table for an `anchored` span, and the gap-generation and verification scripts. Read this while choosing timestamps.

## The flat-band problem, measured

Measured — a 33-commit rebuild on a flat 3–6 minute band, against the 39-commit history it replaced:

```text
                    rebuilt (flat band)      the history it replaced
gap min                       194 s                     2 s
gap max                       355 s                64 741 s   (18 hours)
gap mean                      274 s                 4 639 s
```

## Step 1a — recovering the earliest date for an `anchored` span

   Step 1a — recover the earliest date, cheapest source first. Stop at the first one that answers; each later source costs more and reaches further back:

   | Source | Command | What it proves |
   | --- | --- | --- |
   | The backup | `git -C <backup> log --reverse --format='%ad' --date=iso <branch> \| head -1` | first commit of the history being replaced |
   | Every ref in the backup, not just the branch | `git -C <backup> log --reverse --all --format='%ad' --date=iso \| head -1` | an older commit on a tag or another branch |
   | `refs/pull/*` | already fetched in Phase 0, step 16 — reuse `git rev-list $refs --not <branch> \| tail -1 \| xargs git log -1 --format='%ad' --date=iso` | commits kept alive by pull-request refs, frequently older than the branch |
   | Repository creation | `gh repo view <owner>/<repo> --json createdAt` (step 7 already fetches it) | when the repository was made — a floor for anything not imported |
   | The activity log | `gh api "repos/<owner>/<repo>/activity?per_page=100" --jq '.[-1].timestamp'` | the oldest push the host still records |
   | Erased history | `awesome-git-history-salvage` | commits no ref reaches: the `before` SHAs in the activity log, fetched by SHA over the git protocol |

   When the cheap sources disagree with each other, that disagreement is the finding. A repository created in April whose oldest reachable commit is dated August has had something erased between the two, and that gap is exactly what salvage reads. Report both dates and offer the escalation rather than silently taking the later one.

   Escalating to salvage. Call the Skill tool with "awesome-git-history-salvage", pointed at the same repository. It is read-only and needs no gate of its own, it reconstructs every commit the repository has ever held from the activity log and the PR refs, and it returns their dates. Take its earliest and use it as the anchor. Two limits belong in the report: the activity log is what makes it possible, so a repository whose erased history predates the log's coverage cannot be reached this way, and a salvage that returns nothing is a fact to state, not a reason to invent a date.

   The anchor is evidence, not permission. Starting the ladder at a date the repository can be shown to have existed is honest. Starting it earlier, or anchoring to a date salvage did not actually return, is backdating with extra steps — and the first commit of the rebuilt series carries that date forever, in a field anyone can read.

## Gap-generation and verification scripts

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

Both date fields move together. `GIT_AUTHOR_DATE` alone leaves the committer date at the real clock, which lands the whole series on today and splits the log into two timelines — the ladder in `%ad`, one clustered instant in `%cd`. Setting both keeps the commit objects internally consistent with the plan the user approved, and it is what every date-rewriting tool (`filter-branch`, `filter-repo --commit-callback`, `rebase --committer-date-is-author-date`) does. Read them back in Phase 7 with `git log --format='%h %ad %cd'`; both fields carry the same ladder, so both are checked against it.

Verify the shape in Phase 7, against the backup — the model is worth nothing if it was not applied:

```bash
span() { git ${1:+-C "$1"} log --reverse --format='%at' ${2:-HEAD} |
         awk 'NR>1{d=$1-p; if(!n||d<mn)mn=d; if(d>mx)mx=d; s+=d; n++} {p=$1}
              END{print "min="mn"s max="mx"s mean="int(s/n)"s n="n}'; }
span                       # rebuilt
span <backup> main         # what it replaced
```
