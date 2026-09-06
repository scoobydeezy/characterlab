# Retained Phenomenon Corpus

**CorpusVersion:** `corpus/0.26.0-draft`

**CorpusManifestSchema:** `CorpusManifestEntry` type 174, schema version 1

**CorpusManifestDigest:** `42dc63048912b666c8d7cd4b4c58273f698f1f1950b3a1714c1b12bc7eaa46fc`

**Status:** initial populated corpus; fixtures require formal seam contracts before implementation

The corpus is the common exam for the intact architecture and every reduction. Scenarios are fixtures; phenomena are obligations. One phenomenon may require several fixtures, and one fixture may exercise several phenomena.

The `EXP-*` and `P3-*` entries in the [Reference Mechanism Preservation Ledger](REFERENCE_MECHANISM_LEDGER.md) are the remaining historical intake queue. They are not considered transferred until represented here with the complete fields below; old scenario code cannot masquerade as a phenomenon specification.

## Aggregate versioning

`CorpusVersion` identifies an ordered manifest of `(PhenomenonId, Version)` pairs sorted by canonical typed ID. Adding, removing, or changing a member increments the aggregate version. Editorial changes that cannot affect setup, observation, comparison, or verdict do not.

`CorpusManifestDigest` is `SHA256(cenc/1 set of CorpusManifestEntry records)` and commits to the manifest below independently of source-table order. A verdict records the aggregate corpus version and digest plus the versions of all fixtures actually executed. Adding, removing, or changing an entry changes the digest and requires an intentional aggregate-version update.

## Manifest

| PhenomenonId | Version | Historical intake | Primary obligation |
|---|---|---|---|
| `PHEN-ADAPT-001` | `1.10.0-draft` | `P3-012`, North-Star embodied adaptation | hidden exposure may update adaptation but never cognition directly |
| `PHEN-BIO-001` | `1.0.0-draft` | `MEC-017`, `MEC-018`, `EXP-011`, `EXP-012` | stochastic biography changes future decision boundaries |
| `PHEN-COMMIT-001` | `1.0.0-draft` | `MEC-020`, `EXP-013` | commitment pressure follows concrete lifecycle identity |
| `PHEN-DECISION-001` | `1.0.0-draft` | `MEC-015`–`MEC-019`, `EXP-010` | settled versus unresolved authorship and frozen expression |
| `PHEN-DET-001` | `1.0.0-draft` | `SUB-004`, `SUB-008`, `SUB-009` | exact replay and random-address independence |
| `PHEN-EPI-001` | `1.3.0-draft` | `EXP-002`, `EXP-008`, `RET-006`, `RET-014` | hidden truth cannot alter character evidence |
| `PHEN-LEARN-001` | `1.0.0-draft` | `MEC-001`, `MEC-002`, `EXP-002` | censored evidence changes belief only when informative |
| `PHEN-MEM-001` | `1.0.0-draft` | `MEC-010`, `EXP-006` | recency, retrieval reinforcement, bounded access, and decay |
| `PHEN-REASON-001` | `1.0.0-draft` | `MEC-012`–`MEC-016`, `EXP-009`, `EXP-014` | semantic reason independence and correlation control |
| `PHEN-SEM-001` | `1.12.0-draft` | `MEC-004`, `RET-014`, North-Star perception/recognition boundary | observer-safe semantic evidence traverses exact current/consequence lanes through one canonical, lifecycle-complete representation |

---

## `PHEN-ADAPT-001` — Automatic adaptation without cognitive leakage

**Version:** `1.10.0-draft`

**Required setup domain:** Two timelines share ModelIdentity, initial character/state bytes, RunSeed,
ordered-input topology/timing, basis identities, all non-intervention input bytes and immediate
permitted observations. The controlled intervention changes exactly one authored actual-fact count.
OrderedInputSequenceDigest and therefore RunIdentity differ through that field, by design; neither
model nor initial-state commitment changes. The accepted comparison specification and, where relevant,
ComparisonDrawMap supply paired random-address coupling. A later matched challenge can expose changed
regulatory/procedural state through ordinary causal effects.

**Intervention identity control (new, frozen for review; not passed):** compare complete canonical
input manifests and all RunIdentity components. Exactly the named count and its resulting ordered-input
digest differ; hidden model/state/seed differences fail. Zero and nonzero source events both exist.
For this fixture, rule applicability depends on basis kind/governed identity rather than that count;
ApplicableRules and evaluation allocation topology match. The transition may use count to produce
StateChange versus NoStateChange. Omitting the zero-count evaluation fails.

**Both-affected ancestry control:** require one authoritative phase-110 intervention root whose
independent branches produce AAI and the accepted SEM consequence→EVID chain. Two contemporaneous
unrelated roots do not satisfy this obligation. No AAI ID or scheduler ancestry enters character
evidence. The exact fixed-pulse consequence bridge is proposed in ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md;
its AD-D11..15 controls remain unpassed before ADAPT acceptance.

**Matched allocation topology (required).** Both timelines schedule the same events and consume the same allocator positions; only the *semantic exposure facts* differ:

```
Timeline A:  matched exposure input → valid rule → StateChange
Timeline B:  matched exposure input → valid rule → NoStateChange
```

Timeline B must not simply omit the exposure occurrence. An extra occurrence in A alone would shift every later allocated ordinal, and although those ordinals are semantically meaningless they remain part of canonical record identity — so a shifted `ExperienceId` or evidence ordinal would surface as a divergence *before* the adaptation is perceived, and the fixture would appear to fail its own first-divergence obligation for a reason that is not cognitive at all. The typed `NoStateChange` result exists partly to make this matched skeleton constructible.

