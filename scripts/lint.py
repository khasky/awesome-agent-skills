#!/usr/bin/env python3
"""Every gate CI enforces, runnable before the commit exists.

CI calls this file and so does the pre-commit hook, so a check lives here once
and cannot drift between the two. `python3 scripts/install-hooks.py` installs
the hook; see CONTRIBUTING for the rest.

Exit code is 0 when every check passed, 1 otherwise. Each check prints its own
verdict so a failure names itself in the CI log.
"""

from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILLS = ROOT / "skills"
REPO_NAMES = {"awesome-agent-skills", "awesome-agents-md"}


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def tracked() -> set[str]:
    """Paths git knows about, so the gate sees what CI's clean checkout sees.

    Cached because every check asks for it. Without this the hook fails on
    untracked local leftovers - an empty skills/<name>/references/ that git
    never stored - and a gate that refuses commits for invisible reasons is a
    gate people learn to bypass.
    """
    if not _TRACKED:
        out = subprocess.run(["git", "ls-files"], cwd=ROOT,
                             capture_output=True, text=True).stdout.split("\n")
        _TRACKED.update(line.strip() for line in out if line.strip())
    return _TRACKED


_TRACKED: set[str] = set()


def skill_dirs() -> list[pathlib.Path]:
    names = {path.split("/")[1] for path in tracked()
             if path.startswith("skills/") and path.count("/") >= 2}
    return sorted(SKILLS / name for name in names)


def rel(path: pathlib.Path) -> str:
    return path.relative_to(ROOT).as_posix()


def tracked_markdown() -> list[pathlib.Path]:
    """Tracked .md files, so an untracked scratch file never fails the build."""
    out = subprocess.run(["git", "ls-files", "*.md"], cwd=ROOT,
                         capture_output=True, text=True).stdout.split("\n")
    return [ROOT / line for line in out if line.strip()]


# --- the checks -------------------------------------------------------------
# Each returns a list of failure lines; empty means the gate passed.

def frontmatter_is_valid() -> list[str]:
    key = re.compile(r"^([a-z_]+):(.*)$")
    fail: list[str] = []

    def unquote(raw: str, where: str) -> str:
        value = raw.strip()
        if value[:1] in ('"', "'"):
            if len(value) < 2 or value[-1] != value[0]:
                fail.append(f"{where}: unbalanced quoting in the value")
                return value
            return value[1:-1]
        return value

    for folder in skill_dirs():
        path = folder / "SKILL.md"
        if not path.exists():
            fail.append(f"{rel(folder)}: no SKILL.md")
            continue
        lines = read(path).splitlines()
        if not lines or lines[0].strip() != "---":
            fail.append(f"{rel(path)}: no frontmatter")
            continue
        try:
            end = lines.index("---", 1)
        except ValueError:
            fail.append(f"{rel(path)}: frontmatter is never closed")
            continue

        keys = {}
        for line in lines[1:end]:
            match = key.match(line)
            if match:
                keys[match.group(1)] = match.group(2)

        for required in ("name", "description", "license", "metadata"):
            if required not in keys:
                fail.append(f"{rel(path)}: missing '{required}'")

        if "name" in keys and unquote(keys["name"], rel(path)) != folder.name:
            fail.append(f"{rel(path)}: name does not match folder '{folder.name}'")

        if "description" in keys:
            description = unquote(keys["description"], rel(path))
            if not description:
                fail.append(f"{rel(path)}: empty description - the agent has nothing to trigger on")
            elif len(description) > 1024:
                fail.append(f"{rel(path)}: description is {len(description)} chars (max 1024)")

    return fail


def catalogs_list_every_skill() -> list[str]:
    skills = len(skill_dirs())
    readme = len(re.findall(r"^\| \[awesome-", read(ROOT / "README.md"), re.M))
    llms = len(re.findall(r"^- \[awesome-", read(ROOT / "llms.txt"), re.M))
    if skills == readme == llms:
        return []
    return [f"skills/={skills} README table={readme} llms.txt={llms}"]


def code_fences_are_balanced() -> list[str]:
    fail = []
    for path in tracked_markdown():
        if not path.exists():
            continue
        count = len(re.findall(r"^```", read(path), re.M))
        if count % 2:
            fail.append(f"{rel(path)}: unbalanced code fences ({count})")
    return fail


def catalogue_links_resolve() -> list[str]:
    # Only catalogue links are checked: SKILL.md bodies quote example markdown
    # that a general link checker would flag.
    text = read(ROOT / "README.md") + read(ROOT / "llms.txt")
    fail = []
    for target in sorted(set(re.findall(r"skills/awesome-[a-z0-9-]+", text))):
        if not (ROOT / target).is_dir():
            fail.append(f"catalogue references missing skill: {target}")
    return fail


