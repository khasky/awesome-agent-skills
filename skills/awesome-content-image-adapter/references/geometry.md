# Geometry — each frame shape, its pixel target, and how the picture meets it

The `Image` column of `awesome-content-campaign/references/platforms.md` names a shape per platform. This file turns a shape into pixels and says how the source is fitted into it. Nothing here names a platform: the table does that, and two files naming the same thing is how they drift apart.

## The targets

| Shape | Target | Why that size |
| --- | --- | --- |
| `16:9` | 1600 x 900 | the widest surface any of these shapes needs; every smaller 16:9 slot downscales from it cleanly |
| `1.91:1` | 1200 x 630 | the link-card frame, marginally wider than 16:9 and cropped differently because of it |
| `4:3` | 1200 x 900 | a card taller than the feed shapes and shorter than the portrait ones |
| `1:1` | 1080 x 1080 | the square slot |
| `4:5` | 1080 x 1350 | the tall feed slot |
| `2:3` | 1000 x 1500 | taller again, and the only shape where the subject usually sits in the upper half |
| `9:16` | 1080 x 1920 | full-height vertical |

One render per shape serves every form that lands on it. The files are still written one per post form, under the post file's own name, because a post and its picture sharing a name is what makes the folder readable.

## Fitting a picture into a shape

Two treatments, and which one applies is decided by the shape against the source, never by preference.

**The shape is as wide as the source or wider** — the landscape targets against a landscape source. Cover the frame and crop what falls outside, centered. The crop is minimal by construction: the source is scaled until the frame is covered and no further, so the picture loses the least it can.

**The shape is taller than the source** — the square, portrait and vertical targets against a landscape source. The whole source is kept, placed at its natural width, and the space above and below is filled by a continuation of the same picture: the source scaled to cover the frame, blurred heavily and darkened, with the sharp original sitting on top of it. Nothing is invented, nothing is stretched, and the frame is never padded with a flat block of color.

A separation between the two layers keeps the sharp copy from looking pasted on: a soft shadow under it, and the cool edge light the source already carries where it carries one. It is one treatment applied the same way every time, not a per-form decision.

**Never** stretch the source to the frame's aspect, never upscale beyond the source's own pixels where the target is smaller than the source, and never crop a portrait target out of the middle of a landscape source — that is the crop that removes the subject and it is the reason the second treatment exists.

## Before it ships

- Every written file is RGB PNG at exactly its shape's target, to the pixel.
- The file count equals the number of forms that take a picture.
- The source is untouched on disk, and its own pixel size is reported next to the count.
- A landscape source has lost only what the cover crop removes: hold one output beside the source and the subject is in the same place, at the same proportion.
- A tall output shows the whole source sharp, over its own blurred continuation, with nothing stretched.
- EXIF orientation was applied before any measurement. A source that declares a rotation and renders upright in a viewer will render on its side without this, and every file in the set carries the fault.
