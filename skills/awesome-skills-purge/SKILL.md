---
name: awesome-skills-purge
description: "Removes installed agent skills from every AI agent on the machine — Claude Code, Codex, Gemini CLI, Cursor, Copilot, opencode, Amp, Windsurf, and any other agent that reads a `skills/` directory — behind a keep list that can spare one collection, this skill alone, or a named set. Cross-platform by construction: the platform is detected at run time and every command comes from that detection. Use when asked to 'delete all skills', 'uninstall every skill from all agents', 'clean out my agent skills but keep X', 'remove the skills I installed', or in Russian 'удали все навыки', 'очисти скиллы у всех агентов', 'снеси все skills кроме'. Do not use to uninstall a plugin that ships skills (the agent's own plugin manager owns those) or to delete the git clone a symlinked install points at — that is a directory the user removes knowingly, not collateral of a purge."
license: MIT
metadata:
  author: Khasky
  tags: ["agent-skills", "uninstall", "cleanup", "cross-platform", "safety"]
  documentation: "https://github.com/khasky/awesome-agent-skills/tree/main/skills/awesome-skills-purge"
---

# Agent Skills Purge

Delete installed skills across every agent on the machine, keeping only what the user names. One agent's skills directory is easy to clear by hand; the problem this solves is that a dozen agents each read their own path, half of those paths hold **links** into a shared store or a git clone, and the same skill exists under four names at four locations.

**Why the ceremony:** deleting through a link, not the link itself, is how a purge eats a git clone that was never in scope. And a skill directory is not always what it looks like — `~/.claude/skills/foo` can be a real folder, a symlink into `~/.agents/skills`, or a junction into a repository under active development. Each needs a different removal, and telling them apart is the whole job.

## Core principle

**NOTHING IS DELETED UNTIL THREE THINGS HOLD:** the full inventory has been shown to the user, the keep list is agreed, and the user has explicitly confirmed. Everything before the gate is read-only.

Three invariants hold throughout:

- **Delete a link as a link, never recursively.** Whether a recursive delete follows a symlink or a junction depends on the tool, the shell, and its version. Remove the link itself and the question never comes up.
- **A link's target is out of scope unless it is independently in scope.** Removing `~/.claude/skills/foo` never authorizes touching whatever `foo` points at.
- **Never delete a directory that is inside a git work tree.** That is somebody's clone — the source of a symlinked install, not an installed copy. Report it, delete the links to it, leave it alone.

## Invocation

```
/awesome-skills-purge [--keep collection|self|none|<name>[,<name>…]] [--scope global|project <path>|all] [--no-backup]
```

- `--keep` — defaults to `self`, so the skill survives its own run and can be used again.
  - `collection` — every skill belonging to the awesome-agent-skills set (resolved by evidence, see Phase 2).
  - `self` — `awesome-skills-purge`, every copy of it, at every location.
  - `none` — everything goes. Requires the user to say the word; never inferred from "delete all".
  - `<name>,<name>` — exact folder names, matched at every location.
- `--scope` — `global` (per-user agent directories, the default), `project <path>` (skill directories inside one repository), or `all`.
- `--no-backup` — skip the archive. Only when the user says so; the default is to archive first.

Invoked with no arguments: run Phase 1, show the inventory, and ask for the keep list before anything else.

---

## Phase 0 — Detect the platform (never assume it)

Read the platform from the environment **before writing a single command**, and take every command below from that detection. A skill that hardcodes one OS is broken on the other two.

| | POSIX (Linux, macOS, BSD) | Windows |
|---|---|---|
| Detect | `uname -s` | `$IsWindows` (PowerShell 6+), or `$env:OS` = `Windows_NT` |
| Home | `$HOME` | `$env:USERPROFILE` |
| Link kinds | symlink | symlink **and** junction (`LinkType` tells you which) |
| Remove a link | `rm -- <link>` | `[System.IO.Directory]::Delete('<link>', $false)` |
| Remove a real directory | `rm -rf -- <dir>` | `Remove-Item '<dir>' -Recurse -Force` |

Two traps worth naming:

- **Git Bash on Windows is Windows.** A POSIX-looking shell there still faces junctions, `USERPROFILE`, and backslash paths. Detect the OS, not the shell.
- **A wildcard path can be refused.** Some agent harnesses block a delete whose path ends in `\*` or `/*` as a protected-path pattern. Iterate over entries and delete each by its full path — which is what this skill does anyway, because entries need per-entry classification.

**Prove the link handling before the destructive run** (optional, ten seconds, and the one check that stands between a mistake and a deleted repository):

```bash
t=$(mktemp -d); mkdir "$t/target"; echo alive > "$t/target/keep.txt"; ln -s "$t/target" "$t/link"
rm -- "$t/link"; cat "$t/target/keep.txt"    # must print: alive
```

