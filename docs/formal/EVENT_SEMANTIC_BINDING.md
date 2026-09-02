# Event Semantic Binding and Recognition Boundary

**Status:** candidate Campaign 1 seam, version `semantic-binding/0.1-candidate`

**Decision owner:** `SEM-001`

**SeamId:** `seam/event-truth-to-pre-recognition-experience`

**Architecture edges:** observable world event → Perception / Attention → pre-recognition `SemanticExperience` → Recognition / Familiarity / Novelty

**Depends on:** accepted `content/0.2-candidate`, `substrate/0.2-candidate`, `ordering/0.2-candidate`, `state/0.2-candidate`, `trace/0.2-candidate`, and the bounded-measurement portion of accepted `observation/0.1-candidate`

**Supersedes:** no accepted general event-binding contract. The `PerceivedConceptToken` path in `observation/0.1-candidate` remains a restricted control and is not the general representation defined here.

## Semantic purpose

Preserve the semantic argument structure of a world event while projecting only what one observer could discriminate. The output describes character-accessible binding and typed classification evidence before recognition. It must support unfamiliar referents, partial classification, perceptual tracking, misrecognition, later correction, one referent in several roles, and different observers receiving different evidence without exposing simulator identity.

This seam distinguishes:

```text
the simulator bound person.glen to Companion

from

Mina perceived a person-like referent in the Companion role

from

Mina later hypothesized that referent was person.glen
```

It also distinguishes five semantic layers:

```text
World semantic classification
≠ event role in this occurrence
≠ observer-relative perceptual classification
≠ instance-recognition hypothesis
≠ character-relative appraisal
```

Perceptual classification, perceptual tracking, and instance recognition are independent. “This appears to be a metal object,” “this is the same object I was following,” and “this is object.lead_pipe” are three different claims with separate provenance.

## Required phenomena

- `PHEN-SEM-001` observer-relative event bindings and recognition boundary;
- the semantic-binding and identity portions of `PHEN-EPI-001`;
- later recognition, memory, social-belief, relationship, and reason fixtures that consume the shared referential grammar;
- replay and forbidden-read portions of `PHEN-DET-001`.

## Domain and codomain

Candidate truth-side records:

```text
WorldEventTruth = {
  EventId,
  EventTypeId,
  OccurredAt,
  EventBindings[]
}

EventBinding = {
  EventBindingId,
  EventRoleId,
  SemanticReferentId,
  Qualifiers[]
}

RegisteredSemanticFacetDefinition = {
  SemanticFacetId,
  ValueTypeId,
  ApplicabilityDomain,
  ReceivingSeamPermissions,
  DefinitionVersion
}
```

Each binding has its own identity. `SemanticReferentId` is a stable typed truth-side identity governed by content or runtime entity registries. It is not automatically character knowledge.

Candidate observation-side records:

```text
PerceivedBindingEvidence = {
  PerceivedBindingId,
  ObserverId,
  PerceptualReferentId,
  EventRoleEvidence,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

EventRoleEvidence = ExactEventRole(EventRoleId) | UnresolvedEventRole

PerceptualClassificationEvidence = {
  ClassificationEvidenceId,
  ExperienceId,
  ObserverId,
  PerceptualReferentId,
  SemanticFacetId,
  TypedPerceivedValue,
  SupportingObservationIds[],
  OccurredAt,
  TransformationVersion
}

PreRecognitionSemanticExperience = {
  ExperienceId,
  ObserverId,
  OccurredAt,
  PerceivedBindings[],
  PerceptualClassifications[],
  SupportingObservationIds[],
  TransformationVersion
}
```

`SupportingObservationIds` refer to permitted character-accessible evidence such as a bounded measurement. Scalar measurement is not mandatory for every binding and is never collapsed into referent identity or role evidence.

`PerceptualClassificationEvidence` is a positive or explicitly typed-value assertion about appearance, not an unrestricted string tag. Absence of a classification is unknown, not false. An explicit boolean-false observation is a present typed assertion. `SemanticFacetId` resolves through a governed definition that fixes the value type and permitted receiving seams. The initial fixture uses a small registered vocabulary sufficient to distinguish person-like, object-like, interior-space-like, metal-like, long-like, and blunt-like appearance. Full ontology inheritance, facet implication, affordance closure, and world-simulation consumption belong to `ONT-001`, not this contract.

