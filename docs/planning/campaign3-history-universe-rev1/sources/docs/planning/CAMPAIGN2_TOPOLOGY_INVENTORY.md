# Campaign 2A — Thin Topology Inventory

**Status:** accepted as the working Campaign 2A topology inventory (2026-09-04). Version `campaign2-topology-inventory/0.5-draft` — 0.5 separates logical-family completeness from materialized storage/ownership completeness; unmaterialized families require no dummy roots or authorities. This update is a working draft pending final ADAPT composition. Not a seam contract; it authorizes no implementation.

This document exists because `STATE_MODEL.md` carries ten state families whose mutation authority is
marked *unresolved specification*, under a prohibition that outranks the campaign plan:

> "Proposed" is not permission to implement. The seam ledger must replace each unresolved row with a
> versioned contract before code writes that state.

Campaign 2's own entry rule says the same thing from the other side: *"Before implementation, create
a versioned seam contract for every canonical edge needed by one traversable event. Register sole
mutation authority for every persistent target, including Values and regulatory adaptation."*

This inventory maps the ten families onto seam edges, open decisions, routes, and their preservation
obligations. It proposes no contract, allocates no identifier, and authorizes nothing.

---

## 1. What is already registered

Three mutation authorities exist today, all from accepted `SEM-001I.3`, all in the accepted global
`1025 MutationAuthorityId` namespace:

| Authority | State family it owns | Status |
|---|---|---|
| `authority/perception` | perceptual continuant-file state, perceptual event-file state (roots 241, 242) | accepted |
| `authority/recognition-knowledge` | candidate catalogs, identity-symbol mappings (root 243) | accepted |
| `authority/recognition-resolution` | append-only recognition resolution log (root 244) | accepted |

None of the ten unresolved rows is among them. Campaign 1 registered the *character-relative
epistemic* state a perceiver needs to answer "who and what is this?". Campaign 2's ten rows span
three state classes — eight `learned persistent`, one `character-relative epistemic` (row 7, person
models), and one `dynamic embodied` (row 9, regulatory adaptation) — none of which anything yet
writes.

The `1025` namespace was accepted naming this expansion explicitly: *"Every state family —
perception now, belief, memory, regulation, identity, habits, skills and relationships later — draws
from this one namespace."* No new namespace is needed for any row below.

---

## 2. The ten rows

State families as `STATE_MODEL.md` names them. **Row 1 and row 5 are renamed here** — §5 gives the
reasons; the other eight names are carried across unchanged.

| # | State family | Authority when materialized | State class | Route | Writing seam edge | Gating decisions |
|---|---|---|---|---|---|---|
| 1 | **Belief / Expectation State** *(was "immediate belief/expectation evidence")* | `authority/belief-expectation` † | Learned persistent | Character learning | `evidence → belief/person model` | `ORD-001` |
| 2 | Episodic / imprint memory | `authority/episodic-memory` † | Learned persistent | Character learning | `encoding ↔ memory/recognition` | — |
| 3 | Associations | `authority/associations` ‡ | Learned persistent | Character learning | `learning evidence → consolidation/state` | — |
| 4 | Values | `authority/values` ‡ | Learned persistent | Character learning | `learning evidence → consolidation/state` | `DEC-001` if decision-driven |
| 5 | **Procedural Skill** *(actual competence only)* | `authority/procedural-skill` † | Learned persistent | **Automatic adaptation** | `actual exposure/practice → embodied or procedural adaptation` | `ADAPT-001` |
| 6 | Habits | `authority/habits` ‡ | Learned persistent | Character learning | `learning evidence → consolidation/state` | — |
| 7 | Person models | `authority/person-model` † | Character-relative epistemic | Character learning | `evidence → belief/person model` | `ORD-001` |
| 8 | Relationships | `authority/relationships` ‡ | Learned persistent | Character learning | `learning evidence → consolidation/state` | — |
| 9 | Regulatory adaptation, tolerance, sensitization, accumulated load | `authority/regulatory-adaptation` ‡ | Dynamic embodied | **Automatic adaptation** | `actual exposure/practice → embodied or procedural adaptation` | `ADAPT-001` |
| 10 | Self / identity / disposition | `authority/identity` † | Learned persistent | Character learning | `DecisionExpression → identity evidence → future standing modifier` | `DEC-001` |

