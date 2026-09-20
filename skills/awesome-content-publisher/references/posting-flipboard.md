# flipboard

Check: `flipboard.com` signed in shows `Create a Flip` in the top navigation; signed out shows sign-in prompts. The profile is `flipboard.com/@<handle>` and each magazine is `flipboard.com/@<handle>/<magazine-slug>`.

Compose: `Create a Flip` opens `region "flip-compose"` on `Pick a Magazine`: `My Magazines` lists the account's magazines with `New Magazine` first; select the target magazine (the post file's `target`) and press `Next`. The second screen is a Draft.js editor (`.public-DraftEditor-content`, placeholder `Start a conversation in this Magazine…`) with three icon buttons that all announce as `link` to the accessibility tree; in order they are mention (`@`), URL (`Enter a URL to add to your new Flip`, confirmed with `Okay`) and image upload. `Add` enables once text is in. Text goes in with focus plus `insertText`, like every Draft.js field. A flip with a link: type the comment, then the URL icon, the URL, `Okay`, then `Add`. The dialog has no counter; keep the comment short and read it back.

Read-back: the magazine page, newest card; confirm the comment and the link card.

The magazine list arrives late, and a run that reads `Pick a Magazine` too early sees only `New Magazine` and concludes the account has none. Three seconds after the compose button, the screen showed the `NEW MAGAZINE` tile alone; the account's existing magazine appeared in the same list a few seconds later, and would have been duplicated by a run acting on the first reading. Re-read the tile list after opening the `New Magazine` form — the existing magazines stay rendered behind it — and cancel back out when one already fits. Each tile's own text carries the name, the age (`Created 3 Days Ago`) and the visibility (`Public Magazine`), which is enough to choose without leaving the dialog.

The compose button resists a coordinate click on its label. `CREATE A FLIP` in the top bar is a `SPAN` inside `button[aria-label="Flip compose Create a Flip"]`; clicking the span's own rect does nothing, and the accessibility route — `browser_click` on that button's snapshot ref — opens the dialog first time. Use it rather than climbing the coordinate ladder.

The three icon buttons at the bottom of the editor are unlabelled `button` elements about 22px wide, left to right at the same `y`: mention, URL, image. Match them by order within the dialog, not by `aria-label` — they carry none.

The image control is the third icon at the bottom of the editor and it does work — an earlier run concluded otherwise and shipped the flip with no picture. What happened there is order: the URL had already been added, and with the link card in place the image button mounted no file input, because a flip carries one media item and the card had taken it.

So attach the image **before** the URL, or instead of it. Click the third icon (the picture one) while the flip has no card yet; it opens the file chooser, which `browser_file_upload` answers from an allowed root. Then add the URL if the post still wants one and check which of the two survived — where both cannot coexist, the post file decides which matters and the other is a `degraded` line naming what was dropped. Verify on the magazine page that the flip carries the campaign image rather than the target site's own preview picture: a link card shows the destination's thumbnail, which is not the campaign's image and must not be recorded as one.

The magazine page is the read-back surface and the permalink: `flipboard.com/@<handle>/<magazine-slug>`, where the newest flip shows the comment text and the link as a `flipboard.com/redirect?url=…` anchor. Individual flips have no URL of their own, so record the magazine.
