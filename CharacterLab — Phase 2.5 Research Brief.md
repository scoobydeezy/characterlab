# CharacterLab — Phase 2.5 Research Brief  
## Experience Encoding, Semantic Salience, and Saturated Satisfaction

**Status:** Proposed intermediate research phase  
**Position:** Between Phase 2 — Associative Accessibility & Episodic Memory and Phase 3 — Personality, Belief & Social Appraisal  
**Primary purpose:** Resolve two open problems discovered empirically during Phase 0–2 before introducing higher-order appraisal and belief machinery.

---

# 1. Why Phase 2.5 Exists

Phase 1 and Phase 2 produced two important findings that expose incompleteness in the current definition of `Experience`.

### Finding A — Experience tagging is currently structurally meaningful

Associative learning does not merely care that two concepts occurred together.

The strength of a learned pairwise association depends on:

- which concepts are included in the Experience;
- how many concepts are included;
- how strongly each concept is activated.

Under the current row-substochastic association model, every additional co-active concept competes for finite association capacity.

Therefore:

> **The semantic footprint of an Experience is part of the cognitive model, not passive metadata.**

A world event cannot safely become an Experience by simply attaching every technically present entity with equal activation.

---

### Finding B — Bounded Need state can corrupt the observed learning signal

Current Need state is bounded:

\[
0\le L_n\le1
\]

If a satisfier has an authored effect larger than the remaining available Need capacity, the applied state change is clipped.

Example:

```text
Need before          0.90
Potential effect    +0.40
Need after           1.00

Observed delta      +0.10
Unrealized effect   +0.30
```

If learning treats the observed Need delta as a complete measurement of the satisfier's efficacy, the character incorrectly learns that the satisfier became weaker.

The same problem occurs at the lower boundary with negative effects.

Therefore:

> **Realized Need-state change and learned evidence about a satisfier's efficacy cannot automatically be treated as the same quantity.**

---

# 2. Phase Goal

Phase 2.5 must answer two research questions.

## Question 1 — Semantic Salience

> How does a character deterministically derive what an Experience was psychologically "about" from an emergent world event, without scenario-specific authoring?

The result should assign explicit semantic activation weights to perceived concepts based on their role in the event and the character's state.

---

## Question 2 — Saturated Satisfaction

> What evidence should a character learn from when a bounded Need reaches its floor or ceiling before the full potential effect of an action can be observed?

The result must distinguish:

- what physically happened to the Need;
- what the character can infer about the satisfier;
- whether any psychologically meaningful reward exists beyond homeostatic Need change.

---

# 3. Research Principle: Do Not Design Toward Current Vivarium Architecture

This phase must **not** ask:

> Can Vivarium currently support this?

or:

> How do we fit this into Vivarium's existing systems?

CharacterLab's purpose is to discover the desirable simulation model first.

The correct research question is:

> **If this mechanism proves necessary for convincing character simulation, what capability would Vivarium need in order to preserve the important behavior?**

Vivarium's current architecture is evidence about an existing implementation.

It is not a boundary on CharacterLab's research.

CharacterLab may therefore discover that an ideal production simulation needs concepts that Vivarium:

- already represents;
- partially represents;
- represents in another form;
- does not currently represent;
- or would require architectural restructuring to support cleanly.

That is an acceptable and valuable outcome.

The research pipeline is:

```text
CHARACTERLAB
What is desirable?
        ↓
What is mathematically necessary?
        ↓
What behavior depends on it?
        ↓
What semantic capability must survive?
        ↓
VIVARIUM REVIEW
How should production architecture reproduce it?
```

Not:

```text
VIVARIUM CURRENT ARCHITECTURE
        ↓
What research are we allowed to perform?
```

## Vivarium-facing output

At the end of Phase 2.5, report:

> **If this finding survives later phases, what semantic capability would a production-scale character simulation need to preserve it?**

Do not prematurely answer:

> Which current Vivarium class should own it?

That is a later architectural/distillation question.

---

# 4. Experience as a Cognitive Boundary

