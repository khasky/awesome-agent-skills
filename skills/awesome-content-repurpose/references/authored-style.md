# Authored style - anchors, openers, shapes, closings, and how the posts sound

This file governs how the three bodies read. It does not choose the voice, the idea or the emoji count; `SKILL.md` Phase 1 does that every run. It carries no model sentences from any real run: every example below is a shape with placeholders, and each run finds its own words for it.

## 1. Anchors and frames

The three forms are one post at three lengths, and two kinds of text make that true.

**Anchors** are the facts that must be identical in every form: the numbers with their conditions, the peers, the named cases, the quotations, the commands and config blocks. They are written once in `anchors.md` and verified once. A command or a block is one exact string wherever it appears. A prose anchor is a fact set: every form keeps its numbers, units, conditions, peers and named cases, and says them in its own words. The one thing never allowed is the half-paraphrase that keeps an anchor's shape and moves a word or two, because a reworded proof drifts a number and a reworded caveat drops a condition.

**Frames** are everything around the anchors: the opener, the sentence that introduces a block, the section order, the closing, the heading words. They are written per form and never copied between forms.

**Which sentences may be anchors depends on the source type.** For a guide: the proof, the task split, the scope sentence, the caveat, the setup blocks, the path inventory, the mental-model diagram, the troubleshooting kernel. For an essay, a benchmark or a retrospective: only the sentences that carry a number with its condition, the quotations, the fenced blocks the source itself carries, and the thesis as one clause. Everything else such a source repeats is a fact set, whether that is the ladder of what the author reaches for, the verdict, the caveat as a judgment or the mechanism. Each form writes it in its own words.

**Three things are frames however factual they feel**, for every source type: the stance, the closing line, and the what-I-do-now ladder. Registering any of them as an anchor is how three forms end on one sentence.

What each anchor of a guide with a cost decision axis carries:

| Anchor | What it carries |
| --- | --- |
| `proof` | The subject tier, each peer with its own range, the basis the numbers rest on. In the long form: the raw rates by condition in fenced blocks, the resulting ranges, the conditions sentence without clock times, the like-for-like sentence. In the regular form: one sentence with the reason, the basis and each peer's range. In the short form: one sentence with a verb, `<subject tier> is roughly <range>x cheaper than <peer A> and <range>x cheaper than <peer B> at current <basis>`, never a colon-led fragment. |
| `split` | 5 to 8 named task types for the cheap path and 4 to 6 named cases that escalate, with the frontier family they escalate to. Two lists in the long form, two sentences in the regular, one sentence with two verbs in the short. |
| `scope` | The comparison is API against API, and a fixed subscription is not directly comparable. |
| `caveat` | One practical sentence opening on the imperative, naming 3-5 concrete things not to send and the alternative. In the short form, one sentence about what the reader does with sensitive material. |
| `setup-<path>` | The minimal verified block per primary path: what makes it run and the launch line, nothing the source or the official page does not carry. |
| `paths` | Every path the source covers: a fenced list in the long form, one sentence with the subject as its actor elsewhere (`<Subject> also works behind <A>, <B> and local <C>.`). |
| `model` | A three-to-five-line fenced diagram of what stays, what changes and who bills. Long form only. |
| `gotcha` | The symptom, the cause, the fix and the restart line. The block in the long form, one sentence in the regular. |

The placeholder stems in this file are shapes, not text. A stem that survives into a post is how two packs on unrelated subjects open the same sentence the same way. Before anchors are frozen, read the first four words of each and confirm they were chosen for this subject.

The words `guide`, `write-up`, `note` and `the source` never appear in a body. The post is the material, and behind the link there is usually only vendor documentation.

## 2. Voice

**First person** is editorial stance: `I would use`, `I would still escalate`, `for me the tradeoff is`. It never invents hands-on experience: no `I tested`, `I ran it for a week`, `it saved me`, `it caught`. A frame with no number is welcome: what the author has kept, replaced, expected or been looking at. A result inside that frame needs evidence.

Every form carries at least one stance, and the long form a second one at the recommendation. The short form usually opens on the author, as its arc asks. The regular and long forms may open on the author, on the finding or on the question the material answers, and reach the author by the middle.

