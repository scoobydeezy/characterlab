# TRC-004 — typed evidence coverage and correlation consolidation

Status: DRAFT; mathematical direction reviewed, whole shape not yet accepted.
Version: reason-evidence-coverage/0.1-draft.
Owner: reason-source provenance and consolidation, not evidence creation.
Dependencies: cenc/1; exact rational substrate; admitted source/atom contracts;
the pending raw-signal/Reason contract. No numeric allocation or implementation.

## Historical authority inspected

REFERENCE_MECHANISM_LEDGER SUB-007 requires the actual aggregate-coverage mechanism
and the {1}, {2}, {1,2} regression. RET-009 retires the former pairwise-maximum rule.
reference/src/kernel/evidenceOverlap.ts defines union-max coverage, weighted Jaccard
overlap and descending-magnitude/canonical-source ordering. The reference tests
execute that component, and the current preserved suite passes. This draft ports
those exact mathematics; it does not substitute a more attractive independence law.

## Purpose, domain and codomain

A basis records which already-admitted evidence a source covers. It does not create
evidence, assign confidence, assert causal independence or grant a dereference handle.
New workspace/appraisal/concern occurrences are not new observations merely because
they describe one retained forecast at several causal stages.

Symbolic shapes, field numbers unallocated:

* ReasonEvidenceBasis: Weights, a canonical map from admitted typed evidence atom
  references to exact positive rational coverage weights.
* Internal coverage operand: SourceKey, Magnitude, Basis. This is a pure function
  argument derived from admitted TaskRawSignal, not a canonical record to allocate.
* CoverageResult: SourceKey, RawMagnitude, OverlapWithPrior, IndependentFraction,
  EffectiveMagnitude.

SourceKey must be the complete admitted raw-signal key, not a caller string, an
ordinal magnitude or an invented synthetic identity-channel tag. Magnitude is exact
and nonnegative; the caller has already partitioned contributions by semantic nucleus,
source role and contribution sign. Weights have no negative values. Zero weights are
canonically omitted, with lookup absence defined as zero. Empty basis is permitted.
Duplicate source keys or atom keys reject rather than silently overwriting a map.

The source contract must close the exact atom kinds and their provenance. Current
measurement concern can use existing Observation references from361; a future standing
identity source must use its actual qualified-expression support through its own
accepted schema. No arbitrary TypedIdentifierValue is admitted merely by having a
namespace. Final atom union/roles, source-key schema and profile cardinality limits
remain blockers to whole shape acceptance. Do not mint parallel evidence identities.

## Exact mathematics

For sparse bases A and B, with absent weights zero:

    Overlap(A,B) = sum_x min(A[x],B[x]) / sum_x max(A[x],B[x])

If the denominator is zero, overlap is zero. For prior bases B_1..B_k:

    Aggregate[x] = max_i B_i[x]

The empty aggregate is the empty map. Within one sign/role/nucleus partition, order
contributions by decreasing Magnitude, then complete canonical SourceKey bytes.
For each contribution j:

    O_j = Overlap(Basis_j, Aggregate(Basis_i for i<j))
    IndependentFraction_j = 1 - O_j
    EffectiveMagnitude_j = Magnitude_j * IndependentFraction_j

Append the raw basis to prior coverage even when its effective contribution is zero.
The partition's consolidated magnitude is the exact sum of EffectiveMagnitude_j.
Only the owning reason contract later nets positive and negative partitions and
applies its bounded response. This seam performs neither operation implicitly.

No division by zero, clipping, rounding, RNG, covariance estimation or learned weight
is introduced. Every overlap and independent fraction lies in[0,1], and every
effective magnitude lies in[0, its raw magnitude]. Finite admitted input bounds make
the procedure total. Invalid operands fail; they do not become empty evidence.

## Important limitation exposed by actual inspection

Weighted Jaccard is not an arbitrary subset-coverage test. If prior aggregate is
{a,b,c} and the current basis is {a,b}, all current atoms occur in prior coverage,
yet overlap is2/3 and a residual1/3 remains. Do not claim every fully covered subset
is eliminated. The required {a}, {b}, {a,b} fixture has aggregate exactly {a,b}, so
the final overlap is1 and the final effective contribution is zero.

Preserve this limitation as an experimental property of the retained initial
consolidator. Changing its denominator to current-basis mass would be a different
mechanism requiring a named comparison and verdict. It cannot be smuggled in as a
bug fix or as the meaning of the word independence.

## Application to the current sensory forecast

The proposed measurement source gives each distinct support Observation reference
one unit of coverage. This is a fixed membership measure, not a reliability score,
mean coefficient, reward, confidence or fractional credit assignment. It is not
normalized by support count. The mean's arithmetic remains in the prediction seam.

Two descriptions of the identical support set therefore overlap1. A concern source
and another description of its exact forecast must not gain independent weight by
using their own new output IDs as atoms. Distinct observations retain distinct typed
references. No occurrence's numeric payload is interpreted as evidence quality.

An initially adopted commitment has no observational basis. Empty-basis overlap0
does not make duplicate copies legitimate: the raw-source contract must guarantee
one generating source per actual task/option origin. Duplicate prevention and
correlation discounting are separate boundaries and both require negative controls.

## Read/write and epistemic boundaries

ReadDomain={}; WritableStateFamilies={}. Inputs are authenticated immutable source
operands. No state, registry iterator, observation archive, trace, truth graph, world
outcome, REG reference or identity object is exposed to the math. Atom references
are equality/coverage keys only. The consumer cannot use them to retrieve evidence.

The reason-compilation transition's trace records source contributions, ordered
coverage results and final role sums without asserting fresh state reads. The raw
transition supplies the authenticated signals but does not run consolidation. This pure component
does not allocate an output occurrence or publish a standalone psychological record.
If a later seam makes CoverageResult a semantic output, it needs explicit output
admission and identity rules rather than relying on this internal calculation.

## Timing, canonicality, failure and persistence

The owning phase80 transition applies this component after live source admission.
Canonical ordering is independent of input enumeration. Evidence atom equality
includes the complete typed reference. Source-key comparison is only a tie-break;
its identity payload cannot alter strength directly.

Any validation, output, trace or subsequent same-instant failure rolls back through
the owner. The component maintains no mutable cross-event cache and creates no new
save section. Frozen historical source/coverage meanings remain bound to the original
model and expression, not recomputed from later calibration.

## Proposed frozen vectors and comparisons

TRC4-A..L, all NOT PASSED for the new seam:

1. Empty bases and first contribution retain the defined zero-overlap behavior.
2. Identical nonempty evidence discounts a later duplicate to zero.
3. Disjoint evidence retains full weight; partial weighted overlap is exact.
4. {a}, {b}, {a,b} detects retired pairwise-max consolidation.
5. Larger aggregate versus covered subset preserves the explicit2/3 case.
6. Contribution enumeration permutations preserve canonical results and ties.
7. Negative, duplicate, unknown or unadmitted atoms/keys reject.
8. Same forecast described twice retains the same original support atoms.
9. New appraisal/concern occurrence IDs cannot masquerade as independent evidence.
10. Duplicate empty-basis generating facts reject at raw-source admission.
11. Role and sign partitions remain separate until the reason contract nets them.
12. Actual historical parity, exact arithmetic, no reads/writes and owner rollback.

Reference overlap/consolidation, retired pairwise-max, naive summation and a separately
named directional-coverage candidate are controls. The last is not the canonical
choice. General reliability learning, probabilistic dependence, causal attribution
and evidence quality remain deferred. Final atom/source admission must close before
records, roles, registration or any permanent allocation is accepted.
