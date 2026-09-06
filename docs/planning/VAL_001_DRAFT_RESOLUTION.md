# VAL-001 — committable governed executables, revision 2

**Status: SHAPE ACCEPTED 2026-09-06; NOT IMPLEMENTED OR QUALIFIED.**
Accepted contract: `governed-execution/0.1-candidate`.
Accepted CONTENT specialization: `content-kind/0.1-candidate`.
Accepted domain-validator specialization: `governed-domain-validator/0.1-candidate`.
VAL-001 remains P1 and OPEN. Campaign-2 allocation `campaign2-allocation/0.2-candidate`
is accepted and frozen; this draft changes none of its numbers or accepted seam semantics.

Revision-1 review accepted the closed-declaration policy, the two implementation situations,
the exclusion of source/build hashing and the construction/restore principle. Minimal CONTENT
character-kind validation was accepted in direction. Overall shape acceptance was withheld:
the character DomainValidator lacked a committed executable binding, and CONTENT's supported
domain needed exact closure. The revision-2 review accepts the completed shape with the §3
model-semantics/build-support wording correction now applied. VAL-A..W remain frozen NOT PASSED;
the positive extension branch of VAL-T remains conditional. No semantic blocker is identified.
Additive allocation is PERMANENT AND FROZEN at `val-allocation/0.1-candidate` after the
review's mechanical gate passed. Canonical activation is NOT YET AUTHORIZED. Formal
VAL closure follows implementation and build/release qualification.

## 1. Authority, scope and preservation

This is a substrate admissibility boundary beneath [deterministic identity](../formal/DETERMINISTIC_SUBSTRATE.md),
[CONTENT](../formal/CONTENT_GOVERNANCE.md), [state](../formal/STATE_MODEL.md) and their accepted
seam specializations. It adds no psychological box, causal edge, state family, mutation authority,
read channel or provenance graph to the canonical Architecture Map. It governs how implementations
of existing boxes are selected and qualified for authoritative use.

Consume IDN `identity-binding/0.5-candidate`, PRJ `projection/0.3-candidate-addendum`,
EVID `character-learning-evidence/0.5-candidate`, REG `regulatory-reference/0.5-candidate`,
ADAPT `adaptation-input/0.31-candidate`, admission extension `transition-admission-extension/0.6-candidate`
and settlement `adaptation-settlement/0.2-candidate` unchanged. SEM's accepted Campaign-1 closure
and prior WRT proof remain historical evidence, not evidence that this new gate has passed.

[Reference preservation ledger](REFERENCE_MECHANISM_LEDGER.md) dispositions for this work:
SUB-003 CONTRACT: canonical typed identities and ordering; SUB-008 CONTRACT + CORPUS: structural
comparison, replay and atomic failure; SUB-009 CORPUS: paired intervention changes only the
governed declaration; SUB-010 CONTROL: retain old executable fixtures under their historical
identities; SUB-011 CONTRACT: record the callback defect forward without rewriting findings.
No historical cognitive mechanism is ported or retired. No reference source is modified.

## 2. Actual substrate inspection

