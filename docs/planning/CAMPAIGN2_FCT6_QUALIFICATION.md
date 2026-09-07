# FCT-6 independent qualification — pass 1

2026-09-06. **COMPONENT EVIDENCE; FCT-6 and formal VAL closure remain open.**
Target: frozen rules/campaign2-bounded-bridge/0.2-candidate, ModelDigest
`57e0d7de1de0ffad564ebef4af5ce6b5a3b515069dc85df48f181f5629d1f39b`.
No production source, model declaration, identity, allocation or accepted semantics changed
in this pass. The tests exercise implementations under the accepted declarations.

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
