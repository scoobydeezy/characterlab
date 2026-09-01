# CharacterLab — Ideal Character Research Program Brief

**Status:** Draft research charter  
**Authority:** Subordinate to `CharacterLab — Ideal Character Architecture North Star` and `CharacterLab — Ideal Character Architecture Map`  
**Relationship to Vivarium:** Independent research program informing eventual character-model distillation  
**Primary subject:** One causally rich deterministic simulated person, plus the bounded social/world context required to test that person  
**Primary purpose:** Make the complete ideal character architecture experimentally executable, then determine through controlled reduction which causal distinctions are actually necessary.

---

# 1. Mission

CharacterLab exists to answer one overarching question:

> **What is the smallest deterministic causal architecture that can reproduce the required phenomena of the ideal character without losing important behavioral, epistemic, historical, semantic, or developmental distinctions?**

CharacterLab no longer begins from a presumed minimal set of psychological primitives.

It begins from the intentionally overcomplete **Ideal Character Architecture** defined by the North Star and Architecture Map.

That architecture is a **superset hypothesis**.

CharacterLab's job is to:

1. make every required causal seam explicitly representable;
2. give uncertain seams thin deterministic reference mechanisms;
3. demonstrate that the intact architecture can produce the required phenomena;
4. remove, derive, merge, compress, or substitute candidate distinctions;
5. replay the same controlled phenomena and counterfactuals;
6. determine which distinctions actually matter;
7. preserve the smallest architecture demonstrated equivalent across the retained corpus;
8. distill those findings toward Vivarium.

The governing research direction is therefore:

```text
IDEAL CHARACTER ARCHITECTURE
intentionally overcomplete causal topology
        ↓
THIN DETERMINISTIC REFERENCE MODEL
all required seams traversable and traceable
        ↓
REQUIRED PHENOMENON / TORTURE CORPUS
        ↓
CONTROLLED ABLATION
SUBSTITUTION
MERGER
DERIVATION
COMPRESSION
        ↓
CAUSAL + BEHAVIORAL COMPARISON
        ↓
REDUCTION VERDICTS
        ↓
SMALLEST DEMONSTRABLY SUFFICIENT MODEL
        ↓
VIVARIUM DISTILLATION
```

CharacterLab is not tasked with discovering a universal theory of human psychology.

Its frontier is bounded by the personhood and behavioral phenomena relevant to Vivarium.

But within that frontier, the laboratory should prefer understanding over premature simplicity.

---

# 2. Authority and document hierarchy

CharacterLab now uses an explicit source hierarchy.

## 2.1 Ideal Character Architecture North Star

Answers:

> **What must the eventual character be capable of?**

It owns:

- architectural invariants;
- required phenomena;
- causal boundaries that must remain available for testing;
- semantic-compilation requirements;
- epistemic constraints;
- autonomy requirements;
- the reference-first subtractive research posture.

If another CharacterLab document makes an architectural assumption that conflicts with the North Star, the North Star wins.

---

## 2.2 Ideal Character Architecture Map

Answers:

> **What complete causal topology are we currently proposing as the ideal reference model?**

It owns:

- the current superset architecture;
- state-ownership distinctions;
- major causal seams;
- conceptual cycle ordering;
- candidate distinctions;
- mapping of previously drafted mechanisms into the ideal architecture.

It is not an implementation-status report.

---

## 2.3 Formal Reference Model

Answers:

> **What exact deterministic model is the intact reference architecture asking the computer to execute?**

It owns:

- semantic state types, domains, units and ranges;
- exact reference transformations for every active seam;
- preconditions, totality and failure behavior;
- event phases and canonical ordering;
- quantization, clamping and tie-breaking points;
- deterministic random addresses and sampling algorithms;
- state-mutation authority;
- invariants and postconditions;
- and trace/provenance schemas.

The Formal Reference Model may be split into substrate documents and versioned seam specifications. No implementation agent may invent missing authoritative mathematics. A seam without a complete formal contract is not implementation-ready.

The active foundation and specification template live under [`docs/formal/`](docs/formal/README.md). Active seam readiness, corpus registration, and verdict evidence live under [`docs/planning/`](docs/planning/SEAM_LEDGER.md).

---

## 2.4 This Research Program Brief

Answers:

> **How does CharacterLab scientifically test, compare, simplify, and judge that architecture?**

It owns:

- research standards;
- experimental methodology;
- seam contracts;
- control-model policy;
- ablation methodology;
- reduction verdicts;
- campaign gates;
- causal-trace requirements;
- distillation methodology;
- research output format.

It does **not** decide the exact current build order.

---

## 2.5 CharacterLab Build / Campaign Plan

A separate planning document should answer:

> **What do we implement and investigate next?**

It may sequence work by:

- architectural dependency;
- invalidation risk;
- discriminating value;
- experiment cost;
- availability of useful control implementations.

It may not redefine the ideal architecture merely for convenience.

---

## 2.6 Experiment briefs

Individual experiments own:

- exact hypotheses;
- competing mechanisms;
- scenario fixtures;
- parameter ranges;
- equations;
- specific invariants;
- control timelines;
- measured outputs;
- pass/fail or reduction criteria.

The experiment brief is where a candidate mechanism becomes concrete enough to falsify.

---

# 3. Reset declaration

CharacterLab has restarted under a fundamentally different research premise.

The former program asked:

> What is the smallest model we can begin with, and what mechanism must we add when a desired behavior fails?

The new program asks:

> **What complete causally legible architecture could plausibly explain the ideal person, and which distinctions can controlled experiments subsequently prove unnecessary?**

This inversion changes the role of all prior CharacterLab work.

Previous:

- phases;
- source files;
- equations;
- data types;
- experiments;
- implementation plans;
- accepted findings;

remain useful.

But they are no longer architectural authority merely because they already exist.

They may serve as:

```text
REFERENCE-DRAFTED MECHANISM
One existing deterministic expression of a seam.

CONTROL MODEL
A prior implementation used as a comparison baseline.

CANDIDATE EQUATION
Useful mathematics awaiting comparison against alternatives.

RETAINED FINDING
An experimental result whose tested conditions remain valid.

TEST FIXTURE
A scenario useful for regression or discrimination.

RESEARCH SUBSTRATE
Infrastructure whose value does not depend on the old psychology.
```

A component being present in old code means:

> **We already possess one candidate way of implementing this idea.**

It does not mean:

> This mechanism must survive the reset.

