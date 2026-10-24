# CharacterLab — Observability Workbench Brief

**Status:** Required prerequisite to Campaign 4  
**Purpose:** Make the completed Campaign 3 character architecture inspectable, manipulable, explainable, replayable, and experimentally comparable before any Campaign 4 simplification work begins.  
**Product role:** Campaign 3 exit instrument and Campaign 4 entry instrument.

---

# 1. Goal

CharacterLab has deliberately been developed headlessly.

That has been appropriate for proving:

- determinism;
- boundedness;
- persistence;
- replay;
- longitudinal behavior;
- architectural seams;
- causal integration;
- qualification tests.

However, the resulting character architecture is now difficult for a human to inspect directly.

The current problem is no longer:

> Can the architecture produce deterministic behavior?

It is:

> **Can a human inspect that behavior, understand why it happened, manipulate controlled inputs, compare counterfactual runs, and identify which architectural machinery actually mattered?**

Campaign 4 is expected to simplify portions of the architecture.

That work must not begin from architectural intuition alone.

Before simplification begins, CharacterLab must provide an experimental interface capable of answering:

```text
What is this character's current internal state?

What changed?

Why did it change?

Which state was consulted but unchanged?

Which state contributed causally?

Which subsystem remained inert?

What happens if one controlled input changes?

Where do two deterministic runs first diverge?

Why did a mechanical factor become a particular die/modifier?

Can that factor be expressed as deterministic human-readable reasoning?
```

The result is not merely a debugging dashboard.

It is the **CharacterLab Observability Workbench**.

---

# 2. Core Principle

> **Campaign 4 simplification should proceed from observed behavior, not assumed redundancy.**

The Workbench should make it possible to run the qualified CharacterLab corpus and inspect which machinery:

- changes;
- contributes;
- persists;
- affects downstream behavior;
- remains inert;
- duplicates another mechanism;
- generates player-comprehensible meaning.

A proposed simplification can then be evaluated by running the same deterministic experiments before and after the change.

The basic Campaign 4 loop becomes:

```text
Run qualified experiment
        ↓
Inspect causal behavior
        ↓
Identify candidate simplification
        ↓
Change architecture
        ↓
Run identical experiment
        ↓
Compare semantic trajectories
        ↓
Accept or reject simplification
```

Campaign 4 must not begin until the Workbench can support that loop.

---

# 3. Architectural Boundary

The Workbench is presentation and experimental tooling.

It must not become a second simulation owner.

The existing architectural boundary remains authoritative:

```text
Authoritative simulation
        ↓
diagnostic/read projection
        ↓
Workbench

Workbench mutation request
        ↓
validated experimental command / fixture operation
        ↓
Authoritative simulation
```

The UI must not bind directly to mutable Domain state and mutate arbitrary fields.

This follows the same established Vivarium rule that presentation consumes projections/read models while external mutation enters through controlled write boundaries.

The Workbench may require new diagnostic projections or experimental commands. Those are legitimate because observability is the feature being built.

It must not require production Domain entities to become UI-aware.

---

# 4. Repository Inspection Is Required

This brief defines capabilities and conceptual categories.

It does **not** define the repository's exact current type names, state fields, Campaign 3 structures, or final diagnostic schema.

Before implementation, inspect:

- current Campaign 3 authoritative state;
- current model identity/version structures;
- current persistence DTOs;
- current experiment/test fixture infrastructure;
- decision/evaluation traces;
- memory state and lifecycle structures;
- identity state;
- attention/acquisition state;
- interoceptive/local-reserve state;
- graph structures;
- existing diagnostics and hashes;
- any current trace/event facilities.

Do not introduce duplicate state merely because this brief names a conceptual category differently from the repository.

Where an existing canonical representation exists, expose it.

Where only derived information is required, project it.

---

# 5. The Workbench Has Six Integrated Modes

The complete prerequisite consists of six mutually connected views:

1. **Character**
2. **Experiment**
3. **Reasoning**
4. **Timeline**
5. **Compare**
6. **Architecture**

These are not independent mini-tools.

Every meaningful object should cross-navigate where possible.

