# Event Semantic Canonical Schema Inventory

**Status:** accepted `SEM-001I.1` on 2026-09-02; allocates no permanent numeric IDs

**Decision owner:** `SEM-001I`

**Parent seam:** [`semantic-binding/0.1-candidate`](EVENT_SEMANTIC_BINDING.md)

**Purpose:** freeze which accepted `SEM-001A..H` structures are authoritative canonical records, governed definitions, typed identity values, transaction-local staging structures, or derived views before permanent type, field, enum, and registry IDs are assigned.

This inventory is deliberately semantically prior to allocation. A row's presence here did not itself assign a record type ID, field ID, enum value, or persistence location. Accepted `SEM-001I.2` now supplies those permanent values in a separate registry and did not change the categories, identities, fields, ownership, or collection semantics below.

## Classification rule

Every accepted A–H structure belongs to exactly one of these categories:

| Category | Meaning | Canonical commitment |
|---|---|---|
| authoritative occurrence record | immutable truth-side, observer-side, or trace-side fact produced during a run | receives an exact canonical record schema and occurrence-identity rules |
| authoritative state record | mutable authority represented through immutable state replacement | receives an exact canonical state schema and `StatePath` ownership |
| governed definition | model/content registry entry that changes executable semantics | encoded through a complete governed registry definition and committed by `RegistryIdentity`/`ModelIdentity` |
| typed identity/value | a closed scalar, composite identity, enum, or tagged union used by records | receives an exact namespace/value encoding but not necessarily a standalone record type |
| transaction-local structure | request, compiled result, reservation, or frozen staging wrapper used only inside one unsettled instant | no independent persistent identity; its authoritative inputs/outputs still appear in trace projections |
| derived view | deterministic projection reconstructible from authoritative records and registries | never independently mutated, allocated, or persisted as a competing source of truth |

Implementation interfaces, arrays, maps, callbacks, and class names do not become canonical merely because the symbolic oracle uses them. Conversely, any value that can change replay, validation, save/load continuation, character-accessible evidence, or model identity cannot be left as an untyped implementation object.

## Authoritative occurrence records

Field order below is semantic documentation only. Accepted `SEM-001I.2` assigns numeric field IDs; canonical bytes sort by those IDs under `cenc/1`.

