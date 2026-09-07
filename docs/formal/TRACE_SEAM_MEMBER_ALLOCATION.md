# Campaign-2 trace seam member allocation

**Status: PERMANENT AND FROZEN.**
Version: `trace-seam-member-allocation/0.1-candidate`.

C2-TRACE-001 revision 2 is WHOLE MAPPING SHAPE ACCEPTED. This packet realizes its two
symbolically frozen members within the permanently allocated SeamId/1036 family.
This is an additive companion to CAMPAIGN2_ALLOCATION_TABLE.json; the original frozen
table, Markdown, audit and all prior allocations retain their exact bytes.

## Existing family (no allocation)

SeamId/1036 is owned by the trace/transition substrate with nonempty canonical UTF-8 NFC
text payloads. Its namespace and grammar are unchanged. No new namespace is allocated.

## Additive members

| Namespace | Family | Member | Payload | Accepted use | SeamVersion |
|---|---|---|---|---|---|
| 1036 | SeamId | seam/authored-adaptation-fact-source | seam/authored-adaptation-fact-source | event/authored-adaptation-fact at phase 110 | adaptation-input/0.31-candidate |
| 1036 | SeamId | seam/authored-fact-observation | seam/authored-fact-observation | event/fixture-consequence-observation at phase 120 | authored-fact-observation/0.1-candidate |

Each symbolic member maps to exactly one typed member with the identical text payload;
each additive member maps back to its accepted handler row. No local ordinal is assigned.
Existing members are not renamed, reused, replaced or shifted. No fixture ID is promoted.
RecordKind remains the exact EventTypeId/1001; TransitionKind/1009 is not recast.

## Audit and remaining gates

TRACE_SEAM_MEMBER_ALLOCATION_TABLE.json is the exact machine companion. The audit checks
bidirectional symbolic/member/use coverage, Markdown parity, existing family ownership,
no prior member collision, no extra numeric surface and byte preservation of prior
allocations and the frozen first-model review packet.

Run `node scripts/audit-trace-seam-member-allocation.mjs --verify`.
Acceptance freezes exactly these two members. Mechanical PASS passes no TRACE-C2-A..N runtime control.

No new record, schema, registry, union, state root, save field, occurrence or allocator.
No trace wrappers yet. The trace-profile and new RulesVersion meanings are accepted; replacement ModelIdentity
must still be materialized, reviewed and frozen before implementation.
The old model and its saves are not silently upgraded.
