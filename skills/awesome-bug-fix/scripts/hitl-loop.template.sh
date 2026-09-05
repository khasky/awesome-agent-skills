#!/usr/bin/env bash
#
# Human-in-the-loop reproduction loop — the last rung of the feedback-loop
# ladder in SKILL.md, for a bug whose trigger only a person can perform
# (a click in a real browser session, a hardware action, a third-party UI).
#
# The agent runs this script; the human follows the prompts in their own
# terminal. Captured answers are printed as KEY=VALUE at the end, which is
# what the agent reads back. It keeps an unautomatable repro structured and
# repeatable instead of a paragraph of instructions retyped every attempt.
#
# Copy it, edit the block between the markers, then:
#   bash hitl-loop.template.sh
# On Windows run it under Git Bash or WSL.
#
# Two helpers:
#   step "<instruction>"       show an instruction, wait for Enter
#   capture VAR "<question>"   ask a question, read the answer into VAR
#
# Never capture a secret with this script: what `capture` reads is echoed to
# the terminal and returned to the agent. Ask the human to *use* the
# credential, and capture only the observation it produced.

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- edit below: one step or capture per action, in order ----------------

step "Open the app at http://localhost:3000 and sign in."

capture ERRORED "Click 'Export'. Did it fail? (y/n)"

capture SYMPTOM "Paste the exact error text, or 'none':"

# --- edit above ---------------------------------------------------------

printf '\n--- Captured ---\n'
printf 'ERRORED=%s\n' "$ERRORED"
printf 'SYMPTOM=%s\n' "$SYMPTOM"
