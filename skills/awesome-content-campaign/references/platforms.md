# Platforms — the canonical vocabulary, structural notes, and the live-verify checklist

**This file is the single source of the platform vocabulary.** The slugs below are what the interview offers, what filenames carry, and what `awesome-content-publisher` parses; adding a platform means adding a row here and a posting note in that skill's `references/platform-posting.md`, in the same change. No other file restates the list.

Structural facts here are stable (what a platform *is*); everything volatile — character caps, media size limits, per-tier differences, algorithm behavior — is deliberately absent and MUST be verified live in Phase 3, recorded in the manifest with a checked-on date.

Every platform on the list is reached as a website in a logged-in browser — `awesome-content-publisher` drives the real web UI through the Playwright MCP bridge and uses no platform APIs, developer apps, bots or webhooks. So Phase 3 verifies what the **web composer** does: a cap the mobile app enforces differently, a feature only the desktop client has, or an API-only capability is not what the posts must fit.

## The canonical table

`Target` is the detail posting requires and the interview must collect (Phase 2); a post reaching the publisher without it is a publication blocker. `Media` marks the platforms that cannot post without an attachment. `Genre` names the register file Phase 5 writes against.

| Slug | Target the interview must collect | Media | Genre file |
| --- | --- | --- | --- |
| `facebook-wall` | Page URL or personal-timeline URL (ask which — different surfaces, different tone) | optional | `genre-micro-post.md` |
| `facebook-group` | group URL | optional | `genre-community-post.md` |
| `linkedin` | — | optional | `genre-micro-post.md` |
| `reddit` | subreddit | optional | `genre-community-post.md` |
| `lemmy` | instance domain + community | optional | `genre-community-post.md` |
| `tumblr` | — | optional | `genre-micro-post.md` |
| `mastodon` | instance domain | optional | `genre-micro-post.md` |
| `bluesky` | — | optional | `genre-micro-post.md` |
| `x` | — | optional | `genre-micro-post.md` |
| `threads` | — | optional | `genre-micro-post.md` |
| `truthsocial` | — | optional | `genre-micro-post.md` |
| `wonderful-dev` | — | optional | `genre-community-post.md` |
| `hackernoon` | — | optional | `genre-long-article.md` |
| `devto` | — | optional | `genre-long-article.md` |
| `hackernews` | — | none supported | `genre-community-post.md` |
| `patreon` | — (visibility public/members is per-post: ask) | optional | `genre-micro-post.md` |
| `ko-fi` | — | optional | `genre-micro-post.md` |
| `buymeacoffee` | — | optional | `genre-micro-post.md` |
| `instagram` | — | **required** | `genre-micro-post.md` |
| `tiktok` | — | **required** (video) | `genre-micro-post.md` |
| `pinterest` | board | **required** | `genre-micro-post.md` |
| `bastyon` | — | optional | `genre-micro-post.md` |
| `vk` | wall or community | optional | `genre-micro-post.md` |
| `telegram` | channel or group | optional | `genre-micro-post.md` |
| `discord` | server + channel | optional | `genre-community-post.md` |
| `slack` | workspace + channel | optional | `genre-community-post.md` |
| `youtube` | channel, when the account has more than one | **required** for uploads (video); optional on the Community tab | `genre-micro-post.md` |
| `google-business` | the business profile or location, when the account manages several | optional | `genre-micro-post.md` |
| `nostr` | the web client the user posts through | optional | `genre-micro-post.md` |
| `hashnode` | publication, when posting to one rather than a personal blog | optional | `genre-long-article.md` |
| `wordpress` | site URL (wordpress.com or self-hosted) | optional | `genre-long-article.md` |
| `whop` | whop + feed or channel | optional | `genre-community-post.md` |

A platform the user names that is not on this list is written for like any other — research it live in Phase 3, and add its row here plus a posting note in `awesome-content-publisher` rather than leaving the vocabulary split between a file and a conversation.

**Out of scope, deliberately:** sending to an email list (a newsletter tool, a self-hosted sender). Publishing exists there, but the medium is not a feed — consent and unsubscribe obligations govern it, nothing can be read back from a public page afterwards, and the pacing and duplicate rules these skills are built on do not map. A campaign that should also go to subscribers is written here and sent by the user's own mail tooling.

## What to verify live, per selected platform

- Post length cap, and whether it differs by account tier (X: free vs premium) or by instance (mastodon).
- Media: which formats, whether mandatory, count limits per post.
- Links: clickable? auto-previewed? deprioritized by the feed? caption links dead (instagram)?
- Hashtag norms: how many read as native, where they are a separate field (tumblr tags), where they do not exist (reddit).
- Editor: plain text / markdown / rich — decides what formatting survives.
- Promo and disclosure rules: platform-level policy plus the specific subreddit/group/community rules for the user's target.
- Publication gates: group admin approval, editorial review, automod.

