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

**One run failed here outright, and the symptom is worth recognising.** The inline composer took the click and the dialog with `aria-label="Create post"` appeared — but no editable node ever mounted inside it: no `[contenteditable]`, no textarea, keystrokes going nowhere. That is the dialog failing to initialise, not UI drift to re-derive selector by selector. Snapshot the dialog's subtree before typing so the failure is evidence rather than a guess, and after a second occurrence record `failed` and move on rather than spending the run on it; the standalone composer route, or handing the browser to the user for that one post, are the two ways out.

Observed on a Page (UI in Ukrainian): the inline composer field reads "Що у вас на думці?"; clicking it opens a dialog with `aria-label="Create post"` (English attribute even on a localized UI) — several other `[role="dialog"]` nodes coexist (notifications, empty portals), so identify by that label. The composer has exactly one file input inside its subtree; scope to it. Posting is two steps: **Next** ("Далі") → a **Post settings** screen → **Publish** ("Опублікувати"). The settings screen renders grey skeletons for several seconds — a DOM probe run too early still reports the *previous* step's buttons and looks like the click failed; wait and re-probe rather than clicking Next again. On that screen confirm audience, and that *Share to groups*, *Share to story* and *Promote* are not engaged — "Просувати допис" warns it opens a paid flow after Post; never enter it. The photo-edit panel that carries alt text frequently will not open (two attempts, both dead) — Facebook then generates its own OCR description. Read-back: the Page feed shows "Щойно"/"Just now" with `Published by <admin>`; capture the `/posts/pfbid…` permalink and open it to confirm text and media, since the feed truncates behind "See more".

## facebook-group
Check: the group URL from frontmatter — member view with a composer visible (no composer = not a member or posting restricted → report, skip). Compose: composer inside the group page. Read-back: group feed; many groups queue posts for admin approval — a "pending approval" notice = ledger status `pending-approval`, not `posted` and not a failure.

## linkedin
Check: `linkedin.com/feed/` — the member name renders in the rail. Compose: "Start a post" → the share dialog → `.ql-editor[contenteditable="true"]` → "Post". Read-back: own profile → recent activity/posts.

**The reliable way in is `linkedin.com/preload/sharebox/`** — it opens the share composer directly, with `.ql-editor[contenteditable="true"]` ready. The profile route works too: the Activity section of `linkedin.com/in/<handle>/` carries a "Create a post" link pointing at that same URL. From the feed, the composer often refuses to mount at all: on a page rendering with ~190 console errors the button was present on one probe and gone on the next, and `?shareActive=true` produced zero editors. Note the feed's own trigger is a **`DIV`** reading "Start a post", not a `button` — a `button`-only sweep reports it missing and the feed route then looks broken when it was never clicked.

**Media: attach BEFORE typing, or the control is gone.** The sharebox does carry an image control — `button[aria-label="Add media"]`, class `share-promoted-detour-button`, sitting in the icon row under the editor — but it is rendered **only while the composer is empty**, and disappears the instant the editor holds text. A run that wrote the body first found no media button, concluded "the sharebox has no media control", and published the post bare. Order: open the sharebox → click `Add media` → `browser_file_upload` → step through the media editor → *then* fill the editor and submit. If the composer already has text, clear it (`Ctrl+A`, `Backspace`) and the button comes back.

**The media editor is also where alt text works** — unlike X and Instagram, this one is reachable. After the upload the dialog reads `Editor / Edit / Tag / Alternative text / 1 of 1`; click **Alternative text**, type into its `textarea`, and commit with the **Add** button (not "Save" or "Done" — those do not exist here). Then **Next** returns to the composer with the image attached, and the editor mounts again so the body can be typed.

**Filling needs `page.keyboard.insertText`.** `handle.type`, `keyboard.type` after a coordinate click, and even `el.focus()` reporting success all leave the Quill editor empty; insertText fills it in one shot. Quill reports a few more characters than the source (it renders `\n\n` as `\n\n\n\n`), so compare the URL and the tail rather than the exact count.

**Submitting works only through `el.click()` from `page.evaluate`.** With the body in place the Post button enables, and a coordinate click, an element-handle click and a force click all leave the activity feed unchanged — the newest post stayed a month old, while a `beforeunload` on the way out confirmed the draft was still sitting there. The untrusted JS click published immediately. Take the last enabled button whose text is exactly "Post"; the draft persists across reloads, so a failed attempt costs nothing and can be finished by hand.

Read-back: `linkedin.com/in/<handle>/recent-activity/all/` should show the post as "Feed post number 1 … now"; the permalink is `linkedin.com/feed/update/urn:li:activity:<id>/`, and the URN is in that page's HTML. **LinkedIn rewrites every link to `lnkd.in/<code>` and renders a preview card**, so a tail comparison against the source URL fails on a perfectly intact post — check that the `lnkd.in` link and the card title are present instead, and that the original URL still appears in the page HTML.

## reddit
Check: `reddit.com` — avatar in the header. Compose: `reddit.com/r/<subreddit>/submit` — title into the title field, body into the markdown/text field; set flair when frontmatter names one (some subs require it — an unset required flair blocks submission). Read-back: the subreddit's /new listing AND the user's profile — automod can remove a post seconds after it lands; removed = report to the user, never repost the same content at the same sub.

**A reddit skip is usually a decision, not a failure.** Which subreddit a promotional post belongs in — and whether that sub's rules permit it at all — is the user's call, not something to resolve by picking a plausible sub. Record `skipped` with that reason, distinct from a platform that could not be reached.

## lemmy
Check: `https://<instance-from-frontmatter>/` — avatar in the header. Compose: the community's own create-post page (`/create_post?community_name=<community>` on most instances, or the community page's Create Post control) — title, URL field when the post file carries a link submission, markdown body. Read-back: the community's /new listing and the user's profile; community moderators and instance admins both remove, so a post gone from the listing is a removal to report, never to repost.

**Deleting your own post** is the `Delete` entry in the post's own action menu on its permalink. The post stays as a "deleted by creator" tombstone rather than vanishing, so the community listing does not shrink by one — take a fresh baseline after a delete instead of reusing the count from before it.

**A community on another instance does NOT need a login there — Lemmy federates.** Posting to `!opensource@lemmy.ml` from an account on `lemmy.world` is ordinary use: the home instance's community picker lists remote communities (shown as `lemmy.ml/Open Source`, `programming.dev/Opensource`, …) and posts to them through federation. One run saw `lemmy.ml` render a logged-out header, concluded the target was unreachable and skipped the platform entirely — wrong, and it cost the post. Only check the login on the instance the account actually lives on; the target community's instance is irrelevant.

**`?community_name=…` does not survive the form.** As soon as a field is filled, the page rewrites its own query string to `?title=…&url=…&body=…` and drops the community, leaving the picker on "Select a Community" — submitting then fails or lands nowhere. Set the community **last**, through the picker, and confirm the button's label reads the community name (the URL gains `communityId=<n>`) before creating. That picker button sits low on the page (`y≈1187` on a 1068 px viewport), so scroll it into view first; its `#searchable-select-input` is `display:none` until the picker is actually open, which is why a click that "worked" can still leave the input unclickable.

Fields: `textarea#post-title`, `input#post-url`, the body is `textarea[id^="markdown-textarea-"]` (the suffix is random per page load — resolve it at runtime), and `input#register-honey` (name `a_password`) is a honeypot: never fill it.

