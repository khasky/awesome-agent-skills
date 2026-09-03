# Visual language — what to draw, and how to render it

Loaded before the first line of markup is written. The gates and the fact rules live in `SKILL.md`; **which kind of picture this is lives in `style-catalog.md`**, and that file is read first. This one is the drawing craft underneath: the shape vocabulary the emphasis-diagram archetype uses, the techniques that keep a set from looking like one image recoloured, and the render mechanics every archetype shares.

## The job of the image

**The image is what stops the scroll, not a second copy of the post.** The text is already in the post and the reader will read it there. What the image has to do is make them stop long enough to start reading, and carry one idea while they do.

Where the idea is a relationship rather than a thing, the graphic is drawn rather than typed: the mechanism becomes a diagram — two blocks and an arrow, one box inside another, a shape split down the middle, a full bar next to an empty one, three dots on a line where the third is a different colour. Abstract is fine and usually better, as long as the shape means what the post means.

## What to build

For the emphasis diagram, pick the shape from what the idea *does*, not from a template rotation. **Reach for the composition that a viewer feels before they parse it** — mass against emptiness, a rhythm that breaks, a field that fills, one mark that refuses to match the others. The chart vocabulary is available as *drawing* (a rail, an arc, a stack of marks are all fine shapes), never as *reporting*: **inside this archetype** the moment a mark acquires an axis label or a printed value it has become a chart nobody asked for. Labels are not banned generally — the denser archetypes in `style-catalog.md` are built on them — they are banned *here*, because the whole point of this archetype is that the shape carries the meaning alone.

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

**The chart craft is not reinvented here.** Form choice, the colour formula and its runnable validator, mark specs and the anti-pattern catalog live in the `dataviz` skill, and a graphic on this path is built against it. What that skill supplies and this file does not restate: thin marks over thick saturated blocks, hairline recessive gridlines that are never dashed, a 2px surface gap between touching fills and a 2px surface ring on overlapping markers, direct labels used sparingly instead of a number on every point, text in ink tokens rather than in the series colour, no dual axis ever, and a palette proved with `scripts/validate_palette.js` rather than judged by eye.

Two places this path overrides that skill, because a feed image is not a dashboard: there is no hover layer, no tooltip and no table view; and where a chart would carry a legend to separate two series, a post graphic separates them by position, mass and accent. In the emphasis diagram specifically there are no labels at all, so **a value reaches the viewer through the headline or not at all**, and every quantity's condition and source live in the post body and in the alt text.

The form is almost always **emphasis** rather than categorical: one accent hue on the thing the post is about, everything else in the de-emphasis gray. A post makes one point, so a second hue usually means the graphic is trying to make two. The exceptions are declared by archetype — a split compare needs exactly two hues because the two hues *are* the comparison, and a catalog grid may key its rows by hue as long as the cells stay neutral.

Composition craft on top of that: large marks with real negative space around them; a deliberate composition rather than centred everything; contrast strong enough to survive a dark feed and a bright one. Inline SVG is preferred for the marks, since it stays self-contained and scales. Gradients, blurs and shadows are allowed when they are doing work.

## Craft: what makes twenty renders look like twenty, not one recoloured

A set built from flat shapes on flat backgrounds comes out uniform however different the forms are, because every variant shares the same lighting, the same edge quality and the same emptiness. The techniques below are what separate them. They are adapted from a working HTML/CSS asset pipeline (`emojery-assets`, which composes store screenshots, banners and diagram scenes the same way this path composes post graphics) — **taken as technique, never as appearance**: its palette, its lockups and its layouts stay its own, and the colour here still comes from `dataviz` and the user's own inputs.

**Deterministic hashing, never `Math.random()`.** A variant that renders differently on a re-run cannot be re-picked from a gallery or regenerated after an edit. Seed a small periodic hash from the element's own coordinates and a salt, and drive every property from a different salt: `frac(sin(r * 928.31 + c * 517.13 + salt * 71.7) * 43758.5453)`. One salt for x jitter, another for y, another for scale, another for rotation, another for depth tier. Take the coordinates modulo a tile period and the whole field repeats seamlessly, which is what lets a background bleed off the canvas without a visible seam.

**Break the grid without losing it.** A lattice reads as a grid and a scatter reads as noise; the useful thing sits between. Offset alternate rows by half a step, then jitter each cell by up to a third of the step on both axes, scale it between about 0.8× and 1.3×, and rotate it within roughly ±20°. The structure still carries, and nothing looks placed by a loop.

