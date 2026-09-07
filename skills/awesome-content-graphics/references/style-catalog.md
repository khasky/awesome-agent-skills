# Style catalog — the kind of picture a post graphic is

`visual-language.md` answers "what shape draws this idea". This file answers the question before it: **what kind of picture is this at all.**

This catalog used to carry twelve archetypes and spread every set across them, on the theory that variety comes from reaching further. It does not. Half of those archetypes produce canvases that read as a screenshot, a spec table or a saved reference sheet, and in a feed they lose to a line of type set large. **So a set is built from four type-led kinds, and its variety comes from moving inside that family** — palette, background, figure, face, type effect, anchor, atmosphere — rather than from adding a kind of picture nobody wanted.

## The five axes

Any graphic here is a point in this space. Varying one axis while holding the others is what makes a set of fifty read as fifty.

**1. Density — how much the canvas is asked to carry.** The family lives on the first two rows. The last two are what the removed archetypes were.

| Level | Type on canvas | Reads as | In the family |
| --- | --- | --- | --- |
| **Bare** | one headline | a statement | yes, and it is the centre of gravity |
| **Anchored** | headline plus one object or one composition | a claim you can see | yes |
| **Structured** | headline plus 2 to 4 labelled groups | an explanation | no |
| **Dense** | headline plus 6 or more labelled cells | a poster, a reference sheet | no |

**2. Palette and background — what the picture is printed on.** A ground, an ink, an accent and a neutral, and the recipe that paints the ground: flat, a linear gradient at an angle, a radial or mesh gradient, a field of large soft blobs, a duotone split. Deep dark with an off-canvas light, near-white with a pastel corner wash, warm paper, a saturated field corner to corner are four points in that space, not the whole of it. This sets the mood before a word is read, it is the cheapest axis to vary, and it varies **per variant** rather than per set.

**3. Typography as image.** Type is not a caption here; it *is* the picture. Solid heavy caps filling the canvas edge to edge. Editorial serif at quotation size. A phrase sitting on a highlighter slab. A line knocked out of a solid accent block. A headline where exactly one word takes the accent and the rest stay ink. Always filled, never hollow.

**4. The subject — the one thing beside the type.** A single tinted glyph. A figure set at display scale. A chart carrying its real values. There is exactly one subject per canvas, or none at all, and the bare canvas is the rarest of the four.

**5. Atmosphere — the layer that separates a designed image from a diagram.** A field of faint symbols scattered behind everything at low alpha. Bloom behind the subject. A vignette pulling the corners down. Grain over the whole print. Each is optional and each one, added alone, is the difference between flat and finished.

## The four kinds

A set is built from these, and from nothing else unless the user asks for something else by name. **The share column is not a suggestion:** a set that is a third bare statements is a set of captions, and the user is choosing between wordings they already chose in the headline gate.

| Kind | What it is | Share of a set |
| --- | --- | --- |
| **Statement** | The headline is the whole picture | at most 15 percent |
| **Glyph canvas** | Headline plus one oversized, palette-tinted glyph | about 25 percent |
| **Number lockup** | The figure at display scale, the headline under it | about 25 percent when the headline carries a number, otherwise redistributed |
| **Data figure** | A readable chart carrying its real values and what they measure | the rest, and never under a third |

### 1. Statement

One line of type, huge, on an otherwise empty canvas. Nothing competes with it, and the accent falls on the phrase that carries the claim.

- **Type budget:** headline, plus an optional wordmark set small and quiet in a corner. No subhead.
- **Layout:** the headline block occupies 35 to 55 percent of the canvas height and holds the frame from margin to margin. What is left is negative space around type set large, never a small block with a void beside it.
- **Devices:** vignette, off-canvas light, bloom behind the type, a faint symbol field, a highlight slab under one phrase.
- **Fails when:** the line is a topic instead of a claim — or when there are twelve of these in a set of forty, which is the failure the share cap exists to stop.

### 2. Glyph canvas

The same headline treatment, plus exactly one subject — **a drawn stroke icon or a system emoji** — rendered large enough to be a subject rather than a bullet. The icon is the default at least a third of the time (R12).

