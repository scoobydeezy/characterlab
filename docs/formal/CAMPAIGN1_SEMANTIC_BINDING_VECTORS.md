# Campaign 1 Semantic-Binding Conformance Vectors

**Status:** active candidate manifest, version `campaign1-semantic-binding-vectors/0.1-candidate`

These vectors govern `semantic-binding/0.1-candidate`, `SEM-001`, and `PHEN-SEM-001`. Campaign 0 vectors and accepted bounded-observation vectors remain mandatory substrate controls. A row may execute when its named subdecision has enough exact symbolic structure to test it; passing a subset never accepts the parent contract and authorizes only the exact symbolic registry, phase, or provenance scope explicitly accepted by that subdecision. Permanent semantic record IDs remain blocked until the parent gate assigns them.

| Vector | Required proof | Current evidence |
|---|---|---|
| `CV-SEM-001` | Two world events containing identical referents in different `EventRoleId` bindings produce structurally distinct truth bindings and permitted perceived bindings. | pending |
| `CV-SEM-002` | One referent simultaneously occupying several event roles retains every binding occurrence; no referent-keyed deduplication occurs. | pending |
| `CV-SEM-003` | Visibility is binding-specific. Mina, Darius, and Glen receive exactly their declared permitted binding sets from the same event. | pending |
| `CV-SEM-004` | A visible but unrecognized entity yields a `PerceptualReferentId` and no truth-side `SemanticReferentId`. | `PASS` — unfamiliar evaluation emits no resolution or truth identity |
| `CV-SEM-005` | Correct recognition and categorical misrecognition attach different resolutions to equal perceptual evidence without changing that evidence. | `PASS` — observer-owned cue intervention over immutable experience |
| `CV-SEM-006` | Later correction appends a replacement or withdrawal resolution; the original experience, evaluation, and contemporaneous resolution remain byte-identical. | `PASS` — append-only replacement/withdrawal chain |
| `CV-SEM-007` | Truth binding IDs and truth referent IDs are structurally absent from character evidence. Stable opaque-handle equality cannot reveal that two hidden sources are equal. | pending |
| `CV-SEM-008` | `EventRoleId` and `CausalRoleId` remain independently present and typed; deriving a causal role cannot erase or mutate event-role evidence. | pending |
| `CV-SEM-009` | Character-relative causal-role evidence changes only when permitted observations change, never when only hidden truth-side causal structure changes. | pending |
| `CV-SEM-010` | Every perceived binding has complete omniscient trace ancestry to one truth binding and observation operation, while the character projection cannot traverse that ancestry. | pending |
| `CV-SEM-011` | Scalar measurement evidence is referenced as supporting evidence and is neither required for every binding nor treated as referent identity or role evidence. | pending |
| `CV-SEM-012` | Deterministic omniscient, contemporaneous-character, and current-reinterpretation renderers consume typed records; changing presentation metadata changes no authoritative record. | pending |
| `CV-SEM-013` | Perceptual-referent allocation is independently monotonic per observer, persists across save/load, never reuses an ordinal, and is invariant to other observers' allocations. | contract accepted by `SEM-001A`; implementation pending |
| `CV-SEM-014` | Invalid registry IDs, multiplicity, hidden references, forged perceptual IDs, illegal causal derivation, or noncanonical order abort the complete instant with no committed state, allocation, trace, or output. | pending |
| `CV-SEM-015` | Equal truth-side semantic facts with different permitted sensory evidence produce different perceptual classifications; hidden facts never copy through merely because they are registered. | pending |
| `CV-SEM-016` | Perceptual classification, track continuity, and instance recognition are independently intervenable: each can change while the other two remain structurally fixed where the fixture permits. | `PASS` — accepted classification/track controls plus immutable-experience recognition intervention |
| `CV-SEM-017` | Every perceptual classification uses a registered facet and exact declared value type; unknown facets, freeform tags, and wrong-typed values fail closure and roll back. Missing classification remains distinct from an explicit boolean-false assertion. | pending |
| `CV-SEM-018` | Classification alone produces no appraisal, affect, motive, pressure, or Reason. The `ClassificationToPressure` shortcut fails read-domain or receiving-seam closure. | pending |
| `CV-SEM-019` | False continuity: permitted sensory input deterministically continues one observer-relative track across two different truth entities; no truth comparison automatically corrects, ends, or replaces the track. | contract accepted by `SEM-001A`; implementation pending |
| `CV-SEM-020` | False discontinuity: one truth entity yields two separately allocated tracks after a declared perceptual break; later recognition may associate both tracks with the same semantic candidate without merging or rewriting either track. | `PASS` — separate track allocation plus independent equal recognition resolutions |
| `CV-SEM-021` | `PerceptualTrackTransition` is produced solely from permitted observer-side detections and supporting observations, with exact binary `NewTrack`/`ContinuesPriorTrack`; its tracking rationale is not automatically character-accessible semantic evidence. | contract accepted by `SEM-001A`; implementation pending |
| `CV-SEM-022` | Changing only another observer's track allocations or the opaque numeric ordinals of this observer's otherwise isomorphic tracks changes no classification, similarity, salience, appraisal, recognition score, or other psychological result. | contract accepted by `SEM-001A`; implementation pending |
| `CV-SEM-023` | One truth referent bound into two roles yields two independently identified `EventBinding` occurrences; neither truth construction nor perception deduplicates them by referent. | `PASS` — executable occurrence-preservation control |
| `CV-SEM-024` | Several truth referents bound into one repeatable role each retain a distinct binding occurrence; role-keyed storage or overwrite reports its first structural divergence. | `PASS` — executable repeatable-role control |
| `CV-SEM-025` | Two event types apply different cardinalities and optional narrowing validators to the same global role. Effective validation is always broad-domain AND event-type narrowing, so an event type cannot widen the role domain. | `PASS` — strike/drink instrument controls |
| `CV-SEM-026` | Missing required roles, prohibited roles, underflow, overflow, noncanonical rules, unknown roles, and wrong-domain referents abort before runtime allocation advances; a later staged failure after successful binding allocation restores the accepted scheduler allocator exactly. | `PASS` — exact typed failures plus real whole-instant rollback |
| `CV-SEM-027` | Event-binding identity survives structural copy and exact replay, is never reused, and changes no semantic grammar when only opaque allocated values differ between an explicitly coupled isomorphic comparison. | `PASS` — replay, construction-order, and shifted-ordinal controls |
| `CV-SEM-028` | The initial registry contains `Beneficiary` but no generic `Context`; `EventRoleId` and `CausalRoleId` cannot substitute, and role registry order creates no priority, salience, or causal weight. | `PASS` — registry/domain separation controls |
| `CV-SEM-029` | Permitted role observation independently preserves, coarsens to `Participant`, leaves unresolved, or omits a visible binding. Character output contains neither truth `EventBindingId` nor truth referent identity. | `PASS` — four-way epistemic projection control |
| `CV-SEM-030` | Version 0.1 rejects freeform binding qualifiers, duplicate `(EventRoleId, SemanticReferentId)` pairs, and redundant `Action` bindings in event types that already fix the action. | `PASS` — closure and fixed-action controls |
| `CV-SEM-031` | One experience containing two simultaneous perceived event-files preserves each file's Actor/Target/Instrument grouping; an ungrouped role bag cannot reconstruct the pairs. | `PASS` — event-grouping oracle preserves both relational frames |
| `CV-SEM-032` | One perceived event-file persists across several distinct experiences without equating `ExperienceId` and `PerceptualEventReferentId`. | `PASS` — many-to-many envelope/occurrence identity control |
| `CV-SEM-033` | False event continuity: two truth events remain one perceived event-file when permitted segmentation says continue; truth identity performs no automatic correction. | `PASS` — observer-side continue control |
| `CV-SEM-034` | False event discontinuity: one truth event produces two perceived event-files after an observer-side end/new decision; truth identity performs no automatic merge. | `PASS` — immutable end/new control |
| `CV-SEM-035` | Truth-event-keyed start/continue requests fail input/read closure. `CurrentEventDetectionId` and supporting evidence are observer-side and contain no truth event or action handle. | `PASS` — strict input closure rejects truth keys |
| `CV-SEM-036` | A truth `Action → action.skip_rope` binding creates neither a continuant-file Action binding nor perceived action classification without a separately permitted event-classification rule. | `PASS` — `ActionAsContinuantFile` and truth-copy controls |
| `CV-SEM-037` | One continuant-file may participate in several concurrent event-files, and several role bindings in one event-file may reference one continuant-file without deduplication or cross-association. | `PASS` — occurrence-specific grouping control |
| `CV-SEM-038` | Active event-files and each observer's next-event sequence survive structural save/load and replay exactly; allocations by another observer do not perturb this observer. | `PASS` — structural replay and observer-isolation control |
| `CV-SEM-039` | Shifting only event-file sequence values changes no role grouping, classification, salience, ordering importance, appraisal, or other psychological result. | `PASS` — ordinal-free grouping comparison |
| `CV-SEM-040` | A staged failure after event-file start/continue/end restores active event-file state and every observer allocator structurally exactly. | `PASS` — scheduler transaction rollback control |
| `CV-SEM-041` | One continuant-file can carry person-like, discrete-object-like, and interior-space-like appearance assertions without truth-kind leakage. A `PerceptualEventReferentId` cannot substitute as a continuant classification carrier. | `PASS` — independent continuant facets and carrier-type rejection |
| `CV-SEM-042` | Equal truth facts with different permitted feature evidence classify differently; equal permitted evidence with different hidden truth is character-byte-identical. World and perceptual facet IDs remain non-substitutable regardless of matching labels or ordinals. | `PASS` — evidence-only output and namespace closure |
| `CV-SEM-043` | `NoAssertion` emits no classification record. `Assert(false)` emits a present boolean record; `MissingAsFalse` and an `Unknown` sentinel fail exact closure. | `PASS` — optional derivation sum-type controls |
| `CV-SEM-044` | Missing feature evidence differs from explicit feature `false`; classification false requires traceable explicit negative feature evidence and cannot be derived from detector silence. | `PASS` — upstream missing/negative and negative-provenance controls |
| `CV-SEM-045` | Every emitted value is an exact boolean. Strings, numbers, symbols, category labels, and implicit coercions fail before allocation; independent kind-like facets may coexist without an exclusive-primary-kind rule. | `PASS` — exact value grammar and independent-facet controls |
| `CV-SEM-046` | Each classification names an executable governed rule and canonical unique feature/observation support owned by the same observer/detection context. Inputs contain no truth referent, binding, facet alias, stable truth handle, prose, or LLM step. | `PASS` — provenance and forbidden-field closure |
| `CV-SEM-047` | One ModelIdentity has exactly one authoritative rule per perceptual facet; missing or duplicate authority fails closure, while separate competing models may register different rules for the same facet. | `PASS` — sole-authority registry control |
| `CV-SEM-048` | One experience contains at most one assertion for each `(PerceptualReferentId, PerceptualFacetId)` pair. Duplicate or conflicting opaque records fail; multiple observations consolidate before emission. | `PASS` — experience assertion uniqueness control |
| `CV-SEM-049` | Shifting only `ClassificationEvidenceId` ordinals changes no semantic or psychological result; save/load/replay and later staged failure preserve or restore allocation exactly. | `PASS` — ordinal-free comparison, replay, and scheduler rollback |
| `CV-SEM-050` | Classification may emit only into pre-recognition experience assembly. It cannot bypass that envelope into identity/recognition or any psychological/world write domain, and an LLM or prose classifier cannot resolve as authoritative logic. | `PASS` — emission-target and executable-rule closure |
| `CV-SEM-051` | Event facets attach only to `PerceptualEventReferentId`; continuant/event facet namespaces and carriers are non-substitutable, regardless of matching labels or ordinals. | `PASS` — event-carrier and namespace closure |
| `CV-SEM-052` | Equal truth Action/EventType with different permitted event features classifies differently; equal permitted features with different hidden truth Action/EventType produces structurally identical character evidence. Direct truth action/type projection fails closure. | `PASS` — permitted-feature dependence and truth-action noninterference |
| `CV-SEM-053` | The rope-skipping-pattern conjunction returns true only with all three definitionally necessary explicit true features, false when any required feature is explicitly false, and `NoAssertion` when support is merely incomplete. Coarse facets remain independent; no hierarchy is implied. | `PASS` — exact three-valued conjunction and independent outputs |
| `CV-SEM-054` | Event-feature evidence cites one observer/event-file/detection window, canonical observations, and only observer-relative supporting continuants. A negative from another window fails scope; shared participants do not manufacture action meaning. | `PASS` — scoped provenance and cross-window-negative control |
| `CV-SEM-055` | False event merge may append different classifications to one event-file and false split may classify two event-files similarly; hidden truth never merges, splits, repairs, or rewrites classification history. | `PASS` — false merge/split historical preservation |
| `CV-SEM-056` | One event-file can receive classifications in several immutable experiences, while one experience rejects duplicate/conflicting `(PerceptualEventReferentId, PerceptualEventFacetId)` assertions. | `PASS` — append-only history and per-experience uniqueness |
| `CV-SEM-057` | One ModelIdentity has exactly one authoritative rule per event facet; missing/duplicate authority fails, while separate competing models may register different rules. | `PASS` — sole-authority registry control |
| `CV-SEM-058` | Every emitted event classification names an executable rule and typed feature/continuant/observation provenance. Truth handles, prose, and LLM results fail input or resolver closure. | `PASS` — exact provenance and executable-rule closure |
| `CV-SEM-059` | Shifting only `EventClassificationEvidenceId` ordinals changes no semantic/psychological result; replay preserves them, and staged failure restores runtime allocation exactly. | `PASS` — ordinal opacity, replay, and scheduler rollback |
| `CV-SEM-060` | Observed action appearance is event-pattern classification, never learned action-schema identity, a continuant `Action` binding, or a direct truth action key. Output enters only pre-recognition experience assembly and cannot bypass it into recognition, causal roles, psychology, options, or world truth. | `PASS` — experience-envelope integration and output-boundary closure |
| `CV-SEM-061` | A visible unfamiliar continuant-file with no uniquely supported catalog candidate emits no resolution and no truth identity. Missing, zero-candidate, explicit contradiction, and ambiguity remain traceable through immutable evaluations without storing `Unknown`. | `PASS` — evaluation/no-resolution distinction and exact no-update reasons |
| `CV-SEM-062` | Equal immutable perceptual evidence may yield a correct candidate, a wrong candidate, or no resolution when only permitted observer-owned recognition templates/cues differ. None mutates experience, classification, binding, or track. | `PASS` — correct/misrecognition/unresolved intervention |
| `CV-SEM-063` | `UniqueUncontradictedSupport` asserts only the sole qualifying candidate. Zero or several qualifiers produce `NoUpdate`; catalog order and first-candidate tie-break controls fail. Missing cues are not contradictions. | `PASS` — exact support/contradiction/ambiguity oracle |
| `CV-SEM-064` | Every candidate resolves through the observer's governed catalog. Identity claims require an observer-owned symbol→candidate mapping. Truth/event/trace injection, secret handles, and cross-observer catalogs fail; candidate-domain metadata cannot truth-filter a perceptual mistake. | `PASS` — catalog permission, mapped-claim, and no-truth-kind-filter controls |
| `CV-SEM-065` | Different-candidate evidence appends replacement; explicit contradiction without unique replacement appends withdrawal; mere cue absence and same-candidate reevaluation append no resolution but remain evaluated. History is immutable and revision chains cannot cross or branch. | `PASS` — assert/replace/withdraw/no-update lifecycle |
| `CV-SEM-066` | False continuity permits replacement or withdrawal on one unchanged track; false discontinuity permits the same candidate on two tracks. Recognition never splits, merges, ends, or truth-repairs either track. | `PASS` — recognition/tracking independence controls |
| `CV-SEM-067` | Every evaluation and resolution cites canonical typed cues scoped to its observer, track, experience/window, retained template/mapping, and observer-safe experience evidence. Generic IDs, cross-window/track reuse, truth handles, prose, and LLM output fail. | `PASS` — typed evidence and scope closure |
| `CV-SEM-068` | One ModelIdentity has exactly one authoritative continuant-recognition rule; missing/duplicate authority fails, while competing models may register different rules. Instance recognition rejects event-files and learned action-schema identity. | `PASS` — sole authority and carrier/output separation |
| `CV-SEM-069` | Shifting only evaluation/resolution IDs or opaque track/candidate ordinals changes no recognition semantics or psychological result; replay preserves results, invalid history fails, and staged failure restores allocation exactly. | `PASS` — ordinal opacity, history closure, replay, and rollback |
| `CV-SEM-070` | Recognition emits only immutable evaluations, append-only resolutions, and current-view projection. It cannot mutate perception or downstream cognition; same-candidate reevaluation emits no duplicate resolution. | `PASS` — emission boundary and evaluation/resolution separation |
| `CV-SEM-071` | Character-accessible evidence references form a closed tagged union of admitted observer-side record occurrences. `PerceptualReferentId`, `PerceptualEventReferentId`, `ExperienceId`, generic IDs, strings, and maps are scopes or identities rather than proof and cannot substitute as evidence references. | `PASS` — closed reference-union and identifier-role controls |
| `CV-SEM-072` | Admissibility requires an exact audited record-schema/producing-seam pair. Truth, trace, source, entity, hashed, encrypted, renamed, or otherwise opaque hidden handles fail structural closure; an ID type alone never makes its target safe. | `PASS` — schema/version admission and forbidden-linkage controls |
| `CV-SEM-073` | A record becomes evidence only through the consuming transition's typed `ReadDomain` and exact same-observer, temporal/window, modality, feature-scope, and carrier constraints. Cross-observer references are prohibited in v0.1. | `PASS` — relational evidence-admissibility oracle |
| `CV-SEM-074` | Explicit equality of observer-relative continuant/event-file identities permits their declared co-reference. False discontinuity creates no hidden equality edge, and a consumer constrained to one carrier cannot read evidence attached to another. | `PASS` — permitted co-reference and false-discontinuity controls |
| `CV-SEM-075` | Two records may expose a shared observer-safe source only by explicitly citing the same admitted record occurrence. Shared hidden ancestry creates no character link; secret-source fields fail even when equal or opaque. | `PASS` — explicit-safe-sharing versus hidden-common-source control |
| `CV-SEM-076` | Observer-safe occurrence IDs are fresh immutable citations, not semantic grouping keys. Shifting binding/evidence ordinals changes no derived causal-role semantics, similarity, salience, temporal distance, or psychological result. | `PASS` — occurrence freshness and ordinal-opacity comparison |
| `CV-SEM-077` | Missing evidence remains absence, not explicit false or contradiction. A future exact bounded/graded feature-evidence schema can be separately admitted without a generic confidence field, truth handle, binary-global-visibility assumption, or weakening of reference closure. | `PASS` — missing/present distinction and versioned-quality extension control |
| `CV-SEM-078` | The evidence→perceptual interpretation→recognition→retained state→appraisal ladder is enforced by narrow `ReadDomain`s. Character runtime has no generic trace-back, source, parent, or common-ancestor API, and later interpretation cannot rewrite its source evidence. | `PASS` — consumer capability and non-back-projection controls |
| `CV-SEM-079` | Character-relative causal-role evidence is an immutable derived claim about one continuant in one observer-relative event. Zero or several different roles may coexist; exact duplicate claims and recursive causal-role support are prohibited; event-role records remain unchanged. | `PASS` — governed multi-role causal derivation and sole-authority controls |
| `CV-SEM-080` | Equal permitted evidence with different hidden truth has equal character-relative provenance/causal results while omniscient ancestry remains trace-side. Replay is exact and failed commit restores allocation with no character output. | `PASS` — hidden-truth noninterference, replay, and rollback |
| `CV-SEM-081` | `ordering-phases/2-candidate` registers the exact current and consequence lane subphases plus phase 150 as a non-schedulable settlement sentinel. Phase gaps carry no duration or implicit permission. | `PASS` — exact registry and settlement-barrier closure |
| `CV-SEM-082` | The current lane executes observation 10 → tracking/event segmentation 11 → binding/features 12 → independent classification 13 → experience freeze 14 → companion causal roles 15 → recognition-input freeze 20 → recognition evaluation 21. Truth first available at phase 10 or later cannot reopen it. | `PASS` — current-lane chain and truth-cutoff control |
| `CV-SEM-083` | The consequence lane executes the corresponding 120..127 chain. It may observe phase-110 outcome truth, cannot schedule backward, and truth first available at phase 120 or later waits for a future observation opportunity. | `PASS` — consequence-lane chain, cutoff, and backward-scheduling control |
| `CV-SEM-084` | Lane admission reserves an `ExperienceId` only if character evidence will emit. Each successful reservation stages exactly one envelope; current/consequence reservations are distinct even when tracks/event-files continue. Orphans, duplicates, and failed reservations do not survive. | `PASS` — conditional reservation and bijective-envelope controls |
| `CV-SEM-085` | Phase 14/124 freezes and stages an immutable `SemanticExperience`; it does not independently commit. Phase 15/125 causal-role evidence is a separate experience-scoped companion record and cannot reopen or mutate the envelope. | `PASS` — immutable staging and companion-record separation |
| `CV-SEM-086` | Continuant and event-pattern classifiers share phase 13/123 but are scheduled canonically by domain, observer, carrier, rule, and tie-break. Their order grants no same-phase cross-read; a true dependency requires a later phase. | `PASS` — canonical independent-classifier scheduling |
| `CV-SEM-087` | Phase 20/126 freezes the exact recognition experience, catalog, template/mapping, cue, prior-resolution, and permitted retained-state projection consumed at 21/127. Consequence recognition may revise/withdraw current-lane recognition without rewriting phase-21 history. | `PASS` — frozen recognition input and same-instant correction |
| `CV-SEM-088` | Phase-130 character outcome evaluation consumes permitted expectation, consequence experience/recognition, and character state—not phase-110 authoritative outcome truth. Truth-side automatic adaptation is a separate route and cannot emit character `LearningEvidence`. | `PASS` — perceived-outcome and adaptation-route separation |
| `CV-SEM-089` | Recognition temporally precedes phase-30 belief/person-model application, but ordering grants no read capability. Same-instant belief consumption remains wholly unresolved under `ORD-001`. | `PASS` — temporal availability versus authorization control |
| `CV-SEM-090` | Ordinary events cannot schedule phase 150. Scheduler quiescence precedes final trace/invariant validation and atomic commit; barrier/closure failure rolls back the complete instant, reservations, allocators, trace, and outputs. | `PASS` — settlement sentinel and transactional rollback |