Likewise, a component not previously implemented is not "future architecture."

If the North Star requires the causal distinction, it is already part of the ideal reference topology.

---

# 4. Relationship to Vivarium

Vivarium and CharacterLab answer related but different questions.

## Vivarium

> **How can large numbers of autonomous people be simulated deterministically, persistently, legibly, efficiently, and playably?**

Vivarium must ultimately care about:

- population scale;
- storage;
- event scheduling;
- save/load;
- offline progression;
- targeted invalidation;
- player Knowledge;
- presentation;
- content authoring;
- game balance.

---

## CharacterLab

> **If production cost is temporarily relaxed, what deterministic causal distinctions are actually required to generate the desired psychology and biography of a person?**

CharacterLab may therefore explore mechanisms too expensive for Vivarium if doing so answers an architectural question.

The intended relationship is:

```text
CHARACTERLAB
ideal reference architecture
        ↓
controlled research campaigns
        ↓
psychological findings
        ↓
computational findings
        ↓
reduction verdicts
        ↓
minimal causally sufficient research model
        ↓
production-cost analysis
        ↓
distillation contract
        ↓
VIVARIUM
production representation
```

CharacterLab does not automatically produce Vivarium code.

A surviving CharacterLab mechanism may eventually be:

- adopted directly;
- approximated;
- compressed;
- analytically reduced;
- represented through another data structure;
- calculated lazily;
- event-driven instead of continuously represented;
- replaced by a behaviorally equivalent cheaper mechanism;
- or rejected as too expensive if Vivarium can preserve the required phenomenon another way.

CharacterLab discovers what distinctions matter.

Vivarium decides how those distinctions can be afforded.

---

# 5. What judges the model

The intact reference model is not an oracle.

It is a hypothesis.

CharacterLab therefore has three authorities against which a mechanism is judged.

## 5.1 Architectural invariants

Examples:

- Truth is not Knowledge.
- Knowledge is not appraisal.
- Appraisal is not affect.
- Affect is not action.
- Motivation is not action.
- Goal is not plan.
- Believed capability is not actual competence.
- Private state is not expressed communication.
- Intent is not execution.
- Authoritative outcome is not perceived outcome.
- History may change the future but never rewrite the past.
- One causal fact must not silently become duplicate Decision pressure.

A candidate cannot be accepted merely because its outputs look plausible if it violates an invariant.

---

## 5.2 Required phenomena

The architecture must produce the classes of behavior and development required by the retained phenomenon corpus.

A phenomenon is a behavioral obligation.

It is not necessarily a subsystem.

For example:

> A skilled character may falsely believe they are incompetent.

requires a distinction between competence and capability belief.

It does not by itself dictate the data structure used for either.

---

## 5.3 Causal counterfactuals

Similar outputs are insufficient.

A reduced model must preserve the important causal differences that make future intervention and explanation possible.

If two models choose the same Option but only one can distinguish:

```text
"I voluntarily stayed."

from

"I tried to leave and was physically prevented."
```

they are not equivalent for Vivarium.

Equivalence means preserving required:

- behavior;
- causal provenance;
- epistemic boundaries;
- counterfactual sensitivity;
- historical meaning;
- developmental consequences.

---

# 6. Hard constraints

Most Vivarium production constraints are intentionally relaxed inside CharacterLab.

The following constraints are not.

---

## 6.1 Determinism

Every authoritative transition must be completely specified.

For:

- model version \(M\);
- initial authoritative state \(S_0\);
- ordered world/input sequence \(I\);
- deterministic random seed \(R\);

the complete resulting trace must satisfy:

\[
Trace = F(V_r,V_c,\Theta,V_n,V_{rng},S_0,I,R)
\]

with exactly one possible result.

Where:

- (V_r) is the simulation-rules version;
- (V_c) is the authored-content version;
- \(\Theta\) is the complete parameter set;
- (V_n) is the authoritative numeric/quantization version;
- (V_{rng}) is the random-algorithm version;
- (S_0) is canonical initial authoritative state;
- (I) is the canonically ordered external input/event sequence;
- and (R) is the authoritative seed.

These components may later be packaged into one `ModelIdentity`, but none may remain ambient or implicit.

Repeated execution must reproduce all authoritative:

- state;
- events;
- memories;
- beliefs;
- appraisals;
- affect;
- workspace transitions;
- motives;
- goals;
- Reasons;
- options;
- random draws;
- chosen intents;
- attempts;
- outcomes;
- learning;
- identity evidence;
- relationship changes;
- consolidation;
- and causal trace.

No authoritative relationship may exist solely as:

> X could somehow influence Y.

It must resolve through a specified deterministic transformation or a fully specified reproducible stochastic transformation.

Conceptually:

\[
Y'=f(X,Y,\theta)
\]

or:

\[
Y'\sim P(Y'|X,Y,\theta)
\]

with deterministic sampling.

### No authoritative black boxes

Authoritative simulation truth may not depend on:

- LLM calls;
- nondeterministic external services;
- wall-clock behavior;
- implicit collection order;
- ambient randomness;
- unspecified floating-point behavior;
- manual human interpretation during runtime.

Language models may later assist with:

- prose;
- dialogue realization;
- presentation;
- authoring;
- research interpretation.

They may not decide what mechanically happened inside the simulated person.

---

## 6.2 Semantic compilation

CharacterLab must attempt to demonstrate that human-readable psychological meaning can be compiled from causal state.

The desired direction is:

```text
quantitative / symbolic state
        ↓
explicit deterministic transformations
        ↓
semantic classification
        ↓
human-readable meaning
```

Examples include:

```text
appraisal + control + anticipated harm
→ FEAR
```

```text
repeated cross-context autonomy expression
→ REBELLIOUS identity evidence
```

```text
expected success
+ repeated action attempt
+ perceived failure independent of strategy
→ REDUCED PERCEIVED CONTROLLABILITY
```

Semantic labels summarize mechanically recognized structure.

They do not create the behavior they describe.

---

## 6.3 Epistemic integrity

No character-relative process may read simulator truth merely because that truth exists.

All knowledge must have a legitimate path.

Canonical shape:

```text
WORLD / BODY TRUTH
        ↓
observation / interoception
        ↓
CHARACTER EVIDENCE
        ↓
belief / knowledge
        ↓
appraisal
```

The same rule applies to:

- hidden environmental causes;
- another person's disposition;
- another person's affect;
- another person's goal;
- another person's private intention;
- another person's knowledge;
- the acting character's own hidden physiological detail;
- actual action competence;
- causal attribution;
- Observer interference.

