#!/usr/bin/env node
// The mechanical half of Phase 4 and the Verification section: every promise about
// the output files that a machine can settle, settled by a machine.
//
// SKILL.md already says the filenames are parse-verified and that no platform gets
// two posts in one slot. Asserting that in the final report is not the same as
// having done it, and the publisher is the one that finds out - it reads the
// frontmatter, falls back to the filename, and cannot ship a post whose two copies
// of the truth disagree. Each check below is one of those disagreements.
//
//   node check-campaign.mjs --campaign content-campaign/<slug>
//   node check-campaign.mjs --campaign <dir> --platforms <path to platforms.md>
//   node check-campaign.mjs --self-test
//
// The canonical slug list is read from references/platforms.md, never copied here:
// one vocabulary, one file. Findings print one per line as key=value.
// Exit 0 clean, 1 findings, 2 the campaign folder or the slug table is unreadable.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const NAME_RE = /^(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})_([A-Za-z][A-Za-z0-9-]*)_([a-z0-9][a-z0-9-]*)_([a-z0-9-]+)\.(md|txt|csv|html|pdf)$/;
const REQUIRED_KEYS = ["platform", "scheduled", "timezone", "title", "status"];
const PLACEHOLDERS = [/\bTBD\b/i, /\bTODO\b/, /\bFIXME\b/, /\blorem ipsum\b/i, /<(?:your|the|insert)\s[a-z ]+>/i];

export function readSlugs(platformsPath) {
  const text = readFileSync(platformsPath, "utf8");
  const slugs = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^\|\s*`([a-z0-9-]+)`/);
    if (m) slugs.add(m[1]);
  }
  if (!slugs.size) throw new Error(`no slug table found in ${platformsPath}`);
  return slugs;
}

// Deliberately small: the frontmatter this skill writes is flat scalars plus one
// attachments list. Anything richer is reported as unparsed rather than guessed at.
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { data: null, body: text, error: "no_frontmatter" };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: null, body: text, error: "unterminated_frontmatter" };
  const head = text.slice(3, end).split("\n");
  const body = text.slice(text.indexOf("\n", end + 1) + 1);
  const data = {};
  let listKey = null;
  for (const raw of head) {
    const line = raw.replace(/\s+#.*$/, "");
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s*(.*)$/);
    if (item && listKey) {
      const fileField = item[1].match(/^file:\s*(.+)$/);
      data[listKey].push(unquote(fileField ? fileField[1] : item[1]));
      continue;
    }
    if (/^\s+\w+:/.test(line) && listKey && data[listKey].length) continue;
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value.trim() === "") {
      listKey = key;
      data[key] = [];
    } else {
      listKey = null;
      data[key] = value.trim().startsWith("[")
        ? value.trim().slice(1, -1).split(",").map((v) => unquote(v.trim())).filter(Boolean)
        : unquote(value.trim());
    }
  }
  return { data, body, error: null };
}

