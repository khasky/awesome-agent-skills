# Platform specs - the file set, the caps, the bands, the blueprints

The output contract per platform and the numbers every version is checked against. The platform vocabulary is the canonical table in `awesome-content-campaign/references/platforms.md`; the filenames below mirror its slugs, and a slug present here without a row there is a defect in this file. Frontmatter does not count toward any limit.

## 1. Canonical filenames

```text
bastyon.md          blogger.md          bluesky.md          buymeacoffee.md     daily-dev.md
deviantart.md       devto.md            dreamwidth.md       facebook-page.md    facebook-wall.md
flickr.md           flipboard.md        github-gists.md     hackernews.md       hackernoon.md
hashnode.md         imgur.md            instagram.md        ko-fi.md            lemmy.md
linkedin.md         livejournal.md      mastodon.md         mataroa.md          medium.md
mewe.md             minds.md            patreon.md          peerlist.md         pinterest.md
pixelfed.md         quora.md            reddit.md           substack.md         telegram.md
telegraph.md        teletype.md         threads.md          tiktok.md           truthsocial.md
tumblr.md           vk-wall.md          wonderful-dev.md    x.md                youtube-post.md
```

45 files by default. `youtube-post.md` carries the `youtube` slug: the channel post is text, and the name keeps it apart from anything the channel publishes as video. A requested subset uses the same names. No README, no manifest, no archive in the folder.

## 2. Hard body caps

| Platform | Cap | Enforced by |
| --- | ---: | --- |
| `x` | 280 | the composer |
| `bluesky` | 300 | the composer |
| `threads` | 500 | the composer |
| `mastodon` | 500 | the composer, per instance |
| `pixelfed` | 500 | the composer, per instance |
| `peerlist` | 480 | nothing visible: it truncates silently |
| `wonderful-dev` | 2000 | the server, as `too_big, maximum 2000`; the composer never shows it |
| `youtube` | 10000 | the composer, `maxlength` on the text field with a live counter |
| `livejournal` (title) | 100 | the title field's own counter; the body has no cap |

Write to about 95% of the cap. Count the body after the frontmatter, the way the platform counts: a URL costs 23 characters on `x`, an emoji costs 2. Never truncate a tail after drafting: rewrite to the band.

## 3. Depth bands

Editorial ranges for a substantial source (4+ modules, 2+ executable or config snippets). The lower bound is soft for thin material; the upper bound is an internal ceiling that sends a draft back to the compression ladder; the hard caps above override everything. Draft toward 92-106% of `Aim`; do not fill the ceiling.

| Platform | Band | Aim |
| --- | ---: | ---: |
| `bastyon` | 350-480 | 430 |
| `bluesky` | 240-290 | 280 |
| `buymeacoffee` | 3800-4800 | 4200 |
| `daily-dev` | 1800-2300 | 2050 |
| `devto` | 4700-5700 | 5200 |
| `facebook-page` | 1600-2100 | 1850 |
| `facebook-wall` | 1200-1700 | 1400 |
| `hackernews` | 500-750 | 620 |
| `hackernoon` | 4500-5500 | 4900 |
| `hashnode` | 3500-4500 | 4050 |
| `instagram` | 800-1200 | 1050 |
| `ko-fi` | 2800-3500 | 3200 |
| `lemmy` | 1400-1900 | 1650 |
| `linkedin` | 1100-1600 | 1350 |
| `mastodon` | 380-475 | 440 |
| `medium` | 6200-7400 | 6800 |
| `minds` | 1500-2100 | 1800 |
| `patreon` | 4000-5000 | 4600 |
| `peerlist` | 380-460 | 430 |
| `pinterest` | 350-500 | 430 |
| `pixelfed` | 380-475 | 440 |
| `quora` | 2400-3200 | 2800 |
| `reddit` | 1600-2200 | 1800 |
| `substack` | 4500-5600 | 5000 |
| `telegram` | 750-1050 | 880 |
| `telegraph` | 3400-4300 | 3800 |
| `github-gists` | 3000-5000 | 4000 |
| `teletype` | 1700-2300 | 1950 |
| `threads` | 350-475 | 450 |
| `truthsocial` | 350-480 | 420 |
| `tumblr` | 2200-2900 | 2475 |
| `vk-wall` | 1000-1400 | 1160 |
| `wonderful-dev` | 1500-1950 | 1750 |
| `x` | 230-270 | 260 |
| `blogger` | 3400-4300 | 3800 |
| `flipboard` | 300-600 | 450 |
| `livejournal` | 2500-3500 | 3000 |
| `dreamwidth` | 2200-3200 | 2700 |
| `mewe` | 800-1400 | 1100 |
| `youtube` | 700-1200 | 950 |
| `tiktok` | 300-600 | 450 |
| `imgur` | 300-700 | 500 |
| `flickr` | 300-700 | 500 |
| `mataroa` | 3400-4300 | 3800 |
| `deviantart` | 2200-3200 | 2700 |

