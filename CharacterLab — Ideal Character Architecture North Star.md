# CharacterLab — Ideal Character Architecture North Star

**Status:** Architectural ground truth  
**Authority:** Primary character-model source  
**Scope:** CharacterLab research and eventual Vivarium character-model distillation  
**Purpose:** Define the target architecture, retained invariants, proof obligations, and research boundaries beneath which all CharacterLab phase briefs, experiments, implementation plans, and redesign proposals operate.

---

## 1. Authority and purpose

This document defines **what CharacterLab is attempting to prove can exist**.

It is the primary architectural source for the character model.

Lower-level documents remain authoritative for:

- the behavior currently implemented;
- the exact methodology of an experiment;
- phase-specific hypotheses;
- accepted experimental findings;
- implementation details of the current research substrate.

However, when a lower-level document makes an architectural assumption that conflicts with this North Star, **this document governs the intended direction**.

This document does not declare every proposed mechanism below to be proven.

It deliberately distinguishes:

1. **Architectural invariants** — properties the eventual model must preserve.
2. **Retained capabilities** — phenomena inherited from Vivarium that the eventual model must explain.
3. **Candidate mechanisms** — proposed ways of satisfying those requirements.
4. **Research obligations** — questions CharacterLab must answer experimentally before a candidate mechanism becomes accepted architecture.

CharacterLab exists specifically so that candidate mechanisms may fail.

The North Star should change only when the desired properties of the simulated character change, or when research proves that two desired properties are fundamentally incompatible.

---

# 2. North-star thesis

The target is not a personality system.

The target is a **deterministic causal model of a person**.

A character should possess:

- constitutional differences;
- developmental and age-related state where behaviorally relevant;
- a changing body;
- regulatory dynamics;
- perception and attention;
- a capacity-limited active cognitive workspace;
- cognitive control and inhibition;
- imperfect knowledge;
- learned expectations;
- memories;
- social beliefs and observer-specific models of other minds;
- appraisals;
- affective states;
- motivations;
- commitments, goals, intentions and plans;
- learned skills and procedural competence;
- meaningful decisions;
- genuine uncertainty;
- action attempts distinct from execution;
- outcome evaluation and causal learning;
- autobiographical history;
- plastic dispositions;
- relationships;
- and an identity that emerges from how they have lived.

The character must remain autonomous.

The simulation determines conditions.

The character model determines what those conditions mean to that person.

The resulting character chooses according to their current constitution, body, knowledge, history, relationships, motivations, goals, control state, competence and identity.

The player may influence conditions and, where Vivarium permits, intervene at unresolved boundaries.

The player does not directly author the character's will.

The ultimate product thesis remains:

> **Vivarium is a game about knowing people you cannot control.**

---

# 3. The CharacterLab proof obligation

CharacterLab has one unusually strict architectural requirement:

> **Every authoritative seam in the character model must be expressible deterministically and reducible to semantic meaning through explicit mathematics, without requiring an LLM to determine simulation truth.**

This is not merely an implementation preference.

It is a research objective.

CharacterLab must attempt to demonstrate that:

- perception can be selected deterministically;
- attention and salience can be calculated deterministically;
- active cognitive contents can be selected, maintained, updated and displaced deterministically;
- cognitive control, inhibition, strategy switching and performance monitoring can be represented deterministically;
- memory encoding and retrieval can be calculated deterministically;
- similarity and recognition can be calculated deterministically;
- beliefs can update deterministically;
- uncertainty can be represented mathematically;
- observer-specific beliefs about another character's disposition, affect, goals, intentions and knowledge can update deterministically;
- appraisals can be derived deterministically;
- regulatory dynamics can advance deterministically;
- affective state can feed back into later attention, retrieval, appraisal and control through explicit deterministic transitions;
- Needs and motivational pressures can be derived deterministically;
- goals, intentions, prospective states and plans can be represented and maintained deterministically;
- learned skill and procedural competence can change deterministically;
- social inference can be updated from evidence deterministically;
- Reasons can be compiled from causal inputs deterministically;
- correlated evidence can be consolidated deterministically;
- option appraisal can be calculated deterministically;
- decision confidence and unresolved conflict can be identified deterministically;
- stochastic resolution, where required, can use deterministic seeded randomness;
- an outcome's semantic Expression can be classified deterministically;
- chosen intent can be separated deterministically from action planning, attempted execution and world outcome;
- action success can depend deterministically on actual competence, embodied state, environment and scoped uncertainty rather than on capability belief alone;
- expected and perceived outcomes can be compared deterministically;
- prediction discrepancy, action-outcome contingency, controllability and causal attribution can update learning deterministically;
- private state can be separated from communicative intent and externally observable expression deterministically;
- autobiographical evidence can be accumulated deterministically;
- semantic traits can be recognized deterministically;
- memory can consolidate and fragment deterministically;
- relationships can change deterministically;
- and all of these transitions can produce a complete causal trace.

No LLM may be required to answer:

> “What happened inside this character?”

No LLM may be required to decide:

> “What does this event mean mechanically?”

No LLM may be required to determine:

> “What does this character choose?”

No LLM may be required to decide:

> “What trait has this person earned?”

No LLM may be required to decide:

> “What does this character think another person believes, wants, or intends?”

No LLM may be required to decide:

> “Why did this character learn from the outcome they experienced?”

Language models may eventually be useful outside the authoritative simulation for presentation, natural-language paraphrase, dialogue realization, content-authoring assistance, or other non-authoritative surfaces.

But the underlying semantic truth must already exist before such a model sees it.

The simulation must be capable of running headlessly, reproducibly, explainably, and identically with no language model present.

## 3.1 CharacterLab research posture: reference-first subtractive refinement

CharacterLab does not begin from the fewest mechanisms anyone can imagine and add a new mechanism whenever the current model fails.

That constructive-minimalist strategy is useful for isolated questions, but it is a poor governing method for a causally deep character. A locally sufficient primitive may conceal an upstream layer that later becomes necessary for memory, recognition, social inference, identity, regulation, executive control, goal maintenance, action competence, or long-term adaptation. Repeated discovery of those layers forces downstream work to be reinterpreted.

CharacterLab therefore begins from an intentionally overcomplete **reference architecture** containing the causal distinctions currently believed capable of explaining the ideal character. It then simplifies that architecture experimentally.

The governing target is:

> **The smallest architecture demonstrably equivalent to the ideal reference architecture across the required phenomenon set.**

“Reference architecture” does not mean that every proposed mechanism is accepted, production-ready, or implemented at maximum fidelity. It means:

- the complete end-to-end causal topology is represented from the start;
- every authoritative seam has an explicit contract and trace boundary;
- initially uncertain mechanisms may be deliberately thin, replaceable reference implementations;
- candidate distinctions remain separate long enough to be tested;
- and no candidate earns a place in Vivarium merely because it appeared in the reference model.

CharacterLab should seek **maximum causal legibility before minimum object count**. Prematurely merging perception, memory, recognition, belief, appraisal, affect, regulation, cognitive control, motivation, goals, skill, reasons, decision, action, outcome learning, expression, and identity would make later failures impossible to localize.

The reference model is a **superset hypothesis**, not a semantic oracle. Required phenomena and architectural invariants judge the model; the model does not define success merely by reproducing its own outputs. If the intact reference path cannot produce a required phenomenon, preserve a truth boundary, or support the needed counterfactual, revise or substitute the responsible candidate before attempting to simplify it.

Every element in the reference architecture belongs to one of three research roles:

1. **Required phenomenon** — a capability the eventual character must preserve, such as imperfect recollection or observer-relative social belief. A phenomenon is a test obligation, not necessarily a subsystem.
2. **Candidate causal distinction** — a proposed seam, state, or transformation that may be necessary to produce one or more required phenomena.
3. **Simplification target** — a candidate distinction deliberately selected for removal, derivation, merger, or compression.

The preferred experiment is therefore often subtractive:

> **If this distinction is removed, merged, derived from lower-level state, or compressed after a transition, does any required behavioral, causal, epistemic, semantic, historical, or scaling property disappear?**

