# CharacterLab — Deterministic Cognitive Reference Model Brief

**Status:** Greenlit research project  
**Relationship to Vivarium:** Independent, parallel research track  
**Primary subject:** One high-fidelity simulated character  
**Primary purpose:** Test whether a small set of mathematically explicit psychological primitives can generate the higher-order phenomena Vivarium needs, then use those findings to inform future production architecture.

---

# 1. Mission

CharacterLab exists to test a specific unification hypothesis:

> **Needs, learned beliefs and expectations, associative accessibility, memory, personality, and experience may be sufficient to generate many psychological phenomena that would otherwise be modeled as separate systems.**

Candidate derived phenomena include:

- Values
- attachment
- relationship importance
- habit
- avoidance
- dependence
- obsession
- substitution
- grief responses
- craving
- addiction

CharacterLab does **not** assume that all of these are actually derivable.

That is the experiment.

For every phenomenon, the model must ultimately classify it as:

```text
DERIVED
Existing primitives reproduce the phenomenon adequately.

REQUIRES MECHANISM
Controlled experiments demonstrate a specific missing capability.

DEFERRED
Not currently important enough to Vivarium to justify further research.
```

CharacterLab is not tasked with discovering a universal theory of human psychology.

Its research frontier is bounded by questions relevant to Vivarium.

---

# 2. Relationship to Vivarium

Vivarium and CharacterLab answer different questions.

## Vivarium

> How can many autonomous people be simulated deterministically, efficiently, persistently, legibly, and at population scale?

## CharacterLab

> If population-scale cost is removed as the primary constraint, what deterministic mathematical mechanisms are actually required to produce the desired psychology of one person?

The intended relationship is:

```text
CHARACTERLAB
high-fidelity reference model
        ↓
controlled experiments
        ↓
behavioral traces
        ↓
psychological findings
        ↓
computational findings
        ↓
architectural implications
        ↓
reduced-order models
        ↓
VIVARIUM
production implementation
```

CharacterLab does not automatically produce Vivarium code.

A CharacterLab mechanism may be:

- adopted directly;
- approximated;
- replaced by a cheaper equivalent;
- represented differently;
- or rejected entirely.

The reference model defines desired behavior.

Vivarium remains free to achieve that behavior through another architecture.

---

# 3. Hard Constraints

Most Vivarium production constraints are intentionally relaxed.

Two are retained.

## 3.1 Determinism

Every authoritative transition must be completely specified.

For:

- model version \(M\),
- initial state \(S_0\),
- world/input sequence \(I\),
- deterministic seed \(R\),

the complete resulting trace must satisfy:

\[
Trace = F(M,S_0,I,R)
\]

with exactly one possible result.

Repeated execution must reproduce:

- state;
- graph structure;
- graph weights;
- Needs;
- beliefs;
- memories;
- retrievals;
- Values;
- candidate Actions;
- scores;
- random draws;
- selected Actions;
- outcomes;
- learning;
- final trace.

No authoritative relationship may be expressed only as:

> X could lead to Y.

It must have either:

\[
Y'=f(X,Y,\theta)
\]

or:

\[
Y'\sim P(Y'|X,Y,\theta)
\]

with a fully specified deterministic sampling procedure.

### No authoritative black boxes

Authoritative state transitions may not depend on:

- LLM calls;
- nondeterministic external services;
- unspecified floating-point behavior;
- collection iteration order;
- wall-clock timing;
- implicit randomness.

Generative tools may assist offline analysis, but never determine authoritative simulated state.

---

## 3.2 Semantic Interoperability

CharacterLab may use different mathematics from Vivarium, but shared concepts should retain compatible meanings.

Important shared semantic concepts include:

```text
Character
Need
PersonalityDimension
Trait
Belief
Evidence
Value
Interest
Memory
Relationship
Person
Activity
Action
Location
Experience
Outcome
Decision
```

CharacterLab should preserve Vivarium's latent personality dimensions:

```text
Warmth
Agency
Stability
Sociability
Openness
Discipline
Attunement
```

Named traits remain projections or interpretations of latent personality rather than duplicate state.

Semantic interoperability means:

> CharacterLab and Vivarium may represent a fact differently, but they must be able to agree on what the fact means.

---

# 4. Research Standard

CharacterLab distinguishes mathematical validity from psychological validity.

