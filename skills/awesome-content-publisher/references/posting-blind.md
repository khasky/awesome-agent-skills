# blind

Check: `teamblind.com` signed in shows `Write a Post`, `Notifications` and an `Account Menu` button in the header. The account menu holds `Profile` (`/user/profile`) and `Activity History` (`/user/history`), and the second one is the read-back page. The composer says who is posting under its body: `Posting as <company> / <username>`.

**Posting needs a reviewed company.** An account with an empty `Company Name` posts as `New / <username>`, and while Blind reviews the company it refuses every post. After the confirm step it shows a toast for about two seconds, *"We're reviewing your company information. This may take up to 72 business hours."*, the page stays on the composer with everything still filled in, and `Activity History` keeps reading `No posts... yet!`. Nothing in the network panel says so: the post goes out as a Next.js server action to `POST /post/write` whose request and response are both AES-encrypted, and it returns `200` whether the post was created or refused. So the toast is the only evidence. Poll for `[role=status]`, `[role=alert]` and toast elements every few hundred milliseconds from the moment of the confirm click, because a check two seconds later finds nothing. Treat `New /` in the posting line as the cue to ask in Phase 3, not at publishing time. A refused post is `failed`, retryable once the review is done, and never a reason to resubmit in a loop.

**Ad blockers.** With an ad or script blocker running, Blind's pages carry *"You are seeing this message because ad or script blocking software is interfering with this page"*. The first attempt of the run was made in that state and was checked only after the page had settled, so it is unknown whether the blocker or the late check is why no toast was seen. With the blocker off and polling from the click, the same submit showed the review toast. If that line is on the page, ask the user to allow the site before the first submit.

Compose: `teamblind.com/post/write`. The page opens with the channel picker already showing as a Radix dialog, and the dialog intercepts every click until a channel is picked, so `locator.click` on the title or body times out. The list holds `My Channels`, which includes the company channel when there is one, then `Channels I Follow`. Its search box (`Search for channels`) filters only that list, so a channel the account does not follow cannot be found from here. Pick the target with `locator('[role=dialog] button', { hasText: '<channel>' })`. Then:

- Title: `input[name=title]`, `maxLength` 120, filled with `locator.fill`. It takes the frontmatter `title` as written. Blind titles run in sentence case, so no title-case conversion.
- Body: `textarea[name=content]`, plain text. Click it, then `keyboard.insertText`, and `\n\n` stays a blank line. The textarea shows the channel's own rule as its placeholder, so read it before filling. No counter shows, and a 12,000-character probe went in with no error. Clear a probe with `locator.fill('')`.
- `Images`: a button whose label sits in a `span` with extra whitespace, so a `hasText: /^Images$/` locator matches nothing. Find it by `innerText.trim() === 'Images'` and click by coordinate. The click opens a native chooser that the bridge holds as modal state: `page.waitForEvent('filechooser')` inside the same run_code does not receive it. Answer it with `browser_file_upload`.
  - The upload is a separate server action, and its response, unlike the post's, is readable: `{"success":true,...,"fileName":"https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/..."}`.
  - Under the thumbnail sits `(Optional) Add image caption`. That caption is shown to readers, and the composer has no alt field, so it stays empty.
- `Poll` and `Mentions`: never touched.
- `Hide company name`: the checkbox spends paid credits (`0 credits left`), so it is never touched.

Submit: the header `Post` button opens a second dialog, *"Do you want to post this under <channel>?"*, with its own `Post`, and that one submits.

Read-back: on success the page should leave `/post/write`. Then confirm the post on `/user/history` and in the channel's `Recent` sort, and record the `/post/<slug>-<id>` permalink. Never count the composer's own contents.

Format, from posts read on 2026-09-30: the body renders in a `p.whitespace-pre-wrap`, so line breaks and blank lines show exactly as typed. Markdown is literal text, so headings take the emoji-line form and the `***` line is removed. Bare URLs become anchors with `rel="ugc"`. `#tags` in the body become links to `/search/<tag>`.
