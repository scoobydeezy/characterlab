# Public wrapper publication — public-wrapper-quiescence/0.1-candidate

LOCAL DISPOSITION; protocol enforcement beneath the existing native seam contracts.
No character state, mathematical law, allocation, ModelIdentity, RunIdentity, trace,
or save schema changes. The existing identity-belief wrapper barrier is the control.

A native operation includes scheduler settlement and the wrapper's continuation
ledger commit and cleanup. If a public value depends on both, reads must reject
until both are committed. A concurrent settlement must reject before touching the
active operation's ingress, provisional state, or cleanup. A rejected second caller
must not release the first caller's barrier. Failure releases the wrapper barrier
for diagnostics and rolled-back snapshots; the failed scheduler still forbids saves.

Selected enforcement: a run-local boolean barrier around the whole asynchronous
operation, with rejection before entry and release in finally. The guarded methods
are settlement, snapshot and save. Public observer views of these profiles derive
from guarded snapshots. Immutable model/run identities and failure diagnostics are
not continuation snapshots. No callbacks are added to production public factories.

Affected profiles: identity-public/0.1-candidate (Task and Biological),
biology-public/0.1-candidate, and the existing embodied native runtime. These retain
their original exact domains and canonical mathematics. Generalized system-wide
locking or a scheduler redesign is not implied.

Independent defenses remain valid: CognitiveRandomSession denies access to its
continuation ledger while live; scheduler-only snapshots contain one committed
transaction; scheduler adaptation hooks commit and close before the scheduler
releases its own barrier. Constant continuation metadata introduces no second
publication authority. A serially identical save is insufficient evidence of these
properties: audit the reachable mutable fields and probe the actual commit window.

Qualification must preserve the pre-repair sources and failures; prove rejection at
the exposed boundary, concurrent-call isolation, and failure cleanup; and compare
ordinary model/run identities, complete-prefix saves and continuations with the
prior cohort. Test-only instrumentation schedules a read at before-commit. A
separate concurrency adversary attempts a second settlement at that boundary.
Neither instrument becomes a character-side input or production public capability.
