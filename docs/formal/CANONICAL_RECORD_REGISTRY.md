# Canonical Record Type Registry

**Accepted additive registry:** [VAL permanent allocation](VAL_PERMANENT_ALLOCATION.md),
`val-allocation/0.1-candidate` (2026-09-06), appends schemas 329/1 and 330/1. Its exact fields,
governed entry bindings and member assignments are permanent; earlier registry entries are unchanged.

**Status:** accepted Campaign 0 registry, version identifier `cenc-records/0.1-candidate`; governed by accepted `substrate/0.2-candidate`

**Purpose:** assign permanent numeric record and field IDs so an implementation cannot invent identity encodings locally.

All records use `cenc/1`. Type IDs, schema versions, and field IDs are unsigned integers. Every field below is required. Retired type or field IDs are never reused.

## Identity records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 100 | `ContentIdentity` | 1 | `1: ContentSchemaVersion`, `2: ContentManifestDigest` |
| 101 | `ParameterIdentity` | 1 | `1: ParameterSchemaVersion`, `2: ParameterSetDigest` |
| 102 | `RegistryIdentity` | 1 | `1: RegistrySchemaVersion`, `2: RegistryManifestDigest` |
| 103 | `ModelIdentity` | 1 | `1: RulesVersion`, `2: ContentIdentity`, `3: ParameterIdentity`, `4: NumericProfileVersion`, `5: RandomAlgorithmVersion`, `6: RegistryIdentity` |
| 104 | `RunIdentity` | 1 | `1: ModelIdentity`, `2: InitialStateDigest`, `3: OrderedInputSequenceDigest`, `4: RunSeed` |
| 105 | `ExperimentIdentity` | 1 | `1: CorpusVersion`, `2: ComparisonSpecificationVersion`, `3: HarnessVersion` |
| 106 | `ComparisonCase` | 1 | `1: OrderedModelIdentities`, `2: OrderedRunIdentities`, `3: CouplingSpecification` |

Version fields are NFC text values. Digest fields and `RunSeed` are byte strings of exactly 32 bytes. Ordered identity fields are `cenc/1` lists and preserve semantic order. `CouplingSpecification` is the complete canonical coupling structure defined for the comparison; it is not a friendly name or digest-only substitute.

## Addressed-randomness records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 110 | `RandomAddress` | 1 | `1: CausalRootId`, `2: PurposeId`, `3: SubjectBindings`, `4: DrawIndex` |
| 111 | `SubjectBinding` | 1 | `1: SubjectRoleId`, `2: SubjectId` |
| 112 | `NaturalRandomKey` | 1 | `1: RandomAddress` |
| 113 | `CoupledRandomKey` | 1 | `1: ComparisonDrawKey` |
| 114 | `RandomCandidateInput` | 1 | `1: RandomAlgorithmVersion`, `2: RunSeed`, `3: EffectiveRandomKey`, `4: InternalCandidateIndex` |
| 115 | `ComparisonDrawMapEntry` | 1 | `1: LocalRandomAddress`, `2: ComparisonDrawKey` |
| 116 | `ComparisonDrawMap` | 1 | `1: Entries` |
| 117 | `ComparisonDrawKey` | 1 | `1: KeyId`, `2: ComparisonRoleId` |

Subject bindings are sorted by the complete canonical bytes of `(SubjectRoleId, SubjectId)`. Comparison-map entries are sorted by complete canonical `LocalRandomAddress` bytes. `ComparisonRoleId` is part of the comparison key and must equal the role registered for the receiving `PurposeId`; this makes incompatible coupling a structural validation error.

## Time and persistence records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 120 | `LinearRateParameters` | 1 | `1: ParameterIdentity`, `2: Rate`, `3: Scale`, `4: ValueMinimum`, `5: ValueMaximum` |
| 121 | `LinearAnalyticalAnchor` | 1 | `1: ValueAtAnchor`, `2: AnchorInstant`, `3: GoverningParameterIdentity`, `4: ExactBoundedRemainder` |
| 130 | `ScheduledEvent` | 1 | `1: EventId`, `2: DueAt`, `3: Phase`, `4: EventSequence`, `5: EventTypeId`, `6: Payload`, `7: Dependencies`, `8: CausalParentEventIds` |
| 131 | `AllocatorState` | 1 | `1: NextRuntimeId`, `2: NextEventId`, `3: NextEventSequence` |
| 132 | `SchedulerSave` | 1 | `1: SaveSchemaVersion`, `2: ModelIdentity`, `3: RunIdentity`, `4: Clock`, `5: AuthoritativeState`, `6: AllocatorState`, `7: PendingQueue`, `8: AnalyticalAnchors`, `9: RandomRelevantAuthoritativeIds`, `10: ContinuingRunInputs`, `11: CommittedTrace`, `12: Outputs` |
| 133 | `OrderingParameters` | 1 | `1: MaxSettlementWorkPerSimulationInstant` |
| 134 | `OrderingPhaseRegistry` | 1 | `1: RegistryVersion`, `2: Phases` |

