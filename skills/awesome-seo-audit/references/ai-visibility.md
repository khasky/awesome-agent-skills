# Track G — AI and agent visibility

## Contents

- The eligibility floor
- Preview directives, the quiet killers
- The crawler roster, read per bot
- Google-Extended and the user-triggered fetchers
- AI usage preferences in robots.txt
- llms.txt
- Feeds
- Render-blindness and machine-readable content
- Semantic structure and the agent-usable surface
- Citability
- Author identity
- Measurement
- What not to recommend

## The eligibility floor

A page can appear in an AI answer surface only if it is indexed and eligible to be shown in Search with a snippet. There is no separate AI index, no extra technical requirement, and no additional markup or file that grants entry.

So Track A settles this track. When a page is `noindex`, robots-blocked or snippet-suppressed, report that blocker and mark the rest of Track G `NOT ASSESSED`. Everything below assumes the floor was cleared.

## Preview directives, the quiet killers

These govern appearance in AI Overviews and AI Mode, and every other check on the page still reads healthy while one of them is doing the damage:

- `noindex` — out of Search, and therefore out of every answer surface.
- `nosnippet` — no text may be shown, so nothing can be quoted.
- `max-snippet:[n]` — a tight limit cuts the answer down to nothing usable.
- `data-nosnippet` — applied *inside* the markup, around a block. The worst version of this finding is a `data-nosnippet` wrapped around exactly the part of the page that answers the question, leaving the boilerplate quotable.
- `noarchive`, `noimageindex` — narrower, worth reporting where they contradict what the site says it wants.

Look in three places for each: the meta robots tag, the `X-Robots-Tag` response header, and the markup body for `data-nosnippet`. A directive found in the header and not the markup is the common case.

## The crawler roster, read per bot

Read `robots.txt` per bot, never per company. Every major operator now runs several with different purposes, and **blocking one blocks none of the others** — which is the single most common misconfiguration in this area.

| Operator | Bot | Purpose |
|---|---|---|
| OpenAI | `GPTBot` | model training |
| | `OAI-SearchBot` | search index behind ChatGPT search |
| | `ChatGPT-User` | fetch triggered by a user's request |
| | `OAI-AdsBot` | advertising landing-page checks |
| Anthropic | `ClaudeBot` | model training |
| | `Claude-SearchBot` | search index quality |
| | `Claude-User` | fetch triggered by a user's request |
| Google | `Googlebot` | Search index, which is the gate for AI Overviews and AI Mode |
| | `Google-Extended` | a preference token, not a crawler — see below |
| | `Google-CloudVertexBot` | crawling for Vertex customers |
| Perplexity | `PerplexityBot` | retrieval for cited answers |
| | `Perplexity-User` | fetch triggered by a user's request |
| Others commonly seen | `CCBot`, `Bytespider`, `Applebot-Extended`, `meta-externalagent` | training and retrieval, per operator |

Report what is allowed and what is blocked, per bot, with the rule that does it. A deliberate block of training-only crawlers while answer and search bots stay open is a business choice and not a defect; the finding is when the pattern is clearly unintended — `GPTBot` blocked and `OAI-SearchBot` blocked alongside it by a wildcard nobody read.

Confirm the roster against current vendor documentation before a finding rests on a bot name. It changed twice in the last year.

## Google-Extended and the user-triggered fetchers

Two corrections that a report gets wrong more often than it gets right.

**`Google-Extended` is a preference token, not a crawler.** Blocking it opts content out of Gemini training and Vertex grounding. It does not touch Googlebot, Search indexing, ranking, or eligibility for AI Overviews and AI Mode, which run on the Search index. So it is never the explanation for a Search problem, and a report that offers it as one is wrong.

**User-triggered fetchers do not share one behavior, and a blanket rule about them is wrong.** These are the bots that fetch one page because a person asked about it. Whether they honor `robots.txt` is a per-vendor fact that has to be checked rather than assumed: Anthropic documents that all three of its bots, `Claude-User` included, follow `robots.txt`, while the equivalent fetchers from some other operators generally do not. So "we blocked the training crawler" is not "that assistant cannot read us", and the reverse is not safe either.

