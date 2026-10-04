# Measurement-memory runtime qualification review — revision 1

Date: 2026-09-08. Implements `measurement-episodic-memory/0.1-candidate` under the frozen
`rules/campaign2-measurement-memory/0.1-candidate` model/profile. This is executable evidence
submitted for research qualification, not an automatic promotion of whole controls.

## Accepted freeze

The user accepted the corrected reference packet and all16 a/p/F/R commitments. The exact
canonical bytes remain authoritative; reference diagnostic digest is
`3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9`.
[FREEZE.json](campaign2-measurement-memory-model/FREEZE.json) records this disposition and
fingerprints the17 existing packet files without editing the historical review manifest.
Its old review-candidate status describes the pre-acceptance checkpoint, not current authority.
C2-MEM-PACK-002 is concretely closed. Blocked58a491... specimens remain NEVER ADMITTED,
NEVER FROZEN, and neither migration sources nor compatibility aliases.

## Production activation

`src/campaign2/memoryModelSource.ts` constructs declarations independently of the packet.
`memoryFactory.ts` admits plain copied data and returns opaque prepared-model/run facades.
`memoryModel.ts` compares the complete source against the exact bounded declarations, derives
F/R from wrapper bytes, and runs the full successor through VAL and the state compiler.
The internal codec context admits342–358 without broadening inherited model decoders.
Seven state families compile: six writable and the separate read-only IDN roster.
Slot5 remains14 memory RecordField declarations plus the independent IDN StateMapKey declaration.

[Production byte proof](CAMPAIGN2_MEMORY_MODEL_BYTE_A_PROOF.json) reproduces all16 exact
registry and ModelIdentity byte pairs. It rejects static injection, wrong profile, bare/wrong
wrapper, anonymous representation, missing requirement, missing/wrong IDN role and accessor
input; verifies copying and forged-handle rejection. No packet bytes are constructor inputs.
Altered declarations are rejected even when canonical commitment machinery can hash them.
No new allocation, wrapper, profile, model version or compatibility path was introduced.

## Executed causal path

`memoryExecution.ts` consumes the genuine admitted337 producer through the fixed runtime.
At phase130, M1 emits342 with one shared-runtime1125 occurrence. Phase140 projects nested
ObserverId through the committed M2/IDN requirement and performs one insert-only WRT operation
at346/1/mapKey(344(CharacterId,EvidenceId)), storing345(M1). Formation has no episode occupancy
semantic read. The trace includes the IDN read, actual patch and sole structural diff.

The same intake schedules content-free351 for checked T1+1, phase20. Private suppression
schedules its own content-free future padding and still checks overflow. Scheduler-allocated
children are bound to exact pending associations including payload, event identity and parent.
Only a matching association can execute; a substituted event rejects before authoritative reads.

Recall resolves IDN once, preauthorizes the exact episode key, then reads only that leaf.
The episode read is direct, with empty DerivedSources and absent TransformationId. Present
memory emits352 with one shared-runtime1126 occurrence; absent/read-ablated/private branches
consume the matching void ordinal. No occurrence is allocated for the cue. Recall changes no
persistent state. The only memory mutation is the declared episode insertion.

Formation ablation retains M1 and genuine cue topology but cannot form an episode. Recall
ablation preserves an existing episode and performs no episode read. All16 controls execute
11 events at the revealing instant and one later event; runtime next-ID is7 then8. A subsequent
authored-source EVID sentinel has identical complete269/270 records in all16 configurations.
Coincident recall and a later source preserve distinct chains and exact restored continuation.

## Persistence and rollback

`restoreMemoryRun(source,{initialState,orderedInputs,save})` requires the original S0 and inputs.
It recomputes commitments, replays exactly the saved trace prefix at whole-instant boundaries,
and compares the complete canonical save. N=0 is the initial post-input-compilation snapshot.
Only after equality does it extract detached private pending associations, validate their
bijection to saved queue entries, and construct a fresh restored runtime from prepared state,
queue and allocators. It does not return the replay runtime or serialize capabilities.
State validation checks episode schema/content/key relations without a second IDN lookup.

[Fresh-process proof](CAMPAIGN2_MEMORY_RESTORE_PROOF.json) covers real recall, private padding,
formation ablation and recall ablation. Original-S0 mismatch, preseeded episodes, forged cue,
dropped queue, changed ordinal, changed historical output and partial-instant prefix reject.
Late formation/output and late recall/trace failures restore state, queue, allocators, trace,
outputs and clock. Int64 maximum delay overflows atomically in both real and private branches.
Failed runs do not acquire save authority. This is prefix integrity, not antirollback protection.

## Evidence by frozen vector

Primary executable source: `src/test/campaign2Memory.test.ts` (33 tests). Rows describe the
tested scope and its composition; they do not mark MEMR or ADAPT qualified by local fiat.