`instagram` folds after about 125 characters and `linkedin` after about 140 on mobile: the promise and, under first person, the author are inside that stretch.

### Section budgets on long forms

A long form is composed to these budgets, in characters including its blocks, and measured before it is saved:

```text
intro with the paths block        400-600
primary path section              450-650 each (block plus at most three sentences)
secondary path section            150-350 each (one block at most, plus at most two sentences)
proof-full section                1,100-1,400
caveat section                    200-400
troubleshooting section           450-700 (symptom, block, restart line, lesson)
closing and reference links       150-400
```

Summed over a six-path guide that is about 4,600-5,600 for a deep article, which is where the bands sit. `medium` may spend up to a third more across the sections; `hashnode`, `telegraph` and the mini-blogs trim the secondary sections and the intro first. A section over its budget is rewritten before the next one is drafted, because an article that lands a third over its band is never saved by trimming the tail.

### Compression ladder

When a draft exceeds its ceiling, cut in this order: auxiliary verification detail (alias history, exact windows, policy wording); a mechanism explained twice; secondary-path detail to one sentence or bullet each; the internal tier table, keeping the cross-provider proof; the caveat to its one-sentence anchor; the troubleshooting to its symptom line; decorative intro and closing. Never cut the primary subject, the primary paths, the proof, the split, the selected voice, or the body link.

## 4. Guide/tutorial blueprints

Default shapes when `Source type: guide/tutorial`, and the word default is load-bearing: this table is the shape a file keeps unless the run's plan moves it, and `references/creativity.md` section 6 says which moves may reorder or re-enter it. On a short post - a hard cap, or any row whose band aim is under 600 characters - the `Body shape` column names the parts the post carries and the short-post arc in `SKILL.md` Phase 7 orders them: the author enters first, the number that bears the finding out arrives late, and an arrow in this column is not a licence to publish four unconnected lines. What the table fixes at every level is the class's coverage mode, its code allowance, its cap and its link count; what the moves may change is the order of its sections, where the body enters them, and how its headings are written. Legend: **H1 yes** = the body starts with a visible `#` title; **coverage all** = every core module; **major** = every major path named, one or two detailed; **primary** = the primary one or two paths only; **name-all** = every path named compactly, the primary one or two detailed; **code full** = several verified blocks; **short** = one or two compact blocks; **none** = no fenced block.

