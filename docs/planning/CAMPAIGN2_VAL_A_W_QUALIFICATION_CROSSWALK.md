# Campaign-2 VAL A–W qualification crosswalk

## Subsequent accepted review and correction

User review ACCEPTED all current vectors except V, with the exact scopes listed
below. Whole VAL is OPEN only on V. The proposed future-profile266 deferral is
REJECTED: the accepted memory successor already contains the required public carrier.
The first-profile-only inference below is retained as a superseded finding, not
current guidance. See [final public memory-role witness](CAMPAIGN2_VAL_V_MEMORY_ROLE_REVIEW.md)
for the executed correction and requested whole VAL qualification. Original proposal
statuses below record the submitted crosswalk, not a rollback of accepted PASS rows.

2026-09-08. Exact review inventory. **Whole VAL and factory remain OPEN.**
Accepted: E in generic canonical-content permutation scope, M, W in character-only
CONTENT scope. Other PASS entries below are proposals for the explicitly bounded
evidence, not recorded acceptance. PERSIST-A..H PASS is inherited only where its
actual witness supports a VAL clause; PERSIST-I remains DEFERRED / NOT PASSED.

## Evidence keys

All test paths below are under `src/test/`; report paths are in this directory.
Keys refer to the named test or mutant, not every assertion in a file.

| Key | Exact evidence |
|---|---|
| QC | `campaign2QualificationClosure.test.ts`: VAL-A/B/S opposite legacy predicates; VAL-F labels; VAL-H immediate copying; VAL-R cyclic content; VAL-C content-only identity |
| FB | `campaign2ValFinalBoundary.test.ts`: VAL-B post-commit same-ID handler replacement; VAL-J/V nine declaration errors; VAL-V actual 265 and 278 declared-role errors |
| CB | `campaign2ContentBoundaryClosure.test.ts`: VAL-E two-character permutation; VAL-M invariant override; two VAL-W exact-carrier/empty-domain tests |
| VD | `campaign2ValDeclarations.test.ts`: exact authored/runtime origin, generic minimal content, all-three-position closure, unsupported operands, detached references, empty-content tests |
| FACT | `campaign2Factory.test.ts`: FCT-A/F data-only boundary, FCT-A/E wrong model/original manifest, FCT-5 exact continuation, failed/mid-settlement controls |
| PAR | `campaign2ModelAdmissionParity.test.ts`: nine unused/incomplete model variants through prepare/restore; canonical permutations |
| SCH | `campaign2SchemaClosure.test.ts`: 175 descriptors × omission/version × prepare/restore = 700 calls |
| PACK | `campaign2ModelPackaging.test.ts`: MODEL-PACK-B/E shapes/compatibility; C source snapshot; H nested occurrence role without slot-five references |
| CONTENT | [572-case comparison and seven mutants](CAMPAIGN2_INDEPENDENT_CONTENT_PROOF.json); `campaign2IndependentContent.test.ts` |
| ROLE | [234-case origin/role comparison and seven mutants](CAMPAIGN2_INDEPENDENT_ROLE_PROOF.json); `campaign2IndependentRoles.test.ts` |
| DECL | [359 construction-labelled cases and eleven mutants](CAMPAIGN2_DECLARATION_COVERAGE_PROOF.json); `campaign2DeclarationCoverage.test.ts` |
| AMBIENT | [20 fixed-input cases and ten dependency mutants](CAMPAIGN2_FORBIDDEN_DEPENDENCY_PROOF.json); `campaign2ForbiddenDependencies.test.ts` |
| PRJ | [six required-projection substitutions](CAMPAIGN2_PRJ_SUBSTITUTION_PROOF.json); `campaign2TransitionAdmission.test.ts`, “required projection accepts only admitted input” |
| STATE | [thirteen controls and seven state mutants](CAMPAIGN2_STATE_INVARIANT_PROOF.json); `campaign2UntouchedState.test.ts` |
| REG | [252 REG comparisons and persistence substitutions](CAMPAIGN2_REG_PERSISTENCE_MUTATION_PROOF.json) |
| GATE | [72 gate cases and six mutants](CAMPAIGN2_INDEPENDENT_GATE_PROOF.json) |
| BATCH | [five batch tests and four mutants](CAMPAIGN2_BATCH_MUTATION_PROOF.json) |
| CONT | [two-process exact factory continuation](CAMPAIGN2_TRACE_CONTINUATION_PROOF.json): exact checkpoint and continued full save, no original initial-state transfer |
| META | [state-scan](CAMPAIGN2_METADATA_STATE_SCAN_PROOF.json) and [build-inventory](CAMPAIGN2_BUILD_METADATA_PROOF.json) save/restore substitutions |