## Mathematical validity

We can prove:

- determinism;
- bounds;
- convergence;
- uniqueness;
- exact dependency relationships;
- numerical error bounds;
- invariant preservation.

## Psychological validity

We cannot prove mathematically that a model is psychologically correct.

We instead test:

- whether expected phenomena appear;
- whether counterfactual changes produce expected differences;
- whether pathologies emerge;
- whether unnecessary mechanisms can be removed;
- whether simpler models reproduce the reference model.

Therefore every important mechanism requires:

```text
Equation
+
Invariant
+
Unit test
+
Behavioral experiment
+
Counterfactual experiment
```

---

# 5. Numerical Model

CharacterLab uses two numerical layers.

## 5.1 Exact oracle mathematics

Arbitrary-precision integers and rational numbers may be used for:

- proof/reference calculations;
- unit-test oracles;
- matrix operations;
- deriving expected results;
- validating quantized implementations.

An exact rational is:

\[
x=\frac pq
\]

with:

\[
p\in\mathbb Z,\qquad
q\in\mathbb Z^+,\qquad
gcd(|p|,q)=1
\]

Exact rational state is not permitted to grow indefinitely as persistent runtime state.

---

## 5.2 Authoritative quantized state

Persistent scalar state lives on a versioned rational lattice:

\[
\mathcal Q_D=
\left\{
\frac{k}{D}:k\in\mathbb Z
\right\}
\]

where \(D\) is a model-versioned scale.

A temporary exact result \(x\) is quantized by:

\[
Q_D(x)=
\frac{
RoundEven(Dx)
}{D}
\]

where `RoundEven` is nearest-integer, ties-to-even.

Therefore:

\[
|Q_D(x)-x|\le\frac{1}{2D}
\]

for one quantization.

The point at which quantization occurs is part of every authoritative algorithm.

There is no implicit rounding.

---

# 6. Deterministic Execution Contract

Every event has:

```text
EventId
OccurredAt
EventType
CanonicalPayload
```

