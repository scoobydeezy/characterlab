# CharacterLab — Phase 2.9 Research Brief
## Decision Authorship, Acquired Identity, and the Role of Dice

**Status:** Proposed pre-Phase-3 research phase  
**Position:** After Phase 2.5 consolidation/re-baselining; before Phase 3 — Personality Belief & Social Appraisal  
**Primary purpose:** Determine whether unresolved Decisions and deterministic dice resolution can serve as the mechanism by which a character accumulates a biographical identity, acquires durable traits, and becomes increasingly self-consistent without ever becoming behaviorally deterministic.

---

# 1. Why This Phase Exists

CharacterLab has so far established mechanisms for:

```text
Needs
Experience
learned Need-satisfaction expectations
confidence
associative accessibility
episodic memory
world availability
causal provenance
character-relative perception
attention
semantic salience
censored evidence
```

These systems answer increasingly sophisticated questions about:

> What does this character want?

> What does this character expect?

> What occurs to this character?

> What did this character experience?

They do **not** yet answer:

> What happens when several legitimate pressures remain in conflict and the character could genuinely choose either way?

This matters because Vivarium's intended character model cannot reduce a person to a deterministic function of personality.

A person may have:

- Needs;
- beliefs;
- learned preferences;
- habits;
- values;
- personality tendencies;
- relationships;
- history;

and still sometimes reach a point where:

> **Either choice is psychologically plausible.**

That residual uncertainty is not a modeling failure.

It is part of the desired simulation.

The game uses dice to resolve it.

The new hypothesis is that this stochastic boundary can do more than select an Action:

> **A meaningful Decision roll can become biographical evidence about who this person is becoming.**

---

# 2. Core Hypothesis

Character identity should form through a recursive loop:

```text
Existing Character State
        ↓
Decision pressures
        ↓
unresolved conflict
        ↓
Decision Roll
        ↓
Chosen Intent
        ↓
Identity Expression
        ↓
Identity Evidence
        ↓
Trait / identity consolidation
        ↓
stronger identity-consistency pressure
        ↓
Future Decisions
```

Therefore:

> **Dice sit at the boundary between identity already established and identity still being authored.**

Early in a character's life, many meaningful choices may remain unresolved enough to require rolls.

As the character repeatedly makes certain kinds of choices, an identity forms.

Future choices consistent with that identity become easier to predict and may cease requiring rolls.

But strong competing identities, Needs, relationships, or circumstances can create new conflicts.

Thus the system should not converge toward:

```text
personality → inevitable Action
```

It should converge toward:

```text
established identity
→ more predictable routine choices

while

meaningful identity conflicts
→ remain stochastic and consequential
```

---

# 3. Research Boundary

This phase is **not** an implementation of Vivarium's current Decision system.

CharacterLab must not ask:

> How can the current Vivarium classes support this?

It must ask:

> **What mathematical and semantic capabilities are required for the most desirable version of this behavior?**

Only after the mechanism is validated should Vivarium be evaluated against those requirements.

The research sequence remains:

```text
CHARACTERLAB
discover desirable behavior
        ↓
identify load-bearing semantic state
        ↓
prove the mathematics
        ↓
run controlled experiments
        ↓
identify production obligations
        ↓
VIVARIUM
decide how to reproduce them economically
```

Current Vivarium architecture is not a research constraint.

---

# 4. Preserve the Existing Latent Personality Model

CharacterLab retains the seven-dimensional latent personality profile:

```text
Warmth
Agency
Stability
Sociability
Openness
Discipline
Attunement
```

This is the character's underlying dispositional substrate.

It must remain distinct from acquired biographical identity.

## 4.1 Three different meanings of "trait"

This phase must explicitly prevent terminology from collapsing three different concepts.

### Latent personality dimension

Example:

```text
Agency = +0.62
```

Underlying psychological disposition.

---

### Personality trait label

Example:

```text
Assertive
Reserved
Patient
Warm
```

A human-readable projection of latent personality.

It is **not additional causal state**.

---

### Acquired Identity Trait

