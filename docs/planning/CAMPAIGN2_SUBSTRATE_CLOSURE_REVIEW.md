# Campaign-2 substrate qualification reconciliation

Current update: the proposed scope ruling below was subsequently accepted in the
[PERSIST-I addendum](CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md). Its targeted build-dependence
assay is complete. The [restore-stage inventory](CAMPAIGN2_BOUNDED_RESTORE_STAGE_INVENTORY.md)
continues the reconciliation. The original proposal below is retained as review history.

2026-09-08. Component evidence and one proposed scope ruling; **not a whole-factory release verdict**.

## Governing scope

The accepted PHEN-ADAPT promotion remains current: fixture `1.11.0`, corpus
`corpus/0.27.0`, digest
`3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`.
The reviewed draft and corpus 0.26 commitments remain separate historical artifacts.
No behavior, runtime, model, allocation or frozen packet changes belong to this pass.

The [factory evidence map](CAMPAIGN2_FACTORY_GATE_MATRIX.md) and
[inherited crosswalk](CAMPAIGN2_INHERITED_VECTOR_CROSSWALK.md) remain historical inventories.
Their unqualified rows do not erase later accepted probe, carriage, memory, FCT-C or
PHEN-ADAPT scope-specific verdicts. Conversely those verdicts do not pass VAL-A..W,
PERSIST-A..I or all factory controls. The first-profile facade and memory successor
have different admitted persistence machinery; memory prefix replay must not be
evaluated as if it were the original facade's pre-construction restore path.

## New executable evidence

| Obligation | Evidence added | Exact scope |
|---|---|---|
| VAL-A/B/S | `src/test/campaign2QualificationClosure.test.ts` | Actual retained legacy builder accepts one same-ID predicate and rejects its opposite. Both predicate objects reject at prepare, restore-source, create-input and restore-input surfaces, across five override field names, with no callback invocation. |
| VAL-C | Same test file | Admitted content-only lifecycle operand changes ContentIdentity while the other ModelIdentity components stay fixed. Existing registry Step-change behavioral witness remains separate; no lifecycle behavior is invented. |
| VAL-F | Same test file | Opposed presentation labels preserve exact canonical content, ModelIdentity and complete empty-run save bytes. |
| VAL-H | Same test file | Mutating all three source byte arrays immediately after prepare/restore calls and all create/restore input byte arrays does not change results. This supplements existing returned-byte isolation tests. |
| VAL-R | Same test file | Structurally valid cyclic content fails after the VAL declaration compiler is reached, at prepare and restore, before ModelIdentity creation or runtime construction. |
| REG-Q | `src/test/campaign2RegulatoryReference.test.ts` | Two qualifying characters share one variable's single parameter successfully. Two variable owners reject both byte-equal and byte-unequal parameters with the ownership error. Generic accepted REG/VAL scope; no bounded profile widening. |
| PERSIST-D/H, FCT-D | [State-scan proof](CAMPAIGN2_METADATA_STATE_SCAN_PROOF.json) | Populated admitted displacement state contains character/variable identities but still yields exact empty fields 8/9/10 and exact restore. Independent save and restore all-state-ID scan substitutions are both detected. |

The metadata assay compares four finite obligations against literal empty metadata and
exact round-trip bytes. Its scanner recursively visits actual canonical authoritative
state, including map keys and nested identities. It is not an invented nonempty sentinel.
Transforms run in isolated modules; production files are fingerprinted and unchanged.
This is not an independent persistence implementation or PERSIST-I evidence.

Validation: TypeScript `npx tsc --noEmit` passes. The Vitest API run with
`config:false`, filter `src/test`, `minWorkers:1`, `maxWorkers:2` and 60-second test
timeout passed **132 files / 936 tests**. The substring filter also matched
`reference/src/test`; this total includes historical controls and is not a claim
of 936 fresh-source tests. No historical source was modified. An initial runner
attempt with only `maxWorkers:2` failed before tests because default minimum workers
conflicted; setting the minimum explicitly resolved the runner configuration.
The four-case metadata baseline and both isolated scanner mutants pass their
assay. The promotion audit and 150 prior plus 17 frozen packet fingerprints pass.

