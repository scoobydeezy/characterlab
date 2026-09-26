# Research Verdict Ledger

**Status:** active ledger; Campaign 0 substrate verdicts accepted 2026-09-01

Material Campaign 3 findings are indexed in [RESEARCH_OBLIGATIONS.json](RESEARCH_OBLIGATIONS.json).
Every new/amended verdict needs an obligation review there, including an explicit
reason if none remain. See [bookkeeping policy](RESEARCH_OBLIGATIONS.md).

Historical findings live in `reference/RESEARCH.md`. They become active evidence only when re-entered here with their original conditions and tested against the current formal contract and corpus.

Each entry records:

- verdict ID and date;
- candidate distinction and seam versions;
- model identities compared;
- declared state/input domain;
- phenomenon corpus version and coverage argument;
- exact equivalence relation or valid discriminating witness;
- random coupling or distribution-comparison method;
- counterfactuals;
- known uncovered regions;
- verdict: `RETAINED`, `DERIVED`, `MERGED`, `COMPRESSED`, `RETRACTED`, or `UNRESOLVED`;
- reopen conditions;
- trace/test artifacts.

No historical result is automatically retracted; none is automatically governing.

## `VER-C0-RNG-001` — Addressed-random substrate port

- **Date:** 2026-09-01
- **Candidate/contracts:** `cenc/1`, `cenc-records/0.1-candidate`, `substrate/0.2-candidate`, `rng/sha256-addressed-128-v1-candidate`
- **Compared control:** preserved 64-bit delimiter/FNV-based counter-addressed oracle under `reference/src/kernel/random.ts`
- **Declared domain:** 256-bit run seeds; registered semantic addresses; bounded spans `1..2^32`; positive canonical weighted choices with total at most `2^32`; injective role-compatible comparison maps
- **Evidence:** `CV-ENC-001..003`, `CV-ID-001..005`, `CV-RNG-001..008`, independently reproduced SHA-256 golden, reduced-width exhaustive threshold enumeration, exact bound inequalities, and the five preserved historical random tests
- **Preserved properties:** pure causal addressing, replay, unrelated-draw independence, purpose separation, explicit paired coupling, and exact range membership
- **Changed representation:** structured canonical records replace delimiter strings; 128-bit SHA-256 candidates replace the historical 64-bit FNV-derived word; bounded rejection plus a quantified fresh modulo fallback replaces direct exact-rational word exposure
- **Verdict:** `RETAINED`
- **Uncovered region:** psychological dice/modifier use remains outside this substrate verdict
- **Reopen conditions:** address or schema change, random algorithm/version change, failed platform golden, observed replay divergence, or evidence invalidating the declared ideal-candidate bias analysis

## `VER-C0-TIME-001` — Exact arithmetic and analytical-time port

- **Date:** 2026-09-01
- **Candidate/contracts:** `substrate/0.2-candidate`, `cenc/1`
- **Compared control:** preserved exact-rational oracle plus the documented separately floored/re-anchored analytical progression defect
- **Declared domain:** bigint exact arithmetic; `SimInstant` in `0..Int64.MaxValue`; signed Int64 durations; linear integer rates over positive integer scales; explicitly bounded stored values
- **Evidence:** sign-correct division and ties-to-even fixtures, `CV-TIME-001..006`, positive/negative direct-versus-partitioned equality, the failing truncation control, checked overflow fixtures, and seven preserved historical rational tests
- **Preserved properties:** exact reduction, exact equality and comparison, deterministic arithmetic, non-mutating analytical reads, and semantic-event materialize→mutate→re-anchor order
- **Changed representation:** authoritative number-to-rational conversion is absent; linear anchors retain bounded exact remainder; every semantic re-anchor explicitly chooses its next parameter identity and remainder
- **Verdict:** `RETAINED`
- **Uncovered region:** nonlinear psychological dynamics remain outside this linear analytical-time verdict
- **Reopen conditions:** numeric profile change, time-unit change, new nonlinear candidate, representation-bound change, partition divergence, or save/load mismatch

## `VER-C0-ORD-001` — Ordering, atomic-instant, and persistence substrate

- **Date:** 2026-09-01
- **Candidate/contracts:** `ordering/0.2-candidate`, `state/0.2-candidate`, `trace/0.2-candidate`, `save/1-candidate`, `cenc/1`
- **Compared control:** preserved monotonic logical `EventClock` and deterministic replay fixtures
- **Declared domain:** registered phases; nonnegative global event/sequence/runtime allocators; quiescent saves; positive manifest-committed settlement ceiling; registered event handlers
- **Evidence:** `CV-ORD-001..004`, `CV-SAVE-001..002`, nine generic `CV-TXN-001` failure boundaries, mutable-reference isolation, canonical save round-trip, uninterrupted-versus-loaded continuation, and four preserved deterministic replay tests
- **Preserved properties:** logical time, deterministic event identity, replay, causal addressing continuity, and handler-independent serialized data
- **Changed representation:** `(DueAt, Phase, EventSequence)` replaces per-tick sequence ordering; allocation is run-global; an entire instant is atomic; queue/allocators/anchors/coupling inputs serialize canonically; handlers resolve by typed registry ID
- **Verdict:** `DERIVED`
- **Uncovered region:** later multi-character and regulation-specific phase decisions remain separately open
- **Reopen conditions:** phase registry or event schema change, different transaction boundary, allocator change, cascade policy change, canonical save migration, or replay/save divergence

## `VER-C0-STATE-TRACE-001` — State ownership, transition proof, and trace substrate

- **Date:** 2026-09-01
- **Candidate/contracts:** `state/0.2-candidate`, `trace/0.2-candidate`, `ordering/0.2-candidate`, `save/1-candidate`, `cenc/1`
- **Compared control:** prose-only mutation/read declarations and generic scheduler trace contributions, with forbidden overlap, stale-write, forged-read, mutable-alias, aborted-trace, and first-divergence negative controls
- **Declared domain:** canonical leaf paths using typed entity, canonical map-key, and stable-list-item selectors; prefix patterns with typed wildcards; exactly one authority for every declared writable family; canonical set/remove patches with exact preconditions; capability-bound accessors; whole-instant transactions
- **Evidence:** `CV-OWN-001`, `CV-READ-001..002`, `CV-PATCH-001..003`, `CV-TRC-001..003`, nine concrete transaction-boundary injections, unknown-schema rejection, structural decode/re-encode, and integrated save/load continuation in `PHEN-DET-001`
- **Preserved properties:** deterministic replay, deep counterfactual isolation, event identity and causal continuity, complete read/write provenance, exact pre/post mutation proof, and terminal all-or-nothing failure
- **Changed representation:** flat canonical leaf storage is the Campaign 0 reference oracle; semantic implementations interact through registered typed projections and patches rather than direct object mutation; complete committed records are finalized only after child-event allocation; aborted staged evidence is diagnostic-only
- **Verdict:** `DERIVED`
- **Uncovered region:** psychological state-family ownership and privacy-safe trace views require their own later seam contracts
- **Reopen conditions:** state-path selector or ownership semantics change, patch precondition/order change, trace schema evolution, non-atomic settlement, emitted-event allocation order change, save/restore mismatch, or first-divergence failure

## `VER-C0-CONTENT-001` — Governed content and registry commitments

- **Date:** 2026-09-01
- **Candidate/contracts:** `content/0.2-candidate`, `cenc-records/0.1-candidate`, `substrate/0.2-candidate`, `cenc/1`
- **Compared control:** generic fixture-only manifest commitment without an initial governed schema, semantic validators, resolved references, or canonical registry descriptors
- **Declared domain:** type-170 governed semantic world/action definitions; types 171–173 semantic and record-schema registries; type-174 phenomenon corpus manifest; stable typed IDs; acyclic content references; deterministic semantic-kind validators
- **Evidence:** exact canonical content, registry, and corpus bytes, independently computed SHA-256 digests, every-authoritative-field sensitivity, presentation-only insensitivity, construction-order invariance, and duplicate/unknown/out-of-domain/cycle/malformed negative controls
- **Preserved properties:** structural `ContentIdentity`/`RegistryIdentity`, presentation separation, complete inspectable manifests, and deterministic failure before model construction
- **Changed representation:** authoritative content must use the complete governed field set and a validator registered for its semantic kind; free-form or digest-only content cannot enter an authoritative model
- **Verdict:** `DERIVED`
- **Uncovered region:** each later content kind and psychological receiving seam must define its own domain validator and may not author interpretation directly
- **Reopen conditions:** field authority, schema/version, reference/cycle policy, validator resolution, canonical registry, or commitment semantics change

## `VER-C1-OBS-001` — Bounded truth-to-permitted-evidence epistemic boundary

- **Date:** 2026-09-01
- **Candidate/contracts:** accepted immutable identifier `observation/0.1-candidate`; accepted Campaign 0 substrate contracts
- **Compared controls:** historical authoritative `Applied` point measurement and truth-side saturation classification; `OverflowLeak`, `FullProvenanceCopy`, `MissingAsZero`, and `AlwaysPoint` prohibited models
- **Declared domain:** exact signed bounded scalar effects; registered deterministic state-change or named omniscient-control channels; known bounds; exact point/lower/upper intervals; registered polarity, precision, missingness, and restricted visible provenance slots. A token may carry a truth-side concept ID only when the channel itself establishes identity; general event observation is excluded.
- **Evidence:** `CV-OBS-001..006`, `CV-EPI-001..002`; exact `PHEN-EPI-001` pair through capability-limited reads, accepted transactional scheduling/trace, thin `SemanticExperience`, and a same-instant immediate consumer; canonical round trips, forbidden-record closure, invalid-input rollback, and named first divergence for every prohibited control
- **Preserved properties:** historical `EffectProvenance` remains complete truth/trace input; a restricted registered visible causal-role projection remains a control; exact state change remains observable; missing evidence remains explicit
- **Changed representation:** clipped state change at a known boundary becomes a bound rather than a falsely exact efficacy value; classification never reads hidden `Overflow`; full provenance cannot enter character evidence; visible-slot tokens and the source-record reference are restricted to the declared control fixture and make no general event-semantic or cross-event-linkability claim
- **Verdict:** `DERIVED`
- **Uncovered region:** amended `SEM-001A` resolves observer-relative, potentially mistaken continuant-files for people, discrete objects, and places/regions, with independent allocation and no truth repair or ordinal psychology. `SEM-001B` resolves truth binding occurrence identity, role grammar, cardinality/domain narrowing, and truth-role epistemic projection. `SEM-001C` resolves fallible event-files, event-grouped perceived bindings, experience/event multiplicity, continuant/event carrier separation, and transactional replay. `SEM-001D` resolves finite typed continuant classification, optional boolean assertions, feature missing/false semantics, sole facet authority, provenance, and output boundaries. `SEM-001E` resolves finite typed event-pattern classification, scoped necessary-feature conjunction, append-only evidence, Action projection asymmetry, and separation from learned action identity. `SEM-001F` resolves continuant-instance recognition permission, typed cue evaluation, categorical misrecognition, append-only replacement/withdrawal, and output boundaries without track repair. `SEM-001G` resolves closed character-evidence references, exact schema/seam and consumer-`ReadDomain` admissibility, strict same-observer safe linkage, separate omniscient/character graphs, proposition-local future evidence quality, and nonrecursive multi-role causal-role epistemics. `SEM-001H` resolves exact current/consequence phase lanes, truth cutoffs, conditional experience reservation, immutable experience/recognition snapshots, perceived-outcome learning, adaptation separation, and settlement-barrier semantics without deciding `ORD-001`. `SEM-001I.1` resolves the canonical schema inventory, exact occurrence keys, recognition-knowledge instance ownership, trace-only evaluations, self-sufficient resolution state, typed occurrence allocation, and revision-topology history; `SEM-001I.2` freezes the permanent numeric allocation and union matrices. Canonical runtime codecs/persistence and the integrated binding gate, noisy/ambiguous sensory production beyond the symbolic fixture, attention, event/action-schema recognition, interval-aware surprise/learning, memory, and belief updates remain separate later contracts. Parent `SEM-001` is the immediate P0 owner; full ontology inference remains under `ONT-001`.
- **Reopen conditions:** measurement mode, interval vocabulary, polarity, channel-known bounds, missingness, visibility/role projection, precision/unit, timing, safe-reference policy, or any discovered hidden-truth influence

**Scope clarification — 2026-09-01:** Opening `SEM-001` does not retract the bounded-measurement verdict or reopen `MATH-006`. It narrows this verdict's semantic-token claim to identity-establishing channels and prevents the thin measurement envelope from being mistaken for a proven general event representation.

## Regulatory diagnostic probe — runtime qualification, 2026-09-07

- Contracts: regulatory-diagnostic-probe/0.1-candidate under rules/campaign2-regulatory-probe/0.2-candidate; exact frozen digest fda39ae4a8d82cbf531b41ce35c9af7ebb2ec5c7f233c4f7adbd7e6d7eba80e9.
- User verdict: PROBE-A..P PASS, accessor A..E PASS, ADAPT-9a PASS. This is runtime/phenomenon qualification, not a psychological reduction verdict.
- Paired domain: same model, matched exposure/opportunity skeleton, retained D=0/1, later same probe/time/R0; n=50/51 and permitted q=5 and q=51/10.
- Equivalence: before later permission, complete observer projection equal; suppressed cases and later sentinel equal; matched support produces equal X/E/L. All persistent state unchanged by probe. No random operation is introduced.
- Scope: F1 generic temporal REG + production consumer and F2 frozen public exclusion; no temporal public model executed. G1 public positive, G2 generic signed-domain production consumer and G3 public exclusion.
- Evidence: CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md and fingerprinted runtime/mutation/audit/continuation artifacts. Retain the real extra-learning-output defect and successful corrected rejection.
- Uncovered: cognitive numeric access, belief/memory/learning/appraisal/reward/goal/decision or physiological/performance change; ADAPT-9b, parent control 9, PHEN-ADAPT-001, ADAPT-001 formal verdict and Campaign 2 remain OPEN.
- Reopen conditions: changed seam/profile/declarations/read or output authority, failed preserved vector/mutant, lost artifact preservation or continuation divergence. New cognitive carriage is a new target/seam, not reinterpretation of this verdict.

## Measurement-evidence carriage — accepted runtime qualification, 2026-09-07

User verdict qualifies measurement-evidence-carriage/0.1-candidate under frozen
rules/campaign2-measurement-evidence/0.1-candidate: EVC-A..P PASS, EVC-PACK-A..I PASS,
EVC-MODEL-BYTE remains PASS. No model bytes, allocation or runtime semantics change.

EVC-B = PASS iff B1 and B2: actual generic REG provider + diagnostic producer + production
observation validation + shared V07 ingress + actual intake gives equal 203/337 for
anchor50,D1 versus anchor51,D0; separately, the frozen public model rejects the altered
anchor. This is not a public frozen-model run with different R0 declarations.
EVC-E covers only the accepted diagnostic-present domain. PACK-B covers only the frozen
first production model, not arbitrary V07. PACK-I rests on exact profile/compiler reuse
plus bounded witnesses, not exhaustive enumeration of the infinite manifest domain.

The qualified result is transient observer-owned cognitive measurement evidence with
provenance-safe content. Persistent cognition is unchanged. The restore configuration
omission and its explicit correction remain in the qualification review; no frozen bytes
changed to correct it. This is runtime qualification, not a psychological reduction verdict.

Evidence: CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md and its linked runtime,
continuation and materialization proof artifacts. Earlier pending-review entries are history.
ADAPT-9b, parent ADAPT control 9, PHEN-ADAPT and Campaign 2 remain OPEN.
CAMPAIGN2_RESPONDING_COGNITION_TARGET_REVIEW.md proposes episodic measurement retention
and later recall for target selection only; no responding mechanism is accepted yet.

## Whole measurement-memory seam shape acceptance — 2026-09-08

M1–M5 and M5 revision 4 symbolic closure are WHOLE SHAPE ACCEPTED at
`measurement-episodic-memory/0.1-candidate`; see
[formal disposition](../formal/MEASUREMENT_EPISODIC_MEMORY.md).
Fourteen schemas and minimal members are accepted in shape. Combined numeric allocation
review is authorized next; separate numeric freeze precedes packaging/materialization.
Runtime implementation is NOT AUTHORIZED. MEMR-A..P remain FROZEN/NOT PASSED;
ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.
This supersedes earlier pending whole-shape dispositions, not runtime gates.

## Memory allocation frozen; packaging revision 1 — 2026-09-08

measurement-memory-allocation/0.1-candidate is ACCEPTED AND PERMANENT: records342–355,
occurrence namespaces1125–1126,15 members and14 field roles. No union allocation.
Successor packaging is authorized; runtime remains gated. See
[packaging revision 1](CAMPAIGN2_MEASUREMENT_MEMORY_PACKAGING.md).
C2-MEM-PACK-001 records the concrete transition-owned projection serialization gap and
proposes a successor-profile registration envelope for review, with RecallDelay=1 tick.
No model packet/digest or runtime pass is claimed. MEMR-A..P FROZEN/NOT PASSED;
ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 OPEN.

## Memory packaging revision 1 review; wrapper shape draft — 2026-09-08

RecallDelay=signed SimDuration(1),16 configurations, ordered-input reuse and trace/persistence
bindings are accepted; six-slot direction is accepted. C2-MEM-PACK-001 anonymous list envelope
is REJECTED. Packaging revision2 replaces it with three proposed exact canonical
TransitionSeamContract wrappers and separate typed collections; see
[wrapper shape draft](CAMPAIGN2_MEMORY_TRANSITION_WRAPPER_DRAFT.md).
Frozen342–355 remain unchanged. Wrapper shape acceptance must precede separate append-only
numeric review. No new numbers are allocated. Whole packaging, materialization and runtime
remain gated. MEM-PACK-A..G and MEMR-A..P FROZEN/NOT PASSED; ADAPT-9b, parent control9,
PHEN-ADAPT and Campaign2 OPEN. This supersedes the earlier ordered-pair proposal.

## Wrapper and whole packaging shape accepted — 2026-09-08

C2-MEM-PACK-001 CLOSED. Three typed TransitionSeamContract wrappers and packaging revision2
are SHAPE ACCEPTED. StaticBindings is profile-fixed exactly empty; any external injection
rejects under MEM-PACK-F. Separate three-record append-only allocation review is authorized
next. Existing342–355 remain frozen and unchanged. Materialization follows wrapper numeric
freeze; runtime remains blocked. MEM-PACK-A..G and MEMR-A..P FROZEN/NOT PASSED;
ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 OPEN.

## Wrapper allocation frozen; concrete memory materialization — 2026-09-08

memory-wrapper-allocation/0.1-candidate is ACCEPTED AND PERMANENT:356–358 and nine local
fields, with zero new identity/member/role/occurrence/union surfaces. The historical342–355
allocation remains unchanged. Model materialization is authorized; runtime remains gated by
concrete model freeze. See CAMPAIGN2_MEASUREMENT_MEMORY_MATERIALIZATION_REVIEW.md for
review evidence; no concrete ModelIdentity acceptance is inferred. MEM-PACK-A..G and
MEMR-A..P remain NOT PASSED; ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 OPEN.

## C2-MEM-PACK-002 — materialization substrate blocker, 2026-09-08

Independent slot5 inspection found inherited268/1 StateMapKey role absent. The accepted
14-role delta leaves materialized IDN inadmissible under stateModel.ts. Review specimens
are labeled BLOCKED/NOT ADMITTED, not candidates for concrete freeze. Proposed repair:
add one existing265/264/263 declaration for StateMapKey268/1, namespace1000, no validator;
slot5 delta becomes15 (14 memory +1 IDN), zero wrapper roles. No allocation change.
See CAMPAIGN2_MEASUREMENT_MEMORY_MATERIALIZATION_REVIEW.md. Repair NOT APPLIED;
user review required to amend accepted exact slot5 delta. Runtime and qualification remain gated.

## C2-MEM-PACK-002 accepted and applied — 2026-09-08

Successor slot5 is amended to15 declarations:14 frozen memory RecordField roles and1
IDN StateMapKey268/1 role (namespace1000, no validator). No allocation/schema/version changes.
The previously blocked16 specimens are retained only in campaign2-measurement-memory-blocked-review;
none was ever admitted or frozen. All16 commitments are being recomputed from declarations.
Concrete ModelIdentity freeze remains the next gate; runtime and MEM-PACK/MEMR qualification
remain blocked. This supersedes earlier exact14-only packaging accounting without editing
fingerprinted historical authority documents or allocation artifacts.

## Corrected16-model review packet — 2026-09-08

