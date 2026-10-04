# ORD-001: current versus consequence belief timing

Version: **belief-boundary-ordering/0.1-draft**. Status: inspected proposal, not yet
shape accepted or implemented. No numeric allocation, belief schema or mutation
authority member is introduced here. The existing ADAPT/EVID/REG profiles remain
unchanged and qualified in their recorded scopes.

## Problem and substrate findings

ordering-phases/2-candidate already locates current evidence/recognition before30,
workspace40, appraisal50, arbitration90, frozen intent/snapshot100, consequence
perception120..127, evaluation/evidence130 and later consolidation140. Ordering's
rule9 explicitly says temporal availability does not grant a ReadDomain or resolve
ORD-001. CHARACTER_ARCHITECTURE distinguishes evidence production from the authority
that applies it to learned state; it permits eligible phase30 updates subject to
this decision.

The current runtime has no belief/person-model implementation. Its phase140 adapter
is deliberately closed around ADAPT and separately accepted memory execution. It
cannot be repurposed as a generic belief/consolidation scheduler by adding a handler.
PRJ, IDN, WRT, canonical state, transaction rollback and governed declaration intake
are available substrate. A new belief contract still must supply exact records,
admitted producers, key grammar, projections, numerical interpretation and authority.

Historical inspection: reference/src/model/expectation.ts is now a Need-specific
wrapper around estimate.ts. Its motivational observation-precision formula depends
on importance/urgency; that dependency is not available merely from a measurement.
estimate.ts implements precision-weighted point/bound updates and exact informative
bound gating, then quantizes. It is a CONTROL/CANDIDATE under MEC-001/002, not an
accepted replacement for a new belief contract. Its update and ordering choices
cannot be copied implicitly. No historical module will be imported into src.

## Alternatives and proposed choice

1. **Live evidence-triggered updates everywhere.** Each arrival changes beliefs used
   by the next event, including later arrivals at the same boundary. Rejected as the
   initial ordering policy: without a declared batch interpretation, construction
   order and intermediate updates can change reasoning or evidence interpretation.
2. **Freeze all beliefs for the entire instant.** Stage every update until140; current
   reasoning reads only pre-instant belief. Retain as a comparison control. This is
   coherent, but it would make phase30 evidence application unavailable to the active
   cycle and requires an explicit alternative to the architecture's current boundary.
3. **Separate current and consequence application boundaries.** Proposed reference:
   admitted current evidence may be applied at30, and its completed results are
   available to explicitly authorized later cognitive reads. Consequence evidence
   may be applied at140 and cannot re-enter that instant's earlier cognitive cycle.

Choice3 is proposed for the thin scaffold. It chooses timing, not a belief update
formula, evidence quality, salience law, truth criterion or learning rate.

## Proposed temporal contract

Let B0 be the retained belief state at entry to a declared application boundary.
Every admitted evaluation at that boundary sees the same B0 through its own exact
read capability. Completed authorized patches form the boundary result B1. Other
seams observe B1 only after the boundary completes and only if their own contract
permits that read. B1 remains transaction-local until whole-instant commit: later
failure rolls back the phase30 application along with all other work.

Current application belongs at30. Consequence application belongs at140. No loop
back to30/40/50/90/100 is permitted in the same instant. A future revisit is a later
DueAt under the accepted scheduler. Phase150 stays nonschedulable.

The initial thin application profile should reject multiple evaluations targeting
one exact belief key within one application boundary before belief reads or new
evaluation allocations. This is a proposed bounded collision policy, not a universal
ban on combining evidence. A later aggregate-evidence contract may admit a complete
batch with an explicit combination rule. Sorting opaque occurrence IDs and applying
an order-sensitive estimate repeatedly is not a substitute for that rule. Different
boundaries at30 and140 are not the same collision domain.

Recognition at21/127 establishes availability only. Its records are usable only if
the belief contract admits the exact schema/version, observer-safe references and
registered projection. Recognition claims remain fallible claims; they do not grant
target truth identity or another character's state. Character subject qualification
uses accepted PRJ/IDN, never an inferred observer-name/CharacterId equivalence.

