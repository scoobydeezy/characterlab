# Campaign 1 Semantic-Binding Conformance Vectors

**Status:** closed manifest, version `campaign1-semantic-binding-vectors/0.1-candidate`. All one
hundred vectors `PASS`; `SEM-001J` accepted and parent `SEM-001` closed on 2026-09-04. The manifest
remains a mandatory regression suite: closure retires the obligations, not the tests.

These vectors govern `semantic-binding/0.1-candidate`, `SEM-001`, and `PHEN-SEM-001`. Campaign 0 vectors and accepted bounded-observation vectors remain mandatory substrate controls. A row may execute when its named subdecision has enough exact symbolic structure to test it; passing a subset never accepts the parent contract and authorizes only the exact symbolic registry, phase, or provenance scope explicitly accepted by that subdecision. Permanent semantic record IDs were blocked until a subdecision assigned them; accepted `SEM-001I.2` (2026-09-03) now supplies the permanent numeric allocation, and those values may never be renumbered or reused. The parent gate therefore audits that allocation rather than assigning it.

| Vector | Required proof | Current evidence |
|---|---|---|
| `CV-SEM-001` | Two world events containing identical referents in different `EventRoleId` bindings produce structurally distinct truth bindings and permitted perceived bindings. | `PASS` — canonical and Actor/Companion-swapped events name the same referents, differ structurally on the truth side, and remain perceptually isomorphic to an observer who cannot see which referent moved |
| `CV-SEM-002` | One referent simultaneously occupying several event roles retains every binding occurrence; no referent-keyed deduplication occurs. | `PASS` — truth-side multi-role retention plus both perceived-side directions: one continuant in two roles and two continuants in one repeatable role each keep distinct occurrences, so referent-keyed, role-keyed, and event-only collapse all fail |
| `CV-SEM-003` | Visibility is binding-specific. Mina, Darius, and Glen receive exactly their declared permitted binding sets from the same event. | `PASS` — three mutually non-subsuming permitted sets from one truth event, the action carried as the event-file rather than a continuant binding, and each observer unperturbed by the others sharing one run-scoped allocator |
| `CV-SEM-004` | A visible but unrecognized entity yields a `PerceptualReferentId` and no truth-side `SemanticReferentId`. | `PASS` — unfamiliar evaluation emits no resolution or truth identity |
| `CV-SEM-005` | Correct recognition and categorical misrecognition attach different resolutions to equal perceptual evidence without changing that evidence. | `PASS` — observer-owned cue intervention over immutable experience |
| `CV-SEM-006` | Later correction appends a replacement or withdrawal resolution; the original experience, evaluation, and contemporaneous resolution remain byte-identical. | `PASS` — append-only replacement/withdrawal chain |
| `CV-SEM-007` | Truth binding IDs and truth referent IDs are structurally absent from character evidence. Stable opaque-handle equality cannot reveal that two hidden sources are equal. | `PASS` — the projection boundary returns exactly `{perceptualReferentId, eventRoleEvidence}` with a role drawn from the closed accepted vocabulary; two observers of one hidden referent share no continuant handle, and their coinciding ordinals carry no meaning |
| `CV-SEM-008` | `EventRoleId` and `CausalRoleId` remain independently present and typed; deriving a causal role cannot erase or mutate event-role evidence. | `PASS` — derivation emits separate records and leaves the binding byte-identical; proven on the discriminating `Companion→Participant` and `Location→Location` mappings rather than only the identity-looking `Actor→Actor` pairing |
| `CV-SEM-009` | Character-relative causal-role evidence changes only when permitted observations change, never when only hidden truth-side causal structure changes. | `PASS` — exchanging the truth Actor and Companion referents leaves the observer's causal evidence byte-identical, while coarsening his permitted role observation changes it from `Actor` to `Participant` |
| `CV-SEM-010` | Every perceived binding has complete omniscient trace ancestry to one truth binding and observation operation, while the character projection cannot traverse that ancestry. | `PASS` — exactly one edge per perceived binding, naming the truth binding it actually descends from and explaining its role evidence; two observers of one hidden referent share no character-side handle while the trace side knows the referent is the same |
| `CV-SEM-011` | Scalar measurement evidence is referenced as supporting evidence and is neither required for every binding nor treated as referent identity or role evidence. | `PASS` — a real `observation/0.1-candidate` bounded measurement is minted in the frozen `ObservationId` namespace 1115 and cited by a perceived binding; the join runs from the binding's own citation, the measurement's interval/precision/truth record reach no character record, and the canonical projection carries no measurement at all |
| `CV-SEM-012` | Deterministic omniscient, contemporaneous-character, and current-reinterpretation renderers consume typed records; changing presentation metadata changes no authoritative record. | `PASS` — three viewpoints render from the same immutable experience, differing only in permitted read scope; record-derived lines are byte-identical across two presentations while the display surface responds to both, and every authoritative record is unchanged after rendering; only the omniscient viewpoint reaches truth binding or referent identity, with character-side referent identities held to closed catalog membership; the contemporaneous and current accounts differ exactly by one appended corrective resolution over an unmodified experience |
| `CV-SEM-013` | Perceptual-referent allocation is independently monotonic per observer, persists across save/load, never reuses an ordinal, and is invariant to other observers' allocations. | `PASS` — executable observer-scoped allocator, structural restore, retirement-without-reuse, and interleaving controls |
| `CV-SEM-014` | Invalid registry IDs, multiplicity, hidden references, forged perceptual IDs, illegal causal derivation, or noncanonical order abort the complete instant with no committed state, allocation, trace, or output. | `PASS` — a handler that allocates occurrence ordinals, compiles bindings, and contributes trace and outputs before failing settlement leaves state, allocators, committed trace, and outputs exactly as they were |
| `CV-SEM-015` | Equal truth-side semantic facts with different permitted sensory evidence produce different perceptual classifications; hidden facts never copy through merely because they are registered. | `PASS` — two observers of one truth instrument classify it differently from their own permitted features, while exchanging the hidden truth referents leaves classification byte-identical |
| `CV-SEM-016` | Perceptual classification, track continuity, and instance recognition are independently intervenable: each can change while the other two remain structurally fixed where the fixture permits. | `PASS` — accepted classification/track controls plus immutable-experience recognition intervention |
| `CV-SEM-017` | Every perceptual classification uses a registered facet and exact declared value type; unknown facets, freeform tags, and wrong-typed values fail closure and roll back. Missing classification remains distinct from an explicit boolean-false assertion. | `PASS` — unknown facet, freeform feature tag, and non-boolean value each fail before emission; explicit negative evidence emits a present `false` record while absence emits none |
| `CV-SEM-018` | Classification alone produces no appraisal, affect, motive, pressure, or Reason. The `ClassificationToPressure` shortcut fails read-domain or receiving-seam closure. | `PASS` — every psychological and world-truth emission target is refused, and emitted classification evidence carries exactly the accepted field set with no salience, valence, confidence, or weight field |
| `CV-SEM-019` | False continuity: permitted sensory input deterministically continues one observer-relative track across two different truth entities; no truth comparison automatically corrects, ends, or replaces the track. | `PASS` — executable occlusion continue/split controls with no truth input or repair path |
| `CV-SEM-020` | False discontinuity: one truth entity yields two separately allocated tracks after a declared perceptual break; later recognition may associate both tracks with the same semantic candidate without merging or rewriting either track. | `PASS` — separate track allocation plus independent equal recognition resolutions |
| `CV-SEM-021` | `PerceptualTrackTransition` is produced solely from permitted observer-side detections and supporting observations, with exact binary `NewTrack`/`ContinuesPriorTrack`; its tracking rationale is not automatically character-accessible semantic evidence. | `PASS` — forbidden-truth-field, non-binary-continuity, missing/cross-observer support, and forged/inactive prior controls |
| `CV-SEM-022` | Changing only another observer's track allocations or the opaque numeric ordinals of this observer's otherwise isomorphic tracks changes no classification, similarity, salience, appraisal, recognition score, or other psychological result. | `PASS` — ordinal-shifted isomorphic run and foreign-observer interleaving compare equal under the ordinal-free continuity view |
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