| Surface | Existing representation and limitation | VAL disposition |
|---|---|---|
| Manifest commitment | `src/substrate/identity.ts`, `commitManifest` deep-copies canonical data, encodes it, hashes bytes; `createModelIdentity` consumes three commitments plus version fields. No executable binding is inspected. | Reuse types 100..103 and complete manifests. A model identity alone does not certify a host function. |
| Registry | `src/substrate/contentManifest.ts`, `compileRegistryManifest`: type 171 commits StableId, RegistryKind, DefinitionVersion, Definition; types 172/173 commit schemas. It verifies canonical encoding, uniqueness and nonempty version, not kind-specific executable meaning. | Reuse this carrier; add a closed admitting interpretation rather than assuming any canonical Definition is executable. |
| Content-kind validation | `ContentSemanticValidator` has only semanticKindId and `validate(GovernedContentInput)`. `compileGovernedContentManifest` checks registration then invokes that supplied callback; only definitions are returned in the content commitment. | Confirmed gap: different predicates can accept different content under the same committed declarations. |
| Uncommitted callback inputs | That callback receives `presentationLabel`; canonical type 170 includes fields 1..16 and omits presentation field 100. It can also close over mutable external data. | Validation must receive only canonical authoritative data and its declared committed context. |
| Leaf validation | `src/substrate/state.ts` permits a validateValue callback. `src/substrate/mutationAuthority.ts` derives one from closed LeafValueGrammar, and returns its canonical registry definition. | Preserve this accepted pattern. Anonymous direct construction is not the authoritative Campaign-2 entry point. Returning a definition beside a runtime object does not itself prove their binding. |
| Projection | Legacy `DerivedProjectionBinding.derive` in state.ts is supplied code; accepted PRJ instead requires interpretation of its committed field-extraction declaration. | Preserve PRJ's exact interpreter and read/role failure ordering. No new projection language. |
| Transition and scheduling | `src/substrate/transition.ts` accepts a semantic handler; scheduler.ts copies a supplied EventTypeId → handler map. Persistent adapters also accept projection functions. | Host interfaces remain implementation plumbing; affected authoritative construction must derive their selection from admitted contracts and committed declarations. A handler map is not a manifest. |
| REG and ADAPT | REG's closed construction interpreter and ADAPT E's closed rule/key/gate interpreter already specify operands, resolution and mutations. | Require conformance to those definitions, not a second VAL rule engine. |
| Character qualification | IDN §2.1 fixes authored-content origin plus exact kind equality; character-kind validation itself is explicitly separate and not implemented. | Preserve qualification; do not introduce a body, roster, belief or psychology predicate into content validation. |
| DomainValidator binding | Campaign-2 type 263 commits optional DomainValidatorId; PRJ compares role identities, while IDN specifies the character predicate. The frozen table has no executable definition for that validator identity. | Revision 1 omitted this second binding. Add the closed definition in §4.2, using the existing validator ID. |
| Existing tests | `src/test/contentGovernance.test.ts` supplies fixture callbacks for world-effect lists under fixture namespaces. Accepted tests prove the bounded CONTENT behavior, not universal callback commitment. | Retain as historical controls; neither callback nor fixture identity becomes permanent character semantics. |

These are source inspections, not executed exploit or conformance results. There is no inspected
general executable artifact manifest, function serializer, closed content-kind definition or
authoritative executable-binding verifier. A string ID or code hash by itself would not close this gap.

## 3. Resolution — declarations determine semantics

An authoritative executable is admissible only as an implementation of an exact, accepted,
closed contract version interpreting committed canonical declarations. All model-semantic choices
within an admitted contract that can change authoritative admissibility, domain qualification,
projection, applicability, outputs, ordering, state changes or contract-defined failure behavior
must derive only from committed declarations or admitted canonical run inputs.
No independently supplied predicate, resolver, plugin, function
table or environment value may make such a choice.

Implementation support/release capability may determine whether a build can activate an
already-defined model. Lack of support may reject activation; it does not redefine model semantics
and is not a model-semantic operand to insert into ModelIdentity.

For admitted contract V, complete model declarations D and explicit invocation inputs X, the
contract defines one partial function F(V,D,X), including its specified rejection result. A
conforming implementation must realize F. The meaning of V is immutable. An intended change
to F requires a new accepted contract version committed through its owning declaration or
identity field; a configurable operand change changes its existing content/parameter/registry
commitment. The existing RulesVersion remains part of ModelIdentity; a friendly label or a
manually bumped RulesVersion alone is not a substitute for a complete declaration and contract.

Thus same model declarations and ModelIdentity imply the same model semantics, not identical
outputs for different run inputs. With X fixed, conforming executions must have identical
canonical results, reads, writes, emissions and contract-defined failures. An implementation
changed under fixed V/D that disagrees is a defect and is rejected by qualification; it is not
automatically a new valid model. No finite test suite proves equivalence of arbitrary programs.
VAL does not claim to make malicious or buggy host code mathematically incapable of lying.

Normatively: changed **authoritative** executable semantics require changed committed declarations
or an accepted contract version, and therefore changed ModelIdentity. Changed host behavior under
fixed declarations/version is an implementation defect with no authority to redefine the model.

### 3.1 Two admitted implementation situations

1. A fixed substrate algorithm specified by an accepted identity-bearing contract (canonical
   encoding, ordering, hashing, numeric operations) implements that exact immutable version.
2. A closed declaration interpreter derives all model-specific behavior from canonical data
   under the exact contract that admits those data (leaf grammar, PRJ extraction, REG, ADAPT,
   or the accepted content-kind specialization below).

