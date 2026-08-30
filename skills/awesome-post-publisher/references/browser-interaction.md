# Browser interaction — what actually works through the extension bridge

Hard-won mechanics for driving real social UIs through Playwright MCP `--extension`. Read this **before** the first composer of a run, not after the third timeout. Every rule here cost a failed attempt on a live account.

## Which browser are you attached to

Extension mode attaches to **Chrome or Edge only**. Both look identical from a tab list, and a machine can run one bridge per browser — a separate Playwright MCP server entry, its own extension pairing, its own token — so the tools you happen to have are not proof of which profile is on the other end.

Settle it before the first action, in this order:

1. **Ask, when there is a choice.** Two or more browser-automation tool namespaces exposed in the session means two possible destinations. Ask which one; picking the first is how a post lands from the wrong profile.
2. **Probe the engine.** `navigator.userAgent` distinguishes them: Edge carries `Edg/<version>` after the Chrome token, Chrome does not. Read it once, in the working tab.
3. **Probe the identity.** The open tabs and the platform pages themselves say whose session this is — the account handle in a header is the real answer to "which profile", and it is what the per-platform login check reads anyway.
4. **Report it.** Name the browser and the handle in the run plan. The user is the only one who knows whether that is the account they meant.

The extension pairing token belongs to the agent's MCP configuration. Never read it out of a config file, never print it, never ask for it in the conversation — it grants control of a browser holding live sessions, and a transcript is not a place to keep one.

## The bridge's two constraints

1. **Tool calls time out at ~5 seconds.** Anything slower — a multi-step click sequence, a screenshot of a heavy page, a wait — must run inside ONE `browser_run_code_unsafe` call, which has its own longer budget. Do not chain five 4-second tool calls when one script does the job.
2. **Playwright's actionability wait never settles on heavy SPAs.** VK, X, Facebook and Instagram continuously animate, lazy-load and re-render. `browser_click` fails with `TimeoutError: waiting for element to be visible, enabled and stable` even when a DOM probe shows the element is visible, `pointer-events: auto`, hit-testable and with a rect that does not move across three consecutive frames. This is not a stale selector — re-deriving from a fresh snapshot returns the same element and fails the same way.

## The click ladder

Climb only as far as needed; stop at the first rung that works. Never repeat a failing rung more than twice — that is the signal to climb, not to retry.

1. **`browser_click`** — try it first. On light pages it just works.
2. **Coordinate click** — the workhorse. Read the rect in-page, then drive the real mouse:
   ```js
   const b = await page.evaluate(() => {
     const el = /* find it */;
     el.scrollIntoView({ block: 'center' });      // instant, NOT smooth — smooth keeps the box moving
     const r = el.getBoundingClientRect();
     return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
   });
   await page.mouse.move(b.x, b.y); await page.waitForTimeout(400);
   await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up();
   ```
   The separate `move` → `down` → `up` with pauses beats `page.mouse.click()` on UIs that gate on hover state, and it reads as human. It bypasses the actionability wait entirely while still producing a **trusted** event.
3. **Focus + Enter** — for `role="button"` / `tabindex="0"` items, especially dropdown menu entries: `el.focus()` in-page, then `page.keyboard.press('Enter')`. This rescued VK's create-post menu when both click forms timed out.
4. **`page.evaluate(el => el.click())` — last resort, and never for file inputs or anything gated on user activation.** It is an untrusted event; Chrome ignores it for file choosers and some frameworks ignore it entirely.

**Coordinates shift between renders.** Re-read the rect immediately before each click inside the same script. A rect captured before a `waitForTimeout` is already stale on these pages.

## File inputs — the rule that prevents the worst incident

**NEVER take a page-wide file input.** `document.querySelectorAll('input[type=file]')[0]` and `locator('input[type=file]').first()` are how you upload a post image into the account's photo album instead of the composer. That happened on VK: the community page carries three file inputs, the first belongs to the Photos section, and `setInputFiles` on it added the image to a public album and navigated away, destroying the composer draft.

Rules, in order:

1. **Scope to the composer's own dialog subtree**, never the document:
   ```js
   const h = await page.evaluateHandle(() => {
     const dlg = [...document.querySelectorAll('[role="dialog"]')]
       .find(d => /* identify the composer, e.g. aria-label or its heading text */);
     return dlg.querySelector('input[type=file]');
   });
   await h.asElement().setInputFiles(absolutePath);
   ```
