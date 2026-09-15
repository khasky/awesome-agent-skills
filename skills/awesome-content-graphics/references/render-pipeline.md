# The render pipeline — the shipped toolchain, and how a run drives it

This skill ships code. It is the one place in this repository that does, and `AGENTS.md` argues the exception under *Text only*: the renderer is generated code the agent runs on its own machine against pages it wrote itself, and generating it again on every run was the largest single cost the skill had. One measured run spent about 45 minutes writing the toolchain and another hour and three quarters rediscovering defects an earlier run had already solved. Because it ships, this page names its modules and how they are invoked — the thing the *Text only* rule forbids everywhere else.

What a run still owns: the plan, the headlines, the photo queries, the reading of the sheets, and the pick. The toolchain owns the mechanics under them.

## The two files a run writes

- **`set.json`** in the output folder: `width`, `height`, `lang`, and `variants`, one object per canvas. The field table is in `references/visual-language.md` under *The set file*; the spread rules the rows have to satisfy are in `references/style-catalog.md`. This is the whole plan, and it is the only place a run's content enters the pipeline.
- **`queries.json`**, a flat `{slug: search phrase}` map for the stock photographs, written from the headline pool before the rows are planned.

Nothing else. A run that finds itself editing a file in `tools/` to fit its own set has put content where the plan belongs; the fix is a field in `set.json`, not a branch in the renderer.

## The modules

| Module | Owns |
| --- | --- |
| `config.mjs` | where the shared asset cache lives and which Chromium the run drives. `GRAPHICS_ASSETS` and `CHROME_PATH` override the defaults |
| `palettes.mjs` | the 43 proved schemes from `references/palettes.md`, as data |
| `assets.mjs` | reading fonts, icons and photographs out of the cache for embedding, and the grain tile rasterised once at build time |
| `fetch-assets.mjs` | one-time acquisition into the shared cache: faces per weight, Lucide icons, and several Openverse candidates per query with their licences |
| `photos.mjs` | resampling the candidates to a sane width and writing one sheet of them |
| `sheet.mjs` | the same sheet in pages of 24, which is what a real candidate set needs: one image of 48 photographs stalls the capture |
| `page.mjs` | the grounds, the headline block, and the fit that sizes type against the real face |
| `layouts.mjs` | one function per layout in the catalog, each emitting the data attributes the gate reads |
| `gate.mjs` | the measurement that runs inside the page, and the judgment that turns it into named findings |
| `build.mjs` | `set.json` into one self-contained page per row under `src/` |
| `render.mjs` | one browser for the pass, the row loop, the wait for the page's own fit, the gate, and the screenshot on a pass |
| `sweep.mjs` | the perceptual duplicate pass, the signature spread, the contact sheets, the gallery |

The canvas ratio is not a constant in the code: `build.mjs` and `render.mjs` set it from `set.json`, so the caller's ratio is the one that renders.

## Running it

```
node tools/fetch-assets.mjs queries.json     # once per machine, then never again
node tools/photos.mjs                        # resample the candidates, write photos/sheet.png
node tools/sheet.mjs                         # page the sheet when there are more than ~24
node tools/build.mjs  <out> [id,id,...]      # set.json -> src/*.html
node tools/render.mjs <out> [id,id,...]      # gate each page, screenshot the passes
node tools/sweep.mjs  <out>                  # duplicates, sheets, gallery
```

`build` and `render` take an optional comma-separated row list. Measured cold on a machine with an empty cache, asset acquisition for 10 faces, 26 icons and 8 photographs took 66 seconds; after that the cache is shared across runs and fetches nothing.

Outputs land beside `set.json`: `src/` for the pages, `NNN.png` per render, `report.json` with every measured field per page, `contact-sheet-N.png` in pages of 25, and `gallery.html`.

## The order of proof

1. **Probe by layout, not by kind.** One row for every layout the plan uses. A probe of 7 rows covering the 5 kinds passed clean, and every one of the 8 rounds of geometry fixes that followed came from a layout the probe had never rendered: the two-column lockup, the ring beside its caption, the duel, the stats card, the horizontal bars, the split photo. A probe of 27 rows, one per layout, measured 82 seconds. It replaces most of an hour.
2. **The geometry loop runs on the probe.** A layout fix is proved on the rows that use that layout. The set is not the place to discover that a column cannot fill its height.
3. **The full set renders once,** when the probe is clean. Measured on 100 pages of this catalog: 142 seconds to build and render, 66 more for the sweep, 4 contact sheets and the gallery. A clean plan reaches a finished set in about three and a half minutes.
4. **After that, a gate failure re-renders the rows that failed.**

