# Measurement memory M3 — physical episode and sole writer, revision 2

2026-09-07. **M3 COMPONENT SHAPE ACCEPTED; KEY CONDITION CLOSED BY ACCEPTED M4b.**
User accepts the physical family, episode value, sole authority, insert-only WRT relation,
character-learning route, exact patch/diff closure and trace direction. The key remains accepted
in direction pending M4b. Revision2 changes only the two rejected areas: it reuses accepted
StateWrites and removes every independent state/restore-validator IDN lookup. M1 and bounded M2
remain accepted; no whole-seam, allocation or implementation acceptance is inferred.
Component of `measurement-episodic-memory/0.1-draft`. All new names below are symbolic;
no permanent record IDs, fields, members or occurrence namespaces are allocated here.
The [parent draft](CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md) owns the accepted target and unchanged
MEMR-A..P obligations. M4b must agree on this exact address before the key can freeze.

## Inspection and design basis

The reference-mechanism dispositions in the parent remain applicable: preserve exact historical
content (MEC-022/RET-013), WRT/replay/paired controls; import no historical salience, prediction
error, accessibility, participant attribution or retrieval-history mathematics.

`stateModel.ts` already compiles ownership155/154/153, canonical-record value grammar152,
key grammar261/260, identity-role checks and generic patches. Its value validation checks record
grammar and roles; it does not establish key-to-nested-source or live-source equality. M3 must
specify those constraints explicitly. `state.ts` applies set operations with expected absence and
fails duplicate insertion as STALE_PRECONDITION. That primitive is sufficient; no new WRT operation
or semantic occupancy read is needed.

`adaptationDomains.ts` commits the old exact materialization and five ADAPT leaf families.
`adaptationTransitions.ts` couples V06 to adaptation rules, targets and automatic-adaptation route.
Neither is a generic learned-memory writer. M1 continues to reuse V04; only the write-capable M3
registration needs a distinct bounded extension. The generic mutation authority namespace is1025.

## One physical family and exact symbolic records

All listed fields required; no additional fields admitted:

```text
MeasurementEpisodeKey
    CharacterId                       qualified existing1002 identity
    CognitiveMeasurementEvidenceId    existing1124 occurrence identity

MeasurementEpisode
    LearningEvidence                  complete exact MeasurementEpisodeLearningEvidence (M1)

MeasurementEpisodeState
    Episodes                          map<MeasurementEpisodeKey, MeasurementEpisode>
```

The key is the leading candidate accepted in direction, not frozen pending M4b. The value embeds
the admitted M1 occurrence; its Source337 is the sole observer-safe historical content authority.
No duplicate observer, owner, scalar, unit, time, precision, source ID or transformation version
is stored in the value. Schema/version plus the retained M1 version and writer registration carry
their respective semantics. No MemoryEpisodeId or episode occurrence allocator is introduced.
The state key is an address, not an output occurrence. M1 retains its own separate production ID.

One exact leaf pattern P is `(MeasurementEpisodeState, Episodes, mapKey:*)`. Each map entry is one
canonical state leaf; no monolithic map replacement is allowed. Empty memory means no episode
leaves. The bounded initial state admits no preseeded episodes; restored runs may contain valid
formed episodes. Root serialization/absence follows existing sparse state rules, with no invented
empty-root insertion. Initial-state and restore admission must remain distinct.

The first experiment uses one admitted source337 and at most one resulting episode for its
projected character. A keyed map representation is not qualification of multi-episode search,
capacity, forgetting or consolidation. The owning model's source/opportunity fixture bounds the
experiment; no semantic global memory-count read is introduced to enforce that fixture.

## Registry and role closure