A fixture that deliberately uses a different allocation shape may not claim raw canonical identity equality; it must first have an explicitly accepted ordinal-free comparison projection for character semantics. Matched allocation is strongly preferred for this phenomenon.

**Interventions:** Toggle only actual exposure/practice; independently toggle whether a later sensor or performance opportunity legitimately reveals its effects; replace the typed automatic-adaptation route with character-learning evidence as a negative control.

**Observable obligation:** The qualifying exposure/practice changes only its registered regulatory or procedural adaptation target. **Every registered character-learning-route state family, and every character-learning occurrence or output, remains structurally equal while permitted observations remain equal.** A later matched challenge may diverge through the changed adaptation state and only then generate different character evidence.

The obligation is closure over the registered route rather than a prose list, so that adding a ninth character-learning state family cannot silently weaken this phenomenon.

**The executable source of truth is the governed route definition committed to `ModelIdentity`, not this document.** It must cover both halves: which persistent state families belong to which route, *and* which occurrence/output families do — `OutcomeEvaluation` and `OutcomeLearningEvidence` among them. A state-family registry alone cannot prove the occurrence/output set exhaustive, which would leave that half open to exactly the omission that lost associations and relationships. The fixture derives both by query; the table below is an *audit* that documentation matches the governed definition, and a mismatch in either direction is a failure. Until Campaign 2A freezes that definition, this phenomenon cannot be executed — deriving route membership by parsing prose is the failure mode the closure form exists to prevent.

| Character-learning-route state family | Source |
|---|---|
| Belief / expectation state | inventory row 1 |
| Episodic / imprint memory | inventory row 2 |
| Associations | inventory row 3 |
| Values | inventory row 4 |
| Habits | inventory row 6 |
| Person models | inventory row 7 |
| Relationships | inventory row 8 |
| Self / identity / disposition | inventory row 10 |

Associations and relationships were absent from this phenomenon's original enumeration; the closure form is what prevents that recurring. Character-learning occurrences and outputs — `OutcomeLearningEvidence` records and any `OutcomeEvaluation` they descend from — are equally in scope.

**A derived closure may be empty; an empty closure cannot satisfy this phenomenon.** Deriving the set and finding it empty is a real assertion about the governed definition rather than a vacuous one, and is the honest state of a campaign that has registered no character-learning transitions yet. But this phenomenon's route obligation and its both-affected obligation name concrete members of that closure, so:

> **No intentionally empty closure may satisfy a phenomenon that names concrete members of that closure.**

The two halves therefore differ at verdict time. The character-learning **state** closure may contain families that are owned but not yet written — that is accepted early-slice behaviour. The character-learning **occurrence/output** closure must at least contain the outputs this phenomenon itself exercises, because the both-affected case requires them to exist and be emitted, not merely to be permitted. A thin character-learning occurrence contract is therefore a prerequisite of executing this phenomenon; belief consolidation is not, and character-learning evidence may exist without yet writing belief, value, habit, or any other state.

**Result obligation:** The adaptation seam records dispatch unconditionally on admission and produces a typed, traceable evaluation result per applicable rule, so these outcomes stay distinguishable rather than collapsing into "nothing happened":

```
one admitted input → dispatch record → canonical set of applicable governed rules → one result per rule

transition never ran                             → no dispatch record
wrong route or wrong basis                       → typed admission failure, no dispatch record
0 applicable rules                               → dispatch record, empty rule set, no evaluations
applicable rule evaluated, no state change       → dispatch record + NoStateChange
applicable rule evaluated, state changed         → dispatch record + StateChange
```

The dispatch record carries the input occurrence, the consuming transition, the admitted basis, the canonically ordered applicable rule set resolved *before* any state is read, and the instant and definition version. Without it, "the transition never ran" and "the transition ran and nothing in the committed model responded" are both the absence of a record, and absence cannot carry a distinction.

"No applicable rule" and "an applicable rule produced `NoStateChange`" are **different** outcomes: the first says nothing in the committed model responds to this exposure, the second says a named rule looked and concluded no change. Collapsing them hides a missing rule behind a legitimate-looking no-op. `NoStateChange` is emitted per applicable rule and **must not be used for the zero-rule case** — there is no rule to name, so such a record either names one that did not apply or names none and becomes indistinguishable from a missing record. One rule owns exactly one leaf family, so an exposure affecting two leaves is two rules and two results, never one multi-leaf patch. `ADAPT-001` v0.1 constrains this fixture — not the grammar — to exactly one applicable rule per input, so the comparison has one unambiguous target path.

A wrong-route or wrong-basis input does **not** produce `NoStateChange`; it fails admission at the consuming transition's typed boundary. The trace retains at minimum: the input occurrence, the rule identity, the semantic key evaluated, the prior state, the result, and the resulting patch if any. `NoStateChange` is what makes a matched non-changing exposure expressible, and the matched-allocation requirement above depends on it.

**Causal counterfactual obligation:** A model that requires conscious observation before all adaptation fails the hidden-exposure case. A model that places hidden exposure on the character-learning bus produces a forbidden immediate cognitive divergence.

**Epistemic obligation:** Actual exposure, practice truth, and adaptation mutation provenance remain truth/trace-side unless separately projected through a permitted observation seam. The adaptation itself may causally change later sensations or performance without granting retrospective knowledge of its hidden cause.

**Route obligation:** Where one event legitimately affects both routes, the two records are emitted independently and neither descends from the other. The character-learning record descends from the accepted consequence chain — permitted consequence observation → consequence `SemanticExperience` → character-relative `OutcomeEvaluation` → `OutcomeLearningEvidence` — not from a raw observation record. Wrong-route input fails at the consuming transition's typed read-domain boundary, not at a mutation authority: authority answers who owns writes to a state family, and input admission belongs to the transition.

