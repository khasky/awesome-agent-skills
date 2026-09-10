---
name: awesome-content-graphics
description: "Produces post graphics offline: a user-chosen set size (5, 25, 50, 100 or any number) of self-contained HTML/CSS variants rendered locally to PNG across a type-led family of statements, tinted-glyph canvases, display-scale number lockups and readable data figures, built from the supplied facts and the user's own look inputs (brand palette, reference images, an approved render). The source may be a URL, file or text in any language, and three gates settle it: which language the canvas speaks, the headline before anything is drawn, and — when a post skill called — which render ships. Called on its own it hands over the whole set and offers another batch. No image service, no API key, nothing uploaded. Use when asked to make an image or graphic for a post or campaign, 'сделай картинку для поста', or whenever awesome-content-campaign or awesome-content-repurpose reach a platform that cannot post without media. Do not use for photographic scenes, illustrated characters, video, or writing the posts themselves."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "graphics", "social-media", "design", "html-css"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-graphics"
---

# Content Graphics

The image a post ships with, made on the machine that is already running. A self-contained HTML file styled with CSS, screenshotted through browser automation, and nothing else: no image-generation service, no API key, no upload of the user's content anywhere.

This is one stage lifted out of the content pipeline so every skill that needs a picture calls it instead of carrying its own copy of the rules. `awesome-content-campaign` calls it when the media library cannot cover a media-required post; `awesome-content-repurpose` calls it when the run has no image; a user calls it directly when they want a graphic and no campaign around it.

Core principle: the run produces a set, and every choice inside it belongs to the user. The headline is chosen as text before anything is drawn. What happens to the renders afterwards depends on who called: a post needs one of them picked, a person asked for graphics needs all of them delivered. A skill that renders one graphic and decides it is the answer has taken two decisions it was not given, and correcting either costs a whole round trip.

Second principle: the facts are the boundary. The composition may not assert a relationship the caller's sources do not carry. An image is a claim surface like any other sentence, and a wordless claim is still read as evidence.

Third principle: a set is a spread of combinations inside one family. Twenty variations on one composition are one variant rendered twenty times, and a gallery of them gives the user nothing to decide. The family is four type-led kinds — a bare statement, a canvas with one tinted glyph, a number lockup at display scale, a data figure carrying its real values — and the spread comes from moving the palette, the background recipe, the figure, the face, the type effect and the anchor underneath them, counted by the signature rule in `references/style-catalog.md`. The kinds have shares: bare statements are capped at 15 percent of a set and data figures never fall under a third. The dense end of the old catalog (drawn code windows, spec tables, section posters, cut-paper headlines) is out, and it is not re-derived per run.

Bundled files (load on demand):

- `references/style-catalog.md` — read first. The four kinds a set is built from and the share each takes, the five axes underneath them (density, palette and background, typography, subject, atmosphere), the palette rule that gives each variant its own harmonised scheme, the glyph-tinting rule, the typesetting rules, the scale gate and the fill gate that keep a canvas from reading as decoration or as a placeholder, the archetypes that were removed and the shelf that is only built on request, the combination rule that spreads a set, the device library, and what is not renderable offline.
- `references/palettes.json` — a pool of 43 schemes (27 dark, 16 light) already proved against the colour rule: accent and muted neutral at 3:1 or better on their ground, foreground at 4.5:1, accent and muted separable under protan and tritan simulation. A no-reference set draws its schemes from here and validates nothing per run; `scripts/palettes.mjs --check` proves a brand colour or a reference palette the same way, and `--generate` rebuilds the pool.
- `scripts/build-set.mjs` (Node 18+, no dependencies) — turns `set.json`, one row per variant, into the self-contained `src/<id>.html` pages through the templates in `scripts/templates/`: the four kinds, three data-figure patterns, the ground recipes, the type effects, the anchors, fonts and icons inlined from the asset cache. A variant is a row, not a page written by hand.
- `scripts/render-set.mjs` (Node 22+, no npm dependencies; needs any Chromium-family browser on the machine, found through `scripts/cdp.mjs`) — one browser for the whole set: the geometry gate on every page, a screenshot for every page that passes, the set-level duplicate sweep (layout skeleton and perceptual distance), the kind and icon quotas, the contact sheets and the gallery, and `report.json` with every number. Exit 0 or one line per finding.
- `scripts/fetch-assets.mjs` — the free-licence faces (Google Fonts, per weight, latin subset) and the drawn icons (Lucide) into a cache shared across runs, with their licences recorded beside them. A second run costs nothing.
- `references/visual-language.md` — the nine data-figure patterns every composition is built from, the geometry check that measures the hard rules on every page before its screenshot, the craft that keeps a set from looking like one image recoloured, and the rendering mechanics every canvas shares. Read it before writing the first line of markup, not after the first contact sheet comes back grey.

It also reuses, by reference rather than by restating:

- `dataviz` — the chart craft underneath: form choice, the colour formula, mark specs, the anti-pattern catalog. Loaded when a data figure is being designed outside the three shipped patterns; the colour check itself is in `scripts/palettes.mjs`, so a run that stays inside the pool and the templates does not need it.
- `awesome-content-campaign`'s `references/platforms.md` — the Media column, when the caller needs to know which platforms take the result.

## What it produces, and what it does not

What comes out is a designed graphic built from type set large, one subject, colour and system emoji — anything HTML, CSS and inline SVG can compose with the fonts already on the machine. In range: the headline as the whole picture, a headline with one tinted glyph, the number pulled out at display scale, and the chart or composition drawn at full scale with its real values on it. `references/style-catalog.md` is the map, and it also names the four archetypes that were tried and removed — drawn code windows, spec-table comparisons, section posters and cut-paper headlines — plus the shelf that is built only when the user asks for it by name.

What is out of range, and said plainly to the user rather than approximated: photographic scenes, illustrated characters, anything needing a fetched brand asset, and anything needing a display font that is not installed. A scene with a person in it needs an illustrator or an image model, and this skill deliberately calls neither. Offered a reference of that kind, name the nearest kind that is reachable and say what was substituted.

It produces stills. A platform whose requirement is video (`tiktok`, `youtube` uploads) cannot be satisfied by this path, and a still is never offered as a substitute — recommend dropping the platform instead of shipping an unpostable draft.

## Hard rules

These are not style preferences and they are not negotiable per run. Every one is measured on the rendered page by the geometry check in `references/visual-language.md`, before the screenshot is kept. A variant that fails any of them is fixed and re-rendered, or dropped from the set — it is never shipped with a note. A run that reports a set as delivered without reporting these numbers has not run the gate.