Pending events encode in canonical execution order. Saves contain complete structural model/run identities and structures, never digest-only substitutes. Event handlers are deliberately absent from the save and must resolve through the receiving model's registered `EventTypeId` handlers during load.

## State-contract records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 140 | `StatePath` | 1 | `1: RootStateTypeId`, `2: FieldId`, `3: Selectors` |
| 141 | `TypedEntitySelector` | 1 | `1: TypedEntityId` |
| 142 | `CanonicalMapKeySelector` | 1 | `1: CanonicalMapKey` |
| 143 | `StableListItemSelector` | 1 | `1: StableListItemId` |
| 144 | `StatePatch` | 1 | `1: Operations` |
| 145 | `SetPatchOperation` | 1 | `1: Path`, `2: ExpectedPresence`, `3: ExpectedOldValue`, `4: NewValue` |
| 146 | `RemovePatchOperation` | 1 | `1: Path`, `2: ExpectedOldValue` |
| 147 | `ActualReadRecord` | 1 | `1: AccessorId`, `2: Path`, `3: Presence`, `4: Value`, `5: DerivedSources`, `6: TransformationId` |
| 148 | `StructuralMutationDiff` | 1 | `1: Path`, `2: OldPresence`, `3: OldValue`, `4: NewPresence`, `5: NewValue`, `6: MutationAuthorityId` |
| 149 | `StatePathPattern` | 1 | `1: RootStateTypeId`, `2: FieldId`, `3: SelectorPatterns` |
| 150 | `SelectorWildcard` | 1 | `1: SelectorKind` |
| 151 | `StateLeaf` | 1 | `1: Path`, `2: Value` |
| 152 | `LeafValueGrammar` | 1 | `1: VariantTag`, `2: RecordTypeId` (optional) |
| 153 | `OwnedLeafDefinition` | 1 | `1: Pattern`, `2: ValueGrammar`, `3: RemovalAllowed` |
| 154 | `MutationAuthorityDefinition` | 1 | `1: MutationAuthorityId`, `2: OwnedLeaves` |
| 155 | `MutationAuthorityRegistryDefinition` | 1 | `1: DefinitionVersion`, `2: Authorities` |

Presence booleans determine whether the corresponding value field is semantically populated; the required `false` sentinel in an absent value field is structural padding, not a state value. Patch operations and state leaves sort by complete canonical path bytes. Duplicate and ancestor/descendant patch paths are invalid. Selector order is path order and therefore is not sorted.

## Trace and diagnostic records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 160 | `TraceRecord` | 1 | `1: TraceSchemaVersion`, `2: ModelIdentity`, `3: RunIdentity`, `4: Event`, `5: SeamId`, `6: SeamVersion`, `7: RecordKind`, `8: SubjectIds`, `9: SourceRecordIds`, `10: RegisteredReadDomain`, `11: ActualReadRecords`, `12: InputProjection`, `13: OutputProjection`, `14: RandomDrawRecords`, `15: QuantizationOperations`, `16: StatePatch`, `17: StructuralMutationDiffs`, `18: EmittedEvents`, `19: InvariantResults` |
| 162 | `FailureDiagnostic` | 1 | `1: FailureDiagnosticSchemaVersion`, `2: RunIdentity`, `3: FailureCode`, `4: AttemptedInstantPresence`, `5: AttemptedInstant`, `6: CurrentEventIdPresence`, `7: CurrentEventId`, `8: CausalChain`, `9: PreInstantStateBytes`, `10: CandidateTransitionDataPresence`, `11: CandidateTransitionData`, `12: Message` |

`TraceRecord.Event` and every emitted event reuse record type 130; trace does not define a second event representation. Subject IDs, source-record IDs, and registered read-domain patterns are canonical duplicate-free sets encoded as sorted lists. Actual reads, random draws, quantization operations, diffs, emitted events, and invariant results preserve semantic execution order. A failure diagnostic is never inserted into committed trace.

## Evolution rule

The tuples `(TypeId, SchemaVersion, FieldId)` above are permanent. A reader must reject an unknown type/version rather than infer its meaning. Adding a field or changing any field's semantics requires a new schema version and an explicit migration; removing a type or field retires its numeric ID permanently. A presentation-only view is not a new authoritative record version.

