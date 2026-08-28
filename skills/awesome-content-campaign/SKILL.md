---
name: awesome-content-campaign
description: "Builds a scheduled batch of platform-fit content-marketing posts from any sources the user provides — repositories, websites, local files, source code: source analysis distilled into a knowledge map, every claim traced to evidence, an interview for voice, frequency, duration, platforms, output format and timezone, live checks of each platform's current limits, then one post file per slot named YYYY-mm-dd_HH-mm_<timezone>_<title>_<platform>.<ext> plus a campaign manifest — the product link embedded where it reads natural in every post, media assigned per post, written to read human and self-audited against AI-slop tells. Use when asked to 'create a content marketing campaign', 'write a batch of posts about my product', 'plan a week of posts', or in Russian 'создай посты для продвижения', 'контент-план', 'посты для соцсетей на неделю'. Do not use to publish the posts — use awesome-post-publisher; not to learn a site's voice — use awesome-style-mimic; not to de-slop existing text — use awesome-humanize-en."
license: MIT
metadata:
  author: Khasky
  tags: ["marketing", "content", "social-media", "writing", "scheduling"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-campaign"
---

# Content Campaign

Turn raw product knowledge into a batch of dated, platform-fit posts a publisher (human or `awesome-post-publisher`) can ship on schedule. The pipeline: ingest sources → knowledge map → interview → own-voice profile (opt-in, browser) → live platform research → schedule → write → self-audit → files + manifest.

**Core principle: every claim in every post traces to the knowledge map, and every map entry traces to a source.** A post may persuade, but it may not invent — no fabricated numbers, testimonials, user counts, benchmarks, or "coming soon" features the sources do not support. A claim that cannot be verified is dropped or explicitly flagged to the user, never smoothed into fluent copy. The second principle: the posts must read human — the self-audit phase is not optional. The third: **every post markets the product** — it carries the campaign's primary link (or the platform's equivalent CTA where caption links are dead), placed where it reads as the natural next step of the post, never as an ad stamp. A post that delivers value but never touches the product is filler; a post that is only the link is spam; the craft lives in the span between.

Bundled files (load on demand):

- `references/platform-profiles.md` — structural notes per supported platform: genre, register, format capabilities, media requirements, promo-policy landmarks, and the checklist of volatile limits to verify live. Deliberately carries no character-cap numbers — those rot; Phase 3 fetches them fresh.

## Invocation

```
/awesome-content-campaign <source> [<source> …]
```

Sources are anything: a repository URL or local path, a website URL, files or folders on disk, pasted text. No sources given → ask for at least one before doing anything else.

## Phase 1 — Ingest sources and build the knowledge map

Working state lives in `content-campaign/<slug>/` (slug proposed from the product name, confirmed in Phase 2): `sources/` for dumps, `knowledge-map.md` for the distilled result. That one subfolder, created under the invocation directory, holds EVERYTHING this skill writes — working state, posts, media, manifest; the skill never drops loose files into the invocation root. Invoked inside a git repository → the folder will sit untracked: say so and ask whether to keep it there, add a `.gitignore` entry, or point the campaign at a folder outside the repo. Large source text stays OUT of the conversation context — dump to disk, analyze from disk (the same discipline `awesome-style-mimic` uses for its crawl corpus: context compaction must not be able to lose source data).

Per source type:

- **Website URL** — prefer a live browser (Playwright MCP or equivalent) so JS-rendered content is not silently missed; a plain HTTP fetch tool is acceptable for static pages but say which was used. Crawl only what the topic needs (product pages, docs, changelog, pricing, about) — this is targeted reading, not a full-site crawl. Dump extracted text per page into `sources/`.
- **Repository (URL or path)** — read `README`, docs, changelogs, release notes, manifests (`package.json` and kin), and the public surface of the code (exported APIs, CLI help strings, feature flags). Clone shallow if remote. The code is the strongest evidence: a feature the README claims but the code lacks goes into the map as *unverified*.
- **Local files/folders** — read directly; folders get a file inventory first, then the prose-bearing and fact-bearing files.
- **Pasted text** — save into `sources/` so it survives compaction like everything else.

