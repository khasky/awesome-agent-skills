# Track F — Links

## Contents

- What this track can and cannot see
- The internal graph
- Anchor text
- Outbound hygiene
- Link-scheme exposure the site creates itself
- What makes a link worth having
- The inbound gap, declared
- Authority scores, refused on their own terms

## What this track can and cannot see

A fetch sees the whole internal graph and every link the site emits. It does not see a single link pointing *at* the site.

That split is less limiting than it sounds, because the link spam policy is mostly about what a site creates: buying or selling links, excessive exchanges and partner pages built for cross-linking, automated link generation, text links that do not block ranking credit, low-quality directory and bookmark links, optimized links in forum posts and signatures. All of that is visible from the outside, and all of it is the half a site can actually fix.

What is not visible is the inbound profile, and that half is declared rather than estimated. See the last two sections.

## The internal graph

- **Orphans** — indexable pages no internal link reaches. Report the count and the list. An orphan in the sitemap is a different finding from an orphan nowhere: the first is discoverable and unsupported, the second is neither.
- **Single-inbound pages** — reachable by exactly one internal link. This is the population that becomes orphaned the next time a template changes, so it is worth reporting before it does.
- **Click depth** — distance in links from the entry point. Report the distribution and the pages past three clicks. Depth is a proxy for how much internal support a page has, not a rule.
- **Broken internal links** — pointing at 4xx or 5xx. High when the target was an indexable page.
- **Internal links to redirects** — every one costs a hop and dilutes the signal. Medium in bulk, Low as a scattering.
- **Internal `nofollow`** — a `nofollow` on an internal link is almost always a leftover from a crawl-budget theory that no longer applies. Report it with the count; it is rarely doing what whoever added it intended.
- **Link volume per page** — a page emitting hundreds of links spreads its signal thin and usually indicates a navigation or tag-archive problem rather than an editorial one.
- **Navigation against contextual** — a page supported only by sitewide navigation is supported by nothing distinctive. Contextual links from related content are what actually says this page matters for this topic.
- **Sitewide footer blocks** — a block of links repeated on every page, especially to partners, clients or other properties. Flag the pattern and the destinations; it is the shape of both an internal dilution problem and an external link-scheme risk.
- **Resources linked as pages** — a stylesheet, script or image in an `<a href>` where a page was meant. Cheap to find, confusing to a crawler.

## Anchor text

For internal links, anchor text is a description of the destination and is fully within the site's control:

- Descriptive rather than generic. "Read more" and "click here" repeated across a site describe nothing.
- Links with no anchor text at all — an image link with no `alt`, an empty element — give the destination no description whatsoever.
- The same anchor pointing at different destinations, or many different anchors pointing at one destination with no pattern, both indicate a link structure nobody has looked at.
- Anchor text that is the target query repeated on every internal link to a page is over-optimization, and it sits next to the stuffing checks in [on-page-and-content.md](on-page-and-content.md).

## Outbound hygiene

- **Paid, affiliate and sponsored links carry `rel="sponsored"`** (or `nofollow`). Unqualified paid links are a link-scheme violation on both ends. This includes affiliate links in review content, which is the most common instance by a wide margin.
- **User-generated links carry `rel="ugc"`** where the site accepts comments, forum posts or profiles.
- **Disclosure** for sponsored or affiliate content sits near the content, not buried in a footer.
- **Guest and contributed posts** with commercial links qualify those links, or the arrangement is a link scheme regardless of how the content reads.
- **Broken outbound links**, and outbound links answering 403, reported separately: the first is a dead destination, the second is usually a bot block rather than a dead page and is Informational.
- **Links to parked, expired or repurposed domains** — a resource link that now points at a domain selling something else. Common on old content, invisible without checking.

## Link-scheme exposure the site creates itself

These are patterns readable on the site, each mapping to a named example in the link spam policy:

- A page that exists to exchange links: "partners", "friends of the site", "link exchange", a reciprocal directory.
- A "write for us" or "contribute" page that has produced a body of thin posts each carrying one commercial outbound link.
- Sitewide sponsor or client link blocks passing ranking credit.
- Links in the site's own forum signatures, profile fields or comment bodies pointing outward with optimized anchors.
- A pattern of outbound links to unrelated commercial sites in otherwise editorial content, especially with exact-match anchors.
- Self-created links the site is responsible for elsewhere — profile pages, free directories, link-in-bio pages created solely to point back. This one is not visible on the site itself, but it appears in inherited playbooks constantly, and when a request or a brief asks for it, that is the moment to name the policy rather than execute the task.

## What makes a link worth having

Applied to the links the site emits, and to any inbound sample the user supplies from their own tooling:

- **Topical relevance on three levels** — the linking page, the content surrounding the link, and the anchor. A relevant site linking from an irrelevant page is weaker than it looks.
- **Source credibility** — real organic visibility, named authors with bylines, visible editorial oversight, and a link profile of its own that is not obviously manufactured.
- **Editorial placement** — earned mentions carry weight that paid placements are required to block. A link the publisher chose to make is the category worth pursuing.
- **Correct attribute** — followed links pass credit, `nofollow` works in editorial contexts, `sponsored` covers paid and affiliate, `ugc` covers user-contributed.

Profile health, judged when the data exists: variety of linking domains rather than volume from few, topical spread, natural anchor distribution with a substantial share of branded anchors, and steady cumulative growth rather than spikes. Warning shapes are a heavy concentration of exact-match commercial anchors, hundreds or thousands of sitewide links from single domains, a spike followed by a collapse, and clusters of links sharing infrastructure.

## The inbound gap, declared

None of the following is obtainable by fetching the site, and each is reported as `NOT ASSESSED` with the source that would settle it:

| Question | What would answer it |
|---|---|
| Which domains link here, and how many | Search Console Links report (top set), or a commercial link index (full set) |
| Quality of the linking sources | A link index with traffic and profile data per domain |
| Inbound anchor text distribution | A link index; Search Console shows top linking text only |
| Link velocity and growth shape | A link index with history |
| Shared-infrastructure clustering | A link index exposing network data |
| Whether any link warrants disavowal | All of the above, plus a manual review |

On disavowal specifically: it is not a routine hygiene step, and a list assembled from a toxicity score is a way to remove links that were working. It belongs to a manual review after a manual action or a documented attack, and this audit never recommends it from fetch data alone.

One inbound-adjacent thing *is* visible: URLs that used to exist and now answer 404. Old paths still referenced by internal links, still listed in a stale sitemap, or still linked from the site's own archives are the most likely to be carrying inbound links too. Report them as redirect candidates — it is the only part of link reclamation this audit can reach.

## Authority scores, refused on their own terms

Domain Rating, Authority Score and Domain Authority are refused, and not because of the fetch limitation.

Each is a vendor composite on a logarithmic 0–100 scale. One estimates the strength of a link profile; another blends link data with estimated organic traffic and anti-spam signals, which is why the same domain scores differently in each. None of them is a metric any search engine uses, and none publishes weights that can be reconstructed. A site with no traffic and poor content can carry a high score on the strength of a few old links.

That places them squarely under the no-composite-score rule in the report rules: a number nobody can reconstruct, from someone else's weights, that reads high on a domain whose indexability was never checked. Where a stakeholder asks for one, name what it measures, name what it does not, and offer the underlying counts instead.