### Accepted `SEM-001I.3` codec, persistence, and state vectors

| Vector | Required proof | Status |
|---|---|---|
| `CV-SEM-096` | Canonical runtime codecs enforce the accepted type/field/tag registry, reject unknown versions and illegal union layouts before allocation/emission, and round-trip byte-identically. | `PASS` — named-field construction over the frozen allocation, unadmitted contract-version and unregistered schema-version rejection, pre-construction union-layout validation across all eight union types, byte-identical round trip, and order-independent state-root encoding |
| `CV-SEM-097` | Semantic state roots, observer-scoped file counters, occurrence allocators, trace, and outputs save/load and replay byte-identically; failure rolls all of them back atomically. | `PASS` — types 241/242 encode and restore through the accepted allocation; a save/load boundary mid-history re-saves byte-identically to the uninterrupted run, and a staged failure restores state, both observer counters, allocators, committed trace, and outputs together |
| `CV-SEM-098` | Extra detections for another observer may perturb raw global ordinals but change no tracking, classification, recognition, salience, similarity, or other semantics for this observer, for both continuant and event detection identities. | `PASS` — interleaved foreign detections move the shared run-scoped runtime allocator while this observer's continuant tracking, event-file grouping, ordinal-free continuity view, and both observer-scoped counters compare equal |
| `CV-SEM-099` | Replacing active symbol-mapping occurrence A with B leaves A and historical cues immutable; only later admissible evaluations may cite B. `RecognitionKnowledgeState` permits at most one active mapping per `(ObserverId, PerceivedIdentitySymbolId)`. | `PASS` — allocated `ObserverSymbolCandidateMappingId` replaces the derived key; one-active-mapping guard, exact-occurrence claim admission, retired-occurrence rejection, and byte-stable historical cue encoding |
| `CV-SEM-100` | `RecognitionKnowledgeState` permits at most one active catalog entry per `(ObserverId, CandidateSemanticReferentId)` and rejects two individually canonical entries with different templates as ambiguous state. | `PASS` — each entry admissible alone, the pair rejected as ambiguous rather than merged into one template set |

