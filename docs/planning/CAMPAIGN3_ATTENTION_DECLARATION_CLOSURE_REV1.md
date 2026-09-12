# Public ATTN canonical declaration closure

2026-09-11. `attention-public-declarations/0.1-draft`, revision1.
This document and [the machine inventory](ATTENTION_SYMBOLIC_DECLARATIONS_REV1.json)
close the declaration questions in [public integration revision1](CAMPAIGN3_ATTENTION_PUBLIC_INTEGRATION_REV1.md).
Acceptance, if earned, is recorded separately; this file alone authorizes no allocation.

## Closed grammar, not a transition language

The machine inventory is the allocation input:26 new records,89 ordered fields,
ten stage alternatives,62 scalar identity-role positions, three collection identity
checks and52 proposed fixed members. None has a new permanent number. Inherited
record/namespace numbers identify existing contracts only. New schema versions are1;
field IDs and finite/union tags remain a separate numeric gate. Required fields are
all fields except the explicitly `optional<T>` payloads. Optional absence is canonical
absence, not null. No schema or occurrence namespace is inferred from array position.

The earlier24-record inventory's abstract source/read unions were not canonical union
layouts. Replace their four alternative records with two explicit tagged records:
AttentionSelectionSource and AttentionReadValue. Their complete required/forbidden
payload sets are in the inventory. No open union, arbitrary-record slot or raw bytes
escape hatch is admitted. The four new declaration records then bring the total to26.
Earlier inventory/receipt bytes remain historical, not silently corrected.

AttentionStageRegistration is wrapped by existing171 with StableId=its exact
TransitionKindId and RegistryKindId=`registry/transition-registration`. SeamId, version,
EventTypeId, Phase, InputSchema, Ingress, Outputs, Allocations, Reads and write families
must equal the entire corresponding table row. Ten rows must exist exactly once.
The compiler rejects missing/extra stages, reused event kinds, alternate source edges,
reordered output definitions, widened writes and unknown branches before activation.
This is a finite recipe checker, not an interpreter for arbitrary authored transitions.

Ingress has two tags: Original requires an empty ParentStages set and is World only;
CompletedParent requires the exact nonempty parent-stage set in the table. Consume
admits PositiveSelect OR EmptySelect, never both; all other children have one permitted
parent. Registration authorizes a producer KIND; the private runtime binding still
requires the actual completed parent, current model/run/instant, exact payload and
complete output batch. Registration alone is never proof of authenticity.

Output definitions are ordered `(SchemaRef254, CountRule, IdentityRule)` values.
World, Freeze, selector and consumer have exactly one output. Track outputs219 first,
then n records217. Bind emits n224; Role emits q240; Classify emits none. Observe's
two declarations are an **exclusive branch**: n>0 emits exactly one positive observation
and no empty observation; n=0 emits exactly one empty observation and no positive one.
They are not two simultaneous Count=One obligations. n is the actual admitted detection
count; q is the complete actual unchanged SEM derivation result, never a model integer.

RuntimeTopLevel uses the corresponding existing278 identity rule in the occurrence
map. ContinuantTransition keys by actual217.CurrentDetectionId214; EventTransition
keys by actual219.CurrentEventDetectionId215. These are authenticated references to
already allocated detections, not new allocated identities or aliases for file IDs.
No generic278 row is fabricated for these outputs or any transport wrapper. This
finite output-key rule handles their actual SEM contracts without changing V04.

All Allocations sets equal the fixed stage table. They do not choose strategies at
runtime. Observe selects its positive/empty allocation rule solely from actual n.
None means zero shared runtime slots; it does not authorize omission of observer-file
state changes. WorldBatch allocates WorldEventId and three nested211 EventBindingIds;
PositiveObservation allocates ObservationId, nested215 event detection, n nested214
detections and one private ExperienceId reservation. EmptyObservation allocates only
ObservationId. Bindings/Claims allocate n/q of existing1103/1111. Selection/Processing
each allocate one of the two new symbolic occurrence families.

The reservation is not an output at10. Successful Freeze must use that exact reserved
ExperienceId at227.ExperienceId; it allocates no second slot. Whole-instant validation
requires one successful consumption per reservation and none for empty observation.
Nested allocation paths are fixed to the named fields above; no model-authored field
path language is introduced. Audits, views, read values and nested SEM transports
reference existing IDs and never cause additional allocations.

## Roles, member ownership and content

