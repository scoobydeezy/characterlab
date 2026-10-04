# Relapse experiment findings — 2026-09-26

LOCAL DISPOSITION. Counters1400/0. No new production model or mechanism.

The existing CONTROL witness already returned to target after one idle opportunity
under load and after explicit goal retirement. This new experiment lengthens actual
withholding to three consecutive opportunities and keeps the goal retained and
maintained during the load challenge. Return after retirement is separately labeled;
it is not the main lapse-against-goal witness. No physiological recovery is inferred
from goal-supported adjustment, and no generic Relapse state is introduced.

RELAPSE_TESTS_REV1.json passed all five scoped tests, including all seeds0..7.
Build and328 reference tests passed. The initial public harness then failed before
the first settlement with BELIEF_DATA_BYTES: it decoded committed bytes as Node
Buffer, whereas the accepted public boundary requires exact Uint8Array. The boundary
worked correctly. RELAPSE_HARNESS_FAILURE_REV1.json, RELAPSE_PLAN_REV1.json and
relapse-harness-rev1 preserve the rejection and original frozen artifacts.

The fix is solely Uint8Array.from on the harness's decoded initial state and ordered
inputs. RELAPSE_PLAN_REV2.json freezes corrected harness bytes before execution and
requires every model, source manifest, seed and RunIdentity to equal REV1. No
production contract, input value, law, test or factory was broadened. No scientific
run was discarded; the rejected wrapper never reached a settled instant.

All seeds are retained, including those which choose idle under the balanced
target/idle contest. Returning target is a sampled actual outcome, not inevitable
when inhibition is lost. Load restores candidate availability; it does not add a
habit-strength die, alter learned reward, supply a new motive or force a choice.
The goal stays maintained at the challenge, and removing load restores inhibition
at the next opportunity without erasing learned history.

Linear/Residual remain learning competitors. LoadBlind misses the load-dependent
inhibition failure; EraseHistory and NoHistory lose the acquired target. NoInhibition
can fail to express the preceding stable withholding pattern. RetainedEqualsMaintained
cannot express loss of active maintenance while a goal is retained. A wrong cue,
unseen training, denied card and contrary reward information retain their distinct
causal meanings. Hidden reward changes preserve the complete later observer view.

This is a finite transient lapse/return after instructed goal-supported behavioral
adjustment. It does not prove sustained resumed use, natural abstinence acquisition,
clinical relapse, physiological dependence, craving-driven action, learned inhibitory
skill or a universal resource law. Identity and physical adaptation are fixed here.
RO008/010/011/012/015/019/020 preserve wider integration, source, calibration and
recovery limits. RO021 historical reconciliation remains mandatory before exit.

Final public result:31 runs/279 prefixes PASS. Returned seeds1/7; nonreturn seeds
0/2/3/4/5/6 all retained. Linear also returns at7 for seed7, while retaining its
different learned strength. NoLoad withholds4..8 for every seed. These are finite
seed outcomes, not calibrated rates. See CAMPAIGN3_RELAPSE_QUALIFICATION.md.