## Profiles

### facebook-wall
Personal or page timeline. Short-to-medium conversational prose; links auto-preview; hashtags carry little weight. Media optional. Page vs personal profile differ in tone expectations — ask which the target is.

### facebook-group
A post into a community someone else moderates. Group rules gate promo harder than platform policy does; many groups queue posts for admin approval — publication is not instant and the campaign should not assume it. Target detail required: group URL. Value-first register; blunt ads get declined.

### linkedin
Professional register. The feed shows only the first lines before a "…see more" fold — the hook must land above it. Hashtags used in moderation; document links in the post body as the user prefers (folk practice varies; do not assert unverified algorithm claims). Media optional, images common.

### reddit
Title + body, markdown supported, no hashtags. Everything is per-subreddit: rules, flair (sometimes mandatory), automod filters, self-promotion limits (many subs enforce participation ratios). Marketing register is punished by design — posts must lead with value and disclose affiliation. Target detail required: subreddit; fetch and read its rules before writing.

### lemmy
Federated link-and-discussion aggregator, reddit-shaped: title + markdown body or a link submission, per-community rules, no hashtags, votes and moderators. The instance is part of the address — `lemmy.world` is the largest but one among many, and a community name means nothing without it. Target detail required: instance domain and community; read that community's sidebar rules for self-promotion limits before writing, exactly as with a subreddit. Small, technically literate audience that reads marketing register as an intrusion.

### tumblr
Casual, personality-forward register. Tags are a separate field, not inline hashtags, and drive discovery. Long or short both native; images and GIFs at home here.

### mastodon
Federated — the cap and culture depend on the user's instance; verify on that instance, not on defaults. No engagement algorithm: hashtags are the discovery mechanism. Content-warning conventions matter for promo-adjacent posts. Target detail required: instance domain.

### bluesky
Short posts, hard cap (verify current), no markdown. Link cards from pasted URLs; threads for anything longer. Casual, tech-adjacent culture.

### x
Short posts; cap differs sharply by account tier — verify which tier the user has before writing a single post. Reply chains are the native long form. Hashtags in moderation; media boosts reach.

### threads
Meta's text feed, bound to an Instagram account: the handle and the login are Instagram's, so wherever an Instagram presence exists a Threads one usually does too — check for it rather than assuming its absence. Conversational register close to `x`. Unlike Instagram, links in the post body are clickable and media is optional. Verify the current character cap and which domain the account answers on.

### truthsocial
Mastodon-derived microblog with its own single network — short posts, media optional, links clickable. Politically homogeneous audience whose interests rarely overlap a technical product's; say so if the user selects it for a product with no fit rather than writing copy that will land as noise. Verify the current character cap and media specs live: the fork's numbers are not Mastodon's.

### wonderful-dev
Developer community feed. Small platform whose conventions are best read from its live feed during Phase 3 — check what natives post, length norms, and code-snippet support before writing.

### hackernoon
Long-form article platform with **editorial review** — a submitted draft is not a published post, and the campaign schedule must treat it as submission time, not publication time. Markdown editor. Frequency: articles per campaign, never per day.

