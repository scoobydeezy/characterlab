# Measurement prediction — symbolic closure, revision 1

2026-09-09. Agent-authored proposal. **Not allocated or implementation-ready.**
Completes the registration/occurrence/stage proposals left open by
CAMPAIGN2_MEASUREMENT_PREDICTION_DRAFT.md; does not claim an external verdict.
All new names below are symbolic. Existing numbers identify reused contracts only.

## Exact symbolic records

Fields listed in schema order, all required. Record names allocate no numbers.

| New record | Fields |
|---|---|
| MeasurementPredictionDefinition | SourceChannelId; ObservedSubjectId; UnitId; MaxEvidenceCount:unsigned |
| MeasurementPredictionKey | CharacterId; PredictionDefinitionId |
| MeasurementPrediction | ExpectedReading:rational; EvidenceBasis:set<CharacterEvidenceRef/237> |
| MeasurementPredictionState | Predictions:map<MeasurementPredictionKey,MeasurementPrediction> |
| MeasurementPredictionTargetRequirement | SubjectAccessor; PredictionDefinitionId; TargetStatePathTemplate:StatePathPattern; OutputAccessor |
| MeasurementPredictionApplicationRegistration | ExecutingSeamId; ExecutingSeamVersion:text; PredictionDefinitionId; InputAdmission:274; ReadDomain:set<StatePathPattern>; OutputDefinitions:set<277>; WriteCapability:322; IngressDefinition:276; SubjectRequirements:set<343>; TargetRequirements:set<MeasurementPredictionTargetRequirement> |
| MeasurementPredictionReadCue | ObserverId; PredictionDefinitionId |
| MeasurementPredictionReadout | MeasurementPredictionReadoutId; Key:MeasurementPredictionKey; Prediction:MeasurementPrediction |
| MeasurementPredictionReadOutputDefinition | OutputRecordSchema:254; OutputOccurrenceRule:275 |
| MeasurementPredictionReadRegistration | ExecutingSeamId; ExecutingSeamVersion:text; PredictionDefinitionId; InputRecordSchema:254; OpportunityDefinitionId; ReadDomain:set<StatePathPattern>; OutputDefinitions:set<MeasurementPredictionReadOutputDefinition>; WriteCapability:273; SubjectRequirements:set<266>; TargetRequirements:set<MeasurementPredictionTargetRequirement> |
| MeasurementPredictionOpportunityDefinition | ProducingTransitionKind; ApplicationEventTypeId; ReadEventTypeId; PredictionDefinitionId; ReadDelay:signed SimDuration |

Eleven new record shapes; one new occurrence family, MeasurementPredictionReadoutId.
No new ObservationId, source hash, application-result ID, cue occurrence ID, episode
ID, random address or evidence-reference union. CharacterEvidenceRef/237 observation
variant is existing tag1, with only its existing ObservationId/1115 payload present.
Do not introduce a tenth variant or narrow the generic union globally.

The readout deliberately omits a duplicate transformation-version field: its exact
producer registration/version, schema and trace establish its interpretation. This
does not remove version fields from342/337/203. No current or future consumer gains
authority merely from possession of a structurally valid readout.

## Governing symbols and exact role ownership

Reused families: SeamId1036, TransitionKind1009, EventTypeId1001,
RegistryDefinitionId1027, RegistryKindId1023, MutationAuthorityId1025,
Campaign2StateFamilyId1031, leaf family1032, ProjectionAccessorId1028,
ObserverId1000, CharacterId1002, ObservationChannelId1005, ObservationUnitId1039.
Their accepted payload grammar is unchanged.

The symbolic stable members needed by this proposal are:

- seam/measurement-prediction
- MeasurementPredictionApplicationTransition; MeasurementPredictionReadTransition
- event/measurement-prediction-application; event/measurement-prediction-read
- event/measurement-prediction-application-padding;
  event/measurement-prediction-read-padding
- definition/measurement-prediction;
  definition/measurement-prediction-opportunity
- registry/measurement-prediction;
  registry/measurement-prediction-opportunity
- authority/belief-expectation; leaf/measurement-prediction
- accessor/measurement-prediction-prior;
  accessor/measurement-prediction-read

Existing accepted ResolvedCharacterSubject accessor and character-qualification
validator are reused. No replacement IDN accessor or validator is created.

