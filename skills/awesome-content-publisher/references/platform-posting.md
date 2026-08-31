# Platform posting notes — login signals, composers, read-back

Hints, not gospel: platform UIs drift constantly. When the live page does not match a note here, take an accessibility snapshot and re-derive the flow from what is actually on screen — never click a remembered selector into a changed UI. Read-only checks stay read-only: detecting login state never involves typing or opening account settings.

**Read `browser-interaction.md` first.** These notes say *where* things are; that file says *how* to click, type, attach and confirm on UIs that defeat ordinary Playwright actions. The selectors below were observed on live accounts and are starting points, not guarantees.

Shared rules for every platform:

- **Login signal** — load the platform's home/feed URL; a login form or "Sign in" wall = logged out; the user's avatar/composer = logged in. Ambiguous → classify `unknown` and say what was seen.
- **Fill** — type through the type tool with delay, one field at a time; attach media via the real file input; pause 2–8 s between distinct actions.
- **Read-back** — after submitting, navigate to where the post should be visible and confirm it; capture the permalink. A confirmation toast is not read-back.
- **Never** — change audience/visibility defaults the user didn't specify, dismiss platform warnings, or touch any dialog that mentions unusual activity (that one goes to the user). Profile fields are off-limits with one exception: the bio-link update the Phase 3 bio-link check explicitly confirmed, one field, one URL.

## facebook-wall
Check: `facebook.com` — own avatar and the "What's on your mind" composer. Compose: click the composer, type, attach, Post. Read-back: own profile, newest post. Quirk: leave the audience selector alone unless frontmatter specifies visibility.

Observed on a Page (UI in Ukrainian): the inline composer field reads "Що у вас на думці?"; clicking it opens a dialog with `aria-label="Create post"` (English attribute even on a localized UI) — several other `[role="dialog"]` nodes coexist (notifications, empty portals), so identify by that label. The composer has exactly one file input inside its subtree; scope to it. Posting is two steps: **Next** ("Далі") → a **Post settings** screen → **Publish** ("Опублікувати"). The settings screen renders grey skeletons for several seconds — a DOM probe run too early still reports the *previous* step's buttons and looks like the click failed; wait and re-probe rather than clicking Next again. On that screen confirm audience, and that *Share to groups*, *Share to story* and *Promote* are not engaged — "Просувати допис" warns it opens a paid flow after Post; never enter it. The photo-edit panel that carries alt text frequently will not open (two attempts, both dead) — Facebook then generates its own OCR description. Read-back: the Page feed shows "Щойно"/"Just now" with `Published by <admin>`; capture the `/posts/pfbid…` permalink and open it to confirm text and media, since the feed truncates behind "See more".

## facebook-group
Check: the group URL from frontmatter — member view with a composer visible (no composer = not a member or posting restricted → report, skip). Compose: composer inside the group page. Read-back: group feed; many groups queue posts for admin approval — a "pending approval" notice = ledger status `pending-approval`, not `posted` and not a failure.

## linkedin
Check: `linkedin.com/feed` — "Start a post" button. Compose: Start a post → type → add media → Post. Read-back: own profile → recent activity/posts.

## reddit
Check: `reddit.com` — avatar in the header. Compose: `reddit.com/r/<subreddit>/submit` — title into the title field, body into the markdown/text field; set flair when frontmatter names one (some subs require it — an unset required flair blocks submission). Read-back: the subreddit's /new listing AND the user's profile — automod can remove a post seconds after it lands; removed = report to the user, never repost the same content at the same sub.

## lemmy
Check: `https://<instance-from-frontmatter>/` — avatar in the header (each instance is a separate login; `lemmy.world` being logged in says nothing about another instance). Compose: the community's own create-post page (`/create_post?community_name=<community>` on most instances, or the community page's Create Post control) — title, URL field when the post file carries a link submission, markdown body. Read-back: the community's /new listing and the user's profile; community moderators and instance admins both remove, so a post gone from the listing is a removal to report, never to repost.

