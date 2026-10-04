# Observer-safe measurement-evidence carriage

**Status: WHOLE SHAPE ACCEPTED.** Accepted 2026-09-07.

Version: `measurement-evidence-carriage/0.1-candidate`.
Registration grammar: `transition-admission-extension/0.7-candidate`.
Shared singleton: `transition-admission/0.4-candidate`, unchanged.
EVC-A..P: **FROZEN, NOT PASSED**. Symbolic/numeric allocation is authorized next;
implementation is NOT YET AUTHORIZED. ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain OPEN.

Revision-3 shape is accepted with one clarification: the first carriage profile admits only
AuthenticatedObserverMeasurementProducer. Any future V07 use of another producer form requires
separately committed registration semantics; generic cross-version registered-producer resolution
is not permission to broaden this profile. Field/namespace symbols below await separate allocation.

## 1. Experiment frozen before representation

**Positive pair:** hold ObserverId, observer/subject relation, ObservationId, support topology,
channel, unit, time, availability, permission, provenance structure, named consumer, model and
allocation topology fixed. Vary only permitted measurement content, for example exact point
5 versus exact point 51/10. The admitted measurement content and resulting transient cognitive
evidence must differ first through that content; IDs, metadata and support topology must not
manufacture the difference.

**Hidden-cause pair:** hold admitted observation bytes and the safe channel/unit binding fixed;
vary hidden D, R0 decomposition, truth occurrence and inaccessible world facts. The cognitive
consumer's operands and output must be identical at matched output allocation. Where the frozen
public specimen cannot vary those causes independently, use a narrowly identified producer/
consumer component witness and preserve the public specimen's exclusion. Do not invent a public
model that accepts those variations under an old identity.

**Successful claim:** a permitted observer-relative measurement becomes distinguishable,
provenance-safe input to an explicitly authorized cognitive evidence consumer while hidden and
unpermitted causes remain inaccessible. Call this *measurement-evidence carriage divergence*.
It is not ADAPT-9b, cognitive-state divergence or learning. ADAPT-9b is reconsidered only after
this seam is qualified and a subsequent responding cognitive mechanism is selected.

## 2. Actual substrate inspected

| Surface | Existing contract / implementation and consequence |
|---|---|
| Present/missing measurement | `src/observation/observation.ts`: 202 is MissingObservation; 203 is PresentObservation; 204 has separate lower/upper presence and exact rational endpoints. 203 includes O, subject, channel, time, kind, precision, tokens, safe references and producer version. It does **not** include UnitId or ModalityId. Missing is not a zero measurement. |
| Qualified producer | `src/campaign2/probeExecution.ts` emits exact present 203 only for available+permitted. Its 332 channel holds channel/O/subject/modality/unit. Producer version is regulatory-diagnostic-probe/0.1-candidate; tokens and safe references are empty; precision=1 and kind=Point. Neither suppressed branch emits a 202. |
| Existing semantic carriers | `EVENT_SEMANTIC_SCHEMA_INVENTORY.md` and the production freeze build 227 with support observation identities, not interval payloads. Historical 209 contains present observations but is not the accepted 227/EVID input. Reusing 209 would not grant a new cognitive consumer authority. |
| Observer-safe references | `src/semanticBinding/evidenceProvenance.ts`: CharacterEvidenceRef includes observation; ObserverSafeEvidenceOccurrence explicitly contains **no payload**. `resolveAdmissibleEvidenceReference` checks schema/seam, observer, time and scope and returns index metadata. It is not an observation-payload store/resolver. |
| EVID | `EVID_001_DRAFT_RESOLUTION.md`, `evidExecution.ts`: immutable consequence 227 → 269 → 270; detached input and output identity only; no state read/write or numeric resolution. Existing semantics remain unchanged. |
| Admission | `transitionAdmissionV04.ts` recognizes SEM-frozen 227 and registered producer outputs in V04, plus the separately versioned V06 authored 307 path. Probe observation is neither V04 producer branch. Generic transitions need no route mapping: the compiler checks mappings where present, while EVID/ADAPT specializations impose their own routes. 203 existence does not admit cognitive input. |
| Identity allocation | `occurrenceIdentity.ts` extracts a required top-level identity under a governed role; it does not allocate or prove freshness. 203 already owns ObservationId/1115. Scheduler's shared runtime allocator and emitted-event IDs supply transactional occurrence identity. No second observation identity is needed. |
| Scheduling | Existing consequence phases 120..124 and phase 130 are schedulable. Same-phase ordering uses EventSequence. No phase 125 or new phase is needed; 150 remains a nonschedulable barrier. |
| Trace/persistence | Trace/160 already carries exact input/output projections, source identities and child events; saves contain committed output bytes and trace. Probe archive validation preserves historical observations and exact producer/output closure without current-D recomputation. New schemas/profile support still need explicit admission. |
| Model commitment | `probeModelReview.ts` admits only its exact specimen plus the two committed booleans. `probeModel.ts` selects exact .2 whole profiles. Neither can admit this new transition/consumer/schema/topology by merely adding a shared identifier. |

