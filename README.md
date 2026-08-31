# CharacterLab

A standalone, deterministic reference implementation of the cognitive model described in
*CharacterLab — Deterministic Cognitive Reference Model Brief*. This is a **research tool**, not a
game and not a Vivarium prototype: its job is to make the brief's mathematics runnable,
inspectable, and falsifiable, so findings from it can inform (but not dictate) Vivarium's
production architecture.

This build covers **Phase 0 (Mathematical Kernel)**, **Phase 1 (Need-Satisfaction Learning)**,
**Phase 2 (Associative Accessibility & Episodic Memory)**, **Phase 2.5 (Experience Encoding,
Semantic Salience, and Saturated Satisfaction) — CLOSED**, in six sub-phases: **2.5a (Saturated
Satisfaction & Censored Learning — RESOLVED)**, **2.5b (Semantic Salience — PARTIAL, corrected by
2.5c)**, **2.5c (Experience Interpretation)**, **2.5d (Saturation/Salience Interaction — RESOLVED,
DERIVED)**, **2.5e (Architecture Consolidation & Behavioral Re-baseline — RESOLVED)**, and now
**Phase 2.9 (Decision Authorship, Acquired Identity, and the Role of Dice — RESOLVED)** — plus an
interactive SPA for running experiments against them. Phase 2.5c is a small integration phase: it
makes causal role (`EffectProvenance`/`deriveWorldEventDescriptor`), attention (residual-pool
derivation), and surprise (evidence-kind-aware `SurpriseEvidence`) fully mechanical, closing the three
hand-authored-input gaps 2.5b's own review found in an otherwise-validated multiplicative core, and
then resolves Phase 2.5a's own long-open question ("Correction 2" in RESEARCH.md): `(μ, τ)` is
sufficient for the censored-evidence behaviors tested so far — the bug was in `updateExpectation`'s
informativeness gate, not the representation — though the accepted-bound branch still credits an
informative inequality with a full point observation's precision, a documented approximation left
alone per "don't generalize until an experiment demands it." Fixing the gate raises the required Brief
§22 counterfactual's divergence reduction from ~17% to ~48%. Phase 2.5d then closes the phase's last
open question — whether saturation needs to influence salience directly — by running four targeted
cases through the real cycle and finding no: hidden Overflow never changes salience once perceived
Applied and evidence kind are held fixed, classified **DERIVED**, with `Overflow ↛ Salience` /
`Overflow ↛ NeedExpectation` now locked in as standing prohibitions for later phases. Phase 2.5e then
re-baselines the whole project onto one canonical execution path: `defaultCycleParams()` now runs
censored learning and derived salience by default (the superseded naive/flat-weight behavior is
retired to explicitly-named `legacySaturationParams()`/`legacyCycleParams()` control conditions, not
deleted), every historical finding was re-run against that single path (6 of 8 SURVIVE unchanged, 2 —
Habit and Avoidance's floor-boundary extension — are REFINED, zero RETRACTED outright), and
`SemanticExperience` (`model/semanticExperience.ts`, new) formalizes the character-relative record
Phase 3 should consume, with Overflow deliberately excluded from it by design. See RESEARCH.md's Phase
2.5a Correction 2, Phase 2.5b Correction, Phase 2.5c entry, Phase 2.5d entry, and Phase 2.5e entry for
the full account. Phase 2.9 then adds a genuinely new construct on top of that consolidated
foundation, motivated by a gameplay loop discovered ahead of Vivarium's own use of this model: a
`Decision` (`model/decision.ts`, new) — a small, explicitly-authored set of Options, each backed by
dice calibrated from existing Need/accessibility/identity pressures — with an exact pre-roll
probability calculus (Margin, Contest, Stake, AuthorshipPotential) telling us how unresolved and how
meaningful a Decision is *before* any die is thrown, and a biographical-evidence loop
(`model/identity.ts`, new) by which repeated meaningful choices — never an authored trait assignment —
consolidate into durable acquired identity, which then feeds back as one more (never dictating)
pressure on future Decisions. `runDecisionCycle` (`model/cycle.ts`) is a new, parallel entry point to
ordinary autonomous cycles, sharing their existing outcome/learning/memory/association tail rather
than replacing any of it. All eleven of the brief's required lettered experiments (A–K) run against
real output; the most notable finding is a proven mathematical impossibility (identity cannot rescue
an Option raw Need pressure has already ruled out) rather than a tuning limitation — see RESEARCH.md's
Phase 2.9 entry for the full account, including the `winProbabilities` fair-tie-share proof, the
die-ratio/consolidation-ceiling finding, self-stabilization and its contradiction-resisting mirror
image, and the seed-divergence flagship demonstration. **Phase 2.95 (Reason Consolidation & Identity
Fault Lines — RESOLVED)** then corrects two of Phase 2.9's own findings after an external review
identified their real cause: identity's contribution was assembled into its own separately-floored
Influence, so it could never combine with an already-present but individually sub-floor Need signal on
the same topic to jointly clear `thetaInfluenceFloor` — Phase 2.9's own Experiment I write-up had
already, unknowingly, proven this "all-or-nothing" behavior mathematically. `model/decision.ts`'s new
`sumRawBySemanticChannel`/`boundAndFloorChannels`/`boundAllChannels` and `model/identity.ts`'s new
`identityFeedbackRawInfluences` fold identity's raw per-channel pull into the SAME consolidation pool
as Need/accessibility, bound-and-floored together exactly once, while a separate, non-floor-filtered
map preserves Brief §23's no-double-counting rule for identity's own evidence generation. All five of
the review's required target behaviors (A–E) — gradual influence, weak-signal combination, a real
(narrowing, not cancelling or flipping) identity fault line, transformation under sustained
contradiction with feedback active, and canonical trait acquisition with feedback on from zero — now
run against real output; see RESEARCH.md's Phase 2.95 entry for the fix's architecture, every target's
real numbers, and the honest scoping of what a five-band discrete die scale still cannot make perfectly
continuous. Phases 3–6 (personality/belief/
social appraisal, derived Values, acquired Needs/addiction, and distillation) are intentionally not
built yet — see [RESEARCH.md](./RESEARCH.md) for the phase-gate review and what specifically
motivates Phase 3.

## Why this architecture

- **TypeScript, single language, fully client-side.** The kernel, the model, the experiments, and
  the UI are all TypeScript, running entirely in the browser with no backend. That keeps the
  "read the trace, change a slider, re-run, read the trace again" research loop as fast as
  possible, and it means the whole thing runs from a static file server or `npm run dev` — no
  services to stand up.
- **Exact arithmetic, not floats.** Brief §3.1 forbids "unspecified floating-point behavior" in
  anything authoritative. `kernel/rational.ts` implements exact rationals over `BigInt`; every
  authoritative calculation (Need levels, expectations, scores, probabilities) is exact rational
  arithmetic until it is deliberately quantized onto the versioned lattice (`kernel/lattice.ts`,
  Brief §5.2) at an explicit, named step. There is no `Math.random()`, no wall-clock read, and no
  reliance on object/Map iteration order anywhere in `kernel/` or `model/`.
- **Deterministic replay is a first-class, testable claim**, not an aspiration. The random oracle
  (`kernel/random.ts`) is a pure function of `(seed, eventId, purposeId, drawIndex)` — Brief §7 —
  with no mutable global RNG stream. `src/test/determinism.test.ts` runs the same cycle twice from
  identical inputs and asserts the full causal-trace hashes match; the UI's "Verify determinism"
  button (`DeterminismPanel`) does the same check live, side-effect-free, against whatever state
  you've gotten Mina into.
- **The causal trace is not debug logging.** Brief §30 calls trace generation "a product
  requirement." Every cycle (`model/cycle.ts`) builds a `CognitiveCycleTrace`
  (`kernel/trace.ts`) recording every intermediate value — Need urgency, per-Need contribution to
  Score, choice weights, the probability distribution, the random draw, the realized outcome, the
  expectation update, spreading activation, accessibility filtering, memory retrieval, association
  updates — and the UI's trace log renders it, expandable, for every single button press.
- **Exact linear algebra, not numerical approximation, for spreading activation.** Phase 2's
  `a = (I - βW)⁻¹b` (§16) is solved by Gaussian elimination over the same auto-reduced `Rational`
  type everything else uses (`kernel/linalg.ts`) — a fixed pivot rule, a typed `SingularMatrixError`
  naming the failing column if one ever occurs, and a documented (and tested) proof that it never
  will in practice, since `(I - βW)` is strictly diagonally dominant whenever `W` is
  row-substochastic and `β < 1`.

## Project layout

```
src/
  kernel/        Phase 0 — math primitives with no model-specific knowledge
    rational.ts    exact BigInt rationals (§5.1)
    lattice.ts      versioned quantization lattice Q_D, RoundEven (§5.2)
    hash.ts         deterministic 64-bit hash (FNV-1a + SplitMix64 avalanche)
    random.ts       counter-addressed random oracle (§7)
    canonical.ts    ConceptKey/CanonicalActionKey/NeedId + canonical ordering (§6, §13)
    event.ts        EventId/EventClock — logical ticks, never wall time (§6)
    trace.ts        TraceBuilder / CognitiveCycleTrace / traceHash (§30)
    stateHash.ts    canonical JSON stringify + hash, used for trace/state fingerprints
    linalg.ts       [Phase 2] exact Gaussian elimination, fixed pivot rule (§16, §32);
                    [Phase 2.9] dot/quadraticForm — small compositions reused by identity.ts's trait
                    projection, and reusable verbatim by Phase 3's latent-personality projection
    discreteDistribution.ts [Phase 2.9] exact integer-support rational-PMF primitive: uniformDie/
                    pointMass/convolve/convolveAll, CdfTable, expectedValue/totalProbability, and
                    winProbabilities — exact fair-tie-share pre-roll win probabilities for K
                    independent RollScore distributions, validated against brute-force enumeration
    evidenceOverlap.ts [Phase 2.97, new] EvidenceBasis + overlap (Σmin/Σmax provenance-overlap
                    ratio) + the Reference Correlation Consolidator, consolidateCorrelated —
                    canonical-order sequential correlation discount (Brief §55-56); pure math, imports
                    only rational.ts; [Phase 2.97 closure audit, Check 2] consolidateCorrelated now
                    discounts each contribution against aggregateEvidenceBasis (new, exported) — the
                    per-EvidenceId union-max coverage of every EARLIER contribution in canonical order —
                    instead of the max overlap against any single earlier contribution; fixes a real
                    collective-redundancy miss (bases {1},{2},{1,2}: the third was previously granted
                    ~half weight it should not have had) an architectural review surfaced; unchanged for
                    every two-contribution case (D/E/F)

  model/         Phase 1 + Phase 2 + Phase 2.5a-e + Phase 2.9 — the character
    types.ts        shared semantic vocabulary (Concept, ConceptCategory) (§13)
    needs.ts        Need, Level/Deficit/Urgency (§10); [Phase 2.5a] applyBoundedEffect — the
                    Capacity/Applied/Overflow decomposition (§16, §27)
    experience.ts   Experience record, actualNeedResult (§11)
    expectation.ts  NeedExpectation: precision-weighted belief update, confidence (§12);
                    [Phase 2.5a] EvidenceKind + the one-sided censored-evidence update rule (§19, §27);
                    [Phase 2.5a Correction 2] tau now grows only on genuinely INFORMATIVE censored
                    evidence (naive candidate strictly beyond current mu) — an uninformative bound
                    (including one landing exactly on the current mu) freezes tau at its decayed
                    tau-minus instead of always growing it, fixing the bug that let repeated
                    non-discriminating bounds manufacture false confidence
    actions.ts      Action definition + evaluation (Need term only) + [Phase 2] accessibility-
                    filtered candidate generation (§22–23); [Phase 2.5c] ActionDef.subjectRole — a
                    semantic fact about the Action's own verb-argument structure (Conversation-like
                    → Participant, Attack-like → Cause), read by cycle.ts to build EffectProvenance
    choice.ts       bounded choice weight, probability distribution, deterministic selection (§24)
    outcome.ts      world outcome resolution with seeded, addressed noise
    character.ts    CharacterState (§8: N_t, E_t, [Phase 2] W_t, M_t); [Phase 2.9] identityEvidence
                    (ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>, defaulting absent
                    channels to zero support/opposition) and decisionHistory (readonly
                    DecisionExpression[], unbounded — full inspectability, per Brief §36)
    cycle.ts        the cognitive-cycle orchestrator (§25), autonomous + scripted + idle variants;
                    doc comment tracks exactly which of the 20 steps run vs. are skipped, per phase;
                    [Phase 2.5a] SaturationParams, saturation_analysis trace step, trace-only
                    Experienced-Reward; [Phase 2.5b] salienceMode/SalienceParams,
                    semantic_salience trace step, derived experienceActivation replacing the flat 1.0;
                    [Phase 2.5c] builds each Experience's EffectProvenance from ActionDef.subjectRole
                    instead of a hardcoded subject→Target default; classifies an objective
                    EvidenceKind unconditionally (independent of SaturationParams.learningMode) and
                    feeds it to salience's surprise, closing the 2.5a/2.5b evidence-semantics gap;
                    [Phase 2.5e] CycleResult.semanticExperience — packages the same per-Experience data
                    as a formalized SemanticExperience (model/semanticExperience.ts) whenever
                    salienceMode is 'derived', alongside the existing semanticSalience/saturationAnalysis
                    fields (kept for research/UI granularity and the world-truth ledger, respectively);
                    [Phase 2.9] `applyChosenAction` is now exported (the one visibility change on
                    existing code this phase needed); new `runDecisionCycle` — a sibling entry point to
                    `runAutonomousCycle`/`runScriptedExperience` for an explicitly-authored Decision,
                    sharing the same exported tail once a winning Option resolves; assembles per-Option
                    DecisionInfluences from Need urgency/accessibility/(when enabled) identity
                    consistency, hands off to decision.ts for resolution, then folds the resulting
                    DecisionExpression's IdentityExpressions into `state.identityEvidence` and appends
                    it to `state.decisionHistory`; [Phase 2.95] `runDecisionCycle` rewritten around a
                    two-map separation fixing the review's floor-rescue finding: a Need/accessibility-
                    only bounded (not floor-filtered) map per option is built first and used
                    EXCLUSIVELY for identity's own expression/evidence generation (no double-counting,
                    Brief §23); separately, each option's raw Need/accessibility pool is merged with
                    identity's raw per-channel pull (via `identity.ts::identityFeedbackRawInfluences`,
                    when enabled) into ONE pool, bound-and-floored exactly once via
                    `decision.ts::sumRawBySemanticChannel`/`boundAndFloorChannels` — this is what
                    actually becomes the DecisionInfluence[] driving dice/resolution;
                    [Phase 2.97] `runDecisionCycle` gained two new trailing optional params
                    (`needMotiveChannelMapping`, `identityMotiveChannelMapping`) and a branch on
                    `params.decision.compilationMode`: under `'legacy'` (default) it is byte-identical
                    to Phase 2.95's own path; under `'reasonNuclei'` it instead builds
                    `RawCognitiveSignal[]` per option (`cognitiveSignals.ts`), compiles them
                    (`diceCompiler.ts::compileReasonDice`), and resolves via
                    `decision.ts::resolveReasonDiceExpressions` — identity evidence generation
                    (Alignment/touchedChannels) is unchanged and unconditional on compilationMode, per
                    plan scoping decision 9. `CycleResult.reasonNucleusTrace` is non-null only in
                    `'reasonNuclei'` mode, mirroring how `semanticSalience` is non-null only in
                    `'derived'` salienceMode
    reasonNucleus.ts [Phase 2.97, new] the Brief's own controlled vocabulary — MotiveChannel (11
                    entries: the brief's 10 plus 'Habit', justified in-file as
                    REASON_CHANNEL_ACCESSIBILITY's existing associative-accessibility contributor),
                    ReferentKey (= ConceptKey | 'Self' | 'None', reusing existing concept identity, no
                    new namespace), MotiveDirection ('Pursue' | 'Avoid' only — derived from signed
                    contribution, never authored), SourceRole; ReasonNucleusKey +
                    nucleusKeyOf/groupSignalsByNucleus (the Central Consolidation Rule, exact
                    (Option, MotiveChannel, Referent) key match) + compareNucleusKeys (canonical
                    ordering); dominantReferent — the general continuous/threshold attribution case
                    (Brief §27-29), implemented and unit-tested against synthetic input but unused by
                    any real signal source this phase (every current source produces exact
                    attribution by construction — see scoping decision 5)
    cognitiveSignals.ts [Phase 2.97, new] the glue between existing state and reasonNucleus.ts's pure
                    grouping math: NEED_TO_MOTIVE_CHANNEL-driven needSignals/accessibilitySignal
                    (MotiveGenerating), standingIdentitySignals (StandingDisposition, via
                    IDENTITY_CHANNEL_TO_MOTIVE_CHANNELS — one identity channel may emit signals to
                    several MotiveChannels, e.g. NoveltySeeking -> Recreation+Novelty, sharing one
                    EvidenceBasis), situationalMemorySignals/situationalExpectationNudgeSignals
                    (SituationalEvidence, EvidenceBasis = {[memory.experienceId]: weight} — the only
                    two signal families this phase gives real provenance, per scoping decision 6);
                    [Phase 2.97 closure audit, Check 3] situationalMemorySignals no longer attributes
                    every outcome wholly to the option's own subject — new attributedReferents() weights
                    each of a memory's `participants` by that participant's `MemoryEpisode.conceptSalience`
                    entry, NORMALIZED against the total salience present (so a single-participant memory,
                    still the only kind this scenario's real pipeline produces, keeps its exact pre-fix
                    weight of 1; a genuinely multi-participant memory splits weight proportional to
                    relative salience); falls back to the pre-fix wholly-to-subject behavior when no
                    participant has any recorded salience
    commitment.ts   [Phase 2.97 closure audit, second correction, new] CommitmentDef (a static, authored
                    one-time obligation — commitmentKey, stakeholder, fulfillingAction, motiveChannel,
                    activeObligationPressure) and commitmentSignal/commitmentSignals — the real, non-Need
                    MotiveGenerating source `NEED_COMMITMENT` should have been from the start: referented
                    to the commitment concept itself (commitmentKey), never to its stakeholder, so two
                    independent commitments about the same person stay two nuclei; no Need-style
                    dynamics (no satisfaction, no decay, no expectation) — a static authored pressure,
                    consumed by cognitiveSignals.ts's parallel commitmentStandingIdentitySignals builder
                    (which fixes a real referent-mismatch bug: the generic standingIdentitySignals always
                    emits at the option's own subject, which would otherwise leave CommitmentFidelity's
                    Standing signal in a dead group that never reaches the real Commitment nucleus) and
                    threaded through cycle.ts::runDecisionCycle's new trailing `commitments` parameter
                    (default `[]`)
    diceCompiler.ts [Phase 2.97, new] BaseDieThresholds/strengthToBaseDie (a versioned scale distinct
                    from decision.ts::strengthToDie — modifiers here are additive integers on a die,
                    not another scaled die); ModifierFamilyDefinition/strengthToIntegerModifier
                    (truncate-toward-zero, clamped to ±maxMagnitude); CompiledNucleus (key,
                    baseMotiveStrength B_n, reasonRelevance R_n, baseDie, standingModifier,
                    situationalModifier, finalModifier, distribution, sourceSignals,
                    correlationTrace); compileReasonDice — enforces Reason Activation (B_n=0 ⇒ no
                    nucleus at all, "a modifier cannot create meaning from nothing"; R_n<thetaReason ⇒
                    a real but non-dice-active reason) and the one-nucleus-one-die compilation
                    invariant inline
    decision.ts     [Phase 2.9, new] pure Decision math — Option/Decision/DecisionInfluence,
                    DieScaleParams/DecisionParams, strengthToDie, resolveDecision (exact pre-roll
                    win probabilities via discreteDistribution.ts, Margin/Contest/ConflictMass/Stake/
                    AuthorshipPotential, resolution-mode classification, and — for a rolled Decision —
                    the actual counter-addressed dice roll with deterministic tie-break),
                    DecisionExpression (the brief's §18 biographical-evidence record). Takes
                    already-assembled DecisionInfluence[] as input, same layering discipline choice.ts
                    already uses; does not import activation.ts/actions.ts/character.ts;
                    [Phase 2.95, new] RawReasonInfluence (a pre-`boundedResponse` raw pressure record
                    tagged by SemanticReasonChannelId) + `sumRawBySemanticChannel` (sums raw pressure
                    by channel, exposed on its own so a caller can fold MORE raw pressure — identity's
                    own feedback — into the pool before anyone bounds or floors it) + `boundAndFloorChannels`
                    (bounds then floor-filters — the dice-eligible result) + `boundAllChannels` (dense,
                    bounded, NOT floor-filtered — used only where a channel's meaning must not be gated
                    by dice-eligibility, i.e. identity's own Alignment/evidence generation);
                    [Phase 2.97] `resolveDecision`'s body extracted, behavior-preserving, into a private
                    `resolveDecisionCore` (Margin/Contest/Stake/AuthorshipPotential/rolling logic,
                    reused verbatim by both pipelines) plus a thin wrapper unchanged from Phase 2.95;
                    new `resolveReasonDiceExpressions` builds the same `{id, distribution,
                    motivationalMass}` map from `CompiledNucleus[]` instead of `DecisionInfluence[]`
                    (`id = nucleusKeyString(key)`) and calls the identical core — every pre-existing
                    `resolveDecision` test reproduces byte-identical output, checked directly
    identity.ts     [Phase 2.9, new] IdentityExpressionChannelId (the brief's §15 candidate channel
                    list) + CHANNEL_ORDER (its one canonical ordering); IdentityEvidenceState +
                    updateIdentityEvidence (Support/Opposition accumulation, quantized on commit);
                    identityStrength/identityConfidence; IdentityTrait + projectTrait (via
                    linalg.ts::quadraticForm) + isConsolidated; [Phase 2.95, rewritten] Alignment/
                    TaggedPressure now read from `BoundedSemanticPressure` (dense, bounded, NOT
                    floor-filtered — `decision.ts::boundAllChannels`'s output) keyed by
                    SemanticReasonChannelId, against the authored `defaultSemanticReasonPolarity()`
                    table (`scenario.ts`), rather than from floor-surviving DecisionInfluence[] as in
                    Phase 2.9 — the fix that lets a weak Need signal and weak identity evidence on the
                    same channel be seen as one combined pressure for Alignment purposes even before
                    either individually clears the dice floor; `identityConsistency` kept (same
                    exported name) purely for trace/display; new `identityFeedbackRawInfluences` is the
                    actual Phase 2.95 mechanism — maps each channel's Alignment-weighted pull directly
                    to a `RawReasonInfluence` tagged `identity:<channel>` for cycle.ts to fold into its
                    shared raw pool
    invariants.ts   runtime invariant checks (§6 "VALIDATE INVARIANTS"), incl. [Phase 2] row-
                    substochastic association invariant; [Phase 2.9] Support/Opposition
                    non-negativity and IdentityStrength/IdentityConfidence range checks for every
                    stored IdentityEvidenceState, checked every cycle like every other invariant here
    scenario.ts     the default Mina/Glen/Priya scenario and its authored constants; [Phase 2.5a]
                    defaultSaturationParams(); [Phase 2.5b] defaultSalienceParams(), OBJECT_LAMP,
                    LOCATION_BAKERY; [Phase 2.5c] every ActionDef now declares subjectRole
                    ('Participant' for ordinary visit/stay Actions, 'Cause' for betrayalAction());
                    [Phase 2.5e] defaultSaturationParams()/defaultCycleParams() now return the
                    CANONICAL settings (censored learning, derived salience) — legacySaturationParams()/
                    legacyCycleParams() (new) hold the retired naive/flat-weight baseline under its own
                    name for historical/control comparisons; [Phase 2.9] defaultDecisionParams(),
                    defaultDecisionScenario() (a second character-state
                    factory, contested-by-construction on both new Decision axes),
                    dinnerVsWorkDecision()/speakUpVsStayQuietDecision()/crossAxisFaultLineDecision(),
                    decisionOutcomeTables(), and the new Achievement/Recognition/Security Need axes plus
                    ACTION_KEEP_DINNER_PROMISE/ACTION_STAY_AT_WORK/ACTION_SPEAK_UP/ACTION_STAY_QUIET;
                    [Phase 2.95] defaultSemanticReasonPolarity()/defaultReasonChannelMapping() are the
                    canonical (semantic-channel-keyed) replacement for Phase 2.9's original
                    `defaultReasonChannelPolarity()`, which is now removed — every `runDecisionCycle`
                    call site takes both; defaultDecisionCycleParams() bundles a full CycleParams for
                    Phase 2.95's experiments; [Phase 2.97] defaultMotiveChannelMapping() (NeedId ->
                    MotiveChannel, one-to-one — no bundling needed, unlike the Phase 2.95 semantic-
                    channel table) and defaultIdentityMotiveChannelMapping() (IdentityExpressionChannelId
                    -> MotiveChannel[], a fresh authored bridge table, NOT a port of
                    defaultSemanticReasonPolarity()) are the two new bridge tables
                    cognitiveSignals.ts's builders take as parameters; defaultReasonNucleusParams()
                    bundles the new, separately-versioned BaseDieThresholds + ModifierFamilyDefinition
                    map + thetaReason — explicit research knobs (`experiments/calibrationSweeps.ts`
                    measures their real probability effects, see RESEARCH.md's Phase 2.97 entry);
                    `defaultDecisionCycleParams()`'s DecisionParams now always carries
                    `compilationMode: 'legacy'` (default) and `reasonNucleus:
defaultReasonNucleusParams()`; [Phase 2.97 closure audit, Check 1, ORIGINAL — superseded]
                    a NEED_COMMITMENT Core Need briefly lived here as the fix giving CommitmentFidelity a
                    genuine motive to modify; [Phase 2.97 closure audit, Check 1, SECOND CORRECTION —
                    current] NEED_COMMITMENT is REMOVED outright (modeling a one-time obligation as a
                    Need was the wrong semantic layer — see commitment.ts's own module doc comment);
                    COMMITMENT_DINNER_WITH_GLEN (a ConceptKey — the commitment itself, distinct from
                    PERSON_GLEN its stakeholder) and defaultCommitments() (a CommitmentDef[],
                    `activeObligationPressure` 0.10, fulfilling only ACTION_KEEP_DINNER_PROMISE) are the
                    real, static, non-Need MotiveGenerating source that replaces it, consumed by
                    commitment.ts's builders and threaded through runDecisionCycle's new trailing
                    `commitments` parameter (default `[]`, so every existing call site is unaffected
                    unless it opts in) — RESEARCH.md's Phase 2.97 entry has the full before/after and
                    the Auto-mode-lock finding that shaped where this source is (and deliberately is not)
                    wired in
    semanticExperience.ts [Phase 2.5e] SemanticExperience, ConceptEncoding, NeedObservation — the
                    formalized character-relative record of one Experience Phase 3 should consume;
                    deliberately has no Overflow field anywhere (see its own module doc)
    associations.ts [Phase 2] associative graph W_t, sole-mutation-authority Hebbian learning (§14–15)
    activation.ts   [Phase 2] spreading activation a = (I - βW)⁻¹b (§16)
    memory.ts       [Phase 2] episodic memory, recency/frequency accessibility, retrieval (§17);
                    [Phase 2.97 closure audit, Check 3] MemoryEpisode gained `conceptSalience`
                    (ReadonlyMap<ConceptKey, Rational>, defaulting to empty) — this Experience's
                    per-concept semantic salience (Phase 2.5b/c's z_i), threaded through by
                    `createMemory`'s new trailing-optional parameter so every pre-existing positional
                    call site keeps compiling; `cycle.ts` populates it from the SAME
                    `experienceActivation` map it already computes, no new computation
    salience.ts     [Phase 2.5b] Semantic Salience — CategoryFromConceptKey, BASE_SALIENCE/
                    ROLE_WEIGHT tables, needRelevance, rawSalience, the three §12 salience-budget
                    models, computeSemanticSalience pipeline (§5-14, §25-27); [Phase 2.5c]
                    EffectProvenance + deriveWorldEventDescriptor (the only place a CausalRole is
                    ever assigned, mechanically, from what causally happened) + subjectRoleSlot,
                    causallyConnectedFromProvenance, deriveAttention (residual Incidental-pool
                    splitting, replacing the old authored `unattended` flag), SurpriseEvidence +
                    surpriseMagnitude (evidence-kind-aware surprise sharing expectation.ts's
                    EvidenceKind vocabulary) — `PerceivedConcept`/`SalienceBreakdown` no longer have
                    an `unattended` field; `budgetMode: 'independent'` is the locked reference default

  experiments/   Brief §28–29 controlled experiments, as plain functions over model/
    learnedSatisfaction.ts     repeated scripted Experience -> learning curve
    counterfactual.ts          paired Timeline A/B runner (§29)
    habit.ts                   [Phase 2] repeated Context->Action co-activation (§28)
    substitution.ts            [Phase 2] does accessibility redirect toward a substitute? (§28–29)
    avoidance.ts               [Phase 2] does repeated punishment reduce Pr(action)? (§27–28)
    memoryAccessibility.ts     [Phase 2] recency/frequency/decay/reinforcement demonstration (§17)
    saturatedSatisfaction.ts   [Phase 2.5a] Need-level sweep vs. naive/censored learningMode (§21)
    saturationCounterfactual.ts [Phase 2.5a] required Timeline A/B counterfactual (§22)
    semanticSalience.ts        [Phase 2.5b, rebuilt Phase 2.5c] required Scenarios A-F (§13) against
                               computeSemanticSalience — each scenario now constructs an
                               EffectProvenance (what causally happened) rather than a hand-set
                               WorldEventDescriptor; Scenario F returns withOneIncidental/
                               withThreeIncidental variants demonstrating derived residual attention
    saturationSalienceInteraction.ts [Phase 2.5d] the four required cases (Observational
                               Equivalence, Saturation vs. Unsaturated Utility, Surprising Censored
                               Evidence, Total Saturation) closing Brief §24 — runs the real
                               runScriptedExperience pipeline end-to-end per case rather than calling
                               computeSemanticSalience with hand-picked inputs; no UI runner (this
                               phase's four cases are validated directly by
                               phase2_5dSaturationSalienceInteraction.test.ts — see Testing philosophy)
    decisionResolution.ts      [Phase 2.9] Experiments A, B, C, D, K — one shared "two-option decision"
                               harness (`runDecisionSample`) against `defaultDecisionScenario()`, each
                               case overriding NeedExpectation/NeedLevel to land in the specific
                               Auto/QuietRoll/PlayerFacingRoll regime its letter needs; K reuses D's
                               contested setup plus a forcedOutcomeOverride to separate ChosenIntent
                               from the physically executed Action
    identityFormation.ts      [Phase 2.9] Experiments E, G, H, I, J — a "run N Decisions on one axis,
                               record the trajectory" harness (`runRepeatedRounds`), resetting only the
                               Need levels/NeedExpectation each round so identityEvidence/
                               decisionHistory carry forward as a real biography would; every claim that
                               "identity specifically causes this" is checked as a measured
                               `identityFeedbackEnabled: true` vs. `false` difference, never assumed
    seedDivergence.ts          [Phase 2.9] Experiment F (the flagship claim) — two independently-seeded
                               parallel character timelines through an identical genuinely-ambiguous
                               Decision sequence, checking every link of "different early rolls →
                               different choices → different acquired identity → different later
                               probabilities" against real output, the same paired-timeline discipline
                               counterfactual.ts established for Glen-vs-Priya, applied to a different
                               independent variable (RNG seed instead of which subject was visited)
    reasonConsolidation.ts     [Phase 2.95, new] Targets A-E — the external review's required
                               verification suite for the consolidation fix: gradual identity influence
                               across a wide identity-evidence sweep, weak-signal combination (an
                               explicit floor-rescue demonstration, with an isolated "identity alone
                               would be too weak too" control), a real (narrowing, not cancelling or
                               flipping) identity fault line, transformation under sustained
                               contradiction with `identityFeedbackEnabled` left ON throughout (no
                               ablation, unlike Experiment J), and canonical trait acquisition with
                               feedback on from a completely fresh, zero-evidence scenario — every case
                               against real `runDecisionCycle` output, each parameter set found by the
                               same empirical-search discipline as every other experiment file here
    reasonNucleusFormation.ts [Phase 2.97, new] Experiments A, B, C — real `runDecisionCycle` runs
                               under `compilationMode: 'reasonNuclei'`, asserting exact nucleus COUNT
                               and IDENTITY (which MotiveChannel/ReferentKey each one carries): a
                               first-ever Decision forms exactly one nucleus per Option (A); one
                               referent given several independently-mapped Needs forms several
                               independent nuclei about that SAME referent (B); two Options given the
                               same mapped Need against different subjects each resolve their own
                               independent nucleus on the SAME MotiveChannel but different Referents (C)
    correlatedEvidence.ts     [Phase 2.97, new] Experiments D, E, F — the Reference Correlation
                               Consolidator validated at two layers: Layer 1 (F) packages
                               evidenceOverlap.test.ts's own hand-authored Brief-spec numbers
                               ({1,2,3} vs {3,4,5}, Overlap=1/5) as a runnable experiment; Layer 2 (D,
                               E) runs a real Decision where one retrieved memory legitimately feeds
                               two independently-derived situational signals sharing one EvidenceBasis
                               (D — must fully discount) versus two separate memories with disjoint
                               bases (E — must stack fully) on the identical (Option, MotiveChannel,
                               Referent) triple
    identityAsModifier.ts     [Phase 2.97, new] Experiments G, H, I — reruns
                               identityFormation.ts's own repeated-decision bootstrapping harness
                               (never hand-built fixtures) to establish real WorkPersistence/
                               CommitmentFidelity identity, then one reasonNuclei-mode Decision per
                               case: standing modifier present vs. ablated with base motive strength
                               unaffected (G); a real but too-weak-alone motive rescued into floor-die
                               (d4) activation by a real, weakly-established standing identity on the
                               same channel (I); [Phase 2.97 closure audit, Check 1, original] Experiment
                               H rewritten: pre-audit it showed real, genuinely nonzero CommitmentFidelity
                               evidence unable to form a nucleus on a MotiveChannel with no
                               MotiveGenerating source — H then demonstrated BOTH the (now-superseded)
                               NEED_COMMITMENT fix and that the underlying rule survives elsewhere (real,
                               substantial, directly-injected Caregiving evidence — a channel still
                               genuinely ungenerated in this scenario — still forms no nucleus anywhere);
                               [Phase 2.97 closure audit, Check 1, second correction] H further extended
                               with bootstrapDinnerIdentity() — a mirror-image bootstrap producing a
                               genuinely STRONG (not merely nonzero) CommitmentFidelity identity — to
                               confirm the real, correctly-referented Commitment nucleus (from the new
                               `defaultCommitments()` source, not a Need) receives a nonzero standing
                               modifier, and that the nucleus's own referent is the commitment concept
                               itself, never its stakeholder
    situationalModifiers.ts   [Phase 2.97, new] Experiment J — Need level, NeedExpectation, and
                               identity evidence held byte-identical across two real
                               `runDecisionCycle` runs; only the retrieval set's one supportive memory
                               differs, confirming baseMotiveStrength stays identical while only the
                               situational modifier responds
    diceGrammarRichness.ts    [Phase 2.97, new] Experiment K — one Option driven to four
                               simultaneously-active independent nuclei (reusing the same
                               multi-Need-against-one-subject mechanism Experiment B exercises,
                               extended to four Needs); asserts the combined dice-pool distribution is
                               the EXACT convolution of each nucleus's own distribution (PMF sums to 1,
                               support matches the additive min/max range) — never an approximation
    calibrationSweeps.ts      [Phase 2.97, new] Experiment L + the Offline Backward Balancing research
                               — pure kernel-level, no CharacterState: runModifierSweep (fixed base
                               die, modifier swept ±N) and runBaseDieSweep (base-die size swept at a
                               fixed modifier), both via the identical exact `winProbabilities` every
                               real Decision resolution uses; runExperimentL_CalibrationRecommendation
                               reports the two headline comparisons as an explicit calibration
                               recommendation (see RESEARCH.md's Phase 2.97 entry for the real,
                               previously-unknown finding this produced), never silently applying it
    oldVsNewCompilation.ts    [Phase 2.97, new] Experiment M — the identical {CharacterState,
                               Decision, Seed} run through both the frozen legacy pipeline and the new
                               `reasonNuclei` pipeline side by side, comparing dice count, probability
                               deltas, and trace-label readability directly (never inferred from
                               separate runs) — proves the shared `resolveDecisionCore` extraction
                               left the underlying resolution math genuinely unchanged
    seedDivergenceReasonNuclei.ts [Phase 2.97, new] Experiment N — reruns seedDivergence.ts's own
                               flagship paired-seed harness (Phase 2.9's Experiment F) entirely under
                               `compilationMode: 'reasonNuclei'`; the module doc comment records a
                               real, not-assumed-in-advance finding about WHICH identity channel ends
                               up carrying the later-decision divergence under the new vocabulary (see
                               RESEARCH.md's Phase 2.97 entry); [Phase 2.97 closure audit, Check 1
                               rerun, original — superseded] default `rounds` briefly moved from 40 to
                               100, having checked empirically that the (now-removed) NEED_COMMITMENT
                               addition shifted WorkPersistence's accumulated evidence enough that both
                               timelines' values landed on the same side of the StandingIdentity
                               modifier's quantization boundary at 40 rounds; [Phase 2.97 closure audit,
                               Check 1, second correction — current] `defaultCommitments()` is
                               deliberately NOT wired into this harness at all — doing so once (mirroring
                               how G/H/I were extended) locked the Decision into deterministic `'Auto'`
                               resolution mode from round 1 for 500+ rounds (a constant, non-decaying
                               obligation gives one option a permanent second die, pushing Contest below
                               `thetaRoll`), destroying all stochastic divergence between the two
                               timelines — a structural finding, not a calibration one, and one no amount
                               of recalibrating rounds or magnitude could fix; `rounds` reverted to its
                               original default of 40, which now shows genuine divergence on all four
                               measures again (see RESEARCH.md's Phase 2.97 entry for the real numbers
                               and the Auto-lock discovery in full)

  ui/            React SPA — visualizes and drives everything above
    state/useEngine.ts        the only place React meets the model; [Phase 2.9] decisionParams +
                               updateDecisionParams, and one result-holder field + run*UI callback per
                               Phase 2.9 experiment (A, B, C, D, K, E, G, H, I, J, F); [Phase 2.95] five
                               more result-holder fields (targetAResult-targetEResult) + run*UI
                               callback per reasonConsolidation.ts target, same self-contained
                               read-only-probe shape as every other experiment callback here;
                               [Phase 2.97] fourteen more result-holder fields + run*UI callbacks, one
                               per Experiment A-N, registered in the final useMemo alongside every
                               prior phase's — no new setter needed beyond the existing generic
                               `updateDecisionParams` patch-merge (compilationMode and reasonNucleus
                               are just two more DecisionParams fields it already covers)
    components/               NeedPanel, ExpectationPanel, ActionPanel, ModelParamsPanel,
                               DeterminismPanel, TraceViewer, CounterfactualPanel, Slider, Bar,
                               [Phase 2] AssociationPanel, MemoryPanel, Phase2ExperimentsPanel,
                               [Phase 2.5a] SaturationPanel, [Phase 2.5b/c] SaliencePanel (no
                               "unattended" column since 2.5c — Scenario F shows two Incidental-
                               count variants instead), [Phase 2.9] DecisionPanel — DecisionParams
                               sliders/toggle, grouped run-buttons and result rendering for all eleven
                               lettered experiments, following SaturationPanel's own
                               table/badge/Rational-rendering conventions; [Phase 2.95] DecisionPanel
                               extended with a fifth run-button group ("Reason consolidation — Targets
                               A-E") rendering each target's DecisionExpression(s)/repeated-round
                               summaries alongside its own required verification flags; [Phase 2.97]
                               DecisionPanel extended again with a `compilationMode` toggle, six new
                               reasonNucleus threshold/modifier-unit sliders, and a sixth run-button
                               group ("Reason Nuclei — Phase 2.97", Experiments A-N) — plus new shared
                               view components `CompiledNucleusView`/`ReasonNucleusTraceTable`/
                               `CorrelationTraceTable` rendering the Brief §58 REASON-header layout
                               (Key / Base Motive / Base Die / Standing / Situational / Final
                               Expression / Exact Distribution) for any `CompiledNucleus`
    components/               NeedPanel, ExpectationPanel, ActionPanel, ModelParamsPanel,
                               DeterminismPanel, TraceViewer, CounterfactualPanel, Slider, Bar,
                               [Phase 2] AssociationPanel, MemoryPanel, Phase2ExperimentsPanel,
                               [Phase 2.5a] SaturationPanel, [Phase 2.5b/c] SaliencePanel (no
                               "unattended" column since 2.5c — Scenario F shows two Incidental-
                               count variants instead), [Phase 2.9] DecisionPanel — DecisionParams
                               sliders/toggle, grouped run-buttons and result rendering for all eleven
                               lettered experiments, following SaturationPanel's own
                               table/badge/Rational-rendering conventions; [Phase 2.95] DecisionPanel
                               extended with a fifth run-button group ("Reason consolidation — Targets
                               A-E") rendering each target's DecisionExpression(s)/repeated-round
                               summaries alongside its own required verification flags

  test/          Vitest unit tests, one file per proof obligation area (§32); phase2_5Salience.test.ts
                 (Brief §14 criteria + §13 scenarios), phase2_5cExperienceInterpretation.test.ts
                 (the five Phase 2.5c "Required findings," including the isolated Need-relevance
                 test), phase2_5aRepresentation.test.ts (Phase 2.5a Correction 2's four
                 validation Cases A-D, resolving the open (μ, τ) representation question), and
                 phase2_5dSaturationSalienceInteraction.test.ts (the four Phase 2.5d cases closing
                 Brief §24 and Phase 2.5 itself), and semanticExperience.test.ts (Phase 2.5e's
                 SemanticExperience: null under legacy mode, agrees with the granular
                 semanticSalience/saturationAnalysis fields it's packaged from, and structurally
                 excludes Overflow), and [Phase 2.9] discreteDistribution.test.ts (winProbabilities
                 validated against brute-force enumeration), phase2_9Decision.test.ts,
                 phase2_9Identity.test.ts, phase2_9CycleIntegration.test.ts (runDecisionCycle's own
                 glue, end-to-end), phase2_9DecisionResolution.test.ts,
                 phase2_9IdentityFormation.test.ts, and phase2_9SeedDivergence.test.ts (one per
                 experiment file, asserting every lettered experiment's brief §30 verification
                 bullets against real run output), and [Phase 2.95]
                 phase2_95ReasonConsolidation.test.ts (Targets A-E asserted against real
                 reasonConsolidation.ts output, same convention as the Phase 2.9 experiment-file tests),
                 and [Phase 2.97] evidenceOverlap.test.ts (overlap bounds/identity/disjoint cases,
                 consolidateCorrelated against the Brief's own Experiment F numeric example by hand,
                 canonical-ordering independence from input order; [closure audit, Check 2] the
                 {1},{2},{1,2} cumulative-coverage case — the third contribution's effective value is
                 exactly 0 post-fix, versus 3/2 under the pre-fix pairwise-max algorithm — plus
                 aggregateEvidenceBasis's own per-id-max/empty-input cases), reasonNucleus.test.ts
                 (Central Consolidation Rule key equality/grouping both directions, dominantReferent's
                 threshold logic against synthetic ambiguous input; [closure audit, Check 4] an explicit
                 "same Option/Motive/Referent, Pursue vs Avoid must produce separate nuclei" describe
                 block — the same triple resolved oppositely across two compiles produces two
                 non-colliding keys, differing in direction alone), phase2_97CognitiveSignals.test.ts
                 (each builder's exact attribution against hand-computed cases; [closure audit, Check 3]
                 a multi-participant memory's salience-weighted attribution — Glen's contribution
                 strictly exceeds Priya's from the same memory — an incidental non-participant concept
                 never gets attributed, and the empty-salience fallback matches the pre-fix value
                 exactly), phase2_97DiceCompiler.test.ts (the Reason Activation rule, the
                 one-nucleus-one-die invariant, modifier-family calibration bounds; [closure audit,
                 Check 4] the same triple compiled Pursue in one call and Avoid in another never
                 collides, and one compile with deliberately mixed-sign signals on one triple yields
                 exactly one nucleus), phase2_97Decision.test.ts
                 (resolveDecisionCore's extraction is behavior-preserving — every pre-existing
                 resolveDecision test vector reproduces byte-identical output —
                 and resolveReasonDiceExpressions produces the same Contest/Stake math shape),
                 phase2_97CycleIntegration.test.ts (runDecisionCycle's own reasonNuclei-mode branch,
                 end-to-end, plus the clear throw when the new mapping params are omitted under that
                 mode), and one test file per Phase 2.97 experiment file
                 (phase2_97ReasonNucleusFormation.test.ts, phase2_97CorrelatedEvidence.test.ts,
                 phase2_97IdentityAsModifier.test.ts — [closure audit, Check 1, original] Experiment
                 H's assertions rewritten for the (now-superseded) NEED_COMMITMENT-based fix;
                 [closure audit, Check 1, second correction] further extended with assertions that a
                 genuinely strong CommitmentFidelity identity produces a nonzero standing modifier on
                 the real, correctly-referented Commitment nucleus, see identityAsModifier.ts's own
                 entry above — phase2_97SituationalModifiers.test.ts,
                 phase2_97DiceGrammarRichness.test.ts, phase2_97CalibrationSweeps.test.ts,
                 phase2_97OldVsNewCompilation.test.ts, phase2_97SeedDivergenceReasonNuclei.test.ts —
                 [closure audit, Check 1, second correction] commitments deliberately excluded from
                 this harness (an Auto-mode-lock discovery, not a calibration issue — see
                 seedDivergenceReasonNuclei.ts's own entry above), `rounds` back to its original
                 default of 40, still asserting `laterProbabilitiesDiffered` — 8 files, asserting
                 every lettered experiment's required outcome against real run output, same
                 convention as the Phase 2.9/2.95 experiment-file tests)
    phase2_97CommitmentLifecycle.test.ts — [closure audit, Check 1, third pass] a further review's
                 own small closure obligation on the second correction: a `CommitmentDef` may be
                 static authored content, but its `MotiveGenerating` pressure must be conditional on
                 an active, applicable commitment and must disappear on retirement, and a recurring
                 obligation must be independent concrete instances, never one immortal pressure. Four
                 cases against real `runDecisionCycle` output: no commitment authored -> no Commitment
                 nucleus (T0); DinnerWithGlen active on a genuinely identity-invested character -> the
                 real nucleus appears (T1); that SAME commitment retired (simply no longer supplied)
                 on the SAME identity-rich character -> its nucleus is absent again, isolating
                 retirement (not weak identity) as the cause, and reapplying the Activation Rule's "a
                 modifier cannot create meaning from nothing" wall across a lifecycle transition, not
                 just at a nucleus that was never live (T3); a new DinnerWithGlen-shaped commitment
                 instance -> a new nucleus at a new referent, never colliding with the retired one
                 (T4). No new lifecycle/state machinery added — `runDecisionCycle`'s existing
                 `commitments` parameter, supplied fresh per call rather than carried on
                 `CharacterState`, already IS the lifecycle boundary this test proves out
```

## Running it

```bash
npm install
npm run dev       # Vite dev server, hot reload
npm test          # vitest — kernel + model proof-obligation tests
npm run build     # typecheck (tsc -b) + production build to dist/
```

No environment variables, no backend, no network calls at runtime.

## What the UI lets you do

- **Sliders** — every authored constant in the brief's Phase 1, Phase 2, AND Phase 2.5a equations
  is exposed: Need SetPoint/CoreImportance/PassiveRate/urgency exponent (§10), each Action's outcome
  magnitude/noise, choice ε/γ (§24), every NeedExpectation learning-rate parameter (λ_q, ρ_0, σ,
  ρ_min, ρ_max, K_C — §12), spreading-activation β/θ_A/K_A (§16, §22), association learning λ_a/η
  (§14–15), memory accessibility λ_m/d_m/ω_b/ω_a/retrieval-K (§17), and the Phase 2.5a Experienced-
  Reward weight κ.
- **Toggles** — Glen/Priya world availability (feasibility precondition, §22.1), an "evening"
  Context toggle (§16) that feeds spreading activation's base vector and gets tagged onto every
  Experience while on, a naive/censored learningMode toggle (§19, §27, default **censored** since
  Phase 2.5e) that changes how NeedExpectation treats a boundary-clipped observation, and a
  legacy/derived salienceMode toggle (§5-14, §25-27, default **derived** since Phase 2.5e) that
  changes whether an Experience's concepts get flat co-activation weight 1.0 or a derived per-concept
  encoding strength z_i. Both toggles now default to the canonical (censored/derived) position;
  switching either off selects the named, retired historical/control baseline
  (`legacySaturationParams()`/`legacyCycleParams()`), not a co-equal alternative.
- **Event buttons** — scripted (experimenter-forced) Experiences: Visit Glen, Visit Priya, Stay
  Home, a "Run ×N" convenience button for the primary learning experiment, and a dedicated
  Betrayal event (§28) that lands on the *same* NeedExpectation entry ordinary visits build up. A
  separate "Let Mina choose" button runs the full autonomous candidate→evaluate→choose pipeline,
  now accessibility-filtered (§22.2–3) rather than precondition-only.
- **Phase 2 experiment runners** — read-only probes (never touch Mina's actual timeline, same
  pattern as the counterfactual runner) for Habit, Substitution, Avoidance, and Memory
  Accessibility, each rendering its own step-by-step result table (§28–29, §17, §36).
- **Phase 2.5a experiment runners** — the same read-only-probe pattern for the required Saturated
  Satisfaction sweep (§21, naive vs. censored side by side across five Need levels) and the required
  Timeline A/B counterfactual (§22, with the naive/censored divergence comparison called out
  directly).
- **Phase 2.5b/c experiment runner** — runs the required Brief §13 Semantic Footprint Scenarios A-F
  (rebuilt in Phase 2.5c to construct an `EffectProvenance` per scenario instead of a hand-set
  `WorldEventDescriptor`) in one click, each rendering its own full per-concept B/R/A/N/S/raw/z
  breakdown table. Scenario F renders two variants (one vs. three Incidental concepts) to make
  derived residual-attention competition visible.
- **Phase 2.5d has no dedicated UI runner** — a deliberate choice, not an oversight. Its four cases
  (`experiments/saturationSalienceInteraction.ts`) are a one-time closing validation of a question
  (Brief §24) rather than a reusable exploratory tool a user would want to re-run with different
  sliders, so they are asserted directly in `phase2_5dSaturationSalienceInteraction.test.ts` and
  reported with real numbers in RESEARCH.md's Phase 2.5d entry instead.
- **Phase 2.9 experiment runners (`DecisionPanel`)** — sliders for every `DecisionParams` threshold
  (die-scale weak/moderate/strong/veryStrong/extreme, θ_roll/θ_player/θ_trait/θ_confidence, K_I/K_C)
  and a toggle for the `identityFeedbackEnabled` ablation, plus one run-button per lettered experiment
  (A, B, C, D, K, E, G, H, I, J, F), each rendering the resolved DecisionExpression(s) — Options and
  their pre-roll probabilities, Margin/Contest/Stake/AuthorshipPotential, resolution mode, any dice
  actually rolled, chosen Option vs. chosen Intent, and Identity Expression/Update — alongside the
  experiment's own required verification flags as pass/warn badges. [Phase 2.95] adds a fifth
  run-button group, "Reason consolidation — Targets A-E," in the same panel: one button per external-
  review target behavior, rendering the same DecisionExpression/repeated-round-summary views alongside
  each target's own required verification flags.
- **Visible state** — live Need level/deficit/urgency bars, the learned μ/τ/confidence for every
  (subject, Need) pair Mina has ever experienced, the most recent choice probability distribution,
  the full association graph as a heatmap with live row sums, the last computed spreading-
  activation vector, the last autonomous cycle's accessibility-filter breakdown (which Actions
  passed θ_A and the top-K_A cut, and which didn't), the episodic memory list with retrieval
  counts and (when just retrieved) Base/Associative/Retrieval score breakdowns, the last
  Experience's Capacity/Applied/Overflow/Reward breakdown per Need, the last Experience's full
  semantic-salience breakdown when salienceMode is 'derived', a determinism-replay PASS/FAIL
  indicator, a paired-counterfactual comparison table, and an expandable causal-trace log of every
  cycle that has run.

## Scope decisions worth knowing about

- **Score(a) is Need-term-only in this build.** Brief §23 defines Score(a) as the sum of Need,
  Value, Personality, Social, and Context terms. Value (§21) needs derived Values (Phase 4);
  Personality (§9) and Social (§18–19) need latent personality and belief models (Phase 3);
  Context needs a Context representation this build doesn't have. Rather than stub those terms at
  zero silently, `model/actions.ts` says so explicitly in comments — this build's results should be
  read as "what Need-satisfaction learning plus associative accessibility alone produce," not as a
  claim that the other terms don't matter. Finding out whether they do is exactly what Phases 3–4
  are for. Brief §23 is explicit that accessibility affects *which* Actions are considered, never
  how desirable a considered Action seems — Phase 2 does not add a second scoring term.
- **The associative graph and episodic memory are now built (Phase 2), but Needs deliberately do
  not participate in Hebbian co-activation.** Needs only seed spreading activation's base vector
  (§16) — they never become graph nodes that co-activate with Actions/People/Context. This was a
  deliberate choice (`associations.ts`'s module comment) to keep "habit" (graph-driven
  accessibility) and "Need-satisfaction learning" experimentally separable; see RESEARCH.md's
  Phase 2 entry for the isolation test that confirms it works.
  Self-association (`W_ii`) is likewise excluded as an authored simplification.
- **Fraction-free linear algebra is built and validated (`kernel/linalg.ts`, `test/linalg.test.ts`,
  `test/activation.test.ts`)** — see RESEARCH.md's Phase 2 entry for what "validated" actually
  covers (exactness against hand-derived systems, and a stress test confirming `(I - βW)` never
  hits a singular pivot across many real learned graphs).
- **An Experience's semantic footprint — how many concepts it tags — directly caps how strong any
  one learned association can become**, since the associative graph is row-substochastic (§14) and
  concepts tagged together compete for the same fixed row budget. `model/cycle.ts` tags every
  ordinary Experience with its Action, subject, Location (if any), and active Context concepts;
  RESEARCH.md's Phase 2 entry documents a concrete case (the Habit experiment) where this caps a
  single edge at exactly 1/2 rather than 1. This is a real, generalizable property of
  row-substochastic Hebbian learning, not a bug — but it means "how many things does one Experience
  involve" is a modeling decision with measurable downstream consequences, not a free choice. **Phase
  2.5b's `salienceMode: 'derived'` is the fix**: instead of every tagged concept getting a flat
  co-activation weight of 1.0 regardless of relevance, each gets a derived z_i from its category,
  causal role, attention, Need relevance, and evidence-aware surprise — see RESEARCH.md's Phase
  2.5b/2.5c entries for a real measured comparison (the same forced Experience's Context→Action
  weight drops from 0.300 flat to ≈0.0014 derived). `salienceMode` defaults to `'legacy'`, so this
  finding and every prior one stay reproducible byte-for-byte until you opt in. As of Phase 2.5c,
  causal role, attention, and surprise are all mechanically derived (`EffectProvenance`, residual-
  pool attention, `SurpriseEvidence`) rather than any of them being authored per scenario — see
  RESEARCH.md's Phase 2.5b Correction section for exactly what that closed.
- **The default scenario's Need decay is tuned to avoid a ceiling artifact, not to flatter the
  result — and the same tuning concern recurs, mirrored, for Phase 2's Avoidance experiment.**
  `model/scenario.ts` sets Connection's passive decay rate equal to Glen's outcome magnitude
  specifically so repeated visits don't run the Need level into the `[0,1]` clamp — see the comment
  there for the arithmetic. The Avoidance experiment's aversive outcome deliberately targets Rest
  instead of Connection for the same reason in the opposite direction: Connection's decay rate
  combined with ANY negative outcome floor-clamps within 1-2 repetitions (since decay and the
  aversive effect both push the same direction), destroying the learning signal exactly the way an
  under-tuned positive scenario would saturate at the ceiling. See RESEARCH.md's Phase 2 entry for
  the traced numbers.
- **Betrayal is its own Action, not a parameter on Visit Glen.** It shares Glen's `subject`
  (`person.glen`) so it updates the exact same `NeedExpectation` entries ordinary visits do — that
  shared identity is what makes it a real test of "a high-confidence positive expectation receives
  sharply negative evidence" (§28) rather than a different relationship entirely.
- **Censored learning is dual-mode and opt-in; 'naive' is still the default and reproduces every
  Phase 0-2 finding byte-for-byte.** `model/expectation.ts`'s new `evidenceKind` parameter defaults
  to `'point'`; `CycleParams.saturation` defaults to `{learningMode: 'naive', kappa: 1/2}`. Switching
  to 'censored' changes how a boundary-clipped Need effect is learned from: it can no longer pull an
  established expectation the wrong way, and (as of Correction 2, post-2.5c) it also no longer grows
  confidence from observations that carry no discriminating information about the true effect — the
  original post-implementation review found exactly that bug, and it is now fixed: τ only grows on a
  censored bound whose naive candidate strictly moves past the current μ; an uninformative bound
  (including one landing exactly on the current μ) freezes τ instead. **This mechanism is RESOLVED**
  — see RESEARCH.md's Phase 2.5a entry (Correction 2) for the fix, the four validation cases it
  satisfies, and the real counterfactual numbers (divergence reduction rises from ~17% to ~48%).
- **Experienced Reward (`Applied + κ·Overflow`) is traced every cycle but never used.** It is not
  added to Need state, Score(a), or any learning update this phase — the brief explicitly cautions
  against assuming this quantity (Model C) is necessary, so it is fully instrumented (visible in the
  trace and the `SaturationPanel`) without being wired into any behavior-affecting pathway. See
  RESEARCH.md's Phase 2.5a entry for why this is classified DEFERRED, not DERIVED.
- **Semantic Salience's category/role/attention tables are global and fixed, never per-scenario —
  and, as of Phase 2.5c, so are every one of the pipeline's per-Experience inputs.** `BASE_SALIENCE`
  (by `ConceptCategory`), `ROLE_WEIGHT`, and `DEFAULT_ATTENTION_BY_ROLE` (by `CausalRole`) in
  `model/salience.ts` are the only authored numbers in the whole pipeline, applied identically
  regardless of which specific Person/Object/Location fills a category or role — no named entity
  (Glen, the Lamp, the Bakery) ever gets its own hand-tuned weight, per Brief §5.1.
  `categoryFromConceptKey` derives category from a concept's own `namespace.slug` identity (the same
  rule for every concept in a namespace); causal role is now derived mechanically by
  `deriveWorldEventDescriptor` from an `EffectProvenance` describing what causally happened (Phase
  2.5b let a scenario author set a concept's role directly — legitimate as an event description, but
  too easy to mistake for "the role itself was derived," which Phase 2.5c actually closes); and
  attention for Incidental-role concepts is derived by `deriveAttention` splitting a fixed residual
  pool by how many Incidental concepts are present, replacing Phase 2.5b's authored `unattended`
  flag.
