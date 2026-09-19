# flickr

Check: `flickr.com/photos/upload/` signed in shows `Drag & drop photos and videos here` and the sidebar with `Add tags`, `Add people`, `Add albums`, `Add groups`, `Owner settings`; it also states the remaining quota (`You can upload N more photos and videos`), which a free account has a lifetime total of. Signed out redirects to login.

Compose: `Choose File` takes photos and videos (multiple). Each uploaded item gets a title and a description in the uploader; tags go in through `Add tags`, albums through `Add albums`, groups through `Add groups`, privacy through `Owner settings` (left on the account's default). The `Upload` button at the top finishes the batch and publishes. The photo is the post; the description is the caption and links in it stay clickable.

Read-back: `flickr.com/photos/<user-id>/`, newest photo; the permalink is `/photos/<user-id>/<photo-id>/`.

Every field here must be focused by a real click and **verified before a single keystroke**, because unfocused keystrokes become page shortcuts. A run that computed a field's rect from the batch-edit panel clicked an element at `y = -9760`, typed a 468-character description into the page itself, and watched the `?` in it open *Keyboard shortcuts for this page* while the rest ran as hotkeys; all fields stayed empty and the state ended with 33 console errors. Read `document.activeElement`'s `placeholder` after the click — `Add a title`, `Add a description`, `Separate tags with a space` — and type only when it matches.

The uploader mounts two sets of fields and only one set is real. Before the file is staged, the title and description inputs have zero-size rects; after it is staged, a second pair appears with real coordinates (the batch pair stays off-screen at `y ≈ -9760`). Filter by `getBoundingClientRect().y > 0` and width, never by placeholder alone.

Tags go in as one space-separated string into the `Separate tags with a space` field, and the panel's own counter (`Tags 3/75`) is the confirmation. Adding them one at a time with `Enter` between is unnecessary here, unlike Imgur.

`Upload` is `input#action-publish` with `value="Upload 1 Photo"` and no `innerText`, so a text sweep never finds it. Clicking it opens a confirm dialog — *"Upload N item with the following changes? Public / Tags"* with `Upload` and `Continue Editing` — behind a full-screen `.flickr-dialog-mask` at z-index 20000. While that dialog is up, `elementFromPoint` on the publish button returns the mask and an element-handle click times out, which reads as a dead control; the first click had in fact worked. Note there are several `.flickr-dialog-mask` nodes and `querySelector` finds a `display:none` one first — filter by computed `display`. Publishing completes on the dialog's own `Upload`, after which Flickr redirects to `/account/upgrade/pro/upload`, which is the success page, not an error.