Examples:

```text
Dependable
Rebellious
Caretaker
Scholar
Risk-Taker
Workaholic
Devout
Brave
Flirt
Stress Eater
```

This is different.

An acquired Identity Trait represents:

> **A durable pattern of choices this person has actually expressed across their biography.**

It is learned from Decision history.

It must not simply be inferred from latent personality.

A high-Agency character may be predisposed toward behavior that eventually earns `Brave`.

But:

```text
high Agency
≠
already Brave
```

The character must express the relevant behavior.

---

# 5. Do Not Mutate Latent Personality From Individual Rolls

A resolved Decision must not directly modify:

```text
Warmth
Agency
Stability
Sociability
Openness
Discipline
Attunement
```

Doing so would collapse:

```text
what I was disposed toward
```

and:

```text
what I have repeatedly chosen to become
```

into one state.

Phase 2.9 therefore treats acquired identity as a separate biographical layer.

Long-timescale personality drift may later be tested independently.

It is not part of this phase.

---

# 6. Decision Inputs

A Decision contains:

```text
Decision
├── DecisionId
├── Actor
├── Options[]
├── DecisionInfluences[]
├── Context
└── ResolutionState
```

Each Option receives deterministic pressures from existing CharacterLab systems.

Candidate sources include:

```text
Need urgency
NeedExpectation
learned confidence
associative accessibility
latent personality
current context
prior history
existing acquired identity
```

Phase 3 will later add:

```text
beliefs about people
social appraisal
relationship beliefs
```

The Decision layer should not care which subsystem produced an Influence.

It receives semantically identified, signed pressure.

---

# 7. DecisionInfluence

Each Influence should minimally contain:

```text
DecisionInfluence
├── InfluenceId
├── OptionId
├── ReasonChannel
├── Source
├── SignedStrength
└── Provenance
```

A positive Influence supports the Option.

A negative Influence opposes it.

Correlated reasons must be consolidated before becoming independent dice.

The principle remains:

> **One human-scale reason should not silently become several dice merely because several lower-level calculations contributed to it.**

The detailed Phase-3 social machinery may later create additional reasons without changing this contract.

---

# 8. Dice Are Authoritative Resolution, Not Decorative Presentation

The research hypothesis specifically requires dice to remain intrinsic to the Decision.

Therefore a Roll is not merely a visual representation of a categorical RNG sample.

For Decisions requiring stochastic resolution, each final DecisionInfluence maps through one deterministic shared calibration to a die.

Illustrative reference scale:

```text
weak           d4
moderate       d6
strong         d8
very strong    d10
extreme        d12
```

Exact thresholds are versioned CharacterLab experimental constants rather than assumed final game-balance values.

For Influence \(i\):

\[
Die_i = D(|Strength_i|)
\]

Its roll is addressed deterministically:

\[
r_i =
RNG(
Seed,
DecisionId,
InfluenceId,
Purpose = DecisionRoll
)
\]

Signed contribution:

\[
c_i =
sign(Strength_i)\cdot r_i
\]

Option result:

\[
RollScore(o)=
\sum_{i\in o}c_i
\]

The Option with the greatest RollScore wins.

Ties use a separately addressed deterministic tie-resolution draw.

Thus:

- dice are genuine causal resolution;
- every roll is replayable;
- every contributing reason can be preserved in history.

---

# 9. Exact Pre-Roll Choice Probability

Before rolling, CharacterLab should be able to calculate the exact probability that each Option wins.

Because the dice are discrete and CharacterLab contains only one research character, computational expense is acceptable.

For every Option:

1. construct the exact discrete distribution of its RollScore through convolution;
2. compare Option distributions;
3. derive exact:

\[
P(o)
\]

for every Option.

No simulation approximation is required.

For sorted probabilities:

\[
p_1\ge p_2\ge\ldots
\]

define Decision Margin:

\[
Margin=p_1-p_2
\]

and Contestedness:

\[
Contest=1-Margin
\]

Therefore:

```text
clear favorite
→ Margin high
→ Contest low

near tie
→ Margin low
→ Contest high
```

