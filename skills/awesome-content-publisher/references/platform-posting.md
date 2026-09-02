# Platform posting notes — login signals, composers, read-back

Hints, not gospel: platform UIs drift constantly. When the live page does not match a note here, take an accessibility snapshot and re-derive the flow from what is actually on screen — never click a remembered selector into a changed UI. Read-only checks stay read-only: detecting login state never involves typing or opening account settings.

**Read `browser-interaction.md` first.** These notes say *where* things are; that file says *how* to click, type, attach and confirm on UIs that defeat ordinary Playwright actions. The selectors below were observed on live accounts and are starting points, not guarantees.

Shared rules for every platform:

- **Login signal** — load the platform's home/feed URL; a login form or "Sign in" wall = logged out; the user's avatar/composer = logged in. Ambiguous → classify `unknown` and say what was seen.
- **Fill** — type through the type tool with delay, one field at a time; attach media via the real file input; pause 2–8 s between distinct actions.
- **Read-back** — after submitting, navigate to where the post should be visible and confirm it; capture the permalink. A confirmation toast is not read-back.
- **Never** — change audience/visibility defaults the user didn't specify, dismiss platform warnings, or touch any dialog that mentions unusual activity (that one goes to the user). Profile fields are off-limits with one exception: the bio-link update the Phase 3 bio-link check explicitly confirmed, one field, one URL.

## facebook-wall
**Default surface is the user's own timeline**, not a Page: go to `facebook.com/<handle>` (the profile URL the user gave, or the one the top-bar avatar links to), and compose from the wall composer there. Only when the account manages Pages, and the post file names one, does the Page flow below apply — a run that silently posts a personal-wall post to a Page has published to the wrong audience.

Check: `facebook.com` — own avatar and the "What's on your mind" composer. Compose: click the composer, type, attach, Post. Read-back: own profile, newest post. Quirk: leave the audience selector alone unless frontmatter specifies visibility.

Observed on a Page (UI in Ukrainian): the inline composer field reads "Що у вас на думці?"; clicking it opens a dialog with `aria-label="Create post"` (English attribute even on a localized UI) — several other `[role="dialog"]` nodes coexist (notifications, empty portals), so identify by that label. The composer has exactly one file input inside its subtree; scope to it. Posting is two steps: **Next** ("Далі") → a **Post settings** screen → **Publish** ("Опублікувати"). The settings screen renders grey skeletons for several seconds — a DOM probe run too early still reports the *previous* step's buttons and looks like the click failed; wait and re-probe rather than clicking Next again. On that screen confirm audience, and that *Share to groups*, *Share to story* and *Promote* are not engaged — "Просувати допис" warns it opens a paid flow after Post; never enter it. The photo-edit panel that carries alt text frequently will not open (two attempts, both dead) — Facebook then generates its own OCR description. Read-back: the Page feed shows "Щойно"/"Just now" with `Published by <admin>`; capture the `/posts/pfbid…` permalink and open it to confirm text and media, since the feed truncates behind "See more".

## facebook-group
Check: the group URL from frontmatter — member view with a composer visible (no composer = not a member or posting restricted → report, skip). Compose: composer inside the group page. Read-back: group feed; many groups queue posts for admin approval — a "pending approval" notice = ledger status `pending-approval`, not `posted` and not a failure.

## linkedin
Check: `linkedin.com/feed/` — the member name renders in the rail. Compose: "Start a post" → the share dialog → `.ql-editor[contenteditable="true"]` → "Post". Read-back: own profile → recent activity/posts.

**The reliable way in is `linkedin.com/preload/sharebox/`** — it opens the share composer directly, with `.ql-editor[contenteditable="true"]` ready. The profile route works too: the Activity section of `linkedin.com/in/<handle>/` carries a "Create a post" link pointing at that same URL. From the feed, the composer often refuses to mount at all: on a page rendering with ~190 console errors the button was present on one probe and gone on the next, and `?shareActive=true` produced zero editors.

**Filling needs `page.keyboard.insertText`.** `handle.type`, `keyboard.type` after a coordinate click, and even `el.focus()` reporting success all leave the Quill editor empty; insertText fills it in one shot. Quill reports a few more characters than the source (it renders `\n\n` as `\n\n\n\n`), so compare the URL and the tail rather than the exact count.

**Submitting works only through `el.click()` from `page.evaluate`.** With the body in place the Post button enables, and a coordinate click, an element-handle click and a force click all leave the activity feed unchanged — the newest post stayed a month old, while a `beforeunload` on the way out confirmed the draft was still sitting there. The untrusted JS click published immediately. Take the last enabled button whose text is exactly "Post"; the draft persists across reloads, so a failed attempt costs nothing and can be finished by hand.

Read-back: `linkedin.com/in/<handle>/recent-activity/all/` should show the post as "Feed post number 1 … now"; the permalink is `linkedin.com/feed/update/urn:li:activity:<id>/`, and the URN is in that page's HTML. **LinkedIn rewrites every link to `lnkd.in/<code>` and renders a preview card**, so a tail comparison against the source URL fails on a perfectly intact post — check that the `lnkd.in` link and the card title are present instead, and that the original URL still appears in the page HTML.

## reddit
Check: `reddit.com` — avatar in the header. Compose: `reddit.com/r/<subreddit>/submit` — title into the title field, body into the markdown/text field; set flair when frontmatter names one (some subs require it — an unset required flair blocks submission). Read-back: the subreddit's /new listing AND the user's profile — automod can remove a post seconds after it lands; removed = report to the user, never repost the same content at the same sub.

## lemmy
Check: `https://<instance-from-frontmatter>/` — avatar in the header (each instance is a separate login; `lemmy.world` being logged in says nothing about another instance). Compose: the community's own create-post page (`/create_post?community_name=<community>` on most instances, or the community page's Create Post control) — title, URL field when the post file carries a link submission, markdown body. Read-back: the community's /new listing and the user's profile; community moderators and instance admins both remove, so a post gone from the listing is a removal to report, never to repost.