## Definitive vector table

Current-source refresh: [five refreshed assays](CAMPAIGN2_VAL_EVIDENCE_REFRESH.json)
re-execute CONTENT, ROLE, DECL, AMBIENT and REG/persistence because their recorded
source fingerprints had changed since the historical reports. All baselines pass
and all **46 mutants** are detected. The manifest links the separate current
`*_VAL_REFRESH.json` reports and preserved historical originals. Use the refreshed
reports for current-source composition; the evidence keys retain original links
for historical limitations and failed attempts. PRJ, STATE, GATE and BATCH recorded
source fingerprints still match current source. No old report was overwritten.

| Vector | Frozen obligation | Exact production surface | Positive witness | Negative/mutant witness | Scope | Proposed status |
|---|---|---|---|---|---|---|
| VAL-A | Opposite callbacks under identical declarations; reject interface; actual legacy control | factory ownData; retained CONTENT builder | QC same semanticKindId/declarations | QC legacy accepts one/rejects opposite; both rejected publicly without invocation | Current data-only factory | Propose PASS |
| VAL-B | Post-manifest same-ID callback or handler replacement cannot enter | prepare/create/restore facade | QC computes model/run/save first; FB retains exact model/registry/save | QC same-ID predicates; FB replaces execute under actual registered event ID after commitment, rejects three boundary calls, neither function called | No caller handler installation exists | Propose PASS |
| VAL-C | Admitted behavioral operand changes commitment; content-only identity counterpart | modelPackaging/adaptationEvaluation | `campaign2IndependentAdaptation.test.ts` VAL-C Step change; QC content-only lifecycle changes ContentIdentity only | Changed declaration is compared with original; no invalid model counted as positive | Existing rule language; lifecycle test claims identity only | Propose PASS |
| VAL-D | Fixed version, changed semantics is a nonconforming build | Closed interpreters in branch matrix below | Each report baseline | Named interpreter substitutions below DETECTED under unchanged declarations | Finite language/alternatives, not universal interpreter equivalence | Propose PASS in stated finite scope |
| VAL-E | Permute content/registry; duplicates reject | CONTENT/VAL canonical compilation | CB generic two-character permutation; PAR exact model/restore | VD duplicate content StableId; FB duplicate declaration StableId | Generic canonical-content/component scope; first model stays one-character | ACCEPTED PASS |
| VAL-F | Presentation-only change leaves admission/identities/results invariant | compileContentDefinition → factory | QC opposed labels: exact canonical content, ModelIdentity, full empty-run save | Labels include hostile predicate text; no interpretation | Presentation exclusion, no behavioral semantics added | Propose PASS |
| VAL-G | Mutable/ambient/counter/clock/RNG cannot become undeclared validation input | VAL compiler/qualifyCharacter; factory ownData | QC/PACK copies; AMBIENT zero baseline reads | Ten ambient interventions and direct dependency mutants; FACT getter/override exclusions | Explicit ambient stand-ins and capability boundary; not arbitrary host-access proof | Propose PASS in named finite scope |
| VAL-H | Caller mutation cannot alter compiled declarations/semantics | prepare/create/restore snapshots | QC all content/registry/parameter and run/save/input bytes; model/save equal | Immediate post-call byte overwrites; FACT returned-byte isolation; PACK snapshot | Exact tested buffers and compared model/save/state/output/trace surfaces | Propose PASS |
| VAL-I | Complete manifests mandatory; digest/name-only runtime objects reject | ownData/modelFacts/restore | FACT genuine prepared handle and manifest continuation | FACT forged handle, caller identity/overrides, missing original input; PAR incomplete source/unsupported version | Closed public facade | Propose PASS |
| VAL-J | Wrong namespace/kind/schema/version/field and duplicates reject deterministically | registry decode, VAL declarations | Valid firstTrace baseline in FB/VD | FB nine public variants; VD wrong identity text/namespace; SCH complete descriptor omission/version | Rejection tested; not a new universal error-message precedence rule | Propose PASS for listed challenge classes |
| VAL-K | Complete minimal 170 admits without psychology; missing required fields reject | CONTENT specialization | VD generic minimal content; CONTENT valid DAGs | CONTENT all sixteen required-field omissions | Generic 170/1; frozen one-character admission remains separate | Propose PASS |
| VAL-L | Authored character only; runtime/unresolved/wrong qualification fails independently of recognition | qualifyCharacter / validateRole / IDN | ROLE authored cases; VD exact qualification; AMBIENT invariance | ROLE origin/namespace/carrier mutants; VD wrong kind rejected at content construction | Unsupported kind never yields a committed wrong-kind character in current specialization | Propose PASS in current domain |
| VAL-M | Detached/missing/cyclic references reject despite invariant prose | compileContent → governed manifest | Valid baseline in CB/VD | CB 12 paired negatives, exact carrier/cause/no runtime; VD detached registry mismatch | Current reference closure | ACCEPTED PASS |
| VAL-N | Same-declaration PRJ extraction/source/role changes detected | compileRequiredProjections | PRJ generic admitted-input control | Six named PRJ substitutions; VD role traversal/ROLE checks | Generic PRJ fixture; zero-read EVID not misrepresented as positive roster branch | Propose PASS in inherited component scope |
| VAL-O | Supplied state/REG/ADAPT/persistence semantics reject; internal substitutions detected | facade plus branch matrix | FACT/QC accepted baseline; STATE/REG/GATE/META baselines | Public overrides rejected; exact listed internal substitutions DETECTED | Each owned interpreter, not anonymous callback authority | Propose PASS in listed finite scope |
| VAL-P | Fresh-process declaration reconstruction/continuation; bad model/version and saved-label handler selection fail | restoreCampaign2Run → exact profile compiler | CONT two processes, exact full save continuation | FACT receiving-model and override rejection; PAR unsupported RulesVersion; FB post-commit handler rejection on restore | Original bounded facade; no memory-prefix inference | Propose PASS |
| VAL-Q | Independent finite CONTENT specialization agrees | compileValDeclarations.compileContent vs independentCharacterContent | CONTENT 572 labelled cases, exact accepted bytes | Seven CONTENT mutants DETECTED | Shared codec and setup; finite character specialization, not general compiler equivalence | Propose PASS in finite scope |
| VAL-R | Valid registry then invalid content publishes no authority; scheduled failures roll back | VAL → ModelIdentity → runtime; scheduler transaction | QC valid baseline and reached VAL stage | QC cycle: no identity/runtime; EVID rollback and FACT failure controls | Earlier missing-field assay was insufficient and remains recorded as such | Propose PASS |
| VAL-S | Same-ID caller predicate rejected; internal altered predicate fails qualification | public ownData versus internal qualifyCharacter | QC fixed role/governed declarations | QC predicate interface rejection; ROLE admit-runtime/skip-resolution/carrier substitutions DETECTED | Admission rejection and build qualification explicitly distinct | Propose PASS |
| VAL-T | Current unsupported RequiredSemanticKind changes declaration and rejects; future second-kind positive conditional | VAL 330 operand, model commitment boundary | FB compares exact original/changed registry bytes and commitment digests | FB changed RequiredSemanticKind rejects prepare/restore before ModelIdentity/runtime creation | Commitment of bytes does not admit the unsupported kind; conditional positive retained below | Propose PASS current obligations only |
| VAL-U | Named roster/domain/recognition/body/state/activity/clock/RNG/presentation/trace dependencies excluded/detected | qualifyCharacter | AMBIENT 20 cases, zero baseline ambient reads | Every one of ten direct ambient dependency substitutions DETECTED | Test stand-ins, fixed canonical declarations; no arbitrary-host claim | Propose PASS in named finite scope |
| VAL-V | Exact definition/role closure in three positions, shared/optional roles and restore | VAL visit/role plus public model preparation | DECL three positions, sharing and absent-validator cases; PACK nested278 | DECL omitted-position mutants; FB real265/278 public negatives and orphan parity; details below | Generic 266 supported, no first-profile declaration slot demonstrated | OPEN: generic266/public-profile scope ruling needed |
| VAL-W | Unsupported kind exact content error/no fallback; empty/minimal domain rules | CONTENT specialization and facade | CB generic empty/no kind; VD complete character | CB exact unsupported-kind prepare/restore; missing kind; QC real legacy negative | Current character-only CONTENT specialization | ACCEPTED PASS |

