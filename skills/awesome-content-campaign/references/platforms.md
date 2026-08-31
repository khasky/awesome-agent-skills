# Platforms — the canonical vocabulary, structural notes, and the live-verify checklist

**This file is the single source of the platform vocabulary.** The slugs below are what the interview offers, what filenames carry, and what `awesome-content-publisher` parses; adding a platform means adding a row here and a posting note in that skill's `references/platform-posting.md`, in the same change. No other file restates the list.

Structural facts here are stable (what a platform *is*); everything volatile — character caps, media size limits, per-tier differences, algorithm behavior — is deliberately absent and MUST be verified live in Phase 3, recorded in the manifest with a checked-on date.

Every platform on the list is reached as a website in a logged-in browser — `awesome-content-publisher` drives the real web UI through the Playwright MCP bridge and uses no platform APIs, developer apps, bots or webhooks. So Phase 3 verifies what the **web composer** does: a cap the mobile app enforces differently, a feature only the desktop client has, or an API-only capability is not what the posts must fit.

## The canonical table

`Slug` is the vocabulary token: filenames carry it verbatim, so it stays lowercase with hyphens and **never a dot** — a dot collides with the file extension when a name is parsed back. `Site` says which service the slug means, because several of them are not guessable from the token. `Target` is the detail posting requires and the interview must collect (Phase 2); a post reaching the publisher without it is a publication blocker. `Media` marks the platforms that cannot post without an attachment. `Genre` names the register file Phase 5 writes against.

| Slug | Site | Target the interview must collect | Media | Genre file |
| --- | --- | --- | --- | --- |
| `facebook-wall` | facebook.com | **defaults to the personal timeline** (`facebook.com/<handle>`); ask only when the account also manages Pages | optional | `genre-micro-post.md` |
| `facebook-group` | facebook.com/groups | group URL | optional | `genre-community-post.md` |
| `linkedin` | linkedin.com | — | optional | `genre-micro-post.md` |
| `reddit` | reddit.com | subreddit | optional | `genre-community-post.md` |
| `lemmy` | any Lemmy instance | instance domain + community | optional | `genre-community-post.md` |
| `tumblr` | tumblr.com | — | optional | `genre-micro-post.md` |
| `mastodon` | any Mastodon instance | instance domain | optional | `genre-micro-post.md` |
| `bluesky` | bsky.app | — | optional | `genre-micro-post.md` |
| `x` | x.com | — | optional | `genre-micro-post.md` |
| `threads` | threads.com | — | optional | `genre-micro-post.md` |
| `truthsocial` | truthsocial.com | — | optional | `genre-micro-post.md` |
| `nostr` | client-dependent | the web client the user posts through | optional | `genre-micro-post.md` |
| `bastyon` | bastyon.com | — | optional | `genre-micro-post.md` |
| `vk-wall` | vk.com | own wall or a community the user may post to | optional | `genre-micro-post.md` |
| `telegram` | t.me | channel or group | optional | `genre-micro-post.md` |
| `discord` | discord.com | server + channel | optional | `genre-community-post.md` |
| `slack` | slack.com | workspace + channel | optional | `genre-community-post.md` |
| `peerlist` | peerlist.io | — | optional | `genre-micro-post.md` |
| `minds` | minds.com | — | optional | `genre-micro-post.md` |
| `instagram` | instagram.com | — | **required** | `genre-micro-post.md` |
| `pinterest` | pinterest.com | board | **required** | `genre-micro-post.md` |
| `patreon` | patreon.com | — (visibility public/members is per-post: ask) | optional | `genre-micro-post.md` |
| `ko-fi` | ko-fi.com | — | optional | `genre-micro-post.md` |
| `buymeacoffee` | buymeacoffee.com | — | optional | `genre-micro-post.md` |
| `hackernews` | news.ycombinator.com | — | none supported | `genre-community-post.md` |
| `daily-dev` | daily.dev | squad, when posting into one rather than submitting a link | optional | `genre-community-post.md` |
| `wonderful-dev` | wonderful.dev | — | optional | `genre-community-post.md` |
| `devto` | dev.to | — | optional | `genre-long-article.md` |
| `hashnode` | hashnode.com | publication, when posting to one rather than a personal blog | optional | `genre-long-article.md` |
| `hackernoon` | hackernoon.com | — | optional | `genre-long-article.md` |
| `medium` | medium.com | publication, when posting into one | optional | `genre-long-article.md` |
| `substack` | substack.com | publication, when the account has more than one | optional | `genre-long-article.md` |
| `write-as` | write.as | blog, when the account has more than one | optional | `genre-long-article.md` |
| `telegraph` | telegra.ph | — | optional | `genre-long-article.md` |