Unknown is distinct from neutral.

Mistaken belief is legitimate state.

---

## 6.4 Causal provenance

Every authoritative transformation must retain enough provenance to answer:

> **Why is this value or semantic conclusion present?**

The trace must distinguish:

```text
source fact
→ observation
→ evidence
→ inference
→ appraisal
→ downstream consequence
```

When a derived quantity contributes to another result, the derivation path must remain inspectable enough to detect correlated or duplicated causation.

---

## 6.5 Historical integrity

Resolved historical meaning is frozen.

A later personality change does not rewrite why an earlier Decision occurred.

A later belief correction does not rewrite what the character believed at the time.

A later recollection may differ from the original experience without mutating the original experience.

The model must preserve the distinction between:

```text
WHAT HAPPENED

WHAT WAS PERCEIVED THEN

WHAT WAS BELIEVED THEN

WHAT IS REMEMBERED NOW

WHAT IS BELIEVED NOW
```

---

## 6.6 No causal modifier soup

One causal fact may produce several genuinely distinct downstream consequences.

It may not be counted repeatedly simply because several systems can restate it.

For every Decision-relevant contribution, the trace should permit the question:

> Is this an independently meaningful effect, or another description of pressure already represented elsewhere?

Accidental double counting is an architectural failure.

---

## 6.7 Persistent-state mutation authority

Every persistent learned state must name exactly one authoritative transition family permitted to mutate it.

Several evidence sources may feed that transition. No second subsystem may write the same state through an unexplained shortcut.

Each mutation authority must specify:

- eligible evidence;
- timing and ordering;
- exact update transformation;
- bounds and invariants;
- provenance retained;
- idempotence/replay behavior;
- and how immediate evidence differs from later consolidation.

---

# 7. Research standard

CharacterLab distinguishes at least four kinds of validity.

## 7.1 Mathematical validity

We may prove properties such as:

- determinism;
- bounds;
- uniqueness;
- convergence;
- invariant preservation;
- error bounds;
- canonical ordering;
- independence from unrelated random draws.

---

## 7.2 Semantic validity

We must establish that a quantity means what its contract claims it means.

For example:

- `Recognition` may not secretly mean affection.
- `SelfEfficacy` may not secretly mean skill.
- `Fear` may not secretly mean avoidance pressure.
- `NeedPressure` may not secretly expose body truth unavailable to the character.
- `DecisionExpression` may not secretly become a generic personality mutation.

---

## 7.3 Psychological sufficiency

We cannot mathematically prove that a model is "true psychology."

We can test whether it reproduces the required phenomenon set with the expected counterfactual sensitivity.

---

## 7.4 Architectural necessity

A mechanism may produce a useful phenomenon and still be unnecessary.

CharacterLab must therefore ask:

> Can the same required behavior and causal distinction be reproduced without this independently stored state or seam?

Every important candidate should eventually face reduction.

---

## 7.5 Minimum research package

A candidate mechanism is not ready for an architectural verdict until it has, where applicable:

```text
Semantic contract
+
explicit transformation / equation
+
state-ownership declaration
+
invariant
+
unit / property tests
+
behavioral experiment
+
counterfactual experiment
+
ablation or competing-model comparison
+
causal trace
```

A psychologically plausible formula without a discriminating experiment is not an architectural result.

---

# 8. Numerical and deterministic substrate

The reset does not require abandoning deterministic infrastructure that is independent of the old psychological architecture.

The previous CharacterLab work drafted several useful numerical conventions.

They remain the default research substrate unless a future experiment demonstrates that they cannot express a required mechanism.

---

## 8.1 Exact oracle mathematics

Arbitrary-precision integer and rational mathematics may be used for:

- proof calculations;
- test oracles;
- matrix operations;
- expected-value derivations;
- validation of bounded approximations;
- invariant checking.

For exact rational:

\[
x=\frac pq
\]

where:

\[
p\in\mathbb Z,\qquad q\in\mathbb Z^+
\]

Exact rational representation is a research tool, not an architectural requirement that all persistent character state remain arbitrarily precise forever.

---

## 8.2 Quantized authoritative state

Where a bounded persistent scalar representation is useful, CharacterLab may use a versioned rational lattice:

\[
\mathcal Q_D=
\left\{
\frac{k}{D}:k\in\mathbb Z
\right\}
\qquad D\in\mathbb Z^+
\]

with explicit quantization:

\[
Q_D(x)=
\frac{RoundEven(Dx)}{D}
\]

`RoundEven` means nearest integer with exact half-way ties resolved to the even integer, including for negative inputs.

and one-step error:

\[
|Q_D(x)-x|
\le
\frac1{2D}
\]

The quantization point is part of the algorithm.

There is no implicit rounding.

This representation is **research substrate**, not character ontology.

A campaign may replace it if a required mechanism demonstrates a better deterministic representation.

---

## 8.3 Deterministic execution contract

Authoritative event transitions should normally follow:

```text
READ PRE-STATE
        ↓
CALCULATE COMPLETE TRANSITION
        ↓
QUANTIZE WHERE SPECIFIED
        ↓
VALIDATE INVARIANTS
        ↓
COMMIT ATOMICALLY
        ↓
EMIT TRACE
```

Feedback loops must be broken by explicit transition boundaries.

No current-cycle value may recursively update itself through an undefined evaluation order.

---

## 8.4 Randomness

Randomness is permitted.

Nondeterminism is not.

The preferred reference mechanism remains counter-addressed randomness:

\[
r=
H(
Seed,
RulesVersion,
ContentVersion,
RandomAlgorithmVersion,
EventId,
ScopeId,
PurposeId,
DrawIndex
)
\]

or an equivalent deterministic oracle with the same causal properties.

An unrelated random event should not perturb later random results merely by consuming a value from a global stream.

Every random draw must identify:

- why it occurred;
- which causal event owns it;
- what semantic purpose it served;
- which indexed draw it was.

The Formal Reference Model must additionally fix canonical component encoding, hash/mixing algorithm, mapping from raw words to the requested distribution, rejection/fallback behavior, and any finite-resolution bias. “Deterministic hash” is not by itself a complete sampling specification.

---

# 9. Reference-first subtractive methodology

CharacterLab begins from the complete ideal topology.

It does not begin by collapsing uncertain distinctions.

---

## 9.1 Stage A — make the seam exist

