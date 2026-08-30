# CharacterLab Research Log

Format follows Brief §34 (Phase-End Research Gate) and §36 (Research Output Format). One entry per
completed phase. Update this file at the end of each phase rather than starting a new document —
the brief's own stopping condition (§35) is a classification exercise across phases, and that only
works if findings accumulate in one place.

**Standing methodological correction (added after Phase 2.5a review):** earlier entries in this log
occasionally ask "is this common enough in Vivarium's actual play patterns to be worth resolving" —
that framing is backwards and is retired as of this correction. CharacterLab's job is to discover
the epistemically/architecturally correct model on its own terms; whether Vivarium's current tuning
happens to exercise a given regime is a separate, later, production-cost question that never gates
whether CharacterLab resolves the underlying question. A Vivarium-comparison question should ask
"what does Vivarium's architecture actually do here, and what would it need to preserve this
finding" — never "is this worth fixing given how Vivarium happens to be tuned today." See Phase
2.5a's Correction section for the concrete case that surfaced this.

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

---

## Phase 2.5a — Saturated Satisfaction & Censored Learning

**Status: RESOLVED — see "Correction 2" near the end of this entry.** The Capacity/Applied/Overflow
decomposition and the dual-mode compatibility strategy were solid from the start and are kept
unchanged. The one-sided censored-evidence update rule below was originally a useful *baseline* that
falsifies naive point-learning from clipped deltas, but external review (recorded in the Correction
section immediately below) found it was not the right final model: it grew confidence from
observations that carried no discriminating information, which likely explained why its
counterfactual result stalled well short of the true effect. That open question — deferred at the
time, pending Phase 2.5b/2.5c — is resolved in Correction 2: `updateExpectation`'s gating logic was
the bug, not the `(μ, τ)` representation itself, and the fix is validated against the four cases
Correction point 6 specified plus real updated counterfactual numbers. Not yet gated by a second
implementer/reviewer, same caveat as every prior entry.

This phase originates from a collaborator-authored follow-up brief responding directly to two
findings already on record above: Phase 1's Connection ceiling artifact and Phase 2's Avoidance
floor artifact are the same phenomenon at both boundaries of a bounded scalar Need, and this phase
asks whether a learning rule can be built that does not fall into it.

### Correction (post-implementation review, before Phase 2.5b)

The findings below were written immediately after implementation and are kept as originally
recorded (CharacterLab's convention: correct forward, don't quietly rewrite history — see the
avoidance-experiment redesign in the Phase 2 entry for the precedent). A review of this entry before
starting Phase 2.5b identified a real problem with the censored-update rule as built, deeper than
the "17% divergence reduction, not a full fix" framing originally given it credit for.

1. **Growing precision (τ) on every observation — accepted or rejected — is not epistemically
   justified, and this is a bug, not a rounding error.** Consider Mina with an established belief
   μ≈0.40 who then experiences a saturated Experience where only Applied=+0.10 lands. The rule as
   built keeps μ at 0.40 (correct — it must not slide the wrong way) but still grows τ as if this
   were ordinary evidence *for* 0.40. It is not: the observation says only "the effect was at least
   +0.10," which is equally consistent with a true effect of +0.42 or +0.90. Nothing about this
   observation discriminates in favor of 0.40 specifically, so confidence in 0.40 should not rise
   from it. The failure is starker at the extreme: if μ=0 and the Need is already at its ceiling
   (Applied=0, fully saturated), the observation carries essentially **zero** magnitude information
   — yet the rule as built raises τ anyway, mechanically becoming *more confident in zero* from an
   observation that says nothing about the true effect at all. That is backwards.

2. **This is almost certainly why the counterfactual's censored Timeline B stalled at μ≈0.22
   instead of climbing further toward the true ~0.42 effect.** One genuine unclipped observation
   established μ≈0.22; the five subsequent censored (rejected) observations then piled precision
   onto that estimate without contradicting OR supporting it — cementing a weak estimate rather than
   correctly reflecting that confidence in it should not have grown from evidence that never tested
   it. The 17% divergence reduction reported below is real, but it is very likely an understatement
   of what a correctly-specified censored model would achieve, not evidence that censoring itself has
   limited power.

3. **Retracted: do not build the "magnitude-aware, uses Overflow's size" update this entry
   originally floated as the natural next step (see the struck text in Next-phase justification
   below).** `Overflow` is a simulator-omniscient quantity — the authored ground-truth effect minus
   what actually landed — not necessarily something the character's Experience gives her access to.
   From Need-state movement alone, Mina can observe only "the effect was at least Applied"; she
   cannot distinguish a true effect of +0.11 from +0.42 from +0.90, since all three would saturate
   her identically. Feeding Overflow's magnitude into `NeedExpectation`'s update would leak
   authored world-truth across the Experience boundary Brief §11 establishes ("no subsystem gets a
   private interpretation of what happened" cuts both ways — it also means no subsystem gets
   information beyond what the Experience actually contains). Overflow remains fully valid to trace,
   and may be legitimate input to a future, explicitly-justified perceptual mechanism if one is ever
   built and demonstrated to be something the character can actually access — but not as direct
   learning evidence, absent that demonstration.

4. **The success criterion this entry originally used was itself wrong, and is now corrected.**
   "Does censored learning converge close to the true effect even when most observations are
   clipped" asks for something information-theoretically impossible: a sequence of observations
   reading "effect ≥ 0.10," "effect ≥ 0.08," "effect ≥ 0.05" is equally consistent with a true effect
   of 0.15, 0.42, or 0.90, and no learning rule — censored or otherwise — can resolve that ambiguity
   from this evidence alone without smuggling in information the character doesn't have. Remaining
   uncertain in that situation is *correct* inference, not a shortfall. **The corrected criterion:**
   does the model retain exactly the uncertainty warranted by the evidence it actually received,
   without mistaking "this observation was clipped" for "the effect is weak"? Under this criterion,
   the built rule still fails (point 1 above), even though it already succeeds on the narrower
   "never slide μ the wrong way" criterion this entry originally credited it for.