These are qualification cases, not a tagged runtime union. There is no arbitrary-code third
case and no new ExecutableId, source digest registry, interpreter registry or capability record.
Two conforming implementations may share model identity. Source layout, comments and equivalent
optimizations do not change model semantics. Source hashing would both over-distinguish these
and fail to define host imports, captured environment, runtime behavior or permitted reads.

### 3.2 Authoritative construction and restore boundary

The future Campaign-2 builder must consume the complete canonical manifests from which it
creates the ModelIdentity. It validates exact admitting contract versions, schema versions,
uniqueness and reference closure, then derives runtime validators, projections and handlers
from those same immutable decoded declarations. It must not accept an independently supplied
runtime object plus an allegedly matching digest or declaration. Copy/isolate declarations
before compilation; later caller mutation cannot change compiled behavior.

The contract-specific input capability contains only authorized canonical inputs: content
validation cannot receive presentation/state/clock/randomness; PRJ cannot gain a second source;
REG and ADAPT keep their existing allowed inputs and instrumented reads. A helper closure is
permitted as an internal compilation product only if its behavior and captured operands are
fully determined by that interpreter and those inputs. Callable identity is not evidence of this.

Restore checks the saved structural model identity against available complete manifests and
the supported contract set, then rebuilds from those declarations. It does not deserialize
closures or trust a current process's matching-name handler map. Unsupported or mismatched
models fail before activation; no fallback to a nearby version or legacy callback path.
All subsequent validation and transaction failure ordering remains owned by the existing seams.

### 3.3 Model admission and build/release qualification are separate

Model admission is an executable property of the canonical builder: complete manifests, supported
exact versions, resolved references, copied/isolated declarations, no caller-supplied semantic
callback or handler map, internally compiled runtime objects, and declaration-based restore.
It can reject a supplied predicate-bearing object. It cannot establish its own correctness merely
by computing ModelIdentity.

Build/release qualification establishes that an implementation realizes F(V,D,X), using conformance
vectors, mutation tests, independent implementation comparison and reviewed qualification evidence.
A modified binary that violates F under fixed V/D is unqualified software, not another valid model.
There is no claim that an in-process admission check detects arbitrary changes to its own code.
Vectors that inject public callback arguments exercise model admission; vectors that modify the
internal interpreter exercise build/release qualification. Neither adds a binary hash to ModelIdentity.

## 4. Accepted minimal CONTENT specialization

This section is the shape-accepted CONTENT additive specialization, not an amendment to IDN's accepted
predicate. It admits only the currently required permanent kind, `SemanticKindId/1004` with
exact payload `semantic-kind/character`. It does not validate that something is psychologically
a person, has a body, or has any particular state entries.

Accepted symbolic record, all fields required (numeric allocation is separate):

```text
GovernedContentKindDefinition {
    ContentSchema: CanonicalRecordSchemaRef
}
```

One type-171 entry uses:

```text
StableId          = SemanticKindId/1004("semantic-kind/character")
RegistryKind      = RegistryKindId("registry/semantic-kind")
DefinitionVersion = content-kind/0.1-candidate  [exact accepted version]
Definition        = GovernedContentKindDefinition { ContentSchema = (170, 1) }
```

The RegistryKind member above is a shape-accepted new member awaiting allocation in the permanent family, not promotion of the
same-spelled fixture value in namespace 23003. No additional instance ID or validator ID is
needed for kind admission. StableId is the kind's existing identity; no duplicate kind field.
The exact specialization version and entry commit the validation meaning via RegistryIdentity.

Closed algorithm, with finite loops over canonical collections:

1. Admit the exact entry identity/kind/version and definition schema; reject duplicate entries,
   unknown fields, unsupported versions and any ContentSchema other than 170/1 in this version.
2. Canonicalize authoritative candidate definitions using type 170/1's exact field inventory;
   validate the existing structural schema and canonical value grammar. Presentation is kept
   outside this invocation. Unknown executable options or callback arguments are rejected.
3. In canonical StableId order, reject duplicate content identities; require each kind to resolve
   to exactly one admitted definition under §4.1's exact supported domain. All registry references
   must resolve against the actual committed registry, not a
   caller-supplied list of IDs detached from that registry.
