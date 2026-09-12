# Bounded attention selection component

Version: `attention-selection-component/0.1-candidate`, 2026-09-11.
Status: **SHAPE ACCEPTED by primary-agent adversarial review under the user's
explicit autonomous implementation authorization.** This is a mathematical/access
component checkpoint beneath the still-open public `attention-selection/0.1-draft`.
No external review, public runtime admission or whole ATTN acceptance is claimed.

## Scope and input authority

Implement the supported-role portion of [closure revision2](../planning/CAMPAIGN3_ATTENTION_CLOSURE_REV2.md).
The component consumes existing frozen SEM experience/bindings and companion claims,
validates their exact structural, observer, time, carrier and derivation consistency,
and computes selection. It does not authenticate that a public scheduler produced
those products. A future public adapter must supply the actual private occurrence
admission and PRJ/IDN projection; a component-created view is not that admission.

No world/body, registry, state, random, archive or caller resolver capability enters
this component. It allocates no persistent identity, writes no state and emits no
new canonical record. In-memory pool/view tokens are revocable capabilities, not
occurrence IDs. Outputs returned for selected reads are copies of existing canonical
SEM binding/claim bytes. Diagnostic audit structures are component results only,
not an alternative canonical trace, persisted schema or original-input format.
Therefore this component has no permanent numeric allocation surface. Allocation
for public AttentionSelection/processing records remains a separate later gate.

## Exact finite contract

One observer, one nonempty-or-empty existing experience, at most one event-file,
at most3 distinct event/continuant pairs, at most6 perceived bindings and6 claims.
For a public all-denied source a future separate completion branch remains necessary;
an empty component experience is a mathematical zero-unit input, not proof that the
source may reserve an empty SEM. Classification arrays and unrelated evidence are
excluded in this first component domain. Experience/binding/claim transformation
versions must be accepted SEM versions, not arbitrary attention strings.

Claims are complete for the experience's perceived bindings under the unchanged
initial causal-role rule. Validate against `deriveCausalRoleEvidence` using an exact
same-experience binding index and each claim's existing identity; any validation
recomputation creates no new production occurrence or source record. Missing/extra/
foreign/misderived claims, duplicate binding/claim occurrences and duplicate semantic
claims reject. Unknown or inexact observed role may legitimately derive zero claims.
No arbitrary client evidence-index metadata is trusted; derive the index from actual
binding values and the enclosing experience, preserving their observer/time/carriers.

Units retain all claims. Zero roles excludes with MissingRole; multiple distinct
roles excludes with MultipleRoles; one unsupported role excludes with UnsupportedRole.
For supported roles Actor/Target/Participant, priorities are exactly1,9/10,3/5.
Capacity is integer0..2. Units sort by descending exact priority, then canonical bytes
of `[event-file value, continuant-file value]`. Select min(K,eligibleCount).
No additional unit ID is allocated. Identity bytes break ties only, not scores.

Separate exported comparison components implement equal priorities1 with the same
finite capacity, and unlimited selection with the same role priorities. These are
explicit controls; unlimited selection does not pass the reference capacity law.
No residual-pool, category, surprise, Need, salience, encoding, retrieval or learning
math is implemented. Historical residual and multiplicative budget controls remain
preserved, unported dependencies of later research.

## Selected-only authority

The pool token is opaque and carries privately copied validated data. Its audit is
available only through an explicit diagnostic function returning fresh copies. The
consumer view is a different opaque token containing only selected binding/claim
canonical bytes and exact permitted references. It contains no pool token, original
SEM, full audit, observation payload, state or generic resolver. Selected bindings
may name supporting observations as opaque provenance; observation lookup is denied.
A known unselected occurrence ID grants no permission.

Consumption requires an exact set of requested references, with no duplicates. Every
request must belong to the selected index and be a binding or causal-role reference.
Consumption is one-shot, including failure; close revokes unconsumed views. Token
shaped copies are invalid. Read results copy bytes so caller mutation cannot affect
another result or pool. An empty view may be consumed with an empty request list.
This lifecycle is component authority only; scheduler binding/rollback/replay await
the public adapter. No statement about current public phase40 execution follows.

## Frozen component vectors AC-A..L (initially NOT PASSED)

| Vector | Required distinction |
|---|---|
| AC-A | Three supported roles, exact priorities, K0/1/2 and zero units. |
| AC-B | Actual SEM role permutation changes selected identity; equal-priority and unlimited alternatives differ on named cases. |
| AC-C | Missing/unsupported/multiple roles excluded without fallback or largest-role collapse. |
| AC-D | Missing, forged, duplicate or wrong-observer/experience/time claim rejected using actual SEM derivation. |
| AC-E | Capacity and finite domain invalidity reject, including noninteger and more than3 units. |
| AC-F | Input order invariance, canonical tie behavior and strict-priority identity renaming. |
| AC-G | Selected binding/claim reads succeed with exact canonical bytes; direct unselected and observation-parent lookup fail. |
| AC-H | Forged, reused, closed and failure-consumed view tokens reject. |
| AC-I | Input/audit/read-byte mutation cannot change pool/selection/consumer authority. |
| AC-J | Duplicate request/ref/claim cannot enlarge capacity or cause repeated reads. |
| AC-K | No state/identity allocation; all original SEM input values remain unchanged. |
| AC-L | Fault substitutions in ranking, capacity, role exclusion and selected-index construction are detected; old authority fingerprints preserved. |

Review: this component is useful but insufficient for AT2-A..N public qualification.
The remaining producer, public carriers, registration, allocation, exact model,
phase40 graph, trace, rollback and complete-prefix persistence remain explicitly open.