- **Type budget:** headline, optional wordmark. The glyph is not a word and does not count against it.
- **Layout:** headline on one side, the subject opposite it at 33 to 50 percent of the canvas on its long side, **whole and inside the frame**. **They never touch or overlap**: 2 percent of the canvas clear at the narrowest point, measured on the render rather than intended in the markup.
- **No plate (R18).** No card, rounded square, disc or coloured panel behind the subject. It sits on the ground. Where the ground is too busy for it, the ground changes.
- **Colour:** the glyph is tinted into the scheme — see the emoji rule below. A system emoji shipped raw brings its own five colours onto a canvas built from four.
- **Whole, inside the frame.** A glyph is never cropped by a canvas edge and never runs into the margin; a half-emoji reads as a rendering failure.
- **Relevance (R19):** the glyph or icon depicts what the headline says, and the plan row records the link in one clause before the canvas is built. Nothing fits → the canvas takes no subject and becomes another kind.
- **Fails when:** the glyph is decorative rather than the subject — a sparkle, a generic checkmark, praying hands under a claim about speed — or when there are two of them, or when a plate appears behind it.

### 3. Number lockup

**The figure is the picture.** When the headline carries a number — a duration, a count, a multiple, a percentage — it comes out of the sentence and is set at display scale in the accent, with the rest of the headline underneath it at normal size.

- **Type budget:** the figure, its unit or suffix (`s`, `x`, `%`, `+`) at about 40 percent of the figure's size, the headline, an optional wordmark.
- **Layout:** the figure at two and a half to four times the headline's size, top-left or centred, the headline block directly under it. The figure and the headline read as one lockup, not as two elements sharing a canvas.
- **The headline gives the figure up.** Once a number is set at display scale, that digit is removed from the sentence — the headline is re-broken, or rewritten so it reads whole without it. A lockup standing under a line that still ends in the same number says one thing twice, and it is the defect this kind produces most often.
- **Devices:** the figure in the accent against ink headline, or knocked out of an accent block; a second smaller figure beside it where the claim is a comparison (`5s` next to `3s`); bloom behind the figure on a dark ground.
- **Fails when:** the number is not the point of the sentence, or when two numbers compete at the same size and neither wins. One figure is the subject; anything else beside it is smaller.

### 4. Data figure

A chart from `visual-language.md`'s pattern table, drawn large, **carrying its real values as printed text**. There is no unlabelled variant of this kind: the abstract composition was tried across three sets and read as coloured rectangles every time, so a figure that compares anything prints what it compares.

- **Type budget:** the headline, the values themselves, one word per series, and a caption of one to three words naming what the values measure. No axis, no legend, no gridlines, no chart title.
- **Every value names its referent.** `60%` alone is a fabrication with a font size around it; `60% of playback time` is a fact. A share, a multiple and a duration each need the thing they are a share, a multiple or a duration *of*, and it goes in the figure, not in the reader's head.
- **Text inside a shape fits inside it.** A number in a donut hole, a label in a bar, a value on a plate: the type is sized down until it clears the container's inner edge by a tenth of that container on every side. The shape is never stretched to fit the type, and the type is never allowed to cross the ring it sits in.
- **Layout:** the figure owns the canvas below or beside the headline, not a band across the middle of it.
- **Devices:** bloom under the accent form, a hairline rail the forms sit on, a shadow that lifts the accent form off the surface.
- **Fails when:** the shape carries no values — two rectangles at any ratio, a field of identical cells, one form nested in another, a rhythm of blocks, strands converging. A stranger reads those as nothing, and no size ratio or accent colour rescues them.

## The variation levers

Four kinds is a narrow family, and a set of 50 out of it is only possible because the levers underneath multiply. These are the values a variant is assembled from; a run that keeps a lever fixed across the whole set has thrown away most of its range.

**These tables are the no-reference defaults.** Where the user supplied a site, a product or a brand as the look input, the run is in reference mode and builds from that reference's own grounds, components, type system and motifs instead — the values below are then not a base to blend with, they are simply not in play. `SKILL.md`'s Phase 1 has the extraction and the rule.