| Declaration | Proposed exact meaning |
|---|---|
| Existing logical episodic-memory family1031 | route/character-learning; successor changes this family's storage from Unmaterialized to Materialized at MeasurementEpisodeState/Episodes |
| New symbolic leaf member leaf/measurement-episode in existing1032 | The one Episodes map-entry family, mapped to its field in the materialized storage declaration |
| New symbolic authority/measurement-episode-formation in existing1025 | Sole authority for P; owns no other pattern |
| Ownership registry155 with authority154/owned leaf153 | P; LeafValueGrammar=CanonicalRecord(MeasurementEpisode); RemovalAllowed=false |
| StateKeyGrammarDefinition261 with existing canonical-record key grammar260 | P uses exactly MeasurementEpisodeKey |
| Key.CharacterId role | RequiredNamespace1002, existing validator/character-qualification |
| Key.CognitiveMeasurementEvidenceId role | RequiredNamespace1124, DomainValidator absent |

Record-valued map keys are validated through their field roles, not a MapKey identity-atom role.
MeasurementEpisode.LearningEvidence and M1.Source337 are required record-typed fields, not identity
positions; they need no CanonicalIdentityRole. Reuse existing nested roles and accepted M1's future
occurrence-role requirement without adding duplicates.

The frozen measurement model registry.json already contains RecordField203/2 with namespace1000
and absent DomainValidator. Reuse it exactly for M2; no additional ObserverId role row is needed.
Packet inspection establishes this role-inventory fact, not a runtime projection pass.

Successor composition preserves the five prior ADAPT physical leaf declarations and all other
logical family meanings, adds P, and materializes episodic-memory only. The six resulting physical
families in this ADAPT-plus-memory topology are not a claim about all SEM/IDN state families.
Old models retain their exact old five-leaf check and unmaterialized memory. Do not globally relax
old validators or give the memory authority any prior leaf. The root/key/value schemas and the
symbolic authority/leaf members still require separate reviewed allocation and model commitments.

## Writer registration — bounded character-learning extension

Working contract label `measurement-memory-formation-registration/0.1-draft`, unaccepted. No V08/V09
identifier is presumed. Proposed new symbolic shapes use existing component records where exact:

```text
MemoryFormationRegistration
    ExecutingSeamId
    ExecutingSeamVersion
    TransitionDefinition : MemoryFormationDefinition
    IngressDefinition : existing TransitionIngressDefinition/276

MemoryFormationDefinition
    InputAdmission : existing TransitionInputAdmission/274
    ReadDomain : set<StatePathPattern>
    OutputDefinitions : set<existing TransitionOutputDefinition/277>
    WriteCapability : existing accepted WriteCapability, constrained here to:
        StateWrites {
            MutationAuthority = authority/measurement-episode-formation
            WritableFamilies = { episodic-memory }
        }
```

Reuse the accepted StateWrites capability and its existing representation/discriminant; do not
allocate a duplicate capability record or reinterpret the existing union. The new registration
constrains that capability to the exact authority and singleton family above. Compilation requires
episodic-memory Materialized, StateFamilyRoute(episodic-memory)=route/character-learning,
TransitionRoute(MemoryFormationTransition)=route/character-learning, and
StorageAuthorities(episodic-memory)={authority/measurement-episode-formation}.

StateWrites grants family/authority permission. Insert-only operation, deterministic path/value
derivation and exact cardinality are tighter memory-seam behavior, not a second capability concept.
The registration extension remains necessary because V04 permits no writes and V06's full
registration includes ADAPT-specific semantics. Reusing StateWrites does not decode this writer
as V06 or import its rule interpreter. V04/V06 semantics remain unchanged.

One SemanticRegistryEntry under registry/transition-registration names MemoryFormationTransition,
with the new exact DefinitionVersion and registration. Executing seam/version are the eventual
accepted memory seam version, not an ambient latest version. InputAdmission names exact M1 schema,
RegisteredTransitionProducer(MeasurementEpisodeEvidenceTransition), ExactImmediateProducerOutput.
Ingress uses a new symbolic formation event, SameAsProducer, phase140,
ExactAdmittedSourceOutput and ExactlyOncePerSourcePerConsumer. No delayed cue is generated here.

