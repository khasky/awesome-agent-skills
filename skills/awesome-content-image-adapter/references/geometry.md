# Geometry — the two frames, their pixel targets, and how the picture meets them

The `Picture` column of `awesome-content-campaign/references/platforms.md` says which of two pictures each platform takes. This file turns each picture into pixels and says how the source is fitted into it. Nothing here names a platform: the table does that, and two files naming the same thing is how they drift apart.

## The targets

| Picture | Shape | Target | Serves |
| --- | --- | --- | --- |
| `horizontal.png` | `16:9` | 1600 x 900 | the feeds that show an image wide or at its own ratio; every smaller wide slot downscales from it cleanly |
| `vertical.png` | `9:16` | 900 x 1600 | the feeds that give a tall or square image more room; the same frame turned on its side |

The vertical picture serves a square, a 4:5 or a 2:3 slot as well as a full-height one, and that follows from how it is built. The sharp source sits across the full 900-pixel width, centered, and the blurred continuation fills the rest. A platform that crops the vertical to its own shorter frame crops from the top and bottom, removes continuation, and keeps the sharp source whole: a 1:1 crop keeps a 900 x 900 window, a 4:5 crop 900 x 1125, and a 16:9 source at full width is 900 x 506, inside both. The one thing that breaks this is a sharp layer taller than the platform's crop window, which only a portrait source produces, and the check for it is below.

## Fitting a picture into a frame

Two treatments, and which one applies is decided by the source's proportion against the frame's, never by preference.

**The source already has the frame's orientation** — a landscape source against the horizontal target, a source of 9:16 or taller against the vertical. Cover the frame and crop what falls outside, centered. The crop is minimal by construction: the source is scaled until the frame is covered and no further, so the picture loses the least it can.

**Otherwise** — a landscape, square or moderately portrait source against the vertical target, a portrait or square source against the horizontal. The whole source is kept, scaled to the frame's full width for the vertical or its full height for the horizontal, and centered. The space left over is filled by a continuation of the same picture: the source scaled to cover the frame, blurred heavily and darkened, with the sharp copy sitting on top of it. Nothing is invented, nothing is stretched, and the frame is never padded with a flat block of color.

A separation between the two layers keeps the sharp copy from looking pasted on: a soft shadow under it, and the cool edge light the source already carries where it carries one. It is one treatment applied the same way every time, not a per-platform decision.

**Never** stretch the source to the frame's aspect, never upscale beyond the source's own pixels where the target is smaller than the source, and never crop the vertical out of the middle of a landscape source — that is the crop that removes the subject's sides, and it is the reason the continuation exists.

## Before it ships

- Every written file is RGB PNG at exactly its target, to the pixel.
- The file count equals the number of orientations the platforms take: two, or one where no platform takes the other.
- The source is untouched on disk, and its own pixel size is reported next to the count.
- A landscape source in the horizontal picture has lost only what the cover crop removes: hold it beside the source and the subject is in the same place, at the same proportion.
- The vertical picture shows the whole source sharp, over its own blurred continuation, with nothing stretched, and the sharp layer is no taller than the frame's width, so a square crop keeps it whole. A landscape or square source always passes; a portrait source that fails is reported with the platforms whose crop will cut it.
- EXIF orientation was applied before any measurement. A source that declares a rotation and renders upright in a viewer will render on its side without this, and every file in the set carries the fault.