| Lever | Values |
| --- | --- |
| **Palette** | a scheme per variant, built and validated as below — not one palette stretched over the whole set |
| **Background** | flat surface · linear gradient at an angle · radial or mesh gradient · a field of two to four large soft blobs · a duotone split · any of those plus grain, a symbol field or a vignette |
| **Face** | one display face per variant from the free-licence set below — heavy grotesque · condensed poster · geometric or rounded · editorial serif · technical mono |
| **Type treatment** | solid heavy caps · mixed case at headline weight · one word in the accent · one whole line in the accent · a highlight slab under one phrase · a knockout line reversed out of a solid accent block · editorial serif at quotation size · one word dropped to its own line at double size |
| **Type effect** | none · accent word or line · gradient fill along the type's axis · highlight slab · knockout block · mixed weight in one line · size step · opacity tier · tight-tracked caps · drop figure — **and nothing outside this list (R17)** |
| **Headline shape** | two lines · three lines · four lines · one long line running edge to edge · a block set narrow with a deep right margin |
| **Anchor** | top-left against a deep margin · centred with deep margins · bottom-left · headline left with the subject right · headline top with the subject filling the lower half · the subject large and centred with the type wrapped around one side |
| **Subject** | none, the type is the whole picture · one tinted glyph · one stroke icon from a free-licence set · the figure at display scale · any data-figure pattern in `visual-language.md`, drawn to the scale gate |
| **Atmosphere** | nothing · vignette · bloom behind the subject · an off-canvas light · a faint symbol field · grain |

**Type on a canvas is always solid filled.** Outlined caps, hollow letters, a stroke with the background showing through, a shadow or a glow standing in for the fill: all out, in every kind and on every surface. They read as an unfinished render rather than a treatment, they lose their edges the moment the background behind them has any texture, and at feed size a hollow headline is a smear. The knockout line is the reachable version of the same idea — solid surface-coloured type inside a solid accent block, both fills real.

**A glyph is tinted into the scheme, never dropped onto it raw.** System emoji arrive with their own five or six fixed colours — a red TV dial, a blue video square, a yellow hourglass — and those colours belong to whoever drew the font, not to this canvas. Three ways to bring one into the palette, in order of preference:

- **A filter chain to a target hue**, which is the recipe to reach for first because it needs nothing behind the glyph: `filter: grayscale(1) sepia(1) hue-rotate(<target - 40>deg) saturate(<2 to 4>)`, tuned per glyph rather than copied.
- **Luminosity blend against the ground, never against a plate.** `mix-blend-mode: luminosity` on the glyph over the canvas's own ground or a full-bleed background layer keeps its shading and takes the ground's hue. **A discrete filled shape behind the glyph to blend against is the plate R18 forbids** — if the recipe needs a box, use the filter instead.
- **Choose a glyph whose own colours already sit in the scheme** — the monochrome and near-monochrome ones (▶ ⏱ ⚡ ✳ ✦) rather than the ones drawn as little illustrations.

**In reference mode the glyph vocabulary is the reference's own.** A site with its own icon set, illustration style, pattern or lattice supplies the subjects, and a system emoji appears only where that site itself uses emoji. Picking a stock emoji for a brand that draws its own marks is the same error as picking a stock background for it.

**The check:** name the glyph's two dominant hues and compare them to the scheme's. More than about 40 degrees from every member of the scheme, and it is tinted or replaced. A raw emoji is allowed only where its own colours happen to land inside the scheme, and that is a decision made by looking, not by hoping.

**Type is set on one rhythm.** A headline is a block of lines that share a baseline grid, and every treatment has to respect it:

- **Equal gaps between line boxes**, whatever each line is doing. A line scaled up, wrapped in a slab or knocked out of a block has a taller box than its neighbours, and left alone it opens a hole above and below itself. Set the leading on the block and give the slab symmetric padding inside its line box, then measure: the gaps may differ by no more than 8 percent of a line's height.
- **A slab or knockout line is wider than its text.** Its padding counts against the width budget, so a line that fit at full measure does not fit once it is boxed. Size it to the padded width, not the text width.
- **Type never touches the subject.** Two percent of the canvas clear at the narrowest point between any line box and the glyph or figure, measured on the render.

