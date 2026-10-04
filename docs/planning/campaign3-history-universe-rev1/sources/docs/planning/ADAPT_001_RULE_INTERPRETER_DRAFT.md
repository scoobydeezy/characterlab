# ADAPT E — closed rule interpreter, revision 2

**Status: INTERNALLY SHAPE ACCEPTED**, 2026-09-06.
Frozen E component: `adaptation-input/0.31-candidate`, revision 2.
AD-E1..13: **FROZEN IMPLEMENTATION GATE, NOT PASSED**.
Canonical implementation is **NOT YET AUTHORIZED**. Whole ADAPT is now shape accepted;
permanent allocation is authorized and pending.
A–D are shape accepted as composed; F packaging revision 3 and whole ADAPT are shape accepted.
Campaign 2 permanent allocation is next. E remains unchanged; allocation must not redesign it.

## 1. Scope and substrate inspection

The [consolidation](ADAPT_001_CONSOLIDATION_DRAFT.md) owns logical families, sole physical ownership,
V04/V06 coexistence, output closure and exclusive phase-140 settlement. The
[fact source](ADAPT_001_FACT_INGRESS_DRAFT.md) owns admitted actual facts and InputOnly provenance.
The [bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md) remains a fixed, count-independent consequence
path. E consumes these shapes; applicability is not another admission or provenance system.

Inspection of `src/substrate/state.ts` found complete StatePath, DirectProjectionBinding,
ContractReadProjection and ActualReadRecord (type 147). Direct reads preserve absence and record
the exact path/value; derived bindings currently accept callbacks. `transition.ts` constructs
static bindings before execution. Accepted PRJ supplies a restricted identity-field projection,
not an arbitrary nested fact-to-composite-key or magnitude-expression language. E therefore needs
an explicit, ADAPT-local resolver to construct exact direct bindings after payload admission and
rule resolution. It does not broaden PRJ, replace its identity projection, or adopt anonymous
derived callbacks. AdaptationEvaluationReadProjection is **not** an
EventDependentProjectedFieldRequirement. It is a V06 ADAPT-local closed exact-binding mechanism
whose semantics are fixed by adaptation-input/0.31-candidate. It does not widen PRJ's generic
selector grammar for any other seam. Its two reserved accessors still participate in PRJ's
accepted cross-collection accessor uniqueness rule; no PRJ revision or new prerequisite is needed.
The private frozen state and transaction stage are already proposed by C.

No accepted adaptation rule executor or count-to-magnitude equation exists beneath E. The closed
interpreter below supplies that missing behavior. It has no new prerequisite decision; complete
canonical domain/leaf packaging remains F work and still prevents implementation readiness.

## 2. One committed rule definition

Each rule is one SemanticRegistryEntry: StableId is AdaptationRuleId, RegistryKindId is
`registry/adaptation-rule`, DefinitionVersion is `adaptation-input/0.31-candidate`, Definition is:

```
AdaptationRuleDefinition
    Match                  Exposure { ExposureReferentId }
                         | Practice { ProcedureId }
    TargetStateFamilyId    Campaign2StateFamilyId
    TargetLeafFamilyId     LeafFamilyId
    KeyDerivation          AdaptationKeyDerivation
    Gate                   Always
                         | FrozenBaseline { Source: AdaptationReadTarget }
    Step                   signed nonzero integer, in target magnitude lattice units per count

AdaptationReadTarget
    StateFamilyId          Campaign2StateFamilyId
    LeafFamilyId           LeafFamilyId
    KeyDerivation          AdaptationKeyDerivation

AdaptationKeyDerivation
    ExposureVariable       { RegulatoryVariableId }
  | RegulatoryVariable     { RegulatoryVariableId }
  | Load                   { LoadDomainId }
  | Procedure              (no payload)
```

The registry wrapper is the sole RuleId and rule-version home. This replaces §2.6's conceptual
embedded AdaptationRuleId/RuleVersion and unexpanded KeyDerivationRuleId/StateTransitionFunctionId
references. No key-derivation registry, function registry, rule occurrence ID or new parameter ID
is introduced. The governing DefinitionVersion fixes CountStepWithBaselineGate as the exact
equation below; Step is committed model data. Function is not a stored field. Changing a match,
target, gate, step, rule-set membership or governing version changes ModelIdentity. A later
function/resolver alternative requires a new version or a union with an actual distinction.
Unknown tags/versions, duplicate keys, unresolved references or unused variant fields fail model
construction with INVALID_CONFIGURATION. A finite model contains only finitely many rules.