Architecture §4.2 requires consumer-specific evidence admission: accessibility is not permission
to dereference. Reference ledger dispositions used here are SUB-001 exact arithmetic, SUB-008
trace/replay, SUB-009 paired intervention and SUB-011 retained failure history. SUB-007
consolidation and SUB-012 response law remain deferred controls, not carriage mechanisms.

## 3. Representation decision accepted after inspection

**Accepted A: self-contained admitted evidence for this first seam.** Preserve the entire admitted
203 as an embedded immutable record, plus its admitted unit context. This reuses the existing
interval, observation identity and provenance fields without defining parallel scalar or source
representations. The first admitted 203 has empty tokens/references, so whole-record carriage
does not acquire a traversable evidence graph. Its original canonical bytes must remain exact.

This choice is justified by historical retention and authority, not encoding convenience: the
payload already exists at the trusted observer-side producer boundary and can be handed directly
to one consumer; saves retain it without a new store lifecycle or payload resolver. Option B
would require a separately governed observer-owned payload store, exact resolution capability,
retention/availability rules and persistence semantics that the inspected metadata index does
not provide. B remains a future candidate; no current reference gains implicit lookup authority.

Embedding alone does not prove permission. Only authenticated generative producer admission
described below may deliver the embedded 203. Public caller-supplied bytes, trace records and
observation IDs cannot mint a delivery capability.

## 4. Named consumer and bounded admitted domain

**Consumer role:** `MeasurementEvidenceIntake`. It is an observer-owned transient evidence
intake transition at the cognitive evidence boundary, not a new belief/appraisal/learning box.
Its sole operation is representation-preserving admission and publication of a governed
`CognitiveMeasurementEvidence` occurrence. There is no subsequent consumer in this first seam.

Accepted committed `MeasurementEvidenceIntakeDefinition`:

| Field | Meaning |
|---|---|
| ObserverId | Exact owner of this intake, independent of observed SubjectId. |
| ObservationChannelId | One admitted diagnostic channel. |
| UnitId | Exact admitted unit context for that channel. |

Use existing model-governed definition/entry mechanisms and existing identity families for these
fields. Construction validates this definition against the existing committed 332 channel's
O/channel/unit. The runtime consumer receives only this safe definition projection, never the
probe definition containing regulatory key, availability/permission or hidden-state machinery.
The first profile fixes modality to the existing diagnostic modality at compile time; it does
not introduce modality-dependent interpretation. No modality field is needed in the output.

First bounded admission is exactly:

- 203/schema 1 from the authenticated diagnostic observation producer at consequence phase 120.
- Exact producing version regulatory-diagnostic-probe/0.1-candidate, not observation/0.1 merely
  because the record layout matches.
- Matching intake ObserverId and channel; unit is the exact existing `unit/diagnostic-regulatory-level`
  member in namespace 1039. This grants no unit conversion or REG/unit relation.
- Both 204 endpoints present and equal, canonical exact rational; Point kind; precision exactly
  rational 1; tokens and SafeSourceReferences empty. Preserve all 203 fields byte-for-byte.
- SubjectId is copied as **observed subject metadata**, never interpreted as cognitive owner.

The trusted producer owns measurement validity/permission. The consumer does not rederive n,
scale, D, R0, calibration or truth. Canonical/profile checks and the exact producer capability
jointly establish admission. No arbitrary truthful-looking 203 can pass on shape alone.

**Missingness decision:** this version admits only exact Present diagnostic measurements.
202, absent intervals, bounds-only evidence and missingness-as-content are not admitted.
Ordinary suppression causes zero evidence access/output; forged/mismatched deliveries reject
before publication. This defines no inference that a value is absent and synthesizes no 202.

