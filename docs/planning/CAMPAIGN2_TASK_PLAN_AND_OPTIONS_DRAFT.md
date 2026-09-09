# Adopted task instructions and procedural candidates

Status: DRAFT — internal proposal, not shape acceptance or allocation.
Seam versions: task-plan-context/0.1-draft; task-motive-context/0.1-draft;
task-option-construction/0.1-draft.
Architecture: sections10–13; prospective plan → candidate options; motivational
pressure remains distinct from option availability and arbitration.
Dependencies: task-commitment/0.2-candidate; task workspace/appraisal/concern drafts;
PRJ/IDN/VAL/WRT; an exact protocol-action definition contract still to be specified.

## Purpose and required distinctions

An adopted instruction says what to try for one concrete task. It is neither a
current intent nor a belief about efficacy. An available definition is not adopted
knowledge. A plan may be absent while a task remains adopted and motivating. Two
tasks may offer the same concrete action without creating two lottery tickets.
Retirement removes current task eligibility without deleting historical plan context.

This is the narrower procedural bridge described in the prior research disposition.
The current measurement forecast is not action-conditioned. No handler may look up
world effects to infer which action will move a reading into the desired interval.

## Proposed state representation and actual substrate finding

Preserve TaskCommitmentStatus/372 and the existing Commitments field of root373
unchanged. Propose a successor schema for TaskCommitmentState/373 adding a separately
named AdoptedInstructions map. Its field number is **unallocated**. Do not silently
insert a plan field into372 or change the old373/schema1 descriptor.

The new map uses the existing TaskCommitmentKey/371 and a new symbolic
AdoptedTaskInstruction value containing only PlanInstructionDefinitionId. The latter
uses existing DefinitionId/1027, narrowed by the receiving compiler to the exact
new plan-instruction registry kind. No new task, procedure or occurrence namespace
is needed merely for this reference. Existing ProcedureId/1034 remains the ADAPT
competence/practice discriminator and is not silently redefined as a plan record.

In this first context version, the added map is immutable after S0. Declare its
exact pattern through ReadOnlyStateFamilyDefinition/262, with record key371 and the
new record value grammar. The actual stateModel compiler admits disjoint writable
and read-only field patterns within one root. Thus field1 can remain owned by the
task lifecycle while the new map remains immutable. Do not add it to a mutation
authority's owned leaves or allow lifecycle writes to replace the entire root.

The prospective family remains explicit in the successor topology, now including
both materialized leaves under the same root. Its mixed writable/read-only closure
must receive actual construction tests before acceptance; it is not a reason to
hide plan context as undeclared infrastructure. The predecessor model keeps its
one-field root and rejects the new field. Model/run identity and prefix restore
must distinguish the profiles even where their old state entries happen to match.

Initial plan keys are a subset of the actually adopted task keys in S0. Each value
resolves to a declared instruction. Removing a task from S0 while leaving its plan
binding is invalid. Later terminal task states may retain their original binding;
terminal status does not authorize plan erasure, resurrection or a new adoption.

## Symbolic model and output records

Fields below are ordered, symbolic and unallocated:

* PlanInstructionDefinition: ProtocolActionDefinitionId.
* AdoptedTaskInstruction: PlanInstructionDefinitionId.
* TaskMotiveDefinition: BasePressure, Enabled.
* TaskMotiveItem: TaskCommitmentKey, RawPressure.
* TaskMotiveContext: MotiveContextOccurrenceId, Concern, Motives.
* ProceduralCandidateKey: CharacterId, ProtocolActionDefinitionId.
* ProceduralCandidateOrigin: TaskCommitmentKey, PlanInstructionDefinitionId.
* ProceduralCandidate: Key, Origins.
* TaskCandidateOptions: CandidateOptionsOccurrenceId, MotiveContext, Candidates.

Concern and MotiveContext are exact nested admitted outputs, not reconstructed
copies or independent evidence. Motives is an ordered list in workspace task order.
Candidates is sorted by complete canonical candidate key; Origins is a canonical
set with one member per actual task/instruction binding. There are0..2 candidates
and0..2 total origins. There is one output occurrence per transition, including
empty results; candidate keys and origins receive no separate occurrence IDs.

ProtocolActionDefinitionId also uses existing DefinitionId/1027 with an exact
supported registry-kind/schema/version check. The first actions are zero-argument
protocol instructions for the derived actor. Consequently the complete action tuple
in this version is exactly actor plus action definition. There is no hidden argument
list or discarded target. Adding arguments requires a successor equality contract.
The actual action-definition semantics are still a blocking specification task;
these references do not authorize empty handlers or invented execution defaults.

## Motive transformation at60

Authenticate the live TaskConcern from its actual50 parent. Use its workspace's
selected task order; it already proves adoption and applicability at generation.
No character-state or world/REG read occurs here. Read the single immutable
TaskMotiveDefinition. BasePressure is an exact rational with0<P≤1, shared by all tasks.
Enabled=false emits an empty Motives list. Otherwise emit one item per selected task
with exactly P. No forecast agreement, intensity, history count or ID spelling changes P.

