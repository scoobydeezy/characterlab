# Campaign 0 Conformance Vectors

**Status:** passing accepted Campaign 0 manifest, version identifier `campaign0-vectors/0.1-candidate` (accepted 2026-09-01)

**Purpose:** convert the accepted Campaign 0 design into executable proof. No `P0` decision closes from prose agreement or from code merely selecting a default.

## Vector artifact contract

Every executable vector is a canonical record containing:

```text
ConformanceVector = (
  VectorId,
  VectorSchemaVersion,
  GoverningContractVersions[],
  ExactInputs,
  ExpectedOutputsOrFailure,
  RequiredStructuralComparisons[],
  ForbiddenDifferences[],
  OracleMethod,
  ReopenConditions
)
```

Fixtures must store complete inputs and expected structures. Digests may accompany them but never replace expected canonical bytes, state, events, trace, or failure. A vector is `PASS` only when its checked-in expected result is independently inspectable, the reference implementation matches it, and every required negative control fails for the stated reason.

Candidate-generator injection used to force rare rejection/fallback paths is test-only oracle plumbing. It must exercise the production range mapper but can never become an authoritative runtime input or alternate random source.

## 0A — Canonical encoding and identity

Implementation evidence (2026-09-01): `CV-ENC-001` through `CV-ENC-003` and `CV-ID-001` through `CV-ID-005` execute in `src/test/`. Exact model, governed-content, registry, and populated phenomenon-corpus manifest bytes and SHA-256 digests are checked in. Every governed authoritative field changes the content commitment; presentation does not. Deterministic semantic-kind validators reject out-of-domain content, and duplicate/unknown references, cycles, and malformed registries fail. The 0B fixtures prove research-identity/random-stream separation and carry a typed `ComparisonDrawMap` through ordered input, `RunIdentity`, and `ComparisonCase`. `CONTENT-001` is resolved.

| Vector | Required proof |
|---|---|
| `CV-ENC-001` | Golden `cenc/1` bytes for booleans, unsigned/signed boundary integers, UTF-8 NFC text, bytes, reduced rationals, lists, typed IDs, and optional record fields. |
| `CV-ENC-002` | Maps and sets with different construction orders encode identically in canonical key/item order. |
| `CV-ENC-003` | Reject non-minimal LEB128, non-NFC text, unreduced/negative-denominator rationals, duplicate keys/items/fields, invalid presence bytes, unknown fields, and noncanonical order. |
| `CV-ID-001` | Identical structural model manifests produce identical bytes and `ModelDigest`. |
| `CV-ID-002` | Changing exactly one rules, content-schema, content-manifest, parameter-schema, parameter-manifest, numeric-profile, random-algorithm, registry-schema, or registry-manifest field changes `ModelIdentity` and `ModelDigest`. |
| `CV-ID-003` | Presentation-only text excluded by the content schema changes neither content manifest nor model identity. Moving an authoritative threshold into “presentation” is rejected by content validation. |
| `CV-ID-004` | Changing corpus, comparison specification, harness, or comparison-case membership changes research identity only; model/run execution and natural random candidates remain identical. |
| `CV-ID-005` | Changing initial state, ordered input, explicit coupling map, or seed changes `RunIdentity`; complete structures remain available for first-difference reporting. |

## 0B — Addressed randomness and coupling

Acceptance evidence (2026-09-01): `CV-RNG-001` through `CV-RNG-008` execute against `src/substrate/random.ts`. Checked-in candidate-input bytes and SHA-256 output were independently reproduced with the platform cryptographic oracle; reduced-width enumeration and exact integer inequalities verify threshold uniformity and the published rejection/fallback bounds. Preserved historical controls and full `PHEN-DET-001` also pass. `RND-001` and `MATH-005` are closed.

