# Task lifecycle — first symbolic closure pass

2026-09-09. Agent proposal addressing task-commitment/0.1-draft decisions1–4.
**Not whole-shape accepted. No permanent numeric allocations or implementation.**

## Proposed canonical payloads

Use the six-field TaskCommitmentSpec in the content/topology review. All fields are
required and ordered there. A TaskCommitmentKey has CharacterId then TaskReferent.
TaskCommitmentState has one map, Commitments, from that key to TaskCommitmentStatus.

TaskCommitmentStatus is a closed union:

| Variant | Required payload | Forbidden payload |
|---|---|---|
| Open | none | ObservationRef, ObservedAt |
| PerceivedSatisfied | ObservationRef, ObservedAt | none |
| DeadlineMissed | none | ObservationRef, ObservedAt |

ObservationRef is exactly the existing237 Observation variant, not an arbitrary
character-evidence union member. ObservedAt is the admitted203 historical instant
and must lie in the task window. DeadlineMissed's exact deadline is already in the
immutable governing spec; do not store a second deadline in status. Status has no
fresh occurrence identity. The task referent and normal scheduler/trace identifiers
are sufficient for this persistent result.

There is **no semantic lifecycle output** in the first profile. Both settlement
transitions have OutputDefinitions={}. Retirement is retained status, not a new
universal learning-evidence record. Later memory/identity consumers need an explicit
status-reading or evidence-production seam; trace cannot supply it implicitly.

## Exact content receiving grammar proposed

Each concrete170/1 record has the task kind and1038 StableId. All existing required
authoritative fields remain present. Its FormalSeamMappings is the one-element
canonical list containing the spec's RegistryDefinitionId. ReferencedRegistryIds
is exactly that same one-element list. ReferencedContentIds is exactly the spec's
HolderContentId. Lifecycle is the one-element list containing that spec reference.

DeclaredInputs, DeclaredOutputs, Preconditions, WorldEffects, UnitsDomainsBounds,
EpistemicVisibility, ObservationAffordances, ValidationInvariants, SourceProvenance
and ChangeHistory are empty canonical lists in this first specialization. Their
empty values do not mean the task lacks domain/lifecycle constraints: the fixed
receiving contract follows the declared spec. It rejects any other shape or extra
interpretation. The repeated reference positions serve CONTENT's declared-reference
and lifecycle/mapping obligations; the spec is the sole criterion/window authority.

This proposal must be challenged specifically against CONTENT_GOVERNANCE's requirement
to state inputs/visibility/domain. If an empty field would imply a contradictory
meaning rather than a delegated spec reference, refine the field grammar before
acceptance rather than rely on an implementation convention.

No content field contains pressure, concern, urgency, belief or a chosen action.
The initial-state rule, not an EpistemicVisibility shortcut, makes an Open task
adopted character context for its qualified holder. A third party cannot read it
because the content record exists.

## Deadline association and allocator composition

At initial run construction:

1. Validate the exact declared finite task-key set as Open, including holders,
   content/spec references and nonoverlapping windows per holder/prediction.
2. Compile original inputs through the new exact ordered-input profile.
3. In canonical TaskCommitmentKey order, allocate one ordinary shared EventId and
   EventSequence for each deadline after the original-input allocations.
4. Each deadline event has DueAt=Deadline, phase140, the declared deadline EventTypeId,
   payload=the exact task key, empty dependencies and no causal parent event.
5. Bind the complete resulting scheduled-event bytes privately to that task and
   its initial-state/model source. There is no fake parent or observation occurrence.

No runtime occurrence ordinal is consumed for deadline creation or execution. No
deadline event can be submitted as an original input or emitted by a domain handler.
Event allocation remains distinct from TaskReferent identity. Save/prefix replay
must reproduce the original-input-plus-deadline allocation order exactly.

Initial deadlines are positive because0≤ActiveFrom<Deadline. Future recurrence
windows may be dormant in S0, but their deadline associations already exist. No
dynamic adoption/recurrence is admitted by this finite profile.

## Measurement generation and target resolution

The successor M1 completion creates one additional prospective measurement-settlement
event at140 with its exact actual342 output. Existing memory formation, prediction
application and later diagnostic-read generation remain separately declared.
The permission-suppressed branch gets a corresponding empty private slot; it is not
an observation-bearing task input. Slot counts must be enumerated for the new model.

After exact generative/source admission, verify203 time equals the admitted M1
instant, use nested343/IDN, and select tasks for the qualified holder and matching
prediction criterion whose immutable window contains T. Selection ignores stored
status. Resolve all selected keys before any prior task-status evaluation.

The first profile's nonoverlapping windows allow at most one selected measurement
target. At its deadline it is excluded, so the simultaneous deadline and measurement
events cannot collide. If a recurrence starts then, measurement targets the new key.
Terminal prior status produces no change but remains an executed admitted dispatch.

## Stage and state validity

The new dispatcher must admit the explicitly enumerated combinations of existing
ADAPT batches, existing memory/prediction pairs, one prospective measurement slot
and the finite initial deadline slots. It cannot silently relax the old exclusive
dispatcher. Every group evaluates against the same B0, with source admission,
subject/key resolution and target-collision checks completed before prior evaluation.

Groups retain their own authorities and exact patches; the stage combines validated
disjoint patches, never a shared anonymous writer. No output/emitted event is legal
from the new lifecycle140 executors. Later trace/invariant failure rolls back all
groups and their private associations together.

Open at T≥Deadline is allowed structurally during an instant but is never active.
At quiescent commit, every such instance must be terminal, since its authenticated
deadline event must have executed. Do not incorrectly apply that quiescent invariant
at the new target instant before its legitimate deadline handler runs. This differs
from REG's frozen retained-D pre-instant validity requirement and must not change it.

## Trace and persistence

Measurement settlement records source342, actual IDN and selected prior-status
reads, exact patch/diff and no semantic output. Deadline settlement records no source
occurrence, the exact key input, its actual status read and patch/diff. Full model/run
identities remain the successor's, not old component-model identities.

Terminal observation provenance is stored in status and authenticated by original
S0/input prefix replay. Structural state validation checks variant/roles/window;
it cannot prove that arbitrary caller-supplied support genuinely occurred. Whole-save
equality and pending-association bijections supply that separate generative proof.

## Remaining shape work

The current draft still needs complete transition-registration/target-projection
records, role positions, exact error names, the exhaustive dispatcher matrix and
the finalized CONTENT field interpretation. The new prospective route requires its
own explicit shared-topology extension. No numbering, activation or TC-A..L pass is
authorized by this first closure pass.
