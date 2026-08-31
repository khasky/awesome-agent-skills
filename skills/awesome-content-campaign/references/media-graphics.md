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

**The test before accepting a graphic:** cover the words and look at it. If nothing remains, it was a text card and it fails. Second test: if a reader could get the post's content from the image alone, there are too many words on it.

## What to build

Pick the shape from what the post's idea *does*, not from a template rotation:

| What the post is about | What the image shows |
| --- | --- |
| Two things in tension, a trap, a "looks fine but isn't" | One canvas split in two, each half a plain shape, the difference carried by colour or position |
| Something contained, isolated, sandboxed | A box inside a box, or two boxes that do not touch, one word each |
| A flow or a handoff between parties | Two or three blocks and the arrows between them, one word per block |
| A process with an order that matters | Nodes on a line, the interesting one highlighted, a word each |
| One measurement worth the post | The number at display size, filling the canvas, one short condition beside it |
| A collision, a conflict, an overwrite | Two shapes overlapping, the overlap in the accent colour |
| Scale or proportion | Two bars, two circles, two stacks, sized to the real ratio |
| Anything that needs a sentence to land | Not a graphic. Leave the post text-only |

Craft that separates an eye-catching graphic from a slide: one accent colour against neutrals, and the accent used once, on the thing that matters; large shapes with real negative space around them; a deliberate composition rather than centred everything; contrast strong enough to survive a dark feed and a bright one. Inline SVG is allowed and preferred for the shapes, since it stays self-contained. Gradients, blurs and shadows are allowed when they are doing work.

Hard content rules: whatever few words appear come from the knowledge map, exactly as the map states them; the diagram may not assert a relationship the sources do not carry; no invented metrics, no fake product screenshots, no mocked-up testimonials or star ratings, no logos of companies the sources do not connect to the product. An image is a claim surface like any other sentence in the campaign.

## Building it

One self-contained `.html` file per graphic in `content-campaign/<slug>/media/src/`, and one rendered `.png` beside the other media in `content-campaign/<slug>/media/`.

- **Self-contained means offline**: no CDN stylesheet, no web font, no remote image, no script that fetches. A rendering machine without network access must produce the same file. Fonts come from a system stack (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`); a font the user names and has installed locally is fine.
- **One graphic serves every platform that takes one.** The image is made for the post, not for a single network: render it once, attach it wherever the Media column says `optional` or `required`, and let it be the cover image on the article platforms. Render a second variant only when a platform's verified aspect ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses.
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
