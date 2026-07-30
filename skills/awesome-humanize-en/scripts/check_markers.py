#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Run the regular expressions from references/chatbot-artifacts.md
against the test samples from references/test-fixtures.md.

Each regex passes three levels:
  1. Positive sample  — the regex must fire.
  2. Negative sample  — similar but non-machine text; must not fire.
  3. Boundary sample  — empty string and multiple matches; no crashes.

Standard library only. Run:  python3 scripts/check_markers.py
Exit code 0 — all checks pass, 1 — there are failures.

When a new regex is added to chatbot-artifacts.md, a block with samples is
added here, and the paired samples go into references/test-fixtures.md.
No working rule is ever removed (see the principle in test-fixtures.md).
"""

import re
import sys

# name: (regex, positive samples, negative samples, [multi-match sample, expected count])
CASES = {
    # --- A.1. OpenAI internal citation tags ---
    "contentReference": (
        r":contentReference\[oaicite:\d+\]\{index=\d+\}",
        ["According to the report :contentReference[oaicite:0]{index=0}, the market grew 12%.",
         ":contentReference[oaicite:42]{index=42}"],
        ["This is just a mention of oaicite (the term named in an article about AI).",
         "Docs: contains [oaicite:N] as a format example."],
        (":contentReference[oaicite:0]{index=0} and :contentReference[oaicite:1]{index=1} and :contentReference[oaicite:2]{index=2}", 3),
    ),
    "oai_citation": (
        r"oai_citation:\d+‡",
        ["Source oai_citation:5‡Wikipedia says that…", "oai_citation:0‡"],
        ["oai_citation with no number after the colon"],
        None,
    ),
    "oaicite_short": (
        r"oaicite:\d+",
        ["truncated reference oaicite:7"],
        ["oaicite with no colon or number"],
        None,
    ),
    # --- A.2. OpenAI web-search tags ---
    "turn_search": (
        r"turn\d+search\d+",
        ["According to turn0search0, the topic is current.", "turn3search12 mid-sentence"],
        ["turn left and search again", "turnaround search"],
        ("turn0search0 turn1search1 turn2search2", 3),
    ),
    "turn_fetch": (
        r"turn\d+fetch\d+",
        ["[turn0fetch0] in brackets"],
        ["turn fetch the file"],
        None,
    ),
    "turn_file": (
        r"turn\d+file\d+",
        ["The output trails off with fileciteturn0file2turn0file6 at the end.",
         "a single marker turn0file11 after the quote"],
        ["turn the file over", "return file 5 to the archive"],
        ("fileciteturn0file2turn0file6", 2),
    ),
    # --- A.3. Chatbot UTM tags ---
    "utm_chatgpt": (
        r"[?&]utm_source=chatgpt\.com",
        ["https://example.com/article?utm_source=chatgpt.com",
         "https://example.com/?id=5&utm_source=chatgpt.com",
         "?utm_source=chatgpt.com&other=1"],
        ["utm_source=chatgpt.com mentioned in an article about tracking",
         "https://example.com/?utm_source=other.com"],
        None,
    ),
    "utm_openai": (
        r"[?&]utm_source=openai",
        ["https://docs.example.com/?utm_source=openai"],
        ["OpenAI utm_source with no ? or & sign"],
        None,
    ),
    # --- A.4. Attachment and card tags ---
    "attached_file": (
        r"attached_file:\/\/",
        ["See attached_file:///tmp/upload.pdf"],
        ["File attached, see attached file (plain English)"],
        None,
    ),
    "grok_card": (
        r"grok_card:\/\/",
        ["grok_card://1234567890"],
        ["a Grok card with no special markup"],
        None,
    ),
    "vertexaisearch": (
        r"vertexaisearch\.cloud\.google\.com/grounding-api-redirect",
        ["https://vertexaisearch.cloud.google.com/grounding-api-redirect/AbCdEf"],
        ["vertexaisearch.cloud.google.com with no path",
         "https://cloud.google.com/vertex-ai-search"],
        None,
    ),
    # --- A.5. Other markup markers ---
    "attributableIndex": (
        r"\battributableIndex\b",
        ['{"attributableIndex": 0}'],
        ["the word attributable in ordinary text about law and attribution",
         "attributableIndexes (with a suffix)"],
        None,
    ),
    "citation_n": (
        r"\[citation:\d+\]",
        ["According to the study [citation:3], the results are mixed."],
        ["[citation needed] (Wikipedia template)"],
        None,
    ),
    # --- A.6. New-platform markers (v2.5) ---
    "copilot_caret": (
        r"\[\^\d+\^\]",
        ["The market grew 12%[^1^] per the report.", "[^10^]"],
        ["A normal Markdown footnote[^1] defined below."],
        ("[^1^][^2^][^10^]", 3),
    ),
    "assistants_source": (
        r"【\d+(?::\d+)?†source】",
        ["Per the policy【1†source】, access is allowed.", "【4:2†source】"],
        ["Decorative corners 【note】 with no dagger."],
        None,
    ),
    "cite_turn": (
        r"citeturn\d+[a-z]+\d+",
        ["Text citeturn0file0 with a link.", "citeturn2search5 mid-string"],
        ["Please cite, then turn to page 5."],
        ("citeturn0file0 citeturn2search5", 2),
    ),
    "sandbox_link": (
        r"\]\(sandbox:/mnt/data/",
        ["[Download the report](sandbox:/mnt/data/report.xlsx)"],
        ["We spun up a sandbox on the server's /mnt/data."],
        ("[A](sandbox:/mnt/data/a.csv) [B](sandbox:/mnt/data/b.csv)", 2),
    ),
    # --- A.7. Invisible and control characters (v2.6) ---
    "openai_pua": (
        "[\ue200-\ue204]",
        ["Amazon Nova offers several capabilities \ue200cite\ue202turn0search3\ue201.",
         "hidden block \ue203control note\ue204 in the text"],
        ["Ordinary text with no control characters.",
         "Icon char \ue000 from a font set (a different part of the PUA)"],
        ("\ue200cite\ue202turn0search3\ue201", 3),
    ),
    "think_tag": (
        r"</?think>",
        ["<think>First I'll parse the conditions…</think> Answer: 42.",
         "tail of reasoning…</think> The final answer is below."],
        ["I think (think) this is fine.",
         "A <thinking> tag of another format is not counted here."],
        ("<think>a</think>", 2),
    ),
    # --- A.8. "Source+digit" run-ons (v2.7) ---
    "source_plus_chain": (
        r"[A-Za-z)]\+\d+[A-Z]",
        ["The standard was created by ISO. IT Governance+3ISO+3ISO+3. It belongs to a family…",
         "adapted to cloud environments. Microsoft Learn+3Google Cloud+3."],
        ["C++11 and C++14 are supported",
         "the x+1 formula on each line",
         "a 5+ score on the quiz",
         "Wikipedia+1."],
        ("Wikipedia+1Registry+2Archive+3", 2),
    ),
    # --- A.9. Gemini citation tags (v2.9) ---
    "gemini_cite_start": (
        r"\[cite_start\]",
        ["[cite_start]The company was founded in 1994 and since then…",
         "The output contains [cite_start] mid-line."],
        ["a cite_start() function in code with no brackets around it",
         "[cite start] with a space instead of an underscore"],
        ("[cite_start]First. [cite_start]Second.", 2),
    ),
    "gemini_cite_n": (
        r"\[[Cc]ite:\s?\d+\]",
        ["Revenue grew 12% [cite: 8] for the year.",
         "According to the report [Cite: 12], the plan was met."],
        ["[citation needed] (Wikipedia template)",
         "[citation:3] — the DeepSeek marker, it has its own regex",
         "the \\cite{smith2024} command in LaTeX"],
        ("[cite: 1][cite: 2][Cite: 3]", 3),
    ),
    # --- A.10. Zero-width characters (v2.9) ---
    "zero_width": (
        "[\u200b-\u200d\u2060\ufeff]",
        ["Word\u200bsplit by a zero-width space.",
         "An invisible joiner\u2060inside the text.",
         "A mark\ufeffmid-string."],
        ["Ordinary text with ordinary spaces.",
         "A narrow no-break space\u202f is not in the regex (manual review)."],
        ("a\u200bb\u200cc\u200dd", 3),
    ),
}


def _inside_backticks(line: str, start: int, end: int) -> bool:
    """A match inside `backticks` is documentation, not an artifact."""
    return line[:start].count("`") % 2 == 1 and line[end:].count("`") >= 1


def scan(paths: list) -> int:
    """Run every regex over arbitrary files.

    Run:  python3 scripts/check_markers.py --scan file1 [file2 …]
    Prints each match as "file:line [name] fragment".
    Matches inside backticks (regex documentation) are skipped.
    Exit code 0 — clean, 1 — markers found.
    """
    compiled = {name: re.compile(pattern) for name, (pattern, *_) in CASES.items()}
    found = 0
    for path in paths:
        try:
            with open(path, encoding="utf-8") as fh:
                lines = fh.read().splitlines()
        except OSError as exc:
            print(f"Could not read {path}: {exc}", file=sys.stderr)
            return 2
        for lineno, line in enumerate(lines, 1):
            for name, rx in compiled.items():
                for m in rx.finditer(line):
                    if _inside_backticks(line, m.start(), m.end()):
                        continue
                    found += 1
                    fragment = line.strip()[:90]
                    print(f"{path}:{lineno} [{name}] {fragment}")
    if found:
        print(f"\nMarkers found: {found}.")
        return 1
    print("No markers found.")
    return 0


def main() -> int:
    fails = 0
    for name, (pattern, positives, negatives, multi) in CASES.items():
        rx = re.compile(pattern)
        for s in positives:
            if not rx.search(s):
                print(f"FAIL {name}: positive sample not caught: {s!r}")
                fails += 1
        for s in negatives:
            if rx.search(s):
                print(f"FAIL {name}: false positive on: {s!r}")
                fails += 1
        if rx.search(""):
            print(f"FAIL {name}: fired on an empty string")
            fails += 1
        if multi is not None:
            text, expected = multi
            got = len(rx.findall(text))
            if got != expected:
                print(f"FAIL {name}: multi sample — expected {expected}, found {got}")
                fails += 1

    total = len(CASES)
    if fails:
        print(f"\nResult: {total} regexes, failures: {fails}.")
        return 1
    print(f"Result: {total} of {total} regexes pass all checks.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--scan":
        sys.exit(scan(sys.argv[2:]))
    sys.exit(main())