| Platform | H1 | Coverage | Code | Body shape |
| --- | --- | --- | --- | --- |
| `linkedin` | no | major | short | easiest-way opener naming both clients -> what the reader does not need -> path list -> primary setup block -> model diagram -> secondary paths in one sentence -> proof-compact, split, scope -> caveat -> link -> tags. Written to its 1100-1600 band: the gotcha and the second block are dropped first |
| `facebook-page` | no | major | short | opener -> primary block -> secondary block or sentence -> other paths sentence -> cloud-vs-local text block -> proof, split, scope -> caveat -> gotcha sentence -> link -> tags. A brand surface, so the post stands on its own and asks nothing |
| `facebook-wall` | no | major | none | community question, the post's only one -> reason -> proof-compact -> task list -> escalation sentence -> paths sentence -> scope -> caveat -> link. A wall post is a conversation among people who know the author, which is why it opens on the question |
| `instagram` | no | major | short | canonical keep-and-change opener inside the fold (`You can keep <A> or <B> and put <subject> behind them as the model provider.`) -> one primary block -> paths sentence -> proof, split, scope -> caveat -> link -> tags |
| `pinterest` | no | primary | none | stance -> proof-micro -> split line -> link. No title line: the frontmatter title fills the pin's own title field |
| `pixelfed` | no | primary | none | keep-and-change line -> paths sentence -> proof-micro -> split line -> link -> tags |
| `x` | no | primary | none | the shape `truthsocial` and `threads` take: one complete sentence of stance or subject naming both clients and carrying its reason (`I would run <subject> under <A> or <B> for <reason>.`), never the bare preference with the reason clause cut for room -> proof-micro -> split-micro -> link -> 2 tags |
| `bluesky` | no | primary | none | one complete sentence of stance or subject naming both clients in the modality of possibility (`You can keep <A> or <B> and put <subject> behind them.`), never a present-tense report that reads as already installed -> proof-micro -> split-micro -> link -> 2-3 tags |
| `threads` | no | name-all | none | canonical keep-and-change naming both clients (`You can keep <A> or <B> and swap <subject> in as the provider.`) -> proof-micro -> split-micro -> `<Subject> also works behind <A>, <B>, <C> and local <D>.` -> link |
| `mastodon` | no | primary | none | subject-can line -> proof-micro -> split-micro -> caveat-micro -> link -> 1-2 tags |
| `peerlist` | no | name-all | none | stance -> proof-micro -> split line -> "also" line naming the other paths -> link |
| `truthsocial` | no | primary | none | stance -> proof-micro -> split-micro -> caveat-micro -> link -> 1-2 tags |
| `minds` | no | major | short | subject-can opener -> primary block -> secondary block -> the separation in one sentence -> proof, split, scope -> gotcha sentence -> caveat -> link -> tags |
| `bastyon` | no | primary | none | the short shape `truthsocial` and `threads` take: the canonical keep-and-change opener naming what stays and what changes, never a negative construction -> proof-micro -> split-micro -> link. No code, no diagram, no tag line: the composer renders none of the first two and the tags live in its own `Categories and tags` control |
| `tumblr` | no | all | short | the useful idea -> primary block -> model diagram -> secondary block -> the other paths, each in one line with a text block for the gateway and the local path -> proof, split, scope -> a reframed question block -> gotcha sentences -> link |
| `patreon` | yes | all | full | first-person intro -> one heading per path (secondary paths may pair) -> gateway diagram -> proof-full -> caveat heading -> gotcha heading with block -> one-line lesson -> links |
| `ko-fi` | yes | all | full | the `buymeacoffee` shape at this band: H1 -> an intro that states the promise in prose, never a bare block under the heading -> keep-and-change block -> one heading per path -> proof-full -> caveat -> gotcha with block -> links |
| `buymeacoffee` | yes | all | full | the useful idea + keep-and-change block -> one heading per path -> proof-full -> caveat -> gotcha with block -> links |
| `devto` | yes | all | full | intro + paths block -> one heading per path -> proof-full under a peer-naming question heading -> caveat heading -> gotcha heading with block -> reference links. No body tag line: a `#tag` line renders as a heading there |
| `hashnode` | yes | all | full | intro -> one heading per path -> proof-full -> caveat -> gotcha with block -> reference links. No body tag line: tags go in the platform's field |
| `hackernoon` | yes | all | full | intro + paths block -> one heading per path (secondary paths may pair) -> proof-full -> caveat -> gotcha with block -> one-line lesson -> reference links |
| `medium` | yes | all | full | H1 + one-clause subtitle stating the idea (never a contents list) -> architectural intro -> one heading per path -> proof-full -> free-vs-paid block if sourced -> caveat heading -> gotcha heading with block and layers block -> preferred-setup routing block -> one plain closing sentence of judgment -> reference links |
| `substack` | yes | all | full | H1 + one-clause subtitle stating the idea (never a contents list) -> received-wisdom opener -> model diagram -> one heading per path -> proof-full -> caveat -> gotcha with block -> one-line lesson -> reference links |
| `telegraph` | yes | all | full | one-line intro -> one heading per path -> proof-full -> caveat -> gotcha with block -> reference links |
| `github-gists` | yes | all | full | H1 repeating the description -> the same two-sentence intro a deep article takes (common assumption contradicted, or the cheapest-way-to-find-out shape), never a bare line above a block -> one heading per path -> proof-full -> caveat -> gotcha with block -> reference links. The most code-friendly surface in the set: every verified block ships, and a table is welcome where the source has one |
| `teletype` | yes | major | short | intro + paths sentence -> primary path headings with blocks -> gateway and local headings in prose -> proof, split, scope -> troubleshooting heading in prose -> caveat -> link |
| `wonderful-dev` | no | major | short | no headings at all: continuous short paragraphs -> primary block -> paths sentence -> proof, split, scope -> gotcha sentence -> caveat -> link |
| `daily-dev` | yes | major | short | H1 -> the room question as the first body line, the post's only one, built by the two-way rule in `references/authored-style.md` and never from a workload or a duration the body does not carry -> two or three sentences of context -> primary headings with blocks -> "Other paths" bullet list -> proof, split, scope -> troubleshooting heading with block -> caveat -> link |
| `lemmy` | no | major | short | no title line in the body, since the composer has a title field the frontmatter fills -> the room question as the first body line, the post's only one, built by the two-way rule in `references/authored-style.md` and never from a workload or a duration the body does not carry -> two or three sentences of intro -> the neutral inventory sentence -> primary blocks -> proof, split, scope -> gotcha sentence -> caveat -> link |
| `reddit` | no | major | short | no title line in the body, since the title field carries the question -> a personal frame naming the subject and both clients, never the `rather than` contrast -> routing text block -> proof block -> scope -> task list -> escalation sentence -> non-ranking sentence -> labelled links. The question is the title, so the body does not ask a second one |
| `quora` | yes | major | short | question H1 naming the clients -> direct answer naming what the guide shows -> primary blocks -> bold-led secondary paths -> free-vs-paid sentence -> routing block -> proof, split, scope -> caveat -> gotcha sentences -> link |
| `hackernews` | no | major | none | the hard-cap shape at this band, one claim per block with blank lines between: no title line in the body, since the submission's title field carries it -> the opener naming what stays and what changes -> proof-micro -> split-micro -> one sentence of whichever condition the title names, pricing or privacy, with the term it rests on -> link. No `Why:` label, no paragraph sweeping several subjects together, no `guide`, no tags |
| `telegram` | no | major | none | `reddit`'s order and register compressed to the band, with a statement title rather than a question: a personal frame naming the subject and both clients -> model diagram -> proof text block -> conditions line -> two short lists (run here / escalate) -> paths sentence -> caveat -> link -> tags. No bold lead line, no question anywhere, and no setup block at this band, which is also why the ingredients are never named in prose instead (`one base URL and one token` counts what the post does not show) |
| `vk-wall` | no | major | none | subject-can opener -> proof text block -> conditions -> task list -> escalation sentence -> paths sentence -> scope -> caveat -> link -> tags |
| `blogger` | yes | all | full | one-line intro -> one heading per path -> proof-full -> caveat -> gotcha with block -> reference links. Labels in frontmatter only |
| `flipboard` | no | primary | none | one or two sentences of the author's reading -> proof-micro -> the link. A caption on a card, nothing longer |
| `livejournal` | yes | all | full | title under 100 characters -> intro -> one heading per path -> proof-full -> caveat -> gotcha with block -> link. Tags in frontmatter only |
| `dreamwidth` | yes | all | short | subject under 100 characters -> intro -> one heading per path, secondary paths grouped -> proof-full -> caveat -> gotcha in prose -> link. Tags in frontmatter only |
| `mewe` | no | major | none | keep-and-change opener -> paths sentence -> proof-compact, split, scope -> caveat -> link -> tags |
| `youtube` | no | primary | none | subject-can opener -> proof-compact -> split -> caveat-micro -> link -> 0-3 tags. A card under the channel, not an article |
| `tiktok` | no | primary | none | caption: keep-and-change line -> proof-micro -> split-micro -> tags. The photos carry the rest |
| `imgur` | no | primary | none | two or three caption sentences with proof-micro -> link. No title line: the frontmatter title fills the post's title field |
| `flickr` | no | primary | none | two or three description sentences with proof-micro -> link. No title line: the frontmatter title fills the photo's title field |
| `mataroa` | yes | all | full | one-line intro -> one heading per path -> proof-full -> caveat -> gotcha with block -> reference links. Markdown as written |
| `deviantart` | yes | all | short | intro -> one heading per path, secondary paths grouped -> proof-full -> caveat -> gotcha in prose -> link. Tags in frontmatter only |

