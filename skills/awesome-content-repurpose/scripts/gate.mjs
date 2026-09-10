#!/usr/bin/env node
// Mechanical gate for a repurpose run: every check a script can settle, in one pass.
//
//   node scripts/gate.mjs <posts-folder> [--subset] [--json]
//   node scripts/gate.mjs --self-test
//
// Exit 0 when nothing fails. Exit 1 with one `slug: check: detail` line per finding.
// --subset accepts fewer than the canonical 26 files (a run the user trimmed).
// Judgment passes (fidelity, structure, slop, register) are not here; see SKILL.md Phase 5.
// Node 18+, no dependencies.

import { readdirSync, readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { tmpdir } from "node:os";

const CAPS = { x: 280, bluesky: 300, threads: 500, mastodon: 500, peerlist: 480, "wonderful-dev": 2000 };
const BANDS = {
  linkedin: [1200, 2400], "facebook-wall": [900, 1500], threads: [350, 475],
  instagram: [900, 1600], pinterest: [200, 400], x: [230, 270],
  tumblr: [1200, 2600], mastodon: [400, 475], bluesky: [250, 290],
  "wonderful-dev": [1400, 1900], truthsocial: [350, 500], peerlist: [380, 460],
  minds: [700, 1400], patreon: [1500, 3000], "ko-fi": [1500, 3500],
  buymeacoffee: [1500, 5000], bastyon: [450, 950], devto: [3000, 6000],
  hashnode: [2200, 5000], hackernoon: [4500, 7000], medium: [4500, 8000],
  "daily-dev": [1100, 2400], lemmy: [800, 1600], nostr: [250, 400],
  substack: [4000, 8000], reddit: [1100, 2200],
};
const PLATFORMS = new Set(Object.keys(BANDS));
// body hashtag count per platform; null = verified live, not gated here
const HASHTAGS = {
  x: [1, 2], threads: [1, 1], instagram: [3, 5], linkedin: [3, 5],
  mastodon: [3, 5], bluesky: [1, 3], pinterest: [2, 5], "facebook-wall": [0, 3],
  truthsocial: [3, 5], minds: [3, 5], bastyon: [3, 5],
  "wonderful-dev": [0, 4], "daily-dev": [0, 4],
  peerlist: [0, 0], reddit: [0, 0], lemmy: [0, 0],
  tumblr: [0, 0], devto: [0, 0], hashnode: [0, 0], hackernoon: [0, 0],
  medium: [0, 0], substack: [0, 0],
  "ko-fi": null, buymeacoffee: null, patreon: null, nostr: null,
};
const NON_ASCII_PUNCT = /[—–―‘’“”→]/;
const META_LABEL = /^(Title|Description|Platform|Character count|Hashtags):/m;
const ASSISTANT_HOSTS = [
  "chatgpt.com", "chat.openai.com", "claude.ai", "gemini.google.com",
  "aistudio.google.com", "notebooklm.google.com", "chat.deepseek.com", "grok.com",
  "copilot.microsoft.com", "chat.mistral.ai", "chat.qwen.ai", "kimi.com", "poe.com",
  "perplexity.ai", "hf.co/chat", "you.com", "phind.com", "meta.ai", "character.ai",
];
const URL_IN_PARENS = /(?<!\])\(https?:\/\/[^)\s]+\)/;
const MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec";
const RU_MONTHS = "января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря";
const CALENDAR_DATE = new RegExp(
  String.raw`\b(19|20)\d\d[-./](0?[1-9]|1[0-2])[-./](0?[1-9]|[12]\d|3[01])\b` +
  String.raw`|\b(0?[1-9]|[12]\d|3[01])\s+(${MONTHS})[a-z]*\.?\s+(19|20)\d\d\b` +
  String.raw`|\b(${MONTHS})[a-z]*\.?\s+(0?[1-9]|[12]\d|3[01]),?\s+(19|20)\d\d\b` +
  String.raw`|\bas of\s+(${MONTHS})[a-z]*\b` +
  String.raw`|(^|\s)(0?[1-9]|[12]\d|3[01])\s+(${RU_MONTHS})(?=\s|[.,;:!?]|$)`,
  "iu",
);
const LITERARY = [
  "duller", "says it outright", String.raw`\bthus\b`, String.raw`\bhence\b`, "myriad", "plethora",
  "albeit", "bespoke", "salient", "wherein", "heretofore", "deliberately", String.raw`\bdelve`,
  "tapestry", "testament to", String.raw`\bleverag`, "seamless", String.raw`\brobust\b`, "cutting-edge",
  "pivotal", String.raw`\brealm\b`, "paramount", "holistic", "state-of-the-art",
].map((w) => [w.replace(/\\b/g, ""), new RegExp(w, "i")]);
const HYPE = [
  "this changes everything", "game changer", "game-changer", "absolutely revolutionary",
  "the future is here", "a new era", "to the next level", "revolutioniz",
];
const BANNED_OPENERS = [
  [/^something (important|interesting|big|strange|weird) (happened|is happening)/, "vague event"],
  [/^(ai|generative ai|llms?|agents?|local llms|ai (video|code review|coding|agents))\b[^.!?]{0,60}\b(crossed a line|is starting to look|is moving from|just became|has entered|is entering|is arriving|is maturing)/, "abstract category as actor"],
  [/^a (strange|funny|weird|curious|small) thing happened/, "mystery tease"],
  [/^(this|last) week,? (something|ai|a lot)/, "vague time"],
];
const EMOJI_START = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;

