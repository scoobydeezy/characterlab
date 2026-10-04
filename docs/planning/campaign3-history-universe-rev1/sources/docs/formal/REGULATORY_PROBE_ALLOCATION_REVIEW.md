# Regulatory diagnostic probe — numeric/member allocation review

**Status: PERMANENT AND FROZEN.**
Version: `regulatory-probe-allocation/0.1-candidate`.

Shape authority: [accepted probe](REGULATORY_DIAGNOSTIC_PROBE.md). The user accepted the numeric,
member and role choices subject to the governed-union check. That check now passes: exactly three
type-259 entries, namespace-1024 identities [335,1..3], and exact required/forbidden sets are explicit
in the machine table and this document. Allocation is frozen under that conditional ruling on
2026-09-07. The original table had layout rows only; the correction adds their governed registry
entry representation without changing numbers or semantics. No prior allocation is edited.

## Records and fields

| RecordTypeId | Name | SchemaVersion |
|---|---|---|
| 331 | RegulatoryProbeDefinition | 1 |
| 332 | DiagnosticProbeChannel | 1 |
| 333 | RegulatoryProbeOpportunity | 1 |
| 334 | RegulatoryProbeTruth | 1 |
| 335 | RegulatoryProbeCarrier | 1 |

| RecordTypeId | FieldId | Name | Type | Required structurally |
|---|---|---|---|---|
| 331 | 1 | CharacterId | CharacterId | true |
| 331 | 2 | RegulatoryVariableId | RegulatoryVariableId | true |
| 331 | 3 | Channel | DiagnosticProbeChannel | true |
| 331 | 4 | Available | Boolean | true |
| 331 | 5 | ObserverPermitted | Boolean | true |
| 332 | 1 | ObservationChannelId | ObservationChannelId | true |
| 332 | 2 | ObserverId | ObserverId | true |
| 332 | 3 | SubjectId | CharacterId | true |
| 332 | 4 | ModalityId | ModalityId | true |
| 332 | 5 | UnitId | ObservationUnitId | true |
| 333 | 1 | ProbeDefinitionId | RegistryDefinitionId | true |
| 334 | 1 | RegulatoryProbeTruthId | RegulatoryProbeTruthId | true |
| 334 | 2 | ProbeDefinitionId | RegistryDefinitionId | true |
| 334 | 3 | OccurredAt | SignedSimInstant | true |
| 334 | 4 | EffectiveValue | SignedInteger | true |
| 335 | 1 | VariantTag | UnsignedInteger | true |
| 335 | 2 | Truth | RegulatoryProbeTruth | false |
| 335 | 3 | ProbeDefinitionId | RegistryDefinitionId | false |
| 335 | 4 | Support | SupportingObservationId | false |

## Runtime family

| Namespace | Name | Payload |
|---|---|---|
| 1123 | RegulatoryProbeTruthId | unsigned-runtime-ordinal |

Run-scoped, allocated only by the existing shared allocator. Record 334 field 1 is its sole occurrence identity. No padding identity, namespace or occurrence exists.

## Existing-family permanent members

| Namespace | Exact NFC text payload |
|---|---|
| 1027 | definition/regulatory-diagnostic-probe |
| 1023 | registry/regulatory-diagnostic-probe |
| 1001 | event/regulatory-diagnostic-probe |
| 1001 | event/regulatory-diagnostic-probe-observation |
| 1001 | event/regulatory-diagnostic-probe-tracking |
| 1001 | event/regulatory-diagnostic-probe-binding |
| 1001 | event/regulatory-diagnostic-probe-classification |
| 1001 | event/regulatory-diagnostic-probe-freeze |
| 1001 | event/regulatory-diagnostic-probe-evaluation-padding |
| 1001 | event/regulatory-diagnostic-probe-evidence-padding |
| 1036 | seam/regulatory-diagnostic-probe |
| 1039 | unit/diagnostic-regulatory-level |

## Closed carrier tags

| RecordTypeId | Tag | Variant | Required FieldIds | Forbidden FieldIds |
|---|---|---|---|---|
| 335 | 1 | Suppressed | 1 | 2,3,4 |
| 335 | 2 | Observing | 1,2,3 | 4 |
| 335 | 3 | Supporting | 1,4 | 2,3 |

