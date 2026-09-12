# ATTN three-port source: symbolic producer closure

`attention-observer-source/0.1-draft`, revision1, 2026-09-11.
**Source design and component composition reviewed; public whole shape OPEN.**
No new public codec, allocation, model commitment or scheduler qualification is claimed.
This resolves the producer design questions beneath ATTN closure revision2, with the
explicit refinements below. Evidence: [64 composition cases](ATTENTION_SOURCE_COMPOSITION_REV1.json).

## Physical original and channel

One original event at a positive instant per finite run. Exactly three physical ports
hold three distinct model-authored semantic referents; each has one truth-side event
binding. The same declared event grammar admits Actor, Target, Participant, Instrument
and Beneficiary with cardinality0..3 each, exactly3 total bindings and distinct referents.
All three referents satisfy entity/usable-entity domain predicates. The grammar supplies
no fixed Action binding; the event is a bounded participation scene, not an authored
Decision or action effect. Duplicate roles on different ports are allowed for ties.
Multiple roles on one unit remain excluded by this public first profile; the qualified
component keeps its explicit multi-role rejection/exclusion controls.

`AttentionSceneOriginal` fields, in order: DueAt:SimInstant, SceneDefinitionId:DefinitionId.
A committed SceneDefinition holds three port-ordered EventRoleIds and three distinct
SemanticReferentIds with governed content origins. The original supplies no scores,
selected flags, perceived identities, claims or observation records. Changing the
scene's physical role assignment is an authored world intervention. It is not a
per-concept attention intervention. Exact production member payloads remain a later
allocation/content gate; the composition harness's namespace20 identities are fixtures.

`AttentionRoleChannelDefinition` fields: ObserverId, PortModes:list(3 modes), Version.
Each mode is exactly Denied, VisibleExact or VisibleUnresolved. Permission and role
resolution remain distinct. Changing channel definition requires a distinct model
commitment. No salience/capacity data is part of the observation channel. Physical
port order is the declared detector sweep order. It is not psychological importance.
The selection component only receives resulting opaque observer-file identities.

No reuse of generic numeric Observation203 or unit/fixture-pulse is proposed. Role
observation carries no numeric measurement, precision, unit or category inference.

## Freeze role evidence before tracking

At phase0 the sole source handler materializes WorldEventTruth210 and three actual
EventBinding211 values through the existing binding compiler. Allocate WorldEventId,
then the three EventBindingIds in the compiler's canonical order: exactly4 runtime
slots regardless of hidden role changes. All truth bindings and their IDs remain
trace-side after observation.

At10, read that pre-cutoff truth snapshot through the new role-channel projection.
Sweep ports in fixed physical order. Denied yields no detector item. VisibleExact
copies the permitted binding's EventRoleId into existing EventRoleEvidence223.Exact;
VisibleUnresolved emits223.Unresolved with no role field. There is no truth binding ID,
semantic referent, physical port ID or hidden-mode list in the character observation.

This small before-tracking projection is a **new governed observation contract**.
It does not call `projectEventRoleEvidence` with a fabricated track: that existing
helper requires a real track, which does not exist yet at10. At12, the frozen223 value
is passed into `compilePerceivedBindings` after tracking. No late truth reread occurs.
Coarsen-to-participant is not admitted in this first channel; its existing SEM control
is preserved. Visibility never establishes identity or classification.

## Symbolic observation and transport inventory

The following field order and cardinalities are proposed; names are symbolic, not
record-type or namespace allocations. Public records must receive a separate numeric
review before codecs can admit them.

| New surface | Ordered fields / refinements |
|---|---|
| AttentionSceneDefinition | PortReferents:list3 SemanticReferentId; PortRoles:list3 EventRoleId; Version:text. Distinct referents; exact five-role grammar. |
| AttentionSceneOriginal | DueAt:SimInstant; SceneDefinitionId:DefinitionId. One original; no event IDs supplied by client. |
| AttentionRoleChannelDefinition | ObserverId; PortModes:list3 closed modes; Version:text. |
| ObservedRoleDetection | CurrentDetectionId214; EventRoleEvidence223. One per visible port; distinct detection IDs. No port/truth link. |
| AttentionRoleObservation | ObservationId; ObserverId; OccurredAt; CurrentEventDetectionId215; Detections:list1..3 ObservedRoleDetection; TransformationVersion. Positive branch only. |
| AttentionNoDetectionObservation | ObservationId; ObserverId; OccurredAt; TransformationVersion. Means no admitted detection, not that nothing existed. No experience/event/file identity. |
| AttentionTrackingInput | Actual AttentionRoleObservation. No caller copy admitted. |
| AttentionBindingInput | Actual observation; EventTransition219; TrackTransitions:list1..3 of217. Bijective detection/transition match; one observer/time. |
| AttentionClassificationInput | Actual observation; EventTransition219; Bindings:list1..3 of224. Empty governed classification domain. |
| AttentionFreezeInput | Same completed source products required to assemble227. Carries no chosen ExperienceId; uses the live reserved identity. |
| AttentionRoleBatchInput | Actual frozen227. Producer-private observation/binding index is available only to role derivation under its exact domain. |
| AttentionPositiveSelectionInput | Actual completed227 plus claims:list0..3 of240. Bound to completed15 and the actual source output archive. |
| AttentionEmptySelectionInput | Actual AttentionNoDetectionObservation. Cannot masquerade as a positive source or manufacture227. |