What counts as a change that touches every page, and so earns a full pass: the canvas size, the safe margin, the shared fit, the palette pool, or a plan change that reorders the rows. A layout function, a figure's geometry, one row's headline and a rejected photo are all row-scoped. One run re-rendered all 100 pages thirteen times for fixes that touched between one and twelve rows.

Re-rendering is the cheap half of that waste, and knowing which half is which decides where to spend the discipline. Thirteen full passes are about half an hour of rendering; the same run spent an hour and three quarters, because the expensive part is the round, not the pass. Each round is a diagnosis: read the findings, work out which layout is wrong, change it, wait. The probe and the gate's coordinates are what remove rounds, and they matter more than the row list does.

## The gate reports a location, not a verdict

A checker that says a page failed and not where sends the run back to guessing, and guessing costs a full pass each time. `report.json` carries, per page, every field the gate measured, and the fields that can fail carry what a fix needs:

- the empty-square test returns the rectangle it found, not its side alone. Three rounds went on guessing where a 486-pixel square was.
- the span and fill tests return the extent, so the shortfall is arithmetic rather than a hunt.
- an overflow returns the element and the amount.
- the duplicate sweep returns the pair and the distance, not a count.

A new rule added to the gate is added to `report.json` in the same change, or the next run reads a number that is no longer the whole story.

## Traps the shipped code already answers

Each of these passed a markup review and failed on the render. They are listed because a change to `tools/` can undo any of them.

- **The line box is taller than the font size.** The fit measures the factor once per page against the real face. A model that assumes the font size underestimates the block, and then the fit picks a size whose rendered height overruns the band.
- **Every face the page can use is loaded before the fit runs, including the one an effect swaps in.** `document.fonts.ready` resolves against the loads already pending, and a headline block emitted empty has requested nothing. A serif effect that swaps the face after the fit measured a fallback produced lines a third too short on every page carrying it.
- **The measuring probe lives inside the element it measures and carries its class,** so an effect that changes the face is measured rather than guessed, and it is removed before the gate runs.
- **A value set `nowrap` paints outside its own box while its rect stays inside it.** The gate compares `scrollWidth` with `clientWidth` on every printed value and caption, whatever the overflow setting. Without it a contact sheet shows `205 da` under a clean gate.
- **A single backslash inside a template literal is an invalid escape and is dropped.** `C:\Windows\System32\sru` reaches the page as `C:WindowsSystem32sru`. Paths in emitted markup carry doubled separators.
- **Do not pipe a long step through `head` or `tail`.** The pipe closes, the process dies partway, and the failure is silent: one sweep died after writing the contact sheets and before the gallery, leaving a gallery that looked current and indexed a previous generation of renders.
- **Grain is rasterised once into a tiled PNG at build time** and never left as a live filter under a blend mode, and no grain goes on a photo canvas. Both wedge the capture.

## Geometry that already passes at 4:5

The arithmetic that satisfies the hard rules on 1080 by 1350 with a 4 percent margin. Not new rules — the numbers a layout change has to keep clearing.

- **The empty-square test measures against the canvas, margins included,** so a column's empty half joins the margin beside it and the two together clear the limit. A vertically centred column block passes when its own height is at least 0.41 of the canvas height; below that, either the block grows or the layout goes.
- **A subject at the subject scale in the top-left corner cannot pass at 4:5.** Whatever the headline does, the upper right holds an empty square over the limit. The layout that wanted it was dropped rather than shipped with a note.
- **Leading is a lever.** Word boundaries make the block height jump between line counts, so a band can sit in the gap between what 3 lines and 4 lines produce. Moving the gap between lines inside 0.12 to 0.34 em lands the block in the band without changing the type size, and keeps the rhythm even.
- **A value that fills its box is shrunk against its own client width,** not its container's, or it fits the container and still overflows itself.
- **On a bar figure the value rides inside its bar only where the bar is nearly full width,** and at the row edge otherwise. A value parked beside a short bar leaves the row's far half empty, and the empty-square test then fails for a reason that looks unrelated.
- **A narrow column cannot set an unbreakable long token large enough to fill its height.** Keep a headline carrying a 13-character identifier off the two-column layouts at plan time rather than discovering it at render time.
