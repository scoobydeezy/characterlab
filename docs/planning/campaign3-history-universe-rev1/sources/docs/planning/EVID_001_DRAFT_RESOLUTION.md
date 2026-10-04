# EVID-001 — Draft resolution — revision 5

**Status: SHAPE ACCEPTED**, revision 5, `character-learning-evidence/0.5-candidate`, 2026-09-05.
Companion `transition-admission/0.4-candidate` is **SHAPE ACCEPTED**, NoStateWrites-only.
Resolution recorded in [OPEN_DECISIONS](../formal/OPEN_DECISIONS.md).

```
canonical implementation      NOT YET AUTHORIZED
permanent numeric allocation  deferred to Campaign 2 F
EVID-A..T                     frozen implementation gate, NOT PASSED
existing suite                no new implementation evidence implied
```

Acceptance includes only the reviewed symbolic contract and the four editorial clarifications below;
there is no revision-6 design pass and no psychological/reduction verdict.

SeamId: `seam/character-learning-evidence` (symbolic).
Owner: Campaign 2 consequence-evaluation / evidence seam.
Architecture edges: consequence SemanticExperience → OutcomeEvaluation → OutcomeLearningEvidence.
Depends on: accepted `semantic-binding/0.1-candidate` including SEM-001G/H/I/J;
PRJ/IDN remain settled contracts for later state addressing, not EVID read dependencies;
`ordering/0.2-candidate`, `ordering-phases/2-candidate`, `trace/0.2-candidate`,
`state/0.2-candidate` with accepted WRT addendum. Transition-route vocabulary is owned below; no dependency on ADAPT acceptance or its persistent-state routing table.
Supersedes: nothing. In particular, neither Campaign 1 nor its immutable allocation is extended here.

## Substrate inspection findings

| Surface inspected | What exists and what this draft may use |
|---|---|
| Authority and status | OPEN_DECISIONS closes SEM-001 through SEM-001J and IDN-001 at shape level. Older active-direction paragraphs in AGENTS and the campaign plan still describe unfinished Campaign 1. Their historical status text does not undo the explicit accepted resolution records. VAL-001 remains a P1 follow-up; it does not block this draft, REG drafting, or F. |
| Consequence experience | EVENT_SEMANTIC_SCHEMA_INVENTORY fixes `PreRecognitionSemanticExperience`, canonical type 227/schema 1, keyed by existing `ExperienceId` (1106), with `ObserverId`, `OccurredAt`, event-file set, perceived bindings, continuant classifications, event classifications, supporting observations, and transformation version. `SemanticExperience` is the architecture term; type 209 `ThinSemanticExperience` is a restricted control, not this input. There is **no canonical lane field**, attempt identity, expected result, perceived success, reward, or truth outcome field. |
| Lane and provenance | `phaseOrdering.ts` reserves at 120 and freezes at 124. Reservation, staged experience, and frozen recognition request are transaction-local, not durable record types. Successful reservation↔envelope is bijective. SEM-001G gives schema/version/producer admission and same-observer scope, with separate character and omniscient graphs. `ObserverSafeEvidenceOccurrence` is a derived index, not stored authority. |
| Reference grammar | `evidenceProvenance.ts` and canonical type 237 admit exactly nine CharacterEvidenceRef variants. Neither an experience nor an OutcomeEvaluation nor OutcomeLearningEvidence is one. A raw ID cannot be smuggled into that union. This draft uses complete immediate-source canonical values, preserving their existing IDs, rather than allocating an experience-reference type or broadening that union. |
| Actual codecs | `semanticSchemaRegistry.ts` supplies the accepted schema and occurrence namespaces; `semanticCodecs.ts` supplies strict registry-backed canonical construction/decode. The convenience `preRecognitionSemanticExperienceValue` in `semanticEvidenceCodecs.ts` currently writes an empty `PerceptualEventClassifications` set. It must not be mistaken for a lossless encoder of every accepted full envelope. EVID requires the already-canonical complete value byte-for-byte; any adapter must prove preservation of nonempty event classifications. No codec correction is attempted here. |
| Transition admission | `TransitionSeamContract` in `src/substrate/transition.ts` currently contains seam identity/version, record kind, mutation authority, static state ReadDomain and bindings. The handler constructs the projection before calling the transition; it has no general payload admission declaration or output-schema enforcement. SEM-001G's evidence-domain resolver is a separate existing mechanism. PRJ §1.5 has **shape-accepted** admission-before-selector ordering. Do not mistake a typed helper or a phase guard for generic runtime enforcement. |
| TransitionDefinition | ADAPT §2.13d proposes TransitionKind, TransitionRoute, ReadDomain, AcceptedBasisKinds, OutputRecordSchemas, WritableStateFamilies. There is no implemented TransitionDefinition in src. Revision 2 replaces that provisional generic shape below. ADAPT consumes the same definition; generic admission and no-write semantics are not deferred to ADAPT C. |
| Occurrence/output identity | Scheduler allocates event IDs and EventSequence separately from the global runtime occurrence allocator. SEM-001I requires one identity rule per occurrence and explicit result identities. Outputs are canonical values staged with the complete instant; they are not automatically assigned domain identities. Runtime allocation, output staging, events, and trace roll back together. |
| Existing evaluation/evidence records | Searches for OutcomeEvaluation and OutcomeLearningEvidence in src and reference/src find no record representation. `phaseOrdering.ts` has only OutcomeEvaluationReadKind/assertOutcomeEvaluationRead and adaptation-output guards; these are boundary controls, not an evaluation schema. Historical mechanisms in REFERENCE_MECHANISM_LEDGER remain controls, not missing canonical record definitions to copy. |
| Phase 130 | Accepted scheduling allows a same-phase child with later EventSequence. Two separately traced transitions at 130 therefore need no new subphase, ordering decision, or persistent intermediate store. Phase 140 follows both; 150 remains non-schedulable. |
| Payload projection attachment | A ScheduledEvent has one canonical payload. PRJ selects one **required top-level field** of the admitted payload; it is not a nested selector language. Type 227 already has the required ObserverId field. IDN's exact requirement can attach there without a request wrapper, resolver identity, or binding occurrence. |

Inspection anchors: [schema inventory](../formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md),
[semantic contract](../formal/EVENT_SEMANTIC_BINDING.md),
[substrate addenda](SUBSTRATE_ADDENDA_DRAFT.md), [IDN](IDN_001_DRAFT_RESOLUTION.md),
[ADAPT §2.13](ADAPT_001_DRAFT_RESOLUTION.md),
[transition API](../../src/substrate/transition.ts),
[scheduler](../../src/substrate/scheduler.ts),
[phase oracle](../../src/semanticBinding/phaseOrdering.ts),
[evidence resolver](../../src/semanticBinding/evidenceProvenance.ts).

## Inspection disposition and rejected revision-1 proposal

