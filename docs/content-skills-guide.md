# Content skills: from a source to published posts

A step-by-step guide to the five `awesome-content-*` skills, written for someone who has never run them. It covers what each one does, what you need installed before the first run, how to set up the browser bridge the publisher needs, how to run each skill on its own, how to chain them, and how long a real run takes.

Russian version: [content-skills-guide.ru.md](content-skills-guide.ru.md).

## Contents

- [The five skills](#the-five-skills)
- [Prerequisites](#prerequisites)
- [Setting up the browser bridge](#setting-up-the-browser-bridge)
- [Running one skill at a time](#running-one-skill-at-a-time)
- [Running them as a chain](#running-them-as-a-chain)
- [What the run will ask you](#what-the-run-will-ask-you)
- [How long it takes](#how-long-it-takes)
- [Troubleshooting](#troubleshooting)
- [What the publisher will never do](#what-the-publisher-will-never-do)

## The five skills

| Skill | Input | Output |
| --- | --- | --- |
| [awesome-content-voice](../skills/awesome-content-voice) | Your existing posts, files, or an interview | One reusable voice profile file |
| [awesome-content-campaign](../skills/awesome-content-campaign) | A repo, a site, files — a product you want to talk about | A folder of dated post files, one per platform slot, plus a manifest |
| [awesome-content-repurpose](../skills/awesome-content-repurpose) | One existing text: a link, a file, pasted notes | The same folder format, no schedule |
| [awesome-content-graphics](../skills/awesome-content-graphics) | The facts a picture may claim | A set of rendered PNGs, made locally from HTML and CSS |
| [awesome-content-publisher](../skills/awesome-content-publisher) | A folder of post files | Published posts on your own accounts, plus a ledger |

`campaign` and `repurpose` both write the file format `publisher` reads. Pick `campaign` when you have product sources and want a schedule; pick `repurpose` when you have one article and want it in every platform's own register.

`voice` and `graphics` are optional inputs to the other three: the voice profile shapes how the posts sound, the graphics give them a picture.

## Prerequisites

### 1. An agent that supports Agent Skills

Claude Code, Claude.ai, OpenAI Codex, Gemini CLI, Cursor, GitHub Copilot, opencode, Amp, Windsurf, Antigravity. Any agent that reads the [Agent Skills](https://agentskills.io) format.

### 2. The skills installed

See [Install](../README.md#install) in the README. The short version is copying or symlinking the `skills/<name>` folders into your agent's skills directory.

### 3. A browser signed in to your accounts

Chrome, Edge or another Chromium build. Sign in, by hand, to every platform you plan to post to. The publisher never types a password, never fills a 2FA prompt and never clicks through a captcha — it drives the sessions you already have.

A second browser profile kept only for these accounts is a reasonable setup and the bridge supports it: one token per profile.

### 4. The Playwright MCP extension bridge

This is the part people miss. The publisher does not launch its own browser — it attaches to yours, so your logged-in sessions are the ones posting. That attachment is the Playwright MCP server running in `--extension` mode, paired with a browser extension.

Firefox and Safari are not supported in this mode.

## Setting up the browser bridge

Do this once per browser profile.

**Step 1 — install the extension.** Open [the Playwright extension listing](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm) in the browser you want driven and install it. Edge installs from the same Chrome Web Store listing. Source and notes: [microsoft/playwright, packages/extension](https://github.com/microsoft/playwright/tree/main/packages/extension).

**Step 2 — read the profile's token.** In that same browser, open:

```text
extension://mmlmfjhmonkocbjadbfplnigmagldckm/status.html
```

The page shows a pairing token and a regenerate control. The token authorizes a local process to attach to this browser profile. It is per profile: a second browser, or a second profile in the same browser, has its own.

**Step 3 — add the MCP server entry.** In your agent's MCP configuration, add one entry per browser you want available.

**One entry is enough.** A publishing run drives exactly one browser, and it has to be the one where you are already signed in to the platforms — that is prerequisite 3 above, and no flag substitutes for it. Add a second or third entry only if you keep separate browsers for these accounts and want to pick between them at the start of a run; the publisher then asks which one before it touches anything.

Both the token and `--browser` matter, and the second one is the flag people forget:

```jsonc
// Keep only the entry (or entries) whose browser holds your logged-in accounts.
"playwright":        { "command": "npx",
                       "args": ["-y", "@playwright/mcp@latest", "--extension", "--browser", "chrome"],
                       "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Chrome profile's token>" } },
"playwright-edge":   { "command": "npx",
                       "args": ["-y", "@playwright/mcp@latest", "--extension", "--browser", "msedge"],
                       "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Edge profile's token>" } },
"playwright-canary": { "command": "npx",
                       "args": ["-y", "@playwright/mcp@latest", "--extension", "--browser", "chrome-canary"],
                       "env": { "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<that Canary profile's token>" } }
```

The name on the left is yours to choose — it is what the agent shows when it asks which bridge to use, so name it after the browser rather than after the skill.

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

One more flag worth knowing when a browser holds several profiles: `--profile-dir-name "Profile 1"` picks the profile directory to connect to. Without it the server takes the last used profile that has the extension installed, which is usually right and is worth pinning explicitly when the accounts live in a profile you do not browse with daily.

Without `--browser`, the server opens its relay page in the machine's *default* browser. With two entries that both default, the one whose token belongs to the other browser waits forever: it starts cleanly, listens, answers `initialize`, and never answers a single tool call. That symptom has exactly one cause and this is it.

**Step 4 — restart the agent** so it picks up the configuration. A token set but not restarted looks identical to a token that did not work.

**Step 5 — verify.** Ask the agent to list browser tabs. A lone `connect.html` is the healthy idle state: the bridge is attached and you simply have no other tab open. A lone `about:blank` means you are on a spawned clean browser with none of your sessions — that is the failure case.

When two bridges are configured, the publisher asks which one to use before it touches anything, then probes the engine and the signed-in identity and states both back to you. Confirm before you let it start.

## Running one skill at a time

Each skill triggers on plain intent. Naming it makes the choice deterministic.

### Voice profile

```text
Use awesome-content-voice: build my voice profile from https://myblog.example and the posts in ./writing/
```

Produces one profile file. Written once, reused by every later run.

### Writing posts from product sources

```text
Use awesome-content-campaign on this repo and https://myproduct.example — two weeks, the platforms I actually have accounts on
```

You will be asked which platforms, over what period, and in which language. The output is one dated file per post plus a manifest, in a folder it names.

### Writing posts from one existing article

```text
Use awesome-content-repurpose on https://example.com/my-article — every platform in the table
```

Same output format, no schedule. This is the one to use when the source is a single text.

### Making the picture

```text
Use awesome-content-graphics for this campaign: vertical 1080x1350, 100 renders
```

You will be asked for the look, the set size, the headline policy and the ratio. Everything renders locally from HTML and CSS — no image service, no API key, nothing uploaded. You then pick one render by its number.

### Publishing

```text
Use awesome-content-publisher on ./my-campaign-folder
```

Before anything is posted you get: a bridge check, a source scan that hard-stops on any malformed file, a login check per platform, and a run plan you have to approve. Add `--dry-run` to see the whole plan with nothing published.

## Running them as a chain

The usual order, and what to hand over at each step:

1. **`awesome-content-voice`** once, ever. Keep the profile file.
2. **`awesome-content-campaign`** or **`awesome-content-repurpose`** — point it at the source and the voice profile. Read the drafts. This is the moment to fix wording; every later stage treats these files as the author's words and will not rewrite them.
3. **`awesome-content-graphics`** — it takes the campaign's facts and gives back a set. Pick one render.
4. Add the picked image to the post files (the writing skill does this when it runs after graphics; otherwise name it in the frontmatter).
5. **`awesome-content-publisher`** — point it at the folder. Approve the run plan. Let it work.

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

## How long it takes

Measured on a real 25-platform run, from the publisher's own ledger timestamps. The figure is the full cycle per platform: open the composer, fill it, attach the image, submit, read back the permalink, diff it against the source file, write the ledger.

| Composer type | Platforms | Per post |
| --- | --- | --- |
| Plain text box | x, bluesky, threads, mastodon, truthsocial, minds, peerlist, lemmy, quora, bastyon | 2–6 min |
| Markdown field | devto, wonderful-dev, write-as | 2–4 min |
| Caption with a required image | instagram, pixelfed, pinterest | 4–8 min |
| Rich editor, short post | tumblr, daily-dev, patreon, ko-fi, buymeacoffee | 3–9 min |
| Rich editor, long-form | medium, hashnode, substack, hackernoon, teletype | 4–9 min |

Whole-run figures from the same ledger:

- **15 platforms in 73 minutes** of uninterrupted work — about 5 minutes each, which is the number to plan with.
- **The first platform of a session costs more**: bridge gate, login preflights and the source scan land on it. Budget 15–20 minutes before the first post goes out.
- **Graphics are separate**: a 100-render set with its geometry gate and duplicate sweep is its own job, not part of the publishing hour.
- **Different platforms have no wait between them.** Two posts to the *same* platform stay at least 2 hours apart; different platforms follow each other immediately.

What inflates a run: a composer whose live DOM has drifted from the notes, a platform that needs a repair pass after the source diff, and any gate waiting on your answer.

## Troubleshooting

**The agent says the browser tools need authentication.** The bridge is configured and not connected. Open the status page in the intended browser: `No clients are currently connected` confirms the running server is paired to a different browser. Check `--browser` first.

**A server starts, answers, and never completes a tool call.** Same cause. Its relay page opened in the default browser, which holds a different token.

**Tabs list shows only `about:blank`.** You are on a spawned clean browser with none of your sessions. The extension is not attached.

**Tabs list shows only `connect.html`.** Normal. That is the bridge's own relay page. Never touch that tab; the run opens its own.

**The token changed.** The status page has a regenerate control. After regenerating, the config holding the old token is stale until you update it and restart.

**A post published with wrong formatting.** The publisher diffs every published post against its source file and repairs it — by editing where the platform allows, by delete-and-republish only within 5 minutes and only with no engagement, and by telling you plainly where the platform allows neither. If you find one it missed, say so: it reopens the audit rather than patching the single line you named.

## What the publisher will never do

- Type a password, drive a login, or fill a 2FA prompt.
- Solve or click through a captcha or bot challenge.
- Call a platform's API — not to publish, not to count posts, not to settle whether something exists. Everything happens the way a person does it, by looking at the page and clicking on it.
- Delete or edit a published post except on your explicit, per-item request.
- Post to more than one account per platform, or operate accounts at a scale a platform prohibits.

The pacing is part of the same contract: platforms rate-limit and flag rapid scripted bursts even on legitimate accounts, and the spacing rules exist to keep normal use inside a normal envelope.
