# Track E — International and local

## Contents

- Declaring the market
- hreflang
- Where hreflang usually breaks
- Regional result surfaces
- Local: the signals that make a location page real
- Non-Google engines by market

## Declaring the market

Search is country and language specific. The same query returns a different result set, against different competitors, in different markets, and an audit that never established which market it is auditing has been scoring against the wrong result page the whole time. Establish it in step 1 and state it in the report header.

Checked on every site, monolingual ones included:

- **`<html lang>`** present and correct. It is the page's own statement of its language, read by search engines, answer surfaces and assistive technology alike. Absent is Medium; wrong is High, because a page declaring the wrong language invites the wrong audience and the wrong hreflang cluster.
- **The declaration matches the body.** `lang="en"` over Russian text is a stronger signal of a broken template than any single tag.
- **Locale conventions inside the content** agree with the claimed market: currency, date order, address shape, phone numbers with the right country code, units of measure.
- **The URL model is consistent** across the set: country-code top-level domains, subfolders, or subdomains, chosen once and applied everywhere. A site with `/de/` for German and `de.example.com` for Austrian has two models and will canonicalize badly between them.

## hreflang

Checked when language or region variants exist, and skipped entirely when they do not.

- Every variant carries annotations for **every** variant in its cluster, including **itself**. A self-referencing annotation is required, not optional.
- **Return annotations are bidirectional.** If A points at B, B must point at A. Missing returns are the usual break and the usual reason the whole cluster is ignored.
- **Codes are valid**: language in ISO 639-1, optional region in ISO 3166-1 alpha-2, joined with a hyphen. `en-GB`, not `en-UK`. A region code alone is not a valid value.
- **`x-default`** present, pointing at the page for users whose language matches nothing in the set.
- **Absolute URLs**, each resolving to a 200 page that is indexable. An annotation pointing at a redirect, a 404 or a `noindex` page breaks the cluster.
- **One delivery method**, not three. Head links, HTTP headers, or sitemap entries — mixing them is how half a cluster goes missing.
- **Canonical agrees with hreflang.** Each variant is self-canonical. A variant canonicalizing to another variant tells the engine to drop it, and the hreflang set then points at a page that has asked not to exist.

## Where hreflang usually breaks

In rough order of frequency, as findings to look for rather than a theory to explain:

1. A new variant added without updating the return annotations on the existing ones. High.
2. Codes invented by convention rather than standard: `en-UK`, `zh-CN` used where `zh-Hans` was meant, a bare region code.
3. Annotations pointing at the pre-redirect URL after a migration, so every link in the cluster costs a hop.
4. `x-default` missing on a site that serves a global audience.
5. A language mismatch between the annotation and the page it points at — the cluster says German, the page is English.
6. Annotations present on desktop and absent on the mobile template, which is the version that gets indexed.

## Regional result surfaces

Search results differ by region as a matter of documented design, not only by ranking. In the European Economic Area the result page carries aggregator and supplier units: an aggregator unit for approved vertical search services, and a supplier unit for direct providers that appears only when an aggregator unit does. Entry to the aggregator unit is an approval process with a data-feed or API requirement; the supplier unit needs nothing beyond what is crawlable.

The audit consequence is narrow and worth stating anyway: for a site operating in the EEA in a vertical where these units appear, the crawlable-content checks in this audit are the entry requirement for one of them, and eligibility for the other is a business process this audit cannot see. Report it as context, not as a finding.

## Local: the signals that make a location page real

Runs only when the business has physical locations or serves a defined geographic area. It is the counterweight to the scaled-content gate: a location page carrying these signals is evidence against a doorway verdict, and a cohort carrying none is evidence for it.

- **`LocalBusiness`** (or the specific subtype) with `name`, `address` as a full `PostalAddress`, `geo` coordinates, `telephone`, `openingHours`, and `url` pointing at that location's own page.
- **One indexable page per real location**, with content that differs because the locations differ — not because a city name was substituted.
- **NAP consistency**: the same name, address and phone in the markup, in the visible page, in the footer, and in whatever business profile the company maintains. A phone number that differs between the footer and the schema is a real defect with a trivial fix.
- **Opening hours as text or markup**, never only as an image.
- **A crawlable store locator.** A map widget that loads locations by XHR and renders no links is a locator with no pages behind it.
- **Service-area businesses** declare the area served rather than a street address they do not want published.
- **Stale profile artifacts** — links to a discontinued profile-hosted site, a profile field the platform has retired — reported as hygiene.

The business profile itself, its categories, photos, posts and reviews, is not fetchable from the site and is therefore outside what this audit can confirm. Name it as the artifact that would settle the local questions this audit leaves open, and return `NOT ASSESSED` rather than guessing from the website alone.

## Non-Google engines by market

Which engines matter follows from the market established in step 1, and a finding about an engine the site's audience does not use is noise.

| Market | Engine worth checking | What to look for |
|---|---|---|
| Any English-speaking, plus AI answer surfaces | Bing | verification, sitemap submission, change notification; its index feeds Yahoo, DuckDuckGo and Copilot |
| Russia, Turkey, CIS | Yandex | verification, its own webmaster console, participation in change notification |
| Mainland China | Baidu | verification, a Chinese-language page, the content-language declaration, hosting and domain preferences, and registration constraints that a non-resident business generally cannot satisfy alone |
| South Korea | Naver | verification, change notification |
| Czechia | Seznam | verification, change notification |

DuckDuckGo accepts no submissions at all: it assembles its index from Bing and several hundred other sources. So "we are not in DuckDuckGo" is a Bing finding, and recommending a DuckDuckGo submission is recommending something that does not exist.