**The image uploader is per-textarea and its id is generated, which is how a run misses it.** The create-post form carries `input[type=file][id^="file-upload-"]` whose suffix matches the body textarea's own random id — it is the markdown toolbar's image button, not a separate media field. `setInputFiles` on it uploads to the instance's pict-rs and **writes `![](https://<instance>/pictrs/image/<uuid>.webp)` into the body at the caret**, so press `Control+Home` first when the picture belongs above the text. A page-wide `input[type=file]` query at page load returns nothing useful here; resolve the id from the textarea. Read-back on the permalink: the post renders a thumbnail and the body carries the `pictrs` URL.

## tumblr
Check: `tumblr.com/dashboard` — the account/settings row renders for a signed-in user. Compose: `tumblr.com/new/text` opens a block editor — an `H1` title block and a `P` body block, both `[contenteditable="true"]`, plus `textarea[placeholder="#add tags"]`.

Three traps, all of which cost a run:

- **Tags do work, and here is the exact sequence.** The earlier note here said they were unreachable; that was a misread of two things at once. `el.focus()` **does** take (a coordinate click does not — `document.activeElement` stays on `BODY`), and the field **clears its own placeholder on the first keystroke**, so `textarea[placeholder="#add tags"]` stops matching and a run that re-queries by placeholder concludes the text went nowhere. It went in fine. Per tag: `ta.focus()` → assert `document.activeElement === ta` → `page.keyboard.type(tag)` → `Enter`. Between tags, re-find the field as the page's single `textarea` and focus it again. Committed tags render as chips, and **each chip is itself a `[contenteditable="true"]` node** — so a body-block count taken as `document.querySelectorAll('[contenteditable="true"]')` runs high by the number of tags, which is what made one run believe the tags had leaked into the post. Separate the two by rect (chips sit below the body) or by container. A `Backspace` while the tag field has focus deletes the last chip, not body text.
- **The editor restores its autosaved draft.** Reloading `/new/text` after an abandoned attempt brings the old text back, so a second type doubles the post. Check the editor is empty *before* typing, and note that `Ctrl+A` + Backspace does not clear these blocks.
- **Leaving raises `beforeunload`.** Accept the dialog to discard the draft and leave; dismissing it keeps you on the page. `page.on('dialog', d => d.accept())` inside the script handles the pair of them.

Entry point: the sidebar's `a[aria-label="Create a post"][href="/new"]`, or go straight to `tumblr.com/new/text`.

**Two things the block editor will not do by itself, and both shipped wrong in one run.** The post's image is a **featured image at the very top, directly under the title** — that is the shape of this author's own posts, and `tumblr.com/new/text` exposes no `input[type=file]` until an image block is added, so a run that only looks for one concludes there is no image support and ships text-only. Add the image block from the editor's own block control before typing the body, so the picture sits above it. And **a pasted URL is not a link**: select the words and use the popover that appears over a text selection, or the closing line publishes as dead characters.