C2-MEM-PACK-002 rematerialization yields reference digest
3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9.
All16 commitments changed and remain distinct.589 review/component checks pass, including
actual VAL/stateModel IDN-fragment closure and five adversarial cases.150 preservation
fingerprints include retained inadmissible specimens, which are never historical frozen models.
See CAMPAIGN2_MEASUREMENT_MEMORY_REMATERIALIZATION_REVIEW.md. Concrete model freeze is
pending; runtime and whole MEM-PACK/MEMR qualification remain gated.


## Measurement-memory concrete freeze and runtime evidence — 2026-09-08

The user accepted and froze the corrected reference canonical packet and all16 control
commitments. Reference diagnostic digest:
3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9.
Complete canonical bytes are authoritative; FREEZE.json records the acceptance without
rewriting historical review artifacts. C2-MEM-PACK-002 is concretely CLOSED. The blocked
58a491... family was NEVER ADMITTED/FROZEN and is not a migration or compatibility source.
This supersedes the preceding pending-freeze/runtime-blocked checkpoint.

Authorized production implementation now reproduces all16 exact models and executes M1,
IDN formation, delayed cue, exact episode recall, ablations/padding and mandatory original-S0
prefix restore. See CAMPAIGN2_MEASUREMENT_MEMORY_RUNTIME_REVIEW.md and the production byte
and fresh-process restore proof reports for evidence and explicit public/component scopes.
Whole MEM-PACK-A..G and MEMR-A..P qualification is submitted for review, not locally promoted.
ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN pending that research verdict.
No numeric allocation or frozen model/profile/semantic authority changed.


## Accepted memory qualification and joined ADAPT parent pair — 2026-09-08

The user QUALIFIES measurement-episodic-memory/0.1-candidate in the accepted bounded scope.
MEM-PACK-A..G and MEMR-A..P are PASS. Preserve MEM-PACK-E substrate-composition scope,
MEMR-B component/public split, MEMR-G historical-change/immutability split, and prefix integrity
without antirollback claims. PHEN-MEM-001 remains OPEN / NOT CLAIMED.
See CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md for the accepted research disposition.

The user withheld ADAPT-9b until a same-S0 joined actual-fact intervention witness executed.
That conditional gate is now satisfied: identical model/S0/seed, only earlier count0/1 differs;
four matched rule evaluations create only governed adaptation differences, later actual probe
reads D=0/1 and emits5/51-over-10, exact carriage forms episodes and later identical cues recover
352. Full event/allocator topology matches, and both pending-recall restores match final saves.
ADAPT-9b and parent control9 are PASS under the user's stated condition;52 named pair checks
plus structural assertions pass. No different-adaptation-S0 substitute is used.

PHEN-ADAPT-001 remains OPEN pending the requested consolidation review against inherited gates;
no blanket ADAPT/factory/VAL qualification is inferred. Campaign2 remains OPEN / ACTIVE.
See CAMPAIGN2_PHEN_ADAPT_CONSOLIDATION_REVIEW.md and CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json.
No production code, frozen model, allocation or seam semantics changed in this integration pass.


## Parent-pair acceptance and fixture-alignment review — 2026-09-08

The user explicitly ACCEPTS the joined same-S0 causal witness: ADAPT-9a, ADAPT-9b and parent
control9 are PASS. The PHEN-ADAPT evidence corpus is sufficient except for specification alignment.
PHEN-ADAPT-001 remains WITHHELD: historical accepted ADAPT fixture prose says one applicable
rule/input, while the unchanged frozen model and accepted proof execute four single-path rules.

PHEN_ADAPT_FIXTURE_AMENDMENT.md records the requested correct-forward amendment for explicit
acceptance. It specifies the same nonempty ApplicableRules set, exact rule-derived target paths,
independently expected state-changing subsets, and distinguished D response-mediating path.
Control3 is mechanically satisfied but non-discriminating at leaf-family granularity in this
four-leaf fixture;3a,7g/7g-prime and WRT/collision protections retain the isolation burden.
The historical ADAPT acceptance source and frozen artifacts remain unchanged.

The corpus draft advances PHEN-ADAPT1.10 to1.11 and aggregate0.26 to0.27; the separate manifest
audit preserves both canonical commitments and proves exactly one member changed. This is a
proposal awaiting amendment acceptance, not a silent PHEN PASS. No new model, runtime, allocation
or behavioral witness is required or introduced. Blanket ADAPT/factory/VAL qualification is not
inferred; PHEN-MEM-001 and Campaign2 remain OPEN.


## Accepted fixture amendment and PHEN-ADAPT PASS — 2026-09-08

The user ACCEPTS PHEN_ADAPT_FIXTURE_AMENDMENT rev1 and PASSES PHEN-ADAPT-001 in the bounded
frozen-model scope. ADAPT-9a/9b and parent control9 remain PASS. The four matched single-path
rules, independently specified changed-path sets, distinguished D path, control3 limited scope,
exact-path/key/WRT protections and accepted component scopes remain binding. Historical1.10/
corpus0.26 and the original ADAPT acceptance source are preserved. No blanket ADAPT/factory/VAL
qualification, PHEN-MEM PASS or Campaign2 completion is inferred.

One serialization conflict requires reconciliation: the accepted review digest181ce571... commits
PHEN-ADAPT1.11.0-draft; the explicitly requested1.11.0 promotion compiles to3cb09115.... Both exact
manifests are retained in PHEN_ADAPT_CORPUS_PROMOTION_REVIEW.json. See
PHEN_ADAPT_ACCEPTANCE_AND_CORPUS_VERSION_REVIEW.md. The research PASS is recorded now; only the
current canonical version/digest pair awaits the user's choice. No runtime/model/allocation changes.


## Approved canonical promotion — 2026-09-08

The user approves and freezes PHEN-ADAPT-001/1.11.0 with corpus/0.27.0 and current canonical
digest3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276.
The version/digest reconciliation is CLOSED. PHEN-ADAPT remains PASS in bounded frozen-model scope.
The reviewed1.11.0-draft commitment181ce571... is preserved: superseded reviewed draft, not current,
not invalid, not an alias. Historical corpus0.26/42dc6304... is unchanged. The original review/audit
JSON files retain their exact bytes; PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json records the accepted
promotion separately. The canonical member promotion changes no fixture semantics, model, runtime
or allocation and requires no additional behavioral proof. Blanket ADAPT/factory/VAL qualification
is not inferred. PHEN-MEM-001 and Campaign2 remain OPEN. Current verification command:
node scripts/audit-phen-adapt-corpus-promotion.mjs.

## 2026-09-08 — accepted PERSIST-I scope ruling

PERSIST-I is FROZEN / RETAINED / DEFERRED / NOT PASSED. Its original positive
obligation is preserved. Current bounded no-RNG qualification may continue;
whole PERSIST-A..I, VAL and factory qualification are not inferred. The trigger
is the first separately accepted AND production-supported RNG-consuming seam;
execute PERSIST-I before claiming complete persistence qualification of that build.
An RNG-admitting model requires its own separately accepted persistence extension.
See docs/planning/CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md for the accepted ruling
and CAMPAIGN2_BUILD_METADATA_PROOF.json for the bounded build-inventory control:
baseline exact-byte invariance and both save/restore substitutions detected.
This evidence is not the future positive witness. No fabricated consumer,
primitive-as-consumer substitution, runtime/model/allocation change or blanket
activation is authorized. PHEN-ADAPT PASS is unchanged; Campaign 2 remains OPEN.

## 2026-09-08 — bounded no-RNG persistence qualification accepted

campaign2-persistence/0.1-candidate: BOUNDED NO-RNG PROFILE QUALIFIED.
PERSIST-A..H PASS for the original bounded first profile. PERSIST-I remains
RETAINED / DEFERRED / NOT PASSED; its separately accepted + production-supported
RNG-consuming-seam trigger is unchanged. Whole PERSIST-A..I are NOT ALL PASS.
The accepted argument and exact evidence limits are recorded in
CAMPAIGN2_BOUNDED_PERSISTENCE_QUALIFICATION_REVIEW.md under docs/planning.
The 700 descriptor negatives establish omission/version sensitivity only;
no whole FCT-1/B or VAL verdict follows. Historical matrices retain their original
checkpoint status. Whole factory/FCT and VAL remain OPEN. Memory prefix-replay
persistence is separately governed; RNG-capable persistence is not admitted.
No runtime/model/allocation changes. PHEN-ADAPT PASS unchanged; Campaign 2 OPEN.

## 2026-09-08 — VAL reconciliation accepted

CAMPAIGN2_VAL_CLOSURE_RECONCILIATION and new evidence ACCEPTED.
VAL-E PASS in generic canonical-content permutation scope; VAL-M PASS;
VAL-W PASS in current character-only CONTENT scope. Whole VAL/FCT remain OPEN.
VAL-T second-kind positive remains CONDITIONAL / DEFERRED / NOT PASSED and is
not a current-profile blocker; do not invent a second kind for qualification.
The definitive next evidence map is CAMPAIGN2_VAL_A_W_QUALIFICATION_CROSSWALK.md
in docs/planning, with separate admitted-branch/mutant and declaration-position
matrices. Proposed statuses there are not accepted verdicts.
PERSIST-A..H PASS bounded no-RNG; PERSIST-I DEFERRED / NOT PASSED.
PHEN-ADAPT PASS unchanged; production semantics unchanged; Campaign 2 OPEN.

## 2026-09-08 — VAL A–W crosswalk verdict

CAMPAIGN2_VAL_A_W_QUALIFICATION_CROSSWALK ACCEPTED.
VAL-A B C D E F G H I J K L M N O P Q R S T U W PASS in the exact scopes
recorded by that review: finite accepted language/dependencies, current character
domain, inherited PRJ component, listed owned interpreters, original bounded
restore facade, finite CONTENT specialization, and current VAL-T obligations.
T-positive-second-kind remains FUTURE CONDITIONAL / DEFERRED / NOT PASSED;
not a current blocker. Whole VAL remains OPEN only on VAL-V; FCT stays separate.
The proposed future-profile deferral for VAL-V is REJECTED: the accepted memory
recall wrapper already supplies real266.OutputRole in both R=true and R=false.
Use that public profile for prepare/restore traversal; no invented carrier or
new scope exception. The first-profile-only audit omitted this existing successor
and must not be interpreted as absence of a production carrier across the build.

## 2026-09-08 — VAL-V accepted; whole VAL withheld on stage order

VAL-V PASS. All current VAL-A..W vectors PASS in their previously accepted scopes.
Whole current VAL remains WITHHELD pending one validation-order correction:
CONTENT stages 2/3 must precede DomainValidator/role closure (stage 4), with the
exact frozen memory specimen gate afterward and before ModelIdentity/runtime.
The real public memory266 witness and retained exact-matcher guard are ACCEPTED;
the initial matcher-first assay remains insufficient historical evidence.
Add the requested cyclic/missing-reference CONTENT + malformed266 dual-defect
prepare/restore precedence control. No scope exception or model/allocation change.
T-positive-second-kind remains FUTURE CONDITIONAL / DEFERRED / not a current blocker.
Whole FCT/factory remains OPEN and separate. See CAMPAIGN2_VAL_V_MEMORY_ROLE_REVIEW.md.

## 2026-09-08 — whole current VAL qualified

CAMPAIGN2_VAL_V_MEMORY_ROLE_REVIEW rev2 ACCEPTED. VAL-A..W PASS in recorded
bounded scopes. Whole current VAL QUALIFIED over the accepted Campaign-2
implementation language and finite qualification scopes; not universal compiler
or host equivalence. D finite interpreter mutations; E generic CONTENT permutations;
G/U named dependency alternatives; L/W current character domain; N inherited PRJ;
O listed interpreters; P original bounded restore; Q finite CONTENT specialization.
CONTENT-before-role sequencing and dual-defect precedence control ACCEPTED.
Exact frozen-memory narrowing remains mandatory; no admitted model/identity or
allocation bytes change. The insufficient matcher-first assay remains historical.
T-positive-second-kind is FUTURE CONDITIONAL / DEFERRED / NOT PASSED, not a current
blocker. PERSIST-A..H PASS bounded no-RNG; PERSIST-I DEFERRED / NOT PASSED.
Whole FCT/factory release remains OPEN / SEPARATE, next reconciliation target.
PHEN-ADAPT PASS unchanged; Campaign 2 OPEN.

## 2026-09-09 - ADAPT write-boundary correction accepted in bounded scope

CAMPAIGN2_ADAPT_WRITE_BOUNDARY_REVIEW ACCEPTED. Internal capability-derived scope,
B-prefix ordering, exact resolved-target and actual-diff guards, staged publication,
and the already-governed failure codes are accepted. Target/diff guards and
NoStateChange effective-write exclusion PASS in submitted bounded evidence.
The redundant patch-byte guard removal and retained survived assay are accepted.
Whole ADAPT-B, AD-E4, AD-E8 and whole FCT remain OPEN. VAL remains QUALIFIED;
bounded PERSIST-A..H and deferred PERSIST-I are unchanged; PHEN-ADAPT PASS unchanged.
No model/allocation/frozen packet changes. Remaining scope/reachability and new
operation controls are in CAMPAIGN2_ADAPT_B_REACHABILITY_REVIEW.md; those later
controls are proposed evidence, not covered retroactively by this acceptance.

## 2026-09-09 - ADAPT B split-scope ruling approved

CAMPAIGN2_ADAPT_B_REACHABILITY_REVIEW APPROVED. Family-root interpreter component
PASS plus frozen two-authority profile exclusion PASS; alternate qualified subject
generic component PASS plus frozen one-character profile exclusion PASS. These are
not admitted richer factory executions. Qualification-only topology widening is
prohibited and no new production profile is required now.
Future family-root public witness becomes mandatory only when a separately accepted
profile permits an authority to own multiple writable families while a transition
permits a strict subset. Future alternate-subject public witness becomes mandatory
only when a separately accepted profile supports 2+ qualified characters and a valid
non-target subject. Both are CONDITIONAL / DEFERRED, not current B blockers.
Remove precedence, equal-value Set controls, bounded staged rule/path association
and rev3's four substitutions are ACCEPTED at their recorded scopes. Arbitrary
pre-snapshot resolver equivalence is not established by the staged-swap control.
Whole B, AD-E4, AD-E8 and FCT remain OPEN pending consolidation. VAL QUALIFIED,
bounded PERSIST-A..H PASS, deferred PERSIST-I and PHEN-ADAPT PASS are unchanged.

## 2026-09-09 - AD-E4 and AD-E8 accepted

CAMPAIGN2_AD_E4_E8_CONSOLIDATION_REVIEW ACCEPTED. AD-E4 PASS in bounded and accepted
split scopes; AD-E8 PASS in the finite operation/persistence matrix. Rev5's 25-test
baseline and five detected substitutions are accepted, including the independently
authored pre-snapshot RuleId/path oracle. Universal resolver equivalence is not claimed.
Future public family-scope and alternate-subject witnesses remain conditional only
on separately accepted profiles making their branches reachable; not current blockers.
Whole B, AD-E3/7/9/10/11/12/13, remaining composition and whole FCT remain OPEN.
VAL QUALIFIED, bounded PERSIST-A..H PASS, deferred PERSIST-I and PHEN-ADAPT PASS
are unchanged. No production/model/allocation change accompanies this acceptance.
Evidence precision: the same-model zero-count exposure test emits one dispatch plus
four regulatory evaluations (five outputs), all four evaluations NoStateChange.
The review's prose saying five evaluated rules does not change that execution record.

## 2026-09-09 - AD-E13 mixed-Gate clarification

AD-E13 consolidation accepted in direction; vector acceptance withheld solely on
literal Gate difference. Other submitted construction/runtime clauses and three
mutants accepted in their stated scopes. Inspection confirms the existing five gate
rows retain original Always and change only the duplicate to FrozenBaseline, with
identical Step, Match and target recipe. All five baseline rows PASS and all existing
proof source/test fingerprints still match. Packet wording clarified; no runtime,
test or proof artifact changed. AD-E13 awaits final disposition on this clarification;
whole B/FCT remain OPEN. See CAMPAIGN2_AD_E13_CONSOLIDATION_REVIEW.md.

## 2026-09-09 - AD-E13 accepted

CAMPAIGN2_AD_E13_CONSOLIDATION_REVIEW ACCEPTED. AD-E13 PASS in the submitted finite
construction/runtime matrix, including explicit Always-vs-FrozenBaseline Gate
invariance, differing Step, both Match kinds, all five keys, legal disjoint matches,
distinct recipes and contingent runtime collision. Three policy mutants DETECTED.
Mixed-Gate clarification accepted by unchanged proof fingerprints; no rerun required.
AD-E4/E8 remain PASS. Whole B, AD-E3/7/9/10/11/12 and FCT remain OPEN.
VAL QUALIFIED, bounded PERSIST-A..H PASS, deferred PERSIST-I and PHEN-ADAPT PASS
remain unchanged. No model/runtime/allocation changes accompany this acceptance.

## 2026-09-09 - AD-E3 accepted

CAMPAIGN2_AD_E3_CONSOLIDATION_REVIEW ACCEPTED. AD-E3 PASS in the submitted finite
and accepted split scopes: public Step, Gate variant, Match and membership/closure
commitments; generic V/L and isolated gate-source commitments with bounded public
profile exclusions; callback/name-table, unknown-tag/forbidden-field and orphan
rejection. Generic structural identities are not publicly admitted richer models.
Future public prepare/restore V/L/alternate-source witnesses are CONDITIONAL on a
separately accepted production profile supporting those domains, NOT current blockers.
No dedicated AD-E3 mutation assay is required. No profile widening is authorized.
AD-E3/4/8/13 PASS; whole B, AD-E7/9/10/11/12 and FCT OPEN. VAL QUALIFIED,
bounded PERSIST-A..H PASS, deferred PERSIST-I and PHEN-ADAPT PASS unchanged.
Campaign2 OPEN. No production/model/allocation/frozen artifact changes.

## 2026-09-09 - AD-E9 accepted

CAMPAIGN2_AD_E9_CONSOLIDATION_REVIEW ACCEPTED. AD-E9 PASS in the submitted finite
magnitude/domain matrix: unsigned underflow, tolerance/load endpoints and overflow,
zero normalization, absent zero-count no-op and unbounded sensitization/load/competence.
Three clamp/ceiling mutants DETECTED. Second-leaf confinement PASS by complete-state
assertions composed with accepted AD-E4/E8 evidence; no duplicate mutant required.
This is not universal arbitrary-bigint verification. AD-E10 reference semantics and
AD-E12 full rollback remain separate and OPEN. AD-E3/4/8/9/13 PASS; whole B,
AD-E7/10/11/12 and FCT OPEN. VAL QUALIFIED, bounded no-RNG PERSIST-A..H PASS,
deferred PERSIST-I and PHEN-ADAPT PASS unchanged. Campaign2 OPEN.

## 2026-09-09 - AD-E10 accepted

CAMPAIGN2_AD_E10_CONSOLIDATION_REVIEW ACCEPTED. AD-E10 PASS in finite public
endpoint/pre-repair/authored-reference and real component-mapping scopes. Unknown
variable translation is qualified with separate earlier public state/domain exclusion.
R0 remains authored model reference; D remains retained adaptation state; R0+D is
validated, never stored as a new REG anchor or learned baseline. Functional repair
before the time boundary does not rescue invalid retained state at the boundary.
Both distinctive mutants DETECTED; no additional AD-E10 mutant required.
AD-E3/4/8/9/10/13 PASS; AD-E7/11/12 and whole B/FCT OPEN. AD-E12 full rollback is
not inferred. VAL QUALIFIED, bounded no-RNG PERSIST-A..H PASS, deferred PERSIST-I,
PHEN-ADAPT PASS unchanged. Campaign2 OPEN.

## 2026-09-09 - AD-E7 read-evidence correction submitted

Inspection found missing enforcement for staged read evidence. Four initial negative
controls accepted omitted/reversed/shared/encoded-read substitutions unexpectedly.
The evaluator now validates each target/optional-gate instrumentation segment and
compares staged structured/encoded reads before completed-evidence publication.
Seven new controls PASS; both check-removal mutants DETECTED. See
CAMPAIGN2_AD_E7_READ_EVIDENCE_CORRECTION_REVIEW.md for bounded evidence and remaining
matrix. Correction acceptance is requested; AD-E7 is not qualified. Whole B/FCT OPEN.
Prior evaluator-sensitive reports remain historical pending explicit refresh.

## 2026-09-09 - AD-E7 read-evidence correction accepted

CAMPAIGN2_AD_E7_READ_EVIDENCE_CORRECTION_REVIEW ACCEPTED: per-rule instrumentation
and pre-publication structured/encoded snapshot guards, existing TRACE_VALIDATION_FAILURE,
and unchanged earlier WRT/diff/output precedence. Seven bounded controls PASS; two
mutants DETECTED; fresh instances are supporting evidence, not whole qualification.
Recorded reviewed tree: 97 files/694 tests PASS; targeted45/4 PASS; TypeScript PASS;
166 preservation fingerprints PASS. PRJ owns read values; ADAPT does not reread state
or create a second value oracle. Internal injections are not public capabilities.
Whole AD-E7/B/FCT remain OPEN. Remaining declaration, rebinding, actual sharing,
executor-binding, interleaving, cross-character/undeclared/enumeration controls need
explicit mapping. Evaluator-sensitive history requires refresh before new whole gates.