4. Retain CONTENT's declared-reference uniqueness, content-reference existence and cycle checks.
   Preserve type 170's required authoritative fields. For this minimal character-kind version,
   no additional per-kind field predicate is introduced. ValidationInvariants and FormalSeamMappings
   are committed data, not executable prose; downstream mappings need their own admitting seams.
   Generic canonical validity never licenses an authored psychological field in a receiving seam.
5. Only after those checks build the content commitment from the same canonical definitions;
   bind it with the registry commitment into ModelIdentity. No invocation can alter content,
   registry, state, trace, scheduling or occurrence allocation as a side effect.

The absence of an extra character predicate is explicitly shape accepted. Neither
IDN nor inspected CONTENT freezes a richer character-content schema. Inventing requirements
for bodies, life status, observer rosters or psychological properties would exceed VAL's scope.
If such a predicate is required, it needs a separate closed content schema and reviewed version;
it cannot be filled in by an anonymous callback during implementation.

### 4.1 Exact supported CONTENT domain

Let UsedSemanticKinds(C) be the set of exact typed SemanticKind values in the complete authoritative
type-170 content set C. For every K in UsedSemanticKinds(C), exactly one admitted
GovernedContentKindDefinition entry with StableId K must exist. Duplicate entry IDs reject before
set comparison; neither repeated uses nor repeated role references create new definitions.

At `content-kind/0.1-candidate`, the only admitted permanent kind-definition entry is the character
entry above, and its ContentSchema must be exactly 170/1. Any authoritative content definition
using another kind fails ContentValidationError. There is no legacy ContentSemanticValidator
fallback, fixture-kind admission or wildcard kind. An empty content set does not itself require
a used kind; a kind referenced by a domain-validator declaration must still have its admitted
definition present. Unused supported kind vocabulary is permitted; the no-orphan restriction
in §4.3 is specifically for domain-validator entries, not all registry entries.

Inspection of accepted ADAPT D/F finds authored fact payloads and governed registry definitions,
not a requirement to author a second type-170 semantic kind. Exposure accepts all valid governed
referent origins without a character validator; that does not require this profile to author an
additional kind. No existing fixture-only world-action kind is promoted. This is a bounded contract
inspection, not a completed executable-fixture audit. If construction needs another authored kind,
that specialization must be accepted before its activation; it cannot be supplied as a callback.

### 4.2 Committed CharacterId role-validator binding

Accepted symbolic record, its sole field required (numeric allocation is separate):

```text
SemanticKindRoleValidatorDefinition {
    RequiredSemanticKind: SemanticKindId
}
```

One type-171 entry binds the already accepted validator identity to its executable meaning:

```text
StableId          = DomainValidatorId/1021("validator/character-qualification")
RegistryKind      = RegistryKindId/1023("registry/domain-validator")
DefinitionVersion = governed-domain-validator/0.1-candidate
Definition        = SemanticKindRoleValidatorDefinition {
    RequiredSemanticKind = SemanticKindId/1004("semantic-kind/character")
}
```

No new validator identity, predicate DSL or callback is added. RequiredNamespace remains solely
in CanonicalIdentityRole; it is not duplicated in this definition. This initial Campaign-2 profile
admits the one validator entry above. Binding that stable character-qualification ID to another
kind is invalid configuration, not a permissible change to IDN's accepted predicate. The operand
must resolve to the admitted kind-definition entry, committing that dependency independently of
whether any role invocation happens in a particular run.

Allocation clarification: RequiredSemanticKind is physically TypedIdentifierValue; its exact
namespace/member validity belongs to this construction interpreter. No additive
CanonicalRoleConstraint is introduced for the definition field. Malformed declarations remain
INVALID_CONFIGURATION; runtime CharacterId qualification remains CANONICAL_ROLE_VIOLATION.
ContentSchema is an external schema dependency and needs no new identity role.

The definition type fixes the following interpreter. Its only inputs are the already namespace-
validated referent, this immutable definition and the committed canonical content set:

1. The caller has applied CanonicalIdentityRole namespace validation. For this profile construction
   requires a use of this validator to have RequiredNamespace 1002. PRJ's exact role-compatibility
   rule and structural/key/role failure precedence are unchanged.
2. Require the referent's accepted origin representation to be AuthoredContent. Do not infer origin
   from payload text, namespace alone, roster membership or successful recognition.