| Record | Side | Exact v1 fields | Exact occurrence identity | Disposition |
|---|---|---|---|---|
| `WorldEventTruth` | truth | `WorldEventId`, `EventTypeId`, `OccurredAt`, `EventBindings` | `WorldEventId` | immutable semantic event occurrence, distinct from the scheduler event that produced it; `EventBindings` is a canonical list of complete `EventBinding` records |
| `EventBinding` | truth/trace | `EventBindingId`, `EventRoleId`, `SemanticReferentId` | `EventBindingId` | run-scoped typed runtime occurrence; never character-visible by default; validation-only `SemanticReferent.domainTags` is not stored here |
| `PerceptualTrackTransition` | perception/trace | `ObserverId`, optional `PriorPerceptualReferentId`, `PerceptualReferentId`, `CurrentDetectionId`, `ContinuityKind`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `CurrentDetectionId` | exactly one track transition per continuant detection; the resulting file ID is explicit; `NewTrack` allocates it and `ContinuesPriorTrack` requires it to equal the prior ID |
| `PerceptualTrackEnd` | perception/trace | `ObserverId`, `PerceptualReferentId`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `PerceptualReferentId` | exactly one retirement occurrence per continuant-file; later reacquisition allocates a new file and never reuses its sequence |
| `PerceptualEventTransition` | perception/trace | `ObserverId`, optional `PriorPerceptualEventReferentId`, `PerceptualEventReferentId`, `CurrentEventDetectionId`, `ContinuityKind`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `CurrentEventDetectionId` | exactly one event transition per event detection; the resulting event-file ID is explicit under the same start/continue rule |
| `PerceptualEventEnd` | perception/trace | `ObserverId`, `PerceptualEventReferentId`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `PerceptualEventReferentId` | exactly one retirement occurrence per event-file; immutable retirement never permits sequence reuse |
| `PermittedPerceptualFeatureObservation` | observer-side evidence | `FeatureObservationId`, `ObserverId`, `CurrentDetectionId`, `PerceptualReferentId`, `PerceptualFeatureId`, `BooleanValue`, `ObservationChannelId`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `FeatureObservationId` | observer-safe occurrence; explicit `false` is evidence and absence is no record |
| `PermittedPerceptualEventFeatureObservation` | observer-side evidence | `EventFeatureObservationId`, `ObserverId`, `CurrentEventDetectionId`, `PerceptualEventReferentId`, `PerceptualEventFeatureId`, `BooleanValue`, `ObservationChannelId`, `SupportingPerceptualReferentIds`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `EventFeatureObservationId` | observer-safe event-feature occurrence |
| `PerceivedBindingEvidence` | observer-side evidence | `PerceivedBindingId`, `ObserverId`, `PerceptualEventReferentId`, `PerceptualReferentId`, `EventRoleEvidence`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `PerceivedBindingId` | event-grouped binding occurrence; contains no truth binding or truth referent handle |
| `PerceptualClassificationEvidence` | observer-side evidence | `ClassificationEvidenceId`, `ExperienceId`, `ObserverId`, `PerceptualReferentId`, `PerceptualFacetId`, `TypedPerceivedValue`, `ClassificationRuleId`, `SupportingFeatureObservationIds`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `ClassificationEvidenceId` | append-only continuant-classification occurrence |
| `PerceptualEventClassificationEvidence` | observer-side evidence | `EventClassificationEvidenceId`, `ExperienceId`, `ObserverId`, `PerceptualEventReferentId`, `PerceptualEventFacetId`, `TypedPerceivedValue`, `EventClassificationRuleId`, `SupportingEventFeatureObservationIds`, `SupportingPerceptualReferentIds`, `SupportingObservationIds`, `OccurredAt`, `TransformationVersion` | `EventClassificationEvidenceId` | append-only event-pattern-classification occurrence; not action-schema recognition |
| `PreRecognitionSemanticExperience` | observer-side envelope | `ExperienceId`, `ObserverId`, `OccurredAt`, `PerceptualEventReferentIds`, `PerceivedBindings`, `PerceptualClassifications`, `PerceptualEventClassifications`, `SupportingObservationIds`, `TransformationVersion` | `ExperienceId` | exactly one immutable envelope for each successful lane reservation; current and consequence lanes always use distinct IDs |
| `PermittedRecognitionCueEvidence` | observer-side evidence | `RecognitionCueEvidenceId`, `ExperienceId`, `ObserverId`, `PerceptualReferentId`, `CandidateSemanticReferentId`, `RecognitionCueSource`, `CuePolarity`, `SupportingExperienceEvidenceRefs`, `OccurredAt`, `TransformationVersion` | `RecognitionCueEvidenceId` | observer-safe cue occurrence; candidate eligibility still requires the observer-owned catalog |
| `RecognitionEvaluation` | trace-side evaluation | `RecognitionEvaluationId`, `ExperienceId`, `ObserverId`, `PerceptualReferentId`, `RecognitionRuleId`, `EvaluatedRecognitionCueEvidenceIds`, optional `PriorRecognitionResolutionId`, `Result`, `OccurredAt`, `RecognitionVersion` | `RecognitionEvaluationId` | every governed attempt emits one, including `NoUpdate`; stored exactly once in committed trace and not required to continue character state |
| `RecognitionResolutionRecord` | observer-side recognition state/history | `RecognitionResolutionId`, `ExperienceId`, `ObserverId`, `PerceptualReferentId`, `Resolution`, `RecognitionRuleId`, `EvaluatedRecognitionCueEvidenceIds`, optional `RevisesRecognitionResolutionId`, `OccurredAt`, `RecognitionVersion` | `RecognitionResolutionId` | self-sufficient for continuation; allocated only for assertion, replacement, or withdrawal; evaluation→resolution is an omniscient trace edge, not a persisted state pointer |
| `CausalRoleEvidence` | observer-side evidence | `CausalRoleEvidenceId`, `ExperienceId`, `ObserverId`, `PerceptualEventReferentId`, `PerceptualReferentId`, `CausalRoleId`, `CausalRoleDerivationRuleId`, `SupportingEvidenceRefs`, `OccurredAt`, `TransformationVersion` | `CausalRoleEvidenceId` | nonrecursive character-relative analytical occurrence; companion to, never a field of, the experience envelope |

### Occurrence-record closure