**Temporal obligation:** The adaptation write occurs at accepted phase 140 (consolidation, adaptation, and persistent-state mutation), after both observation lanes and after phase-130 perceived-outcome evaluation. An adaptation mutation cannot retroactively reopen an earlier observation lane.

The comparison is **within a single run, pre-write versus post-write**:

```
same run:
    records frozen by phase 130, before the phase-140 adaptation
    ==
    those same records, after it
```

It is emphatically *not* a claim that Timeline A's phase-≤130 omniscient records equal Timeline B's: the hidden exposure truth is intentionally different between timelines, and the truth-side records differ accordingly. Cross-timeline equality is restricted to the declared character-epistemic projection and the route-closure table above.

Where a fixture cannot satisfy the within-run obligation without taking a position on `ORD-005`, it is constructed across separate simulation instants and that construction is recorded rather than left implicit.

**Historical/developmental horizon:** One hidden exposure or practice event, its adaptation transition, an observation-equivalent interval, and one later matched challenge.

**Exact comparison rule:** Exact structural equality across all character-epistemic state before the later revealing observation; first cognitive divergence, if any, must descend from a later permitted observation. Mutation is checked at three levels, because an authority-level check cannot see spill inside a legitimate authority:

> **The exact set of committed mutation paths equals the exact expected target-path set**, where a path is `authority · state family · leaf family · semantic key`.

The levels below are that rule's explanatory decomposition, not substitutes for it:

```
target path(s)                                      → permitted mutation
every non-target authority                          → zero mutation
every non-target leaf family within that authority  → zero mutation
every other semantic key within that leaf family    → zero mutation
```

The third level is what a per-aspect authority split would otherwise have bought: `ADAPT-001` registers one `authority/regulatory-adaptation` over separately addressable leaf families, so an exposure that legitimately raises tolerance must leave sensitization and accumulated load structurally equal.

The fourth is the one a leaf-family check still misses, and it has two shapes rather than one. `tolerance(Mina, alcohol, Y)` and `tolerance(Mina, caffeine, Y)` share an authority *and* a leaf family and differ only in the exposure; `tolerance(Mina, alcohol, sedation)` and `tolerance(Mina, alcohol, reward)` share the exposure too and differ only in the response variable. Both are wrong-key spills and only an exact-key comparison catches either; likewise `practice(cooking)` must not touch `procedural-skill(lockpicking)`. Tolerance and sensitization are stimulus→effect relations, so a key naming the stimulus alone cannot express "tolerant to alcohol's sedating effect while sensitized to its reward response" and would leave a downstream function to guess what one generic magnitude meant.

**Every distinction this comparison must make has to be addressable in the path, not held inside a leaf's value.** Two semantic keys reached through one per-subject record are one `StatePath` carrying different contents, so the committed mutation-path set would be byte-identical in the correct and the spilling run and the fourth level would be unwritable rather than merely unwritten. This is an obligation on the state addressing any candidate must satisfy, not a preference among representations; `ADAPT-001` §2.14 supplies the keys that satisfy it. Construction still waits on permanent allocation.

**Absence is baseline.** For every adaptation leaf this phenomenon compares, a missing state path *is* the canonical baseline: an explicit baseline-valued entry is noncanonical and fails validation, a leaf driven off baseline and back is removed rather than zeroed, and a leaf that was never written is byte-identical to one that returned. Structural equality therefore compares meaning, not materialization history — without this, every byte-identity comparison in this phenomenon would silently also be comparing which map keys happened to exist. Retaining a present-but-baseline entry solely to distinguish "never adapted" from "adapted and recovered" is refused: that is one bit of storage history standing in for phenomena — faster reacquisition, latent sensitization, skill savings — that each require their own retained state with their own semantics. A phenomenon showing that two characters with identical present values but different histories must behave differently reopens this, and is answered by adding that state, never by reading history out of key presence.

**Same-instant collisions and the frozen pre-adaptation projection.** At most one applicable rule evaluation may target one exact adaptation `StatePath` per simulation instant, **regardless of whether that evaluation would ultimately produce `StateChange` or `NoStateChange`**. Stating the policy over outcome rather than targeting would make enforcement depend on this instant's values: a genuine race between two rules for one path would pass whenever one of them happened to be a no-op. Stated over targeting, the collision is decidable from the resolved rule set and the derived paths, before any state is read.

All phase-140 evaluations in one instant read one **frozen pre-adaptation state projection** — the state as it stood before any adaptation patch of that instant — and stage their patches against it; no evaluation observes another's patch. This closes the complementary hole, where two evaluations target different paths but one reads a leaf the other writes.

```
admit → resolve rules (record dispatch) → derive target paths → reject duplicate paths
      → freeze pre-adaptation projection → evaluate and stage → commit atomically
```

Together these **remove `EventSequence` from adaptation semantics entirely.** Ordering remains a scheduling fact fixing allocator positions and trace order, but no adaptation value may depend on it: "whichever phase-140 event runs first changes what the next one reads" is explicitly refused, and permuting the same-instant admitted inputs must leave committed adaptation state byte-identical. A governed aggregation rule — not an ordering convention — is the intended replacement when a phenomenon requires simultaneous accumulation.

**Required trace fields:** exposure/practice truth, adaptation-input type and typed adaptation basis, the dispatch record with its resolved applicable rule set, the consuming transition and the leaf its rule selected, pre/post adaptation state, character-learning evidence emitted, observation projection, mutation diff, and causal ancestry of the first later cognitive divergence.

**Applicable seams:** world/body truth, practice, automatic adaptation input, regulatory/procedural adaptation, interoception/performance observation, trace, mutation authority.

