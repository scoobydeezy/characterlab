# Formal Open-Decision Register

**Status:** active blocking register

Open decisions are not ordinary TODOs. If a row can affect an authoritative result, every dependent seam remains blocked until the target contract accepts a resolution and its proof tests.

## Priority meanings

| Priority | Meaning |
|---|---|
| `P0` | Blocks the active substrate or earliest vertical causal slice. Resolve in its named owner campaign before affected implementation. |
| `P1` | Blocks a named near-term seam/campaign but not the entire scaffold shell. |
| `P2` | Known formal limitation that may remain isolated until its dependent mechanism is scheduled. |

## Register

| Decision | Priority | Formal owner | Blocks | Target disposition |
|---|---|---|---|---|
| `SEM-001` event semantic binding and recognition boundary | `P0` | `semantic-binding/0.1-candidate` / Campaign 1 | general pre-recognition `SemanticExperience`, encoding, memory keys, association referents, person recognition, relationships, and semantic Reasons | accept binding occurrence identity, event/causal role separation, observer-scoped perceptual referents, binding-specific visibility, finite typed perceptual classification, safe provenance/linkability, and recognition attachment after all `CV-SEM-*`/`PHEN-SEM-001` controls pass |
| `ORD-001` immediate belief timing | `P1` | ordering / belief seam | belief use within the same event | accepted belief-event phase map before belief campaign |
| `ORD-002` simultaneous multi-character ordering | `P1` | ordering / interaction seam | multi-character fixtures and social observation | accepted interaction ordering before first multi-character fixture |
| `ORD-005` appraisal-regulation feedback boundary | `P1` | ordering/regulation seam | regulatory campaigns and current-vs-later affect semantics | accepted phase mapping before regulation campaign |
| `TRC-003` privacy-safe trace projections | `P1` | trace/epistemic seam | researcher/UI views without cognitive leakage | accepted projection schema passing forbidden-read audit |
| `TRC-004` causal-overlap provenance | `P1` | trace/reason consolidation | port of aggregate evidence coverage | accepted evidence-basis contract passing collective-redundancy fixture |
| `DEC-001` authorship/identity qualification | `P1` | decision-expression and identity seam / Campaign 2 | retained dice-to-identity feedback and roll-boundary migration | accepted qualification contract covering contest, significance, cost, coercion, intervention, resolution mode, roll occurrence, and `AuthorshipPotential`, passing `PHEN-DECISION-001` and `PHEN-BIO-001` |
| `ADAPT-001` automatic adaptation input | `P1` | state/adaptation seam / Campaign 2 | regulatory tolerance/load and procedural skill without epistemic leakage | accepted typed adaptation-input and mutation-authority contract passing `PHEN-ADAPT-001` |
| `MATH-002` quadratic coefficient convention | `P2` | signal-field candidate seam | signal-field comparison only | choose polynomial/matrix convention in candidate seam and add equivalence vectors |
| `MATH-003` quadratic variance distribution assumptions | `P2` | signal-field candidate seam | uncertainty-bearing signal fields | declare distribution/fourth moments or reject closed-form candidate |
| `MATH-004` covariance validity under quantization | `P1` | belief representation campaign | fixed-point covariance/Kalman candidate | PSD-preserving representation/projection proof before candidate use |
| `ONT-001` typed semantic ontology and facet inference | `P1` | content/ontology seam | generalized inheritance, facet implication, affordance closure, and shared non-cognitive world querying | accept typed facet/predicate schemas, inference and conflict rules, applicability, versioning, and a proof that character-relative appraisal cannot enter world truth; does not block finite `SEM-001` fixture facets |

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

## Closed Campaign 1 decisions — 2026-09-01

### `MATH-006`

- **Decision:** accept registered bounded state-change channels that compile exact permitted observation intervals from `Before`, `After`, known bounds, and polarity; missingness is a distinct sum type, and only visible provenance slots cross into thin `SemanticExperience`.
- **Alternatives considered:** `OverflowLeak`, truth-side saturation classification, full provenance copy, missing-as-zero, and always-point measurement. Each is rejected by an exact structural divergence or closure violation.
- **Domain/failure:** exact bounded scalar changes, deterministic registered missingness, known channel bounds, and point/lower/upper interval evidence. Invalid truth/channel/closure data aborts the whole instant; noisy sensors, uncertain bounds, and learning updates remain outside this contract.
- **Proof:** `CV-OBS-001..006`, `CV-EPI-001..002`, the paired hidden-Overflow timeline through thin `SemanticExperience` and an immediate consumer, forbidden-field closure, named first divergence, and transactional rollback.
- **Reopen:** measurement mode, interval vocabulary, channel knowledge, polarity, missingness, visibility/role projection, precision/unit, timing, safe-reference, or hidden-truth influence changes.