Ownership remains ObserverId throughout. No CharacterId is resolved or stored as intake owner.
A future CharacterId-owned consumer must use accepted PRJ/IDN; nested observation.SubjectId is
not a shortcut. In particular, current PRJ's top-level-field restriction is not silently widened
to traverse this output's embedded observation.

## 5. Symbolic record and occurrence closure

Accepted `CognitiveMeasurementEvidence`:

| Field | Value / rule |
|---|---|
| CognitiveMeasurementEvidenceId | One fresh occurrence allocated transactionally by the shared runtime allocator, wrapped in its separately reviewed symbolic occurrence family. |
| Observation | The complete exact admitted PresentObservation/203. Owns its existing ObservationId; no reallocation, derived ID or hash. |
| UnitId | Safe unit snapshot from the matching immutable intake definition; exact equality at creation. |
| TransformationVersion | Exactly measurement-evidence-carriage/0.1-candidate; a draft identifier is never executable. |

No new ObserverId, CharacterId, source-list, timestamp, scalar, precision, truth ID, belief key,
reward or provenance hash is duplicated in the wrapper. Observer/time/source are already in
203. Definition/consumer identity is established by committed registration and trace; the record
needs no duplicate definition handle. A new occurrence identifies **admission**, not a second
observation. Exact input/output occurrence governance is fixed in §5.1 below.

### 5.1 Exact occurrence identities and canonical roles

Inspection of `firstModelCandidate.ts` and the frozen
`campaign2-probe-successor-model/registry.json` establishes:

- PresentObservation is record **203/schema 1**; its required top-level **field 1** is ObservationId.
- Slot 5 already contains exactly one CanonicalRoleConstraint/265 at RecordField(203,1):
  CanonicalRolePosition/264 has VariantTag=RecordField (existing tag 1), RecordTypeId=203,
  FieldId=1; CanonicalIdentityRole/263 has RequiredNamespace=1115, DomainValidatorId absent.
  In 264's wire layout FieldId itself is field 4; this does not change the target 203 field 1.
- The inherited role is constructed explicitly by `recordRole(203,1,namespaceRole(1115))`.
  The frozen probe successor carries it unchanged. **Reuse it; do not add a duplicate role.**
- Slot 0's current TransitionAdmissionRegistry/279 OccurrenceIdentities contains schemas
  227,269,270,307,324,325; **203/1 is absent**. Add exactly the successor entry
  `(203/1) → OccurrenceIdentityRule/278{IdentityFieldId=1,
  IdentityRole=CanonicalIdentityRole{RequiredNamespace=1115, DomainValidatorId absent}}`.
  Its role must be compatible with that existing exact slot-5 RecordField constraint.

For the new output, fix required top-level field **1 = CognitiveMeasurementEvidenceId**;
fields 2,3,4 are respectively Observation, UnitId and TransformationVersion in the accepted
shape. Define symbolic `NS_CognitiveMeasurementEvidenceId` to mean the *one future permanent
namespace allocated specifically to CognitiveMeasurementEvidenceId*, not a runtime parameter.
The output OccurrenceIdentityRule has IdentityFieldId=1 and RequiredNamespace exactly
NS_CognitiveMeasurementEvidenceId, DomainValidatorId absent. Add precisely the matching
RecordField(CognitiveMeasurementEvidence,1) CanonicalRoleConstraint with that same role.
The new record type, namespace and field allocation remain proposals until their separate gate;
the symbolic namespace cannot be replaced by 1115 or inferred from a field name/output position.

Field 2 embeds the original 203, whose existing ObservationId is validated under the reused
203 role; it does not allocate another observation, create a nested occurrence rule or become
the enclosing output's occurrence key. Missing/incompatible role, missing rule, wrong input
namespace, reused output identity and treating the embedded ObservationId as the output key
must all reject. Every inherited occurrence entry and canonical role remains unchanged.

One valid delivery → exactly one output of the new type and no emitted semantic children.
No alternative outcome union, no learning/evaluation output and no automatic-adaptation output.
The semantic function receives detached admitted 203, safe UnitId and allocated output ID only.
No scheduler/event identity, state handle, evidence index, callback, trace or model object enters.

## 6. Admission extension and expressibility blockers

**Real blockers to current canonical expression:** closed producer grammar does not
admit the probe's 203; existing evidence reference resolution has no payload capability; new
output type is absent from codecs/occurrence rules; frozen whole profiles exclude all additions.
These require allocation and packaging before implementation. No existing seam is defective for excluding it.

