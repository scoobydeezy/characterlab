# ADAPT-001 — final shape consolidation, pass 8

2026-09-06. **SHAPE ACCEPTED AS COMPOSED**, companion to `adaptation-input/0.31-candidate`.
Accepted registration grammar: `transition-admission-extension/0.6-candidate`.
Accepted transactional extension: `adaptation-settlement/0.2-candidate`.
Permanent allocation authorized and pending; canonical implementation remains gated. No vector pass.

This document and [F packaging revision 3](ADAPT_001_PACKAGING_DRAFT.md) supply the accepted
composition beneath [ADAPT](ADAPT_001_DRAFT_RESOLUTION.md). Accepted prerequisites remain unchanged.
Historical pass notes are retained as history; the current disposition below governs readiness.

## Inspection and authority disposition

The Architecture map requires automatic embodied/procedural adaptation separately from character
learning. The Research Program and Campaign Plan require exact seam shapes before construction.
The current ledger records SEM closed, despite AGENTS.md's historical Campaign-1 status paragraph.

| Surface | Inspection finding | Consolidation consequence |
|---|---|---|
| state.ts / STATE_MODEL | StatePath is root record type, field, selectors. WritableLeafDeclaration has a pattern; no generic routed StateFamilyId exists. | Define family denotation independently of transition permissions; do not equate a family with an arbitrary path pattern. |
| PRJ | CanonicalRecordKey and RecordField roles are shape-accepted. OwnedLeafDefinition is preserved. | Reuse composite keys and additive key/role declarations. |
| WRT | resolveWritableLeaf precedes owner checks; setters and removers share the prefix. | Never replace that prefix with a route check or candidate validator. |
| EVID | transition-admission/0.4-candidate admits NoStateWrites and ExactlyOnePerExecution only. Registered ingress is generative. | Writing and rule-indexed results require an explicit version extension; unchanged EVID registrations keep their accepted version. |
| scheduler.ts | Handlers receive working state; nextState is validated and installed per handler. Invariants receive state without T; StateAdapter.validate has no T. | Neither the shared phase-140 snapshot nor time-dependent REG validation is already expressible through these callbacks. Define an explicit transaction-stage extension. |
| TIME / REG | R0 is derived from committed declarations; local validation has exact result variants. | Pass T explicitly; preserve REG failure identity and prohibit correction on failure. |
| observation.ts | Bounded quantities are ExactRational. | Withdraw ADAPT §2.15's claim that observation already supplies this scaled-integer representation. ADAPT's exact scaled integers are its own proposed numeric profile. |
| REG | Each V has its own abstract domain, with Scale/Minimum/Maximum and no Unit. | Remove regulatory Unit and redundant scalar-domain metadata. |
| EVID output | OutcomeLearningEvidence embeds Evaluation embeds ConsequenceExperience; no top-level ObserverId or CharacterId. | Do not fabricate a flat subject selector or a learning-state consumer for the separation fixture. |
| automatic fact ingress | src contains an output-boundary guard, not an admitted actual-exposure/practice production contract. | Truth-fact ingress remains an explicit ADAPT-owned construction item below. A typed payload or causal parent alone cannot certify it. |

Inspection anchors: [state](../../src/substrate/state.ts), [scheduler](../../src/substrate/scheduler.ts),
[ordering](../formal/EVENT_ORDERING.md), [EVID](EVID_001_DRAFT_RESOLUTION.md),
[REG](REG_001_DRAFT_RESOLUTION.md), [PRJ/WRT](SUBSTRATE_ADDENDA_DRAFT.md).

## 1. Logical families and physical storage

**Revision-2 decision:** introduce Campaign2StateFamilyId for the ten architectural nodes.
This supersedes pass 1's root=family proposal. A root remains a physical schema, not a topology ID.

```
Campaign2StateFamilyRegistry
    Families       map<Campaign2StateFamilyId, Campaign2StateFamilyDefinition>

Campaign2StateFamilyDefinition
    Route          LearningRouteId
    Storage        Unmaterialized
                 | Materialized {
                     RootStateTypeId,
                     LeafFields: map<LeafFamilyId, FieldId>
                   }
```

Freeze the ten symbolic members from ADAPT §2.13: belief-expectation, episodic-memory,
associations, values, procedural-skill, habits, person-model, relationships, regulatory-adaptation,
identity-disposition. Exactly those ten keys are required in this initial model. Eight map to
route/character-learning and Unmaterialized; the two automatic families map to their existing
proposed roots. Unmaterialized forbids root/leaf payload fields. Neither storage variant contains
MutationAuthorityId: mutation ownership has only its accepted StateOwnershipRegistry home.
The old eight authority names remain future ownership intent, not active ownership declarations.

