# Deterministic Substrate

**Status:** foundation contract, version `substrate/0.1-draft`

**Scope:** rules shared by every executable seam

**Non-goal:** choosing psychological mechanisms

## 1. Model identity

Every run has an immutable identity:

```text
ModelIdentity = (
  RulesVersion,
  ContentVersion,
  ParameterSetDigest,
  NumericProfileVersion,
  RandomAlgorithmVersion,
  RegistryVersion
)
```

A state, trace, or save is uninterpretable without this tuple. `ParameterSetDigest` canonically commits to the complete authoritative parameter set; parameters may not remain ambient merely because they are numerous. A version or digest change creates a different model even when friendly names remain unchanged.

The phenomenon corpus is not part of the executable model and must not perturb random addresses or replay. Comparisons and verdicts instead use:

```text
ExperimentIdentity = (
  ModelIdentity,
  CorpusVersion,
  ComparisonSpecificationVersion
)
```

One execution is fully identified by:

```text
RunIdentity = (
  ModelIdentity,
  InitialStateDigest,
  InputSequenceDigest,
  RunSeed
)
```

The canonical initial state and ordered input sequence remain full run inputs; their digests identify them but never replace structural storage or comparison.

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

No map, set, object-property, filesystem, or discovery order is authoritative. Each collection states a total ordering over stable typed identifiers. Text encoding is UTF-8 after a specified normalization form; length framing and integer endianness must be part of the encoding version. Human-readable labels never serve as identity unless the registry explicitly says so.

## 6. Addressed randomness

A random draw is a pure lookup, not consumption from a mutable global stream:

```text
word = RandomWord(
  ModelIdentity,
  RunSeed,
  EventId,
  ScopeId,
  PurposeId,
  DrawIndex
)
```

The random contract must fix canonical field encoding, mixing/hash algorithm, output width, word-to-distribution mapping, rejection rule, maximum attempts, fallback behavior, and measurable finite-resolution bias. Different purposes require different stable `PurposeId` values. Adding an unrelated draw must not move another draw.

**Open decision RND-001:** select and prove the reference word-to-range sampler. The historical CharacterLab `k/2^64` mapping and Vivarium rejection sampler are controls, not yet authority; Vivarium's bounded retry plus modulo fallback requires an explicit bias analysis.

## 7. Time and analytical advancement

Time is an integer count of a declared base unit. Each analytical transition must specify whether advancing `A→C` is equivalent to `A→B→C` in the absence of intervening events.

```text
Advance(Advance(S,A,B),B,C) = Advance(S,A,C)
```

If partition invariance is required, fractional remainder or an equivalent exact accumulator must be authoritative. Re-anchoring after every truncated interval is forbidden unless the intended model explicitly depends on event partitioning.

**Open decision TIME-001:** define the global analytical-advancement contract and remainder representation. The Vivarium formula `floor(rate × elapsed)` is not partition invariant when each intermediate event re-anchors the calculation.

## 8. Save, load, and replay

Canonical serialization includes `ModelIdentity`, registry versions, complete authoritative state, scheduler state, and any required analytical remainder. A valid round trip satisfies structural equality:

```text
Decode(Encode(S)) = S
```

Hash equality is a diagnostic, not proof of state equality. Replay compares canonical outputs, state transitions, failures, and trace records—not merely a final digest.

## 9. Implementation gate

No seam may rely on a default hidden in code. If an unresolved substrate decision can affect a seam's output or verdict, that seam is blocked. The resolution must change this document's version and name the tests that prove it.
