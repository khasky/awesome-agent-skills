# youtube

Check: `youtube.com/channel/<channelId>/posts` signed in as the channel owner shows the inline composer at the top of the Posts tab; `studio.youtube.com` links to it as `Create post`. The composer also opens from `youtube.com/my_community`.

Compose: the composer opener is the button `Share a sneak peek of your next video`; it expands into `#contenteditable-textarea` (a `yt-formatted-string` contenteditable, `maxlength` 10000, a live `n/10000` counter under it). Below the text: `Add an image`, `Add an image poll`, `Add a text poll`, `Add a quiz`, `Add an existing YouTube video`; only one attachment type per post. `Post` publishes now; the `Action menu` beside it schedules. The visibility line above the composer reads `Public` and stays so. Text goes in with focus plus `insertText`. The Posts tab has `Published`, `Scheduled` and `Archived` tabs.

Read-back: the `Published` tab, newest card; its permalink is `youtube.com/post/<id>`.

The image control mounts a **fresh, empty dropzone every time it is opened**, and that is what defeats `setInputFiles`. The page carries three `input[type=file]` at rest; feeding the one whose `accept` starts `image/jpeg` did nothing the first time and hung a whole tool call the second, because the panel that reads the file is created on open and the inputs left in the DOM are not it. The route that works: click `Image`, then click the panel's own `select from your computer`, which parks a native chooser — answer it with `browser_file_upload` from an allowed root. The attachment then renders and `Post` enables within seconds.

`Post` staying disabled with a body in the editor means the image panel is open and empty, not that the post is incomplete. Do not reach for the panel's `×` to clear it: that control is `aria-label="Cancel image post"` and it **removes the attachment**, silently taking the post back to text-only while enabling `Post` — which reads exactly like success.

Text needs a real mouse click into `#contenteditable-textarea` followed by `keyboard.type`. `el.focus()` plus `insertText` reports success and leaves the editor at length 0, twice in a row; after a real click `document.activeElement.id` reads `contenteditable-root` and the same insert lands.

A channel that has not completed YouTube's one-time link verification publishes every URL as **plain text**. The composer says so in a strip under the body — `To make external links clickable, complete a one-time verification` with a `Verify` button — and the published post carries the URL unlinked. That is a platform gate, not a defect to repair: record the post `degraded` naming it, and leave the verification to the user.