3. Resolve that authored origin against the committed GovernedContentDefinition set using the
   existing semantic-referent/content identity relation. No second identity, origin field or resolver
   object is allocated by VAL.
4. Require exactly one matching definition. Duplicate content identities already reject model
   construction; the invocation guard still admits neither missing nor ambiguous resolution.
5. Require canonical typed equality of its SemanticKind and RequiredSemanticKind.
6. Otherwise fail the existing CANONICAL_ROLE_VIOLATION boundary; success adds no persistent state,
   observation, occurrence or evidence output.

Forbidden inputs are ObserverId bindings/roster, recognition, CandidateDomain, body state,
character-state presence, current activity, clock, randomness, presentation and trace. These
are not captured dependencies. Internally derived helpers cannot expand this capability.

CONTENT kind admission asks whether a content definition is legal; this domain validator asks
whether a referent can occupy the CharacterId role. The kind interpreter validates content before
activation. The role interpreter reads the resulting committed content and its own declaration;
it does not invoke the kind validator as an opaque callback. Neither invokes the other to decide
its own meaning. Later state-addressing consumers use the accepted PRJ/IDN projection. EVID itself
has no state/subject projection and unbound observers succeed, as its accepted contract requires.

### 4.3 Mechanical domain-validator coverage

For the initial admitting Campaign-2 model M, collect ReferencedDomainValidators(M) from every
present DomainValidatorId in its admitted CanonicalIdentityRole declarations. Traverse schema-
declared role positions in CanonicalRoleConstraint.Role, EventDependentProjectedFieldRequirement.
OutputRole and OccurrenceIdentityRule.IdentityRole, including these records in all admitted
collections/registrations. Traverse every declared branch in the model, not only roles exercised
by one run. Do not scan arbitrary text, run payloads or unrelated legacy generic trace records.
Absent optional validators add no member and perform namespace-only qualification as before.

DeclaredDomainValidators(M) is the set of StableIds of admitted registry/domain-validator entries.
Before activation require:

```text
ReferencedDomainValidators(M) = DeclaredDomainValidators(M)
```

Every referenced ID must have exactly one entry with the supported stable ID, RegistryKind,
definition schema/version and exact operand above. Reject duplicates before forming sets; reject
missing definitions, orphan definitions, wrong namespaces, wrong kinds, unsupported schemas/versions,
unknown fields and unresolved kind dependencies. Repeated role uses share the same entry. The
complete initial Campaign-2 profile uses the character role and therefore contains exactly its
one domain-validator definition. A profile with no such references cannot retain that orphan entry.

The frozen construction order is: (1) structural registry/schema admission; (2) CONTENT kind-definition
closure; (3) authoritative CONTENT validation; (4) DomainValidator declaration/reference closure;
(5) initial role-bearing state/run validation; (6) compilation of authoritative runtime objects;
(7) activation. Each stage uses the same immutable declarations and validated content.
Registry closure never requires a roster lookup to validate its own character predicate.
Restore repeats the same closure before continuation. Adding a new admitting role position in a
future schema requires extending this traversal explicitly, not relying on an unreviewed callback.

## 5. Accepted allocation and remaining implementation gates

The initial substrate inspection found no canonical home for the two definition schemas and
registry-kind members. The accepted [VAL allocation](../formal/VAL_PERMANENT_ALLOCATION.md),
`val-allocation/0.1-candidate`, now supplies records 329/330 and both members after the conditional
review's machine gate passed. It reuses type 171 and does not reopen, shift or reassign the frozen
Campaign-2 table. The inventory below records the separate accepted additive surface.

| Additive allocation inventory | Required symbolic fields / payload | Reused identity |
|---|---|---|
| GovernedContentKindDefinition schema | ContentSchema: CanonicalRecordSchemaRef, required | Kind StableId uses SemanticKindId/1004 |
| SemanticKindRoleValidatorDefinition schema | RequiredSemanticKind: SemanticKindId, required | Validator StableId uses DomainValidatorId/1021 |
| RegistryKindId member | registry/semantic-kind | Existing namespace 1023 |
| RegistryKindId member | registry/domain-validator | Existing namespace 1023 |

Both entries use existing type 171; schema references use existing type 254. No new namespace,
ExecutableId, ValidatorImplementationId, PredicateId or implementation-selection field is needed.

