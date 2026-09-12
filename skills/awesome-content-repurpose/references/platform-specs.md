# Platform specs — the file set, the caps, the depth each platform expects

The output contract and the two numbers every platform version is checked against: the ceiling it must not cross, and the depth band it must reach. Structural culture per platform lives in `awesome-content-campaign`'s `references/platforms.md` and its genre files; this file carries what is countable.

## The canonical platform set

One run produces exactly these 25 platforms, one file each, nothing else. No README and no notes file.

```text
linkedin        bluesky         bastyon
facebook-wall   wonderful-dev   devto
threads         truthsocial     hashnode
instagram       peerlist        hackernoon
pinterest       minds           medium
x               patreon         daily-dev
tumblr          ko-fi           lemmy
mastodon        buymeacoffee    substack
reddit
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

The whole file counts, including URLs, hashtags and emoji. Count the way the platform counts: a URL costs a fixed 23 characters on `x`, emoji cost two — which is also how the gate script counts, in UTF-16 units.

Write to roughly 95% of the cap, never to the edge. Two of these punish the edge without saying so: `peerlist` accepts an over-length body and publishes it truncated, with no counter and no error anywhere in the composer, and `wonderful-dev` refuses a long post with a console error the composer never surfaces.

A unit that will not fit is not a cap problem, it is a writing problem, and it is solved before the file exists. Writing one long version and trimming it at publication time is what produces the worst defects: a 1546-character body cut to 477 loses the pricing, the list and the closing lines, and the trims that follow drop a link here and a number there until each short platform carries a different post. Compose each platform version to its own band from the start, so nothing has to be amputated later.

## Depth bands

The band each platform's version is written to. Write inside the range and aim near its middle unless the source genuinely carries less; a post outside its band is rewritten, not padded or trimmed.

| Platform | Band | Aim | Notes |
| --- | --- | --- | --- |
| `linkedin` | 600–1200 | 930 | Authored professional commentary. Hook, mechanism, caveat, takeaway. |
| `facebook-wall` | 900–1500 | 1205 | Broader and plainer than LinkedIn. Explain the jargon. |
| `threads` | 350–475 | 388 | One strong idea, compact structure, a URL, one topic tag. |
| `instagram` | 500–720 | 620 | A caption read under the picture, nearer a status than an essay: the point, one mechanism or number, the caveat. Whitespace, and body links are dead here. |
| `pinterest` | 200–400 | 320 | A saveable reference summary: title, three to five facts, URL. |
| `x` | 230–270 | 260 | Sharpest fact or mechanism, URL, one or two hashtags. Cut adjectives before cutting facts. |
| `tumblr` | 1200–2600 | 1884 | Exploratory mini-essay. The place for technical intuition and history. |
| `mastodon` | 400–475 | 440 | Technical and sober. Hashtags are the only discovery mechanism. |
| `bluesky` | 250–290 | 286 | Compact and conversational, at most one hashtag. |
| `wonderful-dev` | 700–950 | 850 | Developer-first article: architecture, usage, limitations, install. Written well under the 2000-character server cap, which the composer never surfaces. |
| `truthsocial` | 350–500 | 472 | Direct and concise. |
| `peerlist` | 380–460 | 429 | Developer audience, no fluff: what it is, the concrete result, why it matters, link. No hashtags, the composer refuses them. |
| `minds` | 350–700 | 480 | Compact explanatory: one idea, its mechanism, the caveat. |
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

## The fold

A feed shows the start of a post and hides the rest behind a see-more control. What stands above that line is the only part most readers see, so the author and the subject are both there, and the hook is judged on that stretch alone.

| Platform | Fold | Measured by |
| --- | --- | --- |
| `linkedin` | about 140 characters on mobile, about 210 or three lines on desktop | third-party tools, 2026; verify live |
| `instagram` | about 125 characters | third-party tools, 2026; verify live |

A line break spends the fold faster than its one character suggests, because the cut counts lines as well as characters; the gate charges each break as a short line. `facebook-wall` folds too, at a length no source this skill trusts has measured, so the rule holds there by judgment rather than by count. The gate checks the two measured platforms: the first person (under a first-person voice) and at least one of the headline's words inside the first 140 or 125 characters, the smaller mobile number because that is where most of these feeds are read.

## Technical depth

How technical a version gets is a property of the platform's readers, and it is a separate axis from length: a long post can stay conceptual and a short one can carry a command. Four levels, each including the ones before it:

| Level | Carries | Platforms |
| --- | --- | --- |
| concept | the mechanism in words, no code | `pinterest`, `instagram`, `facebook-wall`, `truthsocial` |
| command | one inline command, flag, setting or identifier | `x`, `bluesky`, `threads`, `mastodon`, `peerlist`, `minds`, `bastyon`, `linkedin` |
| snippet | one short fenced block or configuration excerpt | `tumblr`, `lemmy`, `reddit`, `daily-dev`, `wonderful-dev`, `patreon`, `ko-fi`, `buymeacoffee` |
| code | full examples, several blocks, the setup around them | `devto`, `hashnode`, `hackernoon`, `medium`, `substack` |

The topic can raise a version one level and never lowers it below the platform's own, and it never goes past what the platform renders. A post whose whole point is an install step carries its one command on a concept platform, as plain text; a post about a security advisory carries the advisory's identifier on every platform; a code-level source still gets a concept-level `instagram` version, because a code block there is a screenshot of nothing. The level decides what kind of material goes in, and the band decides how much of it.

## Hashtags

The count per platform comes from the hashtag table in `awesome-content-campaign`'s `references/platforms.md`, which is the single source. Three rules bind here:

- `peerlist` carries none. The composer states it in words, and a tag line spends the 480-character budget on text that has to be deleted before submitting.
- `medium`, `substack`, `hackernoon` and `reddit` carry no hashtag footer. The first three take topics in their own field; Reddit has no tag system at all and a tag block marks the post as imported spam.
- `daily-dev` is never given a forced footer.

## Code and commands

An install command or a snippet goes in a fenced block with its language on the long-form platforms, and as inline code on the short ones where a fence would eat the budget or fail to render. Never invent a command: it is taken from the source, verified against the official quick start, and published in the form the project itself documents.

## Links

One or two relevant official links per post, embedded in the sentence that points at them. Markdown links on the long-form platforms; bare URLs on the plain-text feeds. Never a link dump under a `Repos:` heading.

Two platforms linkify less than they look like they do, so the post is written to survive it: `wonderful-dev` auto-links only a bare domain token, and `patreon` auto-links nothing. On both, the closing sentence still reads correctly when its URL is plain text, and making it a real anchor is the publisher's job.

`threads` can carry a text attachment of up to 10,000 characters beside the 500-character post, offered by the interview under the long shape. The attachment is neither indexed by search engines nor federated to the fediverse, so the post itself still carries the point and the attachment is the long version, in its own file named by the `attachment_text` field.

Every post has to land without its link. Delete the URL and the sentence that points at it, and the point must still be there: that is the test, and it is also LinkedIn's stated position on links in posts. A closing whose only words point at the link without saying what is behind it fails it, and the gate counts that shape.

## Typography

ASCII punctuation throughout: `'` for apostrophes, `"` for quotes, `-` in place of any dash, `->` in place of a decorative arrow. Zero em dashes anywhere, including titles, hashtag lines and alt text. Emoji are allowed, under the budget and placement rules in Phase 4 of `SKILL.md`; the character `#show` never appears, and no internal label (`Title:`, `Description:`, `Character count:`) survives into a file.

## The validation pass

`node scripts/gate.mjs <posts-folder>` checks everything on this page and everything countable in `authored-style.md` in one run: the file set, the slugs, the caps at their 98% margin, the bands, the punctuation, the hashtag counts, the paragraph shape, the banned openers. It exits 0 or prints one `slug: check: detail` line per finding, and `--self-test` proves every check can fire. With `--notes` it also checks every post against the run's source notes, source text, unit and claims ledger, and `--before` proves a wording fix changed no number, name or negation (`references/fidelity.md`). The numbers in the script and the numbers in these tables are the same numbers; a change to one is a change to both.

A failing check is a rewrite of that post, never a trim to satisfy the number.