‡ settled by review (§8). † proposed here; each is named for the state family whose writes it
governs, never for a producing process, per the Campaign 1 naming principle.

Every writing edge above is marked `blocked` in the seam ledger, with no formal contract: ten state
families across five distinct seam edges, none contracted.

---

## 3. Route partition

`STATE_MODEL.md`'s *Evidence-route separation* rule assigns each family to exactly one route, and
enumerates the assignment rather than leaving it to judgement:

- **Character learning evidence** — "may feed beliefs, expectations, memories, person models,
  relationships, values, habits, or identity through their registered authorities."
- **Automatic adaptation input** — "may feed only the registered regulatory or procedural adaptation
  authority."

| Route | Rows |
|---|---|
| `route/character-learning` | 1 belief/expectation · 2 memory · 3 associations · 4 values · 6 habits · 7 person models · 8 relationships · 10 identity |
| `route/automatic-adaptation` | 5 procedural skill · 9 regulatory adaptation |

OutcomeLearningEvidence is the accepted concrete character-learning output witness;
AutomaticAdaptationInput is the automatic input family. Neither is a LearningRouteId.

The rule continues: *"No record crosses between these routes implicitly. If one event legitimately
affects both, the observation seam and the truth-side adaptation seam emit separate records with
distinct provenance."*

**This rule is accepted and has no executable proof**, because nothing yet writes either route.
Proving the partition before either route has contents makes it a registration exercise; proving it
after 2B.5 makes it a refactor of live learning paths.

`ADAPT-001` revision 5 §2.13 specifies the governed route registry that gives the partition an
executable referent: `LearningRouteId` as an identity independent of `MutationAuthorityId`, total and
singular membership over all ten rows above, occurrence/output closure derived from canonical
transition definitions, and the well-formedness rule `StateFamilyRoute(F) = TransitionRoute(T)` that makes a
route-crossing transition **undefinable** rather than merely prohibited. **On acceptance, the two
tables in this section and in §2 become audits of that registry in both directions** — every
registered row appears here and every row here appears in the registry. Neither table is the
executable source of truth, and nothing at runtime reads either.

---

## 4. Two independent axes: contract coverage and implementation reachability

These are different obligations and were previously conflated here.

### 4.1 Contract tier — what 2A must formally type and own

**All ten logical rows.** The internally resolved ADAPT topology proposal distinguishes logical
topology completeness from materialized storage/ownership completeness. Every family has its logical
Campaign2StateFamilyId and declared route. An Unmaterialized family has no storage root or claimed
mutable leaves; its current persistent extent is empty. ADAPT does not invent eight cognitive
storage schemas or dummy authority declarations to populate those extents.

Every Materialized family must resolve complete physical storage and sole ownership through the
accepted state registry, plus the versioned contract for any writing edge. Persistent state may
never exist without an owner. Later Campaign-2 witnesses may require particular families to
materialize; this thin ADAPT control does not discharge those broader capability obligations.
This is the pass-4 draft alignment with the internally resolved logical-family shape, pending final
ADAPT composition acceptance, not a claim that cognitive mechanisms have been built or proven.

### 4.2 Implementation tier — what the current 2B slice actually writes

All eight character-learning families (1,2,3,4,6,7,8,10) are Unmaterialized in this ADAPT slice;
their table authorities are future ownership intent only. Only rows 5/9 are materialized here.
Later timing differs: belief/person-model are near-term; memory/identity have campaign witness
obligations; associations/values/habits/relationships await later consolidation. No authority or
dummy storage root is required until materialization.

Full mutation behaviour is required where a slice writes. An Unmaterialized logical family may
have no storage or authority. A Materialized family must have complete physical storage and sole
ownership even if no current transition writes it.

**Witness obligations.** Campaign 2 must provide *at least one traversable witness path* before
campaign closure for these three, because each carries a North-Star distinction that would otherwise
go unproven:

| Family | Witness the campaign owes | Phenomenon |
|---|---|---|
| 2 episodic/imprint memory | one event whose experience is encoded and later retrievable | `PHEN-MEM-001` |
| 10 self/identity/disposition | one meaningful choice producing identity evidence | `PHEN-DECISION-001`, `PHEN-BIO-001` |
| 9 regulatory adaptation | one hidden exposure changing adaptation and no cognition | `PHEN-ADAPT-001` |

**A witness obligation is not a universal causal invariant.** A trivial choice need not produce
identity evidence; an ordinary event need not induce regulatory adaptation; not every event is
encoded. One fixture may exercise several witness paths at once, and that co-occurrence must never
be read as a rule that events generally write all three. `PHEN-ADAPT-001`'s comparison rule depends
on exactly this: it requires zero mutation outside the target leaf (§8, three levels), which is only
meaningful if writes are selective.

**Materialized by the current ADAPT shape:** rows 5 (procedural skill) and 9 (regulatory adaptation).
This is a proposed storage shape, not a claim that code has been implemented.

**Near-term future materialization, contracted before first write:** rows 1 (belief/expectation)
and 7 (person models).

**Campaign witness materialization:** rows 2 (episodic memory) and 10 (identity/disposition).

**Logical/routed in 2A, unmaterialized in this thin slice:** rows 3 (associations), 4 (values), 6 (habits), 8 (relationships).
Before first materialization/write, register its exact root, leaf schemas, sole authority and writing
seam contract. Later cross-event consolidation must earn its own semantics. An early slice may emit contracted
`OutcomeLearningEvidence` without every eventual consolidation consumer existing yet — but
Campaign 2 completion may not use that fact to leave the thin persistent topology unspecified.

---

## 5. Two renamed rows

### 5.1 Row 5 — actual Procedural Skill belongs on the adaptation route, alone

`STATE_MODEL.md` proposes "Procedural adaptation / skill-learning transition" — one authority whose
name spans both routes. Registered as written, the one place the routes could merge would be *inside*
a single authority, where no record has to travel between authorities to do it, and a
route-separation proof would pass with the leak sitting below it.

The resolution is not to split actual Skill into a character-learning half and an adaptation half.
The accepted architecture distinguishes three different things:

```
believed capability  ≠  actual procedural competence  ≠  expected outcome
```

So:

```
actual practice/exposure  → AutomaticAdaptationInput      → Procedural Skill
perceived attempt/outcome → OutcomeLearningEvidence     → self-efficacy /
                                                            expected success /
                                                            causal-strategy belief
```

**Actual procedural competence gets one state-family authority, on the adaptation route.** Anything
the character *knows or believes* about their own competence is belief/expectation state (row 1) and
never touches the skill authority.

This preserves the case the architecture exists to represent: a character may become objectively
more skilled while believing they are terrible, or believe they improved when they did not.
A design that routed felt improvement into the skill authority would make that case inexpressible.

### 5.2 Row 1 — `Belief / Expectation State`, not "belief/expectation evidence"

`LearningEvidence` is an occurrence — an input record with provenance. Belief is persistent state.
The `STATE_MODEL.md` row name collapses them, and a state-family name that reads `Evidence` invites
an authority that writes belief *as* evidence arrives, which is exactly what `ORD-001` exists to
decide. Renamed here to `Belief / Expectation State`; the evidence record keeps its own identity as
a `OutcomeLearningEvidence` occurrence.

---

## 6. Preservation obligations for the first contracted seams

`SEAM_LEDGER.md` requires that each row's applicable `SUB-*`, `MEC-*`, `EXP-*`, `P3-*`, `CTL-*`, and
`RET-*` obligations be selected from `REFERENCE_MECHANISM_LEDGER.md` before a seam contract can be
considered complete. Selected below for the seams the first Campaign 2 path crosses. `PORT` is a
construction and comparison obligation, not a retention verdict; every ported mechanism begins
`UNRESOLVED` in the Verdict Ledger.

### 6.1 `actual exposure/practice → embodied or procedural adaptation` — rows 5, 9

Phenomenon: `PHEN-ADAPT-001` (`1.10.0-draft`), corpus `0.26.0-draft`.

