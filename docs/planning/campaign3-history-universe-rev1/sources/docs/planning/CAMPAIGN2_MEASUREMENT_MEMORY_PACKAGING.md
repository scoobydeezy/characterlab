# Measurement-memory successor packaging — revision 2

2026-09-08. **WHOLE PACKAGING SHAPE ACCEPTED. Wrapper allocation review authorized next.**

The wrapper schemas and matrix are accepted, with StaticBindings profile-fixed empty and all external injection rejected under MEM-PACK-F. C2-MEM-PACK-001 is CLOSED. Historical review wording below is superseded by this acceptance; materialization awaits separate wrapper numeric freeze. Runtime remains blocked.

Implements the shape of [measurement-episodic-memory/0.1-candidate](../formal/MEASUREMENT_EPISODIC_MEMORY.md), its [accepted M5 revision 4 closure](CAMPAIGN2_MEASUREMENT_MEMORY_SYMBOLIC_CLOSURE.md), and [frozen allocation](../formal/MEASUREMENT_MEMORY_ALLOCATION_REVIEW.md). This pass identifies one concrete serialization decision before emitting model commitments. No model packet or model digest is claimed yet.

## Typed TransitionSeamContract repair

The revision1 anonymous list envelope is REJECTED. The concrete serialization gap remains real: runtime TransitionSeamContract bindings have no canonical home in the existing six-slot registration shapes. The [wrapper shape draft](CAMPAIGN2_MEMORY_TRANSITION_WRAPPER_DRAFT.md) now owns the proposed repair: three exact canonical records, each with an exact embedded registration and separate typed requirement collections. No generic CanonicalValue, heterogeneous set, list envelope, global registry or seventh slot is admitted.

MemoryV04TransitionSeamContract wraps272 with FieldRequirements:set<266>, FieldPathRequirements:set<343>, EpisodeReadRequirements:set<349>. MemoryFormationTransitionSeamContract wraps347 with FieldPathRequirements:set<343>. MemoryRecallTransitionSeamContract wraps353 with FieldRequirements:set<266> and EpisodeReadRequirements:set<349>. All fields are required. The draft fixes the complete row/version matrix, case-specific cardinalities, cross-collection accessor uniqueness and same-contract dependency checks.

The successor registry profile selects the outer wrapper schema; DefinitionVersion retains its inner registration meaning. Inherited rows remain bare. These are proposed additive packaging schemas; frozen342–355 and all accepted requirement semantics remain unchanged. Shape acceptance precedes a separate numeric allocation review. Materialization is blocked until both gates close.

## Concrete registration and projection data

All exact types below use schema1. Ordinary execution uses seam/measurement-episodic-memory and measurement-episodic-memory/0.1-candidate. TransformationVersion on342/352 is that same memory version.

| Stable TransitionKind | Inner definition | Owned typed collections |
|---|---|---|
| MeasurementEpisodeEvidenceTransition | V04 registration272; input337 from accepted intake producer; output342; ReadDomain empty; NoStateWrites | empty |
| MemoryFormationTransition, F=true | 347 with348; admitted342 from M1; roster ReadDomain; no semantic outputs; StateWrites322 for sole episodic authority | singleton343 |
| MemoryFormationTransition, F=false | existing272/271 V04; same342 admission, roster ReadDomain, empty outputs, NoStateWrites273; executing measurement-formation-write-ablation/0.1-candidate | same singleton343 |
| MeasurementRecallTransition, R=true | 353; admission354(schema351, definition/measurement-recall-opportunity); roster+episode ReadDomain; singleton355(schema352); NoStateWrites273 | exact266 and349 |
| MeasurementRecallTransition, R=false | same353/354; roster-only ReadDomain; empty outputs; NoStateWrites273; executing measurement-recall-read-ablation/0.1-candidate | exact266 only |