All62 listed scalar positions become265 RecordField constraints with263 RequiredNamespace
and absent DomainValidatorId. Optional fields are checked when present after union
admission. These cover the new records and the active existing SEM source/evidence
records, including all alternative reference fields of237. Dormant inherited schemas
do not authorize their production. No CharacterId position or qualification validator
is needed for this observer-only diagnostic. SemanticReferentId remains a referent,
not an implicitly qualified character.

Add exactly two StateMapKey265 constraints:241/1 and242/1 require ObserverId1000.
The active membership keys are records212/213; their nested ObserverId RecordField
constraints do the identity-role work. Their260 key grammar is record type212/213,
not identity-key grammar. No role is attached to an unsigned counter or whole record.

Three identity collections have explicit compiler checks: SceneDefinition.PortReferents
requires exactly the three distinct governed source referents in port order;
PortRoles requires three members of Actor/Target/Participant/Instrument/Beneficiary;
AuditRow.Roles requires the complete distinct actual1019 roles for that unit. These
are not scalar VAL positions. Existing list/set reference semantics and model set-member
constraints likewise stay in their owning compiler. Nested records still undergo all
ordinary recursive role validation. No DomainValidator is invented for a singleton.

The52 new fixed members are enumerated, not inferred at runtime. Standard inherited
registry kinds, `definition/transition-admission`, `authority/perception`, SEM role
members, initial derivation rule/function and its broad-domain validators are reused
with their accepted exact meanings. New `registry/attention-definition` holds the four
channel/policy/event-schema/causal-role model declarations and seven scenes. Stage
entries use the existing transition-registration kind. Union definition StableIds
use the existing1024 tuple convention after allocation, not new text members.

Exactly three170 content records have StableId1038 `content/attention-port-a/b/c` and
SemanticKind1004 `semantic-kind/attention-scene-object`. All remaining170 fields are
explicit empty lists. The new kind is a finite scene-object discriminator, not an
ontology, character kind or physical affordance hierarchy. Each referent is built by
the accepted1002(1037(1038(content member))) constructor. The finite source compiler
checks exact content membership and supplies the accepted event-binding component's
entity/usable-entity predicates for these three objects. No client supplies domain
tags, arbitrary origins or truth identity continuity. No namespace20 fixtures survive.

Inspection of `valDeclarations.ts` found that its current compileContent accepts only
the declared character kind. Therefore the new compiler must NOT invoke that path
on these object records, relabel them as characters, or manufacture an empty content
commitment. A dedicated `compileAttentionContentDeclarations` is part of this shape:
decode the exact three170 records; check every field/kind/member; use the generic
`compileGovernedContentManifest` with one private scene-object validator and the
registered scene-object kind; compile
the exact64 role positions with required namespaces and no validator operands; expose
detached role validation and lookup to the state/occurrence compilers. No public
validator callback is accepted. It implements the existing scalar VAL role semantics
and error boundary, not character qualification. Registry, content commitment and
role context must come from the same copied model source. The old VAL compiler stays
unchanged; empty content is not used as a surrogate for actual object content.

Scene entries have exactly the seven port-role vectors in the inventory. The event
schema is existing248 with the one participation EventTypeId, no FixedActionReferentId,
five246 cardinality rows each0..3, total3 and distinct referents enforced by the finite
scene compiler. This is not an amendment of generic248 to impose total3 globally.
The role model declaration uses existing258 with INITIAL_CAUSAL_ROLE_RULE unchanged;
its extra dormant mappings grant no input-role admission. Channel and policy entries
have exactly the new record types and candidate versions below. No per-original
channel, role, priority, capacity or algorithm override is accepted.

## Registry and model recipe

Use six slots with their existing collection forms. The inherited source is the exact
frozen `campaign2-task-cognitive-model/registry.cenc.hex` fingerprint in the inventory.
Decode and enumerate all297 declared schema/version pairs and all inherited union
StableIds. Historical373/schema1 is decoder-supported only; descriptor373/schema2
remains the inherited declaration. Add26 schema descriptors and the four new union
variants. No inherited executable entry or state family is copied merely because its
descriptor exists. Total declared schema pairs323; decoder compatibility may retain
the extra historical373/schema1 without declaring it.

| Slot | Exact construction |
|---|---|
|0|297 inherited descriptors +26 new; inherited union entries +4 new;10 stage171 entries;11 attention-definition171 entries; one scene-object kind171 entry; one existing279 occurrence singleton. No other executable or VAL validator entries.|
|1|Existing134, ordering-phases/2-candidate, unchanged.|
|2|Existing155/154 authority/perception, exactly four existing241/242 leaf definitions; retain membership removalAllowed=true and counter removalAllowed=false from SEM authority. The stricter first-profile writer independently forbids deletion.|
|3|Empty read-only-family set.|
|4|Four261 rows: two identity counter keys and exact212/213 membership record keys.|
|5|62 RecordField roles plus the two ObserverId StateMapKey roles; no character validator operand.|

