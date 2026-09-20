# tiktok

Check: `tiktok.com/tiktokstudio/upload?tab=photo` signed in shows `Select photos to upload`; signed out shows the login wall.

Compose: the `Photos` tab (`tab "Photos"`) takes up to 35 photos per post, 50 MB each, JPG, JPEG, PNG or WebP, through `Select photos` (an OS file chooser, answered with `browser_file_upload`) or drag and drop. The caption field, its counter, the hashtag suggestions, the cover picker and `Who can view this post` render only after the photos are in, so the first run reads them from the live form and records the caption cap in the platform cache. The caption carries the body and the tag line. `Post` submits; the studio's `Posts` list is the read-back.

Read-back: `tiktok.com/@<handle>`, newest photo post; confirm the caption and the photo count.

A hashtag typed as text is not a hashtag here. TikTok's caption field only links a tag that was committed through its own suggestion list: type `#` and the tag's letters, wait for the dropdown, then click the entry you want. A committed tag renders **bold** in the caption box, and on the published post it is a clickable link; a tag that was merely typed stays plain text in both places and indexes nothing. One run pasted four tags as part of the caption string and shipped four dead words.

So the caption goes in in two moves: insert the body text without the tag line, then add the tags one at a time — type `#` plus the name, wait about a second for the suggestion list, click the matching entry, confirm the tag turned bold, and repeat. Where a name has no suggestion, TikTok still offers it as a new tag at the top of the list; clicking that entry commits it the same way. Before submitting, count the bold tags against the frontmatter `hashtags`; after publishing, confirm each one is an anchor on the post page.

The caption's `0/90` counter belongs to a separate title field, not to the caption, whose cap is 4000. Read the counter that sits under the caption box, never the first one on the page.
