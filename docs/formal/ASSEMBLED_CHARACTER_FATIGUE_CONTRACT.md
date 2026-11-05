# Experienced fatigue in the assembled character

Version assembled-character-fatigue/0.1-candidate; preimplementation2026-11-05.
LOCAL DISPOSITION: port fatigue-public/0.1-candidate into the single assembled
scheduler/state under the existing control owner composition. Original contract,
models, fixtures and MotorOnly execution comparator remain immutable.

## Admission and ownership
Rules/registry0.55 adds slot38 [assembled-fatigue/0.1, law], law SevereThreshold,
NoFatigue or AnyFatigue. Existing38 slots retain their meaning. Older versions
cannot admit fatigue input/state. No initial learned fatigue is admissible.
One holder, at most16 distinct source instants1..100; phase30, empty dependencies.
Source [assembled-fatigue/0.1, physicalGrade, displayMode, visible, recipient].
Grades0..2; display0 authentic,1 rested,2 mild,3 severe. Both flags boolean.
Observation120 emits [assembled-fatigue-observation/0.1, occurrence1164, holder,
instant, optionalGrade]. Optional grade is singleton iff visible AND recipient;
then authentic uses physical grade, otherwise display-1. Empty means unknown,
never rested. Allocate an occurrence even when absent. Generated120/140 events
are authenticated children; callers cannot author admitted cognitive records.

Root1351/field1/holder maps to [assembled-fatigue/0.1, ordered observations].
Sole writer authority/fatigue-experience at140. Only nonempty observations append;
previous entries immutable, strictly increasing instants, unique occurrences,
correct holder, bounded16 entries. Missing reports leave the journal untouched.
No recovery/decay is inferred from elapsed time or hidden physical state.

## Control and temporal connection
Latest admitted grade is experienced condition. SevereThreshold impairs iff known
AND grade2; AnyFatigue iff known AND grade>=1; NoFatigue never impairs. These are
exact original candidate predicates; no coefficient or new mathematical law.
Reference SevereThreshold is an engineering default supported only by the bounded
original VER-C3-FATIGUE-001 comparison, not universal psychological selection.
At workspace40 the existing allocation/maintenance/recall ordering is unchanged.
Inhibit = maintained goal AND spare>=1 AND NOT impaired. The action target is the
existing control/habit target. Fatigue is not a card and changes no capacity,
retained habit, competence, goal, belief, appraisal coefficient or physical body.
Learning140 affects only later control40; current120 never leaks backward.

New-version control view appends [assembled-fatigue-control/0.1, known,
optionalGrade, impaired, priorJournalOrEmpty] to the existing11 fields. Old views
and trace versions remain exact. New control traces use this contract version,
register/read root1351 and disclose the consumed journal. Sensor source truth is
traceable only in physical source/observer transitions; cognitive control reads
only admitted journal. No random draws are added; existing dice remain unchanged.

## Transaction and qualification
One scheduler, RNG ledger, state, trace and save. Source authentication and pending
children must close at the settled instant. Late-stage failure rolls back journal,
control and allocator changes; restore reexecutes identical outputs/state/trace/save.
Fixed M55 scenario and gates are recorded in CURRENT before code. Behavioral gates
first assert maintained goal, spare capacity and offered target. Deterministic
Auto-versus-withhold differences require zero draws, not same-seed pairing.
Original native controls preserve mild/severe, misleading/denied reports and
NoFatigue/AnyFatigue/MotorOnly distinctions. Bounded integration does not establish
natural interoception, endogenous fatigue, whole12.6 coverage or universal resource
reduction. RO008/011/012/013/019/020/021 remain as recorded; no historical verdict
or obligation is closed by this successor.
