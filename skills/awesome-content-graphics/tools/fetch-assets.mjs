import fs from 'node:fs/promises';
import path from 'node:path';

import { assetCache } from './config.mjs';

const CACHE = assetCache();
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const FACES = [
  ['Sora', 700], ['Sora', 800],
  ['Inter', 900], ['Inter', 700],
  ['Archivo', 800], ['Archivo', 600],
  ['Space Grotesk', 700],
  ['Fraunces', 700],
  ['Playfair Display', 800],
  ['Instrument Serif', 400],
];

const ICONS = ['database','hard-drive','clock','terminal','lock','key','shield','file-text','history','activity','eye','cloud-upload','cloud-off','laptop','monitor','server','calendar-clock','timer','fingerprint','scan-search','upload','cpu','folder-clock','list-checks','binary','radio-tower'];

async function fonts() {
  const dir = path.join(CACHE, 'fonts');
  await fs.mkdir(dir, { recursive: true });
  const out = [];
  for (const [fam, w] of FACES) {
    const slug = fam.toLowerCase().replace(/ /g, '-') + '-' + w;
    const file = path.join(dir, slug + '.woff2');
    try { await fs.access(file); out.push({ fam, w, slug, cached: true }); continue; } catch {}
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam)}:wght@${w}&display=swap`;
    const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
    // latin subset is the last block; take the last woff2 url whose unicode-range covers basic latin
    const blocks = css.split('@font-face').slice(1);
    let pick = null;
    for (const b of blocks) {
      const u = b.match(/url\((https:[^)]+\.woff2)\)/);
      const r = b.match(/unicode-range:\s*([^;]+);/);
      if (!u) continue;
      if (!r || /U\+0000-00FF/i.test(r[1])) pick = u[1];
    }
    if (!pick) { const u = css.match(/url\((https:[^)]+\.woff2)\)/); pick = u && u[1]; }
    if (!pick) { console.log('FONT MISS', fam, w); continue; }
    const buf = Buffer.from(await (await fetch(pick, { headers: { 'User-Agent': UA } })).arrayBuffer());
    await fs.writeFile(file, buf);
    out.push({ fam, w, slug, bytes: buf.length, src: pick });
  }
  await fs.writeFile(path.join(dir, 'index.json'), JSON.stringify(out, null, 1));
  console.log('fonts', out.length);
}

async function icons() {
  const dir = path.join(CACHE, 'icons');
  await fs.mkdir(dir, { recursive: true });
  let n = 0, miss = [];
  for (const name of ICONS) {
    const file = path.join(dir, name + '.svg');
    try { await fs.access(file); n++; continue; } catch {}
    const r = await fetch(`https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`);
    if (!r.ok) { miss.push(name); continue; }
    await fs.writeFile(file, await r.text());
    n++;
  }
  console.log('icons', n, 'missing', miss.join(',') || 'none');
}

// Photo queries come from the run, never from this file: one or two per
// headline, naming the visible thing the line implies.
// Usage: node fetch-assets.mjs <queries.json>  where the file is {slug: query}.
const QUERIES = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));

async function photos() {
  const dir = path.join(CACHE, 'photos');
  await fs.mkdir(dir, { recursive: true });
  const credits = [];
  for (const [slug, q] of Object.entries(QUERIES)) {
    for (const lic of ['cc0', 'by']) {
      const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=${lic}&page_size=8&mature=false`;
      let j;
      try { j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json(); } catch (e) { console.log('OV err', slug, e.message); continue; }
      let i = 0;
      for (const r of (j.results || [])) {
        if (!r.url) continue;
        if ((r.width || 0) < 900) continue;
        i++;
        const name = i === 1 ? slug : `${slug}-${i}`;
        const f = path.join(dir, name + '.jpg');
        try { await fs.access(f); continue; } catch {}
        try {
          const resp = await fetch(r.url, { headers: { 'User-Agent': UA } });
          if (!resp.ok) { i--; continue; }
          const b = Buffer.from(await resp.arrayBuffer());
          if (b.length < 20000) { i--; continue; }
          await fs.writeFile(f, b);
          credits.push({ slug: name, query: q, title: r.title, creator: r.creator, license: r.license + ' ' + (r.license_version || ''), source: r.foreign_landing_url, w: r.width, h: r.height, bytes: b.length });
        } catch { i--; }
        if (i >= 4) break;
      }
      if (i >= 3) break;
    }
  }
  const prev = JSON.parse(await fs.readFile(path.join(dir, 'credits.json'), 'utf8').catch(() => '[]'));
  const all = [...prev, ...credits];
  await fs.writeFile(path.join(dir, 'credits.json'), JSON.stringify(all, null, 1));
  console.log('photos fetched', credits.length, 'total', all.length);
}

await fonts();
await icons();
await photos();
