# Campaign 1 Observation/Evidence Conformance Vectors

**Status:** accepted observation-seam manifest, version `campaign1-observation-vectors/0.1-candidate` (accepted 2026-09-01)

These vectors govern the accepted bounded-measurement scope of `observation/0.1-candidate` and `MATH-006`. Campaign 0 vectors remain mandatory substrate controls. They do not prove general event bindings, perceptual-referent identity, or recognition; those are governed by `SEM-001` and `CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md`.

| Vector | Required proof | Current evidence |
|---|---|---|
| `CV-OBS-001` | Exact point, lower-bound, upper-bound, and polarity-specific zero-bound classification uses permitted state change and known bounds, never hidden Overflow. | PASS in `src/test/observation.test.ts` |
| `CV-OBS-002` | Exact-at-boundary and different-overflow truths with the same permitted projection produce byte-identical evidence. | PASS |
| `CV-OBS-003` | Missing observation is structurally distinct from observed point/bound evidence at zero. | PASS |
| `CV-OBS-004` | Output record closure excludes truth record types and concepts in invisible provenance slots. | PASS through compiler and capability-limited scheduler seam |
| `CV-OBS-005` | Slot priority, duplicate resolution, and concept ordering are permanent and canonical. | PASS |
| `CV-OBS-006` | Invalid decomposition, precision, polarity, mode, visibility, duplicates, and unnamed omniscient controls fail before evidence emission. | PASS at compiler boundary and whole-instant rollback |
| `CV-EPI-001` | The exact `PHEN-EPI-001` pair (`19/20`, potential effects `1/10` and `4/5`, common Applied `1/20`) has unequal truth and byte-identical permitted evidence. | PASS through compiler, accepted scheduler/trace transaction, thin `SemanticExperience`, and same-instant immediate consumer |
| `CV-EPI-002` | `OverflowLeak`, `TruthSaturationClassifier`, `FullProvenanceCopy`, `MissingAsZero`, and `AlwaysPoint` each fail their declared structural or paired-timeline control. | PASS with exact first-divergence field/consequence and record-closure rejection |

## Acceptance gate

`MATH-006` closes only when every row is fully `PASS`, the compiler runs through the accepted scheduler/read-domain/trace transaction, `SemanticExperience` contains only permitted records, the complete paired timeline remains equal through immediate downstream consumers, and first divergence identifies each prohibited control's first illegal field or consequence.

Acceptance result (2026-09-01): all rows pass within the declared bounded-effect domain. The exact rational compiler and permanent numeric registries are implemented in `src/observation/observation.ts`. Unit controls cover exact interval classification, hidden-Overflow invariance, missingness, restricted visible-slot projection, canonical priority/order, record closure, invalid inputs, round-trip restoration, and all five prohibited models with named first divergence. `observationIntegration.test.ts` runs the exact `PHEN-EPI-001` pair through capability-limited channel reads, canonical event allocation, omniscient trace, thin measurement experience, a same-instant read-only consumer, byte-identical character outputs/state after the truth-side divergence, and whole-instant invalid-truth rollback. `MATH-006` is closed. Token projection is a restricted identity-establishing-channel control; `SEM-001` blocks general semantic experience and later encoding/learning.
