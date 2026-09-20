---
name: awesome-content-repurpose
description: "Repurposes one source text, URL, file, guide, repository note or research memo into a folder of platform-native posts, one file per platform on the canonical table: a source-module map that keeps a guide a guide, an interview for output language, editorial idea, voice and emoji count, verified volatile facts with locked comparison peers, a set of campaign anchors (proof, task split, caveats, setup blocks) reused verbatim while every opener, closing and frame is written per platform, hard caps and depth bands, a counted audit, then one media question that attaches images or a video derived per platform. Use when asked to repurpose an article or guide into posts, adapt a text for named platforms, or 'адаптируй статью под соцсети'. Do not use for a scheduled campaign from product sources (awesome-content-campaign), to publish (awesome-content-publisher), or to build the voice profile (awesome-content-voice)."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "repurposing", "social-media", "writing"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-repurpose"
---

# Content Repurpose

One source in, one post family out: the same guide, the same numbers and the same judgment on every platform, each version shaped to its surface rather than trimmed from one essay.

Two rules make this skill different from writing posts from scratch:

- **The source is the boundary and the source's structure is the skeleton.** A tutorial stays a tutorial, a repository write-up stays about the repository, a benchmark stays about the measured result. The author's angle improves the material; it never turns it into a different article, and nothing is added that the source or a primary-source verification does not carry.
- **Anchors repeat, frames do not.** A run writes a small set of campaign anchors once (the proof, the task split, the caveats, the setup blocks) and reuses them word for word wherever they fit. Everything around them, the opener, the section order, the closing, the sentence that introduces a block, is written per platform and never repeated. A pack whose anchors are paraphrased thirty ways reads as a machine straining for variety; a pack whose frames are copied reads as one post pasted thirty times. Both are failures, and the split between the two layers is what prevents them. Creativity 2 and 3 loosen the repeat side of that split under the registered-variant rules in `references/creativity.md`, and tighten the echo side in the same step.

A third rule arrived with the dial: **the same skeleton on two unrelated subjects is a defect the audit can count.** A run picks its structure from the source in front of it (`references/registers.md` for the register, the fingerprint in `references/creativity.md` for the choice among documented shapes), so two packs from two subjects differ before anyone tries to make them differ.

Reference files, read when their phase is reached rather than up front:

- `references/registers.md` - how to read the subject family from the source, and how each family sounds. Read at Phase 0, right after the source type.
- `references/creativity.md` - the creativity dial: what each level moves, the run fingerprint, the rhythm floors, the structure alternates, the anchor policy per level, and the floor no level lifts. Read at Phase 1, before the brief.
- `references/fidelity.md` - the evidence-note format, the module map, the claims and coverage ledgers, comparison-peer resolution, correction locality. Read at Phase 2.
- `references/platform-specs.md` - the canonical file set, hard caps, depth bands, the per-platform blueprint and layout targets, emoji and hashtag policy, and which platforms render a section separator. Read at Phase 6.
- `references/authored-style.md` - the anchor set and its reuse rules, the opener and closing catalogs, text diagrams, the lexicon, emoji placement, the echo rules. Read at Phase 4, before the anchors are written.
- `references/revision.md` - the five passes between a fast draft and a finished pack: the claim and source pass, the structure and separator pass, the language pass, the pack-wide pass, and the exit condition each one stops at. Read at Phase 7, before the first file is drafted.
- `references/run-memory.md` - what may persist between runs. Read only under `--use-memory`.

## Invocation

```text
/awesome-content-repurpose <url | file | pasted text> [--platforms <slug,slug>] [--language <lang>] [--idea <text>] [--voice <mode>] [--emoji <n|0|1-5>] [--creativity <1-3>] [--footer <text|none>] [--media images|video|none|<path or url>] [--use-memory]
```

Defaults: every platform on the canonical table; language, idea, voice, emoji, creativity and footer asked every run; one folder of `.md` files and nothing else. A value supplied in the invocation is the user's answer to that question and it is not asked again. No source given: ask for one before anything else.

**The run folder is `repurpose/<slug>-<YYYYmmdd-HHMMSS>/` under the agent's scratch area.** The slug is the source kebab-cased to at most six words - its title, its filename without the extension, or its first heading when it was pasted - and the stamp is the moment this run started. Working state (`source/`, `run-settings.md`, notes, brief, anchors, plans, ledgers) goes there, and so does the finished posts folder (Phase 10).

The stamp is what makes a second run on the same source a second run. Two invocations of one article produce the same slug, and a slug alone puts them on one path, so the second run overwrites a set the user may still be reading or publishing from. An existing run folder is therefore never written into and never cleared to make room: take the next free stamp and name the folder this run used. The memory files of `references/run-memory.md` stay in the `repurpose/` root, outside every run folder, because they are what one run leaves for the next.

Nothing is written beside the source file or into the invocation directory. A source is a thing the user pointed at, not a workspace they offered: it may sit in a repository, a synced drive, a downloads folder or a read-only mount, and a run that leaves a folder of its own next to it has decided where the user keeps their work.

This skill never asks about publication time, timezone, cadence, target accounts or queues, and never writes `scheduled`, `timezone`, `status`, `target`, `queue` or `cadence`. Those belong to `awesome-content-publisher`. It does ask about media, once, after every post is written (Phase 11), and it writes the `attachments` key that the publisher reads; the pictures themselves are made by `awesome-content-graphics`, which owns its own gates.

## Phase 0 - Read the whole source and classify it

Save the complete text to `source/` and read all of it before deciding anything. A URL that returns an empty shell is read through a browser; a folder gets an inventory first, then the prose. A link the source arrived on is provenance, not a post link: an assistant's own share URL (`chatgpt.com`, `claude.ai`, `gemini.google.com`, `chat.deepseek.com` and the like) never reaches a post.

Classify the source into exactly one primary type by its information architecture, not its topic: `guide/tutorial` (commands, configuration, several setup paths), `project/repository`, `announcement/update`, `benchmark/report`, `essay/opinion`, `retrospective/historical`. A source with six setup sections and commands is a guide even when its most interesting implication is cost.

Then read `references/registers.md` and decide the **subject family** by what the source does rather than by what it is about: `dev-howto`, `eng-concept`, `incident`, `research-data`, `release`, `career-industry`, `business-money`, `design-ux`, `personal-essay`, `learning`. The type and the family are independent, and the pair is what stops a pack sounding like the last pack: the type keeps a tutorial a tutorial, the family decides whether it sounds like a runbook or like an essay. Where two families fit, take the one the title and the first section carry and name the runner-up in the report.

Record `Source type`, `Source family`, `Primary subject`, `Source promise` (what a reader receives when the source is faithfully repurposed), `Source language`, `Historical/current`. Then a preliminary outline from the supplied text only: major sections, the primary audience, the numbers already in the source, the caveats already in the source, and the source's own recommendation when it has one.

From that outline, write exactly 3 candidate editorial ideas, one sentence each, describing a reader takeaway rather than a format:

1. **Source-central** - the most direct expression of the source promise. For a guide this already carries the practical reason the source gives (cost, privacy, portability). Marked `Recommended` unless another idea is materially better supported.
2. **Practical/decision** - the strongest supported reason a reader would use, avoid or compare the subject.
3. **Alternate supported** - a genuinely different emphasis that still preserves the source type and its modules.

An idea changes emphasis, titles, openers and which module gets the extra paragraph. It never changes the source type, the module set, the verified facts, or whether the run's proof point appears (Phase 4).

## Phase 1 - Interview: language, idea, voice, emoji, creativity, footer

Six questions, one screen where the UI allows several structured questions (four on the first screen, then creativity and the footer), otherwise in this order. Nothing is drafted, not a title, not a hashtag, until all six are answered. Never recover an answer from an older run.

