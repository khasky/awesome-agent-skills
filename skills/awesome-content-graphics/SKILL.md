---
name: awesome-content-graphics
description: "Produces post graphics offline: a user-chosen set size (10, 20, 30 or any number) of self-contained HTML/CSS variants rendered locally to PNG and spread across twelve visual archetypes, built from the supplied facts and the user's own look inputs (brand palette, reference images, an approved render). The source may be a URL, file or text in any language, and a gate settles whether the canvas speaks that language, English, or another the user names; a second gate settles the headline before anything is drawn. Called on its own it hands over the whole set, opens the folder and offers another batch on top; called by a post skill it ends on a pick gate, so the image is never chosen for the user. No image service, no API key, nothing uploaded. Use when asked to 'make an image for this post', 'generate graphics for the campaign', or in Russian 'сделай картинку для поста' — and whenever awesome-content-campaign or awesome-content-repurpose reach a platform that cannot post without media. Do not use for photographic scenes or illustrated characters, which offline HTML cannot render; not for video; not to write the posts — use awesome-content-campaign or awesome-content-repurpose."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "graphics", "social-media", "design", "html-css"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-graphics"
---

# Content Graphics

The image a post ships with, made on the machine that is already running. A self-contained HTML file styled with CSS, screenshotted through browser automation, and nothing else: **no image-generation service, no API key, no upload of the user's content anywhere.**

This is one stage lifted out of the content pipeline so every skill that needs a picture calls it instead of carrying its own copy of the rules. `awesome-content-campaign` calls it when the media library cannot cover a media-required post; `awesome-content-repurpose` calls it when the run has no image; a user calls it directly when they want a graphic and no campaign around it.

**Core principle: the run produces a set, and every choice inside it belongs to the user.** The headline is chosen as text before anything is drawn. What happens to the renders afterwards depends on who called: a post needs one of them picked, a person asked for graphics needs all of them delivered. A skill that renders one graphic and decides it is the answer has taken two decisions it was not given, and correcting either costs a whole round trip.

**Second principle: the facts are the boundary.** The composition may not assert a relationship the caller's sources do not carry. An image is a claim surface like any other sentence, and a wordless claim is still read as evidence.

**Third principle: a set is a spread of kinds, not a spread of shapes.** Twenty variations on one composition are one variant rendered twenty times, and a gallery of them gives the user nothing to decide. The set moves across the archetype catalog — a statement, a claim beside the artifact that proves it, a comparison, a chain, a poster, a transcript — and across surfaces, densities and typographic treatments.

Bundled files (load on demand):

- `references/style-catalog.md` — **read first.** The twelve archetypes a post graphic can be, the five axes they are built from (density, surface, typography, proof object, atmosphere), the device library, the rule for what words are allowed on a canvas, and what is not renderable offline.
- `references/visual-language.md` — the shape vocabulary the emphasis-diagram archetype draws from, the craft that keeps a set from looking like one image recoloured, and the rendering mechanics every archetype shares. **Read it before writing the first line of markup**, not after the first contact sheet comes back grey.

It also reuses, by reference rather than by restating:

- `dataviz` — the chart craft underneath: form choice, the colour formula and its runnable validator (`scripts/validate_palette.js`), mark specs, the anti-pattern catalog. Loaded before any graphic is written.
- `awesome-content-campaign`'s `references/platforms.md` — the Media column, when the caller needs to know which platforms take the result.

## What it produces, and what it does not

What comes out is a **designed graphic built from shapes, type, colour, drawn interface chrome and system emoji** — anything HTML, CSS and inline SVG can compose with the fonts already on the machine. That reaches further than "a flat diagram": posters, comparison cards, terminal and editor mockups, chat transcripts, cut-paper headlines and quote cards are all in range, and `references/style-catalog.md` is the map of them.