ReadDomain is exactly the required IDN roster family; no memory/REG/trace read is permitted.
Exactly one accepted M2 path requirement supplies ResolvedCharacterSubject. Requirement identity
remains (SeamId, SeamVersion, OutputAccessor), unique across static, old266 and new path requirements.
No old266 roster requirement coexists. Intermediate record fields use schema typing; only terminal
203.ObserverId participates in identity-role compatibility. The M2 admission-before-extraction order
is mandatory, including CharacterId qualification before semantic execution.

TransitionRoutes[MemoryFormationTransition] is route/character-learning and must equal the declared
episodic family route. OutputDefinitions={} is deliberate: formation produces its persistent patch
and infrastructure trace, not a transient duplicate episode record or formation receipt. Shared
completion must reject any emitted semantic output or generated child. No output occurrence rule
is needed for a zero-output writer; its admitted M1 input still needs the shared occurrence rule.
The parent output closure remains inhabited by M1 and earlier EVID outputs. M4a remains a separate
live337 branch. Successor admission must explicitly support this new registration and its empty
output set; adding a handler or changing a V04 switch is not sufficient authorization.

## Exact formation and validation

Let L be the live admitted M1 payload and C the detached M2 ResolvedCharacterSubject. Construct:

```text
K = MeasurementEpisodeKey(C, L.Source337.CognitiveMeasurementEvidenceId)
V = MeasurementEpisode(L)
path = (MeasurementEpisodeState, Episodes, mapKey:K)
patch = exactly one WRT Set(path, expected.presence=false, newValue=V)
```

The semantic writer receives only L and C. No state/roster/model/context callback, occupancy
lookup or current observation resolver is an operand. Namespace/role validation does not permit
deriving C from203.SubjectId. Precision1 remains inside the historical observation, not a weight.

Authority-boundary validation must prove the proposed patch equals this deterministic construction
from the actual admitted L and actual projected C, including complete nested byte/structural equality.
A lookalike L with equal ID but altered content is not admitted. Missing/extra operations, different
character or evidence key, changed value, expected-present set, remove, extra family, semantic output
or child all fail atomically. These are versioned seam invariants; canonical schemas alone do not
prove the equalities. No generic new cross-field validator language is assumed.

Apply the exact patch to staged state using existing WRT path/authority/precondition/value checks.
Preserve WRT's validation ordering and STALE_PRECONDITION for an occupied valid key. The writer has
no semantic access to the old value. Candidate validation then requires exactly one diff at path:
oldPresence=false, newPresence=true, newValue=V, and structural equality of every other state leaf.
Only that candidate may commit. Failure at completion, candidate validation or trace rolls back
the entire instant, including queue, allocators, outputs, trace and clock.

Live formation must not trust a precomputed patch from the caller. Compiler-derived execution and
seam validation are selected by committed registration/model identity. A malicious same-authority
patch is still rejected by exact path/content/diff closure even though generic WRT would own it.

Canonical state construction/restore validation checks only the episode's local invariants:
valid CharacterId role on key.CharacterId; namespace1124 on key.EvidenceId; exact episode/M1/337
schemas, versions and nested roles; and key.EvidenceId equal to nested Source337's ID. Character
qualification uses its accepted governed role, not an ObserverId-to-character roster lookup.
The local key/source equality needs explicit successor validation integration; existing record
grammar/role checks alone do not prove it.

Live ownership is established once by admitted M2/IDN projection. The exact legal patch then
uses that projected C and actual admitted L. No state validator, restore helper or validation-only
resolver may independently read CharacterObserverBindingState.Bindings to compare nested ObserverId
with key.CharacterId. Keeping such a lookup hidden from semantic code would still create the
rejected alternate IDN channel.