Tag is field 1 canonical unsigned. Unknown tags/fields reject. No presence-bit fields are added. Observing field 3 equals nested Truth.ProbeDefinitionId; Supporting is admitted only after the actual observation. These are profile/compiler invariants, not a new generic equality mechanism.

### Governed UnionVariantDefinition entries

The three layouts above are authoritative through existing record 259, schema version 1,
not private codec tag conventions. The machine table's `unionVariantEntries` gives the exact
canonical-value construction operands for each RegistryEntry/171: StableId is namespace 1024
with canonical list of two unsigned integers, RegistryKind is namespace 1023 with exact text
`registry/union-variant-definition`, and DefinitionVersion is `union-variant/1`.

| StableId namespace | StableId unsigned-list payload | Definition type | Field 1 unsigned RecordTypeId | Field 2 unsigned VariantTag | Field 3 unsigned set RequiredPayloadFieldIds | Field 4 unsigned set ForbiddenPayloadFieldIds |
|---|---|---|---|---|---|---|
| 1024 | [335,1] | 259/1 | 335 | 1 | {1} | {2,3,4} |
| 1024 | [335,2] | 259/1 | 335 | 2 | {1,2,3} | {4} |
| 1024 | [335,3] | 259/1 | 335 | 3 | {1,4} | {2,3} |

Exactly these three entries must be committed in the new registry manifest and covered by its
digest. The future profile compiler validates the exact inventory; carrier codec behavior derives
from those admitted definitions. Missing/extra tags or changed field sets under the same profile
reject. Prior union entries remain byte-identical. No new namespace, registry kind, tag mechanism,
or typed role for record-valued Support/216 is introduced. This allocation table is a descriptor,
not materialized registry bytes; canonical encoding belongs to the subsequent model packaging gate.

## Profile-owned identity roles

| RecordTypeId | FieldId | RequiredNamespace | DomainValidatorId |
|---|---|---|---|
| 331 | 1 | 1002 | validator/character-qualification |
| 331 | 2 | 1029 | absent |
| 332 | 1 | 1005 | absent |
| 332 | 2 | 1000 | absent |
| 332 | 3 | 1002 | validator/character-qualification |
| 332 | 4 | 1006 | absent |
| 332 | 5 | 1039 | absent |
| 333 | 1 | 1027 | absent |
| 334 | 1 | 1123 | absent |
| 334 | 2 | 1027 | absent |
| 335 | 3 | 1027 | absent |

Roles use existing CanonicalIdentityRole machinery; nested records retain their own roles. Channel.SubjectId equals definition.CharacterId. Unit exact-member admission belongs to the diagnostic profile, not a DomainValidator. Generic 201 and the old singleton profile remain unchanged. Character qualification uses the existing validator, not a new identity family.

## Reuse and exclusions

Reuse 203/204 observation, 216 support, 227 X, 269 E, 270 L and existing ObserverId, CharacterId, REG variable, channel, modality, definition, observation, Experience and E/L identity families. Existing event/outcome-evaluation and event/outcome-learning-evidence are not allocated again. Modality/channel values remain concrete model vocabulary.

The only new namespace is 1123; 331..335 append after 330. Local field/tag numbering follows the accepted listed order. No renumbering, reuse, insertion-by-shifting, fixture promotion, generic observation amendment, state root, save field or public allocator API. Future identity families append. No unit registry, response law or scalar carriage is implied.

## Review gates

Machine table and mechanical audit accompany this document. Preserved-source hashes cover prior allocation artifacts and canonical registries. Audit PASS establishes allocation consistency only. PROBE-A..P remain FROZEN, NOT PASSED; new profile packaging, RulesVersion/ModelIdentity and implementation await their gates.

The final audit passes 240 checks. RecordTypes 331..335, namespace 1123, all twelve listed text
members, field/role assignments and the three governed variants are permanent. No renumbering or
reuse. Model/profile packaging is next; allocation consistency does not qualify a runtime control.