1. **Output language** - `English` (Recommended) · `<detected source language> - same as the source` · `Other, type it`. Option 2 names the detected language; for an English source it reads `English - source language`. The answer binds every body and metadata title. Code, commands, identifiers, model names, URLs and paths stay exact. No `language` frontmatter key. Where the answer is English, the pack is written in one variant of it: American by default, and another only where the user named one or the voice profile fixes one. A pack whose LinkedIn post says `optimise` and whose Medium post says `optimize` was written by two hands; `awesome-humanize-en/references/spelling-variants.md` carries the families and the exclusions; without that skill, the one-variant rule named here is the whole check.
2. **Editorial idea** - the 3 ideas from Phase 0, the first marked `Recommended`, plus `Other - describe it`. A custom idea the source cannot support is said so before drafting, with a narrower supported reading offered.
3. **Voice** - `First person` (Recommended for a personal feed) · `First person plural` · `Neutral third person` · `Voice profile from awesome-content-voice (path)` · `Style guide from awesome-style-mimic (path)`. A profile or guide is read before drafting. First person is editorial stance, never invented hands-on experience.
4. **Emoji** - `1-5` (Recommended) · `0` · `type a number`. Under `1-5` each post draws its own count at random from 1 to 5 and places them where an emoji underlines the meaning of the sentence it lands on; a typed number is the count per post; `0` turns them off everywhere. Placement rules and the two platform exceptions are in `references/authored-style.md`.
5. **Creativity** - `1 - Normal` (Recommended) · `2 - Medium` · `3 - High`. The dial decides how much of the pack's shape and phrasing the run chooses for itself, and `references/creativity.md` is where each level is defined. In the question itself the levels read as what the user will see:

   - `1 - Normal`: sentences and paragraphs move the way a person's do, the prose around the anchors speaks plainly, and part of the pack takes a different shape from the default.
   - `2 - Medium`: the subject family leads the structure, the repeated sentences carry two or three registered wordings instead of one, and openers may be written rather than chosen.
   - `3 - High`: the pack is composed the way a writer composes, from the material rather than from the template, with the facts, the numbers, the caps and the caveats exactly as strict as at 1.

   Level 1 is the floor of the dial: there is no setting that only replays the blueprint, because a pack written that way came out uniform without coming out safer. Whatever the answer, the floor in `references/creativity.md` section 2 holds: no invented experience, no fabricated specifics, no softened caveat, no changed number, no re-voiced command. A higher level buys a freer shape, never a freer fact.

6. **Footer** - `Yes, add a footer to every post` · `No` (Recommended when the user has not asked for one). On `Yes` a follow-up collects the footer text verbatim, several lines allowed, typically a follow-me line with handles. The text is appended byte for byte after the link line and before the tag line, separated from each by one blank line, on the platforms that take it. Verbatim means verbatim: the ASCII sweep, the dash rule and the punctuation cleanup all read it and none of them rewrites it, so a hyphen the user typed stays a hyphen and the run never turns it into a dash. Its own lines stay contiguous, which is what makes it one block rather than three paragraphs; it is exempt from the echo and emoji checks and never carries a frontmatter key.

   A follow-me block is self-promotion, so it ships only where the author owns the surface. Three cases, and `references/platform-specs.md` carries the per-platform list:

   - **ships** on the author's own blog, channel, profile or supporter page;
   - **never ships** into a room somebody else moderates or where the platform's own guidance reads a promotional block as spam: `reddit`, `lemmy`, `hackernews`, `quora`, `imgur`, and any post whose `target` names a subreddit, a community, a group, a Space, a squad or a Flickr group, whatever the platform's default;
   - **skipped for budget** on the hard caps, where the anchors and the link already fill the cap.

   The report names every platform that shipped without it and why. The user can override a `never` only by saying so for that platform by name, and the run states that the platform's own rules read it as promotion.

The six answers are recorded as `Output language`, `Selected idea`, `Voice`, `Emoji`, `Creativity`, `Footer` and bind every file in the run. With the level known, compute the run fingerprint from the source as `references/creativity.md` section 3 defines it, record it beside the level, and use it for every choice among documented shapes from Phase 6 onward.

**Then write `run-settings.md` in the run folder, before anything is drafted.** It is the run's own record of what the user chose, so a pack can be reproduced, or re-run with one setting changed, without reading the posts to guess what was asked. One file, these lines, in this order:

```text
Run folder      <absolute path>
Started         <YYYY-mm-dd HH:MM:SS>
Source          <the path, URL or "pasted text" as the user gave it> -> source/<saved filename>
Platforms       all 45 canonical | the requested subset, listed
Output language <answer>
Editorial idea  <the selected idea, in full, plus the two that were offered and not chosen>
Voice           <answer, with the profile or style-guide path where one was given>
Emoji           <answer as given: 1-5, a typed number, or 0>
Creativity      <1, 2 or 3, with the level's name>
Footer          <no, or the footer text verbatim, indented so its own line breaks survive>
Supplied        <the answers that arrived as invocation flags rather than being asked>
Source type     <type>   Source family <family>   Fingerprint <n>
Media           <written at Phase 11: the answer, the files, and what each platform got>
```

The footer block is copied byte for byte, the same way a post carries it. Nothing here is invented to fill a line: an answer the user never gave reads `not asked`, and an answer taken from a flag says so, because the value of this file is that it reports the run rather than describing it.

## Phase 2 - Evidence notes and the source-module map

Read `references/fidelity.md`. Write `source-notes.md` with the evidence lines it defines: `[C#]` claims, `[N#]` numbers with their conditions, `[S#]` scope and hedges, `[Q#]` quotations, `[E#]` named entities, later `[V#]` verified facts, `[X#]` corrections and `[D#]` derivations. Every `[V]` and `[X]` line carries a propagation label: `core`, `local`, `long-only` or `omit-short`; `local` is the default.

Then the module map `[M#]`, which is what keeps the output recognisably the source. For a guide the modules are its real sections and paths, each with a role: `primary-path` (at most 2: the routes the source explains first and most fully), `secondary-path`, `decision-axis`, `caveat`, `troubleshooting`, `auxiliary-detail`. Each module records its portable takeaway (one decision-useful sentence that survives on a hard-cap post), its medium details, its deep details (raw rates, exact windows, policy wording, alias history, full config), its representation in the source (prose, list, steps, code/config, table) and the evidence IDs behind it. Record the source's representation inventory: how many code/config blocks, semantic lists, tables and ordered procedures it has.

A module being required means its portable takeaway travels broadly. It never means its deep details do: exact time windows, jurisdiction and storage wording, retired names and alias history, and the long diagnostic block are `long-only` even when the source states them plainly. They appear on at most 2 files, the deepest surfaces, inside the module they belong to, and nowhere else. Exact hours belong to that budget too: a conditions sentence names the condition (peak or off-peak, input against output) without the clock times.

For the other source types the modules follow the blueprints in `references/platform-specs.md` section 5.

## Phase 3 - Verify current facts without writing a second source

Verify what is volatile or operational and what the source itself claims: prices and rates, model names and tiers, install and config commands, endpoints, temporary routing or fallback states, the privacy or retention statement when the source raises privacy, the repository state when a claim depends on it. Primary sources in this order: official documentation, official repository, official API page or model card, official announcement; a reputable secondary source only when none of those settles it.

Verification means the page was opened in this run. Every `[V#]` and `[X#]` line records the URL it came from and the span on that page that settles it, quoted closely enough that a reader can find it again, plus the date it was read. A fact asserted from training memory is not verified, whatever its confidence, and a page that was cited but not opened is the same failure with a URL attached. Where a value could not be settled on an official page, the line says so and the fact does not travel to any post.

The budget: verify what the source claims, correct what is stale, add only the minimum external facts a source-requested comparison needs. Do not introduce a theme because official documentation contains it. For every externally added factual point a long version keeps at least two source-origin points, corrections of stale claims exempt.

**Correction locality.** A correction repairs the source where the stale statement occurs: the correct name goes into every code block silently, and the sentence explaining what changed appears once, in the relevant setup section, on the deepest surfaces only. A correction that changes the reader's decision (a tier that no longer exists as a separate option, a path that no longer works) is `core`: it travels to every surface that carries the decision, as one sentence, and may carry an `as of <date>` qualifier because the state is temporary. A correction that changes no decision (a retired alias, a renamed variable) is never mentioned on a feed post at all.

**Comparative economics.** When the source keeps an existing client and routes it to another provider, discusses price, and names competing or default provider families anywhere (recommendation, escalation path, comparison), a provider-substitution comparison is mandatory and an internal cheap-tier-versus-premium-tier table does not satisfy it. Resolve the peers once, before any post is drafted, by the rule in `references/fidelity.md`: the exact model the source names; else the exact family or tier; else, when only a provider or product brand is named, the **standard rung** of that provider's current flagship family. Number the family's rungs from the top of its own pricing page: rung 1 is the premium tier, rung 2 the standard general-purpose tier, rung 3 and below the small, mini or nano tiers. The headline peer is rung 2 (rung 1 only when the family has just two rungs), and when the source names a tier of one family (its standard tier by name), that name fixes the rung for every family in the comparison. Both peers sit at the same rung, and the brief records each family's ladder with the rung chosen. A client's current default model, a preview, a reasoning-only, a specialist or a product-bound model is never the peer, however easy it is to find and however much the client would bill it. Ambiguous after official verification: omit that peer. Up to two provider families as headline peers; each family's premium rung may appear as an extra line inside `proof-full` only, never in a compact proof.

