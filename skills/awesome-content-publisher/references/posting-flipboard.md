# flipboard

Check: `flipboard.com` signed in shows `Create a Flip` in the top navigation; signed out shows sign-in prompts. The profile is `flipboard.com/@<handle>` and each magazine is `flipboard.com/@<handle>/<magazine-slug>`.

Compose: `Create a Flip` opens `region "flip-compose"` on `Pick a Magazine`: `My Magazines` lists the account's magazines with `New Magazine` first; select the target magazine (the post file's `target`) and press `Next`. The second screen is a Draft.js editor (`.public-DraftEditor-content`, placeholder `Start a conversation in this Magazine…`) with three icon buttons that all announce as `link` to the accessibility tree; in order they are mention (`@`), URL (`Enter a URL to add to your new Flip`, confirmed with `Okay`) and image upload. `Add` enables once text is in. Text goes in with focus plus `insertText`, like every Draft.js field. A flip with a link: type the comment, then the URL icon, the URL, `Okay`, then `Add`. The dialog has no counter; keep the comment short and read it back.

Read-back: the magazine page, newest card; confirm the comment and the link card.

The magazine list arrives late, and a run that reads `Pick a Magazine` too early sees only `New Magazine` and concludes the account has none. Three seconds after the compose button, the screen showed the `NEW MAGAZINE` tile alone; the account's existing magazine appeared in the same list a few seconds later, and would have been duplicated by a run acting on the first reading. Re-read the tile list after opening the `New Magazine` form — the existing magazines stay rendered behind it — and cancel back out when one already fits. Each tile's own text carries the name, the age (`Created 3 Days Ago`) and the visibility (`Public Magazine`), which is enough to choose without leaving the dialog.

The compose button resists a coordinate click on its label. `CREATE A FLIP` in the top bar is a `SPAN` inside `button[aria-label="Flip compose Create a Flip"]`; clicking the span's own rect does nothing, and the accessibility route — `browser_click` on that button's snapshot ref — opens the dialog first time. Use it rather than climbing the coordinate ladder.

The three icon buttons at the bottom of the editor are unlabelled `button` elements about 22px wide, left to right at the same `y`: mention, URL, image. Match them by order within the dialog, not by `aria-label` — they carry none.

The image control does nothing under automation, and the URL card is the reason. With a URL already added, clicking the image button opened no file chooser and mounted no `input[type=file]`; a flip carries one media item and the link card had taken it, showing the target page's own preview picture. So a post file that declares both a link and an image cannot have both here: the link card wins, and the campaign image is a `degraded` line in the ledger. Where the image matters more than the link, skip the URL step and try the image button on an empty flip.

The magazine page is the read-back surface and the permalink: `flipboard.com/@<handle>/<magazine-slug>`, where the newest flip shows the comment text and the link as a `flipboard.com/redirect?url=…` anchor. Individual flips have no URL of their own, so record the magazine.
