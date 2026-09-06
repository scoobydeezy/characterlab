# ADAPT F — symbolic canonical packaging, revision 3

2026-09-06. **SHAPE ACCEPTED**, canonical packaging component of `adaptation-input/0.31-candidate`.
Whole ADAPT and its 0.6-candidate admission / 0.2-candidate settlement companions are shape accepted.
Permanent allocation is authorized as the next specification step, pending the combined numeric table.
Canonical implementation is NOT YET AUTHORIZED. AD-F1..7 and inherited gates are frozen NOT PASSED.
The accessor gap is closed by shared PRJ-owned ProjectionAccessorId (§6); the authoritative static
invariant is frozen below. No remaining semantic design blocker is identified.

## 1. Encoding conventions and authoritative homes

Record rows below list required fields in symbolic canonical field order. Unlisted fields are
forbidden. Numeric RecordTypeIds, FieldIds, namespace/member values and union tags are deliberately
absent. Maps/sets use accepted cenc/1 canonical ordering and duplicate rejection; identity equality
is canonical equality, never an interpretation of ordinals. Schema references use existing
CanonicalRecordSchemaRef. Canonical union layouts require type-259 UnionVariantDefinition entries
with exact required/forbidden fields at allocation. No generic bytes or CanonicalValue escape is added.

SemanticRegistryEntry remains the sole wrapper: RegistryKind, StableId, DefinitionVersion,
Definition. No definition below duplicates its wrapper key/version. Model definitions commit
through RegistryIdentity into ModelIdentity. Actual ordered facts belong to RunIdentity inputs;
allocated occurrences and learned state are execution artifacts, not model definitions.

ExposureReferentId is a role over SemanticReferentId: RequiredNamespace=1002, DomainValidatorId
absent. Every valid governed authored/runtime origin already admitted by that family is allowed.
This does not admit malformed nested origins. Apply the same role to RegulatoryExposureFact,
ToleranceKey, SensitizationKey and the Exposure match payload. There is no exposure validator,
registry, semantic kind or namespace. A valid unmatched exposure yields a positive empty dispatch.
CharacterId remains namespace 1002 plus accepted validator/character-qualification; allowing runtime
exposure origins does not extend IDN's character qualification.

## 2. Exact domain, key and value records

| Record | Required fields in order |
|---|---|
| LoadDomainDefinition | Scale: positive unsigned integer; Capacity: Unbounded or Bounded {Maximum: positive unsigned integer} |
| ProcedureDefinition | CompetenceScale: positive unsigned integer |
| AdaptationLeafFamilyDefinition | DomainSource: LeafLocalScale {Scale: positive unsigned integer} or RegulatoryVariableFromKey or LoadDomainFromKey or ProcedureFromKey |
| ToleranceKey | CharacterId; ExposureReferentId; RegulatoryVariableId |
| SensitizationKey | CharacterId; ExposureReferentId; RegulatoryVariableId |
| RegulatoryAdaptationKey | CharacterId; RegulatoryVariableId |
| AccumulatedLoadKey | CharacterId; LoadDomainId |
| ProceduralCompetenceKey | CharacterId; ProcedureId |
| ToleranceValue | Magnitude: unsigned integer |
| SensitizationValue | Magnitude: unsigned integer |
| RegulatoryAdaptationValue | Magnitude: signed integer |
| AccumulatedLoadValue | Magnitude: unsigned integer |
| ProceduralCompetenceValue | Magnitude: unsigned integer |
| RegulatoryAdaptationState | Tolerance: map<ToleranceKey,ToleranceValue>; Sensitization: map<SensitizationKey,SensitizationValue>; Displacements: map<RegulatoryAdaptationKey,RegulatoryAdaptationValue>; Loads: map<AccumulatedLoadKey,AccumulatedLoadValue> |
| ProceduralSkillState | Competence: map<ProceduralCompetenceKey,ProceduralCompetenceValue> |

Key fields use exact identity roles: CharacterId as above; ExposureReferentId namespace-only;
RegulatoryVariableId uses REG's family; LoadDomainId and ProcedureId use their distinct ADAPT
families. The latter three use namespace-only identity roles; required definition existence is a
separate model/key-domain resolution check, not an implicit DomainValidator. All five keys are
separate record types, including the structurally identical tolerance/sensitization pair.

Load n means n/Scale in that LoadDomainId's own abstract dimension. Bounded Maximum is in the
same integer lattice as Magnitude. There is no UnitId, physical dimension or conversion. Equal
scales/capacities across domain IDs do not merge their meaning. Procedure n means
n/CompetenceScale in that ProcedureId's own abstract competence lattice; no action mapping,
capacity, tool, context or transfer semantics is introduced.

