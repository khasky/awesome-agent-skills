# Running static analysis (Semgrep, CodeQL, SARIF)

Scanners are an **active** step — they execute rules over the tree and some resolve dependencies, so they sit behind the main skill's approval gate. Once approved, their output is **leads, not findings**: every hit passes the same verification as a hand-read finding (see `verification.md`). A report of unverified scanner output is worse than no report — it buries the real bugs under noise and burns the reader's trust.

## Preflight (before recommending or running any of these)

Confirm the tool exists at a known version — `semgrep --version`, `codeql version`, `bandit --version` — exit 0, before you lean on it. A scanner you assumed was installed and a scanner that is installed produce different plans. Where a tool is absent, say the gate is **unavailable** rather than silently skipping it.

## Semgrep

```bash
# Telemetry off on every invocation — `--config auto` also phones home.
# During a security audit, that is data leakage; make --metrics=off a habit.
semgrep --version

# Broad first pass, then the third-party rulesets the official registry misses
semgrep scan --metrics=off --sarif -o raw/semgrep.sarif \
  --config p/default \
  --config p/security-audit \
  --config p/secrets \
  --config r/<language> .

# Third-party rules catch classes the registry does not — include whichever
# matches the detected language:
#   Trail of Bits   https://github.com/trailofbits/semgrep-rules
#   0xdea           https://github.com/0xdea/semgrep-rules
#   Decurity        https://github.com/Decurity/semgrep-rules
semgrep scan --metrics=off --config /path/to/trailofbits-rules --sarif -o raw/tob.sarif .
```

- **Approval is a hard gate.** "Scan this repo" is not approval for a specific plan — present the exact rulesets, target, engine, and mode, and wait for an explicit yes before running.
- **Pro engine, when licensed,** adds cross-file taint tracking and catches materially more true positives; check `semgrep --pro --validate --config p/default` and use it when available. OSS mode cannot follow data flow across files — say so, and consider CodeQL for the inter-file questions.
- **Parallelize by language** on a multi-language tree — one scan per language category — and merge the SARIF at the end.
- **Blind spots.** Parsers under-report on templated code (Jinja2, ERB, JSX) and on anything reached through metaprogramming, ORMs, or decorators. A clean scan over those paths is `NOT ASSESSED`, not "clean" — read them by hand.

## CodeQL (for the dataflow questions grep and Semgrep-OSS cannot answer)

```bash
codeql database create db --language=<lang> --source-root .
codeql database analyze db --format=sarif-latest -o raw/codeql.sarif \
  codeql/<lang>-queries
```

Reach for CodeQL when the finding hinges on interprocedural data flow (a taint chain across several functions or modules) that a single-file matcher misses.

## Language-native quick scanners

```bash
bandit -r . -f sarif -o raw/bandit.sarif    # Python
gosec -fmt=sarif -out raw/gosec.sarif ./...  # Go
cargo audit && cargo geiger                   # Rust: advisories + unsafe surface
npm audit --json                              # JS/TS dependency advisories
```

## Writing a rule for a confirmed class

Once a finding is confirmed, write a rule so the scanner finds the rest of the class (this is variant analysis mechanized). A rule ships with **two fixtures**:

- the **vulnerable** snippet it must match, and
- the **fixed** snippet it must not.

A rule with no failing fixture has never been proven to fire; a rule with no passing fixture will flag the fix. **Port before you re-derive** — the same class in a second language is usually the same rule with different syntax, and the fixture pair carries over. Cite the real rule ID and its CWE in the report (`python.flask.security.injection.sql-injection-with-format-string` → CWE-89), never a paraphrase — a reader must be able to re-run the exact rule.

## Suppressions

Every suppression carries a reason and an expiry:

```python
# nosec B608 — table name is an enum, not input; revisit 2026-Q4
```

A bare `.semgrepignore` line, `# noqa`, or undated baseline file is how a real finding gets inherited as "already triaged". `.semgrepignore` generated and vendored paths (they are not the audited code), and date every suppression.

## SARIF is the interchange format

Emit SARIF when the output has to reach CI, a code-scanning tab, or another tool; keep the human report separate — a SARIF dump is not an audit report. Merge per-language SARIF into one file before handing it on:

```bash
# any SARIF merge utility, or a small jq that concatenates .runs[]
jq -s '{version:"2.1.0", "$schema":.[0]["$schema"], runs:(map(.runs)|add)}' raw/*.sarif > results.sarif
```

Then triage every merged hit through `verification.md` — the SARIF is the input to the audit, not the audit.