- **Semantic Salience deliberately does not reuse `associations.ts`'s BigInt lattice-quantization
  machinery**, even though both compute a bounded normalization over nonnegative Rationals. That
  machinery exists to stop quantization drift compounding across thousands of future updates to
  *persisted* state (the association graph); salience z is recomputed from scratch every single
  Experience with nothing to persist, so plain exact `Rational` division already satisfies the
  exact-arithmetic contract with no drift to guard against. See RESEARCH.md's Phase 2.5b entry
  (Mathematical findings) for the full reasoning — recorded because reusing the machinery would have
  been the more obvious, and wrong, choice.
- **Salience and Saturation share one evidence-kind classification (Phase 2.5c), and Phase 2.5d
  closed the question of whether they need anything more than that.** `cycle.ts` classifies an
  objective `EvidenceKind` (`point`/`lower_bound`/`upper_bound`) unconditionally from the
  Capacity/Applied/Overflow decomposition and feeds it to both `updateExpectation` (learning, gated by
  `SaturationParams.learningMode`) and `computeSemanticSalience`'s surprise (always) — closing the gap
  where 2.5a and 2.5b could privately disagree about what a saturated observation means. Brief §24
  asked whether `raw`/`z_i` should also read Applied/Overflow directly — Phase 2.5d ran four targeted
  cases (`experiments/saturationSalienceInteraction.ts`) through the real cycle and found no: hidden
  Overflow never changes salience when perceived Applied and evidence kind are held fixed
  (Observational Equivalence), a Need-starved Experience is already more Need-relevant with no extra
  factor (Saturation vs. Unsaturated Utility), a censored bound that genuinely contradicts an
  established belief stays salient (Surprising Censored Evidence), and total saturation drives Need
  relevance/surprise to zero without erasing the Experience's baseline Category x Role x Attention
  salience (Total Saturation). Classified **DERIVED** — see RESEARCH.md's Phase 2.5d entry — and
  `Overflow ↛ Salience` / `Overflow ↛ NeedExpectation` are now locked in as standing prohibitions for
  every later phase, addiction (Brief §26) included.
