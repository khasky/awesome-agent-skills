---
name: awesome-content-voice
description: "Builds a durable, reusable author-voice profile from whatever evidence exists — the user's own posts read through their logged-in browser, files of past writing, pasted samples, a website (via awesome-style-mimic), or an interview alone — and writes one profile file other skills read instead of re-deriving a voice per task: presence signals, absence signals with per-sample counts, per-platform register, protected personal tics, verbatim samples, and a source-and-confidence stamp. Thin evidence is handled, not faked: an interview plus a tuned archetype produces a low-confidence profile that says so and improves incrementally. Use when asked to 'build my voice profile', 'learn how I write', 'update my voice profile', or in Russian 'собери мой авторский стиль', 'изучи как я пишу', 'обнови профиль голоса'. Do not use to learn a website's brand voice — use awesome-style-mimic; not to write posts — use awesome-content-campaign; not to strip AI voice from text — use awesome-humanize-en."
license: MIT
metadata:
  author: Khasky
  tags: ["writing", "voice", "style", "profile", "personalization", "content"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-voice"
---

# Voice profile — learn how this author writes, once

One file that other skills read instead of guessing a voice per task. It records how the author actually writes (evidence), what they never do (absence, counted), what must never be "cleaned up" (their real mannerisms), and how confident the whole thing is.

**The rule that outranks the rest: never hand someone else's voice back as theirs.** A shipped sample set from another author, a style guide crawled off a company site, an archetype template — none of these are the user's voice, and a profile that quietly presents them as such poisons every downstream post. Borrowed material is allowed only as a labeled scaffold, and the label lives in the file.

Bundled files (load on demand):

- `references/archetypes.md` — eight voice archetypes for the cold-start path: register, opener and closer habits, rhythm, formatting, and what each never does. Scaffolding to be tuned against the interview, never shipped verbatim.

## Invocation

```
/awesome-content-voice [<source> …] [--update] [--name <profile-name>]
```

Sources are optional and mixed freely: file paths, folders, a site URL, pasted text, or nothing at all (then the interview and archetype path carry the run). `--update` appends new evidence to an existing profile instead of rebuilding it.

## Phase 0 — Destination and consent

The profile lands at `voice/<name>.md` in the invocation directory (`<name>` defaults to the author's handle or `me`). Working state — evidence dumps, per-source analysis — lives beside it in `voice/.work/<name>/` and can be deleted once the profile exists.

**A voice profile is a personal fingerprint, and this one is written into the project.** Inside a git repository, say so before writing and get an explicit yes: it will be committed unless ignored, it can carry real names, employers, URLs and verbatim excerpts from private writing, and a public repository publishes all of that. Offer, in this order: keep it tracked (the user's call, stated plainly) · add `voice/` to `.gitignore` · write it outside the repository at a path the user names. Never decide this silently.

## Phase 1 — Collect evidence

Evidence beats interview answers on every question it can answer: people describe their writing inaccurately, and the samples do not.

**Access triage runs first, before a single byte is collected.** Classify every profile URL the user supplied by the access level it needs (the three levels are defined below) and show that as a short table: platform, level, why. Platforms that hide the archive from logged-out visitors — LinkedIn, X in practice, anything members-only such as Patreon or a paid tier — are level (c) and cannot be read any other way.

**If any platform lands on level (c), settle the bridge before collecting anything at all.** Not after the public ones are done, not as a note in the middle of the run: the gate is a fork in the plan, and the user answers it. Three bridge states, three different actions:

| State | What it looks like | Action |
| --- | --- | --- |
| Attached | tab list shows real tabs, or a lone `connect.html` | run the target gate (below), then collect |
| Present but not connected | the tool exists yet the session reports the MCP server needs authentication, or the extension's status page says `No clients are currently connected` | **this is the token case** — ask for that browser's `PLAYWRIGHT_MCP_EXTENSION_TOKEN`, per the procedure below |
| Absent | no browser tool at all, or a lone `about:blank` from a spawned clean browser | offer the install, or the user's decision to go without |

Whatever the state, the level-(c) platforms are not quietly dropped. Put the choice through the structured-question UI: **fix the bridge now** (the token procedure, then continue) · **skip these platforms**, recorded as skipped in the profile and the report · **stop here** and resume when the browser is ready. Announcing a fallback and proceeding is not one of the three — a run that collects two public feeds and calls the profile done has answered a question the user was never asked.

**Every gate in this skill is a structured question, never a closing sentence.** Consent, the bridge choice, the triage fork, the target gate: each blocks progress, so each is asked with its options spelled out and waits for a selection. "Say go and I'll start" is narration — it reads as a status line, gets answered with a shrug, and leaves nothing that records what was approved.

Then collect, from whichever of these the user has, in descending order of what they prove:

1. **The user's own posts on their platforms** — profile URLs handed to this skill are this source, not source 4: a link to the user's own account on a platform means "learn from what I posted there", and routing it to a site crawl instead is a misread.

   **Three levels of access, and the cheapest one that works for THAT platform wins.** (a) A plain fetch or a public API, when the profile is server-rendered and public — no browser, no bridge. (b) A browser, any browser, when the page is a JS app that returns an empty shell to a fetch — most modern feeds are. (c) The user's *own* logged-in browser through the bridge, for what a logged-out visitor cannot see: members-only posts, a platform that hides the archive behind a login wall, an account set to followers-only. Say per platform which level was used; a profile read at level (a) or (b) is public evidence and needs no session at all.

   The cheapest level is chosen **per platform, not for the run**. Finding that two of seven platforms answer over a public API does not lower the requirement for the other five, and it is not a reason to start collecting before the access triage above has been answered.

   **The archive is usually not the profile page.** A profile URL shows a bio and a sample; the authored posts live behind a separate path or tab — LinkedIn keeps them at `/in/<handle>/recent-activity/all/`, X and Mastodon separate posts from replies, most platforms mix reshares into the default view. Navigate to whatever that platform calls the user's own posts, take the URL from the user when they know it, and prefer the filter that excludes reshares over sorting them out afterwards.

   **Level (c) starts with the target gate, always.** Before a single navigation: ask which bridge when the session exposes more than one; probe the engine (`navigator.userAgent`) and the signed-in identity; then state the browser, the profile and what will be read, and **put the go/no-go through the structured-question UI** (proceed here · use the other bridge · stop) rather than ending on a sentence the user has to answer in prose. The full procedure is the target gate in `references/browser-interaction.md` (ships with `awesome-content-publisher`). **No bridge, or the wrong browser answered → ask the user for the intended browser's `PLAYWRIGHT_MCP_EXTENSION_TOKEN`** from the extension's status page opened in that browser, put it in the MCP server entry for it, restart, re-run the gate. Reading someone's posts out of whatever browser happened to attach is how a profile gets built from the wrong account.

   Bridge preflight: list tabs — a lone `about:blank` means the bridge is not attached, so offer to fix it or continue without this source, never degrade silently; no extension installed at all → the install is <https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm> (Chrome or Edge), and public profiles can be read meanwhile without it; a lone `connect.html` is the bridge's own relay page and means it *is* attached. Never touch that tab; open ONE working tab and reuse it; warn the user the browser is busy. Then, per platform, read the logged-in state read-only (a login form versus the user's avatar — no clicks into settings, no typing). Logged out → offer to wait while the user logs in themselves, or skip that platform. Login is never automated. Collect their own authored posts only — not reshares, not replies written by others — up to ~20 per platform.
2. **Files and folders** — drafts, published articles, exported newsletters, README and docs the user wrote, exported chat or email text. Folders get an inventory first, then the prose-bearing files. Private correspondence is often the truest sample of an unguarded voice; it is also the most sensitive, so it is used only when the user offers it, and excerpts from it never become published samples (Phase 4's sample policy).
3. **Pasted text** — saved to disk on arrival like everything else.
4. **A website** — delegate to `awesome-style-mimic` Learn mode and treat its guide as one more evidence source. A crawled site is a *brand* voice: when it is the user's own site it informs the profile, and when it is someone else's it may only ever be a labeled reference, never the profile itself.
5. **Nothing** — the interview plus an archetype (Phase 3).

Every collected text is dumped to `voice/.work/<name>/sources/` and analyzed from disk. **Bulk sample text never enters the conversation context** — context compaction must not be able to lose the evidence a profile claims to rest on.

Count what landed, per source and per platform. That count is what Phase 4's confidence stamp and honesty floor are computed from — not an impression of "enough".

## Phase 2 — Analyze from disk

Read every collected text against a fixed observation list, writing observations (not summaries of content) to `voice/.work/<name>/analysis/`. For large corpora (>30 files), batch them; keep the observation list identical across batches so the results merge.

**Presence signals** — sentence length distribution (not just the mean: the spread is the voice), paragraph shape, contraction rate, opener moves actually used, closer moves actually used, favorite connectives, recurring words and phrases, emoji and hashtag habits, punctuation habits (dashes, ellipses, parentheses, exclamation marks), how they handle numbers, how they cite or link, how they disagree, how they say "I don't know".

**Absence signals — the ones that need counting.** A claim that the author never does something is worth stating only with its denominator: "em dash: 0 of 14 samples", "rhetorical-question opener: 1 of 14". Never write an absence claim you did not count; never inherit one from a generic banned-word list. Absence found across a thin sample is weak evidence and is marked as such.

**Per-platform register** — the same author writes differently on a professional feed than in a community thread. Keep the per-platform observations separate; merging them produces an average voice that matches nothing.

**Personal tics** — habits a de-slop pass would strip as "AI-ish" but that are genuinely this author's: heavy em dashes, one-word paragraphs, a stock sign-off, a favorite intensifier, lowercase openings, a recurring joke format. These are collected deliberately, because the downstream risk is real: `awesome-humanize-en` and the campaign's self-audit both delete these patterns by default unless the profile protects them.

**Contradictions stay contradictions.** Two samples that disagree about a habit are recorded as a range or as genre-dependent, never smoothed into one rule.

## Phase 3 — Interview, and the cold-start path

Ask only what the evidence could not answer (use the agent's structured-question UI when available; plain questions otherwise). Every question takes a custom answer.

1. **Who is writing** — first person singular · first person plural (team or company) · a persona distinct from the author. 
2. **Audience** — who reads this, in the user's own words.
3. **What this voice is for** — the reason someone follows it: teaching, shipping in public, opinion, curation, reporting.
4. **Register floor and ceiling** — how casual it may get, how formal it must stay, and where the line moves per platform.
5. **Off limits** — subjects, claims, or moves this voice never makes.
6. **Protected habits** — anything the user knows about their own writing that an editor keeps trying to remove. Feeds the personal-tics section directly.
7. **Reference points** (optional) — authors, feeds, or publications whose voice they admire. Recorded as *aspiration*, in its own labeled section, never mixed into the observed profile.

**Cold start — evidence too thin or absent.** Do not fake observation. Instead: pick an archetype with the user from `references/archetypes.md` (present the shortlist that fits their answers, not all eight), tune every field of it against the interview answers, and write the profile with `confidence: low`, the archetype named as its source, and a refresh trigger recorded in the file ("revisit after ~10 published posts, or run `--update` with any new writing"). Then run the calibration in Phase 5 — with no samples to check against, that is the only evidence the profile earns before use.

## Phase 4 — Write the profile

`voice/<name>.md`, in this order. The section names from `Voice profile` through `Rewrite instructions` are deliberately the same ones `awesome-style-mimic` writes, so its Apply mode consumes this file unchanged.

```markdown
# Voice profile — <name>

## Source and confidence
<what was analyzed: counts per source and per platform, dates>
<confidence: low | medium | high — and the specific thing that would raise it>
<any scaffolding used, named: archetype, borrowed style guide, aspiration references>

## Voice profile        <2–3 sentences, plain language, no adjective piles>
## Tone rules (Do / Don't)
## Lexicon              <the author's own words, spelled their way; plus what is absent, counted>
## Rhythm & syntax      <length distribution, paragraph shape, contraction rate>
## Structure            <how pieces open, develop, close; invariant strings quoted verbatim>
## Formatting habits    <lists, bold, headings, emoji, hashtags, links>
## Genre notes          <per platform or per format: what changes and what holds>
## Personal tics — never clean these
## Samples              <3–5 verbatim excerpts, labeled with platform and date>
## Rewrite instructions <what a writer or rewriter must do to sound like this>
```

Rules for the file:

- **Every claim traces to evidence or to a named scaffold.** No generic filler: a section the evidence cannot fill says "no clear pattern across samples" and stays short.
- **Honesty floor per platform.** Fewer than ~5 own samples on a platform → record "sample too thin" for it and do not invent a register.
- **Samples policy.** Default (a private, untracked profile): verbatim excerpts, each verified letter-for-letter against its source file before inclusion. A profile the user chose to keep in a tracked or public repository: excerpts from private writing are dropped, and remaining samples are either the user's already-public posts or composed in the described register with the section labeled as composed. Ask when unclear.
- **AI tells in the user's own writing are recorded, not inherited.** If the samples themselves read machine-written, note it in Source and confidence and keep the profile describing what is there — but a downstream de-slop pass still outranks mimicry, and the file says so.
- **The profile is not a ban list.** It describes a voice; it does not accumulate every rule the author could follow. Leave slack: ordinary sentences and plain paragraphs are part of a human voice, and a profile that demands distinctiveness in every line produces its own recognizable fingerprint.

## Phase 5 — Calibration

Write 3 short passages in the profile's voice — one per platform where a register was recorded, or three variants of one passage when there is only one register — on a subject the user actually writes about. Show them, ask which lands and what is off, and fold the correction into the file. This is the only check available for an archetype-built profile and a cheap one for an evidence-built profile.

Then say plainly what the profile is worth: what it was built from, its confidence, and which platforms are thin.

## Update mode (`--update`)

Append, never rebuild. New evidence is collected and analyzed exactly as above, then merged into the existing file: counts in Source and confidence go up, absence claims are recomputed against the new denominator (an "0 of 9" that becomes "1 of 15" stops being an absence and moves to Lexicon or Structure), new tics are added, and confidence is re-stated. Sections the user edited by hand are preserved unless the new evidence contradicts them — and a contradiction is reported to the user, not silently resolved. Keep the previous version at `voice/.work/<name>/history/<date>.md` so a bad merge is recoverable.

## Verification

The final report cites counts, not impressions: sources analyzed and how many texts came from each, per-platform sample sizes (naming the ones below the honesty floor), how many absence claims are backed by a counted denominator, whether samples were verified verbatim or composed, the confidence level with the specific evidence that would raise it, the destination path, and the consent decision recorded in Phase 0. Anything that could not be collected — a platform whose login the user declined, a folder that turned out to hold no prose — is named as missing, never left implied.

## Anti-patterns

- Shipping another author's writing as the user's default samples, or letting a crawled brand guide become "their voice" without a label. A borrowed voice that is not labeled is the failure this skill exists to prevent.
- An absence claim with no denominator ("never uses em dashes") — count it or drop it.
- Averaging platforms into one register, or inventing a register for a platform with two samples.
- Letting bulk sample text into the conversation context instead of dumping it to disk.
- Writing a personal fingerprint into a tracked repository without asking, or publishing verbatim excerpts of private correspondence.
- Turning the profile into a banned-words list, or polishing every line's worth of slack out of it.
- Rebuilding the whole profile on `--update` and losing the user's hand edits.
- Presenting an archetype-built profile as if it were observed — the confidence stamp is not optional decoration.
- Automating a login, or crawling the user's profiles without them asking for that source.
- Reading through the first bridge that answers without the target gate, or collecting from the wrong account because asking for the right browser's token seemed like friction.
- Announcing a fallback and continuing: "the bridge is closed, trying what is reachable another way" is a decision the user has to make, not a status line. A closed bridge with level-(c) platforms in the list stops the run at the triage table.
- Treating an unauthenticated MCP server as an absent one and quietly finishing with whatever the public web gave up.
