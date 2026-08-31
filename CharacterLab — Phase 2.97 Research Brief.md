# CharacterLab — Phase 2.97 Research Brief
## Reason Nuclei, Deterministic Cognitive Compilation, and Dice Grammar

**Status:** Proposed pre-Phase-3 research phase  
**Position:** After Phase 2.95 — Reason Consolidation & Identity Fault Lines; before Phase 3  
**Primary purpose:** Determine whether CharacterLab can deterministically compile a large set of cognitive signals into a small number of psychologically independent **Reason Dice**, with correlated evidence, acquired identity, and circumstances represented as modifiers rather than proliferating additional dice.

---

# 1. Why This Phase Exists

Phase 2.9 established the core loop:

```text
Decision
→ dice resolution
→ chosen intent
→ identity evidence
→ acquired identity
→ changed future Decisions
```

Phase 2.95 then corrected a structural mistake in the first implementation.

Signals representing the same psychological topic had been thresholded independently:

```text
Need contribution
    ↓ floor

Identity contribution
    ↓ floor
```

This made weak signals unable to combine and produced artificial all-or-nothing behavior.

Phase 2.95 replaced that with:

```text
raw contributions
        ↓
shared semantic channel
        ↓
consolidate
        ↓
bound/floor once
```

That correction succeeded.

However, the current reference model still treats a surviving consolidated influence essentially as an independent die.

This raises a deeper representational question.

Suppose Mina is deciding whether to visit Glen.

Her cognitive state may contain:

```text
Connection Need is high.
Glen reliably satisfies Connection.
Glen has helped her before.
She believes Glen is supportive.
She remembers enjoying yesterday with Glen.
She has acquired a SocialApproach identity.
She promised Glen dinner.
She is afraid another argument may occur.
```

A naïve translation could produce:

```text
Connection                d10
Glen satisfies Connection d10
Glen helped me             d6
Glen is supportive         d6
Good memory                d4
SocialApproach             d8
Promise                    d8
Argument fear             -d6
```

This is psychologically and mechanically wrong.

Many of those facts do not represent independent answers to:

> Why would Mina choose this?

They are evidence, dispositions, or circumstances modifying the **same underlying motive**.

The target representation is closer to:

```text
CONNECTION THROUGH GLEN       d10 +3

KEEP MY PROMISE TO GLEN       d8 +2

AVOID SOCIAL STRESS           -d6 +1
```

The dice pool should represent the number of **independently live motives**, not the number of facts stored in the cognitive model.

---

# 2. Core Hypothesis

CharacterLab should compile cognition through the following hierarchy:

```text
COGNITIVE STATE
      ↓
Raw Cognitive Signals
      ↓
deterministic semantic projection
      ├── motive attribution
      ├── referent attribution
      ├── source role
      └── evidence provenance
      ↓
REASON NUCLEI
      ↓
correlated-signal consolidation
      ↓
Base Motive
+ Standing Modifiers
+ Situational Modifiers
      ↓
REASON DICE EXPRESSIONS
      ↓
Decision Dice Pool
      ↓
chosen intent
```

The governing hypothesis is:

> **Dice separate independent motives. Modifiers consolidate evidence and dispositions that alter the same motive.**

No language model, semantic embedding service, or natural-language similarity judgment may participate in this pipeline.

Every assignment must follow deterministic typed state and exact mathematics.

---

# 3. Research Boundary

This phase does **not** ask:

> What dice presentation will ultimately be most fun in Vivarium?

It asks:

> **Can a deterministic cognitive architecture decide what deserves a separate die, what belongs as a modifier, and what must be consolidated to avoid double-counting?**

Final values for:

- die thresholds;
- modifier thresholds;
- modifier caps;
- exact dice vocabulary;

are calibration parameters.

The structural rules assigning signals to dice versus modifiers are the research target.

---

# 4. Preserve the Phase 2.95 Finding

Phase 2.95 established:

> Contributions that mean the same psychological thing must enter one shared consolidation path before thresholding.

Phase 2.97 must preserve that result.

The new architecture must **not** regress to:

```text
Need die
Identity die
Memory die
Personality die
Belief die
```

merely because those values originated in different subsystems.

Source subsystem does not determine dice identity.

Semantic meaning does.

---

# 5. The Reason Nucleus

Introduce the conceptual primitive:

```text
ReasonNucleus
```

A Reason Nucleus represents one independently intelligible motive regarding one Decision Option.

Canonical identity:

```text
ReasonNucleusKey
├── OptionId
├── MotiveChannel
├── ReferentKey
└── MotiveDirection
```

where:

### OptionId

The Decision Option this reason supports or opposes.

### MotiveChannel

The psychological reason family.

Examples for the current research corpus:

```text
Connection
Achievement
Commitment
Safety
Autonomy
Recognition
Caregiving
Recreation
Rest
Novelty
```

This vocabulary is controlled and deterministic.