- **Phase 2.5e re-baselined the project onto one canonical path instead of two co-equal, dual-mode
  architectures.** Every prior sub-phase (2.5a-d) deliberately kept its new mechanism opt-in, off by
  default, while it was still being validated — the right discipline mid-investigation, but a growing
  risk once Phase 2.5d's DERIVED classification actually closed the investigation: `defaultCycleParams()`
  was, by that point, quietly running the KNOWN-WORSE, already-superseded rule. Phase 2.5e flips both
  defaults (`censored` learning, `derived` salience) and retires the old behavior to two explicitly-named
  functions, `legacySaturationParams()`/`legacyCycleParams()` — not deleted, kept for exactly the
  historical/control comparisons that still need "the old architecture" on demand (Brief §21/§22's
  required sweep and counterfactual, and any future canonical-vs-`FlatSalienceBaseline`-style control).
  Every previously-published finding was then re-run against the single canonical path: 6 of 8 SURVIVE
  unchanged, 2 (Habit, Avoidance's floor-boundary extension) are REFINED — their qualitative claim
  survives, their exact numbers were an artifact of the retired architecture — and zero are RETRACTED
  outright. See RESEARCH.md's Phase 2.5e entry for the full canonical-pipeline diagram and every
  re-run's real numbers.
- **`SemanticExperience` (`model/semanticExperience.ts`) formalizes the boundary object Phases
  2.5a-d each discovered one field of.** `ConceptEncoding[]` (Phase 2.5b/c's causal role/attention/
  salience) and `NeedObservation[]` (Phase 2.5a's `EvidenceKind`, Phase 2.5c's evidence-aware surprise)
  bundle into one immutable per-Experience record, built once in `cycle.ts::applyChosenAction` from data
  it already computes — a packaging change, not a new computation. It deliberately has no `overflow`
  field anywhere: Phase 2.5d's `Overflow ↛ Salience`/`Overflow ↛ NeedExpectation` findings mean a
  character-relative boundary type structurally has no legitimate place for that quantity. `Overflow`
  keeps its own home (`CycleResult.saturationAnalysis`), and `semanticSalience` remains on `CycleResult`
  unchanged for research/UI granularity — `semanticExperience` is the new consumer-facing consolidation,
  and the interface Phase 3's belief/appraisal system should read instead of inspecting raw world data.
- **Phase 2.9 deliberately builds no latent personality vector (P).** The master Brief assigns P to
  Phase 3, bundled with beliefs/social appraisal; none of Experiments A–K need it as a
  DecisionInfluence source. Brief §35's "no legal transition mutates the 7-dimensional personality
  vector" obligation is recorded as **vacuously satisfied** — the vector doesn't exist yet — rather
  than tested against nonexistent state, and Brief §23's "avoid double-counting personality" warning
  is preserved as a documented future constraint in `decision.ts`'s own module comment for whenever
  Phase 3 adds P and a personality-sourced Influence becomes possible.
- **`Decision` is a new, parallel front-end to Action selection, never a replacement for
  `choice.ts`'s softmax pipeline.** Ordinary autonomous cycles keep choosing among accessibility-
  filtered candidates exactly as before Phase 2.9; `runDecisionCycle` is a sibling entry point used
  only for an explicitly-authored small-Option dilemma, sharing the same `applyChosenAction` tail
  (now exported) once a winning Option resolves — the one real visibility change this phase made to
  pre-existing code. An Option's identity is its backing `ActionDef.actionKey` (no new branded
  `OptionId`); a `DecisionId` reuses `SimEvent.eventId` directly, exactly how `Experience`/`Memory`
  already reuse `event.eventId` rather than minting a parallel scheme.