One bundle uses RegistryDefinitionId member definition/campaign2-state-families, RegistryKindId
member registry/campaign2-state-family and DefinitionVersion adaptation-input/0.31-candidate.
Reuse EVID's RegistryDefinitionId family; allocate the new topology family/members only at F.

Materialized roots and LeafFamilyIds each have one logical owner. Every leaf field resolves to its
canonical map schema, exact OwnedLeafDefinition and additive PRJ key/role declarations. The map
covers all state fields of that root. Roots are not aliases, and a writable root must resolve to
one materialized logical family. Route is declared directly, never inferred from authority.

StorageAuthorities(F) is the set of owners, resolved through the accepted StateOwnershipRegistry,
of all OwnedLeafDefinitions reached through F.LeafFields. For each of the two initial materialized
families require exactly one derived owner. The capability below must name that owner. A family
spanning multiple authorities requires a versioned extension. No duplicate stored ownership fact
or topology-authority equality predicate is introduced.

```
StorageRoot(F) = absent or the declared root
extent(F,S) = {}                                      if Unmaterialized
            = ordered (StatePath,value) entries
              rooted at StorageRoot(F)                otherwise
```

Compare exact paths, presence and values, not hashes. Empty extents of the eight unwritten families
are honest scaffold preservation, not proof of belief/memory/value mechanics. No cognitive storage
schemas, placeholder roots or opaque sentinel values are required by ADAPT. EVID's separate output
closure must remain genuinely inhabited; these empty state extents cannot substitute for it.

Inspection: state.ts StateOwnershipRegistry permits an authority with an empty patterns array;
there is no nonempty check. Claimed patterns with no writable schema do fail. Nevertheless this
proposal creates no empty authority declaration for an unmaterialized family: topology requires
neither dummy authority nor physical root.

The two materialized roots remain:
RegulatoryAdaptationState {Tolerance, Sensitization, Displacements, Loads};
ProceduralSkillState {Competence}. Each field is a canonical map with the §2.14 key:
C/X/V, C/X/V, C/V, C/LoadDomain, C/Procedure respectively. Values and domain packaging remain
explicit ADAPT work. Each path has one complete canonical-record mapKey selector.
Character key fields use namespace 1002 + validator/character-qualification. V consumes REG.
This proposal changes no PRJ mechanical key or StatePath denotation.

## 2. StateWrites extension

### Exact version coexistence

The accepted singleton remains exactly definition/transition-admission, kind
registry/transition-admission, DefinitionVersion transition-admission/0.4-candidate and canonical
TransitionAdmissionRegistry. Its LearningRoutes, TransitionRoutes and OccurrenceIdentities maps
may contain the additional admitted ADAPT members using their existing grammars. ModelIdentity
changes with those declaration bytes; singleton schema and semantic version do not change.

The extension's closed registry-admission matrix selects registration grammar by exact row version:

| Kind | StableId | DefinitionVersion | Grammar |
|---|---|---|---|
| registry/transition-admission | RegistryDefinitionId / definition/transition-admission | transition-admission/0.4-candidate | accepted singleton, exactly one |
| registry/transition-registration | TransitionKindId | transition-admission/0.4-candidate | accepted TransitionRegistration (V04), NoStateWrites only |
| registry/transition-registration | TransitionKindId | transition-admission-extension/0.6-candidate | new TransitionRegistrationV06, including StateWrites and its explicit ADAPT extension |

V04 is never decoded as V06. EVID registration record/schema/version bytes remain identical; ADAPT
consumers use only V06. StableId and ConsumerEventType uniqueness apply across both versions.
RegisteredTransitionProducer resolves either admitted version; ingress dispatches on the committed
DefinitionVersion, never host-handler type or "latest version". V04 OutputRecordSchemas remains
its exact accepted derivation; V06 ADAPT adds only its declared rule-indexed evaluation schema.
No replacement V06 singleton or duplicate singleton is admitted. EVID-only models retain their
accepted admitting validator; the extension model explicitly admits both rows plus unchanged SEM
kinds and its own exact declared extension kinds. Wrong/unknown versions fail INVALID_CONFIGURATION.

