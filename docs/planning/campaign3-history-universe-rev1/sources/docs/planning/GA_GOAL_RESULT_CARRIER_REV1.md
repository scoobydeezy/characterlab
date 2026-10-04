# Goal and attribution result carrier — revision 1

2026-09-13. LOCAL DISPOSITION — no owner ruling required. Symbolic field inventory,
not whole public acceptance, numeric allocation or activation.

Consumes the goal/result identity review and qualification-carry revision2. The
selected representation preserves maintenance concern, assessment, attribution and
memory-owner credit as separate operations. Recomputing qualification from the later
goal remains a named control; copying the numerical appraisal into the delivery is
rejected because it can reconstruct forgotten evidence.

## State and source

MaintenanceGoalKey contains Character and GoalReferent. MaintenanceGoalSpec contains
Definition, Key, Signal, Desired, ActiveFrom and ExpiresAt. The immutable model owns
specifications; the adopted goal state contains Spec, AdoptedAt, Status and ChangedAt.
Spec resolves only the exact admitted goal definition. No mutable desired-range copy,
replacement baseline or completion flag is introduced. The owner expands the exact
specification when invoking the existing goal component. Its state retains withdrawn
and expired entries so adoption cannot replay the same key. The ledger is bounded at
16 entries, sorted by canonical key, with no duplicate key or definition-to-key alias.

Adoption and withdrawal source commands name the declared definition. Adoption is
still an explicit committed original; declaration is not adoption. Expiry is generated
from that actual adoption with the exact model deadline, not from a subsequent read.
All subject identities come from accepted projection, checked against the spec key.
The first profile excludes goal reads at the exact expiry instant as recorded in the
identity review. Already withdrawn expiry is an explicit terminal no-op.

## Assessment versus carry

GoalOutcomeAssessment owns one new symbolic GoalOutcomeAssessmentId, Observer, Goal,
Consequence, At, TransformationVersion, Assessment and Qualification. Assessment is a
closed union: unavailable with exact cause, or assessed with before/after distance,
position, relation and boundary. This complete record is trace-side audit output.
Its numerical fields do not enter the delayed character input or a cognitive archive.
Desired range resolves through the immutable goal definition for auditing; the carry
does not include that definition or grant its recipient a new lookup capability.

Qualification is the exact union produced by the projection component. The record
validator checks it against the actual assessment and the exact admitted intact or
deterioration-only law. Having the correct enum independently is insufficient.
Unavailable assessments retain the requested Goal key but do not invent an active goal.

GoalQualificationCarry contains Assessment identity, Observer, Goal, Consequence,
AssessedAt, Qualification and TransformationVersion only. TargetOriginal and DueAt
belong to a separate runtime delivery envelope. Original address is existing ordered
input/scheduler association data, not a new occurrence family. Exact envelope binding
must be checked before releasing the carry to any character transformation.

## Attribution and credit

RetainedChildAddress is an acquisition plus a closed kind-specific child key: perceived
continuant for EventContinuant, safe signal for BodySignal. It contains no payload or
resolver. A view address adds only a bounded view ordinal to that existing child.
These are addresses, not new occurrence identities. Canonical ordering and uniqueness
must compare encoded typed values, never displayed text or numeric ordinal alone.

RetainedAttributionResult owns one new symbolic RetainedAttributionResultId, Observer,
Character, Consequence, At, TransformationVersion, Disposition, Consumed and Targets.
Consumed is a unique set of addresses actually semantically read, not all validated
or admitted addresses. With four trials and before/start/end/after operands, the first
profile permits at most16 unique consumed children. Early Unavailable can consume none
or a proper subset; eager domain validation never earns use. Targets is either empty
for Unavailable or the single prebound surviving focal event child for Supported.
Supported requires that target be among consumed addresses, formed before consequence,
and part of the computed focal stroke trial. Body operands can earn use but cannot
become the focal motion target by namespace or ordering coincidence.

The joined significance command names the two actual completed results and includes
their narrow admitted values. It is not an independent learning-evidence occurrence.
The adapter authenticates both outputs and the exact expected join input; the memory
owner checks current target survival and writes only use/directional metadata. No
full appraisal or retained operand payload appears in the joined command.

## Scope and remaining gates

The companion machine inventory closes these proposed fields only. Existing external
types retain their own contracts; new names remain symbolic. Structural fault checks
cannot prove producer authenticity, identity roles, output slots, work accounting,
public codec admission, exact registered ReadDomains, owner arbitration or persistence.
Those remain OPEN, as do full source/profile and ordinary memory registration closure.
MEC-007 and MEC-010 retain their ledger controls; this representation earns no reduction.

Reopen only if a required phenomenon needs a different goal lifecycle, multiple focal
targets, retrospective reappraisal or additional epistemic access. First-profile finite
bounds and serialization do not require an owner ruling under the escalation policy.