### Accepted `SEM-001I.2` allocation vectors

These passing rows validate the reviewed permanent allocation. They do not authorize the runtime codecs or state persistence owned by `SEM-001I.3`.

| Vector | Required proof | Status |
|---|---|---|
| `CV-SEM-091` | Record types occupy the collision-free append-only range `210..259`, with no gap, duplicate, earlier-type reuse, or test-only ID; `WorldEventTruth` uses `WorldEventId`, not scheduler `EventId`. | `PASS` — candidate range and event-identity closure |
| `CV-SEM-092` | Every proposed schema has positive unique field IDs, exact required/optional flags, and persistent recognition resolution omits `RecognitionEvaluationId`. | `PASS` — candidate field closure |
| `CV-SEM-093` | Semantic and occurrence namespace IDs are globally distinct; `1004` is absent, available, and contributes no allocation entry; `RegistryKindId=1023` exactly types union-definition registry entries; `UnionVariantDefinitionId=1024` identifies individual definitions; `WorldEventId=1114` and `ObservationId=1115` are occurrence families; equal underlying ordinals in different occurrence types remain unequal identities. | `PASS` — permanent category and namespace closure |
| `CV-SEM-094` | Every finite candidate registry is duplicate-free; Campaign 0 causal values remain unchanged under their first typed namespace allocation (`CausalRoleId=1019`); nested authored/runtime referent origins with equal local payloads encode differently. | `PASS` — candidate vocabulary and referent-origin closure |
| `CV-SEM-095` | Every union tag has exactly one canonical required/forbidden payload contract; all optional payload fields are accounted for; illegal layouts fail before emission; declaration reordering preserves the complete registry manifest while a matrix change changes its digest. | `PASS` — candidate union and manifest closure |

