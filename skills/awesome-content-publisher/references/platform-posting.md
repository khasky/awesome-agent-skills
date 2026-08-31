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

**The share dialog can refuse to mount at all.** On a feed rendering with ~190 console errors, the button was present on the first probe and gone on the re-render; a coordinate click opened nothing, `el.focus()` reported `focus-failed`, and `linkedin.com/feed/?shareActive=true` produced zero `[contenteditable]` nodes and zero dialogs. Nothing about this is a selector to fix — it is the page failing to boot its composer. Two attempts and a route attempt, then record `failed` and move on; retrying it later in a fresh tab is a better use of the run than climbing further.

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

Submit is "Post now". A click that leaves the page on `/new/text` with the text still in the blocks did **not** publish — confirm on `tumblr.com/blog/<name>`, where the newest post must be the new one, before recording anything.

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

**The submit control has no label.** The visible "Post" text at the top of the page is the composer's *type* tab (Media / Poll / Post), and clicking it does nothing to submit — the first attempt left the text sitting in the box and published nothing. The real control is the single `input[type=submit]` inside the textarea's own form, roughly 32 px wide with an empty label: find it by scoping to `textarea.closest('form')`, then coordinate-click its rect. Read-back: the timeline shows the post immediately; the composer does **not** clear on success, so an empty-box check reports failure on a post that landed — verify by the body text appearing under a `wonderful.dev/<handle>/post/thread_<id>` link instead.

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

## hackernews
Check: `news.ycombinator.com` — the header carries the username and a `logout` link when logged in (`#me` holds the name). Compose: `/submit` — plain HTML form, `input[name=title]`, `input[name=url]`, `textarea[name=text]`; the form takes url **or** text, not both. Ordinary coordinate clicks and typing work; no SPA fights here.

**Check the URL is not already on HN before submitting.** A duplicate URL does not create a post: the form redirects to the existing item, and HN counts the attempt as an **upvote from your account on someone else's submission** — an outward-facing side effect the run never promised, visible as the header switching to `unvote` on that item. This happened on a docs URL that had been submitted three weeks earlier. So search `hn.algolia.com` (or submit and read the redirect) and treat a redirect to an existing `item?id=` as `skipped`, not `posted`, log the vote as an incident, and ask the user whether to unvote — never unvote on your own initiative. Read-back for a real submission: `/submitted?id=<user>` plus the item permalink; the site's filters can kill a new submission within minutes, and `/newest` not showing it while the profile does means exactly that. New accounts and repeat domains draw the filter hardest.

## patreon
Check: `patreon.com` — redirects to `patreon.com/c/<handle>` with a Dashboard link when the creator session is live. Compose: **`patreon.com/posts/new` immediately creates a draft** and lands on `patreon.com/<handle>/posts/<id>/edit` — so merely probing that route leaves a draft on the account; probe it only when about to post. The editor is `textarea[placeholder="Title"]` plus a `div[contenteditable="true"]` body, and the submit is a plain "Publish" button.

Playwright's own `.click()` times out on both fields (actionability never settles); **coordinate clicks work**, aimed at the top of the element's rect rather than its centre for the tall body div. Visibility (public vs members) is set by the frontmatter, and no frontmatter value → ask, don't default. Read-back: publishing navigates to `patreon.com/<handle>/posts/<slug>-<id>?pr=true`; strip the query for the permalink, and confirm no "Join to unlock" gate is present — though as the creator you see the body either way, so a public/members claim rests on what was set, not on what you can see.

## ko-fi
Check: `ko-fi.com/Manage/` — the manage rail (Home, Your page, Feed, Settings) renders for a signed-in user. Compose: the update composer is `textarea#postUpdateTextBox` ("Write a quick update…"), and **it exists in the DOM while being invisible**, so an element-handle click times out on visibility. `ko-fi.com/feed` briefly exposes "Post" and "Blog post" controls, and they vanish on re-query and never appear in the a11y snapshot; `/Manage/newpost`, `/post/new` and `/Manage/feedposts` all redirect back to `/Manage/`.

