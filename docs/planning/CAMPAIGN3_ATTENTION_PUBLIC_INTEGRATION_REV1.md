# ATTN public integration inventory and adversarial review

2026-09-11. `attention-public-integration/0.1-draft`, revision1.
**Public integration design checkpoint; NOT whole-shape accepted.**
No allocation, model freeze, canonical runtime change or AT2 PASS is authorized by
this document. It completes the public behavioral inventory and identifies the
remaining declaration gate explicitly, rather than treating component success as
registration readiness. The machine companion is
[ATTENTION_PUBLIC_INVENTORY_REV1.json](ATTENTION_PUBLIC_INVENTORY_REV1.json).

## Authority and forward refinements

The North Star's availability/quality separation and the Architecture's Perception /
Attention box govern this experiment. This is post-perception active control only.
MEC-005 remains CONTROL+CONTRACT; MEC-007 and CTL-004 remain CONTROL. Residual-pool,
multiplicative salience, affect feedback, encoding and retrieval remain deferred with
their original meanings. No ATTENTION corpus verdict follows from this experiment.

Consume [source revision1](CAMPAIGN3_ATTENTION_SOURCE_CLOSURE_REV1.md) and the accepted
[selection component](../formal/ATTENTION_SELECTION_COMPONENT.md). Preserve the
canonical-reference-order correction and all historical receipts. Source revision1
supersedes closure revision2's proposed use of `projectEventRoleEvidence` before a
track exists. The actual new observation projection freezes223 at10; actual binding
compilation consumes it at12. No downstream stage rereads truth.

**Subject decision:** this first public diagnostic is observer-only. Every cognitive
output has the admitted ObserverId; no record contains CharacterId. PRJ requirements
are empty. This explicitly narrows the component contract's prospective public
PRJ/IDN attachment statement; that statement is not authority to invent a character
subject for this diagnostic. The accepted component mathematics/access API is
unchanged. Any later character-state consumer must obtain its CharacterId through
accepted PRJ/IDN. Neither a duplicated roster nor receiving registration515 is used.
This refinement must be included in eventual whole-shape acceptance, not silently
interpreted as an amendment to the already accepted component bytes.

## Exact transport and public record choices

The companion fixes ordered symbolic fields. Names are NOT allocated RecordTypeIds,
field numbers, namespace numbers or public member payloads. New record schema version
is proposed1; allocation remains separate. `existing:*` denotes an existing canonical
type, not an untyped object slot. Optional fields are absent, never null sentinels.
Lists preserve their declared semantic order; sets use canonical ordering and reject
duplicates. No unknown fields, union alternatives or transformation versions enter.

Source records retain the source revision1 meanings. These refinements remove its
shorthand: FreezeInput carries the actual observation, event transition and bindings,
not arbitrary 'completed products'. Classification has no output; its verified child
is the freeze input with the same products. The private reservation is bound to the
observation and admitted event chain; neither caller nor payload supplies ExperienceId.
RoleBatchInput carries the frozen227; SelectionInput carries that same227 and the
complete actual240 batch, including a legitimate empty batch. Observe10 receives
actual210 from its phase0 parent, not a second truth-reference identity.

An audit row is one existing213/212 unit pair, all distinct derived roles, its
exclusion reason, optional exact priority, selected flag and exact binding/claim
references. Row order is canonical unit-key byte order, independently of selection
ranking. Eligible rows have a priority; excluded rows do not and cannot be selected.
MissingRole, MultipleRoles and UnsupportedRole remain distinct. Equal-priority
control changes eligible priorities to1; unlimited control retains role priorities
and bypasses only the capacity truncation. Algorithm and capacity are committed
policy data, never fields accepted from a run original.

SelectionAudit has one new symbolic SelectionOccurrenceId. Its source union is
exactly ExperienceSource(existing ExperienceId) or EmptySource(existing ObservationId).
EmptySource has zero rows. ExperienceSource may have zero eligible/selected rows;
K0 never converts it into EmptySource. Role/binding references use existing237.
No audit/receipt/view variant is added to CharacterEvidenceRef.

SelectedEvidenceView has no independent allocated identity. Its selected units carry
only existing224/240 values, grouped by their existing unit key. Units are in selection
rank order; bindings and claims within a unit use canonical237 reference order. It
contains no source experience, full audit, observation envelope or resolver.
Selection emits exactly one audit as output and exactly one view as child payload.
The scheduler binds their common selection occurrence; the view is not another output.

