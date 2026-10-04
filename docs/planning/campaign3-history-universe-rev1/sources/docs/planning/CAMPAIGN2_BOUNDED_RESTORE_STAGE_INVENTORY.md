# Bounded facade restore-stage inventory

2026-09-08. Source audit for `campaign2-persistence/0.1-candidate`; evidence mapping,
not whole PERSIST/FCT qualification. This covers `src/campaign2/factory.ts`.
The memory successor's prefix-replay restore has a separate admitted contract.

| Order | Actual operation | Evidence / boundary |
|---|---|---|
| 1 | Exact own-data inputs; copy save and ordered-input bytes | Factory override/accessor tests; QualificationClosure immediate byte mutation controls |
| 2 | Prepare receiving model; exact profile binding | ModelAdmissionParity exclusions; VAL-R failure before model/runtime publication |
| 3 | Decode SchedulerSave/132; restore RunIdentity | Factory malformed save/model controls |
| 4 | Conditional probe/carriage archive validation | Separate successor qualification; absent in original first-model branch |
| 5 | prepareCanonicalSave: decode, save version, model/run and embedded model equality | Substrate persistence checks; Factory receiving-model rejection |
| 6 | Parse saved clock; restore local candidate state; validate static invariants | Factory untouched-value rejection; state is unpublished |
| 7 | Derive and compare fields 8 then 9 | Metadata grammar negatives; state-scan and build-inventory substitutions |
| 8 | Parse allocators/queue; resolve event types; parse trace/outputs; validate continuation | Factory pending-source and allocator controls |
| 9 | Facade requires exact list([]) for fields 8, 9, 10 | Field 10 is checked separately here, not inferred from field 9 |
| 10 | Validate retained displacement against REG at saved clock | PersistenceDerivations and REG exact witnesses; observed pre-runtime rejection |
| 11 | Validate pending source correspondence against original input manifest | Factory missing/changed original input and pending-source controls |
| 12 | Restore original-input authority; compile evaluator | Reached only after preceding checks |
| 13 | Construct runtime; return restricted facade | Sole publication return; no public allocator/handler/injection interface |

The facade calls `prepareCanonicalSave`, not the substrate `loadCanonicalSave`
helper that also constructs a scheduler. Local candidate-state reconstruction is
not publication. Existing pre-runtime rejection observations cover scheduler
construction/execution reachable through this facade; original save invariance
is checked separately. This is a source-supported reachability argument, not
independent instrumentation of every internal stage or exhaustive malicious inputs.

PERSIST-D's state-scan alternative and FCT-D's separate build-inventory alternative
are now detected independently at save and restore. Neither passes PERSIST-I.
PERSIST-B/F model-owned REG and retained-state evidence is present in
`campaign2PersistenceDerivations.test.ts` and `campaign2RegExactWitnesses.test.ts`.
PERSIST-C/G metadata failure stages are mapped above. PERSIST-H has finite
exact-byte comparisons and targeted alternatives, not an independent general
persistence implementation. These mappings supersede the corresponding outstanding
evidence descriptions in the historical factory inventory without erasing it.

Still required: complete admitted execution-closure mapping for PERSIST-A/D/E,
branch/mutant coverage review, finite-corpus limits, and remaining inherited VAL/FCT
gate reconciliation. No whole qualification verdict follows from this table.
PERSIST-I remains governed by the [accepted scope addendum](CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md).

Validation: four focused fresh-source files / 16 tests PASS; TypeScript PASS;
build-dependence baseline plus two substitutions PASS; corpus promotion audit and
150 prior plus 17 frozen packet fingerprints PASS. The earlier 936-test run
retains its explicit fresh-source plus historical scope.
