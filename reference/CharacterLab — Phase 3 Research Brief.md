# CharacterLab — Phase 3 Research Brief
## Predictive Belief, Threat Appraisal, Social Inference, and Constitutional Personality

**Status:** Retained hypothesis source; paused as an active roadmap  
**Position:** Superseded by the North-Star Reference Scaffold and reduction program  
**Structure:**

- **Phase 3A — Predictive Belief & Threat Appraisal**
- **Phase 3B — Social Belief & Appraisal**
- **Phase 3C — Constitutional Personality Modulation**

**Primary purpose:** Establish a deterministic model of uncertain belief, prediction, appraisal, and personality that can explain fear, trust, suspicion, social anxiety, individual differences, and related behavior without introducing bespoke state flags such as `AfraidOfDogs`, `TrustsGlen`, or `Brave`.

> **Roadmap authority note:** This brief was written under the earlier additive Phase 3 sequence. Its questions, candidate mechanisms, and proposed experiments remain useful, but its A→B→C ordering and fixed seven-dimensional personality delivery are not current architectural authority. See `CharacterLab — Ideal Character Architecture North Star.md` and `CHARACTER_ARCHITECTURE.md` §11. Phase 3 candidates should enter the intentionally overcomplete reference scaffold and then be retained, derived, merged, compressed, retracted, or left unresolved through controlled comparison.

---

# 1. Why Phase 3 Exists

CharacterLab currently models:

```text
Needs
NeedExpectation
associative accessibility
SemanticExperience
episodic memory
causal provenance
attention and salience
Decision resolution
Reason Nuclei
dice + modifiers
chosen intent
acquired identity
```

The system can answer:

> What does this character need?

> What has worked before?

> What is on their mind?

> What motives are active?

> What did they choose?

> What kind of person have their choices made them?

It still cannot adequately answer:

> **What does this character believe will happen?**

That missing capability blocks phenomena including:

```text
fear
trust
suspicion
anticipation
social anxiety
embarrassment
jealousy
perceived threat
false beliefs
generalization
risk assessment
reassurance seeking
avoidance
worry
```

Phase 3 introduces explicit uncertain predictive cognition.

---

# 2. Governing Hypothesis

The reference hypothesis is:

```text
PERCEPTION / EXPERIENCE
        ↓
evidence
        ↓
PREDICTIVE BELIEFS
"What tends to happen if...?"
        ↓
APPRAISAL
"What would that mean for me?"
        ↓
RawCognitiveSignals
        ↓
REASON NUCLEI
        ↓
Decision
        ↓
Action / Outcome
        ↓
new evidence
```

Fear is the opening torture test because it requires nearly every part of this loop to function correctly.

The core hypothesis for fear is:

> **Fear is not initially primitive state. Fear is a derived appraisal of an anticipated harmful outcome.**

---

# 3. Do Not Add Semantic Flags

Phase 3 must not solve its target corpus by introducing:

```text
AfraidOfDogs = true
TrustsGlen = 0.8
SociallyAnxious = true
Brave = true
Suspicious = true
```

These may eventually become semantic labels derived from underlying state.

They are not authoritative causal variables unless an experiment demonstrates that the underlying architecture cannot reproduce the behavior without them.

The standing rule remains:

> **Model causes. Let adjectives emerge.**

---

# 4. Determinism Is Non-Negotiable

Phase 3 must obey the same deterministic standard as all previous CharacterLab phases.

Given identical:

```text
ModelVersion
CharacterState
WorldState / perceived context
Event history
Decision
Seed
```

the simulation must produce byte-equivalent:

```text
belief state
appraisal state
RawCognitiveSignals
Reason Nuclei
dice expressions
rolls
chosen intent
learning updates
```

No unordered collection iteration may affect results.

No floating-point arithmetic may become authoritative state.

No wall-clock time may affect cognition.

No LLM, embedding service, vector similarity model, external classifier, or natural-language semantic judgment may participate in runtime cognition.

---

# 5. Numeric Requirements

Authoritative Phase-3 arithmetic must use CharacterLab's existing deterministic numeric discipline:

```text
exact arbitrary-precision rational oracle
and/or
quantized rational lattice Q_D
```

All constants must be versioned.

All bounded transforms must be explicit.

All comparisons must define exact threshold behavior.

Where:

```text
x = threshold
```

the branch taken must be specified.

No epsilon-based comparison may determine authoritative behavior.

---

# 6. RNG Requirements

Belief formation and appraisal are **deterministic inference processes**.

They do not receive arbitrary random draws.

Counter-addressed RNG remains appropriate only for mechanisms that are intentionally stochastic, principally Decision resolution.

Any new stochastic mechanism must:

1. have an explicit psychological justification;
2. use existing counter-addressed RNG;
3. define:
   - eventId
   - purposeId
   - drawIndex
4. remain replayable independently of unrelated draws.

Do not use RNG merely to simulate uncertainty that should instead exist as belief uncertainty.

---

# 7. World Truth, Perception, Belief, and Appraisal Must Remain Separate

Phase 3 introduces another critical boundary:

```text
WORLD TRUTH
"What actually is true?"
        ↓
PERCEIVED EVIDENCE
"What did the character observe?"
        ↓
BELIEF
"What does the character currently think is likely?"
        ↓
APPRAISAL
"What does that believed possibility mean for them?"
```

These layers must never collapse.

A character may rationally update toward a false belief given misleading evidence.

A character may retain a false belief because corrective evidence was never observed.

World truth may never silently correct cognition.

---

# 8. Phase 3 State Extension

Candidate state:

```text
S_t =
(
  P,
  N_t,
  W_t,
  E_t,
  B_t,
  M_t,
  I_t
)
```

where:

```text
P   latent constitutional personality
N   Needs
W   associative graph
E   NeedExpectations / learned efficacy
B   predictive beliefs
M   episodic memories
I   acquired identity evidence
```

Phase 3 is responsible for finally introducing and testing:

```text
B
P
```

Do not assume the proposed representations are sufficient merely because they appear in this brief.

Every representation must clear its behavioral experiments.

---

# 9. Phase 3A — Predictive Belief & Threat Appraisal

Phase 3A establishes the generic ability to represent:

> **Under condition C, outcome O may occur.**

Fear is the primary integration test.

---

# 10. Conditional Prediction

Introduce a typed:

```text
ConditionalPredictionKey
├── ConditionKey
├── OutcomeKey
└── AffectedReferent
```

