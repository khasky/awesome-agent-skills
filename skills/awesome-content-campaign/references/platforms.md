# Platforms — the canonical vocabulary, structural notes, and the live-verify checklist

This file is the single source of the platform vocabulary. The slugs below are what the interview offers, what filenames carry, and what `awesome-content-publisher` parses; adding a platform means adding a row here and a `references/posting-<slug>.md` in that skill, listed in its `platform-posting.md` index, in the same change. No other file restates the list.

Structural facts here are stable (what a platform *is*); everything volatile — character caps, media size limits, per-tier differences, algorithm behavior — is deliberately absent and MUST be verified live in Phase 3, recorded in the manifest with a checked-on date.

Every platform on the list is reached as a website in a logged-in browser — `awesome-content-publisher` drives the real web UI through the Playwright MCP bridge and uses no platform APIs, developer apps, bots or webhooks. So Phase 3 verifies what the web composer does: a cap the mobile app enforces differently, a feature only the desktop client has, or an API-only capability is not what the posts must fit.

## The canonical table

`Slug` is the vocabulary token: filenames carry it verbatim, so it stays lowercase with hyphens and never a dot — a dot collides with the file extension when a name is parsed back. `Site` says which service the slug means, because several of them are not guessable from the token. `Target` is the detail posting requires and the interview must collect (Phase 2); a post reaching the publisher without it is a publication blocker. `Media` says what the platform does with an attachment: required means it cannot post without one, optional means it takes one and the run's image belongs there too, and a row saying none is supported takes no attachment at all. Optional is not a synonym for "skip it" — when the campaign has an image, every optional row that the post targets gets it. `Image` is the frame shape the platform shows an attachment in, which is a structural fact about the surface rather than a volatile limit: `awesome-content-image-adapter` reads this column, and its `awesome-content-image-adapter/references/geometry.md` turns each shape into a pixel target. A row reading `none` takes no image file at all. `Genre` names the register file Phase 5 writes against.

| Slug | Site | Target the interview must collect | Media | Image | Genre file |
| --- | --- | --- | --- | --- | --- |
| `facebook-wall` | facebook.com | defaults to the personal timeline (`facebook.com/<handle>`); a group URL when the user names a group to post into | optional | 4:5 | `genre-community-post.md` |
| `facebook-page` | facebook.com/<page> | the Page, asked only when the account manages more than one | optional | 4:5 | `genre-micro-post.md` |
| `linkedin` | linkedin.com | — | optional | 1.91:1 | `genre-micro-post.md` |
| `reddit` | reddit.com | subreddit | optional | 16:9 | `genre-community-post.md` |
| `lemmy` | any Lemmy instance | instance domain + community | optional | 16:9 | `genre-community-post.md` |
| `quora` | quora.com | defaults to a personal post from the home composer (`Post`, audience `Everyone`); ask only when the user names a Space | optional | 4:3 | `genre-community-post.md` |
| `tumblr` | tumblr.com | — | optional | 4:5 | `genre-micro-post.md` |
| `mastodon` | any Mastodon instance | instance domain | optional | 16:9 | `genre-micro-post.md` |
| `bluesky` | bsky.app | — | optional | 16:9 | `genre-micro-post.md` |
| `x` | x.com | — | optional | 16:9 | `genre-micro-post.md` |
| `threads` | threads.com | — | optional | 16:9 | `genre-micro-post.md` |
| `truthsocial` | truthsocial.com | — | optional | 16:9 | `genre-micro-post.md` |
| `bastyon` | bastyon.com | — | optional | 16:9 | `genre-micro-post.md` |
| `vk-wall` | vk.com | own wall or a community the user may post to | optional | 16:9 | `genre-micro-post.md` |
| `telegram` | t.me | channel or group | optional | 16:9 | `genre-micro-post.md` |
| `peerlist` | peerlist.io | — | optional | 16:9 | `genre-micro-post.md` |
| `minds` | minds.com | — | optional | 16:9 | `genre-micro-post.md` |
| `instagram` | instagram.com | — | required | 4:5 | `genre-micro-post.md` |
| `pinterest` | pinterest.com | board | required | 2:3 | `genre-micro-post.md` |
| `pixelfed` | pixelfed.social, or another Pixelfed instance | defaults to `pixelfed.social`; ask only when the account lives on another instance | required | 1:1 | `genre-micro-post.md` |
| `patreon` | patreon.com | — (visibility public/members is per-post: ask) | optional | 16:9 | `genre-micro-post.md` |
| `ko-fi` | ko-fi.com | — | optional | 1:1 | `genre-micro-post.md` |
| `buymeacoffee` | buymeacoffee.com | — | optional | 16:9 | `genre-micro-post.md` |
| `hackernews` | news.ycombinator.com | — | none supported | none | `genre-community-post.md` |
| `daily-dev` | daily.dev | defaults to a direct post from the personal profile (`New Post`, audience everyone); ask only when the user names a squad | optional | 16:9 | `genre-community-post.md` |
| `wonderful-dev` | wonderful.dev | — | optional | 16:9 | `genre-community-post.md` |
| `devto` | dev.to | — | optional | 16:9 | `genre-long-article.md` |
| `hashnode` | hashnode.com | publication, when posting to one rather than a personal blog | optional | 16:9 | `genre-long-article.md` |
| `hackernoon` | hackernoon.com | — | optional | 16:9 | `genre-long-article.md` |
| `medium` | medium.com | publication, when posting into one | optional | 16:9 | `genre-long-article.md` |
| `substack` | substack.com | defaults to the personal profile (`substack.com/@handle`, Create → Article, no email); ask only when the user names a publication to send from | optional | 16:9 | `genre-long-article.md` |
| `telegraph` | telegra.ph | — | optional | 16:9 | `genre-long-article.md` |
| `teletype` | teletype.in | blog, when the account has more than one | optional | 16:9 | `genre-long-article.md` |
| `blogger` | blogger.com | blog, when the account has more than one | optional | 16:9 | `genre-long-article.md` |
| `flipboard` | flipboard.com | magazine | optional | 4:3 | `genre-micro-post.md` |
| `livejournal` | livejournal.com | defaults to the personal journal; ask only when the user names a community | optional | 16:9 | `genre-long-article.md` |
| `dreamwidth` | dreamwidth.org | defaults to the personal journal (`Post to:`); ask only when the user names a community | optional | 16:9 | `genre-long-article.md` |
| `mewe` | mewe.com | defaults to the personal feed; ask only when the user names a group | optional | 16:9 | `genre-micro-post.md` |
| `youtube` | youtube.com | channel, when the account manages more than one | optional | 1:1 | `genre-micro-post.md` |
| `tiktok` | tiktok.com | — | required (photos) | 9:16 | `genre-micro-post.md` |
| `imgur` | imgur.com | — | required | 16:9 | `genre-micro-post.md` |
| `flickr` | flickr.com | — | required | 16:9 | `genre-micro-post.md` |
| `mataroa` | mataroa.blog | — | optional | 16:9 | `genre-long-article.md` |
| `github-gists` | gist.github.com | — | none supported (images by URL only) | 16:9 | `genre-long-article.md` |
| `deviantart` | deviantart.com | — | optional | 16:9 | `genre-long-article.md` |

