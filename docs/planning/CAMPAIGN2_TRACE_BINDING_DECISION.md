# C2-TRACE-001 — first-profile committed trace binding

2026-09-06. **Revision 2 — WHOLE MAPPING SHAPE ACCEPTED.**
RecordKind, both symbolic seam members, all handler mappings, complete ADAPT mutation
evidence and transactional finalization are accepted. No semantic blocker remains.
TRACE-C2-A..N are FROZEN, NOT PASSED. Both seam members and the trace-profile/RulesVersion
meanings are now frozen. Trace-wrapper implementation remains unauthorized until replacement
ModelIdentity is reviewed and frozen.
No permanent member is allocated by this document; the old model packet remains frozen.

## Inspection and narrow decision

`trace/0.2-candidate` requires an ordered type-160 record for every authoritative
transition. `src/substrate/trace.ts` already supplies its exact encoder; `transition.ts`
already obtains actual reads from projections and structural diffs from WRT application.
The generic envelope receives a TypedIdentifierValue for RecordKind without imposing
a dedicated RecordKind namespace. Historical test namespaces are not production vocabulary.

The Campaign-2 allocation freezes four SeamId/1036 members: truth-to-permitted-evidence,
event-truth-to-pre-recognition-experience, character-learning-evidence and
automatic-adaptation. The two EVID and two ADAPT registrations commit their executing
seam/version. The source producer/308 and bridge/309 instead commit source and channel
recipes; neither declares a source ExecutingSeamId or a trace RecordKind mapping.

The phase-110 source is common to the character-learning bridge and automatic-adaptation
branch. Labeling it with either consumer's executing seam would make a new attribution
choice. No accepted dedicated source seam member was found. This is a trace binding gap,
not an execution, persistence, allocation-1039 or ADAPT redesign.

Revision-1 review identified a second ownership distinction: the bridge-owned
authored-fact-observation/0.1-candidate composition is not a version of the unchanged
seam/truth-to-permitted-evidence observation contract. The old phase-120 pairing is
superseded, not an amendment to observation/0.1-candidate.

Accepted resolution: the following corrected trace mapping profile has two
symbolically frozen dedicated seam members. EventTypeId reuse as RecordKind is accepted; no
TraceRecordKind family or fixture namespace promotion is needed. After whole symbolic
shape acceptance, both members require the normal append-only member allocation audit
and review inside existing SeamId/1036 before implementation uses them:

```text
seam/authored-adaptation-fact-source
seam/authored-fact-observation
```

No new numeric namespace or record is proposed. Both members are now permanently frozen in TRACE_SEAM_MEMBER_ALLOCATION.md.

## Accepted exact mapping

For every row, RecordKind is exactly the current scheduled EventTypeId/1001. This is a
trace classification using an already allocated event kind, not a cast to TransitionKind.
Registration lookup still uses the existing TransitionKind/1009 where applicable.

| Event / phase | SeamId payload (namespace 1036) | SeamVersion |
|---|---|---|
| event/authored-adaptation-fact / 110 | **symbolically accepted** seam/authored-adaptation-fact-source | adaptation-input/0.31-candidate |
| event/fixture-consequence-observation / 120 | **symbolically accepted** seam/authored-fact-observation | authored-fact-observation/0.1-candidate |
| event/fixture-consequence-tracking / 121 | seam/event-truth-to-pre-recognition-experience | semantic-binding/0.1-candidate#SEM-001H |
| event/fixture-consequence-binding / 122 | same SEM seam | same SEM version |
| event/fixture-consequence-classification / 123 | same SEM seam | same SEM version |
| event/fixture-consequence-freeze / 124 | same SEM seam | same SEM version |
| event/outcome-evaluation / 130 | exact EVID registration field 1 | exact registration field 2 |
| event/outcome-learning-evidence / 130 | exact EVID registration field 1 | exact registration field 2 |
| event/regulatory-adaptation / 140 | exact ADAPT registration field 1 | exact registration field 2 |
| event/procedural-adaptation / 140 | exact ADAPT registration field 1 | exact registration field 2 |

The phase-120 envelope names the bridge-owned closed composite handler: invoke unchanged
observation/0.1-candidate, validate its exact private raw result, apply the accepted closed
projection, and publish the sole authoritative type-203 observation. SeamId and SeamVersion
thus name the same semantic owner. The inner OBS compiler is a required accepted
sub-operation, not a second authoritative transition or observer occurrence. The private
raw candidate produces neither a second TraceRecord nor a second authoritative output.