The table controls shape, not wording. The economics section always follows the path sections; the caveat and the troubleshooting follow the economics.

### Heading policy on deep surfaces

One literal heading per path by default on `buymeacoffee`, `devto`, `github-gists`, `hashnode`, `ko-fi`, `medium`, `substack`, `telegraph`. At most two adjacent secondary paths may pair under one heading on `hackernoon` and `patreon`. `daily-dev` and `teletype` may group secondary paths more aggressively. `wonderful-dev` renders headings as a long-read card and takes none.

## 4a. Layout targets

Apply when the source has 4+ modules and 2+ executable or config snippets; scale code counts down for a thinner source. `blocks` are blank-line-separated content blocks.

| Platform or group | Blocks | Code or text blocks | Lists | Visible body links |
| --- | ---: | ---: | --- | --- |
| `x`, `bluesky`, `mastodon`, `truthsocial`, `pinterest`, `pixelfed` | 3-6 plus the tag line | 0 | none | exactly 1 |
| `threads`, `peerlist` | 3-6 | 0 | one inline "also covered" line | exactly 1 |
| `hackernews` | 5-6 | 0 | none | exactly 1 |
| `facebook-wall` | 8-15 | 0 | 1 task list | exactly 1 |
| `telegram`, `vk-wall` | 8-14 | 1-2 text | 1-2 short lists | exactly 1 |
| `linkedin` | 10-18 | 1-2 | 1 path list | exactly 1 |
| `facebook-page`, `minds` | 12-22 | 2-4 | optional | exactly 1 |
| `instagram` | 7-12 | 1 | none | exactly 1 |
| `wonderful-dev` | 8-14 | 1 | none | exactly 1 |
| `reddit`, `lemmy` | 12-20 | 1-3 | 1 task list on `reddit` | 1-3 |
| `daily-dev`, `teletype` | 14-24 | 2-4 | 1 grouped-path list | 1-3 |
| `tumblr` | 20-35 | 4-8 | optional | 1 |
| `quora` | 18-28 | 2-4 | bold-led paths | 1-4 |
| `ko-fi`, `buymeacoffee`, `patreon` | 30-58 | 6-11 | 2 task lists | 2-7 |
| `devto`, `hashnode`, `hackernoon`, `substack`, `telegraph`, `github-gists` | 35-70 | 8-14 | 2 task lists | 3-10 |
| `medium` | 55-85 | 10-16 | 2 task lists | 4-10 |
| `blogger`, `mataroa` | 35-55 | 4-9 | 1-2 useful lists | 3-9 |
| `livejournal` | 30-48 | 4-8 | 1-2 useful lists | 2-6 |
| `dreamwidth`, `deviantart` | 24-40 | 2-5 | 1 useful list | 2-5 |
| `mewe` | 8-14 | 0-1 | optional | exactly 1 |
| `youtube` | 5-9 | 0 | none | exactly 1 |
| `flipboard`, `tiktok`, `imgur`, `flickr` | 2-5 | 0 | none | exactly 1 (the flip's URL, the caption's link) |

