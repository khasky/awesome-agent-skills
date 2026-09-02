---
name: awesome-content-repurpose
description: "Repurposes one existing text — a published URL, a file, or pasted notes — into platform-native posts, then files them and optionally publishes: source notes every claim traces back to, an interview for platforms, voice, language and length, per-genre registers and dated platform limits reused from awesome-content-campaign, a two-stage anti-slop audit, and one dated file per platform in the format awesome-content-publisher takes, so publishing is a handoff, not a second implementation. Use when asked to 'repurpose this article into posts', 'adapt this for linkedin and x', 'turn this text into social posts', or in Russian 'адаптируй статью под соцсети', 'сделай посты из этого текста', 'перепиши текст под платформы'. Do not use to build a scheduled campaign from product sources — use awesome-content-campaign; not to publish a folder that exists — use awesome-content-publisher; not to build the voice profile — use awesome-content-voice."
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
- `dataviz` — the chart craft those graphics are built on: form choice, the colour formula and its runnable validator, mark specs, the anti-pattern catalog. Loaded before any graphic is written, never restated here.
- `awesome-humanize-en` — the structure pass and pattern catalogs the Phase 4 humanity pass and the Phase 5 audit run.
- `awesome-document-style` — Pass 1 and Pass 3, the two whose rules apply to a feed post rather than to a document.
- `awesome-slop-audit` — the prose fingerprints from its marker catalog: em-dash saturation, negative parallelism, the LLM list rhythm, redundant restatement.
- `awesome-content-voice` — the author's voice, when a profile exists.
- `awesome-content-publisher` — everything about publishing: bridge, login, ledger, pacing, read-back.
- `awesome-translate-ru-en` — whenever the output language differs from the source, in either direction.

## Invocation

```
/awesome-content-repurpose <url | file | pasted text> [--platforms <slug,slug>] [--publish]
```

No source given → ask for one before anything else. `--publish` is a preference recorded in Phase 2, not a bypass of the publisher's own confirmation gate.

## Phase 1 — Read the source, write the source notes

Get the text onto disk first. **Working state never lands in the invocation directory** — it goes to the agent's own scratch or session directory for this run (whatever the runtime provides: a session scratchpad, a temp path under the agent's home such as `~/.claude/`, or `TMPDIR`), in a `repurpose/<slug>/` folder there. The user asked for posts, not for a folder appearing in whatever repository they happened to be standing in. Only the final deliverable moves to a place the user names (Phase 6), and the run states both paths.

- **URL** — a plain fetch first; a live browser when the page is a JS app that returns an empty shell, so rendered content is not silently missed. **Driving a browser means driving one of the user's, so it is not a silent step**: when the session exposes more than one browser bridge, ask which one before the first navigation and remember the answer for the run; either way, name the browser that was used and warn that it is busy while the read runs. A page that turns out to need a logged-in session is no longer a public read — run the full target gate in `references/browser-interaction.md` (ships with `awesome-content-publisher`) before touching it. Save the extracted text to `source/` inside the working folder.
- **File** — read it directly; a folder gets an inventory first, then the prose.
- **Pasted text** — save it to `source/` on arrival, like everything else. Long source text stays out of the conversation context.

Then write `source-notes.md` beside it, which every later phase is checked against:

- **The point** — one sentence: what this text argues or reports. Compression that contradicts this line is a defect, not an interpretation.
- **Supporting claims** — one line each, in the source's own terms.
- **Numbers** — verbatim, with the conditions the source attaches to them. A number without its condition is not repurposable.
- **Provenance** — what this text actually is and where it came from: which release, which changelog, whose announcement, what date. Two sentences at most, and every post needs one of them, because a reader who does not know what is being discussed cannot use the rest.
- **Quotable lines** — 3 to 5 verbatim excerpts worth keeping intact, with their location.
- **Named things** — people, products, versions, places the source names, spelled the way it spells them.
- **What the source does NOT say** — the tempting adjacent claims a shorter version would drift into. This section exists because compression invents.