All three are enforced by the geometry check in `visual-language.md`, because all three look perfectly correct in the markup.

Two more rules keep the levers honest. **The accent falls on the phrase that carries the claim** — the verb, the subject or the number, never an adjective and never a different phrase per variant chosen for variety's sake. And **a lever change that is invisible at feed size is not a variant**: an atmosphere swap alone, or a one-step type-size change, produces two files and one graphic.

## Faces, type effects and icon sets

**Emoji and blobs are two devices, and a set built from only those two runs out of ideas by the fortieth canvas.** The other two levers are the letterforms themselves and a drawn icon vocabulary, and both are available offline once acquired.

### Faces

**One display face per variant, from the free-licence set**, chosen against the variant's kind and ground rather than rotated blindly. The SIL Open Font License covers nearly all of Google Fonts and permits commercial use and embedding; Apache-2.0 and MIT faces are equally fine. Families that carry a headline at feed size:

| Register | Faces |
| --- | --- |
| **Heavy grotesque** | Archivo Black · Inter (900) · Manrope (800) · Figtree (900) |
| **Condensed poster** | Anton · Bebas Neue · Oswald · Archivo Narrow |
| **Geometric and rounded** | Poppins (700–900) · Unbounded · Outfit · Nunito (900) |
| **Editorial serif** | Playfair Display · Fraunces · Bitter · Instrument Serif |
| **Technical and mono** | Space Grotesk · JetBrains Mono · IBM Plex Mono · Roboto Mono |

**Acquisition and the offline rule.** The face is fetched once during the run into `assets/fonts/` in the run folder, subset if it helps, and **embedded in the HTML as a base64 `@font-face`** — never linked to a CDN, never left as a bare `font-family` that only resolves on this machine. The rendered file stays self-contained and renders identically on a machine with no network, which is the whole premise. **Record the family, its version and its licence in the receipt**, and keep the licence file beside the font where the licence asks for it. A face whose licence does not clearly permit commercial use and embedding is not used, and no font is ever scraped from a site's private asset path.

### Type effects

**The list is closed (R17).** Every entry keeps the letterforms solidly filled, and every one of them is something a working UI or brand team still does. Reaching for anything outside this table — because it would "add variety" — is the failure the list exists to stop.

| Effect | How |
| --- | --- |
| **Accent word or accent line** | The claim's verb, subject or number in the accent, the rest in ink. The default, and the strongest |
| **Gradient fill** | `background-image: linear-gradient(...)` plus `background-clip: text` and a transparent fill colour, the gradient running along the type's own axis and staying inside one hue family. The gradient *is* the fill, so the type is still solid |
| **Highlight slab** | A solid rectangle behind one phrase, its padding symmetric and inside the line box |
| **Knockout block** | Ground-coloured type inside a solid accent block |
| **Mixed weight in one line** | The claim's verb at 900 against the rest at 500, same face, same size |
| **Size step** | The claim's phrase set one or two steps larger than the lines around it, same colour, same rhythm |
| **Opacity tier** | The supporting line at 60 to 70 percent of the ink's alpha, so hierarchy comes from weight of colour rather than from a second hue |
| **Tight-tracked caps** | `letter-spacing: -.04em` at display size, with optical corrections on the ends |
| **Drop figure** | The first figure at three times the line height, the rest of the line set beside it |

**Banned, and not to be reintroduced under another name:**

