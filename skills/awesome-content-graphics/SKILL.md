---
name: awesome-content-graphics
description: "Produces the one image a post ships with, offline: a set of at least 20 self-contained HTML/CSS graphics rendered locally to PNG, built from the caller's own facts and from whatever the user supplies as input — a brand palette, reference images, example graphics, a render they already approved — with two user gates, the headline first and the picture second, so the skill never picks the campaign's image on the user's behalf. No image-generation service, no API key, nothing uploaded anywhere. Use when asked to 'make an image for this post', 'generate a graphic for the campaign', 'draw a picture for social', or in Russian 'сделай картинку для поста', 'нарисуй графику к посту' — and whenever awesome-content-campaign or awesome-content-repurpose reach a platform that cannot post without media. Do not use for photographs, illustrations, people or product mockups (it draws flat shapes and one line of type); not for video, which it cannot produce; not to write the posts themselves — use awesome-content-campaign or awesome-content-repurpose."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "graphics", "social-media", "design", "html-css"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-graphics"
---

# Content Graphics

The image a post ships with, made on the machine that is already running. A self-contained HTML file styled with CSS, screenshotted through browser automation, and nothing else: **no image-generation service, no API key, no upload of the user's content anywhere.**

This is one stage lifted out of the content pipeline so every skill that needs a picture calls it instead of carrying its own copy of the rules. `awesome-content-campaign` calls it when the media library cannot cover a media-required post; `awesome-content-repurpose` calls it when the run has no image; a user calls it directly when they want a graphic and no campaign around it.

**Core principle: the run produces a set and the user chooses, twice.** First the headline, as text, before anything is drawn. Then the picture, from a gallery of renders of that one headline. A skill that renders one graphic and attaches it has answered two questions the user was never asked, and correcting it costs a whole round trip.

**Second principle: the facts are the boundary.** The composition may not assert a relationship the caller's sources do not carry. An image is a claim surface like any other sentence, and a wordless claim is still read as evidence.

Bundled files (load on demand):

- `references/visual-language.md` — what to draw for what kind of idea (the shape table), the craft that makes twenty renders look like twenty rather than one recoloured, and the rendering mechanics. **Read it before writing the first line of markup**, not after the first contact sheet comes back grey.

It also reuses, by reference rather than by restating:

- `dataviz` — the chart craft underneath: form choice, the colour formula and its runnable validator (`scripts/validate_palette.js`), mark specs, the anti-pattern catalog. Loaded before any graphic is written.
- `awesome-content-campaign`'s `references/platforms.md` — the Media column, when the caller needs to know which platforms take the result.

## What it produces, and what it does not

What comes out is a **flat graphic built out of shapes, colour and a few words**. Say that plainly to the user, because it is not what "generate an image" usually means: photographic and illustrative imagery is out of scope — no rendered scenes, no people, no product mockups, no logos of companies the sources do not connect to the product.

It produces **stills**. A platform whose requirement is video (`tiktok`, `youtube` uploads) cannot be satisfied by this path, and a still is never offered as a substitute — recommend dropping the platform instead of shipping an unpostable draft.

## Invocation

```
/awesome-content-graphics [<facts-source>] [--out <dir>] [--refs <path…>] [--count <n>] [--ratio square|vertical|landscape]
```

- `<facts-source>` — a file, a folder or pasted text carrying the facts the image may draw on: a knowledge map, a source-notes file, a post draft, or a plain description. Nothing given → ask.
- `--out` — where renders land. Default `media/` under the current working folder, `media/src/` for the HTML sources.
- `--refs` — files or folders of reference material the user wants the look built from (see Phase 1). Repeatable.
- `--count` — size of the set. Default 20, and **20 is also the floor** for a generated set; a smaller number is only honest when the chosen fact genuinely cannot carry more distinct forms.
- `--ratio` — canvas shape. Default square, which survives on every feed.

## The input contract

A calling skill hands over five things, and the run states which of them it got:

| Input | What it is | Missing → |
| --- | --- | --- |
| **Facts** | The claims the image may draw on, each with the condition and provenance the source attached | Ask for them. A graphic built on facts nobody supplied is a fabrication with a picture around it |
| **The boundary** | What the sources do NOT say — the adjacent claims a picture would drift into | Ask. This is the section that stops a composition inventing a relationship |
| **Output folder** | Where the renders and their `.html` sources go | Default to `media/` and say so |
| **Look inputs** | Brand palette, reference images, examples, a previously approved render (Phase 1) | Run with one accent and neutrals, and say that is what happened |
| **Target ratios** | Which platforms the image is for, so the canvas is sized once rather than four times | Square at 1080×1080, stated |

