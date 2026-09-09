# Bounded no-RNG persistence qualification review

## Accepted disposition — 2026-09-08

User review accepts **campaign2-persistence/0.1-candidate — BOUNDED NO-RNG PROFILE
QUALIFIED**. PERSIST-A..H are PASS in this original first-profile scope.
PERSIST-I remains RETAINED / DEFERRED / NOT PASSED under the accepted addendum;
whole PERSIST-A..I are not all passed. The trigger remains the first separately
accepted and production-supported RNG-consuming seam. No general RNG persistence,
whole factory/VAL release, or Campaign-2 completion is inferred. Memory prefix-replay
persistence remains separately governed. Runtime/model/allocations and PHEN-ADAPT
PASS are unchanged. The original submitted argument follows as review history.

2026-09-08. Proposed scoped disposition, awaiting review:
**campaign2-persistence/0.1-candidate — BOUNDED NO-RNG PROFILE QUALIFIED**.
This is not a whole factory/VAL or Campaign-2 completion request.

PERSIST-I is FROZEN / RETAINED / DEFERRED / NOT PASSED under the
[accepted sequencing addendum](CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md).
This proposed verdict does not establish PERSIST-I's cross-build/model RNG-consumer
separation witness. PERSIST-I remains deferred until its accepted positive
precondition exists. No RNG-capable persistence profile is admitted by this review.

## Declared execution closure

The [machine inventory](CAMPAIGN2_BOUNDED_CLOSURE_INVENTORY.json) compiles the actual
first trace model: 175 schema descriptors, 82 semantic entries, four registered
consumers, five writable leaf patterns and no read-only patterns. Its status is
inventory verification, not behavioral proof. Schema availability is not execution
authority. The fixed RulesVersion selects the exact ordered-input, trace and
persistence profiles through `boundedRunProfiles`; unknown versions reject.

| Reachable component, including unexercised branches | Operations and persistence consequences |
|---|---|
| Original authored-fact input at phase 110 | Exact committed original manifest admits source facts; closed source adapter emits adaptation input and optional consequence work. No ongoing external input callback or coupling source. |
| Optional consequence bridge at phases 120..124 | Closed observer channel, deterministic observation, experience reservation, staged support and empty classification control; publishes observation and safe SemanticExperience. No state-owned anchor, random draw or coupling. Bridge disabled/enabled branches both remain in this analysis. |
| OutcomeEvaluation / OutcomeLearningEvidence, phase 130 | Exactly the two registered V04 consumers. Accepted safe operands, allocated occurrence, output copy, empty reads/patches; no persistent learning write or RNG authority. |
| Regulatory / procedural adaptation, phase 140 | Exactly two V06 consumers. Rule selection, frozen reads/gates, exact integer arithmetic, bounded validation, patch and dispatch/evaluation outputs. No-op, clamp/boundary, removal, absent value and failure branches use the same finite interpreter. No analytical anchor producer, random draw or continuing coupling. |
| REG reference provider | Immutable model-owned authored anchors/parameters materialized at query time. No run-owned cache, anchor update or write path. Changed declarations change ModelIdentity; no field-8 mirror. |
| Scheduler/trace/state infrastructure | Deterministic queue/occurrence allocation, transactional staging and rollback, fixed mutation authorities and canonical trace. Five integer-valued map leaves; other character-learning families remain unstored in this profile. Save metadata is separately derived, not scanned from those IDs or outputs. |
| Save/restore facade | Closed data-only construction and exact metadata equality; original manifest restores source authority. No caller callback, handler, profile or invariant override. |

The shared runtime source also contains probe, carriage and memory code. Those
branches require separately compiled optional capabilities. The original bounded
compiler returns none, and the factory's original-profile call supplies none.
Their presence in the build does not put them in this model's closure. Their
accepted profiles and persistence semantics remain separately qualified surfaces.

The model compiler's admitted kind set is closed; every entry is dispatched or
rejected. It requires exactly four transition registrations, validates the exact
two EVID names and compiles the two ADAPT registrations through their closed rule
language. Unknown declaration rejection applies even when the input manifest is
empty, so execution silence is not the basis for exclusion. Schema and union
inventories are exact-equality checks; no codec registration installs a handler.

