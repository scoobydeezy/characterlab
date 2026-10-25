# Current work — assembled character preparation

2026-10-25. The Workbench is stopped. We have separate integrated research models,
not the complete assembled character. This preparation establishes the working order;
no new simulation capability or assembly acceptance is claimed.

Read [the work order](ASSEMBLED_CHARACTER_WORK_ORDER.md) and
[the pinned baseline](ASSEMBLED_CHARACTER_BASELINE.json).

## State

- Current branch: `codex/observability-workbench`; no checkout switch performed.
- Reviewed Workbench commit: `46e0017a7bc39b05a2ce977036615bd164804d58`.
- Assembly starting commit: `788e1a89ce44ffe9f8c2b56d9078ee1b6b44d535`.
- Baseline extracted: corpus 0.29.0, 21 members / 219 member requirement records,
  15 families / 132 clauses. These are overlapping indexes, not 351 unique phenomena.
- Exact control/fixture-to-assembly mappings remain to be resolved before each
  affected milestone; the pin does not pretend that mapping is complete.
- Owner review of this concrete baseline and the M1 comparison is the M0 stop.
- No reference law selected; no Campaign 3 verdict or conditional debt changed.

| Item | Current disposition |
|---|---|
| Research obligations | **0 active / 18 conditional / 0 unowned** |
| Closed obligations | 4; historical scoped closures preserved |
| UI and Campaign 4 | Deferred; no automatic transition |
| Prior Workbench runs | Not resumed; live status not inspected; no terminal acceptance inferred |

## Next requested task: M0 only

Preserve the current line (including inspected untracked receipts), create the separate
assembly checkout, transfer the planning package and two carry-forwards, and write the
M1 comparison. Present the baseline and comparison for the one required M0 owner review.
Do not start simulation implementation before that review.

M0 card:
- Capability: reproducible clean starting checkout and an explicit shell comparison.
- Source scope: no production simulation edits; two carried test files only.
- Planning scope: this order, baseline, CURRENT, trimmed AGENTS, Campaign Plan routing,
  Affect known-defect note/RO-C3-011 linkage, and one M1 comparison document.
- Checks: preserve exact source references; verify carry-forward diff; run corrected
  SEM tests and existing research/boundary checks. No full corpus/browser run.
- Budget: one validation job; 10 minutes per check before checkpoint/investigation;
  <=20 new evidence files / 5 MiB. No source/build copies. Budget exhaustion is incomplete.
- Done: preserved local ref, separate checkout at the named base plus intended changes,
  baseline/comparison presented. Stop for owner review; do not auto-advance.

## Carry forward / leave behind

Carry the two SEM test changes from `40954e3c` and the Affect diagnostic carry defect
plus its RO-C3-011 linkage from `daed2238`. Preserve old evidence on the old branch.
No Workbench UI code, catalogs or audit machinery comes across.
Known untracked paths to inspect/preserve before switching:
`workbench-batch-keyboard-rev1/`, `workbench-batch-parity-rev10/receipt.json`
(both under docs/planning), and `scripts/check-workbench-batch-keyboard.mjs`.

Prior AGENTS/CURRENT bytes are archived under
[archive/2026-10-25-workbench-routing/](archive/2026-10-25-workbench-routing/).
Archive contents are historical, never current instructions.