Phase 2.5 should formalize the distinction between:

```text
WORLD EVENT
    ↓
PERCEPTION
    ↓
ATTENTION / SALIENCE
    ↓
EXPERIENCED OUTCOME
    ↓
LEARNING
```

These are not interchangeable.

## World Event

Contains objective simulation truth.

Example:

```text
Mina argues with Glen
in the Bakery
beside a red lamp
while hungry
after Glen cancels dinner
```

The world may contain many additional entities and conditions.

---

## Perceived Event

Contains only information available to the character.

An entity or fact cannot become part of the character's Experience unless the character could perceive or otherwise know it.

---

## Semantic Experience

Contains only concepts that crossed the threshold for meaningful cognitive encoding.

Each concept receives an explicit activation/salience value:

\[
0\le z_i\le1
\]

These values are then consumed by:

- associative learning;
- episodic memory encoding;
- later retrieval;
- potentially later appraisal or belief formation.

The semantic Experience is therefore an authoritative cognitive transformation of a perceived world event.

---

# 5. Semantic Salience Model

## 5.1 No scenario-specific weights

The system must not require authored instructions such as:

```text
In this argument:
Glen = 0.92
Bakery = 0.24
Lamp = 0.03
```

Naturally occurring events must derive those values from general rules.

Scenario authors may author:

- entity categories;
- Action semantics;
- causal roles;
- perceptibility;
- ordinary world properties.

They should not hand-author the psychological weight of every emergent event.

---

# 6. Category Priors

Every concept category may have a baseline encoding prior:

\[
B_i=BaseSalience(Category_i)
\]

Candidate initial categories may include:

```text
Action
Actor
Target
Participant
Person
Instrument
Object
Location
Context
Ambient
Need
Outcome
```

Illustrative ordering only:

```text
direct Action / target   high
active participant       high
instrument               medium-high
location                 medium-low
passive object           low
ambient context          very low
```

Exact values are an experimental parameter.

## Important constraint

Category cannot determine final salience by itself.

An object that causes a major injury must be capable of outranking an incidental Person or Location.

Category is a prior.

Context determines the event-specific result.

---

# 7. Causal Role

Every perceived concept should have a role in the event where applicable.

Candidate roles:

```text
Actor
Target
Recipient
Instrument
Cause
AffectedEntity
Participant
Location
Context
Incidental
```

Define:

\[
R_i=RoleWeight(Role_i)
\]

A concept's causal involvement should strongly influence salience.

Example:

### Ordinary dinner

```text
Glen       Person + Participant
Table      Object + Incidental
Home       Location
```

### Mina trips over the table

```text
Table      Object + Cause
Home       Location
Glen       Person + Witness
```

The same `Object` category must be capable of receiving dramatically different salience because its causal role changed.

---

# 8. Attention and Perception

A concept cannot receive semantic salience merely because it existed in the same world space.

Define:

\[
P_i\in\{0,1\}
\]

for whether the concept was perceptually available.

Then define:

\[
A_i\in[0,1]
\]

for attention/registration strength.

If:

\[
P_i=0
\]

then:

\[
z_i=0
\]

regardless of category or causal role.

Initially, attention may be derived from:

- direct participation;
- Action targeting;
- perceptual prominence;
- current focal Activity;
- surprise;
- causal relevance.

The exact model must remain deterministic.

---

# 9. Need Relevance

A concept may become more salient because it is implicated in a currently important Need outcome.

Define:

\[
N_i=
NeedRelevance(i,Experience)
\]

Possible determinants:

- magnitude of Need change;
- current Need urgency;
- whether concept \(i\) was part of the causal path producing that change;
- whether the effect was positive or negative.

A strongly Connection-relevant Glen interaction should encode more strongly than Glen merely passing through the room.

---

# 10. Surprise / Prediction Error

Existing NeedExpectation already provides prediction error:

\[
\delta=r-\mu
\]

Define surprise magnitude:

\[
S_i=f_S(|\delta|)
\]