| Vector | Required proof |
|---|---|
| `CV-RNG-001` | Golden SHA-256 and first-128-bit vectors for fixed 256-bit seeds, natural addresses, purposes, subjects, draw indexes, and internal candidate indexes. |
| `CV-RNG-002` | Range boundary vectors for `m = 1`, `2`, `2^32-1`, and `2^32`; reject `m = 0` and `m > 2^32`. |
| `CV-RNG-003` | Test-only injected candidates force acceptance at indexes 0 and 1 and fallback at index 2; expected candidate, rejection, fallback, and result records are exact. |
| `CV-RNG-004` | Exhaustive reduced-width analogues and symbolic arithmetic verify threshold uniformity plus the published rejection, fallback, and total-variation bounds. |
| `CV-RNG-005` | Positive weighted choices normalize to the declared integer total and select exact cumulative intervals; zero/negative weights, duplicate IDs, and overflow fail. |
| `CV-RNG-006` | Inserting any number of unrelated draws leaves every pre-existing natural address, candidate, and result unchanged. A mutable sequential RNG must fail this control. |
| `CV-RNG-007` | Equal seed/address produces natural coupling across different `ModelIdentity` values; changing `RandomAlgorithmVersion`, seed, or semantic address changes the candidate stream at or downstream of that address only. |
| `CV-RNG-008` | Explicit `ComparisonDrawMap` couples different local addresses through one comparison key, changes ordered input and `RunIdentity`, appears in trace, and replays exactly. Duplicate/non-injective, late, or purpose-incompatible mappings fail. |

## 0C — Time and analytical advancement

Acceptance evidence (2026-09-01): `CV-TIME-001` through `CV-TIME-006` execute against `src/substrate/time.ts` and `exactMath.ts`. Fixtures cover positive and negative partition invariance, a deliberately failing truncation/re-anchor control, non-mutating reads, explicit semantic parameter changes, same-time T-forward behavior, checked time/value failures, and rejection of ambient-float or hidden-microtick nonlinear declarations. Preserved exact-rational controls and full continuation pass. `TIME-001` and `MATH-001` are closed.

| Vector | Required proof |
|---|---|
| `CV-TIME-001` | For positive and negative linear rates, direct `A→C` equals incidental-query `A→B→C`, including exact retained remainder. A truncating/re-anchoring control fails. |
| `CV-TIME-002` | Reading an analytical value at `B` changes no authoritative anchor, remainder, trace mutation, or later value. |
| `CV-TIME-003` | A semantic parameter/state change at `T` materializes the old anchor through `T`, applies the mutation, and establishes the exact new anchor at `T`. |
| `CV-TIME-004` | Multiple same-time events observe earlier canonical phase/sequence results with zero elapsed duration; none affects the interval ending at that timestamp retroactively. |
| `CV-TIME-005` | Negative instants, negative advancement duration, `Int64` instant overflow/underflow, and bounded-representation overflow produce typed failures with no wrap or saturation. |
| `CV-TIME-006` | Every nonlinear candidate supplies an exact/versioned algorithm, quantization and error fixture; a candidate using ambient platform floating point or hidden microticks is rejected. |

## 0D — Ordering, transaction, quiescence, and persistence

Implementation progress (2026-09-01): `CV-ORD-001` through `CV-ORD-004` and `CV-SAVE-001` through `CV-SAVE-002` execute against `src/substrate/scheduler.ts` and `src/substrate/persistence.ts`. Both the generic harness and the concrete 0E seam harness pass every before/after state, event, trace, invariant, and commit failure-injection boundary required by `CV-TXN-001`. Canonical continuation preserves structural model/run identities, clock, analytical anchor/remainder, random-relevant IDs, explicit `ComparisonDrawMap` input, runtime/event/sequence allocators, dependencies, pending queue, trace, and outputs. The integrated `PHEN-DET-001` fixture continues real canonical state/patch/trace work across save/load with byte-identical results; the historical deterministic-replay control also passes. `ORD-003` and `ORD-004` have their required proof but remain open until the Campaign 0 contracts are accepted together at the final gate.

| Vector | Required proof |
|---|---|
| `CV-ORD-001` | Permuting event construction and collection insertion produces the same execution order under `(DueAt, Phase, EventSequence)`. |
| `CV-ORD-002` | Same-time same-phase emissions receive later sequences; later-phase emission succeeds; earlier-phase emission fails transactionally. |
| `CV-ORD-003` | Scheduled events and reactions settle to quiescence before external read/save; a newly emitted same-time chain executes in exact order. |
| `CV-ORD-004` | Exceeding the versioned cascade limit fails loudly, commits no work from the instant, and never defers a remainder. |
| `CV-TXN-001` | Inject failure before and after every staged mutation/event/trace validation boundary; each case restores pre-instant state, scheduler, and allocators structurally exactly, emits only a diagnostic, marks the run failed, and never retries. |
| `CV-SAVE-001` | Saving/loading at a quiescent boundary preserves full state, anchors, IDs, allocators, pending queue, sequences, coupling input, and model identity structurally. |
| `CV-SAVE-002` | Save immediately before event `E`, load, and continue is structurally state/output/trace-equivalent to uninterrupted continuation. Mid-transition save fails. |

