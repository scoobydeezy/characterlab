# Longitudinal goal frozen execution checkpoint — 2026-10-03

LOCAL DISPOSITION; execution IN PROGRESS, no qualification or owner ruling.
Counters **1508 /0**. Start LONGITUDINAL_GOAL_PLAN_REV1.json and the execution log.

Five prospectively frozen model configurations cover120 distinct RunIdentities:
all8 seeds x3 goal lifecycles x4 receiver candidates under episode expiry, plus
FineStanding xall8 seeds x3 lifecycles under KeepAll. All2040 joined prefixes and
immediate successors are mandatory:1920 advancing/120 terminal. The original
implementation, contract, preserved coarse failure and model dependencies are bound
by content hashes. No original model or source bytes changed in this increment.

At the immutable capture, **20 complete trajectories** have passed and supplied
340 captured prefix hashes; **zero new restored-prefix checks** had yet completed.
There are12 matched goal-lifecycle pairs with all17 native source hashes equal.
Captured hashes are not replay evidence. See LONGITUDINAL_GOAL_EXECUTION_CHECKPOINT_REV1.json;
ongoing work may be ahead of that historical count. No selection or all-seed verdict.

Seed4/5 coarse maintained source histories cancel to zero; other initial seeds carry
positive or negative standing. This differs from nonzero standing whose coarse receiver
has zero effective modifier. Preserve both distinctions in the eventual comparison.
The all-seed fine/NoFeedback results must be measured, not inferred from seed0.

## Running computation and safe resumption

The current trajectory command is `node scripts/qualify-longitudinal-goal.mjs`.
Its tool session is86267. A sequential continuation is already running in session36191
under `scripts/continue-longitudinal-goal-matrix.mjs`. **Do not launch another worker
pass while either is active.** Poll these sessions or inspect
LONGITUDINAL_GOAL_EXECUTION_PROGRESS.log before continuing. The continuation waits for
all120 immutable trajectory rows, verifies/records the trajectory comparison, runs
`node scripts/qualify-longitudinal-goal.mjs --replay`, then verifies/records the complete
matrix. It does not issue a verdict or promote a Brief clause automatically.

The native full-save workload is substantially slower than the previous pure component
matrices. Four independent execution workers retain compressed original prefix saves
and per-run receipts in longitudinal-goal-execution-rev1. Each successful restored
prefix gets its own immutable receipt. Existing receipts are authenticated against
plan/run/source hashes before reuse. If processes stop, retain all bytes; inspect the
log and failure before resuming the missing phase. Do not overwrite an existing result
or run two copies of the same phase. A failure after archive publication but before its
row receipt requires preserving that orphan and investigating before retry.

When trajectories are all present, `check-longitudinal-goal-matrix.mjs --trajectories`
checks source-save invariance across law/goal, retained/expired episode contrasts,
current goal statuses, original standing, coarse/fine/NoFeedback probabilities and
actual action sequences. Without `--trajectories`, the checker requires all2040 replay
receipts. Complete matrix output is LONGITUDINAL_GOAL_MATRIX_REV1.json; read it and
assign a bounded scientific verdict only after all gates pass.

Prior8 focused/328 reference tests/build were reverified by hash/receipt, not freshly
rerun. New work changes harnesses and documentation only. Native source plus component
receiving scope remains; no joined native scheduler, public admission or new allocation.
Next: finish execution, review every seed/equality and preserved failure, then decide
Brief12.15-6. Routine/habit/loss and affect dimensionality remain separate partials.
RO009/012/013/014/017/019/020/021 carry this work; no status change. AuditREV103 remains
127 bounded/5 partial/0 blocked,101 verdicts. RO019 ACTIVE;RO021 unsatisfied;RO022 CLOSED.
Corpus0.29.0/21,wrapper54/57 unchanged. Campaign3 NOT EXIT-READY.