What is **out of range, and said plainly to the user rather than approximated**: photographic scenes, illustrated characters, anything needing a fetched brand asset, and anything needing a display font that is not installed. A scene with a person in it needs an illustrator or an image model, and this skill deliberately calls neither. Offered a reference of that kind, name the nearest archetype that is reachable and say what was substituted.

It produces **stills**. A platform whose requirement is video (`tiktok`, `youtube` uploads) cannot be satisfied by this path, and a still is never offered as a substitute — recommend dropping the platform instead of shipping an unpostable draft.

## Two modes, and the run says which one it is in

The same pipeline ends two different ways, and getting this wrong produces a question the user cannot answer.

- **Standalone** — a person asked for graphics. There is no post, no campaign and no attachment. **The whole set is the deliverable**: the files are handed over, the folder is opened, and the run offers to build another batch on top. Nothing is "chosen to ship", because there is nothing to ship it with.
- **Called by another skill** — `awesome-content-campaign` or `awesome-content-repurpose` handed over the input contract below because a post needs a picture. Here one render is chosen, and the pick gate is the point of the run.

**The mode is decided by who invoked it, and it is stated in the first message.** A caller that supplied facts, a boundary and an output folder is the embedded mode; a bare invocation from a person is standalone. Never ask a standalone user which variant "ships with the post" — the post does not exist, and the question reads as the run having lost track of what it was asked to do.

## Invocation

```
/awesome-content-graphics [<facts-source>] [--out <dir>] [--refs <path…>] [--count <n>] [--lang <code>] [--ratio square|vertical|landscape]
```

- `<facts-source>` — a URL, a file, a folder or pasted text carrying the facts the image may draw on: an article, a knowledge map, a source-notes file, a post draft, or a plain description. **It may be in any language, and its language does not decide the graphic's** — that is the Phase 3 question. Nothing given → ask.
- `--out` — where renders land. Default `media/` under the current working folder, `media/src/` for the HTML sources.
- `--refs` — files or folders of reference material the user wants the look built from (see Phase 1). Repeatable.
- `--count` — size of the set: `10`, `20`, `30`, or any number the user names. Passed on the command line it skips the Phase 3 question; omitted, the question is asked.
- `--lang` — the language the words on the canvas are written in. Same rule: passed, it skips the question; omitted, the question is asked.
- `--style` — pin one archetype from `references/style-catalog.md` instead of spreading the set across several.
- `--ratio` — canvas shape. Default square, which survives on every feed.

A URL is fetched and a file is read for its **facts**, not for its wording. Long source text stays out of the conversation context: extract what the picture may claim, and work from that.

## The input contract

A calling skill hands over seven things, and the run states which of them it got. **Standalone, there is no caller**: the facts come from the argument, the language and the count are asked in Phase 3, the rest take their defaults, and the run says which defaults it used.

| Input | What it is | Missing → |
| --- | --- | --- |
| **Facts** | The claims the image may draw on, each with the condition and provenance the source attached | Ask for them. A graphic built on facts nobody supplied is a fabrication with a picture around it |
| **The boundary** | What the sources do NOT say — the adjacent claims a picture would drift into | Ask. This is the section that stops a composition inventing a relationship |
| **Output folder** | Where the renders and their `.html` sources go | Default to `media/` and say so |
| **Look inputs** | Brand palette, reference images, examples, a previously approved render, an archetype by name (Phase 1) | Run with one accent and neutrals, and say that is what happened |
| **Target ratios** | Which platforms the image is for, so the canvas is sized once rather than four times | Square at 1080×1080, stated |
| **Set size** | How many variants, when the caller already asked | Ask it in Phase 3 |
| **Language** | The language the posts are written in, which the graphic matches | Ask it in Phase 3. Never inferred from the source text |

Two constraints ride along from the callers and hold here even when nobody restates them: **no calendar date anywhere on a canvas or in alt text** (a "checked on" stamp is the loudest machine tell an image can carry), and **no long dash** in the headline or the alt text.

## Phase 1 — The look comes from the user's own inputs