There are exactly two V06 consumers: regulatory accepts RegulatoryExposureFact and procedural
accepts ProceduralPracticeFact. Each nested AdaptationTransitionRegistrationExtension contains:

```
    AcceptedBasis          RegulatoryExposureFact | ProceduralPracticeFact
    RuleResolutionContract {
        Rules: canonical set<AdaptationRuleId>
    }
    OutputProduction       complete AdaptationOutputProductionDefinition from C
```

The ADAPT executing version fixes ExactBasisReferentMatch as the sole resolver; no Resolution
field is stored. The rule-entry DefinitionVersion must equal its owning consumer's ADAPT
ExecutingSeamVersion. Unknown/mixed versions fail INVALID_CONFIGURATION. C's existing
OutputProduction shape is unchanged.

Here AcceptedBasis is a schema variant selector, not another stored fact. Each registered rule
must be referenced by exactly one of these consumers; no orphan or multiply assigned rule is
admitted. The set may be empty. Match must agree with that consumer's AcceptedBasis. The target
family must be materialized, writable by that consumer and on route/automatic-adaptation.
One consumer retains one authority; it cannot acquire the other through a rule reference.

TransitionRegistrationV06 has exactly ExecutingSeamId, ExecutingSeamVersion,
TransitionDefinitionV06, IngressDefinition, and AdaptationExtension (the complete record above).
TransitionDefinitionV06 has the accepted four fields, with C's StateWrites extension. ADAPT's
generic OutputDefinitions is exactly the dispatch-schema/ExactlyOnePerExecution singleton;
AdaptationExtension.OutputProduction adds the evaluation schema and rule-indexed multiplicity.
The two declarations' dispatch schemas must agree. Ingress uses D's exact AAI schema and
AuthoredAdaptationFactProducer branch, phase 140, SameAsProducer, ExactAdmittedSourceOutput and
ExactlyOncePerSourcePerConsumer. ExecutingSeamVersion is adaptation-input/0.31-candidate; the registry
wrapper remains transition-admission-extension/0.6-candidate. V04 and the shared V04 singleton stay
byte/schema/version unchanged. There is no external host-side rule table.

## 3. Applicability and declarative addressing

After D's source/schema/basis admission, a rule applies iff its Match variant agrees with Basis
and its declared ExposureReferentId or ProcedureId equals the corresponding Basis identity.
Match never constrains CharacterId in v0.1; the admitted Basis.CharacterId supplies the target
subject. Counts, time, prior state, gate state,
output identity and execution order cannot affect membership. Resolve the complete set and sort
by canonical AdaptationRuleId before any state read. Zero rules still yields one empty dispatch.
The initial paired fixture uses one matching rule; changing its count never removes that rule.

For targets and gate sources alike, use this exhaustive key construction table:

| Leaf | Required derivation | Admitted Basis | Constructed canonical key fields |
|---|---|---|---|
| tolerance or sensitization | ExposureVariable {V} | RegulatoryExposureFact | CharacterId = Basis.CharacterId; ExposureReferentId = Basis.ExposureReferentId; RegulatoryVariableId = V |
| regulatory displacement | RegulatoryVariable {V} | RegulatoryExposureFact | CharacterId = Basis.CharacterId; RegulatoryVariableId = V |
| accumulated load | Load {L} | RegulatoryExposureFact | CharacterId = Basis.CharacterId; LoadDomainId = L |
| procedural competence | Procedure | ProceduralPracticeFact | CharacterId = Basis.CharacterId; ProcedureId = Basis.ProcedureId |

Resolve StateFamilyId to materialized root, LeafFamilyId to its field/key schema, then construct
one record-valued mapKey selector using that schema. No arbitrary root, field, character constant,
selector expression, state-derived key, observer lookup or trace lookup is accepted. Regulatory
variables and load domains are committed rule choices, not fields supplied by the fact producer.
The same subject always supplies both target and gate keys. A gate may read a different leaf,
variable or load domain within the compatible basis grammar; cross-basis addressing is deferred.

Compile-time checks require the exact family/leaf/derivation combination, admitted identity roles
and resolvable domains. Runtime validates admitted Basis roles and the resulting keys via the
accepted canonical key/role machinery. CharacterId comes directly from qualified actual Basis;
there is no ObserverId and no new identity qualification policy. EVID's subject contract is unchanged.

