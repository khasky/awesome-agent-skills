---
name: awesome-content-repurpose
description: "Repurposes one existing text — a published URL, a file, or pasted notes — into platform-native posts, then files them and optionally publishes: source notes every claim traces back to, an interview for platforms, voice, language and length, per-genre registers and dated platform limits reused from awesome-content-campaign, a two-stage anti-slop audit, and one dated file per platform in the format awesome-post-publisher takes, so publishing is a handoff, not a second implementation. Use when asked to 'repurpose this article into posts', 'adapt this for linkedin and x', 'turn this text into social posts', or in Russian 'адаптируй статью под соцсети', 'сделай посты из этого текста', 'перепиши текст под платформы'. Do not use to build a scheduled campaign from product sources — use awesome-content-campaign; not to publish a folder that exists — use awesome-post-publisher; not to build the voice profile — use awesome-voice-profile."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "repurposing", "social-media", "writing", "publishing"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-repurpose"
---

# Content Repurpose

One text in, one post per platform out, each written to that platform's register rather than trimmed to its cap. Then the posts are filed, and publishing them is one more step the user chooses.

**The rule that makes this skill different from writing posts from scratch: the source is the boundary.** A repurposed post may sharpen, cut and reframe, but it may not add a claim, a number or an implication the source does not carry, and it may not invert the source's point by compressing it. The text arrives settled — where it came from and whether it may be published are the user's business, decided before this runs.

This skill owns the repurposing craft and orchestrates the rest. It reuses, by reference rather than by restating:

- `references/platforms.md` (ships with `awesome-content-campaign`) — the canonical slug table: target detail per platform, media requirements, and which genre file governs each.
- `references/genre-micro-post.md`, `references/genre-long-article.md`, `references/genre-community-post.md` (same skill) — the register each genre demands.
- `references/media-graphics.md` (same skill) — offline HTML/CSS graphics when a platform requires media and none exists.
- `awesome-humanize-en` — the structure pass and pattern catalogs the Phase 5 audit runs.
- `awesome-voice-profile` — the author's voice, when a profile exists.
- `awesome-post-publisher` — everything about publishing: bridge, login, ledger, pacing, read-back.
- `awesome-translate-ru-en` — when the source language is not the output language.

## Invocation

```
/awesome-content-repurpose <url | file | pasted text> [--platforms <slug,slug>] [--publish]
```

No source given → ask for one before anything else. `--publish` is a preference recorded in Phase 2, not a bypass of the publisher's own confirmation gate.

## Phase 1 — Read the source, write the source notes

Get the text onto disk first — working state lives in `repurpose/<slug>/`, and that one folder holds everything this skill writes:

- **URL** — read it in a live browser when one is available so JS-rendered content is not silently missed; a plain fetch is fine for static pages, and which was used gets said. Save the extracted text to `repurpose/<slug>/source/`.
- **File** — read it directly; a folder gets an inventory first, then the prose.
- **Pasted text** — save it to `source/` on arrival, like everything else. Long source text stays out of the conversation context.

Then write `repurpose/<slug>/source-notes.md`, which every later phase is checked against:

- **The point** — one sentence: what this text argues or reports. Compression that contradicts this line is a defect, not an interpretation.
- **Supporting claims** — one line each, in the source's own terms.
- **Numbers** — verbatim, with the conditions the source attaches to them. A number without its condition is not repurposable.
- **Quotable lines** — 3 to 5 verbatim excerpts worth keeping intact, with their location.
- **Named things** — people, products, versions, places the source names, spelled the way it spells them.
- **What the source does NOT say** — the tempting adjacent claims a shorter version would drift into. This section exists because compression invents.

Present the point and the notes in one screen, then ask through the structured-question UI whether they are right (correct · the point is wrong, here is the right one · stop). Every gate in this skill works that way — this one, the interview, and the publish-or-file decision. A gate written as a closing sentence the user must answer in prose reads as narration and gets passed over.

## Phase 2 — Interview

One round, structured-question UI when available, custom answer always allowed.

1. **Platforms** — show the full slug table from `references/platforms.md`, nothing pre-selected, and collect the target detail each selected platform requires (subreddit, group URL, instance, board, channel, workspace, site). Two annotations, when the data exists: mark platforms where `publish-state/performance.md` shows the user's own median engagement, and mark platforms where the publisher's ledger already carries this source — repurposing into a feed that already has this piece is usually a mistake worth surfacing.
2. **Voice** — first person singular · first person plural · neutral third person · a voice profile from `awesome-voice-profile` (path; `voice/*.md` is where to look) · a style guide from `awesome-style-mimic`.
3. **Output language** — same as the source (default) · another language. A different language means the posts are written in it, not translated word for word; where the pair is Russian and English, `awesome-translate-ru-en` carries the rules.
4. **Length and shape per platform** — native to the platform (default) · deliberately short · thread or multi-part where the platform supports it and the content is genuinely sequential.
5. **Emoji and hashtags** — sparing per the platform's genre (default) · none · a rule the user states.
6. **What happens after the files exist** — publish now · publish at a time the user names · files only. Whatever the answer, the files are written first.

Media only comes up where a platform requires it: the library the user offers, an offline graphic per `references/media-graphics.md`, or dropping that platform. A platform needing video that has none is dropped; a still is not a video.

## Phase 3 — Platform check