Every candidate distinction required by the Architecture Map must have an independently traceable contract.

A thin mechanism is acceptable.

An omitted seam is not.

The objective is **causal availability**, not maximum psychological fidelity.

No seam may enter implementation merely because its conceptual box exists. Its versioned formal contract must be complete enough that an implementation agent cannot choose authoritative domains, equations, boundary behavior, ordering, or semantic classifications by intuition.

---

## 9.2 Stage B — make the intact path work

Before simplifying a seam, establish at least one end-to-end scenario in which the seam participates legitimately.

The intact reference architecture must be capable of producing:

- valid state;
- valid semantics;
- expected behavior;
- complete trace.

If the reference mechanism itself cannot produce the required phenomenon, repair or replace it before using it as an ablation baseline.

---

## 9.3 Stage C — create a competing model

For a candidate distinction, define a simpler alternative.

Examples:

```text
stored Need
vs
body-derived pressure
vs
interoception-mediated pressure
```

```text
full episodic imprint
vs
compressed semantic memory
```

```text
independent workspace state
vs
derived active set
```

```text
persistent affect
vs
event-local affect
```

---

## 9.4 Stage D — replay the same corpus

Use:

- the same scenario;
- the same initial state;
- the same event timing;
- the same deterministic seed;
- the same external inputs;
- the same random experimental uniforms where comparison requires coupled stochasticity.

Compare not only final behavior, but:

- intermediate state;
- semantic classifications;
- causal provenance;
- counterfactual sensitivity;
- historical consequences;
- future learning.

---

## 9.5 Stage E — assign a reduction verdict

Every tested distinction receives one of the North Star verdicts:

```text
RETAINED
A valid discriminating witness demonstrates that removing or merging the distinction loses a required behavior, invariant or causal counterfactual.

DERIVED
An explicit derivation reproduces the required quantity from lower-level state across the declared domain and satisfies the equivalence criterion without separate authoritative state.

MERGED
Purpose-built discrimination tests over an adequately covered declared domain meet an explicit behavioral and causal equivalence criterion for two candidates.

COMPRESSED
The rich distinction is required before a defined transition, after which a cheaper representation preserves specified future behavior, provenance and reopen information.

RETRACTED
Adequately discriminating tests demonstrate that the candidate adds no required causal or behavioral capacity across the declared domain.

UNRESOLVED
Evidence is insufficient for another verdict because coverage, fidelity, numerical validity or discriminating power is inadequate or conflicting.
```

No verdict is universal beyond its tested corpus.

New discriminating phenomena may reopen it.

The governing proof asymmetry is:

> **Difference needs a valid witness. Equivalence needs declared coverage.**

Failure to observe a difference is not by itself evidence for `MERGED`, `DERIVED` or `RETRACTED`.

---

# 10. Candidate seam contract

Every major causal seam should receive a small formal contract before implementation.

Recommended format:

```text
SEAM ID / VERSION
Stable identifier and semantic version

SEMANTIC QUESTION
What distinction does this seam claim to represent?

DOMAIN
Exact typed inputs and their semantic ownership

CODOMAIN
Exact typed outputs

UNITS / RANGES / APPLICABILITY
Bounds, units, Unknown, NotApplicable, invalid and absent semantics

AUTHORITATIVE READS
What authoritative and derived state may be read?

AUTHORITATIVE WRITES / MUTATION AUTHORITY
What persistent state, if any, may this transition mutate?

EPISTEMIC PERMISSIONS
What truth is visible and what truth is forbidden?

PRECONDITIONS
What must be true before evaluation?

TOTALITY / FAILURE BEHAVIOR
What happens for every legal input and how are illegal inputs rejected?

REFERENCE TRANSFORMATION
Exact equation or deterministic algorithm, including semantic classification predicates

RANDOMNESS
Purpose/Scope identity, address components, distribution and exact sampling algorithm

QUANTIZATION / CLAMPING
Exact order, rounding mode, boundaries and accumulated-error obligation

CANONICAL ORDERING / TIES
Stable iteration order and complete tie-breaking

TIMING
Event phase, pre-state snapshot and commit boundary

POSTCONDITIONS
What is guaranteed after the transition?

INVARIANTS
Properties preserved across every legal transition

TRACE / PROVENANCE SCHEMA
Inputs, intermediate values, classifications, source identities and output references required

REFERENCE-DRAFTED MECHANISMS
What previous equations/code already offer candidate implementations?

COMPETING MODELS
What simpler or alternative mechanisms should be compared?

REQUIRED PHENOMENA
Which versioned corpus cases depend on this distinction?

REDUCTION / EQUIVALENCE CRITERIA
What must remain true if the seam is removed, derived, merged, compressed or substituted?

PROOF AND TEST OBLIGATIONS
Unit, property, counterfactual, replay, save/load and adversarial requirements
```

This contract exists to prevent late discoveries of hidden assumptions. A seam is not implementation-ready while any authoritative field above is absent or delegated to implementer judgment.

---

# 11. Reference implementation policy

CharacterLab should intentionally permit multiple mechanisms for the same semantic seam.

A reference implementation is an experiment instrument.

It is not automatically accepted architecture.

---

## 11.1 Thin first implementation

The first implementation of a seam should be:

- deterministic;
- semantically honest;
- easy to inspect;
- easy to replace;
- mathematically explicit;
- no more complex than necessary to preserve the proposed distinction.

Do not maximize fidelity before the seam has proven necessary.

---

## 11.2 Preserve competing implementations

When practical, an older mechanism should remain available as a named control while a replacement is tested.

Example:

```text
NeedModel.StoredMeter
NeedModel.BodyDerived
NeedModel.Interoceptive
```

rather than deleting the control before the new mechanism proves anything.

The active [`Reference Mechanism Preservation Ledger`](docs/planning/REFERENCE_MECHANISM_LEDGER.md) records the reciprocal obligation: earned mechanisms, negative results, regression fixtures, and useful unvalidated hypotheses must not silently disappear during the reset. Each applicable item requires an explicit port, control, corpus, candidate, supersession, or retirement decision.

---

## 11.3 Existing CharacterLab work

Previous CharacterLab mechanics may populate the new architecture where semantically appropriate.

Candidate examples include:

- exact numerical kernel;
- quantization utilities;
- deterministic random oracle;
- semantic identifiers;
- evidence-estimate mathematics;
- association learning;
- spreading activation;
- accessibility;
- episodic records;
- Need expectation learning;
- belief-distribution updates;
- social appraisal fields;
- Reason Nuclei;
- exact option distributions;
- DecisionExpression;
- identity evidence.