Revision 1 correctly identified the IDN permission conflict but proposed the wrong remedy.
**Permission widening is rejected.** EVID remains observer-relative, with no CharacterId, roster
read, subject resolver, or required-projection failure. An unbound observer can produce both outputs.
A later character-state consumer must earn its subject-addressing input shape before invoking accepted PRJ/IDN.
Revision 4 removes the duplicate ObserverId indexes; the nested experience is the sole stored observer source.
IDN stays closed at `identity-binding/0.5-candidate`; this revision neither amends nor reopens it.

**Existing representations are insufficient for the generic semantics.** Inspection of
`TransitionSeamContract`, `SemanticTransitionResult`, `ScheduledEvent`, `EventEmission`,
`StatePatch`, `PermittedEvidenceSchema`, `EvidenceReadDomain`, `SemanticRegistryEntry`, and
`compileRegistryManifest` establishes:

- SEM's evidence-domain grammar admits existing reference kinds and scope. It cannot express a
  complete experience/evaluation payload, immediate producer equality, dispatch cardinality or
  phase placement. Extending it to arbitrary scheduled payload admission would change its meaning.
- The scheduler carries payload, phase, parents and outputs; these are facts, not committed rules
  saying which consumer may admit which producer output. Dependencies is an arbitrary canonical
  value, not an admission language to repurpose.
- An empty StatePatch is expressible, but the live contract always requires a MutationAuthorityId.
  No accepted discriminated write capability or generic TransitionDefinition exists in src.
- CanonicalRecordSchemaRef, canonical records/sets/closed unions, StatePathPattern, existing typed
  seam/transition/authority identities, and SemanticRegistryEntry already express the **encoding
  building blocks**. RegistryManifestDigest → RegistryIdentity → ModelIdentity already commits them.

Therefore the section below is an explicit **shape-accepted shared substrate addition**, not a private
EVID registry, replacement scheduler, evidence-reference extension or parallel provenance mechanism.
Its symbolic shape is accepted here, with canonical implementation still gated on F.
ADAPT C specifies adaptation refinements later and does not own this prerequisite's generic shape.
VAL-001 stays the existing P1 follow-up, not a pre-allocation blocker.

## Semantic purpose

**Explicit shape decision:** OutcomeEvaluation is a structurally distinct evaluation-stage
occurrence whose only assertion is: this exact observer-safe consequence experience crossed the
governed outcome-evaluation boundary. It asserts no outcome interpretation. This is an identity-like
scaffold witness, not Architecture §14 outcome-evaluation capability. Richer evaluation must earn
its own later schema/version, dependencies and discriminating phenomena.

EVID earns no RETAINED status for OutcomeEvaluation as a distinct causal seam. It preserves the
seam in the initial scaffold; later experiments must test whether it can safely collapse.

## Required phenomena

The immediate witness is ADAPT's inhabited character-learning output closure and both-affected
control under PHEN-ADAPT-001 `1.8.0-draft` (corpus `0.24.0-draft`). Preserve PHEN-EPI-001,
PHEN-SEM-001 and PHEN-DET-001 boundaries. This slice supplies evidence to future PHEN-LEARN-001
work; it does not claim learning, memory, or behavioral success for that phenomenon.

## Domain and codomain

Proposed exact symbolic records; every listed field is required, no others admitted:

```text
OutcomeEvaluation
    OutcomeEvaluationId       new typed runtime occurrence identity; numeric namespace deferred
    ConsequenceExperience     complete immutable canonical PreRecognitionSemanticExperience
    TransformationVersion     character-learning-evidence/0.5-candidate (accepted immutable contract identifier)

OutcomeLearningEvidence
    OutcomeLearningEvidenceId  distinct new typed runtime occurrence identity; numbers deferred
    Evaluation                   complete immutable canonical OutcomeEvaluation
    TransformationVersion        same EVID version as its producer
```

The first transition payload is existing full type-227 X; the second is full E. Inspection found
no accepted committed cross-field equality or materialized-index constraint: RecordSchema supplies
field presence, CanonicalRoleConstraint supplies identity role, and PRJ projects state fields. None
proves a stored field equals a nested field on construction/decode/restore. Seam-specific helpers
are not a generic governed equality mechanism. Therefore revision 4 removes both redundant
ObserverId fields instead of adding such a mechanism for an unbuilt downstream consumer.

```
observer(E) = E.ConsequenceExperience.ObserverId
observer(L) = L.Evaluation.ConsequenceExperience.ObserverId
```

These are trace/semantic view extractions from the single stored fact, not new payload fields or
canonical equality constraints. EVID selects no state subject. A future learning seam must earn
its own wrapper, nested-selector or materialized-index contract if state addressing needs one.
The route contains typed evidence families; OutcomeLearningEvidence remains solely outcome-derived.
No universal CharacterLearningEvidence alias or speculative source variant is introduced.

Embedding means a value copy of the same immutable occurrence, not another occurrence or a mutable
second authority. Both embedded values must equal their actual immediate producer outputs exactly.
This deliberately trades bytes for a self-contained permitted basis without trace dereferencing.
Existing support references retain SEM's permissions; merely carrying them grants no new read.

## Units, ranges, and applicability

No new scalar, unit, score, confidence, precision, enum, or outcome category. Existing timestamps,
boolean facets and collections keep their accepted domains. All valid consequence envelopes in this
single-observer slice qualify, including ambiguous, empty-classification and explicitly-false cases.
No output asserts that an absent facet is false or that an unobserved event did not happen.

## Registered ReadDomain and capability-limited projection

Both transitions have ReadDomain = {}, no bindings, and no direct, derived or event-dependent
accessor. Their evidence-reference read sets are also empty. Carrying nested SEM support references
grants no permission to dereference them. No selector is executed inside EVID.

## Actual-read recording and derived-input provenance

ActualReadRecords is empty for both transitions. Input/output projections record canonical payloads.
Producer matching uses trusted staged outputs and scheduler causality internally; no trace, roster,
world-state, parent-event or arbitrary state handle is exposed to the semantic transformation.
The live EventHandlerContext contains state and event metadata: the future generic entry adapter
must retain it internally and expose only the admitted payload and declared capabilities. Merely
using an empty ContractReadProjection while passing context.state to EVID would fail this contract.

## Authoritative StatePatch writes and sole MutationAuthorityId

Both declare WriteCapability = NoStateWrites. Derived WritableStateFamilies = {}. No authority
field or placeholder authority is present. Empty accepted patches and structural diffs are required;
a nonempty patch fails, even if its operations would leave values unchanged. Shared semantics are
frozen below; this is no longer a packaging question deferred to ADAPT C.

## Epistemic permissions and forbidden knowledge

Only the admitted experience's existing observer-safe values pass through. No CharacterId,
WorldEventId, truth binding, truth handle/hash, EffectProvenance, Applied/Overflow truth, objective
success, or extra cross-observer linkage enters the output. No AutomaticAdaptationInput is admitted.
No projection, truth comparison, belief lookup, appraisal or causal attribution occurs.

## Shared transition substrate — accepted symbolic shape

