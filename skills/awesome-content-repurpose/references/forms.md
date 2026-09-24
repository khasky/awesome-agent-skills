# Forms - the three posts, the platforms each one serves, and its ceiling

A run writes three files and no others. Each one is a form that serves a group of platforms whose surfaces behave alike, and each is held to the tightest limit in its group, so the same file publishes everywhere in that group without a cut. Read this file at Phase 5, before the long form is drafted, and again before each derivation.

## 1. The three forms

| Form | File | Default platforms | Ceiling | Carries | Never carries |
| --- | --- | --- | --- | --- | --- |
| long | `3-long.md` | `blogger`, `buymeacoffee`, `deviantart`, `devto`, `dreamwidth`, `github-gists`, `hackernoon`, `hashnode`, `ko-fi`, `livejournal`, `mataroa`, `medium`, `patreon`, `substack`, `telegraph`, `teletype`, `tumblr` | section 3 | `##` and `###` headings, fenced `text` blocks, lists, a labelled reference list, the footer | an H1, a tag line, a markdown table |
| regular | `2-regular.md` | `daily-dev`, `facebook-wall`, `instagram`, `linkedin`, `mewe`, `minds`, `quora`, `vk-wall`, `wonderful-dev`, `youtube` | 2000 characters, the whole body counted, link line and footer included | `##` headings, short lists, one bare link line, the footer | an H1, a fenced block, a table, a command that contains a URL, a tag line |
| short | `1-short.md` | `bastyon`, `bluesky`, `flickr`, `flipboard`, `imgur`, `mastodon`, `peerlist`, `pinterest`, `pixelfed`, `threads`, `tiktok`, `truthsocial`, `x` | 280, counted the way `x` counts | complete plain sentences, at most one emoji | a heading, a list, a fence, markdown emphasis, a URL, a tag, the footer |

The slugs are the canonical ones in `awesome-content-campaign/references/platforms.md`. The youtube channel post carries the `youtube` slug.

The files are numbered by reading size, short first, which is also the order a person scans a folder in. They are written in the opposite order: long, then regular from the long, then short from both.

## 2. Membership

The default groups are the table above, and a run writes a form's `platforms` list from them. `--platforms` narrows each group to the slugs named. A form whose group ends up empty is still drafted when the next form down is derived from it, and it is not shipped.

Five canonical slugs sit outside every default group: `facebook-page`, `telegram`, `reddit`, `lemmy` and `hackernews`. Each one breaks a rule the forms depend on. `reddit`, `lemmy` and `hackernews` are rooms somebody else moderates, where a follow-me footer reads as promotion, and the regular form always carries one. `telegram` caps a caption under an image at 1024 characters, which would pull the regular ceiling down to half. `facebook-page` is the same surface as `facebook-wall` under a different owner. A user who names one of them explicitly gets a question before the brief, with the conflict stated in one line: add it to `regular` and accept the consequence, or leave it out. A platform added this way changes that form's ceiling to the new minimum.

## 3. Ceilings

A form's ceiling is the lowest hard limit among its platforms, measured the way each platform measures it. The body is written under that number, and nothing the publisher adds may push it over, because the publisher adds only what fits whole.

These are the platform limits the defaults rest on. Each row names where the number came from: `measured` means read off the live composer or its server response, `documented` means the platform's own page or source code, and `secondary` means independent sources that agree while the official page could not be opened. Checked on 2026-09-23.

