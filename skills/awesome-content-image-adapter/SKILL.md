---
name: awesome-content-image-adapter
description: "Adapts one finished image into three pictures, one per post form (short, regular, long), each in the frame most of that form's platforms show an image in, named so a post and its picture sit side by side. The platforms of each form come from the post files' own platforms lists, or from the default groups in awesome-content-repurpose/references/forms.md, and each platform's frame shape from awesome-content-campaign/references/platforms.md, so no file here restates either. Runs alone, a source image in and three PNGs out, or right after the user picks the picture in a content run. The source artwork is preserved: nothing is regenerated, redrawn, restyled or sent to an image service. Use when asked to resize an image for social platforms, to make post images for the short, regular and long forms, or 'адаптируй картинку под платформы'. Do not use to design or generate artwork (awesome-content-graphics), to write the posts (awesome-content-repurpose), or to publish them (awesome-content-publisher)."
license: MIT
compatibility: "Requires a local way to write RGB PNG files at exact pixel sizes. Nothing is uploaded and no image service is called."
metadata:
  author: Khasky
  tags: ["content", "images", "social-media", "resize", "platforms"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-content-image-adapter"
---

# Content Image Adapter

One picture, three frames. The artwork does not change: no regeneration, no redraw, no restyle, no image service. What changes is the shape around it, and how the picture meets the edges of that shape.

A post set has three forms, short, regular and long, and each form publishes to a group of platforms. One picture per form serves the whole group, framed in the shape most of that group uses. A platform whose own frame differs gets the form's picture and crops it the way it crops any image, which is the price of three files instead of forty.

Nothing platform-specific lives here. Each platform's frame shape is the `Image` column of the canonical table in `awesome-content-campaign/references/platforms.md`. The default groups are in `awesome-content-repurpose/references/forms.md`. This skill reads both and adds nothing to them; with a file absent, what it would have said is asked of the user rather than guessed.

Bundled file (load on demand):

- `references/geometry.md` - each frame shape's pixel target, how a picture is fitted into it, and what the result has to satisfy before it ships. Read it before fitting the first picture, once the three frames are known.

## Two modes, and the mode is not asked

**Alone.** The user hands over an image and asks for post images. Three files are written into a new folder under the session's temporary area, `short.png`, `regular.png` and `long.png`. The folder is opened on the machine, and the absolute path is reported.

**In a chain.** `awesome-content-repurpose` has written the three post files and the picture is approved, generated and picked through `awesome-content-graphics` or handed over by the user. This skill runs without being asked again: the approved file goes in, and one PNG per post file lands beside it, sharing the file's name:

```
1-short.md     1-short.png
2-regular.md   2-regular.png
3-long.md      3-long.png
```

A post file renamed by `awesome-content-campaign` keeps the same pairing: the picture takes whatever name the post file carries, with `.png`. The publisher then resolves the path with no mapping.

The mode is decided by where the call came from, never by a question: a caller passing a posts folder and an approved image is the chain, anything else is the standalone run.

## Which frame each form gets

1. **Take the form's platforms.** In a chain, the `platforms` list in each post file's frontmatter. Standalone, the default groups in `awesome-content-repurpose/references/forms.md`, narrowed to any platforms the user named.
2. **Look up each platform's shape** in the `Image` column of the canonical table, at run time. A platform whose column reads `none` is left out of the count, since it takes no attachment.
3. **Take the shape most of them use.** On a tie, take the shape the tied group's media-required platforms use; still tied, take the widest of the tied shapes, since a landscape source loses least there.
4. **Report the vote** per form: the shape chosen, how many platforms use it, and which platforms will see a different frame.

With the default groups all three forms land on 16:9. The vote is still run every time, because a narrowed `platforms` list changes it: a short form sent only to `instagram` and `pinterest` is a portrait form.

A form whose platforms all read `none` gets no picture, and the report says why. A slug the table does not carry is a defect in the post file, reported rather than guessed at.

## The run

1. **Resolve one source image.** A local path or a URL, PNG, JPEG, WebP, BMP or TIFF. A URL is downloaded first, and the run says what it saved and from where. Several candidates and no instruction: ask which, once. In the chain there is no ambiguity, since the approved file is the one the caller handed over.
2. **Decide the three frames** as above.
3. **Apply the orientation the file declares** before anything is measured. An EXIF rotation ignored here turns every output on its side.
4. **Fit the picture into each frame** by the rules in `references/geometry.md`, and write RGB PNG. Two forms that land on the same shape get two files with identical pixels: each post file keeps its own picture.
5. **Verify** what the geometry reference says to verify, then report.

Standalone runs open the folder at the end. Where the environment is headless or remote and nothing can be opened, say so and give the absolute path instead of claiming a window appeared.

## What it writes, and what it never writes

Three PNGs, or fewer when a form takes no picture, and nothing else: no manifest, no master copy, no thumbnails, no archive, no README. In the chain the post files are already there and the pictures join them. Nothing existing is moved, renamed or overwritten, and a name that is already taken is reported before anything is written.

The source file is never modified in place, and the set is never written into the folder the run was invoked from unless that folder is the posts folder of the chain.

## Tooling

This skill ships no program. The agent writes whatever fits the machine it is on, a few lines against an imaging library or a command-line tool that is already installed, and says which it used.

Whatever it writes: check the tool answers before promising the set, and where nothing suitable is installed, say so and hand back nothing rather than a half-written folder. Never add an imaging dependency to the user's project to do this; an isolated environment or a tool that is already there is the whole choice.

## Verification

The report states: the source file and its pixel size; where each form's platforms came from, the post files or the default groups; per form, the shape chosen with its vote and the platforms that will see a different frame; the files written and the folder they are in; any form skipped and why; whether the folder was opened; and the tool the run used.

A file count that does not match the forms that take a picture is reported as a mismatch, never rounded off. A check that could not run is named as not run.

## Anti-patterns

- Writing one picture per platform. The forms are the unit, and a folder of forty pictures beside three posts is litter.
- Restating the platform list, the groups or any frame shape inside this skill. Two files naming the same thing is how they drift apart.
- Picking the frame by preference, or by the first platform in the list, instead of by the vote.
- Regenerating, redrawing, upscaling with a model, or improving the source. The picture the user approved is the picture that ships.
- A portrait frame served by a center-cropped landscape, so the subject loses its head and its feet.
- Leaving a manifest, a master copy or a zip beside the pictures.
- Asking which mode to run in when the caller already said, or asking again for a picture the previous step just approved.
- Naming a picture after its form when the post file beside it carries a different name.
- Claiming the folder opened where nothing could open it.
