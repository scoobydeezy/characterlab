# M4b — character-owned exact episode projection, revision 1

2026-09-07. **SHAPE ACCEPTED as measurement-episode-read/0.1-candidate.**
Accepted label `measurement-episode-read/0.1-candidate`. Component of the
[memory seam](CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md), using the conditionally accepted
[M3 key](CAMPAIGN2_MEASUREMENT_MEMORY_M3_DRAFT.md) without changes. No allocation or implementation.

## Inspected gap and bounded scope

`requiredProjection.ts` authenticates admitted input before selecting one top-level identity,
performs a required state-record field projection, and rejects absent required values. Accepted
M2 adds required record descent but does not compose keys from prior projections. Generic
`ContractReadProjection` in state.ts takes already constructed paths; its direct branch can read
a whole optional leaf and records its actual path/presence/value. Its callback-derived branch
does not supply a governed dynamic-key authorization contract and must not be used as a shortcut.

M4b adds exactly one fixed composition: this admitted recall's IDN-projected CharacterId plus
this admitted cue's1124 identity become M3's exact record key. It grants no generic dependency
graph, arbitrary state-derived selector, wildcard enumeration or global episode lookup.
Reference ledger dispositions remain those of the parent: MEC-009/010/EXP-006 retrieval lifecycle
controls remain preserved/deferred, MEC-021 participant attribution is not imported, and
MEC-022/RET-013 historical-content preservation and SUB-008/009 exact paired read traces apply.

## Required admitted cue interface — authority remains M4a

The address consumer requires two required top-level fields on an exact committed cue schema:
ObserverId (role1000, absent validator) and CognitiveMeasurementEvidenceId (role1124, absent
validator). No CharacterId, episode key, scalar,203/337 payload, current probe value or state
resolver is supplied. M4a must commit this exact interface in its generated cue schema and prove
both identities derive from the same actual live337. Any cue occurrence/event identity required
by admission is separate from these addressing operands and remains M4a's inventory.

Only an authenticated generated cue may reach this projection. An original manifest cannot
predict1124. A structurally legal pair is not authenticated: same-character/different-observer
bindings are permitted by IDN, so possession of an EvidenceId and a character match alone must
never permit composing a cue from another observer's occurrence. M4a's exact live source
association is an entry prerequisite, not a post-read content check. M4b cannot qualify runtime
recall until M4a closes that prerequisite and T2>T1 authority.

Recall uses the unchanged top-level IDN requirement over cue.ObserverId and the existing
ResolvedCharacterSubject accessor. M2's nested-path requirement remains formation-only in the
first profile. No copied CharacterId or T1 subject certificate substitutes for T2 re-resolution.

## Proposed symbolic requirement

```text
MeasurementEpisodeReadRequirement
    SubjectAccessor              ProjectionAccessorId
    EvidenceSourceFieldId        FieldId
    TargetStatePathTemplate      StatePathPattern
    OutputAccessor               ProjectionAccessorId
```

All fields required; no others. SubjectAccessor must equal ResolvedCharacterSubject and refer
to this same seam/version/event's unique admitted IDN requirement. EvidenceSourceFieldId must
name the exact required1124 field of the cue's admitted schema. TargetStatePathTemplate must
equal `(MeasurementEpisodeState, Episodes, mapKey:*)`, not an arbitrary template. Its key/value
grammars must be exactly MeasurementEpisodeKey and MeasurementEpisode. OutputAccessor is one
new symbolic member `accessor/measurement-episode-read` of existing1028; allocation deferred.

The requirement's version fixes the constructor to MeasurementEpisodeKey(CharacterId,EvidenceId)
and its two exact positions. No user-defined key constructor, field mapping list, compute callback,
role coercion or alternate root is admitted. No duplicate root-schema/key-schema fields are needed:
the registration fixes input schema and the target family declaration fixes key/value schema.
Requirement identity is (SeamId,SeamVersion,OutputAccessor), unique across all projection kinds.

Compilation requires exactly one IDN subject requirement and exactly one episode read requirement,
with distinct output accessors. The SubjectAccessor dependency must resolve to the exact IDN
requirement, not static/derived/another episode accessor. This single fixed dependency is the only
new composition; cycles, chains and additional dependencies reject. Intermediate IDN result C
retains its accepted qualification role. Key fields require the exact M3 roles1002/qualification
and1124/no-validator. Target pattern must be covered by the recall registration's ReadDomain.

ReadDomain is exactly the IDN roster family plus the episodic map-entry family. The broad declared
family is an audit boundary, not an enumeration capability. The compiler rejects every other
static, derived, old-field or nested-field projection over either family for this recall seam.
The sole allowed roster access is the exact IDN requirement; the sole episode access is this
requirement. ReadDomain membership alone never authorizes a path supplied by semantic code.

## Entry and exact preauthorized read

1. Identify exact recall registration and authenticate generated cue, source association and
   liveness. Validate complete payload/schema/roles. No extraction or state read precedes admission.
