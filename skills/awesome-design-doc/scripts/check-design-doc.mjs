#!/usr/bin/env node
// Structural gate for a design doc or ADR, run before the document is handed over.
//
// The Self-check in SKILL.md is a list the writer grades themselves against, which
// is exactly the reading that walks past a template placeholder still sitting in
// section 6. These checks are the mechanical subset: presence, emptiness, counts,
// leftovers. They say nothing about whether the recommendation is right - that
// judgement stays in the Self-check and in review.
//
//   node check-design-doc.mjs <file.md> [--adr|--doc]
//   node check-design-doc.mjs --self-test
//
// Shape is detected from the content unless forced. Findings print one per line as
// key=value, so a rerun fixes the named field instead of re-deriving it from prose.
// Exit 0 clean, 1 findings, 2 the file could not be read.
import { readFileSync } from "node:fs";

const PLACEHOLDERS = [
  /\bTBD\b/i,
  /\bTODO\b/,
  /\bFIXME\b/,
  /\[citation needed\]/i,
  /\blorem ipsum\b/i,
  /\.\.\.\s*continue/i,
  /\bfill (?:this )?in\b/i,
  /<(?:your|the|insert)\s[a-z ]+>/i,
];

const DOC_SECTIONS = [
  { name: "requirements", match: /^#{2,3}\s.*\b(requirement|problem|context)/im },
  { name: "design", match: /^#{2,3}\s.*\b(design|proposal|architecture|approach)/im },
  { name: "alternatives", match: /^#{2,3}\s.*\balternativ/im },
  { name: "recommendation", match: /^#{2,3}\s.*\b(recommend|decision)/im },
  { name: "non-goals", match: /^#{2,3}\s.*\bnon-?goals?/im },
  { name: "risks", match: /^#{2,3}\s.*\brisk/im },
  { name: "rollout", match: /^#{2,3}\s.*\b(rollout|rollback|migration)/im },
];

const ADR_FIELDS = ["Status", "Context", "Decision", "Alternatives considered", "Consequences"];

function sectionBody(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => heading.test(l));
  if (start === -1) return null;
  const level = (lines[start].match(/^#+/) || ["##"])[0].length;
  const rest = [];
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+)\s/);
    if (m && m[1].length <= level) break;
    rest.push(lines[i]);
  }
  return rest.join("\n").trim();
}

function adrFieldBody(text, field) {
  const re = new RegExp(`^[ \\t]*(?:\\*\\*)?${field}(?:\\*\\*)?[ \\t]*:(.*)$`, "im");
  const m = text.match(re);
  if (!m) return null;
  const after = text.slice(text.indexOf(m[0]) + m[0].length).split("\n");
  const body = [m[1]];
  for (const line of after) {
    if (/^[ \t]*(?:\*\*)?[A-Z][A-Za-z ]{2,30}(?:\*\*)?[ \t]*:/.test(line)) break;
    if (/^#+\s/.test(line)) break;
    body.push(line);
  }
  return body.join("\n").trim();
}

function countAlternatives(block) {
  const bullets = block.split("\n").filter((l) => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(l));
  if (bullets.length) return bullets.length;
  const rows = block
    .split("\n")
    .filter((l) => /^\s*\|.*\|/.test(l) && !/^\s*\|[-\s|:]+\|\s*$/.test(l));
  return rows.length > 1 ? rows.length - 1 : 0;
}

export function check(text, shapeOverride) {
  const findings = [];
  const fail = (reason, field, detail) => findings.push({ level: "FAIL", reason, field, detail });
  const warn = (reason, field, detail) => findings.push({ level: "WARN", reason, field, detail });

  const looksAdr =
    /^[ \t]*(?:\*\*)?Status(?:\*\*)?[ \t]*:/im.test(text) &&
    /^[ \t]*(?:\*\*)?Decision(?:\*\*)?[ \t]*:/im.test(text);
  const shape = shapeOverride || (looksAdr ? "adr" : "doc");

  for (const re of PLACEHOLDERS) {
    const m = text.match(re);
    if (m) fail("placeholder_text", "body", m[0].trim());
  }

  if (shape === "adr") {
    for (const field of ADR_FIELDS) {
      const body = adrFieldBody(text, field);
      if (body === null) fail("missing_field", field);
      else if (!body) fail("empty_field", field);
    }
    const status = adrFieldBody(text, "Status");
    if (status && !/^(proposed|accepted|superseded)/i.test(status)) {
      fail("invalid_status", "Status", status.split("\n")[0]);
    }
    const alts = adrFieldBody(text, "Alternatives considered") || "";
    if (alts && countAlternatives(alts) < 2) {
      fail("too_few_alternatives", "Alternatives considered", String(countAlternatives(alts)));
    }
  } else {
    for (const { name, match } of DOC_SECTIONS) {
      const body = sectionBody(text, match);
      if (body === null) fail("missing_section", name);
      else if (!body) fail("empty_section", name);
    }
    const alts = sectionBody(text, DOC_SECTIONS[2].match) || "";
    if (alts && countAlternatives(alts) < 2) {
      fail("too_few_alternatives", "alternatives", String(countAlternatives(alts)));
    }
    if (!/^#{2,3}\s.*\bopen questions?/im.test(text)) warn("no_open_questions_section", "open questions");
  }

  const head = text.slice(0, Math.max(1200, Math.floor(text.length / 3)));
  if (!/\d/.test(head)) warn("no_numbers_in_context", "requirements");

  const risks = sectionBody(text, /^#{2,3}\s.*\brisk/im) || adrFieldBody(text, "Consequences") || "";
  if (risks && !/(early warning|warning sign|we would see|we will see|alert when|detect)/i.test(risks)) {
    warn("no_early_warning_signal", "risks");
  }

  return { shape, findings };
}

const BAD_FIXTURE = `# ADR-1: Pick a queue

Status: maybe
Context: TBD
Decision:
Alternatives considered: only one option, written as prose
Consequences: it will be fine
`;

const GOOD_FIXTURE = `# ADR-1: Route fan-out through the outbox table

Status: accepted
Date: 2026-01-05

Context: 400 orders/min at peak, 2 consumers, at-least-once delivery required. Dual writes to the broker lost 3 events in December.
Decision: write events to an outbox table inside the order transaction and ship them with a relay process.
Alternatives considered:
- Direct publish inside the transaction: simplest, but the broker call sits outside the database transaction, so a crash between the two loses the event. Lost against the durability requirement.
- Change data capture off the write-ahead log: no application change, but it adds an operational component nobody here runs. Lost on operational cost.
Consequences: one extra table and a relay to operate, and duplicate delivery becomes normal, so consumers need idempotency keys. Alert when the oldest unsent outbox row exceeds 60s.
`;

function selfTest() {
  const mustFire = ["placeholder_text", "empty_field", "invalid_status", "too_few_alternatives"];
  const fired = check(BAD_FIXTURE)
    .findings.filter((f) => f.level === "FAIL")
    .map((f) => f.reason);
  const missed = mustFire.filter((r) => !fired.includes(r));
  const falsePositives = check(GOOD_FIXTURE).findings.filter((f) => f.level === "FAIL");

  let ok = true;
  if (missed.length) {
    console.error(`self-test FAIL: check never fired: ${missed.join(", ")}`);
    ok = false;
  }
  if (falsePositives.length) {
    console.error(`self-test FAIL: clean fixture rejected: ${falsePositives.map((f) => f.reason).join(", ")}`);
    ok = false;
  }
  console.log(ok ? "self-test ok: every check fires on the bad fixture, none on the good one" : "self-test failed");
  return ok ? 0 : 1;
}

const argv = process.argv.slice(2);
if (argv.includes("--self-test")) process.exit(selfTest());

const file = argv.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: check-design-doc.mjs <file.md> [--adr|--doc] | --self-test");
  process.exit(2);
}

let text;
try {
  text = readFileSync(file, "utf8");
} catch (error) {
  console.error(`cannot read ${file}: ${error.message}`);
  process.exit(2);
}

const forced = argv.includes("--adr") ? "adr" : argv.includes("--doc") ? "doc" : undefined;
const { shape, findings } = check(text, forced);
for (const f of findings) {
  const detail = f.detail ? ` detail=${JSON.stringify(f.detail)}` : "";
  console.log(`${f.level} file=${file} shape=${shape} reason=${f.reason} field=${JSON.stringify(f.field)}${detail}`);
}
const fails = findings.filter((f) => f.level === "FAIL").length;
console.log(`${fails ? "FAIL" : "PASS"} file=${file} shape=${shape} fails=${fails} warns=${findings.length - fails}`);
process.exit(fails ? 1 : 0);