For every selected platform, confirm the current constraints: length cap and whether it varies by account tier, media formats and whether media is mandatory, link handling, hashtag norms, editor type, and any promo or disclosure rule that applies to what is being posted. Reuse `platform-cache.md` when its entry is under 30 days old and say it was reused with its date; re-verify anything older. Community rules — a subreddit's, a group's, a server's — are re-read every run regardless of cache age, and a community that forbids link-drops or self-promotion is reported to the user with the option to pick another target.

## Phase 4 — Write

Load the genre file for each selected platform first; the register belongs to the genre, and this phase adds the repurposing craft on top.

**Compression is selection, not summarizing.** A 2,000-word article becomes one post about its sharpest single idea — not a synopsis, not a table of contents, not "here are the 5 takeaways" unless the source genuinely is five takeaways. The reader who never opens the original should still get something whole.

**One source, several angles.** Unlike a campaign fanning one unit across platforms, different platforms may legitimately take *different* ideas out of the same text: the argument goes where argument lives, the practical step goes where practitioners are, the number goes where numbers travel. Say in the manifest which idea each platform took.

Rules that hold across every platform:

- Numbers keep the conditions `source-notes.md` recorded. A benchmark without its machine, a percentage without its base, a claim without its scope is not a shorter version — it is a different claim.
- Quoted lines stay verbatim, inside quotation marks. A paraphrase presented as a quotation is a fabrication.
- The source's own terms and spellings survive; renaming its concepts to something punchier is how a repurposed post stops being about the source.
- Nothing from the "What the source does NOT say" section reaches a post.
- Threads only where the content is sequential, and each part must survive being read alone — the platform will show it alone.
- Voice per the profile when there is one, including the habits its *Personal tics* section protects; those are exempt from the Phase 5 slop pass.

## Phase 5 — Audit, two stages

List every finding across all posts first, then fix. Detection mixed into rewriting collapses onto one dimension, and a rewrite done without the full list leaves the structural tells more visible, not fewer. One pass at a time:

1. **Fidelity** — the post's point matches `source-notes.md`; every claim and number traces to it with its condition; quotations verbatim; nothing from the "does NOT say" section present. A post that fails here is rewritten, not patched.
2. **Structure** — the discourse pass from `awesome-humanize-en` (`references/structure-pass.md`): outline test across the batch, question sequence, position tells, stance, opener and closer variety.
3. **Slop** — vocabulary and syntax against that skill's catalogs, with the voice profile's protected tics excluded.
4. **Length** — counted, not eyeballed, against the Phase 3 cap for each platform, hashtags included.
5. **Media** — every declared attachment exists, matches the platform's verified formats, has alt text describing what the image says.
6. **Filename** — every name parses back against the contract in Phase 6.

**The gate, per post:** any fidelity finding, any structural finding, or three or more findings total → rewrite from the source notes; one or two wording findings → fix in place; none → ship. A rewritten post re-enters at pass 1. Fixes skew replace and delete over insert; the only addition allowed is specificity already present in the source notes. Report, do not "fix", posts that read scrubbed — no contractions anywhere, every line engineered, no ordinary sentence left.

## Phase 6 — Files, always

`repurpose/<slug>/posts/`, one file per platform, in the format `awesome-post-publisher` reads, named exactly as it expects:

```
YYYY-mm-dd_HH-mm_<pub-timezone>_<title>_<platform>.md
```

The scheduled time is the publish time chosen in Phase 2 (now, or the time the user named). Frontmatter carries `platform`, `scheduled`, `timezone`, `title`, `target` where the platform needs one, `attachments` with alt text, `links`, `hashtags`, `status: draft`.

Beside them, `campaign.md` — the name is the publisher's contract, not a claim that this was a campaign. It records the source, the notes the posts were checked against, per-platform limits with their checked-on dates, which idea each platform took, and any Profile prerequisite (a bio link a "link in bio" post depends on).

Files exist before anything is published. A run that fails at the third platform leaves seven finished posts on disk, and the publisher's ledger knows which two already went out.

## Phase 7 — Publish, or stop

Files only → the skill reports where they are and stops.

Publish now, or at a named time → hand the folder to `awesome-post-publisher`:

```
/awesome-post-publisher repurpose/<slug>/posts --now
```

Everything about publishing belongs to that skill and is not reimplemented here: the browser-bridge preflight, the login check with wait-or-skip, the ledger that survives a restart and prevents duplicates, the confirmation gate, the human pacing, the read-back of every post, the incident handling. Drop the `--now` when the posts carry real future times; it will wait for them.

That skill not installed → say so, leave the files, and print the command to run once it is. Nothing about the output depends on it.

## Verification

The report states: the source, the point extracted from it, N posts across M platforms with the idea each one took, all lengths counted against limits checked on their dates (naming cache reuse), every audit pass with its findings and the gate row each post landed on, filenames parse-verified, the folder path, and — when publishing ran — the publisher's own report rather than a restatement of it. Anything skipped (a platform dropped for want of media, a community whose rules forbid the post) is named, never implied.

## Anti-patterns

- Summarizing instead of selecting — the "5 key takeaways" post that reproduces the source's table of contents and gives the reader nothing whole.
- Inverting the source's point by cutting the qualifier that carried it.
- A number without the condition the source attached to it, or a paraphrase inside quotation marks.
- Adding the adjacent claim the source stopped short of — that is what the "What the source does NOT say" section is for.
- Publishing without files, or writing files the publisher cannot parse.
- Reimplementing any part of publishing, humanizing, or voice-building here instead of handing off.
- Repurposing into a feed the ledger shows already carries this source, without telling the user.
- Letting the whole source text into the conversation context instead of reading it from disk.
