# github-gists

Check: `gist.github.com` signed in renders the create form (`form` labelled `Create gist`) with the account avatar in the header; signed out shows the sign-in page. The account's own gists are at `gist.github.com/<handle>`.

Compose, three fields, all plain inputs with no length cap of their own:

- `input[name="gist[description]"]` (placeholder `Gist description…`) takes the post's frontmatter `title`. It is what a reader sees in a gist listing and in a search result.
- `input[name="gist[contents][][name]"]` (placeholder `Filename including extension…`) takes `<kebab-case-title>.md`. The extension is what makes the page render as Markdown, so a missing or wrong one publishes the document as plain text.
- `textarea[name="gist[contents][][value]"]` (`.js-blob-contents`, a CodeMirror-backed editor) takes the body. Type through the editor rather than setting the textarea's value, the way every CodeMirror surface here is handled. The form has an `Edit new file` / `Preview` tab pair, and Preview is the cheap confirmation that the Markdown parsed before anything is created.

**Public is not the default, and this is the one trap on this platform.** The form's primary button reads `Create secret gist`. A public gist needs the adjacent `Select a type of Gist` button opened first and the `Create public gist` item chosen (`menuitemradio`, the other being `Create secret gist Secret gists are hidden by search engines but visible to anyone you give the URL to.`), which relabels the primary button. Read that label back before clicking it: a run that clicks the default ships an unlisted page nobody will find, and the post will look published in every ledger.

A gist is a git repository, so there is no edit-by-retry: a second attempt creates a second gist. Before composing, load `gist.github.com/<handle>` and check whether this post is already there. The composer also shows the commit email the gist will carry.

The composer takes text only. An image is referenced by absolute URL inside the Markdown; there is no attachment control, so a post file declaring an attachment for this platform is a defect to report rather than a file to upload.

Read-back: the new gist's URL, `gist.github.com/<handle>/<id>`, which the browser lands on after creation. Confirm the description, the filename with its extension, that the body rendered as Markdown (headings are headings, fenced blocks are blocks) and that the page does not say `Secret`.
