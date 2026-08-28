---
name: awesome-post-publisher
description: "Publishes a prepared batch of scheduled posts to the user's own accounts through their live browser (Playwright MCP --extension bridge to Chrome): bridge preflight, post-source scan with hard-stop format validation, per-platform login checks with a wait-or-skip choice (login itself is never automated), a persistent ledger that survives restarts and prevents duplicate posts, timezone-mapped scheduling that can idle for days between posts, and strictly sequential, human-paced posting with read-back verification of every post and a confirmation gate before anything goes public. Use when asked to 'publish the campaign', 'post these files to my accounts', 'post on schedule', or in Russian 'опубликуй посты', 'публикуй по расписанию', 'запости в соцсети'. Do not use to write the posts — use awesome-content-campaign; not to crawl or learn a site — use awesome-style-mimic."
license: MIT
metadata:
  author: Khasky
  tags: ["marketing", "publishing", "social-media", "browser-automation", "playwright", "scheduling", "safety"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-post-publisher"
---

# Post Publisher

Take a folder of dated post files (the output contract of `awesome-content-campaign`, or anything matching it) and publish them to the user's own accounts, on schedule, through the user's own logged-in browser — the Playwright MCP `--extension` bridge to their live Chrome, so real sessions are used and no credential is ever handled.

**Why the ceremony:** every post is an outward-facing, public action on an account the user cares about. A duplicate post is embarrassing; a burst of scripted posts can get a legitimate account rate-limited or flagged; a post to the wrong group is not deletable by pretending it didn't happen. Each gate below closes one of those doors before it opens.

## Core principle

**NOTHING POSTS UNTIL FIVE THINGS HOLD:** the bridge is verified, the source is validated, login is confirmed on that platform, the ledger says this post has not been attempted, and the user has approved the run plan. And three things never happen at all: this skill never types credentials or automates login/2FA, never solves or bypasses a captcha or bot challenge (pause and hand the browser to the user), and never deletes or edits a published post except on the user's explicit per-item request.

This is for the user's own accounts and own content — one account per platform. Not for mass-account posting, engagement faking, vote manipulation, or pushing promo into communities whose rules forbid it. The human pacing below exists because platforms rate-limit and flag rapid scripted bursts even on legitimate accounts; pacing keeps normal use inside a normal envelope. It is not a toolkit for operating accounts at a scale or in a manner the platform prohibits — asked for that, decline.

Bundled files (load on demand):

- `references/platform-posting.md` — per-platform posting notes: login-state signal, composer location, flow outline, read-back verification, quirks — plus the generic flow for when the live UI has drifted from the notes.

## Invocation

```
/awesome-post-publisher <posts-folder> [--dry-run] [--platforms <slug,slug>] [--now]
```

- `<posts-folder>` — folder of post files; a `campaign.md` manifest beside them is used when present. No argument → ask for the source (folder, or another location the user names).
- `--dry-run` — run every preflight and print the full run plan; nothing is posted.
- `--platforms` — restrict to a subset of the canonical slugs.
- `--now` — ignore scheduled times; publish the backlog in order with safety spacing (still gated below).

## Phase 0 — Interview

Ask only what the flags didn't answer:

1. **Source** — the posts folder (or other source the user names).
2. **Pacing** — default: publish at each post's scheduled time from the filename/frontmatter. Alternatives: a fixed interval the user names, or `--now` backlog mode. Whatever the mode, per-platform safety spacing (Phase 7) still applies.
3. **Overdue policy** — posts whose scheduled time is already past: publish now in order with spacing (default) · skip and report · shift the whole schedule forward to start now. Never silently pick.

## Phase 1 — Preflight A: the bridge

The Playwright MCP `--extension` bridge to the user's own Chrome is required — that is where the logged-in sessions live. List tabs first: a lone `about:blank` means the bridge is not attached — stop and have the user connect it; never proceed on a spawned clean browser, which has no sessions and would only hit login walls. Never touch the bridge's own `connect.html` tab. Open ONE working tab and reuse it for everything. Warn the user the browser is busy while a publishing pass runs.

## Phase 2 — Preflight B: source scan (hard stop on any defect)

Scan the source and validate every post file:

- Filename parses as `YYYY-mm-dd_HH-mm_<pub-timezone>_<title>_<platform>.<ext>` — exactly 5 `_`-separated fields, platform one of the canonical slugs: `facebook-wall` · `facebook-group` · `linkedin` · `reddit` · `tumblr` · `mastodon` · `bluesky` · `x` · `wonderful-dev` · `hackernoon` · `devto` · `patreon` · `ko-fi` · `buymeacoffee` · `instagram` · `tiktok` · `bastyon` · `pinterest` · `vk`.
- Readable format: `.md` with frontmatter (preferred), `.txt`/`.html` with a metadata header block, `.csv` (header + row). `.pdf` is not machine-readable here — stop and point to the `.md` sources the campaign keeps alongside.
- Frontmatter agrees with the filename (platform, date, time, timezone); frontmatter is authoritative, but a mismatch is a defect, not a tiebreak.
- Required target detail present where the platform needs one (subreddit, group URL, instance, board, wall).
- Declared `attachments` exist on disk — entries are a plain path or `{file, alt}`, resolved relative to the campaign folder; a media-required platform (`instagram`, `tiktok`, `pinterest`) with no attachment is a defect.

**Zero posts found, or ANY validation error → hard stop.** List every defective file with what is wrong with it and how to fix it. A publisher that guesses its way past a malformed schedule posts the wrong thing at the wrong time.

Output of this phase: the platform set, post count per platform, date range — the input to the next two phases.

## Phase 3 — Preflight C: login per platform

For each platform in the set, navigate to it and read the logged-in state (signal per platform in `references/platform-posting.md`; read-only — no clicks into account settings). Classify: logged in · logged out · unknown (say why).

Any platform not logged in → present the list and offer the two honest options: **wait** (the user logs in manually in their browser — never in this skill's tool calls — then re-check) or **skip** those platforms and continue with the rest. Record the choice; skipped platforms appear in the final report as skipped, not silently absent.

## Phase 4 — Timezone map

Three timezones are in play and the ledger records all three: the publication timezone from the posts (IANA name from frontmatter), the browser's (`Intl.DateTimeFormat().resolvedOptions().timeZone` via a page evaluate), and the system's. Compute each post's due moment from its scheduled time in the publication timezone, converted per-date (IANA rules handle DST; never a fixed offset pinned at session start). Sanity-check: if browser and system disagree, say so — the schedule follows the publication timezone regardless, but the user should know their environment is split.

## Phase 5 — The ledger (persistent state, survives restarts)

`publish-state/ledger.json` beside the posts folder. Session memory is not state — a crashed or restarted session must resume without double-posting, and only a file on disk guarantees that.

Per post: file, platform, scheduled time (pub TZ) and computed due time, status (`pending` · `posted` · `unverified` · `failed` · `skipped` · `pending-approval`), attempt count, posted-at, post URL when captured. Plus the timezone map and the interview answers.

Rules: the ledger is consulted before EVERY post and written after EVERY state change. A post in `posted`, `pending-approval`, or `unverified` is never attempted again — `unverified` (submitted, but read-back could not confirm) is resolved by checking the platform feed first: found → promote to `posted`; provably absent → back to `pending`. On start, an existing ledger means resume: reconcile it against the folder (new files → `pending`; missing files → flag) and continue.

## Phase 6 — Run plan and the gate

Present the plan: a table of upcoming posts (file, platform, scheduled pub-TZ time, computed local time, status), the overdue handling about to apply, per-platform counts, and the platforms being skipped. `--dry-run` stops here, having printed exactly what a real run would do.

**Confirmation gate:** publishing is outward-facing and effectively irreversible — get an explicit yes on the plan before the first post of the run. One gate per run, not per post; the plan is what was approved, and any change to it (user edits a post, adds files) re-presents the plan.

## Phase 7 — Publishing loop (sequential, human-paced)

Strictly one post at a time, one platform at a time — never parallel tabs, never interleaved composers. Per due post:

1. Consult the ledger (Phase 5 rules).
2. Re-verify login on the platform (sessions expire mid-campaign); logged out → pause, offer wait-or-skip for this post.
3. Open the composer per `references/platform-posting.md`; when the live UI does not match the notes, re-derive from an accessibility snapshot — the notes are hints, the live DOM is the source of truth.
4. Fill like a person works: type with natural cadence (the type tool's delay, not instant value injection), pauses of 2–8 seconds between distinct actions, scroll to elements rather than teleporting. Media goes through the real file input; wait for the platform's upload/processing state to finish before proceeding — a submit racing an unfinished upload posts the text without its image — and set alt text where the platform offers the field and the attachment carries an `alt`.
5. Submit, wait for the platform's own confirmation state.
6. **Read back:** navigate to the profile/feed/board and confirm the post is actually visible; capture its URL. Visible → `posted` with URL. Submitted into a review queue (group approval, hackernoon editorial) → `pending-approval`, which is success for this skill — say so, don't wait for moderation. Not findable → `unverified`, no automatic retry.
7. Write the ledger.

Spacing: minimum 3–10 minutes (randomized) between posts on different platforms, and at least 2 hours between two posts on the SAME platform unless the schedule itself says otherwise — an overdue backlog does not get to fire 10 posts into one feed in one minute. `--now` mode respects both.

Failures: one retry after ≥ 10 minutes, and ONLY after a read-back proves the first attempt did not land (the duplicate check is the point of the ledger). Second failure → `failed`, move on, report. A captcha, challenge, or platform warning at any step → stop on that platform, tell the user, and let them resolve it in their own browser; never attempt to click through it.

## Phase 8 — Waiting between posts (hours or days)

Between due times, idle using whatever long-wait mechanism the agent runtime has (a scheduled wakeup, an interval loop). Long gaps are normal — a 2-week campaign means the session mostly waits. If the runtime cannot wait that long: write the ledger, print the resume command and the next due time, and end the turn — the ledger makes re-invocation resume exactly where the run stopped, with zero duplicates. Never busy-poll the clock in a tight loop.

## Phase 9 — Report

```text
Source:      <folder>   (<N> posts, <M> platforms, <date range>)
Posted:      <n> — each with platform, time, and the read-back URL
Pending:     <n> approval queues (facebook-group, hackernoon, …)
Skipped:     <n> (<platforms and why — not logged in, user choice>)
Failed:      <n> (<file: last error>)
Unverified:  <n> (submitted, not found on read-back — resolve before any retry)
Remaining:   <n> pending, next due <time> (<pub TZ> / <local>)
Ledger:      <absolute path>
```

Every number comes from the ledger, not from memory. Anything unverified is named as unverified — a submitted post without a read-back URL is never reported as published.

## Anti-patterns

- Posting in parallel, or blasting an overdue backlog without spacing — the fastest way to make a legitimate account look like a bot.
- Retrying a failure without first proving via read-back that it failed — that is how duplicates happen.
- Trusting session memory over the ledger, or keeping the ledger only in memory.
- Typing credentials, storing tokens, automating login or 2FA, or clicking through captchas and warning interstitials.
- A fixed UTC offset instead of per-date IANA conversion — half the campaign lands an hour off after a DST switch.
- Treating a review-queue submission as a published post, or as a failure.
- Editing or deleting published content as cleanup without an explicit per-item user request.
- Guessing selectors when the UI has changed instead of re-deriving from a fresh snapshot.
