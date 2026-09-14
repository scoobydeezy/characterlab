# General attention source integration — revision 4

2026-09-13. Autonomous continuation under the escalation policy. GA remains OPEN;
no architectural decision is pending. Earlier receipts retain their original scopes.

## Executed source and cue correction

The new `local-reserve-sample-bridge-component/0.1-candidate` produces actual canonical
461/463 samples from the three-reserve source under its own exact producer version.
It reuses existing record layouts without claiming the old singleton produced them.
Separately named selector/cue entry points enforce that version; old consumers retain
their old version restriction. The bridge observes only requested known channels and
copies the observer. Unqueried channels create neither observations nor absence.

`local-reserve-opportunity-component/0.1-candidate` composes that body-only batch with
actual SEM-H reservation/freeze. Present views share one experience in either lane;
all-unavailable batches have no reservation. New gates admit an explicit null
opportunity only without present body evidence. No placeholder experience is allocated.
The composed source fixture now uses this path at its current body cue instant.

[41 current focused tests](LOCAL_RESERVE_OPPORTUNITY_TESTS_REV1.json) pass. They include
the10 source-composition checks and preservation of both older gate components.
[Five opportunity faults](LOCAL_RESERVE_OPPORTUNITY_REVIEW_REV1.json) and the earlier
[five bridge faults](LOCAL_RESERVE_SAMPLE_BRIDGE_REVIEW_REV1.json) are detected at their
recorded source revisions. The bridge review initially exposed a missing test assertion
for batch-level observer aliasing: sample records already copied that identity, but the
batch also had to detach it. The strengthened test detects removal of that copy.
The [seven old selector](INTEROCEPTIVE_SIGNAL_SELECTION_REVIEW_REV2.json) and [five old
cue](BODY_SIGNAL_CUE_REVIEW_REV2.json) faults were rerun against the shared-kernel change.
TypeScript passes after correcting the test's explicit mutable record construction.

## Formation budget and descriptors

The first composed schedule now executes a zero-capacity body selection at the cue
instant. Its actual gate returns no groups; the ordinary owner/protocol component
enrolls the completed source without adding a successful acquisition or changing memory.
Independent cue admission still recalls prior memory. Total source count is18; a17-slot
profile rejects. [Three fixture coordination mutations](GA_SOURCE_BUDGET_REVIEW_REV2.json)
detect omitted enrollment, acquisition-gated cueing and success-only budget accounting.
These are actual component compositions, not public input-compiler qualification.

The [planned budget](GA_FIRST_SOURCE_BUDGET_REV1.md) retains32 source slots. Its paragraph
describing the earlier17-formation fixture is historical; the executed18-source result
above supersedes that limitation at component scope. Whole public original/queue/work
counts still require compilation from the exact operation list.

The [protocol descriptor inventory](GA_FORMATION_PROTOCOL_CARRIER_REV2.json) contains10
records with [ten structural faults](GA_FORMATION_PROTOCOL_CARRIER_REVIEW_REV2.json).
It names exact source schema/projection bindings, the noncognitive singleton and a
payload-free actual owner-result projection. Generic ownership does not substitute
for monotone transition validation. Public runtime hooks remain OPEN.

## Goal/result closure and limits

The [goal/result checkpoint](GA_GOAL_RESULT_CLOSURE_CHECKPOINT.md) records21 symbolic
records/63 fields, narrow qualification projection and separate closed goal intervals.
No permanent allocation has been made. Neither the protocol nor result inventory is
whole-public-shape acceptance. Existing frozen contracts and corpus0.27.0 are unchanged.

The controlled four-trial fixture still uses supplied positional/selection/subject
admission, fixture retained views and a local historical qualification. Its separate
scheduler handoff fixture does not make those paths one public committed chain.
The body-only adapter cannot be reused to reserve a second experience within a combined
panel/visual/body opportunity. That combined source, exact role/registration closure,
ordinary-memory/protocol owners, result delivery authentication, canonical persistence
and corpus promotion remain the next work. Continue locally without seeking a routine
representation or finite-profile decision from the owner.