- **`identityFeedbackEnabled` is a same-seed, same-sequence ablation switch, not a final-product
  toggle.** Because `runDecisionCycle` shares `applyChosenAction`'s tail, repeatedly choosing the same
  Option also strengthens ordinary Hebbian association accessibility for that Option — a second,
  pre-existing reinforcement pathway running alongside the new IdentityConsistency influence. Setting
  `identityFeedbackEnabled: false` re-runs an identical seeded Decision sequence with the
  IdentityConsistency influence channel omitted, so every "identity specifically causes this" claim in
  RESEARCH.md's Phase 2.9 entry is a measured difference between two real runs, never an assumption —
  the same paired-timeline discipline `experiments/counterfactual.ts` established for Glen-vs-Priya,
  applied to a new independent variable.
- **Identity's own `Alignment` formula has a proven ceiling: it can never exceed an Option's own raw
  tagged pressure.** Because `Alignment(o,k) = boundedResponse(TaggedPressure(o,k) − Σ_others)` and
  `boundedResponse(x) < x` for all `x > 0`, no identity strength — however large — can ever add a
  surviving die to an Option whose own raw Need pressure already sits below `thetaInfluenceFloor`.
  This was discovered empirically while building Experiment I (see RESEARCH.md's Phase 2.9 entry) and
  is now a directly-checked invariant (`identityCannotRescueAFlooredOption`), not merely an assumption
  behind that experiment's design. **Phase 2.95 narrows this claim's scope**: it was a true
  architectural fact under Phase 2.9's independent-per-source-floor design, but Target B is a direct
  counterexample to it as a UNIVERSAL claim — two individually-sub-floor signals CAN now jointly clear
  the floor when they land on the same semantic channel and are consolidated together before either is
  checked against `thetaInfluenceFloor`. Experiment I's own specific numbers are unaffected (its
  obvious-baseline setup still resolves to `Contest=0` with or without identity feedback — verified
  directly, not assumed, after the architecture change), because that experiment's particular
  RiskAcceptance/Recognition combination still doesn't cross the floor even combined — but the general
  mathematical impossibility argument itself no longer holds as an architectural invariant, only as an
  empirical fact about that one parameter regime.
