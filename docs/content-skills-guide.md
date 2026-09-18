# Content skills: from a source to published posts

A step-by-step guide to the five `awesome-content-*` skills, written for someone who has never used an AI coding agent. It starts at "open a terminal" and ends at posts published to your own accounts.

If you already run Claude Code or Codex daily, skip to [Part 3](#part-3--connect-your-browser) — that is the only part specific to these skills.

Russian version: [content-skills-guide.ru.md](content-skills-guide.ru.md).

## Contents

- [What you are setting up](#what-you-are-setting-up)
- [The six skills](#the-six-skills)
- [Part 1 — Install the agent](#part-1--install-the-agent)
- [Part 2 — Install the skills](#part-2--install-the-skills)
- [Part 3 — Connect your browser](#part-3--connect-your-browser)
- [Part 4 — A first run that publishes nothing](#part-4--a-first-run-that-publishes-nothing)
- [Part 5 — Publishing for real](#part-5--publishing-for-real)
- [Running them as a chain](#running-them-as-a-chain)
- [What the run will ask you](#what-the-run-will-ask-you)
- [What appears on your disk](#what-appears-on-your-disk)
- [Writing a post file by hand](#writing-a-post-file-by-hand)
- [How long it takes](#how-long-it-takes)
- [If something goes wrong](#if-something-goes-wrong)
- [What the publisher will never do](#what-the-publisher-will-never-do)

## What you are setting up

Four words are used throughout, and none of them mean what they sound like on first reading.

- **Agent** — a program you talk to in a terminal window. You type a request in plain language; it reads files, runs commands and edits things on your machine. Claude Code and OpenAI Codex are agents. This guide uses Claude Code for every concrete command.
- **Skill** — a folder of written instructions the agent loads when your request matches it. A skill adds no software: it is a document that tells the agent how to do one job properly. The six in this repository cover writing posts, making their pictures and publishing them.
- **MCP server** — a small helper program the agent starts in the background to reach something outside itself. Here it reaches your browser.
- **The bridge** — the MCP server plus a browser extension, together. It lets the agent act inside the browser window you already use, in the sessions where you are already signed in. Nothing about your passwords passes through it, because no password is ever typed.

The shape of the whole thing: you talk to the agent → the agent reads a skill → the skill tells it to drive your browser through the bridge → posts appear on your accounts.

Two things you need before any of it: an account with an AI provider that the agent bills against (Claude Code needs a Claude subscription or API billing — set that up at the provider first, the agent will not run without it), and accounts on the platforms you want to post to, signed in already.

## The six skills

| Skill | Input | Output |
| --- | --- | --- |
| [awesome-content-voice](../skills/awesome-content-voice) | Your existing posts, files, or an interview | One reusable voice profile file |
| [awesome-content-campaign](../skills/awesome-content-campaign) | A repo, a site, files — a product you want to talk about, plus the topic, the start date and how long it runs | Dated folders of post files, one per platform slot, plus a manifest |
| [awesome-content-repurpose](../skills/awesome-content-repurpose) | One existing text: a link, a file, pasted notes | The same folder format, no schedule |
| [awesome-content-graphics](../skills/awesome-content-graphics) | A reference: text, images, a URL — whatever the picture should be about | A set of drawn images of the size you name, and the one you picked |
| [awesome-content-image-adapter](../skills/awesome-content-image-adapter) | One finished picture, and the posts it belongs to | The same picture in each platform's own frame, one PNG per platform |
| [awesome-content-publisher](../skills/awesome-content-publisher) | A folder of post files | Published posts on your own accounts, plus a ledger |

`campaign` and `repurpose` both write the file format `publisher` reads. Pick `campaign` when you have product sources and want a schedule; pick `repurpose` when you have one article and want it in every platform's own register.

`voice` and `graphics` are optional inputs to the other three: the voice profile shapes how the posts sound, the graphics give them a picture. `image-adapter` is the step after the picture — it puts that one picture into every platform's own frame, and it runs on its own just as happily on any image you already have.

## Part 1 — Install the agent

### Step 1.1 — Open a terminal

Every command below is typed into a terminal window.

| System | How to open one |
| --- | --- |
| Windows | Start menu → type `PowerShell` → open **Windows PowerShell** |
| macOS | ⌘+Space → type `Terminal` → Enter |
| Linux | Ctrl+Alt+T, or find **Terminal** in the applications menu |

You type one command, press Enter, and wait for the prompt to come back before typing the next.

### Step 1.2 — Install Node.js and Git

Two programs, both free, both installed once.

**Node.js** runs the agent, the skills installer and the browser bridge. Download the **LTS** build from [nodejs.org](https://nodejs.org) and install it with default options.

**Git** downloads this repository in Part 2. Get it from [git-scm.com](https://git-scm.com/downloads) — that page covers Windows, macOS and Linux. On macOS the first `git` command may instead offer to install Apple's developer tools; accepting that is enough.

Then close the terminal, open it again, and check both:

```bash
node --version
git --version
```

Two version numbers, such as `v24.15.0` and `git version 2.54.0`, mean it worked. `command not found` or `not recognized` means the terminal was opened before the install finished — close and reopen it.

### Step 1.3 — Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Then check:

```bash
claude --version
```

Other install routes (a native installer, Homebrew) are on the [Claude Code docs](https://code.claude.com/docs). Using a different agent instead — Codex, Gemini CLI, Cursor — is fine; every step after this one has an equivalent there, and the [README install table](../README.md#install) lists the paths. The concrete commands in this guide are Claude Code's.

### Step 1.4 — Start it and sign in

Make a folder to work in, and start the agent inside it:

```bash
mkdir my-posts
cd my-posts
claude
```

The first run opens a browser window to sign in to your Claude account. After that you get a prompt where you type in plain language.

Two controls worth knowing immediately: **Esc** interrupts whatever the agent is doing, and typing `/exit` (or pressing Ctrl+C twice) closes it. Nothing you have read about in this guide happens without you approving it first.

### Step 1.5 — Pick the model

Two settings decide how the agent behaves: which model, and how much effort it spends per step. Set both when you start it:

```bash
claude --model opus --effort medium
```

Inside a running session, `/model` changes the same thing.

**Recommended: Opus 5 at `medium` effort.** It carries the whole pipeline in the ordinary case — writing the posts, filling composers that match their notes, running the per-platform check against the source file — and it is the setting the five-minutes-per-platform figure further down was measured at.

**Switch to `high` when the run is long or the platforms are unfamiliar.** The difference is not writing quality; it is what happens when a page does not behave. At `high` the agent is more patient about working out *why* a submit silently refused, more willing to climb the ladder of click techniques instead of repeating the one that failed, and more careful choosing a repair that does not lose a half-filled draft. It also handles the judgement calls in the writing skills better — which paragraph to drop when a post is over a platform's cap, which claims a picture is allowed to carry. The cost is time: every step takes longer.

A practical split: writing and graphics at `medium`, a publishing run across many platforms at `high`. `low` is not worth it here — these skills are long multi-step procedures with gates, and cheap steps are exactly where a gate gets skipped. `xhigh` and `max` exist for harder reasoning than this work needs.

This is guidance from how the skills behave, not a benchmark.

## Part 2 — Install the skills

Leave the agent for a moment (`/exit`) and run these in the same terminal:

```bash
git clone https://github.com/khasky/awesome-agent-skills.git
cd awesome-agent-skills
npx skills add ./skills -g -s "*" -a claude-code -y
```

The first command downloads this repository, the third installs every skill into Claude Code. It asks to download the `skills` helper the first time — answer yes.

Check that they landed. The installer writes to one of two places depending on the machine, so look in both:

| Shell | Command |
| --- | --- |
| PowerShell | `Get-ChildItem ~\.claude\skills, ~\.agents\skills` |
| macOS, Linux | `ls ~/.claude/skills ~/.agents/skills` |

Folders named `awesome-content-campaign`, `awesome-content-publisher` and the rest in **either** listing means it worked — Claude Code reads both. If both are empty, the [README install section](../README.md#install) has the by-hand path and the copies-versus-links detail.

Alternative on Claude Code, if you would rather not clone: inside the agent, type `/plugin marketplace add khasky/awesome-agent-skills`, then `/plugin install awesome-agent-skills@awesome-agent-skills`.

## Part 3 — Connect your browser

This is the part specific to publishing. Do it once per browser profile.

**Which browser:** the one where you are already signed in to Instagram, LinkedIn, Mastodon and the rest. That is the whole point of the bridge — the agent posts as you, in your existing sessions, and it never types a password, never fills a 2FA prompt and never clicks a captcha. If your accounts are spread across two browsers, pick the one with most of them and sign in to the rest there by hand.

Chrome, Edge or another Chromium build. Firefox and Safari are not supported in this mode.

### Step 3.1 — Install the extension

Open [the Playwright extension listing](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm) in the browser you want driven and install it. Edge installs from the same Chrome Web Store listing. Source and notes: [microsoft/playwright, packages/extension](https://github.com/microsoft/playwright/tree/main/packages/extension).

### Step 3.2 — Read the profile's token

In that same browser, open this address:

```text
extension://mmlmfjhmonkocbjadbfplnigmagldckm/status.html
```

The page shows a pairing token and a regenerate control. Copy the token. It authorizes a local program to attach to this browser profile; it is not a password and it is not your account.

It is per profile: a second browser, or a second profile in the same browser, has its own.

### Step 3.3 — Register the bridge with the agent

**One bridge is enough.** A publishing run drives exactly one browser — the one from the top of this part. Add a second entry only if you keep separate browsers for these accounts and want to choose between them at the start of a run; the publisher then asks which one before it touches anything.

In the terminal, one line, with your token pasted in place of `<token>`:

```bash
claude mcp add playwright -s user -e PLAYWRIGHT_MCP_EXTENSION_TOKEN=<token> -- npx -y @playwright/mcp@latest --extension --browser chrome
```

For Edge, change the name and the browser:

```bash
claude mcp add playwright-edge -s user -e PLAYWRIGHT_MCP_EXTENSION_TOKEN=<token> -- npx -y @playwright/mcp@latest --extension --browser msedge
```

`playwright` and `playwright-edge` are names you choose — they are what the agent shows when it asks which bridge to use, so name them after the browser. `-s user` makes the bridge available in every folder rather than only this one.

Confirm it registered:

```bash
claude mcp list
```

`--browser` takes a browser name or a Chrome channel:

| Value | What it opens |
| --- | --- |
| `chrome` | Google Chrome, stable |
| `msedge` | Microsoft Edge, stable |
| `chrome-beta` · `chrome-dev` · `chrome-canary` | the matching Chrome channel |
| `msedge-beta` · `msedge-dev` · `msedge-canary` | the matching Edge channel |
| `chromium` | a plain Chromium build |

`firefox` and `webkit` are valid `--browser` values for Playwright in general and **not** for this mode: the server's own help states `--extension` connects to a running browser instance, Edge or Chrome only. A run configured that way never attaches.

Other Chromium forks — Brave, Vivaldi, Opera, Arc — accept the extension from the same store listing, but `--browser` has no value that names them and the extension mode is documented as Chrome and Edge only. Treat them as unsupported for publishing rather than as something to debug.

One more flag worth knowing when a browser holds several profiles: add `--profile-dir-name "Profile 1"` at the end to pick the profile directory. Without it the server takes the last used profile that has the extension installed, which is usually right and is worth pinning explicitly when the accounts live in a profile you do not browse with daily.

<details>
<summary>Editing the configuration file instead of using the command</summary>

Some agents have no `mcp add` command and want the entry written into a JSON file. The shape is the same:

```jsonc
"playwright":      { "command": "npx",
                     "args": ["-y", "@playwright/mcp@latest", "--extension", "--browser", "chrome"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that profile's token>" } },
"playwright-edge": { "command": "npx",
                     "args": ["-y", "@playwright/mcp@latest", "--extension", "--browser", "msedge"],
                     "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that profile's token>" } }
```

Which file, and where it lives, is your agent's documentation to answer. For Claude Code the command above writes it for you, which is why it is the recommended route.

</details>

**Why `--browser` matters.** Without it, the server opens its relay page in the machine's *default* browser. With two entries that both default, the one whose token belongs to the other browser waits forever: it starts cleanly, listens, answers `initialize`, and never answers a single tool call. That symptom has exactly one cause and this is it.

### Step 3.4 — Restart the agent

Close it (`/exit`) and start `claude` again so it picks up the new configuration. A token set but not restarted looks identical to a token that did not work.

### Step 3.5 — Check the bridge is alive

Make sure the browser from step 3.1 is **open**, then type this to the agent:

```text
List the open browser tabs
```

- A lone `connect.html` — healthy. That is the bridge's own page; you simply have no other tab open. Never touch that tab.
- Your real tabs listed — also healthy.
- A lone `about:blank` — the failure case: the agent is on a fresh empty browser with none of your sessions.
- "The MCP server needs authentication" — the token has not been picked up. See [If something goes wrong](#if-something-goes-wrong).

## Part 4 — A first run that publishes nothing

Do this before anything real. It exercises every check and posts nothing.

You need a folder with at least one post file in it. Either let a skill write one:

```text
Use awesome-content-repurpose on https://example.com/some-article — just mastodon and bluesky
```

or write one by hand, as [below](#writing-a-post-file-by-hand).

Then:

```text
Use awesome-content-publisher on ./my-campaign-folder --dry-run
```

`--dry-run` runs the bridge check, the file scan, the login check per platform and prints the full plan — and stops there. Read the plan. It is the same plan you will approve for real, so this is where you find a wrong platform, a missing image or a file the scanner rejects, at zero cost.

## Part 5 — Publishing for real

Each skill triggers on plain intent. Naming it makes the choice deterministic. In Claude Code you can also type `/awesome-content-publisher` and the skill loads directly.

### Voice profile

```text
Use awesome-content-voice: build my voice profile from https://myblog.example and the posts in ./writing/
```

Produces one profile file. Written once, reused by every later run.

### Writing posts from product sources

```text
Use awesome-content-campaign on this repo and https://myproduct.example — two weeks, the platforms I actually have accounts on
```

You will be asked which platforms, over what period, and in which language.

### Writing posts from one existing article

```text
Use awesome-content-repurpose on https://example.com/my-article — every platform in the table
```

Same output format, no schedule. This is the one to use when the source is a single text.

### Making the picture

```text
Use awesome-content-graphics for this campaign: vertical 1080x1350, 100 images
```

You hand over a reference — the article, a few pictures, a link, or all three. The run tells you in one sentence what it thinks the picture is about, so you can correct it before a hundred pictures are made of the wrong thing. Then it asks how many you want: 10, 20, 50 or 100.

The agent draws the set itself — there is no image service to sign up for, no key to set and nothing to install. It composes each picture, saves them into one folder and opens it. You answer with a number. If nothing fits, ask for another round: it rebuilds the set from different ideas, not the same ones recoloured. The earlier rounds stay on disk.

The picture you pick is copied into a folder of its own, which opens separately — so you are never hunting for the chosen file among the ninety-nine it beat.

What this gives you is flat, graphic work: shape, type, colour, diagrams, patterns. It does not give photographs. Where you want a photograph, supply your own and go straight to fitting it per platform.

### Fitting the picture to each platform

```text
Use awesome-content-image-adapter on ./poster.png
```

Every platform shows a picture in its own frame: wide on an article site, tall in a phone feed, square on a profile. This takes the one picture you approved and writes it out in each of those frames, one file per platform, named after the platform. Run on its own it puts them in a temporary folder and opens it. Run as part of a chain it puts them next to the posts, so `linkedin.md` and `linkedin.png` sit side by side and the publisher finds the picture without being told where it is.

Nothing is redrawn. A frame wider than your picture is a minimal centred crop; a frame taller than it keeps the whole picture and fills the space above and below with a blurred, darkened continuation of the same image.

### Publishing

```text
Use awesome-content-publisher on ./my-campaign-folder
```

Before anything is posted you get: a bridge check, a source scan that hard-stops on any malformed file, a login check per platform, and a run plan you have to approve.

While it runs, the browser is busy — the agent is clicking inside it. Leave it alone, and expect roughly five minutes per platform. **Esc** stops the run; the ledger means restarting later continues from where it stopped rather than posting anything twice.

## Running them as a chain

The usual order, and what to hand over at each step:

1. **`awesome-content-voice`** once, ever. Keep the profile file.
2. **`awesome-content-campaign`** or **`awesome-content-repurpose`** — point it at the source and the voice profile. Read the drafts. This is the moment to fix wording; every later stage treats these files as the author's words and will not rewrite them.
3. **`awesome-content-graphics`** — it reads the campaign's material, asks how many images you want and gives back a set. Pick one by number, or ask for another round. Supplying your own picture instead is the same step, answered differently.
4. **`awesome-content-image-adapter`** — it runs straight after the pick, without being asked, and writes the picture in every platform's frame beside the posts.
5. Nothing to do by hand: the post files name the picture that sits next to them.
6. **`awesome-content-publisher`** — point it at the folder. Approve the run plan. Let it work.

A single sentence that runs the whole chain also works, and the agent will stop at each gate that needs your answer:

```text
Take https://example.com/my-article through awesome-content-repurpose, make graphics for it, then publish everything with awesome-content-publisher
```

## What the run will ask you

Gates exist because the actions are public and some are irreversible. Expect these:

- **Which browser bridge**, when more than one is configured.
- **Which platforms**, and what to do about ones with no post file.
- **Overdue posts**: publish now in order, skip, or shift the schedule.
- **Hashtag counts** that differ from a platform's norm — one batched question naming the platform, the current count, the target, and the exact tags moving.
- **The run plan**, as a table, before the first post.
- **Anything irreversible**: an email send on Substack, a paid audience, a post to a group someone else moderates.
- **Reddit's subreddit**, if reddit is in the set — the skill will not pick one for you.

Answer in plain language, or pick from the options it offers. Nothing publishes on a question left unanswered.

## What appears on your disk

Nothing is hidden, and nothing leaves your machine except the posts themselves.

```text
my-campaign-folder/
├── 2026-09-01_10-00_Europe-Kyiv_post-title_mastodon.md   one file per post
├── mastodon.png                                           the same picture in that platform's frame
├── campaign.md                                            the manifest, when a campaign wrote them
├── image.png                                              the picture the posts share
└── publish-state/
    └── ledger.json                                        what published, where, and when
```

The ledger is the important one: it is how a stopped run resumes without posting anything twice, and it holds each post's URL and the evidence the audit collected. Keep it with the campaign.

Graphics land in their own folder, which the run prints as an absolute path — renders, the HTML they were built from, a contact sheet and a gallery page. The per-platform pictures do not: they sit beside the posts, one named after each platform, because that is where a post and its picture are read together.

## Writing a post file by hand

You do not need a skill to make one. A post file is Markdown with a frontmatter block on top, and its name carries the schedule:

```text
YYYY-mm-dd_HH-mm_<timezone>_<post-title>_<platform>.md
```

Exactly five fields separated by `_`, and inside a field only `-` — a `_` inside a field breaks the parse. The timezone is the IANA name with `/` and `_` replaced by `-`: `Europe/Kyiv` → `Europe-Kyiv`.

`2026-09-01_10-00_Europe-Kyiv_a-million-tokens_mastodon.md`:

```markdown
---
platform: mastodon
scheduled: 2026-09-01 10:00
timezone: Europe/Kyiv
title: "A million tokens, drawn to scale"
attachments:
  - file: image.png
    alt: "A card comparing one million tokens to 3,000 printed pages"
links: ["https://example.com"]
hashtags: []
status: draft
---

The body of the post, exactly as you want it published.
```

`target` is an extra frontmatter line for platforms that need one — a subreddit, an instance, a board, a group. The publisher refuses to guess it.

Platform names are the slugs the skills use: `mastodon`, `bluesky`, `linkedin`, `instagram`, `pixelfed`, `medium`, `teletype` and so on. The full table is in [`awesome-content-campaign`'s platform reference](../skills/awesome-content-campaign/references/platforms.md).

## How long it takes

Measured from the publisher's own ledger timestamps on a 25-platform run. The figure is the full cycle per platform: open the composer, fill it, attach the image, submit, read back the permalink, diff it against the source file, write the ledger.

| Composer type | Platforms | Per post |
| --- | --- | --- |
| Plain text box | x, bluesky, threads, mastodon, truthsocial, minds, peerlist, lemmy, quora, bastyon | 2–6 min |
| Markdown field | devto, wonderful-dev | 2–4 min |
| Caption with a required image | instagram, pixelfed, pinterest | 4–8 min |
| Rich editor, short post | tumblr, daily-dev, patreon, ko-fi, buymeacoffee | 3–9 min |
| Rich editor, long-form | medium, hashnode, substack, hackernoon, teletype | 4–9 min |

Whole-run figures from the same ledger:

- **15 platforms in 73 minutes** of uninterrupted work — about 5 minutes each, which is the number to plan with.
- **The first platform of a session costs more**: bridge gate, login preflights and the source scan land on it. Budget 15–20 minutes before the first post goes out.
- **Graphics are separate**: a 100-render set with its geometry gate and duplicate sweep is its own job, not part of the publishing hour.
- **Different platforms have no wait between them.** Two posts to the *same* platform stay at least 2 hours apart; different platforms follow each other immediately.

What inflates a run: a composer whose live page has changed since the notes were written, a platform that needs a repair pass after the source diff, and any gate waiting on your answer.

## If something goes wrong

**`claude` is not recognized after installing it.** Close the terminal and open a new one. Installers add to the path for new windows only.

**The agent does not react to a skill name.** It was installed after the agent started — restart it. If it still does not, check the folder listing from [Part 2](#part-2--install-the-skills).

**The agent says the browser tools need authentication.** The bridge is configured and not connected. Open the status page from step 3.2 in the intended browser: `No clients are currently connected` confirms the running server is paired to a different browser. Check `--browser` first.

**A server starts, answers, and never completes a tool call.** Same cause. Its relay page opened in the default browser, which holds a different token.

**Tabs list shows only `about:blank`.** You are on a spawned clean browser with none of your sessions. The extension is not attached.

**Tabs list shows only `connect.html`.** Normal. That is the bridge's own relay page. Never touch that tab; the run opens its own.

**The token changed.** The status page has a regenerate control. After regenerating, the configuration holding the old token is stale until you update it — `claude mcp remove playwright` then add it again — and restart.

**A platform asks for a login or shows a captcha mid-run.** The run stops there and hands the browser to you. Sign in yourself in that window, then tell the agent to continue. It will never do that part for you.

**The graphics skill goes looking for an image service.** It should not: the agent draws the pictures itself, and there is nothing to connect. A run that stops to hunt for a generator has misread the skill — say so and ask it to draw the set. The one thing it does need is something that turns its drawings into PNG files; without that it still hands over the drawings and says they were not converted.

**A post published with wrong formatting.** The publisher diffs every published post against its source file and repairs it — by editing where the platform allows, by delete-and-republish only within 5 minutes and only with no engagement, and by telling you plainly where the platform allows neither. If you find one it missed, say so: it reopens the audit rather than patching the single line you named.

**You want to stop everything.** Esc. The ledger records what already published, so a later run resumes rather than repeats.

## What the publisher will never do

- Type a password, drive a login, or fill a 2FA prompt.
- Solve or click through a captcha or bot challenge.
- Call a platform's API — not to publish, not to count posts, not to settle whether something exists. Everything happens the way a person does it, by looking at the page and clicking on it.
- Delete or edit a published post except on your explicit, per-item request.
- Post to more than one account per platform, or operate accounts at a scale a platform prohibits.

The pacing is part of the same contract: platforms rate-limit and flag rapid scripted bursts even on legitimate accounts, and the spacing rules exist to keep normal use inside a normal envelope.