ProcessingReceipt has one new symbolic ProcessingOccurrenceId, the selection ID,
observer/time and the exact existing224/240 values actually read. ReadValues are
ordered by canonical237 references across the selected set. This list is an
operational read receipt, not another production of the referenced evidence. Empty
selection emits a receipt with an empty list. No evidence/learning output is inferred.

The consumer must request every selected binding/claim exactly once. Its private
one-shot ledger must equal the expected selected set before a receipt can succeed.
An omitted, repeated, unselected or observation-reference read fails; failure expires
the capability too. Serialization never serializes a live capability. The adapter
constructs it from the authenticated view, invokes the accepted component, verifies
the complete read ledger and closes it on every exit. It exposes no source archive,
audit access, generic callback, model lookup or authoritative state object.

## Registered event graph and occurrence/output ownership

The companion contains ten distinct stage registrations, including the two selection
branches. Exactly one original at positive DueAt is admitted. All children share that
instant, are allocated by the scheduler and bind their actual immediate parent.
Only the world stage accepts an original. The empty branch is World→Observe→EmptySelect
→Consume. The positive branch is World→Observe→Track→Bind→Classify→Freeze→Role
→PositiveSelect→Consume. Phase40 children have later EventSequence; phase150 is never
schedulable. Recognition20/21 is neither reassigned nor implicitly scheduled.

Parent authentication binds model/run/instant/event coordinates, exact canonical
payload, complete expected output batch and branch. Source wrappers are assembled
inside the factory from those completed outputs. Supplying matching IDs or bytes
at a public endpoint cannot manufacture admission. Any retrieval of older source
products is infrastructure-only and limited to this original's authenticated chain.
No such archive enters a character transformation.

World allocates existing WorldEventId then three EventBindingIds in existing compiler
order. Its single210 output contains the three211 values. These nested allocations
are accounted for explicitly and are not three additional output records.
Observe allocates ObservationId first; positive then EventDetectionId, visible
DetectionIds in detector order and the conditional ExperienceId reservation last.
These detection IDs are nested values. Freeze settles that reservation exactly once.
Track allocates observer-file ordinals under SEM ownership, not runtime occurrence
slots. Its outputs are event transition219 then track transitions217 in detector order.
Bind outputs224 in the actual compiler's canonical order. Role outputs240 in
canonical unit-key order; derive each unit with the actual unchanged initial rule.
Positive selection and empty selection each allocate one SelectionOccurrenceId;
Consume allocates one ProcessingOccurrenceId. Wrappers, keys, views, audit rows and
read values allocate nothing. No reuse of unrelated decision/option namespaces.

For n visible ports and q derived claims, positive source totals are7 events,
4+2n+q outputs and7+2n+q runtime slots, where1≤n≤3 and0≤q≤n.
Whole positive totals are9 events,6+2n+q outputs and9+2n+q slots; maxima9/15/18.
Empty totals are4 events,4 outputs and7 slots. Both controls preserve graph/allocation
bounds even when selected sets differ. Proposed settlement work limit9 counts actual
scheduled events, not output records. Work8 is the positive-path negative control.
These are checked graph bounds, not executed scheduler qualification.

## State roles and access

The exact initial state is empty. Only existing roots241 and242 are admitted.
Track reads the admitted observer's two absent counter paths and checks absence of
the newly proposed active-file keys before insertion. Local sequential tracking
operations use staged state; the final patch is a single canonical patch. The trace
read ledger records authoritative pre-state reads, not fictitious extra reads for
local intermediate counter values. Root241/field1 ends at n and242/field1 at1
under the existing zero-based next-sequence semantics; active memberships contain
the actual n continuant IDs and one event-file ID. Final values must also equal
`perceptualStateEntries` of the actual SEM operations, rather than trusting this
closed-form check alone.

Counter paths use ObserverId map keys and unsigned-counter values. Active paths use
exact existing212 or213 record keys and true membership markers. Existing
`authority/perception` owns all four leaves. Only this stage has their write
patterns. No deletion, unrelated observer or recognition-state entry is admitted.
State-key grammar supports these record keys (`stateModel.ts` tag2); no new root or
key representation is needed. Read accessor members still require explicit symbolic
declarations and later member allocation; they cannot be invented by runtime code.

All other stages have empty persistent read/write domains. Source truth and selected
evidence are input reads, not StatePaths. In particular `ActualReadRecords` in trace160
stays empty for selector/consumer. Selected reads appear solely in ProcessingReceipt.
No belief, memory, value, habit, relationship, identity, body or task state is admitted.
No RNG, quantization, saturation or approximate priority arithmetic is involved.

