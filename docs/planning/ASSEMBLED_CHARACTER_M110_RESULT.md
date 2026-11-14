# M110 — admission repaired; full biography verification incomplete

Candidate0.87 admits the complete19-opportunity biography calendar. Its four
context/reading families now allow up to100 distinct instants, while older versions
retain16. This repair passes admission and old-version compatibility checks.
M110 remains incomplete: both full-history/continuation attempts hit570 seconds
without a completion receipt. No native biography or continuation pass is claimed.

Original plan df526263; checkpoint5a929088 preserves the initial admission failure.
Owner approved the versioned widening; contract/plan2fc00a27 preceded production code.
[All attempts](ASSEMBLED_CHARACTER_M110_CHECKS.txt); [receipt status](ASSEMBLED_CHARACTER_M110_RECEIPTS.json).

## Implemented foundation

OPPORTUNITY_CONTEXT_ADMISSION0.1/rules-registry0.87 changes identity context,
self context, Values context and reason readings from16 to100 events each.
The bound follows existing distinct integer instants1..100; it is not a fixture list.
Identity/self/Values remain mandatory once per deliberation. Reason readings remain
optional. All existing phase, payload, source, dependency and cross-field checks apply.
The global original-input count/exclusivity rule remains unchanged.

Only model.ts, inputs.ts and traceBinding.ts change in production. The same model
composition, state owners, scheduler, RNG ledger and save path remain. Learned
identity/formation/self stores retain16 accepted entries; other capacities stay fixed.
Admission of100 opportunities does not establish100 learned updates or runtime steps.
Reference0.85 remains adopted;0.87 is a candidate, not a promoted reference.

## Admission and compatibility — PASS

- Original M11019-opportunity input admits on0.87.
- Synthetic100-opportunity input admits on0.87; each affected family's101st row rejects.
-0.86 accepts16 and rejects19; mixed rules/registry versions reject.
- Duplicate and out-of-range rows reject in all four families; missing mandatory
  identity/self/Values contexts reject.
- Existing0.85 full-calendar save matches all2,347,200 preserved bytes after the
  production changes, using the unchanged M109 pre-edit control and test.

The first attempt at M110 failed before simulation because19 identity contexts
exceeded16. I missed that explicit cap in preflight. Source diagnosis identified
all four affected caps together; the original failure remains in the log.
The first new boundary test inherited diagnostic probe13 into its synthetic1..N
calendar, violating unchanged original-instant exclusivity. Removing that optional
probe only from the synthetic boundary fixture repaired the test; the original
M110 calendar, laws and gates were untouched. Both attempts are preserved.

## Native comparison — incomplete, no replacement

The original scenario and gates are unchanged except the approved model version:
sixteen learning opportunities and three probes at8+2i; deadline60; body30/cap100/
rate10 and delivery90@9; original samples, nonsocial tasks, A13/20 B3/5, urgency1
then A5/6 at46, readings0, balanced evidence, Values unlinked, execution and outcome
reports blocked. Significance1 on learning,0 on probes; no learned initial state.

Both arms have global seed0. Early key labels6/0 differ; subsequent keys share the
original contrary/probe labels. These labels do not route seeds or reproduce the
old natural candidates. No key/seed search, selected winner or rebinding was used.
Original per-step seed routing/nondecision254, unit1 then1/16 and old fold remain
controls; native fixed unit1/4 and D3 remain explicit differences. The actual
four-positive/twelve-contrary witness is still required and has not been established.

The arm6 test includes the full calendar and independent restore from the first
nonlearning probe, comparing every later state/output/trace/save/identity byte.
It timed out after570.125s. Review found repeated full snapshot encodings merely
to read the clock and inspect the already-captured settlement. The test now reuses
that immutable snapshot; every substantive assertion and checkpoint remains.
The repaired attempt also timed out after570.124s. This change did not establish
a completed comparison or a measured speedup. No third attempt followed.
No completed native receipt was produced. Arm0 and the paired-receipt gate were
not run on absent data; full native alternatives also remain pending.

## Next bounded step

Profile this exact continuation test before another acceptance attempt. Separate
time spent in fixture construction, native settlement, snapshot/save encoding and
assertions; retain the same inputs and gates. Use measured evidence to select a
repair and forecast a run within the command limit. Do not grant routine time
extensions, truncate the calendar, weaken byte comparisons or add mechanisms.

## Preservation and checkpoint

Five production/test paths; one new contract; three evidence files under5MiB.
Historical C0-C3 sources, controls, prior contracts and learned-state owners remain
unchanged. Source preservation checks confirm the M110 fixture differs only in
model version and the native gates only in documented snapshot reuse. The broad
historical dependency suite is unaffected; the assembled0.85 save was actually checked.
Types, boundaries, research metadata, preservation/document/evidence caps, staged
Git-size and whitespace pass. These are checkpoint checks, not M110 completion.

C-BIO stays UNRESOLVED. Final21 members/15 families/132 clauses,5 mapped/0 families,
E43/P57/N17/U15 and obligation statuses remain unchanged. No reduction, new verdict,
UI or multi-character work. Timeout evidence and all earlier failures remain.
Charged1577.480s/1800s (26.29 minutes), including all earlier attempts,
both570-second timeouts and15s bookkeeping.
No budget reset or extension. Stop native retries at this incomplete checkpoint.


## Owner-approved diagnostic — 2026-11-14

Plan9a5b9abd uses the remaining original budget: one arm6 diagnostic, unchanged
scenario/keys/seed/assertions, phase marks and V8 sampling10ms. It is not an
acceptance retry. The120s soft stop is checked only at phase boundaries; the160s
hard cap terminated the process while the combined save18/restore/exact phase
was still running. The CPU profile could not flush, so there is NO saved CPU
sample or function-level attribution. Complete emitted phase timings remain in
the existing log; actual evidence remains three files, not the planned maximum4.
The instrumented test remains opt-in through M110_PROFILE=1; normal gates remain.

| Measured region through first probe18 | Seconds |
|---|---:|
| Fixture construction |53.927|
| Prepare/create/advance to9 |10.031|
| Five advance calls10..18, including helper snapshots |29.549|
| Inspection/refold |10.676|
| Draw receipt extraction |8.921|
| Formation/qualification/probe/immutability checks combined |0.267|

Inspection plus draw extraction rises from1.490s at10 to6.326s at18. Source
inspection confirms outputs() decodes the complete supplied byte stream each call;
StandingSources.capture separately decodes the whole trace, and the draw extractor
calls outputs(trace). Repeated full-trace decoding is therefore a concrete growing
cost to target. Timings do not isolate decoder CPU from all work in those regions.
The near-zero cached snapshot lookup does not show that encoding is free: advance
already invokes snapshots. This prefix is not a late-run CPU or save/restore profile.
The last completed boundary was113.374s; save18/restore/exact did not complete before
the watchdog. Its individual subcosts and all later continuation costs remain unknown.

Next repair: reuse decoded read-only state/output/trace views per immutable snapshot
in the M110 diagnostic path, keeping every original gate and canonical byte check.
Separate save, restore and equality timings before another full attempt. Preserve
all timeouts. No claim that this alone brings the full run under570s; measure first.
No production change, extra acceptance run, source-law change or new coverage claim.
Final type, boundary, preservation/document/evidence and Git-size checks pass.
Final charged verification: 1761.373/1800s; this diagnostic package added 183.893s. The original budget is preserved. M110 remains incomplete; no continuation or BIO acceptance claim.