| Banned | Why |
| --- | --- |
| **Split fill** — a line cut across its middle into two colours | It reads as a rendering fault: the letterforms look clipped, and at feed size the eye sees broken type rather than a treatment |
| **Long shadow** | A 2015 flat-design tic. It adds a second shape per letter, muddies the ground and dates the whole set |
| **Layered extrude, bevel, emboss, 3D** | Same era, same problem, and they fight every background that is not flat |
| **Hard drop shadow behind type** | A soft shadow for legibility over a busy ground is fine; a hard offset copy is an effect from a word processor |
| **Glow as the fill** | Hollow type by another route, which R9 already forbids |
| **Skew, arch, wave, WordArt** | The type stops being read and starts being looked at, and the headline is the one thing that has to be read |

### Icon sets

**A drawn stroke icon is the third subject**, next to the tinted emoji and the figure — and on a canvas with a strict palette it is the best of the three, because a stroke icon takes `currentColor` and *is* the scheme colour rather than being tinted towards it.

**It is a quota, not an option (R12): at least a third of the subject canvases in a set carry a drawn icon rather than an emoji.** A run that reaches for emoji every time has left the whole vocabulary unused, and that is why a set of a hundred still reads as two devices. **Fetch the set at the start of the run**, before the first variant is planned, so the icons are on disk when the canvases are built rather than a thing the run meant to get round to.

| Set | Licence | Character |
| --- | --- | --- |
| **Lucide** | ISC | The Feather line continued, 1,500+ icons, clean and neutral |
| **Tabler Icons** | MIT | Large, systematic, strong coverage of technical subjects |
| **Phosphor** | MIT | Six weights including fill and duotone, the most expressive of the four |
| **Heroicons** | MIT | Small, opinionated, outline and solid pairs |
| **Remix Icon** | Apache-2.0 | 3,000+, outlined and filled, 24 x 24 grid |

**Same offline rule:** the icon's SVG is fetched once into `assets/icons/`, **inlined into the HTML as a path**, never hotlinked, and its set, version and licence go in the receipt. One icon per canvas, at the subject scale the kinds table sets, in a scheme colour, **on the ground and never on a plate (R18)**, and **chosen for what the headline says (R19)**. **Brand and logo sets are not used** — a third-party logo on a canvas is out under the honesty rules whatever its licence says.

### In reference mode

**None of this applies.** The face is the reference's face, the effects are the effects it uses, and the icons are its own icon set. Reaching into these tables in reference mode is exactly the mixing R13 forbids.

## Palettes, and why there is more than one per set

**A set built on one accent hue over four surfaces is four looks wearing ninety-six costumes.** The palette is the loudest lever there is, and holding it fixed while shuffling shapes is what makes a hundred renders read as one graphic with variations. So unless a brand palette was supplied, **every variant gets its own scheme**, and the set is a tour through colour as much as through composition.

- **A brand palette or a site was supplied → it is the system, and it is not swapped.** Variation then comes from arrangement inside it: which member is the ground, which is the ink, which carries the accent, which of the reference's own gradients runs behind, how much of the canvas each holds. The brand's hues stay the brand's hues, and in reference mode its backgrounds, components and type stay its own too.
- **Nothing was supplied → build a scheme per variant.** Four to five stops each, in the shape a palette site hands you: a ground, an ink, one accent that carries the claim, a de-emphasis neutral, and optionally one secondary hue for a background wash. Reach across families rather than staying in one corner of the wheel — warm and cool grounds, near-black and near-white and mid-tone and saturated, analogous schemes next to complementary ones next to a near-monochrome with one hot accent.
- **A scheme is a relationship, not four hues that happened to pass a contrast check.** Contrast says the text is readable; harmony says the canvas is not painful to look at, and they are different tests. Every generated scheme is built on one named relationship and says which: **monochrome plus one accent** (one hue at four lightnesses, the accent from anywhere), **analogous** (hues within 40 degrees), **complementary** (two hues about 180 degrees apart), **split complementary** (150 and 210), or **triadic** (120 apart). Then:
  - **The ground and the ink share a hue.** A near-black or near-white that is a tinted step of the ground reads as one material; a neutral gray on a coloured ground reads as two pictures.
  - **Chroma follows area.** Large fields stay low chroma, the accent stays high, and the accent covers roughly a tenth of the canvas. A saturated ground under a saturated accent is the combination that stings.
  - **No two saturated hues of similar lightness meet at a long edge.** That is the vibration a viewer feels as eye strain; separate them by a lightness step, by the neutral, or by a gap of ground.
  - **The accent that carries type clears 4.5:1**, not the 3:1 that a shape needs. A headline word set in an accent scraping the shape floor is legible in the validator and painful in a feed.
