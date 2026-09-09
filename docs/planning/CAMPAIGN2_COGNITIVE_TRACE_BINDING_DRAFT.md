# Cognitive trace binding proposal

Status: DRAFT. Reuse TraceRecord160/1 and the accepted event/patch/read formats;
no trace schema renumbering or implementation is authorized here.

Each transition records its exact scheduled event, executing seam/version from the
version inventory and RecordKind=that event's EventTypeId. SubjectIds and SourceRecordIds
are complete canonical sets of actual admitted IDs. Sources are immediate genuine
inputs plus specifically declared retained-read provenance, not a reconstruction from
the output's label or a generic trace graph query. Historical trace profiles stay frozen.

For new ordinary cognitive/protocol rows, SubjectIds is exactly{C}, except Workspace
uses{ObserverId,C}. SourceRecordIds is the singleton immediate source output ID:
Workspace→Appraisal→Concern→Motive→Candidates→RawSignals→Reasons→Resolution→Intent,
then Intent→Expression or Plan, Plan→Attempt→Execution, Execution→actual-fact bridge,
Expression→Qualification→identity application. Original Workspace has no source-record
ID; its original event is already recorded by130. Never mint an opportunity occurrence
to fill that list.

Protocol observation120 uses subjects{ObserverId,Channel.SubjectId} and source the
actual ExecutionOutcome ID. Its121..124 rows use subject{ObserverId} and source the
one supporting ObservationId. Their no-output stages do not invent IDs. EVID and
predecessor rows retain their accepted exact bindings. Retained dependencies appear
in ActualReadRecords and their canonical values, not as immediate source outputs.
Immutable definitions resolve through the committed registration/model, not through
SourceRecordIds pretending they were newly produced occurrences.

InputProjection is the actual admitted payload for ordinary exact-payload stages.
Workspace records its original opportunity. The protocol observation stage records
its exact private310 operand trace-side; the published203 output uses only the safe
projection. Researcher access to that input is not a character capability. OutputProjection
is the actual semantic output or canonical empty list for no-output application/stages.
No optional source/output is represented by an invented occurrence or fake successful
record. EmittedEvents is the actual ordered allocated list.

RegisteredReadDomain is the exact committed domain, while ActualReadRecords includes
only values actually requested. Workspace owns IDN/task/prediction reads, candidate
construction plan reads, raw source identity reads and eligible identity application
its prepared prior. No other cognitive stage reports those reads anew. Disabled access
and rejected application produce no phantom entries. A direct whole-history read uses
the accepted direct147 representation, not a fictitious derived-state path.

## Exact quantization trace operand

The actual generic trace has a CanonicalValue list for quantization operations; it
does not supply a dedicated canonical identity-fold codec. Propose one inline record:

    IdentityQuantizationOperation
        SourceQualificationOccurrenceId
        CounterKind
        Input
        Scale
        RoundedInteger
        Output

SourceQualificationOccurrenceId is the real retained/appended entry's ID. CounterKind
is Support or Opposition. Input and Output are exact nonnegative rationals; Scale is
exactly1000000; RoundedInteger is the nonnegative result of ties-to-even on Input*Scale;
Output=RoundedInteger/Scale. This record allocates no occurrence identity. For each
history entry, record Support then Opposition operations, in chronological entry order.

The raw source records the semantic fold used to derive its standing operand when
identity is actually read. Eligible application computes the complete candidate fold
for validation/trace and records it; rejected application records none. A structural
schema check is not another semantic fold and does not create duplicate operation rows.
The implementation should calculate each declared fold once and reuse its result for
the corresponding validation and output derivation.

Support/Opposition remain derived, never extra stored fields. Complete history, exact
source definition IdentityK, fold/version and emitted raw strength make the final
strength reproducible. When it is zero and no standing signal emits, the actual prior
read and fold still distinguish that from a disabled read. No ablation diagnostic
is copied into a psychological source record merely to make tracing easier.

Arbitration alone supplies actual CognitiveRandomDraw records in160 field14, in the
semantic nucleus order followed by a genuine tie draw when present. Their bytes match
the corresponding nested decision result. All other rows have an empty random list.
Auto and no-choice arbitration also have an empty list. Do not call a pre-roll analytical
PMF a random draw. Full candidate/rejection/fallback evidence remains inspectable.

## Mutation and failure evidence

No-write stages have empty patches/diffs. Identity application records only its exact
owned appended-history diff and the declared authority. Task, prediction, memory and
ADAPT traces retain their own patches and owners. A composed stage does not merge those
into a generic unlabeled character update. Empty identity output does not hide a write.

All trace rows remain pending until whole-instant commit. Failure diagnostics are
separate from committed trace; a failed post-draw/post-patch instant must leave no new
trace row or poisoned random address. Retrying must reproduce complete row bytes,
including event IDs, derived operations, raw candidates, output IDs and child order.

Required controls: phantom/omitted read detection; wrong source/subject association;
raw observation leakage; altered quantization input/result/order; fake draw on Auto;
missing real draw; nested/trace draw mismatch; unlabeled identity write; final-trace
failure rollback; save/restore trace continuation. All remain NOT PASSED for this profile.
