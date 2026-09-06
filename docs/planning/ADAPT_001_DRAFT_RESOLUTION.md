# `ADAPT-001` — Draft Resolution

**Status: WHOLE-CONTRACT SHAPE ACCEPTED, 2026-09-06.**
Contract: `adaptation-input/0.31-candidate`; companion extensions:
`transition-admission-extension/0.6-candidate` and `adaptation-settlement/0.2-candidate`.
Campaign-2 permanent allocation `campaign2-allocation/0.2-candidate` is ACCEPTED AND FROZEN.
Canonical implementation remains gated by applicable VAL and proof obligations; no gate passes by review.
The formal ADAPT-001 open-decision row remains OPEN pending the built seam, PHEN-ADAPT-001
and required adversarial/mutation gates. This planning acceptance record does not claim proof closure.

**Dispositions.** Revision 1: direction accepted with refinement. Revision 2: architectural
direction accepted, three further shape requirements raised. Revision 3 closes those — the
adaptation rule becomes a governed committed definition (§2.6), basis admission becomes exact
(§2.1), the evaluation result becomes typed (§2.8) — and adds the route registry as the first
shape-freeze item (§5.0). Revision 4 adds leaf-family identity to the rule (§2.6), rule cardinality
(§2.7), exact-path mutation isolation (§2.9), a same-instant collision policy (§2.10), and extends
the route registry to occurrence/output closure (§5.0). Revision 5 adds the `AdaptationDispatchRecord`
so a zero-rule dispatch is positively observable rather than observable by absence (§2.8), restates
the collision policy over *targeting* rather than outcome and makes the common frozen pre-adaptation
projection explicit (§2.10), and specifies the governed route registry that revisions 3–4 left open —
closing shape-freeze item A (§2.13, §5.0). Revision 6 specified the semantic state keys — addressing
only — closing **D**'s first dependency (§2.14, §5.1). Revision 7 settled those keys against review
(`CharacterId` rather than a minted embodied identity; four semantically distinct referent types
rather than one generic one), added the leaf value grammars per leaf family (§2.15, §5.2), and
recorded that a derived closure may be empty during planning but not at acceptance. Revision 8 makes
the `ObserverId` → `CharacterId` binding a governed relation rather than an equivalence and puts its
roster in `RunIdentity` (§2.14d); adds the response variable to the tolerance and sensitization keys
(§2.14d); gives scale and unit one governed home (§2.15b); reopens regulatory adaptation's bound as a
named dependency on a reference operating point (§2.15d); keeps `MEC-003` on the occurrence rather
than in the persistent load leaf (§2.15e); resolves baseline, absence and removal for all five leaves
(§2.16, §5.3); and promotes the prerequisite character-learning seam to `EVID-001`. Revision 9 repairs the
state-closure derivation, which revision 7 had wrongly taken from `WritableStateFamilies` (§2.13d);
renames `InputRoute` to `TransitionRoute` before it becomes permanent; makes `CharacterId` a governed
role over accepted namespace 1002 rather than a new namespace (§2.14d); bounds tolerance at complete
suppression (§2.15c); and registers `REG-001`. Revision 10 corrects §2.14d's runtime-origin claim
against `IDN-001` `0.2-draft`: namespace 1002 has the representational capacity, but runtime-origin
character *qualification* is undefined in `IDN-001` v0.1 and is a reopen condition there. Revision 11
mirrors `IDN-001` `0.3-draft`'s resolved `0..N` reverse cardinality in §2.14d, and revision 12 retires
the `CharacterObserverBinding` pair record from §5.4 — the roster is a canonical map keyed by
`ObserverId`, so no pair-record type or binding occurrence identity is needed. Revision 13 corrects the
dependency count and updates §1's scope. Revisions 15–17 record `WRT-001` as **accepted**
(`state/0.3-candidate-addendum`) and `PRJ-001` and `IDN-001` as
**shape-accepted**, leaving two open blockers at revision 17. Revision 22 records EVID shape acceptance, leaving REG-001 alone.
**The historical revision dispositions above culminate in whole-contract shape acceptance.**
§5.4–§5.5 now govern the authorized allocation pass and later implementation/proof gates. Companion:
`PHEN-ADAPT-001` `1.10.0-draft` (corpus `0.26.0-draft`).

---

## 1. Scope

`STATE_MODEL.md` states the *Evidence-route separation* rule and assigns two state families to the
automatic-adaptation route. This decision settles:

1. where route separation is enforced, and where it is not;
2. what an `AutomaticAdaptationInput` record carries, and what it must not;
3. which authorities own the two families;
4. when the adaptation write happens.

It does **not** settle adaptation curves or magnitudes, or what the world model counts as a qualifying
exposure. Revisions 7–8 did settle the shapes this scope note originally deferred — semantic keys
(§2.14), value grammars (§2.15), and baseline, absence and removal semantics (§2.16) — leaving
regulatory adaptation's *bound validation* dependent on `REG-001` (§2.15d). What §5 still holds is
numeric allocation, the exact record shapes, and five named prerequisite decisions, all now accepted at their recorded levels; none remains open.

---

## 2. Decision

### 2.1 Mutation authority is state ownership, and nothing else

Revision 1 had each authority declare which input type it admits. That is withdrawn. It would have
coupled `authority/regulatory-adaptation` to today's producer, so a future legitimate second
transition writing the same state would have required changing the authority's semantics — the exact
failure the Campaign 1 naming principle exists to prevent.

The two questions stay separate:

```
MutationAuthority        →  WHO OWNS WRITES TO THIS STATE?
Transition contract /
typed ReadDomain         →  WHAT INPUTS MAY THIS TRANSITION CONSUME?
```

So:

```
AutomaticAdaptationTransition
    accepts AutomaticAdaptationInput.RegulatoryExposure only
    writes  through authority/regulatory-adaptation

ProceduralAdaptationTransition
    accepts AutomaticAdaptationInput.ProceduralPractice only
    writes  through authority/procedural-skill

CharacterLearningTransition
    accepts its explicitly admitted character-learning evidence family only
    writes  through its own state-family authority
```

Admission is stated at the **basis** level, not merely the record type. "Reads
`AutomaticAdaptationInput`" would leave unanswered why a `RegulatoryExposure` does not also reach
the procedural transition; naming the admitted variant answers it. A wrong basis is a typed
admission failure at the transition's read-domain boundary — the accepted `SEM-001G` mechanism,
which already refuses an unadmitted reference kind, schema, or producing seam.

**A wrong basis and a valid-but-inert basis are different cases and stay distinguishable** (§2.8), as is a
basis for which no rule is applicable at all (§2.7).
Where one world occurrence legitimately supplies both regulatory exposure and procedural practice,
it emits **two separately identified `AutomaticAdaptationInput` occurrences** — one per basis —
rather than one basis meaning two things.

Authority remains named for the state family whose writes it governs, never for its current
producer, and a second accepted transition may later write the same family through the same
authority without amending it.

### 2.2 The input describes what happened; the transition decides what changes

Revision 1's record carried a target authority and target leaf family. Withdrawn: that makes the
input a mutation command, and lets the producer perform the adaptation reasoning before the
adaptation seam ever receives the record.

```
actual exposure/practice truth
    ↓
AutomaticAdaptationInput        — semantic facts only
    ↓
registered adaptation rule / transition
    ↓
which accepted leaf, if any, changes
```

`AutomaticAdaptationInput` has exactly four fields:

```
AutomaticAdaptationInput
├── AutomaticAdaptationInputId
├── Basis                     RegulatoryExposureFact | ProceduralPracticeFact
├── OccurredAt
└── TransformationVersion
```