**Mutation authority.** The numeric registry additionally requires exactly one registered mutation
authority per writable leaf of state roots 241–244. `semanticStateAuthority.ts` registers all seven
leaves: each of the four roots decomposes into `mapKey` families addressed by that collection's own
accepted uniqueness key — the observer for both next-sequence counters, the type-212/213 identity
record for both active-file sets, the accepted `(ObserverId, CandidateSemanticReferentId)` and
`(ObserverId, PerceivedIdentitySymbolId)` tuples for recognition knowledge, and the declared
occurrence identity for resolution records. No new addressing concept is introduced and no ordinal
is used as a position. Removal permission follows the accepted lifecycle: observer counters and
resolution history are never removable, while active-file membership and the two recognition
collections are, because retirement and replacement are accepted. The perception seam owns both
file states, the recognition-knowledge authority owns recognition knowledge, and the recognition seam owns
the resolution log; the registry constructor itself proves non-overlap and full coverage.

**Membership representation.** `mapKey → true` is the mutation-addressing projection of an accepted
canonical set, not a conversion of the active-file collections into map-valued domain state.
Canonical persistence still encodes both as `cenc/1` sets; the marker exists only to give the
`StatePath` patch model an exact writable leaf value. The equivalence of the two views is
executable: same members, same canonical identities, preserved across the persistence boundary and
across retirement.

Authority identities come from the accepted global `1025 MutationAuthorityId` namespace allocated by
the `TRC-001`/`TRC-002` addendum, not from a semantic-binding-specific identity family. Each is
named for the state family whose writes it governs — `authority/perception`,
`authority/recognition-knowledge`, `authority/recognition-resolution` — so a later accepted
learning/forgetting seam may write recognition knowledge through the same authority. One authority
owning several tightly related leaves satisfies the invariant; what matters is exactly one owner
per leaf. The semantic fixture's registry manifest commits the authority definition, so ownership,
removal permission, and leaf value grammar are inside its `ModelIdentity`; substrate `CV-OWN-002`
proves that discrimination generally.

`CV-SEM-099` and `CV-SEM-100` also close two `SEM-001I.1` scaffolding dispositions in the running
oracle: `ObserverIdentitySymbolMapping` now carries an allocated typed occurrence instead of an ID
synthesized from symbol/candidate/version text, and `RecognitionResolutionRecord` no longer carries
a `RecognitionEvaluationId` pointer, so persistent resolution state is self-sufficient and the
evaluation exists exactly once in committed trace.

`CV-SEM-096` proves the codec layer itself: `src/semanticBinding/semanticCodecs.ts` is the sole
construction path from the frozen `SEM-001I.2` allocation to `cenc/1` bytes, and it refuses an
unallocated field, an unadmitted seam-contract version, an unregistered record schema version, or
an illegal union layout before any occurrence is allocated or emitted. Both perceptual file-state
roots (types 241 and 242) already encode through it. Migrating the remaining `SEM-001B..H` module
shapes off symbolic string occurrence IDs onto this layer is `CV-SEM-097`..`CV-SEM-100` work and is
not claimed by this row.

