# Active CharacterLab source

This is the clean implementation root for the North-Star Reference Scaffold.

No pre-refoundation character-model code is inherited here. Historical source is isolated under `../reference/src/` and may not be imported into this tree. See `../AGENTS.md` for the governing boundary and research direction.

## Current implementation boundary

`substrate/` contains only Campaign 0 reference/conformance machinery:

- `canonicalEncoding.ts` implements the `cenc/1` oracle and strict decoder;
- `identity.ts` implements the registered structural identity records while retaining complete manifest sources;
- `contentManifest.ts` separates authoritative content fields from presentation-only metadata before commitment.
- `random.ts` implements semantic random addresses, SHA-256-derived 128-bit candidates, bounded and weighted mapping, and explicit comparison coupling.
- `exactMath.ts` provides the reduced-rational oracle and sign-correct integer division/rounding primitives.
- `time.ts` implements checked simulation time, non-mutating analytical materialization, explicit semantic re-anchoring, and retained linear remainder.
- `scheduler.ts` implements registered phase ordering, same-instant quiescence, staged allocator/event/trace work, terminal failure, and whole-instant atomic commit.
- `persistence.ts` implements canonical quiescent saves and exact handler-registry-based continuation without serializing executable code.
- `state.ts` implements typed state paths, exhaustive mutation ownership, capability-limited read instrumentation, canonical patches, exact diffs, and canonical state restoration.
- `trace.ts` implements the committed trace envelope, separate failure-diagnostic encoding, and structural first-divergence reports with causal ancestry.
- `transition.ts` binds registered seam contracts to the scheduler so reads, patches, allocated emissions, trace, and rollback share one transaction.

`observation/` contains the accepted bounded-measurement Campaign 1 seam under immutable version identifier `observation/0.1-candidate`. `observation.ts` validates exact bounded-effect truth, compiles registered state-change channels into point/lower/upper interval evidence, distinguishes missingness from zero, and supplies a restricted identity-establishing provenance-token control. Its thin experience envelope is not a general event representation.

`semanticBinding/` contains the symbolic executable `SEM-001A..H` candidates: truth binding grammar; observer-relative continuant/event files; finite continuant and event-pattern classification; append-only continuant recognition; closed, consumer-`ReadDomain`-admitted observer-safe provenance with nonrecursive character-relative causal-role evidence; and exact current/consequence observation lanes under `ordering-phases/2-candidate`. Accepted `SEM-001I.1` fixes their canonical schema inventory, state ownership, occurrence keys, and collection semantics; accepted `SEM-001I.2` assigns the permanent IDs and union layouts. The remaining symbolic/noncanonical shapes must now be replaced and proven through `SEM-001I.3`. `MATH-006` is closed; the parent `SEM-001` remains blocked on `I.3` and the `SEM-001J` integrated phenomenon gate before later evidence-aware encoding/learning.

Nothing beyond these finite reference oracles should be mistaken for a complete psychological implementation. The Campaign 0 substrate contracts and conformance manifest passed on 2026-09-01; downstream psychological seam contracts remain separate future work.
