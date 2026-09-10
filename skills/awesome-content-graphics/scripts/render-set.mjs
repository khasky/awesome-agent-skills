#!/usr/bin/env node
// Render a whole set in one browser: geometry gate per page, screenshot on pass,
// set-level duplicate sweep and quotas, contact sheets and a gallery.
//
//   node scripts/render-set.mjs <run-folder> [--width 1080] [--height 1080] [--scale 2] [--only 03,07]
//
// Reads <run>/src/*.html (and <run>/set.json when present, for kinds and subjects).
// Writes <run>/<name>.png for every page that passes, <run>/report.json for all of them,
// <run>/contact-sheet-N.png and <run>/gallery.html. Exit 0 when every page passed and
// the set carries no duplicate; otherwise exit 1 with one line per finding.
// Node 22+, no npm dependencies; needs a Chromium-family browser (see cdp.mjs).

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { launch } from "./cdp.mjs";

const GEOMETRY = String.raw`(() => {
  const W = innerWidth, H = innerHeight, m = 0.04;
  const marks = [...document.querySelectorAll('[data-mark]')];
  const over = [], cells = new Set();
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (const el of marks) {
    const r = el.getBoundingClientRect();
    const sides = { left: r.left < W*m, right: r.right > W*(1-m), top: r.top < H*m, bottom: r.bottom > H*(1-m) };
    for (const s in sides) if (sides[s]) over.push(el.dataset.mark + ':' + s);
    x0 = Math.min(x0, Math.max(r.left, 0)); y0 = Math.min(y0, Math.max(r.top, 0));
    x1 = Math.max(x1, Math.min(r.right, W)); y1 = Math.max(y1, Math.min(r.bottom, H));
    for (let c = 0; c < 10; c++) for (let v = 0; v < 10; v++)
      if (r.left < W*(c+1)/10 && r.right > W*c/10 && r.top < H*(v+1)/10 && r.bottom > H*v/10) cells.add(c + ',' + v);
  }
  let voidBlock = false;
  for (let c = 0; c <= 6; c++) for (let v = 0; v <= 6; v++) {
    let empty = true;
    for (let i = c; i < c+4 && empty; i++) for (let j = v; j < v+4 && empty; j++) if (cells.has(i + ',' + j)) empty = false;
    if (empty) voidBlock = true;
  }
  const headEl = document.querySelector('[data-mark="headline"]');
  const head = headEl ? headEl.getBoundingClientRect() : { width: 0, height: 0 };
  const lines = [...document.querySelectorAll('[data-line]')].map(el => el.getBoundingClientRect()).sort((a,b) => a.top - b.top);
  const gaps = lines.slice(1).map((r,i) => r.top - lines[i].bottom);
  const lh = Math.max(1, lines[0] ? lines[0].height : 1);
  const gapMin = gaps.length ? Math.min(...gaps) / lh : 1;
  const gapSpread = gaps.length < 2 ? 0 : (Math.max(...gaps) - Math.min(...gaps)) / lh;
  const lineOver = lines.filter(r => r.left < W*m || r.right > W*(1-m)).length;
  const wrapped = [...document.querySelectorAll('[data-line]')].filter(el => el.getBoundingClientRect().height > parseFloat(getComputedStyle(el).fontSize) * 1.7).length;
  const STOP = new Set(['a','an','the','of','in','on','at','to','and','or','is','it','for','per']);
  const words = el => el.textContent.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' ').filter(w => w && !STOP.has(w));
  const headWords = new Set();
  for (const el of document.querySelectorAll('[data-line]')) words(el).forEach(w => headWords.add(w));
  const dup = [];
  for (const el of document.querySelectorAll('[data-value],[data-caption],[data-mark="wordmark"],[data-echo]'))
    for (const w of words(el)) if (headWords.has(w)) dup.push(w);
  const digits = [...document.body.textContent.matchAll(/\d+/g)].map(x => x[0]);
  const dupDigits = digits.filter((d,i) => digits.indexOf(d) !== i);
  const fitFail = [];
  for (const el of document.querySelectorAll('[data-fit]')) {
    const c = document.getElementById(el.dataset.fit); if (!c) { fitFail.push(el.dataset.fit + ':missing'); continue; }
    const box = c.getBoundingClientRect(), r = el.getBoundingClientRect(), padX = box.width*0.1, padY = box.height*0.1;
    if (r.left < box.left+padX || r.right > box.right-padX || r.top < box.top+padY || r.bottom > box.bottom-padY) fitFail.push(el.dataset.fit);
  }
  const clipped = [];
  for (const el of marks) {
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) clipped.push(el.dataset.mark + ':self');
    const r = el.getBoundingClientRect();
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a); if (cs.overflow === 'visible') continue;
      const b = a.getBoundingClientRect();
      if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) clipped.push(el.dataset.mark + ':ancestor');
    }
  }
  const subjEl = document.querySelector('[data-mark="subject"]');
  let plated = false;
  if (subjEl) for (let a = subjEl.parentElement; a && a !== document.body; a = a.parentElement) {
    const cs = getComputedStyle(a);
    const painted = cs.backgroundImage !== 'none' || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
    if (painted && a.getBoundingClientRect().width < W * 0.9) plated = true;
  }
  const skeleton = marks.map(el => { const r = el.getBoundingClientRect(), q = v => Math.round(v * 20);
    return el.dataset.mark + ':' + q(r.left/W) + ',' + q(r.top/H) + ',' + q(r.width/W) + ',' + q(r.height/H); }).sort().join('|');
  const figs = [...document.querySelectorAll('[data-figure]')];
  const unlabelled = figs.filter(f => f.querySelectorAll('[data-value]').length < 2 && !(f.querySelector('[data-value]') && f.querySelector('[data-caption]'))).length;
  const uncaptioned = figs.filter(f => !f.querySelector('[data-caption]')).length;
  let clearance = 1;
  if (subjEl) { const s = subjEl.getBoundingClientRect();
    for (const r of lines) { const dx = Math.max(s.left - r.right, r.left - s.right), dy = Math.max(s.top - r.bottom, r.top - s.bottom);
      clearance = Math.min(clearance, Math.max(dx, dy) / W); } }
  const stroke = [...document.querySelectorAll('[data-line]')].some(el => { const cs = getComputedStyle(el);
    return (cs.webkitTextStrokeWidth && parseFloat(cs.webkitTextStrokeWidth) > 0) || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)'; });
  return { marks: marks.length, over, spanX: (x1-x0)/W, spanY: (y1-y0)/H, voidBlock, headW: head.width/W, headH: head.height/H,
           gapMin, gapSpread, lineOver, wrapped, clearance, dup, dupDigits, fitFail, unlabelled, uncaptioned, clipped, plated, skeleton, stroke,
           hasHeadline: !!headEl, lines: lines.length };
})()`;

