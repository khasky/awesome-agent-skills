# Platform specs — the file set, the caps, the depth each platform expects

The output contract and the two numbers every platform version is checked against: the ceiling it must not cross, and the depth band it must reach. Structural culture per platform lives in `awesome-content-campaign`'s `references/platforms.md` and its genre files; this file carries what is countable.

## The canonical platform set

One run produces exactly these 26 platforms, one file each, nothing else. No README and no notes file.

```text
linkedin        bluesky         bastyon
facebook-wall   wonderful-dev   devto
threads         truthsocial     hashnode
instagram       peerlist        hackernoon
pinterest       minds           medium
x               patreon         daily-dev
tumblr          ko-fi           lemmy
mastodon        buymeacoffee    substack
nostr           reddit
```

Filenames follow the publisher's contract, which is Phase 6's business and is stated there: a dated prefix, the publication timezone, the title slug, and the platform slug verbatim from the table in `awesome-content-campaign`'s `references/platforms.md`. A sequence number is never part of a filename — the date carries the ordering, and a numbered set cannot be merged with a second run or rescheduled without renaming every file in it.

Where the user asks for a subset, the rest are simply absent; nothing is renumbered or renamed to close the gap.

## Hard caps

These are ceilings, not targets, and they are enforced before a post is written rather than after. A cap verified live in Phase 3 may only lower a number here, never raise it.

| Platform | Cap | Enforced by |
| --- | --- | --- |
| `x` | 280 | the composer |
| `bluesky` | 300 | the composer |
| `threads` | 500 | the composer |
| `mastodon` | 500 | the composer, per instance |
| `peerlist` | 480 | nothing visible — it truncates silently |
| `wonderful-dev` | 2000 | the server, as `too_big, maximum 2000` |

The whole file counts, including URLs, hashtags and emoji. Count the way the platform counts: a URL costs a fixed 23 characters on `x`, emoji cost two.

Write to roughly 95% of the cap, never to the edge. Two of these punish the edge without saying so: `peerlist` accepts an over-length body and publishes it truncated, with no counter and no error anywhere in the composer, and `wonderful-dev` refuses a long post with a console error the composer never surfaces.

A unit that will not fit is not a cap problem, it is a writing problem, and it is solved before the file exists. Writing one long version and trimming it at publication time is what produces the worst defects: a 1546-character body cut to 477 loses the pricing, the list and the closing lines, and the trims that follow drop a link here and a number there until each short platform carries a different post. Compose each platform version to its own band from the start, so nothing has to be amputated later.

## Depth bands

The band each platform's version is written to. Write inside the range and aim near its middle unless the source genuinely carries less; a post outside its band is rewritten, not padded or trimmed.

| Platform | Band | Aim | Notes |
| --- | --- | --- | --- |
| `linkedin` | 1200–2400 | 1862 | Authored professional commentary. Hook, mechanism, caveat, takeaway. |
| `facebook-wall` | 900–1500 | 1205 | Broader and plainer than LinkedIn. Explain the jargon. |
| `threads` | 350–475 | 388 | One strong idea, compact structure, a URL, one topic tag. |
| `instagram` | 900–1600 | 1275 | Whitespace, a simple arrow diagram where it helps. Body links are dead here. |
| `pinterest` | 200–400 | 320 | A saveable reference summary: title, three to five facts, URL. |
| `x` | 230–270 | 260 | Sharpest fact or mechanism, URL, one or two hashtags. Cut adjectives before cutting facts. |
| `tumblr` | 1200–2600 | 1884 | Exploratory mini-essay. The place for technical intuition and history. |
| `mastodon` | 400–475 | 440 | Technical and sober. Hashtags are the only discovery mechanism. |
| `bluesky` | 250–290 | 286 | Compact and conversational, at most one hashtag. |
| `nostr` | 250–400 | 320 | Short post, technical audience, no marketing cadence. Caps and media handling vary by client: verify on the one the user named. |
| `wonderful-dev` | 1400–1900 | 1700 | Developer-first article: architecture, usage, limitations, install. The 2000-character server cap binds, so this is the one long-form platform written short. |
| `truthsocial` | 350–500 | 472 | Direct and concise. |
| `peerlist` | 380–460 | 429 | Developer audience, no fluff: what it is, the concrete result, why it matters, link. No hashtags, the composer refuses them. |
| `minds` | 700–1400 | 967 | Mid-length explanatory. |
| `patreon` | 1500–3000 | 2294 | Member-style write-up: angle, explanation, caveat, examples. |
| `ko-fi` | 1500–3500 | 2412 | Substantive mini-blog, never a status update. |
| `buymeacoffee` | 1500–5000 | 3277 | The deeper of the two mini-blogs. Good place for a mental model. |
| `bastyon` | 450–950 | 601 | A Shares post, never a long read. |
| `devto` | 3000–6000 | 4720 | Developer article with headings and code. |
| `hashnode` | 2200–5000 | 3492 | Technical article, implementation detail welcome, not a copy of dev.to. |
| `hackernoon` | 4500–7000 | 5300 | Long-form article behind editorial review, so submission is not publication. Tags go in the platform's own field. |
| `medium` | 4500–8000 | 6331 | The deepest general-audience essay. No hashtag footer. |
| `daily-dev` | 1100–2400 | 1706 | Developer-oriented, tradeoffs and workflow. No forced hashtag footer. |
| `lemmy` | 800–1600 | 1030 | Community register, ends on a real question. |
| `substack` | 4000–8000 | 5907 | Newsletter essay with a thesis line. No hashtag footer. |
| `reddit` | 1100–2200 | 1515 | Least promotional variant, no hashtags, ends on a genuine question. |

