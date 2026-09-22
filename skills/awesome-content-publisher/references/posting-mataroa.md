# mataroa

Check: `<blog>.mataroa.blog` signed in shows a top navigation with `View blog | Dashboard | New post`; `mataroa.blog/blog/` redirects to the account's blog.

Compose: `New post` opens `mataroa.blog/new/post/`, a plain form: `textbox "Title"`; `Publication date` in `YYYY-MM-DD` (pre-filled with today, an empty value keeps a draft, a future date schedules, and `set as draft` clears it); `Content (supports markdown)` textarea, images by dragging into it; `Save`. Markdown is the input here, so the post file's body goes in as written. Read the slug off the published page; it derives from the title and is editable afterwards.

Read-back: `<blog>.mataroa.blog/blog/<slug>/`; confirm the headings rendered and the links are live.

The image goes in by drag-and-drop, and the editor says so in a line under the textarea: *"Attach images by dragging & dropping."* There is no file input and no upload button. Put the caret on an empty line at the very top of the textarea (above the first body line), then drop the file on the textarea; mataroa uploads it and writes the markdown for you in place, as `![mataroa.png](https://<blog>.mataroa.blog/images/<hash>.png)`. Confirm that line exists and that it is the first line of the content before saving, and confirm the `img` on the published page. A run that only looked for `input[type=file]` shipped the post with no picture at all.

Bare URLs are not links here. Mataroa renders standard Markdown and does not autolink, so `https://api-docs.deepseek.com/` typed as text publishes as text — one run shipped five dead reference URLs that way. Every link in the body is written as Markdown before it goes in: `[label](https://example.com/)` where the post has a label, or the angle-bracket form `<https://example.com/>` where the URL is its own visible text. Check the published page for one `a[href]` per URL the source carries, list items included.

The footer collapses to one line for the same reason it does on a gist: bare newlines inside a Markdown paragraph are spaces. Append two trailing spaces to every footer line but the last before filling the textarea, and confirm three lines on the published page.

**The drop can be driven, and it is worth driving.** Build a `File` in the page from the image's bytes (base64 into a `Uint8Array`), add it to a `DataTransfer`, and dispatch `dragenter`, `dragover` and `drop` on `#id_body`. Mataroa accepts the drop and answers it, which is more than several composers with real file inputs manage.

**What it answers may be a refusal, and the refusal is a native `alert`:** `Image could not be uploaded. File too big. Limit is 1MB.` A 1600x900 PNG from a campaign runs around 1.2 MB, so this limit binds on most full-size images rather than being an edge case. Either the post file ships a copy under the limit, or the entry references an address from a platform earlier in the run (see the image-URL fallback in `browser-interaction.md`) and the run records which host it now depends on.

**The rest of the form is plain HTML and takes `fill()` directly:** `#id_title`, `#id_published_at` (pre-filled with today), `#id_body`, and the `Save` submit. Saving redirects straight to `<blog>.mataroa.blog/blog/<slug>/` with the slug derived from the title, which is the read-back page.

The 1MB limit binds before the drop is worth attempting: check the file's size on disk first, and where it is over, write the Markdown image line yourself against an address from a platform that has already published this run, as the first line of the body. Two more things the body needs here, both invisible until the page is live: the source's leading `# Title` duplicates the title field and is dropped, and every bare URL is wrapped in angle brackets (`<https://example.com/>`) before the textarea is filled, because mataroa renders CommonMark and CommonMark does not autolink.
