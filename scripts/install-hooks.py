#!/usr/bin/env python3
"""Installs the pre-commit gate: run `python3 scripts/install-hooks.py` once per clone.

The hook is a shell stub because that is what git executes; every check it runs
lives in scripts/lint.py, which CI runs too.
"""

from __future__ import annotations

import pathlib
import stat
import subprocess
import sys

MARKER = "awesome-agent-skills pre-commit"

# No interpreter means the gate is skipped, not that the commit is refused: a
# contributor without python still gets the same verdict from CI, and a hook
# that blocks every commit on a machine it cannot run on gets uninstalled.
STUB = f"""#!/bin/sh
# {MARKER}: the gates CI enforces, before the commit exists.
# Written by scripts/install-hooks.py - edit that, not this file.
root=$(git rev-parse --show-toplevel) || exit 0
for py in python3 python py; do
	if command -v "$py" >/dev/null 2>&1; then
		exec "$py" "$root/scripts/lint.py"
	fi
done
echo "pre-commit: no python interpreter found, skipping the lint gate - CI still runs it" >&2
exit 0
"""


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=pathlib.Path(__file__).resolve().parent.parent,
                          capture_output=True, text=True).stdout.strip()


def main() -> int:
    root = pathlib.Path(__file__).resolve().parent.parent
    common = pathlib.Path(git("rev-parse", "--git-common-dir"))
    if not common.is_absolute():
        common = root / common

    local_hooks_path = git("config", "--local", "--get", "core.hooksPath")
    directory = pathlib.Path(local_hooks_path) if local_hooks_path else common / "hooks"
    if not directory.is_absolute():
        directory = root / directory
    directory.mkdir(parents=True, exist_ok=True)

    hook = directory / "pre-commit"
    if hook.exists() and MARKER not in hook.read_text(encoding="utf-8", errors="replace"):
        print(f"{hook} already exists and was not written by this script - "
              "merge it by hand or move it aside", file=sys.stderr)
        return 1

    hook.write_text(STUB, encoding="utf-8", newline="\n")
    hook.chmod(hook.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    print(f"installed {hook}")

    # A hooks directory set outside this repository - a wrapper that manages
    # identities, say - replaces the repo's own hooks rather than adding to
    # them. The gate then runs only if that directory's pre-commit chains to
    # this one, so say so instead of reporting a gate that never fires.
    if not local_hooks_path and git("config", "--get", "core.hooksPath"):
        print("note: core.hooksPath is set outside this repository, so git runs that "
              "directory's hooks instead. The hook above runs only if they chain to "
              f"{hook}.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
