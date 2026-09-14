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
