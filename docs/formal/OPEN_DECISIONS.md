# Formal Open-Decision Register

**Status:** active blocking register

Open decisions are not ordinary TODOs. If a row can affect an authoritative result, every dependent seam remains blocked until the target contract accepts a resolution and its proof tests.

## Priority meanings

| Priority | Meaning |
|---|---|
| `P0` | Blocks the active substrate or earliest vertical causal slice. Resolve in its named owner campaign before affected implementation. |
| `P1` | Blocks a named near-term seam/campaign but not the entire scaffold shell. |
| `P2` | Known formal limitation that may remain isolated until its dependent mechanism is scheduled. |

**`SEM-001` is closed** (2026-09-04), by `SEM-001J` below. It no longer blocks; the seams it was
blocking are unblocked to the exact scope that acceptance proves, and no further.

## Register

| Decision | Priority | Formal owner | Blocks | Target disposition |
|---|---|---|---|---|
| `C2-TRACE-001` first-profile trace binding | `CLOSED (shape/commitment)` | trace / Campaign-2 factory | qualification remains; wrapper implementation authorized | Both members, trace profile, RulesVersion 0.2 and replacement ModelIdentity frozen. TRACE-C2-M COMPONENT / MATERIALIZATION PASS. Canonical wrappers implemented for 0.2 only; see CAMPAIGN2_TRACE_IMPLEMENTATION.md for scoped evidence. No global trace/VAL/FCT/PHEN pass. |
| `C2-MODEL-PACK-001` first-model manifest composition | `CLOSED` | campaign2-registry/0.1-candidate + campaign2-parameters/0.1-candidate | concrete model freeze satisfied; FCT-5 unblocked to begin | Both version authorities anchored; seven artifacts frozen unchanged after MODEL-BYTE-A PASS. See CAMPAIGN2_FIRST_MODEL_BYTE_REVIEW.md and formal BOUNDED_NUMERIC_PROFILE.md. |
| `C2-OBS-UNIT-001` bridge unit identity | `CLOSED` | observation-unit-identity/0.1-candidate | allocation and component enforcement complete | Namespace 1039 and exact unit/fixture-pulse member permanently frozen at observation-unit-allocation/0.1-candidate; 77 allocation checks PASS. OBS-UNIT component evidence in CAMPAIGN2_OBSERVATION_UNIT_IMPLEMENTATION.md; no factory or phenomenon qualification inferred. |
| `C2-BRIDGE-OBS-001` fixed bridge observation provenance | `CLOSED` | authored-fact-observation/0.1-candidate | accepted with sole-occurrence clarification; implementation authorized | private raw candidate; projected type 203 is sole authoritative observation; no allocation; see CAMPAIGN2_BRIDGE_OBSERVATION_DECISION.md |
| `C2-INPUT-ENC-001` ordered-input entry bytes | `CLOSED` | campaign2-ordered-input/0.1-candidate | accepted five-item positional list; no allocation | implementation authorized; concrete RulesVersion/profile binding required before FCT-5; see CAMPAIGN2_ORDERED_INPUT_ENCODING_DECISION.md |
| `ORD-001` immediate belief timing | `P1` | ordering / belief seam | belief use within the same event | accepted belief-event phase map before belief campaign |
| `ORD-002` simultaneous multi-character ordering | `P1` | ordering / interaction seam | multi-character fixtures and social observation | accepted interaction ordering before first multi-character fixture |
| `ORD-005` appraisal-regulation feedback boundary | `P1` | ordering/regulation seam | regulatory campaigns and current-vs-later affect semantics | accepted phase mapping before regulation campaign |
| `TRC-003` privacy-safe trace projections | `P1` | trace/epistemic seam | researcher/UI views without cognitive leakage | accepted projection schema passing forbidden-read audit |
| `TRC-004` causal-overlap provenance | `P1` | trace/reason consolidation | port of aggregate evidence coverage | accepted evidence-basis contract passing collective-redundancy fixture |
| `DEC-001` authorship/identity qualification | `P1` | decision-expression and identity seam / Campaign 2 | retained dice-to-identity feedback and roll-boundary migration | accepted qualification contract covering contest, significance, cost, coercion, intervention, resolution mode, roll occurrence, and `AuthorshipPotential`, passing `PHEN-DECISION-001` and `PHEN-BIO-001` |
| `ADAPT-001` automatic adaptation input | `P1` | state/adaptation seam / Campaign 2 | whole-contract shape accepted 2026-09-06 at adaptation-input/0.31-candidate; allocation unblocked, implementation/proof pending; row remains OPEN | accepted typed adaptation-input and mutation-authority contract passing `PHEN-ADAPT-001` |
| `VAL-001` committable governed executables | `P1` | substrate validation / cross-campaign | shape accepted 2026-09-06 at governed-execution/0.1-candidate; formal closure/qualification pending; canonical implementation activation for any new governed executable, including the `CONTENT-001` character-kind validator | accepted rule for which executable functions may affect model construction, canonical validity, or transition-visible semantics, and how their executable meaning is committed to `ModelIdentity`: same governed declaration and same `ModelIdentity` → same executable semantics, and changed executable semantics → changed `ModelIdentity`. No anonymous callback may decide canonical admissibility, domain qualification, semantic projection, rule applicability, or state-transition meaning unless its complete behaviour derives from committed governed data. Prerequisite of canonical reliance on a `CONTENT-001` character-kind validator in built fixtures; does not block `IDN-001` shape acceptance, `EVID-001` or `REG-001` drafting, or Campaign 2 **F** allocation |
| `C2-PERSIST-001` exact Campaign-2 save metadata | `P1` | persistence / factory activation | SHAPE ACCEPTED at campaign2-persistence/0.1-candidate; concrete profile binding and implementation qualification pending before authoritative activation | accepted profile with exact source/traversal/grammar for save fields 8/9/10, identity-bearing profile binding and persistence qualification; no VAL or other accepted seam reopening |
| `MATH-002` quadratic coefficient convention | `P2` | signal-field candidate seam | signal-field comparison only | choose polynomial/matrix convention in candidate seam and add equivalence vectors |
| `MATH-003` quadratic variance distribution assumptions | `P2` | signal-field candidate seam | uncertainty-bearing signal fields | declare distribution/fourth moments or reject closed-form candidate |
| `MATH-004` covariance validity under quantization | `P1` | belief representation campaign | fixed-point covariance/Kalman candidate | PSD-preserving representation/projection proof before candidate use |
| `ONT-001` typed semantic ontology and facet inference | `P1` | content/ontology seam | generalized inheritance, facet implication, affordance closure, and shared non-cognitive world querying | accept typed facet/predicate schemas, inference and conflict rules, applicability, versioning, and a proof that character-relative appraisal cannot enter world truth; does not block finite `SEM-001` fixture facets |

## Resolution record

Closing a row requires:

- exact decision and alternatives considered;
- affected document/version changes;
- declared domain and failure behavior;
- proof or error/bias bound;
- conformance and adversarial tests;
- corpus entries rerun;
- migration/reopen conditions.

The register is updated in the same change that accepts the governing contract. A row is never closed merely because code selected a default.

## Closed Campaign 1 decisions — 2026-09-01

### Accepted `SEM-001` subdecision — `SEM-001A` (2026-09-02)

- **Decision:** a `PerceptualReferentId` identifies one observer-relative perceptual continuant-file currently treated by perception as continuous; it makes no claim that truth-side identity is continuous or even unchanged, nor whether the continuant is a person, discrete object, place, spatial region, or another kind. This carrier-domain clarification replaced the narrower term “object-file” without changing tracking semantics. Allocation is independently monotonic per observer, persisted, and never reused. `PerceptualTrackTransition` records an observer-side detection and exact `NewTrack` or `ContinuesPriorTrack` result derived only from permitted sensory information. Recognition may associate several tracks with one candidate but never merges or rewrites tracks. Numeric track ordinals are opaque and psychologically meaningless.
- **Alternatives considered:** truth-identity tracking, automatic truth correction, one global cross-observer allocation sequence, recognition-driven track merging, ordinal-derived salience/similarity, and speculative tracking confidence. All are rejected for this candidate.
- **Domain/failure:** deterministic binary continuity over permitted observer-side detections and supporting observations. Wrong-observer, reused, nonmonotonic, forged, or truth-derived transitions fail the complete instant and restore the observer-scoped allocator. Uncertain continuity and cross-modal fusion remain outside `SEM-001A`.
- **Proof plan:** `CV-SEM-013` and `CV-SEM-019..022`, including false continuity, false discontinuity, inter-observer allocation independence, save/load/replay, no automatic truth repair, and ordinal-opacity controls in the current `PHEN-SEM-001` fixture.
- **Reopen:** required phenomena demand uncertain continuity, mutable track joining/splitting, cross-modal identity fusion, a different persisted observer allocation lifecycle, or semantic use of identity ordinals. The parent `SEM-001` remains open for permanent record shapes/IDs and integration; later subdecisions fixed roles, facets, recognition, provenance, and phase placement.

### Accepted `SEM-001` subdecision — `SEM-001B` (2026-09-02)

- **Decision:** an `EventBindingId` is a run-scoped immutable occurrence allocated by the accepted runtime allocator, independent of role/referent/position and psychologically opaque. The initial roles are `Action`, `Actor`, `Companion`, `Target`, `Recipient`, `Instrument`, `AffectedEntity`, `Beneficiary`, `Participant`, and `Location`; generic `Context` is excluded. Each event type declares role cardinality and may narrow, never widen, the role's broad referent domain. Same-event `(EventRoleId, SemanticReferentId)` pairs are unique. Version 0.1 has no binding qualifiers. Truth role specificity crosses observation only through permitted `EventRoleEvidence` and may instead be coarsened, unresolved, or omitted.
- **Alternatives considered:** referent-keyed or role-keyed bindings, global role cardinalities, generic `Context`, freeform qualifiers, duplicate opaque occurrences, role/referent/position-derived IDs, role ordinals as priority, causal/event-role collapse, domain widening, redundant fixed-action bindings, and visibility-implies-truth-role. All are rejected.
- **Domain/failure:** finite governed role vocabulary, independent per-role min/max cardinality, optional event-type narrowing, exact pair uniqueness, and preserve/coarsen/unresolved/omit role observation. Invalid role, domain, cardinality, canonical order, duplicate pair, qualifier, or redundant action fails before allocation; later transactional failures restore allocations through the accepted substrate.
- **Proof:** executable `CV-SEM-023..030` in `src/test/eventBindings.test.ts`, including multi-role and repeatable-role preservation, strike/drink domain narrowing, construction-order replay, shifted opaque ordinals, registry separation, four-way epistemic projection, and negative closure controls.
- **Reopen:** a phenomenon requires generic contextual linkage, repeated identical pairs with governed meaning, typed qualifiers/subevents/counts, cross-role constraints, a broader role vocabulary, event-type domain widening, or another occurrence-identity scope. The parent `SEM-001` remains open for permanent record shapes/IDs and integration; later subdecisions fixed facets, recognition, provenance, and phase placement.

### Accepted `SEM-001` subdecision — `SEM-001C` (2026-09-02)

- **Decision:** `PerceptualEventReferentId` identifies one observer-relative perceptual occurrence/event-file currently treated as continuous and groups the perceived role bindings assigned to that occurrence. It is distinct from continuant-file and experience identities. Segmentation deterministically emits `NewEventFile` or `ContinuesPriorEventFile` from permitted observer-side event detections and may objectively false-merge or false-split truth events. Allocation is independently monotonic per observer, persisted, never reused, transactional, and ordinal-opaque. Truth `Action` cannot copy into character evidence or bind a continuant-file as its carrier.
- **Alternatives considered:** equating experience with event-file, truth-event-keyed segmentation, automatic truth correction, ungrouped perceived-role bags, continuant-file Action identity, a global cross-observer allocator, event ordinals as psychological magnitude, and truth Action copy. All are rejected.
- **Domain/failure:** deterministic binary event-file start/continue plus explicit end, event-grouped perceived continuant-role bindings, and many-to-many experience/event-file membership over permitted observer evidence. Cross-observer references, inactive continuation/end, truth-like fields, noncanonical support, duplicate event/continuant/role bindings, and continuant-file Action bindings fail structurally; later instant failure restores event-file and allocator state.
- **Proof:** executable `CV-SEM-031..040` in `src/test/perceptualEventFiles.test.ts`, including simultaneous grouping, persistence across experiences, false merge/split, truth-input closure, Action-carrier closure, concurrent participation, observer-isolated save/load/replay, ordinal opacity, and scheduler rollback.
- **Reopen:** required phenomena need probabilistic segmentation, hierarchical/nested events, mutable event-file merge/split, cross-modal event identity, reuse or a different allocation lifecycle, semantic event ordinals, or a different continuant/event/experience identity relation. The parent `SEM-001` remains open for permanent record shapes/IDs and integration.

### Accepted `SEM-001` subdecision — `SEM-001D` (2026-09-02)

