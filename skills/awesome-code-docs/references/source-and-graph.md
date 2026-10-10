# Source and graph

How the run gets the code onto disk safely, and how it turns the code into the dependency graph that orders all the writing.

## Contents

- Resolving the input
- The temporary clone
- Why a graph, and why bottom-up
- Nodes
- Edges
- Resolving symbols by reading
- Cycles
- Layers
- Per-node facts
- Scaling

## Resolving the input

- Local path: used in place, read-only. Inside a git work tree, record the current commit and whether the tree is dirty; the docs describe what is on disk and say so when that differs from the commit. The `origin` URL may embed a credential (`scheme://<token>@host/…`): strip the userinfo before the URL reaches a footer, a header or a permalink.
- `owner/repo` shorthand: GitHub, stated as an assumption in the report.
- A URL on any host — GitHub, GitLab with nested groups, Bitbucket, Codeberg, Gitea or Forgejo, Azure DevOps, SourceHut, a self-hosted server, an SSH clone address: split the clone address from what follows it. Browse URLs carry a ref (branch, tag or commit) and a path after a host-specific marker — a tree or blob segment, a `-/tree/` segment, a `src/` segment, a query parameter. The path narrows the scope to a directory. Issue, pull-request and merge-request links resolve to their repository.
- Anything else — a package page, an archive link, a gist — ask what is meant.

State the resolved target before fetching: host, repository, ref, path.

## The temporary clone

- Into a new directory under the OS temporary directory, named after the repository and the time; never into the user's working directory or another project.
- Shallow and single-ref by default. A blob-filtered clone with sparse checkout of the requested path for a large repository scoped to one directory. A pinned commit is fetched by hash.
- History only as deep as the how-to guides need (co-change recipes want a few hundred recent commits); deepen by count or date window, never unbounded.
- Nothing executes on checkout: hooks off, submodule recursion off (submodules are documented as external parts with where they point), large-file fetching off unless a documented part depends on it.
- Private repositories: the credentials the user's git or host CLI already has. A token is never requested in chat, never placed in a URL or an echoed command, never written to the docs. On refusal, report which host refused and stop.
- No git available: the host's archive of the same ref; history-dependent material (how-to guides from co-change) is then derived from structure alone and labeled so.
- Removed at the end of the run unless the user asks to keep it; its path is reported either way.

## Why a graph, and why bottom-up

A document written about a module whose dependencies are not yet understood fills the gap with guesses — usually from names. Writing in topological order means that when a module is documented, everything it calls is already summarized, so its document can say what those calls do. The same order makes the work parallel: modules in one layer share no edges and can be written at once. And it makes updates exact: a change invalidates a module and everything above it in the graph, nothing else.

## Nodes

Three levels, each a node set of its own:

- Unit — a deployable or publishable part with its own manifest: a workspace package, a service, an app, the library itself.
- Module — the smallest part documented on its own page: usually a directory whose files are imported together, or a single large file with one job. Choose the granularity so the set lands between roughly five and eighty modules; merge tiny sibling directories, split a directory holding unrelated concerns by file.
- Definition — a named thing with a signature: function, class, method, type, constant, component, route handler, command. Exported definitions at standard depth; all of them at exhaustive depth.

Every hand-written source file belongs to exactly one module.

## Edges

- Import edges: module to module, from import and include statements, path aliases resolved through the build or language config, workspace dependencies between units.
- Reference edges: definition to definition, from calls, type references, inheritance and implementation, instantiation.
- Wiring edges: what imports do not show — dependency-injection registrations, route tables mapping paths to handlers, event and queue subscriptions, plugin and command registries, reflection or dynamic loading by a string name, configuration that names a class or module, framework conventions that load files by location. Search for the registration site of each; these edges are often the ones a reader most needs.
- External edges: from a module to a third-party library or an outside system (database, queue, API, file store, cache), with the site where the client is constructed.

## Resolving symbols by reading

No parser or indexer is required; where the environment provides one (a language server, a symbol index), use it and still spot-check its output.

- For each import, find the file it resolves to under the project's own resolution rules: relative paths, the manifest's export map, configured aliases, the language's package layout.
- For each call site that matters to a flow or a reference entry, find the definition by name within the imported module first, then its re-exports. Where a name is ambiguous (overloads, same name in two modules, dynamic dispatch), record every candidate and say so rather than picking one.
- Re-exports and index files: follow them to the definition; document the definition where it lives and mention the public path it is reachable by.
- Zero hits is not absence. Search tools that honor ignore files miss nested packages and generated code; re-search scoped to the directory, or with ignore rules off, before concluding a symbol has no callers.

## Cycles

Find strongly connected sets of modules — groups where each can reach every other through import edges. Collapse each into one node for ordering. Its document covers every module in it, states the cycle as a fact (which module imports which), and orders the internal description by the least-coupled module first. The docs do not recommend breaking the cycle; that is an audit's job.

## Layers

Sort the collapsed graph topologically:

- Layer 0: modules that import nothing else inside the project (they may import third-party code).
- Layer n: modules whose in-project imports all sit in layers below n.
- Units are ordered the same way from their workspace dependencies; within a unit, its modules follow the module order.

Write the layer list down with the edge list. It is the schedule for Phase 4 and the source for the architecture diagram.

## Per-node facts

Collect while reading, so writers do not re-derive them:

- Module: purpose (one sentence), public surface (exported definitions), imports in and out, external systems touched, configuration read, errors raised and handled, state held (caches, singletons, connections), concurrency (workers, locks, async boundaries), and comments that record a reason or a warning.
- Definition: signature, what the body does, preconditions it checks, what it returns, what it raises, side effects (I/O, mutation, events emitted), a deprecation marker with its version and replacement, callers found by search, and whether it is reachable from the unit's public surface.
- Unit: entry points, build and test commands from its manifest and CI, runtime version pins, deploy target. Collect every runtime pin — version file, manifest engines field, container base image, CI setup step; where the build's version and the run's version differ, state both with their citations as a fact, without a recommendation.

## Scaling

- Small project: read every hand-written file.
- Large project: every manifest, config and entry point in full; every module's public surface in full; bodies of definitions that are public, on a documented flow, or among the most-called; the rest sampled with the sampling stated in the report.
- Parallel writers per layer, each given the graph brief, its module's file list and its dependencies' summaries — never the whole tree. The graph, the cross-cutting documents and the verification run centrally.
- Record anything not read on the report's coverage-gap list; the set's index says which parts are documented from a sample.