**Preservation obligations:** `SUB-009` (`PORT`) supplies the paired counterfactual harness with coupled random addresses that makes exposure the only difference between the two timelines; `SUB-008` (`PORT`) supplies the first-divergence replay this fixture's causal-ancestry field requires. `MEC-003` (`CONTRACT`) applies *conditionally*: where an adaptation input derives from an accepted bounded effect, preserve the `Capacity`/`Applied`/`Overflow`/`EvidenceKind` decomposition and the hidden-Overflow boundary. A practice occurrence need not have a meaningful capacity, applied quantity, or overflow at all, and this phenomenon does not make all adaptation fit the bounded-effect grammar. `RET-006` and `RET-014` (`RETIRED` / prohibited) are the two canonical leak shapes this phenomenon exists to refuse. `EXP-002` and `EXP-008` (`CORPUS`) are its existing regression cases. `CTL-001` and `CTL-008` (`CONTROL`) are comparisons, not explanations. See `CAMPAIGN2_TOPOLOGY_INVENTORY.md` §6.1.

**Reopen conditions:** adaptation becomes behaviorally dependent on awareness, expectation, attribution, or strategy; a qualifying exposure cannot be defined without perception; or one event legitimately updates both routes without separable records.

---

## `PHEN-DET-001` — Exact replay and addressed-random independence

**Version:** `1.0.0-draft`

**Required setup domain:** Any accepted seam fixture with a complete `ModelIdentity`, canonical initial state, ordered input sequence, run seed, and at least two distinct random addresses. Include one fixture with no random draw and one with an authoritative draw.

**Interventions:** Replay without changes; insert draws under unrelated addresses; change one component of the target address; save and reload immediately before the target event.

**Observable obligation:** Identical runs produce structurally identical states, outputs, failures, pending events, and trace records. Unrelated draws do not change the target word or downstream result. Changing the target address may change its word but changes no earlier record.

**Causal counterfactual obligation:** A mutable sequential RNG must fail the inserted-draw intervention whenever the insertion shifts the target result.

**Epistemic obligation:** Random addresses and words are trace data, not character knowledge unless an observation seam exposes a result.

**Historical/developmental horizon:** One event, a save/load boundary, and a multi-event replay containing an inserted unrelated draw.

**Exact comparison rule:** Canonical structural equality for unchanged records; exact word equality at the target address after unrelated insertion; first divergence at or downstream of the changed target address.

**Required trace fields:** model/run identity, event order, complete random address, raw word, distribution-mapping version, output, mutation diff, parent event.

**Applicable seams:** deterministic substrate, scheduler, trace, save/load, arbitration.

**Reopen conditions:** random algorithm or address schema change, serialization change, scheduler identity change, or replay divergence.

---

## `PHEN-EPI-001` — Observational equivalence under hidden Overflow

**Version:** `1.3.0-draft`

**Required setup domain:** Two timelines share model, character, prior belief, perceived concepts, attention, and a bounded positive channel at state `19/20`. Timeline A applies potential effect `1/10`; Timeline B applies `4/5`. Both authoritatively apply `1/20`, yielding different hidden Overflow.

**Interventions:** Swap only potential-effect magnitude while holding the permitted perceived/interoceptive measurement and evidence reliability fixed.

**Observable obligation:** Character-accessible observation, evidence kind, semantic encoding, salience, belief update, and immediate downstream cognition are structurally identical.

**Causal counterfactual obligation:** The omniscient trace differs in potential effect and Overflow. A model that reads either hidden field into cognition must produce a detectable forbidden difference.

**Epistemic obligation:** Full `EffectProvenance`, potential effect, capacity, and Overflow remain truth/trace-side. Character evidence contains only the permitted projection. The fixture's single source-record reference makes no general claim that stable opaque truth handles are safe across events; `PHEN-SEM-001` tests and forbids unintended linkage.

**Historical/developmental horizon:** One observation plus every same-event learning and encoding consumer.

**Exact comparison rule:** Exact structural equality for every character-accessible record and post-event character state; exact inequality for truth-side potential-effect and Overflow fields.

**Required trace fields:** effect decomposition, observation projection, evidence kind, semantic encoding, learning inputs/outputs, prohibited-read audit.

**Applicable seams:** world outcome, interoception, perception, SemanticExperience, surprise, learning evidence, salience.

**Reopen conditions:** a legitimate sensor exposes additional magnitude, a character-accessible hedonic signal is introduced, or permitted evidence distinguishes the timelines.

---

## `PHEN-SEM-001` — Observer-relative event bindings without recognition leakage

**Version:** `1.12.0-draft`

**Required setup domain:** One general action-occurrence truth event binds separately identified occurrences for `Action → action.skip_rope`, `Actor → person.mina`, `Companion → person.glen`, `Location → location.library`, and `Instrument → object.lead_pipe`; its event type declares those exact cardinalities except repeatable Companion. A second fixture gives Companion two referents and a multi-role fixture binds one referent into Actor and Companion. Strike and drink event types narrow the global Instrument domain differently. The initial role registry includes `Beneficiary` and excludes generic `Context`. Governed truth-side semantics classify the pipe as object/metal/blunt and the library as an interior space. Mina, Darius, and Glen observe the same event through different binding-specific affordances. Permitted role evidence independently preserves, coarsens, leaves unresolved, or omits truth roles. Controlled continuant-feature evidence supports the six accepted appearance facets. The accepted event-classification fixture supplies observer-side repeated-vertical-body-motion, cyclic-flexible-continuant-arc, body/continuant-passage-coordination, repeated-pattern, and coupled-motion-across-continuants features to independent `AppearsRopeSkippingPatternLike`, `AppearsRepetitiveMotionLike`, and `AppearsCoupledMultiContinuantMotionLike` facets. Character records use observer-relative continuant-files and event-files, not truth identities or action keys. Seed observer-owned recognition candidates/templates and one identity-symbol mapping; exercise unfamiliar, ambiguous, correct, categorically wrong, replacement, explicit withdrawal, no-cue persistence, and same-candidate reevaluation. Include missing/false/true classification conjunctions within one window, cross-window rejection, hidden truth changes, competing models, simultaneous/cross-experience event-files, multi-role continuants, unfamiliar event patterns without learned action recognition, false continuant continuity/discontinuity, and false event merge/split. Register exact observer-safe record-schema/producing-seam admissions and narrow consumer `ReadDomain`s for observation, feature, binding, classification, recognition, and causal-role references. Exercise strict same-observer/window/modality/feature/carrier scope, explicit shared safe evidence, hidden shared ancestry, and zero-or-more nonrecursive causal-role claims.

