# telegraph

Check: nothing to check — `telegra.ph` has no account. Compose: `telegra.ph` itself, three fields in one page (title, author, body). Publish gives a permanent URL.

The body is a rich-text editor, so markdown is not typed in — it is applied. Pasting `## Where it breaks` publishes those hash characters as visible text, which is the single most common way an article lands here looking like a raw file. Type the heading's words as an ordinary paragraph, select the line, and use the floating toolbar that appears over a selection (or the matching keyboard shortcut) to set it. The format allows exactly two heading levels, `h3` and `h4`: map the post file's `##` to `h3` and `###` to `h4`, and never invent a third. Bold, italic, blockquote, ordered and bulleted lists, `code`, `pre` and a horizontal rule are the rest of what the page accepts. Links are inserted through the link control on a selection, never written as `[text](url)`.

Editing is bound to the browser that published, through a token in that browser's local storage, so a page created in this session cannot be edited later from anywhere else; say so when a post goes here. There is no feed, no audience and no discovery, so a Telegraph page only makes sense as something another post links to.

Read-back: open the returned `telegra.ph/<slug>` and confirm title and body — and confirm the headings rendered as headings. A page whose body shows `##` in the text is a failed publish: it is editable only from this same browser, so fix it in the session that made it or it stays wrong permanently.

The editor is Quill 1.x, and that decides every mechanic below.

**A dispatched `paste` does nothing on its own.** Quill's handler focuses its hidden `.ql-clipboard`, waits a tick, and converts whatever the *browser* placed there - which a synthetic event never does, so the call returns cleanly and the body stays empty. Seed the container yourself: set `.ql-clipboard` `innerHTML` to the HTML, then dispatch the `paste` on `.ql-editor`. One call converted seven `h3`, three `pre`, two anchors, a list and a rule, with the caret placed in the body paragraph first.

**Title, author and body are three blocks of one editor** (`h1[data-placeholder="Title"]`, `address`, then paragraphs), so an `insertText` lands in whichever block last held the caret - an author name typed without re-placing the caret prepends itself to the title. Select a block with a Range over its contents before retyping it. `Home` plus `Shift+End` takes one *visual* line, so a title that wraps keeps its tail: one run published a title ending `Read CloselyClosely` that way.

**Adjacent `pre` blocks merge, and a trailing newline inside one is trimmed.** Three consecutive fenced blocks in the source publish as a single box with no separator between the tables. Nothing in the format prevents it. Either accept the merge where each table carries its own header line, or have the post file put a sentence between consecutive code blocks.

**The image button does not open a chooser.** `#_image_button` in `#_tl_blocks` was clicked three ways - by coordinate, by `el.click()`, and on a freshly created empty block with the toolbar confirmed `shown` - and no file chooser was parked and no upload request followed any of them. Budget one attempt and publish text-only with a `degraded` line. That choice is final in a way it is not elsewhere: a Telegraph page is editable only from the browser that created it, so nobody can add the picture later from another machine.

**The draft persists in local storage across reloads**, so a second attempt opens with the first attempt's title already sitting in the `h1`. Clear the block before retyping rather than assuming an empty editor.

**The page carries no `input[type=file]` at all**, which settles the image question in one call rather than three clicks: query the whole document for file inputs, find none, and go straight to publishing text-only with the `degraded` line. The format's two heading levels also mean the converter emits `h3` and `h4` directly - a payload built with `h2` for the source's `##` arrives as something Quill has to remap, and mapping it before the paste is one less thing to verify.
