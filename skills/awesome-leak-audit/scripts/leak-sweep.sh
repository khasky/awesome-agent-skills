#!/usr/bin/env bash
# leak-sweep.sh — seed a public-client leak audit with one ripgrep pass.
#
# Usage:   scripts/leak-sweep.sh [TARGET_DIR]   (default: current directory)
#
# Prints hits grouped by the leak-taxonomy categories. Every hit is a LEAD, not a
# verdict — read it in context (see references/leak-taxonomy.md). Customize the
# PRODUCT_TERMS array below with this product's own backend stack, service names,
# defense names, and env-var prefixes learned in Phase 1; that's what turns a
# generic sweep into a product-specific one.
#
# Requires ripgrep (rg). Falls back to grep -rInE if rg is absent.

set -uo pipefail

TARGET="${1:-.}"

# ---- customize per product (Phase 1) --------------------------------------
# Add the real names you must NOT see in the public client: private repo names,
# backend framework/DB/host, internal service names, defense mechanisms, the
# server's env-var prefix, protocol vocabulary, etc.
PRODUCT_TERMS=(
  # 'my-private-backend' 'my-admin-repo' 'internal-service-name'
  # 'SECRET_ENV_PREFIX_' 'our-defense-name'
)

# Paths never worth scanning (build output, deps, VCS, lockfiles).
EXCLUDES=( --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/dist/**'
           --glob '!**/build/**' --glob '!**/.output/**' --glob '!**/.wxt/**'
           --glob '!**/*-lock.*' --glob '!**/*.lock' --glob '!**/vendor/**' )

have_rg=1; command -v rg >/dev/null 2>&1 || have_rg=0

scan() { # scan "<label>" "<regex>"
  local label="$1" pattern="$2" out
  if [ "$have_rg" -eq 1 ]; then
    out="$(rg -nI --no-heading --color never -i "${EXCLUDES[@]}" -e "$pattern" "$TARGET" 2>/dev/null)"
  else
    out="$(grep -rInE --binary-files=without-match \
            --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist \
            --exclude-dir=build --exclude-dir=.output "$pattern" "$TARGET" 2>/dev/null)"
  fi
  printf '\n=== %s ===\n' "$label"
  if [ -n "$out" ]; then printf '%s\n' "$out"; else printf '(clean)\n'; fi
}

echo "Leak sweep over: $TARGET   (rg=$have_rg)"
echo "Each hit is a LEAD — confirm in context before treating it as a leak."

scan "1. Private repo & path references" \
  '(\.\./\.\./)|(--filter[[:space:]]+\./)|((private|internal|admin|backend|infra|monorepo)-[a-z0-9-]+)'

scan "2. Backend tech stack & infrastructure" \
  '(postgres|mysql|mongo|redis|sqlite|dynamo|neon|planetscale|supabase|cloudflare|lambda|vercel|netlify|fastly|kubernetes|k8s|nginx|wrangler|terraform|pulumi|\.dev\.vars|docker-compose|durable[[:space:]]?object)'

scan "3. Anti-abuse, rate-limiting & quotas" \
  '(rate.?limit|ratelimit|throttl|cooldown|quota|breadth.?cap|shadow.?ban|soft.?drop|silently.?(drop|discard|reject)|tombstone|deweight|proof.?of.?work|hashcash|difficulty|nonce|captcha|turnstile|recaptcha|sybil|risk[[:space:]]?(score|gate|engine)|per-(ip|account|asn|device|user))'

scan "4. Auth & account internals" \
  '((jwt|session|token|refresh)[^\n]{0,20}(ttl|expir|lifetime|30.?day|24.?hour)|(otp|one.?time)[^\n]{0,20}(expir|lockout|attempts?|window)|disposable|allow.?list|allowlist|deny.?list|blocklist|domain[[:space:]]?gate|pepper|email[[:space:]]?hash)'

scan "5. Secrets & credentials" \
  '(sk_live_|rk_live_|ghp_|github_pat_|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-|-----BEGIN[[:space:]].*PRIVATE KEY-----|(api[_-]?key|secret|password|passwd|bearer)[[:space:]]*[:=][[:space:]]*.{8,})'

scan "6. Test/e2e encoding backend behavior" \
  '((test|e2e|qa|dummy|fake)[^\n]{0,20}(otp|code|token|account|user|email)|\?(fresh|debug|test|bypass|admin|internal)=|/(health|healthz|debug|__debug|internal|admin|metrics)\b|(deterministic|allow.?listed|test.?mode|test.?only)[^\n]{0,30}(server|backend|worker|counted|exempt))'

scan "7. Explanatory comments about the server" \
  '(the[[:space:]]+(server|backend|worker|api)[[:space:]]+(does|will|then|rejects|drops|records|marks|validates|processes|checks)|(server|backend|internally|behind[[:space:]]the[[:space:]]scenes)[[:space:]]*[-—:])'

scan "8. Docs / prod-staging internals" \
  '((production|prod|staging)[^\n]{0,40}(only|differs|recognizes|enables|server.?side|wiped|reset)|(maintainer|admin)[[:space:]]+enables?[[:space:]]+it)'

scan "9. TODO/FIXME referencing backend" \
  '(TODO|FIXME|HACK|XXX|NOTE)[^\n]{0,60}(server|backend|worker|api|prod|staging|secret|token)'

# ---- product-specific terms -----------------------------------------------
if [ "${#PRODUCT_TERMS[@]}" -gt 0 ]; then
  joined="$(printf '%s|' "${PRODUCT_TERMS[@]}")"; joined="${joined%|}"
  scan "10. Product-specific private terms" "($joined)"
else
  printf '\n=== 10. Product-specific private terms ===\n'
  printf '(none configured — edit PRODUCT_TERMS at the top of this script)\n'
fi

cat <<'EOF'

------------------------------------------------------------------------
Next steps:
  * Read each hit in context; classify necessary-minimum vs over-disclosure.
  * Also verify the SOURCE-BUNDLE exclude list (store zip / .npmignore / files)
    drops .env / .env.* — build the bundle and grep it; untracked != safe.
  * Scan the BUILT artifact too (dist/ or equivalent) for secrets & sourcemaps.
  * See references/leak-taxonomy.md for why each category matters.
------------------------------------------------------------------------
EOF
