# Visual language — what to draw, and how to render it

Loaded before the first line of markup is written. The gates and the fact rules live in `SKILL.md`; which kind of picture this is lives in `style-catalog.md`, and that file is read first. This one is the drawing craft underneath: the shape vocabulary the emphasis-diagram archetype uses, the techniques that keep a set from looking like one image recoloured, and the render mechanics every archetype shares.

## The job of the image

The image is what stops the scroll, not a second copy of the post. The text is already in the post and the reader will read it there. What the image has to do is make them stop long enough to start reading, and carry one idea while they do.

Where the idea is a relationship rather than a thing, the graphic is drawn rather than typed: the mechanism becomes a diagram — two blocks and an arrow, one box inside another, a shape split down the middle, a full bar next to an empty one, three dots on a line where the third is a different colour. Abstract is fine and usually better, as long as the shape means what the post means.

## What to build

The picture answers a question a stranger can ask. Which is bigger, how much of the whole, how fast, how it changed: those read. An abstract composition that means something only to the person who wrote the caption does not, and a set is full of them the moment the shapes are picked for their looks. So the vocabulary here is one thing only: data figures, which carry their real values and what those values measure. The unlabelled abstract composition used to sit beside them; it was tried across three sets, rejected in every one, and it is gone.

The readability test, applied to every composition before it is built: show it to someone who has not read the post. Can they say what is being compared, which side wins and what the numbers measure, in about two seconds? If the answer needs the headline, the shape is decoration, and the fix is values on it — or no shape at all.

### Data figures — the default

Each carries its real values as printed text. The label budget is the values themselves plus one word per series, nothing else: no axis, no legend, no gridlines, no title (the headline is the title). The relationship column follows the Financial Times' Visual Vocabulary categories, which is the map from "what am I saying" to "which chart".

Every pattern here is read by length, angle or position — never by counting. That is the line the waffle grid, the icon array and the cell matrix fell on: a 10 x 10 lattice with sixty cells filled is a tally a viewer has to decode, and printing `60 of 100` beside it does not fix it, it admits it. Those three are cut, and so is anything with more than six marks: six marks is the ceiling for a feed figure, and a figure that needs more is the wrong figure.

| Pattern | For | How it is drawn offline |
| --- | --- | --- |
| Paired bars | Magnitude: two quantities compared | Two thick rounded bars, one accent one neutral, value set inside or past the end of each. Bars share a baseline. The only honest answer when a ratio is the point |
| Progress bar | Part-to-whole: one share of one thing | One long track in the neutral, the accent portion filled to the real fraction, the percentage set large at the fill's end |
| Donut ring | Part-to-whole, when the share deserves a subject | An SVG circle with `stroke-dasharray` set to the fraction of `2πr`, or a `conic-gradient` disc with a punched centre. The value goes in the hole at display size |
| Slope pair | Change: before and after | Two labelled dots joined by one thick line, the value at each end, the direction of the line carrying the story |
| Big number with a trend line | Change over time, one figure | The number at display scale in the accent, a small thick sparkline under it, the endpoints labelled |
| Stacked proportion bar | Part-to-whole with two or three parts | One bar split into segments at real proportions, each segment labelled inside it where it fits, outside where it does not |
| Step ladder | Change over time in three or four beats | Three or four blocks rising or falling to real values, each with its value on it, the last in the accent |
| Gauge arc | Magnitude inside a known range | A semicircular arc, the accent sweeping the real fraction, the value large in the arc's mouth |
| Lollipop pair | Ranking or magnitude for two named things | Two thick stems ending in discs on a shared baseline, name under each, value in or above each disc |

### Abstract compositions — gone

There is no unlabelled-figure category any more. Two masses at the real ratio, a nested pair, a field of identical cells, a rhythm of blocks, strands converging into one, a grid with one odd form, marks on a rail: each was built, rendered and put in front of the person who asked for the set, and each came back as "two coloured rectangles that mean nothing". The failure is not the ratio, the accent or the scale — a viewer with no caption cannot know what either shape stands for, and no amount of drawing craft supplies that.

So: a figure that compares anything prints what it compares. If the quantity cannot be printed — because it is not in the facts, or because it needs a sentence — the canvas is a glyph canvas or a number lockup instead, and the shape is not drawn at all.

The one shape that survives without values is not a comparison: a single form as a subject — one disc, one arc, one block behind the type — which is decoration doing an honest job and is never read as data.

Every figure is drawn against the scale gate in `style-catalog.md`: at most five load-bearing forms, the largest spanning half the canvas on one axis, thick strokes, and a difference that survives at 25 percent zoom.