- **Decision:** truth and perceptual facets occupy separate namespaces. `PerceptualReferentId` carries continuants while `PerceptualEventReferentId` is invalid for continuant facets. The initial independent facets are `AppearsPersonLike`, `AppearsDiscreteObjectLike`, `AppearsInteriorSpaceLike`, `AppearsMetallic`, `AppearsElongated`, and `AppearsBlunt`. Stored values are exact booleans; derivations return `NoAssertion | Assert(BooleanValue)`. Feature-observation absence and explicit false are distinct. Every model has exactly one authoritative rule per facet. Consumer permission resides in seam emission and capability-limited read domains, not facet definitions.
- **Alternatives considered:** shared truth/perceptual facet identity, event-file continuant facets, `AppearsObjectLike`, stored Unknown, missing-as-false at either layer, overlapping simultaneous facet authorities, facet-owned consumer lists, freeform tags, category strings, exclusive primary kinds, prose/LLM classifiers, classification-to-identity, and classification-to-pressure. All are rejected.
- **Domain/failure:** finite controlled observer-side boolean feature observations and six continuant appearance facets. Invalid carrier, namespace, value, support, rule result, authority cardinality, duplicate assertion, truth-like field, or emission target fails before authoritative commit; later transactional failure restores runtime allocation.
- **Proof:** executable `CV-SEM-041..050` in `src/test/perceptualClassification.test.ts`, including carrier separation, hidden-truth invariance, optional output, feature missing/false, exact value grammar, provenance closure, sole authority with competing-model control, assertion uniqueness, replay/ordinal opacity/rollback, and emission/read-boundary controls.
- **Reopen:** a required phenomenon needs graded/probabilistic/categorical values, explicit ambiguity, multiple simultaneous classifiers, a governed aggregation or provably disjoint rule-domain system, another continuant kind, nonvisual fixture domains, or facet-specific disclosure beyond ordinary read capabilities. The parent `SEM-001` remains open for permanent record shapes/IDs and integration.

### Accepted `SEM-001` subdecision — `SEM-001E` (2026-09-02)

- **Decision:** one observer-relative `PerceptualEventReferentId` carries independent boolean event-pattern facets `AppearsRepetitiveMotionLike`, `AppearsCoupledMultiContinuantMotionLike`, and `AppearsRopeSkippingPatternLike`. These predicates are neither truth Action/EventType identity nor learned action-schema recognition. The rope-skipping-pattern rule is the exact conjunction of three definitionally necessary, same-observer/event-file/detection-window features; missing is unresolved and any scoped explicit false produces immutable negative evidence. Event-pattern and role inference remain independently intervenable. Truth Action semantics project through permitted event features to the event-file, never through a fabricated continuant `Action` binding. Evidence is append-only across experiences and false merge/split.
- **Alternatives considered:** direct truth Action/EventType copy, historical `SemanticExperience.action`, `AppearsCoordinatedObjectUseLike`, fabricated action continuants, implicit facet hierarchy, detector silence as false, cross-window negatives, event classification as learned action identity, role-derived action meaning, mutable historical reinterpretation, prose/LLM classifiers, and direct psychological/output bypass. All are rejected.
- **Domain/failure:** five finite observer-side boolean event features and three finite event-pattern facets. Wrong carrier/observer/event/window, truth-like fields, noncanonical support, missing/duplicate authority, invalid rule result, false without explicit negative evidence, duplicate same-experience assertion, or forbidden emission target fails before commit; later transactional failure restores runtime allocation.
- **Proof:** executable `CV-SEM-051..060` in `src/test/perceptualEventClassification.test.ts`, including carrier/namespace separation, hidden-truth invariance, exact conjunction, independent coarse facets, scoped negative evidence, false merge/split history, append-only uniqueness, sole authority/competing models, typed provenance, replay/ordinal opacity/rollback, and concrete pre-recognition experience-envelope integration.
- **Reopen:** a required phenomenon needs graded/probabilistic event classification, suggestive rather than necessary conjunction inputs, governed facet implication, multiple simultaneous event classifiers or aggregation, cross-window feature integration, hierarchical/nested events, learned action schemas inside perception, another event-feature vocabulary, or a different Action projection route. The parent `SEM-001` remains open for permanent record shapes/IDs and the integrated gate.

### Accepted `SEM-001` subdecision — `SEM-001F` (2026-09-02)

- **Decision:** continuant-instance recognition considers only candidates in an observer-owned catalog. Typed same-experience supports and contradictions feed the exact `UniqueUncontradictedSupport` rule. Every attempt emits trace-side `RecognitionEvaluation`; only categorical state changes append `RecognitionResolutionRecord` as `AssertedCandidate` or `Withdrawn`. A unique different candidate replaces the current resolution; explicit contradiction of the current candidate without a unique replacement withdraws it; cue absence and same-candidate evidence are `NoUpdate`. Identity claims require an observer-owned symbol→candidate mapping. Candidate-domain metadata never truth-filters the track. Recognition remains separate from event/action-schema recognition and downstream belief or appraisal.
- **Alternatives considered:** stored Unknown/Ambiguous identities, hypothesis-only chains without withdrawal, cue absence as withdrawal, repeated same-candidate resolutions, direct identity-claim injection, self-authenticating name tags, truth-kind candidate filtering, catalog-order ties, confidence/ranking, truth correctness fields, event/action recognition, track repair, and direct downstream mutation. All are rejected.
- **Domain/failure:** finite seeded observer candidate catalogs, retained-template and mapped-identity-claim cues, exact support/contradiction polarity, continuant-file carriers, and append-only nonbranching resolution chains. Unknown/mismatched catalog/template/mapping/evidence, cross-observer/track/window input, truth-like fields, noncanonical collections, missing/duplicate authority, invalid rule result, event carrier, illegal revision, or forbidden target fails before commit; later staged failure restores allocation.
- **Proof:** executable `CV-SEM-061..070` in `src/test/recognition.test.ts`, also closing parent `CV-SEM-004..006`, `CV-SEM-016`, and the recognition portion of `CV-SEM-020`. Controls cover unfamiliar/ambiguous traceability, correct and categorical misrecognition over equal perception, unique support, mapped claims, no truth-kind filtering, replace/withdraw/no-update, false continuity/discontinuity, evidence closure, competing models, ordinal opacity, replay/history/rollback, and output boundaries.
- **Reopen:** a required phenomenon needs tentative versus committed recognition, calibrated confidence, withdrawal from ambiguity without explicit contradiction, candidate ranking, persistent cognition of ambiguity, recognition-template learning/forgetting, self-authenticating identity channels, cross-window cue integration, event/action-schema recognition, cross-modal recognition, resolution branching, or direct recognition-driven persistent-state mutation. The parent `SEM-001` remains open for permanent record shapes/IDs and the integrated gate.

### Accepted `SEM-001` subdecision — `SEM-001G` (2026-09-02)

- **Decision:** evidence is a relation between an authoritative observer-safe record, a consuming transition, and that transition's exact typed `ReadDomain`; character-accessible never means universally admissible. Character references use a closed tagged union and exact schema/producing-seam admission. Semantic/co-reference identities, observer-safe occurrence identities, and trace-only truth identities remain distinct. Equality is information: truth-derived handles never become safe through opacity, hashing, encryption, or renaming. Version 0.1 references are strictly same-observer, future-safe, scope/carrier checked, and ordinal-opaque. Character provenance is constructed separately from omniscient ancestry and exposes no generic trace traversal. A governed nonrecursive causal-role rule derives zero or more observer-relative analytical claims from admitted perceived-binding evidence without mutating event roles.
- **Alternatives considered:** record-level `IsEvidence`, universally readable character state, generic evidence IDs/maps, ID-type-only safety, cross-observer direct provenance, opaque/hashed truth handles, hidden common-ancestor equality, occurrence reuse as semantic grouping, global visibility/hidden bits, one shared confidence scalar, direct distance bonuses, missing-as-negative evidence, character trace queries, winner-takes-all causal roles, recursive causal evidence, truth-causal-role copy, classification-to-pressure, and unrestricted legacy concept tokens. All are rejected.
- **Domain/failure:** finite symbolic observer-side evidence-reference classes; exact schema/seam, same-observer, no-future, temporal/window, modality, feature, carrier, and `ReadDomain` validation; exact categorical fixture evidence; one causal-role authority for one continuant in one observer-relative event. Unknown/generic/unadmitted/forged/secret-linked, cross-scope, cross-observer, future, recursive, duplicate, noncanonical, or forbidden consumer references abort the complete instant and restore allocation. Physical distance/lighting/occlusion production formulas and graded evidence mathematics remain in their owning future observation seams.
- **Proof:** executable `CV-SEM-071..080` in `src/test/evidenceProvenance.test.ts`, covering closed references, schema admission, secret-handle closure, relational admissibility, explicit versus hidden linkability, false-discontinuity isolation, ordinal opacity, missing/present evidence, versioned bounded-quality compatibility, interpretation-ladder read boundaries, multi-role causal derivation, sole authority, replay, and rollback.
- **Reopen:** a required phenomenon needs direct cross-observer evidence ownership, character-visible truth ancestry, causal-role recursion or event→event causality, a new evidence-reference class, historical reuse outside a retained representation, a different causal-role multiplicity rule, or a quality representation that cannot remain proposition-local. The parent `SEM-001` remains open for permanent schemas/IDs and the integrated gate; exact phase placement is fixed by `SEM-001H`.

### Accepted `SEM-001` subdecision — `SEM-001H` (2026-09-02)

- **Decision:** accept two exact perception/recognition lanes under `ordering-phases/2-candidate`: current phases 10–15, 20–21 and consequence phases 120–127 after phase-110 outcome, followed by character-relative evaluation at 130. Each lane has a strict truth-availability cutoff. Lane admission reserves `ExperienceId` only when character evidence will emit; every successful reservation has exactly one frozen/staged envelope. Causal-role evidence is a phase-15/125 companion record. Phase 20/126 freezes recognition inputs evaluated at 21/127. Phase 130 cannot read authoritative outcome truth, and truth-side adaptation remains separate. Phase 150 is a non-schedulable settlement sentinel. Ordering before phase 30 grants no belief read permission; `ORD-001` remains open.
- **Alternatives considered:** one observation lane with backward consequence recognition, truth retroactively reopening a lane, unconditional/orphan experience allocation, mutable/incremental experience envelopes, causal roles inside the envelope, unfrozen recognition reads, phase-130 truth outcome consumption, adaptation as character learning, classifier same-phase cross-reads, schedulable phase-150 events, and treating ordering as belief authorization. All are rejected.
- **Domain/failure:** exact symbolic current/consequence event-semantic fixture; conditional run-scoped experience reservation; canonical same-phase classifier work; immutable recognition input; no ordinary event at settlement sentinel. Wrong phase, late truth, backward scheduling, orphan/duplicate/shared-lane envelope identity, noncanonical classifier work, mutable/mismatched recognition input, hidden outcome read, adaptation-route collapse, or barrier scheduling fails the complete instant and restores allocations/trace/output.
- **Proof:** executable `CV-SEM-081..090` in `src/test/semanticPhaseOrdering.test.ts`, plus the accepted scheduler causal-order and transaction vectors. The phase registry itself is encoded under `ordering-phases/2-candidate` and preserved by ordinary save/load model identity.
- **Reopen:** a required phenomenon needs another same-instant observation lane, empty experiences, causal roles inside the envelope, classifier dependencies, identity-dependent causal interpretation at this phase, a different recognition snapshot boundary, same-instant truth production after phase 120 that must be perceived immediately, or schedulable post-140 domain work. The parent `SEM-001` remains open for permanent canonical schemas/IDs and the integrated gate.

### Accepted `SEM-001I.1` — canonical schema inventory (2026-09-02)

- **Decision:** accept the [Event Semantic Canonical Schema Inventory](EVENT_SEMANTIC_SCHEMA_INVENTORY.md). Observer recognition catalogs/mappings are character-state instances committed by `InitialStateDigest`/`RunIdentity`, while their schemas and legal rules belong to `ModelIdentity`; symbol mappings carry an explicit typed occurrence ID rather than a derived string. Evaluations exist once in committed trace; persistent resolution state is self-sufficient and has no evaluation pointer/history. Observer-safe occurrences use distinct typed namespaces over the shared runtime allocator except detection-keyed transitions and one event-file-keyed retirement. Recognition history follows revision topology, not time/allocation order. Track/event transitions explicitly name their resulting file IDs.
- **Identity closure:** every authoritative occurrence row now names its exact unique key. Continuant and event transitions are respectively one-to-one with `CurrentDetectionId` and `CurrentEventDetectionId`; exactly one `PerceptualTrackEnd`/`PerceptualEventEnd` is permitted per corresponding file identity; all other rows use their declared typed occurrence identity. The explicit continuant-end record closes the lifecycle already required by false discontinuity and active-file state.
- **Boundary:** this accepts shapes, ownership, identity rules, and collection semantics only. It allocates no permanent record, field, enum, reference-tag, or registry numbers. The current symbolic oracle's string occurrence IDs, derived symbol-mapping ID, and resolution evaluation pointer are noncanonical implementation scaffolding until `SEM-001I.3` replaces them.
- **Next:** accepted `SEM-001I.2` now supplies the permanent allocation table; proceed to `SEM-001I.3` codecs/persistence vectors and then the `SEM-001J` integrated phenomenon gate.

### Accepted `SEM-001I.2` — permanent numeric allocation (2026-09-03)