A platform the user names that is not on this list is written for like any other — research it live in Phase 3, and add its row here plus a posting note in `awesome-content-publisher` rather than leaving the vocabulary split between a file and a conversation.

**Out of scope, deliberately:** a mailing tool whose only output is email (a newsletter sender, a self-hosted list). Publishing exists there, but nothing can be read back from a public page afterwards, and the pacing and duplicate rules these skills are built on do not map. A campaign that should also go to a list is written here and sent by the user's own mail tooling.

`substack` is on the list because a post there is a public page with a permalink that can be read back — but publishing it **also sends mail that cannot be recalled**, so it carries the strictest confirmation of any platform here: audience, section and the send toggle are read back against the post file before submitting, and a duplicate is not a downranked post but a second email in someone's inbox.

## What to verify live, per selected platform

- Post length cap, and whether it differs by account tier (X: free vs premium) or by instance (mastodon). **A cap the composer does not enforce is still a cap**: `peerlist` accepted a 495-character body and published it truncated mid-URL, so a platform whose composer shows no counter gets a deliberately short unit, and the published post is compared to the source afterwards, tail first.
- Media: which formats, whether mandatory, count limits per post.
- Links: clickable? auto-previewed? deprioritized by the feed? caption links dead (instagram)?
- Hashtag norms: how many read as native, where they are a separate field (tumblr tags), where they do not exist (reddit).
- Editor: plain text / markdown / rich — decides what formatting survives.
- Promo and disclosure rules: platform-level policy plus the specific subreddit/group/community rules for the user's target.
- Publication gates: group admin approval, editorial review, automod.

## Profiles

### facebook-wall
**The personal timeline is the default surface** — `facebook.com/<handle>`, the wall the user posts to themselves. A Page is the exception, not the question to open with: only when the account manages Pages does the interview ask which surface, and a user who names their own profile URL has already answered. Short-to-medium conversational prose; links auto-preview; hashtags carry little weight. Media optional. Page and personal timeline differ in tone expectations, so a post written for one is not simply moved to the other.

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

### bastyon
Decentralized platform; account identity is a key pair and login flows differ from mainstream platforms. Crypto/free-speech-adjacent culture. Verify caps and media support live — documentation is thin, the live UI is the source of truth.

### pinterest
A pin is image + title + description + destination link, filed to a board. Image required. Target detail required: board. Discovery is search-driven — the description carries keywords, not hashtag walls.

### vk-wall
Wall posts, medium prose, hashtags in use, images common. A personal wall and a community differ in tone and in who may post — target detail required: which one.

### telegram
A channel or group broadcast rather than a social feed: no ranking algorithm and no discovery surface, so subscribers see every post in order and frequency is felt directly — over-posting reads as noise here faster than on an algorithmic feed. Clickable links with previews that can be suppressed, light markup, media optional. Publishing needs admin rights on the target. Target detail required: channel or group. Verify the current message cap and the media-caption cap, which are not the same number.

### discord
A chat message in one channel of one server, not a feed post: no discovery, no algorithm, no hashtags — the people in that channel see it in order, and a marketing message dropped into a conversation reads louder than anywhere else on this list. Servers other than the user's own gate promo through their own rules and usually confine it to a designated channel (`#self-promo`, `#showcase`); read those rules and the channel's recent messages before writing, exactly as with a subreddit, and expect that posting rights may simply not exist. Discord markdown (bold, italic, code blocks, no headings in the old style — verify what the current composer renders), links clickable with an embed preview, media optional. Target detail required: server and channel. Verify the current message cap on the **web** composer, and whether the account is on a tier with a longer one.

