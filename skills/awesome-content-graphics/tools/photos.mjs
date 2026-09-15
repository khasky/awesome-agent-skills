import fs from 'node:fs/promises';
import path from 'node:path';
import { Browser } from './cdp.mjs';

import { assetCache } from './config.mjs';

const CACHE = assetCache();
const PH = path.join(CACHE, 'photos');
const OPT = path.join(PH, 'opt');
import { fileUrl } from './config.mjs';

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#111}</style>
<script>
window.__fitted = true;
window.shrink = function(src, maxW){ return new Promise(function(res){
  var im = new Image();
  im.onload = function(){
    var s = Math.min(1, maxW / im.naturalWidth);
    var c = document.createElement('canvas');
    c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
    var g = c.getContext('2d'); g.imageSmoothingQuality='high'; g.drawImage(im,0,0,c.width,c.height);
    try { res({ ok:true, data: c.toDataURL('image/jpeg', 0.82), w: c.width, h: c.height }); }
    catch(e){ res({ ok:false, err: String(e) }); }
  };
  im.onerror = function(){ res({ ok:false, err:'load' }); };
  im.src = src;
}); };
</script>`;

const b = await Browser.launch();
const p = await b.page(1200, 900);
const tmp = path.join(OPT, '_probe.html');
await fs.mkdir(OPT, { recursive: true });
await fs.writeFile(tmp, page);
await p.goto(fileUrl(tmp));

const files = (await fs.readdir(PH)).filter(f => f.endsWith('.jpg'));
const ok = [], bad = [];
for (const f of files) {
  const slug = f.replace(/\.jpg$/, '');
  const out = path.join(OPT, f);
  try { await fs.access(out); ok.push(slug); continue; } catch {}
  const t0 = Date.now();
  let r;
  try { r = await p.eval(`window.shrink(${JSON.stringify(fileUrl(path.join(PH, f)))}, 1400)`, 40000); }
  catch (e) { bad.push([slug, 'timeout']); continue; }
  if (!r || !r.ok) { bad.push([slug, r && r.err]); continue; }
  await fs.writeFile(out, Buffer.from(r.data.split(',')[1], 'base64'));
  ok.push(slug);
  if (Date.now() - t0 > 15000) console.log('slow', slug);
}
console.log('optimised', ok.length, 'rejected', bad.length, bad.map(x => x.join(':')).join(' '));
await p.close();

// contact sheet of the candidates
const sheetImgs = (await fs.readdir(OPT)).filter(f => f.endsWith('.jpg')).sort();
const cols = 6, cell = 300;
const rows = Math.ceil(sheetImgs.length / cols);
const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:#15151a;font:600 13px/1.2 system-ui,Segoe UI,sans-serif;color:#eee}
.g{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:8px;padding:8px}
figure{margin:0}
img{width:${cell}px;height:${Math.round(cell * 0.75)}px;object-fit:cover;display:block;background:#000}
figcaption{padding:4px 2px;color:#bbb}
</style><div class="g">${sheetImgs.map(f => `<figure><img src="${fileUrl(path.join(OPT, f))}"><figcaption>${f.replace(/\.jpg$/, '')}</figcaption></figure>`).join('')}</div>
<script>window.__fitted=true</script>`;
const sh = path.join(PH, 'sheet.html');
await fs.writeFile(sh, html);
const p2 = await b.page(cols * (cell + 8) + 16, rows * (Math.round(cell * 0.75) + 30) + 24);
await p2.goto(fileUrl(sh));
await new Promise(r => setTimeout(r, 1200));
await fs.writeFile(path.join(PH, 'sheet.png'), await p2.shot());
await p2.close();
await b.close();
console.log('sheet at', path.join(PH, 'sheet.png'), 'images', sheetImgs.length);