**Depth is what flat sets are missing.** Assign each background element one of three or four blur tiers and give the foreground none, so the eye finds the subject immediately. Run the blur on the containing layer rather than per element — one filter pass instead of hundreds, and the layer's own soft edge falls outside the canvas rather than showing as a fringe. Add a directional drop shadow to the marks that should float.

**Light the canvas from off-canvas.** One large radial gradient, `closest-side`, white at 25 to 35 percent alpha, positioned so more than half of it sits outside the frame. It reads as a light source in the room rather than a glow drawn on the picture. Two of them in opposite corners, in the accent and a second hue at 12 to 16 percent alpha over the flat base, give a background that is not a rectangle of colour: `radial-gradient(58% 46% at 24% -10%, ringA, transparent 70%), radial-gradient(54% 46% at 94% 6%, ringB, transparent 72%), base`.

**Generate shapes from math instead of drawing them.** A scalloped disc is a polar path alternating between two radii over `points * 2` steps. A connector with real tension is a quadratic Bézier whose control point is pushed perpendicular to the chord by a bend parameter. An arrowhead is two short strokes off the line's end. Parametric shapes vary by argument, so one generator supplies a dozen distinct marks across the set while hand-drawn paths repeat themselves.

**Vary the composition, not just the form.** Across the set, move the subject's anchor between corners and edges, change how much of the canvas the marks occupy (a dense field in one, a single large mass with deep negative space in another), let some forms run off the edge and keep others fully inside, and change the scale relationship between largest and smallest element. Two variants using the same form at the same size in the same place are one variant.

**And vary the archetype and the surface before varying anything else.** Composition differences inside one archetype on one surface are the smallest available difference; a statement on warm paper next to a proof object on deep dark next to a chain on a gradient field is what a real set looks like. The spread rule is in `style-catalog.md`.

**Give the set one system and per-variant tokens.** Define the surface, ink, accent, secondary accent and the two ring washes once, and let each variant pick its emphasis within them. Shadows come from a small scale rather than ad hoc: a tight one for resting elements, a large offset one with negative spread for floating ones. A gradient ring around a shape needs no extra element — `background-image: linear-gradient(surface, surface), linear-gradient(90deg, …)` with a transparent border and `background-clip` does it in one box.

**Stand in for content with shape, not with text.** Where a composition needs a body of text, a page or a card, draw rounded bars at uneven widths rather than lorem ipsum. It reads instantly as "content" and spends none of the archetype's type budget.

## Building it

One self-contained `.html` file per graphic in `<out>/src/`, and one rendered `.png` beside the other media in `<out>/`.

- **Self-contained means offline**: no CDN stylesheet, no web font, no remote image, no script that fetches. A rendering machine without network access must produce the same file. Fonts come from a system stack (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`); a font the user names and has installed locally is fine. **Where the canvas is set in a non-Latin script, prove the stack carries it on the first render** — a missing glyph is an empty box, and nothing downstream of the markup will flag it.
- **Size the canvas to the platform**, from the caller's verified research rather than memory — the ratios in play are the vertical feed image, the square, and the link-preview landscape. Set the body to exact pixel dimensions and render at 2× device scale so edges stay clean after the platform recompresses it.
- **Readable at thumbnail size**: the composition carries at 25% zoom and the headline is still legible there, which puts it no smaller than about 4% of the canvas height. View it at that size before accepting it; if the picture turns to mush the marks are too many or too thin, and the fix is fewer, larger forms.
- **Render the set in one pass, then look at every render** — the contact-sheet read, which is where the marks running off the canvas, the type overflowing its box and the compositions that came out grey are caught.

**Render in a spawned browser, not the user's.** This step loads a local `file://` page and screenshots it — there is no account, no session and nothing to log into, so it has no business taking over a browser the user is working in. Prefer, in order: a headless browser the automation can launch itself, an installed CLI (`wkhtmltoimage` or a browser's own `--screenshot`, verified with `--version` exiting 0), and only then a live bridge. Using a live bridge means the user's window fills with `file://` tabs while the batch renders, so ask first when there is more than one bridge, say which browser is being used, and warn that it is busy.

```js
await page.setViewportSize({ width: W, height: H });
await page.goto('file:///absolute/path/to/graphic.html');
await page.screenshot({ path: 'media/<name>.png', scale: 'device', animations: 'disabled' });
```

Say which renderer was used, in the report.
