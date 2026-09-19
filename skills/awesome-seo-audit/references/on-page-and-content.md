# Track B — On-page and content, and Track H — the scaled-content gate

## Contents

- The declared target query
- Title
- Meta description
- Headings
- Keywords, and the two things worth checking about them
- Content quality
- Images
- URLs
- Freshness and authorship
- Track H — the scaled-content gate
- Track H — borrowed reputation

## The declared target query

Establish one target query per page before judging anything else in this track. It is the input the rest of the track measures against, and without it three checks have nothing to check: title-and-H1 coherence, cannibalization, and whether the page answers what it was built to answer.

Sources, in order: the user states it; a content brief or CMS field carries it; the page itself makes it obvious (a comparison page targeting "X vs Y"). Where none of the three settles it, report the coherence checks as `NOT ASSESSED` and say the target was never declared. Do not invent one from the title, because then the check compares the title against itself.

**Coherence, not repetition.** The finding is a page whose title targets one thing, whose `h1` promises another, and whose URL slug says a third. Whether the term appears a certain number of times, at a certain density, or within the first N words is not in scope — see [not-findings.md](not-findings.md).

## Title

- Present on every indexable page. Absent is Critical.
- Unique across the set. Duplicates are High, and the count of pages sharing one title goes in the finding.
- Describes the page rather than the site: a template that renders the brand name on 400 pages has 400 pages with no title.
- Agrees with the `h1` and the page's actual subject.
- Not truncated by the engine into nonsense. Truncation is pixel-based, so the check is whether the meaningful part survives the cut, never a character count.
- The authored title is not the rendered one. Google rewrites titles, and a rewrite that persists is the engine saying the authored title did not describe the page. Where a live SERP is available, capture the rendered title with the locale and date; where it is not, say so.

## Meta description

- Present and unique. Absent is Medium: the engine writes its own from the page, which is often fine and sometimes disastrous.
- Describes what the page answers, in the language of the target market.
- Does not duplicate the title verbatim.
- Not a keyword list. A description stuffed with terms is a stuffing finding, not a description finding.

Length ranges are not checked here. Neither is the presence of the target term in the description, which is a bolding and CTR effect rather than a ranking one.

## Headings

- Exactly one `h1`. Zero is Medium; more than one is Low unless the extras are template artifacts on every page, which makes it Medium.
- The `h1` may exist but be hidden by CSS, or exist only after hydration. Check the rendered DOM and the raw HTML both, and say which one carried it.
- Heading order is logical and unbroken: no `h4` under an `h2` with nothing between, no heading level chosen for its font size.
- Headings describe the sections they open. A page whose headings read as a table of contents is also the page an answer surface can lift a section out of.
- List and post-index pages get the same check as articles. A blog index with no `h1` is a common and invisible miss.

## Keywords, and the two things worth checking about them

`<meta name="keywords">` is ignored by every major engine. It is worth one Informational line for two reasons that have nothing to do with ranking: it publishes the site's keyword map to competitors, and its presence is a reliable marker of an SEO plugin configured years ago and never revisited — which usually means other settings in the same plugin are equally stale.

**Keyword stuffing is a check, not only a prohibition.** Google's spam policy names it explicitly, including lists of cities and regions and blocks of phone numbers with no added value. What to look for:

- The same target term repeated across title, description, `h1` and the first paragraph beyond what the sentences need.
- City, region or model-number lists appended to a page that does not otherwise serve them.
- Repetitive phrasing that reads as written for a parser: the term in every heading, every alt attribute, every anchor.
- Hidden text: white on white, `font-size: 0`, `text-indent: -9999px`, opacity zero, positioned off-screen, or collapsed behind an element that never expands. This is a separate named policy and a confirmed instance is Critical.
- Stuffing inside the meta tags specifically, which the policy calls out on its own.

Report the location and the count. "The term appears 47 times in 600 words, 12 of them in headings" is a finding; "keyword density is high" is not.

## Content quality

- **Thin** — the page does not answer the query it targets. Measured in Track H for a cohort; judged by reading for a single page. No word-count floor applies, and a 500-word page that fully answers its query beats a padded one.
- **Duplicate, internal** — two URLs serving substantially the same body. Report the pair and the canonical strategy that should resolve it.
- **Duplicate, external** — the body is reproduced from another site, or syndicated without canonical or attribution. Note that the direction of copying cannot be determined from the markup alone; report the match and say so.
- **Boilerplate share** — how much of the page is nav, header, footer and sidebar versus main content. A page whose unique body is three sentences inside a heavy template is thin regardless of the total.
- **Machine-translation artifacts** — untranslated fragments, wrong grammatical gender or case throughout, a language mismatch between `html lang` and the body, currency or date formats from the source locale. Low-quality translation at scale is a quality problem in its own right and a scaled-content risk when it spans a cohort.
- **Unfinished content shipped** — lorem ipsum, `TODO`, placeholder names, an empty template section rendered live. Trivial to check, embarrassing to miss.

## Images

