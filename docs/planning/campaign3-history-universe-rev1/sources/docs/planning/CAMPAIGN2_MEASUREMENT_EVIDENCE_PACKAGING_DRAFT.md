# Measurement-evidence carriage — successor packaging revision 2

2026-09-07. **WHOLE PACKAGING SHAPE ACCEPTED 2026-09-07.**
Concrete model materialization is authorized. Runtime implementation remains blocked until
explicit concrete ModelIdentity freeze. EVC-PACK-A..I are FROZEN, NOT PASSED. Authority: [accepted seam](../formal/MEASUREMENT_EVIDENCE_CARRIAGE.md)
and [permanent allocation](../formal/MEASUREMENT_EVIDENCE_CARRIAGE_ALLOCATION_REVIEW.md).
This draft binds accepted semantics to one successor model; no numeric allocation or cognitive
response mechanism is proposed. EVC-A..P remain FROZEN, NOT PASSED.

## Inspected base and exact profile selection

Base: frozen `rules/campaign2-regulatory-probe/0.2-candidate`, ModelDigest
`fda39ae4a8d82cbf531b41ce35c9af7ebb2ec5c7f233c4f7adbd7e6d7eba80e9`.
Its review packet commits registry/input/persistence .1 and probe trace .2. The inspected
`probeModel.ts`, `probeSuccessorReview.ts`, `transitionAdmissionV04.ts` and prior packaging
contract admit no 336..341 schemas or V07 row. Its model/compiler cannot gain those by adding
an event handler. The successor requires new registry, trace and persistence bindings. Its unchanged original-input
language directly reuses the accepted probe ordered-input profile; this is not fallback.
Reference ledger SUB-001 exact arithmetic, SUB-008 trace/replay, SUB-009 paired controls and
SUB-011 retained findings continue unchanged; consolidation and response laws remain deferred.

Propose these exact bindings for review; candidate spelling here is a proposed future binding,
not a declaration that packaging or bytes are already frozen:

| Surface | Exact proposed binding |
|---|---|
| RulesVersion | rules/campaign2-measurement-evidence/0.1-candidate |
| RegistrySchemaVersion | campaign2-measurement-evidence-registry/0.1-candidate |
| Whole ordered-input profile | campaign2-probe-ordered-input/0.1-candidate (reused exactly) |
| Whole trace profile | campaign2-measurement-evidence-trace-binding/0.1-candidate |
| Whole persistence profile | campaign2-measurement-evidence-persistence/0.1-candidate |
| ContentSchemaVersion | content/0.2-candidate (unchanged) |
| ParameterSchemaVersion | campaign2-parameters/0.1-candidate (unchanged) |
| NumericProfileVersion | numeric/exact-1 (unchanged) |
| RandomAlgorithmVersion | rng/sha256-addressed-128-v1-candidate (unchanged) |

The exact ordered semantic bundle is the frozen probe .2 packet's entire 28-entry
`semanticBundle`, in identical order, followed by exactly:

1. transition-admission-extension/0.7-candidate
2. measurement-evidence-carriage/0.1-candidate
3. campaign2-measurement-evidence-trace-binding/0.1-candidate

Retaining old trace dependencies preserves inherited sub-semantics; the successor trace profile
owns the complete phase-120 mapping, including its changed two-child EmittedEvents closure.
It never selects an old whole-model dispatcher. RulesVersion directly selects the exact tuple:
new registry, reused probe ordered input, new trace and new persistence.
Unknown or mismatched bindings, runtime-type selection, caller adapters, feature detection and
try-old-then-new decoding reject before runtime construction. Materialization must expand the
full ordered bundle into its review manifest, not leave an unresolved base reference.

## Six-slot registry delta

Canonical positions are zero-based 0..5. Reuse the probe .2 content, parameters, state families,
REG definitions, five adaptation rules, probe definition and fixed-pulse vocabulary unchanged.
The positive specimen retains Available=true and ObserverPermitted=true.

| Slot | Exact successor delta |
|---|---|
| 0: schema descriptors and RegistryEntry set | Add schema-1 descriptors 336..341. Add one 336 intake row and one 341 V07 registration row. Replace only the shared singleton's occurrence-map data with the inherited map plus 203/1 and 337/1 rules. No type-259 union rows added. |
| 1: phases | Byte-identical ordering-phases/2-candidate. |
| 2: mutation authorities | Byte-identical. No carriage authority or state writes. |
| 3: read-only family declarations | Byte-identical. No persistent cognitive family. |
| 4: state-key grammar declarations | Byte-identical. No state root, path or key. |
| 5: identity roles | Add exactly the eight allocated role rows. Reuse existing 203/1 role exactly once; all inherited roles byte-identical. |

The singleton remains kind registry/transition-admission, StableId definition/transition-admission,
DefinitionVersion transition-admission/0.4-candidate, definition 279/1, cardinality exactly one.
LearningRoutes and TransitionRoutes are byte-identical. OccurrenceIdentities adds only
203/1 → field 1 / namespace 1115 and 337/1 → field 1 / namespace 1124, both no DomainValidator.
V04 EVID and V06 ADAPT registration entries remain byte-identical. No alias or second singleton.

