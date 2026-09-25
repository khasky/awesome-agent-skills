---
name: awesome-content-image-adapter
description: "Adapts one finished image into a horizontal 16:9 and a vertical 9:16 version for social platforms without redrawing the artwork. Use when asked to resize a picture for posts, or 'адаптируй картинку под платформы'. Do not use to draw or generate images, which no skill here does."
license: MIT
compatibility: "Requires a local way to write RGB PNG files at exact pixel sizes. Nothing is uploaded and no image service is called."
metadata:
  author: Khasky
  tags: ["content", "images", "social-media", "resize", "platforms"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-image-adapter"
---

# Content Image Adapter

One picture, two frames. The artwork does not change: no regeneration, no redraw, no restyle, no image service. What changes is the shape around it, and how the picture meets the edges of that shape.

The horizontal picture serves the feeds that show an image wide or at its own ratio, the vertical one serves the feeds that give a tall or square image more room and crop it toward the middle, and a platform whose frame differs from both crops its picture the way it crops any image. Two files cover every surface, where one file per form produced three identical pictures and one file per platform produced forty.

Nothing platform-specific lives here. Which picture each platform takes is the `Picture` column of the canonical table in `awesome-content-campaign/references/platforms.md`, with the research behind every row in that file's *The picture each platform takes*. This skill reads the column and adds nothing to it; with that file absent, which platforms need the vertical picture is asked of the user rather than guessed.

Bundled file (load on demand):

- `references/geometry.md` - the two pixel targets, how a picture is fitted into each, why one vertical serves square, 4:5 and full-height slots alike, and what the result has to satisfy before it ships. Read it before fitting the picture.

## Two modes, and the mode is not asked

**Alone.** The user hands over an image and asks for post images. Two files are written into a new folder under the session's temporary area, `horizontal.png` and `vertical.png`. The folder is opened on the machine, and the absolute path is reported.

**In a chain.** `awesome-content-repurpose` has written the post files and the user has handed over a picture, or a still has been cut from their video. This skill runs without being asked again: the approved file goes in, and the two pictures land beside the post files:

```
1-short.md     horizontal.png
2-regular.md   vertical.png
3-long.md
```

Every post file names the pictures its platforms need in `attachments`, each entry marked with its `frame`, and the publisher gives each platform the one its `Picture` column names. The pictures carry no post's name, because every post shares them.

The mode is decided by where the call came from, never by a question: a caller passing a posts folder and an approved image is the chain, anything else is the standalone run.

## Which platform takes which picture

Each platform takes the picture its `Picture` column names: `horizontal`, `vertical`, or `none` for a platform that takes neither. The column is never recomputed here from a guess about the platform's frame; a row that looks wrong is reported, and fixed in that file with its evidence.

In a chain, the platforms are the `platforms` lists of the post files. A picture no listed platform takes is not written: a set published only to wide surfaces gets `horizontal.png` alone, and the report says why the second file is missing. Standalone, both are written.

Report the split: which platforms take each picture. A slug the table does not carry is a defect in the post file, reported rather than guessed at.

## The run

1. **Resolve one source image.** A local path or a URL, PNG, JPEG, WebP, BMP or TIFF. A URL is downloaded first, and the run says what it saved and from where. Several candidates and no instruction: ask which, once. In the chain there is no ambiguity, since the approved file is the one the caller handed over.
2. **Sort the platforms** into horizontal and vertical as above, reading the table at run time.
3. **Apply the orientation the file declares** before anything is measured. An EXIF rotation ignored here turns every output on its side.
4. **Fit the picture into each frame** by the rules in `references/geometry.md`, and write RGB PNG.
5. **Verify** what the geometry reference says to verify, then report.

Standalone runs open the folder at the end. Where the environment is headless or remote and nothing can be opened, say so and give the absolute path instead of claiming a window appeared.

## What it writes, and what it never writes

Two PNGs, or one when no platform takes the other, and nothing else: no manifest, no master copy, no thumbnails, no archive, no README, no per-form or per-platform copy. In the chain the post files are already there and the pictures join them. Nothing existing is moved, renamed or overwritten, and a name that is already taken is reported before anything is written.

The source file is never modified in place, and the set is never written into the folder the run was invoked from unless that folder is the posts folder of the chain.

## Tooling

This skill ships no program. The agent writes whatever fits the machine it is on, a few lines against an imaging library or a command-line tool that is already installed, and says which it used.

Whatever it writes: check the tool answers before promising the set, and where nothing suitable is installed, say so and hand back nothing rather than a half-written folder. Never add an imaging dependency to the user's project to do this; an isolated environment or a tool that is already there is the whole choice.

## Verification

The report states: the source file and its pixel size; where the platforms came from, the post files or the table; which platforms take each picture; the files written, with their pixel sizes, and the folder they are in; a picture not written and why; whether the folder was opened; and the tool the run used.

A file count that does not match the pictures the platforms need is reported as a mismatch, never rounded off. A check that could not run is named as not run.

## Anti-patterns

- Writing one picture per platform or per form. Two orientations cover every surface, and identical copies beside the posts are litter.
- Restating the platform list or any platform's picture inside this skill. Two files naming the same thing is how they drift apart.
- Serving a platform the other picture than the one its row names. The picture follows the platform's `Picture` column, never the post file it came from.
- Regenerating, redrawing, upscaling with a model, or improving the source. The picture the user approved is the picture that ships.
- A vertical frame served by a center-cropped landscape, so the subject loses its sides. The whole source stays in the frame.
- Leaving a manifest, a master copy or a zip beside the pictures.
- Asking which mode to run in when the caller already said, or asking again for a picture the previous step just handed over.
- Claiming the folder opened where nothing could open it.