**Interventions:** Swap event roles while retaining referents; exercise multi-role/repeatable-role bindings, event-specific cardinality/domain narrowing, and invalid Context/duplicate/qualifier/fixed-Action cases; shift binding ordinals; vary role evidence precision; place several event-files in one experience and one event-file across experiences; false-merge/split events; attempt truth-keyed segmentation and continuant-file `Action`; interleave/renumber observer event allocations; classify person/discrete-object/interior-space appearances on continuant-files and reject event carriers; vary continuant features and hidden truth independently; remove/negate features, force false from missing/positive support, return `NoAssertion`, inject Unknown/wrong types/freeform values, vary facet authority/models, duplicate assertions, shift ordinals, and attempt direct recognition/pressure or prose/LLM derivation. For event-pattern classification, independently vary each rope-pattern feature through true/false/missing, hold event features while changing truth Action/EventType, hold truth while changing features, reuse supporting continuants without action features, compare false merge/split histories, substitute a continuant carrier, duplicate authority/assertions, shift ordinals, and attempt historical direct action-key or bypass emission. For recognition, vary zero/one/several qualifying candidates, support/contradiction, catalog/template/mapping ownership, candidate-domain metadata, identity claims, replacement/withdrawal/no-cue/same-candidate sequences, false track continuity/discontinuity, history branching/cycles, and all opaque ordinals; attempt truth/trace candidate injection, unmapped claims, event-file/action recognition, track repair, and direct downstream mutation. For provenance/admissibility, vary exact schema and producing seam, consuming `ReadDomain`, observer, time/window, modality, feature scope, carrier, and occurrence ordinals; compare explicit safe shared evidence with equal hidden ancestry; attempt generic IDs, hashed/encrypted truth handles, future/cross-observer/cross-window references, occurrence reuse as semantic grouping, character trace traversal, recursive/duplicate causal-role evidence, and classification-to-pressure. Represent full occlusion as missing feature evidence and partial access as a fixture-specific subset; do not invent physical-to-sensory mathematics in this seam. Admit a named future bounded-quality schema as a closure control without adding generic confidence.

**Phase-ordering obligation:** Execute the current event through phases 10→11→12→13→14→15→20→21 and its phase-110 outcome through consequence phases 120→121→122→123→124→125→126→127 before phase-130 character evaluation. Vary truth availability immediately before/at/after each lane cutoff; no-evidence versus evidence-producing lane admission; current/consequence experience allocation over continuing files; classifier work construction order; source recognition-input mutation after freeze; same-instant phase-21→127 correction; direct phase-110 outcome access from phase 130; adaptation masquerading as learning evidence; and attempts to schedule phase 150.

**Canonical-schema obligation:** Exercise every authoritative `SEM-001I.1` occurrence key through the permanent `SEM-001I.2` allocation, both observer-scoped file allocators, the shared allocator's distinct typed occurrence namespaces, explicit transition result identities, exactly one continuant-file and event-file retirement, recognition-knowledge initial state, symbol-mapping replacement, trace-only recognition evaluation, self-sufficient resolution continuation, and revision-link ordering for two same-instant resolutions. Enforce one active catalog entry per `(ObserverId, CandidateSemanticReferentId)` and one active mapping per `(ObserverId, PerceivedIdentitySymbolId)`. Change seeded recognition knowledge without changing `ModelIdentity`; change its schema/rules without holding `ModelIdentity` fixed. No runtime path may fall back to symbolic strings, derived mapping IDs, reflection order, duplicated evaluation state, or a persisted derived view.

**Observable obligation:** Event-role changes remain structurally visible even when referents are unchanged; every binding occurrence and event-local cardinality/domain rule survives. Each observer receives exactly permitted binding, role precision, grouping, classification, and recognition evaluation/resolution. Visible continuant/event files contain no truth identity. Event-files preserve occurrence grouping independently of experience and truth. Continuant classification uses six independent boolean facets; event classification uses three independent pattern facets and the exact necessary-feature conjunction. Truth Action/EventType changes cannot affect held-fixed evidence. Recognition evaluates only observer-owned candidates and typed cues. Unique support may assert a correct or wrong candidate; ambiguity/unfamiliarity emits traceable no-update; explicit contradiction without replacement appends withdrawal; cue absence and same-candidate evidence do not change current resolution. Identity claims require observer-owned symbol mapping, and candidate-domain metadata cannot truth-correct perception. False continuity/merge/split and later classification/recognition append without truth repair or rewrite. Every character evidence edge resolves through an exact admitted schema/seam and the consumer's narrow same-observer/scope-aware `ReadDomain`; semantic carrier IDs never substitute as proof. Shared observer evidence is visible only through explicit shared references, while hidden common ancestry remains absent. Causal roles derive only from admitted observer-side binding evidence, may coexist, and never rewrite event roles. Missing evidence, explicit false, modality access, feature access, classification certainty, and recognition certainty remain distinct. Opaque ordinals are psychologically inert. Classification and recognition cannot bypass their envelopes into learned action identity or downstream psychology/state.