`MeasurementEvidenceIntakeTransition` is a registered transition with NoStateWrites and **no
TransitionRoutes entry**. Generic transition execution does not require route membership;
membership is singular where present, not total. Its own TransitionOutputDefinition closes
exactly the one output in §5. Neither existing learning route, its aggregate output closure nor
any state-family mapping changes. No new LearningRouteId member is authorized.

### 6.1 Separate registration extension; unchanged shared singleton

Accept **`transition-admission-extension/0.7-candidate`**. This extension neither replaces nor versions the
shared singleton. Inspection of the accepted ADAPT coexistence contract and
`transitionAdmissionV04.ts` confirms the existing ownership: the singleton remains
`definition/transition-admission`, kind `registry/transition-admission`, DefinitionVersion
`transition-admission/0.4-candidate`, with exactly LearningRoutes, TransitionRoutes and
OccurrenceIdentities under its unchanged registry grammar and cardinality **one**.

Only successor **committed data** adds the §5.1 occurrence entries for 203/1 and the new output
in that singleton's existing OccurrenceIdentities map. Its semantic version, learning routes,
transition-route mappings and inherited occurrence entries remain unchanged. This changes the
successor RegistryManifest/ModelIdentity; it does not change any frozen model's bytes.

The accepted admission matrix for the future successor is:

| Registry kind | StableId | DefinitionVersion | Definition grammar / cardinality |
|---|---|---|---|
| registry/transition-admission | definition/transition-admission | transition-admission/0.4-candidate | Shared TransitionAdmissionRegistry; exactly one singleton. |
| registry/transition-registration | Each existing EVID TransitionKind | transition-admission/0.4-candidate | Existing TransitionRegistration V04, unchanged rows. |
| registry/transition-registration | Each existing ADAPT TransitionKind | transition-admission-extension/0.6-candidate | Existing TransitionRegistration V06, unchanged rows. |
| registry/transition-registration | MeasurementEvidenceIntakeTransition | transition-admission-extension/0.7-candidate | New TransitionRegistrationV07; exactly one matching intake in this profile. |

Dispatch selects grammar solely from the committed DefinitionVersion and verifies its exact
record/schema. Unknown or mismatched versions reject. No latest-version selection, host-type
selection, feature detection or fallback decoding is permitted. V04 EVID and V06 ADAPT
registration bytes stay identical; V07 is an additional row, not a conversion of those rows.

V07 is a **NoStateWrites-only registration extension**, not a universal V04+V06 superset.
Its own versioned producer/input-admission representation supports the following exact branch:

| AuthenticatedObserverMeasurementProducer field | First-profile fixed value |
|---|---|
| ProducingSeamId | Existing diagnostic producer seam identity, `seam/regulatory-diagnostic-probe`. |
| ProducingSeamVersion | `regulatory-diagnostic-probe/0.1-candidate` |
| ProducerEventTypeId | `event/regulatory-diagnostic-probe-observation` |
| ProducerPhase | 120 |
| OutputRecordSchema | PresentObservation/203, schema 1 |

Preserve the semantically unchanged V04 registration fields and reuse unchanged ingress,
output-definition, occurrence-rule and NoStateWrites layouts. Changed enclosing producer,
input-admission, transition-definition and registration layouts get their own versioned symbolic
schemas wherever nested schema references change. V04's producer union remains exactly
FrozenSemanticExperienceProducer / RegisteredTransitionProducer; its discriminants are untouched.
V07 does not import V06's authored ADAPT production grammar, StateWrites, WritableFamilies or
adaptation-rule resolution. Its WriteCapability admits NoStateWrites only. No numeric type or
union tag is assigned here; no wildcard or arbitrary callback is admitted.

Existing RegisteredTransitionProducer resolution remains through the producer's committed
registration, independently of its V04 or V06 grammar; where applicable to a V07 registered
producer, dispatch likewise uses that row's committed version and governed output definition.
This preserves cross-version identity/output resolution without granting any additional consumer
admission. The diagnostic producer remains the exact authenticated branch above; it does not
pretend to be a registered transition. The first V07 profile admits only that diagnostic branch.

### 6.2 Generative ingress authority

Only the trusted host adapter may report actual transaction-local diagnostic output to shared
successor ingress. It supplies the authenticated producer identity and exact emitted 203, never
a downstream event/transition ID chosen by the producer. The interpreter discovers matching
consumer registrations from committed definitions and generates `event/measurement-evidence-intake`
through the matching ingress definition. The first successor profile requires exactly one
matching intake registration for each permitted diagnostic 203; missing or duplicate matches
reject the instant. Padding is never recovery for an invalid or unmatched present output.

