# The claim-source map

One row per *class* of public statement. The left column is what a reader sees;
the right is the one file that can settle whether it is true. Build it once for the
product, keep it in the repo that owns the audit, and extend it every time a claim
turns out to have no row.

The map is the artifact that makes the audit repeatable. Without it every pass
re-derives where a fact lives, and the second pass reaches a different answer.

## Building it

1. **List the public surfaces**, including the ones nobody calls documentation:
   marketing pages, README, store or app-store listing, privacy policy and terms,
   changelog, API reference, in-product help, structured data (JSON-LD), the
   metadata in the package manifest, and the static assets a page loads.
2. **For each surface, list the classes of fact it states** — not each sentence.
   "Which permissions are requested" is a class; "the extension requests five
   permissions" is one instance of it.
3. **Find the single decider for each class.** One file, one symbol. If a class
   needs two files to settle, that is itself a finding: the product has two sources
   of truth and they will diverge.
4. **Mark the rows a script can check** — those become the `check-claims.mjs`
   config. The rest need a person, because the claim is prose or because only a
   person can tell which quoted phrase is claiming to *be* a UI label.
5. **Record the trap in the note column** whenever the obvious file is the wrong
   one. Those notes are the value of the map.

## Template

```text
| Claim | Source of truth | auto | Note |
| --- | --- | --- | --- |
| which capabilities the app requests | build config → manifest permissions | yes | negative claims here are the highest-risk sentences on the site |
| which hosts/domains the manifest matches | registry → each row's `hosts` | yes | NOT the parse-only superset next to it |
| which platforms are supported, and their spelling | catalog module | yes | three lists exist (client, server, site) and all three must name the same set |
| every UI label the site quotes | source string catalog | yes | read the generated bundle, edit the source, regenerate |
| the one-time-code lifetime | auth module → TTL constant | yes | advice to "wait N minutes" must not exceed the code's own lifetime |
| whether an action is rate-limited | config → the tier table | yes | "no caps" is the sentence that is false most often |
| which endpoints are open to any client | the gate module | yes | an endpoint the copy calls open must not sit behind the gate |
| what a bug report carries | the reporting module | no | prose claim; read the payload builder |
| what is actually published | the destination repo/bucket working tree | no | an empty destination makes the instructions false whatever the publisher says |
| licenses | each artifact's LICENSE | no | a data-only artifact often carries a different license from the code |
```

Keep a second, short table for **surface-internal contracts** — pairs that must
say the same thing and have no build-time link:

```text
| Contract | Where |
| --- | --- |
| the HTML answer and the plain text that feeds JSON-LD | the FAQ data file — change both |
| the feature list on the landing page and in the README | two repos, verbatim copy |
| every catalog row's link resolves to a page | catalog `href` → the page file |
| the deep-link format the site rebuilds and the client emits | the static asset ↔ the client's contract module |
```

## Resolution traps

Each one has cost real time. They are why the note column exists.

**Near-miss identifiers.** A registry row often carries two host/scope lists: the
one that reaches the shipped manifest and a wider parse-only one. A table promising
to mirror the manifest "exactly" must list the first. Grep with a lookbehind so
`urlHosts:` never answers for `hosts:`.

**Generated versus source.** A generated bundle is produced from a source catalog
by a script, frequently with different indentation. Read the generated file when
you want to know what ships; edit the source; regenerate. Editing the generated one
reverts on the next build and stages a whole-file reformat in the meantime.

**True-but-stale beats never-true.** "Refreshes daily" can be literally true of the
client cache while the server-side list behind it is static with a `TODO`. Copy
describing a *mechanism* is checked against the mechanism, not the observable.

**A design comment is evidence.** When a tool's source says in prose why it
deliberately does not do X — "folding the log is the whole point, so this never
reads the counter endpoint" — copy claiming it does X inverts the design. That
finding is invisible to anyone grepping only for identifiers.

**Check what is published, not what publishes it.** A publisher can be enabled,
correct, and covered by tests while its destination still holds a `.gitkeep`. Every
instruction depending on that data is false until the data lands. Fix the pipeline;
do not rewrite the page to describe the broken state.

**One list per repo.** In a multi-repo product the same concept usually has a list
in each: what the client ships, what the server accepts, what the site advertises.
Any two of them agreeing proves nothing about the third. Compare all pairs, in both
directions — an extra entry and a missing entry are different bugs.

**Closed enums render raw.** A vocabulary owned by the server (reason codes, status
values, plan names) is usually mapped to human labels on the client — sometimes in
two maps in one file, a prerendered one and a runtime one. A gap in *either* ships a
raw code to a reader. Compare each map separately; a check that searches the file as
a whole passes while one map is broken.

**Thresholds and free tiers.** "Unlimited", "free", "no login required" are often
true up to a limit that exists in code. Record the threshold with the claim so the
next audit can re-check it rather than re-derive it.

**Untracked and dev-only surfaces.** A draft under a redesign folder, a page behind
a dev-only route, a listing draft in a spreadsheet exported into the repo. They
carry claims that ship the day the flag flips, and they are exactly where a wrong
command survives longest, because nothing renders it.
