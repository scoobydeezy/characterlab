# Referent-origin permanent append-only allocation

**Status: PERMANENT AND FROZEN.**
Version: `origin-allocation/0.1-candidate`. Prepared 2026-09-06.

Consumes the accepted symbolic [referent-origin/0.1-candidate](REFERENT_ORIGIN.md).
The numeric review conditionally accepted these assignments subject to the mechanical audit.
That gate passed on 2026-09-06; permanent freeze follows that authorization. Pending proposals use origin-allocation/0.1-draft; this frozen artifact is
origin-allocation/0.1-candidate.
Frozen Campaign-2 and VAL allocations remain byte-identical.

## Namespaces

| Namespace | Identity family | Scope | Payload |
|---:|---|---|---|
| 1037 | AuthoredContentOriginId | model/content | canonical TypedIdentifierValue equal to content StableId |
| 1122 | RuntimeEntityOriginId | run | unsigned runtime ordinal from shared allocator |

1037 is the next available append-only typed-identity namespace after the frozen Campaign-2
shared/model allocation range. Numeric adjacency carries no semantic meaning.
1122 is the next available append-only run-scoped typed-identity namespace after 1121.
Its adjacency to occurrence namespaces carries no semantic meaning.
The latter is an entity identity, not a new transition occurrence definition. Both are nested
under existing outer SemanticReferentId/CandidateSemanticReferentId namespace 1002. No numbers
are shifted or reused. Namespaces 20/21 remain historical fixture controls only.

The authored StableId payload retains its complete typed identity; this allocation does not
allocate a new content StableId family or impose a text-name lookup. Runtime ordinals use the
accepted shared allocator and its continuation; no independent counter is allocated.

## Empty additive surfaces

No records, fields, schemas, registry entries or kinds, stable members, union variants, finite
values, occurrence definitions, state roots, or save fields are added. The two origin families
are fixed substrate semantics, not entries in a model-selectable origin registry.

## Mechanical review

[Machine table](ORIGIN_ALLOCATION_TABLE.json) and [audit](ORIGIN_ALLOCATION_AUDIT.json) record
exact symbolic/number/payload parity, collision checks against earlier permanent tables, and
SHA-256 preservation of both frozen allocation tables and prior registry sources.
Run `node scripts/audit-origin-allocation.mjs --verify`; `--write` refreshes the audit.
The report includes the complete proposal snapshot. Passing it establishes mechanical consistency
only. The conditional numeric verdict plus this passed gate establishes permanent freeze;
it does not pass ORIGIN-A..I or ORIGIN-G2 runtime proof.

After permanent freeze: correct nested SEM
construction, complete the CharacterId DomainValidator, execute origin and affected SEM
regressions, then continue FCT-3. Existing factory activation gates remain in force.