1. Every occurrence has exactly one identity rule in the table. Allocated IDs use either an accepted observer-scoped allocator or the accepted run-scoped typed runtime allocator. `CurrentDetectionId`, `CurrentEventDetectionId`, and the single-retirement event-file key are existing unique occurrence identities, not content-derived substitutes. No role-derived, hash-derived, or collection-position-derived occurrence ID is permitted.
2. Every occurrence ordinal is opaque. Numeric value, allocation distance, prefix, sort position, or hash may not contribute semantic magnitude, time distance, similarity, certainty, salience, priority, appraisal, or other psychology.
3. Complete record values are immutable after settlement. Correction creates a new governed occurrence or revision record.
4. A truth-side record may appear in omniscient trace but cannot enter character provenance unless a separately accepted observer-safe record projects the permitted proposition.
5. Lists identified below as sets are duplicate-free and canonically sorted. Lists identified as history preserve governed semantic order. No collection uses insertion order accidentally.

## Authoritative state records

| State | Exact v1 fields | Sole authority |
|---|---|---|
| `PerceptualContinuantFileState` | `NextTrackSequenceByObserver`, `ActivePerceptualReferentIds` | perception seam |
| `PerceptualEventFileState` | `NextEventSequenceByObserver`, `ActivePerceptualEventReferentIds` | perception seam |
| `RecognitionKnowledgeState` | duplicate-free canonical `CandidateCatalogEntries` and `IdentitySymbolMappings`, each explicitly scoped by observer | initial-state authority in v0.1; a future accepted learning/forgetting seam may mutate it; recognition is read-only |
| `RecognitionResolutionState` | duplicate-free canonical set of append-only `RecognitionResolutionRecord` values | recognition seam |

The two per-observer next-sequence maps are authoritative save/load state and require registered `StatePath` roots and fields. They are not folded into the run-global allocator. Ending a file removes it from the active set but never decrements or frees its observer sequence.

`RecognitionCandidateCatalogEntry` and `ObserverIdentitySymbolMapping` are character-state instance records. Their schemas, candidate-domain grammar, validation rules, and legal update authorities are governed by `ModelIdentity`; each observer's actual seeded entries and mappings belong to initial state and therefore `InitialStateDigest`/`RunIdentity`. Changing a schema or rule changes `ModelIdentity`; changing Mina's seeded known candidates changes `RunIdentity`, not `ModelIdentity`. Recognition reads this state and cannot mutate it.

The state-item schemas and keys are:

| State item | Exact v1 fields | Exact state-item identity |
|---|---|---|
| `RecognitionCandidateCatalogEntry` | `ObserverId`, `CandidateSemanticReferentId`, `CandidateDomain`, `RecognitionTemplateIds`, `CatalogEntryVersion` | composite `(ObserverId, CandidateSemanticReferentId)`; at most one active entry for that observer/candidate pair |
| `ObserverIdentitySymbolMapping` | `ObserverSymbolCandidateMappingId`, `ObserverId`, `PerceivedIdentitySymbolId`, `CandidateSemanticReferentId`, `MappingVersion` | `ObserverSymbolCandidateMappingId`, a run-scoped typed occurrence allocated when the mapping is seeded or learned |

An active observer/symbol pair maps to at most one candidate. Replacement creates a newly allocated mapping occurrence and atomically replaces the active state item; it never reuses or derives the ID from observer, symbol, candidate, version, display text, or collection position. A recognition cue cites the exact mapping occurrence it used, so later remapping cannot reinterpret historical cue provenance.

Recognition evaluations exist exactly once in committed trace. They are not copied into `RecognitionResolutionState`, and canonical persisted `RecognitionResolutionRecord` has no `RecognitionEvaluationId` field. The omniscient trace records the evaluation→resolution derivation edge. Resolution state contains every value required for continuation and validation without dereferencing historical trace. Current recognition and terminal resolution per track are derived from the unique valid revision chain and are not separately persisted.

## Governed definitions committed by model identity

