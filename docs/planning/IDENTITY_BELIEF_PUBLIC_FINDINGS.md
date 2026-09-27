# Native represented-belief implementation findings — 2026-09-26

Qualified by VER-C3-IDENTITY-BELIEF-PUBLIC-001; raw development failures remain preserved.
Contract identity-belief-public/0.1-candidate; records1443..1450, namespace1155 reused.

## Preserved development corrections

1. First native test driver passed fixture metadata into the exact public bytes API.
   Admission correctly rejected extra fields. The fixture now passes only the three
   declared original byte arrays; restore passes only original state/input/save.
   No public API widening was made.
2. Proposed receipt131 was not a registered substrate phase. The scheduler rejected
   emission. Receipt now follows qualification by causal emission within phase130;
   owned learning remains140 and appraisal remains next50. No phase registry change.
   Preserve DEVELOPMENT_TESTS_REV1 (13 passed/15 failed) and
   identity-belief-public-development-rev1/PRESERVATION.json, including source/contract.
3. DEVELOPMENT_TESTS_REV2 passed23 and hit five test deadlines (four120s, one5s).
   These were validation timeouts, not semantic assertion mismatches. Repeated deep
   validation of unchanged source history was expensive. The native validator now
   validates the inherited source separately and memoizes one exact canonical-byte
   source value. Changed bytes always validate; all owned belief leaves still validate.
   Explicit long test limits avoid background continuation after premature timeouts.
   The memo changes no state, save, phase, authority, evidence or mathematical rule.
   A targeted invalid-source/foreign-owner test verifies it cannot admit changed data.
   DEVELOPMENT_TESTS_REV3 passes30; TARGETED_TESTS_REV1 passes the two focused checks.
4. Initial sandbox Vite startup could not read the parent directory. Retrying with
   authorized configuration access started tests. Concurrent Vite SSR workers report
   a development WebSocket port warning; their qualification work is independent of
   that unused server. Completion is determined by every raw case/part receipt.

## Source and temporal limits

The native producer projects only an authenticated accepted task qualification's
sign into a controlled identity-established report. This is not natural observer
access to authorship, qualification or private biography. Actual, false, explicit
neutral and absent reports remain separate and may disagree across holders.
The receiving/learning helper receives only own safe evidence and own prior history.
StandingAlias and PrivateOracle declare their forbidden extra accesses as negative
controls. Their presence in the roster does not make those accesses lawful.

Appraisal50 reads the belief retained from prior140. At the A/A/A/B contradiction,
instant4 still appraises prior positive self belief; instant5 sees the +1/2 update.
Component post-update estimates match same-instant native updates. Appraisals require
an explicit temporal shift, not a false claim of same-phase equivalence. No second
identity bonus, biological belief join or sampled downstream social behavior.

## Preservation obligations

MEC004 controlled semantic evidence and MEC015..019/022/EXP011/012 remain inherited
controls. Mean/Latest are candidates; evidence count is not confidence. Distinct
holder histories, own prior judgments, unknown versus known0 and exact whole-view
receiving limits remain. RO009/010/014/019/020 carry broader identity, recognition,
trust/correlation, horizons and integration; RO021 remains mandatory before exit.

Final affected TESTS_REV1 passes64 (30 native plus34 inherited component/source/affect), reference328 and production build pass against the frozen plan. All37 frozen run receipts and four parts pass:222 native prefixes, full component correspondence and causal-phase checks.

## Commit-boundary finding — preserved pre-correction status

QUIESCENCE_PROBE_REV1 sampled300 external calls and saw only rejections. This did
not establish the boundary. QUIESCENCE_PROBE_REV2 scheduled a nonmutating microtask
at the test-only precommit boundary and exposed an accepted save after the scheduler
commit but before the wrapper committed its addressed RNG ledger. That save differs
from the completed native prefix. The initial polling result was insufficient.

Serial all-prefix tests alone do not certify wrapper quiescence. This is a real
public persistence implementation defect, not a new psychological law or an owner
blocker. Preserve the first frozen serial cohort and probe receipts. Block every
external state/trace/view/save read until the whole wrapper transaction completes,
then refreeze/requalify and compare ordinary complete-prefix bytes. Current serial
qualification cannot close the public seam until this correction is verified.

Final disposition: the whole-wrapper guard rejects the exact exposed microtask. Corrected successor37/222 matches every prior ordinary prefix/view/row;69 affected tests and build pass. First serial cohort and both polling/deterministic probes remain. RO-C3-022 is ACTIVE for older wrappers, beginning with the directly exposed prior identity Task profile.
