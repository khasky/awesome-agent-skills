# Analysis signals

What to read for each part of the page, and what a claim needs behind it before it is printed. Stack-agnostic: sources are named by role — the manifest, the lockfile, the router — and the agent maps each role to whatever the project uses.

## Contents

- Evidence levels
- Identity: what the project is
- Stack
- Structure
- Entry points
- The main flow
- Architecture and boundaries
- External systems and configuration
- Data model
- Patterns
- Build, run, test, deploy
- Quality signals
- History
- Glossary
- Reading path and what to skip
- Numbers
- Common questions
- Open questions

## Evidence levels

Every statement on the page carries one of three, and the page shows the difference:

- Read — the run opened the file and the line says it. Cited with a link. The cited line literally contains what it is cited for: a symbol is cited at the line bearing its name — not a decorator above it, a blank line or a line of its body — and a range starts at the line with the name. A citation that merely resolves is not enough.
- Counted — a norm established by search across the whole scope: "handlers validate input with schemas (31 of 33 route files)". Cited with the pattern and the count, in the page's collapsible detail.
- Inferred — a reasonable reading of structure without a line that states it: "the `workers/` directory appears to process the queue fed by `api/` — both reference the same queue name". Labeled as inference, with the clue.

Anything below inference — a guess from a directory name, from the README's adjectives, from what projects of this kind usually do — is not printed. It goes to Open questions.

## Identity: what the project is

- Evidence: package name and description fields, published exports, binary entries, server bootstrap, deploy config, the README's first paragraph, a docs site config.
- Settle: the kind (application, service, library, CLI, framework, plugin, infrastructure, collection of several), who it is for, and the one problem it solves — in a sentence a non-developer understands.
- The README's description is a claim. Repeat it only if the code bears it out; where it overstates (a "plugin system" that is one hard-coded list), describe what exists.

## Stack

- Evidence: manifests and lockfiles, toolchain pin files, container base images, CI setup steps, framework config files.
- Collect every runtime version pin: the version file, the manifest's engines field, the container base image, the CI setup step. Where the version that builds differs from the version that runs, state it as a fact with both citations, without judgement.
- Separate runtime dependencies from development tools. Group by role — language and runtime, framework, data, messaging, UI, testing, build, lint and format, deploy — and give each its version where pinned.
- A dependency in the manifest that no source file imports is listed as unused-looking only if the page has a place for it; never presented as part of the stack.
- Only what matters: twenty utility packages are one line ("plus common utilities"), not twenty rows.

## Structure

- Evidence: the tree to two or three levels, workspace config, per-directory READMEs, CODEOWNERS.
- One line per directory that a reader would otherwise have to open to understand. A directory whose name says everything gets no line.
- Mark generated, vendored and build-output paths as such.

## Entry points

Where execution begins. Look for, by role:

- Process start: the manifest's main or start script, a main function, a container command, a process-manager config.
- Server bootstrap: framework app creation, listener start, route mounting.
- CLI: command registration, argument parser setup, the binary field.
- Library: the exported public surface — the package's export map, the index module, the public header.
- Background: scheduled jobs, queue consumers, event subscribers, webhooks, serverless function handlers.
- UI: the root component, the router definition, the HTML shell.
- Tests and scripts are not entry points for the page unless the project is a tool whose product is scripts.

Each entry point gets its file, its trigger, and what it hands off to.

## The main flow

The single most useful part of the page for a newcomer.

1. Choose the path: the one the project exists for. For a service, the most central request (the one its name is about, or the route with the most code behind it); for a CLI, its primary command; for a library, the call its README's first example makes; for a UI, the first meaningful screen and its data load.
2. Follow it through the code, not through the docs: from the entry point, open each function it calls into that is part of the project. Record each hop as `file:line`, the function name, and one sentence of what happens there.
3. Stop at the project boundary. Framework and library internals are named ("the ORM runs the query"), not traced.
4. Note what the flow reveals in passing: where validation happens, where errors are turned into responses, where transactions begin, where caching sits.
5. Each hop carries one non-obvious point beyond what the function is called: what a smart reader would misread, which opening the file alone will not show (a value changed in passing, a hand-off that happens elsewhere, a branch that skips the next hop). A hop with nothing like that keeps its one sentence.
6. Keep it to 5–12 hops. More means the flow is being traced too finely; merge hops within one module.

## Architecture and boundaries

- Evidence: imports grouped by source and target directory, path aliases, dependency-injection wiring, lint rules restricting imports, architecture tests.
- Settle: the layers or modules, which depends on which (from counted import edges, not from names), and any back-edges or cycles — described neutrally as facts ("`core/` imports two helpers from `web/`"), since judging them is another skill's job.
- For a monorepo: which packages depend on which, from the workspace manifests.

## External systems and configuration

