---
name: slop-audit-reports-only
description: awesome-slop-audit verifies a stale comment against the code, reports the marker classes, and edits nothing
tags: [behavior, audit]
max_turns: 16
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Find the AI-slop markers in this file. Report them; do not rewrite the file.

```js
// ====================================================
// Rate limiter — sliding window
// ====================================================

// The window is 60 seconds and allows 100 requests, matching the three
// call sites in the API layer.
const WINDOW_MS = 30_000;
const MAX_REQUESTS = 100;

/**
 * Checks whether the request is allowed.
 * @param {string} key - the key
 * @returns {boolean} whether the request is allowed
 */
export function isAllowed(key) {
  // Get the current time
  const now = Date.now();
  // Look up the bucket for this key
  const bucket = buckets.get(key) ?? [];
  // Remove timestamps that are outside the window → keep the recent ones
  const recent = bucket.filter((t) => now - t < WINDOW_MS);
  // Check if we are under the limit
  if (recent.length < MAX_REQUESTS) {
    recent.push(now);
    buckets.set(key, recent);
    return true;
  }
  return false;
}

const buckets = new Map();
```