function gate(g) {
  const f = [];
  if (!g.hasHeadline) f.push("no [data-mark=headline]");
  if (!g.lines) f.push("no [data-line]");
  if (g.over.length) f.push("R1 over: " + g.over.join(" "));
  if (g.gapMin < 0.06) f.push(`R2 gapMin ${g.gapMin.toFixed(3)}`);
  if (g.gapSpread > 0.08) f.push(`R2 gapSpread ${g.gapSpread.toFixed(3)}`);
  if (g.lineOver) f.push(`R2 lineOver ${g.lineOver}`);
  if (g.wrapped) f.push(`R2 ${g.wrapped} headline line(s) wrapped inside their box`);
  if (g.clearance < 0.02) f.push(`R3 clearance ${g.clearance.toFixed(3)}`);
  if (g.fitFail.length) f.push("R4 fit: " + g.fitFail.join(" "));
  if (g.dup.length) f.push("R5 dup: " + g.dup.join(" "));
  if (g.dupDigits.length) f.push("R6 dupDigits: " + g.dupDigits.join(" "));
  if (g.unlabelled) f.push(`R7 unlabelled ${g.unlabelled}`);
  if (g.uncaptioned) f.push(`R8 uncaptioned ${g.uncaptioned}`);
  if (g.stroke) f.push("R9 outlined or hollow type");
  if (g.spanX < 0.8 || g.spanY < 0.8) f.push(`R11 span ${g.spanX.toFixed(2)}x${g.spanY.toFixed(2)}`);
  if (g.voidBlock) f.push("R11 void 40% block");
  if (g.headW < 0.7 || g.headH < 0.22) f.push(`R11 headline ${g.headW.toFixed(2)}w ${g.headH.toFixed(2)}h`);
  if (g.clipped.length) f.push("R16 clipped: " + g.clipped.join(" "));
  if (g.plated) f.push("R18 plated subject");
  return f;
}