Version `transition-admission/0.4-candidate`, shape accepted 2026-09-05.
EVID consumes this version directly. ADAPT reuses the accepted admission/output/ingress/route
substrate but must earn a versioned StateWrites extension, after freezing its exact state-family
referent, before its writing transitions can be represented. ADAPT also owns any variable-output
extension needed by its rule-indexed results. This accepted base has no MutationAuthorityId,
WritableStateFamilies, StateFamilyId or StateWrites field/variant; WritableStateFamilies(T) = {}
is a derived fact only. Generic execution does not require learning-route membership.
Campaign 0/1 records and accepted behavior are not reinterpreted.

### Inspection findings that determine the representation

- `TransitionKindId` is accepted namespace **1009**, in EVENT_SEMANTIC_NUMERIC_REGISTRY and
  semanticSchemaRegistry.ts; EvidenceReadDomain type 256 already uses it. The family exists, but
  the two new EVID transition members and their registrations still await F. There is no need for
  a new identity family and no canonical SEM-freeze TransitionKind to reuse or fabricate.
- The accepted semantic contract names `seam/event-truth-to-pre-recognition-experience`.
  `SEMANTIC_PHASE_CONTRACT_VERSION` in phaseOrdering.ts is literally
  `semantic-binding/0.1-candidate#SEM-001H`; semanticCodecs.ts admits that exact value and
  semanticPhaseOrdering.test.ts asserts it. This draft preserves that governed literal. It is
  production-phase contract metadata, not a replacement for X.TransformationVersion or the parent
  seam's `semantic-binding/0.1-candidate` version.
- SEM-001I's inventory defines occurrence identities explicitly, but RecordSchema contains only
  type/version/name/field descriptors. No executable generic schema→identity-position declaration
  was found. Per-schema helpers are not a generic identity registry. The additive declaration below
  records the existing SEM identity rule without changing it.
- The scheduler has SchedulerContractError with a flat SchedulerFailureCode and type-162 diagnostic;
  there is no typed transition-contract error class/union. Generic errors become TRANSITION_FAILURE.
  INPUT_NOT_ADMITTED is named by accepted PRJ but is not yet a live SchedulerFailureCode member.
  STATE_VALIDATION_FAILURE, EVENT_VALIDATION_FAILURE and INVARIANT_FAILURE do not express the new
  distinctions. The additive flat members below preserve the existing diagnostic schema.

### Generic execution registration

Required fields unless a union forbids them; all collections are duplicate-free canonical sets or
maps. Reuse CanonicalRecordSchemaRef, StatePathPattern, typed identities and cenc/1 closed unions.

```
TransitionDefinition
    InputAdmission           TransitionInputAdmission
    ReadDomain               set<StatePathPattern>
    OutputDefinitions        set<TransitionOutputDefinition>, unique by OutputRecordSchema
    WriteCapability          NoStateWrites — sole admitted variant in this version

TransitionRegistration
    ExecutingSeamId          existing seam identity representation
    ExecutingSeamVersion     exact governed version, no wildcard
    TransitionDefinition     complete record above
    IngressDefinition        complete record below

WriteCapability
    NoStateWrites            no payload; authority/family fields forbidden

TransitionIngressDefinition
    ConsumerEventTypeId      existing scheduler event-type identity representation
    DueAtRule                SameAsProducer (only admitted value)
    ConsumerPhase            registered schedulable phase, never 150
    PayloadRule              ExactAdmittedSourceOutput (only admitted value)
    Multiplicity             ExactlyOncePerSourcePerConsumer (only admitted value)
```

A single SemanticRegistryEntry uses the transition's namespace-1009 identity as StableId,
TransitionRegistration as Definition, RegistryKindId member `registry/transition-registration`, and this shared
version as DefinitionVersion. TransitionKind is **that key**, not a duplicated field. No
TransitionRegistrationId, IngressId, InputAdmissionId or WriteCapabilityId is introduced.

Within one admitted model: each registered TransitionKind determines exactly one executing
seam/version and one ConsumerEventTypeId. A consumer event type cannot be assigned to two transition
registrations. Event dispatch and trace must agree with this committed mapping; a callable handler
installed under the same event ID cannot override the seam/version or registration. Registered
producers resolve through this relation, never through an assumed free-text seam name.

### Required output production and generative ingress

```
TransitionOutputDefinition
    OutputRecordSchema       CanonicalRecordSchemaRef
    Multiplicity             ExactlyOnePerExecution (only admitted value)

OutputRecordSchemas(T) = { d.OutputRecordSchema : d in T.OutputDefinitions }
```

OutputDefinitions is a canonical set unique by schema; two definitions for one schema fail model
construction, even if equal. For every successful registered execution the result contains exactly
one complete domain output of each declared schema and no others. Zero, two distinct outputs, two
copies of one output, and wrong schemas are TRANSITION_OUTPUT_VIOLATION **before ingress**.
An empty OutputDefinitions set, if used by another transition, admits no output; EVID's two
registrations must each have their specified singleton. The schema set is derived, never another
stored field. This version adds no variable-N or rule-indexed production; ADAPT must earn that
extension separately. No downstream consumer is needed to enforce a terminal output's cardinality.

**Ingress is generative and consumer-owned.** After valid source production, the shared interpreter
queries committed consumer registrations, matches their InputAdmission producer/schema constraints,
and derives an EventEmission for each matching consumer from its IngressDefinition. The producer
supplies only its own domain output and trusted production context. It does not know downstream
consumers, event types or routes, and accepted SEM code does not acquire an EVID-specific dispatch.
The same interpreter observes successful accepted SEM freeze and registered transition production.

The generated child has the declared event type/phase, source DueAt, exact complete source payload,
empty canonical dependencies list (this version has no dependency grammar), and the source producer
event as causal parent using existing scheduler allocation. No extra parent is introduced. The
source event is the production event, not a synthetic interpreter event; no ingress occurrence ID
is allocated. Children are generated in canonical source typed-identity then consumer TransitionKind
order and receive ordinary new scheduler EventIds/EventSequences. Actual same-phase child sequence
is strictly later than its source. All generation, queue staging and accounting are transactional.

At child entry, InputAdmission independently verifies the exact source relation against the trusted
staged production/generation context. Payload bytes, type, version and supplied parents alone cannot
forge generated ingress. External events without that relation fail INPUT_NOT_ADMITTED. The
interpreter's transaction-local generation association is internal, not a persisted certificate or
character-visible reference. Quiescent-only saves and same-instant ingress need no saved mid-chain
association. A missing/duplicate/wrong generated topology fails TRANSITION_INGRESS_VIOLATION. A
producer manually emitting an ingress-managed child is not an alternative implementation: the
substrate still owes its generated child and detects the duplicate/unauthorized topology as that
same ingress failure. An unrelated uncontracted extra event remains TRANSITION_OUTPUT_VIOLATION.

### Closed producer grammar

```
TransitionInputAdmission
    InputRecordSchema        CanonicalRecordSchemaRef
    Producer                 TransitionInputProducer
    RequiredSourceRelation   ExactImmediateProducerOutput (only admitted value)

TransitionInputProducer
    FrozenSemanticExperienceProducer
        ProducingSeamId      accepted SEM seam identity
        ProducingSeamVersion  exact accepted phase-production contract version
        Lane                 existing Current | Consequence
  | RegisteredTransitionProducer
        ProducingTransitionKind namespace-1009 registration key
```

