# Current work — bounded validation performance package (2026-11-07)

Owner approved the two-wrapper optimization recommended at13653060.
This is a separate performance-only package; M61 remains FAILED, its2327.50s ledger closed.
No new behavioral attempt, law, calibration, contrast, seed or corpus closure.
| Research obligations | **0 active / 18 conditional / 0 unowned** |

## Capability and exact boundary
Reduce duplicate validation after a delegated patch in identityEligibility.ts and
strategy.ts only. Contracts remain assembled-character-identity-eligibility/0.1-candidate
and assembled-character-strategy/0.1-candidate; no model/state/save/schema change.
Split local/cross-state checks from full validation. A successfully delegated base
patch already validates its entire returned base slice; validate only the restored
local slice and cross-state invariants after merging. Direct owner writes, full
validateState and restore still perform complete validation in their original order.
Immediate bases: recognitionState and skill both validate every applyPatch result;
older admitted compositions likewise use validated assembled wrappers/inheritedState.
No cache, registry/framework, frozen-control edit, relaxed boundary or owner change.

## Files and evidence
Two production files above; one new test src/test/assembledValidationPerformance.test.ts.
Original M61 fixture/tests remain unchanged; import its fixture but select only new tests.
One result/check log and one compressed exact baseline byte bundle;<=20 files/5MiB.
No source copies; baseline implementation is Git13653060 (plan/test commits add no production).

## Predeclared comparison
One unchanged M61 positive fixture, seed0; three physical tasks, body30/rate10/width1,
actual A14/A28/B30, query33, same laws and inputs. No claim to repair its null result.
Baseline and optimized runs each settle1..32, save32, settle33, snapshot/save33.
Compare model/run identity and every state/output/trace/save byte, not hashes alone.
Optimized restore of baseline save32 must continue to exact baseline terminal33 bytes.
Time fixture/preparation separately; compare identical32+1 settlement workload.
Require at least5% lower settlement wall time in this single paired measurement;
report sampling/host-variation limits, not a general performance guarantee.

## Risk controls and stop rules
Capture baseline/candidate behavior for valid delegated no-op and malformed inherited,
strategy and identity state; foreign owner/scope and mixed-owner patches; input state
must remain unchanged on every rejection. Existing identity/strategy direct-owner
controls remain mandatory where not covered by these cases.
Reach an actual patch then inject a failure in instant1; assert complete published
state/output/trace/clock rollback, preserving the explicit failed status/diagnostic.
No full frozen Campaign2 suite: production paths are outside its105 dependency closure;
verify that closure and unchanged historical sources rather than rerun unrelated controls.
Types, boundaries, research, evidence/document limits and staged Git-size checks required.

## Budget and done
At most3 production/test files,30min cumulative verification,600s per command.
One long check at a time; baseline/candidate/restore each capped580s. No automatic extension.
Commit this card before code; record failures, repair ordinary bugs within fixed scope.
Done only with exact parity, required rejection/rollback/continuation controls and>=5%
measured settlement reduction. If guarantees or speed fail, stop; do not broaden wrappers.
M61 remains failed and no MEMORY replay or UI work follows from performance acceptance.
