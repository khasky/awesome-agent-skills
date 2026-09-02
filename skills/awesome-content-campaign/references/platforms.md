# Platforms — the canonical vocabulary, structural notes, and the live-verify checklist

**This file is the single source of the platform vocabulary.** The slugs below are what the interview offers, what filenames carry, and what `awesome-content-publisher` parses; adding a platform means adding a row here and a posting note in that skill's `references/platform-posting.md`, in the same change. No other file restates the list.

Structural facts here are stable (what a platform *is*); everything volatile — character caps, media size limits, per-tier differences, algorithm behavior — is deliberately absent and MUST be verified live in Phase 3, recorded in the manifest with a checked-on date.

Every platform on the list is reached as a website in a logged-in browser — `awesome-content-publisher` drives the real web UI through the Playwright MCP bridge and uses no platform APIs, developer apps, bots or webhooks. So Phase 3 verifies what the **web composer** does: a cap the mobile app enforces differently, a feature only the desktop client has, or an API-only capability is not what the posts must fit.

## The canonical table

`Slug` is the vocabulary token: filenames carry it verbatim, so it stays lowercase with hyphens and **never a dot** — a dot collides with the file extension when a name is parsed back. `Site` says which service the slug means, because several of them are not guessable from the token. `Target` is the detail posting requires and the interview must collect (Phase 2); a post reaching the publisher without it is a publication blocker. `Media` says what the platform does with an attachment: **required** means it cannot post without one, **optional** means it takes one and the run's image belongs there too, and a row saying none is supported takes no attachment at all. Optional is not a synonym for "skip it" — when the campaign has an image, every optional row that the post targets gets it. `Genre` names the register file Phase 5 writes against.

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
| `peerlist` | peerlist.io | — | optional | `genre-micro-post.md` |
| `minds` | minds.com | — | optional | `genre-micro-post.md` |
| `instagram` | instagram.com | — | **required** | `genre-micro-post.md` |
| `pinterest` | pinterest.com | board | **required** | `genre-micro-post.md` |
| `patreon` | patreon.com | — (visibility public/members is per-post: ask) | optional | `genre-micro-post.md` |
| `ko-fi` | ko-fi.com | — | optional | `genre-micro-post.md` |
| `buymeacoffee` | buymeacoffee.com | — | optional | `genre-micro-post.md` |
| `hackernews` | news.ycombinator.com | — | none supported | `genre-community-post.md` |
| `daily-dev` | daily.dev | **defaults to a direct post from the personal profile** (`New Post`, audience everyone); ask only when the user names a squad | optional | `genre-community-post.md` |
| `wonderful-dev` | wonderful.dev | — | optional | `genre-community-post.md` |
| `devto` | dev.to | — | optional | `genre-long-article.md` |
| `hashnode` | hashnode.com | publication, when posting to one rather than a personal blog | optional | `genre-long-article.md` |
| `hackernoon` | hackernoon.com | — | optional | `genre-long-article.md` |
| `medium` | medium.com | publication, when posting into one | optional | `genre-long-article.md` |
| `substack` | substack.com | **defaults to the personal profile** (`substack.com/@handle`, Create → Article, no email); ask only when the user names a publication to send from | optional | `genre-long-article.md` |
| `write-as` | write.as | blog, when the account has more than one | optional | `genre-long-article.md` |
| `telegraph` | telegra.ph | — | optional | `genre-long-article.md` |

A platform the user names that is not on this list is written for like any other — research it live in Phase 3, and add its row here plus a posting note in `awesome-content-publisher` rather than leaving the vocabulary split between a file and a conversation.

**Out of scope, deliberately:** a mailing tool whose only output is email (a newsletter sender, a self-hosted list). Publishing exists there, but nothing can be read back from a public page afterwards, and the pacing and duplicate rules these skills are built on do not map. A campaign that should also go to a list is written here and sent by the user's own mail tooling.

`substack` is on the list because a post there is a public page with a permalink that can be read back. **The default path sends no mail at all**: an Article published from the personal profile is a web page on `substack.com/@handle` and nothing lands in an inbox. Only the publication-plus-send path is irreversible, and it is entered by explicit choice, never by default — when it is chosen, audience, section and the send toggle are read back against the post file before submitting, and a duplicate there is not a downranked post but a second email in someone's inbox.

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