| LeafFamilyId (exact initial set) | Root.field | Key / value schema | Required DomainSource | Magnitude validity |
|---|---|---|---|---|
| leaf/tolerance | RegulatoryAdaptationState.Tolerance | ToleranceKey / ToleranceValue | LeafLocalScale | 0<=n<=Scale |
| leaf/sensitization | RegulatoryAdaptationState.Sensitization | SensitizationKey / SensitizationValue | LeafLocalScale | n>=0 |
| leaf/regulatory-displacement | RegulatoryAdaptationState.Displacements | RegulatoryAdaptationKey / RegulatoryAdaptationValue | RegulatoryVariableFromKey | accepted REG(C,V,T,n) bound |
| leaf/accumulated-load | RegulatoryAdaptationState.Loads | AccumulatedLoadKey / AccumulatedLoadValue | LoadDomainFromKey | n>=0; n<=Maximum if Bounded |
| leaf/procedural-competence | ProceduralSkillState.Competence | ProceduralCompetenceKey / ProceduralCompetenceValue | ProcedureFromKey | n>=0 |

Tolerance and sensitization scales are independent. Exactly five leaf entries are admitted, each
with its prescribed DomainSource variant; extra/missing/wrong-variant entries fail configuration.
The ADAPT version fixes zero baseline, absence equivalent to baseline and explicit-zero entries
invalid. It requires removalAllowed=true in each existing OwnedLeafDefinition. Do not add Baseline,
RemovalAllowed or AbsenceMeansBaseline to AdaptationLeafFamilyDefinition or any value record.

The preceding table is an audit view, not another stored registry. Resolve LeafFamilyId through
Campaign2StateFamilyRegistry to root/field; that physical pattern resolves StateKeyGrammarDefinition
to the exact key and OwnedLeafDefinition to the exact value grammar. Ownership comes only through
StateOwnershipRegistry. Resolve the domain separately through AdaptationLeafFamilyDefinition and
the exact key. No RootStateTypeId, FieldId, authority, key type or value type is repeated in the
domain declaration. All five map patterns have exactly one record-valued mapKey wildcard.
Initial/decode/restore/read/write checks preserve accepted PRJ/WRT ordering and E/C value validation.

### Closed authoritative static state invariant

The ADAPT version defines `validateAdaptationStateStatic(S)` as a closed, timeless operation over
all present entries under the two materialized ADAPT roots. Its immutable model context is exactly
Campaign2StateFamilyRegistry, StateKeyGrammarDefinition, OwnedLeafDefinition,
AdaptationLeafFamilyDefinition, LoadDomainDefinition, ProcedureDefinition and accepted REG variable
definitions. It takes no T, rule table, callback, Markdown, trace, input fact or evaluator result.
No registry, validator identity or configurable predicate is added. The registries must already
have passed model-construction closure; missing model declarations are not invented from state.

Enumerate the two roots' present StateLeaf entries in accepted canonical StatePath order. Resolve
every root/field to one of the five declared physical families; foreign fields/selectors cannot be
silently skipped. Empty maps are valid. For each present entry, in order:

1. Validate canonical StatePath syntax, exact key record grammar and atomic identity roles through
   accepted PRJ machinery. Character and exposure qualification remain their separate exact roles.
2. Resolve every key-referenced model domain: RegulatoryVariableId in tolerance, sensitization and
   displacement keys; LoadDomainId in load keys; ProcedureId in competence keys. Definition existence
   is separate from namespace-role validity. Resolve the leaf's prescribed DomainSource and scale.
3. Validate the exact leaf value record, required single Magnitude field and canonical signed or
   unsigned integer grammar; a different member of AdaptationLeafValue is not interchangeable.
4. Require Magnitude != 0. A semantic baseline is valid, but its only stored representation is absence.
5. Apply the static present-value domain in the table below.

| Present leaf | Required static domain |
|---|---|
| tolerance | 0 < n <= leaf-local Scale |
| sensitization | n > 0 |
| regulatory displacement | signed n != 0; valid key/value grammar and resolved RegulatoryVariableId |
| accumulated load | n > 0; LoadDomainId resolves; n <= Maximum if Bounded |
| procedural competence | n > 0; ProcedureId resolves |

This scans untouched leaves even when no E rule applies or no rule reads them. It neither removes
explicit-zero entries nor clamps/repairs invalid state. It reads no reference operating point:
displacement may pass this static check and still fail C's separate retained-D REG pass at T.
Only REG validates the time-dependent effective displacement; no duplicate bound equation appears
in this operation. The static checker allocates no IDs, writes no state and emits no domain output
or character evidence. Its infrastructure reads are not E's rule-evaluation ActualReadRecord segments.