| # | Rule | Measured as |
| --- | --- | --- |
| R1 | Nothing crosses the frame. No element is clipped by a canvas edge, no shape bleeds off, no decoration pokes out. There is no "declared bleed" and no exception for a shape that "reads fine cut" | every marked element's rect lies inside the 4 percent safe margin on all four sides |
| R2 | Line gaps are positive and even. No line box touches or overlaps another, whatever each line's size, slab or knockout treatment is | every gap between consecutive line boxes is above 6 percent of a line's height, and the gaps differ from each other by at most 8 percent of it |
| R3 | Type never touches a figure or a glyph | at least 2 percent of the canvas clear at the narrowest point between any line box and the subject |
| R4 | Text set inside a shape fits inside it. A number in a donut hole, a label in a plate, a value in a bar: the type is shrunk until it fits, never the other way round | the text rect lies inside the container's inner box with at least 10 percent of that box as padding on every side |
| R5 | No word and no number appears twice on one canvas. Not as a decorative echo, not as a repeated numeral, not as a caption restating the headline | no content word of any text element also appears in another text element, and every digit string on the canvas is unique |
| R6 | A number pulled out at display scale comes out of the headline. The lockup and the sentence never carry the same figure | the lockup's digits do not appear in any headline line |
| R7 | Every comparison is labelled. Two shapes at different sizes with nothing on them are banned outright: no unlabelled mass pairs, cell fields, nested forms, converging strands or rhythms | a figure carries at least two printed values, or one value plus a caption |
| R8 | Every printed value names what it measures. A bare `60%`, `3s` or `35x` with nothing saying of what is a fabrication with a font size | each value element has a caption of one to three words within the same figure |
| R9 | Type is solid filled, never outlined, hollow, stroke-only or shadow-only | inspected on the render; no `-webkit-text-stroke` or transparent fill on a headline |
| R10 | A glyph is tinted into the variant's scheme before it goes on the canvas | its two dominant hues sit within 40 degrees of a scheme member |
| R11 | The canvas is filled: marks span at least 80 percent of the width and the height, no empty square of 40 percent of the canvas side, headline block at least 70 percent of the content width and 22 percent of the canvas height | the fill gate in `references/style-catalog.md` |
| R12 | Kind and subject quotas hold across the set: bare statements at most 15 percent, data figures at least a third, number lockups present wherever the headline carries a figure, and at least a third of the subject canvases carry a drawn stroke icon rather than an emoji — a set that only ever reaches for emoji has left the icon sets unused | counted over the set before the gallery is built |
| R13 | In reference mode, nothing is invented outside the reference. A site, product or brand supplied as the look input owns the grounds, gradients, blobs, components, radii, shadows, type system, motifs and imagery. The default lever tables do not apply — not as a base, not blended | every element of every canvas traces to an entry in the run's `style-pack.md`, with its origin URL, selector or file |
| R14 | A motif inherited from a reference is reproduced at its measured density, never louder. Count per area, size range, alpha and coverage come from the style pack; a canvas may be quieter than the reference and never denser | the motif's coverage on the canvas is at or below the reference's measured coverage, within a tolerance of a quarter |
| R15 | No figure asks the viewer to count, and none carries more than six marks. Waffle grids, icon arrays, cell matrices and any lattice whose meaning is a tally are out — they are decoded, not read | marks per figure counted before it is built |
| R16 | Nothing is clipped by anything, inner boxes included. Not the canvas, not a container, not an SVG viewBox, not an `overflow: hidden` ancestor. A figure or a line that does not fit is scaled down until it does — the box never cuts the content | every marked element's `scrollWidth`/`scrollHeight` is within a pixel of its client box, and its rect lies inside every ancestor's padding box |
| R17 | Type effects come from the allowed list and no other. Banned outright: a line split into two colours across its horizontal middle, long shadows, hard drop shadows, bevel, emboss, 3D extrude, glow-as-fill, arched WordArt type. Allowed: solid fill, accent word or line, a subtle gradient along the type's own axis, highlight slab, knockout block, mixed weight in one line, tight tracking, a size step, an opacity tier for a supporting line | the effect named in the variant's signature is on the list |
| R18 | A glyph or icon never sits on a plate. No card, rounded square, disc or coloured panel behind it — it sits directly on the ground, at the subject scale | no filled box is an ancestor or a sibling-behind of the subject |
| R19 | The subject depicts what the headline says. A glyph or icon is chosen because the claim names or directly implies it, and the link is written down in one clause. Praying hands under a rendering-speed claim is out; where nothing fits, the canvas takes no subject | the link is stated in the plan row before the canvas is built |
| R20 | A reference's branding never lands on the canvas. In reference mode the wordmark, logo, brand name and copyright of the reference are not placed, in any size or corner, unless the user asked for them in words. The reference supplies the look, never its identity | no text or mark on the canvas names the reference |
| R21 | Every render is visually distinct. Two canvases that differ only in hue, or that share a layout skeleton, are one variant rendered twice | no two renders share a quantised layout skeleton, and no pair is below the perceptual-distance floor when downscaled and compared |

## Two modes, and the run says which one it is in

The same pipeline ends two different ways, and getting this wrong produces a question the user cannot answer.

- Standalone — a person asked for graphics. There is no post, no campaign and no attachment. The whole set is the deliverable: the files are handed over, the folder is opened, and the run offers to build another batch on top. Nothing is "chosen to ship", because there is nothing to ship it with.
- Called by another skill — `awesome-content-campaign` or `awesome-content-repurpose` handed over the input contract below because a post needs a picture. Here one render is chosen, and the pick gate is the point of the run.

The mode is decided by who invoked it, and it is stated in the first message. A caller that supplied facts, a boundary and an output folder is the embedded mode; a bare invocation from a person is standalone. Never ask a standalone user which variant "ships with the post" — the post does not exist, and the question reads as the run having lost track of what it was asked to do.

## Invocation

```
/awesome-content-graphics [<facts-source>] [--out <dir>] [--refs <path…>] [--count <n>] [--lang <code>] [--ratio square|vertical|landscape]
```

- `<facts-source>` — a URL, a file, a folder or pasted text carrying the facts the image may draw on: an article, a knowledge map, a source-notes file, a post draft, or a plain description. It may be in any language, and its language does not decide the graphic's — that is the Phase 3 question. Nothing given → ask.
- `--out` — where renders land. Omitted, the run makes a fresh folder of its own under the session's temporary area (see below) and prints the absolute path; the HTML sources go in `src/` beneath it. A path given here is used as-is.
- `--refs` — files or folders of reference material the user wants the look built from (see Phase 1). Repeatable.
- `--count` — size of the set: `5`, `25`, `50`, `100`, or any number the user names. Passed on the command line it skips the Phase 3 question; omitted, the question is asked.
- `--lang` — the language the words on the canvas are written in. Same rule: passed, it skips the question; omitted, the question is asked.
- `--style` — pin one kind from `references/style-catalog.md`, or name one of its shelf archetypes, instead of spreading the set across the family.
- `--ratio` — canvas shape. Default square, which survives on every feed.
- `--assets <dir>` — the font and icon cache. Omitted, the run uses `graphics-assets/` in the session's scratch root, beside the run folders, so every run on the machine shares one cache.
- `--headlines <n>` — how many headline ideas the Phase 4 gate shows. Default 10; the Phase 3 count, up to 25, on request.

A URL is fetched and a file is read for its facts, not for its wording. Long source text stays out of the conversation context: extract what the picture may claim, and work from that.

## The input contract

A calling skill hands over seven things, and the run states which of them it got. Standalone, there is no caller: the facts come from the argument, the language and the count are asked in Phase 3, the rest take their defaults, and the run says which defaults it used.

| Input | What it is | Missing → |
| --- | --- | --- |
| Facts | The claims the image may draw on, each with the condition and provenance the source attached | Ask for them. A graphic built on facts nobody supplied is a fabrication with a picture around it |
| The boundary | What the sources do NOT say — the adjacent claims a picture would drift into | Ask. This is the section that stops a composition inventing a relationship |
| Output folder | Where the renders and their `.html` sources go | Make a fresh run folder under the session's temporary area, never one inside the folder the skill was called from, and print its absolute path |
| Look inputs | Brand palette, reference images, examples, a previously approved render, a kind or a shelf archetype by name (Phase 1) | Generate a validated scheme per variant instead of pinning one, and say that is what happened |
| Target ratios | Which platforms the image is for, so the canvas is sized once rather than four times | Square at 1080×1080, stated |
| Set size | How many variants, when the caller already asked | Ask it in Phase 3 |
| Language | The language the posts are written in, which the graphic matches | Ask it in Phase 3. Never inferred from the source text |

Two constraints ride along from the callers and hold here even when nobody restates them: no calendar date anywhere on a canvas or in alt text (a "checked on" stamp is the loudest machine tell an image can carry), and no long dash in the headline or the alt text.

## Where the renders land

