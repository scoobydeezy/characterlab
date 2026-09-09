# First belief application: measurement prediction

2026-09-09. Agent research proposal under the autonomous-work authorization.
**Not shape accepted, allocated, implemented or qualified.** This is a bounded
target and an inspected candidate, not a claim that Campaign2 is complete.

## Required distinction before representation

Retain an expectation of the **next permitted reading of one declared diagnostic
channel**. A sequence of admitted measurements must change that expectation; a
later authorized cognitive consumer must be able to read it without reading the
observations from omniscient trace or re-querying REG. This is a prediction, not an
assertion of the current reading, the true regulatory reference, or an action's
causal effect. An unobserved target has no prediction, not a prediction of zero.

Freeze the first comparisons before selecting an authoritative update mechanism:

1. Same model, owner, prior, event topology and matched observation/output allocation;
   vary the permitted point measurement. The prediction must differ through that
   operand. Formation of an episode alone is insufficient.
2. Hold admitted measurement bytes fixed and change an inaccessible cause. Prediction
   and its cognitive read operands must remain equal. Producer-component versus
   public-profile scope must be stated when those interventions cannot coexist in
   the same admitted public specimen.
3. Disable prediction application while preserving evidence production, episode
   formation and later cognitive opportunity. The later prediction read must return
   absence; an episode or trace lookup must not rescue it.
4. Keep application enabled and disable the later prediction read. The later consumer
   must not recover the scalar from a cue, observation ID, REG, adaptation state,
   the episode store or trace.
5. Two histories with different observation ordering but the same admitted distinct
   point multiset must produce the same numerical prediction under the proposed
   exact-mean candidate. Evidence identity sets are compared under the declared
   bijection; trace order is not claimed equal.

These establish a thin predictive-belief seam and its causal availability. They do
not qualify efficacy learning, uncertainty calibration, causal attribution, value
learning, reward, or the complete choice-to-outcome path.

## Inspected reusable substrate

| Existing surface | Finding and bounded reuse |
|---|---|
| PresentObservation/203 | Contains the permitted exact point, its existing ObservationId, ObserverId, observed SubjectId, channel and historical time. Generic observation has bounded-effect modes; the qualified diagnostic producer instead publishes a level. These meanings cannot be interchanged. |
| CognitiveMeasurementEvidence/337 | Keeps exact203 and the admitted diagnostic unit. No new scalar/provenance wrapper is needed just to obtain the operand. |
| MeasurementEpisodeLearningEvidence/342 | Accepted M1, produced at130 from live authenticated337; it embeds that source exactly and belongs to route/character-learning. Its name does not itself authorize another consumer. A new registered prediction consumer may explicitly admit this existing producer/schema/version in a successor profile. No new universal CharacterLearningEvidence type is needed. |
| memoryExecution.ts | Actual M1 emits342 and currently generates only the formation child. A second child requires a new committed model/profile and exact output/event closure. Existing models must retain their original child topology. |
| projection-input-field-path/0.1-candidate | Accepted memory M2 reaches ObserverId through342→337→203, then uses PRJ/IDN. Reuse that bounded extraction and qualified subject, not observation.SubjectId as owner. |
| Memory formation/read | Demonstrates exact composite target addressing and sole ownership. It does not grant belief read/write authority or a generic writable registration. The future prediction key and read requirement need their own contract. |
| REG | Authored R0 and retained D remain outside cognitive ReadDomain. The predictor's input is already in observation units; it performs no REG scaling, conversion or re-evaluation. |
| Existing scheduling | M1 at130 can generate a newly registered application at140. The accepted memory/ADAPT dispatcher is closed, so this needs successor composition. There is no need to retime the diagnostic probe,337 or342 into the current lane. |

Sources inspected: `src/campaign2/probeExecution.ts`, `measurementExecution.ts`,
`memoryExecution.ts`, accepted MEASUREMENT_EVIDENCE_CARRIAGE and
MEASUREMENT_EPISODIC_MEMORY, M1/M2/M3/M5 component records, EVENT_ORDERING,
and `src/semanticBinding/phaseOrdering.ts`.

## Timing choice for this target

First application is consequence-only at140. A later cognitive read occurs at a
strictly later DueAt through a separately governed opportunity. No same-instant
current belief read/write is required. ORD-001's immediate phase30 question remains
open and must be resolved before a profile admits that path. Availability at21 is
still not permission.

This corrects the provisional sequencing in the remaining-topology workplan:
resolving every current-lane producer detail is not a prerequisite of this
consequence-only target. It does not close ORD-001 by avoiding its question, and it
does not waive any later full-path profile's actual dependency on that question.

## Candidate to formalize and challenge

Use a point predictor whose hypothesis is exchangeability of the declared
diagnostic readings. After n admitted distinct observations its forecast is their
exact arithmetic mean. Exchangeability is an explicit laboratory candidate, not a
fact supplied by observation or an assertion that the world is stationary.

For an absent prior and point x, create mean x with its singleton evidence basis.
For prior mean m with n distinct supporting Observation references and fresh x:

    m' = (n*m + x)/(n+1)
    basis' = basis union {the existing admitted Observation reference}

