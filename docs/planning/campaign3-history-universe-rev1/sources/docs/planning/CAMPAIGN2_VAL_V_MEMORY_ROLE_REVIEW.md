# Final VAL-V public memory-role witness

## Revision 2 — accepted vector, corrected validation precedence

User review accepts VAL-V and all current A–W vectors in their recorded scopes,
but WITHHOLDS whole VAL until CONTENT stages 2/3 precede declaration/role stage 4.
The earlier implementation below put stage 4 first; its sequencing is superseded
by this correction, not excused because both failures could be configuration errors.

Memory preparation now uses the same closed VAL/CONTENT interpreter first with the
committed kind entries and an empty role-declaration operand. It validates actual
authored CONTENT and its reference closure before invoking the complete declaration
visitor. No DomainValidator is active in that first pass. The full declaration
compiler then validates the real memory registry, including266. Exact frozen-source
matching follows; only then does compilation complete the role-enabled content
capability and proceed to state/model/runtime construction. The small repeated
CONTENT compilation uses the same detached source and interpreter, not a parallel
validation system or a caller-supplied predicate. No accepted model set changes.

The new dual-defect test combines a structurally valid type170 self-reference cycle
with the real266.OutputRole namespace mutation. Both public prepare and restore
raise CONTENT-owned ContentValidationError for the cycle. Instrumentation observes
only kind-stage compilation, not full-registry role traversal; no ModelIdentity
or runtime is constructed and the original save remains unchanged. The existing
role-only and role-valid-selector controls are retained: respectively stage4 and
exact frozen-source matching reject before runtime publication.

Requested review disposition after validation: whole current VAL QUALIFIED in its
accepted A–W scopes. VAL-T's future second-kind positive remains conditional and
deferred; FCT remains separate/open. Prior sequencing and insufficient-assay history
below is preserved correct-forward.

Revision2 validation: **three fresh-source files / 36 tests PASS**, including both
VAL memory-role tests, all33 memory tests, and the joined ADAPT parent-pair test.
TypeScript, corpus promotion audit,150 prior plus17 frozen packet fingerprints,
and `git diff --check` PASS. No model or allocation bytes changed.

2026-09-08. Submitted for qualification review. All other current VAL-A..W
obligations have accepted PASS dispositions in their recorded scopes. This packet
proposes **VAL-V PASS** and **whole current VAL qualification**, retaining the
future conditional second-kind obligation and leaving whole FCT separate/open.

## Correction to the previous scope claim

The proposed public266 future-profile deferral was rejected correctly. The original
first profile has no266 declaration, but the accepted measurement-memory successor
already carries it in `MemoryRecallTransitionSeamContract/358.FieldRequirements`.
Both R=true and R=false include exact266; R=true additionally includes349.
The earlier first-profile-only audit was accurate about that specimen but
insufficient to infer no existing public carrier. Its proposed deferral is withdrawn,
not treated as an accepted scope exception or future obligation.

## Executed control

`src/test/campaign2ValMemoryRole.test.ts` uses both exact accepted recall configurations,
with an empty initial state and empty original input manifest. No recall event executes.

For each configuration:

1. Public `prepareMemoryModel` succeeds. Public run creation produces a clock-zero save.
2. Public `restoreMemoryRun` succeeds with the original S0/input manifest and returns
   byte-identical save and empty outputs. Instrumentation observes the exact complete
   memory registry supplied to production `compileValDeclarations` at prepare and
   restore, rather than counting unrelated base-model VAL calls.
3. Only actual266/4.OutputRole/1.RequiredNamespace changes from1002 to existing1000.
   The qualified validator ID and requirement carrier remain present. Public prepare
   and restore-source admission both reject with INVALID_CONFIGURATION and the
   role visitor's `character validator requires namespace 1002` diagnostic. VAL is
   reached exactly once per failed public call; no runtime is constructed.
4. A separate role-valid selector alteration retains qualified OutputRole but changes
   SelectorSourceFieldId to2. VAL is reached, then exact specimen matching rejects
   the registry before runtime construction on both public surfaces. This confirms
   the frozen-source gate still applies after the validation-order adjustment.

The diagnostic text is stage observation, not a newly standardized public message.
The generic DECL positive/shared/absent-validator corpus and omitted266 interpreter
mutant remain the independent build-qualification half. This new control supplies
the public admitted-profile half. Original-profile265/278 public witnesses remain
unchanged. No memory restore behavior is used to reinterpret original persistence.

## Preserved failed assay and validation-order adjustment

The first test run failed: altered OutputRole was rejected by the frozen-byte matcher
before generic VAL ran. That rejection was correct admission behavior but insufficient
evidence of role traversal; it is not counted as a VAL-V pass.

`src/campaign2/memoryModel.ts` now constructs the existing VAL declaration compiler
before the exact-source comparison, then compiles CONTENT only after that comparison.
This moves validation of already-declared roles earlier. It adds no validator,
callback, schema, accepted model, profile, identity or allocation, and removes no gate.
The source shape/version/wrapper checks still precede VAL. Exact frozen-source
matching still precedes content commitment, ModelIdentity creation and runtime
publication. The deliberate implementation change is failure-stage ordering for
malformed declarations; both old and new rejection use INVALID_CONFIGURATION.
It is not described as byte-identical production source.

No test substitutes the expected frozen packet, bypasses public preparation, or
places266 into an unrelated field. Valid profiles and canonical model bytes remain
the accepted ones. This is a validation sequencing fix beneath the existing contracts,
not a proposed widening of the model language.

## Requested disposition

Validation: three focused fresh-source files / 35 tests PASS, including all33
memory tests and the joined ADAPT parent pair. After adding the explicit retained
exact-matcher guard, the final role test was rerun and PASS. TypeScript PASS;
current corpus promotion audit PASS; all150 prior and17 frozen packet fingerprints
PASS. No model packet or permanent allocation was modified.

VAL-V PASS by composition of the real public265/266/278 witnesses, generic sharing/
optional-role controls, exact closure negatives, and declaration visitor mutants.
Whole current VAL qualification may then be accepted in the A–W crosswalk's exact
scopes. T-positive-second-kind remains FUTURE CONDITIONAL / DEFERRED / NOT PASSED,
not a current blocker. PERSIST-I remains DEFERRED / NOT PASSED; PERSIST-A..H retain
bounded no-RNG PASS. Whole factory/FCT remains a separate OPEN qualification task.

## 2026-09-08 — whole current VAL qualified

CAMPAIGN2_VAL_V_MEMORY_ROLE_REVIEW rev2 ACCEPTED. VAL-A..W PASS in recorded
bounded scopes. Whole current VAL QUALIFIED over the accepted Campaign-2
implementation language and finite qualification scopes; not universal compiler
or host equivalence. D finite interpreter mutations; E generic CONTENT permutations;
G/U named dependency alternatives; L/W current character domain; N inherited PRJ;
O listed interpreters; P original bounded restore; Q finite CONTENT specialization.
CONTENT-before-role sequencing and dual-defect precedence control ACCEPTED.
Exact frozen-memory narrowing remains mandatory; no admitted model/identity or
allocation bytes change. The insufficient matcher-first assay remains historical.
T-positive-second-kind is FUTURE CONDITIONAL / DEFERRED / NOT PASSED, not a current
blocker. PERSIST-A..H PASS bounded no-RNG; PERSIST-I DEFERRED / NOT PASSED.
Whole FCT/factory release remains OPEN / SEPARATE, next reconciliation target.
PHEN-ADAPT PASS unchanged; Campaign 2 OPEN.
