# mewe

Check: `mewe.com/myworld` signed in shows the feed with the composer placeholder `How is your day going?` (`.c-mw-postbox-placeholder`); signed out shows the landing page. The profile is `mewe.com/<handle>`.

Compose: click the placeholder; the dialog shows the author name, an audience button (`Anyone`, left alone), a Quill editor (`.ql-editor`, the placeholder in `data-placeholder`) and a row of unlabelled icon buttons (photo, gif, emoji and the rest) under it, then `Lock Content` with a tip value (a paid-unlock toggle: never touch it) and `Disable Commenting`. `Post` enables once text is in. Text goes in with `el.focus()` and `insertText`; a URL pasted as text stays clickable. The dialog shows no counter, so the cap is verified live.

Read-back: `mewe.com/<handle>/posts`, newest entry.

MeWe's feed markup exposes no per-post permalink, so the read-back is the feed itself: confirm exactly one occurrence of the body and record the feed URL, saying in the report that it is the feed rather than the post. The composer is Quill, so `\n\n` produces real empty blocks and the empty-block count is the paragraph gate.