**The instance and the community are two different questions, and only the second one is usually open.** A user with an account has exactly one instance, so once they have named it the run stops offering alternatives; what remains is which community on it. **That list is read from the instance itself, never guessed**, and Lemmy's own API answers it from a logged-in tab on that domain: `/api/v3/community/list?type_=Local&sort=TopAll&limit=50` for what the instance carries, and `/api/v3/search?q=<topic>&type_=Communities&listing_type=Local` for the ones matching this post's subject. Both return subscriber and post counts, so the options can be offered ranked by fit with the size that makes them choosable — on `lemmy.world` a post about a model release meets `technology` at 87k subscribers, `machinelearning` at 1.2k and `fosai` at 4.8k, and that spread is the actual decision. Offer the topical matches alongside the large general community, because the big one is not always the right room.

### tumblr
Casual, personality-forward register. Tags are a separate field, not inline hashtags, and drive discovery. Long or short both native; images and GIFs at home here.

**A post here carries one featured image, at the very top, directly under the title** — that is what this author's own posts do, and a text-only Tumblr post looks stripped next to them. The block editor takes an image block; adding it is a composer step, not a front-matter field.

**Links are applied, not typed.** The block editor does not linkify a pasted URL, so a bare address publishes as dead text. Select the words that should carry the link and use the popover that appears over a selection.

### mastodon
Federated — the cap and culture depend on the user's instance; verify on that instance, not on defaults. No engagement algorithm: hashtags are the discovery mechanism. Content-warning conventions matter for promo-adjacent posts. Target detail required: instance domain.

**Ask it as a default plus an escape hatch, never as a menu of instances.** `mastodon.social` (or whichever the user has already named) and `another server, I will type it` are the two options. A list of three or four instances the user has no account on is a quiz with no right answer visible from inside the question, and picking one of them wrongly sends the run's caps research to a server they cannot post from.

### bluesky
Short posts, hard cap (verify current), no markdown. Link cards from pasted URLs; threads for anything longer. Casual, tech-adjacent culture.

**Hashtags work and are clickable**, and the platform accepts up to eight — which is a ceiling, not a target. Every tag also spends part of the 300-character budget, so two or three from the campaign's set is the practical share here. Shipping a Bluesky post with none is a miss, not a style choice.

### x
Short posts; cap differs sharply by account tier — verify which tier the user has before writing a single post. Reply chains are the native long form. Media boosts reach.

**Hashtags: one or two, and never more than two.** This is the one platform where more tags measurably cost reach rather than adding it — engagement peaks at one to two per post and falls off from three, with a steep drop past five. So `x` takes the top one or two tags of the campaign's set and drops the rest; it does not get the fuller block that `mastodon` and `instagram` carry. A post with zero is also fine here. What is not fine is omitting them by accident: pick the one or two deliberately, and make sure the cap trim never leaves half a tag at the end.

### threads
Meta's text feed, bound to an Instagram account: the handle and the login are Instagram's, so wherever an Instagram presence exists a Threads one usually does too — check for it rather than assuming its absence. Conversational register close to `x`. Unlike Instagram, links in the post body are clickable and media is optional. Verify the current character cap and which domain the account answers on.

**Threads has topic tags, not hashtag blocks, and takes exactly one per post** — the platform caps it there deliberately to keep tag spam down, and a tag may contain spaces. So this is the one platform where the campaign's tag set collapses to a single choice: pick the tag closest to the post's subject and drop the rest. A block of five hashtags copied from the `mastodon` version is wrong here, and zero tags is a miss.

### truthsocial
Mastodon-derived microblog with its own single network — short posts, media optional, links clickable. Politically homogeneous audience whose interests rarely overlap a technical product's; say so if the user selects it for a product with no fit rather than writing copy that will land as noise. Verify the current character cap and media specs live: the fork's numbers are not Mastodon's.

### wonderful-dev
Developer community feed. Small platform whose conventions are best read from its live feed during Phase 3 — check what natives post, length norms, and code-snippet support before writing.