**T-positive-second-kind: FUTURE CONDITIONAL / DEFERRED / NOT PASSED; not a current
profile blocker.** Trigger: separately accepted second kind and corresponding
validator binding. Do not manufacture either for qualification.

## Admitted semantic branch → mutant matrix

These rows name interpreter branches, not every numeric input. Baseline and mutation
results are the recorded finite reports; no historical report is silently rerun or
rewritten. A detected mutant means changed software failed qualification, not that
the unchanged factory can detect an arbitrarily modified implementation of itself.

| Branch | Authoritative dependency set | Targeted mutant | Test/report | Expected result | Actual result | Scope | VAL |
|---|---|---|---|---|---|---|---|
| CONTENT kind/reference interpreter | 170/1 fields, governed kind and committed IDs | skip-cycle-check; skip-registry-reference-existence; substitute-authoritative-field; skip-reference-uniqueness/order-normalization | CONTENT | Wrong acceptance/bytes | DETECTED, seven total | Finite graphs and malformed/boundary inputs | D/G/Q |
| DomainValidator | Exact authored origin, complete stable identity, committed kind | skip-committed-resolution; compare-stable-payload-only; admit-runtime-as-character; replace-qualification-error-carrier | ROLE | Acceptance/carrier mismatch | DETECTED, seven total | 234 finite role/origin cases | D/L/S |
| Qualification dependency exclusion | Same canonical identity/content; no ambient inputs | roster, candidateDomain, recognition, body, state, activity, clock, rng, presentation, trace | AMBIENT | Ambient read and changed admission | All ten DETECTED | Boolean stand-ins, not new domain semantics | G/U |
| PRJ extraction/source/role | Admitted payload, declared selector/path, same state snapshot and roles | select-occurrence-instead-of-observer; expose-roster-wrapper; lose-source-wrapper-evidence; skip-required-presence-carrier; skip-roster-static-read-ban; skip-required-roster-projection | PRJ; VD/ROLE for role validation | Existing admitted-input control fails | Six DETECTED | Generic PRJ; inherited assertion-based proof | D/N |
| State/leaf validation | Declared grammar/domain and complete retained state | omit-zero-normal-form; omit-tolerance-bound; omit-load-bound; omit-regulatory/load-domain-existence; omit-procedure-existence; skip-procedural-state-family | STATE | Invalid state admitted or required failure lost | Seven DETECTED | Initial/restore and generic future-writer control | D/O |
| REG | Immutable model anchor/parameter, C,V,T and signed D | reference-at-zero; adapted-bound-at-zero; ignore-displacement; exclude-valid-endpoints; truncate-negative-time-rate | REG | Independent scalar/boundary disagreement | Five REG mutants DETECTED | 252 comparisons; shared transport/setup | D/O |
| ADAPT applicability/batch | Exact admitted basis/key/count, declared rules, frozen snapshot | filter-zero-count-rule; omit-batch-collision-check; reverse-target-gate-read-evidence; omit-gate-read-evidence | BATCH | Output/read/collision challenge fails | Four DETECTED | Five targeted batch witnesses, not all ADAPT semantics | D/O |
| ADAPT gate/update | Frozen declared gate/target, signed Step, domain | ignore-frozen-gate; invert-frozen-gate; use-target-as-gate; discard-step-sign; emit-set-for-baseline; emit-unchanged-set | GATE | Independent expected state/patch differs | Six DETECTED | 72 cases, accepted model variants | D/O |
| Persistence projection | Admitted closure; original manifest; saved state/time | invented anchor/RNG/coupling metadata; restore-validates-time-zero; save/restore state scans and build inventory | REG, META | Exact metadata/restore or pre-runtime boundary fails | Recorded substitutions DETECTED | Accepted bounded no-RNG PERSIST-A..H; not PERSIST-I | D/O/P |