The current generic compiler and handler APIs do not enforce the construction binding above.
Implementation acceptance needs a concrete entry point and proof that its activation and restore
paths cannot bypass compilation. The whole affected path must be inventoried through dependencies,
including state validators, persistence projections and scheduling handlers; auditing only the
character callback would be insufficient. Legacy APIs may remain for historical tests, but a
Campaign-2 authoritative factory cannot fall back to them with caller-selected executable semantics.

The previous semantic binding omission is resolved at shape level by §4.2;
§4.1/§4.3 freeze the supported domain and reference closure. Allocation is accepted;
construction and build/release qualification remain unpassed gates. Existing PRJ/IDN/EVID/REG/ADAPT
semantics need no redesign; implementation wiring remains to be proven.

## 6. Failure behavior

During governed CONTENT construction, invalid/missing/duplicate kind declarations, unsupported
schema/version, unresolved references and rejected content use existing ContentValidationError
and return no authoritative compiled model. Domain-validator registry closure failures in §4.3
use the Campaign-2 construction boundary INVALID_CONFIGURATION, before role invocation;
a well-formed admitted role whose referent fails §4.2 uses CANONICAL_ROLE_VIOLATION at the
existing PRJ/IDN boundary. A declaration error is not mislabeled a runtime subject failure.
Diagnostics are non-authoritative; do not commit
host exception text. No new numeric error enum is allocated. Future non-CONTENT activation
adapters must use their existing construction failure carriers, with no scheduled invocation
or committed partial model on rejection. A contract's runtime domain errors retain its exact
existing carrier and precedence (including PRJ, WRT, REG and ADAPT).

Host-code disagreement under fixed declarations is failed implementation qualification, not
content rejection disguised as a new domain rule. Runtime failures retain whole-instant rollback;
VAL does not allocate error occurrences or change the trace schema.

## 7. Frozen adversarial proof vectors — ALL NOT PASSED

Compare complete canonical structures and committed artifacts; use hashes as diagnostics only.
For activation rejection, assert no returned authoritative model and no state/trace/queue/allocator
change. For fixed-input successful pairs compare validation verdicts, reads, outputs, state and
failure carrier where applicable, not only ModelDigest.

