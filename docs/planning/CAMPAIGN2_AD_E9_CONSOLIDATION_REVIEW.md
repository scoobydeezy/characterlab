# Campaign2 AD-E9 magnitude boundary review

Date: 2026-09-09. Status: evidence submitted; AD-E9 OPEN pending review.

## Scope and authority

This packet implements no new semantics. It tests AD-E9 under
`adaptation-input/0.31-candidate`, consuming the accepted domain declarations and
the public factory/trace binding. The frozen vector requires unsigned underflow and
tolerance Scale+1 rejection, exact endpoints with baseline normalization, bounded
load rejection, no invented ceiling for unbounded load/competence/sensitization,
and no clamp or second-leaf patch. Displacement/reference bounds remain AD-E10.

Reference-mechanism dispositions remain SUB-001/002 exact arithmetic, SUB-008
trace/atomicity and SUB-009 controlled comparisons PORT. MEC-003 remains CONTROL +
CONTRACT where a bounded effect actually exists; rejected additive candidates do
not create overflow state or a new bounded-effect mechanism. No reference code is
imported or modified.

## Public model specimens

`src/test/campaign2MagnitudeBoundary.test.ts` isolates one existing rule at a time
with its valid consumer membership and exact ReadDomain closure. Other rules are
removed from the local registry specimen; both required consumer registrations
remain. The rules use the existing character, variable, procedure and load domain.
Each specimen is admitted through prepareCampaign2Model and executed through
createCampaign2Run/settleNextInstant, including the procedural-practice input.

The unbounded-load alternative changes the existing load's Capacity from bounded
Maximum10 to the accepted unbounded tag. It keeps one load domain and is publicly
admitted. It is a separately committed test model using existing vocabulary, not a
change to the frozen production packet or a new profile. Negative-step and isolated
membership alternatives are likewise local committed models.

## Exact executed matrix

| Cases | Input and expected observation |
|---|---|
| Four unsigned underflows | Tolerance, sensitization, bounded load, competence: absent p=0, n=1, Step=-1 gives q=-1; exact ADAPTATION_MAGNITUDE_OUT_OF_RANGE |
| Two bounded maxima | Tolerance Scale10 and load Maximum10: p=9,n=1,Step1 gives exact10; p=10 with same increment gives11 and exact ADAPTATION_MAGNITUDE_OUT_OF_RANGE |
| Four lower endpoints | Each unsigned leaf: p=1,n=1,Step=-1 yields empty canonical state and exactly one Remove across the entire trace |
| Four absent endpoints | Same four leaf forms: absent p=0,n=0,Step=-1 yields empty state and no patch operation |
| Three unbounded positives | Sensitization, unbounded load and competence: p=10^30,n=1,Step1 yields exactly10^30+1 in the sole expected leaf, with exactly one Set across the trace |

These comparisons comprise13 parameterized tests. The large values exceed the
declared Scale10 and ordinary machine-integer precision; bigint exact equality is
asserted without using the production arithmetic function as an oracle. The finite
sample does not purport to exhaust the integer domain.

Every negative checks exact error code plus byte-identical public state, outputs,
trace and unchanged clock. Terminal failure is not mistaken for Active status.
This packet does not claim the full queue/allocator rollback matrix assigned to
AD-E12. Every positive asserts the complete final state; extra-leaf writes cannot
hide in a selected-value assertion. Exact-target/actual-diff rejection of proposed
second-leaf writes additionally consumes the separately accepted AD-E4/E8 evidence
in CAMPAIGN2_AD_E4_E8_CONSOLIDATION_REVIEW.md; that boundary is not redesigned here.

## Current-source substitution assay

`scripts/prove-campaign2-magnitude-boundary.mjs` records
`CAMPAIGN2_MAGNITUDE_BOUNDARY_PROOF.json`:

- Baseline: all13 tests PASS.
- Clamp negative q to zero: DETECTED by unsigned-underflow tests.
- Clamp tolerance/load q to10: DETECTED by bounded-overflow tests.
- Add ceiling10 to otherwise unbounded magnitudes: DETECTED by unbounded tests.

Each substitution uses a unique verified transformation anchor, must fail its named
witness family, and runs with no unhandled errors. Source and test fingerprints are
unchanged across the assay. No mutant is written into source. The upper-clamp mutant
uses the fixture's exact bound; no general clamp implementation is being proposed.
TypeScript checking PASS on this tree. Production code and frozen artifacts are
unchanged for this packet; prior mutation reports are not implicitly refreshed.

## Requested disposition and deferrals

Accept AD-E9 for this finite matrix and its consumption of accepted exact-target
confinement. AD-E9 remains OPEN until review. AD-E3/4/8/13 remain PASS. Whole B,
AD-E7/10/11/12 and whole FCT remain OPEN; no global interpreter-equivalence claim is
made. VAL QUALIFIED, bounded PERSIST-A..H PASS, conditional/deferred PERSIST-I and
PHEN-ADAPT PASS remain unchanged. Campaign2 remains OPEN.

## Accepted disposition received 2026-09-09

AD-E9 PASS in the submitted finite magnitude/domain matrix. This forward receipt
supersedes the pending disposition above. Endpoint, underflow/overflow, zero and
unbounded controls and all three clamp/ceiling substitutions are accepted.
Second-leaf confinement is accepted by complete-state assertions composed with
AD-E4/E8; no duplicate second-leaf mutant is required. This is not universal bigint
verification. AD-E10 reference semantics, AD-E12 full rollback and whole B/FCT remain
OPEN. No production or frozen artifact changes accompany this acceptance.
