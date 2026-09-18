# buymeacoffee

Check: `studio.buymeacoffee.com/posts`, not `buymeacoffee.com` — the marketing homepage shows "Log in / Sign up" to a fully signed-in user, so checking there reports a false logged-out. The studio page also carries the read-back baseline: a "Published N" counter.

Compose at `www.buymeacoffee.com/posts/create` — the `www.` is load-bearing. Navigating to `buymeacoffee.com/posts/create` without it bounces to `/login` even with a live studio session, which one run read as "the main domain has no session" and skipped the platform. The studio's own Create control points at the `www.` form; follow that link (or type it) and the editor opens signed in. Also not `studio.buymeacoffee.com/posts/new`, which is a different, unusable editor.

Getting either of these wrong is what made this platform look unpublishable. The two routes are different editors. The `studio…/posts/new` one carries `#post-title`, a `.pe-editor` ProseMirror, a `.post-editor-sidebar`, hidden state flags (`#is_title_typing`, `#publish-status`) and a reCAPTCHA frame, and its publish never fires under automation — the `Publish now / Set publish date / Save as draft` dropdown stays `display:none` however it is clicked, and the string "Add a title to your post before continuing" sitting on the page is a permanent hover tooltip rather than a validation state, so it reads like a blocked form when nothing is blocked. Do not debug that page. Reach the working editor by pressing `Post` under "Create a new post" on `studio.buymeacoffee.com/posts`, or go straight to `buymeacoffee.com/posts/create`.

The working editor, verified end to end:

- Title: `input[placeholder="Title"]` — no id, ordinary click-and-type works.
- Body: `div.tiptap.ProseMirror` — a TipTap editor. Coordinate-click it, then type paragraph by paragraph with `Enter` between; the breaks survive and emoji arrive intact.
- Toolbar: ten `button.option-button` icons in a row under the title, unlabelled in the DOM (no `aria-label`, no `title`, only path data) but ordered Bold · Italic · Underline · Link · Heading · Bullet List · Block Quote · Image · Embed · Code Block. Take them by index off `document.querySelectorAll('button.option-button')`, and re-read the rect immediately before every click — a `scrollIntoView` on the body moves the toolbar off its earlier coordinates, and a click at a stale `y` silently hits nothing. Hovering a button surfaces its name if the order ever changes.
- Publish: a plain `button` reading `Publish now`, top right. No dropdown, no second modal, no category requirement, and no validation warning once title and body are filled.
- Audience: the sidebar reads "Who can see this post?" with `Public` selected; read it back before submitting.

Image (index 7). Clicking it opens a file chooser, but the page also carries one `input[type=file][accept="image/*"]` that `setInputFiles` drives directly, which avoids the chooser entirely. TipTap inserts at the caret, so press `Control+Home` first when the picture belongs at the top — which for a supporter post it does. The upload returns a `cdn.buymeacoffee.com/uploads/project_updates/…` URL and the image lands as its own block above the text.

Link (index 3). Select the words with a Range over the text node — `range.setStart/setEnd` on the URL substring, then `selection.addRange` — click the Link button, and a popover appears carrying `input[placeholder="Enter a URL..."]`. Type the address and press `Enter`; the selection becomes a real `<a href>`. Skip this and the closing URL publishes as dead text.

TipTap does honour a programmatic Range here, unlike Medium — but two things still go wrong. Inserting the image scrolls the page, so the toolbar leaves the viewport and a click at its old coordinates hits nothing: scroll back to the top, re-establish the Range (scrolling drops the selection), re-read the toolbar rect, then click. And `End` moves to the end of the *visual line*, not the paragraph, so on a wrapped paragraph a `Shift+ArrowLeft × len` selection grabs the wrong span — the Range over the text node is what makes this exact.

Read-back: back on `studio.buymeacoffee.com/posts`, the Published counter must go up by exactly one and a row for the title must appear with its visibility beside it ("Public"). Then open the `buymeacoffee.com/<handle>/<slug>` permalink and confirm the three things this composer can lose: the closing URL is an `<a>` rather than text, an `img` from `cdn.buymeacoffee.com` sits in the body, and no `�` replacement character survived anywhere.

The HTML paste works on this TipTap and is much cheaper than the toolbar route. Dispatching a `paste` event carrying `text/html` into `div.tiptap.ProseMirror` produced 5 headings, 9 code blocks and both links as real anchors in one call — no per-paragraph typing, no Range selection, no Link button at index 3. The toolbar recipe above remains the fallback for a body that has to be assembled in place.

Order that works end to end: title → HTML paste → `Control+Home` → `setInputFiles` on the page's `input[type=file][accept="image/*"]` (the image lands as the first block, and the upload returns a `cdn.buymeacoffee.com/uploads/project_updates/…` URL) → read the sidebar audience back as `Public` → `Publish now`. Publishing navigates straight to `buymeacoffee.com/<handle>/<slug>`, and the studio's `Published N` counter is the +1 check.