EVID0.5 still has zero state reads and writes. Any future discrepancy/surprise or
expectation comparison needs its own named seam. The phase100 pre-attempt snapshot
must freeze whatever prior expectation that future comparison is authorized to use;
it must not reread a subsequently changed belief to reinterpret the past.

## Open expressibility work before shape acceptance

- Define a concrete first belief target and its evidence semantics. An observed
  scalar is not automatically reward, satisfaction, efficacy, a value judgement or
  authored R0. A measurement predictor must remain distinct from REG's reference.
- Name the current-lane evidence producer and the character-learning evidence
  carrier. Current measurement carriage is consequence-scoped; it cannot simply be
  relabelled phase30. The new profile must consume accepted observation semantics.
- Specify the phase30 batch admission/lifecycle and its interaction with the future
  phase140 consolidation extension. The scheduler's current ADAPT-only branch is
  not that implementation. Keep ADAPT's exact frozen baseline and ownership intact.
- Name the exact state grammar, absence meaning, bounds/quantization, source quality,
  duplicate evidence policy and failure carriers in the first belief seam. No
  zero-precision/zero-mean default or confidence interpretation is selected here.

These are real missing contracts, not a reason to reopen qualified EVID/ADAPT.
ORD-001 remains OPEN until its complete boundary contract and required acceptance
evidence exist. No dependent belief implementation may start from this proposal.

## Frozen review questions and proposed proof vectors

Labels below are planning labels, not allocated runtime identities.

| Vector | Required distinction |
|---|---|
| ORD-B1 | Authorized later current cognition sees completed phase30 belief; full-instant-frozen control differs under a genuine admitted evidence intervention. |
| ORD-B2 | Same safe evidence and prior belief, altered hidden truth: same belief result and reads. |
| ORD-B3 | No admitted evidence means no application/output; silence is not negative evidence. |
| ORD-B4 | Same-boundary independent targets see one common prior; evaluation permutation preserves settled values. |
| ORD-B5 | Same-boundary duplicate exact target rejects before reads/evaluation allocation, even if one candidate would be inert. |
| ORD-B6 | Consequence application cannot alter already frozen appraisal, decision or pre-attempt expectation; no same-instant cognitive re-entry. |
| ORD-B7 | Available but unadmitted recognition/state/source rejects before use; observer-safe identity/role rules still apply. |
| ORD-B8 | A later failure rolls back earlier phase30 belief plus all allocator/queue/output/trace changes. |
| ORD-B9 | Current and consequence applications to one key are separately admitted ordered boundaries; no implicit second application of archived evidence. |
| ORD-B10 | Quiescent save/restore preserves resulting state and continuation without reconstructing belief from trace or current truth. |

## Preservation and deliberate exclusions

SUB-001/002 numerical semantics remain prerequisites of any chosen update law;
SUB-007 aggregate correlation remains a separate port with TRC-004; SUB-008/009/011
provide causal trace, paired comparison and correct-forward discipline. MEC-001/002
remain controls/candidates; MEC-006 surprise and P3-011 timing/partition cases remain
required when their consumers are introduced. RET-003/004/005 remain rejected.

No covariance/Kalman, decay law, Need urgency, person-model update, appraisal,
reward, value learning, source-trust inference, causal attribution or new persistent
family is adopted. MATH-004, ORD-005 and DEC-001 retain their own scopes. The broader
topology plan continues independently; this proposal is not a campaign verdict.

## Subsequent substrate finding

Accepted memory M1 already produces MeasurementEpisodeLearningEvidence/342 at130
from authenticated337. A future separately registered prediction consumer can use
that source for consequence application at140 and later-cycle reads. See
CAMPAIGN2_MEASUREMENT_PREDICTION_RESEARCH_TARGET.md. This does not retime M1 or close
ORD-001; it removes an unnecessary dependency on a new current-lane producer from
the first consequence-only belief experiment. The open work above remains required
for this proposed immediate-current boundary contract itself.