```powershell
$t = Join-Path $env:TEMP ("purge-check-" + [guid]::NewGuid())
New-Item -ItemType Directory "$t\target" -Force | Out-Null; 'alive' | Set-Content "$t\target\keep.txt"
New-Item -ItemType Junction -Path "$t\link" -Target "$t\target" | Out-Null
[System.IO.Directory]::Delete("$t\link", $false); Get-Content "$t\target\keep.txt"   # must print: alive
```

---

## Phase 1 — Inventory (read-only)

**Find the skill roots.** Sweep the home directory rather than working from a fixed list — agents keep appearing, and a hardcoded table silently misses the one the user actually installed into.

```bash
find "$HOME" -maxdepth 3 -type d -name skills 2>/dev/null
```

```powershell
Get-ChildItem $env:USERPROFILE -Directory -Force -Recurse -Depth 2 -Filter skills -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName
```

Depth 3 (POSIX) / depth 2 (PowerShell, which counts from the search root) is the same reach: it covers `~/.claude/skills`, `~/.agents/skills`, and the nested forms — `~/.config/opencode/skills`, `~/.codeium/windsurf/skills`, `~/.gemini/antigravity/skills`. The commonly documented roots are below; the sweep is authoritative, this table is only for reading the results back to the user in terms they recognize.

| Agent | Global root |
|---|---|
| Claude Code | `~/.claude/skills/` |
| OpenAI Codex, Amp, Cursor, Copilot, Gemini CLI (shared) | `~/.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` |
| GitHub Copilot | `~/.copilot/skills/` |
| opencode | `~/.config/opencode/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` |

For `--scope project <path>`, search that path instead: `<path>/.claude/skills`, `<path>/.agents/skills`, `<path>/.cursor/skills`, `<path>/.github/skills`, `<path>/.opencode/skills`, `<path>/.gemini/skills`.

**Classify every entry** — this is the part that decides how it gets deleted:

```bash
for root in $ROOTS; do
  for e in "$root"/*; do
    [ -e "$e" ] || [ -L "$e" ] || continue
    if [ -L "$e" ]; then printf 'link  %s -> %s\n' "$e" "$(readlink "$e")"
    else printf 'real  %s\n' "$e"; fi
  done
done
```

```powershell
foreach ($root in $roots) {
  Get-ChildItem $root -Force -ErrorAction SilentlyContinue | ForEach-Object {
    '{0}  {1}{2}' -f $(if ($_.LinkType) { 'link' } else { 'real' }), $_.FullName,
                     $(if ($_.Target) { ' -> ' + $_.Target } else { '' })
  }
}
```

Then, for every **real** directory and every **link target**, check whether it sits inside a git work tree:

```
git -C <path> rev-parse --show-toplevel
```

Exit 0 → it is a clone. Record it as **source, not installed** — it is protected by invariant three, whatever the keep list says.

Report the inventory as a table before asking anything: root, entry count, how many are links, how many are real, and which targets are clones. A user who installed with `npx skills add` (symlinks by default) will see almost all links and one clone; a user who installed with `--copy` will see real directories everywhere.

---

## Phase 2 — Resolve the keep list

Turn `--keep` into an explicit set of folder names, and show it. A keep list the user has not read is not a keep list.

- **`collection`** — resolve by evidence, not by guessing at names. For each candidate, read `SKILL.md` frontmatter and keep it when `metadata.documentation` points at the collection's repository. Where frontmatter carries no such field, fall back to the folder-name prefix (`awesome-*`) **and say that you did** — the prefix over-keeps any unrelated skill that happens to share it. If a clone of the collection is on disk (Phase 1 found it as a link target), the names under its `skills/` directory are the exact set; prefer that.
- **`self`** — `awesome-skills-purge`, matched at every root.
- **`<names>`** — exact folder names, case-sensitive on POSIX, case-insensitive on Windows.

Keeping is by **name at every location**: keeping `foo` keeps `~/.claude/skills/foo` *and* `~/.agents/skills/foo`, link or real. Keeping a link whose target you are about to delete produces a dangling link — so when a kept entry is a link, its target is kept too. Add it to the set and say so.

Then read the deletion list back: how many entries at how many roots, and the total on disk of the real ones. This is the number the confirmation gate quotes.

---

## Phase 3 — Backup and confirmation gate

**Archive the real directories** (links cost nothing to recreate, and archiving through them would copy the target):

