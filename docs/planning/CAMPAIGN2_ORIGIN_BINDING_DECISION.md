# C2-ORIGIN-001 — missing governed referent-origin binding

**Status: SYMBOLIC SHAPE ACCEPTED; ALLOCATION PERMANENT AND FROZEN.** 2026-09-06.

## Accepted resolution

The review chooses alternative 2 and rejects promotion of fixture namespaces 20/21.
[referent-origin/0.1-candidate](../formal/REFERENT_ORIGIN.md) freezes exactly
AuthoredContentOriginId (complete typed content StableId) and RuntimeEntityOriginId (opaque
unsigned ordinal from the existing shared run allocator). Outer namespace 1002 and IDN's
authored-origin/exact-content/character-kind predicate are unchanged. No new record, registry,
resolver, provenance graph, or character identity is introduced.

The [permanent append-only allocation](../formal/ORIGIN_PERMANENT_ALLOCATION.md) freezes
1037/1122 after the review's conditional authorization and passed 43-check machine audit.
No second semantic review is required. Numeric adjacency has no semantic meaning; 1036 is SeamId.
ORIGIN-G2 strengthens the shared-allocator interleaving proof without allocating an occurrence rule.

The [implementation checkpoint](CAMPAIGN2_ORIGIN_IMPLEMENTATION.md) records origin codecs,
explicit migrated SEM constructors/fixtures, CharacterId qualification, and the first FCT-3 record-role
checks. Integrated activation remains pending. Historical PHEN-SEM evidence stays scoped to the
actual old corpus; migrated canonical bytes and historical identities are not claimed equivalent.
The following sections preserve the original discovery and earlier implementation checkpoint.

Implementation of the accepted character DomainValidator has reached a missing substrate binding.
IDN's predicate stays fixed: authored origin, resolve exactly one committed content definition,
then exact semantic-kind/character equality. Neither content membership alone nor payload spelling
can substitute for the origin check. Runtime-origin referents must fail character qualification
while remaining legal ExposureReferentIds where their family admits them.

## Evidence

| Source | Exact inspected finding |
|---|---|
| docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md, identifier payload rule and §137 paragraph | SemanticReferentId/1002 requires a nested governed authored-content or runtime-entity typed ID. It calls the inner namespaces already governed, but does not assign their numbers or payload grammars. |
| docs/formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md | Preserves the same nested typed-origin distinction. |
| docs/planning/IDN_001_DRAFT_RESOLUTION.md §2.1 | Qualification requires authored origin and committed content-kind equality; runtime origins are explicitly excluded. |
| src/test/semanticSchemaRegistry.test.ts, CV-SEM-094 | Uses typedIdentifier(20n,text('person/glen')) and typedIdentifier(21n,text('person/glen')); tests different encoded bytes. It neither registers those namespaces nor tests a production origin resolver. |
| src/semanticBinding/semanticEvidenceCodecs.ts, eventBindingValue | Currently constructs the outer SemanticReferentId using text(binding.semanticReferent.semanticReferentId), with no nested origin ID. Thus this existing path is not reusable as the accepted IDN origin resolver. |
| Frozen Campaign-2/VAL allocation companions and prior formal tables | The inspected permanent assignments do not identify an authored-content/runtime-entity pair of origin homes. SemanticKind/1004 and DomainValidator/1021 cannot serve as origin namespaces. |

The existing test result demonstrates namespace separation, not authority to classify namespace 20
as authored and 21 as runtime in canonical construction. Existing SEM proof remains recorded for
its tested corpus; this newly found binding inconsistency must be resolved explicitly, not hidden
inside a helper or used to relabel an accepted test as proof of a different predicate.

## Original decision surface (resolved symbolically above)

Freeze the exact two governed origin families, payload grammars and scope, plus the relation from
an authored-origin ID to GovernedContentDefinition.StableId. If runtime origins use the shared
allocator, freeze that use explicitly; do not infer it from the family name. Define rejection of
unknown inner namespaces and malformed nested payloads. The CharacterId predicate itself needs
no change. No ObserverId binding, recognition, CandidateDomain or state-presence input is allowed.

Two concrete alternatives:

1. **Explicitly formalize the test-origin homes 20/21.** This requires an accepted formal assignment
   and exact payload/scope rules. The test alone is insufficient authority, and its text payload
   examples do not settle runtime allocation semantics. No existing permanent number may be reused.
2. **Use a separately reviewed append-only origin allocation (recommended).** First freeze the two
   origin definitions and content resolution relation, then assign available permanent homes by the
   existing allocation discipline. Keep 20/21 only as historical test controls. Reuse the already
   accepted outer SemanticReferentId/1002 and GovernedContentDefinition/170; do not create a new
   character namespace, binding record, provenance graph or generic callback registry.

Either decision must say how affected SEM construction paths migrate to the required nested origin
representation. Silent reinterpretation of existing text payloads is not admitted. Existing model
identities and historical fixture bytes cannot be claimed equivalent to migrated bytes without an
explicit version/migration verdict. This is the material consequence that makes it a user/planning
decision rather than an implementation choice.

## Implemented while this decision was investigated

`src/campaign2/codecs.ts` integrates all 71 allocated record schemas (260..330), all 32 new tagged
union layouts, field/container/finite-value validation, typed new namespace payload helpers,
trusted-schema decode and detached canonical snapshots. This is a structural boundary, not complete
PRJ/IDN/REG/admission proof. Inherited record fields retain their existing codec-level grammar;
their owning seam/domain validators are still required before authoritative activation.

`src/campaign2/valDeclarations.ts` implements the closed 329/330 declaration interpretation,
exact referenced/declared validator coverage at all three role positions, and minimal character-kind
CONTENT construction against the same registry declarations. It does NOT expose a character role
qualification function or infer authored origin from content membership. The component's caller is
the future closed factory; this does not itself prove the complete registry matrix or activation path.

Existing six string occurrence IDs in two SEM test fixtures were migrated to bigint values to repair
the pre-existing TypeScript errors. This is test-data conformance to the existing occurrence contract,
not an origin allocation or change to production SEM semantics.

Validation: full source suite passes, 40 files / 325 tests; TypeScript --noEmit passes; reference import
boundary passes. New suites exercise all allocated schemas/union variants and the closed VAL
declaration/CONTENT negatives. These are incremental implementation results. VAL-A..W, PERSIST-A..I,
FCT-A..F and integrated seam gates are not declared globally passed. No authoritative factory or
activation was built. Reference source, frozen allocation and corpus bytes are unchanged.

## Implementation obligations after numeric acceptance

Implement exact origin decoding/content resolution, then complete CharacterId qualification and
PRJ/IDN/state compilation. Preserve accepted failure ownership: malformed validator declarations
are INVALID_CONFIGURATION; a well-formed role with an inadmissible referent fails
CANONICAL_ROLE_VIOLATION. Add origin-malformation, wrong-origin, missing-content, namespace collision
and same-local-payload cross-origin vectors before relying on the result canonically.
