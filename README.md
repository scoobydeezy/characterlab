# CharacterLab

CharacterLab is the deterministic research proving ground for Vivarium's character architecture. It begins with an intentionally complete causal model, proves each seam, and simplifies only when controlled evidence supports equivalence.

## Read first

1. [Agent directives](AGENTS.md)
2. [Ideal Character Architecture North Star](CharacterLab%20%E2%80%94%20Ideal%20Character%20Architecture%20North%20Star.md) — required phenomena and invariants
3. [Canonical Character Architecture Map](CHARACTER_ARCHITECTURE.md) — sole source of topology, edges, ownership, and ordering
4. [Research Program Brief](CharacterLab%20%E2%80%94%20Ideal%20Character%20Research%20Program%20Brief.md) — proof method and campaign rules
5. [Formal Reference Model](docs/formal/README.md) — deterministic executable semantics
6. [Active planning ledgers](docs/planning/README.md) — readiness, corpus, verdict evidence, and the reference-mechanism preservation gate
7. [Build & Research Campaign Plan](CharacterLab%20%E2%80%94%20Reference%20Architecture%20Build%20%26%20Research%20Campaign%20Plan.md) — active sequence beginning with substrate Campaign 0

## Repository boundary

- `src/` is the fresh active implementation. It must not import from `reference/`.
- `docs/formal/` is the pre-implementation specification layer. Missing math blocks implementation; agents do not fill it by interpretation.
- `docs/planning/` contains active research ledgers.
- `reference/` contains the complete pre-refoundation implementation, briefs, and research record as read-only evidence and controls.

The historical implementation's full documentation is preserved at [reference/IMPLEMENTATION_README.md](reference/IMPLEMENTATION_README.md). Its behavior and formulas are not current authority merely because they have code and tests.

## Current status

The conceptual architecture has been reconciled around one canonical topology. Campaign 0 passed on 2026-09-01: identity/encoding, governed content and registries, addressed randomness, analytical time, atomic ordering/save-load, and mutation/structural proof are accepted substrate contracts with passing [Campaign 0 conformance vectors](docs/formal/CONFORMANCE_VECTORS.md). Campaign 1 is active. Exact bounded measurement is accepted and `MATH-006` is closed. Accepted `SEM-001A..H` fix fallible continuant-files, truth binding/event-role grammar, fallible event-files/grouping, deterministic continuant and event-pattern classification, append-only continuant-instance recognition, observer-safe evidence admissibility/causal-role provenance, and exact current/consequence observation lanes through `CV-SEM-090`. Accepted `SEM-001I.1` fixes the canonical schema inventory and occurrence identities; accepted `SEM-001I.2` freezes their permanent numeric allocation and manifest-governed union layouts. Evidence is admitted only through the consuming transition's typed `ReadDomain`; character provenance is separate from omniscient trace, recognition evaluations remain trace-only, and resolution state is self-sufficient. Phase 130 learns only from perceived consequence, and phase 150 is a non-schedulable settlement sentinel. Event patterns do not identify learned action schemas. The parent `SEM-001` remains the P0 boundary: `SEM-001I.3` codecs/persistence and the `SEM-001J` integrated gate must still close. Full ontology inheritance and affordance closure remain separately open under `ONT-001`.

## Commands

```text
npm test             active src/ tests only
npm run test:reference
npm run build
npm run dev
```
