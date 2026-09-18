---
name: awesome-content-image-adapter
description: "Adapts one finished image into the frame every platform shows it in, one file per platform slug, named so a post and its picture sit side by side. The platform list and each surface's frame shape come from awesome-content-campaign's references/platforms.md, so no file here restates them. Runs alone — a source image in, a folder of platform-ready PNGs out, opened on the machine — or as the third step of a content run, straight after the picture the user picked is handed over. The source artwork is preserved: nothing is regenerated, redrawn, restyled or sent to an image service. Use when asked to resize an image for social platforms, to make cross-platform post images, 'адаптируй картинку под платформы', or whenever a post set needs its pictures in each platform's own frame. Do not use to design or generate artwork (awesome-content-graphics), to write the posts (awesome-content-repurpose), or to publish them (awesome-content-publisher)."
license: MIT
metadata:
  author: Khasky
  tags: ["content", "images", "social-media", "resize", "platforms"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-image-adapter"
---

# Content Image Adapter

One picture, every platform's frame. The artwork does not change: no regeneration, no redraw, no restyle, no image service. What changes is the shape around it, and how the picture meets the edges of that shape.

The platform list is not here. It is the canonical table in `awesome-content-campaign/references/platforms.md`, which is the single source of the vocabulary, and its `Image` column gives each surface's frame shape. This skill reads both and adds nothing to them; a platform that appears here and not there is a platform that does not exist.

Bundled file (load on demand):

- `references/geometry.md` — each frame shape's pixel target, how a picture is fitted into it, and what the result has to satisfy before it ships.

## Two modes, and the mode is not asked

**Alone.** The user hands over an image and asks for platform variants. The set is written into a new folder under the session's temporary area, the folder is opened on the machine, and the absolute path and the file count are reported.

**In a chain.** `awesome-content-repurpose` has written the posts and the picture is approved — generated and picked through `awesome-content-graphics`, or handed over by the user as a path or a URL at the same question. This skill is the third step and it runs without being asked again: the approved file goes in, and one PNG per platform lands *beside the post files*, so the folder reads

```
bastyon.md      bastyon.png
facebook-wall.md  facebook-wall.png
linkedin.md     linkedin.png
...
```

The name is the platform slug, verbatim from the canonical table, so a post and its picture are one glance apart and the publisher resolves the path with no mapping.

The mode is decided by where the call came from, never by a question: a caller passing a posts folder and an approved image is the chain, anything else is the standalone run.

## Which platforms get a file

**In a chain, the posts folder is the list.** Every `<slug>.md` already written there is a platform this set actually targets, and it gets `<slug>.png` beside it. A set written for nine platforms gets nine pictures, not forty-four, because the other thirty-five were never part of this run. The canonical table is still what says which shape each of those slugs takes, and which of them takes no attachment at all.

**Standalone, the table is the list.** Every row whose `Image` column names a shape, one file each, named `<slug>.png`.

Either way, a row whose `Image` column reads `none` gets no file — the surface takes no attachment, and a picture nobody can attach is litter in the folder the user is about to read. Say which slugs were skipped and why, rather than leaving the count unexplained.

A row the table marks as taking images by URL only still gets its file: the picture is hosted and linked rather than uploaded, and the file is what gets hosted.

A post file naming a platform the table does not carry is a defect in the post set, reported rather than guessed at — the table is the vocabulary and a slug outside it has no frame to be fitted into.

## The run

1. **Resolve one source image.** A local path or a URL, PNG, JPEG, WebP, BMP or TIFF; a URL is downloaded first and the run says what it saved and from where. Several candidates and no instruction → ask which, once. In the chain there is no ambiguity: the approved file is the one the caller handed over.
2. **Take the list.** In a chain, the `<slug>.md` files in the posts folder; standalone, the canonical table's rows. Either way the shape comes from that table's `Image` column, read at run time: never a list typed out here or remembered from a previous run, because the table moves and a copy does not.
3. **Apply the orientation the file declares** before anything is measured. An EXIF rotation ignored here turns every output on its side.
4. **Fit the picture into each shape** by the rules in `references/geometry.md`, and write RGB PNG.
5. **Verify** what the geometry reference says to verify, then report: the absolute folder, the file count, the slugs skipped and why.

Standalone runs open the folder at the end. Where the environment is headless or remote and nothing can be opened, say so and give the absolute path instead of claiming a window appeared.

## What it writes, and what it never writes

The folder holds the platform files and nothing else: no manifest, no master copy, no thumbnails, no archive, no README. In the chain the post files are already there and the pictures join them; nothing existing is moved, renamed or overwritten, and a name that is already taken is reported before anything is written.

The source file is never modified in place, and the set is never written into the folder the run was invoked from unless that folder is the posts folder of the chain.

## Tooling

This skill ships no program. The agent writes whatever fits the machine it is on — a few lines against an imaging library, a command-line tool that is already installed — and says which it used.

Whatever it writes: check the tool answers before promising the set, and where nothing suitable is installed, say so and hand back nothing rather than a half-written folder. Never add an imaging dependency to the user's project to do this; an isolated environment or a tool that is already there is the whole choice.

## Verification

The report states: the source file and its pixel size; where the platform list came from, the posts folder or the table; the number of platform files written and the folder they are in; every slug skipped with the reason from the table; the shapes used and how many files each carried; whether the folder was opened or could not be; and the tool the run used.

A file count that does not match its own list — the post files in a chain, the table's rows standalone — is reported as a mismatch, never rounded off. A check that could not run is named as not run.

## Anti-patterns

- Restating the platform list, or any part of it, inside this skill. The table is one file and this one reads it.
- Regenerating, redrawing, upscaling with a model, or "improving" the source. The picture the user approved is the picture that ships.
- Writing a file for a platform that takes no attachment.
- Producing one size and letting the platform crop. That is the crop this skill exists to make deliberate.
- A portrait surface served by a centre-cropped landscape, so the subject loses its head and its feet.
- Leaving a manifest, a master copy or a zip beside the platform files.
- Asking the user which mode to run in when the caller already said, or asking again for a picture the previous step just approved.
- Writing forty-four files beside a post set of nine. The folder is the list in a chain.
- Claiming the folder opened where nothing could open it.
