# ADAPT F — canonical packaging inventory, revision 2

2026-09-06. **Inventory of shape-accepted packaging; not the permanent numeric allocation table.**
Overall ADAPT is whole-contract shape accepted at `adaptation-input/0.31-candidate`. E revision 2 is frozen as the internally
shape-accepted `adaptation-input/0.31-candidate` component. Permanent allocation is now authorized and pending; canonical implementation
remains unauthorized. No permanent record, field, namespace, member or union-tag number is assigned.

Packaging and final shape review are complete. Campaign 2 F permanent allocation is now the
authorized next specification step; implementation and proof remain gated.
[Accepted symbolic packaging revision 3](ADAPT_001_PACKAGING_DRAFT.md) now supplies the domain decisions,
record/union tables, version matrix and ownership audit. The accessor gap is now closed by shared PRJ-owned ProjectionAccessorId; the historical
domain-design choices below are superseded by that draft and its revision-2 allocation clarification.

## 1. Frozen inputs and authority

| Input | Disposition / packaging obligation |
|---|---|
| [A/B/C consolidation](ADAPT_001_CONSOLIDATION_DRAFT.md) | Preserve logical families, sole physical ownership, V04/V06 coexistence, dispatch/result closure and exclusive settlement. |
| [D source](ADAPT_001_FACT_INGRESS_DRAFT.md) | Preserve exact actual-fact/AAI records, InputOnly origin, compact pending-source restore and generative ingress. |
| [D bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md) | Preserve fixed pulse and actual SEM freeze; FixtureConsequenceTruthId is fixture-local, never a global restriction on type 200. |
| [E revision 2](ADAPT_001_RULE_INTERPRETER_DRAFT.md) | INTERNALLY SHAPE ACCEPTED. Preserve six-field rule, version-fixed resolver/equation, exact keys, immutable per-rule projections, collision split and read segments. |
| [EVID](EVID_001_DRAFT_RESOLUTION.md) | Preserve accepted records and NoStateWrites-only V04 registration/singleton. Reuse occurrence and registry identity machinery. |
| [REG](REG_001_DRAFT_RESOLUTION.md) | Sole owner of RegulatoryVariableId, variable domain, unadapted reference and signed-displacement bound. No duplicate Unit/reference/state family. |
| [PRJ/WRT](SUBSTRATE_ADDENDA_DRAFT.md), [IDN](IDN_001_DRAFT_RESOLUTION.md) | Preserve key/role grammar, qualification, accessor uniqueness and validation precedence. No new CharacterId namespace or generic query language. |

Consult [REFERENCE_MECHANISM_LEDGER](REFERENCE_MECHANISM_LEDGER.md) for the preserved obligations.
E's explicit dispositions remain in force; packaging supplies no historical kinetics or new formula.
No accepted prerequisite is reopened. VAL-001 remains a nonblocking P1 follow-up.

## 2. Leaf/key/value table to complete

All keys are one canonical record-valued mapKey, with CharacterId qualified by accepted IDN.
All values have exactly one Magnitude field; scale/reference/capacity is not duplicated in state.
Absence is zero baseline, explicit zero entries are noncanonical, and removal is allowed for all five.

| Logical family / physical field | Required distinct key record fields | Value record / magnitude | Governing domain home |
|---|---|---|---|
| regulatory-adaptation / RegulatoryAdaptationState.Tolerance | CharacterId, ExposureReferentId, RegulatoryVariableId | ToleranceValue / unsigned | Leaf-family scale; 0..Scale |
| regulatory-adaptation / RegulatoryAdaptationState.Sensitization | CharacterId, ExposureReferentId, RegulatoryVariableId | SensitizationValue / unsigned | Leaf-family scale; nonnegative, no ceiling |
| regulatory-adaptation / RegulatoryAdaptationState.Displacements | CharacterId, RegulatoryVariableId | RegulatoryAdaptationValue / signed | Accepted REG variable lattice; R0(C,V,T)+D in V's bounds |
| regulatory-adaptation / RegulatoryAdaptationState.Loads | CharacterId, LoadDomainId | AccumulatedLoadValue / unsigned | LoadDomainDefinition Scale and Unbounded/Bounded capacity, no Unit |
| procedural-skill / ProceduralSkillState.Competence | CharacterId, ProcedureId | ProceduralCompetenceValue / unsigned | ProcedureDefinition competence scale; nonnegative, no ceiling |