**A graphic that ignores what the user handed it is a graphic they will reject, whatever its geometry.** So this phase runs before the facts are ranked and before a headline is written, and it collects the visual system the whole set is built in. Ask once, offering what the caller already knows about:

1. **A brand palette or brand assets** — hex values, a site to read them off, a style guide from an earlier run. This is the strongest input and it wins over every default below.
2. **Reference images or example graphics** — pictures the user likes and wants this to sit next to: their own previous posts, a competitor's feed, a screenshot from anywhere. Read them and name what is being taken: the density, the contrast, the amount of type, where the subject sits, how much of the canvas is empty.
3. **A render they already approved** — the single most useful input a repeat user has, because it is a decision they already made. A previous accepted graphic sets the system for the new set unless they say otherwise.
4. **A description in words** — "dark, very few elements, one strong colour" is a complete answer and often the fastest one.
5. **An archetype by name** — "all of them as posters", "I want the terminal one". Pins the set to one row of `references/style-catalog.md` and waives the spread rule.
6. **Nothing** — one accent hue, one de-emphasis gray, one surface, stated as the default that was used.

**Read a supplied reference against the catalog, and say what it is.** A reference is not a mood; it is a specific point on the five axes, and naming those is what makes it reproducible: which archetype it is, how dense, what surface, what the type is doing, what proof object it carries, which atmosphere devices are on it. "Dark surface with a vignette, statement archetype, outlined caps, bloom behind the wordmark, a faint symbol field at 6 percent" is a reference that can be built from. "Looks nice, modern" is one that cannot.

**A reference that is out of range gets named, not approximated.** Photographic scenes and illustrated characters do not render offline; say which part is unreachable, name the archetype that is, and let the user decide.

**What is taken from a reference is its technique, never its identity.** Density, contrast, composition, edge quality, the relationship between type and shape: all fair. Another company's brand, its logo, its exact palette, a watermarked asset, or a look pinned tightly enough to one living designer that the result reads as theirs: none of it, and say so plainly rather than producing a near-copy and hoping. A reference the user owns is theirs to reuse as closely as they like.

**Then the palette is proved, not eyeballed.** Whatever came out of the answers above goes through `dataviz`'s colour formula and its runnable validator (`scripts/validate_palette.js`): the accent and the de-emphasis gray clear 3:1 against the surface, and they stay separable under protan and tritan simulation. A brand colour that fails is reported with what it fails, and the user decides between their colour and the check — never silently swapped for one that passes.

Record the answers. The set, the gallery and every later regeneration are built in this system, and a run that changes the system mid-set produces twenty variants nobody can compare.

## Phase 2 — Name the primary fact

A source has one fact it is actually about, and a tail of secondary ones that are consequences, colour or anecdote. **The primary fact is the one that had to be true for the rest of the text to exist**: the capability, the measurement, the mechanism that changed. Everything downstream of it — what it enabled, what it costs, who got banned, which product shipped on top — is secondary however quotable it is, and a set anchored there illustrates the story's furniture instead of its subject.

The test is subtraction. Remove the candidate fact and ask whether the source still has a point. Remove "a five second clip generates in about three seconds" and the endless stream, the price of running it and the platform bans all stop making sense; remove the price and the text is unharmed. The one that takes the rest down with it is the primary fact.

**Where the primary fact's number lives outside the given text, go and get it.** A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, record it with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

## Phase 3 — How big is the set, and what language it speaks

Two settings, both decided before a single word is written, both asked in one round through the structured-question UI. Neither is inferred: a run that guesses either one has made a decision the user was never shown.

### The language of the words on the canvas

**The source's language is not the answer.** A user reads an article in Japanese and posts about it in English; another keeps notes in Russian and publishes in Russian; a third writes English posts from an English source and never thinks about it. All three are ordinary, and none of them can be read off the material. So the question is asked, always, and it is asked **before the headline ideas are written** — headlines drafted in the wrong language are thrown away whole, not translated.

