# imgur

Check: `imgur.com/upload` signed in shows `Drop images here` with `Choose Photo/Video`, `Paste image or URL` and `My Uploads`; the header links to `/user/<handle>/posts`.

Compose: the file input accepts `.jpg .jpeg .png .gif .apng .tiff .tif .bmp .xcf .webp` and the common video formats, multiple. After the upload the post editor takes a title, a description per image (plain text) and tags, and the post is hidden by default. `Post to Community` (or the equivalent control on the finished post) is the outward-facing step and the one the run confirms before taking; a hidden post is reachable by link only. The image is the post: the description is the caption.

Read-back: `imgur.com/user/<handle>/posts`, newest post; confirm the title and that the post shows as public when it was meant to.

The three controls sit in different places and each needs its own click. The title is a `contenteditable` `span` near the top whose rect can be **negative** on first render (`y ≈ -29`) while a second, visible copy sits at `y ≈ 105` — click the visible one and verify the text landed, or the title silently stays as the filename (`flickr`, `imgur`, whatever the file was called) and the post keeps the wrong name. The description is a `div[data-placeholder="Add a description"]` lower down.

Tags open from `.TagView.TagAdd` (text `Tag`), which mounts a `span.TagAdd-input`. It accepts **one tag per open**: typing three space-separated names adds the first and drops the rest, and `Enter` closes the input. Re-click `.TagView.TagAdd` before each tag and read `.TagManager`'s text back — it lists the accepted tags.

`Post to the Gallery` only appears once a title exists, and it is the step that makes the post public; without it the upload is reachable by link only and nothing has really been published. Taking it rewrites the URL from `imgur.com/a/<id>` to `imgur.com/a/<title-slug>-<id>`, which is the cheapest proof the title applied and the post went to the community.

One run got all three of these wrong at once, and the ledger said `posted`. The rules that would have caught it:

**Hidden is not published, and `imgur.com/a/<id>` is what hidden looks like.** The editor's own status row reads `Hidden` until `Post to the Gallery` is taken. A post left there is reachable only by whoever has the link — it is a draft with a URL, and recording it as published is a false claim about an outward-facing action. Before writing the ledger, read the post page and require two things together: the URL carries the title slug (`imgur.com/a/<title-slug>-<id>`, which only the gallery step produces) and the page does not label the post `Hidden`. Either one missing means the run has not finished.

**Diff the description against the source before and after.** One post published with a description that did not match the file — this composer normalises and re-wraps what it receives, and nothing on screen says so. Compare the description's text character for character with the source body at two moments: after filling, inside the editor, and again on the published page. A mismatch is a repair, not a note, with the two exceptions in the next paragraph.

**The tag loop needs its own read-back per tag.** Re-click `.TagView.TagAdd` for each tag, type one name, and read `.TagManager`'s text back before the next one; a loop that types four names without re-opening the control ships zero tags and looks identical to a loop that worked. Confirm the full set on the published page.

**Imgur defangs links in descriptions, and that is accepted behaviour.** Imgur's anti-spam normalisation puts spaces around the dots of URLs and dotted tokens in a description, so `https://example.com/repo` is shown as `https://example . com/repo` and `name.md` as `name . md`, with any anchor left pointing at the truncated host. It was reported against Imgur's own upload path in 2017 (`DamienDennehy/Imgur.API` issue 8, a URL in the description shown as `google . com`) and reproduced in a 2026 run, where the first save kept the text intact and an edit of the published description defanged every link in it. Emoji outside the basic plane can also be stored as `?`. None of this is a defect to repair:

- Publish the description once, exactly as the source has it, and do not edit it afterwards to fix a `?` or a spaced-out link. The edit is what triggers the rewrite, and a second save cannot undo it.
- Compare the published description with the source ignoring spaces around dots and a `?` where the source has an emoji. The rest must match character for character.
- Record the differences as `adapted` (`imgur defangs links`), not `degraded` and not an incident. The status stays `posted`.
