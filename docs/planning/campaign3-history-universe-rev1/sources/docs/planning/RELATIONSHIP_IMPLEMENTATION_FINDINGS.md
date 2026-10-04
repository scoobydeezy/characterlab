# RELATIONSHIP implementation findings — 2026-09-21

REL-IMPL-001: the first boundary-test file missed the record-type argument and closing
parenthesis in an inherited-codec rejection fixture. TypeScript rejected it before
the boundary tests ran. The queued preservation run loaded the corrected fixture and
passed84 tests (RELATIONSHIP_PRESERVATION_TESTS_REV1.json); that receipt is not a failed
run. The final suite additionally strengthens fault and simultaneous-participant
coverage. These test corrections change no production, model, contract or plan bytes.

REL-FIND-001: score-win probabilities and effective choices differ under inherited
Auto arbitration. The matrix records both. The matched acquisition witness uses
equal known-negative current person estimates: shared-history comfort balances that
situational modifier, yielding an unresolved contact choice; without shared history,
the alternative wins Auto. This ensures the contrast changes actual choice semantics,
not just an unused analytical probability. No new weighted-random sampler is introduced.

REL-FIND-002: stable authored probe roots, enumerated in model content before freeze,
keep observer RNG independent of sibling allocation order. Reverse-order comparisons
normalize only1156 occurrence provenance; random addresses, draws, probabilities and
choices remain semantically identical. Access/private-source comparisons require raw
byte equality, without normalization.

REL-FIND-003: SharedHistory also fails on a source involving both participants. Copying
A's update into B's journal before B learns its own observation tries to append a
second entry at the same instant, violating the journal's one-entry-per-observer/source
ordering invariant. The transaction rejects and rolls back. Safe derived and stored
models retain one distinct entry per observer. This is an additional diagnostic failure
of the deliberately conflating control, not a supported reciprocal-interaction model.
The frozen public matrix uses its single-participant case, which completes but violates
nonrecipient isolation. The broader control failure is separately tested and preserved.

REL-FIND-004: fault coverage was strengthened from a statement-only instant to the
breach instant after four committed steps. This reaches an actual history mutation
and intermediate cache mismatch before rollback, as well as both observer response
draws. Passing a fault test with no changed cache would not alone prove cache rollback.

REL-FIND-005 — behavioral gate failure and correct-forward successor: the full REV1
matrix completed24 runs but failed its effective-response contrast. The inherited
task-reason dice disable standing and situational modifiers, so different histories
and person modifiers produced different appraisal/raw records but equal1/2 responses.
RELATIONSHIP_CALIBRATION_AUDIT_REV1.json identifies the precise cause: the old unit is1
with cap3; bounded magnitude1/2 divided by1 truncates to0. The successor unit1/4 yields
modifier magnitude2. Cap3 and activation0 are unchanged. This is not a cap-zero bug.
The original public test's comparison of whole response records was too weak because
those records embed the differing appraisals. Structural inequality was not evidence
of behavioral consequence. The frozen assertion on effective probabilities caught it.

Preserve campaign3-relationship-model-rev1, RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV1.json
and RELATIONSHIP_PUBLIC_EXPERIMENT_FAILURE_REV1.json unchanged. They are a failed
behavioral cohort, not a qualified relationship model. The qualifier script for that
cohort is retained as qualify-relationship-public-rev1.mjs.

relationship-public/0.2-candidate is an explicit correct-forward contract, using the
existing AFFECT/WORKSPACE modifier calibration: unit1/4,cap3 for both roles, unchanged
die bands and activation0. Its successor model and input plan are frozen separately
as REV2. Both versions remain accepted by the public factory for replay; a regression
asserts that the0.1 cohort remains non-discriminating, including whole-save restore.
No old bytes were overwritten and no new architecture edge or universal law is chosen.
The strengthened test compares effective response probabilities directly. RO-C3-016
must retain this finding: an active-looking appraisal or reason trace does not prove
that the selected calibration actually affects response.