## Declaration and position closure audit

| Clause | Concrete witness | Public prepare/restore coverage | Remaining limitation |
|---|---|---|---|
| Wrong namespace / RegistryKind / version / definition carrier | FB named nine-variant control; VD unsupported declarations | Both, empty original manifest, no runtime | FB asserts rejection, not every exact diagnostic carrier |
| Missing referenced definition / duplicate entry / unresolved kind operand | FB named cases; DECL coverage cases | Both for FB | Duplicate byte-identical set elements reject canonically; unequal same-ID case is FB |
| Unknown/extra field | FB extra field99 in 330; VD unknown role field | Both for FB | Other record layouts not exhausted; 700 descriptor calls do not substitute |
| Orphan definition | DECL validator-only/unreferenced cases; VD mismatch; FB strips every optional validator reference but retains definition | Both FB paths reach VAL and reject coverage mismatch before runtime | No execution needed: empty input manifest |
| CanonicalRoleConstraint.Role (265/2) | DECL constraint cases and omission mutant; FB real declared265 | Both FB paths, VAL reached twice before runtime | Positive/shared generic cases separate |
| EventDependentProjectedFieldRequirement.OutputRole (266/4) | DECL projection cases and omission mutant; PRJ required-input fixture | No exact admitted first-profile carrier demonstrated | Do not inject266 into an unrelated field and call it an admitted projection. Generic positive does not prove public restore traversal by itself. |
| OccurrenceIdentityRule.IdentityRole (278/2) | DECL occurrence cases and omission mutant; PACK-H; FB real declared278 | Both FB paths, VAL reached twice before runtime | Empty original inputs prove declared role checked even unexercised |
| Shared references / absent optional validator | DECL shared-three-positions and namespace-only cases; VD all-three-position tests | Original profile shares roles; exact intervention primarily generic | No claim of whole independent declaration compiler |