- **Phase 2.95 folds identity's raw per-channel pull into the SAME semantic-channel consolidation pool
  as Need/accessibility, rather than assembling it as its own separately-floored Influence** — the fix
  for the "all-or-nothing" behavior an external review traced Phase 2.9's own floor-rescue-impossibility
  proof to. The key design insight is a two-map separation: a Need/accessibility-only bounded (never
  floor-filtered) map is used exclusively for identity's own expression/evidence generation (preserving
  Brief §23's no-double-counting rule — identity's own feedback must never feed back into producing MORE
  identity evidence for the same channel), while a separate, per-option merged raw pool (Need/
  accessibility plus identity's raw pull, when enabled) is bound-and-floored exactly once for the
  DecisionInfluence[] that actually drives dice and resolution. See RESEARCH.md's Phase 2.95 entry for
  all five of the review's required target behaviors, verified against real output.
- **Die-bracket quantization is inherent to this reference model and Phase 2.95 does not remove it.**
  The pre-bracket consolidated Rational value is, by construction, a smooth, continuous, monotonically
  saturating sum run through one shared `boundedResponse` call — but `strengthToDie`'s five authored
  discrete bands (Brief §8) mean resolved PROBABILITY still jumps at bracket boundaries. What Phase 2.95
  changes is which side of an existing boundary a combined signal lands on (making a previously-
  unreachable combination reachable at all), never "make dice continuous" — Target A's own sweep is
  the direct empirical demonstration of this honest limit.
- **An established identity's resistance to behavioral contradiction (Phase 2.9's Experiment J finding)
  survives Phase 2.95 unchanged as a general phenomenon — only the specific bias level needed to
  overcome it changed.** Running Experiment J's own contradiction bias with feedback left on still
  produces rising, not falling, strength under Phase 2.95 (confirmed directly, not assumed) — the
  consolidation fix does not make identity weaker or less self-protective. What it does is let a
  MODEST (one die-bracket, not an order-of-magnitude) increase in the contradiction's own raw pressure
  win consistently enough to actually erode a consolidated trait with feedback active throughout, where
  under Phase 2.9's architecture no feedback-on parameter regime achieved this at all. See RESEARCH.md's
  Phase 2.95 entry, Target D, for the round-by-round finding.
