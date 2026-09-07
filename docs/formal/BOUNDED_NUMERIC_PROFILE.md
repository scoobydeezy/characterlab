# Bounded exact numeric profile

**Status: ACCEPTED AND IMMUTABLE.** 2026-09-06.
Exact NumericProfileVersion: `numeric/exact-1`.

This records the bounded contract requested by the first-model byte review. It binds existing
accepted numerical semantics; it introduces no operator, allocation or universal numeric policy.
Its scope is the numerical operators reachable in AdmittedExecutionClosure of
rules/campaign2-bounded-bridge/0.1-candidate. RulesVersion requires this profile; it cannot define
or synthesize NumericProfileVersion. That field remains independently present in ModelIdentity.

## Exact semantics

The authorities are [substrate §§4–5 and analytical time](DETERMINISTIC_SUBSTRATE.md),
[observation](OBSERVATION_AND_EVIDENCE.md), accepted REG 0.5 and ADAPT 0.31. Their exact domains,
operation ordering and typed failure ownership remain controlling.

| Reachable operation | Bound semantics |
|---|---|
| Canonical integers | Signed mathematical integers and unsigned nonnegative integers; cenc/1 ZigZag/minimal unsigned LEB128 respectively. Reject nonminimal or wrong-kind encodings. No implicit signed/unsigned coercion. |
| Integer arithmetic | Exact arbitrary-precision addition, subtraction, multiplication and comparison; bigint operands in this implementation. No fixed-width wrap, truncation or host Number arithmetic on semantic quantities. Domain bounds are explicit seam checks, not machine overflow behavior. |
| ExactRational | Nonzero denominator; normalize denominator positive; divide numerator/denominator by gcd(abs(numerator), denominator); zero is 0/1. Addition, subtraction, multiplication and division are exact and reduced; division by zero rejects. Equality compares canonical pairs; ordering compares exact cross-products without overflow. |
| Floor division | For integer a and positive b, q=floor(a/b), r=a-q*b with 0<=r<b. In particular floor(-1/2)=-1. Nonpositive denominator rejects. Truncation toward zero is not a substitute. |
| TIME / REG | SimInstant is checked bigint in [0, 2^63-1]. SimDuration is checked signed Int64; checked addition rejects underflow/overflow, advancement rejects backward time. Existing TIME uses total=remainder+elapsed*rate; delta=floor(total/scale); new remainder=total-delta*scale; scale>0. Accepted REG materializes its immutable reference with that operation and validates its declared bounds. No reanchoring or numerical approximation is added. |
| Observation | Existing bounded-state-change interval arithmetic and comparisons use exact rationals. The admitted fixed pulse is before=0, after=1, potential/applied=1, overflow=0, bounds=[0,2], precision=1. It produces [1,1] under the accepted compiler. Provenance projection copies the measurement unchanged; no precision rescaling or rounding operation is applied. |
| ADAPT | Exact scaled-integer q=p+g*n*Step, with g from the accepted gate semantics. This specimen's five Always gates have g=1. Counts, prior magnitudes, steps, domains, baseline absence and result checks retain ADAPT/REG semantics. Scale metadata does not imply division, conversion, saturation or rounding. Invalid results fail rather than clamp or wrap. |

Floating point, implicit numeric coercion and implementation-native Number arithmetic cannot
compute authoritative magnitudes, rational components, time values or intermediates. Finite schema
dispatch, array positions, byte packing and collection traversal remain representation machinery;
they cannot convert semantic scalar operands into host-number arithmetic. Existing Number uses for
bounded phase/schema dispatch and bytes are not a second arithmetic profile.

## Deliberately outside this profile

SUB-002 general quantization, largest-remainder allocation, general dice/distribution arithmetic,
linear algebra, new saturation transforms, nonlinear integration, unit conversion and floating-point
approximations are not admitted. Shared CeilDiv/RoundEven implementations and other build-supported
operators do not become model operations merely by being present in the binary. This fixed pulse
requires no quantization, and its no-draw closure requires no random range-mapping arithmetic.
Future use requires an explicitly accepted profile/version binding; this contract does not close
future Campaign-2 numerical questions or retire their reference-ledger obligations.

## Existing implementation evidence and identity anchor

`src/substrate/exactMath.ts`, `canonicalEncoding.ts` and `time.ts`, the bounded OBS compiler,
`campaign2/regulatoryReference.ts` and `adaptationEvaluation.ts` realize the operations above.
Existing canonical-encoding, exact-math, time, observation, REG and ADAPT tests remain their proof
sources. This naming/authority closure changes no primitive, manifest value or canonical byte.

RandomAlgorithmVersion remains `rng/sha256-addressed-128-v1-candidate`. Its exact spelling is
already fixed in [accepted substrate §6](DETERMINISTIC_SUBSTRATE.md#6-addressed-randomness), at
line 173 in the reviewed source, and §6 records RND-001/MATH-005 acceptance. The implementation
constant is `src/substrate/random.ts:15`. No RNG rename or redesign is necessary, and zero draws
do not remove that independent ModelIdentity field.