This gives CharacterLab a mathematically explicit measure of:

> **How unresolved is this Decision before the roll?**

---

# 10. Motivational Stakes

A trivial Decision can be highly uncertain.

Example:

```text
tea or coffee?
```

may be 50/50 while being psychologically unimportant.

A Decision between:

```text
keep promise to Glen
or
protect my exhausted self
```

may also be 50/50 but represent a major identity conflict.

Therefore Contestedness alone cannot determine gameplay significance.

Define motivational mass for Option \(o\):

\[
M_o=
\sum_i |ExpectedContribution_i|
\]

where expected die contribution is derived exactly from its die distribution.

For the two leading Options:

\[
ConflictMass=
\min(M_1,M_2)
\]

Bound:

\[
Stake=
g(ConflictMass)
\]

using CharacterLab's standard rational bounded response.

Thus:

> **A Decision has high stakes when substantial motivational pressure exists on both sides.**

This is character-relative significance.

It does not require an omniscient authored label saying:

```text
important decision = true
```

---

# 11. Authorship Potential

Define:

\[
AuthorshipPotential =
Contest \times Stake
\]

with:

\[
0\le AuthorshipPotential\le1
\]

This quantity answers:

> **How much capacity does this Decision have to tell us something new about who this character is?**

Examples:

### Obvious routine choice

```text
Contest low
Stake moderate

→ low authorship
```

### Meaningless coin flip

```text
Contest high
Stake tiny

→ low authorship
```

### Strong internal conflict

```text
Contest high
Stake high

→ high authorship
```

This should become the central bridge between:

```text
Decision mechanics
```

and:

```text
identity formation
```

---

# 12. Auto-Resolve vs Roll

Use explicit thresholds:

```text
θ_roll
θ_player
```

If:

\[
Contest < \theta_{roll}
\]

the Decision auto-resolves to the highest-probability Option.

No stochastic draw is required.

If:

\[
Contest \ge \theta_{roll}
\]

the Decision uses dice.

For a rolled Decision:

\[
AuthorshipPotential\ge\theta_{player}
\]

means:

```text
PlayerFacingRoll
```

Otherwise:

```text
QuietRoll
```

The exact thresholds are experimental constants.

The architecture is the research target.

---

# 13. Why Player-Facing Rolls Become Identity Moments

This arrangement naturally makes player-facing rolls disproportionately important.

A player-facing roll requires:

```text
meaningful unresolvedness
+
meaningful motivational stakes
```

Those are exactly the conditions under which a choice contains strong information about identity.

Therefore:

> **Player-facing Decision rolls do not need an arbitrary "trait XP bonus."**

They become identity-authoring moments because the same mathematics that makes them worth showing also makes them meaningful evidence.

---

# 14. Expression Is Not the Same as Outcome

Identity evidence attaches to:

```text
the character's chosen intent
```

not necessarily:

```text
the physical outcome that ultimately occurred
```

Example:

```text
Mina chooses to help Glen.
```

External circumstances cause her attempt to fail.

Identity evidence still records:

```text
Mina chose to help.
```

Likewise, if a future player physically interferes with implementation of the choice:

```text
Chosen intent: Go Home
Forced outcome: Returned To Work
```

identity evidence must describe the chosen intent.

It must never rewrite the character's biography as:

```text
Mina chose to work.
```

This preserves CharacterLab's distinction between will and world outcome.

---

# 15. Identity Expression

A selected Option may express one or more semantic identity tendencies.

Do **not** author:

```text
Option X gives +8 Brave.
```

Instead define reusable behavioral semantics.

Candidate Expression Channels may include:

```text
CommitmentFidelity
RiskAcceptance
Caregiving
AuthorityDefiance
WorkPersistence
NoveltySeeking
SocialApproach
SelfSacrifice
SelfProtection
RuleAdherence
```

This list is provisional.

The important property is:

> Expression semantics describe behavior, not adjectives.

Named traits are derived later.

---

# 16. Expression Must Be Contextual

The same Action does not always express the same identity.