All simultaneous changes follow:

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
```

All sets and maps have canonical traversal order.

Every type that can serve as a semantic identity owns a stable identifier.

---

# 7. Randomness

Randomness is permitted.

Nondeterminism is not.

Random values come from a counter-addressed oracle:

\[
r=
H(
Seed,
ModelVersion,
EventId,
PurposeId,
DrawIndex
)
\]

There is no mutable global RNG stream.

An unrelated random event therefore cannot shift later random results.

---

# 8. Character State

At time \(t\):

\[
S_t=
(
P,
N_t,
W_t,
E_t,
B_t,
M_t
)
\]

where:

- \(P\) = latent personality;
- \(N_t\) = Need state;
- \(W_t\) = associative structure;
- \(E_t\) = learned predictive expectations;
- \(B_t\) = beliefs about people/world;
- \(M_t\) = episodic memories.

Initially, the following are **derived rather than primitive**:

- Values;
- attachment;
- relationship motivational importance;
- dependence;
- obsession;
- habit;
- inhibition/avoidance.

A controlled experiment may later demonstrate that a derived phenomenon requires additional authoritative state.

---

# 9. Latent Personality

The character owns:

\[
P=
[p_1,\ldots,p_7]^T
\]

corresponding to:

```text
Warmth
Agency
Stability
Sociability
Openness
Discipline
Attunement
```

with:

\[
p_i\in[-1,1]
\]

Personality is initially immutable.

Personality change is not introduced until a deterministic update model has independently earned inclusion.

## 9.1 Trait projections

A named trait may be derived through:

\[
T_k(P)=
g(
b_k+w_k^TP+P^TQ_kP
)
\]

with bounded response:

\[
g(x)=\frac{x}{1+|x|}
\]

This ensures:

\[
-1<g(x)<1
\]

for every finite \(x\).

## 9.2 Cognitive parameters

Personality may eventually influence parameters such as:

- exploration;
- learning sensitivity;
- associative persistence;
- memory encoding;
- social evidence sensitivity;
- routine persistence.

Any such parameter must use an explicit field:

\[
\theta(P)=
Clamp(
b+w^TP+P^TQP,
\theta_{min},
\theta_{max}
)
\]

No personality relationship enters the model solely because it seems plausible.

---

# 10. Needs

Each Need instance contains:

```text
NeedId
Origin
Level
SetPoint
CoreImportance
PassiveRate
```

where `Origin` is initially one of:

```text
Core
Acquired
```

Core Needs exist from initialization.

Acquired Needs may be instantiated later by deterministic adaptation mechanisms.

For normalized Need level:

\[
0\le L_n(t)\le1
\]

Between events:

\[
L_n(t+\Delta t)
=
Clamp(
L_n(t)+R_n\Delta t,
0,
1
)
\]

Need deficit:

\[
D_n=
\max
\left(
0,
\frac{S_n-L_n}{S_n}
\right)
\]

for \(S_n>0\).

Need urgency:

\[
U_n=
K_nD_n^{p_n}
\]

where:

- \(K_n\) = CoreImportance;
- \(p_n\) = authored positive integer.

Thus current motivation is explicitly separated into:

```text
how important this Need generally is
×
how unsatisfied it currently is
```

---

# 11. Experience

Experience is the atomic learning event.

```text
Experience
├── ExperienceId
├── OccurredAt
├── Actor
├── Action
├── Participants[]
├── ContextConcepts[]
├── Location
├── NeedStateBefore[]
├── NeedStateAfter[]
├── Observations[]
└── SemanticTags[]
```

Actual Need result:

\[
r_n=
L_n(after)-L_n(before)
\]

All systems learn from this shared authoritative Experience.

No subsystem gets a private interpretation of what happened.

---

# 12. Learned Need-Satisfaction Expectations

For semantic subject \(x\) and Need \(n\):

```text
NeedExpectation(x,n)
├── Mean μ_xn
├── Precision τ_xn
└── LastUpdatedAt
```

\[
\mu_{xn}
\]

means:

> Expected effect of \(x\) on Need \(n\).

Precision represents accumulated evidence.

Before new evidence:

\[
\tau^-_{xn}
=
\delta_q(\Delta t)\tau_{xn}
\]

with:

\[
\delta_q(\Delta t)=
\frac{1}{1+\lambda_q\Delta t}
\]

An observation carries precision:

\[
\rho_n=
Clamp(
\rho_0[
1+\sigma K_nU_n
],
\rho_{min},
\rho_{max}
)
\]

The update is:

\[
\mu'_{xn}
=
\frac{
\tau^-_{xn}\mu_{xn}
+
\rho_nr_n
}{
\tau^-_{xn}+\rho_n
}
\]

\[
\tau'_{xn}
=
\tau^-_{xn}+\rho_n
\]

### Prediction-error identity

This is algebraically equivalent to:

\[
\mu'=
\mu+\alpha(r-\mu)
\]

where:

\[
\alpha=
\frac{\rho}{\tau^-+\rho}
\]

Therefore highly reinforced expectations become resistant to isolated contradictory evidence without needing a separate inertia system.

## Confidence

\[
C_{xn}=
\frac{\tau_{xn}}
{\tau_{xn}+K_C}
\]

Thus expectation and confidence remain different quantities.

---

# 13. Semantic Concepts

CharacterLab operates over typed concepts.

Initial categories:

```text
Need
Person
Activity
Action
Location
Object
Context
ValueConcept
TraitConcept
OutcomeConcept
MemoryEpisode
```

Every concept has a stable `ConceptKey`.

Examples:

```text
need.connection
person.glen
activity.tabletop_games
location.home
value.independence
```

Anonymous untyped graph nodes are prohibited.

---

# 14. Associative Structure

The associative graph answers:

> What does the character mentally associate with what?

It does not directly answer:

> What should the character choose?

Let:

\[
W_{ij}\ge0
\]

be directed association strength.

For every row:

\[
\sum_jW_{ij}\le1
\]

Therefore \(W\) is row-substochastic.

## Sole mutation authority

`AssociationLearning` is the sole system permitted to mutate \(W\).

No other subsystem may directly edit graph weights.

This is a proof-load-bearing invariant.

---

# 15. Association Learning

For an Experience, concept \(i\) receives activation:

\[
0\le z_i\le1
\]

Temporary exact weights are:

\[
\hat W_{ij}
=
\delta_a(\Delta t)W_{ij}
+
\eta z_i z_j
\]

where:

\[
\delta_a(\Delta t)
=
\frac{1}{1+\lambda_a\Delta t}
\]

for eligible co-active concept pairs.

## 15.1 Quantized normalization

Direct independent rounding after normalization is prohibited because it can violate:

\[
\sum_jW_{ij}\le1
\]

Instead each temporary row is converted to integer lattice mass.

First:

\[
q_j=
\max(
0,
RoundEven(D\hat W_{ij})
)
\]

Let:

\[
S=\sum_jq_j
\]

If:

\[
S\le D
\]

store:

\[
W_{ij}=\frac{q_j}{D}
\]

If:

\[
S>D
\]

perform deterministic proportional allocation:

\[
a_j=
\left\lfloor
\frac{q_jD}{S}
\right\rfloor
\]

and remainder:

\[
r_j=
(q_jD)\bmod S
\]

Let:

\[
R=
D-\sum_ja_j
\]

Add one lattice unit to the \(R\) entries with the largest remainder \(r_j\), breaking ties by canonical `ConceptKey`.

Stored value:

\[
W_{ij}=
\frac{a'_j}{D}
\]

Then by construction:

\[
W_{ij}\ge0
\]

and:

\[
\sum_jW_{ij}\le1
\]

with equality when normalization was required.

This preserves both:

- fixed-lattice authoritative state;
- the row-substochastic invariant.

---

# 16. Spreading Activation

Current Needs and Context generate base activation vector \(b\).

For example:

\[
b_{\text{need.connection}}
=
U_{\text{connection}}
\]

Full associative activation satisfies:

\[
a=b+\beta Wa
\]

with:

\[
0\le\beta<1
\]

Therefore:

\[
a=(I-\beta W)^{-1}b
\]

## Stability and uniqueness

Since:

\[
\sum_jW_{ij}\le1
\]

then:

\[
\|W\|_\infty\le1
\]

Therefore:

\[
\|\beta W\|_\infty\le\beta<1
\]

and:

\[
\rho(\beta W)<1
\]

Thus:

\[
(I-\beta W)^{-1}
\]

exists and the activation system has one unique solution.

The authoritative implementation uses exact/fraction-free matrix solving for temporary calculation and quantizes its persisted outputs only where explicitly specified.

No iterative convergence tolerance is authoritative.

---

# 17. Episodic Memory

Every Experience creates an immutable episodic record:

```text
MemoryId
ExperienceId
EncodedAt
SemanticConcepts[]
NeedOutcomes[]
PredictionErrors[]
Participants[]
Location
Action
```

Historical episode facts are not silently rewritten.

## Accessibility

Memory retrieval history:

\[
T_m=
\{t_0,t_1,\ldots,t_k\}
\]

Base accessibility:

\[
Base_m(t)=
\sum_{r\in T_m}
\frac{
1
}{
(1+\lambda_m(t-r))^{d_m}
}
\]

with positive integer \(d_m\).

Final retrieval score:

\[
Retrieval_m=
\omega_bBase_m+\omega_aa_m
\]

Top memories are selected using canonical score ordering and stable tie-breaking.

Retrieval itself becomes another retrieval timestamp and therefore changes future accessibility.

## Reconsolidation

Initially:

- memory content remains immutable;
- retrieval activates its associated semantic concepts;
- this activation may alter current association weights through ordinary learning.

Literal rewriting of remembered content is deferred until an exact model exists.

---

# 18. Beliefs About People

CharacterLab preserves the distinction between:

> I believe Glen is moderately warm.

and:

> I have almost no evidence about Glen's warmth.

For target \(Y\):

\[
P_Y\sim(\mu_Y,\Sigma_Y)
\]

where:

- \(\mu_Y\) = believed latent personality;
- \(\Sigma_Y\) = uncertainty.

Observations may use:

\[
y=HP_Y+\epsilon
\]

with deterministic seeded measurement noise.

Posterior update:

\[
K=
\Sigma H^T(H\Sigma H^T+R)^{-1}
\]

\[
\mu'=
\mu+K(y-H\mu)
\]

\[
\Sigma'=
(I-KH)\Sigma
\]

Matrix operations use a deterministic fraction-free algorithm with:

- fixed pivot rule;
- canonical row order;
- defined singularity behavior;
- explicit quantization point.

---

# 19. Social Appraisal

A target personality belief can be evaluated through lens-specific fields.

\[
s(x)=
b+w^Tx+x^TQx
-\frac12(x-i)^TP(x-i)
\]

where:

\[
P=LL^T
\]

For:

\[
x\sim(\mu,\Sigma)
\]

expected score is:

\[
E[s]
=
b+w^T\mu
+\mu^TQ\mu
+\operatorname{tr}(Q\Sigma)
-\frac12
[
(\mu-i)^TP(\mu-i)
+
\operatorname{tr}(P\Sigma)
]
\]

Bounded appraisal:

\[
A=
\frac{E[s]}{1+|E[s]|}
\]

Possible lenses remain distinct:

```text
Affiliation
Comfort
Respect
Reliance
Attraction
```

There is no universal Relationship score.

---

# 20. CharacterLab ↔ Vivarium Social Comparison

CharacterLab must not assume that semantic similarity means mathematical equivalence.

Phase 3 therefore includes a direct comparison experiment:

```text
same true personality
same initial uncertainty
same evidence sequence

        ├── CharacterLab belief/appraisal model
        │
        └── Vivarium production social model
