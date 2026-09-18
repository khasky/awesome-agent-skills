# flipboard

Check: `flipboard.com` signed in shows `Create a Flip` in the top navigation; signed out shows sign-in prompts. The profile is `flipboard.com/@<handle>` and each magazine is `flipboard.com/@<handle>/<magazine-slug>`.

Compose: `Create a Flip` opens `region "flip-compose"` on `Pick a Magazine`: `My Magazines` lists the account's magazines with `New Magazine` first; select the target magazine (the post file's `target`) and press `Next`. The second screen is a Draft.js editor (`.public-DraftEditor-content`, placeholder `Start a conversation in this Magazine…`) with three icon buttons that all announce as `link` to the accessibility tree; in order they are mention (`@`), URL (`Enter a URL to add to your new Flip`, confirmed with `Okay`) and image upload. `Add` enables once text is in. Text goes in with focus plus `insertText`, like every Draft.js field. A flip with a link: type the comment, then the URL icon, the URL, `Okay`, then `Add`. The dialog has no counter; keep the comment short and read it back.

Read-back: the magazine page, newest card; confirm the comment and the link card.