Mandatory invocation points are initial-state admission, restore admission, the final phase-140
candidate before installation, and ordinary authoritative state validation of every candidate
affecting these roots, including any future authorized writer. C's final whole-instant validation
also runs it when there is no phase-140 work. At initial/restore and candidate settlement, static
validity precedes the separate REG pass at the relevant clock. This is a state-family invariant,
not a property of CountStepWithBaselineGate or of the rule set. A future writer cannot bypass it.

`StateAdapter.validate(state)` can host this timeless operation, but does not currently implement
it. Integration must install the version-defined interpreter, not an anonymous policy callback.
Inspection of scheduler.ts found direct initialState validation at construction and candidate
validation wrapped as STATE_VALIDATION_FAILURE during settlement. persistence.ts calls restore
then stateAdapter.validate without a catch/wrapper; SaveContractError is reserved for that module's
save-envelope/identity/queue checks. The following uses those existing carriers:

| Defect / boundary | Authoritative failure |
|---|---|
| Malformed state path/key or invalid identity role | Existing INVALID_PATH / CANONICAL_ROLE_VIOLATION, preserving PRJ precedence |
| Static stored-state schema, nonzero, bound or referenced-domain-existence defect | StateContractError with INVALID_VALUE; initial/restore propagate it and admit no run/continuation |
| Static state invariant fails inside candidate/ordinary settlement validation | Existing scheduler STATE_VALIDATION_FAILURE and whole-instant rollback, not an invented code |
| Save envelope, identity or queue fails its own checks | Existing SaveContractError; do not relabel state-value errors as save-envelope errors |
| E computes an illegal non-REG q | E's ADAPTATION_MAGNITUDE_OUT_OF_RANGE remains unchanged |
| A Set carries an illegal leaf value/domain or explicit zero | Existing write/value validation boundary (INVALID_VALUE) after B's accepted PRJ/WRT, capability, target and operation-precondition checks |

At write validation, apply the same closed per-entry static predicate to the proposed present value;
the full-state scan remains required at settlement. Remove retains accepted missing/old-value and
removal checks and introduces no present zero value. Invalid stored state is never ILLEGAL_READ or
ADAPTATION_MAGNITUDE_OUT_OF_RANGE. Dynamic REG failures retain C's exact mappings. No new scheduler
failure member is needed. Generic non-admitting models and generic save/trace schemas are unchanged.

## 3. A–E record and union composition

These rows instantiate the existing component fields; their behavioral relations remain in
[consolidation](ADAPT_001_CONSOLIDATION_DRAFT.md), [source](ADAPT_001_FACT_INGRESS_DRAFT.md),
[bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md) and [accepted E](ADAPT_001_RULE_INTERPRETER_DRAFT.md).

| Record | Required fields in order |
|---|---|
| Campaign2StateFamilyRegistry | Families: map<Campaign2StateFamilyId,Campaign2StateFamilyDefinition> |
| Campaign2StateFamilyDefinition | Route: LearningRouteId; Storage: Unmaterialized or Materialized {RootStateTypeId, LeafFields: map<LeafFamilyId,FieldId>} |
| AuthoredActualAdaptationFact | Fact: RegulatoryExposureFact or ProceduralPracticeFact |
| RegulatoryExposureFact | CharacterId; ExposureReferentId; ActualContactCount: unsigned integer |
| ProceduralPracticeFact | CharacterId; ProcedureId; CompletedRepetitions: unsigned integer |
| AutomaticAdaptationInput | AutomaticAdaptationInputId; Basis: RegulatoryExposureFact or ProceduralPracticeFact; OccurredAt: existing SimInstant; TransformationVersion |
| AuthoredAdaptationFactProducerDefinition | EventTypeId; PayloadSchema; OutputSchema; Phase |
| AuthoredFactConsequenceBridgeDefinition | Channels: nonempty map<ObservationChannelId, existing ObservationChannel> |
| FixtureConsequenceObservationInput | Truth: complete existing BoundedEffectTruth; Channel: complete existing ObservationChannel |
| AdaptationRuleDefinition | Match: Exposure {ExposureReferentId} or Practice {ProcedureId}; TargetStateFamilyId; TargetLeafFamilyId; KeyDerivation; Gate; Step: signed nonzero integer |
| AdaptationReadTarget | StateFamilyId; LeafFamilyId; KeyDerivation |
| RuleResolutionContract | Rules: set<AdaptationRuleId> |
| AdaptationTransitionRegistrationExtension | AcceptedBasis: RegulatoryExposureFact or ProceduralPracticeFact schema selector; RuleResolutionContract; OutputProduction |
| TransitionRegistrationV06 | ExecutingSeamId; ExecutingSeamVersion; TransitionDefinitionV06; IngressDefinition; AdaptationExtension |
| TransitionDefinitionV06 | InputAdmission; ReadDomain: set<StatePathPattern>; OutputDefinitions; WriteCapability |
| AdaptationOutputProductionDefinition | DispatchSchema; EvaluationSchema; Rule: ExactlyOnePerResolvedAdaptationRule |
| AdaptationDispatchRecord | DispatchId: AdaptationDispatchId; Input: complete AAI; ApplicableRules: set<AdaptationRuleId>; TransformationVersion |
| AdaptationEvaluationResult | EvaluationId: AdaptationEvaluationId; DispatchId: same execution's dispatch reference; RuleId; TargetPath: StatePath; Prior; Result; TransformationVersion |
| AdaptationSettlementDefinition | Consumers: set<TransitionKindId>, exactly the two ADAPT consumers; PhasePolicy: ExclusiveAdaptation140 |

