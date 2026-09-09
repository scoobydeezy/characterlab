# Task lifecycle — adversarial self-review2

2026-09-09. Agent review. **Whole shape withheld.** Three corrections below govern
the next draft; no allocation or implementation is authorized.

## Authored availability must not mean adopted commitment

The first draft required every declared task to be Open in S0. That incorrectly
coupled model content availability to a character's adoption, and forced the no-task
control to change the model. CONTENT explicitly permits goal/commitment facts but
does not make every available item a current psychological state.

Correct the initial-state domain: any subset of the finite declared task keys may
be present, and each present initial value must be Open. Absence means **not adopted**,
not a zero-strength commitment and not implicit Open. Terminal initial values remain
forbidden in this first profile; terminal history must be generated. Runtime
settlement never inserts or removes a task key.

Measurement applicability still selects the same finite holder/criterion/time keys
without reading status. A selected absent prior produces no change. It must not be
silently adopted. A terminal prior also produces no change. This keeps source
dispatch independent from state while making actual prior absence observable in
the trace and workspace projection.

## Private schedule must stay coupled across adoption interventions

Derive one deadline association for **every declared concrete task key**, not only
the adopted subset. The private deadline handler reads that exact prior. Absent or
already-terminal prior yields no change; Open yields DeadlineMissed.

This makes same-model no-task/live-task initial-state comparisons preserve future
event and allocator slots. A model definition does not leak into another character's
knowledge: these are trusted host target associations, produce no cognitive output,
and authorize no workspace content or motive when the actual task prior is absent.

At quiescence T≥Deadline, every **present** task is terminal. An absent task is legal.
The old proposal's "missing required initial task state is an error" is withdrawn;
unknown or foreign keys remain errors. Prefix restore authenticates both initial
adoption and the constant declared deadline schedule.

## Content fields should state their delegation explicitly

The proposed empty UnitsDomainsBounds/DeclaredInputs/EpistemicVisibility fields left
their relationship to the referenced spec too implicit. Use the exact one-element
spec-reference list in these170 fields:

    DeclaredInputs
    UnitsDomainsBounds
    EpistemicVisibility
    Lifecycle
    FormalSeamMappings
    ReferencedRegistryIds

The fixed specialization defines their respective meanings: holder/criterion input
domain; exact criterion/window domain; adopted-holder-only cognitive access; the
finite lifecycle; the named receiving seam; and generic registry reference closure.
ReferencedContentIds remains exactly HolderContentId. The one spec remains the sole
source of values; repeated references do not create competing criteria/deadlines.

DeclaredOutputs and WorldEffects are empty because content emits nothing and causes
no world effect. Preconditions/ObservationAffordances and the remaining descriptive
fields are empty in this version, with actual receiving preconditions fixed by the
specialization. No executable text or callback may fill those fields.

This explicit delegation is a new task-kind specialization, not a reinterpretation
of character-kind content. It must be tested for missing/extra/different spec refs,
cross-holder task records, duplicate concrete IDs, unresolved refs and unchanged
Character qualification before that specialization passes.

## Preserved decisions and next closure work

Keep concrete1038/authored-origin identities, half-open windows, distinct perceived
satisfaction/deadline status, no semantic lifecycle outputs, no runtime occurrence
allocation for lifecycle evaluation, and the independent original deliberation cue.
Keep the new prospective topology explicit; do not hide goals in learned belief.

Remaining implementation blockers are exact registration/role inventory, exhaustive
combined140 admission and failure ordering, and workspace/appraisal/motive shapes.
These are specification work under the current autonomous authorization. No user
decision is needed to correct the proposal, and no runtime files change here.
