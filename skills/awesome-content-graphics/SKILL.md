---
name: awesome-content-graphics
description: "Draws the image a post ships with and picks one with the user. The agent itself composes every picture — no image service, no MCP generator, no key, nothing uploaded, and no template either. A reference goes in: text, images, a URL, or several of them, read for what the picture is actually about before anything is drawn. The user names the count: 10, 20, 50 or 100. The set opens as a folder and the user answers with a number or a name; another round rebuilds the set from different ideas rather than shaking the same one. The pick is saved into a folder of its own and that folder is opened. Use when asked to make an image or graphic for a post or campaign, 'сделай картинку для поста', or whenever awesome-content-campaign or awesome-content-repurpose reach a platform that needs media. Do not use to fit a finished picture to each platform's frame (awesome-content-image-adapter), or to write the posts themselves."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "graphics", "social-media", "image-generation", "design"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-graphics"
---

# Content Graphics

One picture for a post, chosen out of a set the user looked at.

**The agent running this skill is what draws them.** Not a service, not an MCP server, not a generator installed on the machine: the model reads the material, decides what each picture is, and composes it itself — one at a time, from nothing, in whatever markup it can emit. A rasteriser turns that markup into a PNG; a rasteriser is not a generator and it invents nothing.

Nothing here is a template either. There is no layout catalogue, no palette pool and no geometry gate — the previous version had all three, and a set built from them was the catalogue looked at a hundred times. Every picture in a round is composed for that round.

Nothing is fetched, nothing is uploaded, no key is needed and none is looked for.

Bundled file (load on demand):

- `references/generation.md` — turning a reference into ideas that differ, composing a hundred that stay different, what a second round has to change, and what to check in what was drawn.

## The five steps

```
1. Take the reference        → text, images, a URL, or several; read for the subject
2. Ask the count             → 10 · 20 · 50 · 100
3. Generate and open         → the whole set in one folder, opened on the machine
4. Take the answer           → a number or a name, or another round on different ideas
5. Save the pick apart       → its own folder, opened, and the run stops
```

Step 4 loops as many times as the user wants. Nothing else loops, and no step runs twice for tidiness.

## Step 1 — The reference, and what it is a picture of

Whatever the user hands over, in any mixture: pasted text, an article, a file, one or more images, a URL, a repository note. A URL is fetched; an image is looked at rather than guessed from its filename; a file is read.

Then, before anything is drawn, say what the picture is *about* — in one sentence, and out loud where the user can correct it. A set of a hundred built on the wrong subject is a hundred wrong pictures, and the sentence costs one line.

What the reading produces:

- **The subject.** The thing a viewer should recognise. Concrete beats abstract: a subject nobody can picture produces a hundred pictures of nothing.
- **The register.** What the material sounds like — plain, technical, editorial, playful — because that is what decides whether the set is photographic, illustrated, graphic or something else.
- **What the picture may not claim.** Numbers, logos, named products and real people that the material does not support. It is easy to draw a convincing chart out of nothing; the boundary is written down here so no picture in the set carries one.
- **The ideas.** Several genuinely different ways to picture the subject, not several wordings of one. `references/generation.md` has the method and the test for whether two ideas are actually two.

Where the run was started by a post skill, the material arrives with it and this step reads that instead of asking.

## Step 2 — The count, in one screen

One question, four options, asked once and never split across rounds:

```
10 · 20 · 50 · 100
```

Say in one line that the number is not final — another round is one answer away — because that changes how people answer.

The aspect ratio rides in the same screen where the caller has not already fixed it. A post skill passes one; a standalone run asks, and the default is what the material implies rather than a house habit. Per-platform frames are not this skill's job: `awesome-content-image-adapter` fits the picked image to every platform afterwards, so what is wanted here is one good ratio, not eleven.

## Step 3 — Generate, then open the folder

Compose each picture and save it. One per idea, the ideas coming from `references/generation.md`, written out as markup and rasterised to PNG at the ratio agreed in step 2. Every image of the round lands in one folder under the session's temporary area, numbered so the user can answer with a number, and the folder is opened on the machine. The absolute path goes in the message too, because a window that did not open leaves the user with nothing to look at.

