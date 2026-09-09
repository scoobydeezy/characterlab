# Exact bounded measurement-prediction numeric profile

Status: **ACCEPTED by agent self-review**,2026-09-09.
NumericProfileVersion: **numeric/measurement-prediction-exact/0.1-candidate**.
Applies only through the separately committed measurement-prediction RulesVersion.
This does not amend the immutable numeric/exact-1 profile or earlier model identities.

## Inherited operators

The earlier source seams retain exact integer/rational arithmetic, cenc/1 reduced
representation, TIME/REG checked temporal domains and analytical formulas, diagnostic
observation division and ADAPT's exact integer candidate validation. Their accepted
contracts remain the semantic authorities. No new quantizer, saturation, conversion,
random draw or physical interpretation is introduced here.

## New reachable operators and domain

The new expectation predicts one declared diagnostic channel's future reading.
The admitted scalar x is an exact point k/10 with integer0<=k<=100, already carried
in203; it is not calculated from REG by the cognitive consumer.

Prediction state is absent, or consists of mean m and a nonempty set of n existing
observation references,1<=n<=64. Cardinality is an exact mathematical integer, not
a floating-point approximation. Distinctness is identity membership, not statistical
independence or confidence. A fresh observation when n=64 fails before arithmetic.

Absent prior yields x and its singleton support. Otherwise, for n<64:

    nextMean = (n*m + x)/(n+1)

All additions, products and divisions use arbitrary-precision integers/reduced
rationals. Denominator n+1 is strictly positive. Normalize to positive denominator
and gcd1, zero0/1. There is no intermediate or commit rounding. Compare by exact
cross-products, never epsilon. No implicit signed/unsigned coercion or host Number
arithmetic computes semantic quantities.

Induction gives nextMean in[0,10] and its reduced denominator divides10*(n+1).
The largest applicable support count is64; a valid stored mean has denominator
at most640 and absolute numerator at most6400. These are consequences/checks of
the domain, not a clipping rule. A present zero remains present because its support
is learned content. Unknown/absent is never supplied as a fictitious zero operand.

Those necessary invariants do not authenticate a forged history. The live producer,
PRJ/IDN, sole authority and complete-prefix restore contract supply that proof.

## Exclusions and controls

No uncertainty/confidence, source trust, decay, censored-bound inference, reward,
value, action attribution, covariance or general aggregation law. Last-reading,
constant-gain and historical quantizing estimates are research controls, not
alternative operators admitted by this production profile. The executed algebra
exploration is evidence of the exact distinctions, not runtime qualification.

The profile has zero RNG draws. Its independent RandomAlgorithmVersion remains
the accepted addressed-RNG identifier; PERSIST-I remains deferred. Later dice or
general exact-distribution operations need their own explicit numeric binding.
