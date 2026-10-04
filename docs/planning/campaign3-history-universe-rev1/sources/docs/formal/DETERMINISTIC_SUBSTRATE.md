# Deterministic Substrate

**Status:** accepted Campaign 0 contract, version identifier `substrate/0.2-candidate` (accepted 2026-09-01)

The immutable candidate-era identifier is retained because it participates in structural identities and golden random inputs; acceptance changes status, not canonical bytes.

**Scope:** rules shared by every executable seam

**Non-goal:** choosing psychological mechanisms

## 1. Structural identities

An identity is the canonical structural manifest, not its hash. A digest is a compact identifier and comparison accelerator; digest equality never replaces structural equality when both manifests are available.

```text
ModelIdentity = (
  RulesVersion,
  ContentIdentity(
    ContentSchemaVersion,
    ContentManifestDigest
  ),
  ParameterIdentity(
    ParameterSchemaVersion,
    ParameterSetDigest
  ),
  NumericProfileVersion,
  RandomAlgorithmVersion,
  RegistryIdentity(
    RegistrySchemaVersion,
    RegistryManifestDigest
  )
)

ModelDigest = SHA256(CanonicalEncode(ModelIdentity))
```

A state, committed trace, or save is uninterpretable without its complete `ModelIdentity`. The content, parameter, and registry digests commit to their complete canonical manifests; friendly names and manually bumped labels are non-authoritative. Changing a schema version or committed manifest changes `ModelIdentity` even when behavior happens to remain equivalent.

Every `*ManifestDigest` and `*SetDigest` in this contract is exactly `SHA256(CanonicalEncode(complete manifest))` under the manifest's declared schema and `cenc/1`. Domain separation comes from the canonical record type ID and schema version. A digest whose complete source manifest is unavailable is invalid for an authoritative run.

`SaveSchemaVersion` and `TraceSchemaVersion` are artifact metadata unless their change alters authoritative simulation semantics. A migration may change artifact representation without inventing a different model, but the migrated structure must still compare exactly with the declared post-migration structure.

One execution is fully identified by:

```text
RunIdentity = (
  ModelIdentity,
  InitialStateDigest,
  OrderedInputSequenceDigest,
  RunSeed
)
```

The canonical initial state and ordered input sequence remain complete run inputs; their digests identify them but never replace structural storage or comparison. `RunSeed` is an opaque 256-bit value. A friendly integer seed is encoded as unsigned big-endian bytes and left-padded with zero bytes to exactly 32 bytes; negative values or values requiring more than 32 bytes fail deterministically.

Research classification is separate from execution:

```text
ExperimentIdentity = (
  CorpusVersion,
  ComparisonSpecificationVersion,
  HarnessVersion
)

ComparisonCase = (
  OrderedModelIdentities,
  OrderedRunIdentities,
  CouplingSpecification
)
```

The phenomenon corpus, experiment identity, and comparison-case membership never participate in an authoritative transition or natural random address. If a comparison injects an explicit coupling map, that map is authoritative ordered run input and therefore changes `OrderedInputSequenceDigest`; §6 defines the only permitted form.

## 2. Deterministic transition

For a fixed model identity, initial state, ordered inputs, and addressed random source:

```text
(S[n+1], O[n], T[n]) = Step(ModelIdentity, S[n], I[n], R)
```

`S` is authoritative state, `I` is the canonical input event, `O` is externally visible output, and `T` is the ordered trace contribution. `Step` must be total over its declared domain or return a typed deterministic failure. Exceptions, iteration-order dependence, ambient time, locale, platform floating-point variation, and unaddressed randomness are forbidden authoritative inputs.

## 3. Semantic values and representations

A semantic type is not its storage type. Every authoritative scalar specification must state:

- physical or conceptual meaning;
- unit;
- exact domain and bounds;
- whether bounds are closed or open;
- representation profile;
- quantization point and rounding rule;
- overflow/failure behavior;
- comparison semantics.

The reference oracle should prefer exact integers and reduced rationals. A bounded fixed-point profile may be tested as a candidate representation only against the oracle over a declared domain. Binary floating point may be used for non-authoritative display or analysis, never as an unexplained semantic contract.

## 4. Integer and rational primitives

Shared functions must be sign-correct and defined for negative inputs:

```text
Clamp(x, lo, hi) = min(hi, max(lo, x))
FloorDiv(a,b)    = floor(a/b), b > 0
CeilDiv(a,b)     = -FloorDiv(-a,b), b > 0
```

`RoundEven(a/b)` returns the nearest integer, with exact half-ties selecting the even integer. A seam that needs another rule must name it; “round” is not a valid specification. Rationals are canonicalized with positive denominator and `gcd(|n|,d)=1`; zero is `0/1`.

## 5. Canonical collections and encoding

The candidate identity oracle is `CanonicalEncodingVersion = cenc/1`. Human-readable JSON may accompany it but is never authoritative identity encoding.

