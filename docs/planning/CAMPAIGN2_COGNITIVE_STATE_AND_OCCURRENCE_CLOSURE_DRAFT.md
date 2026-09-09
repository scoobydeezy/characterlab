# Cognitive state successor and output identity closure

Status: DRAFT. Symbolic shape only. No new record number, schema version, field number,
namespace or fixed member is allocated by this document.

## Existing root successor

TaskCommitmentState remains RecordTypeId373. Its successor has two required fields:
the unchanged Commitments map<371,372> at existing field1, and AdoptedInstructions
map<371,AdoptedTaskInstruction> at a separately unallocated field. The successor
SchemaVersion is unallocated. Its old schema1 descriptor and byte interpretation
remain unchanged. A receiving registry includes the exact successor descriptor;
it cannot select a descriptor by TypeId alone where multiple versions are present.

Both maps contain at most two entries. Every key is the existing qualified371 key
for the profile holder and declared task. Instruction keys must be a subset of
Commitments keys in S0 and at every quiescent boundary. A task's terminal status
does not remove its instruction. Status application writes only existing field1;
all candidate statuses retain the complete immutable instruction map byte-for-byte.
The new map has a262 read-only pattern, no write owner and no permitted deletion.
No schema change to371 or372 is implied.

TaskIdentityState is a new symbolic root with one required Evidence field:
map<TaskIdentityKey,TaskIdentityEvidence>. It has at most one entry for the profile's
holder and CommitmentFidelity. Empty map is valid; an explicit empty history value
is invalid. S0 must contain the empty map. This root materializes the already declared
identity-disposition logical family; it does not add another logical identity family.
Identity application alone owns its new leaf. The ordered nonrecursive history,
64-entry cap and derived quantized counters are exactly the identity-history draft.

The state root grammar does not authenticate a history merely because its IDs have
the right namespace. Runtime append takes the actual admitted qualification; public
restore replays the complete prefix and compares the derived state. No public API
accepts a prepopulated identity state or a caller-provided qualified history.

## One occurrence per semantic output

Every row below registers exactly one277 output and a matching279/278 identity rule
at its occurrence field. The symbolic occurrence family is used for that output and
its references only. No inline record, candidate, raw signal, probability, distribution,
draw, state key or quantization operation allocates an occurrence.

| Producer | Output | Symbolic occurrence family |
|---|---|---|
|Workspace|TaskWorkspace|WorkspaceOccurrenceId|
|Appraisal|TaskAppraisal|AppraisalOccurrenceId|
|Concern|TaskConcern|ConcernOccurrenceId|
|Motive|TaskMotiveContext|MotiveContextOccurrenceId|
|Candidates|TaskCandidateOptions|CandidateOptionsOccurrenceId|
|Raw signals|TaskRawSignalContext|RawSignalContextOccurrenceId|
|Reasons|TaskReasonContext|ReasonContextOccurrenceId|
|Arbitration|DecisionResolution|DecisionResolutionOccurrenceId|
|Intent|ChosenIntent|ChosenIntentOccurrenceId|
|Expression|DecisionExpression|DecisionExpressionOccurrenceId|
|Qualification|DecisionQualification|QualificationOccurrenceId|
|Plan|ActionPlan|ActionPlanOccurrenceId|
|Attempt|ActionAttempt|ActionAttemptOccurrenceId|
|Execution|ExecutionOutcome|ExecutionOutcomeOccurrenceId|

IdentityApplication emits no record and allocates no output ID. ActualFactBridge
reuses307 and1118 with its existing identity rule. SEM, EVID and ADAPT retain their
existing allocations, including dispatch/evaluation outputs that are not independent
scheduled events. The private200 execution view uses the already allocated execution
ID and does not acquire an additional identity rule.

Arbitration reserves the actual DecisionResolution output identity before requesting
draws. That one reservation supplies the RNG causal root and final record; it is not
a second allocation ahead of the output helper. Failure rolls back that reservation
with the instant. Every successful no-choice branch still publishes one resolution.

Chosen-only ingress governs whether intent exists; it does not weaken ExactlyOne
multiplicity for an intent transition that actually executes. Observer permission
governs whether protocol SEM stages exist; suppressed protocol observation consumes
no padding IDs. This does not change the predecessor probe's accepted padding rule.

## Branch authentication

Repeated references to the nested source preserve its exact bytes and inherited
subject. Output validation checks the real parent registration, input schema and
private source binding before producing an output. Neither a copied record with the
right occurrence namespace nor a new ID allocated for it becomes an admitted source.
Occurrence namespace roles have no DomainValidator; semantic qualification and live
source authentication remain separate checks. Prefix replay proves persistent
references, rather than a parallel provenance registry.

Required construction controls remain unpassed: output identity map one-to-one;
wrong namespace/missing output rule/duplicate rule; no-choice exact output count;
chosen conditional ingress; resolution reservation reused by every draw; failed
post-draw instant retries with identical output identity; old373/schema1 rejection
of the plan field; disjoint status write/immutable plan; empty versus absent identity;
and independent restore rejection of forged source/history IDs.
