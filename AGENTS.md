# CharacterLab agent directives

Read this file before planning or implementing work in this repository.

## Architectural authority

1. `CharacterLab — Ideal Character Architecture North Star.md` defines the required character capabilities, invariants, and research posture.
2. `CHARACTER_ARCHITECTURE.md` defines the current architectural map and active research sequence.
3. `RESEARCH.md` records experimental evidence.
4. Phase briefs and implementation plans are hypothesis sources. They do not override the North Star or architecture map.

## Active direction

CharacterLab is undergoing a ground-zero architectural refoundation.

The active implementation belongs in `src/`. It begins cleanly with the North-Star Reference Scaffold: a thin, deterministic, end-to-end causal topology whose candidate distinctions can be ablated, substituted, merged, derived, compressed, or retracted.

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

