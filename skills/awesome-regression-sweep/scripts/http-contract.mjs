#!/usr/bin/env node
// Black-box contract probe for a public, cacheable read endpoint. Read-only:
// every request is a GET, HEAD, or OPTIONS.
//
// These are the properties no in-process test can see — they live in the router,
// the cache key, and the headers. Each one below has been broken in a shipped
// service, and each is invisible until a client, a CDN, or an attacker finds it.
//
//   node http-contract.mjs --base https://api.example.com --path /v1/status \
//     [--collection "/v1/items?from=1&to=3"] [--bad "/v1/items?from=9&to=1"] \
//     [--moving "/v1/feed?from=1"] [--private /v1/private] [--origin https://example.org]
//
// --path        a stable public read endpoint (the ETag/cache/HEAD subject)
// --collection  a path with at least two query parameters (canonicalization subject)
// --bad         a request that MUST be rejected (validation and CORS-on-error subject)
// --moving      an open-ended view that must not be immutable
// --private     a path that must NOT hand CORS to an unlisted origin
//
// Exit 0 when every check passes; WARN lines never fail the run.
//
// In Git Bash on Windows, prefix the command with MSYS_NO_PATHCONV=1 — otherwise
// `/v1/status` is rewritten into a Windows path before the script ever sees it.
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const BASE = (flag("base") ?? "").replace(/\/$/, "");
const PATH = flag("path");
const COLLECTION = flag("collection");
const BAD = flag("bad");
const MOVING = flag("moving");
const PRIVATE = flag("private");
const ORIGIN = flag("origin", "https://probe.invalid");

if (!BASE || !PATH) {
  console.error("usage: http-contract.mjs --base <url> --path </public/read/path> [--collection …] [--bad …] [--moving …] [--private …] [--origin …]");
  process.exit(2);
}

let pass = 0;
let fail = 0;
let warn = 0;
const ok = (what) => {
  pass++;
  console.log(`PASS  ${what}`);
};
const no = (what, detail) => {
  fail++;
  console.log(`FAIL  ${what}\n      ${detail}`);
};
const soft = (what, detail) => {
  warn++;
  console.log(`WARN  ${what}\n      ${detail}`);
};
const is = (what, actual, expected) => (String(actual) === String(expected) ? ok(what) : no(what, `expected [${expected}] got [${actual}]`));
const skip = (what, why) => console.log(`SKIP  ${what} (${why})`);

const url = (p) => (p.startsWith("http") ? p : `${BASE}${p}`);
const junk = () => `probe=${Math.random().toString(36).slice(2)}&pad=${"x".repeat(200)}`;
const withQuery = (p, extra) => `${p}${p.includes("?") ? "&" : "?"}${extra}`;

async function get(p, { method = "GET", headers = {} } = {}) {
  // An explicit controller, cleared in `finally` — a dangling abort timer can crash
  // the runtime's teardown on some platforms and take the exit code with it.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url(p), { method, headers, redirect: "manual", signal: controller.signal });
    let body = "";
    try {
      body = method === "HEAD" ? "" : await response.text();
    } catch {
      body = "<unreadable>";
    }
    const header = (name) => response.headers.get(name) ?? "";
    return { status: response.status, body, header };
  } finally {
    clearTimeout(timer);
  }
}

// --- canonical cache key -----------------------------------------------------
console.log("== canonical cache key ==");
const base = await get(PATH);
ok(`${PATH} answers (${base.status})`);

const noisy = await get(withQuery(PATH, junk()));
is("unknown parameters do not change the status", noisy.status, base.status);
is("unknown parameters do not change the body", noisy.body === base.body, true);

if (COLLECTION) {
  const first = await get(COLLECTION);
  const [path, query = ""] = COLLECTION.split("?");
  const params = query.split("&").filter(Boolean);
  if (params.length >= 2) {
    const reordered = `${path}?${[...params].reverse().join("&")}&${junk()}`;
    const shuffled = await get(reordered);
    is("reordered parameters plus junk give the same body", shuffled.body === first.body, true);
  } else {
    skip("parameter reordering", "--collection has fewer than two parameters");
  }

  const padded = `${path}?${params.map((p) => p.replace(/=(\d+)$/, (_, n) => `=00${n}`)).join("&")}`;
  if (padded !== COLLECTION) {
    const zero = await get(padded);
    is("zero-padded numbers give the same body", zero.body === first.body, true);
  } else {
    skip("zero-padding", "--collection carries no numeric parameter");
  }
} else {
  skip("collection canonicalization", "no --collection given");
}

// --- validation before work --------------------------------------------------
console.log("== validation before any query ==");
if (BAD) {
  const rejected = await get(BAD);
  is(`${BAD} is rejected`, rejected.status >= 400 && rejected.status < 500, true);
} else {
  skip("validation", "no --bad given");
}