## Initial content and registry records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 170 | `GovernedContentDefinition` | 1 | `1: StableId`, `2: SemanticKind`, `3: DeclaredInputs`, `4: DeclaredOutputs`, `5: Preconditions`, `6: WorldEffects`, `7: UnitsDomainsBounds`, `8: EpistemicVisibility`, `9: ObservationAffordances`, `10: Lifecycle`, `11: ReferencedRegistryIds`, `12: ReferencedContentIds`, `13: ValidationInvariants`, `14: SourceProvenance`, `15: ChangeHistory`, `16: FormalSeamMappings` |
| 171 | `SemanticRegistryEntry` | 1 | `1: StableId`, `2: RegistryKind`, `3: DefinitionVersion`, `4: Definition` |
| 172 | `CanonicalRecordSchemaDescriptor` | 1 | `1: TypeId`, `2: SchemaVersion`, `3: Name`, `4: Fields` |
| 173 | `CanonicalRecordFieldDescriptor` | 1 | `1: FieldId`, `2: Name`, `3: Required` |
| 174 | `CorpusManifestEntry` | 1 | `1: PhenomenonId`, `2: Version` |

The authored form of type 170 additionally permits presentation-only field ID 100, `PresentationLabel`; it is removed before canonical commitment and is not part of the authoritative record schema. Registry manifests contain the complete canonical schema descriptors plus semantic registry entries. Stable IDs and `(TypeId, SchemaVersion)` pairs are duplicate-free. References must resolve before commitment, and content-reference cycles are invalid in this initial substrate schema.

## Registration gate

A new authoritative record type must be added here before implementation. Its entry must state a unique type ID, schema version, every permanent field ID, required/optional status, field semantic types, and the migration/evolution rule. Test-only record schemas may use IDs `10000` through `19999`; they are fixture-local and cannot enter authoritative artifacts.

## Observation and permitted-evidence records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 200 | `BoundedEffectTruth` | 1 | `1: Before`, `2: PotentialEffect`, `3: Applied`, `4: Overflow`, `5: After`, `6: Minimum`, `7: Maximum`, `8: EffectProvenance`, `9: TruthRecordId` |
| 201 | `ObservationChannel` | 1 | `1: ObservationChannelId`, `2: ObserverId`, `3: SubjectId`, `4: ModalityId`, `5: UnitId`, `6: PolarityId`, `7: MeasurementModeId`, `8: Precision`, `9: VisibleProvenanceSlotIds`, `10: MissingnessRuleId`, `11: ExperimentalControlIdPresence`, `12: ExperimentalControlId` |
| 202 | `MissingObservation` | 1 | `1: ObservationId`, `2: ObserverId`, `3: SubjectId`, `4: ObservationChannelId`, `5: OccurredAt`, `6: MissingnessRuleId` |
| 203 | `PresentObservation` | 1 | `1: ObservationId`, `2: ObserverId`, `3: SubjectId`, `4: ObservationChannelId`, `5: OccurredAt`, `6: MeasurementInterval`, `7: EvidenceKindId`, `8: Precision`, `9: PerceivedConceptTokens`, `10: SafeSourceReferences`, `11: TransformationVersion` |
| 204 | `MeasurementInterval` | 1 | `1: LowerPresence`, `2: Lower`, `3: UpperPresence`, `4: Upper` |
| 205 | `PerceivedConceptToken` | 1 | `1: ConceptId`, `2: CausalRoleId`, `3: VisibleProvenanceSlotId` |
| 207 | `EffectProvenanceTruth` | 1 | `1: Slots` |
| 208 | `EffectProvenanceSlot` | 1 | `1: SlotId`, `2: ConceptIds` |
| 209 | `ThinSemanticExperience` | 1 | `1: ExperienceId`, `2: ObserverId`, `3: OccurredAt`, `4: PresentObservations`, `5: TransformationVersion` |

Required false sentinels occupy absent interval/control fields; presence booleans carry meaning. Permanent numeric registries for `observation/0.1-candidate` are:

- evidence kind: `1 Point`, `2 LowerBound`, `3 UpperBound`;
- polarity: `1 Increase`, `2 Decrease`, `3 Signed`;
- measurement mode: `1 BoundedStateChange`, `2 ExactEffectControl`;
- missingness rule: `1 AlwaysPresent`, `2 AlwaysMissing`;
- causal role: `1 Cause`, `2 Actor`, `3 Target`, `4 Recipient`, `5 Instrument`, `6 AffectedEntity`, `7 Participant`, `8 Location`, `9 Context`, `10 Incidental`;
- provenance slot priority: `1 SourceAction→Cause`, `2 Cause→Cause`, `3 Actor→Actor`, `4 Target→Target`, `5 Recipient→Recipient`, `6 Instrument→Instrument`, `7 AffectedEntity→AffectedEntity`, `8 Participants→Participant`, `9 Location→Location`, `10 ActiveContext→Context`, `11 IncidentalConcepts→Incidental`.

