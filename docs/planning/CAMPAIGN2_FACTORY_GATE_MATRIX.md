# Campaign-2 factory qualification evidence map

2026-09-07, pass 16. **Inventory, not a release verdict.** The frozen .2 first-model
packet and accepted semantics are unchanged. Canonical gate meanings come from
[factory design](CAMPAIGN2_FACTORY_DESIGN.md), [VAL](VAL_001_DRAFT_RESOLUTION.md),
and [persistence](CAMPAIGN2_PERSISTENCE_CLARIFICATION.md). Component evidence does not
change other formal NOT PASSED dispositions; FCT-C is the specifically qualified split-scope exception below. This map covers FCT, VAL and PERSIST;
it is not yet the complete inherited EVID/ADAPT/REG/PRJ/OBS/SEM vector crosswalk.

Evidence shorthand names the actual source test or machine report:

| Key | Evidence |
|---|---|
| Factory | `src/test/campaign2Factory.test.ts` |
| Packaging | `src/test/campaign2ModelPackaging.test.ts` |
| VAL | `src/test/campaign2ValDeclarations.test.ts` |
| Admission | `src/test/campaign2TransitionAdmission.test.ts` |
| Trace | `src/test/campaign2TraceBinding.test.ts` |
| EVID rollback | `src/test/campaign2EvidRollback.test.ts`: four actual-factory fault points, full internal scheduler rollback; test-only instrumentation |
| EVID persistence | `src/test/campaign2EvidPersistence.test.ts`: empty input, zero-count positive, archived E/L rejection before construction and exact archive/ID continuation |
| Content oracle | [572-case content comparison and seven mutants](CAMPAIGN2_INDEPENDENT_CONTENT_PROOF.json) |
| Role oracle | [234-case role comparison and seven mutants](CAMPAIGN2_INDEPENDENT_ROLE_PROOF.json) |
| ADAPT oracle | `src/test/campaign2IndependentAdaptation.test.ts`, 286 scalar cases and declaration-effect witness |
| Gate oracle | [72 FrozenBaseline cases and six mutants](CAMPAIGN2_INDEPENDENT_GATE_PROOF.json) |
| REG/persistence | [252 REG comparisons, five persistence checks, eleven mutants](CAMPAIGN2_REG_PERSISTENCE_MUTATION_PROOF.json) |
| Continuation | [separate-process exact trace continuation](CAMPAIGN2_TRACE_CONTINUATION_PROOF.json) |
| Declaration corpus | [359 construction-labelled cases and eleven mutants](CAMPAIGN2_DECLARATION_COVERAGE_PROOF.json) |
| Bridge substitutions | [five OBS/SEM factory substitutions](CAMPAIGN2_BRIDGE_SUBSTITUTION_PROOF.json) |
| PRJ substitutions | [six inherited generic PRJ control substitutions](CAMPAIGN2_PRJ_SUBSTITUTION_PROOF.json) |
| Ambient dependencies | [twenty fixed-input cases and ten test-only dependency mutants](CAMPAIGN2_FORBIDDEN_DEPENDENCY_PROOF.json) |
| Admission parity | `src/test/campaign2ModelAdmissionParity.test.ts`, nine negative model variants through prepare and restore; canonical permutations |
| Inherited crosswalk | [51 EVID/REG/ADAPT-E rows](CAMPAIGN2_INHERITED_VECTOR_CROSSWALK.md), inventory-only audit |
| Full-state invariant | `src/test/campaign2UntouchedState.test.ts` and `CAMPAIGN2_STATE_INVARIANT_PROOF.json`: thirteen controls, seven detected mutants, generic future-writer rollback |
| Construction/order mutants | [eight EVID, nine REG and one AD-E5 mutation](CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF.json) |

## Factory work packages and controls

| Gate | Available component evidence | Remaining qualification work |
|---|---|---|
| FCT-1 | Allocation audits; Campaign-2 codec and Packaging tests | Crosswalk exact schema/layout/version negative cases to full frozen inventory |
| FCT-2 | VAL compiler tests, Content and Role oracles, Declaration corpus | Whole-model admission/restore coverage and general independent compiler remain outside finite corpus |
| FCT-3 | State/domain/REG/admission suites, Role/Gate/REG oracles; six PRJ substitutions | Complete construction/failure-precedence and inherited PRJ/IDN crosswalk |
| FCT-4 | Admission, bridge, Trace, ADAPT/Gate oracles | Complete EVID/ADAPT inherited vectors; internal OBS/SEM substitutions |
| FCT-5 | Factory, Continuation, metadata and pending-input negatives | Complete PERSIST mapping below; no activation verdict inferred |
| FCT-6 | Independent content/role/scalar comparisons and 92 detected mutants across eleven reports plus twelve exact capability-rejection substitutions | Every admitted semantic branch, exclusions, preserved failed attempts and reviewed release |
| FCT-A | Factory rejects supplied identities/extra data and changed models | Audit construction/restore entry-point completeness |
| FCT-B | Packaging/VAL tests and Admission parity reject unused unsupported declarations at prepare and restore | Full entry/schema/operand inventory beyond the nine negative variants |
| FCT-C | **PASS, split-scope qualification**: CAMPAIGN2_FCT_C_PROOF.json; generic A/B/absent invariance, twelve exact capability-rejection substitutions, bounded exclusion | Scope accepted by user; no bounded roster-change runtime branch claimed. Other factory and inherited gates remain open |
| FCT-D | Factory rejects public overrides; five metadata-derivation mutants detected | State-ID scan and build-support-dependent metadata mutants; complete PERSIST-H proof |
| FCT-E | Factory metadata/pending failures before runtime construction; dynamic saved-time witness | Complete semantic-restore checklist with stage observations |
| FCT-F | Factory public callback rejection; five Bridge substitutions under unchanged declarations | Complete inherited OBS/SEM vector crosswalk; broader substitution inventory |