Every value begins with a one-byte type tag. Lengths, counts, type IDs, schema versions, and field IDs use the shortest valid unsigned LEB128 encoding; a decoder rejects non-minimal forms. Signed integers use ZigZag followed by that unsigned encoding. Fixed-width random words use network byte order. The initial tag registry is:

| Tag | Meaning | Canonical payload |
|---:|---|---|
| `0x00` | false | none |
| `0x01` | true | none |
| `0x02` | unsigned integer | minimal unsigned LEB128 |
| `0x03` | signed integer | ZigZag then minimal unsigned LEB128 |
| `0x04` | byte string | byte length then bytes |
| `0x05` | text | byte length then NFC-normalized UTF-8 |
| `0x06` | rational | signed numerator then positive unsigned denominator |
| `0x07` | list | item count then items in semantic order |
| `0x08` | map | entry count then key/value pairs in canonical key-byte order |
| `0x09` | set | item count then items in canonical item-byte order |
| `0x0A` | record | type ID, schema version, declared-field count, then fields |
| `0x0B` | typed identifier | namespace ID followed by canonical identifier payload |

A rational is reduced, has a positive denominator, and encodes zero only as `0/1`. Binary floating-point values have no authoritative tag. A semantic scalar that uses fixed point encodes its authoritative integer plus the governing numeric-profile identity, never a locale-formatted decimal.

Record fields are sorted by numeric field ID. Every field declared by that record schema appears as `(FieldId, PresenceByte, Value?)`; the presence byte is exactly `0x00` or `0x01`. A required field with presence `0`, an unknown field, duplicate field, omitted declared field, or noncanonical field order is invalid. Schema evolution assigns new numeric field IDs permanently and changes the record schema version; a retired ID is never reused.

Map keys and set items are sorted lexicographically by their complete canonical encoded bytes. Duplicate canonical keys/items are invalid. Lists preserve declared semantic order. No map, set, object-property, filesystem, registration, reflection, or discovery order is authoritative.

Human-readable labels never serve as identity unless a registry explicitly declares the normalized text to be the identifier payload. Canonical encoders and decoders must publish golden byte vectors and reject every alternate encoding of the same semantic value.

Permanent record and field IDs for the structural identities in §1 are assigned by the [Canonical Record Type Registry](CANONICAL_RECORD_REGISTRY.md). An implementation may not choose alternate IDs or infer them from declaration order.

## 6. Addressed randomness

A random draw is a pure lookup, not consumption from a mutable global stream:

```text
RandomAddress = (
  CausalRootId,
  PurposeId,
  SubjectBindings[(SubjectRoleId, SubjectId)],
  DrawIndex
)

RandomCandidateInput = (
  RandomAlgorithmVersion,
  RunSeed,
  EffectiveRandomKey,
  InternalCandidateIndex
)

Candidate128 = First128Bits(
  SHA256(
    UTF8("CharacterLab.Random.v1\0") ||
    CanonicalEncode(RandomCandidateInput)
  )
)

EffectiveRandomKey =
  Coupled(ComparisonDrawKey) if an explicit run-input mapping exists
  otherwise Natural(RandomAddress)
```

`Candidate128` interprets the first 16 digest bytes as an unsigned big-endian integer. `RandomAlgorithmVersion` is `rng/sha256-addressed-128-v1-candidate`. `ModelIdentity`, `ExperimentIdentity`, corpus membership, scheduler insertion order, and prior draws are deliberately excluded. The trace still records `ModelIdentity` and the local/effective address, so coupling never obscures provenance.

`RandomAddress` is a versioned record. `CausalRootId`, `PurposeId`, subject-role IDs, and subject IDs are stable typed identifiers. Subject bindings sort by `(SubjectRoleId, SubjectId)` unless the receiving seam contract declares a role to be ordered; duplicate role/subject pairs are invalid. `DrawIndex` distinguishes semantically repeated draws at one boundary. `InternalCandidateIndex` is private to range mapping and never changes the semantic draw identity.

### 6.1 Bounded uniform mapping

The authoritative span domain is:

```text
1 <= m <= 2^32
N = 2^128
limit = floor(N / m) * m
```

For `InternalCandidateIndex` 0 and then 1, compute a candidate under the candidate-output model above. Accept the first `x < limit` and return `x mod m`. If both reject, compute the fresh candidate at index 2 and return `x mod m` without another rejection. Invalid spans fail deterministically.

Under the declared analysis assumption that distinct SHA-256 candidate inputs behave as independent uniform 128-bit candidates, one rejection has probability:

```text
q = (N mod m) / N < 2^-96
```

and reaching fallback has probability `q^2 < 2^-192`. The fresh modulo fallback alone has total-variation distance at most `m/(4N) <= 2^-98` from uniform, so the complete mapping has total-variation distance less than `2^-290`. These bounds are part of the model contract; they are not claims that SHA-256 uniformity is mathematically proven. Exact distribution objects used for analytical probability calculations remain rational and do not substitute this pseudorandom assumption for their own normalization proofs.

Weighted authoritative choice requires positive integer weights, canonical item order, and:

```text
0 < totalWeight <= 2^32
```

