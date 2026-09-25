# Replay and verification

The exact commands for Phase 6 (replay), Phase 7 (local verification), Phase 8 (force-push) and Phase 9 (proving the published tree), plus the caveats the tree-hash proof does not cover. Read the matching section while running that phase.

## Replay commands (Phase 6)

```
git checkout --orphan <rebuild-branch>
git rm -r --cached . -q                 # working tree untouched; index emptied
git status --porcelain | wc -l          # every tracked path now shows as untracked — record this count
```
```
for each planned subject:  echo "<subject>" | npx --no-install commitlint     # or the repo's own validator
```
Then, per row of the approved plan:
```
git add -- <paths of this row>
git diff --cached --name-only            # must equal the planned path set exactly
GIT_AUTHOR_DATE="@$T $OFF" GIT_COMMITTER_DATE="@$T $OFF" git commit -m "<subject>" [-m "<body>"] [-s] [-S]
```
- Hooks run. Never `--no-verify` by default: a repo that enforces a rule means it. If a `pre-commit` hook fails on an intermediate partial tree (a type-checker or a full-project linter that cannot see files not yet committed), stop and hand the user the choice — coarsen the split so each commit is self-consistent, or accept `--no-verify` for intermediate commits only, disclosed in the final report. If a hook *rewrites* files (formatters via lint-staged), the Phase 7 tree check will catch the drift; do not paper over it.
- `--mode bisectable` — run the repo's build or test command after each commit; a failure stops the run at that commit for regrouping.
- Keep a running counter of paths committed against the inventory total, so a gap is visible at the commit that caused it and not at the end.
- The replay ends when the last row of the plan is committed or a hook or `--mode bisectable` failure has stopped it for the user's choice. The counter is a progress line inside the work, not a place to end the turn with rows still to commit.
Submodules and LFS: `git add` on a submodule path re-adds the gitlink, and LFS pointers commit like any other file — both survive the replay as long as `.gitmodules` and `.gitattributes` are in the same or an earlier commit than the paths they govern.

## Local verification commands (Phase 7)

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
```bash
# every sha quoted in the tree still resolves in the history about to be published (step 22's list)
git grep -hoE '\b[0-9a-f]{7,40}\b' -- ':!*.lock' ':!*lock.yaml' ':!*.sum' | sort -u |
  while read s; do git cat-file -e "$s^{commit}" 2>/dev/null || echo "dangling: $s"; done
# no commit is dated after an artifact in the tree that it is supposed to have produced
git log --format='%h %ad %s' --date=short | grep -iE 'release|changelog|version'
```

## Force-push commands (Phase 8)

```
git push --force-with-lease=<branch>:<OLD_SHA> origin <branch>
git ls-remote origin <branch>            # sha equals the new HEAD
```

## Published-tree proof (Phase 9)

Phase 7 proved the *local* rebuild. This proves what the host actually serves — a separate fact, and the one the user cares about: after the republication, is the code on the remote still exactly the code that was there before the history was erased. Push failures are loud, but a partial push, LFS objects that never reached the LFS server, a branch that was not the one everyone reads, and someone else's push landing between the backup and the force-push are all quiet.
A push does not rewrite anything in flight: `git push` transfers objects that already exist, byte for byte, and `.gitattributes` renormalization runs back at `git add`. So what this phase catches is *which objects arrived and under which ref* — never an object that changed on the way out.
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
- LFS content. Under Git LFS the tracked blob is a ~130-byte pointer and the bytes live on the LFS server. Equal tree hashes prove the *pointers* match and say nothing about whether the objects were uploaded — the one case where "the hashes match" and "the files are there" genuinely come apart, and the reason a rebuild can pass every check above and still serve broken files. Repo has LFS → verify separately in the fresh clone (`git lfs fsck`, and `git lfs ls-files -s` against the same listing from the backup) and report that result on its own line.
- Submodule contents. A gitlink entry carries the submodule's commit sha, so an equal tree proves the *pointer* is unchanged. It says nothing about the submodule repository still serving that commit. Run `git submodule update --init` in the verification clone and report it, or state the submodules as unverified.
- Untracked and ignored files were never in the history and are not on the remote either — before and after are equally empty of them, which is correct, not a loss.
- Working-tree bytes after checkout can legitimately differ from the old checkout when `.gitattributes` renormalizes line endings or LFS smudges pointers. That is a checkout-filter difference, not a content loss — but if the repo has such filters, verify one representative file by hand (`git show refs/backup/<branch>:<path> | git hash-object --stdin` against `git rev-parse HEAD:<path>`) so the report says which it was.