## Carried condition on `SEM-001J`

`SEM-001I.3` acceptance does not permit the integrated gate to run the symbolic oracle and then
serialize its result canonically. `SEM-001J` must migrate the remaining `SEM-001B..H` in-memory
occurrence boundaries onto the accepted typed IDs and the codec/state machinery, and must exercise
the path end to end:

```text
canonical truth occurrence IDs
  → canonical observation/detection IDs
  → canonical track/event identities
  → canonical evidence occurrences
  → canonical experience
  → canonical recognition evaluation/resolution
  → canonical state mutation
  → save/load/replay
```

No authoritative result in `PHEN-SEM-001` may depend on a symbolic string occurrence ID.

**Migration status (`SEM-001J` step one).** Every accepted occurrence family now carries an
allocated ordinal at the in-memory boundary, not a symbolic string: `ExperienceId`,
`ObservationId`, `DetectionOccurrenceId`, `EventDetectionOccurrenceId`, `FeatureObservationId`,
`EventFeatureObservationId`, `RecognitionCueEvidenceId`, and the three supporting-ID collections.
`admitObservationLane` returns the allocated `ExperienceId` itself rather than re-wrapping it as
text, and `PerceivedRoleProjection` carries the type-212 continuant-file identity rather than a
symbolic handle. Governed model identities — `EventTypeId`, `SemanticReferentId`,
`RecognitionTemplateId`, rule and validator IDs — keep text payloads: they are not occurrence
identities and principle 10 does not reach them. `src/test/semanticOccurrenceIdentity.test.ts`
guards the boundary, including that supporting ordinals are ordered numerically rather than
lexicographically over their decimal digits. Remaining for the gate: the integrated multi-observer
`PHEN-SEM-001` fixture and its negative controls.

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

## `SEM-001J` integrated evidence

The parent gate does not close by aggregate. Thirteen vectors were still pending when the gate
opened; each names below the integrated `SEM-001J` evidence that closed it, so a reader can see
which test discharged which parent obligation. Every other row was already closed by its own
subdecision and remains so. At acceptance there are zero pending `CV-SEM` rows.

| Vector | Integrated evidence that closed it |
|---|---|
| `CV-SEM-001` | `phenSem001Binding.test.ts` — canonical and role-swapped truth events are structurally distinct and perceptually isomorphic to an observer who cannot see which referent moved; the integrated run in `phenSem001Run.ts` carries both truth bindings and the resulting perceived bindings in one canonical chain |
| `CV-SEM-002` | `phenSem001Binding.test.ts` multi-role and repeated-role controls, re-proved integrally: `semanticEvidenceCodecs` encodes each binding occurrence as its own type-224 record, so a referent-keyed collapse changes the committed bytes |
| `CV-SEM-003` | `phenSem001Integration.test.ts` — three observers with non-subsuming permitted sets run in one scheduler over one shared runtime allocator, each unperturbed by the others |
| `CV-SEM-007` | `phenSem001Binding.test.ts` — the observer's own continuant-file is the referent identity end to end; the integrated chain carries only type-212 identities in that position |
| `CV-SEM-008` | `phenSem001Causal.test.ts` plus the integrated chain, where event-role evidence (type 223) and causal-role evidence (type 240) are separate canonical records that cannot overwrite one another |
| `CV-SEM-009` | `phenSem001Causal.test.ts` — causal evidence responds to permitted observation and not to hidden truth; the integrated run derives it inside the same instant as the projection that feeds it |
| `CV-SEM-010` | `phenSem001Causal.test.ts` — complete omniscient ancestry beside a projection that cannot traverse it; `sem001AcceptanceGate.test.ts` item 5 re-checks the separation over the whole fixture |
| `CV-SEM-011` | `phenSem001Measurement.test.ts` — a real `observation/0.1-candidate` bounded measurement cited as supporting evidence through the frozen `ObservationId` namespace 1115 |
| `CV-SEM-012` | `phenSem001Rendering.test.ts` — three viewpoint renderers over one immutable experience; `phenSem001Integration.test.ts` runs all three inside the scheduler and commits their record-derived output |
| `CV-SEM-014` | `phenSem001Measurement.test.ts` whole-instant abort, with `phenSem001Integration.test.ts` proving the same transaction boundary under the complete fixture |
| `CV-SEM-015` | `phenSem001Classification.test.ts` — equal truth with different permitted evidence classifies differently; equal evidence with different hidden truth is byte-identical |
| `CV-SEM-017` | `phenSem001Classification.test.ts` and `semanticNegativeControls.test.ts` — registered facets and exact declared types, with missing distinct from explicit false |
| `CV-SEM-018` | `phenSem001Classification.test.ts` and `sem001AcceptanceGate.test.ts` item 8 — classification emits only into experience assembly |

