# Documentation set

The shape of what the run writes: which files, what each contains, and the rules every page follows. The layout separates the four kinds of documentation a reader looks for — understanding (explanation), looking something up (reference), getting a task done (how-to), and getting started (tutorial) — because a page that mixes them serves none well.

## Contents

- File layout
- What each document contains
- Module document
- Symbol entry
- Diagrams
- Citations and evidence
- Writing rules
- Size and depth

## File layout

Relative to the output folder. Omit any document the project gives no material for; never write an empty one.

```text
index.md                  entry point: what the project is, a map of the set, the commit it describes
getting-started.md        prerequisites, install, run locally, run the tests, first change
architecture.md           context, units, modules and layers, cross-cutting concerns, decisions
flows/<flow-name>.md      one end-to-end path per file
modules/<unit>/<module>.md   one page per module (units as folders only in a monorepo)
reference/api.md          HTTP or RPC endpoints
reference/cli.md          commands, arguments, flags, exit codes
reference/events.md       events, messages, queues, webhooks
reference/data-model.md   entities, relations, schema, migrations workflow
reference/configuration.md   config files, keys, environment variable names, feature flags
operations.md             build, test, CI gates, deploy, observability, runbooks the tree records
guides/<task>.md          one how-to per recurring change
patterns.md               the structural and code-level patterns the project uses, with where to see each
glossary.md               project terms
open-questions.md         what the code could not answer
```

## What each document contains

- index — one paragraph on what the project is and for whom; a table of the set's documents with one line each; the reading order for a newcomer; the depth the set was generated at; the footer with the commit, the date and the source.
- getting-started — only steps the tree supports: toolchain versions from pin files, install and run commands from the manifest or task runner, test commands from CI, the environment variables a local run needs (names only). A step the tree does not reveal is an open question, not an invented instruction.
- architecture — the system context (users, external systems) with a diagram; the units and how they talk (calls, queues, shared database) with a diagram; per unit, the modules by layer with a diagram; cross-cutting concerns each in a short section naming the module that owns it; design decisions — recorded ones from ADRs and comments with links, inferred ones in a separate list labeled as inference.
- flows — trigger, preconditions, the hops as a numbered list with `file:line` and one sentence each, a sequence diagram, the error paths, and the data written along the way.
- reference pages — tables generated from the code's own registrations, one row per item, each row citing the definition. Endpoints: method, path, handler, input schema, response shape, errors, auth. CLI: command, arguments, flags with defaults, exit codes. Configuration: key, type, default, where read, what it controls.
- operations — declared commands with their source file; what CI runs and in which order; deploy target and mechanism; logs, metrics and traces as far as the code emits them.
- guides — goal, prerequisites, ordered steps each naming a file to change or a command to run, how to verify the change works, and what commonly goes wrong (from pitfall comments and reverted commits).
- patterns — each pattern with a plain-language meaning in this project, one or two sites to read, and a count when it is presented as the norm.
- glossary — each project term with a one-line meaning taken from the code or docs, and a link to where it is defined.
- open-questions — every gap, grouped by document, so owners can answer them in one pass.

## Module document

Sections in this order; drop any with nothing to say:

1. Summary — two to four sentences. This is the text the next layer's writers read, so it states what the module provides, not how.
2. Responsibilities — what the module owns, as a short list, and what it explicitly does not (when a neighbor owns it).
3. Public interface — the exported definitions, grouped by purpose, each with a one-line description linking to its symbol entry.
4. How it works — the internal structure: main types, the path a typical call takes, state held, concurrency.
5. Dependencies — in-project modules it uses (linked, with what for) and external systems and libraries it uses (with where they are wired).
6. Used by — the modules that depend on it, linked.
7. Configuration — keys and environment variables it reads.
8. Errors — what it raises and when, what it catches and what it does then.
9. Flows — links to the flow documents it takes part in.
10. Caveats — behavior a caller would not expect, recorded warnings, known limitations stated in the code.
11. Source — the files it consists of, linked.

## Symbol entry

Inside the module document, under Public interface, or on a separate page when a module has more than about fifteen public symbols:

- Name and signature, exactly as in the code.
- What it does, in one or two sentences, from the body.
- Parameters and return value, each with type and meaning; defaults.
- Errors raised, and under which conditions.
- Side effects: I/O, mutation of arguments or shared state, events emitted.
- Usage: one or two real call sites linked, rather than an invented example. An example is written only where no call site exists (a library's public API), and it is marked as illustrative.
- Source link.

## Diagrams

- Mermaid inside fenced blocks, because the major code hosts render it inside Markdown and it stays diffable text. Where the user's docs platform does not render it, the fenced block still reads as a list of edges.
- Every node is a real module, unit, system or definition; every edge exists in the graph. No decorative boxes.
- Architecture diagrams show dependency direction; flow diagrams are sequence diagrams numbered to match the hop list; data diagrams are entity-relationship diagrams from the schema.
- Keep each diagram under about fifteen nodes; split by unit or by layer beyond that.
- Every diagram is followed by one sentence stating what it shows, for readers who cannot see it.

## Citations and evidence

- Every factual statement about the code links to where it is true: the file, and the line or line range for behavior. For a URL source, links point at the host's permalink for the recorded commit; for a local source, relative paths from the output folder to the source, or plain paths when the set lives outside the project.
- Three evidence levels, as in the rest of the collection: read (a line says it), counted (a norm established by search, with the count), inferred (a reading of structure, labeled "inferred" with its clue). Nothing below inference is written; it becomes an open question.
- Docstrings and existing docs are claims. They are repeated only where the body agrees.

## Writing rules

- Each page opens with its answer: the first sentence says what the page's subject is or does.
- Present tense, active voice, the code's own names for things. Explain a general technical term at its first use on a page; project terms link to the glossary.
- Describe, never judge: no "clean", "robust", "well-designed", no recommendations. "The module has no tests" is a fact; what to do about it is an audit's job.
- No filler introductions, no closing summaries that repeat the page, no marketing adjectives from the README.
- Code excerpts only where the shape of the code is the point, under about fifteen lines, with the source link.
- Headings are stable and descriptive, so links to them survive regeneration.
- Every page links back to the index and to its parent (the unit or the architecture page).

## Size and depth

- Overview depth: index, getting-started, architecture, flows, module documents without symbol entries, operations, glossary, open questions.
- Standard depth: adds symbol entries for every public definition and the reference pages.
- Exhaustive depth: adds internal definitions to module documents, and guides for every recurring change the history shows.
- A module document stays readable in one sitting — around 300 lines at most. Beyond that, move symbol entries to their own page and link them.