**There is nothing to look for before starting.** No generator to discover, no MCP server to query, no key to find, no port to probe. A run that goes hunting for an external image service has misread this skill, and it stops the work for a dependency the skill does not have. The one thing worth checking is a rasteriser — something on the machine that turns markup into a PNG — and where there is none, the markup files still ship and the run says the pictures were not rasterised.

**Never read a credentials file while working out what is available.** No `~/.*/settings.json`, no `.env`, no keyring, no shell profile, no `printenv`. Their contents reach the session transcript and the model provider, and a probe that leaks a token has done more harm than a missing feature ever could. A capability this skill needs is one it can see without opening a secret.

A round is not finished until the folder holds the count that was asked for. Short is reported with the number, and the shortfall is closed or reported — never rounded off.

## Step 4 — The answer, or another round

One question: **which number or name, or another round?**

- A number or a name → step 5.
- Another round → the same count again, built from **different ideas**, and what comes back is a different set rather than the same one shaken. Nothing random is available to lean on here: a second round is different because it is composed differently, and `references/generation.md` says which axes have to move. Each round goes in its own folder and the earlier rounds stay on disk, because a user who liked something in round one may want it back.
- Nothing liked twice running → stop guessing and ask for a reference: a picture, a site, a style whose feeling they want, and read the next round off that rather than trying again blind.

The run never picks on the user's behalf, and never proposes a favourite while the question is open.

## Step 5 — Save the pick, and stop

The picked image is copied into **its own folder** under the session's temporary area, separate from the folder the round was generated into, and that folder is opened. One folder to choose from, one folder holding what was chosen: a user going back to it later should not have to remember which of a hundred files was the one.

Then: the alt text in the material's own language, saying what the picture shows and what it means, no date and no stamp; the absolute path of the pick and of its folder; and, under a post skill, the handover — the pick is what `awesome-content-image-adapter` takes next, and that step is the caller's to start.

The run does not carry on into the caller's own work.

## Where the run writes

Never into the folder it was invoked from. A hundred images appearing in the user's project is a change nobody asked for, and in a repository it lands in `git status` as work they now have to clean up.

With no output path given, make fresh folders of the run's own under the session's scratch or temporary area — one per round, one for the pick — and print the absolute path the first time something is written to each. An output path the caller named is honoured as given.

## Hard rules

| # | Rule |
| --- | --- |
| 1 | The set is the count the user named. Short is reported with the number, never quietly delivered |
| 2 | Every image of a round is a different picture. Two that differ only in a colour are one picture delivered twice, and the round says so rather than counting both |
| 3 | A second round is a second set. The same ideas drawn again is the first round with different noise, and the user asked for something else |
| 4 | No number, logo, product name or real person the material does not support reaches a picture |
| 5 | Text inside a picture is checked by reading it back off the rendered file, not off the markup that was meant to produce it |
| 6 | The user picks. The run never chooses, never proposes a favourite, and never treats silence as an answer |
| 7 | No credentials file is opened, and no key, token or environment secret is read or printed, for any reason |
| 8 | The pick lives in its own folder, apart from the rounds |

## Verification

The report states: what the reference was and what could not be read; the one-sentence subject and who confirmed it; the count asked for and the count delivered, per round; how many rounds ran and what changed between them; which image the user picked and out of how many; the alt text; and the absolute paths of every round folder and of the pick's folder.

No number in the report is one a pass did not produce. A check that could not run is named as not run, never folded into a pass.

## Anti-patterns

- Drawing before saying what the picture is about, and finding out at a hundred images that it was about the wrong thing.
- A hundred pictures that are one picture restyled. The count is a promise of variety, not of file count.
- A second round built from the first round's ideas, handed over as new work.
- A number in a picture that no fact supports, or a chart invented to fill a space.
- Shipping a picture whose text was never read off the rendered file.
- Picking for the user, or reading silence as approval.
- Stopping the run to hunt for an external generator. The agent is the generator.
- Opening a settings file, an environment or a keyring to find out what is available, and printing a token into the transcript on the way.
- Asking the count in one round and the ratio in another, when both fit one screen.
- Writing the set into the folder the run was invoked from.
- Keeping the pick in the same folder as the ninety-nine it beat.