- **Decision:** accept and freeze the [Event Semantic Permanent Numeric Registry](EVENT_SEMANTIC_NUMERIC_REGISTRY.md): record types `210..259`; the listed typed semantic namespaces within `1000..1024`; typed occurrence namespaces `1100..1115`; exact field IDs/optionality; state roots; finite semantic values; and manifest-governed union variant definitions. Namespace `1004` is absent, genuinely available, and contributes no canonical tombstone or reservation.
- **Compatibility:** allocation begins after authoritative record type 209. `WorldEventId=1114` is a semantic event occurrence distinct from scheduler `EventId`; `ObservationId=1115` is an observer-side occurrence rather than a model identity. Campaign 0 fixed causal-role values but no namespace, so `CausalRoleId=1019` is the first allocation while preserving registered-but-not-admitted `Context=9` and `Incidental=10`. Nested governed origin identifiers keep authored and runtime semantic referents distinct.
- **Pre-allocation correction:** `PerceptualTrackEnd` closes the continuant lifecycle already required by accepted false-discontinuity semantics and active-file state. It is keyed by `PerceptualReferentId`, may occur once, and is perception-owned.
- **Registry-kind closure:** `RegistryKindId=1023` is retained because accepted type 171 requires a typed `RegistryKind`. Its exact v0.1 payload `registry/union-variant-definition` selects the type-259 definition grammar and contributes to manifest identity; `UnionVariantDefinitionId=1024` separately identifies one `(RecordTypeId, VariantTag)` definition. The kind is therefore defined and executable registry metadata, not a speculative placeholder.
- **Proof:** `CV-SEM-091..095` pass collision, field, identity-category, vocabulary/origin, exact union-payload, illegal-layout, and order-independent schema-plus-union manifest controls. Detection interleaving, immutable mapping replacement, and semantic-key uniqueness for active catalog/mapping state are now explicit `CV-SEM-096..100` requirements under `SEM-001I.3`.
- **Boundary/next:** allocation acceptance authorizes `SEM-001I.3` codec and persistence work, not downstream learning or integrated seam acceptance. Permanent values may never be renumbered or reused. After `I.3`, proceed to `SEM-001J`.

### Shape-accepted `IDN-001` — observer/character identity binding (2026-09-05)

Accepted contract: `identity-binding/0.5-candidate`, **at shape level only**.

- **Acceptance level.** Contract/shape acceptance: the `CharacterId` role, its qualification semantics, the roster's symbolic shape, the projection instantiation, the identity-tier rules, the failure semantics and all controls in §4 are frozen. **Canonical implementation is not authorized**; permanent numeric allocation is deferred to Campaign 2 **F**. The controls are the implementation gate and are *not* claimed passed — the suite standing at 315 is the expected state for a shape-only acceptance.
- **Decision.** `CharacterId` is a governed character role over the accepted `SemanticReferentId` family (namespace 1002), not a new namespace — which removes the `SemanticReferentId` ↔ `CharacterId` relation a separate namespace would have owed, since a world event must know which persistent state belongs to its truth-side Actor. A referent qualifies exactly when its origin is authored content and its `GovernedContentDefinition.SemanticKind` is `semantic-kind/character`, checked by a committed `validator/character-qualification` (`DomainValidatorId`, namespace 1021) which may not consult a binding, character-state presence, a recognition `CandidateDomain`, body state, or current activity. Qualification asserts only that the entity may occupy a `CharacterId` position — not that an observer or body exists, that state is materialized, or that the entity is conscious or active.
- **Binding.** `ObserverId` → at most one `CharacterId`; `CharacterId` → `0..N` `ObserverId`s; a repeated `ObserverId` is a duplicate map key whatever its value. The relation is partial, and unboundness is a **contextual** failure: an unbound observer may perceive events and produce observer-relative records, and fails only at a seam requiring a character.
- **Roster.** `CharacterObserverBindingState / Bindings[ObserverId] → CharacterObserverBindingValue { CharacterId }` — a one-field value record because a raw typed identity is not an accepted `LeafValueGrammar`. An immutable initial-state relation with no mutation authority and no writable pattern, justified directly rather than by the recognition precedent, which has both. Registered through `PRJ-001`'s `ReadOnlyStateFamilyDefinition`, `StateKeyGrammarDefinition` (`IdentityKey`) and two `CanonicalRoleConstraint`s.
- **Identity tiers.** Qualification rule, binding schema and cardinality → `ModelIdentity`/`RegistryIdentity`; the actual pairs → initial state → `InitialStateDigest`/`RunIdentity`. A roster in `ModelIdentity` would make every cast change a model revision and make two runs of one model structurally incomparable — precisely what `PHEN-ADAPT-001`'s paired-timeline method requires to be false.
- **Subject resolution** is the exact accepted `PRJ-001` `EventDependentProjectedFieldRequirement`: selector from the admitted payload's `ObserverId`, target `CharacterObserverBindingState / Bindings / mapKey(*)`, projected field `CharacterObserverBindingValue.CharacterId`, output role the Character role, accessor `ResolvedCharacterSubject`. No resolver object, no wrapper accessor, no `Required` Boolean, no `IDN-001`-local mechanism. **Roster access closure** additionally forbids every alternate channel the accepted projection vocabulary still permits — static `direct`, legacy `derived`, and a second event-dependent requirement — so the family is readable *only* as that instantiation's internal source.
- **Authoritative failures.** Role-invalid subject → `CANONICAL_ROLE_VIOLATION`; unbound observer → `REQUIRED_PROJECTION_VALUE_ABSENT` (semantic label *subject unbound*; `SUBJECT_UNBOUND` is **not** an authoritative code); roster mutation attempt → `UNDECLARED_WRITABLE_PATH`; wrong key grammar → `INVALID_PATH`. A wrong-kind authored referent and a runtime-origin referent violate one role predicate and share one code; validator diagnostics may distinguish why.
- **Alternatives considered:** a new permanent `CharacterId` namespace (rejected — identity multiplication with an unregistered connecting edge); `CharacterId` ≡ `ObserverId` (rejected — collapses a perspective identity into a person identity); qualification by `CandidateDomain` (rejected — observer-owned belief deciding truth-side addressing); an unstored qualification predicate (rejected — a lamp-keyed path becomes indistinguishable from a valid one); a validator reading bindings or state presence (rejected — circular); an `IDN-001`-local resolver or projection requirement (rejected — a second read channel beside the accepted one); an authoritative `SUBJECT_UNBOUND` (rejected — duplicates the substrate code and puts domain interpretation inside projection mechanics); a writable binding family in v0.1 (rejected — a mutable identity relation before any phenomenon needs one).
- **Inherited defect, recorded not inherited silently:** the `CONTENT-001` per-kind validator is a compile-time closure whose behaviour reaches no manifest — the third instance of the anonymous-governed-executable class, after `TRC-001`/`TRC-002` and `PRJ-001`. It does **not** reopen `IDN-001`: this contract's predicate reads whether `SemanticKind` *equals* `semantic-kind/character`, and that assignment is committed to the content manifest digest. Registered as `VAL-001`, and a prerequisite of canonical reliance on a character-kind validator in built fixtures.
- **Campaign 2 F allocates:** the `CharacterObserverBindingState` root, the `CharacterObserverBindingValue` `RecordTypeId`, the `Bindings` and `CharacterId` field IDs, **and** semantic-kind/character in shared CONTENT-owned SemanticKindId/1004 (the prior permanent-family assumption is corrected by F), plus validator/character-qualification in existing DomainValidatorId/1021 and the CONTENT-001 kind-validator registration. No new IDN-owned identity namespace.
- **Reopen:** runtime-origin character qualification, which v0.1 excludes because only authored content carries a `SemanticKind`; a mutable perspective binding — body transfer, possession, replacement; one `ObserverId` mapping to several `CharacterId`s; ordering or priority among a character's several `ObserverId`s; several `ObserverId`s fused into one cognitive perspective; a non-character observer required by a phenomenon rather than merely permitted; or an accepted seam needing to read a binding from an observer-side `ReadDomain`, which is a redesign rather than an exception.

### Shape-accepted `PRJ-001` — event-dependent projection, read-only state, role constraints (2026-09-05)

Accepted contract: `projection/0.3-candidate-addendum`, **at shape level only**.

- **Acceptance level.** This is contract/shape acceptance: the symbolic canonical surface, its closure rules, its failure ordering and its adversarial vectors are frozen. **Canonical implementation is not authorized**, and permanent numeric allocation is deferred to Campaign 2 **F**; persistence activation follows it. `P0`–`P12b` are the frozen implementation gate — they are *not* claimed passed today, and the suite remaining at 315 tests is the expected state for a shape-only acceptance. This split exists because `ADAPT-001` §5.5 places `PRJ-001` before **F** while an earlier draft made its acceptance require IDs allocated *by* **F**; the `SEM-001I.1 → I.2` discipline resolves it.
- **Decision.** One closed `EventDependentProjectedFieldRequirement` — selector from a field of the admitted `ScheduledEvent` payload, a `TargetStatePathTemplate` that is a `StatePathPattern` with exactly one mapKey wildcard and deterministic single completion, one required projected record field, one `OutputRole`, one transition-visible `OutputAccessor`. Admission strictly precedes selector extraction. The source read is internal and has **no** transition-visible accessor, so wrapper opacity is structural. Required-only, read during projection construction, so a successful projection is total by construction rather than by rule. A two-variant `StateKeyGrammar` (`IdentityKey` | `CanonicalRecordKey`) is declared additively per exact `StatePathPattern`, giving composite Campaign 2 keys a type. `CanonicalIdentityRole` is defined once and used both for stored positions and for consumer requirements, with an exact non-inferential compatibility rule. `ReadOnlyStateFamilyDefinition` gives immutable families a declaration site, with disjointness proven at model construction.
- **The declaration is the executor.** `ProjectCanonicalRecordField(FieldId)` is interpreted by the runtime from its committed declaration; there is no seam callback and no function table. This replaces the accepted `derived` binding's anonymous `derive` closure, which inspection showed could not be committed — the same defect the accepted `TRC-001`/`TRC-002` record already rejects for "anonymous predicate validators … cannot be committed, so leaf admissibility could drift from model identity". `transformationId` names the requirement, whose identity `(SeamId, SeamVersion, OutputAccessor)` already exists in committed trace; no new namespace is minted.
- **Grammar coverage is keyed to admission, not chronology.** A model that does not admit this addendum retains accepted legacy `StatePath` behaviour. A model that admits it carries exactly one `StateKeyGrammarDefinition` per keyed family and exactly one keyed family per grammar definition — bidirectional, total, and decidable without reference to document history or an exception list. "New versus legacy family" is not a fact in `ModelIdentity` and may not gate validation.
- **Alternatives considered:** reusing the accepted `derived` machinery unchanged (rejected — the transformation is an ungoverned closure and its reads are lazy, so a required absence would land mid-transition); a `SourceInputRef` over multiple admitted inputs (rejected — `ScheduledEvent` carries one payload, so the abstraction modelled a vocabulary that does not exist); a `RequiredPresence` Boolean (rejected — its `false` branch contradicted totality, and the only witness is always required); `StateFamilyId` and `KeyGrammarRef` (rejected — hidden identities requiring allocation, where `StatePathPattern` is already accepted and structural); a `StateMapValue` role position (rejected — no legal witness, since `LeafValueGrammar` cannot express a raw identity leaf); extending `LeafValueGrammar` with a typed-identity scalar (rejected — widens Campaign 0 state grammar to save a one-field wrapper); a `ProjectionTransformDefinition` (rejected — an indirection with no second consumer); and a new failure-code structure (rejected — both new codes extend the accepted closed `StateFailureCode` union).
- **Domain/failure, in order.** `malformed path syntax → INVALID_PATH`; `wrong declared StateKeyGrammar → INVALID_PATH`; `well-shaped key, inadmissible identity role → CANONICAL_ROLE_VIOLATION`; `well-formed required projection, absent source → REQUIRED_PROJECTION_VALUE_ABSENT`; then accepted `WRT-001` — writable-leaf resolution, then authority. Both new codes extend `StateFailureCode`. `PRJ-001` refines `WRT-001`'s structural-validity step and changes nothing after it.
- **Frozen implementation gate:** `P0`–`P12b`, covering admission precedence, selector provenance and completion determinism, model-construction closure, accessor collision, totality, instrumentation-without-visibility, wrapper opacity, declaration-as-executor, output-role compatibility, immutable-family exclusivity, collection uniqueness, bidirectional grammar closure, non-admitting-model compatibility, role enforcement at all five `IDN-001` boundaries, composite-key recursion, wrong-key-type ordering, and exact non-inferential role compatibility.
- **Unblocks:** `IDN-001` to shape completion, and `EVID-001` to drafting. No active Campaign 2 `P0` remains.
- **Reopen:** a seam needs a composite selector, several admitted source instances, or a selector from something other than an admitted payload field; an optional event-dependent projection is genuinely required, which earns the `Required | Optional` grammar and its own missingness semantics; a read-only family must become writable; a key grammar richer than one identity atom or one record type is needed; validator implication becomes necessary, which is domain logic and earns its own seam; or general canonical field typing becomes necessary, which `CanonicalRoleConstraint` deliberately does not provide.

### Accepted `WRT-001` — write-path validation order (2026-09-05)

Accepted contract: `state/0.3-candidate-addendum`, amending accepted `state/0.2-candidate`.

