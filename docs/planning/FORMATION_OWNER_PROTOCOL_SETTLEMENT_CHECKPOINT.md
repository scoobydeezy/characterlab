# Owner-result binding and atomic protocol settlement

2026-09-12. Implements [formation-settlement-component/0.1-candidate](../formal/FORMATION_SETTLEMENT_COMPONENT.md).

[Fourteen join/validator tests pass](FORMATION_OWNER_JOIN_TESTS_REV2.json), including
seven join cases: actual partial/complete loss, copied/foreign handles, repeat/closed
handles, admitted-empty behavior, fresh metadata mismatch, input detachment and prior
memory/history correspondence. The failed revision1 receipt is preserved: its mutation
witness incorrectly assumed the first retained canonical unit was alpha. Revision2
retains both units and looks up alpha explicitly; no policy change was needed.

[Nineteen combined scheduler/join tests pass](FORMATION_PROTOCOL_SCHEDULER_TESTS_REV1.json).
Five actual scheduler cases cover admitted-empty enrollment without occurrence/output,
immediate complete loss with successful governance, late failure of either branch,
lifetime overflow with unchanged committed surfaces, and positive actual retention.
Failures preserve state, clock, queue, allocator, output and trace; failed runs are terminal.

The fixture's phase130 handler is explicitly a trusted protocol admission hook, not
the public write-free evidence producer. Metadata and memory are plain fixture state,
not newly allocated public roots. Public source authentication, PRJ, typed result binding,
model classification, immutable N and canonical save/load remain unqualified. Tests
do not promote FJ-A..J wholesale; they provide component and scheduler evidence only.

Remaining whole-profile review exposed an independent retrieval resource question:
event/continuant versus body recall competition has not been decided by separate
acquisition or retention gates. See GENERAL_ATTENTION_RETRIEVAL_PARTITION_DECISION.md.
