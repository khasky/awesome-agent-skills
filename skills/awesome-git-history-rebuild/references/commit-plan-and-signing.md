# Commit plan and signing

Detail behind Phase 2 (signing), Phase 3 (source inventory) and Phase 4 (the commit-plan approval loop): read the matching section while running that phase.

## Signing (Phase 2)

Signing — the one property of a rebuild a reader can verify cryptographically, and the default this skill argues for. A signature covers the commit object; every object here is new, so the old signatures do not survive under any strategy. That leaves two outcomes and they are not equivalent: a rebuild that signs replaces a Verified history with a Verified history, and one that does not hands anyone reading it a whole log of `"verified": false` — a single API field that summarises the rewrite more compactly than any other check. Signing is honest here precisely because it makes no claim about the past: it attests that *this* identity made *these* objects, which is exactly what happened.

Detect what the repository and the account already do, then decide:
```bash
git config --get commit.gpgsign; git config --get gpg.format; git config --get user.signingkey
gh api "repos/<owner>/<repo>/commits?per_page=30" --jq '.[].commit.verification.verified' | sort | uniq -c
ssh-add -l                                     # SSH signing keys the agent holds
gpg --list-secret-keys --keyid-format=long     # GPG keys
gh api user/ssh_signing_keys --jq '.[].title'  # keys the host will actually trust for signatures
```
- A `required_signatures` ruleset (step 11) makes signing mandatory — the push is rejected without it, so this is settled before Phase 4, not discovered at Phase 8.
- `--sign on` with no usable key is a preflight failure, not a fallback to unsigned.
- A key the host does not know produces `Unverified` on every commit, which is worse than plain unsigned. For SSH signing the key must be registered as a *signing* key, not only as an authentication key — they are separate lists on GitHub, and the same public key in the wrong one silently yields `Unverified`. Confirm with `gh api user/ssh_signing_keys` before committing 30 objects.
- Signing costs a passphrase prompt per commit unless the agent holds the key; load it before Phase 6 rather than answering 30 prompts.

## Source inventory (Phase 3)

   ```
   git ls-files | wc -l
   git ls-files | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn
   ```

## `--plan` coverage validation (Phase 4)

   ```bash
   comm -23 <(git ls-files | sort) <(plan_paths | sort)     # in the tree, not in the plan
   comm -13 <(git ls-files | sort) <(plan_paths | sort)     # in the plan, not in the tree
   ```

Then present the parsed plan as the same table below, marked as *supplied*, and take the same approval. The user may still adjust or re-split; a re-split abandons the file and builds the plan here, which the report records.

What the plan file does not carry, and this run still decides: timestamps and pacing (Phase 5 — a plan file has no dates by design), signing, sign-off, trailers, and every gate-#1 answer. A supplied plan shortens Phase 4, not the ceremony around it.

## Example plan table and what to show alongside it (Phase 4)

```text
 #  type(scope)          subject                                     paths                        files  ±lines  changelog
 1  chore                scaffold the <stack> workspace              package.json, tsconfig…         12    +420  hidden
 2  feat(storage)        persist state in a lock-guarded store       src/storage/**                   4    +610  Features
 …
```

Alongside the table, always show:

- Coverage proof — `N tracked paths, all assigned exactly once, 0 unassigned`. An unassigned path is a stop, not a rounding error.
- Changelog preview — the sections a generated changelog would contain, given the repo's release tooling and hidden types.
- Mode and pacing — `story` or `bisectable`, plus the span and session count about to be used, and whether the span was measured from the old history or chosen by the user.
- What the plan does not claim — in `story` mode, that intermediate commits are not built or tested.

## Re-split strategies A-F (Phase 4)

  - A. Layered (default) — infrastructure → domain → adapters → UI → tests → CI → docs.
  - B. Feature-vertical — one commit per user-visible capability, full stack each.
  - C. Reconstructed — follow the *real* old history from `old-history.txt`, condensed into its actual topics. The most honest shape available when the old log is rich.
  - D. Coarse or fine — the same strategy at a different granularity (5–9 commits versus 20–40).
  - E. Changelog-first — grouped so the generated release notes read as a feature list, hidden types swept into setup commits.
  - F. Manual — the user supplies or edits the grouping directly; this skill only validates coverage and message format. A plan file passed with `--plan` is this strategy, already written down.