The chart craft is not reinvented here. Form choice, the colour formula and its runnable validator, mark specs and the anti-pattern catalog live in the `dataviz` skill, and a graphic on this path is built against it. What that skill supplies and this file does not restate: thin marks over thick saturated blocks, hairline recessive gridlines that are never dashed, a 2px surface gap between touching fills and a 2px surface ring on overlapping markers, direct labels used sparingly instead of a number on every point, text in ink tokens rather than in the series colour, no dual axis ever, and a palette proved with that skill's `validate_palette.js` rather than judged by eye.

Two places this path overrides that skill, because a feed image is not a dashboard: there is no hover layer, no tooltip and no table view; and where a chart would carry a legend to separate two series, a post graphic separates them by position, mass and accent. A data figure prints its values and a one-to-three-word caption for what they measure, and nothing else; every quantity's fuller condition and its source live in the post body and in the alt text.

The form is almost always emphasis rather than categorical: one accent hue on the thing the post is about, everything else in the de-emphasis gray. A post makes one point, so a second hue usually means the graphic is trying to make two. The one exception sits on the shelf, where a catalog grid may key its rows by hue as long as the cells stay neutral.

Composition craft on top of that: large marks with real negative space around them; a deliberate composition rather than centred everything; contrast strong enough to survive a dark feed and a bright one. Inline SVG is preferred for the marks, since it stays self-contained and scales. Gradients, blurs and shadows are allowed when they are doing work.

## Craft: what makes twenty renders look like twenty, not one recoloured

A set built from flat shapes on flat backgrounds comes out uniform however different the forms are, because every variant shares the same lighting, the same edge quality and the same emptiness. The techniques below are what separate them. They are adapted from a working HTML/CSS asset pipeline (`emojery-assets`, which composes store screenshots, banners and diagram scenes the same way this path composes post graphics) — taken as technique, never as appearance: its palette, its lockups and its layouts stay its own, and the colour here still comes from `dataviz` and the user's own inputs.

Deterministic hashing, never `Math.random()`. A variant that renders differently on a re-run cannot be re-picked from a gallery or regenerated after an edit. Seed a small periodic hash from the element's own coordinates and a salt, and drive every property from a different salt: `frac(sin(r * 928.31 + c * 517.13 + salt * 71.7) * 43758.5453)`. One salt for x jitter, another for y, another for scale, another for rotation, another for depth tier. Take the coordinates modulo a tile period and the whole field repeats seamlessly, which is what lets a background gradient reach the canvas edge without a visible seam.

Break the grid without losing it. A lattice reads as a grid and a scatter reads as noise; the useful thing sits between. Offset alternate rows by half a step, then jitter each cell by up to a third of the step on both axes, scale it between about 0.8× and 1.3×, and rotate it within roughly ±20°. The structure still carries, and nothing looks placed by a loop.

Depth is what flat sets are missing. Assign each background element one of three or four blur tiers and give the foreground none, so the eye finds the subject immediately. Run the blur on the containing layer rather than per element — one filter pass instead of hundreds, and the layer's own soft edge falls outside the canvas rather than showing as a fringe. Add a directional drop shadow to the marks that should float.

Light the canvas from off-canvas. One large radial gradient, `closest-side`, white at 25 to 35 percent alpha, positioned so more than half of it sits outside the frame. It reads as a light source in the room rather than a glow drawn on the picture. Two of them in opposite corners, in the accent and a second hue at 12 to 16 percent alpha over the flat base, give a background that is not a rectangle of colour: `radial-gradient(58% 46% at 24% -10%, ringA, transparent 70%), radial-gradient(54% 46% at 94% 6%, ringB, transparent 72%), base`.

Paint the ground from a recipe, and change the recipe every variant. A flat fill behind every canvas is what makes a hundred renders read as one. The recipes below are the no-reference defaults: where a site was supplied as the look input, the grounds are that site's own — its gradients, its washes, its section fills, read off the rendered page — and this list is not used. The recipes, all pure CSS and all cheap:

- Linear gradient at an angle between two stops of the variant's own scheme, the angle itself a lever: `linear-gradient(147deg, #1b1033 0%, #3a1550 55%, #12060f 100%)`. Three stops beat two, and an off-axis angle beats 90°.
- Mesh gradient: three or four `radial-gradient` layers at different positions and sizes over a base colour, each `transparent` by 60 to 75 percent. That is the "expensive" background look, and it is four lines of CSS.
- Blob field: two to four large soft shapes — `border-radius: 62% 38% 47% 53% / 43% 55% 45% 57%` on a big div, or an SVG blob path — filled with scheme colours at 15 to 40 percent alpha and blurred by 60 to 160 px. Big and few: a blob smaller than a fifth of the canvas is a smudge, not a background. Keep them behind everything and out of the type's way, and let them cross the canvas edge, since a blob is the one thing that should.
- Duotone split: the canvas cut into two fields of two scheme colours, on a diagonal or a curve, with the type sitting across the seam.
- Any of those plus a texture layer: grain, a symbol field, a vignette, a halftone dot field at low alpha.

The recipe is part of the variant's signature in `style-catalog.md`, so it is planned rather than reached for, and no recipe takes more than a quarter of the set.

Generate shapes from math instead of drawing them. A scalloped disc is a polar path alternating between two radii over `points * 2` steps. A connector with real tension is a quadratic Bézier whose control point is pushed perpendicular to the chord by a bend parameter. An arrowhead is two short strokes off the line's end. Parametric shapes vary by argument, so one generator supplies a dozen distinct marks across the set while hand-drawn paths repeat themselves.

Vary the composition, not just the form. Across the set, move the subject's anchor between corners and edges, change how much of the canvas the marks occupy (a dense field in one, a single large mass with deep negative space in another), let some forms run off the edge and keep others fully inside, and change the scale relationship between largest and smallest element. Two variants using the same form at the same size in the same place are one variant.

And vary the kind and the surface before varying anything else. Composition differences inside one kind on one surface are the smallest available difference; a bare statement on warm paper next to a glyph canvas on deep dark next to two masses on a gradient field is what a real set looks like. The combination rule that counts this is in `style-catalog.md`.

Give the set one system and per-variant tokens. Define the surface, ink, accent, secondary accent and the two ring washes once, and let each variant pick its emphasis within them. Shadows come from a small scale rather than ad hoc: a tight one for resting elements, a large offset one with negative spread for floating ones. A gradient ring around a shape needs no extra element — `background-image: linear-gradient(surface, surface), linear-gradient(90deg, …)` with a transparent border and `background-clip` does it in one box.

Stand in for content with shape, not with text. Where a composition needs a body of text, a page or a card, draw rounded bars at uneven widths rather than lorem ipsum. It reads instantly as "content" and spends none of the archetype's type budget.

## Building it

One self-contained `.html` file per graphic in `<out>/src/`, and one rendered `.png` beside the other media in `<out>/`. `<out>` is the run's own folder — an absolute path, and with no `--out` given a fresh directory under the session's temporary area rather than anything inside the folder the skill was called from.