```bash
tar -czf "$HOME/agent-skills-backup-$(date +%Y%m%d-%H%M%S).tgz" -C / <each real dir, relative>
```

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Compress-Archive -Path $realDirs -DestinationPath "$env:USERPROFILE\agent-skills-backup-$stamp.zip"
```

Report the archive's absolute path and its size. Nothing here deletes it. If the user passed `--no-backup`, state plainly in the gate that there is no rollback path.

**The gate.** State exactly what will happen, then get an explicit yes:

> This will delete `<N>` skills across `<M>` agent directories (`<K>` links, `<R>` real folders, `<size>` on disk). Kept: `<keep list>`. Not touched: `<clone paths>`. Backup: `<archive path>` | **none — this cannot be undone**. Proceed?

No explicit confirmation → stop. Everything so far was read-only.

---

## Phase 4 — Delete

Links first, then real directories. Links first is not cosmetic: it means that at every moment a link either points at live content or is already gone, so nothing ever recurses into a half-deleted store.

```bash
for root in $ROOTS; do
  for e in "$root"/*; do
    [ -e "$e" ] || [ -L "$e" ] || continue
    case " $KEEP " in *" $(basename "$e") "*) continue;; esac
    if [ -L "$e" ]; then rm -- "$e"; fi
  done
done
# second pass, same loop, real entries only:
#   else rm -rf -- "$e"
```

```powershell
foreach ($pass in 'link','real') {
  foreach ($root in $roots) {
    foreach ($e in Get-ChildItem $root -Force -ErrorAction SilentlyContinue) {
      if ($keep -contains $e.Name) { continue }
      if ($pass -eq 'link' -and $e.LinkType) {
        if ($e.PSIsContainer) { [System.IO.Directory]::Delete($e.FullName, $false) }
        else { [System.IO.File]::Delete($e.FullName) }
      }
      elseif ($pass -eq 'real' -and -not $e.LinkType) {
        Remove-Item $e.FullName -Recurse -Force
      }
    }
  }
}
```

- `rm --` and `Get-ChildItem -Force` handle the two things that break naive loops: an entry whose name starts with `-`, and dot-prefixed entries an unforced listing skips.
- A real directory inside a git work tree is **skipped and reported**, never deleted, even when the keep list does not name it.
- Count what each pass removed. A pass that deletes zero where the inventory listed entries means the loop is not seeing what the inventory saw — stop and re-inventory rather than escalating force.
- **Leave the `skills` root directories in place, empty.** Agents create them anyway, and removing them buys nothing. Remove a root only if the user asks.

---

## Phase 5 — Verify

Re-run the Phase 1 inventory. It is the proof, not the deletion's own exit codes:

- Every remaining entry is in the keep list. Anything else means a root was missed.
- Every kept link still resolves: `[ -e "$link" ]` (POSIX) / `Test-Path $e.Target` (Windows). A dangling kept link means Phase 2 failed to pull in a target.
- Every clone recorded in Phase 1 still exists, and `git -C <clone> status --porcelain` is unchanged from before.
- The archive exists and opens: `tar -tzf <archive> | head` / `Get-ChildItem` on the expanded zip listing.

---

## Phase 6 — Report

```text
Platform:   <detected OS> / <shell>
Roots:      <M> skill directories under <home or project path>
Deleted:    <K> links, <R> real folders (<size> reclaimed)
Kept:       <names>  (at <roots>)
Protected:  <clone paths>  — links removed, working trees untouched
Backup:     <absolute path>  (<size>)  |  none (--no-backup)
Verified:   re-inventory = keep list only; kept links resolve; clones intact
```

**Manual residuals (a file delete cannot reach these):**

- **Plugin-provided skills.** Skills that arrive with a plugin live under the plugin's own directory (Claude Code: `~/.claude/plugins/`) and reappear on the next plugin load. Remove the plugin through the agent's plugin manager (`/plugin` in Claude Code), not by deleting files.
- **Hosted skills.** Claude.ai's uploaded skills live in the account, not on disk — **Settings → Skills** in the web UI.
- **Project-level directories** when the scope was `global`, and vice versa. Name what was left out of scope.
- **Restart the agents.** A running session keeps its loaded skill list; a deleted skill can still appear in an open session until it reloads.
- **The install source.** If skills were symlinked from a clone, the clone is still on disk and one `skills add` re-installs everything. Say where it is; deleting it is the user's separate decision.

## Guardrails

- Read-only until the Phase 3 gate. Inventory, classification, and keep-list resolution change nothing.
- Links are removed as links; a recursive delete is never pointed at one.
- A directory inside a git work tree is never deleted by this skill — not as an installed skill, not as a link target, not on a keep-list miss.
- The keep list is shown and confirmed before use. `--keep none` requires the user to say it; "delete all skills" alone still keeps this skill, and the report says so.
- The backup is never deleted here, and its path is always reported.
- Every command is chosen from the Phase 0 detection. Commands from the other platform's column are not written, not suggested, and not run.