Each is now treated as:

> **one drafted mechanism or earned research substrate, subject to the authority of the new semantic contract.**

Legacy names do not define the new seam.

One prior result has a stronger reuse obligation: the Phase 2.9–2.97 unresolved-Decision pipeline must be carried forward as the initial reference implementation and control for the arbitration seam. That reusable package includes Reason Nuclei, correlation-aware signal consolidation, base dice, standing and situational modifiers, exact option distributions, `Margin` / `Contest` / `Stake` / `AuthorshipPotential`, `Auto` / `QuietRoll` / `PlayerFacingRoll`, counter-addressed resolution, frozen `DecisionExpression`, identity-evidence consolidation, and identity feedback as a future standing modifier.

This is not permission to copy historical module boundaries blindly. The mechanism must be re-expressed through the new versioned seam contracts and current truth/evidence/mutation rules. Its exact calibration remains testable, but it cannot disappear or be replaced with generic weighted randomness without a purpose-built comparison and a valid reduction verdict.

---

# 12. Required phenomenon corpus

CharacterLab needs a **retained phenomenon corpus** rather than a sequence of feature demonstrations.

The corpus is the common exam that architectural reductions must continue to pass.

It should grow when a new phenomenon exposes a previously hidden distinction.

The categories below define the initial research frontier.

---

## 12.1 Embodiment and regulation

Required cases should include:

- same external circumstance, different constitutional kinetics;
- same current regulatory level, different future trajectories;
- delayed bodily consequence;
- interoceptive uncertainty;
- hidden body truth that must not leak into motivation;
- sleep loss affecting cognition without rewriting personality;
- intoxication-like perturbation affecting execution/control differently across characters;
- tolerance or sensitization after repeated exposure.

---

## 12.2 Need and motivational ownership

Required cases should distinguish:

- body state from experienced pressure;
- general importance from current urgency;
- direct bodily Need from psychological motive;
- motive from Reason;
- multiple motives supporting the same action;
- one motive producing several possible actions.

---

## 12.3 Memory and recognition

Required cases should include:

- recent vivid recollection;
- old but defining memory;
- low-importance memory becoming fuzzy;
- repeated retrieval increasing accessibility;
- inaccessible but retained memory;
- familiar person/place without detailed recollection;
- familiar-but-different recognition;
- reconstructed recollection differing from event truth;
- affect-biased retrieval;
- consolidation without double-counting episode and summary.

---

## 12.4 Belief and causal learning

Required cases should include:

- uncertain but approximately correct belief;
- confidently wrong belief;
- contradictory evidence;
- hidden cause;
- mistaken attribution;
- repeated prediction error;
- learning specific action-outcome contingency;
- reduced perceived controllability;
- evidence later correcting prior attribution.

---

## 12.5 Affect and appraisal

Required cases should include:

- same knowledge, different appraisal;
- same appraisal, different behavioral response;
- fear without flight;
- embarrassment without avoidance;
- relief changing subsequent cognition;
- affect altering salience or retrieval;
- deliberate cognitive reappraisal changing later affect;
- affect that cannot be reduced to one regulatory axis.

---

## 12.6 Cognitive workspace and control

Required cases should include:

- competing information exceeding active capacity;
- distraction displacing a maintained goal;
- resisting a habitual response;
- failure of inhibition under load;
- switching strategy after performance monitoring;
- rumination consuming active cognition;
- cognitive fatigue impairing control;
- deliberate reappraisal;
- remembering a prospective intention at the relevant moment.

---

## 12.7 Goals and prospection

Required cases should include:

- wanting something without acting now;
- retaining a future intention;
- pursuing one goal through several possible strategies;
- abandoning a failing strategy while retaining the goal;
- procrastination;
- delayed gratification;
- forgetting an intention;
- conflicting short- and long-term goals.

---

## 12.8 Skill and action competence

Required cases should include:

- skilled but insecure;
- incompetent but overconfident;
- skill improving faster than self-belief;
- formerly skilled but rusty;
- procedural performance without explicit recollection;
- temporary impairment reducing execution but not long-term competence;
- learning through practice;
- identical intent producing different outcomes due to competence.

---

## 12.9 Habit, reinforcement, obsession and addiction

Required cases should include:

- repeated successful behavior becoming habitual;
- habit persisting after the original reward changes;
- resisting a habit through control;
- concentrated dependence on one satisfier;
- healthy availability of substitutes;
- escalating reinforcement;
- tolerance;
- absence deficit;
- craving;
- relapse after prior adaptation;
- addiction-like behavior without assuming an authored `Addicted` trait.

---

## 12.10 Social cognition and person models

Required cases should include:

- uncertain impression of another person's disposition;
- correct disposition belief but incorrect current intention belief;
- misreading fear as guilt;
- inferring another person's goal;
- mistaken belief about what another character knows;
- bounded second-order social knowledge where behaviorally required;
- two observers learning different models from the same target;
- reputation/hearsay versus direct observation.

---

## 12.11 Relationships and attachment

Required cases should include:

- affection without respect;
- respect without affection;
- trust without comfort;
- familiarity without liking;
- attachment after repeated meaningful dependence;
- betrayal;
- later attribution correction;
- grief after loss;
- changing Reliance after commitment history;
- relationship specificity rather than global reputation.

---

## 12.12 Identity and disposition

Required cases should include:

- repeated meaningful cross-context expression;
- trivial repeated behavior that should not create identity;
- coerced action that should not count as voluntary identity evidence;
- identity belief persisting despite one contradictory act;
- self-concept affecting later motivation;
- observer-specific identity belief differing from self-concept;
- possible long-run dispositional adaptation;
- reversal/recovery after biography changes.

---

## 12.13 Communication

Required cases should include:

- truthful disclosure;
- concealment;
- lying;
- attempted lie that fails;
- saying "I'm fine" while privately distressed;
- accidental emotional leakage;
- misunderstood explanation;
- different observers receiving different evidence from the same expression;
- communication affecting later belief without granting private-state access.

---

## 12.14 Autonomy, interference and execution

Required cases should include:

- chosen action succeeds;
- chosen action fails through incompetence;
- chosen action becomes impossible;
- chosen action is physically prevented by an external actor;
- repeated interference changes beliefs without rewriting intent;
- observer witnesses interference;
- another stakeholder sees only the failed outcome;
- later explanation changes attribution.

