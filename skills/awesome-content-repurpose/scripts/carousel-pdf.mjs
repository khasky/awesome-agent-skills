#!/usr/bin/env node
// Assembles rendered slides into the PDF a LinkedIn document post takes: one page per slide, in the
// order given, each page the size of its slide. Instagram takes the same slides as separate images.
//
//   node scripts/carousel-pdf.mjs <out.pdf> <slide-1.png> <slide-2.png> [...]
//   node scripts/carousel-pdf.mjs --self-test
//
// Reads 8-bit RGB or RGBA non-interlaced PNG, which is what a browser screenshot writes; transparency
// is flattened onto white. Node 18+, no dependencies.

import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
import { join, basename } from "node:path";
import { tmpdir } from "node:os";

export function decodePng(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let pos = 8, width = 0, height = 0, depth = 0, color = 0, interlace = 0;
  const idat = [];
  while (pos + 8 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") [width, height, depth, color, interlace] = [data.readUInt32BE(0), data.readUInt32BE(4), data[8], data[9], data[12]];
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (depth !== 8 || (color !== 2 && color !== 6) || interlace !== 0) {
    throw new Error(`unsupported PNG (bit depth ${depth}, colour type ${color}, interlace ${interlace}): export 8-bit RGB or RGBA`);
  }
  const bpp = color === 6 ? 4 : 3;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = px.subarray(y * stride, (y + 1) * stride);
    const prev = y ? px.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev ? prev[i] : 0, c = prev && i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 255;
    }
  }
  if (bpp === 3) return { width, height, rgb: px };
  const rgb = Buffer.alloc(width * height * 3);
  for (let i = 0, j = 0; i < px.length; i += 4, j += 3) {
    const alpha = px[i + 3] / 255;
    for (let k = 0; k < 3; k++) rgb[j + k] = Math.round(px[i + k] * alpha + 255 * (1 - alpha));
  }
  return { width, height, rgb };
}

// One page per slide at 96 dpi (a 1080 px slide is a 810 pt page), the image drawn edge to edge.
export function buildPdf(slides) {
  const objs = [];
  const add = (o) => objs.push(o);
  add(null); // 1: catalog
  add(null); // 2: page tree
  const kids = [];
  for (const s of slides) {
    const [w, h] = [+(s.width * 0.75).toFixed(2), +(s.height * 0.75).toFixed(2)];
    const data = deflateSync(s.rgb);
    add(Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${s.width} /Height ${s.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${data.length} >>\nstream\n`),
      data, Buffer.from("\nendstream"),
    ]));
    const img = objs.length;
    const draw = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
    add(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
    const content = objs.length;
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${img} 0 R >> >> /Contents ${content} 0 R >>`);
    kids.push(objs.length);
  }
  objs[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objs[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;
  const parts = [Buffer.from("%PDF-1.4\n")];
  let offset = parts[0].length;
  const offsets = [];
  objs.forEach((o, i) => {
    const b = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), Buffer.isBuffer(o) ? o : Buffer.from(o), Buffer.from("\nendobj\n")]);
    offsets.push(offset);
    offset += b.length;
    parts.push(b);
  });
  parts.push(Buffer.from(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
    + offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")
    + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`));
  return Buffer.concat(parts);
}

function selfTest() {
  // a 2x2 RGBA slide written with the Sub filter, its last pixel transparent (flattens to white)
  const rgba = [255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 0];
  const raw = Buffer.alloc(2 * 9);
  for (let y = 0; y < 2; y++) {
    raw[y * 9] = 1;
    for (let i = 0; i < 8; i++) raw[y * 9 + 1 + i] = (rgba[y * 8 + i] - (i >= 4 ? rgba[y * 8 + i - 4] : 0)) & 255;
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    return Buffer.concat([len, Buffer.from(type, "ascii"), data, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(2, 0);
  ihdr.writeUInt32BE(2, 4);
  [ihdr[8], ihdr[9]] = [8, 6];
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
  const dir = mkdtempSync(join(tmpdir(), "carousel-"));
  try {
    const slide = join(dir, "s.png");
    writeFileSync(slide, png);
    const expect = [255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255];
    const got = [...decodePng(readFileSync(slide)).rgb];
    if (got.join() !== expect.join()) { console.log("self-test FAILED: decoded pixels", got); return 1; }
    const out = join(dir, "c.pdf");
    if (main([out, slide, slide]) !== 0) { console.log("self-test FAILED: assembly exited non-zero"); return 1; }
    const pdf = readFileSync(out).toString("latin1");
    const pages = (pdf.match(/\/Type \/Page /g) ?? []).length;
    const xref = pdf.slice(pdf.lastIndexOf("xref\n")).split("\n").slice(3).filter((l) => / 00000 n $/.test(l)).map((l) => Number(l.slice(0, 10)));
    const aligned = xref.every((o, i) => pdf.startsWith(`${i + 1} 0 obj`, o));
    const start = Number(pdf.match(/startxref\n(\d+)/)[1]);
    if (!pdf.startsWith("%PDF-1.4") || pages !== 2 || !aligned || !pdf.startsWith("xref", start)) {
      console.log("self-test FAILED: pdf structure", { pages, aligned, start });
      return 1;
    }
    console.log("self-test OK: PNG filters and alpha decoded, 2-page PDF with a valid xref");
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const [out, ...slides] = argv;
  if (!out || slides.length < 2) {
    console.log("usage: node scripts/carousel-pdf.mjs <out.pdf> <slide-1.png> <slide-2.png> [...] | --self-test");
    return 2;
  }
  const missing = slides.filter((s) => !existsSync(s));
  if (missing.length) { console.log(`missing: ${missing.join(", ")}`); return 2; }
  writeFileSync(out, buildPdf(slides.map((s) => decodePng(readFileSync(s)))));
  console.log(`${out}: ${slides.length} pages`);
  return 0;
}

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  process.exit(main(process.argv.slice(2)));
}