## tumblr
Check: `tumblr.com/dashboard` — the account/settings row renders for a signed-in user. Compose: `tumblr.com/new/text` opens a block editor — an `H1` title block and a `P` body block, both `[contenteditable="true"]`, plus `textarea[placeholder="#add tags"]`.

Three traps, all of which cost a run:

- **The tags field steals nothing and gives nothing back.** Coordinate-clicking it, and even `el.focus()` reporting success, still sends the keystrokes into the body block, so the tag words land as extra paragraphs in the post. Verify by re-reading the body's last block after typing tags; if the tags are in it, the draft is contaminated. Posting without tags is the cheaper outcome — record `degraded`.
- **The editor restores its autosaved draft.** Reloading `/new/text` after an abandoned attempt brings the old text back, so a second type doubles the post. Check the editor is empty *before* typing, and note that `Ctrl+A` + Backspace does not clear these blocks.
- **Leaving raises `beforeunload`.** Accept the dialog to discard the draft and leave; dismissing it keeps you on the page. `page.on('dialog', d => d.accept())` inside the script handles the pair of them.

Entry point: the sidebar's `a[aria-label="Create a post"][href="/new"]`, or go straight to `tumblr.com/new/text`.

**Two things the block editor will not do by itself, and both shipped wrong in one run.** The post's image is a **featured image at the very top, directly under the title** — that is the shape of this author's own posts, and `tumblr.com/new/text` exposes no `input[type=file]` until an image block is added, so a run that only looks for one concludes there is no image support and ships text-only. Add the image block from the editor's own block control before typing the body, so the picture sits above it. And **a pasted URL is not a link**: select the words and use the popover that appears over a text selection, or the closing line publishes as dead characters.

Submit is "Post now", and **the trusted click does nothing** — five polls left the text sitting in the block. `el.click()` from `page.evaluate` publishes and redirects to `/dashboard`. Confirm on `tumblr.com/blog/<name>` before recording anything; the permalink is `tumblr.com/<name>/<id>/<slug>` and an `/edit/<name>/<id>` link sits beside it.

**Filling has a trade-off, and both sides cost something.** `keyboard.type` types into the block editor correctly but the tag field steals nothing and the draft-restore trap above applies; `keyboard.insertText` fills reliably in one shot **but collapses the whole body into a single block**, so blank lines vanish and sentences run together (`each other.It doesn't.`). Prefer insertText for getting text in, then either restore the paragraph breaks with explicit `Enter` presses between blocks, or accept a one-block post and record it `degraded` — editing afterwards is possible here but needs the user's explicit request.

## mastodon
Check: `https://<instance-from-frontmatter>/home` — the compose column renders the handle, the visibility control ("Public, quotes allowed") and the live character budget. Compose: `textarea.autosuggest-textarea__textarea` (placeholder "What's on your mind?"), coordinate-click and type; submit is the button labelled "Post". The textarea empties on success. The whole flow works first try — no actionability fights, no intent route needed.

Read-back: `https://<instance>/@<handle>`, newest `/@<handle>/<numeric-id>` link. **Mastodon shortens the displayed URL** ("code.claude.com/docs/en/cross-…"), so a tail comparison against the page text fails on a post that is perfectly intact — open the permalink and compare the `a[href]` of the link instead, which carries the full URL.

## bluesky
Check: `bsky.app` — compose button. Compose: new post, type, attach; paste links plainly for the link card. Read-back: own profile feed.

**The compose button defeats every click form.** `browser_click` on its `aria-ref` times out on actionability, a coordinate click on the inline "What's up?" box does nothing, and `?compose=true` mounts no dialog. Focus+Enter opens *an* editor that is not the composer, so typing into the first `[contenteditable="true"]` lands nowhere. What works, first try: **navigate to `https://bsky.app/intent/compose?text=<encodeURIComponent(body)>`** — the composer opens prefilled, the character count is already correct, and the submit control is `aria-label="Publish post"` (coordinate click on it works). Read-back: `bsky.app/profile/<handle>` where the newest `/post/<rkey>` link is the new one; the handle comes from the last `a[href^="/profile/"]` in the nav, since the first one belongs to whichever feed post is on screen.

## x
Check: `x.com/home` — composer at the top of the timeline; `[data-testid="SideNav_AccountSwitcher_Button"]` carries the handle, which is the cheapest login+identity probe. Compose: type, attach, Post; a thread is separate sequential posts via the composer's add-post control, only when the post file is explicitly structured as a thread. Read-back: own profile.

Selectors: editor `[data-testid="tweetTextarea_0"]` (Draft.js — click it with a real mouse click, then `keyboard.type`); the composer's file input is the one whose `accept` starts with `image/jpeg,…`; submit `[data-testid="tweetButtonInline"]` (or `tweetButton` in the modal composer). Read-back: `[data-testid="tweet"]` on the profile, with `time[datetime]` and the `/status/<id>` href.

**Alt text is a known dead end from the inline composer.** `[data-testid="altTextWrapper"]` is an `<a role="link">` pointing at `/compose/post/media`; the route changes but the description modal never mounts. Four approaches failed: coordinate click, manual `down`/`up`, focus+Enter, and navigating to the full-page composer. Treat X alt text as best-effort: try twice, then record the post as `degraded` in the ledger and say so in the report — **X does not allow adding a description after posting**, so the only fix is delete-and-repost, which needs the user's explicit request. Navigating away while a draft exists raises a `beforeunload` modal — dismiss it with `accept: false` to keep the draft. SPA back (`goBack`) preserves composer text and attachments; a full `goto` does not.

