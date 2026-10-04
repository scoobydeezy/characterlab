# Canonical Campaign-2 trace implementation checkpoint

2026-09-06. Implements `campaign2-trace-binding/0.1-candidate` under frozen
`rules/campaign2-bounded-bridge/0.2-candidate`. This is component evidence, not whole
VAL/FCT-6/PHEN-ADAPT qualification.

## Frozen target and preservation

The replacement seven-artifact packet is ACCEPTED AND FROZEN. Its 337-byte ModelIdentity
has digest `57e0d7de1de0ffad564ebef4af5ce6b5a3b515069dc85df48f181f5629d1f39b`.
Canonical bytes remain authority. TRACE-C2-M is COMPONENT / MATERIALIZATION PASS by review.
The old 0.1 packet retains its exact artifacts and historical runtime semantics. No new
trace is enabled under its identity and no old-save migration alias exists.

`firstTraceModel.ts` supplies the frozen 0.2 source declarations. Model preparation admits
exactly the old and new versioned bundles, checks fixed trace implementation support for
0.2, and retains the old bundle unchanged. The new runtime selects the trace adapter from
the model inside its committed RunIdentity; callers cannot supply a trace-policy option.
`compileTraceBinding` rejects old-model or mismatched model/run identities.

## Implemented behavior

`traceBinding.ts` emits existing type-160 records using the accepted exact event matrix.
Source/bridge/EVID wrappers finalize records after actual scheduler child allocation and
ingress association. RecordKind is the actual EventTypeId/1001. Source/OBS/SEM use their
fixed accepted seam/version pair; EVID/ADAPT check the exact executing registration.
Inputs, outputs, sources and subjects follow the accepted projection table.

The phase-120 envelope belongs to the bridge composite. Only the projected observation is
its output; the private raw candidate creates no separate trace or occurrence. Its truth
source is retained only in omniscient trace. EVID records retain exact nested safe inputs,
source IDs and observer subjects with zero state reads and no subject-binding lookup.

The scheduler's internal batch `finalizeTrace` hook runs after successful batch.finish().
ADAPT then serializes complete event patches, real instrumented reads and completed WRT
diffs, in event order. Patch operations use canonical StatePath order; outputs keep dispatch
then canonical RuleId order. Trace finalization cannot advance allocators, schedule phase
150, or publish early. Serialization failure produces TRACE_VALIDATION_FAILURE and aborts
the containing instant. Final invariant checks remain before whole-instant publication.

The old generic transition handler and the historical 0.1 branch retain their behavior.
No schema, persistent state family, event, output occurrence, numeric allocation or
persistence-profile change was introduced.

## Executed component evidence

- Full source suite: **53 files / 401 tests PASS**, including factory restore controls now
  exercised against the 0.2 model. Production build and reference import boundary PASS.
- Exact 18-envelope matrix over two source instants; actual child event/parent association;
  exact seam/version ownership and sole phase-120 observation output.
- Paired hidden-count control preserves OBS/X/E/L semantic projections while ADAPT differs;
  EVID source identity, nested payload and zero-read fields checked structurally.
- Four regulatory operations and one procedural operation: complete rule-patch collection
  equals trace intent; all WRT diffs match their operations, new values and authorities.
  Zero-count dispatch retains reads/evaluations with no operations or diffs.
- Late ADAPT trace-serialization failure leaves committed state, clock, outputs and trace
  unchanged. Existing scheduler/ADAPT rollback controls continue to cover queue/allocators.
- New-model restore is exact. Old save under new model rejects at ModelIdentity validation;
  old model cannot compile the canonical wrapper. A build-support mutant disabling the exact
  trace profile rejects new-model preparation before runtime construction.
- Fresh-process full continuation PASS: **18 canonical trace records**, **39786-byte final
  save**, SHA-256 `32b5129f223484970a42095c48503ca2b4c4e9213dee52f26065aba648b54214`.
  No original initial-state value crosses to restore. See
  [proof](CAMPAIGN2_TRACE_CONTINUATION_PROOF.json).
- Historical continuation remains exactly 6744 bytes with unchanged SHA-256
  `cc29a88d365959fc1c32cf7e2075d2b4ccb1322f6ee5a89d392367ca336c41f9`.
- Replacement packet delete/reconstruct proof passes after recording freeze metadata;
  its seven canonical artifacts retain their accepted bytes.

These checks provide scoped evidence for TRACE-C2-A..L/N. They are not an independent
implementation comparison or a blanket trace-suite verdict. TRACE-C2-M's accepted pass
is specifically materialization evidence, not activation evidence.

## Remaining work

FCT-6's independent finite implementation and targeted semantic mutants remain next,
including full read/write/value/restore branch coverage and integrated qualification of
VAL/PERSIST/factory obligations. ADAPT and PHEN-ADAPT verdicts remain separate. SUB-008's
structural trace discipline is preserved; no historical implementation was imported.
No new user decision or seam redesign was required for this implementation pass.