No additional shared-singleton data is required by this pass. V06's complete canonical registration
will contain its generic execution/admission/ingress/capability data and one nested
AdaptationTransitionRegistrationExtension with AcceptedBasis, RuleResolutionContract and
OutputProduction. [E revision 2](ADAPT_001_RULE_INTERPRETER_DRAFT.md) now fills this exact V06 shape
and its rule-resolution fields using D's admission. Separate host-side tables cannot implement it.
No claim of full V06 shape acceptance yet.

Version 0.6 proposes the shared capability extension without changing accepted version 0.4:

```
WriteCapability = NoStateWrites
                | StateWrites {
                    MutationAuthority: existing MutationAuthorityId,
                    WritableFamilies: nonempty canonical set<Campaign2StateFamilyId>
                  }
```

WritableStateFamilies(T) is empty for NoStateWrites and exactly WritableFamilies otherwise.
Each writable F must be Materialized with a resolved root, StateFamilyRoute(F)=TransitionRoute(T),
and StorageAuthorities(F) equal to the singleton containing the capability's MutationAuthority.
WritableRoots(T) may be derived as {StorageRoot(F) | F in WritableFamilies(T)}; it is not stored.
Rules retain TargetStateFamilyId of Campaign2StateFamilyId and TargetLeafFamilyId of LeafFamilyId.
Resolve logical family → materialized root → leaf field → derived key → exact StatePath.
One transition cannot aggregate the two adaptation authorities. The regulatory and procedural
consumers therefore retain separate registrations. Route agreement does not grant input admission.

The actual candidate patch is checked against both the declared capability and the resolved rule's
one expected target path. NoStateWrites requires an empty patch and byte-identical authoritative
state, including attempted mutation outside declared leaf paths. Whole nextState replacement is
not an alternative write mechanism. StateWrites carries patches through the shared interpreter;
an executor cannot install arbitrary nextState or invent an authority.

Per operation, preserve accepted PRJ/WRT precedence exactly: StatePath syntax → declared key grammar
→ canonical role validity → resolveWritableLeaf → authority owns leaf → transition permitted-family
membership → exact rule-derived target path → accepted operation-specific expected-old/removal/value
checks → candidate diff and settlement validation. Removals follow the same prefix.
Malformed shape fails INVALID_PATH and malformed role fails CANONICAL_ROLE_VIOLATION before
UNDECLARED_WRITABLE_PATH or NON_OWNING_AUTHORITY can apply (PRJ §1.9/P11a).
NoStateChange has no operation. StateChange has exactly one effective Set or Remove at that path.
An equal-value Set is not a StateChange; baseline on absent state is NoStateChange; baseline from
nonbaseline is Remove. Explicit baseline entries remain noncanonical.

One StateWrites capability is permission, not evidence that a write occurred. The complete actual
diff must equal the staged StateChange paths and values, and contain no other mutation.

**Typed failures:** accepted TRANSITION_WRITE_FORBIDDEN remains exclusively the NoStateWrites
result violation described by EVID 0.4; it is not broadened. Propose flat SchedulerFailureCode members
TRANSITION_WRITE_SCOPE_VIOLATION for a globally legal write whose owning logical family is outside
StateWrites.WritableFamilies,
ADAPTATION_TARGET_PATH_VIOLATION for a permitted-root operation differing from its rule-derived
path, and ADAPTATION_MUTATION_DIFF_VIOLATION for a declared change whose complete actual diff
disagrees with its validated effective operation. They use existing diagnostic type 162 unchanged.
The first two occur in the order above after the accepted PRJ/WRT prefix; diff validation follows
valid operation checks. Wrong Prior/RuleId/DispatchId/output grammar remains
TRANSITION_OUTPUT_VIOLATION. No message parsing, generic ILLEGAL_WRITE substitution or NoStateChange
fallback is allowed. These extensions leave non-admitting and EVID-only models unchanged.

## 3. Rule-indexed production extension

Keep the generic EVID ExactlyOnePerExecution grammar unchanged. ADAPT owns a separate production
declaration, interpreted by the shared extension only for its admitted consumers:

```
AdaptationOutputProductionDefinition
    DispatchSchema          exact AdaptationDispatchRecord schema ref
    EvaluationSchema        exact AdaptationEvaluationResult schema ref
    Rule                    ExactlyOnePerResolvedAdaptationRule (ADAPT-owned closed tag)
```

