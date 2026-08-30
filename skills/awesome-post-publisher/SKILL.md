---
name: awesome-post-publisher
description: "Publishes a prepared batch of scheduled posts to the user's own accounts through their live browser (Playwright MCP --extension bridge to Chrome or Edge): a preflight that names which browser and profile it attached to, post-source scan with hard-stop format validation, per-platform login checks with a wait-or-skip choice (login is never automated), a persistent ledger that survives restarts and prevents duplicate posts, timezone-mapped scheduling that can idle for days, strictly sequential human-paced posting with read-back verification of every post and a confirmation gate before anything goes public, plus an opt-in read-only harvest of what the published posts actually got. Use when asked to 'publish the campaign', 'post these files to my accounts', 'post on schedule', or in Russian 'опубликуй посты', 'публикуй по расписанию', 'запости в соцсети'. Do not use to write the posts — use awesome-content-campaign or awesome-content-repurpose; not to crawl or learn a site — use awesome-style-mimic."
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

- `references/browser-interaction.md` — how to click, type, attach media and confirm submission on UIs that defeat ordinary Playwright actions: the click ladder, file-input scoping, submit polling, read-back baselines. **Read this before the first composer of a run**, not after the third timeout.
- `references/platform-posting.md` — per-platform posting notes: login-state signal, composer location, flow outline, read-back verification, quirks — plus the generic flow for when the live UI has drifted from the notes.
- `references/platforms.md` — **not in this skill's folder**: it ships with `awesome-content-campaign` and holds the canonical slug table with each platform's required target detail and media requirement. Phase 2 validates against it; the fallback when that skill is absent is the platform sections of `platform-posting.md`.

## Invocation

```
/awesome-post-publisher <posts-folder> [--dry-run] [--platforms <slug,slug>] [--now] [--harvest]
```

- `<posts-folder>` — folder of post files; a `campaign.md` manifest beside them is used when present. No argument → ask for the source (folder, or another location the user names).
- `--dry-run` — run every preflight and print the full run plan; nothing is posted.
- `--platforms` — restrict to a subset of the canonical slugs.
- `--now` — ignore scheduled times; publish the backlog in order with safety spacing (still gated below).
- `--harvest` — publish nothing; read the engagement of posts already in the ledger (Phase 10).

## Phase 0 — Interview

Ask only what the flags didn't answer:

1. **Source** — the posts folder (or other source the user names).
2. **Pacing** — default: publish at each post's scheduled time from the filename/frontmatter. Alternatives: a fixed interval the user names, or `--now` backlog mode. Whatever the mode, per-platform safety spacing (Phase 7) still applies.
3. **Overdue policy** — posts whose scheduled time is already past: publish now in order with spacing (default) · skip and report · shift the whole schedule forward to start now. Never silently pick.

## Phase 1 — Preflight A: the bridge

The Playwright MCP `--extension` bridge to the user's own browser is required — that is where the logged-in sessions live. Extension mode attaches to Chrome or Edge; nothing else. List tabs first and read what you get:

- A lone `about:blank` → the bridge is **not** attached; you are on a spawned clean browser with no sessions, which would only hit login walls. Stop and have the user connect it. Extension missing entirely → point them at the install, in Chrome or Edge: <https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm> (source and setup: <https://github.com/microsoft/playwright/tree/main/packages/extension>), then re-run the preflight rather than proceeding on a spawned browser.
- A lone `connect.html` (the bridge's own relay page) → the bridge **is** attached and the user simply has no other tab open. This is normal. Never touch that tab; open one working tab beside it.
- The browser tools are listed but the session says the MCP server needs authentication → the bridge is configured and **not connected**. That is the token case, not a missing bridge and not a reason to look for another way to reach the platforms.

**Run the target gate before anything else, and get a yes.** A user may keep one browser for daily work and another holding the accounts this run posts to, each paired to its own Playwright MCP server with its own extension token — and the two are indistinguishable from a tab list. The full procedure is in `references/browser-interaction.md`: ask which bridge when the session exposes more than one, probe the engine and the signed-in identity, then state the browser and the profile and wait for confirmation. Naming it later in the run plan is not enough; by then the preflights have already run in whatever browser answered. **Wrong browser, or no bridge at all → ask for that browser's `PLAYWRIGHT_MCP_EXTENSION_TOKEN`**, shown on the extension's status page opened in it, put it in the MCP server entry for that browser, restart, and re-run the gate — the procedure and the status-page URL are in `references/browser-interaction.md`. Continuing in whatever browser happens to be attached is the one thing that is not allowed.

Open ONE working tab and reuse it for everything. Warn the user the browser is busy while a publishing pass runs.

## Phase 2 — Preflight B: source scan (hard stop on any defect)

Scan the source and validate every post file:

- Filename parses as `YYYY-mm-dd_HH-mm_<pub-timezone>_<title>_<platform>.<ext>` — exactly 5 `_`-separated fields, platform one of the canonical slugs. **The slug table lives in `references/platforms.md`, shipped with `awesome-content-campaign`**, and that one file is also where each platform's required target detail and media requirement are recorded; read it and validate against it. When that skill is not installed, fall back to the platform sections of this skill's own `references/platform-posting.md` — a slug with no section there is a slug this skill cannot post, which is a defect to report rather than a platform to improvise.
- Readable format: `.md` with frontmatter (preferred), `.txt`/`.html` with a metadata header block, `.csv` (header + row). `.pdf` is not machine-readable here — stop and point to the `.md` sources the campaign keeps alongside.
- Frontmatter agrees with the filename (platform, date, time, timezone); frontmatter is authoritative, but a mismatch is a defect, not a tiebreak.
- Required target detail present where the Target column of the slug table names one. A `facebook-wall` post with no target does not say which surface it is for, and guessing between a Page, a personal timeline and a group is not allowed.
- Declared `attachments` exist on disk — entries are a plain path or `{file, alt}`, resolved relative to the campaign folder; a platform the table marks media-required with no attachment is a defect.

**Zero posts found, or ANY validation error → hard stop.** List every defective file with what is wrong with it and how to fix it. A publisher that guesses its way past a malformed schedule posts the wrong thing at the wrong time.

Output of this phase: the platform set, post count per platform, date range — the input to the next two phases.

**Reconcile any platform list the user named against that set before planning anything.** `--platforms`, or a list given in conversation, is a *request*, not a fact about the folder. A user naming six platforms may be naming ones the campaign never wrote for, or one surface when the files target another. Report the difference explicitly and in the user's terms — "threads and telegram have zero posts in this campaign"; "the 28 facebook posts are `facebook-wall` targeting the Page, there are no `facebook-group` posts" — then plan only what exists. Never silently substitute a neighbouring slug, and never let a named-but-absent platform vanish from the report. If the gap means the user wants content that does not exist yet, say so: writing it is `awesome-content-campaign`'s job, not this skill's.

## Phase 3 — Preflight C: login per platform

For each platform in the set, navigate to it and read the logged-in state (signal per platform in `references/platform-posting.md`; read-only — no clicks into account settings). Classify: logged in · logged out · unknown (say why).

Any platform not logged in → present the list and offer the two honest options: **wait** (the user logs in manually in their browser — never in this skill's tool calls — then re-check) or **skip** those platforms and continue with the rest. Record the choice; skipped platforms appear in the final report as skipped, not silently absent.

**Bio-link check** — for platforms whose posts rely on a bio CTA ("link in bio" — typically `instagram`, `tiktok`; authoritative source: the manifest's Profile prerequisites section, falling back to the posts' frontmatter `links` when there is no manifest): open the user's own profile read-only and verify the bio actually contains the required URL. Missing → offer, in this order: the user sets it themselves (wait, then re-check) · this skill sets it — the ONE profile field it may ever edit, only after an explicit per-URL confirmation, done once before the first affected post and recorded in the ledger · continue anyway (the CTA will point at nothing — say so plainly) · skip the platform. A bio that points at a link aggregator (linktree-style) is never modified — that goes to the user.

## Phase 4 — Timezone map

Three timezones are in play and the ledger records all three: the publication timezone from the posts (IANA name from frontmatter), the browser's (`Intl.DateTimeFormat().resolvedOptions().timeZone` via a page evaluate), and the system's. Compute each post's due moment from its scheduled time in the publication timezone, converted per-date (IANA rules handle DST; never a fixed offset pinned at session start). Sanity-check: if browser and system disagree, say so — the schedule follows the publication timezone regardless, but the user should know their environment is split.

## Phase 5 — The ledger (persistent state, survives restarts)

`publish-state/ledger.json` beside the posts folder. Session memory is not state — a crashed or restarted session must resume without double-posting, and only a file on disk guarantees that.

Per post: file, platform, scheduled time (pub TZ) and computed due time, status (`pending` · `posted` · `unverified` · `failed` · `skipped` · `pending-approval`), attempt count, posted-at, post URL when captured, the read-back evidence in one line, and `degraded` naming anything the post went out without (alt text, a prerequisite that was unmet). Plus the timezone map, the interview answers, and an `incidents` list.

**`incidents` records outward-facing side effects this skill caused that were not one of the planned posts** — a stray upload, an edit, anything visible on the account that the run plan did not promise. Each entry: when, platform, what happened, the cause, the evidence that identified it, the artifact's URL, and how the user chose to resolve it. A side effect that is only in the transcript is lost the moment the session ends; the ledger is the only durable record the user can act on later.

Rules: the ledger is consulted before EVERY post and written after EVERY state change. A post in `posted`, `pending-approval`, or `unverified` is never attempted again — `unverified` (submitted, but read-back could not confirm) is resolved by checking the platform feed first: found → promote to `posted`; provably absent → back to `pending`. On start, an existing ledger means resume: reconcile it against the folder (new files → `pending`; missing files → flag) and continue.

## Phase 6 — Run plan and the gate

Present the plan: a table of upcoming posts (file, platform, scheduled pub-TZ time, computed local time, status), the overdue handling about to apply, per-platform counts, and the platforms being skipped. `--dry-run` stops here, having printed exactly what a real run would do.

**Confirmation gate:** publishing is outward-facing and effectively irreversible — get an explicit yes on the plan before the first post of the run. One gate per run, not per post; the plan is what was approved, and any change to it (user edits a post, adds files) re-presents the plan.

## Phase 7 — Publishing loop (sequential, human-paced)

Strictly one post at a time, one platform at a time — never parallel tabs, never interleaved composers. Per due post:

1. Consult the ledger (Phase 5 rules).
2. Re-verify login on the platform (sessions expire mid-campaign); logged out → pause, offer wait-or-skip for this post.
3. **Capture the read-back baseline** *before* composing: the profile post count, wall post count, or whatever counter Phase 6 of `references/platform-posting.md` names for that platform. Without a number taken beforehand, step 7 is guesswork.
4. Open the composer per `references/platform-posting.md`; when the live UI does not match the notes, re-derive from an accessibility snapshot — the notes are hints, the live DOM is the source of truth. Mechanics for clicks that time out are in `references/browser-interaction.md`; climb its ladder instead of repeating a failing click.
5. Fill like a person works: type with natural cadence (the type tool's delay, not instant value injection), pauses of 2–8 seconds between distinct actions, scroll to elements rather than teleporting.
   - **Media goes through the composer's OWN file input, scoped to the composer's dialog subtree — never a page-wide `input[type=file]` lookup.** Pages carry album, avatar and cover uploaders too; the first match is routinely the wrong one, and uploading into an album is a public act you cannot take back by pretending. Verify the preview appears *inside* the composer and that the URL did not change before going on. A navigation right after the upload means you hit the wrong input: stop, establish what was created, and report it before anything else.
   - Wait for the platform's upload/processing state to finish — a submit racing an unfinished upload posts the text without its image.
   - Set alt text where the platform offers the field and the attachment carries an `alt`. **Alt text is best-effort: two attempts, then move on.** Some platforms' alt editors do not open through automation at all. Never let a stuck alt editor block a post, never delete-and-repost to add alt without the user's explicit request, and never drop it silently — record `degraded` in the ledger and name it in the report.
   - Read back the field lengths and compare against the source file before submitting. Confirm any cross-post or paid-promotion toggle is off unless the post file asks for it.
6. Submit, then **poll the composer's own confirmation state in-page until it confirms or the composer closes. Do not navigate away while a submit is in flight** — leaving mid-upload loses the post silently, and a transient network error in that window is exactly how a fully-prepared post ends up nowhere.
7. **Read back:** navigate to the profile/feed/board and confirm the post is actually visible; capture its URL. The counter from step 3 must have moved by **exactly one** — that proves both existence and the absence of a duplicate. Never infer "newest" from the highest ID or from DOM order; both lie on paginated and virtualized surfaces. Lazy-loaded grids return nothing before they render, which is not evidence of absence — wait and re-query. Visible → `posted` with URL. Submitted into a review queue (group approval, hackernoon editorial) → `pending-approval`, which is success for this skill — say so, don't wait for moderation. Not findable → `unverified`, no automatic retry.
8. Write the ledger.

Spacing: minimum 3–10 minutes (randomized) between posts on different platforms, and at least 2 hours between two posts on the SAME platform unless the schedule itself says otherwise — an overdue backlog does not get to fire 10 posts into one feed in one minute. `--now` mode respects both.

Failures: one retry after ≥ 10 minutes, and ONLY after a read-back proves the first attempt did not land (the duplicate check is the point of the ledger). Re-prove absence immediately before the retry, not just at the time of failure. Second failure → `failed`, move on, report. A captcha, challenge, or platform warning at any step → stop on that platform, tell the user, and let them resolve it in their own browser; never attempt to click through it.

**Unintended outward-facing side effect → halt the run and disclose immediately.** If an action put something on the user's account that the plan did not promise — a stray upload, a wrong surface, an accidental edit — stop before the next post. Establish what actually happened with evidence rather than assumption (a count delta, the artifact's own page, its timestamp), report it plainly with the URL and the cause, write it to `incidents`, and ask the user how to resolve it. Do not delete or undo it on your own initiative: removal is itself an irreversible act on their account and needs the same explicit per-item request as any other deletion. Do not bury it in the final report either — the user needs it while they can still act, and burying it also robs them of the chance to stop the run before the same bug repeats on the next platform.

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
Degraded:    <n> (posted, but missing something the file declared — e.g. alt text)
Incidents:   <n> (side effects outside the plan, with URLs and how each was resolved)
Remaining:   <n> pending, next due <time> (<pub TZ> / <local>)
Ledger:      <absolute path>
```

Every number comes from the ledger, not from memory. Anything unverified is named as unverified — a submitted post without a read-back URL is never reported as published. State plainly which posts went out degraded and what is now permanent about that (several platforms will not accept an image description after posting). Repeat any prerequisite the user chose to override — a stale bio link keeps mis-attributing every later post on that platform, not only the one just published. Finally, move screenshots and the Playwright server's working files out of the user's project tree; a clean working copy is part of finishing.

## Phase 10 — Performance harvest (optional, read-only)

Runs only when the user asks (`--harvest`, or the offer made after a campaign's last post lands). It reads what the already-published posts did, so the next campaign is not written blind. Nothing is posted, edited, liked, or commented on in this phase — it is navigation and reading only.

Take the ledger's `posted` entries whose permalink was captured and whose posted-at is at least a few days old (a post read hours after publication measures nothing). Open each permalink read-only, paced like the rest of this skill, and record whatever **the platform itself shows**: reactions, comments, reposts, views where the platform displays them to the author. A platform that shows the author no counts gets `not available` — never an estimate, never a number inferred from something else.

Write `publish-state/performance.md`: one row per post (file, platform, posted-at, the raw counts, the permalink, harvested-on date), then a per-platform summary. The one derived number is an engagement weight — reactions plus three times comments — and it is labeled as this skill's own weighting, not a platform metric. Relative reads (which posts outperformed) are computed against that account's own median on that platform, never against a benchmark from someone else's account.

**Sample-size honesty:** under roughly ten harvested posts on a platform, report the raw rows and say the sample is too thin to rank. A recommendation drawn from four posts is noise with a decimal point.

What reads this file: `awesome-content-campaign` (which angles and times to favour next) and `awesome-voice-profile` (`--update`, as evidence of which register lands). Both consume it as one input among several — it says what got engagement, not what was true or well written.

This phase never touches the engagement itself. No liking, no commenting, no following, no reading other people's accounts for comparison: that is a different activity from measuring one's own results, and this skill does not do it.

## Anti-patterns

- Posting in parallel, or blasting an overdue backlog without spacing — the fastest way to make a legitimate account look like a bot.
- Retrying a failure without first proving via read-back that it failed — that is how duplicates happen.
- Trusting session memory over the ledger, or keeping the ledger only in memory.
- Typing credentials, storing tokens, automating login or 2FA, or clicking through captchas and warning interstitials.
- Starting on whichever bridge answered first, or carrying on in the wrong browser instead of asking for the intended profile's extension token and restarting.
- A fixed UTC offset instead of per-date IANA conversion — half the campaign lands an hour off after a DST switch.
- Treating a review-queue submission as a published post, or as a failure.
- Editing or deleting published content as cleanup without an explicit per-item user request.
- Guessing selectors when the UI has changed instead of re-deriving from a fresh snapshot.
- Taking the first `input[type=file]` on the page. The album, avatar and cover uploaders sit on the same page as the composer, and picking the wrong one publishes to the wrong surface.
- Navigating away while a submit is uploading, then reading the empty profile as proof of failure.
- Treating a highest ID, a first DOM node, or an unrendered lazy grid as the answer to "did it post?" — only a count taken before and after, plus the opened permalink, settles it.
- Repeating an identical failing click a third time instead of climbing the ladder in `references/browser-interaction.md`.
- Matching UI text against English literals when the user's browser is in another language.
- Publishing what the user asked for while quietly ignoring that some platforms they named have no content in the folder.
- Letting a stuck alt-text editor block a post, or dropping the declared alt text without recording and reporting it.
- Finishing a run with screenshots and `.playwright-mcp/` left untracked in the user's repository.
- Recording an engagement number the platform did not display, ranking posts off a handful of samples, or turning a harvest pass into interaction with the feed.