A platform the user names that is not on this list is written for like any other — research it live in Phase 3, and add its row here plus a posting note in `awesome-content-publisher` rather than leaving the vocabulary split between a file and a conversation.

Out of scope, deliberately: a mailing tool whose only output is email (a newsletter sender, a self-hosted list). Publishing exists there, but nothing can be read back from a public page afterwards, and the pacing and duplicate rules these skills are built on do not map. A campaign that should also go to a list is written here and sent by the user's own mail tooling.

`substack` is on the list because a post there is a public page with a permalink that can be read back. The default path sends no mail at all: an Article published from the personal profile is a web page on `substack.com/@handle` and nothing lands in an inbox. Only the publication-plus-send path is irreversible, and it is entered by explicit choice, never by default — when it is chosen, audience, section and the send toggle are read back against the post file before submitting, and a duplicate there is not a downranked post but a second email in someone's inbox.

## What to verify live, per selected platform

- Post length cap, and whether it differs by account tier (X: free vs premium) or by instance (mastodon, pixelfed — the Pixelfed caption cap is an instance setting). A cap the composer does not enforce is still a cap: `peerlist` accepted a 495-character body and published it truncated mid-URL, so a platform whose composer shows no counter gets a deliberately short unit, and the published post is compared to the source afterwards, tail first.
- Media: which formats, whether mandatory, count limits per post.
- Links: clickable? auto-previewed? deprioritized by the feed? caption links dead (instagram)?
- Hashtag norms: how many read as native, where they are a separate field (tumblr tags), where they do not exist (reddit). The counts below are the starting point; the per-platform section and Phase 3 refine them.
- Editor: plain text / markdown / rich — decides what formatting survives.
- Promo and disclosure rules: platform-level policy plus the specific subreddit/group/community rules for the user's target.
- Publication gates: group admin approval, editorial review, automod.

## The hashtag table

Tag count is a platform property, not an author preference. The same tag block that lifts a Mastodon post suppresses an X post and is silently discarded by Instagram. So the campaign carries one tag set and each platform takes its own share of it, per the row below. `awesome-content-publisher` enforces these numbers at its pre-submit gate and asks the user before changing any post to satisfy them.

`Count` is tags on the finished post. `Where` is the structural fact — whether tags belong in the body, in the composer's own field, or nowhere — and that part is stable enough to rely on. The numbers marked (verified 2026-09) were researched against current platform guidance and published engagement data; every other row's count is a starting point that Phase 3 verifies live like any other volatile value.