def cross_references_resolve() -> list[str]:
    # Every awesome-* skill named inside a skill body must exist - a sibling
    # handoff to a skill that was never written is how dangling references
    # survived four commits.
    names = set()
    for folder in skill_dirs():
        for path in [folder / "SKILL.md", *sorted((folder / "references").glob("*.md"))]:
            if path.exists():
                names.update(re.findall(r"awesome-[a-z0-9-]+", read(path)))
    return [f"dangling skill reference: {name}"
            for name in sorted(names - REPO_NAMES)
            if not (SKILLS / name).is_dir()]


def no_per_skill_readme() -> list[str]:
    # A per-skill README duplicates SKILL.md, drifts from it, and hides the
    # folder map in a file the agent never opens.
    found = sorted(p for p in tracked()
                   if p.startswith("skills/") and p.endswith("/README.md"))
    if found:
        return ["remove; describe the skill in the root README instead:", *found]
    return []


EVAL_FILES = ("eval_queries.json", "evals.json")


def skills_ship_markdown_only() -> list[str]:
    # A skill instructs; it never ships code, and no skill is exempt. An
    # allowlist stood here for one that shipped a renderer, and went when that
    # skill stopped shipping one. The evals/ pair below is data the maintainer
    # measures a description with, never a file that runs.
    def is_eval_set(path: str) -> bool:
        parts = path.split("/")
        return len(parts) == 4 and parts[2] == "evals" and parts[3] in EVAL_FILES

    fail = []
    others = sorted(p for p in tracked()
                    if p.startswith("skills/") and not p.endswith(".md")
                    and not is_eval_set(p))
    if others:
        fail.append("a skill may hold only Markdown, plus an evals/ set; remove or convert:")
        fail.extend(others)
    dirs = sorted({"/".join(p.split("/")[:3]) for p in tracked()
                   if p.startswith("skills/") and p.count("/") >= 3
                   and p.split("/")[2] not in ("references", "evals")})
    if dirs:
        fail.append("a skill folder holds SKILL.md, references/ and evals/ only:")
        fail.extend(dirs)
    return fail


def referenced_assets_exist() -> list[str]:
    # A named references/ file must exist in the skill's own folder - or in a
    # sibling skill's, for cross-skill mentions the prose qualifies.
    fail = []
    for folder in skill_dirs():
        path = folder / "SKILL.md"
        if not path.exists():
            continue
        for name in sorted(set(re.findall(r"references/[A-Za-z0-9._-]+\.[a-z0-9]+", read(path)))):
            if (folder / name).exists():
                continue
            if any((sibling / name).exists() for sibling in skill_dirs()):
                continue
            fail.append(f"{rel(path)}: names missing asset {name}")
    return fail


def single_language_skills_map_across() -> list[str]:
    langs = {"typescript", "ts", "javascript", "js", "jsx", "tsx", "python", "py", "go", "golang",
             "rust", "rs", "java", "kotlin", "csharp", "cs", "ruby", "rb", "php", "swift", "cpp", "c"}
    # The structural form CONTRIBUTING prescribes: a heading or a bold lead,
    # not the phrase buried in a sentence.
    marker = re.compile(
        r"^(#{1,6} |[-*] )?\*{0,2}other (languages|runtimes|ecosystems|stacks|frameworks)\*{0,2}",
        re.I | re.M)
    threshold = 3   # one or two worked examples may sit in a single language

    fail = []
    for folder in skill_dirs():
        seen: dict[str, int] = {}
        text = ""
        for path in [folder / "SKILL.md", *sorted((folder / "references").glob("*.md"))]:
            if not path.exists():
                continue
            body = read(path)
            text += body
            for lang in re.findall(r"^```([A-Za-z+#]+)", body, re.M):
                lang = lang.lower()
                if lang in langs:
                    seen[lang] = seen.get(lang, 0) + 1
        total = sum(seen.values())
        if total >= threshold and len(seen) == 1 and not marker.search(text):
            only = next(iter(seen))
            fail.append(
                f"{folder.name}: {total} code examples, all {only}, and no per-language mapping. "
                f"Add an 'Other languages'/'Other runtimes' block per CONTRIBUTING "
                f"(Framework- and stack-agnostic), or drop to fewer than {threshold} examples.")
    return fail


def skill_line_budget() -> list[str]:
    # Progressive disclosure, enforced rather than advised: SKILL.md is the map
    # an agent always loads, and detail belongs in references/.
    budget = 500
    grandfathered = {"awesome-git-history-rebuild"}

    fail, stale = [], []
    for folder in skill_dirs():
        path = folder / "SKILL.md"
        if not path.exists():
            continue
        lines = len(read(path).splitlines())
        if lines > budget and folder.name not in grandfathered:
            fail.append(f"{rel(path)}: {lines} lines (budget {budget}) - "
                        f"move detail into {folder.name}/references/")
        if lines <= budget and folder.name in grandfathered:
            stale.append(f"{folder.name} now fits the budget - drop it from GRANDFATHERED")
    return fail + stale


