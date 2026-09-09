# Memory TransitionSeamContract serialization — shape draft revision 1

2026-09-08. **SHAPE ACCEPTED. Append-only allocation review authorized next.**

C2-MEM-PACK-001 is CLOSED. The three schemas and exact row/version matrix below are accepted; historical proposal wording is superseded by this disposition. Whole packaging revision2 is accepted in shape. Numeric assignments are not frozen by shape acceptance; materialization follows wrapper allocation freeze.

Under campaign2-measurement-memory-registry/0.1-candidate, every memory wrapper has StaticBindings exactly empty. No caller argument, compiler default table, external projection map or factory injection may supply one. A future static binding requires a new accepted packaging grammar/profile.

C2-MEM-PACK-001 replaces the rejected anonymous list envelope with three exact canonical wrapper records. The [packaging revision 2](CAMPAIGN2_MEASUREMENT_MEMORY_PACKAGING.md) retains the accepted model/control, delay, trace and persistence directions. The frozen memory allocation342–355 is unchanged. Names below are proposed exact canonical names; schema version1, all fields required in the displayed order. RecordTypeIds and permanent FieldIds await the separate allocation gate after shape acceptance.

## Exact schemas

| Proposed record | Required fields in schema order |
|---|---|
| MemoryV04TransitionSeamContract | Registration: exact272/1; FieldRequirements: set<266/1>; FieldPathRequirements: set<343/1>; EpisodeReadRequirements: set<349/1> |
| MemoryFormationTransitionSeamContract | Registration: exact347/1; FieldPathRequirements: set<343/1> |
| MemoryRecallTransitionSeamContract | Registration: exact353/1; FieldRequirements: set<266/1>; EpisodeReadRequirements: set<349/1> |

No field has generic CanonicalValue, bytes, callback, arbitrary registration, heterogeneous requirement set, optional branch or tagged union type. Empty collections are explicit canonical sets, never missing fields. Every embedded record has the exact schema version above. Extra fields, wrong schemas, wrong collection kinds and duplicate canonical elements reject. No static-binding field exists in this bounded profile: static bindings are empty and cannot be supplied by a separate factory argument.

No new occurrence namespace, identity role, text member, registry kind, StableId, projection-set ID, wrapper ID, semantic-bundle entry, or capability is proposed. Wrapper fields are record/set-valued; all nested existing identity roles remain authoritative. Neither272,347,353 nor266,343,349 changes.

## Exact row and version matrix

Selected solely by campaign2-measurement-memory-registry/0.1-candidate. Every row retains registry/transition-registration and its existing TransitionKind StableId. Definition is the wrapper record, never an anonymous list.

| StableId | DefinitionVersion | Exact Definition schema |
|---|---|---|
| MeasurementEpisodeEvidenceTransition | transition-admission/0.4-candidate | MemoryV04TransitionSeamContract |
| MemoryFormationTransition, F=false | transition-admission/0.4-candidate | MemoryV04TransitionSeamContract |
| MemoryFormationTransition, F=true | measurement-memory-formation-registration/0.1-candidate | MemoryFormationTransitionSeamContract |
| MeasurementRecallTransition, either R | measurement-recall-registration/0.1-candidate | MemoryRecallTransitionSeamContract |

RegistrySchemaVersion selects this closed outer schema matrix; DefinitionVersion selects the inner registration grammar. The Registration's ExecutingSeamId/Version identifies the existing executing contract. There is no duplicate owner tuple in the wrapper. F/R are inferred from exact validated registration and collection contents, never a second boolean authority. M1 and ordinary formation/recall use measurement-episodic-memory/0.1-candidate; formation and recall ablations retain their distinct accepted executing versions.

Inherited transition entries retain their historical bare definitions and versions. Old registry profile plus wrapper rejects; successor plus bare memory registration rejects; wrapped inherited row rejects; wrong wrapper for row/version rejects. No detection-and-fallback path is admitted. The opportunity entry remains bare350. A single registered TransitionKind/event cannot select multiple wrappers within one model.

## Exact owned collections

| Case | FieldRequirements | FieldPathRequirements | EpisodeReadRequirements |
|---|---|---|---|
| M1 | empty | empty | empty |
| Formation F=false | empty | singleton exact343 | empty |
| Formation F=true | no such field | singleton exact343 | no such field |
| Recall R=true | singleton exact266 | no such field | singleton exact349 |
| Recall R=false | singleton exact266 | no such field | empty |

