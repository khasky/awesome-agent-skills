# Authored style - anchors, frames, and how the posts sound

This file governs how the bodies read. It does not choose the voice, the idea or the emoji count; `SKILL.md` Phase 1 does that every run. It carries no model sentences from any real run: every example below is a shape with placeholders, and each run finds its own words for it.

## 1. Two layers: anchors repeat, frames do not

A post family has two kinds of text.

This file describes the pack at level 1, the floor of the dial. At levels 2 and 3 the anchor layer, the catalogs, the rhythm and the emoji baseline move under `references/creativity.md` and `references/registers.md`, and where those two disagree with a sentence here, they win for that level and this file still governs everything they do not name.

**Anchors** are written once in `anchors.md`, verified once, and reused word for word on every surface that carries them. They are the facts and judgments that must be identical everywhere: a reader who follows the author on three platforms meets the same proof, the same task split and the same caveat three times, and that sameness is what makes the family one family. An anchor is never paraphrased to look fresh: a reworded proof drifts a number, a reworded caveat drops a condition, and a pack of thirty paraphrases of one sentence reads as a machine straining for variety. The check is verbatim or absent at creativity 1. At 2 it is one of the run's registered variants, verbatim, the same variant across a whole presentation class. At 3 it is the fact set, complete and unchanged in meaning, with every number, unit, condition, peer and named case identical to `anchors.md`. Free paraphrase is a defect at every level: what changes is how many verified wordings exist, never whether a wording was verified.

**Frames** are everything around the anchors: the opener, the sentence that introduces a block, the section order, the transition into the economics, the closing, the question put to a room. Frames are written per platform and never copied between files. The echo check in section 11 counts them.

The anchor set a guide with a cost decision axis needs, with the wording rule for each:

| Anchor | Shape | Where |
| --- | --- | --- |
| `proof-micro` | One full sentence with a verb: `<subject tier> is ~<range>x cheaper than <peer A> and ~<range>x cheaper than <peer B> at current <basis>.` Tilde ranges, no bold, never a colon-led fragment (`<id>: ~Nx ...`). | hard caps |
| `proof-compact` | One sentence carrying four things: the decision axis, the basis the numbers rest on, each peer with its own range in bold, and the conditions the range depends on. The order and the opening words are the run's own. The placeholder stems in this file are shapes, not text: a stem that survives from one run into the next is how two packs on unrelated subjects end up opening the same sentence the same way, which the fingerprint and the echo counts both exist to catch. | feeds, community, `daily-dev` |
| `proof-full` | Three fenced text blocks (the subject's rates by condition; the peers' rates, each family's premium rung allowed as an extra entry; the resulting per-peer ranges), then the conditions sentence naming the conditions without clock times, the `scope` sentence, the cheap-path task list, the escalation list introduced under the selected voice, one sentence refusing to call either side universally weaker, and the decision-changing correction when there is one. The caption line before the first block belongs to the anchor. About 1,100-1,400 characters. | mini-blogs, deep articles |
| `split` | Two sentences under the selected voice, opening differently from each other: the first names 5 to 8 task types the cheap path takes, the second names 4 to 6 cases that escalate and the frontier family they escalate to. As two bullet lists inside `proof-full` and on community surfaces that render lists. The opening words are written for this run rather than carried over from the last one. | everywhere above hard caps |
| `split-micro` | One voiced sentence in two halves, each with its own verb: `I'd use it for routine or high-volume <2-3 named tasks> and escalate hard or critical work to a frontier <family> model.` The target is the frontier family, never the subject's premium tier. Never compressed by dropping `and escalate`, which turns the second half into a list fragment and the sentence into a riddle. | hard caps |
| `scope` | The like-for-like sentence: the comparison is API against API, and a fixed subscription is not directly comparable. | feeds, community, long forms |
| `caveat` | One practical sentence opening on the imperative: `Do not casually send <3-5 concrete named things> to a cloud model. For confidential <material>, prefer local inference or a provider whose retention policy matches your requirements.` Policy wording, jurisdiction and storage language never enter this anchor. | every surface above hard caps |
| `caveat-micro` | One short sentence about what the reader or author does with sensitive code (`For sensitive code, I'd stay local.` / `For private code, use local inference.`). Never a noun list (`No keys, no .env, no dumps.`), which reads as a claim about the system. | hard caps |
| `setup-<path>` | The minimal verified block per primary path: the two or three settings that make it run and the launch line, with a blank line before the launch line. Only the block is the anchor; the sentence that mentions the fuller published block, the scope of the variables or the advice to read a script is frame prose, worded per platform. | every surface that renders code |
| `paths` | The inventory of every path the source covers, as a fenced text block of one name per line for long forms and mini-blogs, and as one sentence with the subject as its actor for feeds and name-all hard caps: `<Subject> also works behind <A>, <B>, <C> and local <D>.` The other paths are places the subject runs, so the sentence says that it runs there. Never the label form (`Also covered: <A>, <B>, <C>.`), which has no verb and announces what the post covers instead of what works where. Never `the same guide also covers`, never a count. | every surface |
| `model` | A fenced text diagram of the mental model: what stays equal to what, what changes, who bills. Three to five lines, ASCII, `=` and `->` only. | mini-blogs, long forms, half of the feeds |
| `gotcha` | The troubleshooting kernel: the symptom sentence (the interface says A, the traffic goes to B) and the cause sentence (the catalog changed, the provider did not) in one paragraph, then the config block on code surfaces, then the restart line. Never three one-line paragraphs in a row. | feeds as one sentence; community as two; mini-blogs and long forms with the block |

Anchors carry the correct current names silently. The sentence explaining a retired name or an alias is not an anchor and lives on the two deepest surfaces at most.

What is not an anchor, and is counted as a frame: the sentence introducing a block, the sentence after it, a secondary path's description, the read-the-script advice, the scope-of-the-variables sentence, the one-line lesson, the closing stance. A frame that turns up in 3 files is a defect even when every word of it is true.

The post is the guide, and behind the link there is usually only vendor documentation. The words `guide`, `write-up`, `note` and `the source` never appear in a body: no `this guide`, `the same guide`, `the guide shows`, `the guide covers`, no guide that repeats, walks, lays out, takes one idea, is good at something or is liked; no count of its paths in prose. On community surfaces the inventory is the neutral sentence `<Subject> also works behind <A>, <B>, <C>, <D> and local <E>.`

## 2. Voice

**First person** is editorial stance: `I would use`, `I would still escalate`, `I like this guide because`, `for me the useful part is`, `the routing strategy I like is`. It never invents hands-on experience: no `I tested`, `I ran it for a week`, `it saved me`, `it caught`. A frame with no number is welcome and often the best opener a post has: what the author has kept, replaced, expected or been looking at (`I have been looking at <subject> as a <role>, rather than as a <role>`). A result inside that frame needs evidence.

Presence is checked, not forced into the first line: every body carries at least one stance, long forms a second one at the recommendation, and `variation-plan.md` decides where the author enters. About 10-25% of a full pack opens on the author; the rest establish the subject or the promise first and reach the author by the middle of the body.

**First person plural** uses `we/our/us` consistently and never implies a team tested something. **Neutral third person** carries no persona and stays decisive through selection rather than hedging. A **profile** or **style guide** controls tics; fidelity, caps and blueprints still win.

## 3. Openers

An opener names the promise in the reader's terms. For a guide that is: what they keep, what changes, and why they would bother, with the subject and at least one client named in the first sentence (`<Subject> can sit behind <Client A>.`, `You can keep <Client A> or <Client B> and put <subject> behind them as the model provider.`, `The guide shows how to keep <Client A> and change the model provider underneath it.`). A first sentence that only has category nouns in it (`a cheaper model`, `the client you already have running`, `a terminal agent`, `the tool and the model`) is rewritten around the names. The wire mechanism (`<provider> exposes a <protocol>-compatible endpoint`) is the second or third sentence and it is written once per post, never as the first line on more than 2 platforms in a pack.

**Three tests every opener passes, on every surface and at every length.** A sentence failing one of them is not an opener, however true it reads.

- **What stays is named**: the client, the interface, the editor, the terminal. The thing the reader keeps has to be a thing in the sentence.
- **What changes is named**: the provider, the setting, the model answering. `Nothing about <A> or <B> has to change for <subject> to start answering them` names neither half as a thing and asks the reader to assemble the claim, so the post opens on a shrug where the plain version (`You can keep <A> or <B> and put <subject> behind them as the model provider.`) opens on the point.
- **The modality is possibility, not report.** The post describes something the reader can do: `You can keep`, `can sit behind`, `can take over`, `do not have to leave`, `I would put`. A bare present indicative (`<Subject> sits behind <A> or <B>.`) says it is already installed, which is a different claim and a false one.

A negative opener (`You do not have to leave <A> or <B> to try <subject>`) ships only where a positive sentence naming what changes follows it in the same breath. Where one sentence is all the surface allows, the opener is positive.

**A stance opener carries its reason or its scope in the same sentence.** `I would put <subject> behind <A> or <B>.` is a preference with nothing behind it; `I would run <subject> under <A> or <B> for the cheap half of the work.` is the same move plus the thing the reader came for. On a hard cap that clause is the difference between a post and a shrug, and it is never the words dropped to fit.

Two-sentence openers on long forms take one of three second moves: the assumption denied (`Most people assume trying <subject> means installing another client.` then what is actually true), the consequence drawn (`... so the setting is the only thing you touch.`), or the second reassurance (`... and you do not need a new editor either.`). All three keep the two halves of the contract in the first sentence; the second sentence adds, never repeats.

The moves, each described by what the first sentence does:

| Move | What the sentence does |
| --- | --- |
| keep-and-change | Tells the reader they can keep the tool they use and put the subject behind it. |
| author stance | The author says what they would do with the subject and for what reason. Rationed to 10-25% of the pack. |
| keep-and-change, canonical | `You can keep <Client A> or <Client B> and put <subject> behind them as the model provider.` The plainest opener in the catalog and the default for visual feeds. |
| neutral role stance | `I see <subject> behind <Client A>/<Client B> mainly as a <role>.` The author's reading without praise of anything. |
| neutral inventory | `<Subject> also works behind <A>, <B>, <C>, <D> and local <E>.` Flat, no count, no adjective, no `guide`. `lemmy` and `facebook-wall` only: `hackernews` opens on what stays and what changes like the hard caps, and carries the inventory later or not at all. |
| community question | Asks the room whether anyone has done the thing, in concrete terms. |
| no-need-to | Tells the reader what they do not have to give up to get the result. |
| subject-can | The subject can sit behind or inside the named tools without changing the workflow. |
| easiest-way | One of the easiest ways to test the subject is the workflow the reader already has. |
| common assumption, contradicted | States what most people assume, plainly (`Most people assume trying <subject> means installing a new client.`), with the subject and a client named, and denies it in the next short sentence. Never the words `received wisdom`, `conventional wisdom` or `the prevailing view`. At most 2 posts. |
| direct answer | `Yes.` followed by one line that names what the guide shows for the named clients (`Yes. The guide shows direct integration paths for both.`), under a question title. Not a mechanism sentence. |
| bold lead line | A single bold sentence stating the setup as an equation, on surfaces whose natives write that way. |

At least 5 moves in a 12+ pack, no move on more than 25% of it, exact openers unique. Banned: a vague event with a vague time; an abstract category as the actor; a mystery tease; a generic scene about what developers usually do that the source does not support; a first line that could describe ten unrelated products; a first line that restates the headline; a first line about how the topic is usually argued (`framed as picking a side`, `treats this as choosing a camp`, `the question people ask`); a first line that admires or describes the guide (`I like this guide because`, `That is the whole shape of this guide`, `The guide takes one idea and repeats it`); a contrast whose halves are not both things the subject could be (`a provider, not a client to learn`); a telegraphic label with no verb (`<A>/<B>, add <subject>`), which names two things and asserts nothing about either; a verdict announced before the content (`The setup I would actually keep is the boring one:`, `the version I would really run is`), which asks the reader to take the conclusion on trust and then explains it; a self-positioning contrast on the author's own reading (`I have been looking at <subject> as X, rather than as Y`, `I read <subject> as X rather than Y`, `I would rather change X than learn Y`), which is one shape however many ways it is worded, and which says what the author is not doing instead of what the reader gets; the same shape with the contrast dropped (`I read <subject> as a low-cost provider behind <client>`), since reporting how the author reads the subject is still a sentence about the author's framing.

On the community and professional surfaces the opener stays concrete: `reddit` opens on the author's personal frame with the subject and both clients named, stated forward (`I have been running <subject> behind <A> and <B> for the routine half of the work`) and never as the banned `rather than` contrast; `lemmy` on the neutral inventory, the clients listed by name and uncounted; `quora` on the direct answer; `linkedin` on the easiest-way move with both clients named and a second sentence saying what the reader does not need (`no new editor, no separate chat workflow`); `peerlist` on the neutral role stance; `instagram` on the canonical keep-and-change sentence. These surfaces never open on a reframing. `hackernews` has no opener at all: a title line, then what the reader keeps and what answers, then `Why:`.

## 4. Central parts

- **Setup blocks** are minimal: what makes the path run, and the launch line. The extended published block is described in one sentence (`The published block also maps the default slots to <subject>`) and linked. The same block is identical on every surface that shows it. A block is introduced by the client's name and what the block buys (`For Claude Code:`), never by a caption restating what the block visibly is (`Three variables and the launch line:`), and never by `That is the entire idea:`.
- **Secondary paths** get one to three sentences, or one short block of at most six lines that is either the command or a fenced text list of what the path buys the reader (`one local endpoint / provider fallback / budget controls / spend tracking`). They never get the primary path's depth.
- **Path lists** stay skimmable: a fenced text block of names on long forms, a bullet list or one sentence on feeds. A path list from a multi-path guide is navigation, not a capability roll-call.
- **Text diagrams** carry the mental model (`interface + tools = A / model provider = B / billing = C`), the routing split (`<cheap path> -> tasks / <stronger path> -> cases`), a before-and-after (`UI says A / traffic goes to B`), and a question reframed (`Which model? -> How do I route?`). Fenced `text`, ASCII, three to eight lines, one label per line. On surfaces that render fences they are the default representation for these four things; on surfaces that do not, the sentence stays and the block goes.
- **Headings** on long forms are literal: one per source path in source order, then a question heading for the economics that names the peers (`Why use <subject> instead of a frontier <peer family> model?`), a one-word caveat heading, a troubleshooting heading that names the failure. Mini-blogs use the same headings; `tumblr` uses bold leads.
- **Bold** marks the numbers inside `proof-compact`, a bold lead where the blueprint says so, and the one-line lesson closing a long form. A bold word elsewhere is a defect.
- **Paragraphs** on feeds are one or two complete sentences each; on long forms two to four. Never three fragment-only lines in a row. A one-line caption before a block is a caption, not a fragment.

## 5. Closings

| Shape | What it does | Where |
| --- | --- | --- |
| caveat then link | The `caveat` anchor, the bare body link on its own line, the tag line where used. | feeds |
| gotcha then link | One or two sentences of the `gotcha`, then the link. | feeds, `pixelfed`, `minds` |
| room question | Built one of exactly two ways: the post's own opening statement turned into a question (`The easiest way to try <subject> is the coding CLI you already run` becomes `Is the coding CLI you already run the easiest way to try <subject>?`), or the shape `Has anyone used <subject> behind <A> or <B> mainly for <one reason>?`. Every noun in it already appears in the body, which is what keeps a duration, a workload or a measurement the post never carries (`a week`, `ordinary repository work`, `what it actually cost you`) out of the sentence: those are what make a question unanswerable. A question about the reader's result with the subject (`Has anyone compared <subject tier> with the default <client> models on a real repository, same task and tool permissions?`), never about the mechanics of the setup or which client handled it. One clause, one thing asked, and no protocol invented for the occasion: a duration, a workload, a setup and a comparison stacked into one sentence describes a study nobody ran and can be answered by nobody. One per post: where the visible title or the opening line already asks, the post does not ask again at the end. | optional on `devto`, `hashnode`, `daily-dev`; `reddit`, `quora`, `facebook-wall` and `lemmy` carry theirs at the top instead |
| routing block | The split as a fenced text routing diagram, then one sentence of stance. | mini-blogs, `quora`, `medium` |
| one-line lesson | The troubleshooting section ends on one bold sentence stating what the failure teaches (the layers that are separate). Worded fresh per post, on at most 4 long forms. | deep articles, mini-blogs |
| reference links | A short labelled list: the pages that settled the numbers, the official docs, the primary paths' pages. | deep articles |
| split then link | The one-line split and the link. | hard caps |

At least 4 shapes per pack, none on more than 40% of it, the author's recommendation sentence as the very last line on at most 6 posts of a full pack, no non-anchor closing sentence in more than 2 posts. Never a summary of the body, never `What do you think?`, never a maturity-curve line, never a slogan triplet or fragment rhythm (`Cheap by default, expensive on demand, local when ...`). A long form closes on one plain sentence of judgment (`That is a more useful way to think about <domain> than trying to pick one permanent "best <thing>."`), and a hard cap on `caveat-micro` or `split-micro` then the link.

## 6. Titles

Composed from the `Title spine`; each string unique. The moves:

```text
Use <subject> inside <Client A> or <Client B>
Run <Subject> Inside <Client A> or <Client B> Without Replacing Your Workflow   (deep articles, Title Case)
Run <Subject> Behind the Coding CLI You Already Use                            (deep articles, Title Case)
<Subject> Behind Your Coding CLI                                               (deep article or pin)
Put <subject> behind the coding CLI you already use          (the exact phrase; at most 4 titles)
Keep your coding CLI, put <subject> behind it
<Subject> as a <role> behind coding CLIs                     (replaceable model layer, low-cost provider, cost-routing layer)
<Subject> behind <Client A>, <Client B>, and other coding CLIs
Use <subject> behind <Client A> or <Client B> without changing the coding UI   (lemmy)
<Subject> behind <Client A>/<Client B>: <2-3 plain nouns>    (hackernews, x, bluesky, telegram, facebook-page, wonderful-dev)
<Subject> behind <Client A>/<Client B>: <the practical reason>   (hard caps, the compact form that keeps both clients)
<Subject> behind <Client A>: the <reason>-routing setup       (instagram)
<Subject> behind <Client A> or <Client B> for <reason>        (truthsocial, pinterest)
<Subject> behind <A>, <B>, and other coding CLIs            (three or more paths, never a count of the rest)
Can you use <subject> inside <Client A> or <Client B>?      (reddit, quora, facebook-wall)
Has anyone used <subject> behind <Client A>/<Client B> mainly for <reason>?   (reddit)
Why I would put <subject> behind <Client A> or <Client B>   (first person, at most 2)
A practical <subject> setup for <Client A> and <Client B>   (the clients, never an audience)
```

Deep articles (`devto`, `hashnode`, `hackernoon`, `medium`, `substack`) take the Title Case forms and never the colon-contents form. The clients in a title are the primary paths only; a secondary tool beside the subject (`<subject> inside <Client A> or <secondary tool>`) misreads the guide. The question form appears only where the blueprint names it.

The colon form carries plain nouns naming the post's contents (`API setup, cost routing, and local fallback`), never a thesis (`the routing, not the switch`), a label (`the short version`) or a slogan (`what it costs`).

The title and the body name the same clients, and both primary paths reach both: a title carries both clients (`<A>/<B>` on a hard cap) or one collective noun (`your coding CLI`, `coding CLIs`), and the body names both at least once even where only one gets its setup block. The platform templates below keep their own shapes; the clients are what goes into them, so a template written for one name takes both (`Keep <A> or <B>, put <subject> behind them`, `<Subject> as a replaceable model layer behind coding CLIs`). A title is never shortened by deleting a client. A title names at most two clients. A third and a fourth become the collective (`<A>, <B>, and other coding CLIs`), and a named client plus a count of the rest (`<A>, and 4 other coding CLIs`) is never written: it is the roll-call and the abstraction in one line. The subject and at least one client's product name are in every title (the exact phrase `the coding CLI you already use`, `your coding CLI` or `coding CLIs` stands in for the client on at most 6); the relation word is `inside`, `behind` or `as a <role> behind`; at most 80 characters; at least 5 moves in a 12+ pack; the same first 4 words on at most 3 titles; a roll-call of more than two clients in at most one title. Banned: a mechanism noun as the centre (the variable, the endpoint, the swap), an abstraction (`dial`, `identity`, `era`, `the whole story`, `default coding model`), a count-led inventory (`Six ways to`) unless the count is the claim, a label about the post itself, a thesis with a colon, announcement voice (`<vendor> documents`, `officially`), `replace <peer>` or `instead of <peer>` as the title's verb, an audience or occasion in place of a client (`for everyday coding work`, `for solo developers`), and any title that could sit on ten unrelated products.

## 7. Lexicon

The register is a competent person explaining a guide they found useful. Verbs stay plain: keep, swap, put X behind Y, sit behind, route through, escalate, cut, cost, cover, show, save. Prose names products and models by their display name (`<Vendor> <Tier>`, `<Family> <Version> <Tier>`); the lowercase identifier form belongs in code, config and inline code only, so a proof sentence reads as a person talking rather than as a config line. Comparison language is fixed: `roughly <range>x cheaper than`, `at current <basis> rates`, `depending on <condition> and <condition>`; not `under`, not `below`, not `lands`.

The source is referred to as what it is (`the guide`, `the write-up`, `the note`) as a grammatical subject that covers, shows, includes or recommends, at most once per 1,000 characters, never on a hard cap, and never as the object of the author's effort (`I read the guide`, `I went through the README` are out; the effort lands on the subject).

Banned across the pack:

- coined taglines the source never used: a contrast pair (`X, not Y`), a numbers slogan (`two X, two Y`), a two-word aside lifted from the source and stamped on every post as a closer;
- abstractions standing in where the anchor names the product: `a stronger model` for the named peer, `the model layer`, `a variable`, `identity`, `configuration rather than migration`;
- literary and report words: `duller`, `thus`, `hence`, `myriad`, `albeit`, `salient`, `deliberately`, `figure` for a number;
- hype: `game changer`, `this changes everything`, `the future is here`, `a new era`;
- filler: `it is important to note`, `it is worth mentioning`, `in conclusion`, `overall`, `moreover`, `furthermore`;
- an invented idiom: a phrase shaped like a saying that is not one;
- meta-framing about the debate rather than the guide: `picking a side`, `a camp`, `a winner`, `a routing decision rather than`, `separate purchases`, `the thing you are loyal to`, `the question is`, `smaller than the decision`, `a routing table rather than a winner`;
- the guide as a character or an object of admiration: `this guide`, `the same guide`, `I like this guide`, `what this guide is good at`, `the guide repeats`, `the guide takes one idea`, `the whole shape of this guide`, `the useful pattern in this guide is simple`, and any count of its paths (`six clients`, `five more`, `four other`);
- captions of the obvious and slogans: `That is the entire idea:`, `Three variables and the launch line:`, a lead line inventorying the steps (`Three variables for <A>, one script for <B>`), an italic deck line under the H1, a closing triplet of fragments;
- a demonstrative pointing at the post's own furniture: `that table`, `this block`, `the list above`, `the diagram below`. Name what it holds (`that split`, `the routing I would run`) or say it in words;
- a count of what follows, or a verdict on it before it is read: `Four lines of state, and the last one is the part I keep coming back to`, `three settings, the second is the one that matters`, `everything above the second line stays where it is`;
- self-benefit framing, which puts the author's relationship to the thing where a judgment about the thing belongs: `the useful part for me`, `what I like about it is`, `the part I keep coming back to`, `what this buys me`. A judgment about the subject is welcome (`a more useful way to think about <domain> than picking one permanent best <thing>`), and first person stays on what the author would do;
- an idiom outside ordinary spoken US English (`stay put`, `in front of your day`), and any sentence built on an abstraction doing something to the reader's life or handing them a list of abstractions to keep;
- an aphorism about the setup that carries no instruction: a sentence stating where something lives or what it is not, with nothing for the reader to do. On a hard cap every sentence is the promise, the proof, the split, the caveat or the link;
- bookish phrases nobody says aloud: `received wisdom`, `conventional wisdom`, `the prevailing view`, `it bears noting`.

Numbers that are the payoff are digits; every count of a technical thing is a digit (`3 variables`, `6 paths`); a count of the source's own items is not written unless breadth is the claim.

## 8. Emoji

**What may be used is a rule, not a shortlist.** The limit is rendering: the platforms these posts land on draw newer code points and variation-selector glyphs as an empty box, and an empty box in a published post is worse than no emoji at all. Everything that clears the gate below is available, and the palette is wide on purpose, because an emoji is chosen for the words beside it and a narrow list forces the wrong one.

The gate, in three lines:

- Only single code points from Miscellaneous Symbols and Pictographs (U+1F300 to U+1F5FF), Emoticons (U+1F600 to U+1F64F), Transport and Map (U+1F680 to U+1F6FF) and Supplemental Symbols and Pictographs (U+1F900 to U+1F9FF), plus the older symbols that already render as pictures with no help: `⚡ ✅ ❌ ⛔ ❓ ❗ ⭐ ✨ ⏳`.
- Nothing at U+1FA70 and above, the Symbols and Pictographs Extended-A block, which is where the empty boxes start: the window, the mouse trap, the wand, the screwdriver, the coin.
- Nothing that needs U+FE0F to show as a picture (the mantelpiece clock, the desktop computer, the gear, the warning triangle, the shield, the keyboard), nothing built with a zero-width joiner (professions, families, flags), and no skin-tone modifier.

The palette, grouped by what a group means, because the group is how one gets chosen:

| Meaning | Emoji |
| --- | --- |
| money, price, billing | `💸 💰 💵 💳 🧾` |
| numbers that moved | `📉 📈 📊 🔢 ⏳` |
| speed, load, heat | `⚡ 🚀 🔥 💨 🐢` |
| tools, repair, building | `🔧 🔨 🔩 🧰 🧱` |
| looking, finding, watching | `🔍 🔎 👀 📌 🎯 🚩 🚨` |
| thinking, ideas, puzzles | `💡 🧠 🤔 🧩 💭` |
| keys, locks, privacy | `🔒 🔐 🔑 🙈` |
| routing, switching, direction | `🔁 🔀 🔄 🧭 🚦` |
| verdicts and states | `✅ ❌ ⛔ ❓ ❗` |
| files, docs, packages | `📄 📁 📦 📋 📝 📚` |
| machines and networks | `💻 🌐 📡 🔌 🧮` |
| testing, safety, containment | `🧪 🔬 🧫 🧯 🧊` |
| the author's own reaction | `🙂 😅 😬 🙃 🤷 🤯 😴 🎉 👍 👏` |
| odds and ends | `✨ ⭐ 🧵 🧹` |

An emoji outside the gate is a defect whether or not this table names it, and the table is a map rather than a fence: a code point that clears all three lines and means what the sentence means is allowed, and a new one is recorded in the group it belongs to.

**It is chosen by the words next to it.** Name the word in the sentence the emoji stands for before writing it: the cost sentence takes one from the money row, the restart that fixed nothing takes one from tools, the retention clause takes a lock. No such word, no emoji. The second test is a swap: replace it with one from a different group, and if the sentence reads the same, it was decoration and comes out. A group is where to look, never a permission, so a privacy sentence does not take the rocket because the rocket was free.

The interview sets the count, the length class sets the draw, and the subject family caps it.

Under `1-5` the draw is per post and per class, because the same number is a different density in 280 characters and in 1500 words: **deep articles and mini-blogs draw from 2 to 5, every other class from 1 to 2.** The draw is recorded in `variation-plan.md`; a typed number is the count for every post; `0` removes them everywhere.

The family cap is applied after the draw: a family that `references/registers.md` marks at `none` takes at most one per post however high the number, and a family marked `none to one` never takes two. **On a deep article or a mini-blog that cap rises by exactly one**, so a technical family carries two across a long piece rather than one - one emoji in fifteen hundred words is not restraint, it is an accident the reader notices. The raise is one, not a free hand, and it applies to nothing shorter.

Two exceptions hold whatever the answer: `hackernews` carries none, and a hard-cap post is inside the 1-to-2 draw already because a third emoji in 280 characters displaces a fact. One density rule holds on the long forms: at most one emoji per 400 characters of body, counted after the frontmatter, so the extra one spreads rather than clusters.

Placement is meaning, not decoration: the emoji lands at the end of a frame sentence whose meaning it underlines (the restart line, the cause line and the caveat are anchors, so they never carry one), one emoji per sentence and never two side by side (the number nobody expected, the part that went wrong, the thing that just works, the author's own reaction) or opens the post on the promise. Never inside an anchor, which travels verbatim and bare. The same emoji on the same sentence in more than 2 posts is an echo, so the pack spreads its palette: in one post the reaction sits on the setup, in another on the author's stance. Spread them: never two in one paragraph, never a pair a line apart, never as a bullet marker, never one per line, never a row of three, never in place of a word the sentence needs. On a piece with headings, either the prose carries them or every heading does; never a subset of the headings.

## 9. Comparison language

When price is the decision axis: verified API-to-API rates, one locked peer set, one range per peer, the `scope` sentence beside the compact proof, and token cost distinguished from completed-task cost in one clause on long forms. The compact proof is the anchor; the workload example (`10M input and 2M output on <tier> costs about $N`) is supporting detail on at most 3 surfaces. Never `X is simply weaker than Y`: the split says where each side is worth its price.

## 10. Punctuation, shape and emphasis

ASCII only: `'`, `"`, `-`, `->`. No em or en dash, no Unicode arrow, outside exact code or a quotation. No `#show`. Semicolons: none, at any length, whatever the post's size. Two thoughts are two sentences, a qualifier joins with a comma, and where a pause genuinely needs marking a hyphen pair or a full stop does it. No calendar date in prose except an `as of` qualifier on a `core` correction of a temporary state.

Numbers carry the precision they were measured with and no decoration zeros: `1.00%` is written `1%`, `2.50x` is `2.5x`, and a whole number never carries a decimal point. Dropping a trailing zero is rendering, not rounding - `1.04%` keeps both figures - and a value the source itself states loosely is carried at the source's precision (`about 1%`), never at a computed one.

### Emphasis: earned first, typographic last

A post with nothing emphasized reads flat, and a post that emphasizes freely reads like an ad. The resolution the craft settled on long ago: the sentence carries the stress, and typography is what is reached for when the sentence alone cannot. So the devices below are ordered, and a run takes the cheapest one that works.

**Free devices. No budget, use them first.** They are prose, not formatting, and none of them counts against anything:

- the one-line paragraph - the sentence that matters standing alone between two blank lines, which is the strongest emphasis a feed has;
- the short sentence after a long one, and the fragment where the level allows it;
- the number placed at the head of its sentence instead of buried in the middle;
- the colon that sets up a short payoff;
- one word repeated deliberately across two adjacent sentences;
- quotation marks around a phrase the post is holding at arm's length, once per post.

**Marked devices. Budgeted, and each one has to be earned.** The budget is per post and it is a ceiling, never a quota: a post with no candidate that passes the earn test carries none, and that is the normal outcome.

| Class | Marked spans per post |
| --- | --- |
| deep articles, mini-blogs | at most 2, of which at most 1 is capitals |
| feeds, community surfaces | at most 1 |
| hard caps | at most 1, and only where the span is 2 words or shorter |

What may be marked, and how:

- **Capitals.** Two or three words at most, never a whole sentence, never a heading, never a title, never an anchor. A long string of capitals reads as shouting on every surface these posts land on and drops readability outright, so the span is a word or two inside an ordinary sentence and nothing larger.
- **Bold and italic**, on the surfaces that render them, stay inside what sections 4 and 5 already allow: the proof numbers, a bold lead, the one-line lesson, and one italicised word where a word is being used as a word. On a plain-text surface neither exists, which is why capitals are the device there.
- **Never two devices on one span**: no bold capitals, no capitals with an exclamation mark, no italics inside bold. Combining them is what makes a post look like it is trying.
- **Never Unicode pseudo-bold** - the mathematical bold and italic letter blocks that plain-text surfaces are full of. Screen readers spell them out character by character or skip them, they defeat search and copy, and they fail the rendering gate in section 8 for the same reason a box-glyph emoji does.

**The earn test.** A span is earned only when the source carries something that is genuinely out of line with the rest of the post and the span is the word that carries it: a number that breaks the pattern, a prohibition the caveat states absolutely, a single word on which the post turns. Write the reason beside the span in `variation-plan.md` before writing the span. A product name is not an outlier. A section label is not an outlier. An anchor is never marked at all, because it travels verbatim and the mark would travel with it.

**Exclamation and question marks.**

- The **exclamation mark** is at most one per post, on a frame sentence, and only in a family whose `Ask` column in `references/registers.md` reads `sometimes` or `often`. The technical families take none: a `!` in a debugging write-up reads as someone who does not publish there. Never on an anchor, a caveat, a number, a command line or a title, and never as the second mark on a span that is already emphasized.
- The **question mark** is a register property rather than a budget. `no` takes none; `rare` takes one, and only where the blueprint already puts a question; `sometimes` takes one in the body plus the closing question where the class has one; `often` takes up to two plus the closing. Every question is one the post then answers or one the reader can answer from their own setup - a question nobody could answer is filler, and it is the first thing to cut.

**Across the pack.** At most half the files carry a marked span, and no two files in one presentation class mark the same word: a device applied everywhere is a template, which is the failure section 11 exists to catch. The budget does not grow with the creativity dial - a higher number moves shape, not decoration.

## 11. Echo rules

After excluding anchors, code blocks, URLs, quotations, tag lines and bare identifiers:

- no prose sentence in 3 or more posts;
- no opener sentence twice, no 6-word opener prefix in 3 or more posts;
- no closing sentence in 3 or more posts;
- no non-technical 8-word span in 4 or more posts;
- no coined phrase of 3 or more words the source never used in 3 or more posts;
- no source aside lifted into a slogan on more than 3 platforms;
- no paraphrase of an anchor anywhere: the anchor verbatim or nothing.

Inside one file, none of that is enough, because a repeat a reader meets twice in four lines is louder than one spread across the pack: the post's key number appears exactly once, no content phrase of two or more words appears in two of its sentences, and the clause that qualifies a number travels with the number rather than arriving again later. A short post is where this shows: `I counted 635 bold spans` followed two lines down by `635 bold spans, one every three lines` is one sentence written twice.

An echo is fixed by rewriting the frame for that platform, never by removing the fact.

One check reaches outside the pack. The placeholder stems printed in this file describe what an anchor has to carry; they are not the anchor's text. A run that ships one of them verbatim has copied the reference instead of writing the sentence, and two runs on unrelated subjects then open the same sentence with the same four words, which is exactly the resemblance the dial exists to remove. Before the anchors are frozen, read the first four words of each one and confirm they were chosen for this subject.

These are the thresholds at level 1. At level 2 no prose sentence may appear in 2 or more posts and every claim carries a named referent; at level 3 no non-technical 6-word span may appear in 2 or more posts and every post carries one concrete detail no other post in the pack carries. The rule is deliberate: the freer the shapes, the less repetition the pack can afford, because repetition is the one tell that survives a change of shape.

## 12. Read it aloud

The post should sound like someone explaining a useful guide to a colleague and saying what they would do with it: plain verbs, real product names, one reaction where the emoji lands, one stance, one caveat. Not an essay contest, not a machine breathing between fragments, not vendor copy under a personal name.