Some earlier test titles use `FCT-C` for returned-byte isolation. That test proves useful
isolation but does **not** satisfy the design's FCT-C roster/EVID challenge. This map follows
the accepted gate text, not incidental test labels. `FrozenBaseline` is the accepted ADAPT
gate name; earlier progress notes' “BaselineOnly” wording refers to it, not another variant.

## VAL-A..W

| Gate | Evidence available | Remaining scope before verdict |
|---|---|---|
| A | Factory exact data-only interface; minimal content oracle | Explicit opposite-callback pair and legacy negative-control mapping |
| B | Factory callback/extra-field rejection, detached bytes | Construction/restore same-ID replacement crosswalk |
| C | Committed Step +1→+2 changes registry/model identity and witnessed tolerance | Map content-only identity counterpart |
| D | Content, role, gate, REG and persistence interpreter mutants | Remaining admitted branch inventory and mutation witnesses |
| E | Content normalization/duplicate rejection; Admission parity reverses registry sets and compares exact model identity/restore | Multi-character content permutations and full compiled-result mapping |
| F | Generic content governance tests exist | Explicit presentation-only identity/result invariance mapping |
| G | Plain-data boundary rejects getters/callbacks | Environment/counter/clock/RNG independence controls |
| H | Factory and Packaging detached source tests | All retained declaration surfaces audited |
| I | Missing fields, forged model capability, changed model and missing manifest reject | Complete construction/restore input matrix |
| J | VAL/Packaging malformed namespace/kind/version/schema tests | Exact carrier and multi-failure precedence coverage |
| K | Content oracle: minimal full type-170 character, all sixteen required-field omissions | Review finite-corpus scope |
| L | Role oracle: authored resolution, namespace distinctions, runtime-origin rejection | Recognition/state invariance and full role traversal |
| M | Content oracle and VAL reject unknown, cyclic and detached references | Explicit invariant-text override challenge mapping |
| N | Accepted PRJ substrate/admission tests and six targeted selector/extraction/source/access substitutions | Complete inherited PRJ mutation/vector crosswalk; generic fixture is distinct from zero-read EVID |
| O | Public override rejection; Gate and REG/persistence mutants | State validation/applicability and remaining contract-specific variants |
| P | Fresh-process exact Continuation; changed/old model rejection | Review complete version/profile reconstruction matrix |
| Q | Independent finite content comparison, 572 cases | Review corpus limits; shared codec is excluded |
| R | Factory failed settlement rollback, late trace/WRT failures | Explicit invalid-content-after-valid-registry activation observation |
| S | Factory plain-data boundary and Role oracle mutants | Explicit same-ID predicate-bearing input at all entry points |
| T | VAL altered kind operand rejection | Applicable negative control crosswalk; future admitted-kind positive branch EXCLUDED |
| U | Minimal content; twenty fixed-input ambient invariance cases and ten direct dependency mutants | Test-only stand-ins do not exhaust host/environment access; complete capability/independence review |
| V | VAL all-three-position closure tests; Declaration corpus exercises recursive/shared/absent roles and exact carriers | Complete malformed-schema inventory and restore parity; no general independent declaration compiler claim |
| W | Empty/minimal/unsupported content tests and oracle | Exact ContentValidationError and no fallback crosswalk |

## PERSIST-A..I

| Gate | Evidence available | Remaining scope before verdict |
|---|---|---|
| A | Fixed closure, empty field 8, invented-anchor mutant; unused analytical declaration rejected at prepare/restore | Complete closure proof beyond explicit unknown-entry control |
| B | Saved-time dynamic REG rejection before construction; anchor-only identity change, exact empty metadata, old-save rejection and matching restore | Review combined PERSIST-B evidence; no general persistence closure inferred |
| C | Factory malformed/omitted/non-list metadata rejection; unsupported analytical prepare/restore negative | Review combined evidence and exact failure stages |
| D | Empty field 9, invented RNG-ID mutant and unused unsupported consumer rejection | All-state-ID scan mutant and full closure proof |
| E | Exact empty field 10, invented coupling mutant, missing original manifest rejection | Complete no-coupling closure mapping |
| F | Fresh-process exact continuation; saved-time displacement validation | Untouched dynamic REG/reference non-reanchoring controls across save boundary |
| G | Factory metadata negatives observe no runtime construction | Audit all metadata checks and publication surfaces |
| H | Public overrides rejected, five internal derivation mutants detected | Independent finite metadata comparison and remaining semantic alternatives |
| I | Profile is fixed by admitted model declarations | Additional supported-but-uncommitted seam control; do not invent stochastic semantics |

## Next qualification work

Use the 51-row inherited crosswalk to prioritize remaining EVID admission/capability and REG checks.
Extend it to ADAPT A-D and PRJ/OBS/SEM; review whole-model coverage and ambient-dependency limits and fill
remaining PERSIST controls before proposing release. This inventory identifies test work;
it does not identify a new semantic decision requiring the user to reopen accepted seams.
