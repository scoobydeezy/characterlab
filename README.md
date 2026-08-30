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
                    actually becomes the DecisionInfluence[] driving dice/resolution
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
                    by dice-eligibility, i.e. identity's own Alignment/evidence generation)
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
                    Phase 2.95's experiments
    semanticExperience.ts [Phase 2.5e] SemanticExperience, ConceptEncoding, NeedObservation — the
                    formalized character-relative record of one Experience Phase 3 should consume;
                    deliberately has no Overflow field anywhere (see its own module doc)
    associations.ts [Phase 2] associative graph W_t, sole-mutation-authority Hebbian learning (§14–15)
    activation.ts   [Phase 2] spreading activation a = (I - βW)⁻¹b (§16)
    memory.ts       [Phase 2] episodic memory, recency/frequency accessibility, retrieval (§17)
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

  ui/            React SPA — visualizes and drives everything above
    state/useEngine.ts        the only place React meets the model; [Phase 2.9] decisionParams +
                               updateDecisionParams, and one result-holder field + run*UI callback per
                               Phase 2.9 experiment (A, B, C, D, K, E, G, H, I, J, F); [Phase 2.95] five
                               more result-holder fields (targetAResult-targetEResult) + run*UI
                               callback per reasonConsolidation.ts target, same self-contained
                               read-only-probe shape as every other experiment callback here
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
                 reasonConsolidation.ts output, same convention as the Phase 2.9 experiment-file tests)
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
