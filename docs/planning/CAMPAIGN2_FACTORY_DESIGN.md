# Authoritative Campaign-2 factory — design pass 2

**Status: IMPLEMENTATION DESIGN ACCEPTED 2026-09-06; NOT IMPLEMENTED OR QUALIFIED.**
2026-09-06. Implements the accepted `governed-execution/0.1-candidate`,
`content-kind/0.1-candidate` and `governed-domain-validator/0.1-candidate` boundaries.
This is implementation organization beneath accepted contracts, not a new semantic contract,
registry, identity family or allocation. No authoritative activation is authorized by this document.

Review history: pass 1 withheld implementation-design acceptance pending EVID/state/WRT/registry
corrections and an exact persistence profile. Pass 2 resolved the factory organization; persistence
revision 2 retracted the unaccepted REG mirror. The final review accepts this IMPLEMENTATION DESIGN
and C2-PERSIST-001 at campaign2-persistence/0.1-candidate. No architecture blocker remains identified.
Staged implementation may begin. Concrete first-model inventory and exact RulesVersion/profile
binding remain required before FCT-5; authoritative activation and qualification are NOT PASSED.

## 1. Authority and intended result

Consume [VAL](VAL_001_DRAFT_RESOLUTION.md), [Campaign-2 allocation](../formal/CAMPAIGN2_PERMANENT_ALLOCATION.md)
at `campaign2-allocation/0.2-candidate` and [VAL allocation](../formal/VAL_PERMANENT_ALLOCATION.md)
at `val-allocation/0.1-candidate`. PRJ/IDN/EVID/REG/ADAPT and their exact accepted versions remain
unchanged. [ADAPT F](ADAPT_001_PACKAGING_DRAFT.md) owns the definition matrix and static invariants;
[D](ADAPT_001_FACT_INGRESS_DRAFT.md) owns InputOnly compilation/restore;
[E](ADAPT_001_RULE_INTERPRETER_DRAFT.md) owns rule interpretation;
[REG](REG_001_DRAFT_RESOLUTION.md) owns retained-time checks.
Current allocation acceptance takes precedence over historical pending-allocation notes in those files.

The result is one authoritative entry path that accepts complete canonical model declarations and
canonical run inputs, derives all runtime machinery internally, and exposes a restricted run handle.
It must be possible to construct the same model in a fresh process without supplying executable
objects. A matching ModelIdentity is necessary but never evidence that a build implements its contract.

No character capabilities, state families or causal edges are added. Preserve the reference ledger's
SUB-003 typed identity/order, SUB-008 exact continuation/atomicity, SUB-009 paired controls, SUB-010
historical model controls and SUB-011 forward correction obligations as specified by VAL §1.
Historical fixture APIs remain controls; they cannot be injected into the new activation path.

## 2. Source inspection and concrete changes required

