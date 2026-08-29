# Platform profiles — structural notes and the live-verify checklist

Structural facts here are stable (what a platform *is*); everything volatile — character caps, media size limits, per-tier differences, algorithm behavior — is deliberately absent and MUST be verified live in Phase 3, recorded in the manifest with a checked-on date. Slugs match the canonical vocabulary in `SKILL.md`.

Every platform on the list is reached as a website in a logged-in browser — `awesome-post-publisher` drives the real web UI through the Playwright MCP bridge and uses no platform APIs, developer apps, bots or webhooks. So Phase 3 verifies what the **web composer** does: a cap the mobile app enforces differently, a feature only the desktop client has, or an API-only capability is not what the posts must fit.

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