## truthsocial
Check: `truthsocial.com` — own avatar and the composer on the home column; the header shows the display name and `@handle`. Compose: the composer is on the home page as `textarea#compose-textarea` ("What's on your mind?"), the visibility control reads "Post to Public", and the submit button is labelled **"Truth"**. Coordinate-click the textarea, type, coordinate-click "Truth"; the textarea empties on submit.

**The profile lags by up to an hour, and reading that lag as failure creates duplicates.** The composer cleared, and `truthsocial.com/@<handle>` plus the home feed showed nothing across several reads with scrolling and re-querying — so the post was recorded `unverified`. It had in fact published. An hour later the profile listed it, and by then a second copy had been posted on the assumption the first never landed. Two rules follow: never treat an empty Truth Social profile as evidence of absence, and never re-post here without a read-back that succeeded at least once. When the profile is empty, leave the entry `unverified`, say so, and re-check later; the correct fix for a duplicate is deleting one through the post's **More → Delete** menu, which needs the user's explicit request.

Read-back, when it works: the profile's Truths tab renders posts as `/@<handle>/posts/<numeric-id>` links, newest first, with a relative timestamp.

## wonderful-dev
Check: `wonderful.dev` — logged-in header state; the app lands on `/home`. Compose: the composer is already on the timeline — a visible `textarea[placeholder="Start typing…"]`, no dialog to open. Coordinate-click it and type.

**Submitting is unsolved, and one attempt looked successful when it wasn't.** The visible "Post" text at the top of the page is the composer's *type* tab (Media / Poll / Post) and submits nothing. The textarea's own form holds a single unlabelled `input[type=submit]` about 32 px wide; a coordinate click on it, and a JS `el.click()` on it, both left the profile with the same four older posts. Filling works — `t.focus(); t.setSelectionRange(0, t.value.length)` then `page.keyboard.insertText(text)` lands the body exactly — so the gap is the submit alone. Two attempts, then report and skip. **Read-back here is a trap in both directions.** The composer does not clear on success, so an empty-box check reports failure on a post that landed — and, worse, counting occurrences of the body text *on the same page* counts the text still sitting in the composer, which reported a successful publish for a post that was never created. Verify on `wonderful.dev/<handle>`: open the `post/thread_<id>` permalinks and confirm one of them is the new body, since old posts live at the same URL shape and a permalink alone proves nothing.

## hackernoon
Check: `app.hackernoon.com` — the reader shell greets the user by handle, which confirms the session. Compose: in theory new draft → title, markdown body → submit for review, and **submission is the terminal state for this skill** (ledger `pending-approval`).

In practice the editor was unreachable: `hackernoon.com/new` renders a "Start a New Draft" page whose "Start Draft" button does nothing under a handle click or a force click, `app.hackernoon.com/new` redirects there, and `app.hackernoon.com/drafts` only links back to it. Two attempts, then report and skip — and say the draft has to be started by hand.

## hashnode
Check: `hashnode.com` — the avatar and a "Write" control render. Compose: the editor takes title, markdown body, tags, optional cover and canonical URL, and the choice between the personal blog and a publication (a publication routes the draft to its editors, which is `pending-approval`, not `posted`).

**An account with no blog yet has no editor.** `hashnode.com/draft` answered "User not found", `hashnode.com/draft/new` rendered the feed shell with zero inputs, and the "Write" button opened nothing through a handle click, a force click or its `aria-ref`. Creating the blog is an account-level decision — surface it to the user instead of clicking through it, and skip the platform for that run.

## devto
Check: `dev.to` — avatar / "Create Post" button. Compose: `dev.to/new` opens the markdown editor as a **single `#article_body_markdown` textarea** with no separate title or tag fields and a button that reads "Save changes" rather than Publish. Everything is front matter, and `published: true` is what makes "Save changes" publish rather than draft:

```text
---
title: <title>
published: true
tags: tag1, tag2, tag3, tag4
---

<body>
```

Type the whole block into the textarea (Ctrl+A, Backspace first — the editor restores an old draft), then click "Save changes". Read-back: the editor navigates straight to `dev.to/<handle>/<slug>-<id>`, which is the permalink; confirm the body renders and the author line is the user. Smooth flow, no actionability fights.

**Upload the image first, then write the front matter around its URL.** `input#image-upload-field` (`accept="image/*"`) takes the file with `setInputFiles` and dev.to returns a hosted `https://dev-to-uploads.s3.amazonaws.com/uploads/articles/<id>.png`; the URL appears in the page HTML after the upload. That URL then goes in **two** places: `cover_image:` in the front matter, and an ordinary markdown image on the first line of the body, before the first `##`:

```text
---
title: <title>
published: true
tags: tag1, tag2, tag3
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/<id>.png
---

![<alt text>](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/<id>.png)

<body>
```

Uploading and then referencing it only from `cover_image` is the failure to avoid: the article body then has no image in it, and the cover carries no alt text. The in-body markdown is also the only place the declared alt text survives. Confirm on the published page that an `img` sits above the first `h2` and that its `alt` is the post file's alt text.

## hackernews
Check: `news.ycombinator.com` — the header carries the username and a `logout` link when logged in (`#me` holds the name). Compose: `/submit` — plain HTML form, `input[name=title]`, `input[name=url]`, `textarea[name=text]`; the form takes url **or** text, not both. Ordinary coordinate clicks and typing work; no SPA fights here.

**A text submission is a real option, not a fallback.** The form takes url **or** text because the site forbids pairing a link with your own commentary above the fold — its FAQ: *"You can't. This is to prevent people from submitting a link with their comments in a privileged position at the top of the page. If you want to submit a link with comments, just submit the link, then add a regular comment."* So when the post file's URL is unusable (already submitted, or the piece is the campaign's own writing), filling `textarea[name=text]` and leaving `input[name=url]` empty publishes a normal HN submission. Do not report "HN only takes links" — it takes both, one at a time.

