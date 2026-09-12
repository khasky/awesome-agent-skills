#!/usr/bin/env node
// Generate and validate the palette pool in references/palettes.json, or validate one scheme.
//
//   node scripts/palettes.mjs --generate [--out references/palettes.json]
//   node scripts/palettes.mjs --check '#0b1020' '#f5f7ff' '#ff5c7a' '#8b93b8'      (bg fg accent muted)
//
// A scheme passes when the accent and the muted neutral both clear 3:1 against the ground (WCAG
// relative luminance), the foreground clears 4.5:1, and accent and muted stay apart under protan and
// tritan simulation (Machado 2009 matrices, severity 1). Node 18+, no dependencies.

import { writeFileSync } from "node:fs";

// --- colour maths -------------------------------------------------------------------------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  const out = [r, g, bb];
  if (out.some((c) => c < -0.002 || c > 1.002)) return null;   // out of sRGB gamut
  return out.map((c) => Math.round(clamp01(gam(clamp01(c))) * 255));
}
const hex = ([r, g, b]) => "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function luminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// Machado, Oliveira, Fernandes 2009, severity 1.0, applied in linear RGB
const SIM = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
function simulate(c, kind) {
  const lin = c.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return SIM[kind].map((row) => clamp01(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]));
}
function oklab(lin) {
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
          1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
          0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
const dE = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));

export function check(bgHex, fgHex, accentHex, mutedHex) {
  const bg = rgb(bgHex), fg = rgb(fgHex), ac = rgb(accentHex), mu = rgb(mutedHex);
  const fails = [];
  const cAc = contrast(ac, bg), cMu = contrast(mu, bg), cFg = contrast(fg, bg);
  if (cAc < 3) fails.push(`accent ${cAc.toFixed(2)}:1 against the ground, needs 3:1`);
  if (cMu < 3) fails.push(`muted ${cMu.toFixed(2)}:1 against the ground, needs 3:1`);
  if (cFg < 4.5) fails.push(`foreground ${cFg.toFixed(2)}:1 against the ground, needs 4.5:1`);
  for (const k of ["protan", "tritan"]) {
    const d = dE(simulate(ac, k), simulate(mu, k));
    if (d < 0.12) fails.push(`accent and muted merge under ${k} (dE ${d.toFixed(3)} < 0.12)`);
  }
  return { ok: !fails.length, fails, contrast: { accent: +cAc.toFixed(2), muted: +cMu.toFixed(2), fg: +cFg.toFixed(2) } };
}

// --- generation ---------------------------------------------------------------------------
function generate() {
  const out = [];
  const tryScheme = (name, mode, bg, fg, accents, muteds) => {
    if (!bg || !fg) return;
    for (const ac of accents) for (const mu of muteds) {
      if (!ac || !mu) continue;
      const r = check(hex(bg), hex(fg), hex(ac), hex(mu));
      if (r.ok) { out.push({ name, mode, bg: hex(bg), fg: hex(fg), accent: hex(ac), muted: hex(mu), contrast: r.contrast }); return; }
    }
  };
  for (let h = 0; h < 360; h += 20) {
    const cool = (h + 210) % 360;
    // dark grounds: a deep tinted ground, light foreground, vivid accent, cool muted neutral
    for (const [gL, gC, name] of [[0.17, 0.03, "deep"], [0.14, 0.05, "ink"]]) {   // "dusk" (L 0.23) was removed after review
      tryScheme(`${name}-${h}`, "dark", oklchToRgb(gL, gC, cool), oklchToRgb(0.97, 0.01, h),
        [0.74, 0.8, 0.86].flatMap((L) => [0.17, 0.13, 0.2].map((C) => oklchToRgb(L, C, h))),
        [0.7, 0.76, 0.64].flatMap((L) => [0.04, 0.02].map((C) => oklchToRgb(L, C, cool))));
    }
    // light grounds: paper or a tint, near-black foreground, deep accent, warm grey muted
    for (const [gL, gC, name] of [[0.97, 0.012, "paper"], [0.94, 0.03, "tint"]]) {
      tryScheme(`${name}-${h}`, "light", oklchToRgb(gL, gC, h), oklchToRgb(0.2, 0.02, h),
        [0.5, 0.45, 0.55].flatMap((L) => [0.18, 0.14, 0.21].map((C) => oklchToRgb(L, C, h))),
        [0.55, 0.5, 0.6].flatMap((L) => [0.03, 0.05].map((C) => oklchToRgb(L, C, (h + 30) % 360))));
    }
  }
  return out;
}

function main(argv) {
  if (argv.includes("--generate")) {
    const i = argv.indexOf("--out");
    const out = i >= 0 ? argv[i + 1] : "references/palettes.json";
    const pool = generate();
    writeFileSync(out, JSON.stringify({ rule: "accent and muted >= 3:1 on the ground, fg >= 4.5:1, accent/muted separable under protan and tritan", schemes: pool }, null, 1));
    console.log(`${pool.length} schemes written to ${out} (${pool.filter((p) => p.mode === "dark").length} dark, ${pool.filter((p) => p.mode === "light").length} light)`);
    return 0;
  }
  const i = argv.indexOf("--check");
  if (i >= 0) {
    const r = check(...argv.slice(i + 1, i + 5));
    console.log(r.ok ? `ok ${JSON.stringify(r.contrast)}` : r.fails.join("\n"));
    return r.ok ? 0 : 1;
  }
  console.log("usage: node scripts/palettes.mjs --generate [--out file] | --check <bg> <fg> <accent> <muted>");
  return 2;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop())) process.exit(main(process.argv.slice(2)));