## tumblr
Check: `tumblr.com/dashboard` — compose (pencil) button. Compose: text post → title/body; tags go into the dedicated tags field, not inline. Read-back: own blog page.

## mastodon
Check: `https://<instance-from-frontmatter>/` — compose box on the home column. Compose: type, attach, publish; respect the instance's cap (from the campaign manifest). Read-back: own profile on that instance.

## bluesky
Check: `bsky.app` — compose button. Compose: new post, type, attach; paste links plainly for the link card. Read-back: own profile feed.

## x
Check: `x.com/home` — composer at the top of the timeline; `[data-testid="SideNav_AccountSwitcher_Button"]` carries the handle, which is the cheapest login+identity probe. Compose: type, attach, Post; a thread is separate sequential posts via the composer's add-post control, only when the post file is explicitly structured as a thread. Read-back: own profile.

Selectors: editor `[data-testid="tweetTextarea_0"]` (Draft.js — click it with a real mouse click, then `keyboard.type`); the composer's file input is the one whose `accept` starts with `image/jpeg,…`; submit `[data-testid="tweetButtonInline"]` (or `tweetButton` in the modal composer). Read-back: `[data-testid="tweet"]` on the profile, with `time[datetime]` and the `/status/<id>` href.

**Alt text is a known dead end from the inline composer.** `[data-testid="altTextWrapper"]` is an `<a role="link">` pointing at `/compose/post/media`; the route changes but the description modal never mounts. Four approaches failed: coordinate click, manual `down`/`up`, focus+Enter, and navigating to the full-page composer. Treat X alt text as best-effort: try twice, then record the post as `degraded` in the ledger and say so in the report — **X does not allow adding a description after posting**, so the only fix is delete-and-repost, which needs the user's explicit request. Navigating away while a draft exists raises a `beforeunload` modal — dismiss it with `accept: false` to keep the draft. SPA back (`goBack`) preserves composer text and attachments; a full `goto` does not.

## truthsocial
Check: `truthsocial.com` — own avatar and the composer on the home column. Mastodon-derived UI, so the flow reads like Mastodon's (composer, attach, publish) but the selectors are the fork's own: snapshot before acting rather than reusing Mastodon's. Read-back: own profile.

## wonderful-dev
Check: `wonderful.dev` — logged-in header state. Small platform; use the generic flow: snapshot the feed, locate the compose affordance, proceed. Read-back: own profile/feed.

## hackernoon
Check: `app.hackernoon.com` — writer dashboard reachable. Compose: new draft → title, markdown body → submit for review. **Submission is the terminal state for this skill**: ledger `pending-approval`; editorial review decides publication on its own clock. Read-back: the draft listed as submitted in the dashboard.

## devto
Check: `dev.to` — avatar / "Create Post" button. Compose: Create Post → markdown editor (title, tags up front — via the editor UI or its front-matter format) → Publish. Read-back: the article URL it lands on; capture it.

## hackernews
Check: `news.ycombinator.com` — the header carries the username and a `logout` link when logged in. Compose: `/submit` — title, plus either url or text (the form takes one, not both; filling both is a submission error). No media, no markdown, no tags. Read-back: `/submitted?id=<user>` and the item permalink; a submission can be killed by the site's own filters within minutes, and `/newest` not showing it while the profile does means exactly that — report it, never resubmit the same URL. New accounts and repeat domains draw the filter hardest.

## patreon
Check: `patreon.com` — creator session (creator dashboard reachable). Compose: Create → post → title/body/media; set the visibility (public vs members) frontmatter names — no frontmatter value → ask, don't default. Read-back: the creator page feed.

## ko-fi
Check: `ko-fi.com` — own page/dashboard reachable. Compose: new post from the dashboard feed. Read-back: own page feed.

## buymeacoffee
Check: `buymeacoffee.com` — creator dashboard. Compose: new post from the dashboard. Read-back: own page feed.