The basis uses the accepted CharacterEvidenceRef observation variant. It is a set
of causal supports, not a payload resolver. There is no new observation identity,
source digest, episode identity, precision counter or probability of truth. n is
derived from that set; no redundant stored count is proposed. Distinct readings
receive equal nominal weight. Their distinctness does NOT establish statistical
independence. No uncertainty or confidence number is inferred from n.

All arithmetic is exact rational. Do not round at each update: doing so would
invalidate the frozen permutation comparison. A declared finite evidence-count
limit must fail on overflow rather than clip, drop support, silently forget, or
manufacture an aggregation law. The actual limit and canonical domain constraints
belong to the later complete contract/profile, not an implementation default.

DETERMINISTIC_SUBSTRATE sections3–5 permits explicit rational representation; the
historical rational module's fixed-lattice storage rule is not current authority.
However, numeric/exact-1 is an immutable bounded operator closure, not a universal
license for new learned-state arithmetic. The new prediction profile needs an
explicit numeric-profile binding before implementation; do not expand exact-1 by
editing its accepted text.

Proposed symbolic storage, not allocated schemas:

    MeasurementPredictionKey
        CharacterId
        PredictionDefinitionId (existing governed definition identity family)

    MeasurementPrediction
        ExpectedReading (exact rational)
        EvidenceBasis (nonempty canonical set of observation CharacterEvidenceRef)

    MeasurementPredictionState
        Predictions (map of the exact key to the exact value)

A committed definition must name the exact safe channel, observed subject and unit
whose readings it predicts. The definition identity distinguishes those semantic
targets in StatePath; the owner comes only from PRJ/IDN. Definition lookup is a
construction operation; no runtime arbitrary content lookup is proposed. Key roles,
definition schema, state validation, target projection and admission are still
required closure work. Do not implement these three records from this sketch.

Absence means unlearned/unknown. A present zero mean with nonempty basis is valid
learned content and must remain present. ADAPT's absence-as-baseline convention
does not turn learned zero into absence. The only proposed writer is a new sole
belief-family authority on route/character-learning; memory and all other families
remain byte-identical under its isolated application.

## Historical alternatives and explicit dispositions

MEC-001's generic precision-weighted estimate is a CONTROL/CANDIDATE. Inspecting
`reference/src/model/estimate.ts` shows that zero decay, equal unit observation
weights and no intermediate quantization yield the same mean recursion. The actual
historical implementation DOES quantize; equivalence to its complete implementation
must not be asserted merely from the algebra. Its Need-specific rho formula in
expectation.ts depends on motivation and is not admitted here.

MEC-002's censored-bound controls remain mandatory for a future bounds-admitting
predictor. The first diagnostic profile admits exact points only; rejecting bounds
is a profile exclusion, not a pass of those controls. MEC-006 surprise remains a
separate required control/port when prediction comparison is introduced. Neither
uncertainty nor surprise is a renamed distance field on342.

Compare the mean candidate with last-reading and constant-gain predictors. Those
are controls for history dependence and responsiveness. A discriminating numerical
example does not earn a psychological retention verdict. SUB-007/TRC-004 still owns
cross-source coverage at reasons; storing a support set does not implement it.

## Adversarial self-review, first pass

Accepted in direction by agent self-review: use existing342 rather than minting a
second learning-evidence wrapper; consequence-only first application; unknown
absence; no REG access; prediction distinguished from retained historical fact.

Reject the tempting alternatives:

- Copy precision=1 from203 into belief confidence, or convert sample count into
  certainty. Observation precision does not declare a belief-quality law.
- Treat the diagnostic level as satisfaction, reward, success or an action effect.
  No such proposition is present in the admitted source.
- Read342/337 from trace after an untrusted ID lookup. Only authenticated production
  may generate the new application's input capability.
- Seed a mean of zero to make later arithmetic convenient. This makes ignorance
  act like evidence.
- Keep only a scalar and let later reasons invent its causal basis. Preserve the
  admitted observation references without granting their dereference.
- Claim equivalence to the quantizing historical implementation, or claim calibrated
  uncertainty from the exact-mean recursion.

Whole shape is WITHHELD by agent self-review until consumer registration, exact
definition/key/role closure, prior-read projection, application lifecycle, failures,
output occurrence closure, later read opportunity, trace and restore are specified.
No unresolved item is delegated to runtime implementation.

The next [symbolic closure](CAMPAIGN2_MEASUREMENT_PREDICTION_SYMBOLIC_CLOSURE.md)
now proposes those missing registration, occurrence, failure and private-slot
semantics. Whole review and allocation remain separate gates.

Executed exploration: CAMPAIGN2_MEASUREMENT_PREDICTION_CONTROL_EXPLORATION.json
contains four named cases and1,296 exact finite algebra cases. It records an actual
historical quantization order witness outside the first diagnostic domain and
explicitly does not qualify public runtime behavior. The read-only historical
reference suite passed43 files/328 tests. The npm script was attempted but its
config loader could not read a parent directory; equivalent direct Vitest settings
from vite.reference.config.ts (node environment, reference-only include) passed.

## Deliberately deferred

Current-lane producer/application and ORD-001; recognized-person belief; action
conditioning; causal attribution; belief quality/trust; missingness inference;
censored observations; decay/forgetting; correlated-source discount; motivation,
appraisal and value semantics; an expectancy-discrepancy extension using a frozen
pre-attempt snapshot; full-path dice/identity and RNG persistence. These remain
visible campaign work, not implied passes of this bounded target.