| Vector | Frozen challenge and required observation |
|---|---|
| VAL-A | Supply two opposite content callbacks under identical declarations. Authoritative builder rejects the callback-bearing interface; legacy negative control demonstrates why naming a callback is insufficient. |
| VAL-B | Swap a callback or runtime handler after computing manifests, including a same-ID replacement. No affected authoritative construction/restore path accepts it. |
| VAL-C | Change one admitted declaration operand with a witnessed behavioral effect in an existing closed family (e.g. leaf grammar). Registry structure and ModelIdentity change; content-only changes affect ContentIdentity. |
| VAL-D | Change supported contract semantics under an unchanged version. Targeted mutant is distinguished and qualification fails; changing a label alone cannot bless the mutant. |
| VAL-E | Shuffle registry/content input enumeration. Successful canonical manifests and compiled results are identical; duplicate StableIds still reject. |
| VAL-F | Change only presentationLabel, including text a malicious callback would inspect. Admission and all authoritative identities/results remain unchanged. |
| VAL-G | Alter captured mutable data, environment, wall clock, global counter or RNG. No such input reaches kind validation; attempted extension is rejected rather than committed as equivalent. |
| VAL-H | Mutate original declaration objects after compilation. Compiled semantics and stored canonical declarations remain unchanged. |
| VAL-I | Omit complete manifests or substitute a matching-name/digest-only runtime object. Construction/restore rejects before activation. |
| VAL-J | Wrong namespace with exact character text, duplicate kind entry, wrong RegistryKind, unknown definition/schema/version or extra field: deterministic construction rejection. |
| VAL-K | Character definition has every generic required field and no body/roster/belief facts. Kind admission succeeds; qualification uses authored origin and exact kind only. Remove a required type-170 field: reject. |
| VAL-L | Runtime-origin, unresolved authored referent or wrong kind fails IDN role qualification by its accepted carrier; same character referent qualifies independently of observer recognition/state. |
| VAL-M | Registry-reference ID exists only in a detached caller list, or content reference is missing/cyclic. Reject; committed ValidationInvariants text cannot override the result. |
| VAL-N | Compile accepted PRJ from the same declaration but mutate extraction/source/role logic. Existing PRJ mutants detect disagreement; VAL does not introduce a bypass accessor. |
| VAL-O | Substitute anonymous state validation, REG reference, ADAPT applicability/gate or persistence projection along the affected construction path. Reject supplied semantics; contract-specific mutants must be detected by inherited vectors. |
| VAL-P | Save/restore in a fresh process reconstructs the same supported declarations and yields exact continuation. Wrong or unsupported model version fails; saved labels do not select arbitrary local handlers. |
| VAL-Q | Two independently structured conforming implementations of the finite content specialization agree across valid, malformed and boundary inputs; source-file difference alone does not create another model. |
| VAL-R | Failure after valid registry inspection but invalid content leaves no authoritative activation; later injected scheduled failure retains existing whole-instant rollback. |
| VAL-S | Fixed role bytes, validator ID and governed definition; attempt to supply an alternative character predicate, including a same-ID object. The authoritative builder rejects the predicate-bearing input. Separately mutating its internal interpreter is a build/release qualification failure, not a claim that admission detects modified software. |
| VAL-T | Mutate RequiredSemanticKind in the committed definition: registry structure/commitment changes. In this character-only profile a different kind must reject before authoritative ModelIdentity construction. Conditional extension control: once another kind and corresponding validator binding are accepted, two admitted operand choices must produce different ModelIdentities. Changing only host code under fixed declarations changes no identity and can only produce a nonconforming implementation. Do not claim the conditional positive control passed using an unsupported kind or by rebinding IDN's character validator. |
| VAL-U | Mutants add roster, CandidateDomain, recognition, body/state presence, activity, clock, RNG, presentation or trace dependence to qualification. The declaration/capability cannot express those inputs; independent fixed-input controls and targeted build/release mutation checks distinguish each altered predicate. |
| VAL-V | Missing referenced definition, duplicate entry, orphan definition, wrong RegistryKind/schema/version/namespace, unknown field or unresolved kind operand rejects configuration. Exercise all three role-containing schema positions, repeated shared references and absent optional validator. Restore performs the same closure; unexercised declared roles cannot escape it. |
| VAL-W | Content uses an unsupported kind, with no governed kind definition or only a legacy callback/fixture registration. Deterministic ContentValidationError; no fallback. Empty content and valid generic type-170 character content obey §4.1; keep definition ContentSchema exactly 170/1. |

VAL-A..R are retained unchanged. VAL-S..W are added, all NOT PASSED. VAL-T's currently applicable
negative/commitment cases are mandatory; its positive second-kind control is explicitly conditional
on a future accepted extension and is not counted as current-profile proof or a blocker requiring
preemptive kind generalization. Qualification reports must separate these dispositions.

Implementation proof must name the exact admitting factory, its supported contract set, the
tested negative controls and each mutant it kills. Required regression scope: affected CONTENT
conformance, identity commitments, PRJ/WRT controls and integrated Campaign-2 activation/restore.
Retain `PHEN-DET-001` 1.0.0-draft and the existing corpus/0.26.0-draft identities; this drafting
pass adds no corpus entry or claimed run. PHEN-ADAPT remains NOT PASSED. Broader regression scope
is determined by actual construction changes; no blanket claim that all historical APIs pass VAL.

## 8. Deliberately deferred and review disposition

Deferred: generalized predicate DSL, arbitrary code/plugin execution, source/build hashing,
universal program-equivalence proof, dynamic interpreter loading, ontology/character schema
enrichment, generalized content kinds, migration of all legacy APIs, further numeric additions,
canonical construction and executable proof. Historical tests remain controls, not a silent
exception admitting anonymous semantics into the new authoritative path.

Revision 2 is SHAPE ACCEPTED at the three candidate versions above; its two schemas and two
registry-kind members are permanently allocated. Next design the authoritative Campaign-2
factory, implement it, run VAL-A..W and inherited mutants, and obtain build/release qualification.
Before the first real fixture activates, explicitly audit its authored type-170 semantic kinds;
any additional kind needs an accepted thin specialization first. This is an activation check,
not a reason to generalize the accepted character-only profile preemptively. Run the
frozen vectors and record failures/mutants/regression results before closing VAL-001. An added
executable choice, undeclared dependency, input capability, content-kind predicate or failure
semantics reopens this contract's relevant scope. It does not reopen accepted allocation numbers
or unrelated Campaign-2 seam decisions.
