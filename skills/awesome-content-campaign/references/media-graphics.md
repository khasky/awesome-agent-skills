# Self-made graphics — HTML/CSS rendered locally

The fallback for posts that need an image and have none. It uses only what is already on the machine: a self-contained HTML file styled with CSS and screenshotted through the browser automation the campaign already has. **No image-generation service, no API key, no upload of the user's content anywhere.**

## When this path runs

Offered, never automatic — the user says yes per campaign or per post:

- A platform the Media column of `platforms.md` marks **required** is selected, and the media library cannot cover its posts.
- A post's content is genuinely structural — steps, a comparison, a framework, a single number, a short quotation from the sources — and would read better as an image than as more text.

It does **not** run where the requirement is video (`tiktok`, and `youtube` uploads): this path produces a still image, and a still is not a video. A campaign that selected those platforms with no video stays honest — recommend dropping them rather than shipping unpostable drafts.

Photographic or illustrative imagery is also out of scope. What this produces is typographic: text, rules, boxes, a number. Said plainly to the user, so nobody expects a rendered scene.

## What to build

Pick the shape from the post's own content, not from a template rotation:

| Post content | Shape |
| --- | --- |
| An ordered process | Numbered steps, one line each, generous leading |
| Two options weighed | Two columns, one criterion per row, the verdict visible |
| One measurement | The number at display size, its condition below it in small type |
| A named framework or checklist | Boxed list, no more than six items |
| A sentence worth quoting from the sources | The quotation set large, attribution small, nothing else |
| Anything longer | Not a graphic. Leave the post text-only |

Hard content rules: every word on the image comes from the knowledge map, exactly as the map states it; no invented metrics, no fake product screenshots, no mocked-up testimonials or star ratings, no logos of companies the sources do not connect to the product. An image is a claim surface like any other sentence in the campaign.

## Building it

One self-contained `.html` file per graphic in `content-campaign/<slug>/media/src/`, and one rendered `.png` beside the other media in `content-campaign/<slug>/media/`.

- **Self-contained means offline**: no CDN stylesheet, no web font, no remote image, no script that fetches. A rendering machine without network access must produce the same file. Fonts come from a system stack (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`); a font the user names and has installed locally is fine.
- **Size the canvas to the platform**, from the Phase 3 research rather than memory — the aspect ratios in play are the vertical feed image, the square, and the link-preview landscape. Set the body to exact pixel dimensions and render at 2× device scale so text stays sharp after the platform recompresses it.
- **Legible at thumbnail size**: body text no smaller than about 3% of the canvas height, strong contrast, wide margins. Read it at 25% zoom before accepting it — if the words blur, there are too many of them.
- **Brand colours** when the user has them (from the interview or the knowledge map); otherwise one accent colour and neutrals. Two typefaces at most, and one is enough.

Render with the browser automation already in use:

```js
await page.setViewportSize({ width: W, height: H });
await page.goto('file:///absolute/path/to/graphic.html');
await page.screenshot({ path: 'media/<name>.png', scale: 'device', animations: 'disabled' });
```

An installed headless-browser CLI or `wkhtmltoimage` is an acceptable substitute — verify it exists first (`--version` exits 0) and say which was used. None available and no browser bridge → say so and leave the post without an image rather than promising one.

## After rendering

- Verify the file exists, its pixel dimensions match the target, it opens, and its size is sane for the platform's limits from Phase 3. A graphic that fails any of these is fixed or dropped, never assigned unverified.
- Write alt text describing what the image *says* — the steps, the numbers, the comparison — not "an infographic about the product".
- Record in the manifest that the asset was generated rather than supplied, and keep the `.html` source: the user can edit and re-render it without this skill.