for concepts causally implicated in the expectation.

Thus:

> Events that strongly contradict prediction may be encoded more strongly.

Example:

```text
Expected Glen Connection effect: +0.35
Actual evidence:                +0.34
```

Low surprise.

Versus:

```text
Expected: +0.35
Actual:   -0.60
```

High surprise.

This gives betrayal, unexpected generosity, accidents, and other surprising outcomes stronger potential encoding without hand-authored "important event" flags.

---

# 11. Candidate Salience Function

The first tested model should be explicit and decomposable.

One candidate form:

\[
Raw_i=
B_i
\cdot
R_i
\cdot
A_i
\cdot
(1+\alpha_NN_i)
\cdot
(1+\alpha_SS_i)
\]

where:

- \(B_i\) = category prior;
- \(R_i\) = causal-role factor;
- \(A_i\) = attention;
- \(N_i\) = Need relevance;
- \(S_i\) = surprise.

This is a hypothesis, not a locked final architecture.

Alternative additive or bounded formulations may be tested.

The requirements are:

- deterministic;
- bounded;
- decomposable in trace output;
- no scenario-specific psychological weights;
- no hidden variables.

---

# 12. Salience Budget

After raw saliences are computed, CharacterLab must test whether semantic encoding should use:

### Model A — Independent activation

Each:

\[
z_i=g(Raw_i)
\]

independently.

No total Experience budget.

---

### Model B — Shared encoding budget

Normalize:

\[
z_i=
\frac{Raw_i}
{\max(B,\sum_jRaw_j)}
\]

for chosen budget \(B\).

Concepts compete for finite encoding capacity.

---

### Model C — Hybrid

Important concepts may retain independent salience up to a threshold, after which low-salience concepts compete for remaining encoding capacity.

CharacterLab should not assume that the current association row budget alone is sufficient to model limited cognitive attention.

This is a direct experiment.

---

# 13. Semantic Footprint Experiments

Required controlled scenarios:

## Scenario A — Ordinary social interaction

```text
Mina has dinner with Glen at Home.
A lamp is present.
```

Expected qualitative hierarchy:

```text
Glen / Dinner       high
Home                lower
Lamp                negligible
```

---

## Scenario B — Social conflict

```text
Mina argues with Glen at Home.
Lamp remains incidental.
```

Test whether:

- Glen remains highly salient;
- conflict-related concepts increase;
- incidental objects remain weak.

---

## Scenario C — Object becomes causal

```text
The lamp falls and injures Mina.
```

The same Lamp concept must become strongly encoded because causal role changed.

---

## Scenario D — Location becomes causal

```text
A dangerous event occurs because of a hazardous Bakery environment.
```

The Location must be capable of becoming highly salient.

---

## Scenario E — Surprise

Compare:

```text
Glen behaves exactly as expected
```

with:

```text
Glen behaves in a highly unexpected way
```

Everything else held equal.

Test whether prediction error increases encoding strength deterministically.

---

## Scenario F — Attention gating

Place several objectively present but unattended entities in the environment.

Verify they receive zero or near-zero semantic encoding according to the perception/attention rules.

---

# 14. Success Criteria — Semantic Salience

The salience system should demonstrate:

1. causal role can override category prior;
2. incidental environmental entities do not consume major association budget;
3. prediction error increases encoding when appropriate;
4. Need-relevant concepts receive greater salience;
5. unseen/unregistered concepts cannot be learned merely from world truth;
6. emergent events require no scenario-specific salience authoring;
7. association strength is no longer primarily determined by arbitrary tag count;
8. the complete salience result can be reconstructed from the causal trace.

---

# 15. Saturated Satisfaction Problem

Current learning observes:

\[
r_n=
L_n(after)-L_n(before)
\]

This fails when:

\[
L_n(after)
\]

hits a bound.

Example:

\[
L_n(before)=0.9
\]

\[
e=+0.4
\]

but:

\[
L_n(after)=1
\]

Thus:

\[
r_n=+0.1
\]