| Vector | Evidence and scope |
|---|---|
| MEMR-A | Same frozen model/owner/input and matched topology: sparse D=0 versus D=1 produces5 versus51/10 and distinct episodes. Initial cognitive state is equal; D itself is adaptation state. |
| MEMR-B | Actual component chain varies governed R0/D as50+1 versus51+0, executes probe, admitted carriage, M1, formation and recall, and compares equal337/episodes/352. Changed anchor rejects at the public memory factory. No public R0 variation is claimed. |
| MEMR-C | All availability/permission branches: suppression has no342, episode or recollection. Generative event substitution and missing roster reject. Exact event association and admitted337 validation prevent external/other-observer evidence injection. Absence is not remembered negative evidence. |
| MEMR-D | Committed nested/top-level projection requirements alone provide C; actual trace reads268. Forged delayed observer rejects before any state read; substituted M1/formation event identity rejects before read; missing roster rolls back. Exact whole-model matching excludes alternate paths/accessors/registrations; no observed-SubjectId fallback exists. |
| MEMR-E | Formation trace asserts one346 leaf operation and one diff, with only268 read. WRT authority is the frozen episode-formation owner and expected presence is false. |
| MEMR-F | Exact337 is retained inside342/345/352, preserving the full203 record. Rational5 and51/10 are asserted without float conversion. |
| MEMR-G | Actual later public adaptation changes current state while stored episode and recollection remain exact; restored whole save matches. That public adaptation executes after phase20 recall. Separately, the B/G component changes D from1 to2 between formation and recall, validates the changed state, and still obtains the same historical352. R0 decomposition is component-scoped as B. Calibration and permission are frozen model data, not public in-run knobs. No widened profile is claimed. |
| MEMR-H | Generated351 at T2>T1 produces352 containing the addressed episode; trace proves IDN plus exact episode read and no other state read. |
| MEMR-I | F=false retains actual M1/earlier evidence in outputs but yields no episode or recollection, including separate-process restore. |
| MEMR-J | R=false retains the episode but yields no recollection; pending restore continuation matches. |
| MEMR-K | Original-input compiler rejects submitted memory events/contaminated payloads. Generated-event association precedes reads. Recall trace proves only IDN and addressed memory; no probe/REG/archive/current-observation lookup enters the implementation. Public facade exposes bytes, not runtime authority. |
| MEMR-L | Four fresh-process cases, N=0, pending real/private, coincident work, S0/output/queue/ordinal/prefix forgery controls, initial episode exclusion, missing-roster and late-output rollback, real/private overflow. Exact whole-save equality covers all saved fields; finite malformed cases are not an exhaustive enumeration of encodings. |
| MEMR-M | All16 successor topology/ordinal controls and actual later269/270 sentinel equality; inherited regression tests and150 preservation fingerprints. Historical models retain their original codecs and identities. |
| MEMR-N | New WRT ownership is confined to346; recall is byte-identical state. Full compiled state closure and trace assertions establish no memory-owned mutation of other families. An independently authored later adaptation event retains its pre-existing authority. |
| MEMR-O | Same cognitive baseline, differing actual permitted337, episode as first persistent cognitive divergence; EVID269/270 remains equal. Later352 demonstrates usability. Whole traces need not be byte-equal because run commitments include different adaptation S0. |
| MEMR-P | A/O formation divergence plus H recall, I/J ablations and B–N exclusions form the submitted qualification argument. Research acceptance of this composed, bounded corpus is still required before ADAPT-9b or parent control9 changes. |

## Packaging proof scope

MEM-PACK-A/B/C/F have production exact-admission evidence, with malformed representation and
injection cases plus the decoder's closed schema/field handling. Every source byte participates
in exact-model matching. MEM-PACK-D/G retain the independently constructed commitment-sensitivity
witnesses from the accepted materializer and now also have exact production rejection/identity
reproduction. MEM-PACK-E retains the nontrivial canonical-set permutation/duplicate substrate
witness; the accepted row sets are singleton/empty and cannot honestly furnish a nontrivial
within-row valid permutation. This is an explicit component composition, not a newly admitted model.

## Validation

- TypeScript `npx tsc --noEmit`: PASS.
- Full fresh-source suite:87 files,599 tests PASS (31 memory tests at that checkpoint).
- The two subsequently added memory component/sentinel tests: PASS separately; current memory
  file contains33 tests. No production code changed after the full-suite run.
- Production model-byte proof:16 exact models,9 negative groups PASS.
- Fresh-process persistence proof:4 cases PASS.
- Allocation audits:332 memory and201 wrapper checks PASS.
- All150 prior preservation fingerprints PASS;17 frozen packet fingerprints PASS.
- Reference boundary and `git diff --check`: PASS. No `reference/` edits.

Full-suite command uses the programmatic Vitest runner with config:false, src/test/**/*.test.ts,
testTimeout:60000 and two workers. This avoids unrelated environment config startup access and
parallel-worker timeout noise. No test assertions were disabled.

## Requested research disposition and deferred work

Review the implementation and the explicit component/public split above for MEM-PACK-A..G
and MEMR-A..P qualification. In particular, accept or revise the bounded noninterference and
historical-change composition in B/G and its sufficiency for P/ADAPT-9b. Until that verdict,
whole qualification remains pending; ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 stay OPEN.

No belief, association, appraisal, value/reward, strength/decay, habit, skill, person-model,
relationship, identity/disposition learning, generic retrieval/search, current-truth comparison,
unit conversion, widened public R0/calibration model, migration or antirollback semantics were
added. Those remain separately governed work. No new semantic choice was made during this pass.


## Subsequent research verdict — 2026-09-08

The user qualifies MEM-PACK-A..G and MEMR-A..P with the documented bounded scope splits.
See CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md. The original different-adaptation-S0
memory pair did not qualify parent ADAPT-9b; the subsequent same-S0 joined intervention
is recorded separately in CAMPAIGN2_PHEN_ADAPT_CONSOLIDATION_REVIEW.md. Historical validation
accounting remains599-test full suite plus2 subsequently focused witnesses.