### Planned `SEM-001I.3` codec, persistence, and state vectors

| Vector | Required proof | Status |
|---|---|---|
| `CV-SEM-096` | Canonical runtime codecs enforce the accepted type/field/tag registry, reject unknown versions and illegal union layouts before allocation/emission, and round-trip byte-identically. | pending |
| `CV-SEM-097` | Semantic state roots, observer-scoped file counters, occurrence allocators, trace, and outputs save/load and replay byte-identically; failure rolls all of them back atomically. | pending |
| `CV-SEM-098` | Extra detections for another observer may perturb raw global ordinals but change no tracking, classification, recognition, salience, similarity, or other semantics for this observer, for both continuant and event detection identities. | pending |
| `CV-SEM-099` | Replacing active symbol-mapping occurrence A with B leaves A and historical cues immutable; only later admissible evaluations may cite B. `RecognitionKnowledgeState` permits at most one active mapping per `(ObserverId, PerceivedIdentitySymbolId)`. | pending |
| `CV-SEM-100` | `RecognitionKnowledgeState` permits at most one active catalog entry per `(ObserverId, CandidateSemanticReferentId)` and rejects two individually canonical entries with different templates as ambiguous state. | pending |

## Mandatory `PHEN-SEM-001` fixture

Truth event:

```text
Mina skipped rope with Glen in the Library using the Lead Pipe.
```

