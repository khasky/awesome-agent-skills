#!/usr/bin/env node
// style-mimic crawl ingester: consumes page dumps [{requested,url,title,text,links,error?}],
// maintains state.json + corpus/, classifies serial pages, picks the next batch.
// Usage: node crawl-ingest.mjs --dump <dump.json> --dir <crawlDir> [--origin <url>]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : def;
};
const dumpPath = arg('dump');
const dir = arg('dir');
if (!dir) { console.error('missing --dir'); process.exit(1); }

const SERIAL_QUOTA = 18;
const PAGE_CAP = 300;
const BATCH = 8;
const AUTO_SERIAL = [
  /\/(tags?|categor(y|ies)|author|topics?)\//,
  /\/page\/\d+/, /[?&]page=\d+/,
  /\/\d{4}\/\d{2}(\/|$)/,
  /\/\d{5,}$/,
];
const SKIP = [
  /\.(pdf|jpe?g|png|gif|svg|zip|xml|rss|webp|mp4|ico|css|js|md|txt)$/i, // .md/.txt: markdown mirrors of pages (llms.txt convention) duplicate the HTML
  /(login|logout|sign-?in|sign-?up|cart|checkout|account|unsubscribe|billing|oauth)/i,
  /\/feed$/,
  /^\/(es|fr|de|it|nl|pt)(\/|$)/, // localized mirrors: style is learned from the primary language
];

const statePath = join(dir, 'state.json');
const state = existsSync(statePath)
  ? JSON.parse(readFileSync(statePath, 'utf8'))
  : {
      origin: arg('origin'),
      startedAt: new Date().toISOString(),
      frontier: [],
      visited: [],
      failed: [],
      // discovered: url -> 'n' (non-serial) | 's:<pattern>'
      discovered: {},
      // serial: pattern -> { quota, seen, scheduled: [], pool: [] }
      serial: {},
    };
if (!state.origin) { console.error('missing --origin on first run'); process.exit(1); }

const normalize = (raw) => {
  const u = new URL(raw, state.origin);
  u.hash = '';
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref','fbclid','gclid','cta'].forEach(p => u.searchParams.delete(p));
  let s = u.toString();
  if (s.endsWith('/') && u.pathname !== '/') s = s.slice(0, -1);
  return s;
};
const pathOf = (url) => new URL(url).pathname + new URL(url).search;
const template = (url) => {
  const seg = new URL(url).pathname.split('/').filter(Boolean);
  return seg.length >= 2 ? '/' + seg.slice(0, -1).join('/') + '/*' : null;
};
const matchesSerial = (url) => {
  const p = pathOf(url);
  for (const pat of Object.keys(state.serial)) {
    const prefix = pat.replace(/^auto:/, '').slice(0, -1); // drop '*'
    if (p.startsWith(prefix) && p.length > prefix.length) return pat;
  }
  if (AUTO_SERIAL.some(re => re.test(p))) return 'auto:' + (template(url) ?? p);
  return null;
};
const skippable = (url) => SKIP.some(re => re.test(pathOf(url)));
const slugOf = (url) => {
  const s = pathOf(url).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return s || 'index';
};
const ensureSerial = (pat) => (state.serial[pat] ??= { quota: SERIAL_QUOTA, seen: 0, scheduled: [], pool: [] });
const unqueue = (u) => {
  const i = state.frontier.indexOf(u);
  if (i > -1) state.frontier.splice(i, 1);
  for (const s of Object.values(state.serial)) {
    const j = s.scheduled.indexOf(u);
    if (j > -1) s.scheduled.splice(j, 1);
  }
};