**Check the URL is not already on HN before submitting.** A duplicate URL does not create a post: the form redirects to the existing item, and HN counts the attempt as an **upvote from your account on someone else's submission** — an outward-facing side effect the run never promised, visible as the header switching to `unvote` on that item. This happened on a docs URL that had been submitted three weeks earlier. So search `hn.algolia.com` (or submit and read the redirect) and treat a redirect to an existing `item?id=` as `skipped`, not `posted`, log the vote as an incident, and ask the user whether to unvote — never unvote on your own initiative. Read-back for a real submission: `/submitted?id=<user>` plus the item permalink; the site's filters can kill a new submission within minutes, and `/newest` not showing it while the profile does means exactly that. New accounts and repeat domains draw the filter hardest.

## patreon
Check: `patreon.com` — redirects to `patreon.com/c/<handle>` with a Dashboard link when the creator session is live. Compose: **`patreon.com/posts/new` immediately creates a draft** and lands on `patreon.com/<handle>/posts/<id>/edit` — so merely probing that route leaves a draft on the account; probe it only when about to post. The editor is `textarea[placeholder="Title"]` plus a `div[contenteditable="true"]` body, and the submit is a plain "Publish" button.

Playwright's own `.click()` times out on both fields (actionability never settles); **coordinate clicks work**, aimed at the top of the element's rect rather than its centre for the tall body div. Visibility (public vs members) is set by the frontmatter, and no frontmatter value → ask, don't default. Read the audience radios back before publishing: `Free access` / `Everyone` is the public state, `Paid access` is not.

**The image goes in the post body and must stay out of Attachments.** The editor's toolbar has `Image`, which opens a drop zone ("Drop an image, video or audio file as the main content of your post"); that zone's own input is the one whose `accept` starts `image/jpeg,image/png` — the first `input[type=file]` inside it has `accept="*"` and is the **attachment** uploader, which publishes the file as a download link under the post instead of showing it. Picking the wrong one ships the picture twice: once as the visual, once as a stray `v02.png` in an Attachments list. Match the input by its `accept` starting with `image/`, and after publishing check the post page has no Attachments row. Read-back: publishing navigates to `patreon.com/<handle>/posts/<slug>-<id>?pr=true`; strip the query for the permalink, and confirm no "Join to unlock" gate is present — though as the creator you see the body either way, so a public/members claim rests on what was set, not on what you can see.

## ko-fi
Check: `ko-fi.com/Manage/` confirms the session, but **the composer is not there** — it lives on the creator's own page, `ko-fi.com/<handle>`. `/Manage/newpost`, `/post/new` and `/Manage/feedposts` all redirect back to `/Manage/`, which is what makes this look unreachable.

The working sequence, all of it verified:

1. On `ko-fi.com/<handle>`, take `button.creator-menu-btn` (the "Create" dropdown, `data-toggle="dropdown"`). Trusted clicks do nothing on it; **`el.click()` from `page.evaluate` opens it** — it is a Bootstrap toggle listening for a plain click event.
2. In the dropdown, "Post something" opens the modal `#addContentMenuModal`, whose row reads `Post · Image · Blog post · Video · Poll · Audio`. The number displayed in that modal is the **character cap: 800**.
3. Clicking "Post" in the modal makes `textarea#postUpdateTextBox` visible (it exists but has zero height until then, which is why an earlier run reported it invisible and gave up).
4. Filling it needs the same trick as the rest of the page: `t.focus(); t.setSelectionRange(0, t.value.length)` in-page, then `page.keyboard.insertText(text)` — which also replaces whatever is already there. `handle.type`, `keyboard.type` and coordinate clicks all leave it empty, and `Ctrl+A`+Backspace does not clear it.
5. Submit is `#postUpdateButton`, again via `el.click()` from `page.evaluate`; the textarea clears on success.

**The 800-character cap truncates silently.** A body of 805 characters came back as 800 with the tail of the URL gone — the same failure shape as `peerlist`, except here the number is on screen. Fit the post to 800 before typing, then verify head and tail.

**The image is added inside the same modal, before submitting.** The modal that appears after "Post something" carries a row of content types — `Post · Image · Blog post · Video · Poll · Audio` — and choosing `Post` reveals the text box. The image control lives in that same modal; find its input by an `accept` containing `image/` **scoped to `#addContentMenuModal`**, not page-wide. A supporter update shipped without one stands out on a feed where the author's other posts have pictures, so a missing image control is a reason to re-read the modal rather than to submit text-only.

**The dropdown item is reached by coordinate, not by JS click.** `button.creator-menu-btn` opens the site's own nav, not this menu: the one that matters is the `Create` control carrying `data-toggle="dropdown"`, and its `Post something` entry only becomes clickable once the dropdown is open — an `el.click()` on the entry while it is collapsed silently does nothing. Open the dropdown, read the entry's rect, then coordinate-click it; the modal's own `Post` tile likewise needs its live rect.

Read-back: `ko-fi.com/<handle>/posts` shows the update; ko-fi exposes **no per-post permalink** in the feed, so record the posts page and say so.

## bastyon
Check: `bastyon.com/index` — when the app hydrates, the feed renders with the account link and a PKOIN balance, which is the only signed-in signal available. The composer a user sees is a field with `placeholder="What's new?"`.

**The PWA stops hydrating under automation.** After the first few navigations, every route — `/`, `/index`, `/<handle>`, `/post`, `/editor`, `/index?share=1` — returned a document whose `body.innerText` was empty, including after a full reload with `waitUntil: 'load'` and 15 seconds of waiting; no placeholders, no buttons, no shadow roots, nothing to click. Key-pair auth means a signing prompt may be waiting behind the composer anyway, and that belongs to the user. Report and skip, and say the page renders for them but not for the automation.

## buymeacoffee
Check: **`studio.buymeacoffee.com/posts`**, not `buymeacoffee.com` — the marketing homepage shows "Log in / Sign up" to a fully signed-in user, so checking there reports a false logged-out. The studio page also carries the read-back baseline: a "Published N" counter.