It is not generated from prose.

### ReferentKey

What the motive is about.

Examples:

```text
Person:Glen
Person:Priya
Activity:Work
Commitment:DinnerWithGlen
Location:Home
Institution:Management
Self
None
```

### MotiveDirection

The basic motivational direction.

Initial vocabulary may be:

```text
Pursue
Avoid
Preserve
Reject
```

or another small deterministic set.

The purpose is to prevent semantically opposite motives concerning the same Referent from being silently merged.

---

# 6. Central Consolidation Rule

Signals coalesce into the same Reason Nucleus when they resolve to the same:

```text
Option
MotiveChannel
Referent
MotiveDirection
```

They remain separate otherwise.

Therefore:

```text
I want connection with Glen.
Glen is reliably supportive.
Glen helped me recently.
```

may all contribute to:

```text
(Connection, Glen, Pursue)
```

while:

```text
I promised Glen dinner.
```

contributes to:

```text
(Commitment, DinnerWithGlen, Preserve)
```

and:

```text
I am afraid Glen will become angry.
```

may contribute to:

```text
(Safety, Glen, Avoid)
```

Same entity does not imply same Reason.

Same source subsystem does not imply same Reason.

The semantic coordinates decide.

---

# 7. Independence Test

A useful conceptual definition of separate dice is:

> **Would this motive remain psychologically meaningful if the other motive disappeared?**

Examples:

```text
Connection through Glen
```

and:

```text
Keep my promise to Glen
```

are independent.

If the promise vanished, Connection still makes sense.

If Connection vanished, Commitment still makes sense.

They therefore remain separate Reason Nuclei and separate dice.

By contrast:

```text
Glen helped me before
Glen is reliable
I remember feeling better after seeing Glen
```

do not necessarily represent three independent motives.

They may be different evidence for:

```text
Connection through Glen
```

and therefore belong inside one nucleus.

The implementation does not literally run this English-language question.

The typed Motive/Referent projection below is its deterministic equivalent.

---

# 8. Raw Cognitive Signal

Every participating subsystem must emit a machine-readable:

```text
RawCognitiveSignal
├── SignalId
├── OptionId
├── SignedStrength
├── MotiveAttribution[]
├── ReferentAttribution[]
├── SourceRole
├── EvidenceBasis[]
├── OccurredAt / SourceStateVersion
└── Provenance
```

No prose is required for compilation.

Natural-language explanation is presentation derived later from this state.

---

# 9. Motive Attribution

For signal \(s\), define sparse:

\[
M_s(k)\in[0,1]
\]

representing how strongly signal \(s\) belongs to Motive Channel \(k\).

Many signals are exact by construction.

Examples:

```text
NeedExpectation(Connection, Glen)
→ Connection = 1
```

```text
Commitment(DinnerWithGlen)
→ Commitment = 1
```

```text
IdentityEvidence(CommitmentFidelity)
→ Commitment = 1
when evaluating a commitment-relevant nucleus
```

An Experience affecting multiple Needs may produce a sparse vector:

```text
Connection  0.75
Safety      0.25
```

No LLM categorization is permitted.

Mappings must follow typed definitions, explicit outcome semantics, or mathematically derived Need/goal relationships.

---

# 10. Referent Attribution

For signal \(s\), define sparse:

\[
A_s(e)\in[0,1]
\]

representing how strongly signal \(s\) concerns Referent \(e\).

Directly-keyed cognitive state gives exact attribution.

Example:

```text
NeedExpectation(
  subject = Glen,
  need = Connection
)
```

produces:

\[
A_s(Glen)=1
\]

A memory or Experience derives attribution from its existing character-relative semantic encoding.

Only eligible concept categories participate as Referents.

Candidate categories:

```text
Person
Object
Activity
Location
Group
Institution
Commitment
Self
```

Action/event concepts may remain provenance rather than Referents unless an experiment demonstrates a need otherwise.

---

# 11. Dominant Referent

Where a single Referent is required, derive:

\[
e^*=\arg\max_e A_s(e)
\]

with canonical tie-breaking.

Require:

\[
A_s(e^*)\ge\theta_{referent}
\]

and optionally:

\[
A_s(e^*)-A_s(e_2)\ge\theta_{dominance}
\]

If these conditions fail, the signal does not pretend to have a singular Referent.

It may instead:

- use `Referent=None`;
- project fractionally into multiple Reason Nuclei;
- or be excluded from Referent-specific modification;

depending on which controlled experiment proves most useful.

Do not force ambiguous attribution into a named entity.

---

# 12. Joint Semantic Projection

For signal \(s\), motive \(k\), and referent \(e\):

\[
Projection(s,k,e)
=
|Strength_s|
\cdot
M_s(k)
\cdot
A_s(e)
\]

with direction preserved separately from `SignedStrength`.

A signal contributes to a Reason Nucleus only if:

\[
Projection(s,k,e)\ge\theta_{projection}
\]