Compare like units only (API against API, never against a fixed subscription), use cache-miss input plus output unless the source's workload is explicitly cache-heavy, compute the minimum and maximum ratio across the peak and off-peak and input and output combinations, round to a readable range, record each ratio as `[D#]`, and keep one range per peer: two peers with different ranges are never merged into one phrase. Distinguish token cost from completed-task cost in one clause where the long form has room.

## Phase 4 - Editorial brief and campaign anchors

Read `references/authored-style.md`. Write `editorial-brief.md` with exactly: `Source type`, `Source family`, `Primary subject`, `Source promise`, `Source language`, `Output language`, `Selected idea`, `Voice`, `Emoji`, `Creativity`, `Fingerprint`, `Primary paths`, `Secondary paths`, `Core frame`, `Decision axis`, `Core proof point`, `Task split`, `Main caveat`, `Current corrections`, `Comparison set`, `Title spine`, `Hashtag pool`, `Frontmatter links`, `Body anchor link`, `Representation inventory`.

- **Core frame** for a guide is `what the reader keeps + what layer changes + why they would change it`. The guide remains the body; the why is a layer on top.
- **Decision axis** is the practical reason the setup is worth doing: cost, privacy, latency, portability, or whatever the source rests its recommendation on.
- **Core proof point** is the one concrete result that proves the decision axis. When the source's recommendation rests on cost and a comparison was triggered, it is the verified cross-provider ratio bundle, one range per peer. It appears on every platform, in the rendering the class allows, whatever idea the user selected; the idea changes what surrounds it.
- **Task split** names 5-8 concrete task types that belong on the cheap or default path (repository exploration, tests, docs, boilerplate, routine refactors, CI fixes, subagent loops, whatever the source and the domain support) and 4-6 cases that belong on the stronger path (ambiguous architecture, hard debugging, security review, risky migrations, final review of critical changes). Generic words such as `repetitive work` do not satisfy it. The escalation target is the frontier model family the source names for the final check (`a frontier <family A>/<family B> model`), never the subject's own premium tier: that tier is an intermediate rung of the routing block, and a split that escalates to it misstates the source's recommendation.
- **Main caveat** is the one limit a reader hits first, as one practical sentence: what not to send, what breaks, what it costs.
- **Title spine** is the set of ingredients every title composes from (primary subject, primary clients, task, practical reason); never a reusable string.
- **Hashtag pool** is one ordered set of 3-5 tags for the run: the subject, the primary clients by the short name people tag them with, and one category tag chosen by what people actually search on for the topic, checked live in this run rather than assumed (for AI-assisted coding tools the larger community tags `VibeCoding`, and `AICoding` is the weaker choice). Every platform takes an ordered subset.
- **Frontmatter links** are 1-3 reader-facing official URLs chosen once, and the same set goes on every file (Phase 5).

Then write `anchors.md`, the sentences and blocks that are reused across the pack. The full set and the wording rules are in `references/authored-style.md`; the run writes at least these, each once, verified once. At creativity 2 each prose anchor also carries 2 or 3 registered variants, written here, verified against the same evidence line, and assigned to whole presentation classes; at creativity 3 the prose anchors are recorded as fact sets that every post writes in its own words. The `setup-` blocks, the config blocks and every command stay one string at every level:

```text
proof-micro     one sentence with the subject, each peer's own range, the basis           hard caps
proof-compact   one sentence: the reason, the basis, each peer's range in bold, the conditions   feeds, community
proof-full      the raw rates by condition, the peers' rates, the resulting ranges, the
                conditions sentence, the like-for-like sentence, the two task lists, the
                non-ranking sentence, the current-correction sentence when there is one    mini-blogs, articles
split           the task split as one sentence pair under the selected voice; as two lists in proof-full
split-micro     one voiced sentence: routine or high-volume work named by 2-3 tasks on the cheap path, then hard or critical work escalated to a frontier <family> model
scope           the like-for-like sentence (API against API, not against a subscription)
caveat          the main caveat as one practical sentence naming 3-5 concrete things not to do
setup-<path>    the minimal verified block per primary path: only what makes it run plus the launch line the source shows, and no line the source or the official page does not carry
paths           the path inventory, as a fenced text block on long forms and as
                `<Subject> also works behind <A>, <B>, <C> and local <D>.` on feeds and hard caps
model           the mental model as a fenced text diagram (the thing kept = A, the thing changed = B)
gotcha          the troubleshooting kernel: symptom line, the config block, the restart line
```

A `proof-full` for a guide whose source rests on cost has the shape the deep surfaces expect: the subject's rates in a fenced text block by condition, the peers' rates in a second block, the resulting per-peer ranges in a third, then the conditions sentence (the conditions named, no clock times), the like-for-like sentence, the cheap-path task list, the escalation list under the selected voice, one sentence refusing to rank the models universally, and the decision-changing correction if there is one. Every long version carries this section verbatim under its own literal heading, and it runs about 1,100-1,400 characters.

The angle-selection priority is fixed: preserve the source promise and modules, preserve the source's strongest practical implication, add why and when judgment, correct stale facts, then compress for the platform. A derived insight never outranks source centrality.

## Phase 5 - Links

Frontmatter carries 1-3 official reader-facing links chosen once for the run: the primary path's page, the second equally central path's page, and one pricing or benchmark page when the comparison rests on it. The same set goes on every file. A project post normally carries only the repository. Setup-script download URLs and raw API bases used inside code are never frontmatter links.

**A URL inside a command is not a link and must never be written as bare text.** Platforms that autolink rewrite every URL they find, and they do not stop at the ones meant for the reader: LinkedIn published `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"` as `$env:ANTHROPIC_BASE_URL="https://lnkd.in/<hash>"`, so the command a reader copies is broken, and Minds did the same to two setup lines in the same pack. The composer cannot prevent it and an edit re-applies it, so the defence is here, in the file: every command line lives in a fenced block, every inline flag, path, env var and dotted token (`CLAUDE.md`, `api.deepseek.com`) is a code span, and nothing shaped like a URL is ever left bare except the one body anchor below. A file that ships a command as plain prose has handed the publisher a defect it cannot fix.

**LinkedIn rewrites every URL it finds, so a LinkedIn post carries no command that contains one.** The shortener replaces the address inside a fenced block as readily as one in prose — a published post shipped `$env:ANTHROPIC_BASE_URL="https://lnkd.in/<hash>"`, which is the command the reader is meant to copy, wrong on the page, and an edit re-applies the rewrite. The platform has no code span and no code block, so nothing protects it. On this one platform, name the setting in prose (`point ANTHROPIC_BASE_URL at the provider's Anthropic-compatible endpoint`) and let the article-length files carry the literal line; a `linkedin` file that still contains a URL inside a command is a defect the audit catches, not something the publisher can repair.

That rule has a cost the plan must carry: the plain-text platforms render no code at all, so the fence disappears and the bare command returns. For a feed post whose band is too short for a fenced block anyway, do not include a command whose correctness depends on a URL — name the setting and let the article-length posts carry the command. The blueprint's code allowance per platform is the place that decision is recorded, not an afterthought at publish time.

Alignment is the same kind of promise a composer may not keep. Multi-space columns (`Flash vs Claude Sonnet 5   ~7-17x cheaper`) collapse to single spaces in any plain HTML composer — VK ships them collapsed — so a comparison whose meaning lives in the alignment must either sit in a fenced block on a platform that renders one, or be written so it reads correctly as ordinary prose.

A tilde pair inside one block is read as strikethrough by the markdown-aware paste rules several rich editors run, and the approximation sign is how it happens. `~7-17x cheaper` and `~7-20x cheaper` are innocent on their own; flattened into one block by a composer with no `<pre>` node, they become a matched pair and everything between them publishes struck through — the two ratios, the model names and the line break that separated them. Keep the two ratios in separate blocks in the source (one line each, never joined into a prose sentence), or write the comparison without the sign (`about 7-17x cheaper`). One tilde alone in a block is safe; two are a pair waiting for a composer to close them.

The first URL in the body becomes the link-preview card on plain-text platforms, and it is not always the one that should. Bastyon built its card from `https://api.deepseek.com/anthropic` — a URL that exists only inside a command — because that is the first one the body contains, and nothing in the composer selects which. Where a post's band is plain text and it carries both a command URL and the body anchor, the anchor has to come first or the card is wrong. That is a writing decision, recorded in the plan, and the publisher cannot repair it.