The run never writes into the folder it was invoked from. Twenty PNGs, their HTML sources, a gallery and a contact sheet appearing inside the user's project is a change nobody asked for, and in a repository it lands in `git status` as work the user now has to clean up. A `media/` directory beside their code is the failure mode this rule exists to stop.

So with no `--out` given, make a fresh directory of the run's own and put everything in it: the renders, `src/` for the `.html` sources, the gallery, the contact sheet, `graphics.md`, and `style-pack.md` where the run was in reference mode.

- It goes in the session's scratch or temporary directory when the runtime names one, otherwise the OS temp directory — `%TEMP%` on Windows, `$TMPDIR` on macOS, `/tmp` on Linux.
- It is new on every run, with a unique suffix in the name, so two runs in one session never write over each other and a second invocation never inherits the first one's files.
- It is one folder per run, not per batch: Phase 8's further batches append into the same folder, which is what keeps their numbering and the rebuilt gallery comparable.
- Print its absolute path the first time something is written there, so the user can reach the set without asking where it went.

The set stays in the run folder. The operating system sweeps these paths on its own schedule, and that is accepted: the run hands the files over, opens the folder and moves on. It does not offer to copy the set somewhere permanent — that is a question about the user's filesystem that they did not ask for, and a user who wants the renders kept drags them out of the opened folder themselves or names an `--out` path next time.

An `--out` path is honoured as given, whether a person typed it or a calling skill supplied one. `awesome-content-campaign` and `awesome-content-repurpose` pass a folder inside their own campaign directory because their manifests reference the attachment by path, and a manifest pointing into temp is a broken campaign.

## Phase 1 — The look comes from the user's own inputs

A graphic that ignores what the user handed it is a graphic they will reject, whatever its geometry. So this phase runs before the facts are ranked and before a headline is written, and it settles the visual system the whole set is built in. It is one question with exactly four options, and the wording is fixed. It is asked in the same round as Phase 3's two questions (the language on the canvas and the size of the set): three independent answers, one screen, never three rounds.

| # | Option | What it means |
| --- | --- | --- |
| 1 | Random (recommended) | The run builds the whole system itself — palettes, grounds, faces, icons, motifs — a fresh validated scheme per variant. The default |
| 2 | A site or page as reference | Reference mode. The URL is asked in the next step, then everything is extracted from it |
| 3 | A local image or file as reference | Reference mode against files. The path is asked in the next step |
| 4 | Custom — type it | Free text: a brand's hexes, a description, an approved earlier render, anything the user wants to say |

The question never carries anything else, and these are hard rules, not preferences:

- Never offer a mood as an option. "Dark, cinematic, hot accent", "clean and minimal", "editorial" — none of them. Everything in the templates is used automatically, under the hood, and offering a mood asks the user to do the run's job while pretending it is a choice. A user who wants a mood types it into option 4.
- Never call option 1 "nothing". `Nothing pinned`, `Nothing — a scheme per variant`, `No reference` all read as an absence the user is being blamed for. The word is `Random`, and the sub-line says what the run will do.
- Never propose a reference the user did not name — least of all the source article's own site. The source supplies facts; it has no claim on the look, and `build it from fal's own site` is the run inventing a brand relationship nobody asked for. A reference exists only when the user names it under option 2 or 3.
- Never offer to pin a kind, an archetype or a layout. The kinds and their quotas are the run's business.
- Four options, no fifth. The runtime's own free-text and chat entries are not options this skill adds to.

Options 2 and 3 collect the reference in the next step, not in the question itself. The user picks, and the run then asks for the URL or the path in one short follow-up — never a question that demands the URL be typed into an option field.

### Reference mode — when a site or a resource is the look input

A supplied site is the visual system, not a colour picker. The failure this rule exists to end: a run reads a brand's hex values off a site, then builds the set out of its own default background recipes, its own type treatments and arbitrary system emoji, and hands back a hundred canvases in the brand's colours that could not have come from the brand. The palette was inherited and everything else was invented.

So when a site, an app, a repository or a set of the user's own screens is supplied as the reference, every layer comes from it: the grounds, the gradients, the blobs and washes, the component shapes, the corner radii, the borders and shadows, the type hierarchy, the motifs, the imagery vocabulary, the light and dark modes. The lever tables in `references/style-catalog.md` and the background recipes in `references/visual-language.md` are the no-reference defaults, and in this mode they do not apply. Not as a starting point, not blended, not "mostly".

Extraction, in this order, before a single variant is planned:

1. Open the reference in the render browser and look at it. The same spawned headless browser the set is rendered in loads the page read-only — no login, no form, nothing of the user's uploaded — and screenshots the home page plus two or three of its real section, feature or product pages at full length. Those screenshots are the primary reference, and they are read the way a designer reads a competitor's page: what the ground actually is, where the gradients run, what the cards look like, how the type steps, what the imagery is.
2. Read the computed styles, not the stylesheet. Tokens hide behind CSS custom properties, so `getComputedStyle(document.documentElement)` for the variables, then for the real elements — the hero section, a card, a button, a chip, `h1`, `h2`, body copy — sample `background-image`, `background-color`, `border-radius`, `border`, `box-shadow`, `backdrop-filter`, `font-family`, `font-weight`, `letter-spacing` and `text-transform`. That is where the gradient stops, the radius scale and the shadow scale actually live.
3. Collect the imagery vocabulary. Illustrations, patterns, lattices, icon sets, screenshots, the way the product itself is shown. This replaces the arbitrary system emoji: a glyph appears on a canvas because the reference uses that kind of glyph, and where the reference has its own marks they are the subjects.
4. Where the rendered page hides something and the source of truth is at hand — a repository the user owns, a design-token file, an asset pipeline — read it and say that is where the value came from.
5. Measure every motif, do not describe it. A pattern recorded as "scattered emoji behind the hero at low alpha" is an invitation to overdo it, and overdoing it is what happened: a site whose hero carries a faint, small, sparse scatter came back as twenty large emoji at high alpha covering half the canvas. So the style pack carries numbers, taken off the reference screenshots: how many marks per canvas-sized area, their size as a percentage of the canvas width (min, median, max), their alpha, their blur, their rotation range, and the share of the canvas the motif actually covers. The same for grain, sparkles, blobs and washes.
6. Before any of the above, look for a pack already extracted from this reference: `graphics-assets/style-packs/<host>.md` in the scratch root, written by an earlier run. Under 30 days old, it is reused as-is and the run says so with its date, skipping steps 1 to 5 entirely; older, or the user says the site has changed, and the extraction runs again and overwrites it. Then write the style pack into the run folder (`style-pack.md`), and a copy to that cache path: palette roles, every background the site actually uses, the component specs, the type system, the measured motif specs above, the imagery vocabulary, and the origin of each entry — the URL and selector, or the file and symbol. Every variant is built from that file, and the receipt points at it.

Then the strict part.

- Every element of every canvas traces to the pack. A background that is not one of the site's backgrounds, a card radius that is not on its radius scale, a shadow it does not use, a type treatment it never sets, a stock emoji where its own icon set exists: all out.
- Variation moves inside the reference, not outside it. Which section's ground, which of its components frames the figure, which motif is on it, which type level leads, light mode against dark mode where the site has both, which brand member takes the accent role. That range is wide enough for a hundred variants and it is the only range in play.
- A gap in the reference is asked or omitted, never filled from the defaults. A site with no chart style does not get the generic chart style: the figure is built out of that site's own components — its card, its bars, its chips, its accent — and the receipt says the pattern was adapted rather than inherited.
- A motif is reproduced at the reference's own density, and never louder (R14). The measured numbers are the spec: the count, the size range, the alpha, the coverage. A canvas may land under the reference's density; it may not land over it. Where the measurement is uncertain, go quieter — a motif slightly too faint reads as restraint, a motif twice too dense reads as a different brand.
- The check is a stranger's: put the contact sheet beside the site's screenshots. Could every one of these have come from that site? Any canvas that would look foreign there is rebuilt, and a set where more than a handful would is a set that reverted to the defaults.

The reference's own branding never lands on a canvas (R20). Its wordmark, its logo, its name, its copyright line: none of them, in any size or corner, unless the user asked for them in words. The set is about the user's subject, not about the reference — a small `Emojery` in the corner of a canvas about somebody else's model release is a claim of authorship nobody made, and at that size it is a smudge as well. The reference supplies grounds, components, type and motifs; its identity stays on its own site.

A reference the user does not own is technique only. The rule below still binds: their own site, product or brand is theirs to inherit whole; a competitor's page supplies density, rhythm, structure and craft, never its logo, its wordmark, its exact palette or a look pinned so tightly that the result reads as theirs.

Read a supplied reference against the catalog, and say what it is. A reference is not a mood; it is a specific point on the five axes, and naming those is what makes it reproducible: which kind it is, how dense, what its palette and background recipe are, what the type is doing, what its subject is, which atmosphere devices are on it. "Deep dark ground with a vignette, bare statement, solid caps with one word in the accent, bloom behind the wordmark, a faint symbol field at 6 percent" is a reference that can be built from. "Looks nice, modern" is one that cannot.

A reference that is one of the removed archetypes is named as such, not quietly rebuilt. Handed a screenshot-style code card or a section poster to copy, say that this path dropped that kind and why, offer the nearest family answer, and let the user overrule — a user who insists gets it built, once, as a pinned kind rather than as a slot in the spread.

A reference that is out of range gets named, not approximated. Photographic scenes and illustrated characters do not render offline; say which part is unreachable, name the kind that is, and let the user decide.

What is taken from a reference is its technique, never its identity. Density, contrast, composition, edge quality, the relationship between type and shape: all fair. Another company's brand, its logo, its exact palette, a watermarked asset, or a look pinned tightly enough to one living designer that the result reads as theirs: none of it, and say so plainly rather than producing a near-copy and hoping. A reference the user owns is theirs to reuse as closely as they like.

Colour is one palette or many, and which one is decided here. A brand palette, a site in reference mode, or an approved earlier render pins the scheme, and the whole set is built in it — those hues are the user's identity and they are not traded for variety, and in reference mode the same pinning applies to the backgrounds, the components and the type. With none of that supplied, the set gets a scheme per variant from `references/style-catalog.md`'s palette rule, because one accent hue stretched over fifty renders is one graphic wearing fifty costumes. Say which of the two happened.

Then every palette is proved, not eyeballed, and for a no-reference set that proof is already done. `references/palettes.json` holds 43 schemes that passed the colour rule when the pool was generated: accent and muted neutral at 3:1 or better against their own ground, foreground at 4.5:1, accent and muted still apart under protan and tritan simulation. The set draws its scheme-per-variant from that pool, spread across its hues and its dark and light halves, and validates nothing per run. Only a colour that did not come from the pool is checked at run time — a brand hex, a reference site's palette, a scheme the user typed — through `node scripts/palettes.mjs --check <bg> <fg> <accent> <muted>`, which prints what fails. A brand colour that fails is reported with what it fails, and the user decides between their colour and the check; it is never silently swapped for one that passes.

Record the answers. The set, the gallery and every later regeneration are built in this system — the type rules, the scale and fill gates, the honesty rules — and a run that changes *those* mid-set produces variants nobody can compare. The palette is the one thing that moves between variants when nobody pinned it.

## Phase 2 — Name the primary fact

A source has one fact it is actually about, and a tail of secondary ones that are consequences, colour or anecdote. The primary fact is the one that had to be true for the rest of the text to exist: the capability, the measurement, the mechanism that changed. Everything downstream of it — what it enabled, what it costs, who got banned, which product shipped on top — is secondary however quotable it is, and a set anchored there illustrates the story's furniture instead of its subject.

The test is subtraction. Remove the candidate fact and ask whether the source still has a point. Remove "a five second clip generates in about three seconds" and the endless stream, the price of running it and the platform bans all stop making sense; remove the price and the text is unharmed. The one that takes the rest down with it is the primary fact.

Where the primary fact's number lives outside the given text, go and get it. A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, record it with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

## Phase 3 — How big is the set, and what language it speaks

Two settings, both decided before a single word is written, both asked in the same round as the Phase 1 look question through the structured-question UI. Neither is inferred: a run that guesses either one has made a decision the user was never shown.

### The language of the words on the canvas

The source's language is not the answer. A user reads an article in Japanese and posts about it in English; another keeps notes in Russian and publishes in Russian; a third writes English posts from an English source and never thinks about it. All three are ordinary, and none of them can be read off the material. So the question is asked, always, and it is asked before the headline ideas are written — headlines drafted in the wrong language are thrown away whole, not translated.

Detect the source's language first and name it in the question, so the first option means something concrete: `the source's language (Japanese)` reads as a choice, `the source's language` reads as a guess the user has to verify. Then:

| Option | |
| --- | --- |
| The source's language (`<named>`) | Keeps the graphic in whatever the material was written in |
| English | The common answer when the source is in something else and the audience is not |
| Another language | Free text. The user names it, including a language neither the source nor the interface uses |

Where the source is already in the language the user would have picked, say so in one line and let the single obvious option carry it rather than staging a question with one real answer.

What the answer governs: every word that reaches a canvas — the headline, labels, section titles, chips, takeaway lines, the text inside a drawn terminal or transcript where that text is prose — and the alt text, which is written in the same language. A graphic captioned in one language and described in another is unreadable to whoever needs the description.

What it never governs: commands, flags, filenames, code, API names, error strings and product names. Those stay exactly as they are spelled, in every language. A terminal mockup shows the real command; a chip naming a tool shows the tool's real name.

The chosen language is written in, not translated into. A headline is composed by someone thinking in that language, with its own idiom, word order and rhythm — never an English line carried across word by word, which is the fastest way to a canvas that reads as machine output. For Russian and English in either direction, `awesome-translate-ru-en` holds the rules and is loaded when the run crosses that pair.

Three render consequences, checked before the set goes out:

- Glyph coverage. The system font stack must actually carry the script. Cyrillic, Greek, CJK, Arabic, Hebrew, Devanagari and Thai each need a face that has them, and a missing glyph renders as a box that no colour validator will catch. Verify on the first render, not on the contact sheet.
- Length. The same sentence runs longer in some languages than in English — German and Russian noticeably so, CJK much shorter. A headline that fit the layout in English overflows its box or drops to a fourth line; size the type to the text that will actually be set.
- Direction. Arabic and Hebrew set right to left, which flips the layout, not just the text: `dir="rtl"` on the container, and any composition whose meaning depends on left-to-right order (a chain, a before-and-after, a speed trail) is mirrored so it still reads forward.

### How big is the set

Ask, unless `--count` already answered. Four options:

| Option | What it is for |
| --- | --- |
| 5 | A sample, not a gallery. One canvas per kind plus two, enough to show the direction and settle the palette before spending a real batch on it |
| 25 (recommended) | The default sweep. All four kinds at their shares, across every ground family, enough that the set contains something the user had not thought of |
| 50 | A wide sweep. Worth it when the source is rich, when an earlier set was rejected wholesale, or when the image matters more than usual |
| 100 | The exhaustive pass. Every combination the family holds, delivered as five contact sheets rather than one |
| another number | Whatever the user types |

Three honest limits to state when they are crossed, without refusing the number: at 5 the set is a proposal rather than a choice, and the second batch is where the real gallery gets built; past about 50 the differences between variants become fine ones, since the family is deliberately narrow and its distinct combinations are finite; and above about 25 a contact sheet stops being readable at any size that fits a screen, so it is split into sheets of 25 and the gallery groups by kind. Say which one applies and build what they asked for.

Say that the number is not final, because it changes how people answer: after the set is rendered the run offers to build another batch of the same size on top of it, so 5 now and 25 later is a real path and nobody has to over-order to be safe.

The number governs the render set. The headline gate in Phase 4 shows ten ideas by default whatever the set size, because ten is what a person reads to the end and it already holds the required spread (half on the primary fact, at least three further facts); a user who asked for 5 renders sees 5 ideas, and one who wants the longer list gets the set's count up to 25 with `--headlines` or by asking. The extra renders past the list are further treatments of the chosen line, never further lines.

The count is also a work estimate, so say what it costs. Fifty renders is fifty compositions written by hand, fifty screenshots and two contact sheets that take real time to read properly. That is the honest trade against a wider choice, and the user should hear it before choosing rather than while waiting.

## Phase 4 — The headline gate, before anything is drawn

A gallery that varies the message and the picture at the same time asks the user to compare N things along two axes at once, and the answer they give is unreadable: nobody can say whether variant 7 won on its wording or its shape. Separating them also stops the run wasting a whole set of renders on a sentence the user was never going to publish.

### What a headline is

The line that carries the claim, in every kind. The graphic is seen in a feed by someone who has not read a word of the post yet, and a picture that only makes sense once they do has already lost them. A reader who sees the headline and the composition under it comes away knowing what the post says. `Faster to make than to watch` is a headline. `Generation speed` is a topic, and a topic is not a headline.

Write it as a whole thought — a clause or a short sentence, up to about a dozen words, wrapped over two lines if it needs them. It may name the thing, state the mechanism, or carry the number when the number *is* the point. What it may never be is a fragment the picture has to complete.

Almost nothing else sits beside it. The rule from `references/style-catalog.md`: every word on the canvas is the headline, a value that is itself the point, or the wordmark — and a word doing none of those is cut. A shelf archetype the user asked for by name adds one more job, a label naming a real thing the picture depicts; the family adds nothing. Read order is forced on every canvas, and no label names something the picture does not show.

Two consequences worth stating. A quantity may shape the composition without being written down — a mass sized to a real ratio, a break where the real break falls, a count of marks that is the real count — and it is spelled out only when the headline itself carries it. And the alt text always carries the whole meaning in words, including any quantity the canvas only implies, because that is where a screen-reader user gets it.

No trademark word carrying its ordinary meaning, in the headline or the alt text — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A headline stands alone with no paragraph around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company.

### The gate itself

The run writes ten headline ideas (or the Phase 3 count when it is smaller, or the number `--headlines` named, capped at 25), in the Phase 3 language, and presents them as text, numbered, with no images yet. They are composed in that language rather than drafted in English and carried across, and a user who types their own gets it used verbatim whichever language they type it in. They are spread across the facts: at least half state the primary fact, in genuinely different wordings and angles rather than N paraphrases of one sentence, and the rest carry the secondary facts, whose job is to show the user what else the source could carry rather than to compete for the slot. Practical shape: at least half on the primary fact, at least 3 further facts across the rest, no secondary fact taking more than a fifth of them.

The list always ends with a free-text option: the user writes their own headline. That is not a fallback for a failed list, it is the point of showing the list — a page of concrete examples is what makes a person able to say "closer to number 9, but with the price in it". Whatever they type is used verbatim, checked only against the rules above (no claim the sources do not carry, no calendar date, no long dash, no trademark word carrying its ordinary meaning) and reported if it breaks one, never silently rewritten.

The whole list is shown, and the question is single-choice. Splitting the options across several questions works for a checkbox list and breaks here, because five single-select questions collect five answers where one is wanted. So print all of them numbered in the message itself, then ask one question carrying a few verbatim plus two open doors: `another number from the list` and `my own wording`. The user has seen every option, and answers once.

## Phase 5 — Render the set

The chosen headline is the headline for every render, and the visual set becomes N treatments of one message. The fact spread did its work at the text stage, so this stage varies only what the eye is being asked to compare.

Plan the whole set as signatures before writing a line of markup, and the signatures are the markup. Each variant is a row in `set.json` — palette (a name from the pool, or the pinned scheme), ground recipe, kind, pattern where the kind is a figure, subject and whether it is a drawn icon or an emoji, face, type effect, anchor, and the values with their captions where the kind prints any — and the rule from `references/style-catalog.md` is that no two rows are identical and none match on more than three of the six levers. Collisions are cheap to fix in a table and expensive to fix in a rendered set, and the table is what makes 100 variants honestly distinct rather than 100 files.

The pages are built from the rows, not written by hand. `node scripts/build-set.mjs <run>` reads `set.json` and emits `src/<id>.html` for every row through the templates in `scripts/templates/`: the bare statement, the glyph canvas, the number lockup, and the data figure in its mass, arc and threshold patterns, each with the ground recipes, the type effects on the allowed list, the top and bottom anchors, and the fonts and icons inlined. The templates were tuned against the geometry gate once, so a page built from them passes R1 to R11 on the first render in the ordinary case; writing 25 pages of markup by hand and driving each through the gate three times is the cost this replaces. A hand-written page is still allowed — a composition the templates genuinely cannot express — and it goes into `src/` beside the built ones under the same data-attribute contract; it is the exception in a set, never the set.

Rendering is one command for the whole set. `node scripts/render-set.mjs <run>` launches one headless browser, runs the geometry gate on every page, screenshots every page that passes, compares the set for duplicates (layout skeleton and perceptual distance), counts the kind and icon quotas from `set.json`, builds the contact sheets and the gallery, and writes `report.json`. It exits 0 or prints one line per finding — `07: R21 same layout skeleton as 03`, `05: R4 fit: hole` — and each finding is fixed in its row (or its hand-written page) and the script run again, with `--only <ids>` for the rows that changed. No page is screenshotted by hand and no gate is run by reading the numbers off the page.

Assets are fetched once and shared across runs. Before the build, `node scripts/fetch-assets.mjs --cache <assets> --fonts <faces> --icons <names>` puts the faces the rows name and the icons they name into the cache; anything already there is skipped, so the second set on the machine fetches nothing. A set names about six faces across its rows, not twenty-five: the variety in a set comes from six good faces spread across kinds and grounds, and one face per variant was twenty-five fetches for a difference nobody saw.

Fill the kind quotas before anything else. The kinds table in `references/style-catalog.md` sets them: bare statements at most 15 percent, glyph canvases about a quarter, number lockups about a quarter wherever the chosen headline carries a figure, data figures the rest and never under a third. A set that drifts to a third bare statements has drifted into the cheapest kind to build, and it hands the user a gallery of captions.

Where the headline carries a number, a quarter of the set pulls it out — and the sentence gives it up (R6). `5 seconds of video, generated in about 3` becomes the figure `3s` at display scale over a headline that now reads `5 seconds of video, generated in about` — or, better, over a rewritten line that reads whole without the digit: `generated faster than it plays`. What never happens is both: the figure standing under a sentence that still ends in the same number is the canvas saying one thing twice, and it was the single most common defect in the last set.

In reference mode the levers are the reference's own (R13). The background list, the type treatments and the device library in the reference files are the no-reference defaults; where a site was supplied, the run varies its grounds, its components, its motifs and its type levels instead, and every canvas is checked against the style pack rather than against the default tables.

Vary the palette and the background first, then the kind, then the figure, then the type treatment and the anchor. That order matters: two data figures with different shapes are near-neighbours, while two different colour schemes on two different grounds are the first thing the eye registers. No background recipe over a quarter of the set, no ground family over 40 percent, no shape used more than twice. A kind pinned in Phase 1 waives the kind spread and varies everything underneath it instead; a brand palette pinned in Phase 1 holds the scheme fixed and pushes the variation onto the background recipe and the arrangement.

Name the faces and the icons in the rows first, then fetch them, then build. They are part of the system, not an afterthought: a run that starts drawing before the assets are on disk ends up reaching for emoji every time, which is how a set of a hundred comes back with two devices in it. The drawn-icon quota (R12) is met in the rows, where `subjectType: "icon"` is a field the render script counts.

Every canvas is drawn against the scale gate and the fill gate, both in `references/style-catalog.md`: forms big enough to read at thumbnail size, and type plus subject holding about 80 percent of the frame with no dead 40-percent square in the middle of it. A canvas that respects the margins and leaves the rest empty is the failure these gates exist to stop.

Every figure carries its values (R7, R8). Shown the picture without the headline, a stranger has to be able to say what is being compared, which side wins and what the numbers measure. That is what the printed values are for, and it is why the unlabelled abstract composition is gone from this skill entirely: two rectangles at different sizes, a field of identical cells, a nested pair, converging strands and a rhythm of blocks were each tried, each shipped, and each read as coloured rectangles. There is no size ratio, no accent and no arrangement that rescues an unlabelled comparison — if a shape compares anything, it is labelled, and if it cannot be labelled it is not drawn.

A glyph is tinted into the variant's scheme before it goes on the canvas. A system emoji carries five fixed colours drawn by someone else, and dropped raw onto a scheme built from four it is the loudest thing on the canvas and the only thing not in the palette. Luminosity blend over an accent plate, a filter chain to a target hue, or a glyph whose own colours already sit in the scheme — the rule and the recipes are in `references/style-catalog.md`.

The removed archetypes stay removed while the set is being built. A run that reaches for a drawn code window because the source is a developer tool, or for a two-column table because the fact is a comparison, has re-derived the thing that was cut. The reachable answer is the same fact drawn as mass, path, threshold or break, or stated in type and nothing else.

Every render draws the fact its headline states. This is the trap the two-gate order sets, so it is worth naming: a set drafted before the gate has a composition per fact, and once one headline lands on all of them, every variant built on a different fact starts contradicting its own caption — a picture of a year's cost under a line about seconds. Those are rebuilt as further readings of the chosen fact, never shipped as-is. Where the chosen fact genuinely cannot carry N distinct treatments, say so and ship fewer rather than padding the gallery with variants that argue with their own text.

The geometry on the canvas is the facts', at their real values. A mass pair is sized to the actual ratio, an arc swept to the actual fraction, a rhythm spaced at the actual intervals, a field holding the actual count. The family prints no values, so nothing can be checked by a reader — which makes the discipline stricter rather than looser: a shape drawn to look good while implying a quantity the sources do not carry is a fabricated chart with its evidence removed. Where a shelf archetype the user pinned does print things, the honesty rules bind harder still, and that section of `references/style-catalog.md` is read before the first mockup.

Canvas size and aspect ratio do not change with the kind. Whatever ratio the run was given is what every variant renders at, and a reference image's own proportions are never adopted along with its look.

Nothing is screenshotted until it passes the hard rules, and the render script is what enforces that: it measures every one of R1 to R11, R16, R18 and R21 on the page and takes the screenshot only on a pass (`references/visual-language.md` carries the data-attribute contract the measurement depends on). Clipped shapes, colliding lines, a number spilling out of its donut, a duplicated word and a composition huddled in one corner are all invisible in the markup, they all survive a casual look at a contact sheet, and they are all one measurement away from being caught. A failing variant is fixed and re-rendered, or dropped — never shipped with a note.

## Phase 6 — Look at every render before the user does

The colour validator checks colour, not layout, so a set will contain marks running off the canvas, forms that collide into mush, type overflowing its box and compositions that turned out to be a grey rectangle — all of which are invisible in the markup and obvious in the image. Build a contact sheet and read it, then fix what it shows. Shipping a gallery of broken renders wastes the user's only look at the set.

Four of the six tests below are now numbers in `report.json` — the hard-rule fields, the scale gate, the skeleton match and the perceptual distance — so the eye is spent where a script cannot go. Read the contact sheets, one or two images, not twenty-five files: at cell size a sheet is the 25 percent view, and the two tests that need a reader are made there. Open an individual render only for a cell the sheet or the report flagged.

Six tests, per variant. Read only the headline with the picture covered: it has to state the point by itself. Then cover the headline: the composition still has to say which side is bigger, which way the thing moves, where the break is. Then shrink it to 25 percent and look again — that is the scale gate from `references/style-catalog.md`, and it is where a band of small marks, a hairline subject or a difference of one shade fails while the markup looks perfectly correct. Then read the hard-rule numbers back for that variant, R1 to R11, and treat any failure as a rebuild rather than a note. Then ask the stranger's question: covering the headline, is it obvious what is being compared and which side wins? Then look at the glyph against the scheme: if it is the only thing on the canvas carrying colours the palette does not have, it was not tinted. Then count the words and check each one against the three jobs: headline, value that is the point, wordmark — and check each one is in the chosen language, with only commands, filenames and product names left untranslated. Every glyph rendered and every letter solidly filled, nothing hollow, nothing overflowing its box. And look at it beside its neighbours — if it could swap places with another without changing what it means, one of the two is decoration.

The duplicate sweep on the rendered files (R21) is in the render script and runs before anything else. The signature rule is a plan-time check and it has been gamed: two canvases came back identical in layout, type, motif placement and scale, differing only in the gradient's hue, and both shipped. So the renders themselves are compared. Downscale every PNG to a small grayscale thumbnail and compare every pair, flagging any below the distance floor; separately build each variant's layout skeleton — the marked elements' roles with their bounding boxes quantised to a twentieth of the canvas — and flag any two that match. Every flagged pair means one of the two is rebuilt with a different kind, subject or anchor. A hue change is not a variant, and neither is the same layout in a new palette.

Plus two tests on the set. Write out the six components of every signature — palette, background, kind, subject, face and type effect, anchor — and look for pairs sharing more than three of them; any pair that does, plus any background recipe over a quarter of the set, any ground family over 40 percent or any shape used more than twice, is the thin part and it gets rebuilt. Then look at the contact sheet as colour alone, squinting past the compositions: a sheet that reads as one hue with slight shifts means the palette lever never moved, whatever the plan said, and a sheet with a canvas that stings the eye has a scheme whose harmony rule was skipped for a contrast check. In reference mode, put the sheet beside the reference's own screenshots and ask whether every canvas could have come from that site (R13) — any that could not is rebuilt from the style pack. Then count the kinds against their quotas (R12) — bare statements at or under 15 percent, data figures at or over a third, number lockups present wherever the headline has a figure — and rebuild whatever overshot.

Then hand the user a page they can look at, not a list of filenames. One gallery from the rendered set, every variant at a size where the composition reads, each labelled with its number and its kind, grouped by kind once the set passes 25. In order of preference:

1. A published page, when the runtime can publish one, so the link opens anywhere and survives the session.
2. A local `.html` gallery in the output folder, path given, plus a rendered contact-sheet image so the set is visible even if the page is never opened.

Either way the contact sheet is produced, because a link the user does not open is not a decision they can make. Past 25 variants it is produced in sheets of 25 — `contact-sheet-1.png`, `contact-sheet-2.png` and so on — because a hundred cells on one image is a texture nobody can read, and the point of the sheet is that the run reads it.

## Phase 7 — Deliver, and the branch depends on the mode

### Standalone: the set is the deliverable

Every render is the output, so hand over every render. There is no post to attach one to, and asking which variant "ships" invents a decision the user never had.

1. Verify the files as a batch: they all exist, their pixel dimensions match the target, they open, and none is a stub. Any that fail are fixed or named as dropped.
2. Hand the files to the user through whatever the runtime has for delivering files, so they can be saved without going hunting for a path. Where a runtime has nothing of the kind, the absolute folder path plus the gallery link is the fallback, given as text that can be copied.
3. Open the output folder, and say that it was opened. This is the one command in the skill that touches the machine outside its own folder, so it is announced rather than silent, and it is skipped in a headless or scheduled run where there is no desktop to open it on. Platform-appropriate: `explorer` on Windows, `open` on macOS, `xdg-open` on Linux — verified to exist before it is called, and a failure is a one-line note, never an error that stops the run.
4. Then Phase 8 immediately, which is the only question this mode asks after the render. No question about where the files should live comes between the two: the folder is open, the set is in it, and the next thing the user is asked is whether they want another batch.

Alt text is not written for the whole set here, because thirty descriptions nobody asked for is thirty descriptions of work. Offer it, and write it for whichever renders the user says they will use.

### Called by another skill: the pick gate

This one stops the run. Present it through the structured-question UI, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step the embedded mode exists for.

`none of these` is a real branch, not a polite decline: take what the answer says, fold it into the Phase 1 system, and render a second set. A set rejected wholesale almost never failed on geometry — it failed on kind and on scale. The first move is to change the mix of kinds and the surfaces, not to redraw the same kind with different shapes; the second is to make the type and the subject bigger, because a set that reads as unremarkable is usually a set drawn timidly rather than one that needed more elements on it. Ask for the count again while doing it: a user who rejected 25 may want 50, or may want 5 built properly in one direction.

## Phase 8 — Another batch, or stop

Standalone only, and it is asked once the user has the files in hand, not before — an offer to make more means nothing until they have seen what came out. Four options:

| Option | What happens |
| --- | --- |
| Another `N`, same direction | The same count again, continuing the numbering (25 becomes 26 to 50), same headline and same visual system |
| Another batch, but shifted | The user says what to change: more of the kind that variant 12 was, lighter surfaces, bigger type, a different mix of kinds. The next batch is built to that |
| A different count | Any number, then the same two choices above |
| Stop here | The run ends and writes its receipt |

A second batch adds, it never replaces. The first set stays on disk with its numbering intact, the new renders continue from where it stopped, and the gallery and contact sheet are rebuilt over everything so the whole thing is comparable in one place. A user who asked for 25 more and got 25 files where their earlier favourite used to be has lost the work they were building on.

And it does not repeat itself. The combinations already rendered — kind, surface, shape, type treatment, anchor — are recorded, and the new batch takes the ones the first pass did not reach. Where the chosen fact has genuinely run out of distinct treatments, say so and build fewer rather than shipping near-duplicates of variants the user has already rejected by not mentioning them.

Where the user named favourites when asking for more, those are the brief, not just a hint: name back what is being carried forward — the kind, the surface, the shape — so a wrong reading gets corrected before another batch is spent on it.

The loop repeats as many times as the user wants it to. Each pass appends to the receipt rather than overwriting it.

## Phase 9 — Hand back

- Verify what is being handed over: the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform limits the caller supplied. A graphic that fails any of these is fixed or dropped, never handed back unverified.
- Write the alt text in the same language as the canvas — always in the embedded mode, on request in the standalone one. It describes what the image *shows* and what it means, and carries the quantity the canvas only implies: the two masses and the ratio between them, the rhythm and where it breaks, the one form that does not conform, with the number and its condition stated in words since the picture cannot. Not "an infographic about the product", and never a date or a stamp.
- Keep the whole set with the `.html` sources. They cost nothing to store, they document what was considered, and the user re-picks or re-renders later without regenerating.
- Write a receipt beside the renders — `graphics.md` in the output folder: the mode the run was in, the look inputs the set was built from and what was taken from each, the style pack and its origins where a reference was supplied, the primary fact and how it was chosen, the source's language and the language the canvas was set in, the set size and who chose it, the signature of every variant that was actually built — palette, background, kind, subject, face and type effect, anchor — the faces and icon sets used with their versions and licences, the share of subject canvases that carried a drawn icon, the headline the user picked out of how many ideas (and whether they typed their own), every batch with its size and what shifted between them, the palette with its validator result, the renderer used, and — in the embedded mode — the variant the user picked out of how many renders, which kind it is, and its alt text. The calling skill copies the gate answers into its own manifest; a decision recorded only in the transcript is lost the moment the session ends.

One graphic serves every platform that takes one — the embedded mode's rule, and it does not apply when nobody is posting anything. The image is made for the post, not for a single network: render it once, and the caller attaches it wherever its Media column says `optional` or `required`, with the article platforms using it as the cover image. Render a second aspect ratio only when a platform's verified ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses. That is about ratios and does not shrink the set: the set is N candidates for one slot, and only the chosen one is ever re-rendered per ratio.

## When the user supplied their own image

Skip all of it. A supplied image, or a library the user pointed at, is a decision already made, and offering variants against it is second-guessing the user. This skill runs when the run is generating rather than placing.

## Verification

The report states: the mode the run was in, and in the standalone one that the whole set is the deliverable, the absolute path of the run folder it was written to, whether that folder was opened, and whether the set was copied out to a folder the user named; which look inputs were supplied and what was taken from each, read back in the catalog's own terms (kind, density, palette and background, type treatment, devices) rather than as a mood, or that none were supplied and a scheme per variant was generated instead; in reference mode, the URLs opened and the pages screenshotted, the path of the style pack, and the origin of every ground, component and motif the set was built from; the palettes with their validator results rather than a claim that they look fine — the pinned brand scheme, or how many schemes were generated, which harmony relationship each was built on, and how many were re-stepped after a failure; the primary fact and the subtraction that identified it; the source's detected language and the language the words were set in, with who chose it, plus the glyph-coverage check where the script is not Latin; the set size and whether the user chose it or a flag did; the spread actually built, counted across the six signature components, with the share each kind took against its quota, the scale-gate read at 25 percent zoom and the hard-rule gate's result across the set, R1 to R21 by number, including the duplicate sweep's flagged pairs and what was rebuilt, with every variant that had to be rebuilt or dropped to pass it; how many headline ideas were offered and which one the user chose, marked when they wrote their own; how many renders were produced across how many batches, how many were rebuilt after the contact-sheet read and what was wrong with them; which variant the user chose and what kind it is, in the embedded mode; the renderer that was used; and the paths of the renders, their `.html` sources, the gallery, every contact sheet and the receipt. Anything that could not be done — no renderer available, a brand colour that fails the contrast check, a reference whose style needs an illustrator, a fact set too thin for N distinct treatments — is named, never implied.

The report also quotes `render-set.mjs`'s last line — pages passed out of pages built, findings, the renderer it found — and the `report.json` path, because a set reported as gated without that line is the claim the script exists to replace; and it names the asset cache used and whether a style pack was reused from it.

No renderer available at all (`render-set.mjs` reports no Chromium-family browser and `CHROME_PATH` is unset) → say so and hand back nothing rather than promising an image. The caller ships the posts text-only and records why.

## Anti-patterns

- Asking a standalone user which render "ships with the post". There is no post. The whole set is what they asked for, and the question reads as the run having forgotten who called it.
- Offering `skip the image, post text only` to someone who never mentioned a post, or telling them nothing will be attached when nothing was ever going to be.
- Ending a standalone run at the gallery, leaving the user to dig the files out of a temp path themselves, or letting the run end without offering to copy the set out of a folder the OS will sweep.
- Writing the set into the folder the run was invoked from, so a `media/` directory nobody asked for appears in the user's project and their next `git status` is full of PNGs.
- Reusing one fixed temp folder across runs, so a second set overwrites the first one's numbering and the user's earlier favourites are gone.
- A second batch that overwrites the first, or renumbers it, so the variant the user was building on is gone.
- A second batch that re-renders combinations the first one already covered, and calls thirty near-duplicates thirty new options.
- Opening the user's file manager without saying so, or trying to open one in a headless run.
- Rendering one graphic and attaching it. The set and the two gates are the whole point of the embedded mode.
- A whole set on one kind and one surface. N compositions that vary only the shape read as one variant rendered N times, because the eye compares kind and surface before it compares geometry.
- A composition that fails the scale gate: a band of small marks with a third of the canvas empty under it, a hairline as the subject, or a difference of one nudge and one shade. It looks correct in the markup and reads as nothing at feed size.
- Hollow type: outlined caps, a stroke with the background showing through, a shadow or a glow standing in for the fill. Every letter on every canvas is solidly filled.
- Geometry over the edge (R1): a clipped arrowhead, a block cut in half by the right margin, a decoration poking past the frame, a headline running out of the canvas. There is no bleed exception to fall back on any more.
- The same word or number twice on one canvas (R5, R6): a lockup repeating the figure the headline still carries, a decorative echo of the headline behind itself, a caption restating the line above it. The second copy is always the one to cut, and what replaces it is a glyph, a figure or nothing.
- An unlabelled comparison (R7): two rectangles at different sizes, a nested pair, a field of cells, a rhythm of blocks. Tried, shipped, rejected — the honest version prints its values.
- A bare value (R8): `60%` in a donut hole with nothing saying sixty percent of what.
- Text spilling out of the shape it sits in (R4): a number wider than its donut hole, a label past the end of its bar. The type shrinks; the shape does not stretch.
- A canvas carrying a small headline in one corner and a small subject in the other, with a dead square between them. That is the fill gate, and it fails at 80 percent span or a 40-percent void.
- Offering a mood, a pinned kind, or a reference the user never named in the look-input question — including the source article's own site. Four options: Random, a URL, a local file, custom.
- Calling the default option "nothing". It is `Random`, and the sub-line says what the run will do.
- A motif turned up past the reference's own density (R14): a faint, sparse scatter on the site rendered as twenty large marks covering half the canvas. Quieter than the reference is fine; louder is a different brand.
- A line of type split into two colours across its middle, a long shadow, an extrude or an arch (R17). The effect list is closed; anything outside it is not variety, it is a dated tic.
- A glyph on a plate (R18): a rounded pink square behind an emoji, a disc behind an icon. The tint fixes the colour clash; a box around it does not.
- A subject that has nothing to do with the claim (R19): praying hands under a rendering-speed headline, a sparkle under a price. No subject beats a wrong one.
- A donut with flat sides, a bar cut by its card, a line sliced by its block (R16): an inner container narrower than its content, hidden by `overflow: hidden` until the render. Scale the content, never crop it.
- The reference's wordmark in the corner (R20) of a canvas about someone else's product.
- Two renders that differ only in hue (R21), shipped as two options because the plan table said their palettes were different.
- A set that never uses a drawn icon (R12), because emoji were easier to reach for.
- A figure that has to be counted (R15): a waffle grid, an icon array, a cell matrix. Printing `60 of 100` beside it admits the problem rather than fixing it.
- A set built from two devices: emoji and blobs over and over, the face never changing, no icon ever drawn.
- A linked web font or a hotlinked icon in an emitted file, or a face used without its licence checked and recorded.
- Inheriting a reference's palette and inventing everything else (R13): the brand's hexes on the skill's own default backgrounds, its own type treatments and stock emoji. A hundred canvases in the brand's colours that could not have come from the brand is the failure reference mode exists to end.
- Filling a gap in a reference from the default tables instead of building it out of the reference's own components, or asking.
- One palette across the whole set when the user pinned nothing: fifty renders in one accent hue read as one graphic recoloured, whatever the shapes are doing.
- A scheme that passes contrast and hurts to look at: two saturated hues of similar lightness meeting at a long edge, a neutral gray ink on a coloured ground, an accent at the 3:1 shape floor carrying a headline word.
- A raw system emoji on a generated scheme, bringing its own five colours onto a canvas built from four.
- A headline whose lines sit on different rhythms or overlap (R2, R3), because a slab or a scaled-up line has a taller box than its neighbours and nobody measured the gaps — or one that sits on top of the glyph it was supposed to sit beside.
- Offering to copy the set out of the temp folder, or asking any question about where the files should live. The folder is opened and the run moves to the next-batch question.
- A third of the set as bare statements, which is the cheapest kind to build and the one that gives the user nothing the headline gate did not already give them.
- A number left inline in the headline on every single variant, with the display-scale lockup never used.
- Rebuilding a removed archetype because the source suggested it: a drawn code window for a developer tool, a two-column table for a comparison, a numbered section list for a feature set. They were cut after a full set was read, not left as a per-run judgment call.
- Deciding the set size instead of asking, or offering a size question with no free-text option.
- A single contact sheet carrying 50 or 100 cells, which is a texture rather than a thing the run can read.
- Setting the canvas in the source's language because that is what the source was in. The material's language is a fact about the material, never an answer about the audience.
- Asking the language question after the headline ideas are written, so a page of sentences is thrown away or, worse, translated.
- A headline carried across from English word by word instead of composed in the language it ships in.
- Alt text in a different language from the canvas it describes.
- Translating a command, a flag, a filename or a product name because the rest of the canvas changed language.
- A missing glyph shipping as an empty box, or an overflowing headline, because the layout was sized to the English draft.
- A left-to-right composition left unmirrored under right-to-left text, so the picture and the words disagree about which way the story runs.
- Rendering before the headline gate: N pictures of N different messages, and an answer that cannot be read.
- A variant whose picture argues with the headline stamped on it, left in the gallery because it was drafted before the gate.
- A canvas carrying more than its kind's budget: a statement that grew a subhead, a diagram that grew a chip row, two glyphs where the kind allows one.
- A word on the canvas doing none of the three jobs — a caption restating the headline, a subhead, a footer, a decorative label, an orphan naming something the picture does not show.
- The captioned diagram: an axis label or a printed value on a composition whose whole premise is that the shape carries it alone.
- A headline that is a topic (`Generation speed`) or a fragment the picture has to finish.
- Paraphrases of one sentence at the headline stage, or one form recoloured at the render stage.
- A composition drawn to look good while implying a quantity the sources do not carry.
- A mocked interface showing behaviour the product does not have, or a transcript whose lines nobody wrote.
- A calendar date, a "checked on" stamp, or a third-party logo the sources do not connect to the subject.
- Copying a reference's brand, logo or exact palette instead of its technique.
- Approximating an illustrated scene the renderer cannot produce, instead of naming the limit and offering the kind that is reachable.
- Adopting a reference image's aspect ratio along with its look. The ratio comes from the caller and does not change per variant.
- Describing a variant as a typographic style the installed fonts cannot set.
- Swapping a brand colour that failed the contrast check for one that passes, without telling the user.
- Shipping the gallery without reading the contact sheet, so the user's one look at the set is spent on broken renders.
- Offering a still where the platform requires video.
- Taking over the user's working browser to screenshot local `file://` pages when a headless renderer is available.
- Writing twenty-five pages of markup by hand when twenty-five rows in `set.json` and one build command produce them, or re-typing the geometry check into an evaluate call when `render-set.mjs` runs it on every page.
- Launching a browser per page, screenshotting by hand, and reading the gate's numbers off the page one variant at a time.
- Looking at twenty-five PNGs one by one when the contact sheet is the 25 percent view the scale gate asks for.
- Fetching a face per variant, or validating a scheme that came from the pool, or extracting a style pack the cache already holds for that host.
- Three question rounds for the look, the language and the count, when the three answers are independent and fit one screen.
- Twenty-five headline ideas shown to someone who will read ten.
