# Documentation set

The shape of what the run writes: which files, what each contains, and the rules every page follows. The layout separates the four kinds of documentation a reader looks for — understanding (explanation), looking something up (reference), getting a task done (how-to), and getting started (tutorial) — because a page that mixes them serves none well.

## Contents

- File layout
- What each document contains
- Module document
- Symbol entry
- User guide
- Index statistics
- Diagrams
- Citations and evidence
- Writing rules
- Code excerpts
- Written for retrieval
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
reference/errors.md       error codes and messages a user or developer sees, with cause and remedy
operations.md             build, test, CI gates, deploy, observability, runbooks the tree records
guides/<task>.md          one how-to per recurring change
guides/upgrading.md       breaking changes and deprecations per version (only from a changelog or version tags)
patterns.md               the structural and code-level patterns the project uses, with where to see each
user-guide/<feature>.md   what a user can do and how, without code (only when end users are an audience)
glossary.md               project terms
open-questions.md         what the code could not answer
llms.txt                  a link index of the set for agents and search tools
llms-full.txt             the whole set in one file (only on request)
```

## What each document contains

- index — one paragraph on what the project is and for whom; a table of the set's documents with one line each; the reading order for a newcomer; the statistics block (see Index statistics); the depth the set was generated at; the footer with the commit, the date and the source.
- getting-started — only steps the tree supports: toolchain versions from pin files, install and run commands from the manifest or task runner, test commands from CI, the environment variables a local run needs (names only). A step the tree does not reveal is an open question, not an invented instruction.
- architecture — the system context (users, external systems) with a diagram; the units and how they talk (calls, queues, shared database) with a diagram; per unit, the modules by layer with a diagram; cross-cutting concerns each in a short section naming the module that owns it; design decisions — recorded ones from ADRs and comments with links, inferred ones in a separate list labeled as inference.
- flows — trigger, preconditions, the hops as a numbered list with `file:line` and one sentence each, a sequence diagram, the error paths, and the data written along the way.
- reference pages — tables generated from the code's own registrations, one row per item, each row citing the definition. Endpoints: method, path, handler, input schema, response shape, errors, auth. CLI: command, arguments, flags with defaults, exit codes. Configuration: key, type, default, where read, what it controls. Errors, only when the project has user- or developer-visible errors worth looking up: the code or message text as the code writes it, where it is raised (cited), the cause, and what the reader does about it; every row comes from a raise or return site, never from a message seen only in docs.
- operations — declared commands with their source file; what CI runs and in which order; deploy target and mechanism; logs, metrics and traces as far as the code emits them.
- guides — goal, prerequisites, ordered steps each naming a file to change or a command to run, how to verify the change works, and what commonly goes wrong (from pitfall comments and reverted commits). The upgrading guide is written only when a CHANGELOG or version tags exist to source it from: per version, the breaking changes and deprecations with the replacement for each, each linked to its changelog entry or the diff between tags; a version with no recorded source is left out, not reconstructed.
- patterns — each pattern with a plain-language meaning in this project, one or two sites to read, and a count when it is presented as the norm.
- glossary — each project term with a one-line meaning taken from the code or docs, and a link to where it is defined.
- open-questions — every gap, grouped by document, so owners can answer them in one pass.
- llms.txt — the project name as a heading, the one-paragraph summary as a quote, then sections (Overview, Architecture, Modules, Reference, Guides, and User guide when present) listing each document as a relative link with a one-line description; the llmstxt.org format. llms-full.txt, when requested, concatenates the documents in the index's reading order, each preceded by its path as a heading, so a tool can load the set in one read.

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
- Deprecated, when the code marks it so: since which version and the replacement, taken from the deprecation annotation, doc tag or runtime warning; a marker that names neither is quoted as it stands.
- Usage: one or two real call sites linked, rather than an invented example. An example is written only where no call site exists (a library's public API), and it is marked as illustrative.
- Source link.

## User guide

Written only when end users are an audience. It documents what the project lets a person do, not how the code does it.

- One page per feature or workflow a user recognizes — sign up, import a file, run a report — found from what the code exposes to users: UI routes and screens, CLI commands, public endpoints a client calls, email and notification templates.
- Each page: what the feature is for, what the user needs first, the steps as the user performs them, what they see when it succeeds and when it fails (error messages taken from the code), and limits the code enforces (sizes, quotas, roles that may use it).
- No identifiers, paths, code or architecture. Citations go to a closing "Source" line per page for maintainers, not into the prose.
- A behavior the code shows but a user could not reach (an admin-only path, a disabled flag) is left out or marked for whom it applies.

## Index statistics

A short block in the index, counted rather than estimated, over hand-written files only (vendored, generated and build output excluded and named as excluded):

- Size: files and lines by language, rounded, largest first.
- Shape: units, modules, graph layers, cycles collapsed.
- Surface: public symbols, endpoints, CLI commands, configuration keys, events.
- Tests: test files and their share of hand-written lines, per unit.
- Coverage of the set: modules documented of total, public symbols with an entry of total, at the depth generated. A partial set says so here, with a link to the gaps in open-questions.
- History, where available: first and latest commit in the fetched window, contributor count (never names).

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
- Headings are stable and descriptive, so links to them survive regeneration.
- Every page links back to the index and to its parent (the unit or the architecture page).

## Code excerpts

- Only where the shape of the code is the point; otherwise link to the lines.
- Cut on syntactic boundaries: a whole function, a whole block, a whole statement, a whole configuration entry. Never start or stop in the middle of an expression, a call's argument list, or a literal. When the unit that makes the point is longer than about fifteen lines, show its signature and the few lines that matter, with an explicit elision marker between them, rather than a clipped tail.
- Keep the original indentation and the language tag of the source, and put the source link with its line range directly above the block.
- Strip nothing silently: an elision is marked, and a comment left in the excerpt is the code's own.

## Written for retrieval

Many readers will not open a page; they will land on one section of it through search, a retrieval index or an agent's context window. Every section is written to survive being read alone.

- One subject per section, named in its heading and again in its first sentence: "The `payments` module retries failed charges…", not "It retries them…".
- No references that only make sense in page order — "as above", "the previous section", "this one" — without the thing named.
- Section length between roughly 500 and 3,000 characters. A shorter section merges with its neighbor; a longer one splits at a subheading that names its own subject.
- Headings are specific and unique across the set: "Configuration of the `payments` module", not a bare "Configuration" repeated on every page.
- Tables carry their subject in a caption line or the preceding sentence, since a table extracted alone loses its heading.
- Each document starts with a one-line statement of what it covers and which unit it belongs to, so a retriever's first hit orients the reader.

## Size and depth

- Overview depth: index, getting-started, architecture, flows, module documents without symbol entries, operations, glossary, open questions, llms.txt.
- Standard depth: adds symbol entries for every public definition and the reference pages.
- Exhaustive depth: adds internal definitions to module documents, and guides for every recurring change the history shows.
- A module document stays readable in one sitting — around 300 lines at most. Beyond that, move symbol entries to their own page and link them.
- The user guide and llms-full.txt are independent of depth: the first follows the audiences, the second the request.
