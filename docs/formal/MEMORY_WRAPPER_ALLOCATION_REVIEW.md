# Memory wrapper allocation review

**Status: PERMANENT AND FROZEN.**

Version: memory-wrapper-allocation/0.1-candidate. Three wrapper shapes and whole packaging accepted; numeric allocation accepted and frozen on 2026-09-08. Materialization and runtime have not begun.

## Exact records and fields

| RecordTypeId | SchemaVersion | Name | Required fields (FieldId name:type) |
|---|---|---|---|
| 356 | 1 | MemoryV04TransitionSeamContract | 1 Registration:272/1; 2 FieldRequirements:set<266/1>; 3 FieldPathRequirements:set<343/1>; 4 EpisodeReadRequirements:set<349/1> |
| 357 | 1 | MemoryFormationTransitionSeamContract | 1 Registration:347/1; 2 FieldPathRequirements:set<343/1> |
| 358 | 1 | MemoryRecallTransitionSeamContract | 1 Registration:353/1; 2 FieldRequirements:set<266/1>; 3 EpisodeReadRequirements:set<349/1> |

Embedded schema versions are exact; every field is required. Canonical set fields are homogeneous. No generic value, optional collection, union or static-binding field is admitted. Empty sets remain required values.

## Allocation boundary

Three RecordTypeIds, nine local FieldIds. Zero namespaces, text members, occurrence rules, identity roles, union variants or finite tags. Every field is record/set-valued; nested roles remain in the existing records. No wrapper ID or projection-set ID. No registration or requirement schema is amended.

Permanent assignments append after355. Frozen measurement-memory-allocation/0.1-candidate and all historical packets are fingerprinted without modification. Permanently, no renumbering, reuse or insertion-by-shifting is allowed. No numeric adjacency implies a semantic relation.

## Accepted use

Under campaign2-measurement-memory-registry/0.1-candidate: M1 and F=false use356; F=true uses357; both recall cases use358. The accepted row/version matrix determines inner registration semantics. Inherited rows remain bare; opportunity350 remains bare. The wrapper is171.Definition, not an additional registry row. StaticBindings is profile-fixed empty with all external injection prohibited under MEM-PACK-F.

Slot0 will contain17 new descriptors (14 memory +3 wrappers); slots1–5 retain the accepted delta with exactly14 memory role additions and zero wrapper role additions. Existing topology version, sparse map-entry authority, signed RecallDelay=1,41-entry bundle and16 configuration design are unchanged.

MEM-PACK-A..G and MEMR-A..P remain FROZEN/NOT PASSED. This audit can establish allocation consistency only. Model materialization follows numeric freeze; runtime remains gated. ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN.