| Union / variant position | Exact alternatives and payloads |
|---|---|
| Load capacity | Unbounded: none; Bounded: Maximum |
| DomainSource | LeafLocalScale: Scale; RegulatoryVariableFromKey / LoadDomainFromKey / ProcedureFromKey: none |
| Storage | Unmaterialized: none; Materialized: RootStateTypeId and LeafFields |
| Match | Exposure: ExposureReferentId; Practice: ProcedureId |
| KeyDerivation | ExposureVariable: RegulatoryVariableId; RegulatoryVariable: RegulatoryVariableId; Load: LoadDomainId; Procedure: none |
| Gate | Always: none; FrozenBaseline: Source containing complete AdaptationReadTarget |
| WriteCapabilityV06 | accepted NoStateWrites: none; StateWrites: MutationAuthority and nonempty set<Campaign2StateFamilyId> WritableFamilies |
| TransitionInputProducerV06 | accepted FrozenSemanticExperienceProducer / RegisteredTransitionProducer payloads unchanged; AuthoredAdaptationFactProducer: ProducerDefinition fixed to definition/authored-adaptation-facts |
| Prior | Absent: none; Present: complete AdaptationLeafValue |
| AdaptationLeafValue | exactly the five distinct value records in §2; target-specific schema required |
| Result | NoStateChange: none; StateChange: existing StatePatch with one effective operation |

Fact/Basis variants embed the exact fact record, not duplicated field sets. Existing V04 input,
ingress and output records are reused with their unchanged fields, apart from the explicitly named
V06 producer/capability extensions. Generic output definitions contain only the exactly-one dispatch;
ADAPT production contributes rule-indexed evaluations. No stored Function or Resolution discriminator.
AdaptationEvaluationReadProjection is execution-local, not a canonical record or registry entry.

All new union layouts forbid payload fields belonging to other branches. Presence of unrelated
variant fields is invalid even if their value would be unused. Exactly-one scalar tags already
frozen in C/D are preserved; packaging does not reopen their semantics to remove them.

## 4. Registry and version matrix

The final composed semantic target is **adaptation-input/0.31-candidate**. Use it for all ADAPT-owned
definitions and transformations below. Candidate spelling identifies the proposed composed version;
whole ADAPT shape acceptance was recorded on 2026-09-06. Do not upgrade accepted E to 0.32
for editorial packaging. A genuine semantic change requires an explicit E reopening and coordinated
ADAPT version bump, not a mixed semantic bundle.

| RegistryKindId member | StableId family / member | Definition | Target DefinitionVersion |
|---|---|---|---|
| registry/campaign2-state-family | RegistryDefinitionId / definition/campaign2-state-families | Campaign2StateFamilyRegistry, exactly one | adaptation-input/0.31-candidate |
| registry/adaptation-leaf-family | LeafFamilyId, exact five members | AdaptationLeafFamilyDefinition | adaptation-input/0.31-candidate |
| registry/load-domain | LoadDomainId | LoadDomainDefinition | adaptation-input/0.31-candidate |
| registry/procedure | ProcedureId | ProcedureDefinition | adaptation-input/0.31-candidate |
| registry/adaptation-rule | AdaptationRuleId | AdaptationRuleDefinition | adaptation-input/0.31-candidate |
| registry/authored-adaptation-facts | RegistryDefinitionId / definition/authored-adaptation-facts | AuthoredAdaptationFactProducerDefinition, exactly one | adaptation-input/0.31-candidate |
| registry/authored-fact-consequence-bridge | RegistryDefinitionId / definition/authored-fact-consequence-bridge | AuthoredFactConsequenceBridgeDefinition, optional singleton | adaptation-input/0.31-candidate |
| registry/transition-registration | TransitionKindId, two ADAPT consumers | TransitionRegistrationV06 | transition-admission-extension/0.6-candidate |
| registry/adaptation-settlement | RegistryDefinitionId / definition/adaptation-settlement | AdaptationSettlementDefinition, exactly one | adaptation-settlement/0.2-candidate |
| registry/transition-registration | accepted EVID TransitionKindIds | accepted V04 TransitionRegistration | transition-admission/0.4-candidate |
| registry/transition-admission | RegistryDefinitionId / definition/transition-admission | accepted singleton grammar; additive admitted map entries | transition-admission/0.4-candidate |