**First person plural** uses `we/our/us` consistently and never implies a team tested something. **Neutral third person** carries no persona and stays decisive through selection rather than hedging. A **profile** or **style guide** controls tics; fidelity and the ceilings still win.

## 3. Openers

An opener names the promise in the reader's terms.

**For a guide**, three tests, at every length:

- **What stays is named**: the client, the editor, the tool the reader keeps.
- **What changes is named**: the provider, the setting, the model answering.
- **The modality is possibility, not report**: `You can keep`, `can sit behind`, `I would put`. A bare present indicative (`<Subject> sits behind <A>.`) says it is already installed, which is a different and false claim.

A first sentence made only of category nouns (`a cheaper model`, `the client you already have`) is rewritten around the names. The wire mechanism is a supporting sentence, never the first line.

**For an essay, a benchmark or a retrospective**, the opener is the author's own situation, or the question the measurement answers, concrete and with the subject named. It passes when a reader could not mistake it for the opening of a post on another subject.

**One scene, one turn.** The first sentence may run long as long as it is one situation; the openers readers kept averaged 20 words. The judgment is not folded into it. The turn that sent the author looking is its own sentence after it, at most 6 words. A quotation, a paper, a vendor document or the mechanism sentence opens a form only where the source itself opens on it.

**A stance opener carries its reason in the same sentence.** `I would put <subject> behind <A>.` is a preference with nothing behind it. `I would run <subject> under <A> for the cheap half of the work.` is the same move plus the thing the reader came for.

Banned first lines: a vague event with a vague time; a mystery tease; a first line that could describe ten unrelated products; a line that restates the title; a line about how the topic is usually argued; a verdict announced before the content (`The setup I would actually keep is the boring one:`); a self-positioning contrast on the author's own reading (`I read <subject> as X, rather than as Y`); a second-person chore (`Open your <file> and count`) under first-person voice.

Where a question opens a regular post, it is one clause, one thing asked, and every noun in it appears in the body. A question nobody could answer is filler, and a family whose writers do not ask (`references/registers.md`) gets none.

## 4. Shapes per source type

What each form covers, by source type. These are default orders; the source's own order wins where it differs.

**Guide/tutorial.**
- Long: an intro with the paths block, one `##` section per path in source order, the proof section under a question heading that names the peers, a caveat section, a troubleshooting section with its block and a one-line lesson, then the references. Setup comes before the economics, and the economics exist without consuming the article.
- Regular: the opener naming what stays and what changes, the primary path in prose (no block), the other paths in one sentence, the proof, the split, the scope, the caveat, the verdict, the link.
- Short: the stance with its reason, the proof, the split in one sentence, the verdict.

**Project/repository.**
- Long: what it is, the headline result, how it works, requirements and quick start, limits, who it is for, the verified install and the link.
- Regular: what was found, the headline result, the practical use, the caveat, the link.
- Short: what was found, the headline result, one verdict.

**Announcement/update.** What changed, why it matters, the mechanism, the main caveat, who should care, the official link. The short form keeps what changed and who it matters to.

**Benchmark/report.**
- Long: the setup and method, the results with their conditions, what they mean, the limitations, the practical implication.
- Regular: the question, the headline result with its condition, two or three findings, one limitation, the verdict.
- Short: the author's act, the finding, the number, the verdict.

**Essay/opinion.** The thesis and the argument order are preserved in every form. Examples are compressed, never turned into a feature list. The short form is the scene, the turn, the thesis, the number, the verdict.

**Retrospective/historical.** The timeframe stated early, old rules and prices in past tense, a current correction only where verified.

Central parts, in the long form:

- **Setup blocks** are minimal: what makes the path run, and the launch line. The fuller published block is described in one sentence and linked. A block is introduced by the tool's name and what it buys, never by a caption restating what the block visibly is (`Three variables and the launch line:`).
- **Secondary paths** get one to three sentences, or one short block, never both.
- **Text diagrams** carry the mental model, a routing split, a before-and-after or a question reframed, in fenced `text` blocks, three to eight lines, ASCII only. A diagram the run drew appears in the long form only; a block the source carries may appear wherever the form allows blocks.
- **Headings** are literal or state the finding, one per module. A regular form's heading is a short line of plain words that still reads after the publisher replaces its `##` with an emoji on a plain-text platform.
- **Paragraphs** are two to four sentences in the long form, one or two in the regular, and never three one-line fragments in a row.

