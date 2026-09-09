# Campaign2 AD-E10 reference validation review

Date: 2026-09-09. Status: evidence submitted; AD-E10 OPEN pending review.

## Governing obligation

AD-E10 under `adaptation-input/0.31-candidate` requires valid REG candidates to
succeed, preservation of C's exact failure mappings, rejection of retained time-only
invalidity before an E repair rule, and separation of REG reference from stored
operands or learned baselines. This packet consumes `regulatory-reference/0.5-candidate`
and `adaptation-settlement/0.2-candidate`. It adds tests and evidence only.

SUB-001/002 exact arithmetic and SUB-008 trace/atomicity remain PORT, with SUB-009
controlled comparisons. No reference mechanism is copied or retired. The existing
TIME authored-anchor/remainder contract is consumed without re-anchoring or a new
learning/reference mechanism. No frozen profile, allocation or source semantics change.

## Executed evidence

`src/test/campaign2RegExactWitnesses.test.ts` now contains eight tests: two new AD-E10
tests and six existing REG/AC-H witnesses, all executed against current source.

| Clause | Concrete witness |
|---|---|
| Upper legal candidate | Static R0=80, reference bounds[0,100], retained D=19, count1, Step1: public phase140 stores D=20 and validates R0+D=100 |
| Upper invalid candidate | Same model, retained D=20: proposed21 fails ADAPTATION_REFERENCE_OUT_OF_RANGE |
| Lower legal candidate | Separately committed displacement Step=-1, retained D=-79: public phase140 stores D=-80 and validates R0+D=0 |
| Lower invalid candidate | Same negative-step model, retained D=-80: proposed-81 fails ADAPTATION_REFERENCE_OUT_OF_RANGE |
| Component exact mapping | Real compiled domains.validateMagnitude accepts-80/20 and rejects-81/21 with ADAPTATION_REFERENCE_OUT_OF_RANGE |
| Unknown-variable mapping | Well-shaped displacement key with undeclared typed variable: real validateMagnitude and validateReferences both emit ADAPTATION_REFERENCE_UNKNOWN_VARIABLE |
| Earlier public exclusion | createCampaign2Run rejects that same unknown-domain state at static validation; it is not an admitted runtime payload |
| Pre-repair invalidity | Existing AC-H: dynamic R0=80 until INT64_MAX-1, R0=81 at INT64_MAX; retained D=20 with committed Step=-1 repairs to19 just before boundary, but at boundary fails before transition ingress |
| Retained/restore behavior | Existing REG-O verifies state/clock/queue/allocators/outputs/trace rollback and rejects invalid saved-time state before runtime construction |
| Reference remains authored | Existing REG-P queries the actual prepared provider repeatedly before/after D=0→1, preserving save/snapshot and authored anchor80 at0; REG-J preserves exact authored anchors/remainders across query order; REG-I/L preserves dynamic restore and independent D histories |

The two public endpoint models keep all four regulatory rules, with only the
displacement Step changed for the lower pair. Other leaf candidates remain valid.
Tests assert stored displacement exactly, four resulting state entries, unchanged
registry bytes and R0 still80. Invalid candidates assert exact code and unchanged
public state/output/trace/clock. These observations supplement the explicit provider
and persistence controls; they do not equate the learned D with R0+D.

The unknown-variable witness invokes the **actual compiled domain component** from
the bounded declarations, with the real REG provider and state-path validator. No
provider callback is substituted. Public static validation correctly rejects an
unknown domain before the runtime translation branch. The component mapping and
public exclusion are separate evidence scopes; this packet does not weaken admission
to force a later failure, and does not claim an unknown variable ran publicly.

The AC-H negative captures the real runtime's snapshot while executing the public
run. It requires beginTransitionIngressV04 to remain uncalled, terminal Failed,
and unchanged state/clock/queue/allocators/outputs/committedTrace. The positive under
the same committed repair model proves the rule can actually decrement D. The failure
therefore cannot be explained by a nonfunctional repair rule. This is one named
rollback witness, not AD-E12's complete fault-stage qualification.

## Current-source mutation evidence

`scripts/prove-campaign2-reference-settlement.mjs` records
`CAMPAIGN2_REFERENCE_SETTLEMENT_PROOF.json`:

- Eight-test baseline PASS.
- Remove beforeInstant reference validation while retaining subsequent validation:
  DETECTED by the named AC-H pre-repair witness.
- Map REG_UNKNOWN_VARIABLE to ADAPTATION_REFERENCE_OUT_OF_RANGE in both translation
  sites: DETECTED by the named domain-component mapping witness.

Transformation counts are checked (one early-hook anchor; two explicit translation
sites), the required witness must fail, and unhandled errors are excluded. Source/test
fingerprints remain unchanged across the assay. No mutant is written to source.
TypeScript checking PASS. Existing source-sensitive reports remain historical unless
explicitly refreshed; this packet makes no blanket refresh claim.

## Requested disposition

Accept AD-E10 for the finite public endpoint/pre-repair/provider matrix and the real
component error-mapping plus earlier-public-exclusion scope. AD-E10 remains OPEN
until review. No new reference semantics, model profile or allocation is requested.
AD-E3/4/8/9/13 PASS; AD-E7/11/12, whole B and FCT remain OPEN. VAL QUALIFIED,
bounded no-RNG PERSIST-A..H PASS, conditional/deferred PERSIST-I and PHEN-ADAPT PASS
remain unchanged. Campaign2 remains OPEN.

## Accepted disposition received 2026-09-09

AD-E10 PASS in the finite public endpoint/pre-repair/authored-reference and real
component-mapping scopes. This receipt supersedes the pending disposition above.
Unknown-variable mapping plus earlier public exclusion is accepted. R0 remains
authored model reference, D retained adaptation state, and R0+D a validation result;
none becomes a new REG anchor or learned baseline. Both mutants are adequate; no
additional AD-E10-specific mutant is required. AD-E12 and whole B/FCT remain OPEN.
