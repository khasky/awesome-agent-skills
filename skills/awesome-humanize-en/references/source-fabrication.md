# Source fabrication

Based on English Wikipedia's "Signs of AI writing" §7 "Citations" and the WikiProject AI Cleanup.

When an AI is asked to write connected prose backed by sources, it often **hallucinates citations**: it invents plausible-looking DOIs, ISBNs, and links to reputable outlets that turn out to be false the moment you check them. This is a sibling problem to #6 "vague attributions", but more dangerous: text carrying specific, formatted citations looks authoritative while being entirely made up.

This file is a **separate class of checks**, applied after the content-pattern analysis is done.

The failure has been productized: some marketing/SEO "GEO optimizer" skills in the wild explicitly instruct the model to *insert* plausible-but-unverified authority citations ("According to a 2024 Gartner report…") and merely flag them as "suggested". That is exactly the fabrication this file exists to reject — an inserted citation that was never checked is a defect no matter how it got there. Never add a source; verify or flag `UNVERIFIED:`.

> When to load: always when the text cites scholarly sources, books, journal articles, or news. Especially for academic writing, a Wikipedia article, a legal review, or a grant proposal.

---

## Kinds of fabrication

### 1. Non-existent link (404)

The AI generates a URL that opens onto nothing. Often the domain is real and the path is invented.

**Signs:**
- The link resolves but returns a "not found" page.
- The URL looks plausible (a structure like `/articles/2023/title-slug/12345`), but no such path exists in the site's index.

**Check.** Open the link. A 404 means it is either stale (which happens to genuine links) or fabricated. Cross-check against the Internet Archive (web.archive.org): if the Wayback Machine has no snapshot either, it is almost certainly invented.

---

### 2. DOI resolves to a different article

The DOI is well-formed and resolves, but it opens a completely different article — not the one the text claims to cite.

**Example from a Wikipedia "Ohm's law" article:**

> M. E. Van Valkenburg, "The validity and limitations of Ohm's law in non-linear circuits",
> Proceedings of the IEEE, vol. 62, no. 6, pp. 769–770, Jun. 1974.
> doi:10.1109/PROC.1974.9547

The DOI resolves. But it lands on an article about **methods for solving transient and dynamic stability problems**, which has nothing to do with Ohm's law.

**Check.** Resolve the DOI through `doi.org/10.xxxx/yyyy`. Compare the title, authors, and journal of the article that actually opens against what the text says. If they diverge, it is a fabrication.

---

### 3. Non-existent ISBN

The ISBN has a valid format (10 or 13 digits, correct check digit), but no book with that number exists in library catalogs, on publisher sites, or in WorldCat.

**Signs:**
- The book is "published" by a major house (Penguin, Oxford University Press, MIT Press), yet it is nowhere on the publisher's site.
- The author is real, but never wrote a book by that title.
- The publication year is incompatible with the author's life (a 1990 book by an author who died in 1985).

**Check.** Search WorldCat (worldcat.org), the catalog of a major library (Library of Congress / a major library catalog), and the publisher's own site. If the ISBN turns up nowhere, it is a fabrication.

---

### 4. Author could not have written it at the given date

The AI cites an article with a specific year, but by that date the author was already dead or had not yet begun their scholarly career.

**Example from a Wikipedia "Ohm's law" article:**

> C. L. Fortescue, "Ohm's Law in alternating current circuits",
> Proceedings of the IEEE, vol. 55, no. 11, pp. 1934–1936, Nov. 1967.

Charles LeGeyt Fortescue **died in 1936**, 31 years before the cited publication date. A fabrication.

**Check.** Compare the author's life dates against the publication date (via Wikipedia, ORCID, Google Scholar author profiles, or biographical databases). If the author died before the publication — or had not yet started publishing — it is a fabrication.

---

### 5. Book citation with no page or specific section

The AI cites a book as the source for a specific claim, but gives no page number.

**Example:**

> R. C. Dorf, J. A. Svoboda, "Introduction to Electric Circuits" (8th ed.).
> Hoboken, NJ: John Wiley & Sons, 2010. ISBN 9780470521571.

The book is real. But the claim in the text is a single sentence, while the book runs to 800 pages. To verify it, you would have to read the whole thing.

**Signs.** A book citation with no page number, no chapter, no section. Especially suspicious once the book runs past 200 pages.

**What to do.** Ask the author of the text to pin down the page. If the author is an AI and no page is forthcoming, the citation **does not support the claim**: either find the page yourself, or delete the claim, or restate it to reflect the actual level of support the source provides.

---

### 6. Declared-but-unused named reference

A reference is declared with a name in the citation list (for example, `name="report2019"`), but nothing in the body of the text ever cites it. A sign that the AI dropped in a source "for looks", with no tie to any claim.

**Source:** English Wikipedia §7.7.

**What to do.** Delete the unused reference from the citation list, or attach it to a specific claim if it genuinely supports one.

---

### 7. Stale access date

The citations carry an access date (in the form "accessed: …", `access-date`) noticeably older than the document itself: the text was created in December 2025, yet half the citations show an access date of December 2024. The AI fills in a default access date from its training data instead of checking the calendar.

**Source:** English Wikipedia, historical signals.

**Boundaries.** An old access date can be honest: the citation was copied from an early draft, the author worked from a long-collected file of notes, the material was ported over from an archive. The signal works in **bulk**: several citations with the same stale date in a freshly created document. Newer models rarely make this slip — the signal is useful mainly for 2023–2025 texts.

**What to do.** Open the sources, confirm they support the claims, and set a real access date.

---

## Verification algorithm

When working with text that cites sources:

1. **Collect the citations.** Pull every citation into a separate list: URLs, DOIs, ISBNs, and mentions of books and articles.

2. **Check the URLs.** Open each one. Flag the ones that resolve, the ones that 404, and the ones that "resolve but the content does not match".

3. **Check the DOIs.** Run each DOI through `doi.org`. Compare the article that opens against the description in the text.

4. **Check the ISBNs.** Run each ISBN through WorldCat and the Library of Congress / a major library catalog. If it is not found, flag it.

5. **Check the authors' life dates.** For each article, find the authors' life dates (Wikipedia, ORCID, Google Scholar). Compare against the year of publication.

6. **Check page numbers for books.** If a book citation has no page, flag it as not supporting the claim.

7. **Check that citations are used.** Every declared reference must be tied to a specific claim in the text.

After the pass, each flagged citation is either corrected to a real source, deleted along with the claim that depends on it, or rewritten without any pretense of being supported.

---

## Cross-references

| If you find a fabrication | See also |
|---|---|
| Any fabrication | `content-patterns.md` #6 — vague attributions, the sibling class |
| Fabrication + leftover chat turns | `chatbot-artifacts.md` — text copied nearly verbatim from a chat without checking |
| Fabrication in academic text | `false-positives.md` — do not confuse it with an honest author's error |