- **Every scheme is validated, not eyeballed.** Same gate as before: `dataviz`'s colour formula and its runnable validator, with the accent and the neutral clearing 3:1 against that variant's own ground and staying separable under protan and tritan simulation. A scheme that fails is re-stepped in OKLCH — lightness moved into band, chroma held — and the failure is recorded, never shipped.
- **No two variants share a scheme**, and two schemes that differ only in a step of lightness are one scheme. The palette is part of the variant's signature below, so this is checked in the plan rather than discovered on the contact sheet.
- **The set stays coherent through its rules, not through one colour.** What every variant shares is the type system, the scale gate, the fill gate and the honesty rules. That is the system; a single hex value never was.

## No two variants alike

Every variant carries a **signature**: palette, background recipe, kind, subject, face and type effect, anchor. **Two variants may not share a signature, and no two may match on more than three of its six components.** Record the signature of each as it is planned, before any markup is written, so the collision is caught in the plan rather than in the contact sheet.

Where n is large enough that the honest combinations run out, say so and build fewer. A hundred files where the last twenty are near-duplicates is worse than eighty the user can actually tell apart.

## The scale gate

**The difference between a composition that works and one that reads as decoration is scale, not concept.** Two big bars at a real ratio and two thick paths diverging from one origin carry across a feed; five small circles on a hairline with one nudged upward do not, however correct the idea behind them is. Four rules, checked on the render rather than in the markup:

- **At most five load-bearing forms on a canvas, and the largest spans at least half the canvas on one axis.** A field of small marks is allowed only where the count *is* the point, and then the cells are large enough to count by eye at thumbnail size.
- **A stroke that carries meaning is thick.** Hairlines are for the rail a form sits on, never for the thing being said.
- **The difference the picture is about survives at 25 percent zoom.** A mark that differs from its neighbours by a small offset, a slightly larger radius or a shade is not a difference, it is a defect. Differ by mass, by position across the canvas, or by being the only thing in the accent.
- **The composition fills its share of the canvas.** A thin band of marks with a third of the canvas empty under it is not negative space, it is an unfinished canvas. Negative space reads as deliberate only when the forms are big enough to command it.

## The fill gate

The scale gate governs one form; this one governs the canvas. **The type and the subject together occupy the frame — roughly 80 percent of it — and a canvas that fails this reads as a placeholder however good its palette is.** Four numbers, measured on the rendered page rather than judged by eye (`visual-language.md` carries the script that measures them):

- **The marks span at least 80 percent of the canvas width and 80 percent of its height.** Not their combined area — their extent. A headline in one corner and a glyph in the opposite one can pass this and still be wrong, which is what the next rule is for.
- **No empty square larger than 40 percent of the canvas side.** That is the dead middle: the void between a small headline top-left and a small subject bottom-right. Fix it by growing the type, growing the subject, or moving them until the composition holds the frame.
- **The headline block spans at least 70 percent of the content width and at least 22 percent of the canvas height.** A two-line headline at a tenth of the canvas is small type with a picture next to it, not a type-led graphic.
- **The subject, where there is one, spans at least a third of the canvas on its long axis.** Below that it is an icon sitting on an empty field.

**Margins are absolute: 4 percent of the canvas on every side, and nothing crosses into them.** No bleed, no crop, no shape running off the edge — that allowance existed for two revisions and produced clipped arrowheads and blocks cut in half by the frame, so it is gone. A composition that wants to feel unbounded does it inside the frame.

**And nothing is clipped by an inner box either (R16).** A donut whose left and right edges come out flat, a bar whose end is cut by its card, a line of type sliced by the block behind it: those are not the canvas edge, they are a container narrower than its content, and they look exactly as broken. **The content is scaled down until it fits its slot** — the SVG gets a viewBox that contains the whole drawing plus its stroke width, the type steps down until its box holds it, the figure shrinks. `overflow: hidden` is never the answer to something not fitting; it is how the fault gets hidden until the render.

