import fs from 'node:fs/promises';
import path from 'node:path';
import { Browser } from './cdp.mjs';
import { fileUrl } from './config.mjs';

import { assetCache } from './config.mjs';

const OPT = path.join(assetCache(), 'photos', 'opt');
const PH = path.dirname(OPT);
const imgs = (await fs.readdir(OPT)).filter(f => f.endsWith('.jpg')).sort();
const b = await Browser.launch();
const cols = 6, cw = 220, ch = 165, lab = 26;
for (let s = 0, n = 0; s < imgs.length; s += 24, n++) {
  const part = imgs.slice(s, s + 24);
  const rows = Math.ceil(part.length / cols);
  const W = cols * (cw + 8) + 16, H = rows * (ch + lab + 8) + 16;
  const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:#15151a;font:600 12px/1.2 system-ui,Segoe UI,sans-serif;color:#ddd}
.g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:8px;padding:8px}
img{width:${cw}px;height:${ch}px;object-fit:cover;display:block;background:#000}
figure{margin:0}figcaption{padding:5px 2px;color:#aaa}
</style><div class="g">${part.map(f => `<figure><img src="${fileUrl(path.join(OPT, f))}"><figcaption>${f.replace(/[.]jpg$/, '')}</figcaption></figure>`).join('')}</div>
<script>Promise.all([...document.images].map(i=>i.decode().catch(()=>0))).then(()=>{window.__fitted=true})</script>`;
  const f = path.join(PH, `sheet-${n + 1}.html`);
  await fs.writeFile(f, html);
  const p = await b.page(W, H);
  const okd = await p.goto(fileUrl(f), 20000);
  await new Promise(r => setTimeout(r, 400));
  const png = await p.shot();
  await fs.writeFile(path.join(PH, `sheet-${n + 1}.png`), png);
  await p.close();
  console.log('sheet', n + 1, part.length, 'images', W + 'x' + H, okd ? 'fitted' : 'nofit', png.length + ' bytes');
}
await b.close();
