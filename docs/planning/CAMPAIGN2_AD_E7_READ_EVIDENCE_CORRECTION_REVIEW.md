# Campaign2 AD-E7 read-evidence correction review

Date: 2026-09-09. Status: implementation correction and bounded evidence submitted.
**AD-E7 remains OPEN.** This is not a whole-vector consolidation.

## Finding

The next AD-E7 audit found a real publication-boundary gap. After admitted rule
execution but before the common-snapshot barrier, changing actualReadRecords by
omission, reversal or substitution from another execution was accepted. Removing
an encoded actualReads entry was also accepted. The barrier already compared
outputs and actual mutation diffs, but did not compare read evidence.

The first run of `campaign2ReadEvidence.test.ts` had four failing negative tests
(expected TRACE_VALIDATION_FAILURE, no error thrown) and one passing fresh-projection
control. These were internal admitted-batch fault injections, not public caller
capabilities. The public factory still exposes no executor-supplied bindings.

## Implemented correction

`src/campaign2/adaptationEvaluation.ts`, implementing
`adaptation-input/0.31-candidate`, now performs two bounded checks:

1. After each rule's real projection reads, compare its instrumentation with exactly
   target then optional gate: accessor, path, presence/value, and no derived sources.
   Expected paths/accessors come from the resolved rule; values come from the actual
   read returns. This catches missing or mislabelled instrumentation before staging.
2. Before publishing completed execution evidence, compare both structured and
   encoded read sequences against a private canonical snapshot captured before the
   staged result becomes available. This catches later omission, reordering and
   cross-execution substitution. The existing WRT prefix, actual-diff and staged-output
   checks retain their precedence.

Both use existing TRACE_VALIDATION_FAILURE. No new record, namespace, trace schema,
public injection API, profile, arithmetic, read, event or allocation is introduced.
Generic ContractReadProjection is unchanged. No state write publishes when these
checks fail, and completed execution evidence remains unavailable.

The checks do not independently prove the truth of an arbitrary malicious read
return: that remains the owning projection's responsibility. They validate required
instrumentation and preserve its staged association. This packet does not elevate
test access to internal batch results into a supported public capability.

## Evidence and preservation

The seven new tests exercise four staged substitutions, missing instrumentation,
wrong accessor instrumentation, and five distinct projection instances for five
rule evaluations. The fixture uses real registry/domain/admission/source/ingress
compilers and their admitted tokens for regulatory and procedural inputs.

Final fresh-source validation: **694 tests PASS in97 files** using the explicit
`src/test/**/*.test.ts` include (historical reference tests excluded). TypeScript
checking PASS. All166 recorded preserved-source/frozen-packet fingerprints match
the measurement-memory review/freeze manifests. No preservation artifact was rewritten.

The existing five batch witnesses also pass, including target/gate on the same path
with two distinct accessors in exact order for absent, zero-count and false-gate
cases. Existing25 mutation-boundary tests and eight REG/AD-E10 tests pass alongside
the new seven: **45 targeted tests in four files**. TypeScript checking PASS.

`scripts/prove-campaign2-read-evidence.mjs` records
`CAMPAIGN2_READ_EVIDENCE_PROOF.json`: seven-test baseline PASS, per-rule check removal
DETECTED, staged-read comparison removal DETECTED. Each transformation anchor is
unique, a designated witness must fail, unhandled errors are excluded, and source/test
fingerprints remain unchanged during the assay. Mutants are not written into source.

SUB-008 trace/persistence and SUB-009 explicit controls remain PORT. No historical
mechanism is copied or retired. Frozen model packets are unchanged. The evaluator
change makes earlier evaluator-fingerprinted mutation reports historical for this
tree; accepted verdicts are preserved, but those assays require explicit refresh
before whole B/FCT claims. Passing ordinary tests is not a silent mutation refresh.

## Review requested and remaining work

Accept the narrow read-evidence correction and its bounded controls. Do not assign
whole AD-E7 PASS from this packet. The remaining inventory includes declaration-level
static/dynamic accessor uniqueness, rebinding/executor-binding exclusion, full
cross-evaluation/interleaving controls, and owning PRJ/trace negatives for undeclared
or cross-character reads and enumeration. Fresh-instance evidence and staged
sequence checks here cover only their named portions of that matrix.

AD-E3/4/8/9/10/13 PASS. AD-E7/11/12 and whole B/FCT OPEN. VAL QUALIFIED, bounded
no-RNG PERSIST-A..H PASS, conditional/deferred PERSIST-I and PHEN-ADAPT PASS remain
unchanged. Campaign2 remains OPEN.

## Accepted disposition received 2026-09-09

Narrow correction ACCEPTED: both read-evidence guards, their existing error mapping
and preserved WRT/diff/output precedence. Seven bounded controls and two guard-removal
mutants accepted. Reviewed validation is97 files/694 tests, targeted45/4, TypeScript
PASS and166 preservation fingerprints PASS. PRJ owns returned values; ADAPT performs
no independent state reread. Internal fault injections are not public capabilities.
Whole AD-E7 remains OPEN for the explicitly listed remaining controls.
