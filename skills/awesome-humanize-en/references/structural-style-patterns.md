# Structural and style patterns (#16–21)

The machine's habit of over-formatting, over-listing, and visual noise. Extensions and cross-references are added at the end.

> When to load: when working with text that carries Markdown markup, headings, lists, or tables, or with any text intended for direct publication (social media, email, Word documents).

---

## 16. 🔴 Em-dash and bold overuse

**Problem.** The model mechanically reaches for the em-dash (—) to mark "strong" pauses and slathers key terms in **bold** to fake the look of professional copywriting.

**Example (AI style):**
> This decision — the key to success — changes **everything**.

**After:**
> This decision changes everything. With it, the project will succeed.

**Markers:**
- Three or more em-dashes in a single paragraph.
- Every few sentences carries an "X — Y — Z" em-dash insert.
- More than five bolded terms per paragraph.
- Bold falls not on the load-bearing concepts but on random words, purely for rhythm.

**False-positive boundary.** The em-dash is a normal authorial device in literary prose and journalism — Emily Dickinson built a whole style on it, and plenty of modern essayists lean on it. An em-dash produced by iOS/Mac autocorrect is likewise not a tell. See `false-positives.md`.

---

## 17. 🔴 Emoji bullet lists

**Problem.** The model loves lists where every item opens with an emoji and a bold lead-in.

**Example (AI style):**
> 🚀 **Speed:** The app runs very fast.
>
> 💡 **Idea:** We came up with a new approach.
>
> ✅ **Result:** Users are happy.

**After:**
> The app runs fast thanks to a new approach, and users have noticed.

**Markers:**
- An emoji used as the bullet marker (in place of `-` or `1.`).
- Every item follows the template `[emoji] **Heading:** text`.
- The emoji has no real connection to the content (a one-size-fits-all 🚀 for everything).

**False-positive boundary.** Marketing landing pages and pitch decks use emoji on purpose — it is part of the genre. In a neutral article or an email, this structure is a tell.

---

## 18. 🟡 Quotation marks

**Problem.** Curly, typographic quotation marks (" " and ' ') and typographic apostrophes are produced reliably by AI — but also, just as reliably, by macOS/iOS/Word autocorrect for ordinary humans. On its own, curly punctuation says almost nothing. Treat it as a **weak** tell only, and only in two narrow shapes: a *mix* of straight and curly quotes inside one document (the model set some, a human typed the rest), or *perfectly* typographic quotes in a casual, plain-text medium — a chat message, a code comment, a forum post — where a real person would just hammer the straight `"` key.

**What to do.** Nothing mechanical. Do not "fix" quotes, and do not convert anything to guillemets or any other national style. Note the inconsistency as one weak data point and move on. Uniform curly quotes in a formatted document are perfectly human.

**Markers:**
- Straight and curly quotes mixed within a single document.
- Flawless typographic quotes and apostrophes in a plain-text channel where straight quotes would be the norm.

**False-positive boundary.** Mac, iOS, and Microsoft Word turn straight quotes into curly ones automatically through system autocorrect — that is a setting, not a signal of AI. A writer who always uses curly quotes across every medium is simply someone whose tools do it for them. See `false-positives.md`.

---

## 19. 🔴 Excessive tables

**Problem.** The model packs into tables the kind of information that would read more clearly and simply as plain prose. It builds tiny 2–3 row tables where there is nothing to sort and no multi-parameter comparison to make.

**Example (AI style):**

| Attribute | Value |
|---|---|
| Color | Blue |
| Size | Large |

**After:** The color is blue and the size is large.

**Markers:**
- A 2×2 or 2×3 table for two facts.
- Every cell in a column shares the same structure (always "X is Y").
- The information reads more naturally as a sentence.

**False-positive boundary.** Product comparison grids, statistical data, schedules, and specifications are legitimate uses of a table. A table of five or more rows with a genuine comparison is usually not a tell.

---

## 20. 🔴 Markdown residue when the text is not for the web

**Problem.** Markdown syntax — `**`, `#`, `*`, `---`, `> ` — left in text that will never be parsed as Markdown. Pasted straight into a social post, an email, a Word document, or a Telegram channel, the asterisks show up literally instead of turning into formatting.