It represents:

\[
P(O \mid C)
\]

Examples:

```text
Near(DogA)
→ PhysicalInjury(Self)

RevealVulnerability(To=Darius)
→ Rejection(Self)

Defy(AuthorityFigure)
→ Punishment(Self)

RemainAtWorkPastMidnight
→ Exhaustion(Self)
```

These are typed propositions.

They are not prose strings interpreted at runtime.

---

# 11. ConditionKey

A ConditionKey is a canonical conjunction of typed predicates.

Example:

```text
ConditionKey
[
  Near(Self, DogA),
  DogA.Present
]
```

Each predicate consists of:

```text
PredicateId
BoundConceptKeys[]
```

Canonical representation requires:

1. canonical PredicateId order;
2. canonical bound-concept order;
3. duplicate elimination;
4. stable serialization.

Semantically equivalent authored conditions must produce identical keys.

Natural-language equivalence is outside runtime cognition.

---

# 12. OutcomeKey

Predicted Outcomes must use a controlled typed vocabulary.

Initial examples may include:

```text
PhysicalInjury
Illness
Contamination
Rejection
NegativeSocialEvaluation
Abandonment
Betrayal
JobLoss
FinancialLoss
StatusLoss
Failure
Punishment
AutonomyLoss
```

Every OutcomeDefinition specifies deterministic relationships to relevant MotiveChannels / Needs.

Example:

```text
PhysicalInjury
→ Safety / bodily integrity

Rejection
→ Connection
→ possibly Recognition

JobLoss
→ Security
→ Achievement
```

Do not create `Fear` as an Outcome type.

Fear is appraisal of these outcomes.

---

# 13. Belief Representation

The initial reference belief representation should be the smallest deterministic state capable of clearing the tests.

For likelihood:

```text
BeliefLikelihood
├── μ_p
└── τ_p
```

where:

\[
0 \le \mu_p \le 1
\]

and:

\[
\tau_p \ge 0
\]

Confidence:

\[
C_p =
\frac{\tau_p}
{\tau_p + K_C}
\]

Interpretation:

```text
μ_p
= estimated probability

τ_p
= accumulated evidentiary precision
```

This is an experimental representation.

Do not claim it is a complete Bayesian posterior.

---

# 14. Outcome Severity Must Remain Separate From Likelihood

Fear depends on:

> How likely is the outcome?

and:

> How bad would the outcome be?

Those are not the same belief.

Therefore introduce candidate:

```text
OutcomeMagnitudeBelief
├── μ_s
└── τ_s
```

with:

\[
0 \le \mu_s \le 1
\]

representing expected experienced severity conditional on the outcome occurring.

A safe encounter may update:

```text
likelihood
```

without updating:

```text
conditional attack severity
```

because no attack occurred.

This separation is mandatory.

---

# 15. Evidence Must Be Explicitly Classified

Phase 3 must not infer from generic event absence.

Introduce a shared evidence classification analogous to Phase 2.5's `EvidenceKind`.

Candidate:

```text
PredictionEvidenceKind
├── OutcomeOccurred
├── SafeOpportunity
├── CensoredOpportunity
└── NoOpportunity
```

Meaning:

### OutcomeOccurred

The predicted event occurred and was observable.

### SafeOpportunity

The outcome had a genuine observable opportunity to occur, but did not.

### CensoredOpportunity

The condition began, but observation ended before a valid inference could be drawn.

### NoOpportunity

No meaningful test of the prediction occurred.

Only the first two normally update likelihood.

---

# 16. PredictionOpportunity

This is a major Phase-3 mechanism.

A character must not learn from:

> “Nothing happened.”

unless something actually had a chance to happen.

Introduce:

```text
PredictionOpportunity
├── PredictionKey
├── BeganAt
├── EndedAt
├── ConditionSatisfied
├── OutcomeObservable
├── ExposureMagnitude
├── CensorReason?
└── EvidenceKind
```

Opportunity rules are authored by Outcome/Condition definitions, not improvised per experiment.

Example:

```text
Prediction:
"If I remain near this dog, it may attack."

Mina remains nearby long enough.
Dog is observable.
No attack occurs.

→ SafeOpportunity
```

But:

```text
Mina sees dog.
Immediately leaves.

→ CensoredOpportunity
```

The feared belief must not receive full corrective evidence.

---

# 17. Non-Events Must Never Be Counted Per Tick

A prediction like:

```text
dog may attack
```

must not receive:

```text
one negative observation every simulation frame
```

while no attack occurs.

That would annihilate beliefs arbitrarily quickly.

Opportunities require explicit episodes/windows.

One completed opportunity produces one evidence event unless the OutcomeDefinition explicitly defines multiple independent opportunities.

---

# 18. Likelihood Update

Point Bernoulli-like evidence may reuse the project's precision-weighted update discipline.

Illustratively:

```text
OutcomeOccurred → r = 1
SafeOpportunity → r = 0
```

with evidence strength determined by:

```text
observability
opportunity quality
exposure magnitude
attention
salience
```

Censored/NoOpportunity evidence must not be silently treated as `r = 0`.

If censored evidence later requires bound semantics analogous to Phase 2.5, introduce that only when an experiment demonstrates the need.

---

# 19. Belief Evidence Provenance

Every belief update must preserve:

```text
EvidenceBasis
```

using the provenance machinery established in Phase 2.97.

If:

```text
memory
belief summary
social inference
```

all derive from the same observations, correlation-aware consolidation must prevent them from becoming artificial independent corroboration.

The aggregate-coverage rule from Phase 2.97 remains canonical.

---

# 20. Threat Appraisal

For each active adverse ConditionalPrediction, derive:

```text
ThreatAppraisal
├── PredictionKey
├── Probability
├── Severity
├── Vulnerability
├── Control
├── Immediacy
├── ThreatStrength
└── AffectedMotiveChannels[]
```

No field may be hand-filled merely to make a test pass.

Each must have an explicit derivation.

---

# 21. Probability

Use:

\[
p=\mu_p
\]

possibly confidence-adjusted only if an experiment proves confidence must alter behavioral weighting independently of the mean.

Do not automatically multiply probability by confidence.

A character can behave cautiously about a low-confidence but catastrophic possibility.

Confidence and probability are distinct.

---

# 22. Severity

Use the predicted outcome's learned/known:

\[
s=\mu_s
\]

combined with its deterministic mapping to the character's affected Needs/MotiveChannels.