even though the satisfier had greater potential effect.

The character's capacity to benefit has changed.

The satisfier's inherent efficacy has not necessarily changed.

Phase 2.5 must determine how learning should represent this distinction.

---

# 16. Effect Decomposition

For positive potential effect \(e\):

\[
Capacity^+=1-L_n(before)
\]

Applied Need effect:

\[
Applied=
\min(e,Capacity^+)
\]

Potential overflow:

\[
Overflow=
\max(0,e-Capacity^+)
\]

For negative effect:

\[
Capacity^-=L_n(before)
\]

\[
Applied=
\max(e,-Capacity^-)
\]

with corresponding negative-side overflow magnitude.

This decomposition is objective world math.

It does **not** by itself determine what the character learns.

---

# 17. Distinguish Three Quantities

Phase 2.5 should explicitly separate:

## Realized regulatory effect

> How much did the bounded Need state actually move?

\[
Applied
\]

---

## Evidence about satisfier efficacy

> What does the Experience allow the character to infer about how effective the satisfier is?

This may not equal `Applied`.

---

## Experienced reward

> Was there psychologically reinforcing experience beyond regulatory Need movement?

This is currently an open hypothesis.

It must not be introduced as a primitive merely because it sounds plausible.

---

# 18. Censored Evidence Hypothesis

A boundary-clipped observation is not necessarily an exact measurement.

If:

\[
e>Capacity^+
\]

the character observed only that the satisfier produced at least enough effect to reach the ceiling.

The learning evidence is therefore:

\[
e\ge Applied
\]

rather than:

\[
e=Applied
\]

Likewise at the lower bound.

This is analogous to a censored observation.

## Core principle

A saturated observation should not automatically pull an established expectation downward merely because the remaining Need capacity was small.

---

# 19. Candidate Learning Models

Phase 2.5 should compare at least three models.

## Model A — Naive observed delta

Existing behavior:

\[
Evidence=Applied
\]

This is the baseline and is expected to reproduce the existing ceiling/floor artifact.

---

## Model B — Censored evidence

When no bound is hit:

\[
Evidence=Applied
\]

When upper saturation occurs:

\[
TrueEffect\ge Applied
\]

When lower saturation occurs:

\[
TrueEffect\le Applied
\]

The expectation updater must implement a mathematically explicit rule for inequality evidence.

Possible approaches may include:

- truncated likelihood;
- interval observation;
- one-sided Bayesian update;
- no downward revision when the current mean already satisfies the observed lower bound.

The agent should research and select an exact deterministic formulation rather than approximating the inequality as a point estimate.

---

## Model C — Censored evidence plus overflow reward

Retain Model B for efficacy learning.

Separately define candidate experienced reward:

\[
Reward=
Applied+\kappa Overflow
\]

with:

\[
0\le\kappa\le1
\]

or another explicitly justified bounded function.

This model tests whether behavior improves when:

```text
regulatory satisfaction
```

and:

```text
experienced reinforcement
```

are allowed to differ.

`Reward` must not automatically modify Need state.

---

# 20. Efficacy vs. Utility

Phase 2.5 should explicitly test the distinction:

## Satisfier efficacy

> How much can this thing affect the Need when there is capacity to benefit?

versus:

## Realized utility

> How useful was it in the character's current state?

Example:

```text
Glen true efficacy      +0.40

Mina Connection .20
realized utility        +0.40

Mina Connection .90
realized utility        +0.10
```

The model should test whether the character can preserve a stable belief in Glen's efficacy while correctly recognizing that visiting him while already socially satisfied has low immediate utility.

This separation is potentially load-bearing for later:

- satiation;
- food;
- recreation;
- social interaction;
- pleasure;
- tolerance;
- craving;
- addiction.

---

# 21. Saturation Experiments

Use the same satisfier and same underlying effect across controlled initial Need states.

For example:

```text
True effect: +0.40
```

Test:

```text
Need before 0.10
Need before 0.40
Need before 0.70
Need before 0.90
Need before 1.00
```