A bare URL alone on its own line is a link card on the block editors, and the card eats the paragraph after it. Tumblr converted the closing anchor line into a rich card on the next `Enter` and consumed the empty block that followed, so the tag line went missing without a word of warning. Keeping the anchor as the **last** line of the body, with nothing after it but the tag line the publisher can re-add deliberately, costs nothing and removes the failure.

The **body anchor link** is one short official URL a reader can click from a feed post, usually the documentation root; feeds carry exactly one, near the close, as a bare URL on its own line before the tag line. Deep articles and mini-blogs may carry contextual links inside sentences and may close on a short labelled list: the official pages of the primary paths, the subject's pricing page, and one pricing page per comparison peer, since a reader checking the ratio needs both sides of it. The list carries one entry for **every** primary path the title or the body names, so a post whose title names two clients and whose list carries one has lost a link the reader was promised. The frontmatter set and the body's list agree on which paths are represented, and a path in the frontmatter that the body's list skips is a finding, not a trim. A frontmatter link never satisfies the visible-link rule.

## Phase 6 - Platform plan and variation plan

Read `references/platform-specs.md`. The file set is every row of the canonical table (or the requested subset), the bands are writing targets (draft toward 92-106% of `Aim`), the hard caps are absolute, and the blueprint table is each platform's **default** shape: visible H1 or not, coverage mode, code allowance, section order. What the creativity level may do to that default is the alternates table in `references/creativity.md` section 6, and which alternate this run takes is the fingerprint's decision, not a preference.

Write `platform-plan.md`, one row per platform: target characters, H1, primary and secondary paths, anchors carried, proof rendering, representation targets, body link, closing shape. Then `variation-plan.md`, one row per platform: opener move, where the author first enters, title move, closing move, emoji count drawn for that post, and the structure moves applied with the fingerprint index that chose them. Both are internal.

The plans carry the level's own requirements as rows the audit can read back: the rhythm floor each file is written to, the structure moves it took, and, at level 2 and up, which anchor variant each presentation class carries. A plan that records no move at any level is a plan that decided nothing, which is the failure this dial exists to prevent.

The variation plan is bound by the catalogs in `references/authored-style.md`, with the register in `references/registers.md` steering the choice at level 1 and leading it at levels 2 and 3:

- at least 5 opener moves in a pack of 12 or more platforms, no move on more than 25% of it, exact openers unique, the mechanism sentence (how the integration works on the wire) never an opener on more than 2 platforms;
- under first person about 10-25% of posts open on the author; elsewhere the author enters between 20% and 65% of the body, never only in the last line;
- at least 4 closing shapes, none on more than 40% of the pack, the recommendation-stance closing on at most 6 of a full pack, no non-anchor closing sentence in more than 2 posts;
- titles composed from the spine: unique strings, at least 4 title moves, no 4-word prefix on more than 25% of the pack, the subject in every title, no mechanism noun or abstraction as the title's centre.

Per level, on top of those bounds: at 1 up to a third of the files take an alternate and the long forms take one section-order variant, both by fingerprint; at 2 every class is planned from the register with no two files in a class sharing a section order; at 3 the plan is built from the module map and records the blueprint only as the fallback it departed from. At every level no file takes more than two moves and no two files take the same combination.

## Phase 7 - Write

Read `references/revision.md`. Writing here is the first of five passes, not the whole of it: the draft is written fast and roughly, then the pack goes through a claims-and-sources pass, a structure-and-separators pass, a language pass and a pack-wide pass, each with its own exit condition. A file that was drafted and polished in one sitting has skipped three of them, and the audit counts what they were supposed to produce. Section separators, on the platforms whose editors carry one, are placed in pass 2 from the support table in `references/platform-specs.md` section 11a - never one per heading.

Compose every version to its own band and blueprint from the anchors and the module map. Never write one essay and trim it thirty times, and never write thirty unrelated angles. The shapes below are the blueprint defaults, and the moves the plan took under `references/creativity.md` section 6 change the order and the entry point inside them without changing what a class covers, what it caps, or how many links it carries. The shapes, by class:

- **Hard caps** (`x`, `bluesky`, `threads`, `mastodon`, `peerlist`, `truthsocial`, `pinterest`, `pixelfed`): a stance or the subject in one line, `proof-micro`, `split-micro`, on name-all surfaces one "also covers" line naming the other paths, the body anchor link. The proof is never cut to make room for a mechanism sentence.
- **Feeds** (professional, visual, `minds`, `telegram`, `vk-wall`): opener, the primary `setup-` block where the class allows code, the `model` diagram or the `paths` block, the other paths in one sentence, `proof-compact`, `split`, `scope`, one troubleshooting sentence when the source has a gotcha, `caveat`, the link, the tag line where the platform uses one. Several short complete paragraphs, not two dense ones.
- **Community** (`facebook-wall`, `reddit`, `lemmy`, `hackernews`, `quora`): a question or a direct answer first, the proof in the class rendering, the split as short lists where the surface renders them, the paths in one sentence, `scope`, `caveat`, links, and a closing question only this post could ask (not on `hackernews` or `quora`, which end on the content).
- **Mini-blogs** (`ko-fi`, `buymeacoffee`, `patreon`, `tumblr`, `teletype`): the `model` diagram or a keep-and-change text block as the intro, one heading (or a bold lead on `tumblr`) per path in source order with the primary blocks and, per secondary path, one to three sentences or one short block but not both, `proof-full` under its own heading (`tumblr` and `teletype` take `proof-compact` with the split and the scope instead), `caveat`, `gotcha` with its block, a routing text block or a one-line stance to close, 2 labelled links.
- **Deep articles** (`devto`, `hashnode`, `hackernoon`, `medium`, `substack`, `telegraph`, `daily-dev`): H1, a short intro with the `paths` block, one literal heading per path in source order (grouping only where the blueprint allows it), each primary section its `setup-` block plus at most three sentences, each secondary section one block at most (its command or a text list, never both) plus at most two sentences, `proof-full` under a question heading that names the peers, a `Privacy`-style caveat heading, a troubleshooting heading with the symptom, the config block, the restart line and a bold one-line lesson, then the labelled reference links. `daily-dev` is the short member of the class: grouped secondary paths in a bullet list and `proof-compact` with the split and the scope. Setup sections come before the economics section; the economics section exists and does not consume the article.

Rules that hold on every surface:

- **Sentence length is a spread, never a pattern.** Each file meets the rhythm floor its level names in `references/creativity.md` section 5, including that level's limit on consecutive sentences of near-equal length. Writing long-short-long to satisfy the floor is the defect the floor was built to catch: vary because the thought varies, then measure the result.
- **Nothing is invented to make a post livelier.** No experience the author did not have, no stake the source does not carry, no specific invented to satisfy a specificity rule, no opinion manufactured for contrast. This holds at every creativity level and is the first thing the audit checks when a post suddenly reads well.
- Fragments are a level decision: allowed above the hard caps at 1, ordinary at 2 and 3. Where a fragment lands, it lands because the sentence before it earned the pause.
- **The subject family sets the register** (`references/registers.md`): its rhythm, its lexicon, whether a question to the reader is native at all, and what its writers never say. At level 1 it sets the lexicon, the emoji baseline, the question habit and the heading style, and at 2 and 3 it leads the structure too. It never changes a fact, a cap, a module's presence or the interview's voice.
- The opener names the promise in the reader's terms (what they keep, what changes, why), and its first sentence carries the subject's name and at least one client's product name. A first sentence built from category nouns alone (`a cheaper model`, `the client you already have running`, `a terminal agent`, `the provider`) fails, however elegant. The wire mechanism is a supporting sentence, at most one per post.
- No meta-framing anywhere in the pack: no sentence about how the topic is usually framed, argued or decided (`picking a side`, `a camp`, `a routing decision rather than`, `separate purchases`, `the question is`, `the decision is smaller than`, `a winner`). The posts explain the guide and say what the author would do with it; they do not comment on the debate around it.
- Path sections keep the source's order on every surface that has them; the primary path the source explains first comes first, whatever the title emphasises. Titles and openers name the primary paths only: a secondary tool never stands in a title beside the subject.
- **Both primary paths survive to every platform, in the title and in the body.** Count the client names in every title before the file is saved: a title naming one where the source has two is rewritten, whatever platform it is for and however well the shorter line reads. The per-platform title shapes stay as they are; what changes is which names go into them, so `Keep <A>, put <subject> behind it` becomes `Keep <A> or <B>, put <subject> behind them` and `<Subject> as a replaceable model layer behind <A>` becomes `... behind <A> and <B>` or the collective `coding CLIs`. Where the source has two primary paths, every title carries both (`<Subject> behind <A>/<B>: <plain nouns>` is the compact form the hard caps use) or one collective noun (`your coding CLI`, `coding CLIs`), and every body names both at least once even where the blueprint says `coverage primary` and only one gets its setup block. Dropping the second client from a 280-character post is not compression, it is a different post: the reader is told the subject works behind one tool when the source is about two. A title naming one client over a body that covers two is the same defect from the other side.
- No self-positioning contrast in an opener: `I have been looking at <subject> as X, rather than as Y`, `I read <subject> as X rather than Y`, `I would rather change X than learn Y`. The author's stance is stated forward (`I see <subject> behind <A> mainly as a <role>.`), and `rather than` earns its place later in the body, inside a sentence about the work rather than about the author's framing.
- Never point at the post's own blocks with a demonstrative: `that table`, `this block`, `the list above`, `the diagram below`. Name what it holds or state it in words. The same ban covers counting or ranking what is about to appear (`Four lines of state, and the last one is the part I keep coming back to`) and pointing at a position inside a block (`everything above the second line`, `the first line here`): the block is read by the reader, not narrated to them.
- No self-benefit framing. `The useful part for me`, `what I like about it is`, `the part I keep coming back to`, `what this buys me` put the author's relationship to the thing where the judgment about the thing belongs. The judgment goes on the subject (`That is a more useful way to think about coding models than picking one permanent best model`), and first person stays on what the author would do.
- Plain spoken US English, in the order a person says it: somebody does something to something. No idiom that is not in ordinary speech (`stay put`, `in front of your day`), no abstraction as the subject of a verb about the reader's life, and no sentence that hands the reader a list of abstractions to keep (`does not cost you <tool>, your permissions or your muscle memory`). Where a sentence needs a second read to parse, it is rewritten short.
- One question put to the reader per post, never two, and on a family whose writers do not ask (`references/registers.md`), none at all unless the blueprint's own shape is built on one. A visible title that asks the question is the post's question, so the body asks none, a body that opens on the question does not close on another, and a closing question exists only where the title is a statement and the platform's blueprint calls for one. A question-shaped section heading (`Why use <subject> instead of <peer>?`) is a label on a section, not a question to the room, and does not count.
- Every sentence on a hard cap does one of five jobs: the promise, the proof, the split, the caveat, the link. A sentence that states an abstract property of the setup without telling the reader what to do with it is cut, however true it is.
- Every line is a complete sentence with a verb on the hard caps, at every level: 280 characters has no room for a line that asserts nothing. Above the hard caps the level decides, and a fragment there is still a choice a writer made rather than a sentence that ran out. `<Client A>/<Client B>, add <subject>` is a label, not an opener: it names two things and says nothing about them, and a reader who meets it first learns nothing. Fitting both clients into 280 characters is done inside a sentence (`I would put <subject> behind <A>/<B> mainly for <reason>.`), never by dropping the verb. The same holds for the split: both halves keep their own verb, and `and escalate` is never the word that gets cut to save four characters.
- Inside a path section only the block is the anchor. The sentence that introduces it and the sentences after it are frames, written for that platform: what a secondary path buys the reader, what the author would do with it, is said differently on every surface that has the section. The same holds for the sentence about the fuller published block, the sentence about the variables' scope, and the sentence advising to read a remote script: each is frame prose and falls under the echo rules.
- The band is written to, not audited into: a long form is composed section by section against the budgets in `references/platform-specs.md`, and its body length is measured before it is saved.
- Blocks are separated by one blank line, on every platform and at every length. A hard-cap post is four or five blocks with blank lines between them, not five lines glued into a wall, because every surface here renders Markdown or collapses single newlines and the post then arrives as one paragraph. The only contiguous lines in a body are the lines inside a fenced block, the items of a list, and the footer, whose lines are one block by design.
- **The footer's contiguous lines need a hard break, or the same collapse eats them.** One block does not mean one line: a footer written with bare newlines publishes as one run-on sentence — the intro line, then both handle lines, separated by spaces — on every platform that renders Markdown, which is where three posts in one run shipped their three footer lines glued together. End every footer line but the last with **two trailing spaces** — the CommonMark hard break, invisible in the rendered page and invisible to a reader of the file, which is why it has to be written deliberately. The footer's own characters stay verbatim: the two spaces are the separator between its lines, not a change to its text, and the verbatim rule in Phase 1 still forbids touching anything else in it. The audit reads the footer back as three lines, not as three lines' worth of characters.
- No two consecutive paragraphs open on the same words, and no two consecutive sentences inside an anchor do either. What is compared is the whole opening phrase and not two words: `<Client A> and <Client B> stay where they are` followed by `<Client A> and <Client B> both take <subject> as their provider` puts the same subject at the front of the post twice, and the second sentence starts somewhere else or goes. The split anchor opens its second sentence on the cases (`For <cases>, I would still escalate ...`), and the caveat anchor opens on the imperative (`Do not casually send ...`), so an `I would` paragraph is never followed by another.
- **One fact, one sentence.** Two sentences carrying the same fact in different words are one sentence and a defect, the opening pair most of all, because a reader who meets the promise twice before any proof has been given nothing the second time and reads the post as padding. A frame sentence that would restate the opener either adds what the opener left out or is cut.
- **Every sentence makes one claim the reader can check.** A sentence that gathers several findings and closes on a collective verdict (`the pricing table, the terms and the failure mode are all part of the same picture`, `it all points the same way`) asserts a relation instead of showing one, and no reader can say whether it is true. Write the single claim that belongs here with the fact it rests on, and leave the others to the paragraphs that carry them. On a hard cap it is always the sentence to cut, since it spends the most characters per fact delivered.
- No inventory of the steps as a summary line (`Three variables for <A>, one script for <B>, and the interface stays`, `Two variables and a key do it for one, an official setup script for the other`): the steps are shown once, in their blocks, and a lead line states the promise instead. Rewording the count is the same defect, because naming the ingredients is not telling anyone what they get.
- **A post points at nothing it does not carry.** Where the surface renders no block, naming the variables, the key or the script sends the reader to hunt for them inside a linked page, and a short post is the one place that costs the most. The sentence those words would have filled carries the promise, the proof, the split or the caveat instead, all of which are complete where they stand.
- **Every opener names what stays and what changes, and says the change is possible rather than done.** The client the reader keeps is a thing in the sentence, the provider that replaces the old one is a thing in the sentence, and the verb is `can`, `could`, `do not have to` or `I would`. A present-tense report (`<Subject> sits behind <A> or <B>.`) claims it is already installed; a negation carrying the whole meaning (`Nothing about <A> or <B> has to change for <subject> to answer them.`) makes the reader assemble the point. Both are rewritten forward, and a stance opener keeps the reason clause that makes it a stance (`... for the cheap half of the work.`) even at 280 characters.
- A room question asks about the reader's result with the subject (a comparison on a real repository, a task that failed, a cost that did or did not hold), never about the mechanics of the setup or which client handled it. It also has to be a question a person would type. One clause, one thing asked, nothing invented to make it specific: `Has anyone run a week of ordinary repository work on <subject> behind <A> or <B> and compared what it produced with the defaults?` stacks a duration, a workload, a setup and a comparison into a study nobody ran, and the reader cannot answer it at all. Read it against the title before the file is saved: it is the question that title provokes, it is about what the post is about, and someone who has used the subject once can answer it.
- **Claims about effort, cost and what is expensive to replace come from the source or are not written.** This reader configures these tools daily, so a list of what is costly to rebuild that includes something they change with one flag or one config line (`the permissions`, `the prompts`) reads as invented, and one invented item takes the rest of the sentence with it. Check each item against what a competent user actually does with it: what they set once from a flag is not an asset, and it comes out of the list. What stays is what the source shows the reader keeping.
- The post is the guide, and often the only thing behind the link is vendor documentation. So the word `guide` and its cousins (`write-up`, `note`, `the source`) never appear in a body: no `this guide`, `the same guide`, `the guide shows`, `the guide covers`, no guide that repeats, walks, lays out, is good at anything or is liked, and no count of its paths in prose (`six clients`, `five more`, `four other`). The inventory is the `paths` anchor: the fenced block on long forms, `Also covered: <A>, <B>, <C> + local <D>.` on feeds and hard caps, and on community surfaces the neutral sentence `<Subject> also works behind <A>, <B>, <C>, <D> and local <E>.`
- No self-praise and no caption of the obvious. A sentence that says the guide, the post, the setup or the idea is simple, useful, good, whole or the entire idea (`That is the entire idea:`, `That is the whole shape`, `The useful pattern here is simple:`) is deleted; a sentence whose subject is the thought itself (`The useful idea here is that ...`, `The point is that ...`, `The interesting part is that ...`) is cut back to the thought, and the test is mechanical - delete everything up to and including `that`, and if what remains still stands as a sentence, that deletion was the fix; a caption that announces what the next block visibly shows (`Three variables and the launch line:`) is deleted; an italic deck line listing the article's contents under the H1 is deleted. A subtitle, where the blueprint has one, states the idea in one clause and never lists the sections.
- Text diagrams in fenced `text` blocks carry mental models, splits, path inventories and before-and-after states on every surface that renders fences; ASCII only. The `model` diagram sits in the intro or directly after the primary path's block, never after the secondary paths or between them and the economics section.
- Bold is for the numbers inside `proof-compact`, for a bold lead where the blueprint says so, and for the one-line lesson in a long form. Nothing else.
- Semicolons: none, at any length. Two clauses that each carry a thought are two sentences, and a clause that only qualifies the one before it joins with a comma. A run of them is one of the plainest machine tells a body can carry, and an opener that needs one is an opener that has not been written yet.
- ASCII punctuation: `'`, `"`, `-`, `->`; no em or en dash, no Unicode arrow, outside exact code or a quotation. No `#show`.
- The selected voice binds every body: under first person every post carries at least one genuine stance (`I would`, `I like`, `for me`), long forms a second one at the recommendation; a personal frame with no number is welcome (what the author has kept, replaced or expected), an invented result is not.
- Emoji follow the interview answer, capped by the family's baseline in `references/registers.md`: a family whose writers use none takes at most one per post however high the interview number, because a technical post wearing four emoji reads as written by someone who does not publish there. `hackernews` carries none whatever the answer. An emoji never lands inside an anchor (an anchor is verbatim and travels without it), and the same emoji sits on the same sentence in at most 2 posts. Only the palette in `references/authored-style.md` is used: an emoji from a newer Unicode block or one that needs a variation selector renders as a box on the platforms these posts land on.
- No calendar date in prose except an `as of` qualifier on a `core` correction of a temporary state.