Detect the source's language first and **name it in the question**, so the first option means something concrete: `the source's language (Japanese)` reads as a choice, `the source's language` reads as a guess the user has to verify. Then:

| Option | |
| --- | --- |
| **The source's language (`<named>`)** | Keeps the graphic in whatever the material was written in |
| **English** | The common answer when the source is in something else and the audience is not |
| **Another language** | Free text. The user names it, including a language neither the source nor the interface uses |

Where the source is already in the language the user would have picked, say so in one line and let the single obvious option carry it rather than staging a question with one real answer.

**What the answer governs:** every word that reaches a canvas — the headline, labels, section titles, chips, takeaway lines, the text inside a drawn terminal or transcript where that text is prose — and **the alt text, which is written in the same language**. A graphic captioned in one language and described in another is unreadable to whoever needs the description.

**What it never governs:** commands, flags, filenames, code, API names, error strings and product names. Those stay exactly as they are spelled, in every language. A terminal mockup shows the real command; a chip naming a tool shows the tool's real name.

**The chosen language is written in, not translated into.** A headline is composed by someone thinking in that language, with its own idiom, word order and rhythm — never an English line carried across word by word, which is the fastest way to a canvas that reads as machine output. For Russian and English in either direction, `awesome-translate-ru-en` holds the rules and is loaded when the run crosses that pair.

**Three render consequences, checked before the set goes out:**

- **Glyph coverage.** The system font stack must actually carry the script. Cyrillic, Greek, CJK, Arabic, Hebrew, Devanagari and Thai each need a face that has them, and a missing glyph renders as a box that no colour validator will catch. Verify on the first render, not on the contact sheet.
- **Length.** The same sentence runs longer in some languages than in English — German and Russian noticeably so, CJK much shorter. A headline that fit the layout in English overflows its box or drops to a fourth line; size the type to the text that will actually be set.
- **Direction.** Arabic and Hebrew set right to left, which flips the layout, not just the text: `dir="rtl"` on the container, and any composition whose meaning depends on left-to-right order (a chain, a before-and-after, a speed trail) is mirrored so it still reads forward.

### How big is the set

**Ask, unless `--count` already answered.** Four options:

| Option | What it is for |
| --- | --- |
| **10** | A quick pick. Two or three archetypes, one or two surfaces. The right answer when the user knows roughly what they want |
| **20** (recommended) | The default sweep. Four or more archetypes across several surfaces, enough that the gallery contains something the user had not thought of |
| **30** | A wide sweep. Worth it when the source is rich, when an earlier set was rejected wholesale, or when the image matters more than usual |
| **another number** | Whatever the user types |

Two honest limits to state when they are crossed, without refusing the number: **below about 6 the gallery stops being a choice** and becomes a proposal, and **above about 60 the contact sheet stops being readable** at any size that fits a screen, so the last gate degrades into scrolling. Say which one applies and build what they asked for.

**Say that the number is not final**, because it changes how people answer: after the set is rendered the run offers to build another batch of the same size on top of it, so 10 now and 10 more later is a real path and nobody has to over-order to be safe.

The number governs both gates: it is the size of the render set **and** the number of headline ideas offered in Phase 4, so a user who asked for 10 is not handed 20 sentences to read.

**The count is also a work estimate, so say what it costs.** Thirty renders is thirty compositions written by hand, thirty screenshots and a contact sheet that takes real time to read properly. That is the honest trade against a wider choice, and the user should hear it before choosing rather than while waiting.

## Phase 4 — The headline gate, before anything is drawn

**A gallery that varies the message and the picture at the same time asks the user to compare N things along two axes at once**, and the answer they give is unreadable: nobody can say whether variant 7 won on its wording or its shape. Separating them also stops the run wasting a whole set of renders on a sentence the user was never going to publish.

### What a headline is

