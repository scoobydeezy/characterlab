# Bodily maintenance goal lifecycle component

2026-09-12. `bodily-maintenance-goal-component/0.1-candidate`.
Primary-agent component shape acceptance under autonomous authorization implements
the user's adopted-goal ruling. No public schema, source or allocation is accepted.

A trusted goal-owner coordinator holds at most sixteen goals. Each has a qualified
character, goal and observer-side signal identity (bounded NFC symbols only in this
component), a desired exact closed interval, adoption instant, active-from instant,
expiry instant and status Open, Withdrawn or Expired. Open includes pending activation.
Require 0<=AdoptedAt<=ActiveFrom<ExpiresAt and desired interval contained in the
explicit signal domain supplied by the trusted model. No universal bodily scale is
invented. Symbols are not production identity namespaces.

Adopt adds a unique character/goal key, never replacing an old goal. Withdraw and
Expire operate only on that character's existing Open goal. Withdrawal requires
AdoptedAt<=now<ExpiresAt. Expire requires now=ExpiresAt and records a terminal event.
No observation or satisfaction operation changes lifecycle state. Revision/adoption
after withdrawal requires a separately admitted goal identity; no in-place rewrite.

Read at consequence time returns a detached Active concern only when Open and
ActiveFrom<=now<ExpiresAt. Absent, pending, withdrawn and expired concerns produce
Unavailable with a distinct reason, never a numeric zero. An Open goal at/past its
expiry is a lifecycle ordering error, not silently derived Expired state. The trusted
runtime must execute the explicit expiry event before an assessment at that instant.
Past-time reads before an already recorded state change reject rather than recovering
historical concern from current state. Committed assessments must retain their actual
immutable concern basis; this component is not a time-travel state archive.

The pure component returns candidate states. Public subject binding, actual adoption/
withdrawal provenance, ownership, scheduled expiry identity, rollback and save/load
remain unqualified. The trusted model's signal domain is not a raw physiology resolver.
No Need, preference, pressure, TaskConcern, REG relation, importance score or persistent
satisfaction flag exists. Active satisfaction/violation will be separately assessed.
