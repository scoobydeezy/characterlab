# Formation governance component checkpoint

2026-09-12. Implements [formation-governance-component/0.1-candidate](../formal/FORMATION_GOVERNANCE_COMPONENT.md)
under [bounded-run history A](GENERAL_ATTENTION_ACQUISITION_HISTORY_RESOLUTION.md).
[Eight tests pass](FORMATION_GOVERNANCE_TESTS_REV2.json). Revision1 remains historical;
revision2 moves an intentionally malformed input into a variable so TypeScript permits
the runtime negative test without widening the production API.

The tests cover immediate loss with replay rejection, opaque source ordering, absent
success history, exclusion of novel sources even with zero successful rows, later loss,
no resurrection, subject/kind mismatch, identity uniqueness, unknown survivors, payload
field rejection, detached immutable results and input preservation on failed plans.
The supplied domain is itself bounded and unique. History rows never disappear.

These are pure metadata operations. The structuredClone continuation case is not a
canonical persistence proof. Domain membership and prior state are supplied by a trusted
caller; public admission/PRJ, immutable run binding, actual allocator nonreuse and
transaction rollback require integration. No character-visible admission event is emitted
by this component, but public upstream exclusion has not yet executed.

Next: bind the source-domain envelope and metadata carrier in the complete symbolic
owner/state packet, preserving exact distinct-source limits even for never-successful
sources. Predeclared finite universe and bounded dynamic enrollment are different
packaging mechanisms; the current pure component only supports a supplied fixed universe.
Do not silently derive future source IDs from their numeric magnitudes. No permanent
allocation, public history codec or whole General Attention qualification follows.