Two full attempts across two runs produced no reachable composer. Treat ko-fi as **report-and-skip** unless a snapshot shows a visible composer, and say plainly that the update has to be posted by hand.

## bastyon
Check: `bastyon.com/index` — the feed renders with the account link and a PKOIN balance, which is the only signed-in signal available. Compose: **no composer is reachable through automation.** The feed exposes no buttons, no `[role="button"]` nodes and no editors; `/post`, `/post?edit`, `/editor` and `/index?share=1` all render an empty document. Key-pair auth means posting may additionally require a signing prompt, which belongs to the user in any case. Report and skip.

## buymeacoffee
Check: **`studio.buymeacoffee.com/posts`**, not `buymeacoffee.com` — the marketing homepage shows "Log in / Sign up" to a fully signed-in user, so checking there reports a false logged-out. The studio page also carries the read-back baseline: a "Published N" counter.

Compose: `studio.buymeacoffee.com/posts/new` — `input[placeholder="Title"]` plus a `[contenteditable="true"]` body, submit "Publish now" (which shows "Post title and content can't be empty!" until both are filled). **The composer lives in a child frame.** Selectors resolve in the top document to invisible twins: coordinate clicks land on nothing, `el.focus()` returns `document.activeElement === el` and keystrokes still go nowhere, and the fields stay empty. Loop `page.frames()`, find the frame where both the title input and the editor exist, and drive it with element handles from that frame (`frame.$(sel)` then `.click()`), which does work there. Read-back: back on `/posts`, the Published counter must go up by exactly one; the public permalink is the `buymeacoffee.com/<handle>/<slug>` anchor in that row, and the post's visibility shows next to it ("Public").

## instagram
Check: `instagram.com` — home feed with the new-post (+) control. Compose: new post → upload the attachment (required — no attachment reached this phase only by a preflight bug: stop) → caption → share. Read-back: own profile grid. Quirk: caption links are not clickable; that was the campaign's problem, not this phase's — post the caption as written. Bio-CTA captions depend on the Phase 3 bio-link check having passed: the bio edit (when the user confirmed it) goes through the profile's own edit flow — the website/bio field only.

Full flow as observed (UI in Russian; English labels in parentheses):

1. **Create.** Coordinate clicks on the sidebar entry stopped working entirely in the run that produced these notes — the icon column at x≈36, the row centre and `getByText` force clicks all left the page untouched. **What did work first try: `browser_find` for "Create", then clicking the returned `aria-ref`** (`link "New post Create"`) with an ordinary locator click. Reach for the a11y ref before burning attempts on coordinates. Older behaviour, still worth trying next: the sidebar label span has a zero-size rect, so take its `closest('a')` rect; expanded sidebars respond at the row centre, collapsed ones only in the icon column.
2. **"Публикация" (Post)** in the menu that appears — a plain span, no menu role; match by exact text.
3. **Upload.** The dialog reads "Создание публикации / Перетащите сюда фото и видео". Its file input `accept` begins `image/avif,image/jpeg,…`. Scope to the dialog.
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

## discord
Check: `discord.com/channels/@me` — the web app loads with the server rail; a redirect to `/login` means logged out. The browser app is the only surface this skill uses: no bot token, no webhook, no developer application — those are a different integration and not what the user authorized.

Compose: navigate to the server and channel from frontmatter (`discord.com/channels/<server>/<channel>`), then the message box at the bottom — a Slate editor, so click it with a real mouse click and `keyboard.type`, same handling as X's Draft.js. **Enter sends immediately and there is no submit button**: a multi-line post typed with plain newlines publishes as one fragment per line, spamming the channel and leaving nothing to delete cleanly. Type multi-line bodies with `Shift+Enter` for every internal newline, then a single Enter to send. Attach media through the channel's file input before sending — an attachment sends with the message it is staged on. A missing message box means posting is restricted in that channel: report and skip, never hunt for another channel to post in.

Read-back: the last message in the channel, matched by the user's own author name and its `time[datetime]`; message nodes carry `id="chat-messages-<channel>-<id>"`, which gives the permalink `/channels/<server>/<channel>/<id>`. Unlike most platforms here, Discord allows editing after posting — a typo is fixable in place, but only on the user's explicit request.

