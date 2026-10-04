# FCT-6 independent qualification — passes 1–16

2026-09-06. **COMPONENT EVIDENCE; FCT-6 and formal VAL closure remain open.**
Target: frozen rules/campaign2-bounded-bridge/0.2-candidate, ModelDigest
`57e0d7de1de0ffad564ebef4af5ce6b5a3b515069dc85df48f181f5629d1f39b`.
Passes 1–14 changed no production source. Pass 15 fixes the inherited EVID-F capability defect
without changing model declarations, identities, allocation or accepted semantics.

## Independent character-content specialization

`src/test/fixtures/independentCampaign2Content.ts` independently implements the finite
character-content checks of content-kind/0.1-candidate: exact type-170 field inventory,
character-kind resolution, identity/reference uniqueness, reference existence and cycles,
then reference normalization and complete authoritative-byte preservation.

The oracle uses a reachability matrix and transitive closure. Production uses indexed
content and depth-first cycle traversal. The oracle imports no production content/VAL
validator, factory, identity resolver or registry compiler. The canonical codec is shared
as transport, explicitly outside this independent semantic claim. Registry identities are
obtained from the actual committed registry; they are shared data, not an oracle predicate.

Corpus `finite-character-content/0.1` contains **572 cases**:

- All **531 directed graphs on zero through three distinct definitions**, including self
  edges and every cyclic/acyclic combination. Exactly 30 graphs admit.
- Every required-field omission, duplicate StableId, unsupported kind/namespace, unknown
  and duplicate registry/content references, unordered references and malformed containers/IDs.
- Arbitrary canonical data in all 12 non-identity/reference authoritative fields, including
  text that looks like an instruction to require body/roster/belief. These fields are data.

Production and oracle agree on acceptance/rejection and exact accepted canonical bytes:
**44 accepted, 528 rejected**. Rejection carrier/precedence is not independently compared.
Malformed wire cases share cenc handling and are not an independent codec proof. The corpus
uses valid fixed VAL declarations; declaration/role traversal and IDN origin qualification
are separate qualification obligations. This is bounded evidence, not enumeration of all
possible canonical metadata or arbitrarily large graphs.

## Interpreter mutation evidence

`scripts/prove-campaign2-independent-content.mjs` applies isolated in-memory Vite transforms
to production interpreter modules and runs the independent witness under unchanged registry
bytes. No source file is modified, and source hashes are checked afterward. The report
records exact sites/replacements, cases, results, accepted byte hashes and source fingerprints.
No implementation fingerprint becomes a ModelIdentity operand.

| Mutant | Witness | Result |
|---|---|---|
| Omit cycle check | one-node self cycle | DETECTED |
| Omit registry-reference existence | unresolved registry ID | DETECTED |
| Admit dangling content reference (existence check plus traversal) | unresolved content ID | DETECTED |
| Require uncommitted body predicate | minimal valid character | DETECTED |
| Substitute Preconditions for WorldEffects | distinct canonical WorldEffects | DETECTED |
| Omit reference uniqueness | repeated registry reference | DETECTED |
| Omit reference ordering normalization | reversed valid content references | DETECTED |

An earlier one-site content-existence mutant was **not distinguished**: removing only the
explicit check still rejected later during graph traversal. It was replaced by the explicit
two-site dangling-reference acceptance mutant. The original attempt remains in the report;
it is not counted as detected. This follows SUB-011's preservation of failed attempts.

Full machine evidence: [independent content proof](CAMPAIGN2_INDEPENDENT_CONTENT_PROOF.json).
Regenerate with `node scripts/prove-campaign2-independent-content.mjs`.

## Independent bounded adaptation and declaration effect

`src/test/campaign2IndependentAdaptation.test.ts` compares the frozen four-rule regulatory
execution against a separate scalar oracle using repeated increments and explicit bounds,
without the production rule evaluator, projections, domain checks or WRT patch function.
It enumerates **143 cases**: prior 0..10 crossed with count 0..12. **66 succeed; 77 reject**.

Successful cases compare all four magnitudes, baseline omission, complete effective patch
and diff counts, actual prior presence/value and nine trace envelopes. Rejected cases retain
the exact committed state, clock, outputs and trace. This checks the frozen Always/+1 profile;
it is not independent coverage of BaselineOnly gates, signed steps, Remove normalization,
unbounded procedural arithmetic, dynamic REG rates or every transaction failure boundary.

A separate VAL-C witness changes only the tolerance rule's committed Step from +1 to +2
in an isolated model variant. RegistryIdentity and ModelIdentity change; their other operands
remain equal. Count 2 produces tolerance 4 instead of 2, with all other leaves identical.
The frozen model artifact is not edited. This is a witnessed declaration effect, distinct
from VAL-D's modified interpreter under unchanged declarations.

## Verification and remaining scope

Source suite: **55 files / 404 tests PASS**. Build and reference import boundary PASS.
The new tests have explicit bounded timeouts; no global timeout or runtime work limit changed.
The build exposed a readonly-array typing error in the new test harness; copying the entries
before sorting resolved it without production changes.

