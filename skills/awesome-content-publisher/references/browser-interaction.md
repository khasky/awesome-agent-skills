# Browser interaction — what actually works through the extension bridge

Hard-won mechanics for driving real social UIs through Playwright MCP `--extension`. Read this before the first composer of a run, not after the third timeout. Every rule here cost a failed attempt on a live account.

## Which browser are you attached to

Extension mode attaches to Chrome or Edge — the Playwright extension ships on the Chrome Web Store and its own prerequisites name Chrome, Edge and Chromium; Firefox and Safari are not part of this mode. Both look identical from a tab list, and a machine can run one bridge per browser profile — the pairing token is per profile, so a second browser (or a second profile in the same one) is a separate server entry with a separate token. The tools you happen to have are not proof of which profile is on the other end.

Not installed yet, or the user wants a second browser dedicated to these accounts: the extension is <https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm> (published by the Playwright team; Edge installs it from that same Chrome Web Store listing), and its source and setup notes are at <https://github.com/microsoft/playwright/tree/main/packages/extension>. Each browser profile gets its own token from the extension's status page, and that token goes into the MCP server entry for that browser — by the user, in their own configuration, never through this conversation.

### The target gate — mandatory, before the first navigation

A tool that exists is not a bridge that is connected. Three states, and only the first is ready: attached (tabs answer); *present but unauthenticated* — the browser tools are listed yet the session reports the MCP server needs authentication, or the extension's status page says `No clients are currently connected`, which is the token case below and not a reason to fall back to fetching; absent — no browser tool at all, or a lone `about:blank` from a spawned clean browser.

Never begin on whichever bridge answers first. Run these four steps and get a yes:

1. Ask, when there is a choice. Two or more browser-automation tool namespaces in the session means two possible destinations. Ask which one, by name. Picking the first is how a post lands from the wrong profile.
2. Probe the engine. `navigator.userAgent` separates them: Edge carries `Edg/<version>` after the Chrome token, Chrome does not. Read it once in the working tab.
3. Probe the identity. Whose session is this? The account handle a platform shows in its own header is the answer — the same read the per-platform login check makes anyway. One platform is enough to identify the profile; on a run touching several, collect them all.
4. Confirm with the user before anything else happens — as a structured question, not a sentence. State the browser, the profile it is signed in as, and what is about to be done in it, then ask through the agent's structured-question UI with the choices spelled out: proceed here · use the other bridge (when one exists) · stop. A gate written as "say go and I'll start" is prose the user has to answer in prose; it reads as narration, gets skipped in a fast reply, and leaves no record of what was approved. Where the UI is unavailable, ask a numbered question and wait for the number. This gate is not satisfied by mentioning the browser in a later report — by then the work has run in it.

### Pointing the bridge at the right browser

Two values decide the destination, and both live in the MCP server entry. How the bridge actually connects: the server opens the extension's relay page — `chrome-extension://<id>/connect.html?mcpRelayUrl=ws://[::1]:<port>/extension/<uuid>&token=<token>` — inside a browser, and the extension there dials back to that WebSocket. It proceeds without prompting only when the token in that URL matches the one that browser's extension holds.

So:

- `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in `env` says *which extension will accept the connection*. It is per browser profile, taken from that profile's status page.
- `--browser` says which browser the relay page is opened in, and without it the server uses the machine's default browser. Two servers with two correct tokens still both open their relay in the default browser, so the one whose token belongs to the *other* browser waits forever — starting cleanly, listening on its port, answering `initialize`, and never answering a tool call. Measured on this exact setup: adding `--browser msedge` turned a 120-second timeout into an immediate connection, verified as `Edg/152` through `navigator.userAgentData`.

Both entries therefore name their browser explicitly:

```jsonc
"playwright":      { "args": ["...", "@playwright/mcp@latest", "--extension", "--browser", "chrome"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Chrome profile's token>" } },
"playwright-edge": { "args": ["...", "@playwright/mcp@latest", "--extension", "--browser", "msedge"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Edge profile's token>" } }
```

A skill still has no lever between calling a browser tool and being connected — the first call *is* the connection — so the gate can only detect which browser answered. Changing it is configuration plus a restart.

A hang is a symptom with a specific meaning. A server that answers `initialize` but never answers `browser_tabs` is not broken and not slow: its relay page went to a browser whose extension holds a different token. Check `--browser` before anything else, and read the intended browser's status page — `No clients are currently connected` there confirms it.

`browser_tabs list` shows only the tabs the extension bridges, not everything open in that browser. A lone `connect.html` is the normal steady state, and the user's own tabs not appearing says nothing about which browser this is. Identify it by user agent, never by what the tab list seems to contain. It is per browser profile and it exists to bypass the extension's connection dialog — with no token the extension asks for approval on every connect, which is the user's click to make, never one to automate.

Each profile shows its own token on the extension's status page, at `extension://mmlmfjhmonkocbjadbfplnigmagldckm/status.html` opened in that browser. The same page is the diagnostic: `No clients are currently connected` there means the running server is paired to some other browser, whatever the tab list of the attached one suggests. The page also carries a regenerate control, so a token can be rolled at any time — after which the config holding the old one is stale until updated.

So when the bridge is missing, or the target gate says the wrong browser answered:

1. Ask which browser should be driven, and have the user open that status page in it.
2. Ask them for the token line it shows. This is ordinary configuration, not a credential to protect from the conversation: it authorizes a *local* process to attach to a browser on the same machine, and anyone able to run that process can read the browser's session data directly anyway. Take it, do not paraphrase it, and do not print it back.
3. Put it where it is read — the `env` of the MCP server entry for that browser. A second browser is a second entry under its own name, so both stay available and the gate's step 1 becomes a real choice. Editing the agent's configuration is the user's call: offer to do it, or hand them the exact block to paste.
4. Restart so the server picks it up, then re-run the gate and confirm the browser and profile before any work starts. A token set but not restarted looks exactly like a token that did not work.

## The bridge's two constraints

1. Tool calls time out at ~5 seconds. Anything slower — a multi-step click sequence, a screenshot of a heavy page, a wait — must run inside ONE `browser_run_code_unsafe` call, which has its own longer budget. Do not chain five 4-second tool calls when one script does the job.
2. Playwright's actionability wait never settles on heavy SPAs. VK, X, Facebook and Instagram continuously animate, lazy-load and re-render. `browser_click` fails with `TimeoutError: waiting for element to be visible, enabled and stable` even when a DOM probe shows the element is visible, `pointer-events: auto`, hit-testable and with a rect that does not move across three consecutive frames. This is not a stale selector — re-deriving from a fresh snapshot returns the same element and fails the same way.

Other runtimes — the snippets are Playwright's JavaScript API because that is the handle the bridge passes into `browser_run_code_unsafe`; none of it is a language choice this skill makes. Driving Playwright from another binding, every call here exists under that binding's own naming (`page.set_input_files` in Python, `Page.SetInputFilesAsync` in .NET), and the function handed to `evaluate` stays browser JavaScript everywhere — the page runs that argument, not the driver.

## The click ladder

Climb only as far as needed; stop at the first rung that works. Never repeat a failing rung more than twice — that is the signal to climb, not to retry.

1. `browser_click` — try it first. On light pages it just works.
2. Coordinate click — the workhorse. Read the rect in-page, then drive the real mouse:
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
   The separate `move` → `down` → `up` with pauses beats `page.mouse.click()` on UIs that gate on hover state, and it reads as human. It bypasses the actionability wait entirely while still producing a trusted event.
3. Focus + Enter — for `role="button"` / `tabindex="0"` items, especially dropdown menu entries: `el.focus()` in-page, then `page.keyboard.press('Enter')`. This rescued VK's create-post menu when both click forms timed out.
4. The accessibility ref: `browser_find` for the label, then click the returned `aria-ref`. On Instagram this opened the create-post dialog first try after coordinate clicks, `getByText` force clicks and the documented icon-column coordinates had all failed silently. It is cheap (one find, one click) and it targets what the page actually exposes rather than where a rect happened to be. Try it early, not last.
5. Element handle: `page.$(sel)` then `handle.click({timeout})` — Playwright's own actionability applies, so it fails where rung 2 fails, but it succeeds on components that ignore synthetic mouse coordinates and only respond to a properly targeted event (Buy Me a Coffee's editor, HackerNoon's controls). Cheap to try after rung 2.
5. Force click: `locator.click({ force: true })` — skips actionability, still a trusted event. It reports success even when the app does nothing, so treat "force ok" as an attempt, never as a result: re-probe for the dialog or the editor before typing.
6. `page.evaluate(el => el.click())` — untrusted, and more useful than its reputation. Never for file inputs or anything gated on user activation, where Chrome ignores it. But frameworks that bind an ordinary click listener honour it perfectly, and it was the only thing that worked for three separate controls in one run: Ko-fi's Bootstrap "Create" dropdown, Ko-fi's `#postUpdateButton`, and Tumblr's "Post now" — each of which sat inert under coordinate, handle and force clicks. When a submit refuses every trusted form, try this before declaring the platform unreachable, then verify by read-back like any other publish.

When the composer refuses to open, stop clicking and look for the platform's own intent route. Several networks publish a URL that opens the composer prefilled, and it beats every rung above because there is nothing to click and the text arrives already counted:

- `https://bsky.app/intent/compose?text=<encoded>`
- `https://www.threads.com/intent/post?text=<encoded>`
- `dev.to/new`, `studio.buymeacoffee.com/posts/new`, `patreon.com/posts/new`, `tumblr.com/new/text`, `hashnode.com/draft/new` — direct composer routes rather than intents, but the same idea: skip the button.

Two more rules learned the hard way:

- Typing that reports success can still land nowhere. `el.focus()` returning `document.activeElement === el`, and a coordinate click on a visible textarea, both preceded fields that stayed empty (Minds, Buy Me a Coffee, Tumblr's tag field). Always read the value back after typing and compare it to the source — length, head and tail — before touching submit.
- The composer may live in a child frame. When the top-document selectors resolve to elements that cannot be typed into, loop `page.frames()`, find the frame whose document has both the title field and the editor, and drive that frame's handles. Buy Me a Coffee's studio does exactly this, and from the top document it looks like an ordinary page with dead fields.

Coordinates shift between renders. Re-read the rect immediately before each click inside the same script. A rect captured before a `waitForTimeout` is already stale on these pages.

A `scrollIntoView` and the rect read after it must be in separate calls. Both inside one `page.evaluate`, the rect comes back pre-scroll — which is how a Create button reported `y≈1393` on a 1068 px viewport and the click at that coordinate hit nothing. Scroll in one call, wait ~1.5 s, read and hit-test in the next, click immediately after.

`elementFromPoint` returning something else names the blocker, and the blocker is usually the fix. Three separate composers in one run refused every click for the same reason and each named its own obstacle: Minds' `.m-composer__triggerOverlay` (click the overlay to expand the composer, then the button is reachable), Tumblr's own "Draft saved!" toast sitting over `Post now`, and a wrapped element whose rect had simply moved. When the hit-test fails, do not climb the ladder — read what came back and clear it.

A click that opens a modal looks exactly like a click that did nothing. Mastodon's Post opens an "Add alt text?" confirmation: the composer keeps its text, the button stays enabled, and every subsequent click — coordinate, handle, JS — is swallowed by the modal, with the element-handle click timing out on actionability. The composer's state cannot tell you this. Screenshot after the first click that changes nothing, before deciding the control is broken.

## File inputs — the rule that prevents the worst incident

NEVER take a page-wide file input. `document.querySelectorAll('input[type=file]')[0]` and `locator('input[type=file]').first()` are how you upload a post image into the account's photo album instead of the composer. That happened on VK: the community page carries three file inputs, the first belongs to the Photos section, and `setInputFiles` on it added the image to a public album and navigated away, destroying the composer draft.

Rules, in order:

1. Scope to the composer's own dialog subtree, never the document:
   ```js
   const h = await page.evaluateHandle(() => {
     const dlg = [...document.querySelectorAll('[role="dialog"]')]
       .find(d => /* identify the composer, e.g. aria-label or its heading text */);
     return dlg.querySelector('input[type=file]');
   });
   await h.asElement().setInputFiles(absolutePath);
   ```
2. Disambiguate by `accept` when several live inside the dialog. A composer that takes photo *and* video has `accept` containing `video/*`; an image-only input next to it is usually an album/avatar/cover uploader. On VK the composer input is the `video/*` one and the `image/jpeg,image/png,image/gif` one is the album.
3. `setInputFiles` needs no click and no user activation — that is why it is preferred over clicking a hidden label, which Chrome may block. But it is exactly why targeting is on you.
4. Verify before submitting: the preview image must appear *inside* the composer (a `blob:` or CDN `src` within the dialog), the caption text must still be intact, and `location.href` must be unchanged. A navigation right after `setInputFiles` means you hit the wrong input — stop, find out what was created, and report it before touching anything else.

5. `browser_file_upload` is sandboxed to the session's allowed roots; `setInputFiles` inside a `run_code` script is not. A campaign folder outside the working repository is the normal case — the posts live with the campaign, the agent runs in a code repo — and the dedicated upload tool refuses that path outright. Neither copy the picture into the repo to satisfy it (that is how a stray `image.jpg` ends up in `.playwright-mcp/`) nor read the refusal as the platform rejecting the file: drive the input from a `run_code` script with the original absolute path.

6. Some composers keep no input to drive — they build one, click it, and remove it. LinkedIn, Bluesky and Medium all do this: `document.querySelectorAll('input[type=file]')` is empty before the media button is clicked and empty again after, so `setInputFiles` has nothing to target and a run concludes the composer takes no media. Clicking the button opens the native file chooser, which the MCP server intercepts and parks as `Modal state: [File chooser]`, blocking the script mid-flight.

   Three things do not work against that, all measured: `page.waitForEvent('filechooser')` inside the same script (the server's own handler wins the race), overriding `HTMLInputElement.prototype.click` to capture the element (the app opens the chooser by another path), and re-querying the DOM after cancelling the chooser (the input is already gone).

   What works: stage one copy of the picture inside an allowed root, answer the parked chooser with `browser_file_upload`, and delete the copy in Phase 9. The allowed roots are printed in the tool's own refusal message. This is the one sanctioned reason to put the campaign's image in the repo tree, it is transient, and the cleanup is already part of finishing a run. Prefer a persistent input where one exists — this is the fallback, not the default.

   When the chooser is parked and you are not ready to answer it, `browser_file_upload` with no `paths` cancels it; the script that opened it has already failed by then, so re-run that step rather than assuming it continued.

7. A composer may raise no chooser at all, because it uses the File System Access API. This is rule 6's harder sibling and `bluesky` has moved to it: `window.showOpenFilePicker` opens a **browser permission prompt** ("wants to access other apps and services on this device"), not a file chooser. `browser_file_upload` refuses with *can only be used when there is related modal state present*, `waitForEvent('filechooser')` times out, and the prompt itself sits over the page blocking every later call the way any native dialog does. The diagnosis takes one probe — no `input[type=file]` anywhere including shadow roots, plus `typeof window.showOpenFilePicker === 'function'` — and the answer is to stop trying to reach a picker and hand the composer a `File` directly through a drop:

   ```js
   const r = await fetch('http://127.0.0.1:<port>/image.png');   // bytes, see below
   const file = new File([await r.blob()], 'image.png', { type: 'image/png' });
   const dt = new DataTransfer(); dt.items.add(file);
   const ed = document.querySelector('[contenteditable="true"]');
   const target = ed.closest('form') || ed.parentElement.parentElement;
   for (const t of ['dragenter', 'dragover', 'drop'])
     target.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: dt }));
   ```

   Getting the bytes into the page is the only awkward part, and two obvious routes are dead ends: the `run_code` sandbox has no filesystem (rule above — `require` is undefined, and a dynamic `import` fails with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`), and a `file://` fetch is blocked. Serve the picture over `http://127.0.0.1` from a throwaway local server with `access-control-allow-origin: *` — localhost is a trustworthy origin, so an https page may fetch it — and stop the server in Phase 9. Verify the attachment by the composer's own per-image controls (`Add alt text`, `Remove image`), never by a `blob:` count, and expect none: this route never creates one.

   Two limits worth knowing before reaching for it. A site with a strict `connect-src` blocks the localhost fetch — Meta's properties do, so on `threads` use its real input, which exists — and the same drop against a composer whose uploader *does* have an input is wasted effort. Try the input first; this is for the case where there is provably none.

## An upload's absence must be proven, never assumed — and retries stack

A missing `blob:` src is not evidence that the upload failed. Truth Social's composer renders an attachment with no `blob:` URL anywhere, and clears `input.files` once the app has taken the file, so the two probes most people reach for — `[...document.querySelectorAll('img')].filter(x => /^blob:/.test(x.src))` and `input.files.length` — both read empty on a composer that is holding the picture perfectly well. A run that trusted them concluded "no image", retried the upload four times, and published a post with four copies of the same picture while reporting the post as text-only. Both halves of that were wrong, and the user had to delete the post.

So verify an attachment by a positive signal the composer itself renders per attachment, and count it:

- an alt/description control that exists once per attachment (Truth Social: `Add Description`; Mastodon: an `ALT` button and a `compose-form__upload__delete`; Bluesky: `Add alt text`),
- a remove/delete control per attachment,
- a gallery class that encodes the count (Mastodon: `media-gallery--layout-1` vs `--layout-2`),
- a thumbnail whose `src` may be `blob:`, `data:` or already a CDN URL — accept any of the three.

```js
// count attachments, don't ask whether one exists
const n = (composer.innerText.match(/Add Description/g) || []).length;   // per-platform token
if (n !== 1) throw new Error(`expected 1 attachment, found ${n}`);
```

Three rules follow, and they cost a public post each:

1. Upload once. Never retry `setInputFiles` because a probe came back empty — re-probe with a positive signal first. Every retry that "failed" may have silently added another copy.
2. Count attachments immediately before submitting, exactly as you compare the body text. A count that is not exactly what the post file declares is a stop, not a note.
3. When the count is wrong, fix it in the composer — Mastodon's `button.compose-form__upload__delete` and its equivalents — rather than publishing and repairing afterwards.

## An uploaded asset's URL comes from the uploader, never from the page

When a platform hands back a hosted URL for the file you just uploaded, take it from the widget's own output — the copyable field it renders, the `value` of the input it fills, or the network response. Never scrape the page HTML for a CDN-looking pattern. Editor pages are full of other people's images: article covers in a sidebar, feed thumbnails, house ads. A regex over the document returns whichever matched first, and that is not your file.

This shipped a wrong picture as both the cover and the in-body image of a published article, with the run reporting success, because `/https:\/\/dev-to-uploads\.s3\.amazonaws\.com\/uploads\/articles\/[\w.-]+/` matched a foreign 300×299 asset in the editor shell. The upload itself had worked; only the URL was wrong. Two properties of the real URL made it unmatchable by that pattern — a different S3 region host, and the file's original extension preserved (`.jpg`, not `.png`).

Then prove the URL is yours. Open it and compare the natural dimensions against the source file:

```js
// the page's own <img> is CORS-restricted; navigate to the URL instead —
// the browser titles the tab "<name> (WxH)", which is enough
```

A one-line dimension check separates your upload from every other asset on the page, and it is the only cheap proof that the file the post will show is the file you sent.

## A submit that does nothing is usually refusing — read the screen

Before treating an unresponsive submit as a UI-automation problem, check whether the form is rejecting it. Bastyon's Post button ignored a coordinate click, a JS `el.click()`, an inner-node click and an element-handle click across two sessions, and the run reported the platform unpublishable — inventing a theory about key-pair signing to explain it. A screenshot showed a red "Please add Tags" line beside the button: the post needed a category. Selecting one cleared it and the very next click published.

So after the first click that changes nothing:

1. Read the composer's own text for a validation message — search for `please`, `required`, `select`, `add`, `must`, and for elements coloured as errors (`[class*=error]`, `[class*=warn]`, red text).
2. Take a screenshot. A coloured one-line warning next to a button is trivial to see and easy to miss in a DOM text dump, especially when it sits in a sibling container your scoped query never reached.
3. Only then climb the click ladder.

The same applies to a disabled-looking control: check `disabled`, `aria-disabled` and whether a required field elsewhere in the form is empty, before concluding the button is unreachable.

## The submit's label is not unique — pick the control inside the composer

The costliest single mistake of one run, four times over. `threads`, `minds`, `instagram` and `pinterest` each carry two or more elements whose text is exactly the submit's word, and on each the first match in document order is the wrong one: a header caption, a sidebar entry, a nav item, or the same verb rendered on a wrapper that no handler is bound to. Clicking it does not error. On Threads and Minds it **closed the composer and cleared the body**, which is indistinguishable from a successful publish — the composer is gone, the text is gone, and only the read-back tells you nothing was created. Each one then cost a full absence-proof cycle (three surfaces, two waits) plus a complete re-entry of the post before the real button could be found.

So never take the first element whose text matches. Enumerate every candidate with its rect before clicking:

```js
const cands = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],div,span')]
  .filter(e => (e.innerText || '').trim() === 'Post')          // the exact submit word
  .map(e => { const r = e.getBoundingClientRect();
    return { tag: e.tagName, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
             w: Math.round(r.width), inDialog: !!e.closest('[role=dialog]') }; })
  .filter(c => c.w > 0));
```

Then choose by these tests, in order: the one inside the composer's own dialog subtree (`inDialog`), then a real `BUTTON` over a `DIV`, then — where several remain — the lowest on screen, because a composer's commit sits at the foot of its own panel while the decoy is usually a heading above it. Threads' pair sat at `y≈114` (the dialog's title row) and `y≈931` (the commit); Minds' at `y≈718` (outside the panel) and `y≈799` (the panel's own). Clicking the higher one first is what produced both silent failures.

Two corollaries. A side panel can cover the real control: Pinterest's Publish sits at the top right, and the drafts panel that opens over it swallowed a click computed from a stale rect — hit-test before clicking, as the `elementFromPoint` rule above already requires. And because the wrong control often *looks* like success, the read-back is not optional and its absence is not proof of a platform fault: before re-submitting anything, re-enumerate the candidates and check you clicked the one in the dialog.

## A tab that keeps vanishing mid-script is closed from outside — stop and ask

A working tab opened through `browser_tabs new` is a script-opened tab, and script-opened tabs are the only ones a page may close with `window.close()`. In one session the tab died three times within seconds of reaching Patreon's `/posts/<id>/edit` route, each time mid-script (`Target page, context or browser has been closed`), while the same route had been driven for ten minutes earlier in the run and a tab on the post's public page survived idle. Whether the page closed it or the user did, the edit was lost each time because `Update` had not been clicked. Two rules: reach editors by in-page navigation from a page that has already proven stable (the post's `Edit` control, not a fresh `goto` of the edit URL), and after the second loss stop retrying, leave the ledger entry as it was, and ask the user to open the editor themselves and leave it open — a tab the user opened cannot be closed by script, and `browser_tabs list` then shows it to attach to.

A later run met the same thing twice on the same route, and added one fact worth having: the draft survives. Both deaths came while driving Patreon's link popover (clearing a URL field, then `Save`), and both times reopening `patreon.com/<handle>/posts/<id>/edit` showed title, every block, the uploaded image and the quote block exactly as they were — this editor autosaves, so a tab death there costs the current keystroke, not the post. That changes what to do rather than whether to stop: reopen once, verify the draft against the source, and then finish through a different control rather than the one that killed the tab. The second death is still the stop signal for that control.

## An SPA tab that has stopped hydrating never recovers — open a new one

Bastyon rendered its app shell (46 KB of HTML, all the container divs) with `document.body.innerText.length === 0` on every route, through reloads, cache-bypassing reloads and 20-second waits. Both `/index` and the profile route were dead in that tab, while the same browser rendered the site normally for the user. Opening a new tab booted the app immediately, draft intact.

When a client-rendered site returns an empty body on a route that worked earlier in the run, do not keep reloading: open a fresh tab. And note where a platform keeps its draft — Bastyon's composer draft lives on the profile route (`/<handle>?read=1`), not the feed, so a run that only ever looked at the feed can miss a draft that is sitting there waiting for one click.

## A control outside the viewport is not clickable

`getBoundingClientRect()` happily returns coordinates for an element that is scrolled off screen, and `page.mouse.click` at those coordinates hits whatever is actually painted there. Three submits in one run were lost this way: Truth Social's Truth button sits at `y≈1177` in a 1068 px viewport and the click landed on the attachment image; Lemmy's community picker sits at `y≈1187`; wonderful.dev's Post button moves from `y≈154` to `y≈1045` the moment an image is attached.

Before every click on a submit or a picker:

```js
const r = el.getBoundingClientRect();
if (r.y < 60 || r.y + r.height > innerHeight) { await page.mouse.wheel(0, r.y - 400); await page.waitForTimeout(1200); }
// re-read the rect AFTER scrolling, then hit-test
const top = document.elementFromPoint(cx, cy);
const ok = el.contains(top) || el === top;
```

Widening the window does not always help: HackerNoon's story-settings sidebar (the *original / category* gates) sits at `x≈2624` and moves further right as the viewport grows, because the layout scales with it. A control that no viewport size can reach is the one legitimate case for `el.click()` from `page.evaluate` — that is what cleared both HackerNoon gates.

When the page refuses to scroll, make the window taller instead of fighting it. Lemmy's create-post page reported `scrollHeight` 1778 against a 1068 viewport with no scrollable ancestor, and `window.scrollTo`, `scrollIntoView` and `mouse.wheel` all left `scrollY` at 0 and the `Create` button pinned at `y≈1647`. One `browser_resize` to a viewport taller than the document put it in reach and the click landed first try. The check is cheap: if a control's `y` exceeds `innerHeight` and one scroll attempt does not move its rect, resize rather than climbing the click ladder. A taller viewport is also worth keeping for the rest of a run — it removes this whole class of failure on long editor pages — but re-read every cached coordinate afterwards, because the resize reflows the page.

## Enumerate the controls; do not guess their labels

Twice in one run a control that existed was reported as missing because the probe filtered `document.querySelectorAll('button')` through a guessed regex: LinkedIn's `button[aria-label="Add media"]` and wonderful.dev's `input[type=file][accept="image/jpeg,image/png,image/gif"]`. Both were plainly there. The conclusions written from those probes ("the sharebox has no media control", "the composer exposes no file input") were false, and both posts shipped without their picture.

When something appears to be absent, dump every candidate once — tag, `aria-label`, `title`, `innerText`, `type`, rect — and read the list, rather than narrowing by a term you expect to find. Include `div[role="button"]`, `label` and `a`: LinkedIn's "Start a post" is a `DIV`, so a `button`-only sweep finds nothing and the feed composer looks broken when it was simply never clicked.

## Composer state can gate its own controls

LinkedIn's sharebox shows Add media on an empty composer and removes it once the editor holds text, so the natural order — write, then attach — makes the attach control disappear and the post go out bare. Where a composer offers media, attach first and type second, then re-verify the text and the attachment count before submitting.

## Typing

- Target every field by its own identity — never "the first visible text input". Composer dialogs carry neighbours that accept text just as happily: Instagram's alt-text accordion sits beside `aria-label="Add location"` and `aria-label="Add collaborators"`, and falling back to the first text input typed a whole alt description into the location field. Match on `id`, `placeholder`, `aria-label` or `data-placeholder`; when none of them identifies the field, stop and report rather than guessing, and if text has already gone somewhere wrong, clear it and re-read the field before submitting.
- When typing lands nowhere, use `page.keyboard.insertText(text)`. It delivers the whole string as one input event and filled editors that swallowed everything else: LinkedIn's Quill, Ko-fi's textarea, Tumblr's block editor, Truth Social's composer. Two caveats. It replaces the current selection, which is the cleanest way to clear a field that resists `Ctrl+A`+Backspace — `t.focus(); t.setSelectionRange(0, t.value.length)` in-page, then insertText. And it inserts as a single block: rich editors collapse the blank lines, so a body typed this way comes out as one paragraph with sentences running together. Where paragraph breaks matter, insert per paragraph with an explicit `Enter` between, or record the post `degraded`.
- After `insertText`, the caret is not where you think it is. The editor is still reflowing when the call returns, and the next keystrokes land at a stale position: typing a URL straight after an `insertText` on peerlist split the last word and published `…before de` + the URL + ` tails.` Always press `Control+End` (or re-place the caret with a Range) and wait a second before typing anything more.
- Rich editors displace characters during fast paragraph-by-paragraph insertion. Patreon's editor and Ko-fi's Froala both took the tail off a paragraph and appended it to the body's last line: `very little tex` and `/eli5 Fourier trans` with `formst` glued onto the closing URL. The total length looked right in both cases, so diff every block against its source paragraph, not the whole string, and repair in the composer before submitting.
- Never press `Escape` between inserts to dismiss a menu. It scrambled Tumblr's block order — the last paragraph came out first — and nothing needed dismissing: `insertText` does not trigger a slash-command menu. If a menu does open, click elsewhere in the same block instead.
- A field whose only distinguishing attribute is a `placeholder` loses it the moment it holds text. Tumblr's tag textarea is `textarea[placeholder="#add tags"]` while empty and `textarea[placeholder=""]` after the first character, so a selector pinned to the placeholder finds nothing and the run reports the field as broken when the typing worked. Re-find such a field by container and tag, and verify by reading its `value`.
- `el.focus()` and a coordinate click are not interchangeable. On Tumblr's tag field a coordinate click leaves `document.activeElement` on `BODY` while `el.focus()` sets it correctly — the opposite of most composers. Probe both and use whichever makes `document.activeElement === el` true.
- Click into the field with a real mouse click first, then `page.keyboard.type(text, { delay: 7-12 })`. Cheap, human-paced, and one script call for a whole post.
- Assert the editor is empty before typing. Composers restore drafts: daily.dev's create-post modal came back holding a different platform's body, and the new paste landed in the middle of it. Clear with a click into the editor, `Control+a`, `Delete`, then read the length back as 0 — and clear the title field the same way, or the second fill doubles it.
- `fill()` replaces the whole value. Fine for a single shot into an empty contenteditable (it worked on VK, producing correct `<br><br>` paragraph breaks); never use it to append — the second call wipes the first.
- Blank line between paragraphs = two `Enter` presses. Then verify: `innerText` may show `\n\n\n` for one visual blank line depending on the editor's block model. Compare against the source file's *meaning*, not its exact whitespace.
- Always read back the field length and compare to the source before submitting.

## Formatting a rich editor: only a real caret counts, and never touch its DOM

Applying a format (a heading, a link) to text that is already in a rich editor has exactly one reliable shape, and two tempting shortcuts that both fail silently.

What works — put a real caret in the block with a real mouse click, select with the keyboard, verify the selection, then send the shortcut:

```js
// 1. bring the block into the viewport and re-read its rect afterwards
await page.mouse.wheel(0, y0 - 420); await page.waitForTimeout(1100);
const r = await page.evaluate(t => { const p = [...document.querySelectorAll('section p')]
  .find(x => x.innerText.trim() === t); const b = p.getBoundingClientRect();
  return { x: Math.round(b.x + 40), y: Math.round(b.y + b.height/2) }; }, text);
// 2. real click, then keyboard selection
await page.mouse.click(r.x, r.y);
await page.keyboard.press('Home');
await page.keyboard.down('Shift'); await page.keyboard.press('End'); await page.keyboard.up('Shift');
// 3. assert the selection is what you think it is, THEN format
const sel = await page.evaluate(() => window.getSelection().toString().trim());
if (sel !== text) throw new Error('selection mismatch: ' + sel);
await page.keyboard.press('Control+Alt+Digit2');
```

Shortcut 1, which does nothing: building the selection with `range.selectNodeContents(p)` + `selection.addRange(range)` and then pressing the shortcut. The DOM selection exists, `window.getSelection()` reports the right text — and the editor ignores it, because its own model never saw a caret. Seven Medium headings failed this way and shipped as plain paragraphs. Mouse *drag* selection and triple-click fare no better: CDP-synthesised mouse events reach the element (`elementFromPoint` confirms it) and focus the editor, yet produce no native selection at all.

Shortcut 2, which is worse because it looks like it worked: `document.execCommand('formatBlock', false, 'h3')`. It returns `true`, the paragraph visibly becomes a heading, and every DOM assertion passes. But the editor's document model never registered the change, so the autosave stores nothing — reload the page and all of it is gone. Never mutate a rich editor's DOM directly; if a change did not travel through the editor's own event pipeline, it does not exist. Verify formatting by reloading the editor, not by reading the DOM you just changed.

Finally, the editor's tag names are not the published ones: Medium's editor writes `h3` for the title and `h4` for section headings, which render as `h1` and `h3` on the published page. Assert heading structure on the published article, never in the editor.

## Submitting — do not navigate away

The single most expensive failure of the run: clicking share on Instagram, then navigating to the profile to read back while the upload was still in flight. A transient `ERR_NAME_NOT_RESOLVED` killed it and nothing landed.

Poll the composer's own success state in-page, in one script, until it confirms or the dialog closes:

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

But that loop only works where the submit keeps you on the page. Where the click *navigates* — Lemmy's `Create`, Substack's send, most full-page editors — the very next `page.evaluate` races the navigation and hangs, the whole tool call is parked as a background task after two minutes, and the run is left unable to say whether the post exists. Both Lemmy and Substack did exactly this in one run, at five minutes each.

So split by composer type, and decide before clicking:

- Composer is a dialog on a page that stays (Instagram, Mastodon, Threads, X, Facebook, Minds) → click and poll in the same script, as above.
- Composer is a page that navigates on submit (Lemmy, Substack, Hashnode, Medium, dev.to, Patreon, daily.dev) → click, wait once, return. Verify in the *next* call, from the URL or a fresh navigation. A short `waitForTimeout` after the click is fine; a polling loop is not.

A parked call is not a slow call. When a call whose own budget was under a minute is still running at three or five, it has hung: `TaskStop` it, then establish from a fresh page what actually happened before touching the control again. Do not re-click on the assumption that nothing landed — that is how a duplicate gets made on a platform that cannot edit.

A wedged tab answers the bridge and nothing else. After Substack's hung send, `browser_tabs list` still reported the tab and its title, while every `evaluate` against it hung — the page's JS thread was blocked, not the connection. The tab list answering is not proof the page is alive. Open a new tab, read the public surface there (an archive page, a profile, a permalink), and close the dead one; see also *An SPA tab that has stopped hydrating never recovers*.

## Read-back needs a baseline

Capture the counter before composing: profile post count, album photo count, wall post count. Read-back is then a delta, not a guess.

- Never infer "newest" from the highest ID or from DOM order. A VK album returned its highest-ID item as photo #40 of 233 — IDs are not chronological across a long history, and virtualized grids only hold a window of items.
- Prefer, in order: the count changed by exactly one → the platform's own "newest" affordance (first grid tile, top of feed) → open the permalink and confirm the text, timestamp and media.
- Exactly `+1` also proves no duplicate, which is worth as much as proving the post exists.
- Grids and feeds are lazy: an empty query result is usually "not rendered yet", not "absent". Wait and re-query, or read a paginated URL, before concluding anything.

Separate a *failed submit* from a *lagging platform* before spending an absence-proof cycle on it, because the two look identical and only one of them is expensive. The cheap discriminator is what the click did: re-enumerate the controls carrying the submit's label and check the one you clicked was inside the composer (the same-label rule above). A click on the wrong control leaves the composer closed or cleared with **no network write at all** — `browser_network_requests` shows no create call — and that is a failed submit you can redo immediately, with no waiting and no duplicate risk. A real submit that has not surfaced yet shows the create request with its `2xx` and its returned id, and then the only correct action is to wait: LinkedIn took several minutes to put a published post on its own activity listing, and a run that read that gap as failure came within one click of a duplicate. Read the page's own network log — never replay the call — and let it decide which of the two you are in before any retry, any wait, or any report of a platform fault.

## Locale

The user's UI can be in any language — this run met Russian Instagram and Ukrainian Facebook while the campaign was Russian and English. Match on `data-testid`, `aria-label`, and `role` first. When only text will do, use a multi-locale alternation (`/^(Next|Далее|Далі)$/`) and never a bare English literal.

## Modals, dialogs and toggles

- `beforeunload` while a draft exists (X does this): the tool surfaces a modal state. Dismiss with `accept: false` to *keep* the draft; accepting discards work you cannot retype for free.
- **An unhandled native dialog freezes the page, and every later call inherits the freeze.** This is the single most misleading failure in the whole file, because nothing in the DOM says so. A run navigated away from a composer that still held text, Chrome raised *Leave site? Changes you made may not be saved*, and from then on `browser_evaluate` hung on that tab, `browser_tabs close` hung, and a `page.evaluate` fetch that works perfectly hung too. The run diagnosed a wedged JS thread, opened replacement tabs, and then built an entire theory about Content-Security-Policy and Private Network Access to explain a `fetch` that was never blocked — it was simply queued behind a modal the run had never looked at. Two rules follow. Any `page.goto` away from a composer holding text can raise it, so handle it rather than navigate blind. And when a call hangs on a tab that answered a moment ago, **take a screenshot before any other theory** — `browser_handle_dialog` clears it in one call, where the misdiagnosis cost an hour. A browser-level permission prompt (see the File-System-Access note in the file-inputs section) blocks the page in exactly the same way and looks identical.
- Several `[role="dialog"]` elements coexist — notifications panels, account menus, empty portals. Never grab `querySelector('[role="dialog"]')` blindly; identify by `aria-label` or distinctive text.
- Skeleton screens: Facebook's post-settings step renders grey placeholders first. A DOM probe run too early reads the *previous* step and looks like "the button did nothing" — wait and re-probe before concluding a click failed.
- The commit is often a second control inside what the first click opened. Hashnode's header `Update` opens a *Post settings* dialog carrying its own `Update`; Substack's `Continue` opens a confirm panel carrying `Update now`; ko-fi's Publish runs an inline `onclick="iceConfirmPublish(...)"` that raises a SweetAlert2 confirm (`Publish now?` / `Publish it!`). A run polling only `location.href` and Bootstrap's `.modal` never saw the last one and reported the post as unpublished for hours. After a save or publish click, enumerate `[role=dialog]`, `[role=alertdialog]`, `.swal2-container` and any newly-appeared button carrying the same verb, before concluding anything.
- A toolbar button can open a menu rather than act. Substack's `title="Insert image"` opens a popover offering *Image / Gallery / Stock photos / Generate image*; the button alone adds no input, no dialog and no file chooser, which reads as a dead control. The menu lives in a portal — look in `[role=menu]` and `[data-radix-popper-content-wrapper]`, not in the editor subtree — and the item that means "from my computer" is what parks the native file chooser.
- Cross-post and paid toggles must be read before submitting: Instagram's "Threads" share checkbox and AI-label, Facebook's Share to groups / Share to story / Promote. Confirm they are off unless the post file asks for them, and never enter a paid boost flow.

## Screenshots

`browser_take_screenshot` times out on heavy pages. Fall back to:

```js
await page.screenshot({ path: '<run scratch>/x-submit.png', scale: 'css', animations: 'disabled', timeout: 25000 });
```

Every path these tools take is resolved against the current working directory, which is the folder the run was invoked from and usually the user's git repo — and that directory is also the boundary. The MCP tools read and write only inside their allowed roots: a `filename` under the session scratchpad in `%TEMP%` (the path Phase 1 would otherwise reach for) was refused outright with `File access denied ... outside allowed roots`, which stops `browser_run_code_unsafe` from loading a generated script before it stops anything else. The refusal message prints the roots, so settle this with one cheap write before the first composer rather than at the third timeout: try the run's own scratch folder, and where it is refused, put the artifacts in a gitignored folder inside the working directory instead — the server's own `.playwright-mcp/` is already ignored in most repos and is the obvious choice. What matters either way is that every path is absolute and written from the first call: a bare `name.png` is the defect, and sweeping files up at the end does not repair it, because an interrupted run never reaches its cleanup and what it leaves is a screenshot per platform and a helper script per composer sitting in someone's repository. Create the folder before the first browser call — a path whose directory does not exist fails with `ENOENT` before anything runs. Phase 9 then removes what the run made there, and the report names the folder.

The boundary applies to the tools, not to Playwright. A path handed to `setInputFiles` from inside a `run_code` script is opened by the server process itself and reaches a campaign folder anywhere on disk; it is `browser_file_upload`, `browser_take_screenshot` and the `filename` parameters that are confined. So a picture outside the working directory is still attachable without copying it in, and only the run's own artifacts need the folder above.

## The run_code sandbox: what is and is not in scope

The function handed to `browser_run_code_unsafe` runs in the Playwright server process, not in Node's module scope: `require` is not defined, so a script cannot read the post file itself. Generate the script with the body already embedded as a JSON literal and load it with the tool's `filename` parameter. That is also the only way to keep a 4 KB body out of the conversation on every retry.

Never retype a body into a script by hand. Twice in one run a body was reconstructed from memory instead of generated from the source file, and both times the last line went missing — a hashtag line on one platform, a whole trailing tag line on another. The pre-submit diff caught them, but only because the diff compares against the file. If a script needs the text inline, generate it; if it is already inline, diff it against the file before submitting.

When `filename` names a file that already exists, the file on disk is what runs — the `code` argument is ignored. Two symptoms follow from not knowing this: a stale script keeps executing while you edit the `code` payload and nothing changes, and a `SyntaxError` appears from a file you never looked at. Write the script to the path first (a shell heredoc is the cheapest way), then call the tool with that `filename` and any placeholder in `code`. The path is an absolute one in this run's artifact folder, which also settles the stale-script trap: a folder of the run's own cannot hand the tool last run's file under the same name. That folder has to sit inside an allowed root — see the screenshot section above, where a scratchpad outside the working directory was refused. The directory must exist — a missing one fails the call with `ENOENT` before anything runs.

Write Windows paths with forward slashes inside the inline `code`. `D:\repos\...` survives one layer of JSON encoding and arrives as `eposgithub...` — the backslashes are eaten and the path is unrecognisable. `D:/repos/...` works everywhere Playwright takes a path, including `setInputFiles`.

Arguments must be passed, not closed over. `page.evaluate(fn, arg)` serialises `arg`; a name referenced inside `fn` that only exists in the outer script throws `ReferenceError` in the page. It reads like a typo and costs a round trip.

`browser_evaluate` accepts a `filename` and writes the result there instead of returning it — the way to pull a whole editor's block list out for a local diff without flooding the context. Note where it lands: a relative `filename` resolves against the current working directory (the repo root), not against `.playwright-mcp/`, and the same is true of `page.screenshot({ path })`. Give both an absolute path in the run's artifact folder, which is inside an allowed root.

## A hung tool call can leave a process eating the machine

Two `browser_run_code_unsafe`-adjacent Bash calls timed out on an infinite loop in a local helper and were reported as "still running". Left alone, those Python processes grew to 4 GB and 41 GB of working set — the machine had 0.2 GB of its 64 GB free by the time anyone looked, and every later browser call was competing with them. A timed-out call is not a call that stopped.

After any tool call that times out or is moved to the background, check for the process it started and kill it if the work is abandoned (`tasklist` / `Get-CimInstance Win32_Process` on Windows, `ps` elsewhere), and use `TaskStop` on the harness task as well — stopping the task does not always reap the child. A runaway helper is also a plausible cause when browser calls that worked a minute ago start timing out.

## The run_code sandbox is not a browser and not a full Node

The function body handed to `browser_run_code_unsafe` executes in the MCP server's own scope, and that scope has `page` and very little else. `setTimeout`, `setInterval` and `clearTimeout` are not defined there, and a reference to one throws `setTimeout is not defined` at the moment the expression is evaluated. This bites in exactly one place: the timeout-race wrapper, `Promise.race([slowThing(), new Promise((_, rej) => setTimeout(rej, N))])`. Array elements evaluate left to right, so `slowThing()` is *already running* when the second element throws — the call fires, the race dies, and the `catch` reports a failure for an operation that went on to succeed. One run read `setTimeout is not defined` for both file inputs, concluded the upload had failed, re-opened the picker and found the cover image already attached.

Wait with `page.waitForTimeout(ms)`, which is Playwright's and does exist, and give a slow call its own `{timeout: ms}` option instead of racing it. Where a genuine deadline is needed, poll: a loop of `page.waitForTimeout` plus a cheap `page.evaluate` check, breaking when the condition holds. And when a wrapper does throw, re-read the page before believing the failure — an exception raised beside a call says nothing about the call.

(`page.evaluate` runs in the page, where `setTimeout` is normal. The restriction is the outer function body only.)

## A submit that "does nothing" is usually a dialog nobody read

Three platforms in one run presented the same symptom — the submit is enabled, the click hit-tests true, nothing happens, the URL does not change — and in all three the page had already answered: it had opened a confirmation, and the run's probe had looked for the wrong words.

- HackerNoon raises `div.modal` reading *"Do you have the rights to publish this content and have you disclosed all vested interests to businesses mentioned?"* with `Yes. I'm ready to submit.` / `No. I'll continue editing.` It is 1147x400 in the middle of the screen and contains the word `Confirm` nowhere, so a probe searching for a `Confirm?` dialog reported no dialog across three sessions and the skill's own notes recorded the button as dead. It is not.
- ko-fi raises a SweetAlert2 (`.swal2-container`, `Publish it!`) that lives outside every `[role=dialog]` and every Bootstrap `.modal`.
- Substack raises *"Do you want to send this post via email?"* with `Publish on web only` / `Also send via email`, and nothing publishes until it is answered.

So after any submit that appears to do nothing, before climbing the click ladder: enumerate every `[role=dialog]`, `.modal`, `[class*="modal"]`, `[class*="popup"]`, `[class*="overlay"]` **and** `.swal2-container` that has a non-zero rect, and print the first 60 characters of each one's text. One call, no guessing at vocabulary. Read what is on screen and answer it.

The same discipline applies to the checklists platforms put beside a submit. HackerNoon renders `n/7 ready` over seven labelled rows, each satisfied row carrying a tick `svg`; the counter alone says only that something is missing, while the rows say which. Read the rows. And read the row's own text rather than inferring from it — one run spent four attempts chasing a phrase in a row's subtext (`Debut, goals, or blogging set`) that named nothing configurable, when the real gap was an empty URL field two sections away.

## One tab, never a second page from run_code

`page.context().newPage()` inside `browser_run_code_unsafe` opened the page and then hung the whole tool call past its timeout, twice on two platforms; the bridge tracks the tab it was given and a page created behind its back never returns. Read-backs on a second surface go through the working tab (`page.goto`, then back), or through `browser_tabs` when a second tab is unavoidable. The one exception that worked was a short-lived page closed inside the same call, and even that is a risk not worth the saved navigation.

## Long bodies and the 30-second action timeout

`handle.type` and `elementHandle.click` carry a 30-second action timeout, and typing a 2,000-character body with a per-key delay runs over it — the call fails with the composer holding the typed prefix and the run has no idea how much landed. Either pass `{ timeout: 120000 }` on the call, or type in chunks of a few hundred characters, and on any timeout read the field back, confirm the value is a prefix of the body, and type the remainder from where it stopped.

## A `beforeunload` after a throwaway probe is accepted, not dismissed

The rule above (dismiss with `accept: false`) protects a draft. After an upload done only to learn the asset's URL, the page's `beforeunload` guards nothing the run wants: accept it, let the reload finish, and confirm the editor reads empty before the real fill. A navigation blocked by that dialog can still complete the rest of the script once the dialog is answered, so re-read the editor's state rather than assuming the fill did not run.

## Chooser answers need a staged copy; `setInputFiles` does not

`browser_file_upload` reads only from the bridge's allowed roots, so a native chooser (YouTube, Flipboard, LiveJournal, Teletype) is answered from a copy of the campaign image staged in the run's artifact folder — copy each file there before the platform that needs it, and delete the folder in Phase 9. `setInputFiles` on an `input[type=file]` from inside `run_code` reaches any path on disk, so the platforms with a reachable input (Tumblr, Minds, LiveJournal's cover, HackerNoon's widget, the Google picker frame on Blogger) take the source path directly.