## instagram
Check: `instagram.com` — home feed with the new-post (+) control. Compose: new post → upload the attachment (required — no attachment reached this phase only by a preflight bug: stop) → caption → share. Read-back: own profile grid. Quirk: caption links are not clickable; that was the campaign's problem, not this phase's — post the caption as written. Bio-CTA captions depend on the Phase 3 bio-link check having passed: the bio edit (when the user confirmed it) goes through the profile's own edit flow — the website/bio field only.

Full flow as observed (UI in Russian; English labels in parentheses):

1. **Create.** The sidebar label span has a zero-size rect — take its `closest('a')` rect instead. The sidebar collapses on narrow layouts: expanded, the row centre works; collapsed, only the icon column (~x=36) does. If the menu does not open, re-read the rect and click the icon rather than repeating the same coordinate.
2. **"Публикация" (Post)** in the menu that appears — a plain span, no menu role; match by exact text.
3. **Upload.** The dialog reads "Создание публикации / Перетащите сюда фото и видео". Its file input `accept` begins `image/avif,image/jpeg,…`. Scope to the dialog.
4. **Crop — do not skip this.** The step defaults to a square crop that mutilates a 16:9 screenshot. Open "Выбрать размер и обрезать" (aria-label) and pick **"Оригинал"** unless the post file asks for a ratio.
5. **Two × "Далее" (Next)** — crop → filters (apply none) → caption.
6. **Caption** goes into the dialog's `[contenteditable="true"]`; the counter reads `N/2 200`.
7. **Alt text works here** — the one platform in this run where it did. Expand the **"Специальные возможности" (Accessibility)** accordion by clicking the rect of its `[role="button"]` ancestor (the bare text node is not clickable, and the accordion often needs a second, deliberate click after `scrollIntoView`). The field is `input[placeholder*="льтернативный"]`.
8. **Before sharing, read both checkboxes**: the AI label and the **Threads cross-post**. Confirm both `false` unless the post file asks otherwise — silently cross-posting to another network is not what was approved.
9. **Share is slow.** Poll the dialog in-page until it reads "Публикация размещена" / "Вы поделились публикацией", per `browser-interaction.md`. **Do not navigate away while it uploads** — a transient network error during that window loses the post silently, and the profile then shows nothing at all.

Read-back: profile post count must go up by exactly one, and the newest `/p/<code>/` link must be new. Note the grid anchors are `/<handle>/p/<code>/`, not `/p/<code>/` — a query for the latter returns zero and looks like failure. Open the permalink and confirm caption, `time[datetime]` and the image's `alt` (your alt text appears verbatim as the `img` alt).

## tiktok
Check: `tiktok.com` — logged-in header. Compose: `tiktok.com/upload` → video file → caption → post. Video processing takes time; wait for the platform's own success state before read-back. Read-back: own profile.

## pinterest
Check: `pinterest.com` — logged-in home. Compose: Create → Pin → image, title, description, destination link, board from frontmatter. Read-back: the target board.

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

## youtube
Two surfaces, and the post file says which by whether it carries a video attachment.

- **Upload** (`studio.youtube.com`): the video must already exist as a file — this skill uploads and titles it, it does not create video. Flow: Create → Upload videos → the file input inside the upload dialog (scope to the dialog), then title, description and tags, the audience declaration ("made for kids" — a required legal answer, and one this skill must never guess: no explicit value in frontmatter → stop and ask), visibility, then publish or schedule. Processing continues after the dialog closes; wait for the platform's own state rather than navigating away.
- **Community post** (the channel's Community tab): text, image or poll, closer to a short feed post. Whether the tab exists on this channel is an eligibility question — if the composer is absent, report that and skip rather than assuming a UI drift.

Check: `youtube.com` — the avatar in the header, and the channel switcher when the account carries several (a brand account is a different channel; posting to the wrong one is not undoable by pretending). Read-back: the channel's Videos or Community tab, the new item's permalink opened and confirmed. A scheduled upload is not published — record it as `pending-approval` in spirit: the ledger entry says scheduled, with the time, and the run does not claim publication.

## nostr
Check: the web client named in frontmatter — the user's own profile and a composer are reachable, and the client reports a signing method. **Key material is never touched**: no seed, no `nsec`, no private key is requested, read, pasted, or stored, and a signing-extension prompt (NIP-07 style) is handed to the user exactly like a captcha. Compose: the client's composer; media is usually uploaded to a separate host by the client's own upload control. Publishing broadcasts to relays, so propagation is not instant and not uniform. Read-back: the user's own profile feed **on that same client**, since a note visible on one client's relay set may not have reached another's — that is normal propagation, not a failure, and the ledger records which client confirmed it.

## hashnode
Check: `hashnode.com` — the avatar and the write control. Compose: the editor — title, markdown body, tags, optional cover image, canonical URL when the article mirrors the user's blog, and the choice between the personal blog and a publication (frontmatter's target; a publication may route the draft to its editors instead of publishing). Read-back: the published article URL it lands on, opened and confirmed; a draft submitted to a publication for review is `pending-approval`, not `posted`.