- **Decision:** accept a **common write-validation prefix** — (1) the `StatePath` is structurally valid, (2) it resolves to a declared writable leaf through one shared `resolveWritableLeaf` primitive, (3) the supplied `MutationAuthority` owns that leaf. An undeclared path never reaches authority resolution. The overloaded `ILLEGAL_WRITE` is replaced at its two runtime sites by `UNDECLARED_WRITABLE_PATH` and `NON_OWNING_AUTHORITY`; `INVALID_VALUE` and `REMOVE_FORBIDDEN` already existed and are unchanged. Structural path validation becomes explicit rather than a side effect of the sort comparator. **After the prefix, operation-specific removal, expected-old/precondition, and value-grammar validation retain accepted `state/0.2-candidate` semantics and ordering; `WRT-001` does not reorder them.**
- **Two defects, both demonstrated rather than inferred.** *Authority before writability*: `applyStatePatch` resolved the mutation authority first, so a path writable by nobody reported "this authority does not own it" — naming a relationship to an authority that could not have held it — contradicting this document's own first-divergence rule. *Structural validity hidden in a sort comparator*: `createStatePatch` validated paths only inside its comparator, which is never invoked for a single-element array, so validity was **arity-dependent** — the same malformed path reported `INVALID_PATH` in a two-operation patch and reached writability resolution in a one-operation patch. The second was masked by the first and was found by control `W0`, not by inspection.
- **Alternatives considered:** an outer `ILLEGAL_WRITE` category with structured subreasons (rejected on inspection — `StateFailureCode` is a flat closed union of string literals and `StateContractError` is `{code, message}`, so this meant bolting an ad-hoc reason field onto one error type); a general failure-structure addendum (rejected as unnecessary once enumeration showed `ILLEGAL_WRITE` overloaded exactly two runtime meanings, the value and operation cases already having their own codes); discovering writability inside `validateNewValue` (rejected — `Remove` carries no proposed value, so membership cannot be a side effect of value validation, and three independent lookups could disagree); and leaving structural validation to the comparator (rejected — first divergence may not depend on patch cardinality).
- **Affected documents:** `STATE_MODEL.md` pre-staging verification order; `src/substrate/state.ts`; `SUBSTRATE_ADDENDA_DRAFT.md` Part 2.
- **Domain/failure:** every authoritative write, through every entry point. `malformed → INVALID_PATH`; `valid but undeclared → UNDECLARED_WRITABLE_PATH`; `declared, wrong authority → NON_OWNING_AUTHORITY`; `declared and owned, bad value → INVALID_VALUE`; `declared and owned, forbidden removal → REMOVE_FORBIDDEN`. `resolveWritableLeaf` is the sole writable-family resolution mechanism, shared by `applyStatePatch`, `validateState`, `validateNewValue` and `validateRemoval`, so entry points cannot disagree about first divergence.
- **Proof:** `W0`–`W5` in `src/test/wrt001WriteValidationOrder.test.ts` (9 vectors), covering structural precedence, undeclared-beats-unowned under either authority, the declared/undeclared move, value and removal codes keeping their own meanings, removal resolving without a value, cross-entry-point agreement, compound-fault precedence, and unknown-authority distinctness. Suite: 315 tests across 38 files; typecheck clean.
- **Mutation evidence:** restoring the pre-repair authority-first ordering fails `W1`, `W2`, `W4a`, `W4b`, `W4c`; removing the explicit structural validation fails `W0`. Both new guards have independent witnesses.
- **Migration audit (`W5`), run rather than predicted:** four failing tests across five assertion sites — four genuine authority failures `ILLEGAL_WRITE → NON_OWNING_AUTHORITY` (meaning unchanged, code refined) and one undeclared-family failure `ILLEGAL_WRITE → UNDECLARED_WRITABLE_PATH`, which had encoded the ambiguity and is amended with its reason recorded inline. The first stale assertion lives in `validateState`, not `applyStatePatch`, which is why the audit covered every entry point. Valid execution, authoritative state, rollback and successful traces are unchanged suite-wide; only the five invalid-write diagnostic codes moved.
- **Deliberately out of scope:** `ILLEGAL_WRITE` survives in the closed union for one registry-construction site ("mutation authority claims paths outside the writable schema"), now single-meaning; renaming it is a separate cleanup. Scheduler `FailureDiagnostic` still flattens a typed state failure into `STATE_VALIDATION_FAILURE` plus free text — `WRT-001`'s first-divergence guarantee is at the typed state-contract boundary, and nesting state causes in scheduler diagnostics earns its own trace/diagnostic decision.
- **Reopen:** the accepted failure-code vocabulary gains structured reasons, making sibling codes the wrong shape; operation-specific validation ordering itself needs deciding, which this addendum explicitly does not own; or a writable-family resolution must become authority-relative rather than path-relative.

### Accepted `TRC-001`/`TRC-002` allocation addendum — `MutationAuthorityId` (2026-09-03)

- **Decision:** allocate global substrate namespace `1025 MutationAuthorityId` under `mutation-authority/0.1-candidate`. Campaign 0 already accepted "exactly one mutation authority per writable leaf" as a general substrate invariant but allocated no identity namespace for it; `SEM-001I.3` discovered the gap rather than inventing a semantic-binding concept. A `MutationAuthorityId` is a governed semantic/model identity, not a run occurrence: it names an executable ownership role, is committed by registry/model identity, and is stable across every run of a model. Every state family — perception now, belief, memory, regulation, identity, habits, skills and relationships later — draws from this one namespace. Record types 152–155 encode the committable registry definition, with a closed leaf-value grammar (`1 UnsignedCounter`, `2 MembershipMarker`, `3 CanonicalRecord(RecordTypeId)`) so the executable validator is derived from committed data rather than an anonymous predicate. Authority identity, each owned `StatePathPattern`, each leaf's removal permission, and each leaf's value grammar contribute to registry/model identity; declaration order does not.
- **Allocation hygiene:** `1025..1029` held no accepted allocation, so `1025` is the natural chronological append after `1024 UnionVariantDefinitionId` and renumbers nothing accepted by `SEM-001I.2`. Candidate-era hole `1004` remains genuinely available and is deliberately not backfilled. Record types 152–155 append after the accepted state block `140..151`.
- **Alternatives considered:** a `SEM-001`-local authority identity family (rejected: every future state family needs the same type); jumping to `1030` merely to sit outside the frozen block (rejected: no reservation exists in `1025..1029`); backfilling `1004` (rejected: no benefit over the natural next allocation); anonymous predicate validators (rejected: cannot be committed, so leaf admissibility could drift from model identity); one authority per writable leaf (rejected: the invariant is one authority *per* leaf, not a unique authority per leaf); and naming an authority for its current producer rather than its state family (rejected: bootstrap origin is not enduring semantic ownership).
- **Domain/failure:** any registered writable state family. Empty or non-NFC authority names, duplicate authority names, unknown leaf grammars, overlapping ownership patterns, uncovered writable leaves, unknown or wrong-namespace authority identities, non-owning authorities, forbidden removals, and out-of-grammar leaf values each fail at registry construction or before the write.
- **Proof:** executable `CV-OWN-002` in `src/test/mutationAuthorityIdentity.test.ts`, covering all six required properties. Mutation-checked: dropping removal permission, the value grammar, or the authority identity from the committed definition each collapses the identity-discrimination vector.
- **Reopen:** a state family needs an authority identity outside this namespace, a new leaf-value grammar is required, or removal/value admissibility must become an authority-level rather than leaf-level property.

### Accepted `SEM-001I.3` — canonical codecs, state closure, and persistence (2026-09-03)

Accepted contracts: `semantic-codecs/0.1-candidate` and `semantic-state-authority/0.1-candidate`, over the accepted global `1025 MutationAuthorityId` namespace established by the `TRC-001`/`TRC-002` addendum above.

- **Decision:** accept `semantic-codecs/0.1-candidate` as the sole construction boundary from the frozen `SEM-001I.2` allocation to `cenc/1` bytes, and `semantic-state-authority/0.1-candidate` as the registered ownership of state roots 241–244. Records are constructed by accepted field name; union records validate their tag/payload contract before construction, so an illegal layout can never be allocated an occurrence or emitted; unadmitted seam-contract versions and unregistered record schema versions both fail closed; and every accepted record round-trips byte-identically. Each of the four state roots decomposes into `mapKey` leaf families addressed by that collection's own accepted uniqueness key — the observer for both next-sequence counters, the type-212/213 identity record for both active-file sets, the accepted `(ObserverId, CandidateSemanticReferentId)` and `(ObserverId, PerceivedIdentitySymbolId)` tuples for recognition knowledge, and the declared occurrence identity for resolution records. No selector depends on list position, insertion order, or an ordinal read as magnitude. Active-file membership is the exact marker `true`, never a payload, so a canonical set cannot become a second hidden state channel.
- **Membership representation:** `mapKey → true` is the *mutation-addressing projection* of an accepted canonical set. It does not convert `ActivePerceptualReferentIds` or `ActivePerceptualEventReferentIds` into authoritative map-valued domain state: canonical persistence still encodes both as `cenc/1` sets, and the marker exists only to give the `StatePath` patch model an exact writable leaf value. Domain state remains a canonical set of active IDs; mutation addressing is a keyed membership leaf whose only admissible value is exact canonical `true`. The equivalence of the two views — same members, same canonical identities, preserved across the persistence boundary and across retirement — is executable, not merely asserted.
- **Ownership:** three authorities in the accepted global `1025` namespace — `authority/perception` owns both perceptual file states, `authority/recognition-knowledge` owns candidate catalogs and identity-symbol mappings, and `authority/recognition-resolution` owns the append-only resolution log. Each is named for the state family whose writes it governs, so a later accepted learning/forgetting seam may write recognition knowledge through the same authority without renaming it. Removal permission is leaf-level: observer counters and resolution history are non-removable, active-file membership and both recognition-knowledge collections are removable.
- **Scaffolding replaced:** `ObserverIdentitySymbolMapping` now stores an allocated typed `ObserverSymbolCandidateMappingId` instead of an ID synthesized from symbol/candidate/version text, and `RecognitionResolutionRecord` no longer carries a `RecognitionEvaluationId`, so persistent resolution state is self-sufficient and each evaluation exists exactly once in committed trace. Active-mapping uniqueness moved from `(PerceivedIdentitySymbolId, CandidateSemanticReferentId)` to the accepted `(ObserverId, PerceivedIdentitySymbolId)`, which previously permitted one symbol to map to two candidates simultaneously.
- **Alternatives considered:** field-numbered construction at call sites, post-construction union validation, tolerant unknown-version decoding, ad-hoc state projections outside the accepted allocation, `stableListItem` or ordinal-positional addressing of the two active-file sets, payload-bearing membership values, most-specific-wins authority resolution, and retaining the derived mapping key. All are rejected: each either lets an unallocated shape reach committed bytes or makes an ordinal semantically load-bearing.
- **Domain/failure:** the finite symbolic semantic-binding fixture. Unknown schema, unallocated field, missing required field, unadmitted contract version, unregistered schema version, illegal union layout, negative occurrence ordinal, undeclared writable path, unregistered or non-owning authority, forbidden removal, and out-of-grammar leaf value each fail before allocation or emission. A staged failure restores state, both observer counters, allocators, committed trace, and outputs together.
- **Proof:** executable `CV-SEM-096..100` in `src/test/semanticCodecs.test.ts`, `src/test/semanticStatePersistence.test.ts`, and `src/test/semanticRecognitionState.test.ts`; ownership and lifecycle vectors in `src/test/semanticStateAuthority.test.ts`; and accepted substrate `CV-OWN-002`. The semantic fixture's registry manifest commits the authority definition, so ownership, removal permission, and leaf value grammar are inside its `ModelIdentity`. Each load-bearing guard was mutation-checked: disabling union validation, weakening mapping uniqueness, removing the catalog duplicate guard, making restore lossy, globalising the track allocator, duplicating an authority, permitting counter removal, and accepting a non-marker membership value each fail their own vectors and no others.
- **Boundary/next:** this covers codecs, state ownership, persistence, replay, and rollback for the accepted allocation. It authorizes no downstream learning and does not accept the parent `SEM-001`. **Carried condition on `SEM-001J`:** the integrated gate must not run the symbolic oracle and then serialize its result canonically. It must migrate the remaining `SEM-001B..H` in-memory occurrence boundaries onto the accepted typed IDs and the codec/state machinery, exercising canonical truth occurrence IDs → observation/detection IDs → track/event identities → evidence occurrences → experience → recognition evaluation/resolution → state mutation → save/load/replay end to end. No authoritative `PHEN-SEM-001` result may depend on a symbolic string occurrence ID.
- **Reopen:** the accepted allocation changes, another state root or writable leaf is added, a collection's uniqueness key changes, an authority is split or merged, a new occurrence namespace is allocated, or any decode path must tolerate an unknown version.

### Accepted `SEM-001J` — integrated phenomenon gate; parent `SEM-001` closed (2026-09-04)

Accepted contract: `semantic-binding/0.1-candidate` as the Campaign 1 event-semantic baseline. `PHEN-SEM-001` passes. The parent `SEM-001` is closed.

