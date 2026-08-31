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

## Typing

- **Target every field by its own identity — never "the first visible text input".** Composer dialogs carry neighbours that accept text just as happily: Instagram's alt-text accordion sits beside `aria-label="Add location"` and `aria-label="Add collaborators"`, and falling back to the first text input typed a whole alt description into the location field. Match on `id`, `placeholder`, `aria-label` or `data-placeholder`; when none of them identifies the field, stop and report rather than guessing, and if text has already gone somewhere wrong, clear it and re-read the field before submitting.
- **When typing lands nowhere, use `page.keyboard.insertText(text)`.** It delivers the whole string as one input event and filled editors that swallowed everything else: LinkedIn's Quill, Ko-fi's textarea, Tumblr's block editor, Truth Social's composer. Two caveats. It **replaces the current selection**, which is the cleanest way to clear a field that resists `Ctrl+A`+Backspace — `t.focus(); t.setSelectionRange(0, t.value.length)` in-page, then insertText. And it **inserts as a single block**: rich editors collapse the blank lines, so a body typed this way comes out as one paragraph with sentences running together. Where paragraph breaks matter, insert per paragraph with an explicit `Enter` between, or record the post `degraded`.
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