This pass supplies scoped VAL-C/D/Q evidence and strengthens the independent proof burden
for the bounded adaptation slice. It does **not** close VAL-A..W, FCT-6, PERSIST, the global
TRACE suite, integrated ADAPT or PHEN-ADAPT. Remaining work includes:

- Independent role/IDN and whole-declaration admission checks, with their exact error carriers.
- Targeted interpreter mutants for remaining admitted branches, including ADAPT gate/negative
  step/Remove, REG retained-time behavior and persistence derivations.
- An explicit complete gate-to-witness matrix, missing controls, fixture versions and reviewed
  release verdict. VAL-T's future-kind branch remains excluded from current-profile claims.
- Integrated ADAPT/PHEN-ADAPT qualification after the factory proof gates.

The preservation ledger's SUB-001 and SUB-008 disciplines inform exact scalar and structural
comparison. No historical psychological mechanism is imported or retired by these controls.

## Pass 2 — independent role/IDN and negative-step execution

Status: **COMPONENT PASS**, with the global gates above still open.

`independentCampaign2Roles.ts` supplies a separate finite semantic interpreter sharing only
canonical transport and full typed-identity byte equality. The production comparison harness
tests 39 atom/list cases against empty and populated committed content, through direct
qualification, a qualified namespace role, and a namespace-only role: **234 exact verdict
agreements**. Cases include authored known/missing/foreign-namespace IDs, malformed origin
shells, runtime ordinals including a large ordinal, wrong outer namespaces and non-identities.
This qualifies the finite corpus, not a general decoder or recursive record/map-key traversal.

Direct `qualifyCharacter` checks the referent shell then committed resolution; decoded role
admission also performs recursive typed-ID intake. Accordingly an empty 1038 payload can
produce a role violation in the former and a canonical encoding error in the latter. The
oracle models these distinct API boundaries and compares exact carriers rather than merging
all rejection outcomes.

[Machine evidence](CAMPAIGN2_INDEPENDENT_ROLE_PROOF.json), regenerated by
`node scripts/prove-campaign2-independent-roles.mjs`, records seven detected in-memory mutants:
skipped committed resolution, stable-payload-only equality, qualification of namespace-only
roles, skipped required namespace, skipped referent shell, runtime-as-character admission,
and a substituted qualification error carrier. Every mutant runs all 234 cases. The report
records exact mutation sites, disagreements and source fingerprint; registry/content hashes
remain equal and the production file remains unchanged. These are interpreter variants,
not new model declarations or model identities.

The independent adaptation comparison now runs both the frozen +1 profile and an isolated
committed -1-step variant. Each enumerates 143 prior/count pairs with **66 successes and 77
rejections**; combined **286 cases**. The decrement variant checks lower-bound rejection,
byte-exact transaction rollback and baseline omission. Its ten positive-prior exact-return
cases each require four canonical `RemovePatchOperation/146` operations and four actual
diffs. Other effective mutations require `SetPatchOperation/145`; zero counts remain no-ops.
The variant changes local declaration bytes only; it does not alter the frozen model packet.
BaselineOnly gating, dynamic REG rates, procedural arithmetic and targeted adaptation
interpreter mutants remain separate pending qualification work.

Verification after pass 2: **56 files / 406 tests PASS**, build and reference boundary PASS.
No production semantic change, permanent allocation or release verdict is introduced.

## Pass 3 — FrozenBaseline, REG and persistence boundaries

**COMPONENT PASS.** Accepted ADAPT calls the gate `FrozenBaseline`; the earlier
“BaselineOnly” progress wording is corrected without changing any contract variant.

The independent gate corpus runs 72 factory executions: target prior {0,1,9,10}, distinct
sensitization gate prior {0,1,8}, count {0,1,2}, and Step {-1,+1}. Only tolerance uses
FrozenBaseline; sensitization and the other regulatory leaves still update in the same
batch. Expectations use a separate repeated-step scalar calculation. Checks include all
four final magnitudes, omission, five reads, nine traces, effective patch/diff counts,
exact Remove-versus-Set behavior and rollback. Six in-memory mutants are detected:
ignored/inverted gate, target substituted for gate source, lost step sign, Set at baseline,
and unchanged Set emission. [Gate proof](CAMPAIGN2_INDEPENDENT_GATE_PROOF.json).

The REG oracle checks 252 results across rate {-1,0,+1}, authored anchor {0,7}, seven times
including fractional boundaries and INT64_MAX, and five signed displacements. Expected
signed floor uses positive quotient/remainder and explicit negative adjustment, without
the production TIME materializer or exactMath floor function. Five mutants are detected:
reference at zero, adapted-bound check at zero, ignored displacement, excluded valid
endpoints and negative truncation. Model variants have broad admitted bounds and canonical
rates; no frozen REG declaration is edited.

Persistence checks exact empty fields 8/9/10, exact valid restore, and unchanged D=1 under
a model whose R0 rises from 99 to 100. The saved-time negative edits the canonical clock to
INT64_MAX; it is an intake witness, not an assertion that that history executed. It must
reject before entering the runtime constructor. Five invented save/restore metadata
derivations and a time-zero restore-check mutant are detected.

