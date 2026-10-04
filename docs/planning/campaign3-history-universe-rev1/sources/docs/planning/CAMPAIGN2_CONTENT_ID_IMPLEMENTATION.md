# Campaign-2 content identity and construction checkpoint

2026-09-06. C2-CONTENT-ID-001 is resolved by the accepted review. Implements
`content-definition-id/0.1-candidate` over `content-id-allocation/0.1-candidate`.

## Acceptance and allocation

The pending `0.1-draft` allocation passed the separate 37-check machine gate before
promotion to permanent/frozen `0.1-candidate`. Namespace 1038 is GovernedContentDefinitionId,
model/content scope, nonempty canonical UTF-8 NFC text, authored and never runtime allocated.
All pinned Campaign-2, VAL, origin and inherited allocation bytes remain unchanged.
No record, field, member, registry, resolver, binding, provenance or save structure was added.

Generic 170/1 StableId remains TypedIdentifierValue. Only the first Campaign-2 content-profile
interpreter requires the accepted family for its character definitions. No PRJ role constraint
was added to the generic StableId slot. Origin and CharacterId qualification semantics are fixed.

## Implementation and controls

- `src/substrate/contentDefinitionId.ts`: explicit pure constructor and family validator.
- `src/campaign2/contentProfile.ts`: data-only internal first-profile compilation boundary;
  profile failure is content construction failure. Uses existing generic CONTENT and VAL.
- Campaign-2 and SEM origin traversal recognize the new family grammar without restricting
  other legitimate authored StableId families.
- `src/test/contentDefinitionId.test.ts`: six tests covering CONTENT-ID-A..H. F additionally
  requires source capability inspection: the constructor imports no allocator and takes only
  authored text. These are component proofs, not factory qualification.

## Continued authorized construction

`src/campaign2/regulatoryReference.ts` implements the eleven construction passes in
`regulatory-reference/0.5-candidate`: exact content-derived character coverage, required role,
local parameter resolution, no unused parameters, bound equality, disjoint parameter ownership,
authored anchor/rate normal forms and full SimInstant endpoint totality. It calls accepted TIME
materialization without a state reader, provider callback, cache, re-anchoring or new identity.
Six tests cover negative-rate floor, distinct variable/TIME scales, signed displacement bounds,
construction mutants, typed failure order and time-only invalidity. This does not pass the full
REG-A..R/integrated ADAPT corpus or independent implementation comparison.

`identityRoles.ts`, `occurrenceIdentity.ts` and `transitionAdmissionV04.ts` implement shared
PRJ role compatibility, required top-level occurrence-field lookup, V04 registry construction,
producer/schema/phase consistency, declared route closure and exact required output cardinality.
Four component tests include terminal outputs, missing/duplicate/wrong schemas and invalid roles.
Runtime producer authentication, fresh allocation and ingress are NOT established by these tests.
No occurrence rule for RuntimeEntityOriginId is introduced. New flat scheduler failure vocabulary
preserves the existing diagnostic schema; no runtime admission handler is activated here.

## Validation and remaining gates

The full source suite passed at 44 files / 351 tests after content-ID and REG changes.
The four additional V04 construction tests subsequently passed with TypeScript checking.
Current source inventory: 355 tests. Allocation audits: Campaign-2 60, VAL 40, origin 43,
content-ID 37 checks PASS. Later validation results are appended below.

FCT-3 still needs full V06/ADAPT model compilation and dynamic PRJ construction. Runtime admission
must authenticate actual producer output and generated-child context before selector extraction;
the new V04 constructor does not authorize passing raw payloads to a subject projector.
Then FCT-4 fixed adapters and settlement, concrete RulesVersion/bundle/profile binding before
FCT-5, create/restore facade and FCT-6 independent integrated qualification remain required.
No authoritative factory activation, whole Campaign-2 PASS, or new psychological mechanism is claimed.

Final checkpoint validation: full source suite 45 files / 355 tests PASS; production build
(TypeScript plus Vite) PASS; reference boundary PASS. No reference source was changed.
