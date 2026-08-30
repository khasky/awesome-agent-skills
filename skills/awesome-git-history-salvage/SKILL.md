---
name: awesome-git-history-salvage
description: "Reconstructs every commit a repository has ever held — including history erased by a force-push — by merging the current refs, the pull-request refs, any mirror backup, and every ref state the host's activity log recorded, then fetching the unreachable commits by SHA over the git protocol. Emits one deduplicated sha/date/author/subject line per commit, marked for whether it still lives on the default branch. Use when asked 'what was in this repo before the rewrite', 'recover the erased git history', 'list every commit that ever existed', 'what did the force-push destroy', 'find deleted commits', or in Russian 'достать полную историю', 'что было до перезаписи', 'найти удалённые коммиты', 'все коммиты за всё время'. Read-only: it never writes to a remote. Do not use to rewrite or restore a branch (that is a plain force-push from a backup), to recover a lost local branch alone (that is `git reflog`), or to erase history — see awesome-git-history-reset and awesome-git-history-rebuild."
license: MIT
metadata:
  author: Khasky
  tags: ["git", "forensics", "history-recovery", "repository-ops", "read-only"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-git-history-salvage"
---

# Git History Salvage

Answer one question completely: **what has this repository ever contained?** Not what `git log` shows — that is only the current branch. The full set includes commits erased by every force-push the repository has taken, commits that live only on a merged pull request's ref, and commits on branches deleted years ago.

**Why it is not just `git log --all`:** a force-push replaces a ref, it does not delete objects. The objects stay on the host, unreachable, and the host keeps a public record of every ref state in its activity log. Those two facts together are what makes the old history recoverable — but only if you know that `git fetch origin <sha>` serves an unreachable commit while `GET /repos/{owner}/{repo}/commits/{sha}` answers `422 No commit found` for the same SHA. The git protocol succeeds where REST refuses, and that asymmetry is the whole technique.

**Measured case.** A repository whose default branch had just been rebuilt showed 67 commits in `git log`. Merging the four sources below produced **319** — 252 of them off-branch, including a whole erased 62-commit history, 50 bot commits on pull-request refs, and 5 commits under a differently-capitalized author name that exist nowhere in the current tree. All 74 ref states the activity log recorded were still fetchable; none had aged out.

## Core principle

**READ-ONLY, AND HONEST ABOUT THE EDGES.** This skill fetches and reports. It never pushes, never deletes a ref, and never touches the user's own checkout — every fetch lands in a disposable scratch clone, because salvage writes dozens of refs (`refs/salvage/*`, `refs/pr/*`) that nobody wants in a working repository.

Three invariants:

- **Never work in the user's checkout.** The salvage adds one ref per recovered SHA. In a scratch clone that is free; in a working copy it is litter the user has to clean up, and `git log --all` there is wrong from then on.
- **Every source is additive and deduplicated by SHA.** A commit found in three places is one row. A commit found in none is not invented.
- **State what could not be reached.** The activity log records **ref states**, not commit lists. A commit that only ever existed mid-branch and was never the tip of a push has no row anywhere, and no technique here finds it. Say so in the report rather than implying completeness.

## Invocation

```
/awesome-git-history-salvage <repository-url-or-path> [--out <file>] [--backup <path-to-mirror.git>] [--since <year>]
```

- `<repository-url-or-path>` — required. A remote URL (`https://…`, `git@…`) or a local path. A local path with a remote gets both the local objects and the host's record; a local path with no remote gets the local sources only, which is still worth doing — a reflog and a `fsck` often hold what a rewrite dropped.
- `--out` — optional. Where to write the report. Default: `<repo>-history-full.txt` beside the repository.
- `--backup` — optional. Path to a mirror clone (`*.git`) to merge in. A backup taken before a rewrite is the single richest source; without one the erased history is recoverable only through the activity log's ref states.
- `--since` — optional. Restrict the activity-log sweep to a year. Default: everything the host returns.

If the user invokes the skill without a target, ask for one before doing anything else.

## Tooling check (run first)

- `git --version` — required. Every retrieval is plain git.
- **A host CLI** — `gh` (GitHub) or `glab` (GitLab). Without one the activity log is unreachable and the salvage is limited to refs the remote still advertises plus whatever local sources exist. That is a real gap: it is exactly the erased history that only the activity log names. Say so rather than reporting a short list as complete.
- `jq` is not required — `gh --jq` and `glab --jq` are built in.

Confirm each is on `PATH` (exit 0) before relying on it.

---

## Phase 0 — Identify the target and the host

1. **Parse the target.** A URL gives `<owner>/<repo>` and the host. A local path: read `git -C <path> remote -v`; no remote means local-only mode, which skips Phase 3.

2. **Detect the default branch** — it is the reference the report marks against, and it is never safe to assume `main`:
   ```bash
   git ls-remote --symref <url> HEAD    # the `ref:` line names it
   ```

3. **Pick the ref namespace for merged changes.** It differs per host, and getting it wrong silently drops the largest off-branch source:

   | Host | Namespace | Fetch refspec |
   |---|---|---|
   | GitHub | `refs/pull/<n>/head`, `refs/pull/<n>/merge` | `+refs/pull/*/head:refs/pr/*` |
   | GitLab | `refs/merge-requests/<n>/head` | `+refs/merge-requests/*/head:refs/mr/*` |
   | Bitbucket, Gitea/Forgejo, Azure DevOps | varies; often not advertised | list with `git ls-remote <url>` and read what is there |

   Do not guess. `git ls-remote <url> | awk '{print $2}' | sed 's#/[0-9]*/#/*/#' | sort -u` prints the namespaces the remote actually advertises.

---

## Phase 1 — A scratch clone, never the user's checkout

```bash
git clone --no-checkout <url> <scratch>/salvage.git   # --no-checkout: no working tree needed
cd <scratch>/salvage.git
```

`--no-checkout` keeps this cheap: the report needs commit metadata, never file contents. For a local target, clone the local path rather than operating in it.

If a mirror backup was supplied, add it as a remote now — it costs one fetch and is usually the richest single source:

```bash
git remote add backup <path-to-mirror.git>
git fetch backup '+refs/*:refs/bak/*'
```

Fetching `refs/*` rather than `refs/heads/*` matters: a mirror holds the pull-request refs and tags too, and those carry commits the branches never did.

---

## Phase 2 — Everything the remote still advertises

```bash
git fetch origin --tags --force
git fetch origin '+refs/pull/*/head:refs/pr/*'        # or the namespace from Phase 0
git for-each-ref --format='%(refname)' | wc -l         # how many refs are now in play
git rev-list --all | sort -u | wc -l                   # baseline commit count
```

Record that baseline. Everything Phase 3 adds is history the remote no longer advertises, and the difference between the two numbers is the headline finding.

**Merged pull requests are the quiet source.** Their `head` refs are refs, so garbage collection never touches what they reach. A pull request branched off a since-erased tip drags its whole ancestry along permanently — in the measured case, 20 such refs kept 88 commits of a deleted history alive.

---

## Phase 3 — Every ref state the host recorded

This is the phase that recovers what nothing else can.

**The activity log is a list of ref states, not commits.** Each row carries `before` and `after` SHAs for a push, force-push, branch creation or deletion. Those SHAs are tips that once existed; fetching one recovers it *and its entire ancestry*, which is how a 40-row log yields hundreds of commits.

```bash
R=<owner>/<repo>
for p in 1 2 3 4 5; do
  gh api "repos/$R/activity?per_page=100&page=$p" --jq '.[] | .before, .after'
done | grep -v '^0\{40\}$' | sort -u > shas.txt
wc -l < shas.txt
```

- Paginate until a page comes back empty; a repository with a long life has more than one page.
- `grep -v '^0\{40\}$'` drops the all-zero SHA, which is how a creation or deletion writes "nothing was here".
- `--jq '.[] | .timestamp, .activity_type, .ref, .actor.login'` on the same endpoint gives the human-readable log, worth capturing alongside as context for *why* a state existed.

Then fetch each one. **This is the step that works where the REST API does not:**

```bash
i=0
while read s; do
  if git fetch --quiet origin "$s" 2>/dev/null && git cat-file -e "$s^{commit}" 2>/dev/null; then
    i=$((i+1)); git update-ref "refs/salvage/$i" "$s"
  else
    echo "unreachable: $s" >> gone.txt
  fi
done < shas.txt
```

Four things this loop gets right, each of which is a way it goes wrong otherwise:

- **`git fetch origin <sha>` retrieves commits no ref points at.** `gh api repos/$R/commits/<sha>` answers `422 No commit found for SHA` for the same object. Reach for the protocol, not the API; an agent that tries REST first concludes the history is gone when it is one fetch away.
- **`git update-ref` is what makes the fetch stick.** A bare `git fetch <sha>` leaves the object reachable only through `FETCH_HEAD`, which the next fetch overwrites. Without a ref per SHA, `git log --all` never sees them and the whole phase silently yields nothing.
- **`^{commit}` peels, and some rows are not commits.** An annotated tag's SHA appears in the log like any other; peeling turns it into the commit it names, and a row that peels to nothing is a tag object, not a loss.
- **A failure is recorded, not swallowed.** `gone.txt` is a finding — the count of ref states the host no longer serves belongs in the report, and it is the only honest measure of what aged out.

**GitLab.** There is no `activity` endpoint. `GET /projects/:id/events` carries push events with commit data under `push_data`, and `glab api "projects/<url-encoded>/events?per_page=100"` reaches it — but the field names and how far back an instance retains events differ, so read one response before scripting against it and report the endpoint as verified or not. Self-managed instances vary further. Other hosts: check for an equivalent, and when there is none, declare Phase 3 **unavailable** rather than passed.

---

## Phase 4 — Local sources the host never saw

Run these against the user's own checkout **read-only**, and against any other clone they name. They reach commits that were never pushed at all:

```bash
git -C <checkout> reflog --all --date=iso --format='%H %gd %gs'   # local rewrites, rebases, resets
git -C <checkout> fsck --lost-found --no-progress 2>&1 | grep '^dangling commit'
git -C <checkout> stash list --format='%H %gd %gs'
```

Anything they turn up gets fetched into the scratch clone the same way:

```bash
git remote add local <checkout>
git fetch local '+refs/*:refs/loc/*'
git fetch local <dangling-sha> && git update-ref refs/salvage/local-<n> <dangling-sha>
```

`fsck` output is worth reading rather than piping blindly: a dangling commit from an aborted rebase is noise, one from a `reset --hard` over unpushed work is the whole point.

---

## Phase 5 — Assemble the report

One row per distinct commit, sorted by author date, marked for whether the current default branch still reaches it.

```bash
git rev-list origin/<branch> | sort > on-branch.txt

git log --all --date=short --format='%H%x09%ad%x09%an%x09%s' \
  | sort -u -t"$(printf '\t')" -k1,1 \
  | while IFS=$'\t' read -r sha date an subj; do
      grep -qx "$sha" on-branch.txt && f='*' || f='.'
      printf '%s  %s  %s  %-22s %s\n' "${sha:0:8}" "$f" "$date" "${an:0:22}" "$subj"
    done | sort -k3,3 -k1,1
```

- `sort -u -k1,1` on the full SHA is what deduplicates a commit found in four sources.
- Sorting the *output* by date rather than the input keeps the flag column aligned with a stable secondary key, so two runs produce identical files.
- Subjects only. A body-per-commit turns a 300-row answer into a document nobody reads; the caller who wants one has the SHA.

### Output format

Reproduce this exactly — the header is what makes the file readable a year later, when nobody remembers which sources were merged:

```text
<PROJECT NAME> — every commit the repository has ever held
<repository url>
generated <YYYY-MM-DD HH:MM UTC>

Sources, merged and deduplicated:
  · origin/<branch> and tags                        current history
  · refs/pull/*  (<N> refs)                         commits kept alive by pull requests
  · mirror backup <name>.git                        the history erased on <date>
  · every before/after SHA in Insights -> Activity  <N> ref states, <N> still fetchable
    (retrieved with 'git fetch origin <sha>' — the REST API refuses unreachable commits)

total <N> commits · <N> of them on the current <branch>

Column 2:  *  = reachable from origin/<branch> today
           .  = erased, orphaned, or living only on a pull-request ref

==============================================================================
079d53ab  *  2026-04-07  khasky                 chore(tauri): add the rust crate and its bundle configuration
2052f425  .  2026-04-12  khasky                 Initial commit
40f357fa  *  2026-04-13  khasky                 feat(tauri): run child processes without flashing a console window
```

Omit a source line entirely when that source did not apply — a listed source with a zero next to it reads as "checked and empty" when it usually means "not available", and those are opposite claims.

### Report alongside the file

- **The two counts.** Total distinct commits, and how many the current branch reaches. The gap is the answer to "what did the rewrite destroy".
- **Authors across the whole set** (`git log --all --format='%an <%ae>' | sort | uniq -c | sort -rn`). Bot commits and name-capitalization variants that exist only off-branch are usually a surprise, and they are what defeats a contributors-sidebar cleanup.
- **The earliest commit, and whether the current history predates it.** A rebuilt history that starts before its own `Initial commit` is visible in one line of this file.
- **Ref states that no longer resolve**, counted from `gone.txt`.
- **What this cannot reach**, always: commits that were never a pushed tip, never on a surviving ref, and are in no backup or reflog. The activity log records ref states; a commit that only existed mid-branch has no row.

---

## Phase 6 — Leave nothing behind

The scratch clone is disposable; say where it is and let the user delete it. Do **not** delete a mirror backup — it may be someone's only rollback path, and this skill never created it.

If the salvage turned up commits the user did not know were still public — a leaked secret in an erased commit is the usual one — that is a finding to raise immediately, not a line in a table. Unreachable is not deleted: the objects are still served by SHA, exactly as this skill just proved. The fix is rotation, never another rewrite.

## Guardrails

- Read-only against every remote. No push, no ref deletion, no history change.
- The user's checkout is never the workspace, and never gains a ref. Phase 4 reads it and nothing more.
- Every count in the report is measured, never estimated. A source that could not be consulted is named as unavailable, not omitted.
- `git fetch origin <sha>` is the retrieval path; the REST commit endpoint is not a substitute and returns `422` on exactly the commits that matter.
- Each recovered SHA gets its own ref. Without `git update-ref`, the fetch is lost on the next one.
- The completeness limit is stated in the report, every time — a file titled "every commit" that quietly is not one is worse than a shorter honest list.
- Finding a secret in a recovered commit means rotation. Nothing here makes a published object unreachable, and no rewrite does either.