Each observation lane sees only truth/state available strictly before its entry cutoff. No evidence allocates no experience; each successful reservation freezes exactly one distinct immutable envelope. Causal-role companions and recognition resolution leave it unchanged. Phase-20/126 recognition inputs remain byte-stable after source mutation, and consequence recognition may append correction without rewriting current history. Phase 130 learns only from permitted perceived consequence; automatic adaptation remains truth-side. Phase 150 accepts no ordinary event, and all same-instant records commit or roll back together.

**Causal counterfactual obligation:** Truth-identity/facet copy, referent- or role-keyed binding, global role cardinality, generic Context, event-domain widening, duplicate opaque occurrences, freeform qualifiers, binding/role ordinal psychology, visibility-implies-truth-role, redundant Action binding, event-role/causal-role collapse, hidden causal derivation, linkable/hashed/encrypted truth handles, hidden common-ancestor tokens, universal record-level evidence flags, generic evidence IDs, cross-observer provenance, global visibility/confidence, occurrence IDs as grouping/magnitude, character trace queries, recursive/winner-takes-all causal roles, truth-corrected continuant/event tracking, truth-event-keyed segmentation, experience/event collapse, ungrouped bindings, continuant-file Action identity, event-file continuant classification, global cross-observer allocators, identity ordinal psychology, shared truth/perceptual facet IDs, missing-as-false at either layer, stored Unknown, duplicate/missing facet authority, freeform tags, classification-to-identity/pressure shortcuts, recognition rewrite, and authoritative prose/LLM logic each fail exact comparison or closure.

**Epistemic obligation:** Simulator `SemanticReferentId`, truth `EventId`, hidden bindings, unobserved truth facets, and truth causal/action classification remain truth/trace-side unless named observation establishes character evidence. Detection IDs are observer-side, never truth handles. Continuant/event transitions explain deterministic continuity from permitted support and may be objectively wrong. Perceived bindings name an event-file and continuant-file. Classification derives only from typed observer feature observations through the model's sole facet rule; absence is unresolved and explicit false requires negative evidence. It implies neither truth identity, kind ontology, continuity, recognition, nor appraisal. Recognition may later read classification through assembled experience but never truth identity or a classification-to-identity shortcut. Character-accessible records become evidence only through a consumer's exact typed `ReadDomain`; later interpretations cannot back-project into their sources. Character provenance exposes explicit observer-safe edges only and cannot traverse omniscient ancestry. Evidence availability and quality remain observer/channel/feature/proposition-relative rather than one binary visibility state or shared confidence scalar.

**Historical/developmental horizon:** One multi-observer event, same-instant pre-recognition experience, one recognition event, one later correction, a save/load boundary, and one later historical rendering or memory consumer.

**Exact comparison rule:** Canonical structural equality for unchanged perceptual evidence across recognition and hidden-truth interventions; independent equality for held-fixed event grouping/continuant-track/classification/recognition/causal-role axes; exact current and consequence phase membership; strict `< lane-entry` truth availability; zero allocation for no-evidence admission; a one-to-one reservation/envelope relation; distinct current/consequence experience identity; canonical classifier work independent of construction order; byte equality of frozen envelopes, recognition inputs, and historical resolutions after later derivation/correction; one unchanged continuant track under false continuity and two immutable tracks under false discontinuity; one event-file under false merge and two under false split; observer allocation independence; psychological equality under opaque ordinal renaming; exact event grouping and classification membership; exact absence versus explicit false at feature and classification layers; exactly one rule authority per facet/model/domain; exact schema/seam and consumer-`ReadDomain` admission; one declared identity key per authoritative occurrence; typed inequality for equal ordinals from different namespaces; transition-key uniqueness; one retirement per event-file; exact revision-link order independent of equal timestamps and allocation order; byte-equivalent recognition continuation without evaluation-trace dereference; `RunIdentity` rather than `ModelIdentity` divergence for changed seeded knowledge; structural absence of truth identities/facets/handles and hidden common-source tokens; zero authoritative-outcome reads in character phase 130; zero domain events at phase 150; zero direct identity or psychological outputs from classification; first divergence at the deliberately changed phase, cutoff, reservation, binding, grouping, schema permission, observer/window/modality/feature/carrier applicability, evidence availability, classification, track, hypothesis, causal-role basis, model, canonical schema/state identity, or prohibited field.

**Required trace fields:** truth event/binding IDs, roles/referents/facets, truth-availability phase and selected observation lane, observation affordance and reads, lane admission/no-evidence result, experience reservation and envelope phase, perceived binding/classification IDs, canonical classifier work key, observer-scoped continuant/event allocation provenance, both self-identifying transition records and observer-side detection occurrence keys, prior/current continuant/event referents, continuity kinds, event grouping, event-role evidence, feature observation ID/value/channel/support, classification rule/result/facet/value/support, no-assertion and omission reasons, model identity and authority registry, frozen recognition-input identity/phase, observer recognition catalog/template/symbol mapping occurrence, cue polarity and typed experience evidence, every trace-only recognition evaluation/result, evaluation→resolution trace edge, self-sufficient resolution assertion/withdrawal and revision ancestry, character evidence ref kind/target schema/producing seam, consuming transition and `ReadDomain`, observer/window/modality/feature/carrier validation, causal-role rule/basis/output, outcome-evaluation permitted reads, separate adaptation route, settlement validation boundary, separate omniscient derivation edges, receiving read/emission audit, and renderer viewpoint/version.