**The link a post may carry is not automatically the link the source arrived on.** A conversation with an assistant is a private artifact, so a share URL on an assistant's own domain never reaches a post: not in the body, not in frontmatter `links`, not as a "full thread" closer. The hosts this covers, and any other assistant's own domain that appears in a source: `chatgpt.com`, `chat.openai.com`, `claude.ai`, `gemini.google.com`, `aistudio.google.com`, `notebooklm.google.com`, `deepseek.com`, `chat.deepseek.com`, `grok.com`, `x.ai`, `copilot.microsoft.com`, `chat.mistral.ai`, `chat.qwen.ai`, `kimi.com`, `poe.com`, `perplexity.ai`, `hf.co/chat`, `you.com`, `phind.com`, `meta.ai`, `character.ai`. Three reasons, each sufficient: for most readers the URL does not open at all, a research transcript is the opposite of the author's own knowledge, and publishing a session is a decision the user never made. The URL stays inside `source-notes.md` as provenance and goes nowhere else.

So the run looks for the link the post deserves. Whatever the text is actually about (a release note, a changelog entry, a documentation page, a repository, a vendor announcement, the original article) is searched for and opened, and a candidate counts only when it is public and carries the claim the post will make. Present the best one in the gate below, saying what it is. Nothing public exists → the post ships with no link and an empty `links`, which is honest. Guessing a plausible URL, or falling back to the chat share, is not.

Present the point and the notes in one screen, then ask through the structured-question UI whether they are right and whether the proposed link is the one to publish (correct · the point is wrong, here is the right one · use this link instead · no link at all · stop). Every gate in this skill works that way — this one, the interview, and the publish-or-file decision. A gate written as a closing sentence the user must answer in prose reads as narration and gets passed over.

## Phase 2 — Interview

One round, structured-question UI when available, custom answer always allowed.

1. **Platforms** — every slug in `references/platforms.md` is available, and **the run asks whether the user wants all of them before it asks which ones**. The realistic answer is "all", so the first question is a single one — publish everywhere on the list, or trim it — with "all of them" the recommended option and the count stated (`All 32`). Only when the user chooses to trim does the checkbox pass run, split across several questions because the question UI caps options per question, and phrased as removing rather than adding (`Untick anything you do not want`). This ordering exists because the UI has no pre-checked state to give: a bare checkbox list makes the common answer the most laborious one, thirty-two ticks to say "everything", which is the shape that gets abandoned halfway.

   **Never offer a shortlist, a bundle, a "recommended set", or a subset inferred from the source, the language, or what looks like a fit** — narrowing the list is a decision the user did not delegate, and a platform missing from the question is a platform they cannot choose. Keep one open option for a platform the table does not carry.

   Then collect the target detail each selected platform requires, under the rule below. Two annotations, when the data exists: mark platforms where `publish-state/performance.md` shows the user's own median engagement, and mark platforms where the publisher's ledger already carries this source — repurposing into a feed that already has this piece is usually a mistake worth surfacing.

   **A target question offers what the user actually has, and it is one question per platform.** The Target column names a kind of thing (an instance, a community, a board, a squad, a client), and the failure to avoid is filling that in with plausible names the run made up — three Mastodon instances the user has never heard of, three Lemmy servers when their account lives on one, a menu of Nostr clients chosen from general knowledge. A user cannot answer "which of these three" when nothing in the question says why those three or which is theirs, and the honest reading of such a menu is that the run does not know either.

   So, in this order:

   - **Read it from the account.** Where a browser bridge is available and the user is signed in, the real list is one read away and it is read: the communities their own instance carries, the squads they have joined, the boards on their profile, the client they are signed into. `awesome-content-publisher`'s `references/browser-interaction.md` owns how that read is run, and it is a read, never a write. Then the options are theirs, ranked by fit to this post's topic rather than alphabetically, each labelled with the number that makes it choosable (subscriber count, member count).
   - **No bridge, or not signed in: two options, not three.** The canonical default the user already named or the table records, plus `another one, I will type it`. `mastodon.social` and `another server` is a real choice; `mastodon.social · fosstodon.org · hachyderm.io` is a quiz.
   - **Never re-ask what is already settled.** When the user has said `lemmy.world`, the instance is decided and the only open question is which community there. Re-offering `lemmy.ml` and `programming.dev` reads as the run having forgotten, and it invites an answer that contradicts the account they actually have.
   - **One platform per question.** A question headed `lemmy target and daily-dev target?` forces one answer to cover two unrelated decisions, so neither can be answered properly. Give each its own, and say in the question what the detail is for.