// --- CORS on every branch ----------------------------------------------------
console.log("== CORS on every branch ==");
for (const [label, target] of [["success", PATH], ["error", BAD]].filter(([, t]) => t)) {
  const response = await get(target, { headers: { Origin: ORIGIN } });
  const acao = response.header("access-control-allow-origin");
  if (acao) ok(`CORS header present on the ${label} branch (${acao})`);
  else no(`CORS header present on the ${label} branch`, `no access-control-allow-origin on ${target} (${response.status})`);
  if (acao === "*" && response.header("access-control-allow-credentials")) {
    no(`never credentialed on the ${label} branch`, "wildcard origin plus allow-credentials");
  } else ok(`never credentialed on the ${label} branch`);
}

const preflight = await get(PATH, { method: "OPTIONS", headers: { Origin: ORIGIN, "Access-Control-Request-Method": "GET" } });
is("OPTIONS preflight succeeds", preflight.status >= 200 && preflight.status < 300, true);
if (preflight.header("access-control-allow-origin")) ok("OPTIONS preflight carries the CORS header");
else no("OPTIONS preflight carries the CORS header", `status ${preflight.status}, no access-control-allow-origin`);

if (PRIVATE) {
  const guarded = await get(PRIVATE, { headers: { Origin: ORIGIN } });
  const acao = guarded.header("access-control-allow-origin");
  if (acao === "*" || acao === ORIGIN) no("a non-public path refuses an unlisted origin", `${PRIVATE} answered with access-control-allow-origin: ${acao}`);
  else ok("a non-public path refuses an unlisted origin");
} else {
  skip("private-path CORS", "no --private given");
}

// --- ETag / conditional GET --------------------------------------------------
console.log("== ETag and conditional GET ==");
const etag = base.header("etag");
if (etag) {
  ok(`the endpoint carries an ETag (${etag})`);
  const fresh = await get(PATH, { headers: { "If-None-Match": etag, Origin: ORIGIN } });
  is("If-None-Match returns 304", fresh.status, 304);
  is("the 304 keeps its ETag", fresh.header("etag"), etag);
  is("the 304 keeps its CORS header", fresh.header("access-control-allow-origin") !== "", true);
  is("the 304 carries no body", fresh.body.length, 0);
  const stale = await get(PATH, { headers: { "If-None-Match": '"stale-probe"' } });
  is("a stale ETag still gets the full body", stale.status, base.status);
} else {
  skip("ETag checks", `no ETag on ${PATH}`);
}

// --- cache-control shape -----------------------------------------------------
console.log("== cache-control shape ==");
if (MOVING) {
  const moving = await get(MOVING);
  const cc = moving.header("cache-control");
  if (/immutable/.test(cc)) no("an open-ended view must not be immutable", `${MOVING} -> ${cc}`);
  else ok(`the open-ended view is a moving view (${cc || "no cache-control"})`);
} else {
  skip("moving-view check", "no --moving given");
}

const vary = base.header("vary");
const varyBeyondEncoding = vary.split(",").map((v) => v.trim().toLowerCase()).filter((v) => v && v !== "accept-encoding");
if (varyBeyondEncoding.length) no("a shared cache entry carries no Vary", `Vary: ${vary}`);
else ok(`no meaningful Vary on the shared entry${vary ? ` (${vary})` : ""}`);

// --- HEAD rides the GET handler ----------------------------------------------
console.log("== HEAD rides the GET handler ==");
const head = await get(PATH, { method: "HEAD" });
is("HEAD mirrors the GET status", head.status, base.status);
const headLength = head.header("content-length");
const getLength = base.header("content-length");
if (headLength && getLength && headLength !== getLength) no("HEAD reports the GET's content-length", `HEAD ${headLength} vs GET ${getLength}`);
else ok("HEAD reports the GET's content-length");

// --- security headers --------------------------------------------------------
console.log("== security headers ==");
for (const [name, expected] of [["x-content-type-options", "nosniff"], ["referrer-policy", null]]) {
  const value = base.header(name);
  if (!value) soft(`${name} is set`, `absent on ${PATH}`);
  else if (expected && value.toLowerCase() !== expected) soft(`${name} is ${expected}`, `got ${value}`);
  else ok(`${name}: ${value}`);
}
if (!base.header("x-frame-options") && !/frame-ancestors/.test(base.header("content-security-policy"))) {
  soft("a frame policy is set", "neither X-Frame-Options nor CSP frame-ancestors");
} else ok("a frame policy is set");

console.log(`\nRESULT: ${pass} passed, ${fail} failed, ${warn} warning(s)`);
process.exitCode = fail === 0 ? 0 : 1;
