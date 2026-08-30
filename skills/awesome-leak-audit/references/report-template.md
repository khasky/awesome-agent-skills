# Report template

Produce the final report in this shape. Keep it scannable: severity-ordered findings with `path:line`, then what you changed, then what the user still has to decide or do. Adapt headings to the product; drop sections that don't apply.

---

```markdown
# Public client leak & security audit — <product> (<date>)

Goal: keep the public <client type> self-contained — it may show the calls it makes
and the data shapes it exchanges, but must not disclose backend internals or help abuse.
Scope: <what was audited> vs <private counterparts>. Method: leak sweep + client hardening
+ API-disclosure review.

## Findings

### Critical
- `path:line` — <short quote> — <why> — <status: fixed / recommended>

### High
- `path:line` — …

### Medium
- `path:line` — …

### Low / informational
- `path:line` — …

## Applied changes
Grouped by theme, each with the files touched and a one-line rationale.
- **Secrets / bundle hygiene:** …
- **Leaking comments & strings (rewrite rule):** …
- **Docs:** …
- **Dead code:** …
- **Client hardening:** …

## Verification
- Typecheck / tests / lint / production build: <result + real exit codes>.
- Re-swept leak patterns: <which patterns are now zero>.
- Built artifact + source bundle scanned: <no secrets / sourcemaps / internal strings>.
- Legitimate differing flows still work: <e.g. staging/e2e build resolves correctly>.

## Recommendations (not applied — need your decision or live action)
1. **Secret rotation** — <which secrets, why> (untracked ≠ un-leaked; check past bundle submissions).
2. **Git history** — <what's recoverable from history>; treat as burned, rotate + keep server
   mechanisms out of future public commit subjects. Don't rewrite public history.
3. **Deferred tradeoffs** — <e.g. token store migration that would break login persistence;
   closed shadow root that would break e2e> with the reason each was deferred.
4. …

## Not assessed
Only what could NOT be checked, and why — <no source access, scanner unavailable, area out of
scope>. Omit the heading entirely when everything in scope was reachable.
```

---

## Notes on writing it

- **Lead with severity, not file order.** The reader wants the Critical/High items first.
- **Every finding gets a `path:line`.** A finding without a location isn't actionable.
- **Separate fixed from recommended.** "Applied changes" is done; "Recommendations" is the user's queue. Never silently fold a live action (rotation, history) into the applied section.
- **Never list what came back clean.** No coverage table, no per-area roll-call, no "verified / no issues" inventory: the reader acts on findings and on gaps, and everything else is scrolling. Coverage belongs in the one-line Scope at the top; a genuinely empty audit is one sentence.
- **Be honest about git history and untracked secrets.** Say plainly what can't be undone and what needs rotation rather than implying the tree edit closed it.