The three outer DefinitionVersions are respectively transition-admission/0.4-candidate, measurement-memory-formation-registration/0.1-candidate (or transition-admission/0.4-candidate for F=false), and measurement-recall-registration/0.1-candidate. No ablation-specific TransitionKind or event member is introduced.

343: SelectorSourceFieldPath=[2,2,2], descending342.Source337→337.Observation→203.ObserverId. Target is268/1/MapKey(*), ProjectedFieldId=1 of267, OutputRole=1002 with validator/character-qualification, OutputAccessor=ResolvedCharacterSubject. All intermediate schema roles/required fields are checked before admission. The existing203/2 role1000 is reused.

266 for recall: SelectorSourceFieldId=1 of351, same268/1 target,267/1 projection, same qualified role and ResolvedCharacterSubject. 349: SubjectAccessor=ResolvedCharacterSubject; EvidenceSourceFieldId=2 of351; TargetStatePathTemplate=346/1/MapKey(*); OutputAccessor=accessor/measurement-episode-read. Exact key344 is built from resolved C and authenticated E; authorization precedes presence/value access. Requirement sets are independent of canonical iteration order; the fixed349→266 dependency determines evaluation order. Accessor duplicates, extra requirements, alternate roster access, missing dependency and cross-contract substitution reject.

M1 and formation join route/character-learning through the existing singleton279. Recall has no route entry. Add occurrence rules only342/1→1125 and352/1→1126. Cue351 remains scheduler-event authenticated with no semantic occurrence ID. Output355 fixes exactly one352 iff an authorized episode is present; read-ablation emits none. Formation consumes the existing shared runtime result identities without allocating an episode identity.

## Six-slot and profile realization

| Registry slot | Successor delta |
|---|---|
| 0 | Add17 descriptors after wrapper allocation (14 memory plus3 wrappers); three typed wrapped transition entries and bare opportunity entry350; update existing279 route/occurrence data; update episodic Storage only in284 |
| 1 | Preserve ordering-phases/2-candidate bytes |
| 2 | Add sole authority/measurement-episode-formation for346/1/MapKey(*) episode entry leaf; RemovalAllowed=false |
| 3 | Add exact262 read-only268/1 Bindings map family with267 values |
| 4 | Add IDN identity-key grammar and344 canonical-record-key grammar for346/1; reuse existing declaration schemas |
| 5 | Add exactly14 frozen field roles, preserving inherited roles including203/2 |

Keep definition/campaign2-state-families, registry/campaign2-state-family and adaptation-input/0.31-candidate unchanged. Materialize only episodic-memory.Storage as346/1 with leaf/measurement-episode. Other five family definitions and ownership meanings are retained. Initial episode map is empty. IDN binding values remain S0/run data; no roster values enter the model registry. Preserve the parent draft's historical-mechanism dispositions (including MEC-022/RET-013); import no salience, accessibility or retrieval-history mechanism.

Use the accepted rules, registry, trace and persistence profile tuple from M5 revision4. Keep content/0.2-candidate, campaign2-parameters/0.1-candidate, numeric/exact-1, rng/sha256-addressed-128-v1-candidate and campaign2-probe-ordered-input/0.1-candidate. Preserve base content and parameter bytes. The semantic bundle is the exact31 carriage entries followed by the ten accepted entries in M5 order; no envelope-specific semantic bundle entry is proposed because its grammar belongs to the already selected successor registry profile.

The one opportunity entry has StableId=definition/measurement-recall-opportunity, kind=registry/measurement-recall-opportunity, DefinitionVersion=measurement-recall-opportunity/0.1-candidate, and bare350:

```text
ProducingTransitionKind = MeasurementEvidenceIntakeTransition/1009
RecallEventTypeId = event/measurement-exact-recall/1001
RecallDelay = signed Int64(1)
```

One means one SimDuration tick, not a physical unit. This is the accepted concrete model value, not permanent vocabulary. Real and private future branches use this sole value and checkedAddDuration(T1,1). Overflow aborts the complete producing instant; no saturating arithmetic or private-branch bypass. Delay has no second parameter source.

