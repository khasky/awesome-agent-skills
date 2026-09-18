# pixelfed

Driven end to end on `pixelfed.social`. The notes below the measured ones predate that run.

Read-back baseline is the `N Posts` counter on `pixelfed.social/<handle>`. Compose at `/i/web/compose`, which offers New Post · New Story · New Collection; `New Post` opens the OS file chooser immediately, with no modal first, so the script that clicks it ends there and the chooser is answered with `browser_file_upload`. The upload step states its own limits on screen: up to 20 photos or videos, `jpeg, png, gif, webp, mp4, heic`, 15 MB each.

**The caption cap on `pixelfed.social` is 2000, not the 500 a default build ships.** The composer counts it live as `N/2000`. Read that counter rather than carrying a number over from another instance, and read it on the instance the account is actually on.

The composer is Vue and the counter is the only honest read of it. Setting the textarea's `value` through the native property setter and firing `input` puts the text on screen and leaves the model empty — the counter stays at `0/2000` and a submit would post an empty caption. Type with `pressSequentially` instead. And never do both: a run that set the value and then typed shipped `804/2000` for a 402-character caption, because the typing appended to what was already in the DOM. Clear with `Control+a`, `Delete` and type once; the counter must equal the source's length exactly.

Playwright's actionability never settles on this page — `browser_click` times out on the caption field, the Alt Text row and the Post control alike. Every click here is the untrusted rung, `el.click()` from an evaluate. `browser_evaluate` itself often does not return on this page while a long poll is open; the call still executes, so fire it and read the result from a screenshot or a snapshot rather than waiting on the return value.

Alt text is behind the `Alt Text` row, which opens a *Media Descriptions* panel: one `Add a media description here...` textarea per uploaded file, capped at 1000, with `Cancel` and `Save`. It is the platform's per-file description, set before the post is submitted.

`Audience` defaults to `Public` and `Sensitive/NSFW Media` to off; confirm both in the panel before submitting. Submit is the `Post` link at the top right, and it redirects to `/i/web/post/<id>`. The public permalink is `pixelfed.social/p/<handle>/<id>` — that is the surface to audit, and it carries the caption, the live link, the image and its description.

Markdown does not render — strip it exactly as for `mastodon` (`post-formatting.md`) — while a URL in the caption does become a link, unlike `instagram`.

Media comes first and the platform cannot post without it, so a post file that reached this phase with no attachment is a preflight bug, not something to publish around. The media description belongs to the file rather than to the post: where the post file declares no alt, publish and record the post `degraded` — never write a description the file does not carry.

The caption cap is an instance setting, not a platform constant, and the 2000 above is `pixelfed.social`. On any other instance read the composer's own counter before typing; a number carried over is a guess.

Hashtags go in the caption and the composer suggests them as they are typed, which leaves a dropdown over the controls. That is the Mastodon trap: press `Escape` once after the caption is in, confirm the dropdown is gone, and only then click anything else.
