import fs from 'node:fs/promises';
import path from 'node:path';
import { Browser } from './cdp.mjs';
import { fileUrl } from './config.mjs';
import { GATE_SRC, judge } from './gate.mjs';
import { setCanvas } from './layouts.mjs';
import { W, H } from './page.mjs';

const OUT = process.argv[2];
const only = process.argv[3] ? new Set(process.argv[3].split(',')) : null;
const set = JSON.parse(await fs.readFile(path.join(OUT, 'set.json'), 'utf8'));
setCanvas(set.width || 1080, set.height || 1350);
const rows = set.variants.filter(v => !only || only.has(v.id));

let b = await Browser.launch();
const report = {};
try { Object.assign(report, JSON.parse(await fs.readFile(path.join(OUT, 'report.json'), 'utf8'))); } catch {}
let pass = 0, fail = 0;
const findings = [];

for (const v of rows) {
  const src = path.join(OUT, 'src', v.id + '.html');
  let m = null, err = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    let p;
    try {
      p = await b.page(W, H);
      const fitted = await p.goto(fileUrl(src), 25000);
      if (!fitted) { err = 'fit did not settle'; await p.close(); continue; }
      m = await p.eval('return ' + GATE_SRC.trim(), 30000);
      const bad = judge(m, {});
      if (bad.length) { fail++; findings.push([v.id, ...bad]); report[v.id] = { ...m, findings: bad }; await p.close(); err = null; break; }
      const png = await p.shot();
      await fs.writeFile(path.join(OUT, v.id + '.png'), png);
      report[v.id] = { ...m, findings: [], bytes: png.length };
      pass++; err = null;
      await p.close();
      break;
    } catch (e) {
      err = e.message;
      try { await p?.close(); } catch {}
      if (/timeout/i.test(e.message)) { await b.close(); b = await Browser.launch(); }
    }
  }
  if (err) { fail++; findings.push([v.id, 'render: ' + err]); report[v.id] = { findings: ['render: ' + err] }; }
}

// R21 duplicate skeletons across the whole set
const skel = new Map();
for (const [id, r] of Object.entries(report)) {
  if (!r.skeleton) continue;
  if (skel.has(r.skeleton)) findings.push([id, 'R21 skeleton matches ' + skel.get(r.skeleton)]);
  else skel.set(r.skeleton, id);
}

await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
await b.close();
console.log('pages', rows.length, 'passed', pass, 'failed', fail);
for (const f of findings) console.log(' -', f.join(' | '));