## Sixteen committed control configurations

Materialize the full Cartesian product of a,p,F,R in lexicographic false/true order. a/p are existing probe-definition values. F/R are derived exclusively from the exact inner registration/version/output/requirement choices above; metadata labels are not independent compiler inputs. All16 preserve the same event and TransitionKind vocabulary and opportunity delay.

| a | p | F | R |
|---|---|---|---|
| false | false | false | false |
| false | false | false | true |
| false | false | true | false |
| false | false | true | true |
| false | true | false | false |
| false | true | false | true |
| false | true | true | false |
| false | true | true | true |
| true | false | false | false |
| true | false | false | true |
| true | false | true | false |
| true | false | true | true |
| true | true | false | false |
| true | true | false | true |
| true | true | true | false |
| true | true | true | true |

All16 must yield distinct committed models even when suppression makes their runtime output equal. The reference packet is true/true/true/true. No ModelIdentity is published until wrapper shape and separate numeric allocation are accepted and actual canonical serialization succeeds.

## Trace, persistence and materialization proof boundary

Use the accepted g1..g11/r0..r7 topology and complete type160 matrix from M5 revision4 unchanged. Intake/padding emits[g8,g9]; M1/padding emits g11. Real cue is atT2 phase20; private future padding is not recall. Each executed event, including padding, contributes one160. SourceRecordIds for recall=[cue.EvidenceId] denotes historical causal337, not a cue identity or lookup capability. Normal/private memory SeamVersion is measurement-episodic-memory/0.1-candidate; ablations use their selected versions. Never substitute RulesVersion text there.

Formation trace records exactly the roster read and one insertion/diff (or no patch for F=false). Recall records roster plus direct episode read with DerivedSources=[] and absent TransformationId; R=false records no episode read. Input/output projections remain exact canonical values. Phase140 is exclusively ADAPT batch OR one formation OR write-ablation OR private padding OR no work, as selected by fixed rules; no stage-policy record.

Persistence selects the accepted mandatory restoreMemoryRun(modelSource,{initialState,orderedInputs,save}) facade. Recompute original S0/model/run/input commitments; replay exactly N committed events at whole-instant quiescent boundaries; handle N=0 at the initial post-input-compilation snapshot; compare whole canonical save bytes. Only a successful match exports detached private pending-association facts. Restore remints fresh admissions with a bijection to saved pending events. No certificate, save field, alternate roster lookup, serialized capability, source archive lookup or antirollback claim.

After wrapper shape acceptance and separate numeric freeze, produce review-only canonical content/registry/parameter bytes and readable forms, exact41-entry bundle/profile tuple,16 ModelIdentities and registry commitments, six-slot delta, preserved-parent fingerprints, and a rematerialization audit. Keep inherited packets unchanged. Validate ordered-input compiler reuse and a declared equivalence corpus; generated cue/padding are excluded from original inputs. S0 fixtures bind the existing observer to the governed character using the accepted IDN identity derivation and remain separate from model commitments.

MEM-PACK-A..G are frozen in the wrapper draft and NOT PASSED. Retain the additional delay, topology, role/path, opportunity uniqueness, F/R consistency, inherited-packet and roster-exclusion checks. All commitment-sensitivity controls are distinct from exact-profile admission: hashing an altered requirement does not admit it as a valid model.

Runtime formation/recall, overflow rollback, control topology and prefix restore proofs remain later MEMR-A..P work. No runtime implementation is authorized. ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN.

## Review request

Accept or revise the three symbolic wrapper schemas and closed row matrix in the linked shape draft. RecallDelay=1, the16 configurations, ordered-input reuse and trace/persistence direction are already accepted. After wrapper shape acceptance, perform separate additive allocation; only then materialize and audit model packets for packaging freeze. Whole packaging and runtime are not yet accepted.