FrozenSemanticExperienceProducer requires type 227/schema 1 and the exact accepted SEM
seam/phase-production contract above. Its trusted production facts are SEM's reservation, frozen
canonical envelope and phase operation. The accepted lane table supplies entry/freeze phase and
bijection: Current 10/14, Consequence 120/124. No new SEM transition kind, adapter identity, route
membership, staging record or payload Lane field is created. A caller-supplied producer tag proves
nothing; the runtime validates it against actual SEM production in the unsettled instant.

RegisteredTransitionProducer resolves executing seam/version, phase (from ingress) and allowed
output schemas through the named TransitionRegistration. The input schema must be one of that
producer's OutputRecordSchemas. There are no optional seam/phase overrides in this union branch.

ExactImmediateProducerOutput requires payload byte equality with one complete actual staged
producer output at the same DueAt, routed by the shared interpreter from the actual producing event. For the SEM branch that
output is the exact frozen envelope; for the registered branch it is the registered transition's
actual output. Equality is not ID/hash equality. Existing scheduler identity and actual generation
context establish the immediate relation; additional causal-parent IDs cannot forge emitter identity.
No initial/external or historical input, query expression or arbitrary predicate is admitted.

### Exact occurrence identity mechanism

```
OccurrenceIdentityRule
    IdentityFieldId          one required top-level field of that exact schema
    IdentityRole             accepted CanonicalIdentityRole
```

The enclosing map key is the exact CanonicalRecordSchemaRef; it is not repeated in the value. This additive registry admits only schemas whose occurrence identity is exactly one required typed
identity field. It is deliberately not a universal implementation of every SEM inventory identity
rule. IdentityRole constrains the typed namespace and applicable validators by accepted PRJ grammar.
Model construction requires the declared field to exist, be required, and carry a compatible canonical
role constraint; unknown schema, optional field, conflicting declaration or role is invalid. The
executor extracts by committed FieldId, validates the value against IdentityRole, and never searches
field names, hashes values, or uses output position. No new occurrence is allocated by this lookup. The rule identifies the occurrence carried by a record; it does not prove freshness. EVID transformation and allocator controls prove new E/L allocation.

**ExperienceId role inspection and choice B1.** Type 227/1 field 1 is required, and
semanticEvidenceCodecs.ts constructs it with semanticOccurrenceId('ExperienceId', ...), whose
accepted namespace is 1106. However RecordFieldSchema has only id/name/required, not a canonical
value grammar. No pre-existing CanonicalRoleConstraint for this field was found. Therefore neither
an inherited PRJ constraint (A) nor a base-schema grammar compatibility check (B2) is available.

In PRJ-admitting Campaign-2 models, add this exact declaration through PRJ's existing committed
CanonicalRoleConstraints collection:

```
CanonicalRoleConstraint
    Position = RecordField(227, 1)   — PreRecognitionSemanticExperience.ExperienceId
    Role
        RequiredNamespace = 1106
        DomainValidatorId = absent  — no sentinel or no-op validator
```

OccurrenceIdentities[CanonicalRecordSchemaRef(227, 1)] uses IdentityFieldId = 1 and the same
namespace-only IdentityRole. Thus compatibility is witnessed by a **new additive declaration in
this model**, not a retroactive claim about Campaign 1. Construction/decode/restore in the admitting
model enforce it under PRJ; an invalid namespace fails CANONICAL_ROLE_VIOLATION at that boundary.
Record bytes, schema 227/1, existing allocator identity and non-admitting Campaign-1 models are
unchanged. This is not a new field, validator identity, or namespace allocation.

The accepted E and L identity fields likewise require explicit RecordField role constraints in that
same PRJ collection, each using its own F-allocated occurrence namespace and no DomainValidatorId.
Their corresponding OccurrenceIdentityRules require those exact namespace-only roles. Missing or
incompatible declaration fails model construction; merely spelling a field name ...Id never supplies
one. All declarations participate in the admitted model's committed PRJ shape, not an anonymous
seam callback or a second role-constraint registry.

Exact witnesses:

| Schema | Identity position | Role |
|---|---|---|
| PreRecognitionSemanticExperience, accepted 227/1 | accepted field 1 ExperienceId | namespace 1106, additive Campaign-2 RecordField role declaration above |
| OutcomeEvaluation, accepted symbolic schema | required OutcomeEvaluationId field | its shape-accepted typed occurrence namespace, assigned only at F |
| OutcomeLearningEvidence, accepted symbolic schema | required OutcomeLearningEvidenceId field | its distinct shape-accepted typed occurrence namespace, assigned only at F |

Every InputRecordSchema used by this admission extension must have exactly one such declaration.
The two new output schemas also have declarations so source identity remains explicit for later
consumers. This does not alter Campaign 1's experience schema or allocate a new experience ID.
Schemas needing composite/non-field identity rules remain outside this version of admission.

Ingress multiplicity (not input admission) is keyed by `(actual producer EventId, extracted typed source identity, consumer
TransitionKind)`. Distinct schema identities are validated before use; a producer repeating one
occurrence identity, with equal or unequal bytes, violates output closure rather than producing two
sources. Every qualifying actual source has exactly one child at settlement. Zero children is a
closure failure even though no consumer ran. All accounting is transaction-local and rolls back.
There is no persistent dispatch ledger or cognition-accessible provenance query.

### Independent Campaign-2 transition-route registration

This section owns the accepted LearningRouteId vocabulary, its two members
`route/character-learning` and `route/automatic-adaptation`, and this relation:

```
TransitionRoutes = map<TransitionKindId, LearningRouteId>

occurrence/output closure(R)
    = union OutputRecordSchemas(T) for registered T mapped to R
```

LearningRouteId is a **new symbolic identity family awaiting F**, not a previously accepted numeric
namespace. TransitionRoutes is a canonical map relation keyed by TransitionKind: duplicate
keys fail even if values agree; unknown transitions/routes fail; membership is singular where
present, not total over all generic transitions. Each EVID TransitionKind requires exactly one mapping
to route/character-learning. Future evidence/consolidation transitions may join that route without reopening EVID; the route is not limited to two transitions. SEM is not registered here merely because it is an input producer.
Route assignment grants neither payload admission nor state access. Changing the relation or output
schemas changes ModelIdentity and the derived output closure; routes with no member outputs are
empty and cannot pass EVID-A's positive witness.

No dependency on ADAPT is needed to define or prove this relation. ADAPT owns StateFamilyRoute,
its total/singular membership over ten families, persistent closure, and the additional constraint
that a writing transition's route agrees with every writable family's route. EVID proves none of
that table. **This shared version supports only NoStateWrites**, so
WritableStateFamilies(T) = {} for every supported transition. MutationAuthorityId and writable-family
payload fields are forbidden, not optional placeholders.