## Registered is not admitted

Campaign 0 registered ten causal-role values. `SEM-001`'s causal-role domain admits nine of them:
`Context` (value 9) stays registered and unadmitted, and `Incidental` keeps value 10 rather than
sliding into the gap. That is not an inconsistency to be tidied, and it is not a new mechanism. It
records a distinction the architecture already relies on:

> A registered semantic value is not thereby a value admitted by a given seam, read-domain, or
> domain contract. Registration fixes a permanent number and meaning; admission is decided by the
> exact receiving rule. A later implementation may not infer that "registered" means "legal
> everywhere".

The same distinction governs seam-contract versions, facet definitions, evidence reference classes,
and role vocabularies. Where a registry is broader than what a seam admits, the seam's own contract
is the authority, and the unadmitted value must remain registered at its permanent number so that
admitting it later renumbers nothing.

## Required negative controls and first divergence

Each control must either fail structural closure or report its first illegal field/consequence.

`src/test/semanticNegativeControls.test.ts` is the ledger discharging this section: one test per
named control, in the order below, each stating which of two forms it takes — **closure failure**,
where the forbidden construction is expressible and the seam refuses it with an exact asserted
failure code, or **structural absence**, where no admitted vocabulary, field, or carrier can express
it and the proof runs against the registered vocabulary rather than a denylist of spellings. The
ledger registers each control's name at collection time and asserts that the registered set is
exactly the set named here, so a control added to this list without a test, or a test discharging a
control this list does not name, fails.

Two results of building it are recorded rather than smoothed over. First, `DuplicateOpaqueOccurrence`
is owned by `assertUniqueTrackTransitions` over the transition history, not by the state transition,
which is stateless with respect to detections; the ledger asserts it where the invariant lives.
Second, the branch clause and the one-current-resolution clause of the recognition history rule both
refuse a laundered rewrite and both report `INVALID_RESOLUTION_HISTORY`, so that control asserts the
shape is refused without claiming which clause owns it.

The named controls:

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

`src/test/sem001AcceptanceGate.test.ts` audits this gate item by item. It reads these formal
documents directly, so a condition stated here and a condition proved in code cannot drift apart:
the audit parses the numbered list below and fails if an item is named without an entry, or entered
without being named. Each item is discharged as **executable here** (a property of the code, proved
in the audit), **executable elsewhere** (proved by a named test file, which the audit records and
confirms is in the suite), or **ledger condition** (a statement these documents must make, which the
audit checks they do).

Item 6 is discharged by `src/test/phenSem001Integration.test.ts`, which runs the complete
three-observer fixture inside the deterministic scheduler — every occurrence identity drawn from the
scheduler's own runtime allocator — through causal-role derivation, continuant recognition, and the
three viewpoint renderers, across a save/load boundary that reproduces state roots, all three
observers' file counters, allocators, committed trace, and outputs byte-identically. `CV-SEM-097`
remains the codec-level persistence vector; it drives a single-observer handler and does not
discharge this item on its own.

`SEM-001` closed on 2026-09-04, having met all ten conditions. They remain the standing audit, and
`sem001AcceptanceGate.test.ts` re-checks each on every run. `SEM-001` closes only when:

1. every vector is `PASS`;
2. permanent record/enum IDs, governed role definitions, and the finite typed semantic-facet definitions used by the fixture are registered;
3. the accepted `SEM-001A` observer-scoped allocator, continuant-file lifecycle, binary track transition, and non-correction rules pass false-continuity, false-discontinuity, save/load, replay, inter-observer independence, and ordinal-opacity controls;
4. the event, observation, experience, and recognition phases are registered;
5. character evidence contains no unobserved truth identity, unobserved truth classification, or linkable secret handle;
6. the complete multi-observer fixture passes through immediate consumers and save/load replay;
7. all negative controls report exact first divergence or closure failure — discharged by the ledger above, thirty-one for thirty-one; and
8. classification cannot directly enter psychological-pressure seams;
9. full ontology inheritance and affordance closure remain explicitly deferred to `ONT-001`; and
10. the observation verdict and campaign ledgers record the accepted scope without broadening `MATH-006`.