5. **Open research question, deferred to a return visit after Phase 2.5b:** is `(μ, τ)` a
   sufficient representation for both point evidence ("effect ≈ x") and one-sided evidence
   ("effect ≥ x" / "effect ≤ x"), or does `NeedExpectation` need a representation that keeps
   confidence-in-a-point-estimate and confidence-in-an-inequality-constraint as distinct quantities —
   something in the shape of a `Mean`/`PointPrecision` pair plus separate accumulated
   `LowerBoundEvidence`/`UpperBoundEvidence` state, or another representation entirely? This is not
   pre-decided; it is now the concrete research question Phase 2.5a leaves open. The finding worth
   carrying forward regardless of which representation wins: **what happened** (the realized effect),
   **what could be observed** (Applied, bounded by the Need's capacity), and **what that observation
   logically permits the character to believe** (a point estimate vs. an inequality constraint) are
   three separable things, and the original `(μ, τ)` update conflated the second and third.

6. **Four validation cases to run before this question is considered resolved** (specified now,
   deliberately not yet run — this phase does not stop to rebuild the rule; see Next-phase
   justification):
   - **Case A — established belief, weak lower bound.** High-precision μ=0.40, then one new
     observation "effect ≥ 0.10." Expected: must not materially raise confidence in 0.40 — it fails
     to contradict the belief, it does not reinforce it.
   - **Case B — belief inconsistent with the bound.** μ=0.05, then "effect ≥ 0.10." Expected: the
     model MUST update — the current belief is logically inconsistent with the observation (this
     case should already pass under the built rule's accept branch; worth confirming directly rather
     than assuming).
   - **Case C — zero-information saturation.** Need already at its ceiling, Applied=0 ("effect ≥ 0,"
     true of every non-negative real number). Expected: essentially no change in confidence about
     the efficacy estimate. The built rule currently fails this case (see point 1) and raises τ
     regardless.
   - **Case D — genuine evidence after a long censored history.** Many "effect ≥ 0.10"-style
     observations, then one genuine unclipped "effect = 0.42." Expected: the accumulated (and, per
     point 1, currently unjustified) precision from the censored run must not artificially suppress
     how much this new genuine observation moves the belief.

### Psychological findings

**A single fresh-prior observation makes censoring provably a no-op — and that null result is
itself the finding that motivates the counterfactual design.** Sweeping `ACTION_VISIT_GLEN`'s
existing +0.40 Connection effect against five starting Need levels (0.10 → 1.00), naive and censored
learningMode produce **bit-for-bit identical** μ, confidence, Applied, and Overflow at every single
level (`experiments/saturatedSatisfaction.ts`, `test/phase2_5Saturation.test.ts`). The reason is
structural, not a bug: a brand-new `NeedExpectation` starts at μ=0, and every Applied value this
satisfier can produce is non-negative, so the naive candidate is always ≥ the fresh prior and the
one-sided rule's "reject only a decrease" condition never fires. **Censoring has nothing to protect
until a real expectation has already been established from prior evidence** — a distinction the
sweep alone cannot demonstrate and the counterfactual below was specifically designed to isolate.
Separately, the sweep reproduces Phase 1/Phase 2's boundary-saturation finding a third time, now
through the named Capacity/Applied/Overflow decomposition rather than an inferred μ shift: Applied
falls from 0.4204 (Level 0.10, unsaturated) to 0.3000 (Level 0.70) to 0.1000 (Level 0.90) to exactly
0.0000 (Level 1.00, zero headroom) — Overflow rising in exact lockstep (0 → 0.1205 → 0.3205 →
0.4204) — confirming `applyBoundedEffect`'s identity `Applied + Overflow = effect` holds on real
outcome-table data, not just hand-picked test cases.

**Once a real prior exists, censoring measurably narrows — but does not eliminate — a naive
learning rule's exposure-timing artifact (Brief §22).** The required counterfactual
(`experiments/saturationCounterfactual.ts`) runs the identical satisfier through two timelines that
share the exact same true effect: Timeline A always visits while Connection is comfortably
unsaturated; Timeline B is MOSTLY near the ceiling (5 of 6 repetitions clip) with one deliberate
unsaturated dip, so genuine information about the true effect exists in both timelines but is rare
in B. Naive converges to μ≈0.3999 in Timeline A (correctly tracking the true ~0.42 effect) but only
μ≈0.1855 in Timeline B — a **naiveDivergence of 0.2145** purely attributable to when the satisfier
happened to be tried, exactly the failure mode Brief §27 names. Censored narrows this to
**0.1780** (`censoredDivergence`, about 17% smaller) by refusing to let the five clipped
observations pull μ down from the level the one genuine observation established. This is a real,
reproducible improvement, but it is **partial, not a fix**: censored Timeline B still converges to
μ≈0.2219, well below the true ~0.42 — the rule can only *protect* an already-good belief from
erosion by systematically-clipped evidence, it cannot *recover* the true effect's magnitude from
Overflow alone, since the update rule only ever compares the naive candidate's *direction* against
the current prior, never uses the clipped observation's *size* as a lower-bound magnitude in its own
right. Reported honestly rather than rounded up: this is a meaningful but incomplete answer to
Brief §22's question.

### Mathematical findings

**The Capacity/Applied/Overflow decomposition is an exact algebraic identity, not an approximation,
confirmed against both hand-picked and real outcome-table cases.** `applyBoundedEffect`
(`model/needs.ts`) computes `Applied = Clamp(effect, -L, 1-L)` and `Overflow = effect - Applied`
directly from exact-rational inputs already on the D=10⁶ lattice, so `Applied + Overflow === effect`
holds bit-for-bit (`test/needs.test.ts`), and the quantized `after` Level this produces is
identical, cycle-for-cycle, to the inline clamp `cycle.ts` used before this phase — confirmed by the
full 76-test pre-2.5 suite passing unchanged.

**The one-sided censored update rule is monotonic, deterministic, and needs no transcendental
math** — deliberately, since a textbook truncated-Gaussian treatment of censored evidence needs the
normal CDF, incompatible with the exact-rational-arithmetic contract (Brief §3.1). The rule
(`model/expectation.ts::updateExpectation`, new `evidenceKind` parameter) computes the ordinary
precision-weighted candidate first, then accepts or rejects only the *mean* change based on its
*direction* relative to the current prior — precision (τ) always grows by the same amount
regardless of acceptance, since a real observation, even a rejected one, still adds confidence that
the truth is at least what was already believed. **Retracted — see the Correction section above
(point 1): this is exactly the epistemically wrong step.** τ growing regardless of whether the
observation discriminated among hypotheses is not a harmless simplification; it is measurably why
the counterfactual result below undershoots. This is a deliberate, named simplification (documented
in `expectation.ts`'s module comment, same spirit as `associations.ts`'s self-association-exclusion
note) rather than a claimed "correct Bayesian censored update" — and the counterfactual finding
above is direct evidence of exactly where the simplification's power ends: it is a one-bit
accept/reject decision, not a magnitude-aware one, AND it grows confidence on evidence that may
carry no magnitude information at all.

### Architectural findings

**Dual-mode compatibility held exactly as designed: every one of the 76 pre-2.5 tests passed
unchanged, with zero adjustment, because every new parameter defaults to today's exact behavior.**
`updateExpectation`'s new `evidenceKind` parameter defaults to `'point'`; `CycleParams.saturation`
defaults to `{learningMode: 'naive', kappa: 1/2}`; `'naive'` mode's expectation update is
byte-for-byte the pre-2.5 computation (`applyBoundedEffect`'s `Applied` is algebraically identical
to the old inline clamp's delta). This is the load-bearing property that let 15 new tests be added
without touching a single pre-existing assertion — the same "opt-in, default-legacy" pattern this
brief's Phase 2.5 request specifically asked for, now validated rather than assumed.

**Experienced Reward (`Applied + κ·Overflow`) is wired as trace-only, exactly as instructed, and
this phase deliberately does not classify it as necessary.** Every cycle now traces Applied,
Overflow, `saturated`, and Reward for every Need effect (`cycle.ts`'s new `saturation_analysis` step
and `CycleResult.saturationAnalysis`), visible live in the new `SaturationPanel`, but Reward is never
added to Need state, Score(a), or any learning update. No experiment in this phase tests whether
Reward changes any observable behavior, so — per the brief's explicit caution against assuming
Model C's necessity — it is classified **DEFERRED**, not DERIVED or REQUIRES MECHANISM: the question
"does a character need something like Experienced Reward to explain any behavior CharacterLab can't
already explain" remains genuinely open, not quietly answered by giving it a slider and a trace
column.

### Vivarium comparison

**Does Vivarium's stat/need system separate "what happened" from "what the character believes a
satisfier does," or does it — like this codebase before Phase 2.5a — implicitly conflate them via a
shared clamp?** Phase 1 and Phase 2's ceiling/floor artifacts and this phase's Timeline-B finding are
all one underlying bug pattern: any system that learns from a bounded stat's *observed* delta rather
than the *interaction's* true effect will silently mis-learn whenever the stat is near a boundary
when the interaction happens. If Vivarium's own preference/relationship learning (if any) reads
directly from a clamped stat delta the same way this codebase's pre-2.5a `NeedExpectation` did, it
likely has an undetected version of exactly this artifact — worth checking directly, the same way
prior entries recommended checking NeedExpectation's representation and the precondition/
accessibility separation against Vivarium's actual code.

**Struck (see the standing methodological correction at the top of this file):** this entry
originally asked whether "mostly, not always" saturating exposure is common enough in Vivarium's
actual play patterns to make resolving this worth it, and suggested checking real playtraces before
treating censored learning as "worth porting." That question is retired — it gates CharacterLab's
own research on Vivarium's current tuning, exactly backwards from this project's purpose.
CharacterLab's job is to resolve what the epistemically correct learning model is when a bounded
Need creates censored observations, on its own terms; only once that model exists does it become
Vivarium's question whether its own architecture needs to change to support it, and separately, a
production-cost question whether that's worth doing given how often the regime actually occurs. The
question worth asking instead: **once CharacterLab has a validated censored-evidence representation,
what would Vivarium's Need/stat system need to expose (e.g., a way to represent "at least X" belief
state, distinct from a point estimate) to host it?** — a question about what the architecture must
provide, not whether the problem is worth having an architecture for.

### Next-phase justification

**Struck:** this entry originally proposed a "magnitude-aware" censored update using Overflow's
size as the natural next step. That is retracted — see Correction point 3: Overflow is not
established to be something the character can perceive, and using it directly would leak authored
world-truth across the Experience boundary. It is not the next step.

The actual next step for saturated-satisfaction research is the representation question Correction
point 5 leaves open — whether `(μ, τ)` can correctly host both point and one-sided evidence, or
whether inequality evidence needs its own accumulator distinct from point-estimate confidence —
validated against the four cases in Correction point 6. This is deliberately **not** undertaken
immediately: Phase 2.5b (Semantic Salience) is a largely independent problem from the same brief and
proceeds first, per the brief's own sequencing and the "answer one well-scoped question at a time"
discipline this log has followed since Phase 0. Phase 2.5a is explicitly left PARTIAL rather than
closed, and is revisited after Phase 2.5b ships with its own real traced numbers.

**Resolved in Correction 2 (near the end of this entry), after Phase 2.5b/2.5c shipped:** the answer
turned out to be "yes, `(μ, τ)` is sufficient for the censored-evidence behaviors tested so far" — see
that section for the fix, the validation numbers, and the one deliberately-still-open simplification
(the accepted-bound branch's precision crediting) that phrasing is careful not to paper over.

### Three-part output (Brief §36) for the Saturated Satisfaction / Censored Learning findings

*(Revised per the Correction section above — the original version of this section credited the
built rule with more than it earned; this version reflects the corrected understanding.)*

**Psychological finding.** What happened (a satisfier's true effect), what could be observed (the
Need's Applied delta, bounded by its remaining capacity), and what that observation logically
permits a character to believe (a point estimate vs. a mere inequality constraint) are three
separable things that a naive learning rule collapses into one — and, this phase discovered, an
under-specified "censored" rule can still collapse two of them even while correctly handling the
third: refusing to let μ slide the wrong way (handled) is a different, weaker property than
correctly declining to grow confidence in an estimate the evidence never actually tested (not yet
handled). A character reasoning correctly under saturation should end up MORE uncertain, not falsely
more confident, when most of its evidence about a satisfier is boundary-clipped — remaining
appropriately uncertain is the correct outcome, not a failure to converge.

**Computational finding.** A single scalar precision (τ) is not obviously the right currency for
both point evidence ("effect ≈ x") and one-sided evidence ("effect ≥ x"): the two make different,
non-interchangeable epistemic claims, and accumulating both into one number let this phase's rule
grow spuriously confident from evidence that never discriminated between hypotheses. Whether
`NeedExpectation` needs a richer representation — separate accumulators for point-precision and
bound-evidence — or whether a more careful, but still `(μ, τ)`-shaped, update can respect the
distinction is now an open, concretely testable research question (Correction points 5-6), not a
solved one.

**Architectural implication.** A "dual-mode, opt-in, default-legacy" parameter design (new
`evidenceKind`/`SaturationParams` fields defaulting to prior behavior) let this phase's entire new
mechanism ship alongside 76 pre-existing findings with zero regressions — validating, not just
assuming, the compatibility strategy this brief's own Phase 2.5 request specified, and that part of
the phase's delivery is unaffected by the Correction above. Separately: a trace-only speculative
quantity (Experienced Reward) can be fully instrumented and made visible to a researcher (traced
every cycle, shown live in the UI) without being prematurely wired into any behavior-affecting
pathway — keeping "is this mechanism necessary" answerable by future evidence rather than settled by
its mere presence in the codebase. And, more generally: a research log entry's own success framing
can itself be wrong in a way that only a second reader catches — this phase's real lesson may be
methodological as much as technical, which is exactly why this correction is recorded in place
rather than silently folded into a rewritten "clean" version of the original findings.

### Correction 2 (post-Phase-2.5c review) — the (μ, τ) representation question, resolved

Phase 2.5c's own review ("Experience Interpretation," see below) closed its three targeted gaps and
then returned to this entry's still-open question: is `(μ, τ)` sufficient for both point and
one-sided evidence, or does `NeedExpectation` need a richer representation? Correction point 6's four
validation cases were run, and the finding is: **`(μ, τ)` is sufficient for the censored-evidence
behaviors tested so far. The bug was in the informativeness gate that decided when τ was allowed to
grow, not in what the two-number representation could express.**

That phrasing is deliberately narrower than "sufficient all along." The accepted-bound branch (an
informative `lower_bound`/`upper_bound` observation) still credits itself with the full observation
precision ρ, exactly as if the bound were a point measurement — but a genuine inequality is a weaker
claim than a point value, and a *sequence* of distinct inequality bounds ("effect ≥ 0.10," then later
"effect ≥ 0.20," then "effect ≥ 0.30") is not mathematically identical to three point observations at
those values, even though the corrected rule currently treats each accepted one that way. `(μ, τ)`
cannot represent the exact posterior that sequence of inequalities actually implies. Per this
project's "don't generalize until an experiment demands it" principle: none of the four validation
cases, nor the Brief §21/§22 experiments, currently behave incorrectly because of this — so it stays
a documented approximation, not a TODO, until some future experiment's behavior actually depends on
the distinction.

**The fix.** `updateExpectation` (`model/expectation.ts`) now grows τ by the full observation
precision ρ only when a censored bound is genuinely informative — its naive candidate strictly moves
past the current μ in the direction the bound asserts (`lower_bound`: `μ_naive > μ`; `upper_bound`:
`μ_naive < μ`). Otherwise the bound is uninformative — "the truth is at least r" when r is already ≤
the current belief proves nothing new — and τ freezes at its merely-decayed τ⁻, gaining zero
precision, exactly like μ gaining zero movement. The strict inequality (not `≥`/`≤`) is load-bearing:
a naive candidate landing EXACTLY on the current μ is classified as uninformative too, which is what
stops a long run of *identical* repeated bounds from being treated as fresh confirming evidence every
single time (see Case D below). Point evidence, and every pre-existing call site, is completely
unaffected — this touches only the `lower_bound`/`upper_bound` gating logic.

**All four validation cases pass, encoded directly as tests** (`test/phase2_5aRepresentation.test.ts`):

- **Case A (established belief, weak lower bound).** μ=0.40 at high precision (τ=50), then one new
  observation "effect ≥ 0.10" (well below the belief). Result: exactly zero change to both μ and τ —
  not merely "not material," which is what the original wording asked for; the corrected rule
  achieves the stronger exact-no-op property.
- **Case B (belief inconsistent with the bound).** μ=0.05, then "effect ≥ 0.10" (above the belief).
  Result: the model updates — μ rises above 0.05 and τ grows from the decayed prior, exactly as Case
  B required.
- **Case C (zero-information saturation).** A Need at its ceiling, Applied=0 exactly ("effect ≥ 0" —
  true of every non-negative belief). Result: exactly zero change in both μ and τ, whether starting
  from a fresh μ=0 prior or an already-established positive belief — "essentially no change" from the
  original wording is, again, achieved exactly rather than approximately.
- **Case D (genuine evidence after a long censored history).** Six identical "effect ≥ 0.10"
  observations from a fresh prior, then one genuine unclipped "effect = 0.42" point observation.
  Under the OLD rule (reproduced inline in the test for direct comparison, since the buggy code no
  longer exists to call), τ grows by ρ on every single repetition regardless of informativeness,
  reaching 6ρ by the end; under the CORRECTED rule, τ grows once (the first, genuinely informative
  observation) and then plateaus at exactly 1ρ, because every subsequent identical bound lands
  exactly on the already-established μ=0.10 and is correctly read as adding nothing. Applying the
  same genuine 0.42 observation afterward: the corrected trajectory's α (`ρ/(τ+ρ)`) is markedly larger
  than the buggy trajectory's, and the corrected μ lands measurably closer to the true 0.42 than the
  buggy one does — precisely the "accumulated precision must not artificially suppress how much a new
  genuine observation moves the belief" property Case D was written to demand.

**Real consequences, measured by re-running the exact Brief §21/§22 experiments this entry already
reported on.** The sweep (`experiments/saturatedSatisfaction.ts`) previously read as "naive and
censored produce bit-for-bit identical output at every level" — under the corrected rule this is true
everywhere **except exactly at total saturation** (Level=1.00, Applied=0 exactly): naive's confidence
still rises to 0.4000 there (it always uses `'point'` evidence regardless of saturation, so it
treats "effect was exactly 0" as if it were a genuine measurement), while censored's confidence
correctly stays at 0.0000 — Case C demonstrated live inside the sweep, not just in a unit test. The
counterfactual (`experiments/saturationCounterfactual.ts`) shows the larger effect: naive is
untouched by this fix (`naiveDivergence` is still exactly **0.2145**, unchanged from the original
recording, since 'naive' mode never exercises the corrected gating logic at all), but
`censoredDivergence` drops from the originally-recorded **0.1780** (~17% smaller than naive) to
**0.1108** — a **~48% reduction** versus naive, not 17%. Timeline B's censored `finalMu` rises from
the original ≈0.2219 to **≈0.2891** against the true ~0.40-0.42 effect — substantially closer, though
still an honest undershoot, not a full recovery (see "what remains open" below). The corrected rule
did not just fix an edge case; it materially changed the phase's own headline result.

**What remains open, stated plainly rather than rounded up.** This correction fixes the
*uninformative-bound* half of the rule; the *informative-bound* half is unchanged and still credits
an accepted censored observation with the full ρ, exactly as if it were an ordinary point
observation — a deliberate, already-documented simplification relative to a literal truncated-normal
treatment (still avoiding the transcendental normal CDF the exact-rational-arithmetic contract
forbids), not something this correction claims to have solved. And Timeline B's censored estimate
still undershoots the true effect: the rule *protects* an established belief from erosion by
systematically-clipped evidence and, as of this correction, no longer manufactures false confidence
from that same evidence — but it still cannot *recover* magnitude information that Overflow alone
would carry, since Correction point 3 (above) already ruled out using Overflow directly as leaking
simulator-omniscient information across the Experience boundary. That retraction still stands; a
genuinely magnitude-aware update remains a documented non-goal, not a future TODO.

#### Three-part output (Brief §36) for Correction 2

**Psychological finding.** A character reasoning correctly under saturation should grow confident
only in proportion to how much a censored observation actually discriminated between competing
beliefs — an observation fully compatible with what she already believed, however many times it
repeats, teaches her nothing new and must leave her exactly as uncertain as before. The original
rule's mistake was treating "I received an observation" as inherently confidence-building, when the
correct standard is "I received an observation that could have gone differently and didn't" —
compatibility with an existing belief is not the same thing as evidence for it.

**Computational finding.** The representation `(μ, τ)` was never the bottleneck; the update rule
attached to it was. This is worth stating as its own finding because the natural assumption, when a
model under-performs, is "the representation is too poor to express what's needed" — here, a much
smaller, more surgical fix (a strict-inequality informativeness gate on when τ is allowed to grow)
recovered most of the missing performance (naive-relative divergence reduction: 17% → 48%) without
adding a single new field to `NeedExpectation` or a new accumulator type. Reaching for a richer
representation before checking whether the existing one's update rule was even correctly specified
would have been the more complex, and in this case wrong, fix.

**Architectural implication.** Encoding the four validation cases as literal, named tests
(`phase2_5aRepresentation.test.ts`) — rather than trusting that "the counterfactual numbers look
better now" was sufficient evidence — is what makes this correction falsifiable by a future change
the same way every other claim in this log is: any future edit to `updateExpectation` that
regresses Case A, C, or D fails a named test immediately, not just a downstream experiment's
aggregate number. Writing the validation cases down at review time (Correction point 6, months
before this fix) and only then implementing against them is the same "specify success before
building" discipline this project used for Brief §13's six salience scenarios and Brief §14's eight
success criteria — deferred specification, not skipped specification.

## Phase 2.5b — Semantic Salience

**Status: PARTIAL, corrected by Phase 2.5c below.** The core mechanism — role dominating category,
Need relevance and surprise both moving encoding in the predicted direction, all three budget models
bounded and exact — is validated and kept. External review (recorded in the Correction section
immediately below) found this entry still hand-authored three of the pipeline's own *inputs* even
though the *weights* were genuinely derived: causal role was set directly on each scenario's
`PerceivedConcept` rather than following from what actually, causally happened; attention was gated
by an authored `unattended: true` flag rather than derived from role and scene composition; and
surprise used the raw `|r-μ|` prediction error even when that observation was boundary-clipped,
disagreeing with Phase 2.5a's own censored-evidence semantics. Phase 2.5c closes all three gaps
without touching the validated multiplicative core. Every result below is written from actual
`computeSemanticSalience` output (`experiments/semanticSalience.ts`'s six scenarios) and one real
20-step-cycle comparison, not predicted numbers, and is kept as originally recorded (correct
forward, don't quietly rewrite history) even where Phase 2.5c's rebuilt scenarios now produce
different numbers for the same qualitative claims. Not yet gated by a second implementer/reviewer,
same caveat as every prior entry — and, per the standing methodological correction at the top of
this file, every Vivarium-facing claim below is phrased as "what would Vivarium's architecture need
to expose this," never "is this common enough in Vivarium to be worth it."

This phase answers the other half of the same brief that produced Phase 2.5a: Phase 2's own
RESEARCH.md entry found that `W[context.evening][action.visit_glen]` caps at exactly 1/2 because
every Experience tagged its concepts with a flat co-activation weight of 1.0, letting them compete
for the same row-substochastic budget regardless of how central each concept actually was to what
happened. That flat 1.0 was an artifact of `cycle.ts`'s original `semanticConcepts` construction, not
a deliberate psychological claim. This phase replaces it with a derived encoding strength z_i,
computed from a fixed, global, non-scenario-specific set of rules (Brief §5.1: "The system must not
require authored instructions such as 'Glen = 0.92, Bakery = 0.24, Lamp = 0.03.'").

### Correction (post-implementation review, before Phase 2.5c)

The findings below were written immediately after implementation and are kept as originally
recorded. A review of this entry before starting Phase 2.5c found that the pipeline's *weights*
(BASE_SALIENCE, ROLE_WEIGHT, DEFAULT_ATTENTION_BY_ROLE) were genuinely derived — a real, validated
result — but three of the pipeline's own *inputs to those weights* were still hand-authored per
scenario, which is the same class of mistake Brief §5.1 rules out, just one level upstream of where
2.5b actually looked:

1. **Causal role was authored directly, not derived from what causally happened.** 2.5b's
   `WorldEventDescriptor` required whoever wrote a scenario to set `role: 'Cause'` on the Lamp by
   hand once it started the injury. That is a real fact about the event, but nothing in the code
   *derived* it from anything — a scenario author could just as easily have typed `'Incidental'` for
   the same falling lamp and nothing would have caught it. **Fixed in 2.5c**: a new `EffectProvenance`
   type describes only what physically/causally happened (who acted, on whom, with what, what
   actually caused the observed effect); `deriveWorldEventDescriptor` is now the *only* place in the
   codebase permitted to assign a `CausalRole`, and it does so mechanically from which provenance
   slot named a concept. Separately, `ActionDef.subjectRole` now declares an Action's own semantic
   argument structure (Conversation-like Actions bind their subject as `'Participant'`; an
   Attack-like or Betrayal-like Action binds it as `'Cause'`) as a fact about the verb, not a
   psychological weight on whichever specific Person fills that slot this time.
2. **Attention was authored per concept via `unattended: true`, not derived.** This correctly
   demonstrated that perception ≠ attention (a real finding, kept), but it moved the hand-authoring
   problem rather than eliminating it — "Lamp salience = 0.02" became "Lamp unattended = true,"
   still a per-scenario toggle. **Fixed in 2.5c**: non-Incidental roles keep a fixed default
   attention value; Incidental-role concepts now derive their attention by splitting a fixed residual
   pool among however many Incidental concepts the Experience actually has — attention competition is
   now a computation over how many things are in the scene, not a flag any caller sets.
3. **Surprise used the raw prediction error even for boundary-clipped observations, disagreeing with
   Phase 2.5a's own semantics.** A saturated/censored observation being far from μ does not mean
   something surprising happened — it means the observation couldn't measure the full effect — and
   Phase 2.5a's censored-learning correction (this file, above) already established that distinction
   for *learning*; 2.5b's salience computation used `|r-μ|` regardless, silently disagreeing with it
   for *encoding*. **Fixed in 2.5c**: surprise now branches on the same `EvidenceKind` vocabulary
   (`point`/`lower_bound`/`upper_bound`) Phase 2.5a's `expectation.ts` already defines — `point` keeps
   `|r-μ|`; `lower_bound` (a ceiling-saturated positive effect) uses `max(0, L-μ)`, i.e. "did the
   evidence prove something incompatible with my belief"; `upper_bound` is the mirror. Need relevance
   is deliberately left unchanged — it is a genuinely different question ("how much did this matter to
   the Need I was experiencing," using the realized regulatory effect) from efficacy/surprise, and the
   review confirmed that boundary does not need correcting.

One further open item the review raised without treating as a defect: the salience-budget model
(independent/shared/hybrid) was left a three-way choice. The review locks `'independent'` (Model A)
as the reference default going forward — see Phase 2.5c's Mathematical findings for the reasoning —
until a dedicated attention-capacity experiment specifically motivates the shared/hybrid models.

### Psychological findings

**A concept's causal role in a specific event, not its ontological category, is what should
dominate its salience — and the model now demonstrates this quantitatively, not just structurally.**
The same `object.lamp` concept, same category (`Object`, base salience prior B=0.30) throughout:
tagged `Incidental` at an ordinary dinner (Scenario A) it lands at raw=0.006, z≈0.006 — genuinely
negligible next to Glen's z≈0.44 or the dinner Action's z≈0.52. Tag the *identical* concept `Cause`
once it causally injures Mina (Scenario C) and it jumps to raw=0.602, z≈0.376 — a roughly 63×
increase in raw salience from a single-field change (role, not category), with the concept's base
salience prior held byte-for-byte identical both times. The same swing reproduces for a Location
(Scenario D: `location.bakery`, `Cause` role, z≈0.434 versus an ordinary `Location`-role Home's
z≈0.088 in Scenario A) — confirming Brief §7's claim ("the same Object category must be capable of
receiving dramatically different salience because its causal role changed") generalizes across
categories, not just for the brief's own worked Table example.

**Need relevance and surprise both move salience in the predicted direction, and do so without any
scenario-specific tuning of Glen, Mina, or any other named entity.** Ordinary dinner (Scenario A: a
positive delta=0.30, urgency=0.60, low prediction error=0.05) gives Glen z≈0.439. The *identical*
descriptor and causal-role assignment, only with a larger, more surprising negative delta (Scenario
B, "argument": delta=-0.60, prediction error=0.90) raises Glen to z≈0.547 and the Action concept to
z≈0.627 — Brief §14 criterion 4 ("Need-relevant concepts receive greater salience") and criterion 3
("prediction error increases encoding") both hold. Isolating surprise alone (Scenario E, holding the
descriptor, roles, and Need impact fixed and varying only the prediction error from 0.01 to 0.95):
Glen's z rises from ≈0.430 to ≈0.526, and the Action's from ≈0.512 to ≈0.607 — a clean, monotonic
effect of the *one* factor that changed, with nothing else in the computation touched.

**Attention gating is a real, separate mechanism from perception, and the model distinguishes "never
perceived" from "perceived but not registered."** Scenario F places three concepts (`location.home`,
`object.lamp`, `object.painting`) as objectively present (`perceived: true`) but explicitly
`unattended` alongside an ordinary Glen interaction: all three land at raw=0, z=0 exactly — not
merely small, but exactly zero, because `unattended` forces attention A_i to 0 and every downstream
factor is multiplicative. This is deliberately a *different* mechanism from Scenario A's "negligible"
Lamp, which reaches z≈0.006 through its low category/role product alone, with ordinary (not
zero-forced) attention. Both land near zero, by different routes — which is itself informative: a
system can suppress an irrelevant-but-noticed concept (low B·R) and an unnoticed-but-present concept
(A=0) through the same multiplicative pipeline without needing two different suppression mechanisms.

### Mathematical findings

**The raw-salience product `B_i·R_i·A_i·(1+α_N·N_i)·(1+α_S·S_i)` (Brief §11) is exact-rational
throughout and every factor survives independently in the trace** — `salience.test.ts` checks the
formula against a hand-computed product directly, and the `'semantic_salience'` trace step
(`phase2_5Salience.test.ts`'s criterion-8 test) round-trips every one of B, R, A, N, S, Raw, and z
back out of the recorded trace exactly, satisfying Brief §27's Trace Completeness obligation without
approximation.

**All three candidate salience-budget models (Brief §12) are bounded in [0,1] by construction, not
by a separate clamp.** Model A (independent, `z_i=g(Raw_i)`) inherits boundedness directly from the
existing `Rational.boundedResponse` kernel primitive (Phase 0) — no new bounding function was
needed. Model B (shared budget, `z_i=Raw_i/max(B,ΣRaw_j)`) is bounded because, for nonnegative raw
scores, the denominator is always at least as large as any individual numerator once that
numerator's own term is part of the sum — an algebraic guarantee, checked directly in
`salience.test.ts` rather than merely observed. Model C (hybrid) composes both and inherits both
guarantees on its respective partition. Perception exclusion (Brief §27) is enforced structurally,
not just as an emergent multiplicative near-zero: a concept with `perceived: false` is given z_i=0
before it ever enters a budget-model computation, and is excluded from any Σ_j Raw_j the budget
models use — Brief §8's "cannot receive semantic salience merely because it existed in the same
world space" means such a concept never competed for encoding capacity, not merely that it lost.

**A genuinely open design question was resolved by NOT reusing existing machinery, and the reasoning
is worth recording because it could easily have gone the other way.** `associations.ts`'s
`updateAssociations` already has a BigInt lattice-quantization + largest-remainder reallocation
algorithm for normalizing a row of nonnegative Rationals against a shared cap (Σ_j W_ij ≤ 1 exactly)
— structurally similar to what Salience Budget Models B/C need. This phase deliberately does *not*
factor that machinery out for reuse here: that algorithm exists specifically to prevent quantization
drift from compounding across thousands of future incremental updates to *persisted* state (W is
mutated every Experience, forever). Semantic salience z is recomputed from scratch every single
Experience — nothing about it persists or accumulates — so a plain exact `Rational` division already
satisfies the exact-arithmetic contract (Brief §3.1) with no drift to guard against, and Brief §12
never requires Σz_i to equal any particular total (only that each z_i is bounded). Reusing the
lattice/BigInt path would have added real complexity in service of a persistence problem this module
does not have — a case where the "obviously reusable" answer was the wrong one.

### Architectural findings

**The dual-mode, opt-in, default-legacy discipline held for a second, structurally different phase
without needing to be reinvented.** `salienceMode: 'legacy' | 'derived'` on `CycleParams` (mirroring
Phase 2.5a's `SaturationParams.learningMode`) means every one of the 117 tests that predate this
phase — all of Phase 0 through 2.5a — passes byte-for-byte unchanged, because `'legacy'` reproduces
`cycle.ts`'s exact original flat-1.0 `semanticConcepts`/`experienceActivation` construction verbatim,
just moved into an `else` branch. `'derived'` is purely additive.

**The Action-key concept and the Experience's subject needed an explicit default causal-role mapping
to make derived mode usable without an authored `WorldEventDescriptor` on every call site** —
`defaultWorldEventDescriptor` assigns the chosen Action `'Cause'` (it is literally the mechanism that
produced the observed Need effect) and the subject `'Target'` (the ordinary "acted upon" case), with
Location→`'Location'` and active Context concepts→`'Context'`, exactly reproducing what every
pre-2.5b Experience implicitly meant. This is a documented authoring choice, not a brief mandate —
Brief §7's own worked examples use different role labels for illustration (`Participant` for an
ordinary dinner companion) — but it is a *general, fixed* rule applied identically regardless of
which Person/Action fills the slot, preserving the "no scenario-specific weights" property while
still giving ordinary Experiences sensible defaults.

**One integration measurement makes the claimed effect concrete, not merely structural.** Running
the exact same forced Experience (visit Glen, evening Context active, same seed/character/clock)
once under each mode: `'legacy'` gives `W[context.evening][action.visit_glen] = 0.300` and
`W[person.glen][action.visit_glen] = 0.300` — identical weights, because both concepts got the same
flat co-activation regardless of relevance. `'derived'` gives `W[context.evening][...] ≈ 0.0014` (a
~212× reduction) and `W[person.glen][...] ≈ 0.092` — Glen, who is actually central to what happened,
keeps a meaningfully larger share than the ambient evening Context, without either weight being
hand-tuned. This is Brief §14 criterion 7 ("association strength is no longer primarily determined
by arbitrary tag count") demonstrated with real numbers from one real cycle, not asserted from the
formula alone.

### Vivarium comparison

Per the standing methodological correction: the question here is not whether Vivarium's current
event/perception system already resembles this pipeline, or whether semantic-salience-driven
association weighting is common/valuable enough in Vivarium's actual play patterns to be worth
porting. Those are production-cost and prevalence questions that come after CharacterLab has a
validated model, not before.

The question worth asking now: **what would Vivarium's world-event and perception representation
need to provide for this pipeline to run against it?** This phase's `WorldEventDescriptor` needs,
for every perceived entity in a moment: (1) an ontological category (Vivarium likely already has an
entity-type system that could supply this directly); (2) a causal role *specific to the event*, not
a fixed property of the entity (Vivarium would need something that can say "this specific lamp was
the Cause this time," not just "lamps are Objects" — i.e., causal-role assignment has to happen at
event-resolution time, not at entity-definition time); (3) a perception/attention signal separate
from "the entity exists in the world state" (Brief §8's exclusion principle — if Vivarium's
event log includes everything objectively present rather than only what a character actually
noticed, salience-driven learning would need a perception filter layered in front of it, which does
not yet exist in this codebase's own outcome-resolution pipeline either — Phase 0-2's `WorldOutcomeTable`
resolves effects without a distinct perception step, an open gap on *both* sides worth flagging
rather than papering over). None of these are claims about whether Vivarium has them today — they
are the concrete list of representational obligations this model's success surfaces.

### Next-phase justification

Two threads are now open simultaneously, and neither blocks the other:

1. **Return to Phase 2.5a's deferred representation question** (RESEARCH.md's Correction section,
   points 5-6): does `(μ, τ)` suffice for both point and one-sided evidence, or does
   `NeedExpectation` need a richer `Mean`/`PointPrecision` + `LowerBoundEvidence`/`UpperBoundEvidence`
   representation? The four validation Cases A-D specified in that Correction section are still
   unrun and still the concrete next step there.
2. **Brief §24's interaction question, now buildable but not yet built**: this phase and Phase 2.5a
   were implemented independently (Phase 2.5b's salience computation never reads
   `SaturationAnalysisEntry`, and Phase 2.5a's censored-evidence classification never reads z_i) —
   deliberately, to keep each phase's own correctness argument clean. Brief §24 asks whether a
   heavily-saturated (low-information) Experience should also encode *less* semantically — i.e.,
   whether z_i should itself depend on Applied/Overflow, not just on B/R/A/N/S. This is a genuine
   open research question, not an oversight: coupling salience to saturation before both mechanisms
   are independently validated would make it impossible to attribute a wrong result to either one.
   Worth a dedicated small experiment once Phase 2.5a's representation question above is resolved,
   not before.

Neither thread is Phase 2.5b's own responsibility to close — recording them here so they are not
lost, per this project's standing discipline of writing the next question down before moving on.

### Three-part output (Brief §36) for the Semantic Salience findings

**Psychological finding.** Salience — how strongly an event encodes into memory and association —
should not be a property of *what kind of thing* something is, but of *what role it played in this
specific event*, modulated by whether it was actually noticed, whether it mattered for a current
goal, and whether it violated expectation. A Lamp is not "low-salience"; a Lamp that merely sat on
the table is low-salience, and the same Lamp that fell and caused harm is not — the model must
recompute this per-event from role and context, never bake a fixed importance into the entity
itself. This distinction — ontological kind versus causal role in a specific event — sits alongside
Phase 2.5a's "what happened / what could be observed / what that observation permits belief to be"
as the same family of finding: CharacterLab keeps discovering that a single collapsed quantity
(salience, or a Need's observed delta) was hiding two or three logically separate things.

**Computational finding.** A small, fixed, globally-authored set of category and role weights,
combined multiplicatively with deterministic, bounded, already-existing per-Experience signals (Need
relevance from `actualNeedResult`, surprise from `NeedExpectation`'s own δ=r-μ), is sufficient to
reproduce every qualitative pattern Brief §13's six scenarios require — role overriding category,
Need-relevance and surprise increasing encoding, attention gating suppressing unregistered concepts
— without a single per-scenario authored number. The salience-budget question (independent vs.
shared vs. hybrid) remains genuinely open at the level of "which model best matches an eventual
production need"; this phase validates that all three are mathematically sound (bounded, exact,
deterministic) candidates, not that one is correct.

**Architectural implication.** The same `salienceMode: 'legacy' | 'derived'` opt-in pattern that
Phase 2.5a used for `SaturationParams.learningMode` transferred directly to a structurally different
mechanism (a full multi-factor derivation pipeline rather than a single evidence-classification
branch) with zero adaptation needed to the pattern itself — evidence that this project's "new
mechanism, opt-in, default-legacy" discipline is a reusable architectural template, not something
that happened to fit Phase 2.5a by coincidence. Separately: choosing *not* to reuse
`associations.ts`'s lattice-quantization machinery, after concretely identifying why it solves a
different problem (persisted-state drift versus recomputed-every-Experience values), is itself a
finding worth recording — this codebase's own prior work is a source of temptingly-reusable
machinery that is not always actually the right tool, and checking that explicitly before reusing it
is now a standing habit, not a one-off.

---

## Phase 2.5c — Experience Interpretation

**Status: implemented, tested, and delivered.** This is deliberately a small integration phase, not
another giant one: Phase 2.5b's own review found its multiplicative core sound but three of its
*inputs* still hand-authored (see the Correction section under Phase 2.5b, immediately above). This
phase closes exactly those three gaps — mechanical causal-role derivation, mechanical residual-
attention derivation, evidence-kind-aware surprise — locks the independent salience-budget model as
the reference default, and adds the one isolated Need-relevance test the factor-isolation suite was
missing. Every number below is written from actual `computeSemanticSalience`/`runScriptedExperience`
output against the rebuilt pipeline (`experiments/semanticSalience.ts`'s six scenarios, rebuilt to
construct `EffectProvenance` instead of a hand-set `WorldEventDescriptor`), not predicted numbers.
Not yet gated by a second implementer/reviewer, same caveat as every prior entry.

### Psychological findings

**A concept's role can now only ever come from what actually, causally happened — and enforcing that
mechanically, rather than trusting a scenario author to type the right label, still reproduces every
2.5b qualitative finding.** The same `object.lamp` concept: `incidentalConcepts` in an ordinary
dinner's `EffectProvenance` (Scenario A) derives to `Incidental` and lands at raw=0.0060, z≈0.0060 —
still genuinely negligible next to Glen's z≈0.2511 or the dinner Action's z≈0.5116. Naming the
identical concept in `EffectProvenance.cause` once it injures Mina (Scenario C) derives it to
`Cause` and it jumps to raw=0.6024, z≈0.3760 — a ≈62.7× increase in raw salience from a single
provenance-field change, base salience prior held byte-for-byte identical both times, and this time
no code path anywhere lets a scenario author simply mistype the role. The same swing reproduces for
a Location (Scenario D: `location.bakery` named in `EffectProvenance.cause`, z≈0.4342) against an
ordinary `Location`-role Home (z≈0.0876 in Scenario A) — the mechanism, not just the numbers,
generalizes across categories.

**The overly generic "subject → Target" default the review specifically flagged is gone, and the
character-level swing it enables is real but appropriately smaller than the Lamp's.** Every ordinary
Conversation-like Action in `defaultActions()` (`ACTION_VISIT_GLEN`, `ACTION_VISIT_PRIYA`,
`ACTION_STAY_HOME`) now declares `subjectRole: 'Participant'`, not `'Target'` — running a full
scripted `visit_glen` cycle in `'derived'` mode gives Glen z≈0.3204 as a `Participant`. Betrayal's
`subjectRole: 'Cause'` (an Attack-like Action whose subject directly causes the sharp negative Need
effect) instead gives Glen z≈0.4831 in the betrayal Experience — roughly a 1.5× swing, not the
Lamp's 62.7×, because Person already carries a high category prior (B=0.80) and both `Participant`
(R=0.60) and `Cause` (R=1.00) role weights are already high for people; the role component still
moves the number in the right direction, it just has less room to work with when the category prior
is already large. This is itself informative: causal role's leverage is largest exactly where the
category prior is otherwise uninformative (an Object could mean anything from a lamp to a table),
and smallest where category prior already carries most of the signal (a Person is usually going to
matter).

**Attention gating is now a computation over how crowded the scene is, not a flag any scenario
author sets — and it produces the same qualitative suppression 2.5b's `unattended` flag did, through
a mechanism that cannot be authored per concept.** Scenario F's residual Incidental pool
(`DEFAULT_ATTENTION_BY_ROLE.Incidental = 0.20`) splits evenly among however many Incidental concepts
provenance actually lists: with one Incidental object (the Lamp alone), it gets the whole pool,
attention=0.2000, z≈0.0060; add two more Incidental fixtures to the identical scene (a Painting, a
Coat) and the Lamp's share drops to exactly 0.0667 (a three-way split of the same 0.20 pool),
z≈0.0020 — a 3× reduction in encoding purely from how many other background objects happened to be
present, with nothing in any scenario file setting the Lamp's attention directly. Non-Incidental
roles are unaffected by scene clutter: Glen (`Participant`) holds attention=0.6000 identically in
both the one- and three-Incidental variants — confirming the derivation is scoped to exactly the
"residual competition among Incidental concepts" the review asked for, not a global renormalization
that would have diluted Glen too.

**Evidence-kind-aware surprise reproduces the review's own worked example exactly: a saturated
observation far from μ can be *zero* surprise, not the large surprise a naive `|r-μ|` would report.**
Believing an effect of +0.40 and then observing a ceiling-saturated Applied=+0.05 (a `lower_bound`
observation — the true effect is *at least* +0.05) yields `surpriseMagnitude = max(0, 0.05-0.40) = 0`
exactly — the observation proves nothing incompatible with the existing belief, so nothing about it
should read as surprising. Treating the identical numbers as unsaturated `point` evidence (the 2.5b
behavior) would have reported `|0.05-0.40| = 0.35`, a large and entirely spurious "this was
unexpected" signal driven purely by where the boundary happened to clip the observation. The mirror
direction confirms the formula discriminates correctly rather than just always returning zero: a
`lower_bound` observation of +0.15 against a *low* prior belief of +0.02 yields `max(0, 0.15-0.02) =
0.13` — genuinely positive surprise, because this observation *does* prove something incompatible
with the prior belief. `cycle.ts` now classifies this "objective evidence kind" unconditionally, from
the same Capacity/Applied/Overflow decomposition Phase 2.5a already computes, regardless of whether
`SaturationParams.learningMode` is `'naive'` or `'censored'` — salience's surprise measure is always
epistemically correct about what kind of observation this was, independent of what the separate
*learning* algorithm chooses to do with that fact.

**Need relevance now has the clean factor-isolation test the review pointed out was missing, and it
confirms the mechanism works exactly as claimed once every other factor is actually held fixed.**
Holding causal role (`Participant`), attention (1.0000, unaffected by the isolation setup), and
surprise (0.0099, identical low-surprise evidence in both runs) exactly constant and varying only the
Need impact (urgency×|delta|): a low-Need-relevance run (delta=0.05, urgency=0.20) gives
N=0.0099, z≈0.4786; a high-Need-relevance run (delta=0.90, urgency=0.90) gives N=0.4475, z≈0.5682 —
z_B > z_A, confirming the factor drives salience upward on its own, not merely alongside surprise as
Scenario B's combined conflict test could suggest by itself.

### Mathematical findings

**Mechanical derivation from a fixed slot-mapping table is exactly as exact-rational and
deterministic as the hand-authored version it replaced, with the added property that misauthoring a
role is no longer representable.** `deriveWorldEventDescriptor` processes a small ordered
`ROLE_SLOTS` table (`activeContext`→Context, `sourceAction`/`cause`→Cause, `actor`→Actor,
`target`→Target, `recipient`→Recipient, `instrument`→Instrument, `affectedEntity`→AffectedEntity,
`location`→Location, `participants`→Participant, `incidentalConcepts`→Incidental) with first-slot-
wins tie-breaking for a concept named by more than one field — deterministic, side-effect-free, and
because `EffectProvenance`'s fields are typed to specific slots, there is no longer a `role: string`
anywhere in the codebase a caller could set to an arbitrary/incorrect value.

**Residual-attention derivation is exact division, not an approximation of "sharing."**
`deriveAttention` computes `DEFAULT_ATTENTION_BY_ROLE.Incidental / count(Incidental concepts
perceived)` using exact `Rational` division — the three-Incidental Scenario F variant's 0.0667 is
literally `1/5 ÷ 3 = 1/15` computed exactly, not a floating-point approximation, so the "1/3 of the
one-Incidental value" relationship holds as an exact algebraic identity
(`lampAttentionOne.equals(lampAttentionThree.mul(ratOf(3)))`), verified directly in
`phase2_5cExperienceInterpretation.test.ts` rather than merely observed as approximately true.

**`surpriseMagnitude`'s censored-evidence formulas are provably bounded by the unsaturated formula
they replace, never the reverse — censoring can only reduce reported surprise, never inflate it.**
For any fixed (priorMu, observed) pair, `max(0, observed-priorMu) ≤ |observed-priorMu|` and
`max(0, priorMu-observed) ≤ |observed-priorMu|` hold algebraically (the clamp to 0 only ever removes
magnitude the absolute-value version would have counted), so a `lower_bound`/`upper_bound`
classification can never manufacture surprise a `point` reading of the identical numbers would not
already show — it can only correctly suppress surprise that was never actually warranted. This
inequality is checked directly (`salience.test.ts`), not just asserted from the formula's shape.

**Locking `budgetMode: 'independent'` as the reference default is a methodological choice with a
concrete justification, not an arbitrary pick among three equally-plausible options.**
`associations.ts` already enforces a competitive budget downstream of salience (`Σ_j W_ij ≤ 1` per
row, exactly), so normalizing salience itself against a *second* shared Experience-level budget (the
`'shared'`/`'hybrid'` models) would let an irrelevant extra concept dilute the important ones before
they even reach association learning — quietly reintroducing, one level up the pipeline, the same
"arbitrary tag count" problem Phase 2.5b exists to eliminate downstream. "Limited attention" (the now-
derived residual-pool competition above) and "limited associative capacity" (already `associations.
ts`'s job) are two different constraints that this project has not yet run an experiment
distinguishing; conflating them by defaulting to a shared salience budget would have been premature.
`'shared'`/`'hybrid'` remain fully implemented and tested (both are bounded, exact, deterministic —
`salience.test.ts` checks both directly), available for exactly the dedicated attention-capacity
experiment this finding defers, not deleted.

### Architectural findings

**The dual-mode, opt-in, default-legacy discipline extended cleanly to a *correction* of an already-
opt-in mechanism, not just to new mechanisms.** No test written before this phase needed to change
its assertions about *whether* salience is computed — `salienceMode: 'legacy' | 'derived'` is
untouched: `'legacy'`'s exact byte-for-byte Phase 0-2.5a behavior is unaffected by any of this phase's
changes, and every one of Phase 2.5b's own tests needed only its *inputs* rewritten (hand-set
`PerceivedConcept.role`/`unattended` → `EffectProvenance`; raw prediction-error `Rational[]` →
`SurpriseEvidence[]`), never its assertions about the *shape* of the derived-mode contract. All 139
tests (117 pre-2.5c plus 22 new) pass.

**`ExperienceContext.worldEventOverride` collapsed from two separate override fields to one,
because 2.5c's own correction made the second one redundant by construction.** 2.5b's design (per
the original implementation plan) anticipated a `worldEventOverride?: WorldEventDescriptor` plus a
separate `causalConceptsOverride?: ReadonlySet<ConceptKey>` — two independent things a caller could
override. Once role and causal-connectedness are BOTH mechanically derived from one `EffectProvenance`
value (`deriveWorldEventDescriptor` and `causallyConnectedFromProvenance` are pure functions of the
same input), a second override field would only ever invite the two to silently disagree — so
`ExperienceContext` now carries exactly one `worldEventOverride?: EffectProvenance` field, and
`cycle.ts` derives both descriptor and causal-connectedness from it. This is the same "collapse
redundant state into one derived source of truth" instinct the association-weight and Need-
expectation designs already followed elsewhere in this codebase, applied to a design that hadn't yet
been built when the instinct would have prevented it.

**The "objective evidence kind" now computed unconditionally in `cycle.ts` is a small but structurally
important addition: it makes an epistemic fact (what kind of observation this was) independent of an
algorithmic choice (what the learning rule does with that fact).** Before this phase, `EvidenceKind`
classification only happened inside the `learningMode === 'censored'` branch — meaning if a user ran
with `learningMode: 'naive'`, no `EvidenceKind` was ever computed at all, and salience (which now
needs one for every Need observation, every Experience, regardless of learning mode) would have had
nothing to consume. `cycle.ts`'s Step-13 loop now always classifies `objectiveEvidenceKind` from the
Capacity/Applied/Overflow decomposition, traces it alongside the (possibly different) gated
`learningEvidenceKind` the actual learning update uses, and feeds only the objective one to salience —
so a user toggling `learningMode` for a learning-mechanics experiment can no longer silently change
what salience believes about the same Experience, which is exactly the "2.5a and 2.5b privately
disagreed about surprise" bug the review identified, closed by construction rather than by
convention.

### Vivarium comparison

Per the standing methodological correction: the question is not whether Vivarium's engine already
has an `EffectProvenance`-shaped record, or whether provenance-driven role assignment is common
enough in Vivarium's current content to be worth porting. **The question worth asking now: what would
a production architecture need to preserve for this phase's corrected pipeline to be portable at
all?** Four concrete obligations, sharper than Phase 2.5b's own list because this phase's corrections
make the gaps more specific:

1. **Causal provenance as a first-class, structured record of what actually happened** — not merely
   an event log of world-state deltas, but something with named slots for actor/target/instrument/
   cause/etc. that a role-derivation function can read mechanically. Vivarium's outcome/effect
   resolution would need to produce this shape, not just "Need X changed by Y."
2. **Character-relative perception and attention as a distinct layer from world truth** — this
   phase's residual-attention-pool derivation only works if "how many things is this character
   currently perceiving" is itself a queryable, character-relative quantity, not a global fact about
   the scene. A production engine that only tracks objective world state (not per-character perceptual
   fields) would need to add this layer before any residual-competition model could run against it.
3. **Evidence semantics (point vs. bound) surfaced at the point where any subsystem consumes an
   observation, not just at the point where the outcome was computed.** This phase's central fix was
   discovering that TWO subsystems (2.5a's learning, 2.5b's salience) had each independently
   reinvented — and briefly disagreed about — what a saturated observation means. A production
   architecture should compute evidence-kind classification once, per observation, and hand it to
   every downstream consumer, rather than let each consumer infer it (or fail to) on its own.
4. **A character-relative semantic Experience layer sitting between world truth and learning** — the
   throughline across Phase 2.5a, 2.5b, and 2.5c: what a character can learn from should never be
   "what objectively happened in the simulation," but "what this character's Experience of what
   happened logically permits her to conclude," with causal role, attention, and evidence semantics
   all mediating that boundary. Whether Vivarium implements this as one unified layer or several
   coordinating subsystems is an implementation choice for later; that some such layer must exist is
   what these three phases jointly demonstrate.

### Next-phase justification

With Phase 2.5c's corrections landed, the path is now clear to return to the one substantive
question Phase 2.5a left open (its Correction section's point 5, deferred pending this phase): **is
`(μ, τ)` a sufficient representation for both point evidence and one-sided (`lower_bound`/
`upper_bound`) evidence, or does `NeedExpectation` need a richer representation that keeps
confidence-in-a-point-estimate and confidence-in-an-inequality-constraint as distinct quantities?**
The four validation Cases A-D specified in that Correction section (established belief vs. weak lower
bound; belief inconsistent with the bound; zero-information saturation; genuine evidence after a long
censored history) are still unrun and are the concrete next step. Phase 2.5c's own Brief §24 question
— whether z_i should itself depend on Applied/Overflow, not just on B/R/A/N/S — remains deliberately
deferred for the same reason Phase 2.5b left it deferred: coupling salience to saturation before
2.5a's representation question is resolved would make it impossible to attribute a wrong result to
either mechanism.

**Both since resolved.** The representation question above was run and closed in Phase 2.5a's
"Correction 2" section (earlier in this document) immediately after this entry shipped. Brief §24's
salience/saturation question, sharpened by that same post-2.5c review into "does saturation provide
any salience information not already available through realized Need relevance and evidence-aware
surprise?", is answered directly below in Phase 2.5d.

### Three-part output (Brief §36) for the Experience Interpretation findings

**Psychological finding.** A believable character's encoding of an event depends on three genuinely
separate character-relative facts — what causal role each present concept actually played (derived
from what happened, not assigned by fiat), how much of her limited attention that concept actually
received (a scarce, shared resource that background objects compete for, not a switch any one object
can be flagged with), and whether the evidence she received actually contradicted what she already
believed (which a boundary-clipped observation may not do, however far its raw number sits from her
prior) — and collapsing any of these three into an authored per-scenario fact, even one that happens
to be correct for that one scenario, reintroduces exactly the "Glen = 0.92" authoring problem Brief
§5.1 rules out, just moved one level upstream of the salience weights themselves.

**Computational finding.** Every one of Phase 2.5b's validated multiplicative-weight results survives
unchanged once its *inputs* are made mechanical: role from `EffectProvenance` via a fixed slot table,
attention from a fixed residual pool divided by a count, surprise from a fixed evidence-kind-branching
formula. None of the three fixes required touching `rawSalience`, `BASE_SALIENCE`, `ROLE_WEIGHT`, or
any of the three budget models — the correction was entirely about how those already-correct weights
receive their per-Experience inputs, evidence that a phase's mathematical core and its integration
plumbing can be validated and debugged as genuinely separate concerns.

**Architectural implication.** Sharing one vocabulary (`EvidenceKind`) between a learning subsystem
(Phase 2.5a) and an encoding subsystem (Phase 2.5b/c) — computed once, unconditionally, and handed to
both — is what actually closed the "these two phases silently disagree" bug, not a special-case patch
in either subsystem. This generalizes: whenever two independently-built subsystems both need to
interpret the same underlying observation, the fix is a shared, unconditionally-computed
classification both consume, not a bespoke reinterpretation in each. Phase 2.5a, 2.5b, and 2.5c
jointly demonstrate that "the character's Experience of an event" is itself a coherent, reusable
architectural layer — causal role, attention, and evidence semantics all mediate world-truth into
character-relative belief the same way, whether the consumer is a Need-satisfaction learner or a
salience/association-weighting mechanism — not three unrelated bolt-on features.

## Phase 2.5d — Saturation/Salience Interaction

**Status: RESOLVED. Brief §24's remaining Phase 2.5 question is classified DERIVED. Phase 2.5 is
CLOSED.**

Post-2.5c external review sharpened Phase 2.5c's own deferred Brief §24 question from "should
salience z_i depend on Applied/Overflow?" to a cleaner, falsifiable form: **does saturation provide
any salience information that is not already available through the character's experienced Need
relevance and evidence semantics?** The reviewer's own starting hypothesis, stated before anything
below was built or run, per this project's "specify success before building" discipline:

> Saturation does not require an independent salience mechanism. Its psychologically observable
> effects are already mediated by realized Need relevance and evidence-aware surprise. Hidden
> Overflow must not affect salience.

A static read of `model/salience.ts` already suggested this structurally: `rawSalience`'s formula
(`Raw = BaseSalience x RoleWeight x Attention x (1+alphaN*NeedRelevance) x (1+alphaS*Surprise)`) has
no Overflow or `SaturationFactor` term, and `cycle.ts::applyChosenAction` only ever threads Overflow
into the trace-only `saturationAnalysis`/Experienced-Reward computation — never into `needImpacts` or
`surpriseEvidenceRecords`, salience's only two inputs beyond role/attention. But per this project's
"don't trust code inspection where a runnable test is possible" norm (the same reasoning that caught
Phase 2.5a's Correction and Phase 2.5b's Correction), the hypothesis was run, not merely read off the
source — four cases, each fixing Mina/Glen/Connection and varying exactly one thing, through the real
`runScriptedExperience` pipeline end-to-end (`experiments/saturationSalienceInteraction.ts`), not
`computeSemanticSalience` called directly with hand-picked inputs, which would beg the question.

**All four cases pass, encoded directly as tests** (`test/phase2_5dSaturationSalienceInteraction.test.ts`):

- **Case 1 — Observational equivalence.** Connection starts at 0.95 (Capacity+ = 0.05) in both
  timelines. Timeline A's true effect is +0.10 (Overflow 0.05); Timeline B's is +0.80 (Overflow
  0.75) — radically different hidden Overflow, identical Applied (+0.05) and evidence kind
  (`lower_bound`). Result: Glen's Need relevance (0.000000 both — Connection's Level, 0.95, is already
  above its 0.80 set point, so `needDeficit`'s own clamp makes Connection's urgency exactly 0 in both
  timelines regardless of Applied), surprise (0.047619 both), raw (0.301714 both), and z (0.231782
  both) are **byte-for-byte identical** between timelines. Mina has no epistemic access to Overflow,
  and none leaked across the Experience boundary.
- **Case 2 — Saturation versus unsaturated utility.** Same true effect (+0.40) both times; only
  Mina's starting Connection Level differs. Starved (Level 0.10, high urgency, Applied lands
  unclipped at +0.40): Need relevance = 0.234450, surprise = 0.285714, z = 0.313705. Near/over-
  satisfied (Level 0.90, above the 0.80 set point — `needDeficit`'s own `max(0, ...)` clamp makes
  urgency exactly 0, Applied clips to +0.10): Need relevance = **0.000000 exactly**, surprise =
  0.090909, z = 0.239070. The starved Experience is strictly more Need-relevant and strictly more
  salient overall — with no additional `SaturationFactor`; `needRelevance` already folds in both the
  larger realized delta and the higher urgency multiplying it.
- **Case 3 — Surprising censored evidence.** Connection at 0.85 (Capacity+ = 0.15); true effect +0.50
  clips to a `lower_bound` observation of exactly +0.15 in both variants. Against an established
  belief of only +0.02 ("surprising"): surprise = 0.115044, z = 0.243074. Against an established
  belief of +0.20, which the same +0.15 bound does not contradict ("consistent"): surprise =
  **0.000000 exactly**, z = 0.223602. Saturation does not merely suppress salience — an informative
  censored bound that genuinely contradicts a character's belief stays highly salient, exactly as
  `surpriseMagnitude`'s evidence-kind-aware formula (`max(0, L-mu)`) predicts.
- **Case 4 — Total saturation.** Connection already at 1.0 exactly; Glen produces an otherwise
  ordinary +0.40 effect that is entirely Overflow (Applied = 0 exactly). Need relevance and surprise
  both land at exactly 0.000000 — but Category x Role x Attention alone (Person x Participant x
  Participant's fixed 0.6 attention) still yields raw = 0.288000, z = 0.223602. Saturation drives the
  Need-relevance and evidence-aware-surprise factors to zero without making the entire Experience
  disappear, exactly as the multiplicative form (`1 + 0 = 1`, not `x 0`) guarantees by construction.

**Verdict.** All four cases behave exactly as the stated hypothesis predicted, using the architecture
that already existed going into this phase — no new field, table, or mechanism was added anywhere in
`model/salience.ts` or `model/cycle.ts` to make these pass. Per the reviewer's own explicit branching
instruction, Brief §24's question is classified **DERIVED**: saturation's psychologically observable
effects on salience are fully mediated by realized Need relevance (which already consumes the Applied,
boundary-clipped delta — never the satisfier's true, un-clipped magnitude) and evidence-aware surprise
(which already consumes the objective `EvidenceKind` Phase 2.5a's censored-learning correction uses),
with no direct Overflow or saturation term required or added. **Phase 2.5 is closed.**

**A standing architectural prohibition, locked in for later phases.** `PotentialEffect`/`Applied`/
`Overflow` stay fully traced — Overflow is valuable world-truth for a researcher inspecting the trace,
and nothing above retracts that. But two paths remain, and must remain, prohibited: **Overflow ↛
Salience** (this phase's finding) and **Overflow ↛ NeedExpectation** (Phase 2.5a's Correction point 3)
— Overflow is simulator-omniscient information no character has epistemic access to. This matters
beyond Phase 2.5: if a future phase (addiction/acquired Needs, Brief §26) demonstrates that a
character experiences something beyond ordinary Need regulation — pleasure, hedonic reward,
intoxication, a "high" that outlasts or exceeds what the regulated Need itself accounts for — that
must be introduced as an explicit, new, experimentally-demonstrated "Experienced Reward" signal with
its own derivation, tested the same way this phase tested salience. It must never be smuggled in as
disguised access to Overflow just because Overflow is already sitting there in the trace, fully
computed and numerically convenient. The distinction between "world truth we record" and "world truth
a character can act, learn, or feel from" is this project's central discipline, and addiction is
exactly the phase where it would be easiest to quietly violate.

**What stays exactly as it was, not revisited.** Per the same review's explicit sign-off: 2.5c's
attention mechanism (fixed values by role, residual-pool splitting for Incidental) and the `(μ, τ)`
representation (see Correction 2 above, with its own honestly-scoped limitation) both clear every
behavioral test asked of them so far and are not touched by this phase. This project's own meta-
pattern, restated because it is what let this phase stay genuinely tiny: find the smallest
deterministic representation that clears the behavioral tests, document where it's an approximation,
and only enrich it when another phenomenon actually breaks it. Nothing here broke it.

### Next-phase justification

With Phase 2.5's three sub-phases (a/b/c) and this closing interaction check all landed, every
question this brief's Phase 2.5 request raised (Brief §16-27) is now DEFERRED (Experienced Reward,
deliberately not wired into behavior), RESOLVED (the `(μ, τ)` representation, Correction 2), or
DERIVED (this entry). Phase 3 (personality/belief/social appraisal, per the Brief's own phase
ordering) is the next open phase gate — not scoped here, since scoping it before Phase 2.5 actually
closed would be exactly the "generalize before an experiment demands it" mistake this log has spent
three sub-phases correcting itself out of.

### Three-part output (Brief §36) for the Saturation/Salience Interaction findings

**Psychological finding.** What determines how memorable an event is to a character is not "how much
of the world actually changed" but "how much of that change she could actually attribute to something,
and how much it discriminated against what she already believed" — both of which are already fully
determined by her own Experience (realized Need effect, evidence semantics), with no separate
accounting for how much of the world's effect she never got to register at all. A saturated character
is not thereby a less-encoding character; she is a character whose Need relevance and surprise happen
to be small for this particular Experience, for reasons her own Experience already fully explains.

**Computational finding.** Four independently-varying cases, run through the same unmodified
multiplicative formula, reproduced every qualitative prediction the hypothesis made — including the
one case (Case 4) where two of the formula's three modulating factors both collapse to exactly zero
without collapsing the raw score to zero, purely because the formula multiplies `(1 + factor)` terms
rather than the factors themselves. That structural property — not a special-cased floor or minimum —
is what Brief §24 asked whether saturation would need, and it turns out the multiplicative-with-1-plus
form Phase 2.5b chose for unrelated reasons (bounding non-negative modulation) already provides it for
free.

**Architectural implication.** This is the cleanest confirmation yet of this project's core operating
principle across all of Phase 2.5: a character-relative Experience layer (causal role, attention, Need
relevance, evidence-aware surprise) mediating between world-truth (Capacity/Applied/Overflow) and every
downstream consumer (learning, salience) is sufficient by itself — extending either consumer with a
direct world-truth shortcut (a `SaturationFactor` here, direct Overflow access there) was never
necessary, and this phase is the first in the sequence to test that absence directly rather than merely
avoid adding the shortcut. The `Overflow ↛ Salience` / `Overflow ↛ NeedExpectation` prohibition this
entry restates is now empirically grounded twice over, not just architecturally asserted once.

## Phase 2.5e — Architecture Consolidation & Behavioral Re-baseline

**Status: RESOLVED. CharacterLab has one canonical execution path. Phase 2.5 is closed on a single,
re-baselined foundation; Phase 3 begins from here.**

This entry is deliberately not new psychology. Phases 2.5a-d each discovered and corrected one piece
of machinery (censored learning, derived salience, evidence-aware surprise, the salience/saturation
boundary) while leaving the OLD, superseded machinery switched on by default — a defensible choice
mid-investigation (an active research branch should not casually change what "CharacterLab's behavior"
means while still being falsified), but a growing architectural risk once the investigation actually
finished. With Phase 2.5d closing the last open question, the research branches themselves became the
biggest remaining risk: three different readers asking "what does CharacterLab actually do" could get
three different, all-correct-for-their-moment answers depending on which phase's params they reached
for. This entry's job is narrow and mechanical: turn everything Phases 0-2.5d actually earned into one
canonical model, retire what it superseded to explicitly-named historical/control conditions, and
re-run every previously-claimed phenomenon through the single resulting path to find out which claims
still hold, which hold in a different form, and which depended on machinery that no longer runs by
default.

### The canonical path

```
WORLD STATE
    |
Action / event resolution
    |
EffectProvenance
    |
bounded Need application
    +-- Applied
    +-- Overflow [trace-only]
    +-- EvidenceKind
    |
character-relative perception
    |
derived attention
    |
derived causal roles
    |
Need relevance
    +
evidence-aware surprise
    |
SemanticExperience
    +-- weighted concepts (ConceptEncoding[])
    +-- observed Need effects (NeedObservation[])
    +-- EvidenceKind
    +-- provenance
    |
 +--------------+---------------+
 v              v               v
NeedExpectation Episodic Memory Association
(mu, tau)                        Graph
    |              |               |
    +--------------+---------------+
                   |
             Accessibility
                   |
          feasible Actions
                   |
             evaluation
                   |
               choice
```

This is CharacterLab's best-supported hypothesis as of Phase 2.5e, not a claim of permanence — every
box above is exactly as falsifiable going forward as it was before this entry, per this project's
running discipline. What changed is that it is now the ONE path `defaultScenario()`/
`defaultCycleParams()` actually run, not one of two co-equal options a caller had to know to select.

### Retired from ordinary execution

Two of these are still-present, still-fully-implemented, deliberately-not-deleted `CycleParams`
settings — retired from being the *default* to being a named, callable historical/control condition:

- **Flat `z=1` co-activation tagging** (`salienceMode: 'legacy'`) — every engaged concept got the same
  weight regardless of causal role, attention, or relevance to what happened. `defaultCycleParams()`
  now sets `salienceMode: 'derived'`; `legacyCycleParams()` (new, `model/scenario.ts`) reproduces the
  old flat-weight behavior byte-for-byte for exactly the comparisons that need it.
- **Naive clipped-delta learning, including the "precision always grows" bug** (`saturation.learningMode:
  'naive'`) — treats a boundary-clipped observation as an exact point measurement, and (pre-Correction-2)
  grew confidence from it regardless of whether it discriminated between hypotheses.
  `defaultSaturationParams()` now returns `{ learningMode: 'censored', ... }`; `legacySaturationParams()`
  (new) reproduces the old naive rule under its own name.

The other two items on this phase's retirement list were never separately-toggleable `CycleParams`
options in the first place — they were intermediate states of the salience pipeline's OWN
implementation, fully replaced (not merely defaulted away from) when Phase 2.5c shipped, with no
runtime switch back to them:

- **Manually assigned causal roles and manually assigned attention** — Phase 2.5b's
  `WorldEventDescriptor`/`unattended` flag required a scenario author to hand-set both per concept.
  Phase 2.5c's `EffectProvenance`/`deriveWorldEventDescriptor` and derived residual-pool attention
  replaced this outright; the old hand-authoring surface no longer exists in the codebase to select.
- **Raw `|Applied-mu|` surprise for censored evidence** — Phase 2.5b's original surprise formula used
  the clipped delta directly regardless of evidence kind; Phase 2.5c's evidence-aware
  `surpriseMagnitude` replaced it unconditionally. There is no parameter that brings the old formula
  back.

Both non-toggleable items are recorded here for completeness (the user-facing retirement list this
phase was asked to produce), not because this entry reintroduces a way to select them.

### Kept, provisional but canonical

"Canonical" does not mean "proven forever" — it means "the simplest model currently surviving all
experiments this project has run, kept as the reference implementation and subject to falsification by
a future one," exactly the standard every prior phase entry in this log has already applied to its own
findings:

- `(mu, tau)` `NeedExpectation`, including the accepted-bound branch's still-documented precision
  over-crediting (Correction 2's own honestly-scoped limitation).
- The independent salience budget (`budgetMode: 'independent'`, Brief §12 Model A).
- The current residual-attention model (fixed values by role; Incidental concepts split a fixed pool).
- The current informative-bound precision treatment (strict-inequality informativeness gate,
  Correction 2).
- The current associative graph (row-substochastic, largest-remainder reallocation, Hebbian
  learning/atrophy).

None of these were re-derived or re-validated by this phase beyond what Phases 0-2.5d already did —
they are canonical because nothing has yet falsified them, the same status every prior finding in this
log has always carried.

### SemanticExperience, formalized

Phases 2.5a-d's real, jointly-earned discovery was not censoring or salience individually — it was
that a coherent object sits between raw world resolution and cognitive learning: what happened,
filtered entirely through what a character could have perceived, attended to, and inferred from it.
This phase gives that object a name and a type (`model/semanticExperience.ts`, new):

```
SemanticExperience
+-- experienceId
+-- actor
+-- occurredAt
+-- action
+-- provenance        (EffectProvenance — what causally happened)
+-- perceivedEvent     (WorldEventDescriptor — the hard perception gate)
+-- conceptEncodings[]
|   +-- concept, category, role, perceived, attention, salience
+-- needObservations[]
|   +-- needId, applied, evidenceKind, surprise
+-- budgetMode
```

Deliberately absent: an `overflow` field, anywhere. This is not an oversight — it is Phase 2.5d's
finding given a permanent, structural form. `SemanticExperience` is exactly the boundary object
mediating world-truth into character-relative belief; a type occupying that role has no legitimate slot
for simulator-omniscient information a character never had epistemic access to. `Overflow` keeps its
own home (`CycleResult.saturationAnalysis`, trace-only, world-truth-side) and never crosses into this
type. `cycle.ts::applyChosenAction` builds one whenever `salienceMode === 'derived'` (now the default)
from data it already computes — this is a packaging change, not a new computation; `semanticSalience`
and `saturationAnalysis` remain on `CycleResult` unchanged, for research/UI granularity and the
world-truth ledger respectively. `SemanticExperience` is what a Phase 3 belief/appraisal system should
consume — it should never need to inspect a raw `WorldOutcomeTable`, `RealizedEffect`, or
`saturationAnalysis` entry directly, exactly the interface boundary Brief §18's Belief system will need.

### Re-running every historical finding

Every previously-claimed phenomenon was re-run through the canonical path (default params, no
overrides) and classified SURVIVES / REFINED / RETRACTED against its originally-recorded finding.
Where a finding's original test asserted numbers or properties specific to the now-retired
architecture, that assertion was NOT deleted — it was re-pointed at `legacyCycleParams()`/
`legacySaturationParams()` explicitly, so it now documents the retired baseline by name instead of
silently describing "the default" it no longer is, and a new adjacent test captures the canonical-path
finding. Real numbers below are from the actual re-run, not predicted.

**1. Need-Satisfaction Learning (primary experiment, Brief §28).** SURVIVES. 20 repeated
Connection-satisfying Experiences with Glen: learned mu rises from a 0 prior to **0.405860**
(Glen's authored effect is 0.40 — Connection never saturates in this scenario by construction, so
canonical and legacy trajectories are identical here), confidence rises to **0.951273**. Unaffected by
the re-baseline because this scenario was never saturation- or salience-sensitive to begin with — its
own `test/determinism.test.ts` assertions (loose `>` thresholds, not exact legacy-shaped numbers)
needed no changes at all.

**2. Preferential attachment / resistance to isolated contradictory evidence.** SURVIVES. The
resistance property (`alpha = rho/(tau+rho)`: an established, high-precision belief moves little from
one contradicting point observation) is a mathematical fact about `updateExpectation`'s point-evidence
formula, unconditional on `learningMode`/`salienceMode` — nothing about the re-baseline touches it.

**3. Glen vs. Priya paired counterfactual (Brief §29).** SURVIVES. After 20 repetitions each: learned
`muGlen = 0.393065`, `muPriya = 0.142723`, gap **0.250342** — Glen's larger authored effect (0.40 vs.
0.15) still separates the two subjects' learned expectations clearly, unaffected by which salience/
saturation mode is default (neither subject's outcome saturates in this scenario).

**4. Habit (Context->Action associative accessibility, Brief §28).** REFINED — this phase's most
consequential reclassification, predicted correctly before it was run. Under `legacyCycleParams()`
(flat `z=1` tagging), `W[context.evening][action.visit_glen]` still converges to exactly **1/2** after
8 repetitions, with the row summing to exactly **1.0** — a fact about flat-weight tagging, reproduced
here as a named historical-control test. Under the canonical default (`salienceMode: 'derived'`), the
SAME 8-repetition run instead converges toward **~0.0267** (`context.evening`'s own derived salience,
as a low-weight `Context`-role concept, is only ~0.0079 — far below the Action's ~0.53 and the Person's
~0.27 — so the row itself never approaches saturation the way flat tagging drove it to exactly 1.0; the
row sum after 8 reps is **~0.0399**, nowhere near 1.0). What survives is the underlying edge RATIO:
`W[context][action.visit_glen]` (Cause role) ends up roughly **2x** `W[context][person.glen]`
(Participant role) under canonical salience — role-weighted, not evenly split — and the substantive
Habit claim survives unchanged: repeated Context/Action co-Experience still makes the Action
increasingly, and durably, accessible from Context alone (`contextOnlyActivation` reaches
action.visit_glen at **0.020462** after 100 repetitions, while Priya — never associated with this
Context — stays at exactly **0**). The exact "1/2" figure was always a fact about equal-weight tagging,
never itself the finding; it is now historical trivia, correctly demoted.

**5. Substitution (negative result, Brief §28-29).** SURVIVES, definitionally. Every assertion this
experiment makes is structural (`solveActivation` has no world-flags parameter at all, so Priya's
accessibility must be bit-for-bit identical whether or not Glen is available) rather than
numeric-value-specific — the proof is architecture-invariant by construction, unaffected by whichever
salience/saturation mode computed the association graph's actual learned weights.

**6. Avoidance (derived from Phase 1 alone, Brief §27-28).** REFINED. The primary finding (5
repetitions, the clean non-saturating regime) SURVIVES unchanged: mu stays pinned at exactly the true
**-0.08** effect, confidence rises monotonically, Pr(the aversive action) falls monotonically — this
regime never exercises saturation at all, so `learningMode` was never a variable here. The SECONDARY
finding (extending to 7 repetitions, 2 past the clean regime, "reproduces the ceiling-saturation
finding at the opposite boundary") is **RETRACTED as default behavior**: under `legacyCycleParams()`
(naive learning), mu still gets pulled back toward 0 by floor-clamped observations, exactly as
originally recorded — kept as a named historical-control test. Under the canonical default (censored
learning), the same 7-repetition extension no longer corrupts mu at all: it stays pinned at exactly
**-0.08** through every repetition, floor-saturated ones included, because a floor-clipped observation
that merely confirms what is already believed is correctly recognized as uninformative (Correction 2's
gate) rather than treated as fresh evidence pulling toward 0. Avoidance itself still holds
(Pr(the aversive action) still ends up lower than where it started), but its own "mirrors Phase 1's
ceiling-saturation artifact" framing was precisely the bug Phase 2.5a exists to fix — this is the
clearest demonstration in this entry that the fix is not just theoretically motivated but changes real
downstream behavior for the better, exactly where the original Phase 1/2 finding predicted a problem.

**7. Memory accessibility — recency, frequency/reinforcement, decay, retrieval reinforcement (Brief
§17).** SURVIVES, untouched. `runMemoryAccessibilityExperiment` operates directly on `memory.ts`'s
formulas from authored fixture data — it never constructs a `CycleParams` or runs a cognitive cycle at
all, so it was never reachable by this re-baseline in the first place.

**8. Boundary saturation scenarios (Brief §21/§22's required sweep and counterfactual).** SURVIVES as
findings, PROMOTED in status. Both experiments already swept `learningMode` as an explicit variable
(`['naive', 'censored']`), independent of whatever `CycleParams` default was in effect, so their own
numbers (documented in the Phase 2.5a entry and Correction 2) are completely unaffected by this
re-baseline. What changed is which of the two swept conditions is now "what CharacterLab does when you
don't ask it to do something else" — 'censored' graduates from opt-in comparison arm to canonical
default, matching every other re-baselined default in this entry.

**Summary: 6 of 8 SURVIVE unchanged, 2 are REFINED (Habit, Avoidance) — zero RETRACTED outright.** No
previously-published psychological claim in this log turned out to be simply wrong; the two REFINED
cases are exactly the two places this project's own architecture was, by Phases 2.5a/2.5b's own
diagnosis, most likely to have been reporting an artifact rather than a finding — and re-running them
confirms that diagnosis rather than surprising it.

### Three-part output (Brief §36) for the Architecture Consolidation & Behavioral Re-baseline

**Psychological finding.** Every substantive psychological claim this project has made since Phase 0 —
that Mina learns to prefer a reliable satisfier, resists isolated contradiction, forms habits from
repeated co-Experience, avoids what hurts her, substitutes nothing she hasn't independently learned to
want, and remembers recently- and frequently-retrieved things better — survives being run through a
strictly more careful architecture unchanged in kind, and in five of six numerically-checked cases
unchanged in degree. The two places degree DID change (Habit's exact weight, Avoidance's floor-boundary
behavior) are exactly the two places this project had already flagged its own older machinery as
producing an artifact rather than a finding — re-baselining did not surprise this project about its own
psychology; it corrected exactly the two spots it had already told itself to watch.

**Computational finding.** A dual-mode, opt-in-by-default architecture is the right way to develop a
falsifiable research model UNDER ACTIVE INVESTIGATION, and the wrong steady state once the
investigation concludes. Every phase from 2.5a onward deliberately kept its new mechanism off by
default so 76+ pre-existing findings couldn't silently regress while the mechanism was still being
checked — exactly the discipline that let Phases 2.5a-d ship incrementally and get corrected in place
without ever breaking the existing suite. But "keep the new thing opt-in" and "keep the OLD thing as
the default forever" are different policies, and conflating them past the point where the new thing is
actually validated (Phase 2.5d's closing DERIVED classification) is itself a form of technical debt —
this entry's actual work was recognizing that the investigation had concluded and the compatibility
scaffolding had become the risk it was built to prevent.

**Architectural implication.** `SemanticExperience` is this project's first formalized type that names
a genuinely new architectural LAYER rather than a mechanism within an existing one — Phases 0-2 had
Needs, Actions, Expectations, Associations, and Memory; Phase 2.5 discovered, piece by piece, that a
sixth thing already existed in the data flow between world-resolution and every one of those five, and
this entry is what gives it a name, a file, and an explicit "Overflow does not belong here" boundary.
That a boundary object could be discovered empirically — one field at a time, across four sub-phases,
each individually motivated by a different bug or missing mechanism — rather than designed upfront, is
itself evidence for this project's core method: build the smallest thing that clears the current
behavioral tests, and let the architecture that was actually needed reveal itself through what keeps
needing to be threaded through by hand until it gets a name. Phase 3 is the first phase in this project
built to consume that layer from day one rather than discover it retroactively.

### Next-phase justification

Phase 2.5 is closed on a single canonical path, with every historical finding re-validated against it
and a formalized `SemanticExperience` type ready to be Phase 3's input boundary. Phase 3
(personality/belief/social appraisal, per the Brief's own phase ordering) can now ask a genuinely new
question instead of continuing to repair old foundations: **given a coherent `SemanticExperience`, how
does a character form and revise beliefs about other people, and how do those beliefs become socially
meaningful?** That question is not scoped here — scoping it before this consolidation actually landed
would have repeated the exact mistake this entry exists to correct, building on a foundation that was
still two co-equal architectures pretending to be one.

## Phase 2.9 — Decision Authorship, Acquired Identity, and the Role of Dice

**Status: RESOLVED. All eleven lettered experiments (A-K) from the Phase 2.9 Research Brief's
Required Experiment Suite run against real `runDecisionCycle` output, every number below taken
directly from those runs.**

This phase asked a question none of Phases 0-2.5e's machinery could answer: given a specific, named
dilemma with a small number of psychologically live Options, how does CharacterLab decide, and what
does the resolution of that dilemma leave behind? `model/decision.ts` and `model/identity.ts` are new;
`model/cycle.ts::runDecisionCycle` is a new sibling entry point to `runAutonomousCycle`, sharing the
existing outcome/learning/memory/association tail via the now-exported `applyChosenAction`; nothing
about ordinary autonomous cycles changed. Three experiment files
(`decisionResolution.ts`/`identityFormation.ts`/`seedDivergence.ts`) implement the brief's eleven
lettered cases; `test/phase2_9Decision.test.ts`, `phase2_9Identity.test.ts`,
`phase2_9DecisionResolution.test.ts`, `phase2_9IdentityFormation.test.ts`, and
`phase2_9SeedDivergence.test.ts` assert every one of them against live output.

### Scoping decisions, stated up front

1. **No latent personality vector (P) this phase.** The master Brief assigns P to Phase 3; none of
   Experiments A-K require it (Need urgency, NeedExpectation, accessibility, and the new
   IdentityConsistency channel are sufficient sources). Brief §35's "no legal transition mutates the
   7-dimensional personality vector" invariant is **vacuously satisfied** — the vector does not exist
   yet — recorded here rather than tested against nonexistent state. Brief §23's "avoid
   double-counting personality" warning is preserved as a documented future constraint in
   `decision.ts`'s own module comment for whenever Phase 3 adds P.
2. **`Decision` is a new, parallel front-end to Action selection**, never a replacement for
   `choice.ts`'s softmax pipeline. `runDecisionCycle` is used only for an explicitly-authored
   small-Option dilemma; it hands off to the same `applyChosenAction` tail every other entry point
   already uses once a winning Option is resolved.
3. **RNG addressing reuses `kernel/random.ts` verbatim.** `eventId = decisionId`, `purposeId =
   'decision_roll'` (or `'decision_tie_break'` for the tie-resolution draw), `drawIndex` = the
   Influence's canonical ordinal position among all surviving Influences in the Decision — no kernel
   RNG changes were needed.
4. **Exact discrete distributions are a new, Decision-agnostic kernel primitive**
   (`kernel/discreteDistribution.ts`) — pure finite-integer-support rational-PMF math, knowing
   nothing about Decisions, Options, or Influences.
5. **Option/Influence/Decision identity is reused, not newly minted**: an Option's identity is its
   backing `ActionDef.actionKey`; a `DecisionId` reuses `SimEvent.eventId` directly.
6. **An `identityFeedbackEnabled` ablation switch on `DecisionParams`** (default `true`) lets any
   "identity specifically causes this" claim be verified as a measured difference between two
   same-seed, same-sequence runs rather than assumed — used throughout Experiments E/G/H/I/J below.
7. **Influence strengths are bounded before calibration**: every `DecisionInfluence.signedStrength`
   used for die-size lookup and `sign()` is `Rational.boundedResponse(rawStrength)`, so the die-scale
   threshold table means the same thing regardless of which system (Need urgency, accessibility,
   identity) produced the raw value.

### The `winProbabilities` fair-tie-share proof

`kernel/discreteDistribution.ts::winProbabilities` computes exact pre-roll win probabilities for K
independent discrete `RollScore` distributions, splitting an exact tie among however many options
share the max value. This is the single most load-bearing piece of new kernel math in the phase — if
it were wrong, every downstream Margin/Contest/Stake/AuthorshipPotential number would be wrong too —
so it is checked two ways in `test/discreteDistribution.test.ts`, not one: (a) the general K-option
formula reduces algebraically, and is checked numerically, to the textbook two-option formula
`P_1 = Sum_v pmf_1(v)*CDF_2(v-1) + (1/2)*Sum_v pmf_1(v)*pmf_2(v)` for a concrete d4-vs-d6 case; (b)
for small K/N the formula's output is checked against **brute-force enumeration** over every possible
combination of die faces — the only place in this phase's test suite where the tie-share math is
checked against ground truth rather than against itself. Both checks pass exactly (exact-rational
equality, not within-tolerance). `totalProbability(d)` is also asserted to equal `Rational.ONE` exactly
across every convolution exercised in the suite — Brief §35's normalization obligation, checked
directly rather than assumed.

### Die-ratio and the consolidation ceiling

Tuning `strongSide`/`weakSide` (the two `BiasedSide` presets used throughout `identityFormation.ts`)
surfaced a real structural finding about how big a repeated pre-roll split has to be before repeated
choice can ever consolidate a named trait. `Dependable`'s projection over `IdentityStrength` is bounded
by `boundedResponse`, so a K:1 pre-roll split's own **asymptotic ceiling** — the largest
IdentityStrength that split can ever produce, however many rounds run — is `boundedResponse((K-1)/(K+1))`.
Empirically sweeping K against `thetaTrait = 0.30`: a 2:1 split's ceiling caps out around **0.25**, a
3:1 split around **0.29** — both structurally short of consolidation no matter how many rounds run,
not merely slow to reach it. A 4:1 split (`strongSide` calibrated to a die-scale "very strong" d10
against `weakSide`'s "weak" d4) has ceiling `boundedResponse(3/5) = 0.375`, clearing `thetaTrait` with
real margin. This is why `strongSide`/`weakSide` are calibrated to specific die brackets rather than
arbitrary NeedExpectation values — the die-scale thresholds are not just a resolution-mode knob, they
directly set the ceiling on what repeated choice can ever prove about a character. Experiment E (below)
confirms this ceiling is reachable, not just asymptotically approached: 24 rounds already clear
`thetaTrait`.

### Experiments A-D, K — Decision mechanics (`decisionResolution.ts`)

All five share one harness (`runDecisionSample`): `defaultDecisionScenario()`'s baseline, a
case-specific NeedExpectation/NeedLevel override, resolved through real `runDecisionCycle` calls.

**A — Residual uncertainty.** `defaultDecisionScenario()`'s own symmetric baseline: both Options land
at exactly **P=0.5000**, `resolutionMode=PlayerFacingRoll`, two d4 dice actually rolled
(`keep_dinner_promise:d4+1`, `stay_at_work:d4+1`, a real tie broken candidate-by-candidate by
`winProbabilities`' own fair-share math). Neither raw Need pressure nor the (unmodeled) personality
vector deterministically picks a winner — verified directly (`bothProbabilitiesNontrivial=true`,
`usedDice=true`).

**B — Obvious choice.** Keep Dinner given a near-certain (mu=0.95), well-established (tau=20)
Connection expectation against a severely depleted Connection Level, versus Stay At Work's near-zero,
equally well-established Achievement expectation against a nearly-satisfied Achievement Level: Margin
jumps to **1.0000**, Contest to **0.0000**, `resolutionMode=Auto`, zero dice rolled
(`marginHigh=contestLow=autoResolved=noDiceRolled=true`) — no unnecessary stochasticity when one Option
is genuinely overwhelming.

**C — Trivial uncertainty** (Brief §10's own "tea or coffee?" example). Both Options seeded with a
genuine but tiny NeedExpectation (mu=0.03) — small enough that `boundedResponse` keeps every resulting
Influence below `dieScale.weak` (0.10), so BOTH Options end up with **zero surviving Influences**. The
Decision still requires a roll (a fair coin-flip tie-break among two zero-evidence Options,
`resolutionMode=QuietRoll`, Contest=1.0 because both pre-roll probabilities are exactly 0.5 with
nothing distinguishing them) but never becomes player-facing, and Stake stays at exactly **0.0000**
(`ConflictMass=min(0,0)=0`) — a genuinely trivial decision produces genuinely trivial
AuthorshipPotential, and Identity Evidence never moves (`identityEvidenceStaysSmall=true`, in fact
exactly zero — no `identityExpressions` at all, since `AuthorshipPotential=0` zeroes every
`ExpressionStrength`).

**D — Meaningful conflict** (Brief §10's "keep promise to Glen or protect my exhausted self," modeled
as Keep Dinner vs. Stay At Work). Both Options given a strong (mu=0.9), well-established (tau=10)
NeedExpectation — real, comparable motivational mass on both sides. AuthorshipPotential reaches
**0.7778**, `resolutionMode=PlayerFacingRoll`, real d6-vs-d6 dice (`keep_dinner:d6+6`,
`stay_at_work:d6+4`), and Identity Evidence lands at **±0.2001** on the CommitmentFidelity/
WorkPersistence channels — comfortably past the 0.10 "substantial" threshold this experiment checks
(`highAuthorship=playerFacing=substantialIdentityEvidence=true`).

**K — Intent versus physical outcome.** Reuses D's exact contested setup and seed, then forces the
PHYSICALLY EXECUTED Action/WorldOutcomeTable to an unrelated Betrayal table while leaving the dice
resolution itself untouched. The dice-selected Option is identical in both runs
(`chosenIntent=action.keep_dinner_promise` in both, `intentPreserved=true`) and Identity Evidence is
computed from that same intent in both cases — but `forced.executedAction.actionKey =
action.betrayal_glen`, physically different from what was decided (`physicalOutcomeDiffers=true`).
This is the existing `applyChosenAction`/`forcedOutcomeOverride` plumbing doing double duty exactly as
planned: no new "intent vs. outcome" machinery was needed, because `DecisionExpression.chosenIntent`
and the executed `ActionDef` were already two separately-trackable values.

### Experiments E, G, H — Identity formation (`identityFormation.ts`)

**E — Trait acquisition.** 24 repeated dinner-vs-work Decisions, 4:1 biased (`strongSide`/`weakSide`,
see above), run with `identityFeedbackEnabled: false` — a deliberate acquisition-isolation ablation:
running WITH feedback enabled would let Experiment H's self-stabilization dynamic (below) freeze
evidence growth before consolidation is reached, confounding "does repeated behavior alone build
evidence" with "does established identity limit its own future growth." CommitmentFidelity's
IdentityStrength rises from **0.0537** (round 0) to **0.4807** (round 23); final accumulated evidence
is `support=2.4993, opposition=0.2272` — real, if imperfect, discrimination (a 4:1 split still loses
occasionally, and every loss adds real opposition evidence via `Alignment`'s subtraction term). The
single-channel `Dependable` trait (Brief §21's own worked example: all-zero `Q`, `w`=1 at
CommitmentFidelity) is **consolidated by the end of the run**
(`traitConsolidatedByEnd=true`) — with no trait ever explicitly authored onto the character; consolidation
is checked purely by projecting `DEPENDABLE_TRAIT` over the accumulated `IdentityEvidenceState`.

**G — Identity feedback.** Starting from Experiment E's consolidated state, one more matching Decision
run twice, same seed, feedback on vs. off. WITH feedback: `resolutionMode=Auto`, Margin=**0.9906**,
P(Keep Dinner)=**0.9953** — CommitmentFidelity's own `identity_consistency` Influence (Alignment=0.3976)
adds enough pressure to auto-resolve what would otherwise still be a real roll. WITHOUT feedback (same
seed, same underlying Need state): `resolutionMode=QuietRoll`, Margin=**0.6000**, P(Keep Dinner)=
**0.8000**, real d10-vs-d4 dice thrown. The compatible Option's probability is measurably higher with
feedback (0.9953 > 0.8000, `compatibleOptionProbabilityRises=true`) — IdentityConsistency is a real,
load-bearing reason, not a cosmetic one — while neither run collapses either probability to exactly 0
or 1 (`neitherOptionDictated=true`): identity strengthens a reason, it never dictates the Action.

**H — Self-stabilization** (Brief §24's own hypothesis). The identical repeated-Decision harness E
uses, extended to 30 rounds with feedback left at its ordinary default (`true`). Average Contest over
the first third of rounds is **0.3609**; over the last third, **0.0094** (`contestFell=true`) — as
CommitmentFidelity strengthens, IdentityConsistency increasingly separates the two Options'
probabilities, exactly as predicted. Total identity-evidence magnitude added over the first third is
**1.3161**; over the last third, **0.0399** (`evidenceGrowthSlowed=true`) — a real, mechanically
necessary consequence, not a separate assumption: falling Contest shrinks AuthorshipPotential
(`Contest x Stake`), which shrinks `ExpressionStrength = Alignment x AuthorshipPotential` for every
future round. This is a self-LIMITING loop, not a runaway one — individual rolls stay genuinely
stochastic throughout (Brief §25's "identity must not eliminate meaningful agency"), and the comparison
is first-third-vs-last-third rather than asserted round-over-round monotonicity for exactly that
reason.

### Experiment I — Identity fault line, and the Alignment floor-rescue impossibility (Brief §26)

This experiment's shape changed during empirical verification from the plan's original framing — "raw
Need alone makes Keep Dinner nearly automatic; an established OPPOSING identity re-contests it, Auto
becomes PlayerFacingRoll" — because that framing is **mathematically unreachable** under the implemented
`Alignment`/`identityConsistency` formulas, a real structural fact worth stating precisely:

```
Alignment(o,k) = boundedResponse( TaggedPressure(o,k) - Sum_over_others TaggedPressure(o',k) )
```

Since `boundedResponse(x) < x` for every `x > 0`, `Alignment(o,k)` can never exceed option `o`'s OWN
raw tagged pressure. An "obvious choice" baseline requires the underdog Option's raw Need-sourced
Influence to already sit BELOW `thetaInfluenceFloor` (0.10) — that is precisely how it ends up with no
die at all. But that same sub-floor raw pressure caps the underdog's own identity Alignment strictly
below `boundedResponse(0.10) ~= 0.0909`, itself already below the floor. Because `identityConsistency`
sums Alignment across channels — and any opposing channel (here, CommitmentFidelity, anchored to the
LEADING option's own pressure) only pulls the total further down — **no identity strength, however
large (strength itself is bounded strictly below 1), can lift a floored option's identity-consistency
Influence back up to the floor.** Identity can shift a Decision between two Options that are ALREADY
both in the dice; it cannot resurrect one that raw Need pressure alone has already ruled out. This is
verified directly, not assumed: an obvious-baseline setup (Speak Up's own raw Recognition pressure kept
deliberately below the floor) resolves to `Contest=0.0000, resolutionMode=Auto` **identically** whether
`identityFeedbackEnabled` is `true` or `false` (`identityCannotRescueAFlooredOption=true`), even with
RiskAcceptance independently established at strength 0.4283 by that point in the run.

Given that finding, the experiment verifies the strongest TRUE claim the system supports instead: two
INDEPENDENTLY-earned, OPPOSING identities — CommitmentFidelity (a short, deliberately under-established
4-round acquisition, ending at strength **0.0926**) and RiskAcceptance (a long, 200-round acquisition
approaching its own ceiling, ending at strength **0.4283**) — measurably shift a Decision where BOTH
Options already survive on raw Need alone (Keep Dinner's Connection deficit at the bare "moderate," d6,
threshold; Speak Up's Recognition deficit just under it, d4). WITH identity: `resolutionMode=Auto`,
Margin=**0.9844**, P(Speak Up)=**0.9922**. WITHOUT identity: `resolutionMode=PlayerFacingRoll`,
Margin=**0.3333**, P(Speak Up)=**0.6667**, real d4-vs-d6 dice thrown. The shift is unambiguous
(`identityMeasurablyShiftedTheContestedDecision=true`) and neither run ever collapses a probability to
exactly 0 or 1 (`neitherRunDictatedTheContestedDecision=true`). The deliberate CF-weak/RA-strong
asymmetry is itself a finding, not an arbitrary tuning choice: probing found that two COMPARABLY
strong opposing identities (both run to similar strength) very nearly cancel in `identityConsistency`'s
sum and never clear the floor on either side — **comparably-matched competing identities mostly
neutralize each other's dice-shaping power; only a sufficiently lopsided pair actually moves the
resolution.** And when it does move it, per the arithmetic above, it moves it as a discrete jump — a
whole extra die crossing the floor — not a gradual one: Margin here jumps from 0.3333 to 0.9844, not
through any intermediate value. There is no regime in this reference model where identity feedback
produces a small, continuous shift in a Decision's resolution — it is either silent (below floor, no
effect at all) or it adds a whole die (a potentially large, discontinuous effect).

### Experiment J — Contradiction, and identity's self-protective feedback (Brief §27)

After Experiment E's harness runs 50 rounds (a longer baseline than E's own default 24 — this seed
needed the extra rounds to actually cross `thetaTrait`; a sweep at 24/30/40/50/60 rounds found the
threshold crossed only at 50, strength **0.3365 -> 0.3361 -> 0.3819 -> 0.4733 -> 0.5154** against
`thetaTrait/(1-thetaTrait) ~= 0.4286`), `Dependable` is solidly consolidated
(`consolidatedAfterE=true`, `strengthAfterE=0.4733`). One HIGH-AUTHORSHIP contradicting round (Work's
expectation now higher than Glen's, so Stay At Work usually wins, while Glen's CommitmentFidelity-tagged
pressure remains real — so `Alignment(StayAtWork, CommitmentFidelity)` comes out negative, adding
Opposition evidence) does NOT erase the trait (`consolidatedAfterOneContradiction=true`) — a single
contradiction is not enough to undo an established pattern. 30 further contradicting rounds DO reduce
strength (**0.4733 -> 0.3707**, `strengthDropped=true`) and eventually un-consolidate the trait
(`consolidatedAfterManyContradictions=false`).

Reaching that clean result required a real fix, and the fix is itself a finding worth recording:
running the contradiction rounds with the ORDINARY default (`identityFeedbackEnabled: true`) was tried
first, and strength stayed FLAT or even ROSE across 60+ contradiction rounds instead of declining. The
mechanism is Experiment H's own self-stabilization dynamic, now running in reverse: once
CommitmentFidelity is strongly established, its OWN `identity_consistency` Influence actively OPPOSES
Stay At Work every round (a negative Alignment, weighted by CommitmentFidelity's already-high strength),
pulling the "contradiction" bias's own dice back toward Keep Dinner and suppressing the very Opposition
evidence the contradiction round was trying to add. **An established identity actively resists
behavioral contradiction through the same feedback channel that built it.** The fix — disabling
`identityFeedbackEnabled` for the contradiction rounds, exactly as Experiment E isolates pure
behavioral acquisition — isolates "does repeated CONTRARY BEHAVIOR ALONE erode evidence" from "does
identity's own feedback resist the erosion," which are genuinely different questions this reference
model now answers separately.

### Experiment F — Seed divergence, the flagship claim ("dice cumulatively author character identity")

Two characters, Timeline A and Timeline B, start from byte-identical initial state and face the exact
same sequence of 40 genuinely-ambiguous dinner-vs-work Decisions (`kernel/random.ts`'s counter-addressed
oracle means changing only the seed changes every roll from round 1 onward while leaving every other
input identical) — differing ONLY in deterministic seed. Reaching a "genuinely ambiguous" symmetric bias
itself required three rounds of empirical tuning: a symmetric WEAK (d4/d4) bias never produces
measurable divergence at all (raw pressure too small for IdentityConsistency's Alignment to ever clear
the floor, so both timelines random-walk toward zero regardless of seed); a symmetric EXTREME (d12/d12)
bias overshoots the other way (one contested round's AuthorshipPotential is already big enough to clear
the floor for the very next round, freezing the Decision to `Auto` from round 2 onward — if the two
seeds' first rolls happen to coincide, a real ~50% event, their whole biographies become byte-identical);
a symmetric MODERATE (d6/d6) bias is the working choice — strong enough to eventually self-reinforce,
weak enough that several genuinely-contested rounds happen first.

The full causal chain the brief predicts holds at every link, checked against real output rather than
assumed at the end: early dice rolls genuinely differ between seeds within the first 5 rounds
(`firstRoundRollsDiffered=true`); that shows up in which Option gets chosen in at least one early round
(`earlyDecisionExpressionsDiffered=true`); by round 40 the two characters have accumulated measurably
different CommitmentFidelity evidence (IdentityStrength **-0.2315** vs. **-0.0772**,
`acquiredIdentitiesDiffered=true`); and presented with an IDENTICAL next Decision (same raw-Need
baseline, same third, independently-addressed seed for the roll itself), each character's own
already-different identity answers it differently: Timeline A resolves `Auto`, P(Stay At
Work)=**0.8625**; Timeline B resolves `PlayerFacingRoll`, real d10-vs-d10 dice, P(Stay At
Work)=**0.5000** exactly (`laterProbabilitiesDiffered=true`). Two characters who share every authored
fact about their world differ, durably and measurably, purely because of which way independent dice
fell early on — this is Brief §30's flagship claim, verified end to end against a real paired
counterfactual rather than a single anecdote.

### Three-part output (Brief §36) for Decision Authorship, Acquired Identity, and the Role of Dice

**Psychological finding.** A character's identity, in this reference model, is not something a scenario
author assigns — it is a residue that specific, dice-resolved choices leave behind, and that residue
behaves like a real research finding rather than a designed one: it consolidates only past a real
motivational-split ceiling (Experiment E/the die-ratio finding), it self-stabilizes once established
(Experiment H), it resists behavioral contradiction through the same channel that built it (Experiment
J), it can shift a genuinely live decision without ever dictating one (Experiments G/I), and it cannot
retroactively rescue a choice raw motivation had already ruled out (Experiment I's impossibility proof).
Two characters who share an identical authored world and differ only in which way early dice fell go on
to become measurably, durably different people (Experiment F) — acquired identity here is a genuine
emergent consequence of stochastic choice under pressure, not a label attached to it.

**Computational finding.** A dice-quantized reference model has a genuinely different failure/success
shape than a continuous one: `thetaInfluenceFloor` and the die-size brackets mean identity's own
feedback contribution is either completely silent (below floor, exactly as if it did not exist) or
suddenly decisive (a whole extra die, capable of flipping a near-even Margin to near-certainty in one
step) — there is no smoothly-graded middle regime in this system, and treating the two extremes as if
they were points on a continuum (as the original Experiment I framing implicitly did) leads to
predictions the actual formulas cannot honor. Finding this out required exactly this project's standing
discipline: probe the real system's numbers before trusting a hand-derived prediction, and when a
planned experiment turns out to be unreachable, redesign it to verify the strongest true claim instead
of silently patching the target until the assertion passes.

**Architectural implication.** `Decision`/`DecisionExpression`/`IdentityEvidenceState` slot into the
existing cognitive cycle as a genuine sibling to ordinary autonomous action selection, not a
replacement or a special case bolted alongside it — the same `applyChosenAction` tail, the same
counter-addressed RNG discipline, the same NeedExpectation/accessibility inputs, with exactly one new
Influence source (`identity_consistency`) added to the mix. `CharacterState.decisionHistory` gives any
future system full inspectability into every Decision a character has ever faced, and
`identityEvidence` gives it a compact, quantized summary of what that history has amounted to — exactly
the shape of object Brief §33 says Phase 3's belief formation will need as input, built here without
needing to guess at Phase 3's own requirements in advance.

### Next-phase justification

Phase 2.9 gives CharacterLab something it never had: a way for a character's biography to durably shape
who that character is becoming, entirely through mechanisms already validated elsewhere in this project
(exact rational arithmetic, counter-addressed determinism, the existing Need/Expectation/Accessibility
pipeline) plus one new, carefully-scoped feedback channel. Phase 3 (personality, belief, and social
appraisal, per the master Brief's own phase ordering) can now ask a question this phase deliberately
left unanswered: **given a `DecisionExpression` history and a consolidated `IdentityEvidenceState`, how
does ANOTHER character infer belief about this one** — the direct target Brief §33 names for
`DecisionExpression` as an input to belief formation — and, separately, how does the latent personality
vector P this phase explicitly declined to build interact with the Decision/Identity pipeline now that
one exists to interact with, honoring Brief §23's double-counting warning from day one instead of
discovering the need for it after the fact.

## Phase 2.95 — Reason Consolidation & Identity Fault Lines

**Status: RESOLVED. All five target behaviors (A-E) from an external review of the Phase 2.9 write-up
run against real `runDecisionCycle` output, every number below taken directly from those runs.**

An external review of Phase 2.9's RESOLVED write-up read the entry above and identified a single root
structural cause behind two of its own findings that Phase 2.9 had reported as fundamental limits of a
dice-quantized reference model rather than as implementation gaps: Experiment E only demonstrated smooth
evidence accumulation with `identityFeedbackEnabled: false`, never under the ordinary feedback-on loop
(the "self-stabilization would freeze it early" argument), and Experiment I never produced a genuine
"opposing identity re-contests an otherwise near-automatic decision" outcome — only near-total
cancellation, or a discrete whole-extra-die flip that handed the decision outright to whichever side
identity favored. The review traced both to the same cause, and Phase 2.9's own §26 write-up had
already, unknowingly, proven it mathematically: under that architecture, `identityConsistency` was
assembled into its OWN separate `DecisionInfluence`, subject to its OWN independent
`thetaInfluenceFloor` check. `Alignment(o,k) = boundedResponse(TaggedPressure(o,k) - Sum_others)` can
never exceed an option's own raw tagged pressure, so identity's contribution was structurally
"all-or-nothing" per option — it could never COMBINE with an already-present but individually sub-floor
Need signal on the same topic to jointly clear the floor. This section records the architectural fix
and the five target behaviors (A-E) the review specified to verify it actually closes the gap.

### The fix: one shared consolidation pool, not two

Three modules changed. `model/decision.ts` gained `sumRawBySemanticChannel` (sums raw, pre-`boundedResponse`
pressures by semantic channel — the first half of consolidation, exposed on its own so a caller can fold
MORE raw pressure into the same pool before anyone bounds or floors it), `boundAndFloorChannels` (bounds
then floor-filters — the dice-eligible result), and `boundAllChannels` (dense, bounded, but NOT
floor-filtered — used only where a channel's "meaning" must not be gated by dice-eligibility).
`model/identity.ts` gained `identityFeedbackRawInfluences`, which decomposes identity's per-channel pull
into separate `RawReasonInfluence`s tagged `identity:<channel>` — raw, unbounded contributions that feed
into the SAME per-option raw pool as Need/accessibility, rather than becoming their own independently-
floored `DecisionInfluence`. `model/cycle.ts::runDecisionCycle` was rewritten around this: it builds a
Need/accessibility-only bounded (not floored) map per option first — used EXCLUSIVELY for identity's own
expression/evidence generation (`touchedChannels`/`Alignment`), preserving Brief §23's "no
double-counting" rule that identity's own feedback must never feed back into producing MORE identity
evidence for the same channel — and separately, per option, merges that option's raw Need/accessibility
pool with identity's raw per-channel pull (when `identityFeedbackEnabled`) into ONE pool, bound-and-
floored exactly once, which is what actually becomes the `DecisionInfluence[]` driving dice and
resolution. This two-map separation is the key design insight: it makes "identity's own evidence
generation never double-counts itself" and "identity can combine with weak Need to clear the floor"
simultaneously true, where Phase 2.9's single-map architecture could only have one or the other.

One structural property survives the fix unchanged, and is worth stating plainly rather than glossing
over: die-bracket quantization is inherent to this reference model's five authored discrete size bands.
The underlying pre-bracket consolidated value is, by construction, a smooth, continuous, monotonically
saturating sum of two bounded-or-boundable quantities run through one shared `boundedResponse` call —
but resolved PROBABILITY still jumps at bracket boundaries, because `strengthToDie`'s five buckets are an
AUTHORED discrete scale, never meant to be continuous. What Phase 2.95 changes is not "make dice
continuous" — it is which side of an existing bracket boundary a combined signal lands on, and whether a
combination that used to be mathematically unreachable (two independently sub-floor signals rescuing each
other) is now reachable at all.

### Target A — Gradual identity influence

Sweeping established CommitmentFidelity evidence (Support only, Opposition fixed at 0) from 0 to 30 in
0.1 steps (301 samples) against a fixed symmetric dinner-vs-work baseline: P(Keep Dinner) starts at
**0.5000** (`PlayerFacingRoll`, support=0), rises through one real bracket transition
(`largestSingleStepJump=0.3906`, at support 8.1 → 8.2: P **0.5000 → 0.8906**), and ends at **0.8906**
(`resolutionMode=Auto`, support=30) — never dipping (`probabilityMonotonicNondecreasing=true`) and never
reaching exactly 0 or 1 even at this extreme saturation level (`neverFullyDictatesEvenAtSaturation=true`).
Honest scoping, found empirically rather than assumed: the underlying consolidated Rational value is
provably continuous by construction, but the five-band die scale still produces one visible, localized
jump rather than a smooth ramp — this is the die-bracket property described above, not a residual defect
in the fix.

### Target B — Weak-signal combination

Keep Dinner's own raw `commitment`-channel Need pressure (Glen mu=0.25) is real but individually below
`thetaInfluenceFloor` — alone (`identityFeedbackEnabled: false`), it gets no die at all: P(Keep
Dinner)=**0.0000**, `resolutionMode=Auto` (`needAloneNeverClearsTheFloor=true`). The identical weak
CommitmentFidelity evidence (Support=1) run in isolation against a near-zero-mu control is independently
confirmed too weak to clear the floor on its own (`identityAloneWouldBeTooWeakToo=true`) — proving Target
B genuinely tests COMBINATION, not one channel quietly doing all the work. Consolidated together on the
shared `commitment` channel, Keep Dinner gets a real, surviving die: P(Keep Dinner)=**0.3333**,
`resolutionMode=PlayerFacingRoll`, Contest=**0.6667**, two dice actually rolled
(`combinedTheyClearIt=true`). This is the review's central ask, made concrete and empirically verified:
the floor-rescue Phase 2.9's own Experiment I proved mathematically impossible under the old architecture
now demonstrably happens.

### Target C — A real identity fault line

Where Phase 2.9's Experiment I could only ever produce near-total cancellation or a discrete whole-die
flip, this case asks for the review's literal target: an opposing, previously-uninvolved identity
(RiskAcceptance, anchored to Speak Up) turning Contest UP — making an already-favored matchup MORE
genuinely contested — without flipping which option leads or collapsing to Auto. WITHOUT identity:
Contest=**0.5000**, Margin=**0.5000**, P(Keep Dinner)=**0.7500**, `resolutionMode=PlayerFacingRoll`.
WITH identity (RiskAcceptance Support=1, anchored to Speak Up): Contest rises to **0.7500**
(`contestIncreased=true`), Margin falls to **0.2500**, P(Keep Dinner) narrows to **0.6250** — still
favored, genuinely less so (`keepDinnerStillFavoredButLessSo=true`) — and both runs remain
`PlayerFacingRoll` throughout (`bothRunsPlayerFacing=true`), with neither probability ever hitting exactly
0 or 1 (`neitherProbabilityHitZeroOrOne=true`). This is the die-bracket system's own version of "identity
re-contests an otherwise near-automatic decision" (Brief §26's original framing) — narrower than a fully
continuous system would allow (the shift crosses exactly one bracket, not a continuum of intermediate
values), but a real, qualitatively different outcome from Phase 2.9's cancellation-or-flip dichotomy.
Reaching this shape required a systematic parameter search: Alignment's "own minus others" formula means
establishing an identity anchored to one option ALSO applies a negative pull onto the competing option on
the same channel — a "double lever" effect that made naive attempts overshoot into full reversal or Auto
far more often than a one-sided mental model would predict.

### Target D — Identity transformation with feedback active, and the persistence of self-stabilization

The review asked whether Phase 2.9's Experiment J finding — an established identity's own feedback
channel actively resists the very contradiction meant to erode it, forcing J to disable feedback to
isolate pure behavioral counter-evidence — still holds under Phase 2.95's architecture. Reusing
Experiment E's exact consolidated-`Dependable` starting state (strength **0.5325**,
`consolidatedAfterAcquisition=true`) and running Experiment J's IDENTICAL contradiction bias
(`weakSide(2/5)`/`strongSide(2)`) with feedback left ON reproduces J's finding essentially unchanged:
Keep Dinner (the identity-aligned option) still wins the great majority of "contradiction" rounds outright,
so strength drifts UP rather than eroding — self-stabilization is real under Phase 2.95 too, not
eliminated by the consolidation fix, and this was confirmed directly by instrumenting the round-by-round
run before accepting a different parameter (see this phase's own search history: at J's own bias level,
Stay At Work won only 21 of 150 rounds and final strength rose to 0.6055).

What the fix changes is WHERE the fault line sits, not whether identity resistance exists at all: a
single die-bracket's worth more raw pressure on the contradicting side (`strongSide(9/4)` instead of
Experiment J's `strongSide(2)` — both land in the same "very strong" pre-`boundedResponse` region, but
`9/4` clears a threshold `2` does not once identity's own opposing pull is subtracted from the same
shared channel) is enough to flip which side wins the sustained contradiction outright (Stay At Work now
wins roughly 93% of the 150 rounds, not roughly 14%) — and winning consistently, not occasionally, is
what lets `Alignment`'s negative term actually accumulate real Opposition evidence instead of being
swamped by the rare rounds contradiction still won under the old bias. Over 150 rounds, strength falls
from **0.5325** (consolidated) to **0.2109** (`consolidatedAfterSustainedContradiction=false`,
`strengthDroppedWithFeedbackActive=true`) — genuine erosion, with feedback left on throughout, no
ablation override. The honest shape of this result: Phase 2.95 does not make identity's resistance to
contradiction weaker in general — it makes the SAME contradiction pressure that used to be swamped by
identity's own separately-floored resistance now compete on equal footing in one shared consolidation
pool, so a sufficiently committed (one bracket, not an order of magnitude) sustained contradiction can now
win where before it could not.

### Target E — Canonical trait acquisition with feedback ON, from zero

The review's explicit instruction: prove trait consolidation under the ORDINARY feedback-on loop, not
only via Experiment E's `identityFeedbackEnabled: false` ablation (a deliberate, documented scoping
choice for isolating pure behavioral acquisition — never a claim that feedback-on acquisition was
impossible). Running the same dinner-vs-work bias Experiments E/H use, from a completely fresh
`defaultDecisionScenario()` (zero identity evidence), for 200 rounds, with feedback at its ordinary
default (`true`) throughout: CommitmentFidelity strength rises continuously, consolidates `Dependable`
(`traitConsolidated=true`, `evidenceAccumulatedWithoutAblation=true`), and self-stabilizes at a fixed
strength of **0.6079** (IdentityConfidence likewise **0.6079**) by round **124 of 200** — the run
genuinely stops moving well before its own end, rather than the plateau being an artifact of an
insufficient round count. This is exactly Brief §24's own natural-stabilization hypothesis (Experiment H)
playing out as a STABLE, CONSOLIDATED endpoint under the ordinary feedback loop, not a ceiling that
prevents consolidation from ever being reached in the first place.

### Three-part output (Brief §36) for Reason Consolidation & Identity Fault Lines

**Psychological finding.** Two of Phase 2.9's own reported limitations turned out to be artifacts of
where identity's contribution was computed, not facts about what a dice-resolved identity mechanism can
do: a weak established sense of self genuinely CAN combine with weak, ordinary motivation to tip a choice
that neither alone would have decided (Target B); an identity someone doesn't yet strongly hold CAN still
make an otherwise-comfortable decision feel more genuinely contested without deciding it outright (Target
C); and an identity CAN be built up, and eroded back down, entirely under the ordinary conditions a
character actually lives in — no artificial isolation of "pure behavior" required in either direction
(Targets D/E). At the same time, Target D shows the earlier finding wasn't simply wrong: an established
identity really does actively resist contradiction through the same channel that built it, and that
resistance is not a bug the fix removes — it is a real, and now more precisely characterized, part of how
this reference model says acquired identity behaves under pressure.

**Computational finding.** The review's diagnosis generalizes beyond this specific case: in a system
where identity feedback and other pressures on the SAME topic are assembled through DIFFERENT paths
before a floor or threshold check, that difference in path — not any difference in the underlying
psychology being modeled — silently produces "all or nothing" behavior. The fix was never to make
identity's influence stronger or weaker; it was to route pre-existing raw contributions through the SAME
consolidation math, once, regardless of source. This is a general lesson about layered threshold systems,
not one specific to `identity.ts`, and is worth carrying forward to any future channel this project adds
alongside Need/accessibility/identity.

**Architectural implication.** The two-map separation (`boundedNeedAccessByOption` for evidence/no-
double-counting, one shared bound-and-floored raw pool per option for dice/resolution) is now the
canonical pattern for adding any future Influence source that must both (a) participate in the same
floor-eligible consolidation as existing sources, and (b) never contaminate the evidence base it is
itself derived from. `RawReasonInfluence`/`sumRawBySemanticChannel`/`boundAndFloorChannels`/
`boundAllChannels` in `decision.ts` are Decision-agnostic enough that Phase 3's eventual personality-
sourced Influences (Brief §23's still-deferred double-counting concern) can reuse this exact machinery
rather than re-deriving it.

### Next-phase justification

Phase 2.95 closes a gap between what Phase 2.9 claimed was structurally impossible and what the
implemented system actually supported — a genuine correction driven by external review, verified the same
way every other finding in this project is verified: real `runDecisionCycle` output, never predicted
numbers. It leaves the Phase 2.9 architecture's actual shape unchanged (still no latent personality
vector, still a parallel front-end to ordinary Action selection, still the same counter-addressed RNG
discipline) while making its one new feedback channel behave the way its own design documentation always
said it should. Phase 3 inherits the same next-phase question Phase 2.9 identified — how another character
infers belief from a `DecisionExpression` history and a consolidated `IdentityEvidenceState` — now backed
by an identity-feedback mechanism whose combination and erosion behavior has actually been verified under
the ordinary feedback-on loop, not only under an ablation that isolated it from the very dynamics Phase 3
will need to reason about.
