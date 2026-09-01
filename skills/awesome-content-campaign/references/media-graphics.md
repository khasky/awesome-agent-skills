# Self-made graphics — HTML/CSS rendered locally

The fallback for posts that need an image and have none. It uses only what is already on the machine: a self-contained HTML file styled with CSS and screenshotted through the browser automation the campaign already has. **No image-generation service, no API key, no upload of the user's content anywhere.**

## When this path runs

Offered, never automatic — the user says yes per campaign or per post:

- A platform the Media column of `platforms.md` marks **required** is selected, and the media library cannot cover its posts.
- A post's content is genuinely structural — steps, a comparison, a framework, a single number, a short quotation from the sources — and would read better as an image than as more text.

It does **not** run where the requirement is video (`tiktok`, and `youtube` uploads): this path produces a still image, and a still is not a video. A campaign that selected those platforms with no video stays honest — recommend dropping them rather than shipping unpostable drafts.

Photographic and illustrative imagery is out of scope: no rendered scenes, no people, no product mockups. What this produces is a flat graphic built out of shapes, colour and a few words. Said plainly to the user, so nobody expects an illustration.

## The job of the image

**The image is the thing that stops the scroll, not a second copy of the post.** The text is already in the post, and the reader will read it there. What the image has to do is make them stop long enough to start reading, and carry one idea visually while they do.

So the graphic is drawn, not typed. The mechanism the post is about becomes a diagram: two blocks and an arrow, one box inside another, a shape split down the middle, a full bar next to an empty one, three dots on a line where the third is a different colour. Abstract is fine and usually better, as long as the shape means what the post means. Anything a viewer would have to *read* to understand belongs in the post body.

**Word budget: 12 words on the canvas, hard cap.** A headline of at most 6, and up to three labels of 1 to 3 words attached to what they label. No sentences, no paragraph, no bullet stack, no explanation under the diagram, no footer line, no date, no "checked on" stamp, no logo wall. A caption that has to end in a full stop is a sentence, and it goes back into the post.

**Chart furniture is not prose and is budgeted separately: at most 8 tokens, each a number with its unit.** Axis ticks, a scale's endpoints, a value riding the one mark the graphic is about — those are what makes a chart readable, and counting them against the 12 words is what produces the bar-with-two-labels card instead of a chart. They are numbers only. The moment a tick reads as a phrase it is prose and it comes out of the 12.

**The ink rule: the marks outweigh the type.** Sum the area of the drawn elements — bars, arcs, plotted lines, nodes, connectors, cells — and it beats the area of all text on the canvas, headline included. A graphic where the type is the biggest thing on it is a quote card with a decoration, whatever the shape table below says it is. Two consequences worth stating: the headline shrinks as the diagram earns room, and a graphic that cannot fill its canvas with marks is a graphic whose idea was not visual.

**Three tests before accepting a graphic.** Cover the words and look at it: if nothing remains, it was a text card and it fails. Squint until the type is unreadable: the shape still has to say which side is bigger, which way the thing moves, where the break is. And the inverse: if a reader could get the post's content from the image alone, there are too many words on it.

## What to build

Pick the shape from what the post's idea *does*, not from a template rotation. **Reach for the charted form before the abstract one** — a graphic built out of the vocabulary readers already know from every chart tool (axes, ticks, plotted marks, connectors, arcs, timelines) carries more meaning per pixel than two rounded rectangles, and it is what stops the scroll:

| What the post is about | What the image shows |
| --- | --- |
| Scale or proportion between two quantities | Paired bars sized to the real ratio, or a dumbbell if the pair is a before and after of one thing |
| A rate, a throughput, a multiple | An arc gauge or a radial track filled to the real fraction, the multiple as the one value on the canvas |
| Something crossing a threshold | A plotted line against a baseline rule, the crossing point marked and the region past it washed in the accent |
| Two quantities diverging over time | Two lines from a shared origin with the gap between them filled, the gap being the point |
| A process with an order that matters | A timeline: a rail, ticks, nodes on it, the interesting one in the accent |
| Work that repeats in blocks | A gantt-shaped stack of bars along a time rail, or a step chart when each block resets |
| A reset, an interruption, a loss of state | A sawtooth: the line climbs, drops to zero, climbs again, with the drops marked |
| A flow or a handoff between parties | Nodes and weighted connectors, sankey-flavoured, thickness carrying the quantity |
| Part of a whole, or a count worth feeling | A waffle grid of cells with the relevant cells in the accent |
| Many variants of one thing | Small multiples: a grid of the same tiny chart, one tile in the accent |
| A collision, a conflict, an overwrite | Two plotted shapes overlapping, the overlap in the accent |
| One measurement worth the post | A hero figure at display size **with a plotted mark under it** — a sparkline, a track, a single bar — never the bare number on a field of colour |
| Anything that needs a sentence to land | Not a graphic. Leave the post text-only |

**The chart craft is not reinvented here.** Form choice, the colour formula and its runnable validator, mark specs, and the anti-pattern catalog live in the `dataviz` skill, and a graphic on this path is built against it: load it before writing the first line of markup. What that skill supplies and this file does not restate — thin marks over thick saturated blocks, hairline recessive gridlines that are never dashed, a 2px surface gap between touching fills and a 2px surface ring on overlapping markers, direct labels used sparingly instead of a number on every point, text in ink tokens rather than in the series colour, no dual axis ever, and a palette proved with `scripts/validate_palette.js` rather than judged by eye.

Two places this path overrides that skill, because a feed image is not a dashboard: there is no hover layer, no tooltip and no table view to fall back on, so **every value the graphic asserts is directly visible on the canvas**; and where a chart would carry a legend for two series, a post graphic that small labels the marks themselves instead.

The form is almost always **emphasis** rather than categorical: one accent hue on the thing the post is about, everything else in the de-emphasis gray. A post makes one point, so a second hue usually means the graphic is trying to make two.

Composition craft on top of that: large marks with real negative space around them; a deliberate composition rather than centred everything; contrast strong enough to survive a dark feed and a bright one. Inline SVG is preferred for the marks, since it stays self-contained and scales. Gradients, blurs and shadows are allowed when they are doing work.

**The data on the canvas is the knowledge map's, at its real values.** A bar pair is sized to the actual ratio, an arc filled to the actual fraction, a timeline spaced to the actual intervals. A shape drawn to look good and labelled with a real number is a fabricated chart, which is worse than no chart: it asserts a quantity the sources do not carry, in the one place a reader cannot check it.

**No trademark word carrying its ordinary meaning on the canvas** — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A label has no sentence around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company. Applies to the alt text too.

Hard content rules: whatever few words appear come from the knowledge map, exactly as the map states them; the diagram may not assert a relationship the sources do not carry; no invented metrics, no fake product screenshots, no mocked-up testimonials or star ratings, no logos of companies the sources do not connect to the product. An image is a claim surface like any other sentence in the campaign.

## The variant set, and who picks

**When the user supplied no image, this path does not produce one graphic. It produces a set of at least 20, and the user chooses.** A single generated graphic is one agent's guess at which fact deserves the picture and which form carries it, presented as though it were the answer; the user has no way to see what was passed over, and correcting it costs a whole round trip. Twenty renders cost a few minutes of compute and turn the decision back into a choice.

This applies whenever the run is generating rather than placing: a supplied image, or a library the user pointed at, skips all of it — that decision is already made, and offering variants against it is second-guessing the user.

**Spread the set across the source's facts, not across styles of the same fact.** The set is built by crossing two axes, and the first one matters more:

- **Which fact gets the picture.** Every quantity, mechanism, comparison, sequence and threshold the knowledge map carries is a candidate, including the ones the chosen post text does not lead on. This is where the value is: a set built on five different facts shows the user five different posts they could be making, and the fact they pick is often not the one the draft leads with.
- **Which form carries it.** From the shape table above, and a form is not repeated on the same fact unless the two readings genuinely differ.

Practical shape of a 20-set: **at least 5 distinct facts, at least 6 distinct forms, no fact taking more than a third of the set.** A set of 20 bar charts of the same ratio satisfies the count and fails the rule — the count exists to produce range, and range is the only thing being counted.