## 2026-09-09 - AD-E7 binding-isolation correction submitted

Crosswalk found a generic ContractReadProjection constructor alias: validated caller
bindings could later redirect direct or derived reads. Two initial isolation tests
failed. The constructor now validates and retains a private binding/path/accessor
snapshot, capturing the selected derive function without claiming closure purity.
Three isolation/interface tests PASS; both alias mutants DETECTED. Static/static and
dynamic/dynamic duplicate-accessor assertions supplement existing static/dynamic proof.
See CAMPAIGN2_AD_E7_BINDING_ISOLATION_REVIEW.md. Narrow substrate correction review
requested; whole AD-E7/B/FCT OPEN. Public Campaign2 exposes no new binding capability.

## 2026-09-09 - AD-E7 binding-isolation correction accepted

CAMPAIGN2_AD_E7_BINDING_ISOLATION_REVIEW ACCEPTED. Snapshot-before-validation and
retention of the same private binding graph closes direct/member/nested-path alias
rebinding in submitted scope. Exact-domain cross-character redirection and bounded
interface exposure are closed at generic component scope; declared wildcard domains
remain valid. Detached source mutation is not a rebind API. Selected derive function
capture does NOT qualify external captured-state purity or anonymous authoritative
PRJ semantics. Existing version identifiers retained; no new semantic option/allocation.
Static/static, dynamic/dynamic and static/dynamic accessor uniqueness are supporting
PASS evidence. Recorded tree:98 files/697 tests PASS, TypeScript PASS,166 fingerprints
PASS, three binding tests PASS and two alias mutants DETECTED. Whole AD-E7/B/FCT OPEN.

## 2026-09-09 - AD-E7 lifetime consolidation submitted

Actual same-object projection sharing rejects through existing instrumentation;
public binding/read/enumeration hooks reject without invocation. A targeted A-target/
B-execute/A-gate attempt exposed missing active-evaluation exclusion. The batch now
rejects nested execution and finish while active with ADAPTATION_STAGE_VIOLATION.
Eighty targeted tests/eight files PASS; TypeScript PASS. Read-evidence REV2 baseline10
PASS and four guard-removal mutants DETECTED; original report preserved. See
CAMPAIGN2_AD_E7_CONSOLIDATION_REVIEW.md for complete finite public/component crosswalk.
Lifecycle correction and whole-vector acceptance proposed; AD-E7/B/FCT remain OPEN
pending review. AD-E11/12 remain separate; historical source-sensitive assays are
not silently refreshed. No schema/profile/allocation changes.

## 2026-09-09 - Autonomous review authority and AD-E7 self-reviewed PASS

User authorized independent adversarial self-review through Campaign2 completion.
See CAMPAIGN2_AUTONOMOUS_ADVERSARIAL_REVIEW.md. AD-E7 PASS in finite public/component
scopes; lifecycle correction ACCEPTED by agent self-review, not an external verdict.
No accepted limitations are widened. Whole B/FCT and Campaign2 remain OPEN; full
campaign gate includes retained dice/identity and the entire thin causal path.

## 2026-09-09 - AD-E11 and AD-E12 self-reviewed PASS

Agent adversarial self-review under explicit user authorization records AD-E11 PASS
in finite route/dependency and generic/public scopes, and AD-E12 PASS in the frozen
finite failure-stage matrix. See CAMPAIGN2_AUTONOMOUS_ADVERSARIAL_REVIEW.md for exact
claims, original/procedural source correction, identity-carriage limitation, named
capability rejection, six rollback stages, restored continuation and detected mutants.
No external review is implied. Whole B/FCT and Campaign2 remain OPEN; explicit
AD-E1/2/5/6 composition and current-source refresh are still in progress.


## 2026-09-09 - Further autonomous ADAPT/REG review

Under the user's explicit independent-work authorization, agent self-review records
AD-E1/2/5/6 PASS for the exact count/applicability/frozen-gate/collision controls.
All AD-E1..13 now have explicit external or self-reviewed finite dispositions.
REG selected-key/query isolation was corrected and adversarially checked before
arithmetic. Current REG is QUALIFIED in the bounded no-body and named generic
component scopes of CAMPAIGN2_INHERITED_CURRENT_REVIEW.md. REG-C's future body-state
intervention remains conditional; no body model or public multi-variable profile
is adopted. Whole ADAPT/FCT and Campaign2 remain OPEN for their broader obligations.


## 2026-09-09 - Bounded factory and inherited composition qualified

Agent adversarial self-review under explicit user authorization accepts
CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md. FCT-1..6 and FCT-A..F are QUALIFIED
for the original bounded no-RNG profiles and recorded generic/public splits.
Current EVID/REG/ADAPT composition is QUALIFIED in the mapped finite scopes;
no future body/belief/value/DecisionExpression or RNG profile is admitted by this
receipt. Prior external VAL, PERSIST-A..H, PHEN-ADAPT and successor-profile verdicts
remain unchanged. PERSIST-I stays DEFERRED / NOT PASSED.

Final fresh-source regression:102 files/721 tests PASS; TypeScript, application
build, reference boundary and166 preservation fingerprints PASS. The current
evidence inventory verifies18 report fingerprints and records71 production files.
This is a reviewed implementation receipt, not a new canonical identity or model.
Campaign2 remains OPEN for the full thin topology and retained dice/identity port.
See CAMPAIGN2_REMAINING_TOPOLOGY_WORKPLAN.md; ORD-001 is the next specification
frontier, with no belief implementation authorized until its own contracts exist.

## 2026-09-09 — prediction frontier, autonomous shape/allocation review

Agent self-review accepts the bounded consequence measurement-prediction target,
with current corrected semantics measurement-prediction/0.2-candidate. Authority:
docs/formal/MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md, composing the prior
target/draft/symbolic closure in its stated scope. This is not an external verdict.

Initial permanent allocation assigns359..369 and readout occurrence namespace1127.
The subsequent self-review caught275 incorrectly named as an occurrence rule:
275 is a producer requirement,278 is the shared identity rule. Correct-forward
allocation freezes367/schema2 (field2 retired and forced absent) and368/schema2,
preserving all earlier bytes, numbers and fields as history. The shared279/3 map
is the sole readout occurrence-rule authority. No prediction runtime/model used
the earlier schemas; they are excluded from future profile admission.

See MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json and
MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_TABLE.json under docs/formal.
Complete Rules/Registry/Numeric/Trace/Persistence packaging still gates canonical
implementation. PRED-A..P are FROZEN / NOT PASSED. Exact-mean algebra exploration
is not runtime proof. Reference controls passed43 files/328 tests via the direct
Vitest equivalent after npm config loading hit a parent-directory access error.

The first prediction consumes existing authentic342 at140 and is read in a later
instant. It requires no new current-lane producer and does not close ORD-001.
Unknown absence differs from learned zero; no confidence, REG access, value or
action-causal meaning is inferred. Later readout has no LearningRouteId.
Campaign2 and its full motives/reasons/dice/identity/intent/attempt path remain OPEN.

## 2026-09-09 — measurement prediction first-profile qualification

Agent self-review accepts the bounded implementation of measurement-prediction/0.2-candidate
under rules/campaign2-measurement-prediction/0.1-candidate, model digest
f272823f9c3aca5894e7366d646cdfcad050b4062db084219860403324008278.
See docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_QUALIFICATION.md for the PRED-A..P
public/component crosswalk and exclusions. This supersedes the prior implementation
NOT PASSED disposition only in those scopes. It is not an external review verdict.
The frozen model/allocation bytes remain unchanged; the current source inventory is
CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY_REV2.json. Existing ADAPT/EVID/REG/VAL and bounded
persistence qualifications are preserved and their five affected proof packets refreshed.
ORD-001 and PERSIST-I remain open/deferred; Campaign2 and the remaining full causal
path remain OPEN. No current belief timing, appraisal, reward, value or action-efficacy
meaning is inferred from the predictor.

## 2026-09-09 — task lifecycle symbolic shape and allocation

Internal agent SHAPE ACCEPT: task-commitment/0.1-candidate. Separate numeric ACCEPT
AND FREEZE: task-commitment-allocation/0.1-candidate, records370..376/1 and14new
members in existing families. See CAMPAIGN2_TASK_LIFECYCLE_SHAPE_REVIEW.md and
../formal/TASK_COMMITMENT_ALLOCATION_FREEZE_AUDIT.json. The separate audit checked
34fields, scalar/collection/map-key role ownership, closed status variants, complete
displayed Markdown/machine parity and190 unchanged source fingerprints.

TC-A..L are FROZEN NOT PASSED. No task model/runtime activation or new cognitive
consumer is qualified. CAMPAIGN2_TASK_LIFECYCLE_PACKAGING.md is the next construction
gate. Existing prediction and earlier qualifications remain unchanged; Campaign2 OPEN.

## 2026-09-09 — corrected task key-role closure and construction evidence

The0.1 task audit's role-ownership PASS for StateMapKey373/1 and373/2 is withdrawn.
Actual upstream authority requires RecordField roles for composite key371. The
correct-forward0.2 contract/allocation retains all numeric record/field/member/union
assignments and removes the two invalid declarations. See
../formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md and the separate correction audit.
No old artifact is overwritten and no upstream PRJ/VAL/WRT meaning changes.

Seventeen construction tests PASS, including real state key checks and the two
invalid-position negatives.192 corrected source combinations materialize successfully
in campaign2-task-commitment-review-rev2/. These are not TC runtime PASS or task model
activation. All task runtime and full Campaign2 gates remain open.

## 2026-09-09 — task lifecycle runtime qualified in the frozen profile

Internal agent adversarial review under autonomous-work authorization: see
CAMPAIGN2_TASK_LIFECYCLE_QUALIFICATION.md in docs/planning. The effective seam is
task-commitment/0.2-candidate; frozen model digest
74aa96b751fb92dfaf693e6249ecc0abfe35df3493dd13919ddb254e4ee3d45e.
TC-A..L pass in the packet's explicit lifecycle/public/component comparison scopes.
This supersedes the preceding task runtime NOT PASSED entries, without changing any
frozen semantic, numeric or model artifact. No external review is implied.

Evidence: 109 active files/974 tests baseline; 24 focused post-correction tests;
9 preservation tests; 7 detected task substitutions; 43 reference files/328 tests.
The 64 runtime control combinations are included in the baseline. Construction and
frozen model checks remain17 and68 respectively. TASK_LIFECYCLE_RUNTIME_AUDIT_REV2
preserves212 fingerprints. The18 inherited proof packets and five prediction
substitutions are current after new receipt revisions; prior receipts remain history.

The historical live-list comparison is external research instrumentation. Canonical
workspace, appraisal, concern, motive/plan/option generation and the retained
reason/dice/identity pipeline are still unfinished and may not be replaced by task
status or trace. ORD-001 OPEN; PERSIST-I DEFERRED; Campaign2 OPEN. Continue the exact
cognitive source/operand closure independently; no user decision is currently needed.

### Cognitive continuation — internal drafts, no allocation or PASS

Current index: CAMPAIGN2_COGNITIVE_SOURCE_SELF_REVIEW_2,
CAMPAIGN2_COGNITIVE_REGISTRATION_JOIN_DRAFT,
CAMPAIGN2_COGNITIVE_OUTPUT_SHAPES_DRAFT and
CAMPAIGN2_COGNITIVE_TRAVERSABILITY_REVIEW in docs/planning. Symbolic inventoryrev2
currently lists59 record proposals/184 ordered fields; role, registration and packaging
closure remain unfinished. This count is not a numeric allocation or completeness gate.

The Phase2.97 direct-strength commitment standing source is the required initial port;
older alignment-scaled feedback remains a named comparison. Historical researchrev2
finds32/32 sampled hypothetical later mode changes from initially empty identity.
The seven-check RNG rollback exploration is substrate composition evidence only.
Neither result qualifies generated cognition, DEC-001, TRC-004, PERSIST-I or Campaign2.
All prior task/prediction/ADAPT/VAL/model/allocation verdicts remain unchanged.

### Cognitive whole shape and separate numeric closure — internal acceptance

Under the user's explicit autonomous-work instruction, task-cognitive-path/0.1-candidate
is internally shape accepted through docs/formal/TASK_COGNITIVE_PATH.md and its exact
TASK_COGNITIVE_SHAPE_MANIFEST.json. CAMPAIGN2_COGNITIVE_WHOLE_SHAPE_REVIEW records the
adversarial findings and bounded historical/public/component scopes. No external
planning-agent approval is claimed.

Separate task-cognitive-allocation/0.1-candidate is PERMANENT AND FROZEN: records377..452,
244 new fields,373/schema2's appended instruction field2, discriminator namespaces1040..1043,
occurrence namespaces1128..1141,103 exact members,52 scalar roles and17 union branches.
TASK_COGNITIVE_ALLOCATION_FREEZE_AUDIT preserves18 prior authority/allocation sources.
The old373/schema1 and all earlier numeric commitments remain unchanged.

Current symbolic inventoryrev5 and field grammarrev2 supersede the earlier59/184 and
77/247 draft counts. CoverageContribution was removed as an unneeded canonical wrapper.
TRC-004 has bounded formal shape through reason-evidence-coverage/0.1-candidate; its
runtime/component qualification remains OPEN. General DEC-001 and ORD-001 remain OPEN
with the bounded exclusions documented. ContextModulating is retained as a future
source/role obligation, not silently merged or retired.

Model materialization/freeze and the generated cognitive implementation are next.
All new runtime vectors remain FROZEN, NOT PASSED. PERSIST-I remains unpassed;
Campaign2 remains OPEN. Existing qualified predecessor results are unchanged.

## Cognitive model and implementation pause receipt — 2026-09-09

The cognitive model/profile is now frozen under task-cognitive-model-profile/0.1-candidate;
see campaign2-task-cognitive-model/FREEZE.json. The separate correct-forward
plan-leaf allocation permanently adds leaf/task-instruction in namespace 1032.
Structural codecs and pure cognitive mathematics are implemented: 23 focused tests
PASS; actual historical differential controls PASS (270 dice cases, 11 identity
histories); final TypeScript compilation PASS. These are bounded component results,
not public runtime qualification. Shared-source fingerprint receipts require refresh
where affected; historical receipts remain preserved. Campaign 2 and PERSIST-I remain
OPEN. Work is paused for the user's power cycle. See
CAMPAIGN2_AUTONOMOUS_PAUSE_CHECKPOINT.md for exact artifacts, limits and resume sequence.

## Campaign 2 completion — 2026-09-09

Campaign 2 is COMPLETE in the bounded thin-scaffold scope of
[CAMPAIGN2_COMPLETION_REVIEW.md](CAMPAIGN2_COMPLETION_REVIEW.md).
This internal adversarial verdict is made under the user's explicit autonomous-work
authorization. It supersedes the earlier OPEN/power-cycle/implementation-pending
checkpoint dispositions, without rewriting any frozen shape, allocation or model file.

`task-cognitive-path/0.1-candidate` is QUALIFIED. TW/TP/RI/IH/TRC4/CS controls pass
within the documented public/component/exclusion split; see
[CAMPAIGN2_COGNITIVE_QUALIFICATION.md](CAMPAIGN2_COGNITIVE_QUALIFICATION.md).
PERSIST-I now PASS only for `campaign2-task-cognitive-persistence/0.1-candidate`,
complete-prefix reconstruction with actual RNG and no external coupling maps; see
[CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md](CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md).
Earlier no-RNG qualifications, whole current VAL and bounded ADAPT remain unchanged.

The exact 21-model cohort executes;17 source substitutions are detected; historical
math and18 predecessor assays pass. Public64/65 and27/26 boundaries execute. Current
receipt/source and frozen-artifact consistency:24 receipts,446 fingerprints PASS.
No external planning-agent approval or general psychological/reduction verdict is claimed.

PHEN-ADAPT-001/1.11.0 and corpus/0.27.0 remain unchanged at digest
`3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`.
General DEC-001, ORD-001/002/005, future ContextModulating and the remaining expanded
phenomenon/research obligations stay open. Campaign 3 is next; it has not passed.

Final consolidated validation: COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json records
118 active files /1,063 tests PASS and43 preserved-reference files /328 tests PASS,
with source/test fingerprints unchanged during both runs. TypeScript, reference
boundary and final whitespace checks PASS. This supersedes earlier test counts;
Campaign2 completion and its bounded research exclusions remain as recorded above.

## VER-C3-PRE-IDENTITY-001 — Earned identity versus history without feedback

- Date:2026-09-10; internal empirical review under the user's pre-entry-review request.
- Candidate/contracts: MEC-018 raw earned standing participation in reason activation;
  task-reason-source/0.1-candidate, reason-dice/0.1-candidate,
  task-identity-evidence/0.1-candidate, frozen cognitive model profile.
- Compared models: exact baseline and standing-access-off ModelIdentity values in
  CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json. Both were already in the21-member
  frozen cohort. Registry normalization proves only RawSignalDefinition StandingEnabled
  differs; content and numeric parameters are byte-equal. No code mutation or new ID.
- Declared domain: one holder, two adopted tasks, fixed probe1/cognition2/3/4/probe5/
  cognition6 sequence, empty learned S0, D=-50, four seeds with final byte0..3.
- Corpus/coverage: corpus/0.27.0 and PHEN-BIO-001/1.0.0-draft feedback-ablation subcase,
  not whole phenomenon qualification. Governing digest remains unchanged.
- Comparison: first three complete decisions and all state/history through time5
  equal. At time6 compare exact option probabilities, mode and chosen action.
  The previously retained three contributions remain byte-identical after the probe.
- Randomness: every shared natural address has an identical complete draw record
  (six per pair). After the mode changes, draw sets legitimately differ; no claim
  of coupling unshared addresses or the whole PHEN-BIO third-seed design.
- Observed difference: enabled feedback gives probabilities(1/2,1/2), PlayerFacingRoll;
  history-without-feedback gives(0,1), Auto, in all four pairs. Chosen action differs
  for three seeds. Early history is preserved; later newly formed history may differ.
- Mathematical finding: baseline integer standing modifier stays0. The effect travels
  through standing's contribution to reason relevance/activation, rescuing a weak
  nonzero base. This falsifies the suspected “zero integer modifier means no effect”.
- Semantic finding: retaining history without allowing it into future reasons is
  not behaviorally equivalent in this matched domain. No authored identity, hidden
  state change, independent identity die or zero-base resurrection was introduced.
- Verdict: RETAINED as a bounded reference distinction against this actual ablation.
  General MEC-018 necessity and whole PHEN-BIO remain UNRESOLVED, not automatically PASS.
- Known uncovered regions: third-seed probes, external coupling maps, more motive
  families, long-run contradiction/coercion/cost, broad human plausibility and scaling.
  standing-integer pure compiler comparisons are separate component evidence only.
- Reopen conditions: an alternative reproduces the same matched-state distribution
  effects without this distinction; calibration/activation law changes; added sources
  expose duplicated evidence; broader biography controls fail.
- Artifacts: CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json,
  CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json and CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md.
  Revision1 was exploratory full-run comparison; revision2 adds the owning matched
  prefix checks. Final-history inequality is an effect, not loss of pre-probe history.

---

## `VER-C3-CONCERN-001` — Concern → attention modulation shape is load-bearing

- **Date:** 2026-09-14. Discharges obligation 1 of `OD-C3-001` (RATIFIED WITH SCOPE
  AMENDMENT, same date): a shape-different comparator must exist before General Attention
  treats the concern modulation law as settled.
- **Candidate/contracts:** `prior-concern-feedback-component/0.1-candidate` (Candidate A,
  `src/campaign3/priorConcernFeedback.ts`) **unmodified**; `encoding-access-math/0.1-candidate`
  and `spatial-context-allocation/0.1-candidate` consumed unchanged. No identity, canonical
  record, allocation, record type, public ingress or state writer was created.
- **Compared models:**
  - **Candidate A (linear, accepted first named candidate):**
    `residualPool = residual × (1 − q)`, `ω_A = 1 + q`.
  - **Candidate B (saturating), selected locally** under the escalation policy:
    `f(q) = q/(1+q)` — the architecture's own accepted bounded response from EAM-1 —
    giving `residualPool = residual × (1 − f(q)) = residual/(1+q)` and `ω_A = 1 + f(q)`.
    B is A with `q` replaced by that existing response: no new mathematics, no free
    parameter, no new psychological state, same `q ∈ [0,1]`, same source and cross-instant
    join, same eligibility and `K`. The difference is functional form, not calibration —
    a recalibrated `1 + q/2` would not have satisfied the ruling.