const THUMB = 24;
const DISTANCE_FLOOR = 0.07;

async function thumbnails(page, pngs) {
  const list = JSON.stringify(pngs.map((p) => pathToFileURL(p).href));
  return page.evaluate(String.raw`(async () => {
    const out = [];
    for (const src of ${list}) {
      const img = new Image(); img.src = src; await img.decode();
      const c = document.createElement('canvas'); c.width = ${THUMB}; c.height = ${THUMB};
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, ${THUMB}, ${THUMB});
      const d = x.getImageData(0, 0, ${THUMB}, ${THUMB}).data, g = [];
      for (let i = 0; i < d.length; i += 4) g.push((0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2]) / 255);
      out.push(g);
    }
    return out;
  })()`);
}

function distance(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function sheetHtml(items, cols) {
  const cell = 440;
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#111;color:#eee;font:16px/1.3 system-ui,sans-serif}
    .g{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:16px;padding:16px}
    .c img{width:${cell}px;height:auto;display:block;background:#000}
    .c div{padding:6px 2px 0;font-size:15px;color:#bbb}.c b{color:#fff}
    .fail img{outline:4px solid #e5484d}</style>
    <div class="g">${items.map((it) => `<div class="c${it.ok ? "" : " fail"}"><img src="${esc(it.src)}"><div><b>${esc(it.n)}</b> ${esc(it.kind ?? "")} ${it.ok ? "" : "· " + esc(it.fail)}</div></div>`).join("")}</div>`;
}

async function main(argv) {
  const args = argv.filter((a) => !a.startsWith("--"));
  const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  if (!args[0]) { console.log("usage: node scripts/render-set.mjs <run-folder> [--width N] [--height N] [--scale N] [--only a,b]"); return 2; }
  const run = resolve(args[0]);
  const src = join(run, "src");
  if (!existsSync(src)) { console.error(`no src/ under ${run}`); return 2; }
  const width = +opt("--width", 1080), height = +opt("--height", 1080), scale = +opt("--scale", 2);
  const only = opt("--only", "") ? new Set(opt("--only", "").split(",")) : null;
  const set = existsSync(join(run, "set.json")) ? JSON.parse(readFileSync(join(run, "set.json"), "utf8")) : null;
  const rows = new Map((set?.variants ?? []).map((v) => [String(v.id), v]));

  const pages = readdirSync(src).filter((f) => f.endsWith(".html")).sort()
    .filter((f) => !only || only.has(f.replace(/\.html$/, "")));
  const browser = await launch({ width, height, scale });
  const report = { renderer: browser.exe, width, height, scale, variants: [], set: {} };
  const findings = [];
  try {
    const page = await browser.newPage();
    for (const f of pages) {
      const name = f.replace(/\.html$/, "");
      await page.goto(pathToFileURL(join(src, f)).href);
      const g = await page.evaluate(GEOMETRY);
      const fails = gate(g);
      const entry = { name, ok: !fails.length, fails, geometry: g, kind: rows.get(name)?.kind, subject: rows.get(name)?.subject };
      if (!fails.length) writeFileSync(join(run, name + ".png"), await page.screenshot());
      else for (const x of fails) findings.push(`${name}: ${x}`);
      report.variants.push(entry);
    }

    // set-level: skeleton uniqueness (R21)
    const bySkel = new Map();
    for (const v of report.variants.filter((v) => v.ok)) {
      const k = v.geometry.skeleton;
      if (bySkel.has(k)) findings.push(`${v.name}: R21 same layout skeleton as ${bySkel.get(k)}`);
      else bySkel.set(k, v.name);
    }
    // set-level: perceptual distance (R21)
    const okNames = report.variants.filter((v) => v.ok).map((v) => v.name);
    const pngs = okNames.map((n) => join(run, n + ".png"));
    const pairs = [];
    if (pngs.length > 1) {
      const th = await thumbnails(page, pngs);
      for (let i = 0; i < th.length; i++) for (let j = i + 1; j < th.length; j++) {
        const d = distance(th[i], th[j]);
        if (d < DISTANCE_FLOOR) { pairs.push([okNames[i], okNames[j], +d.toFixed(3)]); findings.push(`${okNames[j]}: R21 too close to ${okNames[i]} (${d.toFixed(3)})`); }
      }
    }
    report.set.closePairs = pairs;
    // set-level: quotas (R12), when set.json names kinds
    if (rows.size) {
      const kinds = report.variants.map((v) => v.kind).filter(Boolean);
      const n = kinds.length || 1;
      const share = (k) => kinds.filter((x) => x === k).length / n;
      const q = { statement: share("statement"), glyph: share("glyph"), lockup: share("lockup"), figure: share("figure") };
      report.set.kindShares = q;
      if (q.statement > 0.15) findings.push(`set: R12 statements ${(q.statement * 100).toFixed(0)}% > 15%`);
      if (q.figure < 1 / 3 && n >= 5) findings.push(`set: R12 data figures ${(q.figure * 100).toFixed(0)}% < 33%`);
      const subj = report.variants.filter((v) => v.kind === "glyph");
      const drawn = subj.filter((v) => rows.get(v.name)?.subjectType === "icon").length;
      if (subj.length >= 3 && drawn / subj.length < 1 / 3) findings.push(`set: R12 drawn icons ${drawn}/${subj.length} < a third of subject canvases`);
    }

    // contact sheets + gallery over everything rendered so far in the folder
    const all = readdirSync(run).filter((f) => /^\d+.*\.png$/.test(f) && !f.startsWith("contact-sheet")).sort();
    const items = all.map((f) => {
      const name = f.replace(/\.png$/, "");
      const v = report.variants.find((x) => x.name === name);
      return { n: name, src: f, kind: rows.get(name)?.kind, ok: v ? v.ok : true, fail: v?.fails?.[0] ?? "" };
    });
    const cols = 5, per = 25;
    const sheets = [];
    for (let i = 0; i < items.length; i += per) {
      const chunk = items.slice(i, i + per);
      const idx = sheets.length + 1;
      const html = join(run, `contact-sheet-${idx}.html`);
      writeFileSync(html, sheetHtml(chunk, cols));
      const rowsN = Math.ceil(chunk.length / cols);
      const sp = await browser.newPage();
      await sp.setViewport(cols * 456 + 16, rowsN * (440 * height / width + 46) + 16, 1);
      await sp.goto(pathToFileURL(html).href);
      writeFileSync(join(run, `contact-sheet-${idx}.png`), await sp.screenshot());
      await sp.close();
      sheets.push(`contact-sheet-${idx}.png`);
    }
    writeFileSync(join(run, "gallery.html"), `<!doctype html><meta charset="utf-8"><title>set</title><style>
      body{margin:0;background:#111;color:#eee;font:15px system-ui,sans-serif}
      .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:14px;padding:14px}
      img{width:100%;display:block;background:#000}.c div{padding:6px 2px}</style>
      <div class="g">${items.map((it) => `<div class="c"><img src="${esc(it.src)}" loading="lazy"><div><b>${esc(it.n)}</b> ${esc(it.kind ?? "")}</div></div>`).join("")}</div>`);
    report.set.sheets = sheets;
    report.set.gallery = "gallery.html";
  } finally {
    await browser.close();
  }
  report.findings = findings;
  writeFileSync(join(run, "report.json"), JSON.stringify(report, null, 1));
  const passed = report.variants.filter((v) => v.ok).length;
  for (const f of findings) console.log(f);
  console.log(`${passed}/${report.variants.length} pages passed the gate; ${findings.length} finding(s); renderer ${basename(browser.exe)}; sheets ${report.set.sheets?.length ?? 0}`);
  return findings.length ? 1 : 0;
}

process.exit(await main(process.argv.slice(2)));
