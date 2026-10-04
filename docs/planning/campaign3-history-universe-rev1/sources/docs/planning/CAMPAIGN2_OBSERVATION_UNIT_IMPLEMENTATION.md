# Observation unit implementation checkpoint

2026-09-06. Implements observation-unit-identity/0.1-candidate and the separately accepted,
permanent observation-unit-allocation/0.1-candidate. No semantic redesign.

`observationUnitId.ts` constructs/validates namespace 1039 with nonempty UTF-8 NFC text without
normalizing malformed input. Structurally valid other text is not a profile-admitted member.
`compileConsequenceBridge` requires complete typed-ID equality to unit/fixture-pulse.
`compileFirstCampaign2Bridge` additionally requires the compiled 201/5 CanonicalIdentityRole to
equal RequiredNamespace=1039 with no DomainValidator, then applies record roles before bridge
member admission. Neither function changes generic ObservationChannel schema/validation.

The internal component API is not the future public factory. Content/bridge declaration
co-commitment and fixed dispatch through that facade remain FCT-5 obligations.

## Executed controls

| Frozen control | Component result / evidence |
|---|---|
| OBS-UNIT-A | PASS: wrong namespace rejects; missing/wrong first-profile role rejects. |
| OBS-UNIT-B | PASS: empty, decomposed NFC, invalid UTF-8 surrogate and non-text payload reject. |
| OBS-UNIT-C | PASS: meters/dose/reward/anything-else/case/whitespace variants pass structural identity where appropriate but fail exact-member admission. The namespace role alone permits other text, as required. |
| OBS-UNIT-D | PASS: fixture 20/21 identities cannot substitute; generic OBS still restores them unchanged. |
| OBS-UNIT-E | PASS: 1005/1006/1029/1038 fail as units; a validator-bearing Character role cannot replace the namespace-only unit role. |
| OBS-UNIT-F | PASS: bridge captures decoded committed channel bytes; destroying caller bytes or varying source payload unit/count-shaped data cannot select the unit. Actual admitted count-pair runtime exercises the source boundary. |
| OBS-UNIT-G | PASS at commitment/component boundary: actual registry declaration change changes recomputed ModelIdentity; alternate member fails admission. Whole-factory declaration binding remains unqualified. |
| OBS-UNIT-H | PASS: actual 110→120..124→130→130→140 paired count control uses 1039 and compares observation/X/E/L bytes exactly; phase-120 channel retains the fixed unit. |
| OBS-UNIT-I | PASS for this component slice: no conversion operand or unit-to-REG path is introduced; changed source operands preserve fixed measurement bytes, inherited projection checks preserve fields 1..9, and existing REG/ADAPT exact-magnitude controls pass. General conversion semantics remain absent. |

Executable evidence: `src/test/observationUnitId.test.ts`, `campaign2AdaptationDomains.test.ts`,
`campaign2BridgeInspection.test.ts`, and inherited observation/REG suites. Final source suite: **49 files / 380 tests PASS**. TypeScript/Vite build and reference boundary:
**PASS**. Allocation audits: OBS unit 77, Campaign 2 60, VAL 40, origin 43, content ID 37 checks
**PASS**. This records executed component evidence, not an independent implementation comparison or a
whole-model qualification. Allocation acceptance by itself passed none of these controls.

## Preservation and remaining work

SUB-003 identity discipline is ported through the new accepted identity family; SUB-001 exact
measurement, SUB-008 occurrence/rollback and SUB-009 paired controls are preserved. Historical OBS
fixtures remain controls. SUB-011 corrections are appended to the prior checkpoint. No reference
mechanism is retired and no reference module is imported or modified.

The 77-check allocation audit pins all 15 prior frozen artifacts. No record/occurrence, allocator,
UnitDefinition, unit registry, DomainValidator, dimension, scaling/conversion, provenance graph,
REG field or state family is added. FCT-4 as a whole, FCT-5/6, VAL and PHEN-ADAPT remain unqualified.
Next binding work is the concrete RulesVersion / complete manifest / bounded profile package.