Basis contains the qualified CharacterId and actual exposure/practice facts under
[D's exact schemas](ADAPT_001_FACT_INGRESS_DRAFT.md). Truth-side provenance exists through trusted
production association and scheduler/omniscient trace ancestry; it is **not a payload field**.
There is no SourceEventId. The consuming transition selects a rule and target; no target or
mutation instruction is supplied by the producer. A rule may legitimately yield NoStateChange.

The record carries **no** observation, no perceived outcome, no evidence reference, and no
`ExperienceId`. The reason is not that joins are dangerous in general — the omniscient trace is
*allowed* to know that truth-side and observer-side events share ancestry, and `PHEN-SEM-001`'s
ancestry graph depends on exactly that. The reason is definitional:

> Automatic adaptation is independent of the character having an `Experience` at all. Its
> authoritative input must therefore neither require nor carry observer-experience identity. Any
> truth↔experience ancestry belongs exclusively to the omniscient trace and is not traversable by
> cognition.

A hidden exposure with no corresponding experience must be fully expressible, which a required —
or even optional — `ExperienceId` would quietly undermine.

### 2.3 Two authorities

```
authority/regulatory-adaptation   — dynamic embodied     — row 9
authority/procedural-skill        — learned persistent   — row 5
```

Both draw from the accepted global `1025 MutationAuthorityId` namespace, which was accepted naming
regulation and skills among its future members. No new authority namespace is needed.

`authority/procedural-skill` owns **actual procedural competence only**. Anything the character
knows or believes about their competence — self-efficacy, expected success, causal-strategy belief —
is belief/expectation state on the character-learning route and is never written here:

```
believed capability  ≠  actual procedural competence  ≠  expected outcome
```

A character may become objectively more skilled while believing they are terrible, or believe they
improved when they did not. Routing felt improvement into competence state would make both cases
inexpressible.

`authority/regulatory-adaptation` owns adaptation, tolerance, sensitization, and accumulated load as
separately addressable leaf families. One authority, several leaves — the separation that matters is
enforced by the phenomenon's third-level rule, not by fragmenting ownership.

### 2.4 Type separation

`AutomaticAdaptationInput` and `OutcomeLearningEvidence` are distinct record types with distinct
occurrence namespaces. Neither is constructible from the other's fields; neither validates as the
other. A single type with a `route` discriminator is rejected — relabelling would suffice to move a
record between routes, where distinct types make the crossing unconstructible rather than merely
forbidden.

### 2.5 The both-affected case

When one world event legitimately affects both routes, two records are emitted, neither derived from
the other, each with its own provenance:

```
truth-side adaptation path
    → AutomaticAdaptationInput

observer-safe consequence path
    → permitted consequence observation
    → consequence SemanticExperience
    → character-relative OutcomeEvaluation
    → OutcomeLearningEvidence
```

The second chain is the accepted Campaign 1 route and is stated in full deliberately: raw
observation is **not** the learning-evidence authority. Character learning evidence descends from an
evaluated consequence experience, not from an observation record.

### 2.6 The adaptation rule is a governed committed definition

Removing the routing instruction from the input must not replace it with anonymous executable
logic. [E revision 2](ADAPT_001_RULE_INTERPRETER_DRAFT.md), internally shape accepted at
adaptation-input/0.31-candidate, freezes the exact rule:

```
AdaptationRuleDefinition
├── Match                    Exposure {ExposureReferentId} | Practice {ProcedureId}
├── TargetStateFamilyId      Campaign2StateFamilyId
├── TargetLeafFamilyId       LeafFamilyId
├── KeyDerivation            closed declarative variant
├── Gate                     Always | FrozenBaseline {Source: AdaptationReadTarget}
└── Step                     signed nonzero target-lattice integer per count
```

The SemanticRegistryEntry wrapper supplies the sole AdaptationRuleId and DefinitionVersion.
E replaces the former embedded identity/version and unexpanded KeyDerivationRuleId and
StateTransitionFunctionId placeholders. The governing version fixes CountStepWithBaselineGate
and ExactBasisReferentMatch; no stored Function or Resolution field, or parallel registry, is added.
Its variant payloads, registry commitment and closed interpreter are defined in E, not inferred
from these descriptive field labels.

**One rule targets exactly one leaf family and one derived exact StatePath.** TargetStateFamilyId
alone is insufficient: the regulatory family has four leaves. An exposure affecting tolerance and
load has two independently identified rules and evaluations, never a function emitting a multi-leaf
patch. Function, key derivation, gate and step cannot widen target or read permission.

Changing rule membership, matching, keys, gate, target or equation parameters changes ModelIdentity.
The complete applicable set is fixed from committed definitions plus admitted Basis before state
reads. The target and optional gate are read from the shared frozen snapshot; no host callback or
uncommitted name-to-function table supplies meaning.

### 2.7 Rule cardinality, and one result per rule

The grammar is a canonical set, not a single rule:

```
one admitted input
    → canonical set of independently applicable governed rules
    → one AdaptationEvaluationResult per rule
```

```
0 applicable rules  → dispatch record with an empty rule set, no evaluations
1 applicable rule   → dispatch record + one evaluation
N applicable rules  → dispatch record + N independently traceable evaluations
```

Applicability is decided by the committed rule definitions (`AcceptedBasisKind` and the input's
facts), never by execution order or by a function's internal branching. The set is canonically
ordered so N evaluations are deterministic and replayable.

**"No applicable rule" and "an applicable rule produced `NoStateChange`" are different outcomes** and
must stay distinguishable in trace. The first says nothing in the committed model responds to this
exposure; the second says a specific rule looked and concluded no change. Collapsing them would hide
a missing rule behind a legitimate-looking no-op. §2.8 gives the record that keeps them apart — the
zero-rule case is not the absence of a record, it is a dispatch record with an empty rule set.

**`ADAPT-001` v0.1 additionally constrains the fixture** — not the grammar — to exactly one
applicable rule per admitted input, so `PHEN-ADAPT-001`'s comparison has one unambiguous target
path. The 0/N cases remain expressible and are not foreclosed; they are simply not exercised by the
first fixture, and a phenomenon that needs them does not require a grammar change.

### 2.8 Dispatch and result are separate records

An admitted input whose rule produces no change must remain distinguishable from an input that never
ran, from one that was refused, and from one that ran and found nothing in the committed model to
respond to. A typed evaluation result alone does not separate the last two. If "no applicable rule"
is expressed as the *absence* of any record, then a transition that never executed and a transition
that executed and resolved zero rules leave byte-identical trace — and §2.7 requires those to be
different outcomes. Absence cannot carry a distinction.

So the transition emits two record kinds. **Dispatch is recorded unconditionally on admission;
results are recorded per applicable rule.**

```
AdaptationDispatchRecord
├── DispatchId
├── Input                     complete admitted AutomaticAdaptationInput
├── ApplicableRules           canonical set<AdaptationRuleId>, possibly empty
└── TransformationVersion
```

Basis and OccurredAt derive from Input; consuming transition derives from trusted execution/trace
context. They are not duplicated dispatch fields. The trace semantic view below retains these
relations without expanding the stored record.

The rule list is the set resolved at step 2 of the phase-140 flow (§2.10), fixed *before* any state
is read. It is not a log of which rules happened to do something.

```
transition never ran                        → no dispatch record
wrong route or wrong basis                  → typed admission failure, no dispatch record
admitted, zero applicable rules             → dispatch record, empty rule set, no results
admitted, rule evaluated, no state change   → dispatch record + NoStateChange
admitted, rule evaluated, state changed     → dispatch record + StateChange
```

**`NoStateChange` must not be used for the zero-rule case.** Conceptually
`AdaptationEvaluationResult = NoStateChange(…) | StateChange(…)`, and it is emitted **per applicable
rule** — so a zero-rule dispatch has nowhere to hang one. Manufacturing a `NoStateChange` there would
have to name a rule that did not apply, or name none and become indistinguishable from a missing
record; either way it re-collapses the distinction §2.7 exists to keep. The dispatch record is what
makes the zero-rule case *positively* observable instead of observable by absence, which is the
difference between "the committed model has no response to this exposure" and "the seam is broken".

Reasons within `NoStateChange` are deliberately **not** over-designed here. What the trace must
retain is:

```
per dispatch:  input occurrence · transition · admitted basis · applicable rule set · instant
per result:    rule identity · semantic key evaluated · prior state · result · patch if any
```

A wrong-route or wrong-basis input never produces `NoStateChange` — it fails admission at the
transition boundary (§2.1), before dispatch. The typed no-op is also what makes `PHEN-ADAPT-001`'s
matched-allocation fixture constructible: Timeline B runs the same occurrence through the same rule
and gets `NoStateChange`, rather than omitting the occurrence and shifting every later ordinal.

### 2.9 Exact-path mutation isolation

The three-level rule catches a wrong authority and a wrong leaf family. It does **not** catch the
right authority, the right leaf family, and the wrong semantic key:

```
intended:            tolerance(Mina, alcohol)
bug also mutates:    tolerance(Mina, caffeine)
```

Both are `authority/regulatory-adaptation` → tolerance leaf family, so a level-two or level-three
check passes. The same hole would let `practice(cooking)` update `procedural-skill(lockpicking)`.

So the invariant is stated exactly:

> **The exact set of committed mutation paths equals the exact expected target-path set.**

where a path is `authority · state family · leaf family · semantic key`. The three levels become an
explanatory decomposition of that one rule rather than the rule itself:

```
target path(s)      → permitted mutation
every other path    → zero mutation
```

§2.14 defines those keys, so the wrong-key control's shape is now fixed: the two paths above differ
in one field of one canonical key record, and the invariant is byte equality of the committed path
set. Its *construction* still waits on **F** like every other control — the addressing rule is what
§5.1 had to supply first, and it is why §5.1 precedes allocation rather than following it.

### 2.10 Same-instant collisions and the frozen pre-adaptation snapshot

Once an instant can carry several admitted inputs, two phase-140 evaluations may target one exact
`StatePath`. The scheduler orders them deterministically by `EventSequence`, but **determinism is not
a licence for incidental ordering to become biological law.** What is explicitly rejected:

> whichever phase-140 event happens to execute first changes the state the next one reads

That would make allocation order a silent aggregation rule, and it would do so invisibly, because
every individual write in such a sequence is legal.

Revision 4 stated the policy over *state-changing* evaluations only. That is too weak in one exact
way: whether an evaluation yields `StateChange` or `NoStateChange` is known only *after* it has read
state and run its transition function. A policy conditioned on the outcome cannot be enforced before
evaluation, so whether a genuine collision is caught would depend on this instant's values rather
than on structure — two rules legitimately racing for one path would pass whenever one of them
happened to be a no-op on these numbers. So the policy is stated over *targeting*:

> **At most one applicable rule evaluation may target one exact adaptation `StatePath` per simulation
> instant, regardless of whether that evaluation would ultimately produce `StateChange` or
> `NoStateChange`.**

This is decidable from the resolved rule set and the derived paths alone, before any state is read.

**The common pre-adaptation snapshot.** Refusing collisions structurally is only half of removing
order from adaptation semantics; the other half is what each evaluation *reads*. Two evaluations may
legitimately target different paths while one reads a leaf the other writes — no collision, and yet
ordering would still decide the result. So: every phase-140 evaluation in one instant reads one
**frozen pre-adaptation state projection**, the state as it stood before any adaptation patch of that
instant, and stages its patch against it. No evaluation observes another evaluation's patch.

The ordered phase-140 flow:

```
1. admit                exact route + exact basis (§2.1); refusal ends here
2. resolve rules        canonical applicable set; emit the dispatch record (§2.8)
3. derive target paths  authority · state family · leaf family · semantic key
4. reject duplicates    two evaluations, one exact StatePath → closure failure, before evaluation
5. freeze               one pre-adaptation state projection for the whole instant
6. evaluate             every rule reads the frozen projection; patches staged, never applied
7. commit               the stage is applied atomically, or the whole instant aborts (control 12)
```

Steps 4 and 5 together **remove `EventSequence` from adaptation semantics entirely.** Ordering
remains a scheduling fact — it still fixes allocator positions and trace order — but no adaptation
*value* can depend on it: colliding paths are refused before evaluation, and non-colliding
evaluations cannot see each other. That is a stronger and simpler claim than "the ordering is
deterministic", and it is mechanically checkable by permuting the same-instant inputs (control 7k).

`NoStateChange` evaluations are no longer exempt: an evaluation occupies its target path whether or
not it ends up writing there. This is deliberately restrictive. It is reopened when a phenomenon
actually requires simultaneous exposure accumulation, at which point a *governed aggregation rule* —
canonical aggregation of all same-instant applicable inputs into one transition — is the intended
replacement, not an ordering convention.

### 2.11 The first transition function is deliberately thin

`ADAPT-001` does not solve adaptation curves, and requiring a *registered* deterministic function
must not become a reason to solve them here. The first version-governed transition equation may be a
narrow exact function sufficient for `PHEN-ADAPT-001` and nothing more.
[E revision 2](ADAPT_001_RULE_INTERPRETER_DRAFT.md) freezes exact count-times-step addition with an
optional frozen-baseline gate required by control 7j. Bounds reject; no clamp or implicit kinetics.

General tolerance kinetics, general skill learning, and general sensitization dynamics are **out of
scope for this seam**. This contract proves the route and state architecture; later phenomena earn
richer functions, and they earn them through their own decisions.

### 2.12 Adaptation timing

`EVENT_ORDERING.md` phase 140 is "consolidation, adaptation, and persistent-state mutation". This
contract adopts **phase 140** for the adaptation write.

The invariant that matters, and which the fixture must prove:

```
an adaptation mutation cannot retroactively reopen an earlier observation lane
```

Phase 140 sits after both observation lanes (10–15/20–21 current, 120–127 consequence) and after
phase-130 perceived-outcome evaluation, so the invariant follows from placement rather than from a
separate rule. Within the phase, §2.10's frozen pre-adaptation projection is what keeps several
adaptation writes in one instant from becoming an ordering-dependent aggregation.

`ORD-005` — the appraisal-regulation feedback boundary — is **not** decided here:
this contract places one truth-side adaptation write at an already-accepted phase and says nothing
about current-versus-later affect semantics or regulation feedback. If the fixture would require
taking a position on `ORD-005`, it is constructed across separate simulation instants instead, and
that choice is recorded rather than left implicit.

### 2.13 The governed route registry

Revisions 3 and 4 named this as shape-freeze item **A** and left it open at §5.0. It is specified
here, because every route-closure obligation in §4 — controls 4, 5, 6, 7d — is a claim about
*registered* membership, and none of them has an executable referent until membership is a governed
fact rather than a table in a planning document.

**(a) Transition routes are consumed from the shared substrate.**

[EVID-001 revision 5](EVID_001_DRAFT_RESOLUTION.md), `transition-admission/0.4-candidate`, owns the
shape-accepted LearningRouteId family, route/character-learning and route/automatic-adaptation members,
TransitionRouteDefinition and occurrence/output closure. ADAPT does not supply these facts to its
own prerequisite. This section owns StateFamilyRoute and persistent closure, plus their integration
with the shared transition-route map. Route identity carries no ordering, magnitude or admission.
Generic transitions need no learning route; ADAPT's participating transitions do.

**(b) Membership is total and singular over the ten Campaign-2 state families.**

| # | Campaign2StateFamilyId | LearningRouteId | Storage |
|---|---|---|---|
| 1 | belief-expectation | route/character-learning | Unmaterialized |
| 2 | episodic-memory | route/character-learning | Unmaterialized |
| 3 | associations | route/character-learning | Unmaterialized |
| 4 | values | route/character-learning | Unmaterialized |
| 5 | procedural-skill | route/automatic-adaptation | Materialized → ProceduralSkillState |
| 6 | habits | route/character-learning | Unmaterialized |
| 7 | person-model | route/character-learning | Unmaterialized |
| 8 | relationships | route/character-learning | Unmaterialized |
| 9 | regulatory-adaptation | route/automatic-adaptation | Materialized → RegulatoryAdaptationState |
| 10 | identity-disposition | route/character-learning | Unmaterialized |

```
StateFamilyRoute(F) → exactly one LearningRouteId       total
no state family     → zero routes                       no unrouted family
no state family     → two routes                        singular
```

`StateFamilyRoute` is the **direct** registration of family to route. It is the only source of
persistent route membership; nothing derives it, and no transition definition defines it — see (d).

Totality is the half that fails silently. A family with no route is not obviously broken at the point
of definition — it simply never appears in either closure, and control 4's "every registered
character-learning family" then quietly means "every family someone remembered to route". So the
registry is checked for exhaustiveness against the state-family registry, not merely for consistency
within itself.

**Registering a family on a route does not admit anything to it.** `SEM-001J` recorded
`registered ≠ admitted` as an invariant; it holds here without generalization. Route membership fixes
which lane *may* write a family; whether a particular input reaches a particular transition is
decided only by that transition's exact basis admission (§2.1). Nothing may read route membership as
a permission.

**(c) `MutationAuthorityId ≠ LearningRouteId`.** LearningRouteId is direct logical topology.
MutationAuthorityId is separately registered physical ownership, only when storage is Materialized,
through the accepted StateOwnershipRegistry. Route is never derived from authority; authority is
never derived from route. Eight unmaterialized families have no roots and no active authorities.
Any future authority names in the topology inventory mean only "Authority when materialized".
The family registry stores no duplicate authority field.

**(d) Occurrence and output closure.** `PHEN-ADAPT-001` also promises equality over every
character-learning *occurrence or output*, including `OutcomeEvaluation` and
`OutcomeLearningEvidence`. A state-family registry cannot prove that set exhaustive. Rather than a
private closure registry, ADAPT queries the shared execution registration and separate transition-route map:

```
TransitionDefinition
├── ReadDomain             exact state-path patterns (STATE_MODEL.md)
├── InputAdmission         governed payload/producer/stage/relation/multiplicity
├── OutputDefinitions      exact required output production; schema closure is derived
└── WriteCapability        NoStateWrites only in the EVID-witnessed shared version
```

**Revision 22 consumes the shape-accepted shared substrate in
[EVID-001 revision 5](EVID_001_DRAFT_RESOLUTION.md), `transition-admission/0.4-candidate`.** Generic
InputAdmission, committed ingress rules and the closed NoStateWrites-only capability freeze there,
not in later ADAPT C. AcceptedAdaptationBasisKinds remains an adaptation-specific refinement of
generic InputAdmission; a SEM experience is not an adaptation basis. WritableStateFamilies is a
derived accessor: empty for every transition supported by this shared version. StateWrites is deferred until ADAPT freezes the exact state-family referent and earns a versioned extension; StatePathPattern is not silently equated with the coarser routed family.
No dummy authority is created for EVID. The base is shape-accepted; ADAPT C must earn its StateWrites extension after the exact state-family referent is frozen, plus any required variable-output extension.

The exact EVID output family is OutcomeLearningEvidence. The broader phrase character-learning evidence is an
architectural family term; this draft no longer assumes a universal canonical evidence record.
EVID records are observer-relative and perform no PRJ/IDN read. Their nested experience is the sole stored ObserverId source. A later state-addressing consumer must earn its admitted subject-input shape before invoking accepted PRJ/IDN; EVID supplies no redundant top-level field.
PHEN-ADAPT-001 1.10 names OutcomeLearningEvidence exactly; no universal canonical
CharacterLearningEvidence record or alias is admitted.

TransitionRoute(T) below means lookup in shared TransitionRouteDefinition, not a field of generic TransitionDefinition. Executing seam/version and scheduler ingress belong to TransitionRegistration.

**The two closures come from different places, and conflating them was a real defect in revision 7.**

```
persistent state closure(R)   = { F : StateFamilyRoute(F) = R }
occurrence/output closure(R)  = ⋃ { OutputRecordSchemas(T) : TransitionRoute(T) = R }
```

State closure is read from the family registry (b) directly. Deriving it from
`⋃ WritableStateFamilies(T)` instead — as revision 7 did — makes the character-learning state closure
**empty** the moment the only registered transitions are `EVID-001`'s thin ones, whose
`WritableStateFamilies` is `{}` by design. That would contradict (b), contradict (d-bis), contradict
`PHEN-ADAPT-001`, and silently delete the eight logical, unmaterialized character-learning families that §4.2's early-slice
rule exists to permit. A family is on a route because it is registered there, not because something
currently writes it. The corpus already said this correctly — "which persistent state families belong
to which route, *and* which occurrence/output families do" — so the drift was here alone.

`WritableStateFamilies` therefore constrains what a transition **may write**; it does not define what
exists on the route. One well-formedness rule connects the two:

> **For every transition `T` and every family `F ∈ WritableStateFamilies(T)`:
> `StateFamilyRoute(F) = TransitionRoute(T)`.**

That rule is the mechanical proof of `STATE_MODEL.md`'s "no record crosses between these routes
implicitly". A transition on one route that writes a family registered to the other is not merely
prohibited at runtime — **it cannot be defined.** The crossing is refused at model-compilation
time, where a divergence names the construct it diverged on, rather than at a write barrier that only
fires if the path is exercised. Within a permitted family, §2.6's `TargetLeafFamilyId` and §2.9's
exact-path rule do the finer work; this rule does the route-level work only.

**The relation is `TransitionRoute`, not `InputRoute`, and the difference is not cosmetic.** `EVID-001`'s
`OutcomeEvaluationTransition` belongs to the character-learning lane, but its input — a consequence
`SemanticExperience` — is produced by the accepted Campaign 1 semantic path and did not originate on
the character-learning route at all. A field called `InputRoute` would make a false claim about where
every consumed record came from, and would invite exactly the reading this contract refuses:

```
route membership  ≠  input admission
```

Route says which learning or adaptation causal lane a transition participates in. What that
transition may consume is decided by governed `InputAdmission`, its typed `ReadDomain`, and adaptation-specific `AcceptedAdaptationBasisKinds`
(§2.1), which is where input provenance already belongs. Naming the field for admission would put two
different governed facts under one word right before that word becomes permanent.

**(d-bis) A derived closure may be empty during planning; it may not be empty at acceptance.**
`PHEN-ADAPT-001` names concrete members of the character-learning output closure —
`OutcomeEvaluation` and `OutcomeLearningEvidence` — in its both-affected obligation, and control 8
requires those outputs to *exist*. So the rule that keeps control 4 honest also binds the other way:

> **No intentionally empty closure may satisfy a phenomenon that names concrete members of that
> closure.** A derived empty set is a real assertion about the governed definition, but it cannot
> discharge an obligation whose own text requires the set to be inhabited.

At final acceptance the two halves therefore answer differently, and the asymmetry is deliberate:

```
character-learning STATE closure       already contains all eight registered families,
                                       all Unmaterialized here with empty extents — direct StateFamilyRoute,
                                       so §4.2's early-slice behaviour costs it nothing

character-learning OCCURRENCE/OUTPUT   must at least contain the outputs
closure                                PHEN-ADAPT-001 itself exercises
```

Only the second can be empty, which is why only the second needs the rule above. Under revision 7's
derivation both could be empty at once, and the asymmetry that makes the early-slice rule safe would
have been lost without anything noticing.

**This makes a thin character-learning occurrence contract a prerequisite of `ADAPT-001`, not a
consequence of it — and it is now large enough to carry its own decision identity, `EVID-001`,
rather than living as a footnote in this one.** `ADAPT-001` must not define the other route privately
to satisfy its own fixture — that would be the seam inventing the very registry it is supposed to
be audited against.
What the prerequisite needs is small, and explicitly not belief consolidation:

```
OutcomeEvaluationTransition
    TransitionRoute(T)    route/character-learning — separate governed relation
    OutputDefinitions     { OutcomeEvaluation → ExactlyOnePerExecution }
    WriteCapability       NoStateWrites
    WritableStateFamilies { }  — derived

OutcomeLearningEvidenceTransition
    TransitionRoute(T)    route/character-learning — separate governed relation
    OutputDefinitions     { OutcomeLearningEvidence → ExactlyOnePerExecution }
    WriteCapability       NoStateWrites
    WritableStateFamilies { }  — derived
```

or whatever exact decomposition that seam chooses. The property that matters is that
**character-learning evidence may exist without yet writing belief, value, habit, or any other state**
— exactly the early-slice behaviour §4.2 already accepted. Empty `WritableStateFamilies` is what makes
that expressible rather than merely tolerated, and it is why (d)'s well-formedness rule costs nothing
here: a transition that writes nothing cannot cross a route.

`EVID-001` is the seam that must prove, on its own terms and before `ADAPT-001` consumes it:

```
observer-safe consequence input only   → OutcomeEvaluation
OutcomeEvaluation                      → OutcomeLearningEvidence

no belief / value / memory / habit mutation
no outcome-truth read
no AutomaticAdaptationInput admitted anywhere on the route
no ORD-001 decision — no same-event belief read or write is required
```

`ADAPT-001` then **consumes an accepted seam** rather than privately inventing just enough of
character learning to satisfy control 8. That distinction is the whole reason this is a prerequisite
and not an appendix: a seam that builds its own audit target has not been audited.

**(e) Committed to `ModelIdentity`.** Changing any `StateFamilyRoute` assignment, or any transition's
`TransitionRoute`, `OutputRecordSchemas`, or `WritableStateFamilies`, changes `ModelIdentity`. A route
refactor is therefore a model change with a version, not a code change.

**(f) The documents are audits, in both directions.** The inventory's §2 and §3 tables and the table
above are audited against the governed definition — every registered row appears in the document and
every documented row appears in the registry. **No Markdown prose list is the executable source of
truth for route members or for route-specific occurrence/output families.** This keeps the discipline
`SEM-001J` fixed: a document audit is a conformance tool and never a runtime semantic interpreter, and
no non-test module reads these files.

**What this does not settle.** It allocates no numbers (§5.4); it defines no semantic keys (§5.1); it
enumerates no transitions beyond the two `ADAPT-001` needs; and it does not let route membership stand
in for exact basis admission anywhere.

### 2.14 Semantic state keys

§5.1 named this as shape-freeze item **D**'s first dependency and left it open, on the ground that
"keyed by the subject" is insufficient: one character simultaneously holds tolerance to two
substances, sensitization to two stimuli, and many procedural competences. It is specified here.
Value grammars (§2.15), baseline and removal semantics (§5.3), and numbers (§5.4) remain open; this
section fixes **addressing only** — which distinctions a path must be able to make.

**(a) The layering.** Four levels, each already accepted except the third:

```
MutationAuthorityId   who may write            §2.3
LeafFamilyId          what family              §2.6 TargetLeafFamilyId
key schema            how an instance is named ← this section
StatePath             one addressable leaf     STATE_MODEL.md
```

A leaf family declares one key schema. Every instance of that family is one `StatePath`, and the
schema is what says which instances are different leaves rather than different values of one leaf.

**(b) The subject cannot be a state root — this is derived, not chosen.** Revision 4's §5.1 offered
"unless each character owns a private state root whose internal schema supplies the missing
dimension, which is itself a decision". It is not available, for two independent reasons:

1. `STATE_MODEL.md` gives `StatePath = RootStateTypeId / FieldId (/ Selector)*`, and a
   `RootStateTypeId` is a **registered record type** — accepted roots 241–244 are record types 241–244.
   A root per character would mint a type per runtime instance, which the append-only numeric
   registry cannot express and which makes an authority's ownership pattern — "a fixed path prefix
   plus declared selector wildcards" — unconstructible, taking the registry's intersection proof with it.
2. More decisively, any dimension held **inside a value** instead of in the path is invisible to
   §2.9. `tolerance(Mina, alcohol)` and `tolerance(Mina, caffeine)` reached through one per-subject
   record are *one* `StatePath` carrying different contents, so control 7g — the wrong-key control —
   could not be written at all: the committed mutation-path set would be identical in the correct and
   the buggy run.

That second reason generalizes into the rule this section actually follows, and it settles the shape
of every key below without further appeal to taste:

> **The key must expose in the path every distinction the exact-path invariant is required to make.**
> Addressing granularity is set by the isolation obligation, never by storage convenience.

**(c) One selector, whose map key is a canonical record.** Every accepted leaf family today is
`root / field / one mapKey wildcard`, with the map key ranging over that family's own uniqueness key
— including composite ones. Adaptation follows it, rather than nesting one selector per key
dimension, because nested selectors would make `tolerance/mina` an **ancestor** of
`tolerance/mina/alcohol`, and `STATE_MODEL.md` fails a patch on ancestor/descendant overlap. Under a
composite map key every adaptation leaf is a sibling of every other, so §2.10's step-4 duplicate
rejection is exactly byte equality of the encoded path — no ancestor case to reason about, and **no
leaf family's key arity or key schema constrains any other's.** That last consequence is what makes
(e) affordable: uniformity was never required, so it may not be bought at the cost of meaning.

**(d) The five leaf families.**

| Authority | Leaf family | Key schema |
|---|---|---|
| `authority/regulatory-adaptation` | tolerance | `(CharacterId, ExposureReferentId, RegulatoryVariableId)` |
| `authority/regulatory-adaptation` | sensitization | `(CharacterId, ExposureReferentId, RegulatoryVariableId)` |
| `authority/regulatory-adaptation` | regulatory adaptation | `(CharacterId, RegulatoryVariableId)` |
| `authority/regulatory-adaptation` | accumulated load | `(CharacterId, LoadDomainId)` |
| `authority/procedural-skill` | procedural competence | `(CharacterId, ProcedureId)` |

**Tolerance and sensitization carry the response variable, not only the exposure.** This became
visible only once §2.15 wrote their meanings down: *less response* and *more response* are relations
between a stimulus and an effect, and a key naming only the stimulus leaves the effect side to be
guessed downstream. Two unsigned leaves keyed `(CharacterId, ExposureReferentId)` can already say
that Mina is both tolerant and sensitized to alcohol — but not that she is tolerant to its sedating
effect *while* sensitized to its reward response, which is the case worth being able to state. Naming
the response variable makes each leaf an exact claim —

```
tolerance(C, X, Y)       nonnegative weakening of exposure X's response on variable Y
sensitization(C, X, Y)   nonnegative strengthening of exposure X's response on variable Y
```

— rather than one mysterious global "alcohol tolerance" number whose meaning a later transition
function would have to invent. The response variable is the *same* `RegulatoryVariableId` the
adaptation leaf already required, so this costs no new identity. Control 7g extends accordingly: a
spill between two response variables under one exposure is now a wrong-key failure, exactly like a
spill between two exposures.

**The subject is `CharacterId`, and no embodied subject identity is minted.** An earlier revision
proposed `EmbodiedSubjectId` shared across both authorities on the ground that tolerance and
competence both belong to a body. That is wrong for competence. The North-Star execution chain is

```
actual skill + physiology + regulatory state + cognitive control + environment
    → executed outcome
```

so skill keyed to a body identity would collapse two of its own factors: competence is plastic
learned ability belonging to the person, later *modulated* by physiology, not a physiological
quantity. And nothing has earned a body↔character split — no accepted identity provides one, and no
corpus phenomenon witnesses a non-character embodied organism. Keying hidden adaptation to a
character asserts nothing about cognition; `PHEN-ADAPT-001` exists to show exactly that a character
may adapt without knowing it.

**`CharacterId` is a governed role over accepted namespace 1002, not a new namespace.** There is today
no accepted `CharacterId` and no accepted `BodyId`, and the only accepted per-character identity is
`ObserverId` (namespace 1000) — named for a perceptual role, and given no semantic-identity row of its
own in the accepted inventory. An earlier revision concluded from that audit that Campaign 2 must
allocate a new `CharacterId` namespace. That stopped one step early.

The truth-side identity of the person already exists: `SemanticReferentId(person.mina)`. Campaign 1
uses exactly that governed identity for world entities, and §2.14e already reuses namespace 1002 for
`ExposureReferentId` on the same reasoning. A character is a governed semantic entity; the same
argument applies unchanged.

```
CharacterId = governed character-role view of the accepted SemanticReferentId
              family (namespace 1002), under an exact admitted-origin rule
              stating which semantic referents qualify as characters
```

**The decisive argument is that this removes a relation rather than adding one.** A new independent
namespace would immediately owe a second correspondence, because a world event has to know which
persistent character state belongs to its truth-side Actor:

```
allocating a namespace          reusing the family
  SemanticReferentId              SemanticReferentId / CharacterId
    ↕  ?  (unregistered)            one governed semantic identity family
  CharacterId
    ↕  IDN-001                    ObserverId
  ObserverId                        ↕  IDN-001
```

The left column is identity multiplication of exactly the kind the identity-matrix discipline exists
to catch — and the unlabelled edge is the one nobody would notice was missing. I looked for a concrete
reason a simulated character cannot carry the same governed semantic entity identity world truth
already uses, and did not find one: state addressing is not observation, so the family's
"never automatically character-known" property is untouched. On runtime-created characters the claim
must be split, because revision 9 overstated it:

```
representational capacity   namespace 1002 already admits runtime origins, so no
                            future namespace migration is required          — TRUE

semantic qualification      IDN-001 v0.1 does not yet define runtime-origin
                            character qualification                          — OPEN
```

Only authored content carries the `SemanticKind` that `IDN-001` §2.1 qualifies characters by, so a
character born mid-run is a genuine reopen condition there, not something the shared family already
handles. The identity family is future-proof; the qualification rule is not yet general, and this
contract must not imply otherwise. `CharacterId`
and `ExposureReferentId` being two roles over one family is not a collision either — they are
separated by their admitted-origin rules, and a person legitimately being another character's exposure
referent is a case worth being able to state rather than a conflict.

**`IDN-001` remains necessary regardless**, because `ObserverId` is a perspective identity and not a
person identity:

> **`IDN-001`.** Register a governed `ObserverId` → `CharacterId` binding. Leaving the relation to
> convention is the identity hazard this project refuses elsewhere, with the check removed.

**The binding is a relation, not an equivalence.** `CharacterId` is the canonical identity of the
simulated person; `ObserverId` stays what it is, a perspective identity. The first contract needs
only the functional direction:

```
CharacterObserverBinding
├── ObserverId
└── CharacterId

each character-backed ObserverId  → at most one CharacterId    partial function
CharacterId → ObserverId          0..N permitted
```

`IDN-001` `0.3-draft` resolves the reverse direction as `0..N`: a character may hold several
perspective identities without `ObserverId` becoming another spelling of `CharacterId`. `ADAPT-001`
does not decide whether every observer is character-backed — `IDN-001` leaves that partial, and an
unbound observer fails only at a seam that actually requires a character.

**Schema is model identity; the roster is not.** The binding's schema and its cardinality rule are
governed facts committed to `ModelIdentity` / `RegistryIdentity`. The actual pairs — which runtime
observer belongs to which runtime character — are **initial state and content, under `RunIdentity`**.
Changing which runtime character a particular runtime observer belongs to is a changed run, not a
changed psychological model, and putting the roster in `ModelIdentity` would make every cast change
look like a model revision and make two runs of one model structurally incomparable.

**(e) Four distinct referent types, not one generic referent with per-leaf origin rules.** An earlier
revision proposed a single `AdaptationReferentId` whose admitted inner origins were declared per leaf
family. Rejected: by (c), key schemas may already differ per leaf family, so uniformity buys nothing,
and a single type whose *meaning* changes with the leaf that contains it is precisely the
generic-substrate collapse this architecture exists to avoid. The referents are not the same kind of
thing:

```
tolerance, sensitization   → ExposureReferentId     the agent or elicitor a response is TO
regulatory adaptation      → RegulatoryVariableId   the regulated variable or axis being shifted
accumulated load           → LoadDomainId           the domain a burden accumulates IN
procedural competence      → ProcedureId            the ability practised
```

```
ExposureReferent ≠ RegulatoryVariable ≠ LoadDomain ≠ Procedure
```

unless an experiment later proves two may safely collapse. Starting overcomplete and earning the
compression is the safe direction; starting collapsed and trying to split later is not, because by
then the merged paths are already permanent.

**`ExposureReferentId` reuses the accepted `SemanticReferentId` family (namespace 1002) rather than
opening a second semantic universe.** The accepted inventory defines that identity as "governed
truth/content or runtime semantic entity identity, encoded over a nested typed origin identifier so
authored and runtime origins cannot collide; **never automatically character-known**" — which is
exactly an exposure agent, and the final clause is a property `PHEN-ADAPT-001` positively needs
rather than merely tolerates. Namespace 1002 already carries two role names
(`SemanticReferentId` / `CandidateSemanticReferentId`), so a third role name in that family is a
precedented move and not a new allocation. The F decision admits every valid governed origin of this existing family at every ExposureReferentId
position: RequiredNamespace=1002, DomainValidatorId absent. No exposure ontology, validator or
registry is added; exact rule Match supplies behavioral narrowing.

`RegulatoryVariableId` and `LoadDomainId` are **not** world entities — a regulated axis and a burden
domain are governed model vocabulary, closer to the accepted facet and rule identities than to a
referent — so each is its own new model-identity namespace (§5.4). §2.15 may find the two
representationally similar; it may **not** merge them on that basis alone, because equivalent value
shapes do not make "the axis being shifted" and "the domain accumulating" the same thing.

**REG accepted ownership (2026-09-05):**
[REG-001](REG_001_DRAFT_RESOLUTION.md), `regulatory-reference/0.5-candidate`, owns the single
RegulatoryVariableId family, variable numeric domain, unadapted reference and exact displacement
bound relation. The regulatory vocabulary below is consumed from that upstream seam, not defined
by ADAPT for REG to depend on. Campaign 2 F allocates this family under the REG surface. ADAPT
retains the persistent displacement record/key, authority, StateWrites and kinetics. Final ADAPT
consolidation must preserve C,V from state/candidate key into REG validation and specify the exact
hook enforcing validity at authoritative use/settlement, including time-only invalidity without a
write. No clamp, reference repair or constitutional rewrite is permitted. REG is shape-accepted; implementation follows F.

**(f) `ProcedureId` is its own governed identity, not an alias of an action or event type.** Binding
competence to an authored action identity would assert one-to-one that practising an action improves
exactly that action, making transfer and generalization an accident of identifier reuse rather than a
decision anyone made — and the North Star expects skill to eventually carry task-specific competence,
automaticity, precision, error rate, execution speed, transfer, and retention, none of which survives
that collapse. Nothing is lost by separating them: §2.6's committed `AdaptationRuleDefinition` already
owns key derivation, so a qualifying occurrence naming an action still reaches a procedure through the
rule, and that relation may later become many-to-many without touching skill-state identity.
`SEM-001` also left action-schema recognition unresolved, so there is no accepted action-schema
identity to inherit even if inheriting one were right.

**No third dimension in v0.1** — no tool, no context. Context- or tool-specific competence is a real
claim about skill that no phenomenon has asked for; adding it now would freeze an addressing rule
ahead of the experiment that would test it. It is a reopen condition, not a gap.

**(g) What this does not settle.** What a leaf's value *is* (§2.15); whether absence equals baseline
and whether removal is permitted, which the existing registry already treats as a per-leaf-family
property rather than a per-authority one (§5.3); the numbers for the key records, the identities, and
the leaf families (§5.4); the `ObserverId` ↔ `CharacterId` correspondence named above; and which
occurrences qualify as exposure or practice at all, which is world-model scope and outside this
contract in every revision.

### 2.15 Leaf value grammars

Naming a leaf does not define it. §5.2 required, per leaf family, frozen answers to: what the value
means; its exact mathematical domain; signed or unsigned; bounded or unbounded; the canonical
baseline; whether baseline is representable as absence; and which transformations are legal. This
section answers those seven **per leaf family, independently** — no shared scalar is imposed merely
because all five leaves are called adaptation. It deliberately does **not** decide kinetics: how fast
a value rises, how fast it falls, and how repeated exposures combine stay transition-function
territory (§2.11), and nothing here may be read as constraining them.

**(a) Two constraints are derived from accepted substrate, not chosen.**

*Every adaptation leaf value is a `canonical-record`.* The accepted `LeafValueGrammar` has exactly
three tags — `UnsignedCounter`, `MembershipMarker`, `CanonicalRecord` — and none of the first two can
express a signed magnitude, a bounded magnitude, or a value carrying its own unit. So each leaf's
value is a registered record type whose schema carries the representation. This is not a preference:
adding a scalar grammar tag would amend an accepted Campaign 0 substrate enum, which is not something
a Campaign 2 seam contract may do in passing.

*Magnitudes are exact integers on a declared scale.* This is ADAPT's proposed profile; inspection
found that observation uses ExactRational, not this scaled-integer representation. The accepted
substrate supplies exact canonical arithmetic, and REG fixes its own variable lattice upstream.
No floating point, implicit bound or independently supplied magnitude-domain metadata is admitted.

**(b) Scale has exactly one governed home, and it is never the state record.** A magnitude
on a declared scale is ambiguous until the declaration has a single owner: `value 10, scale 100` and
`value 100, scale 1000` are the same semantic magnitude written two ways, and a state record free to
choose its own scale makes two encodings of one state — which breaks canonical comparison, the
digest, and every byte-identity control that depends on it. So scale is a **definition-level governed fact**. LoadDomainId is its own abstract dimensional
discriminator; no load UnitId or conversion is introduced:

```
RegulatoryVariableDefinition   → Scale · Minimum · Maximum in V's own abstract domain
LoadDomainDefinition           → Scale · Unbounded | Bounded {Maximum}, own abstract domain
ProcedureDefinition            → competence scale
tolerance / sensitization      → scale declared by the leaf-family definition (see below)
```

A leaf value carries its canonical integer magnitude **under that one accepted scale** and never
selects a scale. The exact value records each contain only Magnitude; no redundant scale field is stored.
Changing a declared scale changes `ModelIdentity`.

**(c) The five leaf families.** Each row's *marked choices* are argued below it.

| Leaf family | Value means | Domain | Sign | Bound | Baseline |
|---|---|---|---|---|---|
| tolerance | fraction of exposure X's baseline response on variable Y that is suppressed | exact scaled proportion, dimensionless | unsigned | **`0 ≤ v ≤ 1`** | `0` = unadapted |
| sensitization | fractional amplification of exposure X's baseline response on variable Y | exact scaled fractional increase, dimensionless | unsigned | unbounded above | `0` = unadapted |
| regulatory adaptation | displacement of a regulated variable's operating point | exact scaled magnitude in V's own abstract domain | **signed** | see (d) — **not closed here** | `0` = undisplaced |
| accumulated load | burden currently accumulated in a domain | exact scaled magnitude in the domain's own abstract dimension | unsigned | bounded above where the domain declares a capacity, else unbounded | `0` = unloaded |
| procedural competence | task-specific competence at a procedure | record, one declared component in v0.1 | unsigned | unbounded above | `0` = no competence |

**Tolerance and sensitization are dimensionless proportions, and that follows from their key.** An
*absolute* reduction in response would be a quantity in variable Y's unit — and it would depend on
how large the exposure was, which the key does not carry. A key of `(character, exposure, variable)`
can only support a claim that holds across exposure magnitudes, so the value is proportional: the
same exposure now produces this much less of its response. Because it is dimensionless, neither
referent supplies its unit, which is why its scale is declared by the leaf-family definition rather
than by `RegulatoryVariableId`. *Marked choice*, and the reason it is a derivation rather than taste:
an absolute reading would require a fourth key dimension nobody has asked for.

**Tolerance is bounded at 1 and sensitization is not, and the asymmetry is the meaning, not a
convention.** Revision 8 wrote "dimensionless proportion, unbounded above", which does not cohere: if
the value is the fraction of the baseline response that is suppressed, then `0` is no weakening, `1`
is complete suppression, and anything above `1` is not stronger tolerance but a *sign reversal* — the
exposure producing the opposite of its baseline response, which is a different phenomenon and would
need its own representation and its own name. So tolerance saturates:

```
tolerance      0 ≤ v ≤ 1     0 = unadapted · 1 = complete suppression · >1 inexpressible
sensitization  0 ≤ v         0 = unadapted · no natural ceiling on amplification
```

Amplification genuinely has no ceiling in the same sense, so the two bounds differ because the two
quantities do. `proportion + unbounded` could not be allocated and left for a future transition
function to decide what it had secretly meant — which is precisely how a permanent number acquires a
meaning nobody chose. *Marked choice:* an alternative reading, tolerance as an unbounded latent
attenuation coefficient, is available — but it is not a proportion, and taking it would require
defining what the coefficient measures before its domain is frozen.

**Each is unsigned, and that is what §2.3's split buys.** One signed quantity would express both
directions in one leaf — and would thereby make "tolerant and sensitized to the same exposure on the
same variable at once" inexpressible, collapsing opponent-process cases into a single net number no
later phenomenon could take apart. Two unsigned leaves, each with baseline zero, keep both
simultaneously representable, and the exact-path rule keeps a write to one from touching the other.

**Regulatory adaptation is signed because it has no opposite leaf.** An operating point may move
either way and no second family carries the other direction, so the sign lives in the value.

**(d) Regulatory adaptation's bound is NOT closed by this section, and saying so is the point.**
Revision 7 claimed the bound was the variable's declared admissible interval. That is insufficient,
and the counterexample is simple: if a variable's absolute admissible interval is `0..100` and Mina's
unadapted operating point is `80`, a displacement of `+30` is inadmissible even though `30` lies
inside `0..100`. The invariant is not about the displacement alone:

```
reference operating point(CharacterId, RegulatoryVariableId)
    + adaptation displacement
    ∈ RegulatoryVariable admissible interval
```

So the bound needs a **reference operating point**, and this contract must not manufacture one. Two
wrong ways to close it, both rejected: duplicating the reference inside every adaptation value, which
would let one character's stored copy drift from the governed fact and would put constitution inside
learned state; and assuming a model-global operating point every character shares, which silently
denies constitutional variation between characters.

```
RegulatoryVariableDefinition          → Scale · Minimum · Maximum in V's own abstract domain
character regulatory reference        → exact unadapted operating point       ← governed, upstream
RegulatoryAdaptationValue             → signed displacement                   ← this leaf
```

The middle row is now shape-accepted in REG-001, regulatory-reference/0.5-candidate:
referenceOperatingPoint(CharacterId, RegulatoryVariableId, T), with REG-local typed results.
It uses immutable model declarations and accepted TIME materializeLinear, supports closed linear
time variation and fixes the exact signed bound relation. Each V has its own abstract scalar domain;
there is no Unit field or cross-variable conversion. ADAPT must consume validateAdaptedReference
without Boolean-to-string recreation, preserve C,V and freeze the exact candidate and no-write
settlement enforcement hooks. No clamp, D/R0 repair or constitution rewrite is permitted.
The prerequisite is closed; these remaining integration obligations are ADAPT's own work. What this separation preserves is the distinction the whole seam exists for:

```
constitution / baseline   ≠   learned adaptation
```

**(e) Accumulated load stores current load only; `MEC-003` stays on the occurrence.** Negative burden
is not a small burden, it is none, so unsigned with baseline zero, bounded above where the load
domain declares a capacity. Where an adaptation input derives from an accepted bounded effect, §4's
conditional `MEC-003` applies **to that effect occurrence and its provenance** — the
`Capacity`/`Applied`/`Overflow`/`EvidenceKind` decomposition and the hidden-Overflow boundary are
preserved there. It does **not** follow that the persistent leaf duplicates that decomposition:

```
bounded effect occurrence   → Capacity · Applied · Overflow · EvidenceKind preserved
adaptation transition       → derives the resulting current load
persistent load leaf        → current load magnitude only
```

`Overflow` may causally produce some other consequence without becoming part of the stored load, and
`EvidenceKind` is an observation/effect property that must not migrate into hidden embodied state —
storing it in the leaf would put a description of *how something was measured* inside a truth-side
body quantity, which is a category error and one the route separation exists to prevent.

**(f) Procedural competence is a record with exactly one declared component.** The North Star expects
competence to eventually carry task-specific competence, automaticity, precision, error rate,
execution speed, transfer, and retention. Freezing all seven now would invent six representations no
experiment has asked for; freezing competence as a bare scalar would be worse, because adding
automaticity later would invite reinterpreting that scalar as a blend of the two. So v0.1 registers a
record whose single field is named for what it is — task-specific competence magnitude — and the
remaining components are **absent, not folded in**. Adding one later is a new field with its own
meaning, never a re-reading of this one. *Marked choice.*

**(g) Baseline is a distinguished value in every leaf; §2.16 decides what absence means.** All five
baselines are canonically encodable. Whether absence encodes baseline, and whether an explicit
baseline entry is even a legal state, is settled in §2.16.

**(h) Legal transformations — the domain a result must land in, not which result is correct.** A
transition function's output is admissible exactly when it is in the leaf's declared domain, on the
leaf's one governed scale/domain, exact, and — where the leaf, its referent definition, or (d)'s
reference declares bounds — inside them. A result outside the domain is a closure failure at the
transition boundary, not a silently clamped value: clamping would make an out-of-domain function
indistinguishable from a correct one at its limit, which is the same class of error as the naive
clipped-delta learning the observation seam already refuses. Nothing here says which transformation
is psychologically right; that is §2.11's deliberately thin first function.

**(i) What this does not settle.** Kinetics of any kind; the regulatory reference provider (d);
whether `LoadDomainId` and `RegulatoryVariableId` are similar enough to merge, which §2.14e forbids
deciding on value shape alone; the record types and field IDs for the five value records (§5.4); and
what magnitude any authored scenario assigns, which is fixture content.

### 2.16 Baseline, absence, and removal

Revision 1 proposed that tolerance and accumulated load be removable and adaptation, sensitization,
and competence not. That was withdrawn as unearned domain intuition. §2.15g leaves the question in
its answerable form, per leaf family: **must "never had any" and "returned to baseline" remain
distinguishable?**

**The answer is no, for all five v0.1 leaves.**

```
absence  ≡  canonical baseline          all five leaves
removalAllowed = true                   all five leaves
```

**The argument is about what the presence bit would actually be.** Keeping `present { value = 0 }`
solely to distinguish "never adapted" from "adapted once and returned to baseline" creates exactly
one bit of hidden historical state whose entire meaning is *this map entry happened to exist before*.
That bit is a poor representation of every real phenomenon it might be reached for — faster
reacquisition, latent sensitization, skill savings, relapse propensity, long-term damage. Each of
those needs a retained state with its own semantics, magnitude, and decay; none of them is one bit,
and none of them should be reverse-engineered out of whether a map key was materialized. Storing the
bit would let a future implementer believe the distinction is already represented when what is
represented is storage history.

**The v0.1 current-state normal form.**

```
missing path                          = baseline
explicit baseline-valued entry        = noncanonical — fails validation
non-baseline value                    = present entry
non-baseline → baseline               = removal patch
absent → baseline                     = NoStateChange, not a removal
```

The last line ties to §2.8 and to `STATE_MODEL.md` together: `Remove(StatePath, ExpectedOldValue)`
carries an expected old value, so removing an already-absent path fails its precondition rather than
succeeding silently. A rule that computes baseline for an absent path has changed nothing, and the
honest result is the typed `NoStateChange` — which the dispatch record still names, so "no rule
applied" and "a rule computed baseline" stay distinct exactly as §2.7 requires.

**What this buys, stated as properties rather than convenience:**

```
one semantic state             → exactly one canonical representation
delete and recreate            → cannot secretly change psychology or biology
state at population scale      → sparse; unadapted characters store nothing
byte-identity controls          → compare meaning, not materialization order
```

The first is the load-bearing one. Two encodings of one state would break canonical comparison, and
every control in §4 that asserts byte-identical state — 4, 10, 10a, 11 — would be comparing
materialization history alongside meaning without saying so.

**Historical provenance is not lost; it is where it belongs.** Trace and history retain what their own
retention rules retain. This section is about *current state*, and current state is not a place to
smuggle history through the presence of a key.

**Reopen condition, stated precisely enough to be actionable.**

> A phenomenon demonstrates that two characters with **identical present adaptation values** but
> different adaptation histories must behave differently.

If that happens, the answer is to add the historical state that phenomenon actually requires, with
the semantics it requires — not to restore the presence bit and read history out of it.

**Two controls follow, and they are not the same control.** One proves the normal form is enforced;
the other proves it is coherent across a persistence boundary (§4, controls 7l and 7m).

---

## 3. Alternatives considered

| Alternative | Why rejected |
|---|---|
| Authority declares its admitted input type | Couples the authority to today's producer; a second legitimate transition would require amending the authority. Input admission belongs to the transition's typed read-domain. |
| Input names its target authority and leaf | Makes the record a mutation command and moves adaptation reasoning into the producer. |
| One `authority/adaptation-and-skill-learning` | Puts the one place the routes could merge inside a single authority, where a route-separation proof passes with the leak below it. |
| Split actual Skill across both routes | Makes "objectively better, believes worse" inexpressible. |
| Four authorities for row 9's aspects | Buys the third-level check by fragmenting ownership; the check belongs in the phenomenon, where it also catches spill an authority boundary cannot see. |
| One record type with a `route` discriminator | Relabelling would move a record between routes. |
| `ExperienceId` on an adaptation input | A record that can name an experience can be joined to one. |
| Rule names only its target state family | Leaves `StateTransitionFunctionId` to choose among adaptation, tolerance, sensitization and accumulated load — the leaf-routing hand-wave one level down. |
| One function emits a multi-leaf patch | Cannot be ablated, mutation-tested, or traced per leaf. Two affected leaves are two rules and two results. |
| Execution order resolves same-instant collisions | Makes incidental `EventSequence` allocation into a biological aggregation law. Determinism is necessary; incidental ordering becoming semantic is not. |
| Route derived from mutation authority | `MutationAuthorityId` and `LearningRouteId` are independent governed facts; deriving one from the other lets an authority refactor silently move a family between epistemic routes. |
| Route registry covering state families only | Leaves the occurrence/output half of the closure — `OutcomeEvaluation`, `OutcomeLearningEvidence` — open to the same omission that lost associations and relationships. |
| Anonymous function selects the target leaf | Replaces one hand-wave with another: an uncommitted rule cannot be compared across runs, ablated, or replayed, and changing it would not change `ModelIdentity`. |
| Transition admits the record type rather than the basis | Leaves unanswered why a `RegulatoryExposure` does not reach the procedural transition. |
| One basis meaning two things when an occurrence supplies both | Two separately identified inputs, one per basis, keep the two rules and their results independently traceable. |
| Untyped no-op | Collapses "rule ran and changed nothing", "never ran", and "was refused" into one indistinguishable outcome. |
| Treating "no applicable rule" as `NoStateChange` | Hides a missing rule behind a legitimate-looking no-op. |
| Timeline B omits the exposure occurrence | Shifts every later allocated ordinal, so a non-cognitive identity shift would present as the first divergence. |
| Raw observation as the learning-evidence producer | Bypasses the accepted consequence-experience → outcome-evaluation chain. |
| Requiring conscious observation before adaptation | Fails `PHEN-ADAPT-001`'s hidden-exposure case outright. |
| Hidden exposure on the character-learning bus | Produces the forbidden immediate cognitive divergence. |

---

## 4. Proof plan

Verdict fixture: `PHEN-ADAPT-001` `1.10.0-draft` (corpus `0.26.0-draft`). Two timelines share ModelIdentity, initial state, RunSeed, input topology/timing, basis identities,
all non-intervention input bytes and immediate permitted observations. Exactly one authored count
differs, so OrderedInputSequenceDigest and RunIdentity differ only through that intervention.
ComparisonSpecification/ComparisonDrawMap preserve paired random-address coupling where relevant.
Both counts resolve the same ApplicableRules in this fixture; zero still evaluates to NoStateChange.

| # | Control | Obligation |
|---|---|---|
| 1 | Hidden exposure changes the target leaf | exact inequality in the targeted leaf after the qualifying event |
| 2 | Zero mutation in every non-target authority | decomposition level two |
| 3 | Zero mutation in every non-target leaf **within** `authority/regulatory-adaptation` | decomposition level three — the one an authority boundary cannot see |
| 3a | Committed mutation-path set equals expected target-path set | the exact invariant (§2.9); controls 2, 3 and 7g are its decomposition, not substitutes for it |
| 4 | Character-learning-route equality | **every registered** character-learning state family and character-learning occurrence/output structurally equal while permitted observations are equal, where both sets are **derived from the governed route registry** (§2.13d) at fixture time rather than read from a table. At acceptance the both-affected witness must inhabit OutcomeEvaluation and OutcomeLearningEvidence; an empty output closure or absent required witness fails |
| 4a | Persistent closure independent of EVID writes | Register both EVID transitions with NoStateWrites, derived WritableStateFamilies = {}. The character-learning StateFamilyRoute closure still contains all eight registered persistent families. Deriving it from writable transition families must fail this control. This is the persistent half moved from EVID-Q and is owned by ADAPT. |
| 5 | AutomaticAdaptationInput offered to either EVID transition | INPUT_NOT_ADMITTED before state projection or execution |
| 6 | OutcomeLearningEvidence offered to either ADAPT consumer | INPUT_NOT_ADMITTED before state projection or execution |
| 7 | Input carries no routing instruction | the record has no target-authority or target-leaf field; a committed `AdaptationRuleDefinition` alone selects the leaf |
| 7a | Wrong *basis*, right record type | a RegulatoryExposureFact basis offered to ProceduralAdaptationTransition fails INPUT_NOT_ADMITTED — not `NoStateChange` |
| 7b | Typed no-op | an admitted basis whose rule changes nothing yields `NoStateChange` with its rule identity, semantic key, and prior state in trace |
| 7c | Rule is committed, not anonymous | changing the basis→family mapping, the key derivation, or the transition function changes `ModelIdentity` |
| 7d | Route membership is queried, not parsed | the fixture derives both the character-learning state families *and* the route's occurrence/output families from the governed route registry (§2.13); the inventory tables are audited against it in both directions, and the registry is checked exhaustive against the state-family registry, not merely self-consistent |
| 7e | One rule, one leaf family | a rule's committed `TargetLeafFamilyId` is the only leaf it may write; a two-leaf exposure produces two rules and two results, never one multi-leaf patch |
| 7f | No applicable rule ≠ inert rule | an input with no applicable rule yields a dispatch record with an **empty** rule set and no evaluation records; an applicable rule that changes nothing yields a dispatch record naming it plus `NoStateChange`. Constructing a `NoStateChange` for the zero-rule case fails |
| 7g | Wrong semantic key — wrong exposure | mutating `tolerance(Mina, caffeine, Y)` while targeting `tolerance(Mina, alcohol, Y)` fails: the committed mutation-path set must equal the expected target-path set exactly. The two are distinct `StatePath`s by construction under §2.14, differing in one field of one canonical key record — a key held inside a value instead of in the path would make this control unwritable, which is why §2.14b rules that shape out |
| 7g′ | Wrong semantic key — wrong response variable | mutating `tolerance(Mina, alcohol, reward)` while targeting `tolerance(Mina, alcohol, sedation)` fails. This is the spill a two-part exposure-only key could not see at all: both would have been one path, so the committed path set would be identical in the correct and the spilling run |
| 7h | Same-instant collision | two applicable rule evaluations targeting one exact adaptation `StatePath` in one instant fail closure **before either is evaluated**, and the failure is identical whether the second would have produced `StateChange` or `NoStateChange` — an outcome-conditioned policy passes the `NoStateChange` variant and is caught here |
| 7i | Ran-with-zero ≠ never ran | a transition that never executes leaves no dispatch record; a transition that executes and resolves zero rules leaves one. Suppressing the empty dispatch record makes the two byte-identical and fails |
| 7j | Frozen pre-adaptation projection | two non-colliding evaluations in one instant where rule B reads the leaf rule A writes: B's derivation sees the **pre-adaptation** value. Reading the staged patch instead changes B's result and fails |
| 7k | `EventSequence` is absent from adaptation semantics | permuting the `EventSequence` of the same-instant admitted inputs leaves the committed adaptation state byte-identical. This is the positive form of 7h and 7j together — it fails against any implementation that reads or writes through the live instant |
| 8 | Both-affected case | one InputOnly phase-110 root R produces AAI and independent fixed-pulse consequence children; genuine accepted SEM freeze produces OutcomeEvaluation then OutcomeLearningEvidence. Shared ancestry is omniscient only. Unrelated same-time roots and AAI/EVID cross-derivation fail; AD-D11..15 govern the exact bridge. |
| 9 | Later matched challenge | divergence descends from the changed adaptation state; the **first cognitive** divergence descends from a later permitted observation |
| 10 | Adaptation cannot reopen an earlier lane | **within one run**, records frozen by phase 130 are byte-identical before and after the phase-140 write. This is not a cross-timeline claim: A's and B's truth-side records differ by construction, and cross-timeline equality is restricted to the character-epistemic projection |
| 10a | Matched allocation topology | both timelines schedule the same events and consume the same allocator positions; only the semantic exposure facts differ, so no shifted ordinal can masquerade as the first divergence |
| 11 | Save/load and replay | both authorities' leaves survive a persistence boundary byte-identically |
| 7l | Explicit baseline entry is noncanonical | writing `{value = baseline}` to an adaptation leaf fails canonical-state validation. A representation that accepts it has two encodings of one state, and every byte-identity control below silently begins comparing materialization history alongside meaning |
| 7m | Removal and never-present are indistinguishable | a leaf driven non-baseline and then removed to baseline is byte-identical, through a save/load boundary, to the same leaf that was never written. Absence ≡ baseline is a claim about state equality, so it is proved at the persistence boundary and not only in memory |
| 12 | Whole-instant abort | a staged failure after a populated adaptation instant restores state, allocators, trace, and outputs together |

Controls 5–8 are the route-separation proof proper. Every load-bearing guard is mutation-checked
before acceptance, per the discipline `SEM-001` established.

**Preservation obligations** (`CAMPAIGN2_TOPOLOGY_INVENTORY.md` §6.1). `SUB-009` supplies the paired
counterfactual harness — it *is* the method, not a convenience. `SUB-008` supplies first-divergence
replay for control 9's causal ancestry. `RET-006` and `RET-014` are the two canonical leak shapes
controls 5 and 6 refuse. `EXP-002` and `EXP-008` are the existing regression cases. `CTL-001` and
`CTL-008` are comparisons, explicitly not explanations.

**`MEC-003` is conditional, not universal.** *Where an adaptation input derives from an accepted
bounded effect*, preserve the `Capacity`/`Applied`/`Overflow`/`EvidenceKind` decomposition and the
hidden-Overflow boundary. A physiological exposure may well be a bounded effect; a procedural
practice occurrence need not have a meaningful capacity, applied quantity, or overflow at all. The
preservation ledger earned that identity *wherever a bounded effect exists*, and this contract does
not make all adaptation or practice fit the bounded-effect grammar.

---

## 5. Allocation / implementation gates after shape acceptance

The shapes below are accepted as composed with F packaging revision 3. Their earlier rationale
is retained; current disposition is shape accepted, allocation accepted and frozen, implementation
gated. Historical open-item descriptions do not reopen the accepted contract.

### 5.0 The governed route definition — shape specified at §2.13

Revisions 3 and 4 carried this as the first open shape item, on the ground that at acceptance eight of
the ten families have no registered authority at all, so "registered route member" would have no
executable referent and the fixture would have to discover membership by parsing prose.

**Revision 5 closes the shape** (§2.13): `LearningRouteId` as an independent governed identity; total
and singular membership over the ten Campaign-2 state families; occurrence/output closure derived from
canonical transition definitions rather than enumerated; the well-formedness rule that makes an
implicit route crossing *unconstructible* rather than merely prohibited; and `MutationAuthorityId ≠
LearningRouteId` preserved as two registrations rather than one derivation.

What remains open here is **construction and registration, not shape**:

```
i.   realize the accepted logical route registry; eight cognitive families
     remain unmaterialized without active mutation authorities
ii.  implement the accepted EVID occurrence/output contract so the learning
     output closure is inhabited and control 8 can be proved
iii. implement and register LearningRouteId, the route registry and transition
     definitions using the accepted permanent numbers                  (§5.4)
iv.  execute the two-directional runtime inventory proof              (§2.13f)
```

Item ii is the one that changed under review, and it changes what control 4 proves at acceptance.
With an empty character-learning output closure, control 4 asserts equality over a set the fixture
*derived and found empty* — a real assertion about the governed definition rather than a vacuous one,
provided the derivation is queried. That remains true, and the closure still strengthens as Campaign 2
registers transitions without the control being rewritten. But it is **not sufficient for acceptance**:
control 8 and the both-affected obligation name concrete members of that closure, and an empty set
cannot discharge an obligation whose text requires it to be inhabited. §2.13d-bis states the rule and
the minimal prerequisite; it is listed here as a dependency of `ADAPT-001`, not as work `ADAPT-001`
may do for itself.

### 5.1 Semantic state keys — specified at §2.14

Revisions 1–4 carried this open: "keyed by the subject" cannot distinguish tolerance to two
substances, and no permanent `StatePath` key could be allocated until the missing dimension was
explicit. **Revision 7 closes the shape** (§2.14).

Two results are derived from accepted documents rather than chosen — the subject cannot be a state
root, and every distinction §2.9 must make has to live in the path rather than inside a value. The
marked choices are `CharacterId` as the subject with no embodied identity minted, four semantically
distinct referent types rather than one generic referent with per-leaf origin rules,
`ExposureReferentId` reusing accepted namespace 1002, and `ProcedureId` as its own governed identity.

**Nothing remains open here.** The `ObserverId` → `CharacterId` binding this section named as a
Campaign 2A obligation is **shape-accepted** as `IDN-001` `identity-binding/0.5-candidate`
(2026-09-05); permanent allocation is complete. Canonical implementation remains gated by the
applicable VAL and readiness obligations, like every other accepted prerequisite's.

Control 7g's *shape* is fixed by this section, since `tolerance(Mina, alcohol)` and
`tolerance(Mina, caffeine)` are now distinct `StatePath`s by construction. Its construction still
waits on canonical implementation and proof under §5.5; allocation is complete.

### 5.2 Leaf value grammars — specified at §2.15

Revisions 1–6 carried this open: naming the leaves does not define them, and a writable leaf cannot be
registered or canonically serialized without a value. **Revision 7 closes the shape** (§2.15), per
leaf family independently rather than by imposing one shared scalar.

Two results are derived rather than chosen — every adaptation leaf value is a `canonical-record`,
because no accepted `LeafValueGrammar` tag expresses a signed or bounded magnitude and adding one
would amend Campaign 0 substrate; and magnitudes are exact integers on a declared scale with explicit
bounds, following the accepted observation seam rather than a parallel convention. The marked choices
are tolerance and sensitization as two unsigned quantities rather than one signed one — tolerance
bounded at complete suppression, sensitization unbounded above, because the two quantities differ;
accumulated load storing current magnitude only, with `MEC-003`'s decomposition staying on the effect
occurrence and its provenance rather than migrating into the persistent leaf; and procedural
competence as a one-component record whose further components are absent rather than folded in.

**REG prerequisite closed at shape level.** Regulatory adaptation consumes the exact reference and
bound relation in `regulatory-reference/0.5-candidate` — see §2.15d. The reference is time-varying
under the closed linear provider and independent of learned displacement/current physiology.
ADAPT still owes its own exact validation hooks and typed failure-envelope integration, including
the no-write/time-only invalidation case. This is internal consolidation, not an open prerequisite.
F packaging and permanent allocation are accepted; the remaining work is implementation/proof.

Kinetics remain out of scope by construction (§2.11).

### 5.3 Baseline, absence, and removal — resolved at §2.16

Revision 1 proposed a per-leaf removability split; revisions 2–7 carried the question open, correctly,
because deletion semantics follow from the representation rather than from vocabulary.

**Revision 8 resolves it, the same way for all five v0.1 leaves**: `absence ≡ canonical baseline`,
`removalAllowed = true`, and an explicit baseline-valued entry is noncanonical. The argument is not
that history does not matter — it is that a map entry's presence is a poor representation of it. One
bit meaning *this key was materialized once* cannot carry faster reacquisition, latent sensitization,
skill savings, relapse propensity, or long-term damage; each needs a retained state with its own
semantics, and none should be reverse-engineered from storage history. §2.16 gives the normal form,
the reopen condition, and the two controls (7l, 7m) that keep it enforced and coherent across
persistence.

This item is **closed**. The symbolic packaging and authoritative static invariant are now shape accepted for the §5.4
allocation pass. No open prerequisite decision remains. EVID-001,
REG-001, IDN-001, PRJ-001 and WRT-001 are accepted at their recorded levels.

### 5.4 Numeric allocation — ACCEPTED AND FROZEN

The normative numeric source is [CAMPAIGN2_PERMANENT_ALLOCATION.md](../formal/CAMPAIGN2_PERMANENT_ALLOCATION.md),
`campaign2-allocation/0.2-candidate`, ACCEPTED AND FROZEN. The [F symbolic ownership table](ADAPT_001_PACKAGING_DRAFT.md)
retains the accepted shape rationale. Do not allocate from historical prose lists in this draft.
The accepted combined pass distinguishes:

- ADAPT-owned families, records and members;
- shared prerequisite allocations, including LearningRouteId, RegistryDefinitionId and PRJ-owned
  ProjectionAccessorId;
- REG-owned RegulatoryVariableId, RegulatoryReferenceParameterId and reference declarations;
- IDN-owned binding state/value and its qualification contract, consuming shared identities;
- already permanent substrate/SEM identities and schemas, extended only by explicitly required members.

CharacterId and ExposureReferentId remain roles over namespace 1002. No binding-pair occurrence,
ProjectionRequirementId, accessor registry or test-namespace promotion is introduced. Campaign 2
appends only through its own reviewed allocation addendum; it does not reopen or renumber the
closed Campaign-1 SEM allocation. Namespace and member assignments are permanent; no renumbering,
reuse or insertion by shifting is permitted. Later accepted additions append separately.

### 5.5 Current shape, allocation and proof sequence

| Stage | Current disposition / required gate |
|---|---|
| A–D | Shape accepted as composed: topology/storage, ownership/write closure, settlement and actual-fact/consequence source |
| E | Internally shape accepted at adaptation-input/0.31-candidate; closed rule interpreter and AD-E1..13 frozen NOT PASSED |
| F packaging | Revision 3 SHAPE ACCEPTED; AD-F1..7 frozen NOT PASSED |
| Final composition | WHOLE-CONTRACT SHAPE ACCEPTED 2026-09-06 |
| Permanent allocation | ACCEPTED AND FROZEN: campaign2-allocation/0.2-candidate |
| VAL-001 | Shape accepted; implementation-activation dependency remains. Factory and qualification must pass before canonical reliance on affected executables |
| Implementation | Construction proceeds under accepted allocation and applicable readiness obligations; authoritative activation remains VAL-gated |
| Proof gates | Execute registered positive/adversarial, persistence and mutation controls; no pass inferred from review |

E means the rule interpreter and F means canonical packaging throughout this current sequence.
Permanent allocation was the later Campaign 2 F allocation action and is now complete, with its
combined mechanical audit passed. Earlier revision history records the old lettering only.

Accepted prerequisite versions remain EVID character-learning-evidence/0.5-candidate with shared
transition-admission/0.4-candidate; REG regulatory-reference/0.5-candidate; IDN
identity-binding/0.5-candidate; PRJ projection/0.3-candidate-addendum; and WRT
state/0.3-candidate-addendum. WRT is implemented; the other prerequisites retain implementation
and proof gates. No shape/allocation prerequisite decision remains. VAL-001 is P1 and does not block allocation;
it blocks canonical activation where affected governed executable behavior is relied upon.

Current sequence: ADAPT shape accepted → Campaign-2 allocation accepted → satisfy applicable
VAL activation dependency → canonical implementation/activation → frozen proof gates →
PHEN-ADAPT-001 → formal ADAPT-001 closure. Building the VAL factory and qualifying its implementation
is how that activation dependency is satisfied; it is not an additional ADAPT semantic design pass.

The static invariant scans all five stored maps, including untouched entries, independently of E.
It rejects explicit zero and unresolved/out-of-domain values; C's retained-D REG pass separately
checks effective validity at T. See [F's closed invariant and AD-F7](ADAPT_001_PACKAGING_DRAFT.md).

### 5.6 Fixture and formal amendments

PHEN-ADAPT-001 remains unimplemented and unpassed. STATE_MODEL.md's two adaptation rows now
record shape acceptance, with procedural skill explicitly actual competence only; the seam ledger
records allocation unblocked and implementation/proof pending. These are acceptance-bookkeeping
amendments, not claims that physical ownership has been registered or the formal ADAPT row closed.

---

## 6. Reopen conditions

Adaptation becomes behaviourally dependent on awareness, expectation, attribution, or strategy; a
qualifying exposure cannot be defined without perception; one event legitimately updates both routes
without separable records; a fifth regulatory leaf family is required; procedural competence needs a
character-accessible component; procedural competence proves to be context- or tool-specific, so
`(CharacterId, ProcedureId)` no longer addresses one leaf (§2.14f); a governed
occurrence→procedure mapping must become many-to-many; an accepted learning seam must write skill
state from perceived outcome; or the adaptation write cannot sit at phase 140 without deciding `ORD-005`.

Revision 18 (2026-09-05): consumes EVID revision 2''s proposed shared transition/admission/no-write shape; narrows its concrete outcome evidence family to OutcomeLearningEvidence. Generic shape is no longer deferred to C. IDN stays accepted and EVID/REG remain the only open prerequisites.

Revision 19 (2026-09-05): transition-route vocabulary/occurrence closure consumed from shared EVID substrate; this contract retains StateFamilyRoute and its integration proof (control 4a). EVID remains a prerequisite, never a consumer of ADAPT route semantics. OutcomeLearningEvidence is the exact family for this slice, without a universal alias.

Revision 20 (2026-09-05): consumes EVID revision 4 proposed exact-one output production and generative consumer-owned ingress. OutputRecordSchemas is derived from OutputDefinitions. EVID''s top-level ObserverId redundancy is removed; later state-addressing input remains future work. ADAPT''s rule-indexed N-result cardinality requires its own versioned shared-output extension; it is not silently covered by ExactlyOnePerExecution. EVID remains open pending shape acceptance; EVID and REG remain the only open prerequisites.

Revision 21 (2026-09-05): consumes EVID revision 5''s NoStateWrites-only shared surface. StateWrites and rule-indexed N-output production require an ADAPT-earned versioned extension after exact state-family denotation is frozen; EVID does not depend on that extension. Registry kinds and additive ExperienceId role declarations are explicit in EVID. EVID/REG remain open pending actual acceptance.

Revision 22 acceptance bookkeeping (2026-09-05): EVID-001 revision 5 is SHAPE ACCEPTED at
character-learning-evidence/0.5-candidate with transition-admission/0.4-candidate. Its output family
is OutcomeLearningEvidence; no universal alias. All EVID-A..T are frozen, not passed. The accepted
base is NoStateWrites-only; ADAPT C owns the future writing extension and exact state-family
referent. Of ADAPT's prerequisite decisions, REG-001 alone remains open. Earlier revision notes
above record the then-current dependency status, not the present blocker count.

Revision 23 (2026-09-05): records REG-001 revision-5 shape acceptance at
regulatory-reference/0.5-candidate. No prerequisite decisions remain. Earlier revision notes record
historical status only. ADAPT remains DRAFT, not shape-complete. Final consolidation must close exact
state-family referents, StateWrites extension, variable/rule-indexed outputs, REG validation hooks
(including retained D invalidated without a write), OutcomeLearningEvidence integration and F inventory.
REG-A..R remain frozen, not passed. No allocation or implementation is authorized by this bookkeeping.

Revision 24 (2026-09-06): [final shape consolidation, pass 1](ADAPT_001_CONSOLIDATION_DRAFT.md)
proposes exact root-based family denotation, transition-admission/0.5-draft StateWrites and
rule-indexed outputs, adaptation-settlement/0.1-draft transaction staging, REG timing/failure
integration and accepted OutcomeLearningEvidence closure. This linked pass governs those proposed
shapes where older sections still describe them conceptually. AC-A..K are frozen for review, not
passed. It explicitly records three remaining internal shape debts: eight character-learning root
schemas, truth-fact/basis ingress, and the first closed rule interpreter. No open prerequisite
seam decisions are added; ADAPT is not shape-complete and F remains gated.

Revision 25 (2026-09-06): consolidation pass 2 supersedes pass 1 root=family and cognitive-root
requirements with logical Campaign2StateFamilyId and optional materialized storage. Restores PRJ/WRT
prefix; adds exact write-scope/target/diff failures; commits an exclusive phase-140 batch lifecycle;
moves rule-indexed production into ADAPT-specific declarations and closes the five-schema result
payload. Remaining work: governed truth facts/ingress, rule reads/functions, leaf/domain packaging
and complete registration composition. No cognitive storage design prerequisite; F remains gated.

Revision 26 (2026-09-06): consolidation pass 3 specifies V04 singleton/row coexistence with the
proposed V06 registration extension, logical WritableFamilies, state-registry-only ownership and
canonical domain-output order. Adds ADAPT_001_FACT_INGRESS_DRAFT.md as D first draft; no E math.
AC-L and AD-D1..6 remain proposed frozen controls, not passed. No acceptance, allocation or implementation.

Revision 27 (2026-09-06): D revision 2 and consolidation pass 4 record the review corrections.
No SourceEventId/Mode field; InputOnly compiler and replay-verified restore proposed; V06 source
variant explicit; paired RunIdentity differs only through the authored count. Common-root SEM
bridge receiving shape remains open. Corpus/topology draft amendments preserve all broader witness
obligations. No newly opened prerequisite, allocation, implementation or shape acceptance.

Pass 5 / revision 28 (2026-09-06): [exact D bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md) proposes
the fixed pulse→accepted observation→SEM consequence freeze→EVID receiving recipe. AD-D11..15
cover common-root ancestry and hidden-count noninterference. Corpus 0.26 / PHEN-ADAPT-001 1.10
and topology inventory 0.5 are synchronized. A/B/C remain internally shape-ready; D recipe is
ready for review, not accepted. E/F remain open. No implementation or numeric allocation.

Revision 29 (2026-09-06): D restore now recompiles only the committed initial schedule and validates
the exact pending InputOnly set at the saved boundary. No domain-history replay or trace/output
equality requirement. Source+optional bridge closure composed; proof setup synchronized to
PHEN-ADAPT-001 1.10/corpus 0.26 and the count intervention. D is internally shape-ready pending
review/composition; ADAPT overall remains unaccepted with E/F open. No allocation or implementation.


Revision 30 / consolidation pass 7 (2026-09-06): incorporates the pass-6 review. D is internally
shape-ready after synchronizing the actual revision-4 ingress, source/bridge closure, owning version,
logical-family table and exact AAI/dispatch prose. AD-D1..15 remain frozen, not passed. E revision 1
proposes the closed rule interpreter and AD-E1..12; E is under review, F follows E. ADAPT overall
remains not shape-complete. No allocation or canonical implementation.


Revision 31 / pass 8: E revision 2 addresses the reviewer's remaining shape issues: one immutable
projection per rule, exact read-to-evaluation segments, construction-time guaranteed target
collision rejection, and removal of redundant Function/Resolution fields. AD-E7 is strengthened;
AD-E13 added. E semantic direction is accepted; E shape acceptance remains pending review.
A/B/C/D stay internally shape-ready. F follows E; no allocation or implementation.


E acceptance recorded 2026-09-06: revision 2 at adaptation-input/0.31-candidate is an INTERNALLY
SHAPE ACCEPTED component; AD-E1..13 are FROZEN IMPLEMENTATION GATE, NOT PASSED. Main ADAPT stays
adaptation-input/0.31-candidate; this scoped component acceptance is not whole-contract acceptance.
[F packaging inventory](ADAPT_001_PACKAGING_INVENTORY.md) records the remaining symbolic surface.
Sequence: F canonical packaging → final ADAPT composition review → Campaign 2 F permanent
allocation. Implementation and permanent allocation remain unauthorized.


F composition update (2026-09-06): [symbolic packaging](ADAPT_001_PACKAGING_DRAFT.md) records
the supplied domain decisions and ownership audit. All ADAPT-owned semantic definitions target
adaptation-input/0.31-candidate; independent V06 and settlement targets remain 0.6-candidate and
0.2-candidate. Candidate version spelling is not whole-contract acceptance. A–E behavior is
unchanged; shared PRJ-owned ProjectionAccessorId now closes the accessor allocation-home gap. No allocation
or implementation. Historical status entries above remain review history.


Accessor resolution (2026-09-06): [F packaging revision 2](ADAPT_001_PACKAGING_DRAFT.md) and PRJ
record shared ProjectionAccessorId with three symbolic members, no numeric allocation and no
global type-147 restriction. No known identity-home gap remains; A–E and their versions are
unchanged. Final packaging/composition review remains before allocation or implementation.


Composition revision 33 (2026-09-06): F packaging revision 3 adds the timeless full-state
validator and AD-F7, preserves separate time-dependent REG validity and existing error carriers.
Main §§2.15(h), 5.4 and 5.5 use current domain/ownership/sequence terminology. V06 wrapper spelling
is synchronized to 0.6-candidate without a semantic change; ADAPT stays at 0.31-candidate target.
Whole-contract shape acceptance, permanent allocation and implementation remain pending.


## Whole-contract shape-acceptance record — 2026-09-06

2026-09-06 whole-contract verdict: SHAPE ACCEPTED at adaptation-input/0.31-candidate with
transition-admission-extension/0.6-candidate and adaptation-settlement/0.2-candidate. A–D are
shape accepted as composed, E revision 2 unchanged, and F packaging revision 3 shape accepted.
Permanent allocation is now authorized as the next specification step; canonical implementation
is NOT authorized. ADAPT-001 stays OPEN in the formal register until PHEN-ADAPT-001 and required
proof/mutation gates pass. VAL-001 does not block shape acceptance or allocation; close it before
canonical reliance on affected governed executables, including the CONTENT-001 character-kind
validator. AD-F1..7, AD-E1..13, AD-D1..15, AC-A..L, main ADAPT controls, REG-A..R, EVID-A..T and
applicable inherited PRJ/WRT gates remain frozen; this verdict passes no implementation gate and
does not rescind previously recorded WRT substrate proof. PHEN-ADAPT-001 remains NOT PASSED.

Sequence: accepted shape → combined permanent allocation addendum → close applicable VAL-001
activation dependency → canonical implementation → frozen gates → PHEN-ADAPT-001 → formal closure.
All preceding dated pass notes are historical. No further semantic design blocker is identified.


Allocation pass started (2026-09-06): the [combined proposed table](../formal/CAMPAIGN2_PERMANENT_ALLOCATION.md) now covers the accepted PRJ/IDN/EVID/REG/ADAPT schema surface with explicit proposed numbers. Its audit records two unresolved inherited namespace homes (SemanticKind and SeamId), so allocation closure is not claimed and proposals have not been promoted into the accepted permanent registries. All accepted ADAPT semantic versions and gates remain unchanged.


Whole-contract allocation clarification (2026-09-06): both transition/regulatory-adaptation and
transition/procedural-adaptation have ExecutingSeamId = SeamId/1036 with exact canonical NFC text
payload seam/automatic-adaptation. ExecutingSeamVersion remains adaptation-input/0.31-candidate.
This freezes the previously unspecified member of an already accepted field; no equation, record
shape, D source, F domain or PRJ semantics changes. Separate regulatory/procedural seam IDs are not
introduced. See the campaign2-allocation/0.2 review candidate; numeric acceptance is still pending.


## Campaign 2 permanent allocation accepted and frozen — 2026-09-06

The revision-2 review's final mechanical conditions A/B passed: exact complete Markdown/JSON
parity and the explicit observation/0.1-candidate SeamId declaration at
../formal/OBSERVATION_AND_EVIDENCE.md:5 (accepted status at line 3).
The [permanent registry addendum](../formal/CAMPAIGN2_PERMANENT_ALLOCATION.md) is now
**campaign2-allocation/0.2-candidate, ACCEPTED AND FROZEN**. This disposition supersedes earlier
allocation-pending statements; it does not revise accepted seam semantics. Records 260..328,
namespaces 1004, 1026..1036 and 1116..1121 as listed, all 58 member payloads, 32 union variants
and 10 finite field values are permanent. No renumbering, reuse or insertion by shifting; future
additions append. All earlier proposed assignments are preserved. Namespace 1004's prior
availability is historical; it is now assigned to CONTENT/shared SemanticKindId. SeamId/1036
is shared, with contextual Campaign-2 enforcement and no global legacy trace migration.

Allocation acceptance permits canonical construction of already shape-accepted surfaces subject
to their remaining implementation gates. No construction was performed by this disposition.
VAL-001 remains independent and must close before canonical reliance on affected governed
executable closures, including the CONTENT character-kind validator. ADAPT-001 remains formally
OPEN; PHEN-ADAPT-001, C2-F-ID-1/2 and all other unexecuted frozen gates remain NOT PASSED.
Allocation is not implementation proof for EVID, REG, IDN or PRJ; previous WRT proof is preserved.
