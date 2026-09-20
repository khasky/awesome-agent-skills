# daily-dev

Check: `app.daily.dev` — signed-in state, the user's avatar in the header. A bounce to the marketing site means the session is logged out; report it and skip rather than guessing at a target.

The composer is `daily.dev/squads/create`, and the path name lies. That route's page title is `Create post` and it opens the post composer as a modal — the `+` in the left sidebar and the profile's `New post` button both point at it. A run that read the path as "create a squad", saw `/posts/new` return 404, and concluded the platform no longer allows profile posts was wrong on both counts and skipped the platform.

Modal contents: `textarea[name="title"]` (placeholder `Post title…`), an `Add cover` button backed by the page's first `input[type=file]` (the second, `name="content_upload"`, belongs to the body toolbar), a `.tiptap.ProseMirror` body, a `Free form` type selector, a toolbar (image · link · mention · GIF · bold · italic · lists), and the audience control top-left showing `Everyone` by default — which is the personal-profile post the plan wants. Submit is the modal's `Post` button; it navigates straight to `daily.dev/posts/<slug>` and the item appears on `daily.dev/<handle>` under Posts.

This composer restores a draft. It came back holding a *different platform's* body from earlier in the same run, and the HTML paste landed in the middle of it, producing one post made of two. Clear the body (`Control+a`, `Delete`, read the length back as 0) and the title field before filling, or the title doubles.

The body takes an HTML paste like the other ProseMirror editors — headings, code blocks, lists and anchors all survive.

Compose, legacy note: `New Post` (or `+`) from anywhere on the site, which posts from the personal profile. An original post takes a title and a Markdown body with code blocks; a link post takes the URL of an article already published elsewhere. Where the composer offers an audience, choose everyone, not a squad. Community Picks is gone — sunset in 2025 — so there is no separate submission mechanism to look for.

Squad path, only when the post file's target names one: go to that squad's page, where posting rights are required and their absence shows as a missing composer (report and skip). A link already present in the feed is deduplicated by the platform — resubmitting is not a fix, it is a report.

Read-back: the user's profile Posts tab, or the squad feed where one was named, the item visible with its timestamp and permalink.

Before submitting, confirm the user has seen the AI-content rule. daily.dev prohibits AI-generated content. If nothing in the run records the user's decision to publish this text as their own after editing it, stop and ask rather than posting — this is one of the few places where publishing quietly can cost the account, not just the post.

Confirmed again end to end, with two details worth pinning: the cover goes through the page's first `input[type=file]` (the second, `name="content_upload"`, belongs to the body toolbar and inserts inline), and the audience control's label is the plain text `Everyone` at the top-left of the modal — a page-wide text search matches the sidebar's `Squads` navigation first, so read the control, not the document. Posting navigates straight to `daily.dev/posts/<slug>`.

The body's hashtags are dead characters here. Measured on a published post: the three `#tag` words appear in the rendered text and not one of them is an anchor — daily.dev indexes a post by the squad and by its own tag taxonomy, not by hash-prefixed words in the body. So the post file carries no tag line for this platform, and where one is still in the file it is dropped before filling rather than published as decoration. `wonderful-dev` behaves identically.