**Construction-time guaranteed collision closure.** After resolving and validating all rules,
compare every unordered pair of distinct RuleIds assigned to one consumer. Match domains overlap
iff both Exposure matches name the same ExposureReferentId, or both Practice matches name the same
ProcedureId. Unlike variants do not overlap (and cannot share a well-formed consumer here).
On that overlap, target recipes are identical iff TargetStateFamilyId, TargetLeafFamilyId,
KeyDerivation variant and its complete committed V/L payload (if any) are canonically equal.
This finite, state-free check uses exact typed-identity equality, never ordinal meaning.
Overlapping matches plus identical recipes fail INVALID_CONFIGURATION, regardless of Gate or Step.
No count, gate value or no-op result can rescue a structurally dead rule combination. Different
recipes or disjoint match domains pass this particular check, subject to all other model checks.

This does not replace C's runtime ADAPTATION_TARGET_COLLISION. For example two rules matching
*different* exposures may each target RegulatoryVariable {V} for the same subject. Their model is
well-formed, but separate source inputs at one instant collide at runtime. Repeated same-instant
inputs for one matching rule also still collide. No state reads are needed for either check.

The target is determined even if count is zero or the gate will be false. C rejects duplicate
target StatePaths across the entire instant before any evaluator or gate read, including no-ops.
A gate read overlapping another evaluation's target is allowed and is not a write collision.

## 4. Exact declared frozen reads

Every resolved rule declares precisely one TargetPrior direct read and, only for FrozenBaseline,
one GatePrior direct read. Both paths come from §3. No arbitrary read list or executable expression
is admitted. Their family/leaf wildcard patterns must be within that consumer's ReadDomain.
For the initial two consumers, ReadDomain equals the canonical union of these required patterns
over all assigned rules, with no unused wider patterns. A pattern has the resolved root/field and
one mapKey wildcard; exact runtime paths remain restricted to §3's resolved bindings.

After all target collisions are checked, capture C's common pre-adaptation snapshot. For each
resolved RuleId R, in canonical RuleId order, the closed resolver constructs exactly one fresh,
immutable **AdaptationEvaluationReadProjection(R)**. This is an execution-local capability object,
not a canonical record, persistent container, new occurrence or nested scheduler transition.
Its only bindings are:

```
accessor/adaptation-target-prior → exact TargetPath(R, admitted input)
accessor/adaptation-gate-prior   → exact GatePath(R, admitted input), iff FrozenBaseline
```

The construction inputs are the already admitted input, committed R and private frozen snapshot;
executor code cannot supply a binding collection. The projection is never rebound, shared with
another rule evaluation, retained across executions or reused after evaluation. The resolver reads
TargetPrior then GatePrior if present, including for zero count or a false gate, validates the
values, invokes the arithmetic evaluator with only the scalar operands described below, stages
that rule's evaluation result and discards the projection before starting the next rule. Failure
aborts the instant under C; it never skips ahead to the next rule. No state is re-frozen per rule.

There is one committed requirement per fixed accessor within the consumer contract: "target prior
of the currently evaluated committed rule" and "gate prior of that rule, when FrozenBaseline".
Paths instantiate those requirements through §3; multiple rules do not create multiple declarations
with the same OutputAccessor. No static or other dynamic requirement may reuse either accessor
within that TransitionSeamContract. This preserves PRJ's requirement identity and uniqueness;
separate projection instances do not exempt declarations from its collision check. One projection
can never contain target-prior bindings for two rules simultaneously.

If target and gate paths coincide, read that path twice under the two distinct accessor requirements
and retain both records in target/gate order. Use existing TypedIdentifierValue in the shared
PRJ-owned ProjectionAccessorId family, with namespace-only role and no DomainValidator. Campaign 2 F
allocates its namespace and the two symbolic members above alongside IDN's ResolvedCharacterSubject;
no per-rule accessor identities. No accessor is derived from RuleId or EvaluationId. Contract-level
qualification follows PRJ's allocation clarification; generic ActualReadRecord is not narrowed.

