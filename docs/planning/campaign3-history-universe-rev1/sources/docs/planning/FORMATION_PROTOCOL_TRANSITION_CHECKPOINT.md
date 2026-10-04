# Protocol transition validation checkpoint

2026-09-12. [Twenty-six combined tests pass](FORMATION_PROTOCOL_TRANSITION_TESTS_REV2.json),
including seven new exact-candidate cases. Implements
[formation-protocol-transition-component/0.1-candidate](../formal/FORMATION_PROTOCOL_TRANSITION_COMPONENT.md).
Revision1's twenty-five-test receipt is preserved. Self-review added prior-state validation
before enrollment, preventing incoming sources from repairing an already-invalid history.

The validator rejects empty-map resets, erased successful history, changed identity/time,
invented survival/loss, skipped required enrollment and private extra fields. It permits
unchanged state and governed complete loss, without mutating caller input. Generic
non-removal authority checks alone cannot establish these invariants.

[Source/hook inventory](FORMATION_HOOK_INVENTORY_REV1.md) now explicitly distinguishes
completed EmptySource selection from no selection occurrence. Eight static corruptions
reject; they remain planning consistency tests rather than public compiler vectors.

Actual admission/output binding, complete owner-result authentication, fixed model N,
public protocol classifier and descriptor codecs remain unqualified. No root allocation,
SchedulerSave change or public factory hook was implemented. Next: complete the exact
closed hook descriptor/result projection and integrate atomic protocol/owner settlement.