| Obligation | Disposition | Why this seam |
|---|---|---|
| `SUB-009` | `PORT` | `PHEN-ADAPT-001` runs two timelines sharing random addresses so exposure is the only difference. The paired counterfactual harness *is* the fixture's method — easy to miss and non-optional. |
| `SUB-008` | `PORT` | The phenomenon requires causal ancestry of the first later cognitive divergence, and first-divergence replay is how that is established. |
| `MEC-003` | `CONTROL` + `CONTRACT` | `Capacity`/`Applied`/`Overflow`/`EvidenceKind` is the accepted bounded-effect identity that exposure magnitude must respect. |
| `RET-006` | `RETIRED` / prohibited | `Overflow → NeedExpectation` or `→ Salience` is the canonical form of the leak this seam must not have. Twice-tested non-necessity. |
| `RET-014` | `RETIRED` as a new-port pattern | Copying full `EffectProvenance` or authoritative `Applied` into character-accessible state is the other canonical leak. |
| `EXP-002`, `EXP-008` | `CORPUS` | Saturation/censoring and salience non-leakage are the existing regression cases for hidden truth not reaching cognition. |
| `CTL-001` | `CONTROL` | Embodiment/Need ownership comparison. Explicitly: do not assume Need is stored state. |
| `CTL-008` | `CONTROL` | Whole-system adaptation comparison; explicitly *not* the accepted explanation. |
| `SUB-012` | `PORT` + `CONTROL` | Available as a bounded-response candidate for adaptation curves; must not be assumed to govern them. |
| `P3-012` | `CORPUS` | The corpus entry `PHEN-ADAPT-001` cites. |

### 6.2 `DecisionExpression → identity evidence → future standing modifier` — row 10

Phenomena: `PHEN-DECISION-001`, `PHEN-BIO-001` (both `1.0.0-draft`).

| Obligation | Disposition | Why this seam |
|---|---|---|
| `MEC-012`–`MEC-014` | `PORT` | Reason Nuclei, cognitive-signal source roles, two-stage consolidation — the reason substrate a `DecisionExpression` is built from. |
| `MEC-015`, `MEC-016` | `PORT` | Dice/modifier grammar and exact arbitration; mandatory initial arbitration implementation. Modifier activation may alter an active motive but never create motivation from zero. |
| `MEC-017` | `PORT` | `DecisionExpression` as frozen contextual choice meaning. |
| `MEC-018` | `PORT` | Acquired identity evidence and the reinforcing standing-modifier loop — the row-10 mechanism itself. |
| `MEC-019` | `CONTRACT` + `CORPUS` | **Intent/attempt/outcome separation**, including the failed-execution case: a choice can express commitment or courage even when the world prevents the outcome. |
| `MEC-022` | `CONTRACT` | Frozen historical calibration/provenance: a later threshold change must not recompute what an old choice meant. |
| `SUB-004`, `SUB-005` | `PORT` | Counter-addressed randomness and exact finite distributions/convolution; the dice grammar requires both. |
| `SUB-007` | `PORT` | Aggregate-coverage correlated-evidence consolidation. |
| `SUB-002` | `PORT` + `CONTROL` | Integer lattice quantization with ties-to-even and largest-remainder allocation. |
| `EXP-009`, `EXP-010` | `CORPUS` | Reason separation/correlation suite; dice calibration and richness. |
| `EXP-011`, `EXP-012` | `CORPUS` | Biography authorship / seed divergence; identity formation and change. |
| `EXP-014` | `CORPUS` | Aggregate evidence redundancy; pairwise-only overlap must fail it. |
| `RET-007` | `RETIRED` | Identity contribution bounded/floored separately from matching ordinary pressure. |
| `RET-008` | `RETIRED` as default + `CONTROL` | Identity as its own independent die. |
| `RET-009` | `RETIRED` | Pairwise-maximum correlation discount. |
| `RET-012` | `RETIRED` / prohibited | Named acquired trait as an independent simulation bonus. |
| `RET-013` | `RETIRED` / prohibited | Recomputing old `DecisionExpression`s or memories under current calibration. |
| `CTL-005` | `CONTROL` | Legacy pooled semantic-channel Decision compiler — the required old-vs-Reason-Nuclei comparison; never the default. |