Run repeated learning under each model.

Measure:

- learned efficacy mean;
- confidence;
- realized Need change;
- subsequent choice probability.

---

# 22. Required Counterfactual

Timeline A:

```text
Mina experiences Glen mostly while Connection is low.
```

Timeline B:

```text
Identical true Glen efficacy,
but Mina experiences Glen mostly while Connection is near saturation.
```

The learned model of **Glen's efficacy** should not diverge dramatically solely because Mina had less remaining capacity in Timeline B.

The immediate desirability of choosing Glen in the saturated state may differ strongly.

That distinction is the target.

---

# 23. Overflow Reward Research Question

Do not assume `Overflow` should become Reward.

Test it.

The experiment should ask:

> Is Need relief alone sufficient to reproduce the desired reinforcement behavior once censoring is modeled correctly?

If yes:

```text
ExperiencedReward
```

remains unnecessary.

If no, identify the exact phenomenon that requires it.

Candidate phenomena may eventually include:

- continued consumption after satiation;
- recreation despite already-low Recreation pressure;
- social pleasure beyond loneliness relief;
- compulsive use;
- hedonic reinforcement;
- addiction.

But none should be assumed in Phase 2.5 merely to justify adding Reward.

---

# 24. Interaction Between Salience and Saturation

The two Phase 2.5 problems should not be treated as completely independent.

A surprising or highly consequential saturated Experience may affect semantic salience.

Potential relationship:

```text
Experienced outcome
        ↓
prediction error
        ↓
semantic salience
        ↓
memory/association encoding
```

However:

- regulatory `Applied`;
- efficacy evidence;
- and optional Reward

must remain separately visible in the trace.

The system must not collapse all three into one "event importance" scalar.

---

# 25. Full Experience Encoding Candidate Pipeline

Phase 2.5 should aim to produce a formal pipeline resembling:

```text
WORLD EVENT
    ↓
PERCEPTUAL FILTER
    ↓
PERCEIVED ENTITIES / FACTS
    ↓
CAUSAL ROLE CLASSIFICATION
    ↓
NEED OUTCOME CALCULATION
    ↓
SATURATION / CENSORING ANALYSIS
    ↓
PREDICTION ERROR
    ↓
ATTENTION + SALIENCE DERIVATION
    ↓
SEMANTIC EXPERIENCE
        ├── concept activations
        ├── regulatory Need effects
        ├── efficacy evidence
        └── optional Reward evidence
    ↓
LEARNING
        ├── NeedExpectation
        ├── association graph
        └── episodic memory
```

Each arrow requires explicit inputs and transformation rules.

---

# 26. Trace Requirements

Every encoded Experience should explain itself.

Example:

```text
WORLD EVENT
Mina talks with Glen at Home.

PERCEPTION
Glen       perceived
Home       perceived
Lamp       perceived but unattended

ROLES
Glen       target / participant
Home       location
Lamp       incidental

NEED STATE
Connection before     0.90
Potential effect     +0.40
Applied effect       +0.10
Saturated             true

EFFICACY EVIDENCE
lower bound          >= +0.10

PREDICTION
expected Glen effect +0.35
prediction error     [defined according to censored model]

SALIENCE
Glen
  category prior      ...
  causal role         ...
  attention           ...
  Need relevance      ...
  surprise            ...
  final z             ...

Home
  ...

Lamp
  final z             0

LEARNING
Expectation update    ...
Association update    ...
Memory encoding       ...
```

Nothing in the semantic Experience may appear without a traceable derivation.

---

# 27. Phase 2.5 Mathematical Obligations

Before completion, prove/test:

### Salience bounds

\[
0\le z_i\le1
\]

for all encoded concepts.

### Perception exclusion

If:

\[
P_i=0
\]

then:

\[
z_i=0
\]

### Deterministic salience

Identical:

- world event;
- character state;
- model version;
- seed

must produce identical semantic Experience.

### Saturation decomposition

For positive effects:

\[
e=Applied+Overflow
\]

when \(e\ge0\).