## slack
Check: `app.slack.com/client` — the workspace rail loads and the user's avatar is present; a redirect to a sign-in or workspace-picker page means logged out of *that* workspace, and being signed into one workspace says nothing about another. Compose: navigate to the workspace and channel from frontmatter, then the message box at the bottom — a rich-text composer, so click it with a real mouse click and type, same handling as Discord's Slate editor. **Enter sends and there is no submit button by default** (the workspace can invert this setting): type internal newlines with `Shift+Enter` and send once at the end, or a multi-line post becomes one message per line in somebody's working channel. Attach media through the composer's own file control before sending. A missing composer means posting is restricted in that channel — report and skip; never hunt for another channel. Read-back: the last message in the channel, matched by the user's own name and its timestamp; the permalink comes from the message's own "Copy link" affordance, and the channel plus message timestamp identify it. Slack allows editing after posting, but only on the user's explicit request.

## nostr
Check: the web client named in frontmatter — the user's own profile and a composer are reachable, and the client reports a signing method. **Key material is never touched**: no seed, no `nsec`, no private key is requested, read, pasted, or stored, and a signing-extension prompt (NIP-07 style) is handed to the user exactly like a captcha. Compose: the client's composer; media is usually uploaded to a separate host by the client's own upload control. Publishing broadcasts to relays, so propagation is not instant and not uniform. Read-back: the user's own profile feed **on that same client**, since a note visible on one client's relay set may not have reached another's — that is normal propagation, not a failure, and the ledger records which client confirmed it.

## hashnode
Check: `hashnode.com` — the avatar and the write control. Compose: the editor — title, markdown body, tags, optional cover image, canonical URL when the article mirrors the user's blog, and the choice between the personal blog and a publication (frontmatter's target; a publication may route the draft to its editors instead of publishing). Read-back: the published article URL it lands on, opened and confirmed; a draft submitted to a publication for review is `pending-approval`, not `posted`.

