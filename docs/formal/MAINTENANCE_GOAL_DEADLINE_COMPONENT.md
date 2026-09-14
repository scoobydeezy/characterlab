# Scheduled maintenance-goal deadline guard

`maintenance-goal-deadline-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required.

An actual previously scheduled deadline remains pending after withdrawal. At exactly
the bound goal's expiry instant, the lifecycle owner validates its complete prior
value. An Open target runs the existing Expire operation. An already Withdrawn target
returns an unchanged candidate and AlreadyWithdrawn diagnostic. It does not create
another lifecycle fact or change ChangedAt. Missing or already Expired targets and
wrong-time invocations reject. The underlying explicit Expire command is unchanged.

The guard creates no identity, queue cancellation, output evidence or psychological
state. Scheduling/adoption association and once-only deadline admission remain runtime
obligations. Its result is a detached candidate, not authority to write. The proposed
public proposal stage must enqueue the future deadline before140; the terminal owner
cannot emit a child. Any failed adoption transaction discards the generated deadline.

The first source schedule excludes simultaneous assessment/lifecycle instants. This
guard does not solve that broader ordering extension or qualify public persistence.
