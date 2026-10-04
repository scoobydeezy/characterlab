# First maintenance-goal consequence relation

2026-09-12. Historical packet; [A with two clarifications accepted](GENERAL_ATTENTION_GOAL_RELATION_RESOLUTION.md).
Goal ownership/lifecycle are
accepted. This decision adds neither a significance score nor a retention update.

The accepted example exposes the old draft's limitation:

| Perceived transition | Goal | Boundary-only draft | Distance relation |
| --- | --- | --- | --- |
| 5→7 | [6,8] | Attainment | Moves closer, reaches range |
| 5→7 | [2,4] | No boundary change | Moves farther, stays outside |

“No boundary change” cannot be relabeled “worsening.” A new exact relation law is
needed if both examples are to be represented in this first experiment.

## A — conservative distance-to-goal relation (recommended)

For a point x and desired closed interval G=[g,h], propose the exact descriptive
distance d(x,G)=max(g-x,0,x-h). This is distance in the admitted experienced-signal
domain, not physical error, REG discrepancy, Need intensity, utility or importance.

For a closed observer-safe interval E=[l,u], the exact range of possible distances is:

    dMin(E,G) = max(g-u, 0, l-h)
    dMax(E,G) = max(d(l,G), d(u,G))

For before distance range B and after range A, propose:

- MovingCloser only if A.max < B.min.
- MovingFarther only if A.min > B.max.
- SameDistance only if both ranges are the same singleton.
- Otherwise IndeterminateRelation, carrying no invented signed amount.

Missing/inactive concern or missing evidence remains Unavailable. IndeterminateRelation
means valid interval evidence cannot settle direction; it is not SameDistance or zero
significance. Whether its public representation shares an Unavailable outer tag is a
later schema choice that must retain this distinct reason.

Preserve Within/Outside/Ambiguous for each endpoint as a separate derived relation,
so attainment/violation are not lost. Equal-distance moves across opposite sides of
the desired interval do not become identical events; the rule only assesses distance.
No magnitude is promoted to significance by this descriptive relation alone.

Examples in an abstract exact signal domain:

| Before/after evidence, goal[6,8] | Distance ranges | Proposed relation |
| --- | --- | --- |
| [4,5]→[6,7] | [1,2]→[0,0] | MovingCloser |
| [3,5]→[4,6] | [1,3]→[0,2] | IndeterminateRelation |
| [6,7]→[7,8] | [0,0]→[0,0] | SameDistance |
| [5,5]→[9,9] | [1,1]→[1,1] | SameDistance, different side |

Why not compare midpoints: overlapping evidence can be compatible with improvement
or worsening. The assessment must preserve that uncertainty. Two hidden histories
with the same admitted intervals yield the same relation.

## B — satisfaction-boundary-only baseline

Keep the earlier Within/Outside crossing rule as the first narrow candidate.
It recognizes attainment and violation but deliberately leaves improvement/worsening
while outside unrepresented. The5→7/[2,4] example stays outside this candidate's
expressiveness. This is a useful simpler comparator, not an equivalent reduction.

## Still outside either choice

Neither rule says how much the consequence mattered, or whether closer and farther
should reinforce equally. Concern weighting, adverse versus beneficial significance,
child/acquisition credit, persistent significance, saturation and survival priority
remain unresolved. Supported attribution still supplies target eligibility separately.
Use-protection stays equal in the eventual significance experiment.

Requested ruling: accept A's descriptive, interval-conservative relation as the first
assessment substrate, preserving B as a control. No scalar importance or memory write
is authorized by that relation alone.