## threads
**The domain is `threads.com`** — `threads.net` still resolves but the app and every permalink live on the new host. Compose: like Bluesky, the reliable path is the intent route — `https://www.threads.com/intent/post?text=<encodeURIComponent(body)>` opens the composer prefilled and correctly counted. Submit is the **last** button reading "Post" inside `[role="dialog"]` (the first one is the composer's own entry point); coordinate-click it and wait for the dialog count to drop to zero. Read-back: `threads.com/@<handle>`, newest `/post/<code>` link, and exactly one occurrence of the body text.

Check: the Threads web app — the user's avatar and the composer entry on the home column. The account is an Instagram account: the session usually rides along with Instagram's, and the handle is the same one, so an Instagram login check is a strong prior but not proof — verify on Threads itself. Compose: the composer, type, attach through its own file input (scope to the composer's dialog — the page carries other uploaders), publish. Unlike Instagram, links in the body are clickable and media is optional. A reply chain is separate sequential posts through the composer's add control, only when the post file is explicitly a thread. Read-back: the user's own profile feed, newest post, its permalink opened and confirmed.

## telegram
Check: the Telegram web client — the chat list loads and the user's own account is present; a phone-number or QR screen means logged out, and **login here is never automated under any circumstance** (it is a phone code, and asking for one is asking for account access). Compose: open the channel or group from frontmatter — posting rights are required and their absence shows as a missing message box, which is a report-and-skip, not a UI drift. Type into the message box, attach media through the client's own attach control. **Enter sends by default** (the client's setting can invert it), so internal newlines are `Shift+Enter` and the send happens once, at the end — otherwise a multi-line post arrives as one message per line to every subscriber, and every one of them gets a notification. The media caption cap is a different number from the plain message cap; the campaign's Phase 3 research carries both. Read-back: the channel's last message, its timestamp, and its permalink — `t.me/<channel>/<id>` for a public channel, the `t.me/c/…` form for a private one. Telegram allows editing after posting; only on the user's explicit request.

## peerlist
Check: `peerlist.io` — redirects to `/scroll` when signed in and the header carries the user's first name. Compose: the "Post" button on `/scroll` opens a dialog with `textarea[placeholder="Title (optional)"]` and a `[contenteditable="true"]` body; submit is the dialog's own "Post" button, with "Schedule Post" sitting immediately to its left — match the exact label, not a substring.

**Peerlist truncates the body on publish, silently.** A 495-character body was accepted by the composer, submitted without warning, and published cut two characters into its closing URL (`…/cross-session-messagi`). There is no counter in the composer and no error. So: keep the body at **400 characters or less**, never end on the link when the platform can eat it, and after publishing compare the post's *tail* against the source rather than searching for a phrase from the middle — a mid-text match confirms a truncated post just as happily as a whole one.

Read-back: the post appears in `peerlist.io/scroll`, **not** on `peerlist.io/<handle>` or `/<handle>/scroll`, both of which render without it. The scroll feed is virtualized, so read the permalink in the same evaluate that finds the text — a second call finds the node already recycled and returns nothing.

## daily-dev
Check: `app.daily.dev` — signed-in state, the user's avatar in the header. Compose: a link submission goes through the platform's own submit control; a squad post goes to that squad's page from frontmatter, where posting rights are required and their absence shows as a missing composer (report and skip). A link already present in the feed is deduplicated by the platform — resubmitting is not a fix, it is a report. Read-back: the squad feed or the user's profile, the item visible with its timestamp and permalink.

## minds
Check: `minds.com/newsfeed/subscriptions` — the rail renders Newsfeed / Boost / Wallet and the `@handle` entry. Compose: the composer sits on the newsfeed as `textarea.m-composerTextarea__message` ("Speak your mind...").

**Keystrokes only reach it through an element handle.** A coordinate click plus `page.keyboard.type` leaves the value empty and both "Post" buttons disabled, and so does `el.focus()`; `page.$('textarea.m-composerTextarea__message')` then `handle.type(text)` fills it correctly first try. The enabled submit is not in the page-wide button sweep either — walk up from the textarea (about five parents) to the composer container and take the "Post" button inside it.

Read-back: `minds.com/<handle>/` shows the post and the full URL text; the permalink is the `/newsfeed/<numeric-id>` anchor. Never touch Boost, Wallet, Supermind or Minds+ controls — the token layer sits next to the composer and none of it is part of posting.

## medium
Check: `medium.com` — avatar and the write control. Compose: the editor — title, body, up to the platform's tag limit; a publication target routes the draft to that publication's editors instead of publishing, which is `pending-approval`, not `posted`. Set the canonical URL when the piece mirrors the user's own blog. Confirm the paywall setting matches what the post file expects before publishing. Read-back: the published article URL, opened and confirmed.

## write-as
Check: `write.as/me` or the pad at `write.as/new` — a signed-in session shows the account's blogs; signed out, the pad still writes but posts anonymously, which is the trap worth checking for. Compose: one editor pane, first line becomes the title, the rest is the body, markdown supported; publish, then assign to the blog the post file names (an account with several blogs makes this a real choice, so the target is not optional). Read-back: the published post URL, opened and confirmed.

## telegraph
Check: nothing to check — `telegra.ph` has no account. Compose: `telegra.ph` itself, three fields in one page (title, author, body). Publish gives a permanent URL.

**Editing is bound to the browser that published**, through a token in that browser's local storage, so a page created in this session cannot be edited later from anywhere else; say so when a post goes here. There is no feed, no audience and no discovery, so a Telegraph page only makes sense as something another post links to. Read-back: open the returned `telegra.ph/<slug>` and confirm title and body.

## substack
Check: the publication's dashboard while signed in. **This platform sends email.** Publishing is not only a page going live: subscribers receive it, and nothing recalls a sent issue. Before submitting, read back the audience and section selection and the send-to-email toggle against what the post file declares — a wrong audience is not editable after the fact. Compose: new post → title, subtitle, body, section; then publish. Read-back: the published post URL and the dashboard showing it as sent, both captured; the send count is the evidence that the email half happened.