The probe semantic producer emits domain output and remains unaware of the intake event,
transition and consumer. Neither a caller-supplied 203 nor its version string, ObservationId or
trace ancestry authenticates production. Suppressed production emits no 203; shared ingress
therefore generates no intake child. The separate profile padding rule is specified in §7.

Allocated child binding proves event identity,
phase, parent, input equality and single use. Admission context's ObserverId comes from the
committed intake owner, not from untrusted input. Match input O to that context before exposing
content. Consuming another observer's identical-subject evidence rejects. Expired, unassociated,
duplicated or altered events cannot mint inputs. The scalar-bearing input has no lookup method.

The semantic evidence domain is exact 203/schema/producer/O/channel/unit as above. Persistent
state ReadDomain={}, ActualReadRecords=[], WritableStateFamilies={}, StatePatch={}. These empty
state reads do **not** mean evidence is ungoverned: it arrives through typed admitted payload,
not a state accessor. Do not invent a state-read trace for a payload handoff.

## 7. Accepted scheduling and permission-neutral allocation

This is the accepted topology for a future **successor whole profile**, not a change to frozen probe .1/.2.
At the existing diagnostic observation slot, after the existing observation/experience allocation,
the shared interpreter generates the real phase-130 intake child from actual permitted 203.
Only when production is suppressed and no 203 exists does the successor profile generate the
private payload-empty `event/measurement-evidence-padding`. The probe producer retains its
existing tracking child plan; it neither authors the intake child nor receives consumer IDs.

Freeze this conditional closure at phase-120 settlement:

| Production branch | Shared ingress intake children | Profile padding children | Total carriage-slot children |
|---|---:|---:|---:|
| Permitted, valid 203 | 1 | 0 | 1 |
| Suppressed, no 203 | 0 | 1 | 1 |

The combined allocation list is ordered: child 1 is existing tracking; child 2 is the
interpreter-generated intake **or** profile-owned padding. Both, neither, extra children,
wrong ordering and producer-authored intake reject. Validate closure before publication; bind
the scheduler-allocated children to their respective owning plans. The old probe plan still
receives only its own tracking child for its one-child association check. Padding is private
host infrastructure, never a fake transition input, cognitive occurrence or fallback after
failed admission. The intake registration is distinct from both EVID events.

The existing 121..124 chain settles before phase 130. Because the new child is allocated at 120,
its EventSequence precedes EVID's evaluation child allocated at 124. It therefore executes at
130 before EVID, without adding a phase or requiring any state read/write ordering decision.
On permitted intake, allocate one output ordinal; on padding, consume exactly one private void
ordinal. Neither observes a discarded ordinal. The successor budget is thus exactly six runtime
advances and eight generated child IDs/sequences for the extended probe instant, independently
of availability/permission. No adaptive budget calculation or generic padding API is introduced.

The original eight-event probe chain and EVID record mathematics stay intact. Under the successor,
later EVID occurrence ordinals shift by the declared additional intake slot, equally across paired
branches. Do not claim cross-version byte equality of those occurrence IDs. Old .1/.2 programs
still emit their original bytes and retain PROBE-M; no new handler activates under those models.
Matched successor pairs still keep their ordinary X/E/L content and allocated identities equal.
The new occurrence alone carries the numeric-content difference.

## 8. Trace, history and canonical commitment

Use trace/160: consumer event type as RecordKind; new seam/version; ObserverId as subject;
source ObservationId only; exact 203 InputProjection and new occurrence OutputProjection;
zero state reads, randomness, quantization, patch and mutations; no semantic children. Padding
trace has empty evidence input/output/source list and no typed occurrence. Truth-side source
event ancestry remains omniscient trace-only and is unavailable to the consumer or output.

On commit, preserve embedded 203, unit snapshot and output identity exactly. Restore checks
canonical schemas/roles, fixed producer/output closure, observer/channel/unit consistency and
original occurrence/event authority under the saved model/profile. It does not rerun probe
measurement or use current D/R0/permission/calibration to reconstruct historical evidence.
Same-model later-state changes cannot rewrite the record. Changed model calibration or permission
does not authorize cross-model restore; incompatible model/profile is rejected rather than migrated.

Entire instant failure rolls back new output, allocated IDs, queue, trace, reservations and state.
No new persistent evidence store is introduced. Trace/output archival uses the existing save
infrastructure, and the new cognitive occurrence is not inserted into SEM-G's reference union.
Future historical dereferencing requires a separately admitted consumer capability.