This gives CharacterLab a deterministic answer to:

> Which motive/entity pair is this signal actually about strongly enough to matter?

---

# 13. Multi-Referent and Multi-Motive Signals

A signal may legitimately project into more than one nucleus.

Example:

A remembered dinner with Glen may have:

```text
Connection relevance   0.70
Safety relevance       0.20
Recreation relevance   0.10
```

and:

```text
Glen attribution       0.80
Dinner activity        0.20
```

The system must not arbitrarily collapse this to one label if multiple projections materially survive.

However, one underlying signal entering multiple nuclei must retain identical EvidenceBasis provenance so later anti-double-counting logic can detect common origin where relevant.

---

# 14. Source Role

Every Raw Cognitive Signal also declares a semantic **role in compilation**.

Initial controlled vocabulary:

```text
MotiveGenerating
StandingDisposition
SituationalEvidence
ContextModulating
```

The role is about what the information means psychologically.

It is **not** determined by subsystem name.

---

# 15. Motive-Generating Signals

These answer:

> Why does this motive exist at all?

Examples:

```text
Need urgency × expected satisfier efficacy
Commitment pressure
Goal pressure
Value pressure
anticipated regulatory outcome
```

These contribute to:

```text
BaseMotiveStrength
```

and therefore primarily determine the Reason's base die.

---

# 16. Standing Disposition Signals

These answer:

> Why does this person characteristically respond more strongly or weakly to this kind of motive?

The canonical Phase-2.97 example is acquired identity.

Underlying authoritative state remains:

```text
IdentityStrength(CommitmentFidelity) = 0.63
```

The dice compiler may derive:

```text
Dependability-related standing modifier = +2
```

when applied to a Commitment nucleus.

The integer modifier is **not authoritative psychological state**.

It is the dice representation of continuous state.

Later Phase 3 personality may use the same mechanism if experiments support it.

---

# 17. Situational Evidence Signals

These answer:

> Why is this particular motive stronger or weaker in this particular case?

Examples:

```text
Glen helped me recently.
We argued this morning.
He is leaving tomorrow.
This place reminds me of something unpleasant.
I recently failed at this.
```

These become situational modifiers inside an existing Reason Nucleus.

They do not automatically create new dice.

---

# 18. Context-Modulating Signals

Some state changes the current expression of a Reason without representing evidence about the Referent.

Examples may include:

```text
fatigue
intoxication
acute fear
time pressure
observation pressure
```

if later experiments establish them.

They may compile to modifiers while remaining semantically distinct from evidence.

Do not add these merely for completeness.

The Phase 2.97 test corpus should use only state already justified by prior phases.

---

# 19. A Modifier Cannot Create Meaning From Nothing

Standing or situational state cannot invent a Reason Nucleus with no underlying motivational relevance.

Bad:

```text
No autonomy pressure exists.

AuthorityDefiance identity +3

→ spontaneously produces
Defy Authority d4+3
```

Allowed:

```text
Weak but nonzero autonomy pressure exists.

AuthorityDefiance identity +3

→ previously minor Defiance reason
becomes decision-relevant.
```

Therefore distinguish:

```text
no motive
```

from:

```text
weak motive
```

exactly.

---

# 20. Reason Activation

For nucleus \(n\):

\[
B_n
\]

is its consolidated MotiveGenerating strength.

Let:

\[
R_n
\]

be the total raw semantic relevance after eligible standing/situational contributions are included for **activation only**.

A nucleus exists only if:

\[
B_n>0
\]

or the corresponding negative/avoidance form is genuinely present.

A nucleus becomes dice-active if:

\[
R_n\ge\theta_{reason}
\]

This permits:

```text
weak base motive
+
relevant standing identity
→ active Reason
```

without permitting:

```text
zero motive
+
identity
→ invented Reason
```

Standing state may therefore rescue a weak motive but may not create motive ex nihilo.

---

# 21. Avoid Double-Counting During Activation

A modifier contributing to `R_n` for activation must not also secretly increase `B_n`.

The decomposition remains:

```text
Base Motive
Standing
Situation
```

even though all three may determine whether the nucleus is worth representing in the dice pool.

This is analogous to Phase 2.95's two-map solution:

> State derived from previous behavior may affect current resolution without contaminating the evidence base from which new identity evidence is calculated.

---

# 22. Evidence Basis

Every signal derived from prior Experience must retain a sparse weighted Evidence Basis:

```text
EvidenceBasis
├── ExperienceId / DecisionExpressionId
└── Weight
```

Example:

```text
Belief: Glen is supportive

EvidenceBasis:
  experience_117  0.50
  experience_144  0.30
  experience_181  0.20
```

CharacterLab is intentionally unconstrained by production-scale storage here.

Do not prematurely compress provenance merely because Vivarium later may need to.

---

# 23. Evidence Overlap

Two signals may have identical Motive/Referent projection but derive from largely the same underlying evidence.