## 5. Closings

**Every form ends on a verdict.** The last prose line is one sentence of judgment with a consequence in it, written for that form: what the number means, what the author does now, what the reader should stop expecting. `<what the number rules out>. <what is left>.` is the shape, not the text. It is never the ladder, never a sentence from `anchors.md`, and the three forms do not share one.

Other endings a form may take before the verdict: the caveat, the one-line bold lesson that ends a long form's troubleshooting section, a routing block, the reference list after the verdict. Never a summary of the body, never `What do you think?`, never a slogan triplet or a fragment rhythm (`Cheap by default, expensive on demand.`).

A question to the reader ends a post only where the family asks questions natively, and only when the post has not already asked one.

## 6. Titles

Composed from the `Title spine`; the three titles differ. Each names the subject and what happened to it or what it shows, in at most 70 characters, and survives alone in a file listing, a feed card and a search result. For a guide, a title carries both primary clients or one collective noun (`your coding CLI`, `coding CLIs`), never one client where the source has two.

Banned: a count-led inventory (`Six ways to`) unless the count is the claim; a label about the post itself (`the short version`, `setup notes`); a thesis with a colon; announcement voice (`<vendor> documents`); a teaser that withholds the subject; a mechanism noun or an abstraction as the centre (`the variable`, `the endpoint`, `dial`, `era`); a secondary module as the centre (the paper, the vendor's sentence); an audience in place of the subject (`for solo developers`).

## 7. Lexicon

The register is a competent person explaining something they found useful. Verbs stay plain: keep, swap, put X behind Y, route through, escalate, cut, cost, cover, show. Prose names products and models by their display name; the lowercase identifier belongs in code only. Comparison language is fixed: `roughly <range>x cheaper than`, `at current <basis> rates`, `depending on <condition> and <condition>`.

Banned in every form:

- coined taglines the source never used: a contrast pair (`X, not Y`), a numbers slogan, a two-word aside stamped as a closer;
- abstractions standing where the anchor names the product: `a stronger model` for the named peer, `the model layer`, `identity`;
- literary and report words: `thus`, `hence`, `myriad`, `albeit`, `salient`, `deliberately`, `figure` for a number;
- hype: `game changer`, `this changes everything`, `a new era`;
- filler: `it is important to note`, `it is worth mentioning`, `in conclusion`, `overall`, `moreover`, `furthermore`;
- meta-framing about the debate: `picking a side`, `a camp`, `a winner`, `the question is`;
- the post as a character: `this guide`, `what this post covers`, any count of its own sections;
- captions of the obvious: `That is the entire idea:`, an italic deck line under a heading, a line inventorying the steps;
- a demonstrative pointing at the post's own furniture: `that table`, `this block`, `the list above`;
- a count or a verdict on what follows before it is read: `three settings, the second is the one that matters`;
- self-benefit framing: `the useful part for me`, `what I like about it is`, `the part I keep coming back to`;
- an idiom outside ordinary spoken US English, and an aphorism about the setup that tells the reader nothing to do;
- bookish phrases: `received wisdom`, `conventional wisdom`, `the prevailing view`.

Numbers that are the payoff are digits, and a count of a technical thing is a digit (`3 variables`).

## 8. Emoji

**The limit is rendering.** The platforms these posts land on draw newer code points and variation-selector glyphs as an empty box. The gate:

- Only single code points from Miscellaneous Symbols and Pictographs (U+1F300 to U+1F5FF), Emoticons (U+1F600 to U+1F64F), Transport and Map (U+1F680 to U+1F6FF) and Supplemental Symbols and Pictographs (U+1F900 to U+1F9FF), plus the older symbols that render as pictures with no help: `⚡ ✅ ❌ ⛔ ❓ ❗ ⭐ ✨ ⏳`.
- Nothing at U+1FA70 and above.
- Nothing that needs U+FE0F to show as a picture, nothing built with a zero-width joiner, no skin-tone modifier.

The palette, grouped by meaning:

| Meaning | Emoji |
| --- | --- |
| money, price, billing | `💸 💰 💵 💳 🧾` |
| numbers that moved | `📉 📈 📊 🔢 ⏳` |
| speed, load, heat | `⚡ 🚀 🔥 💨 🐢` |
| tools, repair, building | `🔧 🔨 🔩 🧰 🧱` |
| looking, finding | `🔍 🔎 👀 📌 🎯 🚩 🚨` |
| thinking, ideas | `💡 🧠 🤔 🧩 💭` |
| keys, locks, privacy | `🔒 🔐 🔑 🙈` |
| routing, direction | `🔁 🔀 🔄 🧭 🚦` |
| verdicts and states | `✅ ❌ ⛔ ❓ ❗` |
| files, docs, packages | `📄 📁 📦 📋 📝 📚` |
| machines and networks | `💻 🌐 📡 🔌 🧮` |
| testing, safety | `🧪 🔬 🧫 🧯 🧊` |
| the author's reaction | `🙂 😅 😬 🙃 🤷 🤯 😴 🎉 👍 👏` |
| odds and ends | `✨ ⭐ 🧵 🧹` |

The table is a map, not a fence: any code point that clears the gate and means what the sentence means is allowed. The same palette serves the publisher when it replaces a `##` heading with an emoji on a plain-text platform.

**It is chosen by the words next to it.** Name the word in the sentence the emoji stands for before writing it. The swap test: replace it with one from a different group, and if the sentence reads the same, it was decoration and comes out.

Placement: at the end of a frame sentence that ends its paragraph, never between two sentences on one line, never inside an anchor, a heading, a list item or code, never two in one paragraph, never as a bullet, never in place of a word.

The interview sets the count, the form sets the draw (`SKILL.md` Phase 1), and the family caps it: a family `references/registers.md` marks at `none` takes at most one per form, and one more in the long form. On the long form, at most one emoji per 400 characters of body.

## 9. Comparison language

When price is the decision axis: verified API-to-API rates, one locked peer set, one range per peer, the scope sentence beside the proof, and token cost distinguished from completed-task cost in one clause in the long form. A workload cost example lives in the long form only. Never `X is simply weaker than Y`: the split says where each side is worth its price.

## 10. Punctuation, shape and emphasis

ASCII only: `'`, `"`, `-`, `->`. No em or en dash and no Unicode arrow outside exact code, a quotation or the footer. No semicolons, at any length: two thoughts are two sentences. No calendar date in prose except an `as of` qualifier on a correction of a temporary state.

Numbers carry the precision they were measured with and no decoration zeros: `1.00%` is `1%`, a whole number never carries a decimal point, and a value the source states loosely keeps the source's precision.

**Emphasis is earned before it is marked.** The free devices come first and cost nothing: the sentence alone on its line, the short sentence after a long one, the number at the head of its sentence, the colon that sets up a short payoff. Marked devices are a ceiling, never a quota: at most 2 marked spans in the long form, 1 in the regular, 1 of at most two words in the short. Bold only for the numbers of a compact proof and the long form's one-line lesson; capitals at most one span of at most three words; never two devices on one span; never Unicode pseudo-bold. Each marked span needs a reason the run can state: a number that breaks the pattern, a prohibition the caveat states absolutely, the one word the post turns on.

The exclamation mark: at most one per form, on a frame sentence, and only in a family whose `Ask` column reads `sometimes` or `often`.

## 11. Repetition

Inside one form: no sentence twice, no content phrase of two or more words in two sentences of a short or regular body, the key number of the short form once, and no two consecutive paragraphs opening on the same words. The clause that qualifies a number travels with the number rather than arriving again later.

Across the three forms: anchors repeat by design, frames do not. No closing is shared, no opener sentence is shared, and a regular or short sentence is never a long-form sentence with a word or two moved. An `[A#]` author line may appear in the long form and in at most one other form.

## 12. Read it aloud

Each form should sound like someone explaining something useful to a colleague and saying what they would do with it: plain verbs, real product names, one reaction where the emoji lands, one stance, one caveat. Not an essay contest, not a machine breathing between fragments, not vendor copy under a personal name.
