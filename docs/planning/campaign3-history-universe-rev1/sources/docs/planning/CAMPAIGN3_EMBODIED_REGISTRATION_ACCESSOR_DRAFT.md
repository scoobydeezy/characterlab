# EMB-001 registration and body-accessor closure

2026-09-10, revision1. **Symbolic proposal; not accepted or allocated.** Refines
[ingress/scheduling](CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md) and the
[initial reserve model](CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md). Field order below is
proposed schema order; record IDs, field allocations and new members remain unassigned.

## 1. Inspection finding and bounded choice

The required projection compiler accepts a top-level admitted identity as selector,
not the result of another projection. Its exact IDN instantiation protects the roster
from every alternate read path. `ContractReadProjection` supports direct bindings,
records actual present/absent reads and detaches results; it does not perform reads
merely on construction. It also supports callbacks for derived bindings, which are
unnecessary for this first reserve read.

Choose **IDN projection followed by selection among precompiled exact direct body
bindings inside the trusted source adapter**. Do not add chained PRJ selectors, expose
state paths to semantic code, copy CharacterId into the source payload or use another
roster accessor. Materialize q from the admitted anchor in the fixed source function,
not through an anonymous derived-projection callback or a synthetic stored q leaf.

MEC-003/004 and P3-009/010/011 remain the physical-decomposition, epistemic, constitution
and time controls. No historical meter or truth-reading cognitive source is ported.

## 2. Definitions and state shapes

Definitions use existing governed DefinitionId/entry machinery, with new exact kinds
and supported versions requiring later member review. There is one channel/pressure
definition per admitted observer in this bounded profile. Qualified characters and
observers retain accepted identity families/roles.

| Symbolic record | Ordered required fields |
|---|---|
| ReserveParameters | UnitId, Capacity, ConsumptionRate |
| ReserveAnchor | AmountAtAnchor, AnchorInstant |
| ReserveState | Anchors: canonical map CharacterId → ReserveAnchor |
| ReserveBodyBinding | CharacterId, ReserveParameterDefinitionId |
| LevelChannelDefinition | ObserverId, UnitId, ModalityId, Capacity, BinWidth, Available, Permitted |
| LevelSamplingOpportunity | ObserverId, ChannelDefinitionId |
| PressureDefinition | ChannelDefinitionId, Threshold |

The model contains a canonical set of ReserveBodyBinding records, unique by CharacterId.
Each binds an existing declared character to one exact ReserveParameters definition.
The reserve state's map uses the same qualified CharacterId key. Model construction
requires exact key coverage: no missing body, unknown character or extra unbound anchor
in this first profile. No reverse roster map is constructed. At runtime, the source
resolves O through IDN, selects its declared body binding and verifies channel capacity
and unit equal those of that binding. It does not accept a caller-selected body key.

Capacity>0; ConsumptionRate≥0; units agree exactly; 0<BinWidth≤Capacity and
Capacity/BinWidth is integral; 0<Threshold≤Capacity. AmountAtAnchor is exact rational
in[0,Capacity]; AnchorInstant is canonical time no later than the state boundary.
There is no rounded q field, hidden consumption debt or stored pressure. Parameter
association lives in immutable committed model data, not a duplicate mutable anchor
field. This refines the initial draft's parameter-binding requirement: save/restore
binds anchors through that exact model, rather than copying parameter IDs into state.

LevelChannelDefinition repeats capacity/unit as a sensor-domain declaration and model
construction requires their equality to the selected body's definition. This is an
explicit consistency constraint, not a second physical capacity authority. Available
and Permitted are fixed model booleans in the first profile, not per-event claims.
Different permissions/sensor widths require separately committed comparison models.

ReserveState.Anchors is a new dynamic embodied family with identity-key/canonical-record
value grammar and sole symbolic authority `authority/embodied-reserve`. Sampling and
pressure are never writers. Replenishment remains the pending physical writer contract;
these declarations do not authorize a generic patch or caller-defined mutation.

## 3. Exact source registration shape

Source admission is distinct from generated-pressure admission. Proposed records:

| Record | Ordered required fields |
|---|---|
| LevelSourceRegistration | ProducingSeamId, ProducingSeamVersion, SourceDefinition, SourceOrigin |
| LevelSourceDefinition | InputRecordSchema, ReadDomain, RequiredProjections, ChannelDefinitions, BodyBindings, OutputChoice, WriteCapability |
| LevelInputOnlyOrigin | EventTypeId, Phase |
| LevelSampleOutputChoice | PresentOutputDefinition, UnavailableOutputDefinition |