Example:

```text
Reasoning factor
    ↓
source memory
    ↓
memory acquisition event
    ↓
Timeline
    ↓
compare same event in branch B
    ↓
Architecture activity for involved subsystem
```

The value of the Workbench comes from moving between semantic behavior and underlying mechanics without losing identity.

---

# 6. Character Mode

Character Mode answers:

> **What is true inside this character right now?**

It should expose authoritative and relevant derived state in subsystem-oriented panels.

The exact panels must follow the post-Campaign-3 repository, but likely categories include:

```text
Identity / model identity

Personality / latent character primitives

Identity matrix / identity-related state

Interoception / local reserves / bodily signals

Motivational state

Attention / salience / acquisition

Memory
    episodic state
    semantic/consolidated state
    retention state
    fragmentation/loss state
    memory graphs
    cues
    acquisition history

Social / belief / appraisal state

Commitments / current activity / context

Current or recent Decisions

Longitudinal / adaptation state

Diagnostics
    revisions
    counters
    model identity
    hashes
    capacities
```

This list is conceptual.

The implementation must not fabricate a subsystem merely because it appears above.

---

# 7. Diagnostic Field Contract

The Workbench should not be implemented as a hard-coded form containing every current property.

Instead, expose diagnostic metadata sufficient for generic inspection.

Conceptually:

```text
DiagnosticField
├─ Key
├─ DisplayName
├─ Group / Section
├─ Value
├─ ValueKind
├─ Units?
├─ Range?
├─ AuthorityKind
├─ EditPolicy
├─ SourceRevision?
├─ VisualizationHint?
└─ ExplanationHandle?
```

Possible value kinds include:

```text
integer
fixed scalar
boolean
enum
identifier
timestamp
duration
vector
matrix
distribution
collection
graph summary
structured object
```

Possible authority kinds include:

```text
Base / authored state

Authoritative runtime state

Derived state

Historical / evidence state

Evaluation state

Diagnostic-only state
```

These distinctions must be visible in the UI.

A developer must not be able to mistake a derived convenience value for independent authoritative state merely because both appear as numbers.

---

# 8. Editing and Experimental Mutation

Three different operations must remain visually and semantically distinct.

## 8.1 Fixture editing

Edits the starting conditions used to instantiate a run.

Examples may include:

```text
base personality values
initial reserve values
initial identity state
initial memory/evidence
capacities/budgets
scenario parameters
```

These edits should use appropriate controls:

```text
slider
numeric input
toggle
enum selector
matrix editor
structured editor
```

Fixture editing does not mutate an already-running character.

---

## 8.2 Runtime intervention

Changes authoritative state during an active experiment through an explicit experimental operation.

Examples might include:

```text
inject acquisition
change current reserve
introduce evidence
advance time
apply a defined environmental change
```

Every accepted runtime intervention must appear in the experiment trace.

A run must remain explainable after intervention.

---

## 8.3 Counterfactual preview

Changing a UI control may optionally create a non-authoritative preview of affected derived state before committing the change.

Example:

```text
Agency
    current: 0.31
    preview: 0.70
```

The user may then choose:

```text
Apply to fixture

Fork comparison run

Cancel
```

This makes controlled A/B experimentation a natural extension of character editing.

---

# 9. Personality / Matrix Visualization

The Workbench must include full visualization tooling for the character's matrix/vector-based state.

Do not pretend a high-dimensional object is literally three-dimensional.

Instead provide complementary representations.

## 9.1 Selectable 3D projection

Allow the user to choose:

```text
X dimension
Y dimension
Z dimension
```

and plot the selected character state.

Where meaningful, support overlays such as:

```text
true point
belief mean
uncertainty region
starting point
current point
comparison-branch point
preferred region
evaluated target
```

---

## 9.2 Matrix heatmap

Any genuinely matrix-shaped state should have a matrix/heatmap view where useful.

The heatmap should make visible:

- sign;
- relative magnitude;
- pairwise structure;
- symmetry/asymmetry where relevant;
- changed cells under A/B comparison.

---