Required before implementation: separate symbolic/member and numeric allocation acceptance;
exact manifest/role/schema/codec/persistence/trace closure; successor registry/profile packaging,
RulesVersion and ModelIdentity materialization and freeze. This is not a RulesVersion-only delta:
RegistryManifest and RegistryIdentity also change. No frozen allocation or model bytes change
by this acceptance. No numeric values are assigned by this semantic contract.

## 9. Frozen adversarial vectors — NOT PASSED

| Label | Required witness |
|---|---|
| EVC-A | Fixed O/subject relation/observation identity/support/channel/unit/time/permission/provenance/model/consumer/allocation; only permitted exact measurement varies → new admitted input/output content differs. |
| EVC-B | Exact admitted 203/unit fixed; hidden D, R0 decomposition, truth occurrence and inaccessible facts vary → identical detached consumer input and output. Declare generic-component versus public-model scope honestly. |
| EVC-C | All four available/permitted branches; suppressed cases produce no carriage access/output, and common later sentinel identities match. No missingness record or value is synthesized. |
| EVC-D | Other observer with same subject and same measurement is inaccessible; observation.SubjectId cannot supply consumer ownership. |
| EVC-E | Wrong channel, unit, schema, producing seam/version, precision, evidence kind, token/ref surface, missing/bounds-only input reject; valid exact-present control succeeds. |
| EVC-F | No traversal via observation/source/truth/hash/trace/allocator; raw state, metadata index, resolver and callback substitutions fail at the consumer capability boundary. |
| EVC-G | Exact canonical interval and whole admitted 203 bytes preserved, including 51/10; float, rounding, gain, clipping, classification and reward interpretations fail. |
| EVC-H | Historical output remains byte-identical across current-state changes and same-model restore; no recomputation from current D/R0/calibration/permission; wrong model rejects. |
| EVC-I | Old .1/.2 packets and X/E/L semantics remain fixed, PROBE-M remains true under their versions; old models reject the new transition, producer grammar, types and handler activation. Successor paired X/E/L remain equal. |
| EVC-J | No persistent cognitive/adaptation writes; full state byte-identical; no ORD-001 dependency, no belief/memory/appraisal/value semantics. |
| EVC-K | Only actual permitted producer output through shared generative ingress admits the consumer: producer-authored intake, forged producer/child, changed bytes, replay, duplicates, wrong phase/parent and expired admission reject. Missing/duplicate matching registrations reject, never pad. One delivery yields one output; no raw OBS-to-L bypass. |
| EVC-L | Unit context comes solely from admitted safe committed channel binding; no REG key, scale, truth handle or duplicate observation/provenance identity leaks. |
| EVC-M | Enforce §7 permitted (ingress=1,padding=0) and suppressed (ingress=0,padding=1) closure; both/neither/wrong owner/order reject. Fixed six runtime advances/eight generated children in all branches; padding is void/private/non-inspectable and cannot affect later sentinel. |
| EVC-N | Faults before/after handoff, occurrence allocation, output and trace roll back the entire instant; fresh-process restore retains exact historical and future continuation bytes. |
| EVC-O | Commit carriage schemas, output occurrence namespace, transition/event/seam, intake definition/kind/member, separate V07 registration grammar and whole profiles/RulesVersion. Keep exactly one V04 admission singleton; extend only its occurrence-map data. Preserve V04/V06 rows and dispatch by committed DefinitionVersion; replaced/duplicate singleton, version/schema mismatch, fallback decoding or V07 StateWrites reject. No new LearningRouteId or intake route mapping. Reuse exact 203 field-1 role/1115, add its missing occurrence rule; missing/incompatible rules/roles, wrong namespaces, duplicate role, reused output ID or embedded-ID-as-output-key reject. Output field-1 rule and role agree on its own future namespace. Changed semantics cannot acquire old ModelIdentity; allocation gates remain separate. |
| EVC-P | Report only admitted cognitive-input/carriage divergence. Zero evidence of a selected downstream update; ADAPT-9b and parent gates remain open even if every carriage control passes. |

No vector is passed by shape acceptance. Missingness semantics beyond exact present, generic observation
formats, shared-observer access, persistent stores, historical lookup, CharacterId-owned consumers,
belief/memory/consolidation/appraisal/reward and physiological/performance laws are deliberately deferred.