Each successful direct read appends existing type-147 ActualReadRecord with exact source Path,
Presence and complete single-Magnitude value if present, DerivedSources empty and no
TransformationId. Missing reads are recorded, then interpreted as zero under ADAPT's own baseline
rule. A present explicit zero or wrong leaf schema is invalid state, not another spelling of absence.
Validate every present target/gate value against its own resolved leaf domain, including REG at
the current trusted T when the source is displacement; the gate cannot turn an invalid value into
a false predicate. No extra operand/provenance record is added. The existing transition trace has
no newly proposed nested evaluation container; freeze the following deterministic association:

```
R[0..N-1] = dispatch.ApplicableRules in canonical RuleId order
k(R) = 1 for Always, 2 for FrozenBaseline
start(i) = sum(k(R[j]) for j < i)
segment(i) = ActualReadRecords[start(i) .. start(i)+k(R[i]))
```

ActualReadRecords must have exactly sum(k(R)) entries. Segment i belongs to the evaluation output
whose RuleId is R[i] and whose DispatchId is that dispatch's ID. Its records must match the exact
compiled paths and fixed TargetPrior/GatePrior accessor order. All of one rule's reads and evaluation
finish before the next starts; neither interleaving reads nor post-hoc sorting to hide interleaving
is an implementation alternative. Outputs remain dispatch then evaluations in canonical RuleId
order under C; this association adds no output fields or identities. Zero rules means zero read
segments. Invalid grouping/order/count is a trace-conformance failure; no new diagnostic record
or scheduler code is introduced by this association. Failure rollback remains C's contract.
It exposes no read capability back to character cognition.

The evaluator receives only validated Basis count, Step, target prior magnitude and the optional
gate prior magnitude. It receives no state object, enumeration API, query callback, event/sequence
identity, AAIId, DispatchId, registry handle or trace handle. A runtime read path outside ReadDomain
fails ILLEGAL_READ; forged undeclared accessors retain UNKNOWN_ACCESSOR. Invalid stored value,
schema or magnitude domain is a state/value validity defect, not ILLEGAL_READ. Projection must not silently
drop a read or fetch a staged patch. Static declarations alone do not prove runtime confinement.

## 5. One thin StateTransitionFunction

CountStepWithBaselineGate is a fixture-scale candidate, not a physiological, skill-acquisition,
reward, recovery or learning law. Its optional zero test exists to inhabit the already-required
cross-leaf frozen-read control 7j. Always is the minimal positive/no-op paired fixture. A baseline
test transfers no magnitude between domains and implies no general causal relation between them.

```
n = Basis.ActualContactCount       for RegulatoryExposureFact
  = Basis.CompletedRepetitions     for ProceduralPracticeFact
p = TargetPrior.Magnitude if present, else 0
g = 1                             for Always
  = 1 if GatePrior magnitude = 0, else 0   for FrozenBaseline
q = p + g * n * Step
```

n is an exact unsigned integer. Step is a nonzero signed integer in the target's declared lattice,
so the model explicitly chooses the magnitude effect per stipulated count; the count itself is
not a dose, success score or reward. There are no divisions, rounding, implicit rescaling, floats,
random draws, elapsed-time factors, saturation, clamping or overflow-to-another-leaf behavior.
Compute in mathematical integers. Accepted implementation budgets may abort execution; they may
not wrap, saturate or change q. The magnitude's physical interpretation and scale come only from F.

Validate p and q against the exact target domain. Tolerance requires 0<=q<=its declared Scale;
sensitization and competence require q>=0; load requires q>=0 and q<=Capacity when declared.
Regulatory displacement is signed and calls accepted REG.validateAdaptedReference(C,V,T,q),
with C,V from the resolved key and T from the trusted current instant already tied to AAI.OccurredAt
by D. Time enters validation only, never membership, gate or this equation. C's retained-state REG
pass runs before handlers and its final pass still runs for NoStateChange and zero-rule instants.

REG failures preserve C's exact typed mapping. For an algebraic q outside a non-REG leaf domain,
propose flat SchedulerFailureCode ADAPTATION_MAGNITUDE_OUT_OF_RANGE, carried by unchanged
diagnostic type 162. Reject before creating a canonical unsigned value when q<0. This is an E
calculation failure, never NoStateChange. Proposed patches still undergo B's complete accepted
PRJ/WRT precedence and operation checks; this calculation does not replace that write boundary.

After successful domain validation, produce the existing C evaluation record and exactly:

| Relation | Result |
|---|---|
| q = p | NoStateChange, no patch |
| q != p and q = 0 | StateChange with one Remove, prior must be present |
| q != p and q != 0 | StateChange with one Set of the target's single-Magnitude record |

Set expected-old presence/value and Remove expectedOldValue equal the captured TargetPrior.
Prior remains the exact Absent/Present variant in the evaluation, not a synthetic zero record.
No other patch is generated. Dispatch/result fields and occurrence/output order remain C's exact
shapes. A negative Step can witness a return to baseline; this is an authored model control, not
automatic decay or general recovery. An invalid retained state cannot be repaired by such a rule.

## 6. Frozen adversarial vectors — AD-E1..13, NOT PASSED

All numbers below are local arithmetic fixture values, not record/namespace/member allocation.
Fixtures use admitted domains large enough for the stated positive values unless testing bounds.

| ID | Required positive witness and mutant |
|---|---|
| AD-E1 | One matching rule, Always, absent target, Step=2: n=3 gives q=6/Set; n=0 gives NoStateChange. Same model, target, resolved RuleIds, read/output topology and allocator positions; only the committed input count and resulting RunIdentity differ. Filtering zero-count rules fails. |
| AD-E2 | Wrong referent matches no rules and emits an empty dispatch. A matching rule behind a false gate still emits its evaluation. No-op-for-zero-rules and state-dependent applicability mutants fail. |
| AD-E3 | Changing Step, key V/L, gate source, rule membership or Match changes ModelIdentity. Host callback/name-table substitution, unknown tags and orphan rules fail configuration. |
| AD-E4 | Construct all five exact keys. Change only subject, exposure, response variable, procedure or load domain in a proposed write: B's exact target check catches the applicable wrong-key case after its accepted prefix. Input cannot choose a family, step or target variable. |
| AD-E5 | Control 7j: one exposure matches A writing tolerance(C,X,V), Step=1, Always; B writing load(C,L), Step=2, gated on that tolerance. Both targets absent, n=1. Frozen result A=1, B=2; a live/staged gate produces B=0 and fails. Permuting their canonical evaluation order using separately committed rule identities preserves final values. |
| AD-E6 | Two same-instant inputs targeting one exact path fail ADAPTATION_TARGET_COLLISION before target/gate reads, including n=0 and false-gate variants. Noncolliding input EventSequence permutation preserves settled state; trace/occurrence ordering remains governed by C. |
| AD-E7 | Each rule gets one fresh immutable read projection; declaration-level OutputAccessor uniqueness still applies. Reject rebinding, cross-evaluation sharing, executor-supplied bindings, interleaving and post-hoc reordering. Check exact per-rule trace segments, target then optional gate, including absent/zero-count/false-gate cases. Same-path target/gate yields two reads under distinct accessors. Duplicate static/dynamic accessor declarations, undeclared/cross-character reads, enumeration, skipped reads and missing instrumentation fail their owning projection/trace checks. |
| AD-E8 | p=6,n=3,Step=-2 yields one Remove; absent,n=0 yields NoStateChange. After save/load the removed state equals never-present state. Explicit-zero Set, absent Remove and equal-value StateChange fail. |
| AD-E9 | Unsigned q=-1 and tolerance q=Scale+1 fail ADAPTATION_MAGNITUDE_OUT_OF_RANGE; exact endpoints succeed with baseline normalization. Bounded load overflow fails; unbounded load/competence/sensitization has no invented ceiling. No clamp or second-leaf patch is permitted. |
| AD-E10 | REG candidate in bounds succeeds; exact out-of-range and unknown-variable mappings remain C's. Retained time-only invalidity aborts before an E repair rule runs. REG reference never becomes a stored operand or learned baseline. |
| AD-E11 | Zero/nonzero count paired common-root bridge yields byte-identical immediate accepted SEM/EVID outputs while adaptation differs. OutcomeLearningEvidence to either ADAPT consumer, or AAI to either EVID transition, fails INPUT_NOT_ADMITTED. Identity ordinal, trace ancestry or perceived-success operands fail capability confinement. |
| AD-E12 | Fail after reads, after an out-of-range later evaluation, after staged outputs and after patch union: whole-instant state, queue, allocators, trace and outputs roll back. Match C's work/cascade/terminal failure behavior; no partial evaluations or silent omission may commit. |
| AD-E13 | Same-consumer rules with overlapping Match domains and identical target recipes fail INVALID_CONFIGURATION at model construction, including different Gate/Step variants. Exercise both Exposure and Practice matches and every compatible key variant. Deferring rejection to runtime fails. Disjoint matches or distinct target recipes pass this check; different exposures targeting one displacement remain legal until two same-instant source inputs trigger ADAPTATION_TARGET_COLLISION. |