## Out of the catalog

Four archetypes were removed after a full set was built and read. They are not a matter of taste to be re-litigated per run, and they do not return through a side door — no drawn code window as a "proof" beside a statement, no two-column comparison dressed as an emphasis diagram, no numbered section list under a headline.

| Removed | What it was | Why it is gone |
| --- | --- | --- |
| **Statement with a proof object** | The claim on one side, a drawn editor, terminal or browser window on the other | The chrome carries small monospace text that dies at feed size, and the canvas becomes a screenshot of a thing rather than a picture of an idea |
| **Split compare** | Two parallel columns of labels and values under a rule | A spec table. It says the comparison in words and draws none of it |
| **Poster** | Masthead, manifesto column, four to six numbered sections, footer | Six type levels at feed size is texture, not a poster. It is built for a tap-through that does not happen |
| **Cut paper** | Every word in heavy caps on its own rotated, differently coloured tile | A typographic gimmick that fragments the one line the reader was supposed to take in at a glance |

## The optional shelf

These stay buildable, and a run never reaches for one on its own initiative. **The user names one — in the look inputs, or by asking for it — or it is not in the set.** Where one is pinned, the rest of the set stays in the family around it.

| Shelf archetype | What it is | Fails when |
| --- | --- | --- |
| **Chain** | Up to 6 nodes on one horizontal axis with thin connectors, one word under each | The labels grow into sentences, or the row runs past 6 |
| **Catalog grid** | Rows of small labelled cells, the coverage being the subject | The cells need logos that would have to be fetched |
| **Transcript** | A conversation as the interface it happened in: bubbles, a message thread, a terminal session | The transcript is invented. A fabricated quote is a fabricated testimonial with a rounded rectangle around it |
| **Strip** | Two or three bordered panels, a bubble in each, a payoff in the last | It needs drawn characters. With emoji as the cast it works offline |
| **Annotated composition** | Curved dashed leaders and small callout labels over an abstract composition | It is attempted as an illustrated scene, which needs an illustrator or an image model this skill does not call |
| **Meme two-panel** | The same subject in two states, a hard caption band across each | The joke needs a face. Offline the two panels carry it structurally or not at all |

## Spreading a set of n

The old rule counted distinct archetypes and capped each at 40 percent of the set. With four kinds in the family that rule is unsatisfiable at any real n, and it was the rule that pushed sets into the archetypes above. **The spread is now counted on combinations.**

Every variant is a point on six: **palette**, **background recipe**, **kind** (4), **shape or subject** (nine data-figure patterns, the glyph, the stroke icon, the figure, the empty canvas), **face and type effect**, and **anchor** (where the block sits, how the type and the subject are balanced inside the frame).

- **No two variants share a signature, and none match on more than three of the six.** Two variants at the same kind, palette, shape and anchor are one variant rendered twice, whatever the type is doing.
- **No single background recipe takes more than a quarter** of the set, no ground family (dark, light, paper, saturated) more than 40 percent, and no single shape is used more than twice.
- **All four kinds appear once n is 8 or more, at the shares in the kinds table.** Bare statements stay at or under 15 percent, data figures never fall under a third, and a run that finds itself with a third of the set as headline-only canvases has drifted into the cheapest kind to build.
- **Weight toward what the idea is.** A quantity or a comparison wants data figures; a number in the headline wants the lockup; a subject with an obvious symbol wants the glyph; an opinion or a quotable line is the one case for a bare statement.
- **The honest ceiling: past about 50 the remaining differences are fine ones.** Say so at the set-size gate rather than shipping the eightieth canvas as a fresh idea.

## Device library

Cross-cutting, all renderable offline with CSS and inline SVG.