For large corpora (>30 files), fan out read-only subagents per batch writing observations to `sources/analysis-N.md`. Resource preflight before spawning: cap concurrency at `min((cores−1)×0.75, free_gb×0.7/per_agent, 6)`, `per_agent` ≈ 0.7 GB; go serial if CPU load > 85% or free RAM < 2×per_agent; if the runtime caps sub-agent concurrency itself, defer to it.

`knowledge-map.md` has fixed sections, each entry carrying its source reference (`file:line`, URL, or dump filename):

- **Product facts** — what it is, who it is for, pricing, platforms, install path.
- **Features with evidence** — one line per feature, with where the source proves it.
- **Numbers** — versions, counts, benchmarks, dates. Only numbers a source states; each with its reference.
- **Audience and pains** — who buys and what hurts, as far as the sources show.
- **Differentiators** — versus what alternatives, on what grounds.
- **Lexicon** — the product's own terms, spelled the way the sources spell them.
- **Links and CTAs** — the URLs posts may point to (site, repo, store listing, docs).
- **Unverified** — claims found in marketing-ish sources that code/docs do not confirm. These may NOT appear in posts unless the user explicitly confirms them.

**Gate:** present a one-screen summary of the map plus an assumptions block (audience, goal of the campaign, primary CTA). The user corrects or confirms before any writing. If the user wants the posts in a specific brand voice learned from a site and `awesome-style-mimic` is installed, run its Learn mode now and treat the produced style guide as binding for Phase 5.

## Phase 2 — Interview

Ask in one round (use the agent's structured-question UI when available; plain questions otherwise). Every question has a custom escape hatch.

1. **Voice** (pick one): first person singular ("I" — solo builder promoting own work) · first person plural ("we" — company/team) · neutral third person (product described from outside) · custom (user describes, or names a style guide from `awesome-style-mimic`).
2. **Frequency** (pick one): 1/day · 2/day · 3/day · custom.
3. **Duration** (pick one): 1 day · 3 days · 7 days · 14 days · 1 month · custom.
4. **Platforms** (multi-select, ALL checked by default): `facebook-wall` · `facebook-group` · `linkedin` · `reddit` · `tumblr` · `mastodon` · `bluesky` · `x` · `wonderful-dev` · `hackernoon` · `devto` · `patreon` · `ko-fi` · `buymeacoffee` · `instagram` · `tiktok` · `bastyon` · `pinterest` · `vk` · other (user names it; research it in Phase 3 like the rest). These slugs are the canonical vocabulary — filenames use them verbatim, and `awesome-post-publisher` parses against the same list.
5. **Output format** (pick one): `.md` (default) · `.csv` · `.txt` · `.html` · `.pdf`. Plain text and basic formatting only — no CSS styling anywhere.
6. **Publication timezone** — accept any sane form ("Kyiv", "UTC+2", "America/New_York") and normalize to an IANA name; confirm the normalization back ("Kyiv → Europe/Kyiv, currently UTC+3 — correct?").
7. **Media** — does the user have images or videos for the posts? Collect folder path(s) and any explicit per-post wishes ("the demo video goes with the launch post" — an explicit mapping always wins in Phase 4). `instagram`, `tiktok`, `pinterest` cannot post without media — none available and none planned → recommend excluding those platforms rather than shipping unpostable drafts.
8. **Link tracking** — ask explicitly, never silently default: append UTM parameters to campaign links? Options: no (default) · yes. On yes: `utm_source` is the platform slug, `utm_medium` matches the platform kind (social / article / community), and the `utm_campaign` value is the user's call — one value for the whole campaign, every post. Propose 2–3 candidates (the campaign slug, slug + month, a launch tag) and let the user pick one or type their own; never silently derive it.
9. **Own-voice calibration** (yes/no, default no) — analyze the user's existing posts on the selected platforms through their logged-in browser and distill a personal style file applied on top of the chosen voice. Yes requires the Playwright MCP `--extension` bridge and runs Phase 2b; no skips Phase 2b entirely — the rest of this skill needs no browser bridge.

Per-platform targets that posting requires — collect now, not at write time: group URL for `facebook-group`, subreddit for `reddit`, instance domain for `mastodon`, board for `pinterest`, wall/community for `vk`.

## Phase 2b — Own-voice profile (opt-in, browser)

Runs ONLY on a yes to question 9 — never by default, never silently. The point: the campaign should sound like the person whose accounts it lands on, and the best evidence of that voice is what they already posted.

**Bridge and login preflight** (same discipline as `awesome-post-publisher`): list tabs — a lone `about:blank` means the bridge is not attached; offer to fix it or continue without own-voice, never degrade silently. Never touch the bridge's own `connect.html` tab; open ONE working tab and reuse it; warn the user the browser is busy. Then, per selected platform, read the logged-in state (read-only — a login form vs the user's avatar; no clicks into settings, no typing). Logged out → offer: wait for the user to log in themselves, or skip that platform's sample. Login itself is never automated.