**Markers:**
- `**bold**` in plain text where it should simply be bold.
- `# Heading` somewhere no one parses Markdown.
- `[text](url)` in a Word document.
- `---` used as a thematic break in an email.
- `> quote` in a Telegram post.

**Addendum.** Beyond Markdown, the model sometimes leaves behind leftover wikitext (especially after a request that touched Wikipedia): `[[Category:...]]`, `{{template}}`, `{| table |}`. That is a reliable tell in any medium — see `chatbot-artifacts.md`.

**What to do.**
- If the text is for a social post or an email — convert the Markdown to plain text (strip the asterisks, spell out the links).
- If the text is for the web or will be parsed as Markdown — leave it, but verify the syntax is correct.

---

## 21. 🔴 Heading hierarchy violation

**Problem.** Jumps between heading levels — for example, skipping H2 and going straight from H1 to H3 (`###`).

**Example (AI style):**
```
# Main heading
### Subsection
```

**After:**
```
# Main heading
## Subsection
```

**Markers:**
- The document opens at H2 or H3, skipping H1.
- No H3 sits between an H2 and an H4 section.
- One document carries several H1s (there should be exactly one — the document title).

**Addendum.** English Wikipedia's "Signs of AI writing" flags a neighboring pattern — thematic breaks before headings: a horizontal rule `---` in front of every heading. If each H2 is preceded by a `---` with no meaningful pause, that is a tell.

---

## English-edition repurpose

### 21a. 🔴 Boilerplate section headings

> **Note on this slot.** In humanizer-ru, #21a covered "Title Case in Russian headings" — a calque of the English convention forced onto Russian, where it does not belong. In English, Title Case in headings is normal and is **not** a tell; it is documented in `false-positives.md` among the ineffective indicators. This slot has therefore been repurposed for the English edition to cover boilerplate section headings instead.

**Problem.** The model reaches for the same generic, templated section headings no matter the subject — "Introduction", "Conclusion", "Key Takeaways", "Final Thoughts", "In Summary", "Overview", "Understanding X", "The Importance of X" — and pours every article into one identical skeleton: Introduction → Key Features (bullets) → Benefits (bullets) → Conclusion. A piece on espresso machines and a piece on tax law come out with the same scaffolding.

**Example (AI style):**
> # Understanding Widgets
> ## Introduction
> ## Key Features
> ## Benefits
> ## Conclusion

**After:**
> # How the widget assembly line was rebuilt in 2023
> ## Why the old jig kept jamming
> ## The two-week retooling
> ## What the line looks like now

**Markers:**
- Generic boilerplate heading words ("Introduction", "Overview", "Key Takeaways", "Final Thoughts", "In Summary", "The Importance of…", "Understanding…") in place of headings that name real content.
- The identical Intro → Features → Benefits → Conclusion skeleton reused across articles on unrelated topics.

**False-positive boundary.** These headings are legitimate in structured documents — textbooks, RFCs, standards, formal reports, and academic papers routinely and correctly carry an "Introduction" and a "Conclusion". The tell is the templated *skeleton* applied where the genre does not call for it, not any single word. And note separately: Title Case in headings is itself an **ineffective** indicator and must not be flagged at all — see `false-positives.md`.

---

## Cross-references to other files

| If detected | See also |
|---|---|
| #16 heavy em-dash use | `false-positives.md` — the em-dash is normal in fiction and journalism |
| #17 emoji bullet lists in a formal email | `chatbot-artifacts.md` — often a Gemini fingerprint |
| #18 curly quotes from a Mac user | `false-positives.md` — autocorrect is not a marker |
| #19 excessive tables | `llm-fingerprints.md` — Gemini is especially prone to them |
| #20 Markdown in a Word document | `chatbot-artifacts.md` — usually arrives bundled with `:contentReference` |
| #21 H1 → H3 skip | `chatbot-artifacts.md` — a sign of broken markup |
| #21a boilerplate headings / Title Case | `false-positives.md` — Title Case is an ineffective indicator; the boilerplate headings themselves are legitimate in structured docs |

For adjacent pattern classes: content patterns #1–9 (+#6a) live in `content-patterns.md`; language patterns #10–15 (+#15a–15f) in `language-patterns.md`; communicative patterns #22–25 (+extensions) in `communication-patterns.md`.