**Applicable seams:** governed content/referent registries, world events, perception/attention, bounded observation support, `SemanticExperience`, recognition, memory/belief interpretation, trace, rendering, ordering, allocation, and save/load.

**Reopen conditions:** a required phenomenon needs uncertain roles, graded/probabilistic/categorical classification, explicit classification ambiguity, multiple simultaneous facet authorities or aggregation, hierarchical events, full ontology inference, cross-modal continuant/event identity, file joining/splitting beyond immutable association, deception/disguise, facet-specific disclosure, a new character evidence-reference class, direct cross-observer provenance, causal-role recursion/event→event causality, character-accessible truth ancestry, another same-instant observation lane, empty experiences, causal roles inside the envelope, classifier dependencies, a different recognition snapshot/placement, post-140 schedulable domain work, or another allocation lifecycle.

---

## `PHEN-LEARN-001` — Informativeness under censored evidence

**Version:** `1.0.0-draft`

**Required setup domain:** Exact estimate state with no decay, observation precision `2`, and four lower-bound cases: established `(mean=2/5, precision=50)` with bound `1/10`; established `(1/20,50)` with bound `1/10`; nonnegative prior with bound `0`; and six repeated bounds `1/10` followed by point evidence `21/50`.

**Interventions:** Change only whether the bound contradicts the prior, whether it is zero-information, repetition count, or whether final evidence is a point.

**Observable obligation:** A compatible weak bound changes neither mean nor non-decayed precision; an inconsistent bound moves mean upward and grows precision; a zero-information bound manufactures neither; repeated identical bounds grow precision only on the first newly informative occurrence; later point evidence moves more than under the retired unconditional-growth control.

**Causal counterfactual obligation:** The retired rule that grows precision on every observation fails the compatible, zero-information, and repeated-bound cases.

**Epistemic obligation:** The learner receives observation classification and measurement, never hidden Overflow or authored true efficacy.

**Historical/developmental horizon:** One update and a seven-observation sequence.

**Exact comparison rule:** Exact equality or strict rational inequalities stated above; no display tolerance. Internal representation may differ only if these observations and future point-update consequences remain equivalent.

**Required trace fields:** prior, evidence kind/value/precision, informativeness decision, quantization, posterior, comparison-control posterior.

**Applicable seams:** interoceptive observation, evidence classification, expectation/belief update.

**Reopen conditions:** upper-bound behavior differs, accepted-bound precision fails a requirement, decay changes the property, or richer posterior phenomena are added.

---

## `PHEN-MEM-001` — Memory accessibility is historical and bounded

**Version:** `1.0.0-draft`

**Required setup domain:** At least two episode/imprint records with controlled encoding times, equal semantic match, distinct retrieval histories, bounded `topK`, and a future observation time.

**Interventions:** Vary only encoding recency, repeat one retrieval, advance time without retrieval, and create an exact accessibility tie.

**Observable obligation:** More recent memory is initially more accessible; retrieval increases later accessibility relative to its unretrieved counterfactual; accessibility decays; selection never exceeds `topK`; ties resolve by canonical ID; only selected memories receive retrieval reinforcement.

**Causal counterfactual obligation:** Recomputing from current narrative importance alone or reinforcing every candidate differs on at least one fixture.

**Epistemic obligation:** Retrieval operates on character-retained imprints, not unavailable event truth. Current recollection may differ from the immutable truth trace.

**Historical/developmental horizon:** Multiple encoding times, one retrieval, and later comparison after decay.

**Exact comparison rule:** Strict ordering for recency/reinforcement, exact `topK` cardinality, exact canonical tie winner, and zero mutation for unselected records. The historical decay equation is a control, not the equivalence relation.

**Required trace fields:** candidate source, accessibility components, ordering, selected IDs, retrieval mutation, truth/imprint/recollection identities.

**Applicable seams:** encoding, memory retention, retrieval, recognition, workspace.

**Reopen conditions:** consolidation removes detail, reconstruction changes content, semantic indexing changes, or inaccessible-but-retained recall is required.

---

## `PHEN-REASON-001` — Independent reasons and correlated evidence

**Version:** `1.0.0-draft`

**Required setup domain:** Options with signals covering same motive/same referent; same referent/different motives; same motive/different referents; independent evidence `{1}` and `{2}`; later aggregate evidence `{1,2}`; positive and negative motive-generating contributions; zero base motive with nonzero modifier; weak nonzero base motive with matching modifier.

**Interventions:** Change one motive, referent, evidence basis, direction, or source role at a time.

**Observable obligation:** Exact semantic keys merge only matching reason identity; distinct motives or referents remain separate; `{1,2}` adds zero effective evidence after `{1}` and `{2}`; a modifier cannot create a zero-base reason; a matching modifier can rescue a weak genuine motive; one resolved reason contributes at most one base die.

**Causal counterfactual obligation:** Pooled-channel compilation, pairwise-only overlap, one-die-per-fact, and identity-as-independent-die controls are distinguishable.

**Epistemic obligation:** Every signal cites permitted character-relative evidence. No runtime LLM, embedding similarity, or hidden target state assigns motive/referent identity.

**Historical/developmental horizon:** One compilation plus any history required for the standing modifier.

**Exact comparison rule:** Exact nucleus counts and typed keys; exact zero for collective redundancy and zero-base modifier; strict increase for weak-motive rescue; exact provenance preservation.

**Required trace fields:** raw signal, source role, evidence basis, coverage calculation, consolidated strength, resolved key/direction, die/modifiers, rejected-source reason.

**Applicable seams:** motives, cognitive signals, Reason Nuclei, correlation consolidation, option appraisal.

