# Lexicon of machine-writing tells

The one word and phrase inventory for the whole collection. Every skill that bans a word bans it from here: the pattern files in this folder carry the *shapes*, this file carries the *vocabulary*, and a skill that acts on a word cites a section instead of keeping a copy to drift.

Sweeping it is a search, not a program: take the entries of the sections whose scope matches the text in front of you, search for each with whatever tool the environment gives you, and read every hit in place. The entries are written in base form and each covers its family, so search for the stem rather than the exact spelling — the word boundary at the start is what keeps a compound that merely contains the stem out of the results.

## How to read it

Two axes decide whether a hit is a finding.

- **Tier** is density. Tier 1 is flagged on sight; Tier 2 only when two or more share a paragraph; Tier 3 only at high density (about 3% of running words). The sections below the tiers are out regardless of density.
- **Scope** is in each section heading: `prose` (documents, posts, articles, release notes), `comment` (comment text of any language), `commit` (the prose of a commit message). An entry binds in its scope only — a word banned in a comment can be ordinary in an article, and the reverse.

Every entry is one backticked span at the head of its bullet, with the plain word it displaces after the dash. An entry is written in its base form and covers its family (`-s`, `-es`, `-ed`, `-ing`) unless a variant carries a distinct honest sense. A phrase or a hyphenated compound turns up written both ways, so read a space and a hyphen as the same thing when you search for one. carries a distinct honest sense.

## Tier 1 (prose)

Flag on sight.

- `delve` — look at, go through, read
- `tapestry` — drop the metaphor and name the thing
- `treasure trove` — a lot of, or the count
- `testament` — shows, proves
- `boast` — has
- `nestle` — sits, stands
- `seamless` — name what does not happen (no setup, no restart)
- `robust` — name the property (retries twice, survives a restart)
- `cutting-edge` — name what is new
- `groundbreaking` — name what is new
- `revolutionize` — name what changed
- `revolutionary` — name what changed
- `showcase` — show
- `leverage` — use
- `deliberately` — give the reason instead
- `intentionally` — give the reason instead

## Tier 2 (prose)

Flag when two or more share a paragraph.

- `harness` — use
- `foster` — cause, support
- `elevate` — raise, improve
- `streamline` — simplify, cut a step
- `bolster` — strengthen, add to
- `garner` — get, collect
- `surpass` — beat, pass
- `embark` — start
- `unlock` — make possible
- `empower` — let, allow
- `crucial` — needed, or what breaks without it
- `pivotal` — decisive
- `underscore` — shows
- `realm` — field, area
- `landscape` — field, market
- `navigate` — handle, work through
- `vibrant` — name the quality
- `bustling` — busy
- `intricate` — detailed, complicated
- `multifaceted` — the sides, named
- `meticulous` — careful, or the standard met
- `nuanced` — name the distinction
- `holistic` — whole, end to end
- `immersive` — name what it does
- `authentic` — real, or the source

## Tier 3 (prose)

Flag only at high density.

- `significant` — the number, or large
- `innovative` — name what is new
- `effective` — works, or the result
- `comprehensive` — complete, or the coverage
- `unique` — the one that, or only
- `unparalleled` — best, or the comparison
- `stunning` — the fact that impressed
- `breathtaking` — the fact that impressed
- `commendable` — good, or the reason
- `noteworthy` — worth noting, or drop
- `notably` — drop
- `invaluable` — useful, or what it saved
- `insightful` — what the insight was
- `profound` — deep, large, or the size
- `transformative` — what it changed
- `strategically` — drop, or the plan
- `ever-evolving` — changing, or drop
- `additionally` — also, and

## Literary register in plain text (prose)

The register a model reaches for when the subject is ordinary.

- `albeit` — though
- `bespoke` — custom, made for
- `salient` — main, relevant
- `wherein` — where
- `heretofore` — until now
- `paramount` — most important
- `state-of-the-art` — current, newest
- `myriad` — many, or the count
- `plethora` — many, or the count
- `thus` — so
- `hence` — so

## Transition crutches (prose)

A connective marking every logical turn.

- `it is important to note` — say the thing
- `it should be noted` — say the thing
- `it is worth noting` — say the thing
- `it is worth mentioning` — say the thing
- `that said` — but, though
- `with that in mind` — drop
- `furthermore` — also, and
- `moreover` — also, and

## Conclusion filler and summary stamps (prose)

A label announcing a summary instead of delivering it.

