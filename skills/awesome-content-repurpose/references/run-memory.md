# Run memory — what a run keeps for the next one

Four files persist in the runtime's scratch root, beside the per-run `repurpose/<slug>/` folders and never in the invocation directory. All four are the agent's own temporary files: when the runtime wipes them, the next run asks in full and starts learning again, and nothing about the output depends on them being there.

| File | Holds | Written | Read |
| --- | --- | --- | --- |
| `repurpose/defaults.md` | the interview answers of the last run | end of Phase 2 | start of Phase 2 |
| `repurpose/platform-cache.md` | the last live platform check, dated | Phase 3, when it runs | Phase 3 |
| `repurpose/rules.md` | rules learned from the user's corrections | whenever the user corrects a post | Phase 4 before writing, Phase 5 pass 4 |
| `repurpose/sources.md` | one line per run: which source, which idea, where the files went | end of Phase 6 | Phase 1, after the source is on disk |

None of them holds source material: no notes, no quotations, no text, no links taken from a source. What they hold is the user's decisions and the run's bookkeeping.

## `defaults.md`

The answers, one per line, in the order the interview asks them: platforms, every target detail, voice, language, shape (with the Threads long-text choice), emoji, hashtags, closing questions (rooms only, or also the feeds), what happens after the files exist (with the spread over days, when one was chosen), and the media answer (with carousel, when chosen). The one-screen summary in Phase 2 is read straight from it, and it also states how many rules `rules.md` carries.

## `rules.md` — corrections that stick

A user who corrects a post is usually correcting a habit, and a habit that is not written down comes back next run. So a correction becomes a rule when two things are true: the user said it in words, and it applies beyond this source. A correction to a fact of this source (a wrong number, a misnamed product) is fixed in the post and is not a rule; a correction to how posts are written is.

- One correction, one rule, stated as a pattern: what to do or not do, in which situation, and why when the user gave a reason. Never a model sentence to reuse, for the same reason `references/authored-style.md` carries none: a sentence written down becomes a sentence repeated across every post of the next run.
- Before adding, read the file. A rule that says the same thing as an existing one is merged into it. A rule that contradicts an existing one replaces it, and the replaced rule is deleted rather than kept beside it, because two rules that disagree are resolved by whichever the writer happens to read last.
- Each rule carries the date and the run slug it came from, so a stale rule can be traced and dropped.
- Past thirty rules, consolidate before adding: rules that are cases of one principle become that principle.
- The user can see and edit it: the one-screen defaults names the count and offers to show the rules, and a rule the user drops is deleted.

Phase 4 reads `rules.md` before the first line is written, next to `references/authored-style.md`, and a rule there outranks a default in that file when they conflict, because it is the user's decision about their own posts. Phase 5 pass 4 checks every post against every rule by name, and a finding cites the rule the way it cites any other.

## `sources.md` — the same source twice

One line per finished run: the date, the source (its URL, or `pasted` with the file name), a fingerprint of its text, the point the run took, the idea it used, the run folder, and whether the posts were published or left as files. The fingerprint is a short hash of the source's extracted text with case folded and whitespace collapsed, so the same text pasted twice matches even when the line breaks differ. The URL column catches the same page fetched again; neither catches the same article republished elsewhere with different surrounding text, and the check does not pretend to.

Phase 1 checks the new source against it after the text is on disk. A match is shown on the Phase 2 opening screen, before anything else is asked: when the source was run before, which idea that run used, and whether its posts went out. The options are to take a different idea from that run's backlog, to run the same idea again on purpose, or to stop. This is the check the publisher's ledger cannot make, because the ledger only knows what was published and a run that ended in files leaves no trace there.

## The backlog

A run uses one idea; the notes carry three candidates. The two that were not chosen are written into the run's `campaign.md` with the IDs of the note lines they rest on, and the `sources.md` line points at that run folder. A later run on the same source offers them first. They are handed to `awesome-content-campaign` as material for a series when the user asks for one; this skill never writes a second idea into the same run on its own.

## What the user's best posts say

When the publisher's `publish-state/performance.md` exists and records at least three posts for a selected platform, Phase 2 marks the platform with its median, and Phase 4 reads the three best posts there for countable traits only: length, the opener's shape from the catalog in `references/authored-style.md`, emoji count, whether a link was in the body. Those traits aim the version inside its depth band and break a tie between the three drafted openers. The wording of those posts is never reused, and a platform with fewer than three recorded posts is written to the defaults, because three is too few to separate a trait from chance and fewer is noise.