Rule-entry DefinitionVersion equals its ADAPT consumer ExecutingSeamVersion, both 0.31-candidate.
The V06 *wrapper* is 0.6-candidate; it is not the consumer's executing semantic version. All ADAPT
AAI/dispatch/evaluation TransformationVersions are 0.31-candidate. SEM freeze retains
semantic-binding/0.1-candidate#SEM-001H; observation and EVID records/versions do not change.

Independent accepted homes remain character-learning-evidence/0.5-candidate,
regulatory-reference/0.5-candidate, identity-binding/0.5-candidate,
projection/0.3-candidate-addendum and state/0.3-candidate-addendum. No rule/domain definition is
allowed under a foreign StableId family merely because its payload has the right shape.

The family registry's ten members remain belief-expectation, episodic-memory, associations,
values, procedural-skill, habits, person-model, relationships, regulatory-adaptation and
identity-disposition. Only procedural-skill and regulatory-adaptation have Materialized storage
and route/automatic-adaptation; the other eight have Unmaterialized and route/character-learning.

## 5. Identity ownership audit

M means definition/declaration is committed to ModelIdentity. R means ordered input or initial
state contributes to RunIdentity; execution occurrences/state are generated under that run.
An ID's appearance in both tiers does not transfer its semantic ownership.

| Identity / vocabulary | Owner | Representation | Registry home / StableId family | Tier | Referenced by |
|---|---|---|---|---|---|
| Campaign2StateFamilyId | ADAPT A | new governed typed family; symbolic members | family singleton's map key, not separate StableId | M | route/storage/capability/rules |
| LeafFamilyId | ADAPT F | new governed typed family; five symbolic members | registry/adaptation-leaf-family / LeafFamilyId | M | storage fields, rule/read target, domains |
| LoadDomainId | ADAPT F | new governed model typed family | registry/load-domain / LoadDomainId | M, R references | load keys and rules |
| ProcedureId | ADAPT F | new governed model typed family | registry/procedure / ProcedureId | M, R references | practice facts, keys and rules |
| AdaptationRuleId | ADAPT E | new governed model typed family | registry/adaptation-rule / AdaptationRuleId | M, execution references | consumer Rules, dispatch/evaluation |
| AutomaticAdaptationInputId | ADAPT D | distinct runtime occurrence family | shared OccurrenceIdentities, keyed by AAI schema | execution | AAI, dispatch.Input |
| AdaptationDispatchId | ADAPT C | distinct runtime occurrence family | shared OccurrenceIdentities, keyed by dispatch schema | execution | dispatch, evaluation.DispatchId |
| AdaptationEvaluationId | ADAPT C | distinct runtime occurrence family | shared OccurrenceIdentities, keyed by evaluation schema | execution | evaluation |
| FixtureConsequenceTruthId | ADAPT D fixture | distinct runtime family within TruthRecordId sum | fixture construction/accepted truth encoding; not a second semantic registry | execution | bridge truth only |
| CharacterId | IDN | SemanticReferentId namespace 1002 with character qualification | accepted semantic referent/content home, no extra StableId family | M/R references | actual facts and keys |
| ExposureReferentId | accepted semantic family; ADAPT role use | namespace 1002, no DomainValidator | accepted authored/runtime origin homes, no exposure registry | M/R references | exposure match/fact/keys |
| RegulatoryVariableId | REG | REG-owned governed typed family | accepted REG variable/reference registry | M/R references | keys, rule variables, domain resolution |
| RegulatoryReferenceParameterId | REG | accepted REG parameter identity shape | accepted REG declaration-local parameter map | M | R0 anchors/parameters |
| LearningRouteId | shared transition substrate | accepted symbolic typed family, allocation carried from EVID | TransitionRouteDefinition/family Route | M | route closure |
| MutationAuthorityId | state substrate | existing namespace 1025 | StateOwnershipRegistry; existing authority representation | M/execution | two adaptation authorities, StateWrites/diff |
| TransitionKindId | substrate | existing namespace 1009 | registry/transition-registration / TransitionKindId | M/execution | two consumers and accepted EVID transitions |
| EventTypeId | SEM/scheduler vocabulary | existing namespace 1001 | committed source/ingress/fixture declarations | M/R/execution | authored source, two consumers, bridge continuations |
| RegistryKindId | governance | existing namespace 1023, governed text payload | enclosing SemanticRegistryEntry.RegistryKind | M | registry matrix above |
| RegistryDefinitionId | accepted EVID substrate | shared shape-accepted typed family; not yet permanently allocated | singleton StableIds | M | family/source/bridge/settlement definitions |
| RecordTypeId / FieldId | canonical schema substrate | existing numeric schema domains, not invented typed-ID namespaces | canonical schema registry and field declarations | M/schema | all schema/path/role references |
| OutputAccessor / ProjectionAccessorId | shared projection substrate / PRJ allocation surface | existing TypedIdentifierValue; new shared family, namespace and member payloads deferred to Campaign 2 F | contract requirement; no accessor registry or StableId definition | M/trace reference | ResolvedCharacterSubject and two fixed ADAPT requirements |
| ObservationId / ExperienceId / EVID occurrence IDs | accepted observation/SEM/EVID | existing accepted occurrence shapes; allocation as owned upstream | accepted producer/occurrence declarations | execution | unchanged consequence branch |