All records carry the actual event, model and run identities. EmittedEvents contains the
actual scheduler-allocated children in the existing allocation order, including parents.
No IDs are recomputed, recast or allocated for trace construction.

| Stage | SubjectIds | SourceRecordIds | InputProjection | OutputProjection |
|---|---|---|---|---|
| Source | authored Fact.CharacterId | empty; source EventId already in Event | exact type 304 payload | exact type 307 output |
| OBS | channel ObserverId and SubjectId, unique/sorted | input Truth.TruthRecordId | exact type 310 payload | sole projected type 203 |
| SEM 121–123 | supporting ObserverId | supporting ObservationId | exact type 216 payload | list([]) |
| SEM 124 | supporting ObserverId | supporting ObservationId | exact type 216 payload | exact frozen type 227 |
| EVID evaluation | observer from nested X | X.ExperienceId | exact admitted X | exact E |
| EVID learning evidence | observer from nested E.X | E.OutcomeEvaluationId | exact admitted E | exact L |
| ADAPT | admitted Basis.CharacterId | AAI.AutomaticAdaptationInputId | exact admitted AAI | list(dispatch, evaluations in canonical RuleId order) |

The EVID rows consume the accepted EVID trace mapping, with no roster access, subject
projection, PRJ read or IDN binding. Truth references in the OBS trace remain omniscient;
they cannot enter the projected observation, EVID input, E or L. Source truth is already
structurally present in its emitted OBS events; tracing it requires no parallel output.

RegisteredReadDomain and ActualReadRecords are empty for source/OBS/SEM/EVID. ADAPT uses
its exact registered domain and instrumented per-rule reads against the common snapshot.
StatePatch and StructuralMutationDiffs are empty outside ADAPT. ADAPT records the complete
staged mutation intent attributable to the event and all diffs returned by its actual WRT
application, including exact authorities. NoStateChange contributes no operation or diff
even though its prior reads and evaluation output still exist.
The fixed slice has no RNG draws or quantization operations. InvariantResults remains an
empty list where checks return no canonical result records; this does not suppress checks
or invent a success certificate schema.

### Existing StatePatch expresses the complete event mutation set

Inspection: type 160 field 16 holds existing StatePatch/144; its Operations field is a list
of existing Set/145 and Remove/146 operations. It is not restricted to one operation.
For an ADAPT event, collect every operation from every StateChange evaluation into one
event StatePatch and normalize it through existing createStatePatch. That routine applies
canonical StatePath ordering and rejects overlapping paths; it does not choose a rule.
The current evaluator already aggregates all per-rule operations before the WRT application.

The regulatory fixture can therefore trace four effective rule operations in one type-144
patch; the procedural event's operation belongs to its separate envelope. An event with
no effective changes carries an empty Operations list. StructuralMutationDiffs includes
every WRT-returned diff for that event, after successful whole-batch validation. No diff
is reconstructed from a requested write or selected from only the first rule.

The required correspondence is complete event mutation intent ↔ all StateChange evaluation
patches ↔ all effective WRT diffs. Patch operations use existing canonical path order;
dispatch/evaluation output and occurrence allocation retain accepted canonical RuleId order.
These different orderings must not be substituted for each other. Type 160 and its nested
schemas already express this mapping; no new trace schema or collection wrapper is needed.

## Accepted transaction integration

Ordinary source/bridge/EVID records stage through the existing traceFactory after child
allocation and ingress association. They commit only with the entire instant.

ADAPT's state patches apply only after every phase-140 read/evaluation completes. Therefore
its records must be finalized after successful batch.finish(), using returned WRT diffs,
and appended in the same event-sequence order. An internal scheduler batch trace-finalization
hook can serialize/validate them before commit; no public callback enters the factory.
Do not apply patches early to obtain diffs, infer diffs from desired outputs, mutate already
cloned trace contributions, or add a phase-150 event. Later invariant failure rolls back all
trace, state, outputs, queue and allocators exactly as before.

## Unaffected implementation completed