- Self-contained means offline: no CDN stylesheet, no linked web font, no remote image, no script that fetches. A rendering machine without network access must produce the same file from the emitted HTML. Assets may be acquired during the run and then embedded — a free-licence face fetched into `assets/fonts/` and written in as a base64 `@font-face`, an icon fetched into `assets/icons/` and inlined as an SVG path — because what has to be self-contained is the file, not the pipeline. What is never acceptable is a `<link>` to a font CDN or an `<img src>` to a remote host. Fall back to the system stack (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`) when nothing was fetched. Where the canvas is set in a non-Latin script, prove the stack carries it on the first render — a missing glyph is an empty box, and nothing downstream of the markup will flag it.
- Size the canvas to the platform, from the caller's verified research rather than memory — the ratios in play are the vertical feed image, the square, and the link-preview landscape. Set the body to exact pixel dimensions and render at 2× device scale so edges stay clean after the platform recompresses it.
- Readable at thumbnail size: the composition carries at 25% zoom and the headline is still legible there, which puts it no smaller than about 4% of the canvas height. View it at that size before accepting it; if the picture turns to mush the marks are too many or too thin, and the fix is fewer, larger forms.
- Run the geometry check on every page before its screenshot (below), so clipped forms, overflowing type and half-empty canvases are caught in the page rather than in the contact sheet.
- Render the set in one pass, then look at every render — the contact-sheet read, which is where the compositions that came out grey, the collisions and the near-duplicates are caught.

Render in a spawned browser, not the user's. This step loads a local `file://` page and screenshots it — there is no account, no session and nothing to log into, so it has no business taking over a browser the user is working in. Prefer, in order: a headless browser the automation can launch itself, an installed CLI (`wkhtmltoimage` or a browser's own `--screenshot`, verified with `--version` exiting 0), and only then a live bridge. Using a live bridge means the user's window fills with `file://` tabs while the batch renders, so ask first when there is more than one bridge, say which browser is being used, and warn that it is busy.

```js
await page.setViewportSize({ width: W, height: H });
await page.goto('file:///absolute/path/to/graphic.html');
await page.screenshot({ path: '<out>/<name>.png', scale: 'device', animations: 'disabled' });
```

Say which renderer was used, in the report.

## The geometry check, before the screenshot

Clipped arrowheads, type past the edge and a composition huddled in one corner are the three defects the markup never shows and the eye catches late. They are all measurable, so they are measured — in the page, before the render is accepted, not by squinting at a contact sheet afterwards.

The contract that makes it possible:

- Every load-bearing element carries `data-mark` — the headline block, the subject, each form of a figure.
- Every headline line carries `data-line`.
- Every printed value carries `data-value`, and its caption `data-caption`, both inside the element marked `data-figure`.
- Text set inside a shape carries `data-fit="<id of the container>"`.
- There is no `data-bleed`. The attribute existed for two revisions and produced clipped arrowheads and blocks sliced by the frame; nothing crosses the safe margin now, and a composition that wants to feel unbounded does it inside the frame.

```js
const check = await page.evaluate(() => {
  const W = innerWidth, H = innerHeight, m = 0.04;      // 4% safe margin
  const marks = [...document.querySelectorAll('[data-mark]')];
  const over = [], cells = new Set();
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (const el of marks) {
    const r = el.getBoundingClientRect();
    const sides = { left: r.left < W*m, right: r.right > W*(1-m),
                    top: r.top < H*m, bottom: r.bottom > H*(1-m) };
    for (const s in sides) if (sides[s]) over.push(`${el.dataset.mark}:${s}`);   // R1: no exceptions
    x0 = Math.min(x0, Math.max(r.left, 0)); y0 = Math.min(y0, Math.max(r.top, 0));
    x1 = Math.max(x1, Math.min(r.right, W)); y1 = Math.max(y1, Math.min(r.bottom, H));
    for (let c = 0; c < 10; c++) for (let v = 0; v < 10; v++)          // 10x10 occupancy
      if (r.left < W*(c+1)/10 && r.right > W*c/10 &&
          r.top < H*(v+1)/10 && r.bottom > H*v/10) cells.add(c + ',' + v);
  }
  let voidBlock = false;                                  // any empty 4x4 block = a dead 40%
  for (let c = 0; c <= 6; c++) for (let v = 0; v <= 6; v++) {
    let empty = true;
    for (let i = c; i < c+4 && empty; i++) for (let j = v; j < v+4 && empty; j++)
      if (cells.has(i + ',' + j)) empty = false;
    if (empty) voidBlock = true;
  }
  const head = document.querySelector('[data-mark="headline"]').getBoundingClientRect();

  const lines = [...document.querySelectorAll('[data-line]')]
                  .map(el => el.getBoundingClientRect()).sort((a,b) => a.top - b.top);
  const gaps = lines.slice(1).map((r,i) => r.top - lines[i].bottom);   // between line boxes
  const lh = Math.max(1, lines[0] ? lines[0].height : 1);
  const gapMin = gaps.length ? Math.min(...gaps) / lh : 1;             // R2: must stay positive
  const gapSpread = gaps.length < 2 ? 0 : (Math.max(...gaps) - Math.min(...gaps)) / lh;
  const lineOver = lines.filter(r => r.left < W*m || r.right > W*(1-m)).length;

  const STOP = new Set(['a','an','the','of','in','on','at','to','and','or','is','it','for','per']);
  const words = el => el.textContent.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')
                        .trim().split(' ').filter(w => w && !STOP.has(w));
  const headWords = new Set();                                          // R5, R6: nothing said twice
  for (const el of document.querySelectorAll('[data-line]')) words(el).forEach(w => headWords.add(w));
  const dup = [];
  for (const el of document.querySelectorAll('[data-value],[data-caption],[data-mark="wordmark"],[data-echo]'))
    for (const w of words(el)) if (headWords.has(w)) dup.push(w);
  const digits = [...document.body.textContent.matchAll(/\d+/g)].map(x => x[0]);
  const dupDigits = digits.filter((d,i) => digits.indexOf(d) !== i);

  let fitFail = [];                                                     // R4: text inside a shape
  for (const el of document.querySelectorAll('[data-fit]')) {
    const box = document.getElementById(el.dataset.fit).getBoundingClientRect();
    const r = el.getBoundingClientRect(), padX = box.width*0.1, padY = box.height*0.1;
    if (r.left < box.left+padX || r.right > box.right-padX ||
        r.top < box.top+padY || r.bottom > box.bottom-padY) fitFail.push(el.dataset.fit);
  }

  const clipped = [];                                                   // R16: nothing cut by any box
  for (const el of marks) {
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
      clipped.push(el.dataset.mark + ':self');
    const r = el.getBoundingClientRect();
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflow === 'visible') continue;
      const b = a.getBoundingClientRect();
      if (r.left < b.left - 1 || r.right > b.right + 1 ||
          r.top < b.top - 1 || r.bottom > b.bottom + 1) clipped.push(el.dataset.mark + ':ancestor');
    }
  }
  const subjEl = document.querySelector('[data-mark="subject"]');       // R18: no plate behind a glyph
  let plated = false;
  if (subjEl) for (let a = subjEl.parentElement; a && a !== document.body; a = a.parentElement) {
    const cs = getComputedStyle(a);
    const painted = cs.backgroundImage !== 'none' ||
      !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
    if (painted && a.getBoundingClientRect().width < W * 0.9) plated = true;
  }
  const skeleton = marks.map(el => {                                    // R21: layout fingerprint
    const r = el.getBoundingClientRect(), q = v => Math.round(v * 20);
    return `${el.dataset.mark}:${q(r.left/W)},${q(r.top/H)},${q(r.width/W)},${q(r.height/H)}`;
  }).sort().join('|');

  const figs = [...document.querySelectorAll('[data-figure]')];         // R7, R8: labelled figures
  const unlabelled = figs.filter(f => f.querySelectorAll('[data-value]').length < 2 &&
    !(f.querySelector('[data-value]') && f.querySelector('[data-caption]'))).length;
  const uncaptioned = figs.filter(f => !f.querySelector('[data-caption]')).length;

  const subj = document.querySelector('[data-mark="subject"]');
  let clearance = 1;
  if (subj) {
    const s = subj.getBoundingClientRect();
    for (const r of lines) {
      const dx = Math.max(s.left - r.right, r.left - s.right);
      const dy = Math.max(s.top - r.bottom, r.top - s.bottom);
      clearance = Math.min(clearance, Math.max(dx, dy) / W);   // negative = overlapping
    }
  }
  return { over, spanX: (x1-x0)/W, spanY: (y1-y0)/H, voidBlock,
           headW: head.width/W, headH: head.height/H,
           gapMin, gapSpread, lineOver, clearance,
           dup, dupDigits, fitFail, unlabelled, uncaptioned,
           clipped, plated, skeleton };
});
```

The gate, and a variant that fails any part of it is fixed and re-rendered or dropped — never shipped:

| Field | Passes when | Rule |
| --- | --- | --- |
| `over` | empty | R1 |
| `gapMin` | at least 0.06 | R2 |
| `gapSpread` | at most 0.08 | R2 |
| `lineOver` | 0 | R2 |
| `clearance` | at least 0.02 | R3 |
| `fitFail` | empty | R4 |
| `dup`, `dupDigits` | both empty | R5, R6 |
| `clipped` | empty | R16 |
| `plated` | false | R18 |
| `skeleton` | unique across the set | R21 |
| `unlabelled` | 0 | R7 |
| `uncaptioned` | 0 | R8 |
| `spanX`, `spanY` | at least 0.8 | R11 |
| `voidBlock` | false | R11 |
| `headW`, `headH` | at least 0.7 and 0.22 | R11 |

The typesetting fields are the ones that catch what a contact sheet does not. `gapSpread` is the leading rhythm: the gaps between consecutive line boxes may differ by no more than 8 percent of a line's height, so a line set at a different size, wrapped in a slab or knocked out of a block still sits on the same rhythm as its neighbours — which is exactly where a slab line, whose box is taller and wider than its text, breaks a headline that looked fine in the markup. `lineOver` catches the same slab pushing past the safe margin, since its padding is part of its width and a line that fits without it does not fit with it. `clearance` is the gap between the type and the subject: 2 percent of the canvas at the narrowest point, and a negative value means the headline is sitting on the emoji.

Two notes on running it. Read the rects after fonts have settled — `await document.fonts.ready` before the evaluate, or a wide headline measures short and passes a check it should fail. And `getBoundingClientRect` covers transforms and layout but not a `filter: blur()` halo or a large `box-shadow`; where a blurred blob is doing background work, leave it untagged, since a background is allowed to cross the edge and only marks are being measured.
