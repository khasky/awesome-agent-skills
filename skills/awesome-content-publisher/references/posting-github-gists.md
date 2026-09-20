# github-gists

Check: `gist.github.com` signed in renders the create form (`form` labelled `Create gist`) with the account avatar in the header; signed out shows the sign-in page. The account's own gists are at `gist.github.com/<handle>`.

Compose, three fields, all plain inputs with no length cap of their own:

- `input[name="gist[description]"]` (placeholder `Gist description…`) takes the post's frontmatter `title`. It is what a reader sees in a gist listing and in a search result.
- `input[name="gist[contents][][name]"]` (placeholder `Filename including extension…`) takes a **short** kebab-case name plus `.md`. The extension is what makes the page render as Markdown, so a missing or wrong one publishes the document as plain text. The name is not the title kebab-cased: GitHub truncates a long filename in the gist header and in every listing, so `run-deepseek-inside-claude-code-or-codex-cli-without-replacing-your-workflow.md` arrives cut mid-word and reads as a broken file. Shorten the frontmatter `title` to roughly a third to a half of its words — keep the subject, the two things it sits between, and the verb that joins them, drop the qualifiers — and aim for about 30-45 characters before the extension: `deepseek-behind-claude-or-codex.md`. Shortening is trimming the author's own words, never inventing new ones, and the full title still goes in the description field where there is room for it.
- `textarea[name="gist[contents][][value]"]` (`.js-blob-contents`, a CodeMirror-backed editor) takes the body. Type through the editor rather than setting the textarea's value, the way every CodeMirror surface here is handled. The form has an `Edit new file` / `Preview` tab pair, and Preview is the cheap confirmation that the Markdown parsed before anything is created.

**Public is not the default, and this is the one trap on this platform.** The form's primary button reads `Create secret gist`. A public gist needs the adjacent `Select a type of Gist` button opened first and the `Create public gist` item chosen (`menuitemradio`, the other being `Create secret gist Secret gists are hidden by search engines but visible to anyone you give the URL to.`), which relabels the primary button. Read that label back before clicking it: a run that clicks the default ships an unlisted page nobody will find, and the post will look published in every ledger.

A gist is a git repository, so there is no edit-by-retry: a second attempt creates a second gist. Before composing, load `gist.github.com/<handle>` and check whether this post is already there. The composer also shows the commit email the gist will carry.

The composer takes text only. An image is referenced by absolute URL inside the Markdown; there is no attachment control. A post file that declares an attachment here is not a defect and not a question for the user: drop the attachment, publish the post text-only, and record `degraded` naming the file. The platform hosts code files and Markdown documents and shows a picture nowhere, so there is nothing to decide - a gate asking whether to publish without the image spends the user's attention on a fact the platform table already states.

Read-back: the new gist's URL, `gist.github.com/<handle>/<id>`, which the browser lands on after creation. Confirm the description, the filename with its extension, that the body rendered as Markdown (headings are headings, fenced blocks are blocks) and that the page does not say `Secret`.

The footer's three lines publish as one line unless the source carries hard breaks. A gist renders its `.md` as Markdown, and Markdown treats a bare newline inside a paragraph as a space, so

```
<footer line one, ending the sentence with a colon>
<handle line for one set of platforms>
<handle line for the other set>
```

arrives as a single run-on sentence. The body text is pasted verbatim here — there is no HTML conversion step to insert `<br>` — so the break has to already be in the file. Before filling, check the footer block: if its lines end in a bare newline, append two spaces to every line but the last (the CommonMark hard break, invisible in the rendered page). Confirm on the created gist that the footer occupies three lines, not one. The same defect and the same repair apply on every platform that takes raw Markdown — `mataroa` and `hashnode` are the other two in the canonical set — and the durable fix belongs in the post file, which is `awesome-content-repurpose`'s Phase 7.
