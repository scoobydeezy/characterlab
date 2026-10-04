# Attention join scheduler expressibility vectors

2026-09-12. Frozen substrate investigation, not a public feedback implementation.
Uses the actual DeterministicScheduler and existing test-only namespace10030, with
plain fixture payloads. No TaskConcern, CharacterId, authoritative attention state,
new canonical record or production identity is represented by these fixture values.

JXP-A: source at1/50 emits delivery at3/15; scene at3/0 emits preparation at3/40;
preparation emits join at3/40 with delivery as additional parent. Both actual parent
events have completed; the emitted parent list is exact and canonically ordered.

JXP-B: the generic scheduler accepts an already allocated future event as an additional
parent. This is expected substrate behavior, not a discovered generic scheduler bug.
It proves allocation alone does not authenticate a completed source for the join.

JXP-C: a canonical Dependencies value naming that future event is opaque data; it
does not turn the generic scheduler into a dependency-aware join executor.

JXP-D: an explicit fixture completion check rejects the future-parent substitution
and rolls back the entire receiving instant. This checks the placement of the needed
adapter guard, not public source/subject authentication.

JXP-E: delivery delayed to phase50 cannot satisfy the phase40 join. Missing delivery
rejects before selection/encoding; no synthetic earlier phase or silent fallback.

JXP-F: malformed joined payload rejects and rolls back delivery, preparation, queue,
allocators, outputs and fixture state to the committed prefix.

JXP-G: a handler failure after valid join checks has the same whole-instant rollback.

These vectors establish a feasible scheduling graph and identify the checks the
future exact admission adapter must own. They do not qualify private-cache authority,
same-run source authenticity, IDN projection, complete-prefix save decoding or affect
modulation. No global scheduler semantics change is authorized by this investigation.
