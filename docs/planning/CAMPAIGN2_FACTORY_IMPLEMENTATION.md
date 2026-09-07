# Campaign-2 restricted factory implementation

2026-09-06 — FCT-5 component implementation and continuation evidence. This is not
whole-factory qualification or authoritative release activation.

## Authority and scope

Implements the restricted boundary in [factory design](CAMPAIGN2_FACTORY_DESIGN.md),
the frozen first model in [byte review](CAMPAIGN2_FIRST_MODEL_BYTE_REVIEW.md), and
`campaign2-persistence/0.1-candidate` with `campaign2-ordered-input/0.1-candidate`.
The exact semantic bundle remains the frozen model's REVIEW_MANIFEST.json.
No record, identity namespace, manifest, rule, work limit or seam version changes.
The reference-mechanism ledger remains applicable: this boundary composes the fresh
substrate and accepted seams; it ports no historical character mechanism.

## Implemented boundary

`src/campaign2/factory.ts` admits exact data fields, explicit version strings and copied
canonical bytes. It rejects extra options, accessors and executable alternatives.
The prepared model is an opaque WeakMap-backed capability. Caller-supplied identities,
handlers, validators, profile selectors, trace functions and work-limit overrides
cannot enter the public API. Plain byte arrays are copied without invoking caller
constructors, species or iteration hooks.

Creation validates initial state and REG at zero, compiles the complete original input
manifest and its RunIdentity, and only then constructs the fixed runtime. The committed
OrderingParameters supplies the work bound. The run exposes settlement, copied snapshot
bytes, copied RunIdentity bytes, save and diagnostic operations only.

Restore recompiles model declarations, checks saved identities, validates the saved state
and REG at B, requires exact list([]) in fields 8/9/10, and proves full original InputOnly
pending-event equality before constructing the runtime. It requires the original complete
ordered manifest, not the original initial-state value. Scratch schedule reconstruction
establishes original source authority without historical execution or restored allocation.

The empty metadata derivations follow the admitted bounded closure: five integer state
maps, no read-only state families, and fixed source/OBS/SEM/EVID/ADAPT adapters with no
run-owned analytical anchor, RNG consumer or continuing coupling operation. REG anchors
remain solely in model declarations. Generic extra build support does not participate in
the derivation. Unsupported declarations are rejected by model preparation.

`prepareCanonicalSave` factors existing structural/identity/state/queue checks out of
generic loading. Generic loading delegates to it and retains scheduler construction.
The scheduler continuation checks are shared with preparation and preserve validation
order. No save-schema fields or metadata provenance systems were added.

## Executed evidence

- Source suite: 51 files, 393 tests PASS; reference import boundary PASS.
- Final targeted factory/scheduler/persistence rerun: 23 tests PASS.
- Production build PASS.
- Frozen seven-artifact materialization verification PASS; model digest unchanged.
- Observation-unit allocation/preservation audit: 77 checks PASS.
- Two fresh subprocesses: checkpoint save and continued full save byte-identical,
  with no original initial-state transfer. See
  [continuation proof](CAMPAIGN2_FACTORY_CONTINUATION_PROOF.json) and
  `scripts/prove-campaign2-factory-continuation.mjs`.

Factory controls cover clock-zero and post-source restore, copied output isolation,
no callable overrides, missing consumed input, mismatched model, invalid untouched state,
REG bounds, missing/alternate/nonempty metadata, forged/removed/duplicate pending work,
allocator inconsistency, and failed/mid-settlement save rejection. Construction spies
establish that the negative restore cases fail before runtime construction. Missing and
malformed metadata use SaveContractError; accepted state/REG errors keep their owners.

## Remaining qualification

These are component results, not blanket PASS labels for VAL-A..W, PERSIST-A..I or FCT-A..F.
Canonical type-160 transition trace/diff integration remains incomplete in the inherited
FCT-4 composition: source/bridge/EVID wrappers currently contribute no transition record,
and ADAPT currently contributes its actual-read records. Full-save equality above includes
that current trace but does not prove trace completeness.

Next work is canonical trace/diff completion followed by FCT-6's independent finite
comparison and targeted semantic mutants, complete VAL/PERSIST/factory qualification,
and the integrated ADAPT/PHEN-ADAPT gates. No new semantic decision was identified by this
FCT-5 pass. Release activation and formal VAL closure remain pending those proofs.