## 9.3 Numeric/contribution inspector

A visual surface is insufficient by itself.

The same matrix/vector should expose:

```text
exact values
selected terms
contribution values
source/revision
derived projections
```

Visual intuition and mechanical explanation must remain connected.

The production Social Model already establishes the value of exposing both matrix-level contribution terms and human-readable explanations rather than treating a single compatibility scalar as sufficient.

---

# 10. Experiment Mode

CharacterLab already contains named tests and qualification fixtures.

The Workbench should elevate these into first-class interactive experiments.

An experiment definition should conceptually expose:

```text
ExperimentId

Name

Description

Fixture / setup

Participating characters

Initial configuration

Duration or stopping rule

Suggested watches

Suggested charts

Suggested matrix projection

Important checkpoints

Assertions / qualification expectations
```

A test may declare useful views without limiting the user to those views.

Example:

```text
Experiment:
Repeated retrieval preserves episodic memory

Suggested watches:
    memory importance
    acquisition history
    graph state
    retention pressure

Suggested chart:
    importance over simulation time

Suggested checkpoints:
    initial acquisition
    first recall
    reinforcement
    retention competition
```

Named tests therefore become **curated windows into the model**.

---

# 11. Experiment Execution Controls

The Workbench must support:

```text
Run

Pause

Reset

Semantic Step

Run to Next Meaningful Event

Run to Checkpoint
```

"Step" must mean a simulation/CharacterLab semantic unit, not a rendered frame.

Available step targets should be discovered from the real model and may include events such as:

```text
next acquisition
next recall
next memory mutation
next loss/consolidation event
next decision
next scheduled event
next adaptation event
next experiment checkpoint
```

Do not create fake step semantics solely for UI convenience.

---

# 12. Timeline Mode

Every experiment needs a semantic timeline.

Conceptually:

```text
00:00.000  Fixture instantiated
00:00.000  Signal alpha observed
00:00.000  Acquisition accepted
00:00.000  Episodic record created
00:10.000  Cue matched
00:10.000  Recall succeeded
00:10.000  Memory reinforced
...
```

Selecting an event should expose:

```text
Before

Event

After
```

with a state diff.

True arbitrary runtime rewind is not required if the architecture does not support it cleanly.

The Workbench may instead retain diagnostic checkpoints/snapshots sufficient to inspect the selected transition.

---

# 13. State Diff

State diff is a primary feature, not optional polish.

For every selected transition, show at minimum:

```text
CHANGED

Reserve B
    0.61 → 0.47

Signal beta
    inactive → active

Memory #74 importance
    12 → 18

Graph edge 14→22
    0.42 → 0.49
```

Where instrumentation permits, also distinguish:

```text
CONSULTED

CONTRIBUTED

UNCHANGED

NOT TOUCHED
```

This distinction is particularly important for Campaign 4.

A value that was read but did not affect an outcome is different from a value that was never involved.

---

# 14. Reasoning Mode

Reasoning Mode is a central qualification surface.

CharacterLab must expose not only which dice/modifiers were produced, but **why each one exists**.

For any Decision or mechanically resolved choice, show:

```text
Option

Factor / Influence

Polarity

Die / gameplay magnitude

Raw evaluation

Calibrated strength

Uncertainty

Semantic reason

Player-readable reason
```

A factor should be expandable from human explanation down to mechanical provenance.

Example:

```text
PLAYER-READABLE

"I don't want to let Darius down."
d8


SEMANTIC

Concept:
    obligation

Subject:
    Darius

Polarity:
    supports Stay

Strength:
    Strong

Certainty:
    High


EVALUATION

Expected score:
    +0.67

Output uncertainty:
    0.11

Calibration:
    Strong → d8


CONTRIBUTIONS

Commitment importance          +0.31
Believed social consequence    +0.24
Personal obligation value      +0.17
Existing resentment            -0.05


SOURCE STATE

Commitment
Belief/evidence
Value state
Memory/history
Relevant revisions
```

The existing Decision Reasoning model already establishes that detailed state should become semantic Signals, Considerations, Candidate Reasons, consolidated ReasonChannels, and stable Influences rather than exhaustive pair-specific rules.

