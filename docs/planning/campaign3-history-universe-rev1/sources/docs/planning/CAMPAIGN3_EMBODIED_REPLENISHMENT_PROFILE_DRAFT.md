# EMB-001 replenishment and bounded profile composition

2026-09-10, revision1. **Proposed semantics; not whole-shape accepted, allocated or
implemented.** Complements [registration/accessor](CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md).
This closes the proposed external physical intervention, not an action-success model.

## 1. Scope and substrate findings

The first BODY experiment needs a controlled change of physical reserve. Choose a
committed **external replenishment input** at phase110. It asserts delivered fuel in
the experiment's world, not intent, belief, observed relief or successful performance.
It is legitimate to author a world intervention; it is not legitimate to author
learned pressure or use this input to bypass an attempt/execution seam.

`state.ts` supports exact expected-prior set operations, declared writable-leaf and
sole-owner validation, value validation and structural mutation diffs. Thus no new
patch format or reserve-specific transaction system is needed. `traceBinding.ts` and
`CAMPAIGN2_TRACE_BINDING.md` use RecordKind=EventTypeId and complete input/output,
actual-read, patch, diff and emitted-event fields in TraceRecord160. Their old event
matrices are closed; new EMB rows require a separately committed profile.

MEC-003 retains bounded-effect decomposition; MEC-004 keeps overflow and true delivered
amount trace-side; MEC-019 preserves intent/attempt/outcome separation. CTL-001 remains
a control, not a new Need root. REG/ADAPT arithmetic and learning routes are unchanged.

## 2. Symbolic definitions and registration

| Record | Ordered fields |
|---|---|
| ReserveReplenishmentDefinition | CharacterId, ReserveParameterDefinitionId, UnitId, DeliveredAmount |
| ReserveReplenishmentInput | ReplenishmentDefinitionId |
| ReserveReplenishmentResult | Before, PotentialEffect, Applied, Overflow, After |
| ReserveReplenishmentRegistration | OwningSeamId, SeamVersion, InputRecordSchema, InputOrigin, DefinitionIds, ReadDomain, WritableFamilies, MutationAuthorityId, OutputRecordSchema |

Use existing governed definition IDs with exact new kind/version qualification.
DefinitionIds is a canonical set of the exact allowed replenishment definitions.
InputOrigin uses the closed InputOnly event-type/phase declaration with Phase=110.
InputRecordSchema is exactly ReserveReplenishmentInput. There is exactly one registration
for the first profile's replenishment event type; definition resolution selects its
fixed target/amount, never a caller-provided patch, actor, state path or success flag.

DeliveredAmount is an exact rational e≥0 in the bound fuel unit. Unit and parameter
definition must equal that character's immutable body binding. The target has the
existing qualified CharacterId role. It comes from **world intervention definition**,
not a claimed observer: no ObserverId field, roster lookup or PRJ subject alias is
appropriate for this truth-side input. Character-relative sampling still uses IDN.

ReadDomain is the finite set of admitted reserve anchors. WritableFamilies is exactly
the reserve anchor family already declared, with sole authority
`authority/embodied-reserve`. The selected write path must equal the definition's
character key; family-wide ownership is not permission to choose another body.
No belief, memory, identity, regulatory displacement, competence or relationship
family is writable. No transition-route membership in learning or automatic adaptation
is added: direct physical replenishment is neither route's evidence.

## 3. Admission and update law

Only original ordered-input compilation may schedule this source, at DueAt strictly
after initial clock, empty dependencies/parents and the committed event type/phase.
Multiple inputs at the same time remain ordered by original EventSequence. Runtime
source creation/cancellation, copied event bytes and outputs from pressure, intent,
SEM or EVID do not authenticate it. Restore uses exact original pending-source equality.

After authenticating the source, resolve its registered definition and exact body
binding. Use the precompiled direct reserve-anchor accessor to read precisely one
anchor from the current **staged** state. For anchor(q_a,t_a), capacity C, rate r and
input time T:

```text
Before = max(0, q_a-r*(T-t_a))
PotentialEffect = e
Applied = min(e, C-Before)
Overflow = e-Applied
After = Before+Applied
new anchor = (After,T)
```

Validate domains before arithmetic: no backward time, negative amount/rate, missing
anchor, invalid initial range or mismatched binding/unit. Invalid input is not clipped
into validity. The saturation above models finite storage, not REG error handling.

Return one set operation for the exact anchor leaf, expected presence=true and exact
old anchor bytes, new value=(After,T). Apply through existing WRT/owner/value checks.
No removal, root replacement, creation of a missing body or write to another key.
Even a zero delivery uses this same materialize/reanchor rule; it cannot increase
fuel. Two equal-time operations each read the earlier staged result and use that
result as their own expected prior. A stale patch rejects, never overwrites.

One ReserveReplenishmentResult records the exact decomposition as a **trace-side
output projection**, not an admitted downstream input. It needs no independent
occurrence namespace: its owning source event already identifies this one result.
No ObservationId, evidence reference, learned baseline or opaque second provenance
ID is minted. A later consumer requiring independent domain admission must explicitly
revisit that output contract; generic ingress cannot consume this anonymous value.

The result's materialization arithmetic is exact, with no quantization operations.
The direct read trace records the old anchor, not a synthetic materialized state leaf.
Reanchoring records real state mutation; pure sampling never does. Same final q under
split deliveries does not imply equal traces, anchor history or event identities.

## 4. Combined local schedule and allocation

For S sampling opportunities and R replenishments at T:

| Surface | Exact bounded profile count |
|---|---|
| Original source events at T | S sample inputs at10, R replenishment inputs at110 |
| Generated events | 5S (sampling chain11,12,13,14,60); replenishment emits none |
| Total domain events | 6S+R |
| Runtime occurrence advances | 3S; replenishment uses none |
| Sample / pressure outputs | S each |
| SEM227 outputs | One per present sample; none for unavailable |
| Replenishment result / patch | R results, R single-anchor set operations |

Original source IDs/sequences are allocated by ordered-input compilation; runtime
generated child IDs/sequences are separate. Each unavailable sampling branch consumes
its private experience padding ordinal. Replenishment does not invent a truth occurrence
merely to balance the sampling budget. Registered trace infrastructure overhead must
remain explicit if the eventual profile adds any; these are domain counts.

All sampling chains at T finish pressure60 before replenishment110. A replenishment
at T cannot revise current experience14 or pressure60 at T. Its effect can appear at
the next admitted current sampling time T'>T. There is **no consequence120 observation**
in this profile; including it would require another topology and budget review.
Simultaneous deliveries to the same body read staged anchors in scheduler order;
different-body interventions cannot change another body's anchor or sample inputs.

No synthetic phase0 event or materialization patch is added. q(T) is the exact pure
view of the retained anchor at the current lane's cutoff; future110 work is excluded.
This makes explicit the earlier drafts' phase0 wording: the accepted temporal boundary
is respected without storing a second materialized q or spending a new event ordinal.

## 5. Proposed TraceRecord160 mapping

All rows retain canonical EventId/sequence/time, RecordKind=actual EventTypeId,
ModelIdentity/RunIdentity, matching phase/seam version and actual emitted children.
No draft version may be emitted by canonical runtime. Exact input/output rows:

| Event | InputProjection | OutputProjection | Actual state reads | Patch/diffs |
|---|---|---|---|---|
| sample10 | Exact LevelSamplingOpportunity | singleton present or unavailable sample | IDN; one reserve-anchor read iff permitted+available | empty |
| slots11..13 | Exact private chain carrier | empty list | none | empty |
| settlement14 | Exact private chain carrier | singleton227 if present, empty list otherwise | none | empty |
| pressure60 | Exact admitted sample | singleton EmbodiedPressureOutput | IDN only | empty |
| replenishment110 | Exact ReserveReplenishmentInput | singleton ReserveReplenishmentResult | one target reserve-anchor read, no IDN | one complete set patch and its checked diff |

