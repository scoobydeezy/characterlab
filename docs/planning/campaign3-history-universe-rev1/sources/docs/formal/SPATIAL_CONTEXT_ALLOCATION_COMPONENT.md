# Positive spatial-context allocation component

`spatial-context-allocation/0.1-candidate`. SHAPE ACCEPTED by primary-agent
adversarial review, 2026-09-11, at pure component scope only. This is a named
candidate beneath attention, not a SEM causal-role derivation. No canonical record,
identity, state leaf, source channel or public factory is accepted here.

## Evidence and meaning

An input list contains at most eight unique nonnegative detection ordinals. Each
entry has exactly DetectionId and optional Position. Position, when available, has
exactly X and Y, each an integer cell coordinate in [0,7]. The list is dense, plain
data and strictly increasing by DetectionId. Missing Position means unavailable
spatial evidence. It is not a coordinate, negative fact or peripheral member.

A model calibration supplies a nonempty closed rectangular focus region with integer
MinX, MaxX, MinY, MaxY in [0,7], and exact rational FocalWeight and ResidualPool in
[0,1]. This rectangle is a declared candidate attention calibration, not a world
fact, causal role, inferred goal, learned concern or hand-authored per-object flag.
Future task-relative focus must come through a separately governed source.

Known positions inside or on the boundary are SpatialFocal. Known positions outside
are SpatialPeripheral. An unavailable position is SpatialUnknown. These labels say
only how an observed position relates to the declared rectangle. In particular:

- SpatialPeripheral does not mean Incidental, uninvolved, unimportant or unrecognized.
- SpatialFocal does not mean Actor, threat, need-relevant or successfully selected.
- Neither label becomes CausalRoleEvidence240, a SEM feature, or a new evidence ref.
- A known causal Actor can be spatially peripheral; both facts remain separately
  traceable in a future composition. Missing role does not alter spatial membership.

The component returns each input DetectionId unchanged, its detached position when
present, its spatial class and its exact continuous Allocation. SpatialFocal gets
FocalWeight. If n SpatialPeripheral entries exist, each gets ResidualPool/n. Unknown
gets no allocation value, not numeric zero. No division occurs at n=0. Known members
retain explicit zero allocations when the calibration is zero. No top-K selection,
encoding, memory writing or coefficient quantization occurs.

Allocation is computed over the complete supplied spatial list before a future
selection stage. It must not be recomputed over winners or silently reapportion a
pool after selection. A future source contract must specify why this finite list is
complete for the declared scope and authenticate every coordinate. This mathematical
component neither supplies completeness evidence nor authenticates caller data.

## Relationship to required historical controls

MEC-005 remains CONTROL+CONTRACT. This candidate uses its residual-pool arithmetic on
a different explicitly named membership source. It does not replace or qualify the
historical Incidental-membership control. MEC-007 causal-role, category, relevance and
surprise factors remain separate. RET-002 stays retired: no per-object attention flag
is admitted. A comparison must name both membership and allocation laws; equal pool
arithmetic is not evidence that their semantic inputs are equivalent.

## Frozen proof vectors SCA-A..H

A. Exact closed rectangle endpoints and adjacent outside cells on all four edges.
B. Positive peripheral members share the pool exactly; adding another peripheral
   dilutes peripheral allocations while focal allocation stays fixed.
C. Missing coordinate stays Unknown and consumes no pool; known zero is distinct.
D. Detection ordinal relabelling cannot change classes or allocations.
E. Empty pool/list and extreme valid rectangles/calibrations are defined.
F. Sparse, unordered, repeated, extra-field, executable, malformed and out-of-domain
   inputs reject before getters execute; no input mutation or retained state exists.
G. Returned positions are detached, and outputs contain no truth/role/owner handle.
H. Applying a later selection mask does not change the preselection allocation.

Review conclusion: positive spatial evidence suffices for this limited geometric
classification, while causal Incidental evidence remains absent. Any future whole
attention claim still owes historical control disposition, actual evidence binding,
character ownership, encoding/retrieval and corpus execution. No parent closes here.