## Phase 8 - Frontmatter

Every file begins with exactly these 5 keys, in this order, and no other:

```yaml
---
platform: <slug>
title: "<platform-specific metadata title>"
voice: first-person | first-person-plural | third-person-neutral | profile: <path> | style-guide: <path>
links: [https://...]
hashtags: [TagOne, TagTwo]
---
```

Phase 11 adds one optional key, `attachments`, after `hashtags` and nowhere else. Until it runs, the five above are the whole contract. One blank line follows the closing `---` before the body. `title` is metadata even where the body shows no title; it is composed from the title moves in `references/authored-style.md`: the subject's name plus at least one client's product name (or the exact phrase `the coding CLI you already use` on at most 4 titles), the relation word `inside` or `behind`, in at most 80 characters. Never count-led, never a label about the post itself (`the short version`, `setup notes`, `in numbers`), never a thesis with a colon, never announcement voice (`<vendor> documents`), never `replace <peer>` (the guide keeps the client and routes the model), never `a <subject> setup for <audience or occasion>` with no client named. A roll-call of more than two clients fits at most one title in the pack. `hashtags` is an ordered subset of the pool on every platform except `reddit`, `lemmy`, `hackernews` and `quora`, which carry `[]`; the metadata list is independent of whether the body carries a tag line, which `references/platform-specs.md` decides. The same first 4 words open at most 3 titles in the pack, the colon-contents form stays off the deep articles, and the question form is used only where the blueprint names it (`reddit`, `quora`, `facebook-wall`).

## Phase 9 - Audit

Run every check before the folder is revealed, counting first and reading second. A finding names the post, the rule and the span, with a verdict of `FIX` or `REWRITE` (`references/fidelity.md`). Fix an anchor in `anchors.md` first and rebuild every post that carries it.

The audit reads the creativity level first and applies that level's thresholds (`references/creativity.md` sections 4, 5 and 9). A breach of the floor blocks at every level, a missed level requirement blocks, and polish inside the level's allowance is reported rather than blocking. Every number below is counted on the files as they stand: a rhythm figure that was asserted rather than counted is itself a finding.

Counted:

- **Claims and sources** - `claims.md` exists and covers every assertive sentence in the pack, each with an evidence ID and the URL opened this run; no row reads `unsupported` or `over-stated`; every URL in every file was opened and still says what the post says it says, with the anchor text matching what the destination is. A pass that produced no rows did not run.
- **Separators** - per file, the count of horizontal rules against the rule in `references/revision.md` section 3: at most three in a long read, none adjacent to another, none under the H1, none between a heading and its first paragraph, and zero literal separator characters on any platform whose row in `references/platform-specs.md` section 11a reads `no`.
- **Revision passes** - the pack shows the passes ran: parts listed per long file in `platform-plan.md`, the rhythm figures counted rather than asserted, and the pack-wide comparison of openers, closings and titles recorded. A pack drafted and shipped in one pass is a `REWRITE` of process, and the report says which passes were skipped.
- **Files and frontmatter** - exactly the requested set, canonical names, the 5 keys in order plus `attachments` where Phase 11 wrote one, no forbidden key, `voice` equal to the interview answer, the same 1-3 link set everywhere, hashtags an ordered subset of the pool.
- **Length** - every body measured in characters after the frontmatter and listed against its band in the report; hard caps with margin; a post over its band ceiling re-enters the compression ladder in `references/platform-specs.md` and is not shipped until it is under. The section budgets in that file are the first thing to check on an overrun.
- **Anchors** - every anchor present in the classes that carry it; `proof-*` on every platform; no anchor deep detail on a surface its label forbids. What "present" means is the level's: at 1 verbatim, and a reworded proof, split, scope or caveat is a `FIX` back to the anchor; at 2 one of the registered variants verbatim, with the whole class on the same variant and no fourth wording anywhere; at 3 the fact set complete and unchanged in meaning, checked element by element, with every number, unit, condition, peer name and named case identical to `anchors.md`. Setup, config and command blocks are verbatim at every level.
- **Rhythm** - per file, on prose only: sentence count, mean, longest, shortest, the share inside the 10-to-20-word band, the longest run of sentences within 3 words of each other, and the paragraph-length span. Each is checked against the level's floor in `references/creativity.md` section 5, and a file that meets the floor by alternating long and short on a schedule is a `REWRITE`, not a pass.
- **Structure variety** - the moves each file took, read against the plan: no file over two moves, no two files in one class sharing a combination, the level's minimum met, and no move applied to a whole class. A pack whose files all carry the blueprint default at level 1 or above has not planned, it has defaulted.
- **Register** - the family's rhythm band, lexicon, question habit and emoji baseline against what shipped, plus the family's own avoid-list. A post that reads as written by someone who does not publish in that family is a `REWRITE` of that post.
- **Invention** - every concrete detail, stake, result and opinion traced to an evidence line or to the selected voice's allowance. This check runs first at levels 2 and 3, where the freer frames make an invented specific easiest to write and hardest to see.
- **Echo** - a mechanical count, not a reading: every prose sentence of every file goes into one table with the number of files it appears in, `anchors.md` is the only whitelist, and the table is kept with the run. After that whitelist and code, URLs, quotations, tags and identifiers: no prose sentence in 3 or more posts, no opener sentence twice, no 6-word opener prefix in 3 or more posts, no closing sentence in 3 or more posts, no coined phrase of 3 or more words the source never used in 3 or more posts, no source aside lifted into a slogan on more than 3 platforms; and no anchor whose first four words are a placeholder stem copied out of `references/authored-style.md` rather than written for this subject, which is the one echo that crosses runs instead of files. The report states the number of non-anchor sentences found in 3 or more files, which is zero when the pack ships. The thresholds tighten as the dial rises, because repetition is the tell that survives every other change: at level 2 no prose sentence in 2 or more files and every claim carrying a named referent, at level 3 no non-technical 6-word span in 2 or more files and every post carrying at least one concrete detail no other post carries.
- **Distribution** - opener moves, first-person openers, closing shapes, title moves and prefixes, mechanism-sentence openers, recommendation closings, all against the Phase 6 bounds.
- **Locality** - retired names, alias history, exact clock windows, policy and jurisdiction wording, the diagnostic sequence: on at most 2 files, the deepest surfaces, inside their module; a non-decision correction on no feed at all; a workload cost example on at most 3 files.
- **Representation** - code blocks, list blocks and text diagrams against the layout targets; a command-heavy source rendered as prose on a code-friendly surface fails.
- **Style** - ASCII punctuation, zero semicolons, one question per post, no self-benefit framing, no counting or narrating a block the reader can see, no position reference inside a block, no idiom outside ordinary speech, bold allowance, no `#show`, no date outside the allowed qualifier, display names rather than identifiers in prose, no run of three one-line paragraphs, no meta-framing sentence, no `guide` or `write-up` in any body, no path count in prose, no self-praise, no caption of the obvious, no step-inventory line, no italic deck line, no bookish phrase (`received wisdom`, `conventional wisdom`, `the prevailing view`), no two consecutive paragraphs opening on the same two words, every opener's first sentence carrying the subject and a client by name, every setup block line-for-line inside what the source or the official page shows, every hard-cap caveat a sentence about what to do with sensitive code.
- **Tags and footer** - where the platform carries a body tag line it is the last line of the body, every tag with `#`, CamelCase, identical in tags and count to the frontmatter list, and at the platform's target count in `references/platform-specs.md`, never at the floor of a range when the budget holds one more; where the platform's tags live in its own field the body has no tag line and the frontmatter carries the norm count, and the report names those platforms so an empty body reads as a decision rather than an omission; the footer, when chosen, sits after the link and before the tag line, verbatim, and only on the platforms its permission table allows, with every line but its last ending in two spaces so the block survives as separate lines on the Markdown surfaces.
- **Logic** - every closing link list read against its own title, one entry per primary path the title names before any supporting page is counted; every title carries both primary paths or the collective noun, every body names both at least once, each client in the title appears in the body, and no post names a client in its title that its own prose never mentions. Count the primary paths per file: a file naming fewer than the source's primary paths, in either the title or the body, is a `REWRITE` of that file, never a note.
- **Tells** - at levels 2 and 3, machine-favored constructions counted per 200 words of body by the list in `references/creativity.md` section 8, with three in one paragraph a `REWRITE` of that paragraph and the per-file count in the report.
- **Format** - the file set is complete, with no platform missing for want of media; every line on a hard cap is a complete sentence, and above the hard caps every line is a complete sentence except the fragments the level allows and the plan recorded; every body's blocks are separated by one blank line, with only fenced blocks, list items and the footer running contiguous; the footer is byte-identical to what the interview collected; the body's labelled link list represents every primary path the post names, and agrees with the frontmatter set.
- **Emoji** - the count per post equals the drawn count; every emoji-bearing sentence is listed and checked against `anchors.md`, and one found on an anchor moves to a frame sentence; no emoji as a bullet; the same emoji on the same sentence in at most 2 files; every emoji reported next to the word in its own sentence that it stands for, and one with no such word removed; every code point checked against the three-line gate in `references/authored-style.md`, since the palette is a map of meanings and the gate is what decides.
- **Voice** - a genuine stance in every body under first person, at the planned position.
- **Repetition** - no two consecutive paragraphs or anchor sentences open on the same phrase, and no two sentences in one body carry the same fact; every post's opening pair is read as a pair before anything else in it is read.