Allocated text members are declared in their existing governed families where the registry
machinery requires them. The inherited channel, modality, unit and observer remain model values;
no new vocabulary family or new union declaration is implied by the six text additions.

## Exact new rows and consumer binding

| Kind | StableId | DefinitionVersion | Definition |
|---|---|---|---|
| registry/measurement-evidence-intake | definition/measurement-evidence-intake | measurement-evidence-carriage/0.1-candidate | 336/1 |
| registry/transition-registration | MeasurementEvidenceIntakeTransition | transition-admission-extension/0.7-candidate | 341/1 |

Each new row occurs exactly once in the first profile. 336 copies only the existing committed
probe channel's ObserverId, ObservationChannelId and UnitId: observer/bridge-subject,
channel/regulatory-diagnostic-probe and unit/diagnostic-regulatory-level respectively. Compile
exact equality against 331's embedded 332 channel, then expose only the safe detached 336
projection. It carries no probe definition handle, subject ownership, availability or REG key.
The profile binds this sole intake registration to this sole definition; no additional ID field
or callback selects configuration. Missing, extra or mismatched rows reject.

341 is exactly:

- ExecutingSeamId = seam/measurement-evidence-carriage; ExecutingSeamVersion = measurement-evidence-carriage/0.1-candidate.
- TransitionDefinition = 340 with InputAdmission = 339. InputRecordSchema = 203/1; RequiredSourceRelation = 1.
- Producer = 338 with seam/regulatory-diagnostic-probe, regulatory-diagnostic-probe/0.1-candidate, event/regulatory-diagnostic-probe-observation, phase 120, output schema 203/1.
- ReadDomain = empty set; OutputDefinitions = singleton 277{337/1, multiplicity 1}; WriteCapability = 273{tag 1 = NoStateWrites}.
- IngressDefinition = 276{event/measurement-evidence-intake, DueAtRule 1, ConsumerPhase 130, PayloadRule 1, Multiplicity 1}.

DefinitionVersion plus kind, StableId and record/schema selects V04/V06/V07 grammar. V07 has
only the direct 338 producer form; it imports no ADAPT grammar or future registered producer
form. The intake has no TransitionRoutes entry and emits no semantic children. Exactly one
337 output embeds the admitted 203 unchanged, UnitId from 336, allocated 1124 identity and
accepted carriage transformation version. Existing EVID/ADAPT output closures are unchanged.

## Reused source profile and conditional child ownership

The directly selected campaign2-probe-ordered-input/0.1-candidate retains its existing
five-position ordered-input envelope
and two source branches: authored adaptation input and the probe opportunity/333. It retains
the probe restrictions (phase 110, future DueAt, no dependencies/parents, at most one probe per
instant, no adaptation source at that instant). No new public input form is needed. Initial
intake, padding, 203 or 337 input rejects; event vocabulary membership does not grant InputOnly
authority. Complete original manifest compilation owns initial source IDs and RunIdentity. Runtime-generated
carriage children belong to RulesVersion, registered ingress, host closure and trace semantics;
they do not change the original-input grammar or its semantic identity.

At phase 120 the probe's existing tracking child remains first and owned by its plan. Shared
ingress alone generates the second child from authenticated actual permitted 203 and exactly
one matching committed V07 registration. On suppressed production the profile supplies private
carriage padding instead. Permitted counts (ingress 1,padding 0), suppressed counts (0,1),
total second-slot count exactly one. Missing/duplicate matches on actual 203 reject; they never
trigger padding. Bind each allocated child only to its owning plan.

The phase-130 intake/padding slot precedes EVID evaluation by EventSequence. Every branch uses
six runtime ordinal advances and eight generated child IDs/sequences (nine events including the
source). Real intake allocates one 1124 occurrence; padding consumes one private void advance.
No padding record, namespace, inspected ordinal or generic skip API. Historical probe .1/.2
budgets remain fixed. Paired successor X/E/L identities stay equal; cross-model E/L equality is
not required. Padding/budget policy is fixed by RulesVersion, not a public option.

## Whole trace and persistence profiles

The successor trace dispatcher owns every event mapping exactly once, including intake and
carriage padding. It preserves inherited phase-110 D-read/accessor semantics, 203 output semantics,
121..124 SEM projections and EVID mappings. The complete phase-120 envelope is successor semantics:
its EmittedEvents contains tracking plus intake/padding and is not byte-identical to probe .2.
Intake RecordKind is its EventTypeId, seam/version is carriage, SubjectIds=[ObserverId],
SourceRecordIds=[ObservationId], InputProjection=exact 203, OutputProjection=exact 337.
ActualReadRecords=[], StatePatch={}, randomness/quantization/mutations empty, no semantic children.
Unit context is committed configuration, not a fabricated state read or truth source. Padding
has empty evidence/source/output projections and no typed occurrence. Padding uses
seam/measurement-evidence-carriage and measurement-evidence-carriage/0.1-candidate in trace;
it never masquerades as a V07 transition execution. The phase-120 combined
child trace must match actual allocated ownership and ordered child closure.

