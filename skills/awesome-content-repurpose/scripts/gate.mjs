#!/usr/bin/env node
// Mechanical gate for a repurpose run: every check a script can settle, in one pass.
//
//   node scripts/gate.mjs <posts-folder> [--subset] [--json] [--no-hashtags] [--notes <source-notes.md>] [--before <dir>]
//   node scripts/gate.mjs --self-test
//
// Exit 0 when nothing fails. Exit 1 with one `slug: check: detail` line per finding.
// --subset accepts fewer than the canonical 25 files (a run the user trimmed).
// --no-hashtags holds every platform to zero body hashtags (the interview answered no hashtags).
// --notes checks every post against the run's source notes, source text, unit and claims ledger.
// --before compares each post with its copy taken before a wording fix (references/fidelity.md).
// Judgment passes (fidelity, structure, slop, register) are not here; see SKILL.md Phase 5.
// Node 18+, no dependencies.

import { readdirSync, readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { tmpdir } from "node:os";

const CAPS = { x: 280, bluesky: 300, threads: 500, mastodon: 500, peerlist: 480, "wonderful-dev": 2000 };
const BANDS = {
  linkedin: [600, 1200], "facebook-wall": [900, 1500], threads: [350, 475],
  instagram: [500, 720], pinterest: [200, 400], x: [230, 270],
  tumblr: [1200, 2600], mastodon: [400, 475], bluesky: [250, 290],
  "wonderful-dev": [700, 950], truthsocial: [350, 500], peerlist: [380, 460],
  minds: [350, 700], patreon: [1500, 3000], "ko-fi": [1500, 3500],
  buymeacoffee: [1500, 5000], bastyon: [450, 950], devto: [3000, 6000],
  hashnode: [2200, 5000], hackernoon: [4500, 7000], medium: [4500, 8000],
  "daily-dev": [1100, 2400], lemmy: [800, 1600],
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
  "ko-fi": null, buymeacoffee: null, patreon: null,
};
// Dashes, curly quotes, arrows, and the box-drawing set a diagram reaches for: a canvas that renders
// as a row of boxes on someone else's font is worse than no diagram, so ASCII is the whole palette.
const NON_ASCII_PUNCT = /[—–―‘’“”→←↑↓⇒⇐⟶▲▼◄►■□●○─━│┃┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]/;
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
  [/^(this|last|the past) (week|month|year|few days|couple of days)\b[^.!?]{0,30}\b(gave|brought|showed|handed|delivered|left) (me|us)\b/i, "a stretch of time as the actor"],
];
const EMOJI_START = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
const FIRST_SINGULAR = /(^|[^\w'])(i|i'm|i've|i'd|i'll|me|my|mine|myself)([^\w']|$)/i;
const FIRST_PLURAL = /(^|[^\w'])(we|we're|we've|us|our|ours|ourselves)([^\w']|$)/i;
// A roll-call is a chain of platform names with nothing but separators between them, or a run of
// bullets that are bare platform names. Prose naming two platforms because they behave differently
// is not a matrix, and this leaves it alone.
// Title shapes that fail on sight. A headline is read alone, in a feed row or a search result, so it
// names the subject and states the point: it does not explain why something is good, announce what
// "we" were given, run a product roll-call, or bolt a second clause on after the first one landed.
const TITLE_SHAPES = [
  [/^\s*why\b/i, "explains why instead of naming the point"],
  [/\bis (such|really|actually) (a|an|the)\b/i, "the why-it-is-good shape"],
  [/^\s*(we|you)\b[^.!?]{0,40}\b(just|now|finally)\b|^\s*(we|you) (just|now|finally)\b/i, "the 'we just got' announcement voice"],
  // two sentences, not a product name that ends in a bang: both halves have to read as sentences
  [(s) => s.split(/[.!?]+\s+/).filter((p) => p.trim().split(/\s+/).length >= 3).length >= 2, "two sentences in one headline"],
  [/,[^,]+,[^,]+,/, "a product roll-call in the headline"],
  [/\band more\b\s*$/i, "trails off in 'and more'"],
  // a qualifier is only bolted on when the headline already landed: six words in front of it
  [(s) => {
    const m = s.match(/^(.*?)\s(without|instead of|while still)\s([^,]{12,})$/i);
    return !!m && m[1].trim().split(/\s+/).length >= 6;
  }, "a qualifier clause bolted on after the headline"],
];
// "my favourite" is a ranking nobody can check; "one of my favourite" is the ceiling, neutral is better
const FAVOURITE = /\bmy (favou?rite|number one|no\.? ?1|top) \w+/gi;
// The post stands on its own: it never describes the text the run started from. A source's language,
// the count of items it held, and the source as a recurring character ("the list says") are all
// scaffolding showing through. Checked on prose only; a catalog whose size is the product is exempt
// because "catalog" is not in the container list.
const NUM_WORD = "(?:two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)";
const CONTAINER = "(?:list|compilation|roundup|round-up|selection|digest)";
const SOURCE_LANG = new RegExp(String.raw`\b(?:russian|english|chinese|german|french|spanish|japanese|korean|ukrainian|translated)(?:-language)?\s+(?:${CONTAINER}|thread|post|article|channel|piece|summary)\b`, "i");
const SOURCE_COUNT = new RegExp(String.raw`\b${CONTAINER}\s+of\s+(?:\d+|${NUM_WORD})\b|\b(?:\d+|${NUM_WORD})-(?:model|item|entry|tool|repo|link)\s+${CONTAINER}\b|\ball\s+(?:\d+|${NUM_WORD})\s+(?:cards|entries|items|models|links)\b`, "i");
// "the list price" is a pricing term, not the source document talking
const SOURCE_CHARACTER = new RegExp(String.raw`\bthe\s+${CONTAINER}(?:'s)?\b(?!\s+prices?\b)`, "gi");
// A payoff number is digits. Ten and up spelled out, or any spelled number carrying a unit, is the
// shape that hides the one figure a reader was scanning for; "hundreds of" as a vague quantity is not.
// Idioms are exempt: "a few hundred", "top ten", "nine times out of ten" are not figures anyone scans for.
const SPELLED_BIG = /(?<!\b(?:top|few|several|out of)\s)\b(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b(?!\s+of\b|s\b)/i;
const SPELLED_UNIT = /\b(?:one|two|three|four|five|six|seven|eight|nine)[\s-](?:gb|tb|mb|gigabytes?|terabytes?|bits?|tokens|percent|x)\b/i;
// surfaces where the room expects to be handed the thread back
const DISCUSSION = new Set(["reddit", "lemmy", "devto", "hashnode", "daily-dev"]);
// a title that is a question put to a room is that room's native form and gets more air than a headline
let NO_HASHTAGS = false; // set by --no-hashtags
const ASK_THE_ROOM = new Set(["reddit", "lemmy"]);
const OS_NAME = "(?:windows|macos|mac os|linux|ios|ipados|android|chromeos|chrome os)";
const OS_CHAIN = new RegExp(`\\b${OS_NAME}(?:\\s*(?:,|/|and|, and)\\s*${OS_NAME}){2,}\\b`, "i");
const OS_BULLETS = new RegExp(`^[-*]\\s+${OS_NAME}\\s*$`, "i");

// Checks against the source. They run only when --notes names the run's source-notes.md; the same
// folder holds source/, unit.md and claims.md (references/fidelity.md). Without --notes the gate judges
// the posts alone. An absolute the source never used is the commonest compression error: a narrow
// finding restated as a general one. The author's own habits ("I never") are framing, not a claim.
const ABSOLUTE = /(?<!\bI\s)(?<!\bI'd\s)(?<!\bI'll\s)(?<!\bI've\s)\b(?:always|never|guarantee[sd]?|proves?|proven|eliminates?|eliminated|completely|entirely|perfectly|flawless(?:ly)?|without exception)\b|\b100%/gi;
const NEGATION = /\b(?:not|no|never|without|none|nothing|cannot)\b|n't\b/gi;
const LONG_FORM = new Set(["devto", "hashnode", "hackernoon", "medium", "substack"]);
// A contrast frame is allowed once per post (once per 2500 characters on a long read) and never as the
// opener: as the default shape it is the machine rhythm readers learned first. One alternation, so a
// frame matching two shapes counts once.
const CONTRAST = new RegExp([
  String.raw`\bnot (?:just|only|merely|simply) [^.!?]{1,60}?,? but\b`,
  String.raw`\b(?:is|are|was|were|'s|'re) not [^.!?,]{1,40}, but\b`,
  String.raw`\b(?:it|this|that)(?:'s| is| was) not [^.!?]{1,40}?[.;,] (?:it|this|that)(?:'s| is| was)\b`,
  String.raw`\bless about [^.!?]{1,40}? than\b`,
  String.raw`\bthe real (?:question|story|point|problem|issue) (?:is not|isn't|was not|wasn't)\b`,
].join("|"), "gi");
// Scrubbing leaves tells of its own: the one-word reveal, the no-X-no-Y cadence landing on "just", the
// sincerity opener. Each is what a rewrite reaches for when it removes a cliche and keeps its rhythm.
const OVERCORRECTION = [
  [/(?:^|[.!?]\s+)(?:the|its|my|our|their) (?:result|catch|kicker|twist|best part|punchline|answer|verdict|secret|trick|takeaway)\?/im, "a one-word reveal bridge"],
  [/\bno [^.!?\n]{1,40}[.!]\s+no [^.!?\n]{1,40}[.!]\s+(?:just|only)\b/i, "the no-X, no-Y, just-Z cadence"],
  [/\b(?:to be|let me be|i(?:'ll| will) be) (?:honest|clear|real)(?=\s*[,.;:!]|\s+with you\b)|\bfull disclosure\b|\breal talk\b|(?:^|[.!?]\s+)honestly,/im, "a sincerity opener"],
];
// The author's effort lands on the project, never on one of its files: a post whose evenings were spent
// "with the README" has reviewed a document, and the reader came for the thing. Citing a document for
// one number is fine; leaning on it once per paragraph is the same tell by volume.
const DOCUMENT = String.raw`(?:README|readme|the docs|documentation|model card|changelog|release notes|the card)`;
const DOCUMENT_EFFORT = new RegExp(String.raw`\b(?:I|we)\b[^.!?\n]{0,50}?\b(?:read|reading|opened|open|spent|went (?:through|over|into)|had|saved|took|pulled|dug|combed|sat down with|evening (?:on|with|in))\b[^.!?\n]{0,40}?\b${DOCUMENT}\b`, "i");
const DOCUMENT_MENTION = new RegExp(String.raw`\b${DOCUMENT}\b`, "gi");
// A semicolon joins what two sentences would carry better; a run of them is a written register no one
// speaks. One is allowed per 1500 characters, none on a short post.
const SEMICOLON = /;(?!\S)/g;
// "First person is paid for with specifics": a comparative with no number under it is the opposite.
const VAGUE =/\b(?:significantly|dramatically|massively|substantially|vastly|hugely) (?:faster|slower|better|worse|cheaper|smaller|larger|bigger|more|less|improved|reduced)\b|\b(?:tons|a ton|loads) of\b/i;
// Words LLM text over-uses against human text (Kobak et al., Science Advances 2025; the slop-forensics
// lists, MIT). One is ordinary; three in one paragraph is the texture a reader clocks, so density fails
// and a single hit does not.
const MARKERS = [
  "delv", "showcas", "underscor", "pivotal", "intricate", "meticulous", "commendable", "garner",
  "invaluable", "noteworthy", "notably", "unparalleled", "bolster", "foster", "nuanced", "streamlin",
  "embark", "elevat", "crucial", "comprehensive", "insightful", "landscape", "realm", "surpass",
  "boast", "strategically", "profound", "transformative", "unlock", "empower", "harness", "seamless",
  "additionally", "furthermore", "moreover", "ever-evolving", "robust", "leverag", "tapestry",
  "it is important to note", "it is worth noting", "in conclusion", "navigat",
].map((w) => new RegExp(String.raw`\b${w}`, "i"));
const EMOJI_RUN = /(?:\p{Extended_Pictographic}\uFE0F?[\s\u200D]*){3,}/u;
// A multi-word tag in lower case is one unreadable word to a screen reader; CamelCase is read as words.
// dev.to and daily.dev lower-case every tag, and the article platforms and the rooms take none in the body
const TAG_CASE_EXEMPT = new Set(["devto", "daily-dev", "hashnode", "medium", "hackernoon", "substack", "tumblr", "reddit", "lemmy", "peerlist"]);
const TAG_WORDS = new Set(("ai ml llm llms dev devs web app apps open source machine learning deep data science self hosted "
  + "hosting local first code coding tech software hardware cloud native network security cyber privacy game games gaming "
  + "design front back end full stack java script type python program programming engineer engineering product indie "
  + "maker makers build building in public content creator creators social media video photo art digital generative "
  + "image text model models agent agents tool tools tip tips how to news daily life hack hacks home lab server mobile "
  + "tutorial prompt prompts developer developers linux").split(" "));
function isCompoundTag(tag) {
  if (tag !== tag.toLowerCase() || tag.length < 8) return false;
  const parts = new Array(tag.length + 1).fill(Infinity);
  parts[0] = 0;
  for (let i = 1; i <= tag.length; i++) {
    for (let j = Math.max(0, i - 12); j < i; j++) {
      if (parts[j] + 1 < parts[i] && TAG_WORDS.has(tag.slice(j, i))) parts[i] = parts[j] + 1;
    }
  }
  return parts[tag.length] >= 2 && parts[tag.length] < Infinity;
}
// The feed cuts the post at a "see more" fold. The numbers are measured by third-party tools rather than
// published by the platforms (platform-specs.md, verify live); a line break costs about a line of room.
const FOLD = { linkedin: 140, instagram: 125 };
const STOP = new Set(("the a an and or but of for to in on at by with from into onto over under about this that these those it "
  + "its is are was were be been being how what why when where who which your you my our their his her they we i me us them "
  + "not no yes can will just than then so as if").split(" "));
function foldText(body, limit) {
  let used = 0, i = 0;
  for (; i < body.length && used < limit; i++) used += body[i] === "\n" ? 35 : 1;
  return body.slice(0, i);
}
// A closing whose only words point at the link without naming what is behind it: the post has to land
// without the link (LinkedIn's own stated rule). A bare URL after a closing that landed is not this.
const VAGUE_POINTER = /^(?:details|more|more here|read more|full (?:story|details|write-?up|thread|post)|link|here|check it out|see (?:more|here))\b[^.!?]{0,20}$/i;

const withoutLinksAndTags = (s) => s.replace(/https?:\/\/\S+/g, " ").replace(/(?<![\w#])#[A-Za-z]\w*/g, " ");
const numbersIn = (s) => new Set((withoutLinksAndTags(s).match(/(?<![\w.])\d[\d,]*(?:\.\d+)?/g) ?? []).map((t) => t.replace(/,/g, "")));
// product and version identifiers: a letter token carrying a digit or an inner capital (Qwen3, GPT-5, ChatGPT)
const identifiersIn = (s) => new Set((withoutLinksAndTags(s).match(/\b[A-Za-z][A-Za-z0-9]*(?:[-.][A-Za-z0-9]+)*\b/g) ?? [])
  .filter((t) => /\d/.test(t) || /[a-z][A-Z]/.test(t)));
const squash = (s) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").toLowerCase();

function loadNotes(notesPath) {
  const dir = dirname(notesPath);
  const read = (p) => (existsSync(p) ? readFileSync(p, "utf8").replace(/\r\n/g, "\n") : null);
  const text = read(notesPath) ?? "";
  const srcDir = join(dir, "source");
  const source = existsSync(srcDir)
    ? readdirSync(srcDir, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => read(join(srcDir, d.name))).join("\n")
    : "";
  const corpus = text + "\n" + source;
  // the notes' own scaffolding is not a fact: list numbering and the paragraph count would otherwise
  // vouch for every small number a post invents
  const facts = text.replace(/^Source paragraphs:.*$/im, "").replace(/^\s*\d+\.\s/gm, "") + "\n" + source;
  // [C1] claim, [N1] number, [Q1] quotation, [E1] named thing, [S1] scope or hedge, [D1] the author's own
  // derivation from cited lines; "(at pN)" is where a source line sits
  const ids = new Map();
  for (const m of text.matchAll(/\[([CNQESD]\d+)\]([^\n]*)/g)) {
    const at = m[2].match(/\(at p(\d+)\)/);
    ids.set(m[1], at ? Number(at[1]) : null);
  }
  const total = Number(text.match(/^Source paragraphs:\s*(\d+)/im)?.[1] ?? 0);
  return {
    corpus, lower: squash(corpus), numbers: numbersIn(facts), ids, total,
    unit: read(join(dir, "unit.md")), ledger: read(join(dir, "claims.md")),
  };
}

function ledgerRows(ledger) {
  const rows = [];
  for (const line of ledger.split("\n")) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    if (cells.length < 3 || /^[-: ]+$/.test(cells[0]) || /^post$/i.test(cells[0])) continue;
    rows.push({ post: cells[0].replace(/\.md$/, "").split("_").pop(), claim: cells[1], refs: cells[2].split(/[,\s]+/).filter(Boolean) });
  }
  return rows;
}

// 4-word phrases with at least one content word, quotations, links and tags removed
function phrases(s) {
  const words = squash(withoutLinksAndTags(s.replace(/"[^"\n]*"/g, " "))).match(/[a-z0-9']+/g) ?? [];
  const out = new Set();
  for (let i = 0; i + 4 <= words.length; i++) {
    const g = words.slice(i, i + 4);
    if (g.some((w) => !STOP.has(w))) out.add(g.join(" "));
  }
  return out;
}

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

function checkPost(path, folder, ctx = {}) {
  const findings = [];
  // CRLF is what an editor on Windows writes, and a `\r` at the end of a frontmatter line makes the
  // key regex below fail silently - which turns the frontmatter, title and persona checks into no-ops
  const text = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
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
    // An article headline is slugged into a permalink and shown alone in a feed row, so it is short.
    // A question posted into a room is the room's native form, and it gets more air.
    const cap = ASK_THE_ROOM.has(slug) ? 110 : 70;
    const words = ASK_THE_ROOM.has(slug) ? 18 : 13;
    if (title.length > cap) findings.push(["title", `${title.length} chars, cap ${cap}`]);
    if (title.trimEnd().endsWith(".")) findings.push(["title", "ends with a period"]);
    for (const [re, label] of TITLE_SHAPES) if (typeof re === "function" ? re(title) : re.test(title)) findings.push(["title", label]);
    const twords = title.trim().split(/\s+/).filter(Boolean);
    if (twords.length >= words) findings.push(["title", `${twords.length} words, two headlines fighting`]);
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
  // Shape is measured on the body as published, not on the code-stripped copy: a fenced block
  // separates the paragraphs around it on the page, and inline code is characters the reader sees.
  // A heading, a list or a code block breaks the run, because the defect is prose chopped into
  // fragments, not two short paragraphs on either side of a section title.
  const shapeBlocks = body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const isOneLine = (b) => !b.includes("\n") && b.length <= 70 && !isBlock(b) && !/^(```|https?:\/\/|\d+\.\s)/.test(b);
  // A short line ending in a colon in front of a code block or a list is that block's caption, not a
  // fragment of chopped-up prose, and counting it as one punishes posts for showing a command.
  const isLeadIn = (b, next) => /:$/.test(b) && next !== undefined && /^(```|`|[-*]\s|\d+\.\s|>)/.test(next);
  let run = 0, best = 0, ones = 0, prose_n = 0;
  for (const [i, b] of shapeBlocks.entries()) {
    const one = isOneLine(b) && !isLeadIn(b, shapeBlocks[i + 1]);
    run = one ? run + 1 : 0;
    best = Math.max(best, run);
    if (one) ones++;
    if (one || (!isBlock(b) && !/^```/.test(b))) prose_n++;
  }
  if (best > 2) findings.push(["shape", `run of ${best} one-line paragraphs`]);
  if (n > 1500 && prose_n && ones / prose_n >= 0.45) {
    findings.push(["shape", `one-line paragraphs ${ones} of ${prose_n}`]);
  }

  const opener = firstProseLine(prose).toLowerCase();
  for (const [re, label] of BANNED_OPENERS) if (re.test(opener)) findings.push(["opener", label]);

  let emojiRows = 0;
  for (const l of prose.split("\n").map((s) => s.trim()).filter(Boolean)) {
    if (EMOJI_START.test(l) && l.length > 2) {
      if (++emojiRows >= 2) { findings.push(["emoji", "consecutive lines opening on an emoji"]); break; }
    } else emojiRows = 0;
  }

  const rule = NO_HASHTAGS ? [0, 0] : HASHTAGS[slug];
  if (rule) {
    const tags = prose.match(/(?<![\w#])#[A-Za-z]\w*/g) ?? [];
    const [tlo, thi] = rule;
    if (tags.length < tlo || tags.length > thi) findings.push(["hashtags", `${tags.length} in body, norm ${tlo}-${thi}`]);
  }

  // The persona the interview chose is in every post, and it is there at the top: a post that reaches
  // its author in paragraph 8 opened as product copy. Measured against a hand-labelled run, first
  // person inside the first two prose paragraphs separates the accepted posts from the rejected ones.
  const voice = typeof fm.voice === "string" ? fm.voice : "";
  if (voice && !/third-person/.test(voice)) {
    const person = /plural/.test(voice) ? (s) => FIRST_PLURAL.test(s) : (s) => FIRST_SINGULAR.test(s) || FIRST_PLURAL.test(s);
    const at = paras.findIndex(person);
    if (at < 0) findings.push(["persona", `voice '${voice}' but no first person in the body`]);
    else if (at > 1) findings.push(["persona", `voice '${voice}' but the author first appears in paragraph ${at + 1}`]);
  }
  const chain = prose.match(OS_CHAIN);
  const bulletRun = prose.split("\n").filter((l) => OS_BULLETS.test(l.trim())).length;
  if (chain) findings.push(["spec", `support matrix: ${chain[0].replace(/\s+/g, " ")}`]);
  else if (bulletRun >= 3) findings.push(["spec", `support matrix: ${bulletRun} platform names as bullets`]);
  let bullets = 0, worst = 0;
  for (const l of prose.split("\n").map((s) => s.trim())) {
    if (/^[-*]\s+\S/.test(l) && l.length <= 40) { bullets++; worst = Math.max(worst, bullets); } else if (l) bullets = 0;
  }
  if (worst >= 4) findings.push(["spec", `bullet stack: ${worst} bare items in a row`]);

  // No single favourite. A ranking the reader cannot check reads as a claim about the author rather
  // than about the thing, so the neutral description wins and "one of my favourite" is the ceiling.
  for (const m of (prose + "\n" + title).matchAll(FAVOURITE)) {
    const before = (prose + "\n" + title).slice(Math.max(0, m.index - 12), m.index).toLowerCase();
    if (!/\b(one of|among|of my)\s*$/.test(before)) findings.push(["superlative", `'${m[0]}' declares a single favourite`]);
  }

  // Closing. A post on a discussion surface ends by handing the thread back to the room, and no post
  // ends on a line that restates in general terms what the body already showed in specifics.
  if (DISCUSSION.has(slug) && paras.length) {
    const tail = paras.slice(-2).join(" ");
    if (!tail.includes("?")) findings.push(["closing", "no question to the room in the last two paragraphs"]);
  }
  // the closing region, not only the final block: a question or a hashtag line often sits after it
  for (const p of paras.slice(-3)) {
    if (p.length > 160 || /\d|`|https?:\/\//.test(p)) continue;
    // the shape is a contrast across two sentences ("The skill is tiny. The payoff is much larger."),
    // not one sentence that happens to describe something as big and something else as small
    const sents = p.split(/(?<=[.!?])\s+/);
    const small = sents.findIndex((s) => /\b(tiny|small|simple|short|little|minor)\b/i.test(s));
    const big = sents.findIndex((s) => /\b(larger|bigger|much more|huge|enormous)\b/i.test(s));
    if (small >= 0 && big >= 0 && small !== big) {
      findings.push(["closing", "the small-thing-big-effect restatement"]);
      break;
    }
    // A maturity label fits every new thing ever written about and commits the author to nothing.
    if (/\b(early days|still early|just the beginning|early innings|(ugly )?prototype stage|the \w+ stage)\b/i.test(p)) {
      findings.push(["closing", "a maturity-curve label instead of a point"]);
      break;
    }
    // One hedge against another: rough on one side, bigger or more important on the other, nothing named.
    const rough = sents.findIndex((s) => /\b(chaotic|rough|messy|ugly|crude|janky|slop|unpolished)\b/i.test(s));
    const grand = sents.findIndex((s) => /\b(bigger|larger|more important|the real story|much more|matters more)\b/i.test(s));
    if (rough >= 0 && grand >= 0 && rough !== grand) {
      findings.push(["closing", "vague against vague, with nothing named"]);
      break;
    }
  }

  // First person is paid for with specifics. A post that says "I found this useful" and carries no
  // number, command, name or quotation is an opinion with nothing under it.
  if (voice && !/third-person/.test(voice) && n >= 700) {
    const evidence = [/\d/.test(prose), /`[^`]+`/.test(body), /https?:\/\//.test(prose), /"[^"]{8,}"/.test(prose)].filter(Boolean).length;
    if (evidence === 0) findings.push(["evidence", "first person with no number, command, link or quotation under it"]);
  }

  // The post stands on its own (authored-style.md): no language of the source, no count of the items
  // it held, and the source never recurs as a character that says or files anything.
  const src = prose + "\n" + title;
  if (SOURCE_LANG.test(src)) findings.push(["source", `names the source's language: '${src.match(SOURCE_LANG)[0]}'`]);
  if (SOURCE_COUNT.test(src)) findings.push(["source", `counts the source's items: '${src.match(SOURCE_COUNT)[0]}'`]);
  const characters = (prose.match(SOURCE_CHARACTER) ?? []).length;
  if (characters >= 2) findings.push(["source", `the source document recurs as a character (${characters} times)`]);
  // once is enough when it talks: a light mention is allowed, the document saying or filing things is not
  const speaks = prose.match(new RegExp(String.raw`\bthe\s+${CONTAINER}\s+(?:says|said|suggests|ends|closes|files|puts|notes|recommends|argues|claims)\b`, "i"));
  if (speaks && characters < 2) findings.push(["source", `the source document speaks: '${speaks[0]}'`]);

  // Payoff numbers are digits; a spelled-out count of ten or more, or a spelled number carrying a unit,
  // hides the figure a reader was scanning for.
  const spelled = prose.match(SPELLED_BIG) ?? prose.match(SPELLED_UNIT);
  if (spelled) findings.push(["numbers", `'${spelled[0]}' spelled out: digits if it is the point, gone if it is inventory`]);


  // Contrast frames, the rewrite's own tells, and comparatives with no number under them.
  const frames = prose.match(CONTRAST) ?? [];
  const allowed = Math.max(1, Math.floor(n / 2500));
  if (frames.length > allowed) findings.push(["contrast", `${frames.length} contrast frames, ${allowed} allowed at this length`]);
  else if (frames.length && new RegExp(CONTRAST.source, "i").test(firstProseLine(prose))) findings.push(["contrast", "the opener is a contrast frame"]);
  for (const [re, label] of OVERCORRECTION) if (re.test(prose)) findings.push(["overcorrection", label]);
  const semis = (prose.match(SEMICOLON) ?? []).length;
  const semisAllowed = Math.floor(n / 1500);
  if (semis > semisAllowed) findings.push(["semicolon", `${semis} semicolons, ${semisAllowed} allowed at this length: split the sentence or use a comma`]);
  const effort = prose.match(DOCUMENT_EFFORT);
  if (effort) findings.push(["document", `the author's effort lands on a file: '${effort[0].slice(0, 60)}'; name the project or the repo`]);
  const mentions = (prose.match(DOCUMENT_MENTION) ?? []).length;
  const mentionsAllowed = Math.max(1, Math.floor(n / 1200));
  if (mentions > mentionsAllowed) findings.push(["document", `a document is named ${mentions} times, ${mentionsAllowed} allowed at this length`]);
  const vague = prose.match(VAGUE);
  if (vague) findings.push(["vague", `'${vague[0]}': the number, or say it was one run`]);
  for (const p of paras) {
    const hits = MARKERS.filter((re) => re.test(p)).length;
    if (hits >= 3) { findings.push(["density", `${hits} over-used words in one paragraph`]); break; }
  }
  if (EMOJI_RUN.test(prose)) findings.push(["emoji", "three or more emoji side by side"]);
  const lowerTags = TAG_CASE_EXEMPT.has(slug) ? [] : (prose.match(/(?<![\w#])#[a-z]\w*/g) ?? []).map((t) => t.slice(1)).filter(isCompoundTag);
  if (lowerTags.length) findings.push(["tagcase", `multi-word tag in lower case: ${lowerTags.map((t) => "#" + t).join(", ")}`]);

  // What stands above the fold is the only part most readers see: the author and the subject go there.
  if (slug in FOLD) {
    const fold = foldText(body, FOLD[slug]).toLowerCase();
    if (voice && !/third-person/.test(voice) && !FIRST_SINGULAR.test(fold) && !FIRST_PLURAL.test(fold)) {
      findings.push(["fold", `no author above the ${FOLD[slug]}-character fold`]);
    }
    const subject = (title.toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) ?? []).filter((w) => w.length >= 4 && !STOP.has(w));
    if (subject.length && !subject.some((w) => fold.includes(w.slice(0, 5)))) {
      findings.push(["fold", `none of the headline's words above the ${FOLD[slug]}-character fold`]);
    }
  }
  const last = paras[paras.length - 1] ?? "";
  if (/https?:\/\//.test(last)) {
    const rest = last.replace(/https?:\/\/\S+/g, "").replace(/[\s:.!-]+$/, "").trim();
    if (rest && rest.split(/\s+/).length <= 5 && VAGUE_POINTER.test(rest)) {
      findings.push(["link-only", "the closing carries nothing but the link; the post has to land without it"]);
    }
  }

  // Fields beside the body: the Threads text attachment, a document for a carousel.
  if (typeof fm.attachment_text === "string") {
    const p = [join(folder, fm.attachment_text), fm.attachment_text].find((x) => existsSync(x));
    if (slug !== "threads") findings.push(["frontmatter", "attachment_text is a Threads field"]);
    else if (!p) findings.push(["attachments", `missing on disk: ${fm.attachment_text}`]);
    else if (readFileSync(p, "utf8").length > 10000) findings.push(["cap", "Threads text attachment over 10000 characters"]);
  }
  if (typeof fm.document === "string" && !existsSync(join(folder, fm.document)) && !existsSync(fm.document)) {
    findings.push(["attachments", `missing on disk: ${fm.document}`]);
  }

  if (ctx.notes) {
    const N = ctx.notes;
    const scope = prose + "\n" + title;
    const numbers = [...numbersIn(scope)].filter((x) => !N.numbers.has(x));
    const names = [...identifiersIn(scope)].filter((x) => !N.lower.includes(x.toLowerCase()));
    const quotes = [...scope.matchAll(/"([^"\n]{12,})"/g)].map((m) => m[1])
      .filter((q) => q.trim().split(/\s+/).length >= 4 && !N.lower.includes(squash(q)));
    if (numbers.length) findings.push(["grounding", `numbers not in the notes or the source: ${numbers.slice(0, 5).join(", ")}`]);
    if (names.length) findings.push(["grounding", `names not in the notes or the source: ${names.slice(0, 5).join(", ")}`]);
    if (quotes.length) findings.push(["grounding", `quotation not verbatim in the source: '${quotes[0].slice(0, 50)}'`]);
    const absolutes = [...new Set((prose.match(ABSOLUTE) ?? []).map((w) => w.toLowerCase()))]
      .filter((w) => !N.lower.includes(w.replace(/%$/, "").replace(/(?:es|s|d|ly)$/, "")));
    if (absolutes.length) findings.push(["absolute", `the source never says: ${absolutes.join(", ")}`]);
    const anchor = typeof fm.source_anchor === "string" ? fm.source_anchor : "";
    const am = anchor.match(/^p(\d+)(?:-p(\d+))?$/);
    if (!am) findings.push(["anchor", anchor ? `source_anchor '${anchor}' is not pN or pN-pM` : "no source_anchor"]);
    else if (N.total && Number(am[2] ?? am[1]) > N.total) findings.push(["anchor", `source_anchor ${anchor} past the source's ${N.total} paragraphs`]);
  }

  // A wording fix is allowed to change wording only. Numbers, names and negations are compared with
  // the copy taken before the fix; a difference sends the post back to the fidelity pass.
  const beforePath = ctx.before ? join(ctx.before, basename(path)) : null;
  if (beforePath && existsSync(beforePath)) {
    const [, beforeBody] = splitFrontmatter(readFileSync(beforePath, "utf8").replace(/\r\n/g, "\n"));
    const was = stripCode(beforeBody.trim());
    const gone = (a, b) => [...a].filter((x) => !b.has(x));
    const [wn, nn, wi, ni] = [numbersIn(was), numbersIn(prose), identifiersIn(was), identifiersIn(prose)];
    const diff = [...gone(wn, nn), ...gone(nn, wn), ...gone(wi, ni), ...gone(ni, wi)];
    if (diff.length) findings.push(["drift", `the fix changed facts: ${diff.slice(0, 5).join(", ")}`]);
    const neg = (s) => (s.match(NEGATION) ?? []).length;
    if (neg(was) !== neg(prose)) findings.push(["drift", `the fix changed the negations: ${neg(was)} -> ${neg(prose)}`]);
  }

  return [slug, findings, firstProseLine(prose), prose];
}

export function run(folder, subset = false, opts = {}) {
  const notes = opts.notes ? loadNotes(opts.notes) : null;
  const ctx = { notes, before: opts.before ?? null };
  const proseBySlug = new Map();
  const files = readdirSync(folder).filter((f) => f.endsWith(".md")).sort().map((f) => join(folder, f));
  const findings = [];
  const seen = new Map();
  const openings = new Map();
  if (!subset && files.length !== 25) findings.push(["run", "count", `${files.length} files, expected 25`]);
  if (existsSync(join(folder, "README.md"))) findings.push(["run", "extra", "README.md present"]);
  for (const p of files) {
    const [slug, f, opener, prose] = checkPost(p, folder, ctx);
    proseBySlug.set(slug, prose ?? "");
    if (seen.has(slug)) findings.push([slug, "duplicate", `also ${seen.get(slug)}`]);
    seen.set(slug, basename(p));
    for (const [check, detail] of f) findings.push([slug, check, detail]);
    const key = String(opener ?? "").toLowerCase().split(/\s+/).slice(0, 3).join(" ");
    if (key) openings.set(key, (openings.get(key) ?? 0) + 1);
  }
  // the pronoun may repeat across a run; the phrase may not (authored-style.md, "How much first person")
  for (const [key, n] of openings) {
    if (files.length && n / files.length > 0.25 && n > 2) findings.push(["run", "opener", `${n} of ${files.length} posts open on '${key}'`]);
  }
  // Presence in the opening is the rule; opening on the pronoun is one way of many. A run where every
  // post starts "I <verb>" is the same uniformity tell as a run where every post starts on the product.
  if (files.length >= 8) {
    const iFirst = [...openings].filter(([k]) => /^i\b|^i'/.test(k)).reduce((a, [, n]) => a + n, 0);
    if (iFirst / files.length > 0.7) {
      findings.push(["run", "opener", `${iFirst} of ${files.length} posts open on the word 'I'`]);
    }
    const verbs = new Map();
    for (const [k, n] of openings) {
      const m = k.match(/^i(?:'ve|'m|'d)?\s+(\w+)/);
      if (m) verbs.set(m[1], (verbs.get(m[1]) ?? 0) + n);
    }
    for (const [v, n] of verbs) {
      if (n / files.length > 0.3 && n > 2) findings.push(["run", "opener", `${n} of ${files.length} posts open on 'I ${v}'`]);
    }
  }
  if (notes) {
    if (!notes.ledger) findings.push(["run", "ledger", "claims.md missing beside source-notes.md"]);
    else {
      const rows = ledgerRows(notes.ledger);
      for (const slug of proseBySlug.keys()) {
        const mine = rows.filter((r) => r.post === slug);
        if (!mine.length) { findings.push([slug, "ledger", "no claims.md rows for this post"]); continue; }
        for (const r of mine) {
          for (const ref of r.refs) {
            if (/^unsupported$/i.test(ref)) findings.push([slug, "ledger", `unsupported: ${r.claim.slice(0, 60)}`]);
            else if (!notes.ids.has(ref)) findings.push([slug, "ledger", `unknown note id ${ref}`]);
          }
        }
        // a long read that skips the middle of a long source is the lead bias summaries are known for
        if (LONG_FORM.has(slug) && notes.total >= 30) {
          const at = mine.flatMap((r) => r.refs.map((x) => notes.ids.get(x))).filter((x) => typeof x === "number");
          const [lo, hi] = [notes.total / 3, (2 * notes.total) / 3];
          if (at.length && !at.some((x) => x > lo && x <= hi)) {
            findings.push([slug, "coverage", `nothing from the middle third of a ${notes.total}-paragraph source`]);
          }
        }
      }
    }
    // One post adapted per platform shares the unit's phrasing by design. A phrase in more than three
    // posts that the unit never had was added by the adaptation, the same line stamped everywhere.
    if (notes.unit) {
      const unit = phrases(notes.unit);
      const count = new Map();
      for (const prose of proseBySlug.values()) for (const g of phrases(prose)) if (!unit.has(g)) count.set(g, (count.get(g) ?? 0) + 1);
      const echoes = [...count].filter(([, c]) => c > 3).sort((a, b) => b[1] - a[1]);
      if (echoes.length) findings.push(["run", "echo", `${echoes.length} phrase(s) stamped on posts but absent from the unit, e.g. '${echoes[0][0]}' in ${echoes[0][1]}`]);
    }
  }
  return findings;
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "gate-"));
  try {
    const fm = (p, t, v) => `---\nplatform: ${p}\ntitle: ${t}\n${v ? `voice: ${v}\n` : ""}---\n`;
    const cases = {
      "2026-01-01_10-00_UTC_a_x.md": fm("x", "T") + "Something important happened with AI video this week. " + "x".repeat(260) + " #a #b #c",
      "2026-01-01_10-00_UTC_a_medium.md": fm("medium", "T".repeat(80) + ".") + Array.from({ length: 6 }, (_, i) => `Short line ${i}.`).join("\n\n") + " — as of March 2026, thus a game changer (https://x.y).",
      "2026-01-01_10-00_UTC_a_buymeacoffee.md": fm("buymeacoffee", "T") + "I think this is short.",
      // the persona checks: a first-person voice with nobody in the post, a support matrix, a bullet stack
      "2026-01-01_10-00_UTC_a_minds.md": fm("minds", "T", "first-person")
        + "The tool transfers files peer-to-peer.\n\nIt runs on Windows, macOS, Linux, iOS and Android.\n\n"
        + "- no account\n- no subscription\n- no cloud storage\n- no size limit\n\n"
        + "y".repeat(700) + "\n\n#a #b #c",
      // the headline shapes, the single favourite, the missing question, the restating close
      "2026-01-01_10-00_UTC_a_devto.md": fm("devto", "Why This Tiny Skill Is Such a Good Learning Pattern", "first-person")
        + "My favourite tiny skill turns hard topics into pictures.\n\n"
        + "I ran it on a repo I did not know and read the output.\n\n"
        + "z".repeat(3000) + "\n\nThe skill is tiny. The payoff can be much larger.",
      // a stretch of time as the actor, a maturity label, and one hedge against another
      "2026-01-01_10-00_UTC_a_tumblr.md": fm("tumblr", "A week of it", "first-person")
        + "This week gave me a preview of what the tool can do.\n\n"
        + "I spent an evening on it and came back with one number I keep repeating: 42. ".repeat(18)
        + "\n\nWe are at the ugly prototype stage.",
      "2026-01-01_10-00_UTC_a_bastyon.md": fm("bastyon", "T", "first-person")
        + "I went through it this week and the mechanism is the part worth keeping.\n\n"
        + "The pieces fit together in a way that survives a second look. ".repeat(8)
        + "\n\nThe content is still chaotic. The underlying idea is much bigger.",
      // the source's language and item count, the source as a character, a payoff number spelled out
      "2026-01-01_10-00_UTC_a_patreon.md": fm("patreon", "T", "first-person")
        + "I went through a Russian list of thirteen local models sorted by memory, from 8 GB up.\n\n"
        + "The list says the 27B fits in 8 GB, and the list files the 35B under 32 GB. ".repeat(20),
      // semicolons stacked where sentences belonged, and the author's evening spent on a file
      "2026-01-01_10-00_UTC_a_truthsocial.md": fm("truthsocial", "T", "first-person")
        + "I spent an evening with the README and kept 3 numbers from it; the first is 42; the second is 7; the third is 9. "
        + "The repo carries all of them and the mechanism is the part I would keep. ".repeat(4) + "#LocalAI #MoE #OpenSource",
      "bad_name.md": "nothing",
    };
    for (const [name, text] of Object.entries(cases)) writeFileSync(join(dir, name), text, "utf8");
    // the opener check counts a phrase repeated across a run, so it needs a run to fire on
    for (const slug of ["lemmy", "reddit", "linkedin"]) {
      writeFileSync(join(dir, `2026-01-01_10-00_UTC_a_${slug}.md`), fm(slug, "T", "first-person")
        + "I think this one is fine. " + "z".repeat(1100) + "\n\nI think it holds up.", "utf8");
    }
    const got = new Set(run(dir, true).map(([s, c]) => `${s}|${c}`));
    const expected = [
      "x|opener", "x|cap", "x|hashtags",
      "medium|title", "medium|shape", "medium|punctuation", "medium|dates",
      "medium|vocabulary", "medium|hype", "medium|links", "medium|band",
      "buymeacoffee|band", "name|filename",
      "minds|persona", "minds|spec", "run|opener", "tumblr|opener", "tumblr|closing", "bastyon|closing",
      "patreon|source", "patreon|numbers",
      "devto|title", "devto|superlative", "devto|closing", "devto|evidence",
      "truthsocial|semicolon", "truthsocial|document",
    ];
    const missing = expected.filter((e) => !got.has(e));
    if (missing.length) { console.log("self-test FAILED, checks that did not fire:", missing); return 1; }
    // --no-hashtags: a platform with no norm of its own is held to zero once the interview said none
    NO_HASHTAGS = true;
    const hdir = mkdtempSync(join(tmpdir(), "gate-h-"));
    writeFileSync(join(hdir, "2026-01-01_10-00_UTC_a_ko-fi.md"), fm("ko-fi", "T", "first-person")
      + "I spent an evening on it and kept 3 numbers from the card. ".repeat(40) + "\n\n#tag", "utf8");
    const noTags = run(hdir, true).some(([s, c]) => s === "ko-fi" && c === "hashtags");
    NO_HASHTAGS = false;
    rmSync(hdir, { recursive: true, force: true });
    if (!noTags) { console.log("self-test FAILED, checks that did not fire: [ 'ko-fi|hashtags under --no-hashtags' ]"); return 1; }
    // the checks against the source need a run folder: notes, source, unit, ledger, a pre-fix copy
    const rdir = mkdtempSync(join(tmpdir(), "gate-n-"));
    const posts = join(rdir, "posts"), before = join(rdir, "before");
    for (const d of [posts, before, join(rdir, "source")]) mkdirSync(d, { recursive: true });
    writeFileSync(join(rdir, "source", "source.md"), Array.from({ length: 30 }, (_, i) =>
      i === 2 ? "The 27B model fits in 8 GB of VRAM, the project reports." : i === 14 ? "Qwen3 keeps recall to 32K tokens." : "Filler paragraph.").join("\n\n"), "utf8");
    writeFileSync(join(rdir, "source-notes.md"), "Source paragraphs: 30\n\n- [C1] The 27B model fits in 8 GB. (at p3)\n"
      + "- [C2] Qwen3 keeps recall to 32K tokens. (at p15)\n- [N1] 27B, 8 GB (at p3)\n- [E1] Qwen3\n", "utf8");
    writeFileSync(join(rdir, "unit.md"), "I ran the 27B model in 8 GB and it held up.", "utf8");
    writeFileSync(join(rdir, "claims.md"), "| post | claim | ref |\n| --- | --- | --- |\n| medium | fits in 8 GB | C1 |\n"
      + "| medium | beats every rival | UNSUPPORTED |\n| linkedin | fits in 8 GB | C1 |\n| x | fits in 8 GB | N9 |\n", "utf8");
    const echo = "\n\nCurious what do you all make of this.";
    const nfm = (p, extra = "") => `---\nplatform: ${p}\ntitle: Local model memory tiers\nvoice: first-person\n${extra}---\n`;
    const linkedin = (gb) => nfm("linkedin", "source_anchor: p3\n")
      + "The quiet shift nobody talks about is not speed, but the discipline behind it. It is not a feature, it is a habit.\n\n"
      + `Notably, the comprehensive and pivotal landscape of tools keeps crucial insights hidden. The result? It fits in ${gb} GB. `
      + "It is significantly faster. #machinelearning \u{1F92F}\u{1F92F}\u{1F92F}" + echo + "\n\nMore here: https://example.com";
    writeFileSync(join(posts, "2026-01-01_10-00_UTC_a_linkedin.md"), linkedin(8), "utf8");
    writeFileSync(join(before, "2026-01-01_10-00_UTC_a_linkedin.md"), linkedin(16), "utf8");
    writeFileSync(join(posts, "2026-01-01_10-00_UTC_a_medium.md"), nfm("medium")
      + "I ran the 27B model and it guarantees 64 tokens a second on Llama4. The docs call it "
      + "\"the fastest local model anyone has ever shipped\"." + echo, "utf8");
    writeFileSync(join(posts, "2026-01-01_10-00_UTC_a_x.md"), nfm("x", "source_anchor: p3\n")
      + "I ran the 27B model in 8 GB: https://example.com" + echo, "utf8");
    writeFileSync(join(posts, "2026-01-01_10-00_UTC_a_bluesky.md"), nfm("bluesky", "source_anchor: p3\n") + "I ran it in 8 GB." + echo, "utf8");
    const got2 = new Set(run(posts, true, { notes: join(rdir, "source-notes.md"), before }).map(([s, c]) => `${s}|${c}`));
    rmSync(rdir, { recursive: true, force: true });
    const expected2 = [
      "medium|grounding", "medium|absolute", "medium|anchor", "medium|ledger", "medium|coverage",
      "linkedin|fold", "linkedin|contrast", "linkedin|density", "linkedin|overcorrection", "linkedin|vague",
      "linkedin|tagcase", "linkedin|emoji", "linkedin|link-only", "linkedin|drift",
      "x|ledger", "bluesky|ledger", "run|echo",
    ];
    const missing2 = expected2.filter((e) => !got2.has(e));
    if (missing2.length) { console.log("self-test FAILED, checks that did not fire:", missing2); return 1; }
    console.log(`self-test OK: ${expected.length + 1 + expected2.length} expected findings fired`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const valued = ["--notes", "--before"];
  const valueOf = (flag) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : undefined);
  const args = argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1]));
  const missing = valued.filter((f) => argv.includes(f) && !(valueOf(f) && existsSync(valueOf(f))));
  if (!args.length || missing.length) {
    if (missing.length) console.log(`${missing.join(", ")}: path missing or not found`);
    console.log("usage: node scripts/gate.mjs <posts-folder> [--subset] [--json] [--no-hashtags] [--notes <source-notes.md>] [--before <dir>] | --self-test");
    return 2;
  }
  NO_HASHTAGS = argv.includes("--no-hashtags");
  const findings = run(args[0], argv.includes("--subset"), { notes: valueOf("--notes"), before: valueOf("--before") });
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
