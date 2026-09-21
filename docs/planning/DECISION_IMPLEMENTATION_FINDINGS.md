# DECISION implementation findings

2026-09-21. Preservation record; no independent qualification verdict.
RO-C3-018 carries the component/public distinction and qualification gate;
RO-C3-020 carries calibration and representation limits. Frozen model/plan and
failed test receipts are retained rather than overwritten.

## DECISION-IMPL-001 — tie transcript extraction
The earlier component receipt DECISION_COMPONENT_TESTS_REV1.json passed3/4 tests.
The harness projected423 field2 (tie leaders) instead of field3 (actual draw).
Accepted arbitration was correct. DECISION_COMPONENT_TESTS_REV2.json passes29
component/inherited checks after correcting extraction. The component experiment
retains576 cases/576 exact fresh replays, never relabeled as public runs.

## DECISION-IMPL-002 — failed runs cannot create continuation saves
DECISION_PUBLIC_TESTS_REV1.json passed8/22 tests. All14 rollback cases reached
their intended boundary and compared rollback state/outputs/trace/allocators,
then wrongly requested a continuation save after the scheduler became Failed.
The substrate correctly rejected this request. Changing the persistence contract
would have weakened a working boundary merely to make a test pass.

The runtime's internal diagnostic snapshot now exposes a copy of its committed
address list. Rollback tests compare it before/after failure and explicitly assert
that a failed run cannot produce a continuation save. This diagnostic is not a
character view or state source. No frozen contract, model, plan or draw law changed.
DECISION_PUBLIC_TESTS_REV2.json passes22/22, including all13 stages and final commit.

Two initial TypeScript construction errors were also corrected before public test
execution: the inherited record helper takes ordered arrays, not field maps; mode
encoding now uses explicit exhaustive mode comparisons. No behavioral receipt or
frozen model was produced from those rejected TypeScript constructions.

## Bounded controls and limits that must survive closure
Significance in this experiment is the inherited bounded minimum reason-mass
proxy. Equal translation of both d4 distributions raises it without changing
win probabilities, faces or selected option. This does not establish a general
psychological significance scale or resolve multi-option metrics.

OpaqueWeightedChoice is an exact marginal sampler only for the registered balanced
unresolved cases; its one draw cannot supply independent reason-face attribution.
IntentEqualsOutcome is the historical collapse comparator: after admitted failure
it keeps outcome without a historical expression. Prospective intent still exists
to drive the attempted action, and research diagnostics remain intact. The control
does not read hidden execution truth to decide what the character retains.

The history root is a bounded append-only record, not a general memory/retrieval
or identity learning law. Character-safe output projection is a closure test and
inspection API; it is not an alternative state authority. Consumers read owned
history, not the research output archive. Wider memory, attribution, coercion,
control/uncertainty and arbitrary opaque-weight sampling remain unqualified.
