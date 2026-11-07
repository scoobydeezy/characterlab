# Two-wrapper validation optimization — PASS (2026-11-07)

The same character settles the fixed 33-instant scenario 11.3% faster in the measured
pair, with identical simulation bytes. No psychology, law, model identity, state
schema, owner or save contract changed. M61 remains FAILED; this is performance
acceptance only, not its missing memory-to-choice effect or corpus coverage.

## Change and proof boundary
Baseline production 13653060; card committed first at f03bf8dc. Exactly two production
files changed: strategy.ts and identityEligibility.ts; one new performance test.
Each wrapper now separates its local/cross-state checks from full validation.
After delegation, the base has already validated the returned base slice, so the
wrapper checks only its merged local slice and cross-state invariants. Direct-owned
patches, explicit validateState and restore retain full validation and ordering.
Identity journal/numeric correspondence remains checked after every delegated patch.

The prerequisite is the actual assembled composition in state.ts, not the generic
Campaign2 state-model type: inheritedState validates every patch result, and all
optional intermediate wrappers preserve that postcondition, including no-ops.
The only callers of these two constructors are in that composition. No cache,
validation registry, framework, extra wrapper or frozen-control edit was introduced.
Contracts remain assembled-character-strategy/0.1-candidate and
assembled-character-identity-eligibility/0.1-candidate.

## Fixed comparison and result
Original M61 positive fixture unchanged: seed 0, three physical tasks,
body 30/rate 10/width 1, actual A14/A28/B30, query 33. No social task or new contrast.
Both runs settled 1..32, saved 32, settled 33, then captured terminal state/output/trace/save.

| Measured stage (seconds) | Baseline | Optimized |
| --- | ---: | ---: |
| Fixture construction | 49.056 | 48.975 |
| Preparation/run creation | 1.577 | 1.581 |
| Settlement 1..32 | 226.130 | 200.482 |
| Settlement 33 | 20.043 | 17.965 |
| Total settlement | 246.173 | 218.447 |

Settlement saving 27.726s / 11.263%, exceeding the predeclared 5% gate.
This is one successful fixed before/after pair on this host; sampling/host variation
limits generalization. It does not measure all models, future workloads or fixture
construction improvements. No repeat was used to search for a faster result.

Every model/run identity byte, checkpoint 32 save byte, and terminal 33
state/output/full-trace/save byte matched directly, not through hashes alone.
Optimized restoration of the baseline save 32 and continuation 33 also matched exactly.
The test does not claim separate state snapshots at every intermediate instant.

## Controls and retained failures
Baseline and candidate have identical outcomes for 22 rejected cases: malformed
inherited/strategy/identity state through delegated patch, explicit validation and
restore; foreign paths/writer/scope and mixed-owner patches. Every rejection leaves
the supplied input state byte-identical. Valid delegated no-op and direct strategy
write also pass. An injected failure after a real instant 1 patch leaves published
state/output/trace/clock unchanged, with failed status and diagnostic preserved.
Existing M12 strategy controls and M30 identity admission/joint-owner controls pass,
including the retained late whole-instant rollback and journal/numeric invariants.

The first type check caught a test expected-value type mismatch. A command-runner
placeholder mistake was rejected by Python before starting a simulation.
The first native attempt reached 33 but then failed constructing a malformed task
record, before the intended rejection assertion; no accepted baseline was saved.
Repair: use a constructible invalid leaf, then run the same control cases in a short
preflight before repeating the unchanged baseline. All failures remain in CHECKS.
No acceptance criterion, input fixture, timing workload or implementation scope changed.

## Preservation, budgets and disposition
Types, retained controls, boundaries and research PASS. Research remains 0 active /
18 conditional /0 unowned; no verdict, qualification or obligation was changed.
SUB-003 ownership/state/trace and MEC-012 identity distinctions remain intact.
The 105 frozen control dependencies and historical source trees are checked by Git
blob identity; no unrelated frozen-control simulation rerun is needed.
Baseline bytes are retained losslessly in ASSEMBLED_VALIDATION_PERFORMANCE_BASELINE.json.gz
(2,894,916 bytes); one result/check log pair, no source copies or evidence chains.
Final integrity, staged-size and cumulative verification figures are recorded below.
M61's 2327.50s ledger stays closed and failed. No MEMORY replay, UI or new behavioral
attempt follows from this pass. Return to its subthreshold memory-to-choice comparison
as a separately bounded integration decision; do not tune it inside performance work.

Final integrity PASS: 105 frozen dependencies; 3 source/test files; 3 evidence files;
document limits and staged Git-size PASS. Verification used approximately 21.9 of
30 minutes, including failed attempts and the control preflight; exact durations
are in CHECKS. No extension was requested or used.
Baseline SHA-256: f533e69b7d632c4a0bb9cd46868eaec85385a8caa3e91a6fb5c6f6d2dba9972e.