AD-E5's alternate rule-identity order is a separate model control, not the paired PHEN-ADAPT
intervention (which keeps ModelIdentity fixed). AD-E6 supplies the same-model EventSequence control.
Keep AC-A..L, AD-D1..15, main controls 1..12 and lettered subcontrols, REG-A..R and EVID-A..T.
These are the frozen implementation gate; document review is not execution evidence.

## 7. Preservation and deliberate deferral

REFERENCE_MECHANISM_LEDGER: SUB-001/002 exact arithmetic and explicit quantization discipline remain
PORT; this integer-only transform requires no new rounding. SUB-003 typed identity/order, SUB-008
trace/persistence and SUB-009 paired experiments remain PORT. MEC-003 remains CONTRACT only where
an actual bounded effect exists; rejecting an out-of-domain additive candidate invents no such
effect or hidden overflow record. MEC-019 actual/attempt/intent separation remains CONTRACT/CORPUS.
P3-009/P3-010 constitution/history and EXP-002/008 epistemic regressions remain CORPUS obligations.
CTL-001/008 remain controls, not adopted physiology; RET-006/014 truth leaks remain prohibited.
No historical code is copied or made canonical.

F must package exact ExposureReferent qualification, ProcedureDefinition, LoadDomainDefinition,
tolerance/sensitization scales, five key/value schemas, leaf-to-domain resolution, and all canonical
records/tags/roles for these rules and V06 registrations. REG's variable domain remains its sole
accepted home. No permanent record numbers, field numbers, namespaces or member values are assigned.

Deliberately deferred: general adaptation/skill kinetics, dose semantics, evidence-driven learning,
nonlinear response, decay, elapsed-time integration, cross-domain magnitude conversion, general
predicate/query languages, arbitrary subject selection, cross-basis read keys, same-target
aggregation, ordinary phase-140 coexistence, delayed inputs, endogenous actual-fact derivation,
all cognitive materialization/writes, ORD-001/005 and later matched-challenge execution semantics.
The current bridge proves immediate separation; it is not itself the later challenge mechanism.
No accepted prerequisite is reopened, and VAL-001 remains a nonblocking P1 follow-up.


Revision 2 (ADAPT revision 31 / pass 8): records the revision-1 review and fixes immutable per-rule
projection lifetime and exact read segments; adds construction-time overlap closure and AD-E13;
removes stored Function/Resolution discriminators. The governing version supplies both behaviors.
AD-E1..13 are frozen NOT PASSED. E remains a shape-acceptance candidate for review; no F allocation.


Acceptance record (2026-09-06): E revision 2 is internally shape accepted at
adaptation-input/0.31-candidate. The acceptance wording explicitly distinguishes its ADAPT-local
projection from generic PRJ and clarifies ILLEGAL_READ as a path-permission failure. No accepted
rule, equation, output shape, collision policy or proof obligation changes. Earlier review-status
entries above are historical. E is frozen for final composition; overall ADAPT remains draft.


Acceptance-bookkeeping clarification (2026-09-06): E semantic component remains
adaptation-input/0.31-candidate. The V06 wrapper grammar is
transition-admission-extension/0.6-candidate; promotion from its historical draft spelling changes
no fields or interpreter behavior. F's independent static authoritative-state invariant enforces
all stored leaves, including those E does not read; E's equation and candidate-q failure remain unchanged.


## Current whole-contract disposition — 2026-09-06

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

Earlier dated restrictions and open-status notes are history; this verdict governs the current gates.


Whole-contract allocation clarification (2026-09-06): both transition/regulatory-adaptation and
transition/procedural-adaptation have ExecutingSeamId = SeamId/1036 with exact canonical NFC text
payload seam/automatic-adaptation. ExecutingSeamVersion remains adaptation-input/0.31-candidate.
This freezes the previously unspecified member of an already accepted field; no equation, record
shape, D source, F domain or PRJ semantics changes. Separate regulatory/procedural seam IDs are not
introduced. See the campaign2-allocation/0.2 review candidate; numeric acceptance is still pending.
