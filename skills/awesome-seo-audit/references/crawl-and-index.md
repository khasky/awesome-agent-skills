# Track A — Crawl and index

## Contents

- robots.txt, and what its failures do
- Robots directives on the page and in the header
- Sitemaps
- Status codes and redirects
- Canonical
- Crawl traps and parameter spaces
- Fetch limits and crawl depth
- Engine registration and change notification
- Indexation, which is not eligibility
- Measurement plumbing

## robots.txt, and what its failures do

The file lives at the top-level directory of the host and governs only that host, protocol and port. `https://example.com/robots.txt` says nothing about `https://shop.example.com/` or about the `http://` origin.

Google reads the first **500 KiB** and ignores the rest, caches the result for about 24 hours (longer on errors, adjustable by `Cache-Control`), and supports four fields: `user-agent`, `allow`, `disallow`, `sitemap`. Everything else, `crawl-delay` included, is ignored — though other operators do honor it, so its presence is not itself a defect. On a conflict the longest matching rule path wins, and a tie resolves to the least restrictive rule.

The status the file returns matters more than anything written inside it, and this is the highest-value check in the track because every page-level check still passes while it is broken:

| Status | Behavior | Severity when found |
|---|---|---|
| 2xx | Rules apply as written | — |
| 3xx | Up to five hops followed, then treated as 404 | Medium past two hops |
| 4xx (not 429) | Treated as no file: crawling unrestricted | Low, unless the site believed it was blocking something |
| 429 | Treated as a server error | High |
| 5xx | Crawling halts for about 12 hours, then runs on the cached copy for 30 days, then degrades further | **Critical** |

Report the status, the fetched size, and whether the file was truncated. A `robots.txt` that is 700 KiB of generated disallow lines is a file whose last 200 KiB does nothing.

Content checks: syntax errors, a `Disallow:` that blocks a path the sitemap lists, blocked internal resources (a CSS or JS file the page needs to render — blocking it makes the rendered page wrong rather than private), blocked external resources, and the `Sitemap:` line being present and pointing at a live file. A missing `Sitemap:` line is Low; a `Disallow` over a money path is Critical.

One conflict is worth stating in every report where it appears: a robots-blocked URL can still be indexed from external links, URL-only and without a snippet, while a `noindex` on the same URL will never be seen because the crawler is not allowed to fetch the page that carries it. Blocking and de-indexing are different operations and they interfere.

## Robots directives on the page and in the header

Check both, on every sampled URL:

- `<meta name="robots">` and any bot-specific variant (`googlebot`, `bingbot`).
- The `X-Robots-Tag` response header, which carries the same tokens, is invisible in the markup, and is where an accidental site-wide `noindex` most often hides. A staging header that survived a deploy is the classic case.

Tokens that change the outcome: `noindex`, `nofollow`, `none`, `noarchive`, `nosnippet`, `max-snippet`, `noimageindex`, `unavailable_after`. The snippet family also governs AI answer surfaces — see [ai-visibility.md](ai-visibility.md).

Conflicting directives resolve to the most restrictive, so a page carrying `index` in the markup and `noindex` in the header is a `noindex` page.

## Sitemaps

- Exists, is valid XML, is referenced from `robots.txt`, and returns 200.
- Lists live indexable URLs only: no 404s, no redirects, no `noindex` pages, no URLs canonicalized elsewhere, no `http://` URLs on an HTTPS site, no URLs from another host.
- Under 50,000 URLs and 50 MB uncompressed per file; past either, split and use a sitemap index. A file over the cap is an Error, not a warning: the overflow is not read.
- `<lastmod>` is honored only while it stays consistently truthful. Flag a file where every entry carries the same stamp, or a stamp newer than the page's real content: dates that read as generated get discounted wholesale, taking the honest ones with them.
- `<priority>` and `<changefreq>` are ignored. Informational, safe to delete, never a finding on their own.
- A `news:` sitemap caps at 1,000 entries covering the last two days. When that namespace is present, the generic cap is the wrong check.
- In an image sitemap only `image:image` and `image:loc` are current; caption, title, license and geo tags are deprecated leftovers.
- Orphans cut both ways: a page in the sitemap that no internal link reaches, and a page internal links reach that the sitemap omits. Report both, with the count.

## Status codes and redirects

Follow status across the site, not only across the sitemap.

- **5xx** on any indexable URL — Critical. Include DNS resolution failures and connection errors here; they are the same outcome for a crawler.
- **4xx** on an indexable URL, and any internal link pointing at one — High for a linked page, Medium for an unlinked one.
- **Soft 404** — a "not found" or empty-state page answering 200. Detect by the body, not the code.
- **Permanent moves return 301**, not 302. A 302 kept for months is a permanent move announced as temporary.
- **Chains and loops** — report the full hop list. Past two hops it is a defect; a loop is Critical.
- **`meta refresh` and script-driven redirects** — neither is a redirect a crawler treats as one. Replace with a server redirect.
- **www and protocol resolution** — exactly one of `www`/non-`www` and one of `http`/`https` answers 200; the rest redirect to it, in one hop, including the homepage. Four homepages answering 200 is four copies of the site.
- **Malformed links** — `href` values with spaces, unencoded characters, doubled protocols, or a base-relative path that resolves outside the site.

