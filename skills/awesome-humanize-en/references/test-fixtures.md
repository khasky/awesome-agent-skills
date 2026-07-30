# Test fixtures for the regular expressions

This file collects the reference "sample / expectation" pairs for every regex in `chatbot-artifacts.md`. These samples are used to verify the regexes before publishing changes to the skill.

Each regex passes three checks:

- **Positive sample** — the regex must fire.
- **Negative sample** — similar text unrelated to AI. The regex must not fire.
- **Boundary sample** — empty string, multiple matches, Unicode. The regex must not break.

The automated run is `python3 scripts/check_markers.py` (also in CI). A manual PowerShell variant is given at the end of the file.

---

## Samples for the regular expressions

### 1. OpenAI internal citation tags

#### Regex: `:contentReference\[oaicite:\d+\]\{index=\d+\}`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `According to the report :contentReference[oaicite:0]{index=0}, the market grew 12%.` | fires |
| Positive | `:contentReference[oaicite:42]{index=42}` at the start of a line | fires |
| Negative | `This is just a mention of oaicite (the term named in an article about AI).` | does not fire |
| Negative | `Docs: contains [oaicite:N] as a format example.` | does not fire (no exact structure) |
| Boundary | empty string | does not fire |
| Boundary | three markers in one line | fires three times |

#### Regex: `oai_citation:\d+‡`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Source oai_citation:5‡Wikipedia says that…` | fires |
| Negative | `oai_citation with no number after the colon` | does not fire |
| Boundary | `oai_citation:0‡` (zero index) | fires |

#### Regex: `oaicite:\d+`

| Type | Sample | Expectation |
|---|---|---|
| Positive | truncated reference `oaicite:7` | fires |
| Negative | `oaicite` with no colon or number | does not fire |

---

### 2. OpenAI web-search tags

#### Regex: `turn\d+search\d+`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `According to turn0search0, the topic is current.` | fires |
| Positive | `turn3search12` mid-sentence | fires |
| Negative | `turn left and search again` (an ordinary English phrase) | does not fire (needs numbers) |
| Negative | `turnaround search` | does not fire |
| Boundary | `turn0search0 turn1search1 turn2search2` (triple match) | fires three times |

#### Regex: `turn\d+fetch\d+`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `[turn0fetch0]` in brackets | fires |
| Negative | `turn fetch the file` | does not fire |

---

### 3. Chatbot UTM tags

#### Regex: `[?&]utm_source=chatgpt\.com`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `https://example.com/article?utm_source=chatgpt.com` | fires |
| Positive | `https://example.com/?id=5&utm_source=chatgpt.com` | fires |
| Negative | text "utm_source=chatgpt.com mentioned in an article about tracking" (a plain string with no `?` or `&` before it) | does not fire |
| Negative | `https://example.com/?utm_source=other.com` | does not fire |
| Boundary | `?utm_source=chatgpt.com&other=1` (UTM mid query string) | fires |

#### Regex: `[?&]utm_source=openai`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `https://docs.example.com/?utm_source=openai` | fires |
| Negative | `OpenAI utm_source` with no `?` or `&` | does not fire |

---

### 4. Attachment and card tags

#### Regex: `attached_file:\/\/`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `See attached_file:///tmp/upload.pdf` | fires |
| Negative | `File attached, see attached file (plain English)` | does not fire |

#### Regex: `grok_card:\/\/`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `grok_card://1234567890` | fires |
| Negative | `a Grok card with no special markup` | does not fire |

#### Regex: `vertexaisearch\.cloud\.google\.com/grounding-api-redirect`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `https://vertexaisearch.cloud.google.com/grounding-api-redirect/AbCdEf` | fires |
| Negative | `vertexaisearch.cloud.google.com` with no `/grounding-api-redirect` path | does not fire |
| Negative | `https://cloud.google.com/vertex-ai-search` (an ordinary Google product page) | does not fire |

---

### 5. Other markup markers

#### Regex: `\battributableIndex\b`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `{"attributableIndex": 0}` | fires |
| Negative | the word "attributable" in ordinary text about law and attribution | does not fire |
| Boundary | `attributableIndexes` (with a suffix) | does not fire (word boundary) |

#### Regex: `\[citation:\d+\]`

| Type | Sample | Expectation |
|---|---|---|
| Positive | `According to the study [citation:3], the results are mixed.` | fires |
| Negative | `[citation needed]` (Wikipedia template) | does not fire |

---