InputRecordSchema is exactly LevelSamplingOpportunity. SourceOrigin is the closed
InputOnly record, Phase=10. ChannelDefinitions is a canonical nonempty set of exact
LevelChannelDefinition references. BodyBindings is the canonical set in §2, not an
arbitrary path template or callback. RequiredProjections contains only the existing
IDN requirement over the input ObserverId. ReadDomain contains the roster pattern
and exact declared reserve paths, with no other body, REG, cognition or trace family.
WriteCapability is the existing NoStateWrites shape, not a Boolean interpreted by host
convention. No routes or output occurrence rule is fabricated for the source payload:
its occurrence identity is the actual original scheduled event, already owned by the
scheduler. The two sample outputs do have explicit top-level1115 occurrence rules.

OutputChoice declares exactly one present or unavailable output per source execution,
never both or neither. Its definitions reuse the accepted output-schema/occurrence
description where expressible; exclusivity is this version's explicit source rule,
not two independent zero-or-one outputs. The reservation/padding ordinal is host
allocation bookkeeping, not a second semantic output of the source transition.

The new source registration must have an explicit projection-compiler dispatch path
that extracts its declared input schema and ReadDomain and preserves all existing
PRJ/IDN checks. It must not pretend to be V04 or mint an unbranded input object. The
source admission authority privately binds the exact original input event to this
registration before the unchanged subject-selection semantics may run.

## 4. Exact pressure registration shapes

Use separate records to keep the two producer requirements disjoint:

| Record | Ordered required fields |
|---|---|
| PresentPressureRegistration | OwningSeamId, SeamVersion, Definition, Ingress |
| UnavailablePressureRegistration | OwningSeamId, SeamVersion, Definition, Ingress |
| PresentPressureTransitionDefinition | InputAdmission, ReadDomain, OutputDefinitions, WriteCapability, RequiredProjections, PressureDefinitionId |
| UnavailablePressureTransitionDefinition | InputAdmission, ReadDomain, OutputDefinitions, WriteCapability, RequiredProjections, PressureDefinitionId |
| PresentLevelInputAdmission | InputRecordSchema, PresentWithFrozenSupport |
| UnavailableLevelInputAdmission | InputRecordSchema, UnavailableOpportunityResult |
| PresentWithFrozenSupport | SamplingProducerDefinitionId, SamplingSeamVersion, SampleEventType, SamplePhase, SampleSchema, SEMSeamVersion, Lane, FreezeEventType, FreezePhase, FrozenSchema, SupportRule |
| UnavailableOpportunityResult | SamplingProducerDefinitionId, SamplingSeamVersion, SampleEventType, SamplePhase, SampleSchema, SettlementEventType, SettlementPhase, ResultRule |

Exact field domains and fixed values are those in the ingress draft: sample10,
settlement14, current SEM227/1 for present only, singleton same-opportunity support,
no-evidence/no-reservation for unavailable. The two registrations have distinct
transition/event identities in their committed registry entries; no duplicate embedded
transition ID is needed. Ingress reuses the accepted event/phase binding layout where
its schema permits, with phase60. Unknown version/record pair rejects, with no fallback.

Each ReadDomain contains only the IDN roster pattern. OutputDefinitions contains one
EmbodiedPressureOutput definition with its new pressure occurrence family. Both
registrations use the same pressure definition for the channel and empty writable
families. RequiredProjections selects their required top-level ObserverId. Model
construction requires exactly two registrations per channel, one of each kind, and
rejects additional present/unavailable consumers in this first profile.

Proposed producer records above are separate shapes, not additions to any accepted
producer union. Shared singleton occurrence entries may extend only in the successor
model. Existing learning-route definitions and transition mappings remain exact.

## 5. Body accessor contract

Symbolic new accessor member: `accessor/embodied-reserve-anchor`, in existing
ProjectionAccessorId family1028, **not allocated**. One immutable direct binding is
compiled per declared character to `ReserveState.Anchors[that CharacterId]`. Input
cannot supply an accessor/path. Bindings do not include the roster. The actual resolved
subject selects exactly one of these bindings; absence is configuration/admission
failure, not fallback to another body, zero reserve or Unavailable.

Execution order is fixed:

1. Authenticate the actual InputOnly event and matching source registration.
2. Validate its declared O/channel association; construct IDN projection and resolve C.
3. Select C's exact body binding and check safe channel/parameter consistency.
4. If either committed permission Boolean is false, emit Unavailable without reading
   the body leaf. The IDN read still exists and is traced.
5. Otherwise perform exactly one direct read of ReserveAnchor. Missing/malformed leaf
   rejects. The fixed source function receives the detached anchor, immutable capacity,
   consumption rate and unit, channel width and authenticated DueAt only.