Transport wrappers carry existing source occurrence references and actual completed
values; they have **no independent item occurrence identity**. The source outputs are
the new observation record and existing SEM records, not transport wrappers emitted
again as a second provenance stream. No source wrapper is a public ordered original.
The public selector/audit/selected-view/receipt inventory from closure revision2 is
still required and is not completed by this source-only table.

## Exact staged graph and proposed budgets

| Phase | Work / authority | Runtime allocations | Output records |
|---|---|---:|---:|
| 0 | Materialize fixed-cardinality world event | 4 | 1 WorldEventTruth with3 nested bindings |
| 10 positive | Channel projection, detect, reserve experience | n+3 | 1 AttentionRoleObservation |
| 11 positive | One event-file then n new continuant files | 0 shared-runtime slots | 1+n transitions219/217 |
| 12 positive | Compile frozen observed role bindings | n | n records224 |
| 13 positive | Explicit empty classification domain | 0 | 0 |
| 14 positive | Freeze and settle the one reserved experience | 0 | 1 record227 |
| 15 positive | Derive complete actual role claims, canonical unit order | q | q records240 |
| 10 empty | No admitted detections; no experience reservation | 1 | 1 AttentionNoDetectionObservation |

For n>0: source runtime slots=7+2n+q, outputs=4+2n+q, source events=7.
Here n≤3 and q≤n; unresolved and Beneficiary can have no derived claim, while
Instrument derives a claim excluded by the selector's supported-role profile.
Maximum source slots16 and outputs13. File ordinals are allocated independently by
existing observer-owned241/242 state, not counted as shared runtime slots.

At10 allocate ObservationId first, then EventDetectionOccurrenceId iff positive,
then n DetectionOccurrenceIds in visible sweep order, then reserve ExperienceId.
At11 event-file allocation precedes continuant-file allocation. At12 use the actual
binding compiler's canonical ordering. At15 order units by canonical existing file
keys and claims by the accepted compiler's order. SEM evidence indexes use
`characterEvidenceRefKey` canonical ordering, **not numeric occurrence order**.

The empty branch has source events0/10 only,5 runtime slots,2 outputs and no241/242
write. It emits the empty selection input directly at40. The positive source emits
its selection input from15. Proposed selection40→receipt40 adds2 events and2 result
occurrences/outputs, giving whole positive maximum9 events,18 slots,15 outputs;
empty maximum4 events,7 slots,4 outputs. These downstream numbers are conditional
on a single-result selector/receipt registration; they are not yet frozen work limits.

No classification, role or recognition event is fabricated to pad an empty source.
K0 with visible input still produces its normal observed history and reserved227.

## State, privacy and validation

Initial241/242 observer file states are empty. Only tracking11 writes them under
existing SEM state authority; no attention handler receives their write capability.
The source never reads or writes body, belief, memory, identity, task, adaptation or
REG state. A CharacterId projection is not invented by the source; a later public
selector wrapper must attach its actual PRJ/IDN requirement if it includes CharacterId.
ObserverId in the observation is channel-owned, not an independent original operand.

All positive wrappers are admitted only as actual bound child products, with exact
model, instant, observer, parent, sequence and payload bytes. Empty/positive union
branches have separate exact schemas. Freeze validates the reservation bijection;
role claims validate the exact same-experience source index. Source construction is
not complete until every reserved output and child is accounted for at quiescence.

The selected-only consumer must never receive the observation envelope: a common
observation can support multiple units. Existing237 observation references may appear
as opaque ancestry in a selected binding, but that consumer has no observation schema
read permission or full archive. Changing an unobserved port's role must preserve
all visible SEM/claim bytes and selection; fixed truth cardinality prevents an
allocation-count leak from that intervention. Changing visibility itself can change
visible detector IDs and is not covered by that equality claim.

## Review outcome and remaining gate

[Composition evidence](ATTENTION_SOURCE_COMPOSITION_REV1.json) covers64 visibility/
resolution cases,96 hidden-role equalities, supported-role swap, unsupported/missing
role exclusions, actual file transitions, experience reservation/staging and actual
SEM derivation feeding the implemented selector. Its proposed event counts are not
scheduler execution. No AT2 runtime vector is promoted.

The composition exposed the component's numeric-versus-reference-order bug at9→10.
[Forward correction](ATTENTION_COMPONENT_ORDER_CORRECTION.md) fixes implementation,
adds boundary tests and preserves the original qualification receipt as history.

Next complete the public selection/trace/registration/state-role inventory and its
admission/restore rules against this source proposal. Then review whole shape,
separate allocation and exact model commitments. No whole shape acceptance or
canonical public producer implementation is earned by these component checks alone.
