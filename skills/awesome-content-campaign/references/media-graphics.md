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

**Exactly one headline, and it carries the post's point on its own.** The graphic is seen in a feed by someone who has not read a word of the post yet, and a picture that only makes sense once they do has already lost them. So the canvas gets one line of type, written to be self-sufficient: a reader who sees nothing but that line and the shape under it comes away knowing what the post says. "Faster to make than to watch" is a headline. "Generation speed" is a topic, and a topic is not a headline.

Write it as a whole thought — a clause or a short sentence, up to about a dozen words, wrapped over two lines if it needs them. It may name the thing, state the mechanism, or carry the number when the number *is* the point. What it may never be is a fragment the diagram has to complete.

**And that headline is the only type on the canvas.** No axis labels, no ticks, no legend, no series names, no unit riding a mark, no caption under the diagram, no footer, no date, no "checked on" stamp, no logo. This is what rules out the **captioned-diagram construction** — the labelled chart, the annotated timeline, the bar pair with its two names underneath, the grid with a value riding the one accent cell. Those spread the meaning across a dozen scattered words and read as a slide; a slide in a feed is scrolled past. One line does the talking, the composition does the rest.

Two consequences worth stating. A quantity may **shape** the composition without being written down — a mass sized to a real ratio, a break where the real break falls, a count of marks that is the real count — and it is spelled out only when the headline itself is the one carrying it. And the alt text still carries the whole meaning in words, including any quantity the canvas only implies, because that is where a screen-reader user gets it.

**Three tests before accepting a graphic.** Read only the headline, with the picture covered: it has to state the point by itself. Then cover the headline: the shape still has to say which side is bigger, which way the thing moves, where the break is. And look at it beside the other 19 — if it could swap places with any of them without changing what it means, the picture is decoration and the idea was not visual.

## What to build

Pick the shape from what the post's idea *does*, not from a template rotation. **Reach for the composition that a viewer feels before they parse it** — mass against emptiness, a rhythm that breaks, a field that fills, one mark that refuses to match the others. The chart vocabulary is still available as *drawing* (a rail, an arc, a stack of marks are all fine shapes), but never as *reporting*: the moment it acquires an axis label or a value it has become the captioned diagram the section above rules out.

| What the post is about | What the image shows |
| --- | --- |
| Scale or proportion between two quantities | Two masses sized to the real ratio, one dwarfing the other, with the small one still visible |
| A rate, a throughput, a multiple | A field of marks against a single one, the count carrying the multiple |
| Something crossing a threshold | A form breaking a rule that runs the width of the canvas, everything past it in the accent |
| Two quantities diverging over time | Two paths leaving one origin, the widening void between them the largest shape on the canvas |
| A process with an order that matters | Marks along a rail, the interesting one out of step with the rest |
| Work that repeats in blocks | A rhythm of identical blocks, its regularity the whole point |
| A reset, an interruption, a loss of state | A rhythm that climbs and collapses, over and over, the collapses in the accent |
| A flow or a handoff between parties | Many strands converging into one, or one splitting into many |
| Part of a whole, or a count worth feeling | A dense field of cells, the relevant ones in the accent and countable by eye |
| Many variants of one thing | A grid of near-identical forms with exactly one that does not conform |
| A collision, a conflict, an overwrite | Two forms occupying the same space, the intersection in the accent |
| Something continuous and unending | A form that runs off the canvas edge rather than resolving inside it |
| Anything that needs a sentence to land | Not a graphic. Leave the post text-only |

**The chart craft is not reinvented here.** Form choice, the colour formula and its runnable validator, mark specs, and the anti-pattern catalog live in the `dataviz` skill, and a graphic on this path is built against it: load it before writing the first line of markup. What that skill supplies and this file does not restate — thin marks over thick saturated blocks, hairline recessive gridlines that are never dashed, a 2px surface gap between touching fills and a 2px surface ring on overlapping markers, direct labels used sparingly instead of a number on every point, text in ink tokens rather than in the series colour, no dual axis ever, and a palette proved with `scripts/validate_palette.js` rather than judged by eye.

Two places this path overrides that skill, because a feed image is not a dashboard: there is no hover layer, no tooltip and no table view, and no labels either, so **a value reaches the viewer through the headline or not at all** — every quantity's condition and source live in the post body and in the alt text; and where a chart would carry a legend or a direct label to separate two series, a post graphic separates them by position, mass and accent, because its one line of type is already spent.

The form is almost always **emphasis** rather than categorical: one accent hue on the thing the post is about, everything else in the de-emphasis gray. A post makes one point, so a second hue usually means the graphic is trying to make two.

Composition craft on top of that: large marks with real negative space around them; a deliberate composition rather than centred everything; contrast strong enough to survive a dark feed and a bright one. Inline SVG is preferred for the marks, since it stays self-contained and scales. Gradients, blurs and shadows are allowed when they are doing work.