The evaluator now retains typed actual-read records alongside its existing canonical read
view. `adaptationExecutionDiffs` obtains detached diffs from the actual WRT application only
after every patch and final static/REG check succeeds. Forged, unfinished and expired
execution objects cannot retrieve that evidence. This internal plumbing introduces no trace
labels, schema, runtime output or changed state semantics.

Tests cover five effective mutations across the two authorities, common-snapshot missing
priors, no-op reads without diffs, deep-copy isolation, and a later WRT failure publishing
no completed evidence for earlier staged applications. SUB-008's accepted structural trace
discipline is retained; no historical implementation is imported.

Validation: 52 source test files / 396 tests PASS; build and reference import boundary PASS.
Fresh-process continued save remains 6744 bytes with unchanged SHA-256
`cc29a88d365959fc1c32cf7e2075d2b4ccb1322f6ee5a89d392367ca336c41f9`.

## Frozen proof vectors

These are accepted trace-mapping controls, **FROZEN, NOT PASSED**:

- TRACE-C2-A: exactly one committed type-160 envelope for every authoritative scheduled event execution in this first-profile handler matrix, in execution order. Private helpers, numerical primitives and intermediate values do not receive additional envelopes.
- TRACE-C2-B: exact mapping above; an event-kind, source-seam or projection-version substitution fails.
- TRACE-C2-C: child event IDs, sequences, payloads and parents equal the actual emitted schedule.
- TRACE-C2-D: EVID exact source/output values, observer-only subject, zero state reads and no truth handle.
- TRACE-C2-E: ADAPT dispatch/evaluation ordering and occurrence allocation agree; actual reads use the common snapshot.
- TRACE-C2-F: the event StatePatch contains every operation from every StateChange evaluation; WRT-produced diffs cover the complete effective mutation set with exact old/new values and owning authorities. A four-rule regulatory event must expose all four effective operations/diffs; a first-rule-only mutant fails. No-op yields no operations or diffs while preserving reads and evaluation output.
- TRACE-C2-G: failure after earlier staged work commits no new traces, outputs or state and advances no allocator.
- TRACE-C2-H: uninterrupted and fresh-process continued full traces/saves are byte-identical.
- TRACE-C2-I: hidden-count changes preserve OBS/X/E/L semantic projections while truth-side traces and ADAPT may differ; never compare whole RunIdentity envelopes as if equal.
- TRACE-C2-J: every row's SeamId and SeamVersion belong to the same semantic contract. Substituting observation seam + bridge projection version, or bridge seam + observation/0.1-candidate version, fails.
- TRACE-C2-K: the private raw measurement candidate produces no second TraceRecord or observer occurrence. Exactly one phase-120 scheduled-handler envelope contains the composite input and sole authoritative projected output.
- TRACE-C2-L: with content/registry/parameter declarations fixed, changing either new SeamId or any trace-binding row requires an accepted trace-profile/RulesVersion change and therefore a different ModelIdentity. Different mappings under the same frozen ModelIdentity fail qualification. Same new ModelIdentity and same run inputs reproduce complete trace bytes across fresh processes.

- TRACE-C2-M: materialize old/replacement models; all three manifests and their identities are equal, RulesVersion and ModelIdentity differ, and no other structural operand differs.
- TRACE-C2-N: reject canonical wrapper activation under old 0.1 or under 0.2 without exact trace-profile support; no retroactive upgrade.

## Deliberately deferred

Both seam members are permanently allocated; no runtime wrapper emits the accepted envelopes.
No model artifact, save schema, route, rule, ordering phase, output occurrence, PRJ/IDN contract,
VAL semantics or record layout is changed. Whole trace qualification, independent FCT-6,
VAL/PERSIST closure and PHEN-ADAPT remain pending. Whole shape acceptance authorizes the
two-member additive allocation pass, not trace-wrapper implementation.

## Model commitment gate added by acceptance

The frozen rules/campaign2-bounded-bridge/0.1-candidate bundle predates this mapping and
must not be retroactively widened. Trace is authoritative output included in saves.
The accepted sequence is member allocation → freeze campaign2-trace-binding/0.1-candidate
→ next exact bounded RulesVersion → rematerialize/freeze replacement ModelIdentity
→ wrappers → TRACE-C2-A..N and fresh-process full-trace comparison.
See [commitment update plan](CAMPAIGN2_TRACE_COMMITMENT_UPDATE.md). Old saves remain tied
to the old identity; no silent conversion or equivalence is admitted.