| Definition | Exact executable fields |
|---|---|
| `EventRoleDefinition` | `EventRoleId`, `BroadReferentDomainValidatorId`, `DefinitionVersion` |
| `RoleCardinalityRule` | `EventRoleId`, `MinOccurrences`, `MaxOccurrences`, optional `ReferentDomainNarrowingValidatorId` |
| `EventTypeBindingSchema` | `EventTypeId`, `RoleCardinalityRules`, `BindingSchemaVersion`, optional `FixedActionReferentId` |
| `PerceptualFacetDefinition` | `PerceptualFacetId`, `PerceivedValueType`, `ObservationDomainValidatorId`, `DefinitionVersion` |
| `PerceptualClassificationRuleDefinition` | `ClassificationRuleId`, `PermittedInputFeatureIds`, `OutputPerceptualFacetId`, `DerivationFunctionId`, `RuleVersion` |
| `PerceptualEventFacetDefinition` | `PerceptualEventFacetId`, `PerceivedValueType`, `ObservationDomainValidatorId`, `DefinitionVersion` |
| `PerceptualEventClassificationRuleDefinition` | `EventClassificationRuleId`, `PermittedInputEventFeatureIds`, `OutputPerceptualEventFacetId`, `DerivationFunctionId`, `RuleVersion` |
| `RecognitionRuleDefinition` | `RecognitionRuleId`, `RecognitionDomain`, `PermittedCueSourceKinds`, `DerivationFunctionId`, `RuleVersion` |
| `PermittedEvidenceSchema` | `ReferenceKind`, `RecordSchemaTypeAndVersion`, `ProducingEpistemicSeamVersion` |
| `EvidenceReadDomain` | `TransitionKindId`, `PermittedEvidenceSchemas`, `TemporalScope`, optional `PermittedModalityIds`, optional `PermittedFeatureScopeIds` |
| `CausalRoleDerivationRuleDefinition` | `CausalRoleDerivationRuleId`, `CausalRoleDomain`, `PermittedBasisKinds`, `Mappings`, `DerivationFunctionId`, `RuleVersion` |
| `EventRoleToCausalRoleRule` | `EventRoleId`, `CausalRoleId` |

Executable callback bodies are not serializable definitions. Every `DerivationFunctionId` and validator ID resolves through a closed model registry; missing, duplicate, or extra authority fails model construction. The complete definition records and their resolution tables contribute to `RegistryIdentity` and therefore `ModelIdentity`. The canonical schemas and validation/update rules for recognition-knowledge state also contribute to model identity, but the observer-owned catalog/mapping instances do not.

`SemanticReferent.domainTags` and validator callback objects in the symbolic oracle are registry-validation inputs. They do not alter the accepted three-field `EventBinding` occurrence. The governed referent/content definition owns any type/category facts needed by a domain validator.

## Typed identities and closed value grammars

### Identity namespaces

| Identity | Scope and exact semantic identity |
|---|---|
| `EventId` | run-scoped scheduler-transition occurrence; an enclosing committed trace links it to any emitted `WorldEventTruth` but it is not that truth record's identity |
| `WorldEventId` | run-scoped truth-side semantic event occurrence |
| `EventBindingId` | run-scoped truth binding occurrence |
| `SemanticReferentId` | governed truth/content or runtime semantic entity identity, encoded over a nested typed origin identifier so authored and runtime origins cannot collide; never automatically character-known |
| `PerceptualReferentId` | composite `(ObserverId, ObserverTrackSequence)` |
| `PerceptualEventReferentId` | composite `(ObserverId, ObserverEventSequence)` |
| `CurrentDetectionId` | observer-scoped continuant sensory-detection occurrence; never a truth handle |
| `CurrentEventDetectionId` | observer-scoped event-detection occurrence; distinct from continuant detection and truth event identity |
| `SupportingObservationId` / `ObservationId` | observer-safe observation occurrence under an explicitly admitted schema |
| `ExperienceId` | run-scoped observer-side envelope occurrence, conditionally allocated at lane admission |
| `ObserverSymbolCandidateMappingId` | run-scoped typed recognition-knowledge mapping occurrence; explicitly stored and never derived from mapping contents |
| feature, binding, classification, cue, evaluation, resolution, and causal-role evidence IDs | run-scoped typed observer-safe occurrences |
| role, facet, feature, rule, validator, channel, modality, template, symbol, transition-kind, and schema IDs | governed model/content identities, never occurrence counters |

`ObserverId` appearing inside a composite identity is part of identity, not redundant presentation metadata. A composite ID must use a canonical record/value encoding rather than string concatenation. The observer-scoped sequence is persisted, monotonic, and never reused. `CurrentDetectionId` and `CurrentEventDetectionId` must likewise be unique in their respective observer-side namespaces because they are the occurrence keys of their transitions. The run-global typed allocator allocates every other accepted runtime occurrence class, including feature/event-feature observations, perceived bindings, both classifications, recognition cues/evaluations/resolutions, causal-role evidence, and experiences. Each class remains a distinct typed namespace even when the underlying numeric source is shared: equal ordinals across types are unequal identities.

### Closed unions and enums requiring permanent tags

