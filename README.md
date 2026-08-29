# CharacterLab

A standalone, deterministic reference implementation of the cognitive model described in
*CharacterLab — Deterministic Cognitive Reference Model Brief*. This is a **research tool**, not a
game and not a Vivarium prototype: its job is to make the brief's mathematics runnable,
inspectable, and falsifiable, so findings from it can inform (but not dictate) Vivarium's
production architecture.

This build covers **Phase 0 (Mathematical Kernel)** and **Phase 1 (Need-Satisfaction Learning)**
from the brief's §33 phase structure, plus an interactive SPA for running experiments against
them. Phases 2–6 (associative accessibility/memory, personality/belief/social appraisal, derived
Values, acquired Needs/addiction, and distillation) are intentionally not built yet — see
[RESEARCH.md](./RESEARCH.md) for the phase-gate review and what specifically motivates Phase 2.

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
  expectation update — and the UI's trace log renders it, expandable, for every single button
  press.

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

  model/         Phase 1 — the character
    types.ts        shared semantic vocabulary (Concept, ConceptCategory) (§13)
    needs.ts        Need, Level/Deficit/Urgency (§10)
    experience.ts   Experience record, actualNeedResult (§11)
    expectation.ts  NeedExpectation: precision-weighted belief update, confidence (§12)
    actions.ts      Action definition + Phase-1 evaluation (Need term only) (§22–23)
    choice.ts       bounded choice weight, probability distribution, deterministic selection (§24)
    outcome.ts      world outcome resolution with seeded, addressed noise
    character.ts    CharacterState (Phase-1 subset of S_t from §8)
    cycle.ts        the cognitive-cycle orchestrator (§25), autonomous + scripted + idle variants
    invariants.ts   runtime invariant checks (§6 "VALIDATE INVARIANTS")
    scenario.ts     the default Mina/Glen/Priya scenario and its authored constants

  experiments/   Brief §28–29 controlled experiments, as plain functions over model/
    learnedSatisfaction.ts   repeated scripted Experience -> learning curve
    counterfactual.ts        paired Timeline A/B runner (§29)

  ui/            React SPA — visualizes and drives everything above
    state/useEngine.ts        the only place React meets the model
    components/               NeedPanel, ExpectationPanel, ActionPanel, ModelParamsPanel,
                               DeterminismPanel, TraceViewer, CounterfactualPanel, Slider, Bar

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

- **Sliders** — every authored constant in the brief's Phase-1 equations is exposed: Need
  SetPoint/CoreImportance/PassiveRate/urgency exponent (§10), each Action's outcome
  magnitude/noise, choice ε/γ (§24), and every NeedExpectation learning-rate parameter
  (λ_q, ρ_0, σ, ρ_min, ρ_max, K_C — §12).
- **Toggles** — Glen/Priya world availability (feasibility precondition, §22.1).
- **Event buttons** — scripted (experimenter-forced) Experiences: Visit Glen, Visit Priya, Stay
  Home, a "Run ×N" convenience button for the primary learning experiment, and a dedicated
  Betrayal event (§28) that lands on the *same* NeedExpectation entry ordinary visits build up. A
  separate "Let Mina choose" button runs the full autonomous candidate→evaluate→choose pipeline.
- **Visible state** — live Need level/deficit/urgency bars, the learned μ/τ/confidence for every
  (subject, Need) pair Mina has ever experienced, the most recent choice probability distribution,
  a determinism-replay PASS/FAIL indicator, a paired-counterfactual comparison table, and an
  expandable causal-trace log of every cycle that has run.

## Scope decisions worth knowing about

- **Score(a) is Need-term-only in this build.** Brief §23 defines Score(a) as the sum of Need,
  Value, Personality, Social, and Context terms. Value (§21) needs derived Values (Phase 4);
  Personality (§9) and Social (§18–19) need latent personality and belief models (Phase 3);
  Context needs a Context representation this build doesn't have. Rather than stub those terms at
  zero silently, `model/actions.ts` says so explicitly in comments — Phase 1's results should be
  read as "what Need-satisfaction learning alone produces," not as a claim that the other terms
  don't matter. Finding out whether they do is exactly what Phases 3–4 are for.
- **No associative graph, no memory system yet.** Candidate-Action generation is precondition-only
  (§22.1), not threshold-filtered by spreading-activation accessibility (§22.2), because that
  needs Phase 2's associative graph. `model/cycle.ts` numbers its steps against the brief's full
  20-step cycle (§25) and comments explicitly which steps (3, 4, 5, 14, 15, 16, 17) are skipped
  and why.
- **Fraction-free linear algebra is deferred.** The brief lists it under Phase 0's build list
  because spreading activation (§16) and the belief Kalman filter (§18) both need exact matrix
  solving. Nothing in Phase 1 does — Need-satisfaction learning is scalar arithmetic throughout —
  so it isn't built here. It's a real Phase-0 gap for Phase 2, not an oversight; see RESEARCH.md.
- **The default scenario's Need decay is tuned to avoid a ceiling artifact, not to flatter the
  result.** `model/scenario.ts` sets Connection's passive decay rate equal to Glen's outcome
  magnitude specifically so repeated visits don't run the Need level into the `[0,1]` clamp — see
  the comment there for the arithmetic. A smaller decay is worth trying from the UI; it surfaces a
  real (if secondary) phenomenon, satiation/ceiling effects, that the brief doesn't currently name
  as a research target.
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