Define weighted overlap:

\[
Overlap(a,b)
=
\frac{
\sum_x \min(E_a(x),E_b(x))
}{
\sum_x \max(E_a(x),E_b(x))
}
\]

where \(E_s(x)\) is signal \(s\)'s evidence weight for source event \(x\).

Thus:

\[
0\le Overlap(a,b)\le1
\]

Interpretation:

```text
0
→ independent evidence bases

1
→ identical evidence basis
```

This is not semantic similarity.

It is causal/provenance overlap.

---

# 24. Correlated-Evidence Rule

Signals inside the same Reason Nucleus do **not** automatically stack linearly.

If two contributions describe the same motive/referent and derive from substantially overlapping evidence, they are correlated.

Example:

```text
Memory:
"Glen stayed with me when I was upset."

Derived expectation:
"Glen reliably satisfies Connection."

Derived belief:
"Glen is supportive."
```

If all three substantially descend from the same Experience history, the system must not blindly produce:

```text
+1 memory
+2 expectation
+1 belief
```

as though four independent facts had been observed.

---

# 25. Reference Correlation Consolidator

Use a deterministic canonical ordering:

1. descending absolute contribution magnitude;
2. canonical SignalId tie-break.

For contribution \(c_j\), compute:

\[
O_j=
\max_{i<j}Overlap(c_j,c_i)
\]

Then independent residual:

\[
IndependentFraction_j=1-O_j
\]

and effective contribution:

\[
Effective_j=
Contribution_j
\cdot
IndependentFraction_j
\]

First contribution receives full weight.

This is the initial reference model.

It has desirable properties:

```text
identical evidence
→ later duplicate contributes 0

independent evidence
→ full contribution

partial overlap
→ partial incremental contribution
```

All arithmetic remains exact rational.

If this ordering-based rule produces pathologies, the experiment should expose them rather than silently replacing it with a more complex covariance model.

---

# 26. Positive and Negative Evidence

Positive and negative contributions must retain sign.

Do not calculate overlap by allowing positive and negative signals derived from the same evidence to cancel before their semantics are understood.

Within a Reason Nucleus:

```text
positive support
negative modulation
```

may both survive.

Their evidence correlation still matters.

Canonical consolidation should occur within signed contribution sets before net modifier calculation unless an experiment demonstrates a better rule.

---

# 27. Modifier Families

Modifiers should be grouped into a small controlled set of semantic families.

Initial families:

```text
StandingIdentity
LearnedReliability
RecentExperience
CurrentContext
```

Future phases may add:

```text
StandingDisposition
SocialAppraisal
Belief
```

only when experimentally justified.

A ModifierFamilyDefinition specifies:

```text
ModifierFamilyDefinition
├── FamilyId
├── CombinationRule
├── IntegerCalibration
└── MaxMagnitude
```

Different subsystems may feed the same family.

Subsystem identity does not guarantee independent stacking.

---

# 28. Base Die

Every active Reason Nucleus receives at most one base die.

The base die is determined from consolidated:

\[
BaseMotiveStrength_n
\]

using versioned deterministic thresholds.

Reference grammar:

```text
d4
d6
d8
d10
d12
```

Potentially:

```text
none
```

below the active-Reason threshold.

Exact thresholds are calibration constants.

The architectural rule is what matters:

> **The base die describes the strength of the independent motive itself, not all state associated with it.**

---

# 29. Standing Modifier

Standing dispositions compile through a deterministic integer calibration:

\[
StandingStrength\rightarrow m_s\in\mathbb Z
\]

Illustrative only:

```text
negligible     +0
weak           +1
moderate       +2
strong         +3
```

Negative disposition uses the mirrored sign.

Do not lock these thresholds from intuition.

Phase 2.97 must measure the exact probability effect of candidate modifier scales before selecting reference constants.

---

# 30. Identity as a Standing Modifier

Acquired identity is the primary Phase-2.97 standing-modifier test.

Example:

```text
IdentityStrength:
CommitmentFidelity = +0.71
```

may compile to:

```text
StandingIdentity modifier:
+3
```

on:

```text
Commitment / Preserve
```

Reason Nuclei.

It must not automatically apply to:

```text
Connection
Achievement
Safety
```

unless semantic mappings explicitly justify those channels.

Named traits remain presentation.

Do not store:

```text
Dependable +3
```

as authoritative state.

Authoritative state remains IdentityEvidence / IdentityStrength.

---

# 31. Situational Modifier

After correlation consolidation, situational state compiles into integer modifiers.

Example:

```text
Connection through Glen

Base:
Connection × expected efficacy      d10

Standing:
SocialApproach                       +1

Situational:
Independent supportive history      +2
Recent argument                      -2

Final:
d10 +1
```

The exact modifier calibration is an authored dice grammar.

The fact that the supportive history belongs to this Reason Nucleus is not authored per scenario; it follows from semantic projection and provenance.