An absent schema field is not an optional collection and cannot be added. Exact343 uses source path[2,2,2], roster268/1/MapKey(*), projected267/1, qualified CharacterId role, and ResolvedCharacterSubject. Exact266 uses cue351 field1 and that same accepted roster projection. Exact349 uses SubjectAccessor=ResolvedCharacterSubject, cue field2,346/1/MapKey(*), and accessor/measurement-episode-read. These are the already accepted requirements, not new projection semantics.

Canonical ordering is checked separately for each set. OutputAccessor must be unique across all collections and static bindings (empty here). Requirement identity stays (ExecutingSeamId,ExecutingSeamVersion,OutputAccessor). The stored collections are the sole source: no defaults, synthesized omitted requirement, global map, external binding table or cross-wrapper lookup.

349's SubjectAccessor must resolve to exactly one same-contract266 ResolvedCharacterSubject requirement. Cross-contract substitution, orphan dependencies, alternate roster access, cycles, extra accessors and mismatched ReadDomain reject. The compiler must validate the exact row-specific cardinalities and contents above, not merely structural element types. This preserves preauthorization before the episode read; declaration order cannot grant early episode access.

## Canonical commitment and validation boundary

The complete wrapper participates in the existing chain:171.Definition → slot0 → RegistryManifest commitment → ModelIdentity. No detached hash or identity joins the sets to the registration. VAL/schema/role traversal visits Registration and every typed collection; the wrapper cannot exempt its nested data from governed validation. Compile only from these committed bytes.

Set permutation yields the same canonical bytes. A changed canonical requirement produces changed registry/model commitment preimages; no field may be dropped during materialization. For the exact bounded model, an unadmitted changed requirement is rejected by the compiler even though the generic commitment machinery can hash it. Thus commitment sensitivity controls do not authorize additional models or relax exact requirement validation. Runtime capabilities are still constructed only after complete model admission.

## Packaging delta and preserved decisions

After separate allocation, slot0 gains17 descriptors: existing14 memory schemas plus these3 wrapper schemas. The three memory transition entries use the exact wrappers above; opportunity350 stays bare. Slots1–5 preserve the accepted direction. Slot2 owns exactly346/1/MapKey(*), not the monolithic Episodes map. All inherited packet bytes stay unchanged.

RecallDelay is accepted signed SimDuration(1). T2=checkedAddDuration(T1,1); Int64.MaxValue yields INSTANT_OVERFLOW and complete producing-instant rollback on both semantic and private branches. It remains model data. Preserve the16 a/p/F/R configurations and true/true/true/true reference specimen, exact41-entry bundle, trace and prefix-validation persistence semantics, and original-input profile reuse. No wrapper-specific semantic version is appended to the bundle.

## Frozen packaging controls — NOT PASSED

These are planning labels, not new permanent canonical vector IDs.

| Control | Required result |
|---|---|
| MEM-PACK-A | Wrong wrapper schema/version/field count, omitted required field, extra field, wrong record or collection type, and anonymous list reject. |
| MEM-PACK-B | Bare memory registration under the successor rejects; wrapper under an old profile rejects. |
| MEM-PACK-C | Wrapped inherited EVID/ADAPT transition rejects; wrong wrapper for memory row/version rejects. |
| MEM-PACK-D | Changing canonical requirement bytes changes registry/model commitment preimages; no requirement field is ignored. Unadmitted variants still reject at model compilation. |
| MEM-PACK-E | Permuting set construction order preserves canonical commitments; duplicates reject rather than disappear. |
| MEM-PACK-F | Omission/addition, duplicate accessor across collections, orphan/cross-contract dependency, any nonempty or externally injected static binding, or alternate roster access rejects. |
| MEM-PACK-G | Holding inner registration bytes constant while changing a collection changes commitment preimages; exact-profile admission remains independently enforced. |

Positive materialization must additionally prove all row/case mappings, explicit empty sets, exact role traversal, immutable342–355 and parent artifacts,17-descriptor delta, exact map-entry ownership,16 distinct admitted ModelIdentities, and ordered-input reuse. The bounded singleton/empty collections cannot supply a nontrivial valid intra-set permutation witness; exercise canonical set permutation at the substrate layer and report its scope separately from the exact-profile positive case.

## Gates

The three wrappers and closed matrix are shape accepted. Perform separate append-only packaging allocation with availability audit and numeric review. Numbers suggested in the incoming review are not allocated here. Materialization remains blocked until wrapper allocation freeze. Runtime implementation remains blocked; MEMR-A..P and MEM-PACK-A..G are FROZEN/NOT PASSED. ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN.