- **Decision:** accept the complete finite deterministic semantic-binding and recognition architecture as exercised by `PHEN-SEM-001`. One truth event, three observers with mutually non-subsuming permitted visibility, run end to end inside the deterministic scheduler: `WorldEventTruth` → observer-specific permitted observation → continuant and event detection → fallible tracking and segmentation → binding and feature evidence → classification → immutable `PreRecognitionSemanticExperience` → character-relative `CausalRoleEvidence` → recognition cues, evaluation, and resolution → observer-relative renderers → canonical state and trace → save/load → exact replay. Every stage is an accepted canonical record over the frozen `SEM-001I.2` allocation, and every occurrence identity is drawn from the scheduler's own runtime allocator.
- **Scope of closure:** this proves *this* finite deterministic architecture and its fixture vocabulary. It does not claim continuous perception, graded perceptual confidence, general ontology inference, action-schema recognition, memory encoding, belief learning, appraisal, or social cognition. Each remains a later seam, and none is authorized by this acceptance.
- **Identifier discipline:** `SEM-001` closure allocates and reinterprets no permanent identifier accepted by `SEM-001I.2`; it proves that the frozen allocation participates correctly in the complete integrated semantic path.
- **Carried condition discharged.** The `SEM-001I.3` condition — no authoritative `PHEN-SEM-001` result may depend on a symbolic string occurrence ID — is proved structurally and adversarially, not asserted, in four independent ways that fail for different reasons: the accepted constructor refuses a symbolic occurrence identity and an unaccepted occurrence family outright; a legacy seam-version string routed at an authoritative field is refused with exact `UNADMITTED_CONTRACT_VERSION`; poisoning every fixture scaffolding label while holding the permitted observations and canonical occurrences fixed leaves the authoritative bytes byte-identical; and every identity in the committed canonical chain resolves through *the namespace its own field must draw from*, with every occurrence payload an allocated ordinal rather than text. That last check binds field to namespace rather than checking nodes in isolation, because a check that only verified "occurrence namespaces carry ordinals" passes a symbolic string re-encoded through a namespace whose payload is legitimately text. Symbolic shapes may still exist in helper and fixture code; they provably cannot reach a result. **Old symbolic IDs are test scaffolding; accepted typed canonical IDs are authoritative execution.**
- **Migration performed:** `semanticEvidenceCodecs.ts` completes the construction boundary over the frozen allocation for the records that carry a run's *result* — truth bindings, perceived bindings, classification evidence, the assembled experience, character evidence references, causal-role evidence, and recognition resolutions. The fixture's authoritative records previously carried fixture-scoped version labels (`phen-sem-001/causal-1`, `phen-sem-001/recognition-1`) in fields the codec admits only `SEM-001A..H` for; they now carry the accepted `SEM-001G` and `SEM-001F` contracts. The consuming `ReadDomain` now admits the seam that actually *produced* a perceived binding (`SEM-001C`) rather than the seam consuming it. Union constructors pass their payload through to the accepted tag/payload matrix instead of choosing it, so an illegal layout is refused rather than silently dropped.
- **Vector retirement:** zero pending `CV-SEM` rows at acceptance. `CV-SEM-001..100` all `PASS`, and the thirteen that were still pending when this gate opened — `001`–`003`, `007`–`012`, `014`–`015`, `017`–`018` — each name their integrated evidence in the `SEM-001J` integrated evidence table, so the record shows which test discharged which parent obligation rather than closing the set in aggregate.
- **Registered is not admitted:** recorded as an explicit invariant. A registered semantic value is not thereby admitted by a given seam, read-domain, or domain contract; admission is decided by the exact receiving rule. The Campaign 0 causal-role registry contains `Context` at value 9 and `SEM-001`'s causal-role domain does not admit it, while `Incidental` keeps value 10 and is never renumbered. This introduces no new mechanism; it prevents a later implementation reading "registered" as "legal everywhere".
- **Document audit boundary:** `sem001AcceptanceGate.test.ts` and this gate read the formal Markdown, and do so only for identifiers, statuses, gate entries, named decisions, and consistency between ledgers and contracts. Documents are an audit target, never a runtime semantic interpreter. Authoritative simulation behaviour comes exclusively from the governed registries, codecs, and contracts committed to `ModelIdentity`; the boundary is executable — no module under `semanticBinding/`, `substrate/`, or `observation/` reads a document or globs a file at runtime.
- **Integrated negative controls:** truth identity leak, truth-role overexposure, referent-keyed collapse, role-keyed collapse, event-only collapse, classification into a psychological seam, hidden-truth causal influence, character traversal of omniscient ancestry, noncanonical or invalid evidence, whole-instant failure, and legacy symbolic authoritative ID use each fail at their first *actual* illegal boundary inside the integrated run, with the exact code asserted.
- **Alternatives considered:** asserting the carried condition in prose; comparing in-memory objects across the boundary; serializing the symbolic oracle's output canonically after the fact; admitting fixture-scoped seam versions into the codec; treating registry membership as admission; parsing the formal documents into runtime rules. All are rejected — each either lets a symbolic identity remain load-bearing or moves authority out of `ModelIdentity`.
- **Domain/failure:** the finite deterministic `PHEN-SEM-001` fixture and its accepted vocabulary. Any unaccepted namespace, mis-bound identity field, unadmitted contract version, illegal union layout, negative ordinal, unallocated field, forbidden emission target, or truth-shaped field fails before allocation or emission; a staged failure after a fully populated integrated instant restores state, every observer counter, allocators, committed trace, and outputs together.
- **Proof:** `src/test/sem001JIntegratedGate.test.ts`, `src/test/phenSem001Integration.test.ts`, `src/test/sem001AcceptanceGate.test.ts`, `src/test/semanticNegativeControls.test.ts`, and the `CV-SEM-001..100` suite. Every load-bearing guard was mutation-checked: encoding an occurrence as a text-payload identity, admitting any seam version, letting the union constructor choose its payload instead of the matrix, dropping the observer-side basis from causal evidence, removing the experience or the resolution from the committed chain, losing feature evidence under poisoned labels, dropping a vector's integrated evidence, and inverting the registered-is-not-admitted principle each fail their own controls and no others.
- **Reopen:** a required phenomenon needs continuous or graded perception, probabilistic recognition, general ontology inference, action-schema recognition, learning that mutates recognition knowledge, appraisal or social cognition inside this path, another observation lane, or an occurrence identity that is not an allocated ordinal in an accepted namespace.

### `MATH-006`

- **Decision:** accept registered bounded state-change channels that compile exact permitted observation intervals from `Before`, `After`, known bounds, and polarity; missingness is a distinct sum type, and only visible provenance slots cross into thin `SemanticExperience`.
- **Alternatives considered:** `OverflowLeak`, truth-side saturation classification, full provenance copy, missing-as-zero, and always-point measurement. Each is rejected by an exact structural divergence or closure violation.
- **Domain/failure:** exact bounded scalar changes, deterministic registered missingness, known channel bounds, and point/lower/upper interval evidence. Invalid truth/channel/closure data aborts the whole instant; noisy sensors, uncertain bounds, and learning updates remain outside this contract.
- **Proof:** `CV-OBS-001..006`, `CV-EPI-001..002`, the paired hidden-Overflow timeline through thin `SemanticExperience` and an immediate consumer, forbidden-field closure, named first divergence, and transactional rollback.
- **Reopen:** measurement mode, interval vocabulary, channel knowledge, polarity, missingness, visibility/role projection, precision/unit, timing, safe-reference, or hidden-truth influence changes.

## Closed Campaign 0 decisions — 2026-09-01

The following decisions closed together when the Campaign 0 gate passed. Their immutable candidate-era version identifiers were retained so acceptance did not perturb canonical identity or random inputs.

### `RND-001` and `MATH-005`

- **Decision:** accept registered canonical random addresses, domain-separated SHA-256 128-bit candidates, two bounded-rejection attempts, and a fresh-candidate modulo fallback for spans through `2^32`; explicit role-compatible `ComparisonDrawMap` is the only coupling override.
- **Alternatives considered:** historical delimiter/FNV 64-bit addressing and unbounded rejection. The accepted form retains pure addressing while removing delimiter ambiguity and bounding work.
- **Domain/failure:** invalid spans, weights, purposes, coupling roles, duplicate maps, or late maps fail structurally; the published ideal-candidate total-variation bound is below `2^-290`.
- **Proof:** `CV-RNG-001..008`, independent SHA-256 oracle, exhaustive reduced-width enumeration, exact inequalities, mutable sequential-RNG negative control, and `PHEN-DET-001`.
- **Reopen:** address/schema, hash/candidate width, range mapper, attempt count/fallback, coupling, or bias evidence changes.

### `TIME-001` and `MATH-001`

- **Decision:** accept checked integer `SimInstant`, exact linear analytical anchors, retained bounded remainder, non-mutating reads, and materialize→mutate→re-anchor semantic transitions.
- **Alternatives considered:** incidental re-anchoring with truncation and hidden microticks; both are rejected because they create partition-sensitive state.
- **Domain/failure:** declared signed rates/scales and bounded values only; negative duration and representation overflow fail without mutation.
- **Proof:** `CV-TIME-001..006`, positive/negative partition equivalence, truncation negative control, rational oracle, save/load, and transaction rollback.
- **Reopen:** time unit/range, rounding/remainder, re-anchor order, parameter identity, or nonlinear algorithm changes.

### `ORD-003` and `ORD-004`

- **Decision:** accept `(DueAt, Phase, EventSequence)` order, run-global allocation, same-instant quiescence, whole-instant atomic commit, terminal failure, and quiescent canonical continuation saves.
- **Alternatives considered:** partial event commit, retry, deferred cascade remainder, insertion order, and serialized executable handlers; all are rejected.
- **Domain/failure:** registered phases/handlers, positive work ceiling, and complete allocator/event continuation; any validation or invariant failure restores the pre-instant committed structures exactly.
- **Proof:** `CV-ORD-001..004`, `CV-TXN-001` at nine generic and concrete boundaries, `CV-SAVE-001..002`, and integrated `PHEN-DET-001`.
- **Reopen:** ordering key, phase registry, transaction boundary, cascade policy, allocator, save schema, or continuation mismatch changes.

### `TRC-001` and `TRC-002`

- **Decision:** accept typed state paths, exhaustive sole mutation authority, capability-limited reads, canonical preconditioned patches, exact diffs, committed-trace/failure-diagnostic separation, and structural first divergence with causal ancestry.
- **Alternatives considered:** direct object mutation, most-specific overlapping ownership, declared-but-uninstrumented reads, hash-only comparison, and aborted records in committed trace; all are rejected.
- **Domain/failure:** declared writable leaf families and registered projections only; forbidden/stale/overlapping/invalid work aborts the containing instant.
- **Proof:** all `CV-OWN-*`, `CV-READ-*`, `CV-PATCH-*`, and `CV-TRC-*`, schema rejection, deep-copy, exact-diff, and concrete rollback vectors.
- **Reopen:** path/selector, ownership, patch, trace/evolution, causal comparison, or atomicity semantics change.

### `CONTENT-001`

- **Decision:** accept governed content type 170, semantic and canonical-schema registry types 171–173, corpus-manifest type 174, canonical set manifests, stable typed references, and a required deterministic validator resolved for each semantic kind.
- **Alternatives considered:** presentation-inclusive commitments, digest-only registries, and free-form content interpreted at runtime; all are rejected.
- **Domain/failure:** every required structural field is authoritative; presentation field 100 is excluded; duplicate/unknown references, cycles, absent validators, out-of-domain definitions, and malformed registries fail before commitment.
- **Proof:** exact content/registry/corpus bytes and SHA-256 digests, every-field sensitivity, presentation insensitivity, construction-order invariance, and adversarial invalid-manifest vectors.
- **Reopen:** content/registry schema, field authority, reference/cycle policy, validator resolution, or manifest encoding changes.

### EVID-001 — SHAPE ACCEPTED 2026-09-05

- **Decision:** accept revision 5 of [EVID-001](../planning/EVID_001_DRAFT_RESOLUTION.md) as
  `character-learning-evidence/0.5-candidate`, and its companion
  `transition-admission/0.4-candidate` as a NoStateWrites-only shared substrate. The exact path is
  consequence PreRecognitionSemanticExperience → OutcomeEvaluation → OutcomeLearningEvidence.
  Immutable full-source embedding preserves observer relativity; no duplicate ObserverId,
  CharacterId, roster/state/reference/truth read, adaptation input or persistent learning write.
  OutcomeEvaluation is an identity-like scaffold occurrence and earns no research verdict.
- **Shared accepted shape:** exact-one output definitions and derived output-schema closure;
  closed producer admission; generative consumer-owned ingress with once-per-source-per-consumer
  cardinality; explicit execution seam/version/event registration; independent transition routes;
  exact occurrence identity field/role rules; dedicated registry-definition instance identity and
  the two exact RegistryKindId members. Type-227 field-1 ExperienceId receives the additive PRJ
  namespace-1106/no-validator declaration in admitting Campaign-2 models without changing Campaign-1
  bytes or identity. Each EVID transition maps once to character-learning; future route members are
  permitted. Registry validation is closed contract interpretation, never an injectable callback.
- **Alternatives rejected:** CharacterId/roster projection during evidence production; duplicated
  observer indexes without a governed equality mechanism; universal source-specific evidence type;
  synthetic SEM TransitionKind; producer-owned dispatch; ungoverned admission; schema-only output
  cardinality; implicit occurrence positions; RegistryKindId-as-instance identity; hidden generic
  state-family references. StateWrites is deferred entirely to a future version, not partially typed.
- **Domain/failure:** same-instant direct consequence route, phases 124→130→130, no ORD-001 decision.
  INPUT_NOT_ADMITTED, TRANSITION_WRITE_FORBIDDEN, TRANSITION_OUTPUT_VIOLATION and
  TRANSITION_INGRESS_VIOLATION retain the accepted first-divergence order and whole-instant rollback.
  These are future additive scheduler codes, not state-code aliases. Occurrence extraction does not
  prove freshness; the producer/allocator does.
- **Acceptance level / proof:** contract/shape only. **All EVID-A..T** are the frozen implementation
  gate, **not passed**. No new suite or corpus evidence is implied; no fixtures were implemented or
  rerun for acceptance. Canonical implementation is **NOT YET AUTHORIZED**; permanent allocation
  and implementation remain gated on Campaign 2 **F**. No numeric IDs are assigned here.
- **Affected scope:** ADAPT consumes the accepted evidence family and shared base, but its writing
  transitions require a versioned StateWrites extension after its exact family referent is frozen,
  plus any required variable-output extension. EVID closes at shape level; **REG-001 subsequently closed at shape level; ADAPT has no open prerequisite decisions**. VAL-001 remains P1 and neither reopens EVID nor blocks F.
- **Reopen/migration:** new source relations, fields, interpretation, historical input, writes,
  identities, registry semantics or altered failure/order behavior require a versioned contract and
  proof; no historical source is rewritten. No source migration occurs before F. Merely adding
  another legitimate transition to character-learning does not reopen EVID.

