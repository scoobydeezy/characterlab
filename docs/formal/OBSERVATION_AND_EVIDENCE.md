# Truth → Observation → Permitted Evidence

**Status:** accepted bounded-measurement seam with restricted semantic-token control, version `observation/0.1-candidate` (accepted 2026-09-01; immutable candidate-era identifier retained)

**SeamId:** `seam/truth-to-permitted-evidence`

**Architecture edges:** world outcome/body state → perception/interoception → permitted evidence → evidence classification → thin `SemanticExperience`

**Owner:** Campaign 1 / `MATH-006`

**Depends on:** accepted `substrate/0.2-candidate`, `ordering/0.2-candidate`, `state/0.2-candidate`, `trace/0.2-candidate`, and `content/0.2-candidate`

**Supersedes:** no accepted contract. It corrects the historical pattern that copied full `EffectProvenance` and authoritative `Applied` into character-accessible `SemanticExperience`.

## Acceptance scope

Acceptance closes `MATH-006` for exact bounded scalar measurement, missingness, interval classification, and the proven hidden-Overflow boundary. `PerceivedConceptToken = (ConceptId, CausalRoleId, VisibleProvenanceSlotId)` is accepted only as a restricted control where the registered observation channel itself establishes semantic identity and one winning causal role is sufficient.

This version does **not** prove a general world-event semantic-binding or recognition representation. It does not establish that seeing a truth-side referent reveals its identity, support one referent in several event roles, provide binding-specific visibility within a provenance slot, or define perceptual-referent lifetime. Those questions are blocked by `SEM-001` and owned by [Event Semantic Binding and Recognition Boundary](EVENT_SEMANTIC_BINDING.md).

## Semantic purpose

Convert omniscient outcome/body truth into exactly the measurement interval, reliability, and perceptual tokens a named observer may use. The compiler is deterministic and registered by `ObservationChannelId`; it is the only component allowed to redact truth into character evidence. Downstream character processes receive the output record, never the truth input.

This contract treats observation as information, not as a convenient copy of simulator state. A missing observation is distinct from an observed zero. A bounded measurement is an interval, not an exact point disguised by clipping.

## Required phenomena

- `PHEN-EPI-001` observational equivalence under hidden Overflow;
- the observation/classification portion of `PHEN-LEARN-001`;
- replay and forbidden-read portions of `PHEN-DET-001`.

## Domain and codomain

The initial exact domain is one signed bounded scalar effect observed through a registered state-change channel:

```text
BoundedEffectTruth = {
  Before,
  PotentialEffect,
  Applied,
  Overflow,
  After,
  Minimum,
  Maximum,
  EffectProvenance,
  TruthRecordId
}

ObservationChannel = {
  ObservationChannelId,
  ObserverId,
  SubjectId,
  Modality,
  Polarity: Increase | Decrease | Signed,
  MeasurementMode: BoundedStateChange | ExactEffectControl,
  Precision,
  VisibleProvenanceSlots,
  MissingnessRuleId
}

PermittedEvidence = MissingObservation | PresentObservation

PresentObservation = {
  ObservationId,
  ObserverId,
  SubjectId,
  ObservationChannelId,
  OccurredAt,
  MeasurementInterval,
  EvidenceKind,
  Precision,
  PerceivedConceptTokens,
  SafeSourceReferences
}
```

`MeasurementInterval` is one of exact `[x,x]`, lower-bounded `[x,+∞)`, or upper-bounded `(-∞,x]`. `EvidenceKind` is a redundant typed classification derived from the interval and mechanically checked: `Point`, `LowerBound`, or `UpperBound`.

The initial thin `SemanticExperience` is a character-relative envelope over one or more `PresentObservation` records plus restricted perceived concept tokens. It contains no `PotentialEffect`, `Capacity`, `Overflow`, full `EffectProvenance`, or unprojected truth path. It is not the accepted general pre-recognition event representation.

## Units, ranges, and applicability

All scalar values are exact canonical rationals with one registered unit. `Minimum < Maximum`; `Before` and `After` lie in the closed domain. `Precision` is a positive exact rational declared by the channel definition, not improvised per event. This version excludes noisy continuous sensors, ambiguous interval unions, false-positive observations, and probabilistic missingness.

## Registered ReadDomain and capability-limited projection

The producing compiler may read the concrete truth record, the registered observation-channel definition, observer identity, event time, and any sensor/body path explicitly named by that channel. It may not read beliefs, expectations, memory, identity, goals, later outcomes, or unrelated world state.

Consumers receive a distinct projection containing only `PermittedEvidence`. They cannot name or forge truth paths. Actual producer reads and exact output values are recorded by the accepted Campaign 0 instrumentation.

## Actual-read recording and derived-input provenance

Every output names:

- actual truth paths read by the compiler;
- `ObservationChannelId` and version;
- the transformation ID for measurement compilation;
- safe source record references;
- each perceived token's visible source slot.

