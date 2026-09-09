# VAL qualification reconciliation after bounded persistence acceptance

2026-09-08. Evidence inventory, **not whole VAL or factory qualification**.
PERSIST-A..H now PASS in the bounded no-RNG first profile under the accepted
[persistence review](CAMPAIGN2_BOUNDED_PERSISTENCE_QUALIFICATION_REVIEW.md).
PERSIST-I remains RETAINED / DEFERRED / NOT PASSED. Historical factory matrices
retain their original checkpoint wording; the current evidence below supplements them.

## Executed additions

`src/test/campaign2ContentBoundaryClosure.test.ts` adds four controls:

| Obligation | Executed evidence | Scope limit |
|---|---|---|
| VAL-M | Missing registry reference, missing content reference and self-cycle, each under ordinary versus override-demanding committed invariant text, through both prepare and restore: 12 negative calls. Exact ContentValidationError plus expected cause; no runtime construction; original save unchanged. | Committed text is data, not an executable validator. Detached caller-registry controls remain in existing VAL/content evidence. |
| VAL-W | Unsupported content kind through both public admission surfaces: exact ContentValidationError and no runtime fallback. | No second kind is admitted. Callback-interface rejection is separately established by QualificationClosure's real legacy negative control. |
| VAL-W | Empty generic content with no kind definition admits; nonempty generic character content without a governed definition raises ContentValidationError. | Generic component control, not permission for empty content in the frozen one-character profile. |
| VAL-E | Two generic authored characters under reversed content and registry enumeration retain exact compiled canonical content bytes and both qualification results. | Generic component scope. No claim that the frozen first profile admits a multi-character model or that all compiled APIs were compared. |

No production semantics, model or allocation changes were required. These tests consume
the existing content/VAL contracts and do not interpret invariant prose as instructions.

Validation: TypeScript PASS; four focused fresh-source files / 18 tests PASS,
including the existing 572-case finite CONTENT comparison; corpus promotion audit
PASS; `git diff --check` passes. No historical test count is reused for this run.

## Remaining evidence review by group

- A/B/F/H/R/S: QualificationClosure now supplies the opposite legacy callback pair,
  four public boundary challenges, presentation invariance, immediate byte-copy controls,
  content-only identity counterpart and post-VAL/pre-activation content failure observation.
  Whole gate disposition still requires composing these with the original challenge text.
- E/M/W: the additions above fill the explicitly missing multi-character permutation,
  invariant-text override and exact content-error observations. Existing duplicate StableId
  and missing/cyclic/detached-reference controls remain separate evidence.
- D/G/N/O/U: existing independent comparisons and targeted dependency, PRJ, state,
  REG, ADAPT and persistence substitutions remain finite. Need a current crosswalk of
  admitted semantic branches to each actual intervention; do not infer arbitrary host
  independence or a general independent compiler from the finite reports.
- I/J/V: descriptor omission/version controls cover 175 descriptors at both public
  admission surfaces (700 calls). They do not replace role-containing position closure,
  wrong namespace/kind/carrier, unknown field or failure-precedence evidence. Reconcile
  the declaration corpus and existing all-three-position tests against the exact gates.
- K/L/Q: minimal type-170 content, authored-origin qualification and finite independent
  content/role comparisons already exist. Preserve their generic/frozen-profile distinction
  and shared codec/setup limits when proposing any verdict.
- P: exact separate-process continuation and unsupported version/model rejection remain
  evidence. The newly accepted bounded persistence verdict does not alone pass whole VAL-P.
- T: current negative RequiredSemanticKind control remains applicable. The positive
  second-admitted-kind control is conditional on a future accepted kind/binding; do not
  manufacture one or count unsupported content as a positive identity witness.

This reconciliation introduces no new semantic decision. Remaining work is evidence
composition and any concrete adversarial gaps it reveals. The reference trace, paired
control and correct-forward disciplines remain preserved. Decision/dice and identity
ports remain later accepted-contract work; Campaign 2 is OPEN.

## 2026-09-08 — VAL reconciliation accepted

CAMPAIGN2_VAL_CLOSURE_RECONCILIATION and new evidence ACCEPTED.
VAL-E PASS in generic canonical-content permutation scope; VAL-M PASS;
VAL-W PASS in current character-only CONTENT scope. Whole VAL/FCT remain OPEN.
VAL-T second-kind positive remains CONDITIONAL / DEFERRED / NOT PASSED and is
not a current-profile blocker; do not invent a second kind for qualification.
The definitive next evidence map is CAMPAIGN2_VAL_A_W_QUALIFICATION_CROSSWALK.md
in docs/planning, with separate admitted-branch/mutant and declaration-position
matrices. Proposed statuses there are not accepted verdicts.
PERSIST-A..H PASS bounded no-RNG; PERSIST-I DEFERRED / NOT PASSED.
PHEN-ADAPT PASS unchanged; production semantics unchanged; Campaign 2 OPEN.
