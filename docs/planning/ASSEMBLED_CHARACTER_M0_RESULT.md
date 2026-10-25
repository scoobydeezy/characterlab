# M0 result — setup complete, owner review pending

2026-10-25. No simulation feature added. The existing Campaign 2 scaffold and
separate Campaign 3 models remain; unifying them is still the work ahead.

## Preserved and prepared

- Local preservation tag: archive/workbench-stopped-2026-10-25.
- Preservation commit: a2f801146729acb218f245042d103f65170615cf.
- Original checkout/branch retained; nothing pushed or deleted.
- New branch: codex/assembled-character in the managed assembled-character worktree.
- Base: 788e1a89ce44ffe9f8c2b56d9078ee1b6b44d535 (immediately before UI work).
- Transferred planning/routing, the exact two SEM test files from 40954e3c,
  and the Affect diagnostic finding with its existing RO-C3-011 linkage from daed2238.
- No Workbench screens, catalogs, audit scripts, copied source bundles or archived
  routing logs imported. Historical evidence remains reachable on the preservation tag.
- No old jobs or browser sessions resumed, stopped, or assumed live from old IDs.

The untracked keyboard receipt claims a bounded completed ADAPT keyboard pass;
the native receipt claims full V10 native execution (1068 roles / 7284 prefixes).
M0 inspected and preserved them; it did NOT revalidate or promote these claims.
Their exact original bytes were compared to the committed Git blobs:

| Original artifact (on preservation tag) | Bytes | SHA-256 |
|---|---:|---|
| docs/planning/workbench-batch-keyboard-rev1/browser.json | 139620 | e941e96df076d59fd424721f72c9ba0a4f98ffbe89d7286d6b9311ef99f64c3c |
| docs/planning/workbench-batch-keyboard-rev1/disclosures.png | 136678 | ad37226df9144f89bc972c18af861147fabd57bd54383c982b0929bfd48b6cda |
| docs/planning/workbench-batch-keyboard-rev1/receipt.json | 923 | c82cb70fe84541223af249803b63773a049d361eaf5ba354a88770fc50db6845 |
| docs/planning/workbench-batch-keyboard-rev1/verifier.mjs | 2378 | 88ce9bf27a56e7215a204c59dd009842db774772eb2b1fb0fd3afcd268281f3c |
| docs/planning/workbench-batch-parity-rev10/receipt.json | 21069629 | 0bcc06fb97be8f8f4cb4dc538784e82ef9384ed2915b3ff5801fe707ee84432c |
| scripts/check-workbench-batch-keyboard.mjs | 2378 | 88ce9bf27a56e7215a204c59dd009842db774772eb2b1fb0fd3afcd268281f3c |

## Validation and limitations

- Evidence restore: three existing archived files restored with original hashes;
  these are baseline research artifacts, not new M0 evidence.
- Corrected SEM suites: 2 files / 11 tests PASS (Vitest reported 1.22 seconds).
- Existing reference boundary check PASS.
- Research check PASS: 0 active / 18 conditional / 4 closed / 0 unowned;
  103 checked Campaign 3 verdict headings / 4318 reports. Historical baseline's
  109 total verdict inventory has a different scope and was not changed.
- First research check failed: CURRENT obligation counts are stale. Counts were
  correct, but prose lacked the exact table row required by the checker. Restored
  that row and reran successfully; no checker or obligation semantics changed.
- Eight pinned source Git-blob/SHA-256 pairs match; six simulation/formal trees
  match the base and have no working-tree modifications. Both SEM carried files
  match their named correction commit exactly.
- Obligation delta affects only RO-C3-011 plus its one report-review linkage;
  all existing verdict reviews and report reviews preserved.
- Document limits: AGENTS 93/120, CURRENT 48/80, work order 191/250 lines.
- No full corpus, browser run or M1 execution performed. One compact new result;
  no new raw-evidence bundle. Checks finished within the 10-minute per-check budget.
- Existing local node_modules reused by an untracked junction; no dependency or
  lockfile changes. Worktree setup initially needed filesystem escalation for Git;
  elevated local operations succeeded without changing repository permissions.

## Decision presented

Review [the pinned baseline](ASSEMBLED_CHARACTER_BASELINE.json) (21 members,
15 families, 132 clauses) and [the M1 comparison](ASSEMBLED_CHARACTER_M1_COMPARISON.md).
The latter freezes three exact Campaign 2 controls, full byte comparisons, repeat
and restore checks, four production/test files maximum and a 30-minute check budget.
It makes no Campaign 3 coverage or arbitrary-configuration claim. Both remain required
for eventual assembly. No reference law has been selected.

M0's review package is complete; owner confirmation remains pending. M1 implementation
has not begun. This stop is required by the work order's M0 gate, not a request for
per-file approval. M2 reconciliation and its one review still precede broad integration.