Safe references identify records; they do not embed their hidden fields. Derived `EvidenceKind` names `MeasurementInterval` as its source, never `Overflow` or a truth-side saturation flag.

## Authoritative StatePatch writes and sole MutationAuthorityId

This seam writes no persistent character state. It emits an immutable permitted-evidence record/event. Later encoding, memory, belief, and salience seams own their own patches. Caches or indexes are non-authoritative unless a later contract declares them explicitly.

## Epistemic permissions and forbidden knowledge

Allowed output information:

- the measurement interval permitted by the registered channel;
- the channel's declared precision and modality;
- concepts and causal-role tokens projected from visible provenance slots;
- observer-safe evidence references within the declared fixture domain.

Version 0.1's `SafeSourceReferences` field has not proven cross-event unlinkability. Its truth-record handle is acceptable only in the named one-effect conformance fixture, where no additional equality fact can be learned. General character-accessible provenance is blocked by `SEM-001`; unrestricted truth joins belong in omniscient trace.

Forbidden output information:

- `PotentialEffect`, `Capacity`, `Overflow`, or a truth-side clipping flag;
- full `EffectProvenance`;
- concepts in invisible provenance slots;
- private target or unrelated body state;
- an exact point when the permitted measurement establishes only a bound;
- any LLM-generated authoritative interpretation.

## Preconditions

Truth decomposition must satisfy exactly:

```text
Applied  = clamp(PotentialEffect, Minimum - Before, Maximum - Before)
Overflow = PotentialEffect - Applied
After    = Before + Applied
```

The channel, observer, subject, unit, modality, polarity, precision, and missingness rule are registered and versioned. A channel cannot be created ad hoc by an event payload.

A channel that emits a truth-side `ConceptId` must explicitly establish semantic identity as part of its permitted signal. Mere visibility of the underlying entity is insufficient. General visual/event observation must instead use the `SEM-001` perceptual-referent boundary.

## Totality, typed failures, instant rollback, and failed-run behavior

Invalid decomposition, domain, unit, channel, polarity, precision, visibility slot, duplicate concept token, or evidence/interval mismatch fails before evidence emission. The containing instant rolls back under accepted Campaign 0 semantics. No partial observation or `SemanticExperience` commits.

## Exact transformation

First validate the truth identity above. Apply the registered deterministic missingness rule. If missing, emit `MissingObservation` with channel/observer/subject/time and no measurement value.

For `ExactEffectControl`, the interval is `[PotentialEffect, PotentialEffect]`. This omniscient control is permitted only in named experiments; it is not the default interoceptive model.

For `BoundedStateChange`, the measured value is `ObservedDelta = After - Before = Applied`, but classification uses only the permitted state-change projection, known bounds, and registered polarity:

```text
Polarity = Increase and After = Maximum  => [ObservedDelta, +∞)  / LowerBound
Polarity = Decrease and After = Minimum  => (-∞, ObservedDelta]  / UpperBound
otherwise                                 => [ObservedDelta, ObservedDelta] / Point
```

For `Signed`, positive `ObservedDelta` at `Maximum` is `LowerBound`; negative `ObservedDelta` at `Minimum` is `UpperBound`; every other value is `Point`. A zero delta at a boundary is not directionally classifiable under `Signed`; this version rejects that case rather than guessing. A polarity-specific channel can validly emit the zero-information bounds `[0,+∞)` or `(-∞,0]`.

Crucially, `Overflow` is not an input to classification. Exact-at-boundary and overflow-at-boundary truths produce the same evidence when the channel cannot distinguish them.

The restricted visible-provenance control iterates a permanent slot-priority registry. A concept is emitted only from a slot visible to this observer/channel and only when that channel establishes semantic identity. When the same concept appears in several visible slots, the earliest registered slot wins. This deliberate deduplication makes the control unsuitable for general event semantics; `SEM-001` must preserve separately identified binding occurrences. Invisible slots produce neither a concept token nor a role hint.

## Random addresses and distribution mapping

Not applicable in version 0.1. Missingness is a deterministic registered rule. A future stochastic sensor requires an addressed-random extension and new vectors.

## Quantization and rounding points

None. All arithmetic and comparisons are exact rationals. A later sensor quantizer must be a named transformation with exact bins, tie rules, and error vectors.

## Canonical collection ordering and tie rules

Perceived concept tokens sort by canonical concept ID after slot-priority resolution. Safe source references sort by canonical record ID and are duplicate-free. Measurement records sort by canonical `(SubjectId, ObservationChannelId, ObservationId)` when an experience contains more than one.

## Event phase and timing semantics

Initial/body observations may execute in registered phase 10. Consequence observation and encoding execute in phase 120. The evidence record uses the producing event's `DueAt`; it cannot read or incorporate later truth. Same-instant consumers run only in later registered phases.

## Postconditions