### 6. New-platform markers

#### Regex: `\[\^\d+\^\]` — Microsoft Copilot footnote

| Type | Sample | Expectation |
|---|---|---|
| Positive | `The market grew 12%[^1^] per the report.` | fires |
| Positive | `[^10^]` (two-digit number) | fires |
| Negative | `A normal Markdown footnote[^1] defined below.` (single `^`) | does not fire |
| Boundary | `[^1^][^2^][^10^]` (triple match) | fires three times |
| Boundary | empty string | does not fire |

#### Regex: `【\d+(?::\d+)?†source】` — OpenAI Assistants marker

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Per the policy【1†source】, access is allowed.` | fires |
| Positive | `【4:2†source】` (sub-index format) | fires |
| Negative | `Decorative corners 【note】 with no dagger.` | does not fire |
| Boundary | empty string | does not fire |

#### Regex: `citeturn\d+[a-z]+\d+` — ChatGPT streaming marker

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Text citeturn0file0 with a link.` | fires |
| Positive | `citeturn2search5` mid-string | fires |
| Negative | `Please cite, then turn to page 5.` (with spaces) | does not fire |
| Boundary | `citeturn0file0 citeturn2search5` (double match) | fires twice |

#### Regex: `\]\(sandbox:/mnt/data/` — broken ChatGPT link

| Type | Sample | Expectation |
|---|---|---|
| Positive | `[Download the report](sandbox:/mnt/data/report.xlsx)` | fires |
| Negative | `We spun up a sandbox on the server's /mnt/data.` | does not fire |
| Boundary | `[A](sandbox:/mnt/data/a.csv) [B](sandbox:/mnt/data/b.csv)` | fires twice |

---

### 7. Invisible and control characters

#### Regex: `[\ue200-\ue204]` — ChatGPT citation control chars

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Amazon Nova offers several capabilities \ue200cite\ue202turn0search3\ue201.` (chars invisible when read) | fires |
| Positive | `hidden block \ue203control note\ue204 in the text` | fires |
| Negative | ordinary text with no control characters | does not fire |
| Negative | icon char `\ue000` from a font set (a different part of the private-use area) | does not fire |
| Boundary | `\ue200cite\ue202turn0search3\ue201` | fires three times (by number of chars) |
| Boundary | empty string | does not fire |

#### Regex: `</?think>` — leftover reasoning tag

| Type | Sample | Expectation |
|---|---|---|
| Positive | `<think>First I'll parse the conditions…</think> Answer: 42.` | fires |
| Positive | `tail of reasoning…</think> The final answer is below.` (a stray closing half) | fires |
| Negative | `I think (think) this is fine.` | does not fire |
| Negative | a `<thinking>` tag of another format | does not fire |
| Boundary | `<think>a</think>` | fires twice |

---

### 8. "Source+digit" run-ons

#### Regex: `[A-Za-z)]\+\d+[A-Z]` — ChatGPT footnote render error

| Type | Sample | Expectation |
|---|---|---|
| Positive | `The standard was created by ISO. IT Governance+3ISO+3ISO+3.` | fires |
| Positive | `adapted to cloud environments. Microsoft Learn+3Google Cloud+3.` | fires |
| Negative | `C++11 and C++14 are supported` | does not fire |
| Negative | `the x+1 formula on each line` | does not fire |
| Negative | `a 5+ score on the quiz` | does not fire |
| Negative | `Wikipedia+1.` (single form — manual review only) | does not fire |
| Boundary | `Wikipedia+1Registry+2Archive+3` | fires twice (run-ons between neighbors) |

---

### 9. file_search markers

#### Regex: `turn\d+file\d+` — OpenAI file_search chunk identifiers

| Type | Sample | Expectation |
|---|---|---|
| Positive | `The output trails off with fileciteturn0file2turn0file6 at the end.` | fires |
| Positive | `a single marker turn0file11 after the quote` | fires |
| Negative | `turn the file over` | does not fire |
| Negative | `return file 5 to the archive` | does not fire |
| Boundary | `fileciteturn0file2turn0file6` (doubled marker) | fires twice |

---

### 10. Gemini citation tags

#### Regex: `\[cite_start\]` — Gemini cited-fragment start marker

| Type | Sample | Expectation |
|---|---|---|
| Positive | `[cite_start]The company was founded in 1994 and since then…` | fires |
| Positive | `The output contains [cite_start] mid-line.` | fires |
| Negative | `a cite_start() function in code with no brackets around it` | does not fire |
| Negative | `[cite start] with a space instead of an underscore` | does not fire |
| Boundary | `[cite_start]First. [cite_start]Second.` | fires twice |

