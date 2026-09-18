# teletype

Driven end to end on a live blog. The selectors below were measured; the notes further down that predate that run are marked where they still apply.

Check: `teletype.in/@<handle>` while signed in renders the blog with a `New article` control and counters for Scheduled, Hidden, Drafts and posts — that post count is the read-back baseline. `New article` opens `teletype.in/@<handle>/editor`, and the draft gets its own id in the URL (`/editor/<id>`) as soon as the first content lands.

Two contenteditable divs, no inputs: `div.editor.m_line` is the title (placeholder *Title of the post*) and `div.editorPage__text.editor` is the body (placeholder *Your post goes here...*). Both take `pressSequentially`; the body also takes an HTML paste, which is the cheap route for a long article.

The HTML paste keeps the structure and drops the links. A single `paste` carrying `text/html` produced `h2`, `p`, `pre` and `ul`/`li` exactly as sent, and gave every node the editor's own `node-id` and `data-anchor` attributes. `<strong>` survives as `<span class="bold">`. `<a href>` does not survive: it arrives as `<span class="link">` with **no href at all**, and that stripped span is worse than plain text, because the link toolbar then opens in edit-an-existing-link mode and writes nothing. Remove the leftover span before linking — select its contents and retype the words with real keystrokes — then apply the link to the plain text.

The link control is the chain icon in the fixed top toolbar, and its input is `input.editorInlineToolbar__link_input`. Not `input.editorEmbedToolbar__field.m_link`, which is a different control for iframe embeds and sits off-screen at a negative `y` while looking visible to an `offsetParent` check — a run that typed into it lost two attempts. Sequence: select the words → click the chain icon → click the input at its live rect → `Control+a`, `Delete` (it keeps whatever a previous attempt left, and typing into it interleaves with the old value character by character) → type the URL → `Enter`.

The editor never shows an `a[href]`, and that is not a failure. Links live in the editor's own model as `span.link`; the real anchor is rendered only on the published page. Assert the anchor there, not in the composer — a run that judged the composer concluded three times that the link had not taken when it had.

Images go through the block toolbar, not through a page-wide file input. `setInputFiles` on the `input[type=file]` that sits on the page does nothing. Open the block menu on an empty block (`.editorBlockToolbar__open`), whose entries are Heading 2 · Heading 3 · Bulleted list · Numbered list · Quote · Callout · Code · Divider · Table of Contents · Image · Hashtag · Iframe · YouTube · Vimeo · Rutube. `Image` opens the OS file chooser, answered with `browser_file_upload`; the file lands on `img2.teletype.in` and becomes a `figure` block. For the picture at the top: caret at offset 0 of the first paragraph, `Enter`, `ArrowUp`, then the block menu.

Publish is the round arrow at the top right (`title="Publish"`), which opens *Post settings for publishing*: Post Privacy (Public · Hidden · Drafts · Auto Publishing), an SEO crawl toggle, a `URL-friendly Link` field pre-filled with the draft id, and the Teletype preview. Set the slug here — the default is the random draft id and it ships as the permalink otherwise. `Publish Now` commits and lands on `teletype.in/@<handle>/<slug>`.

The source's hashtag footer is dropped for this platform. Teletype has blog categories, not tags, so a `#tag` line in the body indexes nothing and reads as an import from elsewhere.

Check: `teletype.in` — a signed-in session shows the account's blog and the `New article` control; signed out offers third-party sign-in buttons instead, and a login is never automated. Compose: `New article` opens the editor, a title line above a body area. The target names the blog when the account writes to more than one; confirm which blog the editor is writing into before the body goes in.

Classify the editor before typing a body into it. It is a rich editor, so the question is only whether typed markdown converts: put one `## ` heading in, look at what it became, and go from there — converted means the source's markdown can be typed as written, literal hashes mean plain text plus a formatting pass on each selection, the way `patreon` is handled (`post-formatting.md`). Never publish a body still holding literal `##` or `**`.

A pasted URL is not guaranteed to become a link, the same trap as `medium` and `substack`: after the body is in, confirm the closing link is a real anchor and apply the editor's own link control to the words when it is not.

Topics are the blog's own categories rather than hashtags, and they are assigned in the editor, in the same pass as the body — not after publishing. A post file's `hashtags` list maps to them where the blog already has a matching category; it never creates new categories on the blog, which is a change to the user's own publication.

An interrupted run leaves a draft here rather than nothing. Before restarting a post, open the Drafts list and finish or discard the existing one — a retry that ignores it is how the blog ends up with two of the same article.

Read-back: open the published article's URL and confirm the title, the body, the image and that the headings rendered as headings.
