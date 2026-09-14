# Current research entry point

**Replaced 2026-09-14** by the external correction pass, at the owner's instruction.

**This file is REPLACED at every checkpoint, never appended to.** It is a state index,
not a narrative. Chronology belongs in [`CAMPAIGN3_LOG.md`](CAMPAIGN3_LOG.md); verdicts
belong in [`VERDICT_LEDGER.md`](VERDICT_LEDGER.md). If this file exceeds roughly one
screen, or contains more than one block claiming to be "current", it has failed.

**Governing next increment:** [`CAMPAIGN3_WORK_ORDER_2026_09_14.md`](CAMPAIGN3_WORK_ORDER_2026_09_14.md) — **items 1–5 complete**; item 6 (resume GA) is **HANDED OFF and PAUSED**.
**GA entry point:** [`GENERAL_ATTENTION_RESUME_BRIEF.md`](GENERAL_ATTENTION_RESUME_BRIEF.md) — read it before the pause checkpoint. Registration/compiler steps 2–3 are owned end-to-end by the primary implementation agent, resuming on or after **2026-09-19**. Do not split that pass.
**Checkpoint format:** [`CHECKPOINT_TEMPLATE.md`](CHECKPOINT_TEMPLATE.md).
**Owner decisions awaiting a ruling:** [`CAMPAIGN3_PENDING_OWNER_DECISIONS.md`](CAMPAIGN3_PENDING_OWNER_DECISIONS.md) — **0 open.** `OD-C3-001` ratified with scope amendment 2026-09-14; obligations discharged. `OD-C3-002` design ruling 2026-09-14 discharged by `VER-C3-CONCERN-002`.

This index routes to authorities. It does not override the North Star, Architecture
Map, Research Brief, accepted contracts, or any frozen bytes.

---

## Program counters

Update these at every checkpoint. They are the early-warning instrument for
specification outrunning research.

| Counter | Value | Note |
|---|---|---|
| Highest permanently allocated record type | **706** | 452 at Campaign 2 completion (2026-09-09); unchanged since |
| Record types allocated since last verdict or corpus member | **0** | reset by `VER-C3-SALIENCE-001`, 2026-09-14 |
| Corpus members (`corpus/0.28.0`) | **21** | promoted 2026-09-14; 10 preserved, 11 added BLOCKED/PARTIAL |
| Verdict-ledger entries | **12** | 6 substrate, 6 psychological |
| Active tests (last full run) | ~1,679 | last full active regression |

**Threshold rule:** when "record types allocated since last verdict or corpus member"
exceeds 50, the next work item must be an experiment or a corpus promotion, not
another allocation. This is a stop condition, not a suggestion.

---

## Seam state

| Seam | Version | Status | Next gate | Owner decision pending |
|---|---|---|---|---|
| Deterministic substrate | `substrate/0.2-candidate` et al. | **ACCEPTED** | — | no |
| Truth → observation → evidence | `observation/0.1-candidate` | **ACCEPTED** | — | no |
| Event semantic binding / recognition | `semantic-binding/0.1-candidate` | **ACCEPTED** (`SEM-001` closed) | — | no |
| Regulatory reference | `regulatory-reference/0.5-candidate` | IMPLEMENTED, bounded | general kinetics contract | no |
| Adaptation input | `adaptation-input/0.31-candidate` | **QUALIFIED**, bounded | broader profile contracts | no |
| Task cognitive path | `task-cognitive-path/0.1-candidate` | **QUALIFIED**, bounded | — | no |
| Measurement memory / prediction | `measurement-episodic-memory/0.1`, `measurement-prediction/0.2` | **QUALIFIED**, bounded | general retrieval/decay/top-K | no |
| Embodied reserve (EMB-001) | `embodied-reserve/0.1-candidate` | **QUALIFIED**, bounded | `VER-C3-EMB-001` recorded; ownership comparison UNRESOLVED | no |
| Attention selection (ATTN-001) | `attention-public-integration/0.1-candidate` | **QUALIFIED**, bounded public | `VER-C3-ATTN-001` recorded; `PHEN-ATTN-001` NOT passed | no |
| General Attention (GA) | — | **OPEN — PAUSED, HANDED OFF** | registration/compiler steps 2–3, primary agent, from 2026-09-19; see resume brief | no |
| Belief / ORD-001 | none | BLOCKED | first thin belief contract | no |
| Affect (factorized) | none | BLOCKED | `AFFECT` intake fixture | no |
| Workspace / control | none | BLOCKED | `WORKSPACE` intake fixture | no |
| Skill / competence | none | BLOCKED | `SKILL` intake fixture | no |
| Social / person models | none | BLOCKED (`ORD-002`) | `SOCIAL` intake fixture | no |
| Habit / relationships / longitudinal | none | BLOCKED | respective intake fixtures | no |
| Researcher UI (`TRC-003`, `SUB-013`) | none | OPEN debt | privacy-safe projection contract | no |

---

## Reading order for a fresh agent

1. `AGENTS.md` — authority hierarchy and active direction
2. **This file** — state
3. [`CAMPAIGN3_WORK_ORDER_2026_09_14.md`](CAMPAIGN3_WORK_ORDER_2026_09_14.md) — what to do next, in order
4. [`CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md`](CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md) — when to escalate
5. [`CAMPAIGN3_ENTRY_READINESS.md`](CAMPAIGN3_ENTRY_READINESS.md) — phenomenon readiness and the fifteen-family denominator
6. [`CHECKPOINT_TEMPLATE.md`](CHECKPOINT_TEMPLATE.md) — how to report
7. `SEAM_LEDGER.md` front table — formal seam status
8. [`CAMPAIGN3_LOG.md`](CAMPAIGN3_LOG.md) — history, only when you need it

## Standing questions → authority

| Question | Where |
|---|---|
| What is proven, and on what corpus? | `VERDICT_LEDGER.md` |
| What phenomena are we accountable to? | `PHENOMENON_CORPUS.md`, `CAMPAIGN3_ENTRY_READINESS.md` |
| Which phenomena are missing? | [`CORPUS_0_28_0_SUCCESSOR_MANIFEST.md`](CORPUS_0_28_0_SUCCESSOR_MANIFEST.md) |
| What historical mechanism owes a decision? | `REFERENCE_MECHANISM_LEDGER.md` |
| What does record N mean? | `CURRENT_RECORD_GLOSSARY.md` |
| External review findings | `CAMPAIGN3_PRE_ENTRY_GAP_REVIEW.md`, `CAMPAIGN3_MIDPOINT_STEERING_REVIEW.md` |

---

Corpus is `corpus/0.28.0` at digest
`1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
`corpus/0.27.0` remains a distinct historical commitment and every verdict resting on it
keeps that version. No accepted contract, allocation, model byte, or historical receipt
was modified by the 2026-09-14 correction pass.