New governed model families require unique symbolic identifiers within their own registry; their
permanent namespace/payload allocation must be entered in the combined allocation table. No local
name, table row number or iteration index may serve as an allocated ID. Runtime occurrence families
consume the accepted allocator; they never derive identity from rule, key, source or equation output.

For the five new model families in this table, the payload grammar is nonempty canonical UTF-8 NFC
text with canonical byte equality and no aliases. No case folding, display-name equivalence or
semantic string interpretation defines identity. The table's symbolic
family/leaf member spellings are those text values; namespace allocation remains separate. Load,
procedure and rule definition keys are model-authored governed text, not free runtime strings.
Campaign2StateFamilyId and LeafFamilyId have exactly the contract's closed ten/five member sets.
LoadDomainId, ProcedureId and AdaptationRuleId may vary by model using that exact text grammar.
The four new runtime families use the existing allocator's occurrence representation, with distinct
namespaces to be assigned in the combined allocation table. None receives a text-derived ordinal.

### Required event and transition members

These are symbolic member spellings in existing EventTypeId/TransitionKindId families, not new
namespaces or allocated member numbers. The continuation names complete D's five-event inventory.

| EventTypeId member | Phase / payload | Governing producer or registration |
|---|---|---|
| event/authored-adaptation-fact | 110 / AuthoredActualAdaptationFact | InputOnly source singleton; initial input compiler alone |
| event/regulatory-adaptation | 140 / complete AAI with RegulatoryExposureFact basis | transition/regulatory-adaptation V06 registration |
| event/procedural-adaptation | 140 / complete AAI with ProceduralPracticeFact basis | transition/procedural-adaptation V06 registration |
| event/fixture-consequence-observation | 120 / FixtureConsequenceObservationInput | bridge child of actual R |
| event/fixture-consequence-tracking | 121 / existing SupportingObservationId | actual observation continuation |
| event/fixture-consequence-binding | 122 / same supporting-observation payload | tracking continuation |
| event/fixture-consequence-classification | 123 / same supporting-observation payload | binding continuation |
| event/fixture-consequence-freeze | 124 / same supporting-observation payload | classification continuation; actual SEM freeze |

Both transition members have route/automatic-adaptation. Their StateWrites capabilities name,
respectively, authority/regulatory-adaptation with {regulatory-adaptation} and
authority/procedural-skill with {procedural-skill}. The two authority members use existing namespace
1025. StateOwnershipRegistry owns their exact four/one physical leaf patterns, independently of
route declarations. Source and bridge fixture events have no learning-route write authority.
Accepted EVID event/transition members remain unchanged and are not renamed by this table.

AuthoredAdaptationFactProducerDefinition binds exactly the source event above, source record,
AAI schema and phase 110. Both V06 registrations use the same complete AAI input schema with D's
producer relation and their distinct AcceptedBasis selectors; each ingress specifies its event
above, SameAsProducer, phase 140, ExactAdmittedSourceOutput and ExactlyOncePerSourcePerConsumer.
Their RuleResolutionContract sets reference only the matching basis rules. Bridge continuations
have the exact parents, dependencies, allocation order and accepted operation checks frozen in D.

Explicitly absent: load UnitId, ExposureReferent namespace/qualification registry, function/key-rule
IDs, source certificate ID, per-rule accessor ID, REG state authority and per-character state roots.

## 6. Accessor family — CLOSED by shared PRJ allocation clarification

