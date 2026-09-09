# Campaign 2 power-cycle checkpoint

Paused at the user's request on 2026-09-09. No background work remains running.
Campaign 2 remains OPEN. Resume only after the user returns; no decision is pending.
Changes are saved in the working tree, not committed. Preserve existing staged,
unstaged and untracked work, including work predating this continuation.

## Accepted artifacts

- `../formal/TASK_COGNITIVE_PATH.md` and `TASK_COGNITIVE_SHAPE_MANIFEST.json`:
  task-cognitive-path/0.1-candidate, internally shape accepted. No external review claimed.
- `../formal/TASK_COGNITIVE_PERMANENT_ALLOCATION.md` and allocation table/audit:
  records 377..452, 373/schema2, namespaces 1040..1043 and 1128..1141 frozen.
- `../formal/TASK_COGNITIVE_PLAN_LEAF_ADDITION.md` and allocation table/audit:
  correct-forward singleton `leaf/task-instruction` in existing namespace 1032.
  Base frozen artifacts were not rewritten.
- `../formal/TASK_COGNITIVE_MODEL_PROFILE.md` and
  `campaign2-task-cognitive-model/FREEZE.json`: model/profile frozen with 21 recipes.
  Baseline digest:
  `abe15a4f6bb6ec13a3ccc825dc5e9d755c4444998fa178dbb8683969a1a2a498`.
  This supersedes the earlier ledger statement that model materialization is next.

The new profile alone replaces role 200/9 with execution occurrence namespace 1141;
old generic observation and predecessor models retain their accepted contracts.

## Implementation and bounded evidence

`src/campaign2/cognitiveCodecs.ts` implements structural receiving codecs;
`src/campaign2/cognitiveMath.ts` implements pure coverage, dice compilation,
analytical option probabilities and ordered identity quantization. Neither is a
public cognitive runtime or a claim of whole-seam qualification. Scheduler changes
in this continuation add five failure-code strings only.

- Cognitive codec/math tests: 2 files, 23 tests PASS (9 codec, 14 math).
- `node scripts/compare-cognitive-math-reference.mjs`: PASS, 270 dice cases
  (140 active) and 11 identity histories against actual historical components.
  Receipt: `COGNITIVE_MATH_REFERENCE_COMPARISON_REV1.json` with source fingerprints.
  The comparison script's initial distribution-wrapper access was corrected to
  read the historical `.pmf`; no production fix was needed for this comparison.
- Final `npx tsc -b --pretty false`: PASS.

The comparison uses external component operands, not authenticated public source
occurrences. It does not execute generated choices, RNG integration or persistence.
Reference source was not edited or imported into active source. Full active and
reference suites were not rerun in this continuation. Prior proof packet source
fingerprints must be refreshed where changed shared source affects them; historical
receipts are preserved and are not silently presented as current-source evidence.

## Resume sequence

1. Read repository authority, current decision/seam/verdict ledgers and the frozen
   cognitive profile. Preserve all accepted predecessor commitments.
2. Implement production declarations/model admission from the frozen declaration
   packet, without importing the research builder into active source.
3. Implement restricted live-source capabilities and generated workspace,
   appraisal, concern, motive, candidates, raw reasons and compiled reasons.
4. Integrate resolution reservation, addressed RNG, intent, expression,
   qualification, execution and observer-safe consequence bridges.
5. Integrate prepared phase-140 identity writes and complete rollback proofs.
6. Implement successor ordered input, trace and persistence; qualify PERSIST-I.
7. Execute generated witnesses and adversarial substitutions, refresh applicable
   current-source proofs, run full preservation checks and review whole Campaign 2.

All unexecuted cognitive runtime vectors remain FROZEN, NOT PASSED. General DEC-001
and ORD-001 remain open within their recorded scope; ContextModulating remains a
future source/role obligation. No Campaign 2 completion or new runtime qualification
is inferred from model freeze, codecs, pure mathematics or differential controls.
