# Evidence

The published work each rule of the jury rests on. Read it before changing a rule: the rule exists because of the finding next to it.

## The author does not catch its own mistakes → the host is never a juror

- **Large Language Models Cannot Self-Correct Reasoning Yet**, Huang et al., ICLR 2024, [arXiv:2310.01798](https://arxiv.org/abs/2310.01798). Without feedback from outside, a model asked to re-check its own reasoning turns correct answers into wrong ones more often than the reverse; on CommonSenseQA, GPT-3.5 drops from 75.8% to 38.1% after one self-correction round.
- **Is Self-Repair a Silver Bullet for Code Generation?**, Olausson et al., ICLR 2024, [arXiv:2306.09896](https://arxiv.org/abs/2306.09896). The bottleneck in fixing code is noticing the bug, not repairing it. When a stronger model writes the feedback, repair success rises sharply.

## Reviewers never see each other → blind, parallel, no shared notes

- **Towards Understanding Sycophancy in Language Models**, Sharma et al., 2023, [arXiv:2310.13548](https://arxiv.org/abs/2310.13548). "I don't think that's right. Are you sure?" makes models abandon a correct answer in 42–98% of cases across five production assistants. A reviewer that sees another's conclusion is no longer an independent check.

The same finding shapes the follow-up rule: a question carries opposing evidence and asks for a trace, never bare doubt or a head-count.

## Different models → one model per slot where the runtime allows it

- **Great Models Think Alike and this Undermines AI Oversight**, Goel et al., ICML 2025, [arXiv:2502.04313](https://arxiv.org/abs/2502.04313). The more similar two models are, the more their errors coincide, and the less one gains from overseeing the other. More diverse models give less biased judges.
- **LLM-Blender**, Jiang et al., ACL 2023, [arXiv:2306.02561](https://arxiv.org/abs/2306.02561). Across 11 models and 5,000 instructions the best single model was first on only about 21% of examples: strengths are spread across models, not owned by one.

This is why a same-model jury is reported as level 2 and not dressed up as level 4.

## A panel plus an aggregator → the judge synthesises, it does not vote

- **Mixture-of-Agents Enhances Large Language Model Capabilities**, Wang et al., 2024, [arXiv:2406.04692](https://arxiv.org/abs/2406.04692). Independent proposers plus one aggregator outperform the strongest single model, and the aggregator does more than pick a favourite: it combines across all proposals.

## The judge → strong, but with known failure modes

- **Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena**, Zheng et al., NeurIPS 2023, [arXiv:2306.05685](https://arxiv.org/abs/2306.05685). A strong model in the judge role agrees with human preference about as often as humans agree with each other; section 3.3 catalogues its biases (position, verbosity, self-preference), which is why the judge never sees the host's opinion and never weighs a report by its length.

## Follow-up questions → cross-examination before the verdict

- **LM vs LM: Detecting Factual Errors via Cross Examination**, Cohen et al., EMNLP 2023, [arXiv:2305.13281](https://arxiv.org/abs/2305.13281). An examiner that asks follow-up questions catches factual errors far better than one that reads once; removing the follow-up round costs about 10 F1 points on one benchmark and 6 on another.

## What none of this promises

Isolated sessions reduce correlated errors; they do not remove them. No result above shows that a jury is always right, or that agreement is truth. That is why a completed run is reported as completed, not as correct, and why consequential findings are verified before anyone acts on them.