| Device | What it is | Notes |
| --- | --- | --- |
| **Atmosphere field** | 15 to 30 faint symbols scattered behind everything at 4 to 10 percent alpha, varied in size and rotation, some blurred | The single highest-yield addition to a flat canvas. Deterministic placement per `visual-language.md`, never random |
| **Vignette** | A radial darkening pulling the corners down 20 to 40 percent | Makes a dark surface read as lit rather than as flat black |
| **Bloom** | A soft glow behind the subject in the accent, larger and softer than the subject itself | Two layers, a tight one and a wide one, reads better than one |
| **Highlight slab** | A translucent or solid rectangle behind one phrase of the headline | The cheapest way to make a headline point at its own key phrase |
| **Two-tone headline** | One word or one line in the accent, the rest in ink | Works when the accented part is the claim's verb, its subject or its number, not an adjective |
| **Knockout line** | One line of solid ground-coloured type reversed out of a solid accent block | The filled answer to what outlined caps were reaching for. Hollow type is out; this is not. Its box is taller and wider than its text, so it is measured with its padding |
| **Big numeral** | The figure at two and a half to four times the headline size, in the accent, with its unit smaller beside it | The number lockup's whole vocabulary. Only when the number is the point, and only one figure per canvas |
| **Emoji as artwork** | A system emoji rendered at 400 to 800 px as the subject, tinted into the scheme | Available offline from the system emoji font, no asset needed. Raw, it drags its own palette onto the canvas — see the glyph rule above |
| **Grain** | A tiled noise overlay at 3 to 8 percent | Turns a flat print into a printed one. Generate as an inline SVG turbulence filter, never as a fetched texture. Watch the file size: grain at 2x device scale is near-incompressible |
| **Off-canvas light** | A large radial gradient positioned so more than half of it sits outside the frame | Reads as a light in the room rather than a glow drawn on the picture |

Devices that belong only to the shelf archetypes, and that a family canvas never carries: UI chrome, skeleton bars, chip rows, fanned cards, node-and-connector plates, callout leaders, ruled dividers and ornaments.

## What the words on the canvas are allowed to be

**Every word on the canvas does one of four jobs.** It is the headline that carries the claim. It is a value that is itself the point. It is the one-to-three-word caption naming what that value measures. Or it is the wordmark. **A word doing none of those is decoration, and it is cut.**

**And no word or number is said twice.** A canvas carries each content word once: no decorative echo of the headline behind the headline, no numeral repeated as ornament, no caption restating the line above it, no lockup holding a figure the sentence still carries. Where a second element wants the same words, it becomes a glyph, a figure or empty space instead. The shelf archetypes add a fourth job — a label naming a real thing the picture depicts — and that job exists only on a canvas the user asked for by name.

Two consequences:

- **The kind declares the budget and the budget is not exceeded.** A statement that grows a subhead, a chip row or a caption is not a richer statement, it is a worse one.
- **Read order is forced, always.** One element is unmistakably first, by size, by position, or by being the only thing in the accent.

## Honesty rules

- **Numbers on the canvas come from the facts, with the condition they carry.** A big numeral is the loudest claim the format has.
- **No calendar date, no "checked on" stamp**, in any kind.
- **No trademark word carrying its ordinary meaning**, and no third-party logo the sources do not connect to the subject — offline there is nothing to fetch anyway.
- **A depicted interface shows real behaviour**, on the shelf archetypes where one appears at all. A mocked-up third-party screen showing a behaviour it does not have is a fabricated screenshot whether or not it is drawn by hand.

## Feasibility, stated plainly

Everything here renders offline from HTML, CSS and inline SVG with system fonts — **except** photographic scenes, illustrated characters and anything needing a fetched brand asset or a display font that is not installed. Where the user's reference is one of those, say so rather than shipping an approximation: the honest answer is the nearest kind that *is* reachable, named as a substitution, plus the note that a scene needs an illustrator or an image model this skill deliberately does not call.

Fonts are the quiet version of the same limit. A western letterpress poster, a handwriting callout and a condensed grotesque are three different faces, and offline there is one system stack. Weight, letter-spacing, case and colour are the levers that remain; use them, and do not describe a variant as a style the installed fonts cannot set.