- `in conclusion` — start the closing differently
- `to sum up` — start the closing differently
- `in summary` — start the closing differently
- `all in all` — drop
- `ultimately` — drop, or the outcome
- `overall` — drop
- `in other words` — say it once
- `put simply` — say it once
- `to wrap it all up` — start the closing differently

## Era openers (prose)

- `in today's world` — drop, or the date
- `in today's fast-paced` — drop
- `in the modern era` — drop, or the date
- `ever-changing` — drop
- `as of today` — the date

## Inflation and hype (prose)

- `plays a crucial role` — what it does
- `plays a key role` — what it does
- `underscores the importance` — the fact
- `highlights the significance` — the fact
- `lays the foundation` — what it enables
- `left an indelible mark` — what changed
- `cemented its place` — what changed
- `marks a turning point` — what changed
- `enduring significance` — what still holds
- `the future looks bright` — the next step, or drop
- `prospects for growth` — the number
- `thrilled to announce` — the news
- `powerful new features` — the features
- `seamless experience` — what does not happen
- `let's be honest` — drop
- `this changes everything` — what changed
- `game changer` — what changed
- `the future is here` — drop
- `a new era` — what changed
- `to the next level` — the measure

## Bureaucratese (prose, comment, commit)

- `utilize` — use
- `in order to` — to
- `at this point in time` — now
- `in the event that` — if
- `with regard to` — about
- `in a timely manner` — on time
- `pursuant to` — under
- `facilitate` — help
- `make a decision` — decide
- `provide assistance` — help
- `conduct an investigation` — investigate
- `give consideration to` — consider

## Filler adverbs (prose, comment, commit)

Delete; if deleting changes the meaning, the meaning belongs in the verb.

- `simply` — drop
- `easily` — drop
- `obviously` — drop
- `of course` — drop
- `actually` — drop
- `basically` — drop
- `really` — drop
- `truly` — drop
- `merely` — only
- `essentially` — drop
- `effectively` — drop

## Quantity clichés (prose)

- `a wide array of` — the count
- `a plethora of` — the count
- `a myriad of` — the count
- `countless` — the count, or many

## Attribution with no source (prose)

- `experts say` — who, and where
- `experts believe` — who, and where
- `studies show` — the study
- `studies suggest` — the study
- `researchers note` — the paper
- `critics point out` — the critic
- `observers say` — who
- `industry reports` — the report
- `many believe` — who
- `independent sources confirm` — the source

## Avoiding "to be" (prose, comment)

Each is a plain *is*.

- `serves as` — is
- `stands as` — is
- `functions as` — is
- `represent` — is
- `acts as` — is

## Borrowed diction (comment, commit)

The register of a model describing code; a developer typing the same comment uses the plain verb. Scope matters more here than anywhere else on this page: each of these is ordinary English in a document and ordinary vocabulary in some products, so outside comment text and message prose they are not findings.

- `honored` — applied, enforced, respected
- `honoured` — applied, enforced, respected
- `mint` — create, generate, issue
- `verbatim` — unchanged, exactly, character for character
- `derived rather than` — name what the value is derived from

## Shapes that travel with the vocabulary

Named here so a skill can cite one place, defined in full by the pattern files in this folder: negative parallelism (not only X but also Y; it's not just X, it's Y; more than just X; not so much X as Y; mirrored "X, not Y"), the forced rule of three, the "from X to Y" range used for drama, circular definitions, noun stacking, and the vague positive ending. `language-patterns.md` carries their numbers, their before-and-after shape and their false-positive boundaries.

## False positives

The word is not the signal; the mismatch between register and genre is. A humanities text that delves into an archive, a product whose feature genuinely mints tokens, a diff tool whose contract is verbatim output, a quotation, a test title, a locale catalog, product data, an identifier: each keeps its word. `false-positives.md` carries the boundaries in full, and it outranks every entry above — a rewrite that strips a word out of a sentence that earned it is a worse defect than the word.

## Adding an entry

Add the bullet here and nowhere else. A candidate needs three things: the plain word it displaces, evidence it appears in machine-written text across more than one source, and a check that it is not ordinary vocabulary in some common domain. An entry that fires on hand-written text more often than on generated text belongs in `false-positives.md`, not here.

Then read the new entry back against its own section: the scope line above it has to be true of it, and a text that a human wrote is the only thing that proves the entry does not fire on ordinary writing. Nothing else needs editing: every skill that bans a word points here rather than keeping a list.