**Reopen conditions:** causal non-participant referents are added, direction identity changes, new source roles cannot compile, or aggregate coverage becomes order-sensitive.

---

## `PHEN-DECISION-001` — Dice express unresolved authorship

**Version:** `1.0.0-draft`

**Required setup domain:** At least two live options under three exact regimes: one decisively favored; low-significance near-even conflict; high-significance near-even conflict. Each option has a complete exact distribution compiled from independent reasons.

**Interventions:** Vary only reason balance, significance, run seed, and world interference after intent.

**Observable obligation:** Settled preference chooses without a roll; unresolved low-significance choice uses quiet stochastic resolution; unresolved high-significance choice exposes the same authoritative roll as player-facing; pre-roll probabilities normalize exactly; identical address/seed replays; chosen intent and frozen `DecisionExpression` survive prevented execution.

**Causal counterfactual obligation:** Always-roll, never-roll, decorative-dice, opaque-weighted-choice, and intent-equals-outcome controls each fail at least one regime.

**Epistemic obligation:** The character may know cognitively available reasons but not the raw random word or hidden future interference unless explicitly observed.

**Historical/developmental horizon:** One decision through post-attempt observation and historical recording.

**Exact comparison rule:** Exact normalization/replay; exact mode for registered thresholds; `DecisionExpression` equality across prevented/successful execution when pre-attempt decision state is identical; distinct outcome records.

**Required trace fields:** options, reasons, dice expressions, distributions, margin/contest/stake/authorship, mode, random address/result, intent, pre-attempt snapshot, attempt, outcome, expression.

**Applicable seams:** reason compilation, option appraisal, arbitration, intent, execution, trace, memory.

**Reopen conditions:** significance changes authoritative math, multi-option conflict invalidates metrics, control conflict is conflated with uncertainty, or a different grammar meets all obligations.

---

## `PHEN-BIO-001` — Early stochastic choices author later differences

**Version:** `1.0.0-draft`

**Required setup domain:** Two characters with identical model, content, initial state, inputs, and non-decision random addresses. Decision seeds produce at least one different early meaningful result. A later probe uses an identical third seed and identical external state.

**Interventions:** Couple or vary only early decision addresses; ablate identity feedback; reverse qualifying expressions; hold probe randomness fixed.

**Observable obligation:** Different early intents produce different frozen expressions, identity evidence, and later standing modifiers. The matched probe may differ because biography differs. Ablating feedback removes the future decision effect while preserving history. Sustained contrary high-authorship evidence can weaken or transform identity; one contradiction need not erase it.

**Causal counterfactual obligation:** Authored-trait, display-only-trait, history-without-feedback, and recomputed-history controls are distinguishable.

**Epistemic obligation:** Identity evidence derives from frozen contextual expressions and permitted feedback, not success alone or omniscient labels.

**Historical/developmental horizon:** Multiple contested decisions, consolidation, one matched probe, and sustained contradiction.

**Exact comparison rule:** Exact equality before first differing roll; first downstream divergence descends from that roll; strict identity-evidence difference by probe; ablation preserves histories but removes matching modifier; old expressions remain structurally identical after later identity change.

**Required trace fields:** coupled addresses, roll ancestry, expressions, identity updates, consolidation, standing modifier, probe distribution/mode/intent, ablation markers.

**Applicable seams:** arbitration, DecisionExpression, identity evidence, consolidation, standing modifiers, memory.

**Reopen conditions:** identity is derived/compressed equivalently, authorship weighting changes, or mature identity eliminates all meaningful uncertainty.

---

## `PHEN-COMMIT-001` — Commitment pressure follows concrete lifecycle identity

**Version:** `1.0.0-draft`

**Required setup domain:** One character with strong matching commitment identity; no active commitment; one active concrete commitment; the same commitment retired; and a new recurrence with a distinct stable ID.

**Interventions:** Add, retire, and replace only the concrete instance while holding identity and all other state fixed.

**Observable obligation:** No active commitment yields no commitment motive; active commitment yields one correctly referented motive; retirement removes it despite persistent identity; the recurrence yields a new referent and never resurrects the retired instance.

**Causal counterfactual obligation:** Commitment-as-Core-Need, immortal pressure, and reused-ID recurrence controls fail at least one state.

**Epistemic obligation:** Others learn about the commitment only through permitted communication, observation, or records; private existence is not automatically social knowledge.

**Historical/developmental horizon:** Creation, active decision, terminal transition, and recurrence.

**Exact comparison rule:** Exact zero/one commitment-reason cardinality; exact referent equality for active instances and inequality across recurrences; identity state unchanged across retirement-only intervention.

**Required trace fields:** commitment ID/version/state, lifecycle event, applicability, generated pressure, reason referent, standing modifier, retirement cause.

**Applicable seams:** authored content, goals/commitments, motives, reasons, consolidation, social evidence.

**Reopen conditions:** partial fulfillment, conflicting beneficiaries, delegation, recurring-series identity, or lifecycle consequences require new distinctions.

---

## Entry template for subsequent intake

```text
PhenomenonId:
Version:
Historical intake:
Required setup domain:
Intervention(s):
Observable obligation:
Causal counterfactual obligation:
Epistemic obligation:
Historical/developmental horizon:
Exact comparison rule:
Required trace fields:
Applicable seams:
Reopen conditions:
```

2026-09-06 corpus 0.26 / PHEN-ADAPT-001 1.10: corrects record-level CharacterLearningEvidence
to accepted OutcomeLearningEvidence. This changes the explicit comparison schema claim and is
versioned substantively; 1.9 carried stale generic naming. Manifest digest recomputed from the
canonical versioned manifest, not a file hash. Fixed common-root bridge controls remain proposed.
