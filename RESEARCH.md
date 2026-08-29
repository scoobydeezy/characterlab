# CharacterLab Research Log

Format follows Brief §34 (Phase-End Research Gate) and §36 (Research Output Format). One entry per
completed phase. Update this file at the end of each phase rather than starting a new document —
the brief's own stopping condition (§35) is a classification exercise across phases, and that only
works if findings accumulate in one place.

---

## Phase 0 + Phase 1 — Mathematical Kernel & Need-Satisfaction Learning

**Status:** Complete for the scope described below. Not yet gated for Phase 2 by a second
implementer/reviewer — this is a first pass.

### Psychological findings

**What appeared.** Repeated scripted Connection-satisfying Experiences with one subject (Glen)
produce a clean, monotonically-strengthening preference: learned expectation μ rises from its 0
prior toward the authored true effect magnitude, confidence C rises from 0 toward 1, and — when
Mina is allowed to choose autonomously instead of being scripted — her choice probability shifts
toward Glen accordingly, purely as a consequence of the Need term in Score(a) (§23). No attachment,
preference, or "relationship" primitive was authored anywhere; it is entirely downstream of
`NeedExpectation` accumulating evidence. This is a real, if narrow, positive result for the
brief's central hypothesis (§1): at least one candidate derived phenomenon (preferential attachment
to a reliable satisfier) reproduces from Need-satisfaction learning alone, with no additional
machinery.

**The paired counterfactual (§29) works as a falsification tool, immediately.** Running the
identical initial state, seed, and timing against Priya instead of Glen — same authored magnitude
gap (0.40 vs. 0.15) — produces a clearly traceable divergence in both learned μ and realized Need
level, visible step-by-step in `experiments/counterfactual.ts`'s comparison table. This is useful
less for what it shows here (the divergence is by construction, since the two Actions have
different authored magnitudes) and more as a validation that the counterfactual harness itself is
sound: the *only* code-level difference between Timeline A and Timeline B is which `ActionDef`
gets forced each step, and the RNG addressing (§7) confirms the noise draws are identical across
timelines (same `eventId`/`purposeId` sequence), so any observed difference is attributable to the
authored effect difference and nothing else. This harness is reusable for the brief's harder
counterfactual claims in Phase 2+ (attachment, substitution, avoidance) where the *outcome*, not
just the setup, is genuinely uncertain in advance.