2. **Disambiguate by `accept` when several live inside the dialog.** A composer that takes photo *and* video has `accept` containing `video/*`; an image-only input next to it is usually an album/avatar/cover uploader. On VK the composer input is the `video/*` one and the `image/jpeg,image/png,image/gif` one is the album.
3. **`setInputFiles` needs no click and no user activation** — that is why it is preferred over clicking a hidden label, which Chrome may block. But it is exactly why targeting is on you.
4. **Verify before submitting**: the preview image must appear *inside* the composer (a `blob:` or CDN `src` within the dialog), the caption text must still be intact, and `location.href` must be unchanged. **A navigation right after `setInputFiles` means you hit the wrong input** — stop, find out what was created, and report it before touching anything else.

## Typing

- Click into the field with a real mouse click first, then `page.keyboard.type(text, { delay: 7-12 })`. Cheap, human-paced, and one script call for a whole post.
- `fill()` **replaces** the whole value. Fine for a single shot into an empty contenteditable (it worked on VK, producing correct `<br><br>` paragraph breaks); never use it to append — the second call wipes the first.
- Blank line between paragraphs = two `Enter` presses. Then verify: `innerText` may show `\n\n\n` for one visual blank line depending on the editor's block model. Compare against the source file's *meaning*, not its exact whitespace.
- Always read back the field length and compare to the source before submitting.

## Submitting — do not navigate away

The single most expensive failure of the run: clicking share on Instagram, then navigating to the profile to read back while the upload was still in flight. A transient `ERR_NAME_NOT_RESOLVED` killed it and nothing landed.

**Poll the composer's own success state in-page, in one script, until it confirms or the dialog closes:**

```js
const states = [];
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(2500);
  const s = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText.slice(0, 90) : 'NO-DIALOG';
  });
  states.push(s);
  if (/posted|shared|размещена|опубликован|NO-DIALOG/i.test(s)) break;
}
```

Only after that leave the page for read-back. Keep `states` — it is the evidence trail when something goes wrong.

## Read-back needs a baseline

Capture the counter **before** composing: profile post count, album photo count, wall post count. Read-back is then a delta, not a guess.

- **Never infer "newest" from the highest ID or from DOM order.** A VK album returned its highest-ID item as photo #40 of 233 — IDs are not chronological across a long history, and virtualized grids only hold a window of items.
- Prefer, in order: the count changed by exactly one → the platform's own "newest" affordance (first grid tile, top of feed) → open the permalink and confirm the text, timestamp and media.
- Exactly `+1` also proves **no duplicate**, which is worth as much as proving the post exists.
- Grids and feeds are lazy: an empty query result is usually "not rendered yet", not "absent". Wait and re-query, or read a paginated URL, before concluding anything.

## Locale

The user's UI can be in any language — this run met Russian Instagram and Ukrainian Facebook while the campaign was Russian and English. **Match on `data-testid`, `aria-label`, and `role` first.** When only text will do, use a multi-locale alternation (`/^(Next|Далее|Далі)$/`) and never a bare English literal.

## Modals, dialogs and toggles

- **`beforeunload` while a draft exists** (X does this): the tool surfaces a modal state. Dismiss with `accept: false` to *keep* the draft; accepting discards work you cannot retype for free.
- **Several `[role="dialog"]` elements coexist** — notifications panels, account menus, empty portals. Never grab `querySelector('[role="dialog"]')` blindly; identify by `aria-label` or distinctive text.
- **Skeleton screens**: Facebook's post-settings step renders grey placeholders first. A DOM probe run too early reads the *previous* step and looks like "the button did nothing" — wait and re-probe before concluding a click failed.
- **Cross-post and paid toggles must be read before submitting**: Instagram's "Threads" share checkbox and AI-label, Facebook's Share to groups / Share to story / Promote. Confirm they are off unless the post file asks for them, and never enter a paid boost flow.

## Screenshots

`browser_take_screenshot` times out on heavy pages. Fall back to:

```js
await page.screenshot({ path: 'name.png', scale: 'css', animations: 'disabled', timeout: 25000 });
```

Screenshots and the server's `.playwright-mcp/` directory land in the current working directory — often the user's git repo. Move them to the session scratchpad at the end of the run; do not leave untracked artifacts in a project tree.
