# dreamwidth

Check: `dreamwidth.org/update` renders `Post an Entry` with `Post as: <user>`; signed out redirects to login. The journal is `<journal>.dreamwidth.org`.

Compose: a classic HTML form. `Post to:` selects the journal or a community (the post file's `target`). `Subject:` is the title. The body textarea has a `Rich Text` / `HTML` toggle above it and opens in HTML mode: paste HTML there with `Disable Auto-Formatting` checked, or plain paragraphs with it unchecked, because auto-formatting turns every line break into a break tag and doubles the spacing of pasted HTML. `Insert Image` and `Embed Media` sit on the same toolbar. `Tags:` takes a comma-separated list. `Show this entry to:` stays on `Everyone (Public)`. Submit is the `Post to: <journal>` button at the bottom (`Preview` beside it opens a preview page).

Read-back: `<journal>.dreamwidth.org/<id>.html`, newest entry from the journal's front page.

The image needs a URL, not a file, and that decides where this platform sits in the run's order. `Insert/Edit image` on the body toolbar takes an address; Dreamwidth hosts nothing for a free account and the form offers no upload. So **publish `dreamwidth` last**, after the platforms that do host an image have run, and use one of their returned asset URLs as the source — `flickr`, `imgur`, `deviantart`, `livejournal` and `ko-fi` all produce a direct image URL, and the ledger's `asset_url` field is where the run already records them. Check the one you pick actually loads in a Dreamwidth entry before publishing: some hosts refuse hotlinking and the entry then shows a broken image, which is worse than no image. A run that skipped this shipped the entry with no picture.

The `img` is not responsive, so give it a width. Dreamwidth renders the tag as written inside a fixed content column, and an image wider than that column overflows it. Set an explicit `width` attribute (the entry column is around 700px on the default styles — match the column, do not exceed it) and confirm on the published entry that the rendered image is no wider than a paragraph of the body.

Both of these make `dreamwidth` a natural last entry in the publishing order, alongside any other platform that can only reference an image by URL. Where the run has no image-hosting platform ahead of it, say so and publish text-only rather than linking a file from a host that may not allow it.