- **Phase 2.95's `SemanticReasonChannelId` consolidation is frozen as the historical baseline, never
  replaced.** `DecisionParams.compilationMode: 'legacy' | 'reasonNuclei'` defaults to `'legacy'` — the
  same opt-in-by-default discipline `salienceMode`/`learningMode` already established — so every
  pre-2.97 experiment, test, and UI panel keeps running the exact old pipeline unless a call site
  explicitly opts in. `resolveDecision`'s Margin/Contest/Stake/AuthorshipPotential/rolling logic was
  extracted, behavior-preservingly, into a shared `resolveDecisionCore` both pipelines call verbatim —
  Experiment M runs the identical input through both side by side and finds the underlying math
  genuinely unchanged (identical dice counts and Rational-exact probabilities), confirming the two
  pipelines really are alternate front-ends to the same resolution core, not two competing
  probability models.
- **Referent and Motive attribution are exact by construction in every signal source this phase
  actually has, never fractional or threshold-based.** The Brief's general continuous-attribution
  machinery (`dominantReferent`, θ_referent/θ_dominance) is implemented and unit-tested against
  synthetic ambiguous input, but no real Need- or memory-sourced signal in this build ever needs it: a
  Need's referent is always its own subject with weight 1. This is recorded as a deliberate deferred
  generalization, not a gap discovered too late to fix.
