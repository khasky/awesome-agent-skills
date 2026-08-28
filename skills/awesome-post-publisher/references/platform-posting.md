# Platform posting notes — login signals, composers, read-back

Hints, not gospel: platform UIs drift constantly. When the live page does not match a note here, take an accessibility snapshot and re-derive the flow from what is actually on screen — never click a remembered selector into a changed UI. Read-only checks stay read-only: detecting login state never involves typing or opening account settings.

Shared rules for every platform:

- **Login signal** — load the platform's home/feed URL; a login form or "Sign in" wall = logged out; the user's avatar/composer = logged in. Ambiguous → classify `unknown` and say what was seen.
- **Fill** — type through the type tool with delay, one field at a time; attach media via the real file input; pause 2–8 s between distinct actions.
- **Read-back** — after submitting, navigate to where the post should be visible and confirm it; capture the permalink. A confirmation toast is not read-back.
- **Never** — change audience/visibility defaults the user didn't specify, dismiss platform warnings, or touch any dialog that mentions unusual activity (that one goes to the user). Profile fields are off-limits with one exception: the bio-link update the Phase 3 bio-link check explicitly confirmed, one field, one URL.

## facebook-wall
Check: `facebook.com` — own avatar and the "What's on your mind" composer. Compose: click the composer, type, attach, Post. Read-back: own profile, newest post. Quirk: leave the audience selector alone unless frontmatter specifies visibility.

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
Check: `x.com/home` — composer at the top of the timeline. Compose: type, attach, Post; a thread is separate sequential posts via the composer's add-post control, only when the post file is explicitly structured as a thread. Read-back: own profile.

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

## tiktok
Check: `tiktok.com` — logged-in header. Compose: `tiktok.com/upload` → video file → caption → post. Video processing takes time; wait for the platform's own success state before read-back. Read-back: own profile.

## pinterest
Check: `pinterest.com` — logged-in home. Compose: Create → Pin → image, title, description, destination link, board from frontmatter. Read-back: the target board.

## bastyon
Check: `bastyon.com` — logged-in state (key-pair auth; if a key prompt appears, that is the user's to handle — never request, read, or paste key material). Compose: use the generic flow from the live UI. Read-back: own profile feed.

## vk
Check: `vk.com` — own page reachable. Compose: the wall composer on the target from frontmatter (own wall or a community — for a community, posting rights must exist; a missing composer = report, skip). Read-back: the target wall.