Five key records remain distinct even when field lists coincide. F must freeze their exact symbolic
record names, field order, key roles and schema references, plus the exact leaf definition records
that resolve domain ownership. The table states inherited semantics; it does not silently assign a
canonical layout to an unresolved definition.

## 3. Complete accumulated surface checklist

| Surface | Required packaging content | Reuse / prohibition |
|---|---|---|
| Logical family identity | Campaign2StateFamilyId, ten members, Campaign2StateFamilyRegistry and family definition with Unmaterialized/Materialized storage | Eight cognitive families have no root or active authority. No stored authority in family records. |
| Physical ownership | Two roots, five leaf fields, LeafFamilyId members/definitions, exact OwnedLeafDefinition and PRJ declarations | Accepted StateOwnershipRegistry is the only owner source. |
| Value/domain declarations | Five keys/values above, tolerance/sensitization scales, LoadDomainId/Definition, ProcedureId/Definition | Do not merge procedure, load domain, regulatory variable or semantic referent identities. |
| Exposure qualification | Exact allowed SemanticReferentId origins and governing validation declaration, consistently used at fact/key/rule/read/write boundaries | Reuse namespace 1002; no exposure identity copy or inferred ontology. |
| Rule identity/registry | AdaptationRuleId and registry/adaptation-rule entry using SemanticRegistryEntry | Wrapper alone owns RuleId and DefinitionVersion. |
| Rule record | Match, TargetStateFamilyId, TargetLeafFamilyId, KeyDerivation, Gate, Step | No Function, Resolution, KeyDerivationRuleId or StateTransitionFunctionId fields. |
| Rule variants | Exposure/Practice match; ExposureVariable/RegulatoryVariable/Load/Procedure derivation; Always/FrozenBaseline gate; AdaptationReadTarget | Closed E payloads only; no selector expressions or executor callbacks. |
| Accessors | adaptation-target-prior and adaptation-gate-prior, exact existing identity representation and qualification | Two fixed requirements; no per-rule accessor identity or persisted projection object. |
| V06 registration | Complete TransitionRegistrationV06, TransitionDefinitionV06 and AdaptationTransitionRegistrationExtension; rule set, exact admission and ingress | Preserve shared singleton/V04 versions; no host-side configuration table. |
| Capability | StateWrites with MutationAuthority and nonempty logical WritableFamilies | Preserve NoStateWrites and accepted write-check precedence. |
| Output production | AdaptationOutputProductionDefinition and exact dispatch/evaluation schema relations | C's existing production shape is unchanged. |
| Domain outputs | AAI, AdaptationDispatchRecord, AdaptationEvaluationResult; Absent/Present, five-way value sum, NoStateChange/StateChange | Reuse StatePatch and existing trace/read schemas; no redundant basis/time/transition fields. |
| Output identities | AutomaticAdaptationInputId, dispatch ID, evaluation ID; occurrence and reference roles | Reuse accepted allocator/OccurrenceIdentityRule. No derived IDs or parallel provenance. |
| D source records | AuthoredActualAdaptationFact, RegulatoryExposureFact, ProceduralPracticeFact, AuthoredAdaptationFactProducerDefinition | Exactly one AAI per source; counts are actual facts, not deltas. |
| D source bootstrap | Source event member, registry kind/member, InputOnly compiler/restore profile and V06 producer variant | No source certificate, source EventId payload field or replay-from-genesis restore. |
| D consequence bridge | Bridge singleton/Channels record, FixtureConsequenceObservationInput, fixture truth occurrence family and five fixture event members | Reuse accepted observation/SEM schemas and IDs; no AAI identity in observer evidence. |
| Settlement | AdaptationSettlementDefinition singleton, consumer set, exclusive phase policy and exact lifecycle | One common snapshot and atomic commit; phase 150 is not schedulable. |
| Failures | All flat members accumulated by B/C/D/E, exact owning checks and existing type-162 diagnostic | No generic error replacing accepted PRJ/WRT/REG meanings. |
| Model admission | Exact registry kinds, StableId families, DefinitionVersions, union manifests and relational validators | Unknown/mixed versions, orphan definitions and ambiguous ownership fail construction. |

