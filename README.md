# CharacterLab

CharacterLab is the deterministic research proving ground for Vivarium's character architecture. It begins with an intentionally complete causal model, proves each seam, and simplifies only when controlled evidence supports equivalence.

## Read first

1. [Agent directives](AGENTS.md)
2. [Ideal Character Architecture North Star](CharacterLab%20%E2%80%94%20Ideal%20Character%20Architecture%20North%20Star.md) — required phenomena and invariants
3. [Canonical Character Architecture Map](CHARACTER_ARCHITECTURE.md) — sole source of topology, edges, ownership, and ordering
4. [Research Program Brief](CharacterLab%20%E2%80%94%20Ideal%20Character%20Research%20Program%20Brief.md) — proof method and campaign rules
5. [Formal Reference Model](docs/formal/README.md) — deterministic executable semantics
6. [Active planning ledgers](docs/planning/README.md) — readiness, corpus, verdict evidence, and the reference-mechanism preservation gate

## Repository boundary

- `src/` is the fresh active implementation. It must not import from `reference/`.
- `docs/formal/` is the pre-implementation specification layer. Missing math blocks implementation; agents do not fill it by interpretation.
- `docs/planning/` contains active research ledgers.
- `reference/` contains the complete pre-refoundation implementation, briefs, and research record as read-only evidence and controls.

The historical implementation's full documentation is preserved at [reference/IMPLEMENTATION_README.md](reference/IMPLEMENTATION_README.md). Its behavior and formulas are not current authority merely because they have code and tests.

## Current status

The conceptual architecture has been reconciled around one canonical topology. The deterministic substrate and registries are now being formalized before any Build / Campaign Plan or new character implementation proceeds. The next task is to turn each canonical edge into a versioned seam contract, then build the thinnest complete traversable reference scaffold.

## Commands

```text
npm test             active src/ tests only
npm run test:reference
npm run build
npm run dev
```
