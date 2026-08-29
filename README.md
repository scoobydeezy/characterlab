# CharacterLab

A standalone, deterministic reference implementation of the cognitive model described in
*CharacterLab — Deterministic Cognitive Reference Model Brief*. This is a **research tool**, not a
game and not a Vivarium prototype: its job is to make the brief's mathematics runnable,
inspectable, and falsifiable, so findings from it can inform (but not dictate) Vivarium's
production architecture.

This build covers **Phase 0 (Mathematical Kernel)**, **Phase 1 (Need-Satisfaction Learning)**,
**Phase 2 (Associative Accessibility & Episodic Memory)**, and **Phase 2.5 (Experience Encoding,
Semantic Salience, and Saturated Satisfaction) — CLOSED**, in five sub-phases: **2.5a (Saturated
Satisfaction & Censored Learning — RESOLVED)**, **2.5b (Semantic Salience — PARTIAL, corrected by
2.5c)**, **2.5c (Experience Interpretation)**, **2.5d (Saturation/Salience Interaction — RESOLVED,
DERIVED)**, and **2.5e (Architecture Consolidation & Behavioral Re-baseline — RESOLVED)** — plus an
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
the full account. Phases 3–6 (personality/belief/
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
    linalg.ts       [Phase 2] exact Gaussian elimination, fixed pivot rule (§16, §32)

  model/         Phase 1 + Phase 2 + Phase 2.5a-e — the character
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
    character.ts    CharacterState (§8: N_t, E_t, [Phase 2] W_t, M_t)
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
                    fields (kept for research/UI granularity and the world-truth ledger, respectively)
    invariants.ts   runtime invariant checks (§6 "VALIDATE INVARIANTS"), incl. [Phase 2] row-
                    substochastic association invariant
    scenario.ts     the default Mina/Glen/Priya scenario and its authored constants; [Phase 2.5a]
                    defaultSaturationParams(); [Phase 2.5b] defaultSalienceParams(), OBJECT_LAMP,
                    LOCATION_BAKERY; [Phase 2.5c] every ActionDef now declares subjectRole
                    ('Participant' for ordinary visit/stay Actions, 'Cause' for betrayalAction());
                    [Phase 2.5e] defaultSaturationParams()/defaultCycleParams() now return the
                    CANONICAL settings (censored learning, derived salience) — legacySaturationParams()/
                    legacyCycleParams() (new) hold the retired naive/flat-weight baseline under its own
                    name for historical/control comparisons
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

  ui/            React SPA — visualizes and drives everything above
    state/useEngine.ts        the only place React meets the model
    components/               NeedPanel, ExpectationPanel, ActionPanel, ModelParamsPanel,
                               DeterminismPanel, TraceViewer, CounterfactualPanel, Slider, Bar,
                               [Phase 2] AssociationPanel, MemoryPanel, Phase2ExperimentsPanel,
                               [Phase 2.5a] SaturationPanel, [Phase 2.5b/c] SaliencePanel (no
                               "unattended" column since 2.5c — Scenario F shows two Incidental-
                               count variants instead)

  test/          Vitest unit tests, one file per proof obligation area (§32); phase2_5Salience.test.ts
                 (Brief §14 criteria + §13 scenarios), phase2_5cExperienceInterpretation.test.ts
                 (the five Phase 2.5c "Required findings," including the isolated Need-relevance
                 test), phase2_5aRepresentation.test.ts (Phase 2.5a Correction 2's four
                 validation Cases A-D, resolving the open (μ, τ) representation question), and
                 phase2_5dSaturationSalienceInteraction.test.ts (the four Phase 2.5d cases closing
                 Brief §24 and Phase 2.5 itself), and semanticExperience.test.ts (Phase 2.5e's
                 SemanticExperience: null under legacy mode, agrees with the granular
                 semanticSalience/saturationAnalysis fields it's packaged from, and structurally
                 excludes Overflow)
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