Future additions append IDs; IDs and priority never reorder. Within the accepted bounded-measurement scope, evidence output contains only types 202–205 plus observer-safe evidence IDs. Types 200, 207, and 208 are truth/trace-side and forbidden in character-accessible projections. Type 205 is a restricted control: `ConceptId` may cross only when the registered channel itself establishes identity, and first-role-wins deduplication is not a general event-binding rule.

`SEM-001` defines `WorldEventTruth`, `EventBinding`, perceptual track/event transitions, observer-safe feature/binding/classification/cue/causal-role evidence, pre-recognition `SemanticExperience`, trace-only recognition evaluations, self-sufficient recognition resolutions, and their governed registries. `WorldEventId` is the semantic truth-event occurrence and remains distinct from scheduler `EventId`; the committed scheduler trace links production without conflating the identities. Amended `SEM-001A` fixes `PerceptualReferentId` as an observer-relative continuant-file identity and requires an observer-scoped persisted sequence; it also fixes a perception-owned binary track transition over observer-side detections. Its ordinal is opaque and cannot carry semantic or psychological magnitude. Accepted `SEM-001I.1` closes record shapes and occurrence identities, and accepted `SEM-001I.2` freezes their permanent numeric allocation; accepted `SEM-001I.3` supplies the canonical codecs, state ownership, and persistence. Accepted `SEM-001J` (2026-09-04) closed the parent `SEM-001` by proving the frozen allocation participates correctly in the complete integrated semantic path; it allocated and reinterpreted no permanent identifier. `ONT-001` owns any later general ontology/inference records.