The fixture uses separately identified bindings for action, actor, companion, location, and instrument. Observer projections are:

```text
Mina:    action-like referent + companion-like person + place + instrument
Darius:  actor-like person + action-like referent + place; no Glen binding; no instrument
Glen:    actor-like person + action-like referent + place + instrument
```

The character projections use perceptual referents, not the truth identities named in this explanatory table. Their permitted classification evidence also differs: one observer receives person-like but no identity evidence, one receives interior-space-like but not the truth location identity, and one receives discrete-object-like/metallic evidence without the truth object identity. At least one observer begins unfamiliar, one produces a correct recognition hypothesis, and one produces a misrecognition later corrected.

The fixture independently varies:

```text
classification: discrete-object-like / metallic / unresolved
tracking: same continuous perceived instance / interrupted new instance
recognition: unresolved / correct candidate / incorrect candidate / corrected candidate
```

No one axis is inferred merely from another.

The tracking fixture includes both adversarial mismatches:

```text
false continuity:     truth Glen → occlusion → Darius; observer track/17 → continues → track/17
false discontinuity:  truth Glen → brief loss → Glen; observer track/17 ends; track/23 begins
```

In the second case, later recognition may attach `person.glen` to both tracks, but neither track is merged or rewritten. Track allocation is observer-scoped; interleaving another observer's `NewTrack` transitions cannot change this observer's assigned sequence.

