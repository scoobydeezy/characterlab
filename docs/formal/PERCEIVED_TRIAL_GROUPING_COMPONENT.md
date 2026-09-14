# Explicit perceived trial grouping component

2026-09-13. `perceived-trial-grouping-component/0.1-candidate`.
LOCAL DISPOSITION — no owner ruling required. This bounded component consumes existing
SEM-001C observer-relative event-file identity; it allocates no TrialId.

Input is an admitted context reference or absent context, plus at most12 role-bearing
observer-safe experience projections. The trusted source adapter labels the before,
motion and after observation roles; these labels are not stroke/control or causal
roles. Public authentication of these projections is still required. This component
does not grant an arbitrary caller permission to label experience or add event IDs.

Validate each supplied experience with the existing semantic assembler, exact observer
agreement and unique experience occurrence. Absent context yields Unavailable/
MissingContext. With context, select only experiences explicitly containing that same
observer/event-file reference. Require exactly one of each Before, Motion and After.
A missing role yields Unavailable/IncompleteContext; multiple matching experiences
for a role yield Unavailable/AmbiguousRole. Never select by array or ordinal order.
Require Before.time<=Motion.time<After.time. Invalid ordering rejects; no inferred
temporal segmentation repairs it. Distinct occurrences are required even when times
coincide. A future source may use richer observation roles under its own contract.

Return only the context reference and existing experience IDs assigned to each role.
No payload archive, numeric sample resolver, causal conclusion, target address or
significance is returned. Nonmatching context data cannot fill missing roles. Permuting
the carrier does not affect grouping. Context loss can remove grouping without any
change to hidden source scheduling. The grouping model does not inspect hidden truth.

This is structural/semantic projection composition, not public source qualification.
An actual perceived neutral cue must create/continue/end the event-file through
perception authority; retained context/evidence access, cross-modal carriage,
focal hypothesis binding, public schemas, persistence and corpus remain open.
