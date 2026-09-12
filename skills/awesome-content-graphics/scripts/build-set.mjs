#!/usr/bin/env node
// Build the HTML sources of a set from set.json and the templates in scripts/templates/.
//
//   node scripts/build-set.mjs <run-folder> [--assets <dir>]
//
// <run>/set.json describes the set (see SKILL.md Phase 5); this writes <run>/src/<id>.html,
// one self-contained page per variant, fonts and icons inlined from the assets folder
// (default <run>/assets, falling back to the shared cache passed with --assets).
// Node 18+, no dependencies.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const T = (name) => readFileSync(join(HERE, "templates", name + ".html"), "utf8");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fill = (tpl, slots) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in slots ? String(slots[k]) : ""));

function hexToHsl(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function ground(v, W, H) {
  const { bg, fg, accent, muted } = v.palette;
  const [h] = hexToHsl(accent);
  const recipe = v.ground ?? "solid";
  let css = "", html = "";
  // recipes paint a layer over the solid body, never the body itself
  if (recipe === "vignette") throw new Error(`ground "vignette" was removed after review: no inset shadow or darkened edge on any canvas`);
  if (recipe === "gradient") css = `background:linear-gradient(${v.gradientAngle ?? 160}deg, ${shade(bg, 0.06)} 0%, ${bg} 55%, ${mix(bg, accent, 0.18)} 100%);`;
  // soft discs are radial gradients, not blurred boxes: a filter blur over a photo layer stalls the headless compositor at 2x
  const soft = (c) => `radial-gradient(closest-side, ${c} 0%, ${c} 38%, transparent 100%)`;
  if (recipe === "blob") {
    html += `<div class="blob" style="left:${-W * 0.15}px;top:${-H * 0.1}px;width:${W * 0.55}px;height:${W * 0.55}px;background:${soft(accent)}"></div>`;
    html += `<div class="blob" style="right:${-W * 0.2}px;bottom:${-H * 0.15}px;width:${W * 0.6}px;height:${W * 0.6}px;background:${soft(muted)}"></div>`;
  }
  if (recipe === "diagonal") throw new Error(`ground "diagonal" was removed after review (0 of 8 survived)`);
  if (recipe === "paper") { css = `background:${mix(bg, "#c9b48a", 0.07)};`; v.grain = Math.max(v.grain ?? 0, 0.11); }
  if (recipe === "burst") throw new Error(`ground "burst" was removed after review: drawn sparks beside a photograph are a second subject`);
  if (recipe === "spot") html += `<div class="blob" style="left:${W * 0.22}px;top:${H * 0.42}px;width:${W * 0.56}px;height:${W * 0.56}px;background:${soft(accent)};opacity:.28"></div>`;
  // an off-canvas light: more than half of the disc sits outside the frame, so it reads as a lamp in the room
  if (recipe === "glow") html += `<div class="blob" style="left:${W * 0.5}px;top:${-H * 0.5}px;width:${W * 0.95}px;height:${W * 0.95}px;background:${soft(accent)};opacity:.34"></div>`;
  if (recipe === "dots" || recipe === "lines") throw new Error(`ground "${recipe}" was removed after review: a dot grid or diagonal hairlines behind the type read as a worksheet, not a ground`);
  if (recipe === "band") throw new Error(`ground "band" was removed after review; use diagonal or spot`);
  // grain: the turbulence is computed once on a 200px tile and repeated, not over the whole canvas at 2x
  if (v.grain) html += `<svg class="grain" width="100%" height="100%"><defs><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" stitchTiles="stitch"/></filter><pattern id="gp" width="200" height="200" patternUnits="userSpaceOnUse"><rect width="200" height="200" filter="url(#g)"/></pattern></defs><rect width="100%" height="100%" fill="url(#gp)"/></svg>`;
  return { css, html, hue: h };
}

function shade(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt))));
  return "#" + [f((n >> 16) & 255), f((n >> 8) & 255), f(n & 255)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
function mix(a, b, t) {
  const A = parseInt(a.replace("#", ""), 16), B = parseInt(b.replace("#", ""), 16);
  const c = (s) => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t);
  return "#" + [c(16), c(8), c(0)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

const REMOVED_EFFECTS = new Set(["dim-last", "accent-word", "size-step"]);
function headLines(lines, v) {
  const effect = v.effect ?? "plain";
  if (REMOVED_EFFECTS.has(effect)) throw new Error(`variant ${v.id}: effect "${effect}" was removed after review`);
  const target = v.accentLine ?? lines.length - 1;
  return lines.map((line, i) => {
    let inner = esc(line);
    if (effect === "accent-line" && i === target) inner = `<em class="acc" style="font-style:normal">${inner}</em>`;
    if (effect === "slab" && i === target) inner = `<em class="slab" style="font-style:normal">${inner}</em>`;
    if (effect === "mixed-weight" && i === 0) inner = `<em style="font-style:normal;font-weight:400">${inner}</em>`;
    // a pulled line in quotation marks, the marks in the accent: a typographic device, not an effect on the letterforms
    if (effect === "quote") { if (i === 0) inner = `<em class="acc" style="font-style:normal">\u201C</em>${inner}`; if (i === lines.length - 1) inner = `${inner}<em class="acc" style="font-style:normal">\u201D</em>`; }
    if ((effect === "highlight" || effect === "underline") && i === target) {
      const cls = effect === "highlight" ? "hl" : "ul";
      inner = v.markWord && inner.toLowerCase().includes(v.markWord.toLowerCase())
        ? inner.replace(new RegExp(`(${v.markWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"), `<em class="${cls}" style="font-style:normal">$1</em>`)
        : `<em class="${cls}" style="font-style:normal">${inner}</em>`;
    }
    return `<span data-line>${inner}</span>`;
  }).join("");
}

function fontFace(face, assetsDirs) {
  if (!face) return { css: "", family: "system-ui" };
  const rules = [];
  for (const d of assetsDirs) {
    const fdir = join(d, "fonts");
    if (!existsSync(fdir)) continue;
    for (const f of readdirSync(fdir)) {
      const m = f.match(/^(.+)-(\d{3})\.woff2$/);
      if (!m || m[1] !== face) continue;
      const b64 = readFileSync(join(fdir, f)).toString("base64");
      rules.push(`@font-face{font-family:"${face}";font-weight:${m[2]};src:url(data:font/woff2;base64,${b64}) format("woff2");font-display:block}`);
    }
    if (rules.length) break;
  }
  return { css: rules.join("\n"), family: `"${face}"` };
}

function photoData(slug, assetsDirs) {
  for (const d of assetsDirs) {
    const p = join(d, "photos", `${slug}.jpg`);
    if (existsSync(p)) return "data:image/jpeg;base64," + readFileSync(p).toString("base64");
  }
  throw new Error(`photo not found: ${slug}.jpg (fetch it with fetch-assets.mjs --photos and look at the sheet first)`);
}

function subjectMarkup(v, assetsDirs, size) {
  if (v.subjectType === "icon") {
    for (const d of assetsDirs) {
      const p = join(d, "icons", `${v.subject}.svg`);
      if (existsSync(p)) {
        let svg = readFileSync(p, "utf8").replace(/<\?xml[^>]*>/, "").replace(/<!--[\s\S]*?-->/g, "");
        // resize the root only; child widths (a rect's) are geometry and stay
        svg = svg.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, "")} width="${size}" height="${size}" style="display:block">`);
        return { markup: svg, style: "" };
      }
    }
    throw new Error(`icon not found: ${v.subject}.svg (looked in ${assetsDirs.map((d) => join(d, "icons")).join(", ")})`);
  }
  // system emoji, tinted toward the accent hue with a filter chain (catalog: glyph rule)
  const [h, s] = hexToHsl(v.palette.accent);
  const style = `font-size:${Math.round(size * 0.7)}px;line-height:1;filter:grayscale(1) sepia(1) hue-rotate(${Math.round(h - 40)}deg) saturate(${(1.6 + s * 2).toFixed(2)}) brightness(1.05);`;
  return { markup: `<span style="${style}">${esc(v.subject)}</span>`, style: "" };
}


// Headline typesetting. The text is the author's; the line breaks are the run's, so a headline whose
// authored lines would set too small to hold 22% of the canvas (R11) is rebalanced over one more line.
// advance of a bold sans at 1em by character class, measured on the faces in rotation; the page corrects the rest.
// One average for every character sized a digit-heavy line a third too large, and the page then shrank it under the R11 floor
const CHAR_W = { upper: 0.68, digit: 0.62, lower: 0.5, space: 0.28, other: 0.3 };
const lineEm = (l) => [...l].reduce((w, ch) => w + (/\p{Lu}/u.test(ch) ? CHAR_W.upper : /\d/.test(ch) ? CHAR_W.digit : /\p{Ll}/u.test(ch) ? CHAR_W.lower : ch === " " ? CHAR_W.space : CHAR_W.other), 0);
// a display value is sized to the width it has, not to a fixed share of the canvas: 14.9-17.7 at three tenths of the height ran
// off the right edge, and every run was patching it by hand with extraCss. A mono face advances every character alike
const valueEm = (s, face) => (/mono/i.test(face ?? "") ? [...s].length * 0.62 : lineEm(s));
const LINE_EM = 1.04 + 0.16;  // line box plus the gap between lines
const PAD_EM = 0.32;          // .16em padding top and bottom on the block
// the headline's type never passes its share of the canvas height (R22): above the ceiling a two-word line dwarfs the icon
// or the figure it was set beside; the floor is the render gate's, since the page grows the type to the width on its own
const HEAD_MAX = 0.14;
function headSizeFor(lines, W, H, kind, v = {}) {
  const longest = Math.max(...lines.map(lineEm));
  // the knockout block pads .34em each side, so its lines set about a tenth smaller to stay inside 88%
  const byWidth = ((W * (v.widthFrac ?? 0.88)) / longest) * (v.effect === "knockout" ? 0.9 : 1);
  const n = lines.length;
  // a third of the height over a figure or a lockup: at three tenths a three-line headline hit the budget before its widest line reached the width (R11)
  const budget = v.headBudget ?? (kind === "glyph" ? 0.36 : 0.34);
  const byHeight = (H * budget) / (n * LINE_EM + PAD_EM);
  return Math.min(byWidth, byHeight, H * HEAD_MAX);
}
function blockHeight(lines, W, H, kind, v = {}) {
  const pad = v.effect === "knockout" ? 0.6 : PAD_EM;
  return headSizeFor(lines, W, H, kind, v) * (lines.length * LINE_EM + pad) / H;
}
function balance(words, n) {
  const total = words.join(" ").length;
  const out = []; let i = 0;
  for (let k = 0; k < n; k++) {
    const target = (total - out.join(" ").length) / (n - k);
    let line = words[i++] ?? "";
    while (i < words.length && k < n - 1 && (line + " " + words[i]).length <= target + words[i].length / 2) line += " " + words[i++];
    out.push(line);
  }
  while (i < words.length) out[out.length - 1] += " " + words[i++];
  return out.filter(Boolean);
}
// The line count that sets the type largest, among the counts whose block clears the R11 height floor: fewer, wider lines
// fill the width; more, shorter lines fill the height. Sizing for height alone produced short lines stopping mid-canvas.
function fitLines(lines, W, H, kind, pinned, v = {}) {
  if (pinned) return lines;
  // under a small icon the line is the picture: it takes half the canvas or the lower third is dead
  const min = (v.layout === "small-top" ? 0.5 : 0.225) * 1.1;   // a margin over the floor absorbs the estimate's error
  const words = lines.join(" ").split(/\s+/).filter(Boolean);
  const maxLines = 5;
  const cands = [lines];
  for (let n = lines.length + 1; n <= Math.min(maxLines, words.length); n++) cands.push(balance(words, n));
  const score = (c) => ({ size: headSizeFor(c, W, H, kind, v), h: blockHeight(c, W, H, kind, v) });
  const tall = cands.filter((c) => score(c).h >= min);
  if (tall.length) return tall.reduce((a, b) => (score(b).size > score(a).size * 1.02 ? b : a));
  return cands.reduce((a, b) => (score(b).h > score(a).h ? b : a));
}

function build(set, v, assetsDirs) {
  const W = set.width ?? 1080, H = set.height ?? 1080;
  const layout = v.layout ?? "stack";
  if (v.pattern === "panel") throw new Error(`variant ${v.id}: figure pattern "panel" was removed after review`);
  if (v.kind === "statement") throw new Error(`variant ${v.id}: the statement kind was removed after review (a line between two rules on an empty canvas); the same line goes on a glyph, lockup, list or photo row`);
  // a photograph is the subject; nothing drawn sits beside it (no icon, no emoji, no spark, no shape)
  if (v.kind === "photo" && (v.subject || v.subjectType)) throw new Error(`variant ${v.id}: a photo row carries no subject beside the photograph`);
  if (layout === "side" && v.kind !== "lockup") throw new Error(`variant ${v.id}: the side layout survived review on lockups only`);
  if (layout === "side") { v.widthFrac = 0.38; v.headBudget = 0.7; }   // the column runs most of the height, so the value and the line together hold the frame
  if (v.kind === "glyph" && layout === "small-top") v.headBudget = 0.55;   // under a small icon the line is the picture and runs to the lower third
  if (v.kind === "photo" && layout === "split") v.widthFrac = 0.38;
  if (v.kind === "photo" && layout === "quiet" && (v.zone === "left" || v.zone === "right")) v.widthFrac = 0.44;
  // the headline runs the width of the canvas, which at three lines takes about two fifths of its height; the photo or
  // the list takes what is left, since a wide picture under a title that stops mid-canvas read as somebody else's image
  if (v.kind === "photo") v.headBudget = 0.4;
  if (v.kind === "list") v.headBudget = 0.34;
  if (v.kind === "photo" && layout === "duotone") v.grain = 0;   // grain over the duotone's blend layers stalls the headless capture at 2x
  // above or below a photo the headline fills the photo's width: the width bound sets the size, the photo takes what is left
  if (v.kind === "photo" && (layout === "split" || (layout === "quiet" && (v.zone === "left" || v.zone === "right")))) v.headBudget = 0.5;   // in a column the headline is the body, and half the height keeps the column from a dead lower half
  let lines = v.headline ?? set.headline;
  if (!Array.isArray(lines) || !lines.length) throw new Error(`variant ${v.id}: headline lines missing`);
  lines = fitLines(lines, W, H, v.kind, v.headSize, v);
  const { bg, fg, accent, muted } = v.palette;
  const g = ground(v, W, H);
  const font = fontFace(v.face, assetsDirs);
  const nLines = lines.length;
  const kind = v.kind;
  const headSize = Math.round(v.headSize ?? headSizeFor(lines, W, H, kind, v));
  const base = {
    lang: set.lang ?? "en", W, H, bg, fg, accent, muted,
    fontFace: font.css, fontFamily: font.family,
    groundCss: g.css, ground: g.html,
    grainAlpha: v.grain ?? 0, blobBlur: Math.round(W * 0.08), blobAlpha: 0.32,
    weight: v.weight ?? 800, tracking: v.tracking ?? "-0.025em", lineHeight: v.lineHeight ?? 1.06,
    headSize, lineGap: Math.round(headSize * 0.16), capSize: Math.round(H * 0.026), ruleH: Math.round(H * 0.012),
    headClass: v.effect === "knockout" ? "head knock" : "head", effect: v.effect ?? "plain",
    // the page sizes the type to the real face: it grows the headline until its widest line meets the block width or the
    // block reaches this height, since the average-advance estimate above always leaves width unused (0.51 to 0.65 in review)
    // a column headline is centred on the canvas after the page has sized it, so a short block leaves no dead quarter above or below
    headCenter: v.widthFrac && v.widthFrac < 0.6 ? "1" : "",
    headMaxH: Math.round(H * (v.headBudget ?? (kind === "glyph" ? 0.36 : 0.34))),
    bodyAttrs: v.widthFrac && v.widthFrac < 0.6 ? ' data-layout="columns"' : "",
    headLines: headLines(lines, v), extraCss: v.extraCss ?? "",
  };
  // anchor "bottom" puts the headline under the figure or subject, which is a different layout skeleton (R21)
  if (v.anchor === "bottom" && v.kind !== "lockup") throw new Error(`variant ${v.id}: bottom anchor was removed after review except on lockups`);
  const flip = v.anchor === "bottom";
  const headTop = flip ? 100 - 6 - blockHeight(lines, W, H, kind, v) * 100 : 6;
  base.headTop = headTop.toFixed(1);
  base.headBottom = flip ? 94 : "";
  const figTop = (defaultTop) => flip ? 8 : defaultTop;
  let content;
  if (kind === "glyph") {
    if (layout === "small-top") {
      const size = Math.round(H * 0.16);
      const s = subjectMarkup(v, assetsDirs, size);
      content = fill(T("glyph-small-top"), { ...base, subjSize: size, subjectMarkup: s.markup, headTop: 7 + (size / H) * 100 + 5 });
    } else {
      const size = Math.round(H * 0.42);
      const s = subjectMarkup(v, assetsDirs, size);
      const left = v.align === "left" ? 8 : v.align === "right" ? 92 - (size / W) * 100 : 50 - (size / W) * 50;
      content = fill(T("glyph"), { ...base, subjSize: size, subjLeft: left.toFixed(1), subjTop: flip ? 8 : 52, subjectMarkup: s.markup, subjStyle: s.style });
    }
  } else if (kind === "lockup") {
    if (!v.value || !v.caption) throw new Error(`variant ${v.id}: lockup needs value and caption`);
    const digits = String(v.value).match(/\d+/g) ?? [];
    if (digits.some((d) => lines.join(" ").includes(d))) throw new Error(`variant ${v.id}: R6, headline repeats the lockup's digits ${digits.join(",")}`);
    if (layout === "side") {
      const bh = blockHeight(lines, W, H, kind, v) * 100;
      const sideSize = Math.min(H * 0.24, (W * 0.42) / (String(v.value).length * 0.74));
      content = fill(T("lockup-side"), { ...base, figTop: 8, figH: 84, valueSize: Math.round(sideSize), capGap: Math.round(H * 0.02),
        value: esc(v.value), caption: esc(v.caption), headTop: Math.max(8, 50 - bh / 2).toFixed(1) });
    } else {
      // under a knocked-out headline the value sits flush right, which is also a different skeleton from the plain lockup;
      // the value and its caption sit at the foot of the figure (at its head under a bottom anchor), so the lockup holds the frame
      content = fill(T("lockup"), { ...base, figTop: figTop(44), figH: 50, valueSize: Math.round(Math.min(H * 0.3, (W * 0.88) / valueEm(String(v.value), v.face))), capGap: Math.round(H * 0.02), value: esc(v.value), caption: esc(v.caption),
        figAlign: `display:flex;flex-direction:column;justify-content:${flip ? "flex-start" : "flex-end"};align-items:${v.effect === "knockout" ? "flex-end" : "flex-start"}` });
    }
  } else if (kind === "figure") {
    const p = v.pattern ?? "mass";
    const capGap = Math.round(H * 0.014), valueSize = Math.round(H * 0.075);
    if (p === "mass") {
      const [a, b] = v.values;
      const max = Math.max(a.v, b.v);
      content = fill(T("figure-mass"), { ...base, figTop: figTop(40), figH: 54, valueSize, capGap, radius: Math.round(W * 0.012),
        valueA: esc(a.text ?? a.v), valueB: esc(b.text ?? b.v), labelA: esc(a.label), labelB: esc(b.label),
        barA: Math.round((a.v / max) * 62), barB: Math.round((b.v / max) * 62) });
    } else if (p === "arc") {
      const frac = Math.max(0, Math.min(1, v.fraction));
      const arcSize = Math.round(H * 0.46);
      // the ring's hole is 64 percent of the box (r 40, stroke 16), and the value fits inside it with a margin (R4)
      content = fill(T("figure-arc"), { ...base, figTop: figTop(42), figH: 52, arcSize, arcDash: (251.3 * frac).toFixed(1),
        arcValueSize: Math.round(Math.min(arcSize * 0.24, (arcSize * 0.58) / valueEm(String(v.value), v.face))), capSizeBig: Math.round(H * 0.05), value: esc(v.value), caption: esc(v.caption) });
    } else if (p === "arc-hero") {
      const frac = Math.max(0, Math.min(1, v.fraction));
      const arcSize = Math.round(H * 0.4);
      content = fill(T("figure-arc-hero"), { ...base, figTop: figTop(40), figH: 56, arcSize, arcDash: (257.6 * frac).toFixed(1), capGap: Math.round(H * 0.025),
        arcValueSize: Math.round(Math.min(arcSize * 0.26, (arcSize * 0.62) / valueEm(String(v.value), v.face))), capSizeBig: Math.round(H * 0.036), value: esc(v.value), caption: esc(v.caption) });
    } else if (p === "squares") {
      const [a, b] = v.values;
      const max = Math.max(a.v, b.v), big = Math.round(H * 0.34);
      content = fill(T("figure-squares"), { ...base, figTop: figTop(40), figH: 54, valueSize, capGap, radius: Math.round(W * 0.014),
        valueA: esc(a.text ?? a.v), valueB: esc(b.text ?? b.v), labelA: esc(a.label), labelB: esc(b.label),
        sqA: Math.round(big * Math.sqrt(a.v / max)), sqB: Math.max(Math.round(H * 0.06), Math.round(big * Math.sqrt(b.v / max))) });
    } else if (p === "bars") {
      const vals = v.values, max = Math.max(...vals.map((x) => x.v));
      const bars = vals.map((x, k) => `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
        <div data-value data-mark="value" style="font-size:${Math.round(H * 0.065)}px;font-weight:800;color:${fg};line-height:1.1;margin-bottom:${capGap}px">${esc(x.text ?? x.v)}</div>
        <div data-mark="form" style="height:${Math.round((x.v / max) * 62)}%;background:${k === 0 ? accent : muted};opacity:${k === 0 ? 1 : 1 - k * 0.18};border-radius:${Math.round(W * 0.012)}px"></div>
        <div class="cap" data-caption style="margin-top:${capGap}px">${esc(x.label)}</div></div>`).join("");
      content = fill(T("figure-bars"), { ...base, figTop: figTop(40), figH: 54, bars });
    } else if (p === "rows") {
      const vals = v.values, max = Math.max(...vals.map((x) => x.v));
      const rows = vals.map((x, k) => `<div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:${Math.round(H * 0.012)}px">
          <span class="cap" data-caption>${esc(x.label)}</span><span data-value style="font-size:${Math.round(H * 0.06)}px;font-weight:800;line-height:1;color:${k === 0 ? accent : fg}">${esc(x.text ?? x.v)}</span></div>
        <div data-mark="form" style="height:${Math.round(H * 0.045)}px;background:${muted};opacity:.35;border-radius:${Math.round(H * 0.045)}px"><div style="height:100%;width:${Math.max(6, Math.round((x.v / max) * 100))}%;background:${k === 0 ? accent : fg};opacity:${k === 0 ? 1 : 0.7};border-radius:inherit"></div></div></div>`).join("");
      content = fill(T("figure-rows"), { ...base, figTop: figTop(40), figH: 52, rows });
    } else if (p === "discs") {
      const [a, b] = v.values, max = Math.max(a.v, b.v), big = Math.round(H * 0.36);
      content = fill(T("figure-discs"), { ...base, figTop: figTop(40), figH: 54, valueSize, capGap,
        valueA: esc(a.text ?? a.v), valueB: esc(b.text ?? b.v), labelA: esc(a.label), labelB: esc(b.label),
        dA: Math.round(big * Math.sqrt(a.v / max)), dB: Math.max(Math.round(H * 0.07), Math.round(big * Math.sqrt(b.v / max))) });
    } else if (p === "duel") {
      const [a, b] = v.values;
      content = fill(T("figure-duel"), { ...base, figTop: figTop(42), figH: 50, valueSize: Math.round(H * 0.17), vsSize: Math.round(H * 0.05), capGap,
        valueA: esc(a.text ?? a.v), valueB: esc(b.text ?? b.v), labelA: esc(a.label), labelB: esc(b.label) });
    } else if (p === "steps") {
      const nodes = v.steps.map((s, k) => `${k ? `<div style="flex:none;width:${Math.round(W * 0.05)}px;height:${Math.round(H * 0.006)}px;background:${muted}"></div>` : ""}
        <div style="flex:1;min-width:0"><div data-mark="form" style="width:${Math.round(H * 0.11)}px;height:${Math.round(H * 0.11)}px;border-radius:50%;background:${k === v.steps.length - 1 ? accent : muted};display:flex;align-items:center;justify-content:center;font-size:${Math.round(H * 0.05)}px;font-weight:800;color:${bg};margin-bottom:${Math.round(H * 0.025)}px">${k + 1}</div>
        <div style="font-size:${Math.round(H * 0.036)}px;font-weight:600;line-height:1.2">${esc(s)}</div></div>`).join("");
      // a process is not a comparison: marked as a figure for the fill and skeleton checks, not for R7/R8
      content = fill(T("figure-steps"), { ...base, figTop: figTop(44), figH: 48, steps: nodes }).replace(' data-figure ', ' ');
    } else if (p === "threshold") {
      throw new Error(`variant ${v.id}: figure pattern "threshold" was removed after review (0 of 18 survived)`);
    } else throw new Error(`variant ${v.id}: unknown figure pattern ${p}`);
  } else if (kind === "photo") {
    if (!v.photo) throw new Error(`variant ${v.id}: photo layouts need a photo slug from the asset cache`);
    const data = photoData(v.photo, assetsDirs), focus = v.focus ?? "center", radius = Math.round(W * 0.02);
    const bh = (v.headBudget ?? 0.24) * 100;   // the reserved height; the page grows the type to the width inside it
    if (layout === "scrim") throw new Error(`variant ${v.id}: photo layout "scrim" was removed after review (an empty upper half and a stripe above it); use quiet with zone bottom`);
    else if (layout === "split") content = fill(T("photo-split"), { ...base, photoData: data, focus, radius, headTop: Math.max(14, 50 - bh / 2).toFixed(1) });
    else if (layout === "card") content = fill(T("photo-card"), { ...base, photoData: data, focus, radius, cardTop: 8 + bh + 4, cardH: 86 - bh - 6, tilt: v.tilt ?? -4, shadowY: Math.round(H * 0.02), shadowB: Math.round(H * 0.05) });
    else if (layout === "duotone") content = fill(T("photo-duotone"), { ...base, photoData: data, focus, radius, photoTop: 8 + bh + 3, photoH: 93 - (8 + bh + 3) });
    else if (layout === "frame") content = fill(T("photo-frame"), { ...base, photoData: data, focus, radius: Math.round(W * 0.035), bezel: Math.round(W * 0.016), frameTop: 8 + bh + 3, frameH: 88 - (8 + bh + 3), standTop: 90.5, standH: Math.round(H * 0.012) });
    else if (layout === "quiet") {
      // the headline sits in the photo's quiet zone under a local tint that fades out by the middle: never a full mask
      const zone = v.zone ?? "bottom";
      if (!["top", "bottom", "left", "right"].includes(zone)) throw new Error(`variant ${v.id}: quiet zone must be top, bottom, left or right`);
      const angle = { top: 180, bottom: 0, left: 90, right: 270 }[zone];
      const headTopQ = zone === "top" ? 8 : zone === "bottom" ? 92 - bh : Math.max(8, 50 - bh / 2);
      const headPos = zone === "left" ? "left:6%;width:44%" : zone === "right" ? "left:50%;width:44%" : "";
      content = fill(T("photo-quiet"), { ...base, photoData: data, focus, scrimAngle: angle, headTop: headTopQ.toFixed(1), headPos });
    } else if (layout === "band") {
      const photoH = 86 - bh - 4;
      content = fill(T("photo-band"), { ...base, photoData: data, focus, radius, photoH: photoH.toFixed(1), headTop: (6 + photoH + 4).toFixed(1) });
    } else if (layout === "caption") {
      if (!v.note) throw new Error(`variant ${v.id}: the caption layout needs a note, one fact the photo stands for`);
      content = fill(T("photo-caption"), { ...base, photoData: data, focus, radius, photoTop: 8 + bh + 3, photoH: 82 - (8 + bh + 3), noteTop: 85.5, noteSize: Math.round(H * 0.03), note: esc(v.note) });
    } else throw new Error(`variant ${v.id}: unknown photo layout ${layout}`);
  } else if (kind === "list") {
    const p = v.pattern;
    const bh = (v.headBudget ?? 0.24) * 100, figTop0 = 8 + bh + 4, figH0 = 93 - figTop0;
    if (p === "compare") {
      const cards = v.cards.map((c, k) => `<div data-mark="form" style="flex:1;border:${Math.round(W * 0.004)}px solid ${k ? muted : accent};border-radius:${Math.round(W * 0.02)}px;padding:${Math.round(H * 0.03)}px;box-sizing:border-box;display:flex;flex-direction:column;gap:${Math.round(H * 0.02)}px">
        <div style="font-size:${Math.round(H * 0.05)}px;font-weight:800;color:${k ? fg : accent};line-height:1.1">${esc(c.title)}</div>
        ${c.items.map((it) => `<div style="display:flex;gap:.5em;font-size:${Math.round(H * 0.031)}px;line-height:1.3;font-weight:500"><span style="color:${k ? muted : accent}">&#9679;</span><span>${esc(it)}</span></div>`).join("")}</div>`).join("");
      content = fill(T("list-compare"), { ...base, figTop: figTop0, figH: figH0, cards });
    } else if (p === "bullets") {
      const items = v.items.map((it, k) => `<li style="display:flex;align-items:center;gap:${Math.round(W * 0.025)}px;font-size:${Math.round(H * (v.items.length > 4 ? 0.028 : 0.03))}px;line-height:1.15;font-weight:500"><span data-mark="form" style="flex:none;width:${Math.round(H * 0.06)}px;height:${Math.round(H * 0.06)}px;border-radius:50%;background:${accent};color:${bg};font-weight:800;font-size:${Math.round(H * 0.03)}px;display:flex;align-items:center;justify-content:center">${k + 1}</span><span>${esc(it)}</span></li>`).join("");
      content = fill(T("list-bullets"), { ...base, figTop: figTop0, figH: 94 - figTop0, items });
    } else if (p === "checklist") {
      const box = Math.round(H * 0.06);
      const items = v.items.map((it) => `<li style="display:flex;align-items:center;gap:${Math.round(W * 0.025)}px;font-size:${Math.round(H * (v.items.length > 4 ? 0.028 : 0.031))}px;line-height:1.15;font-weight:600"><span data-mark="form" style="flex:none;width:${box}px;height:${box}px;border-radius:${Math.round(W * 0.012)}px;background:${accent};color:${bg};display:flex;align-items:center;justify-content:center"><svg width="${Math.round(box * 0.6)}" height="${Math.round(box * 0.6)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><span>${esc(it)}</span></li>`).join("");
      content = fill(T("list-bullets"), { ...base, figTop: figTop0, figH: 94 - figTop0, items });
    } else if (p === "stats") {
      const rows = v.values.map((x, k) => `<div style="display:flex;align-items:center;gap:${Math.round(W * 0.04)}px;border-top:${k ? 1 : 0}px solid ${muted};padding-top:${k ? Math.round(H * 0.02) : 0}px">
        <div data-value data-mark="form" style="flex:none;width:34%;font-size:${Math.round(H * 0.08)}px;font-weight:800;line-height:1.15;color:${accent};letter-spacing:-.03em">${esc(x.text ?? x.v)}</div>
        <div><div class="cap" data-caption>${esc(x.label)}</div><div style="font-size:${Math.round(H * 0.027)}px;line-height:1.3;margin-top:.2em">${esc(x.desc ?? "")}</div></div></div>`).join("");
      content = fill(T("list-stats"), { ...base, figTop: figTop0, figH: figH0, rows });
    } else throw new Error(`variant ${v.id}: unknown list pattern ${p}`);
  } else throw new Error(`variant ${v.id}: unknown kind ${kind}`);
  return fill(T("_base"), { ...base, content });
}

function main(argv) {
  const args = argv.filter((a) => !a.startsWith("--"));
  const i = argv.indexOf("--assets");
  if (!args[0]) { console.log("usage: node scripts/build-set.mjs <run-folder> [--assets <dir>]"); return 2; }
  const run = resolve(args[0]);
  const set = JSON.parse(readFileSync(join(run, "set.json"), "utf8"));
  const assetsDirs = [join(run, "assets"), ...(i >= 0 ? [resolve(argv[i + 1])] : [])].filter(existsSync);
  mkdirSync(join(run, "src"), { recursive: true });
  const ids = new Set();
  let n = 0;
  for (const v of set.variants) {
    if (ids.has(v.id)) throw new Error(`duplicate variant id ${v.id}`);
    ids.add(v.id);
    writeFileSync(join(run, "src", `${v.id}.html`), build(set, v, assetsDirs));
    n++;
  }
  const used = new Set(set.variants.filter((v) => v.photo).map((v) => v.photo));
  for (const d of assetsDirs) {
    const cp = join(d, "photos", "credits.json");
    if (!existsSync(cp)) continue;
    const credits = JSON.parse(readFileSync(cp, "utf8"));
    for (const s of used) if (credits[s]?.attribution) console.log(`attribution required with the post for ${s}: ${credits[s].attribution}`);
    for (const s of used) if (credits[s] && !credits[s].attribution) console.log(`photo ${s}: ${credits[s].license}, no attribution required`);
  }
  console.log(`built ${n} page(s) into ${join(run, "src")}${assetsDirs.length ? " with assets from " + assetsDirs.join(", ") : " (no assets folder, system fonts)"}`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