Severity is character-relative where appropriate.

The same objective event may matter differently to characters because:

```text
Need state
current vulnerability
relationships
identity
```

differ.

---

# 23. Vulnerability

Initially derive vulnerability from existing character state wherever possible.

Examples:

```text
already-low Security
→ greater vulnerability to financial loss

extreme Connection deprivation
→ greater vulnerability to rejection

physical weakness
→ greater vulnerability to injury
```

Do not introduce a general `Vulnerability` primitive unless tests require it.

---

# 24. Perceived Control

Control is a belief about whether the character can mitigate the outcome.

Initial candidate:

\[
Control =
\max_{a\in AvailableMitigationActions}
ExpectedMitigation(a)
\]

using:

```text
world availability
learned efficacy
current knowledge
```

No unavailable action contributes.

Unknown escape routes do not contribute.

World truth about unperceived safety mechanisms does not contribute.

---

# 25. Reference Threat Formula

Use one explicit reference formulation before testing alternatives.

Candidate:

\[
ExpectedHarm = p \cdot s
\]

\[
ThreatStrength =
ExpectedHarm
\cdot
\frac{1+Vulnerability}{2}
\cdot
\frac{2-Control}{2}
\]

Therefore:

\[
0 \le ThreatStrength \le 1
\]

for normalized inputs.

Immediacy remains separate initially.

This is a hypothesis, not sacred architecture.

Ablate components and test whether each is behaviorally load-bearing.

---

# 26. Acute Fear

Candidate acute fear:

\[
AcuteFear =
ThreatStrength
\cdot Immediacy
\]

where:

```text
Immediacy = 1
```

for a currently-present threat and decreases for temporally remote possibilities according to a deterministic authored horizon function.

This derived value is initially **trace state**, not persistent primitive state.

The first question is:

> Is instantaneous appraisal sufficient?

Only introduce persistent `FearState` if experiments demonstrate causal carry-over that cannot be reproduced by beliefs, memory, stress state, or context.

---

# 27. Threat Generates Motives, Not Commands

ThreatAppraisal emits:

```text
RawCognitiveSignal
SourceRole = MotiveGenerating
```

onto the MotiveChannels threatened by the predicted outcome.

Examples:

```text
dog → predicted injury
→ Safety × Dog

Darius → predicted rejection
→ Connection × Darius
→ Recognition × Darius
```

Fear does not directly choose:

```text
Flee
Freeze
Fight
```

It identifies an outcome the character wants to avoid.

Available actions, personality, learned efficacy, identity, and other motives determine the response.

---

# 28. No Generic Fear Die

Do not compile:

```text
Fear d10
```

unless later evidence proves fear itself is an independent motive.

Instead:

```text
Safety / Dog          d10+...
Connection / Darius   d8+...
Recognition / Boss    d6+...
```

The feared consequence determines the Reason Nucleus.

---

# 29. Relief Is Not Belief Evidence

This distinction is mandatory.

Suppose:

```text
dog appears
→ Mina fears attack
→ Mina leaves
→ threat appraisal falls
```

Mina has experienced relief.

She has **not** learned:

```text
"The dog definitely was dangerous."
```

Nor has she necessarily learned:

```text
"The dog was safe."
```

The exposure was censored.

Therefore:

```text
Threat-belief learning
```

and:

```text
Avoidance reinforcement
```

must be structurally separate.

---

# 30. Relief Observation

Candidate:

\[
Relief =
\max(
0,
ThreatLoad_{before}
-
ThreatLoad_{after}
)
\]

where:

\[
ThreatLoad =
Rational.boundedResponse
\left(
\sum_i ThreatStrength_i
\right)
\]

The global load exists only for affective regulation.

Per-threat appraisals remain individually traceable.

Relief may reinforce an action's expected efficacy for reducing active threat.

Relief may not directly update the underlying threat probability.

---

# 31. Avoidance Reinforcement

Test the minimum mechanism capable of producing:

```text
fear
→ avoidance
→ relief
→ future avoidance more likely
```

Candidate learned state:

```text
ReliefExpectation
├── ActionKey
├── ThreatContextKey
├── μ
└── τ
```

This may reuse the existing deterministic expectation-learning mathematics.

It remains semantically separate from:

```text
NeedExpectation
ConditionalPrediction
```

Do not force relief into a fake Need merely to reuse existing code.

---

# 32. Extinction

Fear should be capable of weakening through corrective experience.

Required sequence:

```text
dog present
→ fear
→ character remains exposed
→ valid PredictionOpportunity
→ dog does not attack
→ SafeOpportunity evidence
→ threat probability decreases
→ future fear decreases
```

Critically:

```text
dog present
→ character escapes immediately
```

must not produce the same belief update.

This distinction is mandatory for Phase 3A closure.

---

# 33. Generalization

Phase 3A must test:

```text
DogA attacks Mina
→ later fear of unfamiliar DogB
```

Association alone is insufficient.

Association answers:

> What comes to mind?

Generalization answers:

> What evidence about one thing applies to another?

Introduce no generalization mechanism until the specific→novel-member test fails without one.

If required, candidate deterministic structure:

```text
ConceptRelation
├── ChildConcept
├── ParentConcept
├── RelationType = InstanceOf
└── GeneralizationWeight
```

All relationships and weights are typed/versioned authored data.

No embedding similarity.

No LLM classification.

---

# 34. Generalization Must Be Directional

Evidence about:

```text
DogA
```

may transfer partly to:

```text
Dogs
```

and then partly to:

```text
DogB
```

That does not imply equivalent reverse transfer.

The transfer function must specify exact direction and attenuation.

No uncontrolled spreading through the associative graph may become belief evidence.

Accessibility and epistemic generalization remain distinct.

---

# 35. Conditioned Cues

Test:

```text
Dog attack occurs in kennel
```

Later:

```text
kennel appears
dog absent
```

Does kennel exposure activate threat?

First test whether association + retrieved prediction is sufficient.

Only introduce explicit conditioned-threat state if existing association/accessibility cannot reproduce the behavior.

---

# 36. False Fear

World-danger state and believed-danger state must be dissociable.

Construct:

```text
Priya is harmless.
Mina receives misleading evidence that Priya is dangerous.
```

Expected:

```text
Mina forms threat belief.
Mina appraises danger.
Mina may avoid Priya.
```

World truth must not override the behavior.

Corrective evidence must be observed.

---

# 37. Phase 3A Fear Torture Tests

