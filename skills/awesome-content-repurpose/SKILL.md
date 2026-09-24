---
name: awesome-content-repurpose
description: "Repurposes one source (a link, a file, a guide, pasted notes) into three posts that together cover every publishing platform: a full long read written first, a regular post derived from it, and a short post that carries the whole point inside the tightest cap of its group. Each file lists its platforms, title, links and hashtag pool in frontmatter, and the publisher places title, tags and link per platform. Source notes every claim traces to, a module map that keeps a guide a guide, live verification of what is volatile, an interview for language, idea, voice, emoji, creativity and footer, a counted audit, one media question. Use when asked to repurpose an article or guide into posts, adapt a text for social media, or 'адаптируй статью под соцсети'. Do not use for a scheduled campaign from product sources (awesome-content-campaign), to publish (awesome-content-publisher), to make or resize images (awesome-content-graphics, awesome-content-image-adapter), or to build the voice profile (awesome-content-voice)."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "repurposing", "social-media", "writing"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-repurpose"
---

# Content Repurpose

One source in, three posts out: the same argument, the same numbers and the same judgment at three lengths, each one publishable on every platform in its group without a cut.

Three rules make this skill what it is:

- **The source is the boundary and its structure is the skeleton.** A tutorial stays a tutorial, a repository write-up stays about the repository, a benchmark stays about the measured result. The author's angle improves the material and never turns it into a different article, and nothing is added that the source or a primary-source verification does not carry.
- **The long form is written first, and the other two come out of it.** The long read is the complete version: every module the source has, at the depth the material supports. The regular post is that argument retold for a feed, and the short post is the one thing a reader must leave with. Neither is a trimmed copy. Each is written again from the long form's facts, in its own sentences, so nothing in it reads as cut off.
- **Every form fits its whole group.** A form serves many platforms, and it is held to the tightest hard limit among them (`references/forms.md`). What the publisher adds per platform (the title, the tags, a short post's link) is added only where it fits whole, so the body the run writes is the only thing that ever has to fit.

Reference files, read when their phase is reached rather than up front:

- `references/registers.md` - how to read the subject family from the source, and how each family sounds. Phase 0.
- `references/creativity.md` - the creativity dial: what each level permits, the rhythm floors, the tell count, and the floor no level lifts. Phase 1.
- `references/fidelity.md` - the evidence-note format, the module map, the claims ledger, comparison peers, correction locality. Phase 2.
- `references/forms.md` - the three forms, their platform groups, their ceilings and where each number came from, what the publisher does with each file, and the two pictures. Phase 5.
- `references/authored-style.md` - anchors, openers, closings, titles, lexicon, emoji and emphasis. Phase 4, before the anchors are written.
- `references/surface-rules.md` - the smaller writing rules that support Phase 5 to 7. Read with Phase 5.
- `references/revision.md` - the passes between a fast draft and a finished file, and the exit condition each one stops at. Phase 5, before the long form is drafted.
- `references/run-memory.md` - what may persist between runs. Only under `--use-memory`.

## Invocation

```text
/awesome-content-repurpose <url | file | pasted text> [--platforms <slug,slug>] [--language <lang>] [--idea <text>] [--voice <mode>] [--emoji <n|0|1-5>] [--creativity <1-10>] [--footer <text|none>] [--media images|video|none|<path or url>] [--use-memory]
```

Defaults: all three forms with their default platform groups; language, idea, voice, emoji, creativity and footer asked every run; one folder of three `.md` files and nothing else. A value supplied in the invocation is the user's answer to that question and it is not asked again. No source given: ask for one before anything else.

**The run folder is `repurpose/<slug>-<YYYYmmdd-HHMMSS>/` under the agent's scratch area.** The slug is the source kebab-cased to at most six words: its title, its filename without the extension, or its first heading when it was pasted. The stamp is the moment this run started. Working state (`source/`, `run-settings.md`, notes, brief, anchors, the claims ledger) goes there, and so does the finished posts folder (Phase 9). Two runs on one source produce the same slug, and the stamp is what keeps the second from overwriting a set the user may still be reading: an existing run folder is never written into or cleared. The memory files of `references/run-memory.md` stay in the `repurpose/` root. Nothing is written beside the source file or into the invocation directory.

This skill never asks about publication time, timezone, cadence, targets or queues, and never writes `scheduled`, `timezone`, `status`, `target`, `targets`, `queue` or `cadence`. Those belong to `awesome-content-campaign` and `awesome-content-publisher`. It asks about media once, after all three files are written (Phase 10), and writes the `attachments` key the publisher reads.

## Phase 0 - Read the whole source and classify it

Save the complete text to `source/` and read all of it before deciding anything. A URL that returns an empty shell is read through a browser; a folder gets an inventory first, then the prose. A link the source arrived on is provenance, not a post link: an assistant's own share URL (`chatgpt.com`, `claude.ai`, `gemini.google.com`, `chat.deepseek.com` and the like) never reaches a post.

A folder that already holds posts the author wrote is its own kind of source. Where one of them is written at a form's length, it is the primary module for that form: its opener, its closing and its order are kept as the author wrote them, and the run changes only what fails verification, what breaks the form's ceiling, and what the interview answers require. The author's own wording won every comparison a reader was asked to make against a re-voiced version. Record the mapping in `source-notes.md` as `Form sources`, one line per form, or `none`.

Classify the source into exactly one primary type by its information architecture, not its topic: `guide/tutorial` (commands, configuration, several setup paths), `project/repository`, `announcement/update`, `benchmark/report`, `essay/opinion`, `retrospective/historical`. A source with six setup sections and commands is a guide even when its most interesting implication is cost.

Then read `references/registers.md` and decide the **subject family** by what the source does: `dev-howto`, `eng-concept`, `incident`, `research-data`, `release`, `career-industry`, `business-money`, `design-ux`, `personal-essay`, `learning`. The type keeps a tutorial a tutorial; the family decides whether it sounds like a runbook or like an essay. Where two families fit, take the one the title and the first section carry, and name the runner-up in the report.

Record `Source type`, `Source family`, `Primary subject`, `Source promise` (what a reader receives when the source is faithfully repurposed), `Source language`, `Historical/current`. Then a preliminary outline from the supplied text only: major sections, the primary audience, the numbers and caveats already in the source, and its own recommendation when it has one.

From that outline, write exactly 3 candidate editorial ideas, one sentence each, describing a reader takeaway rather than a format:

1. **Source-central** - the most direct expression of the source promise. Marked `Recommended` unless another idea is materially better supported.
2. **Practical/decision** - the strongest supported reason a reader would use, avoid or compare the subject.
3. **Alternate supported** - a genuinely different emphasis that still preserves the source type and its modules.

An idea changes emphasis, titles, openers and which module gets the extra paragraph. It never changes the source type, the module set, the verified facts, or whether the proof point appears.

## Phase 1 - Interview: language, idea, voice, emoji, creativity, footer

Six questions, on as few screens as the UI allows (four, then creativity and the footer), otherwise in this order. Nothing is drafted, not a title and not a hashtag, until all six are answered. Never recover an answer from an older run.

1. **Output language** - `English` (Recommended) · `<detected source language> - same as the source` · `Other, type it`. For an English source option 2 reads `English - source language`. The answer binds every body and title. Code, commands, identifiers, model names, URLs and paths stay exact. An English pack is written in one variant of it, American unless the user or the voice profile names another; `awesome-humanize-en/references/spelling-variants.md` carries the families where that skill is installed.
2. **Editorial idea** - the 3 ideas from Phase 0, the first marked `Recommended`, plus `Other - describe it`. A custom idea the source cannot support is said so before drafting, with a narrower supported reading offered.
3. **Voice** - `First person` (Recommended for a personal feed) · `First person plural` · `Neutral third person` · `Voice profile from awesome-content-voice (path)` · `Style guide from awesome-style-mimic (path)`. A profile or guide is read before drafting. First person is editorial stance, never invented hands-on experience.
4. **Emoji** - `1-5` (Recommended) · `0` · `type a number`. Under `1-5` each form draws its own count: 2 to 5 on the long form, 1 to 3 on the regular, 0 or 1 on the short, all capped by the family's baseline in `references/registers.md`. A typed number is the count for the long and regular forms, and the short takes at most one. `0` turns them off everywhere.
5. **Creativity** - `1 - Normal` (Recommended) · `5 - Medium` · `8 - High` · `Type a number from 1 to 10`. One ten-step scale: Normal is 1, Medium is 5, High is 8, and a typed number is recorded as typed. The option labels carry the number and the name and nothing else. What each level permits is in `references/creativity.md`; the floor there holds at every level: no invented experience, no fabricated specifics, no softened caveat, no changed number, no re-voiced command.
6. **Footer** - `Yes, add a footer` · `No` (Recommended when the user has not asked for one). On `Yes` a follow-up collects the text verbatim, several lines allowed. It goes into the regular and long forms, never the short (Phase 5).

Record the answers as `Output language`, `Selected idea`, `Voice`, `Emoji`, `Creativity`, `Footer`.

**Then write `run-settings.md` in the run folder, before anything is drafted.** It is the run's own record, so a pack can be reproduced or re-run with one setting changed. One file, these lines, in this order:

```text
Run folder      <absolute path>
Started         <YYYY-mm-dd HH:MM:SS>
Source          <the path, URL or "pasted text" as given> -> source/<saved filename>
Forms           <short, regular, long, with the platforms each one serves>
Output language <answer>
Editorial idea  <the selected idea in full, plus the two not chosen>
Voice           <answer, with the profile or style-guide path where one was given>
Emoji           <answer as given>
Creativity      <n of 10, its level, and picked or typed>
Model           <the identifier the runtime reports, or "unknown" and why>
Footer          <no, or the text verbatim, indented so its line breaks survive>
Supplied        <the answers that arrived as invocation flags>
Source type     <type>   Source family <family>
Media           <written at Phase 10>
```

Nothing is invented to fill a line: an answer never given reads `not asked`.

## Phase 2 - Evidence notes and the module map

Read `references/fidelity.md`. Write `source-notes.md` with the evidence lines it defines: `[C#]` claims, `[N#]` numbers with their conditions, `[S#]` scope and hedges, `[Q#]` quotations, `[E#]` named entities, later `[V#]` verified facts, `[X#]` corrections and `[D#]` derivations, and `[A#]` author lines. An author line is a sentence the author turned well that carries a stance rather than a fact; it may be used in the long form and once more in one other form, never as the closing of two.

Then the module map `[M#]`, which is what keeps the output recognisably the source. For a guide the modules are its real sections and paths, each with a role: `primary-path` (at most 2), `secondary-path`, `decision-axis`, `caveat`, `troubleshooting`, `auxiliary-detail`. Each module records its portable takeaway (one sentence that survives in a short post), its medium details, its deep details, its representation in the source (prose, list, steps, code/config, table) and the evidence IDs behind it. For the other source types the modules follow the source's own sections, and the shapes in `references/authored-style.md` section 4.

The map also decides where each detail lives. Portable takeaways travel to all three forms. Medium details go to the long and the regular. Deep details (exact windows, raw rates, policy wording, alias history, a long diagnostic block) live in the long form only.

## Phase 3 - Verify current facts without writing a second source

Verify what is volatile or operational and what the source itself claims: prices and rates, model names and tiers, install and config commands, endpoints, temporary states, the privacy or retention statement when the source raises privacy, and the repository state when a claim depends on it. Primary sources first: official documentation, official repository, official API page or model card, official announcement; a reputable secondary source only when none of those settles it.

Verification means the page was opened in this run. Every `[V#]` and `[X#]` line records the URL, the span on that page that settles it, and the date it was read. A fact asserted from training memory is not verified, however confident. A value that could not be settled does not travel to any post.

The budget: verify what the source claims, correct what is stale, and add only the minimum external facts a source-requested comparison needs. Do not introduce a theme because official documentation contains it. A correction repairs the stale statement where it occurs: the correct name goes into every block silently, and the sentence explaining what changed appears once, in the long form. A correction that changes the reader's decision travels to every form that carries the decision, as one sentence.

When the source discusses price and names competing providers, resolve the comparison peers once, before any draft, by the rule in `references/fidelity.md` section 5, and record each ratio as `[D#]` with one range per peer.

## Phase 4 - Editorial brief and anchors

Read `references/authored-style.md`. Write `editorial-brief.md` with: `Source type`, `Source family`, `Primary subject`, `Source promise`, `Output language`, `Selected idea`, `Voice`, `Emoji`, `Creativity`, `Core frame`, `Decision axis`, `Core proof point`, `Task split` (a guide with a cost axis), `Main caveat`, `Current corrections`, `Comparison set`, `Title spine`, `Hashtag pool`, `Links`, `Forms and platforms`.

- **Core proof point** is the one concrete result that proves the decision axis. It appears in all three forms, in the rendering each length allows.
- **Main caveat** is the one limit a reader hits first, as one practical sentence.
- **Title spine** is the set of ingredients the three titles compose from, never a reusable string.
- **Hashtag pool** is one ordered set of 3-5 tags, most important first: the subject, the primary tools by the name people tag them with, and one category tag chosen by what people actually search for on the topic, checked live. The publisher takes tags from the front of it, so the order is the priority.
- **Links** are 1-3 official reader-facing URLs, the page that best carries the post's substance first.

Then write `anchors.md`: the sentences and blocks whose facts must be identical in every form. Which kinds of sentence may be anchors is decided by the source type (`references/authored-style.md` section 1): for a guide the proof, the split, the scope, the caveat and the setup blocks; for an essay, a benchmark or a retrospective only the sentences that carry a number with its condition, the quotations, the fenced blocks and the thesis as one clause. The stance, the closing line and the what-I-do-now ladder are never anchors. Setup blocks, config blocks and commands are one exact string wherever they appear. Prose anchors are fact sets: every form keeps the numbers, units, conditions, peers and named cases, and says them in its own words.

## Phase 5 - Write the long form

Read `references/forms.md`, `references/revision.md` and `references/surface-rules.md`. The long form is written as a draft first and then taken through the revision passes; a file drafted and polished in one sitting has skipped three of them.

The long form is the complete piece. It covers every module on the map, in the source's order, at the depth the material supports, and it keeps the source's representation: a command-heavy source keeps its commands in fenced blocks, a table becomes a fenced `text` block, a path list stays a list. Its shape is the one for the source type in `references/authored-style.md` section 4. Its length is whatever the material needs, under the long ceiling, and never padded toward it.

- **No H1.** The frontmatter `title` is the title, and the publisher puts it in the platform's own title field. The body opens on the first paragraph.
- **Headings** are `##` for sections and `###` below them, literal or stating the finding, and every section earns its heading by carrying something the others do not.
- **Blocks** are fenced `text` blocks for tables, lists of names, diagrams and before-and-after states, and fenced blocks in the right language for commands and config. No markdown tables: most of the group renders them as pipes.
- **Paragraphs** stay under 4096 characters each.
- **Links.** Contextual links inside sentences where the reader needs them, and a closing labelled list under a `## References` heading: the official pages of the primary paths, the pricing pages a comparison rests on, the source when it is public. Every URL in a command sits inside a fenced block.
- **The close** is a verdict with a consequence in it (Phase 7 rules), then the reference list.
- **The footer**, when the interview chose one, goes last, after the reference list: one blank line, a line holding `***`, one blank line, then the footer text byte for byte. Every footer line except the last ends in two spaces, the CommonMark hard break that keeps the lines apart on Markdown surfaces. The dash rule, the ASCII sweep and the punctuation cleanup never touch it.

## Phase 6 - Derive the regular form from the long

The regular form is the long form's argument retold for a feed: the opener, the proof, the few findings a reader would repeat, the caveat, the verdict, and the one link. It is written from the long form's facts and anchors, in new sentences, never cut from its paragraphs. A reader who sees both should recognise one author making one point twice, at two lengths.

- **Under 2000 characters, the whole body counted**, link line, `***` and footer included (`references/forms.md` section 3). Shorter is fine when the point is made.
- **Structure.** An opener paragraph or two, then two to four sections under `##` headings, each a few short paragraphs or one short list, then the closing verdict. A heading is a short line of plain words, because on a plain-text platform the publisher replaces the `##` with an emoji and the words stand alone after it.
- **Nothing that breaks on a plain-text composer.** No fenced block, no table, no command containing a URL (`linkedin` rewrites every URL it finds, commands included), inline code only for identifiers a reader would copy. A list is `- ` items of one line each.
- **The link** is one bare URL on its own line, after the closing verdict and before the footer, and it is the first entry of `links`.
- **The footer** follows exactly as in the long form, with the `***` line above it.

## Phase 7 - Derive the short form from both

The short form is the whole post's point in one breath, written for the tightest surface in its group. It is not the regular post shortened. It is a new passage built from the long form's portable takeaways.

- **Under 280, counted the way `x` counts**, with each emoji weighing 2. Complete sentences only, blocks separated by blank lines, no markdown of any kind. Nothing in it may depend on what the publisher adds after it.
- **The arc.** The author's own situation or the source's opening, the turn that sent them looking (at most 6 words, its own sentence), the finding in plain words, the number that bears it out, and a verdict. Every line follows from the one above it. The post carries at least one line about what the author actually did, drawn from what the source records, and the payoff sits in the last third, never first.
- **No link, no tag, no footer in the body.** The publisher appends the first entry of `links` and then whole tags, per platform, only where each fits whole. So the `links` list of the short file holds one URL only when that URL is the material the post is about, the published article, the repository, the report. When the only candidate is a generic page, the list is empty and the short post stands on its text.
- **It must survive alone.** A reader who never sees the long form gets the finding and the reason to care, and nothing in it points at something the post does not carry.

Rules that hold in all three forms. These are the rules a reader's choice between versions turned on:

- **Every form closes in its own words, on a verdict.** The last prose line is one sentence of judgment with a consequence in it, written for that form: what the number means, what the author does now, what the reader should stop expecting. No closing is a sentence from `anchors.md`, and the three forms do not share one.
- **The opener is one scene and one turn.** The first sentence is the author's own situation or the source's own opening, concrete, with the subject named. The judgment is not folded into it. A quotation, a paper, a vendor document or the mechanism sentence opens a form only where the source itself opens on it.
- **Nothing is invented to make a post livelier.** No experience the author did not have, no stake the source does not carry, no specific invented to satisfy a specificity rule. The run's own acts stay the run's: the pages this run opened and the counts it made never become `I read all three pages myself`.
- **Nothing repeats inside one form.** The key number appears once in the short form, no sentence appears twice in any file, and no content phrase of two or more words appears in two sentences of a short or regular body.
- **One fact, one sentence.** Two sentences carrying the same fact are one sentence and a defect. One sentence carries one fact, never four joined by commas.
- **Sentence length is a spread, never a pattern.** Each file meets the rhythm floor its level names in `references/creativity.md`, counted on its prose.
- **The subject family sets the register** (`references/registers.md`): its rhythm, its lexicon, whether a question to the reader is native at all.
- **Punctuation.** ASCII only (`'`, `"`, `-`, `->`), no em or en dash and no Unicode arrow outside exact code, a quotation or the footer. No semicolons.
- **Emphasis.** Bold only for the numbers of a compact proof and for one bold one-line lesson in the long form. Nothing else.
- **Emoji** follow the interview draw and the family cap, at the end of a frame sentence that ends its paragraph, never on an anchor, a heading, a list item or code, never two in one paragraph. Only the palette and gate in `references/authored-style.md` section 8.
- **Voice.** Under first person every form carries at least one genuine stance, and the long form a second one at the recommendation.

## Phase 8 - Frontmatter

Each file begins with exactly these keys, in this order, and no other:

```yaml
---
platforms: [<slug>, <slug>]
title: "<this form's title>"
voice: first-person | first-person-plural | third-person-neutral | profile: <path> | style-guide: <path>
creativity: <1-10>
model: "<the model identifier the runtime reports>"
links: [https://...]
hashtags: [TagOne, TagTwo]
---
```

Phase 10 adds one optional key, `attachments`, after `hashtags`. One blank line follows the closing `---`.

- **`platforms`** is the form's group from `references/forms.md`, narrowed by `--platforms`, in the table's order.
- **`title`** is written for the form, and the three differ. It names the subject and the finding, in at most 70 characters, never count-led, never a label about the post itself (`the short version`, `notes on`), never a teaser, never a thesis with a colon. The long form's title is what a search result shows, the regular's what a feed card shows, the short's what an image pin or a caption field shows.
- **`model`** is copied exactly as the runtime reports it, quoted, and reads `unknown` where the runtime exposes none.
- **`creativity`** is the number the interview recorded, identical on all three files.
- **`links`** is the brief's set on the long and regular files. On the short file it is the one link that is the post's own material, or `[]` (Phase 7).
- **`hashtags`** is the brief's pool, in priority order, identical on all three files, with no `#` and CamelCase for multi-word tags.

## Phase 9 - Audit, then deliver

Read the creativity number first and apply its level's thresholds. Count first, read second. A finding names the file, the rule and the span, with a verdict of `FIX` or `REWRITE` (`references/fidelity.md`), and an anchor defect is fixed in `anchors.md` first.

Counted:

- **Claims and sources** - `claims.md` covers every assertive sentence of the three files, each with an evidence ID and the URL opened this run. No row reads `unsupported` or `over-stated`, and every URL in every file was opened and still says what the post says.
- **Files and frontmatter** - exactly three files named `1-short.md`, `2-regular.md`, `3-long.md` (a form with an empty group is not shipped), the keys in order, no forbidden key, `platforms` equal to the resolved groups, `creativity` identical on all three.
- **Ceilings** - each body measured the way its ceiling is defined: the short the way `x` counts, the regular in characters with the footer included, the long in characters and per paragraph. A body over its ceiling is rewritten shorter, never cut at the tail.
- **Coverage** - the long form carries every module on the map, the regular carries the portable takeaways and the medium details that make the argument, the short carries the core proof point and the finding. A guide reduced to one path in the long form fails however accurate it is.
- **Anchors** - every anchor present in each form whose length can hold it, every number, unit, condition and named case identical to `anchors.md`, every block and command byte for byte.
- **Rhythm and tells** - per file, on prose only, against the level's floor and tell count in `references/creativity.md`.
- **Repetition** - no sentence twice in a file, no closing shared between forms, no short or regular sentence that is a long-form sentence with a word or two moved.
- **Style** - ASCII punctuation, zero semicolons, no H1, no tag line, no footer in the short, the footer byte-identical in the other two with its hard breaks, the `***` line above it, every URL in a command inside a fence, no bare dotted token (`CLAUDE.md`, `api.example.com`) left outside a code span, emoji count per form against the draw.

Read:

- **Fidelity** - every claim traces to an evidence line with its condition, quotations verbatim, peers locked, numbers and negations unchanged after any wording fix.
- **Each form alone** - read the short without the others: it carries the finding and the reason to care, and ends on a verdict. Read the regular alone: it makes the argument and names its proof. Read the long: it would satisfy someone who came for the source.
- **Why and when** - the long and regular forms say why, for which tasks, when to use the alternative, and the caveat.

Then create `<slug>_social_posts/` inside the run folder with the three files and nothing else (a `media/` folder joins them at Phase 10). The only thing that moves it elsewhere is a path the user named, and a named path that already holds a post set is reported before anything is written. State the absolute path. The folder is opened for the user at the end of the run, after the media question.

## Phase 10 - Media, the last question

The three files exist. One question, and the run does not end before it is answered:

| # | Option | What happens |
| --- | --- | --- |
| 1 | Images | Generated with `awesome-content-graphics` from this post set, or supplied by the user |
| 2 | Video | The user supplies one file, and the run derives stills and a vertical short |
| 3 | No graphics | The three files ship as text |
| 4 | Type here | Anything else the user means by media |

A supplied file is a path or a URL. A URL is downloaded into `media/` and the run says what it saved, from where, and its size and type. Anything that is not an image or a video is reported and the question asked again.

**Images.** Supplied: the file is resolved into `media/` and it is the approved picture. Generated: `awesome-content-graphics` is handed the facts from `source-notes.md`, its boundary section, the long form's title, the output language and `<posts folder>/media/` as its output folder; it runs its own count question and pick gate, and this skill does not restate them or proceed until it hands control back. Then, without another question, `awesome-content-image-adapter` is called with the approved picture and the posts folder. It writes two pictures beside the post files, `horizontal.png` (16:9) and `vertical.png` (9:16), and says which platforms take each; a picture no listed platform takes is not written.

**Video.** One source file becomes stills and a short, both made with video tooling already on the machine (`ffmpeg` is the usual one; confirm it answers first, and where nothing is installed ship the posts text-only and say what was skipped). Stills: at most 4 frames, chosen as the moments the posts talk about, never ticks off a stopwatch. The short: vertical 9:16, cut to the shortest verified video limit among the platforms that take video, keeping the moment the proof lands. Each form file declares the stills or the short its platforms can take.

**Frontmatter.** Media is declared after `hashtags`:

```yaml
attachments: [{ file: horizontal.png, frame: horizontal, alt: "<what it shows and what it means>" }, { file: vertical.png, frame: vertical, alt: "<what it shows and what it means>" }]
```

Each form file lists the pictures its own platforms take: both entries where its group mixes wide and square-or-tall frames, one where it does not. The `frame` marks alternatives rather than a carousel, and the publisher gives each platform the one that matches its shape. Paths are relative to the posts folder. Alt text is in the output language and carries no date; the publisher types the post's `title` as alt where a platform offers the field. `No graphics` is an answer about pictures, never about which forms get written.

**Then close `run-settings.md`**: fill its `Media` line with the answer, the files that came out of it, and which forms carry none.

**Then open the posts folder** on the user's machine and say that it was opened, with the absolute path in the same sentence and the note that it sits in the session's working area: `explorer` on Windows, `open` on macOS, `xdg-open` on Linux, checked to exist first, skipped in a headless run. When another skill called this one, hand the path back and open nothing.

The final message states: the folder path, the source type, the subject family and the selected idea, the creativity level, each form's platforms and its body length against its ceiling, the comparison set when there is one, the material corrections, the rhythm figures against the level's floor, the media answer and what was attached, and anything not verified. Post bodies are not pasted into chat unless asked.

## Anti-patterns

- Drafting before the six interview answers exist, or recovering any of them from an earlier run.
- Writing the short or regular form first and padding it into the long, or cutting the long at the tail to make the regular. The long is written first and complete, and the others are written again from it.
- A regular or short sentence that is a long-form sentence with a word or two moved. Retell, do not trim.
- A form that fits one platform in its group and breaks another, because the body was measured against a friendlier limit than the group's lowest.
- A short post that relies on its link or its tags to make sense, or that ends mid-thought because it was cut to fit.
- An H1, a tag line or publishing keys in a body. The title and the tags live in frontmatter, and the publisher places them.
- A footer in the short form, or a regular or long form without the footer the user chose.
- A fenced block or a table in the regular form, or a command carrying a URL where `linkedin` will rewrite it.
- A heading in the regular form that only makes sense with its `##`, such as a single symbol or a trailing colon.
- A long form padded toward its ceiling, or a regular post padded toward 2000 when the point was made at 1200.
- A generic docs page put in the short file's `links` when it is not what the post is about.
- Paraphrasing a number, a condition, a peer or a named case between forms, or re-voicing a command.
- A coined tagline the source never used stamped into all three forms, or the author's best line used as the closing of two.
- The run's own verification narrated as the author's act.
- Opening a form on a quotation, a paper or a vendor document when the source opened on the author's situation.
- Four facts joined into one sentence by commas.
- Long-short-long alternation written to pass a rhythm floor.
- A creativity level used as permission to invent an experience, a stake, a number or a contrarian line.
- A posts folder created beside the source file or in the invocation directory when the user named no path, or a run folder named from the source alone.
- Ending the run without the media question, or asking it before the three files exist.
