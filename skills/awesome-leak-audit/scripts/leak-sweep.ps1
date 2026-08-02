#!/usr/bin/env pwsh
# leak-sweep.ps1 - seed a public-client leak audit with one ripgrep pass.
#
# Usage:   scripts/leak-sweep.ps1 [-Target <dir>]     (default: current directory)
#
# PowerShell twin of leak-sweep.sh for native Windows. Both shell out to the same
# `rg` binary with the same patterns, so their output matches. One deliberate
# difference: category 7 writes the em-dash as \x{2014} here, because the .sh keeps
# it literal for its grep fallback (POSIX ERE has no \x{...} escape) and this script
# has no such fallback.
# KEEP THE PATTERNS IN SYNC WITH leak-sweep.sh - change one, change the other.
#
# Prints hits grouped by the leak-taxonomy categories. Every hit is a LEAD, not a
# verdict - read it in context (see references/leak-taxonomy.md). Customize the
# $ProductTerms array below with this product's own backend stack, service names,
# defense names, and env-var prefixes learned in Phase 1; that's what turns a
# generic sweep into a product-specific one.
#
# Requires ripgrep (rg). Unlike the .sh there is no grep fallback: Windows has no
# grep by default, and Select-String uses .NET regex, which rejects the POSIX
# character classes below. Install rg instead of translating them.

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Target = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---- customize per product (Phase 1) --------------------------------------
# Add the real names you must NOT see in the public client: private repo names,
# backend framework/DB/host, internal service names, defense mechanisms, the
# server's env-var prefix, protocol vocabulary, etc.
$ProductTerms = @(
    # 'my-private-backend', 'my-admin-repo', 'internal-service-name',
    # 'SECRET_ENV_PREFIX_', 'our-defense-name'
)

# Paths never worth scanning (build output, deps, VCS, lockfiles).
$Excludes = @(
    '--glob', '!**/node_modules/**', '--glob', '!**/.git/**', '--glob', '!**/dist/**'
    '--glob', '!**/build/**', '--glob', '!**/.output/**', '--glob', '!**/.wxt/**'
    '--glob', '!**/*-lock.*', '--glob', '!**/*.lock', '--glob', '!**/vendor/**'
)

if (-not (Get-Command rg -ErrorAction SilentlyContinue)) {
    Write-Error "ripgrep (rg) not found on PATH. Install it: winget install BurntSushi.ripgrep.MSVC (Windows), brew install ripgrep (macOS), or your distro's package."
    exit 1
}

if (-not (Test-Path -LiteralPath $Target)) {
    Write-Error "Target path not found: $Target"
    exit 1
}

function Invoke-Scan {
    param([string]$Label, [string]$Pattern)

    # rg exits 1 when there are no matches; that is "clean", not a failure.
    $out = & rg -nI --no-heading --color never -i @Excludes -e $Pattern $Target 2>$null

    Write-Output ""
    Write-Output "=== $Label ==="
    if ($out) { $out | Write-Output } else { Write-Output "(clean)" }
}

Write-Output "Leak sweep over: $Target"
Write-Output "Each hit is a LEAD - confirm in context before treating it as a leak."

Invoke-Scan "1. Private repo & path references" `
  '(\.\./\.\./)|(--filter[[:space:]]+\./)|((private|internal|admin|backend|infra|monorepo)-[a-z0-9-]+)'

Invoke-Scan "2. Backend tech stack & infrastructure" `
  '(postgres|mysql|mongo|redis|sqlite|dynamo|neon|planetscale|supabase|cloudflare|lambda|vercel|netlify|fastly|kubernetes|k8s|nginx|wrangler|terraform|pulumi|\.dev\.vars|docker-compose|durable[[:space:]]?object)'

Invoke-Scan "3. Anti-abuse, rate-limiting & quotas" `
  '(rate.?limit|ratelimit|throttl|cooldown|quota|breadth.?cap|shadow.?ban|soft.?drop|silently.?(drop|discard|reject)|tombstone|deweight|proof.?of.?work|hashcash|difficulty|nonce|captcha|turnstile|recaptcha|sybil|risk[[:space:]]?(score|gate|engine)|per-(ip|account|asn|device|user))'

Invoke-Scan "4. Auth & account internals" `
  '((jwt|session|token|refresh)[^\n]{0,20}(ttl|expir|lifetime|30.?day|24.?hour)|(otp|one.?time)[^\n]{0,20}(expir|lockout|attempts?|window)|disposable|allow.?list|allowlist|deny.?list|blocklist|domain[[:space:]]?gate|pepper|email[[:space:]]?hash)'

Invoke-Scan "5. Secrets & credentials" `
  '(sk_live_|rk_live_|ghp_|github_pat_|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-|-----BEGIN[[:space:]].*PRIVATE KEY-----|(api[_-]?key|secret|password|passwd|bearer)[[:space:]]*[:=][[:space:]]*.{8,})'

Invoke-Scan "6. Test/e2e encoding backend behavior" `
  '((test|e2e|qa|dummy|fake)[^\n]{0,20}(otp|code|token|account|user|email)|\?(fresh|debug|test|bypass|admin|internal)=|/(health|healthz|debug|__debug|internal|admin|metrics)\b|(deterministic|allow.?listed|test.?mode|test.?only)[^\n]{0,30}(server|backend|worker|counted|exempt))'

Invoke-Scan "7. Explanatory comments about the server" `
  '(the[[:space:]]+(server|backend|worker|api)[[:space:]]+(does|will|then|rejects|drops|records|marks|validates|processes|checks)|(server|backend|internally|behind[[:space:]]the[[:space:]]scenes)[[:space:]]*[-\x{2014}:])'

Invoke-Scan "8. Docs / prod-staging internals" `
  '((production|prod|staging)[^\n]{0,40}(only|differs|recognizes|enables|server.?side|wiped|reset)|(maintainer|admin)[[:space:]]+enables?[[:space:]]+it)'

Invoke-Scan "9. TODO/FIXME referencing backend" `
  '(TODO|FIXME|HACK|XXX|NOTE)[^\n]{0,60}(server|backend|worker|api|prod|staging|secret|token)'

# ---- product-specific terms -----------------------------------------------
if ($ProductTerms.Count -gt 0) {
    Invoke-Scan "10. Product-specific private terms" ("(" + ($ProductTerms -join "|") + ")")
} else {
    Write-Output ""
    Write-Output "=== 10. Product-specific private terms ==="
    Write-Output "(none configured - edit `$ProductTerms at the top of this script)"
}

Write-Output @"

------------------------------------------------------------------------
Next steps:
  * Read each hit in context; classify necessary-minimum vs over-disclosure.
  * Also verify the SOURCE-BUNDLE exclude list (store zip / .npmignore / files)
    drops .env / .env.* - build the bundle and grep it; untracked != safe.
  * Scan the BUILT artifact too (dist/ or equivalent) for secrets & sourcemaps.
  * See references/leak-taxonomy.md for why each category matters.
------------------------------------------------------------------------
"@