The first rejection-only assay **did not distinguish** the time-zero restore mutant:
runtime construction repeated the saved-time check and rejected later. The strengthened
assay observes constructor entry (Vitest spy in the test; an in-memory counter in the
mutation runner). The same single-site mutant now fails the earlier-boundary requirement.
The superseded attempt is retained in the [REG/persistence report](CAMPAIGN2_REG_PERSISTENCE_MUTATION_PROOF.json).
This is a test precision correction, not a production semantic repair.

New reports regenerate with `node scripts/prove-campaign2-independent-gates.mjs` and
`node scripts/prove-campaign2-reg-persistence.mjs`. They add 17 detected mutants, bringing
the four qualification reports to 31 detected mutants total. Production source hashes
are unchanged after each isolated mutation campaign. Persistence comparison is not a
second independent persistence implementation; REG/content/role/scalar comparisons share
canonical transport and their stated setup boundaries.

Verification: **59 files / 409 tests PASS**, build and reference boundary PASS. Build found
an insufficient CanonicalValue narrowing in the new REG harness; an explicit signed-kind
check corrected the test typing. No runtime contract, model artifact or allocation changed.

The [factory gate evidence map](CAMPAIGN2_FACTORY_GATE_MATRIX.md) now inventories every
FCT-A..F, FCT-1..6, VAL-A..W and PERSIST-A..I obligation, available witnesses and remaining
work. It explicitly separates incidental test labels from canonical gate meanings and
does not yet claim the complete inherited EVID/ADAPT/REG/PRJ/OBS/SEM crosswalk or release.

## Pass 4 — declaration traversal and OBS/SEM substitutions

2026-09-07. **COMPONENT PASS; no new release disposition.**

`finite-val-declaration/0.1` has 359 exact verdict comparisons: 336 combinations of four
kind/validator declaration contexts, four role variants, three role-bearing positions and
seven container contexts; two shared/duplicate-position controls; and 21 runtime record-role
controls. Container contexts are root, list, set, map key, map value, generic record field,
and opaque typed-identifier payload. Expected outcomes are labelled from corpus construction,
not calculated by a second general declaration compiler. All three positions (265/266/278),
absent optional validators, shared references and exact configuration/role carriers agree.

Eleven in-memory mutants are detected: each omitted role position, skipped declaration map
key/value traversal, inappropriate typed-ID payload traversal, skipped duplicate position
or validator coverage, and skipped runtime map key/value or list/set traversal. Full cases,
exact differences, source fingerprint and mutation sites are in the
[declaration report](CAMPAIGN2_DECLARATION_COVERAGE_PROOF.json). Regenerate with
`node scripts/prove-campaign2-declaration-coverage.mjs`.

Harness corrections are retained here: StatePathPattern initially used the Campaign-2-only
constructor instead of its inherited schema constructor; AdaptationPrior was an invalid
arbitrary-record wrapper and was replaced by the generic registry Definition field. The
first mutation run stopped when omitting the sole setup constraint orphaned its validator.
Runtime-test setup now uses all three shared reference positions, so each single-position
mutant reaches the complete corpus. These were harness failures, not production defects or
undetected semantic mutants; no partial failed run is counted as a successful report.

Five factory-path OBS/SEM substitutions are detected under unchanged RulesVersion and
registry/content/parameter bytes: retained truth provenance, omitted authoritative observation,
omitted or duplicate SEM observation support, and shifted SEM time. The checked baseline
has nine envelopes, one observer-safe observation, zero EVID reads and exact predecessor
embedding. Counts 0 and 2 preserve the safe OBS/SEM/EVID payloads. Each substitution runs
both inputs; failures roll back state, outputs, trace and clock. Successful altered runs
are distinguished by exact output/trace bytes. Hashes in the report are diagnostics only.
See the [bridge report](CAMPAIGN2_BRIDGE_SUBSTITUTION_PROOF.json), regenerated by
`node scripts/prove-campaign2-bridge-substitutions.mjs`.

This is differential build qualification against a checked baseline, not an independent
SEM implementation or complete inherited-vector proof. It adds sixteen detected mutants,
bringing six reports to 47. Neither report changes production source files, allocations,
or frozen model artifacts. PRJ execution, forbidden-dependency mutants, complete model
admission/restore coverage and inherited vector mapping remain open in the
[gate map](CAMPAIGN2_FACTORY_GATE_MATRIX.md).

Verification for pass 4: **60 files / 410 tests PASS**, with
`npm test -- --reporter=dot --maxWorkers=2 --minWorkers=1`; build and reference boundary PASS.
The first full-suite run alongside the build hit the existing restore-negative test's
5000 ms timeout (5230 ms). The bounded-worker rerun without a concurrent build completed
that test in 3665 ms. No test timeout, runtime limit or production mechanism changed.

## Pass 5 — PRJ execution, ambient dependency challenges and REG ownership

2026-09-07. **COMPONENT PASS; global gate dispositions unchanged.**

