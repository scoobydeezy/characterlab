# ATTN-001: bounded active evidence selection

Proposed version: `attention-selection/0.1-draft`, revision1, 2026-09-11.
**DRAFT — NOT SHAPE ACCEPTED. All proof vectors NOT PASSED.** No allocation,
implementation or corpus promotion is authorized by this document itself.

## Target and causal boundary

Under fixed permitted observer evidence, more eligible perceptual units than active
capacity must produce a bounded selected subset for one named subsequent processing
operation. Selection must be derived, inspectable and independently removable. It
cannot reveal truth, alter historical perception or become an encoding/learning update.

Proposed path:

```
actual current-lane SEM + observed causal-role companion claims
    → admitted finite eligible-unit view
    → AttentionSelection
    → selected-only diagnostic processing receipt
```

This is post-perception active selection within the perception/attention boundary.
It does not implement early sensory gating. The processing receipt witnesses which
admitted units the consumer actually read; it is not memory, appraisal, a reason,
Decision or learning evidence. The full ATTENTION intake still requires a separate
encoding footprint and later access experiment.

Permission remains observation-owned. Selection remains this seam's operation.
Encoding strength is absent, not set to one for selected units or zero for excluded
ones. Later retrieval remains unchanged and independently gated. No new retained
Attention state is proposed: `WritableStateFamilies = {}` for both new operations.

## Proposed finite domain and identity

One observer and one current-lane experience per settlement; zero to three eligible
units drawn from that experience. A unit is the existing pair of event-file and
continuant-file identities, scoped by the enclosing experience/observer. No new unit
identity is allocated. Each unit carries its actual admitted evidence references and
all companion claims; repeated references/claims do not create additional units.
No concept-tag count, truth identity, name spelling or occurrence ordinal supplies
psychological magnitude.

For the first comparison only, each eligible unit has exactly one distinct observed
role from {Cause, Target, Incidental}; duplicate identical claims do not change it.
The full evidence grammar still permits multiple roles. Missing-role, unsupported-role
and multi-role units are explicitly outside this finite selector profile, not silently
assigned Incidental or reduced by a largest-role heuristic. They remain visible in
trace-side exclusion accounting. The producer must demonstrate an actual admitted
rule for every role it uses; if the profile cannot generate observed Incidental,
that specific residual-pool comparison remains blocked rather than defaulting it.

This restriction is a profile boundary, not a generic SEM validator change. A unit
may have several supporting references without consuming several capacity slots.
Denied/unobserved units never enter the character view. The diagnostic consumer must
receive only selected unit material; enclosing trace provenance is not a permission
to read the entire candidate pool. Same-observer linkability and ReadDomain remain
SEM/PRJ/IDN-owned. Immutable source identities can be reused as references, not minted
again under attention-specific provenance IDs.

## Candidate mathematics and alternatives

The proposed first candidate is **residual-priority finite selection**. It composes
the historical residual allocation control with a new finite selector; that composition
is not claimed to be the historical attention algorithm itself.

Committed candidate parameters: capacity K in{0,1,2}, eligible count≤3. Proposed
exact role strengths are Cause=1, Target=9/10. If m>0 eligible Incidental units exist,
each receives (1/5)/m; if m=0 no division or residual row occurs. Strength is an
allocation/priority variable only, not evidence certainty or imprint. All arithmetic
is exact rational; no RNG or rounding is required. All admitted units have positive
priority in this domain. Select the first min(K,n) units in descending priority order.
Canonical unit-key byte order resolves exact ties solely for deterministic execution.
Tie selection may depend on opaque key order; no stronger renaming invariance is
claimed for exact ties. Strict-priority choices must be invariant under consistent
identity renaming, and equal-priority units must have identical scores.

Separate proposed controls, each eventually with its own exact model commitment:

- **Equal-priority finite selection:** all eligible priorities1, same K and tie rule.
  It removes the role effect while retaining capacity; it is not a per-unit attention flag.
- **Unlimited selection:** all eligible units selected, same evidence and priorities.
  It is a capacity-removal negative control, not a capacity-conforming winner.
- **Historical residual allocation component:** continuous allocations without top-K.
  Preserve its meaning; it cannot pass a hard capacity obligation by relabeling weights
  as a selected set.

Independent/shared/hybrid **encoding** budgets are later comparison models, not
switches on this selection result. No category prior, realized Need effect, surprise,
affect or familiarity term is quietly filled with a default. Those operands need
separate admitted seams. Current EMB pressure is not realized Need regulation and
cannot substitute for that historical factor.

