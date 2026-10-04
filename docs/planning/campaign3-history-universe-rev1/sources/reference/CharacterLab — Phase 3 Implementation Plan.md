# CharacterLab — Phase 3 Implementation Plan

**Companion to:** `CharacterLab — Phase 3 Research Brief.md`, `CharacterLab — Deterministic Cognitive
Reference Model Brief.md` (master brief), and `claude/characterlab-research-log.md`.
**Status:** Superseded as the active build sequence; retained as an unexecuted hypothesis and design
source. Its prior approval records the state of planning under the additive Phase 3 roadmap, not current
authorization to execute 3A→3B→3C. The governing next deliverable is the North-Star Reference Scaffold
defined in `CharacterLab — Ideal Character Architecture North Star.md` and `CHARACTER_ARCHITECTURE.md`
§11.
**Scope:** Phase 3A (Predictive Belief & Threat Appraisal), 3B (Social Belief & Appraisal), 3C
(Constitutional Personality Modulation).

The mechanisms below may be reused as thin reference implementations or competing models. They must
not silently collapse North-Star seams, and the fixed seven-dimensional personality proposal must be
treated as a falsifiable candidate rather than a required final ontology.

---

## 0. Where Phase 3 lands architecturally

Phase 2.5e and Phase 2.97 jointly did Phase 3 a large favor without meaning to. Two boundary objects
already exist that Phase 3's own brief asks for by name:

- **`SemanticExperience`** (`model/semanticExperience.ts`) — the character-relative record of "what
  happened," already excluding Overflow and every other piece of simulator-omniscient world-truth.
  Its own module comment says outright: _"Phase 3 (belief/appraisal) is the first consumer this
  formalization is FOR: it should read a character's `SemanticExperience`, never a raw
  `WorldOutcomeTable`/`RealizedEffect`/`saturationAnalysis` entry."_ Phase 3A's `PredictionOpportunity`
  classification (Brief §15-17) is exactly a new function that reads a `SemanticExperience` and an
  authored prediction definition and decides what evidence, if any, resulted.