The inherited generic PRJ execution test runs unmodified under six isolated in-memory
compiler substitutions: selecting the occurrence field instead of ObserverId, returning
the roster wrapper, losing the source wrapper in read evidence, losing the required
absence error carrier, permitting static roster reads, and permitting an omitted required
roster projection. Each mutated build fails the selected inherited test; the baseline
passes. The runner verifies exactly one selected test executes, no runner errors occur,
and each unique mutation site is applied once. Other tests are explicitly skipped for
this targeted campaign. Expected mutation failures are recorded before the runner returns
success; they are not passing implementations.

[PRJ proof](CAMPAIGN2_PRJ_SUBSTITUTION_PROOF.json) regenerates with
`node scripts/prove-campaign2-prj-substitutions.mjs`. This generic projection fixture is
not the accepted zero-read EVID specialization and does not alter the frozen first model.
It supplies inherited assertion-based mutation evidence, not a second PRJ interpreter.

[Forbidden-dependency evidence](CAMPAIGN2_FORBIDDEN_DEPENDENCY_PROOF.json) uses ten explicit
Boolean ambient stand-ins: roster, CandidateDomain, recognition, body, state, activity,
clock, RNG, presentation and trace. The fixed authored character qualifies in all twenty
present/absent cases without reading any stand-in. Ten isolated mutants each add a direct
requirement for one stand-in; absent rejects while present accepts under unchanged canonical
inputs. Proxy reads make even the admitting dependent execution observable. The global
property is test-only, restored afterward, and never added to production, declarations,
identity operands or character semantics. These controls do not claim exhaustive detection
of all environment access or malicious implementations. Regenerate with
`node scripts/prove-campaign2-forbidden-dependencies.mjs`.

The added PERSIST-B test changes only a model-owned REG anchor from 50 to 51. RegistryIdentity
and ModelIdentity change; the other ModelIdentity operands remain identical. Both runs
retain identical empty snapshots and exact empty save fields 8/9/10. The old save rejects
under the changed model; the matching save restores byte-for-byte. Together with the
existing dynamic saved-time D=1 check, this supplies the distinct identity/metadata and
retained-time witnesses without introducing a saved REG mirror or re-anchoring operation.

This pass adds sixteen detected mutants, bringing eight qualification reports to 63.
Production source and accepted contracts are unchanged. Complete inherited-vector mapping,
whole-model declaration/restore coverage and remaining persistence controls stay open in
the [gate map](CAMPAIGN2_FACTORY_GATE_MATRIX.md); no authoritative activation is claimed.

Verification for pass 5: **61 files / 412 tests PASS** with the bounded-worker command;
build and reference boundary PASS. Build and regression ran sequentially. No timeouts,
runtime limits or production semantics changed.

## Pass 6 — admission/restore parity and inherited-vector audit

2026-09-07. **COMPONENT EVIDENCE; no release verdict.**

`campaign2ModelAdmissionParity.test.ts` exercises nine negative model variants at both
prepare and restore (18 rejections): three unused unsupported analytical/random/coupling
registry declarations, missing character validator, bridge or settlement definition,
missing key grammar, unsupported RulesVersion and zero work bound. Each yields
INVALID_CONFIGURATION before runtime construction; the original run/save is unchanged.
Unknown entries use explicitly negative fixture vocabulary, not newly admitted contracts.
This tests unexercised declaration rejection, not the conditional PERSIST-I case of an
additional accepted seam supported by a build.

A positive permutation control reverses the populated registry sets before canonical
encoding. Registry/content bytes, ModelIdentity and restored save bytes remain identical.
The first model has one character, so this is not a multi-character content permutation
proof. Existing duplicate-identity checks remain separately required.

The [inherited-vector crosswalk](CAMPAIGN2_INHERITED_VECTOR_CROSSWALK.md) now lists all
51 EVID-A..T, REG-A..R and AD-E1..13 challenges with relevant evidence and explicit remaining
work. `node scripts/audit-campaign2-vector-crosswalk.mjs` checks exact ID coverage, no
repeated/missing rows and evidence-file existence. Its
[inventory report](CAMPAIGN2_VECTOR_CROSSWALK_AUDIT.json) gives every row QUALIFICATION OPEN;
no runtime pass follows from the audit. ADAPT A-D, packaging and complete PRJ/IDN/OBS/SEM
mapping remain outside that first crosswalk.

One resulting gap now has an exact witness: AD-E8's tolerance p=6, n=3, Step=-2 produces
exactly one Remove with the original ToleranceValue(6) precondition and exact target path.
The other three +1 rules end at 9. After save/restore the complete state is byte-identical
to a comparison state with those other leaves at 9 and the tolerance target absent;
restored save bytes also match exactly. This does not claim that histories or RunIdentities
with different initial states are equal. Absent-Remove and full no-op rejection mapping
remain review items for the complete AD-E8 challenge.

No production semantics, canonical declarations, allocation or frozen packet changed.
The mutation count remains 63; this pass adds admission/exact-state witnesses and an
inventory audit, not additional detected mutants. Next priorities from the crosswalk are
EVID-S interpreter boundaries, REG-M construction checks and the exact AD-E5 ordering
witness, followed by expansion of the inherited inventory.