Representation retention: with `N` distinct executable or config blocks in the source, deep surfaces keep `min(12, max(6, ceil(0.70 * N)))` code or text blocks, mini-blogs `min(8, max(4, ceil(0.45 * N)))`, feeds above 1,000 characters 2-4, shorter surfaces inline commands or none. The text diagrams of `authored-style.md` section 4 count toward these targets. A code-heavy source rendered with 0-1 blocks on a code-friendly surface is structurally wrong even when every module is named in prose.

## 5. Blueprints for other source types

- **Project/repository**: short = what was found, the concrete headline result, practical use, caveat, repo link; long = what it is, headline result, how it works, requirements and quick start, limits, who it is for, verified install and link.
- **Announcement/update**: what changed, why it matters, mechanism, main caveat, who should care, official link.
- **Benchmark/report**: setup and method, result with conditions, what it means, limitations, practical implication.
- **Essay/opinion**: the thesis and the argument order preserved, examples compressed per platform, never a feature list.
- **Retrospective/historical**: the timeframe stated early, old rules and prices in past tense, a current correction only where verified.

## 6. Presentation classes

| Class | Platforms | Proof rendering | Opener tendency |
| --- | --- | --- | --- |
| hard-cap | `x`, `bluesky`, `threads`, `mastodon`, `peerlist`, `truthsocial`, `pinterest`, `pixelfed`, `flipboard`, `tiktok`, `imgur`, `flickr` | `proof-micro` | stance, subject-can, keep-and-change |
| professional feed | `linkedin`, `facebook-page`, `minds`, `wonderful-dev` | `proof-compact` | keep-and-change, easiest-way, no-need-to, subject-can |
| visual and channel feed | `instagram`, `vk-wall`, `mewe`, `youtube` | `proof-compact` or a proof text block | keep-and-change, bold lead, subject-can |
| channel post on `reddit`'s register | `telegram` | a proof text block | personal frame, keep-and-change, subject-can. No bold lead: the blueprint takes `reddit`'s order, and a bold equation on top of it is the announcement that order exists to avoid |
| community | `facebook-wall`, `reddit`, `lemmy`, `hackernews`, `quora` | `proof-compact` or a proof text block | community question, direct answer, source-shows |
| mini-blog | `ko-fi`, `buymeacoffee`, `patreon`, `tumblr`, `teletype` | `proof-full` (`tumblr`, `teletype`: `proof-compact`) | the useful idea, author stance, source-shows |
| deep article | `devto`, `hashnode`, `hackernoon`, `medium`, `substack`, `telegraph`, `github-gists`, `daily-dev`, `blogger`, `mataroa`, `livejournal`, `dreamwidth`, `deviantart` | `proof-full` (`daily-dev`: `proof-compact`) | easiest-way, common assumption, no-need-to, keep-and-change |

