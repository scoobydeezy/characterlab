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
- `mutationAuthority.ts` allocates the global `MutationAuthorityId` namespace accepted by the `TRC-001`/`TRC-002` addendum and compiles committable ownership definitions — owned path families, removal permission, and a closed leaf-value grammar — into the Campaign 0 authority registry.

`observation/` contains the accepted bounded-measurement Campaign 1 seam under immutable version identifier `observation/0.1-candidate`. `observation.ts` validates exact bounded-effect truth, compiles registered state-change channels into point/lower/upper interval evidence, distinguishes missingness from zero, and supplies a restricted identity-establishing provenance-token control. Its thin experience envelope is not a general event representation.

`semanticBinding/` contains the symbolic executable `SEM-001A..H` candidates: truth binding grammar; observer-relative continuant/event files (`perceptualContinuantFiles.ts` owns the accepted `SEM-001A` continuant-file lifecycle — observer-scoped allocation, binary track transition keyed by continuant detection, single explicit retirement, and the ordinal-free continuity view proving `CV-SEM-013,019,021,022`); finite continuant and event-pattern classification; append-only continuant recognition; closed, consumer-`ReadDomain`-admitted observer-safe provenance with nonrecursive character-relative causal-role evidence; and exact current/consequence observation lanes under `ordering-phases/2-candidate`. Accepted `SEM-001I.1` fixes their canonical schema inventory, state ownership, occurrence keys, and collection semantics; accepted `SEM-001I.2` assigns the permanent IDs and union layouts. `semanticCodecs.ts` is the `SEM-001I.3` construction boundary from that allocation to `cenc/1` bytes: named-field records, pre-emission union-layout validation, admitted-version gates, byte-identical round trip, and the restore path both state roots persist through (`CV-SEM-096..098`). `semanticStateAuthority.ts` registers the seven writable leaves of state roots 241–244 with exactly one owning authority each, addressed by every collection's accepted uniqueness key, through the substrate's global `MutationAuthorityId` allocation. `semanticEvidenceCodecs.ts` completes that boundary for the records carrying a run's result — truth bindings, perceived bindings, classification evidence, the assembled experience, evidence references, causal-role evidence, and recognition resolutions — so the whole causal path is expressible in accepted canonical bytes. `MATH-006` is closed. Accepted `SEM-001J` (2026-09-04) closed the parent `SEM-001`: `PHEN-SEM-001` passes and `semantic-binding/0.1-candidate` is the Campaign 1 event-semantic baseline. Closure proves this finite deterministic architecture and its fixture vocabulary only — continuous perception, graded confidence, ontology inference, action-schema recognition, memory encoding, belief learning, appraisal, and social cognition remain later seams.

Nothing beyond these finite reference oracles should be mistaken for a complete psychological implementation. The Campaign 0 substrate contracts and conformance manifest passed on 2026-09-01; downstream psychological seam contracts remain separate future work.
