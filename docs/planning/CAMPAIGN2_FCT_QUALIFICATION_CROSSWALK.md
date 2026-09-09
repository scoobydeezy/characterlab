# Campaign-2 factory qualification crosswalk

2026-09-08. Current reconciliation after whole VAL acceptance. This is not a factory
release verdict. The [historical matrix](CAMPAIGN2_FACTORY_GATE_MATRIX.md) remains
unchanged as checkpoint evidence. Exact obligations are in
[factory design](CAMPAIGN2_FACTORY_DESIGN.md). Work-package numbers and controls
are separate; passing one control does not automatically pass its work package.

Whole current VAL is QUALIFIED in its [recorded scopes](CAMPAIGN2_VAL_A_W_QUALIFICATION_CROSSWALK.md).
PERSIST-A..H PASS for the original bounded no-RNG profile; PERSIST-I is DEFERRED /
NOT PASSED. Memory prefix replay is separately governed. FCT-C already has an
accepted generic-positive / bounded-exclusion split. None of these is whole FCT.

## Work packages

| Gate | Frozen obligation | Exact evidence now available | Current disposition / remaining work |
|---|---|---|---|
| FCT-1 | Frozen260..330 codecs and immutable intake; schema/member/version/field admission | `campaign2Codecs.test.ts` all71 records,32 union entries, required fields, unknown tags/fields, finite values and nested substitutions; `campaign2SchemaClosure.test.ts`175 descriptors/700 calls; accepted allocation audits and VAL-H/J | Evidence ready for scoped structural review. New raw-decoder negatives below fill the builder-only omission gap. No domain correctness inferred from round trips. |
| FCT-2 | Closed329 CONTENT and330 validator interpreters; three-position reference closure | Accepted whole VAL; CONTENT/ROLE/DECL current-source refresh; real public memory266 and dual-defect precedence, original265/278 | Evidence ready for composition review, with generic/first-profile/memory surfaces stated separately. No new general independent compiler required or claimed. |
| FCT-3 | PRJ/IDN, owned state/model validation, REG/ADAPT definition compilation | VAL-N/O, six PRJ substitutions, STATE/REG construction mutants, declaration coverage, exact REG and failure-stage witnesses | OPEN: finish inherited REG/ADAPT/PRJ construction and precedence mapping. Accepted VAL's targeted scope does not silently pass every inherited seam vector. |
| FCT-4 | EVID/source/bridge/ADAPT integration and phase140 batch | Real trace continuation; EVID rollback/persistence and generic roster controls; bridge substitutions; batch/gate/ADAPT proofs; accepted PHEN-ADAPT | OPEN: exact EVID and ADAPT input/output/no-write/route and fault matrix remains to reconcile. Parent phenomenon PASS is preserved, not treated as all seam controls passing. |
| FCT-5 | Restricted create/restore, work bound, shared validation and exact pending sources | FACT FCT-5 continuation and FCT-A/E manifest controls; PAR unused/incomplete exclusions; accepted bounded PERSIST; restore-stage inventory; VAL-B/E/H/I/P/R/S | Evidence ready for original-facade composition review. Memory's S0/prefix path is not used to reinterpret this facade. |
| FCT-6 | Finite independent comparisons and release evidence; semantic-branch mutants and exact results | VAL branch matrix; five current-source refreshed assays/46 mutants; unchanged-source PRJ/STATE/GATE/BATCH reports; preserved failed assays | OPEN: compose with FCT-3/4 remaining inherited witnesses. Historical92-mutant count is not a current exhaustive coverage claim. No release from a test count alone. |

Test shorthand FACT = `src/test/campaign2Factory.test.ts`; PAR =
`src/test/campaign2ModelAdmissionParity.test.ts`. Other named tests are under `src/test/`.
Current refresh paths and limitations are in `CAMPAIGN2_VAL_EVIDENCE_REFRESH.json`.

## Factory controls

