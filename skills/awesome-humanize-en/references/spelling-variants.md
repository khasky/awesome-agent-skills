# Spelling variants — one variant per text, and which one

A document written half in one variant of English and half in another was written by more than one hand, or by one hand that stopped paying attention. Readers notice it the way they notice a changed font: not consciously, and not favourably. For machine-written text it is a tell in its own right, because sections generated at different moments drift apart with nothing to hold them together.

Two rules, in this order.

**One variant per text.** Whatever the text uses, it uses throughout — headings, body, captions, alt text, code comments, commit messages, UI strings. A mix is a finding wherever these skills look at text.

**American English is the default.** It applies unless the user said otherwise, and the ways they can say otherwise are all explicit: naming a variant in the request, supplying a style guide or voice profile that fixes one, or handing over a source text this work has to match. A body of existing text in one variant is an instruction: extending it in another is the mix this page exists to stop.

Nothing else decides it. Not the topic, not the audience the run guesses at, not the variant that happens to read better in one sentence, and not the model's own habit.

## Telling them apart

The reliable families, in the order they are worth checking:

| Family | American | British | Note |
| --- | --- | --- | --- |
| `-or` / `-our` | color, behavior, favor, honor, labor | colour, behaviour, favour, honour, labour | the strongest signal, and the easiest to grep |
| `-er` / `-re` | center, meter, theater, fiber | centre, metre, theatre, fibre | `metre` also carries a unit sense, so read the sentence |
| `-se` / `-ce` (nouns) | defense, license, offense, pretense | defence, licence, offence, pretence | `practice`/`practise` splits by part of speech in British and not in American |
| single / double `l` | traveled, canceled, modeling, labeled | travelled, cancelled, modelling, labelled | before a suffix beginning with a vowel |
| `-og` / `-ogue` | catalog, dialog, analog | catalogue, dialogue, analogue | `dialog` is also a UI element in both variants |

Individual words that follow no family and have to be known: gray/grey, aluminum/aluminium, math/maths, airplane/aeroplane, mustache/moustache, plow/plough, skeptic/sceptic, jewelry/jewellery, check/cheque (the payment), program/programme (outside computing, where both variants write `program`).

**The `-ize` ending proves nothing.** Oxford spelling, used by Oxford University Press, the OED and much of British academic and technical publishing, writes `organize`, `realize` and `recognize` with a `z`. So `-ize` on its own is not evidence of American English, and rewriting `-ise` to `-ize` does not make a British text American — it makes it a British text with a different house style. Decide the variant on the `-our`/`-or` and `-re`/`-er` families, which do not vary that way, and only then make the `-ise`/`-ize` choice follow it. The one genuine constant: `analyse`/`analyze` and `paralyse`/`paralyze` split by variant in every British house style, `-yse` being British in all of them.

## What is not a finding

- **A quotation keeps its own spelling.** A quoted sentence, a pasted error message, a cited title, a screenshot's text: those are the source's words and normalising them falsifies them.
- **Proper nouns keep theirs.** `Labour Party`, `World Health Organization`, `Pearl Harbor`, `Centre for Disease Control` where that is the body's actual name.
- **Identifiers keep theirs.** A function called `normaliseInput`, a CSS `color` property, an API field `licence_id`, a package name, a database column. Code is not prose, and renaming an identifier to fix its spelling breaks the thing it names.
- **A term with one fixed technical spelling.** `dialog` for the UI element, `program` for software, `disk` for the storage device in most technical registers.
- **A text the user fixed to a variant.** Then the variant is theirs and the only finding is a departure from it.

## Reporting a mix

Name the variant the text is mostly in, the count of departures, and the words. "Mixes British and American spelling" is not a finding; "23 American forms against 4 British: `colour` (2), `behaviour`, `centre`" is, because it says which way to normalise and what to touch.

Where the counts are close enough that neither variant leads, the text has no variant to preserve: apply the default and say that is what happened rather than picking the larger pile.