**Collect** — read-only navigation to the user's own profile/activity per logged-in platform; extract their own recent posts (their authored posts, not reshares or others' comments), up to ~20 per platform, dumped to `content-campaign/<slug>/own-posts/<platform>.md` — post text stays out of the conversation context, same as source dumps.

**Distill** into `content-campaign/<slug>/own-style.md` with fixed sections: **Register per platform · Rhythm** (sentence-length habits, contraction rate) **· Lexicon** (favorite words, emoji and hashtag habits) **· Openers and closers actually used · Never does** — plus 3–5 verbatim excerpts labeled with platform. Honesty floor: fewer than ~5 own posts on a platform → record "sample too thin" for it and do not invent a style. If the user's own posts carry AI-slop tells, those are noted but NOT inherited — the Phase 6 audit outranks mimicry.

## Phase 3 — Live platform research

For every selected platform, verify the CURRENT constraints — by web search or by loading the platform's own help pages, dated today. Never answer from memory: caps, link policies, and promo rules change, and a post written to a stale limit fails at publish time.

Per platform, record in the manifest with a checked-on date: post length cap (and whether it differs by account tier — X notably does), media formats and whether media is mandatory, link handling (clickable? previewed? deprioritized?), hashtag norms, editor type (plain / markdown / rich), promo and disclosure rules, and anything that gates publication (group admin approval, editorial review on hackernoon, subreddit rules). `references/platform-profiles.md` lists what to look for per platform; it deliberately does not carry the numbers.

**Reddit gets extra diligence:** fetch the chosen subreddit's rules and check them for self-promotion restrictions. A subreddit that bans promotion gets flagged to the user with the option to pick another target — writing a post that moderators will remove is worse than writing none.

**Best time to post** — a second research pass, per platform: current best-time-to-post guidance from engagement studies and the platform's own creator resources, recorded in the manifest with source and checked-on date. These are aggregate heuristics, not laws — prefer windows over minute-precision claims, convert them into the publication timezone (studies state audience-local times), and note when sources disagree instead of averaging them into false confidence. The user's own knowledge of their audience, when stated, overrides the research.

Surface conflicts between the interview and reality now: article platforms (`hackernoon`, `devto`) at 3/day for a month is spam by any editorial standard — propose a per-platform frequency override (e.g., 1–2 articles per campaign) and let the user decide. Record all overrides in the manifest.

## Phase 4 — Schedule, media assignment, and filenames

Compute slots from frequency × duration in the publication timezone. The frequency is the user's; the concrete times are the Phase 3 best-time windows, per platform — each platform's slots land inside its researched window, on a varied minute rather than :00 every day, which also spreads platforms so 5 do not all fire in the same minute. A platform whose research came up empty falls back to generic defaults (1/day: 10:00 · 2/day: 10:00, 17:00 · 3/day: 09:00, 13:00, 18:00), marked as fallback in the manifest. An explicit user preference overrides both.

Media is assigned here, once the slots exist. Inventory the user's media (file, type, dimensions where obtainable) and copy the used files into `content-campaign/<slug>/media/` so the campaign folder is self-contained and the publisher's relative paths resolve. Assignment order: an explicit user mapping wins; otherwise assign by relevance to the slot's angle and guarantee one asset for every media-required post. Media is the soft side of the uniqueness rules: when the library is too small to cover the whole duration, an asset may repeat occasionally (avoid back-to-back on one platform when possible) or a media-optional post may simply go without — media repetition and media gaps are acceptable; text repetition on one platform never is. Verify each assigned file's format against the Phase 3 specs for its platform — a mismatch gets flagged with a conversion suggestion, never silently dropped or silently converted. Each image gets alt text where the platform supports it, written as a description of the image, not a keyword pile.