---

## 12.15 Longitudinal personhood

Long-run scenarios should eventually combine:

- development;
- routines;
- memories;
- relationships;
- skill;
- goals;
- identity;
- habits;
- changing expectations;
- consolidation;
- loss;
- adaptation.

The character should become increasingly biographically specific rather than converging toward a generic equilibrium person.

---

# 13. Experiment classes

CharacterLab should use a common vocabulary for experimental design.

---

## 13.1 Baseline experiment

Demonstrates that an intact candidate path can produce a required phenomenon.

Question:

> Can the proposed mechanism express the case at all?

---

## 13.2 Counterfactual experiment

Change one causal input while holding the rest stable.

Example:

```text
Timeline A:
Mina repeatedly experiences Glen as reliable.

Timeline B:
Same state, schedule, seed, and events,
except Priya supplies the same reliable outcomes.
```

Question:

> Does the expected difference arise through the correct causal path?

---

## 13.3 Ablation experiment

Remove one candidate distinction.

Example:

```text
Reference:
Appraisal → Affect → Motive

Ablation:
Appraisal → Motive
```

Question:

> Does losing Affect eliminate any required phenomenon or counterfactual?

---

## 13.4 Derivation experiment

Replace independently stored state with a value computed from lower-level causes.

Question:

> Does persistent authoritative state actually add behavior that derivation cannot reproduce?

---

## 13.5 Merger experiment

Collapse two candidate states or transformations.

Question:

> Can any retained scenario distinguish them?

---

## 13.6 Compression experiment

Preserve a distinction during learning, then replace its rich representation with cheaper consolidated state.

Typical targets:

- episodic memory;
- relationship history;
- old causal traces;
- habit learning.

Question:

> Can future behavior remain correct after detail is compacted?

---

## 13.7 Substitution experiment

Replace one mechanism with another mechanism preserving the same semantic seam.

Example:

```text
Gaussian belief update
vs
bounded evidential estimate
```

Question:

> Which mathematical representation preserves the required behavior and causal semantics more cleanly?

---

## 13.8 Competing-model experiment

Test two or more plausible causal structures.

Example:

```text
A: stored Need meter
B: body truth → derived pressure
C: body truth → interoception → pressure
```

Question:

> Which distinctions are actually required?

---

## 13.9 Pathology / adversarial experiment

Intentionally drive the model into unusual conditions:

- saturation;
- contradictory evidence;
- extreme repetition;
- prolonged deprivation;
- stress stacking;
- memory pressure;
- circular social inference;
- failed goal pursuit;
- repeated interference.

Question:

> Does the mechanism remain bounded, interpretable and causally honest?

---

# 14. Counterfactual discipline

Every important psychological claim should receive at least one discriminating counterfactual.

“Looks plausible” is not sufficient.

The preferred comparison is:

```text
SAME MODEL
SAME INITIAL AUTHORITATIVE STATE
SAME SEED
SAME EVENT ORDER
SAME EXTERNAL CONDITIONS

except:

ONE DELIBERATELY CHANGED CAUSAL VARIABLE
```

The difference must be traceable through exact intermediate state.

A good counterfactual tells us not merely that behavior changed, but **why the architecture says it changed**.

---

# 15. Causal trace

Trace generation is a research requirement.

It is not optional debugging.

Every important transition should support reconstruction of its causal derivation.

A full ideal trace may resemble:

```text
world/body truth
        ↓
observation / interoception
        ↓
SemanticExperience
        ↓
memory retrieval / recognition
belief / person-model evidence
        ↓
workspace contents
        ↓
appraisal
        ↓
affect
        ↓
motivational pressure
goal / prospective state
        ↓
semantic Reasons
        ↓
option appraisal
        ↓
arbitration
        ↓
deterministic intent or addressed roll
        ↓
chosen intent
        ↓
DecisionExpression
action / communication plan
        ↓
attempt
        ↓
competence + body + environment
        ↓
executed outcome
        ↓
perceived outcome
        ↓
prediction discrepancy
contingency / controllability
causal attribution
        ↓
belief / expectation / skill / habit update
        ↓
memory / identity / relationship / disposition consolidation
```

Not every event traverses every layer.

The trace must clearly identify skipped or non-applicable seams.

Every number or semantic classification in the trace must be reproducible from earlier authoritative state and named transformations.

---

# 16. Trace provenance and double-counting audits

Trace output must support more than chronology.

For Decision-relevant pressure it should support a provenance graph:

```text
source fact
↓
derived state
↓
semantic interpretation
↓
Reason contribution
```

This allows automated or experimental audits such as:

> Regulatory stress contributed to Fear.

> Fear created this avoidance Reason.

> Therefore do not also count the same stress signal as an equivalent direct avoidance Reason unless a separate causal effect has been defined.

Correlated evidence and correlated Reason pressure should be considered a recurring adversarial target.

---

# 17. Reduction verdicts

Verdicts are attached to **candidate distinctions**, not entire named subsystems unless the experiment actually tested the entire subsystem.

Every verdict records:

```text
Candidate distinction
Tested competing model(s)
Phenomenon corpus version
Scenarios exercised
Counterfactuals exercised
Observed differences
Mathematical findings
Semantic findings
Scaling findings, if measured
Verdict
Confidence limits / unresolved cases
Reopen conditions
```

Verdicts must never become confidence theater.

`UNRESOLVED` is a legitimate result.

A result should not be promoted to `RETAINED` merely because the team lacks a good competing experiment.

Likewise, a result must not be promoted to `MERGED`, `DERIVED` or `RETRACTED` merely because no current scenario happened to expose a difference. Every equivalence-supporting verdict must record:

- the declared input/state domain;
- the corpus version and coverage argument;
- the exact equivalence relation or tolerance;
- random coupling or exact distribution-comparison method;
- counterfactual coverage;
- and known regions not covered.

---

# 18. Research campaigns

CharacterLab should organize work into **research campaigns**, not additive feature phases.

A campaign addresses one architectural uncertainty or tightly coupled set of seams.

Examples may include:

- embodied Need ownership;
- regulatory dynamics;
- memory lifecycle and recognition;
- belief/appraisal/affect separation;
- cognitive workspace and control;
- goal/prospection representation;
- skill and action execution;
- social Person Models;
- relationship consolidation;
- identity/dispositional adaptation;
- habit/addiction;
- decision arbitration;
- communication.

These examples are research domains, not a locked delivery order.

