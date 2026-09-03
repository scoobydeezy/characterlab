# Event Semantic Binding and Recognition Boundary

**Status:** candidate Campaign 1 seam, version `semantic-binding/0.1-candidate`

**Decision owner:** `SEM-001`

**SeamId:** `seam/event-truth-to-pre-recognition-experience`

**Architecture edges:** observable world event → Perception / Attention → pre-recognition `SemanticExperience` → Recognition / Familiarity / Novelty

**Depends on:** accepted `content/0.2-candidate`, `substrate/0.2-candidate`, `ordering/0.2-candidate`, `state/0.2-candidate`, `trace/0.2-candidate`, and the bounded-measurement portion of accepted `observation/0.1-candidate`

**Supersedes:** no accepted general event-binding contract. The `PerceivedConceptToken` path in `observation/0.1-candidate` remains a restricted control and is not the general representation defined here.

## Accepted subdecision `SEM-001A` — observer-relative perceptual continuant-files

`PerceptualReferentId` is:

> **The identity of one observer-relative perceptual continuant-file currently treated by the perception process as continuous. It makes no claim about truth identity or about whether the perceived continuant is a person, discrete object, place, spatial region, or other kind.**

This 2026-09-02 domain clarification amends the accepted term “object-file” to “continuant-file.” It does not change epistemic access, continuity, allocation, lifecycle, or recognition semantics. The perception process may produce false continuity across different truth entities or false discontinuity across one truth entity. Neither case is corrected from truth automatically. Recognition may later attach equal or different identity hypotheses to the resulting continuant-files, but it never merges, splits, or rewrites their historical identity. Classification, not the identity carrier, determines whether the file appears person-like, discrete-object-like, place-like, or otherwise.

Allocation is observer-scoped. Each observer owns a monotonically increasing `ObserverTrackSequence`, persisted across save/load and never reused. Another observer allocating a track cannot renumber or otherwise perturb this observer's perceptual identity space. The exact storage schema remains part of the parent contract's record-design work, but its semantic identity is equivalent to `(ObserverId, ObserverTrackSequence)` and may not depend on the run-global runtime-allocation sequence.

The encoded or ordinal value of a `PerceptualReferentId` is opaque identity only. Its numeric form may not contribute semantic magnitude, salience, similarity, appraisal, ordering preference, or any other psychological value.

Accepted `SEM-001I.1` closes the previously implicit retirement record:

```text
PerceptualTrackEnd = {
  ObserverId,
  PerceptualReferentId,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

Exactly one end occurrence may exist per continuant-file. Perception is its sole authority. Ending removes the file from the active set without freeing its sequence; later reacquisition uses `NewTrack` and a fresh `PerceptualReferentId`. Truth comparison and recognition cannot emit this record.

## Accepted subdecision `SEM-001B` — event-binding occurrences and roles

**Status:** accepted 2026-09-02 for occurrence identity, the initial role vocabulary, event-type cardinality/domain narrowing, duplicate-pair rejection, the truth-role epistemic boundary, and qualifier removal. Permanent canonical record/enum IDs remain blocked by the parent `SEM-001`.

### Binding occurrence identity

An `EventBindingId` identifies one truth-side argument occurrence in one immutable world event. Its scope is run-wide typed runtime identity allocated by the accepted authoritative runtime-ID allocator while the event is staged. It is not derived from `EventRoleId`, `SemanticReferentId`, collection position, a hash of either value, or a human-readable label.

This permits all of the following without collapse:

```text
one referent + several roles       → several EventBinding records
one role + several referents       → several EventBinding records
same referent in a later event     → a new EventBinding record
```

The ID is permanent for the immutable occurrence, never reused, sorted canonically as an opaque typed identity, and restored exactly across save/load. Allocation participates in whole-instant rollback. Its numeric value has no semantic, causal, perceptual, salience, or psychological magnitude. A truth-side binding ID remains omniscient-trace provenance and may not cross into character evidence as a stable linkable handle.

For version 0.1, two bindings in the same event may not repeat the same `(EventRoleId, SemanticReferentId)` pair. With no accepted qualifier grammar, such records differ only by opaque ID and express no mechanically inspectable distinction. A phenomenon that needs repeated same-role/same-referent occurrences must first introduce a governed typed occurrence, subevent, or count distinction or split them into separate events.

### Event roles are governed semantic argument labels

`EventRoleId` should resolve through a governed role definition:

```text
EventRoleDefinition = {
  EventRoleId,
  BroadReferentDomainValidatorId,
  DefinitionVersion
}
```

Human-readable role descriptions are presentation metadata, not executable semantics. Runtime closure depends only on the typed role ID, its registered deterministic referent-domain validator, and the event type's binding schema. No handler or LLM interprets the prose in the table below.

The accepted initial vocabulary is deliberately free of weights, priority, attention, salience, causality, and appraisal:

| Role | Exact initial meaning |
|---|---|
| `Action` | the action, process, or event-kind referent instantiated by this event |
| `Actor` | an entity represented by the event type as performing or initiating the action; this role alone does not prove subjective intent, blame, or causal magnitude |
| `Companion` | an entity represented as accompanying or jointly participating in the action under the event type's companion relation; this does not assert friendship or relationship state |
| `Target` | an entity toward which the action is structurally directed; this does not prove that it was affected |
| `Recipient` | an entity structurally designated to receive something in the event |
| `Instrument` | an entity structurally used in performing the action; this does not assign salience or analytical causal weight |
| `AffectedEntity` | an entity whose truth-side state the event records as affected; perception of the role still requires evidence |
| `Beneficiary` | an entity structurally designated to benefit from the event; this asserts neither positive appraisal nor that the benefit was perceived or realized |
| `Participant` | an involved entity for which the event type establishes no narrower accepted role |
| `Location` | the place or spatial referent at which the event occurs |

`EventTypeId` identifies the world-event record/handler semantics; an `Action` binding identifies the governed action/content referent instantiated inside that event. The fixture therefore may use a general action-occurrence event type while binding `action.skip_rope`. If a narrower event type already fixes the action referent completely, its schema should prohibit a redundant `Action` binding rather than encode the same fact twice.

`Cause`, `Incidental`, and generic `Context` are intentionally absent. In the retained implementation, the first two were analytical `CausalRole`/attention classifications, not necessarily semantic arguments of every event. `Context` is too broad to preserve the relation between a contextual referent and the event. If a required phenomenon needs another relation, it adds a governed `EventRoleId` with an exact semantic definition rather than routing arbitrary referents through `Context` or qualifiers.

Role IDs are typed symbols, not ranks. Their encoded values and registry order may be used only for canonical comparison and never as priority or psychological magnitude.

### Multiplicity belongs to the event type

Global role definitions do not declare universal cardinality. Each governed event type should declare its accepted binding shape:

```text
EventTypeBindingSchema = {
  EventTypeId,
  RoleCardinalityRules[],
  BindingSchemaVersion
}

RoleCardinalityRule = {
  EventRoleId,
  MinOccurrences,
  MaxOccurrences: Finite(nonnegative integer) | Unbounded,
  ReferentDomainNarrowingValidatorId?
}
```

Roles omitted from an event type's schema have cardinality `0..0`. Counts apply to binding occurrences, not distinct referents. Therefore an event type may permit several companions, require exactly one action, or prohibit instruments, while another event type makes different declarations for the same global roles. An optional event-type validator narrows the global role domain; effective acceptance is always `BroadDomain(referent) AND NarrowingDomain(referent)`, so it cannot widen the role's globally legal domain. The ontology supplying finite categories and validators belongs to `ONT-001`; this subdecision fixes only the deterministic contract point and fixture vocabulary. The fixture's accepted exact shape is:

```text
Action      1..1
Actor       1..1
Companion   1..Unbounded
Location    1..1
Instrument  1..1
all other initial roles  0..0
```

The `PHEN-SEM-001` multi-role intervention binds the same referent into two permitted roles through two binding occurrences. Cardinality is checked before observation. The perception seam may hide either occurrence independently; it may not reconstruct a missing binding from the other occurrence or from truth referent equality.

Independent per-role cardinalities are the complete initial multiplicity grammar. Cross-role XOR, dependency, ordering, and conditional-cardinality rules remain outside version 0.1 until a required event type demonstrates them and receives an exact governed representation.

### Qualifier disposition

`SEM-001B` removes the unresolved `Qualifiers[]` field from `EventBinding` version 0.1:

```text
EventBinding = {
  EventBindingId,
  EventRoleId,
  SemanticReferentId
}
```

Freeform qualifiers, map-shaped extension data, prose, or LLM interpretation are forbidden. A later typed qualifier mechanism must define identity, value grammar, applicability, canonical ordering, epistemic projection, and adversarial controls before changing this shape.

### Accepted invariants and controls

1. Binding identity is occurrence identity, never referent identity or role identity.
2. One referent in several roles survives as several binding records.
3. Several referents in one role survive as several binding records.
4. Every binding satisfies the named event type's per-role cardinality schema.
5. Duplicate `(EventRoleId, SemanticReferentId)` pairs fail in version 0.1.
6. Event roles and causal roles remain distinct typed namespaces and records.
7. Role and binding ordinals are opaque and have no semantic or psychological magnitude.
8. Binding IDs and hidden referent equality remain trace-side unless separately projected through permitted observation.
9. Any invalid role, domain, duplicate pair, cardinality, ordering, or forbidden qualifier aborts the complete instant and restores its allocator state.
10. `EventRole` defines truth-side event grammar; `EventRoleEvidence` defines what relation the observer could discriminate. A visible binding does not automatically expose its truth-side role specificity.

Accepted negative controls are `ReferentKeyedBinding`, `RoleKeyedBinding`, `GlobalRoleCardinality`, `EventRoleEqualsCausalRole`, `BindingOrdinalPsychology`, `RoleOrdinalPriority`, `DuplicateOpaqueOccurrence`, `FreeformBindingQualifier`, and `VisibleBindingRevealsTruthRole`.

## Accepted subdecision `SEM-001C` — observer-relative perceptual event-files

**Status:** accepted 2026-09-02 after executable `CV-SEM-031..040`; the oracle remains symbolic and is not permission to allocate permanent canonical record IDs

### Definition and purpose

`PerceptualEventReferentId` is proposed as:

> **The identity of one observer-relative perceptual event-file currently treated by the perception process as one continuous occurrence. It makes no claim that it corresponds one-to-one with a truth-side `WorldEventTruth`.**

This is not merely a carrier for the truth-side `Action` binding. It is the character-relative relational frame answering:

> **Which perceived role bindings does this observer currently treat as belonging to the same occurrence?**

The two observer-relative identities remain distinct:

```text
PerceptualReferentId
→ continuity of a perceived continuant-file