Example:

```text
Stay Late At Work
```

may express very little if:

- nothing else matters;
- Mina is not tired;
- she has no competing commitment;
- she simply enjoys the task.

The same Action may strongly express Work Persistence if:

- Energy pressure strongly favors leaving;
- Glen is waiting for dinner;
- work pressure still wins.

Therefore an IdentityExpression evaluator must inspect the Decision context and the pressures actually opposed by the selected Option.

Identity meaning must not be baked into an Action name.

---

# 17. Expression Strength

For Identity Channel \(k\) and selected Option \(o\), derive:

\[
Alignment(o,k)\in[-1,1]
\]

using reusable deterministic semantic rules.

Then:

\[
ExpressionStrength_k=
Alignment(o,k)
\times
AuthorshipPotential
\]

This provides the first reference model.

Thus a behavior can strongly align with `CommitmentFidelity`, but if the Decision was trivial and predetermined:

\[
AuthorshipPotential\approx0
\]

then little new identity evidence is created.

This distinction is intentional:

> **Every choice may express existing identity. Only unresolved meaningful choices strongly author new identity.**

---

# 18. DecisionExpression Record

Every resolved Decision creates an immutable:

```text
DecisionExpression
├── DecisionId
├── ChosenOption
├── ResolutionMode
│   ├── Auto
│   ├── QuietRoll
│   └── PlayerFacingRoll
├── PreRollOptionProbabilities[]
├── Contest
├── Stake
├── AuthorshipPotential
├── InfluenceRolls[]
├── IdentityExpressions[]
├── ChosenIntent
└── OccurredAt
```

This record becomes biographical evidence.

It is distinct from the later physical Outcome.

---

# 19. Identity Evidence

For each Expression Channel \(k\):

\[
e_k=
ExpressionStrength_k
\]

with:

\[
-1\le e_k\le1
\]

Store cumulative positive and contradictory evidence:

```text
IdentityEvidenceState(k)
├── Support
└── Opposition
```

Update:

\[
Support'_k=
Support_k+\max(0,e_k)
\]

\[
Opposition'_k=
Opposition_k+\max(0,-e_k)
\]

No temporal decay is introduced in this phase.

If future experiments demonstrate that identity evidence must fade, that becomes a separate mechanism.

---

# 20. Derived Identity Strength

Define:

\[
IdentityStrength_k=
\frac{
Support_k-Opposition_k
}{
K_I+Support_k+Opposition_k
}
\]

where:

\[
K_I>0
\]

is a versioned half-saturation constant.

Therefore:

\[
-1<IdentityStrength_k<1
\]

for finite evidence.

Total evidence:

\[
E_k=
Support_k+Opposition_k
\]

Identity confidence:

\[
IdentityConfidence_k=
\frac{
E_k
}{
K_C+E_k
}
\]

This separates:

```text
Which direction has my biography leaned?
```

from:

```text
How much biography supports that conclusion?
```

---

# 21. Named Acquired Traits

Named traits are derived from Identity Evidence.

A simple trait may use one channel.

Example:

```text
Dependable
→ strong positive CommitmentFidelity
```

A more complex trait may combine channels.

Example candidate:

```text
Caretaker
→ Caregiving
+ SelfSacrifice
+ repeated Person-directed action
```

A named IdentityTrait uses the same general projection philosophy as latent personality labels:

\[
T_j=
g(
b_j+w_j^TI+I^TQ_jI
)
\]

where:

\[
I=
[
IdentityStrength_1,\ldots,IdentityStrength_n
]
\]

The trait may be considered consolidated when:

\[
T_j\ge\theta_{trait}
\]

and:

\[
Confidence_j\ge\theta_{confidence}
\]

Exact thresholds are experimental constants.

## Important

Named acquired traits are **not independent bonus stats**.

The authoritative state remains the accumulated identity evidence / derived identity strengths.

The label is semantic recognition of that pattern.

---

# 22. Identity Feedback Into Future Decisions

Acquired identity must matter.

Otherwise trait acquisition is cosmetic.