And `robots.txt` is a request, not an enforcement mechanism. Undeclared crawling that rotates user agents and addresses has been documented publicly. Where a site genuinely needs content kept out of these systems, the finding is that robots directives cannot deliver it and server-side access control is the only thing that can.

## AI usage preferences in robots.txt

A standards effort is underway to express AI usage preferences in a machine-readable way: an IETF working group has a vocabulary draft on the standards track and an attachment draft defining a `Content-Usage` HTTP header and a corresponding `robots.txt` rule. A widely deployed vendor implementation expresses the same idea as content signals in `robots.txt`, with categories separating search indexing from training from inference-time retrieval.

None of it is a finished standard. Treat it accordingly:

- Where these directives are present, report them and check them for **internal consistency**. A content signal declining AI training while `robots.txt` allows every training crawler is a contradiction, and the contradiction is the finding.
- Where they are absent, that is not a finding. Their absence costs nothing today.
- Never score them, never rank on them, and never present them as a visibility lever.

## llms.txt

Search does not use it. That was clarified explicitly in the Search documentation in June 2026, and the measured adoption picture matches: roughly one site in ten has one, the overwhelming majority of those files receive no crawler traffic at all, and direct requests for them are a negligible fraction of AI bot activity.

What does read it: some answer engines, and coding and documentation agents. That is the audience, and it is the only reason the file has any standing here.

So the posture is: machine-readability hygiene for the consumers that do read it, never a ranking or citation lever, never worth trading indexable content for. Where it exists, check placement (`/llms.txt` at the site root, not a subdirectory and not a redirect), that it is served as plain text, that it is not so large it defeats its purpose, and that its links resolve to the *canonical* documents — the same URLs the sitemap and the canonical tags point at, not stale mirrors. Where it is absent, that is a finding only if the user wants that audience.

## Feeds

Feeds are subtracted from the page set in step 2 and checked here instead, because a feed is a machine-readable distribution channel rather than a page. It is also the oldest one, and on a publishing site it is still an ingestion path for aggregators, readers and retrieval systems.

- The feed exists, returns 200, and is declared in the head with `<link rel="alternate">` so a consumer can find it without guessing the path.
- It parses, and its item count and dates match what the site has actually published.
- **Links inside items are absolute and canonical.** Relative links break the moment the feed is consumed anywhere else, and a feed pointing at non-canonical URLs spreads the wrong URL to every consumer that republishes it.
- Items carry internal links in the body where the site's own content does. Full-text feeds get scraped and republished; the internal links inside the body are what survives that, which is the one durable benefit of publishing full text rather than excerpts.
- Where the site publishes full text deliberately, that is a business decision and not a finding. Where it publishes full text by plugin default and did not know, say so once.

Absence of a feed is a finding only on a site that publishes serially. On a product site with no chronological content it is nothing.

## Render-blindness and machine-readable content

The raw-against-rendered comparison in [rendering-and-delivery.md](rendering-and-delivery.md) is the most common AI-visibility failure there is, and it belongs to this track as much as to that one. Content that needs client-side JavaScript to appear is invisible to anything that does not render, and much of what retrieves for answer surfaces does not.

Alongside it: is the information people actually ask about available as static, structured content? Pricing, specifications, compatibility, availability, documentation. A page that renders its price table only after an interaction has a price nothing can read. A "contact sales" wall is a business decision and not automatically a finding; a price that exists in the DOM only after three clicks is.

## Semantic structure and the agent-usable surface

An agent reads a page through three channels: a screenshot with a vision model, the raw DOM, and the accessibility tree — the tree being the cleanest of the three.