| Platform | Limit | Unit and notes | Source |
| --- | --- | --- | --- |
| `x` | 280 | weighted characters; a URL costs 23, an emoji 2; Premium accounts allow 25,000 | documented |
| `bluesky` | 300 | graphemes | secondary |
| `peerlist` | 480 | characters; the composer truncates silently past it | measured |
| `threads` | 500 | characters, plus a separate text attachment of up to 10,000 | measured |
| `mastodon` | 500 | characters by default, a per-instance setting; a URL costs 23 | documented |
| `pixelfed` | 500 by default, 2000 on `pixelfed.social` | per-instance setting | measured |
| `pinterest` | 500 description, 100 title | characters | secondary |
| `truthsocial` | 1000 | characters | documented |
| `tiktok` | 4000 caption, 90 title | characters | measured |
| `imgur`, `flickr`, `flipboard`, `bastyon` | none published | | |
| `wonderful-dev` | 2000 | characters; enforced by the server and invisible in the composer | measured |
| `instagram` | 2200 | characters | measured |
| `linkedin` | 3000 | characters | secondary |
| `youtube` | 10,000 | characters | measured |
| `vk-wall` | about 16,000 | characters | secondary |
| `facebook-wall` | 63,206 | characters | secondary |
| `mewe`, `minds`, `daily-dev`, `quora` | none published | | |
| `tumblr` | 4096 per text block | a longer paragraph is split into blocks automatically | documented |
| `deviantart` | 65,535 | characters, embedded images included | secondary |
| `dreamwidth` | 300,000 | characters | secondary |
| `github-gists` | 1 MB per file | | documented |
| `livejournal` | 100 title | the body has no published cap | measured |
| `ko-fi` | 70 blog title | the blog body has no published cap | measured |
| `telegraph`, `medium`, `substack`, `devto`, `hashnode`, `hackernoon`, `mataroa`, `buymeacoffee`, `patreon`, `teletype`, `blogger` | none published below the ones above | | |

What that gives the three forms:

- **short: 280, counted as `x` counts.** Each emoji weighs 2. The body holds no URL, so no link weight is spent inside it. Every other platform in the group allows at least that much, so a body that fits `x` fits all of them.
- **regular: 2000 characters.** The whole body counts, from the first line to the last line of the footer, with the link line and the `***` separator inside it. `wonderful-dev` sets the number, and it rejects anything longer without a visible error.
- **long: no ceiling below 65,535 characters among the documented ones, and no single paragraph above 4096.** The paragraph rule is `tumblr`'s block size. `telegraph` publishes no limit at all, so a long form over about 30,000 characters is reported to the user as untested there rather than assumed to fit.

A ceiling is a limit, never a target. Each form is as long as its material needs and stops when the point is made. A regular post at 1200 characters that says everything is finished, and one padded to 1950 is worse for it.

These numbers move. When a platform's composer or server disagrees with a row here, the composer wins, and the row is updated with the date and the evidence rather than argued with.

## 4. What the publisher does with each file

The three files are written for `awesome-content-publisher`, which fans each one out to the platforms in its `platforms` list. Knowing what it does keeps the files free of anything it would have to remove:

- **Title.** The frontmatter `title` goes into the platform's own title field where one exists, and is left out where none does. That is why no body carries an H1.
- **Hashtags.** The frontmatter `hashtags` list is a pool in priority order. Per platform, the publisher takes as many from the front as that platform's norm allows. It places them in the platform's own tag field where there is one, and otherwise as the last line of the body, after the footer. A platform without tags gets none. That is why no body carries a tag line.
- **Fitting.** On a short post the publisher appends, in this order and only while each whole piece still fits the platform's own limit: the first entry of `links`, then whole tags. Nothing is ever cut to fit, and a piece that does not fit whole is left off. On regular and long it appends whole tags that fit and nothing else, since the link and the footer are already in the body.
- **Footer.** Never on a short post. On regular and long it is part of the body the run wrote, so the publisher neither adds it nor removes it.
- **Markdown.** On a platform whose composer renders none, the publisher converts the body to plain text: fences dropped with their lines kept, emphasis unwrapped, `***` removed, and each `##` heading replaced by an emoji that fits its words, followed by the heading text. That is why a regular heading is written as a short line of plain words that reads well after an emoji.

## 5. The pictures

A post set gets two pictures, not one per form or per platform: `horizontal.png` at 16:9 and `vertical.png` at 9:16, written by `awesome-content-image-adapter`. Which one a platform takes is its `Picture` column in `awesome-content-campaign/references/platforms.md`, researched per platform in that file. Each form file declares the pictures its own platforms take, each entry marked with its `frame`, and the publisher picks per platform. With the default groups every form takes both: the long form for `tumblr`, the regular form for `facebook-wall`, `instagram`, `linkedin` and `youtube`, and the short form for `pinterest` and `tiktok`; everything else takes the horizontal one.