Inspection found generic TypedIdentifierValue in state.ts/ActualReadRecord, symbolic
ResolvedCharacterSubject in IDN, and only unrelated fixture namespaces in tests. No permanent
accessor family existed. The resolution is **ProjectionAccessorId**, owned by the shared projection
substrate / PRJ allocation surface, not ADAPT, IDN, EVID or trace. See the normative allocation
clarification in [PRJ](SUBSTRATE_ADDENDA_DRAFT.md#prj-allocation-clarification--projectionaccessorid-2026-09-06).

Carry these symbolic members together without renaming or assigning namespace/payload numbers:

```
ResolvedCharacterSubject
accessor/adaptation-target-prior
accessor/adaptation-gate-prior
```

Campaign 2 F selects and records the exact canonical namespace and member payloads in the shared
allocation registry. No test namespace promotion, hashes, seam-local values or unrelated namespace
borrowing. ProjectionAccessorId is an additional **shared prerequisite allocation family**, not one
of the nine ADAPT-owned families in §5. No accessor registry or definition record is created.

The role is namespace-only, DomainValidatorId absent. Enforce at the Campaign-2 contract-definition
boundary for PRJ OutputAccessor, IDN's subject accessor, ADAPT's two fixed accessors, and newly
declared static/dynamic accessors participating in an extended contract. Wrong namespace fails
INVALID_CONFIGURATION before projection construction. Existing static accessors joining an extended
contract require explicit contract migration. Runtime copies validated values to ActualReadRecord;
do not narrow generic type 147 or reinterpret legacy contracts outside the addendum.

Complete requirement identity remains (SeamId, SeamVersion, ProjectionAccessorId); the family alone
does not globally define a path or meaning. Same-member reuse across different seam/version scopes
is permitted; duplicate declarations within one contract still fail PRJ's cross-collection check.
Changing a declared accessor changes ModelIdentity; changing either E-fixed member requires an
ADAPT semantic version change. No ProjectionRequirementId or PRJ shape reopening is needed.

Shared gates PRJ-F-ACCESSOR-1 and PRJ-F-ACCESSOR-2 are frozen NOT PASSED, together with P2a/P12b.
They check all three members, wrong-namespace construction rejection, permitted coexistence and
rejection of fixture/DerivationFunctionId substitution. Namespace and member-number assignment is
still a future allocation action, not a missing semantic owner.

## 7. Occurrence, failure and closure audit

| Produced schema | Identity extraction / role | Exact producer closure |
|---|---|---|
| AutomaticAdaptationInput | AutomaticAdaptationInputId, namespace-only own family | one actual D source R, exactly one output |
| AdaptationDispatchRecord | DispatchId, namespace-only AdaptationDispatchId | one admitted ADAPT consumer execution, exactly one |
| AdaptationEvaluationResult | EvaluationId, namespace-only AdaptationEvaluationId | same execution, exactly one per resolved rule in canonical RuleId order |
| Fixture BoundedEffectTruth | existing TruthRecordId, fixture-created FixtureConsequenceTruthId | one fixed pulse per bridge-admitting R, shared across its channels; no global PRJ narrowing |
| Observation / SEM experience / EVID E and L | unchanged upstream occurrence identities/rules | actual accepted observation, reservation/freeze and EVID producer chain |

The first three have one shared OccurrenceIdentityRule per exact schema and matching additive PRJ
RecordField roles. Evaluation.DispatchId is a reference with the same identity role, not an extra
occurrence declaration. Fixture truth uses the existing accepted truth union/construction path;
the shared EVID top-level-field mechanism is not retrofitted onto all historical SEM records.

Flat failure additions retained: TRANSITION_WRITE_SCOPE_VIOLATION, ADAPTATION_TARGET_PATH_VIOLATION,
ADAPTATION_MUTATION_DIFF_VIOLATION, ADAPTATION_TARGET_COLLISION, ADAPTATION_STAGE_VIOLATION,
ADAPTATION_REFERENCE_UNKNOWN_VARIABLE, ADAPTATION_REFERENCE_OUT_OF_RANGE,
INPUT_ONLY_EVENT_ORIGIN_VIOLATION and ADAPTATION_MAGNITUDE_OUT_OF_RANGE. Reuse existing type 162.
Guaranteed rule collisions fail INVALID_CONFIGURATION; runtime read-path permission fails
ILLEGAL_READ; invalid stored magnitudes do not. Accepted PRJ/WRT failures retain precedence.

| Audit | Symbolic result / final gate |
|---|---|
| One semantic owner per identity | Ownership table separates nine new ADAPT families from shared prerequisite allocations; ProjectionAccessorId has exactly one owner, PRJ. |
| One registry grammar/version per StableId | Matrix fixes each kind/family/version; V04 and V06 share one kind with disjoint admitted row versions, not duplicate keys. |
| Exact key roles and unique grammar | Five distinct key types; each physical pattern gets one StateKeyGrammarDefinition. No orphan or duplicate grammar permitted. |
| Unique value/owner/domain | Each physical pattern has one OwnedLeafDefinition and owner; domain-only leaf entries introduce no competing key/value/ownership copy. |
| Unique occurrence producer/identity closure | Table distinguishes shared registered outputs from accepted fixture truth/SEM construction. Both-affected positive outputs must be inhabited. |
| No unused or duplicate fields | Scale belongs only to the selected domain home; reference stays REG; capacity stays load definition. No extra fields in rules/values. |

Also require all rule/domain references resolve, no orphan rule, exactly five leaf definitions,
exact ten logical families, no accessor collisions, exact V04/V06 coexistence and source/consumer
production. Rule match identity validity and definition existence remain separate checks.

Proposed packaging vectors AD-F1..6 (FROZEN FOR REVIEW, NOT PASSED) correspond to the six audit rows:
round-trip all exact records/variants; mutate identity roles and registry homes; delete/duplicate
key grammars; duplicate or misroute value/domain/ownership declarations; delete/duplicate outputs;
insert unused fields or alternate scales. Include authored/runtime exposure roles, zero/negative
scale or bounded Maximum rejection, cross-domain-ID substitution, baseline persistence and V04/V06
version mutants. AD-E1..13, AD-D1..15, AC-A..L, main ADAPT controls, REG and EVID gates remain intact.

**AD-F7 — authoritative adaptation-state invariant (FROZEN FOR REVIEW, NOT PASSED).** Initial and
restored explicit-zero entries fail INVALID_VALUE. Tolerance above Scale, bounded load above Maximum,
unknown LoadDomainId, unknown ProcedureId and unknown RegulatoryVariableId fail even when the leaf
is untouched and no E rule reads it. Include unknown regulatory variables in tolerance/sensitization
keys as well as displacement. Valid nonbaseline state and empty maps pass static validation.
A signed nonzero displacement with valid key/schema but REG-invalid effective value at T passes
the static operation, then fails the separate REG pass. Assert initial/restore propagation and
settlement STATE_VALIDATION_FAILURE/rollback separately. Mutants dropping zero normal form,
domain-definition existence, bounded-load checks or full-map coverage must fail. A future-writer
control must reach the same invariant, independent of E. Numeric candidate-q errors keep E's code;
write-value errors keep the write boundary. None is reclassified as ILLEGAL_READ.

No tests are claimed passed by these symbolic audits. Section 6 and the packaging shape are closed.
The authorized combined allocation pass must verify canonical schema/union manifests against these
accepted symbolic tables, in both directions, before implementation. Physical units, general kinetics, cognition, ORD and delayed adaptation
remain deferred exactly as before.

Revision 3 (2026-09-06): freezes the closed authoritative static invariant, existing failure
carriers and AD-F7; makes text-ID grammar exact. Static validity is distinct from dynamic REG
validity. F's remaining identified contract gap is addressed for final composition review, not
declared passed or whole-contract shape accepted. No permanent allocation or implementation.


Revision 2 (2026-09-06): shared ProjectionAccessorId resolves the sole known identity-home gap.
PRJ owns allocation; all three consumers share its members. A–E behavior and all component
versions remain unchanged. Final packaging/composition review is next, not permanent allocation.


## Acceptance — 2026-09-06

2026-09-06 whole-contract verdict: SHAPE ACCEPTED at adaptation-input/0.31-candidate with
transition-admission-extension/0.6-candidate and adaptation-settlement/0.2-candidate. A–D are
shape accepted as composed, E revision 2 unchanged, and F packaging revision 3 shape accepted.
Permanent allocation is now authorized as the next specification step; canonical implementation
is NOT authorized. ADAPT-001 stays OPEN in the formal register until PHEN-ADAPT-001 and required
proof/mutation gates pass. VAL-001 does not block shape acceptance or allocation; close it before
canonical reliance on affected governed executables, including the CONTENT-001 character-kind
validator. AD-F1..7, AD-E1..13, AD-D1..15, AC-A..L, main ADAPT controls, REG-A..R, EVID-A..T and
applicable inherited PRJ/WRT gates remain frozen; this verdict passes no implementation gate and
does not rescind previously recorded WRT substrate proof. PHEN-ADAPT-001 remains NOT PASSED.


Whole-contract allocation clarification (2026-09-06): both transition/regulatory-adaptation and
transition/procedural-adaptation have ExecutingSeamId = SeamId/1036 with exact canonical NFC text
payload seam/automatic-adaptation. ExecutingSeamVersion remains adaptation-input/0.31-candidate.
This freezes the previously unspecified member of an already accepted field; no equation, record
shape, D source, F domain or PRJ semantics changes. Separate regulatory/procedural seam IDs are not
introduced. See the campaign2-allocation/0.2 review candidate; numeric acceptance is still pending.