```

Compare:

- belief trajectory;
- uncertainty;
- appraisal trajectory;
- resulting candidate reasons;
- resulting behavioral choice.

If both produce behaviorally equivalent outcomes, Vivarium's cheaper model is preferred for production.

If they diverge materially, the divergence becomes an explicit research finding.

---

# 21. Values

Values are initially derived.

For ValueConcept \(v\):

\[
V_v=
g
\left(
\sum_n
K_n
C_{vn}
\mu_{vn}
\right)
\]

where:

- \(K_n\) = Need importance;
- \(\mu_{vn}\) = learned expectation that enactment of \(v\) affects Need \(n\);
- \(C_{vn}\) = confidence.

Therefore:

\[
BeliefChange
\Rightarrow
ValueChange
\]

without independent Value mutation.

Value inertia emerges from high-confidence beliefs updating slowly.

Whether this is sufficient is an explicit CharacterLab experiment, not an assumption of correctness.

---

# 22. Candidate Action Generation

Associative activation determines what occurs to the character.

An Action becomes a candidate only if:

1. its world preconditions are true;
2. its accessibility exceeds authored threshold \(\theta_A\);
3. it survives canonical top-\(K_A\) selection.

There is no emergency-action escape hatch.

If extreme Need urgency fails to make a necessary response accessible, that is an experimental result.

The model may later introduce an explicit relationship such as:

\[
b_{\text{Drink}}=
f(U_{\text{Thirst}})
\]

only after the need for it is demonstrated.

---

# 23. Action Evaluation

Accessibility determines:

> What occurs to me?

Evaluation determines:

> How desirable does it seem?

They are separate.

## Need term

\[
N_a=
\sum_n
U_nC_{an}\mu_{an}
\]

## Value term

With authored:

\[
Align(a,v)\in[-1,1]
\]

then:

\[
V_a=
\lambda_V
\sum_v
V_vAlign(a,v)
\]

## Personality term

\[
P_a=
g(
b_a+w_a^TP+P^TQ_aP
)
\]

## Social term

\[
S_a=
\sum_l
\lambda_lAppraisal_l(Target)
\]

for social Actions.

## Context term

\[
C_a=
g(
b_c+w_c^TContext+
Context^TQ_cContext
)
\]

## Total

\[
Score(a)=
N_a+V_a+P_a+S_a+C_a
\]

Association and memory scores are **not added again** here.

This prevents mental accessibility from being double-counted as Action desirability.

---

# 24. Choice

Bound:

\[
\bar S_a=
\frac{Score(a)}
{1+|Score(a)|}
\]

Define positive choice weight:

\[
W_a=
(\epsilon+1+\bar S_a)^\gamma
\]

where:

- \(\epsilon>0\);
- \(\gamma\) is a positive integer.

Probability:

\[
Pr(a)=
\frac{W_a}{\sum_jW_j}
\]

Actions are ordered by shared `CanonicalActionKey`.

A deterministic uniform sample selects the first Action whose cumulative probability exceeds the draw.

Initially:

\[
\gamma=\gamma_0
\]

A personality-dependent:

\[
\gamma=\Gamma(P)
\]

is not introduced until an experiment demonstrates that it adds necessary behavior.

---

# 25. Full Cognitive Cycle

The authoritative transition cycle is:

```text
1. Advance analytical Need state
2. Apply deterministic world input
3. Construct base cognitive activation
4. Solve associative activation
5. Retrieve memories
6. Generate feasible accessible Actions
7. Evaluate Actions
8. Produce Action probability distribution
9. Select Action using deterministic randomness
10. Apply deterministic/stochastically-addressed world outcome
11. Measure Need outcomes
12. Create Experience
13. Update Need-satisfaction expectations
14. Update beliefs from observations
15. Create episodic Memory
16. Update associative structure
17. Recompute derived Values
18. Validate invariants
19. Commit next state
20. Emit full causal trace
```

Every arrow corresponds to an explicit function.

---

# 26. Acquired Needs and Addiction

CharacterLab explicitly investigates whether experience can create new Need-like regulatory pressures.

This capability is required to test addiction rather than merely describing it.

For exposure target \(x\), define adaptation state:

\[
0\le A_x\le1
\]

Exposure update:

\[
A'_x=
Clamp(
A_x+
\alpha_xDose
-
\beta_x\Delta t,
0,
1
)
\]

subject to explicit ordering and quantization rules.

When:

\[
A_x\ge\theta_x
\]

the model may instantiate an acquired Need:

```text
NeedId: withdrawal.x
Origin: Acquired
```

Its SetPoint, importance, passive behavior, and relief relationship must be explicit functions of adaptation.

A candidate hypothesis is:

\[
K_{\text{withdrawal}}
=
f_K(A_x)
\]

\[
U_{\text{withdrawal}}
=
f_U(A_x,\Delta t_{\text{since exposure}})
\]

and use of \(x\) produces:

\[
r_{\text{withdrawal}}>0
\]

This creates the candidate loop:

```text
use
↓
Need relief
↓
positive expectation
↓
repeated exposure
↓
adaptation
↓
acquired withdrawal pressure
↓
use strongly relieves withdrawal
↓
further reinforcement
```

CharacterLab must determine whether:

- an acquired Need is sufficient;
- a separate Craving state is required;
- addiction is primarily Need-based, associative, or both.

No answer is assumed in advance.

---

# 27. Derived Diagnostics

These are observations, not primitive character state.

## Dependence

For Need \(n\), define positive motivational accessibility of satisfier \(x\):

\[
M_{nx}=
A_xC_{nx}\max(0,\mu_{nx})
\]

Then:

\[
Dependence(n,x)=
\frac{
M_{nx}
}{
\epsilon+\sum_yM_{ny}
}
\]

Dependence rises as a Need becomes concentrated around one perceived solution.

## Relationship motivational importance

For person \(x\):

\[
Importance(x)=
\frac{
\sum_nK_nDependence(n,x)
}{
\sum_nK_n
}
\]

This is distinct from affection, trust, comfort, fear, or respect.

## Obsession

A candidate diagnostic:

\[
Obsession(x)=
ImportanceLikeConcentration(x)
\times
Persistence(x)
\]

where `Persistence` is a precisely defined measure of repeated accessibility across a fixed observation window.

The exact final definition must be locked before Obsession experiments are judged.

## Inhibition

Not primitive.

For Action contributions \(c_k\):

\[
Support(a)=
\sum_{c_k>0}c_k
\]

\[
Opposition(a)=
\sum_{c_k<0}|c_k|
\]

Descriptive ratio:

\[
Inhibition(a)=
\frac{
Opposition(a)
}{
\epsilon+Support(a)+Opposition(a)
}
\]

The actual cause remains the competing Need, Value, social, personality, or Context term.

---

# 28. Behavioral Experiment Suite

Initial required experiments:

### Learned satisfaction
Mina repeatedly experiences Glen satisfying Connection.

### Attachment
Repeated successful satisfaction increases preferential accessibility and selection of Glen.

### Substitution
Glen becomes unavailable; Priya should not initially act as a perfect substitute but may become one through successful experience.

### Betrayal
A high-confidence positive expectation receives sharply negative evidence.

### Avoidance
Repeated harmful outcomes reduce future pursuit without an Inhibition primitive.

### Habit
Repeated Context → Action → successful Outcome creates increasingly accessible behavior.

### Obsession
One satisfier repeatedly supports several important Needs.

### Healthy multiplicity
Several reliable satisfiers prevent concentration around one target.

### Value formation
Repeated experience consistent with a ValueConcept increases its derived strength.

### Value revision
Sustained contradictory experience moves the underlying beliefs and therefore the Value.

### Grief / loss
Remove a person central to several Need pathways.

### Memory accessibility
Verify recency, frequency, retrieval reinforcement, and decay.

### Rumination
Repeated recall alters future accessibility and associations.

### Addiction
Repeated exposure creates adaptation, acquired pressure, and a reinforced relief loop.

### Social-belief comparison
Drive identical social evidence through CharacterLab and Vivarium.

---

# 29. Counterfactual Requirement

Every major experiment receives a paired counterfactual.

Example:

```text
Timeline A:
20 successful Connection experiences with Glen.