| Slug | Count | Where | Why that number |
| --- | --- | --- | --- |
| `x` | 1–2 (verified 2026-09) | body, mid-post | The one platform where more tags cost reach. 1–2 outperforms zero by roughly a fifth; 3+ loses about as much again, and 5+ falls off a cliff. Zero is a miss, not a neutral choice. |
| `instagram` | 3–5 (verified 2026-09) | caption | Hard platform cap of five since 19 Dec 2025 — a sixth tag is not rejected, it is silently ignored, so a longer block is wasted text, not a penalty. |
| `linkedin` | 3–5 (verified 2026-09) | body, after the text | 3–5 measurably beats zero; 6+ adds almost nothing. |
| `mastodon` | 3–5 (verified 2026-09) | body, own line at the end | Hashtags are the discovery mechanism on the fediverse — there is no algorithmic feed to find the post otherwise. Zero means invisible. |
| `pixelfed` | 3–5 | caption | Fediverse discovery, the same as Mastodon's: no algorithmic feed, so a tag is how the post is found at all. The composer suggests tags as they are typed, which is convenient and leaves a dropdown sitting over the controls. |
| `bluesky` | 1–3 (verified 2026-09) | body | Clickable and real; up to eight accepted. Every tag spends part of the 300-character budget, so the budget, not the ceiling, sets the count. |
| `threads` | exactly 1 (verified 2026-09) | topic-tag field, no `#` | The platform allows one by design, and a tag may contain spaces. The campaign's set collapses to a single choice here. |
| `pinterest` | 2–5 (verified 2026-09) | description | Hashtags are secondary keyword signals now, not the discovery path — keyword-rich title and description do the work. 10+ reads as spam. |
| `facebook-wall`, `facebook-page` | 0–3 (verified 2026-09) | body | The platform where tags matter least; more than three actively costs engagement. |
| `tumblr` | 5–20 | tag field, never the body | Up to 30 accepted, only the first ~20 index, and the earliest carry the search weight. Tags in the body are a style error here. |
| `truthsocial`, `minds` | 3–5 | body | Mastodon-style discovery by tag. |
| `bastyon` | 3–5 | the composer's `Categories and tags` control | Tags are a field here, not body text. A trailing hashtag line does get auto-extracted into the category chips the Post button requires, but it also ships a line of hash-prefixed words the reader sees; fill the control instead and leave the body clean. |
| `vk-wall`, `telegram` | verify live | body | Tag culture varies by community and channel; check what the account's own audience does. |
| `devto` | up to 4 | front-matter `tags:` | A trailing `#tag` line in the body renders as an `<h1>` instead — it must move to the field. |
| `hashnode`, `medium`, `hackernoon`, `substack` | up to 5 | the platform's own tag/topic field | Medium's publish panel states the five-topic cap in the UI. A body tag line is not the mechanism on any of them. |
| `peerlist` | none — refused | — | The composer says so in words: *"We don't support hashtags (yet)."* A tag line must be dropped before submitting. |
| `reddit`, `lemmy`, `hackernews` | none | — | No hashtag system at all. Flair (reddit) and the title do this job; a tag block marks the post as imported spam. |
| `quora` | none | — | Topics attach to questions, not to posts, and the composer offers no tag field. A post is filed by the profile or the Space it went to. |
| `wonderful-dev`, `daily-dev` | none | — | Measured on published posts: body hashtags render as plain text with zero anchors on either platform, so a tag line indexes nothing and reads as an import. |
| `ko-fi`, `buymeacoffee`, `patreon` | 0–3 | the platform's own field | Each has one and the body has no tag line: ko-fi a comma-separated `Tags` row in the blog editor's sidebar, buymeacoffee a `Categories` block in the right rail, patreon `Add tags` beside the editor. Audience is existing supporters rather than search, so the count stays low. |
| `telegraph` | none | — | A plain publishing surface with no tag index to feed. |
| `teletype` | none in the body | the blog's own topics | Topics are categories the author creates on their blog and assigns in the editor. There is no tag index to feed, so a `#tag` line in the body indexes nothing and reads as an import from somewhere else. |
| `blogger` | none in the body | the post's Labels field | Labels are the blog's own categories, typed comma-separated in the Post settings sidebar; a `#tag` line in the body indexes nothing. |
| `flipboard` | none | — | A flip is a short comment on a link, an image or a thought inside a magazine, and the magazine is the topic; the platform carries no hashtag index. |
| `livejournal`, `dreamwidth` | none in the body | the entry's Tags field | Comma-separated tags with their own field and a journal-wide tag index; a body hashtag line reads as an import. |
| `mewe` | 3–5 | body | Hashtags are clickable and searched across the network, Mastodon-style; a post without them is found by contacts only. |
| `youtube` | 0–3 | body | Clickable inside a community post, but a channel post is read under the channel's name and more than three reads as spam there. Verify live. |
| `tiktok` | 3–5 | caption | Hashtags are the discovery path for a photo post and they spend the caption budget. Verify the caption cap live. |
| `imgur` | a few, in the post's tag field | the post's tag control | Tags are a separate control on the finished post; the description stays prose. Verify the ceiling live. |
| `flickr` | a few, in the Add tags panel | the uploader's Add tags panel | Tags live in the uploader's own panel and drive search; the description stays prose. Verify the ceiling live. |
| `mataroa` | none | — | A plain markdown blog with no tag index. |
| `github-gists` | none | — | A gist has no tag system, and a `#word` line renders as a Markdown heading rather than a tag. Discovery is the link, the author's gist list and search engines. |
| `deviantart` | a few, in the journal's tag field | the Submit dialog's tag control | Tags are a separate control in the Submit dialog; a body tag line reads as an import. Verify the ceiling live. |

Two rules bind the whole table. Tags never displace prose: where a cap forces a choice between a sentence and a tag, the tag goes. And a count is met by choosing from the campaign's one set, not by inventing platform-specific tags — the same post on three platforms should show recognisably the same tags, just more or fewer of them.

## Profiles

### facebook-wall
The personal timeline is the default surface, `facebook.com/<handle>`, and a group the user names is the same shape on somebody else's ground. Both are conversations among people who already know the author, which is why the post opens on the question and stays short of a pitch: the register is `genre-community-post.md`, not an announcement. Links auto-preview and hashtags carry little weight. Media optional.

A group adds what a timeline does not have: rules that gate promotion harder than platform policy does, and a moderation queue in many of them, so publication is not instant and the campaign does not assume it. The target is the group URL, collected in the interview; without one the post goes to the timeline.

### facebook-page
A brand surface: the post is published by the Page rather than by the person, it stands on its own, and it asks the reader nothing. Register is `genre-micro-post.md`. Only an account that manages a Page has this surface at all, and where it manages several the interview asks which; a user who named their own profile URL has answered a different question and gets `facebook-wall`.

The composer is a different flow from the timeline's, with an extra settings step before publishing and a promote control sitting next to it that opens a paid flow. `awesome-content-publisher` carries the observed detail; what matters here is that a Page post is a publication, so its copy carries the campaign's link and its own claim, where a wall post carries a question.

### linkedin
Professional register. The feed shows only the first lines before a "…see more" fold — the hook must land above it. Hashtags used in moderation; document links in the post body as the user prefers (folk practice varies; do not assert unverified algorithm claims). Media optional, images common.

Document posts, a PDF shown as swipeable pages, are LinkedIn's carousel; in Buffer's 2026 engagement data they were among the highest-engagement LinkedIn formats, though the page's own tables disagree on the figures, and it is correlation rather than cause. Offered as a media answer, never assumed.

### reddit
Title + body, markdown supported, no hashtags. Everything is per-subreddit: rules, flair (sometimes mandatory), automod filters, self-promotion limits (many subs enforce participation ratios). Marketing register is punished by design — posts must lead with value and disclose affiliation. Target detail required: subreddit; fetch and read its rules before writing.

