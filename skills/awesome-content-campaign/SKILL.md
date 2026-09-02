---
name: awesome-content-campaign
description: "Builds a scheduled batch of platform-fit content-marketing posts from any sources (repositories, websites, files, code): a knowledge map with every claim traced to evidence, an interview for voice, frequency, duration, platforms and timezone, dated checks of each platform's limits, posts written to a per-genre register and an author voice profile when one exists, offline HTML/CSS graphics when a platform needs media and has none, a two-stage self-audit against AI-slop tells, one dated file per slot, a campaign manifest. A single-post mode writes one unit for named platforms, no schedule. Use when asked to 'create a content marketing campaign', 'write posts about my product', 'write a post for linkedin and x', 'plan a week of posts', or in Russian 'создай посты для продвижения', 'контент-план', 'посты для соцсетей на неделю'. Do not use to publish the posts — use awesome-content-publisher; not to build the voice profile — use awesome-content-voice; not to de-slop existing text — use awesome-humanize-en."
license: MIT
metadata:
  author: Khasky
  tags: ["marketing", "content", "social-media", "writing", "scheduling"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-campaign"
---

# Content Campaign

Turn raw product knowledge into a batch of dated, platform-fit posts a publisher (human or `awesome-content-publisher`) can ship on schedule. The pipeline: ingest sources → knowledge map → interview → live platform research → schedule and media → write to genre and voice → two-stage self-audit → files + manifest. The author's voice is not built here: question 9 points at a profile from `awesome-content-voice`, and a campaign without one still runs on the voice chosen in the interview.

**Core principle: every claim in every post traces to the knowledge map, and every map entry traces to a source.** A post may persuade, but it may not invent — no fabricated numbers, testimonials, user counts, benchmarks, or "coming soon" features the sources do not support. A claim that cannot be verified is dropped or explicitly flagged to the user, never smoothed into fluent copy. The second principle: the posts must read human — the self-audit phase is not optional. The third: **every post markets the product** — it carries the campaign's primary link (or the platform's equivalent CTA where caption links are dead), placed where it reads as the natural next step of the post, never as an ad stamp. A post that delivers value but never touches the product is filler; a post that is only the link is spam; the craft lives in the span between.

Bundled files (load on demand):

- `references/platforms.md` — **the canonical platform vocabulary**: the slug table with the target detail each platform needs, which platforms cannot post without media, and which genre file governs its register — plus structural notes per platform and the checklist of volatile limits to verify live. Deliberately carries no character-cap numbers; those rot, and Phase 3 fetches them fresh. `awesome-content-publisher` parses against this same table, so a platform is added here once, never restated in a SKILL.md.
- `references/genre-micro-post.md`, `references/genre-long-article.md`, `references/genre-community-post.md` — register per genre: the human baseline, the AI tells that genre produces, and the rules Phase 5 writes against. Each platform's genre is named in the table above; load only the ones the campaign selected.
- `references/media-graphics.md` — the offline HTML/CSS graphic path for posts that need an image and have none. Loaded in Phase 4, only when the user opts in.

## Invocation

```
/awesome-content-campaign <source> [<source> …]
/awesome-content-campaign --post "<topic>" [--platforms <slug,slug>] [<source> …]
```

Sources are anything: a repository URL or local path, a website URL, files or folders on disk, pasted text. No sources given → ask for at least one before doing anything else.

**Single-post mode (`--post`)** — one content unit, written now, fanned out to the named platforms. It runs the same pipeline with the batch machinery switched off: Phase 1 ingests only what the topic needs (or nothing, when the user supplies the facts inline — those still land in the map, since the claim rules do not relax for one post), Phase 2 asks only voice, platforms and their targets, format, timezone and emoji, Phase 3 verifies just the selected platforms (the cache usually answers), Phase 4 assigns one slot — a time the user names, defaulting to the next best-time window — plus media, and Phases 5 to 7 run unchanged. What it skips: the frequency and duration questions, the angle rotation across a schedule, the per-platform uniqueness comparison (there is one unit), the best-time research for platforms nobody selected, and the manifest, which collapses into a `campaign.md` recording only what was researched and used. The output files are named and shaped exactly as in batch mode, so `awesome-content-publisher` takes them without knowing which mode wrote them.

## Phase 1 — Ingest sources and build the knowledge map

Working state lives in `content-campaign/<slug>/` (slug proposed from the product name, confirmed in Phase 2): `sources/` for dumps, `knowledge-map.md` for the distilled result. That one subfolder, created under the invocation directory, holds EVERYTHING this skill writes — working state, posts, media, manifest; the skill never drops loose files into the invocation root. Invoked inside a git repository → the folder will sit untracked: say so and ask whether to keep it there, add a `.gitignore` entry, or point the campaign at a folder outside the repo. Large source text stays OUT of the conversation context — dump to disk, analyze from disk (the same discipline `awesome-style-mimic` uses for its crawl corpus: context compaction must not be able to lose source data).