- **Declared domain:** residual pool `1/5`; `q ∈ {0, 1/4, 1/2, 2/3, 3/4, 1}`; neutral point
  declared at `q = 0`. Both consumers of the feedback are measured:
  `residualPool` → peripheral allocation via `allocateSpatialContext` (focal weight 1, one
  focal and two peripheral detections); `ω_A` → the associative-pull weight in
  `rankAccessibleEpisodes` (`RetrievalScore = ω_B·Base + ω_A·pull`, `ω_B` 1, `λ` 1,
  exponent 1, `K` 1, now 10) over `x-recent` (base `1/2`, pull `1/10`) and
  `y-associated` (base `1/4`, pull `1/4`).
- **Corpus/coverage:** `corpus/0.28.0`, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`. Bears on
  `PHEN-ATTN-001`; promotes nothing and passes nothing.

### Observed differences

| `q` | A pool | A `ω_A` | A top | B pool | B `ω_A` | B top |
|---|---|---|---|---|---|---|
| 0 | 1/5 | 1 | x-recent | 1/5 | 1 | x-recent |
| 1/4 | 3/20 | 5/4 | x-recent | 4/25 | 6/5 | x-recent |
| 1/2 | 1/10 | 3/2 | x-recent | 2/15 | 4/3 | x-recent |
| 2/3 | 1/15 | **5/3** | x-recent *(exact tie)* | 3/25 | 7/5 | x-recent |
| 3/4 | 1/20 | 7/4 | **y-associated** | 4/35 | 10/7 | x-recent |
| 1 | **0/1** | **2/1** | **y-associated** | 1/10 | 3/2 | x-recent |

- **Mathematical findings.** The shapes are identical at the declared neutral point and
  diverge throughout `(0,1]`, satisfying the comparator constraints. The exact retrieval
  crossover is `ω_A* = 5/3`. Candidate A attains it precisely at `q = 2/3`, where the two
  episode scores are **exactly equal** and the canonical key tie-break preserves the
  recency winner — so the observed flip is at the next sampled `q`. Candidate B tops out
  at `ω_A = 3/2` and **cannot reach the crossover at any `q`**; that is a property of the
  shape, not of the sampling. At the endpoint A extinguishes the peripheral pool (`0/1`)
  and doubles associative pull; B halves the pool (`1/10`) and neither endpoint is
  attained.
- **Semantic findings.** The two candidates encode different psychological claims, and the
  difference is **behaviourally visible rather than numeric**: under A, sufficient concern
  reverses the retrieval ranking so an older associated episode outranks a more recent
  unassociated one; under B it never does, at any `q`, from the same input, source,
  eligibility and `K`. Stated plainly, A claims maximal concern abolishes peripheral
  encoding and doubles associative pull; B claims peripheral attention is suppressed but
  never extinguished and associative pull saturates. **Neither claim is currently earned.**
  The retrieval consumer is where the law bites hardest, because `ω_A` is precisely the
  weight deciding whether associatively-linked material can overtake recency.
- **Verdict:** the **modulation shape is RETAINED as a load-bearing distinction** — it is
  not a calibration detail, and two admissible shapes produce different selected episodes
  on the same fixture. Candidate A versus Candidate B is **UNRESOLVED**: nothing here
  discriminates which shape is correct, and neither may be treated as the law. The
  `OD-C3-001` obligation-1 comparator now exists, so General Attention may proceed on the
  narrowed blocker — it may qualify the **existence** of the concern → allocation feedback
  seam on a proven public source, join and path, while any broader verdict that **relies on
  the specific modulation law** must cite this comparison and remains unsettled.
- **Known uncovered regions:** which shape is psychologically correct — that needs an
  accepted downstream observable, BLOCKED on the encoding-strength and retrieval-probe
  seams. One residual value, one detection geometry, one two-episode retrieval fixture; the
  flip location is specific to this fixture and is not a general threshold. Thresholded and
  gated shapes remain uncompared. Candidate B is a comparator, not a proposal to replace
  Candidate A; promoting either to a registered component with an allocation is separate
  work.
- **Preserved dispositions:** `MEC-005` remains `CONTROL+CONTRACT`; `MEC-007`/`CTL-004`
  remain `CONTROL`; `MEC-010` remains `CONTROL+CORPUS`. The three feedback branches
  `EnabledKnown`, `BaselineWithoutAvailableFeedback` and `DisabledFeedback` remain
  distinct and are not collapsed into `q = 0`, per `OD-C3-001` obligation 2.
  `TaskConcern` is **not** qualified as the general Affect representation; the ratified
  precedent remains a transient character-state → attention seam.
  `PHEN-ATTN-001` receives no PASS from this comparison.
- **Reopen conditions:** a downstream observable discriminates the shapes; a thresholded or
  gated candidate is compared; the residual-pool mechanism or `RetrievalScore` weighting
  changes; a factorized affect source replaces scalar `q`; or a richer retrieval fixture
  moves the crossover such that B can reach it.
- **Artifacts:** `docs/planning/CONCERN_MODULATION_COMPARISON_REV1.json`,
  `scripts/compare-concern-modulation-laws.mjs`. Five assertion groups guard the claims;
  one was corrected during execution after it asserted a flip at `q = 2/3` that is in fact
  an exact tie resolved by canonical key order, and the boundary is now recorded rather
  than smoothed.

---

## `VER-C3-CONCERN-002` — Decoupled encoding and retrieval modulation satisfies the design constraints

- **Date:** 2026-09-14. Discharges `OD-C3-002` (owner design ruling, same date): develop
  the next serious candidate locally under the stated qualitative constraints and compare
  it against A and B.
- **Candidate/contracts:** `encoding-access-math/0.1-candidate` and
  `spatial-context-allocation/0.1-candidate` consumed unchanged.
  `prior-concern-feedback-component/0.1-candidate` (Candidate A) **unmodified**. No
  identity, canonical record, allocation, record type, public ingress or state writer.
- **Compared models**, all with `f(x) = x/(1+x)`, the architecture's own accepted EAM-1
  bounded response, and `residualPool = residual × E(q)`, `ω_A = 1 + R(q)`:
  - **A (linear):** `E = 1 − q`, `R = q`
  - **B (saturating, shared curve):** `E = 1 − f(q)`, `R = f(q)`
  - **C (decoupled), developed locally:** `E = 1 − f(q)`, `R = f(3q)`
  C takes B's encoding arm unchanged and gives the retrieval arm an independent gain.
  **B is exactly C at gain 1; A is the linear limit.** The three are one family, not
  three unrelated proposals. C introduces no new mathematics, no new psychological state
  and no new causal mechanism, so it did not require re-escalation.
- **Declared domain:** residual `1/5`; `q ∈ {0, 1/4, 1/2, 2/3, 3/4, 1}`; gain sweep
  `{1, 2, 3, 4, 6}`; consumers identical to `VER-C3-CONCERN-001` —
  `allocateSpatialContext` for the encoding arm, `rankAccessibleEpisodes` for the
  retrieval arm, crossover `ω_A* = 5/3` as established there.
- **Corpus/coverage:** `corpus/0.28.0`, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`. Bears on
  `PHEN-ATTN-001`; promotes nothing and passes nothing.

### Constraint satisfaction

| | A | B | C |
|---|---|---|---|
| C1 `E(0)=1` | ✓ | ✓ | ✓ |
| C2 `E` decreasing | ✓ | ✓ | ✓ |
| **C3 `E(1)>0`** | **✗** `E(1)=0` | ✓ `1/2` | ✓ `1/2` |
| C4 `R(0)=0` | ✓ | ✓ | ✓ |
| C5 `R` increasing | ✓ | ✓ | ✓ |
| **C6 `ω_A` reaches `5/3`** | ✓ `2/1` | **✗** max `3/2` | ✓ `7/4` |
| C7 both bounded | ✓ | ✓ | ✓ |
| **satisfies all** | **no** | **no** | **yes** |

- **Mathematical findings.** A and B each fail a *different* constraint, which is why
  neither is the law and why the failure is structural rather than a matter of tuning.
  The constraints turn out to be **jointly satisfiable without a new mechanism** — not
  obvious in advance, since requiring both non-annihilating encoding and
  crossover-capable retrieval could have demanded new state. Decoupling suffices.
  Across the gain sweep `{1,2,3,4,6}` the encoding arm is **bit-identical**
  (`E(1) = 1/2` throughout) while the reordering threshold moves: gain 1 (= Candidate B)
  never reorders, gain 2 never reorders, gain 3 reorders at `q = 3/4`, gain 4 at `q = 2/3`,
  gain 6 at `q = 1/2`. The gain is therefore an interpretable quantity — the concern level
  at which concern-congruent recall can overtake recency — and it is independent of how
  hard concern narrows encoding.
- **Semantic findings.** The decisive comparative: **A and C reorder retrieval at the same
  `q = 3/4`, but A has only `1/4` of the peripheral pool left at that point while C retains
  `4/7`** — roughly 2.3× as much. The behaviour the North Star asks for, an older
  associated memory coming to mind ahead of a newer unrelated one under sufficient
  concern, is obtainable **without** A's claim that maximal concern abolishes incidental
  encoding. The two effects were conflated by construction in both earlier candidates; once
  separated, the desired behaviour and the unwanted extreme come apart cleanly.
- **Verdict:** **`MERGED` is REFUTED for the two arms** — encoding suppression and
  retrieval amplification must not be assumed to share one transfer function, on the
  strength of a valid witness: the same reordering behaviour is reachable at materially
  different encoding cost depending only on whether the arms are coupled. Candidate C is
  **UNRESOLVED as a law** but is the only one of the three that satisfies the accepted
  design constraints; A and B remain **retained comparators**, each with a named failing
  constraint. No candidate is accepted as the modulation law.
- **Known uncovered regions:** which curve family is psychologically correct still needs
  an accepted downstream observable, BLOCKED on the encoding-strength and retrieval-probe
  seams. Gain 3 is a first declared constant, not a calibration result. The crossover
  `5/3` is a property of this two-episode fixture; a richer fixture moves it and could
  change which gains satisfy C6. Thresholded and gated shapes remain uncompared. Nothing
  here tests interaction with the encoding-strength law compared in
  `VER-C3-SALIENCE-001`.
- **Preserved dispositions:** A and B retained as comparators per `OD-C3-002`, not
  retired. `MEC-005` `CONTROL+CONTRACT`; `MEC-007`/`CTL-004` `CONTROL`; `MEC-010`
  `CONTROL+CORPUS`. The three feedback branches remain distinct and are not collapsed
  into `q = 0`. `TaskConcern` remains un-qualified as the general Affect representation —
  and a later affect model that modulates the two arms differently is an argument for
  keeping them separate, not for freezing this family. `PHEN-ATTN-001` receives no PASS.
- **Reopen conditions:** a downstream observable discriminates the curve families; a
  thresholded or gated candidate is compared; a factorized affect source replaces scalar
  `q`; the `RetrievalScore` weighting or residual-pool mechanism changes; or a richer
  retrieval fixture relocates the crossover.
- **Artifacts:** `docs/planning/CONCERN_MODULATION_CANDIDATE_C_REV1.json`,
  `scripts/compare-concern-modulation-candidate-c.mjs`. Nine assertions guard the claims,
  including that A fails exactly C3, B fails exactly C6, C satisfies all seven, the two
  reordering points coincide at `q = 3/4`, and the encoding arm is invariant across the
  entire gain sweep.

### `VER-C3-CONCERN-002` — scope annotation, 2026-09-14

Added the same day by a robustness probe of its own constraint C6
(`CONCERN_RETRIEVAL_CEILING_REV1.json`, `scripts/probe-concern-retrieval-ceiling.mjs`).
The verdict above is **unchanged and not reopened**; this bounds its scope.

C6 was evaluated against a single fixture whose retrieval crossover was `5/3`. Sweeping
fixture difficulty shows that crossover is a property of the **fixture**, not of the law:

| crossover `ω*` | A | B (= C g1) | C g3 | C g10 | C g100 |
|---|---|---|---|---|---|
| 6/5 | q=1/4 | q=1/2 | q=1/4 | q=1/4 | q=1/4 |
| 3/2 | q=2/3 | never | q=1/2 | q=1/4 | q=1/4 |
| **5/3** | **q=3/4** | **never** | **q=3/4** | q=1/4 | q=1/4 |
| 2/1 | never | never | never | never | never |
| 5/2 | never | never | never | never | never |
| 3/1 | never | never | never | never | never |

Three consequences.

**The family has a hard structural ceiling of `ω_A = 2.`** `R(q) = f(g·q)` is bounded above
by 1 for every gain, so `ω_A = 1 + R ≤ 2` across all candidates. Measured ceilings at
`q = 1`: A `2/1`, B `3/2`, C g3 `7/4`, C g10 `21/11`, C g100 `201/101`. **Raising the gain
to 100 does not rescue a crossover at or above 2** — the limit is the bounded response
itself, not the calibration.

**Candidate A is the unique member that attains the ceiling, and pays `E(1) = 0` to do it.**
Within this family maximum retrieval amplification and non-annihilating encoding are in
direct tension *at the boundary*. The decoupling in `VER-C3-CONCERN-002` buys a strictly
interior region; it does not escape the trade.

**C6 as written is not well-formed.** "`ω_A` can pass the demonstrated crossover" presumes
one crossover. The usable form is "`ω_A` can pass the crossover **of a declared corpus
fixture**". The original `5/3` fixture sits inside the discriminating band, so
`VER-C3-CONCERN-002` is not vacuous — B genuinely cannot reorder it and A and C genuinely
can — but the result holds **for fixtures in that band and only there**.

**Named future obligation.** If a required phenomenon ever needs reordering against a
recency advantage whose crossover is at or above 2, no member of this family can supply
it, and the bound on `R` — which `OD-C3-002` C7 requires to be bounded but does not fix —
is what must be revisited. A family with `R ≤ 2` (`ω_A ≤ 3`) is a different family and a
legitimate future comparator. Nothing is blocked today; this is recorded so it surfaces
when a phenomenon demands it rather than being rediscovered then.

Also confirmed: the effect is **not an artifact of top-1 selection.** Over four episodes at
`K = 2` the selected *set* changes with `q`, so concern reorders membership rather than
only the winner.

## `VER-C3-GA-001` — Bounded public General Attention and memory comparisons

- **Date:** 2026-09-20.
- **Candidate distinction/contracts:** permission, capacity-limited selection,
  role/spatial allocation, encoding strength, retained evidence, learned association,
  presentation accessibility, transient earlier concern, use and significance remain
  distinct. Implements `general-attention-carrier/0.1-candidate`,
  `general-attention-registration-write-scope/0.1-candidate`, the exact component
  versions in706, `general-attention-trace-binding/0.1-candidate` and
  `general-attention-complete-prefix/0.1-candidate`. New role/disabled controls have
  their separately named0.1-candidate versions; old spatial laws are unchanged.
- **Exact models/runs:**43 distinct frozen images in
  `campaign3-general-attention-model-rev2/FREEZE.json`. The public comparison receipt
  lists each full ModelIdentity/RunIdentity and36 canonical ComparisonCases. All35
  predecessor models and247 image files are byte-preserved. No new record allocation.
- **Declared domain:** `fixture/general-attention/1.0.0`, one observer/qualified
  holder, the fixed permitted visual/body/panel source, explicit positive roles,
  four formation/four later cue opportunities, independent current/consequence
  lanes, actual inherited probe/prediction/concern, and the separate four-trial
  retained-credit calendar. Whole-model limits92 invocations/239 outputs/228 fresh
  slots; observed maximum21 invocations. No authored learned memory or graph.
- **Corpus and coverage:** actual execution declares **corpus/0.28.0**, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
  Intentional successor **corpus/0.29.0**, digest
  `5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d`,
  advances PHEN-ATTN-001 to1.1.0 and preserves all twenty other members. The promotion
  receipt preserves the old execution identity and names the successor aggregate
  identity without inventing new runs. PHEN-ATTN's declared bounded source-footprint
  and later-probe obligations now have public witnesses. PHEN-MEM recency, selected-only
  reinforcement, decay, top-K and canonical ties have bounded evidence. DET/EPI
  preservation is qualified in its existing scope; other members are not whole PASS.
- **Coupling:** deterministic common seed, no random draws. Align focal evidence by
  observed Actor role and controlled geometry/time, and episodes by acquired time.
  Opaque occurrence IDs are never psychological magnitudes. The exact comparison
  specification is committed in each ComparisonCase.
- **Discriminating witnesses:** sparse→dense focal strengths are Independent
  `3/13→3/13`, Shared `1→50/53`, Hybrid `3/13→3/13`, RetiredFlat `1→1`.
  Dense symmetric graph edge masses at scale100 are respectively `0,20,92,100`;
  all sparse graphs are empty. First-cue newest-episode scores are respectively
  `3/2→1`, `3/2→211/200`, `3/2→57/40`, `3/2→3/2`. Winner membership agrees,
  so these are strength/association/score distinctions, not winner discrimination.
  The independent law protects focal encoding here but not the later average across
  retained episode contents. The earlier salience-law verdict remains in force.
- **Counterfactuals:** K0 and K2 first scores agree; later retrieval raises the
  selected episode's base from its unretrieved `1/3` to `5/6`, while the unselected
  episode receives no reinforcement. Initial base was `1/2`, exposing decay.
  No-decay gives an exact `83/60` tie with canonical selection. Encoding-only concern
  changes peripheral encoding and graph; retrieval-only preserves both and changes
  scores. Known-zero, unavailable, no-task and disabled branches remain distinct.
  Denied and unresolved-role sources cannot supply the focal Actor. Source/owner/
  accessor negatives and preserved hidden-truth controls retain their public versus
  component classification; internal fault hooks are not public input.
- **Retained-credit comparison:** actual attribution consumes16 experiences and
  targets one endpoint child. Age-only retains14 used children plus two fresh
  acquisitions; use-only/shared-protection/significance-first retain16 used children
  and reject the fresh pressure. All retain one significant child. The three
  protection candidates have identical final memory bytes; significance-first is
  not shown necessary over the simpler controls on this fixture. Perceived trial
  context and attribution do not establish objective causality.
- **Verdict:** **UNRESOLVED** for psychological law choice and reduction necessity;
  **bounded public qualification PASS**, closing the planned GA implementation work
  item. Preserve the tested distinctions and competing models. Do not merge from
  winner equality, select a universal budget law, or rehabilitate RET-001.
  Candidate A witnesses the ratified transient character-state feedback edge only;
  A/B/C remain unresolved under VER-C3-CONCERN-001/002.
- **Known uncovered regions:** general Affect, Need, surprise, arbitrary modality/
  glyph/position/role inference, Incidental/Cause derivation, unguided segmentation,
  unrestricted retention horizons, whole frightened/angry-person behavior and the
  remaining broader Campaign3 corpus obligations. Priority/equal K2 and the three
  protection models are not discriminated here. Two current baseline templates are
  replacement-only, with compiler/component rather than active-stage execution proof.
- **Reopen conditions:** a required phenomenon outside this source/horizon, a
  competitor surviving the full enlarged corpus, changed contracts/numeric laws,
  failure of identity/epistemic/owner/replay preservation, or the existing concern
  response-bound condition. Broader uncertainty is not a current owner blocker.
- **Evidence:** `GA_PUBLIC_QUALIFICATION_REV1.json`,
  `GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md`, `CORPUS_0_29_0_PROMOTION_REV1.json`,
  `general-attention-public-comparisons-rev1/RESULTS.json`,
  `general-attention-public-replay-rev1/RESULTS.json`.43 public runs/36 comparisons;
  ten exact reexecutions; public complete-prefix restores across ten continuation
  instants;77 active-stage rollback witnesses plus six final-commit faults.
  **2,171 active tests/273 files,328 historical tests/43 files and production build
  PASS.** Mutation sensitivity and regression preservation are not necessity proofs.

**LOCAL DISPOSITION — no owner ruling required:** finish the accepted bounded GA
scope, preserve all comparator and epistemic distinctions, and record the honest
uncovered frontier. The North Star transfer is experimentally traversable attention,
encoding and history-dependent accessibility within the §30 frightened/angry-person
archetypes; it is not a general emotional-state model. Counters **706 / 0**.

## Ledger correction — three previously reported entries were absent, 2026-09-20

The September 14 work-order/CURRENT checkpoint reported VER-C3-SALIENCE-001,
VER-C3-EMB-001 and VER-C3-ATTN-001 as recorded, and counted twelve entries. Inspection
of the actual ledger and its handoff commit found those three entries absent. The
underlying experiment/qualification receipts exist. The entries below are recorded
now from those receipts, without backdating a ledger write or claiming a new run.
This repairs the count to thirteen including VER-C3-GA-001. It changes no frozen
model, allocation, old receipt or previously declared experimental scope.

