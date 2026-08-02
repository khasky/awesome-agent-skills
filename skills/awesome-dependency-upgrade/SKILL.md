---
name: awesome-dependency-upgrade
description: "Plans and executes dependency upgrades safely — batching by risk, changelog-driven major migrations, overrides for unfixed CVEs, verification between steps, one revertable commit per batch. Use when asked to 'upgrade dependencies', 'bump packages', 'fix the audit findings', 'update to the latest version', 'обнови зависимости', or to act on an awesome-dependency-audit report. Do not use for detection and risk assessment — use awesome-dependency-audit; adding a brand-new dependency is an ask-first decision outside this skill."
license: MIT
metadata:
  author: Khasky
  tags: ["dependencies", "upgrade", "supply-chain", "maintenance"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-dependency-upgrade"
---

# Dependency Upgrade

Execute dependency upgrades so that each step is verified and each batch is revertable. The failure mode this skill exists to prevent: a bulk bump to `latest`, a green-looking build, and a runtime break three days later that `git bisect` can't isolate because fifteen packages moved in one commit.

## When to Activate

- "Upgrade/update dependencies", "bump X to v9", "fix `npm audit`", a bot PR needs handling.
- An **awesome-dependency-audit** report produced findings to remediate — this skill is its acting half.

Do **not** activate to decide *whether* a package is risky (the audit owns detection) or to add a new dependency (ask-first, outside both skills).

## Work Process

1. **Inventory before touching** — for each candidate: current resolved version (lockfile, not manifest), target version, direct or transitive, and why it's moving (security fix, feature need, hygiene). No reason → it waits; churn is not hygiene.
2. **Classify by risk and batch accordingly** — lockfile-only refreshes and patch/minor bumps of well-locked packages batch together; every **major** goes alone, one at a time. Security-driven bumps jump the queue but follow the same verification.
3. **One upgrade concern per commit** — never mix an upgrade with feature work or refactoring; the commit message names what moved and why. A batch is one revertable unit: if it breaks, one `git revert` restores the world.
4. **Majors are changelog-driven, not semver-trusted** — read the release notes and migration guide for every major: the breaking-changes list is the work plan, not a formality. Run the project's codemod where one is offered before hand-editing. Semver is a promise, not a guarantee — treat "minor" bumps of frameworks and build tooling with major-grade suspicion, and check the installed version's own docs for renamed APIs rather than trusting memory.
5. **Verify between batches, not at the end** — after each batch: install from lockfile, typecheck/build, full test suite, and read the output (exit codes, not vibes). A failure identifies its batch immediately; that is the entire point of batching.
6. **Review the lockfile diff as code** — every added or changed entry accounted for by the manifest change that caused it; a surprise new package, a changed registry URL, or a new install script in the diff is a stop-and-investigate, not a shrug (`awesome-dependency-audit` Track A/B rules apply to the diff).
7. **Unfixed transitive CVE** — when no upstream fix exists: pin with `overrides`/`resolutions`/`constraints`, comment the CVE id and the removal condition ("remove when `send` ≥ 0.19 reaches `express`"), and record it in the report. An override without a removal condition is how temporary pins become permanent archaeology.
8. **Bot PRs get the same treatment** — automerge only patch-level bumps with a lockfile and a trustworthy CI suite; group bumps regenerate, never hand-merge conflicting lockfiles. A bot PR whose lockfile diff contains more than its manifest claims is declined and investigated.

## Rules

- **Pin build-time executors exactly** — anything running at build/CI time (`npx pkg@x.y.z`, codegen, formatters) moves by explicit pin, never floats.
- **Deprecated before deleted** — an upgrade that surfaces deprecation warnings schedules their fixes now, while the migration guide is open; ignoring them stores the same work for a worse day.
- **Peer-dependency conflicts are decisions** — forcing resolution (`--force`, `--legacy-peer-deps`) hides an incompatibility; resolve it by choosing versions, or record the accepted mismatch and why.
- **Ecosystem-agnostic** — the same discipline holds for `package.json`/lockfile, `requirements.txt`/`poetry.lock`, `go.mod`, `Cargo.toml`, `pom.xml`/gradle, `Gemfile.lock`; only the freeze and override mechanisms change names.

## Output Format

```text
Dependency Upgrade — <scope> — <date>

Upgraded:
- <package> <from> → <to> [major|minor|patch] — <reason> — verified: <suite/build result, exit 0>
Pinned (no fix available):
- <package> — <CVE> — override with removal condition: <condition>
Deferred:
- <package> — <why: breaking migration unscheduled / peer conflict / needs owner decision>

Batches: <N commits, each independently revertable>
Lockfile diff: <clean | findings raised>
Remaining risk: <what was not verified and why>
```

## Anti-patterns

| Anti-pattern | Instead |
|---|---|
| Bulk bump to `latest` in one commit | Risk-classified batches, majors alone |
| Upgrade mixed into a feature branch | Its own commit/PR, named and revertable |
| Trusting semver over the changelog | Release notes read for every major; codemods run |
| Silencing the scanner with an unconditioned override | CVE id + removal condition, recorded in the report |
| Verifying once at the end of fifteen bumps | Verification between batches — failures name their batch |
| Hand-merging a conflicted lockfile | Regenerate from the manifest; lockfiles are outputs, not sources |
| `--legacy-peer-deps` as a reflex | Resolve the conflict or record the accepted mismatch |
