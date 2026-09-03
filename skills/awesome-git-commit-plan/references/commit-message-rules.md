# Commit message rules

Derived from three sources. First, the conventional-commit history of angular, vue, vite, tauri, electron and nest — around 130 commits read for subject length, body frequency, body shape and footer use. Second, a rewrite of a 66-commit plan for a real desktop application, where every rule below replaced a draft that was rejected for breaking it. Third, two sibling skills: `awesome-slop-audit`, whose marker catalog supplied sections 3.2, 3.3, 3.5, 3.6, 3.8 and section 5, and `awesome-document-style`, whose language pass supplied the filler catalog in 3.10 and the questions that close section 9.

A repository's own convention outranks every rule here. A commitlint config, a hook, `CONTRIBUTING.md` or the existing log decides the format — always, including where this file's default is nicer.

## 1. Subject

```
type(scope): imperative lowercase summary
```

- 70 characters or fewer including type and scope. Real repositories sit at 50 to 65.
- Imperative mood, lowercase, no trailing period.
- Scope from the repository's own vocabulary. Never invent a second name for an area that already has one (`auth`, not `authentication`).
- The scope is optional. A change that spans the repository takes none.
- A count in a subject is allowed when the commit fixes it forever: "translate the interface into ten more locales" cannot become wrong later.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. `chore` is user-invisible housekeeping only — a behavior-preserving rewrite is `refactor`, a speedup is `perf`, formatting is `style`.

## 2. When a body is written at all

In vue, vite and nest roughly seven commits in ten carry no body. The subject and the diff are the whole message.

Write a body only when the reasoning is not visible in the diff:

- an outside constraint (a platform behaves badly, an API answers ambiguously)
- a decision that looks wrong without the explanation
- an incident the change prevents from happening again
- a policy the code cannot state (what is deliberately left alone, what is never undone)

Do not write a body for scaffolding, configuration, icons, translations, documents, or anything whose subject already says everything.

Shape: at most four paragraphs, wrapped under 80 columns, ordered problem, mechanism, decision.

## 3. What never goes in a body

Ten rules, each with the draft that produced it.

### 3.1 No enumeration of members

A sentence that names a category stops there. The diff carries which three rules and which six checks.

```text
bad   Three rules are stricter than the preset: no explicit any, hooks at
      top level only, and console limited to error.
good  A few rules are stricter than the preset.

bad   Six checks per repository: the directory exists, the effective identity
      is the expected one, it comes from the repository's own config rather
      than from somewhere above, the remote points where the switch says, the
      recent history carries no disallowed address, and the guard is where it
      was installed.
good  The report names the check that failed and where to look.
```

This holds even when the members are non-obvious edge cases. If a test pins them, the test is where they belong.

```text
bad   The extraction is narrower than it looks. Version 0.1.3 must not claim
      the 0.1.30 section, the compare link moves from the heading to a footer,
      and a version whose commits are all hidden types says so. All three are
      covered by the test.
good  Matching a version heading is exact, since a shorter version is a prefix
      of a longer one.
```

Delete the paragraph outright when the subject already said it.

```text
subject   feat(settings): expose startup, theme, language and the guard rails
deleted   Launch at login, theme, interface language, the two OAuth client
          ids, the Windows OpenSSH switch, and the machine-wide guard rails.
```

### 3.2 Assume a competent reader

A mechanism whose name carries its purpose is named, never explained: pinning LF, a lockfile beside its manifest, an atomic temp-file rename, a debounce, a connection pool.

```text
bad   The gitattributes file pins LF. A file committed with CRLF from a
      Windows clone makes a formatter that writes LF produce whole-file diffs,
      and the shell scripts CI runs on Linux fail outright.
good  Vite, React 19, strict TypeScript, pnpm, and LF pinned in the index.

bad   Cargo.lock lands with the manifest. Slicing a manifest means slicing its
      lockfile, and a hand-edited lockfile proves nothing.
good  (deleted)
```

The same applies to a guarantee of the language or the type system.

```text
bad   Why a repository was suggested is a union of the values the evidence
      ladder produces. A renderer that forgets one fails to compile.
good  (deleted)

bad   Platform is an enum. Every match on it is exhaustive, and no unknown
      name can fall through to a default host.
good  Platform is an enum, and its lowercase spellings are a wire format
      shared with the webview and with every state file already on disk.
```

### 3.3 Cut the consequence half

A clause that restates what the first half already means is one thing said twice.

```text
bad   Every colour the UI uses has a name in the theme mapping, and no
      component writes a hex value.
good  Every colour the UI uses has a name in the theme mapping.

bad   Stroked icons share one wrapper, and a size or width tweak is one edit.
good  Stroked icons share one wrapper.

bad   One table the cards, the menus and the badges all read from, so adding a
      platform is one edit.
good  One table the cards, the menus and the badges all read from.
```