Read:

- **Fidelity** - every claim in `claims.md` traces to an evidence line with its condition; quotations verbatim; the peers locked; numbers, names and negations unchanged after any wording fix; the cold read of each post's point matches the source promise.
- **Coverage** - deep surfaces cover all modules, feeds name all major paths and detail one or two, hard caps carry the portable takeaways; a guide reduced to one path on a long surface fails however accurate it is.
- **Why and when** - every substantial version says why, which tasks, when to use the other option, and the caveat; setup still dominates a tutorial long read.
- **Questions** - every question in the set read against its own title: one clause, one thing asked, every noun in it found in the body of the same post, no protocol invented to make it concrete, and a person would type it as it stands.
- **Openers** - every opener read for the two halves and the modality: what stays, what changes, and a verb that offers rather than reports; every stance opener read for its reason clause.
- **Competence** - every claim about effort, cost or what is hard to replace traced to an evidence line, and every item in such a list checked against what a daily user of these tools does with it.
- **Structure** - the blueprint shape: H1 as specified, sections literal, setup before economics, a skimmable path list where the source is a multi-path guide, a question where the surface is a room.

## Phase 10 - Deliver

Create `<slug>_social_posts/` inside the run folder, containing the final `.md` files and, once Phase 11 has run, a `media/` folder beside them: no README, no manifest, no archive. The only thing that moves the folder elsewhere is a path the user named in the invocation, and the source file's own directory is never that path by default. The posts folder keeps the plain readable name, because that is what the user reads in a file manager; uniqueness lives one level up in the stamped run folder, so no set is ever overwritten by a later run on the same source. A named path that already holds a post set is reported before anything is written, never merged into and never emptied.

State the absolute path here, in full. A scratch path is not one the user can guess, and the folder is opened for them at the end of the run rather than now, because the media question of Phase 11 is still to come and an empty `media/` folder is not what they asked to look at.

## Phase 11 - Media, the last question

Every post is written and the folder exists. One question, and the run does not end before it is answered:

| # | Option | What happens |
| --- | --- | --- |
| 1 | Images | Generated here with `awesome-content-graphics` from this post set, or supplied by the user |
| 2 | Video | The user supplies one file, and the run derives what each platform can take |
| 3 | No graphics | Every post ships as text, media-required platforms included |
| 4 | Type here | Anything else the user means by media |

A supplied file is a path on the machine or a URL. A URL is downloaded into `media/` and the run says what it saved, from where, and its size and type. Anything that does not download, or is not an image or a video, is reported and the question asked again rather than guessed at.

**Images.** Either answer ends at the same place: one approved picture, and then every platform's own frame of it.

- *Supplied.* The user gives a path or a URL. It is resolved into `media/` and that file is the approved picture.
- *Generated.* `awesome-content-graphics` is handed the facts from `source-notes.md`, that file's boundary section, the post title, the output language, the target ratio and `<posts folder>/media/` as its output folder, and hands back the picked file with its alt text. It asks its own count question and runs its own pick gate; this one does not restate them, does not ask anything it is about to ask, and does not proceed until it hands control back.

Then, without another question, `awesome-content-image-adapter` is called with the approved picture and the posts folder. The posts are already written, so the platform list is the folder itself: one `<slug>.png` beside each `<slug>.md` whose platform takes an image, in that platform's frame. It skips a platform the canonical table marks as taking no attachment and says which. Nothing existing in the folder is moved or overwritten, and the run does not proceed until that skill hands control back.

**Video.** One source file becomes two things, both made before a post file is touched, and both needing video tooling on the machine (`ffmpeg` is the usual one): confirm it answers before promising either, and where nothing is installed say so, ship the posts text-only and name what was skipped.

- **Stills, for the platforms that do not take video.** At most 4 frames, chosen as the moments the posts actually talk about (the first clear frame of each distinct state, screen or scene), never four ticks off a stopwatch. They land in `media/` named in the order they occur, and a frame that is a transition blur or a title card is re-picked rather than shipped.
- **A short, for the platforms that do.** Vertical 9:16, cut to the shortest limit verified for the video platforms in this run so one file serves them all, and the cut keeps the moment the post's proof lands. A platform whose verified limit is shorter gets its own cut. A source already vertical and inside the limit ships as it is, and the run says so. Every platform limit here is verified live or read from the platform cache, never assumed.

**Who gets what.** The video platforms (their Media column, confirmed in Phase 3) take the short, and it is the default there rather than a still. Every other platform that takes media takes stills: one on a single-image surface, the frame that matches what that post leads on; up to all four where the surface takes a sequence, which is the carousel, the photo set and the document. A platform whose Media column says nothing is supported gets nothing. A media-required platform with no media is **not** dropped: its text is written and its file ships with the rest, because whether a post goes out without its picture is a publication decision and `awesome-content-publisher` owns it. `No graphics` is an answer about pictures, not about which platforms get written, and a run that answers it by writing six fewer posts has decided something the user did not.

**Frontmatter.** Media is declared where the publisher reads it, after `hashtags`:

```yaml
attachments: [{ file: <slug>.png, alt: "<what it shows and what it means>" }]
```