The Workbench must expose that chain directly.

---

# 15. Three Explanation Levels

Every significant reason should be understandable at three layers.

## 15.1 Human

Example:

```text
"She's let me down before."
```

This is approximately what a player could eventually see.

---

## 15.2 Semantic

Example:

```text
relationship.reliability_history
target: Mina
negative
strong
moderate certainty
```

This is the stable deterministic meaning.

---

## 15.3 Mechanical

Example:

```text
memory records
consolidated background evidence
belief state
Reliance appraisal
Signal inputs
matrix contribution
source revisions
calibration
```

This is the full developer explanation.

The Workbench must allow traversal between all three.

> **Player-readable explanation is semantic compression of provenance, not provenance itself.**

---

# 16. Player-Readable Reason Generation Is a Qualification Target

The Workbench should explicitly test deterministic human-readable reason generation.

Do not defer this entirely to future Vivarium presentation.

A mechanical factor should carry or derive a structured presentation semantic rather than relying on arbitrary freeform strings.

Conceptually:

```text
ReasonPresentationSemantic
├─ Concept
├─ Subject?
├─ Valence / polarity
├─ StrengthBand
├─ CertaintyBand
├─ ContextTags[]
└─ SemanticQualifiers[]
```

Example:

```text
Concept: obligation
Subject: Darius
Strength: strong
Certainty: high
```

could deterministically produce:

```text
"I don't want to let Darius down."
```

A weaker version might produce:

```text
"Darius is counting on me."
```

An uncertain version might produce:

```text
"I think Darius is counting on me."
```

Exact prose/template policy remains part of implementation/design discovery.

The required invariant is:

> **Equivalent semantic state produces equivalent deterministic reason semantics, and rendering must not invent information unavailable to the relevant observer.**

---

# 17. Reason Language Audit

The Workbench must include a corpus-level reason audit.

Across a run or experiment corpus, collect generated player-readable reason semantics and rendered strings.

Surface problems such as:

```text
NO HUMAN REASON
A mechanical factor produced gameplay weight without a player-readable semantic.

COLLISION
Mechanically distinct factors collapse into misleadingly identical reasons.

REDUNDANCY
Two final dice communicate substantially the same human reason.

OVER-SPECIFIC
Rendered language reveals information the character/player should not know.

UNSTABLE
Equivalent deterministic semantic state renders inconsistently.

OPAQUE
The explanation cannot be reduced below raw internal variable names.

SEMANTIC DRIFT
The same semantic identifier is being used for meaningfully different causes.
```

This becomes a formal CharacterLab test surface.

The long-term goal is for Vivarium to inherit a proven deterministic semantic vocabulary rather than inventing modifier language during final UI implementation.

---

# 18. Historical Reason Integrity

If the Workbench inspects a resolved choice later, its reason must describe the state that existed when the choice resolved.

It must not recompute old reasoning from current character state.

This matches the existing Vivarium requirement that resolved decisions retain evaluation-time evidence so later world drift cannot rewrite historical explanation.

Where CharacterLab currently lacks analogous historical snapshots for a relevant experimental outcome, determine whether:

- existing trace/checkpoint infrastructure is sufficient; or
- a diagnostic-only snapshot is required.

Do not make historical explanations accidentally dependent on mutable present state.

---

# 19. Compare Mode — Deterministic A/B Experiments

A/B comparison is required before Campaign 4.

The Workbench must support creating two runs from the same authoritative starting point with controlled differences.

Examples:

```text
A
Discipline = 0.35

B
Discipline = 0.70
```

or:

```text
A
normal memory capacity

B
memory capacity -25%
```

Both runs use otherwise identical:

- fixture;
- seed;
- ordered inputs;
- model/rules version;
- content/experiment definition.

The Workbench then identifies:

```text
last identical checkpoint

first state divergence

first semantic divergence

causal input difference

downstream divergences
```

---

# 20. Semantic Divergence View

Do not stop at:

```text
Hash A != Hash B
```

The comparison should say something like:

```text
Identical through Acquisition #117

FIRST MEANINGFUL DIVERGENCE

Run A:
Memory #42 loses retention competition.

Run B:
Memory #42 survives.

Relevant controlled difference:
Discipline 0.35 → 0.70

DOWNSTREAM

+3h
Memory #42 participates in recall.

+8h
Memory #42 reinforces.

+2d
Memory contributes to reason:
"She's done this before."

+2d
Decision influence differs.

+2d
Resolved choice differs.
```

Hashes remain useful for exact equality.

The Workbench's purpose is to identify **semantic causality**.

---

# 21. Comparison Visualizations

Compare Mode should support, where appropriate:

```text
side-by-side current state

state-diff table

overlaid time-series charts

matrix/vector overlay

memory/graph difference

reason set difference

event timeline alignment

first-divergence marker

final outcome comparison
```

Named experiments may suggest their preferred comparison views.

---

# 22. Architecture Mode

Architecture Mode exists specifically to support simplification.

For a selected experiment or corpus, report which architectural components:

```text
were read

were mutated

produced derived state

contributed to a reason/outcome

created persistent state

scheduled future work

were restored through persistence

remained entirely inert
```

A conceptual summary might resemble:

| Component | Read | Changed | Contributed | Persisted |
|---|---:|---:|---:|---:|
| Local Reserve A | Yes | Yes | Yes | Yes |
| Local Reserve B | Yes | No | No | Yes |
| Identity signal | Yes | No | Yes | Yes |
| Episodic graph | Yes | Yes | Yes | Yes |
| Semantic memory | No | No | No | Yes |

Instrumentation must be implemented carefully enough that it does not change simulation semantics.

Exact mechanism is repository-dependent.

---

# 23. Corpus-Level Architecture Audit

The Workbench should aggregate Architecture Mode across multiple named experiments.

Questions it should eventually answer include:

```text
Which state was never read?

Which state was read but never behaviorally causal?

Which state changed but never affected downstream behavior?

Which two mechanisms always changed together?

Which state was persisted but never used after restore?

Which subsystem contributed only to diagnostics?

Which mechanisms are independently necessary in at least one experiment?

Which variables affect human-readable reasons but not outcomes?

Which variables affect outcomes but currently have no explanation path?
```

This is direct evidence for Campaign 4 simplification.

The tool must not automatically declare a component removable.

It supplies evidence.

Architectural decisions remain deliberate.

---

# 24. Visualization / Charts

Named experiments should be able to request time-series or comparison charts for useful values.

Examples:

```text
reserve over time

memory importance over time

retention pressure

uncertainty over time

appraisal strength

reason magnitude

identity state

graph size

acquisition counts

fragmentation

decision factors
```

The charting contract should work from diagnostic series rather than bespoke UI code for every experiment where practical.

---

# 25. Graph Visualization

Where Campaign 3 contains graph-shaped authoritative state, the Workbench should provide a graph view.

At minimum, support:

```text
nodes

edges

weights

node/edge identity

selected-node details

creation/removal

A/B difference

relevant cue/reference links where applicable
```

Large graphs should support filtering or neighborhood focus rather than attempting to render everything indiscriminately.

---

# 26. Determinism and Run Identity

The following should remain visibly available throughout an experiment:

```text
ExperimentId

CharacterId

ModelIdentity

Rules/model version

Fixture identity/version

Seed

Simulation time

Run status

Authoritative state hash

Relevant allocator/counter state where useful
```

The current architecture and implementation already treat deterministic replay, state hashes, versioned authority, persistence, and ordered simulation as fundamental. 

The Workbench should make those guarantees visible rather than hiding them behind automated tests.

---

# 27. Save / Restore Experimentation

Where the existing CharacterLab persistence model permits it, the Workbench should expose experimental save/restore checkpoints.

At minimum:

```text
capture checkpoint

restore checkpoint

continue run

fork A/B from checkpoint
```

A restored run with identical subsequent inputs should remain equivalent.

This is especially useful for counterfactual experiments originating after substantial longitudinal development.

---

# 28. Search and Filtering