- Evidence: client libraries in the manifest and where they are constructed, connection strings read from config, container-compose services, infrastructure-as-code files, environment variable reads.
- For each external system: what it is, what the project uses it for, where the connection is made.
- Configuration: variable names from the template file or from reads in code, grouped by purpose. Never values. Feature flags and their definition site.
- Compare the template and the reads both ways and state the differences as facts: a key in the template that nothing reads, a key read in code but missing from the template, a key read only in a module no entry point reaches.

## Data model

- Evidence: schema files, ORM models, migrations (the latest state, not the history), type definitions for core entities, API schemas.
- The five to fifteen entities that matter, their key relations, and where each is defined. A diagram when there are more than four related entities.

## Patterns

Name a pattern only with its evidence. The vocabulary below is a checklist of what to look for, not of what to find; most projects use a handful.

- Structural: layered, hexagonal (ports and adapters), MVC or a variant, feature folders versus type folders, modular monolith, microservices, monorepo with shared packages.
- Composition: dependency injection (container or manual wiring), plugin registry, middleware or interceptor chain, pipeline, event bus or pub-sub, observer, strategy selected by config, factory, adapter over an external API, repository or data-mapper versus active record, command/query separation, unit of work.
- Flow control: request/response, queue and worker, cron, event sourcing, sagas, retries with backoff, circuit breaker.
- UI: component hierarchy, state store, server state cache, routing style, rendering mode (server, client, static, hybrid).
- Code-level conventions: error-handling style, validation at boundaries, configuration access through one module, logging style, naming and file-shape conventions that repeat.

For each pattern found: the name, one plain-language sentence on what it means in this project, one or two sites where it can be seen, and — for claims that it is the norm — the count.

## Build, run, test, deploy

- Evidence: task runner and manifest scripts, CI workflows, container files, deploy config, CONTRIBUTING.
- Commands are read, not run. Present them as what the project declares, with the source file; where CI and the README disagree, show the CI version and note the difference.
- Testing: framework, where tests live, what kinds exist (unit, integration, end-to-end), what they need running.
- Deploy: where it goes and how, as far as the tree shows. Anything beyond the tree is an open question.

## Quality signals

Descriptive only — what guardrails exist, not whether they are enough: type checking and its strictness, linters and formatters, test presence per unit, CI gates on merge, dependency update automation, security scanning, pre-commit hooks. A missing guardrail is stated as absent, without a recommendation.

## History

Only where git history is available (local repository, or a clone with enough depth).

- Age and activity: first and latest commit dates in the fetched window, commits per month recently.
- Contributors: a count, never names or e-mail addresses on the page.
- Hot files: the most frequently changed files in the recent window — they are usually where the project's real complexity lives, and they belong in the reading path.
- Direction: directories growing versus untouched; a pattern new files use that old ones do not signals a migration in progress, which the page mentions so the reader copies the new style.
- Releases: tags and changelog, if present.

## Glossary

Domain terms the code uses that a newcomer would not know: entity names, internal product names, abbreviations in identifiers. Each with a one-line meaning taken from the code, docs or comments — never invented. A term whose meaning the tree does not reveal is an open question.

## Reading path and what to skip

- Reading path: 5–10 files in order — usually the entry point, the main flow's core hop, the central data definitions, one exemplary instance of the most repeated pattern, and the hottest file. Each with one sentence on what the reader will learn there, including the one non-obvious point about that file — what a smart reader would misread, which opening the file alone will not show.
- Skip on a first read: generated code, vendored code, fixtures, legacy directories being migrated away from, large configuration dumps.

## Numbers

- Count, never estimate: files and lines per language over hand-written files, with vendored, generated, build-output, lockfile and fixture paths excluded and named as excluded. Blank and comment-only lines may be counted or not, but the page says which.
- Units, and per unit its share of the total.
- Tests: files matching the test runner's pattern, and their share of lines, per unit.
- Dependencies: runtime and development counts from the manifests, not the lockfile's transitive total.
- Public surface: endpoints from the route registrations, commands from the CLI registration, exports from the public entry.
- Round for display (one or two significant figures for anything above a hundred) and keep the exact figures in the collapsible table.

## Common questions

- Draft them from what the run itself had to look for: every question Phase 4 answered by searching is one a newcomer will ask.
- Cover the audience's needs — for a developer: where a behavior lives, how to add the most common thing, how to run one test, what owns an entity, what happens on the main failure path; for an end user: how to do the main tasks, why a common action fails, what the limits are.
- Each answer is two to four sentences with its citations, at the same evidence levels as the rest of the page. A question whose answer would be inference only is an open question instead.
- A cold-read check, where the run performs one, reuses these questions.

## Open questions

What a reader would reasonably want that the tree cannot answer: the reason behind an unusual choice with no ADR, how production is configured, the scale it runs at, a directory whose purpose nothing states, a README claim the code does not bear out. Listed plainly, so the reader knows what to ask the owners.