Accepted prerequisite allocation inventories remain their owners' tables and must be incorporated
by reference in the eventual combined allocation sheet, not silently reallocated here.

## 4. Historical open-item list — resolved/superseded by packaging revision 1

1. Freeze the exact ExposureReferent qualification grammar and its single governed home. The
   existing role admits a semantic referent representation, not a settled exposure-origin policy.
2. Freeze LoadDomainDefinition and ProcedureDefinition fields, identity admission and domain
   resolution; specify a meaningful load unit representation without inventing conversions.
3. Freeze the LeafFamilyId definition record and exhaustive resolution to key/value schema,
   scale/domain source, baseline and removal, while consuming sole state ownership and REG.
4. Produce complete symbolic record/field/union/role tables for the checklist, including accessor
   identity qualification. A prose field name or generic typed-identifier capacity is insufficient.
5. Compose version ownership explicitly: E is accepted at 0.31-candidate; the overall main draft
   and unaccepted component declarations have not thereby become an accepted executable bundle.
   The final version matrix must preserve E's meaning and accepted V04/REG/PRJ/IDN versions.
6. Cross-check the entire combined inventory for duplicate identity domains, missing registry
   homes, uninhabited outputs, unused fields and unallocated prerequisites before assigning numbers.

No actual representational contradiction in E has been identified. These are remaining ADAPT
packaging obligations, not permission to redesign the accepted interpreter.

## 5. Gate accounting

AD-E1..13 are FROZEN IMPLEMENTATION GATE, NOT PASSED. Preserve AD-D1..15, AC-A..L, main ADAPT
controls, EVID-A..T and REG-A..R. F must attach codec/role/domain/registry/persistence vectors to
the final symbolic table; none is passed by this inventory. Corpus remains 0.26 / PHEN-ADAPT 1.10;
this bookkeeping inventory does not amend its phenomenon or claim a new corpus verdict.

This inventory is deliberately not marked complete packaging, final ADAPT shape acceptance,
permanent allocation readiness or implementation authorization.


2026-09-06 disposition: exposure qualification CLOSED (namespace-only); load/procedure domains
CLOSED (abstract IDs, no units); domain-only leaf definition CLOSED; symbolic tables written in
the linked packaging draft; version matrix CLOSED (0.31-candidate target, independent extension
versions preserved). The six closure audits are specified as the final pre-allocation gate, not
claimed passed. Accessor inspection found TypedIdentifierValue and fixture-only namespaces, not
an existing permanent accessor family; this missing allocation home remains explicit for review.


2026-09-06 accessor resolution: ProjectionAccessorId is a shared PRJ prerequisite allocation,
not an ADAPT family. Required members are ResolvedCharacterSubject, accessor/adaptation-target-prior
and accessor/adaptation-gate-prior. No accessor registry, DomainValidator or ProjectionRequirementId.
The prior missing-home finding above is resolved; no known identity-home gap remains.
PRJ-F-ACCESSOR-1/2 are frozen NOT PASSED. Final packaging/composition review remains before allocation.


2026-09-06 — [F packaging revision 3](ADAPT_001_PACKAGING_DRAFT.md) addresses the remaining
authoritative-state invariant: closed timeless scan of all five maps, strict present nonzero
domains and definition existence, separate REG-at-T pass, existing admission/state/write failure
carriers. AD-F7 added; AD-F1..7 and all inherited gates remain NOT PASSED. Text-ID grammar is
nonempty UTF-8 NFC, canonical equality and no aliases. V06 0.6-candidate spelling synchronized;
current main sequence and allocation ownership cleaned. Final ADAPT shape review is next; no
permanent allocation or implementation.


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
