# Track D — Rendering, parity and delivery

## Contents

- Raw against rendered
- Mobile against desktop
- Document basics
- HTTPS and certificates
- Page weight and delivery
- Performance, and what this audit may claim about it
- Interstitials and history hijacking
- Legacy surfaces

## Raw against rendered

Fetch both, for every sampled URL, and diff them. This single comparison produces more findings than any other check in the audit, and skipping it is what makes an audit look clean on a site nothing can read.

Five failure modes surface here:

1. **Render-blindness** — the primary content exists only after client-side JavaScript. Anything that does not render sees an empty page. This is the most common visibility failure there is.
2. **Canonical conflict** — the raw HTML declares one canonical and a script injects another. Either may be taken.
3. **Robots conflict** — the raw HTML carries `noindex` and a script removes it. The raw one may still be honored.
4. **Non-200 responses are not rendered at all.** Whatever a script would have injected into an error page is invisible, which matters when a soft-404 or a 500 is the page being diagnosed.
5. **Late structured data** — JSON-LD added client-side is processed after the fact and is the wrong place for prices, availability and event dates.

Serve canonical, robots directives, title, description and JSON-LD in the initial response. Report the diff itself as evidence: which elements exist in one and not the other.

## Mobile against desktop

The mobile render is the one that gets indexed. So parity is not a nice-to-have: content that exists only on desktop is content that does not exist.

Compare, with a mobile viewport and user agent against a desktop one:

- Body text, in full. A collapsed accordion is fine; a section omitted from the mobile template is not.
- Images and video, with their `alt` and captions.
- Internal links, including the navigation. A mobile menu that renders fewer links changes the internal link graph the engine sees.
- Structured data, block for block.
- The meta set: title, description, canonical, hreflang, robots directives.

Where the site serves separate mobile URLs, the pairing must be declared in both directions — the mobile page canonicalizing to the desktop URL, the desktop page carrying the alternate annotation pointing back. A separate-URL setup with one half of the pairing missing is High.

Also here: a `viewport` meta tag present and carrying a width value. Missing entirely is an Error; present but malformed is the same outcome with a harder-to-spot cause.

## Document basics

Cheap checks that break parsing when they fail:

- A `<!doctype html>` declaration. Its absence pushes the browser into quirks mode and changes what the rendered DOM looks like.
- A declared character encoding, in a `<meta charset>` early in the head or in the `Content-Type` header. Undeclared encoding is how a page of correct text becomes a page of replacement characters in one client and not another.
- Valid head structure: nothing that terminates the head early, no content elements before the meta tags that matter.
- No `<frameset>` or `<frame>`, and no content that depends on a plugin no browser runs.

## HTTPS and certificates

- Every indexable page served over HTTPS, and the HTTP origin redirecting to it in one hop, homepage included.
- A valid certificate: not expired, not expiring within the window the report is written for, issued for the name actually being served, and covering every subdomain that answers.
- No obsolete protocol versions or ciphers on the host or its subdomains.
- No mixed content: an HTTPS page must not pull scripts, stylesheets, images or media over HTTP. A blocked subresource is a rendering failure as well as a security one.
- No links from HTTPS pages to the HTTP version of the same site, and no `http://` URLs inside a sitemap for an HTTPS site.
- HSTS is Informational here. It is a security control that happens to prevent a class of redirect, not a ranking signal.

## Page weight and delivery

Measure and report, because these are the inputs to everything in the next section and they are directly observable:

- HTML document size, naming whether the figure is the transferred compressed bytes or the decompressed document. The two differ several times over.
- Total size and count of blocking scripts and stylesheets.
- Whether text resources are served compressed, cached with a sane policy, and minified.
- Whether the primary content appears early in the document or after a large block of inline data, base64 images or navigation markup.
- DOM node count, where it is large enough to affect rendering cost.

Frame these as delivery facts. They become findings when they push the primary content or the JSON-LD past a fetch limit, when they block the first render, or when they grow between two runs of the audit.

## Performance, and what this audit may claim about it

The field metrics are **LCP**, **INP** and **CLS**, measured at the 75th percentile of real users. INP replaced FID, which no longer exists in field tooling. There is no "Core Web Vitals 2.0", no additional official vital, and the thresholds have not moved.

**This audit does not measure them.** It has no field data and runs no lab test. What it may report is the set of observable proxies above, labelled as proxies:

- Render-blocking resource count and weight, against the time to first paint they imply.
- Images without intrinsic dimensions, against layout shift.
- The largest above-the-fold element and whether it is discoverable in the initial HTML, against LCP.
- Heavy main-thread work on load, against interaction latency.

Name the metric each proxy points at, name the source that would settle it — field data from the browser report, or a lab run — and never print an LCP, INP or CLS figure this run did not produce. A borrowed number is worse than no number, because it will be quoted back.

## Interstitials and history hijacking

- **Intrusive interstitials** — a full-screen gate, overlay or app-install takeover blocking the main content on first paint, especially on mobile. A documented ranking risk. A slim consent or cookie banner is not this, and flagging one as if it were teaches the reader to ignore the real finding.
- **Back-button hijacking** — `history.pushState` or `replaceState` written on load so the Back button cannot leave the page, including when a third-party advertising or analytics bundle does it rather than the site's own code. This is a named spam policy under malicious practices, enforced by manual action rather than a ranking nudge, so a confirmed instance is Critical. Grep the bundle and every injected script for history writes that fire without a user interaction.

## Legacy surfaces

- **AMP** — where AMP pages exist, each must carry a canonical to its non-AMP counterpart, and the non-AMP page the corresponding alternate link. Validation errors in AMP markup break the format entirely. Never recommend adding AMP to a site that does not have it: it is a legacy format being wound down, and the documentation has already lost pieces of its infrastructure.
- **Speculation rules and back/forward cache** — where present, they affect perceived navigation speed. Informational: worth noting as an observation about the site's delivery, never a finding, and never a recommendation this audit makes on its own.