2. **Voice** — first person, the author reporting their own experience with the thing (default) · first person plural · neutral third person, for a source the author has no standing to have used · a voice profile from `awesome-content-voice` (path; `voice/*.md` is where to look) · a style guide from `awesome-style-mimic`.
3. **Output language** — same as the source (default) · another language. A different language means the posts are written in it by someone who thinks in it, never carried across word by word; Phase 4 holds the rules, and for the Russian and English pair they come from `awesome-translate-ru-en`, applied in whichever direction this run needs.
4. **Length and shape per platform** — native to the platform (default) · deliberately short · thread or multi-part where the platform supports it and the content is genuinely sequential.
5. **Emoji and hashtags** — a light sprinkle, one or two per short post where they land naturally (default) · none · a rule the user states. Hashtags follow the platform's researched norm either way.
6. **What happens after the files exist** — publish now · publish at a time the user names · files only. Whatever the answer, the files are written first.

**One image, and it goes everywhere the platform takes one.** Ask for media once: the library the user offers, or an offline graphic per `references/media-graphics.md` when a selected platform requires media and nothing covers it.

**No image supplied means a set of at least 20 and a second gate, never one graphic chosen by this skill.** The variant rules, the spread across the source's different facts, the gallery and the link are in `references/media-graphics.md` and are not restated here. What belongs to this phase is the sequencing: the interview's media answer only settles *whether* a graphic is generated. Which one ships is a separate question, asked after the set is rendered and the user has a link to look at, and no post file declares an attachment until they have answered it. A user who supplied their own image never sees this gate. Whatever image the run ends up with — supplied or generated — is then attached to **every selected platform whose Media column is `optional` as well as every platform where it is `required`**, not only to the ones that cannot post without it. A run that renders a graphic for `instagram` and ships text-only posts everywhere else has done the work and thrown most of it away; the same picture earns its keep on `linkedin`, `x`, `mastodon`, `tumblr`, `patreon` and the rest, and on the article platforms it becomes the cover image.

Three exceptions, and only these: a platform whose Media column says media is not supported (`hackernews`) gets nothing; a platform whose requirement is **video** cannot be satisfied by a still, so it is dropped rather than given the graphic; and a post whose own text argues against the picture — the user says so, or the image contradicts what that version says — carries no attachment, with the reason recorded in `campaign.md`. Every attachment carries alt text describing what the image shows, the same text on every platform.

## Phase 3 — Platform check

For every selected platform, confirm the current constraints: length cap and whether it varies by account tier, media formats and whether media is mandatory, link handling, hashtag norms, editor type, and any promo or disclosure rule that applies to what is being posted. Reuse `platform-cache.md` when its entry is under 30 days old and say it was reused with its date; re-verify anything older. Community rules — a subreddit's, a group's, a server's — are re-read every run regardless of cache age, and a community that forbids link-drops or self-promotion is reported to the user with the option to pick another target.

## Phase 4 — Write

Load the genre file for each selected platform first; the register belongs to the genre, and this phase adds the repurposing craft on top.

