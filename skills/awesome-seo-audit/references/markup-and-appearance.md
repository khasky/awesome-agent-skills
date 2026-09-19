# Track C — Markup and SERP appearance

## Contents

- How to check structured data
- Live feature types
- Retired feature types
- Validity and entity linking
- Markup that disagrees with the page
- Review markup
- Preview tags
- Favicon
- Publisher surfaces
- The listing as it actually renders

## How to check structured data

Read the JSON-LD from the raw HTML first and the rendered DOM second, and report which one carried it. Markup injected client-side is processed late, which makes it the wrong place for anything time-sensitive — a price, an availability flag, an event date.

Three questions per block, in order: is the type still a live search feature, is the block valid, and does it agree with what the page visibly says. A block can be perfectly valid, perfectly current, and still be a defect because it describes a product the page does not sell.

Microdata and RDFa are read too. A site with both microdata and JSON-LD describing the same entity differently is a conflict, not redundancy.

## Live feature types

Confirm against the current documentation before a finding rests on this list — the set moves, and the whole point of the section below is that it moved twice in the last eighteen months.

Currently documented as supported search features: Article, Breadcrumb, Carousel, Course list, Dataset, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product, Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription and paywalled content, Vacation rental, Video.

The shopping family carries its own set worth naming because it is where e-commerce sites most often stop short: product snippet, merchant listing, product variants, loyalty program, merchant return policy, merchant shipping policy. A product page with `Product` and no return or shipping policy markup is leaving a documented feature unused; that is a Low finding, not a defect.

`Dataset` feeds Dataset Search rather than a Search rich result. It is not retired, so do not advise stripping it because no rich result appears.

## Retired feature types

Retirement means the rich result ended. The schema.org type usually stays valid, the markup still validates, and it causes no harm. So: **retired markup already on a page is Informational, never a defect, and never something to recommend removing.** What is a defect is recommending someone *add* it, or a report that treats its presence as a problem to fix.

Retired in the June 2025 wave, with Search Console reporting, the Rich Results Test and the appearance filters following in January 2026: Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing. Practice Problems went in January 2026.

FAQ rich results were deprecated on 7 May 2026, with Search Console reporting and Rich Results Test support ending in June 2026 and Search Console API support in August 2026. `FAQPage` remains a valid schema.org type. Genuine user-submitted questions and answers take `QAPage`, which is live.

Note the distinction between "Course Info" and "Course list": the first is retired, the second is a currently documented feature. A report that retires both is wrong in one direction and a report that retires neither is wrong in the other.

## Validity and entity linking

- Syntactically valid JSON-LD, parseable, no trailing commas, correct `@context`.
- Required properties present for the type; recommended properties present where the page has the data. A missing required property means the feature does not render at all, which makes it a defect; a missing recommended one is a Low.
- One `Organization` block describing the site, on a single canonical page, with `name`, `url`, `logo` and `sameAs` pointing at profiles that exist and resolve. This is the site's own statement of identity and it is read by answer surfaces as well as by Search.
- `@id` values used consistently so blocks reference each other rather than repeating themselves: an `Article` whose `author` is an `@id` reference to a `Person` block, whose `publisher` references the `Organization`.
- `Person` markup on bylines, with `sameAs` links to real profiles, where the page claims an author.
- `BreadcrumbList` matching the visible breadcrumb trail and the URL hierarchy.

## Markup that disagrees with the page

This is the category that turns a harmless block into a policy problem:

- A type that does not describe the page — `Product` markup on a blog post, `LocalBusiness` on a page that is not a location.
- A rating in the markup that appears nowhere on the page.
- A price, currency or availability in the markup that differs from what the page shows.
- Markup for content behind a paywall without the subscription and paywalled-content markup that makes the arrangement legible. Serving the full body to a crawler and a gate to a visitor, with nothing declaring it, is cloaking.
- An event date in the past, a job posting that closed, an offer that expired. Stale structured data is worse than none: it renders, and it renders wrong.

## Review markup

Reviews attract their own policy and their own markup misuse:

- Self-serving reviews — a business marking up reviews of itself on its own pages — do not qualify for review rich results.
- Aggregate ratings must be based on reviews the page actually shows.
- Fake reviews, and reviews obtained by offering any reward in exchange for feedback, are a named policy problem independent of markup. Where a page solicits reviews with an incentive, that is the finding, and the markup is incidental to it.

## Preview tags

`og:title`, `og:description`, `og:image`, `twitter:card`, and `og:url` agreeing with the canonical. This is what renders when the URL is pasted into a chat, a feed, or an AI client, so its absence costs impressions rather than rankings. Keep it Low and never let it drive a verdict.

Checks worth making anyway: absolute URLs, an `og:image` that resolves and is not blocked by robots, and a per-page image rather than the site logo on 800 articles.

## Favicon

Small, easy, and visible on every result:

- Present, reachable, and not blocked by `robots.txt`.
- In a format the engine supports, declared in the head and consistent with the file served.
- A square of at least 48 pixels, or a multiple of it, so the engine can scale it down cleanly.
- Served from a stable URL. A favicon whose path changes on every build is re-fetched and re-approved from scratch.

## Publisher surfaces

Relevant only to sites that publish news or regular editorial, and a non-finding elsewhere.

**Preferred sources** lets a reader mark the site as preferred, after which its content can carry a badge in Top Stories and, where those features are available, in AI Mode and AI Overviews. The embeddable button is two elements — a `publisher.js` script tag and a container element carrying the preferred-source attribute — with optional theme and language overrides, plus a JavaScript path and a deeplink for systems that cannot run the standard one. Eligibility is domain and subdomain level: a subdirectory cannot be a preferred source.

**Search profile badges** point an audience at the site's Search profile. Same audience, same reasoning: worth naming as an unused opportunity for a publisher, worth nothing anywhere else.

## The listing as it actually renders

The authored tags are inputs. The listing is the output, and they are not the same thing.

Where a live search is available, capture for the brand or navigational query: the rendered title, the rendered description, whether sitelinks appear, whether a breadcrumb trail replaces the URL, and whether anything unexpected occupies the listing. Record the locale and the date beside it, because results are personalized and regional, and a snapshot without them cannot be compared to the next one.

Where no live search is available, this whole section returns `NOT ASSESSED`. It does not get inferred from the markup, because the entire reason to check it is that the engine sometimes disagrees with the markup.