- every present observation has exactly one interval/classification pair;
- missing observations have no measurement, precision-weighted update, or perceived token inferred from the missing channel;
- hidden truth differences that preserve the permitted projection preserve the entire evidence record byte-for-byte;
- every output field is derivable from recorded allowed reads;
- no character-state mutation occurs in this seam.

## Invariants

1. `Point` iff lower and upper endpoints are both present and equal.
2. `LowerBound` iff only a finite lower endpoint is present.
3. `UpperBound` iff only a finite upper endpoint is present.
4. Precision is positive for present evidence and absent for missing evidence.
5. `PotentialEffect`, `Overflow`, and full provenance are structurally absent from permitted evidence.
6. Classification is invariant under hidden truth changes that preserve channel inputs.
7. Concept tokens are a subset of visible projected slots.

## Trace records and provenance

Omniscient trace records the full bounded-effect truth, channel definition, missingness decision, permitted projection, interval classification, visible-slot derivation, and prohibited-read audit. The committed evidence record contains the permitted projection and, only within this single-effect fixture domain, its source record reference. Cross-event truth-handle equality is not accepted character evidence; `SEM-001` owns its replacement. Failure diagnostics may quote invalid staged truth but never become character evidence.

## Candidate mechanisms and control implementations

- **Candidate:** `BoundedStateChange/1`, deriving interval semantics from observable state change, registered polarity, and known bounds.
- **Historical control:** authoritative `Applied` as a point measurement plus historical truth-side saturation classification.
- **Omniscient control:** `ExactEffectControl`, explicitly exposing potential effect in a named experiment.
- **Boundary correction:** truth-side `EffectProvenance` remains trace input; only visible slots become perceived tokens.

## Competing models / ablations

- `OverflowLeak`: includes hidden overflow magnitude in evidence.
- `TruthSaturationClassifier`: uses `Overflow != 0` to choose evidence kind.
- `FullProvenanceCopy`: copies truth provenance into `SemanticExperience`.
- `MissingAsZero`: encodes absence as point evidence at zero.
- `AlwaysPoint`: treats clipped state change as exact efficacy.

## Equivalence relation and tolerances

All Campaign 1 comparisons are exact structural comparisons. There is no display tolerance. In `PHEN-EPI-001`, truth traces must differ while all character-accessible evidence and downstream state remain exactly equal.

## Proof obligations and executable tests

- `CV-OBS-001`: exact point/lower/upper/zero-bound classification from permitted inputs;
- `CV-OBS-002`: exact-at-boundary and overflow-at-boundary observational equivalence;
- `CV-OBS-003`: missing observation is structurally distinct from zero;
- `CV-OBS-004`: invisible provenance slots and forbidden truth fields cannot enter evidence;
- `CV-OBS-005`: deterministic slot priority, canonical token order, and duplicate rejection;
- `CV-OBS-006`: invalid truth decomposition, channel, polarity, unit, and precision fail transactionally;
- `CV-EPI-001`: the complete hidden-Overflow paired timeline preserves every character-accessible structure;
- `CV-EPI-002`: each prohibited control produces the declared divergence or structural violation.

## Applicable Campaign 0 conformance vectors

Canonical encoding/identity, exact arithmetic, ordering, transaction rollback, save/load, read-domain, patch, trace, and first-divergence vectors remain mandatory controls.

## Known domain exclusions

No noisy sensors, false observations, mixed modalities, ambiguous intervals, uncertain bounds, gradual detection, attention competition, general event bindings, perceptual tracking, recognition, belief updates, or salience calibration are accepted here. Evidence-aware surprise and learning consume this seam's interval classification but belong to subsequent Campaign 1 contracts. General event semantics must first pass `SEM-001`.

## Accepted limitations

- Whether body bounds are themselves character-known must be declared per channel; version 0.1 fixtures use a registered interoceptive channel whose bounds are known.
- Permanent numeric IDs govern evidence kind, polarity, measurement mode, missingness, causal role, and visible provenance slot priority.
- Token projection is limited to channels that establish semantic identity; it is retained as a restricted control while `SEM-001` develops the general binding representation.

## Reopen conditions

Reopen on any measurement-mode, interval vocabulary, polarity, missingness, visibility, role-projection, unit, precision, timing, or safe-reference change; on a fixture requiring noisy or ambiguous evidence; or on any hidden-truth influence not descending from permitted projection.

## Change history

- 2026-09-01: initial candidate opened Campaign 1; separated measurement interval from hidden Overflow and full truth provenance.
- 2026-09-01: accepted after all `CV-OBS-*`/`CV-EPI-*` controls passed through canonical closure, transactional scheduling, thin `SemanticExperience`, immediate consumption, and structural first divergence; closed `MATH-006` without renaming the candidate-era version.
- 2026-09-01: clarified acceptance scope after opening `SEM-001`; bounded measurement remains accepted, while general event bindings, perceptual referents, and recognition are explicitly unproven. Restricted token projection now requires a channel that establishes identity.