| Existing source | Observed behavior | Required factory boundary |
|---|---|---|
| `src/substrate/contentManifest.ts` | ContentSemanticValidator takes the full caller object; registry commitment validates encoding but does not interpret each registry kind. | Decode and dispatch exact admitted kind/version/schema declarations; use 329/330 interpreters, with no callback input. |
| `src/substrate/identity.ts` | createModelIdentity consumes existing canonical commitments and version strings. It does not bind host executables. | Recompute commitments from the immutable declarations the factory actually compiles; never accept an independently supplied identity as their substitute. |
| `src/substrate/scheduler.ts` | SchedulerConfiguration accepts handlers, stateAdapter, invariants, initial queue/allocators/trace and a work-limit scalar. | Construct this configuration only internally. No public factory argument forwards any of these runtime mechanisms. Derive the work limit from committed OrderingParameters/133. |
| `src/substrate/transition.ts` | createContractEventHandler accepts a semantic transition with full EventHandlerContext; adapter helpers accept persistence projection functions. | Do not expose these as semantic extension points. Trusted adapters narrow inputs before calling each closed seam interpreter. |
| `src/substrate/state.ts` / `mutationAuthority.ts` | Generic callbacks are permitted; the accepted leaf grammar compiler derives closures from declarations. | Compile state owners, leaf checks and PRJ roles internally from the same snapshot; add accepted Campaign-2 interpretation, preserving WRT ordering. |
| `src/substrate/persistence.ts` | LoadContext accepts handlers, schemas, adapters and invariants. loadCanonicalSave validates structural identities/state then constructs a scheduler and returns ContinuingRunInputs. | Separate validated continuation preparation from activation, or keep the scheduler inaccessible until every Campaign-2 restore check passes. The public factory must never return that generic LoadedSave directly. |
| `src/semanticBinding/semanticSchemaRegistry.ts` and codecs | Accepted SEM schemas, typed namespaces and manifest-governed union layouts already exist. | Reuse those allocations and codec invariants; register frozen Campaign-2 and VAL additions without replacing SEM identity/provenance. |
| `src/test/fixtures/phenSem001Run.ts` | Historical integrated fixture builds identities and handlers through fixture code; its work-limit value is separately supplied to the scheduler. | Reuse accepted seam semantics and regression controls, not the fixture's constructor or handler map as the new authoritative factory. |

The source tree has no inspected authoritative Campaign-2 factory. Numbers being allocated does
not mean codecs, V04/V06 admissions, phase-140 settlement, PRJ/IDN or REG construction already exist.
Their implementation is required before an authoritative integrated handle can be returned.

## 3. Public boundary and identity inputs

Proposed code-level API names (not canonical records):

```text
prepareCampaign2Model(complete canonical model input)
    → private compiled model handle

createCampaign2Run(private model handle, complete canonical run input)
    → restricted active run handle

restoreCampaign2Run(complete canonical model input,
                    original complete ordered-input manifest,
                    canonical save bytes)
    → restricted active run handle
```

The model source contains only complete content, parameter and registry declarations plus the
existing identity-bearing version components from which identities are recomputed. It contains
no trusted ModelIdentity, ContentIdentity, ParameterIdentity, RegistryIdentity or manifest digest
as construction authority. The factory computes those identities from the exact immutable snapshot
it compiles and may expose the result read-only. A digest already carried by an external artifact
can be compared diagnostically; it never substitutes for source declarations.
Initial creation supplies canonical initial
state, complete original ordered inputs and the canonical seed. These are host API packaging of
existing artifacts, not another canonical manifest wrapper. Source artifacts remain available;
digest-only inputs fail. Presentation is separated before this boundary and cannot affect admission.

The factory rejects unknown semantic options and callable/object alternatives: no validators,
resolver, derived projection function, handler map, adapter, invariant function, additional-schema
override, traceFactory, runtime allocator override, scheduling hook or test instrumentation. Merely
typing an argument as a data structure is insufficient; runtime admission must reject extra fields.
The boundary should receive canonical values/bytes through the existing strict value grammar, not
arbitrary objects with getters or executable properties masquerading as canonical data.

The supported contract set and implementation dispatch are fixed build capabilities, not caller
inputs and not an extra ModelIdentity operand. Unsupported exact versions reject activation without
fallback. Supported semantic changes require accepted version/declaration changes in the existing
identity homes. Internally compiled closures capture only isolated canonical operands and authorized
inputs. The factory's private model handle is unforgeable within the public API and cannot expose
its handler map, compiler configuration or mutable declaration graph; it has no serialized ID.

Expose run operations for settling committed work, obtaining copied canonical snapshots/outputs,
and saving at active quiescent boundaries. Do not expose the underlying scheduler, arbitrary event
insertion or runtime configuration mutation. All initial work comes through the accepted input
compiler; no new mid-run external command mechanism is introduced. Diagnostic/read-only tooling
cannot supply decisions back into authoritative execution.

## 4. Model preparation and activation order

The externally observable order remains VAL's seven stages. Internal helper construction needed
to validate data is not activation and cannot execute scheduled work or allocate run occurrences.