## 7. Discussion surfaces

One question per post, and where it sits depends on whether the platform shows a title.

- `reddit` and `quora` ask in the visible title, which is the submission's own question, and the body answers it and ends on the links. A second question at the foot asks the room something it was already asked at the top.
- `facebook-wall` has no visible title, so the question opens the body and the post ends on the link.
- `lemmy` takes a statement title and then opens its body on the question, the way `facebook-wall` does: the room is asked first and the short intro follows, so a reader who scrolls past the title still meets the question. Nothing closes the body but the link.
- `daily-dev` opens on its question the way `facebook-wall` and `lemmy` do, with the context following it, and closes on the link.
- `devto` and `hashnode` may close on one, and only where their title is a statement.
- Everywhere else the post ends on its content.

A question-shaped section heading is a label, not a question to the room, and is outside this count. No two questions in a pack are the same.

## 8. Visible titles

A visible H1 on `buymeacoffee`, `daily-dev`, `devto`, `hackernoon`, `hashnode`, `ko-fi`, `medium`, `patreon`, `quora`, `substack`, `telegraph`, `teletype`, `blogger`, `livejournal`, `dreamwidth`, `mataroa`, `deviantart` (the publisher moves it into the platform's title field where one exists).

`reddit`, `lemmy` and `hackernews` carry no title line in the body. Their composers are a title field plus a plain body, the publisher fills the field from the frontmatter `title`, and a first line repeating it publishes the same sentence twice on the same screen.

`github-gists` is the one platform that keeps its title in two places on purpose: the frontmatter `title` goes into the gist's description field, which is what a reader sees in a gist listing and in a search result, and the body opens with the same sentence as its `#` heading, which is what renders inside the document. That is how the author's own gists are written, and the description is not a heading the rendered file carries.

`imgur`, `flickr` and `pinterest` carry no title line in the body at all. Each has a title field of its own in its composer, filled from the frontmatter `title`, so a first line repeating it publishes the same sentence twice, once as the title and once as the opening of the caption. Their bodies start on the caption.

`hackernews` keeps its plain title line, because a submission there is title plus text and the line is what the run reads back. Everywhere else the title lives in frontmatter only.

## 9. Body hashtags

The norms are the hashtag table in `awesome-content-campaign/references/platforms.md`. Tag lines come from the run's `Hashtag pool`, in pool order, every tag with `#`, CamelCase for multi-word tags, as the last line of the body:

```text
x 2              bluesky 2-3        mastodon 3-5       pixelfed 3-5
instagram 3-5    linkedin 3-5       truthsocial 3-5    minds 3-5
facebook-page 3  facebook-wall 3    vk-wall 3-4        telegram 3-4
mewe 3-5         youtube 3          tiktok 3-5 (in the caption)
```

These are targets, not floors: the canonical ranges are already resolved here, so a platform ships the number on this line and drops below it only when the cap forces the cut. A platform may take any number inside its own range rather than the same number on every run, and where a range has one value that value stands; the fediverse rows keep their floor whatever the level, because tags are how a post is found there at all. `x` ships 2 and falls to 1 only inside 280 characters, because one tag leaves the platform's cheapest reach unclaimed while three cost reach; `bluesky` ships 2 or 3 inside its 300. Where this table still gives a range, the post takes any number in it. The run reports every platform that shipped under its target, with the reason.

Tags live in the platform's own field, so the body carries no tag line and the frontmatter list carries the norm count, on `devto`, `hashnode`, `medium`, `hackernoon`, `substack` (up to 5), `tumblr` (5-20 in the field), `threads` (exactly 1 topic tag, no `#`), `teletype`, `blogger` (labels), `livejournal`, `dreamwidth`, `imgur`, `flickr`, `deviantart`, `bastyon` (the composer's `Categories and tags` control), `ko-fi` (a comma-separated `Tags` row), `buymeacoffee` (a `Categories` block) and `patreon` (`Add tags`). The reason is mechanical on the markdown article platforms: a line of `#deepseek #claudecode` starts with a hash, so `devto` and `hashnode` render it as a heading rather than as tags, and the tags belong in the composer's own field where they are clickable. Because that reads as a missing tag line to anyone comparing files, the run's report names these platforms and says the tags are in the frontmatter for the composer's field. No tags anywhere on `reddit`, `lemmy`, `hackernews`, `quora`, `peerlist`, `telegraph`, `flipboard`, `mataroa`, `github-gists` (a gist has no tag system at all, and a `#word` line at the start of a line renders as a heading), `wonderful-dev` and `daily-dev` (measured on published posts: the tags render as plain text with zero anchors, so the line indexes nothing); their frontmatter `hashtags` is `[]`.