Paths are relative to the posts folder, so the publisher resolves them there. A post whose picture came from the image adapter names the file that sits beside it and shares its name; a still or a video derived in this phase names its file under `media/` the same way. Alt text is written in the run's output language, says what the picture shows and what it means, and carries no date. The key is absent on a post with no media, several entries in order carry a sequence, and `scheduled`, `timezone`, `status` and `target` stay forbidden here as before.

**Then close `run-settings.md`**: fill its `Media` line with the answer as the user gave it, the files that came out of it, and which platforms carry none. That line is the last thing written to the run folder, and it is what makes the file a record of the whole run rather than of its first half.

**Then open the folder on the user's machine and say that it was opened**, adding in the same breath that it sits in the session's working area and is copied somewhere permanent by the user if they want to keep it, with the absolute path in the same sentence so it survives a failed open: `explorer` on Windows, `open` on macOS, `xdg-open` on Linux, checked to exist before it is called, skipped in a headless or scheduled run, and a failure is one line naming the path rather than an error that stops the run. Another skill called this one -> hand the path back and open nothing, since the caller decides what the user sees and when.

The final message states: the folder path and file count, the source type, the subject family and the selected idea, the creativity level with the fingerprint and what it chose (the structure moves in play and, at level 2 and up, how the anchor variants were assigned), the comparison set and how each peer was resolved (the pricing page and the rung), the material corrections, every body length against its band, the rhythm figures against the level's floor, the echo count at the level's threshold, the media answer with what was attached where (and what each platform got), any platform dropped for want of media, and anything not verified. Post bodies are not pasted into chat unless asked.

## Anti-patterns

- Drafting before language, idea, voice and emoji are answered, or recovering any of them from an earlier run.
- Opening most of the pack on how the integration works on the wire, reworded each time, instead of on what the reader keeps and gains.
- Paraphrasing the proof, the split, the scope or the caveat per platform instead of reusing the anchor verbatim, and the mirror failure: copying an opener, a section intro or a closing from one platform to another.
- A coined tagline the source never used (a contrast pair, a two-word aside, a slogan about the numbers) stamped across the pack.
- A task split that says `routine work` and `something stronger` where the anchor names the tasks and the escalation cases.
- Choosing a client's default model, a premium top rung, a small rung, a preview or a specialist as the comparison peer because it was easier to find, and merging two peers' ranges into one phrase.
- A split that escalates to the subject's own premium tier where the source escalates the final check to a frontier model.
- A title that describes the post (`the short version`) or an audience (`for everyday coding work`) instead of naming the subject and the client; a title that puts a secondary tool beside the subject; an opener made of category nouns; a paragraph about how people argue the topic instead of what the guide shows.
- `I like this guide because`, `what this guide is good at`, `the guide repeats it five times`, `the same guide also covers`: the post is the guide, and a guide admiring or counting itself is the loudest machine tell in the pack.
- A hard-cap caveat written as a noun list (`No keys, no .env, no dumps.`), which reads as a fact about the system instead of advice about the reader's code.
- A title naming Codex CLI over a body that only sets up Claude Code, or a two-client body under a one-client title. The reader meets the title first and the body has to keep its promise.
- An opener that positions the author against an alternative (`I have been looking at X as a provider, rather than as another client to learn`). It is a shape, and four posts in one pack wearing it is the tell.
- A hard-cap line that sounds like an aphorism about the setup and tells the reader nothing to do with it.
- A demonstrative pointing at the post's own furniture (`That table is what I would run`).
- A follow-me footer shipped into a subreddit, a Lemmy community, a Quora answer, a Facebook group or the Hacker News front page, where the platform's own guidance reads it as promotion.
- Ending the run without asking about media, or asking about it before the posts exist, when the answer depends on what the posts turned out to be.
- Four stills cut at even intervals out of a video, or the same still pasted onto every platform regardless of what that post leads on.
- A command, flag, path or dotted token written as plain prose instead of a code span, which the autolinking platforms then rewrite into a link and break. The publisher cannot repair it and an edit re-applies it, so the file is the only place it can be prevented.
- A comparison that only reads correctly in monospace columns, shipped to a platform whose composer collapses runs of spaces.
- A landscape video shipped to a platform whose native format is the vertical short, or a cut made past a limit nobody verified.
- Reimplementing the graphics gates here: the count question and the pick belong to `awesome-content-graphics`, and this skill waits for them.
- Two questions in one post: the title asks one and the last line asks another, so the reader is asked twice and answers neither.
- A line that counts the block underneath it, or tells the reader which part of it matters before they have read it.
- A title carrying three or four client names, or one client plus a count of the rest (`<A>, and 4 other coding CLIs`).
- `I read <subject> as a provider`, which is the self-positioning opener wearing a different verb.
- A body that repeats its own frontmatter title as its first line on a platform whose composer has a title field.
- A hard-cap post that drops the second primary path from its title and its body, leaving the reader with a post about one tool when the source is about two.
- A body whose lines are glued into a wall because the blank lines went missing, most often after something was appended to the end.
- A footer whose punctuation the run improved: the user typed a hyphen and the post shipped a dash.
- A closing link list that names one primary path when the title named two. The list carries one entry per primary path the title and the body name, so two clients in the title means both setup pages in the list. A pricing page is welcome after them and never instead of one of them.
- A hard-cap line built as a label rather than a sentence (`<A>/<B>, add <subject>`), or a split whose second half lost its verb.
- A title that keeps its platform's shape by dropping a client: the shape is the template, the clients are the content.
- A body that repeats the submission title as its first line on `reddit`, `lemmy` or `hackernews`, where the composer has a title field of its own.
- Six fewer posts because the user said no graphics.
- A posts folder created beside the source file, or anywhere in the invocation directory, when the user named no path.
- A run folder named from the source alone, so the second run on one article lands on the first one's path.
- An opener and the sentence after it starting on the same phrase, or saying the same thing twice in different words.
- A sentence that lists unrelated findings and closes on a collective verdict rather than a checkable claim.
- A question no reader could answer, built by stacking a duration, a workload and a comparison the source never ran.
- A list of what is expensive to replace that contains something the audience sets with one flag.
- `Also covered:` as a label, where the anchor is a sentence saying the subject works behind those paths.
- A short post naming variables, keys or a script it does not show, so the reader has to go find them.
- An opener in the present indicative, which tells the reader the change has already happened to them.
- An opener built on `Nothing ... has to change`, where the forward sentence was available and shorter.
- A stance opener that dropped its reason clause to fit, leaving a bare preference.
- A question containing a duration, a workload or a measurement that appears nowhere in the post.
- A sentence that announces a thought before stating it (`The useful idea here is that ...`).
- A launch line or a variable added to a setup block because it seemed implied; the block carries what the source shows and nothing else.
- Retired model names, alias history, exact price windows, jurisdiction and storage wording or the full diagnostic block on feed posts.
- A hard-cap post that spends its budget on setup and drops the proof or the link.
- A deep article whose why section replaces the setup sections, or a guide with six paths collapsed into three generic headings.
- A command-heavy guide rendered as prose, or a source path list dropped because it looked like an inventory.
- Titles built on the mechanism or an abstraction, count-led titles, or the same title string on two files.
- The full published setup block on every surface where the minimal block plus one sentence was the shape, and the mirror failure: every secondary path carrying both its command block and a text block on every long form, so the article runs a third past its band.
- The same introducing sentence, the same read-the-script advice and the same scope sentence copied into every path section of every long form, as if the prose around a block were part of the anchor.
- Bold outside the proof numbers, a bold lead and the one-line lesson; emoji as bullets; an emoji count that ignores the interview.
- A closing that restates the post, a generic question, or the same recommendation sentence closing most of the pack.
- Frontmatter with scheduling or publishing keys, more than 3 links, or a different link set per file.
- A different central story per platform, or one essay mechanically trimmed to thirty lengths.
- Two packs on unrelated subjects that share a section spine, an opener grammar and a sentence-length band. That is the defect the dial exists to catch, and it is visible in a count rather than in a reading.
- Long-short-long alternation written to pass a rhythm floor. The floor asks for a spread that follows the thought, and a schedule is the newer tell.
- A creativity level used as permission to invent: an experience the author did not have, a stake the source does not carry, a number nobody verified, a contrarian line written for the shape of the sentence.
- One structure alternate applied to a whole class, which replaces a template with a template.
- A register chosen from the topic's vocabulary rather than from what the source does, or a register allowed to soften the caveat.
- Rhythm, tell or echo figures reported without being counted, and a fingerprint quoted in the brief that nothing actually selected.
- Raising the level because the source is thin. A source with two facts makes a short pack at every level.