Draw `u` from `[0,totalWeight)` with the same primitive and select the first cumulative interval containing `u`. Zero/negative weights, overflow, duplicate item IDs, or totals outside the domain fail deterministically.

### 6.2 Experimental coupling

Natural coupling uses the same `RunSeed` and semantically equal `RandomAddress` in each compared run. When competing models cannot preserve the same local address, a `ComparisonDrawMap` may appear as explicit canonical ordered run input:

```text
ComparisonDrawMapEntry = (
  LocalRandomAddress,
  ComparisonDrawKey
)
```

Within one run, local addresses and comparison keys are each unique; implicit many-to-one correlation is forbidden. Missing entries use the natural address. Duplicate entries, a map lookup after a draw at that local address, or a key whose declared comparison role does not match the receiving purpose fail deterministically. The trace records the local address, comparison key, candidate indexes, rejected candidates, accepted/fallback status, raw candidate used, and mapped result.

The map is included in the canonical ordered input sequence, `RunIdentity`, trace, and `ComparisonCase.CouplingSpecification`. It is never derived from `ExperimentIdentity`, and there remains exactly one authoritative random oracle.

### 6.3 Resolution status

These semantics are accepted for `RND-001` and `MATH-005`. Golden SHA-256/address vectors, range boundaries (`m=1`, `2`, `2^32-1`, `2^32`), forced rejection/fallback, weighted selection, coupling replay, unrelated-draw insertion, and integrated determinism all pass. The exact decision and reopen conditions are recorded in the closed Campaign 0 register.

## 7. Time and analytical advancement

Canonical time uses integer milliseconds:

```text
SimInstant  = signed 64-bit integer milliseconds
domain      = 0 .. Int64.MaxValue
SimDuration = signed 64-bit integer milliseconds
```

Negative instants are invalid. An advancement duration must be nonnegative. Subtraction, addition, and conversion are checked; overflow or underflow returns a typed deterministic failure and never wraps or saturates. The reference oracle may use wider exact intermediates, but a stored `SimInstant` must remain in domain.

Incidental observation must not change analytical state. Every analytically advancing state uses:

```text
AnalyticalAnchor = (
  ValueAtAnchor,
  AnchorInstant,
  GoverningParameterIdentity,
  ExactBoundedRemainder?
)
```

`GoverningParameterIdentity` must resolve through `ModelIdentity` or authoritative state to the complete parameters actually used; an unresolved friendly name is invalid. Reading `ValueAt(t)` materializes a derived value and does not mutate or re-anchor. A semantic event that changes the authoritative value or governing parameters performs, atomically:

```text
materialize old anchor through T
apply the semantic mutation at T
establish the new anchor at T
```

At one timestamp, later canonical phase/sequence work observes state produced by earlier work with zero elapsed duration between events. The global same-time convention is:

```text
1. materialize analytical state through T
2. process discrete work at T
3. discrete changes govern T-forward
```

Each analytical transition must specify whether advancing `A→C` is equivalent to `A→B→C` when `B` is only an incidental query:

```text
Advance(Advance(S,A,B),B,C) = Advance(S,A,C)
```

For a linear rate represented as integer `rate` over positive integer scale `D`, use exact floor division and a remainder in `0..D-1`:

```text
total     = retainedRemainder + elapsedMilliseconds * rate
delta     = FloorDiv(total, D)
remainder = total - delta * D
```

This rule is sign-correct for negative rates and makes incidental partitioning invariant. Re-anchoring after a truncated interval is forbidden. A semantically meaningful event partition may change results only because the event changes state, parameters, or a separately contracted history—not because the scheduler happened to query the process.

No nonlinear authoritative advancement is legal unless its seam contract specifies a deterministic exact or approximating algorithm, every quantization point, domain and failure behavior, partition rule, and a proven versioned error bound. Unspecified platform floating point is forbidden. Where no acceptable partition-invariant approximation exists, the model uses explicit semantically meaningful scheduled transitions rather than hidden numerical microticks.

These rules are candidate semantics for `TIME-001` and `MATH-001`; they remain open until direct/partitioned, same-time, re-anchor, negative-rate, and checked-overflow conformance vectors pass.

## 8. Save, load, and replay

Canonical serialization includes `ModelIdentity`, complete authoritative state, scheduler and allocator state, analytical anchors/remainders, and any explicit comparison-coupling input required to continue the run. Artifact schema metadata wraps the canonical payload. A valid round trip satisfies structural equality:

```text
Decode(Encode(S)) = S
```

Hash equality is a diagnostic, not proof of state equality. Replay compares canonical outputs, state transitions, failures, and trace records—not merely a final digest.

## 9. Implementation gate

No seam may rely on a default hidden in code. The applicable [Campaign 0 Conformance Vectors](CONFORMANCE_VECTORS.md) contain exact inputs/expected outputs and pass against the reference implementation. `CONTENT-001`, `RND-001`, `TIME-001`, `MATH-001`, and `MATH-005` are closed; any reopen condition in their resolution record blocks affected seams again.
