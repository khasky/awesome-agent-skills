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
  const { bg, accent, muted } = v.palette;
  const [h] = hexToHsl(accent);
  const recipe = v.ground ?? "solid";
  let css = "", html = "";
  if (recipe === "vignette") css = `background:radial-gradient(120% 90% at 50% 40%, ${bg} 0%, ${shade(bg, -0.35)} 100%);`;
  if (recipe === "gradient") css = `background:linear-gradient(${v.gradientAngle ?? 160}deg, ${shade(bg, 0.06)} 0%, ${bg} 55%, ${mix(bg, accent, 0.18)} 100%);`;
  if (recipe === "blob") {
    html += `<div class="blob" style="left:${-W * 0.15}px;top:${-H * 0.1}px;width:${W * 0.55}px;height:${W * 0.55}px;background:${accent}"></div>`;
    html += `<div class="blob" style="right:${-W * 0.2}px;bottom:${-H * 0.15}px;width:${W * 0.6}px;height:${W * 0.6}px;background:${muted}"></div>`;
  }
  if (recipe === "band") css = `background:linear-gradient(180deg, ${bg} 0 62%, ${mix(bg, accent, 0.25)} 62% 100%);`;
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

function headLines(lines, v) {
  const effect = v.effect ?? "plain";
  return lines.map((line, i) => {
    let inner = esc(line);
    if (effect === "accent-word" && v.accentWord) {
      const re = new RegExp(`(${v.accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
      inner = inner.replace(re, '<em class="acc" style="font-style:normal">$1</em>');
    }
    if (effect === "accent-line" && i === (v.accentLine ?? lines.length - 1)) inner = `<em class="acc" style="font-style:normal">${inner}</em>`;
    if (effect === "slab" && i === (v.accentLine ?? lines.length - 1)) inner = `<em class="slab" style="font-style:normal">${inner}</em>`;
    if (effect === "dim-last" && i === lines.length - 1) inner = `<em class="dim" style="font-style:normal">${inner}</em>`;
    if (effect === "mixed-weight" && i === 0) inner = `<em style="font-style:normal;font-weight:400">${inner}</em>`;
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
const CHAR_W = 0.56;          // average advance of a bold sans at 1em, conservative
const LINE_EM = 1.04 + 0.16;  // line box plus the gap between lines
const PAD_EM = 0.32;          // .16em padding top and bottom on the block
function headSizeFor(lines, W, H, kind) {
  const longest = Math.max(...lines.map((l) => l.length));
  const byWidth = (W * 0.88) / (longest * CHAR_W);
  const n = lines.length;
  const budget = kind === "statement" ? 0.58 : n > 2 ? 0.34 : 0.3;
  const byHeight = (H * budget) / (n * LINE_EM + PAD_EM);
  return Math.min(byWidth, byHeight);
}
function blockHeight(lines, W, H, kind) {
  return headSizeFor(lines, W, H, kind) * (lines.length * LINE_EM + PAD_EM) / H;
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
function fitLines(lines, W, H, kind, pinned) {
  if (pinned) return lines;
  const min = kind === "statement" ? 0.4 : 0.225;
  if (blockHeight(lines, W, H, kind) >= min) return lines;
  const words = lines.join(" ").split(/\s+/).filter(Boolean);
  let best = lines;
  for (let n = lines.length + 1; n <= Math.min(4, words.length); n++) {
    const cand = balance(words, n);
    if (blockHeight(cand, W, H, kind) > blockHeight(best, W, H, kind)) best = cand;
    if (blockHeight(best, W, H, kind) >= min) break;
  }
  return best;
}

function build(set, v, assetsDirs) {
  const W = set.width ?? 1080, H = set.height ?? 1080;
  let lines = v.headline ?? set.headline;
  if (!Array.isArray(lines) || !lines.length) throw new Error(`variant ${v.id}: headline lines missing`);
  lines = fitLines(lines, W, H, v.kind, v.headSize);
  const { bg, fg, accent, muted } = v.palette;
  const g = ground(v, W, H);
  const font = fontFace(v.face, assetsDirs);
  const nLines = lines.length;
  const kind = v.kind;
  const headSize = Math.round(v.headSize ?? headSizeFor(lines, W, H, kind));
  const base = {
    lang: set.lang ?? "en", W, H, bg, fg, accent, muted,
    fontFace: font.css, fontFamily: font.family,
    groundCss: g.css, ground: g.html,
    grainAlpha: v.grain ?? 0, blobBlur: Math.round(W * 0.08), blobAlpha: 0.32,
    weight: v.weight ?? 800, tracking: v.tracking ?? "-0.025em", lineHeight: v.lineHeight ?? 1.06,
    headSize, capSize: Math.round(H * 0.026), ruleH: Math.round(H * 0.012),
    headLines: headLines(lines, v), extraCss: v.extraCss ?? "",
  };
  // anchor "bottom" puts the headline under the figure or subject, which is a different layout skeleton (R21)
  const flip = v.anchor === "bottom";
  const headTop = flip ? 100 - 6 - blockHeight(lines, W, H, kind) * 100 : 6;
  base.headTop = headTop.toFixed(1);
  const figTop = (defaultTop) => flip ? 8 : defaultTop;
  let content;
  if (kind === "statement") {
    content = fill(T("statement"), { ...base, headTop: 24, ruleTopH: Math.round(H * 0.03) });
  } else if (kind === "glyph") {
    const size = Math.round(H * 0.42);
    const s = subjectMarkup(v, assetsDirs, size);
    const left = v.align === "left" ? 8 : v.align === "right" ? 92 - (size / W) * 100 : 50 - (size / W) * 50;
    content = fill(T("glyph"), { ...base, subjSize: size, subjLeft: left.toFixed(1), subjTop: flip ? 8 : 52, subjectMarkup: s.markup, subjStyle: s.style });
  } else if (kind === "lockup") {
    if (!v.value || !v.caption) throw new Error(`variant ${v.id}: lockup needs value and caption`);
    const digits = String(v.value).match(/\d+/g) ?? [];
    if (digits.some((d) => lines.join(" ").includes(d))) throw new Error(`variant ${v.id}: R6, headline repeats the lockup's digits ${digits.join(",")}`);
    content = fill(T("lockup"), { ...base, figTop: figTop(44), figH: 50, valueSize: Math.round(H * 0.3), capGap: Math.round(H * 0.02), value: esc(v.value), caption: esc(v.caption) });
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
      content = fill(T("figure-arc"), { ...base, figTop: figTop(42), figH: 52, arcSize, arcDash: (251.3 * frac).toFixed(1),
        arcValueSize: Math.round(arcSize * 0.24), capSizeBig: Math.round(H * 0.05), value: esc(v.value), caption: esc(v.caption) });
    } else if (p === "threshold") {
      const [a, b] = v.values;
      const fillPct = Math.round(Math.max(2, Math.min(98, (v.fraction ?? 0.5) * 100)));
      content = fill(T("figure-threshold"), { ...base, figTop: figTop(44), figH: 50, trackH: Math.round(H * 0.07), trackTop: Math.round(H * 0.06),
        markOver: Math.round(H * 0.025), markOver2: Math.round(H * 0.05), fillPct, markPct: fillPct, valueSize: Math.round(H * 0.12), capGap: Math.round(H * 0.02),
        valueA: esc(a.text ?? a.v), valueB: esc(b.text ?? b.v), labelA: esc(a.label), labelB: esc(b.label) });
    } else throw new Error(`variant ${v.id}: unknown figure pattern ${p}`);
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
  console.log(`built ${n} page(s) into ${join(run, "src")}${assetsDirs.length ? " with assets from " + assetsDirs.join(", ") : " (no assets folder, system fonts)"}`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
