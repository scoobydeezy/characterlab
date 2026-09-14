# Independent graph scarcity: loss unit decision

2026-09-12. **DECISION REQUIRED.** General Attention remains OPEN.
Independent graph lifecycle requires finite node and edge accounting. Accepted
zero-state normalization removes only empty structure; it authorizes no positive-edge
forgetting policy.

## Inspection and evidence

MEC-008 / CTL-003 preserve row-substochastic association learning; MEC-009 preserves
exact spreading and filtered retrieval. Row mass and the component's 32-key safety
bound are not cognitive forgetting policies. No historical mechanism is newly ported.

[Three executed witnesses](GRAPH_SCARCITY_BOUNDARY_TESTS_REV1.json) use actual learning,
normalization and direct/spread components:

- GS-A: symmetric coactivation yields asymmetric weights after row normalization:
  a→b = 0.67 and b→a = 0.80. Three nodes hold six positive directed matrix entries.
- GS-B: three nodes can hold three or six edges; two edges can occupy two or four
  nodes. The two resource counts are independently relevant.
- GS-C: an explicit single directed-edge loss preserves learned contribution 4/15
  to a surviving episode; whole incident-node loss removes it. No target is invented.

These are supplied-operand distinctions, not public scarcity qualification. No victim
selection or new learned-state field was implemented.

## Alternatives

**A — directed positive edges as the elementary loss unit (recommended).** Charge
one edge slot per positive directed matrix entry and one node slot per semantic key
with a positive incident edge. Use separate finite node and edge budgets. Resolve
the complete learning/weakening batch before applying the declared loss plan and
normalizing exact empty structure. Remove selected weights without redistributing
mass into survivors; reverse-direction weights remain separate.

Node pressure requires removing enough incident edges to free nodes. Merely satisfying
the edge budget is insufficient; one arbitrary edge deletion need not free any node.
The eventual policy must satisfy both bounds, including modeled zero-capacity loss.
This proposal supplies no greedy ordering, victim priority or implicit protection of
newly learned edges. Preserve whole-node eviction as the coarser comparator.

**B — whole semantic-node eviction, including every incident edge.** Keep separate
node and edge budgets, but resolve either pressure through whole-node loss. This
simplifies the operation while coupling survival of distinct learned relations.
An explicit node priority would still be required.

## Review and boundaries

Recommend A because the accepted representation independently weights directed
relations. This is an architectural choice: GS-C shows its behavioral consequences.
Empty-node normalization does not prove positive-edge loss neutral; GS-A prohibits
assuming symmetric weights; GS-B prevents treating one generic capacity as both counts.

Neither alternative equates strength with survival priority, borrows episodic age,
introduces familiarity, or authorizes retrieval-time writes. Canonical order can break
exact ties but must not silently become the psychological priority. Graph-only keys
remain legal; episodic loss does not prune them. Direct episodic cueing stays independent.

Priority and evidence basis, capacity values, complete-barrier invariance, public
learning admission, sole-owner integration, loss reporting, replay and persistence
remain open. No body graph, allocation, public model or corpus commitment is added.
The mandatory episodic acquired-protection comparator remains outstanding.