Every new field of an identity type has its exact role. CharacterId and this first
profile's ObservedSubjectId use1002 with the accepted character qualifier;
ObserverId uses1000 with absent DomainValidator; channel1005 and unit1039 have absent
DomainValidator. The latter also receives exact diagnostic-member admission from
the profile. Definition references use1027, absent DomainValidator, with exact
kind/member/equality checks in the compiler. Accessor, seam, transition, event and
authority positions use their existing families and absent DomainValidator unless
an existing governing contract expressly requires otherwise. The new readout's
identity field uses its single newly reviewed occurrence family, once allocated.

Required embedded records are schema positions, not identity-role positions. Reuse
existing203/2 ObserverId and237/2 ObservationId role declarations without duplicates.
Existing observation.SubjectId remains generic outside this bounded profile.

## Application registration and admission

The normal registration has exactly one342/schema1 input, authenticated registered
M1 producer, accepted immediate generated-child ingress276 at same DueAt/phase140,
empty OutputDefinitions, StateWrites322 naming only authority/belief-expectation
and logical belief/expectation family. It contains one exact M2 subject requirement
and one prediction-target requirement. Required subject path remains342/2→337/2→203/2.

ReadDomain contains the existing roster pattern and the one prediction-leaf pattern.
The target requirement binds the subject projection and registration's one compiled
definition ID to the exact key before a prior leaf can be read. It returns the
whole direct leaf/absence, not an arbitrary selector or derive callback.

The application-ablation registration uses the same record with a distinct semantic
version, NoStateWrites322, roster-only ReadDomain, empty target requirements and
empty output definitions. It still admits the real342 and performs IDN qualification.
It neither reads nor writes a prediction and emits no children or semantic output.
The opportunity producer remains M1. An ablated application is not a failed normal
application and does not make its model's initially empty belief state materialize.

Only the application joins the existing character-learning TransitionRoutes map;
M1 retains its accepted membership. The later read is a cognitive projection with
no LearningRouteId. Its readout is not a new learning-evidence record. Padding has
no route. Future consumers still need exact admission and may not bypass a learning
authority through this readout.

Compiler checks are exact, not optional modes. Writable admission is not implemented
by broadening V04, V06 or the accepted memory formation registration. This new
bounded registration is selected by its own version and successor model.

## Read registration and its absent branch

The read registration directly states the exact cue schema and opportunity entry.
It does not misuse274 to claim that a delayed cue is an immediate producer output.
The private pending association must match event identity, type, DueAt, phase,
payload, dependency bytes and parent exactly before cue extraction or state access.

Normal read registration has NoStateWrites273, existing cue-top-level IDN requirement,
one target requirement, roster plus prediction ReadDomain and exactly one new
MeasurementPredictionReadOutputDefinition. That definition's semantics is one
readout iff the authorized direct leaf is present. Its275 occurrence rule uses
the readout's first required field and fresh shared allocation. It is not277's
unconditional output cardinality.

Read ablation has a separately named semantic version, roster-only ReadDomain,
empty target requirements and empty output definitions. It preserves IDN and one
private runtime ordinal slot but performs no belief read or output. No special
caller flag or injected resolver is admitted in either branch.

Normal present, normal absent, read ablation and suppressed future padding each
consume exactly one runtime ordinal at their declared read slot. Only normal
present wraps its ordinal as MeasurementPredictionReadoutId. Private padding is
not an occurrence or character knowledge. The application slot consumes zero
runtime ordinals in every branch. Existing event/sequence allocation remains real.

## M1 opportunity and suppression closure

The opportunity entry binds the actual M1 transition, both new event types, the
prediction definition and positive ReadDelay=1. M1 still emits precisely its one
existing342. A new profile changes generated child closure, not342 content/version.

Canonical child emission order at the M1 event:

1. Existing memory formation child at140, unchanged payload342.
2. Prediction application child at140, the same exact342.
3. Prediction read cue at T+1/40, containing only nested source ObserverId and the
   opportunity's committed prediction definition ID.

At the existing M1 suppression-padding slot, mirror those three scheduling slots:
existing memory formation padding, private prediction application padding at140,
private prediction read padding at T+1/40. Padding payloads are existing empty
canonical lists; none is a public cue or admitted cognitive input.

T+1 is checked in every branch, including suppression. Overflow fails the whole
instant with existing INSTANT_OVERFLOW. A denied observation cannot be used to
populate the private cue with its measurement, source IDs or owner information.
No prediction opportunity is generated by application, state presence or episode
formation. Future memory recall at20 retains its independently generated identity,
payload and authority. Numeric adjacency of read slots has no psychological meaning.

