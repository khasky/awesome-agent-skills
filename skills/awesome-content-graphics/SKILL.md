---
name: awesome-content-graphics
description: "Produces post graphics offline: a user-chosen set size (10, 50, 100 or any number) of self-contained HTML/CSS variants rendered locally to PNG across a family of glyph canvases, display-scale number lockups, readable data figures, comparison cards and lists, and commercially usable stock photographs in quiet zones, frames, tilted cards and duotones, built from the supplied facts and the user's own look inputs (brand palette, reference images). The source may be a URL, file or text in any language; one screen settles the language on the canvas, the set size and the headlines (a different line per render drawn from the strongest parts of the source, or one line the user types), and when a post skill called, a pick gate settles which render ships. Called on its own it hands over the whole set and offers another batch. No image service, no API key, nothing uploaded. Use when asked to make an image or graphic for a post or campaign, 'сделай картинку для поста', or whenever awesome-content-campaign or awesome-content-repurpose reach a platform that cannot post without media. Do not use for a photograph or an illustration made to order, video, or writing the posts themselves."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "graphics", "social-media", "design", "html-css"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-graphics"
---

# Content Graphics

The image a post ships with, made on the machine that is already running. A self-contained HTML file styled with CSS, screenshotted through browser automation, and nothing else: no image-generation service, no API key, no upload of the user's content anywhere.

This is one stage lifted out of the content pipeline so every skill that needs a picture calls it instead of carrying its own copy of the rules. `awesome-content-campaign` calls it when the media library cannot cover a media-required post; `awesome-content-repurpose` calls it when the run has no image; a user calls it directly when they want a graphic and no campaign around it.

Core principle: the run produces a set, and every choice inside it belongs to the user. The headlines are settled as text before anything is drawn: a pool written from the strongest parts of the source with a different line per render, or the one line the user typed. What happens to the renders afterwards depends on who called: a post needs one of them picked, a person asked for graphics needs all of them delivered. A skill that renders one graphic and decides it is the answer has taken two decisions it was not given, and correcting either costs a whole round trip.

Second principle: the facts are the boundary. The composition may not assert a relationship the caller's sources do not carry. An image is a claim surface like any other sentence, and a wordless claim is still read as evidence.

Third principle: a set is a spread of combinations inside one family, and a variant is a layout carrying a headline. Twenty palettes on one layout under one line are one variant rendered twenty times, and a gallery of them gives the user nothing to decide. The family is five kinds — a canvas with one tinted glyph, a number lockup at display scale, a data figure carrying its real values, a list card built from the source's own claims, and a commercially usable stock photograph the claim names — and the spread comes from the layouts of `references/visual-language.md` multiplied by the headlines in play, with the palette, the ground, the face, the type effect and the anchor moving underneath so the set reads as many. The kinds have shares: photographs lead wherever the claims name something a photograph can show, and figures, lists and photos together never fall under a third. The dense end of the old catalog (drawn code windows, spec tables, section posters, cut-paper headlines) is out, and so is the bare statement, a line between two rules on an empty canvas; neither is re-derived per run.

Bundled files (load on demand):

- `references/style-catalog.md` — read first. The five kinds a set is built from and the share each takes, the five axes underneath them (density, palette and background, typography, subject, atmosphere), the palette rule that gives each variant its own harmonised scheme, the glyph-tinting rule, the typesetting rules, the scale gate and the fill gate that keep a canvas from reading as decoration or as a placeholder, the archetypes that were removed and the shelf that is only built on request, the combination rule that spreads a set, the device library, and what is not renderable offline.
- `references/palettes.json` — a pool of 43 schemes (27 dark, 16 light) already proved against the colour rule: accent and muted neutral at 3:1 or better on their ground, foreground at 4.5:1, accent and muted separable under protan and tritan simulation. A no-reference set draws its schemes from here and validates nothing per run; `scripts/palettes.mjs --check` proves a brand colour or a reference palette the same way, and `--generate` rebuilds the pool.
- `scripts/build-set.mjs` (Node 18+, no dependencies) — turns `set.json`, one row per variant, into the self-contained `src/<id>.html` pages through the templates in `scripts/templates/`: the five kinds, nine figure patterns, four list patterns, ten photo layouts, the ground recipes, the type effects, the anchors, fonts, icons and photos inlined from the asset cache. A variant is a row, not a page written by hand.
- `scripts/render-set.mjs` (Node 22+, no npm dependencies; needs any Chromium-family browser on the machine, found through `scripts/cdp.mjs`) — one browser for the whole set: the geometry gate on every page, a screenshot for every page that passes, the set-level duplicate sweep (layout skeleton and perceptual distance), the kind and icon quotas, the contact sheets and the gallery, and `report.json` with every number. Exit 0 or one line per finding.
- `scripts/fetch-assets.mjs` — the free-licence faces (Google Fonts, per weight, latin subset), the drawn icons (Lucide) and the stock photographs (Openverse, CC0 first and CC BY with its credit second, several candidates per query with `--per`, a contact sheet to read before any lands on a canvas) into a cache shared across runs, with their licences recorded beside them. A second run costs nothing.
- `references/visual-language.md` — the layout catalog every row is built from (glyph canvases, lockups, the nine figure patterns, the list cards, the photo layouts and their quiet zones), the geometry check that measures the hard rules on every page before its screenshot, the craft that keeps a set from looking like one image recoloured, and the rendering mechanics every canvas shares. Read it before writing the first line of markup, not after the first contact sheet comes back grey.

It also reuses, by reference rather than by restating:

- `dataviz` — the chart craft underneath: form choice, the colour formula, mark specs, the anti-pattern catalog. Loaded when a data figure is being designed outside the three shipped patterns; the colour check itself is in `scripts/palettes.mjs`, so a run that stays inside the pool and the templates does not need it.
- `awesome-content-campaign`'s `references/platforms.md` — the Media column, when the caller needs to know which platforms take the result.

## What it produces, and what it does not

What comes out is a designed graphic built from type set large, one subject, colour and system emoji — anything HTML, CSS and inline SVG can compose with the fonts already on the machine. In range: a headline with one tinted glyph, the number pulled out at display scale, the chart drawn at full scale with its real values on it, a list of the source's claims, and a stock photograph of the thing the claim names. `references/style-catalog.md` is the map, and it also names the four archetypes that were tried and removed — drawn code windows, spec-table comparisons, section posters and cut-paper headlines — plus the shelf that is built only when the user asks for it by name.

