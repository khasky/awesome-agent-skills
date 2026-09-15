import fs from 'node:fs/promises';
import path from 'node:path';
import { loadFonts, loadIcons, loadPhotos, grainTile, FACE_WEIGHTS } from './assets.mjs';
import { baseCss, fontCss, fitScript, ground } from './page.mjs';
import { LAYOUTS, layoutKey, setCanvas } from './layouts.mjs';
import { byName } from './palettes.mjs';

const OUT = process.argv[2];
const SET = path.join(OUT, 'set.json');
const only = process.argv[3] ? new Set(process.argv[3].split(',')) : null;

const set = JSON.parse(await fs.readFile(SET, 'utf8'));
setCanvas(set.width || 1080, set.height || 1350);
const fonts = await loadFonts();
const icons = await loadIcons();
const photoSlugs = [...new Set(set.variants.filter(v => v.photo).map(v => v.photo))];
const photos = await loadPhotos(photoSlugs);
const missingPhotos = photoSlugs.filter(s => !photos[s]);
if (missingPhotos.length) throw new Error('photos not in cache: ' + missingPhotos.join(','));
const grain = grainTile();
const ctx = { icons, photos };

await fs.mkdir(path.join(OUT, 'src'), { recursive: true });
let n = 0;
for (const v of set.variants) {
  if (only && !only.has(v.id)) continue;
  const row = { ...v, palette: byName[v.palette] || v.palette };
  if (!row.palette || !row.palette.bg) throw new Error('bad palette on ' + v.id);
  const key = layoutKey(row);
  const fn = LAYOUTS[key];
  if (!fn) throw new Error('no layout ' + key + ' on ' + v.id);
  const weights = FACE_WEIGHTS[row.face] || [700];
  const g = ground(row, grain);
  const serif = 'Instrument Serif';
  const vars = `--bg:${row.palette.bg};--fg:${row.palette.fg};--accent:${row.palette.accent};--muted:${row.palette.muted};--face:"${row.face}",system-ui,sans-serif;--serif:"${serif}",Georgia,serif;--fw:${Math.max(...weights)};--fwlight:${Math.min(...weights)}`;
  const html = `<!doctype html><html lang="${set.lang || 'en'}"><head><meta charset="utf-8"><style>
${fontCss(fonts, row.face)}${row.face !== serif ? fontCss(fonts, serif) : ''}
:root{${vars}}
${baseCss()}
</style></head><body data-id="${row.id}">
${g.html}
<div class="stage">${fn(row, ctx)}</div>
<script>${fitScript([row.face, serif], [...new Set([...weights, 400])])}</script>
</body></html>`;
  await fs.writeFile(path.join(OUT, 'src', row.id + '.html'), html);
  n++;
}
console.log('built', n, 'pages into', path.join(OUT, 'src'));