A minimal positive fixture has one Cause and two Incidental units, K=1: priorities
1,1/10,1/10; Cause selected. K=0 selects none; K=2 selects Cause and exactly one
Incidental. Removing one Incidental gives remaining priority1/5, leaving Cause at1.
This tests allocation footprint and capacity, **not encoding footprint**. A role-only
counterfactual exchanges observed roles of two consistently identified units via
permitted event evidence; no original input directly edits their attention scores.

## Proposed outputs and integration obligations

AttentionSelection needs one occurrence allocated through the accepted occurrence
machinery, existing observer/subject projection, source experience and companion
references, exact contract/model provenance, committed K, eligible keys with derived
priorities, selected keys and explicit exclusion reasons. The selected-only consumer
receipt needs its own transition result identity, actual input selection occurrence,
actual selected evidence reads and no other content. These are required semantic
fields, not an accepted record layout. Reuse the standard trace for event/model/run,
read, output and child provenance rather than duplicating it into a parallel system.

The profile must generate and seal the eligible view before selection. A client cannot
submit unit scores, Selected flags or synthetic role claims. Bind actual completed
siblings, exact subject, instant, event coordinates and source bytes; reject replay,
foreign observer/event, stale claims and forged selected sets before processing.
Empty eligible and capacity-zero outcomes must still be explicit successful selection
results with no selected reads, not a missingness claim about the underlying world.

Proposed scheduling is after phase15 role completion and before the selected processing
operation. No new phase is allocated here. A same-phase registration at an already
admitted boundary requires exact ordering review; phase20 recognition-input freezing
must retain its existing contract. This draft neither intercepts recognition nor
rewrites frozen SEM. Consequence-lane attention and affect feedback are deferred.

Before shape acceptance, specify exact registration/record inventory, which existing
phase can legally own each operation, output/occurrence budgets, transition admission,
trace schema, failure codes, finite work, canonical profile/model and complete-prefix
restore. Abort must restore output, trace, IDs and live associations; no partial selection
survives. All selected-only consumer reads must be independently reconstructed.

## Proposed adversarial vectors — NOT PASSED

| Vector | Required witness |
|---|---|
| AT-A permission | Change denied hidden content under identical permitted inputs; character-visible view, priorities and selection stay exact. No denied unit or truth handle reaches consumer. |
| AT-B capacity | Three eligible units and K0/1/2; exact min(K,n) selected; unlimited mutant exceeds K. Include empty pool. |
| AT-C role | Actual observed role exchange changes strict-priority selection; equal-priority model is compared under named key order. No authored score intervention. |
| AT-D residual | One versus two incidental units gives1/5 versus1/10 each; focal Cause stays1. No division at m0. |
| AT-E duplicate footprint | Repeated supporting evidence/claim for the same unit cannot mint capacity slots or change priority. Additional real incidental units do change their shared allocation. |
| AT-F unknown/multiple role | No evidence of a role is not Incidental. Out-of-profile/multi-role inputs are explicitly excluded before selection; original claims remain intact. |
| AT-G identity | Foreign observer/experience and stale sibling reject. Strict-priority output respects identity renaming; tie behavior follows only the declared canonical rule. |
| AT-H selected-only reads | An excluded unit in a valid pool cannot be read by the diagnostic consumer, even through nested source references. Inject an unauthorized read to prove enforcement. |
| AT-I immutable history | Capacity change leaves original observation/SEM/role bytes unchanged and creates no memory, belief, identity or body patch. No retrospective reservation cancellation. |
| AT-J chronology | Selection consumes completed phase15 claims; attempts to use it to alter phase10 sampling or phase14 experience fail admission. Existing recognition retains its version. |
| AT-K single provenance | Actual source/occurrence IDs reused as references; no additional unit identity or hidden-world overlap key. Exact output/child budgets enforced. |
| AT-L persistence | Restore each whole-instant prefix and compare continuation; tampered selection/role source/model rejects; stage failures roll back all live bindings and allocations. |
| AT-M historical scope | Existing body/task/SEM factories reject new records; retained attention/salience/association controls are not presented as implemented production dependencies. |
| AT-N no learning inference | A selection result can exist with all persistent character state byte-identical. No encoding-strength, retrieval, whole ATTENTION or PHEN-MEM PASS is inferred. |

## Self-review disposition and next work

The architecture can support this bounded target, but this draft is **not yet shape
complete**. Three concrete blockers remain: actual plural same-observer producer
profile (including the chosen role mappings), exact legal scheduling/registration,
and complete symbolic carrier/consumer read authority. Resolve them by inspecting
and composing settled contracts before allocating or implementing. Do not weaken
the producer to authored psychological inputs to make the proof easy.

The broader encoding/probe contract is a future prerequisite for whole ATTENTION,
not a blocker to designing and testing a clearly labeled selection component. No
favorable selector result decides general salience, early sensory attenuation,
attention/recognition equivalence, affect feedback or retrieval architecture.