**A ceiling artifact appeared and was caught by testing, not by inspection.** The first version of
the default scenario (Connection decay −0.05/tick, Glen's effect magnitude +0.40/tick) produced a
final learned μ around 0.07 instead of anywhere near the authored 0.40 — not because the learning
math was wrong, but because repeated visits drove the Need level into its `[0,1]` ceiling clamp
(§10) within ~2 ticks, after which the *actually observed* `r_n` (the post-clamp delta) collapsed
to roughly the decay amount, not the authored magnitude. `NeedExpectation` faithfully learned "the
effect I actually observe," which was the clamp artifact, not the intended effect. This is
documented in `model/scenario.ts` and fixed by setting decay equal to the effect magnitude so the
Need resets below the ceiling before each repetition. The finding worth carrying forward: **any
bounded scalar Need combined with a fixed additive per-tick effect will saturate under continuous
stimulation, regardless of the effect's "true" size**, and the character's learning process cannot
distinguish "the effect is small" from "the effect is being clipped." Brief §26–27 (acquired Needs,
dependence) will need to treat this deliberately — satiation-driven ceiling effects are a
candidate mechanism for something like tolerance, but only if introduced on purpose rather than
discovered as a side effect of scenario tuning, as happened here.

**What did not appear, because it was not built.** Substitution, habit, avoidance, obsession,
grief, and rumination (§28's remaining experiment list) are Phase 2+ phenomena requiring the
associative graph and episodic memory; Value formation/revision needs Phase 4; craving/addiction
needs Phase 5's acquired Needs. None of these were tested and none should be read as "derived" or
"requires mechanism" yet — Phase 0+1's classification contribution to §35's stopping condition is
limited to Need-satisfaction learning itself (see Architectural findings below).

### Mathematical findings

**Load-bearing.** The precision-weighted update (§12) and its prediction-error-form equivalence
(`μ' = μ + α(r − μ)`, §32) held exactly under direct algebraic test
(`src/test/expectation.test.ts`), not just approximately — the two forms are the same computation
restated, so this was expected, but confirming it in exact rational arithmetic (rather than floats,
where rounding could mask a real discrepancy) is worth having as a permanent regression test before
Phase 3 adds a second, structurally different update rule (the belief Kalman filter, §18) that
should NOT reduce to this one.

**The quantization bound is tight and matters at small D.** `|Q_D(x) - x| ≤ 1/(2D)` held on every
sampled value, as it must by construction — RoundEven is a correct nearest-integer operation.
What's more interesting: at `D = 10^6` (this build's lattice scale, `kernel/lattice.ts`) the bound
is 5×10⁻⁷ per quantization, comfortably below anything a Need level or expectation needs to
distinguish for this scenario's magnitudes. This has not been stress-tested against many
compounded quantizations (e.g., a value quantized every tick for thousands of ticks) — that's a
concrete, cheap thing to check before Phase 2's association-weight normalization (§15.1), which
quantizes far more often per cycle.

**The counter-addressed random oracle's independence property held under direct adversarial
test**, not just by construction-argument: `random.test.ts` draws 50 "unrelated" addresses between
two draws at a fixed address and confirms the fixed-address draw is unaffected. This is the
concrete evidence behind §7's claim ("an unrelated random event therefore cannot shift later random
results") rather than a restatement of the design intent.

**Redundant, so far: nothing.** Every kernel primitive built (exact rationals, the lattice,
canonical ordering, the event/trace model, the random oracle) is exercised by Phase 1's actual
learning loop — none of it is speculative infrastructure sitting unused. The one deliberately
*not*-built Phase-0 item — fraction-free linear algebra — is not "redundant," it's "not yet needed"
(see Architectural findings).

**Nothing observed as unstable or pathological** in Phase 1's own math. The one instability-shaped
finding is the ceiling-saturation behavior above, which is a property of the Need model (§10)
interacting with a scenario's authored constants, not an implementation bug — it will recur with
any future scenario whose action-effect magnitude exceeds its Need's passive decay, and should
probably become an authored/tested scenario-validity check rather than something each new scenario
has to discover by hand.

### Architectural findings

**A smaller representation is not yet indicated — Phase 1's representation is already close to
minimal for what it demonstrates.** `NeedExpectation(subject, need)` — a (μ, τ) pair — is the only
piece of learned state Phase 1 needed to reproduce preferential attachment to a reliable satisfier.
There is no redundant state to strip yet, because there is no second mechanism in this build
competing to explain the same behavior. The first real test of "can something smaller reproduce
this" arrives in Phase 6 (distillation) once Phase 2's associative-accessibility machinery exists
alongside NeedExpectation — the brief's own example finding ("NeedExpectation alone preserves 82%
of target behavior... + bounded accessibility preserves 96%") is structurally exactly this kind of
comparison, and it cannot be run with only one mechanism in play.

**Fraction-free linear algebra is a genuine, identified Phase-0 gap, not scope creep to defer
casually.** It's on the brief's Phase 0 build list because spreading activation (§16,
`(I - βW)⁻¹b`) and the belief Kalman filter (§18) both need exact matrix solving with a fixed pivot
rule and defined singularity behavior. Phase 1 has zero matrix operations, so building it now would
be unvalidated code with no test pressure on it. The concrete next-phase task this creates: Phase 2
cannot start with "add the associative graph" as its first line of work — it needs fraction-free
linear algebra *validated on its own* (determinism, canonical pivot/row order, a defined
singularity behavior) before spreading activation can be built on top of it, exactly the same way
Phase 0's random oracle was validated before Phase 1 used it for action selection.

**Concept categories genuinely used vs. declared-for-later are now visible.** `model/types.ts`
declares the full `ConceptCategory` union from Brief §13 but Phase 1 only instantiates `Person` and
one placeholder `Activity` (`activity.stay_home`) as `ExpectationSubject`s. `Need` is modeled
separately (not as a graph concept) because nothing in Phase 1 needs a Need to *be* a concept node
— that requirement only arrives with the associative graph in Phase 2, where Needs, People, and
Activities all need to sit in the same graph to spread activation between them. Worth flagging now,
before Phase 2 architecture is fixed: whether `NeedId` and `ConceptKey` should actually be unified
into one identifier space once the graph exists, since Phase 2 is exactly where the current
separation (Needs have `NeedId`, everything else has `ConceptKey`) would start to create friction
(a Need needs a `ConceptKey` to be a graph node, but also needs its Phase-1 `NeedDef` fields, which
nothing else in the graph has).

### Vivarium comparison

No comparison run yet — the CharacterLab↔Vivarium comparison harness (§20, §31) is explicitly
Phase 3 scope (it needs belief/appraisal to exist on both sides). Phase 1's own contribution to
that eventual comparison is narrower and available now: **does Vivarium already represent
something like NeedExpectation(subject, need) as (mean, precision)?** If Vivarium's existing social
or preference model uses a single scalar (no separate confidence/precision term), Phase 1's
finding that "confidence and expectation are different quantities, and that difference is what
produces attachment resisting isolated contradictory evidence" (the reinforced-vs-fresh resistance
property directly tested in `expectation.test.ts`) is a concrete, checkable question to ask against
Vivarium's actual data model: does a single-scalar preference representation reproduce that
resistance-to-isolated-contradiction property, or does it require the split? That's answerable by
inspection of Vivarium's code, without needing the full Phase 3 harness, and would be worth doing
before Phase 3 rather than waiting for it.

