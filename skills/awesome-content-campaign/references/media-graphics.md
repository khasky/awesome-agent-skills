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

**That spread is decided at the headline gate below, not at render time**, because the two gates split the work: the 20 *headline ideas* range across the facts, and the 20 *renders* are then 20 forms of whichever one the user picked. So the rule reads:

- **Which fact gets offered.** Among the 20 headline ideas, the primary fact takes **at least half**, in genuinely different wordings and angles rather than paraphrases of one sentence. The remainder goes to the secondary facts, and their job is to show the user what else the source could carry, not to compete for the slot.
- **Which form carries the chosen one.** From the shape table above, once the text is settled. A form is not repeated unless the two readings genuinely differ.

Practical shape: **at least 10 of the 20 headline ideas on the primary fact, at least 3 further facts across the rest, no secondary fact taking more than a fifth of them** — then **20 distinct forms** for the render set. Twenty paraphrases of one sentence fails the first half; twenty bar charts of one ratio fails the second.

**Where the primary fact's number lives outside the given text, go and get it.** A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, put it in the knowledge map with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

### Two gates, and the text one comes first

**Once the user has agreed to a generated set, the next thing they choose is the headline, before a single graphic is rendered.** A gallery that varies the message and the picture at the same time asks the user to compare twenty things along two axes at once, and the answer they give is unreadable: nobody can say whether variant 7 won on its wording or its shape. Separating the two also stops the run wasting twenty renders on a sentence the user was never going to publish.

So the run writes **20 headline ideas** and presents them as text, numbered, with no images yet. They are spread by the same rule as the set itself: at least half of them state the primary fact, in genuinely different wordings and angles rather than twenty paraphrases of one sentence, and the rest carry the secondary facts. Each is a whole thought that could stand alone on a canvas, per the headline rule above, and each is short enough to set at display size.

**The list always ends with a free-text option: the user writes their own headline.** That is not a fallback for a failed list, it is the point of showing the list — twenty concrete examples are what makes a person able to say "closer to number 9, but with the price in it". Whatever they type is used verbatim, checked only against the fidelity rules (no claim the sources do not carry, no calendar date, no long dash, no trademark word carrying its ordinary meaning) and reported if it breaks one, never silently rewritten.

**The whole list is shown, and the question is single-choice.** Splitting twenty options across five questions works for a checkbox list and breaks here, because five single-select questions collect five answers where one is wanted. So print all 20 numbered in the message itself, then ask one question carrying a few of them verbatim plus two open doors: `another number from the list` and `my own wording`. The user has seen every option, and answers once.

**Then the chosen headline is the headline for all 20 renders**, and the visual set becomes twenty treatments of one message: different forms from the shape table, different compositions, different anchors and densities per the craft section. The fact spread has already done its work at the text stage, so the render stage is free to vary only what the eye is being asked to compare.

**And every render must draw the fact its headline states.** This is the trap the two-gate order sets, so it is worth naming: a set drafted before the gate has a composition per fact, and once one headline lands on all of them, every variant built on a different fact starts contradicting its own caption — a picture of a year's cost under a line about seconds. Those are rebuilt as further readings of the chosen fact, never shipped as-is. Where the chosen fact genuinely cannot carry 20 distinct forms, say so and ship fewer rather than padding the gallery with variants that argue with their own text.

**Then hand the user a page they can look at, not a list of filenames.** Build one gallery from the rendered set — every variant at a size where the shapes read, each labelled with its number and its form, the fact being the same across all of them by then — and give the user a link to it. In order of preference:

1. A published page, when the runtime can publish one, so the link opens anywhere and survives the session.
2. A local `.html` gallery in `media/`, path given, plus a rendered contact-sheet image so the set is visible even if the page is never opened.

Either way the contact sheet is produced, because a link the user does not open is not a decision they can make.

**The pick is the second gate, and it stops the run.** Present it through the structured-question UI like every other gate in these skills, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step this section exists for — and one that renders before the headline gate has answered the wrong question first.

