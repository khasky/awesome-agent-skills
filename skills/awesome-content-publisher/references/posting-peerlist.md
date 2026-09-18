# peerlist

Check: `peerlist.io` — redirects to `/scroll` when signed in and the header carries the user's first name. Compose: the "Post" button on `/scroll` opens a dialog with `textarea[placeholder="Title (optional)"]` and a `[contenteditable="true"]` body; submit is the dialog's own "Post" button, with "Schedule Post" sitting immediately to its left — match the exact label, not a substring.

Peerlist truncates the body on publish, silently. A 495-character body was accepted by the composer, submitted without warning, and published cut two characters into its closing URL (`…/cross-session-messagi`). There is no counter in the composer and no error. So: keep the body at 400 characters or less, never end on the link when the platform can eat it, and after publishing compare the post's *tail* against the source rather than searching for a phrase from the middle — a mid-text match confirms a truncated post just as happily as a whole one.

The cap is 480 characters and the Post button enforces it — measured by probe: 400 enables it, 500 disables it. An over-length body is therefore a stop before anything is typed, not a truncation to discover afterwards. Check the source length against 480 during the source scan and raise it with the user; trimming their copy is their call.

There is no edit, and the listing lies — so this platform gets exactly one submit. The post's `⋮` menu offers only `Copy Link` and `Delete`, and a post starts collecting upvotes within minutes, so a delete is not a free undo. A defect published here is effectively permanent, which makes the pre-submit format gate load-bearing above all other platforms.

Never judge what exists from `peerlist.io/<handle>/posts`. That listing is virtualised and inconsistent: consecutive loads returned one post, then four, then two, sometimes without the newest. A run that read two agreeing loads as "the republish did not land" submitted twice more on that basis.

Cross-check on the surfaces peerlist renders, and never by calling its API. The page fetches `/api/v2/scroll/user` for itself; `browser_network_requests` will show that call and its status after a submit, which is a passive reading and useful. Requesting it yourself is not allowed here — see the Core principle. The visual cross-checks are the permalink (`/scroll/post/<id>`, ~10 s to render), the composer's `Drafts` panel, and the feed at `/feed`; treat a post as present only when two loads agree, and where they never do, leave the entry `unverified` and tell the user rather than submitting again.

The linkifier is real but fussy. Other accounts' posts carry working anchors, so peerlist does linkify — but only for a URL that was typed with real keystrokes and followed by a space. `insertText` of a body ending in a URL publishes dead text. Insert the body up to the URL, press `Control+End`, type the URL with `keyboard.type`, type one space, and assert an `a[href]` inside the composer before submitting.

The permalink does render the body now (`/scroll/post/<id>`), contrary to the older note below — it just needs ~10 s. The profile listing is the flakier surface: consecutive loads return different subsets, so count a post as present only after two loads agree.

The post cards nest, which makes deletion by position unsafe. On `/<handle>/posts` a card's action menu cannot be attributed to a card's text with confidence, so "delete the older duplicate" is a guess dressed as a step. Identify the target by its own id — from the permalink or a `data-*` attribute — and where that does not resolve, leave the post standing and tell the user. One run did exactly that rather than risk removing the wrong post; the duplicate is still live and named in the report.

The dialog has a file input, and it is easy to write off. No camera icon is obvious in the composer's first render, but the dialog carries an `input[type=file]` with an `image/` accept — enumerate the inputs inside the dialog instead of hunting for a button. Attach before typing: the upload re-renders the dialog and a body typed first can be lost. A successful upload shows as a thumbnail in the dialog and publishes as a `cloudfront` `img`; confirm it on the listing, never in the composer.

Read-back: use `peerlist.io/<handle>/posts`, which lists the post reliably. The `/scroll/post/<id>` permalink renders page chrome only and never the body, however long you wait — reading that as failure is a false negative. On the listing the body is collapsed behind a `Read More` control: click it before comparing the tail, or an intact post looks truncated. The scroll feed itself is virtualized, so read any permalink in the same evaluate that finds the text — a second call finds the node already recycled and returns nothing.

The `Post` entry button on `/scroll` opens the composer only through `el.click()` from `page.evaluate`. A coordinate click on its live rect and an element-handle click both leave the page unchanged; the JS click opens the dialog first try. The dialog's own `Post` button, by contrast, takes an ordinary coordinate click.

The composer's body editor refuses `handle.click()` (actionability never settles). Focus it in-page and place the caret with a Range collapsed to the end, then `insertText`.

The link recipe works and is worth following exactly. Insert the body *without* its closing URL, press `Control+End`, wait for the caret to settle, then `keyboard.type(URL)` with a real delay and follow it with a space. Peerlist's linkifier fires on typed input and the space commits it: the published caption then carries `<a href="…">`, confirmed on the API. Inserting the URL as part of the body text produces dead characters, which is how this platform shipped a bare link last campaign.

The composer prints its own constraints while you work — the character cap (`480`), `Sharing only a link is no fun.` and `We don't support hashtags (yet)`. A post file whose body ends in a hashtag line therefore needs that line dropped here, and the composer says so rather than silently stripping it.

In the API response the post's id field is `id`, not `postId`; `media` carries the attachments and `caption` the HTML whose `<a href` presence is the link check.

The composer's image preview is a `data:` URI, so a probe that counts `blob:` or `cloudfront` sources reports zero attachments on a dialog that is holding the picture. Match the preview `img` on any `src`, or screenshot the dialog. The composer also stamps its own context chip (`#show`) on a post whose file names none; leave it rather than changing a surface the post file does not ask about, and record it in the ledger so the report can say who chose it.