## 0E — Read domains, mutation authority, patches, and trace

| Vector | Required proof |
|---|---|
| `CV-OWN-001` | Model construction rejects overlapping ownership patterns and every uncovered writable state leaf. One authority may own a declared structured family without ambiguity. |
| `CV-READ-001` | Forbidden state is absent from `ContractReadProjection`; attempted illegal access cannot be expressed through the typed interface and forged paths fail validation. |
| `CV-READ-002` | Allowed accessor use records exact concrete paths/values; unused allowed fields remain possible reads but not actual reads. Derived projection values retain source/transformation provenance. |
| `CV-PATCH-001` | A legal patch writes only owned paths and produces the exact canonical structural diff. Patch construction order cannot alter encoded patch or result. |
| `CV-PATCH-002` | Wrong authority, stale expected value, duplicate/overlapping paths, invalid type/domain, mutable alias, and illegal emitted event each fail before commit. |
| `CV-PATCH-003` | Deep counterfactual copies share no mutable authoritative alias; applying a patch to one changes neither the other nor its canonical encoding. |
| `CV-TRC-001` | Identical runs produce byte-identical canonical committed traces and structurally identical decoded records. Hashes are checked only as accelerators. |
| `CV-TRC-002` | Failed instant data appears only in `FailureDiagnostic`; committed trace ends at the prior successful instant and has no causal reference to aborted records. |
| `CV-TRC-003` | Comparison reports the first differing record, field/path, old/new value, and causal ancestry for identity, random, time, event, read, patch, and output divergences. |

Acceptance evidence (2026-09-01): all `CV-OWN-*`, `CV-READ-*`, `CV-PATCH-*`, and `CV-TRC-*` vectors execute against `src/substrate/state.ts`, `trace.ts`, and `transition.ts`. They prove exhaustive non-overlapping ownership, inaccessible forbidden reads, actual/derived read provenance, order-independent canonical patches, exact diffs, stale/wrong/invalid/overlapping-write rejection, deep-copy isolation, byte-identical committed traces, unknown-schema rejection, aborted-diagnostic separation, transitive causal ancestry, and structural first-divergence locations. The concrete 0E harness repeats all nine rollback boundaries after real reads, patches, event allocation, and trace construction. `TRC-001` and `TRC-002` are closed.

## Final Campaign 0 gate

`PHEN-DET-001` is materialized from the vectors above as executable fixtures. Campaign 0 closes only when:

1. every applicable vector is `PASS` against the reference implementation;
2. independent oracle calculations verify canonical bytes, SHA-256 truncation, threshold arithmetic, bias bounds, and exact time arithmetic;
3. all negative controls fail for their declared reason;
4. build/test executes the reference-boundary guard;
5. `CONTENT-001`, `RND-001`, `TIME-001`, `MATH-001`, `MATH-005`, `ORD-003`, `ORD-004`, `TRC-001`, and `TRC-002` are closed in the same change that records the passing evidence; and
6. no unresolved decision can alter Campaign 1 authoritative inputs or verdicts.

Before that gate passed, every listed decision remained open. Acceptance retains the candidate-era identifiers as immutable canonical version strings; their status is now governed by the resolution record rather than inferred from the identifier suffix.

**Gate result (2026-09-01): PASS.** All applicable vectors pass against the reference implementation; independent encoding, SHA-256, exact-arithmetic, and bias oracles pass; negative controls fail for their declared reasons; build and reference-boundary checks pass; `PHEN-DET-001` continues canonical state/event/output/trace across save/load; and no unresolved decision can alter Campaign 1 inputs. The nine Campaign 0 P0 decisions are closed in the accompanying resolution record. Candidate-era version strings remain immutable identifiers and are not renamed on acceptance.