### Next-phase justification

Phase 1 cannot show substitution, habit, avoidance, obsession, or grief — every one of Brief §28's
remaining experiments beyond learned satisfaction and the Glen/Priya counterfactual needs either
the associative graph (habit, substitution as *spreading* preference rather than *only* learned
expectation) or episodic memory (grief needs something whose absence can be noticed and mourned,
which a (μ, τ) pair alone does not represent — there is no record of Glen as an entity Mina
"remembers," only an accumulated expectation that would simply decay if unobserved). Phase 2 is
justified by a specific unresolved behavior, not because associative graphs sound like the next
interesting feature: **Phase 1's `evaluateAction` cannot express "Priya becomes accessible as a
substitute because she's mentally associated with the same context Glen used to satisfy" — it can
only express "Priya has her own independently-learned expectation."** Brief §28's own Substitution
experiment description ("Glen becomes unavailable; Priya should not initially act as a perfect
substitute but may become one through successful experience") is actually already representable in
Phase 1 exactly as written (Priya's own NeedExpectation grows through her own successful
Experiences) — so the sharper Phase 2 question is narrower than "build substitution": it's whether
substitution *driven by associative proximity* (before Priya has any successful Experience of her
own) is a real phenomenon Vivarium needs, which Phase 1 cannot test at all, and which is exactly
what spreading activation would add.

### Three-part output (Brief §36) for the primary experiment

**Psychological finding.** Repeated Need-satisfying Experience with one subject, modeled as nothing
more than a precision-weighted expectation update, is sufficient to produce preferential
attachment-like behavior (higher learned effect, higher confidence, higher choice probability)
toward that subject over a weaker alternative — without an attachment primitive, a relationship
primitive, or any state beyond (μ, τ) per (subject, Need) pair.

**Computational finding.** The precision-weighted update is exactly algebraically equivalent to a
prediction-error learning rule (`μ' = μ + α(r − μ)`, confirmed by direct exact-arithmetic test, not
approximation) with `α = ρ/(τ⁻ + ρ)` — meaning the "resistance to isolated contradictory evidence"
property the brief predicts for high-confidence beliefs (§12) falls out of the accumulated-precision
term shrinking α, not from any separate inertia mechanism. Separately: a bounded `[0,1]` Need level
combined with a fixed per-tick additive effect saturates under continuous stimulation regardless of
the effect's authored size, which silently corrupts the *observed* learning signal if not accounted
for in scenario design.

**Architectural implication.** A production model computing something like "does X reliably satisfy
Need N" likely needs (mean, precision) — not a single scalar — specifically to get
resistance-to-isolated-contradiction "for free" from precision-weighting, rather than needing a
hand-authored inertia/decay term bolted onto a single scalar. Whether it *also* needs an
associative-accessibility term (Phase 2) to explain substitution and habit is exactly the open
question Phase 2 exists to answer, and Phase 1's harness (the counterfactual runner, the
determinism-replay check, the trace log) is reusable as-is for that comparison once Phase 2 lands.
