# Page layout

The explanation is one page, read once from top to bottom by someone new to the project, then used as a map. Everything here serves those two readings.

## Contents

- Section order
- Audiences
- Writing for a first-time reader
- Code excerpts
- Diagrams
- The HTML contract
- Publishing and opening

## Section order

Leave out any section the evidence cannot fill; never pad one.

1. Header — project name, the one-sentence answer to "what is this", the source (host link or local path), the commit and date explained, and a one-line legend for the three evidence levels (read, counted, inferred).
2. At a glance — five to eight facts a reader could repeat to a colleague: kind of project, main language and framework, number of units, the main external systems, how it is run, how big it is. Below them, a collapsible "In numbers" block: files and lines by language as a simple proportional bar with a table beside it, units, test files and their share of lines, declared dependencies, public surface (endpoints, commands, exports), and age and contributor count where history exists. Rounded, counted over hand-written files, with what was excluded named.
3. What it does — two or three short paragraphs: the problem, who uses it and how, the main capabilities. Plain language, no identifiers.
4. Tech stack — grouped by role, with versions where pinned.
5. How it is organized — the structure map, and for monorepos the unit list with how units depend on each other.
6. Architecture — the architecture diagram, then the layers, their dependency direction, and the external systems with where each is wired.
7. How a request flows (or: how a command runs, how a page loads — named for the project's own main path) — the flow diagram, then the hops as a numbered list, each with a file link and one sentence.
8. Entry points — every place execution starts, with its trigger.
9. Data model — the core entities and their relations, with a diagram when there are more than four.
10. Patterns and conventions — each pattern with its plain meaning in this project, where to see it, and its count where it is claimed as the norm.
11. Configuration — variable names grouped by purpose, feature flags, config files.
12. Build, run, test, deploy — the declared commands with their source, the test layout, the deploy path.
13. Quality signals — the guardrails that exist and those that are absent, stated without judgment.
14. History — age, activity, contributor count, hot files, migrations in progress.
15. Where to start reading — the ordered reading path, then what to skip on a first read.
16. Common questions — the questions from Phase 4 as collapsible items, each question as its summary line and the answer inside with its citations. The five most useful stay open.
17. Glossary.
18. Open questions.
19. Footer — how the page was produced (read-only analysis of the stated commit), what was not assessed and why.

A table of contents follows the header and stays reachable while scrolling on wide screens.

## Audiences

One page serves one audience. The order above is the developer page; the other two change it as follows.

- End user — keeps the header, At a glance (without the numbers block), What it does, and Common questions, and replaces everything code-level with: Features (one short section per thing a person can do, found from the UI routes, CLI commands and public endpoints), How to use it (the main workflows as steps a person performs, with the messages they will see, taken from the code), and Limits (sizes, quotas, roles, platforms the code enforces). No identifiers, paths or diagrams of code; a workflow diagram is allowed. Citations collect in a footer list for maintainers.
- Agent — the developer page plus a section after Patterns and conventions: the exemplar file for each repeated kind of code (the most typical member of its family, not the first found), the recipes for recurring changes as ordered file lists, and the commands that gate a change. Written as facts about the code, not as instructions; standing instructions belong to an AGENTS.md, which is another skill's output.
- Developer — the full order above.

The Common questions differ per audience: a user asks how to do things and why something failed; a developer asks where things live and how to change them.

## Writing for a first-time reader

- Lead every section with its answer in one sentence, then the detail. A reader who skims only the first sentences of each section should come away with a correct outline.
- Explain each technical term at its first use, briefly, in a parenthesis or a clause. The glossary is for project terms; general terms are explained inline.
- Concrete over abstract: "a request to `/orders` first passes through `auth.ts`, which rejects missing tokens" beats "the system implements authentication middleware".
- Short paragraphs, lists where items are parallel, tables only where there are real columns.
- No praise, no criticism, no recommendations. "There is no integration test suite" is a fact; "the project should add integration tests" belongs to another skill.
- No filler openers or summaries that repeat the section. No marketing adjectives taken from the README.
- Detail that only some readers need — full dependency lists, every count, long hop descriptions — sits inside collapsible blocks, closed by default.

## Code excerpts

- Rare, and only where the shape of the code is the point; a link to the lines is usually better.
- Under about ten lines, cut on syntactic boundaries: a whole function, block, statement or configuration entry — never the middle of an expression, an argument list or a literal. When the unit is longer, show its signature and the lines that matter with a visible elision marker between them.
- Original indentation kept, HTML-escaped, with the source link and line range directly above.

## Diagrams

- Drawn as inline SVG by the run, laid out by hand: boxes for modules or systems, arrows for dependency or data flow, labels in plain text. No diagram library, no external renderer.
- Architecture diagram: the units or layers and the external systems, arrows pointing in the direction of dependency, each box labeled with its directory.
- Flow diagram: the main flow's hops left to right or top to bottom, numbered to match the list below it.
- Data diagram when needed: entities and their relations, cardinality in words on the arrow.
- Each diagram fits in the width of a phone screen without horizontal scrolling — use a vertical layout on narrow screens, or scale it to the container — and has a text alternative describing what it shows.
- Colors come from the page's theme tokens so diagrams stay legible in both light and dark mode; meaning is never carried by color alone.
- If a diagram needs a paragraph to be understood, redraw it with fewer boxes.

## The HTML contract

- One file, self-contained: styles and any script inline, no request to any other origin — no CDN script, no web font, no remote image, no analytics. It must render identically offline, a year later.
- Every string taken from the repository — names, paths, comments, README text, commit subjects — is HTML-escaped before it is placed on the page. Nothing from the repository is ever inserted as markup.
- The page title is the project name plus a short word such as "explained".
- Colors are defined once as variables, with a light and a dark set; the page follows the system preference and has an explicit background color.
- Readable at phone width: a single column below a narrow breakpoint, side gutters, no horizontal page scroll; long paths and code wrap or scroll inside their own box.
- Accessible: real headings in order, links with meaningful text, sufficient contrast, keyboard-operable collapsibles (native disclosure elements serve this).
- Script is optional and only for comfort — highlighting the current section in the table of contents, for instance. The page is complete with script disabled.
- Links to files use the host's permalink format for the recorded commit, opening in a new tab. For a local source, paths are shown as text.
- A reasonable size: under a few hundred kilobytes. A monorepo with many units gets a summary per unit, not a full page's worth each.

## Publishing and opening

- Hosted page: where the agent's host offers a tool that publishes a page and returns a link, the same file is published there and the link opened or returned. Private code is published only with the user's agreement, and the page contains no secret values in any case.
- Local file: written under the OS temporary directory in a folder named after the skill, with a file name made of the repository name and the date. Opened with the platform's default opener, detected at run time rather than assumed. The analyzed repository and the user's projects are never written to.
- The run reports what actually happened: the link or the absolute path, and whether the page opened. A command that ran is not proof that a window appeared; if nothing could open it (a remote session, a container), the path or link is the deliverable and the report says so.
