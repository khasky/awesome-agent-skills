# mastodon

Check: `https://<instance-from-frontmatter>/home` — the compose column renders the handle, the visibility control ("Public, quotes allowed") and the live character budget. Compose: `textarea.autosuggest-textarea__textarea` (placeholder "What's on your mind?"), coordinate-click and type; submit is the button labelled "Post". The textarea empties on success. The whole flow works first try — no actionability fights, no intent route needed.

Read-back: `https://<instance>/@<handle>`, newest `/@<handle>/<numeric-id>` link. Mastodon shortens the displayed URL ("code.claude.com/docs/en/cross-…"), so a tail comparison against the page text fails on a post that is perfectly intact — open the permalink and compare the `a[href]` of the link instead, which carries the full URL.

The submit is `.compose-form button.button--compact`. A page-wide sweep for a button whose text is `Post` and taking `.pop()` picks the navigation's own Post entry instead, and clicking that does nothing — which is what made an earlier run report the composer unsubmittable. Scope the query to `.compose-form`.

When the attachment has no description, Post opens a confirmation instead of publishing. The modal reads "Add alt text? Your post contains media without alt text." with `Cancel` / `Post anyway` / `Add alt text`. Until it is answered the composer keeps its text, the Post button keeps looking enabled and untouched, and every further click is swallowed — an element-handle click times out on actionability because the modal owns the pointer. The composer's own state is not the tell here; a screenshot is. Where the post file declares no alt, answer Post anyway and record the post `degraded`; never invent a description to clear the dialog.

The compose form also states the remaining budget as a bare number (`500` empty, `62` for a 455-character body with one URL), which is the cheap way to confirm the text landed.

The textarea takes text only through an in-page focus followed by `insertText`. A coordinate click and then `keyboard.type` left it at length 0 while the composer looked focused and ready — the same shape as the Bastyon editor. Use `el.focus()`, `el.setSelectionRange(0, el.value.length)`, then `page.keyboard.insertText(body)`, and confirm with the remaining-budget number before going on.

A body that ends in a hashtag line leaves the autosuggest dropdown open over the composer, and that dropdown owns the pointer where the attachment's `Edit` control sits — the alt-text step then reports the button missing, or the click selects a suggested tag instead. Press `Escape` once after the text is in, confirm the dropdown is gone, and only then open the media editor.