## Standard trace and save closure

Use existing trace160, not a parallel trace. RecordKind is the actual stage EventTypeId.
All19 fields must be independently reconstructed and checked against admitted facts:
trace version; model; run; event; seam; seam version; kind; subjects; source IDs;
registered state read domain; actual state reads; input; outputs; random draws;
quantization; patch; structural diffs; emitted children; invariant results.
Subjects are empty for World and the single admitted ObserverId for subsequent stages.
Source IDs are empty for World; WorldEventId for Observe; ObservationId for Track,
Bind, Classify and Freeze; ExperienceId for Role; ExperienceId plus all actual
CausalRoleEvidenceIds for PositiveSelect; ObservationId for EmptySelect;
SelectionOccurrenceId for Consume. Source IDs are canonical sets. Every nested
binding source remains in its existing SEM provenance, not copied into a second graph.

InputProjection is the actual admitted payload. OutputProjection is the complete
ordered output batch, including the empty batch at Classify. Track's patch and
structural diffs are derived from the real canonical state commit; other patches
are empty. Random/quantization/invariant-result lists are empty in this first profile.
Independent validation still checks all prescribed invariants before commit; an empty
trace list is not permission to skip those checks. EmittedEvents are the actual
allocated children, exactly one except terminal Consume. No trace-owned truth
projection is passed into selection or consumer merely because trace infrastructure
can see it. Trace remains an observer-independent diagnostic surface.

Public construction accepts a frozen data-only model source and plain byte arrays
for S0, ordered originals and seed, copied before validation. No supplied functions,
accessors, handler map, state object or registry callbacks are accepted. Old factories
remain exact and reject the new version. Originals cannot contain computed evidence,
selected flags, output IDs, channel overrides or psychological priorities.

Save uses existing132/complete-prefix semantics. There are exactly two successful
whole-instant prefix lengths: zero trace rows and the completed branch's4 or9 rows.
No save contains live selected capabilities, staged reservations or partial phase
completion. Restore verifies model/S0/input/seed commitments, replays actual originals
through the same factory and requires exact whole-save equality. It rejects any
edited output, queue, trace, allocator, tracking state or branch, even if local record
validation succeeds. Failure at any stage rolls back the entire instant, including
tracking, observations, reservations, outputs, children, trace and allocator cursors.
Failure diagnostics stay outside committed state. Existing failure classes must be
preserved at their owning validators; future allocation must list any new diagnostic
member rather than smuggling one in under generic text.

## Adversarial disposition and remaining expressibility gate

Inspection found no need for a new state family, provenance graph, phase, numeric
observation unit, PRJ mapping or per-unit identity. There IS an implementation gate:
existing `compileTransitionAdmissionV04` closes over Campaign2 schemas, learning routes
and specific producer alternatives. It also demands occurrence rules for every input
and output. It cannot admit identity-free transport wrappers or this state-writing
tracking batch unchanged. Existing receiving515 is likewise a different fixed shape.
Do not weaken either compiler or forge wrapper identities to get through it.

The chosen resolution is a dedicated finite attention registration/compiler surface,
using existing scheduler/state/VAL/occurrence primitives. The companion specifies its
required behavioral fields and stages, **not yet a complete canonical declaration**.
Before whole-shape acceptance, one declaration pass must close:

1. Exact registration/producer/output union records and fields, including nested
   allocation paths, conditional experience reservation and identity-free transports.
2. Exhaustive canonical role positions and symbolic member inventory (stage/seam,
   definitions, event types, read accessors, validators and two occurrence families).
3. Six-slot registry compatibility, inherited schema coverage, exact state read-domain
   accessor declarations and finite scene/channel/policy content recipe. Every
   production referent must have the accepted governed content origin.

This is a declaration/packaging gap, not a request for new psychology or authority
from the user. It is the next independent work item. No permanent numbers should be
chosen to paper over it. Exact model commitments follow separate allocation review.

AT2-A..N remain frozen NOT PASSED. Future runtime evidence must exercise both branches,
all three policies, K0/1/2, equal-role ties, unresolved/unsupported roles, hidden role
substitution, actual private ingress rejection, selected-only read attacks, trace
corruption, work8/9, every stage's rollback and both successful prefix restores.
Multi-role exclusion retains component-positive/profile-exclusion scope; the one-role
per port public grammar must not be widened merely to manufacture that witness.
Preserve all prior EMB fingerprints and corpus0.27.0 exactly.