1. **Structural registry/schema admission.** Decode with the build's supported, permanently
   allocated schemas; validate exact versions, fields, uniqueness and union layouts. Manifest schema
   descriptors cannot override the trusted interpretation of a known schema. Reject every unknown
   or unsupported entry rather than treating canonical bytes as self-executing semantics.
2. **CONTENT kind-definition closure.** Resolve each used kind and every validator's kind dependency
   to its exact admitted 329 definition. Only the accepted character kind is supported in this
   profile. Empty content does not invent a used kind. No fixture callback fallback.
3. **Authoritative CONTENT validation.** Apply the closed 170/1 character-kind validation, exact
   references and cycle rules. Compute ContentIdentity from those same canonical definitions.
4. **DomainValidator declaration/reference closure.** Resolve 330 definitions and exact operand
   restrictions, then enforce ReferencedDomainValidators = DeclaredDomainValidators over all three
   accepted role positions and every declared branch. No generic PRJ role is added for 330's field.
   Run the other contract-owned model-definition checks against these validated immutable inputs:
   PRJ declaration compatibility, route/output closure, REG construction, ADAPT declarations and
   ownership/write/ingress/settlement closure. These use their existing failure precedence.
5. **Initial role-bearing state/run validation.** Validate structural StatePath syntax, StateKeyGrammar,
   CanonicalIdentityRole/IDN qualification and exact value grammar, then the full ADAPT five-map
   static invariant and REG's required checks
   at the initial instant. Validate/compile the complete ordered initial input schedule under D.
   Recompute RunIdentity from the admitted initial state, ordered inputs and seed.
6. **Compile authoritative runtime objects.** Bind admitted transition definitions to fixed seam
   interpreters, read projections, ownership checks, occurrence identities, scheduling and trace
   wrappers. Construct the scheduler configuration internally from committed declarations. No
   runtime semantic choice may be supplied independently after identity computation.
7. **Activate.** Return a restricted handle only after every required stage succeeds. Construction
   failure exposes no active scheduler and no partial committed run. Qualified release status is
   still required before calling this path authoritative.

StateOwnershipRegistry closure, sole ownership, declared writable leaves and PRJ declarations
are model-preparation checks. Initial/restored values are not transition writes: do not invent a
mutation authority or apply NON_OWNING_AUTHORITY to initialization. WRT's permission and precedence
checks apply to later Set/Remove operations only. Read-only IDN state remains admissible under
its exact value/key/role grammar without a fictitious writing transition.

Model preparation can finish model-only checks before initial run inputs exist. It must retain
deferred run-dependent checks and must not report an active run. Identity-bearing manifest version
values, the complete declaration set and every binding must agree before the handle becomes usable.

## 5. Internal dispatch, capabilities and scheduler integration

Every SemanticRegistryEntry in the complete model manifest must resolve to exactly one supported
(RegistryKind, DefinitionVersion, DefinitionSchema) interpretation and its permitted StableId
relation, or preparation fails INVALID_CONFIGURATION. Unknown kind, unsupported version, wrong
schema, ambiguous interpretation or unsupported StableId relation all reject. There is no
"canonical but unused, so ignore it" branch. Known unused vocabulary is allowed only where its
accepted interpreter explicitly permits it. This is an admission invariant over every entry,
not just definitions reached by one run.