6. Compute q=max(0,q_a-r*(T-t_a)) exactly and then the declared bin. Emit the permitted
   sample; q, anchor, rate and path remain absent from that output.

The truth-side direct read records accessor/path/presence/whole anchor value, with
empty derivedSources and no fictitious projection transformation. Parameter binding
and materialization/bin transformation versions appear in source trace/definition
provenance. Do not claim the read returned an already materialized q, or invent a
derived read row to hide where the anchor came from. No anonymous `derive` callback
is needed. The source semantic function has no state handle; the later pressure
function additionally has no anchor/parameter/time-history access.

Private binding selection is a model-compiled finite dispatch, not an extension of
PRJ's selector grammar. Model construction checks every binding against the source's
declared ReadDomain and state-family role grammar; runtime verifies the selected path
key equals projected C. A real binding-substitution control is required: swapping to
another existing valid body must fail, even if its numbers happen to match.

## 6. Identity and occurrence inventory

| Position | Required identity rule |
|---|---|
| Opportunity/sample/channel ObserverId | Existing ObserverId role; no inferred character alias. |
| ReserveState key / body binding / pressure output CharacterId | Existing qualified CharacterId role, including VAL character predicate. |
| Channel/parameter/pressure/source definition references | Existing definition family, exact registry-kind/version qualification. |
| Channel UnitId | Existing ObservationUnitId family; new fuel member still needs symbolic/member allocation review. Never fixture-pulse alias. |
| Sample ObservationId | Existing1115 top-level rule for each new sample schema; same ordinal wrapped once. |
| SEM227 and its support | Existing experience1106 and observation1115 rules, unchanged. |
| PressureOccurrenceId | One new symbolic output namespace and top-level rule, unallocated. |
| Body accessor and owner | Existing1028/1025 families; new exact members unallocated. |

Amounts, thresholds, capacities, bin widths, times and booleans are values, never
identity payloads. Finite intervals and anchors have no independent occurrence keys.
No RuntimeId is minted for a body materialization, parameter read or missingness cause.

`observation-unit-identity/0.1-candidate` admits only fixture-pulse in its first profile.
The fuel token requires separately accepted versioned fixed-member semantics and
allocation; possessing namespace1039 does not suffice. The body contract gives the
fuel quantity its physical interpretation; unit identity alone supplies no conversion,
dimension registry or SI assertion. Old singleton admission remains unchanged.

## 7. Profile composition and outstanding integration

This is a new bounded profile, not a new flag accepted by the frozen cognitive factory.
It must commit exact definitions, schemas/union layouts, VAL roles, state declarations,
registrations, source-origin rules, phase topology, trace mapping and persistence
dispatch. The six-event sampling budget remains unchanged by using a direct anchor
read. Replenishment and future task/embodied receiving add their own explicit topology.

Before whole acceptance, close the physical replenishment input/writer and its binding
to body ownership; map source/SEM/pressure trace inputs and outputs to canonical record
schemas; enumerate new numeric surfaces for separate review; and prove old models
exclude every new shape. No source/pressure public control has executed. Constitutive
parameter changes, learned tolerance and independent stored Need remain out of scope.

## 8. Proposed adversarial controls — NOT PASSED

| ID | Required distinction |
|---|---|
| EREG-A | New source registration cannot enter old projection dispatch; successor accepts only exact declared layouts. |
| EREG-B | Source token forgery or registration substitution rejects before selector/roster reads. |
| EREG-C | Alternate roster binding, nested selector or caller-provided CharacterId rejects. |
| EREG-D | Swap to another valid character's equal-valued anchor; owner/path equality must reject the substitution. |
| EREG-E | Permission false causes zero body reads, with the actual IDN read retained in trace. |
| EREG-F | Missing/malformed body is failure on present branch, not missing observation or clamped initial state. |
| EREG-G | Mutating binding inputs after compilation cannot redirect the read. |
| EREG-H | Unit/capacity/parameter mismatch and orphan/duplicate body binding reject. |
| EREG-I | OutputChoice neither/both, wrong occurrence family or sample identity reuse rejects. |
| EREG-J | Pressure registration cannot read anchor, source definition, world effects or unregistered channel parameters. |
| EREG-K | Direct-read trace reports exact anchor and no fictitious q state/derived row. |
| EREG-L | Restore with changed body parameter binding/model rejects; pure query never rewrites anchor bytes. |

Self-review: finite exact bindings avoid a new dynamic-selector feature but restrict
the first profile to model-declared bodies. Runtime body creation is not accidentally
supported. The new unit member is a physical-quantity declaration for an idealized
fuel stock, not evidence of a biological Need ontology or permission to convert REG.
