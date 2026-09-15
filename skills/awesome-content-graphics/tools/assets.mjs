import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

import { assetCache } from './config.mjs';

const CACHE = assetCache();

export const FACE_WEIGHTS = {
  'Sora': [700, 800],
  'Inter': [700, 900],
  'Archivo': [600, 800],
  'Space Grotesk': [700],
  'Fraunces': [700],
  'Playfair Display': [800],
  'Instrument Serif': [400],
};

export async function loadFonts() {
  const dir = path.join(CACHE, 'fonts');
  const files = (await fs.readdir(dir)).filter(f => f.endsWith('.woff2'));
  const out = {};
  for (const f of files) {
    const b64 = (await fs.readFile(path.join(dir, f))).toString('base64');
    const m = f.replace(/[.]woff2$/, '');
    const w = +m.slice(m.lastIndexOf('-') + 1);
    const slug = m.slice(0, m.lastIndexOf('-'));
    const fam = Object.keys(FACE_WEIGHTS).find(k => k.toLowerCase().replace(/ /g, '-') === slug);
    if (!fam) continue;
    (out[fam] = out[fam] || []).push({ w, b64 });
  }
  return out;
}

export async function loadIcons() {
  const dir = path.join(CACHE, 'icons');
  const out = {};
  for (const f of (await fs.readdir(dir)).filter(x => x.endsWith('.svg'))) {
    let s = await fs.readFile(path.join(dir, f), 'utf8');
    s = s.replace(/<!--[^]*?-->/g, '').trim();
    s = s.replace(/width="[^"]*"/, '').replace(/height="[^"]*"/, '');
    s = s.replace(/stroke="[^"]*"/, 'stroke="currentColor"');
    s = s.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
    out[f.replace(/[.]svg$/, '')] = s;
  }
  return out;
}

export async function loadPhotos(slugs) {
  const dir = path.join(CACHE, 'photos', 'opt');
  const out = {};
  for (const s of slugs) {
    try { out[s] = (await fs.readFile(path.join(dir, s + '.jpg'))).toString('base64'); } catch {}
  }
  return out;
}

export async function credits() {
  return JSON.parse(await fs.readFile(path.join(CACHE, 'photos', 'credits.json'), 'utf8'));
}

// --- a tiny grayscale-alpha noise PNG, rasterised once at build time ---
function crcTable() {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
}
const CRC = crcTable();
function crc32(buf) { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
export function grainTile(size = 96, alpha = 26, seed = 7) {
  const rows = [];
  let s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 2);
    for (let x = 0; x < size; x++) {
      const v = rnd();
      row[1 + x * 2] = v > 0.5 ? 255 : 0;
      row[1 + x * 2 + 1] = Math.round(alpha * Math.abs(v - 0.5) * 2);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 4; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png.toString('base64');
}