- `EventRoleEvidence = ExactEventRole(EventRoleId) | UnresolvedEventRole`
- continuant continuity: `NewTrack | ContinuesPriorTrack`
- event continuity: `NewEventFile | ContinuesPriorEventFile`
- exact cardinality maximum: `Finite(nonnegative integer) | Unbounded`
- classification result: `NoAssertion | Assert(BooleanValue)`
- recognition cue source: `RetainedTemplateMatch(RecognitionTemplateId) | IdentityClaimMapping(PerceivedIdentitySymbolId, ObserverSymbolCandidateMappingId)`
- recognition experience reference: continuant classification, perceived binding, or admitted supporting observation
- cue polarity: `SupportsCandidate | ContradictsCandidate`
- recognition evaluation result: `NoUpdate(NoQualifyingCandidate | AmbiguousCandidates | SameCandidateMaintained) | AssertUniqueCandidate(CandidateSemanticReferentId) | WithdrawCurrentResolution`
- recognition resolution: `AssertedCandidate(CandidateSemanticReferentId) | Withdrawn`
- `CharacterEvidenceRef`: exactly the nine variants accepted by `SEM-001G`
- evidence carrier: continuant, event, or continuant-in-event
- temporal scope: same window, same experience, or historical/current
- lane: current or consequence

Each union has a closed numeric tag registry and canonical tag/payload matrix in accepted `SEM-001I.2`. Payload presence is determined solely by the selected tag; sentinel IDs, empty strings, magic zero values, or unregistered strings may not represent a variant.

## Canonical collection semantics

| Collection | Semantics |
|---|---|
| event bindings | duplicate-free canonical set sorted by complete binding bytes after validation; role order is not priority |
| role cardinality rules and all model rule/definition registries | duplicate-free canonical set sorted by complete stable identity bytes |
| supporting observation, feature-observation, perceptual-referent, cue-evidence, and character-evidence references | duplicate-free canonical set sorted by complete typed reference bytes |
| experience event-file IDs, bindings, and classifications | duplicate-free canonical sets; grouping is carried by explicit IDs, never list adjacency |
| recognition resolution records across all tracks | duplicate-free canonical set sorted by complete `RecognitionResolutionId` bytes; set order has no historical meaning |
| recognition resolution chain for one track | unique nonbranching order induced by `RevisesRecognitionResolutionId`; `OccurredAt` is nondecreasing along the chain but never determines revision order |
| evaluated cue IDs | duplicate-free canonical set, not evaluation priority |
| active continuant/event-file IDs | duplicate-free canonical set |
| per-observer next-sequence maps | canonical map keyed by complete `ObserverId` bytes |
| causal-role mappings | duplicate-free canonical set by `(EventRoleId, CausalRoleId)` |

Canonical sorting is an encoding rule, never a read capability, causal priority, salience rule, tie-break for recognition, or psychological order.

## Transaction-local structures that do not receive persistent identity

The following remain implementation/staging structures: binding/classification/recognition requests, compiled result wrappers, model wrappers containing executable functions, lane-admission requests/results, `ExperienceReservation`, `StagedSemanticExperience`, `FrozenRecognitionInput`, classification work items, and consumer-context validation objects.

They may be reconstructed only from exact authoritative inputs and governed registries. Their actual reads, input projections, rules, staged outputs, and failures remain traceable through accepted `TraceRecord` fields. They cannot be saved as a second authoritative representation or cited as character evidence.

The experience reservation is nevertheless transactionally binding: on successful settlement it has a one-to-one relationship with `PreRecognitionSemanticExperience`; on failure both allocation and staged output disappear. The reservation itself is not a durable domain fact.

## Derived views that must not become competing state

- current recognition for a track, derived from the terminal valid resolution chain;
- `ObserverSafeEvidenceOccurrence`, derived by resolving one typed `CharacterEvidenceRef` against its authoritative record and producing-seam registry;
- character evidence graph edges, derived only from explicit references physically present in observer-side records;
- omniscient derivation graph projections, derived from committed trace;
- event grammar, grouping summaries, semantic display strings, and classification summaries;
- canonical classifier work order and lane phase lookup;
- `Compiled*`, `Materialized*`, and transition-result wrappers.

`ObserverSafeEvidenceOccurrence` is an audited index projection, not a copied evidence payload. It may be cached only with structural invalidation and byte-equivalence to recomputation; a cache is never authoritative save state.

## Accepted reconciliation decisions