Timeline B:
Identical initial state, seed, world events, and timing,
except the same experiences occur with Priya.
```

The resulting behavioral difference must be traceable through exact intermediate state.

“Looks plausible” is not sufficient.

---

# 30. Causal Trace

Every meaningful choice emits a complete derivation.

Example:

```text
Connection urgency
    ↓
base activation

base activation
    ↓
association solve

association solve
    ↓
accessible concepts

accessible concepts
    ↓
retrieved memories

retrieval + world feasibility
    ↓
candidate Actions

candidate Action
    ↓
Need term
Value term
Personality term
Social term
Context term

terms
    ↓
total score

score
    ↓
choice weight

choice weights
    ↓
probability distribution

probability + addressed random draw
    ↓
selected Action

selected Action
    ↓
Outcome

Outcome
    ↓
Experience

Experience
    ↓
belief update
memory creation
association update
derived Value change
```

Every number in the trace must be reproducible from earlier values.

Trace generation is a product requirement, not optional debug logging.

---

# 31. Cross-Model Distillation Protocol

For standardized scenario state \(s\):

CharacterLab produces:

\[
P_R(a|s)
\]

A Vivarium candidate produces:

\[
P_V(a|s)
\]

Both systems must export Actions under the same:

```text
CanonicalActionKey
```

and sort distributions using the same canonical order.

## Shared Experimental Uniform

For coupled stochastic comparisons, the experiment harness supplies:

\[
u\in[0,1)
\]

from one canonical experimental generator.

Both models use the same \(u\) against their own probability distribution.

This prevents unrelated RNG implementations from contaminating behavioral comparison.

## Comparison metrics

Primary comparison should include:

1. candidate-set overlap;
2. Action ranking agreement;
3. probability-distribution difference;
4. counterfactual response difference;
5. identical-\(u\) selected-Action agreement.

Raw Action agreement is not sufficient by itself.

---

# 32. Proof Obligations

A mechanism is not complete until its mathematical obligations are satisfied.

Required initial obligations include:

### Transition determinism

All authoritative state derives exclusively from:

\[
(M,S_0,I,R)
\]

### Quantization bound

For scalar quantization:

\[
|Q_D(x)-x|
\le
\frac1{2D}
\]

### Association invariant

After every legal mutation:

\[
W_{ij}\ge0
\]

and:

\[
\sum_jW_{ij}\le1
\]

### Association mutation authority

`AssociationLearning` is the only legal mutation path for \(W\).

### Activation uniqueness

Given:

\[
0\le\beta<1
\]

and row-substochastic \(W\):

\[
\rho(\beta W)<1
\]

therefore the activation solution is unique.

### Bounded response

For finite \(x\):

\[
-1<
\frac{x}{1+|x|}
<1
\]

### Prediction-error equivalence

Precision-weighted belief updating must be algebraically equivalent to:

\[
\mu'=\mu+\alpha(r-\mu)
\]

with explicitly derived \(\alpha\).

### Confidence bound

For finite:

\[
\tau\ge0
\]

prove:

\[
0\le C<1
\]

### Value transitivity

Every change in a derived Value must trace to:

- Need importance;
- expectation;
- confidence.

### Random reproducibility

Random behavior must be independent of unrelated random draw count or collection ordering.

---

# 33. Phase Structure

## Phase 0 — Mathematical Kernel

Build:

```text
versioned numeric scale
exact rational oracle
bounded authoritative quantizer
arbitrary-width integer math
fraction-free linear algebra
counter-based random oracle
canonical identity/order
state hashing
event model
transition trace
proof/invariant test harness
shared Experimental Uniform
CanonicalActionKey
```

**Phase 0 cannot complete until:**

- association normalization preserves its invariant by construction;
- random replay is exact;
- canonical ordering tests pass;
- numeric error bounds are tested;
- repeated identical runs produce identical traces.

---

## Phase 1 — Need-Satisfaction Learning

Build:

```text
Needs
Experience
NeedExpectation
Confidence
simple Actions
choice distribution
learning updates
```

Primary experiment:

```text
Mina learns Glen reliably satisfies Connection.
```

No associative graph required yet.

---

## Phase 2 — Associative Accessibility and Memory

Add:

```text
semantic concepts
association graph
learning/atrophy
normalization
spreading activation
episodic memory
retrieval accessibility
```

Test:

- habit;
- attachment;
- substitution;
- avoidance;
- memory accessibility.

---

## Phase 3 — Personality, Belief, and Social Appraisal

Add:

```text
latent personality
belief distributions
evidence update
social appraisal fields
CharacterLab-vs-Vivarium comparison harness
```

Test:

- uncertain impressions;
- incorrect beliefs;
- social learning;
- behavioral divergence between belief models.

---

## Phase 4 — Values

Add derived Values.

Test:

- formation;
- persistence;
- revision;
- whether Value requires independent state.

---

## Phase 5 — Emergent Patterns and Acquired Needs

Test:

- dependence;
- obsession;
- grief;
- rumination;
- acquired Needs;
- craving;
- addiction.

Do not add a primitive merely because the first experiment fails.

First determine which missing capability caused the failure.

---

## Phase 6 — Distillation

Construct progressively cheaper approximations.

Compare them against the reference model.

Possible findings:

```text
NeedExpectation alone preserves 82% of target behavior.

