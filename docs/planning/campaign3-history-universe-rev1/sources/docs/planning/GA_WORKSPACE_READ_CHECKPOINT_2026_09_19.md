# General Attention workspace read checkpoint — 2026-09-19

**Disposition:** LOCAL DISPOSITION; task/prediction read adapter implemented. Whole compiler/public GA OPEN.
**Stage (Brief §9):** B — bounded internal workspace path; public source admission remains OPEN.

## Counters

| Counter | Value |
|---|---|
| Highest allocated record type | 706 |
| Allocated since last verdict/corpus member | 0 |

## What changed

The concrete declaration compiler now binds `generalWorkspace.ts` to the accepted
`task-cognitive-path/0.1-candidate` transformation. It resolves the authoritative
subject roster, reads the exact committed task/prediction keys through inherited
accessor identities, validates present leaves, and returns detached canonical
workspace bytes and actual-read records. The existing transformation controls which
reads occur; the adapter supplies no caller-selected task, prediction or calculation.

The input observer/agenda and supplied occurrence grammar are checked before state
access. Runtime source authentication, occurrence freshness/reservation, invocation
admission and rollback remain separate obligations; this internal method is not a
public execution capability.

## Local disposition

Preserve MEC-020's active-only task lifecycle and MEC-007's separately traceable
relevance path. Disabled task access reads only the roster. Capacity1 and disabled
prediction access retain the selected task without reading prediction. Missing or
inactive tasks prevent prediction access; the active window is [2,21). An absent
prediction remains unavailable, while a present zero forecast remains known zero.
No mechanism is retired, no new schema is allocated, and no owner ruling is needed.

## Evidence

`src/test/generalWorkspace.test.ts` adds 13 tests covering exact inherited members,
read order, excluded-read poison controls, lifecycle boundaries, absence versus zero,
foreign subjects/agendas, invalid slot namespace/time, invalid state leaves and
detached results. One initial test used an incomplete PerceivedSatisfied union; it
was corrected to the valid DeadlineMissed variant before the passing run.

Affected run: **120 tests / 7 files PASS** (`generalWorkspace`,
`generalDeclarationProfile`, `generalAccessors`, `generalSourceDeclarations`,
`campaign2CognitiveTransforms`, `priorConcernFeedback`, `generalRegistration`),
with two workers. Typecheck, production build and reference-boundary check PASS.
The prior full-suite result of 1,918/252 predates the source/protocol increment and
was not rerun here. Frozen contracts, model bytes, corpus and historical receipts
remain unchanged. This checkpoint is the evidence record; no manifest revision is
needed for a change confined to an internal adapter.

## Stage C competitor

The committed `source-capacity1`, `source-no-task-access` and
`source-no-prediction-access` recipes remain executable comparators to baseline.
Concern A/B/C and the encoding-law competitors remain retained. Read exclusion
tests establish implementation sensitivity, not psychological necessity or a verdict.

## North Star transfer

Supports the §30 angry-person retrieval archetype by preserving the distinction
between an accessible task, an available prediction and the downstream concern
response. Capacity/access controls cannot silently acquire excluded prediction
evidence. This does not establish general Affect or public retrieval coverage.

## Next gate

Complete inherited SEM tracking/physical sampling read integration and transactional
output-slot admission, then source/subject/owner authentication and whole-model
ownership. The 80/58 ceiling remains GA-local; whole-model identities and budgets
remain OPEN. The same primary owner retains steps 2–3.

## Owner decision pending

No. Corpus/0.28.0 has 21 members; the verdict ledger has 12 entries.