## REG-001 — closed at shape level, 2026-09-05

**SHAPE ACCEPTED:** [revision 5](../planning/REG_001_DRAFT_RESOLUTION.md),
`regulatory-reference/0.5-candidate`. REG owns RegulatoryVariableId and its abstract scaled signed
scalar domain, exact IDN-qualified character totality, and RegulatoryReferenceParameterId with
one authoritative owning variable. Copies/references do not confer declaration authority.
The closed eleven-pass construction interpreter governs registration. The sole R0 provider is
accepted TIME materializeLinear over immutable model declarations: zero anchor/remainder,
constant/reduced-rate normal forms, full-clock endpoint bounds, no state reads/writes or re-anchor.
REG owns the exact bound relation and local typed reference/validation results; ADAPT owns stored-D
validation timing and integration, including time-only invalidation without clamp or repair.

**REG-A..R: frozen implementation gate, NOT PASSED. Canonical implementation NOT YET AUTHORIZED.
Permanent allocation deferred to Campaign 2 F.** Accepted symbolic inventory includes two new
identity families, the regulatory-variable registry kind, four canonical record shapes, field/map
grammars and the exact PRJ character role; TIME types 120/121 remain unchanged.

EVID-001 and REG-001 are both shape-closed. ADAPT has no open prerequisite decisions but remains
unaccepted pending its own exact state-family referents, StateWrites extension, variable/rule-indexed
outputs, REG validation integration, OutcomeLearningEvidence integration and final F inventory.
VAL-001 remains P1 and does not reopen REG or block this pre-allocation sequence.

### PRJ allocation clarification — ProjectionAccessorId (2026-09-06)