## Required negative controls and first divergence

Each control must either fail structural closure or report its first illegal field/consequence:

- `TruthIdentityCopy`;
- `ReferentKeyedBinding`;
- `SlotWideVisibility`;
- `EventRoleEqualsCausalRole`;
- hidden-truth causal-role derivation;
- `OpaqueButLinkableTruthHandle`;
- `RecognitionRewrite`;
- `TruthFacetCopy`;
- `FreeformTagBag`;
- `ClassificationToPressure`;
- `TruthCorrectedTracking`;
- `GlobalTrackAllocator`;
- `TrackOrdinalPsychology`;
- `RoleKeyedBinding`;
- `GlobalRoleCardinality`;
- `BindingOrdinalPsychology`;
- `RoleOrdinalPriority`;
- `DuplicateOpaqueOccurrence`;
- `FreeformBindingQualifier`;
- `VisibleBindingRevealsTruthRole`;
- `SharedTruthPerceptualFacetId`;
- `WrongTypedFacetValue`;
- `CategoryStringValue`;
- `MissingAsFalse`;
- `UnknownSentinel`;
- `ExclusivePrimaryKind`;
- `DuplicateFacetAssertion`;
- `ClassificationOrdinalPsychology`;
- `RecognitionFromClassificationIdentity`;
- `LLMClassifier`;
- `AuthoritativeProse`.

## Acceptance gate

`SEM-001` closes only when:

1. every vector is `PASS`;
2. permanent record/enum IDs, governed role definitions, and the finite typed semantic-facet definitions used by the fixture are registered;
3. the accepted `SEM-001A` observer-scoped allocator, continuant-file lifecycle, binary track transition, and non-correction rules pass false-continuity, false-discontinuity, save/load, replay, inter-observer independence, and ordinal-opacity controls;
4. the event, observation, experience, and recognition phases are registered;
5. character evidence contains no unobserved truth identity, unobserved truth classification, or linkable secret handle;
6. the complete multi-observer fixture passes through immediate consumers and save/load replay;
7. all negative controls report exact first divergence or closure failure; and
8. classification cannot directly enter psychological-pressure seams;
9. full ontology inheritance and affordance closure remain explicitly deferred to `ONT-001`; and
10. the observation verdict and campaign ledgers record the accepted scope without broadening `MATH-006`.