2. Instantiate the ordinary IDN subject requirement for cue.ObserverId. Missing binding fails as
   REQUIRED_PROJECTION_VALUE_ABSENT. Only the qualified detached C is available to the fixed
   projection constructor; roster/path/source wrappers remain infrastructure-side.
3. Extract the role-validated1124 identity E from the same admitted cue. No lookup resolves E.
4. Construct K=MeasurementEpisodeKey(C,E) using the exact canonical M3 record schema and field
   order. Validate K's roles and declared record-key grammar. Construct the full path P=(root,
   Episodes,mapKey:K); validate family, complete path and registered ReadDomain before reading.
5. Perform exactly one state read at P. No global337 index, fallback, second character or alternate
   path may be tried. If present, validate only M3's accepted local record/role/source-ID invariants.
   No nested ObserverId-to-roster lookup is performed on the returned episode.
6. Detach and cache the result in this admitted invocation's projection. Semantic recall receives
   only the immutable episode-or-absence result; no key-construction, state or payload resolver
   handle. Any repeated access returns the same snapshot and adds no read or write.

This produces exactly M3's address, with ownership established before even presence is exposed.
Changing C changes the full key. A record at (C_other,E) is not read, even if (C,E) is absent.
Role-valid keys and locally valid episode bytes do not prove historical legitimacy; the selected
state must already have passed M5 restore/history admission. Do not use local projection validation
to repair, authenticate or rewrite suspect history.

## Absence, trace and no-write boundary

IDN is required; episode presence is optional. An absent P yields the internal projection result
presence=false, with no value. A present P yields presence=true and an exact detached episode.
This follows existing StateRead presence semantics and creates no persistent presence record.
The eventual recall transition must emit no remembered content on absence; the exact transient
recollection schema/output closure is still a composed recall-contract obligation. No negative
measurement, fallback memory or guessed source is synthesized.

Projection trace records the existing IDN read and one ordinary exact episode read. For the episode
ActualReadRecord: accessor is the new committed OutputAccessor, path=P, presence/value are the
actual leaf result, derivedSources=[]; it is a direct leaf read, not a derived value. Key composition
uses the already recorded IDN projection, not another roster read or a fictional state path.
The committed requirement explains the dependency; infrastructure validation binds the path to
the actual C and cue E. No separate payload extraction read record is emitted. If this mapping
cannot be represented by the accepted trace grammar, M5 must surface the gap before allocation.

Recall has NoStateWrites and exact empty patch/diff. Reading never refreshes recency, strengthens
memory or changes counters. Formation ablation leaves a valid same cue but absent episode; recall
access ablation removes this read/result through a committed control model even if memory persists.
A withheld read must not be simulated by performing it and hiding the output. Exact control model
registration/output and matched scheduling closure remain M4a/M5 work, not ambient runtime flags.

## Adversarial obligations under frozen MEMR labels

- MEMR-D/K: forged/expired/wrong-registration cue fails before any state read; missing IDN fails
  before episode read; swapped SourceAccessor or field/path/role rejects at configuration/entry.
- MEMR-C/D/K: another character's episode with the same E cannot affect result or presence. For
  two observers bound to the same C, a mixed observer/E cue fails live-source association before
  projection; do not accept a post-read owner comparison as its replacement.
- MEMR-H: valid admitted cue and existing episode at exact K return byte-identical historical
  content, including51/10, without access to current observation,337 archive, trace or REG.
- MEMR-I/J: absent episode and ablated read produce no remembered measurement despite archive
  availability; recall-access ablation performs no episode read.
- MEMR-E/N: present, absent and repeated projection access have empty state diff. A changed
  key/value, extra read, global index, callback or additional accessor fails closure.
- MEMR-L: failure before/after read or output/trace validation rolls back the whole recall instant;
  restored admitted history yields the same exact path/result. Pending cue authentication remains
  an M4a/M5 prerequisite, not something supplied by memory contents.

No new canonical vector labels or passes. This proposed construction demonstrates address
expressibility on paper using the unchanged M3 key; review must accept M4b before that condition
is closed. M4a timing/cue authority, recall output/registration composition and M5 remain open.
No numbers, schemas or model packet are permanently allocated. MEMR-A..P NOT PASSED;
ADAPT-9b and Campaign2 OPEN.

## Acceptance disposition — 2026-09-07

User accepts bounded M4b and symbolically accessor/measurement-episode-read. M3 key condition
is satisfied: write/read use the same MeasurementEpisodeKey, now unconditionally shape accepted.
Earlier proposal/conditional language is historical. Episode ActualReadRecord has DerivedSources=[]
and TransformationId absent. M5 must prove its exact path equals the key built from recorded IDN C
and admitted cue E; no additional trace field or second roster lookup is needed.
First projection access performs the one episode read and caches it; later accesses return that
snapshot without additional reads. Cue authenticity must precede all projection access.
M4a is next; allocation remains deferred pending M4a and composed inventory. No runtime pass.