Thus the three absence arguments are independent:

- Run-owned analytical anchors: no admitted state grammar/producer owns one; REG
  anchors are immutable model declarations. Field 8 is exact list([]).
- RNG consumers: no admitted handler/rule operation requests a draw or receives an
  RNG consumer capability. RNG schema availability and seed identity do not change
  that closure. Field 9 is exact list([]).
- Continuing coupling: original inputs are committed, restored and matched; no
  admitted continuing-input or comparison-draw-map operation exists. Field 10 is
  exact list([]). It does not replace the original manifest obligation.

These are contract and source reachability arguments backed by finite controls,
not deductions from an empty execution trace or an automated theorem prover.

## PERSIST control evidence

| Control | Combined evidence for this proposed bounded disposition |
|---|---|
| A | Closure above; Factory/ModelAdmissionParity unused analytical declaration rejection before runtime; exact field 8; invented-anchor save/restore mutants in REG_PERSISTENCE_MUTATION_PROOF |
| B | PersistenceDerivations anchor-only change alters model registry commitment, preserves empty metadata, rejects old save and admits matching restore; saved-time D validation |
| C | Factory omission/nonempty/map/set field-8 negatives; unsupported declaration rejects preparation; restore-stage mapping |
| D | Closure above, unsupported consumer exclusion, exact field 9; independent save/restore all-state-ID scan mutants in METADATA_STATE_SCAN_PROOF |
| E | Closed original-input authority, exact field 10, malformed/nonempty/omitted rejection, missing original manifest rejection; continuing-input mutant |
| F | TRACE_CONTINUATION_PROOF separate-process exact continuation; Regulatory exact witnesses REG-I/L same-clock retained state/reference; dynamic saved-time validation without re-anchoring |
| G | Factory metadata/queue/retained-state rejection observes no runtime construction and unchanged original save; detailed BOUNDED_RESTORE_STAGE_INVENTORY maps validation before publication |
| H | QualificationClosure opposite callback pair and public override exclusion; finite metadata comparison, independent save/restore state-scan and build-inventory substitutions; original derivation mutants |
| I | DEFERRED / NOT PASSED. Build-inventory exclusion control passes but is not the required future positive witness. |

Evidence filenames above are prefixed `CAMPAIGN2_` under this planning directory;
test files are under `src/test/`. No general independent persistence implementation
is claimed. The earlier rejected/insufficient assays remain in the original reports
and substrate closure review. SUB-008 trace, SUB-009 paired controls and SUB-011
correct-forward discipline remain retained mechanisms.

## Additional schema boundary evidence

`campaign2SchemaClosure.test.ts` executes **700 negative public calls**: each of
175 actual descriptor omissions and version increments at both prepare and restore.
Every case rejects at exact trusted-inventory comparison, before runtime creation;
the original valid save remains byte-identical. This covers these two mutations
across the entire current descriptor inventory, not every malformed record layout
or every semantic branch. It supplements FCT-1/B and does not pass those whole gates.
The successful control uses the actual factory and valid save before installing
the constructor spy.

Validation: schema closure test PASS (one test, 700 negative calls), TypeScript PASS.
The prior focused persistence/factory pass remains 16 tests in four fresh-source
files; the earlier 936-test result includes historical tests and is not relabeled.
The inventory helper initially passed an omitted expected type to `dataRecord`;
it failed before writing a report. Explicit record-kind inspection corrected this
audit-only error. No production defect or semantics changed.

## Deliberately outside this verdict

Whole VAL/FCT release, every inherited PRJ/OBS/SEM/EVID branch and mutation crosswalk,
all record-layout negatives, general host-dependency exclusion, successor memory
prefix-replay qualification, and any stochastic/coupled/analytical-state profile
extension are not claimed here. Remaining factory reconciliation can continue
independently. No runtime/model/allocation changes or blanket activation are requested.
PHEN-ADAPT PASS remains unchanged; Campaign 2 remains OPEN.