What is out of range, and said plainly to the user rather than approximated: a photographic scene or an illustrated character made to order, anything needing a fetched brand asset, and anything needing a display font that is not installed. A stock photograph is in range: a commercially usable picture that already exists, fetched once into the asset cache under its licence and put on a canvas because the claim names what it shows (`references/visual-language.md`, *Photos*). What stays out is generating one. A scene with a person in it needs an illustrator or an image model, and this skill deliberately calls neither. Offered a reference of that kind, name the nearest kind that is reachable and say what was substituted.

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
| R11 | The canvas is filled: marks span at least 80 percent of the width and the height, the content (type, subject, figure or photo, with the accent rules left out) at least 70 percent of each, no empty square of 40 percent of the canvas side, headline block at least 70 percent of the content width (30 percent on a page that declares a two-column layout, where the value or subject fills the other column) and 22 percent of the canvas height, and the widest headline line spanning at least two thirds of the canvas width (a quarter in a column), so a headline above or below a photo runs the photo's width rather than sitting in short lines on the left | the fill gate in `references/style-catalog.md` |
| R12 | Kind and subject quotas hold across the set: no statement rows, content canvases (data figures, lists and photos together) at least a third, number lockups present wherever a headline carries a figure, and at least a third of the subject canvases carry a drawn stroke icon rather than an emoji — a set that only ever reaches for emoji has left the icon sets unused | counted over the set before the gallery is built |
| R13 | In reference mode, nothing is invented outside the reference. A site, product or brand supplied as the look input owns the grounds, gradients, blobs, components, radii, shadows, type system, motifs and imagery. The default lever tables do not apply — not as a base, not blended | every element of every canvas traces to an entry in the run's `style-pack.md`, with its origin URL, selector or file |
| R14 | A motif inherited from a reference is reproduced at its measured density, never louder. Count per area, size range, alpha and coverage come from the style pack; a canvas may be quieter than the reference and never denser | the motif's coverage on the canvas is at or below the reference's measured coverage, within a tolerance of a quarter |
| R15 | No figure asks the viewer to count, and none carries more than six marks. Waffle grids, icon arrays, cell matrices and any lattice whose meaning is a tally are out — they are decoded, not read | marks per figure counted before it is built |
| R16 | Nothing is clipped by anything, inner boxes included. Not the canvas, not a container, not an SVG viewBox, not an `overflow: hidden` ancestor. A figure or a line that does not fit is scaled down until it does — the box never cuts the content | every marked element's `scrollWidth`/`scrollHeight` is within a pixel of its client box, and its rect lies inside every ancestor's padding box |
| R17 | Type effects come from the allowed list and no other. No vignette, inset shadow or darkened edge on the canvas either: the ground is flat, a gradient, a blob or a spot. Banned outright: a line split into two colours across its horizontal middle, long shadows, hard drop shadows, bevel, emboss, 3D extrude, glow-as-fill, arched WordArt type. Allowed: solid fill, accent word or line, a subtle gradient along the type's own axis, highlight slab, knockout block, mixed weight in one line, tight tracking, an opacity tier for a supporting line, quotation marks in the accent around a serif line | the effect named in the variant's signature is on the list |
| R18 | A glyph or icon never sits on a plate. No card, rounded square, disc or coloured panel behind it — it sits directly on the ground, at the subject scale | no filled box is an ancestor or a sibling-behind of the subject |
| R19 | The subject depicts what the headline says. A glyph or icon is chosen because the claim names or directly implies it, and the link is written down in one clause. Praying hands under a rendering-speed claim is out; where nothing fits, the canvas takes no subject | the link is stated in the plan row before the canvas is built |
| R20 | A reference's branding never lands on the canvas. In reference mode the wordmark, logo, brand name and copyright of the reference are not placed, in any size or corner, unless the user asked for them in words. The reference supplies the look, never its identity | no text or mark on the canvas names the reference |
| R21 | Every render is visually distinct. Two canvases that differ only in hue, or that share a layout skeleton, are one variant rendered twice | no two renders share a quantised layout skeleton, and no pair is below the perceptual-distance floor when downscaled and compared |
| R22 | The headline is set to be read at feed size and written the way a feed reads: type between a twentieth and a seventh of the canvas height (a twenty-fourth in a column), every number in digits, no semicolon | the headline's computed font size against the canvas height; its text against a list of number words and the `;` character |

## Two modes, and the run says which one it is in

The same pipeline ends two different ways, and getting this wrong produces a question the user cannot answer.

- Standalone — a person asked for graphics. There is no post, no campaign and no attachment. The whole set is the deliverable: the files are handed over, the folder is opened, and the run offers to build another batch on top. Nothing is "chosen to ship", because there is nothing to ship it with.
- Called by another skill — `awesome-content-campaign` or `awesome-content-repurpose` handed over the input contract below because a post needs a picture. Here one render is chosen, and the pick gate is the point of the run.

The mode is decided by who invoked it, and it is stated in the first message. A caller that supplied facts, a boundary and an output folder is the embedded mode; a bare invocation from a person is standalone. Never ask a standalone user which variant "ships with the post" — the post does not exist, and the question reads as the run having lost track of what it was asked to do.

## Invocation

```
/awesome-content-graphics [<facts-source>] [--out <dir>] [--refs <path…>] [--count <n>] [--headline "<text>"] [--lang <code>] [--ratio square|vertical|landscape]
```

- `<facts-source>` — a URL, a file, a folder or pasted text carrying the facts the image may draw on: an article, a knowledge map, a source-notes file, a post draft, or a plain description. It may be in any language, and its language does not decide the graphic's — that is the Phase 3 question. Nothing given → ask.
- `--out` — where renders land. Omitted, the run makes a fresh folder of its own under the session's temporary area (see below) and prints the absolute path; the HTML sources go in `src/` beneath it. A path given here is used as-is.
- `--refs` — files or folders of reference material the user wants the look built from (see Phase 1). Repeatable.
- `--count` — size of the set: `10`, `50`, `100`, or any number the user names. Passed on the command line it skips the Phase 3 question; omitted, the question is asked.
- `--headline` — one line, used verbatim on every render. Passed, it skips the Phase 4 question; omitted, the question is asked, and its default writes a different headline per render.
- `--lang` — the language the words on the canvas are written in. Same rule: passed, it skips the question; omitted, the question is asked.
- `--style` — pin one kind from `references/style-catalog.md`, or name one of its shelf archetypes, instead of spreading the set across the family.
- `--ratio` — canvas shape. Default square, which survives on every feed.
- `--assets <dir>` — the font and icon cache. Omitted, the run uses `graphics-assets/` in the session's scratch root, beside the run folders, so every run on the machine shares one cache.