### 3.4 No explanatory colon

A colon introduces a command block or a real list. It never joins a claim to its explanation. Two sentences do that.

```text
bad   Only the IPC origin is allowed to connect: every network call this app
      makes is made by Rust.
good  Only the IPC origin is allowed to connect. Every network call this app
      makes is made by Rust.
```

### 3.5 No contrast frame

State what the code does. Contrast with what it does not do at most once per message. A draft with 47 uses of "rather than" across 66 commits is a fingerprint, not a style.

```text
bad   Identity and remotes go through git itself rather than through a config
      parser of our own.
good  Identity, config keys and remote URLs all go through git itself.

bad   ...and a refusal rather than an overwrite when the filename is taken.
good  ...and a refusal when the filename is taken.
```

### 3.6 Nothing has a past

When a file is introduced by this commit, "used to", "previously" and "no longer" describe a history the repository does not have. That is a false statement, not a style problem. Rewrite as the hypothetical it really is.

```text
bad   It used to be one free-text string carrying the sentinel, which the
      renderer compared against.
good  A free-text string carrying a sentinel would have to match in two files,
      and it could never be told apart from a backend message that happened to
      say the same thing.

bad   Pushing a few hundred commits used to spawn a few hundred processes.
good  Pushing a few hundred commits would otherwise spawn a few hundred
      processes.
```

In a commit that changes existing code, past tense is correct and stays.

### 3.7 One reason per sentence

A chain of so, which and because is two sentences. Three reasons stacked behind one decision is one reason plus noise.

```text
bad   Repositories are inspected eight at a time, since each one costs several
      git processes, they are slow to spawn on Windows, and they do not depend
      on each other.
good  Repositories are inspected eight at a time, since git processes are slow
      to spawn on Windows and the repositories do not depend on each other.
```

### 3.8 No count that can be recounted

A number the code enforces stays: a depth cap, a history window, a concurrency limit, a timeout, an HTTP status, a crypto width, a dependency version, an OS version. Those cannot drift without the code drifting with them.

A number describing the current shape of the code rots on the next edit. Name the thing instead of counting it.

```text
bad   Two flat variable blocks and one mapping.
good  Every colour the UI uses has a name in the theme mapping.

bad   Twelve screenshots, one pair per view.
good  Screenshots come in pairs, one per view.

bad   Four shapes a git remote actually takes.
good  Every shape a git remote actually takes.

bad   ...and bumps it in all four version files in lockstep.
good  ...and bumps every version file in lockstep.

bad   ...setting it at ten call sites is ten chances to forget.
good  ...since GitHub rejects requests without one.

bad   Each one costs roughly eight git processes.
good  Each one costs several git processes.
```

A number that survives the cut is written as digits, including 0 to 9 and at the start of a sentence: 200 commits, 8 at a time, 4 jobs. A group of digits has a different shape from a group of letters and survives a scan that skips the words around it. Keep words where the number is not data ("one place every git client agrees on", "the two halves of one product").

### 3.9 A body stands alone

No reference to another commit in the plan, no "as above", no "the reason given at the top". The reader has `git log` and the diff. A planning document outside the repository is not available to them.

```text
bad   Cargo.lock lands with the manifest for the reason given at the top.
good  (deleted, or the reason stated in place)
```

Referring to an existing commit by sha or to an issue by number is different and is allowed, in a footer.

### 3.10 No flourish, no signpost

Delete a sentence whose only job is to tell the reader that the preceding fact matters. Delete an opener that announces what is about to be said.

```text
deleted  The evidence ladder is the whole point.
deleted  A machine has no owner, a repository does.
deleted  ...which is the difference from a tool that stamps the wrong identity
         on a fork.
deleted  ...which is the problem this commit has to solve.
```

Also drop the cleft construction that inflates a plain statement:

```text
bad   The noreply address is what lets a profile commit without publishing a
      private mailbox.
good  The noreply address lets a profile commit without publishing a private
      mailbox.
```

Words and shapes that carry no information and always come out:

| Class | Examples |
| --- | --- |
| filler adverbs | simply, just, easily, obviously, of course, actually, basically, really |
| inflation | plays a crucial role, underscores, highlights, showcases, robust, seamless, comprehensive |
| hedged openers | it is important to note that, it is worth mentioning |
| summary stamps | in conclusion, in short, to summarise, in other words, put simply |
| the rule of three | three parallel clauses where one carries the fact — two examples earn their place, a third is rhythm |
| noun stacks | production-ready deployment system infrastructure |
| circular claims | the helper enables the caller to use the helper |

