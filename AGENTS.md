# AGENTS.md

Rules for this repository, on top of whatever global guidance an agent already loads.

## Examples in a skill are abstract, never real

A skill teaches a rule; it never carries a sample of anyone's actual work. Every example in `SKILL.md` and in `references/` is a shape or a placeholder — what the sentence does, not the sentence itself.

Never a real post, a real account, a real person's text, a captured run, a screenshot of one, or anything copied from the author's own published writing. Two reasons, each sufficient: that material is private and does not belong in a published skill, and a sentence printed in a skill comes back verbatim in the next run's output.

## No evals, in any form

This repository has no eval concept and no files for one. No `evals/` folder, no cases, no fixtures, no known-good and known-bad pairs, no runner, and no mention of any of it inside a skill.

A check a script makes is proved by that script's own `--self-test`, which needs nothing stored. A rule a skill states is proved by reading it.

A skill folder holds `SKILL.md` plus `references/` and `scripts/`, and nothing else.

## The plugin version moves with the skills

`.claude-plugin/plugin.json` holds the only version number in the repository, and a user installed through the Claude Code plugin path sees new work only when that number changes. Bump it inside the same commit as the change that earns it, one step per commit, never in a commit of its own:

- **Patch** — anything inside a skill that already exists: wording, a `references/` file, a `scripts/` fix.
- **Minor** — a skill folder added.
- **Major** — a skill folder removed or renamed, because an invocation that worked stops working.

A commit that does several of these takes the highest step it earns. Nothing outside `skills/` moves the number: the README, this file, CI and the manifests themselves ship without a bump.