**One post, adapted per platform — not one post per platform.** The run picks ONE idea out of the source and writes it once; every selected platform then gets that same post adjusted for its mechanics: trimmed to the verified cap, hashtags in that platform's norm, the title-and-body split where the platform has one, the hook above the fold where the feed cuts. A reader following the author on three of them should recognise the same post three times, not discover three unrelated ones. Producing a different extract per platform is the failure this rule exists to prevent: it multiplies the work, dilutes the message, and leaves nothing that can be pointed at as "the post".

The user asks for more than one idea → that is more than one run, or an explicit list of units decided together up front and stated in the manifest. It is never a side effect of having several platforms selected.

**Choosing the idea: compression is selection, not summarizing.** A 2,000-word article becomes one post about its sharpest single point — not a synopsis, not a table of contents, not "here are the 5 takeaways" unless the source genuinely is five takeaways. The reader who never opens the original should still get something whole.

**What makes an idea worth the post.** Prefer the mechanism, the consequence, the thing that changes how someone works — and skip the inventory. A list of version numbers, a table of names, a feature roll-call carries no insight even though it is factual and easy to extract: it tells a reader what exists, never what it means for them. "Messages carry text, not files, so two sessions stay informed and still overwrite each other" is a post; "2.1.224+ on Linux and macOS, 2.1.234+ on Windows" is a footnote to one. Where a number genuinely matters, it belongs inside the mechanism it constrains, not as the subject.

**Every post carries its provenance.** One clause, early, saying what is being talked about and where it came from: the release, the changelog, the announcement. Without it a post about a mechanism reads as an opinion out of nowhere, and the reader cannot tell whether it is news, a manual, or a thought.

**Write it as the author's own experience, because that is what a feed post is.** Someone saw the thing, tried it, and is reporting back: ran into it, spent an evening on it, changed how they set something up, would not bother with half of it. First person, an opinion, a recommendation, a thing that annoyed them. A post that reads as a neutral summary of someone else's announcement has no reason to exist on a personal feed.

The frame is invented on purpose; the substance never is. Allowed: having read it, tried it, set it up this way, preferred one option, given up on another, expected something else. Forbidden: invented outcomes and measurements, a build time cut by a number, a bug caught, a team convinced, a client saved, any result the source does not carry. The Phase 5 fidelity pass reads first-person framing as framing and any specific result inside it as a fabrication.

**No calendar dates, in any language.** "Checked 30 Aug 2026", "as of August 2026", "30 августа разбирался" is the loudest machine tell a post can carry, because nobody stamps their own writing with an audit date. Recency is a relative word: yesterday, last week, the other day, recently, a few days ago, soon. The single date allowed to survive is one that is the subject itself, a deadline or an event day the reader has to show up for. A date attached to the author's act of reading, checking or verifying is never written, in the body, in a graphic, in alt text, or in a title. The frontmatter `scheduled` field is machinery, not prose, and is the one place a date belongs.

**Cut the specification.** Version floors, per-OS build numbers, tier matrices and requirement tables are what release notes are for, and a person writing about an update says roughly what changed and how recently. "Needs a fairly recent version" is how that sentence sounds. Where a constraint genuinely decides whether the reader can use the thing at all, it gets one plain clause and never a matrix; a long-form platform may carry one line more, still as prose. Whatever number does survive keeps the condition `source-notes.md` recorded.

**Energy is set by the genre, and it is read before writing rather than after.** A micro-post opens on the hook and carries its emoji where that platform's natives use them; a community post opens on the problem and stays plain; a long article earns its first line. Where the genre supports it a post is allowed to sound like someone who found something good: an opener that promises a payoff, a sharp line, the question the reader already has. Still banned everywhere: emoji as bullets, hype closers, and a loud label such as "PRO TIP" stamped on a post that carries no tip.

**No em dash in a post. Zero, not "sparingly".** The `—` character (and its long siblings `–` and `―`) is the single most recognisable machine fingerprint in a feed, and hand-set typography is not what a person types into a composer anyway. Every one of them becomes a full stop, a comma, a colon, or a pair of parentheses, and the sentence is usually better for it. This covers the body, the title, hashtag lines, alt text, and any words on a graphic. Two exceptions and no others: a verbatim quotation that carries one (prefer quoting a different line), and text inside a code block or a command. A hyphen inside a compound word, a flag or a slug is not a dash and stays.