A URL is fetched and a file is read for its facts, not for its wording. Long source text stays out of the conversation context: extract what the picture may claim, and work from that.

## The input contract

A calling skill hands over nine things, and the run states which of them it got. Standalone, there is no caller: the facts come from the argument, the language and the count are asked in Phase 3, the rest take their defaults, and the run says which defaults it used.

| Input | What it is | Missing → |
| --- | --- | --- |
| Facts | The claims the image may draw on, each with the condition and provenance the source attached | Ask for them. A graphic built on facts nobody supplied is a fabrication with a picture around it |
| The boundary | What the sources do NOT say — the adjacent claims a picture would drift into | Ask. This is the section that stops a composition inventing a relationship |
| Output folder | Where the renders and their `.html` sources go | Make a fresh run folder under the session's temporary area, never one inside the folder the skill was called from, and print its absolute path |
| Look inputs | Brand palette, reference images, examples, or a shelf archetype named in words (Phase 1) | Random: the run builds the system from the source's own context, a validated scheme per variant, and says that is what happened |
| Target ratios | Which platforms the image is for, so the canvas is sized once rather than four times | Square at 1080×1080, stated |
| Set size | How many variants, when the caller already asked | Ask it in Phase 3 |
| Post title | The title the post ships with. It is line 1 of the headline pool and the line every other line is measured against, so the picture and the post tell one story | Standalone, the primary fact of Phase 2 is written as a title first, to the same rules, and the pool grows from it |
| Headline | One line for every render, when the caller already has it | Ask it in Phase 4, on the same screen; the default writes a line per render from the facts |
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

A graphic that ignores what the user handed it is a graphic they will reject, whatever its geometry. So this phase runs before the facts are ranked and before a headline is written, and it settles the visual system the whole set is built in. It is one question with exactly four options, and the wording is fixed. It is asked in the same round as the language and the set size (Phase 3) and the headline mode (Phase 4): four independent answers, one screen, never four rounds.

| # | Option | What it means |
| --- | --- | --- |
| 1 | Random (recommended) | The run builds the whole system itself from the source's own context — palettes, grounds, faces, icons, photo queries, motifs — a fresh validated scheme per variant. The default |
| 2 | A site or page as reference | Reference mode. The URL is asked in the next step, then everything is extracted from it |
| 3 | A local image or file as reference | Reference mode against files. The path is asked in the next step |
| 4 | Custom — type it | Free text: a brand's hexes, a description in words, anything the user wants to say |

Random is built from the post, never rolled. The source handed to the run (the text, the URL, the facts a caller passed) decides what the set looks like before any lever is rotated: what the thing is picks the photo queries and the icon vocabulary (a storage engine gets drives and memory modules, a design tool gets paper and pencils); who it is for picks the register the palettes are drawn from (a developer tool sits on deep and technical grounds, a consumer app on light and warm ones); the headline pool decides which rows carry a lockup, a figure or a list. The levers then move underneath that reading so the set reads as many, and the receipt says what the reading was. A user who wants to steer it types the steer into option 4.

The question never carries anything else, and these are hard rules, not preferences:

- Never offer a mood as an option, and never dress option 4 up as one. "Dark, cinematic, hot accent", "clean and minimal", "editorial", `Describe it: dark, technical` — none of them. Everything in the templates is used automatically, under the hood, and offering a mood asks the user to do the run's job while pretending it is a choice. Option 4 is `Custom — type it`, with no sample answer in its label. A user who wants a mood types it there.
- Never offer an earlier render as an option. `An approved render from an earlier run` is not a look input: the run has no such render, the user has files they can point at under option 3, and the option reads as the run remembering work it never saw.
- Never call option 1 "nothing". `Nothing pinned`, `Nothing — a scheme per variant`, `No reference` all read as an absence the user is being blamed for. The word is `Random`, and the sub-line says what the run will do.
- Never propose a reference the user did not name — least of all the source article's own site. The source supplies facts; it has no claim on the look, and `build it from fal's own site` is the run inventing a brand relationship nobody asked for. A reference exists only when the user names it under option 2 or 3.
- Never offer to pin a kind, an archetype or a layout. The kinds and their quotas are the run's business.
- Four options, no fifth, and the labels are the four rows above verbatim: the first is always `Random (recommended)`, the last is always `Custom — type it`. The runtime's own free-text and chat entries are not options this skill adds to.

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

Read a supplied reference against the catalog, and say what it is. A reference is not a mood; it is a specific point on the five axes, and naming those is what makes it reproducible: which kind it is, how dense, what its palette and background recipe are, what the type is doing, what its subject is, which atmosphere devices are on it. "Deep dark ground with an off-canvas light, one tinted glyph, solid caps with one word in the accent, bloom behind the wordmark, a faint symbol field at 6 percent" is a reference that can be built from. "Looks nice, modern" is one that cannot.

A reference that is one of the removed archetypes is named as such, not quietly rebuilt. Handed a screenshot-style code card or a section poster to copy, say that this path dropped that kind and why, offer the nearest family answer, and let the user overrule — a user who insists gets it built, once, as a pinned kind rather than as a slot in the spread.

A reference that is out of range gets named, not approximated. Photographic scenes and illustrated characters do not render offline; say which part is unreachable, name the kind that is, and let the user decide.

What is taken from a reference is its technique, never its identity. Density, contrast, composition, edge quality, the relationship between type and shape: all fair. Another company's brand, its logo, its exact palette, a watermarked asset, or a look pinned tightly enough to one living designer that the result reads as theirs: none of it, and say so plainly rather than producing a near-copy and hoping. A reference the user owns is theirs to reuse as closely as they like.

Colour is one palette or many, and which one is decided here. A brand palette or a site in reference mode pins the scheme, and the whole set is built in it — those hues are the user's identity and they are not traded for variety, and in reference mode the same pinning applies to the backgrounds, the components and the type. With none of that supplied, the set gets a scheme per variant from `references/style-catalog.md`'s palette rule, because one accent hue stretched over fifty renders is one graphic wearing fifty costumes. Say which of the two happened.

Then every palette is proved, not eyeballed, and for a no-reference set that proof is already done. `references/palettes.json` holds 43 schemes that passed the colour rule when the pool was generated: accent and muted neutral at 3:1 or better against their own ground, foreground at 4.5:1, accent and muted still apart under protan and tritan simulation. The set draws its scheme-per-variant from that pool, spread across its hues and its dark and light halves, and validates nothing per run. Only a colour that did not come from the pool is checked at run time — a brand hex, a reference site's palette, a scheme the user typed — through `node scripts/palettes.mjs --check <bg> <fg> <accent> <muted>`, which prints what fails. A brand colour that fails is reported with what it fails, and the user decides between their colour and the check; it is never silently swapped for one that passes.

Record the answers. The set, the gallery and every later regeneration are built in this system — the type rules, the scale and fill gates, the honesty rules — and a run that changes *those* mid-set produces variants nobody can compare. The palette is the one thing that moves between variants when nobody pinned it.

## Phase 2 — Name the primary fact

A source has one fact it is actually about, and a tail of secondary ones that are consequences, colour or anecdote. The primary fact is the one that had to be true for the rest of the text to exist: the capability, the measurement, the mechanism that changed. Everything downstream of it — what it enabled, what it costs, who got banned, which product shipped on top — is secondary however quotable it is, and a set anchored there illustrates the story's furniture instead of its subject.

The test is subtraction. Remove the candidate fact and ask whether the source still has a point. Remove "a five second clip generates in about three seconds" and the endless stream, the price of running it and the platform bans all stop making sense; remove the price and the text is unharmed. The one that takes the rest down with it is the primary fact.

Where the primary fact's number lives outside the given text, go and get it. A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, record it with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

## Phase 3 — What language the canvas speaks, and how big the set is

Two settings, both decided before a single word is written, both asked in the same round as the Phase 1 look question and the Phase 4 headline question through the structured-question UI. Neither is inferred: a run that guesses either one has made a decision the user was never shown.

### The language of the words on the canvas

The source's language is not the answer. A user reads an article in Japanese and posts about it in English; another keeps notes in Russian and publishes in Russian; a third writes English posts from an English source and never thinks about it. All three are ordinary, and none of them can be read off the material. So the question is asked, always, and it is asked before the headline pool is written — headlines drafted in the wrong language are thrown away whole, not translated.

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

Ask, unless `--count` already answered. Four options, and the wording is fixed:

| Option | What it is for |
| --- | --- |
| 10 | A first look: every kind at least once, enough to settle the palette and the photo direction before a real batch |
| 50 (recommended) | The default sweep. Every layout the source supports, each carrying several different headlines, across every ground family |
| 100 | The exhaustive pass, delivered as four contact sheets with the gallery grouped by kind |
| Type here | Whatever number the user types |

The number is honest because a variant is a layout carrying a headline. The layouts in `references/visual-language.md` (about thirty; fewer when the source carries no number, since the lockup and figure layouts then fall away) are multiplied by the headlines in play. Under Random headlines (Phase 4) the pool is written to the size the count needs, `ceil(count / layouts the source supports)` lines and never fewer than three, and a photo layout may repeat only with a different photo. Under a typed headline there is one line, so the ceiling is the layouts times the usable photos, and a request above it is answered plainly: `this source supports 26 variants under one headline; Random headlines reach 100`. What never fills the gap is a palette, face, ground or icon rotation: two rows on one layout under one headline are one variant rendered twice, and the render script's R21 sweep catches them after the fact.

Three limits to state when they are crossed, without refusing the number: at 10 the set is a proposal rather than a gallery, and the second batch is where the gallery gets built; above 25 a contact sheet stops being readable at any size that fits a screen, so it is split into sheets of 25 and the gallery groups by kind; and at 100 the reading is the real cost, four sheets and a good quarter of an hour, and the run says so.

Say that the number is not final, because it changes how people answer: after the set is rendered the run offers another batch of the same size on top of it, so 10 now and 50 later is a real path and nobody has to over-order to be safe.

The count is also a work estimate, though a smaller one than it was: a set is rows in `set.json`, one build and one render, so a hundred costs about four minutes of rendering and the time it takes to read four contact sheets.

## Phase 4 — Headlines, before anything is drawn

The headline is the one thing on a canvas a stranger reads, so it is settled as text, in the Phase 3 language, before a single row is written. It is one question on the same screen as the look, the language and the count, with exactly two options and fixed wording:

| # | Option | What it means |
| --- | --- | --- |
| 1 | Random (recommended) | The run writes the headlines itself from the strongest parts of the source, the ones that carry the point of the post, and gives different renders different lines |
| 2 | Type here | The user types one headline, and it goes on every render verbatim |

Never offer a list of drafted lines to pick from, never a mood, never a third option. The runtime's own free-text entry is what option 2 is, and a run that shows ten candidate sentences and asks for a number has turned the user into its copy editor.

### What a headline is

A post title. It is written to the rules `awesome-content-repurpose` puts on the title of a post (`references/authored-style.md` there, *The headline*): read alone, it names the subject and states the point in one clause, and then it stops. Aim for 50 to 60 characters, cap 70, at most 12 words, no terminal period; it never explains why the thing is good, never opens on `why`, never announces what `we just got`, never runs a product roll-call, never bolts a qualifier on after the point has landed. The graphic is seen in a feed next to the post's own title by someone who has not read a word of the post, and the two have to tell one story: a reader who sees the title, the headline and the composition under it comes away knowing what the post says.

So every line in the pool is a title the post could have shipped with, never a sentence lifted from its body. The test is to put the line under the post's title and ask whether a stranger still knows what the thing is and what it does. `Edge0 streams MoE experts off SSD to fit 35B in 3 GB` passes. `Only the routed experts leave the drive, so memory stays small` fails: a step of the mechanism with its subject cut, obvious to someone who has read the post and to nobody else. `The checkpoint stays on the SSD, RAM holds only the experts in use` fails the same way. `Both models ship as previews, with agent work still weak` fails twice: a caveat from the tail of the post leading the picture, and a qualifier bolted on after the clause. `Faster to make than to watch` under a title that names the tool is a headline. `Generation speed` is a topic, and a topic is not a headline.

Under a post skill the post's own title is line 1 of the pool, handed over in the contract, and every other line is measured against it. Standalone, the primary fact of Phase 2 is written as that title first, and the pool grows from it.

Wrapped over two to five lines on the canvas, it stays one clause. It names the thing and states what it does, and carries the number when the number *is* the point. What it may never be is a fragment the picture has to complete, or a line that needs the post's body to make sense. What sits under it (a value at display scale, a figure's captions, a list's lines, the caption layout's note) is extra data the composition carries, and the headline never leans on it: it reads whole with the rest of the canvas covered. The render gate counts the shape (length, words, the title shapes that fail on sight, R22); the subject test is the writer's.

Numbers in a headline are digits, always: `35B parameters, about 3B awake per token`, never `Thirty-five billion parameters, about three billion awake per token`. Digits are what an eye in a feed catches, and a spelled-out number is a sentence the reader has to parse before the picture means anything. And no semicolon: a headline that needs one is two headlines, and the pool keeps the stronger half. The render gate measures both (R22).

Almost nothing else sits beside it. The rule from `references/style-catalog.md`: every word on the canvas is the headline, a value that is itself the point, a list line that is itself a claim from the source, or the wordmark — and a word doing none of those is cut. A shelf archetype the user asked for by name adds one more job, a label naming a real thing the picture depicts; the family adds nothing. Read order is forced on every canvas, and no label names something the picture does not show.

Two consequences worth stating. A quantity may shape the composition without being written down — a mass sized to a real ratio, a break where the real break falls — and it is spelled out only when the headline itself carries it. And the alt text always carries the whole meaning in words, including any quantity the canvas only implies, because that is where a screen-reader user gets it.

No trademark word carrying its ordinary meaning, in the headline or the alt text — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A headline stands alone with no paragraph around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company.

### Random: the pool

The pool is written after the primary fact is named (Phase 2) and sized by the count (Phase 3): `ceil(count / layouts the source supports)` lines, never fewer than three and never more than 25. It is spread across the facts: at least half state the primary fact, in genuinely different wordings and angles rather than paraphrases of one sentence, and the rest carry the secondary facts, no secondary fact taking more than a fifth of the pool. Every line names the subject and reads as the post's title; a secondary fact enters the pool only where it can be written as a title of this post, never as a caveat, an aside or a step of the mechanism with the subject cut. Every line is composed in the Phase 3 language by someone thinking in it, checked against the boundary (no claim the sources do not carry), the honesty rules (no calendar date, no long dash, no trademark word in its ordinary meaning), the feed rules (every number in digits, no semicolon, R22) and the rules a template needs (a line whose number goes into a lockup gives the digit up, R6).

The pool is printed in the message as a numbered list, each line marked with the fact it carries, so the user sees what the set is about to say. It is not a question: the run proceeds to the rows, and a user who wants a line changed says so, and the rows carrying it are rebuilt. Rows take lines so that a layout never carries the same line twice, every line lands on at least two kinds, and the primary-fact lines take the photo and glyph canvases first, since those are the renders that stop the scroll. A line goes on a list or a figure row only where none of its content words is repeated by the list's own lines or the figure's captions (R5).

### Type here: one line

The typed line is used verbatim, in whatever language it is typed, checked only against the rules above and reported if it breaks one, never rewritten. Every render carries it, so the set is N treatments of one message and its ceiling is the layouts times the usable photos; Phase 3 states that ceiling, and a count above it is met with the ceiling plus the offer of Random headlines rather than with palette rotations.

## Phase 5 — Render the set

Every row carries its headline: under Random a line from the pool, under a typed line the same line everywhere. A row's identity is its layout and its headline (and its photo, where it has one); everything else spreads the set visually and never makes a variant on its own.

Plan the whole set as signatures before writing a line of markup, and the signatures are the markup. Each variant is a row in `set.json` — its headline lines, palette (a name from the pool, or the pinned scheme), ground recipe, kind, pattern where the kind is a figure or a list, layout and zone where it is a photo, subject and whether it is a drawn icon, an emoji or a photograph, face, type effect, anchor, and the values with their captions where the kind prints any — and two rows may not share a layout, a headline and a fact. Palette, face, ground and icon spread the set visually and are rotated so that no ground family passes 40 percent and no face passes a third, and a layout that repeats under another line takes the opposite tone, a different ground and, on a photo layout, a different photo, so the two read apart at thumbnail size (a layout with no lever beyond tone, a glyph canvas, carries at most two lines); but they never make a variant: a row that differs from another in nothing else is deleted from the table, not rendered. The render script enforces the same rule after the fact, since its skeleton fingerprint carries the layout and the printed values together. Collisions are cheap to fix in a table and expensive to fix in a rendered set, and the table is what makes 80 variants honestly distinct rather than 80 files.

The pages are built from the rows, not written by hand. `node scripts/build-set.mjs <run>` reads `set.json` and emits `src/<id>.html` for every row through the templates in `scripts/templates/`: the glyph canvas, the number lockup, the data figure in its nine patterns, the list card in its compare, bullets, checklist and stats patterns, and the photograph in its split, card, duotone, frame, caption, quiet-zone and band layouts, each with the ground recipes, the type effects on the allowed list, the anchors, and the fonts, icons and photos inlined. The templates were tuned against the geometry gate once, so a page built from them passes R1 to R11 on the first render in the ordinary case; writing 25 pages of markup by hand and driving each through the gate three times is the cost this replaces. A hand-written page is still allowed — a composition the templates genuinely cannot express — and it goes into `src/` beside the built ones under the same data-attribute contract; it is the exception in a set, never the set.

Rendering is one command for the whole set. `node scripts/render-set.mjs <run>` launches one headless browser, runs the geometry gate on every page, screenshots every page that passes, compares the set for duplicates (layout skeleton and perceptual distance), counts the kind and icon quotas from `set.json`, builds the contact sheets and the gallery, and writes `report.json`. It exits 0 or prints one line per finding — `07: R21 same layout skeleton as 03`, `05: R4 fit: hole` — and each finding is fixed in its row (or its hand-written page) and the script run again, with `--only <ids>` for the rows that changed. No page is screenshotted by hand and no gate is run by reading the numbers off the page.

Assets are fetched once and shared across runs. Before the build, `node scripts/fetch-assets.mjs --cache <assets> --fonts <faces> --icons <names> --photos "<query>;<query>" --per 3` puts the faces, the icons and several stock-photo candidates per query into the cache, and writes `photos/sheet.png`, which the run reads before any photo is named in a row (a wrong picture, a logo, a face or on-screen text is refused with `--reject`, a file that stalls the 2x capture probe is refused by the script itself, and the query fetches the next candidate); anything already there is skipped, so the second set on the machine fetches nothing.

Photographs are the first subject reached for, not the last. A real picture of the thing the claim names is what stops the scroll in a feed of flat type, and Openverse supplies it keyless and commercially usable: CC0 first, CC BY second with its credit carried into the receipt. So the queries are written from the headline pool before the rows are planned — one or two per line, naming the visible thing the line implies — and a set whose claims name anything a photograph can show puts photos on at least a quarter of its rows, across the layouts in the catalog (a split, a tilted card, a duotone, a frame, a caption, the headline in a quiet zone under a local tint, a band). A set with photos in range and none used has skipped its strongest device. Nothing drawn sits beside a photograph: no icon, no emoji, no spark, no shape. The picture is the subject, a second one argues with it, and the ground under a photo canvas stays a flat colour, a gradient, paper or a soft light; the builder refuses a photo row that names a subject. A photo is still a subject under R19: the row says in one clause which claim it stands for, and a picture that shows the wrong thing is refused, never kept for its colours. A set names about six faces across its rows, not twenty-five: the variety in a set comes from six good faces spread across kinds and grounds, and one face per variant was twenty-five fetches for a difference nobody saw.

Fill the kind quotas before anything else. The kinds table in `references/style-catalog.md` sets them: glyph canvases about a fifth, number lockups about a fifth wherever a headline carries a figure, photographs at least a quarter wherever the claims name something a photograph can show, data figures and lists the rest, and figures, lists and photos together never under a third. A bare statement, a line between two rules on an empty canvas, is not a kind any more: ten of them on one sheet read as captions with nothing to look at, and the same line goes on a glyph, a lockup, a list or a photo row.

Where a headline carries a number, its lockup rows pull it out — and the sentence gives it up (R6). `5 seconds of video, generated in about 3` becomes the figure `3s` at display scale over a headline that now reads `5 seconds of video, generated in about` — or, better, over a rewritten line that reads whole without the digit: `generated faster than it plays`. What never happens is both: the figure standing under a sentence that still ends in the same number is the canvas saying one thing twice, and it was the single most common defect in the last set.

In reference mode the levers are the reference's own (R13). The background list, the type treatments and the device library in the reference files are the no-reference defaults; where a site was supplied, the run varies its grounds, its components, its motifs and its type levels instead, and every canvas is checked against the style pack rather than against the default tables.

Vary the palette and the background first, then the kind, then the figure, then the type treatment and the anchor. That order matters: two data figures with different shapes are near-neighbours, while two different colour schemes on two different grounds are the first thing the eye registers. No background recipe over a quarter of the set, no ground family over 40 percent, no layout repeated under one line. A kind pinned in Phase 1 waives the kind spread and varies everything underneath it instead; a brand palette pinned in Phase 1 holds the scheme fixed and pushes the variation onto the background recipe and the arrangement.

Name the faces and the icons in the rows first, then fetch them, then build. They are part of the system, not an afterthought: a run that starts drawing before the assets are on disk ends up reaching for emoji every time, which is how a set of a hundred comes back with two devices in it. The drawn-icon quota (R12) is met in the rows, where `subjectType: "icon"` is a field the render script counts.

Every canvas is drawn against the scale gate and the fill gate, both in `references/style-catalog.md`: forms big enough to read at thumbnail size, and type plus subject holding about 80 percent of the frame with no dead 40-percent square in the middle of it. A canvas that respects the margins and leaves the rest empty is the failure these gates exist to stop.

Every figure carries its values (R7, R8). Shown the picture without the headline, a stranger has to be able to say what is being compared, which side wins and what the numbers measure. That is what the printed values are for, and it is why the unlabelled abstract composition is gone from this skill entirely: two rectangles at different sizes, a field of identical cells, a nested pair, converging strands and a rhythm of blocks were each tried, each shipped, and each read as coloured rectangles. There is no size ratio, no accent and no arrangement that rescues an unlabelled comparison — if a shape compares anything, it is labelled, and if it cannot be labelled it is not drawn.

A glyph is tinted into the variant's scheme before it goes on the canvas. A system emoji carries five fixed colours drawn by someone else, and dropped raw onto a scheme built from four it is the loudest thing on the canvas and the only thing not in the palette. Luminosity blend over an accent plate, a filter chain to a target hue, or a glyph whose own colours already sit in the scheme — the rule and the recipes are in `references/style-catalog.md`.

The removed archetypes stay removed while the set is being built. A run that reaches for a drawn code window because the source is a developer tool, or for a two-column table because the fact is a comparison, has re-derived the thing that was cut. The reachable answer is the same fact drawn as mass, path, threshold or break, or stated in type and nothing else.

Every render draws the fact its own headline states. With a pool in play the subject is chosen for the row's line, not for the set: a photo, an icon or a figure under a line about speed shows speed, not price, and a line swapped on a row after the fact means its subject is re-checked. A picture of a year's cost under a line about seconds is rebuilt, never shipped as-is. Where a line genuinely cannot carry the layouts assigned to it, it takes fewer rows rather than a subject that argues with it.

The geometry on the canvas is the facts', at their real values. A mass pair is sized to the actual ratio, an arc swept to the actual fraction, a rhythm spaced at the actual intervals, a field holding the actual count. The family prints no values, so nothing can be checked by a reader — which makes the discipline stricter rather than looser: a shape drawn to look good while implying a quantity the sources do not carry is a fabricated chart with its evidence removed. Where a shelf archetype the user pinned does print things, the honesty rules bind harder still, and that section of `references/style-catalog.md` is read before the first mockup.

Canvas size and aspect ratio do not change with the kind. Whatever ratio the run was given is what every variant renders at, and a reference image's own proportions are never adopted along with its look.

Nothing is screenshotted until it passes the hard rules, and the render script is what enforces that: it measures every one of R1 to R11, R16, R18 and R21 on the page and takes the screenshot only on a pass (`references/visual-language.md` carries the data-attribute contract the measurement depends on). Clipped shapes, colliding lines, a number spilling out of its donut, a duplicated word and a composition huddled in one corner are all invisible in the markup, they all survive a casual look at a contact sheet, and they are all one measurement away from being caught. A failing variant is fixed and re-rendered, or dropped — never shipped with a note.

## Phase 6 — Look at every render before the user does

The colour validator checks colour, not layout, so a set will contain marks running off the canvas, forms that collide into mush, type overflowing its box and compositions that turned out to be a grey rectangle — all of which are invisible in the markup and obvious in the image. Build a contact sheet and read it, then fix what it shows. Shipping a gallery of broken renders wastes the user's only look at the set.

Four of the six tests below are now numbers in `report.json` — the hard-rule fields, the scale gate, the skeleton match and the perceptual distance — so the eye is spent where a script cannot go. Read the contact sheets, one or two images, not twenty-five files: at cell size a sheet is the 25 percent view, and the two tests that need a reader are made there. Open an individual render only for a cell the sheet or the report flagged.

Six tests, per variant. Read only the headline with the picture covered: it has to state the point by itself. Then cover the headline: the composition still has to say which side is bigger, which way the thing moves, where the break is. Then shrink it to 25 percent and look again — that is the scale gate from `references/style-catalog.md`, and it is where a band of small marks, a hairline subject or a difference of one shade fails while the markup looks perfectly correct. Then read the hard-rule numbers back for that variant, R1 to R11, and treat any failure as a rebuild rather than a note. Then ask the stranger's question: covering the headline, is it obvious what is being compared and which side wins? Then look at the glyph against the scheme: if it is the only thing on the canvas carrying colours the palette does not have, it was not tinted. Then count the words and check each one against the three jobs: headline, value that is the point, wordmark — and check each one is in the chosen language, with only commands, filenames and product names left untranslated. Every glyph rendered and every letter solidly filled, nothing hollow, nothing overflowing its box. And look at it beside its neighbours — if it could swap places with another without changing what it means, one of the two is decoration.

The duplicate sweep on the rendered files (R21) is in the render script and runs before anything else. The signature rule is a plan-time check and it has been gamed: two canvases came back identical in layout, type, motif placement and scale, differing only in the gradient's hue, and both shipped. So the renders themselves are compared. Downscale every PNG to a small grayscale thumbnail and compare every pair, flagging any below the distance floor; separately build each variant's layout skeleton — the marked elements' roles with their bounding boxes quantised to a twentieth of the canvas — and flag any two that match. Every flagged pair means one of the two is rebuilt with a different kind, subject or anchor. A hue change is not a variant, and neither is the same layout in a new palette.

Plus two tests on the set. Write out the six components of every signature — palette, background, kind, subject, face and type effect, anchor — and look for pairs sharing more than three of them; any pair that does, plus any background recipe over a quarter of the set, any ground family over 40 percent or any layout repeated under one line, is the thin part and it gets rebuilt. Then look at the contact sheet as colour alone, squinting past the compositions: a sheet that reads as one hue with slight shifts means the palette lever never moved, whatever the plan said, and a sheet with a canvas that stings the eye has a scheme whose harmony rule was skipped for a contrast check. In reference mode, put the sheet beside the reference's own screenshots and ask whether every canvas could have come from that site (R13) — any that could not is rebuilt from the style pack. Then count the kinds against their quotas (R12) — no statement rows, figures, lists and photos together at or over a third, number lockups present wherever a headline has a figure — and rebuild whatever overshot.

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

This one stops the run, and it opens with the set rather than with the question. Open the gallery on the user's machine first and say that it was opened — the same platform-appropriate command and the same announcement as the standalone branch above (`explorer` on Windows, `open` on macOS, `xdg-open` on Linux, verified before it is called) — and put its absolute path and the folder's in the message that asks. Asking for a number from a gallery nobody has opened is asking the user to choose blind, which is the one thing this gate exists to stop. Headless or scheduled, where there is nothing to open it on: hand over the paths and the contact sheets, and let the question wait until the user says they have looked. Then present it through the structured-question UI, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step the embedded mode exists for.

`none of these` is a real branch, not a polite decline: take what the answer says, fold it into the Phase 1 system, and render a second set. A set rejected wholesale almost never failed on geometry — it failed on kind and on scale. The first move is to change the mix of kinds and the surfaces, not to redraw the same kind with different shapes; the second is to make the type and the subject bigger, because a set that reads as unremarkable is usually a set drawn timidly rather than one that needed more elements on it. Ask for the count again while doing it: a user who rejected 25 may want 50, or may want 5 built properly in one direction.

## Phase 8 — Another batch, or stop

Standalone only, and it is asked once the user has the files in hand, not before — an offer to make more means nothing until they have seen what came out. Four options:

| Option | What happens |
| --- | --- |
| Another `N`, same direction | The same count again, continuing the numbering (50 becomes 51 to 100), the same headline pool (or the same typed line) and the same visual system |
| Another batch, but shifted | The user says what to change: more of the kind that variant 12 was, lighter surfaces, bigger type, a different mix of kinds. The next batch is built to that |
| A different count | Any number, then the same two choices above |
| Stop here | The run ends and writes its receipt |

A second batch adds, it never replaces. The first set stays on disk with its numbering intact, the new renders continue from where it stopped, and the gallery and contact sheet are rebuilt over everything so the whole thing is comparable in one place. A user who asked for 25 more and got 25 files where their earlier favourite used to be has lost the work they were building on.

And it does not repeat itself. The combinations already rendered — layout, headline, photo — are recorded, and the new batch takes the ones the first pass did not reach, widening the pool with further lines where the layouts are used up. Where the source has genuinely run out of distinct lines, say so and build fewer rather than shipping near-duplicates of variants the user has already rejected by not mentioning them.

Where the user named favourites when asking for more, those are the brief, not just a hint: name back what is being carried forward — the kind, the surface, the shape — so a wrong reading gets corrected before another batch is spent on it.

The loop repeats as many times as the user wants it to. Each pass appends to the receipt rather than overwriting it.

## Phase 9 — Hand back

- Verify what is being handed over: the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform limits the caller supplied. A graphic that fails any of these is fixed or dropped, never handed back unverified.
- Write the alt text in the same language as the canvas — always in the embedded mode, on request in the standalone one. It describes what the image *shows* and what it means, and carries the quantity the canvas only implies: the two masses and the ratio between them, the rhythm and where it breaks, the one form that does not conform, with the number and its condition stated in words since the picture cannot. Not "an infographic about the product", and never a date or a stamp.
- Keep the whole set with the `.html` sources. They cost nothing to store, they document what was considered, and the user re-picks or re-renders later without regenerating.
- Write a receipt beside the renders — `graphics.md` in the output folder: the mode the run was in, the look inputs the set was built from and what was taken from each, the style pack and its origins where a reference was supplied, the primary fact and how it was chosen, the source's language and the language the canvas was set in, the set size and who chose it, the signature of every variant that was actually built — palette, background, kind, subject, face and type effect, anchor — the faces and icon sets used with their versions and licences, the share of subject canvases that carried a drawn icon, the headline mode (Random or typed), the pool with the fact each line carries and the rows that carried it, or the typed line, every batch with its size and what shifted between them, the palette with its validator result, the renderer used, and — in the embedded mode — the variant the user picked out of how many renders, which kind it is, and its alt text. The calling skill copies the gate answers into its own manifest; a decision recorded only in the transcript is lost the moment the session ends.

One graphic serves every platform that takes one — the embedded mode's rule, and it does not apply when nobody is posting anything. The image is made for the post, not for a single network: render it once, and the caller attaches it wherever its Media column says `optional` or `required`, with the article platforms using it as the cover image. Render a second aspect ratio only when a platform's verified ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses. That is about ratios and does not shrink the set: the set is N candidates for one slot, and only the chosen one is ever re-rendered per ratio.

## When the user supplied their own image

Skip all of it. A supplied image, or a library the user pointed at, is a decision already made, and offering variants against it is second-guessing the user. This skill runs when the run is generating rather than placing.

## Verification

The report states: the mode the run was in, and in the standalone one that the whole set is the deliverable, the absolute path of the run folder it was written to, whether that folder was opened, and whether the set was copied out to a folder the user named; which look inputs were supplied and what was taken from each, read back in the catalog's own terms (kind, density, palette and background, type treatment, devices) rather than as a mood, or that none were supplied and a scheme per variant was generated instead; in reference mode, the URLs opened and the pages screenshotted, the path of the style pack, and the origin of every ground, component and motif the set was built from; the palettes with their validator results rather than a claim that they look fine — the pinned brand scheme, or how many schemes were generated, which harmony relationship each was built on, and how many were re-stepped after a failure; the primary fact and the subtraction that identified it; the source's detected language and the language the words were set in, with who chose it, plus the glyph-coverage check where the script is not Latin; the set size and whether the user chose it or a flag did; the spread actually built, counted across the six signature components, with the share each kind took against its quota, the scale-gate read at 25 percent zoom and the hard-rule gate's result across the set, R1 to R21 by number, including the duplicate sweep's flagged pairs and what was rebuilt, with every variant that had to be rebuilt or dropped to pass it; the headline mode, and under Random the pool with its spread across the facts, or the typed line; how many renders were produced across how many batches, how many were rebuilt after the contact-sheet read and what was wrong with them; which variant the user chose and what kind it is, in the embedded mode; the renderer that was used; and the paths of the renders, their `.html` sources, the gallery, every contact sheet and the receipt. Anything that could not be done — no renderer available, a brand colour that fails the contrast check, a reference whose style needs an illustrator, a fact set too thin for N distinct treatments — is named, never implied.

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
- A headline above or below a photo set in short lines that stop at the middle of the canvas, so the picture is wider than its own title. The type is sized to the width first, and the photo takes the height that is left.
- A rule above or below a photograph, or a full-bleed photo with the headline on a plate at the bottom and nothing in the upper half. The rule belongs to the small-top glyph, and the scrim layout was removed for exactly that empty half.
- Drawn sparks, an icon or an emoji beside a stock photograph: a second subject on a canvas whose subject is the picture. The `burst` ground went for this.
- A dot grid or diagonal hairlines as a ground. Both read as a worksheet behind the type, and both were removed.
- A number spelled out in a headline (`Thirty-five billion parameters`) where `35B` reads at a glance, or a semicolon joining two claims that should have been two lines (R22).
- A headline set so small it reads as a caption beside the picture, or content that holds under 70 percent of the frame with a rule at the foot standing in for the missing lower third (R11, R22).
- Offering a mood, a pinned kind, or a reference the user never named in the look-input question — including the source article's own site. Four options: Random, a URL, a local file, custom.
- A look question whose labels are not the four rows: `Describe it: dark, technical` in place of Custom, or `An approved render from an earlier run` as a fifth. The first option is `Random (recommended)`, and Random reads the post to build the system rather than rolling dice.
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
- Asking which render ships while the gallery is still a path on disk the user was never shown.
- Offering to copy the set out of the temp folder, or asking any question about where the files should live. The folder is opened and the run moves to the next-batch question.
- A statement row: a headline between two rules on an empty canvas. The kind was removed after a sheet of ten read as captions, and the builder refuses it by name.
- A number left inline in the headline on every single variant, with the display-scale lockup never used.
- Rebuilding a removed archetype because the source suggested it: a drawn code window for a developer tool, a two-column table for a comparison, a numbered section list for a feature set. They were cut after a full set was read, not left as a per-run judgment call.
- Deciding the set size instead of asking, or offering a size question with no free-text option.
- A single contact sheet carrying 50 or 100 cells, which is a texture rather than a thing the run can read.
- Setting the canvas in the source's language because that is what the source was in. The material's language is a fact about the material, never an answer about the audience.
- Asking the language question after the headline pool is written, so a page of sentences is thrown away or, worse, translated.
- A headline carried across from English word by word instead of composed in the language it ships in.
- Alt text in a different language from the canvas it describes.
- Translating a command, a flag, a filename or a product name because the rest of the canvas changed language.
- A missing glyph shipping as an empty box, or an overflowing headline, because the layout was sized to the English draft.
- A left-to-right composition left unmirrored under right-to-left text, so the picture and the words disagree about which way the story runs.
- Showing a list of drafted headlines and asking the user to pick a number. Two options: Random, or a line they type.
- A pool where every line paraphrases one sentence, or a pool under the size the count needs, so layouts repeat under one line.
- A variant whose picture argues with the headline stamped on it, because its subject was chosen for another line.
- A canvas carrying more than its kind's budget: a glyph canvas that grew a subhead, a diagram that grew a chip row, two glyphs where the kind allows one.
- A word on the canvas doing none of the three jobs — a caption restating the headline, a subhead, a footer, a decorative label, an orphan naming something the picture does not show.
- The captioned diagram: an axis label or a printed value on a composition whose whole premise is that the shape carries it alone.
- A headline that is a topic (`Generation speed`) or a fragment the picture has to finish.
- A headline lifted from the body of the post: a step of the mechanism with its subject cut (`Only the routed experts leave the drive, so memory stays small`), a caveat from the tail leading the picture (`Both models ship as previews, with agent work still weak`). Every line is a title the post could ship with, measured against the post's own title.
- One form recoloured at the render stage and called a second variant.
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
- A set with photographs in range that reaches for emoji and flat type instead.
- Naming a photo in a row without having looked at `photos/sheet.png`, or keeping one that shows a logo, a brand, a person or a subject the claim does not name.
- A CC BY photo shipped without its attribution line carried into the receipt and the post.
- Filling a set to the number the user named with rows that differ from earlier rows only in palette, face, ground or icon. Under one typed line twenty-six were possible, and the honest answer is twenty-six plus the offer of Random headlines.
