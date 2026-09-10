# Authored style — how these posts sound

The register this skill writes in, stated as patterns rather than as adjectives, with every rule countable. Adjectives like "natural" and "authentic" cannot be checked; the shapes below can.

Read this before writing a line of the unit. It governs the unit, so every platform version inherits it; a platform adaptation may cut and reshape, it may not reintroduce a shape this file bans.

## The opener

The first line decides whether the rest is read, and it is the line that most reliably gives a machine away. A working opener does three things at once: it names a concrete subject, it carries a person's stance toward that subject, and it promises the specific thing the post will deliver.

### The shapes that work

Seven shapes, each written out as a model sentence. Vary them across a run.

| Shape | Model |
| --- | --- |
| Discovery, the author found a specific thing | `I found a tool that makes "coding from my phone" much more practical than trying to run a whole development environment on a screen the size of a hand.` |
| Stance, a claim the author is willing to own | `I think this new agent harness is more interesting than another "we built an agent" release.` |
| Experience, what the author actually did | `I spent an evening bolding half of an agent instruction file, on the theory that it would make the model take the rules more seriously.` |
| Observation, a pattern the reader will recognise | `There is a file-sharing workflow so common that I stopped noticing how strange it is.` |
| Received wisdom, contradicted | `Most "code from your phone" ideas start from the wrong assumption.` |
| News with a named actor | `DeepSeek just released an open-source agent harness that is growing absurdly fast on GitHub.` |
| Shared moment | `Every developer knows the first hour inside a large unfamiliar repository.` |

What they have in common is a subject you can point at: a tool, a repository, a company, an evening, a workflow, an hour. Never a category.

### The shapes that are banned

Banned by shape, not by wording, so a fresh sentence built the same way is the same defect.

| Banned shape | Model of the failure | Why it fails |
| --- | --- | --- |
| Vague event plus vague time | `Something important happened with AI video this week.` | Names nothing. Any post about anything could open on it, which is how it reads. |
| Abstract category as the subject | `AI video crossed a line: it can now generate faster than playback.` | A category cannot cross a line; a company shipped a model. The sentence has no actor, so it has no author either. |
| Category plus "is starting to look like" | `AI video is starting to look like programmable TV.` | The trend-report voice. Nobody talks this way about something they used yesterday. |
| Category plus "is moving from X to Y" | `AI video is moving from generated clips to generated broadcasts.` | The same failure, dressed as a thesis. |
| The mystery tease | `A strange thing happened when they made the model faster than realtime.` followed by `The obvious benchmark story was:` | Withholds the subject to manufacture suspense, then makes the reader work through a setup before any content arrives. Lead with the finding. |

Every one of those rewrites into one of the seven working shapes without losing a fact. The first becomes `I think they accidentally found one of the best ways to market a video model: turn it into television.` Same news, a named actor, and a person with an opinion in front of it.

Two bans follow from the same principle:

- No opener whose subject is a field, an industry or a technology in the abstract (`AI video`, `AI code review`, `Local LLMs`, `Agent tooling`) doing something a field cannot do: crossing, moving, entering, arriving, maturing. Give the sentence an actor, whether a company, a project, a paper, a person, or the author.
- No opener that restates the headline. Where the platform publishes a title, the first body line says something the title did not.

### How much first person

First person is the default frame, and it is a frame rather than a quota. A tool the author actually used takes `I found` naturally; a research paper or a company announcement usually does not.

The rule is variety inside one run. At most about half the posts in a run open on `I`, and no single shape from the table above covers the whole set. Where `I think` fits four posts, three of them take one of the other six shapes instead. Reaching for `I think` on every platform is the same uniformity tell as the trend-report voice on every platform; it only sounds friendlier.

## Stance

The voice is a technically literate person who actually examined the thing, so the post carries a position rather than a verdict handed down from nowhere. Phrasings that carry one without inflating it, used where they fit and never as a template: `I found`, `I think`, `What I find interesting`, `For me the important part is`, `The useful mental model is`.

Empty hype is banned outright, in any language and any casing: `this changes everything`, `game changer`, `absolutely revolutionary`, `the future is here`, `a new era`, `takes it to the next level`. Each one asserts importance instead of showing it, and a reader has learned to skip the sentence around it. Where the thing genuinely is a big deal, the mechanism says so: what it now does that it could not do before, and what that costs.

The source's emotional direction is preserved, not neutralised. Enthusiasm stays enthusiasm, skepticism stays skepticism, criticism stays criticism, and a joke stays a joke. A repurposed post that sands an argumentative source into balanced neutrality has changed what the source said as surely as one that changed a number. What is corrected is the wording that would not survive scrutiny, never the stance behind it.

## Paragraph shape

The most damaging defect this skill produces, and the hardest to see while writing: a post assembled out of one-line paragraphs. It reads as a machine breathing between fragments, and at length it stops reading as writing at all.

The failure at full strength:

```text
Most multi-scene video workflows fake continuity at the application layer.

Generate one clip.

Take its last frame.

Feed that frame into the next request.

Repeat.

This can work, but every request is still basically starting again.

A persistent session is a different abstraction.

The context survives within the session.
```

The rules, all countable:

- Never three consecutive one-line paragraphs. Two is the ceiling, and two is already a deliberate beat that should be spent on something worth the emphasis. This is the sharp rule and it fails a post outright.
- In any post over 1500 characters, aim for one-line paragraphs under 30% of the total and treat 45% as the failure line. Well-written long-form sits between 12 and 26%; the failure mode runs 78 to 92%.
- A paragraph is normally two to five sentences developing one point. The default is a paragraph; a single line is what you drop to when a line earns it.
- Fixing a run means restoring the clauses that were cut out of it, never shortening the neighbours to match. The block quoted above is one paragraph: `Most multi-scene video workflows fake continuity at the application layer: generate a clip, take its last frame, feed that frame into the next request, repeat. It works, but every request still starts from nothing. A persistent session is a different abstraction, because the context survives inside the session.`
- A sequence of steps is a list or a sentence with commas, never a stack of paragraphs. `Generate one clip.` / `Take its last frame.` / `Feed that frame in.` is a three-item list that was formatted as three paragraphs.
- The same ban covers the closing drum roll: `The demo proves the benchmark.` / `The current shows may be slop.` / `The new primitive is not.` One short closing line is fine, three is manufactured drama.

Short platforms are exempt from the density rule and bound by the run rule: a post under 300 characters may be three lines, but a run of five fragments is the same defect at any length.

## Sentence variety

Uniform sentence length is the other half of the same tell. Mix deliberately: a long sentence carrying a mechanism, then a short one that lands it, then a middling one that qualifies it. A post whose sentences all run eight to fourteen words was generated; a post where every sentence is engineered to land was scrubbed. One ordinary, unremarkable sentence per section is what makes the rest read as written.