Because the complete Workbench exposes a large amount of internal state, it needs strong navigation.

At minimum:

```text
search diagnostic field

filter by subsystem

filter by authority kind

show changed only

show contributing only

show editable only

show uncertainty-bearing only

show historical only
```

Timeline filtering should support semantic event categories.

Architecture Mode should support filtering by activity kind.

---

# 29. Export / Copy

The Workbench should support exporting or copying a concise experimental summary suitable for:

- issue reports;
- architectural reviews;
- Campaign 4 simplification discussions;
- agent handoff;
- regression analysis.

A useful summary may include:

```text
experiment identity
fixture/model identity
controlled differences
first divergence
important state changes
resulting reason differences
final outcome
state hash
relevant architecture activity
```

Do not require raw UI screenshots as the only diagnostic artifact.

---

# 30. Explicit Non-Goals

The Workbench is not:

- the final Vivarium player UI;
- an art-direction exercise;
- a replacement for automated tests;
- a reason to expose all internal variables to players;
- a second authoritative mutation path;
- a generic reflection browser;
- a license to add speculative character systems;
- a replacement for deterministic headless qualification;
- a natural-language LLM explanation layer.

Player-readable reason semantics must be deterministically generated from authoritative simulation meaning.

An LLM is not required to determine why a die exists.

This remains consistent with CharacterLab's broader purpose of proving that semantic character behavior can be compiled deterministically from simulation state.

---

# 31. Implementation Principles

## 31.1 Expose real state, do not duplicate it

Where authoritative state already exists, project it.

Where derived state already has an evaluator, expose its result.

Where historical provenance already exists, reuse it.

---

## 31.2 Generic where generic helps

Generic diagnostic fields, time series, structured inspection, state diffs, and experiment metadata are desirable.

Do not force every subsystem into one generic representation when a matrix, graph, distribution, or causal explanation requires a specialized visualization.

---

## 31.3 No arbitrary runtime reflection as the final model

Reflection may be useful for bootstrapping diagnostics.

It is not an adequate semantic contract by itself.

The Workbench must know distinctions such as:

```text
authoritative vs derived

editable vs read-only

value vs uncertainty

current vs historical

raw mechanism vs player-readable reason
```

These cannot safely be inferred from a public-property list.

---

## 31.4 Instrumentation must not change behavior

Diagnostic tracing, reads, contribution recording, and architecture activity instrumentation must not alter:

```text
ordering

randomness

model identity

state transitions

retention decisions

timing

persistence semantics
```

Any diagnostic mode capable of changing authoritative outcome is invalid.

---

# 32. Required Integrated Demonstration

Before Campaign 4 begins, the Workbench should demonstrate one complete experiment end to end:

```text
1. Load a named Campaign 3 experiment.

2. Inspect the starting character.

3. Edit one base parameter with a slider.

4. Fork an A/B comparison.

5. Run both branches.

6. Observe live state charts and matrix/vector visualization.

7. Inspect the semantic timeline.

8. Identify the first meaningful divergence.

9. Inspect the before/after state diff.

10. Reach a Decision or other dice-based resolution.

11. Expand one die/factor.

12. Traverse:
    player-readable reason
        → semantic reason
        → evaluation
        → contributing signals/state
        → causal history.

13. Verify the historical explanation remains stable after later state changes.

14. Inspect Architecture Mode for the experiment.

15. Export/copy the run comparison summary.

16. Restore an earlier checkpoint and reproduce one branch identically.
```

This is the minimum proof that the Workbench is actually integrated rather than a collection of disconnected debug panels.

---

# 33. Acceptance Criteria

The prerequisite is complete when all of the following are true.

## Character inspection

- Current authoritative character state is inspectable by subsystem.
- Derived and authoritative values are visibly distinguished.
- Relevant uncertainty is visible.
- Model/run identity is visible.
- Search/filtering makes the complete state usable.

## Editing

- Editable base/fixture variables use appropriate controls.
- Runtime interventions are separately identified and traced.
- Editing cannot mutate derived state arbitrarily.
- A controlled edit can fork an A/B experiment.