**After the pick**, the chosen render is the run's image and goes everywhere the Media column says `optional` or `required`, per the one-image rule above. The other 19 stay on disk with their `.html` sources — they cost nothing to keep, they document what was considered, and the user re-picks later without regenerating. Record in the manifest both answers: the headline the user chose out of how many ideas (and whether they typed their own), and the variant they chose out of how many renders.

## Craft: what makes twenty renders look like twenty, not one recoloured

A set built from flat shapes on flat backgrounds comes out uniform however different the forms are, because every variant shares the same lighting, the same edge quality and the same emptiness. The techniques below are what separate them. They are adapted from a working HTML/CSS asset pipeline (`emojery-assets`, which composes store screenshots, banners and diagram scenes the same way this path composes post graphics) — **taken as technique, never as appearance**: its palette, its lockups and its layouts stay its own, and the colour here still comes from `dataviz` and the user's brand.

**Deterministic hashing, never `Math.random()`.** A variant that renders differently on a re-run cannot be re-picked from a gallery or regenerated after an edit. Seed a small periodic hash from the element's own coordinates and a salt, and drive every property from a different salt: `frac(sin(r * 928.31 + c * 517.13 + salt * 71.7) * 43758.5453)`. One salt for x jitter, another for y, another for scale, another for rotation, another for depth tier. Take the coordinates modulo a tile period and the whole field repeats seamlessly, which is what lets a background bleed off the canvas without a visible seam.

**Break the grid without losing it.** A lattice reads as a grid and a scatter reads as noise; the useful thing sits between. Offset alternate rows by half a step, then jitter each cell by up to a third of the step on both axes, scale it between about 0.8× and 1.3×, and rotate it within roughly ±20°. The structure still carries, and nothing looks placed by a loop.

**Depth is what flat sets are missing.** Assign each background element one of three or four blur tiers and give the foreground none, so the eye finds the subject immediately. Run the blur on the containing layer rather than per element — one filter pass instead of hundreds, and the layer's own soft edge falls outside the canvas rather than showing as a fringe. Add a directional drop shadow to the marks that should float.

**Light the canvas from off-canvas.** One large radial gradient, `closest-side`, white at 25 to 35 percent alpha, positioned so more than half of it sits outside the frame. It reads as a light source in the room rather than a glow drawn on the picture. Two of them in opposite corners, in the accent and a second hue at 12 to 16 percent alpha over the flat base, give a background that is not a rectangle of colour: `radial-gradient(58% 46% at 24% -10%, ringA, transparent 70%), radial-gradient(54% 46% at 94% 6%, ringB, transparent 72%), base`.

**Generate shapes from math instead of drawing them.** A scalloped disc is a polar path alternating between two radii over `points * 2` steps. A connector with real tension is a quadratic Bézier whose control point is pushed perpendicular to the chord by a bend parameter. An arrowhead is two short strokes off the line's end. Parametric shapes vary by argument, so one generator supplies a dozen distinct marks across the set while hand-drawn paths repeat themselves.

**Vary the composition, not just the form.** Across the 20, move the subject's anchor between corners and edges, change how much of the canvas the marks occupy (a dense field in one, a single large mass with deep negative space in another), let some forms run off the edge and keep others fully inside, and change the scale relationship between largest and smallest element. Two variants using the same form at the same size in the same place are one variant.

**Give the set one system and per-variant tokens.** Define the surface, ink, accent, secondary accent and the two ring washes once, and let each variant pick its emphasis within them. Shadows come from a small scale rather than ad hoc: a tight one for resting elements, a large offset one with negative spread for floating ones. A gradient ring around a shape needs no extra element — `background-image: linear-gradient(surface, surface), linear-gradient(90deg, …)` with a transparent border and `background-clip` does it in one box.

**Stand in for content with shape, not with text.** Where a composition needs a body of text, a page or a card, draw rounded bars at uneven widths rather than lorem ipsum. It reads instantly as "content" and adds no words to a canvas that allows exactly one line of them.

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