**Compose at `buymeacoffee.com/posts/create`, not `studio.buymeacoffee.com/posts/new`.** This is the whole trick, and getting it wrong is what made this platform look unpublishable. The two routes are different editors. The `studio…/posts/new` one carries `#post-title`, a `.pe-editor` ProseMirror, a `.post-editor-sidebar`, hidden state flags (`#is_title_typing`, `#publish-status`) and a reCAPTCHA frame, and its publish never fires under automation — the `Publish now / Set publish date / Save as draft` dropdown stays `display:none` however it is clicked, and the string "Add a title to your post before continuing" sitting on the page is a permanent hover tooltip rather than a validation state, so it reads like a blocked form when nothing is blocked. Do not debug that page. Reach the working editor by pressing **`Post`** under "Create a new post" on `studio.buymeacoffee.com/posts`, or go straight to `buymeacoffee.com/posts/create`.

The working editor, verified end to end:

- **Title**: `input[placeholder="Title"]` — no id, ordinary click-and-type works.
- **Body**: `div.tiptap.ProseMirror` — a TipTap editor. Coordinate-click it, then type paragraph by paragraph with `Enter` between; the breaks survive and emoji arrive intact.
- **Toolbar**: ten `button.option-button` icons in a row under the title, unlabelled in the DOM (no `aria-label`, no `title`, only path data) but ordered **Bold · Italic · Underline · Link · Heading · Bullet List · Block Quote · Image · Embed · Code Block**. Take them by index off `document.querySelectorAll('button.option-button')`, and **re-read the rect immediately before every click** — a `scrollIntoView` on the body moves the toolbar off its earlier coordinates, and a click at a stale `y` silently hits nothing. Hovering a button surfaces its name if the order ever changes.
- **Publish**: a plain `button` reading `Publish now`, top right. No dropdown, no second modal, no category requirement, and no validation warning once title and body are filled.
- **Audience**: the sidebar reads "Who can see this post?" with `Public` selected; read it back before submitting.

**Image (index 7).** Clicking it opens a file chooser, but the page also carries one `input[type=file][accept="image/*"]` that `setInputFiles` drives directly, which avoids the chooser entirely. TipTap inserts at the caret, so press `Control+Home` first when the picture belongs at the top — which for a supporter post it does. The upload returns a `cdn.buymeacoffee.com/uploads/project_updates/…` URL and the image lands as its own block above the text.

**Link (index 3).** Select the words with a Range over the text node — `range.setStart/setEnd` on the URL substring, then `selection.addRange` — click the Link button, and a popover appears carrying `input[placeholder="Enter a URL..."]`. Type the address and press `Enter`; the selection becomes a real `<a href>`. Skip this and the closing URL publishes as dead text.

Read-back: back on `studio.buymeacoffee.com/posts`, the Published counter must go up by exactly one and a row for the title must appear with its visibility beside it ("Public"). Then open the `buymeacoffee.com/<handle>/<slug>` permalink and confirm the three things this composer can lose: the closing URL is an `<a>` rather than text, an `img` from `cdn.buymeacoffee.com` sits in the body, and no `�` replacement character survived anywhere.

## instagram
Check: `instagram.com` — home feed with the new-post (+) control. Compose: new post → upload the attachment (required — no attachment reached this phase only by a preflight bug: stop) → caption → share. Read-back: own profile grid. Quirk: caption links are not clickable; that was the campaign's problem, not this phase's — post the caption as written. Bio-CTA captions depend on the Phase 3 bio-link check having passed: the bio edit (when the user confirmed it) goes through the profile's own edit flow — the website/bio field only.

Full flow as observed (UI in Russian; English labels in parentheses):

0. **Never navigate to a `/create/…` URL.** `instagram.com/create/select/` and its siblings are not the app's route to the composer: they render an unrelated profile shell that happens to expose a file input whose `accept` is `image/jpeg` alone. A run that lands there concludes Instagram cannot take a PNG and converts the file — treating a symptom of being in the wrong place. The composer is reached from the sidebar and nowhere else.
1. **Create — two clicks in the sidebar, and the selectors are stable.** Take `svg[aria-label="New post"]`, click its `closest('a, div[role="link"], div[role="button"], button')` by coordinate; the entry expands. A second control then appears beside it, `svg[aria-label="Post"]` (observed at x≈184, one row below), and clicking that opens the dialog titled **"Create new post"** with "Drag photos and videos here / Select from computer". Verified working this way; `browser_find` for "Create" and clicking the returned `link "New post Create"` ref is the equivalent a11y route and also works. Coordinate clicks on the row alone toggle the menu open and shut, so re-read the rect between the two clicks rather than clicking the same point twice.
2. **The correct dialog accepts PNG.** Its file input reads `accept="image/avif,image/jpeg,image/png,image/he…"` — if the input you found accepts `image/jpeg` only, you are on the wrong route, go back to step 0.
3. **Upload.** Scope `setInputFiles` to that dialog's own input. On a localized UI the dialog reads "Создание публикации / Перетащите сюда фото и видео".
4. **Crop — do not skip this.** The step defaults to a square crop that mutilates a 16:9 screenshot. Open "Выбрать размер и обрезать" (aria-label) and pick **"Оригинал"** unless the post file asks for a ratio.
5. **Two × "Далее" (Next)** — crop → filters (apply none) → caption.
6. **Caption** goes into the dialog's `[contenteditable="true"]`; the counter reads `N/2 200`.
7. **Alt text is not reliable, and getting it wrong is expensive.** Expand the **Accessibility** accordion by clicking the rect of its `[role="button"]` ancestor (the bare text node is not clickable, and it often needs a second deliberate click after `scrollIntoView`); on a Russian UI the field was `input[placeholder*="льтернативный"]`. On an English UI in a later run the accordion opened and **no alt input existed at all** — the only visible text inputs in the dialog were `aria-label="Add location"` and `aria-label="Add collaborators"`. **Never fall back to "the first visible text input"**: doing that typed the alt text into the location field, which had to be selected and cleared before sharing. Match the alt field by its own placeholder or `aria-label` and nothing else; two attempts, then share without it and record `degraded`.
8. **Before sharing, read both checkboxes**: the AI label and the **Threads cross-post**. Confirm both `false` unless the post file asks otherwise — silently cross-posting to another network is not what was approved.
9. **Share is slow.** Poll the dialog in-page until it reads "Публикация размещена" / "Вы поделились публикацией", per `browser-interaction.md`. **Do not navigate away while it uploads** — a transient network error during that window loses the post silently, and the profile then shows nothing at all.