## Visualization

- Latent/matrix-based character state has selectable 3D projection.
- Matrix-shaped state has a heatmap where meaningful.
- Exact numeric/contribution values remain inspectable.
- Relevant graph-shaped state has a usable graph visualization.

## Experiments

- Named tests can be launched from the UI.
- Experiments provide descriptive metadata and curated watches/views.
- Run/Pause/Reset/Semantic Step work.
- Experiment checkpoints can be navigated.

## Timeline / diffs

- Semantic events appear in order.
- Selecting an event exposes before/after state.
- Changed state is clearly identified.
- Consulted/contributing state is distinguished where instrumentation supports it.

## Reasoning

- Dice/modifier factors are visible by Option.
- Each factor can expose polarity, magnitude, uncertainty, semantic identity, and provenance.
- A factor can be traversed from human reason to semantic reason to mechanical source.
- Historical reasons do not change when later world state changes.

## Player-readable reason qualification

- Player-readable reason semantics are deterministic.
- Equivalent semantic state yields stable output.
- Reason text does not leak unavailable knowledge.
- Corpus audit detects missing, redundant, colliding, opaque, and unstable explanations.
- No gameplay factor silently exists without a semantic explanation path unless explicitly justified as non-player-facing.

## A/B comparison

- Two runs can begin from the same deterministic state.
- Controlled input differences are recorded.
- First exact and first meaningful divergence can be identified.
- Downstream trajectory differences can be inspected.
- Charts/state/matrices/reasons can be compared.

## Architecture audit

- A run can identify subsystem/state participation.
- Corpus-level participation can be aggregated.
- Read/change/contribution/persistence distinctions are available where feasible.
- Instrumentation does not alter authoritative behavior.

## Persistence/replay

- Checkpoint restore preserves deterministic continuation.
- A restored branch can reproduce its prior result.
- Run identity/version/hash information is visible.

## Export

- A useful experiment/comparison report can be copied or exported without relying on screenshots.

---

# 34. Campaign 4 Gate

Campaign 4 simplification may begin only after:

1. the completed Campaign 3 qualification corpus can be run through the Workbench;
2. major Campaign 3 state is inspectable;
3. deterministic A/B comparison works;
4. causal dice/reason explanation works;
5. player-readable reason semantics can be audited;
6. architecture participation can be observed;
7. at least one full integrated demonstration satisfies §32.

Campaign 4 should then use the Workbench as a required validation instrument.

For each significant simplification:

```text
Baseline qualified corpus
        ↓
capture semantic behavior

Simplify
        ↓
rerun identical corpus

Compare
        ↓
determine whether:
    behavior changed
    causal explanation changed
    semantic distinctions collapsed
    uncertainty disappeared
    state became redundant
    player-readable reasons degraded
```

Automated tests remain authoritative regression evidence.

The Workbench adds human-legible semantic evidence.

---

# 35. Success Criterion

The Workbench succeeds if, before changing the architecture, we can look at a character and answer:

> What is happening inside them?

> What changed?

> Why?

> Which past experiences matter right now?

> Which mechanisms produced this choice?

> Why is this reason a d8 instead of a d4?

> How can that reason be expressed to a player without exposing internal math?

> What changes if this character begins slightly differently?

> Where do those two lives first diverge?

> Which architectural machinery was actually responsible?

And after a Campaign 4 simplification, we can ask:

> **Did we make the model smaller without making the person less meaningfully different, less causally understandable, or less deterministically explainable?**

That is the gate.

---

# 36. Guiding Principle

CharacterLab originally proved:

> **A complex character model can be expressed deterministically.**

Campaign 3 extends that proof across longitudinal development.

The Observability Workbench must now prove:

> **The deterministic character model can also explain itself.**

Only then should Campaign 4 ask how much of that model can be removed.

The desired sequence is:

```text
Build the ideal
        ↓
prove it
        ↓
observe it
        ↓
understand it
        ↓
compare it
        ↓
simplify it
```

Not:

```text
Build the ideal
        ↓
assume we understand it
        ↓
simplify it
```

The Workbench is the difference.