Recognition is a downstream seam. Its minimum required shape is a frozen hypothesis record that refers to, but does not replace, a `PerceptualReferentId`:

```text
RecognitionHypothesis = {
  HypothesisId,
  ObserverId,
  PerceptualReferentId,
  CandidateSemanticReferentId,
  EvidenceBasisIds[],
  OccurredAt,
  RecognitionVersion
}
```

The exact uncertainty representation and recognition update mathematics are not selected by this candidate.

No permanent numeric record type, role, or enum IDs are allocated while `SEM-001` remains open.

## Units, ranges, and applicability

Bindings and classification assertions are symbolic and exact. `EventBindingId`, `PerceivedBindingId`, `ClassificationEvidenceId`, and `PerceptualReferentId` have stable typed identity within their declared scope. Every perceived facet value must match its registered semantic type exactly. The initial fixture covers persons, actions, locations, and instruments with exact-or-unresolved perceived event roles and a finite registered classification vocabulary. Probabilistic classification, continuous sensory geometry, language understanding, ontology inheritance, and recognition confidence are outside version 0.1 unless later specified exactly.

## Registered ReadDomain and capability-limited projection

The truth-to-perception compiler may read only the named world event, observer-specific sensor/attention inputs, registered observation affordances, registered semantic-facet definitions, and supporting permitted measurements. It may not copy a truth-side semantic fact merely because it is registered, and it may not read the observer's memories, beliefs, person model, recognition result, or appraisal while constructing pre-recognition experience.

Recognition consumes `SemanticExperience`, retained character state, and its own registered evidence projection. It cannot read truth-side `SemanticReferentId` or `EventBinding` merely because the omniscient trace can.

## Actual-read recording and derived-input provenance

The omniscient committed trace records exact truth bindings, actual observation reads, the output perceived-binding records, and their structural derivation. Character-accessible evidence records contain only observer-safe evidence identities.

An opaque truth identifier is not automatically safe. Equality, reuse, ordering, or cardinality of an opaque handle can reveal hidden linkage. A truth-side source binding therefore remains in trace rather than the character payload unless a later contract proves that every observable property of the handle is permitted evidence.

## Authoritative StatePatch writes and sole MutationAuthorityId

The initial projection writes no persistent belief, memory, relationship, or identity state. It emits immutable event-local `PerceivedBindingEvidence` and `SemanticExperience`. Recognition and later encoding own separate state transitions and mutation authorities.

Allocation of perceptual tracks or persistent observer-relative referents, if authoritative state is required, must name one sole authority before implementation.

## Epistemic permissions and forbidden knowledge

Permitted before recognition:

- a stable perceptual referent scoped by the accepted allocation rule;
- exact or unresolved event-role evidence supported by observation;
- typed perceptual-classification evidence supported by observation;
- permitted sensory/measurement evidence references;
- observer, time, and transformation identity.

Forbidden before recognition:

- truth-side `SemanticReferentId` solely because the simulator knows it;
- hidden event bindings or truth-side causal classifications;
- character-relative `Cause`, `Instrument`, or other causal-role claims unsupported by permitted evidence;
- linkable truth handles whose equality reveals hidden identity;
- truth-side semantic classifications that were not perceptually established;
- unrestricted freeform tags or facet values that violate their registered type;
- authored character-relative meaning, appraisal, trust, salience, or psychological value;
- authoritative prose or an LLM interpretation.

A direct symbolic identity may cross only through a separately registered channel whose observable signal itself establishes that identity. This is a named special case, not the default visual-perception rule.

## Preconditions

- every truth binding has a unique `EventBindingId`;
- event roles and referents resolve through governed registries;
- every semantic facet resolves to a governed definition with an exact value type and receiving-seam permissions;
- role multiplicity and qualifier rules are declared by the event type;
- observer-specific observation affordances are registered;
- all supporting observation records satisfy their own accepted contracts;
- character-relative causal roles cite only permitted evidence.

## Totality, typed failures, instant rollback, and failed-run behavior

Unknown registry references, duplicate binding/classification IDs, illegal role multiplicity, forged perceptual IDs, hidden truth IDs or unobserved truth facets in character output, unresolved allocator semantics, illegal source links, wrong-typed or freeform facet values, unsupported causal-role derivation, and noncanonical collections fail before emission. The accepted whole-instant transaction rolls back state, queue, allocators, trace, and outputs.

## Exact transformation

