# bluesky

Check: `bsky.app` — compose button. Compose: new post, type, attach; paste links plainly for the link card. Read-back: own profile feed.

The compose button defeats every click form. `browser_click` on its `aria-ref` times out on actionability, a coordinate click on the inline "What's up?" box does nothing, and `?compose=true` mounts no dialog. Focus+Enter opens *an* editor that is not the composer, so typing into the first `[contenteditable="true"]` lands nowhere. What works, first try: navigate to `https://bsky.app/intent/compose?text=<encodeURIComponent(body)>` — the composer opens prefilled, the character count is already correct, and the submit control is `aria-label="Publish post"` (coordinate click on it works). Read-back: `bsky.app/profile/<handle>` where the newest `/post/<rkey>` link is the new one; the handle comes from the last `a[href^="/profile/"]` in the nav, since the first one belongs to whichever feed post is on screen.

The profile page is not a source of record, and the API is not the way around that. `bsky.app/profile/<handle>` rendered zero `a[href*="/post/"]` through scrolling and re-queries while the account had seven posts — but `public.api.bsky.app` is Bluesky's own endpoint answering from an automation context, and calling it is exactly what the Core principle forbids, whatever the page itself happens to be doing. What the page gives instead is enough: the profile header's own posts counter, taken before composing and required to read exactly +1 afterwards, then the newest `/post/<rkey>` permalink opened and audited for text, image and a live link. Where the counter and the feed disagree, the entry stays `unverified` and is re-checked later; that disagreement is never a licence to submit again.

The intent route leaves the address bar on `bsky.app/` while mounting the composer. Judge by `[role="dialog"]` carrying a `[contenteditable]` with the prefilled text and an `aria-label="Publish post"` button, never by `location.href` — a run that checked the URL concluded the composer had not opened and started hunting for a media button in the page header.

The composer already holds one attachment before you add anything: Bluesky auto-generates a link card for a URL in the text, and it carries its own `Remove attachment` control. Attaching an image replaces that card — the URL stays a real link through the post's facet, but the preview is gone. That is a trade to make deliberately and record, not a duplicate to fix.

`Add media to post` opens the native chooser, which the MCP server parks. The first click at a rect read a moment earlier did nothing; re-read the rect and hit-test immediately before clicking, then answer the parked chooser with `browser_file_upload` from an allowed root.

The composer dialog mounts before it is usable. For a second or two it carries `opacity: 0` and its rect keeps moving as the panel settles, so a click computed from the first read lands on nothing and reports success — two attempts went that way in one run. Read the rect twice, require two consecutive reads to agree and the computed opacity to be 1, and only then click inside it.

An attachment probe that counts `blob:` or CDN `img` sources reports zero on a composer that is holding the picture, because Bluesky paints the thumbnail as a CSS background. The proof that the image attached is the `Remove image` control by its `aria-label`, with a screenshot as the fallback.

A post-submit poll can park for the tool's whole budget with nothing to report — one waited 120 seconds on the dialog closing and had to be killed. Submit once, then read the profile counter; do not poll the composer.
