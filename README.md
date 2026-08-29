# CharacterLab

A standalone, deterministic reference implementation of the cognitive model described in
*CharacterLab — Deterministic Cognitive Reference Model Brief*. This is a **research tool**, not a
game and not a Vivarium prototype: its job is to make the brief's mathematics runnable,
inspectable, and falsifiable, so findings from it can inform (but not dictate) Vivarium's
production architecture.

This build covers **Phase 0 (Mathematical Kernel)**, **Phase 1 (Need-Satisfaction Learning)**, and
**Phase 2 (Associative Accessibility & Episodic Memory)** from the brief's §33 phase structure, plus
an interactive SPA for running experiments against them. Phases 3–6 (personality/belief/social
appraisal, derived Values, acquired Needs/addiction, and distillation) are intentionally not built
yet — see [RESEARCH.md](./RESEARCH.md) for the phase-gate review and what specifically motivates
Phase 3.

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

  model/         Phase 1 + Phase 2 — the character
    types.ts        shared semantic vocabulary (Concept, ConceptCategory) (§13)
    needs.ts        Need, Level/Deficit/Urgency (§10)
    experience.ts   Experience record, actualNeedResult (§11)
    expectation.ts  NeedExpectation: precision-weighted belief update, confidence (§12)
    actions.ts      Action definition + evaluation (Need term only) + [Phase 2] accessibility-
                    filtered candidate generation (§22–23)
    choice.ts       bounded choice weight, probability distribution, deterministic selection (§24)
    outcome.ts      world outcome resolution with seeded, addressed noise
    character.ts    CharacterState (§8: N_t, E_t, [Phase 2] W_t, M_t)
    cycle.ts        the cognitive-cycle orchestrator (§25), autonomous + scripted + idle variants;
                    doc comment tracks exactly which of the 20 steps run vs. are skipped, per phase
    invariants.ts   runtime invariant checks (§6 "VALIDATE INVARIANTS"), incl. [Phase 2] row-
                    substochastic association invariant
    scenario.ts     the default Mina/Glen/Priya scenario and its authored constants
    associations.ts [Phase 2] associative graph W_t, sole-mutation-authority Hebbian learning (§14–15)
    activation.ts   [Phase 2] spreading activation a = (I - βW)⁻¹b (§16)
    memory.ts       [Phase 2] episodic memory, recency/frequency accessibility, retrieval (§17)

  experiments/   Brief §28–29 controlled experiments, as plain functions over model/
    learnedSatisfaction.ts   repeated scripted Experience -> learning curve
    counterfactual.ts        paired Timeline A/B runner (§29)
    habit.ts                 [Phase 2] repeated Context->Action co-activation (§28)
    substitution.ts          [Phase 2] does accessibility redirect toward a substitute? (§28–29)
    avoidance.ts             [Phase 2] does repeated punishment reduce Pr(action)? (§27–28)
    memoryAccessibility.ts   [Phase 2] recency/frequency/decay/reinforcement demonstration (§17)

  ui/            React SPA — visualizes and drives everything above
    state/useEngine.ts        the only place React meets the model
    components/               NeedPanel, ExpectationPanel, ActionPanel, ModelParamsPanel,
                               DeterminismPanel, TraceViewer, CounterfactualPanel, Slider, Bar,
                               [Phase 2] AssociationPanel, MemoryPanel, Phase2ExperimentsPanel

  test/          Vitest unit tests, one file per proof obligation area (§32)
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

- **Sliders** — every authored constant in the brief's Phase 1 AND Phase 2 equations is exposed:
  Need SetPoint/CoreImportance/PassiveRate/urgency exponent (§10), each Action's outcome
  magnitude/noise, choice ε/γ (§24), every NeedExpectation learning-rate parameter (λ_q, ρ_0, σ,
  ρ_min, ρ_max, K_C — §12), spreading-activation β/θ_A/K_A (§16, §22), association learning λ_a/η
  (§14–15), and memory accessibility λ_m/d_m/ω_b/ω_a/retrieval-K (§17).
- **Toggles** — Glen/Priya world availability (feasibility precondition, §22.1), and an "evening"
  Context toggle (§16) that feeds spreading activation's base vector and gets tagged onto every
  Experience while on.
- **Event buttons** — scripted (experimenter-forced) Experiences: Visit Glen, Visit Priya, Stay
  Home, a "Run ×N" convenience button for the primary learning experiment, and a dedicated
  Betrayal event (§28) that lands on the *same* NeedExpectation entry ordinary visits build up. A
  separate "Let Mina choose" button runs the full autonomous candidate→evaluate→choose pipeline,
  now accessibility-filtered (§22.2–3) rather than precondition-only.
- **Phase 2 experiment runners** — read-only probes (never touch Mina's actual timeline, same
  pattern as the counterfactual runner) for Habit, Substitution, Avoidance, and Memory
  Accessibility, each rendering its own step-by-step result table (§28–29, §17, §36).
- **Visible state** — live Need level/deficit/urgency bars, the learned μ/τ/confidence for every
  (subject, Need) pair Mina has ever experienced, the most recent choice probability distribution,
  the full association graph as a heatmap with live row sums, the last computed spreading-
  activation vector, the last autonomous cycle's accessibility-filter breakdown (which Actions
  passed θ_A and the top-K_A cut, and which didn't), the episodic memory list with retrieval
  counts and (when just retrieved) Base/Associative/Retrieval score breakdowns, a determinism-
  replay PASS/FAIL indicator, a paired-counterfactual comparison table, and an expandable
  causal-trace log of every cycle that has run.

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
  involve" is a modeling decision with measurable downstream consequences, not a free choice.
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
  Substitution, Avoidance, Memory Accessibility — as assertions against the exact numbers
  documented in RESEARCH.md's Phase 2 entry, including the floor-saturation artifact reappearing
  past Avoidance's clean repetition window, so these findings are regression-tested claims rather
  than demo behavior to eyeball in the UI.
