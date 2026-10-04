# Campaign-2 ADAPT B write-boundary correction

2026-09-08. Implementation review, not a new seam or a qualification verdict.
Implements the already accepted `adaptation-input/0.31-candidate` B prefix and
failure surface in [the consolidation contract](ADAPT_001_CONSOLIDATION_DRAFT.md).
Whole FCT and Campaign2 remain OPEN.

## Finding and correction

The prior evaluator applied its aggregate patch through ordinary WRT and then
validated candidate state. It did not enforce the accepted transition-family or
exact rule-target checks between authority ownership and operation validation.
The first adversarial regression changed only an exposure key and supplied a stale
Set precondition: it reached STALE_PRECONDITION instead of the required
ADAPTATION_TARGET_PATH_VIOLATION. A second control removes the stale defect, so
rejection cannot be credited merely to a later precondition failure.

The Campaign2 state model now accepts an internal data-only scope derived by the
closed evaluator from the committed capability and resolved rules. A scoped
authority interpreter preserves this order:

1. Path syntax, declared key grammar and canonical roles.
2. Writable-leaf resolution and authority ownership.
3. Transition permitted roots, then resolved target paths.
4. Existing WRT expected-old, removal and value checks.
5. Actual diff and staged-output comparison, then candidate validation.

Ordinary calls omit the scope and keep their existing WRT path. No public factory
callback, caller-provided scope, registry, model operand or allocation was added.
The evaluator privately snapshots expected targets, outputs and diffs before
returning staged results. A successful application must match those snapshots before
any completed execution evidence is published. Resolved NoStateChange targets remain
resolved targets, but cannot acquire an extra effective operation.

The accepted flat failure names are now present in SchedulerFailureCode:
TRANSITION_WRITE_SCOPE_VIOLATION, ADAPTATION_TARGET_PATH_VIOLATION and
ADAPTATION_MUTATION_DIFF_VIOLATION. Diagnostic162 and its wire representation are
unchanged. TRANSITION_WRITE_FORBIDDEN retains its EVID meaning.

## Evidence

`src/test/campaign2MutationEvidence.test.ts`:16 tests PASS, including:

- Wrong exposure with valid and stale Set preconditions: exact-target rejection.
- Malformed key shape, malformed CharacterId role and non-owning authority:
  their existing failures precede target validation.
- Changed V operands for tolerance, sensitization and displacement, changed load
  domain, and changed procedure: exact-target rejection across all five key types.
- Substituted actual WRT diffs: ADAPTATION_MUTATION_DIFF_VIOLATION before completed
  execution evidence becomes available.
- An added Set at a resolved no-change target: staged-change mismatch rejection.
- Existing successful five-leaf mutation evidence, zero-count behavior, copied-diff
  isolation and later-WRT-failure publication controls remain passing.

Batch and frozen-gate controls also PASS: three focused files /23 tests after the
final target-set refinement. TypeScript PASS. The preceding fresh-source regression
run passed93 files /633 tests; it preceded the final no-change-target refinement
and extra focused cases, so it is not represented as a second full final-tree run.
Historical reference tests were not part of that run.

The final-source applicability refresh is
[CAMPAIGN2_ADAPT_WRITE_BOUNDARY_APPLICABILITY_PROOF_REV2.json](CAMPAIGN2_ADAPT_WRITE_BOUNDARY_APPLICABILITY_PROOF_REV2.json):
baseline PASS and all three applicability substitutions DETECTED. The earlier
applicability reports remain distinct historical source commitments.

The dedicated skipped-check assay is
`CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF_REV2.json`:16-test baseline PASS, skipped
exact-target check DETECTED and skipped actual-diff check DETECTED. Its predecessor
`CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF.json` retains a SURVIVED redundant patch-byte
comparison. The actual-diff guard already detected those altered effective writes,
so the extra patch-byte guard and its snapshot were removed. The final dedicated
assay passes after that reduction; this is not a claim that every possible boundary
substitution has been tested.

PHEN-ADAPT promotion audit PASS with current digest
`3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`;
both historical corpus commitments remain preserved. The memory packet and its
prior-source preservation fingerprints also PASS. No frozen model bytes changed.

## Limits and review disposition

This does not claim full AD-E4 or AD-E8, or whole B/FCT qualification. In particular:

- The transition-family guard needs its own positive reachability/control mapping;
  cross-authority negatives correctly fail earlier and do not count as that witness.
- Wrong CharacterId qualification and a valid alternate qualified subject are
  different controls; the latter is not supplied by these first-profile tests.
- All wrong-key cases here are Set cases. The remaining Remove and effective-change
  matrix, including equal-value Set, must remain explicit.
- Exact-path checking uses the resolved per-execution target set; expected diffs and
  output snapshots additionally enforce the produced changes. No claim is made
  that every cross-rule reassignment substitution has been challenged.
- The two new target/diff guards now have their own skipped-check assay; the refreshed
  three applicability substitutions remain separate evidence.
- Existing mutation reports whose source fingerprints include stateModel or
  adaptationEvaluation are historical evidence until refreshed. Accepted verdict
  history is retained; test counts do not refresh those reports automatically.

Requested research review: assess whether this internal data-only prefix insertion
and staged-evidence comparison correctly realize the accepted B contract, with the
listed controls still outstanding. Do not promote this to whole FCT or reopen VAL,
PERSIST-I, the bounded PERSIST scope, PHEN-ADAPT, or accepted model/allocation semantics.
Reference SUB-008 trace, SUB-009 paired controls and SUB-011 correct-forward history
are preserved; no mechanism was imported from the historical tree.

## 2026-09-09 accepted disposition

The supplied review ACCEPTS this correction and its bounded target/diff/publication
evidence, including the failure-code realization and redundant guard removal.
Whole B, AD-E4, AD-E8 and FCT remain OPEN. The next operation/provenance controls and
the authority/profile reachability decision are recorded separately in
[CAMPAIGN2_ADAPT_B_REACHABILITY_REVIEW.md](CAMPAIGN2_ADAPT_B_REACHABILITY_REVIEW.md).
Those later controls are not retroactively covered by this accepted checkpoint.