Preserve the exact Concern in the output even when base motivation is ablated.
This is necessary to keep option availability independently testable. A disabled
base source must not delete the maintained task context or its adopted plan.
Within, Unknown and Known(0) concern do not remove an enabled live obligation.
Perceived satisfaction and expiry remain exclusively the lifecycle's responsibility.

Emit one context and one exact generated candidate-construction child at70. No
state write, RNG, rounding or belief update occurs. A diagnostic control flag is
not a psychological assertion that the character has no obligations.

## Candidate construction at70

Authenticate the exact live motive context. Resolve the retained task keys from
the nested workspace, independently of whether Motives is empty. If PlanAccessEnabled
is false, perform no plan-state reads and produce no candidates. Otherwise read only
each retained task key's immutable instruction binding, once, in workspace order.
Absence yields no candidate for that key. Invalid value/reference is an error,
not absence or a fallback instruction.

Resolve each present instruction to its declared zero-argument action definition.
Derive the actor only from the authenticated workspace subject. Structural action
admission must be independent of preference and of later world interference.
It means the protocol can be attempted, not that the attempt will succeed.

Deduplicate by complete ProceduralCandidateKey. Union all distinct origin bindings
for that key. Two tasks offering one action yield one option with two task origins;
two different actions yield two options. Neither deadline nor concern chooses which
candidate survives. Empty output remains empty: no implicit default, idle action or
lowest-registry-row choice is introduced.

Emit one CandidateOptions output and a generated raw-signal/Reason preparation child
at80. Exact downstream registration is still required before whole shape acceptance.
Do not route this output through EVID or directly to execution.

## Read, write, identity and provenance boundaries

The motive stage has ReadDomain={} and WritableStateFamilies={}. Candidate construction
has only the new immutable plan-binding pattern in ReadDomain and no writes. No new
IDN lookup is needed: the authentic workspace already contains the derived holder.
Its371 keys must still satisfy their two RecordField roles; no StateMapKey workaround.

Trace actual present/absent plan reads and their exact accessor, plus immutable
definition operands. Do not report a skipped plan read. Output occurrence allocation
uses the shared279/278 rules, not a new allocator. The original observation support
stays inside the single nested workspace prediction. Neither a motive-context ID
nor an option-set ID becomes an independent observation atom.

## Reason linkage and deliberately unchosen mathematics

Only an option's actual Origins may link a task's base item to that option. Base
sources use Commitment channel and the concrete task referent. Deduplication of the
option does not merge distinct task reasons. Emit no duplicate base for one origin.
An empty observational basis for adopted context does not permit duplicate source
admission.

Concern is a separate non-generating source for the same task/option context. Its
support is the existing prediction observations, not the concern occurrence. Standing
identity is another distinct modifier, never a base source. TRC-004 and the retained
reason/dice contract must close their exact source roles, coverage and conversion.
These stages must be able to produce available options with no active reasons when
base motivation is ablated. Empty-option and no-active-reason outcomes must remain
distinct in arbitration; neither may trigger an arbitrary choice or RNG call.

## Timing, totality and failure

The source chain is40 workspace →50 appraisal →50 concern →60 context →70 candidates
→80 reasons. All are later phases/sequences with actual parent binding. No140 write
feeds an earlier same-instant read. The new plan state is immutable, so no ORD-001
decision is needed. Status changes remain at140; deadline-ineligible tasks were
already excluded by the workspace at40.

Finite lists and exact reference domains make both transformations total. Invalid
sources, roles, state, definition kind, output coverage, child binding or occurrence
allocation abort the whole instant with the existing owning failure category. Private
associations and all allocation/state/trace/output changes roll back together.
Restore must replay the original S0/input prefix, including original plan bindings.

## Controls, inherited obligations and remaining gates

Freeze as proposed vectors TP-A..L: explicit adoption; missing plan; opposite-kind
and orphan references; immutable plan preservation through retirement; two distinct
options; same-action origin union; base-ablated but available options; unknown/within
forecast preserving live pressure; missing/forged source before reads; no truth/REG
or efficacy lookup; rollback/full-prefix restore; source duplication and default-choice
substitutions. All remain NOT PASSED.

MEC-011 availability/relevance and MEC-020 non-Need commitment pressure are PORT/CONTROL
obligations. MEC-012..022 reason/dice/identity remain mandatory. The historical
fulfillingAction mapping is a control for origin attribution, not learned efficacy.
General planning, dynamic plan acquisition/revision, action-effect learning, skill
success and social fulfillment are deferred with their owning later seams.

Before shape acceptance: exact action protocol semantics; root successor and topology
schema closure; canonical role/projection/transition/occurrence registrations; TRC-004
and raw-signal/Reason output closure; successor input/trace/persistence packaging.
No permanent number or implementation is authorized by this draft.