Compare the intact reference model and the reduced model on the same controlled scenario, seed, and retained torture corpus. A simplification is accepted only when the reduced model preserves the required observations **and** the required causal counterfactuals. Similar output alone is insufficient if the reduction destroys provenance, truth boundaries, long-term development, or an important intervention point.

Use this reduction vocabulary consistently:

- **RETAINED** — a valid witness shows that removing or merging the distinction loses a required behavior, invariant, or causal counterfactual.
- **DERIVED** — an explicit derivation reproduces the required quantity from lower-level state across a declared domain without separate authoritative state.
- **MERGED** — purpose-built discrimination tests meet an explicit behavioral and causal equivalence criterion across an adequately covered declared domain.
- **COMPRESSED** — the rich distinction is required before a defined transition, after which a cheaper representation preserves specified future behavior and provenance.
- **RETRACTED** — adequately discriminating tests show that the candidate adds no required capacity across the declared domain.
- **UNRESOLVED** — coverage, fidelity, numerical validity, or discriminating power is inadequate or conflicting.

Difference needs a valid witness. Equivalence needs declared coverage. Failure to observe a difference is not itself evidence for derivation, merger, or retraction.

These are research verdicts, not confidence theater. A verdict must identify the tested corpus and may be reopened when a new required phenomenon supplies a discriminating case.

## 3.2 Deterministic does not mean predetermined

Characters may still roll dice.

A deterministic simulation may contain randomness when that randomness is:

- explicitly invoked;
- counter-addressed or equivalently reproducible;
- scoped to a stable causal identity;
- replayable;
- and part of the trace.

The same authoritative state, inputs, event ordering, and random seed must produce the same result.

---

# 4. Semantic compilation principle

CharacterLab should treat human-readable meaning as something that can be **compiled from causal structure**.

The desired direction is:

```text
quantitative / symbolic state
        ↓
deterministic causal transformations
        ↓
semantic classifications
        ↓
human-readable meaning
```

For example:

```text
high autonomy pressure
+ authority-related context
+ meaningful cost of compliance
+ repeated resistance across contexts
        ↓
qualifying DecisionExpressions
        ↓
identity evidence
        ↓
REBELLIOUS
```

The word `Rebellious` does not create the behavior.

It summarizes a mathematically recognizable historical pattern.

Likewise:

```text
strong anticipated harm
+ high confidence of exposure
+ low perceived control
        ↓
THREAT APPRAISAL
        ↓
FEAR
```

`Fear` is semantic meaning compiled from state.

It is not an authored command to flee.

Likewise:

```text
expected success
+ attempted action
+ perceived failure
+ repeated low action-outcome contingency
        ↓
LOW PERCEIVED CONTROLLABILITY
```

`Low perceived controllability` does not directly command surrender.

It becomes learned causal structure capable of changing future appraisal, persistence and strategy.

The goal is not to eliminate semantics.

The goal is to make semantics **earned, causal, inspectable, and reproducible**.

---

# 5. Core architectural invariants

## 5.1 Truth is not Knowledge

Simulator truth must never silently become character knowledge.

A character may only reason from information available through a legitimate causal path.

This applies to:

- world state;
- other characters;
- hidden causes;
- regulatory state;
- memories;
- commitments;
- Observer intervention;
- action competence;
- outcomes;
- and the character's own internal processes.

The canonical epistemic separation is:

```text
WORLD / BODY TRUTH
        ↓
observation / interoception
        ↓
CHARACTER EVIDENCE
        ↓
CHARACTER KNOWLEDGE / BELIEF
        ↓
APPRAISAL
```

Unknown must remain distinct from neutral.

Incorrect belief is permitted.

Different observers may infer different people from the same target.

Visibility is not recognition. A simulator may know that a visible body is `person.glen` while the observer experiences only an unfamiliar perceptual referent, confidently misidentifies that referent, or recognizes it later. Pre-recognition experience must not silently copy truth identity. Recognition attaches an evidence-bearing hypothesis without rewriting what was originally perceived.

Character-accessible is not the same as universally admissible evidence. A record may inform a transition only when that transition's registered typed read domain admits the exact observer-safe record, producing epistemic seam, observer, temporal/window scope, modality, feature, carrier, and applicability. Character provenance is constructed from those explicit permitted references; it is not a filtered query into omniscient truth ancestry. Equality is itself information, so a truth-derived handle does not become safe merely because it is opaque, hashed, encrypted, renamed, or non-dereferenceable.

Evidence availability and evidence quality are separate and proposition-relative. The architecture must not collapse visibility, perceptual certainty, classification certainty, recognition certainty, and appraisal into one binary state or shared scalar. Missing evidence is not negative evidence. Future uncertainty, precision, reliability, or strength belongs in the exact governed mathematics of the proposition that is uncertain. Distance, lighting, occlusion, sensory capability, and attention should normally alter feature-specific sensory evidence rather than directly add arbitrary bonuses to later cognition.

The causal ladder remains observation evidence → perceptual interpretation → recognition → retained character state → appraisal. Later meaning may cite earlier evidence but may not rewrite or back-project itself into that evidence.

Perceptual continuity is not truth identity or kind classification. A perceptual referent is one observer-relative continuant-file—capable of carrying a perceived person, discrete object, place, or spatial region—currently treated by perception as continuous. That tracking judgment may be objectively wrong. Different truth entities may be experienced as one continuous track; one truth entity may be split into several tracks. Later recognition may associate several immutable tracks with the same candidate identity, but truth knowledge and recognition may not silently merge, rewrite, or repair the original perceptual history. Track identifiers are observer-scoped opaque identities, not sources of psychological magnitude.

Perceived occurrence continuity is likewise not truth event identity. A separate observer-relative event-file records which perceived role participations are currently treated as belonging to one occurrence. Perception may merge distinct truth events or split one truth event; one event-file may span several experience envelopes, and one experience may contain several event-files. Continuant-file, event-file, experience, and truth-event identities are not interchangeable, and their opaque ordinals carry no psychological magnitude.

---

## 5.2 Knowledge is not appraisal

Knowing that something happened does not determine what it means to the character.

Typed semantic classification is also not appraisal. `Person`, `Metal`, `BluntObject`, `InteriorSpace`, or a registered affordance may describe truth-side or legitimately perceived structure. `Threatening`, `Likeable`, `Relaxing`, `Bad`, or psychologically `Valuable` are character-relative conclusions unless a narrower formal contract proves otherwise. Classification may expand applicability and inference, but it may not directly create psychological pressure.

The legal path is:

```text
perceived semantic facts
        ↓
belief / context / memory / person model
        ↓
appraisal
        ↓
affect / motive / Reason
```

```text
Knowledge:
"Darius saw me drop the tray."

Appraisal:
"Darius may now think I am incompetent,
and his opinion matters to me."
```

Appraisal is character-relative.

---

## 5.3 Appraisal is not affect

An appraisal may produce an affective conclusion.

Examples include:

- fear;
- embarrassment;
- amusement;
- shame;
- guilt;
- pride;
- humiliation;
- relief;
- frustration;
- jealousy;
- envy;
- admiration.

Affect is derived state.

It is not a command.

---

## 5.4 Affect is not action

Two characters may experience similar fear and choose opposite responses.

Fear may contribute toward:

- fleeing;
- fighting;
- freezing;
- appeasing;
- investigating;
- preparing;
- joking;
- seeking help;
- hiding;
- complying;
- resisting.

The rest of the person determines what happens next.

Affect may also change what becomes salient, what memories are accessible, how later situations are appraised, and how effectively the character exerts cognitive control.

Those feedback effects require explicit transition boundaries.

They do not make affect an action command.

---

## 5.5 Motivation is not action

Needs, commitments, beliefs, emotions, relationships and identities create **Reasons**.

Reasons compete.

No single motive should silently become a command unless the resulting decision is genuinely uncontested.

---

## 5.6 Goal is not motive, plan or action

