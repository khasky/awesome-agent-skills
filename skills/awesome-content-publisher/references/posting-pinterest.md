# pinterest

`Publish` stays disabled while the link field has focus, and that reads exactly like a missing required field. With image, title, description, link and board all correct, `button` `Publish` reported `disabled: true` through six polls over 24 seconds. Nothing was wrong: clicking elsewhere and pressing `Tab` to blur `#WebsiteField` enabled it immediately — the URL is validated on blur. Blur the last field you filled before reading any submit button's state here. A screenshot at that moment shows a fully valid form and no error text, which is the tell.

The pin creation route is `pinterest.com/pin-creation-tool/` and it needs a slow start. The page answers before its editor exists — a probe eight seconds in found only the site search box. Wait for `#storyboard-upload-input` (the image input), then fill `#storyboard-selector-title`, the `Describe your Pin` contenteditable, and `#WebsiteField`. Uploading first creates a draft immediately: the sidebar's `Pin drafts (n)` increments, and publishing consumes that draft and decrements it — a usable before/after counter when the board listing is slow.

Board grids are not chronological. The newest pin was fourth in DOM order on the board page; opening the first `/pin/` anchor landed on an older pin entirely. Match the pin by its `img` `alt` text (`This contains an image of: <title>`) instead, then open that permalink.

Check: `pinterest.com` — logged-in home (it may redirect to a country host such as `ca.pinterest.com`; that is normal, keep using whatever host answers). Compose: `pinterest.com/pin-builder/`, which lands on `/pin-creation-tool/`. The whole flow works through element handles, no coordinate gymnastics:

- Image: `#storyboard-upload-input` — the composer's own input, `accept` covering bmp/gif/jpeg/png/tiff/webp plus video. `setInputFiles` on it, then confirm a preview appeared and `location.href` did not change.
- Fields: `#storyboard-selector-title` (title), the `div[contenteditable="true"]` that appears after upload (description), `#WebsiteField` (destination link), `#combobox-storyboard-interest-tags` (tags, optional).
- Board: the "Choose a board" control opens a dropdown. An account with no boards offers only "Create board" — treat that as a decision for the user (propose a name, let them type one), never invent one silently. The creation form is `#boardEditName` plus a `#secret` checkbox: read `secret.checked` before creating, because a secret board publishes a pin nobody can see. Then "Create", and the picker shows "Board <name>".
- Publish: the top-right "Publish" button; the composer confirms with "Your Pin has been published".

Read-back: `pinterest.com/<handle>/<board-slug>/` shows "Public board · N Pins" and the pin's `/pin/<id>/` link. Note the board keeps drafts around ("Pin drafts (N)") — an abandoned attempt leaves one, which is worth mentioning to the user rather than deleting.