Prefer the active voice and one precise verb over stacked modifiers. Passive is correct when the actor is genuinely irrelevant ("the region is appended at the end of the file"), not as a default.

## 4. Characters

- Plain ASCII throughout. No em dash, no arrow glyph, no curly quote, no ellipsis character, no emoji, no non-breaking space. They break `git log`, changelog parsers and terminals, and they read as machine output.
- No backticks anywhere. Identifiers are written bare: `profiles.json` becomes profiles.json, `core.hooksPath` becomes core.hooksPath.
- Quoting is for the rare case where a string has to be marked off. Single quotes then. Never a backticked quoted string.
- No implementation trivia in prose. Not a noreply address template, not an `includeIf` condition, not a full lint command line, not an `invoke` call with its argument object. Name the thing in words.

## 5. What must survive the cut

Every rule above removes text. This section is the counterweight, and it wins on contact: a body that survives verification is the opposite of slop. Machine writing narrates; writing anchored to something that actually happened holds up when checked. Do not cut a sentence because it is long or because a rule above matches its shape. Cut it because a reader could have derived it.

Keeps, even when they look like the patterns above:

| Kind | Example |
| --- | --- |
| incident provenance | "a standing timer once made this NaN"; "pushing a few hundred commits would otherwise spawn a few hundred processes". Past tense here is not invented history — it justifies a present design decision |
| operational knowledge | behaviour of a live third party that cost real time to learn: which status a host answers to a duplicate key, which greeting closes with a non-zero exit, which browser tries IPv6 first |
| a deliberate refusal | what the change will not do, and why: an option left alone rather than undone, an identity not restored because it cannot be known |
| a constant with a reason | "200 commits, far enough back to catch an identity that has been wrong for a while and short enough to stay instant" — the number is enforced by the code and the clause says what it buys |
| a wire-format note | snake_case field names, a lowercase spelling shared with data already on disk. Nothing in the diff says these cannot be renamed |
| a security boundary | why a check runs before a response is written, why a listener binds both address families |

Never write a claim into a message to satisfy a rule here. Anything stated must be confirmed first. A rewritten sentence that no longer matches the code is a worse defect than the wordiness it replaced.

## 6. Rhythm

Vary the paragraph opening. 71 of 130 paragraphs starting on the word "The" is a rhythm a reader feels before they can name it.

Vary sentence length. A body where every sentence is a 20-word compound with a comma before "so" reads as generated even when every fact in it is true.

## 7. Footers

Only these:

```text
Closes #N
Fixes #N
Refs: <sha>              required by a revert, naming what it undid
BREAKING CHANGE: <what>  required by a ! in the header
```

Never a `Co-Authored-By` trailer for an assistant, never a "Generated with" line, never any mention of an assistant, in the subject, the body or the metadata. The message reads as if the user wrote it. The one exception is a repository whose own contribution rules mandate AI disclosure.

## 8. Security

A security-relevant message says what the code now does, never what was wrong with it. Subjects, bodies, branch names, PR titles and generated changelog lines are permanent and public. A message naming the weakness hands a reader of `git log` the exact commit range to attack, and every user still on the previous release is inside it.

```text
bad   fix(auth): stop leaking the test account
good  fix(auth): tighten session handling
```

The vulnerability, its impact and its reproduction go in the private tracker or the advisory. This applies to the removal of a disclosure too: a commit that scrubs a leak must not name what it scrubbed.

## 9. Checklist

Run these over a drafted message before committing. Each maps to a rule above.

```bash
grep -n '`'                          # 4, must be empty
grep -nP '[^\x00-\x7F]'              # 4, must be empty
grep -n '[a-z]: [a-z]'               # 3.4, only the type separator may match
grep -c 'rather than\|instead of'    # 3.5, at most one
grep -n 'used to\|previously'        # 3.6, only in a commit changing old code
grep -c ', so \| which \| because '  # 3.7, one per sentence
grep -nE '\b(two|three|four|six|ten|twelve) [a-z]+'   # 3.8, each must be a
                                     # constant the code enforces
grep -nE 'C[0-9]{2}|as above'        # 3.9, must be empty
```

Then read the body once more and ask three questions of it.

1. Could a competent developer have derived this sentence from the diff? If yes, delete it.
2. Could this paragraph sit unchanged in a hundred other commits in a hundred other repositories? If yes, it says nothing about this change. Delete it.
3. Is every remaining claim confirmed against the code, not assumed while rewriting? Section 5 outranks every rule above it.

## 10. The short version

Say what the code does and the one thing a reader could not have worked out. Stop.
