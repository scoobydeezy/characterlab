# Campaign-2 trace binding

**Status: ACCEPTED AND FROZEN.**
Version: `campaign2-trace-binding/0.1-candidate`.

Accepted 2026-09-06 from C2-TRACE-001 revision 2. Complete semantics are the mapping
and transaction/finalization rules below. TRACE-C2-A..N are frozen qualification
obligations proving implementation conformance; they are not runtime operands.
No caller selector, registry row, numeric profile identity or configurable trace policy.
Both added SeamId/1036 members are permanently frozen in TRACE_SEAM_MEMBER_ALLOCATION.md.
This profile is selected only by the accepted bounded RulesVersion 0.2 bundle; never 0.1.
Wrapper implementation still requires replacement ModelIdentity freeze.

## Accepted exact mapping

For every row, RecordKind is exactly the current scheduled EventTypeId/1001. This is a
trace classification using an already allocated event kind, not a cast to TransitionKind.
Registration lookup still uses the existing TransitionKind/1009 where applicable.

| Event / phase | SeamId payload (namespace 1036) | SeamVersion |
|---|---|---|
| event/authored-adaptation-fact / 110 | seam/authored-adaptation-fact-source | adaptation-input/0.31-candidate |
| event/fixture-consequence-observation / 120 | seam/authored-fact-observation | authored-fact-observation/0.1-candidate |
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