- Content images carry descriptive `alt`. This is what image search reads and what an answer surface uses to understand the page. Decorative images carry `alt=""` rather than a repeated caption.
- Filenames describe the subject. `hero-final-v3-2.jpg` tells nothing to anything.
- No broken internal images, and no broken external ones on an otherwise healthy page.
- Width and height attributes present, so the layout does not shift as images arrive.
- Where an image sitemap exists, it is valid and current — see [crawl-and-index.md](crawl-and-index.md).

Accessibility depth beyond `alt` presence — contrast, focus order, the accessible name of an image control — is outside this audit's scope and is covered by awesome-accessibility-audit.

## URLs

- Readable, describing the page rather than a database identifier.
- Words separated by hyphens. Underscores are Informational on an established URL: the signal is weak and changing a live URL costs more than it buys.
- Lowercase and consistent. A host serving both `/Page` and `/page` at 200 is a duplicate-content finding.
- No session identifiers, no tracking parameters in internal links, no more parameters than the page needs.
- Stable. An audit never recommends changing a URL that ranks unless the URL itself is the defect; where a change is unavoidable, the 301 map is part of the recommendation.
- Length is checked only at extremes, where a URL breaks link sharing or exceeds what a crawler stores.

## Freshness and authorship

- Published and updated dates visible near the content and consistent with the markup.
- Re-dating unchanged content is faked freshness and a policy problem of its own, not a maintenance tactic. Where the update date moves and the content hash does not, that is the finding.
- A named byline with a real biography, `Person` markup with `sameAs` links to profiles that exist.
- Contact information, an editorial or corrections policy, and disclosure where a reader would reasonably ask how the content was made, AI assistance included.
- The bar rises on health, finance, safety, legal, and civic or electoral topics, where the quality guidelines set a higher expectation of who is answering and why they are qualified to.

Weak answers to *who made this*, *how* and *why it exists* is one finding, not three.

## Track H — the scaled-content gate

For a set of generated or templated pages (locations, comparisons, "best X for Y"), audit per page-type cohort and issue both verdicts per cohort.

- **Uniqueness ratio, measured** — words that appear only on this page divided by total words of main content, compared against the rest of the cohort, with shared chrome excluded and the template body *included*. The boilerplate is the thing being measured. Below ~40% is a FIX; below ~30% is a BLOCK. A swapped city name in an otherwise identical body lands near zero.
- **Standalone value test** — would this page be worth publishing if no other page in the set existed? A page that fails it is a doorway whatever its ratio says.
- **Doorway pages** — pages that exist only to rank and funnel to the same destination, with no standalone intent served. BLOCK.
- **Cannibalization** — several pages targeting the same declared query compete with each other. Report the group and recommend consolidate, canonicalize, or differentiate the targets. This check requires the declared targets from the top of this file.
- **Cohort size as a risk signal** — count the pages in the cohort and report it. For location or near-duplicate page types, treat 30 as the point where the ratio needs to be measured rather than sampled, and 50 as the point where shipping more without a measured ratio is itself the finding. These are review triggers, not policy thresholds, and the report says so.
- **Index coverage of the cohort** — in the sitemap, not orphaned, not accidentally `noindex`, canonical strategy coherent across the set.
- **Rollout safety** — the scaled-content-abuse policy names generating many pages with a generative model, without adding value, as an explicit example. So "we used AI" is not the finding; "nothing on the page is worth a visit" is. Safer rollout: publish in batches, watch indexing and rankings before extending, human-review a sample per cohort. Shipping thousands at once at a low ratio is the risk signal.

Do not BLOCK on "looks thin" alone. Cite the ratio, the failed standalone-value test, or the doorway pattern. Formatting cannot compensate for missing depth, and a genuinely useful data page that happens to be templated is not a doorway. Where the cohort cannot be sampled widely enough to compute a ratio, return `NOT ASSESSED` for that cohort rather than guessing.

## Track H — borrowed reputation

**Site reputation abuse** is third-party content published on a host domain mainly to trade on that domain's ranking history. The unit of risk is the *section*, not the site, and first-party involvement in producing it does not make it first-party content.

Readable signals: bylines reading "Sponsored", "Partner Content" or "Brand Studio"; a subfolder whose outbound links are affiliate-coded and whose calls to action are transactional while the rest of the domain is editorial; a subfolder whose topic has drifted away from the main corpus; a coupon or casino section under a news domain.

Enforcement differs by region, and a report that states one global mechanism is wrong somewhere. Outside the European Economic Area this is handled by manual action. Inside it, the offending section is categorized as separate from the main domain and ranks on its own merits rather than the host's. The practical consequence is the same finding with a different remedy urgency, so name the region the site operates in.

**Expired domain abuse** is the sibling case: a domain bought for its backlink history and refilled with unrelated content. Readable signals are a wholesale topic change with no editorial continuity, archived content that does not match the current corpus, and inbound anchors about a subject the site no longer covers.

Report per section with the evidence, and say plainly that the commercial relationship behind a section cannot be read from the outside. The pattern is the finding; the contract is not.