StateWrites is deferred to an ADAPT-earned versioned extension. There is no accepted generic
StateFamilyId. PRJ uses StatePathPattern for exact structural addressing, but ADAPT's row 9 includes
several independently addressable leaf families. No accepted equivalence makes one such pattern the
coarser routed family. Substituting it here would decide ADAPT's semantics. ADAPT must freeze that
referent before adding StateWrites; F assigns numbers only after that shape is settled. EVID does
not acquire an ADAPT dependency to support an unwitnessed variant. The empty derived family set must
not determine persistent route closure; that remains ADAPT integration control 4a.

### Registry packaging inspection and accepted resolution

1. No accepted same-RegistryKindId-as-StableId singleton precedent was found. The concrete SEM
   union entries use **UnionVariantDefinitionId (1024)** for StableId and **RegistryKindId (1023)**
   for kind. Other inspected test entries similarly distinguish instance identity and kind.
2. No accepted general singleton registry-definition identity family was found. Namespace 1024
   owns union variants specifically; it is not a generic definition ID to repurpose.
3. compileRegistryManifest constrains StableId by global uniqueness, not by namespace relative to
   RegistryKind. It checks nonempty DefinitionVersion and canonical Definition. The separate accepted
   validateSemanticRegistryEntryKinds admits only SEM's union-variant kind; it cannot be silently
   used as a permissive Campaign-2 validator. Code accepting canonical bytes does not authorize an
   identity's semantic role.

**Accepted addition after inspection:** RegistryDefinitionId, a new typed identity family
for governed registry-definition instances, with exactly one witnessed member
`definition/transition-admission`. Its shape is accepted; no numeric allocation is made here. This is the
instance identity of the one shared registry bundle, not a new occurrence/provenance identity or a
new ID per relation row. Keeping kind and instance distinct follows the accepted SEM precedent.
No existing namespace (including 1023/1024) is widened. F must allocate this family/member under the accepted shape; changing that packaging requires explicit contract revision before allocation.

```
SemanticRegistryEntry for the shared singleton
    StableId           RegistryDefinitionId / definition/transition-admission
    RegistryKind       RegistryKindId / registry/transition-admission
    DefinitionVersion  transition-admission/0.4-candidate
    Definition         TransitionAdmissionRegistry

TransitionAdmissionRegistry
    LearningRoutes     canonical set<LearningRouteId>
    TransitionRoutes   canonical map<TransitionKindId, LearningRouteId>
    OccurrenceIdentities canonical map<CanonicalRecordSchemaRef, OccurrenceIdentityRule>
```

The singleton member is fixed by this contract; exactly one such entry is required. Neither map
value repeats its key. OccurrenceIdentityRule has only IdentityFieldId and IdentityRole.
ContractVersion is removed: enclosing DefinitionVersion is the sole stored shared-contract version.
Changing any shared rule, registration, output definition or ingress declaration changes the existing
registry manifest/ModelIdentity chain. There is no parallel manifest or key-equality validator.

**Exact new RegistryKindId members and admission matrix:**

| RegistryKind (namespace 1023) | StableId | Definition | DefinitionVersion | Cardinality |
|---|---|---|---|---|
| registry/transition-registration | namespace 1009 TransitionKindId | exactly TransitionRegistration | transition-admission/0.4-candidate | one per declared transition key; unique event type as above |
| registry/transition-admission | new RegistryDefinitionId family, exact member definition/transition-admission | exactly TransitionAdmissionRegistry | transition-admission/0.4-candidate | exactly one in an admitting model |

The Campaign-2 validator admits precisely these two kinds under this matrix plus accepted SEM kinds
under their unchanged own contracts. There is no arbitrary StableId namespace or broad Campaign-2
kind exception. Wrong family/member/schema/version, unknown kind, duplicate key or missing singleton
fails INVALID_CONFIGURATION before allocation/execution. Missing EVID transition registrations are
invalid for the EVID model. Non-admitting SEM models retain their existing closed kind validator.
These are accepted symbolic registrations, not numeric allocations or current implementation.

The registry admission matrix is closed accepted interpreter behavior. Implementation must interpret these exact registered shapes, not install an injectable anonymous validator whose behavior can vary independently of the contract. EVID-S mutation-checks this obligation; VAL-001 remains the general follow-up and licenses no new callback here.

### Exact EVID registrations

Both registrations execute `seam/character-learning-evidence` at
`character-learning-evidence/0.5-candidate`, with empty ReadDomain, NoStateWrites, phase-130 ingress,
SameAsProducer, ExactAdmittedSourceOutput, ExactImmediateProducerOutput, and
ExactlyOncePerSourcePerConsumer. Event types are distinct symbolic members in the existing scheduler
identity representation, with the following fixed registration mapping (numbers only at F):