Verification for pass 6: **62 files / 415 tests PASS** with bounded workers; build and
reference boundary PASS. The 51-vector inventory audit passes independently of runtime
qualification. No test timeout or runtime limit changed.

## Pass 7 — EVID/REG construction mutations and exact frozen-gate order

2026-09-07. **COMPONENT PASS; no global gate disposition changes.**

Both EVID output validators now explicitly accept one valid output and reject zero,
two distinct, two identical and wrong-schema outputs with TRANSITION_OUTPUT_VIOLATION.
The tests exercise the shared validator before ingress, including the terminal L schema.
Four interpreter mutations are detected by the admission suite: skipped required output
cardinality, extraction of field 2 instead of the declared occurrence field, and zero/two
interpreter-generated children. These are distinct from caller-injected malformed work.

REG-M adds ten malformed declaration fixtures with INVALID_CONFIGURATION and a diagnostic
identifying the first closed implementation check. Nine individually omitted checks are
detected: parameter key/identity, local resolution, parameter closure, bound agreement,
character totality, global parameter ownership, rate normal form, anchor normal form and
endpoint totality. Diagnostic text is an observation of this implementation's rejection
site; it is not promoted into normative public error wording. A later rejection with the
same code cannot falsely satisfy an earlier-check assertion. Namespace-family, domain/role
and other remaining variants stay open in the crosswalk.

The exact AD-E5 fixture contains two regulatory rules: tolerance Always/+1 and load
FrozenBaseline(tolerance)/+2, initially absent with count 1. It produces exactly two leaves,
tolerance=1 and load=2, and three absent-prior reads. Swapping the two committed rule IDs
reverses evaluation target order, changes ModelIdentity and preserves exact settled state.
The procedural rule set is empty. The first reduced fixture correctly failed construction
because it retained excess ReadDomain entries; narrowing both consumers to their exact
rule target/gate unions corrected the fixture, without changing production semantics.
A mutant reading an earlier staged write as the gate is detected by the same test.

[Mutation report](CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF.json) regenerates with
`node scripts/prove-campaign2-evid-reg-construction.mjs`. It records passing baselines and
four EVID, nine REG and one gate mutant. The runner verifies executed test counts and
absence of unhandled errors. An initial repeated-Vitest run emitted a listener-count
warning; the runner now removes only listeners added during each completed run, instead
of raising the warning threshold. The clean rerun passes. Expected mutant test failures
are inspected before the runner returns success. The shared PRJ test-file fingerprint
was refreshed by rerunning its existing six-mutant proof; those are not counted again.

Nine reports now retain 77 detected mutants. No production source, accepted seam,
permanent allocation or frozen first-model packet changed. Full EVID-S/REG-M and global
FCT/VAL/ADAPT closure still require the remaining cases in the updated crosswalk.


Verification for pass 7: **63 files / 418 tests PASS**, build and reference boundary PASS.
The inventory audit still covers 51 unique vectors and now verifies 17 evidence files;
that remains bookkeeping evidence, not a runtime verdict. No timeout or runtime-limit change.

## Pass 8 — EVID preservation, admission and no-write precedence

2026-09-07. **COMPONENT PASS; full EVID qualification remains open.**

Three new admission-suite controls cover:

- A canonical nonempty event-classification carrier with explicit false survives exact
  X→E→L nesting and encode/decode, with two fresh output allocations. This is a carrier
  fixture at the trusted freeze boundary, not a claim that the accepted first bridge or
  rope-pattern classifier produces that false classification. Missing-facet, unresolved-role
  and false-tracking producer-derived cases remain open. The limited convenience encoder
  is deliberately not used to reconstruct the nonempty carrier.
- Both EVID stages reject nonempty patches, changed structural state and unmatched original/
  returned-state arguments before rejecting a deliberately bad domain output. The exact
  carrier is TRANSITION_WRITE_FORBIDDEN. Failed attempts do not consume the execution or
  allocate additional output IDs; subsequent valid completion with equal state succeeds.
- Changing observer, time or occurrence bytes in a generated payload fails INPUT_NOT_ADMITTED
  before output allocation. The original generated event remains admissible afterward.

The first test run found an extra closing parenthesis in the new assertion and executed
no tests; correcting that harness typo produced a passing 14-test admission suite. No
production behavior changed to accommodate the fixtures.

The [construction mutation report](CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF.json) adds four
mutants: omitted payload equality, ignored patch prohibition, ignored structural-state
prohibition and erased nonempty event classifications. All are detected; the full report
now has eight EVID, nine REG and one AD-E5 mutation. Nine qualification reports total 81
detected mutants. The existing PRJ report was refreshed against the expanded shared test
file; its unchanged six mutants are not counted again.

The updated crosswalk retains full producer-derived EVID-L coverage and remaining
admission/capability/fault cases as open. Production source, accepted seams, allocations
and frozen model artifacts are unchanged.