const ingestOne = (dump) => {
  const requested = dump.requested && normalize(dump.requested);
  if (requested) unqueue(requested);

  if (dump.error || !dump.url) {
    state.failed.push({ url: requested ?? dump.url, error: String(dump.error ?? 'no url') });
    if (requested && !state.visited.includes(requested)) state.visited.push(requested);
    return;
  }
  const url = normalize(dump.url);
  if (!url.startsWith(state.origin)) { // redirected off-origin: record, no corpus
    state.failed.push({ url: requested ?? url, error: 'off-origin redirect to ' + url });
    if (requested && !state.visited.includes(requested)) state.visited.push(requested);
    return;
  }
  unqueue(url);
  if (!state.visited.includes(url)) state.visited.push(url);
  if (requested && requested !== url && !state.visited.includes(requested)) state.visited.push(requested);
  state.discovered[url] ??= 'n';

  const serialPat = matchesSerial(url);
  const fm = [
    '---',
    `url: ${url}`,
    `title: ${String(dump.title ?? '').replace(/\n/g, ' ')}`,
    `type: ${serialPat ? 'serial-sample' : 'page'}`,
    ...(serialPat ? [`pattern: ${serialPat}`] : []),
    '---',
    '',
  ].join('\n');
  mkdirSync(join(dir, 'corpus'), { recursive: true });
  writeFileSync(join(dir, 'corpus', slugOf(url) + '.md'), fm + (dump.text ?? ''));

  for (const raw of dump.links ?? []) {
    let u;
    try { u = normalize(raw); } catch { continue; }
    if (!u.startsWith(state.origin)) continue;
    if (skippable(u) || state.discovered[u]) continue;
    const pat = matchesSerial(u);
    if (pat) {
      state.discovered[u] = 's:' + pat;
      const s = ensureSerial(pat);
      s.seen++;
      const have = state.visited.filter(v => state.discovered[v] === 's:' + pat).length + s.scheduled.length;
      if (have < s.quota) { s.scheduled.push(u); state.frontier.push(u); }
      else s.pool.push(u);
    } else {
      state.discovered[u] = 'n';
      state.frontier.push(u);
    }
  }
};

if (dumpPath) {
  const parsed = JSON.parse(readFileSync(dumpPath, 'utf8'));
  for (const d of Array.isArray(parsed) ? parsed : [parsed]) ingestOne(d);

  // promotion: any template with >= 8 non-serial members becomes serial
  const byTemplate = {};
  for (const [u, cls] of Object.entries(state.discovered)) {
    if (cls !== 'n') continue;
    const t = template(u);
    if (t) (byTemplate[t] ??= []).push(u);
  }
  for (const [t, members] of Object.entries(byTemplate)) {
    if (members.length < 8 || state.serial[t]) continue;
    const s = ensureSerial(t);
    for (const m of members) {
      state.discovered[m] = 's:' + t;
      s.seen++;
      if (state.visited.includes(m)) continue;
      const i = state.frontier.indexOf(m);
      if (i > -1) state.frontier.splice(i, 1);
      const have = state.visited.filter(v => state.discovered[v] === 's:' + t).length + s.scheduled.length;
      if (have < s.quota) { s.scheduled.push(m); state.frontier.push(m); }
      else s.pool.push(m);
    }
  }
}

const nonSerial = Object.entries(state.discovered).filter(([, c]) => c === 'n').map(([u]) => u);
const visitedNonSerial = state.visited.filter(u => state.discovered[u] === 'n').length;
const coverage = nonSerial.length ? visitedNonSerial / nonSerial.length : 0;
const quotasMet = Object.values(state.serial).every(s => s.scheduled.length === 0);
const capHit = state.visited.length >= PAGE_CAP;
const done = state.frontier.length === 0 || capHit || (coverage >= 0.8 && quotasMet && state.frontier.every(u => state.discovered[u] !== 'n'));

writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(JSON.stringify({
  nextBatch: done ? [] : state.frontier.slice(0, BATCH),
  visited: state.visited.length,
  discoveredNonSerial: nonSerial.length,
  visitedNonSerial,
  coverage: Math.round(coverage * 100) + '%',
  frontier: state.frontier.length,
  failed: state.failed.length,
  serial: Object.fromEntries(Object.entries(state.serial).map(([p, s]) => [p, `${s.seen} seen, ${s.scheduled.length} queued, ${s.pool.length} pooled`])),
  capHit,
  done,
}));