Required cases:

### A1 — Direct acquisition

Dog attacks Mina.

Later dog encounter produces increased predicted harm and Safety avoidance pressure.

### A2 — Persistence

Several confirming attacks produce a belief resistant to one safe exposure.

### A3 — Extinction

Repeated valid safe exposures reduce fear.

### A4 — Avoidance-maintained fear

Repeated immediate escape reinforces avoidance while preventing substantial corrective belief evidence.

### A5 — Relief separation

Avoidance relief increases avoidance efficacy without increasing belief that the dog is dangerous.

### A6 — False fear

Misleading evidence produces behaviorally real fear of a harmless referent.

### A7 — Generalization

DogA attack affects response to novel DogB if and only if the deterministic generalization mechanism warrants it.

### A8 — Cue conditioning

A salient associated context can later activate threat without direct current harm.

### A9 — Probability versus severity

Compare:

```text
high probability / low severity
low probability / high severity
```

and verify distinct appraisals.

### A10 — Control

Same threat belief with high perceived escape/control versus low control produces different appraisal.

### A11 — Vulnerability

Same objective prediction applied to different current regulatory states produces different threat significance where appropriate.

### A12 — Act despite fear

Strong threat exists, but competing motives win a contested Decision.

Fear must not dictate behavior.

### A13 — Bravery evidence

A high-authorship Decision in which the character acts despite a real threat can generate appropriate IdentityExpression evidence.

No fear → no bravery-like expression from that mechanism.

### A14 — Prediction opportunity

Immediate escape must not count as equivalent disconfirming evidence to sustained safe exposure.

---

# 38. Phase 3A Anxiety Probe

After object-directed fear works, test whether anxiety-like behavior emerges from:

```text
uncertain adverse predictions
+
low perceived control
+
sustained unresolved opportunities
```

without introducing an `Anxiety` primitive.

Target behaviors:

```text
worry-like repeated accessibility
checking
reassurance seeking
preparation
risk avoidance
```

Classify:

```text
DERIVED
```

or:

```text
REQUIRES MECHANISM
```

Do not expand into a full anxiety model unless behavior demands it.

---

# 39. Phase 3A Gate

Phase 3B begins only when:

1. conditional predictions are explicit typed state;
2. belief updates are deterministic;
3. world truth cannot leak into belief;
4. occurrence and non-occurrence evidence are distinguished;
5. PredictionOpportunity prevents per-tick/non-observable negative evidence;
6. severity and likelihood remain separate;
7. threat appraisal produces MotiveGenerating signals;
8. fear does not directly choose actions;
9. avoidance relief is separated from threat-belief evidence;
10. avoidance-maintained fear is demonstrated;
11. extinction through safe exposure is demonstrated;
12. false fear is possible;
13. specific→generalized fear is either derived or explicitly classified as requiring mechanism;
14. stochastic Decision authorship still functions under threat;
15. all outputs are exact, deterministic, and traceable.

---

# 40. Phase 3B — Social Belief & Appraisal

Phase 3B applies the generic prediction architecture to other people.

Central question:

> **Given observed behavior and social evidence, what does one character predict another person will do or think?**

---

# 41. No Privileged Access To Another Character's Mind

Character A may not directly read Character B's:

```text
Needs
beliefs
IdentityEvidence
private Decision reasons
latent personality
```

unless an explicit information channel exposes them.

Social inference consumes:

```text
ObservedSocialEvidence
```

derived from what the observer actually perceived.

---

# 42. ObservedSocialEvidence

Candidate:

```text
ObservedSocialEvidence
├── Observer
├── Actor
├── ObservedAction / Outcome
├── ObservedIntent?
├── RelevantContext
├── ConceptSalience
├── EvidenceBasis
└── OccurredAt
```

`ObservedIntent` exists only when intent is actually communicated or legitimately inferable according to an explicit rule.

Do not expose `DecisionExpression.chosenIntent` automatically to observers.

---

# 43. Social Predictive Beliefs

Initial social beliefs should remain predictive rather than adjective-based.

Examples:

```text
"If Glen promises something,
he is likely to follow through."

"If I ask Priya for help,
she is likely to help."

"If I disagree with Darius,
he may become hostile."

"If I reveal vulnerability,
Glen is unlikely to exploit it."
```

These fit the same:

```text
ConditionalPrediction
```

machinery as fear.

This reuse is an explicit Phase-3 hypothesis.

---

# 44. Trust Should Initially Be Derived

Do not store:

```text
Trust(Glen) = .82
```

as a primitive.

Test whether trust-like behavior emerges from a family of predictions such as:

```text
Glen keeps commitments.
Glen does not exploit vulnerability.
Glen helps when needed.
Glen reports information accurately.
```

A semantic `Trust` label may later derive from these.

If a single scalar proves behaviorally necessary, the experiments must demonstrate why.

---

# 45. Suspicion

Likewise, suspicion should initially emerge from:

```text
uncertain negative predictions
+
salient contradictory evidence
+
accessibility
+
possibly low confidence
```

rather than:

```text
Suspicion = .7
```

A character may simultaneously believe:

```text
Glen usually helps me
```

and:

```text
Glen may be hiding something
```

These must not collapse into one relationship number.

---

# 46. Social Evaluation Beliefs

Introduce predictions capable of representing:

```text
"If I do X,
Darius may think less of me."
```

Candidate outcome:

```text
NegativeSocialEvaluation(
  evaluator = Darius,
  target = Self
)
```

This may threaten:

```text
Recognition
Connection
Status
```

according to deterministic mappings.

This becomes the basis for social fear/anxiety.

---

# 47. Embarrassment Versus Social Anxiety

Use timing to test the distinction.

### Anticipatory

```text
"I might be negatively evaluated."
→ threat appraisal
→ social anxiety/fear
```

### Observed/current or retrospective

```text
"They saw what happened."
"I believe they evaluated me negatively."
→ embarrassment/shame-like appraisal
```

Do not assume a separate Embarrassment primitive.

Test whether timing + social-evaluation belief + motivational relevance are sufficient.

---

# 48. Beliefs About Dispositions

Phase 3B must test whether another character can infer durable behavioral tendencies from history.

Example target:

```text
"Glen tends to keep commitments."
```

Candidate representation:

```text
SocialDispositionBelief
├── Subject
├── IdentityChannel
├── μ
└── τ
```

However, do not introduce this simply because the true character possesses `IdentityEvidence`.