- **Closure audit, Check 3 (review agent finding): a memory's referents are attributed by
  salience-weighted SHARE among its participants, not flat equal membership in the participant list.**
  The original claim above — "a memory's referents are always its own recorded participant list,"
  each implicitly weight 1 — was true of the code but wrong as psychology: a memory naming Glen and
  Priya where only Glen is actually salient to the remembered event should not attribute equal
  motivational weight to both just because both are named. `MemoryEpisode` gained a `conceptSalience:
  ReadonlyMap<ConceptKey, Rational>` field (populated in `cycle.ts` from the already-computed
  `experienceActivation` map — no new computation), and `cognitiveSignals.ts::attributedReferents`
  now attributes each situational signal across participants with recorded nonzero salience, weighted
  by that participant's share of the TOTAL salience present in the memory (so a lone salient
  participant still gets weight exactly 1, preserving every pre-fix numeric result; only genuinely
  multi-participant memories split weight proportionally, e.g. Glen 4/5-salience + Priya 1/5-salience
  over a memory splits an outcome's signed strength 4:1, not 1:1). A participant with no recorded
  salience data at all (or an incidental non-participant object in the same memory) falls back to no
  attribution, and a memory with zero salient participants falls back to the pre-fix flat behavior via
  the option's own subject at weight 1 — so this is a strict refinement of the old rule, not a
  replacement of it, and it was arrived at only after an un-normalized first draft (raw salience used
  directly as weight) was caught breaking Experiments D/E/J's calibrated numbers and corrected to the
  normalized-share design actually shipped.
- **Closure audit, Check 1 second correction: a one-time Commitment is a `MotiveGenerating` source, not a
  Core Need.** Check 1's original fix (a `NEED_COMMITMENT` Core Need satisfied by keeping the dinner
  promise) solved the right problem — CommitmentFidelity needed a real motive to modify — through the
  wrong semantic layer: a Need models a recurring appetite with satisfaction and decay dynamics, while a
  specific one-time obligation has neither, and seeding the Need only for Glen wrongly makes the
  stakeholder the nucleus's referent rather than the obligation itself, which cannot distinguish two
  independent commitments about the same person. `NEED_COMMITMENT` is removed; `model/commitment.ts`'s
  `CommitmentDef`/`commitmentSignal(s)` is a real, static, non-Need `MotiveGenerating` source referented
  to `COMMITMENT_DINNER_WITH_GLEN` (the commitment concept itself). Fixing this surfaced a genuine
  referent-mismatch bug along the way: the existing `standingIdentitySignals` always emits every identity
  channel's Standing signal at the option's own subject (Glen), so CommitmentFidelity's Standing signal
  was landing in a dead group at referent=Glen that never actually reached the real Commitment nucleus —
  fixed with a parallel `commitmentStandingIdentitySignals` builder keyed at the commitment's own
  referent. This also proves out the Brief's own claim that `MotiveGenerating` is a genuinely open family
  of sources (Need pressure, Commitment pressure, and later Goal/Value pressure) rather than a family of
  one — see RESEARCH.md's Phase 2.97 entry for the real verification numbers, and for a serious,
  structural finding this correction surfaced: wiring a constant (non-decaying) Commitment source into
  `identityFormation.ts`'s repeated-round harnesses permanently locks Decision resolution into
  deterministic `'Auto'` mode, so `defaultCommitments()` is deliberately excluded from
  `seedDivergenceReasonNuclei.ts` (Experiment N) even though it is wired into `identityAsModifier.ts`
  (Experiment H).
- **Closure audit, Check 1 third pass: a Commitment's `MotiveGenerating` pressure is conditional on it
  being live, not a permanent fact of having once authored it.** A further review judged the Auto-lock
  finding above "test-scenario incompatibility, expected behavior" and the architecture itself sound, but
  named one small remaining obligation: a `CommitmentDef` may be static authored content, but the pressure
  it generates must disappear once the commitment reaches a terminal state (Fulfilled/Relinquished/Missed/
  Cancelled), and a recurring obligation ("dinner Monday," "dinner Tuesday") must be independent concrete
  instances, never one immortal pressure. No new lifecycle/state machinery was added — no experiment needs
  a commitment that transitions mid-run, and building that ahead of a concrete need would repeat the same
  "generalize before an experiment demands it" mistake this project keeps correcting itself out of.
  Instead, `test/phase2_97CommitmentLifecycle.test.ts` proves, on real pipeline output, that the mechanism
  already in place satisfies the obligation: `runDecisionCycle`'s `commitments` list is supplied fresh per
  call rather than carried on `CharacterState`, so "live" is simply "present in this call's list." Four
  cases: no commitment -> no nucleus; DinnerWithGlen active on an identity-invested character -> the real
  nucleus appears; that SAME commitment retired on the SAME identity-rich character -> the nucleus is
  absent again (isolating retirement, not weak identity, as the cause — the Activation Rule's "a modifier
  cannot create meaning from nothing" wall holding across a lifecycle transition, not just at a nucleus
  that was never live); a new commitment instance -> a new nucleus at a new referent, never resurrecting
  the retired one.
- **Two observations from the same review, recorded but explicitly not acted on this phase.** First:
  referent attribution (Check 3 above) is proven only over a memory's `participants` — a future scenario
  needing an arbitrary causal-object referent that is never itself a participant (e.g. "a lamp falls and
  injures Mina" needing a `Safety × Lamp × Avoid` nucleus) isn't yet supported, and is recorded here as a
  real future limitation rather than silently assumed away. Second: `ReasonNucleusKey` may be more
  cleanly understood as `Option × Motive × Referent`, with `ResolvedReason = ReasonNucleusKey +
  Direction` as a distinct, later-resolved concept — on rereading `reasonNucleus.ts`/`diceCompiler.ts`
  in light of this, it's arguably the more honest description of what `groupSignalsByTriple`/
  `resolvedNucleusKey` already do (Check 4's own finding). Neither was treated as required before Phase
  3 by the review itself, and neither is acted on here — see RESEARCH.md's Phase 2.97 closure-audit
  section for the fuller writeup of both.
- **`EvidenceBasis` provenance is scoped to the two signal families that already carry a concrete
  identifier, not retrofitted onto every aggregated Bayesian scalar in the codebase.** `NeedExpectation`
  and `IdentityEvidenceState` are already-aggregated scalars with no per-source-experience list, and
  retrofitting full provenance onto them would be a materially larger, unjustified expansion — none of
  Experiments A-N actually needs to know which past experiences built up a given NeedExpectation's μ or
  an identity channel's Support. Provenance is populated only for memory-sourced `SituationalEvidence`
  signals (`{[memoryEpisode.experienceId]: weight}`, directly off real `ScoredMemory` data) and
  identity-sourced `StandingDisposition` signals (a single-element `{'identity:<channel>': 1}` tag,
  present purely so the consolidator's canonical-ordering machinery has a uniform input shape — overlap
  is not meaningfully exercised there, since identity's own internal Support/Opposition aggregation is
  Phase 2.9's separate, already-verified mechanism).
- **The new `MotiveChannel` vocabulary is the Brief's own 10-entry controlled list, plus one justified
  11th: `'Habit'`.** `REASON_CHANNEL_ACCESSIBILITY`'s associative-accessibility pull is a real,
  already-validated Phase 2.9/2.95 motive-generating contributor with no honest home among the Brief's
  10 — dropping it would silently regress the seed-divergence/biography-authorship behavior Phase Gate
  item 15 requires to survive. `MotiveDirection` stays `'Pursue' | 'Avoid'` only; the Brief's own
  illustrative `Preserve`/`Reject` extensions are not added, since no experiment A-N needs them and
  generalizing ahead of an experiment that demands it is a mistake this project has corrected itself
  out of before.
- **Base-die thresholds and modifier-family unit/maxMagnitude are new, separately-versioned constants
  — never inherited from Phase 2.9's `dieScale`.** Modifiers here are additive integers on top of a die,
  not another scaled die, so the two scales are not interchangeable even though they share a shape.
  They are explicit, unvalidated-until-measured research knobs: `experiments/calibrationSweeps.ts`
  (Experiment L) measures their real win-probability effects via the exact same `winProbabilities`
  math every real Decision resolution uses, and found a genuine, previously-unknown miscalibration —
  at this build's shipped defaults (modifier-family unit = 1/4), a single +1 modifier step at d8
  (ΔP(win)≈0.1172) is slightly LOUDER than moving a whole base-die bracket, d8→d10 (ΔP(win)≈0.1000) —
  the opposite of "a modifier strengthens; it does not replace the die." This is recorded as an
  explicit calibration recommendation in RESEARCH.md's Phase 2.97 entry rather than silently
  self-corrected, so the finding stays visible; `DecisionPanel.tsx` exposes both the base-die
  thresholds and the two modifier-family units as live sliders for exploring the fix.
- **Standing/Situational raw contributions are NOT individually pre-bounded per-source before
  consolidation, unlike legacy's already-per-Influence-bounded shape** — a raw Need contribution has no
  fixed range, so `diceCompiler.ts::consolidateSigned` sums raw magnitudes within each signed partition
  (positive support and negative modulation are never allowed to cancel before the correlation
  discount), applies the Reference Correlation Consolidator, nets the two partitions, and only THEN
  applies `Rational.boundedResponse` — the same "sum raw, then bound" discipline
  `decision.ts::boundAndFloorChannels`/`identity.ts::identityConsistency` already use throughout this
  codebase, extended to the new pipeline rather than reinvented for it.
- **What Phase 2.97 deliberately does not build**, mirroring the Brief's own exclusion list: no
  `ContextModulating` source role (nothing in the current scenario models fatigue/intoxication/time-
  pressure; adding the role with no real signal source would be dead code), no `SocialAppraisal`/Belief
  modifier families, no latent-personality interaction, no reputation/culture/status/drunkenness/
  addiction/Observer/self-concept modifiers of any kind. These remain named, deferred hooks in code
  comments exactly as Phase 2.9's plan deferred the personality vector — later mechanisms must earn
  their place in this compilation grammar experimentally, not be added because the new grammar could
  technically support them.

## Testing philosophy

Brief §4 distinguishes mathematical validity (provable) from psychological validity (only
falsifiable by experiment). The test suite is organized the same way:

- `rational.test.ts`, `quantize.test.ts`, `canonical.test.ts`, `random.test.ts`, `choice.test.ts`
  check **mathematical** proof obligations from §32 directly: the quantization bound
  `|Q_D(x) - x| ≤ 1/(2D)`, RoundEven ties-to-even, the bounded response `g(x) ∈ (-1, 1)`,
  canonical-order stability, and the random oracle's purity (same address ⇒ same draw; an
  unrelated draw cannot shift another).
- `expectation.test.ts` checks the **prediction-error equivalence** proof obligation
  (`μ' = μ + α(r − μ)`) algebraically, not just behaviorally, plus the confidence bound
  `0 ≤ C < 1`.
- `determinism.test.ts` checks full-cycle **determinism** (replay produces an identical trace
  hash) and then runs the brief's own **psychological** experiments — §28's learned-satisfaction
  scenario and §29's paired counterfactual — as assertions, so "Mina learns Glen satisfies
  Connection" and "Glen ends up preferred over Priya" are regression-tested claims, not just demo
  behavior you have to eyeball in the UI.
- `linalg.test.ts` and `activation.test.ts` check Phase 2's **exact linear algebra** proof
  obligations from §32: hand-derived systems solve exactly, every solution independently satisfies
  `A·x = b` (not just "looks close"), a required row-swap is exercised directly, and — the
  strongest check — `(I - βW)` never hits a singular pivot across many real learned graphs and β
  values, confirming activation uniqueness in practice, not just by the algebraic argument.
- `associations.test.ts` checks the **row-substochastic invariant** (`Σ_j W_ij ≤ 1`, `W_ij ≥ 0`)
  holds under adversarial repeated co-activation, that self-association never appears, and that
  largest-remainder overflow allocation (§15.1) sums to EXACTLY 1 (not merely close to it) with
  deterministic canonical tie-breaking.
- `memory.test.ts` checks episodic memory's **recency, frequency, and decay** formulas (§17)
  against hand-computed fractions, plus retrieval's tie-breaking and reinforcement side effect.
- `phase2Experiments.test.ts` runs the brief's own **Phase 2 psychological experiments** — Habit,
  Substitution, Avoidance, Memory Accessibility — as assertions against real computed numbers, so
  these findings are regression-tested claims rather than demo behavior to eyeball in the UI. Since
  Phase 2.5e's re-baseline, Habit and Avoidance's floor-boundary extension each have TWO tests: one
  pinned to `legacyCycleParams()` documenting the retired architecture's original finding by name
  (Habit's exact 1/2 row-share; Avoidance's floor-saturation mu-corruption), and one against the
  canonical default (`scenario.cycleParams`, no override) documenting the REFINED finding —
  derived-salience Habit converges to a role-weighted ~0.027, not an even 1/2, and canonical
  (censored) Avoidance no longer lets floor-clamped observations corrupt mu at all. Substitution and
  the clean-regime Avoidance test needed no changes: both are architecture-invariant by construction.
  See RESEARCH.md's Phase 2.5e entry for the full re-baseline and every other historical finding's
  classification.
- `needs.test.ts` checks `applyBoundedEffect`'s **Capacity/Applied/Overflow decomposition** as an
  exact algebraic identity (`Applied + Overflow === effect`) across unsaturated, ceiling-clipped,
  floor-clipped, and boundary-exact cases.
- `expectation.test.ts`'s Phase 2.5a section checks the **censored-evidence update's monotonicity
  guarantee** directly and algebraically: a `lower_bound` observation below the current mean must
  never decrease it, the symmetric case for `upper_bound`, that the default `evidenceKind` reproduces
  the pre-2.5 update byte-for-byte, and (Correction 2) that a rejected/uninformative bound leaves τ
  completely unchanged (frozen at τ⁻) rather than still growing it — including the exact-equality
  boundary case, which is deliberately classified as a rejection, not a no-op-but-accepted update.
- `phase2_5aRepresentation.test.ts` encodes the **four validation Cases A-D** RESEARCH.md's Phase
  2.5a Correction section specified as the concrete next step: an established belief resists a weak,
  compatible lower bound exactly (Case A); an inconsistent bound forces an update (Case B); a
  zero-information saturated observation changes nothing (Case C); and a long run of identical
  censored bounds does not artificially suppress how much a subsequent genuine point observation
  moves the belief (Case D) — the last case reproduces the OLD buggy rule inline for direct,
  concrete before/after comparison rather than merely asserting the new behavior in isolation.
- `phase2_5Saturation.test.ts` runs the brief's own **required Saturated Satisfaction sweep (§21)
  and counterfactual (§22)** as assertions: the sweep's finding that a single fresh-prior observation
  makes naive and censored learning identical for μ everywhere, and identical for confidence
  everywhere EXCEPT exactly at total saturation (Correction 2 — naive wrongly grows confidence there,
  censored correctly does not), and the counterfactual's finding that the corrected censored rule
  narrows a naive rule's cross-timeline divergence by roughly 48% (up from the original, buggy rule's
  ~17%) — against the exact numbers documented in RESEARCH.md's Phase 2.5a entry, Correction 2.
- `salience.test.ts` checks Phase 2.5b's **§27 mathematical obligations** directly and algebraically:
  salience bounds (`0 ≤ z_i ≤ 1`) across all three budget models, perception exclusion (`P_i=0 ⟹
  z_i=0` structurally, not just as an emergent near-zero), deterministic salience (identical inputs
  ⟹ byte-identical output), the raw-salience product against a hand-computed value, each budget
  model's own formula (`z_i=g(Raw_i)` for Model A; `z_i=Raw_i/max(B,ΣRaw_j)` for Model B; the
  threshold/leftover split for Model C) checked exactly, not just bounds-checked, and (Phase 2.5c)
  `surpriseMagnitude`'s three evidence-kind cases — including that a `lower_bound` observation at or
  below the prior is exactly zero surprise, never merely small.