Reddit refuses the agent's fetcher outright, on `www.reddit.com` and `old.reddit.com` alike, including the `about/rules.json` endpoint; retrying the URL or a mirror host does not change that. The rules are read through the user's own logged-in browser (the publisher's browser bridge) or the user confirms them; the run never records "rules read" on the strength of a fetch. Lemmy is the opposite case: its instance API answers plain fetches, and the community search and `community?name=` endpoints return the sidebar, the rules and the subscriber and post counts.

### lemmy
Federated link-and-discussion aggregator, reddit-shaped: title + markdown body or a link submission, per-community rules, no hashtags, votes and moderators. The instance is part of the address — `lemmy.world` is the largest but one among many, and a community name means nothing without it. Target detail required: instance domain and community; read that community's sidebar rules for self-promotion limits before writing, exactly as with a subreddit. Small, technically literate audience that reads marketing register as an intrusion.

The instance and the community are two different questions, and only the second one is usually open. A user with an account has exactly one instance, so once they have named it the run stops offering alternatives; what remains is which community on it. That list is read from the instance itself, never guessed, and Lemmy's own API answers it from a logged-in tab on that domain: `/api/v3/community/list?type_=Local&sort=TopAll&limit=50` for what the instance carries, and `/api/v3/search?q=<topic>&type_=Communities&listing_type=Local` for the ones matching this post's subject. Both return subscriber and post counts, so the options can be offered ranked by fit with the size that makes them choosable — on `lemmy.world` a post about a model release meets `technology` at 87k subscribers, `machinelearning` at 1.2k and `fosai` at 4.8k, and that spread is the actual decision. Offer the topical matches alongside the large general community, because the big one is not always the right room.

### quora
A post, not an answer. Three things can be written here — a question, an answer under somebody else's question, and a post — and a campaign publishes the third: the home composer's `Post` control opens Create Post, and its audience defaults to `Everyone`, which means the author's own profile rather than a Space. A Space is somebody else's room with its own moderators, and a non-contributor's submission there sits in an approval queue, so a Space is posted to by name and never on the run's initiative.

There is no title field, and that has a consequence the other platforms do not have: the permalink is built from the opening words of the body (`quora.com/profile/<handle>/<the first words of the post>`), so the first sentence is the headline, the URL and the feed preview at once.

The audience arrives from search, reading around a question rather than following the author, which is the same reason `reddit` and `lemmy` take the community register: explain the term where it is first used, and hand the thread back at the end. No hashtags.

### tumblr
Casual, personality-forward register. Tags are a separate field, not inline hashtags, and drive discovery. Long or short both native; images and GIFs at home here.

A post here carries one featured image, at the very top, directly under the title — that is what this author's own posts do, and a text-only Tumblr post looks stripped next to them. The block editor takes an image block; adding it is a composer step, not a front-matter field.

Links are applied, not typed. The block editor does not linkify a pasted URL, so a bare address publishes as dead text. Select the words that should carry the link and use the popover that appears over a selection.

### mastodon
Federated — the cap and culture depend on the user's instance; verify on that instance, not on defaults. No engagement algorithm: hashtags are the discovery mechanism. Content-warning conventions matter for promo-adjacent posts. Target detail required: instance domain.

Ask it as a default plus an escape hatch, never as a menu of instances. `mastodon.social` (or whichever the user has already named) and `another server, I will type it` are the two options. A list of three or four instances the user has no account on is a quiz with no right answer visible from inside the question, and picking one of them wrongly sends the run's caps research to a server they cannot post from.

### bluesky
Short posts, hard cap (verify current), no markdown. Link cards from pasted URLs; threads for anything longer. Casual, tech-adjacent culture.

Hashtags work and are clickable, and the platform accepts up to eight — which is a ceiling, not a target. Every tag also spends part of the 300-character budget, so two or three from the campaign's set is the practical share here. Shipping a Bluesky post with none is a miss, not a style choice.

### x
Short posts; cap differs sharply by account tier — verify which tier the user has before writing a single post. Reply chains are the native long form. Media boosts reach.

Hashtags: one or two — never three, and never zero. This is the one platform where more tags measurably cost reach rather than adding it: one to two beats an untagged post by roughly a fifth, three or more gives that back, and five or more falls off a cliff. So `x` takes the top one or two tags of the campaign's set and drops the rest; it does not get the fuller block that `mastodon` and `instagram` carry. Zero is a miss too — it is the cheapest reach on the platform left unclaimed, so a post that arrives untagged gets one or two added rather than shipped bare. Two beats one where a second tag is genuinely apt; one beats two where the second would be filler. Place them inside the sentence they belong to rather than as a trailing block, and never open the post with one. Make sure the cap trim never leaves half a tag at the end.

### threads
Meta's text feed, bound to an Instagram account: the handle and the login are Instagram's, so wherever an Instagram presence exists a Threads one usually does too — check for it rather than assuming its absence. Conversational register close to `x`. Unlike Instagram, links in the post body are clickable and media is optional. Verify the current character cap and which domain the account answers on.

Threads has topic tags, not hashtag blocks, and takes exactly one per post — the platform caps it there deliberately to keep tag spam down, and a tag may contain spaces. So this is the one platform where the campaign's tag set collapses to a single choice: pick the tag closest to the post's subject and drop the rest. A block of five hashtags copied from the `mastodon` version is wrong here, and zero tags is a miss.

A post can also carry a text attachment of up to 10,000 characters with a prominent link (TechCrunch, 4 September 2025). The attachment is not indexed by search engines and not federated, so fediverse readers see only the post itself: the post carries the point, the attachment the long version.

### truthsocial
Mastodon-derived microblog with its own single network — short posts, media optional, links clickable. Politically homogeneous audience whose interests rarely overlap a technical product's; say so if the user selects it for a product with no fit rather than writing copy that will land as noise. Verify the current character cap and media specs live: the fork's numbers are not Mastodon's.

### wonderful-dev
Developer community feed. Small platform whose conventions are best read from its live feed during Phase 3 — check what natives post, length norms, and code-snippet support before writing.

### hackernoon
Long-form article platform with editorial review — a submitted draft is not a published post, and the campaign schedule must treat it as submission time, not publication time. Markdown editor. Frequency: articles per campaign, never per day.

The story description the editor demands before submission is capped at 160 characters and says so only as an overshoot (`269 of 160`). Write it at 160 or under here, in the post file, rather than leaving the publishing stage to cut the author's sentence at a composer it cannot scroll to.

### devto
Long-form markdown articles with front-matter tags and canonical-URL support (set it if the article mirrors the user's blog). Community norms favor tutorials and experience reports over announcements; an announcement dressed as neither reads as spam. Frequency: articles per campaign.

`cover_image` in the front matter is not the article's image. It renders on the feed card and above the title, and a reader scrolling the article itself can miss it entirely — it also takes no alt text. The image belongs in the body, as the first element under the title, written as ordinary markdown with real alt text: `![<alt>](<uploaded url>)` on the line after the front matter, before the first `##`. Setting `cover_image` as well is fine and normal; setting only `cover_image` ships an article whose picture is not in it.

Get the URL from dev.to's own uploader: the editor's `#image-upload-field` accepts the file and returns a hosted `dev-to-uploads.s3.amazonaws.com/uploads/articles/…` URL. That URL is what goes into both the markdown and `cover_image` — the local path is meaningless once published.

The title is slugged into the permalink, so the 50–60 character rule in `genre-long-article.md` is a URL rule here as much as a headline one.

### hackernews
`news.ycombinator.com`. A submission, not a post: one global ranked feed, no hashtags, no media, no formatting beyond plain paragraphs and links. The title carries almost everything and marketing phrasing sinks a submission on sight — the site's own guidelines ban editorializing titles. A self-authored product goes up as `Show HN: <what it is>`, which has its own rules (working thing, author present in the comments). Frequency is per campaign at most, never per day. Verify the current title cap and the Show HN rules live.

A submission is title + URL or title + text, never both — that is the site's own rule, and its stated reason is to stop people putting their commentary in a privileged position above the comments. So HN is not a link-only platform: a text submission is a first-class form, and `Ask HN` exists precisely because text posts do. The FAQ's wording: *"You can't. This is to prevent people from submitting a link with their comments in a privileged position at the top of the page. If you want to submit a link with comments, just submit the link, then add a regular comment."*

Which form this campaign uses is a decision, not a default. A link submission points at somebody else's page and the title must be that page's own title, unedited. A text submission is the campaign's own writing and is the right form when the piece has something of its own to say — but it must then read as a discussion opener, not as a post pasted from a feed.

When the URL is already on HN, a link submission is not a duplicate post — it is a vote. The form redirects to the existing item and registers an upvote from the account, an outward-facing side effect nothing asked for. Search `hn.algolia.com` before submitting. Found, and the existing item drew real attention (the FAQ tolerates reposting only where a story "has not had significant attention in the last year or so") → the honest options are a text submission that stands on its own, or skipping; say which, and never let the run cast the vote as a side effect of trying to post.

### patreon
Posts address existing supporters — the register is an update to insiders, not a cold ad. Public vs member-only visibility is a per-post choice; ask. Medium prose, media friendly.

The image is the post's image, never an attachment. Patreon's editor has two homes for a file and they look interchangeable: the media block in the post body, and the Attachments list in the sidebar. Only the first one is the picture readers see; the second publishes the file as a download link sitting under the post, so a run that touches both ships the same image twice — once as the visual and once as a stray `v02.png` for supporters to download. Put the image in the body block, and leave Attachments empty unless the post file genuinely asks for a downloadable file.

### ko-fi
Supporter feed, short updates, images common. Same insider register as patreon.

The image is part of the post and has to be attached before submitting. The quick-update composer takes one, and a text-only supporter update stands out against this author's own feed where other posts carry pictures. If the image control cannot be reached in the composer that opened, that is a reason to look again at the composer rather than to ship without it — see the posting notes for the route.

### buymeacoffee
Supporter posts, same family as ko-fi: short, personal, update-flavored.

A post here is a small formatted article, not a status line. The composer is a rich editor with bold, italic, underline, headings, lists, quotes, code blocks, an image control and a link control, so the post carries a picture at the top and a real clickable link where it points at something. Writing it as plain text with a bare URL wastes every affordance the platform gives and ships a post that looks unfinished next to the author's own.

### instagram
Image or video required — no media, no post. Caption links are not clickable ("link in bio" is the native CTA phrasing). Web composer exists at instagram.com. Verify caption cap and current media specs.

Five hashtags is a hard cap, not a norm (since 19 Dec 2025). A sixth is not an error and does not block the post — it is silently ignored, so an old-style twenty-tag block publishes as five working tags plus fifteen tags' worth of dead text in the caption. Three to five specific tags is the platform's own stated advice. A caption arriving with more gets trimmed to its best five before submitting.

The composer opens from the sidebar, not from a URL. `instagram.com/create/…` paths are not the app's own route to the composer and land on unrelated shells; the entry point is the `+` in the left sidebar, then the `Post` entry that appears under it. The dialog that opens accepts PNG among other formats — a run that reached a route accepting `image/jpeg` only has gone in the wrong door, and converting the file is treating the symptom.

A carousel of several images in one post outperformed single images in Buffer's 2026 engagement data; like the LinkedIn figure, that is correlation, so it is offered, never assumed.

### pixelfed
Image or video required — the composer will not submit without one, exactly like `instagram`. Federated Instagram-shaped platform on ActivityPub: no algorithmic feed, so hashtags, the instance's own discover surface and whoever follows the account are the whole distribution. `pixelfed.social` is the flagship instance and the default target; another instance is a different server with its own caption cap, media limits and moderators, so the target says which one when the account is not there. Media descriptions (the platform's alt text) are per file and set on the upload step.

The caption cap is an instance setting rather than a platform constant — the default build ships 500 characters and instances raise it — so it is read off the composer's own counter in Phase 3 for the instance the account is on, and never carried over from another one. Links in a caption are live here, which is the one thing that separates a Pixelfed caption from an Instagram one: a "link in bio" CTA written for Instagram is a wasted line on this platform.

### bastyon
Decentralized platform; account identity is a key pair and login flows differ from mainstream platforms. Crypto/free-speech-adjacent culture. Verify caps and media support live — documentation is thin, the live UI is the source of truth.

### pinterest
A pin is image + title + description + destination link, filed to a board. Image required. Target detail required: board. Discovery is search-driven — the description carries keywords, not hashtag walls.

The description is sentences, and it ends as a sentence. Search-driven does not mean keyword-stuffed: a description that trails off into `Claude Code parallel sessions, git worktrees, cross-session messaging, AI coding workflow.` is a comma-separated word list wearing a full stop, and it reads as machine output to the one person who actually opens the pin. Write the description as prose that stands on its own, and if the keywords matter put them where keywords belong — the pin's own tag field, or a short hashtag line — not welded onto the last sentence.

Two to five hashtags, and they are a secondary signal. Pinterest indexes them as keywords but no longer routes discovery through them; the title, the description and the board name carry the ranking. Ten or more reads as spam and can cost distribution. A pin with none is not broken — it is a small miss worth two or three tags.

### vk-wall
Wall posts, medium prose, hashtags in use, images common. A personal wall and a community differ in tone and in who may post — target detail required: which one.

### telegram
A channel or group broadcast rather than a social feed: no ranking algorithm and no discovery surface, so subscribers see every post in order and frequency is felt directly — over-posting reads as noise here faster than on an algorithmic feed. Clickable links with previews that can be suppressed, light markup, media optional. Publishing needs admin rights on the target. Target detail required: channel or group. Verify the current message cap and the media-caption cap, which are not the same number.


### hashnode
Developer blogging platform: markdown articles with tags, a cover image and canonical-URL support (set it when the article mirrors the user's own blog). An article can go to the author's personal blog or to a publication, and those differ in audience and in who reviews. Community norms match `devto` — tutorials and experience reports over announcements. Frequency: articles per campaign, never per day. Target detail required when posting into a publication.

### peerlist
Developer profile network: a feed of short posts attached to a public professional profile, closer to `linkedin` in register than to `x`. The audience is other developers and the people hiring them, so shipped work and how it was built read native, and marketing cadence does not. Composer is a dialog with an optional title field plus a body. The body cap is 480 characters and the composer now counts down from it — a later run watched the counter go 480 → 470 on a ten-character probe, where an earlier one saw a 495-character body published silently truncated two characters into its closing URL. Treat 480 as hard, keep the unit near 400 so the trim never reaches the link, and compare the published tail against the source anyway. The composer also refuses hashtags in as many words — it prints *"We don't support hashtags (yet)"* beside the editor — so a unit written for this platform carries none at all. Small platform otherwise — read the live feed during Phase 3 for length norms and whether the composer supports anything beyond plain text.

### daily-dev
Developer news aggregator. The default is Direct Posting from the personal profile, audience everyone, no squad involved.

Community Picks no longer exists. It was sunset in 2025 and replaced by Direct Posting: `New Post` (or the `+` control) anywhere on `daily.dev`, and the contribution lives under the author's own name on their profile, which is where reputation and followers accrue. Anything in this file or elsewhere that still describes a separate submission mechanism is describing a feature that was removed. Source: `docs.daily.dev/docs/key-features/community-picks`.

Two shapes the composer offers, both from the profile. An original post is written on daily.dev itself, title plus body, and the editor takes Markdown and code blocks. A link post points at an article already published on the author's own site. Where the composer asks for an audience, choose everyone rather than a squad. Adding a personal blog as an automatic Source is not an option any more: daily.dev stopped accepting personal blogs as sources and points authors at Direct Posting or their own squad instead.

A squad is opt-in and is not the default. It is a community with its own rules and moderators, worth having only when the user intends to run a topical room regularly. When one is named, the options are the user's own joined squads, read from their account: a signed-in `daily.dev` lists them in the sidebar under `My Squads` and on `daily.dev/squads/discover`. A run cannot know from outside whether someone belongs to `AI`, `WebDev` or nothing at all, and a post filed to a squad they never joined does not publish. Featured squads there are joinable, but joining is the user's decision, so they are mentioned rather than selected.

Content has to be for developers, and the guidelines are enforced by ranking and removal (`docs.daily.dev/docs/for-content-creators/content-guidelines`). Personal subjects are fine when the lesson is a developer's: why a browser extension got built, the mistakes made launching a SaaS, losing motivation after a big project, what seven years of shipping own products taught, why a complex architecture was abandoned, burnout, job hunting, learning to program. Off-limits by relevance: travel, pets, crafts, relationships, domestic anecdotes, politics, anything with no line back to development. Also prohibited outright: non-English material, political content, pure advertising, clickbait, programmatic-SEO output, and content from sources dormant three months or more.

A post about the author's own product survives only in one shape: problem, then their experience, then the decisions taken, then what went wrong, then concrete conclusions, and a short product link at the end. "I built a service, sign up here" reads as advertising and is treated as such.

One rule collides with what these skills do, and the run says so out loud rather than discovering it in a takedown. daily.dev prohibits AI-generated content, and states plainly that it prioritises human insight and lived experience. A post drafted by an agent and shipped unedited is against that rule whoever pressed publish. So `daily-dev` selected in the interview earns one line back to the user: the platform bans machine-written posts, the draft here is a starting point they are expected to rewrite in their own voice and from their own experience, and publishing it as-is risks downranking or removal of the post and reputational damage to the account. The user decides; the run never quietly ships into that rule, and never claims the text will pass as human.

### medium
General-purpose article platform with a rich editor rather than raw markdown. An article can sit on the author's own profile or be submitted to a publication, which routes it to that publication's editors and their schedule — submission is not publication, and the campaign must not treat it as such. Canonical-URL support matters when the piece also lives on the user's blog. Some articles sit behind the platform's paywall; whether the user's do is an account setting to confirm, not to assume.

Two things the rich editor will not do for you, and both ship as visible defects. A pasted URL stays plain text, so the closing link publishes as dead characters unless the words are selected and the editor's own link control is applied to them. And the image is inserted through the editor: put the caret on an empty line, use the `+` control that appears in the left margin, choose the image option, and pick the file — there is no cover field to fall back on, so an article with no in-body image ships with no image at all.

The title is slugged into the permalink, so a two-sentence title becomes an unreadable URL; keep it inside the 50–60 character rule.

Its autocorrect rewrites `--` into an em dash. That silently corrupts any command-line flag in the prose (`claude --worktree` publishes as `claude — worktree`) and drops an em dash into text the campaign forbids them in. Write the short form of the flag where one exists, or check the body for `—` before publishing and repair it by replacing the whole paragraph.

### minds
Open-source social network with a crypto-adjacent, free-speech-forward culture and a small technical audience. A post is a short feed entry with optional media and clickable links; the composer sits at the top of the newsfeed. Accounts carry a token/reward layer that has nothing to do with posting — never touch wallet, boost or monetisation controls, and never enter a paid Boost flow, which sits next to the post button. Verify the current character cap live.

### telegraph
Telegram's throwaway publishing surface: title, author and body in one page, no account required and no dashboard. That is the catch worth stating — a `telegra.ph` page is editable only from the browser that created it, through a local token, so a page published from an automation session cannot be edited later from another machine. Nothing is discoverable on the platform itself: a Telegraph page has no feed and no audience, so it exists to be linked from somewhere else.

It is a formatted page, not a plain-text one, and an article shipped here without formatting is a defect. The editor is rich text with a floating toolbar, and the page format accepts a fixed tag list: `a`, `aside`, `b`, `blockquote`, `br`, `code`, `em`, `figcaption`, `figure`, `h3`, `h4`, `hr`, `i`, `iframe`, `img`, `li`, `ol`, `p`, `pre`, `s`, `strong`, `u`, `ul`, `video`. So an article gets real headings, and exactly two levels of them — `h3` is the section heading and `h4` the subordinate one, with `h1` and `h2` simply not available. Bold, italic, blockquote, lists, code and horizontal rules are all on the table above.

Markdown syntax is not the input. The body is rich text, so typing `## Where it breaks` publishes the literal hash characters; a heading is made with the editor's own controls, and links are inserted as links rather than written as `[text](url)`.

### teletype
A blogging platform where an article lives on the author's own blog at `teletype.in/@handle`, with drafts, comments, a share image and a custom domain for accounts that set one up. Several people can write into one blog, so an account can be a personal journal or a shared one — the target says which blog when there is more than one.

Topics are the author's own categories, created on the blog and assigned to the article; they are not hashtags and there is no platform-wide tag index behind them. Discovery is thin the way `telegraph` is thin: a Teletype article is the page other posts point at, not a post that finds its own readers. Unlike `telegraph`, it is tied to an account, so the article stays editable from anywhere the user is signed in.

The editor is a rich one with its own formatting controls. Whether it converts typed markdown is the one thing to check live before a body goes in, because the failure is silent and permanent-looking: a pasted `## Heading` that does not convert publishes as visible hash characters.

### blogger
Google's blog host: the editor at `blogger.com` writes to a blog published at `<name>.blogspot.com` (or a custom domain), and an account can own several blogs, which is the only target question. Opening `New Post` creates a draft on the spot, so an interrupted run leaves one in the Posts list under `Draft`, to be finished or deleted before a retry. The editor has two views, a rich Compose view and an `HTML view`, and a formatted article goes in through the HTML view rather than through typed markdown, which the Compose view treats as literal text. Labels are the blog's categories and live in the sidebar, not in the body; the sidebar also carries the publish date (a future date schedules), the permalink and a per-post options panel.

### flipboard
A social magazine: a `flip` is a card inside one of the account's magazines, carrying a short comment plus a link, an image or the text alone, and every flip is filed into a magazine chosen first. Target detail required: the magazine, because the compose dialog opens on `Pick a Magazine` and will not go further without one. The card is what readers see in the feed, so a flip is a caption, not an article: a sentence or two of the author's reading and the URL that carries the piece. No hashtags exist here; the magazine is the topic.

### livejournal
The classic journal platform: an entry lives at `<journal>.livejournal.com/<id>.html`, with a title, a block editor for the body, comma-separated tags in their own field, a security level and a mood. The title field is capped at 100 characters and says so with a live counter. Communities are journals other people moderate, with their own rules and a queue where moderation is on; a post goes to the personal journal unless the user names a community. Long-form is native here, and an entry the length of a short article is normal, not conspicuous.

### dreamwidth
LiveJournal's open-source sibling, with the same shape: a personal journal at `<journal>.dreamwidth.org`, entries with a subject, tags, a security level (`Everyone (Public)`, `Access List`, `Private`) and communities that need to be named to be posted to. The update form is a plain HTML form with a `Rich Text` / `HTML` toggle on the body, and the HTML mode accepts a fixed set of tags with an auto-formatting rule that turns line breaks into paragraphs unless it is switched off. Small, literate, fandom-heavy audience that reads marketing register as an intrusion; the community register from `reddit` and `lemmy` is the right one.

### mewe
A Facebook-shaped network with no advertising feed: a post goes to the personal feed (`My World`) from the composer that opens on `How is your day going?`, or into a group the user names. The audience control sits on the composer (`Anyone` by default) and is left alone. Hashtags are clickable and searched across the network, so a post carries a few. The composer also offers a tip-jar `Lock Content` toggle beside the post controls, and that is a monetisation setting the run never touches. Verify the character cap live; the composer shows no counter.

### youtube
Channel posts, the text-and-image cards that appear on a channel's `Posts` tab and in subscribers' feeds. A post is up to 10,000 characters, which the composer enforces with a counter, but the native length is a short paragraph or two: a card, not an article. It takes one image, an image poll, a text poll, a quiz, or an existing video from the channel, and it can be scheduled from the action menu next to `Post`. Which channel is the only target question, and only for accounts that manage more than one. Hashtags are clickable inside a post and a handful is the norm. Media supported: still images and the channel's own videos; a video upload is a different product and not this slug.

### tiktok
Photo posts through TikTok Studio, the web uploader at `tiktok.com/tiktokstudio/upload` on its `Photos` tab: up to 35 photos per post, 50 MB each, JPG, JPEG, PNG or WebP, with 16:9, 4:3 and 3:4 as the recommended ratios. Media is required and the post is the pictures; the caption carries the point and the hashtags, and hashtags are how a photo post is found. The caption field, its cap and the audience control render only after the photos are in, so they are verified live on the first run and recorded in the platform cache. A video is a different upload and not this slug.

### imgur
An image host with a community feed: a post is one or more images with a title, a per-image description and tags, and it is either hidden (the default, reachable by link) or posted to the community, which is the explicit and outward-facing step. Media is required and the uploader accepts stills, GIFs and short video. The community reads as a meme feed with a technical minority, so a post that lands there is the picture plus a two-line caption, never an article; the description supports plain text and links.

### flickr
A photo platform first and a social one second: the uploader at `flickr.com/photos/upload/` takes photos and videos, gives each a title and a description, and files them with tags, albums and groups from a sidebar before one `Upload` control finishes the batch. Media is required. A free account carries a lifetime quota that the uploader states on its own page (`You can upload N more photos and videos`), and that number is the thing to watch before a run. Groups are other people's rooms with their own rules; a post goes to the photostream unless the user names a group.

### mataroa
A minimal paid blogging host: a blog at `<blog>.mataroa.blog`, posts written in markdown in a plain form with a title, a publication date and a body, images added by dragging into the body. An empty date keeps the post as a draft and a future date schedules it, which is the whole scheduling mechanism. No tags, no feed, no comments unless enabled; the post exists to be linked from elsewhere, the way `telegraph` and `teletype` do, but it stays editable from any signed-in session.

### github-gists
A public gist as a standalone page: one `.md` file in a git repository with a web view that renders Markdown, at `gist.github.com/<handle>/<id>`. It is the surface a developer audience reads a technical note on, and the most code-friendly one in the table: full fenced blocks with their language, tables, headings and inline links all render, and nothing is trimmed for a feed because there is no feed.

Three fields make the post. The **description** is the title a reader meets in a gist listing and in a search result. The **filename including extension** decides how the file renders, so a post is `<kebab-case-title>.md` and never anything else, since a missing or wrong extension publishes the Markdown as plain text. The **content** is the document itself, opening with its own `#` heading, the way the author's own gists are written.

Public is a choice, not the default, and it is the one thing to get right here: the composer's primary button reads `Create secret gist`, and a public gist needs the type selector opened and `Create public gist` chosen first. A secret gist is not private, it is unlisted, so publishing one by accident does not leak the post; it simply never reaches anyone.

No tags, no attachments through the web composer (an image is referenced by absolute URL), no comments feed to seed, and no edit-by-URL: a gist is a git repository, so a second attempt creates a second gist rather than replacing the first. The post is committed under the account's commit email, which the composer shows.

### deviantart
An art community whose journals are long-form posts under the account's name: `studio/journals` opens `Start a Draft`, and the `Submit a journal` dialog takes a visibility setting, an optional cover image, a title with a read-time estimate, a rich body and tags. `Save to Studio` keeps a draft and `Submit` publishes; the Studio lists drafts and a `Scheduled` tab. The audience is artists and fans, so a technical post reads as a guest here unless it is about the art or tooling they use; say so when the user selects it for a product with no fit. Status updates and literature are different submission types and not this slug.

### substack
Two different surfaces share one slug, and the default is the one that sends no email.

The personal profile is the default target. Substack's own help puts it plainly: "On Substack, you can publish from your profile and website." Every account gets a profile at `substack.com/@handle` with a `Create` menu offering `Note`, `Article`, `Video`, `Podcast` and more, and an Article published there is a web page on that profile with a permalink. No newsletter goes out, no subscriber inbox is touched, and no publication has to exist — an account that has never made one publishes this way. That is the path a repurposed article takes unless the user says otherwise, and it needs no target detail, because the profile is not a thing to choose between.

Same two editor traps as `medium`, on both surfaces. A pasted URL does not become a link — select the words and use the `Link` control in the top toolbar. The image is inserted from that toolbar too: caret on an empty line, the image icon, then `Image`, then the file. Neither happens by writing markdown, and an article that skips them publishes with a dead URL and no picture.

The publication path is opt-in and it is the irreversible one. An account that runs a publication can publish there instead and send the post to subscribers, and a sent issue cannot be recalled: subscribers feel frequency directly, sections and paywalled tiers decide who receives what, and a duplicate is a second email rather than a downranked post. Enter it only when the user names the publication and asks for the send, and then read back audience, section and the send toggle against the post file before submitting.

So the interview does not ask "which publication?" by default, and it certainly does not ask it every run. That question is unanswerable for the common case — an account with a profile and no publication has nothing to name, so the only honest answers left are "drop it" or a typed guess. Ask instead only when the user has said they want the newsletter send, or when the account is known to run more than one publication.