## `VER-C3-SALIENCE-001` — Four-law arithmetic comparison, recovered entry

- **Recorded:** 2026-09-20; evidence is the September 14 work-order item 1 receipt
  `SALIENCE_LAW_COMPARISON_REV1.json` and `scripts/compare-salience-laws.mjs`.
- **Contracts/models:** `encoding-access-math/0.1-candidate` EAM-2; independent,
  historical-shared, historical-hybrid and retired-flat arithmetic candidates.
  No ModelIdentity or public ingress exists for this deliberately pure comparison.
- **Declared domain:** one focal vector, raw9/20 at the historical Cause label;
  historical Cause/Target/Incidental role controls, conserved residual pool1/5 versus
  unconserved attention, budget/threshold1/5, footprints1/2/4/8, empty prior graph,
  eta1, no decay and scales100/10,000/1,000,000. These historical labels and Need
  factors are arithmetic operands, not admitted GA psychological producers.
- **Corpus coverage:** EXP-007/015 and the attention footprint obligation; coverage
  assessed against corpus/0.28.0, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
  Component-only comparison, not an executed whole corpus or public fixture. The
  subsequent GA public verdict remains separately identified.
- **Comparison/coupling:** exact rational output equality across allocation,
  quantized edge and total-row-mass observations; deterministic, no RNG. All six
  law pairs have discriminating witnesses in the receipt.
- **Witnesses:** independent/hybrid focal allocation stays9/29. Shared changes
  from1 with no partner to75/77 with conserved incidental partners. Retired-flat
  always assigns1 and saturates the learned row at every nonempty footprint,
  overflowing from two partners. At resolving scale, even allocation-invariant
  candidates have footprint-dependent per-partner edges. Independent zero edges
  at scale100 are a quantization-floor artifact, not general invariance.
- **Counterfactuals:** conserved versus unconserved residual allocation, role swaps,
  footprint changes and three quantization scales distinguish resource division,
  encoding response and association saturation.
- **Verdict:** **UNRESOLVED** among the three derived laws; RET-001 remains
  **RETRACTED** in its already declared domain. The shared resource counterfactual
  is informative but does not choose a universal psychological equation.
- **Uncovered:** nonempty priors, multiple focal units, nonzero decay, actual
  observer-safe source, public learned state and later retrieval in this receipt.
- **Reopen:** a new source/phenomenon, calibration or resolving-scale comparison
  changes the discrimination or a reduced candidate survives the broader corpus.
  Preserve MEC-005 CONTROL+CONTRACT, MEC-007/CTL-004 CONTROL and MEC-008 CONTROL.

## `VER-C3-EMB-001` — Bounded body/receiving distinctions, recovered entry

- **Recorded:** 2026-09-20 from the September 10 bounded qualification; no new run.
- **Contracts/identities:** `embodied-reserve/0.1-candidate`,
  `rules/campaign3-embodied-receiving/0.1-candidate` and the exact component bundle
  in `campaign3-embodied-receiving-model-rev1/FREEZE.json`. Its thirteen frozen
  ModelIdentities and the exact RunIdentities in
  `embodied-receiving-execution-rev4/REVIEW.json` are the compared models/runs.
- **Declared domain:** finite local reserves, safe interoception, pressure, adopted
  body instructions, shared task/body options and the frozen dice/arbitration
  vocabulary. Physiology, observation, motive, reasons and execution stay separate.
- **Corpus coverage:** bounded BODY/MULTISOURCE obligations assessed against
  corpus/0.28.0, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
  Original pre-promotion evidence keeps its own identities; no retroactive corpus
  execution is asserted. This is not whole BODY/MULTISOURCE qualification.
- **Comparison/coupling:** exact canonical equality of preserved pressure/task
  operands and exact choice-probability comparisons. Frozen run seeds/addressing
  remain in the source receipts. The probability witnesses compare distributions,
  not an unsupported claim that one paired random outcome proves necessity.
- **Witnesses/counterfactuals:** a shared option with independent task/body support
  has probability221/256; deleting either ground yields1/2. Removing/rebinding
  adopted instructions changes association while pressure/task inputs stay equal.
  Duplicate body descriptions retain two origins but one nucleus and probability1/2;
  the explicit no-coverage control gives2/3. Aggregate versus pairwise overlap has
  a separate component witness and is not promoted to a broader public vocabulary.
- **Verdict:** **UNRESOLVED** for final body/Need ownership and general necessity.
  Preserve the qualified finite distinctions and competitors; the required richer
  ownership comparison remains a named debt. Bounded implementation qualification
  does not settle that comparison.
- **Evidence:** `CAMPAIGN3_EMBODIED_QUALIFICATION.json` and its Markdown report:
  EMB-A..O / ER-A..R with public/component limits, 28 public runs/688 checks,
  86 whole-prefix restores across29 specimens and all13 models, and explicit
  deletion/substitution controls. The GA-era full source/reference suites preserve
  those existing fixtures without enlarging their scope.
- **Uncovered/reopen:** general physiology, constitutive adaptation, final Need
  ownership, learned efficacy, action-conditioned relief, mixed learning and full
  cross-family equivalence. Reopen on those required phenomena or failed epistemic,
  source, shared-ground, execution-order or replay preservation.

## `VER-C3-ATTN-001` — Finite public selection boundary, recovered entry

- **Recorded:** 2026-09-20 from the September 11 public qualification; no new run.
- **Contracts/identities:** `attention-public-integration/0.1-candidate`,
  `attention-public-declarations/0.1-candidate`,
  `attention-selection-component/0.1-candidate`. The32 exact model identities and
  corrected224 run identities are in `campaign3-attention-model-rev2/FREEZE.json`;
  old list-S0 run commitments remain explicitly inadmissible historical evidence.
- **Domain:** one positive-time three-port scene, actual SEM roles, K0/1/2,
  role-priority/equal-priority/unlimited selectors, denied/unsupported-role inputs
  and an actual selected-only consumer. This source has one role per port.
- **Corpus coverage:** PHEN-ATTN-001 active-selection clause, assessed against
  corpus/0.28.0 and digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
  Encoding-footprint and later retrieval were unqualified by this old receipt;
  their later GA closure is VER-C3-GA-001, not a rewritten September 11 claim.
- **Comparison/coupling:** deterministic exact selected-set and permitted-history
  equality on matched scene originals; no random draws. Compare committed selector
  policies, capacity, role swaps and denied-port hidden-role substitutions.
- **Witnesses:** capacity policies enforce K separately from source history;
  unlimited is the explicit violating control. Observed role changes alter priority
  selection. Twenty-seven denied-port hidden-role comparisons preserve observer-side
  bytes. Actual consumer reads equal the unique selected set; visibility does not
  authorize access to unselected evidence or mutation of perception state.
- **Verdict:** **RETAINED** as the bounded permission/selection/consumption boundary
  against the named controls. General attention/salience law necessity remains
  **UNRESOLVED**; this hard selector alone establishes no continuous encoding law.
- **Evidence:** `ATTENTION_PUBLIC_QUALIFICATION_REV1.json`,
  `CAMPAIGN3_ATTENTION_PUBLIC_QUALIFICATION.md`: AT2-A..N in stated scope,
  224 cases/217 successes/seven work-bound rejections,434 successful restores,
  58 boundary failures,247 trace corruptions and eleven runtime substitutions.
  Fault detection establishes sensitivity, not general psychological necessity.
- **Uncovered/reopen:** multiple-role source production, arbitrary identifier
  renaming, encoding/association/accessibility, general Affect and broader sources.
  Reopen on new modalities, role semantics, selection/encoding merger or a reduced
  model satisfying the broader corpus. Existing component-only controls retain
  their component classification; no owner ruling is required for this ledger repair.

## `VER-C3-MULTI-001` — Cross-family coverage component comparison

- **Recorded:** 2026-09-20; LOCAL DISPOSITION, executed numerical comparison.
- **Contract/identities:** `multisource-coverage-comparison/0.1-candidate`;
  exact inputs, canonical component operands, outputs and source fingerprints in
  `MULTISOURCE_COMPARISON_REV1.json`. No public ModelIdentity or RunIdentity exists
  for this comparison; synthetic raw signals are not authenticated source outputs.
- **Domain:** thirteen fixtures, at most five signals per option, Task/Body families,
  separate semantic grounds, Base/Situation roles, positive/negative partitions,
  finite weighted evidence maps. Four laws produce52 runs; ten Base-only fixtures
  also receive the DescriptionDice control. Twenty-two reference partitions match
  the existing receiving coverage component exactly in the tested domain.
- **Corpus:** PHEN-MULTI-001 1.0.0-draft, corpus/0.29.0, digest
  `5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d`.
  Component coverage only; no promotion or whole-phenomenon PASS.
- **Competitors/coupling:** GroundAggregate baseline, GroundPairwise,
  GroundUncovered, FamilyNormalized, and Base-only HarnessDescriptionDice. Exact
  existing reason-dice distributions and analytical probabilities against a fixed
  independent d8 opponent; no random draws. Matched inputs and reversed source
  order, shared/disjoint support, signs, roles, duplicates and source removal.
- **Witnesses:** collective {a},{b},{a,b} makes the third aggregate contribution0
  versus pairwise1/8 (bounded totals5/9 versus11/19). Both calibrate to probability2/3,
  so decision probability alone hides the arithmetic difference. A duplicate body
  description keeps baseline probability2/3; DescriptionDice produces89/96.
  Cross-family shared bases retain two grounds and baseline89/96; FamilyNormalized
  yields221/256, while its independent-base control remains89/96.
- **Decisive scope counterexample:** a task Situation with no task Base forms no
  task reason. FamilyNormalized nevertheless weakens the body's reason, changing
  probability3/5 to1/2; deleting that orphan modifier restores3/5. The reference
  preserves3/5 in both cases. This role-blind normalization is not selected for the
  first public baseline; retain it unchanged as a measured competitor.
- **Verdict:** **UNRESOLVED** for general cross-family normalization and necessity.
  Preserve the aggregate baseline and MEC-012/013/014, EXP-009/014 obligations.
  This result neither retracts every normalizer nor establishes aggregate coverage
  as a universal psychological law. No architectural ruling is required.
- **Validation:**21 focused tests across the new comparison and existing receiving
  transforms pass; build and reference-boundary check pass. See
  `MULTISOURCE_COMPONENT_TESTS_2026_09_20.json` and the checkpoint receipt.
- **Uncovered/reopen:** actual shared task/body fact production, legitimate signed
  source interpretation, independently controlled fact domains, public third-basis
  production, immutable model comparisons and replay. Complete the source shape
  in `MULTISOURCE_COMMON_EVIDENCE_SOURCE_DRAFT.md` before allocation. Reopen the law
  choice with an explicitly scoped role/active-ground successor or public evidence
  that distinguishes legitimate independent motives from duplicated descriptions.

### VER-C3-MULTI-001 scope extension — actual selected descriptions, 2026-09-20

The UNRESOLVED verdict is unchanged. `MULTISOURCE_DESCRIPTION_CHECKPOINT.md` and
`MULTISOURCE_DESCRIPTION_TESTS_REV1.json` add actual selected same-signal views with
singleton and conservative hull support: third aggregate contribution0 versus
pairwise1/6, bounded totals5/11 versus1/2. This uses a declared equal-magnitude source
order and does not establish statistical independence, arbitrary renaming invariance
or optimal fusion. Fifty-seven component tests pass; public models/replay remain
open. RO-C3-001 preserves this extension and its limits. No corpus promotion.

## `VER-C3-MULTI-002` — Authentic common evidence and bounded receiving comparison

- **Recorded:** 2026-09-20; LOCAL DISPOSITION. The large bounded public
  BODY/MULTISOURCE checkpoint is COMPLETE. No architectural owner ruling opened.
- **Contract/identities:** `multisource-public/0.1-candidate`, records707..733,
  namespace1149;43 distinct frozen ModelIdentities across55 named scenarios in
  `campaign3-multisource-model-rev2/FREEZE.json`. Seven additional interventions
  freeze their S0, originals and seeds. The55 manifest entries are not55 distinct
  models: state-only controls correctly share ModelIdentity.
- **Sources/domain:** one governed character/observer, two adopted tasks/actions,
  three independently controlled local reserves, selected one/two-view descriptions,
  at most six raw signals and three ordinary/five DescriptionDice nuclei. Actual
  task production and body adoption feed the registered source-to-execution path.
  Task B is an actual competing commitment, not a benchmark-authored die.
- **Corpus:** PHEN-MULTI-0011.0.0-draft shared/independent/duplicate clauses against
  corpus0.29.0, digest
  `5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d`.
  No corpus promotion, whole-phenomenon PASS or Campaign3 completion.
- **Competitors/coupling:** GroundAggregate, GroundPairwise, GroundUncovered,
  FamilyNormalized and Base-only DescriptionDice remain separately committed.
  Compare exact intermediate values and analytical distributions. Shared seeds do
  not imply universal cross-model address equality. The matched DescriptionDice
  interventions prove identical actual raw bytes before changing the dice unit.
- **Witnesses:** the same actual observation supports task Situation and a separate
  body motive. Independent B replenishment changes task support1/2→0 while body
  support remains1/2. With task-A Base absent, GroundAggregate keeps body Base1/3;
  role-blind FamilyNormalized weakens it to1/5 and yields probability1/2, versus3/5
  after orphan removal. The third collective description contributes0 versus
  pairwise1/6; totals5/11 versus1/2 nevertheless both calibrate to349/384 in the
  task-present scenario. Matched duplicate DescriptionDice changes3/5→73/80;
  matched collective DescriptionDice changes2/3→2511/2560.
- **Public proof:**62 runs,227 complete-prefix restorations;62 final-code
  reexecutions reproduce the same whole-save bytes. Source absence, known-zero,
  capacity exclusion, task/body adoption, signed interpretation, within-bin hidden
  variation, owned replenishment and failed protocol execution are explicit controls.
  Forced failure after every current stage, at commit, and during replenishment or
  deadline retirement preserves state/trace/output/queue/allocator/RNG commitments.
- **Verdict:** **RETAINED** for separate motive grounds, source descriptions,
  role/sign partitions and permission/selection boundaries in this tested domain.
  Role-blind FamilyNormalized is not selected as the baseline; DescriptionDice does
  not earn a description-to-motive collapse. **UNRESOLVED** for the universal
  receiving law. GroundAggregate remains a bounded candidate, not a settled law.
- **Preservation:** full run2,235 passes/one codec regression failure; the failing
  receipt is preserved. The final focused22-test rerun passes all affected files
  including that regression, giving latest-result coverage of2,236 active tests.
  All328 reference tests, build and boundary checks pass. Exact details are in
  `MULTISOURCE_VALIDATION_CLOSURE_REV1.json`; the original full-suite process is
  not relabeled as passing. No predecessor source/model/schema was rewritten.
- **Finding preservation:** revision1 construction images remain rejected evidence
  for the instruction/action mismatch. The explicit inherited-slot codec correction
  has a permanent regression. Both findings and the counting clarification are linked
  from `CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md` and RO-C3-001.
- **Obligation disposition:** RO-C3-001 moves ACTIVE→CONDITIONAL. Its immediate
  public-source debt is discharged; its general law/renaming/wider-domain constraints
  remain in the denominator. Reopen on a receiving reduction, role-aware normalizer,
  added motive family, broader source or arbitrary renaming/order-invariance claim.
  No general Need ownership, physiology or learned efficacy is established.
- **Counters:** highest733; allocated since this verdict0 (27 in this increment).

## `VER-C3-BELIEF-001` — Fallible trial belief and separate appraisal

- **Recorded:** 2026-09-20, LOCAL DISPOSITION; bounded BELIEF COMPLETE.
- **Contract:** belief-public/0.1-candidate, records734..746, namespace1150;
  sole existing authority/belief-expectation role owns new root740.
- **Corpus:** PHEN-BELIEF-0011.0.0-draft, corpus0.29.0, digest
  `5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d`.
  The bounded controlled realization meets its contrasts; no corpus promotion or
  whole Research Brief12.4/Campaign3 PASS.
- **Public evidence:** nine frozen models,48 original-data runs,381 complete-prefix
  restores and381 next-step save equalities. See BELIEF_EXPERIMENT_PLAN_REV1.json
  and BELIEF_PUBLIC_EXPERIMENT_REV1.json. One observer/character, two named trial
  channels,32 instants maximum, consequence-only learning and later appraisal.
- **Competitors:** EvidenceMean, LastObservation, NoLearning; three goal signs.
  Exact deterministic comparisons; no random draws. TruthLookup, GoalAsBelief and
  UnconditionalAbsence remain unlicensed researcher-side negative arithmetic controls.
- **Witnesses:** eight misleading observations under fixed false truth yield mean1
  and confidence diagnostic8/9. A contradiction changes mean to8/9; nine to8/17.
  LastObservation instead returns0; NoLearning produces no learned estimate.
  Hidden truth/opportunity changes preserve all safe bytes. Goal-only changes
  preserve belief and change appraisal. Five safe negative trials after one positive
  yield1/6; no-opportunity/censored/unavailable controls retain1 and precision1.
  Missing belief differs from known zero. Independent target permutation preserves
  safe outputs; consequence140 cannot revise the preceding50 appraisal.
- **Verdict:** RETAINED for truth/evidence/belief/appraisal separation, unknown
  versus zero, qualifying-opportunity gating and delayed consequence influence.
  UNRESOLVED for general learning/confidence law; no unique necessity of mean/precision
  is inferred. LastObservation remains a candidate despite weaker contradiction
  resistance. NoLearning fails acquisition/correction in this controlled domain.
- **Validation:**101 distinct affected tests by latest result,328 preserved
  reference tests, production build and boundary check pass. All six stages and
  commit have reached-fault rollback checks, including a later failed contradiction
  after committed learning. Exact validation limits and source scope are in
  CAMPAIGN3_BELIEF_QUALIFICATION.md; no full active-suite rerun is claimed.
- **Obligation:** RO-C3-010 CONDITIONAL for current-lane timing, wider evidence,
  correlations, confidence calibration and broader causal learning. ORD-001 remains
  OPEN outside this consequence-only profile. No architectural ruling is required.
- **Counters:** highest746; allocated since this verdict0 (13 this increment).


## `VER-C3-AFFECT-001` — Belief-relative affect without a commanded response

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded AFFECT COMPLETE.
- **Contract:** affect-public/0.1-candidate; records747..765, namespace1151.
  Root753 belongs solely to the existing belief-expectation authority. The successor
  uses semantic character identity and preserves frozen BELIEF profiles unchanged.
- **Corpus:** bounded PHEN-AFFECT-0011.0.0-draft, corpus0.29.0, digest
  `5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d`.
  No corpus promotion or whole Campaign3 PASS.
- **Evidence:**18 frozen models/90 files;91 main public runs,1236 complete-prefix
  restores and1236 next-step save equalities. Fourteen supplementary executions
  establish exact pre-intervention timing and interior feedback for all candidates.
  See CAMPAIGN3_AFFECT_QUALIFICATION.md, AFFECT_PUBLIC_EXPERIMENT_REV1.json,
  AFFECT_PREFIX_CONTRASTS_REV1.json and AFFECT_INTERIOR_FEEDBACK_REV1.json.
- **Witnesses:** three separately learned observer-side conditional estimates;
  independently varied likelihood/severity/vulnerability/control; hidden truth with
  equal safe observations leaves all character outputs unchanged. Equal affect with
  changed competing commitment changes action at seeds4/7 of the frozen0..7 grid.
  Prior affect changes a strictly later appraisal and actual situation modifier.
  Relief changes affect1→1/2 while danger belief remains1. Missing action/context,
  censoring and no opportunity cannot manufacture mitigation evidence.
- **Competitors:** HistoricalProduct, SplitExposure, ScalarUncontrolled;
  RelativeReduction/AbsoluteReduction; EvidenceMean/LastObservation/NoLearning;
  Feedback/NoFeedback. All three affect candidates show interior1/2→5/8 feedback.
  FearAsCommand, FearAsExtraDie and ReliefAsBeliefEvidence fail distinct researcher-
  side controls; those violations are not granted public cognitive capabilities.
- **Verdict:** RETAINED for belief/appraisal/affect/motive/action separation,
  independent factor interventions, unknown/zero, observed trial/action context,
  genuine reason grounds and strictly later delivery. UNRESOLVED for universal
  factor/control/feedback laws, scalar equivalence and affect representation necessity.
  The chosen receiver is not independent proof that SplitExposure is necessary.
- **Validation:**82 distinct affected tests,328 preserved reference tests, build,
  TypeScript and boundary checks pass. Every one of15 stages plus commit has reached-
  fault rollback after a learned prefix. Final restore requires whole-save byte
  equality and rejects semantic/draw corruption. No full active-suite claim.
