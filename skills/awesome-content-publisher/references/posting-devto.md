# devto

Check: `dev.to` — avatar / "Create Post" button. Compose: `dev.to/new` opens the markdown editor as a single `#article_body_markdown` textarea with no separate title or tag fields and a button that reads "Save changes" rather than Publish. Everything is front matter, and `published: true` is what makes "Save changes" publish rather than draft:

```text
---
title: <title>
published: true
tags: tag1, tag2, tag3, tag4
---

<body>
```

Type the whole block into the textarea (Ctrl+A, Backspace first — the editor restores an old draft), then click "Save changes". Read-back: the editor navigates straight to `dev.to/<handle>/<slug>-<id>`, which is the permalink; confirm the body renders and the author line is the user. Smooth flow, no actionability fights.

Upload the image first, then write the front matter around its URL — and take that URL from the upload widget, never from the page HTML. `input#image-upload-field` (`accept="image/*"`) takes the file with `setInputFiles`. Once it finishes, dev.to renders the ready-made markdown into a copyable `input` sitting under the upload field, in the form `![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/<id>.<ext>)`. Read that input's `value` and parse the URL out of it:

```js
const md = [...document.querySelectorAll('input,textarea')].map(x => x.value || '')
  .find(v => /^!\[.*\]\(https:\/\/dev-to-uploads\./.test(v));
const url = md.match(/\((https:[^)]+)\)/)[1];
```

Do not regex the page HTML for a CDN pattern. A regex like `/https:\/\/dev-to-uploads\.s3\.amazonaws\.com\/uploads\/articles\/[\w.-]+/` matches the *first* such URL in the document — a foreign asset belonging to another article in the editor shell — and publishes that image as both the cover and the in-body picture while the upload itself worked. Two details make the mismatch invisible to that kind of regex: the real host is `s3.us-east-2.amazonaws.com` (not the bare `s3.amazonaws.com` other assets use), and the file keeps its original extension, so a JPEG upload yields `.jpg`, not `.png`.

Whatever URL you end up with, prove it is yours before publishing: open it and check the pixel dimensions against the source file. That single check would have caught this.

That URL goes in `cover_image:` in the front matter, and the body starts on its first paragraph:

```text
---
title: <title>
published: true
tags: tag1, tag2, tag3
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/<id>.png
---

<body>
```

Confirm on the published page that the cover renders once and the body opens on its first paragraph. dev.to's cover has no alt field, so record `adapted: no alt on cover`.

Proving the uploaded URL is yours without leaving the editor: load it as an `Image()` inside `page.evaluate` and read `naturalWidth`/`naturalHeight` off the `onload`. That compares against the source file's dimensions in one call and costs no navigation, so the draft stays intact.

```js
await page.evaluate(async (url) => await new Promise(res => {
  const im = new Image();
  im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight });
  im.onerror = () => res({ err: 1 });
  im.src = url;
}), url);
```

A `cover_image` and a picture at the top of the body are two copies of the same image. dev.to renders the frontmatter's `cover_image` above the title, so a body that also opens on the campaign image publishes it twice, one above the other. Where the front matter carries `cover_image`, the body starts on its first paragraph; where it does not, the image belongs at the top of the body. Check which of the two is in play before filling, and confirm on the published article that the image appears exactly once.