**The geometry on the canvas is the knowledge map's, at its real values.** A mass pair is sized to the actual ratio, an arc swept to the actual fraction, a rhythm spaced at the actual intervals, a field holding the actual count. Nothing is written down, so nothing can be checked by a reader — which makes the discipline stricter rather than looser: a shape drawn to look good while implying a quantity the sources do not carry is a fabricated chart with its evidence removed.

**No trademark word carrying its ordinary meaning in the headline or the alt text** — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A headline stands alone with no paragraph around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company.

Hard content rules: the composition may not assert a relationship the sources do not carry; no invented metrics, no fake product screenshots, no mocked-up testimonials or star ratings, no logos of companies the sources do not connect to the product. An image is a claim surface like any other sentence in the campaign, and a wordless one is still read as evidence.

## The variant set, and who picks

**When the user supplied no image, this path does not produce one graphic. It produces a set of at least 20, and the user chooses.** A single generated graphic is one agent's guess at which fact deserves the picture and which form carries it, presented as though it were the answer; the user has no way to see what was passed over, and correcting it costs a whole round trip. Twenty renders cost a few minutes of compute and turn the decision back into a choice.

This applies whenever the run is generating rather than placing: a supplied image, or a library the user pointed at, skips all of it — that decision is already made, and offering variants against it is second-guessing the user.

**Name the primary fact before drawing anything, and build most of the set on it.** A source has one fact it is actually about, and a tail of secondary ones that are consequences, colour or anecdote. The primary fact is the one that had to be true for the rest of the text to exist: the capability, the measurement, the mechanism that changed. Everything downstream of it — what it enabled, what it costs, who got banned, which product shipped on top — is secondary however quotable it is, and a set anchored there illustrates the story's furniture instead of its subject.

The test is subtraction. Remove the candidate fact and ask whether the source still has a point. Remove "a five second clip generates in about three seconds" and the endless stream, the price of running it and the platform bans all stop making sense; remove the price and the text is unharmed. The one that takes the rest down with it is the primary fact.

The set is then built by crossing two axes, and the first one matters more:

- **Which fact gets the picture.** The primary fact takes **at least half** the set, in genuinely different readings of it. The remainder goes to the secondary facts, and their job is to show the user what else the source could carry, not to compete for the slot.
- **Which form carries it.** From the shape table above, and a form is not repeated on the same fact unless the two readings genuinely differ.

Practical shape of a 20-set: **at least 10 on the primary fact, at least 3 further facts across the rest, at least 6 distinct forms, and no secondary fact taking more than a fifth of the set.** A set of 20 bar charts of the same ratio satisfies no rule here; neither does a set that spreads evenly across seven facts and never once draws the thing the source is about.

**Where the primary fact's number lives outside the given text, go and get it.** A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, put it in the knowledge map with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

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
- **Render the set in one pass, then look at every render.** The colour validator checks colour, not layout, so a set of 20 will contain marks running off the canvas, forms that collide into mush and compositions that turned out to be a grey rectangle — all of which are invisible in the markup and obvious in the image. Build a contact sheet and read it; fix what it shows before the gallery goes to the user. Shipping a gallery of broken renders wastes the user's only look at the set.
- **Size the canvas to the platform**, from the Phase 3 research rather than memory — the aspect ratios in play are the vertical feed image, the square, and the link-preview landscape. Set the body to exact pixel dimensions and render at 2× device scale so edges stay clean after the platform recompresses it.
- **Readable at thumbnail size**: the composition carries at 25% zoom and the headline is still legible there, which puts it no smaller than about 4% of the canvas height. View it at that size before accepting it; if the picture turns to mush the marks are too many or too thin, and the fix is fewer, larger forms.
- **Brand colours** when the user has them (from the interview or the knowledge map); otherwise one accent colour and neutrals. One typeface, since there is only one line to set.

**Render in a spawned browser, not the user's.** This step loads a local `file://` page and screenshots it — there is no account, no session and nothing to log into, so it has no business taking over a browser the user is working in. Prefer, in order: a headless browser the automation can launch itself, an installed CLI (`wkhtmltoimage` or a browser's own `--screenshot`, verified with `--version` exiting 0), and only then a live bridge. Using a live bridge means the user's window fills with `file://` tabs while the batch renders, so ask first when there is more than one bridge, say which browser is being used, and warn that it is busy.

```js
await page.setViewportSize({ width: W, height: H });
await page.goto('file:///absolute/path/to/graphic.html');
await page.screenshot({ path: 'media/<name>.png', scale: 'device', animations: 'disabled' });
```

Say which renderer was used, in the report. None available at all → say so and leave the post without an image rather than promising one.

## After rendering

- Verify the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform's limits from Phase 3. A graphic that fails any of these is fixed or dropped, never assigned unverified.
- Write alt text describing what the image *shows* and what it means, and carrying the quantity the canvas only implies: the two masses and the ratio between them, the rhythm and where it breaks, the one form that does not conform, with the number and its condition stated in words since the picture cannot. Not "an infographic about the product", and never a date or a stamp.
- Record in the manifest that the asset was generated rather than supplied, and keep the `.html` source: the user can edit and re-render it without this skill.