#### Regex: `\[[Cc]ite:\s?\d+\]` — Gemini reference to a source fragment

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Revenue grew 12% [cite: 8] for the year.` | fires |
| Positive | `According to the report [Cite: 12], the plan was met.` | fires |
| Negative | `[citation needed] (Wikipedia template)` | does not fire |
| Negative | `[citation:3] — the DeepSeek marker, which has its own regex` | does not fire |
| Negative | `the \cite{smith2024} command in LaTeX` | does not fire |
| Boundary | `[cite: 1][cite: 2][Cite: 3]` | fires three times |

---

### 11. Zero-width characters

#### Regex: `[\u200b-\u200d\u2060\ufeff]` — zero-width chars in connected text

The samples contain invisible characters; in the table they are shown as `{ZWSP}`/`{WJ}`/`{BOM}`; the canonical strings with real characters are in `scripts/check_markers.py`.

| Type | Sample | Expectation |
|---|---|---|
| Positive | `Word{ZWSP}split by a zero-width space.` | fires |
| Positive | `An invisible joiner{WJ}inside the text.` | fires |
| Positive | `A mark{BOM}mid-string.` | fires |
| Negative | `Ordinary text with ordinary spaces.` | does not fire |
| Negative | a narrow no-break space `U+202F` (homoglyph — manual review only, see A.10) | does not fire |
| Boundary | four words separated by three different zero-width chars | fires three times |

---

## Full before/after pairs for content editing

### Example 1: Marketing text with AI tells

**Before:**

> 🚀 **Innovation:** This software is undoubtedly a testament to our commitment to quality. Moreover, **it represents the perfect place for synergy**, delivering a seamless, intuitive, and powerful user experience — ensuring efficiency from novices to professionals. Industry experts believe this project lays the foundation for future wins. I hope this text is helpful for your presentation! :contentReference[oaicite:0]{index=0}

**After:**

> We added batch processing, keyboard shortcuts, and offline mode. Testers say the interface is simpler and tasks finish faster.

**What was fixed:**

- Removed the marker `:contentReference[oaicite:0]{index=0}` (`chatbot-artifacts.md`, section A.1).
- Removed the emoji and excess bold (patterns #16, #17).
- Removed the leftover chat turn "I hope this…" (pattern #22).
- Cut the inflated significance and averaging (patterns #1, #2).
- Removed the rule of three "seamless, intuitive, and powerful" (pattern #13).
- Removed the vague attribution "Industry experts believe" (pattern #6).
- Removed the false range "from novices to professionals" (pattern #15).

---

### Example 2: A biography with a fabricated source

**Before:**

> Ivan Petrov is an eminent physicist whose contribution to quantum mechanics forever changed the field. He published his major works in the Journal of Applied Physics (DOI:10.5555/vol.2020.42), where he revealed revolutionary principles of entanglement. His research was widely covered in leading scientific outlets, underscoring the significance of his legacy for future generations of scientists.

**What is wrong (unedited, for verification):**

- The DOI is fabricated (the prefix 10.5555 is reserved for tests and is not issued to real journals).
- "Revolutionary principles of entanglement" — inflated significance.
- "Widely covered" — a vague attribution.
- "An eminent physicist" — averaging.
- "Underscoring the significance of his legacy" — inflated significance.

**After verification:** If the author cannot provide real links and confirm the facts, the article cannot be published. The text is rewritten to the minimally verifiable claim:

> Information about Ivan Petrov's work needs verification. The list of publications is not confirmed in public databases.

---

### Example 3: Text with em-dashes in literary prose

**Before:**

> The morning was like that — crisp, clear, thin. The town still slept — only the odd footstep echoed back. She walked slowly — because there was nowhere to hurry.

**Analysis:**

- An em-dash in every sentence — a tell?
- No markers from `chatbot-artifacts.md`.
- No AI vocabulary (pattern #10).
- No inflated significance.
- Just em-dashes in a literary description.

**Conclusion:** This is a **false positive**. The em-dash is a normal authorial device in literary prose. See `false-positives.md`, item 1. Do not edit the text.

---

### Example 4: A legal document with officialese

**Before:**

> Pursuant to this Agreement and in accordance with applicable law, for the purpose of ensuring the performance of obligations, the Parties shall undertake to carry out activities directed at achieving the objectives set forth in Appendix 1.

**Analysis:**

- Officialese is present (pattern #8).
- Little concrete content.

**Conclusion:** This is a legal document. Officialese is a mandatory genre norm. See `false-positives.md`, item 5. Do not edit for "humanity" — it would lose legal force.

---

## Empirical verification of the regular expressions

**The primary method is the automated run.** Every regex from `chatbot-artifacts.md` is checked by a standard-library Python script — three levels per regex (positive, negative, boundary sample plus multiple matches):

```bash
python3 scripts/check_markers.py
```

The script runs in CI (`.github/workflows/regex-check.yml`) on every PR that touches `scripts/` or files with markers. A local run before release is mandatory. When a new regex is added, its samples go into the script and into the "Samples for the regular expressions" section above.

**The alternative method is PowerShell.** A manual check for a Windows environment with no Python:

```powershell
$test = @{
  oaicite_full = @{
    pattern = ':contentReference\[oaicite:\d+\]\{index=\d+\}'
    positive = 'According to :contentReference[oaicite:0]{index=0}, the figures check out.'
    negative = 'The word oaicite is mentioned in an article about AI.'
  }
  oai_citation = @{
    pattern = 'oai_citation:\d+‡'
    positive = 'oai_citation:5‡Wiki source'
    negative = 'oai_citation with no colon'
  }
  turn_search = @{
    pattern = 'turn\d+search\d+'
    positive = 'turn0search0'
    negative = 'turn around and search'
  }
  utm_chatgpt = @{
    pattern = '[?&]utm_source=chatgpt\.com'
    positive = 'https://example.com/?utm_source=chatgpt.com'
    negative = 'utm_source=chatgpt.com mentioned in the text'
  }
  utm_openai = @{
    pattern = '[?&]utm_source=openai'
    positive = 'https://docs.example.com/?utm_source=openai'
    negative = 'OpenAI utm_source with no query sign'
  }
  attached_file = @{
    pattern = 'attached_file:\/\/'
    positive = 'attached_file:///tmp/file.pdf'
    negative = 'See the attached file (plain English)'
  }
  grok_card = @{
    pattern = 'grok_card:\/\/'
    positive = 'grok_card://1234567890'
    negative = 'a Grok card with no special markup'
  }
  vertexai = @{
    pattern = 'vertexaisearch\.cloud\.google\.com/grounding-api-redirect'
    positive = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc'
    negative = 'cloud.google.com/vertex-ai-search'
  }
  copilot_caret = @{
    pattern = '\[\^\d+\^\]'
    positive = 'The market grew 12%[^1^] per the report'
    negative = 'A normal Markdown footnote[^1] below'
  }
  assistants_source = @{
    pattern = '【\d+(?::\d+)?†source】'
    positive = 'the policy【1†source】allows it'
    negative = 'decorative corners 【note】'
  }
  cite_turn = @{
    pattern = 'citeturn\d+[a-z]+\d+'
    positive = 'text citeturn0file0 link'
    negative = 'cite, then turn to page 5'
  }
  sandbox_link = @{
    pattern = '\]\(sandbox:/mnt/data/'
    positive = '[Download](sandbox:/mnt/data/r.xlsx)'
    negative = 'a sandbox on the server /mnt/data'
  }
}

foreach ($name in $test.Keys) {
  $t = $test[$name]
  $pos = $t.positive -match $t.pattern
  $neg = $t.negative -match $t.pattern
  $ok = $pos -and (-not $neg)
  $status = if ($ok) { 'OK' } else { 'FAIL' }
  Write-Host ('{0,-18} {1}  pos={2}  neg={3}' -f $name, $status, $pos, $neg)
}
```

The PowerShell variant shows 12 regexes as a sample of manual checking. The full run of all 23 (including truncated forms, the invisible characters from A.7 and A.10, the file_search markers, and the Gemini markers) is performed by `scripts/check_markers.py` — that is the canonical one. The same script can scan arbitrary text: `python3 scripts/check_markers.py --scan file.md`.

---

## Principle of use

If a new regex or a new tell is added to the skill — it must get three test samples in this file before publication. This file serves as an automated test set for regression protection.

When the flagship model changes (see `llm-fingerprints.md`), you must:

1. Check whether the tool-output format has changed.
2. If so — add new regexes with samples.
3. Keep the old regexes for text of the earlier era.

The "no regressions" principle: no working rule is ever removed.