**The line that carries the claim, in every archetype.** The graphic is seen in a feed by someone who has not read a word of the post yet, and a picture that only makes sense once they do has already lost them. A reader who sees the headline and the composition under it comes away knowing what the post says. `Faster to make than to watch` is a headline. `Generation speed` is a topic, and a topic is not a headline.

Write it as a whole thought — a clause or a short sentence, up to about a dozen words, wrapped over two lines if it needs them. It may name the thing, state the mechanism, or carry the number when the number *is* the point. What it may never be is a fragment the picture has to complete.

**How much other type may sit beside it is the archetype's decision, not a fixed law.** A statement carries the headline and nothing else; a poster carries six tiers of it. What holds everywhere is the rule from `references/style-catalog.md`: **every word on the canvas is the headline, a label naming a real thing the picture depicts, a value that is the point, a section takeaway, or the wordmark — and a word doing none of those is cut.** Read order is forced in every archetype, and no label names something the picture does not show.

Two consequences worth stating. A quantity may **shape** the composition without being written down — a mass sized to a real ratio, a break where the real break falls, a count of marks that is the real count — and in the archetypes that carry no labels it is spelled out only when the headline itself carries it. And the alt text always carries the whole meaning in words, including any quantity the canvas only implies, because that is where a screen-reader user gets it.

**No trademark word carrying its ordinary meaning**, in the headline or the alt text — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A headline stands alone with no paragraph around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company.

### The gate itself

The run writes **as many headline ideas as the Phase 3 count, in the Phase 3 language**, and presents them as text, numbered, with no images yet. They are composed in that language rather than drafted in English and carried across, and a user who types their own gets it used verbatim whichever language they type it in. They are spread across the facts: **at least half state the primary fact**, in genuinely different wordings and angles rather than N paraphrases of one sentence, and the rest carry the secondary facts, whose job is to show the user what else the source could carry rather than to compete for the slot. Practical shape: at least half on the primary fact, at least 3 further facts across the rest, no secondary fact taking more than a fifth of them.

**The list always ends with a free-text option: the user writes their own headline.** That is not a fallback for a failed list, it is the point of showing the list — a page of concrete examples is what makes a person able to say "closer to number 9, but with the price in it". Whatever they type is used verbatim, checked only against the rules above (no claim the sources do not carry, no calendar date, no long dash, no trademark word carrying its ordinary meaning) and reported if it breaks one, never silently rewritten.

**The whole list is shown, and the question is single-choice.** Splitting the options across several questions works for a checkbox list and breaks here, because five single-select questions collect five answers where one is wanted. So print all of them numbered in the message itself, then ask one question carrying a few verbatim plus two open doors: `another number from the list` and `my own wording`. The user has seen every option, and answers once.

## Phase 5 — Render the set

**The chosen headline is the headline for every render**, and the visual set becomes N treatments of one message. The fact spread did its work at the text stage, so this stage varies only what the eye is being asked to compare.

**Vary the archetype first, then the surface, then the composition.** That order matters: two emphasis diagrams with different shapes are near-neighbours, while a statement, a proof object and a poster are three different answers to the same question. The spread rule — at least `⌈n / 5⌉` distinct archetypes, none over 40 percent of the set — is in `references/style-catalog.md`, along with which archetypes suit which kind of idea. A pinned archetype from Phase 1 waives the spread and varies density and surface instead.

**Every render draws the fact its headline states.** This is the trap the two-gate order sets, so it is worth naming: a set drafted before the gate has a composition per fact, and once one headline lands on all of them, every variant built on a different fact starts contradicting its own caption — a picture of a year's cost under a line about seconds. Those are rebuilt as further readings of the chosen fact, never shipped as-is. Where the chosen fact genuinely cannot carry N distinct treatments, say so and ship fewer rather than padding the gallery with variants that argue with their own text.