Verification for pass 8: **63 files / 421 tests PASS**, build and reference boundary PASS.
The crosswalk inventory audit passes for 51 unique vectors and 17 evidence files, without
changing their runtime gate dispositions. No timeout or runtime-limit change.

## Pass 9 — EVID rollback and producer boundary controls

2026-09-07. **COMPONENT PASS; full EVID qualification remains open.**

Four new actual-factory tests inject failure after E occurrence allocation, after E's
child has been bound, after L occurrence allocation, and during phase-140 trace validation.
Each preserves the exact pre-instant state bytes, queue, allocator state, outputs,
committed trace and clock. Allocation counters prove the intended fault point was reached
(one EVID allocation at the first two points, two at the latter two). Each run becomes
terminal Failed, exposes a diagnostic and rejects save. Allocation faults carry
TRANSITION_FAILURE; child-binding and final-trace faults carry TRACE_VALIDATION_FAILURE.
These are real first-profile execution tests with test-only spies and internal scheduler
snapshot inspection; no public factory capability or production source changed.
The final-validation witness targets trace construction, not every possible invariant fault.

The shared admission suite adds empty/current-lane trusted-freeze controls: no child
emission, injected E consumer rejected INPUT_NOT_ADMITTED before occurrence allocation,
and clean ingress finish. Unsupported source phases reject TRANSITION_OUTPUT_VIOLATION;
archived E cannot masquerade as a SEM freeze record, and a wrong SEM producer version
fails construction with INVALID_CONFIGURATION. These tests cover the trusted adapter
boundary, not upstream reservation derivation or archived-E replay through the public
restore path. Those challenges remain explicit in the inherited vector crosswalk.

The construction and PRJ mutation reports were regenerated against the 15-test admission
file; their existing 18 and six mutants remain detected. No new mutation is counted:
the nine-report total stays 81. Fault-injection tests are separate rollback evidence.

Verification: **64 files / 426 tests PASS**, build and reference boundary PASS. No timeout,
runtime limit, accepted contract, permanent allocation or frozen model packet changed.
The inventory audit covers 51 vectors and 18 evidence files; it passes bookkeeping only.
No global FCT, VAL, PERSIST, ADAPT or PHEN verdict is implied.

## Pass 10 — EVID silence and archived-output persistence

2026-09-07. **COMPONENT PASS; full inherited qualification remains open.**

The actual frozen factory accepts an empty ordered-input sequence. Neither initial settlement
nor restore/settlement calls SEM lane admission, emits outputs or trace, or changes exact save
bytes. The paired zero-contact source does call consequence admission and emits exactly one
X/E/L while character state remains byte-identical. Zero contact is therefore not silence.
The fixed bridge explicitly requests character-accessible evidence for every admitted source;
there is no source-event silent-observation branch in this profile. No such branch or new model
option was invented to satisfy EVID-M. General SEM no-reservation derivation remains outside
this first-profile witness; the previous empty trusted-freeze control covers its ingress boundary.

The second test takes actual archived E and L from successful settlement. Four variants
(E/L with their native event type, and each disguised as an authored source) are rejected both
as new ordered input and as pending work in a canonical save: eight negative calls, all before
runtime construction. Pending fixtures retain valid future time, event identities and allocator
bounds. Restore failures retain SaveContractError; canonical shape errors on creation retain
their existing carrier. The original run/save remains unchanged after all rejected calls.
Valid restore retains exact snapshot/save bytes. Its next source appends exactly one fresh E/L
pair with IDs and full record bytes equal to uninterrupted continuation; old E/L bytes remain
unchanged in the archive, and no additional source remains afterward.

The initial harness incorrectly expected restore to discard old outputs. The first run passed
the silence test and all eight rejection calls, then failed that archive assertion. Inspection
confirmed canonical save fields 11/12 preserve trace/outputs and runtime continuation restores
them directly. The corrected test asserts archive preservation, not erasure or regeneration.
Production semantics were unchanged. This correction preserves SUB-011's failed-hypothesis log;
exact structural comparisons follow SUB-008's preservation discipline.

Verification: **65 files / 428 tests PASS**, build and reference boundary PASS. The crosswalk
inventory audit covers 51 vectors and 19 evidence files, without passing runtime gates. Existing
mutation reports are unchanged (81 detected total); this pass adds no interpreter mutations.
No production source, accepted contract, permanent allocation or frozen model artifact changed.

## Pass 11 — exact REG boundary and time-only invalidity witnesses

2026-09-07. **COMPONENT PASS; full REG qualification remains open.**

A derived test model realizes the exact frozen Scale=1/[0,100]/R0=80 fixture. D=-81,
21 and 30 return REG_ADAPTED_REFERENCE_OUT_OF_RANGE; D=-80, -30 and 20 return Valid.
The time-varying variant uses Rate=1, TIME Scale=Int64.MaxValue: reference 80 through
Int64.MaxValue-1 and 81 at Int64.MaxValue. The zero-rate control stays 80. Repeated
and reordered queries retain exact authored registry bytes. D=0/10 validation queries
leave R0=80, but do not replace the outstanding complete paired-history REG-L witness.
These are isolated model variants; the frozen first-model packet is unchanged.

