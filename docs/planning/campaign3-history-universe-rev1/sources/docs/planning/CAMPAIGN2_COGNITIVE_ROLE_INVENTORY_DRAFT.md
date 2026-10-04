# Cognitive identifier role inventory

Status: DRAFT. Symbolic receiving-profile constraints, no allocation. This supplements
the partial schema inventory and deliberately separates scalar265 positions, collection
admission, contextual RNG bindings and occurrence rules.

## Existing namespaces and qualifications

All new direct CharacterId scalar fields use existing namespace1002 plus the accepted
character qualifier: TaskWorkspace.CharacterId, ProceduralCandidateKey.CharacterId
and TaskIdentityKey.CharacterId. No caller-authored subject bypasses PRJ/IDN. Reused
TaskCommitmentKey371 keeps its exact accepted RecordField roles for character and
task referent. It does not acquire a StateMapKey role on either internal field.

DefinitionId1027 applies to agenda, prediction definition, task spec, adopted plan,
protocol action, calibration and registration references. The receiving compiler also
checks the exact registry kind/schema/version and member set; namespace alone is not
membership. These references introduce no new definition family. Record-valued keys,
origins, readout values, source records and lists are not scalar identity positions.

ReasonNucleusKey.TaskReferent uses1002 with the accepted task qualifier. Its MotiveChannel
and the identity-channel fields require symbolic closed discriminator vocabulary; do
not infer they are arbitrary strings because the historical TypeScript used strings.
The first profile admits only Commitment and CommitmentFidelity respectively. Their
final namespace/member inventory is still a separate gate.

Observation basis atoms contain237 narrowed to its Observation variant and the exact
1115 support admitted by361. Do not globally restrict237 or add a new observation ID.
Qualified-expression atoms use the actual new qualification occurrence family, shared
with TaskIdentityContribution.QualificationOccurrenceId. Its DecisionResolutionOccurrenceId
uses the actual decision-output occurrence family. Neither field allocates an ID.

Every semantic output occurrence field has a namespace-only role under its own symbolic
occurrence family and one matching278 rule in279/3. Inline records allocate none.
No separate DomainValidator is needed merely to recognize a runtime occurrence family.
Runtime provenance is established by actual source binding and complete-prefix replay,
not by interpreting an occurrence payload or treating a namespace check as authenticity.

## Record keys, collections and state

The new373 plan map and identity evidence map both have record-valued keys. Their
key grammars resolve the exact key schema; scalar identity roles attach to that schema's
fields. StateMapKey is reserved for a directly typed scalar map key at a root field,
not a workaround for internal record fields. The plan field is immutable and disjoint
from the existing writable commitment field. Identity has a separate authority.

Canonical list/set/map elements are validated by the owning schema/profile collection
rule. Examples: task spec collections, option origin sets, evidence atom maps,
probability lists and history lists. Do not point265 at a collection and pretend it
checks each contained identifier. Nested record scalar roles are still applied normally.
Declaration completeness must prove the exact collection grammar alongside the role
inventory, not merely count registered265 records.

## Contextual random bindings

RandomAddress110 and SubjectBinding111 are generic accepted substrate records.
SubjectBinding.SubjectId is intentionally polymorphic: actor→qualified1002 character,
action→1027 admitted protocol definition, task→qualified1002 task. A single global
RequiredNamespace265 on111/2 cannot express all three contextual roles. Installing
one would reject valid bindings or accidentally erase the action/task distinction.

The exact cognitive address compiler therefore owns the closed relation between
SubjectRoleId and SubjectId, with no global111/2 narrowing. It requires one each of
actor/action/task for a reason face and actor alone for a tie; rejects extra/missing/
duplicate roles; checks each matching namespace/qualification/member and compares
the complete IDs to the actual authenticated nucleus. This is concrete contextual
admission, not a permissive generic typed-ID exception. The actual scalar-only265
checker does not perform it and must not be cited as doing so.

110.CausalRootId is the actual current DecisionResolution occurrence;110.PurposeId
and111.SubjectRoleId use their new exact receiving vocabularies. Natural/coupled key
records retain their accepted structural meanings. Any allowed comparison map requires
its exact purpose/comparison-role compatibility under the accepted substrate. The
first profile may exclude externally supplied maps, but cannot claim their admission
or PERSIST-I integration without tests.

## Pending inventory gates

Reconcile all generic helper and new record positions against the final schema table,
including optional union fields. Enumerate fixed registry/event/seam/accessor/authority/
family members separately from identity namespaces. Confirm production namespaces for
random purposes, subject roles, comparison roles and motive/identity channels before
allocating any new one. Test namespaces remain controls; adjacency has no meaning.
Then require symbolic coverage, exact scalar/collection/contextual admission coverage,
and one-to-one occurrence coverage in separate audits before numeric allocation.
