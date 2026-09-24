# Post formatting — getting the source's markdown into a composer that is not markdown

The post files are markdown. Almost no social composer is. Every defect in this file shipped to a live account because a run typed the source verbatim and checked only that the *characters* arrived.

Read this before the first composer of a run, alongside `browser-interaction.md`. The pre-submit checks it ends with are not optional extras: they are the difference between a post and a post with ` ```text ` printed in it.

## Classify the platform before you type

Three classes, and the class decides what reaches the editor:

| Class | Platforms observed | What goes in |
| --- | --- | --- |
| Plain text | linkedin, facebook-wall, threads, instagram, pixelfed, x, mastodon, bluesky, truthsocial, peerlist, minds, bastyon, pinterest, tumblr, quora | markdown stripped: fences and inline backticks removed, `#` heading markers removed, `**bold**` unwrapped, `[t](u)` flattened |
| Markdown-native | devto, hashnode (via paste), lemmy | the source verbatim |
| Rich editor | medium, substack, buymeacoffee, daily-dev, ko-fi | markdown converted to HTML and delivered as a paste event |
| Toolbar-only | patreon | plain text, then each heading and emphasis applied by selecting the range and picking the style from the floating toolbar |

A toolbar-only editor is the one class where the formatting is a second pass, not part of the fill. Patreon renders no markdown and sanitises an HTML paste away, so the body goes in as plain text and every `##` and `**…**` is then converted by hand: `Range` over the block's text node → the floating toolbar mounts above the selection → `button[aria-label="Text size"]` → `Heading 2`, or `button[aria-label="Bold"]` → then delete the marker characters, which the style does not consume. Budget for it: the pass is one round trip per heading, and skipping it publishes the markers as literal text.

The class is a hypothesis until the live page proves it. `wonderful-dev` renders code fences, inline code and headings but not links, so it belongs to no class cleanly — and a run that assumed "markdown platform" shipped `[eli5](https://…)` as literal text. Before deciding, open one existing post on that platform and look at what its markup actually became.

## Stripping for plain-text composers

Remove, in this order: fence lines (` ``` ` and ` ```lang `, keeping the code lines), inline backticks, `> ` quote markers, `**` and `*` emphasis, a line holding only `***` or `---`, and flatten `[text](url)` to `text (url)`. Then collapse three or more consecutive newlines to two.

A heading is not stripped to bare words, because a plain line of text between paragraphs reads as a stray sentence and the section break disappears. Replace each heading's `#` markers with one emoji that fits the heading's words, followed by a space and the heading text: a section about cost takes one from the money group, a section about a failure one from the tools or warning groups, a list of findings a pin or a magnifier. Take them from the rendering-safe palette and gate in `awesome-content-repurpose/references/authored-style.md` (section 8), use a different emoji for each heading of one post, and fall back to `📌` where nothing fits. Keep one blank line above and below the heading line, as the source had.

Two traps in the stripping itself:

- A line starting with `#` is only a heading when a space follows the hashes. `#claudecode #ai #learning` is a hashtag line and must survive untouched. A converter that treats every `#` line as a heading (or, worse, whose paragraph loop skips `#` lines without advancing) either eats the tags or spins forever — the second one hung a run until it was killed.
- A trailing hashtag line is a heading on markdown platforms. On `devto` it renders as an `<h1>`; move it into the front-matter `tags:` field instead, which is that platform's own mechanism. On `hashnode` and `lemmy` a `#word` with no space is safe as body text.

## HTML paste is the reliable route into TipTap and ProseMirror

Medium, Substack, Buy Me a Coffee and daily.dev all run ProseMirror-family editors, and all four accept a synthetic paste carrying `text/html`:

```js
await page.evaluate((h) => {
  const el = document.querySelector('.tiptap.ProseMirror');   // Medium: div.postArticle-content [contenteditable]
  el.focus();
  const dt = new DataTransfer();
  dt.setData('text/html', h);
  dt.setData('text/plain', h.replace(/<[^>]+>/g, ''));
  el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, HTML);
```

Verified end to end: headings became real `h3`/`h4`, fences became `pre`, `> ` became `blockquote`, `**bold**` became `strong`, and `[t](u)` became a working `a[href]`. Hashnode takes the markdown itself through the same paste event — its editor carries a markdown paste handler — so send the source there rather than HTML.

This is also what avoids the TipTap input-rule dance: typing `## ` keystroke by keystroke to make a heading works, but it is slow, order-dependent, and every code fence needs an escape from the block it just created.

Not every rich editor accepts that paste, and the failure is silent. Ko-fi's Froala sanitises the pasted HTML down to plain paragraphs — headings, `pre` blocks and both anchors gone, the links left as dead text — while reporting a perfectly normal length. Where an editor exposes its own API, use it instead: `window.FroalaEditor.INSTANCES[0].html.set(html)` followed by `undo.saveStep()` and `events.trigger('contentChanged')` kept every element, and it registers in the editor's model because it travels through the editor's own pipeline (unlike a raw DOM write, which does not). Verify the paste by counting elements, never by length: `h1..h4`, `pre`, `a[href]` and `ul` against what the HTML contained.