For REG-O, retained D=20 is valid at time zero and invalid when R0 reaches 81. A real
factory run with a zero-count source scheduled at Int64.MaxValue rejects at the first
instant hook, before ingress construction. State bytes, clock, queue, allocators, outputs
and committed trace remain exactly unchanged; the run becomes Failed, exposes a diagnostic
and cannot save. A clock-edited quiescent save with the same D is rejected before runtime
construction. Both failures assert ADAPTATION_REFERENCE_OUT_OF_RANGE. The original valid
save is unchanged. This proves the selected early validation hook; a hypothetical later
repairing-rule substitution is not part of this fixture.

Verification: **66 files / 430 tests PASS**, build and reference boundary PASS. After the
full suite, the two failure assertions were strengthened to require their exact carrier;
the affected two-test file passed again. The inventory audit covers 51 vectors and 20
evidence files, with no runtime gate promotion. Existing mutation total remains 81.
No production source, accepted semantics, numeric allocation or frozen model artifact changed.
SUB-001 exact arithmetic and SUB-008 structural rollback obligations remain preserved.

## Pass 12 — REG query order and paired-history persistence

2026-09-07. **COMPONENT PASS; formal REG/global qualification remains open.**

REG-J now has explicit A=0, B=1, C=Int64.MaxValue-1 queries under Rate=+1 and -1,
TIME Scale=Int64.MaxValue, with initial value 80. A→B→C, repeated C, and A→C through
an independently compiled provider agree on full TIME materializations. Test-only spying
observes exact remainders and verifies every call retains the authored value=80, instant=0,
remainder=0 anchor. Expected negative-rate values use the explicit below-one-step floor
case, not the production floor helper. Source registry bytes remain unchanged. This does
not add a public REG remainder accessor or a new provenance surface.

REG-I/L use paired D=0 and D=10 histories with the same prepared model/provider, for both
constant and time-varying reference variants. At time zero R0 is 80 in both; effective
80/90 is computed from the actual retained state and provider result. A zero-count source
settles at time 1 without changing state. Restore preserves exact snapshot/save bytes;
reference and D validation at the saved clock agree, and observed TIME calls during
restore retain the authored anchor. Exhausted continuation changes no save bytes. Direct
reference queries use the compiled declaration provider; exact save equality also retains
the allocator/archive representation. No provider or constitutional declaration changes.

Verification: **66 files / 432 tests PASS**, build and reference boundary PASS. The crosswalk
inventory audit retains 51 vectors and 20 evidence files without promoting runtime gates.
Mutation reports are unchanged (81 detected). No production source, accepted contract,
numeric allocation or frozen first-model artifact changed. Full semantic substitution and
remaining inherited-vector review still precede any global release verdict.

## Pass 13 — exact ADAPT batch and read-order witnesses

2026-09-07. Five new tests prove the exact Step=2/n=0 or 3 single-rule topology,
common output/allocator positions, zero-count and false-gate collision rejection before
projection reads, full collision rollback, noncolliding regulatory/procedural permutation,
and two same-path reads with distinct ordered accessors in absent/zero-count/false-gate cases.
The initial reduced-model fixture used type 141 instead of accepted StatePathPattern/149;
three tests failed fixture construction while the noncolliding control passed. Correcting
that fixture type produced a passing suite without production changes.

[Batch mutation proof](CAMPAIGN2_BATCH_MUTATION_PROOF.json) detects four in-memory changes:
omitted collision check, zero-count rule filtering, reversed read evidence and omitted gate
read evidence. Baseline and all five executed-test counts are checked, with no unhandled
errors. Ten reports now total 85 detected mutants. This remains component evidence, not
full AD-E7 or global qualification. No frozen declaration or production file changed.

Verification: **67 files / 437 tests PASS**, build and reference boundary PASS.

## Pass 14 — repair rejection and concrete FCT-C scope review

2026-09-07. AC-H now uses a committed displacement Step=-1 rule. With retained D=20,
a count-one source at Int64.MaxValue-1 successfully yields D=19. At Int64.MaxValue the
same rule cannot rescue the newly invalid retained state: ADAPTATION_REFERENCE_OUT_OF_RANGE
occurs before ingress, with complete state/clock/queue/allocator/output/trace rollback.
This fills the prior hypothetical-repair witness; an early-hook-removal mutant remains open.

Two further tests establish the FCT-C scope problem. An exact generic IDN roster, its
read-only declaration, IdentityKey grammar and roles validate under the generic substrate.
The bounded factory rejects that valid model at its explicit no-read-only check. Roster
state also fails creation and restore before runtime construction. A positive changed-roster
comparison cannot execute through this profile. The [review packet](CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md)
requests an explicit evidence-scope ruling while preserving the generic positive obligation,
frozen profile, accepted EVID/PRJ/IDN semantics and all current gate dispositions.

