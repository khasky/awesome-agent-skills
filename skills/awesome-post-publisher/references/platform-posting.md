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

## wonderful-dev
Check: `wonderful.dev` — logged-in header state. Small platform; use the generic flow: snapshot the feed, locate the compose affordance, proceed. Read-back: own profile/feed.

## hackernoon
Check: `app.hackernoon.com` — writer dashboard reachable. Compose: new draft → title, markdown body → submit for review. **Submission is the terminal state for this skill**: ledger `pending-approval`; editorial review decides publication on its own clock. Read-back: the draft listed as submitted in the dashboard.

## devto
Check: `dev.to` — avatar / "Create Post" button. Compose: Create Post → markdown editor (title, tags up front — via the editor UI or its front-matter format) → Publish. Read-back: the article URL it lands on; capture it.

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

## vk
Check: `vk.com` — own page reachable. Compose: the wall composer on the target from frontmatter (own wall or a community — for a community, posting rights must exist; a missing composer = report, skip). Read-back: the target wall.

`vk.com` redirects to `vk.ru`; both appear in URLs and neither indicates a problem. Admin rights on a community show as a "Manage" / "Керування" link in the right column — that is the posting-rights probe.

**The composer is not on the page until you open it.** There is no inline wall input on a community page: click the **Create** button above the feed, then pick **"Post"** from the sheet that opens (`[data-testid="dropdownactionsheet-item"]`, the first entry). Both of these defeat `browser_click` — use coordinate clicks, and focus+Enter as the fallback. Then the editor is `[data-testid="posting_base_screen_input_message"]`.

**The file-input trap that cost a public artifact.** A community page carries three `input[type=file]`. The page-level `accept="image/jpeg,image/png,image/gif"` one is the **photo-album uploader**: `setInputFiles` on it publishes the image into the community album and navigates to that album, destroying the composer draft. The composer's own input lives inside the New-post dialog and its `accept` contains `video/*`. Always scope to the dialog and disambiguate by `accept`; verify the preview appears inside the composer and that `location.href` did not change.

Publishing is two steps: **Next** ("Далі"/"Далее") → a settings screen → **Publish** ("Опублікувати"/"Опубликовать") — match the *exact* label, since "Publish as story" sits beside it. Opening the composer from the community page posts as the community; there is no author selector to set. VK autosaves drafts, so a composer reopened after an interruption comes back with its text — check what is already in the field before typing, or you will double it. A URL in the text auto-attaches a link snippet card, which the image attachment then replaces; that is expected and the URL stays in the body.

Read-back: the newest `article` on the wall, its `/wall-<owner>_<id>` permalink and its "just now" timestamp. Album ordering is **not** ID-ordered — the highest photo ID in a long album was item #40 of 233 — so for anything album-related use a count baseline instead.
