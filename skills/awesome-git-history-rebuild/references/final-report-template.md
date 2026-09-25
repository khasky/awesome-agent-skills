# Final report template

The Phase 13 report template, filled with this run's own values, and the manual-residuals disclosures that go with it. Read this before presenting the final report.

## Report template

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

## Manual residuals

Manual residuals — say these plainly, they cannot be done by command:

- Open PRs reference commits that no longer exist; close or recreate them.
- Forks and existing clones keep the old history; a rewrite cannot reach them.
- Intermediate commits are not built in `story` mode — `git bisect` across this history is unreliable by construction.
- `--no-verify` was used on intermediate commits, if it was. Name which.
- The contributors sidebar still lists the old accounts if the gate-#1 answer was *leave*, and can keep listing them even after a cache rebuild if merged `refs/pull/*` refs hold their commits. Ask the user to check the rendered page — the run never saw it, and the API does not answer for it.
- The pull request history is untouched and cannot be cleaned. Every PR keeps its number, title, author and timeline, Insights → Pulse keeps reporting the merged ones, and no API deletes a PR — only deleting and recreating the repository would, at the cost of every issue, star, watcher, release and asset, the Actions history and secrets, the traffic stats and the creation date. Give the counts from Phase 0 step 16: `<N>` PR records, and `<C>` commits still served through `refs/pull/*` that the new tip does not contain, by `<authors>`. Those commits are reachable refs, so garbage collection never removes them — the old history stays retrievable from this repository indefinitely, by anyone, with `git fetch origin 'refs/pull/*/head:refs/pr/*'`. That is why the wipe is not total, why a bot can stay in the sidebar, and why "the old commits will be GC'd eventually" is true only of commits no PR ref reaches.
- Merged PRs left unreconciled (decision #5 answered *leave*) each keep a page saying they were merged into `<branch>` at a sha the branch no longer contains. Name the count. If they were attributed instead, name the commits that carry the `Refs:` and `Co-authored-by:` trailers.
- Kept tags hold the old commits reachable, so the old history is not gone from the remote. Name them.
- The history reads as a rebuild to anyone who checks, and no pacing model, signature or date policy changes that. Say it once, plainly, with the four things that give it away, rather than letting the user believe the dates are the whole story:
  - `git log --diff-filter=M` is empty — every path is added once and never modified, so the whole series is `+N −0`. A real history deletes lines.
  - The host's activity log carries the `force_push` with both SHAs, the actor and the real timestamp, publicly and permanently (Phase 0, step 18).
  - `refs/pull/*` still serves `<C>` commits of the old history, oldest `<date>`, retrievable with one `git fetch`.
  - Files in the tree — a changelog, a badge, a manifest version — describe the history that was erased, unless Phase 10 repaired them.

  The point of the rebuild is a log that is readable, not a log that is unfalsifiable. A user who wants the second thing is asking for something no tool provides, and should hear that in one sentence at gate #1 instead of discovering it from a stranger's forensic write-up.
- The activity log cannot be cleared, overwritten or aged out (30 days applies only to the events feed). Deleting and recreating the repository is the only thing that removes it, at the cost of every issue, PR, star, watcher, release, asset, Actions history, secret, traffic stat — and the creation date, which is itself evidence. It is not offered here.
- A leaked secret, if one was found, still needs rotating.
- The backup stays until the user confirms the remote is good. This skill never deletes it.