Verification: **68 files / 440 tests PASS**, build and reference boundary PASS. Inventory:
51 vectors and 23 evidence files, bookkeeping only. Ten reports retain 85 detected mutants.
No production source, accepted contracts, numeric allocations or frozen model bytes changed.
Campaign 2 is not complete. The larger inherited inventory and runtime qualification remain
open; the scope ruling is needed before a defensible FCT-C qualification verdict.

## Pass 15 — accepted FCT-C scope and EVID capability isolation

2026-09-07. **FCT-C PASS, split-scope qualification.** The user accepted the C1/C2/C3
conjunction. Generic production EVID execution now compares valid A/B/absent rosters with
fixed admitted X, V04 registrations and allocator positions. E/L bytes match; handler read
evidence and patches are empty; all roster reads are absent and state is byte-identical.
A valid two-character generic content/REG/IDN substrate is compiled using the production
compilers. Its test-harness identity is not an admitted bounded factory RulesVersion.
The actual production EVID handler is observed, not replaced by hand-built E/L logic.

An important failed hypothesis was preserved. Guarded PRJ construction rejected, but the
original inline semantic handler could read context.state directly and still settle. Thus
empty ReadDomain alone did not meet EVID-F. The transformation moved to evidExecution.ts;
only detached admitted payload, allocated identity and stage selector enter its frozen
operand capability. State/events/registry and admission remain in the host adapter. Both
E and L now reject requests for state, event, trace, parent, content and registry: twelve
exact negative substitutions, each checked across three valid roster states. Inner failure
is ILLEGAL_READ; the scheduler's existing outer carrier is TRANSITION_FAILURE. All cases
show no roster lookup and full transactional rollback. L-side failures occur after the
normal E result, which also rolls back. The exact accepted IDN projected-field declaration
independently fails construction outside EVID's empty ReadDomain.

Harness corrections: the first projection mutant omitted its dataItems import; after that
was corrected, the test still expected the inner code at the outer scheduler boundary.
Assertions were tightened to observe both boundaries, not relaxed to accept arbitrary failure.
Build then identified missing Node-global typing and a spy receiver annotation; explicit
local types fixed both without adding dependencies. The successful guarded test was retained
as partial evidence until the direct-context bypass was addressed; no premature FCT-C PASS
was carried into the final evidence. The machine report preserves the superseded bypass.

[Final FCT-C report](CAMPAIGN2_FCT_C_PROOF.json) joins generic invariance, rejected projection/
capability substitutions and the unchanged bounded roster-declaration/initial-state/restore
exclusion controls. It does not claim a bounded roster-change execution. Other gates remain open.

Verification: **69 files / 442 tests PASS**, build and reference boundary PASS. Frozen model
verification preserves both model digests and six shared artifacts. Separate-process .2
continuation remains 39,786 bytes with SHA-256
32b5129f223484970a42095c48503ca2b4c4e9213dee52f26065aba648b54214.
The runtime-fingerprinted REG/persistence proof was regenerated (its eleven mutants still
detected). Prior ten reports retain 85 detected mutants; the new report separately records
twelve exact capability-rejection substitutions. No contract, allocation or model byte changed.

## Pass 16 — untouched-state invariants and later-challenge decision

2026-09-07. Thirteen AD-F7 component tests now cover explicit zero in each of five maps,
tolerance/load overflow, and unknown domain identities in all five key forms. Every untouched
invalid state rejects creation and restore with INVALID_VALUE before runtime construction.
The empty-input fixture prevents accidental coverage only through an evaluator read. A generic
future-writer control applies a correctly authorized WRT Set of canonical zero, then reaches
the same full-state invariant independently of E. It fails STATE_VALIDATION_FAILURE and rolls
back state, clock, queue, allocators, outputs and trace. It is not an admitted bounded future-writer
profile. No new writer/authority is registered.

[State invariant proof](CAMPAIGN2_STATE_INVARIANT_PROOF.json) detects seven omitted-check
mutants: zero normal form, tolerance/load bounds, regulatory/load/procedure existence and
procedural-family traversal. Eleven existing-style mutation reports now total 92 detected
mutants; the FCT-C report separately proves twelve exact capability-rejection substitutions.
These are component evidence; no whole AD-F7/ADAPT/VAL verdict is silently inferred.

A matched two-instant scope witness retains different adaptation states after first counts
0/1, then supplies the same later count-zero input. Later observation/X/E/L remain identical
with matched allocators. That is correct fixed-pulse behavior, not evidence for the missing
state-to-later-observable response. ADAPT control 9 and PHEN-ADAPT's later opportunity need a
separate governed consumer/observation seam. The [later-challenge proposal](CAMPAIGN2_LATER_CHALLENGE_REVIEW.md)
asks whether a diagnostic readout of accepted R0+D should be the first shape-drafting target,
or whether to start with a broader physiological/procedural response. It allocates and
implements nothing and does not weaken the frozen phenomenon.

Verification: **71 files / 456 tests PASS**, build and reference boundary PASS. FCT-C remains
qualified; the broader campaign remains incomplete. Model/contract/allocation artifacts remain
unchanged; the sole production fix in this continuation is pass 15's EVID capability isolation.