| Gate | Frozen obligation | Exact evidence / argument | Proposed disposition |
|---|---|---|---|
| FCT-A | Caller digest/identity cannot override declarations | FACT FCT-A/F rejects supplied identity and forged capability; FCT-A/E rejects changed receiving model; VAL-C changed Step/content commitments; final-boundary same-ID handler test | Propose PASS, original data-only facade scope |
| FCT-B | Unknown unused registry/schema/version/StableId relation rejects | PAR nine variants through prepare/restore with empty inputs; final-boundary nine declaration classes; SCH700 descriptor omissions/version changes; full closed-kind dispatch inventory | Propose PASS for frozen challenge classes; not all malformed bytes |
| FCT-C | Fixed safe X with roster intervention preserves E/L/zero reads; projection injection rejects | Accepted `CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md` and `CAMPAIGN2_FCT_C_PROOF.json`: generic A/B/absent roster positive,12 capability substitutions, bounded exclusion | ACCEPTED PASS, exact split scope retained |
| FCT-D | No public metadata override; internal derivation alternatives detected | FACT/QC public overrides; REG/persistence refreshed mutants; separate actual-state scan and build-inventory substitutions; accepted PERSIST-H | Propose PASS bounded no-RNG scope; PERSIST-I remains unpassed |
| FCT-E | Invalid semantic restore publishes no scheduler/events/allocator/state/trace/output | FACT metadata/pending/retained-value negative constructor observations and unchanged saves; saved-time REG stage witness; `CAMPAIGN2_BOUNDED_RESTORE_STAGE_INVENTORY.md` | Propose PASS original facade reachability/finite-negative scope; no assertion that memory prefix replay constructs no internal replay runtime |
| FCT-F | Same-shaped OBS/SEM callbacks cannot bind; internal substitutions detected | FACT callback/handler boundary; post-commit handler witness; `CAMPAIGN2_BRIDGE_SUBSTITUTION_PROOF.json` five fixed-declaration substitutes | OPEN for complete inherited OBS/SEM mapping; separate public rejection from internal build qualification |

## New raw-decoder boundary control

The existing required-field loop challenged the convenience record builder. The
new test challenges the production decoder directly: encode a malformed record
with a permissive local descriptor, then decode against the fixed authoritative
schema inventory. All71 records reject each required-field omission, an unknown
field999, and schema-version drift. No permanent schema/member is allocated.

The table inventory has156 required fields: **156 omission cases +71 unknown-field
cases +71 version cases =298 decoder rejection calls**. This supplements the700
public descriptor calls, rather than adding them into a misleading test count.
Two focused files /13 tests PASS; TypeScript PASS. No production code changed in
this pass. These controls assert structural rejection, not domain admission or
independent decoder equivalence.

## Next exact runtime work

Use the [inherited vector inventory](CAMPAIGN2_INHERITED_VECTOR_CROSSWALK.md) as a
checklist, not a current verdict. Some rows have later witnesses (REG-Q shared
parameter controls; accepted PHEN-ADAPT; VAL and bounded persistence); reconcile
those rather than rerunning settled research. Real remaining examples to inspect:

- EVID-J/L and REG-R now have the additional bounded witnesses recorded below;
  complete publication/fault and integrated bridge mapping remain separate.
- REG-M/R and AD-E2/3/4: exact remaining construction/key/role/applicability mutant
  clauses, including inert-copy ownership scope and wrong-key integration.
- FCT-F: map each fixed bridge substitution to the relevant inherited OBS/SEM
  obligation without claiming the restricted bridge exercises general recognition.

No new architecture, model language, allocation or blanket activation is requested.
Reference trace/paired/correct-forward controls remain preserved. Campaign2 is OPEN.

## Additional inherited runtime witnesses, 2026-09-08

These supplement the historical inherited-vector inventory without rewriting its
checkpoint dispositions. They are test evidence, not whole FCT acceptance.

- **EVID-J:** `campaign2TransitionAdmission.test.ts` constructs a real302 tolerance
  leaf and unchanged-value Set patch. The actual first model state/domain checks
  and regulatory-adaptation authority accept it, yielding one structural diff and
  identical state bytes. Both EVID stages reject that patch with
  `TRANSITION_WRITE_FORBIDDEN`; rejection consumes no further allocation and a
  subsequent valid completion remains possible. Existing malformed-output/write
  precedence controls remain. This fills the globally valid no-op-patch clause,
  not every scheduler publication/fault obligation.
