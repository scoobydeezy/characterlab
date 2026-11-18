# Current work — M167 verification performance follow-up
User continuation2026-11-18 authorizes the proposed bounded performance repair.
M167 behavior/overlap pass; recovery is still unverified after the600s timeout.
Baseline2c5ae22b; original card39c4ee28, rules/registry0.121, fixtures/laws unchanged.
Prior verification1744.516s is preserved, not reset or renamed as passing.

## Pre-code card
- Outcome: finish actual post-write rollback and public save17/every-boundary
  continuation through5001 within the existing600s command cap.
- First measure: same genuine M167 prefix5, timing settlement, full snapshots,
  whole-object deep equality and exact typed-byte equality on the SAME snapshots.
  This is a diagnostic prefix, not a shortened acceptance comparison.
- Source review found rollback uses generic deep equality on encoded state/output/
  trace arrays, whereas existing exact continuation uses the byte comparator.
  If measured, replace redundant structural traversal with all-field/all-byte
  equality. Keep snapshot shape/clock checks and the existing status normalization.
- Scope: one test file src/test/assembledRehearsal.test.ts; no production, fixture,
  law, schema or clock changes. No framework, new memory work or new source cohort.
- Assert equivalence of the two comparison methods on genuine snapshot bytes and
  altered length/byte/clock controls. All old negative/rollback assertions survive.
- Then run the SAME full boundary167: all scenarios, three prefixes, actual injected
  post-write fault, original save17 and every later state/output/trace/save/identity,
  native late appraisal4000 and complete queue5001. No checkpoint/byte truncation.
- Risks: misdiagnosed cost; weakening rollback equality; timeout elsewhere. Measure
  before repair; retain failures. If cost is elsewhere, report it before broadening.
- Budget: supplemental1800s maximum including diagnostic/failures;600s/command;
  first diagnostic120s; one long job;20 evidence files/5MiB total M167 evidence.
  Keep <=12 total production/test paths across M167; existing8 still suffice.
- Checks: diagnostic/equivalence, full boundary167, types, boundary/research,
  preservation and staged-size. Prior primary/overlap/native158/primary166 receipts
  stand if their code paths/fixtures remain unchanged; no redundant replay.
- Done: full recovery and checks pass, compact M167 result/current updated and
  committed. Otherwise checkpoint incomplete, no automatic extension or repeated
  unchanged retry. No decrease in required scientific/continuation evidence.
Existing ledger dispositions, original controls/contracts and scope21/15/132 stay.
E61/P45/N13/U13;0/15 accepted families. No UI, reduction or autonomous peers.
| Research obligations | **0 active / 18 conditional / 0 unowned** |
