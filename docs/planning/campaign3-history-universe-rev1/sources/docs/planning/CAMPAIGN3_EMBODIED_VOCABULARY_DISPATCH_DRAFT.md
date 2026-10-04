# EMB-001 vocabulary, version dispatch and failures

2026-09-10, revision1. **SYM-2 proposed contract vocabulary; not accepted or allocated.**
Read with [field types](CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md). The machine companion
`CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json` lists proposed exact member payloads and
dispatch rows. Future candidate-version strings below are target acceptance names;
they are not currently executable versions and confer no shape acceptance.

## 1. Exact target versions

| Purpose | Proposed accepted-version target |
|---|---|
| Reserve dynamics/parameter and anchor invariants | embodied-reserve/0.1-candidate |
| Level channel, present/unavailable sample semantics | embodied-level-observation/0.1-candidate |
| Source registration and original-input admission | embodied-source-admission/0.1-candidate |
| Pressure function and output | embodied-pressure/0.1-candidate |
| Pressure registration and conjunctive ingress | embodied-pressure-admission/0.1-candidate |
| External physical delivery | embodied-replenishment/0.1-candidate |
| New fixed fuel token | embodied-fuel-unit/0.1-candidate |
| Whole bounded model | rules/campaign3-embodied-reserve/0.1-candidate |
| Trace mapping | campaign3-embodied-trace/0.1-candidate |
| Committed-boundary restore | campaign3-embodied-persistence/0.1-candidate |

Source registration's ProducingSeamVersion names level observation, while its registry
entry DefinitionVersion selects source-admission grammar. These are deliberately
different roles. Likewise pressure registrations execute the pressure seam but decode
under pressure-admission. A replenishment registration and definition use the same
replenishment version but distinct registry kinds. Dispatch requires kind, exact
version and exact payload schema together, never just one matching string.

SEM support-only freeze remains the existing semantic-binding/0.1-candidate#SEM-001H;
identity-binding, PRJ/VAL and shared transition-admission retain their accepted versions.
No new version implies adoption by an old RulesVersion or existing public factory.

## 2. Registry kind and schema matrix

All kinds below are proposed members of existing RegistryKindId1023. The DefinitionId
of each instance is committed model content; complete fixture instance IDs belong in
SYM-3, not in a runtime-generated naming scheme.

| Registry kind suffix after `registry/` | Version owner above | Exact payload schema |
|---|---|---|
| embodied-reserve-parameters | Reserve | ReserveParameters |
| embodied-reserve-bodies | Reserve | ReserveBodyRegistryDefinition |
| embodied-level-channel | Observation | LevelChannelDefinition |
| embodied-pressure-definition | Pressure | PressureDefinition |
| embodied-level-source-registration | Source admission | LevelSourceRegistration |
| embodied-pressure-present-registration | Pressure admission | PresentPressureRegistration |
| embodied-pressure-unavailable-registration | Pressure admission | UnavailablePressureRegistration |
| embodied-replenishment-definition | Replenishment | ReserveReplenishmentDefinition |
| embodied-replenishment-registration | Replenishment | ReserveReplenishmentRegistration |

Model construction dispatch is a fixed interpreter table, not a new user-supplied
validator function. Unknown kinds, incorrect schema/version pairings, extra fields,
duplicate StableId, unresolved references and wrong target kinds reject. Reuse the
existing VAL character predicate at every qualified CharacterId role; no new validator
ID is needed merely for channel/parameter equality or the singleton fuel token.

The body-registry and source/writer registration rows are singletons in this bounded
profile. Channel/pressure definitions and their two pressure registrations are paired
per admitted observer/channel. Exactly one registration of the correct branch must
match after producer, O, channel, version and safe-definition checks. The SYM-3 specimen
must enumerate every StableId and event binding and reject unlisted instances.

## 3. Proposed exact members and ownership

SeamId1036 members: `seam/embodied-reserve`, `seam/embodied-level-observation`,
`seam/embodied-pressure`, `seam/embodied-replenishment`.
The sampling source executes the observation seam; body arithmetic is a fixed function
under the reserve contract, not an independently scheduled psychological transition.

EventTypeId1001 vocabulary: `event/embodied-level-sample` at10;
`event/embodied-level-tracking-slot` at11; `event/embodied-level-binding-slot` at12;
`event/embodied-level-classification-slot` at13; `event/embodied-level-settlement` at14;
`event/embodied-pressure-present` and `event/embodied-pressure-unavailable` at60;
`event/embodied-reserve-replenishment` at110. There are eight event **types**, not eight
events per sample: each sample still executes six slots, selecting one pressure type.

The two pressure transition kinds are proposed as
`EmbodiedPresentPressureTransition` and `EmbodiedUnavailablePressureTransition`
in existing TransitionKindId1009. These name the interpreter operation; where several
channels exist, distinct committed registration entries must not duplicate the same
StableId. This packet does **not** license a suffix-generating runtime allocator.
The first SYM-3 public specimen will therefore use one observer/channel and two rows;
multi-observer dispatch remains a required successor/component comparison, not a
silently executable extension of this first closed model.