The279 singleton retains transition-admission/0.4-candidate with empty Routes and
TransitionRoutes. Its occurrence map contains exactly the11 `(record, field)` rows
in the inventory, including the nested211/214/215 allocation identities. These rows
make extraction/role checking available; they do not create extra output records.
The attention compiler uses `compileOccurrenceIdentities` with its closed schema
context; it never calls the old V04 registration compiler on new registrations.
All eleven identity fields are required scalar fields, including214/215 field2.

The scene-object kind entry has its exact1004 StableId, existing
`registry/semantic-kind`, version `attention-content-kind/0.1-candidate` and existing329
payload pointing to170/1 through254. This independently registered kind is required by
generic CONTENT even when no170 reference-list entries exist. It is checked by the
new finite content compiler, not passed into the character-only VAL entry compiler.
It grants no character qualification and has no330 DomainValidator companion.

Tracking's four AccessorIds are exact members in the inventory. Each maps to its one
149 wildcard-map-key family. RegisteredReadDomain is the canonical set of those four
patterns. Actual reads are two counter reads and n+1 membership-absence reads against
pre-state, canonical StatePath order, once each, with the owning accessor, absence,
no value and empty derived sources. No projection transformation is claimed. Runtime
stage adapters receive narrow state access rather than the whole state object.

The32 proposed model recipes are explicit:27 channel-mode triples at RolePriority/K1,
plus all-visible-exact K0, K2, equal/K1, unlimited/K0 and work8. All use work9 except
that named negative control. Unlimited's K0 is a canonical unused operand, not zero
selection. Each model includes the same seven scene definitions and admits one of
them as its single original. Production qualification should execute all224 model/
scene combinations; work8 positives fail, while fully denied work9 cases take the
four-event branch. The five-role grammar stays narrow even though actual n/q vary.

Parameters are a singleton list of existing133 OrderingParameters with work8 or9.
S0 is the empty canonical state. Content/registry/parameters and exact versions enter
the existing ModelIdentity commitment. Ordered inputs retain the established outer
list entry `(signed DueAt, unsigned phase0, typed EventTypeId, AttentionSceneOriginal,
empty Dependencies list)`. Exactly one entry, matching inner/outer positive DueAt and
World EventTypeId, is required. RunSeed is committed but consumed by no RNG.

Proposed bundle labels: rules/campaign3-attention/0.1-candidate,
registry/campaign3-attention/0.1-candidate, parameters/campaign3-attention/0.1-candidate,
numeric/campaign3-attention/0.1-candidate. Ordered-input, trace and persistence versions
are respectively attention-ordered-input, attention-trace and attention-persistence,
each /0.1-candidate. All new output TransformationVersion and stage SeamVersion labels
are attention-public-integration/0.1-candidate; channel/scene/policy versions use that
same label. Existing SEM outputs retain their exact accepted A/C/G/H versions.
These labels describe the proposed recipe; no exact model bytes are frozen here.

## Review scope and frozen implementation controls

No new persistent family, route, PRJ accessor semantics, RNG, evidence reference kind,
ordering phase, observation unit or provenance graph is needed. The observer-only
subject refinement explicitly supersedes only the component contract's prospective
public attachment requirement; it does not alter accepted IDN or PRJ behavior.
Downstream character-state use remains a separate admitted seam.

AT2-A..N remain FROZEN, NOT PASSED. In addition to their existing public/component
scope, the future declaration compiler must reject every one-row deletion/addition,
wrong parent, wrong schema/branch/tag, duplicate event kind, writable selector, orphan
role/occurrence row, wrong214/215 identity field, unregistered nested allocation,
unconsumed/duplicate experience reservation, wrong collection namespace, field-role
validator smuggling and uncommitted model recipe. Typed input decoding alone must
not manufacture an admitted child. Every public trace, rollback and restore boundary
still requires execution; symbolic audit counts do not discharge those obligations.

No new diagnostic vocabulary is proposed. Existing INVALID_CONFIGURATION owns bad
model/declaration admission; owning canonical/SEM/state validators retain their exact
failures; TRACE_VALIDATION_FAILURE, CASCADE_LIMIT_EXCEEDED and SaveContractError keep
their existing meanings. A runtime integration finding that needs another semantic
failure class requires a forward contract/member review.
