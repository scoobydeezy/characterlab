# VAL additive permanent allocation

**Status: PERMANENT AND FROZEN.**
Version: `val-allocation/0.1-candidate`, accepted 2026-09-06.

The allocation review conditionally accepted this table subject to machine-table/audit verification.
That gate passed on 2026-09-06; the assignments are now permanent under that authorization.
Consume the [VAL revision-2 shape acceptance](../planning/VAL_001_DRAFT_RESOLUTION.md),
`governed-execution/0.1-candidate`, `content-kind/0.1-candidate` and
`governed-domain-validator/0.1-candidate` unchanged. The frozen
[Campaign-2 allocation](CAMPAIGN2_PERMANENT_ALLOCATION.md) is not edited or renumbered.

## Records

Both records have schema version 1. All fields are required; no optional fields, variant tags,
union layouts, finite enums, runtime occurrences or persistent state roots are added.

| Type ID | Record | Schema version | Field ID | Field name | Field type | Required |
|---:|---|---:|---:|---|---|---|
| 329 | GovernedContentKindDefinition | 1 | 1 | ContentSchema | CanonicalRecordSchemaRef | true |
| 330 | SemanticKindRoleValidatorDefinition | 1 | 1 | RequiredSemanticKind | SemanticKindId | true |

329/330 append immediately after the accepted 260..328 block. ContentSchema reuses 254/1 and
must equal the external content schema reference 170/1 in this specialization. RequiredSemanticKind
uses namespace 1004 and must equal semantic-kind/character for the admitted character validator.
No RequiredNamespace field is added: CanonicalIdentityRole continues to own it.

RequiredSemanticKind's physical representation is existing TypedIdentifierValue. Its exact
namespace/member qualification is owned solely by the governed-domain-validator/0.1-candidate
construction interpreter: namespace 1004 and semantic-kind/character. A malformed declaration
fails INVALID_CONFIGURATION; no additive CanonicalRoleConstraint is introduced for this
definition field. Runtime CharacterId qualification remains PRJ/IDN-owned and uses
CANONICAL_ROLE_VIOLATION. ContentSchema is a schema dependency, not a new typed identity role.

## Registry-kind members

These are exact nonempty canonical NFC UTF-8 text payloads in existing RegistryKindId/1023.
They are permanent members, not fixture namespace promotion.

| Namespace | Member / exact payload |
|---:|---|
| 1023 | registry/semantic-kind |
| 1023 | registry/domain-validator |

## Governed entry bindings

Reuse SemanticRegistryEntry/171. StableIds below already exist; they are not new allocations.

| StableId namespace | StableId payload | RegistryKind payload in 1023 | DefinitionVersion | Definition schema |
|---:|---|---|---|---|
| 1004 | semantic-kind/character | registry/semantic-kind | content-kind/0.1-candidate | 329/1 |
| 1021 | validator/character-qualification | registry/domain-validator | governed-domain-validator/0.1-candidate | 330/1 |

Exactly one admitted content-kind definition resolves each used kind. This version admits only
character-kind content; unsupported kinds fail without callback fallback. Domain-validator
references and declarations must match exactly across the three accepted role-containing positions.
All interpreter behavior, failure ordering and version restrictions come from VAL's accepted shape.
These rows introduce no executable selector, function registry or additional identity mechanism.

## Audit and disposition

[Machine table](VAL_ALLOCATION_TABLE.json) and [mechanical audit](VAL_ALLOCATION_AUDIT.json)
cover both schemas/fields, both member payloads and both governed entry bindings in both directions.
Run `node scripts/audit-val-allocation.mjs --verify`; `--write` refreshes the audit. Verification
compares the stored audit with the recomputed result and its complete machine-table snapshot.
The audit checks the
frozen Campaign-2 table's complete byte hash, prior permanent record tables, existing identity
homes, uniqueness, prior permanent member absence, and exact Markdown/JSON parity. The review's
conditional acceptance plus this passed gate establishes permanent freeze. No renumbering or
reuse; future additions append. The frozen Campaign-2 table's complete bytes remain unchanged.

Next: authoritative factory design, implementation, VAL-A..W
and inherited mutants, and build/release qualification. VAL remains formally OPEN. Canonical
activation is NOT YET AUTHORIZED. VAL-T's positive second-kind branch remains conditional; no
second kind is allocated to make that control pass. The first real fixture's authored kind inventory
must be checked before activation. No implementation or runtime conformance is claimed here.
