#!/usr/bin/env node
// Fetch the free-licence faces and icons a set needs, once, into a cache shared across runs.
//
//   node scripts/fetch-assets.mjs --cache <dir> [--fonts Inter,Sora,...] [--icons tv,zap,...] [--weights 400;700;800]
//
// Fonts come from Google Fonts (OFL / Apache faces) as woff2 into <cache>/fonts/<Face>.woff2, with the
// licence URL recorded in <cache>/fonts/LICENSES.md. Icons come from Lucide (ISC) as SVG into
// <cache>/icons/<name>.svg. Anything already in the cache is skipped, so a second run costs nothing.
// build-set.mjs reads the same folder through --assets. Node 18+, no dependencies.

import { mkdirSync, existsSync, writeFileSync, appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

async function fetchFont(face, weights, dir) {
  const fam = face.replace(/ /g, "+");
  const want = weights.split(";").map((w) => w.trim()).filter(Boolean);
  const missing = want.filter((w) => !existsSync(join(dir, `${face}-${w}.woff2`)));
  if (!missing.length) return "cached";
  const url = `https://fonts.googleapis.com/css2?family=${fam}:wght@${want.join(";")}&display=block`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  // one @font-face block per weight and per subset; keep the latin block of each wanted weight
  const blocks = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => m[1]);
  const sizes = [];
  for (const w of missing) {
    const ofWeight = (x) => new RegExp("font-weight:\\s*" + w + "\\b").test(x);
    const b = blocks.find((x) => ofWeight(x) && /unicode-range:[^;]*U\+0000-00FF/.test(x)) ?? blocks.find(ofWeight);
    const m = b && b.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
    if (!m) { sizes.push(`${w}:unavailable`); continue; }   // a family without that weight; CSS falls back to the nearest one fetched
    const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
    writeFileSync(join(dir, `${face}-${w}.woff2`), buf);
    appendFileSync(join(dir, "LICENSES.md"), `- ${face} ${w}: ${m[1]} ; licence per https://fonts.google.com/specimen/${fam}/license (OFL or Apache-2.0)\n`);
    sizes.push(`${w}:${(buf.length / 1024).toFixed(0)}KB`);
  }
  if (!sizes.some((s) => !s.endsWith("unavailable"))) throw new Error(`${face}: no woff2 in Google Fonts CSS (is the family name exact?)`);
  return sizes.join(" ");
}

async function fetchIcon(name, dir) {
  const out = join(dir, `${name}.svg`);
  if (existsSync(out)) return "cached";
  const url = `https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/${name}.svg`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${name}: ${r.status} from lucide-static`);
  let svg = await r.text();
  // stroke icons: make the colour come from the canvas, and the stroke heavy enough for display scale
  svg = svg.replace(/stroke="[^"]*"/, 'stroke="currentColor"').replace(/stroke-width="[^"]*"/, 'stroke-width="1.75"');
  writeFileSync(out, svg);
  if (!existsSync(join(dir, "LICENSE.md"))) writeFileSync(join(dir, "LICENSE.md"), "Lucide icons, ISC licence: https://github.com/lucide-icons/lucide/blob/main/LICENSE\n");
  return "ok";
}

async function main(argv) {
  const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const cache = opt("--cache");
  if (!cache) { console.log("usage: node scripts/fetch-assets.mjs --cache <dir> [--fonts A,B] [--icons a,b] [--weights 400;700;800]"); return 2; }
  const dir = resolve(cache);
  mkdirSync(join(dir, "fonts"), { recursive: true });
  mkdirSync(join(dir, "icons"), { recursive: true });
  const fonts = opt("--fonts", "").split(",").map((s) => s.trim()).filter(Boolean);
  const icons = opt("--icons", "").split(",").map((s) => s.trim()).filter(Boolean);
  const weights = opt("--weights", "400;700;800");
  let failed = 0;
  for (const f of fonts) {
    try { console.log(`font ${f}: ${await fetchFont(f, weights, join(dir, "fonts"))}`); }
    catch (e) { failed++; console.log(`font ${f}: FAILED ${e.message}`); }
  }
  for (const i of icons) {
    try { console.log(`icon ${i}: ${await fetchIcon(i, join(dir, "icons"))}`); }
    catch (e) { failed++; console.log(`icon ${i}: FAILED ${e.message}`); }
  }
  console.log(`assets in ${dir}; ${failed} failure(s)`);
  return failed ? 1 : 0;
}

process.exit(await main(process.argv.slice(2)));