This table proposes canonical list output projections consistently, including empty
and singleton cases. Source definitions/actual producer ancestry use existing trace
source fields and frozen registry context. A trace-only replenishment result is not
added to character provenance. Pressure's evidence support remains the embedded exact
sample; it gains no trace reader or world-result handle.

Private chain carrier is proposed as a closed `PresentSampleCarrier(Sample,
ReservedExperienceId)` / `UnavailableSampleCarrier(Sample)` union. It is not an
admitted cognitive payload; it is checked against the private live source association
at every child. Reservation identity in a carrier cannot mint a real reservation.
Padding never has a semantic ID in the carrier. No body values enter either branch.
The exact carrier field/tag allocation remains part of symbolic/numeric inventory.

Read domains and actual reads must agree with the selected branch. RNG and rounding
operations are empty in every row. Fixed profile validation verifies output count,
schema, source identity, parent chain, read ownership and exact mutation projection;
record160 alone does not prove those relationships. No old trace profile is widened
because it already serializes arbitrary canonical values.

## 6. Restore and failure composition

Save only after whole-instant commit. Restore must check both sample and replenishment
pending InputOnly subsets against scratch compilation of the exact original manifest,
including empty subsets. No sampling child may survive as pending across a saved
boundary. Old results/observations stay exact historical bytes; never recompute a
sample using the latest anchor or regenerate result history from the current reserve.

Failure during any replenishment at T rolls back that instant's earlier replenishments,
sampling outputs/pressure, SEM reservations, queue changes, event/runtime/sequence
allocators and state mutations. Existing substrate transaction ownership supplies
this behavior; a source-local try/catch cannot commit its successful prefix. Failures
do not turn a delivered amount into an unavailable sample or partial success.

## 7. Proposed controls — NOT PASSED

| ID | Witness |
|---|---|
| EREP-A | q95,C100: e5/e9 yields identical After100 and Overflow0/4; later permitted level evidence matches. |
| EREP-B | Zero delivery cannot raise reserve; invalid negative delivery rejects before patch. |
| EREP-C | Two same-body inputs read staged predecessors; reused earlier expected anchor fails stale-precondition validation. |
| EREP-D | Wrong valid character path, non-owner, undeclared root and missing anchor reject at their owning boundaries. |
| EREP-E | Pressure, intent or copied source event cannot mint replenishment; only original physical input succeeds. |
| EREP-F | Sample at T precedes refill at T; next-time sample may change, frozen current sample/pressure cannot. |
| EREP-G | Extra result occurrence allocation or emitted child violates the zero-runtime/zero-child replenishment budget. |
| EREP-H | Result trace exposes complete decomposition but no character evidence reference; hidden overflow never enters pressure. |
| EREP-I | Later same-instant failure restores earlier body patches and all sampling/allocation effects. |
| EREP-J | Restore preserves exact remaining sample and replenishment inputs; missing either family rejects. |
| EREP-K | Direct read reports anchor; changed parameters/model cannot reinterpret historical results. |
| EREP-L | Equal outcomes under split inputs do not authorize aliasing event IDs or rewriting history. |

## 8. Remaining whole-profile work

The physical writer, local budget and trace mapping now have explicit proposed
semantics. Whole shape still requires a consolidated symbolic inventory of records,
roles, members, definition dispatch, validators and failure codes across the packet;
the fuel token needs separate versioned fixed-member acceptance. Review all read/write
and output paths together before allocation. This is not yet public BODY qualification.

The experimental limitation is deliberate: externally replenished reserve proves no
action efficacy, acquired Need, motive competition or learned preference. Non-task
action knowledge and reason receiving remain necessary before the full BODY+MULTISOURCE
target can be claimed. These missing paths block that claim, not this bounded proposal.