1. **Self-identifying transition outputs.** Add the resulting `PerceptualReferentId` to the canonical continuant transition and the resulting `PerceptualEventReferentId` to the canonical event transition. Without this field, a `New*` transition cannot durably state which newly allocated file the detection entered. This exposes no truth identity and does not change binary continuity semantics.
2. **Accepted binding shape wins.** Canonical `EventBinding` stores `SemanticReferentId`, not the symbolic oracle's `SemanticReferent { id, domainTags }` validation wrapper.
3. **One experience name.** The v1 canonical name is `PreRecognitionSemanticExperience`. “SemanticExperience” remains the architectural family term; `ThinSemanticExperience` type 209 remains only the accepted bounded-measurement control and is not interchangeable with this record.
4. **Separate detection namespaces.** `CurrentDetectionId` and `CurrentEventDetectionId` remain distinct typed observer-side identities. Neither can equal, contain, hash, alias, or be allocated from a truth referent/event handle.
5. **No duplicate evidence index.** `ObserverSafeEvidenceOccurrence` is derived, not independently persisted.
6. **No persistent staging wrappers.** H's reservation, frozen-envelope wrapper, and frozen-recognition-input wrapper are transaction-local. The committed experience, evaluation/resolution, and trace are authoritative.
7. **One recognition truth.** Persist the append-only resolution records and derive per-track revision order, terminal resolution, and current recognition; do not maintain independently mutable current-candidate or terminal-ID state.
8. **Schema authority differs from instance authority.** Recognition-knowledge schemas, candidate-domain grammar, validation rules, and legal update rules enter `ModelIdentity`. Actual observer-owned catalog and symbol-mapping instances enter initial/runtime character state and `RunIdentity`.
9. **Evaluation is trace-only.** Store each `RecognitionEvaluation` once in committed trace. Persistent resolution state is self-sufficient, contains no evaluation history or `RecognitionEvaluationId` pointer, and uses an omniscient trace edge for evaluation→resolution provenance.
10. **Typed occurrence allocation.** Every accepted observer-safe occurrence and symbol-mapping occurrence except the two explicitly detection-keyed transitions and the two file-keyed retirements uses the run-scoped allocator through its own typed namespace. Symbolic or content-derived string occurrence IDs are not canonical.
11. **Revision topology is history.** Cross-track resolution storage is a canonical set. Within one track, revision links—not timestamp or allocation order—define the unique history; time is merely required to be nondecreasing along it.
12. **Every occurrence is uniquely keyed.** The authoritative occurrence table is the exhaustive v1 identity audit. No schema may enter `SEM-001I.2` without the listed key and uniqueness invariant.
13. **Mapping provenance is explicit.** `ObserverIdentitySymbolMapping` stores a typed `ObserverSymbolCandidateMappingId`; the ID currently synthesized by the symbolic oracle from symbol/candidate/version text is noncanonical and must be replaced in `SEM-001I.3`.
14. **Continuant retirement is explicit.** `PerceptualTrackEnd` is the continuant-file analogue of `PerceptualEventEnd`, uniquely keyed by `PerceptualReferentId`. A file can retire once; truth and recognition cannot end it; reacquisition uses a fresh observer sequence.

## Disposition and next gate

`SEM-001I.1` is accepted with all six review dispositions closed: recognition-knowledge schema/instance authority split, trace-only evaluations with self-sufficient resolution state, shared allocator with distinct typed occurrence namespaces, revision-topology history, explicit transition result identities, and an exact occurrence-key audit for every authoritative occurrence record.

Accepted `SEM-001I.2` assigns record/field IDs and every finite tag/registry value in one append-only allocation table without altering these semantic shapes. `SEM-001I.3` now implements canonical codecs, state ownership, save/load, replay, unknown-version rejection, and rollback vectors.

## Negative controls required for the eventual canonical gate

`SymbolicIdFallback`, `ReflectionOrderSchema`, `StringConcatenatedCompositeId`, `DerivedSymbolMappingId`, `UntypedRuntimeOccurrenceId`, `ReusedObserverSequence`, `ReusedDetectionTransitionKey`, `DuplicateEventFileRetirement`, `OccurrenceWithoutIdentityRule`, `OccurrenceOrdinalPsychology`, `UnknownUnionTag`, `MagicZeroOptional`, `InsertionOrderCollection`, `TimestampOrderedRecognitionRevision`, `DuplicateCanonicalSetMember`, `TransitionWithoutResultIdentity`, `TruthDomainTagsInBinding`, `PersistedEvidenceIndexAsAuthority`, `DuplicatedRecognitionEvaluationHistory`, `DanglingEvaluationStateReference`, `MutableCurrentRecognitionCopy`, `PersistentStagingWrapper`, `UnknownSchemaBestEffortDecode`, and `UncommittedDefinitionOutsideModelIdentity`.
