# Attention component canonical-reference-order correction

2026-09-11. Correct-forward implementation correction under unchanged
`attention-selection-component/0.1-candidate`. No changed mathematics, record schema,
identity allocation, model commitment or corpus value.

The earlier component built its SEM evidence index in numeric binding-occurrence
order. SEM validates that index by canonical `characterEvidenceRefKey` ordering.
Across9→10 (or99→100), those orders differ. The new source-composition probe exposed
this valid-input rejection. Tests confined to10..12 had not discriminated it.

The component now sorts the derived index with SEM's actual reference-key comparator
before calling role derivation. The fixture builder does the same. A new regression
covers first binding IDs8,9,98,99,998,999; no ordinal becomes psychological magnitude.
Removing the production sort produces `INVALID_EVIDENCE_REFERENCE` at the new witness.

The old [qualification](ATTENTION_COMPONENT_QUALIFICATION_REV1.json) and source hashes
remain historical evidence, not current-source attestations. Current component evidence
is [12 passing tests](ATTENTION_COMPONENT_TESTS_REV3.json),
[five repeated current-source faults](ATTENTION_COMPONENT_MUTANTS_REV2.json), and
[the new order-removal fault](ATTENTION_REFERENCE_ORDER_MUTANT_REV1.json).
The existing full1,148-test result is retained. Replacing its11 component tests with
these12 yields1,149 current active tests in composed full-plus-targeted coverage;
it is not described as a fresh full run. The forward receipt verifies that composition
and records all current component fingerprints.

This is not public producer qualification. The three-port source remains a reviewed
symbolic proposal and component composition. AT2-A..N remain NOT PASSED.