---

# 32. Final Reason Dice Expression

Each active Reason Nucleus produces:

```text
ReasonDiceExpression
├── ReasonNucleusKey
├── BaseDie
├── StandingModifier
├── SituationalModifier
├── FinalModifier
├── Polarity
├── SourceSignals[]
├── CorrelationTrace[]
└── ExactPMF
```

Final modifier:

\[
M_n=
M_{standing}
+
M_{situational}
+
M_{other\ justified}
\]

subject to explicit caps if required.

Reason roll:

\[
R_n=
Polarity_n
\cdot
(Die_n+M_n)
\]

Any minimum/maximum roll conventions must be explicit.

Do not inherit TTRPG conventions such as “minimum 1” unless intentionally chosen and tested.

---

# 33. Option Score

For Option \(o\):

\[
Score(o)=
\sum_{n\in Reasons(o)}R_n
\]

Independent Reason Dice remain independently addressed.

Thus a conflicted Option can genuinely involve several stochastic motives:

```text
Connection through Glen      d10+2
Keep my promise              d8+3
Escape work                  d6+1
Avoid another argument      -d6+2
```

The dice pool itself now communicates the factorization of the character's motivation.

---

# 34. Exact Decision Probability Remains Analytical

CharacterLab already possesses exact finite discrete-distribution mathematics.

Use it.

For every compiled Reason Dice Expression:

1. construct exact PMF;
2. convolve Reason PMFs into Option score distributions;
3. compute exact Option win probabilities;
4. compute Contest/Stake/AuthorshipPotential using the existing Phase-2.9 definitions unless this phase demonstrates an incompatibility.

Probability is now primarily an **analysis and calibration output**.

It does not directly choose the dice expression.

The dice expression arises from the cognitive compilation rules.

---

# 35. Dice Must Remain Causally Intrinsic

This phase explicitly rejects:

```text
psychology
→ desired probability
→ arbitrary dice compiler
```

as the reference hypothesis.

Instead:

```text
psychology
→ Reason Nuclei
→ base dice + modifiers
→ exact resulting probability
→ roll
```

Probability is used offline to evaluate whether the grammar behaves sensibly.

The dice remain the causal stochastic mechanism.

---

# 36. Offline Backward Balancing

Although probability does not directly determine dice at runtime, the rules may be designed **offline** by working backward from desired probability behavior.

For each candidate grammar, generate exact tables such as:

```text
d8      vs d8
d8+1    vs d8
d8+2    vs d8
d8+3    vs d8

d10     vs d8
d10+1   vs d8
...
```

Measure:

- exact win probability;
- marginal probability effect of +1;
- effect of die-size increase;
- behavior around thresholds.

Then select calibration constants that produce psychologically useful resolution.

This is analogous to tabletop-system design:

> Author the grammar using probability analysis; during play, the grammar itself determines probability.

---

# 37. No Double-Counting in Presentation

If:

```text
IdentityStrength
```

has already become:

```text
+2 StandingIdentity
```

it must not also appear as a separate Identity die.

Likewise a memory whose effect has been consolidated into:

```text
+1 RecentExperience
```

must not independently create another die unless that memory also projects onto a genuinely separate Reason Nucleus.

Each underlying contribution must have one traceable compiled destination per semantic role.

---

# 38. One Fact May Affect Multiple Motives

Do not interpret anti-double-counting as:

> one world fact may only affect one Reason.

The same event can legitimately have different psychological meanings.

Example:

```text
Glen yelled at Mina.
```

may:

```text
reduce Connection-through-Glen modifier
```

and separately:

```text
increase Safety/Avoid-Conflict motive
```

Those are different Motive Channels.

The event may therefore contribute to two Reason Nuclei.

Because both contributions preserve identical EvidenceBasis, their shared origin remains visible.

This is legitimate reuse, not double-counting, because the semantic pathways differ.

---

# 39. One Reason Per Nucleus

After compilation there must never be two active dice with identical:

```text
ReasonNucleusKey
```

If that occurs, compilation failed.

All compatible signals must have consolidated before dice creation.

This should be a hard invariant.

---

# 40. Required Experiment A — Same Entity, Same Motive

Construct:

```text
Connection Need
NeedExpectation(Connection, Glen)
supportive Glen memory
supportive Glen belief/evidence
SocialApproach identity
```

All concerning:

```text
Connection through Glen
```

Expected:

- exactly one `Connection/Glen/Pursue` Reason Nucleus;
- exactly one base die;
- identity appears as standing modifier;
- memory/evidence appears as situational modifier;
- no independent Glen/Memory/Identity dice.

Fail if psychologically redundant dice proliferate.

---

# 41. Required Experiment B — Same Entity, Different Motives

Construct simultaneously:

```text
Connection through Glen
Keep promise to Glen
Avoid conflict with Glen
```

Expected:

```text
three Reason Nuclei
three independent dice
```