Depth comes from mechanism, examples, caveats and implications. Padding to reach a band is the same defect as undershooting it: a `buymeacoffee` post of 400 characters and one of 5000 characters of filler both fail.

### The two mini-blogs are not status updates

`ko-fi` and `buymeacoffee` are the two platforms this skill most often gets wrong, because their composers look like feed boxes and their surfaces are blogs. Posts there run two to four thousand characters, and a short one does not read as concise, it reads as abandoned next to its neighbours. Both take the full structure: headline, why it matters, the mechanism, the caveat, what to do with it, the link.

One mechanical consequence: a `ko-fi` post over 800 characters cannot go through the feed composer at all, because that textarea carries a hard `maxlength` of 800. It belongs in Ko-fi's Blog editor, and writing it to this band is what makes the publisher pick the right composer.

### Bastyon takes a Shares post

Bastyon's short composer is the target: the `What's new?` field, its own image dropzone, and the Post control. The band above is what fits that surface and what the platform's feed is made of. Bastyon also carries a separate long-read editor for articles, and a campaign unit put through it publishes as a collapsed article card, which is a different object with different reach. Where the body will not fit the Shares band, shorten the body; never switch editors.

## Hashtags

The count per platform comes from the hashtag table in `awesome-content-campaign`'s `references/platforms.md`, which is the single source. Three rules bind here:

- `peerlist` carries none. The composer states it in words, and a tag line spends the 480-character budget on text that has to be deleted before submitting.
- `medium`, `substack`, `hackernoon` and `reddit` carry no hashtag footer. The first three take topics in their own field; Reddit has no tag system at all and a tag block marks the post as imported spam.
- `nostr` tag culture varies by client and follow graph, so the count is verified live rather than assumed.
- `daily-dev` is never given a forced footer.

## Code and commands

An install command or a snippet goes in a fenced block with its language on the long-form platforms, and as inline code on the short ones where a fence would eat the budget or fail to render. Never invent a command: it is taken from the source, verified against the official quick start, and published in the form the project itself documents.

## Links

One or two relevant official links per post, embedded in the sentence that points at them. Markdown links on the long-form platforms; bare URLs on the plain-text feeds. Never a link dump under a `Repos:` heading.

Two platforms linkify less than they look like they do, so the post is written to survive it: `wonderful-dev` auto-links only a bare domain token, and `patreon` auto-links nothing. On both, the closing sentence still reads correctly when its URL is plain text, and making it a real anchor is the publisher's job.

## Typography

ASCII punctuation throughout: `'` for apostrophes, `"` for quotes, `-` in place of any dash, `->` in place of a decorative arrow. Zero em dashes anywhere, including titles, hashtag lines and alt text. Emoji are allowed, under the budget and placement rules in Phase 4 of `SKILL.md`; the character `#show` never appears, and no internal label (`Title:`, `Description:`, `Character count:`) survives into a file.

## The validation pass

Runnable, and run before the run reports anything. It checks the contract, not the writing; the writing checks are in Phase 5.

```python
import re, pathlib

CAPS = {"x": 280, "bluesky": 300, "threads": 500,
        "mastodon": 500, "peerlist": 480, "wonderful-dev": 2000}
BANDS = {"ko-fi": (1500, 3500), "buymeacoffee": (1500, 5000),
         "bastyon": (450, 950), "devto": (3000, 6000),
         "medium": (4500, 8000), "substack": (4000, 8000),
         "hackernoon": (4500, 7000), "nostr": (250, 400)}
PLATFORMS = set(CAPS) | set(BANDS) | {
    "linkedin", "facebook-wall", "instagram", "pinterest", "tumblr",
    "truthsocial", "nostr", "minds", "patreon", "hashnode", "hackernoon",
    "daily-dev", "lemmy", "reddit"}

files = sorted(pathlib.Path(out).glob("*.md"))
assert len(files) == 26, len(files)
assert not (pathlib.Path(out) / "README.md").exists()
seen = set()

for p in files:
    fields = p.stem.split("_")
    assert len(fields) == 5, p.name           # date_time_tz_title_platform
    slug = fields[4]
    assert slug in PLATFORMS, slug
    assert slug not in seen, ("duplicate platform", slug)
    seen.add(slug)

    t = p.read_text(encoding="utf-8").strip()
    n = len(t)
    assert "#show" not in t
    assert not re.search(r"[—–―‘’“”→]", t), slug
    if slug in CAPS:
        assert n <= CAPS[slug] * 0.98, (slug, n, CAPS[slug])
    if slug in BANDS:
        lo, hi = BANDS[slug]
        assert lo <= n <= hi, (slug, n, lo, hi)

    blocks = re.split(r"\n\s*\n", t)
    paras = [x.strip() for x in blocks if x.strip()
             and not x.strip().startswith(("#", "-", "*", ">", "|", "`", "!["))]
    oneline = [x for x in paras if "\n" not in x and len(x) <= 70]
    run = best = 0
    for x in paras:
        run = run + 1 if x in oneline else 0
        best = max(best, run)
    assert best <= 2, (slug, "one-line paragraph run", best)
    if n > 1500 and paras:
        assert len(oneline) / len(paras) < 0.45, (slug, "one-line share", len(oneline), len(paras))

assert seen == PLATFORMS, PLATFORMS - seen
```

A failing assertion is a rewrite of that post, never a trim to satisfy the number.
