# Mechanical check recipes

`scripts/check-claims.mjs` runs the claims whose truth is a *value* in code. You
write one config per product; the script contributes the discipline — fail loud on
a stale pattern, one line per check, a non-zero exit on drift.

Write the config next to the surfaces it audits (`claims.config.json` at the root of
the repo, or in the container directory of a multi-repo product) and point `root` at
the directory every path is relative to.

## Config shape

```jsonc
{
  "root": ".",                    // every `file` below is relative to this (default: the config's own folder)
  "extensions": [".md", ".html"],// which files a `retired` corpus walk reads (default: common source and copy types)
  "checks": [ /* … */ ],
  "mutations": [ /* … */ ]        // read by prove-checks.mjs
}
```

Every check has an `id` (used in findings and in mutations), a `kind`, and an
optional `"optional": true` — which turns a missing file into a `SKIP` line instead
of a broken check, for repos that are not always checked out.

Patterns are JavaScript regular expressions **inside JSON**, so every backslash is
doubled: `"([0-9_]+)"` stays as is, `"\\s*"` needs two. Capture group 1 is used
unless the spec sets `group`. A source spec may carry `within` — a regex whose group
1 narrows the search to one block, so a second list further down the same file can
never answer for the first.

### `value` — prose that states a constant

```jsonc
{
  "id": "code-lifetime",
  "kind": "value",
  "source": { "file": "server/src/auth.ts", "pattern": "SIGNIN_CODE_TTL_S = (\\d+)", "extract": "number", "divide": 60 },
  "targets": [
    { "file": "site/src/data/faq.ts", "pattern": "expires {value} minutes",
      "why": "the FAQ no longer states the real code lifetime" }
  ]
}
```

`extract` is `string` (default), `number` (with optional `divide` / `multiply`),
`count-strings` (how many quoted items the captured block holds — permission lists,
locale lists), or `count-matches` (how many times the pattern occurs). `{value}` is
escaped before it meets the regex, so a captured name with a `.` in it stays literal.

Add `"absent": true` to a target to assert the pattern is *gone*.

### `mentions` — every item of a list, one pattern each

The two shapes that matter: the copy must name each declared item, and no page may
*deny* one.

```jsonc
{
  "id": "permissions",
  "kind": "mentions",
  "source": { "file": "app/build.config.ts", "within": "(?<!optional_)permissions:\\s*\\[([^\\]]*)\\]", "pattern": "\"([^\"]+)\"" },
  "targets": [
    { "file": "site/src/pages/permissions.html", "template": "<code>{item}</code>",
      "why": "a declared permission the page never mentions" },
    { "file": "site/src/pages/install.html", "template": "no <code>{item}</code>", "absent": true,
      "why": "the page denies a permission the manifest declares" }
  ]
}
```

The negative lookbehind in `within` is the shape to copy: it stops an
`optional_permissions:` block from answering for `permissions:`. Near-miss
identifiers are the most common wrong answer in this whole audit.

### `list-parity` — two lists that must agree

```jsonc
{
  "id": "supported-platforms",
  "kind": "list-parity",
  "a": { "file": "client/src/registry.ts", "within": "SUPPORTED = \\[([\\s\\S]*?)\\n\\]", "pattern": "id:\\s*\"([a-z]+)\"", "label": "the client registry" },
  "b": { "file": "server/src/allowlist.ts", "within": "new Set\\(\\[([\\s\\S]*?)\\]\\)", "pattern": "\"([a-z]+)\"", "label": "the server allowlist" },
  "mode": "equal"
}
```

`mode` is `equal`, `a-subset-of-b`, or `b-subset-of-a` — a roadmap the API would
reject is `a-subset-of-b`; a label map that must cover a closed enum is
`b-subset-of-a` with the enum as `a`. `ignore` drops known-deliberate entries.

With three lists (client, server, site), write three pairwise checks. Any two
agreeing proves nothing about the third.

### `exists` — a link the copy offers that resolves to nothing