The Build / Campaign Plan determines sequencing separately.

---

# 19. Campaign entry gate

A campaign should not begin merely because the mechanism sounds interesting.

Before entering:

1. identify the North Star seam or distinction under study;
2. reference a versioned formal seam contract with complete domains, transformation, ordering, quantization, randomness, mutation authority, invariants, and trace schema;
3. name the required phenomena that discriminate it;
4. identify any usable old control implementation;
5. define at least one competing model or ablation;
6. establish what unchanged downstream seams the experiment needs;
7. define the state and trace outputs required to judge the result;
8. define the reduction verdicts the experiment could legitimately support;
9. identify every unresolved formal decision and either resolve it or prove that it cannot affect the experiment's verdict.

A campaign whose only possible result is:

> We implemented the mechanism successfully.

is not yet a research campaign.

---

# 20. Campaign completion gate

A campaign concludes with a review containing:

## Psychological findings

What required behaviors appeared?

Which expected behaviors failed?

What surprising emergent behavior appeared?

---

## Mathematical findings

Which equations were stable?

Which bounds/invariants mattered?

Where did numerical representation become problematic?

---

## Semantic findings

Did the proposed variables retain distinct meanings?

Did any candidate collapse into another concept?

Did any epistemic boundary leak?

---

## Architectural findings

Which distinctions were:

```text
RETAINED
DERIVED
MERGED
COMPRESSED
RETRACTED
UNRESOLVED
```

---

## Counterfactual findings

Which causal changes produced meaningful differences?

Did the reduced model preserve them?

---

## Computational findings

What state, memory, events, matrix work or trace volume did the mechanism require?

These measurements inform later Vivarium distillation but do not automatically reject a psychologically necessary mechanism inside CharacterLab.

---

## Corpus updates

Did the experiment reveal a new discriminating case that should become permanent torture coverage?

---

## Reopen requirements

Which older verdicts are invalidated or deserve retesting because this campaign exposed a new distinction?

---

# 21. Build-plan contract

The separate CharacterLab Build / Campaign Plan must respect the following rules.

1. It implements the **ideal topology**, not a locally convenient subset presented as architecture.
2. It may use deliberately thin reference mechanisms.
3. It should prioritize seams by invalidation risk and discriminating value, not by visual impressiveness.
4. It should preserve old implementations as controls where useful.
5. It should avoid high-fidelity optimization before necessity is established.
6. It must keep every authoritative seam deterministic and traceable.
7. It should stop implementation once the experiment has enough fidelity to discriminate competing models.
8. It must update research verdicts rather than silently turning experimental mechanisms into permanent architecture.
9. It should maintain the retained torture corpus continuously.
10. It should prefer one strong causal experiment over broad shallow feature coverage.
11. It may implement a seam only by naming the exact version of its formal contract; code comments, test expectations, and agent interpretation cannot substitute for that contract.

The Build Plan owns sequence.

This brief owns the rules by which that sequence is judged.

---

# 22. CharacterLab-to-Vivarium distillation

Distillation occurs only after CharacterLab has internally reduced a meaningful portion of the reference architecture.

The first question is:

> What causal distinction is required?

Only then:

> What representation can Vivarium afford?

---

## 22.1 Semantic distillation contract

CharacterLab exports findings such as:

```text
Required state ownership
Transition equations
Epistemic boundary
Timing requirement
Counterfactual behavior
Provenance requirement
Compression rules
Acceptable approximations
Failure cases
```

It should not simply export:

```text
copy this TypeScript class into C#
```

---

## 22.2 Two-stage reduction

The intended process is:

```text
IDEAL REFERENCE MODEL
        ↓
CharacterLab causal reduction
        ↓
smallest research architecture that preserves phenomena
        ↓
Vivarium production reduction
        ↓
smallest production representation that preserves required behavior
```

A causal distinction may be necessary while its expensive CharacterLab representation is not.

---

## 22.3 Cross-model comparison

When CharacterLab and Vivarium implement competing representations of the same semantic state, standardized scenarios should compare:

- candidate/option availability;
- ranking agreement;
- distribution differences where stochastic choice exists;
- identical-random-uniform selected outcome;
- counterfactual response;
- historical consequences;
- later learning;
- semantic explanation.

Raw outcome agreement alone is insufficient.

---

# 23. Scaling as a research output

CharacterLab does not optimize primarily for 10,000 characters.

However, production feasibility is still an important finding.

Every retained mechanism should eventually report where relevant:

- persistent bytes/state;
- dynamic allocation;
- update complexity;
- analytical advancement possibilities;
- event frequency;
- sparse/dense behavior;
- lookup/index requirements;
- trace volume;
- history growth;
- compression opportunities;
- locality of invalidation.

A mechanism can therefore receive two simultaneous findings:

> **Psychologically/causally necessary**

and

> **Current representation unsuitable for Vivarium scale**

That is a successful research result.

It tells Vivarium what must be preserved while leaving implementation open.

---

# 24. Research output format

Every completed research question should produce at least four conclusions.

## Psychological finding

Example:

> Repeated successful dependence on one person produces attachment-like prioritization only when expectation and contextual accessibility remain distinct.

---

## Computational finding

Example:

> Full multi-hop activation changes only a small subset of decisions compared with a bounded one-hop representation.

---

## Architectural implication

Example:

> Contextual accessibility is required; a general unconstrained semantic graph is not demonstrated necessary.

---

## Production implication

Example:

> Vivarium should preserve accessibility as a semantic distinction but may use a cheaper sparse index rather than CharacterLab's research graph.

---

# 25. Retained research substrate

The reset does not require repository amnesia.

The following classes of prior work should normally be preserved until a concrete conflict appears:

- deterministic rational/integer utilities;
- versioned quantization;
- canonical semantic IDs;
- deterministic ordering;
- counter-addressed randomness;
- state/trace hashing;
- invariant/property-test harnesses;
- experimental comparison tooling;
- shared seeded comparison uniforms;
- reproducible fixtures;
- historical control implementations.

These mechanisms solve research-method problems rather than presupposing a particular person model.

They remain falsifiable if a future requirement exposes a limitation.

---

# 26. What the reset specifically retracts as governing assumptions

The following old assumptions must not silently re-enter CharacterLab merely because previous code or briefs used them.

CharacterLab does **not** assume that:

- seven inherited latent personality dimensions are the final constitutional primitives;
- personality is fully immutable;
- Need is necessarily persistent stored state;
- Values are necessarily derived from Need satisfaction;
- a global associative graph is the cognitive backbone;
- Action accessibility and desirability share one mechanism;
- episodic memory is merely an immutable event record plus retrieval score;
- observer social belief concerns only stable latent personality;
- Affect is reducible to regulatory state;
- inhibition is merely net opposing Action score;
- addiction is adequately represented by instantiating a withdrawal Need;
- every meaningful Action is chosen from one universal scored candidate list;
- one choice equation must govern every form of decision;
- belief about capability and actual skill are interchangeable;
- intent implies successful execution;
- internal state is directly visible in communication;
- historical experience and current recollection are the same information;
- the old additive Phase 0→6 sequence remains the active roadmap.

Any of these ideas may survive as experimental findings.

None survives as a premise.

---

# 27. Stopping condition

CharacterLab is not an endless general-cognition project.

Its foundational mission is complete when:

1. every candidate causal distinction in the current Ideal Character Architecture has received a research verdict across the retained phenomenon corpus;
2. every required North Star phenomenon is reproducible by the surviving architecture;
3. every authoritative seam remains deterministic and semantically explicit;
4. important epistemic and historical boundaries survive;
5. the architecture has been simplified until further reductions either fail a required discriminating case or remain explicitly `UNRESOLVED`;
6. the surviving semantic contracts are sufficiently characterized for Vivarium distillation.

This does not mean CharacterLab becomes permanently closed.

A new Vivarium requirement or newly discovered discriminating phenomenon may reopen an earlier verdict.

The correct question is not:

> Did we finish psychology?

It is:

> **Have we adequately classified the causal distinctions required by the current Vivarium personhood frontier?**

---

# 28. Reopening rule

A `RETAINED`, `DERIVED`, `MERGED`, `COMPRESSED`, or `RETRACTED` verdict may be reopened when:

- a new required phenomenon cannot be reproduced;
- a new counterfactual distinguishes previously equivalent models;
- an epistemic leak is discovered;
- historical provenance becomes insufficient;
- a new long-run scenario reveals a developmental failure;
- a Vivarium mechanic creates a new required intervention boundary;
- scaling research reveals that a preserved representation must be replaced while retaining its semantics.

Earlier experiments remain evidence.

They do not become dogma.

---

# 29. Core research principles

CharacterLab retains the strongest rules from the original research program:

> **No adjective without a mechanism.**

A label such as `Rebellious`, `Fearful`, `Attached`, `Distracted`, `Skilled`, or `Addicted` must summarize causal structure rather than substitute for it.

> **No mechanism without an explicit transformation.**

An authoritative relationship must be mathematically or symbolically specified.

> **No transformation without an invariant.**

The model must state what remains true across the transition.

> **No psychological claim without an experiment.**

Plausibility is a hypothesis, not a finding.

The reset adds:

> **No architectural distinction without a discriminating case.**

A separate box must eventually justify why it cannot be safely collapsed.

> **No simplification without a counterfactual.**

Matching a few outputs is not enough to prove equivalence.

> **No authoritative semantic meaning without provenance.**

The simulator must be able to explain how it earned the conclusion.

> **No implementation earns authority merely by existing.**

Previous work is evidence and tooling, not destiny.

And the long-running boundary remains:

> **CharacterLab discovers what matters. Vivarium decides what it can afford.**

---

# 30. Research posture in one page

CharacterLab should be willing to build an intentionally overcomplete person.

It should not be willing to keep that complexity without evidence.

It should be willing to use expensive mathematics.

It should not mistake mathematical sophistication for psychological necessity.

It should preserve distinctions long enough to test them.

It should collapse distinctions aggressively once controlled evidence shows they do not matter.

It should prefer explicit uncertainty to false precision.

It should prefer `UNRESOLVED` to inventing confidence.

It should preserve private knowledge boundaries even when omniscient access would simplify implementation.

It should preserve history even when recomputing the past would simplify storage.

It should preserve chosen intent even when the world prevents execution.

It should preserve actual competence separately from belief about competence.

It should preserve communication as an action rather than telepathy.

It should preserve causal meaning through every reduction.

The target is not:

> the most complicated deterministic person we can build.

Nor is it:

> the fewest variables we can get away with today.

The target is:

> **the smallest causally explicit deterministic architecture that has earned the right to call itself equivalent to the ideal character across the phenomena Vivarium needs.**

---

# 31. Source anchors

This brief should be read beneath:

- `CharacterLab — Ideal Character Architecture North Star.md` — primary architectural authority.
- `CHARACTER_ARCHITECTURE.md` / `CharacterLab — Ideal Character Architecture Map` — complete reference topology and state/seam map.

The following prior materials remain useful as historical research sources rather than governing architecture:

- `reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md`;
- `reference/CharacterLab — Phase 2.5 Research Brief.md` and later Phase briefs;
- `reference/CharacterLab — Phase 3 Implementation Plan.md` and other prior implementation plans;
- `reference/src/` control implementations;
- `reference/RESEARCH.md` and prior experimental fixtures.

`../vivarium/Docs/CharacterLabMathematicalReference.md` is a formula inventory compiled from Vivarium, not a CharacterLab specification. Every imported formula must be classified and re-specified in the Formal Reference Model before it can govern implementation.

Vivarium architecture, social-model, Decision-reasoning, memory, commitment, and product documents remain important sources of required phenomena and production constraints, but CharacterLab retains freedom to discover different underlying mathematical representations.

---

# 32. Immediate next documents

This brief deliberately does **not** specify the first implementation campaign.

Before a Build / Campaign Plan can sequence implementation, CharacterLab needs a small formal substrate:

1. a deterministic substrate contract;
2. a canonical state and mutation-authority model;
3. event ordering and same-instant scheduling rules;
4. trace and provenance rules;
5. a versioned seam-contract template and seam ledger;
6. a classified formula-intake ledger.

Only then should **CharacterLab — Reference Architecture Build & Research Campaign Plan** convert the Ideal Architecture Map into an executable research program by deciding:

1. what minimum deterministic scaffold is required for every ideal seam to exist;
2. which previously drafted mechanisms can populate that scaffold as controls;
3. which seams need new thin reference implementations;
4. what initial cross-domain scenarios prove the full causal path is traversable;
5. which high-invalidation-risk distinction becomes the first serious reduction campaign;
6. what retained torture corpus must pass before any simplification is accepted.

That plan should begin from the architecture as a whole.

It should not reconstruct the old additive phase ladder.