Equivalent lower-bound identity for negative effects.

### Need bounds

Applied effect may never produce:

\[
L_n<0
\]

or:

\[
L_n>1
\]

### Censored-learning consistency

A bound-clipped observation must never be treated as an exact uncensored measurement under the selected censored model.

### Trace completeness

Every Experience-learning update must identify the exact evidence it consumed.

---

# 28. Phase 2.5 Deliverables

## Psychological findings

Determine:

- whether derived salience produces believable Experience encoding;
- whether category priors plus context are sufficient;
- whether causal role dominates incidental entity type appropriately;
- whether surprise meaningfully improves learning behavior;
- whether censored efficacy learning eliminates saturation artifacts;
- whether a separate Reward concept is needed.

---

## Computational findings

Measure:

- sensitivity to salience weighting;
- association-strength effects from semantic footprint;
- quantization effects;
- cost of salience derivation;
- mathematical behavior of censored updates;
- long-run belief stability near Need boundaries.

Population-scale cost is not a research constraint here.

---

## Architectural findings

Report which semantic primitives appear necessary.

Potential examples:

```text
PerceivedEvent
SemanticExperience
ConceptSalience
CausalRole
NeedEffect
CensoredEvidence
SatisfierEfficacy
ExperiencedReward
```

Do not assume all will survive.

---

## Production-simulation implications

For every confirmed finding, answer only:

> **What capability would a production character simulation need to preserve this behavior?**

Examples:

```text
Characters require separate learned efficacy and confidence.

Experiences require deterministically derived semantic salience.

World availability must remain distinct from learned utility.

Need-state saturation must not corrupt efficacy learning.
```

Do not yet answer:

```text
Which Vivarium class owns this?
```

or:

```text
How do we fit this into the current roadmap?
```

---

# 29. Phase Gate Before Phase 3

Phase 3 may begin when:

1. an emergent world event can be converted into a weighted semantic Experience without scenario-specific psychological authoring;
2. semantic footprint no longer depends primarily on arbitrary equal-weight tag count;
3. bounded Need saturation no longer causes a known satisfier's learned efficacy to collapse toward the clipped state delta;
4. the experiment determines whether efficacy and realized utility must be distinct;
5. the experiment determines whether `ExperiencedReward` is currently necessary or remains deferred;
6. all updates remain deterministic and fully traceable;
7. Phase 2.5 produces Psychological, Computational, Architectural, and production-capability findings.

---

# 30. Research Classification Targets

At the end of Phase 2.5 classify:

## Semantic Salience

```text
DERIVED
general context rules are sufficient

or

REQUIRES MECHANISM
an additional cognitive mechanism is necessary
```

## Saturated Efficacy Learning

```text
DERIVED
censored evidence solves the issue

or

REQUIRES MECHANISM
additional state is necessary
```

## Experienced Reward

```text
DERIVED / UNNECESSARY
Need-state + efficacy learning are sufficient

REQUIRES MECHANISM
a second reinforcement channel is demonstrably necessary

DEFERRED
cannot yet be distinguished behaviorally
```

---

# 31. Core Phase 2.5 Principle

The central research question is no longer merely:

> What happened in the world?

It is:

> **What did this character actually experience, and what information was available for them to learn from?**

The model must preserve the distinction:

```text
OBJECTIVE WORLD EFFECT
≠
REALIZED NEED CHANGE
≠
INFERRED SATISFIER EFFICACY
≠
SEMANTIC SALIENCE
≠
POSSIBLE EXPERIENCED REWARD
```

These quantities may correlate.

They must not be collapsed unless experiments demonstrate that the distinction is unnecessary.

The guiding rules remain:

> **No adjective without a mechanism.**

> **No mechanism without an equation.**

> **No equation without an invariant.**

> **No psychological claim without an experiment.**

And for CharacterLab's relationship to Vivarium:

> **CharacterLab discovers what the desirable simulation requires. Vivarium architecture is evaluated against those requirements afterward—not used to constrain the discovery process.**