## Execution and next exact gaps

FB's six new tests PASS; TypeScript PASS. These add the post-commit handler
replacement, nine declaration classes at two public surfaces, and unexercised
265/278 role rejection at both surfaces, explicit T commitment/pre-publication
observation, and public orphan-definition parity. Five focused files / 24 tests
PASS. Test-only TypeScript narrowing/extra-field
typing errors were corrected before the successful run; no production defect.

The remaining scope question is how to report the generic266 component versus the
first-profile public boundary. `compileRequiredProjections` is an exported generic
component; active Campaign-2 production source has no call to it. The bounded
compiler supplies zero-read EVID and no roster requirement slot. DECL proves all
three role positions, including266, and its omitted266 mutant; this does not
demonstrate a public-factory projection declaration or its restore.

The [crosswalk inventory audit](CAMPAIGN2_VAL_CROSSWALK_AUDIT.json) checks exactly
one row for every A–W vector and linked-report existence. Actual first-profile
declaration record counts are 265=58, 266=0, 278=6. These are record occurrences,
not schema descriptors; their count is not behavioral proof. Reproduce with
`node scripts/audit-campaign2-val-crosswalk.mjs`.

Recommended ruling: retain full generic VAL-V role traversal evidence, qualify
the original public profile only for its actual265/278 declaration positions,
and retain public266 prepare/restore as mandatory when an accepted profile supplies
that carrier. Do not mark that future public witness PASS or invent a projection
carrier. This is a proposed scope ruling, not an accepted alteration of VAL-V.
No second kind, widened roster profile or fabricated declaration is authorized.
The table does not promote the remaining proposals or close whole VAL/FCT.

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