For a current Option \(o\), evaluate how its possible behavior aligns with existing identity:

\[
IdentityConsistency(o)=
\sum_k
IdentityStrength_k
\cdot
Alignment(o,k)
\]

Bound through:

\[
R_{identity}(o)=g(IdentityConsistency(o))
\]

This becomes exactly one Decision Reason Channel:

```text
IdentityConsistency
```

Examples of eventual player-facing reasons:

```text
"I keep my promises."

"I don't back down."

"I take care of people."

"Work comes first."
```

The Identity channel strengthens a reason.

It never dictates the Action.

---

# 23. Avoid Double-Counting Personality

Latent personality may have helped create the original choice.

Example:

```text
high Agency
→ risk-taking option initially more attractive
→ roll chooses risky option
→ RiskAcceptance evidence accumulates
→ Risk-Taker identity eventually forms
```

That causal chain is valid.

Do **not** additionally give Risk-Taker evidence merely because Agency was high.

Behavior is the mediator.

Thus:

```text
Latent personality
    ↓
Decision pressures
    ↓
actual choices
    ↓
acquired identity
```

not:

```text
Latent personality
    ↓
automatic matching trait acquisition
```

This preserves the difference between predisposition and biography.

---

# 24. Natural Stabilization Hypothesis

Identity feedback creates an apparent positive-feedback loop:

```text
choose X
→ become more X-like
→ more likely to choose X
→ become even more X-like
```

This could become pathological.

Phase 2.9 tests the hypothesis that `AuthorshipPotential` creates a natural brake.

As an identity becomes established:

```text
IdentityConsistency reason strengthens
        ↓
Option probability separates
        ↓
Decision Margin grows
        ↓
Contest falls
        ↓
fewer rolls
        ↓
AuthorshipPotential falls
        ↓
less new identity evidence
```

Thus mature identity should asymptotically stabilize rather than accelerate without bound.

This is a required experiment.

---

# 25. Mature Characters Should Still Make Decisions

The target is **not**:

```text
strong trait
→ deterministic behavior forever
```

A strong acquired identity contributes one pressure among many.

Example:

```text
Dependable Mina
```

may usually keep commitments automatically.

But a Decision can introduce:

```text
severe exhaustion
urgent family Need
fear
competing commitment
new Value
relationship pressure
```

sufficient to make the outcome uncertain again.

Then:

```text
Contest rises
→ roll returns
```

Identity therefore removes routine uncertainty without removing meaningful agency.

---

# 26. Identity Fault Lines

An especially important hypothesis from the gameplay discussion:

> As characters mature, rolls should migrate from "Who am I?" toward "Which part of who I am wins here?"

Example:

```text
Dependable
        versus
Caretaker
```

or:

```text
Workaholic
        versus
Devoted Partner
```

Each identity may strongly support a different Option.

Neither makes the outcome deterministic.

Instead:

```text
strong identity A
+
strong identity B
        ↓
meaningful conflict
        ↓
new player-facing roll
```

This should be one of Phase 2.9's primary success cases.

---

# 27. Contradiction and Character Change

Acquired identity must not become permanent merely because a threshold was once crossed.

A later high-authorship choice inconsistent with the trait adds Opposition evidence.

Example:

```text
Dependable
```

may weaken if the character repeatedly abandons meaningful commitments under genuine conflict.

Because evidence is cumulative:

- one anomalous choice should not erase a life pattern;
- repeated consequential contradictions can eventually change it.

This gives identity inertia without an arbitrary trait-lock rule.

---

# 28. Automatic Choices and Identity

Auto-resolved choices remain real behavior.

They may therefore produce a `DecisionExpression`.

However, because:

\[
Contest
\]

is low, their:

\[
AuthorshipPotential
\]

is naturally low.

They should normally contribute little new identity evidence.

This produces a useful distinction:

```text
Auto-resolved choice
→ expression of established identity

Meaningful roll
→ authoring of developing identity
```

No separate `AutoResolveEvidencePenalty` is required unless experiments demonstrate one.

---