Per source type:

- **Website URL** — prefer a live browser (Playwright MCP or equivalent) so JS-rendered content is not silently missed; a plain HTTP fetch tool is acceptable for static pages but say which was used. **A browser here is one of the user's browsers**: when the session exposes more than one bridge, ask which before the first navigation and keep that answer for the run, name the browser used, and say it is busy while the crawl runs. Anything behind a login stops being a public read — run the target gate in `awesome-content-publisher`'s `references/browser-interaction.md` first. Crawl only what the topic needs (product pages, docs, changelog, pricing, about) — this is targeted reading, not a full-site crawl. Dump extracted text per page into `sources/`.
- **Repository (URL or path)** — read `README`, docs, changelogs, release notes, manifests (`package.json` and kin), and the public surface of the code (exported APIs, CLI help strings, feature flags). Clone shallow if remote.
- **Local files/folders** — read directly; folders get a file inventory first, then the prose-bearing and fact-bearing files.
- **Pasted text** — save into `sources/` so it survives compaction like everything else.

**Source trust:** the user's sources are the authority. A fact stated in any provided source — a player count, a year, a benchmark, a "running right now" number — is taken at face value, entered into the map with its reference, and usable in posts as fact; the skill does not demand outside proof for what the user handed it. Two sources contradicting each other → ask the user which is right rather than silently dropping both. *Unverified* is reserved for claims that appear in NO provided source.

For large corpora (>30 files), fan out read-only subagents per batch writing observations to `sources/analysis-N.md`. Resource preflight before spawning: cap concurrency at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB; go serial if CPU load > 85% or free RAM < 2×per_agent; if the runtime caps sub-agent concurrency itself, defer to it.

`knowledge-map.md` has fixed sections, each entry carrying its source reference (`file:line`, URL, or dump filename):

- **Product facts** — what it is, who it is for, pricing, platforms, install path.
- **Features with evidence** — one line per feature, with where the source proves it.
- **Numbers** — versions, counts, benchmarks, dates. Only numbers a source states; each with its reference.
- **Audience and pains** — who buys and what hurts, as far as the sources show.
- **Differentiators** — versus what alternatives, on what grounds.
- **Lexicon** — the product's own terms, spelled the way the sources spell them.
- **Links and CTAs** — the URLs posts may point to (site, repo, store listing, docs).
- **Unverified** — claims wanted for the campaign that appear in NO provided source. These may NOT appear in posts unless the user explicitly confirms them — and a user confirmation is itself a source: record it in the map.

**Gate:** present a one-screen summary of the map plus an assumptions block (audience, goal of the campaign, primary CTA). The user corrects or confirms before any writing. Voice is settled in the interview (question 9), not here — including the case where it should be learned from a site first.

## Phase 2 — Interview

