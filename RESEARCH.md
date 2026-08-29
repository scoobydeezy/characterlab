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

---

## Phase 2 — Associative Accessibility & Episodic Memory

**Status:** Complete for the scope described below (associative graph, spreading activation,
accessibility-filtered candidate generation, episodic memory with recency/frequency accessibility).
Not yet gated for Phase 3 by a second implementer/reviewer — this is a first pass, same caveat as
Phase 0+1's entry.

### Psychological findings

**Habit forms exactly as predicted, but saturates at half strength for a structural reason worth
generalizing.** Repeated evening visits to Glen (`experiments/habit.ts`) grow
`W[context.evening][action.visit_glen]` from 0 toward a stable value — but that value is **exactly
1/2**, not 1, and the row sum `Σ_j W[context.evening][j]` reaches exactly 1 (row-substochastic cap
engaged) after only two repetitions. The reason is structural, not a tuning artifact: every one of
these Experiences tags itself with the Context concept AND two other concepts at once — the Action
concept (`action.visit_glen`) and the Person concept (`person.glen`, the Action's `subject`) — so
Context's fixed row budget of 1 gets split, roughly evenly, between two competing edges rather than
concentrating entirely on one. Confirmed by direct probe: spreading activation from a Need-free,
Context-only base vector (`{context.evening: 1}`) reaches Glen's action concept at exactly **2/5**
(with β=1/2), while Priya's action concept stays at exactly **0** — zero leakage, confirming the
isolation from Need-satisfaction learning is clean. The generalizable finding: **the ceiling any
single learned association can reach is not just a function of η/λ_a tuning — it is capped by how
many OTHER concepts share the same co-activation event**, exactly mirroring Phase 1's Need-level
ceiling-saturation finding but for a different resource (row budget instead of a bounded scalar).
An Experience's "semantic footprint" (how many concepts `cycle.ts` tags it with) is therefore not a
free authoring choice — it directly determines the achievable strength of any pairwise association
born from it.

**Substitution is a negative result, exactly as the Phase 1 entry's next-phase justification
predicted it might be.** `experiments/substitution.ts` builds up Glen's Habit and NeedExpectation
through 8 repeated visits, then compares Priya's accessibility (her own action concept's spreading-
activation value) with Glen's world flag present vs. absent, using one shared activation vector for
both comparisons. The two values are **bit-for-bit identical** (`0/1` in both cases, since Priya
was never associated with anything in this run) — which must be true by construction, since
`solveActivation` has no world-flags parameter at all (Brief §16's formula is a pure function of
Needs, active Context, and the learned graph). What changes between "Glen available" and "Glen
unavailable" is only which Actions survive `ActionDef.preconditionHolds` — a mechanism Phase 1
already had, unchanged. **Reported per Brief §36 as DERIVED, not REQUIRES MECHANISM:** any
redirection toward a substitute when a habitual target becomes unavailable in this architecture
comes entirely from precondition filtering plus whatever NeedExpectation the substitute has
independently earned — spreading activation does not implement "reach for what's still available,"
and nothing in Brief §16 asked it to. This sharpens (rather than closes) Phase 1's own framing of
the Substitution experiment: "does associative proximity redirect preference before independent
experience exists" now has a concrete answer — no, not in this architecture, and the reason is
locatable in one line of `model/actions.ts` (`candidateActionsWithAccessibility`'s precondition
filter runs before, and independently of, its accessibility filter).