At140, new application-padding events participate only in their named private
dispatcher slots. Ordinary external140 scheduling remains rejected. All planned
prediction targets are sealed before prior belief evaluation. IDN subject reads
may precede target collision detection, because subject qualification is required
to derive the path; **prior prediction reads may not**. This explicit distinction
prevents a false claim that every state read precedes no collision.

## Failure representation and ordering correction

No new failure record or numeric failure namespace is proposed. Existing scheduler
FailureDiagnostic's code is text; add the following exact seam-owned alternatives
to the successor's declared runtime failure closure:

    PREDICTION_OBSERVATION_ALREADY_APPLIED
    PREDICTION_EVIDENCE_LIMIT_EXCEEDED
    PREDICTION_TARGET_COLLISION
    PREDICTION_STAGE_VIOLATION

The earlier proposed PredictionSourceMismatch name is not retained: exact source
domain/target mismatch is INPUT_NOT_ADMITTED, owned before projection. Malformed
canonical bytes, role failures, invalid retained state, illegal reads, WRT and stale
patch preconditions retain their existing first-failure owners. New errors must
not catch and relabel an earlier substrate error.

Stage errors cover unauthenticated late/reused work, missing/extra batch execution
and premature/reentrant finish. Negative proof must distinguish those cases from
eventual generic state validation. Duplicate source support is tested after the
actual prior read; evidence limit follows that freshness check. No failure produces
a successful application result or partial commit.

## State and model/profile packaging obligations

Materialize only belief/expectation in addition to the accepted memory successor's
families. Key/value/ownership declarations use existing state grammar records,
CanonicalRecord, exact map-entry paths and non-removable ownership. Other logical
unmaterialized families stay unmaterialized. WRT's effective family/path checks
must apply to the new registration, not just the already qualified ADAPT handlers.

A new full Rules/Registry/Trace/Persistence/Numeric profile tuple is required.
Numeric binding must explicitly cover exact rational mean and the64-support domain;
it cannot inherit permission from numeric/exact-1's name. Existing stable source
contracts retain their original versions and output bytes. No old manifest is
rewritten to add entries. One exact model commitment owns the complete successor.

The six-slot registry packaging must place each new record schema, role, state
declaration, transition registration, opportunity, bundle entry and occurrence rule
in its existing responsible slot. Target/subject requirements live in the new
transition registration, not a second global accessor registry.

Before allocation, the combined inventory must demonstrate bidirectional coverage:
every needed symbol has one schema/member/role home, and no allocated symbol is
orphaned. Before runtime qualification, profile materialization must enumerate
actual EventSequence-generated stage order and work budget. No hard-coded event
count is asserted by this symbolic packet.

## Restore and trace closure

One trace160 per executed event, including private padding. Application records its
342 input, actual IDN/prior read, exact patch/diff and no semantic output/children.
M1 trace records the three actual children; the delayed read records its real cue,
IDN and authorized prior read, conditional output and no patch. The readout does
not acquire a direct observation/truth lookup merely because its basis lists IDs.

The cue has no occurrence identity: its read trace uses InputProjection=cue and
SourceRecordIds=empty. The actual scheduler parent is M1, and the state dependency
is the actual prediction read. Do not forge a source occurrence from the cue's
definition ID or from the readout allocated later. Application SourceRecordIds is
the actual342 identity. Private padding has empty source/subject/read/output/patch
projections except its real emitted-event slots and allocator behavior.

Persist the real allocated future cue/padding and pending association. Reconstruct
those private facts only by executing the committed prefix from original S0 and
inputs and matching the entire save exactly. Never rebuild them from a believed
mean, a support ID, a public save certificate or current REG determinants.

Prediction initial state is empty. Restore may admit nonempty state only through
the existing-style complete prefix proof. Range, role and denominator checks are
necessary but not sufficient to authenticate the mean's history/owner. Failure
status remains terminal, saves quiescent, and whole-instant rollback includes both
prediction children and the preserved memory/ADAPT work.

## Adversarial review findings and remaining gate

This pass corrected four avoidable additions/ambiguities: no application occurrence;
existing observation-reference237 rather than a parallel basis type; delayed cue
admission rather than pretending274 admits delay; explicit IDN-before-collision
versus prior-belief-after-collision ordering. It also retains the conditional output
cardinality instead of incorrectly reusing unconditional277.

Still a proposed whole shape: review the complete target/draft/closure against the
authority hierarchy, including whether a mean without calibrated uncertainty earns
only the stated bounded prediction claim. Then perform separate allocation and
profile materialization review. No runtime vector, source update, or Campaign2
completion is passed by this document.