The definition is stored in the ADAPT consumer's adaptation-specific registration, keyed by that
consumer TransitionKindId, alongside its basis/rule contract. No new generic multiplicity variant.
Generic OutputDefinitions retains its singleton dispatch schema/ExactlyOnePerExecution; the ADAPT
declaration alone supplies the evaluation schema and rule-indexed obligation. DispatchSchema must
equal that singleton schema; EvaluationSchema must be distinct. Construction rejects other schemas
or conflicting generic evaluation definitions. The shared OutputRecordSchemas accessor takes their
union only for these ADAPT registrations, preserving terminal closure and ingress auditing.
The rule is interpreted using that execution's closed ADAPT rule-resolution result, not an
arbitrary count callback, output-supplied rule set or caller-selected collection. A generic reusable
collection selector language is not introduced.

```
AdaptationDispatchRecord
    DispatchId                         new typed runtime occurrence
    Input                              complete admitted AutomaticAdaptationInput
    ApplicableRules                    canonical set<AdaptationRuleId>
    TransformationVersion              adaptation-input/0.31-candidate

AdaptationEvaluationResult
    EvaluationId                       distinct typed runtime occurrence
    DispatchId                         same execution's dispatch
    RuleId                             one member of ApplicableRules
    TargetPath                         complete existing StatePath
    Prior                              Absent | Present(AdaptationLeafValue)
    Result                             NoStateChange | StateChange(existing StatePatch)
    TransformationVersion              adaptation-input/0.31-candidate
```

Dispatch is exactly once per successful execution, including an empty applicable set. The multiset
of result RuleIds must equal ApplicableRules exactly, with no repeats or missing members. Every
result's path/prior/patch must equal the interpreter's computed evaluation. Returning N arbitrary
records of the right schema cannot satisfy production. Changing records to NoStateChange does not
change rule cardinality or free a target path from collision checking.

**Closed value payload:** AdaptationLeafValue is exactly the union of ToleranceValue,
SensitizationValue, RegulatoryAdaptationValue, AccumulatedLoadValue and ProceduralCompetenceValue.
The five proposed records each have one required Magnitude field: canonical unsigned integer for
all except RegulatoryAdaptationValue, whose Magnitude is canonical signed integer. No other fields,
arbitrary record, opaque bytes or general CanonicalValue variant is admitted. Field/domain packaging
under each exact LeafFamilyId remains item F; this union does not authorize cross-leaf conversion.

The closed ADAPT interpreter requires RuleId in the current dispatch's resolved set; DispatchId
equal to that execution's dispatch; TargetPath equal to that rule's declaratively derived path;
and Prior equal to the actual frozen-snapshot presence/value. Present must have exactly the value
record schema resolved for the target leaf, not merely any member of the five-way sum.
NoStateChange has no patch payload. StateChange contains an existing StatePatch with exactly one
effective Set or Remove at TargetPath. Set expected-old and Remove expectedOldValue agree with Prior;
Set newValue has the target leaf's exact schema/domain. Baseline normalization remains mandatory.
These relational checks are closed interpreter behavior; they cannot be replaced with callbacks.

Consuming transition and instant remain available from existing trusted execution trace context;
they are not duplicated in these output records. Source input carries OccurredAt. Dispatch stores
the complete input so its admitted basis is not redundantly copied or reclassified.

Allocate dispatch then evaluation IDs in canonical AdaptationRuleId order through the accepted
runtime allocator. Reuse EVID's OccurrenceIdentityRule machinery and explicit PRJ identity-field
roles for all three ADAPT output/input occurrence schemas. Repeating any occurrence identity fails
existing output closure. No IDs are derived from RuleId, StatePath, source ID or local loop index.
DispatchId references do not authorize reads or become a new persistent provenance graph.

Per execution the domain output sequence is exactly dispatch first, then evaluations in canonical
AdaptationRuleId order. The same sequence governs occurrence allocation, OutputProjection and trace
output ordering. Set iteration, resolver iteration and StatePath ordering cannot substitute for it.

Successful production is checked before any generated downstream ingress. Version 0.6 preserves
consumer-owned generation. The initial ADAPT model registers no downstream consumers of dispatch
or evaluation outputs; they are terminal truth-side outputs. This is an explicit initial scope,
not permission for an executor to ignore future registered consumers.

## 4. Exact exclusive phase-140 lifecycle

**Initial scope decision:** this admitting model permits only the two registered ADAPT consumers
at phase 140. Ordinary phase-140 handlers, including writers of unrelated roots, are not admitted.
No character-learning writer is added. This restriction may later be extended through a versioned
stage contract; it does not change generic scheduling in models that do not admit this extension.