# 29. Quiet Rolls and Player-Facing Rolls

Both use identical psychology.

The difference is presentation.

A Quiet Roll may still create meaningful Identity Evidence.

But because the `PlayerFacingRoll` threshold is driven by Authorship Potential, player-facing rolls should naturally cluster around:

- strong internal conflicts;
- consequential character-development moments;
- identity fault lines.

This is the intended gameplay loop.

---

# 30. Required Experiment Suite

## Experiment A — Residual uncertainty

Construct two Options with comparable motivational pressure.

Verify:

- neither personality nor existing state deterministically selects one;
- exact pre-roll probabilities are nontrivial;
- Decision uses dice.

---

## Experiment B — Obvious choice

Make one Option overwhelmingly stronger.

Verify:

- Margin rises;
- Contest falls;
- Decision auto-resolves;
- no unnecessary stochasticity is introduced.

---

## Experiment C — Trivial uncertainty

Create a 50/50 Decision with very low motivational mass.

Verify:

- Decision may require a Quiet Roll;
- it does not become a player-facing identity event;
- Identity Evidence remains small.

---

## Experiment D — Meaningful conflict

Create a near-balanced Decision with strong reasons on both sides.

Verify:

- Authorship Potential is high;
- Decision becomes player-facing;
- selected Option creates substantial Identity Evidence.

---

## Experiment E — Trait acquisition

Repeat several meaningful Decisions expressing the same identity channel.

Verify:

- evidence accumulates;
- identity strength rises;
- a named trait eventually consolidates;
- no explicit trait was authored onto the character.

---

## Experiment F — Seed divergence

Run two characters from:

```text
identical initial state
identical world history
different deterministic seed
```

through a sequence of genuinely ambiguous Decisions.

Expected result:

```text
different early rolls
→ different DecisionExpressions
→ different acquired identities
→ different later Decision probabilities
```

This is the flagship proof that:

> **Dice cumulatively author character identity.**

---

## Experiment G — Identity feedback

After a trait consolidates, present another matching Decision.

Verify:

- IdentityConsistency adds a real reason;
- compatible Option probability rises;
- trait does not directly select the Action.

---

## Experiment H — Self-stabilization

Continue repeated matching Decisions.

Verify:

```text
trait strengthens
→ Margin increases
→ Contest decreases
→ rolls become rarer
→ incremental evidence growth slows
```

The system must not exhibit runaway self-reinforcement.

---

## Experiment I — Identity fault line

Establish two strong identity tendencies.

Create a Decision in which they support opposing Options.

Verify:

- both generate substantial reasons;
- Contest rises again;
- a player-facing roll reappears.

---

## Experiment J — Contradiction

After establishing an Identity Trait, create several high-authorship Decisions expressing the opposite tendency.

Verify:

- one contradiction does not erase the trait;
- repeated meaningful contradictions reduce its strength;
- eventual identity change is possible.

---

## Experiment K — Intent versus physical outcome

Resolve:

```text
Mina chooses X.
```

Then force the world Outcome to fail or become Y.

Verify:

- identity evidence still describes chosen X;
- physical failure does not rewrite intent;
- the history preserves both facts.

---

# 31. Optional Experiment — Roll Contribution

One question should remain explicitly open unless experimentation earns it:

> Should Identity Evidence depend only on the chosen Option and pre-roll conflict, or also on which individual Influence dice happened to roll strongly?

Reference model:

```text
IdentityEvidence
=
chosen Expression
× AuthorshipPotential
```

This is the default.

A later experimental variant may test:

```text
chosen Expression
× AuthorshipPotential
× actual winning-roll contribution
```

Do not adopt the richer rule unless it produces behavior the simpler model cannot.

The fact that dice choose the Expression already makes roll outcomes causally identity-forming.

Reason-level reinforcement is not assumed necessary.

---

# 32. Relationship to SemanticExperience

Phase 2.9 should build on the consolidated Phase 2.5 Experience boundary.

After resolution:

```text
DecisionExpression
```

becomes part of the character's subsequent semantic Experience/history.

