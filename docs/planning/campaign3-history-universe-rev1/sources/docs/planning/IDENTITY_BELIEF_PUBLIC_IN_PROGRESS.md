# Native identity belief implementation checkpoint — 2026-09-26

IN PROGRESS, not qualified. Contract identity-belief-public/0.1-candidate and
records1443..1450 accepted; counters1450/8. Existing component/native identity intact.
New model/codecs/runtime/factory and native tests implemented. Three separately owned
belief leaves; receive130 follows qualification130, learning140, next appraisal50.
Initial proposal131 rejected by substrate and preserved in development-rev1.
Fixture metadata rejected by exact public API, fixed fixture rather than widening API.
Development testREV1:13 passed/15 failed. REV2 runs pre-memo implementation with
120s limits; final model removes duplicate whole-source decode and memoizes only
exact unchanged source bytes. TARGETED_TESTS_REV1 passes read domains and memo rejection.
Full REV3 tests pending. Reference receipt exists; inspect exact counts before closure.

Native diagnostic source A/A/A/B yields self+1/2, opposite observer-1/2; next50
adverse1/4 and3/4. Initial50 remains unknown; fourth50 still uses prior+1/-1.
No model/roster freeze yet at this checkpoint. Qualification harness prepared for
5 models/37 inherited cases/222 complete native prefixes. Do not relabel pending
checks as complete or overwrite raw receipts. Native runtime source laws unchanged.

Update: REV2 completed23 passes/5 timeouts, no assertion mismatch. REV3 passes all30 native tests after exact-byte source validation memo and explicit long test limits.328 reference tests pass. Five models/37 runs/222 prefixes frozen in IDENTITY_BELIEF_PUBLIC_PLAN_REV1.json; four qualification workers active. Build pending.

Commit-boundary probeREV2 found a torn accepted save between scheduler commit and wrapper RNG commit. Current serial cohort must be preserved, not promoted as public closure. After its workers finish, guard runtime snapshots/save until wrapper transaction completes; add deterministic microtask regression, refreeze and rerun. Polling probeREV1 missed the window. No owner escalation; no allocation change.

RO-C3-022 is ACTIVE (2 active/19 conditional/1 closed/0 unowned). Prior identity Task probe also exposes the gap; PUBLIC_WRAPPER_QUIESCENCE_READINESS.md now precedes identity-recovery work. New standalone guard helper and three targeted regressions pass, but it is not yet integrated into the frozen runtime. Keep current workers/source unchanged until first cohort is fully preserved.

Successor update: first37/222 serial cohort/result is fully preserved; guard integrated, probeREV3 rejects exact window with final save unchanged. Structural Save132 parsing is bounded and installs no state; complete replay equality remains required.69 final affected tests and BUILD_REV2 pass;328 reference tests retained unchanged. PLAN_REV2 frozen, four workers running all37/222 and comparing every prefix/view/row to REV1. Run result checker --write only after all four REV2 parts complete. Then revise closure checker/docs for69 tests,2 active/19 conditional and RO22 audit before identity recovery. Temporary finalizer exists at %TEMP%/characterlab_identity_belief_finalize.py, gated on passing RESULT_REV2; review generated documentation before final receipt.