def eval_sets_are_well_formed() -> list[str]:
    # Eval sets sit where the published convention puts them, in the skill's
    # own evals/ folder. The shape is checkable here; whether a set was ever
    # run against a model is a claim only the run itself can settle.
    fail = []
    names = {folder.name for folder in skill_dirs()}
    for path in sorted(p for p in tracked()
                       if p.startswith("skills/") and "/evals/" in p):
        parts = path.split("/")
        skill, filename = parts[1], parts[-1]
        if len(parts) != 4 or filename not in EVAL_FILES:
            fail.append(f"{path}: an evals folder holds {' and '.join(EVAL_FILES)}, nothing else")
            continue
        try:
            data = json.loads(read(ROOT / path))
        except json.JSONDecodeError as exc:
            fail.append(f"{path}: invalid JSON - {exc}")
            continue

        if filename == "eval_queries.json":
            if not isinstance(data, list) or not data:
                fail.append(f"{path}: expected a non-empty list of queries")
                continue
            seen: set[str] = set()
            for index, case in enumerate(data):
                query = case.get("query") if isinstance(case, dict) else None
                if not isinstance(query, str) or not query.strip():
                    fail.append(f"{path}: case {index} has no query")
                    continue
                if query in seen:
                    fail.append(f"{path}: duplicate query {query[:40]!r}")
                seen.add(query)
                if not isinstance(case.get("should_trigger"), bool):
                    fail.append(f"{path}: case {index} has no should_trigger boolean")
                sibling = case.get("belongs_to")
                if sibling is not None and sibling not in names:
                    fail.append(f"{path}: case {index} sends belongs_to to a missing skill: {sibling}")
                if sibling == skill:
                    fail.append(f"{path}: case {index} hands a negative back to the skill under test")
                split = case.get("split")
                if split not in (None, "train", "validation"):
                    fail.append(f"{path}: case {index} has split {split!r}, expected train or validation")
            verdicts = {case.get("should_trigger") for case in data if isinstance(case, dict)}
            if not {True, False} <= verdicts:
                fail.append(f"{path}: every case points the same way - a set needs both "
                            f"should-trigger and should-not-trigger queries")
            continue

        if data.get("skill_name") != skill:
            fail.append(f"{path}: skill_name is {data.get('skill_name')!r}, expected {skill!r}")
        cases = data.get("evals")
        if not isinstance(cases, list) or not cases:
            fail.append(f"{path}: no eval cases")
            continue
        for index, case in enumerate(cases):
            prompt = case.get("prompt") if isinstance(case, dict) else None
            if not isinstance(prompt, str) or not prompt.strip():
                fail.append(f"{path}: case {index} has no prompt")
                continue
            assertions = case.get("assertions")
            if assertions is not None and (not isinstance(assertions, list) or not assertions):
                fail.append(f"{path}: case {index} has an empty assertions list")
    return fail


def plugin_manifests_agree() -> list[str]:
    # The two plugin manifests are the Claude Code install path. They carry the
    # repo's own name and are easy to leave behind on a rename.
    root = ROOT / ".claude-plugin"
    plugin = json.loads(read(root / "plugin.json"))
    market = json.loads(read(root / "marketplace.json"))

    fail = []
    if plugin.get("name") != "awesome-agent-skills":
        fail.append(f"plugin.json name is {plugin.get('name')!r}")
    entries = [p.get("name") for p in market.get("plugins", [])]
    if entries != [plugin["name"]]:
        fail.append(f"marketplace.json lists {entries}, expected [{plugin['name']!r}]")
    for key in ("description", "version", "license"):
        if not plugin.get(key):
            fail.append(f"plugin.json is missing {key}")
    if not SKILLS.is_dir():
        fail.append("the plugin ships skills/ and it is not there")
    return fail


CHECKS = [
    ("skill frontmatter is valid", frontmatter_is_valid),
    ("every skill is in both catalogs", catalogs_list_every_skill),
    ("code fences are balanced", code_fences_are_balanced),
    ("catalogue links point at real skills", catalogue_links_resolve),
    ("skill cross-references resolve", cross_references_resolve),
    ("no per-skill README", no_per_skill_readme),
    ("skills ship Markdown only", skills_ship_markdown_only),
    ("referenced asset files exist", referenced_assets_exist),
    ("single-language skills carry a per-language mapping", single_language_skills_map_across),
    ("SKILL.md stays inside the line budget", skill_line_budget),
    ("eval sets are well formed", eval_sets_are_well_formed),
    ("plugin manifests parse and agree", plugin_manifests_agree),
]


def main(argv: list[str]) -> int:
    only = argv[1] if len(argv) > 1 else None
    failed = 0
    for name, check in CHECKS:
        if only and only not in name:
            continue
        problems = check()
        if problems:
            failed += 1
            print(f"FAIL  {name}")
            for line in problems:
                print(f"      {line}")
        else:
            print(f"ok    {name}")
    if failed:
        print(f"\n{failed} of {len(CHECKS)} checks failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
