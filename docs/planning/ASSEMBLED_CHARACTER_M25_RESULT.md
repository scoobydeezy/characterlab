# M25 — incomplete; stopped after repeated startup failure

The proposed change lets one character retain belief and own-interaction histories
for several recognized people, then consume the appropriate history in task appraisal
and contact reasons. The implementation is not qualified. M24 at e038bdae remains
the last accepted result. No M25 behavioral claim or corpus closure is made.

## Scope and attempts

Plan d8e7694c committed the card and person-history0.1 contract before code.
Rules/registry0.26 draft expands the existing810/848 keyed owners, uses the same
recognition path and shared scheduler, and scopes receipt checks by recognized person.
No autonomous partner, new owner, psychology law or runtime was introduced.
Eleven production/test files (cap12), including appraisal.ts added after inspection
found its reason-provenance consumer assumed a single social report.

The fixed coat/plain comparison remains unchanged: two configured people, original
three tasks/actions/calibration, positive cooperative encounters1/2, seeds0-7,
choice3, terminal10, coupled reasons and independently justified conditional ties.
Neither attempted invocation reached the coupling maps or matrix. Both failed during
the first identity-only setup with `Cannot read properties of undefined (reading kind)`.
The scheduler exposes the message rather than the underlying stack. The initially
unknown cause was located by the later owner-authorized diagnostic below.

Attempt1:8.93sec. Before attempt2, corrected a distinct single-report assumption in
jointSignalSupport so task-specific provenance can read the new grouped report.
Attempt2:8.81sec, same startup error. The correction is unverified. Two-attempt stop
rule applied; no third simulation was attempted before the owner authorized the
single diagnostic below. No substitute comparison or tuning run.
Both failures are retained in ASSEMBLED_CHARACTER_M25_CHECKS.txt.

## Validation status

Initial types passed15.16sec before the complete control tests were added.
Checkpoint types and reference boundary passed. Research first failed because the
new CURRENT card omitted its required obligation-count row; restored that unchanged
row and reran research only. Failure retained. Frozen-source/document guards are
recorded in the same log; these cannot establish runtime correctness. The new matrix, all new controls,
unchanged M24 matrix/controls, repeat/restore and late rollback remain UNSATISFIED.
Historical Campaign0-3 control sources are unchanged; no broad controls were rerun.
Timed checks total74.38sec including the approved diagnostic (cap1800), longest20.42sec (cap600).
One raw log and this compact result remain within20 files/5MiB. Baseline21 members,
15 families,132 clauses and RO-C3-014/016 remain unclosed/unchanged.

## Approved diagnostic — cause located, no repair performed

Owner authorized one first-branch/seed0 setup through3,120sec cap. Card5316ffbe
preceded test-only instrumentation. One invocation took9.12sec, rethrew the original
exception and exited1. No coupling maps, second branch or matrix cells executed.
The diagnostic is opt-in (M25_DIAGNOSTIC=1), skipped during ordinary test execution.
Instrumentation logs and rethrows canonical-reader/trace exceptions unchanged.
It did not change production code, inputs, laws, seeds or acceptance criteria.

Captured stack: canonicalData.dataItems -> assembled/execution.ts:208 ->
assembled/runtime.ts:179 traceFactory -> scheduler trace validation. Clock2 remained
committed. The trace writer reads report[6] as one social appraisal and takes its
index3 as history. M25 report[6] is [groupTag,personReport,personReport], whose index3
is undefined. This is a concrete report-format integration defect at the shared
trace boundary, not evidence of a psychological-law conflict. Earlier provenance
repair addressed a different consumer and therefore did not remove this failure.

Recommend a bounded repair of the joint trace reader: collect the observation IDs
from each consumed person report, retain original single-report handling, and check
actual source joins before resuming the fixed M25 matrix/control and M24 regressions.
Stop remains in effect: owner approval covered this diagnostic only. No repair or
further simulation executed. A repair card must address the12-file package budget:
the diagnostic brought the current package to12 files; execution.ts would be an
additional file, so declare a separate bounded repair package rather than exceed it.

Raw stack and outcome are in ASSEMBLED_CHARACTER_M25_CHECKS.txt. Original failures
and historical controls remain unchanged. M25 still has no behavioral qualification.
