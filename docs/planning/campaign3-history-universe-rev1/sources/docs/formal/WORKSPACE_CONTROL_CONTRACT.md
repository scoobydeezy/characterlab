# Bounded workspace/control public contract

Version: workspace-control/0.1-candidate. Status: ACCEPTED before implementation,
2026-09-21. LOCAL DISPOSITION — no owner ruling required.

## Authority and scope

Implements Architecture §§10–11, North Star §§17.1–17.3 and PHEN-WORK-001.
This is a controlled instruction-card experiment, not general perception, episodic
retrieval, inhibition, fatigue, reappraisal or planning. Existing task-workspace and
AFFECT contracts and their frozen models are unchanged. A remembered intention is
an adopted task371/status372 in root373. Workspace access never adopts a task.

One observer and its semantic CharacterId1002; two initially adopted tasks A/B,
active on [1,6), immutable instructions mapped to two action definitions. Third
item C is a visible neutral instruction card with no motive ground. All three card
identities use an explicitly identity-establishing controlled channel. This does
not claim ordinary fallible recognition. A physical card has identity1..3, a visible
flag and displayed priority0..3. The board has visibility, a reminder lamp and a
private truth bit. The lamp is an independently observed reminder of A, not an
instruction to adopt it. Hidden cards, lamp behind an invisible board and the
private bit are excluded by the source projection. Priority is a controlled display
operand, not importance, truth, belief, or a learned exchange rate.

## Public ingress and ordering

Data-only exact model bytes, exact initial state, seed and at most eight ordered
physical board inputs, strictly increasing integer instants1..10. Reject duplicate
card identities, malformed fields, callbacks and unknown fields. No caller supplies
a selected set, learned state, reason, cached intention or safe observation.
Every original schedules workspace40 and physical-board110. The latter emits the
safe display at120, then an observation-journal append at140. Workspace40 consumes
only the latest committed safe display from an earlier instant. No current-lane
belief update, same-instant observation access or ORD-001 resolution is implied.
Raw51 → reasons52 → decision60 → intent70 are generated descendants of workspace40.
Two privately associated deadline140 events at6 retire Open tasks to DeadlineMissed
through authority/prospective-commitments. The half-open window excludes tasks at6
even before their deadline patches. There is no fulfillment source in this profile.

## Ownership, actual reads, and trace

Root771 field1 maps the sole character to its ordered safe-display journal (≤8),
owned by authority/workspace-observation. This is a bounded retained observer-side
source, never an omniscient trace iterator; no journal entry becomes a new sensory
sample during reconstruction. Root772 field1 maps the character to a cached active
item list, owned by authority/active-workspace. Only StoredSet writes/reads this
cache. Both roots start absent. IndexedReplay has no active-set state.
Workspace reads the journal, both exact task leaves and, for StoredSet alone, cache.
Append reads/writes only journal; deadline reads/writes its own task. Downstream
reason consumers receive only the generated workspace and its access projection.
Trace160 records these actual reads, source occurrence, candidate and selected sets,
prior active set, control operation, retained statuses, patch and generated children.
No downstream character consumer reads trace, physical board or another holder.

## Exact candidates and control

Parameters: candidate1..6, capacity0..3, maintenance-support Boolean. Candidates:
1 StoredSet; 2 IndexedReplay; 3 StatelessPriority; 4 UnlimitedWorkspace;
5 AvailabilityEqualsAccess; 6 ImmortalGoal. Candidates3..6 are diagnostic controls.
Candidates2..6 derive prior access by replaying only safe journal entries; candidate3
explicitly discards that prior. For prefix frames f0..fn, reconstruct earlier choices
for each fj with j<n at time f(j+1).At, in order, starting empty. Reuse immutable
adoption and the [1,6) window; this is sound because deadline is the sole lifecycle
transition. The final selection uses fn at the current workspace instant. An empty
journal produces empty access. Cache and reconstructed selection must agree under
matched valid inputs; no separate maintenance-state necessity is assumed.

Eligible items are the latest visible cards: A/B only if adopted Open and inside
their window; C always. ImmortalGoal alone deliberately ignores retirement/window.
If maintenance support and A was previously selected and remains eligible, protect
A first; otherwise no protection. StatelessPriority has no prior protection.
Sort remaining eligible items by decreasing displayed priority, except a visible
reminder gives eligible A priority4. Break ties by increasing item identity (only a
canonical tie, never intensity). Select at most capacity, including the protected
slot; capacity0 is always empty. UnlimitedWorkspace alone uses capacity3.
Control trace:0 none,1 protected A,2 reminder reinstatement (unprotected eligible A
with lamp), with protection precedence. No additional control-cost scalar exists.
AvailabilityEqualsAccess keeps this selected set but illegally exposes all eligible
task items to reasons; its failure is measured at the access projection.

## Reasons, choice, and preservation

Only selected A/B are accessible plan operands (except the named negative control).
Each accessible task supplies one base signal402 of exact strength1, own task ground,
own action, empty evidence basis400. C supplies none. No displayed priority becomes
reason strength, and maintenance creates no independent motive. Compile inherited
reason-dice/0.1-candidate nuclei and exact arbitration with committed dice437 and
arbitration440. Preserve addressed reason-face draws and fair ties, exact distributions
and chosen-only intent. Empty grounds produce no chosen option. This experiment
ends at intent: no execution or reinforcing-identity update is asserted or retired.

## Serialization, failure, identity and bounds

WORKSPACE_CONTROL_ALLOCATION_TABLE.json fixes every new schema/field; inherited
typed fields remain closed. Namespace1152 is runtime output occurrences only.
Exact canonical encoding, integer priorities, no floating point/rounding. Model
identity commits contract version, parameters, content, registrations and ownership.
Frozen cohort allowlist gates public preparation; run identity commits S0, all inputs
and seed. Generated events authenticate complete private event fingerprints and
parents; original/deadline associations are immutable. Scheduler transactions roll
back state, outputs, RNG trace, children and allocators on failure; failed runs are
terminal. Maximum work per instant10 (8 ordinary stages plus two deadlines).
Save/restore reexecutes complete prefixes and requires whole canonical save equality,
including queue, allocators, trace and draws. Reject partial instants and forged saves.

## Proof and remaining limits

Freeze model/input cohort before verdict. Require overload (three eligible vs capacity
one/two), independent capacity/distractor/support interventions, protected/unprotected
displacement, unchanged retained task bytes while inactive, cue return after loss,
expiry then inert cue, hidden-source noninterference, wrong-holder/source negatives,
rollback and every successful prefix continuation. Compare StoredSet/IndexedReplay
by exact workspace/reason/choice/intent projections, allowing cache read/write and
model-identity differences only. Negative controls must fail named contrasts.
No universal indexing, maintenance law, cost, fatigue, inhibition, strategy switching,
rumination, ordinary reminder recognition or unlimited-history claim follows.
Reopen on larger pools/history, new lifecycle transitions, another maintenance law,
control ordering or any required Brief12.6 phenomenon outside this bounded corpus.