const unquote = (v) => v.replace(/^["']|["']$/g, "").trim();

export function checkCampaign(dir, slugs) {
  const findings = [];
  const fail = (reason, file, field, detail) => findings.push({ reason, file, field, detail });

  if (!existsSync(join(dir, "campaign.md"))) fail("missing_manifest", "campaign.md");

  const postsDir = join(dir, "posts");
  if (!existsSync(postsDir)) {
    fail("missing_posts_dir", "posts/");
    return findings;
  }

  const files = readdirSync(postsDir).filter((f) => statSync(join(postsDir, f)).isFile());
  if (!files.length) fail("empty_posts_dir", "posts/");

  const slots = new Map();
  const bodies = new Map();

  for (const file of files) {
    const m = file.match(NAME_RE);
    if (!m) {
      fail("bad_filename", file, "name");
      continue;
    }
    const [, date, time, tzToken, , platform, ext] = m;
    if (!slugs.has(platform)) fail("unknown_platform", file, "platform", platform);

    const slot = `${date}_${time}_${platform}`;
    if (slots.has(slot)) fail("slot_collision", file, "scheduled", slots.get(slot));
    else slots.set(slot, file);

    if (ext !== "md") continue;

    const text = readFileSync(join(postsDir, file), "utf8");
    const { data, body, error } = parseFrontmatter(text);
    if (error) {
      fail(error, file, "frontmatter");
      continue;
    }

    for (const key of REQUIRED_KEYS) {
      if (data[key] === undefined || data[key] === "") fail("missing_frontmatter_key", file, key);
    }
    if (data.platform && data.platform !== platform) {
      fail("platform_mismatch", file, "platform", `${data.platform} vs ${platform}`);
    }
    if (data.timezone && data.timezone.replace(/[/_]/g, "-") !== tzToken) {
      fail("timezone_mismatch", file, "timezone", `${data.timezone} vs ${tzToken}`);
    }
    if (data.scheduled) {
      const s = String(data.scheduled).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
      if (!s) fail("unparsed_scheduled", file, "scheduled", String(data.scheduled));
      else if (s[1] !== date || `${s[2]}-${s[3]}` !== time) {
        fail("scheduled_mismatch", file, "scheduled", `${data.scheduled} vs ${date} ${time}`);
      }
    }
    for (const attachment of data.attachments || []) {
      if (!existsSync(resolve(dir, attachment))) fail("missing_attachment", file, "attachments", attachment);
    }
    if (!body.trim()) fail("empty_body", file, "body");
    for (const re of PLACEHOLDERS) {
      const hit = body.match(re);
      if (hit) fail("placeholder_text", file, "body", hit[0].trim());
    }

    const key = `${platform}::${body.trim()}`;
    if (bodies.has(key)) fail("duplicate_body_on_platform", file, "body", bodies.get(key));
    else bodies.set(key, file);
  }

  return findings;
}

function writePost(dir, name, frontmatter, body) {
  writeFileSync(join(dir, "posts", name), `---\n${frontmatter}\n---\n\n${body}\n`, "utf8");
}

function selfTest() {
  const slugs = new Set(["mastodon", "reddit"]);
  const root = mkdtempSync(join(tmpdir(), "campaign-selftest-"));

  const bad = join(root, "bad");
  mkdirSync(join(bad, "posts"), { recursive: true });
  writePost(bad, "2026-09-01_10-00_Europe-Kyiv_launch-day_mastodon.md",
    'platform: reddit\nscheduled: 2026-09-02 11:00\ntimezone: America/New_York\ntitle: "x"\nstatus: draft\nattachments:\n  - file: media/nope.png\n', "TODO write this");
  writePost(bad, "not-a-campaign-file.md", "platform: mastodon\n", "body");

  const good = join(root, "good");
  mkdirSync(join(good, "posts"), { recursive: true });
  mkdirSync(join(good, "media"), { recursive: true });
  writeFileSync(join(good, "campaign.md"), "# Campaign\n", "utf8");
  writeFileSync(join(good, "media", "shot.png"), "x", "utf8");
  writePost(good, "2026-09-01_10-00_Europe-Kyiv_launch-day_mastodon.md",
    'platform: mastodon\nscheduled: 2026-09-01 10:00\ntimezone: Europe/Kyiv\ntitle: "Launch day"\nstatus: draft\nattachments:\n  - file: media/shot.png\n    alt: "A terminal"\n', "We shipped the thing.");

  const mustFire = [
    "missing_manifest", "bad_filename", "platform_mismatch", "timezone_mismatch",
    "scheduled_mismatch", "missing_attachment", "placeholder_text",
  ];
  const fired = checkCampaign(bad, slugs).map((f) => f.reason);
  const missed = mustFire.filter((r) => !fired.includes(r));
  const falsePositives = checkCampaign(good, slugs);

  let ok = true;
  if (missed.length) {
    console.error(`self-test FAIL: check never fired: ${missed.join(", ")}`);
    ok = false;
  }
  if (falsePositives.length) {
    console.error(`self-test FAIL: clean campaign rejected: ${falsePositives.map((f) => f.reason).join(", ")}`);
    ok = false;
  }
  console.log(ok ? "self-test ok: every check fires on the bad campaign, none on the good one" : "self-test failed");
  return ok ? 0 : 1;
}

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

if (argv.includes("--self-test")) process.exit(selfTest());

const dir = flag("campaign");
if (!dir) {
  console.error("usage: check-campaign.mjs --campaign <dir> [--platforms <platforms.md>] | --self-test");
  process.exit(2);
}
if (!existsSync(dir)) {
  console.error(`no campaign folder at ${dir}`);
  process.exit(2);
}

let slugs;
const platformsPath = resolve(flag("platforms", join(HERE, "..", "references", "platforms.md")));
try {
  slugs = readSlugs(platformsPath);
} catch (error) {
  console.error(`cannot read the slug table: ${error.message}`);
  process.exit(2);
}

const findings = checkCampaign(dir, slugs);
for (const f of findings) {
  const field = f.field ? ` field=${JSON.stringify(f.field)}` : "";
  const detail = f.detail ? ` detail=${JSON.stringify(f.detail)}` : "";
  console.log(`FAIL campaign=${dir} file=${JSON.stringify(f.file)} reason=${f.reason}${field}${detail}`);
}
console.log(`${findings.length ? "FAIL" : "PASS"} campaign=${dir} platforms=${slugs.size} findings=${findings.length}`);
process.exit(findings.length ? 1 : 0);