Filename per post:

```
YYYY-mm-dd_HH-mm_<pub-timezone>_<full-post-title>_<target-platform-name>.<ext>
```

Exactly 5 fields separated by `_`; inside a field only `-` (never `_`, which would break parsing):

- **pub-timezone** — the IANA name with `/` and `_` replaced by `-`: `Europe/Kyiv` → `Europe-Kyiv`, `America/New_York` → `America-New-York`. The frontmatter keeps the real IANA name; the filename token is display and fallback.
- **full-post-title** — lowercase ASCII kebab-case slug of the title, ≤ 50 chars (Windows path limits are real).
- **target-platform-name** — one of the canonical slugs from Phase 2, verbatim.

Validation is part of this phase, not a hope: after generating names, parse every one back against `^(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})_([A-Za-z][A-Za-z0-9-]*)_([a-z0-9][a-z0-9-]*)_(<slug-list>)\.(md|txt|csv|html|pdf)$` and check no platform has two posts in one slot. A name that fails the round-trip is fixed before writing content into it.

## Phase 5 — Write the posts

**The content model: one unit, many platforms — never twice on one platform.** Each slot in the schedule carries one content unit; the unit fans out to every selected platform as the SAME core text, adjusted only for each platform's mechanics: trimmed to the verified length cap, hashtags formatted to the platform's norm, the CTA phrased for the platform ("link in bio" on instagram, the disclosure line on reddit, a title+body split on reddit and the article platforms, the hook above LinkedIn's "…see more" fold). Cross-platform repetition of a unit is by design — one post for different platforms is one content. The hard rule runs the other way: **within one platform, no two posts of the campaign may ever share the same text** — most platforms treat duplicate posts as spam and remove them or ban for them, so per-platform uniqueness is a publication requirement, not a style preference.

Rotate angles across the schedule so day 12 does not repeat day 2: feature spotlight · problem→solution · behind-the-scenes/build log · comparison (honest, from the Differentiators section) · practical tip the product enables · user-perspective story (only if sources contain one) · numbers update (only real numbers) · question to the community. Track which angle each slot used in the manifest.

**Link discipline — the marketing payload.** Exactly one primary product link per post, from the map's Links and CTAs section (article platforms may add a canonical or repo link where the genre expects one). Placement is craft, not a template: the link goes where the reader's interest peaks — inline at the first natural mention of the product inside the story ("ended up building <product> for exactly this — <link>"), or right after the payoff the post just delivered; on `reddit`, it belongs on the disclosure line; on `instagram`, the CTA is "link in bio" phrasing because captions don't link. Vary the CTA wording across posts — one closing line with one URL stamped verbatim on every post is the campaign-bot signature both moderators and readers recognize. Never open with the link, never paste it twice in one post, never wrap it in a shortener (platforms distrust them, readers can't preview them). With UTM tracking on, parameters are appended per platform — the `utm_campaign` the user chose in the interview, identical on every post — while any visible link text stays the clean domain.

Human-style rules, distilled from `awesome-humanize-en`, `awesome-document-style`, and the `awesome-slop-audit` catalog — binding for every post:

- Vary sentence rhythm; a post of uniform medium sentences reads machine-made.
- No AI-vocabulary tier-1 words (delve, seamless, robust, tapestry, testament, boasts, leverage-as-verb), no "it's not X, it's Y" contrast frames, no forced rule-of-three, no negative-parallelism countdowns ("No X. No Y. Just Z.").
- No em-dash saturation; prefer straight quotes, hyphens, comma-set clauses.
- No emoji-bullet walls and no bold-lead list stacks; an emoji where the platform's genre genuinely uses one (a single one on a casual platform) is fine, decoration is not.
- No summary-stamp openers ("In conclusion", "TL;DR:" as a stamp), no fake-candor openers ("Let's be honest"), no hype closers ("The future looks bright").
- Counts and versions as digits; claims from the knowledge map only, with the map's exact numbers.
- Hashtags per the platform's researched norm — a handful where they drive discovery (mastodon, instagram), few-to-none where they read as spam (reddit has none at all).
- Disclosure where required: on Reddit and anywhere promo rules demand it, the affiliation is stated plainly ("I built this" / "we make this").