For each truth binding, the registered observation mechanism independently determines whether any binding evidence is available. A visible binding creates a new `PerceivedBindingId` and points to a `PerceptualReferentId`; it never copies the truth referent by default. Role evidence is emitted only to the precision supported by the observation mechanism.

The same observation mechanism independently emits zero or more typed perceptual-classification assertions about that perceptual referent. Each assertion must descend from permitted sensory/measurement inputs and a registered facet definition. World semantic facts may constrain what evidence could be produced, but they are not themselves the output and may not bypass observation.

Tracking answers whether two perceptual records concern the same observer-relative perceived instance. Classification answers what that instance appears to be. Neither operation resolves the truth identity. Intervening on classification while holding the track fixed, or on track continuity while holding classification fixed, must remain representable.

The compiler preserves distinct binding occurrences. It does not deduplicate by referent. The same perceptual referent may therefore occupy several observed roles, and two bindings with the same referent and different roles remain structurally different.

Truth-side `EventRole` is descriptive event argument structure. Truth-side or character-relative `CausalRole` is a separate analytical classification. Deriving either causal role cannot erase the event role, and character-relative causal-role derivation may use only permitted evidence.

`SemanticExperience` collects the observer's canonical perceived bindings, typed perceptual classifications, and supporting measurements. Recognition later attaches hypotheses to perceptual referents. It never replaces a perceptual referent, turns classification into identity, or rewrites an earlier experience.

Semantic classification may expand applicability and later inference, but it cannot directly emit appraisal, affect, motive, psychological pressure, or a Reason. The legal path remains classification evidence → belief/context/memory/person model → appraisal → affect/motive/Reason.

## Random addresses and distribution mapping

Not applicable to the initial exact projection. Any stochastic detection, role inference, or recognition candidate requires an addressed-random extension with an explicit distribution and coupling contract.

## Quantization and rounding points

None in the initial symbolic projection. Numeric supporting observations retain their own quantization and precision contracts.

## Canonical collection ordering and tie rules

- world bindings sort by canonical `EventBindingId`;
- perceived bindings sort by canonical `PerceivedBindingId`;
- perceptual classifications sort by canonical `ClassificationEvidenceId`;
- supporting evidence IDs sort canonically and are duplicate-free;
- one referent in several roles is not a duplicate;
- exact role evidence and unresolved role evidence are distinct sum variants;
- presentation-template order never controls authoritative collection order.

## Event phase and timing semantics

World event truth precedes observation. Pre-recognition `SemanticExperience` commits before any recognition event that consumes it. Recognition hypotheses commit in a later registered phase. Later correction creates a new hypothesis/belief transition and cannot mutate the original perceived binding or contemporaneous hypothesis.

Exact event-observation, experience, and recognition phase IDs remain unresolved under `SEM-001`; implementation is blocked until that accepted phase map exists. `ORD-001` remains separately responsible for whether a later belief update may consume recognition within the same event.

## Postconditions

- no unobserved binding appears in character evidence;
- no unrecognized truth referent appears by default;
- every perceived binding has a unique identity and one perceptual referent;
- every classification assertion refers to a perceived referent and a registered typed facet;
- multiple bindings may share a perceptual referent without collapsing;
- tracking, classification, and recognition can vary independently;
- every character-accessible field descends from permitted reads;
- recognition output refers back to immutable perceptual evidence;
- later recognition correction leaves prior records structurally unchanged.

## Invariants

1. Visibility is binding-specific, not merely slot-family-wide.
2. Visible does not imply recognized.
3. Referent identity is not binding identity.
4. `EventRoleId` and `CausalRoleId` are distinct typed namespaces.
5. Event-role preservation precedes optional causal-role derivation.
6. Character-relative causal roles cannot descend from hidden bindings.
7. Truth-reference equality cannot become an unintended side channel.
8. Original perception and contemporaneous recognition are historical facts.
9. Presentation strings are derived views, never authoritative meaning.
10. World classification, perceptual classification, recognition, and appraisal are separate records and transformations.
11. Missing classification evidence is not a negative classification.
12. Semantic classification cannot write or directly emit psychological pressure.

## Trace records and provenance

The omniscient trace may join truth event, truth semantic facts, truth binding, observation operation, perceptual track, perceived classification, perceived binding, experience, and recognition hypothesis. That join capability is not granted to character cognition. Research/UI views must declare one of three viewpoints:

- omniscient truth;
- contemporaneous character-relative perception/recognition;
- current reinterpretation using later belief.

Views never mutate their source records. `TRC-003` still governs privacy-safe external tool projections; `SEM-001` independently governs what the character simulation may read.

## Candidate mechanisms and control implementations

- **Candidate:** binding-specific observation with observer-scoped perceptual referents and pre-recognition experience.
- **Classification candidate:** governed typed facet assertions supported by permitted observation, with no inheritance or implication engine in version 0.1.
- **Restricted control:** `PerceivedConceptToken = (ConceptId, CausalRoleId, VisibleProvenanceSlotId)` from `observation/0.1-candidate`, allowed only where the channel itself establishes identity and one winning causal role is sufficient.
- **Historical control:** truth-side `EffectProvenance → WorldEventDescriptor → SemanticExperience`, with full truth provenance removed from character output.
- **Rendering projection:** deterministic templates over truth, contemporaneous, or current-interpretation views.

## Competing models / ablations

- `TruthIdentityCopy`: copies `person.glen` into perception because Glen is visible.
- `ReferentKeyedBinding`: uses referent identity as the binding key and collapses multi-role events.
- `SlotWideVisibility`: reveals or hides every binding in a provenance slot together.
- `EventRoleEqualsCausalRole`: replaces semantic event participation with salience-oriented causal classification.
- `OpaqueButLinkableTruthHandle`: hides fields but exposes stable equality of secret sources.
- `RecognitionRewrite`: replaces perceptual referents or rewrites earlier experience after correction.
- `TruthFacetCopy`: copies registered world semantics into perception without sensory support.
- `FreeformTagBag`: admits unregistered strings or mixed-typed facet values.
- `ClassificationToPressure`: turns a semantic classification directly into motive, affect, or Reason.
- `AuthoritativeProse`: stores a sentence as the only event meaning.

## Equivalence relation and tolerances

All initial comparisons are exact canonical structural comparisons. There is no fuzzy string, embedding, or display tolerance. Two observers may intentionally differ only at fields descending from their differing permitted observations or later character state.

## Proof obligations and executable tests

The required vectors are specified in [Campaign 1 semantic-binding conformance vectors](CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md). At minimum they cover role permutation, multi-role identity, binding-specific visibility, independent tracking/classification/recognition, typed classification, unresolved identity, recognition/misrecognition, immutable correction, safe provenance, separate role vocabularies, causal-role epistemics, no classification-to-pressure shortcut, deterministic rendering, replay, and rollback.

## Applicable Campaign 0 conformance vectors

Canonical encoding/identity, governed registries, ordering, allocation, transaction rollback, read-domain enforcement, trace, save/load, and first-divergence controls remain mandatory.

## Known domain exclusions

Continuous vision, feature extraction, face recognition mathematics, probabilistic classification or identity confidence, linguistic parsing, deception inference, disguises as a physical simulation, cross-modal fusion, full ontology inheritance/facet implication, general affordance closure, long-lived object tracking, and UI authorization are not accepted in version 0.1. The representation must leave room for them without granting truth identity or truth classification early.

## Unresolved decisions

- `SEM-001`: final record shapes, perceptual-referent allocation/scope, event-role registry and multiplicity rules, minimal typed perceptual-facet vocabulary, exact phase placement, observer-safe provenance/linkability policy, and the minimum recognition-hypothesis contract.
- `ONT-001`: full typed world ontology, inheritance/facet implication, affordance rules, and non-cognitive world consumers. It must remain compatible with this contract but does not block the finite `SEM-001` fixture vocabulary.
- `TRC-003`: privacy-safe researcher and UI projections; this does not relax the stricter character-access rule here.

## Reopen conditions

After acceptance, reopen on any event-role vocabulary, binding multiplicity, perceptual identity scope, semantic-facet value grammar, classification evidence, recognition ordering, direct-identity channel, provenance-linkability, causal-role derivation, rendering viewpoint, or epistemic-access change; or if a required fixture cannot express unknown classification or mistaken identity without truth leakage.

## Change history

- 2026-09-01: candidate opened after discovering that visibility of a truth-side referent does not establish character recognition; separated event roles, causal roles, perceptual referents, truth identities, and recognition hypotheses.
- 2026-09-01: added typed perceptual classification as a layer independent of tracking, recognition, and appraisal; reserved the full world ontology and affordance system for `ONT-001`.