First test whether a family of conditional predictions is sufficient.

If a compact disposition belief is required, it must be learned from observed evidence, never copied from target truth.

---

# 49. Social Labels Must Not Become Ground Truth

A character may think:

```text
"Glen is dependable."
```

while Glen's true acquired identity does not support that conclusion.

Another character may believe the opposite.

Observer-relative belief state is independent.

This is required.

---

# 50. Social Evidence Correlation

One public action may generate:

```text
memory
commitment outcome evidence
relationship evidence
belief summary
```

These must retain common `EvidenceBasis`.

Phase 2.97's aggregate evidence-coverage consolidator must prevent one observed event from becoming several fake independent social observations.

---

# 51. Social Threat Reuses Phase 3A

Examples:

```text
Darius may reject me
→ Connection threat

Boss may punish dissent
→ Safety / Security / Autonomy threat

Partner may leave
→ Connection threat

Crowd may humiliate me
→ Recognition threat
```

No special social-fear subsystem should be created unless reuse fails.

---

# 52. Jealousy Probe

Test whether jealousy-like behavior can emerge from:

```text
attachment / Connection importance
+
prediction of abandonment/replacement
+
uncertainty
+
salient rival cues
```

without a `Jealousy` primitive.

This is a probe, not required full-feature scope.

---

# 53. Social Misbelief

Construct:

```text
Glen privately likes Mina.
Mina receives evidence suggesting Glen dislikes her.
```

Expected:

```text
Mina's social belief may become wrong.
Her Decisions should respond to her belief.
```

Later contradictory observation may correct it.

Truth must remain separate.

---

# 54. Phase 3B Experiments

### B1 — Observed reliability

Repeated observed commitment fulfillment increases prediction of future fulfillment.

### B2 — Unobserved reliability

Glen behaves dependably outside Mina's perception.

Mina's belief does not update.

### B3 — Misleading evidence

Observed evidence generates a false social belief.

### B4 — Correction

Later independent contradictory evidence can revise it.

### B5 — Correlated evidence

One public event represented in multiple downstream forms does not receive duplicate evidentiary weight.

### B6 — Trust-like behavior

Learned positive social predictions materially alter future Decisions without a primitive Trust scalar.

### B7 — Suspicion

Mixed evidence maintains uncertainty rather than forcing binary friend/enemy state.

### B8 — Social evaluation threat

Anticipated negative evaluation generates Recognition/Connection threat.

### B9 — Embarrassment timing

Observed negative evaluation after an event produces a distinct retrospective appraisal from anticipatory social fear.

### B10 — Private identity separation

Observer belief about Glen can differ from Glen's true `IdentityEvidence`.

### B11 — Same person, several beliefs

The system preserves several independent predictions about Glen rather than collapsing them into one relationship score.

### B12 — Several people, same prediction domain

Beliefs about Glen and Priya remain referent-specific.

---

# 55. Phase 3B Gate

Phase 3C begins when:

1. social beliefs use perceived evidence only;
2. private target state cannot leak;
3. social predictions reuse generic predictive-belief machinery where appropriate;
4. trust-like behavior is derived or explicitly classified as requiring mechanism;
5. suspicion can coexist with positive beliefs;
6. false social beliefs are behaviorally real;
7. belief correction is possible;
8. social evaluation produces threat/appraisal without bespoke fear flags;
9. observer beliefs can diverge from target truth;
10. evidence correlation remains controlled;
11. belief-derived signals compile through Reason Nuclei rather than private dice;
12. deterministic replay remains exact.

---

# 56. Phase 3C — Constitutional Personality Modulation

Phase 3C introduces the latent constitutional personality vector:

```text
P =
[
  Warmth,
  Agency,
  Stability,
  Sociability,
  Openness,
  Discipline,
  Attunement
]
```

This is persistent underlying disposition.

It is distinct from acquired identity.

---

# 57. Personality Is Not Acquired Identity

Maintain:

```text
LATENT PERSONALITY
what I am dispositionally like
```

versus:

```text
ACQUIRED IDENTITY
what my accumulated choices say
I have become
```

Individual Decision outcomes must not directly mutate `P` in Phase 3.

Long-timescale personality development is deferred.

---

# 58. No Personality Dice

Phase 3C must not produce:

```text
Warmth d6
Agency d8
Stability d4
```

Personality is not automatically an independent motive.

Instead personality modifies:

```text
appraisal
interpretation
control perception
standing disposition
reason strength
```

and then emits compatible:

```text
RawCognitiveSignal
SourceRole = StandingDisposition
```

into Phase 2.97's Reason Nuclei where warranted.

---

# 59. Candidate Constitutional Projections

The fear discussion suggests possible intermediate constitutional properties:

```text
Threat Sensitivity
Stress Reactivity
Stress Recovery
Uncertainty Tolerance
Social Evaluation Sensitivity
Attachment Intensity
```

These are **candidate derived projections**, not automatically new primitives.

Phase 3C must ask:

> Are these behaviors sufficiently explained by deterministic functions of the seven-dimensional P vector plus existing state?

Only promote one to independent primitive state if that representation fails.

---

# 60. Deterministic Projection

A constitutional projection must use an explicit function:

\[
C_j =
g(
b_j
+
w_j^T P
+
P^T Q_j P
)
\]

or a simpler affine form where sufficient.

All coefficients:

```text
b
w
Q
```

are versioned rational constants.

No prose rules such as:

> “high Stability probably means less fear”

may exist in authoritative cognition.

The mathematics must encode the hypothesis.

---

# 61. Threat Sensitivity Experiment

Do not assume a distinct Threat Sensitivity primitive.

Compare models:

### Model A

Threat sensitivity derived primarily from Stability.

### Model B

Derived from Stability + Agency + other relevant dimensions.

### Model C

Independent ThreatSensitivity primitive.

Use controlled fear experiments to determine whether Model C produces necessary behavior that A/B cannot.

Smallest successful representation wins.

---

# 62. Uncertainty Tolerance Experiment

Likewise test whether uncertainty-related behavior can be derived from:

```text
Openness
Stability
Agency
```

or requires an independent constitutional parameter.

Target behaviors:

```text
checking
worry
hesitation
information seeking
avoidance under ambiguity
```

Do not promote `UncertaintyTolerance` simply because it is psychologically intuitive.

---

# 63. Social Evaluation Sensitivity

Test whether social-evaluation response can derive from combinations of:

```text
Attunement
Sociability
Stability
```

versus requiring an independent parameter.

Same observed social prediction must produce different appraisal only according to explicit constitutional math.

---

# 64. Personality and Belief Learning

Phase 3C must test whether Personality affects:

```text
appraisal only
```

or also:

```text
evidence interpretation / belief updating
```

Do not assume both.

Potential variants:

### Appraisal-only

Two characters form the same probability belief but care/react differently.

### Learning-bias

Two characters interpret ambiguous evidence differently.

Any biased-learning model must preserve:

```text
determinism
evidence provenance
world-truth separation
```

and must not fabricate evidence.

---

# 65. Personality Cannot Manufacture Evidence

A threat-sensitive character may:

```text
weight ambiguous evidence differently
```

if the model explicitly supports interpretation weighting.

They may not receive:

```text
imaginary attack observations
```

merely because they are threat-sensitive.

Personality may transform inference.

It may not create external evidence.

---

# 66. Personality as Standing Modifier

Where Personality genuinely affects an existing Reason Nucleus, compile it through Phase 2.97.

Example:

```text
Approach unfamiliar group

Base:
Connection motive                 d8

Standing:
constitutional social approach    +1
acquired SocialApproach identity  +2

Situational:
recent rejection                  -1
```

All standing contributions sharing the same semantic motive consolidate according to deterministic standing-modifier rules.

---

# 67. Personality and Identity Must Not Be Double-Counted As The Same Thing

A character may have:

```text
high latent Discipline
```

which helped them repeatedly keep commitments.

Those choices then generated:

```text
CommitmentFidelity identity
```

Later both may legitimately affect a commitment Decision:

```text
constitutional disposition
+
biographical identity
```

But identity evidence must never be generated directly from the personality value.

The causal chain remains:

```text
P
↓
Decision tendencies
↓
actual chosen behavior
↓
IdentityEvidence
```

No shortcut:

```text
high Discipline
→ automatic Dependable identity
```

---

# 68. Personality Must Not Eliminate Agency

Strong constitutional tendencies increase predictability.

They do not become deterministic commands.

Competing:

```text
Needs
Commitments
beliefs
threats
identity
context
```

may still make Decisions contested.

Dice remain authoritative wherever residual uncertainty remains.

---

# 69. Same Evidence, Different People

The flagship Phase-3C experiment:

Create two characters with:

```text
identical world history
identical observed evidence
identical memories
identical learned likelihood beliefs
```

but different `P`.

Expose both to the same threat/social Decision.

Required:

- belief state remains identical where only appraisal differs;
- appraisal may differ deterministically;
- Reason modifiers may differ;
- Decision probabilities differ;
- exact differences are traceable to P.

This proves constitution matters without contaminating epistemology.

---

# 70. Same Personality, Different Biography

Inverse experiment:

```text
identical P
different stochastic Decision histories
```

Expected:

```text
different acquired identities
different memories/beliefs
different later behavior
```

This preserves Phase 2.9's central finding that personality is not destiny.

---

# 71. Constitution × Identity Fault Line

Construct:

```text
latent disposition favors caution
acquired identity favors bravery/duty
```

or the inverse.

Create a Decision where they support conflicting outcomes.

Both must remain separately traceable contributors.

One must not erase the other merely because both are “traits.”

---

# 72. Personality and Fear Extinction

Test two characters with identical threat belief but different constitution.

Then provide identical safe exposures.

Ask separately:

1. Do they update the factual threat belief differently?
2. Do they appraise the same residual belief differently?

If only appraisal difference is needed, do not introduce learning-rate personality effects.

This experiment is specifically designed to prevent unnecessary mechanisms.

---

# 73. Phase 3C Experiments

### C1 — Deterministic latent P

Identical P produces identical derived constitutional projections.

### C2 — Same belief, different appraisal

Different P changes appraisal without changing belief where appropriate.

### C3 — Threat sensitivity candidate

Determine whether distinct primitive ThreatSensitivity is required.

### C4 — Uncertainty tolerance candidate

Determine whether distinct primitive UncertaintyTolerance is required.

### C5 — Social evaluation sensitivity

Test constitutional variation in social threat.

### C6 — Personality as standing modifier

Personality enters an existing Reason Nucleus rather than spawning private dice.

### C7 — No identity shortcut

High P dimension alone does not create acquired IdentityEvidence.

### C8 — Constitution/identity coexistence

Both can affect the same Decision without collapsing into one state.

### C9 — Personality is not destiny

Strong P can be overcome by sufficiently strong competing motives.

### C10 — Same personality, different seeds

Phase-2.9 stochastic divergence remains.

### C11 — Same evidence, different people

Appraisal diverges deterministically from P.

### C12 — Learning-bias ablation

If personality-dependent learning is proposed, prove that it explains behavior appraisal-only cannot.

---

# 74. Phase 3C Gate

Phase 3 is complete only when:

1. the seven-dimensional latent personality vector exists as deterministic state;
2. latent personality remains separate from acquired identity;
3. constitutional projections are explicit mathematical functions;
4. candidate extra primitives such as ThreatSensitivity are tested rather than assumed;
5. personality never becomes a generic private die;
6. personality can alter appraisals/reasons through the Reason Compiler;
7. personality cannot fabricate evidence;
8. personality does not directly create acquired traits;
9. personality and biography can independently influence later Decisions;
10. stochastic identity divergence survives;
11. same evidence + different constitution can produce controlled behavioral differences;
12. no Phase-3 result requires runtime LLM interpretation.

---

# 75. Cross-Phase Deterministic Evidence Pipeline

The final intended Phase-3 pipeline is:

```text
WORLD EVENT
        ↓
EffectProvenance
        ↓
PERCEPTION
character-relative attention/salience
        ↓
SemanticExperience
        ↓
PredictionOpportunity classification
        ↓
EvidenceBasis
        ↓
BELIEF UPDATE
likelihood / severity
        ↓
CURRENT CONTEXT
        +
CONSTITUTION P
        +
Needs / Identity / Commitments
        ↓
APPRAISAL
        ↓
RawCognitiveSignals
        ↓
Motive × Referent
REASON NUCLEI
        ↓
Base Die
+ Standing Modifier
+ Situational Modifier
        ↓
exact Option PMFs
        ↓
Auto / Quiet Roll / Player-Facing Roll
        ↓
chosen intent
        ↓
outcome
        ↓
memory / belief evidence / relief
        ↓
future cognition
```