Hashnode's handler takes markdown, not HTML, and does not autolink a bare URL. `[text](url)` becomes an anchor; `https://…` alone on a line stays text. Wrap bare URLs as `[url](url)` in the markdown before pasting — one extra regex, and it removes the whole link-control dance on that platform.

## Bare URLs do not become links on their own

Assume nothing autolinks. The failure is silent and it always eats the one thing the post exists for.

- In an HTML paste, emit the anchor yourself — convert every bare `https://…` in the source to `<a href="…">…</a>` during the conversion, not afterwards.
- In a plain-text composer, the platform's own linkifier decides. Where it exists, it fires on *typed* input, not on `insertText`: peerlist linkified the closing URL only when it was typed with real keystrokes and followed by a space, and produced dead text every other way.
- Where an editor has a link control, use it on a selection: Tumblr (`Control+k`), Substack (toolbar `title="Link"`), Buy Me a Coffee (`button.option-button` index 3). Select the URL with a Range over its text node — `Home`/`Shift+End` grabs only the visual line and a wrapped URL loses its head.
- Backticks inside a link label break the parser. ``[`eli5`](https://…)`` published as literal text on wonderful.dev while plain `[eli5](https://…)` rendered as an anchor on the same platform. Strip inline code from link labels for every target.

## Paragraph shape survives or it does not

- `insertText` of a multi-paragraph string collapses it into one block in block editors. Insert paragraph by paragraph with an explicit `Enter` between them.
- Newlines *inside* one inserted paragraph are dropped. A Tumblr "Examples:" block of five `/eli5 …` lines published as one run-on line. Where a source paragraph contains single newlines, insert them as explicit `Shift+Enter` breaks and count the `br` elements afterwards.
- Never press `Escape` between paragraph inserts. It was added to dismiss a slash-command menu and instead scrambled the block order — the last paragraph ended up first. Nothing needs dismissing: `insertText` does not open Tumblr's slash menu.
- Runs of very short paragraphs publish as a stretched wall in rich editors. A rhythmic `Browser.` / `Resolver.` / `Root.` sequence gets a full paragraph gap under each line on Medium and reads as broken. Fuse a run of three or more consecutive one-line paragraphs of ≤32 characters into one block joined by hard breaks. The threshold matters: at 35 it swallows real prose sentences, at 30 it misses `No assumed background knowledge.`

## The pre-submit format gate

Run all of it, in the composer, before the submit click. Every item is here because skipping it shipped a defect:

1. Zero literal markdown where the platform renders it: no ` ``` `, no `^#{1,6} `, no `](http`, no stray backticks.
2. Every URL in the source is an `a[href]` in the composer — or the platform is one whose linkifier is proven to fire server-side, and you say so in the ledger.
3. Paragraph count and order match the source, and the first and last block are the source's first and last.
4. Character-for-character diff of every block against the source. Rich editors *move characters*: Patreon produced `very little tex` and `/eli5 Fourier trans` with the missing `t` and `forms` appended to the closing URL as `eli5formst`; Ko-fi's Froala did the same to four blocks at once. Compare per block, not by total length — the totals matched in both cases.
5. Attachment count equals what the post file declares.
6. No `�` anywhere.
7. Every backticked span in the source is a code element (or, on Patreon, a Quote block; on Tumblr, a Chat block) in the composer, and none of those spans contains an `a[href]`. Stripping the backticks for a plain-text class is right for `x`, `mastodon` or `bluesky`, where nothing renders; it is wrong for a rich editor, where the bare command gets autolinked from the `https://` inside it — Patreon and Tumblr both shipped `pip install -e 'git+https://…[fetch]'` with a dead anchor and the closing quote inside it. Count code spans against the source the way attachments are counted.
8. Every dotted token the source writes as a word — `CLAUDE.md`, `AGENTS.md`, `culture.md`, anything shaped like `name.tld` — is still that word in the composer. Some platforms autolink it as a hostname AND rewrite what the reader sees: Bastyon published `culture.md` as `http://culture.md`, a live anchor to a host that does not exist, in a sentence the author never wrote. Wrap those tokens in code spans in the post file before the run reaches any composer (item 7 then carries them through the rich editors, and the plain-text strip leaves the word bare and safe), and search the filled composer for `http://` or `https://` prefixes the source does not contain.

A failure here is a fix in the composer, never a publish followed by a repair.

## When the post file has no title and the platform demands one

Patreon disables Publish without a title; Ko-fi's blog, Hashnode, Medium and Substack all need one.

A form file always carries its own `title` in frontmatter, and that is the title. For any other file, take it from a sibling post file in the same folder. A campaign folder written for many platforms always contains long-form units that carry an H1 — `devto`, `hashnode`, `medium` and `substack` posts open with one — and any of those titles is the campaign's own words for this piece. Read the siblings, pick the one whose length and register fit the target, and record in the ledger which file it came from.

Only when no sibling in the folder carries a title does the first sentence of the post's own body become the fallback, and that is worth naming in the report. Inventing a title is not an option at any point.

## Where the platform decides the shape, say so instead of fighting it

Three platforms in one run turned a piece of the source into something of their own, and each is correct behaviour to record rather than a defect to repair:

- Tumblr turns a bare URL on its own line into a link card — the repo's title, description and a real anchor — and swallows the paragraph typed immediately after it. Keep the card; re-insert the lost paragraph.
- Bluesky replaces its auto-generated link preview with the image when one is attached. The URL survives as a facet, so it is still a real link; only the card is gone.
- Peerlist refuses hashtags outright and says so in the composer. A trailing hashtag line belongs elsewhere on that platform, not in the body.

The rule underneath: when a platform transforms the source, check that nothing was lost (a paragraph, the link, the tail) and record what it did. Restoring the author's exact bytes against the platform's own rendering is not the goal.

## Try the HTML paste on every rich editor, including the ones this skill says cannot take one

A run that ended with forty-odd published posts used the same first move everywhere and it worked on every rich editor it met: focus the body node, dispatch a `paste` `ClipboardEvent` carrying `text/html`, read the result. That includes editors whose own notes here said otherwise — Patreon's Remirror, documented as having "no HTML paste that survives", converted a whole campaign unit in one call with headings, lists, bold and anchors intact. Classify by measuring, not by reputation: paste, then count `h1..h4`, `pre`, `li`, `a[href]`, `pre a` and the joined text against the source. Only where that count shows real loss does the per-construct toolbar walk earn its cost, and the note for that platform should record which of the two ran.

What the paste loses is narrower and more predictable than "the editor cannot take HTML":

- **No `codeBlock` in the schema** — every `<pre>` flattens to a paragraph *and its newlines become single spaces*, so a four-line command publishes as one run-on line. Seen on DeviantArt, Patreon and ko-fi.
- **Whitespace runs collapse** wherever the container is not `pre`, taking column alignment and YAML indentation with them.
- **Markdown-ish paste rules fire on the flattened text.** A `~ … ~` pair became strikethrough on Remirror; the same class of rule is what autolinks a URL that used to be inside a fence.

One recipe answers all three, and it is worth reaching for before any toolbar: emit **one `<p>` per source line** instead of one `<pre>` per block, and convert every run of two or more spaces to that many non-breaking spaces (U+00A0). Line breaks survive because each line is its own block; alignment and indentation survive because the spaces are no longer collapsible; and the tilde pair is split across two blocks where no rule can match it. Where the schema has a `blockquote` — most do — wrap each run of those paragraphs in one and the commands read as commands rather than as body prose. On ko-fi, which strips `<br>` inside a `<pre>` server-side, `<blockquote><p><code>…</code></p>…</blockquote>` published exactly right after the same post had already shipped with run-on commands.

Then check what the paste autolinked. With the code container gone, the editor's Link extension sees plain URLs inside commands and marks them: on a ProseMirror-based editor whose instance is reachable (DeviantArt exposes it as `editorNode.editor`), walk `state.doc.descendants`, collect the text nodes whose `link` mark href is not one of the post's real reference links, and `removeMark` them in one transaction. Where no instance is exposed, the gate is the anchor list itself — it must hold the reference URLs and nothing from a command — and an unreachable link popover is a `degraded` line, not a reason to spend the draft.

## Section separators travel or they are dropped, never typed

A post file may carry `---` on its own line as a section separator. It is markup, not text, and it needs the same treatment as a heading:

- On a **markdown-native** surface it goes through as written and renders as a rule.
- On a **rich editor** it is converted with the rest of the body: `<hr>` inside the HTML paste where the schema has a `horizontalRule` node (Substack, DeviantArt, HackerNoon, Medium and Teletype all do), or the editor's own divider control where the paste drops it — HackerNoon's toolbar `Divider` (`ctrl _`), Teletype's block-menu `Divider`, Medium's `---` typed on an empty line, which converts as the third dash lands.
- On a **plain-text** surface, and on a rich editor whose schema has no rule node, the separator is **removed**. Three dashes in a composer that renders nothing are three dashes the reader sees. Tumblr's block menu and Quora's formatting menu both lack one; check the platform's own note before assuming.

The pre-submit gate counts rules in the composer against separators in the source, the same way it counts code spans: equal on a platform that supports them, zero on a platform that does not, and never a literal `---` in the published text.