## Closed Campaign 0 decisions — 2026-09-01

The following decisions closed together when the Campaign 0 gate passed. Their immutable candidate-era version identifiers were retained so acceptance did not perturb canonical identity or random inputs.

### `RND-001` and `MATH-005`

- **Decision:** accept registered canonical random addresses, domain-separated SHA-256 128-bit candidates, two bounded-rejection attempts, and a fresh-candidate modulo fallback for spans through `2^32`; explicit role-compatible `ComparisonDrawMap` is the only coupling override.
- **Alternatives considered:** historical delimiter/FNV 64-bit addressing and unbounded rejection. The accepted form retains pure addressing while removing delimiter ambiguity and bounding work.
- **Domain/failure:** invalid spans, weights, purposes, coupling roles, duplicate maps, or late maps fail structurally; the published ideal-candidate total-variation bound is below `2^-290`.
- **Proof:** `CV-RNG-001..008`, independent SHA-256 oracle, exhaustive reduced-width enumeration, exact inequalities, mutable sequential-RNG negative control, and `PHEN-DET-001`.
- **Reopen:** address/schema, hash/candidate width, range mapper, attempt count/fallback, coupling, or bias evidence changes.

### `TIME-001` and `MATH-001`

- **Decision:** accept checked integer `SimInstant`, exact linear analytical anchors, retained bounded remainder, non-mutating reads, and materialize→mutate→re-anchor semantic transitions.
- **Alternatives considered:** incidental re-anchoring with truncation and hidden microticks; both are rejected because they create partition-sensitive state.
- **Domain/failure:** declared signed rates/scales and bounded values only; negative duration and representation overflow fail without mutation.
- **Proof:** `CV-TIME-001..006`, positive/negative partition equivalence, truncation negative control, rational oracle, save/load, and transaction rollback.
- **Reopen:** time unit/range, rounding/remainder, re-anchor order, parameter identity, or nonlinear algorithm changes.

### `ORD-003` and `ORD-004`

- **Decision:** accept `(DueAt, Phase, EventSequence)` order, run-global allocation, same-instant quiescence, whole-instant atomic commit, terminal failure, and quiescent canonical continuation saves.
- **Alternatives considered:** partial event commit, retry, deferred cascade remainder, insertion order, and serialized executable handlers; all are rejected.
- **Domain/failure:** registered phases/handlers, positive work ceiling, and complete allocator/event continuation; any validation or invariant failure restores the pre-instant committed structures exactly.
- **Proof:** `CV-ORD-001..004`, `CV-TXN-001` at nine generic and concrete boundaries, `CV-SAVE-001..002`, and integrated `PHEN-DET-001`.
- **Reopen:** ordering key, phase registry, transaction boundary, cascade policy, allocator, save schema, or continuation mismatch changes.

### `TRC-001` and `TRC-002`

- **Decision:** accept typed state paths, exhaustive sole mutation authority, capability-limited reads, canonical preconditioned patches, exact diffs, committed-trace/failure-diagnostic separation, and structural first divergence with causal ancestry.
- **Alternatives considered:** direct object mutation, most-specific overlapping ownership, declared-but-uninstrumented reads, hash-only comparison, and aborted records in committed trace; all are rejected.
- **Domain/failure:** declared writable leaf families and registered projections only; forbidden/stale/overlapping/invalid work aborts the containing instant.
- **Proof:** all `CV-OWN-*`, `CV-READ-*`, `CV-PATCH-*`, and `CV-TRC-*`, schema rejection, deep-copy, exact-diff, and concrete rollback vectors.
- **Reopen:** path/selector, ownership, patch, trace/evolution, causal comparison, or atomicity semantics change.

### `CONTENT-001`

- **Decision:** accept governed content type 170, semantic and canonical-schema registry types 171–173, corpus-manifest type 174, canonical set manifests, stable typed references, and a required deterministic validator resolved for each semantic kind.
- **Alternatives considered:** presentation-inclusive commitments, digest-only registries, and free-form content interpreted at runtime; all are rejected.
- **Domain/failure:** every required structural field is authoritative; presentation field 100 is excluded; duplicate/unknown references, cycles, absent validators, out-of-domain definitions, and malformed registries fail before commitment.
- **Proof:** exact content/registry/corpus bytes and SHA-256 digests, every-field sensitivity, presentation insensitivity, construction-order invariance, and adversarial invalid-manifest vectors.
- **Reopen:** content/registry schema, field authority, reference/cycle policy, validator resolution, or manifest encoding changes.