despite all referencing Glen.

This proves Referent identity alone does not cause inappropriate consolidation.

---

# 42. Required Experiment C — Same Motive, Different Referents

Construct:

```text
Seek Connection through Glen
Seek Connection through Priya
```

Expected:

```text
two Reason Nuclei
```

because the satisfiers are different Referents.

The system must not collapse all Connection motives into one anonymous Connection die.

---

# 43. Required Experiment D — Correlated Evidence

Construct three signals:

```text
episodic memory
derived expectation
derived belief-like summary
```

primarily based on the same Experience set.

Expected:

- all enter the same Reason Nucleus;
- EvidenceOverlap is high;
- later contributions are heavily discounted;
- resulting modifier is materially smaller than naive linear stacking.

---

# 44. Required Experiment E — Independent Evidence

Construct otherwise-equivalent signals whose EvidenceBasis sets do not overlap.

Expected:

- Overlap = 0;
- each contributes fully according to the reference consolidation rule;
- modifier becomes stronger than in Experiment D.

This establishes:

> Independent evidence stacks more strongly than repeated representations of the same evidence.

---

# 45. Required Experiment F — Partial Evidence Overlap

Construct:

```text
Signal A basis = {1,2,3}
Signal B basis = {3,4,5}
```

with controlled equal weights.

Expected:

\[
0<Overlap(A,B)<1
\]

and:

```text
full duplicate contribution
>
effective partial-overlap contribution
>
zero
```

exactly.

---

# 46. Required Experiment G — Standing Identity Modifier

Establish CommitmentFidelity identity.

Present a Commitment reason.

Expected:

```text
Base Commitment die
+
StandingIdentity modifier
```

No Identity die.

Run identity-feedback ablation.

Expected:

- same Base Die;
- modifier disappears;
- exact Option probability changes;
- identity remains causally load-bearing.

---

# 47. Required Experiment H — Identity Does Not Create Motive From Zero

Establish strong AuthorityDefiance identity.

Present a Decision with:

```text
zero Autonomy/Defiance motive relevance
```

Expected:

```text
no Defiance Reason Nucleus
```

regardless of IdentityStrength.

Then introduce a small nonzero Defiance motive.

Expected:

- Reason exists;
- strong identity may make it dice-active;
- the distinction between zero and weak motive is exact.

---

# 48. Required Experiment I — Weak Motive Rescue

Construct:

```text
weak motive
```

that does not independently clear `θ_reason`.

Add a semantically compatible standing Identity modifier.

Expected:

```text
combined activation clears threshold
```

and produces:

```text
minimum/appropriate base die
+ standing modifier
```

This must preserve Phase 2.95's weak-signal-combination success.

---

# 49. Required Experiment J — Situational Positive/Negative Modifiers

Hold base motive and standing identity constant.

Vary only situational state.

Expected:

```text
same base die
same standing modifier
different situational modifier
different exact decision probability
```

This proves temporary context alters a Reason without becoming an unnecessary new die.

---

# 50. Required Experiment K — Numerous Independent Dice

Create a genuinely complex Decision with at least four independent Motive/Referent nuclei.

Expected:

- several dice remain;
- coalescence does not collapse psychologically independent motives into one mega-die;
- each die remains independently traceable;
- total Option PMF is exact convolution of them.

This protects the design goal that Vivarium Decisions may still visibly contain rich dice pools.

---

# 51. Required Experiment L — Probability Resolution Sweep

For one fixed base die, sweep:

```text
modifier -N ... +N
```

against one fixed opposing expression.

Record exact probabilities.

Then sweep base dice while holding modifier fixed.

Required findings:

- support-strength increases never reduce Option probability;
- each +1 modifier has known exact probability effect;
- each die-size transition has known exact effect;
- no result is assumed from TTRPG intuition.

This is calibration evidence, not architectural proof.

---

# 52. Required Experiment M — Old Versus New Compilation

Feed the same cognitive state into:

### Historical baseline

```text
one die per surviving influence
```

### Phase-2.97 candidate

```text
Reason Nuclei
+ modifiers
```

Compare:

- number of dice;
- exact choice probabilities;
- trace readability;
- evidence double-counting;
- identity effect;
- seed sensitivity.

The new model should produce fewer redundant dice without eliminating independent motives.

---

# 53. Required Experiment N — Seed Divergence Survives

Repeat the Phase-2.9 flagship paired-seed experiment using the new Dice Grammar.

Expected:

```text
same authored character/world
different deterministic Decision rolls
→ different chosen intents
→ different identity evidence
→ different later Reason modifiers
→ different future probabilities
```

The new consolidation architecture must not make the dice merely decorative or erase stochastic biography formation.

---

# 54. Modifier Calibration Research

Test at least two candidate modifier scales.

Example only:

### Narrow

```text
0
±1
±2
```

### Wider

```text
0
±1
±2
±3
±4
```

Do not choose based on aesthetics.

