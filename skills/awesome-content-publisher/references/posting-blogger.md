# blogger

Check: `blogger.com` signed in redirects to `/blog/posts/<blogId>`, with the blog selector (`listbox "Blog Selection"`) and the `New Post` button in the drawer; signed out lands on the Google sign-in page. The blog's public address is in the page as `<name>.blogspot.com` and is the read-back base.

Compose: `New Post` opens `/blog/post/edit/<blogId>/<postId>` and creates the draft immediately (the page says `Creating new post...`), so an abandoned editor is a draft in the Posts list under the `Draft` filter: finish or delete it before retrying, or the blog ends with two of the same article. `textbox "Title"` is the title. The body is the Compose view, a contenteditable inside an iframe, with the `Toggle view` listbox switching to `HTML view`. Typed markdown stays literal in Compose view, so a formatted article goes in through HTML view as HTML, headings and links included; the toolbar's `Insert or Edit Link`, `Insert image` and `Insert video` controls cover the Compose route when needed. The image goes in through `Insert image` at the top of the body.

Post settings sidebar: `Labels` (comma-separated, with suggestions from the blog's existing labels), `Published on` (a future date schedules), `Permalink` (custom slug), `Location`, `Options`. `Publish` is the top-right button; `Preview` beside it opens a new tab. The labels come from the post's `hashtags` list, mapped to existing labels where they match.

Read-back: `<name>.blogspot.com`, newest post at `/<yyyy>/<mm>/<slug>.html`; confirm the title, the headings rendered as headings and the image.