- **REG-R:** `campaign2RegulatoryReference.test.ts` places an inert120 parameter
  record in governed content's lifecycle field. The REG provider remains identical
  at0,1 and INT64_MAX; the inert bytes remain present and acquire no REG ownership.
  Four mutations reject: wrong-family map key, embedded parameter identity,
  governing anchor, and all three together. The production compiler owns rejection;
  no additional registry or validator is introduced.
- **EVID-L:** four producer-derived controls cross observer event continuation /
  splitting with incomplete all-true feature support / explicit-false conjunction.
  Accepted Campaign-1 track/event transitions, binding compiler, event classifier
  and experience assembler produce the carrier. Continued continuant identity,
  distinct or shared event files, unresolved role evidence, missing classifications
  and a nonempty false classification survive both E/L nested canonical copies.
  Exactly two EVID output identities are allocated per case. The adapter still
  supplies the trusted consequence-freeze boundary: this proves Campaign-1
  producibility plus EVID carriage, not full SEM-H truth-to-sensory reservation or
  first-profile ability to produce every generic perceptual feature. False tracking
  and segmentation remain observer-side; no truth correction enters the test path.

The first producer assay incorrectly expected missing conjunction evidence despite
an already false prerequisite. The production classifier correctly returned false.
The corrected missing-feature fixture supplies only true observed prerequisites;
the explicit-false case retains its false prerequisite. This was a fixture correction,
not a semantic or runtime change. The failed assay is not qualification evidence.

Validation: TypeScript PASS; transition admission16 tests PASS after that fixture
correction; regulatory reference10 and REG exact witnesses5 tests PASS. No production
source, model, allocation, accepted persistence scope or phenomenon changed in this
additional pass. Historical substitution reports are not silently refreshed merely
because test files gained controls.

### AD-E2 bounded dispatch controls

`campaign2FrozenGateOrder.test.ts` now checks the existing isolated two-rule
specimen with a nonbaseline gate source. Both matching rules remain in the dispatch
and both evaluations exist; the gated load result is NoOp while tolerance advances
from1 to2. Its already empty procedural resolver, given an admitted practice fact,
still emits exactly one dispatch with no applicable rules, evaluations, reads or
patch operations, and identical state bytes. Both tests in that file PASS.

This is the empty-resolver clause, not yet the distinct wrong-referent challenge
against a nonempty resolver. State-dependent applicability substitution remains
open. Initial test-authoring failures misread the polymorphic trace output carrier
and guessed result/fact schema names; corrected assertions use the existing typed
record builders and ADAPT list carrier. No production behavior changed.

### AD-E2 applicability substitutions and REG-P, follow-up

The later `campaign2FrozenGateOrder.test.ts` assay adds the distinct wrong-referent
challenge against the same nonempty regulatory resolver. A runtime-origin exposure
identity is constructed through the accepted origin helper; it is not a second
CharacterId, CONTENT kind or permanent member. The public factory admits the input,
then produces one empty dispatch with no evaluations, reads or patch and unchanged
state. The false-gate and empty procedural resolver cases remain separate controls.

`scripts/prove-campaign2-applicability.mjs` records a passing two-test baseline and
three detected fixed-declaration substitutions in
`CAMPAIGN2_APPLICABILITY_PROOF.json`: ignoring the referent match, omitting an empty
dispatch, and filtering evaluations by frozen state. Each substitution fails the
AD-E2 control. Transformation anchors must match exactly once, unhandled errors are
excluded, and source/test fingerprints remain unchanged during the assay. Earlier
gate/batch reports remain historical; this report is additive. This fills the named
AD-E2 challenges without declaring whole ADAPT or factory qualification.

`campaign2RegExactWitnesses.test.ts` adds REG-P queries through the actual provider
captured during public model preparation. Three queries at T=2 precede and three
follow an actual phase-140 D=0→1 write. Each query block preserves the complete
canonical save and public snapshot, including allocator/queue commitments; R0 stays80,
the authored anchor remains80 at0 with zero authored remainder, and each TIME result
has exact remainder2. Registry bytes remain unchanged. Existing late-failure rollback
controls remain separate; this addition fills the same-T write/query observation.
Six exact REG tests PASS. No production implementation or frozen model artifact changed.
