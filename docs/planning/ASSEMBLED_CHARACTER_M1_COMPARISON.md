# M1 comparison — proposed for the M0 review

2026-10-25. Written before shell implementation or execution. This is a bounded
scaffold milestone, not a new psychological qualification or assembled-character pass.

## Purpose and limit

Expose one headless entry into the existing Campaign 2 composed character: prepare,
start, settle, inspect, save and restore. Reuse cognitiveFactory/cognitiveRuntime;
there is one authoritative state, scheduler and trace behind that entry. Do not fan
out to Campaign 3 runtimes, add a profile registry, copy a runtime, or invent new math.
A thin entry is sufficient for M1; it supplies no new psychological capability.
The actual integration starts after the M2 reconciliation review.

M1 leaves the frozen Campaign 2 admission contract intact. Its 21-model restriction
is a known temporary limit, not satisfaction of the work order's arbitrary-valid-
configuration requirement. Removing that restriction requires a versioned successor
contract before implementation. Do not enlarge its allowlist as an assembly solution.

## Exact controls and correspondence

Source commit: 788e1a89ce44ffe9f8c2b56d9078ee1b6b44d535.
Control API: src/campaign2/cognitiveFactory.ts: prepareCognitiveModel,
createCognitiveRun, cognitiveModelIdentity, restoreCognitiveRun.
Fixture definitions: src/test/campaign2CognitiveFactory.test.ts, Git blob c544354e930431bcd2878e0b9c971720aa9c7b5e.
Use its existing source(), data(), deadlineSource() and equalCriteriaSource() exactly.
If extracted into a shared test helper, preserve their generated canonical bytes;
leave all existing control assertions intact. Do not replace them with authored outputs.

| Case | Source and input | Why included |
|---|---|---|
| Baseline | source(), data() | Existing experience-to-choice/execution/learning scaffold |
| Deadline overlap | deadlineSource(), data() | Atomic common-instant work and lifecycle ordering |
| Equal criteria | equalCriteriaSource(), data() | Actual RNG draws despite absent retained identity contribution |

All three use data()'s exact 32 zero bytes as seed. S0 retains its exact observer,
regulatory state -50, two task adoptions and instructions. Original input instants
are 1,2,3,4,5,6, with probes at 1 and 5 and deliberation at 2,3,4,6. Let the runtime
settle its generated events/deadlines to exhaustion; do not truncate at instant 6.
Safety cap: 32 successful settle calls per run; hitting it is incomplete/failure,
not permission to shorten the comparator. No seed or input difference is intended.

Model/record/path correspondence is identity: same model bytes, state schemas,
semantic bundle and addressed RNG implementation. Compare actual recorded addresses
and outcomes through full trace bytes; same seed alone is not the coupling argument.

At initial state and after every settled instant compare control versus new entry:
- Model identity and run identity: exact bytes.
- Clock, status, complete canonical state, outputs and trace: exact values/bytes.
- Complete canonical save and diagnostic presence/bytes: exact equality.
- Settle success/exhaustion and terminal no-op: equal behavior and unchanged save.

These are deliberately full-byte comparisons because M1 changes neither model nor
serialization. They include reasons, uncertainty, expression, observer evidence,
learning records and mutation order; final chosen action alone cannot pass.
Later integrations must declare their changed semantic projections before execution.

## Determinism, persistence and negative controls

For each of the three cases, run an independent repeat through the new entry and
compare at the same boundaries. Save after two successful instants (including genuine
choice/draws), restore through the new entry, compare that save and every subsequent
continuation to the uninterrupted control through exhaustion. Also restore that save
through the original control: no new persistence envelope or version is warranted.

Retain the existing factory suite unchanged in meaning: data-only boundary, wrong
model handle, immutable copied input, 27/26 atomic capacity boundary, whole-save
corruption, changed input/seed/root/instruction/draw rejection, rollback after a real
draw, and common-stage membership validation before prior reads. Add just two entry
negative checks: extra executable input rejected and changed original inputs rejected
on restore. They catch accidental boundary loosening by the new facade.

## Contracts, controls and coverage

Implement task-cognitive-path/0.1-candidate and task-cognitive-model-profile/0.1-candidate;
retain the input/trace/persistence versions in campaign2-task-cognitive-model/FREEZE.json.
TASK_COGNITIVE_PATH.md and TASK_COGNITIVE_MODEL_PROFILE.md govern exact bindings;
CAMPAIGN2_COGNITIVE_QUALIFICATION.md and CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md
supply the later bounded runtime disposition. No accepted formal source changes in M1.
REFERENCE_MECHANISM_LEDGER.md (in this directory) applies: SUB-004/007/008 and
MEC-013..019 remain reused mechanisms/controls; no retirement or new necessity claim.

Baseline scope: the pinned Campaign 2 completion review is the scaffold control.
This milestone discharges NONE of the 21 Campaign 3 member mappings or 132 family
clauses. Those remain pending, with exact affected mappings required before integration.
The RO-C3-011 diagnostic finding remains open in its existing conditional scope.

## File/check budget and binary completion

Proposed maximum: four production/test files: src/assembled/character.ts,
src/test/assembledCharacter.test.ts, src/test/fixtures/campaign2Cognitive.ts, and
src/test/campaign2CognitiveFactory.test.ts (helper extraction only). No extra framework.
Planning updates: CURRENT.md and one compact result. New evidence <=20 files / 5 MiB;
prefer test output plus source references and no serialized corpus copies.

Run one validation job at a time, each command <=10 minutes, total <=30 minutes:
1. node node_modules/vitest/vitest.mjs run src/test/campaign2CognitiveFactory.test.ts
   src/test/assembledCharacter.test.ts (one command): equivalence, determinism,
   persistence and the boundary failures named above.
2. node node_modules/typescript/bin/tsc -b --pretty false: type/interface integration (no browser/build artifact required).
3. npm run check:boundaries and npm run check:research: architecture isolation and
   obligation accounting; neither substitutes for the functional comparison.
4. Stage intended files, npm run check:git-size, then commit.

Done only when all three cases match at every declared boundary, continuation and
negative controls pass, the single-runtime structure is confirmed, and required checks
pass within budget. Report the scaffold's existing behavior and remaining assembly
scope. Stop M1 verification on pass; proceed only to the M2 table, not broad integration.
Any discrepancy is a defect to investigate; no interaction exception is expected in M1.
