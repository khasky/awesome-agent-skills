# Post formatting — getting the source's markdown into a composer that is not markdown

The post files are markdown. Almost no social composer is. Every defect in this file shipped to a live account because a run typed the source verbatim and checked only that the *characters* arrived.

**Read this before the first composer of a run, alongside `browser-interaction.md`.** The pre-submit checks it ends with are not optional extras: they are the difference between a post and a post with ` ```text ` printed in it.

## Classify the platform before you type

Three classes, and the class decides what reaches the editor:

| Class | Platforms observed | What goes in |
| --- | --- | --- |
| **Plain text** | linkedin, facebook-wall, threads, instagram, x, mastodon, bluesky, truthsocial, peerlist, minds, bastyon, pinterest, tumblr | markdown **stripped**: fences and inline backticks removed, `#` heading markers removed, `**bold**` unwrapped, `[t](u)` flattened |
| **Markdown-native** | devto, hashnode (via paste), lemmy | the source **verbatim** |
| **Rich editor** | medium, substack, buymeacoffee, daily-dev, ko-fi, patreon | markdown converted to **HTML** and delivered as a paste event |

**The class is a hypothesis until the live page proves it.** `wonderful-dev` renders code fences, inline code and headings but **not links**, so it belongs to no class cleanly — and a run that assumed "markdown platform" shipped `[eli5](https://…)` as literal text. Before deciding, open one existing post on that platform and look at what its markup actually became.

## Stripping for plain-text composers

Remove, in this order: fence lines (` ``` ` and ` ```lang `, keeping the code lines), inline backticks, leading `#` heading markers, `> ` quote markers, `**` and `*` emphasis, and flatten `[text](url)` to `text (url)`. Then collapse three or more consecutive newlines to two.

Two traps in the stripping itself:

- **A line starting with `#` is only a heading when a space follows the hashes.** `#claudecode #ai #learning` is a hashtag line and must survive untouched. A converter that treats every `#` line as a heading (or, worse, whose paragraph loop skips `#` lines without advancing) either eats the tags or spins forever — the second one hung a run until it was killed.
- **A trailing hashtag line is a heading on markdown platforms.** On `devto` it renders as an `<h1>`; move it into the front-matter `tags:` field instead, which is that platform's own mechanism. On `hashnode` and `lemmy` a `#word` with no space is safe as body text.

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

Verified end to end: headings became real `h3`/`h4`, fences became `pre`, `> ` became `blockquote`, `**bold**` became `strong`, and `[t](u)` became a working `a[href]`. **Hashnode takes the markdown itself through the same paste event** — its editor carries a markdown paste handler — so send the source there rather than HTML.

This is also what avoids the TipTap input-rule dance: typing `## ` keystroke by keystroke to make a heading works, but it is slow, order-dependent, and every code fence needs an escape from the block it just created.

## Bare URLs do not become links on their own

**Assume nothing autolinks.** The failure is silent and it always eats the one thing the post exists for.

- **In an HTML paste**, emit the anchor yourself — convert every bare `https://…` in the source to `<a href="…">…</a>` during the conversion, not afterwards.
- **In a plain-text composer**, the platform's own linkifier decides. Where it exists, it fires on *typed* input, not on `insertText`: peerlist linkified the closing URL only when it was typed with real keystrokes **and followed by a space**, and produced dead text every other way.
- **Where an editor has a link control, use it on a selection**: Tumblr (`Control+k`), Substack (toolbar `title="Link"`), Buy Me a Coffee (`button.option-button` index 3). Select the URL with a **Range over its text node** — `Home`/`Shift+End` grabs only the visual line and a wrapped URL loses its head.
- **Backticks inside a link label break the parser.** ``[`eli5`](https://…)`` published as literal text on wonderful.dev while plain `[eli5](https://…)` rendered as an anchor on the same platform. Strip inline code from link labels for every target.

## Paragraph shape survives or it does not

- **`insertText` of a multi-paragraph string collapses it into one block** in block editors. Insert paragraph by paragraph with an explicit `Enter` between them.
- **Newlines *inside* one inserted paragraph are dropped.** A Tumblr "Examples:" block of five `/eli5 …` lines published as one run-on line. Where a source paragraph contains single newlines, insert them as explicit `Shift+Enter` breaks and count the `br` elements afterwards.
- **Never press `Escape` between paragraph inserts.** It was added to dismiss a slash-command menu and instead scrambled the block order — the last paragraph ended up first. Nothing needs dismissing: `insertText` does not open Tumblr's slash menu.
- **Runs of very short paragraphs publish as a stretched wall in rich editors.** A rhythmic `Browser.` / `Resolver.` / `Root.` sequence gets a full paragraph gap under each line on Medium and reads as broken. Fuse a run of **three or more consecutive one-line paragraphs of ≤32 characters** into one block joined by hard breaks. The threshold matters: at 35 it swallows real prose sentences, at 30 it misses `No assumed background knowledge.`

## The pre-submit format gate

Run all of it, in the composer, before the submit click. Every item is here because skipping it shipped a defect:

1. **Zero literal markdown** where the platform renders it: no ` ``` `, no `^#{1,6} `, no `](http`, no stray backticks.
2. **Every URL in the source is an `a[href]`** in the composer — or the platform is one whose linkifier is proven to fire server-side, and you say so in the ledger.
3. **Paragraph count and order** match the source, and the first and last block are the source's first and last.
4. **Character-for-character diff of every block against the source.** Rich editors *move characters*: Patreon produced `very little tex` and `/eli5 Fourier trans` with the missing `t` and `forms` appended to the closing URL as `eli5formst`; Ko-fi's Froala did the same to four blocks at once. Compare per block, not by total length — the totals matched in both cases.
5. **Attachment count** equals what the post file declares.
6. **No `�`** anywhere.

A failure here is a fix in the composer, never a publish followed by a repair.

## When the post file has no title and the platform demands one

Patreon disables Publish without a title; Ko-fi's blog, Hashnode, Medium and Substack all need one.

**Take it from a sibling post file in the same folder.** A campaign folder written for many platforms always contains long-form units that carry an H1 — `devto`, `hashnode`, `medium` and `substack` posts open with one — and any of those titles is the campaign's own words for this piece. Read the siblings, pick the one whose length and register fit the target, and record in the ledger which file it came from.

Only when no sibling in the folder carries a title does the first sentence of the post's own body become the fallback, and that is worth naming in the report. Inventing a title is not an option at any point.