- **Obligations:** RO-C3-011 becomes CONDITIONAL for broader uncertainty, temporal
  feedback, causal/source domains, social/retrospective affect, extinction/generalization,
  physiology and general action discovery. RO-C3-010 retains wider belief limits.
  Known valuation, controlled displays and fixed adopted plans bound this qualification.
  No TaskConcern relabeling, general Fear state, new Need ownership or ORD-005 closure.
- **Counters:** highest765; allocated since this verdict0 (19 in this increment).

## `VER-C3-WORK-001` — Maintained access with a derivable active set

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded WORKSPACE/CONTROL COMPLETE.
- **Contract:** workspace-control/0.1-candidate; records766..781, namespace1152.
  Existing task lifecycle authority retained. No frozen predecessor is widened.
- **Corpus:** bounded PHEN-WORK-0011.0.0-draft in corpus0.29.0;21 members,
  unchanged digest. No whole Brief12.6 or Campaign3 qualification.
- **Evidence:**48 frozen models/240 files;70 main plus8 supplementary public runs;
  624 complete-prefix restores and continuation equalities (546 next-instant,
  78 terminal no-op). WORK_PUBLIC_EXPERIMENT_REV1.json, WORK_DISTRACTOR_REV1.json,
  WORK_VALIDATION_CLOSURE_REV1.json and CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md.
- **Witnesses:** three eligible items exceed capacity one/two; independently changed
  capacity, support and distractor priority; unchanged retained task bytes despite
  absent active access; protection versus displacement; cue reinstatement before
  expiry and inert cue afterward. Selected genuine task grounds change action.
  Neutral C cannot manufacture a motive. Safe-source and strictly later timing hold.
- **Competitors:** StoredSet and IndexedReplay produce exactly equal cognitive
  outputs throughout the compared domain, while the latter has no active-set cache.
  UnlimitedWorkspace, AvailabilityEqualsAccess, StatelessPriority and ImmortalGoal
  each fail a named required contrast; these remain labelled diagnostic controls.
- **Verdict:** RETAINED for availability/access, capacity, maintenance/protection,
  retained/active intention, cue/expiry and epistemic/timing boundaries. DERIVED for
  the separate active-set cache from this bounded safe history. UNRESOLVED for
  general indexing, costs, maintenance/control law or cache necessity outside this
  domain. Reconstruction cost and source retention are not eliminated by derivation.
- **Finding preservation:** WORK-DESIGN-001 restricts the main multi-field priority
  contrast. Four supplementary pairs alter exactly one physical distractor priority
  and establish the owed single-factor counterfactual. Original evidence preserved.
- **Validation:**40 affected tests,328 reference tests, TypeScript/build/boundary
  checks; rollback at all nine stage kinds and commit. No full active-suite claim.
- **Obligation:** RO-C3-012 CONDITIONAL for wider lifecycle/history/source domains,
  alternate maintenance, habitual inhibition/load, fatigue, rumination, monitoring,
  strategy switching and reappraisal. No owner ruling is pending.
- **Counters:** highest781; allocated since this verdict0 (16 this increment).

## `VER-C3-SKILL-001` — Competence, performance belief and temporary impairment

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded SKILL COMPLETE.
- **Contract:** skill-public/0.1-candidate; records782..802, namespace1153.
  Separate procedural-skill and capability-belief mutation authorities. Existing
  Campaign2 ADAPT and all Campaign3 predecessor models remain unchanged.
- **Corpus:** bounded PHEN-SKILL-0011.0.0-draft in corpus0.29.0, unchanged21-member
  manifest. No whole Brief12.8 or Campaign3 qualification.
- **Evidence:**27 frozen models/135 files;52 public runs,279 complete-prefix restores
  and279 continuation equalities (227 advancing,52 terminal). See
  CAMPAIGN3_SKILL_QUALIFICATION.md, SKILL_PUBLIC_EXPERIMENT_REV1.json and
  SKILL_VALIDATION_CLOSURE_REV1.json.
- **Witnesses:** exact cognitive/intent/expression/plan equality under hidden
  competence or impairment changes; different execution; skilled/pessimistic and
  unskilled/optimistic performance beliefs; unobserved practice with stale belief;
  exact retained skill through impairment/recovery; blocked/no-feedback/unknown-zero
  controls and strictly later skill/epistemic updates. Single-field interventions
  are structurally checked, and false displays never become actual competence.
- **Competitors:** linear/residual practice, multiplicative/additive impairment,
  NoPractice, EvidenceMean/LastObservation/NoLearning. IntentEqualsSuccess,
  BeliefAsSkill and ImpairmentAsUnlearning fail distinct contrasts. Serious laws
  differ in a later task outcome; no universal law is selected.
- **Verdict:** RETAINED for competence/belief/impairment/intent/attempt/outcome
  distinctions and independent adaptation/learning routes. UNRESOLVED for general
  competence, practice, impairment and belief laws. No skill-to-memory or skill-to-
  confidence reduction. The belief is observed performance expectation in one
  exercise, not latent competence inference or calibrated correctness confidence.
- **Validation:**60 affected tests,328 reference tests, build/TypeScript/boundary
  checks; all12 stage kinds plus commit have reached-fault rollback. Failed initial
  arbitration API use is preserved in SKILL-IMPL-001 and corrected without changing
  frozen model bytes. No full active-suite claim.
- **Obligation:** RO-C3-013 CONDITIONAL for broader skills, rust, transfer,
  automaticity, execution noise, feedback recognition/attribution, latent competence
  inference, confidence-sensitive choice and body/control/workspace integration.
  The sole adopted exercise option holds choice fixed; it does not qualify general
  confidence-sensitive decision making. No owner ruling is pending.
- **Counters:** highest802; allocated since this verdict0 (21 this increment).


## `VER-C3-SOCIAL-001` — Observer-owned person models and fallible communication

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded SOCIAL COMPLETE.
- **Contract:** social-public/0.1-candidate; records803..816, namespace1154;
  authority/person-model with independently keyed observers. Target task373 unchanged.
- **Corpus:** bounded PHEN-SOCIAL-0011.0.0-draft, corpus0.29.0's unchanged21 members.
  No whole Brief12.10/12.13 or Campaign3 claim.
- **Evidence:**18 frozen models/90 files,26 runs,127 complete-prefix restores and
  continuation equalities (101 advancing,26 terminal). See
  CAMPAIGN3_SOCIAL_QUALIFICATION.md and SOCIAL_VALIDATION_CLOSURE_REV1.json.
- **Witnesses:** fixed displays/opposite private commitment yield exact observer views;
  selective truthful or false explanation changes recipient belief only; wrong initial
  inference and later correction; unknown/zero; visible receipt deduplication; reversed
  observer processing with semantic equality. Exact input interventions are audited.
- **Competitors:** SourceGroupedMean, LastStatement, NoLearning remain distinct.
  GlobalPersonModel, DirectPrivateReader and PresentationCounting fail named contrasts.
- **Verdict:** RETAINED observer ownership, epistemic separation, fallible evidence and
  source correlation. UNRESOLVED general social-learning laws; no global belief or
  relationship reduction. Controlled identity channel and one fixed commitment only.
- **Validation:**67 affected tests,328 reference tests, TypeScript/build/boundary checks;
  every stage and commit rollback after learning; closed observer projection and exact
  own-key reads. Initial fixture/evaluator failures retained in SOCIAL_IMPLEMENTATION_FINDINGS.md.
  No full active-suite claim. ORD-002/TRC-003 bounded-qualified, globally OPEN.
- **Obligation:** RO-C3-014 CONDITIONAL for richer recognition, trust, hearsay, uncertain
  correlation, target states, relationships, social action, reciprocal interaction and
  privacy tooling. No architectural decision or owner ruling pending.
- **Counters:** highest816; allocated since verdict0 (14 this increment).


## `VER-C3-HABIT-001` — Acquired action availability after reward correction

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded HABIT COMPLETE.
- **Contract:** habit-public/0.1-candidate; records817..841, namespace1155.
  Separate history, expectation and optional derived-summary owners.
- **Corpus:** bounded PHEN-HABIT-0011.0.0-draft in unchanged corpus0.29.0.
  No whole Brief12.9 or Campaign3 claim.
- **Evidence:**12 frozen models/60 files,23 public runs,291 complete-prefix restores
  and continuations (268 advancing,23 terminal). See CAMPAIGN3_HABIT_QUALIFICATION.md
  and HABIT_VALIDATION_CLOSURE_REV1.json; exact single-field interventions audited.
- **Witnesses:** equal corrected expectation but different acquired candidate
  availability; persistence then change under negative observed action results;
  cue-specific retrieval; invisible execution without learning; false positive reports;
  hidden-reward noninterference and distinct unknown/negative state. Skill1, identity0
  and body-adaptation0 remain inspectable fixed controls, not dynamically integrated.
- **Competitors:** DerivedHistory/StoredSummary, Residual/Linear/NoHistory,
  ExplicitBeliefOnly and labelled violating CurrentRewardOnly. Two serious learning
  laws differ on later probabilities. Derived and cached safe behavior is byte-equal
  for all three laws. All comparison models remain frozen and replayable.
- **Verdict:** RETAINED acquired-history contribution independent of current belief;
  separate stored tendency summary NOT REQUIRED in this bounded domain. General
  learning/reward/threshold laws UNRESOLVED. No architecture-box deletion, general
  memory/habit equivalence or compulsive preference claim. Persistence operates through
  candidate availability under a neutral alternative, using inherited exact arbitration.
- **Validation:**75 affected tests,328 reference tests, TypeScript/build/boundary;
  all14 stages plus commit rollback after acquisition/correction, including random
  draws and intermediate cache mismatch. Failed initial type/evaluator checks retained
  in HABIT_IMPLEMENTATION_FINDINGS.md. No full active-suite claim.
- **Obligation:** RO-C3-015 CONDITIONAL for stronger reasons/control, richer cues,
  attribution and schedules, episodic alternatives, compression/long horizons,
  identity/body/skill integration and addiction/dependence/withdrawal/relapse.
  No architectural owner ruling pending.
- **Counters:** highest841; allocated since verdict0 (25 this increment).


## `VER-C3-REL-001` — Dyadic history beyond current person estimates

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded RELATIONSHIP COMPLETE.
- **Contract:** relationship-public/0.2-candidate; records842..862, namespace1156.
  Independently keyed history/person/cache authorities; fixed identity/body0,skill1.
- **Corpus:** bounded PHEN-REL-0011.0.0-draft, unchanged corpus0.29.0. No whole
  Brief12.11, general ordering/privacy, or Campaign3 qualification.
- **Evidence:**11 frozen models/55 files,24 public runs,256 whole-prefix restores
  and continuations (232 advancing,24 terminal), including observer-view equality.
  See CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md and RELATIONSHIP_VALIDATION_CLOSURE_REV2.json.
- **Witnesses:** exactly matched same-observer person estimate/different admitted
  history changes effective contact response; rupture survives positive explanation;
  absence changes feasibility without erasure; witnesses do not inherit participants'
  histories; hidden-source and nonrecipient exact view equality. Analytical score-win
  and effective Auto/roll probabilities are distinguished. No executed-action claim.
- **Competitors:** DerivedHistory/StoredSummary, PersonEstimateOnly, StickyRupture/
  LatestInteraction. SharedHistory and DirectTruth fail named contrasts; SharedHistory
  also fails transactionally with two simultaneous participants. Reverse-order semantic
  views and actual draws agree under frozen authored probe roots.
- **Verdict:** RETAINED history-relative appraisal distinct from the tested current
  person estimate. Separate stored summary NOT REQUIRED in the complete finite journal
  domain. General relational dimensions/learning/repair laws UNRESOLVED. No architecture
  deletion, general person-model reduction, episodic equivalence or compression claim.
- **Validation:**86 affected tests,328 reference tests, TypeScript/build/boundary;
  all17 stages plus commit reached-fault rollback during an actual rupture/cache change.
  Own-key and forbidden-view audits pass. The0.1 cohort failed effective-response
  discrimination because unit1 truncated bounded modifiers to0. It remains frozen
  and replayable; the0.2 successor uses existing unit1/4 calibration. Findings are preserved in
  RELATIONSHIP_IMPLEMENTATION_FINDINGS.md. No full active-suite claim.
- **Obligation:** RO-C3-016 CONDITIONAL for richer dimensions, recognition/attribution,
  asymmetric attachment, reconciliation, grief, longer separation, memory/compression,
  enacted reciprocal interaction and identity/body/control integration. No owner ruling.
- **Counters:** highest862; allocated since verdict0 (21 this increment).


## `VER-C3-LONG-001` — Acquired families across actual detail loss and relearning

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded LONGITUDINAL COMPLETE.
- **Contract:** longitudinal-public/0.2-candidate; records863..883, namespace1157;
  existing typed cognitive occurrences retain their meanings. Corpus0.29.0 unchanged.
- **Evidence:**15 frozen models/75 files,32 public runs,513 complete-prefix
  restores and continuation equalities (481 advancing,32 terminal),
  120 affected tests,328 reference tests, TypeScript/build/boundary checks.
  See CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md and LONGITUDINAL_VALIDATION_CLOSURE_REV2.json.
- **Witnesses:** actual biography/dice/identity plus skill and relationship acquisition;
  independent-family preservation; actual episode loss with surviving learned state;
  skill interference/relearning and discriminating execution; fallible social history;
  evidence gating, history order and committed gap interventions.
- **Competitors:** FullHistory, CompactRelationship, EpisodicOnly, DestructiveSharedSlot,
  isolated families, NoLearning, KeepAll, NoRust/HalfAtGap, two rupture laws, StandingOff.
- **Verdict:** RETAINED acquired-family ownership and learned structure beyond recent
  episodes. Rich relationship journal NOT REQUIRED for the fixed folds/horizon, with
  different accessible detail explicitly preserved. General compression/lifelong and
  psychological law claims UNRESOLVED. No architecture box is deleted.
- **Preservation:**15 nondiscriminating0.1 models remain frozen; two failed-gate public
  terminal saves replay exactly. Workspace capacity error, symmetric standing/calibration,
  nondiscriminating execution difficulty and diagnostic-versus-knowledge limits remain
  durable findings. No whole active-suite or Campaign3 PASS.
- **Obligations:** RO-C3-009/013/016/017 CONDITIONAL; no owner ruling pending.
- **Counters:** highest883; allocated since verdict0 (21 this increment).

## `VER-C3-AUDIT-001` — Coverage audit withholds Campaign 3 exit

- **Date:** 2026-09-21; LOCAL DISPOSITION, documentation/evidence audit only.
- **Verdict:** whole Campaign3 **UNRESOLVED / NOT EXIT-READY**. No new model,
  behavioral qualification, reduction, allocation or corpus identity is created.
- **Denominator:** unchanged corpus0.29.0, all21 members and all15 Brief families.
  Eleven members have bounded qualifications, three retain accepted prior scope,
  six are PARTIAL and scalar-bound LEARN is BLOCKED. These are not21 fresh runs.
- **Evidence:** CAMPAIGN3_EXIT_AUDIT_2026_09_21.md and
  CAMPAIGN3_EXIT_AUDIT_REV1.json preserve obligation-field text, individual Brief
  cases, source hashes, independent findings reconciliation, reduction limits and
  semantic transfer. Missing joined comparisons remain untested, not behavioral FAIL.
- **Finding disposition:** RO-C3-008/009 become ACTIVE for owed BODY ownership/BIO
  comparisons. RO-C3-018 owns retained mandatory LEARN/EPI/REASON/DECISION/COMMIT
  gaps; RO-C3-019 owns the remaining broader-family cases, explicitly including
  goals/prospection. RO-C3-020 conditionally preserves historical graph/attribution/
  calibration/representation constraints. Existing bounded closures remain valid.
- **Scope:** scanned current verdicts/qualification reports and declared cited
  findings/history inventory. Not exhaustive review of every historical draft or
  fresh runtime verification. The structural checker is not scientific proof.
- **Next:** PHEN-LEARN-001 scalar censored-evidence readiness and four required
  contrasts, through accepted seam/model gates. No implementation starts in this audit.
- **Reopen:** new evidence or source/denominator changes, newly found material
  findings, or a proposed broader exit/reduction claim. No owner ruling pending.
- **Counters:** highest883; allocated since verdict/member0.

**External review disposition, 2026-09-21:** audit and NOT EXIT-READY conclusion
accepted within the declared inventory. RO-C3-021 adds a mandatory final-exit
canonical historical evidence universe/reconciliation gate; current metadata checks
do not discharge it. See CAMPAIGN3_FINAL_HISTORY_GATE.md. LEARN remains first;
later gap ordering remains risk-based. No new experiment or qualification.


## `VER-C3-LEARN-001` — Informative scalar censoring without precision manufacture

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded LEARN COMPLETE.
- **Contract:**learn-public/0.1-candidate;884..896/schema1, namespace1158.
- **Corpus:**PHEN-LEARN-0011.0.0-draft in unchanged corpus0.29.0; no whole Brief12.4 pass.
- **Evidence:**CAMPAIGN3_LEARN_QUALIFICATION.md;6 models,39 runs,580 exact prefix
  restores/continuations; LEARN_PUBLIC_EXPERIMENT_REV1.json and closure receipt.
- **Verdict:**RETAINED informativeness/precision and epistemic distinctions;
  UNRESOLVED general update/precision/quantization laws. Gated satisfies the four
  lower-bound contrasts. PointOnly misses inconsistent-bound learning;
  UnconditionalPrecision fails compatible/zero/repeated-bound controls.
- **Limits:**fresh-prior repetition is not universal deduplication; established
  below-bound repetition still grows precision. Full point-like credit for accepted
  bounds remains an approximation. Exact and lattice candidates remain distinct.
- **Preservation:**failed lattice assertion receipt preserved;44 affected/328
  reference tests and build/type/boundary pass. No full active-suite claim.
- **Obligations:**RO-C3-018 LEARN clause discharged; other mandatory gaps stay ACTIVE.
  RO-C3-010 retains upper/decay/source/uncertainty and repeated-bound limitations.
- **Reopen:**new scalar domain, upper bounds, decay, correlation, accepted-bound
  precision requirement or richer posterior. No architectural ruling pending.
- **Counters:**896/0 (13 allocated this increment).


## `VER-C3-EPI-001` — Exact hidden saturation through learning and encoding

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded EPI COMPLETE.
- **Contract:**epi-public/0.1-candidate;897..912/schema1; namespace1159.
- **Corpus:**PHEN-EPI-001/1.3.0-draft, unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_EPI_QUALIFICATION.md;6 models,72 runs,240 exact prefix
  restores/continuations; EPI_PUBLIC_EXPERIMENT_REV1.json and closure receipt.
- **Verdict:**RETAINED epistemic distinction: before19/20, potential1/10 versus4/5
  yield identical admitted1/20 evidence through six character output kinds and
  two retained owners. Truth/overflow differ. Both deliberate leak controls are
  detected; lawful permitted-measurement changes affect encoding and learning.
- **Comparison limit:**leak profiles are diagnostic violations, not lawful
  psychological competitors or a salience-necessity proof. Exact/lattice candidates
  remain distinct; no general numerical law, memory topology or reduction selected.
- **Causality:**prior130 encoding is frozen before independent140 writers; later50
  sees learning and retained encoding separately. Unknown belief can coexist with
  known encoding; missing observations remain distinct.
- **Validation:**49 affected/328 reference tests, build/type/boundary PASS. Earlier
  rejected seed receipt preserved. No full active-suite claim.
- **Obligations:**RO-C3-018 exact EPI clause discharged within the declared roster;
  REASON/DECISION/COMMIT remain active. RO-C3-007 and010 retain broader source,
  consumer, surprise, retention and scalar inference limits.
- **Reopen:**new consumer/source, permitted sensor or hedonic signal, evidence
  linkability, horizon or ordering. No owner decision pending.
- **Counters:**912/0 (16 allocated this increment).


## `VER-C3-REASON-001` — Independent reasons without duplicate evidence or identity dice

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded REASON COMPLETE.
- **Contract:**reason-public/0.3-candidate;913..929/schema1; namespace1160.
- **Corpus:**PHEN-REASON-001/1.0.0-draft, unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_REASON_QUALIFICATION.md;5 frozen models,115 public runs,
  350 exact prefix continuations; matched raw sources/history across every case.
- **Verdict:**RETAINED exact motive/referent/role distinctions and one base die
  per resolved reason. Aggregate collective redundancy contributes0; PairwiseOnly
  admits1/8. PooledChannel collapses separate motives/referents; PerFactDie adds
  description dice; IdentityIndependentDie violates zero-base exclusion.
- **Standing:**actual choice/expression/qualification history rescues a genuine
  weak motive with d4+1; neither standing nor situation creates a zero-base reason.