Evaluate:

- probability sensitivity;
- frequency of overwhelming deterministic-like outcomes;
- interaction with base-die changes;
- identity's ability to matter without dominating;
- readability.

The result may remain a calibration recommendation rather than a fundamental psychological finding.

---

# 55. Base-Die Calibration Research

Likewise test candidate BaseMotiveStrength thresholds for:

```text
d4
d6
d8
d10
d12
```

The experiment should report:

> At what psychological-strength intervals does changing the base die create useful rather than pathological changes in outcome probability?

Do not assume evenly spaced strength thresholds are appropriate.

---

# 56. TTRPG-Like “Base Stat” Interpretation

This phase explicitly tests the usefulness of persistent character qualities as standing modifiers.

For example:

```text
AuthorityDefiance IdentityStrength
```

may produce:

```text
Defiance standing modifier +2
```

whenever a relevant Defiance Reason Nucleus exists.

Likewise:

```text
CommitmentFidelity
```

may become a standing Commitment modifier.

This resembles a TTRPG ability modifier while preserving the simulation's deeper architecture:

```text
authoritative continuous psychological state
        ↓
derived dice modifier
```

not:

```text
stored game stat
        ↓
psychology inferred from it
```

Phase 3 may later test whether latent Personality should compile through a similar standing-disposition layer.

---

# 57. Interaction With Acquired Traits

Named traits such as:

```text
Dependable
Rebellious
Caretaker
```

remain projections over underlying Identity state.

They do not themselves carry modifiers.

Presentation may say:

```text
Dependable +2
```

for player readability.

The actual deterministic chain must remain:

```text
IdentityEvidence
→ IdentityStrength
→ semantic compatibility with Reason Nucleus
→ standing modifier
```

Thus removing/changing the displayed trait label cannot alter simulation behavior.

---

# 58. Trace Requirements

Every compiled Reason must explain exactly how it was built.

Example:

```text
REASON
Connection through Glen

Key:
  Option            Visit Glen
  Motive            Connection
  Referent          Glen
  Direction         Pursue

BASE MOTIVE
  Connection urgency                    0.78
  Glen expected efficacy                0.63
  confidence                            ...
  consolidated BaseStrength             0.54

BASE DIE
  0.54 → d10

STANDING
  SocialApproach identity               0.61
  compiled modifier                     +2

SITUATIONAL EVIDENCE
  experience_117 helpful                +1.2 raw
  belief supportive                     +1.0 raw
  evidence overlap                      0.82
  belief independent fraction           0.18
  effective evidence                    ...
  final situational modifier            +1

FINAL EXPRESSION
  d10 +3

EXACT DISTRIBUTION
  ...

OPTION CONTRIBUTION
  ...
```

Every number must be reproducible.

---

# 59. Compilation Invariants

The implementation must enforce:

### One nucleus, one die

No duplicate `ReasonNucleusKey` among active Reason Dice.

### No LLM dependency

Compilation uses only typed data and exact deterministic operations.

### No subsystem-defined dice

A subsystem emits signals, never final dice.

### No identity self-evidence contamination

Identity-derived standing modifiers may affect current choice but cannot enter the base evidence calculation used to generate new Identity Evidence from that same Decision.

Preserve the Phase-2.95 two-map principle.

### Evidence provenance survives consolidation

Every modifier can trace back to its underlying evidence.

### Zero motive cannot be created by modifier

Standing/contextual state may rescue weak relevance but not manufacture absent motive.

### Same entity is insufficient for merging

Motive semantics remain load-bearing.

### Independent motives remain independent dice

Consolidation must not produce one opaque “Option Score” mega-die.

---

# 60. Mathematical Obligations

Before phase completion, prove/test:

\[
0\le M_s(k)\le1
\]

\[
0\le A_s(e)\le1
\]

\[
0\le Projection(s,k,e)
\]

\[
0\le Overlap(a,b)\le1
\]

\[
0\le IndependentFraction\le1
\]

Exact PMFs must normalize:

\[
\sum_xP(R_n=x)=1
\]

Option distributions must normalize exactly.

Identical:

```text
CharacterState
Decision
Seed
ModelVersion
```

must produce identical:

```text
Reason Nuclei
dice expressions
modifiers
rolls
chosen intent
```

---

# 61. Canonical Ordering

Any stage requiring order must define canonical sorting.

At minimum:

```text
MotiveChannel
ReferentKey
MotiveDirection
SignalId
EvidenceId
```

must have deterministic total order.

Correlation consolidation must never depend on hash-map iteration order.

---

# 62. Save/Replay Obligation

A resolved Decision must preserve enough frozen compilation state to reproduce what the character actually rolled at that historical moment.

Do not reconstruct old rolls using the character's current IdentityStrength or current memory state.

Decision history should preserve:

```text
ReasonNucleusKey
BaseDie
Modifiers
source/reason explanation snapshot
rolled result
```

