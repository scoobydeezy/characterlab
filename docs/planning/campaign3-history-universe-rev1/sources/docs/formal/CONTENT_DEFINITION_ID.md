# Governed content definition identity

**Status: SYMBOLIC SHAPE ACCEPTED.** 2026-09-06.
Contract: `content-definition-id/0.1-candidate`. Acceptance: C2-CONTENT-ID-001.

Add one CONTENT-owned identity family admitted for the first Campaign-2 producer's
uses of the existing 170/1 StableId position.

| Symbolic family | Scope | Payload grammar |
|---|---|---|
| GovernedContentDefinitionId | model/content | nonempty canonical UTF-8 NFC text |

Values are authored/model-defined, immutable, and never runtime allocated. Equality
is exact canonical typed-ID equality, with no aliasing, case folding or display-name
equivalence. Same text in RegistryDefinitionId, ProcedureId or a fixture namespace
is a different identity. Individual values are not permanent registry members.

The first Campaign-2 content-profile interpreter MUST require this family for its
authored character definitions. Failure is model/content construction failure, not
a PRJ runtime role check. No CanonicalRoleConstraint is added to 170/1 field 1.
Generic GovernedContentDefinition.StableId remains TypedIdentifierValue; no other
CONTENT profile is universally restricted to this family.

AuthoredContentOriginId contains the exact complete StableId, without text extraction
or family-specific resolution. No additional field, binding, resolver, registry,
provenance, record, state root, save field or allocator is introduced.
referent-origin/0.1-candidate, content/0.2-candidate, content-kind/0.1-candidate,
governed-domain-validator/0.1-candidate and the CharacterId predicate remain unchanged.

## Frozen controls

Symbolic acceptance does not pass these controls.

| Control | Obligation |
|---|---|
| CONTENT-ID-A | Nonempty canonical NFC text grammar |
| CONTENT-ID-B | Same text under another namespace is unequal |
| CONTENT-ID-C | Duplicate complete StableId rejects content |
| CONTENT-ID-D | Authored origin round-trips the complete exact StableId |
| CONTENT-ID-E | StableId change changes ContentIdentity and resulting ModelIdentity |
| CONTENT-ID-F | No runtime allocation path |
| CONTENT-ID-G | Runtime-origin CharacterId exclusion unchanged |
| CONTENT-ID-H | Fixture namespaces 20 and 23000 fail the first-profile rule |

## Preservation and allocation

REFERENCE_MECHANISM_LEDGER SUB-003: continue the accepted typed-identity discipline
through this new family; do not port a historical registry or psychological mechanism.
SUB-011: retain historical fixture results for their actual bytes. Allocation is a
separate mechanical gate in CONTENT_ID_ALLOCATION_TABLE.json and its audit. Numeric
adjacency has no semantics. Factory activation remains gated by FCT/VAL/profile work.
