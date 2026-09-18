# Platform posting notes — login signals, composers, read-back

Hints, not gospel: platform UIs drift constantly. When the live page does not match a note here, take an accessibility snapshot and re-derive the flow from what is actually on screen — never click a remembered selector into a changed UI. Read-only checks stay read-only: detecting login state never involves typing or opening account settings.

Read `browser-interaction.md` first. These notes say *where* things are; that file says *how* to click, type, attach and confirm on UIs that defeat ordinary Playwright actions. The selectors below were observed on live accounts and are starting points, not guarantees.

Shared rules for every platform:

- Login signal — load the platform's home/feed URL; a login form or "Sign in" wall = logged out; the user's avatar/composer = logged in. Ambiguous → classify `unknown` and say what was seen.
- Fill — type through the type tool with delay, one field at a time; attach media via the real file input; pause 2–8 s between distinct actions.
- Read-back — after submitting, navigate to where the post should be visible and confirm it; capture the permalink. A confirmation toast is not read-back.
- Never — change audience/visibility defaults the user didn't specify, dismiss platform warnings, or touch any dialog that mentions unusual activity (that one goes to the user). Profile fields are off-limits with one exception: the bio-link update the Phase 3 bio-link check explicitly confirmed, one field, one URL.

Each platform's own notes are a file of their own, `posting-<slug>.md` in this folder: read the slugs the run actually posts to, not the set. The slugs with notes here, in the order they were added:

`facebook-wall`, `facebook-page`, `linkedin`, `reddit`, `lemmy`, `quora`, `tumblr`, `mastodon`, `bluesky`, `x`, `truthsocial`, `wonderful-dev`, `hackernoon`, `hashnode`, `devto`, `hackernews`, `patreon`, `ko-fi`, `bastyon`, `buymeacoffee`, `instagram`, `pixelfed`, `pinterest`, `vk-wall`, `threads`, `telegram`, `peerlist`, `daily-dev`, `minds`, `medium`, `telegraph`, `teletype`, `substack`, `blogger`, `flipboard`, `livejournal`, `dreamwidth`, `mewe`, `youtube`, `tiktok`, `imgur`, `flickr`, `mataroa`, `deviantart`, `github-gists`.

A slug the post set names with no file here is a slug this skill has no observed flow for. Say so in the report and drive it from the shared rules above plus an accessibility snapshot, never from another platform's notes.