PerceptualEventReferentId
→ continuity and grouping of a perceived occurrence/process
```

Neither ID establishes truth identity, recognition, classification, causal importance, salience, appraisal, or psychological meaning. They are not generalized into a continuant/event union because their lifecycle and future research may diverge.

### Observer-scoped allocation and lifecycle

Conceptually:

```text
PerceptualEventReferentId = (
  ObserverId,
  ObserverEventSequence
)
```

Each observer owns an independently monotonic `ObserverEventSequence`, persisted across save/load and never reused after event-file retirement. Another observer starting an event-file cannot renumber this observer's event identity space. The encoded ordinal is opaque identity only and may not contribute semantic magnitude, temporal duration, ordering importance, classification, similarity, salience, appraisal, or any other psychological value.

The perception seam is sole authority for active event-files and the per-observer next-event-sequence map. Starting, continuing, or ending an event-file is staged inside the accepted whole-instant transaction. Any later failure restores active files, sequences, trace, outputs, and scheduler state structurally exactly.

### Observer-side event segmentation

The proposed transition record is:

```text
PerceptualEventTransition = {
  ObserverId,
  PriorPerceptualEventReferentId?,
  CurrentEventDetectionId,
  ContinuityKind: NewEventFile | ContinuesPriorEventFile,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

PerceptualEventEnd = {
  ObserverId,
  PerceptualEventReferentId,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

`CurrentEventDetectionId` is observer-side sensory/event-feature identity, not a truth event handle or action identity. The segmentation provider reads only permitted observation/event-feature evidence. `NewEventFile` allocates from that observer's sequence. `ContinuesPriorEventFile` requires one active prior event-file owned by the same observer and allocates nothing. `PerceptualEventEnd` retires the file without making its ID reusable.

Version 0.1 makes only a deterministic binary start/continue decision. It adds no probability or confidence merely for completeness.

Event segmentation may be objectively wrong:

```text
false merge:
truth Event A → Event B
observer perceived-event/8 → continues

false split:
truth one continuous event
observer perceived-event/8 → ends
observer perceived-event/9 → begins
```

Truth event identity never repairs, merges, splits, ends, or continues an event-file automatically. Omniscient trace may record the mismatch for research without changing character evidence.

### Perceived bindings are grouped by event-file

The proposed binding record refines the parent shape:

```text
PerceivedBindingEvidence = {
  PerceivedBindingId,
  ObserverId,
  PerceptualEventReferentId,
  PerceptualReferentId,
  EventRoleEvidence,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

`PerceptualEventReferentId` identifies the perceived occurrence to which the observer assigns this role participation. `PerceptualReferentId` identifies the perceived continuant filling the role. Both must be owned by the same observer as the binding.

One continuant-file may participate in several event-files, including concurrent files. Several bindings in one event-file may point to the same continuant-file under distinct permitted roles. Binding identity remains occurrence identity, so grouping never deduplicates by continuant-file or role alone.

The event-file does not imply that every role was observed simultaneously, with equal precision, or with equal supporting evidence. Each binding retains its own time, role evidence, and observation basis. A visible truth binding still may be preserved, coarsened, unresolved, or omitted independently.

### Experience and event-file identity remain distinct

`ExperienceId` is an observation/assembly envelope. `PerceptualEventReferentId` is a perceived-occurrence identity:

```text
one ExperienceId
→ may contain several PerceptualEventReferentIds

one PerceptualEventReferentId
→ may appear across several ExperienceIds
```

The proposed experience envelope therefore collects event-file references and event-grouped bindings without equating either identity:

```text
PreRecognitionSemanticExperience = {
  ExperienceId,
  ObserverId,
  OccurredAt,
  PerceptualEventReferentIds[],
  PerceivedBindings[],
  PerceptualClassifications[],
  PerceptualEventClassifications[],
  SupportingObservationIds[],
  TransformationVersion
}
```

An event-file may persist through several observation/experience boundaries. Several simultaneous perceived occurrences may be assembled into one experience while retaining exact role grouping.

### Action binding disposition

Truth-side event grammar retains:

```text
Action → action.skip_rope
```

Its observer-side projection must not become `Action → PerceptualReferentId`, and visibility must not copy `action.skip_rope`. Perceived action meaning belongs to later `PerceptualEventClassificationEvidence` or action-concept evidence attached to `PerceptualEventReferentId` and derived only from permitted event-feature observations.

`SEM-001C` establishes the event-file carrier without choosing an action-classification vocabulary. It remains legal for the observer to group participants into one perceived occurrence while leaving the event pattern unresolved or classifying it only coarsely. Accepted `SEM-001D` supplies continuant appearance classification; accepted `SEM-001E` supplies the separate event-pattern vocabulary without learned action identity.

### Accepted invariants and controls

1. Perceptual event-file identity is observer-relative occurrence grouping, not truth-event identity.
2. Continuant-file, event-file, and experience identities are distinct typed namespaces.
3. Event segmentation uses only permitted observer-side evidence and may be objectively wrong.
4. Allocators are independently monotonic per observer, persisted, never reused, and atomically rolled back.
5. Event-file ordinals are opaque and psychologically meaningless.
6. Every perceived binding names exactly one event-file and one continuant-file owned by the same observer.
7. Event grouping preserves multiple simultaneous perceived occurrences without role cross-association.
8. One event-file may span experiences; one experience may contain several event-files.
9. One continuant-file may participate in several event-files, and one event-file may bind it under several roles.
10. Truth `WorldEventId`, scheduler `EventId`, and truth `Action` identity never determine event segmentation or perceived action meaning automatically.

Accepted negative controls are `ExperienceIsEventFile`, `TruthEventKeyedSegmentation`, `ActionTruthCopy`, `UngroupedPerceivedBindings`, `CrossObserverEventFile`, `GlobalEventFileAllocator`, `EventFileOrdinalPsychology`, `TruthCorrectedEventSegmentation`, `EventFileRollbackLeak`, and `ActionAsContinuantFile`.

### Scope boundary

Version 0.1 establishes observer-relative occurrence identity, permitted binary segmentation, event-grouped role bindings, lifecycle/replay semantics, and the Action carrier boundary. Hierarchical events, nested subevents, temporal abstraction, event memory, scripts, probabilistic boundaries, event confidence, causal inference, and rich action understanding remain outside this subdecision.

## Accepted subdecision `SEM-001D` — typed perceptual continuant classification

**Status:** accepted 2026-09-02 after executable `CV-SEM-041..050`; the oracle remains symbolic and is not permission to allocate permanent canonical record IDs

### Separate truth and perceptual facet namespaces

Truth classification and appearance classification should not share an identity namespace:

```text
WorldSemanticFacetId
≠ PerceptualFacetId
```

`WorldSemanticFacetId` describes an objective or operational truth-side property governed by `ONT-001`. `PerceptualFacetId` describes what one observer-relative continuant-file appeared to satisfy under a registered perception rule. Equality of the underlying words, such as `Metal` and `AppearsMetallic`, creates no automatic projection.

A world fact may constrain sensory production, but a perceptual classification is emitted only from permitted observer-side feature evidence through a registered deterministic rule. The character record contains neither the truth facet ID, truth value, truth referent, nor a stable truth-source handle.

### Facet definitions and exact value grammar

The proposed definition is:

```text
PerceptualFacetDefinition = {
  PerceptualFacetId,
  PerceivedValueType,
  ObservationDomainValidatorId,
  DefinitionVersion
}

PerceivedValueType = BooleanValue
```

`BooleanValue` has exactly the canonical values `true` and `false`. Numbers, strings, prose, maps, lists, symbols, and implicit coercions fail closure. Version 0.1 has no enum, open symbol, probability, confidence, fuzzy membership, scalar similarity, or freeform tag value. A future non-boolean facet must add and prove an exact value type rather than smuggling a category through text.

The stored record value remains boolean-only, but the classifier derivation result is explicitly optional:

```text
ClassificationRuleResult
  = NoAssertion
  | Assert(BooleanValue)
```

`NoAssertion` emits no `PerceptualClassificationEvidence`; absence remains unknown/unresolved at this boundary. It is not boolean `false`, an `Unknown` sentinel, a zero-confidence assertion, or evidence for the complement. `Assert(false)` emits a present record only when the rule has explicit permitted negative feature evidence sufficient to determine the predicate absent at its declared resolution. `Assert(true)` likewise requires traceable permitted supporting feature evidence.

`ObservationDomainValidatorId` validates observer-side detection/feature applicability, not a truth ontology class and not another perceptual conclusion. Initial facets are therefore allowed over the finite visual-feature fixture domain without requiring ontology inheritance. Consumer permissions do not belong to the semantic facet definition. The classification transition may emit only into pre-recognition `SemanticExperience` assembly. Every later consumer must independently declare classification evidence within its capability-limited `ReadDomain`. A future recognition contract may read classification through the assembled experience, but classification cannot bypass that boundary to assert identity. Direct writes or emissions into recognition hypotheses, appraisal, affect, motive, pressure, Reasons, identity, relationships, or world truth are forbidden.

### Initial finite fixture vocabulary

The proposed vocabulary is intentionally perceptual rather than ontological:

| Perceptual facet | Value type | Initial meaning |
|---|---|---|
| `AppearsPersonLike` | boolean | whether permitted form/motion evidence satisfies the registered person-like appearance rule |
| `AppearsDiscreteObjectLike` | boolean | whether permitted form evidence satisfies the registered discrete-object-like appearance rule |
| `AppearsInteriorSpaceLike` | boolean | whether permitted enclosure/spatial evidence satisfies the registered interior-space-like rule |
| `AppearsMetallic` | boolean | whether permitted surface-feature evidence satisfies the registered metallic-appearance rule |
| `AppearsElongated` | boolean | whether permitted form evidence satisfies the registered elongation rule |
| `AppearsBlunt` | boolean | whether permitted form evidence satisfies the registered blunt-form rule |

These are independent appearance predicates, not an exhaustive or mutually exclusive kind classifier. More than one may be true, false, or unresolved for the same continuant-file. No implication is automatic: `AppearsPersonLike=true` does not force `AppearsDiscreteObjectLike=false`, and no combination establishes truth identity. A required phenomenon involving hierarchical, uncertain, graded, or categorical appearance reopens the value grammar rather than encoding those meanings into strings or silent inference.

### Event carrier boundary inherited from `SEM-001C`

Amended `SEM-001A` defines `PerceptualReferentId` as an observer-relative perceptual continuant-file: it may carry a perceived person, discrete object, place, or spatial region without asserting which kind it is. The parent fixture also describes an `Action` binding becoming an “action-like referent,” but an action occurrence is not a continuant-file. Accepted `SEM-001C` supplies the separate observer-relative `PerceptualEventReferentId` carrier and forbids `ActionAsContinuantFile`. `SEM-001D` therefore does not propose continuant-file `AppearsActionLike`.

The identity carrier was resolved independently of classification. Accepted continuant-file classification vectors cover persons, discrete objects, locations/interior spaces, material appearance, and form. Accepted `SEM-001E` separately defines typed event-feature inputs and permitted event-pattern classification on `PerceptualEventReferentId`; truth `Action` identity still cannot cross automatically.

The vocabulary does not include `Threatening`, `Friendly`, `Valuable`, `Relaxing`, `Bad`, `Familiar`, `Glen`, causal roles, event roles, affordances, or action recommendations. Those belong to appraisal, recognition, event grammar, ontology/affordance, or later interpretation seams.

### Registered classification rules

The classifier does not consume informal “features.” Its direct inputs are typed observer-side records:

```text
PermittedPerceptualFeatureObservation = {
  FeatureObservationId,
  ObserverId,
  CurrentDetectionId,
  PerceptualReferentId,
  PerceptualFeatureId,
  BooleanValue,
  ObservationChannelId,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

The finite fixture registers exact feature IDs corresponding to person-form, discrete-object-form, enclosure-form, metallic-surface, elongated-form, and blunt-form detections. Each observation channel declares the exact controlled fixture inputs it may read and deterministically emits one boolean feature observation tied to one observer/detection/continuant context and permitted observation basis. These feature IDs are sensory predicates, not aliases for world semantic facets or truth referents. Feature production, actual reads, omitted features, and any objective mismatch are fully traceable. Continuous geometry/image processing remains outside version 0.1, but no authoritative step from the fixture's declared sensory input to classification may be prose, an authored classification conclusion, or an LLM interpretation.

Feature-observation presence has the same epistemic grammar as classification presence. No `PermittedPerceptualFeatureObservation` means that the registered sensor made no permitted determination for that feature. An explicit `BooleanValue=false` record means the registered observation rule had sufficient permitted sensory evidence to assert that feature predicate false at its declared resolution. Detector silence, an omitted read, unavailable evidence, and an explicit negative observation are not interchangeable.

Every emitted assertion names an executable governed rule:

```text
PerceptualClassificationRuleDefinition = {
  ClassificationRuleId,
  PermittedInputFeatureSchemaId,
  OutputPerceptualFacetId,
  DerivationFunctionId,
  RuleVersion
}
```

`DerivationFunctionId` resolves to executable deterministic logic committed by model identity; prose is presentation only. In version 0.1, one `ModelIdentity` registers exactly one authoritative `ClassificationRuleId` for each `PerceptualFacetId`. Missing authority and duplicate output-facet authority both fail registry closure. This deliberately stricter rule avoids undecidable overlap among arbitrary applicability validators. Competing scientific classifiers belong in different model identities. A future demonstrated need for several modality-specific authorities must add a governed aggregation or mechanically provable disjoint-domain contract.

For the initial proof, direct finite feature rules consume observer-side boolean feature observations such as `ObservedPersonForm`, `ObservedDiscreteObjectForm`, `ObservedEnclosureForm`, `ObservedMetallicSurface`, `ObservedElongatedForm`, and `ObservedBluntForm`. Each returns only `NoAssertion` or `Assert(BooleanValue)`. These are deliberately controlled sensor-feature fixtures, not a claim to have solved continuous vision.

The rule reads only permitted feature observations owned by the same observer and detection/track context. It cannot read world semantic facets, truth referent identity, event binding identity, recognition state, memory, belief, appraisal, or an LLM result. Omniscient trace may compare its output with truth for research, but that comparison cannot alter the character evidence.

### Classification evidence identity and closure

The accepted symbolic record refines the parent candidate shape:

```text
PerceptualClassificationEvidence = {
  ClassificationEvidenceId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  PerceptualFacetId,
  TypedPerceivedValue,
  ClassificationRuleId,
  SupportingFeatureObservationIds[],
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

`ClassificationEvidenceId` is a run-scoped typed runtime occurrence allocated through the accepted allocator, never derived from observer, track, facet, value, supporting observations, collection position, or display data. It is immutable, never reused, atomically rolled back, and psychologically opaque. Like `EventBindingId`, it remains trace provenance rather than a source of character-accessible magnitude or linkage.

Every assertion must cite at least one canonical, unique, observer-permitted `SupportingFeatureObservationId` and its underlying `SupportingObservationId` basis. `Assert(false)` additionally requires an explicit false feature observation among that basis; absence cannot manufacture negative evidence. One experience may contain at most one classification assertion for a given `(PerceptualReferentId, PerceptualFacetId)`. Several supporting observations are consolidated by the named rule before emission; duplicate or conflicting assertions may not be preserved as opaque repeated records. A later phenomenon that needs explicit ambiguity or competing classifications must add a typed representation rather than exploit record multiplicity.

The observer must own the perceptual referent, every supporting observation must belong to the permitted projection for that observer and time/context, the facet and rule must resolve, the rule output facet must match the assertion facet, and the value must exactly inhabit the facet's registered value type. Collections sort by canonical typed identity. Any violation aborts the complete instant and restores allocation.

### Accepted invariants and controls

1. World facets and perceptual facets occupy different typed namespaces.
2. Registered truth never projects merely because it exists or shares a label with a perceptual facet.
3. Every classification descends from permitted observer-side feature evidence through one registered deterministic rule.
4. Missing classification is unknown, not false or an `Unknown` symbol.
5. Explicit false is present evidence produced by the rule, not default absence.
6. Facet values are exact booleans in version 0.1; no coercion, symbols, or open tags exist.
7. Missing feature observation is unresolved; explicit feature false requires sufficient permitted negative sensory evidence.
8. Each model has exactly one authoritative classification rule per facet; competing rules require competing model identities.
9. One experience contains at most one assertion per perceptual referent/facet pair.
10. Classification IDs and ordinals carry no semantic or psychological magnitude.
11. Continuant-file, event-file, classification, tracking, recognition, event role, causal role, and appraisal remain distinct.
12. Classification cannot bypass experience assembly to create recognition, affect, motive, pressure, a Reason, identity evidence, relationship change, or world truth.

Accepted negative controls are `TruthFacetCopy`, `SharedTruthPerceptualFacetId`, `EventFileAsContinuantCarrier`, `FreeformTagBag`, `WrongTypedFacetValue`, `CategoryStringValue`, `MissingAsFalse`, `MissingFeatureAsFalse`, `UnknownSentinel`, `ExclusivePrimaryKind`, `DuplicateFacetAuthority`, `MissingFacetAuthority`, `DuplicateFacetAssertion`, `ClassificationOrdinalPsychology`, `RecognitionFromClassificationIdentity`, `ClassificationToPressure`, and `LLMClassifier`.

## Accepted subdecision `SEM-001E` — typed perceptual event-pattern classification

**Status:** accepted 2026-09-02 through executable `CV-SEM-051..060`; symbolic candidate identities only, with permanent canonical IDs still blocked by the parent `SEM-001`

### Purpose and historical correction

Accepted `SEM-001C` answers which perceived participations belong to one occurrence. It intentionally does not answer what action or process the occurrence appears to instantiate. `SEM-001E` supplies the perceptual event-pattern layer without copying truth `EventTypeId` or the truth binding:

```text
Action → action.skip_rope
```

The historical reference placed `CanonicalActionKey` directly on `SemanticExperience` and projected `EffectProvenance.sourceAction` as a perceived concept. Those shapes remain valuable controls under `MEC-004`, but they are not epistemically safe defaults: authored or simulator-known action identity may not become character knowledge merely because an event was observable.

The accepted replacement preserves “what action seemed to happen” as typed observer evidence:

```text
truth action identity
  ≠ observer-side event features
  ≠ perceptual event/action classification
  ≠ later recognized action schema
  ≠ appraisal or recommendation
```

This subdecision covers event appearance classification only. It does not yet define recognized action-schema identity, scripts, causal inference, affordances, intentions, or downstream memory keys.

### Separate event-classification namespace and carrier

```text
World EventTypeId / SemanticActionReferentId
  ≠ PerceptualEventFacetId

PerceptualFacetId
  ≠ PerceptualEventFacetId
```

`PerceptualEventFacetId` describes what one observer-relative `PerceptualEventReferentId` appeared to satisfy under a registered event-classification rule. It cannot attach to `PerceptualReferentId`. Continuant appearance facets cannot attach to event-files.

Matching names, ordinal positions, registry order, or authored associations create no projection between truth action IDs and perceptual event facets. A world action may constrain sensory generation, but the event classifier reads only permitted observer-side event-feature observations.

### Initial finite fixture vocabulary

The accepted `PHEN-SEM-001` vocabulary is finite, independent, and boolean:

| Perceptual event facet | Initial controlled-fixture meaning |
|---|---|
| `AppearsRopeSkippingPatternLike` | permitted event features satisfy the exact coordinated body/continuant-pattern rule below |
| `AppearsRepetitiveMotionLike` | permitted evidence explicitly supports repeated patterned motion |
| `AppearsCoupledMultiContinuantMotionLike` | permitted evidence explicitly supports temporally coupled motion across perceived continuants |

These are independent appearance predicates, not truth action IDs, an exhaustive action taxonomy, or an exclusive primary action kind. Several may be true simultaneously, but no facet implies another outside a separately governed future rule. In particular, `AppearsRopeSkippingPatternLike=true` does not establish `action.skip_rope`, who intended it, whether it succeeded, whether it was beneficial, or whether the observer possesses or selected a learned action schema. A character unfamiliar with rope skipping may perceive the complete pattern without recognizing its semantic action identity.

### Typed observer-side event features

```text
PermittedPerceptualEventFeatureObservation = {
  EventFeatureObservationId,
  ObserverId,
  CurrentEventDetectionId,
  PerceptualEventReferentId,
  PerceptualEventFeatureId,
  BooleanValue,
  ObservationChannelId,
  SupportingPerceptualReferentIds[],
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

The controlled fixture registers:

```text
ObservedRepeatedVerticalBodyMotion
ObservedCyclicFlexibleContinuantArc
ObservedBodyContinuantPassageCoordination
ObservedRepeatedMotionPattern
ObservedCoupledMotionAcrossContinuants
```

Feature IDs describe permitted sensory/event-pattern predicates, not aliases for truth `Action`, `EventTypeId`, truth bindings, intentions, outcomes, or ontology facts. `SupportingPerceptualReferentIds` may cite observer-relative continuant-files participating in the sensory pattern; those references do not establish their truth identity or semantic kind.

Feature presence follows accepted `SEM-001D` epistemic grammar. Absence means no permitted determination. Explicit false means the registered sensor had sufficient evidence to assert the feature predicate false at its declared resolution. Detector silence is not negative evidence.

### Optional exact rules and sole authority

```text
PerceptualEventClassificationRuleDefinition = {
  EventClassificationRuleId,
  PermittedInputEventFeatureIds[],
  OutputPerceptualEventFacetId,
  DerivationFunctionId,
  RuleVersion
}

EventClassificationRuleResult
  = NoAssertion
  | Assert(BooleanValue)
```

Stored event-classification values are exact booleans only. `NoAssertion` emits no record. `Assert(false)` requires traceable explicit negative event-feature evidence. Unknown/null/prose/category strings/confidence/fuzzy membership are not stored values.

One `ModelIdentity` has exactly one authoritative rule per `PerceptualEventFacetId`. Missing or duplicate facet authority fails registry closure. Competing scientific rules require competing model identities. As with `SEM-001D`, a future need for multiple simultaneous modality rules must add an exact aggregation or mechanically provable disjoint-domain contract.

The initial direct rules are:

```text
AppearsRepetitiveMotionLike
  ← ObservedRepeatedMotionPattern

AppearsCoupledMultiContinuantMotionLike
  ← ObservedCoupledMotionAcrossContinuants

AppearsRopeSkippingPatternLike
  ← ObservedRepeatedVerticalBodyMotion
   ∧ ObservedCyclicFlexibleContinuantArc
   ∧ ObservedBodyContinuantPassageCoordination
```

For `AppearsRopeSkippingPatternLike`, all three inputs are definitionally necessary conditions of this deliberately narrow fixture predicate. All three true features produce `Assert(true)`; any explicit false produces `Assert(false)`; otherwise missing support produces `NoAssertion`. Every input must belong to the same observer, `PerceptualEventReferentId`, current event detection/observation window, and governed rule context. A negative from another event or window cannot falsify the current classification. This truth table and scope are part of the executable rule identity, not prose interpretation. A future classifier with merely suggestive inputs requires a different governed rule rather than weakening this conjunction implicitly.

### Evidence identity, experience multiplicity, and immutability

```text
PerceptualEventClassificationEvidence = {
  EventClassificationEvidenceId,
  ExperienceId,
  ObserverId,
  PerceptualEventReferentId,
  PerceptualEventFacetId,
  TypedPerceivedValue,
  EventClassificationRuleId,
  SupportingEventFeatureObservationIds[],
  SupportingPerceptualReferentIds[],
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}
```

`EventClassificationEvidenceId` is a run-scoped immutable runtime occurrence, allocated only for emitted assertions. It is never derived from event-file, facet, value, rule, collection position, or display data; never reused; atomically rolled back; and semantically/psychologically opaque.

One experience contains at most one assertion for each `(PerceptualEventReferentId, PerceptualEventFacetId)` pair. One event-file may appear in several experiences. Later evidence may therefore append a different classification assertion in a later experience without mutating or retracting the earlier record. False event continuity may produce changing or incompatible classifications on one event-file; false discontinuity may produce similar classifications on two event-files. Truth comparison never repairs either identity or classification history.

The accepted experience envelope keeps continuant and event classifications explicitly separate:

```text
PreRecognitionSemanticExperience = {
  ...,
  PerceptualEventReferentIds[],
  PerceivedBindings[],
  PerceptualClassifications[],
  PerceptualEventClassifications[],
  ...
}
```

Collection membership does not convert either classification family into recognition. Exact scheduler phase numbers remain a parent `SEM-001` obligation, but the causal order is fixed: permitted event features precede event classification, and event classification precedes immutable experience assembly.

### Action-role projection asymmetry and output boundary

Truth grammar retains `Action` as an `EventRoleId`, but observer action meaning is not represented as:

```text
PerceivedBindingEvidence {
  EventRoleEvidence = Action,
  PerceptualReferentId = ...
}
```

because an action is not a continuant role-filler. The two projection routes are intentionally asymmetric:

```text
truth continuant role binding
  Actor / Target / Instrument / Location / ...
    → permitted EventRoleEvidence
    → PerceivedBindingEvidence on PerceptualReferentId

truth Action binding / event semantics
    → permitted event-feature observations
    → PerceptualEventClassificationEvidence on PerceptualEventReferentId
```

The observation system may not fabricate a continuant merely to preserve a uniform record shape. For version 0.1, permitted action appearance is event-pattern classification evidence attached to `PerceptualEventReferentId`. Other observed roles continue to use event-grouped continuant bindings. Event-pattern classification and role inference are independently intervenable: either may change while the other is held structurally fixed. A future typed action-schema recognition seam may consume the assembled experience and propose a candidate `SemanticActionReferentId`, but cannot rewrite event classification or copy truth action identity.

The event-classification transition may emit only into pre-recognition `SemanticExperience` assembly. Consumer access belongs to capability-limited `ReadDomain` declarations. Event classification cannot directly emit an `Action` truth referent, recognition hypothesis, causal role, salience, appraisal, affect, motive, pressure, Reason, option, recommendation, identity evidence, relationship mutation, or world write.

### Accepted invariants and controls

1. Truth event/action IDs, continuant facets, and perceptual event facets occupy distinct namespaces.
2. Event classification attaches only to observer-owned event-files and permitted event detections.
3. Every assertion derives only from observer-side typed event features through one registered executable rule.
4. Feature absence and explicit false remain distinct; `NoAssertion` emits nothing.
5. Stored values are exact booleans; explicit false requires negative event-feature evidence.
6. Each model has exactly one authoritative rule per event facet.
7. One experience has at most one assertion per event-file/facet pair; later experiences append rather than rewrite.
8. False event merge/split remains representable and is never truth-corrected through classification.
9. Event classification occurrence ordinals have no semantic or psychological magnitude.
10. Truth `Action` and historical `SemanticExperience.action` cannot bypass permitted event evidence.
11. Action meaning does not use a continuant binding or overwrite event-role evidence.
12. Event classification cannot bypass experience assembly into recognition, appraisal, motivation, decision, identity, or world truth.
13. Event-pattern classification, learned action-schema recognition, and event-role inference are separate, independently intervenable claims.
14. Every input to the rope-skipping-pattern conjunction is definitionally necessary and belongs to the same observer/event-file/detection window/rule context.

Accepted negative controls are `TruthActionCopy`, `TruthEventTypeCopy`, `SharedTruthPerceptualEventFacetId`, `ContinuantFacetOnEventFile`, `EventFacetOnContinuantFile`, `ActionAsContinuantBinding`, `FabricatedActionContinuant`, `MissingEventFeatureAsFalse`, `MissingEventClassificationAsFalse`, `UnknownEventClassification`, `CrossWindowNegativeFeature`, `ImplicitFacetHierarchy`, `DuplicateEventFacetAuthority`, `DuplicateEventFacetAssertion`, `EventClassificationOrdinalPsychology`, `TruthCorrectedEventClassification`, `EventClassificationToRecognitionIdentity`, `EventClassificationToPressure`, and `LLMEventClassifier`.

### Scope boundary

Version 0.1 accepts deterministic classification of one controlled rope-skipping-pattern fixture plus two coarse event-pattern facets. It does not claim general action recognition, intent inference, success/failure interpretation, causal attribution, nested event structure, temporal scripts, affordance recognition, linguistic action description, probabilistic classification, or learned action-schema identity. The historical direct action key remains a required comparison control, not an accepted character-evidence representation.

## Accepted subdecision `SEM-001F` — append-only continuant-instance recognition resolutions

**Status:** accepted 2026-09-02 through executable `CV-SEM-061..070`; symbolic candidate identities only, with permanent canonical IDs still blocked by the parent `SEM-001`

### Purpose and scope

Accepted `SEM-001A..E` can preserve an observer-relative continuant-file, its appearance, and its event participation without deciding which known individual thing the observer believes it to be. `SEM-001F` supplies the minimum deterministic recognition layer required by `PHEN-SEM-001`:

```text
perceptual continuant-file
  ≠ continuant appearance classification
  ≠ known semantic candidate
  ≠ truth identity
```

This subdecision covers continuant-instance recognition only:

```text
PerceptualReferentId
  → candidate person / discrete object / place-or-region identity
```

It does not recognize event-files as learned action schemas. A later seam must separately define:

```text
PerceptualEventReferentId
  → candidate SemanticActionReferentId
```

The separation prevents `AppearsRopeSkippingPatternLike` from becoming `action.skip_rope` merely because their authored meanings are associated.

### Recognition candidates are character-available propositions, not truth reads

`CandidateSemanticReferentId` names the semantic identity proposed by the hypothesis. It may equal the simulator's truth identity when recognition happens to be correct, but the recognition transition cannot obtain it from world truth, event bindings, an omniscient trace join, or stable secret-handle equality.

Every eligible candidate must resolve through the observer's retained `RecognitionCandidateCatalog`, defined as the semantic referent identities this observer's current recognition machinery is permitted to consider. It is not the truth registry, proof that a candidate exists, familiarity magnitude, recognition strength, relationship state, or a permanent authored character fact. The initial fixture seeds governed candidates for known people and objects; acquisition and forgetting of catalog entries remain later memory/learning concerns.

```text
RecognitionCandidateCatalogEntry = {
  ObserverId,
  CandidateSemanticReferentId,
  CandidateDomain,
  RecognitionTemplateIds[],
  CatalogEntryVersion
}

CandidateDomain = Person | DiscreteObject | PlaceOrRegion

ObserverIdentitySymbolMapping = {
  ObserverSymbolCandidateMappingId,
  ObserverId,
  PerceivedIdentitySymbolId,
  CandidateSemanticReferentId,
  MappingVersion
}
```

Accepted `SEM-001I.1` classifies both shapes as observer-owned character state. Catalog entries are uniquely keyed by `(ObserverId, CandidateSemanticReferentId)`. Symbol mappings store a run-scoped typed `ObserverSymbolCandidateMappingId`; a cue cites that exact mapping occurrence. The symbolic oracle's string-concatenated mapping ID is not canonical. At most one active mapping exists for an observer/symbol pair, and replacement allocates a fresh mapping occurrence so historical cue provenance cannot be reinterpreted.

Catalog order, candidate-ID encoding, and template-ID encoding have no priority, familiarity, similarity, confidence, salience, or psychological magnitude. A candidate being present in the catalog means only that recognition may consider it. `CandidateDomain` classifies the candidate; it cannot inspect or filter the truth kind of the tracked entity. Any compatibility rule involving perceived appearance requires a separately governed observer-evidence derivation.

### Typed permitted recognition cues

The proposed fixture uses already-governed, character-accessible cue evidence rather than face-recognition prose or truth identity:

```text
PermittedRecognitionCueEvidence = {
  RecognitionCueEvidenceId,
  ObserverId,
  PerceptualReferentId,
  CandidateSemanticReferentId,
  RecognitionCueKind,
  CuePolarity,
  RecognitionTemplateId?,
  SupportingExperienceEvidenceRefs[],
  OccurredAt,
  TransformationVersion
}

RecognitionCueKind
  = RetainedTemplateMatch
  | IdentityClaimMapping

CuePolarity
  = SupportsCandidate
  | ContradictsCandidate
```

`SupportingExperienceEvidenceRef` is a closed tagged union over observer-safe records actually available in the named pre-recognition experience: continuant-classification evidence, perceived-binding evidence, or permitted supporting observation. It is not a generic string/opaque-ID bag. A retained template reference must resolve in the observer's candidate catalog.

An observed spoken or written identity claim cannot inject a semantic candidate. `IdentityClaimMapping` requires both a perceived identity-bearing symbol and an observer-owned governed symbol→candidate mapping. Thus “I am Glen” or a `GLEN` tag can support `person.glen` only when the observer already has that mapping. Without it, the signal remains an observed claim/symbol. A future genuinely self-authenticating channel requires its own explicit contract.

Cue creation is itself governed and deterministic. Continuous vision, learned embeddings, approximate matching, and threshold mathematics remain outside this symbolic fixture. A future matcher must replace the fixture cue provider through an exact versioned contract; an LLM or prose judgment cannot be authoritative.

Absence of a cue means unresolved evidence. It is not `ContradictsCandidate`. Contradiction requires an explicit permitted negative cue record.

### Exact initial recognition rule

```text
RecognitionRuleDefinition = {
  RecognitionRuleId,
  PermittedCueKinds[],
  OutputCandidateDomains[],
  DerivationFunctionId,
  RuleVersion
}

RecognitionRuleResult
  = NoUpdate
  | AssertUniqueCandidate(CandidateSemanticReferentId)
  | WithdrawCurrentResolution
```

For one observer, experience, and continuant-file, the initial `UniqueUncontradictedSupport` rule evaluates every catalog-eligible candidate represented in the cue set:

```text
qualifies(candidate)
  := at least one SupportsCandidate cue
     AND no ContradictsCandidate cue

exactly one qualifying candidate different from current
  → AssertUniqueCandidate(candidate)

current candidate explicitly contradicted
AND no unique replacement candidate
  → WithdrawCurrentResolution

otherwise
  → NoUpdate
```

Every governed attempt emits an immutable trace-side `RecognitionEvaluation`, including `NoUpdate`. Initial unfamiliarity, missing evidence, and ambiguity emit no resolution record but remain distinguishable through the evaluated cue set and exact result reason. Later lack of useful cues does not withdraw an existing recognition. Withdrawal requires explicit contradiction of the current candidate with no unique replacement. Same-candidate reevaluation emits no duplicate resolution but remains traceable as an evaluation.

Version 0.1 stores no `Unknown` candidate, fallback candidate, numeric confidence, similarity score, ranking, or arbitrary tie-break. `Withdrawn` is a recognition-state transition, not a fake entity identity. A uniquely asserted but objectively wrong candidate is a genuine misrecognition. “Correct” and “incorrect” are omniscient comparison labels, never character-accessible resolution fields.

For the existing phrase “confident misrecognition,” version 0.1 proves only categorical commitment: the rule emitted one unique candidate rather than remaining unresolved. It does not claim or manufacture a graded confidence magnitude. If later phenomena require tentative versus committed recognition or calibrated confidence, that representation and its update mathematics must be added explicitly.

Every cue in one evaluation must share observer, `PerceptualReferentId`, applicable experience/observation window, and rule context. Cue reuse from another track or historical window fails rather than silently influencing the current hypothesis.

### Immutable evaluation and recognition-resolution chain

```text
RecognitionEvaluation = {
  RecognitionEvaluationId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  RecognitionRuleId,
  EvaluatedRecognitionCueEvidenceIds[],
  PriorRecognitionResolutionId?,
  Result: NoUpdate | AssertUniqueCandidate(...) | WithdrawCurrentResolution,
  OccurredAt,
  RecognitionVersion
}

RecognitionResolutionRecord = {
  RecognitionResolutionId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  Resolution: AssertedCandidate(CandidateSemanticReferentId) | Withdrawn,
  RecognitionRuleId,
  EvaluatedRecognitionCueEvidenceIds[],
  RevisesRecognitionResolutionId?,
  OccurredAt,
  RecognitionVersion
}
```

Accepted `SEM-001I.1` refines the persistent character-state shape: `RecognitionEvaluation` is stored exactly once in committed trace, while `RecognitionResolutionRecord` is self-sufficient continuation state and therefore carries no `RecognitionEvaluationId`. The omniscient trace owns the evaluation→resolution provenance edge. This avoids duplicated evaluation history and prevents character continuation from requiring trace dereference.

`RecognitionEvaluationId` identifies every governed evaluation, including `NoUpdate`. `RecognitionResolutionId` is allocated only when categorical recognition changes through assertion, replacement, or withdrawal. Both are run-scoped immutable occurrences; neither is derived from observer, track, candidate, truth identity, evidence, collection order, or display data; neither is reused; both roll back atomically; and neither carries semantic or psychological magnitude.

The first resolution for one track has no revision link. A later different candidate or withdrawal cites the current terminal resolution. The prior resolution, every evaluation, and every source experience remain byte-identical. Revision links remain within one observer and continuant-file and form one acyclic nonbranching chain. A same-candidate reevaluation emits no duplicate resolution; evidence reinforcement belongs to later belief/memory seams.

The current recognition view is a deterministic projection of the terminal resolution, not mutation of historical evidence:

```text
AssertedCandidate(candidate) → currently recognized as candidate
Withdrawn                    → currently unresolved
```

False tracking remains untouched:

```text
false continuity:
  one track may revise person.glen → person.darius → Withdrawn
  without splitting the track

false discontinuity:
  two tracks may independently assert person.glen
  without merging either track
```

Truth comparison never creates, revises, withdraws, merges, or repairs a recognition resolution.

### Authority and output boundary

One `ModelIdentity` has exactly one authoritative recognition rule for the initial continuant-instance recognition domain. Missing or duplicate authority fails registry closure. Competing scientific rules require competing model identities.

Recognition may read only the immutable pre-recognition experience, observer-owned active or retained continuant-file identity, the observer's candidate catalog/templates and symbol mappings, prior resolution history for that same observer, and typed permitted recognition cues. It may emit only trace-side `RecognitionEvaluation`, append-only `RecognitionResolutionRecord`, and their derived current-recognition view.

It cannot directly mutate perceptual tracks, event-files, experience, classification, belief, memory, person model, relationship, appraisal, affect, motive, pressure, Reason, option, identity evidence, or world truth. Those consumers require later capability-limited seams. Recognition does not prove the candidate is true.

### Accepted invariants and controls

1. Continuant-instance recognition attaches only to `PerceptualReferentId`; event/action recognition remains a different seam.
2. A candidate is eligible only through observer-owned catalog state; identity claims additionally require an observer-owned symbol→candidate mapping.
3. Truth identity, event bindings, trace joins, and secret-handle equality cannot supply a candidate.
4. Cue evidence is typed, observer-safe, experience/window-scoped, canonical, and executable.
5. Missing cue evidence is unresolved, not contradiction.
6. Exactly one uncontradicted supported candidate emits an assertion; zero or several emit no initial resolution.
7. Unfamiliarity is absence of a resolution, not an `Unknown` identity record.
8. Objective correctness is absent from character-accessible resolution data.
9. Explicit contradiction of the current candidate with no unique replacement appends `Withdrawn`; mere missing evidence does not.
10. Correction appends a same-observer/same-track resolution revision and never rewrites history.
11. Recognition revision cannot merge, split, end, or truth-correct perceptual tracks.
12. Evaluation/resolution and candidate ordinals, registry order, and display order have no psychological magnitude or priority.
13. One model has one authoritative recognition rule for the governed domain.
14. Recognition cannot bypass later belief, memory, relationship, appraisal, or action-schema seams.

Accepted negative controls are `TruthIdentityCandidateInjection`, `OpaqueTruthHandleRecognition`, `UnmappedIdentityClaimInjection`, `CandidateDomainTruthFilter`, `CatalogOrderPriority`, `CandidateOrdinalSimilarity`, `TrackOrdinalRecognitionScore`, `UnknownCandidateSentinel`, `MissingCueAsContradiction`, `MissingCueWithdraws`, `AmbiguousFirstCandidateWins`, `CrossTrackCueReuse`, `CrossWindowCueReuse`, `RecognitionRewrite`, `TruthCorrectedRecognition`, `RecognitionMergesTracks`, `CrossObserverRevision`, `CrossTrackRevision`, `RevisionBranch`, `RevisionCycle`, `DuplicateRecognitionAuthority`, `RecognitionToBeliefMutation`, `RecognitionToRelationship`, `RecognitionToPressure`, `EventFileAsInstanceRecognitionCarrier`, `EventPatternToActionIdentity`, and `LLMRecognition`.

### Accepted disposition

Initial unfamiliarity and ambiguity remain `NoUpdate` with no resolution record. `UniqueUncontradictedSupport` is the exact controlled oracle. Correction supports candidate replacement and evidence-required withdrawal. The observer-owned catalog is the candidate permission boundary. Identity-bearing claims require an observer-owned symbol→candidate mapping. Recognition remains continuant-instance-only; learned action-schema recognition is deferred.

## Accepted subdecision `SEM-001G` — character-accessible evidence admissibility and causal-role provenance

**Status:** accepted 2026-09-02 through executable `CV-SEM-071..080`; symbolic record/reference identities only, with permanent canonical IDs still blocked by the parent `SEM-001` and exact phases subsequently fixed by accepted `SEM-001H`

### Governing boundary

Character-accessible provenance contains only relationships the character is permitted to exploit. Omniscient provenance may contain complete causal ancestry. The engine's ability to join two records does not grant cognition permission to discover, compare, or traverse that join.

Evidence is not an intrinsic flag on a fact or record. For record `R` to be admissible evidence for consuming transition `M`, all of the following must hold:

1. `R` is an authoritative typed observer-safe record occurrence;
2. `R` was produced through an accepted epistemic seam and exact admitted schema version;
3. `R`'s character projection contains no forbidden truth linkage;
4. `M`'s registered `ReadDomain` permits that exact record/reference type and producing seam; and
5. `R` satisfies `M`'s same-observer, temporal/window, modality, feature-scope, carrier, and applicability constraints.

Therefore `character-accessible` does not mean `universally admissible evidence`. A classification legitimately present in an experience cannot enter appraisal, motive, pressure, or another consumer unless an accepted intervening seam gives that transition an exact typed read capability. Interpretive conclusions belong to the seam that owns the interpretation.

### Three identity classes

1. **Character-semantic/co-reference identities.** Equality of `PerceptualReferentId` means the perception process treated observations as one continuant-file. Equality of `PerceptualEventReferentId` means it treated records as one event-file. A governed recognition candidate such as `person.glen` may enter character state through an accepted recognition/catalog boundary and compare equal across permitted character records. It remains incapable of traversing truth entity state, truth bindings, or omniscient trace merely because a truth registry uses the same symbol.
2. **Observer-safe occurrence identities.** Observation, feature, binding, classification, recognition-cue/resolution, and causal-role evidence IDs identify one immutable observer-side record occurrence. They may be cited when the consumer's narrow `ReadDomain` permits it. Their ordinals, hashes, order, allocation distance, and numeric difference have no semantic, temporal-distance, familiarity, salience, similarity, or psychological magnitude. Equal content observed again creates a fresh occurrence rather than recycling the old ID as a grouping key.
3. **Trace-only/truth identities.** Truth `WorldEventId`, scheduler `EventId`, `EventBindingId`, pre-projection truth `SemanticReferentId`, truth fact/source handles, mutation/trace nodes, and omniscient derivation edges remain outside character provenance. Hashing, encrypting, UUID-wrapping, renaming, or preventing dereference does not make them safe: stable equality, reuse, order, cardinality, prefix, hash, or allocation pattern can itself leak forbidden relationships.

### Closed reference grammar

The candidate symbolic grammar is:

```text
CharacterEvidenceRef
  = ObservationEvidenceRef(ObservationId)
  | ContinuantFeatureEvidenceRef(FeatureObservationId)
  | EventFeatureEvidenceRef(EventFeatureObservationId)
  | PerceivedBindingEvidenceRef(PerceivedBindingId)
  | ContinuantClassificationEvidenceRef(ClassificationEvidenceId)
  | EventClassificationEvidenceRef(EventClassificationEvidenceId)
  | RecognitionCueEvidenceRef(RecognitionCueEvidenceId)
  | RecognitionResolutionEvidenceRef(RecognitionResolutionId)
  | CausalRoleEvidenceRef(CausalRoleEvidenceId)
```

There is no `OpaqueId`, `GenericEvidenceId`, `AnyRecordId`, `TraceNodeId`, untyped string, or map variant. This union is the finite universe of record classes that can be admitted by this contract version, not a universal capability. Every consumer declares a narrower sub-union and exact schema/seam versions in its `ReadDomain`. Adding a future evidence record class requires a versioned closed-union extension and new closure vectors.

`PerceptualReferentId`, `PerceptualEventReferentId`, recognized semantic identity, and `ExperienceId` are not members merely because they may be character-accessible. They supply carrier, co-reference, or envelope scope; they do not alone prove a feature, identity, role, threat, or appraisal proposition.

Safety belongs to the referenced record's audited schema and version, not merely its ID type. In particular, `PresentObservation` and `SafeSourceReferences` from the restricted `observation/0.1-candidate` control are not automatically admitted into general provenance. A consumer may cite an `ObservationId` only when the resolved target schema is explicitly accepted as observer-safe for that `ReadDomain`.

### Linkability, ownership, and time

Persistent observer-relative semantic identities may compare equal across experiences because their accepted meaning is co-reference. Observer-safe occurrence IDs may be cited historically only when that evidence type and consumer explicitly permit historical use. A new assertion in a later experience always receives a new occurrence ID even when carrier, facet, and value are equal; explicit carrier/facet fields provide the semantic connection.

Version 0.1 requires strict same-observer evidence ownership. Future testimony or communication creates a new receiver-owned evidence record through its own epistemic seam rather than exposing another observer's provenance graph directly. No future record may be cited. Same-window and same-experience consumers enforce exact scope; cross-window reuse requires a separately accepted retained representation rather than silent reuse of a transient cue.

Two character records may expose that they share `ObservationId/42` only when both explicitly cite that admitted observer-safe occurrence. If both descend from one hidden truth source but no safe common record was projected, character provenance contains no equality token for that ancestry.

### Evidence quality and the interpretation ladder

Evidence availability and evidence quality are separate. This candidate proves safe references using exact categorical fixtures; it does not reduce observation to a global `Visible(entity)`/`Hidden(entity)` bit or one shared confidence scalar. Access is observer-, channel-, modality-, feature-, carrier-, and condition-relative. Missing evidence is absence, never implicit negative evidence or contradiction.

Future evidence schemas may carry exact governed intervals, precision, resolution, bounded uncertainty, reliability, feature strength, or recognition confidence when their owning seams prove the mathematics. Uncertainty stays as close as possible to the uncertain proposition. No generic `confidence: number` belongs in this provenance contract, and certainty about person-like appearance need not equal certainty about identity.

The required semantic ladder remains:

```text
observation evidence
  → perceptual feature/classification evidence
  → recognition evaluation/resolution
  → retained belief/memory/person/relationship state
  → appraisal
```

Later interpretation may cite permitted source evidence but cannot be back-projected into or treated as a property of that source. Better distance, lighting, occlusion, capability, or attention normally changes feature-specific evidence availability/quality; it does not directly create an arbitrary recognition bonus. Exact physical-to-sensory production mathematics belong to their observation contracts, not `SEM-001G`.

### Character-relative causal-role evidence

`EventRoleEvidence` answers which structural event relation perception supported. `CausalRoleEvidence` answers which analytical/causal relevance an executable character-side rule derived from permitted evidence. They occupy separate typed namespaces and neither rewrites the other.

```text
CausalRoleEvidence = {
  CausalRoleEvidenceId,
  ExperienceId,
  ObserverId,
  PerceptualEventReferentId,
  PerceptualReferentId,
  CausalRoleId,
  CausalRoleDerivationRuleId,
  SupportingEvidenceRefs[],
  OccurredAt,
  TransformationVersion
}
```

The initial domain is one observer-relative continuant's analytical role in one observer-relative event; arbitrary event→event causality is deferred. The executable fixture rule maps exact observer-side event-role evidence to a finite causal-role claim. Unresolved role evidence emits no claim. Zero or several different roles may coexist; “one winning role” is not an ontology invariant. Within one experience/event-file/continuant/rule, duplicate claims for the same `CausalRoleId` consolidate their canonical binding support into one occurrence. Causal-role evidence cannot support another causal-role record in v0.1, so recursive/cyclic character provenance is structurally impossible. One model has exactly one authoritative derivation rule for this initial domain.

The rule reads no truth binding, truth referent, hidden outcome structure, truth causal role, or omniscient trace. Holding its admitted observer evidence fixed while changing hidden truth leaves its output identical. Changing admitted evidence may change output according to the governed rule.

### Separate graphs and validation

The omniscient derivation graph records complete truth→observation→tracking/event-file→binding/classification→experience→recognition/causal-role ancestry, actual reads, objective mismatch, rules, mutation, and transition provenance. Character-accessible provenance is a separately constructed graph consisting only of explicit admitted references physically present in observer-side records. It is not a filtered runtime query over the omniscient graph.

Character code has no general `GetSource`, `GetParents`, `TraceBack`, or `FindCommonAncestor` operation. Research/debug tooling may traverse omniscient trace. Character transitions may resolve only their explicit typed references through registered narrow `ReadDomain`s.

Every character evidence reference validates exact variant, target existence, admitted schema and epistemic seam, same observer, temporal/window legality, carrier/applicability, producing-before-consuming hook, target closure, consuming `ReadDomain`, canonical uniqueness, and ordinal opacity. Exact phase IDs are supplied by `SEM-001H`; `SEM-001G` establishes the mandatory validation hook. Any failure aborts the complete instant under Campaign 0 transaction semantics.

The historical `PerceivedConceptToken = (ConceptId, CausalRoleId, VisibleProvenanceSlotId)` is permanently labeled `CONTROL-SEM-LEGACY-CONCEPT-TOKEN`. It is admissible only in a declared comparison fixture where the channel establishes concept identity, one causal-role abstraction suffices, multi-role/recognition ambiguity is irrelevant, and the visible slot leaks no hidden linkage. It is not a fallback production representation.

Accepted negative controls include `GenericEvidenceId`, `EvidenceIdentityAsProof`, `UnadmittedObservationSchema`, `OpaqueTruthHandle`, `HashedTruthHandle`, `CrossObserverEvidenceReference`, `CrossWindowCueReuse`, `FutureEvidenceReference`, `GlobalVisibilityBit`, `MissingAsNegativeEvidence`, `SharedConfidenceScalar`, `ClassificationToPressure`, `CharacterTraceBack`, `HiddenCommonAncestorToken`, `OccurrenceIdAsGroupingKey`, `RecursiveCausalRoleEvidence`, `DuplicateCausalRoleClaim`, `TruthCausalRoleCopy`, and unrestricted legacy concept-token use.

## Accepted subdecision `SEM-001H` — exact two-lane semantic phase placement

**Status:** accepted 2026-09-02 through executable `CV-SEM-081..090`; phase registry `ordering-phases/2-candidate`

### Exact phase map

| Phase | Registered boundary |
|---:|---|
| 10 | current-lane sensory observation and conditional `ExperienceId` reservation |
| 11 | current continuant tracking and event-file segmentation |
| 12 | current perceived bindings plus continuant/event feature evidence |
| 13 | independent current continuant and event-pattern classification |
| 14 | freeze/stage immutable current `SemanticExperience` |
| 15 | current experience-scoped companion `CausalRoleEvidence` |
| 20 | freeze current recognition inputs/cues and permitted retained-state projection |
| 21 | current recognition evaluation/resolution |
| 30 | belief/person-model application; same-instant recognition consumption remains `ORD-001`-controlled |
| 110 | attempt execution and authoritative world outcome |
| 120 | consequence-lane sensory observation and conditional `ExperienceId` reservation |
| 121 | consequence continuant tracking and event-file segmentation |
| 122 | consequence perceived bindings plus continuant/event feature evidence |
| 123 | independent consequence continuant and event-pattern classification |
| 124 | freeze/stage immutable consequence `SemanticExperience` |
| 125 | consequence experience-scoped companion `CausalRoleEvidence` |
| 126 | freeze consequence recognition inputs/cues and permitted retained-state projection |
| 127 | consequence recognition evaluation/resolution |
| 130 | character-relative outcome evaluation and `LearningEvidence` production |
| 140 | consolidation plus separately governed automatic adaptation/persistent mutation |
| 150 | non-schedulable settlement sentinel: quiescence, final trace/invariant validation, atomic commit |

Unused numeric gaps are reserved expansion space. They carry no simulated duration, causal strength, salience, or implicit read permission.

### Lane-entry truth cutoffs

Each observation lane consumes only authoritative or earlier-phase staged truth/state available strictly before its registered lane-entry boundary. The current lane may inspect state/truth available before phase 10. The consequence lane may inspect the phase-110 authoritative outcome and other state legally available before phase 120. Truth first produced at phase 10 or 120 cannot restart that same lane, and later same-instant truth cannot schedule backward into an earlier observation subphase. It waits for the next registered observation opportunity unless a future contract adds another lane.

This cutoff is separate from evidence permission: availability before the boundary does not itself authorize an observation. The producing observation transition still requires its exact observer/channel/feature `ReadDomain` and affordance.

### Conditional experience reservation and staging

The lane-entry observation first determines whether it will emit any character-accessible evidence. If not, it allocates no `ExperienceId`. If so, it reserves exactly one opaque run-scoped candidate `ExperienceId` transactionally. That ID may be cited by later lane records before envelope assembly. A successful instant must stage exactly one immutable `SemanticExperience` at phase 14/124 for every reservation; orphan reservations and duplicate envelopes fail closure. Current and consequence lanes receive distinct IDs even when they continue the same continuant/event-files. Empty experiences are not admitted accidentally and require a future explicit phenomenon/contract.

Phase 14/124 freezes and stages rather than commits. Earlier-phase staged records are readable by later phases only through declared capabilities. Every record, reservation, allocator advance, trace edge, and output becomes durable together only after successful whole-instant quiescence and validation; any later failure restores the pre-instant state exactly.

`CausalRoleEvidence` at phase 15/125 is a separately identified companion record sharing `ExperienceId`, never a field added to or a mutation of the frozen envelope. Its accepted v0.1 rule reads pre-recognition binding evidence only. A future identity-dependent causal interpretation must append a distinct later record under another contract rather than backdating or rewriting this one.

### Classification and recognition snapshots

Continuant and event-pattern classifiers share phase 13/123 because neither consumes the other's output. Work is scheduled canonically by classification domain, observer, carrier, rule, and canonical tie-break. This order determines replay-stable execution/occurrence allocation only; same-phase order creates no causal or read edge. Any future classifier dependency requires a later registered phase.

Phase 20/126 freezes one immutable recognition input projection containing the exact experience evidence, observer candidate catalog, templates/mappings, cues, prior applicable resolution, and other explicitly permitted retained state. Phase 21/127 evaluates only that projection. Consequence recognition may cite the current-lane resolution and append a replacement or withdrawal on the same track. It cannot rewrite the phase-21 record or its input snapshot.

### Outcome learning and adaptation separation

Phase 130 character-relative outcome evaluation consumes permitted intent/expectation, consequence `SemanticExperience`, consequence recognition, and other permitted character state. It cannot read the phase-110 authoritative world outcome merely because that truth occurs earlier. Character learning proceeds through perceived consequence → evaluation → `LearningEvidence`.

Truth-side physiological/regulatory exposure or valid practice may separately feed automatic adaptation around phase 140. That route writes only its registered adaptation state and cannot masquerade as character `LearningEvidence`. Shared timing does not collapse their epistemic or mutation authorities. Independent phase-140 transitions likewise gain no same-phase cross-read permission; a genuine dependency requires a later phase.

### Settlement barrier and unresolved policy

Phase 150 is present in the registry as a settlement sentinel but is not schedulable by domain events. After all legal same-instant events through phase 140 drain to quiescence, the scheduler performs final state, event, trace, and invariant validation and then atomically commits. No transition executes “at” the barrier or schedules work after entering it. Validation failure rolls back the entire instant.

The fact that phase 21 precedes phase 30 proves temporal availability only. It does not authorize phase-30 belief/person-model mutation from same-instant recognition. `ORD-001` remains the sole owner of that policy. `SEM-001H` likewise does not settle simultaneous multi-character ordering (`ORD-002`) or appraisal/regulation feedback (`ORD-005`).

Accepted negative controls include `LateTruthReopensCurrentLane`, `LateTruthReopensConsequenceLane`, `ConsequenceSchedulesBackwardRecognition`, `NoEvidenceOrphanReservation`, `DuplicateExperienceEnvelope`, `SharedCurrentConsequenceExperienceId`, `CausalRoleMutatesExperience`, `ClassifierCrossRead`, `MutableRecognitionInput`, `RecognitionRewritesPrior`, `AuthoritativeOutcomeToLearningEvidence`, `AdaptationAsCharacterLearning`, `OrderingImpliesBeliefPermission`, and `SchedulableSettlementBarrier`.

## Semantic purpose

Preserve the semantic argument structure of a world event while projecting only what one observer could discriminate. The output describes character-accessible binding and typed classification evidence before recognition. It must support unfamiliar referents, partial classification, perceptual tracking, misrecognition, later correction, one referent in several roles, and different observers receiving different evidence without exposing simulator identity.

This seam distinguishes:

```text
the simulator bound person.glen to Companion

from

Mina perceived a person-like referent in the Companion role

from

Mina later hypothesized that referent was person.glen
```

It also distinguishes five semantic layers:

```text
World semantic classification
≠ event role in this occurrence
≠ observer-relative perceptual classification
≠ instance-recognition hypothesis
≠ character-relative appraisal
```

Perceptual classification, perceptual tracking, and instance recognition are independent. “This appears to be a metal object,” “this is the same object I was following,” and “this is object.lead_pipe” are three different claims with separate provenance.

## Required phenomena

- `PHEN-SEM-001` observer-relative event bindings and recognition boundary;
- the semantic-binding and identity portions of `PHEN-EPI-001`;
- later recognition, memory, social-belief, relationship, and reason fixtures that consume the shared referential grammar;
- replay and forbidden-read portions of `PHEN-DET-001`.

## Domain and codomain

Candidate truth-side records:

```text
WorldEventTruth = {
  WorldEventId,
  EventTypeId,
  OccurredAt,
  EventBindings[]
}

EventBinding = {
  EventBindingId,
  EventRoleId,
  SemanticReferentId
}

RegisteredSemanticFacetDefinition = {
  SemanticFacetId,
  ValueTypeId,
  ApplicabilityDomain,
  DefinitionVersion
} // unresolved truth-side parent shape; consumer access belongs to receiving read domains
```

Each binding has its own identity. `SemanticReferentId` is a stable typed truth-side identity governed by content or runtime entity registries. It is not automatically character knowledge.

Candidate observation-side records:

```text
PerceivedBindingEvidence = {
  PerceivedBindingId,
  ObserverId,
  PerceptualEventReferentId,
  PerceptualReferentId,
  EventRoleEvidence,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

EventRoleEvidence = ExactEventRole(EventRoleId) | UnresolvedEventRole

PerceptualTrackTransition = {
  ObserverId,
  PriorPerceptualReferentId?,
  CurrentDetectionId,
  ContinuityKind: NewTrack | ContinuesPriorTrack,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

PerceptualTrackEnd = {
  ObserverId,
  PerceptualReferentId,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

PerceptualClassificationEvidence = {
  ClassificationEvidenceId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  PerceptualFacetId,
  TypedPerceivedValue,
  ClassificationRuleId,
  SupportingFeatureObservationIds[],
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

PreRecognitionSemanticExperience = {
  ExperienceId,
  ObserverId,
  OccurredAt,
  PerceptualEventReferentIds[],
  PerceivedBindings[],
  PerceptualClassifications[],
  PerceptualEventClassifications[],
  SupportingObservationIds[],
  TransformationVersion
}
```

`SupportingObservationIds` refer to permitted character-accessible evidence such as a bounded measurement. Scalar measurement is not mandatory for every binding and is never collapsed into referent identity or role evidence.

`PerceptualTrackTransition` is perception-seam transition provenance, not automatically a `SemanticExperience` field. `CurrentDetectionId` is observer-side sensory identity and may not contain, hash, or alias a truth referent. The initial candidate makes a deterministic binary continuity decision only; it has no confidence or uncertain-continuity field.

`PerceptualClassificationEvidence` is a positive or explicitly false assertion about appearance, not an unrestricted string tag. `NoAssertion` creates no record and remains unresolved. Explicit false is a present typed assertion supported by negative feature evidence. `PerceptualFacetId` resolves through a governed boolean definition; each model supplies exactly one authoritative rule per facet. Consumer access belongs to receiving seam read domains. The initial vocabulary distinguishes person-like, discrete-object-like, interior-space-like, metallic, elongated, and blunt appearance. Full ontology inheritance, facet implication, affordance closure, and world-simulation consumption belong to `ONT-001`, not this contract.

Accepted `SEM-001F` defines a downstream continuant-instance recognition evaluation and append-only resolution that refer to, but never replace, a `PerceptualReferentId`:

```text
RecognitionEvaluation = {
  RecognitionEvaluationId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  RecognitionRuleId,
  EvaluatedRecognitionCueEvidenceIds[],
  PriorRecognitionResolutionId?,
  Result,
  OccurredAt,
  RecognitionVersion
}

RecognitionResolutionRecord = {
  RecognitionResolutionId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  Resolution: AssertedCandidate(...) | Withdrawn,
  RecognitionRuleId,
  EvaluatedRecognitionCueEvidenceIds[],
  RevisesRecognitionResolutionId?,
  OccurredAt,
  RecognitionVersion
}
```

Version 0.1 has no numeric uncertainty representation. Zero or ambiguous qualifying candidates produce a traceable `NoUpdate`; a unique uncontradicted supported candidate produces an assertion; explicit contradiction of the current candidate without a unique replacement produces `Withdrawn`. Resolution changes form an immutable same-track revision chain.

No permanent numeric record type, role, or enum IDs are allocated while `SEM-001` remains open.

## Units, ranges, and applicability

Bindings and classification assertions are symbolic and exact. `EventBindingId`, `PerceivedBindingId`, and `ClassificationEvidenceId` have stable typed identity within their declared scope. `PerceptualReferentId` has the observer-scoped continuant-file identity fixed by amended `SEM-001A`. Every perceived facet value must match its registered semantic type exactly. The initial fixture covers persons, actions, locations, and instruments with exact-or-unresolved perceived event roles and a finite registered classification vocabulary. Probabilistic classification, uncertain continuity, continuous sensory geometry, language understanding, ontology inheritance, and recognition confidence are outside version 0.1 unless later specified exactly.

## Registered ReadDomain and capability-limited projection

The truth-to-perception compiler may read only the named world event, observer-specific sensor/attention inputs, registered observation affordances, registered semantic-facet definitions, and supporting permitted measurements. It may not copy a truth-side semantic fact merely because it is registered, and it may not read the observer's memories, beliefs, person model, recognition result, or appraisal while constructing pre-recognition experience.

Recognition consumes `SemanticExperience`, retained character state, and its own registered evidence projection. It cannot read truth-side `SemanticReferentId` or `EventBinding` merely because the omniscient trace can.

## Actual-read recording and derived-input provenance

The omniscient committed trace records exact truth bindings, actual observation reads, the output perceived-binding records, and their structural derivation. Character-accessible evidence records contain only observer-safe evidence identities admitted under `SEM-001G`; the ability to resolve one reference is always a property of the consuming transition's exact typed `ReadDomain`, not a universal property of the record.

An opaque truth identifier is not automatically safe. Equality, reuse, ordering, or cardinality of an opaque handle can reveal hidden linkage. A truth-side source binding therefore remains in trace rather than the character payload unless a later contract proves that every observable property of the handle is permitted evidence.

## Authoritative StatePatch writes and sole MutationAuthorityId

The initial projection writes no persistent belief, memory, relationship, or identity state. It emits immutable event-local `PerceivedBindingEvidence` and `SemanticExperience`. Recognition and later encoding own separate state transitions and mutation authorities.

The perception seam is the sole authority for active perceptual continuant-files and the observer-scoped next-track-sequence map. Starting or continuing a track stages one `PerceptualTrackTransition`; only `NewTrack` advances that observer's sequence. The complete map and active tracks are authoritative save/load state. Whole-instant failure restores them structurally exactly.

## Epistemic permissions and forbidden knowledge

Permitted before recognition:

- a stable perceptual referent scoped by the accepted allocation rule;
- exact or unresolved event-role evidence supported by observation;
- typed perceptual-classification evidence supported by observation;
- permitted sensory/measurement evidence references;
- observer, time, and transformation identity.

Forbidden before recognition:

- truth-side `SemanticReferentId` solely because the simulator knows it;
- hidden event bindings or truth-side causal classifications;
- character-relative `Cause`, `Instrument`, or other causal-role claims unsupported by permitted evidence;
- linkable truth handles whose equality reveals hidden identity;
- truth-side semantic classifications that were not perceptually established;
- unrestricted freeform tags or facet values that violate their registered type;
- authored character-relative meaning, appraisal, trust, salience, or psychological value;
- authoritative prose or an LLM interpretation.

A direct symbolic identity may cross only through a separately registered channel whose observable signal itself establishes that identity. This is a named special case, not the default visual-perception rule.

## Preconditions

- every truth binding has a unique `EventBindingId`;
- event roles and referents resolve through governed registries;
- every semantic facet resolves to a governed definition with an exact value type and receiving-seam permissions;
- role multiplicity and qualifier rules are declared by the event type;
- observer-specific observation affordances are registered;
- all supporting observation records satisfy their own accepted contracts;
- character-relative causal roles cite only permitted evidence.

## Totality, typed failures, instant rollback, and failed-run behavior

Unknown registry references, duplicate binding/classification IDs, illegal role multiplicity, forged perceptual IDs, nonmonotonic/reused/wrong-observer track sequences, truth-derived detection IDs or continuity decisions, hidden truth IDs or unobserved truth facets in character output, illegal source links, wrong-typed or freeform facet values, unsupported causal-role derivation, and noncanonical collections fail before emission. The accepted whole-instant transaction rolls back state, queue, observer-scoped track allocators, trace, and outputs.

## Exact transformation

For each truth binding, the registered observation mechanism independently determines whether any binding evidence is available. A visible binding creates a new `PerceivedBindingId` and points to the continuant-file selected by a `PerceptualTrackTransition`; it never copies the truth referent by default. Role evidence is emitted only to the precision supported by the observation mechanism. Observation may preserve the exact role, coarsen a narrower involved-entity role to `Participant`, emit `UnresolvedEventRole`, or omit the binding. Truth-side role specificity never crosses merely because the referent or binding is visible.

The same observation mechanism independently emits zero or more typed perceptual-classification assertions about that perceptual referent. Each assertion must descend from permitted sensory/measurement inputs and a registered facet definition. World semantic facts may constrain what evidence could be produced, but they are not themselves the output and may not bypass observation.

Tracking answers whether the perception process currently treats two detections as one continuous observer-relative continuant-file. It may be objectively wrong. Classification answers what that continuant-file appears to be. Neither operation resolves truth identity. Intervening on classification while holding the track fixed, on track continuity while holding classification fixed, or on truth identity while holding permitted continuity inputs fixed must remain representable.

`NewTrack` allocates `(ObserverId, NextObserverTrackSequence)` and increments only that observer's sequence. `ContinuesPriorTrack` requires an active prior continuant-file owned by the same observer and allocates nothing. A declared track end retires the active continuant-file without making its ID reusable; later reacquisition uses `NewTrack`. The registered continuity provider reads only permitted sensory evidence. No truth-side identity comparison may repair a false result.

The compiler preserves distinct binding occurrences. It does not deduplicate by referent. The same perceptual referent may therefore occupy several observed roles, and two bindings with the same referent and different roles remain structurally different.

Truth-side `EventRole` is descriptive event argument structure. Truth-side or character-relative `CausalRole` is a separate analytical classification. Deriving either causal role cannot erase the event role, and character-relative causal-role derivation may use only permitted evidence.

`SemanticExperience` collects the observer's canonical perceived bindings, typed perceptual classifications, and supporting measurements. Recognition later evaluates and appends resolutions to perceptual referents. It never replaces a perceptual referent, turns classification into identity, or rewrites an earlier experience.

Semantic classification may expand applicability and later inference, but it cannot directly emit appraisal, affect, motive, psychological pressure, or a Reason. The legal path remains classification evidence → belief/context/memory/person model → appraisal → affect/motive/Reason.

## Random addresses and distribution mapping

Not applicable to the initial exact projection. Any stochastic detection, role inference, or recognition candidate requires an addressed-random extension with an explicit distribution and coupling contract.

## Quantization and rounding points

None in the initial symbolic projection. Numeric supporting observations retain their own quantization and precision contracts.

## Canonical collection ordering and tie rules

- world bindings sort by canonical `EventBindingId`;
- perceived bindings sort by canonical `PerceivedBindingId`;
- perceptual classifications sort by canonical `ClassificationEvidenceId`;
- supporting evidence IDs sort canonically and are duplicate-free;
- one referent in several roles is not a duplicate;
- exact role evidence and unresolved role evidence are distinct sum variants;
- presentation-template order never controls authoritative collection order.
- no semantic collection may sort or weight by `ObserverTrackSequence` except where canonical identity bytes are required solely as a deterministic tie-break.

## Event phase and timing semantics

Accepted `SEM-001H` defines two exact observation lanes. Current-world evidence follows phases 10→11→12→13→14→15→20→21. Phase-110 outcomes follow the consequence lane 120→121→122→123→124→125→126→127 before phase-130 character-relative evaluation. Each lane observes only truth/state available strictly before its entry cutoff. Pre-recognition `SemanticExperience` is frozen/staged at phase 14/124 before frozen recognition input at 20/126 and evaluation/resolution at 21/127. All same-instant artifacts commit together only after successful settlement; no phase independently commits.

Later correction appends a replacement or withdrawal and cannot mutate the original perceived binding, experience, recognition input, evaluation, or contemporaneous resolution. Phase 150 is a non-schedulable settlement sentinel. `ORD-001` remains separately responsible for whether phase-30 belief application may consume phase-21 recognition within the same event; temporal precedence grants no read permission.

## Postconditions

- no unobserved binding appears in character evidence;
- no unrecognized truth referent appears by default;
- every perceived binding has a unique identity and one perceptual referent;
- every classification assertion refers to a perceived referent and a registered typed facet;
- multiple bindings may share a perceptual referent without collapsing;
- tracking, classification, and recognition can vary independently;
- every character-accessible field descends from permitted reads;
- recognition output refers back to immutable perceptual evidence;
- later recognition correction leaves prior records structurally unchanged.

## Invariants

1. Visibility is binding-specific, not merely slot-family-wide.
2. Visible does not imply recognized.
3. Referent identity is not binding identity.
4. `EventRoleId` and `CausalRoleId` are distinct typed namespaces.
5. Event-role preservation precedes optional causal-role derivation.
6. Character-relative causal roles cannot descend from hidden bindings.
7. Truth-reference equality cannot become an unintended side channel.
8. Original perception and contemporaneous recognition are historical facts.
9. Presentation strings are derived views, never authoritative meaning.
10. World classification, perceptual classification, recognition, and appraisal are separate records and transformations.
11. Missing classification evidence is not a negative classification.
12. Semantic classification cannot write or directly emit psychological pressure.
13. Perceptual continuity is an observer-relative result, not a truth assertion.
14. Track allocation for one observer is independent of every other observer's allocation history.
15. Track ordinals carry no psychological magnitude or similarity.
16. False continuity and false discontinuity persist through later recognition evaluation/resolution; truth never repairs them automatically.

## Trace records and provenance

The omniscient trace may join truth event, truth semantic facts, truth binding, observer-side detection, `PerceptualTrackTransition`, perceptual continuant-file, perceived classification, perceived binding, experience, recognition evaluation, and recognition resolution. That join capability is not granted to character cognition. Trace records objective mismatch for research without using it to mutate or correct character evidence. Research/UI views must declare one of three viewpoints:

- omniscient truth;
- contemporaneous character-relative perception/recognition;
- current reinterpretation using later belief.

Views never mutate their source records. `TRC-003` still governs privacy-safe external tool projections; `SEM-001` independently governs what the character simulation may read.

## Candidate mechanisms and control implementations

- **Candidate:** binding-specific observation with observer-scoped perceptual referents and pre-recognition experience.
- **Classification candidate:** governed typed facet assertions supported by permitted observation, with no inheritance or implication engine in version 0.1.
- **Restricted control:** `PerceivedConceptToken = (ConceptId, CausalRoleId, VisibleProvenanceSlotId)` from `observation/0.1-candidate`, allowed only where the channel itself establishes identity and one winning causal role is sufficient.
- **Historical control:** truth-side `EffectProvenance → WorldEventDescriptor → SemanticExperience`, with full truth provenance removed from character output.
- **Rendering projection:** deterministic templates over truth, contemporaneous, or current-interpretation views.

## Competing models / ablations

- `TruthIdentityCopy`: copies `person.glen` into perception because Glen is visible.
- `ReferentKeyedBinding`: uses referent identity as the binding key and collapses multi-role events.
- `SlotWideVisibility`: reveals or hides every binding in a provenance slot together.
- `EventRoleEqualsCausalRole`: replaces semantic event participation with salience-oriented causal classification.
- `OpaqueButLinkableTruthHandle`: hides fields but exposes stable equality of secret sources.
- `RecognitionRewrite`: replaces perceptual referents or rewrites earlier experience after correction.
- `TruthCorrectedTracking`: silently splits false-continuity tracks or merges false-discontinuity tracks using truth identity.
- `GlobalTrackAllocator`: lets another observer's allocations renumber this observer's track space.
- `TrackOrdinalPsychology`: uses the numeric track sequence as magnitude, similarity, salience, or appraisal input.
- `TruthFacetCopy`: copies registered world semantics into perception without sensory support.
- `FreeformTagBag`: admits unregistered strings or mixed-typed facet values.
- `ClassificationToPressure`: turns a semantic classification directly into motive, affect, or Reason.
- `AuthoritativeProse`: stores a sentence as the only event meaning.

## Equivalence relation and tolerances

All initial comparisons are exact canonical structural comparisons. There is no fuzzy string, embedding, or display tolerance. Two observers may intentionally differ only at fields descending from their differing permitted observations or later character state.

## Proof obligations and executable tests

The required vectors are specified in [Campaign 1 semantic-binding conformance vectors](CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md). At minimum they cover role permutation, multi-role identity, binding-specific visibility, independent tracking/classification/recognition, typed classification, unresolved identity, recognition/misrecognition, immutable correction, safe provenance, separate role vocabularies, causal-role epistemics, no classification-to-pressure shortcut, deterministic rendering, replay, and rollback.

## Applicable Campaign 0 conformance vectors

Canonical encoding/identity, governed registries, ordering, allocation, transaction rollback, read-domain enforcement, trace, save/load, and first-divergence controls remain mandatory.

## Known domain exclusions

Continuous vision, feature extraction, face recognition mathematics, probabilistic classification or identity confidence, linguistic parsing, deception inference, disguises as a physical simulation, cross-modal fusion, full ontology inheritance/facet implication, general affordance closure, richer long-lived continuant tracking, and UI authorization are not accepted in version 0.1. The representation must leave room for them without granting truth identity or truth classification early.

## Unresolved decisions

- `SEM-001I`: accepted [`SEM-001I.1` schema inventory](EVENT_SEMANTIC_SCHEMA_INVENTORY.md) fixes authoritative records/state/definitions, recognition-knowledge schema-versus-instance authority, trace-only evaluations and self-sufficient resolution state, typed occurrence allocation, exact occurrence keys, collection semantics, explicit transition result identities, and explicit continuant retirement. Accepted [`SEM-001I.2`](EVENT_SEMANTIC_NUMERIC_REGISTRY.md) freezes the permanent allocation and manifest-governed union layouts; `SEM-001I.3` codec/persistence and state-closure proof remains open.
- `SEM-001J`: integrated `PHEN-SEM-001` phenomenon gate after `SEM-001I` closes. `SEM-001A..H` resolve symbolic continuant/event identities, binding grammar, finite classification, continuant-instance recognition, observer-safe evidence admissibility/linkability, character-relative causal-role provenance, and exact two-lane phase placement, but do not by themselves prove the permanent end-to-end representation.
- `ONT-001`: full typed world ontology, inheritance/facet implication, affordance rules, and non-cognitive world consumers. It must remain compatible with this contract but does not block the finite `SEM-001` fixture vocabulary.
- `TRC-003`: privacy-safe researcher and UI projections; this does not relax the stricter character-access rule here.

## Reopen conditions

After acceptance, reopen on any event-role vocabulary, binding multiplicity, perceptual identity scope, semantic-facet value grammar, classification evidence, recognition ordering, direct-identity channel, provenance-linkability, causal-role derivation, rendering viewpoint, or epistemic-access change; or if a required fixture cannot express unknown classification or mistaken identity without truth leakage.

## Change history

- 2026-09-01: candidate opened after discovering that visibility of a truth-side referent does not establish character recognition; separated event roles, causal roles, perceptual referents, truth identities, and recognition hypotheses.
- 2026-09-01: added typed perceptual classification as a layer independent of tracking, recognition, and appraisal; reserved the full world ontology and affordance system for `ONT-001`.
- 2026-09-02: accepted `SEM-001A`; defined perceptual referents as potentially mistaken observer-relative files, accepted per-observer monotonic allocation and binary track transitions, and prohibited truth correction or ordinal psychology. Later the same day, clarified their carrier domain from “object-file” to “continuant-file” so persistent perceived people, discrete objects, places, and spatial regions share the carrier without collapsing occurrents into it.
- 2026-09-02: accepted `SEM-001B..E` through `CV-SEM-060`; fixed binding occurrences and roles, fallible event-files, independent continuant appearance and event-pattern classifications, same-window necessary-feature conjunction semantics, append-only evidence, and the typed asymmetry that prevents truth Action from projecting through a fabricated continuant or learned action identity.
- 2026-09-02: accepted `SEM-001F` through `CV-SEM-070`; fixed observer-owned candidate permission, mapped identity claims, exact unique-uncontradicted support, traceable no-update evaluation, append-only assertion/replacement/withdrawal resolution, false-tracking preservation, and recognition output boundaries.
- 2026-09-02: accepted `SEM-001G` through `CV-SEM-080`; fixed the closed character-evidence reference grammar, schema/version and consumer-`ReadDomain` admissibility, strict same-observer linkability, occurrence opacity, separate character/omniscient graphs, feature-specific future quality compatibility, the interpretation ladder, and nonrecursive multi-role character-relative causal-role evidence.
- 2026-09-02: accepted `SEM-001H` through `CV-SEM-090`; fixed current and consequence observation/recognition lanes, strict truth cutoffs, conditional bijective experience reservation, immutable envelope and recognition-input staging, independent same-phase classifier ordering, perceived-outcome learning, adaptation separation, `ORD-001` isolation, and the non-schedulable settlement barrier.
- 2026-09-02: accepted `SEM-001D`; fixed continuant/event carrier separation, finite independent boolean appearance facets, `NoAssertion | Assert(BooleanValue)`, feature-level missing/false semantics, sole per-facet classification authority, exact provenance, occurrence opacity, and capability-limited emission after `CV-SEM-041..050` passed.
- 2026-09-02: accepted `SEM-001B`; fixed run-scoped binding occurrence identity, the initial role vocabulary without generic `Context`, per-event-type cardinality and domain narrowing, duplicate-pair rejection, truth-role epistemic projection, and removal of binding qualifiers.
