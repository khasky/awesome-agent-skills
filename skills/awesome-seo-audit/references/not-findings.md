# What this audit does not flag, and why

## Contents

- How to use this file
- Length and volume
- Keyword mechanics
- Composite scores
- Structured data rituals
- AI-surface rituals
- Cosmetic URL rules
- Metrics and settings that no longer exist
- Backlink lore
- Real, but not this audit
- Reported as Informational rather than not at all

## How to use this file

Most SEO checklists arrive inherited. A crawler produced them, a previous agency wrote them, or an article compiled them, and a large share of what they contain is not a defect — it is a number a vendor API happened to return, or a correlation study repeated until it sounded like policy.

When a request, a brief or a tool output asks for something on this list, do not silently drop it and do not silently do it. Say which item it is and why it is not a finding, in one line, then continue with the audit. The reader usually inherited it too.

Each entry below names the check as the popular tools name it, so a report can answer a specific line in a specific export.

## Length and volume

| Check as vendors name it | Why it is not a finding |
|---|---|
| "Pages with too much text within the title tags" / "without enough text" | Truncation in results is pixel-based, not character-based, and neither a long nor a short title ranks differently for its length. The real check is whether the meaningful part survives the cut and whether the title describes the page. |
| Meta description outside 120–160 characters | Same reason. The engine rewrites descriptions freely, and length has never been the deciding input. A missing, duplicated or unhelpful description is the finding. |
| Social title over 60 / social description over 65 characters | Preview cards truncate visually and per platform. The finding is a missing or wrong preview tag, not a long one. |
| "Pages with a low word count" | There is no word-count minimum and none has ever been a ranking factor. A short page that fully answers its query outperforms a padded one. Thinness is measured against the query and the cohort — see the uniqueness ratio in `on-page-and-content.md`. |
| "Content should be 800 words" / "3,000 words or longer" / average-length studies | Correlation between length and links, reported as a target. Writing to a word count is how padding gets shipped. |
| "Pages with low text-HTML ratio" | A ratio between markup bytes and text bytes. It measures templating verbosity, not content quality, and a well-built component-heavy page scores badly on it. Document weight is measured directly in `rendering-and-delivery.md` for the fetch-limit reason, which is a real one. |
| Readability indices and spelling counts | No engine scores prose by a readability formula. Unclear writing is a writing problem, and this audit does not edit copy. |

## Keyword mechanics

| Check | Why it is not a finding |
|---|---|
| Keyword density, "aim for around 1%" | Not a ranking signal, and treating it as one produces the stuffing this audit *does* flag. |
| "Use the keyword in the first 100 words" / "first 150 words" | A correlation from ranking studies, restated as a rule. Position of a term in the body is not a documented factor. |
| "Front-load the keyword in the title tag" | Same origin. Title coherence with the page and the `h1` is the check; word order inside it is not. |
| "Titles with numbers get 20% higher CTR" | A publisher's own click study. It may even be true for that publisher's audience. It is not a defect on a page that does not do it. |
| "Keyword in URL" as a ranking factor | Acknowledged as a very small factor at most, and changing a live URL to add one costs more than it returns. URL readability is checked; keyword presence is not. |
| `<meta name="keywords">` as a ranking factor | Ignored by every major engine for many years. It is reported for a different reason — see the Informational section at the end. |
| Target-term counts in headings and alt attributes | Repeating the term everywhere is the stuffing pattern, not the optimization. |

## Composite scores

Refused as a class, not case by case: a single number assembled from someone else's weights, which cannot be reconstructed, and which reads high on a page whose indexability was never checked.

- **Site health scores** from crawler products, however they are scaled.
- **Domain Rating, Authority Score, Domain Authority** — vendor estimates of link strength, one of them blending in estimated traffic and anti-spam signals, which is why the same domain scores differently in each. None is a metric any engine uses. Full reasoning in `links.md`.
- **Lighthouse SEO score** — a small fixed checklist scaled to 100. Useful as its individual audits, misleading as its number.
- **GEO or AI-visibility scores** with published category weights — publishing the weights does not make them reconstructable, because the inputs underneath them are the vendor's own estimates.
- **Any 0–100 or letter grade this audit would produce itself.** If a stakeholder wants one number, name the checks it would average and let them own the weights.

The measurements underneath a score are fine and expected: a uniqueness ratio, a byte size, a fractional pass ratio quoted as X of N, an impression count from a first-party report.

## Structured data rituals