It may feed:

```text
episodic memory
association learning
identity evidence
later belief formation
```

But the following remain distinct:

```text
DecisionExpression
= what I chose

SemanticExperience
= what I experienced happening

WorldOutcome
= what physically happened
```

A single event may therefore preserve all three.

---

# 33. Relationship to Phase 3

Phase 3 should later be able to consume Phase 2.9 output.

Examples:

### Other-person belief

Glen observes Mina repeatedly keeping difficult promises.

That behavior becomes evidence from which Glen may infer properties about Mina.

---

### Self-belief

A later phase may ask whether Mina herself forms explicit beliefs such as:

```text
"I am dependable."
```

That is **not required in Phase 2.9**.

Phase 2.9 models acquired biographical disposition.

Phase 3+ may test whether explicit self-concept adds behavior beyond it.

---

# 34. Observer Knowledge

An acquired Identity Trait is character truth / derived biography.

It is not automatically known to:

- other characters;
- the player;
- the Observer.

Other agents must infer identity through evidence according to the same Knowledge principles as any other hidden state.

Do not leak trait state directly into observer belief.

---

# 35. Phase 2.9 Mathematical Obligations

Before completion, prove/test:

### Deterministic dice

Identical:

```text
state
DecisionId
InfluenceIds
seed
model version
```

produce identical rolls.

---

### Probability normalization

\[
\sum_oP(o)=1
\]

exactly.

---

### Contest bounds

\[
0\le Contest\le1
\]

---

### Stake bounds

\[
0\le Stake<1
\]

for finite ConflictMass under the standard bounded response.

---

### Authorship bounds

\[
0\le AuthorshipPotential\le1
\]

---

### Identity bounds

For finite evidence:

\[
-1<IdentityStrength_k<1
\]

and:

\[
0\le IdentityConfidence_k<1
\]

---

### Intent provenance

Every Identity Evidence entry must refer to:

```text
DecisionId
ChosenOptionId
DecisionExpression
```

rather than merely a later physical Outcome.

---

### No personality mutation

No legal Phase-2.9 transition directly mutates the seven-dimensional latent personality vector.

---

# 36. Trace Requirements

A meaningful Decision must be completely inspectable.

Example:

```text
DECISION
Keep dinner promise or stay at work?

OPTION: Keep Dinner

Reasons:
  Commitment pressure       d8
  Connection                d6
  Identity: Dependable      d6

OPTION: Stay At Work

Reasons:
  Work obligation           d8
  Achievement pressure      d8

PRE-ROLL
P(Keep Dinner)             0.48
P(Stay At Work)            0.52

Margin                     0.04
Contest                    0.96
Stake                      0.84
Authorship Potential       0.8064

Resolution:
PLAYER-FACING ROLL

ROLLS
...

Chosen Intent:
Keep Dinner

IDENTITY EXPRESSION
CommitmentFidelity         +0.72

IDENTITY UPDATE
Support before             ...
Evidence added             ...
Support after              ...

Derived Dependable:
before                     ...
after                      ...
```

Every value must be reproducible from earlier trace state.

---

# 37. What Is Not Yet Modeled

Do not introduce these merely to make experiments more interesting:

```text
explicit self-concept
shame
pride
identity threat
cognitive dissonance
reputation for acquired traits
social labeling
personality drift
cultural identity
role identity
trauma-driven personality change
```

These may become future CharacterLab questions.

Phase 2.9 establishes only the minimum causal loop:

```text
choice
→ biographical evidence
→ acquired identity
→ future choice pressure
```

---

# 38. Phase-End Research Questions

At completion, answer:

## Question 1

Can unresolved Decisions remain genuinely stochastic even when rich personality and learning state exist?

---

## Question 2

Can meaningful dice outcomes accumulate into durable Identity Traits without traits being authored directly?

---

## Question 3

Can trait feedback make routine behavior increasingly predictable without eliminating meaningful future agency?

---

## Question 4

Does Authorship Potential naturally concentrate strong identity evidence around the same Decisions that deserve player-facing rolls?

---

