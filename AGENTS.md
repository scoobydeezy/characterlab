# CharacterLab agent directives

Read this file before planning or implementing work in this repository.

## Architectural authority

1. `CharacterLab — Ideal Character Architecture North Star.md` defines the required character capabilities, invariants, and research posture.
2. `CHARACTER_ARCHITECTURE.md` is the sole canonical topology: boxes, edges, state ownership, and causal ordering.
3. `CharacterLab — Ideal Character Research Program Brief.md` defines the research method, proof burden, and campaign rules.
4. `docs/formal/` defines versioned executable semantics beneath those conceptual authorities. An implementation must name the seam-contract version it implements.
5. `CharacterLab — Reference Architecture Build & Research Campaign Plan.md` owns active sequence without overriding accepted formal readiness gates.
6. `docs/planning/` records active seam status, phenomena, preservation obligations, and verdict evidence.
7. Phase briefs, historical findings, and implementation plans under `reference/` are hypothesis and control sources only.

When documents conflict, resolve the conflict upward through this hierarchy. Do not silently choose whichever formula or diagram is easiest to implement.

Authority is also scoped by subject. The Research Program Brief outranks formal documents on research method, proof burden, and campaign admissibility; it does **not** override an accepted seam contract's exact mathematics, domains, quantization, ordering, or trace schema. Conversely, a formal seam contract may instantiate the North Star and Architecture Map but may not redefine their required phenomena, causal boxes, or epistemic boundaries. A genuine cross-scope conflict must be resolved by amending the higher conceptual document or the lower formal contract explicitly, never by local implementation choice.

## Active direction

CharacterLab is undergoing a ground-zero architectural refoundation.

The active implementation belongs in `src/`. It begins only after the relevant deterministic substrate and seam contracts exist. The first implementation target is the North-Star Reference Scaffold: a thin, deterministic, end-to-end causal topology whose candidate distinctions can be ablated, substituted, merged, derived, compressed, or retracted.

Campaign 0 passed on 2026-09-01. Its immutable candidate-era identifiers remain accepted contracts. Campaign 1 is active. Exact bounded measurement under `observation/0.1-candidate` passed its vectors and closed `MATH-006`, but its concept-token path is only a restricted identity-establishing-channel control. Amended `SEM-001A` is accepted: `PerceptualReferentId` is an observer-relative continuant-file for perceived people, discrete objects, places, or spatial regions; continuity may be objectively wrong, allocation is independent per observer, and ordinals are opaque. `SEM-001B` and `CV-SEM-023..030` fix truth binding occurrences, governed roles, event-specific cardinality/narrowing, and role-evidence precision. `SEM-001C` and `CV-SEM-031..040` fix separate fallible event-files and event-grouped perceived bindings. `SEM-001D` and `CV-SEM-041..050` fix six independent continuant appearance facets, optional exact booleans, feature missing/false, sole facet authority, provenance, rollback, and output boundaries. Accepted `SEM-001E` and `CV-SEM-051..060` fix separate event-pattern facets, scoped typed event-feature evidence, a definitionally necessary rope-skipping-pattern conjunction, sole facet authority, append-only historical classification, typed Action-role projection asymmetry, and replacement of historical direct truth-action projection. Accepted `SEM-001F` and `CV-SEM-061..070` fix observer-owned recognition candidates, mapped identity claims, typed cues, exact unique-uncontradicted support, immutable evaluations, append-only assert/replace/withdraw resolution chains, false-tracking preservation, and recognition output boundaries. Accepted `SEM-001G` and `CV-SEM-071..080` fix closed schema/version-admitted character evidence references, consumer-specific typed `ReadDomain` admissibility, same-observer safe linkability, occurrence opacity, separate omniscient/character provenance graphs, proposition-local future evidence quality, and nonrecursive multi-role character-relative causal-role evidence. Accepted `SEM-001H` and `CV-SEM-081..090` fix strict current/consequence truth cutoffs, conditional bijective experience reservation, immutable experience/recognition-input staging, canonical independent classification, perceived-outcome learning, adaptation separation, `ORD-001` isolation, and exact two-lane phases under `ordering-phases/2-candidate`, with phase 150 non-schedulable. Accepted `SEM-001I.1` fixes the canonical schema inventory, including exact occurrence keys, recognition-knowledge character-state ownership, trace-only recognition evaluations, self-sufficient resolution state, typed occurrence allocation, revision-topology history, and explicit transition result identities. Accepted `SEM-001I.2` freezes record types `210..259`, the reviewed typed-ID namespaces and occurrence namespaces through `1115`, finite values, and manifest-governed union layouts; namespace `1004` remains genuinely available and absent from the registry. Perceived event pattern remains distinct from learned action-schema recognition. The parent `SEM-001` remains the P0 blocker: `SEM-001I.3` codecs/persistence proof and the `SEM-001J` integrated gate remain unresolved. Implement the permanent allocation only through its accepted table; do not implement downstream learning until the parent closes. Visibility never implies recognition; classification, tracking, recognition, and appraisal remain separate; truth handles and unobserved truth facets stay trace-side. `ONT-001` owns later ontology/inheritance/affordance semantics.

Do not automatically resume the former Phase 3A → 3B → 3C plan.

## Historical implementation boundary

The complete pre-refoundation implementation is preserved under `reference/src/`.

- Treat `reference/` as read-only historical evidence and a source of control implementations.
- Do not import any module from `reference/` into `src/`.
- Do not copy a historical mechanism into `src/` merely because it already exists.
- Reuse requires an explicit architectural reason and must preserve the new seam contract rather than the historical module shape.
- Do not modify `reference/` unless the task explicitly concerns historical reproducibility or a reference-only correction.
- Run `npm run test:reference` when validating the preserved implementation.

Git history and `reference/` preserve the past. New work must not make the historical tree canonical by accident.

## Fresh-source rules

- `npm test` targets only tests under the new `src/` tree.
- No character-model primitive is authoritative merely because it existed before refoundation.
- Keep truth, evidence, memory, recognition, belief, appraisal, affect, motivation, reasons, decision, intent, expression, execution, and consolidation separately traceable until experiments earn a reduction.
- Prefer explicit competing implementations over compatibility flags threaded through the historical model.
- Record reduction verdicts with their tested phenomenon corpus.
- Treat `../vivarium/Docs/CharacterLabMathematicalReference.md` as a formula inventory, not authority. Import only through the formula-intake ledger and a versioned formal seam contract.
- Preserve the Phase 2.9–2.97 unresolved-Decision dice grammar and reinforcing identity loop as mandatory initial reference implementations and controls. Port them through new seam contracts; do not omit, replace with opaque weighted randomness, or discard their regression experiments without an explicit reduction experiment and verdict.
- Before designing or implementing any seam, consult `docs/planning/REFERENCE_MECHANISM_LEDGER.md`. Every applicable historical mechanism or finding must receive an explicit port, control, corpus, candidate, supersession, or retirement decision. Do not silently drop it merely because active source started clean.