- **Adding `FAQPage` or `HowTo` markup for rich results.** Both features are retired. The markup is still valid schema and harmless, but it renders nothing, and a skill or checklist that recommends adding it is recommending work with no output.
- **Removing retired markup already in place.** It costs nothing and renders nothing. Report it Informational and leave it alone.
- **"Pages with microformats rank above pages without."** Rich results affect appearance and click-through, not ranking. Markup that misdescribes the page is a policy problem; markup that is merely absent is a missed feature.
- **Adding structured data "for AI".** No structured data is required for AI features, and none grants entry to them.

## AI-surface rituals

- **llms.txt as a ranking or citation lever.** Search does not use it, measured adoption is around one site in ten, and the overwhelming majority of those files see no crawler traffic. It has a real audience — some answer engines and coding agents — and that is the only basis on which it is checked here.
- **Content chunking, LLM-targeted rewrites, AI-specific files.** Documented as unnecessary. The same work that earns classic visibility earns this.
- **Manufactured mentions** seeded across forums, communities and video platforms to raise brand presence in generated answers. This is the link-scheme pattern wearing a new name.
- **"Optimal cited passages are 134–167 words."** A vendor correlation study with no primary source behind it, and it contradicts the documented position that chunking is unnecessary. Front-loading a self-contained answer is good writing; a word band is not a check.
- **"Brand mentions correlate three times more strongly than backlinks."** Vendor study, unreproducible from anything this audit can fetch.
- **"Only 11% of domains are cited by both engines."** Interesting, unactionable, and not a defect on any page.
- **Blocking `Google-Extended` presented as a Search problem.** It is a training and grounding preference. It does not touch Search.

## Cosmetic URL rules

- **Underscores instead of hyphens** — a weak word-separation signal on a live URL. Informational, never worth a migration.
- **Trailing-slash style** — a consistency check, not a quality one. The finding is a site serving both forms at 200, which is duplication and is flagged; the style itself is not.
- **URL length under an arbitrary character count** — checked only at extremes where sharing or storage breaks.
- **Changing URLs that already rank** — never recommended to improve a slug. Where a change is genuinely required, the redirect map is part of the recommendation.

## Metrics and settings that no longer exist

Naming these prevents a report from citing something that was removed:

- **First Input Delay.** Replaced by INP; gone from field tooling.
- **"Core Web Vitals 2.0"**, a visual-stability index, a lowered LCP threshold, or any additional official vital. None exists. The set is LCP, INP, CLS at the 75th percentile, and the thresholds have not moved.
- **A crawl-rate setting in Search Console.** Removed. Server responsiveness, sitemaps and robots rules are the levers.
- **`<priority>` and `<changefreq>` in sitemaps.** Ignored. Safe to delete, never a finding.
- **`crawl-delay` as a Google directive.** Unsupported there, though other operators honor it, so its presence is not an error.
- **A DuckDuckGo site submission.** There is none. It assembles its index from Bing and other sources, so an absence there is a Bing finding.

## Backlink lore

- **Disavowing links on a toxicity score.** A vendor score is not evidence of harm, and disavowing links that were working is a self-inflicted loss. Disavowal follows a manual action or a documented attack, after a manual review.
- **Posting links on free profile, directory and link-in-bio sites to build authority.** Self-created links are a named example in the link spam policy. When a brief asks for this, name the policy.
- **Buying links, exchanging links, paying for guest posts with followed links.** Same policy. Properly attributed paid links are fine and are checked for their attribute.
- **Referring-domain counts or growth targets** as an audit finding. This audit has no inbound data — see the declared gap in `links.md` — and a target assembled without it is invented.

## Real, but not this audit

Genuine problems that this audit names in passing and does not assess, so a report does not imply coverage it lacks:

- **WCAG conformance in depth** — contrast, focus order, ARIA semantics, keyboard traps, target size. `alt` presence and semantic structure are checked here for their search and agent-readability value. The conformance review belongs to awesome-accessibility-audit.
- **Measured performance work** — profiling, hot paths, field data collection. Delivery facts and proxies are reported here; the measurement belongs to awesome-performance-audit.
- **Conversion structure** — call-to-action placement, form friction, message match. Belongs to awesome-landing-audit.
- **Security headers** — content security policy, framing controls, permissions policy. HTTPS, certificates and mixed content are in scope here because they affect indexing and rendering; the rest belongs to awesome-security-audit.

## Reported as Informational rather than not at all

A short list of things that are not defects but are worth one line, because each tells the reader something true:

- `<meta name="keywords">` present — publishes the keyword map to competitors, and marks a plugin configuration nobody has revisited.
- Retired structured data still in place — harmless, and a signal that the markup has not been reviewed since the retirement.
- `<priority>` and `<changefreq>` in a sitemap — generated by a tool nobody has configured.
- Underscores in URLs, on an established site.
- HSTS absent — a security control, noted for completeness.
- Speculation rules or back/forward cache present — an observation about delivery, never a recommendation this audit makes.
