# Observation unit identity allocation

**Status: PERMANENT AND FROZEN.**
Version: `observation-unit-allocation/0.1-candidate`.

C2-OBS-UNIT-001 numeric review ACCEPT AND FREEZE, 2026-09-06. This is the one-to-one
realization of observation-unit-identity/0.1-candidate, without semantic redesign.
1039 and the exact member payload are permanent: no renumbering, reuse or insertion by shifting.
Future identity families append. Numeric adjacency carries no semantic meaning.
Implementation may proceed; allocation acceptance passes no runtime control.

## Namespaces

| Namespace | Family | Scope | Payload |
|---|---|---|---|
| 1039 | ObservationUnitId | model/observation vocabulary | nonempty canonical UTF-8 NFC text |

## Fixed members

| Namespace | Family | Member | Payload | Admitting owner |
|---|---|---|---|---|
| 1039 | ObservationUnitId | unit/fixture-pulse | unit/fixture-pulse | first Campaign-2 bridge profile |

1039 is the next unused model/vocabulary namespace after the frozen content definition namespace
1038. Run occurrence namespaces are separate and unchanged. One symbolic family maps to one
numeric family; its one member is a fixed contract constant, not open authored vocabulary.

## Limits and audit

No record, schema, registry binding, union, finite enum, occurrence definition, state root, save
field, validator or runtime allocator is added. No UnitDefinitionId, UnitConversionId or DimensionId.
No existing typed-ID family is repurposed and no fixture namespace is promoted.

The first-profile CanonicalIdentityRole checks namespace only; the bridge compiler checks the exact
member. Generic observation/0.1 remains polymorphic; REG remains unitless. This table grants no
conversion or cross-channel comparison.

OBSERVATION_UNIT_ALLOCATION_TABLE.json is the matching machine representation. Its preservedSources
pins the prior allocation tables, Markdown and stored audits plus inherited registry authorities.
Run `node scripts/audit-observation-unit-allocation.mjs --verify` to check exact parity, symbolic
coverage, namespace availability and preservation. Audit PASS is mechanical, not numeric acceptance,
OBS-UNIT-A..I qualification or first-model activation.