- `phase2_5Salience.test.ts` runs the brief's own **required Semantic Footprint Scenarios A-F (§13)**
  (rebuilt in Phase 2.5c against `EffectProvenance`) and asserts all **8 §14 success criteria**
  directly against real `computeSemanticSalience` output — including one full-cycle integration test
  (criterion 7) that runs the same forced Experience once under `salienceMode: 'legacy'` and once
  under `'derived'` and compares the resulting association weights, proving the pipeline is really
  wired into `cycle.ts`/`associations.ts` and not merely callable in isolation — against the exact
  numbers documented in RESEARCH.md's Phase 2.5b entry.
- `phase2_5cExperienceInterpretation.test.ts` asserts Phase 2.5c's **five "Required findings"**
  directly: causal roles derive mechanically from `EffectProvenance` (never hand-set) including
  through a full scripted cycle for both an ordinary `Participant`-role Action and `betrayalAction`'s
  `Cause`-role swing; derived attention's residual-pool competition is monotonic and exactly a 1/N
  split; evidence-aware surprise reproduces the review's own worked example (a `lower_bound`
  observation at/below the prior is zero surprise, above it is positive) and `cycle.ts` classifies
  that evidence kind unconditionally regardless of `SaturationParams.learningMode`; an isolated
  Need-relevance test (role/attention/surprise held fixed, only Need relevance varying) confirms
  `z_B > z_A`; and `defaultSalienceParams().budgetMode === 'independent'` is locked as the reference
  default.
- `phase2_5dSaturationSalienceInteraction.test.ts` asserts Phase 2.5d's **four required cases**,
  each run through a real `runScriptedExperience` cycle rather than a hand-picked
  `computeSemanticSalience` call: Observational Equivalence (identical Applied/evidence kind but
  Overflow 0.05 vs. 0.75 still yields byte-identical Need relevance, surprise, and z); Saturation vs.
  Unsaturated Utility (a Connection-starved Experience is strictly more Need-relevant and more salient
  than a near/over-satisfied one at the identical true effect, with near-satisfied's Need relevance
  landing at exactly zero via `needDeficit`'s own clamp); Surprising Censored Evidence (an identical
  ceiling-clipped +0.15 bound is salient against a contradicted +0.02 belief and exactly zero-surprise
  against a consistent +0.20 belief); and Total Saturation (Need relevance and surprise both hit
  exactly zero at Level=1.0, but Category x Role x Attention keeps `raw`/`z` strictly positive) —
  against the exact numbers documented in RESEARCH.md's Phase 2.5d entry, which closes Phase 2.5.
- `semanticExperience.test.ts` checks that Phase 2.5e's `SemanticExperience` is a packaging of data
  `cycle.ts` already computes, not a new computation: it's `null` under `legacyCycleParams()` (nothing
  character-relative was derived to report) and populated under the canonical default; its
  `conceptEncodings` agree field-for-field with `semanticSalience.breakdown` (concept/category/role/
  perceived/attention/salience) and its `needObservations`' Applied/EvidenceKind agree with
  `saturationAnalysis` and the trace's objective evidence kind; Glen is present with the `Participant`
  role and non-negative surprise on an ordinary visit; no `NeedObservation` ever carries an `overflow`
  key even though `saturationAnalysis` (the world-truth ledger) does, confirming the exclusion is
  structural rather than incidental; and `legacyCycleParams()`/`defaultCycleParams()` are checked
  against each other by identity (naive+legacy vs. censored+derived) so the re-baseline itself can't
  silently drift.
- `discreteDistribution.test.ts` checks Phase 2.9's **exact discrete-distribution kernel primitive**:
  `totalProbability` equals `Rational.ONE` exactly across a range of die convolutions (Brief §35's
  normalization obligation, asserted directly); a hand-computed d4+d6 convolution checked bucket by
  bucket; and — the single most important test in the phase, since it's the only place the tie-share
  formula is checked against ground truth rather than against itself — `winProbabilities` validated
  against **brute-force enumeration** over every combination of die faces for small K/N, plus a direct
  check that the general K-option formula reduces algebraically to the textbook two-option formula.
- `linalg.test.ts` (extended) checks Phase 2.9's new `dot`/`quadraticForm` compositions against
  hand-computed values — the same shape Phase 3's latent-personality trait projection will reuse
  verbatim.
- `phase2_9Decision.test.ts` checks Decision resolution's **mathematical proof obligations**: die-
  threshold boundaries and floor-dropping (`strengthToDie`), Margin/Contest/Stake/AuthorshipPotential
  bounds (§35), resolution-mode boundary behavior at `thetaRoll`/`thetaPlayer`, and deterministic
  replay (same address ⇒ same roll; an unrelated draw elsewhere has no effect) — the same determinism
  style `random.test.ts` already established.
- `phase2_9Identity.test.ts` checks `identity.ts`'s **formulas directly against hand-built fixtures**
  (not live `runDecisionCycle` output, which the phase2_9IdentityFormation/DecisionResolution/
  SeedDivergence files below cover): IdentityStrength/Confidence bounds, the Alignment formula's three
  designed properties (near-zero on a low-conflict decision, positive when the chosen Option's own
  tagged pressure wins, negative when the losing Option carried the tagged pressure instead), trait
  consolidation threshold logic, and quantization-on-commit. [Phase 2.95, rewritten] fixtures now build
  `BoundedSemanticPressure` (dense, semantic-channel-keyed maps) via a `pressure()` helper instead of
  `DecisionInfluence[]`, matching Alignment/touchedChannels' new signatures; a new
  `identityFeedbackRawInfluences` describe block covers the Phase 2.95 mechanism directly.
- `phase2_9CycleIntegration.test.ts` checks that `cycle.ts::runDecisionCycle`'s own GLUE — assembling
  real DecisionInfluences from live CharacterState, folding identity evidence back into
  `state.identityEvidence`, and handing off to the shared `applyChosenAction` tail — actually works
  end-to-end against `defaultDecisionScenario()`, complementing `phase2_9Decision.test.ts`/
  `phase2_9Identity.test.ts`'s direct checks of `decision.ts`/`identity.ts`'s pure math against
  hand-built fixtures.
- `phase2_9DecisionResolution.test.ts`, `phase2_9IdentityFormation.test.ts`, and
  `phase2_9SeedDivergence.test.ts` run the brief's own **required Experiment Suite (A–K)** as
  assertions against real `runDecisionCycle` output, mirroring every prior phase's
  "regression-tested claim, not demo behavior to eyeball" discipline — one file per experiment-file
  grouping (`decisionResolution.ts`'s A/B/C/D/K, `identityFormation.ts`'s E/G/H/I/J,
  `seedDivergence.ts`'s F), each asserting every verification bullet Brief §30 requires for its
  lettered experiments, against the exact numbers documented in RESEARCH.md's Phase 2.9 entry.
- `phase2_95ReasonConsolidation.test.ts` runs the external review's **five required target behaviors
  (A-E)** as assertions against real `reasonConsolidation.ts` output, the same "regression-tested
  claim, not demo behavior to eyeball" discipline as every phase before it: gradual, monotonic,
  never-fully-dictating identity influence across a wide sweep (A); neither weak Need pressure nor weak
  identity evidence alone clearing the influence floor, but doing so consolidated together, with a
  resolution-mode change (Auto → PlayerFacingRoll) as the concrete evidence (B); Contest genuinely
  rising without the decision reversing or collapsing (C); a consolidated trait surviving acquisition
  and then un-consolidating under sustained contradiction with identity feedback left on throughout,
  no ablation (D); and trait consolidation from a completely fresh, zero-evidence scenario under the
  ordinary feedback-on loop, with an explicit check that the run has genuinely stabilized before its
  final round rather than merely still trending (E) — against the exact numbers documented in
  RESEARCH.md's Phase 2.95 entry.