### devto
Long-form markdown articles with front-matter tags and canonical-URL support (set it if the article mirrors the user's blog). Community norms favor tutorials and experience reports over announcements; an announcement dressed as neither reads as spam. Frequency: articles per campaign.

### hackernews
`news.ycombinator.com`. A submission, not a post: title plus URL (or title plus text), one global ranked feed, no hashtags, no media, no formatting beyond plain paragraphs and links. The title carries almost everything and marketing phrasing sinks a submission on sight — the site's own guidelines ban editorializing titles. A self-authored product goes up as `Show HN: <what it is>`, which has its own rules (working thing, author present in the comments). Frequency is per campaign at most, never per day; reposting the same URL is filtered. Verify the current title cap and the Show HN rules live.

### patreon
Posts address existing supporters — the register is an update to insiders, not a cold ad. Public vs member-only visibility is a per-post choice; ask. Medium prose, media friendly.

### ko-fi
Supporter feed, short updates, images common. Same insider register as patreon.

### buymeacoffee
Supporter posts, same family as ko-fi: short, personal, update-flavored.

### instagram
Image or video **required** — no media, no post. Caption links are not clickable ("link in bio" is the native CTA phrasing); hashtag blocks are native. Web composer exists at instagram.com. Verify caption cap and current media specs.

### tiktok
Video **required**; caption short. Web upload exists. A campaign without video content excludes this platform rather than faking it.

### bastyon
Decentralized platform; account identity is a key pair and login flows differ from mainstream platforms. Crypto/free-speech-adjacent culture. Verify caps and media support live — documentation is thin, the live UI is the source of truth.

### pinterest
A pin is image + title + description + destination link, filed to a board. Image required. Target detail required: board. Discovery is search-driven — the description carries keywords, not hashtag walls.

### vk
Wall posts, medium prose, hashtags in use, images common. Personal wall vs community differ in tone and in who may post — target detail required: which wall/community.

### telegram
A channel or group broadcast rather than a social feed: no ranking algorithm and no discovery surface, so subscribers see every post in order and frequency is felt directly — over-posting reads as noise here faster than on an algorithmic feed. Clickable links with previews that can be suppressed, light markup, media optional. Publishing needs admin rights on the target. Target detail required: channel or group. Verify the current message cap and the media-caption cap, which are not the same number.

### discord
A chat message in one channel of one server, not a feed post: no discovery, no algorithm, no hashtags — the people in that channel see it in order, and a marketing message dropped into a conversation reads louder than anywhere else on this list. Servers other than the user's own gate promo through their own rules and usually confine it to a designated channel (`#self-promo`, `#showcase`); read those rules and the channel's recent messages before writing, exactly as with a subreddit, and expect that posting rights may simply not exist. Discord markdown (bold, italic, code blocks, no headings in the old style — verify what the current composer renders), links clickable with an embed preview, media optional. Target detail required: server and channel. Verify the current message cap on the **web** composer, and whether the account is on a tier with a longer one.

### slack
A message in one channel of one workspace: no discovery, no algorithm, no hashtags. Structurally Discord's twin, socially stricter — most workspaces are workplaces, and a promotional message outside a designated channel reads as an intrusion into someone's job. Posting rights and channel conventions are the workspace's, not the user's; read the channel's recent messages and any pinned rules first. Target detail required: workspace and channel. Threads are a first-class structure here — verify whether the post belongs in the channel or in a thread before writing.

### youtube
Two different surfaces on one account. **Uploads** (video, including Shorts) carry a title, a description and tags, and the campaign writes those fields rather than the video itself — the video must already exist. **Community posts** are text, image or poll, and behave like a short feed post; whether the channel has that tab at all has historically been gated by channel size, so verify it live for this account rather than assuming. Description links are clickable; the first lines are what shows before the fold. Target detail required when the account manages more than one channel or a brand account.

### google-business
Updates on a business profile, shown to people who find the business in search or on the map. The audience is local and transactional: opening hours, an offer, an event, something new in stock — a product-marketing post written for a social feed lands wrong here. Posts carry an optional image and a call-to-action button; several post types expire on their own schedule, which is volatile enough to verify live every campaign. Target detail required when the account manages several profiles or locations.

### nostr
A protocol rather than a site: the account is a key pair, and posting happens through whichever web client the user prefers, so the client is part of the address. Short posts, no algorithmic feed, discovery through relays and follows; media is usually uploaded to a separate host and linked. Key material is the user's alone — never request it, read it, or paste it, and a signing-extension prompt is theirs to accept. Culture is technical and hostile to marketing cadence. Target detail required: the client. Verify caps and media handling on that client live.

### hashnode
Developer blogging platform: markdown articles with tags, a cover image and canonical-URL support (set it when the article mirrors the user's own blog). An article can go to the author's personal blog or to a publication, and those differ in audience and in who reviews. Community norms match `devto` — tutorials and experience reports over announcements. Frequency: articles per campaign, never per day. Target detail required when posting into a publication.

### wordpress
The user's own site, so the rules are the user's: no platform promo policy, no character cap, no moderation. Which is exactly why it is easy to get wrong — a post here should be the canonical version other platforms point at, not a copy of a feed post. Editor differs between the block editor, the classic editor and whatever the theme adds; publish, schedule and draft are distinct actions. Categories and tags are the site's own taxonomy — reuse the existing terms rather than inventing new ones. Target detail required: the site URL.

### whop
A creator's own community storefront: posts land in a feed or chat that existing members and customers see, so the register is an update to insiders rather than acquisition copy, the same family as `patreon` and `ko-fi`. Documentation is thin and the product moves quickly — read the live UI during Phase 3 for what the composer supports, and verify caps, media handling and whether the target feed is member-only before writing. Target detail required: the whop and the feed or channel.
