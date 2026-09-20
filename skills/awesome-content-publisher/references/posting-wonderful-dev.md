# wonderful-dev

Check: `wonderful.dev` — logged-in header state; the app lands on `/home`. Compose: the composer is already on the timeline — a visible `textarea[placeholder="Start typing…"]`, no dialog to open. Coordinate-click it and type.

Submitting is solved: it is the `button[type=submit]` whose text is exactly `Post` and whose width is ~54 px. The 28 px-wide `Media` and `Poll` buttons beside it are the composer's *type* tabs and submit nothing, which is what made this look unsolvable. Filling works with `t.focus(); t.setSelectionRange(0, t.value.length)` then `page.keyboard.insertText(text)`.

The submit button moves once an image is attached — from `y≈154` to `y≈1045`, below a 1068 px viewport, and it is then no longer within ~7 parents of the textarea, so a scoped search returns `null`. Search the whole document for it, `mouse.wheel` it into view, re-read the rect immediately before clicking. A stale coordinate here clicks nothing and the draft is lost on the next navigation (this composer does not persist drafts across reloads).

The composer does take images, through a plain `input[type=file][accept="image/jpeg,image/png,image/gif"]` present on the page — one run reported "no file input on the text tab" without ever querying for one, and shipped the post bare. `setInputFiles` on it works; the preview blob appears once the body is typed.

The platform renders markdown *partially*, and the gap is links. Code fences, inline code and `##` headings all render; a markdown link may or may not, and the deciding factor is the label. ``[`eli5`](https://…)`` — inline code inside the label — published as literal text, while plain `[eli5](https://…)` rendered as a real anchor on the same account minutes later. Strip backticks from link labels here, keep the rest of the markdown verbatim, and confirm on the permalink that `](` appears nowhere.

Bare URLs do not reliably autolink — only a bare *domain token* does. Flattening the markdown links to `text (https://url)` published one anchor out of three: `So fal built fal.live (https://fal.live/)` linkified the word `fal.live` and left the parenthesised URL as dead text, while `Infinite Slop (https://infiniteslop.ai/)` and `H3 Max Director (https://fal.ai/h3-max-director)` published entirely unlinked — the second of those is a path, not a bare domain, which is likely why. So keep the markdown `[label](url)` form here (it renders, as above) rather than flattening, and if a URL must appear bare, write it as a schemeless domain in prose and verify the anchor on the permalink. No edit control is reachable on a published post to fix it afterwards.

Deleting a post: its Menu control at the top-right of the card opens `Delete`, and a confirm dialog follows. Identify the target by its permalink before deleting — and where a defect is the reason, by the defect's own signature in the body as well. Verify on the permalink that an `a[href]` exists and that `[` … `](` appears nowhere in the rendered text. Read-back here is a trap in both directions. The composer does not clear on success, so an empty-box check reports failure on a post that landed — and, worse, counting occurrences of the body text *on the same page* counts the text still sitting in the composer, which reported a successful publish for a post that was never created. Verify on `wonderful.dev/<handle>`: open the `post/thread_<id>` permalinks and confirm one of them is the new body, since old posts live at the same URL shape and a permalink alone proves nothing.

A long body does not publish, and the failure is completely silent. With 3923 characters and the image attached, the composer read back perfectly (exact length, matching head and tail, one 1080x1080 blob) and the `Post` button submitted nothing under four different forms: a coordinate click on a rect re-read immediately beforehand with a positive hit-test, an element-handle click (actionability timeout), `el.click()` from `page.evaluate`, and `Ctrl+Enter` / `Cmd+Enter`. No validation text, no `disabled`, no `aria-disabled`, no `maxlength`, no character counter. The profile listing kept the same six `thread_` permalinks and zero occurrences of the body after every attempt, so nothing was created and no duplicate exists.

The cap is 2000 characters, and the page's own console says so. `browser_console_messages` after a failed submit carried the answer in one line:

```text
POST /api/trpc/posts.createPost → 400
{"code":"too_big","maximum":2000,"inclusive":true,"path":["content"]}
```

That is a passive reading of what the page itself did — the correct first move on any silent failure here, and it beat four rounds of click-ladder escalation. Check the body against 2000 characters during the source scan, and where it is over, raise it with the user (trim, split, skip) rather than discovering it at the button; trimming their copy is not a decision to make alone. Trimming by dropping whole source blocks — a section, an example — reads better than truncating mid-paragraph, and the trimmed body still goes through the ordinary pre-submit diff against what was actually sent.

The Post button moves after the image lands — from `y≈648` to `y≈1027` on a 1068 px viewport, right at the bottom edge — and a probe run just after filling reports the old position. Re-read the rect in its own call immediately before clicking. Also note the composer renders the markdown source literally in its own textarea, syntax-highlighting URLs and hashtags; that preview says nothing about how the post will publish.

The body's hashtags are dead characters here. Measured on a published post: the three `#tag` words render as plain text with zero anchors among them. Drop the tag line before filling; there is nothing on this platform for it to feed. `daily-dev` behaves identically.