Other members: `accessor/embodied-reserve-anchor` in1028;
`authority/embodied-reserve` in1025; `modality/embodied-fuel-level` in1006;
`unit/embodied-fuel-stock` in1039. ObservationChannelId1005 and all DefinitionId1027
instance payloads are fixed by SYM-3. No new physical identity namespace is needed.
PressureOccurrenceId alone needs a new occurrence namespace at later numeric review.

The unit is a fixed token for the idealized stock quantity, not an SI unit, conversion
factor, REG unit or open authoring vocabulary. Its proposed fixed-token contract admits
only that token for this profile. Old observation-unit-identity/0.1-candidate and its
fixture-pulse singleton remain unchanged. Namespace role and exact member checks are
separate; neither creates a DomainValidator, UnitDefinition or conversion registry.

## 4. Finite values and exact row checks

Existing NoStateWrites uses273/1 tag1, unchanged. Existing output multiplicity277/1
uses ExactlyOnePerExecution, unchanged for pressure. Current lane uses the existing
Current meaning and numeric value from the accepted lane registry, not a newly minted
enum. New PressureResult Known/Unavailable and LevelChainCarrier Present/Unavailable
tags remain symbolic until numeric review. New SupportRule has the single symbol
ExactSingletonSameOpportunity; ResultRule has NoPresentEvidenceNoReservation. No open
string predicate, nullable fallback branch or optional semantic field is admitted.

Present pressure InputAdmission selects exactly EmbodiedLevelObservation and the
present producer requirement. Unavailable selects exactly UnavailableLevelSample and
its absence requirement. Both Ingress rows have phase60 and the matching exact event
type. Source phase is exactly10, settlement14 and replenishment110. A structurally
unsigned but incorrect phase/tag is rejected by row validation.

## 5. Proposed failure ownership and precedence

Do not modify accepted exception semantics globally. New profile adapters must preserve
the owning failure as the primary code; wrapper diagnostics may add context but cannot
turn every failure into Unavailable. The symbolic additions below require explicit
schema/error-code admission during packaging, not ad hoc string throws.

| Stage | Primary code / rule |
|---|---|
| Canonical decode | Existing canonical/codec failure; no semantic dispatch on malformed bytes. |
| Model kind/version/schema/domain/reference closure | Existing INVALID_CONFIGURATION, with specific checked condition in diagnostic text. |
| Runtime source origin | Existing INPUT_ONLY_EVENT_ORIGIN_VIOLATION for forbidden scheduling/cancellation; INPUT_NOT_ADMITTED for forged/stale/unassociated execution. |
| Subject projection | Existing INVALID_PATH, CANONICAL_ROLE_VIOLATION and REQUIRED_PROJECTION_VALUE_ABSENT in accepted PRJ/WRT order. |
| Selected body key differs from authenticated subject/target | Proposed EMBODIED_TARGET_PATH_VIOLATION; checked before any body read/write. |
| Present-branch anchor absent or malformed/out of domain | Existing STATE_VALIDATION_FAILURE at the source boundary; no zero/default body. |
| Backward materialization time | Proposed EMBODIED_TIME_ORDER_VIOLATION, before arithmetic. |
| Sample schema/grid/branch/output identity violation | Existing TRANSITION_OUTPUT_VIOLATION. |
| Present SEM mismatch or unavailable branch with SEM | Existing TRANSITION_INGRESS_VIOLATION; never select padding as recovery. |
| Child/registration/token association invalid | Existing INPUT_NOT_ADMITTED on consumption; TRANSITION_INGRESS_VIOLATION while binding. |
| Pressure value/branch/output mismatch | Existing TRANSITION_OUTPUT_VIOLATION. |
| Patch syntax/path/authority/precondition/value | Preserve existing state failure codes and WRT order; no EMB replacement codes. |
| Fixed trace rows/budgets/read evidence differ | Existing TRACE_VALIDATION_FAILURE. |
| Save/restore bytes/model/pending-source closure | Existing persistence failure class appropriate to that check; exact existing-code mapping is a SYM-3 restore-table requirement. |

Within a valid present sample execution, order is: source association → declared
channel/definition membership → IDN → exact body target/binding → permission gate →
body read and anchor validation → time arithmetic → bin/output validation. A permission
failure is the sole specified unavailable branch; a later error cannot impersonate it.
Either Available=false or Permitted=false takes that branch without a body read.

Within a pressure execution, association precedes selector and state access, then IDN,
then detached semantic function and output checks. Replenishment authenticates the
world definition before exact target read and WRT-protected patch. No roster access
is added to the world writer. Failed instants preserve the existing rollback contract.

## 6. Self-review and disposition

The membership scan checks candidate payload equality against existing formal JSON;
it is not permanent allocation approval or proof that arbitrary new definition instances
are admissible. Runtime counts, profile exclusions and restore primary-code mappings
must still be exercised through the SYM-3 specimen and later public tests.

The one-observer first specimen is an explicit bounded packaging choice. Wrong-observer
and multiple valid body-target controls remain obligations: use honest component-plus-
profile-exclusion scope where that specimen cannot instantiate the positive case.
Do not declare the general observer tests passed merely because construction rejects
the unadmitted observer. Need ownership, action knowledge and cross-family receiving
remain open. No implementation, allocation or whole-shape acceptance occurs here.