A character may want a future state without currently acting toward it.

The architecture must distinguish:

```text
MOTIVATIONAL PRESSURE
"I want this."

        ↓

GOAL / PROSPECTIVE STATE
"I want this future condition to become true."

        ↓

INTENTION
"I currently mean to pursue it."

        ↓

PLAN / STRATEGY
"This sequence may get me there."

        ↓

CURRENT ACTION
"This is what I am trying now."
```

These may change independently.

A person may care about a goal but procrastinate, forget, change strategy, abandon it, or be unable to act.

---

## 5.7 Believed capability is not actual competence

A character's belief about what they can do is epistemic state.

Their actual learned competence is action-relevant state.

The architecture must permit:

- skilled but insecure;
- incompetent but overconfident;
- rusty but formerly expert;
- improving skill with stale self-belief;
- temporarily impaired execution with unchanged long-term competence.

Capability belief may shape Decision Reasons.

Actual competence shapes execution.

They must not silently share one variable.

---

## 5.8 Private state is not expressed communication

What a character believes, feels, wants or intends internally is not automatically what other characters receive as evidence.

The canonical communication boundary is:

```text
PRIVATE STATE
        ↓
COMMUNICATIVE INTENT
        ↓
ATTEMPTED EXPRESSION
        ↓
EXECUTED / OBSERVABLE SIGNAL
        ↓
OBSERVER PERCEPTION
        ↓
OBSERVER INTERPRETATION
```

A character may conceal, lie, exaggerate, perform, miscommunicate or accidentally reveal.

No observer gains direct access to private state merely because the simulator knows it.

---

## 5.9 Intent is not execution

The character's chosen intent and the world's executed outcome are separate facts.

A character may choose to leave and be physically prevented.

They still chose to leave.

A character may choose to perform an action and fail because they lack the skill, because their body is impaired, because circumstances change, or because the world prevents execution.

This distinction is required for:

- agency;
- competence;
- coercion;
- Observer interference;
- accountability;
- autobiography;
- identity formation;
- and historical explanation.

---

## 5.10 Authoritative outcome is not perceived outcome

What actually happened may differ from what the acting character or an observer believes happened.

Learning must proceed from legitimately perceived evidence.

The canonical learning separation is:

```text
EXPECTED OUTCOME
        ↓
ATTEMPT

AUTHORITATIVE OUTCOME
        ↓
PERCEIVED OUTCOME
        ↓
OUTCOME EVALUATION
        ↓
BELIEF / EXPECTATION / CONTROLLABILITY UPDATE
```

A hidden cause must not silently update the character's causal model.

---

## 5.11 History may change the future but never rewrite the past

Resolved Decisions retain the causal meaning they had when resolved.

Later personality changes, beliefs, relationships, skills, or world conditions must not recompute why an old choice occurred.

Historical reasons and qualifying semantic Expressions therefore require frozen provenance.

Likewise, later learning may change what a character now believes about a past outcome without rewriting what they perceived or believed at the time.

---

## 5.12 One causal fact must not become modifier soup

The same underlying fact must not be counted repeatedly merely because several systems can describe it.

If regulatory stress contributes to fear, and fear contributes to a Reason, the regulator must not also independently add an equivalent Reason unless research establishes a genuinely distinct causal contribution.

If one failed action updates both a specific capability belief and a general controllability belief, the update pathways must preserve their distinct evidence semantics rather than simply applying two generic failure penalties.

CharacterLab must aggressively test for correlated evidence and double counting.

---

# 6. Canonical architecture topology

The complete current causal topology is owned by:

> [**CharacterLab — Ideal Character Architecture Map**](CHARACTER_ARCHITECTURE.md#3-executive-ideal-architecture)

That document is the sole canonical source for architecture boxes, edges, state ownership, and conceptual event ordering.

This North Star governs what the topology must remain capable of expressing. In particular, any canonical map must preserve the invariant distinctions in §5 and the required phenomena in §§7–30. If the Architecture Map violates a North-Star invariant, the invariant wins and the map must be corrected.

Small diagrams elsewhere in this document are **illustrative invariant diagrams, not canonical topology**. They explain a required separation without independently defining the whole architecture.

The canonical topology must remain:

- causally traversable from world/body truth through character-relative evidence, cognition, choice, attempt, perception of outcome, learning, and consolidation;
- explicit about where simulator truth becomes character-accessible evidence;
- explicit about candidate option construction before option-relative reasoning;
- explicit about pre-attempt snapshots and perceived-outcome evidence;
- explicit about learning evidence and consolidation before persistent learned state changes;
- and separable into deterministic event phases so feedback never depends on recursive or incidental evaluation order.

---

# 7. Constitution: what the character starts with

Constitution answers:

> **What persistent starting differences exist before this particular biography acts upon them?**

The North Star deliberately does **not** lock the final constitutional dimensions.

CharacterLab must prove which dimensions are irreducible.

Candidate constitutional families include:

### Biological constitution

Potentially:

- metabolic kinetics;
- hunger/satiety physiology;
- sleep physiology;
- circadian phase;
- pain/sensory sensitivity;
- immune/recovery parameters;
- sex-linked or reproductive physiology where required.

### Regulatory constitution

Rather than descriptive sliders such as `StressReactivity`, CharacterLab should test dynamical regulatory parameters such as:

- baseline / target;
- production sensitivity;
- pulse magnitude;
- rise rate;
- decay / recovery rate;
- receptor or response sensitivity;
- activation threshold;
- saturation threshold;
- overload threshold;
- adaptation rate;
- sensitization;
- tolerance;
- refractory behavior.

Regulatory axes should initially be abstract rather than claiming biological fidelity.

Candidate research axes include:

- stress-like regulation;
- reward-like regulation;
- arousal/homeostasis.

CharacterLab must remain open to discovering that a regulatory **network** better explains behavior than independent axes.

### Psychological constitution

No existing personality dimension is sacred.

Warmth, Agency, Stability, Sociability, Openness, Discipline and Attunement are hypotheses inherited from earlier work.

Each must earn continued existence.

CharacterLab should specifically ask whether apparent primitives can instead emerge from:

- physiology;
- regulation;
- Needs;
- recognition/familiarity;
- memory;
- learned expectation;
- beliefs;
- affect;
- cognitive control;
- social history;
- identity consolidation;
- or interactions among these.

The rule is:

> **Preserve required behavioral distinctions, not legacy variable names.**

### Developmental / age state

The ideal reference architecture must not assume that every constitutionally influenced parameter is effectively invariant across an entire life.

Where required by the phenomenon set, CharacterLab should preserve a distinction between:

```text
PERSISTENT CONSTITUTIONAL PARAMETERS
        +
DEVELOPMENTAL / AGE STATE
        +
PLASTIC ACQUIRED STATE
```

Possible later phenomena include:

- maturation;
- aging;
- changing sleep architecture;
- reproductive transitions;
- developmental plasticity;
- changing learning rates;
- changing regulatory baselines;
- cognitive decline.

CharacterLab does not need to simulate the whole human lifespan immediately.

The requirement is simply that the architecture must not define adult starting parameters as metaphysically immutable in a way that makes later developmental change impossible without breaking the constitutional boundary.

---

# 8. Personality is plastic even when constitution is persistent

The model must distinguish:

```text
PERSISTENT CONSTITUTIONAL PARAMETERS
        +
DEVELOPMENTAL / AGE STATE
        +
PLASTIC PSYCHOLOGICAL ADAPTATION
        ↓
CURRENT EFFECTIVE DISPOSITION
```

A low-Agency person may become more assertive through biography.

A naturally threat-sensitive person may learn effective coping.

A naturally sociable person may become socially avoidant.

A person may also change because the biological or developmental substrate through which their constitution is expressed has changed.

The model should preserve where the person began without requiring them to remain there forever.

Repeated meaningful history may therefore produce bounded adaptation in the substrate that generates future Decisions.

---

# 9. Regulatory dynamics replace descriptive sliders only when proven

The regulatory hypothesis is:

> Some apparent personality or motivational primitives are actually semantic descriptions of dynamical systems.

For example, `StressReactive` may ultimately be derivable from:

```text
threat appraisal sensitivity
+
regulatory production kinetics
+
regulatory decay
+
overload behavior
+
interoceptive sensitivity
+
learned coping
```

Likewise, addiction vulnerability may emerge from:

```text
reward response
+
habituation
+
adaptation / tolerance
+
withdrawal deficit
+
cue association
+
inhibitory processes
+
learned relief expectation
```

CharacterLab must prove these reductions experimentally.

A biologically inspired name must not substitute for an explanatory model.

`Dopamine` is not a pleasure meter.

`Cortisol` is not a stress meter.

`Testosterone` is not an aggression meter.

The research model should prefer functional regulatory abstractions until biological fidelity has actually been earned.

---

# 10. Needs and motivation

A Need is not necessarily a stored meter.

A Need is a motivational pressure.

Some Needs may be projections of embodied state.

For example:

```text
hydration deficit
+ interoceptive sensitivity
        ↓
THIRST PRESSURE
```

Others may be psychological:

```text
desired connection
- experienced connection
        ↓
SOCIAL CONNECTION PRESSURE
```

Others may derive from commitments, goals, attachment, status, autonomy, security or learned values.

CharacterLab must determine which motivational variables require authoritative storage and which should be derived.

No Need should exist merely because a familiar game-design category expects one.

### 10.1 Motivation and prospective goals remain distinct

A motivational pressure may create or strengthen a goal without immediately producing action.

For example:

```text
persistent autonomy pressure
        ↓
GOAL:
"live independently"

        ↓

possible intentions:
save money
seek another job
leave a relationship
move habitats
```

The goal may persist while no immediate Decision concerning it is active.

Conversely, a commitment or obligation may create a current intention even when intrinsic motivational pressure is weak.

The architecture should therefore avoid representing all durable future-directed behavior as a currently active Reason.

---

# 11. Memory architecture

Memory is a character-relative retained consequence of experience.

The system must distinguish at least:

1. **Event truth** — what actually happened.
2. **Encoding** — what the character perceived and retained.
3. **Imprint** — the surviving compressed representation.
4. **Recollection** — what the character reconstructs now.

Therefore:

> **Event truth ≠ encoded memory ≠ current recollection.**

Memory should also remain distinct from procedural competence.

A character may become better at doing something without retaining an explicit episodic account of every practice event.

### 11.1 Episodic imprints

A memory need not preserve a fully descriptive event object forever.

A candidate compact imprint may contain:

- surviving semantic anchors;
- feature signatures;
- participant/entity references;
- contextual anchors;
- affective signature;
- motivational/reward consequences;
- causal fragments;
- encoding time;
- retention strength;
- accessibility;
- specificity;
- reinforcement history;
- weak provenance.

The imprint is not a conventional destructive hash.

It is a sparse semantic sketch capable of participating in similarity, retrieval and reconstruction.

### 11.2 Importance, accessibility and recognition are distinct

**Importance / retention**

> How strongly does this episode deserve to remain individuated?

**Accessibility**

> How readily is this memory activated by the current context?

**Recognition**

> How strongly does the present experience match surviving memory?

These must not collapse into one memory-strength value.

### 11.3 Memory consolidation

Rich episodic history should progressively become compact learned structure.

```text
Fresh Episode
        ↓
Stable Episode
        ↓
Fragmented Episode
        ↓
Consolidated Pattern
        ↓
Associations / expectations / familiarity / beliefs
```

Important or defining episodes may remain individually addressable indefinitely.

Routine history should not.

### 11.4 Recall may reinforce and reshape memory

Repeated retrieval may preserve some fragments while others disappear.

A frequently retold memory may therefore retain its narrative core while losing peripheral detail.

CharacterLab should test whether deterministic retrieval and reinforcement can produce this behavior without storing the original full snapshot indefinitely.

### 11.5 Affect may alter encoding and accessibility without rewriting truth

The same event may produce different memory consequences under different affective states.

Candidate effects include:

- enhanced encoding of highly salient material;
- reduced encoding of peripheral detail;
- mood-congruent retrieval;
- threat-biased accessibility;
- repeated anger-driven retrieval of prior offenses.

These are feedback hypotheses, not permission to let current mood rewrite historical content.

CharacterLab should test whether affective modulation can be represented as deterministic changes to encoding and retrieval probability/activation while preserving frozen historical provenance.

---

# 12. Recognition, familiarity and novelty

Novelty should not initially be assumed to be a primitive Need.

Candidate architecture:

```text
CURRENT SEMANTIC EXPERIENCE
        ↓
associative retrieval
        ↓
comparison against surviving imprints
and consolidated patterns
        ↓
RECOGNITION / FAMILIARITY
        ↓
reward and appraisal consequences
```

High recognition may reduce novelty-derived reward.

Low recognition may increase it.

Partial recognition permits:

> **familiar but different**

Memory attrition can therefore make an old experience partially novel again without a `NoveltyResetTimer`.

Changed context can do the same.

### Familiarity is not inherently positive or negative

Repeated experience may:

- reduce novelty reward;
- increase comfort;
- increase predictability;
- increase mastery;
- strengthen attachment;
- increase autobiographical meaning;
- produce boredom;
- produce aversion;
- or create cue-triggered craving.

The model must allow repeated experiences to change **why** an activity is rewarding, not merely how rewarding it is.

---

# 13. Habituation, satiation, tolerance and sensitization

These concepts must remain causally distinct even when they produce superficially similar behavior.

**Satiation**

> I have had enough for now.

**Habituation**

> Familiarity reduces response to this repeated experience.

**Tolerance**

> Regulatory adaptation causes the same stimulus to produce less effect.

**Sensitization**

> Repeated exposure causes a stronger future response.

These mechanisms are candidates for explaining:

- novelty seeking;
- repetitive comfort behavior;
- boredom;
- addiction;
- compulsions;
- routines;
- thrill seeking;
- cue reactivity.

CharacterLab should reject a generic repetition penalty if these distinctions prove behaviorally necessary.

---

# 14. Semantic consolidation as a cross-cutting learning principle

The eventual model should attempt to obey:

> **Repeated history becomes structure.**

Examples:

```text
many similar experiences
        ↓
expectation

many encounters with a person
        ↓
familiarity

many observed expressions
        ↓
belief about that person's disposition

many observed mental-state cues
        ↓
belief about that person's goals / intentions

many meaningful self-expressions
        ↓
semantic identity

many repeated behaviors
        ↓
habit

many successful practice attempts
        ↓
procedural competence

many action-outcome pairings
        ↓
contingency / controllability belief

many repeated regulatory exposures
        ↓
adaptation / tolerance / sensitization

many ordinary relationship events
        ↓
relationship background

many shared cultural experiences
        ↓
eventual norms / traditions / collective expectations
```

This is simultaneously:

- a learning principle;
- a memory model;
- a scaling strategy;
- and an explanation for long-term character development.

It is not a claim that memory, belief, skill, habit, relationship, identity, and physiological adaptation share one update equation or one writable state owner. The Architecture Map's consolidation boundary groups these transitions for causal legibility while each target family retains a separately testable formal contract and exactly one mutation authority.

### Retention rule

> **Retain historical detail while its individuality remains causally or explanatorily important. Otherwise consolidate its future causal contribution into more compact learned state.**

### Preservation rule

> **Never consolidate away provenance that still matters to future behavior or historical explanation.**

---

# 15. Observer-relative person models and the identity matrix

One of Vivarium's strongest retained concepts is the observer-relative identity model.

The identity matrix remains valuable, but it should be treated as one component of a broader **observer-specific Person Model**.

The architecture survives even if its original identity axes do not.

```text
TARGET'S EFFECTIVE DISPOSITION
+ TARGET'S CURRENT AFFECT / GOALS / INTENTIONS
        ↓
TARGET'S BEHAVIOR / EXPRESSION
        ↓
OBSERVER PERCEIVES SOME OF IT
        ↓
OBSERVER'S SOCIAL EVIDENCE
        ↓
OBSERVER'S PERSON MODEL OF TARGET
        ↓
OBSERVER-SPECIFIC APPRAISAL
        ↓
OBSERVER'S FUTURE REASONS
```

The observer may be wrong.

The observer does not see hidden constitutional parameters, private goals, true intentions, hidden knowledge, or private affect unless legitimate evidence reveals them.

### 15.1 The identity matrix remains dispositional belief

The identity portion of the Person Model answers:

> **What sort of person do I think this target is?**

A character may appear domineering because of:

- high Agency;
- anxiety;
- learned control-seeking;
- status motives;
- cultural expectations;
- relationship-specific behavior;
- or combinations thereof.

The observer infers the person from evidence.

### 15.2 Current mental-state inference remains distinct

A Person Model may also contain uncertain beliefs about:

- current affect;
- current goals or desires;
- current intention;
- what the target knows or believes;
- what the target appears to be trying to cause.

These are not identity traits.

A character may correctly believe:

> “Darius is usually dependable.”

while incorrectly believing:

> “Darius intends to betray me tonight.”

Likewise, an observer may understand a target's current fear while misunderstanding the target's enduring disposition.

The architecture must preserve this distinction.

### 15.3 Theory of mind is bounded

The ideal architecture does not require unlimited recursive belief structures.

Do not assume:

```text
A thinks
    B thinks
        C thinks
            D thinks ...
```

Sparse first-order mental-state beliefs should be the reference model.

Bounded second-order beliefs may be added only where a required phenomenon proves them necessary, for example:

```text
Mina believes Glen thinks she abandoned him.
```

The same primitive-minimization discipline applies.

### Social state is directional

A's model of B is not B's model of A.

Relationship and Person-Model state must remain sparse and directional.

### Relationship appraisal is multidimensional

The model must not collapse social meaning into one Friendship score.

Distinct lenses may include:

- affiliation;
- respect;
- comfort;
- reliance;
- attraction;
- fear;
- resentment;
- admiration;
- trust in specific domains.

The exact final set remains a research/content question.

### Familiarity is separate

Knowing someone well is not the same as liking them.

A character may know an enemy extremely well.

---

# 16. Self-identity and semantic traits

Semantic traits are compressed descriptions of recurring autobiographical patterns.

Examples:

- Rebellious;
- Dependable;
- Brave;
- Devout;
- Caretaker;
- Stress Eater;
- Workaholic.

A semantic trait must not directly command behavior.

Instead:

```text
constitution
+ learned state
+ circumstances
        ↓
Decisions
        ↓
DecisionExpressions
        ↓
repeated qualifying evidence
        ↓
semantic recognition
        ↓
bounded consolidation
        ↓
future disposition shifts slightly
```

### Trait recognition must preserve causal provenance

`Brave` cannot mean low fear.

A highly frightened person repeatedly acting despite fear may provide stronger evidence of bravery than someone who felt little threat.

`Rebellious` cannot mean high Agency.

Repeated resistance must occur in contexts where authority, autonomy, conformity or principle actually mattered.

Therefore trait recognition consumes **semantic DecisionExpression**, not merely outcome labels or primitive values.

Self-identity may also incorporate beliefs about capability, goals and recurring roles, but those components must remain distinguishable from actual competence and from third-party identity beliefs.

---

# 17. Decision, cognitive control, goals and action architecture

A Decision is a meaningful choice among live alternatives.

The world and character state generate Reasons.

Reasons are semantic compression over causal evidence.

The target flow is:

```text
motivational and cognitive state
        ↓
active workspace + prospective context
        ↓
Raw Cognitive Signals
        ↓
causal grouping / correlation handling
        ↓
Semantic Reasons
        ↓
Option Appraisal
        ↓
Decision Arbitration
```

The arbitration layer asks:

> Has the current person already settled this choice?

### Settled choice

If one option is sufficiently favored, the character chooses it without a roll.

### Unresolved choice

If meaningful alternatives remain genuinely contested, stochastic resolution may occur.

Therefore:

> **Dice exist at the boundary of the character's current identity, not as a mandatory stage of every Decision.**

The first executable reference architecture must preserve the earned Phase 2.9–2.97 **dice grammar**, not replace it with an opaque random choice:

- independently meaningful Reason Nuclei compile into legible dice expressions;
- a base die expresses an activated motive's current strength;
- durable character history or identity may become a standing modifier on a matching reason;
- current evidence or circumstance may become a situational modifier;
- modifiers strengthen, weaken, or reshape an existing reason but cannot create semantic motivation from nothing;
- correlated evidence is consolidated before compilation rather than becoming duplicate dice or modifiers;
- exact pre-roll option distributions, contest, stake, authorship potential, resolution mode, random address, and rolled result remain traceable;
- quiet and player-facing rolls are presentations of the same authoritative unresolved-choice state, not separate decision rules.

This historical compiler is **retained reference substrate**: it must be ported into the fresh architecture as the initial arbitration implementation and control. Its particular thresholds, die bands, modifier quantization, and contest equations remain falsifiable, but the implementation may be reduced or replaced only by an explicit experiment and verdict—not by omission during the reset.

The reinforcing identity loop is equally retained:

```text
unresolved meaningful Decision
        ↓
dice expression and resolved intent
        ↓
frozen DecisionExpression
        ↓
authorship-weighted identity evidence
        ↓
durable identity / disposition
        ↓
standing modifier on a matching future Reason Nucleus
        ↓
shifted future uncertainty boundary
```

The named trait remains a derived description of that history. It is never an independently authored bonus, and identity feedback must not double-count itself when the new Decision produces further identity evidence.

The exact mathematical definition of confidence remains a CharacterLab research question.

A simple top-two score difference must not be accepted without testing multi-option choices, correlated reasons, uncertainty, strong conflicting motives, censored evidence and significance.

## 17.1 Active cognitive workspace

Not everything the character knows or remembers is simultaneously active.

The reference architecture should preserve a candidate capacity-limited workspace representing information that is currently maintained for ongoing cognition.

Candidate contents include:

- attended percepts;
- currently relevant goals;
- retrieved memories;
- active plans;
- salient appraisals;
- social hypotheses;
- recent instructions;
- task rules;
- unresolved intentions.

The workspace should be event-driven rather than continuously simulated at neural fidelity.

CharacterLab should test whether its phenomena require:

- explicit capacity;
- activation competition;
- decay/displacement;
- rehearsal/maintenance;
- interference;
- task-switch costs;
- or whether some of these can be derived from simpler attention and retrieval dynamics.

## 17.2 Cognitive control

Cognitive control is a candidate causal distinction for:

- maintaining a goal despite distraction;
- inhibiting a habitual or immediately rewarding response;
- deliberately shifting strategy;
- suppressing an inappropriate action;
- reappraising an emotional situation;
- monitoring whether an action is working;
- recovering from an error.

Candidate behavior:

```text
dominant habit
+ immediate reward
        ↓
prepotent response

active long-term goal
+ sufficient control
        ↓
response inhibited
        ↓
alternative action selected
```

The architecture must permit control effectiveness to change because of:

- fatigue;
- stress;
- arousal;
- intoxication;
- developmental state;
- learned self-regulation;
- task complexity;
- competing workspace load.

No generic `Willpower` stat should be introduced unless an irreducible residual survives after these mechanisms are tested.

## 17.3 Prospection and goal management

A goal is a represented future condition whose truth matters to the character.

Prospection may include:

- anticipated future states;
- active goals;
- intentions;
- plans / strategies;
- prospective reminders;
- estimated future consequences;
- possible alternate futures.

A goal can outlive any one Decision.

A plan can fail while the goal survives.

A character may switch strategy after feedback.

The architecture should support patterns such as:

```text
GOAL:
repair relationship with Glen

PLAN A:
apologize tonight

        ↓ blocked / fails

GOAL survives

        ↓

PLAN B:
make amends through later action
```

CharacterLab should not begin with an unconstrained general-purpose symbolic planner.

The reference implementation may use bounded authored action affordances and deterministic prospective composition.

The seam matters even if its eventual implementation is very small.

## 17.4 Skill and procedural competence

Actual ability to execute an action is a learned state distinct from both episodic memory and self-belief.

Candidate skill state may represent:

- practiced competence;
- task-specific procedural knowledge;
- automaticity;
- precision;
- error rate;
- execution speed;
- transfer/generalization;
- retention or rust.

The architecture should support:

```text
ACTUAL COMPETENCE
≠
BELIEVED COMPETENCE
≠
EXPECTED OUTCOME
```

Practice may improve competence even when the character does not explicitly remember each practice episode.

Repeated disuse may degrade accessible performance if experiments show the distinction is behaviorally useful.

Habits and skills may interact but must not be assumed identical:

> A habit is a learned tendency to select or initiate a response.

> A skill is learned competence in carrying it out.

## 17.5 Intent, action plan, attempt and execution

The Decision determines chosen intent.

Execution remains a separate causal problem.

Candidate flow:

```text
CHOSEN INTENT
        ↓
ACTION / COMMUNICATION PLAN
        ↓
ATTEMPT
        ↓
actual skill
+ physiology
+ regulatory state
+ cognitive control
+ environmental affordances
+ external interference
+ scoped execution uncertainty
        ↓
EXECUTED OUTCOME
```

This allows a person to make the same choice twice and receive different outcomes because their body, skill or environment changed.

It also preserves Vivarium's core autonomy distinction when the Observer blocks an attempt.

## 17.6 Outcome evaluation and prediction discrepancy

After an attempted action, the character should be able to compare what they expected against what they legitimately perceived.

Candidate evaluation:

```text
EXPECTED RESULT
        ↓

PERCEIVED RESULT
        ↓

OUTCOME EVALUATION
├─ better / worse than expected
├─ surprise magnitude
├─ action-outcome contingency
├─ perceived controllability
├─ perceived causal source
└─ progress toward goal
```

This is a general learning seam, not a dopamine simulator.

The same physical outcome can produce different learning depending on what was expected and what cause the character inferred.

Examples:

```text
"I failed because I lack the skill."

"I failed because the door was locked."

"I failed because the Observer stopped me."

"I failed and I have no idea why."

"Nothing I do changes this."
```

These beliefs should have different future consequences.

CharacterLab should explicitly test whether repeated low perceived action-outcome contingency can produce reduced persistence or learned helplessness-like behavior without an authored `Helpless` trait.

Likewise, repeated successful control may increase self-efficacy, persistence or strategy confidence without requiring a global Confidence meter.

## 17.7 Private state and communication

Communication is action.

The simulator may know:

```text
Mina is frightened.
Mina believes Glen is angry.
Mina intends to conceal both.
```

An observer should not receive those facts directly.

A candidate communication flow is:

```text
private belief / affect / intention
        ↓
communicative goal
        ↓
selected semantic content / display
        ↓
attempted expression
        ↓
execution / skill / inhibition
        ↓
observable semantic signal
        ↓
observer perception
        ↓
observer interpretation
```

The authoritative simulation does not need to generate prose.

An observable communication result may be represented with deterministic semantic content such as:

- proposition asserted;
- proposition denied;
- topic referenced;
- disclosure / concealment strength;
- emotional display;
- sincerity or deceptive intent;
- confidence / uncertainty display;
- social target;
- public/private audience.

Natural-language dialogue can later realize those semantics without owning simulation truth.

---

# 18. Confidence and significance

Decision uncertainty and Decision importance are distinct.

**Confidence**

> How decisively does the current character favor one option?

**Significance**

> How much important motivational or identity-relevant weight is involved?

Candidate behavior:

| | Low significance | High significance |
|---|---|---|
| High confidence | Auto-resolve | Auto-resolve, but historically notable |
| Low confidence | Quiet stochastic resolution | Player-facing / high-salience unresolved Decision |

The exact thresholds and representation remain experimental.

Cognitive-control difficulty is also distinct from Decision uncertainty.

A person may know exactly what they want to do while still struggling to inhibit a competing habitual response.

CharacterLab must not force that phenomenon back into Decision confidence merely because both can involve conflict.

---

# 19. DecisionExpression

A resolved Decision must create a semantic record of what the choice expressed **in the context in which it was made**.

A candidate `DecisionExpression` includes sufficient frozen information to determine:

- the alternatives;
- the major causal Reasons;
- opposing pressures;
- significance;
- uncertainty;
- cost;
- relevant social/authority context;
- relevant fear or affect;
- active goals or commitments where relevant;
- chosen intent;
- intervention provenance;
- and semantic qualifying features.

This permits deterministic statements such as:

```text
ResistedAuthority
ActedDespiteFear
KeptCommitmentAtCost
PrioritizedFriendOverStatus
ChoseNoveltyOverFamiliarity
```

These expressions become legitimate autobiographical evidence.

A DecisionExpression records what the **choice** expressed.

It does not claim that execution succeeded.

For example:

```text
DecisionExpression:
AttemptedToKeepCommitmentAtCost

Outcome:
Observer prevented departure
```

Both facts survive.

---

# 20. The roll-boundary migration hypothesis

One of CharacterLab's eventual capstone experiments should test:

> **Can repeated resolved uncertainty change where future uncertainty exists?**

Example:

```text
Mina encounters minor authority conflict
        ↓
reasons nearly balanced
        ↓
roll
        ↓
resists
        ↓
qualifying DecisionExpression
        ↓
repeated across meaningful contexts
        ↓
Rebellious identity consolidates
        ↓
underlying causal disposition shifts
        ↓
similar future authority conflict
        ↓
wide appraisal margin
        ↓
no roll
```

The counterfactual branch should differ.

Repeated compliance should produce a different autobiography and therefore a different future uncertainty boundary.

The desired result is:

> **The dice appear at the boundary of identity, and the history of those dice moves the boundary.**

CharacterLab should separately test whether repeated **execution** uncertainty changes competence without necessarily changing Decision confidence.

A person may stop rolling to decide whether to attempt the thing while still becoming progressively better at actually doing it.

---

# 21. Commitments, goals and accountability

Commitments remain a distinct motivational source.

A commitment is not an activity.

It is durable intent or obligation.

A goal is likewise not an activity.

It is a represented desired future condition.

The character may:

- fulfill a commitment;
- miss it;
- relinquish it;
- renegotiate it;
- be prevented from fulfilling it;
- advance a goal;
- change strategy toward a goal;
- defer a goal;
- abandon a goal;
- or conclude that a goal is impossible.

Commitment accountability and goal learning must preserve the separation:

```text
WHAT I INTENDED
        ↓
WHAT I ATTEMPTED
        ↓
WHAT HAPPENED
        ↓
WHY IT ACTUALLY HAPPENED
        ↓
WHAT I / AN OBSERVER PERCEIVED
        ↓
WHAT I / THEY ATTRIBUTED
        ↓
WHAT IT MEANT
        ↓
WHAT WAS LEARNED
```

Authoritative cause must not bypass observer knowledge.

Routine repeated success should usually consolidate into evidence/background belief rather than generate an unbounded list of named memories.

Salient violations may remain individuated.

Repeated failure should not automatically imply abandonment.

Whether a character persists, changes strategy, loses confidence, or gives up should depend on goal value, perceived controllability, causal attribution, cognitive control, alternatives, identity and history.

---

# 22. Status effects and perturbations

A status effect should not ordinarily be a bag of personality-stat modifiers.

Where possible, it should perturb the causal substrate.

For example, an intoxication-like state might alter:

- regulatory dynamics;
- cognitive-workspace capacity;
- inhibition;
- attentional control;
- perception;
- memory encoding;
- memory retrieval;
- appraisal weighting;
- motor execution;
- skilled performance;
- threat weighting;
- sleepiness;
- reward response.

Different characters should then behave differently under the same perturbation because their constitutions, histories, beliefs, goals, skills and current states differ.

A status effect may impair **execution** without changing **intent**, or impair **control** without changing the underlying goal.

This is a CharacterLab proof target.

---

# 23. Addiction as a whole-system test

Addiction is a particularly valuable architecture torture test because it may require:

- reward;
- prediction discrepancy;
- habituation;
- tolerance;
- baseline adaptation;
- withdrawal;
- memory;
- cue recognition;
- expectation;
- relief learning;
- habit;
- cognitive control;
- inhibition;
- goal conflict;
- prospective intention;
- stress;
- decision reasoning;
- action competence;
- and identity.

A desirable emergent progression is:

```text
EARLY
"I do this because it feels good."

        ↓

MIDDLE
"I expect this to feel good,
and this is what I usually do."

        ↓

LATE
"Not doing this feels bad,
and doing it promises relief."
```

The motive changes over time.

Recovery should also permit a person to:

- still experience craving;
- maintain a conflicting long-term goal;
- inhibit a habitual response;
- avoid learned cues;
- relapse under control load;
- reinterpret prior outcomes;
- and gradually build a different identity.

No `AddictionTendency` scalar should be introduced unless experiments prove an irreducible residual difference remains after the underlying mechanisms are modeled.

---

# 24. Character-scale optimization principles

The target architecture must eventually support populations far beyond the CharacterLab test cast.

The research model should therefore prefer mechanisms compatible with approximately **10,000 simulated characters**, even when CharacterLab itself operates at tiny scale.

### 24.1 No mandatory per-frame character cognition

Continuous processes should advance analytically between meaningful event boundaries where possible.

Active cognition should wake on meaningful triggers rather than simulate continuous inner speech or frame-by-frame thought.

### 24.2 Sparse social state

Do not materialize full N×N relationship, identity-belief or mental-state-belief matrices.

Create observer-target state when interaction, history, hearsay, shared context or relevance warrants it.

### 24.3 Indexed memory retrieval

Do not scan every historical memory for every experience or Decision.

Semantic/associative activation should produce a bounded candidate set.

### 24.4 Progressive historical compression

Do not preserve every rich episode forever.

Preserve:

```text
recent episodes
+
important defining episodes
+
sparse imprints
+
consolidated associations
+
expectations
+
beliefs
+
familiarity
+
identity
+
skills / habits / learned control where required
```

### 24.5 Derived state should rebuild

If a value can be deterministically recomputed from authoritative state at acceptable cost, do not duplicate it as independently mutable truth.

### 24.6 Prospection and active cognition must remain bounded

Do not allow every character to maintain an unbounded search tree of imagined futures.

Prospective planning should use:

- bounded horizons;
- bounded candidate strategies;
- event-driven reevaluation;
- semantically relevant affordances;
- compression of inactive goals.

Likewise, observer-specific Person Models should stay sparse and uncertainty-bearing rather than recursively materializing full simulated minds inside minds.

---

# 25. Explainability is a simulation requirement

Every meaningful behavioral result must be traceable.

A trace should be able to answer questions such as:

- What did the character perceive?
- What did they fail to perceive?
- What did they believe?
- How certain were they?
- What did they believe another person felt, wanted, intended or knew?
- What memory was retrieved?
- Why was it accessible?
- What was active in the cognitive workspace?
- What goal or plan was being maintained?
- What competing response was inhibited or not inhibited?
- What did the situation mean to them?
- What affect arose?
- How did that affect change later attention, retrieval, appraisal or control?
- What physiological/regulatory state mattered?
- What motives existed?
- Which Reasons were independent?
- Which evidence was consolidated as correlated?
- Why was one option stronger?
- Why was the choice settled or unresolved?
- What random address was used if a roll occurred?
- What did the chosen intent semantically express?
- What action or communication plan followed?
- What skill or competence mattered to execution?
- What did the character attempt?
- What actually happened?
- What did the character perceive as the outcome?
- What did they expect instead?
- What causal source did they infer?
- What did they learn about capability, contingency or controllability?
- What did observers learn from the behavior or expressed signal?
- What memory, habit, skill, belief, relationship or identity state changed?

This trace is not necessarily player-facing.

It is required so CharacterLab can prove causality rather than merely produce plausible output.

---

# 26. No hidden semantic oracle

A CharacterLab experiment fails the North Star if its success depends upon an unmodeled human or LLM judgment such as:

```text
"this situation is embarrassing"
"this behavior is rebellious"
"these memories are similar"
"this joke is funny"
"this action demonstrates courage"
"this person would probably be stressed"
"this person probably meant to deceive them"
"this failure proves they felt helpless"
"this statement sounds sincere"
```

Authored content may provide semantic facts about the world where appropriate.

For example:

```text
an action violates Norm X
an outcome causes Injury Y
a statement references Entity Z
an option breaches Commitment C
an action requires Skill S
a communication attempts to assert Proposition P
an environmental barrier prevents Action A
```

But character-relative interpretation must be computed from those facts plus character state.

The distinction is:

> **Content may state what exists. The character model determines what it means to this person.**

---

# 27. Authoring boundary

Pure mathematics does not mean the simulator must infer ontology from raw pixels or prose.

CharacterLab may consume authored semantic primitives such as:

- entity identities;
- locations;
- action categories;
- causal outcome tags;
- action affordances;
- skill requirements;
- social roles;
- norms;
- commitments;
- observable properties;
- communicative propositions / topics;
- environmental conditions;
- semantic features.

The research obligation is that once these semantic world facts enter the model, **all character-relative transformations are deterministic**.

An LLM must not be required to bridge one internal layer to another.

A dialogue realization layer may later turn:

```text
AssertedProposition:
"I was prevented from leaving."

EmotionalDisplay:
frustrated

Disclosure:
high

SincerityIntent:
truthful
```

into natural language.

The semantics must already be authoritative before realization.

---

# 28. CharacterLab experimental method

Every architectural seam should eventually receive a focused experiment.

Each experiment should specify:

1. **Question** — what architectural claim is being tested?
2. **Competing models** — what alternative mechanisms could explain it?
3. **Controlled scenario** — what variables are held constant?
4. **Perturbation** — what changes between branches?
5. **Expected discriminating behavior** — what result distinguishes models?
6. **Counterfactual** — does changing the relevant cause change the result?
7. **Determinism proof** — does replay produce identical state and trace?
8. **Semantic proof** — can the resulting meaning be compiled without manual interpretation?
9. **Scale implications** — does the mechanism imply pathological storage, polling or dependency breadth?
10. **Reduction operation** — what is removed, derived, merged, compressed, or substituted relative to the intact reference model?
11. **Equivalence comparison** — which behavioral, causal, epistemic, semantic, historical, developmental, action-competence, and scaling observations differ from the reference?
12. **Verdict** — RETAINED, DERIVED, MERGED, COMPRESSED, RETRACTED, or UNRESOLVED, with the exact corpus on which the verdict rests.

CharacterLab should prefer experiments that can falsify a proposed primitive.

The new cognitive/action seams are subject to the same rule.

CharacterLab must attempt to prove, for example, that:

- explicit workspace capacity can be derived or omitted;
- cognitive control can be merged into some lower-level process;
- goal state can be reconstructed from current Reasons;
- skill can be reduced to memory and current physiology;
- prediction discrepancy can be replaced by simpler belief updating;
- a broad Person Model can be reduced back to identity belief;
- communication intent can be represented as ordinary action state.

If a reduction preserves every required distinction and counterfactual, prefer the reduction.

---

# 29. Primitive-minimization rule

For every proposed primitive, ask:

> **Does removing this variable erase behavior or a causal distinction that cannot emerge from the remaining lower-level substrate?**

If not, remove it.

A primitive is justified when eliminating it causes a stable behavioral distinction to become impossible or requires unrelated mechanisms to be abused.

CharacterLab should therefore actively attempt to eliminate candidates such as:

- Stress Reactivity;
- Stress Recovery;
- Reward Responsiveness;
- Novelty Need;
- Addiction Tendency;
- Stability;
- Openness;
- Sociability;
- Curiosity;
- generic Trust;
- generic Fearfulness;
- generic Empathy;
- generic Aggression;
- Willpower;
- Confidence;
- generic Self-Efficacy;
- generic Planning Ability;
- generic Social Intelligence.

Some may survive.

All may appear in the overcomplete reference model. None survive into the distilled architecture by default.

The newly added architecture boxes are not exempt.

`Active Cognitive Workspace`, `Cognitive Control`, `Prospection`, `Skill / Procedural Competence`, `Outcome Evaluation`, and `Observer-specific Person Model` are **candidate causal distinctions** until CharacterLab proves whether each must remain independent.

---

# 30. Retained behavioral torture-test principle

The architecture should be judged against recognizable but causally diverse people.

Examples include:

- stress eater;
- calm under pressure;
- brave despite fear;
- cowardly bully;
- communal anti-conformist;
- conformist loner;
- social butterfly;
- lonely loner;
- workaholic;
- lazy but ambitious;
- people pleaser;
- control freak;
- hypochondriac;
- prepper;
- zealot;
- devout skeptic;
- flirtatious monogamist;
- serial adulterer;
- caregiver;
- moocher;
- addict;
- recovering addict;
- novelty seeker;
- creature of habit;
- person who happily watches the same film 100 times;
- person who becomes bored on the second viewing;
- person who remembers a betrayal for fifty years;
- person who remembers only that they “never really trusted” someone;
- person who acts warmly while privately disliking someone;
- person who laughs while embarrassed;
- person who mistakes nervous laughter for cruelty;
- highly skilled person who believes they are incompetent;
- incompetent person who is highly confident;
- formerly skilled person who has become rusty;
- person whose competence improves faster than their self-belief;
- person who knows exactly what they should do but gives in when exhausted;
- person who habitually begins an action and deliberately stops themself;
- person who performs a practiced skill automatically but cannot explain how;
- person who forms an intention for tomorrow and remembers it at the relevant moment;
- person who values a long-term goal but repeatedly procrastinates;
- person who changes strategy after one plan repeatedly fails;
- person who repeatedly fails despite reasonable choices and eventually stops trying;
- person who experiences the same failures but correctly infers an external barrier and persists;
- person who repeatedly succeeds despite expecting failure and gradually revises self-belief;
- angry person who disproportionately retrieves prior insults;
- frightened person whose attention narrows around threat;
- person who privately panics while outwardly appearing calm;
- person who lies convincingly while afraid;
- person who intends to tell the truth but communicates badly;
- person who correctly understands someone's enduring personality while misunderstanding their current intention;
- person who mistakes nervousness for guilt;
- person whose habitual response persists after its original reward is no longer valuable;
- person who strongly wants one thing but intentionally performs another because of a maintained long-term goal.

Contradictory archetypes are particularly valuable because they expose collapsed axes.

The architecture succeeds when similar outward behavior can emerge from different causes and similar causes can produce different behavior in different whole characters.

The new cognitive/action torture cases are especially valuable because they distinguish:

```text
wanting
from intending

intending
from controlling

controlling
from succeeding

believing one can
from actually being able

choosing
from executing

private state
from public expression

failure
from learned helplessness
```

---

# 31. CharacterLab → Vivarium distillation contract

CharacterLab is not Vivarium's future codebase.

It is a laboratory.

CharacterLab exports:

- validated semantic distinctions;
- proven state-ownership rules;
- deterministic transition equations;
- required event ordering;
- causal invariants;
- correlation rules;
- experimentally justified primitives;
- experimentally eliminated primitives;
- persistence requirements;
- scale constraints;
- counterfactual findings;
- and canonical torture tests.

Vivarium then implements those findings in its production architecture.

Do not port TypeScript object graphs merely because CharacterLab used them successfully.

Port **proven causal contracts**.

The same applies to the newly expanded reference architecture.

Vivarium does not automatically receive permanent subsystems named `WorkingMemory`, `CognitiveControl`, `Prospection`, `Skill`, `PredictionError`, or `TheoryOfMind`.

It receives whatever distinctions CharacterLab proves are required after subtractive testing.

---

# 32. Definition of architectural success

The character architecture is approaching success when CharacterLab can demonstrate, without an LLM in the authoritative loop, a character who:

1. begins with a distinct persistent constitution and can accommodate developmental change without rewriting constitutional history;
2. experiences changing physiological and regulatory state;
3. perceives only part of the world;
4. forms uncertain beliefs from that evidence;
5. maintains only a bounded/relevant subset of knowledge, goals and memories in active cognition;
6. can maintain, inhibit or switch behavior differently under changing control load;
7. remembers some experiences and forgets or abstracts others;
8. recognizes familiar people, places and activities through surviving memory;
9. experiences changing novelty and familiarity without arbitrary reset timers;
10. learns expectations from outcomes;
11. distinguishes expected outcome from perceived outcome and can update causal beliefs from their discrepancy;
12. develops different persistence when repeated failure is attributed to low personal capability, external obstruction or low controllability;
13. appraises the same event differently from another character;
14. experiences derived affect such as fear, embarrassment or amusement;
15. has affect that can alter later salience, retrieval, appraisal or control without directly commanding action;
16. maintains goals and intentions across time without turning them into permanent current Reasons;
17. can change strategy while preserving the underlying goal;
18. produces multiple competing Reasons for a meaningful choice;
19. sometimes reaches an obvious choice without randomness;
20. sometimes remains genuinely conflicted and rolls;
21. can know what it wants yet fail to inhibit a competing habitual or immediately rewarding response;
22. produces a semantic DecisionExpression from a choice;
23. preserves chosen intent when attempted execution fails or is externally prevented;
24. distinguishes actual competence from belief about competence;
25. can acquire procedural competence through practice without requiring explicit episodic recall of every practice event;
26. changes autobiographically because of repeated Expressions;
27. acquires a recognizable identity without an authored trait flag;
28. changes where future uncertainty occurs because that identity changed;
29. forms imperfect beliefs about another character's enduring identity;
30. separately forms imperfect beliefs about another character's current affect, goals, intentions or knowledge;
31. changes a relationship because of what they believe happened;
32. can communicate or conceal private state without giving observers omniscient access to it;
33. allows two observers to interpret the same expressed behavior differently;
34. develops routines, boredom, comfort, habits or addiction through ordinary learning dynamics;
35. can preserve a long-term recovery goal while cue-driven habit, withdrawal and control load still create relapse risk;
36. retains defining memories while routine history consolidates;
37. reconstructs old memories from fragmented imprints;
38. continues behaving coherently after long analytical time advancement;
39. survives save/load with identical continuation;
40. and can explain every meaningful transition through a deterministic causal trace.

The final proof is not that the character appears human in one scripted scenario.

It is that the same compact causal substrate continues producing coherent, differentiated, historically contingent behavior under counterfactual pressure.

---

# 33. Architectural north star

The intended model can be summarized as:

> **A character is an embodied, partially informed, history-bearing autonomous system whose persistent constitution and development shape experience; whose attention, memory and active cognition determine what is available to think about; whose experience changes prediction and models of other people; whose predictions, body and history create appraisal, affect and motivation; whose motivations can become durable goals and immediate reasons; whose cognitive control mediates the struggle between maintained intentions and competing responses; whose unresolved reasons create genuine uncertainty; whose choices create intent but do not guarantee execution; whose skills, body and world determine what an attempt can actually accomplish; whose comparison of expected and perceived outcomes creates new learning; whose private state is only partially expressed to others; and whose choices, attempts, consequences and learned history gradually change who they are.**

And the CharacterLab mandate is:

> **Prove that every seam in that process can be represented deterministically, calculated with explicit mathematics, compiled into semantic meaning, traced causally, experimentally simplified, and eventually scaled—without requiring an LLM to decide what the character thinks, feels, wants, remembers, plans, believes about another mind, means, attempts, learns, communicates, or chooses.**

That is the architectural ground truth beneath all subsequent CharacterLab work.