```
AdaptationSettlementDefinition
    Consumers          canonical set<TransitionKindId> — exactly the two ADAPT consumers
    PhasePolicy        ExclusiveAdaptation140          — sole closed variant
```

A required singleton SemanticRegistryEntry uses RegistryDefinitionId member
definition/adaptation-settlement, RegistryKindId member registry/adaptation-settlement,
DefinitionVersion adaptation-settlement/0.2-candidate and that exact definition. The declaration,
consumer registrations and complete interpreted lifecycle commit through RegistryIdentity to
ModelIdentity. Unknown policy/consumer, missing singleton or ordinary phase-140 registration fails
INVALID_CONFIGURATION. A runtime bypass/undeclared phase-140 event fails ADAPTATION_STAGE_VIOLATION.
No configurable callback may supply the stage semantics.

1. Run retained-D validation at target T before domain handlers as specified in §5.
2. Drain all phases <140. Every automatic input must have been produced at phase 110 at T.
3. Extract all phase-140 ScheduledEvents at T from the transaction's ordinary queue, preserving
   EventSequence order and all original identities, parents, payloads and ingress associations.
   Do not allocate replacement events. Reject any event not mapped to a declared ADAPT consumer.
4. Validate admission and resolve rules for all extracted events. Derive all targets and reject
   duplicate full StatePaths before any evaluator runs, including prospective no-ops.
5. Capture one private immutable pre-adaptation snapshot of working state. Each evaluator receives
   only a capability-limited projection from it, with declared exact read paths. It never receives
   the full snapshot. ActualReadRecords name the paths and values actually obtained from those
   projections, including reads of absence; snapshot capture grants no extra read permission.
6. Consume extracted events exactly once through the batch interpreter, in EventSequence order,
   and rules in canonical RuleId order. Normal handlers do NOT execute for them, before or after
   the batch. Allocate dispatch/evaluation occurrence IDs here using the existing allocator;
   preserve normal work/cascade accounting, execution records and the current-event failure context.
   Stage domain outputs, ActualReadRecords and patches inside the existing instant transaction.
7. At the internal phase-140 barrier, validate output relations, operation preconditions and each
   candidate domain. Apply the disjoint patch union to a private candidate cloned from the frozen
   state, validate REG retained/candidate invariants and its exact complete diff, then install that
   candidate as working state. No intermediate adaptation patch was visible in working state.
8. Require no residual same-T work. Run final existing state/invariant/trace checks plus the final
   REG pass, then commit through ordinary whole-instant settlement. Phase 150 is not an event.

There are no ordinary phase-140 readers/writers in this version, resolving their observation
relation by explicit exclusion. The original event queue and allocator snapshot are restored on
failure at any step; a consumed batch event cannot execute twice or disappear after rollback.
If no phase-140 work exists, retained/final REG checks still execute; no artificial event/output is
created. Generated phase-140 automatic work after extraction is forbidden. Adaptation outputs are
terminal in this initial admitted model, so their emission cannot create another batch.

The stage preserves EventSequence for trace and allocator order only. It cannot affect evaluation
values through prior patches. Initial/restore queues are checked for the exclusive phase policy;
the same runtime checks defend generated queues. These are proposed extension semantics, not claims
that current scheduler.ts already implements batching.

