# mataroa

Check: `<blog>.mataroa.blog` signed in shows a top navigation with `View blog | Dashboard | New post`; `mataroa.blog/blog/` redirects to the account's blog.

Compose: `New post` opens `mataroa.blog/new/post/`, a plain form: `textbox "Title"`; `Publication date` in `YYYY-MM-DD` (pre-filled with today, an empty value keeps a draft, a future date schedules, and `set as draft` clears it); `Content (supports markdown)` textarea, images by dragging into it; `Save`. Markdown is the input here, so the post file's body goes in as written. Read the slug off the published page; it derives from the title and is editable afterwards.

Read-back: `<blog>.mataroa.blog/blog/<slug>/`; confirm the headings rendered and the links are live.

The image goes in by drag-and-drop, and the editor says so in a line under the textarea: *"Attach images by dragging & dropping."* There is no file input and no upload button. Put the caret on an empty line at the very top of the textarea (above the first body line), then drop the file on the textarea; mataroa uploads it and writes the markdown for you in place, as `![mataroa.png](https://<blog>.mataroa.blog/images/<hash>.png)`. Confirm that line exists and that it is the first line of the content before saving, and confirm the `img` on the published page. A run that only looked for `input[type=file]` shipped the post with no picture at all.

Bare URLs are not links here. Mataroa renders standard Markdown and does not autolink, so `https://api-docs.deepseek.com/` typed as text publishes as text — one run shipped five dead reference URLs that way. Every link in the body is written as Markdown before it goes in: `[label](https://example.com/)` where the post has a label, or the angle-bracket form `<https://example.com/>` where the URL is its own visible text. Check the published page for one `a[href]` per URL the source carries, list items included.

The footer collapses to one line for the same reason it does on a gist: bare newlines inside a Markdown paragraph are spaces. Append two trailing spaces to every footer line but the last before filling the textarea, and confirm three lines on the published page.