Two constraints ride along from the callers and hold here even when nobody restates them: **no calendar date anywhere on a canvas or in alt text** (a "checked on" stamp is the loudest machine tell an image can carry), and **no long dash** in the headline or the alt text.

## Phase 1 — The look comes from the user's own inputs

**A graphic that ignores what the user handed it is a graphic they will reject, whatever its geometry.** So this phase runs before the facts are ranked and before a headline is written, and it collects the visual system the whole set is built in. Ask once, offering what the caller already knows about:

1. **A brand palette or brand assets** — hex values, a site to read them off, a style guide from an earlier run. This is the strongest input and it wins over every default below.
2. **Reference images or example graphics** — pictures the user likes and wants this to sit next to: their own previous posts, a competitor's feed, a screenshot from anywhere. Read them and name what is being taken: the density, the contrast, the amount of type, where the subject sits, how much of the canvas is empty.
3. **A render they already approved** — the single most useful input a repeat user has, because it is a decision they already made. A previous accepted graphic sets the system for the new set unless they say otherwise.
4. **A description in words** — "dark, very few elements, one strong colour" is a complete answer and often the fastest one.
5. **Nothing** — one accent hue, one de-emphasis gray, one surface, stated as the default that was used.

**What is taken from a reference is its technique, never its identity.** Density, contrast, composition, edge quality, the relationship between type and shape: all fair. Another company's brand, its logo, its exact palette, a watermarked asset, or a look pinned tightly enough to one living designer that the result reads as theirs: none of it, and say so plainly rather than producing a near-copy and hoping. A reference the user owns is theirs to reuse as closely as they like.

**Then the palette is proved, not eyeballed.** Whatever came out of the answers above goes through `dataviz`'s colour formula and its runnable validator (`scripts/validate_palette.js`): the accent and the de-emphasis gray clear 3:1 against the surface, and they stay separable under protan and tritan simulation. A brand colour that fails is reported with what it fails, and the user decides between their colour and the check — never silently swapped for one that passes.

Record the answers. The set, the gallery and every later regeneration are built in this system, and a run that changes the system mid-set produces twenty variants nobody can compare.

## Phase 2 — Name the primary fact

A source has one fact it is actually about, and a tail of secondary ones that are consequences, colour or anecdote. **The primary fact is the one that had to be true for the rest of the text to exist**: the capability, the measurement, the mechanism that changed. Everything downstream of it — what it enabled, what it costs, who got banned, which product shipped on top — is secondary however quotable it is, and a set anchored there illustrates the story's furniture instead of its subject.

The test is subtraction. Remove the candidate fact and ask whether the source still has a point. Remove "a five second clip generates in about three seconds" and the endless stream, the price of running it and the platform bans all stop making sense; remove the price and the text is unharmed. The one that takes the rest down with it is the primary fact.

**Where the primary fact's number lives outside the given text, go and get it.** A pasted note often gestures at the capability ("it generates faster than real time") while the vendor's own announcement states it exactly. Verify the figure at its public source, record it with that provenance, and use it: the set is built on the strongest form of the primary fact, not on the vaguest one that happens to be in the draft. What stays forbidden is inventing the number or inferring it — an unverifiable figure is not a primary fact, it is a fabrication.

## Phase 3 — The headline gate, before anything is drawn

**A gallery that varies the message and the picture at the same time asks the user to compare twenty things along two axes at once**, and the answer they give is unreadable: nobody can say whether variant 7 won on its wording or its shape. Separating them also stops the run wasting twenty renders on a sentence the user was never going to publish.

### What a headline is

**Exactly one line of type on the canvas, and it carries the point on its own.** The graphic is seen in a feed by someone who has not read a word of the post yet, and a picture that only makes sense once they do has already lost them. A reader who sees nothing but that line and the shape under it comes away knowing what the post says. `Faster to make than to watch` is a headline. `Generation speed` is a topic, and a topic is not a headline.

Write it as a whole thought — a clause or a short sentence, up to about a dozen words, wrapped over two lines if it needs them. It may name the thing, state the mechanism, or carry the number when the number *is* the point. What it may never be is a fragment the diagram has to complete.

