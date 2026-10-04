# Values component — 2026-10-04

LOCAL DISPOSITION: `values-component/0.1-candidate`. Bounded component only,
not native admission. Implements the existing Consolidation -> Values edge.
Counters1508/0; no allocation. Historical CTL007 remains a candidate.

One category `Care`, one admitted outcome channel, outcome -1/0/+1, targets A/B.
Inputs carry integer instant1..64, unique receipt ID1..128, perceived category
Care/null and outcome/null. Null outcome means unavailable, not known neutral.
Target identity does not change category membership. No physical truth field is
accepted by the learner. Ordered receipt IDs identify observations, not magnitude.
Each instant has at most one receipt. Exact duplicate content is a no-op; conflicting
reuse is rejected, including unavailable and missing-category receipts.

The sole component owner journals admitted originals and updates at conceptual140;
read-only projections at instant t see only receipts with instant<t. Instants strictly
increase. There is no current-Need, goal or identity input to consolidation.
Missing category or missing outcome produces no qualifying observation. All originals
remain immutable. Horizon64 and128 receipt IDs are fixture limits, not resource laws.

Accumulated and Refold use n admitted linked observations, sum s, mean s/n and
diagnostic evidence weight n/(n+1). The durable preference is s/(n+1): unit importance,
confidence-times-mean with identity projection g in this bounded range. Unknown has
mean null, weight0, preference0; observed neutral has mean0 and positive weight.
Latest uses just the most recent linked observation: mean=x, weight1/2, preference=x/2.
NoConsolidation preserves admitted history and expectation diagnostics but preference0.
Stored Accumulated caches the exact projection; Refold derives it from history with
no stored projection leaf. This is not calibrated correctness, moral evaluation or a
general derivation of Values. Current Need-only receiving remains a later comparator.

Controlled receiving uses existing compileReasonNuclei/arbitrationOutput and its
addressed random session. Two inherited Task option identities are carrier fixtures;
their authored strengths and identity modifiers are discarded. Option A's Base is
Value preference (ValuesOnly), currentNeed*mean*weight (NeedOnly), or the greater
absolute contribution (Joint, Value wins ties). currentNeed is0/1. These candidates
share exactly the same history, with aligned signs; Joint is a bounded complete-overlap
rule, not general provenance discounting. NoConsolidation still supplies learned
expectation to NeedOnly. Unlinked category makes both contributions0. Option B has
independent controlled goal Base0 or1/4. Goal is an admitted active-goal operand, not
autonomous adoption/lifecycle. Probe seeds0..255; probe instant1..65 reads prior state.
Inherited dice cutoffs1/10,1/5,3/5,4/5,9/10; threshold0; modifiers unused; arbitration
thresholds1/2. Raw bases may be negative and preserve the inherited direction law.
The receiver logs Value view, effective contribution, full reasons/resolution and
addresses. Empty basis maps are controlled source carriers; no general evidence-atom
or native source-authentication qualification. Standing is absent/fixed zero.
This is actual arbitration, not attempted physical execution or outcome feedback.
VALUES_READINESS.md remains the full component work order and matrix gate.

Canonical component saves bind version, law, originals, cursor and cached projection.
Restore constructs a fresh owner, replays originals and requires exact byte equality;
changed law, forged cache, invalid input and noncanonical bytes reject. Caller-owned
inputs and returned history are copied. Failed commits publish neither cursor, journal
nor cache. Replay proves internal consistency with the saved originals, not their authenticity
against an externally committed RunIdentity. That commitment remains a matrix gate.
No public Save132, runtime registry, new ModelIdentity or qualification.

Required owner tests: exact acquisition/revision, neutral/unknown, missing admission,
category transfer scope, duplicates, time ordering/prospective visibility, stored/refold
equivalence, restore every prefix, tampering, failure rollback and input isolation.
RO010/019/020/021 preserve inference limits, missing receiving/native gates and provenance.