## Canonical

`rel="canonical"` is a hint. Google weighs it against redirects, sitemap membership, internal linking and the HTTP/HTTPS split, and may pick a different URL. So there are two questions, and a report that answers only the first is incomplete: what does the page declare, and what did the engine select? The second is only visible in Search Console's URL Inspection; where that is unavailable, say the selected canonical is unverified.

Declared-side checks:

- Present on every indexable page, self-referencing or pointing at a deliberate target.
- Exactly one per page. Multiple canonicals are an Error — the engine may honor none of them.
- Resolves to a 200 URL on the same protocol and host model as the rest of the set. A canonical to a redirect, to a 404, or off-site is Critical.
- Absolute URL, matching the sitemap entry and `og:url` character for character. A trailing-slash mismatch between the three is a real inconsistency, not a cosmetic one.
- Present in the *raw* HTML. A canonical injected by script may be missed or overridden — see [rendering-and-delivery.md](rendering-and-delivery.md).
- Coherent across a generated cohort: every page self-canonical, or every page pointing at one hub, and not a mixture nobody intended.

## Crawl traps and parameter spaces

An infinite crawlable URL space wastes crawl budget and floods the index with near-duplicates. Look for:

- Filter, sort and facet links rendered as real `<a href>` and neither canonicalized nor `noindex`.
- Calendar-style pagination with no end.
- Session identifiers or tracking parameters in internal links, producing a duplicate of every page per campaign.
- Search result pages that are crawlable and linked.
- Pagination that loses its content to infinite scroll with no crawlable page-2 URL.

Cap or canonicalize the crawlable space. Report the parameter names and an estimate of the multiplication factor, because "there may be a trap" is not actionable and "the `?sort=` parameter takes six values on 1,200 pages" is.

## Fetch limits and crawl depth

Googlebot takes the first 2 MB of a supported file (64 MB for a PDF) and passes only the downloaded part on for indexing; referenced resources are bound by the same cap. Inline base64 images, a giant inline stylesheet, or a bloated nav can push the main content or the JSON-LD past the cut on a page that looks fine in a browser.

Measure the HTML byte size and **name which size was measured** — the transferred compressed bytes or the decompressed document. The two differ several times over, and a finding that does not say which one it used cannot be reproduced.

Crawl depth: a page more than three clicks from the entry point is harder to reach and usually less internally supported. Report the depth distribution, the pages past the threshold, and the pages with exactly one internal inbound link — the latter is the population that becomes orphaned next time a template changes.

## Engine registration and change notification

Readable straight from the markup, the DNS zone, or the repository:

| Engine | Verification artifact |
|---|---|
| Google | `<meta name="google-site-verification">`, an HTML file at the root, a DNS TXT record, or a linked Analytics/Tag Manager container |
| Bing | `<meta name="msvalidate.01">`, `BingSiteAuth.xml`, or a CNAME record |
| Yandex | `<meta name="yandex-verification">` or a file at the root |
| Baidu | `<meta name="baidu-site-verification">` or a file at the root |
| Naver, Seznam | a meta tag or root file, per that engine's console |

Which of these is a finding depends entirely on the target market established in step 1. Absent Bing verification on a site targeting any English-speaking market is a real gap, because Bing's index feeds Yahoo, DuckDuckGo and Copilot; absent Baidu verification on a site with no Chinese audience is nothing at all.

Also check that the property registered covers every variant that answers — `www` and non-`www`, `http` and `https`, and each subdomain that carries indexable content. A property registered on one variant reports on one variant.

**IndexNow** notifies Bing, Yandex, Naver, Seznam and Yep of an added, changed or deleted URL. Google does not participate. The auditable artifacts are the key file at the site root and whether the publishing flow actually calls the endpoint on change; the stated benefit is fewer stale URLs in Copilot answers and faster re-crawl on the participating engines. Its absence is a Low finding on a site that publishes often and a non-finding on a site that does not.

## Indexation, which is not eligibility

Every check above establishes that a page *may* be indexed. None of them establishes that it *is*. The gap is where "crawled, currently not indexed" lives, and it passes this entire track cleanly.

Confirm with, in descending order of authority:

1. **Search Console URL Inspection** — states the indexed status and the engine-selected canonical for one URL.
2. **Search Console Index Coverage** — the same at set scale, with the reason per excluded state: crawled currently not indexed, discovered currently not indexed, duplicate without user-selected canonical, alternate page with proper canonical tag, blocked by robots.txt, excluded by `noindex`.
3. **A `site:` lookup** — a rough presence signal only. The result count is unreliable and must never be reported as a number of indexed pages.

Where no live search and no Search Console access is available, return `NOT ASSESSED` for indexation and say which of the three would settle it. Reporting eligibility as though it answered the question is the failure this section exists to prevent.

## Measurement plumbing

Not SEO in itself, but it decides whether the next audit can corroborate anything:

- An analytics tag present on every page template. A template with no tag is a permanent blind spot, and it usually happens to be the one nobody looks at.
- No duplicate tag on the same page, which double-counts sessions and quietly invalidates every before-and-after comparison a fix is judged on.
- Consent gating that blocks measurement entirely in a market where the site operates, reported as a measurement gap rather than an SEO defect.
