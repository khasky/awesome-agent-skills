# Discourse patterns #26–31 — the layer word choice cannot reach

Everything else in this skill edits words, sentences and markup. This file edits the shape of the text: what each paragraph is *for*, how the parts are arranged, and where the emphasis sits. It exists because that layer survives rewriting.

**Why it runs before the vocabulary work.** Measured on non-fiction, full paraphrasing did not hide machine origin from expert readers — AI-vocabulary mentions rose from 69.8% to 88% of judgements afterwards, and structural cues (quote placement, section shape) became *more* visible, not less (Russell et al., ACL 2025, arXiv:2501.15654; expert TPR 92.7% / FPR 4.0%). On fiction the same holds harder: a classifier using only narrative-structure features detects AI at 93.2% macro-F1, and editing surface style moves it by about one point (StoryScope, arXiv:2604.03136). A text whose skeleton is machine-shaped reads machine-made no matter how the sentences are polished, and polishing first wastes the edit.

**Two stages, in this order.** List every finding across the whole text first, then fix. Detection and rewriting in one read collapses onto whichever dimension is most salient: given the full taxonomy at once, current models scored κ≈0 against expert span annotations with span precision 0.13–0.16 (Shaib et al., arXiv:2509.19163). The same study is why each pattern below is checked on its own pass rather than in one sweep, and why a single hit is never a verdict — slop is cumulative.

**Edit budget.** Professional editors working on machine-written prose replaced 74% of the time, deleted 18%, inserted 8% (LAMP, CHI 2025, arXiv:2409.14509). The only fix that may lengthen the text is real specificity the author can supply. A cliché swapped for a blander paraphrase and a cut passage replaced by generic description are the documented machine repairs — both make the text worse.

---

## #26 🟡 Summary-shaped skeleton (the outline test)

**Test.** Extract the first sentence of every paragraph and read them as a list, ignoring the rest of the text.

**Tell.** They form a clean, ordered summary of the piece — each one announcing what its paragraph will cover. Human structure has gaps: sentences that make no sense out of context, a paragraph that starts mid-thought, an opener that is an example rather than a topic statement.

**Fix.** Do not rewrite the openers one by one — that produces the same skeleton in different words. Move one paragraph so its point arrives before its setup, start one paragraph with the concrete case instead of the claim, and let one paragraph open on something the previous one left unresolved.

## #27 🟡 Templated question sequence

**Test.** Write the implicit question each paragraph answers. Read the sequence.

**Tell.** The sequence walks an administrative order — *what is it → why it matters → how it works → what it means*. Two different models given the same brief produce the same question order independently; the words differ and the sequence does not (QUDsim, COLM 2025). The strongest sign is the absence of certain move types: no paragraph *compares* two things, none *contradicts* or qualifies an earlier paragraph's account, none *digresses* and earns it later. Measured, machine text uses consequence and procedure moves around 19% of the time and comparison or verification moves around 0.2–0.3%.

**Fix.** Replace one consequence paragraph with a comparison or a correction of something said earlier. One paragraph that qualifies the text's own claim does more than a page of rewording.

## #28 🟢 Position uniformity (cumulative — never a verdict alone)

**Test.** Measure, don't eyeball: paragraph lengths, where quotations and key lines sit, list cardinalities, where emphasis falls.

**Tells**, counted together:

| Position | Machine habit | Human habit |
|---|---|---|
| Paragraph length | Uniform across the piece | Ragged, including a one-sentence paragraph |
| Quotations and punch lines | Always closing a paragraph | Anywhere, including mid-paragraph |
| Lists of reasons, qualities, examples | Exactly three, repeatedly | Two, four, one — three sometimes |
| Section length | Every section about the same | Length follows what mattered |
| Emphasis (bold, italics, short paragraphs) | Evenly distributed | Clustered where it matters, absent elsewhere |
| Transitions | The same connective shape each time | Varied, including a hard cut |

**Fix.** Merge or split to break the uniformity where the content supports it; move one quotation into the middle of its paragraph; let the section that matters run long and the routine one run short. Do not manufacture a one-sentence paragraph in a text that has no use for one — that is #31's failure mode in advance.

## #29 🟡 Symmetric coverage without a stance

**Test.** Find the places where the text weighs alternatives or evaluates something. Ask what it concluded.

**Tell.** Every option gets a comparable paragraph, no option gets a verdict; a review without a judgement, a comparison without a recommendation, a retrospective admitting no mistake. Absent subjectivity where the genre requires it is a measured slop dimension, not a stylistic preference (Shaib et al.).

**Fix.** Commit to one reading and state the condition under which it fails ("if your writes are under 1k/s, ignore all of this"). Hedge once where the claim is genuinely fragile, not once per sentence. Where the source text has no stance to recover and the editor cannot supply one, flag it for the author rather than inventing an opinion.

## #30 🟡 Fractal summarization

**Test.** Count how many times the same point is stated at different altitudes.

**Tell.** The piece announces what it will say, says it, then recaps — and each section does the same internally, and sometimes each paragraph. Headings restated by their own first sentence belong here too.

**Fix.** Keep the statement at the level where it lives and delete the other two. This is the highest-yield deletion in most machine-written articles.

## #31 🟡 The reflection tail

**Test.** Read the last two paragraphs alone.

**Tell.** They answer "what does this mean" or "where does this go next": a generic future outlook, a restatement of the argument, a moral. In fiction the equivalent is the narrator explaining the theme; measured, narrator thematic commentary appears in 77% of machine stories against 52% of human ones (StoryScope).

**Fix.** End where the content ends. Usually one paragraph earlier than feels complete. An ending that concludes reads written-to-order; an ending that stops reads written.

---

## Over-correction is its own fingerprint

Report, do not "fix":

- Deliberately jagged paragraph lengths in a text with no reason for them.
- A rarity in every line: no ordinary sentence anywhere, every image fresh, every structure unusual.
- Contractions and discourse particles poured in evenly to hit a target rate.
- Inverting each tell to its opposite pole. Human values are *moderate*: on the measured scales, human writing sits near the middle, not at the far end away from the machine. Aim at the band.

**Leave slack.** One plain sentence, one underdeveloped thought, one paragraph that is merely adequate. Machine text is uniformly load-bearing; sanding every surface of a text produces the humanizer's own signature, which trained readers recognize as readily as the original. Informality alone fools nobody: current models write casual registers competently, and "informal but otherwise fully machine-patterned" was caught by expert majority vote 100% of the time.

## False positives — conventional shape is not slop

| Not evidence | Why |
|---|---|
| Changelog categories, RFC sections, IMRaD papers, runbooks, issue templates | Formulaic containers by convention; the venue expects them |
| A genuinely three-part thing listed in three parts | Cardinality follows the content |
| An abstract or executive summary followed by the same content | The genre requires the restatement; #30 is about *unrequested* repetition |
| Even sections in reference documentation | Symmetry is the point of a reference |
| A formal register in a formal venue | Register match beats forced casualness |
| The author's own verified habits, including a fixed sign-off or a stock closing move | Edit toward their voice, not toward a generic human |

## How this fits the intensity levels

- **light** — do not run this pass; structural edits are not "remove the markers".
- **standard** — detect and report all six; fix #30 and #31 (both are deletions) and anything else the text supports without restructuring.
- **deep** — fix all six, deepest first: #26 and #27 before #28, then the sentence-level work in the other reference files.
- **voice-match** — the sample's own structural habits outrank this file: if the author reliably ends on a reflection, #31 is not a finding for that author.