**Emoji are part of how these platforms are written, so use them, and place them the way a person does.** A writer does not decorate a post evenly. They punctuate it: the emoji lands right after the phrase that earned a reaction, and the choice reports what the reaction was. 🤯 after the number nobody expected, 🧐 next to the caveat, 🤑 on the cost, 😅 on the part that went wrong. Put it at the end of that sentence or open the post with it, and the reader feels a person reacting rather than a template being filled.

**The budget is 0 to 5 for a whole text, scaled to its length**, and the exact count matters less than the spacing. A micro-post carries none or one. A medium feed post carries one or two. A long article carries three to five across the whole piece, and it is allowed to go several paragraphs with none. Two emoji inside the same paragraph, or a pair a line apart, reads as decoration however good each one is on its own; keep real distance between them.

**Headings take emoji well, and that is a second placement worth using** on the long-form platforms: `## What it costs to leave one running 🤑`, `## What I would take away 🧐`. One at the end of the heading, on two or three headings out of five, never on every one. Headings and body draw from the same budget, so a piece that decorates its headings carries fewer in its prose.

Restraint still applies: never as bullet markers, never one per line, never a row of three, never in place of a word the sentence needs, and never on a platform whose natives do not use them (the genre file and the Phase 3 research decide that). The interview's emoji answer overrides this default in both directions.

**The link belongs to the sentence that points at it.** Where a post says "read it", "their post", "the announcement", the URL follows on that same line after a colon or a space, never on a line of its own with a blank line above it. A URL floating between two paragraphs is the shape of a post assembled out of blocks, and a reader scanning a feed sees a naked link rather than a reason to click. The exception is a platform whose composer wants the URL alone to build its preview card, and that comes from the Phase 3 research rather than from habit. **Anywhere else, a blank line between prose and its own link is a defect** — the closing sentence carries the URL inline: `Faster than real time is what turns a video model into a channel. Read more: <url>`.

**No trademark word carrying its ordinary meaning.** A common noun that is also a large company's name stops reading as the noun the moment it lands in a feed: `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`, `teams`, `windows`. The reader sees the company, the sentence bends around it, and on a post about software the misread is instant. Write the ordinary synonym instead — head start, margin, band, idea, disagreement — and keep the word only where the post genuinely is about that company. This covers the body, the title, alt text, hashtags and any words on a graphic.

Rules that hold across every platform:

- Numbers keep the conditions `source-notes.md` recorded. A benchmark without its machine, a percentage without its base, a claim without its scope is not a shorter version — it is a different claim.
- Quoted lines stay verbatim, inside quotation marks. A paraphrase presented as a quotation is a fabrication.
- The source's own terms and spellings survive; renaming its concepts to something punchier is how a repurposed post stops being about the source.
- Nothing from the "What the source does NOT say" section reaches a post.
- Threads only where the content is sequential, and each part must survive being read alone — the platform will show it alone.
- **Tags with their own field in the composer never appear in the body.** The article platforms (`devto`, `hashnode`, `hackernoon`, `medium`) and `tumblr` take tags in an input of their own, so the post file carries them as a `tags` frontmatter list and the prose ends on prose. A line of bare words under the last paragraph (`ai machine-learning video news`) is a tag dump that publishes as literal text, and it is the tell that a feed post's hashtag habit was applied to a platform that does not work that way. Inline `#hashtags` stay in the body only where the platform's own natives write them there.
- **No invented idiom.** A phrase that sounds like a saying but is not one — "proved it the blunt way", "a figure worth stopping on", "the honest version of that story" — is machine phrasing, because it reaches for the shape of a colloquialism without any colloquialism behind it. Write what happened in ordinary words: "someone at fal just tried it", "one number stuck with me". When a phrase cannot be found in speech, it does not belong in a feed post.
- Voice per the profile when there is one, including the habits its *Personal tics* section protects; those are exempt from the Phase 5 slop pass.
- The link is the one Phase 1 settled on, or none at all. An assistant's own domain never appears, and no post closes on a research transcript.