+ bounded accessibility preserves 96%.

Full multi-hop graph improves only to 97%.
```

or:

```text
NeedExpectation alone fails on substitution and grief.

Accessibility improves substitution.

Cross-context association is required for grief behavior.
```

The output is evidence for architecture.

Not production code.

---

# 34. Phase-End Research Gate

Before beginning the next phase, produce a review containing:

## Psychological findings

What behaviors appeared?

What failed?

## Mathematical findings

Which mechanisms were load-bearing?

Which were redundant?

Which became unstable or pathological?

## Architectural findings

What smaller representation appears sufficient?

What concepts appear genuinely independent?

## Vivarium comparison

Does Vivarium already represent the necessary information?

Would adapting Vivarium provide meaningful value now?

Or should the finding remain research-only?

## Next-phase justification

What unresolved behavior specifically requires the next mechanism?

A phase does not proceed merely because the next feature sounds interesting.

---

# 35. Stopping Condition

CharacterLab is not an endless general-cognition project.

The broad research mission is complete when every psychological phenomenon currently relevant to Vivarium has been classified as:

```text
DERIVED
REQUIRES MECHANISM
DEFERRED
```

Current research frontier:

```text
Need satisfaction learning
Belief formation/revision
Value formation/revision
Attachment
Relationship importance
Substitution
Habit
Avoidance
Dependence
Obsession
Memory accessibility
Memory consolidation
Rumination
Grief
Craving
Addiction
```

Vivarium development may later reopen CharacterLab with new research questions.

---

# 36. Research Output Format

Every completed research question should produce three conclusions.

### Psychological finding

Example:

> Repeated Need relief creates attachment-like behavior only when learned expectation and accessibility are represented separately.

### Computational finding

Example:

> Multi-hop graph activation changes fewer than 2% of tested decisions compared with one-hop accessibility.

### Architectural implication

Example:

> A production model likely needs NeedExpectation and Accessibility, but not a general semantic graph.

This three-part output is the primary deliverable of CharacterLab.

---

# 37. Core Research Principle

CharacterLab should be willing to use computationally expensive mechanisms in order to determine whether they matter.

It should not optimize away a phenomenon before understanding it.

But every mechanism must remain:

- deterministic;
- semantically defined;
- mathematically specified;
- invariant-preserving;
- traceable;
- falsifiable through experiment.

The project follows four rules:

> **No adjective without a mechanism.**

> **No mechanism without an equation.**

> **No equation without an invariant.**

> **No psychological claim without an experiment.**

And one final architectural rule:

> **CharacterLab discovers what matters. Vivarium decides what it can afford.**