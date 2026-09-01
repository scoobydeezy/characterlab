# Formal Open-Decision Register

**Status:** active blocking register

Open decisions are not ordinary TODOs. If a row can affect an authoritative result, every dependent seam remains blocked until the target contract accepts a resolution and its proof tests.

## Priority meanings

| Priority | Meaning |
|---|---|
| `P0` | Blocks the reference scaffold or its first vertical causal slice. Resolve in Campaign 0. |
| `P1` | Blocks a named near-term seam/campaign but not the entire scaffold shell. |
| `P2` | Known formal limitation that may remain isolated until its dependent mechanism is scheduled. |

## Register

| Decision | Priority | Formal owner | Blocks | Target disposition |
|---|---|---|---|---|
| `RND-001` word-to-range sampler | `P0` | deterministic substrate / Campaign 0B | all authoritative randomness, retained dice grammar, random coupling tests | accepted random contract in `substrate/0.2` with encoding, word function, total unbiased-or-bounded-bias mapping, vectors, and proofs |
| `TIME-001` partition-invariant analytical advancement | `P0` | deterministic substrate / Campaign 0C | physiology, regulation, decay, development, memory time | accepted time/remainder contract with partition tests |
| `MATH-006` event-to-measurement semantic compiler | `P0` | observation/interoception seam / Campaign 1 | earliest North-Star epistemic seam and every downstream learner | accepted truth→observation contract passing `PHEN-EPI-001` |
| `ORD-001` immediate belief timing | `P1` | ordering / belief seam | belief use within the same event | accepted belief-event phase map before belief campaign |
| `ORD-002` simultaneous multi-character ordering | `P1` | ordering / interaction seam | multi-character fixtures and social observation | accepted interaction ordering before first multi-character fixture |
| `ORD-003` transactional failure semantics | `P0` | ordering/state/trace / Campaign 0D | safe execution of any failing authoritative transition | accepted rollback/commit contract and injected-failure tests |
| `ORD-004` scheduler save/load identity | `P0` | ordering/serialization / Campaign 0D | replay across pending events | accepted pending-event serialization contract passing `PHEN-DET-001` |
| `ORD-005` appraisal-regulation feedback boundary | `P1` | ordering/regulation seam | regulatory campaigns and current-vs-later affect semantics | accepted phase mapping before regulation campaign |
| `TRC-001` canonical trace encoding/evolution | `P0` | trace / Campaign 0D | reproducible first-divergence comparison | accepted `trace/0.2` encoding with schema-evolution vectors |
| `TRC-002` mutation diff and pre/post proof | `P0` | trace/state / Campaign 0D | mutation-authority auditing | accepted structural diff format and mutation-authority tests |
| `TRC-003` privacy-safe trace projections | `P1` | trace/epistemic seam | researcher/UI views without cognitive leakage | accepted projection schema passing forbidden-read audit |
| `TRC-004` causal-overlap provenance | `P1` | trace/reason consolidation | port of aggregate evidence coverage | accepted evidence-basis contract passing collective-redundancy fixture |
| `CONTENT-001` content manifest/registry encoding | `P0` | content governance / Campaign 0A | `ContentVersion`, `RegistryVersion`, authoritative fixtures | accepted `content/0.2` manifest, digest, registries, and validator |
| `DEC-001` authorship/identity qualification | `P1` | decision-expression and identity seam / Campaign 2 | retained dice-to-identity feedback and roll-boundary migration | accepted qualification contract covering contest, significance, cost, coercion, intervention, resolution mode, roll occurrence, and `AuthorshipPotential`, passing `PHEN-DECISION-001` and `PHEN-BIO-001` |
| `ADAPT-001` automatic adaptation input | `P1` | state/adaptation seam / Campaign 2 | regulatory tolerance/load and procedural skill without epistemic leakage | accepted typed adaptation-input and mutation-authority contract passing `PHEN-ADAPT-001` |
| `MATH-001` progression partition sensitivity | `P0` | same resolution as `TIME-001` | analytical advancement | close with `TIME-001` partition-invariant contract or explicit causal partition rule |
| `MATH-002` quadratic coefficient convention | `P2` | signal-field candidate seam | signal-field comparison only | choose polynomial/matrix convention in candidate seam and add equivalence vectors |
| `MATH-003` quadratic variance distribution assumptions | `P2` | signal-field candidate seam | uncertainty-bearing signal fields | declare distribution/fourth moments or reject closed-form candidate |
| `MATH-004` covariance validity under quantization | `P1` | belief representation campaign | fixed-point covariance/Kalman candidate | PSD-preserving representation/projection proof before candidate use |
| `MATH-005` bounded-rejection fallback bias | `P0` | same resolution as `RND-001` | random range sampling | close with exact mapping or declared proven bias bound in random contract |

## Resolution record

Closing a row requires:

- exact decision and alternatives considered;
- affected document/version changes;
- declared domain and failure behavior;
- proof or error/bias bound;
- conformance and adversarial tests;
- corpus entries rerun;
- migration/reopen conditions.

The register is updated in the same change that accepts the governing contract. A row is never closed merely because code selected a default.