**Avoidance is DERIVED from Phase 1's NeedExpectation alone — no Inhibition primitive (§27)
needed — but only within a "clean" window before the same boundary-saturation phenomenon Phase 1
found recurs at the opposite boundary.** `experiments/avoidance.ts` forces repeated visits to Glen
under a reliably negative Rest outcome (−0.08, `scenario.ts`'s `aversiveOutcomeTable`) and evaluates
Pr(this action) against a neutral baseline after each repetition using nothing but
`evaluateAction`/`buildChoiceDistribution` (§23–24). For the first 5 repetitions — while Rest's
level stays off its `[0,1]` floor — μ holds exactly at the true effect (−0.08, unchanged across all
5 steps since every observed `r_n` matches it exactly), confidence rises monotonically from 0.40 to
0.78, and Pr(the aversive action) falls monotonically from 49.90% to 48.17%. Extending to 7
repetitions reproduces Phase 1's ceiling-saturation finding as a mirror-image floor artifact: once
Rest clamps to 0, the observed `r_n` collapses to 0 (nothing left to subtract), and μ is pulled back
toward 0 (−0.0637, then −0.0528) rather than staying at the true −0.08 — Pr(the aversive action)
correspondingly ticks back up (48.47%, then 48.69%). The general finding from Phase 1 — "any bounded
scalar Need combined with a fixed additive per-tick effect saturates under continuous stimulation" —
turns out to bind in BOTH directions, and a scenario author repurposing an existing Need for a new
experiment (as this one repurposes Rest, originally tuned only as Glen's minor side effect) has to
re-derive a clean repetition window rather than assume one; `aversiveOutcomeTable`'s magnitude and
the "5 repetitions" figure above are not arbitrary, they are the largest clean window this specific
Need/magnitude/passive-rate combination allows (documented in `scenario.ts`'s own comment).

**Episodic memory's recency, frequency, and decay formulas behave exactly as specified, verified by
hand.** `experiments/memoryAccessibility.ts` and `test/memory.test.ts` confirm `Base_m(t) =
Σ 1/(1+λ_m(t-r))^d_m` against hand-computed fractions at every step (e.g. two memories encoded one
tick apart have Base values of exactly `10/11` and `1/1` immediately afterward — recency alone,
despite identical retrieval-history length), that retrieval strictly increases a memory's later
Base relative to the same memory never having been retrieved again (`49/58` vs. `10/29` at a
matched future tick), and that `retrieveTopK`'s canonical tie-break and reinforcement side effect
touch only the selected memories, never the rest.

**What still did not appear, because it still is not built.** Obsession, grief, and rumination
(§28's remaining experiment list) still require Phase 3's belief/appraisal layer — see Next-phase
justification below; episodic memory alone can *record* an entity's disappearance but has no
mechanism for that disappearance to become psychologically meaningful (there is no "this matters
and it's gone" appraisal step, only an accessibility score).

### Mathematical findings

**Fraction-free linear algebra — identified as a genuine Phase-0 gap in the previous entry — is now
built and validated against the two obligations that actually matter.** `kernel/linalg.ts`
implements exact Gaussian elimination over auto-reduced `Rational`s (module comment explains why
this satisfies Brief §16's "fraction-free" requirement without literal Bareiss integer arithmetic)
with a fixed pivot rule (scan rows `k+1..n-1` in increasing index order) and a typed
`SingularMatrixError` naming the failing column. `test/linalg.test.ts` confirms both: every
hand-derived small system solves to the exact expected rationals, AND every solution independently
satisfies `A·x = b` exactly via `matVecMul` (§32's "prove it, don't assert it" standard) — including
a case that requires the documented row-swap.

**(I − βW) is strictly diagonally dominant in practice, not just "generically invertible" —
confirmed by stress test, not just by the algebraic argument in `model/activation.ts`'s module
comment.** `test/activation.test.ts` builds a densely cross-activated 6-concept graph through 15
real `updateAssociations` steps (the actual mutation path, not a hand-authored matrix), then calls
`solveActivation` against it for five different β values and six different seed concepts — 30 solves
total, zero `SingularMatrixError`s. This matters because it means the "activation uniqueness" proof
obligation (§32) is not merely satisfied in theory; it has never been observed to be *close* to
failing under any state this codebase can actually produce, which is the stronger and more useful
claim for a research tool.

**Quantization at commit means `solveActivation`'s stored result is close to, but not exactly, the
true linear-algebra solution — worth stating explicitly since it reads differently from Phase 1's
scalar quantization.** Every Phase-1 quantized value (a Need level, a μ) is quantized independently
at each step, so "the stored value is within `1/(2D)` of the exact computed value" was the whole
story. Here, `solveActivation` quantizes the *entries of a solved vector*, so
`(I - βW)·a_quantized = b` does NOT hold exactly in general — only `(I - βW)·a_exact = b` does, and
`a_quantized` is within the lattice bound of `a_exact` entry-by-entry (this distinction is what
`test/activation.test.ts`'s exactness test actually checks, after an initial draft of that test
wrongly assumed bit-exact closure and had to be corrected against the real contract). This has not
been stress-tested for compounding across many cycles the way Phase 1 flagged for scalar
quantization — same open item, now doubly relevant since Phase 2 quantizes both a matrix-solved
vector (activation) AND the association weights that matrix is built from, each cycle.

**Largest-remainder normalization (§15.1) produces an EXACT row sum of 1 on overflow, not merely a
sum close to 1** — verified directly (`test/associations.test.ts`) with a hand-picked overflow case
at a small integer scale (D=12) chosen so the remainder allocation is checkable by hand, and
separately stress-tested at the production scale (D=10⁶) across 25 repeated overflow-triggering
steps on a 5-concept universe with every concept co-activated every step (the adversarial case for
the row budget) — every row stayed within `[0,1]` and every weight stayed non-negative throughout.

### Architectural findings

**The decision to exclude Needs from Hebbian co-activation (documented in `associations.ts`, made
before this experiment suite existed) was load-bearing for Habit's experimental isolation, not just
a tidiness choice.** Had Needs co-activated alongside Actions/People/Context, the Habit experiment's
"Need-free, Context-only" activation probe would not exist as a clean isolation tool — Need urgency
would already be baked into the learned graph itself, and "how much of Glen's accessibility comes
from Habit vs. Need-satisfaction learning" would no longer be a question with a crisp answer. The
zero measured leakage to Priya in the substitution/habit experiments is the concrete evidence this
design choice is actually doing its job, not just a documented intention.

**Self-association exclusion (no `W_ii`) has no observed pathology and simply redirects the entire
row budget to inter-concept edges** — confirmed directly (`test/associations.test.ts`) rather than
just asserted; a concept activated alone still learns nothing on its own diagonal, exactly as
`associations.ts` intends.

**The "shared row budget" finding above generalizes into a concrete, previously-unasked Vivarium-
relevant design question: how many concepts should one Experience tag?** This build's `cycle.ts`
tags every ordinary Experience with the Action, its subject, its Location (if any), and every active
Context concept — a defensible but authored choice, not something Brief §14–15 pins down uniquely.
Habit's 1/2-not-1 ceiling is a direct, measurable consequence of that specific choice (three
concepts co-activate with Context here: the action, the person, and nothing else, since this
scenario has no Location tagged in the Habit run) — a different tagging policy (e.g., also tagging
the Need most urgent at the time, or omitting the subject when it's identical to the action's own
implied target) would produce a different, calculable ceiling. This is now a parameterizable,
testable question rather than an implicit one.

**The NeedId/ConceptKey unification tension flagged in the Phase 1 entry was deliberately deferred,
not resolved, and that deferral has a visible cost.** `asConceptKey` (Brief §13-shape-compatible
re-branding, `kernel/canonical.ts`) lets a `NeedId` or `CanonicalActionKey` participate as a graph
node without a real type unification — cheap to build, and sufficient for everything Phase 2 needed
(Needs seed the activation base vector; Actions are graph nodes for accessibility). The visible
cost: there is no reverse lookup from a bare `ConceptKey` back to "this was originally a NeedDef, so
here is its `setPoint`/`coreImportance`" — every call site that needs both a concept's graph
identity and its Phase-1-specific fields (e.g. `buildBaseActivation` in `cycle.ts`) has to be handed
both representations separately by its caller, rather than being able to look one up from the
other. This has not yet caused a real problem because nothing in Phase 2 needed that reverse lookup,
but Phase 3's belief/appraisal layer (§18–19, which reasons about *people* as concepts with
attached Value/appraisal state) looks likely to want exactly this kind of "get the rich object behind
this graph node" operation, which the current re-branding approach does not provide for free.

### Vivarium comparison

**Does Vivarium's "is this available" (world/precondition state) and "is this on my mind"
(relevance/salience) already live in separate mechanisms, the way this build's precondition filter
and accessibility filter do?** The Substitution negative result only holds *because* those two
checks are structurally independent here — accessibility literally cannot see world flags. If
Vivarium's existing relevance or interest-scoring system reads from the same state as its
availability checks (e.g., an NPC that's "unavailable" is also demoted in relevance scoring by the
same code path), that conflation could be silently producing behavior that looks like associative
substitution but is actually indistinguishable, in Vivarium's own architecture, from precondition
filtering — exactly the ambiguity this build's clean separation was built to resolve. Worth checking
by inspection of Vivarium's actual code before Phase 3, the same way Phase 1's entry recommended
checking NeedExpectation's (mean, precision) split against Vivarium's preference representation.

**Does Vivarium tag an in-game event with an explicit, bounded set of "concepts it involved," and if
so, has anyone measured whether that tagging policy caps how strong any single learned association
between two entities can become?** The shared-row-budget finding above is a concrete, checkable
question for Vivarium's own event/memory tagging: an event tagged with many participants/objects
will, under any row-substochastic-style association rule, produce weaker pairwise learning per
participant than a narrowly-tagged event — which may or may not match designer intuition about how
strongly two entities that were "both there" should end up associated.

### Next-phase justification

Phase 2 was justified (per the Phase 1 entry) by one narrow, sharp question: can associative
proximity alone drive substitution before independent experience exists? The answer, now
established, is no — not in this architecture, not without a mechanism this build deliberately
doesn't have. That answer sharpens rather than removes the case for Phase 3: obsession, grief, and
rumination remain untested, and unlike Substitution, none of them reduce to "well, Phase 1 already
covered this." Grief specifically needs an entity's absence to become *appraised as significant*,
not merely recorded — episodic memory (§17, built here) supplies the recording (a memory of Glen
persists, decaying in accessibility, after Glen stops appearing in any Experience), but nothing in
this build's Score(a) or choice mechanics reacts differently to "an entity I valued is now gone"
versus "an entity I never met." That reaction requires Phase 3's belief/appraisal layer (§18–19) —
specifically, some representation of *how much this entity mattered* that can be checked against
*current absence* to produce a distinguishable state. Obsession and rumination look similarly
Phase-3-shaped: both plausibly require something like a belief that keeps getting re-appraised
rather than settling, which (μ, τ) alone does not represent (τ only grows toward certainty, it
never captures "I keep coming back to this without resolution"). The concrete Phase 3 build item
this creates, mirroring how Phase 1's entry identified fraction-free linear algebra as Phase 2's
prerequisite: Phase 3 cannot start with "add belief revision" as its first line of work either — it
needs a representation of *appraisal* (how much something matters, separable from whether it's
currently true) validated on its own before grief or obsession can be tested against it.

### Three-part output (Brief §36) for the combined Habit/Substitution/Avoidance findings

**Psychological finding.** Associative accessibility, modeled as nothing more than Hebbian
co-activation with atrophy and a row-substochastic budget, is sufficient to produce habit-like
behavior (a repeatedly co-occurring Context cue makes a target action reachable through the graph
alone, with zero Need-urgency contribution) — but is NOT sufficient, and was never claimed to be
sufficient, for substitution driven purely by associative proximity: that remains fully explained by
mechanisms Phase 1 already had (precondition filtering, independent NeedExpectation). Avoidance,
likewise, requires no new Phase 2 (or Phase 1-era Inhibition, §27) primitive — declining preference
for a repeatedly punishing action falls directly out of NeedExpectation's existing math, within the
same boundary conditions (Need level must stay off its floor/ceiling) that Phase 1 already
identified as load-bearing.

**Computational finding.** A row-substochastic association matrix under Hebbian learning has an
achievable per-edge ceiling determined jointly by the learning-rate/atrophy-rate ratio (η vs. λ_a,
authored) AND by how many other concepts share the same co-activation event (structural, a function
of how Experiences are tagged) — the two factors are not interchangeable, and this build's default
scenario demonstrates a case (1/2, not 1) where the structural factor dominates. Separately: solving
`(I - βW)a = b` exactly and THEN quantizing at commit is a meaningfully different exactness contract
than quantizing every step of a scalar computation — proof obligations written for one do not
automatically transfer to the other, as this codebase's own first-draft test (later corrected)
demonstrates.

**Architectural implication.** A production model wanting both Habit-like accessibility effects and
Substitution behavior should not expect the accessibility mechanism to produce Substitution as a
side effect — they answer different questions ("what's on my mind" vs. "what's available and
learned-good") and, per the Vivarium-comparison question above, keeping them structurally separate
(rather than letting availability influence a relevance/accessibility score directly) is what makes
each mechanism's contribution to observed behavior stay individually falsifiable. Separately: any
system authoring "how many things did this event involve" as a tagging policy is implicitly also
authoring a ceiling on how strong any resulting pairwise association can become, whether or not that
consequence is intended — this is a concrete design lever, not an incidental implementation detail,
and worth exposing to Vivarium's own designers rather than leaving implicit in tagging code.
