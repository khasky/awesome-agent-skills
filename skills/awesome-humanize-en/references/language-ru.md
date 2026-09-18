# Russian calibration — the same checks, the Russian shapes

Load this file when the target text is Russian. It changes nothing else about the run: the decision tree, the two-stage protocol, the discourse pass, the artifact regexes, the source checks and the editing-trace tests all apply as written. What does not transfer word for word is the English vocabulary catalog (#10, #15e) and two typography rules, and this file says what each check looks like in Russian.

Evidence boundary, stated first. No measured per-feature comparison of human and machine Russian was read while writing this file. A human-vs-generated Russian corpus exists (RuATD, Dialogue 2022; `sources.md` "Consulted, no rule") and is the corpus to measure against; until someone does, every item below is an editorial heuristic: Russian-language editing practice read against the shape of the English patterns. Treat each as a direction observed by editors, not a calibration constant.

## 1 The two typography flips

| English rule | Russian reality |
|---|---|
| #16 em-dash overuse is a weak tell | Not a tell. The long dash (тире) is mandatory Russian typography: between subject and predicate with omitted copula («Москва — столица»), in dialogue, in ranges. Do not count dashes, do not "fix" them, and never replace a тире with a hyphen: a hyphen where a тире belongs is a typo, not humanization. Output typography for Russian keeps the тире |
| Title Case in headings is an ineffective indicator (`false-positives.md` §7) | Is a tell. Russian capitalizes only the first word of a heading; «Ключевые Особенности Продукта» is a calque of the English convention that a Russian writer does not produce. Count it as #21a, strong |

Quotation marks: Russian print uses «ёлочки» with „лапки" for nested quotes; straight `"` quotes in a formatted document are the plain-text default, not a tell either way. The mixed-within-one-document rule (#18) still applies.

## 2 Vocabulary — the Russian tier list (#10)

The same density gating as `SKILL.md`: tier 1 flags on sight, tier 2 needs two in a paragraph, tier 3 needs high density.

- Tier 1. «важно отметить», «стоит отметить», «в современном мире», «в эпоху цифровых технологий», «давайте разберёмся», «погрузиться в» (as *delve*), «ключевую роль», «неотъемлемой частью», «уникальный» as a stock adjective, «в заключение», «подводя итог», «таким образом» as a paragraph opener that concludes nothing.
- Tier 2. «эффективный», «инновационный», «комплексный», «оптимальный», «динамично развивающийся», «широкий спектр», «на сегодняшний день», «в рамках», «данный» for «этот», «является» where a тире or nothing would do.
- Tier 3. «важный», «значительный», «современный», «качественный», «различный».

Not signals on their own: scientific and official register in a paper or a statute (the same carve-outs as `false-positives.md` §5 and §11), and канцелярит in a document whose genre requires it.

## 3 Syntax shapes (#4, #8, #12, #13, #15a–c)

| English pattern | Russian form | Fix |
|---|---|---|
| #4 present-participle tails ("…, underscoring the importance") | Деепричастные хвосты: «…, подчёркивая важность», «…, демонстрируя приверженность», «…, что отражает» | Delete after the comma, or make it its own sentence with a subject |
| #8 nominalizations and officialese | Отглагольные существительные and nanizing genitives: «осуществление процесса реализации программы повышения», «производить проверку» for «проверять», «в целях» for «чтобы» | Return the verb; cut the chain to one noun |
| #12 negative parallelism | «не только…, но и…», «это не X, а Y», «речь не о X, а о Y», «дело не в том, что…» | Say the one thing meant |
| #13 rule of three | Три однородных члена везде: «быстро, удобно и надёжно» | Two or four; break the rhythm |
| #15a dangling modifiers | Деепричастный оборот without the subject of the main clause: «Используя этот метод, результаты улучшаются» (the Chekhov «подъезжая к станции, у меня слетела шляпа» error) | Rewrite with an explicit subject |
| #15b hedging cascade | «возможно, в некоторых случаях, при определённых условиях, может» in one sentence | One hedge or none |
| #15c transition crutches | «Однако стоит отметить», «Кроме того, важно понимать», «Тем не менее», «Более того» at every turn; «В заключение», «Подводя итоги» at the end | Delete, or replace with a content-bearing transition |
| #11 avoiding "to be" | «является», «представляет собой», «выступает в качестве» for a plain тире or nothing: «Галерея является выставочным пространством» | «Галерея — выставочное пространство» |
| Semantic shift through the English field | A Russian word used in its English cognate's sense: «драматический» for *dramatic* (значительный), «амбициозный» as praise, «комфортный» for any convenience, «экспертиза» for *expertise* (опыт), «фокусироваться на», «делать смысл» | The Russian word with that meaning, or a rewrite |

## 4 Communicative tells (#22–25)

The chat leftovers have Russian forms and are 🔴 as in English: «Конечно!», «Отличный вопрос!», «Надеюсь, это поможет», «Дайте знать, если…», «Как языковая модель», «Вот улучшенная версия». Knowledge-limit disclaimers: «по состоянию на», «на момент моего последнего обновления». Generic positive endings: «будущее выглядит многообещающим», «впереди много интересного», «это только начало».

## 5 What to restore (the shape of `edit-trace.md`)

Under the same guard (only where the same edit removed filler, and the passage did not grow): the тире instead of «является»; particles and colloquial connectives («ну», «вообще», «кстати», «правда», «в общем»); a plain «потому что» and «поэтому» instead of «в связи с тем, что», «вследствие чего»; second person and direct questions where the register permits; short sentences beside long ones. A formal venue keeps its register: a legal notice does not get «кстати».

## 6 Rhythm

The runs check in `SKILL.md` (three or more adjacent sentences of about the same length) applies unchanged and in any unit counted consistently; no Russian length figure is set, because none was measured. Russian sentences run longer than English on average, so never import an English word-count target.

## 7 Not signals in Russian

The тире (§1); ёфикация or its absence (an editorial choice); scientific and official register in its own genre; long sentences in literary prose; Latin-alphabet technical terms inside Russian text (an ordinary feature of Russian technical writing, not "leakage"); Cyrillic and Latin letters mixed inside one *word* remains the A.10 homoglyph marker from `chatbot-artifacts.md`.