- **Limits:**controlled task/panel mapping; one compilation plus acquired history.
  UNRESOLVED universal coverage, direction identity, new roles/referents, arbitrary
  renaming and numeric calibration. No architectural reduction.
- **Preservation:**two failed model/plan/test cohorts retained and rejected;
  67 affected/328 reference tests, type/build/boundary checks pass.
- **Obligations:**RO-C3-018 REASON clause discharged; DECISION/COMMIT still active.
  RO-C3-001/009/020 retain broader source, BIO, direction and calibration limits.
- **Reopen:**new source/role, causal nonparticipant, identity representation,
  coverage ordering or reduction. No owner decision pending.
- **Counters:**929/0 (17 allocated this increment).


## `VER-C3-DECISION-001` — Authoritative unresolved choice survives failed execution

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded DECISION COMPLETE.
- **Contract:**decision-public/0.1-candidate;930..951/schema1;namespace1161.
- **Corpus:**PHEN-DECISION-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_DECISION_QUALIFICATION.md;6 frozen models,174 public runs,
  360 exact prefix continuations;72 affected/328 reference tests.
- **Verdict:**RETAINED conditional authoritative arbitration, independent reason
  dice, separate player presentation, frozen intent/expression and post-attempt
  observation/history. AlwaysRoll, NeverRoll, DecorativeDice, OpaqueWeightedChoice
  and historical IntentEqualsOutcome each lose a required bounded obligation.
- **Limits:**two options, reason-mass significance, balanced opaque marginal;
  no universal grammar, significance, control/uncertainty or memory theory.
- **Obligations:**RO-C3-018 DECISION discharged, COMMIT remains; RO-C3-020 retains
  wider calibration/representation limits and preserved test failures.
- **Reopen:**significance changes authoritative math; more options; control versus
  uncertainty; another grammar meeting all requirements; wider history consumers.
- **Counters:**951/0 (22 allocated this increment). No owner ruling.


## `VER-C3-COMMIT-001` — Concrete obligations retire without erasing earned identity

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded COMMIT COMPLETE.
- **Contract:**commit-public/0.1-candidate;952..970/schema1;namespace1162.
- **Corpus:**PHEN-COMMIT-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_COMMIT_QUALIFICATION.md;4 models,10 public runs,70 exact
  prefix continuations;144 affected and328 reference tests.
- **Verdict:**RETAINED concrete lifecycle gating, terminal A/new B identity,
  separate persistent earned standing and observer-specific admitted knowledge.
  Baseline counts0/1/0/1/1; CoreNeed1/1/1/1/1; Immortal0/1/1/2/2; ReusedId repeats A.
- **Limits:**fixed+3 receiving calibration, cancellation, two concrete instances,
  controlled truthful communication; no general Need/commitment/identity/social law.
- **Obligations:**RO-C3-018 resolved by its five bounded public verdicts;
  RO-C3-014/020 preserve wider lifecycle, source, identity and calibration limits.
- **Reopen:**partial fulfillment, beneficiaries, delegation, series identity,
  lifecycle consequences, new evidence/recognition source or representation reduction.
- **Counters:**970/0 (19 this increment). No owner ruling.


## `VER-C3-BODY-001` — Storage does not determine embodied pressure authority

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded BODY ownership comparison COMPLETE.
- **Contract:**body-ownership-comparison/0.1-candidate; no allocation or new state owner.
- **Corpus:**PHEN-BODY-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION.md;16 public source runs,
  five component candidates,79 exact source prefix continuations;47+328 tests.
- **Verdict:**RETAIN the interoceptive boundary. MeterBehindSensor and CachedEvidence
  are bounded-equivalent to Mediated at sampled probes. IndependentNeed fails hidden
  alias/availability; AuthoredReference fails as a replacement for current body state.
- **Limits:**component ownership comparison using existing public sources; no new
  integrated public model, general Need ontology, whole physiology or box retirement.
- **Obligations:**RO-C3-008 immediate comparison discharged, broader scope CONDITIONAL;
  RO-C3-020 retains representation and public/component limits.
- **Reopen:**new kinetics, adaptation, learned efficacy, action-conditioned relief,
  mixed learning, between-opportunity persistence or different legitimate histories.
- **Counters:**970/0; no owner ruling.


## `VER-C3-BIO-001` — Earned disposition changes; historical meaning stays frozen

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded BIO comparison COMPLETE.
- **Contract:**bio-coupled-comparison/0.2-candidate plus canonical identity binding.
- **Corpus:**PHEN-BIO-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_BIO_QUALIFICATION.md;6 component candidates,13 cases,
  260 exact component prefix continuations;13 additional identity-bound complete
  reruns;56 affected and328 reference tests. No new public factory qualification.
- **Verdict:**RETAIN earned feedback and frozen contextual expressions. Early-only
  seed variation changes standing and matched-probe intent. One contradiction weakens;
  sustained contrary authorship reverses. Refold matches; retrospective reinterpretation
  fails historical integrity. DisplayOnly/HistoryOnly remain behaviorally equivalent.
- **Preservation:**first failed32-seed calibration, revised32-seed calibration,
  unexecuted predecessor plan and identity packaging correction all remain explicit.
- **Obligations:**RO-C3-009 immediate debt discharged, broader scope CONDITIONAL;
  RO-C3-020 retains general direction/calibration/compression/public-integration limits.
- **Reopen:**source eligibility, coercion, cross-context identity, mature uncertainty,
  longer history, different weighting or proposed history/identity reduction.
- **Counters:**970/0; no owner ruling.


## `VER-C3-AGENCY-001` — Chosen intent survives obstruction; attribution follows admitted evidence

- **Date:**2026-09-22; LOCAL DISPOSITION; corrected bounded public obstruction slice COMPLETE.
- **Contract:**agency-public/0.3-candidate;971..988/schema1,namespace1163.
- **Scope:**Brief12.14 clauses4/6/7/8 bounded; unchanged corpus0.29.0/21 members.
- **Evidence:**CAMPAIGN3_AGENCY_QUALIFICATION.md;5 models,19 public runs,71 exact
  prefix continuations (52 advancing/19 terminal);38 agency and328 reference tests.
- **Verdict:**RETAIN chosen intent/expression, execution and observer-specific causal
  evidence separately. OutcomeOnly, OmniscientCause and SuccessAsIntent fail named
  witnesses. GroupedMean and LastClaim remain serious, behaviorally distinct candidates.
- **Preservation:**first cohort missed later nonrecipient occurrence leakage; the failed
  regression and exact source archives survive. Version0.2 fixes empty source reservations;
  version0.3 fixes inherited intent80 to the declared intent70, verified from actual traces.
- **Limits:**controlled identified obstruction/report source; no blame, calibrated trust,
  counterfactual efficacy, coercion, cross-episode prediction or generic SEM admission.
- **Obligations:**RO-C3-019 remains ACTIVE;014/020 preserve broader source and attribution.
  No obligation closes. Final historical reconciliation021 remains unsatisfied.
- **Reopen:**broader explanation, source credibility, generalization/controllability,
  coerced action or a proposed intent/outcome/evidence reduction.
- **Counters:**988/0 (18 this increment). No owner ruling.


## `VER-C3-GOAL-001` — Retain the goal while replacing its strategy

- **Date:**2026-09-22; LOCAL DISPOSITION; bounded public goal/strategy COMPLETE.
- **Contract:**goal-strategy-public/0.1-candidate;989..1007/schema1,namespace1164.
- **Scope:**Brief12.7 clauses1/3/4 bounded; corpus0.29.0 remains21 members.
- **Evidence:**CAMPAIGN3_GOAL_STRATEGY_QUALIFICATION.md;4 models,19 public runs,
  94 exact prefixes (75 advancing/19 terminal),26 affected and328 reference tests.
- **Verdict:**RETAIN desired goal, selected plan and admitted evidence separately.
  GoalEqualsPlan loses the goal during a no-route gap; FixedRoute cannot complete
  via the available alternative; FailureAbandonsGoal confuses failure with retirement.
  SeparateGoalPlan resumes and completes via B without readoption.
- **Boundary:**external or false perceived attainment can fulfill; hidden attainment
  cannot. Denied evidence preserves later full observer provenance. No random draws.
- **Limits:**one goal/two authored routes; no generic persistence, planning, efficacy,
  control, forgetting, procrastination or temporal-goal conflict law.
- **Obligations:**RO-C3-019 ACTIVE;012/014/020 CONDITIONAL. No obligation closes.
- **Reopen:**multi-goal, contested arbitration, new sensors, longer horizons or reduction.
- **Counters:**1007/0 (19 this increment). No owner ruling. Next CONTROL readiness.


## `VER-C3-CONTROL-001` — Inhibit a learned candidate without erasing the habit

- **Date:**2026-09-22; LOCAL DISPOSITION; bounded public CONTROL COMPLETE.
- **Contract:**control-public/0.2-candidate;1008..1024/schema1, no new namespace.
- **Scope:**Brief12.6 clauses3/4 bounded; corpus0.29.0 remains21 members.
- **Evidence:**CAMPAIGN3_CONTROL_QUALIFICATION.md;7 models,17 public runs,142 exact
  prefixes (125 advancing/17 terminal),22 affected and328 reference tests.
- **Verdict:**RETAIN learned habit, retained goal, active maintenance, inhibition,
  motive and competence separately. A competing neutral card prevents inhibition
  while upstream habit/goal/belief stay fixed; actual habitual action follows.
  Removing load restores inhibition. Retiring the goal exposes the preserved habit.
- **Comparators:**NoInhibition, LoadBlind, RetainedEqualsMaintained, EraseHistory,
  NoHistory; Residual and Linear acquisition laws remain distinct candidates.
- **Preservation:**first development cohort exceeded inherited HABIT one-reason
  grammar. Failed tests/source/model identities remain archived. Successor typed
  records admit the two-reason contest without widening HABIT's frozen codec.
- **Limits:**two-slot/one-card candidate, controlled source; no universal resource,
  physiological fatigue, learned control, monitoring, rumination or reappraisal.
- **Obligations:**RO-C3-012/015/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1024/0 (17 this increment). No owner ruling. Next inference correction.


## `VER-C3-INFER-001` — Correct the same event-local causal claim from new evidence

- **Date:**2026-09-23; LOCAL DISPOSITION; bounded report-supported correction COMPLETE.
- **Contract:**inference-correction-experiment/0.1-candidate over unchanged agency-public0.3.
- **Evidence:**CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md;5 reused models,
  15 public runs,120 prefixes (105 advancing/15 terminal);7 new and328 reference tests.
- **Scope:**Brief12.4 clauses5/9 bounded. No new model identity, record or learning law.
- **Verdict:**RETAIN observer-local episode/proposition identity, unique source support,
  history and truth/evidence separation. Correction changes the existing obstruction
  belief without rewriting earlier intent/expression. Duplicate, denied, absent and
  other-episode reports do not provide new corrective credit for the focal claim.
- **Comparators:**GroupedMean and LastClaim remain distinct. OutcomeOnly stays unknown;
  OmniscientCause leaks hidden facts; SuccessAsIntent drops failed-action expression.
- **Limits:**received causal claims only; not alternative diagnosis, blame, calibrated
  trust, source independence, explicit retraction or unguided causal discovery.
  Misleading correction under identical admitted evidence remains possible.
- **Obligations:**RO-C3-010/014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1024/0; no allocation. No owner ruling. Next deliberate reappraisal.


## `VER-C3-REAPPRAISAL-001` — Consider learned protection without changing belief

- **Date:**2026-09-23; LOCAL DISPOSITION; bounded instructed reappraisal COMPLETE.
- **Contract:**reappraisal-public/0.1-candidate;1025..1039/schema1, namespace1165.
- **Evidence:**CAMPAIGN3_REAPPRAISAL_QUALIFICATION.md;5 models,20 runs,103 prefixes
  (83 advancing/20 terminal);15 new and328 reference tests; production build passed.
- **Scope:**Brief12.6 clause8 bounded; hypothetical conditional framing, not physical protection.
- **Verdict:**RETAIN observations, learned estimates, appraisal frame and derived affect.
  Frame140 changes only later appraisal50; ineffective/harmful protection does not force relief.
- **Controls:**NoReappraisal, DirectAffectOverride, ReliefAsEvidence; HistoricalProduct
  and SplitExposure remain distinct candidates. Missing knowledge or failed operation prevents framing.
- **Limits:**instructed uncontested operation only; no downstream motive/action qualification,
  spontaneous strategy choice, general regulation, causal efficacy or universal resource law.
- **Obligations:**RO-C3-010/011/012/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1039/0 (15 this increment). No owner ruling. Next memory/recognition intake.


## `VER-C3-RECOLLECT-001` — Reconstruct lost detail without rewriting the episode

- **Date:**2026-09-23; LOCAL DISPOSITION; bounded routine recollection COMPLETE.
- **Contract:**recollection-public/0.1-candidate;1040..1054/schema1, namespace1166.
- **Evidence:**CAMPAIGN3_RECOLLECTION_QUALIFICATION.md;5 models,20 runs,159 prefixes
  (139 advancing/20 terminal);15 new/328 reference tests; production build passed.
- **Scope:**Brief12.3 clauses3/8 bounded. Routine Boolean detail, controlled episode labels.
- **Verdict:**RETAIN observation, surviving imprint, category summary and recollection
  separately. Wrong recall follows acquired regularities after actual detail loss.
  Recall does not learn again; new evidence changes later guesses without rewriting history.
- **Alternatives:**FragmentOnly and KeepDetail remain serious controls. TruthRestore
  leaks hidden facts; ReencodeGuess relabels a guess as retained detail.
- **Preservation:**first public matrix passed, but build found readonly annotation errors.
  Archived source/harness and failure receipt preserved; REV2 repeats identical results.
- **Limits:**no general recognition, defining-memory law, affect bias or downstream action.
- **Obligations:**005/006/007/017/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1054/0 (15 allocated). No owner ruling. Next familiarity/recognition intake.


## `VER-C3-FAMILIAR-001` — Familiarity survives episodic detail loss without asserting identity

- **Date:**2026-09-23; LOCAL DISPOSITION; bounded feature familiarity COMPLETE.
- **Contract:**familiarity-public/0.1-candidate;1055..1067/schema1, namespace1167.
- **Evidence:**CAMPAIGN3_FAMILIARITY_QUALIFICATION.md;5 models,24 runs,94 prefixes
  (70 advancing/24 terminal);16 new/328 reference tests; production build passed.
- **Scope:**Brief12.3 clauses6/7 bounded; controlled person/place feature displays.
- **Verdict:**RETAIN appearance, surviving signature, episodic detail, familiarity
  and instance identity separately. Partial match survives actual detail removal.
  Current observation cannot self-match; tied sources do not assert unique identity.
- **Alternatives:**ExactOnly remains a stricter candidate; DetailRequired fails after
  loss; MissingAsFalse invents evidence; TruthIdentity leaks hidden information.
- **Preservation:**development branded-time build failure/source archived and corrected
  before public freeze. No contract/model changed.
- **Limits:**no general recognition, reward, valence, novelty Need or downstream action.
- **Obligations:**005/006/007/017/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1067/0 (13 allocated). No owner ruling. Next social communication intake.


## `VER-C3-COMM-001` — Chosen disclosure changes recipient evidence through actual delivery

- **Date:**2026-09-23; LOCAL DISPOSITION; bounded chosen disclosure/concealment COMPLETE.
- **Contract:**communication-public/0.1-candidate;1068..1082/schema1, namespace1168.
- **Evidence:**CAMPAIGN3_COMMUNICATION_QUALIFICATION.md;8 models,27 runs,130 prefixes
  (103 advancing/27 terminal);31 new/328 reference tests; production build passed.
- **Scope:**Brief12.13 clauses1/2 bounded. Acquired speaker belief; two actual options.
- **Verdict:**RETAIN private knowledge, choice, intent, expression, execution, recipient
  evidence and recipient learning. Failed disclosure preserves choice but supplies no
  assertion; concealment retains knowledge. A mistaken honest assertion can be false.
- **Alternatives:**EvidenceMean/LastReceipt remain serious laws; NoLearning separates
  evidence from update. PrivateCopy and IntentAsDelivery fail their named boundaries.
- **Preservation:**interrupted serial plan/harness retained; successor parallel plan
  completes all identical cases. Inherited reasons/dice and actual draw replay retained.
- **Limits:**no deliberate lying, listener mentalizing, trust or general language.
- **Obligations:**RO-C3-014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1082/0 (15 allocated). No owner ruling. Next deliberate lying readiness.


## `VER-C3-LYING-001` — A lie follows speaker belief and purpose, not hidden truth

- **Date:**2026-09-24; LOCAL DISPOSITION; bounded deliberate/failed lying COMPLETE.
- **Contract:**lying-public/0.1-candidate;1083..1097/schema1, namespace1169.
- **Evidence:**CAMPAIGN3_LYING_QUALIFICATION.md;8 models,30 runs,143 prefixes
  (113 advancing/30 terminal);31 new/328 reference tests; production build passed.
- **Scope:**Brief12.13 clauses3/4 bounded; acquired belief and adopted communicative purpose.
- **Verdict:**RETAIN speaker belief, purpose, intended assertion, produced assertion,
  receipt and recipient belief. A deliberate lie can accidentally be true; failed
  execution or denied receipt preserves intent without granting recipient evidence.
- **Alternatives:**EvidenceMean/LastReceipt disagree after contrary assertions;
  NoLearning admits without updating. TruthDefinedContent, IntentAsDelivery and
  PrivateCopy fail their named epistemic or execution boundaries.
- **Preservation:**frozen disclosure/concealment cohort remains separate. Actual
  inherited dice, stage/commit rollback and complete later recipient provenance retained.
- **Limits:**no general language, trust, listener mentalizing, emotional leakage or moral identity.
- **Obligations:**RO-C3-014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1097/0 (15 allocated). No owner ruling. Next emotional display intake.


## `VER-C3-DISPLAY-001` — Observable emotional cues can conflict with chosen reassurance

- **Date:**2026-09-24; LOCAL DISPOSITION; bounded distress/display COMPLETE.
- **Contract:**emotional-display-public/0.1-candidate;1098..1113/schema1, namespace1170.
- **Evidence:**CAMPAIGN3_EMOTIONAL_DISPLAY_QUALIFICATION.md;10 models,32 runs,160 prefixes
  (128 advancing/32 terminal);32 new/328 reference tests; production build passed.
- **Scope:**Brief12.13 clauses5/6 bounded. Private learned risk, independent appraisal
  factors, actual chosen content and independently produced observable cue.
- **Verdict:**RETAIN private affect, chosen assertion, frozen choice meaning, produced
  display, receipt and recipient belief. Reassurance may coexist with an unchosen
  distress cue; failure/access can affect each channel independently.
- **Alternatives:**GradedDisplay/ThresholdDisplay remain serious candidates; NoLeak
  and NoLearning preserve distinct ablations. PrivateCopy and IntentEqualsDisplay
  fail their named privacy/production boundaries.
- **Preservation:**missing helper and timeout receipts retained. The first calm fixture
  also changed control evidence; final likelihood-only fixture and whole-horizon
  assertion check correct that confound without changing model or runtime.
- **Limits:**no physiological/learned display, general inhibition, trust/fusion,
  language misunderstanding, listener mentalizing or moral identity qualification.
- **Obligations:**RO-C3-011/014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1113/0 (16 allocated). No owner ruling. Next communication interpretation.


## `VER-C3-INTERPRET-001` — Received signals do not grant private intended meaning

- **Date:**2026-09-24; LOCAL DISPOSITION; bounded misunderstood explanation COMPLETE.
- **Contract:**interpretation-public/0.1-candidate;1114..1130/schema1, namespace1171.
- **Evidence:**CAMPAIGN3_INTERPRETATION_QUALIFICATION.md;8 models,29 runs,116 prefixes
  (87 advancing/29 terminal);33 new/328 reference tests; production build passed.
- **Scope:**Brief12.13 clause7 bounded; one causal proposition and two fixed conventions.
- **Verdict:**RETAIN intended meaning, produced/perceived signal, context, interpretation
  and recipient belief. Later correction preserves earlier misunderstanding.
  Honest mistaken reports are distinct from misunderstood reports.
- **Alternatives:**ContextualMean/LiteralMean and LastInterpretation remain serious
  competitors. NoLearning and NoInterpretation are distinct ablations. IntentOracle
  violates the private-intent boundary with identical raw recipient evidence.
- **Preservation:**whole later views, actual inherited dice, acquired-state stage/commit
  rollback and every complete-prefix continuation. Prior profiles remain frozen.
  Negative/misleading fixture aliases count once in the public matrix.
- **Limits:**no learned lexicon, general language/pragmatics, trust, causal discovery
  or listener mentalizing. Separate bounded witnesses do not qualify joint communication.