**The geometry on the canvas is the facts', at their real values.** A mass pair is sized to the actual ratio, an arc swept to the actual fraction, a rhythm spaced at the actual intervals, a field holding the actual count. In the archetypes that print no values, nothing can be checked by a reader — which makes the discipline stricter rather than looser: a shape drawn to look good while implying a quantity the sources do not carry is a fabricated chart with its evidence removed. In the archetypes that do print things — a terminal, a transcript, a labelled grid — the honesty rules bind harder still, and that section of `references/style-catalog.md` is read before the first mockup.

**Canvas size and aspect ratio do not change with the archetype.** Whatever ratio the run was given is what every variant renders at; a poster is a poster inside that frame, at that size, and a reference image's own proportions are never adopted along with its look.

## Phase 6 — Look at every render before the user does

The colour validator checks colour, not layout, so a set will contain marks running off the canvas, forms that collide into mush, type overflowing its box and compositions that turned out to be a grey rectangle — all of which are invisible in the markup and obvious in the image. **Build a contact sheet and read it**, then fix what it shows. Shipping a gallery of broken renders wastes the user's only look at the set.

**Four tests, per variant.** Read only the headline with the picture covered: it has to state the point by itself. Then cover the headline: the composition still has to say which side is bigger, which way the thing moves, where the break is — or, in the denser archetypes, what the structure is. Then count the words and check each one against the five jobs: headline, label on a real thing, value that is the point, section takeaway, wordmark — and check each one is in the chosen language, with only commands, filenames and product names left untranslated. Every glyph rendered, nothing overflowing its box. And look at it beside its neighbours — if it could swap places with another without changing what it means, one of the two is decoration.

**Plus one test on the set.** Name the archetype of every variant and count the distinct ones. Below `⌈n / 5⌉`, or one archetype over 40 percent, the set is narrower than it looks and the thin part gets rebuilt before the gallery goes out.

Then hand the user a page they can look at, not a list of filenames. One gallery from the rendered set, every variant at a size where the composition reads, each labelled with its number and its archetype. In order of preference:

1. A published page, when the runtime can publish one, so the link opens anywhere and survives the session.
2. A local `.html` gallery in the output folder, path given, plus a rendered contact-sheet image so the set is visible even if the page is never opened.

Either way the contact sheet is produced, because a link the user does not open is not a decision they can make.

## Phase 7 — Deliver, and the branch depends on the mode

### Standalone: the set is the deliverable

**Every render is the output, so hand over every render.** There is no post to attach one to, and asking which variant "ships" invents a decision the user never had.

1. **Verify the files as a batch**: they all exist, their pixel dimensions match the target, they open, and none is a stub. Any that fail are fixed or named as dropped.
2. **Hand the files to the user** through whatever the runtime has for delivering files, so they can be saved without going hunting for a path. Where a runtime has nothing of the kind, the absolute folder path plus the gallery link is the fallback, given as text that can be copied.
3. **Open the output folder**, and say that it was opened. This is the one command in the skill that touches the machine outside its own folder, so it is announced rather than silent, and it is skipped in a headless or scheduled run where there is no desktop to open it on. Platform-appropriate: `explorer` on Windows, `open` on macOS, `xdg-open` on Linux — verified to exist before it is called, and a failure is a one-line note, never an error that stops the run.
4. **Then Phase 8**, which is the only question this mode asks after the render.

**Alt text is not written for the whole set here**, because thirty descriptions nobody asked for is thirty descriptions of work. Offer it, and write it for whichever renders the user says they will use.

### Called by another skill: the pick gate

**This one stops the run.** Present it through the structured-question UI, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step the embedded mode exists for.

`none of these` is a real branch, not a polite decline: take what the answer says, fold it into the Phase 1 system, and render a second set. **A set rejected wholesale almost never failed on geometry — it failed on kind.** The first move is to change the archetype mix and the surfaces, not to redraw the same archetype with different shapes; the second is to raise the density, because a set that reads as unremarkable is usually a set of bare canvases. Ask for the count again while doing it: a user who rejected 20 may want 30, or may want 10 built properly in one direction.