Reuse existing save records and boundary-only saves. Archive 337 as committed output with its
embedded 203; no persistent character-learning root, store or added save field. Restore validates
schema, roles, occurrence identity, exact configuration/version, authenticated source/output and
ordered trace closure under the saved model. Historical values are never re-derived from current
D, R0, permission or calibration. Reconstruct original InputOnly authority by scratch compilation
of the complete manifest and require exact pending-source subset equality at the boundary.
No pending generated intake/padding/probe stage is legal at a successful boundary save. No trace
certificate, history replay, migration alias or current-state reconstruction substitutes for this.
Entire-instant failure rolls back output, trace, queue, association tickets, IDs and state.
Existing save fields 8/9/10 remain empty under this profile's unchanged analytical/random/coupling
scope; carriage introduces none. Wrong model or mixed persistence profile rejects.

## Concrete materialization gate and controls

After packaging acceptance, construct declarations through an explicit review compiler and
materialize into a separate campaign2-measurement-evidence-model packet. Do not copy stored
ModelIdentity bytes as construction inputs. Commit changed RegistryManifest, RegistryIdentity,
RegistrySchemaVersion and RulesVersion, yielding a new ModelIdentity. Content and parameter
manifests/identities remain byte-identical. No digest is invented here.

The review packet must include canonical components and readable forms, expanded ordered bundle,
profile bindings, exact slot/entry/role differences, decode/re-encode parity, preservation hashes
for prior frozen packets/allocation authority, and fresh-process reproducibility. Availability/
permission variants change only the existing two committed probe booleans, producing four
separate model identities; within each intervention pair the full model is fixed.

| Control | Required packaging witness | Status |
|---|---|---|
| EVC-PACK-A | Exact 0..5 layout and delta; slots 1..4 and inherited rows/roles preserved; no new union. | FROZEN, NOT PASSED |
| EVC-PACK-B | One V04 singleton and exact V04/V06/V07 dispatch; missing/extra rows and version/schema mismatches reject. | FROZEN, NOT PASSED |
| EVC-PACK-C | Require new measurement-evidence registry/trace/persistence .1 and reused probe ordered-input .1 directly. Reject old registry/trace/persistence, caller adapters, fallback and an invented measurement-evidence input profile. | FROZEN, NOT PASSED |
| EVC-PACK-D | Exact 336/channel relation and 338 producer; input/output roles agree; duplicate 203 role or identity substitution rejects. | FROZEN, NOT PASSED |
| EVC-PACK-E | Original source grammar only; generated intake/padding cannot be initial inputs or restored pending sources. | FROZEN, NOT PASSED |
| EVC-PACK-F | Exact generative/padding ownership, ordering and six/eight budget cannot change under same RulesVersion. | FROZEN, NOT PASSED |
| EVC-PACK-G | Historical output validation never recomputes current measurement; changed/incompatible model rejects. | FROZEN, NOT PASSED |
| EVC-PACK-H | Canonical-set permutations preserve commitments; each admitted boolean change alters RegistryIdentity/ModelIdentity; old packets preserved and fresh-process materialization reproduces bytes. | FROZEN, NOT PASSED |
| EVC-PACK-I | For every canonical original manifest in the accepted probe input domain, the directly reused profile under this successor yields the same canonical initial source schedule, IDs, sequences and payloads as frozen probe .2, modulo RunIdentity fields whose enclosing ModelIdentity differs. No generated carriage event becomes initial input. Any language or compilation change requires a successor input profile. | FROZEN, NOT PASSED |

These are packaging obligations, not executed runtime evidence. Review requested: exact profile
bindings, six-slot registry delta, singleton/configuration association and whole source/trace/save
closure. Materialization follows acceptance; runtime implementation still requires the subsequent
gates. ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

## Revision-1 review disposition

The unearned campaign2-measurement-evidence-ordered-input/0.1-candidate proposal is withdrawn.
The exact required binding is campaign2-probe-ordered-input/0.1-candidate, selected directly by
the new RulesVersion. EVC-PACK-I makes input equivalence a qualification obligation rather than
an assumed runtime result. EVC-PACK-C distinguishes intentional reuse from invalid profile mixing.
The phase-120 complete trace envelope and padding seam ownership are clarified above. No carriage
semantics, allocation, registry delta, persistence scope or runtime topology is redesigned.
Whole packaging remains pending review; materialization and implementation are not authorized.

## Revision-2 acceptance

The user accepts the exact tuple and all packaging obligations. The earlier pending-review
wording is retained as proposal history; concrete materialization is now authorized. Runtime
activation remains blocked until the resulting ModelIdentity is reviewed and frozen.