Ask in one round (use the agent's structured-question UI when available; plain questions otherwise). Every question has a custom escape hatch.

**The platform set is the user's answer, never an inference.** Question 4 is asked in full, every run, with the entire canonical list available — the sources may show a product that is obviously a mobile app, an obviously developer-facing CLI, an account on exactly three networks, and none of that decides where the campaign posts. Reading the platform set off the sources instead of asking is the failure this question exists to prevent.

**Ask whether the user wants all of them before asking which ones.** "All" is the common answer, and the question UI offers no pre-checked state, so a bare checkbox list makes that answer the most laborious one available: thirty-odd ticks to say "everything". Lead with a single question — publish everywhere, or trim the list — stating the count, and run the checkbox pass only when the user chooses to trim, phrased as removing rather than adding. Splitting across several questions is still required where the UI caps options per question, and no platform is dropped to make the list fit.

**Target details are read from the user's account, not invented, and each platform gets its own question.** The Target column names a kind of thing; filling it in with plausible-sounding instances, communities or clients the user has no relationship with produces a question nobody can answer. Where a browser bridge is available and the user is signed in, read the real list — their instance's communities, their joined squads, the client they use — and offer those ranked by fit to the post's topic with the counts that make them choosable. Where it is not available, offer exactly two options: the canonical default and "another one, I will type it". Detail the user has already settled is not re-asked, and two platforms never share one question. The per-platform specifics, including the API calls that answer them, are in `references/platforms.md`.

The knowledge map still feeds the question, as annotation only. Walk its Links and CTAs section: every social URL found there is an account the product already runs, so mark those options "account exists" when presenting the list — informative, not selected. A platform the product already publishes on must never be silently absent from the question because the canonical list happens not to carry a slug for it — add the slug (see question 4) or record in the manifest that the user declined the platform. The same walk feeds question 8: a profile link found in Phase 1 may already carry a `utm_campaign` value.

1. **Voice** (pick one): first person singular ("I" — solo builder promoting own work) · first person plural ("we" — company/team) · neutral third person (product described from outside) · custom (user describes, or names a style guide from `awesome-style-mimic`).
2. **Frequency** (pick one): 1/day · 2/day · 3/day · custom.
3. **Duration** (pick one): 1 day · 3 days · 7 days · 14 days · 1 month · custom.
4. **Platforms** (multi-select, ALWAYS asked, nothing pre-selected). Read `references/platforms.md` and show its full slug table every run — that file is the vocabulary, filenames use its slugs verbatim, and `awesome-content-publisher` parses against the same table. Plus one open option: any platform the user names that the table does not carry (research it in Phase 3 like the rest, and add its row). Facebook appears twice because the surfaces differ (own wall or Page versus a moderated group); `lemmy` covers any Lemmy instance including `lemmy.world`; `hackernews` is `news.ycombinator.com`. An empty selection is not a default to fall back on — re-ask.
5. **Output format** (pick one): `.md` (default) · `.csv` · `.txt` · `.html` · `.pdf`. Plain text and basic formatting only — no CSS styling anywhere.
6. **Publication timezone** — accept any sane form ("Kyiv", "UTC+2", "America/New_York") and normalize to an IANA name; confirm the normalization back ("Kyiv → Europe/Kyiv, currently UTC+3 — correct?").
7. **Media** — does the user have images or videos for the posts? Collect folder path(s) and any explicit per-post wishes ("the demo video goes with the launch post" — an explicit mapping always wins in Phase 4). The Media column of `references/platforms.md` names the platforms that cannot post without an attachment; when the library cannot cover them, offer the two honest options rather than shipping unpostable drafts: generate flat diagram graphics locally (`references/media-graphics.md` — HTML/CSS rendered offline, no image service, opt-in), or drop those platforms. A video-only platform can only be dropped: this skill does not produce video.

   **An image that exists is attached wherever the platform accepts one.** Once the campaign has a picture for a post — from the library or generated — it goes on every platform that post targets whose Media column reads `optional` as well as `required`, and becomes the cover image on the article platforms. Media is not a per-platform privilege reserved for the ones that would otherwise be unpostable. The exceptions are the same three: platforms that support no media at all, video requirements a still cannot meet, and a post where the user or the copy says the image does not belong, which the manifest records.
8. **Link tracking** — ask explicitly, never silently default: append UTM parameters to campaign links? Options: no (default) · yes. On yes: `utm_source` is the platform slug, `utm_medium` matches the platform kind (social / article / community), and the `utm_campaign` value is the user's call — one value for the whole campaign, every post. Propose 2–3 candidates (the campaign slug, slug + month, a launch tag) and let the user pick one or type their own; never silently derive it. If a profile link already carries a `utm_campaign`, show that value as one of the options and say what a different choice costs: a bio link is permanent profile attribution, so a new campaign value means editing a live profile before publication, which becomes a Profile prerequisite rather than a free choice.
9. **Voice profile** — is there a profile file from `awesome-content-voice` (or a style guide from `awesome-style-mimic`) to write against? Options: use an existing file (ask for the path; `voice/*.md` in the invocation directory is the default place to look) · build one now (hand off to `awesome-content-voice`, then come back — that skill owns every voice source, including reading the user's own posts through their browser) · no profile, write in the voice chosen in question 1. The third option is a complete answer, not a degraded one: the rest of this skill needs no browser bridge and no profile.
10. **Emoji** (pick one): sparing — an emoji only where the platform's genre genuinely uses one (default) · none — zero emoji in any post · custom (the user states their own rule, e.g. "only in hashtag lines on instagram"). The choice binds every post; Phase 5 and the self-audit enforce it.

Per-platform targets that posting requires — collect now, not at write time, reading the Target column of `references/platforms.md` for exactly which platforms need what. Each answer goes into every affected post's frontmatter `target`. A post that reaches the publisher without the target its platform needs is a publication blocker, not a missing detail.

## Phase 3 — Live platform research

For every selected platform, verify the CURRENT constraints — by web search or by loading the platform's own help pages, dated today. Never answer from memory: caps, link policies, and promo rules change, and a post written to a stale limit fails at publish time.

Per platform, record with a checked-on date: post length cap (and whether it differs by account tier — X notably does), media formats and whether media is mandatory — including which raster formats upload cleanly (JPEG and PNG near-universally; WebP varies by platform and by year — verify, never assume), link handling (clickable? previewed? deprioritized?), hashtag norms, editor type (plain / markdown / rich), promo and disclosure rules, and anything that gates publication (group admin approval, editorial review on hackernoon, subreddit rules). `references/platforms.md` lists what to look for per platform; it deliberately does not carry the numbers.

**The research is cached, the cache is dated, and the dates are checked.** Findings go to `platform-cache.md` beside the campaign folders (one file per machine, shared across campaigns), each entry carrying its platform, its values, its source URL and its checked-on date; the manifest still records the values this campaign used, so a campaign stays readable on its own. On every run, entries younger than 30 days are reused as-is and reported as reused with their date; older entries are re-verified. Three things are re-checked every run regardless of age, because they change without notice and cost the most when stale: the rules of the specific subreddit, group, community or server being targeted; anything the user's account tier affects; and any platform whose previous entry was itself a guess.

**Reddit gets extra diligence:** fetch the chosen subreddit's rules and check them for self-promotion restrictions. A subreddit that bans promotion gets flagged to the user with the option to pick another target — writing a post that moderators will remove is worse than writing none.

**Best time to post** — a second research pass, per platform: current best-time-to-post guidance from engagement studies and the platform's own creator resources, recorded in the manifest with source and checked-on date. These are aggregate heuristics, not laws — prefer windows over minute-precision claims, convert them into the publication timezone (studies state audience-local times), and note when sources disagree instead of averaging them into false confidence. The user's own knowledge of their audience, when stated, overrides the research.

Surface conflicts between the interview and reality now: article platforms (`hackernoon`, `devto`) at 3/day for a month is spam by any editorial standard — propose a per-platform frequency override (e.g., 1–2 articles per campaign) and let the user decide. Record all overrides in the manifest.

## Phase 4 — Schedule, media assignment, and filenames

Compute slots from frequency × duration in the publication timezone. The frequency is the user's; the concrete times are the Phase 3 best-time windows, per platform — each platform's slots land inside its researched window, on a varied minute rather than :00 every day, which also spreads platforms so 5 do not all fire in the same minute. A platform whose research came up empty falls back to generic defaults (1/day: 10:00 · 2/day: 10:00, 17:00 · 3/day: 09:00, 13:00, 18:00), marked as fallback in the manifest. An explicit user preference overrides both.

Media is assigned here, once the slots exist. Inventory the user's media (file, format, dimensions and file size) and copy the used files into `content-campaign/<slug>/media/` so the campaign folder is self-contained and the publisher's relative paths resolve.

**Media scan and conversion (opt-in).** Where an asset is heavy or format-mismatched for its target — the classic case: a multi-megabyte PNG headed to a platform that recompresses aggressively — offer the user a conversion to JPEG or WebP, listing the affected files with sizes, and convert only on a yes. Target formats come from the Phase 3 research only: convert into a format the platform was verified to accept (WebP acceptance genuinely varies by platform; JPEG is the safe universal). Conversion rules: an installed converter, verified first (`magick -version` or equivalent exits 0 — none installed → say so and leave the originals untouched); quality 95 or higher so the source keeps its detail; originals never overwritten — converted copies land beside them in `media/`; a PNG with transparency loses its alpha in JPEG — flag those files and prefer WebP or the user's call. Verify every conversion: dimensions unchanged, the file opens, the size actually dropped — and report per-file before → after sizes. Assignment order: an explicit user mapping wins; otherwise assign by relevance to the slot's angle and guarantee one asset for every media-required post. Media is the soft side of the uniqueness rules: when the library is too small to cover the whole duration, an asset may repeat occasionally (avoid back-to-back on one platform when possible) or a media-optional post may simply go without — media repetition and media gaps are acceptable; text repetition on one platform never is. Verify each assigned file's format against the Phase 3 specs for its platform — a mismatch gets flagged with a conversion suggestion, never silently dropped or silently converted. Each image gets alt text where the platform supports it, written as a description of the image, not a keyword pile.

**Generated graphics (opt-in, offline).** When the library cannot cover a media-required post, or a post's content is genuinely structural (steps, a comparison, one number, a quotable line from the sources), offer to build the image locally per `references/media-graphics.md`: a self-contained HTML file styled with CSS and screenshotted through the browser automation already in use — no image-generation service, no API key, and nothing about the campaign uploaded anywhere. Build only on a yes, and only what the shape table there covers; **generating means generating a set of at least 20 spread across the knowledge map's different facts, handing the user a link to a gallery of them, and letting the user pick the one that ships** — the rules for the set, the gallery and the pick gate live in that file. This skill never chooses the graphic on the user's behalf, and a campaign whose media came from the user's own library skips the gate entirely. the words on the image obey the same claim rules as the post text, and the knowledge map is still the boundary. Rendered assets land in `media/` with their `.html` sources kept in `media/src/`, are marked in the manifest as generated rather than supplied, and get alt text describing what the image says. Video cannot be produced this way: a video-required platform with no video is dropped, never papered over with a still.

Filename per post:

```
YYYY-mm-dd_HH-mm_<pub-timezone>_<full-post-title>_<target-platform-name>.<ext>
```

Exactly 5 fields separated by `_`; inside a field only `-` (never `_`, which would break parsing):

- **pub-timezone** — the IANA name with `/` and `_` replaced by `-`: `Europe/Kyiv` → `Europe-Kyiv`, `America/New_York` → `America-New-York`. The frontmatter keeps the real IANA name; the filename token is display and fallback.
- **full-post-title** — lowercase ASCII kebab-case slug of the title, ≤ 50 chars (Windows path limits are real).

**The title itself names its subject and states its point, and it is written before the slug is cut from it.** A title is read in three places where no post surrounds it: a file listing months later, a composer's title field, an aggregator's feed. So it has to survive alone. Name the thing the post is about — the product, the model, the release, the actor — and say what happened to it. `H3 Max generates video faster than it plays` works. `Five seconds in under three` is a riddle: nothing in it says what is five seconds, whose, or why a reader should care, and the fact that the body explains it is exactly the problem, because the title is what has to earn the body being opened.

Three failures this rules out, all of them shapes that look like titles:

- **The unanchored fragment** — a measurement, a ratio or a phrase with its subject removed (`Five seconds in under three`, `Under $800k a year`, `Two minutes of it`). If the reader cannot answer "of what?" from the title, the subject was cut.
- **The topic label** — a noun phrase naming an area rather than a claim (`Video generation speed`, `Notes on H3 Max`, `Thoughts on AI streams`). A title is a sentence's worth of meaning even when it is not a sentence.
- **The teaser** — a title written to withhold (`This one number changes everything`, `What fal just shipped`). Curiosity bait reads as marketing on every surface here and as spam on the aggregators.

Where a platform's own title field carries the post (`reddit`, `lemmy`, `hackernews`, `daily-dev`), the same rule is stricter, not looser: state the fact plainly and let the title be the whole pitch, since `hackernews` guidelines ban editorializing outright. A micro platform's title is metadata and stays short. All of them anchor on the same subject, because one unit adapted means one title adapted, never several unrelated ones.

**Length is part of the rule, and a long-form title is not licence to write two.** Aim for **50 to 60 characters, hard cap 70**, six to ten words, and no terminal period — the range where a headline survives a search result, a feed card and a file listing without being cut. Extending a title with its own consequence is how it doubles: `Two Claude Code sessions can message each other` (46) is the headline, and `Two Claude Code sessions can message each other. That does not stop them overwriting your files.` (95) is that headline with the article's first sentence welded on. Two sentences joined by a full stop is the shape to catch — the second one belongs in the opening paragraph, where it has room.

**On `devto`, `medium`, `substack`, `hashnode` and `write-as` the title is also the URL.** Every word gets slugged into the permalink, so an overlong title publishes as an unreadable address that no one can quote or type. Cutting the title short is the only fix; the slug is not editable afterwards.
- **target-platform-name** — one of the canonical slugs from Phase 2, verbatim.

Validation is part of this phase, not a hope: after generating names, parse every one back against `^(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})_([A-Za-z][A-Za-z0-9-]*)_([a-z0-9][a-z0-9-]*)_(<slug-list>)\.(md|txt|csv|html|pdf)$` and check no platform has two posts in one slot. A name that fails the round-trip is fixed before writing content into it.

## Phase 5 — Write the posts

**Load the genre file for every selected platform before writing a line** — `references/platforms.md` names which of the three governs each platform. The genre file carries that genre's human baseline, the tells it produces, and its rules; the human-style rules further down this phase are global. Genre is what makes a post native to where it lands: the same content unit is one idea in a feed post, the same idea with the work shown in a long-form article, and the usable part first with the affiliation disclosed in a community. A campaign spanning several genres writes each post to its own genre file, not to an average of them.

**The content model: one unit, many platforms — never twice on one platform.** Each slot in the schedule carries one content unit; the unit fans out to every selected platform as the SAME core text, adjusted only for each platform's mechanics: trimmed to the verified length cap, hashtags formatted to the platform's norm, the CTA phrased for the platform ("link in bio" on instagram, the disclosure line on reddit, a title+body split on reddit and the article platforms, the hook above LinkedIn's "…see more" fold). Cross-platform repetition of a unit is by design — one post for different platforms is one content. The hard rule runs the other way: **within one platform, no two posts of the campaign may ever share the same text** — most platforms treat duplicate posts as spam and remove them or ban for them, so per-platform uniqueness is a publication requirement, not a style preference.

Rotate angles across the schedule so day 12 does not repeat day 2: feature spotlight · problem→solution · behind-the-scenes/build log · comparison (honest, from the Differentiators section) · practical tip the product enables · user-perspective story (only if sources contain one) · numbers update (only real numbers) · question to the community. Track which angle each slot used in the manifest.

**Link discipline — the marketing payload.** Exactly one primary product link per post, from the map's Links and CTAs section (article platforms may add a canonical or repo link where the genre expects one). Placement is craft, not a template: the link goes where the reader's interest peaks — inline at the first natural mention of the product inside the story ("ended up building <product> for exactly this — <link>"), or right after the payoff the post just delivered; on `reddit`, it belongs on the disclosure line; on `instagram`, the CTA is "link in bio" phrasing because captions don't link. A bio-CTA is only honest when the bio will actually carry the link: the post still stores the URL in its frontmatter `links`, and the manifest's **Profile prerequisites** section lists, per platform, the exact URL the profile bio must contain (UTM included when enabled) — `awesome-content-publisher` verifies that before posting. **One bio holds one destination for the whole campaign, so a bio-CTA may never name a page specific to its own post.** "The full pricing table is behind the bio link" is a promise the bio cannot keep once the next post says the same about a different page; the honest form locates the content on the site and lets the bio link be the site ("the rates are on the site, link in bio"). The alternative, a bio edit per post, is allowed only if every one of those edits is an explicit scheduled step in the manifest. Prefer adding the campaign URL to a bio over overwriting a link already there: a profile link is permanent attribution and a campaign is not. Vary the CTA wording across posts — one closing line with one URL stamped verbatim on every post is the campaign-bot signature both moderators and readers recognize. Never open with the link, never paste it twice in one post, never wrap it in a shortener (platforms distrust them, readers can't preview them). With UTM tracking on, parameters are appended per platform — the `utm_campaign` the user chose in the interview, identical on every post — while any visible link text stays the clean domain.

Human-style rules, distilled from `awesome-humanize-en`, `awesome-document-style`, and the `awesome-slop-audit` catalog — binding for every post:

- Vary sentence rhythm; a post of uniform medium sentences reads machine-made.
- No AI-vocabulary tier-1 words (delve, seamless, robust, tapestry, testament, boasts, leverage-as-verb), no "it's not X, it's Y" contrast frames, no forced rule-of-three, no negative-parallelism countdowns ("No X. No Y. Just Z.").
- No em-dash saturation; prefer straight quotes, hyphens, comma-set clauses. No arrow glyph (`→`) as a prose connective (`problem → solution`, `before → after`) — say the relation in words; an arrow survives only as real notation or a UI path (`File → Save`).
- Emoji per the interview choice (question 10): "none" means zero, everywhere; "sparing" means an emoji only where the platform's genre genuinely uses one — never emoji-bullet walls, never decoration; a custom rule is applied as stated. Bold-lead list stacks stay banned regardless.
- Where emoji are in play, they punctuate rather than decorate: the emoji lands right after the phrase that earned the reaction and reports what it was (🤯 on the unexpected number, 🧐 on the caveat, 🤑 on the cost). Budget 0 to 5 for a whole text, scaled to length — none or one in a micro-post, one or two in a medium feed post, three to five spread across a long article, with real distance between any two. Headings on the long-form platforms are a second valid placement (`## What it costs to leave one running 🤑`), on two or three headings out of five and never on all of them; headings and body share the one budget.
- The link belongs to the sentence that points at it, on the same line after a colon or a space. A URL alone between two paragraphs is the shape of an assembled post, not a written one — the only exception is a composer that needs the bare URL to build a preview card, established by the live check rather than assumed.
- Tags that have their own field in the composer never appear in the body: the article platforms and `tumblr` carry them as a `tags` frontmatter list, and a trailing line of bare words (`ai machine-learning video news`) publishes as literal text. Inline `#hashtags` stay in the body only where that platform's natives write them there.
- No invented idiom — "proved it the blunt way", "a figure worth stopping on" — a phrase shaped like a saying with no saying behind it is machine phrasing. Say what happened in ordinary words.
- No summary-stamp openers ("In conclusion", "TL;DR:" as a stamp), no fake-candor openers ("Let's be honest"), no hype closers ("The future looks bright").
- Counts and versions as digits; claims from the knowledge map only, with the map's exact numbers.
- No trademark word carrying its ordinary meaning: `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`, `teams`, `windows`. The reader sees the company, not the noun, and on a post about software the misread is instant — write the plain synonym (head start, margin, band, idea, disagreement) and keep the word only where the post genuinely is about that company. Body, title, alt text, hashtags and any words on a graphic alike.
- Hashtags per the platform's researched norm — a handful where they drive discovery (mastodon, instagram), few-to-none where they read as spam (reddit has none at all).
- Disclosure where required: on Reddit and anywhere promo rules demand it, the affiliation is stated plainly ("I built this" / "we make this").

Voice per the interview, held consistently across every post and platform. When question 9 produced a voice profile (from `awesome-content-voice`, or a style guide from `awesome-style-mimic`), read it in full and apply it on top: its rhythm, lexicon, opener and closer habits, and its per-platform register where it has one. What wins what, when two of these disagree:

1. **The knowledge map** — facts never bend to voice.
2. **Platform mechanics and the link discipline** — a cap is a cap, a disclosure is a disclosure.
3. **The genre file** — where the post lands sets its shape.
4. **The voice profile** — how this author sounds, including the habits its *Personal tics* section protects. Those tics are exempt from the slop pass in Phase 6: an em-dash habit or a stock sign-off that the profile recorded as the author's own is not a finding.
5. **The human-style defaults below** — the floor when nothing above has an opinion.

A profile section marked "sample too thin" or a profile stamped `confidence: low` carries less weight than the genre file, not more: say so in the report rather than writing a platform's posts to a register nobody observed.

## Phase 6 — Self-audit (before delivery, always)

**Two stages, never merged: list every finding across the whole batch first, then fix.** Editing while reading collapses the audit onto whichever defect is most salient and goes blind to the rest, and a rewrite performed without the full list leaves the surviving tells *more* visible rather than fewer — paraphrase does not remove structure. So: run the passes below in detection mode, each finding quoting the span it is about, then fix post by post, deepest layer first.

**One pass at a time.** A single read against the whole rule list finds one dimension and misses the others; the passes are cheap and the combined read is what fails.

1. **Structure pass** — runs first, because it is the layer a later rewording cannot repair.
   - *Outline test*: list the opening line of every post in the batch, per platform, and read them as a list. A clean progression that summarizes the campaign means the batch was generated to a template.
   - *Question sequence*: what question does each post answer? A batch that walks *what is it → why it matters → how to use it → what's next* is a machine shape; so is a long post whose sections do the same internally.
   - *Position tells*: uniform paragraph and post lengths across the batch, the key line always closing the post, lists of exactly three everywhere, the same connective at every turn, the CTA always in the same position.
   - *Stance*: a comparison with no verdict, a recommendation with no condition that would change it, a post with no opinion the reader could disagree with.
   - *Shape variety*: openers and closers repeated across the batch even when the text differs.
2. **Slop pass** — vocabulary and syntax, against the Phase 5 rule list; if `awesome-humanize-en` is installed, use its catalogs and its structure pass. **Habits listed in the voice profile's *Personal tics* section are not findings** — that section exists to stop this pass from deleting the author's actual voice.
3. **Length pass** — count characters per post (a script or `wc -m`, not eyeballing) against the Phase 3 limit for its platform, including hashtags and links. Over-limit → rewrite shorter, never plan on "the platform will truncate".
4. **Claim pass** — spot-check every number and factual claim against the knowledge map, including words rendered inside generated graphics; anything not in the map is removed or moved to the Unverified list and surfaced.
5. **Uniqueness pass** — the hard one: no two posts on the SAME platform share the same text, exact or near-verbatim (normalize whitespace, links and hashtags, then compare; a trivially reworded copy counts as a duplicate). A collision is rewritten before delivery, never shipped. Cross-platform copies of one unit are the design, not a finding. Softer bar on top: no two units on one platform share an opening line or an angle+claim pair.
6. **Link pass** — every post carries the primary link or its platform CTA equivalent; each link actually resolves (request it, don't assume); placement and CTA wording vary across the batch — no stamped closing line; UTM parameters correct where requested, with the user-chosen `utm_campaign` identical on every post; every bio-CTA post ("link in bio") carries its URL in frontmatter `links` and appears in the manifest's Profile prerequisites, and what each bio-CTA promises is satisfiable by the single bio URL recorded there — a CTA naming a page the bio will not hold is a finding, not a nuance. Every platform that needs a `target` has one.
7. **Media pass** — every `attachments` entry exists on disk, its format matches the platform's verified specs, every media-required post has one, alt text present where the platform supports it; converted assets re-verified (dimensions match the original, quality ≥ 95, transparency handled or flagged), generated assets re-verified against `references/media-graphics.md` (dimensions, legibility, the file opens).
8. **Filename pass** — the Phase 4 round-trip parse, re-run on the final set.

**The gate — how much to change is decided by the count, not by feel.** Per post, from passes 1 and 2:

| Findings | Action |
| --- | --- |
| Any structural finding from pass 1, or 3+ findings total | Rewrite the post from its angle. Patching a structural defect with word choice is what produces text that reads scrubbed rather than written |
| 1–2 vocabulary or syntax findings | Fix in place |
| None | Ship it |

A rewritten post re-enters at pass 1 — its replacement is new text and has not been audited.

**Fix operations skew replace and delete over insert.** The only fix that may lengthen a post is real specificity taken from the knowledge map; a cliché replaced by a blander paraphrase, or a cut line replaced by generic description, makes the post worse in the exact way that reads machine-made.

**Over-correction advisory.** Report, do not "fix": a post with no contraction anywhere, deliberately jagged sentence lengths, a rarity in every line, zero plain sentences. Scrubbing every tell produces its own recognizable signature. Slack is part of human writing — leave a post its ordinary sentence.

Findings and fixes are reported, not silently absorbed: the final report states what each pass caught, how many posts hit each gate row, and any advisory left standing.

## Phase 7 — Output

Everything lands in `content-campaign/<slug>/posts/`, one file per post in the chosen format, named per Phase 4.

- **`.md`** (default) — YAML frontmatter + body. Frontmatter is the machine-readable contract `awesome-content-publisher` reads; the filename is its fallback:

```yaml
---
platform: facebook-group
scheduled: 2026-09-01 10:00
timezone: Europe/Kyiv
title: "Post title as published"
target: "https://www.facebook.com/groups/example"   # subreddit / instance / board / group — when the platform needs one
attachments:                                         # relative to the campaign folder, must exist;
  - file: media/launch-demo.png                      # a plain path string is also accepted
    alt: "Terminal showing the account switch command"
links: ["https://example.com"]
hashtags: []
status: draft
---
```

- **`.txt` / `.html`** — the same metadata as a plain header block (`Key: value` lines / a `<pre>` metadata block), then the body. No CSS in the HTML — semantic tags only.
- **`.csv`** — header row + one data row per file (columns: date, time, timezone, platform, title, target, body, attachments, links, hashtags, status). Kept per-post so the naming scheme holds for every format.
- **`.pdf`** — generated from the `.md` via an installed converter (`pandoc --version` exits 0; otherwise say so and deliver `.md` with instructions). The `.md` sources are kept alongside — PDF is for humans; a publisher reads the `.md`.

Plus the manifest `content-campaign/<slug>/campaign.md`: interview answers, the voice profile used (path and its confidence stamp, or "none"), per-platform limits table with checked-on dates and whether each value was freshly verified or reused from `platform-cache.md`, per-platform best-time windows with sources (or a fallback mark), per-platform overrides, the Profile-prerequisites section (per platform, the exact URL the profile bio must carry for bio-CTA posts), the full schedule table (slot, platform, title, angle, file), which media assets were generated rather than supplied, and the Unverified-claims list.

## Verification

The final report cites evidence, not intentions: N posts across M platforms and D days, all filenames parse-verified, all lengths counted against limits checked on <date> (naming which were reused from the cache and how old those entries are), every posting time traced to a researched best-time window (or marked as a fallback default), every audit pass run with its findings listed and the gate row each post landed on, manifest path, voice-profile status (none by choice, or the profile path with its confidence stamp and the platforms whose sample was too thin), how many media assets were generated locally, and — explicitly — any post or platform that could not be completed and why. Two coverage claims belong in the report and cannot be left implied: every platform the product already has an account on, per the map's Links and CTAs, is either selected or was explicitly declined by the user; and every bio-CTA's promise is satisfiable by the single bio URL recorded in Profile prerequisites. Anything unverifiable (a platform whose limits could not be confirmed, a claim the user asked to keep despite no source) is stated, never implied as fine.

## Anti-patterns

- Two posts with the same text on one platform — the one repetition that is forbidden; cross-platform copies of a unit are fine, per-platform duplicates never are.
- Invented numbers, users, testimonials, or roadmap promises — the map is the boundary.
- Writing platform limits from memory, or baking today's numbers into `references/platforms.md` (that is why it has none — dated values live in `platform-cache.md`, and a cache entry is reused only while its date says it may be).
- Ignoring subreddit/group rules and shipping posts moderators will remove.
- AI-slop tells surviving into delivery because "it's just social copy" — short text shows the tells faster, not slower.
- Asserting posting times from memory instead of the researched, source-cited windows — or presenting any best-time heuristic as a law rather than a starting point the user can override.
- Loose files in the invocation root — everything belongs under `content-campaign/<slug>/`.
- Filler posts that never touch the product, and link-first posts that are nothing but the product — both miss the campaign's point.
- One CTA line with one URL stamped verbatim across the batch, or links wrapped in shorteners.
- A bio-CTA promising a page the single bio link will not hold, or a Profile prerequisite written to paper over that mismatch instead of fixing the CTAs.
- Deciding the platform set from the sources — the stack, the audience, the accounts found in Phase 1 — instead of asking question 4 with the full list every run; the same applies to shortening the list to "the ones that fit this product" before the user sees it.
- A platform the product already posts on left out of the campaign because the canonical slug list did not carry it, or a post shipped without the `target` its platform needs.
- Re-deriving a voice inside the campaign instead of reading the profile `awesome-content-voice` produced, or treating a `confidence: low` profile as observed fact.
- Deleting a habit the voice profile's *Personal tics* section protects because the slop pass recognizes the shape.
- Auditing and rewriting in the same read, or rewriting a post before the whole batch has been listed — both are how a batch ends up scrubbed on the surface and templated underneath.
- Writing words onto a generated graphic that no source supports, or presenting a rendered still as a substitute for the video a platform requires.
- Letting bulk source text into the conversation context instead of dumping to disk.