according to CharacterLab's existing historical-trace discipline.

---

# 63. Research Questions

At phase end answer:

## Question 1

Can a deterministic Motive × Referent projection reliably distinguish:

```text
same person, same motive
```

from:

```text
same person, different motive
```

without language-model interpretation?

## Question 2

Can correlated evidence be prevented from stacking as though it were independent using only provenance overlap?

## Question 3

Can acquired identity function more naturally as a standing modifier on matching motives than as an independent die?

## Question 4

Can weak motive + strong relevant identity become behaviorally meaningful without identity manufacturing motive from zero?

## Question 5

Can the resulting dice pool remain rich—several dice for several independent motives—while avoiding one-die-per-fact proliferation?

## Question 6

Does stochastic seed divergence and identity authorship survive the new compiler?

## Question 7

Are the remaining discontinuities primarily calibration properties of base-die/modifier thresholds rather than architectural failures?

---

# 64. Expected Classification Targets

## Reason Nuclei

```text
DERIVED
Motive × Referent × Direction is sufficient
to identify independent reasons

or

REQUIRES MECHANISM
additional semantic dimension is required
```

## Correlated Evidence Consolidation

```text
DERIVED
EvidenceBasis overlap is sufficient

or

REQUIRES MECHANISM
provenance overlap alone cannot prevent
meaningful double-counting
```

## Identity-as-Modifier

```text
DERIVED
standing identity modifiers preserve
all Phase-2.95 behaviors

or

REQUIRES MECHANISM
identity sometimes requires its own
independent motive/die
```

## Dice Grammar

```text
DERIVED
Base Die + Modifiers provides sufficient
resolution fidelity

or

REQUIRES MECHANISM
another stochastic representation is needed
```

---

# 65. What This Phase Does Not Build

Do not add merely because the new grammar could support them:

```text
latent Personality modifiers
Phase-3 social beliefs
reputation modifiers
culture modifiers
status modifiers
drunkenness modifiers
addiction modifiers
Observer modifiers
self-concept modifiers
```

Phase 2.97 establishes the compilation grammar.

Later mechanisms must earn their place in it experimentally.

---

# 66. Phase-3 Interface

If Phase 2.97 succeeds, Phase 3 should not emit dice.

It should emit:

```text
RawCognitiveSignal
```

with:

```text
MotiveAttribution
ReferentAttribution
SourceRole
EvidenceBasis
SignedStrength
```

The Reason Compiler then decides whether Phase-3 output:

- strengthens an existing Reason;
- weakens it;
- becomes a standing modifier;
- becomes situational evidence;
- or creates a genuinely new independent Reason Nucleus.

This keeps Phase 3 from inventing its own private interpretation of the dice system.

---

# 67. Production-Simulation Obligation

At the end of the phase, report what a production simulation must semantically preserve.

Potential obligations include:

```text
typed motive channels
typed referents
character-relative signal attribution
evidence provenance
Reason Nucleus identity
standing vs situational contribution roles
correlation-aware consolidation
base-die compilation
modifier compilation
frozen historical dice expressions
```

Do not yet determine how Vivarium should store or optimize them.

CharacterLab discovers the desired semantics first.

---

# 68. Phase Gate

Phase 2.97 is complete when:

1. cognitive signals deterministically project to Motive and Referent;
2. same Motive + same Referent coalesces without an LLM;
3. same Referent + different Motive remains separate;
4. same Motive + different Referent remains separate;
5. correlated evidence is measurably prevented from naive stacking;
6. independent evidence stacks more strongly than correlated evidence;
7. every active Reason Nucleus produces at most one base die;
8. acquired Identity successfully compiles as a standing modifier;
9. Identity cannot create a motive from zero;
10. Identity can rescue a weak but genuine motive;
11. several independent motives still produce several dice;
12. exact probabilities remain analytically computable;
13. dice and modifiers remain causally authoritative;
14. Phase-2.95 identity formation, stabilization, fault-line, and transformation behavior survive;
15. Phase-2.9 seed-divergence / biography-authorship behavior survives;
16. all compilation is deterministic and fully traceable;
17. no language-model semantic judgment is required anywhere in runtime cognition.

---

# 69. Core Principle

The character may contain hundreds of psychologically relevant facts.

The Decision should not display hundreds of dice.

Those facts should deterministically answer two separate questions:

> **How many independent reasons does this person have?**

and:

> **How strong is each reason given everything the person knows, remembers, values, and has become?**

The first determines the dice.

The second determines the dice and their modifiers.

Therefore:

> **One independent motive becomes one Reason Die.**

> **Durable disposition becomes a standing modifier.**

> **Situational evidence becomes a situational modifier.**

> **Correlated representations of the same evidence do not stack as independent facts.**

> **Same entity does not mean same motive.**

> **Same motive does not mean same entity.**

> **Dice are the compiled playable form of cognition, not a die-shaped visualization added after probability has already been decided.**