```jsonc
{
  "id": "catalog-links",
  "kind": "exists",
  "source": { "file": "site/src/data/platforms.ts", "pattern": "href:\\s*\"(/[a-z-]+)\"" },
  "resolve": ["site/src/pages{match}.html", "site/src/pages{match}/index.html"]
}
```

Any one candidate existing passes.

### `retired` — a sentence that was false once

```jsonc
{
  "id": "retired",
  "kind": "retired",
  "corpus": ["site/src", "site/public", "README.md"],
  "phrases": [
    { "text": "no caps on how often you can", "why": "the API enforces a per-minute budget" },
    { "text": "the last 1000", "why": "history is uncapped now; 1000 was the legacy storage format" }
  ]
}
```

Directories are walked (filtered by `extensions`), files are read directly. Every
finding this audit fixes earns a phrase here — it is the cheapest possible guard
against a revert, a copy-paste from an old draft, or a translation memory.

## Two recipes worth copying

**A quoted UI label, resolved against the string catalog.** A `value` check whose
*source* is the catalog entry and whose *target* is the page that quotes it. The
pattern reaches into the entry by key, so a renamed label fails here instead of
confusing a user:

```jsonc
{
  "id": "label-hide-native",
  "kind": "value",
  "source": { "file": "app/locales/en/messages.json",
              "pattern": "\"settingHideNative\":\\s*\\{[^}]*\"message\":\\s*\"([^\"]+)\"" },
  "targets": [{ "file": "site/src/data/faq.ts", "pattern": "\"{value}\"",
                "why": "the site quotes a label the catalog no longer renders" }]
}
```

Curate these by hand — only a person can tell which quoted phrase is claiming to
*be* the UI. And keep the pair honest in both directions: when the site stops
quoting the label, drop the check rather than leave it green against nothing.

**A documented flag the tool does not parse.** Copy-pasteable commands are the
claim shape that fails loudest, and it is a plain `list-parity`: every flag the
docs show must be one the CLI actually reads.

```jsonc
{
  "id": "documented-flags",
  "kind": "list-parity",
  "a": { "file": "docs/cli.md", "pattern": "(--[a-z][a-z-]+)", "label": "the docs" },
  "b": { "file": "src/cli.mjs", "pattern": "\"(--[a-z][a-z-]+)\"", "label": "the parser" },
  "mode": "a-subset-of-b"
}
```

Check the package name in the same pass: an `npx <binary>` line resolves the
package *named* like the binary, which is often not the package that ships it.

## Proving the checks

```bash
node scripts/check-claims.mjs --config claims.config.json
node scripts/prove-checks.mjs  --config claims.config.json
```

Each mutation names the check it should trip, the file to break, and the exact
edit:

```jsonc
"mutations": [
  { "check": "permissions",  "file": "site/src/pages/permissions.html", "from": "The 5 permissions", "to": "The 4 permissions" },
  { "check": "code-lifetime", "file": "site/src/data/faq.ts", "from": "expires 10 minutes", "to": "expires 15 minutes" }
]
```

Read the result as three distinct signals:

- **`CAUGHT`** — the check fires on the drift it claims to own.
- **`MISSED`** — the check is looking somewhere too broad. The recurring cause: it
  searches a whole file that holds the same value twice (a prerendered map and a
  runtime one), so breaking one copy leaves the other answering. Narrow it with
  `within` and give each map its own check.
- **`SETUP-FAIL`** — the copy moved. The mutation anchor needs re-pointing; the
  check itself may be fine.

`prove-checks.mjs` runs the checker once more at the end and expects it green. A
`RESTORE-FAIL` means either a mutation did not restore (check `git diff`) or the
tree already had findings before the run — fix those first, then re-prove.

## Keeping the config honest

- **One check, one claim.** A check that would report two unrelated findings is two
  checks; the mutation test can only prove one thing at a time.
- **Anchor on the sentence, not the file.** Prefer `within` plus a tight pattern
  over "somewhere in this page".
- **A broken check is a finding, not a pass.** When `could not parse …` appears,
  fix the pattern before trusting any other line of output.
- **Add a mutation with every check**, in the same edit. A check added without one
  is unproven, and unproven checks accumulate silently.
