// R21: compare every rendered pair as a small grayscale thumbnail, plus the
// contact sheets and the gallery the pick gate is made from
import fs from 'node:fs/promises';
import path from 'node:path';
import { Browser } from './cdp.mjs';
import { fileUrl } from './config.mjs';

const OUT = process.argv[2];
const set = JSON.parse(await fs.readFile(path.join(OUT, 'set.json'), 'utf8'));
const report = JSON.parse(await fs.readFile(path.join(OUT, 'report.json'), 'utf8'));
const pngs = (await fs.readdir(OUT)).filter(f => /^[0-9]{3}\.png$/.test(f)).sort();
const b = await Browser.launch();

// --- perceptual distance -------------------------------------------------
const p = await b.page(600, 400);
await fs.writeFile(path.join(OUT, '_probe.html'), '<!doctype html><meta charset="utf-8"><script>window.__fitted=true;window.thumb=function(src){return new Promise(function(res){var i=new Image();i.onload=function(){var c=document.createElement("canvas");c.width=24;c.height=30;var g=c.getContext("2d");g.drawImage(i,0,0,24,30);var d=g.getImageData(0,0,24,30).data;var out=[];for(var k=0;k<d.length;k+=4)out.push(Math.round(0.299*d[k]+0.587*d[k+1]+0.114*d[k+2]));res(out)};i.onerror=function(){res(null)};i.src=src})}</script>');
await p.goto(fileUrl(path.join(OUT, '_probe.html')));
const thumbs = {};
for (const f of pngs) {
  const id = f.slice(0, 3);
  thumbs[id] = await p.eval(`window.thumb(${JSON.stringify(fileUrl(path.join(OUT, f)))})`, 30000);
}
await p.close();
const ids = Object.keys(thumbs).filter(k => thumbs[k]);
const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - c[i]; s += d * d; } return Math.sqrt(s / a.length); };
const FLOOR = 12;
const near = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  const d = dist(thumbs[ids[i]], thumbs[ids[j]]);
  if (d < FLOOR) near.push([ids[i], ids[j], +d.toFixed(2)]);
}
console.log('perceptual pairs under the floor:', near.length);
for (const n of near) console.log('  ', n.join(' '));

// --- signature spread ----------------------------------------------------
const sig = v => [v.palette, v.ground, v.kind, v.subject || v.photo || v.pattern || '', v.face + '/' + v.effect, v.layout || v.pattern || ''];
let overlap = 0;
for (let i = 0; i < set.variants.length; i++) for (let j = i + 1; j < set.variants.length; j++) {
  const a = sig(set.variants[i]), c = sig(set.variants[j]);
  const same = a.filter((x, k) => x === c[k]).length;
  if (same > 3) overlap++;
}
const count = (f) => set.variants.reduce((m, v) => (m[f(v)] = (m[f(v)] || 0) + 1, m), {});
console.log('signature pairs sharing more than 3 of 6:', overlap);
console.log('kinds', count(v => v.kind));
console.log('grounds', count(v => v.ground));
console.log('palettes distinct', new Set(set.variants.map(v=>v.palette)).size, 'faces', count(v=>v.face), 'effects', count(v=>v.effect));

// --- contact sheets, 25 a sheet -----------------------------------------
const cols = 5, cw = 250, chh = 312, lab = 22;
for (let s = 0, n = 0; s < pngs.length; s += 25, n++) {
  const part = pngs.slice(s, s + 25);
  const rows = Math.ceil(part.length / cols);
  const W = cols * (cw + 10) + 20, H = rows * (chh + lab + 10) + 20;
  const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:#101014;font:600 12px/1.2 system-ui,Segoe UI,sans-serif;color:#ddd}
.g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:10px;padding:10px}
img{width:${cw}px;height:${chh}px;object-fit:contain;display:block;background:#000}
figure{margin:0}figcaption{padding:4px 2px;color:#9aa}
</style><div class="g">${part.map(f => `<figure><img src="${fileUrl(path.join(OUT, f))}"><figcaption>${f.slice(0, 3)}</figcaption></figure>`).join('')}</div>
<script>Promise.all([...document.images].map(i=>i.decode().catch(()=>0))).then(()=>{window.__fitted=true})</script>`;
  const file = path.join(OUT, `sheet-${n + 1}.html`);
  await fs.writeFile(file, html);
  const pg = await b.page(W, H);
  await pg.goto(fileUrl(file), 30000);
  await new Promise(r => setTimeout(r, 500));
  await fs.writeFile(path.join(OUT, `contact-sheet-${n + 1}.png`), await pg.shot());
  await pg.close();
  console.log('contact-sheet-' + (n + 1) + '.png', part.length, 'cells');
}

// --- gallery -------------------------------------------------------------
const byKind = {};
for (const v of set.variants) (byKind[v.kind] = byKind[v.kind] || []).push(v);
const gallery = `<!doctype html><html><head><meta charset="utf-8"><title>os-activity-logs renders</title><style>
html,body{margin:0;background:#0e0e12;color:#e8e8ee;font:15px/1.5 system-ui,Segoe UI,sans-serif}
h1{font-size:20px;padding:18px 20px 0;margin:0}
h2{font-size:15px;color:#9aa;padding:22px 20px 0;margin:0;text-transform:uppercase;letter-spacing:.08em}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;padding:14px 20px}
figure{margin:0;background:#16161c;border-radius:10px;overflow:hidden}
img{width:100%;display:block}
figcaption{padding:8px 10px;font-size:12px;color:#aab}
b{color:#fff}
</style></head><body><h1>os-activity-logs &middot; ${set.variants.length} renders</h1>
${Object.entries(byKind).map(([k, vs]) => `<h2>${k} (${vs.length})</h2><div class="g">${vs.map(v => `<figure><img src="${v.id}.png" loading="lazy"><figcaption><b>${v.id}</b> ${v.layout || v.pattern || ''} &middot; ${v.palette} &middot; ${v.face}${v.photo ? ' &middot; ' + v.photo : ''}${v.subject ? ' &middot; ' + v.subject : ''}</figcaption></figure>`).join('')}</div>`).join('')}
</body></html>`;
await fs.writeFile(path.join(OUT, 'gallery.html'), gallery);
await b.close();
console.log('gallery at', path.join(OUT, 'gallery.html'));