### slack
A message in one channel of one workspace: no discovery, no algorithm, no hashtags. Structurally Discord's twin, socially stricter — most workspaces are workplaces, and a promotional message outside a designated channel reads as an intrusion into someone's job. Posting rights and channel conventions are the workspace's, not the user's; read the channel's recent messages and any pinned rules first. Target detail required: workspace and channel. Threads are a first-class structure here — verify whether the post belongs in the channel or in a thread before writing.

### nostr
A protocol rather than a site: the account is a key pair, and posting happens through whichever web client the user prefers, so the client is part of the address. Short posts, no algorithmic feed, discovery through relays and follows; media is usually uploaded to a separate host and linked. Key material is the user's alone — never request it, read it, or paste it, and a signing-extension prompt is theirs to accept. Culture is technical and hostile to marketing cadence. Target detail required: the client. Verify caps and media handling on that client live.

### hashnode
Developer blogging platform: markdown articles with tags, a cover image and canonical-URL support (set it when the article mirrors the user's own blog). An article can go to the author's personal blog or to a publication, and those differ in audience and in who reviews. Community norms match `devto` — tutorials and experience reports over announcements. Frequency: articles per campaign, never per day. Target detail required when posting into a publication.

### peerlist
Developer profile network: a feed of short posts attached to a public professional profile, closer to `linkedin` in register than to `x`. The audience is other developers and the people hiring them, so shipped work and how it was built read native, and marketing cadence does not. Composer is a dialog with an optional title field plus a body; **the body is silently truncated on publish** — a 495-character body came back cut two characters into the closing URL, with no counter and no warning in the composer. Keep the body at 400 characters or less, put the link where a few lost characters would not destroy it, and compare the published post's tail against the source. Small platform otherwise — read the live feed during Phase 3 for length norms and whether the composer supports anything beyond plain text.

### daily-dev
Developer news aggregator. Two different acts: **submitting a link** to the public feed, where the title and the source do the work and self-promotion is judged the way an aggregator judges it, and **posting inside a squad**, which is a community with its own rules and moderators. The post file's target says which. Verify live what the composer accepts, how a submitted link is deduplicated against one already in the feed, and the squad's own promo rules before writing.

### medium
General-purpose article platform with a rich editor rather than raw markdown. An article can sit on the author's own profile or be submitted to a **publication**, which routes it to that publication's editors and their schedule — submission is not publication, and the campaign must not treat it as such. Canonical-URL support matters when the piece also lives on the user's blog. Some articles sit behind the platform's paywall; whether the user's do is an account setting to confirm, not to assume.

### minds
Open-source social network with a crypto-adjacent, free-speech-forward culture and a small technical audience. A post is a short feed entry with optional media and clickable links; the composer sits at the top of the newsfeed. Accounts carry a token/reward layer that has nothing to do with posting — never touch wallet, boost or monetisation controls, and never enter a paid Boost flow, which sits next to the post button. Verify the current character cap live.

### write-as
Minimal, distraction-free blogging: a single editor pane where the first line becomes the title and everything below is the body, published to a blog under the account. No tags, no cover image, no editorial review, and posts can be anonymous or attached to a named blog — the target says which blog when the account has more than one. Markdown is supported. The register is an essay or a note, not a feed post; a three-line post looks lost there.

### telegraph
Telegram's throwaway publishing surface: title, author and body in one page, no account required and no dashboard. That is the catch worth stating — **a `telegra.ph` page is editable only from the browser that created it**, through a local token, so a page published from an automation session cannot be edited later from another machine. Nothing is discoverable on the platform itself: a Telegraph page has no feed and no audience, so it exists to be linked from somewhere else. Markdown does not apply; the editor is rich text and links are inserted as links.

### substack
Newsletter platform where a post is simultaneously a web page and an email to subscribers. That second half changes the rules this file otherwise assumes: **publishing sends mail that cannot be recalled**, subscribers feel frequency directly, and a duplicate is not a downranked post but a second email. Sections and paywalled tiers decide who receives what. Target detail: the publication when the account has more than one.