- **`RawCognitiveSignal` / `SourceRole`** (`model/reasonNucleus.ts`, compiled by
  `model/diceCompiler.ts`) — already has the exact three roles Phase 3's brief invents its own
  vocabulary for: `MotiveGenerating` (Brief §27: "ThreatAppraisal emits RawCognitiveSignal
  SourceRole = MotiveGenerating"), `StandingDisposition` (Brief §58: "Personality... compile it
  through Phase 2.97['s] Reason Nuclei"), and `SituationalEvidence`. **Nothing in
  `reasonNucleus.ts` or `diceCompiler.ts` needs to change.** Threat appraisal and personality are new
  _emitters_ into this pipeline, structurally identical to `model/commitment.ts` — Phase 2.97's own
  closure audit already proved `MotiveGenerating` is an open family (Need pressure, Commitment
  pressure), and Phase 3 adds a third and fourth member (Threat pressure, Personality-as-Standing
  pressure) the same way, with zero kernel or compiler changes.
- **`EvidenceBasis` / `consolidateCorrelated`** (`kernel/evidenceOverlap.ts`) — Brief §19 says to reuse
  this directly for belief evidence provenance ("using the provenance machinery established in Phase
  2.97"). No changes needed; belief updates just need to populate an `EvidenceBasis` the same way
  `situationalMemorySignals` already does (`{[experienceId]: 1}`). See Decision 6 for the one real
  subtlety review surfaced: correlation discounting is scoped per learned _target_, never across two
  different propositions the same Experience happens to support.
- **`(μ, τ)` + `updateExpectation`/`confidence`** (`model/expectation.ts`) — Brief §13's
  `BeliefLikelihood(μ_p, τ_p)` and §14's `OutcomeMagnitudeBelief(μ_s, τ_s)` are the _exact same shape_
  `NeedExpectation` already is, and `updateExpectation` is already generic over what `x` and `n` mean —
  it takes a prior, params, Δt, an observation precision, an observed result, and an `EvidenceKind`
  ('point' | 'lower_bound' | 'upper_bound'), and returns a next `(μ, τ)`. It does not know about Needs.
  **Belief likelihood/severity and Relief updates can call this math unmodified** — see Decision 10
  for how this gets reflected in the _types_, not just reused informally.
- **`quadraticForm` + `boundedResponse`** (`kernel/linalg.ts`, already used by
  `identity.ts::projectTrait`) — Brief §60's constitutional projection formula
  `C_j = g(b_j + w_j^T P + P^T Q_j P)` is bit-for-bit the same shape as `identity.ts`'s named-trait
  projection. `constitution.ts::projectConstitutional` can be a near-copy of `projectTrait`.

The practical consequence: **Phase 3 should need zero new kernel primitives.** Everything in
`kernel/` (exact rationals, discrete distributions, evidence overlap, linear algebra, the
counter-addressed random oracle, canonical ordering) already covers what the brief asks for. The
first concrete milestone below is to verify this claim by writing Phase 3's types against the
existing kernel before writing any new model-layer math — if some kernel gap turns up, that itself is
a finding worth recording (mirroring Phase 1's "fraction-free linear algebra" gap discovery), not
something to guess about in advance.

What genuinely is new: the _model-layer_ vocabulary (conditional predictions, opportunity windows,
threat appraisal, condition exposure, observation grants, social evidence, the personality vector) and
the _orchestration_ in `cycle.ts` that wires perception → opportunity-window advancement → belief
update → appraisal → exposure-weighted signal emission → dice, in that order, for every tracked
prediction, every cycle.

---

## 1. Cross-cutting scoping decisions

Following this project's own convention (every phase's lead module opens with a scoping section
before any math), these are the calls to make explicitly before writing code, with a recommended
default for each. None of these are free — they should be revisited if an experiment contradicts
them, exactly as Phase 2.97's own scoping decisions were.

**Decision 1 — Belief storage shape, and the affected/appraisal referent split.** A single
`Map<string, ConditionalPredictionState>` on `CharacterState`, keyed by the canonical serialization of
`ConditionalPredictionKey`, where `ConditionalPredictionState = { likelihood: BeliefLikelihood; severity:
OutcomeMagnitudeBelief }` (see Decision 10 for what these type names actually resolve to). One map
serves both Phase 3A (self-referential predictions like `Near(Self,DogA) → PhysicalInjury(Self)`) and
Phase 3B (predictions about others, e.g. `Promises(Glen) → Fulfills(Glen)`) — Brief §43 explicitly
frames this as "an explicit Phase-3 hypothesis," so 3B's build step is "does 3A's belief store need
_any_ changes to host social predictions," and the recommended answer going in is no.

**Correction (review):** `ConditionalPredictionKey` must carry two distinct referent fields, not one —
who is _affected_ by the predicted outcome, and who/what the appraisal should be _anchored to_ when it
becomes a Reason Nucleus. For `Near(Self,DogA) → PhysicalInjury(Self)`: `affectedReferent = Self`,
`appraisalReferent = DogA`. The resulting Reason Nucleus is `Safety × DogA`, never `Safety × Self` — a
character doesn't develop a motive about _herself_ from this prediction, she develops one about the
dog. `RevealVulnerability(To=Darius) → Rejection(Self)` is the same shape: `affectedReferent = Self`,
`appraisalReferent = Darius`. Both fields are exact, typed, and authored/selected per
`ConditionalPredictionDef` — never inferred at runtime from predicate structure (no "guess the subject
of the condition's second predicate" heuristic). `threatAppraisalSignals` (§2.1) reads
`appraisalReferent`, never `affectedReferent`, when building a `RawCognitiveSignal.referent`.

**Decision 2 — ConditionKey/OutcomeKey canonicalization lives in a new `model/belief.ts`, not in
`kernel/canonical.ts`.** Predicates (`Near`, `Present`, `Promises`, `Fulfills`, ...) are domain
vocabulary, not kernel-generic machinery — same reasoning that put `ReasonNucleusTriple`'s
canonicalization in `model/reasonNucleus.ts` rather than the kernel. `belief.ts` uses
`kernel/canonical.ts::compareCanonical` for the actual ordering, exactly as `reasonNucleus.ts` and
`identity.ts` already do.

**Decision 3 — `OutcomeKey` values are `ConceptKey`s of category `'OutcomeConcept'`.** `model/types.ts`
already declares `'OutcomeConcept'` in its `ConceptCategory` union, unused since Phase 1
("declared here so Phase 2+ code has a fixed place to plug in without renegotiating the vocabulary").
Phase 3A is where it finally gets instantiated (`outcome.physical_injury`, `outcome.rejection`, ...) —
no new `ConceptCategory` needed.

**Decision 4 — the affected-MotiveChannel mapping reuses the existing 11 `MotiveChannel`s (Brief §12's
"deterministic relationships to relevant MotiveChannels/Needs")**, not a new vocabulary. `PhysicalInjury
→ Safety`, `Rejection → Connection[, Recognition]`, `JobLoss → Achievement[, Safety]`, `StatusLoss →
Recognition`, `AutonomyLoss → Autonomy`, etc. all fit `Achievement | Autonomy | Caregiving | Commitment
| Connection | Habit | Novelty | Recognition | Recreation | Rest | Safety` without a new entry. Flag
for revisit only if a required experiment's outcome genuinely has no honest home (mirrors how
`'Habit'` was added to the enum in Phase 2.97 only once accessibility needed a real channel). Per
Decision 1's correction, the resulting nucleus's referent is the `OutcomeDefinition`'s mapped channel
crossed with the prediction's own `appraisalReferent`, never `affectedReferent`.

**Decision 5 (REVISED) — how an Option's relationship to a threatening condition is authored.**
Original draft proposed a `±1` psychological-polarity table mirroring `identity.ts`'s
`ReasonChannelPolarityTable`. Review correctly rejected this: exposure to a physical/situational
condition is a **world-semantic** quantity, not a psychological one, and collapsing it to a signed
polarity would already be smuggling an appraisal judgment into what should be a purely factual "how
much does taking this Option put me in/near the condition" fact.

Revised design — `model/conditionExposure.ts`:

```
ConditionExposureProvider = (optionKey: CanonicalActionKey, conditionKey: string) => Rational
                             // ∈ [0,1], exact
```

`0` = this Option avoids/terminates the condition entirely; `1` = this Option fully enters/maintains
it; intermediate exact rationals represent partial exposure (e.g. an Option that puts distance between
the character and `DogA` without leaving the room entirely). **`ThreatAppraisal` itself stays
Option-independent** (Decision 7-revised, below) — `Probability`/`Severity`/`Vulnerability`/`Control`/
`Immediacy`/`ThreatStrength` are all properties of the _belief_, computed once per active adverse
prediction, never per Option. An Option's actual signed pressure is derived at signal-emission time as
`ThreatStrength × Exposure(optionKey, conditionKey)` — this is the only place exposure enters the
computation. Avoidance receives **no automatic positive bonus**: `Exposure = 0` means zero threat
pressure on that Option, not a positive pull toward it. Any positive pull toward avoidance is earned
separately, through `ReliefExpectation` (Decision 6) — keeping "this reduces predicted harm" and "this
has previously felt good to do" as the two structurally distinct channels Brief §29-31 requires.

The default implementation is an authored, per-scenario `Record<CanonicalActionKey,
Partial<Record<string, Rational>>>` lookup table (global, category-style content, never a
per-named-entity weight — consistent with every other scenario-authored table in this codebase), but
it sits behind the `ConditionExposureProvider` function type as a seam: a future world/action-transition
model could derive exposure from actual precondition/effect semantics instead of an authored table,
without `threatAppraisal.ts` or anything downstream needing to change. Treat the _authored values_, not
the interface shape, as the falsifiable part — budget real exploration time at Experiments A9/A10
(probability-vs-severity, control) for whether binary-ish authored exposure is expressive enough.

**Decision 6 (REVISED) — Relief is its own learned term, never a fake Need, and correlation
discounting is scoped per learned target.** Brief §31 is explicit: "Do not force relief into a fake
Need merely to reuse existing code." `ReliefExpectation` reuses `updateExpectation`'s math (Decision 10) but is stored and consumed as its own thing: a `Map<string, ReliefExpectation>` keyed by
`ActionKey::ThreatContextKey`, feeding a _separate_ `MotiveGenerating` signal
(`model/relief.ts::reliefSignals`) onto avoidance-shaped Options, distinct from — and additive with,
never substituting for — the exposure-weighted threat-appraisal signal itself.

**Correction (review):** the same Experience legitimately supporting two _different_ learned
propositions (e.g. one episode both teaching something about `Near(Self,DogA)→PhysicalInjury(Self)`
_and_ something about `ReliefExpectation(flee, dog-threat-context)`) is not double-counting and must
never be suppressed as if it were. `consolidateCorrelated` (`kernel/evidenceOverlap.ts`) must only ever
be invoked _within_ one target's own contribution list — all contributions competing to update the
_same_ `ConditionalPredictionKey`'s belief, or all contributions competing to update the _same_
`ReliefExpectation` key. A threat-belief update and a relief update sourced from the same
`experienceId` are never compared against each other for redundancy; they are two independent target
maps, each consolidated (if at all — most updates will be single-observation, not multi-source) purely
against same-target contributions. This mirrors how `diceCompiler.ts::consolidateSigned` already scopes
correlation to one `(Option, MotiveChannel, Referent)` triple at a time — the fix here is simply to make
sure belief/relief updates follow that same per-target scoping and never introduce a global
cross-proposition discount.

**Decision 7 (REVISED) — AcuteFear/ThreatStrength are trace-only, recomputed every cycle, never
persisted state, and are computed once per prediction, not once per Option.** (Brief §26: "this derived
value is initially trace state... Only introduce persistent `FearState` if experiments demonstrate
causal carry-over that cannot be reproduced by beliefs, memory, stress state, or context.") Matches how
`semanticSalience`/`saturationAnalysis` are already trace-only recomputations in `CycleResult`. The
"once per prediction, not per Option" half is new in this revision, following directly from Decision 5:
since exposure now carries all of the per-Option variation, `ThreatAppraisal` has no reason to be
computed more than once per active adverse prediction per cycle.

**Decision 8 (REVISED) — no `ConceptRelation`/generalization machinery is built up front, and the bar
for calling generalization DERIVED is sharpened.** Brief §33 requires `ConceptRelation` be built only
if the specific→novel-member test (Experiment A7) fails without it. **Correction (review):** the
original draft's proposed check — "does `DogB` end up somewhat avoided, via ordinary accessibility
pulling an avoidance action into consideration" — is not a valid pass condition. Association answers
_what comes to mind_; generalization must answer _what evidence about `DogA` is warranted to apply to
`DogB`_. A7 only counts as DERIVED if the existing architecture produces a real, traceable belief- or
appraisal-level effect specifically on `DogB`'s own `ConditionalPrediction`/`ThreatAppraisal` — i.e.
`DogB`'s own belief likelihood measurably shifts, or `DogB`'s own appraisal shows elevated
`ThreatStrength`, attributable to `DogA`'s attack. Mere incidental behavioral avoidance driven by
associative accessibility (Habit-channel pull) without any corresponding shift in `DogB`'s own
prediction/appraisal state does **not** satisfy A7 and must be classified `REQUIRES GENERALIZATION
MECHANISM`, triggering the typed `ConceptRelation`/`InstanceOf` machinery the brief contemplates
(§33-34).

**Decision 9 — Personality (`P`) is a new immutable `CharacterState` field, built in 3C, consumed
nowhere until then.** 3A and 3B must not read a not-yet-built `P` — Brief §57's "personality is not
acquired identity" boundary and `decision.ts`'s own standing "PERSONALITY SCOPING NOTE" (written back
in Phase 2.9, anticipating this exact moment) both apply: when 3C lands, personality-sourced
`StandingDisposition` signals must flow through the _same_ `RawCognitiveSignal` pipeline every other
source already uses — never a second, separate bonus layered on top of behavior it already produced.

**Decision 10 (NEW, review) — a generic `EvidentialEstimate` type, with `NeedExpectation`,
`BeliefLikelihood`, `OutcomeMagnitudeBelief`, and `ReliefExpectation` as semantic aliases.** The `(μ,
τ, lastUpdatedAt)` shape and the `updateExpectation`/`confidence` functions in `model/expectation.ts`
are already fully generic — nothing in their signatures references `NeedId` or anything Need-specific
(the update function takes a prior, params, Δt, an observation precision, an observed result, and an
`EvidenceKind`). Review's correction: **do not let belief/severity/relief state semantically _be_
`NeedExpectation`** just because the shape matches — that conflates four genuinely different learned
quantities under one Need-flavored name. Instead:

- Add a small, purely mechanical refactor: rename the generic core (interface + params + update +
  confidence functions) into a new home — `model/estimate.ts` — as `EvidentialEstimate`,
  `EstimateParams`, `updateEstimate`, `estimateConfidence` (or equivalent generic names). No math
  changes; this is a rename/relocation of existing, already-tested logic.
- `model/expectation.ts` keeps `NeedExpectation`, `NeedExpectationParams`, `initialExpectation`,
  `updateExpectation`, `confidence` as thin type aliases / re-exported wrappers over `estimate.ts`'s
  generic core, so every existing call site and test (all ~330 of them) needs zero changes.
- `model/belief.ts` defines `BeliefLikelihood = EvidentialEstimate` and `OutcomeMagnitudeBelief =
EvidentialEstimate` (distinct _names_, same underlying shape — TypeScript branded/nominal aliasing if
  useful for catching accidental cross-assignment, plain type aliases otherwise; decide based on
  whether a real bug class shows up in practice).
- `model/relief.ts` defines `ReliefExpectation = EvidentialEstimate` the same way.

This is the very first build step (§2.3/§6) precisely because everything else in Phase 3 depends on
importing from `estimate.ts`, and it must be proven not to disturb any existing behavior before
anything is layered on top of it.

**Decision 11 (NEW, review) — `PredictionOpportunity` requires explicit, stateful opportunity-window
tracking; `SafeOpportunity` may never be inferred merely from a tick with no bad outcome.** The
original draft treated opportunity classification as a pure per-`SemanticExperience` function. Review
correctly identified this as insufficient: Brief §16's own worked examples ("Mina remains nearby long
enough... no attack occurs → `SafeOpportunity`" vs. "Mina sees dog, immediately leaves →
`CensoredOpportunity`") require knowing _how long_ an exposure lasted and whether it was _sufficient_,
which a single-Experience snapshot cannot answer on its own.

Revised design: a new persisted `CharacterState` field, `openPredictionOpportunities:
ReadonlyMap<OpportunityId, OpportunityWindowState>`.

**Correction (review):** `OpportunityId` is a concrete opportunity/episode identity, **not** merely
`ConditionalPredictionKey`'s canonical string. Two separate encounters with the same condition (e.g. two
distinct episodes of `Near(Self,DogA)`, on different days, possibly with another unrelated
`Near(Self,DogA)` opportunity still open) are two separate evidentiary opportunities and must be tracked
as two separate map entries — never merged, never overwriting one another, never silently treated as "the
same" window just because they share a `ConditionalPredictionKey`. `OpportunityId` is minted fresh (e.g.
`ConditionalPredictionKey`'s canonical string + a monotonically increasing per-key episode counter, or an
equivalent scheme reusing this codebase's existing deterministic-ID conventions) at the moment a window
_opens_, and a `ConditionalPredictionKey` may legitimately have zero, one, or several concurrent open
`OpportunityId`s at once (e.g. re-approaching a condition while an earlier exposure to a _different_
instance of it is still open) — `advanceOpportunityWindow` must never collapse concurrent opportunities
for the same key into one.

`OpportunityWindowState` carries `beganAt`, accumulated `exposureMagnitude` (or a simpler
sufficiency counter — decide empirically against A2/A3's real numbers), and enough to compute whether
the window has met its `ConditionalPredictionDef`-authored sufficiency threshold **while the condition
remained observable**. Each cycle, for each open (or newly-openable) opportunity,
`predictionOpportunity.ts::advanceOpportunityWindow(priorWindow, experience, predictionDef)` either:
opens a new window with a fresh `OpportunityId` (condition just became satisfied and observable, and no
other window for an overlapping instance already covers it), continues an existing window (condition
remains satisfied and observable — accumulate, do not re-emit evidence), or closes a window — producing
at most one `PredictionOpportunity` evidence event — either because the outcome occurred
(`OutcomeOccurred`), because the window closed _after meeting sufficiency while the condition remained
observable_ with no outcome (`SafeOpportunity`, now backed by a real, positively-represented completed
window rather than a mere tick-level absence), or because observation ended / the character disengaged /
the window timed out before sufficiency was met while observable (`CensoredOpportunity`).

**Correction (review) — the authored maximum window duration is a closing mechanism only, never
evidence of safety.** An authored max-duration timeout exists solely to bound
`openPredictionOpportunities`'s growth for a condition that becomes permanently unobservable without
formally closing (e.g. the character loses track of the condition, or the scenario ends, before the
window can close through the ordinary sufficiency-or-outcome path). Hitting the timeout **always** closes
the window as `CensoredOpportunity`, regardless of how much exposure had accumulated up to that point — a
timeout is a "we stopped being able to observe this" event, not a "sufficient safe exposure occurred"
event, and must never itself trigger `SafeOpportunity`. `SafeOpportunity` may only ever be produced by the
ordinary path: sufficiency was met _and_ the condition was still observable at that moment, and the
window closed from that state with no outcome having occurred. (Never silently dropped, never silently
converted between kinds.)

**Decision 12 (NEW, review) — Phase 3B's cross-character visibility gate is a deterministic
`ObservationGrant`, structurally separate from psychological weighting.** See §3.1 for the full design;
recorded here because it is a cross-cutting boundary decision of the same weight as Decisions 5/11.
Visibility (did the observer have _any_ epistemic access to this field of this event at all) is
authored/derived by the scenario/world layer as a hard, deterministic mask — **not** an arbitrary
psychological-fidelity table. Only the fields an `ObservationGrant` marks visible are ever fed into an
observer-relative `SemanticExperience`-style slice; _within_ that visible slice, the existing
attention/salience machinery (Phase 2.5b/c) does the psychological weighting exactly as it already does
for self-observation. `DecisionExpression.chosenIntent` is never exposed through this gate merely
because it seems "legitimately inferable" — it enters `ObservedSocialEvidence.observedIntent` only
through an explicit communication/observable-signal channel; absent that, an observer's belief about
what another character intends is formed the ordinary way, through `ConditionalPrediction` updates
driven by observed action and outcome, never a privileged read.

**Correction (review):** the `[0,1]` grading on an `ObservationGrant` field represents **information
availability/fidelity only** — e.g. "the observer was at a distance and only partially made out this
field" — and must never be read, weighted, or documented as psychological importance. Attention/salience
remains the _only_ layer that determines how much an observed field matters to the observer
psychologically; `ObservationGrant` decides whether/how-much a field was epistemically available at all,
full stop. To keep this boundary from eroding into a de facto second salience system by accretion, the
default authoring discipline for Phase 3B's first experiments (B1 onward) is to use **only `0` and `1`**
for every `ObservationGrant` field unless a specific experiment's design explicitly requires partial
observability to test something (e.g. a dedicated partial-visibility experiment, if one is added later).
An authored `0.6` should never appear as an incidental scene-dressing choice.

---

## 2. Phase 3A — Predictive Belief & Threat Appraisal

### 2.1 New modules

- **`model/estimate.ts`** (Decision 10) — the generic `EvidentialEstimate`/`EstimateParams`/
  `updateEstimate`/`estimateConfidence` core, relocated (not rewritten) out of `expectation.ts`.
  `expectation.ts` becomes a thin Need-flavored wrapper over it.
- **`model/belief.ts`** — `PredicateId`, `ConditionKey` (canonical conjunction of bound predicates,
  dedup + stable serialization per Brief §11), `OutcomeKey` (Decision 3), `ConditionalPredictionKey`
  (`{condition, outcome, affectedReferent, appraisalReferent}` + canonical string form — Decision 1's
  two-referent correction), `ConditionalPredictionState = {likelihood: BeliefLikelihood, severity:
OutcomeMagnitudeBelief}` (Decision 10's aliases), and the belief-update entry point that wraps
  `estimate.ts::updateEstimate` twice (once for likelihood, once — only on `OutcomeOccurred` evidence —
  for severity, since severity is "expected experienced severity _conditional on the outcome
  occurring_," Brief §14: a `SafeOpportunity` teaches nothing about severity, only about likelihood).
- **`model/predictionOpportunity.ts`** — `PredictionEvidenceKind` (`'OutcomeOccurred' |
'SafeOpportunity' | 'CensoredOpportunity' | 'NoOpportunity'`, Brief §15 — a deliberately richer,
  parallel vocabulary to `expectation.ts`'s existing `EvidenceKind`, not a reuse of it: this classifies
  _whether a test of the prediction happened at all_, where `EvidenceKind` classifies _what a Need's
  realized delta proves given saturation_), `OpportunityId` (a concrete opportunity/episode identity,
  never just `ConditionalPredictionKey`'s canonical string — Decision 11's correction), `OpportunityWindowState`
  and `PredictionOpportunity` types (Decision 11), and
  `advanceOpportunityWindow(openWindows: ReadonlyMap<OpportunityId, OpportunityWindowState>, experience:
SemanticExperience, prediction: ConditionalPredictionDef): { openWindows: ReadonlyMap<OpportunityId,
OpportunityWindowState>; evidence?: readonly PredictionOpportunity[] }` — the stateful,
  multi-window-aware tracking function every `ConditionalPredictionDef` (scenario-authored, mirroring
  `CommitmentDef`) supplies its own sufficiency threshold and max-duration for. Concurrent opportunities
  for the same `ConditionalPredictionKey` are tracked as distinct `OpportunityId` entries and never
  merged. A max-duration timeout always closes as `CensoredOpportunity`, never `SafeOpportunity` — hitting
  the clock is not itself evidence of safety; only sufficiency-met-while-observable closes as
  `SafeOpportunity`. Only `OutcomeOccurred` and `SafeOpportunity` feed a belief update;
  `CensoredOpportunity`/`NoOpportunity` are traced and produce none (Brief §17-18's "non-events must never
  be counted per tick" mandate).
- **`model/conditionExposure.ts`** (Decision 5) — `ConditionExposureProvider` type, the default
  authored-table implementation, and a `lookupExposure(provider, optionKey, conditionKey): Rational`
  convenience wrapper with an explicit `Rational.ZERO` default for an unauthored `(option, condition)`
  pair (never `undefined`-as-zero by accident — an explicit, tested default).
- **`model/threatAppraisal.ts`** — `ThreatAppraisal` type (Brief §20's exact fields, Option-independent
  per Decision 7), the reference formula (`ExpectedHarm = p·s`; `ThreatStrength = ExpectedHarm ·
(1+Vulnerability)/2 · (2-Control)/2`), `AcuteFear = ThreatStrength · Immediacy` (trace-only),
  `deriveVulnerability` (initial version: a deterministic function of the affected Need's current
  deficit — "already-low Security → greater vulnerability to financial loss," Brief §23 — no new
  primitive), `deriveControl` (Brief §24: `max` over available mitigation actions'
  `ExpectedMitigation`, itself an `EvidentialEstimate`-shaped learned efficacy value — reuse, don't
  invent), and `threatAppraisalSignals(appraisal, exposureProvider, options): RawCognitiveSignal[]` —
  the emitter, structurally a near-copy of `commitment.ts::commitmentSignal` except its
  `signedStrength` is `appraisal.threatStrength.mul(lookupExposure(...))` per Option, and its
  `referent` is `prediction.appraisalReferent` (Decision 1), never `affectedReferent`.
- **`model/relief.ts`** — `ThreatLoad = boundedResponse(Σ ThreatStrength_i)` (global, trace-only, Brief
  §30), `Relief = max(0, ThreatLoad_before − ThreatLoad_after)`, `ReliefExpectation` update (reuses
  `estimate.ts::updateEstimate`, Decision 6 — per-target correlation scoping applies here), and
  `reliefSignals(...)` emitter onto avoidance-shaped Options (Options whose `conditionExposure` for the
  relevant condition is low/zero — reuses the same `ConditionExposureProvider`, no separate "which
  Options are avoidance-shaped" table needed).

### 2.2 `CharacterState` / `cycle.ts` integration

New `CharacterState` fields: `beliefs: ReadonlyMap<string, ConditionalPredictionState>`,
`openPredictionOpportunities: ReadonlyMap<OpportunityId, OpportunityWindowState>` (Decision 11 — keyed by
concrete opportunity/episode identity, so concurrent opportunities against the same
`ConditionalPredictionKey` coexist as distinct entries rather than merging),
`reliefExpectations: ReadonlyMap<string, ReliefExpectation>`.

New scenario-authored inputs (mirroring `commitments: readonly CommitmentDef[]`, already a parameter
on `runDecisionCycle`): `predictions: readonly ConditionalPredictionDef[]` (each carrying its own
window-sufficiency/max-duration constants and `OutcomeDefinition` — affected channels, severity prior),
and a `conditionExposure: ConditionExposureProvider`.

Extend the Phase 2.5e canonical path (`RESEARCH.md`'s own diagram) with one new stateful stage between
`SemanticExperience` and the existing Need/Memory/Association fan-out, and one new stage in signal
compilation:

```
SemanticExperience
    |
    +--> [NEW] advanceOpportunityWindow (per active ConditionalPredictionDef, stateful across cycles)
    |         |
    |         +--> window opens / continues            --> no belief update yet, window state persists
    |         +--> closes: OutcomeOccurred/SafeOpportunity --> belief update (likelihood, [severity])
    |         +--> closes: CensoredOpportunity/NoOpportunity --> traced, no update
    |
NeedExpectation / Episodic Memory / Association   (unchanged)
    |
    ...
    |
[signal compilation for the next Decision/cycle]
    |
    +--> needSignals / accessibilitySignal / standingIdentitySignals / situational*Signals / commitmentSignals  (unchanged)
    +--> [NEW] threatAppraisalSignals  — ThreatAppraisal computed once per adverse belief, then
    |         per-Option signedStrength = ThreatStrength × Exposure(option, condition)
    +--> [NEW] reliefSignals           — for avoidance-shaped Options, from ReliefExpectation
    |
groupSignalsByTriple / compileReasonDice / resolveReasonDiceExpressions   (unchanged)
    |
Decision / outcome
    |
    +--> [NEW] Relief computed (ThreatLoad before vs. after), ReliefExpectation updated
    |          (correlation-consolidated only against other ReliefExpectation contributions —
    |           never against the same-Experience threat-belief update, per Decision 6)
```

Everything below the "signal compilation" line is genuinely unchanged — this is the payoff of Phase
2.97's `RawCognitiveSignal` abstraction actually working as designed.

### 2.3 Build sequence

1. **Generic `EvidentialEstimate` refactor (Decision 10).** Relocate the generic core out of
   `expectation.ts` into `estimate.ts`; re-express `NeedExpectation` etc. as aliases/wrappers. Run the
   full existing suite (~330 tests) and confirm byte-for-byte zero behavior change before anything else
   in Phase 3 depends on this module.
2. **Kernel-sufficiency check.** Write `belief.ts`'s types and a trivial hand-built
   `ConditionalPredictionState`, and confirm `estimate.ts::updateEstimate`/`estimateConfidence` work
   against it with no further kernel changes.
3. **PredictionOpportunity windows + belief update, no appraisal yet.** Build
   `predictionOpportunity.ts`, wire the new stateful cycle stage, and validate against a hand-built
   scenario with no Decision involved — the acceptance bar is now explicit per Decision 11: confirm a
   `SafeOpportunity` is only ever produced from a window that actually opened and met its sufficiency
   threshold _while the condition remained observable_ before closing (never from "no bad event occurred
   this tick," and never merely from hitting the max-duration timeout — a timeout always closes as
   `CensoredOpportunity`, at any accumulated exposure), and confirm immediate escape before sufficiency
   always closes as `CensoredOpportunity`. Add two more named regression tests here: two concurrent
   opportunities against the same `ConditionalPredictionKey` (e.g. two distinct encounters with `DogA`)
   must be tracked and closed independently, never merged into one window or one evidence event; and a
   timeout-at-high-accumulated-exposure case must still close as `CensoredOpportunity`, not
   `SafeOpportunity`. Add the "SafeOpportunity never touches severity" regression test here (§7) from day
   one.
4. **ThreatAppraisal + ConditionExposureProvider + signal emission, minimal scenario.** Build
   `threatAppraisal.ts` and `conditionExposure.ts`, wire `threatAppraisalSignals` into signal
   compilation. First experiment: **A1 (direct acquisition)** — the smallest end-to-end slice (belief →
   appraisal → exposure-weighted signal → nucleus → dice). Acceptance check specific to this revision:
   confirm the resulting nucleus is `Safety × DogA` (appraisalReferent), never `Safety × Self`
   (affectedReferent) — a named regression test, not just an eyeballed trace.
5. **A2 (persistence), A9 (probability vs. severity), A10 (control), A11 (vulnerability), A3
   (extinction).** These exercise the belief math and the appraisal formula's components in relative
   isolation — no avoidance/relief interaction yet. A9/A10 are also where `ConditionExposureProvider`'s
   authored-table expressiveness gets its first real stress test (§7).
6. **Relief separation.** Build `relief.ts`, wire the post-outcome Relief computation and
   `ReliefExpectation` update. Run **A4 (avoidance-maintained fear)** and **A5 (relief separation)**
   together — Brief §88's own Fear-Learning Trace Requirement is the acceptance criterion: the trace
   must show `CensoredOpportunity` (not a false `SafeOpportunity`) for an immediate-escape episode, no
   threat-belief movement, and a `ReliefExpectation` update, in the same run. Add the explicit
   dual-target regression test from Decision 6's correction: a single Experience that legitimately
   supports both a threat-belief update and a relief update must show _both_ updates at full,
   uncorrelated strength — neither discounted because of the other.
7. **A6 (false fear), A12 (act despite fear), A13 (bravery evidence), A14 (prediction opportunity —
   escape vs. sustained exposure).** These stress-test the world-truth/belief separation and the
   "fear generates a motive, not a command" boundary (Brief §27-28) — A12/A13 specifically need a
   contested Decision where a competing motive wins despite real ThreatStrength, which is exactly what
   `resolveDecisionCore`'s existing Contest/Margin machinery is for; no new resolution logic required.
8. **A7 (generalization) — sharpened bar (Decision 8).** Attempt via the existing association graph
   first, but the pass condition is now strict: `DogB`'s own belief/appraisal state must show a real,
   traceable shift attributable to `DogA`'s attack, not merely incidental avoidance-action accessibility.
   Classify `DERIVED` only if that direct evidence exists; otherwise `REQUIRES GENERALIZATION MECHANISM`
   and build `model/generalization.ts` (`ConceptRelation`/`InstanceOf`, Brief §33-34).
9. **A8 (cue conditioning).** Same "try existing machinery first" discipline as A7 (Brief §35).
10. **Anxiety probe (§38).** Only after A1-A14 are closed — classify DERIVED / REQUIRES MECHANISM /
    DEFERRED for worry-like repeated accessibility, checking, reassurance seeking, preparation, risk
    avoidance, without introducing an `Anxiety` primitive up front.
11. **Phase 3A gate (§39)** — score against all 15 listed items, write the research-log entry in this
    project's standard three-part-output format, decide whether opt-in-by-default staging is warranted
    for this sub-phase's new mechanisms (see §5 below) before moving to 3B.

---

## 3. Phase 3B — Social Belief & Appraisal

### 3.1 New modules

**`model/observation.ts`** (Decision 12) — `ObservationGrant` type: a deterministic, observer-specific
record of which fields of a given Experience/`WorldEventDescriptor` were actually observable to a given
observer (authored/derived by the scenario/world layer — e.g. "was the observer co-located and
attending during this window," itself potentially reusing Phase 2.5b/c's existing perception-gate
concepts extended to a second character rather than only the actor). A function that takes an
`ObservationGrant` and the actor's own `SemanticExperience` and produces an **observer-relative** visible
slice — only the granted fields survive; nothing else does. Deliberately does **not** introduce a
separate authored "how vividly did the observer perceive this" fidelity table: once a field is visible
at all, the _existing_ attention/salience machinery (unchanged) determines how much psychological
weight the observer's perception of it carries. Visibility is the hard 0/1-ish gate (an `ObservationGrant`
can still be graded per field — e.g. partial visibility of a scene — using the same `[0,1]` exact-rational
convention `conditionExposure.ts` uses, for consistency); salience is the existing continuous weighting
mechanism layered on top of whatever visibility permits. **Per review: the `[0,1]` grading is information
availability/fidelity only, never a stand-in for psychological importance — that distinction is the whole
point of keeping this a separate module from salience.** Authoring discipline for B1 onward: use only `0`
and `1` for every `ObservationGrant` field by default; reach for an intermediate value only when a
specific experiment is deliberately testing partial observability.

**`model/socialEvidence.ts`** — `ObservedSocialEvidence` type (Brief §42's exact fields), constructed
**only** from an observer-relative visible slice (never directly from the actor's own full
`SemanticExperience`). `observedIntent` is populated only when an explicit communication/observable-signal
channel marks intent as communicated for this Experience — this needs its own small scoping decision at
build time (a new authored field on the relevant `ActionDef`s, or a dedicated
`CommunicationEvent`-shaped concept) but the invariant from Decision 12 is fixed regardless of that
choice: no "legitimately inferable" heuristic, ever. Absent explicit communication, an observer's belief
about another character's likely future action is formed the ordinary way — through
`ConditionalPrediction` updates driven by observed action/outcome (reusing 3A's belief machinery
directly), never a privileged read of `DecisionExpression.chosenIntent`.

No new belief-storage type beyond these: Brief §43's "this reuse is an explicit Phase-3 hypothesis" is
the build instruction, not just commentary — social predictions (`"Glen keeps commitments"`, `"if I
disagree with Darius, he may become hostile"`) are `ConditionalPredictionKey`s in the _observer's own_
`beliefs` map from §2, with `affectedReferent`/`appraisalReferent` set per Decision 1 (for social
predictions the two will often coincide — e.g. `affectedReferent = Self, appraisalReferent = Darius` for
"if I disagree with Darius, he may become hostile," which threatens the observer but is appraised
relative to Darius — but they remain two distinct fields, never collapsed into one). `SocialDispositionBelief`
(Brief §48) is explicitly conditional on §43's family of predictions proving insufficient first — do
not build it up front.

Trust/suspicion/embarrassment are **reporting functions over the existing belief store**, not new
state: a `trustLikeQuery(observer, subject)` that inspects the relevant family of positive
predictions about `subject` (Brief §44), a `suspicionQuery` that checks whether uncertain-negative and
positive predictions about the same subject coexist without collapsing (Brief §45), and an
`embarrassmentVsAnxietyClassification` that uses _timing_ (anticipatory belief update vs.
observed/retrospective belief update, Brief §47) rather than a new primitive.

### 3.2 Build sequence

1. **`ObservationGrant` + observer-relative slicing, then B1/B2 (observed vs. unobserved
   reliability).** Build `observation.ts` first — this is now the actual smallest slice, and it
   strengthens B2 into a hard invariant test: zero `ObservationGrant` for a given Experience must
   produce zero `ObservedSocialEvidence`, which must produce zero belief movement for the observer, by
   construction (never merely by omission).
2. **B3/B4 (misleading evidence, correction).** Reuses 3A's false-fear machinery (A6) directly —
   same "world truth must not leak into belief" boundary, now for a _third party's_ truth rather
   than the world's.
3. **B5 (correlated evidence).** Reuses `kernel/evidenceOverlap.ts::consolidateCorrelated` directly —
   this should require zero new code once `ObservedSocialEvidence`'s own basis-tagging mirrors
   `situationalMemorySignals`'s existing `{[experienceId]: 1}` pattern, and stays scoped per learned
   target exactly as Decision 6 requires generally.
4. **B6/B7 (trust-like behavior, suspicion).** Build the reporting functions above; verify they
   change Decisions materially (B6) and can coexist without collapsing to one scalar (B7).
5. **B8/B9 (social evaluation threat, embarrassment timing).** Reuses 3A's `threatAppraisal.ts`
   wholesale — `NegativeSocialEvaluation(evaluator, target=Self)` is just another `OutcomeKey` mapped
   to `Recognition`/`Connection`/`Status`-equivalent channels (Decision 4), with `affectedReferent=Self`,
   `appraisalReferent=evaluator`. No new appraisal math.
6. **B10/B11/B12 (private-state isolation, multiplicity, referent specificity).** These are
   effectively invariant checks on the belief-store design from §2/§3.1 rather than new mechanisms —
   verify by construction (an observer's `beliefs` map never reads another character's `CharacterState`
   at all) plus targeted tests, the same way Phase 2.97's Experiment C verified referent independence.
7. **Phase 3B gate (§55)** — score against all 12 items, research-log entry.

---

## 4. Phase 3C — Constitutional Personality Modulation

### 4.1 New module

**`model/constitution.ts`** — `PersonalityDimension` (`'Warmth' | 'Agency' | 'Stability' | 'Sociability'
| 'Openness' | 'Discipline' | 'Attunement'`, fixed `DIMENSION_ORDER` mirroring `identity.ts::CHANNEL_ORDER`'s
discipline exactly), `Personality = Vec` (dense length-7, `p_i ∈ [-1,1]`, immutable on
`CharacterState`), `ConstitutionalProjectionDef` (`{b, w, Q}` — literally `IdentityTrait`'s shape,
reused via `kernel/linalg.ts::quadraticForm` + `Rational.boundedResponse`, per §0's noted parallel),
`projectConstitutional(def, P): Rational`, and `constitutionalStandingSignals(...)` — the
`StandingDisposition` emitter, structurally a near-copy of `identity.ts::standingIdentitySignals`
except reading a fixed `P` through a `ConstitutionalProjectionMotiveChannelMapping` table instead of
accumulated `IdentityEvidenceState`.

`threatAppraisal.ts` gains two optional, explicitly-justified hooks (Brief §61-63): a
personality-derived bias term on `deriveVulnerability`/`deriveControl` (Model A/B/C from §61 — start
with _no_ bias term at all, i.e. Model "personality affects appraisal only through the standing-signal
channel, never by silently reweighting the appraisal formula's own inputs," and only add a direct
formula hook if C1-C12 demonstrate appraisal-only is insufficient). This keeps Brief §65's "personality
cannot manufacture evidence" wall structurally enforced by default rather than by discipline alone.
Since Decision 7 already made `ThreatAppraisal` Option-independent, any such hook stays
Option-independent too — consistent with the rest of Phase 3A's design, not a special case for 3C.

### 4.2 Build sequence

1. **C1 (deterministic latent P).** Trivial: confirm identical `P` produces identical projected
   values via `projectConstitutional`, no `CharacterState` beyond the new field.
2. **C6 (standing modifier), C7 (no identity shortcut).** Wire `constitutionalStandingSignals` into
   signal compilation; verify (mirroring Phase 2.97's own Experiment H) that a high projection alone
   never creates a nucleus with zero `MotiveGenerating` base, and separately that no code path lets a
   high `P` dimension write directly into `IdentityEvidenceState` (Brief §67's "no shortcut" — an
   architectural invariant to grep for, not just test for).
3. **C3/C4/C5 (ThreatSensitivity / UncertaintyTolerance / SocialEvaluationSensitivity candidates).**
   Each is a `ConstitutionalProjectionDef` instance (Model A: Stability alone; Model B: Stability +
   Agency [+ Openness/Attunement as relevant]; Model C: an independent primitive) compared via
   controlled fear/social experiments already built in 3A/3B — reuse those experiment harnesses with
   `P` varied, don't build new ones.
4. **C2/C11 (same belief, different appraisal / same evidence, different people).** The flagship
   comparison: two characters, identical `beliefs` map, different `P`, same Decision — verify belief
   state is byte-identical while appraisal/dice/probability differ, traceable to `P`. Direct structural
   analogue of Phase 2.9's Experiment F (seed divergence) and Phase 2.97's own re-run discipline —
   build this as a paired-counterfactual harness the same shape as `experiments/seedDivergence.ts`.
5. **C9/C10 (personality is not destiny / seed divergence survives).** Confirm stochastic Decision
   resolution and identity/biography divergence are unaffected by `P`'s presence — regression check
   against Phase 2.9/2.95/2.97's own experiments with `P` populated but not dominant.
6. **C8 (constitution/identity coexistence), C12 (learning-bias ablation).** C12 specifically requires
   proving a personality-biased _learning_ variant (if attempted at all) explains something
   appraisal-only cannot, per Brief §64's explicit "do not assume both" caution — default to _not_
   building a learning-bias variant unless C1-C11 leave a real, demonstrated gap.
7. **Phase 3C gate (§74), Final Phase Gate (§95)** — score against all items; write the closing
   research-log entry answering all ten of Brief §94's Core Research Questions and classifying every
   item in §91 (Predictive Belief, Fear, Avoidance Reinforcement, Fear Extinction, Threat
   Generalization, Anxiety-Like Behavior, Trust, Social Evaluation/Embarrassment, Threat Sensitivity,
   Uncertainty Tolerance).

---

## 5. Regression & re-baseline discipline

Follow the pattern this project already uses twice (Phase 2.5e, and the post-closure-audit re-baseline
at the end of the Phase 2.97 entry): build every new Phase 3 mechanism as **opt-in, default-legacy**
first (a `beliefMode`/`threatMode`-style flag on `CycleParams`/`DecisionParams`, defaulting to "off, no
behavior change"), validate it fully against its own experiment suite, and only _then_ re-baseline the
default once the sub-phase's gate is met — never conflate "keep it opt-in during active investigation"
with "keep the old thing default forever." Concretely:

- The Decision 10 `EvidentialEstimate` relocation is the one Phase 3 change that touches _existing_
  code paths directly (`expectation.ts`). It is not itself opt-in — it must be proven behavior-neutral
  (full suite green, byte-for-byte) before any Phase 3 module is allowed to depend on it, since every
  subsequent Phase 3 module imports from it.
- Every pre-Phase-3 test (all ~330 across Phase 0-2.97) must continue passing unchanged with Phase 3's
  new params left at their off/legacy defaults throughout 3A/3B/3C development.
- At each sub-phase's gate, re-run the full existing suite once the new default is flipped, exactly as
  the Phase 2.97 re-baseline did (expect the same shape of "missing mapping table" class of failure in
  older experiment files that never learned to pass Phase 3's new required params — fix by pinning
  those files to an explicit `legacy*Params()` helper, not by leaving the flip half-done).
- Do not attempt one combined "Phase 3 re-baseline" at the very end — re-baseline 3A's own new defaults
  before starting 3B's build, and 3B's before 3C's, so each sub-phase's regression surface stays small
  and attributable, matching how Phase 2.5e closed before Phase 2.9 began rather than deferring
  consolidation to the end of Phase 2.97.

---

## 6. Suggested execution order (single list, for scheduling)

1. Generic `EvidentialEstimate` refactor (Decision 10) — full suite green before anything else starts.
2. Kernel-sufficiency check against `belief.ts`'s trivial types (§2.3 step 2).
3. `belief.ts` + `predictionOpportunity.ts` (stateful opportunity windows), validated stand-alone
   (§2.3 step 3).
4. `threatAppraisal.ts` + `conditionExposure.ts`, Experiment A1 end-to-end, referent-correctness check
   (§2.3 step 4).
5. A2, A9, A10, A11, A3 (§2.3 step 5).
6. `relief.ts`, A4, A5, dual-target correlation regression test, Fear-Learning Trace Requirement as
   acceptance criterion (§2.3 step 6).
7. A6, A12, A13, A14 (§2.3 step 7).
8. A7 (sharpened bar), A8 (§2.3 steps 8-9).
9. Anxiety probe, Phase 3A gate, research-log entry, re-baseline 3A's defaults (§2.3 steps 10-11, §5).
10. `observation.ts` (ObservationGrant + observer-relative slicing), `socialEvidence.ts`, B1/B2
    (§3.2 step 1).
11. B3/B4, B5 (§3.2 steps 2-3).
12. Trust/suspicion reporting functions, B6/B7 (§3.2 step 4).
13. B8/B9 via 3A's reused threat-appraisal machinery (§3.2 step 5).
14. B10-B12 invariant checks, Phase 3B gate, research-log entry, re-baseline 3B's defaults (§3.2 steps
    6-7, §5).
15. `constitution.ts`, C1, C6, C7 (§4.2 steps 1-2).
16. C3/C4/C5 candidate-primitive experiments reusing 3A/3B harnesses (§4.2 step 3).
17. C2/C11 flagship paired-counterfactual, C9/C10 regression checks (§4.2 steps 4-5).
18. C8, C12 (§4.2 step 6).
19. Phase 3C gate, Final Phase Gate, closing research-log entry answering Brief §94, re-baseline (§4.2
    step 7, §5).

---

## 7. Open risks worth naming now rather than discovering mid-build

- **`ConditionExposureProvider`'s authored values, not its shape, are the residual unknown.** The
  shape is now resolved (Decision 5: exact `[0,1]`, option-independent appraisal, no avoidance bonus).
  What's still open is whether binary-ish authored exposure (mostly 0s and 1s per scenario) is
  expressive enough, or whether real scenarios need genuinely graded values from the start — budget
  real exploration time at A9/A10 specifically.
- **`ObservationGrant`'s concrete authoring mechanism is the largest remaining unknown.** The design is
  now fixed (Decision 12: deterministic, observer-specific, visibility as a hard gate distinct from
  salience-driven weighting), but no existing code does cross-character observation at all — Phase
  2.5b/c's perception machinery is entirely self-observation. Expect this to be genuinely new
  territory, not a reuse.
- **`openPredictionOpportunities` needs an explicit disposal rule, and the timeout must never leak into
  `SafeOpportunity`.** A condition that becomes permanently unobservable without ever formally closing
  must not accumulate open windows forever — build the authored max-window-duration timeout (Decision 11)
  into `predictionOpportunity.ts` from the start, with its own test confirming a timeout always closes as
  `CensoredOpportunity` regardless of accumulated exposure, rather than discovering the leak (or a
  timeout-as-safety misclassification) later.
- **Concurrent opportunities against the same `ConditionalPredictionKey` must not merge.** Keying
  `openPredictionOpportunities` by a concrete `OpportunityId` (Decision 11's correction) rather than the
  prediction key itself is the whole fix, but it's easy to accidentally regress this by reusing the
  prediction key as a map key somewhere convenient during implementation — worth a named test with two
  overlapping encounters of the same condition from day one.
- **Severity belief's evidence rule needs care.** `OutcomeMagnitudeBelief` only updates on
  `OutcomeOccurred` (Brief §14); confirm `predictionOpportunity.ts`'s classifier never accidentally
  feeds a `SafeOpportunity` into the severity update path — named regression test from day one (§2.3
  step 3).
- **The `EvidentialEstimate` relocation (Decision 10) is a refactor of widely-imported existing code.**
  Treat it with the same care as any cross-cutting rename in a codebase with ~330 existing tests: do it
  mechanically, verify with the full suite, and do not combine it with any behavior change in the same
  step.
- **Dual-target correlation discounting (Decision 6) is easy to get subtly wrong in the other
  direction** — under-scoping (correlating across targets, wrongly suppressing legitimate independent
  learning) is the bug review caught; over-correcting into _never_ consolidating even genuine
  same-target multi-source evidence would reintroduce the double-counting risk `EvidenceBasis` exists to
  prevent. Both directions need their own named test (§2.3 step 6's dual-target test, plus an ordinary
  same-target multi-source test analogous to Phase 2.97's own Experiment D/E).

---

## Changelog

**Revision 3 (this document):** two small locked-in clarifications from final review. (1)
`ObservationGrant`'s `[0,1]` grading (Decision 12, §3.1) is information availability/fidelity only, never
psychological importance — attention/salience remains the sole psychological-weighting layer — and Phase
3B's first experiments (B1 onward) author only `0`/`1` by default, reaching for an intermediate value
only when a specific experiment deliberately tests partial observability. (2) `openPredictionOpportunities`
(Decision 11, §2.1/§2.2) is keyed by a concrete `OpportunityId` (opportunity/episode identity), not by
`ConditionalPredictionKey` alone, so concurrent opportunities against the same condition (e.g. two
separate dog encounters) never merge; and the authored max-duration timeout is a closing mechanism only —
it always closes as `CensoredOpportunity` regardless of accumulated exposure, never `SafeOpportunity`,
which may only result from sufficiency met while the condition remained observable. New regression tests
named in §2.3 step 3 and §7 for both.

**Revision 2:** incorporated review corrections — `ConditionExposureProvider`
replacing the `±1` polarity table (Decision 5), the `ObservationGrant` visibility-gate design for Phase
3B (Decision 12), the affected/appraisal referent split on `ConditionalPredictionKey` (Decision 1), the
sharpened Experiment A7 generalization bar (Decision 8), per-target correlation-discounting scoping for
relief vs. belief updates (Decision 6), the generic `EvidentialEstimate` type with semantic aliases
(Decision 10), and stateful `PredictionOpportunity` window tracking replacing per-tick inference
(Decision 11). All downstream sections (§2-§7) updated to match.

**Revision 1:** initial draft, approved directionally pending the corrections folded into Revision 2.