**The image block is added with a slash command, and it works.** Click the empty `P` block, type `/image`, press `Enter` — the block appears and with it an `input[type=file][accept*="image/jpeg"]` that `setInputFiles` drives directly. The picture lands as the featured image directly under the title. (The block-inserter `+` menu still refuses every click form; the slash route is the one that works, and it is what the editor's own placeholder text tells you to use.)

**The working link recipe**: build a `Range` over the URL's own text node — `Home` then `Shift+End` selects only the *visual* line, so a wrapped URL loses its first half and only the tail becomes the anchor — assert `window.getSelection().toString()` equals the URL exactly, press `Control+k`, then fill the popover's `input[aria-label="Enter URL"]`, which arrives empty and must be typed into, and press `Enter`. Verify an `a[href]` inside the block before saving.

**Newlines inside one inserted paragraph are dropped.** A source block of five `/eli5 …` lines published as one run-on line (`…TLS work/eli5 monads/eli5 eigen…`). Where a source paragraph carries single newlines, place the caret before each subsequent line with a Range and press `Shift+Enter`, then count the `br` elements against the source's line count.

**An already-published post is editable**: `tumblr.com/edit/<blog>/<id>` opens the same block editor with body, tags and image loaded, and `Save` republishes in place — same URL, same notes. Tags, links and lost line breaks are therefore repairable without a delete-and-repost.

**The older note below is kept for the block-inserter menu only.** Three attempts in one run failed: `/new/text` exposes no `input[type=file]` at all until an image block exists, the `+` block-inserter opens a menu whose `Image` entry answered neither a coordinate click, a JS click nor focus+Enter, and a synthesised drag-and-drop onto the body dropped nothing. The post shipped text-only and was recorded `degraded`. Treat this as open: probe the block menu afresh, since labels and menu DOM drift, and if it still refuses say so in the report rather than recording a clean success — quietly shipping Tumblr without the campaign's picture is the defect `SKILL.md` names.

Submit is "Post now", and on a **freshly loaded** `/new/text` a single coordinate click on it publishes and redirects to `/dashboard`. The failure to avoid is starting with a JS `el.click()`: once that has fired, the button stops responding to every click form for the rest of the page's life, and a later run reads that as "Post now is unreachable". Load the page, type, click once. If it genuinely does not fire, `el.click()` from `page.evaluate` is the fallback — but reload first rather than stacking attempts. Confirm on `tumblr.com/blog/<name>` before recording anything; the permalink is `tumblr.com/<name>/<id>/<slug>` and an `/edit/<name>/<id>` link sits beside it.

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

**Alt text is a known dead end from the inline composer.** `[data-testid="altTextWrapper"]` is an `<a role="link">` pointing at `/compose/post/media`; the route changes but the description modal never mounts. Four approaches failed: coordinate click, manual `down`/`up`, focus+Enter, and navigating to the full-page composer. Treat X alt text as best-effort: try twice, then record the post as `degraded` in the ledger and say so in the report — **X does not allow adding a description after posting**, so the only fix is delete-and-repost. This account's owner has already ruled that trade the wrong way round: a missing alt is not worth a republish, so name it in the report and leave the post alone unless the user asks. Alt is the one thing on this list allowed to ship missing; the image itself never is. Navigating away while a draft exists raises a `beforeunload` modal — dismiss it with `accept: false` to keep the draft. SPA back (`goBack`) preserves composer text and attachments; a full `goto` does not.

## truthsocial
Check: `truthsocial.com` — own avatar and the composer on the home column; the header shows the display name and `@handle`. Compose: the composer is on the home page as `textarea#compose-textarea` ("What's on your mind?"), the visibility control reads "Post to Public", and the submit button is labelled **"Truth"**. Coordinate-click the textarea, type, coordinate-click "Truth"; the textarea empties on submit.

**Media attaches through the page's single `input[type=file]`, but the composer gives no `blob:` preview and clears `input.files`.** Both of the usual "did it attach?" probes therefore read empty on a composer that is holding the picture. One run trusted them, retried the upload four times, and published **four copies of the same image** while reporting the post as text-only; the user had to delete it. The positive signal here is the **`Add Description` control, which the composer renders once per attachment** — count its occurrences in the composer subtree and require exactly the number the post file declares, immediately before submitting. Upload once; never retry on an empty-looking probe. The general rule is in `browser-interaction.md` under *An upload's absence must be proven*.

**The `Truth` submit button sits below the fold.** With an attachment in the composer it lands at `y≈1177` in a 1068 px viewport; a coordinate click there hits the attachment image instead and the post silently does not send. `mouse.wheel` it into view, re-read the rect, hit-test with `elementFromPoint`, then click.

**The profile lags by up to an hour, and reading that lag as failure creates duplicates.** The composer cleared, and `truthsocial.com/@<handle>` plus the home feed showed nothing across several reads with scrolling and re-querying — so the post was recorded `unverified`. It had in fact published. An hour later the profile listed it, and by then a second copy had been posted on the assumption the first never landed. Two rules follow: never treat an empty Truth Social profile as evidence of absence, and never re-post here without a read-back that succeeded at least once. When the profile is empty, leave the entry `unverified`, say so, and re-check later; the correct fix for a duplicate is deleting one through the post's **More → Delete** menu, which needs the user's explicit request.

Read-back, when it works: the profile's Truths tab renders posts as `/@<handle>/posts/<numeric-id>` links, newest first, with a relative timestamp.

## wonderful-dev
Check: `wonderful.dev` — logged-in header state; the app lands on `/home`. Compose: the composer is already on the timeline — a visible `textarea[placeholder="Start typing…"]`, no dialog to open. Coordinate-click it and type.

**Submitting is solved: it is the `button[type=submit]` whose text is exactly `Post` and whose width is ~54 px.** The 28 px-wide `Media` and `Poll` buttons beside it are the composer's *type* tabs and submit nothing, which is what made this look unsolvable. Filling works with `t.focus(); t.setSelectionRange(0, t.value.length)` then `page.keyboard.insertText(text)`.

**The submit button moves once an image is attached** — from `y≈154` to `y≈1045`, below a 1068 px viewport, and it is then no longer within ~7 parents of the textarea, so a scoped search returns `null`. Search the whole document for it, `mouse.wheel` it into view, re-read the rect immediately before clicking. A stale coordinate here clicks nothing and the draft is lost on the next navigation (this composer does not persist drafts across reloads).

**The composer does take images**, through a plain `input[type=file][accept="image/jpeg,image/png,image/gif"]` present on the page — one run reported "no file input on the text tab" without ever querying for one, and shipped the post bare. `setInputFiles` on it works; the preview blob appears once the body is typed.

**The platform renders markdown *partially*, and the gap is links.** Code fences, inline code and `##` headings all render; a markdown link may or may not, and the deciding factor is the label. ``[`eli5`](https://…)`` — inline code inside the label — published as literal text, while plain `[eli5](https://…)` rendered as a real anchor on the same account minutes later. **Strip backticks from link labels here**, keep the rest of the markdown verbatim, and confirm on the permalink that `](` appears nowhere. Bare URLs autolink fine.

Deleting a post: its **Menu** control at the top-right of the card opens `Delete`, and a confirm dialog follows. Identify the target by its permalink before deleting — and where a defect is the reason, by the defect's own signature in the body as well. Verify on the permalink that an `a[href]` exists and that `[` … `](` appears nowhere in the rendered text. **Read-back here is a trap in both directions.** The composer does not clear on success, so an empty-box check reports failure on a post that landed — and, worse, counting occurrences of the body text *on the same page* counts the text still sitting in the composer, which reported a successful publish for a post that was never created. Verify on `wonderful.dev/<handle>`: open the `post/thread_<id>` permalinks and confirm one of them is the new body, since old posts live at the same URL shape and a permalink alone proves nothing.

## hackernoon
Check: `app.hackernoon.com` — the reader shell greets the user by handle, which confirms the session. Compose: in theory new draft → title, markdown body → submit for review, and **submission is the terminal state for this skill** (ledger `pending-approval`).

The editor is reachable: `app.hackernoon.com/new` redirects to `hackernoon.com/new`, whose **Start Draft** button opens `app.hackernoon.com/articles/<id>` with the full editor — `textarea.draft-title`, a `.ql-editor` body, `input.react-autosuggest__input` for tags, `textarea.excerpt` and `textarea.tldr` in the right sidebar. (An earlier run reported this button dead; a plain coordinate click on it works.)

**Submission is gated by four checks that surface one at a time**, each as a `Before submitting, …` line replacing the last, so the flow looks stuck unless you re-read that line after every attempt. In order: a **story description** (`textarea.excerpt`), at least one **tag**, the **"Is this story original on HackerNoon?" Yes/No** answer, and a **Category** (Web3 / AI and ML / Cybersecurity / Software Engineering / Business / Other). Only when that line is gone will `Submit Story` do anything.

**The sidebar holding the last two gates is unreachable by mouse at any window size.** Those controls sit at `x≈2624` and move further right as the viewport widens, because the layout scales with the window. This is the legitimate case for `el.click()` from `page.evaluate` — it cleared both. The excerpt is likewise off-viewport: set it with the native value setter plus an `input` event rather than by clicking.

**The originality answer is a claim about the user's content, not a UI step.** Answer it from what the run actually knows — a text written for this platform and not published elsewhere is `Yes`; a cross-post is `No` and wants the canonical URL. When the campaign published sibling articles on other platforms the same day, say which answer was given in the report so the user can correct it.

Read-back: the story leaves `app.hackernoon.com/drafts` on submission, which is the available evidence — HackerNoon renders no queue badge that can be read back, so record `pending-approval` and say the queue state itself is unverified.

## hashnode
Check: `hashnode.com` — the avatar and a "Write" control render. Compose: the editor takes title, markdown body, tags, optional cover and canonical URL, and the choice between the personal blog and a publication (a publication routes the draft to its editors, which is `pending-approval`, not `posted`).

**An account with no blog yet has no editor.** `hashnode.com/draft` answers "User not found" and `hashnode.com/draft/new` renders the feed shell with zero inputs. Creating the blog is an account-level decision — surface it to the user instead of clicking through it, and skip the platform for that run.

**With a blog, the entry is the Write button on `hashnode.com/drafts` — a `<button>` carrying no `href`.** `/draft` still 404s even then, so a run that only tries URLs concludes the editor does not exist. Load `/drafts`, take the button whose text is exactly `Write`, coordinate-click it, and the editor opens at `/draft/<id>`. Fields: `input[placeholder*="Article Title"]`, a TipTap body, `Add Cover` for the cover image, and `Publish` top right — which opens a preview panel whose own `Publish` finishes the job.

**The body is a WYSIWYG editor, not a markdown box — but it has a markdown paste handler, and that is the fast route.** Dispatch a `paste` event carrying the **markdown itself** as `text/plain` into `.tiptap, .ProseMirror` and the editor converts it: `##` became real `h2`s, fences became `pre`, `> ` a `blockquote` and `[t](u)` an anchor, all in one call. Verify by counting `h2` against the source's `##` markers and asserting zero literal `##` in the rendered text.

Note the title field is a **`textarea`**, not an input: `textarea[placeholder*="Article Title"]`. A selector written as `input[placeholder*="Article Title"]` finds nothing and the run stalls before it starts.

The typed-input-rule route below still works and remains the fallback when a paste handler is not present. Inserting `## Heading` as plain text publishes the hashes as literal characters; TipTap builds the heading from its own **input rule**, which fires only on a genuinely typed space: put the caret at the start of the paragraph (click it, then `Home`), delete the marker characters already there, then **type** `## ` keystroke by keystroke and watch the paragraph become an `h2` before typing on. The same applies to `- ` lists and `> ` quotes. Never write into its DOM.

**The cover image is a separate control from anything in the body.** `Add Cover` above the title opens a picker backed by its own `input[type=file]`; the campaign image goes there and the body carries no duplicate. Read-back on `<blog>.hashnode.dev/<slug>`: confirm the cover `img`, count the `h2` elements against the source's `##` count, and assert zero literal `##` in the rendered text.

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

**Upload the image first, then write the front matter around its URL — and take that URL from the upload widget, never from the page HTML.** `input#image-upload-field` (`accept="image/*"`) takes the file with `setInputFiles`. Once it finishes, dev.to renders the ready-made markdown into a **copyable `input` sitting under the upload field**, in the form `![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/<id>.<ext>)`. Read that input's `value` and parse the URL out of it:

```js
const md = [...document.querySelectorAll('input,textarea')].map(x => x.value || '')
  .find(v => /^!\[.*\]\(https:\/\/dev-to-uploads\./.test(v));
const url = md.match(/\((https:[^)]+)\)/)[1];
```

**Do not regex the page HTML for a CDN pattern.** A run that used `/https:\/\/dev-to-uploads\.s3\.amazonaws\.com\/uploads\/articles\/[\w.-]+/` matched the *first* such URL in the document — a foreign 300×299 asset belonging to another article in the editor shell — and published that image as both the cover and the in-body picture while reporting success. The upload had worked fine; only the URL was wrong. Two details make the mismatch invisible to that kind of regex: the real host is **`s3.us-east-2.amazonaws.com`** (not the bare `s3.amazonaws.com` other assets use), and the file **keeps its original extension**, so a JPEG upload yields `.jpg`, not `.png`.

Whatever URL you end up with, **prove it is yours before publishing**: open it and check the pixel dimensions against the source file. That single check would have caught this.

That URL then goes in **two** places: `cover_image:` in the front matter, and an ordinary markdown image on the first line of the body, before the first `##`:

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

**A title is mandatory — `Publish` carries `aria-disabled="true"` until the field has one**, and the button looks merely faded rather than disabled, so a run can click it repeatedly and read the silence as a broken control. Where the post file has no title, take one from a sibling file in the campaign folder (the `devto` / `hashnode` / `medium` / `substack` units always open with an H1) rather than reaching for the post's own first sentence — see `post-formatting.md`.

**This editor displaces characters during paragraph-by-paragraph insertion.** One run published-to-draft with `very little tex`, `/eli5 Fourier trans` and a closing URL ending `…/eli5formst` — the three missing fragments concatenated onto the link. Diff every `<p>` against its source paragraph before publishing and repair in place; the total length matches even when three paragraphs are broken.

Playwright's own `.click()` times out on both fields (actionability never settles); **coordinate clicks work**, aimed at the top of the element's rect rather than its centre for the tall body div. Visibility (public vs members) is set by the frontmatter, and no frontmatter value → ask, don't default. Read the audience radios back before publishing: `Free access` / `Everyone` is the public state, `Paid access` is not.

**The image goes in the post body and must stay out of Attachments.** The editor's toolbar has `Image`, which opens a drop zone ("Drop an image, video or audio file as the main content of your post"); that zone's own input is the one whose `accept` starts `image/jpeg,image/png` — the first `input[type=file]` inside it has `accept="*"` and is the **attachment** uploader, which publishes the file as a download link under the post instead of showing it. Picking the wrong one ships the picture twice: once as the visual, once as a stray `v02.png` in an Attachments list. Match the input by its `accept` starting with `image/`, and after publishing check the post page has no Attachments row. Read-back: publishing navigates to `patreon.com/<handle>/posts/<slug>-<id>?pr=true`; strip the query for the permalink, and confirm no "Join to unlock" gate is present — though as the creator you see the body either way, so a public/members claim rests on what was set, not on what you can see.

## ko-fi
Check: `ko-fi.com/Manage/` confirms the session, but **the composer is not there** — it lives on the creator's own page, `ko-fi.com/<handle>`. `/Manage/newpost`, `/post/new` and `/Manage/feedposts` all redirect back to `/Manage/`, which is what makes this look unreachable.

**The short path is `button.quick-update-btn` — "Write a quick update…" — sitting directly on `ko-fi.com/<handle>`.** One coordinate click on it reveals `textarea#postUpdateTextBox` (visible, ~66 px) and `#postUpdateButton`, with no modal involved: fill with `insertText`, attach through the composer's `input[type=file][accept=".jpeg,.jpg,.png,.gif"]`, click `#postUpdateButton`, done. A run that went hunting for the Create dropdown instead spent its whole budget on a modal that stays 0 px and reported the platform unreachable. Try this first; the dropdown route below is the fallback.

The dropdown sequence, if the quick-update button is absent:

1. On `ko-fi.com/<handle>`, take `button.creator-menu-btn` (the "Create" dropdown, `data-toggle="dropdown"`). Trusted clicks do nothing on it; **`el.click()` from `page.evaluate` opens it** — it is a Bootstrap toggle listening for a plain click event.
2. In the dropdown, "Post something" opens the modal `#addContentMenuModal`, whose row reads `Post · Image · Blog post · Video · Poll · Audio`. The number displayed in that modal is the **character cap: 800**.
3. Clicking "Post" in the modal makes `textarea#postUpdateTextBox` visible (it exists but has zero height until then, which is why an earlier run reported it invisible and gave up). **This modal frequently stays 0 px under automation** — when it does, fall back to the quick-update button rather than retrying it.
4. Filling it needs the same trick as the rest of the page: `t.focus(); t.setSelectionRange(0, t.value.length)` in-page, then `page.keyboard.insertText(text)` — which also replaces whatever is already there. `handle.type`, `keyboard.type` and coordinate clicks all leave it empty, and `Ctrl+A`+Backspace does not clear it.
5. Submit is `#postUpdateButton`, again via `el.click()` from `page.evaluate`; the textarea clears on success.

**A body over 800 characters belongs in a Blog post, not a quick update — and that is the user's call, not a silent truncation.** `textarea#postUpdateTextBox` carries a hard `maxlength="800"`, so a long-form unit written for this platform simply cannot go through the feed composer. Ko-fi's own `Blog` entry (`a[href="/blog/editor?back=true"]` on the creator page) opens a full editor: `#blogPostTitle`, a Froala body (`.fr-element.fr-view`), `#featuredImage` for the cover, `#tags`. Raise the choice with the user — blog post, trim to 800, or skip — rather than deciding for them.

**The blog editor's `Publish now` does not fire under automation.** It sits behind a split button whose dropdown opens (via `el.click()` from evaluate, and by coordinate), the `Publish now` item hit-tests true, the click lands — and the post stays a draft, twice over. Everything else works: title, body, featured image and tags all save. Record `failed`, hand the user the draft URL, and do not spend more of the run on it.

**Froala displaces characters the same way Patreon's editor does** — four blocks lost their tails to the closing URL in one pass (`use few wor`, `database index`, `gradient desce`, `game theo`, with `ryntesds` appended to the link). Diff every block before publishing.

**The 800-character cap truncates silently.** A body of 805 characters came back as 800 with the tail of the URL gone — the same failure shape as `peerlist`, except here the number is on screen. Fit the post to 800 before typing, then verify head and tail.

**Through the quick-update composer the image needs no modal at all.** `ko-fi.com/<handle>` carries `input[type=file][accept=".jpeg,.jpg,.png,.gif"]` beside `textarea#postUpdateTextBox`; `setInputFiles` on it shows a thumbnail in the composer and the picture publishes with the update — verified end to end. That `accept` is a list of **extensions**, not MIME types, so a query filtering on `accept*="image/"` finds nothing and reports the composer text-only. Match on the input's presence inside the composer, not on the shape of its `accept`.

**The image is added inside the same modal, before submitting.** The modal that appears after "Post something" carries a row of content types — `Post · Image · Blog post · Video · Poll · Audio` — and choosing `Post` reveals the text box. The image control lives in that same modal; find its input by an `accept` containing `image/` **scoped to `#addContentMenuModal`**, not page-wide. A supporter update shipped without one stands out on a feed where the author's other posts have pictures, so a missing image control is a reason to re-read the modal rather than to submit text-only.

**The dropdown item is reached by coordinate, not by JS click.** `button.creator-menu-btn` opens the site's own nav, not this menu: the one that matters is the `Create` control carrying `data-toggle="dropdown"`, and its `Post something` entry only becomes clickable once the dropdown is open — an `el.click()` on the entry while it is collapsed silently does nothing. Open the dropdown, read the entry's rect, then coordinate-click it; the modal's own `Post` tile likewise needs its live rect.

Read-back: `ko-fi.com/<handle>/posts` shows the update; ko-fi exposes **no per-post permalink** in the feed, so record the posts page and say so. That also means a defective ko-fi post cannot be handed back as a URL — finding it again for an edit or a delete goes through the user's own feed — so get this one right before submitting rather than counting on a repair.

## bastyon
Check: `bastyon.com/index` — when the app hydrates, the feed renders with the account link and a PKOIN balance, which is the only signed-in signal available. The composer a user sees is a field with `placeholder="What's new?"`.

**Hydration is slow, not broken.** A first load often returns an empty `body.innerText`; reload with `waitUntil: 'load'` and wait ~15 s and the feed appears (PKOIN balance visible = signed in). Do not conclude the PWA is dead from one empty read.

**The composer fills only through `focus()`.** The body is `div.emojionearea-editor.pastable` (an EmojiOne Area editor, ~660×60 when collapsed). A mouse click on it leaves `document.activeElement` on `BODY` and every keystroke is lost — which is what made an earlier run report the composer unusable. What works: `el.focus()` in-page, confirm `document.activeElement === el`, then `page.keyboard.insertText(body)`. Once text lands the composer expands, auto-detects a URL into a `.linkcnt` preview card, and reveals `input.captionshare` and a tags field.

**The draft lives on the profile route, not the feed.** An abandoned attempt leaves the composer full at `bastyon.com/<handle>?read=1`; a run that only reloads `/index` sees an empty feed composer and believes nothing was written. Check the profile route before composing anything, or you will type a second copy over a draft that needed one click.

**A tab that has stopped hydrating never recovers — open a new one.** After a long session this app returned `document.body.innerText.length === 0` on every route, through reloads, cache-bypassing reloads and 20-second waits, while the same browser rendered Bastyon normally for the user. A fresh tab via `browser_tabs` booted the app in seconds, draft intact. An empty body on a route that worked earlier in the run means a new tab, not another reload.

**The post needs a category, and the refusal is one red line beside the button.** `div.dopost` inside `.common_share_article_wrapper` is the right control (the several `div.post.shadow` elements that also read "Post" are feed cards). An earlier run clicked it by coordinate, by JS `el.click()`, by inner node and by element handle across two sessions, watched nothing happen, and concluded that Bastyon signs each post with the account key pair and cannot be automated. There is no such signing prompt. A screenshot showed a red **"Please add Tags"** beside the button the whole time: Bastyon requires a category. Open the category control next to the composer, pick the one that fits (`Technology`, `Science`, …), and the next ordinary coordinate click on `div.dopost` publishes. **When a submit does nothing, screenshot it and read the validation text before climbing the click ladder.**

**An upload that never finishes hides the submit entirely.** In one run the image reached the composer (its thumbnail rendered at the right dimensions) but the `.spinner` in `.item.images.upload.dropZone` never cleared, and `div.dopost` stayed inside a `postWrapper` with `display: none` through 30 s of polling — so there was no Post control to click and no validation message to read, only a hidden one. That is a different failure from the "Please add Tags" refusal below: check the spinner and the `postWrapper` display before concluding the button is unreachable, and record `failed` with the draft left on the profile route rather than retrying the upload.

**The image input is in the composer and finding it takes one query.** Attach through the `input[type=file]` inside `.item.images.upload.dropZone` in the share wrapper — scope to the wrapper, since the page carries avatar and cover uploaders too. Attach before typing; the thumbnail appears in the composer and the picture publishes above the text. A composer offering no visible media button is not evidence of no media support: enumerate the file inputs.

## buymeacoffee
Check: **`studio.buymeacoffee.com/posts`**, not `buymeacoffee.com` — the marketing homepage shows "Log in / Sign up" to a fully signed-in user, so checking there reports a false logged-out. The studio page also carries the read-back baseline: a "Published N" counter.

**Compose at `www.buymeacoffee.com/posts/create` — the `www.` is load-bearing.** Navigating to `buymeacoffee.com/posts/create` without it bounces to `/login` even with a live studio session, which one run read as "the main domain has no session" and skipped the platform. The studio's own Create control points at the `www.` form; follow that link (or type it) and the editor opens signed in. Also **not** `studio.buymeacoffee.com/posts/new`, which is a different, unusable editor.

Getting either of these wrong is what made this platform look unpublishable. The two routes are different editors. The `studio…/posts/new` one carries `#post-title`, a `.pe-editor` ProseMirror, a `.post-editor-sidebar`, hidden state flags (`#is_title_typing`, `#publish-status`) and a reCAPTCHA frame, and its publish never fires under automation — the `Publish now / Set publish date / Save as draft` dropdown stays `display:none` however it is clicked, and the string "Add a title to your post before continuing" sitting on the page is a permanent hover tooltip rather than a validation state, so it reads like a blocked form when nothing is blocked. Do not debug that page. Reach the working editor by pressing **`Post`** under "Create a new post" on `studio.buymeacoffee.com/posts`, or go straight to `buymeacoffee.com/posts/create`.

The working editor, verified end to end:

- **Title**: `input[placeholder="Title"]` — no id, ordinary click-and-type works.
- **Body**: `div.tiptap.ProseMirror` — a TipTap editor. Coordinate-click it, then type paragraph by paragraph with `Enter` between; the breaks survive and emoji arrive intact.
- **Toolbar**: ten `button.option-button` icons in a row under the title, unlabelled in the DOM (no `aria-label`, no `title`, only path data) but ordered **Bold · Italic · Underline · Link · Heading · Bullet List · Block Quote · Image · Embed · Code Block**. Take them by index off `document.querySelectorAll('button.option-button')`, and **re-read the rect immediately before every click** — a `scrollIntoView` on the body moves the toolbar off its earlier coordinates, and a click at a stale `y` silently hits nothing. Hovering a button surfaces its name if the order ever changes.
- **Publish**: a plain `button` reading `Publish now`, top right. No dropdown, no second modal, no category requirement, and no validation warning once title and body are filled.
- **Audience**: the sidebar reads "Who can see this post?" with `Public` selected; read it back before submitting.

**Image (index 7).** Clicking it opens a file chooser, but the page also carries one `input[type=file][accept="image/*"]` that `setInputFiles` drives directly, which avoids the chooser entirely. TipTap inserts at the caret, so press `Control+Home` first when the picture belongs at the top — which for a supporter post it does. The upload returns a `cdn.buymeacoffee.com/uploads/project_updates/…` URL and the image lands as its own block above the text.

**Link (index 3).** Select the words with a Range over the text node — `range.setStart/setEnd` on the URL substring, then `selection.addRange` — click the Link button, and a popover appears carrying `input[placeholder="Enter a URL..."]`. Type the address and press `Enter`; the selection becomes a real `<a href>`. Skip this and the closing URL publishes as dead text.

TipTap **does** honour a programmatic Range here, unlike Medium — but two things still go wrong. Inserting the image scrolls the page, so the toolbar leaves the viewport and a click at its old coordinates hits nothing: **scroll back to the top, re-establish the Range (scrolling drops the selection), re-read the toolbar rect, then click.** And `End` moves to the end of the *visual line*, not the paragraph, so on a wrapped paragraph a `Shift+ArrowLeft × len` selection grabs the wrong span — the Range over the text node is what makes this exact.

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
7. **Alt text is not reliable, and getting it wrong is expensive.** Expand the **Accessibility** accordion by clicking the rect of its `[role="button"]` ancestor (the bare text node is not clickable, and it often needs a second deliberate click after `scrollIntoView`); on a Russian UI the field was `input[placeholder*="льтернативный"]`. On an English UI in a later run the accordion opened and **no alt input existed at all** — the only visible text inputs in the dialog were `aria-label="Add location"` and `aria-label="Add collaborators"`. **Never fall back to "the first visible text input"**: doing that typed the alt text into the location field, which had to be selected and cleared before sharing. Match the alt field by its own placeholder or `aria-label` and nothing else; two attempts, then share without it and record `degraded` — the user has accepted a missing Instagram alt as a non-defect, so never delete-and-repost over one.
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

## vk-wall
Check: `vk.com` — own page reachable. Compose: the wall composer on the target from frontmatter (own wall or a community — for a community, posting rights must exist; a missing composer = report, skip). Read-back: the target wall.

`vk.com` redirects to `vk.ru`; both appear in URLs and neither indicates a problem. Admin rights on a community show as a "Manage" / "Керування" link in the right column — that is the posting-rights probe.

**The composer is not on the page until you open it.** There is no inline wall input on a community page: click the **Create** button above the feed, then pick **"Post"** from the sheet that opens (`[data-testid="dropdownactionsheet-item"]`, the first entry). Both of these defeat `browser_click` — use coordinate clicks, and focus+Enter as the fallback. Then the editor is `[data-testid="posting_base_screen_input_message"]`.

**The file-input trap that cost a public artifact.** A community page carries three `input[type=file]`. The page-level `accept="image/jpeg,image/png,image/gif"` one is the **photo-album uploader**: `setInputFiles` on it publishes the image into the community album and navigates to that album, destroying the composer draft. The composer's own input lives inside the New-post dialog and its `accept` contains `video/*`. Always scope to the dialog and disambiguate by `accept`; verify the preview appears inside the composer and that `location.href` did not change.

Publishing is two steps: **Next** ("Далі"/"Далее") → a settings screen → **Publish** ("Опублікувати"/"Опубликовать") — match the *exact* label, since "Publish as story" sits beside it. Opening the composer from the community page posts as the community; there is no author selector to set. VK autosaves drafts, so a composer reopened after an interruption comes back with its text — check what is already in the field before typing, or you will double it. A URL in the text auto-attaches a link snippet card, which the image attachment then replaces; that is expected and the URL stays in the body.

Read-back: the newest `article` on the wall, its `/wall-<owner>_<id>` permalink and its "just now" timestamp. Album ordering is **not** ID-ordered — the highest photo ID in a long album was item #40 of 233 — so for anything album-related use a count baseline instead.


## nostr
Check: the web client named in frontmatter — the user's own profile and a composer are reachable, and the client reports a signing method. **Key material is never touched**: no seed, no `nsec`, no private key is requested, read, pasted, or stored, and a signing-extension prompt (NIP-07 style) is handed to the user exactly like a captcha. Compose: the client's composer; media is usually uploaded to a separate host by the client's own upload control. Publishing broadcasts to relays, so propagation is not instant and not uniform. Read-back: the user's own profile feed **on that same client**, since a note visible on one client's relay set may not have reached another's — that is normal propagation, not a failure, and the ledger records which client confirmed it.

## threads
**The domain is `threads.com`** — `threads.net` still resolves but the app and every permalink live on the new host. Compose: like Bluesky, the reliable path is the intent route — `https://www.threads.com/intent/post?text=<encodeURIComponent(body)>` opens the composer prefilled and correctly counted.

**An emoji can arrive broken through the intent route, and it publishes broken.** One run shipped `…in the same folder �` — the replacement character, not the emoji — because an astral-plane codepoint did not survive the round trip into the composer. So after the intent route fills the editor, **compare the composer's text against the source character for character** rather than only by length, and check specifically that every emoji is still the emoji: search the field for `�`. Found one → clear the editor and type the body in directly instead of trusting the URL, or type the plain text through the intent route and add the emoji by keystroke afterwards. The same check applies to Bluesky's intent route for the same reason. Submit is the **last** button reading "Post" inside `[role="dialog"]` (the first one is the composer's own entry point); coordinate-click it and wait for the dialog count to drop to zero. Read-back: `threads.com/@<handle>`, newest `/post/<code>` link, and exactly one occurrence of the body text.

Check: the Threads web app — the user's avatar and the composer entry on the home column. The account is an Instagram account: the session usually rides along with Instagram's, and the handle is the same one, so an Instagram login check is a strong prior but not proof — verify on Threads itself. Compose: the composer, type, attach through its own file input (scope to the composer's dialog — the page carries other uploaders), publish. Unlike Instagram, links in the body are clickable and media is optional. A reply chain is separate sequential posts through the composer's add control, only when the post file is explicitly a thread. Read-back: the user's own profile feed, newest post, its permalink opened and confirmed.

## telegram
Check: the Telegram web client — the chat list loads and the user's own account is present; a phone-number or QR screen means logged out, and **login here is never automated under any circumstance** (it is a phone code, and asking for one is asking for account access). Compose: open the channel or group from frontmatter — posting rights are required and their absence shows as a missing message box, which is a report-and-skip, not a UI drift. Type into the message box, attach media through the client's own attach control. **Enter sends by default** (the client's setting can invert it), so internal newlines are `Shift+Enter` and the send happens once, at the end — otherwise a multi-line post arrives as one message per line to every subscriber, and every one of them gets a notification. The media caption cap is a different number from the plain message cap; the campaign's Phase 3 research carries both. Read-back: the channel's last message, its timestamp, and its permalink — `t.me/<channel>/<id>` for a public channel, the `t.me/c/…` form for a private one. Telegram allows editing after posting; only on the user's explicit request.

## peerlist
Check: `peerlist.io` — redirects to `/scroll` when signed in and the header carries the user's first name. Compose: the "Post" button on `/scroll` opens a dialog with `textarea[placeholder="Title (optional)"]` and a `[contenteditable="true"]` body; submit is the dialog's own "Post" button, with "Schedule Post" sitting immediately to its left — match the exact label, not a substring.

**Peerlist truncates the body on publish, silently.** A 495-character body was accepted by the composer, submitted without warning, and published cut two characters into its closing URL (`…/cross-session-messagi`). There is no counter in the composer and no error. So: keep the body at **400 characters or less**, never end on the link when the platform can eat it, and after publishing compare the post's *tail* against the source rather than searching for a phrase from the middle — a mid-text match confirms a truncated post just as happily as a whole one.

**The cap is 480 characters and the Post button enforces it** — measured by probe: 400 enables it, 500 disables it. An over-length body is therefore a stop before anything is typed, not a truncation to discover afterwards. Check the source length against 480 during the source scan and raise it with the user; trimming their copy is their call.

**There is no edit, and republishing can fail silently — so get the post right the first time.** The post's `⋮` menu offers only `Copy Link` and `Delete`. Worse, two clean republish attempts (fresh dialog, image attached, body verified, anchor verified, `Post` enabled and hit-tested, dialog closed afterwards) created **nothing** — the profile listing and every permalink probe showed only the original. Nothing duplicated, which is the saving grace, but a defect published here is effectively permanent. That makes the pre-submit format gate load-bearing on this platform above all others.

**The linkifier is real but fussy.** Other accounts' posts carry working anchors, so peerlist does linkify — but only for a URL that was **typed with real keystrokes and followed by a space**. `insertText` of a body ending in a URL publishes dead text. Insert the body up to the URL, press `Control+End`, type the URL with `keyboard.type`, type one space, and assert an `a[href]` inside the composer before submitting.

**The permalink does render the body now** (`/scroll/post/<id>`), contrary to the older note below — it just needs ~10 s. The profile listing is the flakier surface: consecutive loads return different subsets, so count a post as present only after two loads agree.

**The post cards nest, which makes deletion by position unsafe.** On `/<handle>/posts` a card's action menu cannot be attributed to a card's text with confidence, so "delete the older duplicate" is a guess dressed as a step. Identify the target by its own id — from the permalink or a `data-*` attribute — and where that does not resolve, leave the post standing and tell the user. One run did exactly that rather than risk removing the wrong post; the duplicate is still live and named in the report.

**The dialog has a file input, and it is easy to write off.** No camera icon is obvious in the composer's first render, but the dialog carries an `input[type=file]` with an `image/` accept — enumerate the inputs inside the dialog instead of hunting for a button. **Attach before typing**: the upload re-renders the dialog and a body typed first can be lost. A successful upload shows as a thumbnail in the dialog and publishes as a `cloudfront` `img`; confirm it on the listing, never in the composer.

Read-back: use **`peerlist.io/<handle>/posts`**, which lists the post reliably. The `/scroll/post/<id>` permalink renders page chrome only and never the body, however long you wait — reading that as failure is a false negative. On the listing the body is collapsed behind a **`Read More`** control: click it before comparing the tail, or an intact post looks truncated. The scroll feed itself is virtualized, so read any permalink in the same evaluate that finds the text — a second call finds the node already recycled and returns nothing.

## daily-dev
Check: `app.daily.dev` — signed-in state, the user's avatar in the header. A bounce to the marketing site means the session is logged out; report it and skip rather than guessing at a target.

**The composer is `daily.dev/squads/create`, and the path name lies.** That route's page title is **`Create post`** and it opens the post composer as a modal — the `+` in the left sidebar and the profile's `New post` button both point at it. A run that read the path as "create a squad", saw `/posts/new` return 404, and concluded the platform no longer allows profile posts was wrong on both counts and skipped the platform.

Modal contents: `textarea[name="title"]` (placeholder `Post title…`), an `Add cover` button backed by the page's **first** `input[type=file]` (the second, `name="content_upload"`, belongs to the body toolbar), a `.tiptap.ProseMirror` body, a `Free form` type selector, a toolbar (image · link · mention · GIF · bold · italic · lists), and the audience control top-left showing **`Everyone`** by default — which is the personal-profile post the plan wants. Submit is the modal's `Post` button; it navigates straight to `daily.dev/posts/<slug>` and the item appears on `daily.dev/<handle>` under Posts.

**This composer restores a draft.** It came back holding a *different platform's* body from earlier in the same run, and the HTML paste landed in the middle of it, producing one post made of two. Clear the body (`Control+a`, `Delete`, read the length back as 0) **and** the title field before filling, or the title doubles.

The body takes an HTML paste like the other ProseMirror editors — headings, code blocks, lists and anchors all survive.

Compose, legacy note: `New Post` (or `+`) from anywhere on the site, which posts from the personal profile. An original post takes a title and a Markdown body with code blocks; a link post takes the URL of an article already published elsewhere. Where the composer offers an audience, choose everyone, not a squad. **Community Picks is gone** — sunset in 2025 — so there is no separate submission mechanism to look for.

Squad path, only when the post file's target names one: go to that squad's page, where posting rights are required and their absence shows as a missing composer (report and skip). A link already present in the feed is deduplicated by the platform — resubmitting is not a fix, it is a report.

Read-back: the user's profile Posts tab, or the squad feed where one was named, the item visible with its timestamp and permalink.

**Before submitting, confirm the user has seen the AI-content rule.** daily.dev prohibits AI-generated content. If nothing in the run records the user's decision to publish this text as their own after editing it, stop and ask rather than posting — this is one of the few places where publishing quietly can cost the account, not just the post.

## minds
Check: `minds.com/newsfeed/subscriptions` — the rail renders Newsfeed / Boost / Wallet and the `@handle` entry. Compose: the composer sits on the newsfeed as `textarea.m-composerTextarea__message` ("Speak your mind...").

**Keystrokes only reach it through an element handle.** A coordinate click plus `page.keyboard.type` leaves the value empty and both "Post" buttons disabled, and so does `el.focus()`; `page.$('textarea.m-composerTextarea__message')` then `handle.type(text)` fills it correctly first try. The enabled submit is not in the page-wide button sweep either — walk up from the textarea (about five parents) to the composer container and take the "Post" button inside it.

Read-back: `minds.com/<handle>/` shows the post and the full URL text; the permalink is the `/newsfeed/<numeric-id>` anchor. Never touch Boost, Wallet, Supermind or Minds+ controls — the token layer sits next to the composer and none of it is part of posting.

## medium
**The body goes in as an HTML paste, and one-line paragraphs need fusing first.** `medium.com/new-story` exposes a single `div.postArticle-content [contenteditable="true"]`: type the title, press `Enter`, then dispatch a `paste` event carrying `text/html` — headings become `h3`/`h4`, fences `pre`, quotes `blockquote`, `[t](u)` a real anchor. But Medium puts a full paragraph gap under every `<p>`, so a source that writes rhythmic one-line paragraphs (`Browser.` / `Resolver.` / `Root.`) publishes as a stretched wall the author will not recognise. Fuse runs of three or more consecutive paragraphs of ≤32 characters into one block joined by `<br>` before pasting — see `post-formatting.md` for why that threshold and not 35.

**An already-published story is editable and the button says `Save and publish`.** `medium.com/p/<id>/edit` loads the live story; merging paragraphs there is `End` → `Delete` (pulls the next paragraph up) → `Shift+Enter` (puts the break back), repeated per merge, and the paragraph count is the check that it took.

Check: `medium.com` — avatar and the write control. Compose: `medium.com/new-story` gives a title editor and a body editor, both `[contenteditable="true"]`; a publication target routes the draft to that publication's editors instead of publishing, which is `pending-approval`, not `posted`. Set the canonical URL when the piece mirrors the user's own blog. Confirm the paywall setting matches what the post file expects before publishing.

**`medium.com/new-story` sometimes never initialises its editor.** The two `[contenteditable]` nodes exist, the placeholders read "Title" and "Tell your story…", clicks land — and every keystroke goes nowhere, with the URL staying `/new-story` instead of becoming `/p/<id>/edit` (that URL change is the signal a draft was actually created). Element-handle clicks, forced clicks and coordinate clicks on the title node all fail identically. There is no fix from the page: reload once, and if the URL still does not turn into `/p/<id>/edit` after typing, work on an existing story's `/edit` route instead, where typing behaves normally.

**On `/p/<id>/edit` the contenteditable is an ANCESTOR of `section`, not a descendant.** `document.querySelector('section').querySelectorAll('[contenteditable]')` returns `0` and reads exactly like "this page is not editable", which is how one run concluded the editor was dead. The node is `div.postArticle-content[contenteditable="true"]` and `document.body` carries `is-postEditMode`; check for those. Typing on this route works with an ordinary `page.mouse.click` into a paragraph — no ladder needed.

**Headings: the `## ` shortcut does not fire, and `Control+Alt+Digit2` does — but only with a real caret.** Typing `## ` at the start of a block, even slowly, leaves the hashes as literal characters in the `<p>`. The shortcut that works is `Control+Alt+Digit2` (editor `h4` = section heading, published as `h3`; `Digit1` is the larger `h3`/`h1` title level). It fires **only** when a real mouse click has placed the caret in the block — `range.selectNodeContents(p)` plus the same shortcut does nothing, and `execCommand('formatBlock')` converts the DOM but is never persisted. The full recipe and both failure modes are in `browser-interaction.md` under *Formatting a rich editor*. Per heading: `mouse.wheel` the paragraph into view, re-read its rect, `mouse.click`, `Home`, `Shift+End`, assert `window.getSelection()` equals the heading text, then `Control+Alt+Digit2`. Verify on the **published** page (`h3` count), not in the editor.

**`--` autocorrects into an em dash**, so `claude --worktree` publishes as `claude — worktree`: the command is wrong and the campaign's zero-em-dash rule is broken in one stroke. Prefer the flag's short form (`-w`) when writing for Medium, and sweep the body for `[—–]` before publishing. Repairing it needs the **whole block replaced**, not a line edit: `Home` + `Shift+End` selects only the visual line and leaves the paragraph's tail behind (that mistake produced `…enforced rather than agreed.and claude — worktree frontend…`). Select the block with a Range over the `<p>` — `range.selectNodeContents(p)` through the selection API — then `Backspace` and retype.

**The closing URL is not a link until you make it one**, and **the image is not there unless you insert it**. For the link: select the words, use the editor's link control on the selection. For the image, the exact sequence: click into the first body paragraph, `Home`, `Enter` (this opens an empty block above), `ArrowUp` into it — now a 32×32 `button[aria-label^="Add an image, video, embed"]` appears in the left margin. Click it and the row expands into `Add an image` / `Add an image from Unsplash` / `Add a video` / `Add an embed`; clicking **Add an image** opens the native file chooser, so finish with `browser_file_upload`. There is no `input[type=file]` in the DOM at any point, so a probe that only looks for one concludes the editor cannot take pictures. Medium has no cover field to compensate, so skipping this ships an article with no picture at all.

**Editing a published story does not update it until you republish.** On `/p/<id>/edit` the header carries `Done editing` and a `data-action="republish"` button whose visible label is **"Save and publish"**. Autosave persists the edit to the draft only — the live article keeps its old body, which is easy to misread as "the edit did not apply". Click that button, then re-fetch the canonical URL: the first load right after republishing can still serve the previous render, so confirm on a fresh navigation rather than on the redirect target.

Read-back: the published article URL, opened and confirmed — headings rendered as headings, zero literal `## `, zero `[—–]`, the closing link clickable, the image present. Note the published image host is `miro.medium.com`, not the `cdn-images-1.medium.com` the editor shows, so match on either.

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

**Where the account has its own publication, `Create → Article` lands in that publication's editor — and email is ON by default.** The route is `<blog>.substack.com/publish/post/<id>`, the page title reads "Editing newsletter", and the settings panel behind `Continue` shows **`Send via email and the Substack app` already checked**. Publishing from there without touching it mails every subscriber. Uncheck it (the a11y route works where a coordinate click on the row does not: find the checkbox by its accessible name and click that node), confirm the Scheduling line changes from "Schedule time to email and publish" to "Schedule time to publish", then `Publish now`. **A second modal follows** — "Do you want to send this post via email?" with `Publish on web only` and `Also send via email` — and until it is answered nothing publishes and the Published list stays empty. Answer `Publish on web only`. A run that navigated away while that modal was up left the article a draft and had to redo it.

**Editor mechanics, both surfaces.** Headings do convert from the `## ` shortcut typed at the start of an empty block, unlike Medium — verify anyway that the body holds zero literal `## `. Two things do **not** happen on their own:

- **The closing URL stays plain text**, and Substack does not auto-link it on publish — one run shipped the article with a dead `https://…` in the body. Recipe: real `mouse.click` into the paragraph, `End`, then `Shift+ArrowLeft` once per character of the URL, assert `window.getSelection()` equals the URL exactly, then click the toolbar's `button[aria-label="Link"]`. The popover carries two fields: `Enter text…` arrives prefilled from the selection, and **`Enter URL...` is empty and must be filled** — type the address there and press `Enter`. Verify an `a[href]` exists in the body before publishing. (`End` is safe here only because this paragraph does not wrap past the URL; on a wrapped line use a Range over the text node instead.)
- **Editing an already-published post needs `Update` → `Update now`**, and the same `Publish without buttons` modal appears again; the landing URL gains `?alreadyPublished=true` when it lands.
- **The image has to be inserted, and the toolbar is contextual.** The top toolbar renders `button[aria-label="Insert image"]` only while the caret is inside a body block; `Control+Home` moves the caret somewhere that dismisses it, which is how one run concluded the control "disappears when the caret moves" and shipped without a picture. Working sequence: real `mouse.click` into the first body block → `Home` → `Enter` → `ArrowUp` (empty block, caret still in the body) → click `Insert image` → a submenu opens with `Image` / `Stock photos` / `Generate image` → click **`Image`**, which opens the native file chooser (`browser_file_upload`). The only `input[type=file]` in the DOM is `.file-sidebar-item-hidden-file-input`, which belongs to the draft sidebar — setting files on it does nothing to the body. Confirm afterwards that the body holds an `img` with a `substackcdn.com` src.

**A cleared composer is not a publication here.** One run stopped one step short, left the article in draft and recorded a success — the editor looks the same either way. Confirm on the post's own page or the dashboard listing that the item reads published, never in the editor.

**The publish confirm has a second step that is easy to miss.** `Continue` opens the settings panel; the send/publish button there ("Send to everyone now" on the publication path) can raise a further modal — one observed variant is **"Publish without buttons"**, shown when the post carries no subscribe button. Until that modal is answered nothing is published and nothing is sent, and the Published list stays empty. Poll for it and answer it rather than reading the empty list as failure and retrying.