Voice per the interview, held consistently across every post and platform. If Phase 2b produced `own-style.md`, apply it on top of the chosen voice — rhythm, lexicon, opener/closer habits, per platform where it has a section; it refines the sound and never overrides the knowledge map, the link discipline, or the human-style rules above. If a style guide from `awesome-style-mimic` is in play, its lexicon and rhythm rules override these defaults where they conflict; own-style wins over both on platforms where it has a real sample — it is the user's actual voice.

## Phase 6 — Self-audit (before delivery, always)

1. **Slop pass** — re-read every post as if it were foreign text against the Phase 5 rule list; if `awesome-humanize-en` is installed, use its catalogs for the pass. Fix findings; a post that needed a wholesale rewrite goes through the pass again.
2. **Length pass** — count characters per post (a script or `wc -m`, not eyeballing) against the Phase 3 limit for its platform, including hashtags and links. Over-limit → rewrite shorter, never plan on "the platform will truncate".
3. **Claim pass** — spot-check every number and factual claim against the knowledge map; anything not in the map is removed or moved to the Unverified list and surfaced.
4. **Uniqueness pass** — the hard one: no two posts on the SAME platform share the same text, exact or near-verbatim (normalize whitespace, links and hashtags, then compare; a trivially reworded copy counts as a duplicate). A collision is rewritten before delivery, never shipped. Cross-platform copies of one unit are the design, not a finding. Softer bar on top: no two units on one platform share an opening line or an angle+claim pair.
5. **Link pass** — every post carries the primary link or its platform CTA equivalent; each link actually resolves (request it, don't assume); placement and CTA wording vary across the batch — no stamped closing line; UTM parameters correct where requested, with the user-chosen `utm_campaign` identical on every post.
6. **Media pass** — every `attachments` entry exists on disk, its format matches the platform's verified specs, every media-required post has one, alt text present where the platform supports it.
7. **Filename pass** — the Phase 4 round-trip parse, re-run on the final set.

Findings and fixes are reported, not silently absorbed: the final report states what each pass caught.

## Phase 7 — Output

Everything lands in `content-campaign/<slug>/posts/`, one file per post in the chosen format, named per Phase 4.

- **`.md`** (default) — YAML frontmatter + body. Frontmatter is the machine-readable contract `awesome-post-publisher` reads; the filename is its fallback:

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

Plus the manifest `content-campaign/<slug>/campaign.md`: interview answers, per-platform limits table with checked-on dates, per-platform best-time windows with sources (or a fallback mark), per-platform overrides, the full schedule table (slot, platform, title, angle, file), and the Unverified-claims list.

## Verification

The final report cites evidence, not intentions: N posts across M platforms and D days, all filenames parse-verified, all lengths counted against limits checked on <date>, every posting time traced to a researched best-time window (or marked as a fallback default), slop/claim/repetition passes run with their findings listed, manifest path, own-voice status (skipped by choice, or used — with per-platform sample sizes and the platforms whose sample was too thin), and — explicitly — any post or platform that could not be completed and why. Anything unverifiable (a platform whose limits could not be confirmed, a claim the user asked to keep despite no source) is stated, never implied as fine.

## Anti-patterns

- Two posts with the same text on one platform — the one repetition that is forbidden; cross-platform copies of a unit are fine, per-platform duplicates never are.
- Invented numbers, users, testimonials, or roadmap promises — the map is the boundary.
- Writing platform limits from memory, or baking today's numbers into a reusable file (recheck every campaign; that is why `references/platform-profiles.md` has none).
- Ignoring subreddit/group rules and shipping posts moderators will remove.
- AI-slop tells surviving into delivery because "it's just social copy" — short text shows the tells faster, not slower.
- Asserting posting times from memory instead of the researched, source-cited windows — or presenting any best-time heuristic as a law rather than a starting point the user can override.
- Loose files in the invocation root — everything belongs under `content-campaign/<slug>/`.
- Filler posts that never touch the product, and link-first posts that are nothing but the product — both miss the campaign's point.
- One CTA line with one URL stamped verbatim across the batch, or links wrapped in shorteners.
- Crawling the user's profiles without the question-9 opt-in, inventing an own-style from a too-thin sample, or inheriting slop tells because "that's how the user writes".
- Letting bulk source text into the conversation context instead of dumping to disk.