**Then hand the user a page they can look at, not a list of filenames.** Build one gallery from the rendered set — every variant at a size where the shapes read, each labelled with its number, its fact and its form — and give the user a link to it. In order of preference:

1. A published page, when the runtime can publish one, so the link opens anywhere and survives the session.
2. A local `.html` gallery in `media/`, path given, plus a rendered contact-sheet image so the set is visible even if the page is never opened.

Either way the contact sheet is produced, because a link the user does not open is not a decision they can make.

**The pick is a gate, and it stops the run.** Present it through the structured-question UI like every other gate in these skills, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step this section exists for.

**After the pick**, the chosen render is the run's image and goes everywhere the Media column says `optional` or `required`, per the one-image rule above. The other 19 stay on disk with their `.html` sources — they cost nothing to keep, they document what was considered, and the user re-picks later without regenerating. Record in the manifest which variant was chosen, out of how many, and on which fact.

## Building it

One self-contained `.html` file per graphic in `content-campaign/<slug>/media/src/`, and one rendered `.png` beside the other media in `content-campaign/<slug>/media/`.

- **Self-contained means offline**: no CDN stylesheet, no web font, no remote image, no script that fetches. A rendering machine without network access must produce the same file. Fonts come from a system stack (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`); a font the user names and has installed locally is fine.
- **One graphic serves every platform that takes one.** The image is made for the post, not for a single network: render it once, attach it wherever the Media column says `optional` or `required`, and let it be the cover image on the article platforms. Render a second aspect ratio only when a platform's verified ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses. This is about ratios, and it does not shrink the variant set above: the set is 20 candidates for one slot, and only the chosen one is ever re-rendered per ratio.
- **Render the set in one pass, then look at every render.** The colour validator checks colour, not layout, so a set of 20 will contain label collisions, marks off the canvas and axis labels sitting at the wrong value — all of which are invisible in the markup and obvious in the image. Build a contact sheet and read it; fix what it shows before the gallery goes to the user. Shipping a gallery full of clipped labels wastes the user's only look at the set.
- **Size the canvas to the platform**, from the Phase 3 research rather than memory — the aspect ratios in play are the vertical feed image, the square, and the link-preview landscape. Set the body to exact pixel dimensions and render at 2× device scale so text stays sharp after the platform recompresses it.
- **Readable at thumbnail size**: the shapes carry at 25% zoom, and any word on the canvas is no smaller than about 4% of the canvas height. View it at that size before accepting it; if the composition turns to mush or the labels blur, the shapes are too small or the words too many.
- **Brand colours** when the user has them (from the interview or the knowledge map); otherwise one accent colour and neutrals. Two typefaces at most, and one is enough.

**Render in a spawned browser, not the user's.** This step loads a local `file://` page and screenshots it — there is no account, no session and nothing to log into, so it has no business taking over a browser the user is working in. Prefer, in order: a headless browser the automation can launch itself, an installed CLI (`wkhtmltoimage` or a browser's own `--screenshot`, verified with `--version` exiting 0), and only then a live bridge. Using a live bridge means the user's window fills with `file://` tabs while the batch renders, so ask first when there is more than one bridge, say which browser is being used, and warn that it is busy.

```js
await page.setViewportSize({ width: W, height: H });
await page.goto('file:///absolute/path/to/graphic.html');
await page.screenshot({ path: 'media/<name>.png', scale: 'device', animations: 'disabled' });
```

Say which renderer was used, in the report. None available at all → say so and leave the post without an image rather than promising one.

## After rendering

- Verify the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform's limits from Phase 3. A graphic that fails any of these is fixed or dropped, never assigned unverified.
- Write alt text describing what the image *shows* and what it means: the two blocks and the arrow between them, the number and its condition, the box that sits inside the other one. Not "an infographic about the product", and never a date or a stamp the canvas does not carry.
- Record in the manifest that the asset was generated rather than supplied, and keep the `.html` source: the user can edit and re-render it without this skill.
