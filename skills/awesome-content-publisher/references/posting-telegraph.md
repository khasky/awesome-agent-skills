# telegraph

Check: nothing to check — `telegra.ph` has no account. Compose: `telegra.ph` itself, three fields in one page (title, author, body). Publish gives a permanent URL.

The body is a rich-text editor, so markdown is not typed in — it is applied. Pasting `## Where it breaks` publishes those hash characters as visible text, which is the single most common way an article lands here looking like a raw file. Type the heading's words as an ordinary paragraph, select the line, and use the floating toolbar that appears over a selection (or the matching keyboard shortcut) to set it. The format allows exactly two heading levels, `h3` and `h4`: map the post file's `##` to `h3` and `###` to `h4`, and never invent a third. Bold, italic, blockquote, ordered and bulleted lists, `code`, `pre` and a horizontal rule are the rest of what the page accepts. Links are inserted through the link control on a selection, never written as `[text](url)`.

Editing is bound to the browser that published, through a token in that browser's local storage, so a page created in this session cannot be edited later from anywhere else; say so when a post goes here. There is no feed, no audience and no discovery, so a Telegraph page only makes sense as something another post links to.

Read-back: open the returned `telegra.ph/<slug>` and confirm title and body — and confirm the headings rendered as headings. A page whose body shows `##` in the text is a failed publish: it is editable only from this same browser, so fix it in the session that made it or it stays wrong permanently.
