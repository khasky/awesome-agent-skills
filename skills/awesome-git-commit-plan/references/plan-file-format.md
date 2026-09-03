# Plan file format

The plan file is the skill's only output. It is a working document for whoever executes the split — by hand, or through `awesome-git-history-rebuild`. Everything a reviewer needs once and a file should not carry forever (the module map, the coverage proof, the gate ladder, what could not be verified) goes in the chat report instead.

## The shape

```text
#<N>  <type>(<scope>): <subject>

<optional body, wrapped under 80>

FILES (<count>):
  <path>
  <path>   -- slice: <what part of this file lands here>

#<N+1>  <type>: <subject>

FILES (<count>):
  <path>
```

Rules the format enforces:

- **The file starts with `#1`.** No title, no summary paragraph, no how-to-execute section, no legend, no table of contents. The first byte of the file is `#`.
- **The file ends with the last commit's file list.** No closing notes, no alternatives, no next steps.
- **Plain `#1` to `#N`.** No prefix letter, no zero padding, no ranges.
- **No dates, no timestamps, no durations, anywhere.** Pacing is a property of execution, and the tool that executes decides it.
- **One blank line** between the number line and the body, between paragraphs, and between the last body paragraph and `FILES`. Two blank lines between commits.
- **`FILES (<count>)`** where the count is the number of paths listed. It exists so a reader can check the list against it without counting.
- Paths are indented two spaces, in the order they should be staged, relative to the repository root.
- A commit with no body goes straight from its number line to `FILES`.

## Sliced files

A file introduced across several commits carries a slice note on its own line, after the path:

```text
  src-tauri/src/lib.rs   -- slice: run with the builder and the generated context
```

The note names the part in words, not in symbol lists. It has to be enough for a person to cut the file by hand, and short enough to read. Mechanical additions that repeat across many commits (one module line per module, one handler entry per command) are stated once in the first slice note and not repeated.

The same path may appear in several commits only when every occurrence carries a slice note. A path appearing twice without one is a duplicate assignment, which Phase 4 treats as a stop.

## Worked example

```text
#1  chore: scaffold the react and vite workspace

Vite, React 19, strict TypeScript, pnpm, and LF pinned in the index. The entry
point lands later with the shell that fills it.

FILES (8):
  .gitattributes
  .gitignore
  package.json
  pnpm-lock.yaml
  tsconfig.json
  tsconfig.node.json
  vite.config.ts   -- slice: plugins and the dev server, no test block
  src/vite-env.d.ts


#2  build: format and lint the workspace with biome

One tool for formatting, linting and import order. A few rules are stricter
than the preset.

FILES (1):
  biome.json


#3  test: set up the vitest dom environment

FILES (2):
  src/test/setup.ts
  vite.config.ts   -- slice: the test block


#4  feat(storage): serialize every state change through one lock

Commands run on a thread pool, and two overlapping load-change-save sequences
lose one of the changes with nothing reported. A profile is saved from the form
while the tray switches the active one, and the activation is gone.

Saving goes through a temp file and a rename. A file that fails to parse is
copied to a timestamped backup and reported as an error. Replacing it would let
the next save overwrite everything the user had.

FILES (1):
  src/storage.rs
```

Note what the example does not contain: no date lines, no ruler bars, no `C01`, no gate annotations, no explanation of why `#3` has no body, and no section before `#1`.

## What never appears in the file

| Not in the file | Where it goes |
| --- | --- |
| Dates, timestamps, timezone, span | nowhere — execution decides pacing |
| The module map, layers, dependency graph | chat report |
| Coverage proof and the unassigned count | chat report |
| The gate ladder and verification results | chat report |
| Granularity or strategy rationale | chat report |
| Alternative splits | chat report, offered as a re-split |
| A reference from one commit's body to another commit | nowhere — see rule 3.9 of the message rules |
| "How to execute" instructions | nowhere — the executing skill carries them |

## Naming

Default file name `<repo-name>-commits.txt`, written next to the repository rather than inside it, so a plan for a repository does not become a tracked file of that repository on the next `git add`. Overridable with `--out`.