### 6.3 `encoding ↔ memory/recognition` — row 2

Phenomenon: `PHEN-MEM-001` (`1.0.0-draft`).

| Obligation | Disposition | Why this seam |
|---|---|---|
| `MEC-010` | `CONTROL` + `CORPUS` | Episodic accessibility from recency, retrieval frequency, decay, and retrieval reinforcement, with hand-computed regression cases. |
| `MEC-009` | `CONTROL` | Exact spreading activation and accessibility-filtered retrieval. |
| `MEC-011` | `CONTRACT` | Availability/preconditions must stay independently intervenable from accessibility/relevance. |
| `MEC-021` | `CONTROL` + `CORPUS` | Salience-weighted referent attribution for multi-participant memory. |
| `MEC-005` | `CONTROL` + `CONTRACT` | Character-relative attention separated from perception. |
| `MEC-007` | `CONTROL` | Multiplicative semantic-salience reference model — a first model, not a universal attention law. |
| `EXP-006`, `EXP-007` | `CORPUS` | Memory accessibility; semantic salience cases. |
| `EXP-015` | `CORPUS` | Semantic-footprint / association-budget interaction. |
| `MEC-022` | `CONTRACT` | Frozen historical calibration/provenance. Applies to memory explicitly, not only to decisions: a later threshold or salience change must not alter what an old memory meant. |
| `RET-013` | `RETIRED` / prohibited | Recomputing historical memories under current calibration or state. Named here rather than left implicit under the decision seam. |
| `RET-001` | `RETIRED` + `CONTROL` | Flat `z=1` concept tagging; keep only as named legacy salience. |

### 6.4 `evidence → belief/person model` — rows 1, 7

Phenomena: `PHEN-LEARN-001`, and `P3-006` for person models.

| Obligation | Disposition | Why this seam |
|---|---|---|
| `MEC-001` | `CONTROL` + `CANDIDATE` | `EvidentialEstimate(mean, precision)` and `NeedExpectation`. |
| `MEC-002` | `CONTROL` + `CORPUS` | Informative-bound gating for censored evidence; the four named cases. |
| `MEC-006` | `PORT` | Evidence-aware surprise for point/lower/upper-bound observations. |
| `P3-001` | `CONTRACT` + `CORPUS` | World truth → perception → belief → appraisal four-way separation. |
| `P3-006` | `CONTRACT` + `CORPUS` | Observer-relative social evidence and belief; no privileged access to another mind — the row-7 contract. |
| `P3-003` | `CONTRACT` + `CORPUS` | Non-event evidence teaches only when a relevant opportunity occurred. |
| `EXP-001`, `EXP-005` | `CORPUS` | Reliable satisfier preference; avoidance without a generic inhibition stat. |
| `RET-003`, `RET-004`, `RET-005` | `RETIRED` | The three censored-evidence errors: raw `abs` surprise, naive clipped delta as a point observation, precision growth from every censored observation. |
| `P3-002` | `CANDIDATE` + `CORPUS` | Typed conditional predictions and prediction opportunities: `ConditionKey`, `OutcomeKey`, opportunity identity, explicit outcome occurrence. |
| `P3-011` | `CANDIDATE` + `CORPUS` | Same-time evidence ordering and explicit decay. **Directly relevant to `ORD-001`**, which is about to define this seam's same-event timing; the preserved ordering and partition tests are the comparison that decision should be made against. |
| `EXP-002` | `CORPUS` | Saturation and censoring: equal true effects under different capacity must not produce false efficacy conclusions. |
| `CTL-002` | `CONTROL` | `(mean, precision)` expectation per subject/Need. |

`P3-002`, `P3-011`, `P3-004`, and `P3-007` are `CANDIDATE` dispositions. Listing them here preserves
them as required comparisons and phenomena; it does not adopt the historical mechanisms, and none of
them acquires implementation authority by appearing in this table.

---

### 6.5 Not yet homed — commitment lifecycle