Where the body carries a tag line, the frontmatter list is the same tags in the same order and count. A tag line is never cut to fit a cap: the prose is shortened first, and a tag is dropped whole from the end only when the norm allows fewer.

## 9a. Where the footer ships

When the interview supplied a footer, it goes after the link and before the tag line on the platforms the author owns, it is dropped where the surface belongs to somebody else, and it is skipped where the cap has no room for it:

```text
ships      blogger, mataroa, telegraph, teletype, substack, medium, hashnode, github-gists,
           devto, hackernoon, livejournal, dreamwidth, tumblr, deviantart,
           linkedin, facebook-page, facebook-wall, vk-wall, minds, mewe, youtube,
           flipboard, instagram, wonderful-dev, daily-dev, telegram,
           patreon, ko-fi, buymeacoffee, flickr
never      reddit, lemmy, hackernews, quora, imgur,
           and any post whose target names a room somebody else moderates
skipped    x, bluesky, threads, mastodon, truthsocial, bastyon, peerlist, pinterest,
           pixelfed, tiktok
```

The `never` list is the platforms whose own guidance treats a promotional block as spam: Hacker News asks that the site not be used for promotion, Reddit's self-promotion rules and per-subreddit policies read a signature block as advertising, Quora counts self-promotional links that are not part of the answer as spam, Imgur's community expects the poster to be a member rather than an advertiser, and a Facebook group or a Lemmy community is moderated by someone who did not invite it. A post that carries the footer into one of those is a rule violation the run made on the user's behalf, so the default is to omit and report.

## 10. Emoji per platform

The interview count applies everywhere except `hackernews` (always 0), and the subject family in `references/registers.md` caps it: the technical families sit at none to one whatever the interview says, which is what keeps a debugging post from wearing four emoji on a surface whose natives use none. The draw is per length class under `1-5`: deep articles and mini-blogs take 2 to 5, every other class 1 to 2, and on the long forms the family cap rises by one with a density limit of one emoji per 400 characters of body (`references/authored-style.md` section 8). The natives of `instagram`, `pixelfed`, `threads`, `telegram`, `vk-wall`, `mewe`, `youtube` and `tiktok` carry emoji on the promise line; `linkedin`, `reddit`, `lemmy`, `quora` and the article platforms, `blogger`, `livejournal`, `dreamwidth`, `mataroa` and `deviantart` among them, carry them inside the prose where a sentence earns one.

## 11. Frontmatter

Exactly `platform`, `title`, `voice`, `creativity`, `model`, `links`, `hashtags`, in that order, plus `attachments` where the media stage (`SKILL.md` Phase 11) wrote one. Forbidden: `scheduled`, `timezone`, `media`, `alt_text` as a key of its own (the alt text rides inside the attachment entry), `status`, `target`, `queue`, `cadence`. The publishing skill adds those later.