### The unit is cleaned before it fans out

Write the unit once, whole, as a single text. Then run the humanity pass on that one text, before any platform adaptation touches it. A tell copied into ten files gets fixed ten times and usually only in nine.

What runs, taking from each catalog the part that applies to a feed post rather than to a document:

- `awesome-document-style` Pass 1 — chatbot artifacts: citation markers, `utm_source=chatgpt.com` and its siblings on any surviving link, visible placeholders, zero-width characters, chat-UI leftovers.
- `awesome-document-style` Pass 3 — filler adverbs, inflated importance, "it is important to note", "not only X but also Y", forced groups of three, vague positive endings, summary-stamp openers, and restatement of a point the post already made.
- `awesome-humanize-en` — the structure pass in `references/structure-pass.md`, the masked contrast patterns, and the vocabulary tiers with their density gating.
- `awesome-slop-audit` — the four markers from its catalog that survive into prose: em-dash use of any kind (here the bar is zero, stricter than that catalog's), negative parallelism as the default shape ("not X, but Y"), the emoji-plus-bold-lead list rhythm, and a closing line that restates the opening.

Then read it out loud. Uniform sentence length, every line engineered to land, no ordinary sentence anywhere: that text was scrubbed rather than written, and one plain observation goes back in.

Only the cleaned unit fans out. Adaptation may cut and reshape; it may not put back what this pass removed.

### Writing in a language other than the source

The other-language version is written in that language, not carried across from the version that already exists. Sentence order, connectors, idiom and sentence length all belong to the target language, and the English original stops being the skeleton showing through.

For Russian and English in either direction, `awesome-translate-ru-en` holds the rules, and the load-bearing ones here are semantic-over-literal, its connector map read in whichever direction this run needs, register matching, and its forbidden-phrase list. On top of that, the tells that give away a Russian post assembled out of English: English word order left intact, «это не X, это Y» negation frames, calqued connectors («более того», «важно отметить», «в современном мире»), passive constructions where Russian wants an active verb, participial chains nobody speaks in, and a formal «вы» register on a feed written on «ты». The test is reconstruction: if a native reader can rebuild the English sentence behind the Russian one, the sentence is rewritten rather than adjusted.

Identifiers, commands, flags, product names and error text stay in the original, untranslated. One rule of that skill does not carry over: where it says to preserve em dashes as em dashes, the zero-dash rule above wins, because these outputs are composer text rather than formatted prose.

## Phase 5 — Audit, two stages

List every finding across all posts first, then fix. Detection mixed into rewriting collapses onto one dimension, and a rewrite done without the full list leaves the structural tells more visible, not fewer. One pass at a time:

1. **Fidelity** — the post's point matches `source-notes.md`; every claim and number traces to it with its condition; quotations verbatim; nothing from the "does NOT say" section present. A post that fails here is rewritten, not patched.
2. **Structure** — the discourse pass from `awesome-humanize-en` (`references/structure-pass.md`): the outline test, question sequence, position tells and stance, run on the unit itself. Across platforms the posts are deliberately the same post, so what is checked there is different: every version still carries the same point, the same provenance and the same numbers, and no adaptation quietly turned into a second claim.
3. **Slop** — vocabulary and syntax against that skill's catalogs, with the voice profile's protected tics excluded.
4. **Human register** — the Phase 4 rules, checked one by one: no calendar date anywhere, including titles, graphics and alt text; the first-person experience frame present where the voice answer asked for it, with no invented result inside it; no version matrix or specification dump; emoji present and placed per the interview answer and the genre file, never as bullets; zero em dashes, counted by search rather than by eye, in body, title, hashtags, alt text and graphics alike.
5. **Language** — for every post not written in the source language: the nativeness test from Phase 4, no calques, register consistent across the post, technical tokens untranslated.
6. **Links** — no assistant domain in body, frontmatter or alt text; the link that is there is the one Phase 1 settled on, it resolves, and it carries the claim the post makes. A post with no link is recorded as such in `campaign.md` rather than quietly given one.
7. **Length** — counted, not eyeballed, against the Phase 3 cap for each platform, hashtags included, and counted the way that platform counts: a URL that costs a fixed 23 characters (`x`), CJK and emoji that cost two, a title that shares the body's budget. Where the cap could not be verified, the unit is written short enough that the question does not arise rather than written to the edge and hoped for — `peerlist` published a 495-character body cut two characters into its closing URL, with no counter and no error anywhere in the composer. **A post that ends on its link is the worst shape for an unverified cap**: put the link where losing the tail would not destroy the post, or shorten until the margin is real.
8. **Media** — every declared attachment exists, matches the platform's verified formats, has alt text describing what the image says. Where the image was generated rather than supplied, the attachment is the variant the **user** chose at the Phase 2 pick gate, and `campaign.md` records which one out of how many; an attachment this skill selected for itself is a finding, not a shortcut. **And the coverage is checked the other way round**: when the run has an image, every selected platform whose Media column reads `optional` or `required` declares it, with only the three exceptions from Phase 2 allowed and each one named in `campaign.md`. A picture attached to one post out of twelve is a finding, not a style choice.
9. **Filename and frontmatter** — every name parses back against the contract in Phase 6, and every file carries the fields that contract lists, `voice` among them. A `voice` naming a profile or a style guide is checked to be a path that exists, not a label; a post whose text was bent by its platform carries the `voice_deviation` line that says so.

**The gate, per post:** any fidelity finding, any structural finding, any assistant-domain link, any calendar date, or three or more findings total → rewrite from the source notes; one or two wording findings → fix in place; none → ship. A rewritten post re-enters at pass 1. Fixes skew replace and delete over insert; the only addition allowed is specificity already present in the source notes. Report, do not "fix", posts that read scrubbed — no contractions anywhere, every line engineered, no ordinary sentence left.

## Phase 6 — Files, always

`repurpose/<slug>/posts/`, one file per platform, in the format `awesome-content-publisher` reads, named exactly as it expects:

```
YYYY-mm-dd_HH-mm_<pub-timezone>_<title>_<platform>.md
```

The scheduled time is the publish time chosen in Phase 2 (now, or the time the user named). Frontmatter carries `platform`, `scheduled`, `timezone`, `title`, `voice`, `target` where the platform needs one, `attachments` with alt text, `links`, `hashtags`, `status: draft`. `links` holds the public source Phase 1 settled on, or nothing at all; the URL the source arrived on never lands there when it belongs to an assistant.

**The `<title>` field is a lowercase kebab-case slug**, cut from the post's title after that title is written — the publisher parses the name against `[a-z0-9][a-z0-9-]*` for this field, so a capital letter or an underscore fails the round trip before a word of content is read.

**What the title has to say is `awesome-content-campaign`'s rule and is not restated here**: name the subject and state the point, never an unanchored fragment, a topic label or a teaser. It is the same rule the unit's own headline follows, applied to the field a composer and a file listing will show without the post around it.

**`voice` is written on every post file, always, and it names what was actually used rather than what was offered.** A post read back months later has to answer which voice wrote it without the manifest beside it, and a batch written under a profile that has since been rewritten is unreadable evidence otherwise. The value is the Phase 2 answer resolved to its source:

- A profile from `awesome-content-voice` → `profile: <path>`, the path as it was read, so the file can be opened again.
- A style guide from `awesome-style-mimic` → `style-guide: <path>`, same rule.
- One of the built-in answers → `first-person`, `first-person-plural`, or `third-person-neutral`.

Where a post deviates from that voice on the platform's orders — a genre demanding what the profile's evidence does not carry, a tag field that overrides the profile's hashtag casing, a platform whose natives use no emoji — the deviation goes on the same file in a `voice_deviation` line saying what was overridden and what overrode it. A deviation recorded only in `campaign.md` is lost the moment a post file travels on its own.

Beside them, `campaign.md` — the name is the publisher's contract, not a claim that this was a campaign. It records the source and its provenance, the link the posts carry with how it was found (or that none exists and the posts carry none), the notes the posts were checked against, the one idea the unit carries, per-platform limits with their checked-on dates, what each platform's version had to cut or reshape, and any Profile prerequisite (a bio link a "link in bio" post depends on).

Files exist before anything is published. A run that fails at the third platform leaves seven finished posts on disk, and the publisher's ledger knows which two already went out.

## Phase 7 — Publish, or stop

Files only → the skill reports where they are and stops.

Publish now, or at a named time → hand the folder to `awesome-content-publisher`:

```
/awesome-content-publisher repurpose/<slug>/posts --now
```

Everything about publishing belongs to that skill and is not reimplemented here: the browser-bridge preflight, the login check with wait-or-skip, the ledger that survives a restart and prevents duplicates, the confirmation gate, the human pacing, the read-back of every post, the incident handling. Drop the `--now` when the posts carry real future times; it will wait for them.

That skill not installed → say so, leave the files, and print the command to run once it is. Nothing about the output depends on it.

## Verification

The report states: the source and its provenance, the link the posts carry and how it was found (or that no public one exists, and that the posts therefore carry none), the one idea extracted from it, the N platform versions of that single post and what each had to cut, all lengths counted against limits checked on their dates (naming cache reuse), every audit pass with its findings and the gate row each post landed on, filenames parse-verified, the voice the posts were written in named by its resolved source rather than by the interview option that chose it, the folder path, and — when publishing ran — the publisher's own report rather than a restatement of it. Anything skipped (a platform dropped for want of media, a community whose rules forbid the post) is named, never implied.

## Anti-patterns

- Writing a different post for each platform. One unit, adapted — a reader who follows the author on three of them should meet the same post three times.
- Building the post out of an inventory: version numbers, feature roll-calls, lists of names. Factual, easy to extract, and worth nothing to a reader who wanted to know what changed for them.
- A post with no provenance, leaving the reader unable to tell what is being discussed or where it came from.
- Summarizing instead of selecting — the "5 key takeaways" post that reproduces the source's table of contents and gives the reader nothing whole.
- Publishing the URL the source arrived on when it points at an assistant's own site, or closing a post with "full research thread" and a chat share link.
- A calendar date in a post: the "checked on" stamp, the "as of <month>" qualifier, the dated opening line in either language.
- A version and OS matrix inside a feed post, where a person would have written "needs a recent version".
- The neutral-summary voice: a post that reports someone else's announcement instead of the author's own run at it.
- Fanning the unit out to ten platforms before the humanity pass has touched it, then hunting the same tell ten times.
- A Russian post with English sentence order and calqued connectors showing through, produced by translating the English one instead of writing it.
- An em dash anywhere in a post, including the title, the alt text and the graphic.
- A post with no emoji at all on a platform whose feed is full of them, and the opposite failure: emoji as bullet markers or one on every line.
- Inverting the source's point by cutting the qualifier that carried it.
- A number without the condition the source attached to it, or a paraphrase inside quotation marks.
- Adding the adjacent claim the source stopped short of — that is what the "What the source does NOT say" section is for.
- Rendering a graphic for the one platform that demanded it and shipping every other post text-only. The image was made for the idea, not for `instagram`; it belongs everywhere the platform accepts one.
- Publishing without files, or writing files the publisher cannot parse.
- Reimplementing any part of publishing, humanizing, or voice-building here instead of handing off.
- Repurposing into a feed the ledger shows already carries this source, without telling the user.
- Letting the whole source text into the conversation context instead of reading it from disk.
