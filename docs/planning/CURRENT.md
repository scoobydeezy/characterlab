# Current work — bounded verification performance (2026-11-04)

M52 is complete at f4069c29. Owner authorized a verification-performance pass.
This package adds no psychological capability and does not start memory breadth.
One runtime/state/scheduler; accepted assembled-character-model/0.1-candidate
persistence semantics and all historical fixtures/assertions stay fixed.

## Scope and comparison
- Measure the unchanged M52 continuation case (save17, restore, both through33).
- Use Node CPU samples at10ms, one Vitest fork, one job. Retain compressed raw
  profiles and a concise measured summary; no benchmark framework.
- Optimize measured redundant observation/serialization in assembled code only.
  Candidate: restore serializes the whole snapshot just to count committed events.
- At most4 production/test files: character.ts, runtime.ts only if needed,
  and up to2 focused performance/regression test helpers. Frozen sources unchanged.
- No new cache of mutable authoritative values, weaker equality, omitted validation,
  new save format, law/seed/input changes, or checkpoint truncation.
- Preserve complete-prefix restore, commitment binding, atomic instants and full
  canonical save equality. Read REFERENCE_MECHANISM_LEDGER SUB-008/CTL-005; this is
  execution-cost work, not a mechanism reduction or research-obligation closure.

## Checks and budgets declared before code
- Baseline: unchanged M52 continuation with CPU profile, <=600s.
- After: same case/same profiler settings, <=600s; then stop profiling.
- Focused small-case comparison against the old restore algorithm, including
  full-byte snapshot/save/continuation and corrupt/incomplete save rejection;
  targeted existing admission restore/rollback controls, <=180s together.
- Because the successor public entry changes: retain the three original Campaign2
  semantic-boundary controls in assembledAdmission, <=300s.
- Types, boundaries, research, preservation, staged size/whitespace: <=60s.
- Total verification <=1800s INCLUDING failures; one command <=600s.
  Planned successful checks target<=1200s after optimization; reserve repairs.
  If projected work cannot fit, checkpoint/replan BEFORE another long run.
- Evidence <=20files/5MiB losslessly compressed, no recursive source copies.
  AGENTS<=120lines, CURRENT<=80, work order/register<=250; register<=65536bytes.

## Done condition
Measured lower cost on the same M52 case, exact persistence and rejection behavior
preserved, required checks pass inside the package budget. If no safe material
improvement is measured, report that rather than expanding scope or weakening gates.
Record actual timing limits; a bounded result does not prove every future suite fits.
Next capability remains significant recall affecting appraisal/choice, separately
predeclared with current-goal/body/evidence/dice controls. No implementation yet.
All21 members/15 families/132 clauses and18 conditional obligations stay open.