Canonical state validity is not proof of historical formation. M5 must close formation event
authority, admitted source association, the actual projected subject, exact patch/trace and restore
integrity without a second roster-read path. A locally well-formed episode must not be treated as
historically authenticated merely because these local checks pass. This remains an explicit M5
blocker, not a reason to relax IDN or to accept arbitrary restored episodes. Memory contents also
cannot certify pending recall authority.

## Formation trace and adverse cases

Use existing trace160 semantics, with formation event type as RecordKind, exact seam/version,
actual event/time/phase140, projected CharacterId subject, admitted M1 provenance and exact declared
ReadDomain. ActualReadRecords contains only the required IDN read, never a synthetic nested payload
or semantic occupancy read. Bind the accepted patch and actual structural diff; semantic output
and child lists are empty. Scheduler/event identities supply formation occurrence context without
a new memory ID. Exact trace-field mapping and profile validation belong to M5; no new trace schema
or trace-side data is made cognitive evidence.

Under existing MEMR-D/E/F/L/N/O require: wrong owner with same observed subject; forged L; absent
roster; duplicate key; valid authority with changed value/key or extra operation; replacement/remove;
other-family spill; extra output/child; and failure after staged insertion or trace. Verify exact
unrelated-state equality, not hashes alone. Positive5/51/10 formation differs only at the exact
episode leaf with matched identities. No new canonical vector labels or runtime passes are added.

## Closure boundary

This is a reviewable M3 proposal for materialization, exact key/value, roles, sole authority,
registration, insert-only patch, candidate validation and formation trace obligations. The key
stays conditional on M4b's exact same representation and preauthorized read. M4a delay semantics,
M4b composite read grammar and M5 scheduling/trace/restore composition remain open. In particular
M5 must inspect actual EventSequence order: intake-generated M1 cannot jump ahead of phase130
events allocated earlier, including pending EVID evaluation. All persistent formation is phase140.
No allocation or implementation is authorized. MEMR-A..P are FROZEN/NOT PASSED; ADAPT-9b and
Campaign2 remain OPEN.

## Revision history and remaining gates

Revision1 introduced a duplicate MeasurementEpisodeInsertCapability and proposed an independent
state/restore-validator roster lookup. User rejected both. Revision2 reuses accepted StateWrites
permission, retains exact insertion as memory-seam semantics, and limits structural validation to
local schemas/roles/source-ID equality. Live owner proof remains admitted M2; historical legitimacy
remains M5. Neither failed proposal is an accepted implementation alternative.

Phase140 is component direction only: the old ADAPT settlement admits only its two automatic
consumers. M5 must explicitly govern coexistence under a successor stage policy without changing
old models. M4b must still preauthorize the identical candidate episode key before address freeze.
Whole M3 acceptance remains withheld pending review of these corrections; no allocation or runtime
pass is claimed.

## M3 acceptance disposition — 2026-09-07

User SHAPE ACCEPTS revision2 M3: physical state/value, sole authority, StateWrites reuse,
insert-only relation, exact patch/diff, local validation and formation trace shape. Earlier
withheld/proposed wording above is review history, superseded by this scoped acceptance.
MeasurementEpisodeKey is conditional on M4b using the identical preauthorized address.
Formation trace source must represent the exact admitted M1 occurrence under the canonical
trace grammar; no unsupported direct type160 identity encoding is assumed.
M5 retains historical legitimacy and phase140 coexistence. No alternate IDN validation.
[M4b revision1](CAMPAIGN2_MEASUREMENT_MEMORY_M4B_DRAFT.md) is now the proposed next contract.
Whole seam, allocation and implementation remain gated; MEMR-A..P NOT PASSED.

M4b acceptance update — 2026-09-07: measurement-episode-read/0.1-candidate uses exactly this
MeasurementEpisodeKey. Its condition is CLOSED; the key shape is accepted unconditionally.
Earlier conditional statements are history. Numeric allocation still awaits M4a/composed inventory.