### hackernoon
Long-form article platform with **editorial review** — a submitted draft is not a published post, and the campaign schedule must treat it as submission time, not publication time. Markdown editor. Frequency: articles per campaign, never per day.

### devto
Long-form markdown articles with front-matter tags and canonical-URL support (set it if the article mirrors the user's blog). Community norms favor tutorials and experience reports over announcements; an announcement dressed as neither reads as spam. Frequency: articles per campaign.

**`cover_image` in the front matter is not the article's image.** It renders on the feed card and above the title, and a reader scrolling the article itself can miss it entirely — it also takes no alt text. The image belongs **in the body, as the first element under the title**, written as ordinary markdown with real alt text: `![<alt>](<uploaded url>)` on the line after the front matter, before the first `##`. Setting `cover_image` as well is fine and normal; setting only `cover_image` ships an article whose picture is not in it.

**Get the URL from dev.to's own uploader**: the editor's `#image-upload-field` accepts the file and returns a hosted `dev-to-uploads.s3.amazonaws.com/uploads/articles/…` URL. That URL is what goes into both the markdown and `cover_image` — the local path is meaningless once published.

**The title is slugged into the permalink**, so the 50–60 character rule in `genre-long-article.md` is a URL rule here as much as a headline one.

### hackernews
`news.ycombinator.com`. A submission, not a post: one global ranked feed, no hashtags, no media, no formatting beyond plain paragraphs and links. The title carries almost everything and marketing phrasing sinks a submission on sight — the site's own guidelines ban editorializing titles. A self-authored product goes up as `Show HN: <what it is>`, which has its own rules (working thing, author present in the comments). Frequency is per campaign at most, never per day. Verify the current title cap and the Show HN rules live.

**A submission is title + URL **or** title + text, never both** — that is the site's own rule, and its stated reason is to stop people putting their commentary in a privileged position above the comments. So HN is not a link-only platform: a text submission is a first-class form, and `Ask HN` exists precisely because text posts do. The FAQ's wording: *"You can't. This is to prevent people from submitting a link with their comments in a privileged position at the top of the page. If you want to submit a link with comments, just submit the link, then add a regular comment."*

**Which form this campaign uses is a decision, not a default.** A link submission points at somebody else's page and the title must be that page's own title, unedited. A text submission is the campaign's own writing and is the right form when the piece has something of its own to say — but it must then read as a discussion opener, not as a post pasted from a feed.

**When the URL is already on HN, a link submission is not a duplicate post — it is a vote.** The form redirects to the existing item and registers an upvote from the account, an outward-facing side effect nothing asked for. Search `hn.algolia.com` before submitting. Found, and the existing item drew real attention (the FAQ tolerates reposting only where a story "has not had significant attention in the last year or so") → the honest options are a text submission that stands on its own, or skipping; say which, and never let the run cast the vote as a side effect of trying to post.

### patreon
Posts address existing supporters — the register is an update to insiders, not a cold ad. Public vs member-only visibility is a per-post choice; ask. Medium prose, media friendly.

**The image is the post's image, never an attachment.** Patreon's editor has two homes for a file and they look interchangeable: the media block in the post body, and the **Attachments** list in the sidebar. Only the first one is the picture readers see; the second publishes the file as a download link sitting under the post, so a run that touches both ships the same image twice — once as the visual and once as a stray `v02.png` for supporters to download. Put the image in the body block, and leave Attachments empty unless the post file genuinely asks for a downloadable file.

### ko-fi
Supporter feed, short updates, images common. Same insider register as patreon.

**The image is part of the post and has to be attached before submitting.** The quick-update composer takes one, and a text-only supporter update stands out against this author's own feed where other posts carry pictures. If the image control cannot be reached in the composer that opened, that is a reason to look again at the composer rather than to ship without it — see the posting notes for the route.

### buymeacoffee
Supporter posts, same family as ko-fi: short, personal, update-flavored.

**A post here is a small formatted article, not a status line.** The composer is a rich editor with bold, italic, underline, headings, lists, quotes, code blocks, an image control and a link control, so the post carries a picture at the top and a real clickable link where it points at something. Writing it as plain text with a bare URL wastes every affordance the platform gives and ships a post that looks unfinished next to the author's own.

### instagram
Image or video **required** — no media, no post. Caption links are not clickable ("link in bio" is the native CTA phrasing); hashtag blocks are native. Web composer exists at instagram.com. Verify caption cap and current media specs.

**The composer opens from the sidebar, not from a URL.** `instagram.com/create/…` paths are not the app's own route to the composer and land on unrelated shells; the entry point is the `+` in the left sidebar, then the `Post` entry that appears under it. The dialog that opens accepts PNG among other formats — a run that reached a route accepting `image/jpeg` only has gone in the wrong door, and converting the file is treating the symptom.

### bastyon
Decentralized platform; account identity is a key pair and login flows differ from mainstream platforms. Crypto/free-speech-adjacent culture. Verify caps and media support live — documentation is thin, the live UI is the source of truth.

### pinterest
A pin is image + title + description + destination link, filed to a board. Image required. Target detail required: board. Discovery is search-driven — the description carries keywords, not hashtag walls.

**The description is sentences, and it ends as a sentence.** Search-driven does not mean keyword-stuffed: a description that trails off into `Claude Code parallel sessions, git worktrees, cross-session messaging, AI coding workflow.` is a comma-separated word list wearing a full stop, and it reads as machine output to the one person who actually opens the pin. Write the description as prose that stands on its own, and if the keywords matter put them where keywords belong — the pin's own tag field, or a short hashtag line — not welded onto the last sentence.

### vk-wall
Wall posts, medium prose, hashtags in use, images common. A personal wall and a community differ in tone and in who may post — target detail required: which one.

### telegram
A channel or group broadcast rather than a social feed: no ranking algorithm and no discovery surface, so subscribers see every post in order and frequency is felt directly — over-posting reads as noise here faster than on an algorithmic feed. Clickable links with previews that can be suppressed, light markup, media optional. Publishing needs admin rights on the target. Target detail required: channel or group. Verify the current message cap and the media-caption cap, which are not the same number.


### nostr
A protocol rather than a site: the account is a key pair, and posting happens through whichever web client the user prefers, so the client is part of the address. Short posts, no algorithmic feed, discovery through relays and follows; media is usually uploaded to a separate host and linked. Key material is the user's alone — never request it, read it, or paste it, and a signing-extension prompt is theirs to accept. Culture is technical and hostile to marketing cadence. Target detail required: the client. Verify caps and media handling on that client live.

**The default is the site the user actually has an account on, and for most people that is `nostr.com` itself.** The question exists because a Nostr key works in any client, not because the run gets to pick one; a menu of `primal.net · snort.social · iris.to` offered to someone who signed up at `nostr.com` is three sites they have no relationship with, and nothing in the question explains the basis for choosing. `nostr.com` is a client in its own right and not merely a directory — it carries a feed, a sign-in, a configured relay set (`relay.nostr.com`, `relay.damus.io`, `nos.lol` and others, read/write) and an installable app — so naming it as the default is correct rather than a fallback. It also publishes its own explainer at `nostr.com/clients` and points at `nostrapps.com` for the rest, which is the honest place to send a user who wants to change.

So: the client the user named or is signed into, plus `another client, I will type it`. And **check the signer before promising the post can go out**: posting through a web client needs a NIP-07 browser extension or a remote signer, so if `window.nostr` is absent in the browser that will do the publishing, say so at interview time rather than letting the publisher discover it at the composer. Never ask for, read, or paste the private key in any case.

### hashnode
Developer blogging platform: markdown articles with tags, a cover image and canonical-URL support (set it when the article mirrors the user's own blog). An article can go to the author's personal blog or to a publication, and those differ in audience and in who reviews. Community norms match `devto` — tutorials and experience reports over announcements. Frequency: articles per campaign, never per day. Target detail required when posting into a publication.

### peerlist
Developer profile network: a feed of short posts attached to a public professional profile, closer to `linkedin` in register than to `x`. The audience is other developers and the people hiring them, so shipped work and how it was built read native, and marketing cadence does not. Composer is a dialog with an optional title field plus a body; **the body is silently truncated on publish** — a 495-character body came back cut two characters into the closing URL, with no counter and no warning in the composer. Keep the body at 400 characters or less, put the link where a few lost characters would not destroy it, and compare the published post's tail against the source. Small platform otherwise — read the live feed during Phase 3 for length norms and whether the composer supports anything beyond plain text.

### daily-dev
Developer news aggregator. **The default is Direct Posting from the personal profile**, audience everyone, no squad involved.

**Community Picks no longer exists.** It was sunset in 2025 and replaced by Direct Posting: `New Post` (or the `+` control) anywhere on `daily.dev`, and the contribution lives under the author's own name on their profile, which is where reputation and followers accrue. Anything in this file or elsewhere that still describes a separate submission mechanism is describing a feature that was removed. Source: `docs.daily.dev/docs/key-features/community-picks`.

Two shapes the composer offers, both from the profile. An **original post** is written on daily.dev itself, title plus body, and the editor takes Markdown and code blocks. A **link post** points at an article already published on the author's own site. Where the composer asks for an audience, choose everyone rather than a squad. Adding a personal blog as an automatic Source is not an option any more: daily.dev stopped accepting personal blogs as sources and points authors at Direct Posting or their own squad instead.

**A squad is opt-in and is not the default.** It is a community with its own rules and moderators, worth having only when the user intends to run a topical room regularly. When one is named, the options are the user's own joined squads, read from their account: a signed-in `daily.dev` lists them in the sidebar under `My Squads` and on `daily.dev/squads/discover`. A run cannot know from outside whether someone belongs to `AI`, `WebDev` or nothing at all, and a post filed to a squad they never joined does not publish. Featured squads there are joinable, but joining is the user's decision, so they are mentioned rather than selected.

**Content has to be for developers, and the guidelines are enforced by ranking and removal** (`docs.daily.dev/docs/for-content-creators/content-guidelines`). Personal subjects are fine when the lesson is a developer's: why a browser extension got built, the mistakes made launching a SaaS, losing motivation after a big project, what seven years of shipping own products taught, why a complex architecture was abandoned, burnout, job hunting, learning to program. Off-limits by relevance: travel, pets, crafts, relationships, domestic anecdotes, politics, anything with no line back to development. Also prohibited outright: non-English material, political content, pure advertising, clickbait, programmatic-SEO output, and content from sources dormant three months or more.

A post about the author's own product survives only in one shape: problem, then their experience, then the decisions taken, then what went wrong, then concrete conclusions, and a short product link at the end. "I built a service, sign up here" reads as advertising and is treated as such.

**One rule collides with what these skills do, and the run says so out loud rather than discovering it in a takedown.** daily.dev prohibits AI-generated content, and states plainly that it prioritises human insight and lived experience. A post drafted by an agent and shipped unedited is against that rule whoever pressed publish. So `daily-dev` selected in the interview earns one line back to the user: the platform bans machine-written posts, the draft here is a starting point they are expected to rewrite in their own voice and from their own experience, and publishing it as-is risks downranking or removal of the post and reputational damage to the account. The user decides; the run never quietly ships into that rule, and never claims the text will pass as human.

### medium
General-purpose article platform with a rich editor rather than raw markdown. An article can sit on the author's own profile or be submitted to a **publication**, which routes it to that publication's editors and their schedule — submission is not publication, and the campaign must not treat it as such. Canonical-URL support matters when the piece also lives on the user's blog. Some articles sit behind the platform's paywall; whether the user's do is an account setting to confirm, not to assume.

**Two things the rich editor will not do for you, and both ship as visible defects.** A pasted URL stays plain text, so the closing link publishes as dead characters unless the words are selected and the editor's own link control is applied to them. And the image is inserted through the editor: put the caret on an empty line, use the `+` control that appears in the left margin, choose the image option, and pick the file — there is no cover field to fall back on, so an article with no in-body image ships with no image at all.

**The title is slugged into the permalink**, so a two-sentence title becomes an unreadable URL; keep it inside the 50–60 character rule.

**Its autocorrect rewrites `--` into an em dash.** That silently corrupts any command-line flag in the prose (`claude --worktree` publishes as `claude — worktree`) and drops an em dash into text the campaign forbids them in. Write the short form of the flag where one exists, or check the body for `—` before publishing and repair it by replacing the whole paragraph.

### minds
Open-source social network with a crypto-adjacent, free-speech-forward culture and a small technical audience. A post is a short feed entry with optional media and clickable links; the composer sits at the top of the newsfeed. Accounts carry a token/reward layer that has nothing to do with posting — never touch wallet, boost or monetisation controls, and never enter a paid Boost flow, which sits next to the post button. Verify the current character cap live.

### write-as
Minimal, distraction-free blogging: a single editor pane where the first line becomes the title and everything below is the body, published to a blog under the account. No tags, no cover image, no editorial review, and posts can be anonymous or attached to a named blog — the target says which blog when the account has more than one. The register is an essay or a note, not a feed post; a three-line post looks lost there.

**Markdown is the input and it renders**, so an article here carries real formatting: headings `#` through `######`, bold and italic, bulleted and numbered lists, `[text](url)` links (bare URLs auto-link too) and inline code. Write.as documents its own supported subset and only that subset is guaranteed, so stay inside the common elements rather than reaching for tables or footnotes.

Two traps worth carrying into the post file. **The title line is written as a heading, not as a bare first line** — an unmarked first line is taken as the title *and* still renders in the body, so the same words appear twice; `# Title` on line one avoids it. And **formatting only applies to blog posts**, not to anonymous ones: a post published while signed out is plain, which is the same trap as the anonymous-publishing one above and another reason the target blog is not optional.

### telegraph
Telegram's throwaway publishing surface: title, author and body in one page, no account required and no dashboard. That is the catch worth stating — **a `telegra.ph` page is editable only from the browser that created it**, through a local token, so a page published from an automation session cannot be edited later from another machine. Nothing is discoverable on the platform itself: a Telegraph page has no feed and no audience, so it exists to be linked from somewhere else.

**It is a formatted page, not a plain-text one, and an article shipped here without formatting is a defect.** The editor is rich text with a floating toolbar, and the page format accepts a fixed tag list: `a`, `aside`, `b`, `blockquote`, `br`, `code`, `em`, `figcaption`, `figure`, `h3`, `h4`, `hr`, `i`, `iframe`, `img`, `li`, `ol`, `p`, `pre`, `s`, `strong`, `u`, `ul`, `video`. So an article gets **real headings, and exactly two levels of them** — `h3` is the section heading and `h4` the subordinate one, with `h1` and `h2` simply not available. Bold, italic, blockquote, lists, code and horizontal rules are all on the table above.

**Markdown syntax is not the input.** The body is rich text, so typing `## Where it breaks` publishes the literal hash characters; a heading is made with the editor's own controls, and links are inserted as links rather than written as `[text](url)`.

### substack
Two different surfaces share one slug, and **the default is the one that sends no email**.

**The personal profile is the default target.** Substack's own help puts it plainly: "On Substack, you can publish from your profile and website." Every account gets a profile at `substack.com/@handle` with a `Create` menu offering `Note`, `Article`, `Video`, `Podcast` and more, and an Article published there is a web page on that profile with a permalink. No newsletter goes out, no subscriber inbox is touched, and **no publication has to exist** — an account that has never made one publishes this way. That is the path a repurposed article takes unless the user says otherwise, and it needs no target detail, because the profile is not a thing to choose between.

**Same two editor traps as `medium`, on both surfaces.** A pasted URL does not become a link — select the words and use the `Link` control in the top toolbar. The image is inserted from that toolbar too: caret on an empty line, the image icon, then `Image`, then the file. Neither happens by writing markdown, and an article that skips them publishes with a dead URL and no picture.

**The publication path is opt-in and it is the irreversible one.** An account that runs a publication can publish there instead and send the post to subscribers, and a sent issue cannot be recalled: subscribers feel frequency directly, sections and paywalled tiers decide who receives what, and a duplicate is a second email rather than a downranked post. Enter it only when the user names the publication and asks for the send, and then read back audience, section and the send toggle against the post file before submitting.

**So the interview does not ask "which publication?" by default**, and it certainly does not ask it every run. That question is unanswerable for the common case — an account with a profile and no publication has nothing to name, so the only honest answers left are "drop it" or a typed guess. Ask instead only when the user has said they want the newsletter send, or when the account is known to run more than one publication.
