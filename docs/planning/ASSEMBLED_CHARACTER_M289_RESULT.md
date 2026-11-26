# M289 — deliberate control and the habit/expectation overlap
Status: PASS for the declared control/domain gate; Family12.9 remains open. Reference0.166; baseline33e9e762.
Initial plan38e48a40; preimplementation correction f0ed57a2.
[Checks](ASSEMBLED_CHARACTER_M289_CHECKS.txt); [evidence](ASSEMBLED_CHARACTER_M289_EVIDENCE.json).
The current character suppresses a learned action under instruction and restores
its eligibility after withdrawal, keeping its acquired history. Independent habit
contribution remains unresolved under the current reward rule.

## Pre-run correction and the actual limitation
The initial proposed equal-mean comparison used observed gain1. Source review,
before code or native runs, found rewardSense floors observations to multiples of10.
Gain1 would be observed as0. The proposal is retained in Git; it was not executed,
silently relabelled a pass or rescued by reducing the sensor precision.

In this declared domain, a positive performed-action observation is at least10.
The same admitted observation enters the action's nonnegative expectation history,
whose complete sample count is at most16. Therefore any positive history implies
mean >= roundEven(10/16) =1. Residual history above its1/2 admission threshold
requires at least one positive observation. Consequently its admission condition
is already satisfied by positive MeanHistory in reachable states of this domain.
Information-only zeros cannot remove that implication within the current capacity.

The executable check uses production rewardSense/informedExpectation/cueStrength:
gain1 is floored0;136 minimum-positive cases cover every sample count1..16 and
positive position, retaining exact mean/strength; an all-zero16 history folds0.
This is a domain implication with a monotone lower-bound argument, not exhaustive
enumeration of every possible history or a universal habit reduction. Precision1,
other laws, signed reward, changing valuation and future longer histories are
outside the implication. No psychological law or production code is changed.

## Native comparison
M288's social task and normal stand-in evidence1..3; body10/rate0; seed0.
Four actual A practices4..7 yield habit15/16. Permitted panel information8 reports
A0/B1000, giving mean A800/B1000. Both routes are known available at probes9..11.
Feedback learning is withheld on probes, keeping the acquired histories fixed.
Workspace6 is common apparatus; control is enabled in the existing declaration.
Normal physiological samples8..11 are explicit: recovery after8, awake9..11,
all axes permitted, zero bias/exposure and control load0. No learned S0.

Four cases cross visible cue true/false with no control versus control.
The false cue removes habit activation but not the stored history/mean.
Control receives an ordinary adopt instruction9, maintains with reminder10 and
withdraws11. Live readiness, spare workspace, source goal and maintained state are
checked before asserting actual candidate removal and subsequent execution.
B is a real competing option backed by perceived information, not an authored choice.

| Native case | A probability at9 /10 /11 | Activated habit | Result |
|---|---|---|---|
| free | 1/2,1/2,1/2 | 15/16 | Both options live; B executes |
| other-cue | 1/2,1/2,1/2 | 0 | Same full resolutions as free |
| controlled | 0,0,1/2 | 15/16 | A removed9/10; withdrawal releases11 |
| controlled-other-cue | 0,0,1/2 | 0 | Same full resolutions as controlled |

All four share registry, initial state and acquired histories. Control reads the
actual owned goal/maintenance state; readiness is Known/allowed with spare1 while
maintained, spare2 otherwise. The live pre-filter candidate set includes A and B;
inhibition removes A9/10 and leaves B with probability1. Every selected action
executes with an Applied effect. History and reward estimates remain unchanged.

All observed seed0 actions were B. The demonstrated behavioral effect is an exact
native probability change, not a changed sampled winner or shared-dice claim.
Cross-cue full resolution bytes match within each control condition.
Controlled save8 restores exactly through every subsequent settlement and natural
completion; an independent full run repeats prefix8 and terminal save hashes.
The domain test passes136 minimum-positive cases and the all-zero control.

Original M118/M288 controls remain untouched. This witness tests control of a
learned action, not independent habit necessity, extinction, dependence, craving,
or relapse after physiological adaptation.

## Acceptance impact
Family12.9 stays open. Its current reference habit admission adds no option beyond
positive expectation in the stated precision10/capacity16 domain. This is a concrete
limitation to resolve, not a reason to declare the habit owner unnecessary or add
an Addicted trait. M118 remains historical0.89 evidence; its latest-Boolean
expectation contrast cannot silently qualify current MeanHistory receiving.
The next step must address this overlap explicitly before adding broader12.9 layers.

Ledger HABIT/CONTROL, original alternative laws and RO-C3-015 (with related
008/010/011/012/019/020 conditional scope) retain their dispositions. No Campaign3
verdict is changed. No UI/Campaign4, reduction, new runtime or whole-family claim.

## Concrete next decision (no reference change made)
The existing LatestHistory alternative can represent current estimate0 while retaining
a positive habit, unlike MeanHistory in this domain. It is not a free replacement:
preserved M227 controls show these first-probe outcomes after zero correction.

| History | MeanHistory | LatestHistory |
|---|---|---|
| Concentrated | A admitted/executed, estimate4/5 | A still admitted from habit, estimate0, no reason/action |
| Diversified | Both admitted, estimates2/3, probabilities1/2 | Both admitted from habit, estimates0, no reason/action |
| Different cue | Both admitted from positive means | Neither admitted, estimates0 and inactive habit |

Those original control results are in ASSEMBLED_CHARACTER_M227_EVIDENCE.json,
primary.*.controls; no new runs or rewritten source. They expose both the restored
conceptual distinction and the substitution consequences. A next bounded decision
must compare this existing alternative with the adopted L5 policy and name affected
12.2/12.9 replays before any versioned change. Do not lower precision, enlarge the
sample cap or invent reward thresholds solely to obtain a habit-only pass.

## Verification and preservation
PASS: types;136 domain cases/all-zero;four native cases;controlled continuation;
independent repeat;reference boundary;research obligations;archived evidence hashes.
Five new lossless save blocks verify byte length/hash (27,953,046 decoded bytes).
Source hashes and full comparison outcomes are retained in the evidence file.
Two new test/fixture files;no production/formal or frozen-control dependency changes.
Three artifacts total about1.46MB, below20 files/5MiB. No executed test failed;
the gain1 proposal was corrected before execution and remains in the committed plan.
Research counts remain0 active/18 conditional/4 closed/0 unowned;103 C3 verdict
headings are the checker's scoped count, not the full historical109 baseline.
No family clause disposition or denominator changes: E88/P21/N10/U13=132;
21 members/15 families;9 version-scoped accepted families. Final replay open.
Git-size PASS. Measured verification 857.549s plus30s packaging allowance
= 887.549s /1800s; longest command 265.850s /600s. No extension.
