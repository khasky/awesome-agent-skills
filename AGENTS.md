# AGENTS.md

Rules for this repository, on top of whatever global guidance an agent already loads.

## Examples in a skill are abstract, never real

A skill teaches a rule; it never carries a sample of anyone's actual work. Every example in `SKILL.md` and in `references/` is a shape or a placeholder — what the sentence does, not the sentence itself.

Never a real post, a real account, a real person's text, a captured run, a screenshot of one, or anything copied from the author's own published writing. Two reasons, each sufficient: that material is private and does not belong in a published skill, and a sentence printed in a skill comes back verbatim in the next run's output.

## No evals, in any form

This repository has no eval concept and no files for one. No `evals/` folder, no cases, no fixtures, no known-good and known-bad pairs, no runner, and no mention of any of it inside a skill.

A rule a skill states is proved by reading it, and a check it prescribes is proved by running it on the work in hand.

## Text only: a skill instructs, it never ships code

A skill folder holds `SKILL.md` plus `references/`, and nothing else. No `scripts/`, no `templates/`, no `.mjs`, `.py`, `.sh`, `.ps1`, `.html`, `.json` fixture, no binary, no file that exists to be executed or copied into the user's project. Markdown is the only format a skill ships.

The reason is where the work happens. An agent reading a skill knows its own platform, its own shell, its own language runtimes and what the user's repository already has; a file written here months ago knows none of that, and running it puts the author's code on someone else's machine. So a skill says what to check, what counts as a pass, what the thresholds are and what evidence to report — and the agent writes whatever it needs, in whatever language fits, or performs the check by reading.

This binds the wording too: a skill never prints a script for the reader to paste, never specifies a command-line interface, a flag set, a file layout for a checker, or the shape its output should take as code. A one-line shell command against a standard tool stays welcome where it is the clearest way to say what to look for; a program does not, however short. The line is what the block is for: code that is the subject being taught — what a typed error looks like in the reader's own codebase, the markup an accessible control needs, a configuration entry — is the skill's content and stays; a routine the reader is meant to run against their project is the thing this rule removes, and it is written as what to do instead.

One exception, and it is about knowledge rather than convenience. `awesome-content-publisher` drives other people's live composers through a browser-automation API, and there the exact call sequence — which event, in which order, with which arguments, and what to read back before the next step — is the finding itself: it was established by running against those editors, and it stops being reproducible the moment it is paraphrased. Its browser snippets stay as code. The exception is that narrow: driving an external interface whose behaviour had to be learned by using it. It never covers a checker aimed at the reader's own project, and it ships no file either — the code sits in the reference page that explains why each step is there.

A check that cannot be written as an instruction with a stated threshold and stated evidence is not ready to be in a skill.

## The plugin version moves with the skills

`.claude-plugin/plugin.json` holds the only version number in the repository, and a user installed through the Claude Code plugin path sees new work only when that number changes. Bump it inside the same commit as the change that earns it, one step per commit, never in a commit of its own:

- **Patch** — anything inside a skill that already exists: wording, a `references/` file.
- **Minor** — a skill folder added, or what a skill ships changing shape under an installed user (a file they could open or invoke leaving the folder).
- **Major** — a skill folder removed or renamed, because an invocation that worked stops working.

A commit that does several of these takes the highest step it earns. Nothing outside `skills/` moves the number: the README, this file, CI and the manifests themselves ship without a bump.