The closed Campaign-2/VAL row matrix is the exact [allocation registry-binding table](../formal/CAMPAIGN2_PERMANENT_ALLOCATION.md#registry-instances-and-schema-bindings)
plus the two [VAL bindings](../formal/VAL_PERMANENT_ALLOCATION.md#governed-entry-bindings).
Inherited SEM union definitions use registry/union-variant-definition, their accepted version,
259/1 and namespace-1024 [TypeId,Tag] StableIds. PRJ collections, schemas, ordering and ownership
artifacts keep their existing declaring contexts; do not invent type-171 entries for them.
Before first-model preparation, materialize the complete inherited entry matrix from its actual
manifest; any entry lacking an exact supported row is a readiness failure, not an ignored extension.

Dispatch uses existing RegistryKind, exact DefinitionVersion/schema, transition kind, seam and
event definitions. There is no authored interpreter name or function lookup registry. Validate
uniqueness of the accepted bindings before compiling an internal handler map; a duplicate may
not become last-registration-wins. Unsupported entries cannot silently disappear from the model.

| Internal component | Allowed semantic inputs | Output / boundary |
|---|---|---|
| CONTENT interpreter | Canonical content and admitted registry declarations | Validated content or ContentValidationError; no run state |
| DomainValidator interpreter | Namespace-validated referent, 330 definition, committed content | IDN success or CANONICAL_ROLE_VIOLATION; no roster/recognition/time input |
| PRJ interpreter | Admitted payload selector, declared projection, permitted state source, role definitions | Exact projected value and actual-read records; no alternate roster access |
| EVID V04 | Exact admitted PreRecognitionSemanticExperience or OutcomeEvaluation, exact committed registration, shared occurrence allocator | Exact OutcomeEvaluation / OutcomeLearningEvidence; ReadDomain = {}; no state reads, bindings or PRJ/IDN subject projection; NoStateWrites |
| ADAPT D | Complete authored input schedule and exact producer/bridge declarations | InputOnly source execution and accepted consequence support; no runtime source injection |
| OBS | Exact bounded-effect truth, ObservationChannel and accepted observation declaration | observation/0.1-candidate, seam/truth-to-permitted-evidence; exact permitted observation result at phase 120 |
| SEM consequence lane | Actual permitted observation, reservation/lane state and accepted SEM declarations | seam/event-truth-to-pre-recognition-experience, semantic-binding/0.1-candidate#SEM-001H; 121 tracking/segmentation, 122 binding, 123 classification, 124 freeze; exact PreRecognitionSemanticExperience |
| ADAPT E/V06 | Admitted actual fact, exact rule declarations and per-rule projections over the frozen snapshot | Declared dispatch/evaluation outputs and accepted patches only |
| REG / settlement | Committed references and the state/time inputs specified by REG and ADAPT C | Initial/retained-time/final checks and atomic phase-140 settlement |

The generic scheduler context carries whole state for trusted infrastructure. That does not
authorize passing it to a character interpreter. The new wrappers must preserve observer-safe
input closures, exact read instrumentation and no authoritative truth handles on the EVID path.

EVID unbound observers succeed. The trace wrapper may derive SubjectIds from the ObserverId already
nested in the safe source, exactly as accepted EVID requires; that omniscient trace construction is
not an EVID semantic subject projection. A later state-addressing consumer owns PRJ/IDN resolution.
The specific D bridge traverses genuine OBS/SEM operations even when detection/binding/classification
work sets are empty. D schedules this chain; it cannot replace those interpreters with fixture
handlers or imitate their output shapes.

The ordinary handler-per-event loop is not, by itself, ADAPT's accepted exclusive phase-140 batch.
Implement the accepted extraction, collision-before-read, common snapshot, staged output/patch
and retained REG behavior inside the scheduler integration. Do not model settlement as a phase-150
event, sequentially expose one adaptation write to another rule, or add new scheduling priorities.
Preserve atomic state, queue, allocator, trace and output rollback for the whole instant.

MaxSettlementWorkPerSimulationInstant must be resolved from the model's committed OrderingParameters
record 133. EVENT_ORDERING already requires a limit change to change ParameterSetDigest. No factory
override or environment fallback is admitted. Resource/process failures do not become a new model
parameter or silently change authoritative event ordering.

## 6. Restore before activation

Fresh-process restore shares model preparation and declaration compilation with creation. Do not
require the original initial-state value: accepted D expressly does not require it on restore.
The save carries RunIdentity/seed commitment; the original complete input manifest remains required.

1. Obtain complete model manifests and build support; reproduce the expected ModelIdentity from
   those declarations. Strictly decode the existing save schema and verify exact model identity,
   embedded run/model consistency and existing save integrity checks.
2. Validate the saved state through the same role/static invariants and REG checks at saved time,
   including untouched leaves and no transition mutation-authority permission check. Derive
   metadata only through the accepted persistence profile; the exact derivations in
   [C2-PERSIST-001](CAMPAIGN2_PERSISTENCE_CLARIFICATION.md) are shape accepted. Require fields 8/9/10 to be exact canonical list([]) under
   AdmittedExecutionClosure(M,P), independent of extra build support. No caller or unspecified internal projection callbacks.
3. Check the supplied complete original ordered-input manifest against RunIdentity. Recompile only
   its initial schedule with the accepted fixed initial allocator settings and all initial entries
   in manifest order. This is scratch schedule reconstruction, not execution or allocation against
   the restored allocator.
4. Apply D's exact InputOnly pending-set equality at saved clock B: full originally compiled events
   with DueAt > B must equal the saved pending InputOnly subset, including all IDs, sequences,
   payloads, phases, dependencies and parents. Retain generic queue/allocator checks. No historical
   replay, source certificate or trace-as-authority reconstruction is introduced.
5. Validate ContinuingRunInputs against its accepted admitting run profile; never route its bytes
   into a handler-selected parser or treat them as permission to supply new source events. Then
   rebuild authoritative runtime objects and restore the saved continuation. Return the handle
   only after all checks pass; no event executes during validation.

Selected design: factor structural save parsing/validation into an internal preparation
routine, allowing the Campaign-2 factory to finish its semantic checks before scheduler construction.
The public historical loadCanonicalSave can retain its contract and delegate to that routine.
Construct the Campaign-2 scheduler only after semantic preparation succeeds. No candidate scheduler
is created early and no save/1 field changes.

## 7. Concrete readiness items to resolve during implementation design

These are binding/inventory obligations, not invitations to redesign accepted seams:

| Item | Evidence / required resolution before activation |
|---|---|
| First fixture kind inventory | No real Campaign-2 fixture exists in the inspected source. Enumerate its actual type-170 definitions; confirm character-only content. Another authored kind needs an accepted specialization, not a fixture callback. |
| Complete registry/profile inventory | Expand the accepted F matrix plus inherited SEM/ordering/PRJ/WRT and VAL rows into the exact first-model manifest. Identify every entry's admitting version and all schemas/union layouts. Do not silently omit unexercised declarations. |
| Persistence projections | C2-PERSIST-001 revision 2 specifies exact list([]) independently for no run-owned analytical anchors, no RNG consumers and no continuing coupling. REG anchors remain only in model declarations and never enter field 8. All three derivations are shape accepted; the three emptiness proofs range over AdmittedExecutionClosure(M,P), not extra contracts supported by the build. |
| Continuing inputs | C2-PERSIST-001 accepts exact empty field 10 for the bounded no-coupling profile, with the original complete ordered manifest separately required by D. Confirm the concrete first model fits this accepted profile before FCT-5. |
| Version and parameter binding | Name the exact first-model RulesVersion, manifest versions and supported contract matrix; identify the committed OrderingParameters location and reject ambiguous/missing values. Do not copy fixture strings as accepted model semantics. |
| Source/consequence adapters | Reuse accepted SEM contracts behind the D bridge; verify each emitted schema, producer seam/version and occurrence allocation. Existing test handler functions are evidence, not public factory dependencies. |

The design is not ready to claim whole-factory activation until these are concrete and qualified.
Allocation and accepted contract semantics remain closed while those integration details are resolved.

## 8. Implementation order and proof mapping

| Work package | Concrete implementation result | Required evidence |
|---|---|---|
| FCT-1 | Frozen 260..330 codec/schema integration and immutable canonical declaration intake | Exact schema/member/version admission; existing allocation audits; VAL-H/J and malformed field/layout controls |
| FCT-2 | Closed 329 CONTENT and 330 DomainValidator interpreters plus exact reference traversal | VAL-A/F/G/J/K/L/M/S/T/U/V/W; no callbacks; all three role positions and orphan/missing checks |
| FCT-3 | PRJ/IDN and contract-owned model/state validation, REG and ADAPT definition compilation | Inherited PRJ/WRT/REG/ADAPT construction mutants, failure precedence and read-capability isolation |
| FCT-4 | EVID, authored source/bridge and ADAPT runtime adapters, including phase-140 batch | EVID/ADAPT frozen controls; route output inhabitation; InputOnly origin and collision-before-read; VAL-B/N/O/R |
| FCT-5 | Restricted create/restore facade, committed work limit, shared validation and exact pending-source restore | VAL-B/E/H/I/P/R/S; D restore vectors; no scheduler/configuration escape or callable override |
| FCT-6 | Independent finite implementation comparison and release evidence | VAL-C/D/Q and targeted mutants for every semantic branch; exact structural results and regression reports |

Work-package IDs are planning labels only; no new runtime identities or canonical proof records.
These packages can be implemented incrementally without publishing an authoritative active factory
before qualification. Tests of internal compilers are proof work, not a claim that VAL has closed.

Carry all VAL-A..W as frozen NOT PASSED, with VAL-T's conditional future-kind branch explicitly
excluded from current-profile pass claims. Preserve inherited gate IDs and prior WRT proof; do not
replace their tests with API-shape assertions. Add meaningful boundary tests for each actual bypass
the factory removes. Run affected source suites and integrated exact continuation/rollback controls;
broaden regression when shared substrate changes justify it. PHEN-ADAPT and formal ADAPT closure
remain later gates, not consequences of a successful factory smoke test.

Qualification evidence must name the exact build's supported profile, successful/failed vectors,
mutants detected, independently compared implementation and tested fixture/corpus versions.
ModelIdentity is not that report and receives no release/binary hash. A failing modified build
under fixed declarations is unqualified software, not a new model.

## 9. Current disposition

Factory-specific controls, FROZEN NOT PASSED:

| Control | Required negative/positive evidence |
|---|---|
| FCT-A | A supplied identity/digest cannot override changed source declarations: reject it as construction input or use it only as an external diagnostic; recomputed identity reflects the actual source. |
| FCT-B | Unknown canonical registry entry, unsupported version/schema or StableId relation rejects model preparation, including an unused entry. |
| FCT-C | With safe EVID source fixed, remove/change roster: E/L payloads and zero ActualReadRecords remain identical; injecting a subject projection rejects. Whole-run identities may differ, so compare EVID semantics separately from trace identity envelopes. |
| FCT-D | No public persistence-derivation replacement is accepted; each internal metadata-derivation mutant is distinguished by the profile's qualification vectors. |
| FCT-E | Fail each semantic restore check after decode: no scheduler/event execution, allocator advancement or state/trace/output publication. |
| FCT-F | Same-shaped fixture/callback replacement for OBS or SEM cannot bind through the public factory; internal interpreter substitutions fail inherited qualification vectors. |

Completed pass 2: corrected EVID zero-read capability, explicit OBS/SEM bindings, exact closed-entry
admission rule, initial-state/WRT separation, source-only identity inputs and FCT-A..F controls.
The final review accepts this IMPLEMENTATION DESIGN and persistence revision 2 at
campaign2-persistence/0.1-candidate. No remaining factory semantic choice is identified.
Staged implementation may begin in FCT-1..4, then freeze the concrete first-model manifest and
exact RulesVersion ↔ semantic bundle ↔ persistence-profile relation before FCT-5. FCT-6 independent
qualification and VAL-A..W, PERSIST-A..I, FCT-A..F and inherited mutants remain NOT PASSED.
No runtime implementation or authoritative activation was performed by this acceptance record.