The ADAPT-owned validateAdaptationStateStatic operation is frozen in
[F packaging](ADAPT_001_PACKAGING_DRAFT.md#closed-authoritative-static-state-invariant). Run it on
initial/restore admission, the final private phase-140 candidate before installation, and final
ordinary authoritative-state validation, including instants without adaptation work. It scans all
five maps independently of rule reads. Initial/restore static defects propagate the existing state
error; static candidate-validation failure uses STATE_VALIDATION_FAILURE with whole-instant rollback.
Static checks precede the corresponding REG pass below, never evaluate R0 and add no callback,
registry or scheduler code. Every future authorized writer to these roots inherits the invariant.

## 5. REG integration and exact failure boundary

Candidate validation calls REG.validateAdaptedReference(C,V,event.DueAt,Dcandidate), using C,V
from the exact RegulatoryAdaptationKey. Prior D is read from that same path in the frozen snapshot.
Missing state means zero only under ADAPT's baseline convention. REG never supplies that default.
Other leaf families do not reinterpret their magnitudes as regulatory displacement.

**Time-only enforcement proposal:** a governed validation pass over the Displacements map runs
(a) on initial/restore admission at the admitted clock, (b) at the beginning of every instant at
the target DueAt before any domain handler, and (c) on final candidate state before settlement
commit. It checks every present displacement through the same REG operation. Absent entries need
no scan over C×V because REG's construction proof guarantees R0+0 is in bounds throughout the clock.
Only this named map is scanned; occurrence records and unrelated state cannot become determinants.

An invalid retained D aborts before handlers can repair it. No-new-write instants still run the
check. No clamp, decay, baseline removal, D repair or R0 repair is inserted. An arbitrary future
R0 query is not clock advancement and does not run the state pass. Initial/restore failure prevents
run admission; transaction failure restores prior state, queue, allocators, trace and outputs.

The new pass is a closed ADAPT interpreter operation over its declared root/field and REG version.
It is not an anonymous StateAdapter validator; those lack T. Acceptance must version the scheduler
integration explicitly rather than claim the existing callback already does this.

Proposed flat SchedulerFailureCode additions owned by this extension:
ADAPTATION_TARGET_COLLISION, ADAPTATION_STAGE_VIOLATION,
ADAPTATION_REFERENCE_UNKNOWN_VARIABLE, ADAPTATION_REFERENCE_OUT_OF_RANGE.
The last two map exhaustively from REG's corresponding typed Failure variants, without message
parsing or Boolean-to-string recreation. Existing type-162 diagnostic carries the flat outer code;
no nested diagnostic schema is added. Configuration rejection uses INVALID_CONFIGURATION.
WRT/PRJ failures retain their accepted boundary precedence. Output and ingress defects retain
TRANSITION_OUTPUT_VIOLATION and TRANSITION_INGRESS_VIOLATION. Budget/cascade failures retain existing
scheduler semantics. NoStateChange cannot represent any of these failures.

## 6. OutcomeLearningEvidence integration

Consume accepted EVID as the two phase-130 registered producers, each with NoStateWrites and
exactly one declared output. ADAPT's character-learning output closure therefore contains actual
OutcomeEvaluation and OutcomeLearningEvidence occurrences in the positive fixture, not just schemas.
The automatic route admits neither. AutomaticAdaptationInput cannot be retagged or wrapped into L.

For both-affected controls, run the accepted SEM consequence path through EVID while independently
producing the truth-side automatic input. Freeze the exact phase-130 records and compare them before
and after adaptation. Across paired runs, match event topology/allocator consumption and compare
the full character-epistemic projection. Truth-side input differences are allowed; they are not
hidden inside an observer-safe record. First later cognitive divergence must descend from a new
permitted observation, never from D, REG, dispatch or an adaptation result.

No character-learning writer is added merely to consume L. A future writer needing CharacterId must
earn an admitted nested-selector/wrapper shape before PRJ/IDN lookup. EVID remains independent and
its accepted records and versions remain byte-for-byte unchanged. This pass decides neither ORD-001
nor same-event belief reads/writes. Eight unmaterialized logical families have empty persistent extents in this slice; nonempty EVID
output closure is independently required and does not imply cognitive storage or learning.

## 7. Frozen review vectors and preservation

Keep ADAPT §4 controls 1–12 and their lettered subcontrols, REG-A..R and EVID-A..T. None passes by
document review. Add these consolidation controls as proposed frozen vectors:

| ID | Required witness / mutant |
|---|---|
| AC-A | All ten logical families are declared. Unmaterialized families have empty extents and no placeholder roots/authorities. Materialized storage omission, duplicate owner or route mismatch fails. |
| AC-B | A right-authority patch to the wrong root/leaf/key fails; changing capability cannot override WRT ownership. Both set and remove exercise PRJ syntax/key/role before WRT resolution/owner; combined-invalid fixtures assert first failure. Scope, target and diff mutants assert their distinct new codes. |
| AC-C | 0/1/N rules produce one dispatch and exactly the matching result set. Missing/duplicate/foreign RuleId and fabricated no-op for zero rules fail before ingress. |
| AC-D | Distinct inputs with the same target collide before either evaluator runs, even when either or both would be no-ops. |
| AC-E | A noncolliding reader sees the common snapshot, not a preceding staged patch; permutation preserves values while allowing allocator/trace-order differences. |
| AC-F | Matched state-changing/no-op paired runs allocate one result per same rule set. A variable output topology must not masquerade as an epistemic divergence. |
| AC-G | Time-only REG invalidity on an unrelated-event instant fails before handlers; skipping the pass is caught. Initial/restore and final-candidate checks have independent fixtures. |
| AC-H | REG typed failures map to the exact outer enum, never message parsing. Invalid retained D cannot be made valid by a same-instant repair event. |
| AC-I | Late input or ordinary phase-140 event fails; batch events execute exactly once, with original IDs and normal accounting. Mutating the committed stage policy changes ModelIdentity; bypassing it is detected. |
| AC-J | Failure after staging, patch merge and output generation restores all transactional artifacts and allocator continuation. |
| AC-K | Both-affected EVID outputs exist and remain identical across the phase-140 boundary; raw observation/truth/automatic input cannot produce L. |

REFERENCE_MECHANISM_LEDGER dispositions: SUB-001/002 exact arithmetic and explicit rounding PORT;
SUB-003 identity PORT; SUB-008 trace/replay and SUB-009 paired experiments PORT; MEC-003 bounded
effect decomposition CONTRACT where applicable, not a universal exposure grammar. P3-009/P3-010
constitution/history separation CONTRACT/CORPUS. EXP-002/008 remain regression CORPUS.
CTL-001 and CTL-008 remain CONTROL only, not adopted physiology/addiction equations.
RET-006/014 truth-to-cognition leaks remain prohibited. Historical sources remain read-only.

## 8. F inventory and remaining shape work

Proposed additions: Campaign2StateFamilyId with ten members; the logical family/storage records
and registry bundle; StateWrites branch; ADAPT-owned production declaration; dispatch/evaluation
records and occurrence roles; committed settlement singleton and flat failure members. Root and
leaf identities remain separate. Carry accepted EVID/REG/IDN inventories forward unchanged.

Current dispositions (whole-contract verdict, 2026-09-06):
A–D — SHAPE ACCEPTED AS COMPOSED.
E revision 2 — SHAPE ACCEPTED at adaptation-input/0.31-candidate, unchanged.
F packaging revision 3 — SHAPE ACCEPTED, including static authoritative-state validation.
Whole composition — SHAPE ACCEPTED; no remaining design blocker identified.
Permanent allocation — authorized next specification step, pending.
Canonical implementation — NOT YET AUTHORIZED; allocation and applicable VAL-001 gate remain.
Formal ADAPT-001 row — OPEN until required implementation/phenomenon proof.

D must enforce AutomaticAdaptationInput.OccurredAt = authoritative producing truth occurrence time
= phase-110 producer DueAt = phase-140 consumer DueAt. No delayed/historical adaptation is admitted.
The truth producer need not have a learning route; the two consuming transitions must.
Payload shape, causal parents and timing alone do not establish actual production authority.

E must resolve membership from committed definitions and admitted facts only, never state.
Every cross-leaf read required by control 7j must resolve to a declared exact path within the
transition ReadDomain, produce ActualReadRecords and read the frozen snapshot. An evaluator cannot
widen permissions; a function identifier is not executable meaning. The first transform may be
thin enough to witness StateChange/NoStateChange without physiology or general skill learning.

F must allow deterministic resolution from LeafFamilyId to key grammar, value schema, baseline,
removal and governing magnitude definition without consulting Markdown. These requirements are resolved by accepted F revision 3. No prerequisite decision is reopened.

Deferred: ordinary phase-140 coexistence, same-path response aggregation, physical units, general
physiological kinetics, cognitive storage/learning equations, nested evidence subject addressing,
delayed adaptation and ORD-001/005. No allocation, implementation or passed-vector claim.

Pass 2 review additions: AC-G/H include an intentionally valid D written at T0 whose unchanged value
becomes invalid solely through R0 at T1. The first event at T1 fails before any domain handler;
prior settled state is intact and the run follows terminal Failed semantics. No same-instant repair.
AC-J additionally checks duplicate execution and deletion-without-consumption mutants.
No shape acceptance is recorded for ADAPT or either proposed extension.

Pass 3 controls: AC-L admits a shared V04 singleton, byte/schema/version-identical EVID V04 rows
and ADAPT V06 rows in one model. Reject StateWrites in V04, decoding EVID as V06, refusing V04
because V06 exists, or replacing the singleton version. AC-C/F additionally require dispatch then
canonical RuleId-ordered evaluations in occurrence allocation, OutputProjection and trace output.
AC-A/B check that family storage contains no authority field and permissions name logical families;
physical ownership resolves only through the accepted state registry.

[D — actual-fact ingress first draft](ADAPT_001_FACT_INGRESS_DRAFT.md) now proposes a narrow authored
actual-contact/practice control with explicit source-bootstrap authority, exact same-instant ingress
and AD-D1..6. It is unaccepted; complete V06/source-association packaging remains review work.
E transition math and F domain packaging were deliberately not designed in this pass.

Pass 4 (2026-09-06): A/B/C and V04/V06 coexistence remain internally resolved, not separately
shape-accepted. D revision 2 removes scheduler identity and Mode from domain payload/declaration,
adds an InputOnly compiler with verified replay restore, the exact V06 source union, corrected
paired RunIdentity and same-rule-set obligations. The common-root bridge relation is fixed; its
exact phase-120 receiving recipe remains unresolved D work. Corpus 0.25 / PHEN-ADAPT-001 1.9 and
topology inventory are aligned as drafts. E math/F packaging remain untouched.

Pass 5 / revision 28 (2026-09-06): [exact D bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md) proposes
the fixed pulse→accepted observation→SEM consequence freeze→EVID receiving recipe. AD-D11..15
cover common-root ancestry and hidden-count noninterference. Corpus 0.26 / PHEN-ADAPT-001 1.10
and topology inventory 0.5 are synchronized. A/B/C remain internally shape-ready; D recipe is
ready for review, not accepted. E/F remain open. No implementation or numeric allocation.

Pass 6 / revision 29: D revision 4 replaces historical replay with exact pending-source validation
from the committed initial schedule (non-cancellable InputOnly, source DueAt>0). Fixed bridge is
shape-ready; source always yields one AAI and 0 or |Channels| bridge children depending only on
the committed bridge singleton. D internally shape-ready for composition; E/F remain open.
No final ADAPT acceptance, allocation or implementation.


Pass 7 / revision 30: pass-6 review accepted D in substance. Actual ingress revision 4 already
contains compact pending-source restore; bridge and source now share the owning ADAPT 0.30 version.
Main §§2.2/2.8/2.13 are synchronized, including exact route-separation input failures. Corpus 0.26 /
PHEN-ADAPT 1.10 is present and its canonical manifest digest was rechecked. D and AD-D1..15 are
internally shape-ready / frozen NOT PASSED. E revision 1 is the only new behavioral proposal;
AD-E1..12 are frozen NOT PASSED. A/B/C/D were not redesigned. F remains after E review.


Pass 8 / revision 31: E revision 2 preserves the accepted semantic direction and fixture equation.
It fixes per-rule immutable projection instances and trace segments, rejects guaranteed same-input
target collisions at construction, and removes redundant Function/Resolution fields. C's output
production and runtime cross-input collision policy remain unchanged. AD-E1..13 frozen NOT PASSED;
E shape acceptance still pending. F follows E. No numeric allocation or canonical implementation.


E acceptance (2026-09-06): scoped component adaptation-input/0.31-candidate is internally shape
accepted; overall ADAPT remains draft. [F packaging inventory](ADAPT_001_PACKAGING_INVENTORY.md)
is the next composition input. Final packaging must explicitly reconcile draft-owned declaration/
transformation versions with the frozen E component; do not silently promote A/B/C/D or replace
E's accepted version. No representational contradiction is currently identified.


F composition update (2026-09-06): [symbolic packaging](ADAPT_001_PACKAGING_DRAFT.md) records
the supplied domain decisions and ownership audit. All ADAPT-owned semantic definitions target
adaptation-input/0.31-candidate; independent V06 and settlement targets remain 0.6-candidate and
0.2-candidate. Candidate version spelling is not whole-contract acceptance. A–E behavior is
unchanged; shared PRJ-owned ProjectionAccessorId now closes the accessor allocation-home gap. No allocation
or implementation. Historical status entries above remain review history.


Accessor resolution (2026-09-06): [F packaging revision 2](ADAPT_001_PACKAGING_DRAFT.md) and PRJ
record shared ProjectionAccessorId with three symbolic members, no numeric allocation and no
global type-147 restriction. No known identity-home gap remains; A–E and their versions are
unchanged. Final packaging/composition review remains before allocation or implementation.


Final-review correction (2026-09-06): F revision 3 defines full stored-state static validation
and AD-F7. REG retains the separate T-dependent displacement check. Initial/restore propagation
and STATE_VALIDATION_FAILURE reuse were verified against current scheduler/persistence source;
the new invariant is specified, not claimed implemented. Whole ADAPT acceptance remains pending.


## Whole-contract acceptance — 2026-09-06

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