Read-back: profile post count must go up by exactly one, and the newest `/p/<code>/` link must be new. Note the grid anchors are `/<handle>/p/<code>/`, not `/p/<code>/` — a query for the latter returns zero and looks like failure. Open the permalink and confirm caption, `time[datetime]` and the image's `alt` (your alt text appears verbatim as the `img` alt).

## pinterest
Check: `pinterest.com` — logged-in home (it may redirect to a country host such as `ca.pinterest.com`; that is normal, keep using whatever host answers). Compose: **`pinterest.com/pin-builder/`**, which lands on `/pin-creation-tool/`. The whole flow works through element handles, no coordinate gymnastics:

- **Image**: `#storyboard-upload-input` — the composer's own input, `accept` covering bmp/gif/jpeg/png/tiff/webp plus video. `setInputFiles` on it, then confirm a preview appeared and `location.href` did not change.
- **Fields**: `#storyboard-selector-title` (title), the `div[contenteditable="true"]` that appears after upload (description), `#WebsiteField` (destination link), `#combobox-storyboard-interest-tags` (tags, optional).
- **Board**: the "Choose a board" control opens a dropdown. **An account with no boards offers only "Create board"** — treat that as a decision for the user (propose a name, let them type one), never invent one silently. The creation form is `#boardEditName` plus a `#secret` checkbox: **read `secret.checked` before creating**, because a secret board publishes a pin nobody can see. Then "Create", and the picker shows "Board <name>".
- **Publish**: the top-right "Publish" button; the composer confirms with "Your Pin has been published".

Read-back: `pinterest.com/<handle>/<board-slug>/` shows "Public board · N Pins" and the pin's `/pin/<id>/` link. Note the board keeps drafts around ("Pin drafts (N)") — an abandoned attempt leaves one, which is worth mentioning to the user rather than deleting.

## bastyon
Check: `bastyon.com` — logged-in state (key-pair auth; if a key prompt appears, that is the user's to handle — never request, read, or paste key material). Compose: use the generic flow from the live UI. Read-back: own profile feed.

## vk-wall
Check: `vk.com` — own page reachable. Compose: the wall composer on the target from frontmatter (own wall or a community — for a community, posting rights must exist; a missing composer = report, skip). Read-back: the target wall.

`vk.com` redirects to `vk.ru`; both appear in URLs and neither indicates a problem. Admin rights on a community show as a "Manage" / "Керування" link in the right column — that is the posting-rights probe.

**The composer is not on the page until you open it.** There is no inline wall input on a community page: click the **Create** button above the feed, then pick **"Post"** from the sheet that opens (`[data-testid="dropdownactionsheet-item"]`, the first entry). Both of these defeat `browser_click` — use coordinate clicks, and focus+Enter as the fallback. Then the editor is `[data-testid="posting_base_screen_input_message"]`.

**The file-input trap that cost a public artifact.** A community page carries three `input[type=file]`. The page-level `accept="image/jpeg,image/png,image/gif"` one is the **photo-album uploader**: `setInputFiles` on it publishes the image into the community album and navigates to that album, destroying the composer draft. The composer's own input lives inside the New-post dialog and its `accept` contains `video/*`. Always scope to the dialog and disambiguate by `accept`; verify the preview appears inside the composer and that `location.href` did not change.

Publishing is two steps: **Next** ("Далі"/"Далее") → a settings screen → **Publish** ("Опублікувати"/"Опубликовать") — match the *exact* label, since "Publish as story" sits beside it. Opening the composer from the community page posts as the community; there is no author selector to set. VK autosaves drafts, so a composer reopened after an interruption comes back with its text — check what is already in the field before typing, or you will double it. A URL in the text auto-attaches a link snippet card, which the image attachment then replaces; that is expected and the URL stays in the body.

Read-back: the newest `article` on the wall, its `/wall-<owner>_<id>` permalink and its "just now" timestamp. Album ordering is **not** ID-ordered — the highest photo ID in a long album was item #40 of 233 — so for anything album-related use a count baseline instead.


## nostr
Check: the web client named in frontmatter — the user's own profile and a composer are reachable, and the client reports a signing method. **Key material is never touched**: no seed, no `nsec`, no private key is requested, read, pasted, or stored, and a signing-extension prompt (NIP-07 style) is handed to the user exactly like a captcha. Compose: the client's composer; media is usually uploaded to a separate host by the client's own upload control. Publishing broadcasts to relays, so propagation is not instant and not uniform. Read-back: the user's own profile feed **on that same client**, since a note visible on one client's relay set may not have reached another's — that is normal propagation, not a failure, and the ledger records which client confirmed it.

## hashnode
Check: `hashnode.com` — the avatar and the write control. Compose: the editor — title, markdown body, tags, optional cover image, canonical URL when the article mirrors the user's blog, and the choice between the personal blog and a publication (frontmatter's target; a publication may route the draft to its editors instead of publishing). Read-back: the published article URL it lands on, opened and confirmed; a draft submitted to a publication for review is `pending-approval`, not `posted`.

