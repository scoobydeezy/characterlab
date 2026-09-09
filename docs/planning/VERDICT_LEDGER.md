# Research Verdict Ledger

**Status:** active ledger; Campaign 0 substrate verdicts accepted 2026-09-01

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