## Phase 8 — Another batch, or stop

**Standalone only, and it is asked once the user has the files in hand**, not before — an offer to make more means nothing until they have seen what came out. Four options:

| Option | What happens |
| --- | --- |
| **Another `N`, same direction** | The same count again, continuing the numbering (30 becomes 31 to 60), same headline and same visual system |
| **Another batch, but shifted** | The user says what to change: more of the kind that variant 12 was, lighter surfaces, denser layouts, a different archetype mix. The next batch is built to that |
| **A different count** | Any number, then the same two choices above |
| **Stop here** | The run ends and writes its receipt |

**A second batch adds, it never replaces.** The first set stays on disk with its numbering intact, the new renders continue from where it stopped, and the gallery and contact sheet are rebuilt over everything so the whole thing is comparable in one place. A user who asked for 30 more and got 30 files where their earlier favourite used to be has lost the work they were building on.

**And it does not repeat itself.** The combinations already rendered — archetype, surface, composition, anchor — are recorded, and the new batch takes the ones the first pass did not reach. Where the chosen fact has genuinely run out of distinct treatments, say so and build fewer rather than shipping near-duplicates of variants the user has already rejected by not mentioning them.

Where the user named favourites when asking for more, **those are the brief, not just a hint**: name back what is being carried forward — the archetype, the surface, the density — so a wrong reading gets corrected before another batch is spent on it.

The loop repeats as many times as the user wants it to. Each pass appends to the receipt rather than overwriting it.

## Phase 9 — Hand back

- **Verify what is being handed over**: the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform limits the caller supplied. A graphic that fails any of these is fixed or dropped, never handed back unverified.
- **Write the alt text in the same language as the canvas** — always in the embedded mode, on request in the standalone one. It describes what the image *shows* and what it means, and carries the quantity the canvas only implies: the two masses and the ratio between them, the rhythm and where it breaks, the one form that does not conform, with the number and its condition stated in words since the picture cannot. Not "an infographic about the product", and never a date or a stamp.
- **Keep the whole set** with the `.html` sources. They cost nothing to store, they document what was considered, and the user re-picks or re-renders later without regenerating.
- **Write a receipt** beside the renders — `graphics.md` in the output folder: the mode the run was in, the look inputs the set was built from and what was taken from each, the primary fact and how it was chosen, the source's language and the language the canvas was set in, the set size and who chose it, the archetype spread that was actually built, the headline the user picked out of how many ideas (and whether they typed their own), every batch with its size and what shifted between them, the palette with its validator result, the renderer used, and — in the embedded mode — the variant the user picked out of how many renders, which archetype it is, and its alt text. The calling skill copies the gate answers into its own manifest; a decision recorded only in the transcript is lost the moment the session ends.

**One graphic serves every platform that takes one** — the embedded mode's rule, and it does not apply when nobody is posting anything. The image is made for the post, not for a single network: render it once, and the caller attaches it wherever its Media column says `optional` or `required`, with the article platforms using it as the cover image. Render a second aspect ratio only when a platform's verified ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses. That is about ratios and does not shrink the set: the set is N candidates for one slot, and only the chosen one is ever re-rendered per ratio.

## When the user supplied their own image

Skip all of it. A supplied image, or a library the user pointed at, is a decision already made, and offering variants against it is second-guessing the user. This skill runs when the run is **generating** rather than placing.

## Verification

