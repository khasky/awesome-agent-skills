# Re-audit — baseline and drift

## Contents

- Why the mode exists
- What the snapshot holds
- Writing it so it diffs
- Severity of a change
- Same sample, or no diff
- Reporting drift

## Why the mode exists

A first audit is a snapshot. Most SEO damage arrives later, in a release that drops one tag nobody was watching, and it is invisible until traffic moves weeks afterwards. Capture the snapshot on the first pass and diff it on every pass after.

The drift mode is also the only place this audit produces something like a trend, and it does so without a score: the trend is the list of what changed.

## What the snapshot holds

One file per URL, stored beside the raw pulls.

**Identity and status**

- Final URL after redirects, and the full hop list
- HTTP status
- `<html lang>`

**Indexing directives**

- Declared canonical
- Meta robots
- `X-Robots-Tag` header value
- The engine-selected canonical, where Search Console access made it available

**Content surface**

- `<title>`
- Meta description
- `h1`, `h2` and `h3` text, in document order
- Main-content word count
- A hash of the main content

**Markup**

- Every JSON-LD block, and a hash of the set
- Open Graph and Twitter card tags
- The hreflang set

**Delivery**

- HTML byte size, with the measurement basis named
- Render-blocking script and stylesheet count
- Whether primary content was present in the raw HTML
- A hash of the mobile render's main content, for the parity check

**As rendered by the engine, where a live search was available**

- The rendered title and description for the page's brand or navigational query
- Whether sitelinks and a breadcrumb trail appeared
- The locale and date the capture was made under

Stored only where it was actually captured. A field absent from the baseline and present in the next run is not drift; it is a run that reached further, and the diff says so rather than reporting a change.

**Site-level, stored once per run rather than per URL**

- `robots.txt` status, size, and a hash of its contents
- The AI-bot rules in force, per bot
- Sitemap URL count and the hash of the URL list
- Verification tags present, per engine
- llms.txt presence and hash
- Feed presence, and the hash of its item URL list

## Writing it so it diffs

The point of the file is that comparing two of them is an ordinary text diff needing no database. That only works if the serialization is stable:

- One field per line.
- The same field order in every file, always.
- Arrays sorted by a stable key: hreflang by code, JSON-LD blocks by `@type`, headings by document order.
- Hashes last.
- No run timestamp inside the file. The directory path already carries the run's date, and its time where two runs share a day.

A snapshot serialized in whatever order the parser happened to emit produces a diff full of moved lines, and the one changed value hides in it.

## Severity of a change

**Critical**

- The canonical changed or disappeared
- `noindex` appeared, in the tag or the header
- The title or the `h1` is gone
- A URL that answered 2xx now answers 4xx or 5xx
- All structured data vanished
- `robots.txt` changed from 2xx to 5xx, or a `Disallow` now covers a path that was crawlable
- Primary content left the raw HTML and is now rendered client-side
- Content present on desktop is now absent from the mobile render

**High**

- A schema block was modified rather than removed
- The hreflang set shrank
- A redirect chain appeared where there was a direct 200
- `html lang` changed
- An AI bot rule changed from allow to disallow, or the reverse
- A verification tag disappeared
- The sitemap URL count moved by more than the content actually changed

**Medium and below**

- Title or description text changed — confirm intent, then watch impressions
- The `h2` skeleton moved
- Open Graph tags dropped
- Render-blocking count or byte size grew
- The content hash moved with nothing else triggering
- llms.txt appeared, changed or vanished
- The engine began rewriting a title it previously showed as authored, which is the engine saying the authored title stopped describing the page
- Sitelinks or the breadcrumb trail disappeared from the brand-query listing

## Same sample, or no diff

A diff taken over a different URL set is not a diff. If this run reached fewer pages — a budget cap, a fetch failure, a section that moved — say so and diff only the intersection, naming the URLs excluded from the comparison and why.

The same applies to method. A baseline captured from raw HTML and compared against a run that captured rendered HTML produces a page of differences that are all artifacts. Record which was captured, and compare like against like.

## Reporting drift

A drift finding is a question, not a verdict. A canonical change is Critical because it is usually unintended, not because it is always wrong. Print the old and the new value side by side and let the owner confirm intent.

Lead the report with the drift block, above the findings:

```text
Drift vs baseline <date>: <n> changes, <n> Critical
- <URL> — canonical: <old> → <new> — Critical — confirm this was intended
- <URL> — h1: present → absent — Critical
- site — robots.txt: 200 → 503 — Critical — crawling is halted site-wide
Compared: <n> of <n> URLs · <n> excluded from the comparison, listed below
```

Then the ordinary findings from whichever tracks were walked this run. A re-audit that only diffs is a re-audit that misses everything the first pass did not check.
