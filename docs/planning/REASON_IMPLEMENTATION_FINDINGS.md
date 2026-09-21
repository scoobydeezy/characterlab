# REASON implementation findings —2026-09-21

REASON-ORDER-001: REASON_PUBLIC_TESTS_REV1.json records8 passes/11 failures. The
first frozen contract/model mistakenly used current source20/freeze24 by analogy
with consequence120/124. ordering-phases/2-candidate instead fixes current10/14;
24 is not a registered phase. Probe settlement was rejected at the attempted
emission, so no REASON comparison was qualified. Training itself ran, and the
eight training rollback checks passed. Source/freeze reached-fault checks correctly
refused to count this earlier failure as reaching their requested boundary.

Preserve REASON_PUBLIC_CONTRACT_REV1.md, model-rev1 images, experiment planREV1 and
test receiptREV1. Correct forward under reason-public/0.2-candidate with source10/
freeze14, model-rev2 and planREV2. No allocation, conceptual ordering or scheduler
change; predecessor contracts govern. Old models are not admitted by the new
factory. No owner ruling is required to repair this implementation/contract error.

Preflight TypeScript also caught use of a map with the positional legacy record
helper and insufficient record narrowing; corrected to the legacy named helper
and explicit history record. A fixture dictionary received an explicit index
signature. These are representation repairs, not changed psychological equations.

REASON-THRESHOLD-002: REV2 tests passed16/19. Separate raw1/2 becomes bounded1/3,
below the fixed37/100 activation threshold: the source stayed semantically separate
but was inactive. The proposed two-active-reason and per-fact witnesses were
therefore underpowered, not evidence that semantic grouping failed. Preserve REV2
model/plan/tests and contract copy. REV3 increases the second matched base source
to2/3 (bounded2/5), keeps all compiler thresholds/laws unchanged, and changes its
matched motive/referent/option/basis/sign interventions consistently. Singleton
positive/negative witnesses use3/4. Aggregate base becomes17/29; pairwise37/61.
This is a corrected fixture, not retrospective qualification of REV2.

REASON-SAVE-003: the same run found the explicit saved-address projection empty.
The live RNG session and trace held the draws and replay reconstructed them, but
the new adapter supplied an empty continuing-input slot instead of the existing
C2/MULTISOURCE committed-address projection. REV3 serializes that ledger too, so
whole-save validation directly rejects its deletion. No RNG algorithm changed.

REASON-TIMING-004: the broader concurrent preservation suite passed66/67; only the
continuing-save corruption test exceeded Vitest's default5000ms. It had passed
in the focused19/19 run. Give this multi-replay test an explicit30000ms limit and
rerun it alone; preserve the original timeout receipt. No production/model/plan
change. The final preservation receipt must cite both runs and must not pretend
all67 passed in one run.