The report states: **the mode the run was in**, and in the standalone one that the whole set is the deliverable, where it is, and whether the folder was opened; which look inputs were supplied and what was taken from each, read back in the catalog's own terms (archetype, density, surface, type treatment, devices) rather than as a mood, or that none were supplied and one accent plus neutrals was used; the palette with its validator result rather than a claim that it looks fine; the primary fact and the subtraction that identified it; **the source's detected language and the language the words were set in, with who chose it**, plus the glyph-coverage check where the script is not Latin; the set size and whether the user chose it or a flag did; **the archetype spread actually built, counted**; how many headline ideas were offered and which one the user chose, marked when they wrote their own; how many renders were produced across how many batches, how many were rebuilt after the contact-sheet read and what was wrong with them; which variant the user chose and what archetype it is, in the embedded mode; the renderer that was used; and the paths of the renders, their `.html` sources, the gallery and the receipt. Anything that could not be done — no renderer available, a brand colour that fails the contrast check, a reference whose style needs an illustrator, a fact set too thin for N distinct treatments — is named, never implied.

**No renderer available at all** → say so and hand back nothing rather than promising an image. The caller ships the posts text-only and records why.

## Anti-patterns

- **Asking a standalone user which render "ships with the post".** There is no post. The whole set is what they asked for, and the question reads as the run having forgotten who called it.
- Offering `skip the image, post text only` to someone who never mentioned a post, or telling them nothing will be attached when nothing was ever going to be.
- Ending a standalone run at the gallery, leaving the user to dig the files out of a temp path themselves.
- A second batch that overwrites the first, or renumbers it, so the variant the user was building on is gone.
- A second batch that re-renders combinations the first one already covered, and calls thirty near-duplicates thirty new options.
- Opening the user's file manager without saying so, or trying to open one in a headless run.
- Rendering one graphic and attaching it. The set and the two gates are the whole point of the embedded mode.
- **A whole set in one archetype.** N flat compositions on N empty canvases is the failure this catalog exists to end: it reads as unremarkable however varied the shapes are, because the eye compares kinds before it compares geometry.
- Deciding the set size instead of asking, or offering a size question with no free-text option.
- **Setting the canvas in the source's language because that is what the source was in.** The material's language is a fact about the material, never an answer about the audience.
- Asking the language question after the headline ideas are written, so a page of sentences is thrown away or, worse, translated.
- A headline carried across from English word by word instead of composed in the language it ships in.
- Alt text in a different language from the canvas it describes.
- Translating a command, a flag, a filename or a product name because the rest of the canvas changed language.
- A missing glyph shipping as an empty box, or an overflowing headline, because the layout was sized to the English draft.
- A left-to-right composition left unmirrored under right-to-left text, so the picture and the words disagree about which way the story runs.
- Rendering before the headline gate: N pictures of N different messages, and an answer that cannot be read.
- A variant whose picture argues with the headline stamped on it, left in the gallery because it was drafted before the gate.
- Density with no read order: six blocks of equal weight and no entry point, which is a slide rather than a post graphic.
- A word on the canvas doing none of the five jobs — a caption restating the headline, a footer, a decorative label, an orphan naming something the picture does not show.
- The captioned diagram *inside the emphasis archetype*: an axis label or a printed value on a composition whose whole premise is that the shape carries it alone.
- A headline that is a topic (`Generation speed`) or a fragment the picture has to finish.
- Paraphrases of one sentence at the headline stage, or one form recoloured at the render stage.
- A composition drawn to look good while implying a quantity the sources do not carry.
- A mocked interface showing behaviour the product does not have, or a transcript whose lines nobody wrote.
- A calendar date, a "checked on" stamp, or a third-party logo the sources do not connect to the subject.
- Copying a reference's brand, logo or exact palette instead of its technique.
- Approximating an illustrated scene the renderer cannot produce, instead of naming the limit and offering the archetype that is reachable.
- Adopting a reference image's aspect ratio along with its look. The ratio comes from the caller and does not change per variant.
- Describing a variant as a typographic style the installed fonts cannot set.
- Swapping a brand colour that failed the contrast check for one that passes, without telling the user.
- Shipping the gallery without reading the contact sheet, so the user's one look at the set is spent on broken renders.
- Offering a still where the platform requires video.
- Taking over the user's working browser to screenshot local `file://` pages when a headless renderer is available.