## threads
Check: the Threads web app — the user's avatar and the composer entry on the home column. The account is an Instagram account: the session usually rides along with Instagram's, and the handle is the same one, so an Instagram login check is a strong prior but not proof — verify on Threads itself. Compose: the composer, type, attach through its own file input (scope to the composer's dialog — the page carries other uploaders), publish. Unlike Instagram, links in the body are clickable and media is optional. A reply chain is separate sequential posts through the composer's add control, only when the post file is explicitly a thread. Read-back: the user's own profile feed, newest post, its permalink opened and confirmed.

## telegram
Check: the Telegram web client — the chat list loads and the user's own account is present; a phone-number or QR screen means logged out, and **login here is never automated under any circumstance** (it is a phone code, and asking for one is asking for account access). Compose: open the channel or group from frontmatter — posting rights are required and their absence shows as a missing message box, which is a report-and-skip, not a UI drift. Type into the message box, attach media through the client's own attach control. **Enter sends by default** (the client's setting can invert it), so internal newlines are `Shift+Enter` and the send happens once, at the end — otherwise a multi-line post arrives as one message per line to every subscriber, and every one of them gets a notification. The media caption cap is a different number from the plain message cap; the campaign's Phase 3 research carries both. Read-back: the channel's last message, its timestamp, and its permalink — `t.me/<channel>/<id>` for a public channel, the `t.me/c/…` form for a private one. Telegram allows editing after posting; only on the user's explicit request.

## peerlist
Check: `peerlist.io` — the user's own profile and a composer reachable while signed in. Compose: the feed composer on the profile or home page; small platform, so snapshot and derive the flow from what is on screen rather than reusing another network's. Read-back: the user's own profile feed, newest post, its permalink opened and confirmed.

## daily-dev
Check: `app.daily.dev` — signed-in state, the user's avatar in the header. Compose: a link submission goes through the platform's own submit control; a squad post goes to that squad's page from frontmatter, where posting rights are required and their absence shows as a missing composer (report and skip). A link already present in the feed is deduplicated by the platform — resubmitting is not a fix, it is a report. Read-back: the squad feed or the user's profile, the item visible with its timestamp and permalink.

## medium
Check: `medium.com` — avatar and the write control. Compose: the editor — title, body, up to the platform's tag limit; a publication target routes the draft to that publication's editors instead of publishing, which is `pending-approval`, not `posted`. Set the canonical URL when the piece mirrors the user's own blog. Confirm the paywall setting matches what the post file expects before publishing. Read-back: the published article URL, opened and confirmed.

## substack
Check: the publication's dashboard while signed in. **This platform sends email.** Publishing is not only a page going live: subscribers receive it, and nothing recalls a sent issue. Before submitting, read back the audience and section selection and the send-to-email toggle against what the post file declares — a wrong audience is not editable after the fact. Compose: new post → title, subtitle, body, section; then publish. Read-back: the published post URL and the dashboard showing it as sent, both captured; the send count is the evidence that the email half happened.