The existing OutputAccessor position uses TypedIdentifierValue but lacked a permanent semantic
family. Record shared projection-substrate/PRJ ownership of ProjectionAccessorId; Campaign 2 F
allocates its namespace and exact payloads for ResolvedCharacterSubject,
accessor/adaptation-target-prior and accessor/adaptation-gate-prior. No numeric allocation here.
No ProjectionRequirementId or accessor registry is introduced. Complete requirement identity
remains (SeamId, SeamVersion, OutputAccessor); accepted cross-collection uniqueness is unchanged.
Namespace-only qualification is enforced at the extended Campaign-2 contract-definition boundary
with INVALID_CONFIGURATION for a wrong namespace, not globally on ActualReadRecord/type 147.
Legacy contracts outside the addendum retain their accepted behavior. PRJ-F-ACCESSOR-1/2 are
frozen NOT PASSED. See [PRJ allocation clarification](../planning/SUBSTRATE_ADDENDA_DRAFT.md#prj-allocation-clarification--projectionaccessorid-2026-09-06).
This closes the F identity-home gap without reopening PRJ, IDN or ADAPT E semantics; allocation
and implementation remain subject to the existing gates.


### ADAPT-001 — whole-contract shape accepted; formal decision remains OPEN (2026-09-06)

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

The formal target disposition still requires the accepted typed seam passing PHEN-ADAPT-001.
Do not move its row to closed on shape acceptance or allocation. See the
[main acceptance record](../planning/ADAPT_001_DRAFT_RESOLUTION.md) and
[accepted F packaging](../planning/ADAPT_001_PACKAGING_DRAFT.md).
ProjectionAccessorId allocation clarification is present in authoritative PRJ acceptance bookkeeping
in this register and in the PRJ addendum; no new namespace number has been assigned by this verdict.


### Campaign 2 allocation-home clarifications — G1/G2 (2026-09-06)

Record shared SemanticKindId/1004 (CONTENT) and SeamId/1036 (trace/transition substrate), preserving
all prior proposed numbers. IDN's semantic-kind/character remains exact, with no qualification
change. Both ADAPT V06 consumers freeze seam/automatic-adaptation, semantic version 0.31 unchanged.
The accepted observation seam/truth-to-permitted-evidence, SEM source and EVID seam are also in the
shared member table. No seam registry, fixture promotion or generic legacy trace narrowing.
C2-F-ID-1/2 frozen NOT PASSED. The combined allocation is still a review candidate, not accepted
permanent allocation. VAL-001 remains independent and ADAPT-001 remains formally OPEN.


## Campaign 2 permanent allocation accepted and frozen — 2026-09-06

The revision-2 review's final mechanical conditions A/B passed: exact complete Markdown/JSON
parity and the explicit observation/0.1-candidate SeamId declaration at
OBSERVATION_AND_EVIDENCE.md:5 (accepted status at line 3).
The [permanent registry addendum](CAMPAIGN2_PERMANENT_ALLOCATION.md) is now
**campaign2-allocation/0.2-candidate, ACCEPTED AND FROZEN**. This disposition supersedes earlier
allocation-pending statements; it does not revise accepted seam semantics. Records 260..328,
namespaces 1004, 1026..1036 and 1116..1121 as listed, all 58 member payloads, 32 union variants
and 10 finite field values are permanent. No renumbering, reuse or insertion by shifting; future
additions append. All earlier proposed assignments are preserved. Namespace 1004's prior
availability is historical; it is now assigned to CONTENT/shared SemanticKindId. SeamId/1036
is shared, with contextual Campaign-2 enforcement and no global legacy trace migration.

Allocation acceptance permits canonical construction of already shape-accepted surfaces subject
to their remaining implementation gates. No construction was performed by this disposition.
VAL-001 remains independent and must close before canonical reliance on affected governed
executable closures, including the CONTENT character-kind validator. ADAPT-001 remains formally
OPEN; PHEN-ADAPT-001, C2-F-ID-1/2 and all other unexecuted frozen gates remain NOT PASSED.
Allocation is not implementation proof for EVID, REG, IDN or PRJ; previous WRT proof is preserved.

### VAL-001 draft intake — 2026-09-06

[Revision 1](../planning/VAL_001_DRAFT_RESOLUTION.md) records the actual content callback,
projection, state-validator, transition-handler and identity commitment boundaries. Proposed
resolution: closed accepted interpreters derive executable semantics from committed declarations;
no independently supplied callbacks decide authoritative construction or transition meaning.
The proposed minimal character-kind specialization requires review and a separately allocated
definition schema/member. No numeric assignment or accepted seam is changed. VAL-A..R are
frozen NOT PASSED; VAL-001 remains P1 OPEN. This intake is not acceptance or implementation.
Campaign-2 allocation remains accepted and frozen; affected canonical reliance remains gated.

### VAL-001 revision-1 review and revision-2 response — 2026-09-06

The review accepts the closed-declaration policy, two admitted implementation situations, no
source/build hashing and construction/restore principle; CONTENT's minimal character-kind
specialization is accepted in direction. Overall VAL shape acceptance was WITHHELD because
the DomainValidator executable binding was missing and the CONTENT support domain was ambiguous.

[Revision 2](../planning/VAL_001_DRAFT_RESOLUTION.md) proposes the one-field
SemanticKindRoleValidatorDefinition under the existing validator/character-qualification ID,
with the exact IDN authored-origin/kind-equality interpreter. Referenced and declared domain
validators must match exactly; unsupported CONTENT kinds fail without legacy fallback.
Model admission and build/release qualification are distinct. Additive inventory is two schemas
and two RegistryKindId members only; no numeric assignment or accepted seam change.
VAL-A..R are preserved; VAL-S..W are added, all NOT PASSED. VAL-T's positive second-kind case
is conditional on a future accepted extension, not fabricated in the character-only profile.
VAL-001 remains P1 OPEN and not shape accepted; next step is revision-2 shape review.


## VAL-001 shape acceptance and additive allocation proposal — 2026-09-06

[VAL revision 2](../planning/VAL_001_DRAFT_RESOLUTION.md) is SHAPE ACCEPTED at governed-execution/0.1-candidate,
content-kind/0.1-candidate and governed-domain-validator/0.1-candidate. The required §3 correction
limits committed operands to model-semantic choices within an admitted contract. Build support
may reject activation without changing the already-defined model or entering ModelIdentity.
The separate content-kind and domain-validator definitions, exact supported-kind/reference
closure, construction order and model-admission/build-release split are frozen.

VAL is now an implementation-activation gate, not an architecture blocker. VAL-A..W remain
frozen NOT PASSED; VAL-T's future second-kind positive case remains conditional. Formal VAL-001
stays P1 OPEN until implementation qualification. Canonical activation is NOT YET AUTHORIZED.
Before the first real fixture activates, audit its additional authored type-170 kinds; any such
kind requires an accepted specialization. No IDN/PRJ/EVID/REG/ADAPT semantic change is authorized.

The authorized [additive numeric proposal](VAL_PERMANENT_ALLOCATION.md) assigns proposed record schemas
329/1 and 330/1 and two text members in existing RegistryKindId/1023. Its machine companion
and mechanical audit agree. The numeric proposal awaits acceptance; no new namespace, runtime
implementation or permanent reassignment occurs. Campaign-2 allocation/0.2-candidate is unchanged.
After numeric acceptance: authoritative factory design → implementation → VAL/inherited
conformance and mutants → build/release qualification → formal VAL closure.


## VAL permanent allocation frozen — 2026-09-06

The allocation review's conditional machine gate passed: [val-allocation/0.1-candidate](VAL_PERMANENT_ALLOCATION.md)
is PERMANENT AND FROZEN. Records 329/1 and 330/1 and the two RegistryKindId/1023 members are
permanent. No new namespace, renumbering or reuse; future additions append. The Campaign-2
allocation table's complete bytes and the reused StableId assignments are unchanged.

RequiredSemanticKind qualification belongs solely to VAL construction; no additive PRJ
CanonicalRoleConstraint is introduced for that definition field. Malformed declarations use
INVALID_CONFIGURATION; runtime CharacterId qualification retains CANONICAL_ROLE_VIOLATION.
ContentSchema requires no new identity role. VAL-A..W remain NOT PASSED; formal VAL-001 remains
P1 OPEN and canonical activation remains gated. Next substantive work is authoritative
Campaign-2 factory design, implementation and build/release qualification. No runtime code
or phenomenon proof is supplied by this allocation acceptance.


## Campaign-2 authoritative factory design pass 1 — 2026-09-06

[Factory design](../planning/CAMPAIGN2_FACTORY_DESIGN.md) maps accepted VAL/PRJ/IDN/EVID/REG/ADAPT contracts onto the actual
content, identity, scheduler, transition, state and persistence APIs. It specifies a data-only
public facade, internal runtime compilation, the accepted seven-stage construction order and
restore checks before exposing an active handle. Existing callbacks, handler maps, adapter hooks
and independent work-limit values cannot be supplied to this path.

The first fixture's complete manifest, exact persistence projections and ContinuingRunInputs
mapping remain explicit readiness items. No implementation or activation is claimed. VAL remains
P1 OPEN; its shape and additive allocation stay accepted, VAL-A..W remain NOT PASSED and no
accepted seam or numeric allocation is reopened. Next: concrete profile binding, then factory
implementation and qualification under the recorded FCT-1..6 work packages.


## Factory design pass 2 / C2-PERSIST-001 intake — 2026-09-06

The pass-1 review accepts factory direction, data-only APIs, declaration-derived construction,
restricted handles and fresh-process restore direction; implementation-design acceptance is
WITHHELD. [Pass 2](../planning/CAMPAIGN2_FACTORY_DESIGN.md) corrects EVID to zero state/subject reads (unbound observers succeed),
adds explicit OBS/SEM adapters, closes every-entry registry admission, distinguishes initialization
from WRT writes, and requires identity recomputation from source operands. FCT-A..F are frozen
NOT PASSED. The same stale EVID projection sentence in VAL acceptance bookkeeping is corrected
to match accepted EVID; no VAL or EVID predicate changes.

[C2-PERSIST-001](../planning/CAMPAIGN2_PERSISTENCE_CLARIFICATION.md) is the narrow OPEN persistence-profile decision found by inspection:
accepted save contracts name metadata but do not fix its Campaign-2 derivations. The proposal
specifies REG model-derived field 8 and exact empty fields 9/10 only for an explicitly admitted
no-draw/no-coupling first profile. These choices and profile-version binding are NOT accepted;
PERSIST-A..H remain NOT PASSED. Whole-factory/FCT-5 restore, integrated activation and VAL
qualification remain gated. Independent accepted codec/interpreter/model-definition work may
proceed; no implementation was performed in this revision. Frozen allocations remain unchanged.


## Factory shape acceptance / persistence revision 2 — 2026-09-06

The review accepts [factory pass 2](../planning/CAMPAIGN2_FACTORY_DESIGN.md) in shape and closes its prior organization
blockers. Persistence fields 9/10 and the bounded-profile strategy are accepted. Overall
C2-PERSIST shape acceptance was WITHHELD for field 8. [Persistence revision 2](../planning/CAMPAIGN2_PERSISTENCE_CLARIFICATION.md)
retracts the unaccepted REG mirror: field 8 is exact list([]), since this profile admits no
run-owned analytical anchor. REG references remain solely model declarations, verified through
RegistryIdentity/ModelIdentity and used to check saved ADAPT state at T. Fields 9/10 stay exact
list([]) for the independently proven no-RNG/no-coupling capabilities.

PERSIST-A/B/C are revised; all PERSIST and FCT controls remain NOT PASSED. C2-PERSIST-001
remains OPEN for review of the corrected profile. Exact first RulesVersion → accepted semantic
bundle → persistence-profile binding is required before FCT-5, not before persistence shape
review. No new record, namespace, allocation or save-schema change; no VAL/ADAPT/EVID/REG/IDN/PRJ
reopening. No implementation or activation was performed.


## Persistence shape and factory implementation-design acceptance — 2026-09-06

[C2-PERSIST-001 revision 2](../planning/CAMPAIGN2_PERSISTENCE_CLARIFICATION.md) is SHAPE ACCEPTED at campaign2-persistence/0.1-candidate.
[Factory pass 2](../planning/CAMPAIGN2_FACTORY_DESIGN.md) is IMPLEMENTATION DESIGN ACCEPTED. No remaining architecture
blocker is identified. Fields 8/9/10 are exact list([]), independently justified by no run-owned
analytical continuation, RNG consumer or continuing coupling in AdmittedExecutionClosure(M,P).
The closure covers all model-admitted definitions/branches and fixed profile infrastructure;
extra build-supported contracts outside that model do not change it. PERSIST-I protects this
distinction. REG anchors remain model-owned, with no save-field mirror.

Staged implementation may begin FCT-1..4. Exact first-model inventory and normative one-to-one
RulesVersion ↔ accepted semantic bundle ↔ persistence profile binding remain before FCT-5.
FCT-6 and VAL-A..W, PERSIST-A..I, FCT-A..F plus inherited mutants remain NOT PASSED. Authoritative
activation is NOT YET AUTHORIZED. Formal proof closure remains pending; shape acceptance does
not close VAL or ADAPT. No new allocation, save-schema field or identity family is introduced.


## FCT-1/2 incremental implementation; origin binding decision — 2026-09-06

Implemented structural Campaign-2/VAL codecs and closed VAL declaration/CONTENT compilation.
Full source suite: 40 files / 325 tests PASS; TypeScript and reference import boundary PASS.
These are component results, not VAL/factory/phenomenon qualification. No authoritative activation.

[C2-ORIGIN-001](../planning/CAMPAIGN2_ORIGIN_BINDING_DECISION.md) now records accepted alternative 2: exactly two nested origin
families, structural authored resolution through the complete content StableId, and runtime
ordinals allocated once by the existing shared run allocator. Test 20/21 promotion is rejected.
IDN qualification is unchanged. The accepted SEM conformance correction preserves historical
corpus evidence without asserting old/new canonical byte or identity equivalence.

The symbolic contract is SHAPE ACCEPTED at referent-origin/0.1-candidate. The conditional
numeric verdict plus the passed 43-check machine audit freezes origin-allocation/0.1-candidate:
1037 AuthoredContentOriginId and 1122 RuntimeEntityOriginId. Existing permanent tables are
unchanged. The origin semantic/allocation decision is closed; profile qualification remains separate.

Origin construction, recursive SEM/Campaign-2 codec checks, and exact authored CharacterId
qualification are implemented incrementally. SEM regression fixtures now explicitly construct
nested authored identities; historical PHEN-SEM evidence is not relabeled or claimed byte-equivalent.
Runtime interleaving and canonical save/load continuation have new regression evidence.
FCT-3 has begun with recursive declared record-role validation and exact duplicate/position checks.
Key-grammar coverage, state/projection integration, remaining model compilation, factory activation
and integrated VAL/persistence gates remain pending. See CAMPAIGN2_ORIGIN_IMPLEMENTATION.md
in docs/planning for the bounded proof map and remaining integration obligations.


## First-model content StableId governance decision — 2026-09-06

Origin allocation remains permanent and frozen. FCT-3 now also includes keyed-family coverage,
read-only disjointness, state/path/restore/read/patch validation and IDN's exact immutable-family
declaration checks. The source suite passed 42 files / 338 tests; one added IDN closure control
then passed in the five-test state-model suite (current inventory 339).

[C2-CONTENT-ID-001](../planning/CAMPAIGN2_CONTENT_STABLE_ID_DECISION.md) records the next first-model
authoring choice: the permanent identity authority for GovernedContentDefinition.StableId.
Only fixture homes 23000 and 20 were found for concrete content IDs; structural representability
is already settled. A shared CONTENT-owned GovernedContentDefinitionId is proposed for the
existing slot, without another copy, origin family or CharacterId namespace. No new numeric
allocation or global StableId role restriction is made. Existing accepted seam semantics remain
fixed; the decision concerns the first authoritative producer's identity home.


## C2-CONTENT-ID-001 resolved — 2026-09-06

Symbolic GovernedContentDefinitionId accepted under content-definition-id/0.1-candidate.
Separate content-ID allocation audit passed all 37 checks; namespace 1038 is permanent and frozen.
No previous allocation bytes changed, no fixture family was promoted, and no global role
constraint was added to 170/1. First-profile construction requires this family; generic CONTENT
remains polymorphic. Constructor, codec family grammar, profile compiler and six component tests
are implemented. FCT-3 construction continues; authoritative activation remains gated.

Continued FCT-3 component work: closed REG construction/reference validation and shared V04
occurrence/output construction now have focused controls. Full source suite 45 files / 355
tests and production build PASS. See CAMPAIGN2_CONTENT_ID_IMPLEMENTATION.md for exact proof
limits and remaining runtime/activation gates. These are not integrated campaign verdicts.

## Admitted-input implementation checkpoint — 2026-09-06

Review retains frozen allocations and incremental acceptance, with no new symbolic decision.
Internal V04 generated ingress, opaque admitted-input capability, required PRJ field projection,
IDN roster-channel closure and execution-local EVID allocation checks now have component controls.
The real scheduler control covers a bounded EVID chain and forged/duplicate ingress rollback.
Generic REG/IDN family polymorphism is explicitly tested. Full source suite 45 files / 362 tests
and build PASS; four allocation audits unchanged. See CAMPAIGN2_ADMITTED_INPUT_IMPLEMENTATION.md
for FCT-G..L evidence and limits. Full SEM/factory lifecycle, remaining PRJ/IDN controls, V06/ADAPT
construction, FCT-4+ and independent integrated qualification remain OPEN. No global gates inferred.

## Composed PRJ and V06 construction checkpoint — 2026-09-06

Admitted-input review accepted FCT-G..L as COMPONENT PASS only. Composed PRJ/IDN construction
now exercises accessor uniqueness, disjoint storage, grammar coverage, both role-compatibility
directions, recursive composite-key checks and alternate roster rejection in one admitted contract.
ADAPT topology/domain/static-state validation and V06 rule/declaration refinements have component
controls. Shared transition construction admits exact V04/V06 rows under the unchanged V04
singleton; no second ADAPT runtime authentication mechanism is introduced. Runtime V06, D/E,
exclusive phase-140 lifecycle and FCT-4+ remain pending.

Bootstrap inspection found C2-INPUT-ENC-001: no accepted canonical layout was found for the five
unscheduled input-entry operands. This is a first-profile byte/restore-language choice, not an
architectural or scalar expressibility failure. A concrete five-item canonical-list proposal
is ready in CAMPAIGN2_ORDERED_INPUT_ENCODING_DECISION.md; no entry codec/allocation was made.

### Accepted FCT-C qualification scope — 2026-09-07

The user accepted FCT-C = C1 generic roster invariance AND C2 forbidden subject projection
AND C3 bounded-profile exclusion. No roster-capable factory profile, allocation, or changed
RulesVersion/ModelIdentity is required. The positive obligation remains mandatory at the
generic accepted EVID/PRJ/IDN level; bounded rejection alone never substitutes for it.
[Scope and executed evidence](../planning/CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md).
This scope ruling does not close VAL, ADAPT or Campaign 2.

### Diagnostic regulatory probe research target — 2026-09-07

Accepted as the first later-challenge target: diagnostic R0(C,V,T)+D(C,V), using only the exact
displacement leaf and accepted immutable REG operations at T1 > T0. A separate governed probe
opportunity and explicit availability/observer permission are required. The bounded .2 fixed-pulse
model stays frozen. Drafting only is authorized; response laws, allocation and implementation are
not authorized. [Current draft](../planning/CAMPAIGN2_REGULATORY_PROBE_DRAFT.md).

RESOLVED scope decision: user accepted first observer-accessible divergence at permitted 203;
X/E/L must remain byte-identical with matched observation/support IDs. No SEM/EVID carriage
amendment is required or authorized. The future carriage trigger is a cognitive/learning consumer
needing to distinguish permitted scalar values at identical support topology. EVID stays zero-read.
ADAPT-9a/9b are proof labels only: this probe may later witness 9a, not the first cognitive
divergence required by 9b. Parent ADAPT control 9, PHEN-ADAPT-001 and Campaign 2 remain open.
Revision 2 proposes remaining probe shapes and PROBE-M; no shape acceptance or runtime PASS.

Revision-2 review accepts the exact displacement-only capability and absolute diagnostic
measurement semantics, and accepts definition/channel/truth and fixed-budget strategy in direction.
Whole shape remains withheld. Revision 3 corrects truth n versus observation q, specifies all eight
new symbolic EventTypeId members and the exact parent chain, closes private raw-ordinal padding
with the normative five-advance budget, and adds PROBE-N/O. These corrections await whole-shape
review; no allocation/implementation or ADAPT/PHEN gate closure follows.

### Regulatory probe whole-shape acceptance and allocation review — 2026-09-07

User accepts regulatory-diagnostic-probe/0.1-candidate in whole shape, including private padding,
fixed event topology and trace mapping in shape. [Formal acceptance](REGULATORY_DIAGNOSTIC_PROBE.md)
records the InputOnly source/restore clarification and PROBE-P. PROBE-A..P remain FROZEN, NOT PASSED.
No semantic blockers are identified; implementation remains unauthorized.

The authorized separate [allocation review](REGULATORY_PROBE_ALLOCATION_REVIEW.md) proposes records
331..335, RegulatoryProbeTruthId namespace 1123, twelve existing-family members, local carrier tags
and field/role assignments. Its 224-check mechanical audit passes, preserving prior allocation
artifacts. Numeric acceptance is still pending: no proposed number/member is marked permanent.
New profile/RulesVersion/ModelIdentity packaging follows that gate. ADAPT-9b, parent control 9,
PHEN-ADAPT and Campaign 2 remain open.

### Probe allocation freeze condition satisfied — 2026-09-07

Numeric review accepted 331..335, namespace 1123, twelve permanent members and identity roles,
conditional on governed type-259 carrier variants. The original table had layout rows only;
the corrected table explicitly specifies exactly three registry entries with namespace-1024
StableIds [335,1..3], registry/union-variant-definition, union-variant/1 and the exact field sets.
All 240 allocation checks pass, including prior artifact preservation. Under the conditional
ruling, regulatory-probe-allocation/0.1-candidate is PERMANENT AND FROZEN. No renumbering.

The [new profile packaging draft](../planning/CAMPAIGN2_PROBE_PROFILE_PACKAGING_DRAFT.md)
proposes exact RulesVersion/profile bindings and the six-slot model delta. Packaging acceptance,
ModelIdentity materialization and implementation remain gated; PROBE-A..P are not passed.

### Probe packaging accepted; model bytes submitted — 2026-09-07

User accepted the exact probe RulesVersion and whole registry/input/trace/persistence bindings,
clarifying canonical positions 0..5 and no old-profile fallback. Review compiler and materialization
are authorized; authoritative runtime is not. [Materialization packet](../planning/CAMPAIGN2_PROBE_MODEL_MATERIALIZATION.md)
derives ModelIdentity 2cc10295fc9c8f8b0777fc0ac56c526bcc4f4d26ec865bcad3776d696d5bf454.
Fresh-process delete/rematerialize proof, old-artifact preservation, 459 tests and build pass.
Concrete-byte freeze is pending; PROBE-PACK component evidence does not pass runtime/parent gates.

### Probe model frozen; accessor completion requested — 2026-09-07

User accepted/froze the seven-artifact probe packet and ModelIdentity
2cc10295fc9c8f8b0777fc0ac56c526bcc4f4d26ec865bcad3776d696d5bf454. Runtime implementation is
authorized under probe rules only. PROBE-MODEL-BYTE-A PASS is materialization evidence, not runtime.
InputOnly source component implementation has begun; no authoritative public probe activation yet.

OPEN narrow naming gap: the accepted exact D ActualReadRecord requires a ProjectionAccessorId,
but the frozen probe inventory names none. [Concrete proposal](../planning/CAMPAIGN2_PROBE_ACCESSOR_REVIEW.md)
requests one symbolic member in existing 1028 and explicit disposition of the frozen model/version.
No member, new model or altered trace semantics is assumed before that ruling.

### Probe accessor symbol accepted; successor commitment required — 2026-09-07

User accepts ProjectionAccessorId/1028("accessor/regulatory-diagnostic-displacement-prior")
symbolically and authorizes append-only member allocation. Preservation of the frozen probe .1
RulesVersion/ModelIdentity for the new read trace is explicitly rejected. Probe .1 stays historical;
the narrow owner is a successor trace profile, with unchanged probe semantics/path and registry.

[Member review](PROBE_ACCESSOR_MEMBER_ALLOCATION_REVIEW.md) passes 43 mechanical checks and
remains REVIEW CANDIDATE. [Successor proposal](../planning/CAMPAIGN2_PROBE_TRACE_SUCCESSOR_DRAFT.md)
specifies probe trace .2 and probe RulesVersion .2, unchanged other profile bindings and a projected
RulesVersion-only ModelIdentity delta. No successor bytes or numeric freeze is presumed. D-read trace,
probe wrappers and final runtime qualification await the member/binding/successor-model gates.

### Probe accessor permanent; .2 binding accepted and materialized — 2026-09-07

User froze probe-accessor-member-allocation/0.1-candidate and accepted probe trace/RulesVersion .2.
All other profile bindings and underlying probe seam remain unchanged; PROBE-ACCESSOR-E forbids
retroactive .1 read-trace activation. The member audit passes 43 checks.
[Successor packet](../planning/CAMPAIGN2_PROBE_SUCCESSOR_MATERIALIZATION.md) derives
fda39ae4a8d82cbf531b41ce35c9af7ebb2ec5c7f233c4f7adbd7e6d7eba80e9 with only ModelIdentity field 1
changed and all six component artifacts identical. Fresh-process reproduction, 45 prior-file
preservation and build pass. Concrete successor freeze remains pending before authoritative trace.

### Probe .2 frozen; authoritative runtime and accessor controls — 2026-09-07

The user's subsequent ACCEPT AND FREEZE ruling closes PROBE-ACCESSOR-MODEL-BYTE and freezes
the successor packet/digest above. All manifests are unchanged from probe .1, which remains
immutable historical evidence. Authoritative implementation under .2 is now authorized and
implemented. [Runtime qualification](../planning/CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md)
records executed PROBE-ACCESSOR-A..E PASS, permitted scalar divergence with equal X/E/L,
suppression/allocator controls, rollback/restore evidence and seven detected implementation
mutants. Build and regression checks pass; whole PROBE-A..P and Campaign 2 remain open.

PROBE-F scope disposition is now requested: the frozen public specimen commits constant REG,
so the valid time-varying production-component witness is rejected by that exact public model.
Proposed split is generic REG + production probe positive evidence with frozen public exclusion;
the alternative requires separately reviewed time-varying model commitment. No widening of
the frozen compiler or complete PROBE-F PASS is authorized by these component results.

### 2026-09-07 — PROBE-F split accepted; transactional controls expanded

User accepts F1 generic accepted REG + production probe consumer and F2 exact frozen public
profile exclusion, with PROBE-F PASS iff both pass. Both witnesses pass, including exact scalar
differences and the time-only negative interpretation. No temporal model commitment is needed;
frozen probe .2 remains narrow and unchanged. [Qualification](../planning/CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md) records this disposition,
32 passing event-slot rollback/recovery cases and fresh-process full-save continuation PASS.
Whole PROBE-A..P, ADAPT-9b, parent control 9 and PHEN-ADAPT remain open.

Pass-2 final verification: 80 test files / 523 tests, production build and reference boundary
PASS. Probe arithmetic now receives detached R0/D operands; ten forbidden capability requests
reject. Signed-domain and child-forgery witnesses pass, as do refreshed seven-mutant and six-
substitution padding audits. Full probe qualification remains open; no broader gate is inferred.

### 2026-09-07 — probe qualification pass 3; output-closure correction

Allocation failure/recovery (18 cases), public InputOnly origin/restore controls and irrelevant-
state invariance pass. An adversarial producer exposed missing output-count validation: extra
learning could commit outside EVID. Exact per-slot output cardinality/type now rejects that
substitution; archive validation also requires exact producer projections and ordered output
closure. Raw observation/truth freeze substitutions reject. The failure and correction are
retained in CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md. Frozen contracts/model bytes are unchanged;
PROBE-F split and accessor PASS remain. Whole probe and parent campaign gates remain open.

Pass-3 verification: 84 files / 549 tests, build, fresh-process continuation and frozen successor
byte verification PASS; 45 prior artifacts preserved. No contract or allocation change.

### 2026-09-07 — assembled probe qualification submitted for review

Pass 4 adds the matched-allocation scalar witness, twelve detected read/carriage substitutions,
four detected numeric substitutions and six rejected SEM source-audit mutations. No production
semantics or frozen bytes change. CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md proposes the whole
PROBE-A..P verdict with exact runtime/component/audit scopes; acceptance is not presumed.
ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain open.

### 2026-09-07 — regulatory diagnostic probe runtime QUALIFIED

User accepts PROBE-A..P PASS under regulatory-diagnostic-probe/0.1-candidate and frozen probe
rules .2; accessor A..E remain PASS. ADAPT-9a PASS: retained state changes later permitted
observation (5 versus canonical 51/10), while matched X/E/L remain equal. F retains F1/F2
generic temporal + public exclusion (no temporal public model). G explicitly retains G1
public positive, G2 generic signed-domain production consumer and G3 public exclusion.
PROBE-L PASS for this accepted seam; no broader learning semantics inferred. Preserve the
real output-closure defect and corrected exact producer validation in the research history.
ADAPT-9b, parent control 9, PHEN-ADAPT-001, ADAPT-001 formal campaign verdict and Campaign 2
remain OPEN. Cognitive numeric/semantic carriage requires its own phenomenon target and seam.

Next research target proposed in CAMPAIGN2_COGNITIVE_EVIDENCE_TARGET_REVIEW.md: observer-safe
measurement evidence made available to a named cognitive consumer, with explicit first-content
divergence and hidden-truth invariance. Target selection is pending; no record shapes, allocations,
implementation, ADAPT-9b sufficiency or persistent learning updates are chosen.

### 2026-09-07 — measurement-evidence carriage target accepted; revision 1 drafted

User accepts the observer-safe measurement-evidence carriage target and authorizes inspection-
first drafting only. Existing X/E/L, probe .1/.2 and PROBE-M remain unchanged; persistent updates,
learning/appraisal/reward and ADAPT-9b are not selected or passed.
CAMPAIGN2_MEASUREMENT_EVIDENCE_CARRIAGE_DRAFT.md inspects 203/204, metadata-only SEM-G reference
resolution, EVID and closed transition/profile admission. It proposes a named observer-owned
MeasurementEvidenceIntake, self-contained exact 203 plus admitted unit context, a transient output
occurrence, explicit authenticated producer admission and a separately committed successor profile.
Revision 1 proposed a new producer/route and schema/codec/profile support as blockers; the route
proposal is withdrawn by the revision-2 disposition below. Proposed
EVC-A..P are not passed; all new names remain symbolic. No numeric allocation or code change.

### 2026-09-07 — measurement-evidence carriage revision 2 submitted

User accepts the core epistemic design, exact embedded 203 plus UnitId, named transient intake,
present-only domain, observer ownership and no writes; whole shape remains WITHHELD.
CAMPAIGN2_MEASUREMENT_EVIDENCE_CARRIAGE_DRAFT.md revision 2 addresses all three review blockers:
no new LearningRouteId or intake TransitionRoutes entry; shared successor ingress alone generates
the real intake child, with separate profile-owned suppression padding; exact 203 field-1 role
(namespace 1115, no validator) is reused and its absent occurrence rule is explicitly added to
the proposed successor. The new output has its own matching symbolic field-1 rule and role.
Proposed transition-admission/0.7-draft preserves .4 and the separate .6 extension. Conditional
ingress/padding counts retain six ordinal advances and eight generated children. EVC-A..P are
revised proposals, NOT PASSED. Whole-shape review is next; no allocation or implementation is
authorized. ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

### 2026-09-07 — measurement-evidence carriage revision 3 submitted

User closes all revision-1 blockers and accepts the carriage representation, observer-owned
consumer, no-route boundary, shared ingress, occurrence governance and scheduling topology.
Whole shape remains WITHHELD solely for version ownership. Revision 3 withdraws the preceding
transition-admission/0.7-draft proposal: the shared singleton stays transition-admission/0.4-candidate,
cardinality one, with new occurrence entries as committed data under its unchanged map grammar.
Carriage instead proposes transition-admission-extension/0.7-draft (intended accepted spelling
transition-admission-extension/0.7-candidate), a separate NoStateWrites-only registration grammar.
An explicit matrix preserves V04 EVID and V06 ADAPT rows and dispatch by committed DefinitionVersion;
no latest-version selection or fallback decoding. EVC-O includes these preservation/rejection
obligations. See CAMPAIGN2_MEASUREMENT_EVIDENCE_CARRIAGE_DRAFT.md revision 3. Whole-shape review
is next; EVC-A..P are not passed, allocation and implementation remain unauthorized. ADAPT-9b,
parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

### 2026-09-07 — measurement-evidence carriage WHOLE SHAPE ACCEPTED; allocation proposed

User accepts measurement-evidence-carriage/0.1-candidate and the separate NoStateWrites-only
transition-admission-extension/0.7-candidate registration grammar. The V04 shared singleton and
V04/V06 registrations remain unchanged in semantics; only successor occurrence-map data extends.
The first V07 profile admits only AuthenticatedObserverMeasurementProducer; any other producer
form requires separately committed registration semantics. EVC-A..P are FROZEN, NOT PASSED.
Current authority: docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE.md; the revision draft is review history.

Authorized separate allocation pass proposes records 336..341, dedicated occurrence namespace
1124 and six NFC members in existing namespaces. No new producer union, write capability,
LearningRouteId member, state root or observation identity. See
docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE_ALLOCATION_REVIEW.md and its machine table/audit.
The allocation audit passes 195 consistency/preservation checks; values remain REVIEW CANDIDATE,
not permanently assigned. Numeric acceptance is next; successor registry/profile packaging and
materialization follow afterward. Implementation remains NOT YET AUTHORIZED. ADAPT-9b, parent
control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

### 2026-09-07 — carriage allocation ACCEPTED AND FROZEN; packaging revision 1

User permanently accepts measurement-evidence-carriage-allocation/0.1-candidate: records 336..341,
occurrence namespace 1124, six existing-family members and exact role/occurrence governance.
Zero new union variants, learning routes or padding identities. Pre-promotion audit passed 195
checks; lifecycle-aware frozen audit passes 197. Existing frozen authority and model packets
remain byte-identical. EVC-A..P remain FROZEN, NOT PASSED.

Successor registry/profile packaging is authorized. CAMPAIGN2_MEASUREMENT_EVIDENCE_PACKAGING_DRAFT.md
revision 1 proposes rules/campaign2-measurement-evidence/0.1-candidate with four exact whole
profiles, six-slot delta, sole V04 singleton plus unchanged V04/V06 and new V07 rows, fixed
336/channel association, source/trace/restore closure and separate materialization obligations.
EVC-PACK-A..H are proposed, NOT PASSED. Packaging acceptance is next; no model bytes have been
materialized and runtime implementation remains unauthorized. ADAPT-9b, parent control 9,
PHEN-ADAPT and Campaign 2 remain OPEN.

### 2026-09-07 — carriage packaging revision 2; ordered-input identity corrected

User accepts registry/trace/persistence successors, six-slot delta, source authority and topology;
whole packaging remains WITHHELD for the sole ordered-input identity correction. Revision 2
withdraws the new measurement-evidence input profile and directly binds the accepted
campaign2-probe-ordered-input/0.1-candidate under the new RulesVersion. EVC-PACK-C specifies
that exact tuple and EVC-PACK-I adds canonical initial-source equivalence to frozen probe .2
with only enclosing-model RunIdentity differences. The complete phase-120 trace envelope is
successor-owned; padding uses the carriage seam/version without becoming V07 execution.
See CAMPAIGN2_MEASUREMENT_EVIDENCE_PACKAGING_DRAFT.md revision 2. No semantic redesign or
allocation. Materialization waits for packaging acceptance; implementation remains unauthorized.
EVC-A..P remain FROZEN, NOT PASSED; EVC-PACK-A..I are proposed, NOT PASSED. ADAPT-9b and
Campaign 2 remain OPEN.

### 2026-09-07 — carriage packaging ACCEPTED; concrete model review ready

User accepts whole packaging revision 2 and freezes EVC-PACK-A..I as NOT PASSED; concrete
materialization is authorized, runtime remains blocked until ModelIdentity freeze. The isolated
review materializer produces rules/campaign2-measurement-evidence/0.1-candidate with digest
8dec83b33366ea13217db0005942f9e159ff2e36402c241231af5d5e1f04d22c.
CAMPAIGN2_MEASUREMENT_EVIDENCE_MATERIALIZATION.md and the separate packet record seven canonical
artifacts/readable counterparts, exact 31-entry bundle/profile tuple, four model variants, slot-0
nine additions/one singleton replacement, slot-5 eight additions, unchanged slots 1..4 and
87 preserved prior files. Materialization reports 102 checks; fresh-process deletion/recreation
and independent verification reproduce all 15 packet files.

PACK findings are explicitly component-scoped: review-model structure/profile checks and bounded
source equivalence pass, while authoritative V07 dispatch, carriage topology and restore remain
unimplemented. No blanket PACK-A..I or EVC-A..P PASS. Concrete ModelIdentity review/freeze is
next; no runtime activation. ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

### 2026-09-07 — carriage ModelIdentity FROZEN; runtime qualification proposed

User accepts the positive seven-artifact packet and four control ModelIdentity representations
at rules/campaign2-measurement-evidence/0.1-candidate, digest
8dec83b33366ea13217db0005942f9e159ff2e36402c241231af5d5e1f04d22c.
EVC-MODEL-BYTE PASS covers identity construction, registry delta, reproducibility and historical
preservation only. Runtime implementation is authorized under this exact new RulesVersion.

Implemented production model admission, V07 shared ingress, shared occurrence extraction,
detached 203-to-337 intake, private padding, six/eight closure, successor trace and archive/restore.
The restore dispatch omission found during the first focused pass was corrected and retained
in review history. Full active regression: 86 files/563 tests PASS before five additional
carriage controls; final focused suite: 18 tests PASS. Type-check/build/reference-boundary PASS.
Fresh-process runtime continuation PASS; rematerialization reproduces 15 files, preserving 87
prior files. Allocation audit 197 PASS. Historical probe semantics remain unchanged.

CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md requests bounded PACK/EVC disposition,
separating EVC-B's governed R0/D component witness from the public changed-anchor exclusion.
Qualification acceptance is not presumed. Next decision: qualification/scope review, then a
responding cognitive mechanism target. ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2
remain OPEN. No persistent cognitive update, new route or further allocation is selected.