## threads
**The domain is `threads.com`** — `threads.net` still resolves but the app and every permalink live on the new host. Compose: like Bluesky, the reliable path is the intent route — `https://www.threads.com/intent/post?text=<encodeURIComponent(body)>` opens the composer prefilled and correctly counted.

**An emoji can arrive broken through the intent route, and it publishes broken.** One run shipped `…in the same folder �` — the replacement character, not the emoji — because an astral-plane codepoint did not survive the round trip into the composer. So after the intent route fills the editor, **compare the composer's text against the source character for character** rather than only by length, and check specifically that every emoji is still the emoji: search the field for `�`. Found one → clear the editor and type the body in directly instead of trusting the URL, or type the plain text through the intent route and add the emoji by keystroke afterwards. The same check applies to Bluesky's intent route for the same reason. Submit is the **last** button reading "Post" inside `[role="dialog"]` (the first one is the composer's own entry point); coordinate-click it and wait for the dialog count to drop to zero. Read-back: `threads.com/@<handle>`, newest `/post/<code>` link, and exactly one occurrence of the body text.

Check: the Threads web app — the user's avatar and the composer entry on the home column. The account is an Instagram account: the session usually rides along with Instagram's, and the handle is the same one, so an Instagram login check is a strong prior but not proof — verify on Threads itself. Compose: the composer, type, attach through its own file input (scope to the composer's dialog — the page carries other uploaders), publish. Unlike Instagram, links in the body are clickable and media is optional. A reply chain is separate sequential posts through the composer's add control, only when the post file is explicitly a thread. Read-back: the user's own profile feed, newest post, its permalink opened and confirmed.

## telegram
Check: the Telegram web client — the chat list loads and the user's own account is present; a phone-number or QR screen means logged out, and **login here is never automated under any circumstance** (it is a phone code, and asking for one is asking for account access). Compose: open the channel or group from frontmatter — posting rights are required and their absence shows as a missing message box, which is a report-and-skip, not a UI drift. Type into the message box, attach media through the client's own attach control. **Enter sends by default** (the client's setting can invert it), so internal newlines are `Shift+Enter` and the send happens once, at the end — otherwise a multi-line post arrives as one message per line to every subscriber, and every one of them gets a notification. The media caption cap is a different number from the plain message cap; the campaign's Phase 3 research carries both. Read-back: the channel's last message, its timestamp, and its permalink — `t.me/<channel>/<id>` for a public channel, the `t.me/c/…` form for a private one. Telegram allows editing after posting; only on the user's explicit request.

## peerlist
Check: `peerlist.io` — redirects to `/scroll` when signed in and the header carries the user's first name. Compose: the "Post" button on `/scroll` opens a dialog with `textarea[placeholder="Title (optional)"]` and a `[contenteditable="true"]` body; submit is the dialog's own "Post" button, with "Schedule Post" sitting immediately to its left — match the exact label, not a substring.

**Peerlist truncates the body on publish, silently.** A 495-character body was accepted by the composer, submitted without warning, and published cut two characters into its closing URL (`…/cross-session-messagi`). There is no counter in the composer and no error. So: keep the body at **400 characters or less**, never end on the link when the platform can eat it, and after publishing compare the post's *tail* against the source rather than searching for a phrase from the middle — a mid-text match confirms a truncated post just as happily as a whole one.

Read-back: the post appears in `peerlist.io/scroll`, **not** on `peerlist.io/<handle>` or `/<handle>/scroll`, both of which render without it. The scroll feed is virtualized, so read the permalink in the same evaluate that finds the text — a second call finds the node already recycled and returns nothing.

## daily-dev
Check: `app.daily.dev` — signed-in state, the user's avatar in the header. A bounce to the marketing site means the session is logged out; report it and skip rather than guessing at a target.

Compose, default path: `New Post` (or `+`) from anywhere on the site, which posts from the personal profile. An original post takes a title and a Markdown body with code blocks; a link post takes the URL of an article already published elsewhere. Where the composer offers an audience, choose everyone, not a squad. **Community Picks is gone** — sunset in 2025 — so there is no separate submission mechanism to look for.

Squad path, only when the post file's target names one: go to that squad's page, where posting rights are required and their absence shows as a missing composer (report and skip). A link already present in the feed is deduplicated by the platform — resubmitting is not a fix, it is a report.

Read-back: the user's profile Posts tab, or the squad feed where one was named, the item visible with its timestamp and permalink.

**Before submitting, confirm the user has seen the AI-content rule.** daily.dev prohibits AI-generated content. If nothing in the run records the user's decision to publish this text as their own after editing it, stop and ask rather than posting — this is one of the few places where publishing quietly can cost the account, not just the post.

## minds
Check: `minds.com/newsfeed/subscriptions` — the rail renders Newsfeed / Boost / Wallet and the `@handle` entry. Compose: the composer sits on the newsfeed as `textarea.m-composerTextarea__message` ("Speak your mind...").

**Keystrokes only reach it through an element handle.** A coordinate click plus `page.keyboard.type` leaves the value empty and both "Post" buttons disabled, and so does `el.focus()`; `page.$('textarea.m-composerTextarea__message')` then `handle.type(text)` fills it correctly first try. The enabled submit is not in the page-wide button sweep either — walk up from the textarea (about five parents) to the composer container and take the "Post" button inside it.

Read-back: `minds.com/<handle>/` shows the post and the full URL text; the permalink is the `/newsfeed/<numeric-id>` anchor. Never touch Boost, Wallet, Supermind or Minds+ controls — the token layer sits next to the composer and none of it is part of posting.

## medium
Check: `medium.com` — avatar and the write control. Compose: `medium.com/new-story` gives a title editor and a body editor, both `[contenteditable="true"]`; a publication target routes the draft to that publication's editors instead of publishing, which is `pending-approval`, not `posted`. Set the canonical URL when the piece mirrors the user's own blog. Confirm the paywall setting matches what the post file expects before publishing.

**Headings: the `## ` shortcut does not fire when the text is typed straight through.** Typing `## ` then the heading text leaves the hashes as literal characters in a `<p>` — six of them shipped that way in one run. What works is per block, after the text is in: click into the paragraph, `Home`, `Shift+ArrowRight` ×3, `Backspace` to drop the `## `, then `Home` + `Shift+End` to select the line and press **`Control+Alt+Digit2`**, which converts it to a real heading. Verify afterwards that `section` holds zero `## ` and the expected count of `h3`/`h4`.

**`--` autocorrects into an em dash**, so `claude --worktree` publishes as `claude — worktree`: the command is wrong and the campaign's zero-em-dash rule is broken in one stroke. Prefer the flag's short form (`-w`) when writing for Medium, and sweep the body for `[—–]` before publishing. Repairing it needs the **whole block replaced**, not a line edit: `Home` + `Shift+End` selects only the visual line and leaves the paragraph's tail behind (that mistake produced `…enforced rather than agreed.and claude — worktree frontend…`). Select the block with a Range over the `<p>` — `range.selectNodeContents(p)` through the selection API — then `Backspace` and retype.

**The closing URL is not a link until you make it one**, and **the image is not there unless you insert it**. For the link: select the words, use the editor's link control on the selection. For the image: caret on an empty line, click the circled `+` that appears in the left margin, choose the image option, pick the file. Medium has no cover field to compensate, so skipping this ships an article with no picture at all.

Read-back: the published article URL, opened and confirmed — headings rendered as headings, zero literal `## `, zero `[—–]`, the closing link clickable, the image present.

## write-as
Check: `write.as/me` or the pad at `write.as/new` — a signed-in session shows the account's blogs; signed out, the pad still writes but posts anonymously, which is the trap worth checking for. Compose: one editor pane, first line becomes the title, the rest is the body; publish, then assign to the blog the post file names (an account with several blogs makes this a real choice, so the target is not optional).

**Markdown is typed literally and renders on publish**, so the post file's own markdown goes in as written: `#` headings, `**bold**`, `*italic*`, `-` or `1.` lists, `[text](url)`. Type the title line as `# Title` rather than as a bare line — an unmarked first line becomes the title *and* renders again in the body, printing the same words twice on the published page. Formatting applies to blog posts only; an anonymous post renders plain, which is one more reason a signed-out session is a stop rather than a fallback.

Read-back: the published post URL, opened and confirmed — and confirmed **rendered**, not just present. A page showing `#` or `**` as literal characters means the markdown did not run (usually an anonymous post), and that is a failure to report, not a cosmetic difference.

## telegraph
Check: nothing to check — `telegra.ph` has no account. Compose: `telegra.ph` itself, three fields in one page (title, author, body). Publish gives a permanent URL.

**The body is a rich-text editor, so markdown is not typed in — it is applied.** Pasting `## Where it breaks` publishes those hash characters as visible text, which is the single most common way an article lands here looking like a raw file. Type the heading's words as an ordinary paragraph, select the line, and use the floating toolbar that appears over a selection (or the matching keyboard shortcut) to set it. The format allows exactly two heading levels, `h3` and `h4`: map the post file's `##` to `h3` and `###` to `h4`, and never invent a third. Bold, italic, blockquote, ordered and bulleted lists, `code`, `pre` and a horizontal rule are the rest of what the page accepts. Links are inserted through the link control on a selection, never written as `[text](url)`.

**Editing is bound to the browser that published**, through a token in that browser's local storage, so a page created in this session cannot be edited later from anywhere else; say so when a post goes here. There is no feed, no audience and no discovery, so a Telegraph page only makes sense as something another post links to.

Read-back: open the returned `telegra.ph/<slug>` and confirm title and body — and confirm the headings **rendered as headings**. A page whose body shows `##` in the text is a failed publish: it is editable only from this same browser, so fix it in the session that made it or it stays wrong permanently.

## substack
Which of the two surfaces the post file names decides everything here, and the default one sends nothing.

**Profile Article (default, no email).** Check: `substack.com/@handle` while signed in. Compose: `Create` → `Article` → title, body; then publish. The result is a public page on the author's profile and no newsletter is sent, so this carries the ordinary confirmation, not the strict one. Read-back: the published post URL, and the post appearing on the profile's Posts tab.

**Publication send (opt-in, irreversible).** Only when the post file's target names a publication and the send is what the user asked for. Check: that publication's dashboard while signed in. **This path sends email.** Publishing is not only a page going live: subscribers receive it, and nothing recalls a sent issue. Before submitting, read back the audience and section selection and the send-to-email toggle against what the post file declares — a wrong audience is not editable after the fact. Compose: new post → title, subtitle, body, section; then publish. Read-back: the published post URL and the dashboard showing it as sent, both captured; the send count is the evidence that the email half happened.

**A post file with no substack target is the profile Article, not an error and not a prompt.** Never resolve a missing target by opening a publication, and never enable a send toggle the file does not declare.

**Editor mechanics, both surfaces.** Headings do convert from the `## ` shortcut typed at the start of an empty block, unlike Medium — verify anyway that the body holds zero literal `## `. Two things do **not** happen on their own:

- **The closing URL stays plain text.** Select the words that should carry the link and press `Link` in the top toolbar. A published post showing a bare `https://…` in its last line is a defect, not a style.
- **The image has to be inserted.** Caret on an empty line, then the image icon in the top toolbar → `Image` → pick the file. There is no cover field standing in for it.

**The publish confirm has a second step that is easy to miss.** `Continue` opens the settings panel; the send/publish button there ("Send to everyone now" on the publication path) can raise a further modal — one observed variant is **"Publish without buttons"**, shown when the post carries no subscribe button. Until that modal is answered nothing is published and nothing is sent, and the Published list stays empty. Poll for it and answer it rather than reading the empty list as failure and retrying.