- **Semantic HTML as the floor.** Real landmarks, `<main>`, `<article>`, `<nav>`, heading levels that describe structure, tabular data in `<table>` rather than styled divisions, lists as lists. A page built entirely from generic containers hands every consumer the same undifferentiated blob. This is also the check behind "low semantic HTML usage" in the popular crawlers, and here it is a real one.
- **Real controls.** `<button>`, `<a href>`, `<label for>`, named landmarks. A `<div onclick>` router link is not crawlable and not operable.
- What belongs *here* rather than in an accessibility audit is what breaks an agent while passing a WCAG review: an interactive node covered by a transparent overlay (a consent layer that outlived consent, a full-card click target laid over its own links, a dismissed modal that kept `pointer-events`); the same action placed differently on each template, so a screenshot-driven agent relearns the page per route; `cursor: pointer` stripped from real controls or painted onto dead text; an auto-generated class hash as the only handle on a critical control.
- Where an agentic-browsing audit category is available in a local tool, its result is a fractional pass ratio. Quote it as X of N or not at all — never as a 0–100 score.

## Citability

Front-load an answer that survives being lifted out of the page:

- The direct response near the top of its section, not after four paragraphs of preamble.
- Claims sitting next to their evidence, with the source named.
- Dates and named entities in place, so a retrieved passage still means something out of context.
- Comparative data in a real table rather than in prose.
- Headings phrased as the questions the section answers, where that is the honest description of the section.
- Content that is current. Stale figures, superseded product names and dead references are what makes a page lose to a maintained one — and re-dating unchanged content to fake that is a policy problem, not a fix.

Two standing cautions. Being fetched is not being recommended: citation is not endorsement, and neither is a crawl. And passage-length prescriptions circulating as optimal citation sizes come from vendor correlation studies, not from any primary source; they are in [not-findings.md](not-findings.md).

## Author identity

The *who / how / why* test, which is the same bar as classic quality guidance and matters more here because an answer surface is deciding whether to attribute something to you:

- **Who** made this — a named byline with a real biography, `Person` markup with `sameAs` links to profiles that exist.
- **How** it was made — process disclosure where a reader would reasonably ask, AI assistance included.
- **Why** it exists — to answer the reader rather than to catch the query.

Weak answers to all three is one finding. The bar rises on health, finance, safety, legal, and civic or electoral topics, where the quality guidelines set the expectation explicitly.

## Measurement

This is the one track with first-party measurement attached, and it arrived recently enough that many inherited playbooks still say AI visibility cannot be measured.

- **Search Console, generative AI performance.** Reports how often the site's URLs appeared in generative AI features on Search — AI Overviews and AI Mode — broken down by page, country, device and date. It reports **impressions only**: no clicks, no click-through rate, no queries, no position. The data is a subset of the Web search type in the main Performance report, so it does not add to those totals. Rolled out to all properties during 2026.
- **Bing Webmaster Tools, AI performance.** Shows how content appears across Copilot and partner integrations, including which URLs are cited.

Where the user has access to either, a claim about AI visibility can be a number with a date beside it. Where they do not, it is `NOT ASSESSED` — and the honest version of the report says which of the two would settle it.

What neither measures: whether a given assistant will cite the site for a given prompt, share of voice against competitors, or sentiment in generated answers. Those come from third-party monitoring products whose methods are their own, and their figures are not evidence for a finding here.

## What not to recommend

The documented position is that appearing in AI features takes no AI-specific files, no content chunking, no LLM-targeted rewriting, no extra structured data added "for AI", and no manufactured mentions seeded across forums and video platforms. When a request or an inherited playbook asks for those, answer with what the primary source says: this surface takes the same work as classic SEO, applied through a new retrieval path.

The vendor statistics that circulate as rules for this track — an optimal citation passage length, a multiplier comparing brand mentions to backlinks, an overlap percentage between two engines' citations — are correlation studies from companies selling tools against them. They are not primary documentation, they are not reproducible from anything this audit can fetch, and they do not become findings. They are listed with the rest in [not-findings.md](not-findings.md).
