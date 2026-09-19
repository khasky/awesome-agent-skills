# imgur

Check: `imgur.com/upload` signed in shows `Drop images here` with `Choose Photo/Video`, `Paste image or URL` and `My Uploads`; the header links to `/user/<handle>/posts`.

Compose: the file input accepts `.jpg .jpeg .png .gif .apng .tiff .tif .bmp .xcf .webp` and the common video formats, multiple. After the upload the post editor takes a title, a description per image (plain text, links stay clickable) and tags, and the post is hidden by default. `Post to Community` (or the equivalent control on the finished post) is the outward-facing step and the one the run confirms before taking; a hidden post is reachable by link only. The image is the post: the description is the caption.

Read-back: `imgur.com/user/<handle>/posts`, newest post; confirm the title and that the post shows as public when it was meant to.

The three controls sit in different places and each needs its own click. The title is a `contenteditable` `span` near the top whose rect can be **negative** on first render (`y ≈ -29`) while a second, visible copy sits at `y ≈ 105` — click the visible one and verify the text landed, or the title silently stays as the filename (`flickr`, `imgur`, whatever the file was called) and the post keeps the wrong name. The description is a `div[data-placeholder="Add a description"]` lower down.

Tags open from `.TagView.TagAdd` (text `Tag`), which mounts a `span.TagAdd-input`. It accepts **one tag per open**: typing three space-separated names adds the first and drops the rest, and `Enter` closes the input. Re-click `.TagView.TagAdd` before each tag and read `.TagManager`'s text back — it lists the accepted tags.

`Post to the Gallery` only appears once a title exists, and it is the step that makes the post public; without it the upload is reachable by link only and nothing has really been published. Taking it rewrites the URL from `imgur.com/a/<id>` to `imgur.com/a/<title-slug>-<id>`, which is the cheapest proof the title applied and the post went to the community.
