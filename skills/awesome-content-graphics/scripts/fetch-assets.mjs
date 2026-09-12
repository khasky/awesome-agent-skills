#!/usr/bin/env node
// Fetch the free-licence faces and icons a set needs, once, into a cache shared across runs.
//
//   node scripts/fetch-assets.mjs --cache <dir> [--fonts Inter,Sora,...] [--icons tv,zap,...] [--photos "query;query"] [--per 3] [--weights 400;700;800]
//
// Fonts come from Google Fonts (OFL / Apache faces) as woff2 into <cache>/fonts/<Face>.woff2, with the
// licence URL recorded in <cache>/fonts/LICENSES.md. Icons come from Lucide (ISC) as SVG into
// <cache>/icons/<name>.svg. Anything already in the cache is skipped, so a second run costs nothing.
// build-set.mjs reads the same folder through --assets. Node 18+, no dependencies.

import { mkdirSync, existsSync, writeFileSync, appendFileSync, readFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
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

// Stock photos: Openverse (CC0, then CC BY with the credit recorded), commercially usable, no key, several candidates per query.
// One file per query in <cache>/photos/<slug>.jpg, and credits.json beside them; a CC BY credit must
// travel with the post, so the receipt copies it. Nothing with a visible logo or a recognisable person
// is the caller's rule to enforce by picking the query; this only filters by licence and size.
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  for (let i = 2; i + 9 < buf.length; ) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

async function fetchPhoto(query, dir, per = 1) {
  const base = query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const creditsPath = join(dir, "credits.json");
  const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : {};
  // <slug>.jpg, <slug>-2.jpg, ... so the look gate has a choice per query instead of one shot
  const slugs = Array.from({ length: per }, (_, i) => (i ? `${base}-${i + 1}` : base));
  const missing = slugs.filter((slug) => !(existsSync(join(dir, `${slug}.jpg`)) && credits[slug]));
  if (!missing.length) return "cached";
  const banned = new Set(credits.__rejected ?? []);
  const used = new Set(Object.values(credits).map((c) => c?.id).filter(Boolean));
  const got = [];
  for (const lic of ["cc0", "by"]) {
    if (!missing.length) break;
    const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=${lic}&page_size=20&mature=false`;
    const r = await fetch(u, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (!r.ok) continue;
    const { results = [] } = await r.json();
    const good = results.filter((x) => !banned.has(x.id) && !used.has(x.id) && x.width >= 1000 && x.height >= 800 && !/logo|icon|clipart|screenshot|advert|poster|label/i.test(x.title ?? ""));
    for (const x of good) {
      if (!missing.length) break;
      try {
        const img = await fetch(x.url, { headers: { "User-Agent": UA } });
        if (!img.ok || !/image\/(jpeg|png|webp)/.test(img.headers.get("content-type") ?? "")) continue;
        const buf = Buffer.from(await img.arrayBuffer());
        if (buf.length < 30000) continue;
        // the catalogue's width is the original's; the file some providers serve is a smaller copy, so measure the bytes
        const dims = jpegSize(buf);
        if (dims && Math.max(dims[0], dims[1]) < 900) continue;
        const slug = missing.shift();
        writeFileSync(join(dir, `${slug}.jpg`), buf);
        credits[slug] = { id: x.id, query, title: x.title, creator: x.creator, license: x.license.toUpperCase() + (x.license_version ? " " + x.license_version : ""),
          license_url: x.license_url, source: x.foreign_landing_url, width: dims?.[0] ?? x.width, height: dims?.[1] ?? x.height,
          attribution: lic === "by" ? `"${x.title}" by ${x.creator}, ${x.license.toUpperCase()} ${x.license_version ?? ""} (${x.foreign_landing_url})` : null };
        used.add(x.id);
        writeFileSync(creditsPath, JSON.stringify(credits, null, 1));
        got.push(`${slug}: ${lic.toUpperCase()} ${(buf.length / 1024).toFixed(0)} KB ${dims ? dims.join("x") : x.width + "x" + x.height}`);
      } catch { /* next candidate */ }
    }
  }
  if (!got.length) throw new Error(`${query}: no commercially usable image of usable size on Openverse`);
  return got.join("; ") + (missing.length ? `; ${missing.length} candidate(s) short` : "");
}

async function main(argv) {
  const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const cache = opt("--cache");
  if (!cache) { console.log("usage: node scripts/fetch-assets.mjs --cache <dir> [--fonts A,B] [--icons a,b] [--weights 400;700;800] [--photos \"q;q\"] [--per N] [--reject slug,slug] [--max 1400]"); return 2; }
  const dir = resolve(cache);
  mkdirSync(join(dir, "fonts"), { recursive: true });
  mkdirSync(join(dir, "icons"), { recursive: true });
  const fonts = opt("--fonts", "").split(",").map((s) => s.trim()).filter(Boolean);
  const icons = opt("--icons", "").split(",").map((s) => s.trim()).filter(Boolean);
  const weights = opt("--weights", "400;700;800");
  const photos = opt("--photos", "").split(";").map((s) => s.trim()).filter(Boolean);
  const per = Math.max(1, +opt("--per", 1) || 1);
  if (photos.length) mkdirSync(join(dir, "photos"), { recursive: true });
  // --reject slug,slug: a photo the run looked at and refused (wrong subject, a logo, a person); its id is
  // remembered so the same query fetches the next candidate instead of the same file again
  const rejects = opt("--reject", "").split(",").map((s) => s.trim()).filter(Boolean);
  if (rejects.length) {
    const cp = join(dir, "photos", "credits.json");
    const credits = existsSync(cp) ? JSON.parse(readFileSync(cp, "utf8")) : {};
    credits.__rejected = credits.__rejected ?? [];
    for (const s of rejects) {
      if (credits[s]?.id) credits.__rejected.push(credits[s].id);
      delete credits[s];
      try { unlinkSync(join(dir, "photos", `${s}.jpg`)); } catch {}
      console.log(`photo ${s}: rejected`);
    }
    writeFileSync(cp, JSON.stringify(credits, null, 1));
  }
  let failed = 0;
  for (const q of photos) {
    try { console.log(`photo "${q}": ${await fetchPhoto(q, join(dir, "photos"), per)}`); }
    catch (e) { failed++; console.log(`photo "${q}": FAILED ${e.message}`); }
  }
  for (const f of fonts) {
    try { console.log(`font ${f}: ${await fetchFont(f, weights, join(dir, "fonts"))}`); }
    catch (e) { failed++; console.log(`font ${f}: FAILED ${e.message}`); }
  }
  for (const i of icons) {
    try { console.log(`icon ${i}: ${await fetchIcon(i, join(dir, "icons"))}`); }
    catch (e) { failed++; console.log(`icon ${i}: FAILED ${e.message}`); }
  }
  // photos are resampled to the working size once, in the same headless browser the set renders in,
  // so a 4000px CC0 original never lands in a page as four megabytes of base64
  if (photos.length) {
    const { launch } = await import("./cdp.mjs");
    const { pathToFileURL } = await import("node:url");
    const max = +opt("--max", 1400);
    const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what + " timed out")), ms))]);
    let b = await launch({ width: 200, height: 200, scale: 1 });
    let page = await b.newPage();
    // a stalled decode stalls the tab for good, so recovery is a new browser process
    const fresh = async () => { try { await withTimeout(b.close(), 5000, "close"); } catch {} b = await launch({ width: 200, height: 200, scale: 1 }); page = await b.newPage(); };
    await page.goto(pathToFileURL(join(dir, "photos", "credits.json")).href);
    for (const f of readdirSync(join(dir, "photos")).filter((f) => f.endsWith(".jpg"))) {
      const fp = join(dir, "photos", f);
      // a file at or under the working size in pixels and under 300 KB is left alone; a heavier one is re-encoded even at
      // the same pixels, since a 700 KB JPEG inlined at 2x is what stalled the compositor in review
      const heavy = statSync(fp).size > 300 * 1024;
      try {
        const data = await withTimeout(page.evaluate(`(async () => { const img = new Image(); img.src = ${JSON.stringify(pathToFileURL(fp).href)}; await img.decode();
          const cap = ${heavy} ? Math.min(${max}, 1100) : ${max};
          if (Math.max(img.naturalWidth, img.naturalHeight) <= cap && !${heavy}) return null;
          const s = Math.min(1, cap / Math.max(img.naturalWidth, img.naturalHeight)); const c = document.createElement("canvas");
          c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          return c.toDataURL("image/jpeg", ${heavy} ? 0.78 : 0.82); })()`), 30000, f);
        if (!data) continue;
        const buf = Buffer.from(data.split(",")[1], "base64");
        writeFileSync(fp, buf);
        console.log(`photo ${f}: resampled to <= ${heavy ? Math.min(max, 1100) : max}px, ${(buf.length / 1024).toFixed(0)} KB`);
      } catch (e) {
        console.log(`photo ${f}: resample skipped (${e.message}); the original is inlined as-is`);
        await fresh();
      }
    }
    // the render probe: one JPEG in review decoded fine at 1x and stalled the compositor at 2x under every layout,
    // so every photo is captured once the way a canvas captures it, and one that stalls is rejected like one with a logo
    const cp = join(dir, "photos", "credits.json");
    const credits = existsSync(cp) ? JSON.parse(readFileSync(cp, "utf8")) : {};
    for (const f of readdirSync(join(dir, "photos")).filter((f) => f.endsWith(".jpg"))) {
      const slug = f.replace(/\.jpg$/, "");
      if (credits[slug]?.probed) continue;
      const probe = join(dir, "photos", "probe.html");
      writeFileSync(probe, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}body{width:1080px;height:1080px;overflow:hidden}div{position:absolute;inset:0;background:url(${pathToFileURL(join(dir, "photos", f)).href}) center/cover no-repeat}</style><div></div>`);
      let pp;
      try {
        pp = await b.newPage(); await pp.setViewport(1080, 1080, 1);
        await withTimeout(pp.goto(pathToFileURL(probe).href), 20000, "probe load");
        await withTimeout(pp.screenshotZoomed(2), 20000, "probe capture");
        if (credits[slug]) { credits[slug].probed = true; writeFileSync(cp, JSON.stringify(credits, null, 1)); }
        await pp.close();
      } catch (e) {
        console.log(`photo ${slug}: rejected, stalls the renderer at 2x (${e.message}); the query fetches the next candidate`);
        credits.__rejected = credits.__rejected ?? [];
        if (credits[slug]?.id) credits.__rejected.push(credits[slug].id);
        delete credits[slug];
        try { unlinkSync(join(dir, "photos", f)); } catch {}
        writeFileSync(cp, JSON.stringify(credits, null, 1));
        await fresh();
      }
    }
    const files = readdirSync(join(dir, "photos")).filter((f) => f.endsWith(".jpg")).sort();
    const sheet = join(dir, "photos", "sheet.html");
    writeFileSync(sheet, `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;color:#ddd;font:14px system-ui}.g{display:grid;grid-template-columns:repeat(4,400px);gap:10px;padding:10px}.c img{width:400px;height:300px;object-fit:cover;display:block}.c div{padding:3px}</style><div class="g">${files.map((f) => `<div class="c"><img src="${pathToFileURL(join(dir, "photos", f)).href}"><div>${f.replace(".jpg", "")}</div></div>`).join("")}</div>`);
    const rows = Math.ceil(files.length / 4);
    try {
      const sp = await b.newPage(); await sp.setViewport(1650, rows * 336 + 10, 1);
      await withTimeout(sp.goto(pathToFileURL(sheet).href), 30000, "sheet load");
      writeFileSync(join(dir, "photos", "sheet.png"), await withTimeout(sp.screenshot(), 30000, "sheet screenshot"));
      console.log(`photo sheet: ${join(dir, "photos", "sheet.png")} (look at it before any photo goes on a canvas)`);
    } catch (e) {
      failed++;
      console.log(`photo sheet: FAILED (${e.message}); open ${sheet} or look at the files one by one before any photo goes on a canvas`);
    }
    try { await withTimeout(b.close(), 5000, "close"); } catch {}
  }
  console.log(`assets in ${dir}; ${failed} failure(s)`);
  return failed ? 1 : 0;
}

process.exit(await main(process.argv.slice(2)));