Retained failed assay: the first VAL-R attempt omitted required content field 10. It
failed at structural decoding before the VAL compiler and therefore did not establish
the requested stage. The cyclic-content replacement explicitly observes that stage.
This was an insufficient test, not a production defect or semantic redesign.

## Remaining qualification work

New evidence addresses specific outstanding cells; it does not turn the whole historical
matrix green. Exact schema/version and inherited PRJ/OBS/SEM/EVID crosswalk completeness,
restore-stage inventory, admitted branch and mutant inventory, and finite-corpus limits
still require reconciliation and review. No additional independent compiler is claimed.
Previously accepted PHEN-ADAPT and memory controls need no redesign or additional
behavioral proof merely to reconcile this inventory.

Reference mechanisms remain preserved: SUB-008 trace evidence, SUB-009 paired controls
and SUB-011 correct-forward history. Decision/dice and identity mechanisms remain later
formal-port obligations; this pass neither implements nor retires them.

## PERSIST-I: explicit scope decision needed

The accepted [persistence contract](CAMPAIGN2_PERSISTENCE_CLARIFICATION.md) requires:

> A build supports an additional accepted RNG-consuming seam absent from the committed model

and separately prohibits inventing a stochastic seam for this control. Active source has
`RandomRunOracle.drawBounded` in `src/substrate/random.ts`; Campaign-2 imports only the
algorithm version and codec schemas. There is no active production call to `drawBounded`
or accepted implemented character RNG consumer. The decision/dice port is still unresolved
in the seam ledger. The random primitive is not itself that missing consumer.

Consequently an empty field 9 and rejected unsupported registry declaration prove the
bounded no-consumer behavior, but cannot honestly satisfy PERSIST-I's full positive
build-support intervention. A fabricated plugin, callback, historical implementation
import or new stochastic transition would evade the frozen obligation.

**Proposed ruling, awaiting user review:** retain PERSIST-I's future positive obligation
for the first separately accepted RNG-consuming seam. Permit current bounded-profile
qualification to be reviewed with that obligation explicitly deferred and with existing
no-consumer/exclusion evidence plus a targeted build-dependence substitution. Do not
mark whole PERSIST-I PASS, and do not infer VAL/factory activation from the ruling alone.
This would alter qualification sequencing/scope, not persistence mathematics or model
admission. The targeted build-dependence assay is still to be executed after the ruling;
the state-ID scan above does not substitute for it.

Alternative: keep the literal whole PERSIST-I gate blocking final substrate qualification
until the separately accepted stochastic consumer exists. Other finite qualification
work remains useful under either ruling. No new stochastic seam is proposed in this pass.

## 2026-09-08 — accepted PERSIST-I scope ruling

PERSIST-I is FROZEN / RETAINED / DEFERRED / NOT PASSED. Its original positive
obligation is preserved. Current bounded no-RNG qualification may continue;
whole PERSIST-A..I, VAL and factory qualification are not inferred. The trigger
is the first separately accepted AND production-supported RNG-consuming seam;
execute PERSIST-I before claiming complete persistence qualification of that build.
An RNG-admitting model requires its own separately accepted persistence extension.
See docs/planning/CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md for the accepted ruling
and CAMPAIGN2_BUILD_METADATA_PROOF.json for the bounded build-inventory control:
baseline exact-byte invariance and both save/restore substitutions detected.
This evidence is not the future positive witness. No fabricated consumer,
primitive-as-consumer substitution, runtime/model/allocation change or blanket
activation is authorized. PHEN-ADAPT PASS is unchanged; Campaign 2 remains OPEN.
