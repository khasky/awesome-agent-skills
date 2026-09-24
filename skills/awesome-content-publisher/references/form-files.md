# Form files - one file, many platforms, and what gets added per platform

`awesome-content-repurpose` writes three post files, one per form, and each one lists the platforms it serves. `awesome-content-campaign` schedules those same files. This file says how a form file becomes one post per platform: what is read from it, what is added per platform, and what is never touched. Read it in Phase 2, before the scan, whenever the source holds a form file.

## 1. Recognising a form file

A form file is a `.md` post whose frontmatter carries `platforms`, a list of canonical slugs, instead of a single `platform`. Its form is the last token of its name:

- `1-short.md`, `2-regular.md`, `3-long.md`, as `awesome-content-repurpose` names them, unscheduled;
- `YYYY-mm-dd_HH-mm_<pub-timezone>_<title>_<form>.md`, as `awesome-content-campaign` names them, where `<form>` is `short`, `regular` or `long` and the frontmatter carries `scheduled`, `timezone`, `status` and, where a platform needs one, `targets`.

A file named for a single platform with a `platform` key is the older one-file-per-platform layout, and it is published exactly as before. A folder may not mix the two for the same piece of content; a mix is a defect the scan reports.

The frontmatter keys a form file carries: `platforms`, `title`, `voice`, `creativity`, `model`, `links`, `hashtags`, optionally `attachments`, and on a scheduled file the publishing keys. `targets` is a map from slug to target (`facebook-wall: https://...`, `mastodon: mastodon.social`), consulted wherever the canonical table's Target column names one.

## 2. Fan-out

Every slug in `platforms` becomes one post in the run plan and one entry in the ledger, keyed by file and slug together. All of them publish the same body at the file's scheduled time, one after another, with the usual rules: one platform at a time, and the same-platform spacing between posts to one account. An unscheduled form file is a backlog and follows the pacing the interview chose.

`--platforms` narrows the fan-out and never widens it: a slug the file does not list is not published from it, and the run plan says so in the user's terms.

## 3. What is added per platform, and in what order

The body the file carries is published whole, always. What the publisher adds around it is decided per platform, and each piece is added only if it fits whole inside that platform's own limit, counted the way the platform counts. Nothing is ever cut to make room, not a sentence, not a link, not a tag: a piece that does not fit whole is left off, and the ledger names what was left off and why.

**Title.** Where the platform's composer has a title field, the frontmatter `title` goes there, within that field's own limit. The platform's `posting-<slug>.md` note names the field. At the time of writing that covers every long-form platform (`tumblr`'s title block, `dreamwidth`'s `Subject`, `github-gists`' description among them), plus `reddit`, `lemmy`, `hackernews`, `daily-dev`, `peerlist` (optional), `pinterest`, `imgur`, `flickr` and `tiktok`. Where there is no title field, the title is not used at all: it is never typed as a first line, never bolded above the body. A title over its field's limit is a question for the user, never a silent cut.

**Short form.** After the body, in this order:

1. the first entry of `links`, on its own line after a blank line, if the file lists one and it fits;
2. then hashtags, taken from the front of the `hashtags` pool, up to the platform's norm in the hashtag table of `awesome-content-campaign/references/platforms.md`, as many whole tags as still fit, on one line after a blank line.

The short form never carries a footer, and the publisher never adds one to it.

**Regular and long forms.** The body already ends with the link line, the `***` separator and the footer, written by the writing skill. The publisher adds only the hashtags, after the footer: taken from the front of the pool, up to the platform's norm, as many whole tags as still fit, on one line after a blank line.

**Where hashtags go.** Where the platform has its own tag field, the tags go into the field instead of the body, and the count follows the field's norm: `tumblr`, `devto`, `hashnode`, `medium`, `hackernoon`, `substack`, `threads`, `teletype`, `blogger` (Labels), `livejournal`, `dreamwidth`, `imgur`, `flickr`, `deviantart`, `bastyon`, `ko-fi`, `buymeacoffee`, `patreon`. Where the platform has no tags at all, none are added: `peerlist`, `wonderful-dev`, `daily-dev`, `quora`, `telegraph`, `mataroa`, `github-gists`, `flipboard`, `reddit`, `lemmy`, `hackernews`. A tag is written with `#` in a body and without it in a field, CamelCase kept.

The pool order is the author's priority, so no question is asked about which tags to use: the platform's norm decides how many, and the pool decides which. Tags are never invented and never reordered.

## 4. Counting the fit

Each platform counts its own way, and the fit check uses the platform's way:

- `x` and `mastodon` bill a URL at a fixed 23 characters, and `x` bills an emoji at 2;
- `bluesky` counts graphemes;
- most others count characters, and several collapse or expand newlines differently. Measure the text the composer will actually hold, after the format conversion in `references/post-formatting.md`.

The limits and how each platform counts are in that platform's `posting-<slug>.md` note where they were measured, and in the writing skill's `awesome-content-repurpose/references/forms.md` otherwise. A body that is already over the platform's own limit before anything is added is a defect in the form file, since each form is written to the lowest limit in its group. Report it in the scan as a question for the user; the Phase 7 rule about cutting whole paragraphs applies only when the user chooses to publish anyway.

## 5. What is never touched

- The body's own text, its link line and its footer. The footer is part of the body the writer chose; the publisher neither adds it where it is missing nor removes it where it is present. A footer on a platform whose rooms read it as promotion (`reddit`, `lemmy`, `hackernews`) is a question for the user in the scan, not a silent edit.
- The order of the pool, and the text of any tag.
- The frontmatter. What the publisher adds per platform exists only in the composer and in the ledger's record of what was published.
