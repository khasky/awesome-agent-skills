# Browser interaction — what actually works through the extension bridge

Hard-won mechanics for driving real social UIs through Playwright MCP `--extension`. Read this **before** the first composer of a run, not after the third timeout. Every rule here cost a failed attempt on a live account.

## Which browser are you attached to

Extension mode attaches to **Chrome or Edge** — the Playwright extension ships on the Chrome Web Store and its own prerequisites name Chrome, Edge and Chromium; Firefox and Safari are not part of this mode. Both look identical from a tab list, and a machine can run one bridge per browser profile — the pairing token is per profile, so a second browser (or a second profile in the same one) is a separate server entry with a separate token. The tools you happen to have are not proof of which profile is on the other end.

Not installed yet, or the user wants a second browser dedicated to these accounts: the extension is <https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm> (published by the Playwright team; Edge installs it from that same Chrome Web Store listing), and its source and setup notes are at <https://github.com/microsoft/playwright/tree/main/packages/extension>. Each browser profile gets its own token from the extension's status page, and that token goes into the MCP server entry for that browser — by the user, in their own configuration, never through this conversation.

### The target gate — mandatory, before the first navigation

**A tool that exists is not a bridge that is connected.** Three states, and only the first is ready: attached (tabs answer); *present but unauthenticated* — the browser tools are listed yet the session reports the MCP server needs authentication, or the extension's status page says `No clients are currently connected`, which is the token case below and not a reason to fall back to fetching; absent — no browser tool at all, or a lone `about:blank` from a spawned clean browser.

Never begin on whichever bridge answers first. Run these four steps and get a yes:

1. **Ask, when there is a choice.** Two or more browser-automation tool namespaces in the session means two possible destinations. Ask which one, by name. Picking the first is how a post lands from the wrong profile.
2. **Probe the engine.** `navigator.userAgent` separates them: Edge carries `Edg/<version>` after the Chrome token, Chrome does not. Read it once in the working tab.
3. **Probe the identity.** Whose session is this? The account handle a platform shows in its own header is the answer — the same read the per-platform login check makes anyway. One platform is enough to identify the profile; on a run touching several, collect them all.
4. **Confirm with the user before anything else happens — as a structured question, not a sentence.** State the browser, the profile it is signed in as, and what is about to be done in it, then ask through the agent's structured-question UI with the choices spelled out: **proceed here** · **use the other bridge** (when one exists) · **stop**. A gate written as "say go and I'll start" is prose the user has to answer in prose; it reads as narration, gets skipped in a fast reply, and leaves no record of what was approved. Where the UI is unavailable, ask a numbered question and wait for the number. This gate is not satisfied by mentioning the browser in a later report — by then the work has run in it.

### Pointing the bridge at the right browser

**Two values decide the destination, and both live in the MCP server entry.** How the bridge actually connects: the server opens the extension's relay page — `chrome-extension://<id>/connect.html?mcpRelayUrl=ws://[::1]:<port>/extension/<uuid>&token=<token>` — inside a browser, and the extension there dials back to that WebSocket. It proceeds without prompting only when the token in that URL matches the one that browser's extension holds.

So:

- `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in `env` says *which extension will accept the connection*. It is per browser profile, taken from that profile's status page.
- **`--browser` says which browser the relay page is opened in**, and without it the server uses the machine's default browser. Two servers with two correct tokens still both open their relay in the default browser, so the one whose token belongs to the *other* browser waits forever — starting cleanly, listening on its port, answering `initialize`, and never answering a tool call. Measured on this exact setup: adding `--browser msedge` turned a 120-second timeout into an immediate connection, verified as `Edg/152` through `navigator.userAgentData`.

Both entries therefore name their browser explicitly:

```jsonc
"playwright":      { "args": ["...", "@playwright/mcp@latest", "--extension", "--browser", "chrome"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Chrome profile's token>" } },
"playwright-edge": { "args": ["...", "@playwright/mcp@latest", "--extension", "--browser", "msedge"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Edge profile's token>" } }
```

A skill still has no lever between calling a browser tool and being connected — the first call *is* the connection — so the gate can only **detect** which browser answered. Changing it is configuration plus a restart.

**A hang is a symptom with a specific meaning.** A server that answers `initialize` but never answers `browser_tabs` is not broken and not slow: its relay page went to a browser whose extension holds a different token. Check `--browser` before anything else, and read the intended browser's status page — `No clients are currently connected` there confirms it.

**`browser_tabs list` shows only the tabs the extension bridges, not everything open in that browser.** A lone `connect.html` is the normal steady state, and the user's own tabs not appearing says nothing about which browser this is. Identify it by user agent, never by what the tab list seems to contain. It is **per browser profile** and it exists to bypass the extension's connection dialog — with no token the extension asks for approval on every connect, which is the user's click to make, never one to automate.

Each profile shows its own token on the extension's status page, at `extension://mmlmfjhmonkocbjadbfplnigmagldckm/status.html` **opened in that browser**. The same page is the diagnostic: `No clients are currently connected` there means the running server is paired to some other browser, whatever the tab list of the attached one suggests. The page also carries a regenerate control, so a token can be rolled at any time — after which the config holding the old one is stale until updated.

So when the bridge is missing, or the target gate says the wrong browser answered:

1. **Ask which browser should be driven**, and have the user open that status page in it.
2. **Ask them for the token line it shows.** This is ordinary configuration, not a credential to protect from the conversation: it authorizes a *local* process to attach to a browser on the same machine, and anyone able to run that process can read the browser's session data directly anyway. Take it, do not paraphrase it, and do not print it back.
3. **Put it where it is read** — the `env` of the MCP server entry for that browser. A second browser is a second entry under its own name, so both stay available and the gate's step 1 becomes a real choice. Editing the agent's configuration is the user's call: offer to do it, or hand them the exact block to paste.
4. **Restart so the server picks it up**, then re-run the gate and confirm the browser and profile before any work starts. A token set but not restarted looks exactly like a token that did not work.

## The bridge's two constraints

1. **Tool calls time out at ~5 seconds.** Anything slower — a multi-step click sequence, a screenshot of a heavy page, a wait — must run inside ONE `browser_run_code_unsafe` call, which has its own longer budget. Do not chain five 4-second tool calls when one script does the job.
2. **Playwright's actionability wait never settles on heavy SPAs.** VK, X, Facebook and Instagram continuously animate, lazy-load and re-render. `browser_click` fails with `TimeoutError: waiting for element to be visible, enabled and stable` even when a DOM probe shows the element is visible, `pointer-events: auto`, hit-testable and with a rect that does not move across three consecutive frames. This is not a stale selector — re-deriving from a fresh snapshot returns the same element and fails the same way.

**Other runtimes** — the snippets are Playwright's JavaScript API because that is the handle the bridge passes into `browser_run_code_unsafe`; none of it is a language choice this skill makes. Driving Playwright from another binding, every call here exists under that binding's own naming (`page.set_input_files` in Python, `Page.SetInputFilesAsync` in .NET), and the function handed to `evaluate` stays browser JavaScript everywhere — the page runs that argument, not the driver.

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
4. **The accessibility ref: `browser_find` for the label, then click the returned `aria-ref`.** On Instagram this opened the create-post dialog first try after coordinate clicks, `getByText` force clicks and the documented icon-column coordinates had all failed silently. It is cheap (one find, one click) and it targets what the page actually exposes rather than where a rect happened to be. Try it early, not last.
5. **Element handle: `page.$(sel)` then `handle.click({timeout})`** — Playwright's own actionability applies, so it fails where rung 2 fails, but it succeeds on components that ignore synthetic mouse coordinates and only respond to a properly targeted event (Buy Me a Coffee's editor, HackerNoon's controls). Cheap to try after rung 2.
5. **Force click: `locator.click({ force: true })`** — skips actionability, still a trusted event. It reports success even when the app does nothing, so **treat "force ok" as an attempt, never as a result**: re-probe for the dialog or the editor before typing.
6. **`page.evaluate(el => el.click())` — untrusted, and more useful than its reputation.** Never for file inputs or anything gated on user activation, where Chrome ignores it. But frameworks that bind an ordinary click listener honour it perfectly, and it was the **only** thing that worked for three separate controls in one run: Ko-fi's Bootstrap "Create" dropdown, Ko-fi's `#postUpdateButton`, and Tumblr's "Post now" — each of which sat inert under coordinate, handle and force clicks. When a submit refuses every trusted form, try this before declaring the platform unreachable, then verify by read-back like any other publish.

**When the composer refuses to open, stop clicking and look for the platform's own intent route.** Several networks publish a URL that opens the composer prefilled, and it beats every rung above because there is nothing to click and the text arrives already counted:

- `https://bsky.app/intent/compose?text=<encoded>`
- `https://www.threads.com/intent/post?text=<encoded>`
- `dev.to/new`, `studio.buymeacoffee.com/posts/new`, `patreon.com/posts/new`, `tumblr.com/new/text`, `hashnode.com/draft/new` — direct composer routes rather than intents, but the same idea: skip the button.

Two more rules learned the hard way:

- **Typing that reports success can still land nowhere.** `el.focus()` returning `document.activeElement === el`, and a coordinate click on a visible textarea, both preceded fields that stayed empty (Minds, Buy Me a Coffee, Tumblr's tag field). Always read the value back after typing and compare it to the source — length, head and tail — before touching submit.
- **The composer may live in a child frame.** When the top-document selectors resolve to elements that cannot be typed into, loop `page.frames()`, find the frame whose document has both the title field and the editor, and drive that frame's handles. Buy Me a Coffee's studio does exactly this, and from the top document it looks like an ordinary page with dead fields.

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

5. **`browser_file_upload` is sandboxed to the session's allowed roots; `setInputFiles` inside a `run_code` script is not.** A campaign folder outside the working repository is the normal case — the posts live with the campaign, the agent runs in a code repo — and the dedicated upload tool refuses that path outright. Neither copy the picture into the repo to satisfy it (that is how a stray `image.jpg` ends up in `.playwright-mcp/`) nor read the refusal as the platform rejecting the file: drive the input from a `run_code` script with the original absolute path.

## An upload's absence must be proven, never assumed — and retries stack

**A missing `blob:` src is not evidence that the upload failed.** Truth Social's composer renders an attachment with no `blob:` URL anywhere, and clears `input.files` once the app has taken the file, so the two probes most people reach for — `[...document.querySelectorAll('img')].filter(x => /^blob:/.test(x.src))` and `input.files.length` — both read empty on a composer that is holding the picture perfectly well. A run that trusted them concluded "no image", retried the upload four times, and **published a post with four copies of the same picture** while reporting the post as text-only. Both halves of that were wrong, and the user had to delete the post.

So verify an attachment by a **positive signal the composer itself renders per attachment**, and count it:

- an alt/description control that exists once per attachment (Truth Social: `Add Description`; Mastodon: an `ALT` button and a `compose-form__upload__delete`; Bluesky: `Add alt text`),
- a remove/delete control per attachment,
- a gallery class that encodes the count (Mastodon: `media-gallery--layout-1` vs `--layout-2`),
- a thumbnail whose `src` may be `blob:`, `data:` **or already a CDN URL** — accept any of the three.

```js
// count attachments, don't ask whether one exists
const n = (composer.innerText.match(/Add Description/g) || []).length;   // per-platform token
if (n !== 1) throw new Error(`expected 1 attachment, found ${n}`);
```

Three rules follow, and they cost a public post each:

1. **Upload once.** Never retry `setInputFiles` because a probe came back empty — re-probe with a positive signal first. Every retry that "failed" may have silently added another copy.
2. **Count attachments immediately before submitting**, exactly as you compare the body text. A count that is not exactly what the post file declares is a stop, not a note.
3. **When the count is wrong, fix it in the composer** — Mastodon's `button.compose-form__upload__delete` and its equivalents — rather than publishing and repairing afterwards.

## An uploaded asset's URL comes from the uploader, never from the page

When a platform hands back a hosted URL for the file you just uploaded, take it from **the widget's own output** — the copyable field it renders, the `value` of the input it fills, or the network response. **Never scrape the page HTML for a CDN-looking pattern.** Editor pages are full of other people's images: article covers in a sidebar, feed thumbnails, house ads. A regex over the document returns whichever matched first, and that is not your file.

This shipped a wrong picture as both the cover and the in-body image of a published article, with the run reporting success, because `/https:\/\/dev-to-uploads\.s3\.amazonaws\.com\/uploads\/articles\/[\w.-]+/` matched a foreign 300×299 asset in the editor shell. The upload itself had worked; only the URL was wrong. Two properties of the real URL made it unmatchable by that pattern — a different S3 region host, and the file's original extension preserved (`.jpg`, not `.png`).

**Then prove the URL is yours.** Open it and compare the natural dimensions against the source file:

```js
// the page's own <img> is CORS-restricted; navigate to the URL instead —
// the browser titles the tab "<name> (WxH)", which is enough
```

A one-line dimension check separates your upload from every other asset on the page, and it is the only cheap proof that the file the post will show is the file you sent.

## A submit that does nothing is usually refusing — read the screen

Before treating an unresponsive submit as a UI-automation problem, check whether the form is rejecting it. Bastyon's Post button ignored a coordinate click, a JS `el.click()`, an inner-node click and an element-handle click across two sessions, and the run reported the platform unpublishable — inventing a theory about key-pair signing to explain it. A screenshot showed a red **"Please add Tags"** line beside the button: the post needed a category. Selecting one cleared it and the very next click published.

So after the first click that changes nothing:

1. Read the composer's own text for a validation message — search for `please`, `required`, `select`, `add`, `must`, and for elements coloured as errors (`[class*=error]`, `[class*=warn]`, red text).
2. **Take a screenshot.** A coloured one-line warning next to a button is trivial to see and easy to miss in a DOM text dump, especially when it sits in a sibling container your scoped query never reached.
3. Only then climb the click ladder.

The same applies to a disabled-looking control: check `disabled`, `aria-disabled` and whether a required field elsewhere in the form is empty, before concluding the button is unreachable.

## An SPA tab that has stopped hydrating never recovers — open a new one

Bastyon rendered its app shell (46 KB of HTML, all the container divs) with `document.body.innerText.length === 0` on every route, through reloads, cache-bypassing reloads and 20-second waits. Both `/index` and the profile route were dead in that tab, while the same browser rendered the site normally for the user. **Opening a new tab booted the app immediately**, draft intact.

When a client-rendered site returns an empty body on a route that worked earlier in the run, do not keep reloading: open a fresh tab. And note where a platform keeps its draft — Bastyon's composer draft lives on the profile route (`/<handle>?read=1`), not the feed, so a run that only ever looked at the feed can miss a draft that is sitting there waiting for one click.

## A control outside the viewport is not clickable

`getBoundingClientRect()` happily returns coordinates for an element that is scrolled off screen, and `page.mouse.click` at those coordinates hits whatever is actually painted there. Three submits in one run were lost this way: Truth Social's **Truth** button sits at `y≈1177` in a 1068 px viewport and the click landed on the attachment image; Lemmy's community picker sits at `y≈1187`; wonderful.dev's **Post** button moves from `y≈154` to `y≈1045` the moment an image is attached.

Before every click on a submit or a picker:

```js
const r = el.getBoundingClientRect();
if (r.y < 60 || r.y + r.height > innerHeight) { await page.mouse.wheel(0, r.y - 400); await page.waitForTimeout(1200); }
// re-read the rect AFTER scrolling, then hit-test
const top = document.elementFromPoint(cx, cy);
const ok = el.contains(top) || el === top;
```

Widening the window does not always help: HackerNoon's story-settings sidebar (the *original / category* gates) sits at `x≈2624` and moves further right as the viewport grows, because the layout scales with it. A control that no viewport size can reach is the one legitimate case for `el.click()` from `page.evaluate` — that is what cleared both HackerNoon gates.

## Enumerate the controls; do not guess their labels

Twice in one run a control that existed was reported as missing because the probe filtered `document.querySelectorAll('button')` through a guessed regex: LinkedIn's `button[aria-label="Add media"]` and wonderful.dev's `input[type=file][accept="image/jpeg,image/png,image/gif"]`. Both were plainly there. The conclusions written from those probes ("the sharebox has no media control", "the composer exposes no file input") were false, and both posts shipped without their picture.

When something appears to be absent, **dump every candidate once** — tag, `aria-label`, `title`, `innerText`, `type`, rect — and read the list, rather than narrowing by a term you expect to find. Include `div[role="button"]`, `label` and `a`: LinkedIn's "Start a post" is a `DIV`, so a `button`-only sweep finds nothing and the feed composer looks broken when it was simply never clicked.

## Composer state can gate its own controls

LinkedIn's sharebox shows **Add media** on an empty composer and removes it once the editor holds text, so the natural order — write, then attach — makes the attach control disappear and the post go out bare. Where a composer offers media, **attach first and type second**, then re-verify the text and the attachment count before submitting.

## Typing

- **Target every field by its own identity — never "the first visible text input".** Composer dialogs carry neighbours that accept text just as happily: Instagram's alt-text accordion sits beside `aria-label="Add location"` and `aria-label="Add collaborators"`, and falling back to the first text input typed a whole alt description into the location field. Match on `id`, `placeholder`, `aria-label` or `data-placeholder`; when none of them identifies the field, stop and report rather than guessing, and if text has already gone somewhere wrong, clear it and re-read the field before submitting.
- **When typing lands nowhere, use `page.keyboard.insertText(text)`.** It delivers the whole string as one input event and filled editors that swallowed everything else: LinkedIn's Quill, Ko-fi's textarea, Tumblr's block editor, Truth Social's composer. Two caveats. It **replaces the current selection**, which is the cleanest way to clear a field that resists `Ctrl+A`+Backspace — `t.focus(); t.setSelectionRange(0, t.value.length)` in-page, then insertText. And it **inserts as a single block**: rich editors collapse the blank lines, so a body typed this way comes out as one paragraph with sentences running together. Where paragraph breaks matter, insert per paragraph with an explicit `Enter` between, or record the post `degraded`.
- Click into the field with a real mouse click first, then `page.keyboard.type(text, { delay: 7-12 })`. Cheap, human-paced, and one script call for a whole post.
- `fill()` **replaces** the whole value. Fine for a single shot into an empty contenteditable (it worked on VK, producing correct `<br><br>` paragraph breaks); never use it to append — the second call wipes the first.
- Blank line between paragraphs = two `Enter` presses. Then verify: `innerText` may show `\n\n\n` for one visual blank line depending on the editor's block model. Compare against the source file's *meaning*, not its exact whitespace.
- Always read back the field length and compare to the source before submitting.

## Formatting a rich editor: only a real caret counts, and never touch its DOM

Applying a format (a heading, a link) to text that is already in a rich editor has exactly one reliable shape, and two tempting shortcuts that both fail silently.

**What works** — put a real caret in the block with a real mouse click, select with the keyboard, verify the selection, then send the shortcut:

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

**Shortcut 1, which does nothing:** building the selection with `range.selectNodeContents(p)` + `selection.addRange(range)` and then pressing the shortcut. The DOM selection exists, `window.getSelection()` reports the right text — and the editor ignores it, because its own model never saw a caret. Seven Medium headings failed this way and shipped as plain paragraphs. Mouse *drag* selection and triple-click fare no better: CDP-synthesised mouse events reach the element (`elementFromPoint` confirms it) and focus the editor, yet produce no native selection at all.

**Shortcut 2, which is worse because it looks like it worked:** `document.execCommand('formatBlock', false, 'h3')`. It returns `true`, the paragraph visibly becomes a heading, and every DOM assertion passes. But the editor's document model never registered the change, so the autosave stores nothing — reload the page and all of it is gone. **Never mutate a rich editor's DOM directly**; if a change did not travel through the editor's own event pipeline, it does not exist. Verify formatting by reloading the editor, not by reading the DOM you just changed.

Finally, **the editor's tag names are not the published ones**: Medium's editor writes `h3` for the title and `h4` for section headings, which render as `h1` and `h3` on the published page. Assert heading structure on the published article, never in the editor.

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