- **Obligations:**RO-C3-014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1130/0 (17 allocated). No owner ruling. Next attributed knowledge intake.


## `VER-C3-ATTRIBUTED-001` — Beliefs about another's belief guide communication without reading their mind

- **Date:**2026-09-24; LOCAL DISPOSITION; bounded attributed knowledge COMPLETE.
- **Contract:**attributed-public/0.1-candidate;1131..1147/schema1, namespace1172.
- **Evidence:**CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md;6 models,30 runs,120 prefixes
  (90 advancing/30 terminal);34 new/328 reference tests; production build passed.
- **Scope:**Brief12.10 clauses5/6 bounded; fixed target/proposition and perceived reports.
- **Verdict:**RETAIN own belief, target actual belief, observer-attributed belief,
  relevance and chosen communication. Misleading reports can suppress explanation;
  later correction changes choice without rewriting past intent.
- **Alternatives:**LatestReport/MajorityReport remain serious candidates.
  NoPersonModel loses report-specific relevance; PrivateStateOracle leaks hidden state.
- **Preservation:**whole later views, actual dice and all stage/commit rollback.
  Stale copied IDs, inherited read bound and type-narrowing failures are preserved.
  Strengthened report-only comparison keeps B's entire actual state identical.
- **Limits:**no factivity, general mentalizing, trust, natural recognition,
  exposure-to-comprehension inference or universal relevance/update law.
- **Obligations:**RO-C3-014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1147/0 (17 allocated). Next disposition/current-intent intake.


## `VER-C3-PERSONSTATE-001` — A fitting conduct impression does not guarantee correct current-intent inference

- **Date:**2026-09-24; LOCAL DISPOSITION; bounded person-state dissociation COMPLETE.
- **Contract:**personstate-public/0.2-candidate;1148..1164/schema1, namespace1173.
- **Evidence:**CAMPAIGN3_PERSONSTATE_QUALIFICATION.md;8 models,28 runs,168 prefixes
  (140 advancing/28 terminal);35 new/328 reference tests; production build passed.
- **Scope:**Brief12.10 clauses1/2 bounded; controlled helping domain and stable default
  policy. The default is a research benchmark, not earned personality or identity.
- **Verdict:**RETAIN learned conduct impression, current-intent estimate, actual
  target intent, execution, observer evidence, goal-relative appraisal and affect.
  Changed cue can alter current appraisal while history/impression remain fixed.
- **Alternatives:**Pooled is a serious single-estimate comparator; HistoryOnly loses
  current-cue sensitivity, CueOnly lacks disposition, PrivateGoalOracle leaks context.
- **Preservation:**the initial cohort appraised before intent existed. Preserve
  personstate-rev1 and its unqualified frozen plan;0.2 uses consequence130 after intent70.
  Added a fifth common observation to test later provenance after hidden changes.
  Actual dice, all stage/commit faults and whole-prefix restores remain.
- **Limits:**no calibrated trait confidence, general personality, trust, natural
  recognition, universal timescale or downstream observer action.
- **Obligations:**RO-C3-011/014/020 CONDITIONAL;019 ACTIVE. None closes.
- **Counters:**1164/0 (17 allocated). Next fear/guilt attribution intake.

## VER-C3-FEAR-GUILT-001 — bounded fear/guilt attribution, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED under fear-guilt-public/0.1-candidate.
Five models,19 runs,95 complete prefixes (76 advancing/19 terminal),21 new and328
reference tests; production build passed. RETAIN private appraisal, produced cue,
observer evidence, guilt attribution and goal-relative appraisal separately. Innocent
nervousness can support a mistaken judgment that revises with admitted context.
ContextOdds/CueOnly/NoLearning and TruthOracle remain distinct; weights are not
calibrated causal likelihoods. Whole later observer views preserve hidden truth/cause
and other-observer noninterference; Oracle violates the boundary. No downstream
action, moral identity or general guilt-detection claim. See CAMPAIGN3_FEAR_GUILT_QUALIFICATION.md,
FEAR_GUILT_CLOSURE_REV1.json and FEAR_GUILT_PRESERVATION_REV1.json.
RO-C3-011/014/019/020 carry all material limits; none closes. Counters1177/0.

## VER-C3-PERSON-GOAL-001 — bounded person-goal inference, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED under person-goal-public/0.1-candidate.
5 models/21 runs/126 exact prefixes (105 advancing/21 terminal);24 new+328 reference
tests and build passed. RETAIN adopted goal, ordinary strategy, attempt, outcome,
observer evidence, inferred goal and observer appraisal. A shared route can serve
different goals; different routes can serve the same goal. Misclassified attempted
motion can mislead and later evidence revise inference; failed attempts inform
RouteAndOutcome while OutcomeOnly stays unknown. NoLearning and GoalOracle remain
explicit controls. Full later-view hidden-goal/nonrecipient comparisons pass lawfully
and fail for Oracle. Catalogue and factor weights are controls, not learned affordances
or calibrated independent evidence. No Decision, identity reduction or observer action
claim. See CAMPAIGN3_PERSON_GOAL_QUALIFICATION.md, PERSON_GOAL_CLOSURE_REV1.json and
PERSON_GOAL_IMPLEMENTATION_FINDINGS.md. RO-C3-014/019/020 retain all material limits;
none closes. Counters1194/0.

## VER-C3-HEARSAY-001 — bounded hearsay versus direct observation, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED under hearsay-public/0.1-candidate.
5 models/23 runs/138 exact prefixes (115 advancing/23 terminal);23 new+328 reference
tests and build passed. RETAIN target conduct, speaker evidence/belief/report, recipient
testimony, direct perception and resulting estimate separately. DirectPriority and
LatestEvidence differ with the same channel-labelled history; direct perception can
still be wrong. Visible speaker/ticket duplicates add no second testimony; delayed
first receipt remains valid. NoLearning and TruthOracle remain controls. Whole later
views preserve hidden conduct, denied private changes and nonrecipient information;
Oracle violates the boundary. No chosen speech, learned trust, independent corroboration
or global reputation claim. CAMPAIGN3_HEARSAY_QUALIFICATION.md, HEARSAY_CLOSURE_REV1.json
and HEARSAY_IMPLEMENTATION_FINDINGS.md preserve evidence/limits. RO-C3-014/019/020;
none closes. Counters1206/0.

## VER-C3-REL-DIMENSIONS-001 — bounded relationship dimensions, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED under rel-dimensions-public/0.1-candidate.
6 models/23 runs/161 exact prefixes (138 advancing/23 terminal);23 new+328 reference
tests and build passed. RETAIN dyadic history, person evidence, current context and
derived relational appraisals. Assistance/competence/commitment/threat sources yield
affection without respect, respect without affection, and trust without comfort.
Selective interventions selectively change inherited reason/dice response distributions
(7/9 versus2/9 at extremes); modifier-disabled control leaves1/2. This is prospective
distribution qualification, not sampled or executed behavior. SingleScore/PersonOnly/
NoRetention/TruthOracle retained. Whole later hidden/denied/nonrecipient privacy passes
lawfully and fails for Oracle. Initial test assumptions and unchanged production cohort
are preserved in REL_DIMENSIONS_PRESERVATION_REV1.json. See
CAMPAIGN3_REL_DIMENSIONS_QUALIFICATION.md and REL_DIMENSIONS_CLOSURE_REV1.json.
RO-C3-014/016/019/020 retain broad derivation/calibration/interaction limits; none closes.
Counters1220/0.

## VER-C3-REL-ATTRIBUTION-001 - bounded relationship attribution, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED under rel-attribution-public/0.1-candidate.
6 models/25 runs/225 exact prefixes (200 advancing/25 terminal);23 new+328 reference
tests and build passed. RETAIN experienced dyadic harm, event-linked attribution,
current willingness and current appraisal separately. A later false explanation
changes cause/caution and prospective contact while preserving harm and prior
judgments; willingness-only changes affect a separate cooperation probe.
Absent/denied/unlinked/foreign explanations do not correct the original incident.
InitialCause/CurrentBeliefOnly/NoLearning/TruthOracle remain controls; no state
reduction. Whole later hidden/denied/nonrecipient views pass lawfully; Oracle fails.
No enacted behavior, verified alternative cause, calibrated blame, forgiveness or
relationship-repair claim. CAMPAIGN3_REL_ATTRIBUTION_QUALIFICATION.md,
REL_ATTRIBUTION_CLOSURE_REV1.json and REL_ATTRIBUTION_IMPLEMENTATION_FINDINGS.md
preserve evidence and limits. RO-C3-014/016/019/020; none closes. Counters1234/0.

## VER-C3-RELIANCE-001 - bounded reliance after commitment history, 2026-09-24

LOCAL DISPOSITION / QUALIFIED BOUNDED. reliance-history-experiment/0.1-candidate
uses six unchanged rel-dimensions-public/0.1-candidate models:22 public runs,
176 exact prefixes (154 advancing/22 terminal);7 new+328 reference tests/build.
No new allocation, model or production law. Fulfillment then failure changes the
reliability estimate1 to1/2 and prospective entrust probability7/9 to1/2; reverse
order converges at equal counts. Missing opportunity is not failure; unknown is
not known mixed evidence despite an equal distribution. Own participation and
target keys govern history. SplitLenses separates commitment from task evidence;
SingleScore/PersonOnly/NoRetention/TruthOracle and modifier-disabled controls remain.
Whole later privacy passes lawfully and fails for Oracle. No enacted delegation
or general trust/commitment/repair claim. See CAMPAIGN3_RELIANCE_HISTORY_QUALIFICATION.md,
RELIANCE_HISTORY_CLOSURE_REV1.json and RELIANCE_HISTORY_IMPLEMENTATION_FINDINGS.md.
Preserve first timeout/unexecuted plan via RELIANCE_HISTORY_PRESERVATION_REV1.json.
RO-C3-014/016/019/020; none closes. Counters1234/0.

## VER-C3-FAMILIAR-VALENCE-001 - bounded familiarity without liking, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under familiar-valence-public/0.1-candidate.
7 models/27 runs/216 exact prefixes (189 advancing/27 terminal);23 new+328 reference
tests/build. RETAIN appearance memory, identity channel, own outcome history and
signed appraisal separately. Neutral, positive and adverse histories preserve
matched familiarity while contact distributions differ1/2,7/9,2/9. Appearance
changes preserve outcome appraisal; cross-target familiar appearance transfers
neither identity nor interaction history. FamiliarityAsLiking loses adverse appraisal;
ValenceOnly/NoMemory/ExactOnly/TruthValence and modifier-disabled controls remain.
Whole later hidden/denied/nonrecipient views pass lawfully; Oracle fails.
No instance-recognition, general liking law, enacted interaction or attachment claim.
CAMPAIGN3_FAMILIAR_VALENCE_QUALIFICATION.md and FAMILIAR_VALENCE_CLOSURE_REV1.json
bind evidence. Preserve FAMILIAR_VALENCE_IMPLEMENTATION_FINDINGS.md and prior cohorts.
RO-C3-007/016/017/019/020; none closes. Counters1249/0.

## VER-C3-ATTACHMENT-001 - bounded perceived-dependence attachment, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under attachment-public/0.1-candidate.
6 models/25 runs/200 exact prefixes (175 advancing/25 terminal);23 new+328 reference
tests/build. RETAIN perceived meaningful-dependence history, expected relief,
current practical demand/alternatives, target presence and missing-contact appraisal.
Repeated history supports a prospective reconnection-information response despite
an adequate alternative or no current demand. PositiveHistory and CurrentUtilityOnly
lose different required distinctions; NoHistory/TruthOracle/modifier disabling remain.
MEC-001/EXP-001 mean-learning contradiction resistance is preserved, not replaced
by an authored attachment meter. No universal counting law, actual caregiving,
physiological distress, grief or enacted search claim. Whole later privacy passes
lawfully and fails for Oracle. CAMPAIGN3_ATTACHMENT_QUALIFICATION.md,
ATTACHMENT_CLOSURE_REV1.json and ATTACHMENT_IMPLEMENTATION_FINDINGS.md bind limits.
RO-C3-010/011/016/019/020; none closes. Counters1263/0.

## VER-C3-BETRAYAL-001 - bounded betrayal versus failed commitment, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under betrayal-public/0.1-candidate.
6 models/32 runs/288 exact prefixes (256 advancing/32 terminal);27 new+328 reference
tests/build. RETAIN prior observer-admitted promise, experienced failure, incident
intent/control, present willingness and current appraisal separately. Missing,
simultaneous or late promise cannot fabricate prior commitment. Same failure with
changed admitted intent/control changes appraisal; false explanation can mislead.
OutcomeOnly/CurrentPersonBeliefOnly preserve journals but lose distinct contrasts;
NoLearning/TruthOracle/modifier-disabled controls remain. Correction removes a
prospective information-seeking modifier without repairing history or restoring
cooperation. Whole later privacy passes lawfully, fails for Oracle. No general
moral/blame law, natural recognition, verified explanation or enacted response.
CAMPAIGN3_BETRAYAL_QUALIFICATION.md and BETRAYAL_CLOSURE_REV1.json bind evidence.
BETRAYAL_IMPLEMENTATION_FINDINGS.md and preservation inventory retain first build
failure, type-only correction and scope limits. RO010/011/014/016/019/020;
none closes, no reduction or owner ruling. Counters1277/0.

## VER-C3-GRIEF-001 - bounded grief after believed loss, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under grief-public/0.1-candidate.
7 models/31 runs/279 exact prefixes (248 advancing/31 terminal);27 new+328 reference
tests/build. RETAIN acquired dependence history, current absence, future-contact
belief, practical utility and loss/reunion appraisal coordinates separately.
Matched absence/history with temporary, uncertain or enduring-loss reports changes
prospective keepsake/reunion-information responses. An adequate substitute does not
erase loss; false reports/corrections remain possible under fixed truth. Missing
report is not known uncertainty or no future contact. History and past judgments
are immutable. TemporaryAbsenceOnly/CurrentUtilityOnly preserve journals but lose
different comparisons; NoHistory/NoReturnInference/TruthOracle/modifier controls
remain. Whole later privacy passes lawfully and fails for Oracle. No general grief
law, clinical time course, physical death model or enacted mourning/search.
CAMPAIGN3_GRIEF_QUALIFICATION.md and GRIEF_CLOSURE_REV1.json bind evidence;
GRIEF_IMPLEMENTATION_FINDINGS.md and preservation inventory retain source limits.
RO010/011/016/019/020; none closes. No reduction or owner ruling. Counters1291/0.

## VER-C3-PERFORMANCE-001 - bounded performance monitoring, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under performance-public/0.1-candidate.
4 models/22 runs/198 exact prefixes (176 advancing/22 terminal);19 new+328 reference
tests/build. RETAIN goal, route visit, attempt/execution, admitted performance and
monitoring diagnostic separately. At fixed goal/availability, two admitted failures
change the later ordinary plan and actual route attempt. Single/transient failure,
missing feedback and fresh-visit controls discriminate. OutcomeBlind/AnyFailure/
TruthOracle remain explicit. False feedback can prompt a switch after real success;
whole later hidden/denied views pass lawfully and fail for Oracle. No alternative
superiority, causal diagnosis, new Decision law or universal threshold claim.
CAMPAIGN3_PERFORMANCE_QUALIFICATION.md and PERFORMANCE_CLOSURE_REV1.json bind evidence;
PERFORMANCE_IMPLEMENTATION_FINDINGS.md preserves the blocker-removal confound for
any improvement claim. RO010/012/013/019/020; none closes. Counters1310/0.

## VER-C3-RUMINATION-001 - bounded recurrent concern, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under rumination-public/0.1-candidate.
4 models/22 distinct runs/198 distinct prefixes;23 executions/207 replay checks
include one preserved duplicate case, not extra coverage.25 new+328 reference tests/build.
RETAIN original evidence, retained concern, recurrent access, workspace occupancy,
control opportunity and actual behavior. Repeated access changes inhibition without
new evidence; interruption/rebound and admitted resolution preserve history.
NoRecurrence, StaticLoad, Alternating and external-card controls remain. Whole later
hidden/denied/nonrecipient views and all-prefix restores pass. No general recurrence,
fatigue, clinical law, natural concern source or self-chosen regulation claim.
CAMPAIGN3_RUMINATION_QUALIFICATION.md / RUMINATION_CLOSURE_REV1.json bind evidence;
RUMINATION_IMPLEMENTATION_FINDINGS.md and RUMINATION_DUPLICATE_CASE_FINDING_REV1.json
preserve limits and accounting flaw. RO010/011/012/017/019/020; none closes.
Counters1331/0. No reduction or owner ruling.

## VER-C3-FATIGUE-001 - bounded experienced fatigue, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under fatigue-public/0.1-candidate.
4 models/20 distinct runs/180 exact prefixes (160 advancing/20 terminal);
25 new+328 reference tests/build. RETAIN physical condition, sensor evidence,
retained experience, workload, control effectiveness and motor execution separately.
Severe experienced fatigue impairs actual inhibition with fixed goal/habit/load;
missing feedback persists and admitted rest releases next40. Unknown differs from
rested. NoFatigue/MotorOnly/AnyFatigue remain. Motor challenge preserves prior intent
while physical execution fails. False/hidden/denied whole later views and all-prefix
restores pass. No endogenous accumulation, clinical or universal resource law.
CAMPAIGN3_FATIGUE_QUALIFICATION.md / FATIGUE_CLOSURE_REV1.json bind evidence;
FATIGUE_IMPLEMENTATION_FINDINGS.md preserves source and motor/control limits.
RO008/011/012/013/019/020; none closes. Counters1352/0; no owner ruling or reduction.

## VER-C3-PROCRASTINATION-001 - bounded retained-goal postponement, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under procrastination-public/0.2-candidate.
4 models/20 distinct runs/180 exact prefixes;26 new+328 reference tests/build.
RETAIN active goal, maintained access, current feasibility, future expectation,
independent immediate motive, exact reasons/dice and actual choice/execution.
A positive work reason survives actual defer choices; missing access and inability
are separate controls. NoTemporalBias/PresentFocused/NoImmediateMotive remain.
Progress, fulfillment, cancellation and deadline failure are distinct. Whole later
hidden/denied views and all-prefix replay pass. No universal temporal valuation,
clinical or optimal scheduling claim. Available later is not sufficient completion
capacity. Preserve original0.1 cohort and PROCRASTINATION_ADOPTION_FAILURE_REV1.json:
first tests missed late adoption; corrected0.2 rejects adoption at/after deadline.
CAMPAIGN3_PROCRASTINATION_QUALIFICATION.md / PROCRASTINATION_CLOSURE_REV1.json bind
the evidence. RO010/012/014/019/020; none closes. Counters1376/0; no owner ruling.

## VER-C3-DELAYED-001 - bounded delayed gratification, 2026-09-25

LOCAL DISPOSITION / QUALIFIED BOUNDED under delayed-public/0.1-candidate.
3 models/26 distinct runs/234 exact prefixes;27 new+328 reference tests/build.
RETAIN admitted offer, anticipation, actual choice/wait, physical delivery and
learned receipt. Hyperbolic/NoDiscount/Exponential remain candidates; exact reason
dice mediate actual now/later choice for the same benefit task. Failed promise and
missing/false/late receipts preserve earlier expression. Duplicate receipt does not
add evidence; hidden/denied whole safe views and all-prefix replay pass.
No calibrated discount curve, trust learning, cross-benefit exchange rate, optimal
patience or later adaptive-choice claim. Preserve DELAYED_SCHEMA_REJECTED_REV1.json
and DELAYED_IMPLEMENTATION_FINDINGS.md. CAMPAIGN3_DELAYED_QUALIFICATION.md /
DELAYED_CLOSURE_REV1.json bind evidence. RO010/012/014/019/020 retained; none closes.
Counters1400/0; no owner ruling or reduction.

## VER-C3-INTENTION-001 - bounded intention forgetting, 2026-09-26

LOCAL DISPOSITION / QUALIFIED BOUNDED, intention-forgetting-component/0.1-candidate.
Composed component scope:3 models/54 runs/486 component prefixes;15+328 tests/build.
RETAIN adopted goal, prospective action content, access, cue, opportunity and execution.
Reminder recovers surviving instruction for actual action, but not removed content.
NoLoss/PersistentAccess remain. Cancellation/expiry and hidden physical failure remain
separate. Preserve zero-score recall test failure and superseded identity cohort;
REV2 binds exact content and reproduces every prior behavior hash. No public scheduler/
save API or universal forgetting law. CAMPAIGN3_INTENTION_QUALIFICATION.md /
INTENTION_CLOSURE_REV1.json. RO005/006/007/012/014/019/020 remain; none closes.
Counters1400/0; no new allocation, reduction or owner ruling.