**And that headline is the only type on the canvas.** No axis labels, no ticks, no legend, no series names, no unit riding a mark, no caption under the diagram, no footer, no date, no logo. This is what rules out the **captioned-diagram construction** — the labelled chart, the annotated timeline, the bar pair with its two names underneath, the grid with a value riding the one accent cell. Those spread the meaning across a dozen scattered words and read as a slide; a slide in a feed is scrolled past. One line does the talking, the composition does the rest.

Two consequences worth stating. A quantity may **shape** the composition without being written down — a mass sized to a real ratio, a break where the real break falls, a count of marks that is the real count — and it is spelled out only when the headline itself is carrying it. And the alt text still carries the whole meaning in words, including any quantity the canvas only implies, because that is where a screen-reader user gets it.

**No trademark word carrying its ordinary meaning**, in the headline or the alt text — `slack` for spare capacity, `stripe`, `square`, `notion`, `discord`, `prime`, `oracle`, `meta`, `swift`, `zoom`. A headline stands alone with no paragraph around it to disambiguate, so the company wins the read outright; use the plain synonym (head start, margin, band) unless the graphic is genuinely about that company.

### The gate itself

The run writes **20 headline ideas** and presents them as text, numbered, with no images yet. They are spread across the facts: **at least half state the primary fact**, in genuinely different wordings and angles rather than twenty paraphrases of one sentence, and the rest carry the secondary facts, whose job is to show the user what else the source could carry rather than to compete for the slot. Practical shape: at least 10 of the 20 on the primary fact, at least 3 further facts across the rest, no secondary fact taking more than a fifth of them.

**The list always ends with a free-text option: the user writes their own headline.** That is not a fallback for a failed list, it is the point of showing the list — twenty concrete examples are what makes a person able to say "closer to number 9, but with the price in it". Whatever they type is used verbatim, checked only against the rules above (no claim the sources do not carry, no calendar date, no long dash, no trademark word carrying its ordinary meaning) and reported if it breaks one, never silently rewritten.

**The whole list is shown, and the question is single-choice.** Splitting twenty options across five questions works for a checkbox list and breaks here, because five single-select questions collect five answers where one is wanted. So print all 20 numbered in the message itself, then ask one question carrying a few of them verbatim plus two open doors: `another number from the list` and `my own wording`. The user has seen every option, and answers once.

## Phase 4 — Render the set

**The chosen headline is the headline for all 20 renders**, and the visual set becomes twenty treatments of one message: different forms from the shape table in `references/visual-language.md`, different compositions, different anchors and densities. The fact spread did its work at the text stage, so this stage varies only what the eye is being asked to compare.

**Every render draws the fact its headline states.** This is the trap the two-gate order sets, so it is worth naming: a set drafted before the gate has a composition per fact, and once one headline lands on all of them, every variant built on a different fact starts contradicting its own caption — a picture of a year's cost under a line about seconds. Those are rebuilt as further readings of the chosen fact, never shipped as-is. Where the chosen fact genuinely cannot carry 20 distinct forms, say so and ship fewer rather than padding the gallery with variants that argue with their own text.

**The geometry on the canvas is the facts', at their real values.** A mass pair is sized to the actual ratio, an arc swept to the actual fraction, a rhythm spaced at the actual intervals, a field holding the actual count. Nothing is written down, so nothing can be checked by a reader — which makes the discipline stricter rather than looser: a shape drawn to look good while implying a quantity the sources do not carry is a fabricated chart with its evidence removed.

Form choice, composition craft, the variety techniques and the render command are all in `references/visual-language.md`.

## Phase 5 — Look at every render before the user does

The colour validator checks colour, not layout, so a set of 20 will contain marks running off the canvas, forms that collide into mush and compositions that turned out to be a grey rectangle — all of which are invisible in the markup and obvious in the image. **Build a contact sheet and read it**, then fix what it shows. Shipping a gallery of broken renders wastes the user's only look at the set.

**Three tests, per variant.** Read only the headline with the picture covered: it has to state the point by itself. Then cover the headline: the shape still has to say which side is bigger, which way the thing moves, where the break is. And look at it beside the other 19 — if it could swap places with any of them without changing what it means, the picture is decoration and the idea was not visual.

Then hand the user a page they can look at, not a list of filenames. One gallery from the rendered set, every variant at a size where the shapes read, each labelled with its number and its form. In order of preference:

1. A published page, when the runtime can publish one, so the link opens anywhere and survives the session.
2. A local `.html` gallery in the output folder, path given, plus a rendered contact-sheet image so the set is visible even if the page is never opened.

Either way the contact sheet is produced, because a link the user does not open is not a decision they can make.

## Phase 6 — The pick gate

**This one stops the run.** Present it through the structured-question UI, numbered to match the gallery: pick one · pick one and ask for a variation of it · none of these, here is what I actually want · skip the image entirely. Nothing is attached, and no post file declares an attachment, until that answer exists. An agent that picks its own favourite and carries on has skipped the only step this skill exists for.

`none of these` is a real branch, not a polite decline: take what the answer says, fold it into the Phase 1 system, and render a second set. A set the user rejected wholesale usually failed on visual language rather than on geometry — the first thing to change is density, depth and composition, not the shape table row.

## Phase 7 — Hand back

The chosen render is the run's image. After the pick:

- **Verify the file**: it exists, its pixel dimensions match the target, it opens, and its size is sane for the platform limits the caller supplied. A graphic that fails any of these is fixed or dropped, never handed back unverified.
- **Write the alt text**, describing what the image *shows* and what it means, and carrying the quantity the canvas only implies: the two masses and the ratio between them, the rhythm and where it breaks, the one form that does not conform, with the number and its condition stated in words since the picture cannot. Not "an infographic about the product", and never a date or a stamp.
- **Keep the other 19** with their `.html` sources. They cost nothing to store, they document what was considered, and the user re-picks later without regenerating.
- **Write a receipt** beside the renders — `graphics.md` in the output folder: the look inputs the set was built from, the primary fact and how it was chosen, the headline the user picked out of how many ideas (and whether they typed their own), the variant they picked out of how many renders, the palette with its validator result, the renderer used, and the alt text. The calling skill copies those two answers into its own manifest; a decision recorded only in the transcript is lost the moment the session ends.

**One graphic serves every platform that takes one.** The image is made for the post, not for a single network: render it once, and the caller attaches it wherever its Media column says `optional` or `required`, with the article platforms using it as the cover image. Render a second aspect ratio only when a platform's verified ratio genuinely cuts the first one apart — a square that survives everywhere beats four ratio-perfect files nobody reuses. That is about ratios and does not shrink the set: the set is 20 candidates for one slot, and only the chosen one is ever re-rendered per ratio.

## When the user supplied their own image

Skip all of it. A supplied image, or a library the user pointed at, is a decision already made, and offering variants against it is second-guessing the user. This skill runs when the run is **generating** rather than placing.

## Verification

The report states: which look inputs were supplied and what was taken from them (or that none were, and one accent plus neutrals was used); the palette with its validator result rather than a claim that it looks fine; the primary fact and the subtraction that identified it; how many headline ideas were offered and which one the user chose, marked when they wrote their own; how many renders were produced, how many were rebuilt after the contact-sheet read and what was wrong with them; which variant the user chose; the renderer that was used; and the paths of the chosen render, its `.html` source, the gallery and the receipt. Anything that could not be done — no renderer available, a brand colour that fails the contrast check, a fact set too thin for 20 distinct forms — is named, never implied.

**No renderer available at all** → say so and hand back nothing rather than promising an image. The caller ships the posts text-only and records why.

## Anti-patterns

- Rendering one graphic and attaching it. The set and the two gates are the whole point of this skill.
- Rendering before the headline gate: twenty pictures of twenty different messages, and an answer that cannot be read.
- A variant whose picture argues with the headline stamped on it, left in the gallery because it was drafted before the gate.
- The captioned diagram: axis labels, a legend, a value on every mark, a caption under the picture. One line of type, and the composition does the rest.
- A headline that is a topic (`Generation speed`) or a fragment the diagram has to finish.
- Twenty paraphrases of one sentence at the headline stage, or twenty bar charts of one ratio at the render stage.
- A composition drawn to look good while implying a quantity the sources do not carry.
- A calendar date, a "checked on" stamp, a logo or a footer on the canvas.
- Copying a reference's brand, logo or exact palette instead of its technique.
- Swapping a brand colour that failed the contrast check for one that passes, without telling the user.
- Shipping the gallery without reading the contact sheet, so the user's one look at the set is spent on broken renders.
- Offering a still where the platform requires video.
- Taking over the user's working browser to screenshot local `file://` pages when a headless renderer is available.