Every arrow must correspond to explicit code and traceable state.

---

# 76. Canonical Ordering Requirements

Define total ordering for every new key.

At minimum:

```text
ConditionKey
OutcomeKey
ConditionalPredictionKey
PredictionOpportunityId
BeliefKey
ThreatAppraisalKey
SocialEvidenceId
ConstitutionalProjectionId
```

must serialize canonically.

If multiple evidence events occur at one simulation timestamp, update order must be canonical.

No `Map`, `Set`, dictionary, hash, database-return order, or UI order may affect belief state.

---

# 77. Same-Time Evidence

Where update mathematics is order-sensitive, same-time evidence must either:

1. be aggregated into sufficient statistics and applied once; or
2. use explicitly defined canonical ordering.

The research log must state which.

Do not allow incidental processing order to become psychology.

---

# 78. Decay

Do not add belief decay merely because memory has decay.

Belief confidence should change only through:

```text
explicit evidence
```

or an experimentally justified precision-decay rule.

If belief precision decay is introduced:

- it must be deterministic;
- its clock semantics must be explicit;
- belief mean and confidence effects must be separately traced.

---

# 79. Memory Versus Belief

Memory:

> What happened?

Belief:

> What do I think tends to happen?

They remain separate.

A belief may survive after individual episodic memories become fuzzy.

A retrieved memory may update/reinforce a belief only according to explicit evidence rules.

Repeated retrieval of the same episode must not become repeated independent world evidence.

`EvidenceBasis` prevents this.

---

# 80. Association Versus Belief

Association:

> What comes to mind?

Belief:

> What do I think is likely?

A traumatic dog memory may become highly accessible without necessarily implying a calibrated high attack probability.

Likewise a strongly-held belief may not currently be accessible until triggered.

Do not merge these states.

---

# 81. NeedExpectation Versus Predictive Belief

NeedExpectation answers:

> How well does X satisfy Need N?

ConditionalPrediction answers:

> How likely is outcome O under condition C?

Example:

```text
Glen satisfies Connection
```

is NeedExpectation.

```text
Glen will reject me if I criticize him
```

is ConditionalPrediction.

Both may affect the same Decision through different causal routes.

Do not replace one with the other.

---

# 82. Belief Versus Identity

Belief:

> What do I think?

Identity:

> What pattern have my own meaningful choices established?

Self-beliefs such as:

```text
"I am brave."
```

are deferred unless required.

A character may possess strong bravery-like IdentityEvidence without explicit self-concept.

Likewise they may mistakenly believe something about themselves later.

Do not conflate the two.

---

# 83. Appraisal Versus Motive

Appraisal computes:

> What does this believed possibility mean for me?

Reason Nuclei compute:

> What independent motive does that generate inside this Decision?

A single appraisal may generate several motive signals.

Example:

```text
"I may lose my job."
```

could threaten:

```text
Security
Achievement
Status
```

Those remain independent nuclei if they satisfy Phase-2.97's semantic separation rules.

---

# 84. Fear Does Not Automatically Become Identity Evidence

Feeling fear is not itself a choice.

IdentityEvidence comes from meaningful Decisions.

Example:

```text
fear exists
→ character acts anyway
→ high-authorship DecisionExpression
→ RiskAcceptance / ProtectiveAction evidence
```

The fear state makes the behavior meaningful.

It does not itself grant `Brave`.

---

# 85. Semantic Labels to Test, Not Implement

Phase 3 should eventually allow the research corpus to recognize patterns such as:

```text
fear of dogs
phobic avoidance
brave
timid
risk-averse
trusting
suspicious
socially anxious
reclusive
people-pleasing
jealous
hypervigilant
```

The test question is:

> Can these be recognized from underlying causal state and behavior?

Do not implement each as bespoke mechanics.

---

# 86. Phase 3 Regression Requirements

After each subphase, rerun relevant earlier tests.

At minimum Phase 3 completion must preserve:

```text
Need-satisfaction learning
association/habit
episodic memory
semantic salience
censored evidence
Reason Nucleus formation
correlation-aware evidence consolidation
identity acquisition
identity stabilization
identity contradiction
identity fault lines
commitment motive lifecycle semantics
seed divergence
intent/outcome separation
```

New belief/personality machinery must not silently alter previously verified behavior unless explicitly documented as a refinement.

Classify changes:

```text
SURVIVES
REFINED
RETRACTED
```

---

# 87. Trace Requirements

A threat-driven Decision should be inspectable like:

```text
BELIEF

Prediction:
Near(Self, DogA)
→ PhysicalInjury(Self)

Likelihood:
μ = ...
τ = ...
confidence = ...

Severity:
μ = ...
τ = ...

Evidence:
experience_117   confirming
experience_182   safe opportunity
experience_203   censored

APPRAISAL

Probability      ...
Severity         ...
Vulnerability    ...
Control          ...
Immediacy        ...
ThreatStrength   ...

GENERATED SIGNAL

Motive           Safety
Referent         DogA
Role             MotiveGenerating
Strength         ...

REASON

Safety / DogA

Base motive      ...
Base die         d8

Standing:
constitution     +1
identity          0

Situational:
recent attack    +1

Final            d8+2

DECISION
...
```

Every value must be reproducible.

---

# 88. Fear-Learning Trace Requirement

An avoidance sequence must visibly demonstrate the separation:

```text
THREAT BELIEF BEFORE
p(attack) = ...

ACUTE THREAT
...

ACTION
Leave area

RELIEF
before threat load = ...
after threat load  = ...
relief              = ...

PREDICTION OPPORTUNITY
CensoredOpportunity

THREAT-BELIEF UPDATE
none / appropriately limited

RELIEF EXPECTATION UPDATE
updated

RESULT
avoidance becomes more attractive
without attack belief being falsely confirmed
```

This trace is mandatory for the avoidance-maintained-fear experiment.

---

# 89. Social-Belief Trace Requirement

Example:

```text
OBSERVER
Mina

TARGET
Glen

OBSERVED EVIDENCE
Glen fulfilled commitment X.
Mina observed fulfillment.

PREDICTION
When Glen makes commitments,
he fulfills them.

BEFORE
μ = ...
τ = ...

AFTER
μ = ...
τ = ...

PRIVATE TARGET TRUTH
not consulted
```

This must be demonstrable from logs.

---

# 90. Personality Trace Requirement

Example:

```text
LATENT P

Warmth       ...
Agency       ...
Stability    ...
Sociability  ...
Openness     ...
Discipline   ...
Attunement   ...

DERIVED CONSTITUTION

ThreatSensitivityCandidate = f(P) = ...
ControlBias                 = f(P) = ...
SocialEvaluationResponse    = f(P) = ...

APPRAISAL EFFECT
...

STANDING SIGNAL
...

REASON MODIFIER
+1
```

No hidden personality magic.

---

# 91. Classification Targets

At Phase-3 completion explicitly classify:

### Predictive Belief

```text
SUFFICIENT
or
REQUIRES RICHER REPRESENTATION
```

### Fear

```text
DERIVED
or
REQUIRES AFFECTIVE STATE
```

### Avoidance Reinforcement

```text
DERIVED FROM RELIEF
or
REQUIRES ADDITIONAL MECHANISM
```

### Fear Extinction

```text
DERIVED
or
REQUIRES ADDITIONAL MECHANISM
```

### Threat Generalization

```text
DERIVED
or
REQUIRES GENERALIZATION MECHANISM
```

### Anxiety-Like Behavior

```text
DERIVED
REQUIRES MECHANISM
or
DEFERRED
```

### Trust

```text
DERIVED
or
REQUIRES COMPACT SOCIAL STATE
```

### Social Evaluation / Embarrassment

```text
DERIVED
or
REQUIRES MECHANISM
```

### Threat Sensitivity

```text
DERIVED FROM P
or
REQUIRES PRIMITIVE
```

### Uncertainty Tolerance

```text
DERIVED FROM P
or
REQUIRES PRIMITIVE
```

---

# 92. What Phase 3 Does Not Build

Unless a required experiment proves necessity, do not introduce:

```text
FearOfX state
Anxiety stat
Trust stat
Jealousy stat
Embarrassment stat
Phobia flag
Brave flag
Timid flag
Reputation score
self-concept
personality drift
psychiatric diagnoses
culture
ideology
group identity
```

These remain future semantic phenomena or research questions.

---

# 93. Production-Simulation Obligations

At completion, report only the semantic capabilities a production simulation must preserve.

Potential obligations include:

```text
typed conditional propositions
explicit prediction opportunities
observable non-event evidence
belief likelihood and confidence
severity estimates
belief-evidence provenance
threat appraisal
relief separated from belief evidence
generalization semantics if required
observer-relative social beliefs
private-state isolation
latent constitutional personality
personality-derived standing signals
Reason-Nucleus interoperability
```

Do not prematurely design Vivarium's storage strategy.

---

# 94. Phase 3 Core Research Questions

At completion answer:

### Question 1

Can CharacterLab learn:

> “This thing may hurt me”

without an `AfraidOfThing` primitive?

### Question 2

Can fear persist under avoidance because relief reinforces escape while corrective evidence remains censored?

### Question 3

Can safe exposure extinguish fear using only genuinely observed non-event evidence?

### Question 4

Can evidence about one entity generalize to another without conflating accessibility with belief?

### Question 5

Can false beliefs produce real behavior while remaining corrigible?

### Question 6

Can the same predictive-belief machinery support both physical threat and social inference?

### Question 7

Can trust, suspicion, and social-evaluation threat emerge without single relationship-state scalars?

### Question 8

Can latent personality deterministically modulate appraisal without becoming destiny?

### Question 9

Are candidate primitives such as ThreatSensitivity and UncertaintyTolerance actually necessary?

### Question 10

Can personality and stochastic biography independently shape the same mature character?

---

# 95. Final Phase Gate

Phase 3 is resolved only when all of the following are true:

1. predictive beliefs are explicit deterministic state;
2. conditional evidence is based only on perceived opportunities;
3. non-events cannot become evidence without a valid opportunity;
4. belief likelihood and consequence severity remain distinct;
5. fear-like behavior is derived from predictive threat appraisal or explicitly shown to require additional state;
6. avoidance relief cannot falsely confirm threat belief;
7. avoidance-maintained fear is demonstrated;
8. extinction is demonstrated;
9. false belief is demonstrated;
10. generalization is either demonstrated or precisely classified as missing;
11. social beliefs remain observer-relative;
12. no agent reads another agent's private cognitive truth;
13. social threat reuses generic appraisal architecture;
14. trust-like and suspicion-like behavior are tested without primitive scalars;
15. the seven-dimensional latent personality vector is operational;
16. personality effects use explicit deterministic mathematics;
17. personality is separate from acquired identity;
18. personality cannot create evidence or acquired identity directly;
19. personality integrates through Reason Nuclei rather than bespoke dice;
20. all Phase-2.97 Reason Nucleus invariants survive;
21. seed-driven biographical divergence survives;
22. all authoritative arithmetic is exact/quantized deterministic;
23. all key ordering is canonical;
24. all stochastic draws are counter-addressed;
25. no runtime LLM or semantic similarity service is required;
26. every behavioral conclusion is supported by real pipeline output, not hand-derived expectation alone.

---

# 96. Core Principle

Phase 3 should not teach CharacterLab a list of emotions and personality adjectives.

It should teach the character to form uncertain expectations about the world and other people, determine what those expected outcomes mean for them, and allow constitutional disposition and biography to shape what they do next.

The desired chain is:

```text
Experience
→ evidence
→ belief
→ prediction
→ appraisal
→ motive
→ Decision
→ dice
→ choice
→ consequence
→ learning
→ biography
```

For fear specifically:

```text
"I think this may hurt me."
        ↓
"That outcome matters to me."
        ↓
"I want to avoid it."
```

What happens next is not determined by fear.

The character may:

```text
flee
fight
freeze
comply
hide
prepare
seek reassurance
investigate
protect someone
or act despite fear
```

because fear is one motive inside a whole person.

The governing Phase-3 rules are therefore:

> **Beliefs represent uncertainty; RNG does not.**

> **Characters learn from perceived evidence, never hidden truth.**

> **A non-event is evidence only when a real prediction opportunity existed.**

> **Relief can reinforce avoidance without proving the feared outcome was real.**

> **Fear describes anticipated harm; it does not choose behavior.**

> **Social beliefs belong to the observer, not to the person being observed.**

> **Personality creates durable biases in appraisal and action, not predetermined outcomes.**

> **Biography remains separate from constitution.**

> **Every psychological mechanism must compile deterministically into the same Reason Nucleus and dice architecture already earned by CharacterLab.**