| TransitionKind member | ConsumerEventTypeId member | Input / producer | OutputDefinitions |
|---|---|---|---|
| OutcomeEvaluationTransition | event/outcome-evaluation | PreRecognitionSemanticExperience 227/1; FrozenSemanticExperienceProducer(seam/event-truth-to-pre-recognition-experience, semantic-binding/0.1-candidate#SEM-001H, Consequence) | { OutcomeEvaluation → ExactlyOnePerExecution } |
| OutcomeLearningEvidenceTransition | event/outcome-learning-evidence | OutcomeEvaluation; RegisteredTransitionProducer(OutcomeEvaluationTransition) | { OutcomeLearningEvidence → ExactlyOnePerExecution } |

The shared route map assigns both to route/character-learning. There is no route field inside either
TransitionDefinition. Each output is the exact accepted symbolic schema above. Nested TransformationVersion
values remain unchanged; no production-stage metadata rewrites historical semantic records.

### Exact failure ownership and validation order

**Shape-accepted additive flat SchedulerFailureCode members**, thrown as existing SchedulerContractError
and preserved structurally in FailureDiagnostic.FailureCode without a new diagnostic record:

| Code | Exact boundary and meaning |
|---|---|
| INPUT_NOT_ADMITTED | Entry: malformed/forbidden payload relation, producer, phase or actual immediate source. Reuses PRJ's accepted semantic name; its live enum addition remains after F. |
| TRANSITION_WRITE_FORBIDDEN | Result validation: NoStateWrites returned a nonempty patch or structural state replacement. Fires before path/authority/value checks, even for a globally valid writable path. |
| TRANSITION_OUTPUT_VIOLATION | Result validation: wrong/missing/duplicate required output, invalid output shape/identity, repeated occurrence identity, or uncontracted terminal extra event/output. |
| TRANSITION_INGRESS_VIOLATION | Interpreter/settlement closure: derived consumer child missing, duplicated, or wrong event type, phase, DueAt or payload relative to committed generative ingress. No consumer input is required for this failure. |

These are typed transition-contract failures carried by the scheduler's existing flat code union,
not overloaded StateFailureCode members and not text subreasons. Existing genuine codec, ordering
and state failures retain their boundaries; malformed scheduled event envelopes fail existing scheduler
validation before they can reach entry. In particular phase 150 stays an existing INVALID_EVENT case.

For a valid envelope, order is: registration resolution → payload/schema and producer admission →
projection (none for EVID) → execution → NoStateWrites check → canonical output/schema/identity
closure → shared child generation and ingress-topology validation → ordinary scheduler staging. At final quiescence, before
commit, verify every mandatory ingress count is exactly one, including sources with zero children.
A wrong generated child or manually duplicated ingress child is TRANSITION_INGRESS_VIOLATION; an externally injected valid
scheduled envelope with no legitimate source fails INPUT_NOT_ADMITTED. They are different boundaries.
A forbidden terminal event lacking any ingress is TRANSITION_OUTPUT_VIOLATION. If a result violates
multiple checks, this order fixes first divergence; no-state-write violation is not hidden by a later
output error. Independent failing records are checked in canonical bytes/schema/typed-identity order;
missing-ingress keys sort by producer EventId, typed source ID and consumer TransitionKind.

Invalid model declarations fail existing INVALID_CONFIGURATION during configuration, before a run
or any allocation: unknown/multiple registration, mismatched identity position/role, bad route map,
backward/unschedulable ingress or invalid union layout. Any StateWrites tag or authority/family payload fails configuration in this version. Runtime NoStateWrites violations retain TRANSITION_WRITE_FORBIDDEN; no authority/outcome-evaluation is created. Existing WRT behavior outside this extension is unchanged.

All runtime failures abort the whole instant under accepted scheduler semantics. The new flat codes
are symbolic failure vocabulary, not permanent numeric allocation or an implementation today.
ADAPT's AcceptedAdaptationBasisKinds remains its own exact refinement of InputAdmission; it is not
part of this generic grammar. VAL-001 is neither reopened nor promoted to a pre-allocation blocker.

## Preconditions

Closed **dispatch admission rule** (interpreted from the shared committed InputAdmission above,
not a new provenance record):

1. At successful phase-124 freeze, the shared ingress interpreter must generate exactly one phase-130 evaluation
   event for that frozen consequence envelope. Its payload equals the staged canonical envelope.
   The existing reservation must name Consequence, reserve at 120, freeze at 124, and match
   ExperienceId, ObserverId and DueAt. Current-lane output cannot dispatch this event.
2. Before transition execution, admission validates exact type/schema, SEM-producing contract and
   source occurrence against that trusted staged production. A TransformationVersion string, event
   type, apparent phase, supplied lane flag or valid record bytes alone cannot establish production.
3. The evaluation executes at that same DueAt/phase 130, after governed input admission succeeds.
   A caller cannot inject an external initial evaluation event; this version admits only the causal
   child of the matching freeze. Already-dispatched experiences are not dispatched twice.
4. Evaluation produces exactly one E. The shared ingress interpreter generates exactly one same-DueAt/phase-130 child with E as payload.
   OLE admits only that exact immediate output from that EVID producer, once. No independently seeded,
   restored-as-initial-input, replayed-as-new-input, raw observation, or bare experience qualifies.

Production matching and dispatch uniqueness are transaction-local checks over staged records/events,
with existing source IDs and canonical equality. They introduce no durable ledger, certification ID,
caller-writable lane token, or cognition-accessible ancestry query. Save is only at quiescence, so
there is no mid-lane reservation to persist. Historical outputs may be archived, but cannot be
resubmitted as fresh evidence in this version. A future delayed route needs a separate accepted rule.

## Totality, typed failures, instant rollback, and failed-run behavior

Every admitted experience emits exactly one evaluation and
exactly one OLE; no discretionary filter, success threshold or optional emission. Invalid payload,
producer, lane, source equality or forbidden basis fails entry as
`INPUT_NOT_ADMITTED` under the shared entry rule above. Canonical codec/schema errors retain their
existing codes. EVID has no REQUIRED_PROJECTION_VALUE_ABSENT case: unbound
observers succeed. A later state-addressing consumer owns that failure under accepted PRJ/IDN.
Every failure aborts the complete instant under accepted ordering semantics, restoring state,
allocators, queue, trace and outputs; no partial learning record survives.

## Exact transformation

For admitted canonical experience X:

```text
E = OutcomeEvaluation(allocateRuntimeOccurrence(OutcomeEvaluationId), X, EVID-version)
L = OutcomeLearningEvidence(allocateRuntimeOccurrence(OutcomeLearningEvidenceId), E, EVID-version)
```

These are the only transformations. E's identity is its explicit result identity, distinct from its
scheduler event and X.ExperienceId. L has its own explicit result identity, distinct from E and from
the adaptation occurrence namespace. Both use the existing global runtime allocator, no separate
counter, hash or content-derived identity. The two new namespaces distinguish two new occurrences;
neither duplicates an existing identity rule. Every source-copy field retains the original identity.

## Random addresses and distribution mapping

Not applicable: no draws or random address allocation.

## Quantization and rounding points

Not applicable: byte-preserving transport of accepted values, no arithmetic transformation.

## Canonical collection ordering and tie rules

No new occurrence collections. Shared definition sets use canonical byte ordering and reject
duplicates. Embedded SEM sets keep accepted canonical ordering, duplicate rejection and
history semantics. No ordinal, collection position, allocation gap or timestamp difference is
interpreted psychologically. Batch ingress uses the accepted SEM canonical scheduling order.

## Event phase and timing semantics

124 freeze → 130 evaluation → 130 evidence, with strictly later child EventSequence. Both records
commit only at complete-instant settlement, after phase 140 drains. No backward phase emission,
phase-150 event, new subphase, phase-30 work, or same-event belief read/write is required. This
one-observer witness does not decide ORD-001 or simultaneous multi-character ORD-002.

## Postconditions

Exactly two distinct new domain occurrences and two separately traceable transitions per admitted
experience, with a causal source chain back to the existing experience. Empty patches leave every
persistent character-learning family byte-identical. Scheduler/allocator/trace progress is expected
and is not character learning. Phase-140 adaptation cannot rewrite either historical output.

## Invariants

The shared route-derived output closure contains both E and L schemas, and the positive witness
actually produces both. This is stronger than registering empty families. Persistent route closure is an ADAPT integration obligation, outside this local proof. Output admission
checks all outputs **and emitted payloads**: putting OLE into an event while omitting it from outputs
does not evade producer exclusivity. Raw observation has no production edge to OLE in this slice.

## Trace records and provenance

Reuse TraceRecord: SourceRecordIds contains X.ExperienceId for E and E.OutcomeEvaluationId for L;
InputProjection and OutputProjection carry their exact canonical values; SubjectIds extracts the observer internally from the admitted nested source, without storing a second payload field. The usual scheduled causal parents stay omniscient. EVID creates no
second evidence graph or independently authoritative provenance index. Nested safe source values
provide the permitted lineage without allowing a character to query the trace. Staged and archived
copies with one occurrence ID must agree; an inconsistent copy is invalid, not another version.

## Candidate mechanisms and control implementations

Applicable preservation decisions for this draft:

| Ledger entries | Disposition here |
|---|---|
| SUB-003, SUB-008, SUB-009 | PORT through existing typed identity, exact trace/rollback, paired comparisons; no second implementation. |
| MEC-004, P3-001, P3-006 | CONTRACT: preserve observer-safe perception and provenance; no world-to-belief or privileged social read. |
| MEC-003, EXP-002, EXP-008, RET-006, RET-014 | CONTRACT/CORPUS and prohibited controls: hidden truth non-leakage; no authoritative Applied or full provenance copy. Bounded-effect computation stays upstream. |
| MEC-019, MEC-022, RET-013 | CONTRACT: do not infer intent or success; freeze historical evidence, never reinterpret it under later state/calibration. |
| P3-003 | CONTRACT/CORPUS: no opportunity inferred from missing evidence; no per-tick no-event evidence generation. |
| MEC-001, MEC-002, MEC-006, CTL-002, RET-003..005 | CONTROL/CANDIDATE/CORPUS retained for later interval-aware belief and surprise; no mean, precision, prediction or numeric update introduced here. |
| SUB-007, EXP-014, RET-009 | PORT/CORPUS obligation retained for later consolidation/TRC-004; embedding a source is not independent corroboration or correlation discounting. |
| MEC-005, MEC-007..010, MEC-021, CTL-004, EXP-006..007 | CONTROL/CORPUS retained for attention, salience, encoding and retrieval; no selection, strength, attribution weight or memory mutation here. |
| P3-002, P3-011, CTL-010 | CANDIDATE/CORPUS deferred: opportunity/expectation, same-event belief timing, reward. No candidate is adopted by the name OutcomeEvaluation. |

Historical reference tests remain read-only: semanticExperience/salience, expectation and saturation,
evidenceOverlap and deterministic replay families in REFERENCE_MECHANISM_LEDGER §10. Their old
psychological transformations are deliberately not copied; the new vectors below test this narrower
identity-like slice. No historical finding is retired and no tested comparison is claimed today.

## Competing models / ablations

Frozen negative mutations below remove one load-bearing guard at a time. A direct experience→OLE
shortcut is an adversarial boundary violation for this slice, not an accepted reduction of the full
architecture's other future learning-evidence paths. Likewise, separate records alone do not earn a
RETAINED verdict for evaluation; a later reduction campaign must supply discriminating coverage.

## Equivalence relation and tolerances

Exact canonical structural/byte equality; no numeric tolerance. Same safe input, same observer and
coupled output allocations produce identical E/L despite changed hidden truth or phase-140 exposure.
If separate timelines shift global occurrence allocation, compare under an explicit bijection of
new E/L IDs and already-permitted source IDs, preserving every edge and value; never normalize away
truth leakage, missing records or altered subject/content. Same-run replay requires literal identity.

## Proof obligations and executable tests

**Frozen adversarial vectors; specified, not executed or passed.** Each negative control must fail
at its named boundary and removal of that guard must be detected. Symbolic vector labels allocate
no permanent canonical numeric identity.

| Vector | Positive witness / adversarial intervention / required result |
|---|---|
| EVID-A | Valid consequence: exactly one E and one L, distinct freshly allocated IDs, exact nested values, two transitions at 130. Return 0, 2 distinct, 2 identical or wrong-schema outputs at EACH transition: TRANSITION_OUTPUT_VIOLATION before ingress, including terminal L with no downstream consumer. Output definitions and derived route schema closure must agree. |
| EVID-B | Identical-shaped current-lane envelope, forged Consequence label, wrong producer version and injected phase-130 event each fail admission **before semantic execution and runtime allocation**. Schema validity alone must not pass. |
| EVID-C | Reuse real ExperienceId with altered bindings, classifications or observer: INPUT_NOT_ADMITTED at entry. Producer repeats one occurrence identity with equal or unequal bytes: TRANSITION_OUTPUT_VIOLATION. Canonical identity-position declaration is required; changing it to an optional/wrong-role field fails INVALID_CONFIGURATION. Remove the new 227/1 ExperienceId role declaration or give it the wrong namespace: INVALID_CONFIGURATION. A wrong-namespace value at canonical construction/decode/restore fails CANONICAL_ROLE_VIOLATION under PRJ. Non-admitting Campaign-1 behavior/bytes remain unchanged. No field-name or output-index inference is permitted. |
| EVID-D | Unbound observer succeeds through X→E→L, with zero roster reads. A separately scoped later state consumer fails REQUIRED_PROJECTION_VALUE_ABSENT under PRJ/IDN; that failure must not be moved into EVID. |
| EVID-E | Change or remove roster entries with X/output allocations fixed: every E/L byte is identical. A→C and B→C never merge observer evidence. Neither output schema admits a top-level ObserverId; injecting one is an invalid shape, not an alternate index. Trace extracts the sole nested observer exactly. |
| EVID-F | No direct, derived or dynamic roster projection is definable in either EVID transition. Attempt state/trace/parent/content access through the live handler context or a nested support reference: capability rejection. Empty ReadDomain alone is insufficient if context.state remains reachable. |
| EVID-G | Change hidden outcome success, identity, Applied/Overflow, unobserved facets and causal ancestry while holding admitted safe X fixed: exact E/L content equality. Inject hashed/opaque truth handles at every nested level: reject, even if never dereferenced. |
| EVID-H | Wrong producer, phase/lane, parent relation, source bytes, type 209, raw observation, adaptation input and externally seeded E fail governed InputAdmission. A binding, correct route tag or valid schema alone cannot admit any of them. |
| EVID-I | Missing/wrong/duplicate E or L is TRANSITION_OUTPUT_VIOLATION, before ingress. With valid domain output, suppress/duplicate/misroute the interpreter-generated child: TRANSITION_INGRESS_VIOLATION. Manually emit an ingress-managed child and catch the topology violation. External valid event without legitimate generated source: INPUT_NOT_ADMITTED. SEM and E need no downstream-specific emission code. |
| EVID-J | All persistent state is byte-identical across E/L. A NoStateWrites result with a nonempty patch, even to a valid globally writable path or with unchanged values, yields TRANSITION_WRITE_FORBIDDEN before path/authority/output checks. Test simultaneous bad patch and undeclared output to prove precedence; no dummy authority or state-code reuse. |
| EVID-K | Change existing beliefs, expectations, values and recognition resolutions with X fixed: identical E/L and no corresponding actual reads. Requiring phase-30 work or reading belief fails the empty domain; ORD-001 remains undecided. |
| EVID-L | Nonempty event classifications, explicit false, missing facet, unresolved role, false continuity and false event segmentation all survive nested copies exactly. In particular the limited convenience encoder's empty event-classification output must fail a nonempty-input round-trip vector. |
| EVID-M | No admitted consequence reservation means no E/L dispatch. Empty classification sets in a valid admitted envelope still produce E/L, without success/negative-evidence fields. No observation opportunity is inferred from silence. |
| EVID-N | Inject failure after E allocation, after child scheduling, after L allocation, and final validation: whole-instant structural rollback of all outputs/state/queue/allocators/trace; terminal Failed, diagnostics not evidence. |
| EVID-O | Save before the instant and after settlement, restore/replay: exact bytes/IDs/continuation. Restore must not mint occurrences, reconstruct old evidence from current state, or admit archived E as a fresh producer output. |
| EVID-P | Hidden exposure with no experience produces no E/L. Both-affected case has independent truth adaptation ancestry and the full X→E→L path. Phase-140 mutation leaves same-run phase-130 records byte-identical; paired safe-input-equivalent runs preserve the declared epistemic comparison. |
| EVID-Q | Both EVID registrations map to character-learning; closure derives from OutputDefinitions and contains E/L. Change output multiplicity/ingress/route declarations: ModelIdentity changes. Duplicate schema definitions/map keys, wrong kind/StableId family/member/schema/DefinitionVersion, duplicate singleton, unknown transition or duplicate event type fail INVALID_CONFIGURATION. Test both exact new registry-kind rows. StateWrites or authority/family payload also fails configuration in this NoStateWrites-only version. SEM has no synthetic TransitionKind/route. Persistent closure belongs to ADAPT 4a. |
| EVID-R | Shift opaque allocations and canonical input construction order: preserve values/lineage under the declared bijection, not psychological magnitudes. Same-phase child orders after E; earlier-phase emission and phase 150 fail existing scheduler guards. |
| EVID-S | Keep committed declarations fixed; mutate output-cardinality enforcement, occurrence-field extraction or shared ingress generation. Zero/two domain outputs must yield TRANSITION_OUTPUT_VIOLATION; zero/two generated children must yield TRANSITION_INGRESS_VIOLATION. Retain forbidden-input/no-write mutations and exact code checks. Declaration changes instead change ModelIdentity; anonymous executor overrides are forbidden. |
| EVID-T | OutcomeLearningEvidence accepts only its exact OutcomeEvaluation source. DecisionExpression-derived evidence cannot masquerade as this family merely because it is on route/character-learning. New evidence families require their own admitted schemas and producers, not a generic source escape hatch. |

## Applicable Campaign 0 conformance vectors

After F, rerun applicable CV-ORD, CV-SAVE, CV-TXN-001 boundaries, canonical encoding, identity,
read-domain, trace and mutation-authority controls, plus SEM lane/provenance controls
CV-SEM-071..090 and EVID-A..T. Include PRJ/IDN frozen entry/role/access controls.
No tests run or results inherited as evidence of this unimplemented seam in this revision.

## Known domain exclusions

Deliberately deferred: attempt linking and frozen expectations; appraisal/value judgments;
prediction error and surprise; success/failure classification; causal attribution and controllability;
goal progress; reward/hedonic semantics; confidence/precision; interval-aware updates; opportunity
and non-event inference; support-reference reads; recognition or action-schema interpretation;
belief, memory and every persistent learning update; selection/consolidation and overlap discounting;
delayed/history-consuming routes; multi-character interaction ordering; full topology sufficiency.
The architecture's broader SemExp→LearningEvidence and DecisionExpression-derived evidence edges
remain future separately contracted producers, not permissions for a bypass in this slice.

## Unresolved decisions

EVID-001 is closed at shape/contract level by the 2026-09-05 acceptance of revision 5 and its
companion transition-admission/0.4-candidate. No unresolved shape decision remains in this accepted
scope. EVID-A..T remain the unexecuted implementation gate. IDN is unchanged. REG-001 is ADAPT's
only open prerequisite decision. VAL-001 remains P1 and does not reopen EVID or block F.

No record/type/field/namespace/member numbers are assigned. Under this accepted symbolic scope,
Campaign 2 F alone allocates the two record schemas, their fields and occurrence namespaces, LearningRouteId and its two members, shape-accepted RegistryDefinitionId and its singleton member, and
the shared definitions/closed-union schemas and new transition/seam members through existing registries. No new observer, character,
experience, roster-binding, projection-requirement or provenance identity is needed.

Explicit F inventory for the shared registry additions (symbolic only):

- new RegistryKindId members: registry/transition-registration and registry/transition-admission;
- new identity family: RegistryDefinitionId;
- new RegistryDefinitionId member: definition/transition-admission;
- LearningRouteId family and its two named route members;
- the two namespace-1009 transition members and their scheduler event-type members;
- E/L occurrence namespaces and record schemas, shared definition schemas/fields/closed values;
- PRJ RecordField declarations for E/L occurrence IDs; the type-227 field-1 role declaration reuses
  existing numbers 227/1 and 1106 and requires no new identity allocation.

No StateWrites tag, MutationAuthorityId field, state-family reference type or writable-family
collection is included in this version's allocation. The witnessed NoStateWrites failure remains.

## Reopen conditions

A required field cannot be derived from the exact safe payload; future work needs a nested-source
selector, evidence-reference union extension, historical input, learned interpretation, new subject
qualification, or state mutation. Such changes need an explicit owning seam/version and proof,
not optional fields retroactively added to these records.

## Change history

2026-09-05: first inspection-backed draft and frozen symbolic adversarial vectors. Three requested
bookkeeping corrections made separately. Accepted contracts preserved; no permanent allocation,
canonical implementation, acceptance claim, or research verdict.

2026-09-05, revision 2: planning review rejects permission widening. EVID becomes observer-relative;
top-level ObserverId closure supports future PRJ without nested selection. OutcomeLearningEvidence
replaces the overly generic record name. Generic committed admission/write capability is specified
here rather than delegated to ADAPT C. OutcomeEvaluation remains an explicitly identity-like scaffold
witness. EVID-S/T added; no accepted IDN or other formal semantics changed.

Revision 3 (2026-09-05): EVID-local direction accepted by planning review. Shared route relation separated from execution and ADAPT; closed producer union removes synthetic SEM identity; explicit execution registration, occurrence identity field rule, ingress ownership and flat typed failures proposed. Shape acceptance remains pending.

Revision 4 (2026-09-05): required exact-one output definitions; multiplicity moved to generative ingress; duplicate ObserverId fields removed after equality-mechanism inspection; relation keys and shared version deduplicated; singleton instance/kind separated after registry inspection. This is a draft for shape review, not the anticipated acceptance or closure of EVID-001.

Revision 5 (2026-09-05): only the three requested closure corrections. Defer StateWrites until its
state-family referent is earned; explicitly admit both RegistryKindId members; inspect type-227
ExperienceId and choose additive PRJ role declaration B1. Direction acceptance is preserved; the
anticipated overall shape acceptance is not applied without its actual disposition.
2026-09-05 acceptance: revision 5 SHAPE ACCEPTED as character-learning-evidence/0.5-candidate with
transition-admission/0.4-candidate. Updated stale heading; restricted ADAPT reuse to the witnessed
base pending its writing extension; made route participation non-exclusive; froze registry validation
as closed interpreter behavior. EVID-A..T frozen, not passed; allocation and implementation await F.

Campaign 2 allocation clarification (2026-09-06): shared SeamId/1036 uses nonempty canonical
UTF-8 NFC text, exact byte equality, no aliases and no ordinal meaning. Campaign-2 admitting
V04/V06 ExecutingSeamId, FrozenSemanticExperienceProducer.ProducingSeamId and PRJ requirement
seam components use this family. Runtime trace copies validated values; generic historical
TraceRecord/type-160 fields and non-admitting legacy contracts are not globally narrowed. No seam
registry or definition record is introduced. The allocation remains a review candidate.