`MEC-020` (`PORT` as a control seam — commitments as non-Need motive-generating sources with
lifecycle identity), `EXP-013` (`CORPUS` — commitment lifecycle), and `PHEN-COMMIT-001` belong to
the **upstream motive/arbitration seams**, at the seam-ledger row `goals/motives → option
construction`, which this inventory has not yet covered.

They are recorded here so they are not lost, and deliberately **not** filed under the identity seam.
A commitment is an obligation with its own lifecycle identity, not identity evidence; `RET-010`
(commitment represented as a Core Need) and `RET-011` (permanent/immortal commitment pressure) are
retired precisely because they collapsed that distinction. Forcing them into §6.2 for completeness
would repeat the error in a new place. They receive their preservation home when the motive and
arbitration seams are inventoried.

## 7. What this implies for slice order

Consequences of §3–§6, not decisions:

1. The **route-separation proof** is the largest piece of Campaign 2 groundwork that no open
   decision blocks. It concerns *writes*; `ORD-001` concerns belief *reads*. `PHEN-ADAPT-001` is
   already drafted and already carries the negative control — *"replace the typed
   automatic-adaptation route with character-learning evidence"* — that the proof needs.
2. `ADAPT-001` should adopt §5.1: one authority for actual procedural competence on the adaptation
   route, with competence beliefs routed to belief/expectation state.
3. `ORD-001` becomes blocking at **2B.2**, when thin belief application first reads belief inside
   the event that produced the evidence. `SEM-001H` already fenced this: *"Ordering before phase 30
   grants no belief read permission."*
4. `DEC-001` becomes blocking at **2B.4→2B.5**, at the `DecisionExpression → identity evidence` edge.
5. `ONT-001` and `TRC-003` gate nothing in §4.2's witness or reachable sets.

---

## 8. Open questions

**Closed by review (2026-09-04):**

- **Row 7 authority** — person models are a *separate* authority from
  `authority/recognition-knowledge`. Recognition knowledge is candidate/template/symbol knowledge
  used to answer "who is this?"; a person model is acquired belief *about* a recognised person —
  disposition, affect, goals, intentions, knowledge. They interact but are not the same
  authoritative state.
- **Row 1 naming** — renamed to `Belief / Expectation State`; see §5.2.
- **Consolidation and traversability** — an early slice may emit contracted `OutcomeLearningEvidence`
  without every eventual consolidation consumer existing yet; Campaign 2 completion may not use that
  fact to leave the thin persistent topology unspecified. §4 is structured accordingly.

- **Rows 3, 4, 6, 8 — four authorities, not one.** Associations, values, habits, and relationships
  are distinct authoritative state families and register separately:

  ```
  authority/associations
  authority/values
  authority/habits
  authority/relationships
  ```

  There is deliberately **no** `authority/consolidation`. Consolidation is a *producing process*,
  not the semantic state family being owned, and an authority is named for the family whose writes
  it governs. A future consolidation transition may legitimately emit patches for several of these
  authorities in one instant; their ownership and ablation boundaries stay independent regardless.
  Naming the producer would make all four families ablate together, which is precisely the
  comparison the campaign method needs to keep separable.

- **Row 9 — one authority, several addressable leaf families.** Register
  `authority/regulatory-adaptation` over adaptation, tolerance, sensitization, and accumulated load
  as separately addressable leaf families whose exact state shape `ADAPT-001` settles. Do not split
  them into separate authorities merely to sharpen a phenomenon.

  The sharpening belongs in the phenomenon requirement instead, at three levels:

  ```
  target adaptation path                              → permitted target leaf mutation
  every non-target authority                          → zero mutation
  every non-target leaf family within that authority  → zero mutation
  ```

  The third level is the one an authority split would have bought, and stating it as a requirement
  catches spill *within* one legitimate authority — which an authority-level check never could.
  `PHEN-ADAPT-001`'s comparison rule should carry all three.

2026-09-06 inventory 0.5: logical vs materialized obligations, direct StateFamilyRoute/TransitionRoute
relation and unmaterialized-family wording synchronized. Broader Campaign-2 witness obligations remain.