What each platform takes, once media exists:

```text
video, as a vertical short   tiktok, instagram, youtube, pixelfed, and any row the
                             Phase 3 check confirms takes video
up to 4 stills in sequence   instagram (carousel), tiktok (photo set), linkedin
                             (document), imgur, flickr, tumblr, facebook-page
one still                    every other platform whose Media column takes media
linked, never attached       github-gists: the composer takes text only, so an image
                             is referenced by absolute URL inside the Markdown or the
                             post ships without one
nothing                      hackernews, and any row that supports no attachment
```

A media-required platform (`instagram`, `pinterest`, `pixelfed`, `tiktok`, `imgur`, `flickr`) is never dropped for want of media. Its text is written and its file ships like every other, because whether a post without a picture can go out is a publication decision and `awesome-content-publisher` is where that decision lives. The run says which files carry no attachment and why.

## 11a. Section separators

Where a platform renders a horizontal rule, the run may mark a boundary between top-level parts with one. Which platforms do, and how the separator is written, measured in the live editors rather than assumed:

| Platform | Separator | How it goes in |
| --- | --- | --- |
| `devto`, `hashnode`, `mataroa`, `github-gists`, `lemmy`, `reddit` | yes | `---` on its own line, standard Markdown, rendered as `<hr>` |
| `medium` | yes | `---` typed on an empty line converts the moment the third dash lands, into `hr.section-divider` - the three-dot divider |
| `hackernoon` | yes | the editor toolbar's `Divider` control, shortcut `ctrl _` |
| `substack` | yes | `horizontalRule` is in the editor's schema; the Markdown input rule applies |
| `deviantart` | yes | `horizontalRule` in the schema, `Horizontal Rule` on the toolbar |
| `teletype` | yes | the block menu's `Divider` entry |
| `blogger`, `dreamwidth` | yes | `<hr>` in HTML mode |
| `tumblr` | no | the block menu is Text, Photo, Quote, Link, Chat, Audio, Video - nothing else |
| `quora` | no | the `Aa` menu is Bold, Italic, Quote, Format code, Bullets, Numbers, Link |
| `ko-fi`, `buymeacoffee`, `patreon`, `livejournal`, `telegraph`, `wonderful-dev`, `daily-dev` | check on the first run | enumerate the toolbar, or read the editor instance's schema for a `horizontalRule` node, and record the answer in the platform note |
| hard caps and plain-text feeds | no | no formatting of any kind; a row of dashes publishes as characters |

Two rules bind every row. A platform whose answer is `no` never receives a typed separator - `---` in a plain-text composer is three dashes a reader sees. And a separator is placed only by the analysis in `revision.md` section 3: it marks a part boundary, at most three in a long read, never one per heading.

## 12. Validation list

```text
exact requested file count, canonical filenames
frontmatter key order exact, forbidden keys absent, voice and creativity equal the
interview answers, model equals the identifier the runtime reports
the same 1-3 link set on every file
hard caps with margin, bands and Aim, ceilings enforced
blueprint shape per platform: H1, coverage, code, order
layout targets and representation retention
every anchor present in the classes that carry it at the level's standard, proof on every platform
no anchor paraphrase, no frame echo at the level's threshold (authored-style.md section 11)
rhythm floor per file, clustering ban, structure moves per file and per class (creativity.md sections 5 and 6)
subject family register: rhythm band, lexicon, question habit, emoji baseline (registers.md)
opener, closing, title and first-person distributions
correction locality and deep-detail budget (one third of the pack at most)
short-post arc on hard caps and on every band aim under 600: order, the author's
own line, payoff last, no movable line
no repeat inside a file: the key number once, no 2-word phrase in two sentences
no sentence appears twice in a file, and no paragraph is a copy of another, compared after
collapsing whitespace — a duplicate that reaches the publisher is a question it has to stop and ask
numbers without decoration zeros
emoji count equals the drawn count for the length class, density on long forms
emphasis: marked spans per class, capitals span, reasons recorded, exclamation
and question marks against the family's Ask value
emoji placement rules, hackernews at zero
tag lines from the pool in pool order
ASCII punctuation, semicolon allowance, bold allowance, no #show, no date outside the allowed qualifier
no README, no manifest, no archive
```