`SEM-001B` accepts the existing run-scoped runtime allocator for typed `EventBindingId` occurrences rather than adding a role- or referent-derived identity scheme. It also accepts the semantics of governed `EventRoleDefinition`, `EventTypeBindingSchema`, and `RoleCardinalityRule`, including optional event-type domain narrowing. The executable oracle uses symbolic candidate IDs only: this subdecision allocates no permanent type, enum, or field IDs and does not change the accepted runtime allocator. Exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001C` accepts the semantics of observer-scoped `PerceptualEventReferentId`, `PerceptualEventTransition`, `PerceptualEventEnd`, event-grouped `PerceivedBindingEvidence`, and the many-to-many experience/event-file relation. Its executable oracle uses symbolic candidate identities only. It allocates no permanent type, field, enum, or event-file IDs, and exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001D` accepts the semantics of `PermittedPerceptualFeatureObservation`, `PerceptualFacetDefinition`, `PerceptualClassificationRuleDefinition`, `ClassificationRuleResult`, and continuant-scoped `PerceptualClassificationEvidence`. It fixes a `PerceptualFacetId` namespace distinct from world facets, six finite symbolic fixture facets, boolean stored values, `NoAssertion | Assert(BooleanValue)`, feature-level missing/false separation, exactly one rule authority per facet per model, run-scoped opaque classification occurrences, and experience-assembly-only emission. The executable oracle uses symbolic candidate IDs and allocates no permanent type, field, feature, facet, rule, enum, or schema IDs. Exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001E` accepts the semantics of `PermittedPerceptualEventFeatureObservation`, `PerceptualEventFacetDefinition`, `PerceptualEventClassificationRuleDefinition`, and event-file-scoped `PerceptualEventClassificationEvidence`. It fixes a namespace distinct from truth Action/EventType and continuant facets; independent `AppearsRepetitiveMotionLike`, `AppearsCoupledMultiContinuantMotionLike`, and `AppearsRopeSkippingPatternLike` fixture facets; scoped exact boolean feature evidence; a definitionally necessary three-feature conjunction; sole per-facet model authority; append-only cross-experience evidence; typed Action-role projection asymmetry; and experience-assembly-only emission. The executable oracle uses symbolic candidate identities and allocates no permanent type, field, feature, facet, rule, enum, or schema IDs. Exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001F` accepts observer-owned `RecognitionCandidateCatalogEntry`, typed `PermittedRecognitionCueEvidence`, observer-owned identity-symbol mappings, immutable `RecognitionEvaluation`, one exact `UniqueUncontradictedSupport` rule, and append-only continuant-scoped `RecognitionResolutionRecord` chains with `AssertedCandidate | Withdrawn`. It fixes no-update versus state-change semantics, evidence-required withdrawal, mapped identity claims, no truth-kind filtering, no stored Unknown/confidence/ranking/correctness, no event/action recognition, and no direct downstream mutation. The executable oracle uses symbolic candidate identities and allocates no permanent type, field, cue, rule, enum, or schema IDs. Exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001G` accepts the symbolic closed `CharacterEvidenceRef` variants, exact record-schema/producing-seam admission through consumer-specific `ReadDomain`s, separate semantic/co-reference versus occurrence versus truth/trace identity classes, strict same-observer references, and nonrecursive `CausalRoleEvidence` for one continuant in one observer-relative event. It allocates no permanent record, field, reference-tag, causal-role, rule, or schema IDs. `PresentObservation.SafeSourceReferences` from `observation/0.1-candidate` remains a restricted control and is not admitted merely because an `ObservationId` exists. Exact canonical schemas remain blocked by the parent `SEM-001`.

`SEM-001H` accepts phase registry `ordering-phases/2-candidate`: current semantic-binding phases `10..15,20..21`, consequence phases `120..127`, character-relative outcome evaluation at `130`, and non-schedulable settlement sentinel `150`. It symbolically reserves an `ExperienceId` only for an admitted nonempty evidence lane and requires a bijection to one frozen envelope. This fixes phase values and lifecycle without allocating permanent event-type, record-type, field, or `ExperienceId` schemas; those remain blocked by the parent `SEM-001`.

`SEM-001I.1` accepts the complete semantic schema inventory and fixes exact occurrence keys; explicit transition result identities; recognition catalogs/mappings as observer-owned character-state instances under model-governed schemas/rules; an explicitly stored typed `ObserverSymbolCandidateMappingId`; trace-only recognition evaluations; self-sufficient resolution state without `RecognitionEvaluationId`; distinct typed namespaces over the shared runtime allocator; detection-keyed transitions; event-file-keyed single retirement; and revision-link rather than timestamp/allocation history order. Accepted `SEM-001I.2` freezes those shapes into the reviewed append-only numeric table, including manifest-governed union layouts. `SEM-001I.3` must now prove canonical runtime codecs, state closure, persistence, replay, and rollback before the semantic records' runtime bytes are authoritative.


## Campaign 2 permanent allocation accepted and frozen — 2026-09-06

The revision-2 review's final mechanical conditions A/B passed: exact complete Markdown/JSON
parity and the explicit observation/0.1-candidate SeamId declaration at
OBSERVATION_AND_EVIDENCE.md:5 (accepted status at line 3).
The [permanent registry addendum](CAMPAIGN2_PERMANENT_ALLOCATION.md) is now
**campaign2-allocation/0.2-candidate, ACCEPTED AND FROZEN**. This disposition supersedes earlier
allocation-pending statements; it does not revise accepted seam semantics. Records 260..328,
namespaces 1004, 1026..1036 and 1116..1121 as listed, all 58 member payloads, 32 union variants
and 10 finite field values are permanent. No renumbering, reuse or insertion by shifting; future
additions append. All earlier proposed assignments are preserved. Namespace 1004's prior
availability is historical; it is now assigned to CONTENT/shared SemanticKindId. SeamId/1036
is shared, with contextual Campaign-2 enforcement and no global legacy trace migration.

Allocation acceptance permits canonical construction of already shape-accepted surfaces subject
to their remaining implementation gates. No construction was performed by this disposition.
VAL-001 remains independent and must close before canonical reliance on affected governed
executable closures, including the CONTENT character-kind validator. ADAPT-001 remains formally
OPEN; PHEN-ADAPT-001, C2-F-ID-1/2 and all other unexecuted frozen gates remain NOT PASSED.
Allocation is not implementation proof for EVID, REG, IDN or PRJ; previous WRT proof is preserved.

## Multisource public allocation addendum — 2026-09-20

[MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json](MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json)
is the exact permanent inventory for records707..733, all at schema version1, and
occurrence namespace1149. It specifies every field ID, required/optional status,
semantic type, finite bound and tagged-union constraint. The accepted
[public contract](MULTISOURCE_PUBLIC_CONTRACT.md) preceded implementation; this
registry index link was added during the integration audit. The dated allocation
receipt and explicit MS-ALLOC-CORR-001 correction preserve the selector/pattern
transcription history before any model admission.

No existing record or namespace is reinterpreted. All new stage outputs use typed
namespace1149 over the existing runtime allocator; actual observations, experience,
selection and task outputs retain their inherited namespaces. Physical649 and task373
state ownership is unchanged. Future additions append IDs; incompatible schema changes
require an explicit successor version and model identity. No migration of frozen GA,
EMB or prior task images is authorized by this addendum.

## Belief public allocation — 2026-09-20

[BELIEF_PUBLIC_ALLOCATION_TABLE.json](BELIEF_PUBLIC_ALLOCATION_TABLE.json) accepts
records734..746 at schema1 and occurrence namespace1150 before implementation of
[belief-public/0.1-candidate](BELIEF_PUBLIC_CONTRACT.md). Safe observations retain
1115; experience retains1106; all new evidence/application/appraisal/freeze outputs
use1150. Root740 belongs exclusively to authority/belief-expectation. Existing
schemas and images are unchanged. Counters746/13. Exact field grammars are in the
table; absent optional fields are not default values. Incompatible changes require
a successor version and model identity, never rewriting a frozen image.

## AFFECT successor — 2026-09-21

[AFFECT_PUBLIC_ALLOCATION_TABLE.json](AFFECT_PUBLIC_ALLOCATION_TABLE.json) accepts records747..765, schema1, occurrence namespace1151, under [affect-public/0.1-candidate](AFFECT_PUBLIC_CONTRACT.md). Root753 is owned solely by authority/belief-expectation. Existing schemas and frozen images are unchanged. Counters765/19 before qualification.

## Workspace/control successor — 2026-09-21

[WORKSPACE_CONTROL_ALLOCATION_TABLE.json](WORKSPACE_CONTROL_ALLOCATION_TABLE.json)
accepts records766..781, schema1, occurrence namespace1152 under
[workspace-control/0.1-candidate](WORKSPACE_CONTROL_CONTRACT.md). Root771 retains
safe source journals through authority/workspace-observation; root772 caches active
sets only for StoredSet through authority/active-workspace. Existing task373 remains
owned by authority/prospective-commitments. Leaf wrappers780/781 were appended before
model freeze to use the existing closed canonical-record mutation grammar; no generic
canonical-value authority was added. Existing allocations and frozen images are
unchanged. Counters781/16 before qualification,781/0 after VER-C3-WORK-001.

## SKILL successor — 2026-09-21

[SKILL_PUBLIC_ALLOCATION_TABLE.json](SKILL_PUBLIC_ALLOCATION_TABLE.json) accepts
records782..802, schema1, occurrence namespace1153 under
[skill-public/0.1-candidate](SKILL_PUBLIC_CONTRACT.md). Root785 is owned by existing
authority/procedural-skill; root787 by authority/capability-belief. Safe performance
occurrences are profile-local1153, never implicit SEM experiences or ObservationRef237.
Existing ADAPT representations, allocations and frozen models are unchanged.
Counters802/21 before qualification,802/0 after VER-C3-SKILL-001.


## SOCIAL successor — 2026-09-21

[SOCIAL_PUBLIC_ALLOCATION_TABLE.json](SOCIAL_PUBLIC_ALLOCATION_TABLE.json) accepts
records803..816, schema1, occurrence namespace1154 under
[social-public/0.1-candidate](SOCIAL_PUBLIC_CONTRACT.md). Root810 is owned by
authority/person-model with separate holder/local-target keys. Target task373 is
read-only in this profile. Occurrences are profile-local, not implicit SEM experiences.
No predecessor allocations or frozen bytes change. Counters816/14 before verdict,
816/0 after VER-C3-SOCIAL-001.


## HABIT successor — 2026-09-21

[HABIT_PUBLIC_ALLOCATION_TABLE.json](HABIT_PUBLIC_ALLOCATION_TABLE.json) accepts
records817..841, schema1, occurrence namespace1155 under
[habit-public/0.1-candidate](HABIT_PUBLIC_CONTRACT.md). Root821 belongs to
authority/habit-history, root823 to authority/reward-expectation, optional root825
to authority/habit-summary. Occurrences are profile-local, not implicit SEM experience
or ObservationRef237. No prior allocation or frozen bytes change. Counters841/25 before
verdict,841/0 after VER-C3-HABIT-001.


## RELATIONSHIP successor — 2026-09-21

[RELATIONSHIP_PUBLIC_ALLOCATION_TABLE.json](RELATIONSHIP_PUBLIC_ALLOCATION_TABLE.json)
accepts842..862/schema1, occurrence namespace1156 under
[relationship-public/0.2-candidate](RELATIONSHIP_PUBLIC_CONTRACT_REV2.md). Root848 belongs
to authority/relationship-history, root850 to authority/person-model, optional root852
to authority/relationship-summary. Existing808 keys identify each holder/local target.
Content861 enumerates48 authored1038 probe roots for observer/order-stable random
addresses. Profile occurrences are not implicit SEM experiences or ObservationRef237.
No predecessor allocation/frozen bytes change. Counters862/21 before verdict,862/0 after.


## LONGITUDINAL successor — 2026-09-21

LONGITUDINAL_PUBLIC_ALLOCATION_TABLE.json accepts863..883/schema1, occurrence
namespace1157 under longitudinal-public/0.1-candidate. Separate roots867/868/870/
871/872/873 preserve memory/relationship/person/skill/identity/detail ownership;
root875 is the explicitly destructive shared-slot diagnostic. Existing cognitive
occurrence families retain their meanings. No old frozen bytes change. Counters883/21
before qualification. See LONGITUDINAL_PUBLIC_CONTRACT.md.

LONGITUDINAL qualification uses the separately frozen0.2 successor; the0.1 cohort
remains replayable. Allocation bytes and record meanings are unchanged. VER-C3-LONG-001
resets counters to883/0. No general compression or knowledge-view admission follows.


## LEARN scalar successor — 2026-09-21

LEARN_PUBLIC_ALLOCATION_TABLE.json accepts884..896/schema1, namespace1158 under
learn-public/0.1-candidate (LEARN_PUBLIC_CONTRACT.md). Root890 belongs to the
existing belief-expectation authority; safe samples use observation namespace1115.
No predecessor bytes change. Counters896/13 before qualification.

VER-C3-LEARN-001 qualifies the bounded lower-bound profile and resets counters896/0.


## EPI receiving successor —2026-09-21

EPI_PUBLIC_ALLOCATION_TABLE.json accepts897..912/schema1, namespace1159 under
epi-public/0.1-candidate. Root903 belief and911 latest encoding have separate
authorities;912 is researcher-only truth. Counters912/16 before qualification.

VER-C3-EPI-001 qualifies the bounded receiving roster and resets counters912/0.


## Joined REASON successor —2026-09-21

REASON_PUBLIC_ALLOCATION_TABLE.json accepts913..929/schema1, namespace1160
under reason-public/0.1-candidate. Root925 owns the actual acquired identity history;
new source/nucleus records preserve governed semantic keys. Counters929/17 before verdict.

Corrected reason-public/0.3-candidate retains the same913..929 allocation.
VER-C3-REASON-001 qualifies the joined bounded comparison and resets counters929/0.


## Public DECISION successor —2026-09-21

DECISION_PUBLIC_ALLOCATION_TABLE.json accepts930..951/schema1,namespace1161
under decision-public/0.1-candidate. Root946 owns safe historical episodes.
Counters951/22 before verdict. Existing contracts and allocations remain unchanged.

VER-C3-DECISION-001 qualifies the bounded public successor and resets counters951/0.


## Public COMMIT successor —2026-09-21
COMMIT_PUBLIC_ALLOCATION_TABLE.json accepts952..970/schema1,namespace1162.
Separate lifecycle956,identity958 and social965 owners. Counters970/19 before verdict.

VER-C3-COMMIT-001 qualifies the bounded public successor; counters970/0.


## Public agency successor — 2026-09-22
AGENCY_PUBLIC_ALLOCATION_TABLE.json accepts971..988/schema1, namespace1163.
Observer980 and actor archive984 have separate owners. Counters988/18 before verdict.


## Public goal/strategy successor — 2026-09-22
GOAL_STRATEGY_PUBLIC_ALLOCATION_TABLE.json accepts989..1007/schema1,namespace1164.
Goal994,plan996 and knowledge1000 have separate owners. Counters1007/19 before verdict.
Record1000 is distinct from identifier namespace1000; no ordinal is skipped.


## CONTROL public allocation — 2026-09-22
control-public/0.1-candidate allocates1008..1016/schema1; no new typed namespace.
See CONTROL_PUBLIC_ALLOCATION_TABLE.json. Inherited habit occurrences retain1155.
Counters1016/9 before verdict.

CONTROL0.2 adds1017..1024/schema1 for the two-reason typed successor chain;
no namespace change. Prior1008..1016 layouts unchanged. Counters1024/17.


## REAPPRAISAL public allocation — 2026-09-23
reappraisal-public/0.1-candidate accepts1025..1039/schema1, namespace1165.
See REAPPRAISAL_PUBLIC_ALLOCATION_TABLE.json. Counters1039/15 before verdict.


## Recollection public allocation — 2026-09-23
Accepted recollection-public/0.1-candidate; records1040..1054/schema1, namespace1166.
Exact layouts: RECOLLECTION_PUBLIC_ALLOCATION_TABLE.json. Before implementation;
ModalFill, FragmentOnly, KeepDetail, TruthRestore and ReencodeGuess named in contract.
Counters1054/15 before verdict; no existing record or namespace is changed.


## Familiarity public allocation — 2026-09-23
Accepted familiarity-public/0.1-candidate; records1055..1067/schema1, namespace1167.
Exact layouts: FAMILIARITY_PUBLIC_ALLOCATION_TABLE.json. Named comparison laws precede
implementation. Counters1067/13 before verdict; existing records/namespaces unchanged.


## Communication public allocation — 2026-09-23
Accepted communication-public/0.1-candidate; records1068..1082/schema1, namespace1168.
Exact layouts: COMMUNICATION_PUBLIC_ALLOCATION_TABLE.json. Named comparisons precede
implementation. Counters1082/15 before verdict; existing records/namespaces unchanged.

## Deliberate lying — 2026-09-24
Accepted lying-public/0.1-candidate before implementation. Records1083..1097/schema1,
namespace1169. Exact layouts: LYING_PUBLIC_ALLOCATION_TABLE.json. Counters1097/15
before verdict; existing allocations and frozen communication cohort unchanged.

## Emotional display — 2026-09-24
Accepted emotional-display-public/0.1-candidate before implementation. Records1098..1113/schema1,
namespace1170. Exact EMOTIONAL_DISPLAY_PUBLIC_ALLOCATION_TABLE.json. Counters1113/16
before verdict; no prior allocation or frozen cohort changes.

## Communication interpretation — 2026-09-24
Accepted interpretation-public/0.1-candidate before implementation. Records1114..1130/schema1,
namespace1171. Exact INTERPRETATION_PUBLIC_ALLOCATION_TABLE.json. Counters1130/17
before verdict. Previous allocations and frozen cohorts are unchanged.


### Attributed knowledge public allocation — 2026-09-24
Accepted attributed-public/0.1-candidate allocates1131..1147/schema1 and occurrence
namespace1172 before implementation. ATTRIBUTED_PUBLIC_ALLOCATION_TABLE.json is exact.
Prior allocations/contracts remain frozen. At allocation: counters1147/17 pending
qualification. VER-C3-ATTRIBUTED-001 subsequently closes this bounded profile at1147/0.


### Person-state dissociation allocation — 2026-09-24
Accepted personstate-public/0.1-candidate allocates1148..1164/schema1 and occurrence
namespace1173 before implementation. PERSONSTATE_PUBLIC_ALLOCATION_TABLE.json governs.
At allocation: counters1164/17; qualification pending. No prior allocation changed.

The0.1 personstate timing cohort is superseded by0.2: appraisal130 follows actual
intent70, before learning140. Exact schema/allocation bytes are unchanged; corrected
contract and model identities are refrozen. Preserve personstate-rev1.
VER-C3-PERSONSTATE-001 closes the corrected bounded0.2 profile at counters1164/0.

## Fear/guilt attribution public profile — 2026-09-24

LOCAL DISPOSITION: records1165..1177/schema1 and occurrence namespace1174 are permanently allocated by FEAR_GUILT_PUBLIC_ALLOCATION_TABLE.json under fear-guilt-public/0.1-candidate. No prior allocation is changed. Counters1177/13 before verdict.

## Person-goal inference — 2026-09-24

LOCAL DISPOSITION: records1178..1194/schema1 and occurrence namespace1175 allocated by PERSON_GOAL_PUBLIC_ALLOCATION_TABLE.json under person-goal-public/0.1-candidate. Prior allocations unchanged. Counters1194/17 before verdict.

## Hearsay versus direct evidence — 2026-09-24

LOCAL DISPOSITION: records1195..1206/schema1 and occurrence namespace1176 allocated by HEARSAY_PUBLIC_ALLOCATION_TABLE.json under hearsay-public/0.1-candidate. Prior allocations unchanged. Counters1206/12 before verdict.

## Relationship dimensions — 2026-09-24

LOCAL DISPOSITION: records1207..1220/schema1 and occurrence namespace1177 allocated by REL_DIMENSIONS_PUBLIC_ALLOCATION_TABLE.json under rel-dimensions-public/0.1-candidate. No prior allocation changes. Counters1220/14 before verdict.

## rel-attribution-public/0.1-candidate — 2026-09-24

Records1221..1234/schema1 and occurrence namespace1178 permanently allocated
by REL_ATTRIBUTION_PUBLIC_ALLOCATION_TABLE.json under REL_ATTRIBUTION_PUBLIC_CONTRACT.md.
14 records this increment; counters1234/14 before verdict. Prior allocations unchanged.

## familiar-valence-public/0.1-candidate - 2026-09-25

Records1235..1249/schema1, namespace1179 permanently allocated by
FAMILIAR_VALENCE_PUBLIC_ALLOCATION_TABLE.json under FAMILIAR_VALENCE_PUBLIC_CONTRACT.md.
Counters1249/15 before verdict; no prior allocation changed.

## attachment-public/0.1-candidate - 2026-09-25

Records1250..1263/schema1, namespace1180 permanently allocated under
ATTACHMENT_PUBLIC_CONTRACT.md and ATTACHMENT_PUBLIC_ALLOCATION_TABLE.json.
Counters1263/14 before verdict; prior allocations unchanged.

## betrayal-public/0.1-candidate - 2026-09-25

Records1264..1277/schema1, namespace1181 permanently allocated under
BETRAYAL_PUBLIC_CONTRACT.md and BETRAYAL_PUBLIC_ALLOCATION_TABLE.json.
Counters1277/14 before verdict; prior allocations unchanged.

## grief-public/0.1-candidate - 2026-09-25

Records1278..1291/schema1, namespace1182 permanently allocated under
GRIEF_PUBLIC_CONTRACT.md and GRIEF_PUBLIC_ALLOCATION_TABLE.json.
Counters1291/14 before verdict; prior allocations unchanged.
