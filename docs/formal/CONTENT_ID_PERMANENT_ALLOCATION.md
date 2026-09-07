# Content definition ID allocation

**Status: PERMANENT AND FROZEN.**
Version: `content-id-allocation/0.1-candidate`.

C2-CONTENT-ID-001 authorizes permanent freeze only after the separate machine gate.
Earlier allocation bytes remain unchanged. No fixture namespace is promoted.

## Namespaces

| Namespace | Family | Scope | Payload |
|---|---|---|---|
| 1038 | GovernedContentDefinitionId | model/content | nonempty canonical UTF-8 NFC text |

## Limits

No record, schema, member, binding, union, finite value, occurrence definition, state
root or save field is allocated. No runtime allocation. No global 170/1 role constraint.
Individual content keys are authored values, not registry members.
See CONTENT_DEFINITION_ID.md and CONTENT_ID_ALLOCATION_TABLE.json.
