# AGENTS.md

Rules for this repository, on top of whatever global guidance an agent already loads.

## Examples in a skill are abstract, never real

A skill teaches a rule; it never carries a sample of anyone's actual work. Every example in `SKILL.md` and in `references/` is a shape or a placeholder — what the sentence does, not the sentence itself.

Never a real post, a real account, a real person's text, a captured run, a screenshot of one, or anything copied from the author's own published writing. Two reasons, each sufficient: that material is private and does not belong in a published skill, and a sentence printed in a skill comes back verbatim in the next run's output.

## Evals measure a description, and they live outside the skill

A rule a skill states is proved by reading it, and a check it prescribes is proved by running it on the work in hand. Neither settles the one question reading cannot reach: whether a description fires on the prompts it should and stays quiet on the ones it should not. With forty-odd skills whose boundaries touch each other, that is decided by measurement or it is not decided at all. So evals are allowed, on these terms.

**A set lives where the convention puts it, inside the skill it measures.** `<skill>/evals/eval_queries.json` holds the trigger set, `<skill>/evals/evals.json` the output cases. That is what the published practice specifies and what the tooling that runs these loops looks for, and a set that travels with its skill cannot drift away from the description it was written against. Those two filenames are the entire allowance: no third file, no `files/` fixtures, nothing that executes. What an installed user gains is a few kilobytes of text that no run ever opens - the body still loads at activation, `references/` still loads on demand, and `evals/` is read by nobody but the maintainer measuring a description.

**Run output is not repository content.** Iterations, gradings, benchmarks, transcripts, and any input file a case needs stay outside the clone, in the agent's own scratch folder. They go stale the moment a model version moves, they carry whatever the run happened to read, and a committed fixture is the exact thing the first rule of this file forbids.

**No runner is committed.** The text-only rule holds here too: the agent writes the loop its own client needs, on its own platform, and throws it away afterwards. What is committed is the cases.

**The cases are invented, like every other example in this repository.** No real post, no real account, no captured run, nothing from anyone's published writing. A realistic prompt means an invented path and an invented product name, not a real one.

**A trigger set is around twenty queries, half of them negative, and the negatives are near-misses** — the prompt that belongs to the sibling skill one boundary away, not a prompt about the weather. A negative names that sibling in `belongs_to` when one owns it. The train and validation split is written into the file once and never reshuffled, because a split that moves between iterations measures itself rather than the description.

**A set is required where the risk is**: a new skill whose description overlaps one already here, and any rewrite of a description. Everywhere else it is optional.

**A claim about triggering is a number or it is nothing.** Trigger rate over at least three runs per query, with the model and the date recorded beside it. "Triggers reliably" with no run behind it is exactly what this section exists to stop, and an unrun set proves no more than an unwritten one.

**Fix the category, not the keyword.** A should-trigger query that failed marks a gap in what the description covers; pasting that query's own words into the description buys that query and nothing beyond it. Choose the iteration by its validation pass rate, which is often not the last one written.

**The loop costs real sessions** — twenty queries at three runs each is sixty of them. Ask before spending that, and never wire it into CI.

`scripts/lint.py` checks the shape of what is committed: the folder carries those two filenames and nothing else, each file parses, a trigger set holds both positive and negative cases, repeats no query, labels every split `train` or `validation`, and points `belongs_to` at a real sibling rather than at the skill under test.

## Text only: a skill instructs, it never ships code

A skill folder holds `SKILL.md`, `references/`, and the `evals/` pair above, and nothing else. No `scripts/`, no `templates/`, no `.mjs`, `.py`, `.sh`, `.ps1`, `.html`, no fixture, no binary, no file that exists to be executed or copied into the user's project. Markdown is the format a skill ships; the two eval files are data a maintainer measures with, and no run reads them.

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