function splitFrontmatter(text) {
  if (!text.startsWith("---")) return [{}, text];
  const end = text.indexOf("\n---", 3);
  if (end < 0) return [{}, text];
  const raw = text.slice(3, end);
  const body = text.slice(end + 4).replace(/^\n+/, "");
  const fm = {};
  let key = null;
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (m) {
      key = m[1];
      const val = m[2].trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        fm[key] = val.slice(1, -1).split(",").map((v) => v.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
      } else if (val === "") {
        fm[key] = [];
      } else {
        fm[key] = val.replace(/^['"]|['"]$/g, "");
      }
    } else if (key !== null && /^\s+-\s+/.test(line)) {
      if (!Array.isArray(fm[key])) fm[key] = [];
      fm[key].push(line.replace(/^\s+-\s+/, "").trim().replace(/^['"]|['"]$/g, ""));
    }
  }
  return [fm, body];
}

function stripCode(body) {
  const out = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) { fence = !fence; continue; }
    if (!fence) out.push(line.replace(/`[^`]*`/g, ""));
  }
  return out.join("\n");
}

const isBlock = (s) => /^(#|-|\*|>|\||!\[)/.test(s);

function paragraphs(prose) {
  return prose.split(/\n\s*\n/).map((b) => b.trim()).filter((b) => b && !isBlock(b));
}

function firstProseLine(prose) {
  for (const line of prose.split("\n")) {
    const s = line.trim();
    if (s && !/^(#|!|\[|>|-|\*|\|)/.test(s)) return s;
  }
  return "";
}

function checkPost(path, folder) {
  const findings = [];
  const text = readFileSync(path, "utf8");
  const stem = basename(path).replace(/\.md$/, "");
  const fields = stem.split("_");
  const slug = fields[fields.length - 1] ?? "";
  if (fields.length !== 5) findings.push(["filename", `expected 5 underscore fields, got ${fields.length}`]);
  if (!PLATFORMS.has(slug)) {
    findings.push(["filename", `unknown platform slug '${slug}'`]);
    return [slug, findings];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields[0]) || !/^\d{2}-\d{2}$/.test(fields[1])) {
    findings.push(["filename", "date/time prefix malformed"]);
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(fields[3])) findings.push(["filename", "title slug must match [a-z0-9][a-z0-9-]*"]);

  const [fm, rawBody] = splitFrontmatter(text);
  if (fm.platform !== undefined && fm.platform !== slug) {
    findings.push(["frontmatter", `platform '${fm.platform}' disagrees with filename '${slug}'`]);
  }
  const title = typeof fm.title === "string" ? fm.title : "";
  if (title) {
    if (title.length > 70) findings.push(["title", `${title.length} chars, hard cap 70`]);
    if (title.trimEnd().endsWith(".")) findings.push(["title", "ends with a period"]);
  }
  for (const att of Array.isArray(fm.attachments) ? fm.attachments : []) {
    const name = String(att).replace(/^\{?file:\s*/, "").split(",")[0].replace(/[{}'" ]/g, "");
    if (name && !existsSync(join(folder, name)) && !existsSync(name)) {
      findings.push(["attachments", `missing on disk: ${name}`]);
    }
  }

  const body = rawBody.trim();
  const n = body.length;
  const prose = stripCode(body);
  const low = prose.toLowerCase();

  if (NON_ASCII_PUNCT.test(prose)) findings.push(["punctuation", "em/en dash, curly quote or arrow present"]);
  if (body.includes("#show")) findings.push(["forbidden", "#show"]);
  if (META_LABEL.test(body)) findings.push(["forbidden", "internal label (Title:/Description:/...) in body"]);
  for (const host of ASSISTANT_HOSTS) {
    if (text.toLowerCase().includes(host)) findings.push(["links", `assistant domain ${host}`]);
  }
  if (URL_IN_PARENS.test(prose)) findings.push(["links", "bare URL inside parentheses"]);
  if (CALENDAR_DATE.test(prose)) findings.push(["dates", "calendar date in prose"]);
  const lit = LITERARY.filter(([, re]) => re.test(low)).map(([w]) => w);
  if (lit.length) findings.push(["vocabulary", "literary: " + lit.join(", ")]);
  const hype = HYPE.filter((w) => low.includes(w));
  if (hype.length) findings.push(["hype", hype.join(", ")]);

  if (slug in CAPS && n > CAPS[slug] * 0.98) findings.push(["cap", `${n} chars against ${CAPS[slug]} (98% margin)`]);
  const [lo, hi] = BANDS[slug];
  if (n < lo) findings.push(["band", `${n} chars, under ${lo}`]);
  else if (n > hi) findings.push(["band", `${n} chars, over ${hi}`]);

  const paras = paragraphs(prose);
  const oneline = new Set(paras.filter((p) => !p.includes("\n") && p.length <= 70));
  let run = 0, best = 0;
  for (const p of paras) { run = oneline.has(p) ? run + 1 : 0; best = Math.max(best, run); }
  if (best > 2) findings.push(["shape", `run of ${best} one-line paragraphs`]);
  if (n > 1500 && paras.length && oneline.size / paras.length >= 0.45) {
    findings.push(["shape", `one-line paragraphs ${oneline.size} of ${paras.length}`]);
  }

  const opener = firstProseLine(prose).toLowerCase();
  for (const [re, label] of BANNED_OPENERS) if (re.test(opener)) findings.push(["opener", label]);

  let emojiRows = 0;
  for (const l of prose.split("\n").map((s) => s.trim()).filter(Boolean)) {
    if (EMOJI_START.test(l) && l.length > 2) {
      if (++emojiRows >= 2) { findings.push(["emoji", "consecutive lines opening on an emoji"]); break; }
    } else emojiRows = 0;
  }

  const rule = HASHTAGS[slug];
  if (rule) {
    const tags = prose.match(/(?<![\w#])#[A-Za-z]\w*/g) ?? [];
    const [tlo, thi] = rule;
    if (tags.length < tlo || tags.length > thi) findings.push(["hashtags", `${tags.length} in body, norm ${tlo}-${thi}`]);
  }

  return [slug, findings];
}

export function run(folder, subset = false) {
  const files = readdirSync(folder).filter((f) => f.endsWith(".md")).sort().map((f) => join(folder, f));
  const findings = [];
  const seen = new Map();
  let openersI = 0;
  if (!subset && files.length !== 26) findings.push(["run", "count", `${files.length} files, expected 26`]);
  if (existsSync(join(folder, "README.md"))) findings.push(["run", "extra", "README.md present"]);
  for (const p of files) {
    const [slug, f] = checkPost(p, folder);
    if (seen.has(slug)) findings.push([slug, "duplicate", `also ${seen.get(slug)}`]);
    seen.set(slug, basename(p));
    for (const [check, detail] of f) findings.push([slug, check, detail]);
    const [, body] = splitFrontmatter(readFileSync(p, "utf8"));
    if (/^(\W\s*)?i\s/.test(firstProseLine(stripCode(body)).toLowerCase())) openersI++;
  }
  if (files.length && openersI / files.length > 0.5) {
    findings.push(["run", "opener", `${openersI} of ${files.length} posts open on 'I'`]);
  }
  return findings;
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "gate-"));
  try {
    const fm = (p, t) => `---\nplatform: ${p}\ntitle: ${t}\n---\n`;
    const cases = {
      "2026-01-01_10-00_UTC_a_x.md": fm("x", "T") + "Something important happened with AI video this week. " + "x".repeat(260) + " #a #b #c",
      "2026-01-01_10-00_UTC_a_medium.md": fm("medium", "T".repeat(80) + ".") + Array.from({ length: 6 }, (_, i) => `Short line ${i}.`).join("\n\n") + " — as of March 2026, thus a game changer (https://x.y).",
      "2026-01-01_10-00_UTC_a_buymeacoffee.md": fm("buymeacoffee", "T") + "I think this is short.",
      "bad_name.md": "nothing",
    };
    for (const [name, text] of Object.entries(cases)) writeFileSync(join(dir, name), text, "utf8");
    const got = new Set(run(dir, true).map(([s, c]) => `${s}|${c}`));
    const expected = [
      "x|opener", "x|cap", "x|hashtags",
      "medium|title", "medium|shape", "medium|punctuation", "medium|dates",
      "medium|vocabulary", "medium|hype", "medium|links", "medium|band",
      "buymeacoffee|band", "name|filename",
    ];
    const missing = expected.filter((e) => !got.has(e));
    if (missing.length) { console.log("self-test FAILED, checks that did not fire:", missing); return 1; }
    console.log(`self-test OK: ${expected.length} expected findings fired`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const args = argv.filter((a) => !a.startsWith("--"));
  if (!args.length) {
    console.log("usage: node scripts/gate.mjs <posts-folder> [--subset] [--json] | --self-test");
    return 2;
  }
  const findings = run(args[0], argv.includes("--subset"));
  if (argv.includes("--json")) {
    console.log(JSON.stringify(findings.map(([post, check, detail]) => ({ post, check, detail })), null, 1));
  } else {
    for (const [s, c, d] of findings) console.log(`${s || "-"}: ${c}: ${d}`);
    console.log(`${findings.length} finding(s)`);
  }
  return findings.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  process.exit(main(process.argv.slice(2)));
}
