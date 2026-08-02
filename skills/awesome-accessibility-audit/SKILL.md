---
name: awesome-accessibility-audit
description: "Audits UI and markup for accessibility (WCAG 2.1/2.2, keyboard, screen readers) and suggests concrete fixes. Use when checking a11y, before shipping a page or component, reviewing forms/modals/interactive UI, or when the user says 'accessibility', 'a11y', 'WCAG', 'screen reader', 'keyboard navigation', 'доступность'. Covers semantic HTML, focus management, labels, contrast, dynamic content, and WCAG 2.2 additions (target size, focus obscured, accessible authentication). Do not use for conversion structure (use awesome-landing-audit) or search discoverability (use awesome-seo-audit)."
license: MIT
metadata:
  author: Khasky
  tags: ["accessibility", "a11y", "wcag", "audit", "frontend"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-accessibility-audit"
---

# Accessibility Audit

Review UI and markup for accessibility and suggest concrete fixes aligned with WCAG so all users can perceive, operate, and understand the interface.

## When to Activate

- User asks for "accessibility", "a11y", "WCAG", or "screen reader support"
- Before shipping a new page or component
- Reviewing forms, modals, or interactive UI
- After a design or UI change that affects interaction or content

## Work Process

1. **Define scope** — Page, component, or flow to review (e.g. login form, report table, modal dialog).
2. **Check each area** — Semantic HTML, keyboard, labels and names, color and contrast, dynamic content, motion. Use the checklists below.
3. **Document findings** — Location (component/file or element type), WCAG criterion or principle, issue, impact, and recommended fix. Severity: Critical / High / Medium.
4. **Suggest fixes** — Code snippet or attribute change where possible. Prefer native HTML and correct ARIA over custom widgets when they suffice.
5. **Recommend follow-up** — Suggest automated tools (e.g. axe, Lighthouse, pa11y; in CI, fail the build on critical) and manual testing for broader coverage. Automated tools catch roughly 30–40% of WCAG issues — the rest is manual. Recommend a flow × assistive-tech matrix: test each key user flow across keyboard-only, a screen reader (VoiceOver on Mac/iOS, NVDA on Windows, TalkBack on Android), 200% and 400% zoom / reflow (WCAG 1.4.10), Windows High Contrast, and reduced-motion; note Voice Control/Dragon and Switch Control where relevant. Do not claim full WCAG compliance from a single review.
   - For automated assertions in tests: `axe-core` with `.withTags(['wcag2a','wcag2aa'])` targets a specific WCAG tier and can fail CI on violations; Playwright's `page.ariaSnapshot()` (1.59+) asserts the accessibility tree of dialogs, menus, and composite widgets — coverage beyond what axe/Lighthouse give.
   - Run automated scans at more than one viewport (mobile and desktop breakpoints, not only the default): focus-obscured, overlapping targets, and reflow violations appear or vanish with viewport size, so a single-viewport scan silently under-reports.

## Focus Areas and Checklist

### 1. Semantic HTML and structure

- [ ] One `<h1>` per page; heading levels in order (no skipping 2 → 4).
- [ ] Skip link to main content as the first focusable element (WCAG 2.4.1 Bypass Blocks).
- [ ] Viewport meta does not disable zoom: flag `user-scalable=no` and `maximum-scale=1` (WCAG 1.4.4).
- [ ] Landmarks: `<main>`, `<nav>`, `<aside>`, `<footer>` where appropriate.
- [ ] Lists use `<ul>`/`<ol>`/`<li>`; tables use `<th>`, `scope`, and caption if applicable.
- [ ] Buttons are `<button>` or `<input type="submit">`; links are `<a href="...">`. Do not use `<div onclick>` for actions without role, keyboard, and focus.
- [ ] Form controls have correct type and grouping (`<fieldset>`, `<legend>` for groups).

### 2. Keyboard

- [ ] All interactive elements are focusable (no `tabindex="-1"` on buttons/links unless managed for modal).
- [ ] Focus order is logical (matches visual order or is explicitly managed).
- [ ] Visible focus indicator (outline or custom style); not removed with `outline: none` without replacement. Prefer `:focus-visible` (no ring on mouse click) and `:focus-within` for compound controls.
- [ ] No keyboard trap: user can tab out of modals and menus; Escape closes where expected.
- [ ] Custom widgets (tabs, accordions, menus) operable with keyboard (Enter/Space to activate, Arrow keys if applicable).

### 3. Labels and names

- [ ] Every form input has a visible `<label>` or `aria-label`; labels are associated (e.g. `for`/`id` or wrapping).
- [ ] Inputs carry correct `type`/`inputmode` and `autocomplete` attributes (WCAG 1.3.5 Identify Input Purpose).
- [ ] Form errors appear inline next to their fields, each associated to its field via `aria-describedby` (without it a screen reader doesn't read the error when the field gets focus). On submit, focus moves to the first error; for long forms, add a keyboard-focusable error summary at the top that links to each errored field (GOV.UK pattern).
- [ ] User input is preserved on submit error, not cleared (reduces re-entry burden; see 3.3.7). Validate on blur, not on every keystroke.
- [ ] Paste is never blocked (`onPaste` + `preventDefault` is an anti-pattern) — anywhere, not just password fields.
- [ ] Buttons and links have clear, unique names (text content or `aria-label`). No "Click here" or "Read more" without context.
- [ ] Images: meaningful images have `alt` describing content; decorative images have `alt=""` or `role="presentation"`. Decorative icons (inline SVG, icon fonts) get `aria-hidden="true"`.
- [ ] Iframe and embedded content have `title` or `aria-label`.

### 4. Color and contrast

- [ ] Text meets contrast ratio (e.g. 4.5:1 for normal text, 3:1 for large; 3:1 for UI components). Check against background. (Newer design systems may use APCA, the perceptual model slated for WCAG 3.0 — note it if the project targets APCA, but audit against WCAG 2.2 ratios unless told otherwise.)
- [ ] Information is not conveyed by color alone (e.g. required fields, errors, status). Use icon, text, or pattern as well.
- [ ] Focus indicator is visible and not reliant only on color change.

### 5. Dynamic content and focus

- [ ] Content that appears or updates (e.g. toast, live results) is announced: `aria-live="assertive"` only for urgent interruptions (errors, toasts requiring action); `aria-live="polite"` for feed updates and result counts.
- [ ] SPA route changes are silent to screen readers: announce the new page via an `aria-live="polite"` region or move focus to the new page's `<h1>`.
- [ ] Modals and dialogs: focus moves into the modal when opened; focus is trapped inside; focus returns to trigger when closed; first focusable element or explicit `autoFocus` per pattern.
- [ ] State is communicated: expanded/collapsed (`aria-expanded`), selected (`aria-selected`), current (`aria-current`), disabled (`disabled` or `aria-disabled`).

### 6. Motion

- [ ] If the project supports it: respect `prefers-reduced-motion` (disable or reduce animation). Optional but recommended for vestibular sensitivity.

### 7. WCAG 2.2 additions (often missed)

- [ ] **2.4.11 Focus not obscured** — sticky headers/footers must not hide the focused element (`scroll-margin-top` helps).
- [ ] **2.5.8 Target size** — interactive targets at least 24×24 CSS px, or sufficient spacing between smaller ones. When the visible control is smaller, extend the hit area to 40–44px with a pseudo-element; two interactive elements must never have overlapping hit areas; a checkbox/radio and its label share one continuous target.
- [ ] **2.5.7 Dragging movements** — every drag operation has a click/tap alternative.
- [ ] **3.3.7 Redundant entry** — don't ask for the same information twice within one flow.
- [ ] **3.3.8 Accessible authentication** — no cognitive test to log in; paste allowed in password fields; passkey or email-link alternative offered.
- [ ] **3.2.6 Consistent help** — help mechanism appears in the same place on every page.

## Output Format

For each issue:

```markdown
**[Location: file or component/element]**
- **Issue:** [What is wrong.]
- **WCAG / principle:** [Criterion or principle, e.g. 1.3.1 Info and Relationships, 2.1.1 Keyboard.]
- **Impact:** [Who is affected and how.]
- **Recommendation:** [Concrete fix: code or attribute. For contrast findings, cite computed ratios: "#aaa on #fff = 2.32:1, needs 4.5:1 → use #595959 (7.0:1)".]
- **Severity:** Critical | High | Medium
```

Example of a populated finding:

```markdown
**[src/components/LoginForm.tsx — error message]**
- **Issue:** The "Invalid email" error renders visually below the field but is not associated with the input and is never announced.
- **WCAG / principle:** 3.3.1 Error Identification; 4.1.3 Status Messages.
- **Impact:** A screen-reader user submits, hears nothing, and cannot tell the form failed or which field to fix.
- **Recommendation:** Link it: `<input aria-describedby="email-err" aria-invalid="true">` + `<p id="email-err" role="alert">Invalid email</p>`; on submit, move focus to the first invalid field.
- **Severity:** Critical
```

Summary: "Reviewed: [scope]. Found X critical, Y high, Z medium. Recommend automated scan (axe/Lighthouse) and keyboard/screen reader testing."

## Severity

- **Critical** — Blocks core task (e.g. cannot submit form, cannot navigate with keyboard, no labels on required fields). Fix before release.
- **High** — Significant barrier (e.g. poor contrast, missing headings, confusing order). Fix soon.
- **Medium** — Improvement (e.g. redundant label, minor contrast). Backlog or fix when touching the component.

## Good vs bad examples

**Button:**
```html
<!-- BAD -->
<div onclick="submit()">Submit</div>

<!-- GOOD -->
<button type="submit">Submit</button>
```

**Image:**
```html
<!-- Decorative -->
<img src="decoration.svg" alt="" role="presentation">

<!-- Meaningful -->
<img src="chart.png" alt="Bar chart showing revenue up 20% in Q4">
```

**Form:**
```html
<!-- BAD -->
<input type="email" placeholder="Email">

<!-- GOOD -->
<label for="email">Email</label>
<input id="email" type="email" placeholder="you@example.com">
```

## When a rule breaks

Each checklist item encodes a default that prevents the most common failure mode. When the context inverts the failure mode, the rule may invert too — a decorative element that a screen reader should skip wants `aria-hidden`, not a label; a native `<button>` must not also get a `keydown` handler (double activation). The work is recognizing the inversion, not memorizing exceptions. Never let an exception breach the correctness/a11y floor: keyboard operability, a programmatic name, and sufficient contrast are not negotiable.

## Rules

- **Do not claim full compliance** — Frame as "issues found in reviewed scope." Recommend automated and manual testing for full coverage.
- **Prefer native HTML** — Use `<button>`, `<label>`, `<main>`, etc. Use ARIA when semantics cannot be expressed with HTML (e.g. `aria-expanded` on a custom accordion).
- **Component libraries** — If the project uses one (e.g. Radix, MUI), note library a11y patterns (focus trap, roles) and ensure they are used correctly rather than reimplementing.

## Checklist (before finishing)

- [ ] Scope clearly defined
- [ ] Each finding has location, issue, WCAG reference, recommendation, severity
- [ ] At least semantic structure, keyboard, and labels/names covered
- [ ] Follow-up (automated + manual testing) suggested
- [ ] No "fully WCAG 2.1 AAA compliant" without full audit

## Anti-patterns

| Anti-pattern | Better approach |
|--------------|-----------------|
| Only checking color contrast | Cover keyboard, labels, structure, and dynamic content |
| Suggesting "add aria-label" everywhere | Prefer visible labels and semantic HTML; use ARIA when necessary |
| Ignoring focus order in modals | Document focus trap and return focus behavior |
| Claiming compliance after code review only | Recommend axe/Lighthouse and real assistive tech testing |