## Question 5

Do mature characters shift from:

```text
"Which arbitrary behavior happens?"
```

toward:

```text
"Which established part of this person wins this conflict?"
```

---

# 39. Classification Targets

## Residual Decision Uncertainty

```text
DERIVED
existing pressures + stochastic roll boundary are sufficient

or

REQUIRES MECHANISM
additional decision state is necessary
```

---

## Acquired Identity

```text
DERIVED
DecisionExpressions + accumulated evidence are sufficient

or

REQUIRES MECHANISM
additional identity state is necessary
```

---

## Named Traits

```text
DERIVED
semantic projections over accumulated identity are sufficient

or

REQUIRES MECHANISM
traits require independent primitive state
```

---

## Identity Stabilization

```text
DERIVED
declining Contest naturally limits reinforcement

or

REQUIRES MECHANISM
explicit anti-runaway regulation is necessary
```

---

# 40. Production-Simulation Obligations

At the end of the phase, do **not** ask:

> Which existing Vivarium class should this go into?

Instead report:

> **What must any production simulation preserve if this behavior proves desirable?**

Potential obligations may include:

```text
persistent autonomous Decisions
semantically identified Decision reasons
deterministic reason dice
exact distinction between auto-resolution and stochastic resolution
pre-roll unresolvedness
character-relative motivational stakes
frozen Decision-resolution history
chosen intent separate from physical outcome
reusable IdentityExpression semantics
cumulative acquired-identity evidence
named traits derived from evidence
identity-consistency as a future Decision pressure
observer knowledge separate from true identity
```

Only after CharacterLab establishes which are load-bearing should Vivarium architecture be compared against the list.

---

# 41. Prerequisite: Consolidated Pre-Phase-3 Architecture

Phase 2.9 should run only against the singular canonical CharacterLab architecture established after Phase 2.5.

Legacy modes remain experimental controls.

They are not alternative cognitive architectures for Phase 2.9.

All new Decision/identity experiments must use:

```text
canonical bounded Need semantics
objective EvidenceKind
causal provenance
character-relative perception
derived attention
semantic salience
NeedExpectation
episodic memory
associative accessibility
```

This prevents identity research from branching over superseded definitions of Experience.

---

# 42. Phase Gate Before Phase 3

Phase 3 may begin when:

1. one canonical Decision-resolution path exists;
2. Decision unresolvedness is mathematically explicit;
3. meaningful Decisions can deterministically classify as Auto / Quiet Roll / Player-Facing Roll;
4. dice resolution is reproducible and causally authoritative;
5. selected intent is stored separately from physical Outcome;
6. resolved Decisions create traceable Identity Expressions;
7. Identity Evidence can accumulate and contradict;
8. at least one named acquired trait emerges without direct trait authoring;
9. acquired identity feeds future Decision reasoning without dictating Actions;
10. repeated consistency reduces routine uncertainty rather than causing runaway reinforcement;
11. competing established identities can create new player-facing Decision conflicts;
12. identical initial characters can develop differently because early ambiguous rolls produce different biographies;
13. the full Phase 0–2.9 behavioral suite remains deterministic and replayable.

---

# 43. Core Phase 2.9 Principle

A character should not be reducible to:

```text
Personality
+
Needs
+
Beliefs
=
Action
```

Those systems establish the pressures.

They do not always establish the answer.

At the boundary where several futures remain psychologically plausible:

> **the die decides what this person actually does.**

That choice becomes part of their history.

History becomes identity.

Identity changes future pressures.

And over time:

> **the character becomes more like the person their accumulated choices say they are.**

The dice therefore stop being a resolution mechanic bolted onto the simulation.

They become one of the mechanisms by which the simulation creates a person.

The governing rules are:

> **Personality creates tendencies, not destiny.**

> **A roll resolves genuine residual uncertainty.**

> **A meaningful roll creates biographical evidence.**

> **Biography can consolidate into identity.**

> **Identity strengthens reasons, never removes agency.**

> **As identity matures, rolls migrate toward the fault lines between competing parts of the self.**