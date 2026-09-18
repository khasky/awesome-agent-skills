# mataroa

Check: `<blog>.mataroa.blog` signed in shows a top navigation with `View blog | Dashboard | New post`; `mataroa.blog/blog/` redirects to the account's blog.

Compose: `New post` opens `mataroa.blog/new/post/`, a plain form: `textbox "Title"`; `Publication date` in `YYYY-MM-DD` (pre-filled with today, an empty value keeps a draft, a future date schedules, and `set as draft` clears it); `Content (supports markdown)` textarea, images by dragging into it; `Save`. Markdown is the input here, so the post file's body goes in as written. Read the slug off the published page; it derives from the title and is editable afterwards.

Read-back: `<blog>.mataroa.blog/blog/<slug>/`; confirm the headings rendered and the links are live.
