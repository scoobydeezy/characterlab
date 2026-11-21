# M208 — sleep and intoxication receiving boundaries
The character has experienced-fatigue control, but it does not yet generate sleep
debt or an intoxicant trajectory. This review maps the two missing experiments
before implementation. It adds no behavior and accepts no additional clause.
The next connection is sleep physiology through permitted perception to inhibition.

Base08470f45; plan51988b37. Character rules/registry remain0.135-candidate.
[Checks](ASSEMBLED_CHARACTER_M208_CHECKS.txt). Zero production/test/formal changes.
Sources: accepted [sleep-control0.1](../formal/SLEEP_CONTROL_EXPERIMENT_CONTRACT.md)
and [intoxication-control0.1](../formal/INTOXICATION_CONTROL_EXPERIMENT_CONTRACT.md);
their frozen *_CONTROL_PLAN_REV1.json, *_RESULT_REV1.json and RUN_0..19 receipts;
src/test/{sleepControl,intoxicationControl}Fixtures.ts and their tests,
sleepControlAnalysis.ts (shared diagnostic extractor); biological dynamics,
integration and choice contracts; assembled body/control/fatigue/skill paths.
The historical experiments use identity-public/0.1 Biological/Threshold, not an
assembled factory. All original identities, histories, controls and failures remain.

## Complete original comparison map
| Experiment | Runs and original model count | Selected prefix obligation |
|---|---|---|
| Sleep | Full Rested/Deprived/Recovered, each seed0..3 (12); BlindRested/BlindDeprived/FalseRested/FailedExecution/Unmaintained, Full seed0 (5); NoControl main triplet seed0 (3). Total20, two models. | Main Full seed0 triplet S0/S2/S7/S8/S9/S12 (18); other17 S0/S12 (34). Total52:32 advancing/20 terminal. |
| Intoxication | Full Sober/Slow/Fast, each seed0..3 (12); BlindSober/BlindSlow/FalseSober/Interference, Full seed0 (4); HighCompetence Full seed1 (1); NoControl main triplet seed0 (3). Total20, five models. | Main Full seed0 triplet S0/S2/S7/S8/S10/S11/S12 (21); other17 S0/S12 (34). Total55:35 advancing/20 terminal. |

Those are40 retained original runs/107 selected prefixes, not new gates or native
assembled coverage. Original whole Save132/next-save checks retain their exact
scope; no all-prefix claim. No seed search or removal of unchanged sampled choices.

Both experiments use12 instants and two offered actions from the original catalog.
Practice1 supplies actual reward600 and one permitted learned outcome. Action key
drug has no intoxicant/injury: the intoxication experiment's exposure is external.
Common load800 at2 permits a genuine protective contest (importance600), rather
than automatic inhibition. Only expression2 can qualify protective identity.
From3, load0; no further learned-outcome receipts or identity updates. Original
nonzero identity and learned history stay byte-identical within seed. Do not replace
that prelude with authored belief/identity or an empty identity journal.

Sleep: accumulation100/recovery1000/nightDrive0, zero fuel/water drain and adaptation
gains; competence850, inhibition threshold800, sensor resolution10. All sleep at
consequence2. Rested then sleeps every consequence; Deprived stays awake; Recovered
sleeps from consequence8. At8, sensed sleep100 versus600 gives control950 versus700.
Recovery after choice8 first affects choice9: control950 restores inhibition.
Probes8/9/12 retain drug/withhold before inhibition; intervening frames offer withhold.
Seed0's same sampled choice is not a failure: the required analytical probability
change remains. Blind pair denies sleepiness from3: unequal truth, equal safe stream,
unavailable current control. FalseRested uses biased sleepiness0 despite deprivation.
Unmaintained withdraws support from8: recovery does not restore a lost maintained
goal. FailedExecution changes external success, not intent/control; its whole-safe
equality is the specific seed0 inert-withholding case. NoControl removes inhibition,
not sleep kinetics, sensing, prior identity or learned outcomes.

Intoxication: initial burden0; clearance100 versus400 is the only constitution
difference. External800 after execution7 gives burden700/400 at8. Sleep accumulation,
night drive and drains0; stress0/arousal500; no injury/adaptation gains. Competence300,
threshold800. Slow probes8..12 have burden700/600/500/400/300, motor challenge
350/300/250/200/150 and control650/700/750/800/850. Strict motor success recovers10;
inclusive inhibition recovers11. Burden300 at12 is not complete clearance.
HighCompetence850 seed1 preserves first exposed appraisal/intent but changes actual
execution; later admitted reward can legitimately diverge. Interference blocks sober
execution; whole-safe equality again relies on that inert-withholding control.
Blind pair masks intoxication AND reward/pleasure/withdrawalReward from3: an intoxication-
only mask cannot hide later reward consequences. FalseSober's biased intoxication0
can preserve inhibition while physical execution fails. NoControl retains physics.

## Receiving decisions and unresolved correspondences
| Existing path | Disposition before implementation |
|---|---|
| body.ts root455/1 reserve,455/2 regulatory stress; BODY_OWNER | Extend this owner with declared sleep/exposure kinetics. Do not copy a full BiologyState with second reserve/stress owners. Original elapsed kinetics precede current sensing; consequence sleep/exposure follows choice/execution. Do not double-step or apply recovery retroactively. |
| Current biological readiness | Original capacity=clamp(1000-roundEven((sleepiness+stress+intoxication+abs(arousal-500))/2)-load). Every operand must be currently admitted; any missing operand makes capacity unavailable. Implement through safe perception and traced reads; physical truth must not enter cognitive handlers. |
| control.ts/controlExecution.ts; workspace0..32, maintained goal, spare slot, candidate filter | Keep actual occupancy/maintenance and biological readiness distinguishable. Original load0..1000 is not a workspace-slot count. Exact resource correspondence and combined condition require a versioned receiving contract before code; neither arithmetic conversion nor an extra independent capacity is approved here. |
| fatigue.ts root1351/1, FATIGUE_OWNER; M55 SevereThreshold | Retained grade2 experience can impair later inhibition; missing reports retain prior experience. Preserve that historical mechanism. Do not manufacture grade2 from sleep debt or call retained fatigue equivalent to current unknown biological readiness. |
| skillExecution.ts root785, shared learned competence | Current success is engaged AND K*(1-I)>=difficulty. Original BIO requires physical challenge<competence. K=.3,I=0,difficulty=.3 succeeds under SKILL; BIO challenge300/competence300 fails. Simple rescaling is not equivalence. |
| effect execution and external opportunity/obstruction | Preserve distinct intent, procedural assessment, physical success and perceived outcome. No hidden competence store, alternate runtime, automatic intent rewrite, +epsilon difficulty patch or global >= to > replacement. |

R3 Full biology remains an engineering reference default, not a superiority finding.
The strict motor boundary is an unresolved receiving correspondence, not permission
to select a new law. Different operations need not collapse into one operation.
Before intoxication implementation, determine whether a distinct physical check can
compose without double counting or conflicting competence authority. If the same
operation truly requires incompatible laws, report the exact conflict for ruling;
self-approval of fixture/representation amendments cannot settle psychological authority.

## Next bounded implementation, not another audit
Next package: at most three capabilities/12 production-test files, one shared model:
(1) sleep accumulation/recovery under BODY_OWNER; (2) permitted current interoception;
(3) consumed readiness in shared control, changing the actual candidate/probability path.
Write the exact receiving contract/card first. Use existing reserve/stress owners
and explicit neutral operands only when actually supplied by permitted body sensing;
an unintegrated interior producer is Deferred, not an invented zero belief.

Name how current readiness combines with retained fatigue, goal maintenance and
workspace occupancy; preserve existing mechanisms as controls. Do not silently map
the original acquisition load800 to slot occupancy. The first native witness must
contain genuine acquired history, a live maintained goal and available candidates,
with rested/deprived/recovered physical histories and a later probability difference.
Use original timing/values/seeds where mapped; classify every receiving difference.
Retain delayed recovery, denied/biased evidence, NoControl and lost-maintenance
comparisons; exact continuation and transaction/trace checks follow affected owners.
A sampled-choice claim requires actual coupled draws; probability proof alone must
not be labelled changed sampled behavior. No extra memory mechanism or unrelated area.

That first connection does not by itself close12.1-6. Finish its full mapped cohort
before acceptance; then resolve the motor boundary before implementing12.1-7.
No follow-on inventory, verifier chain, browser work or autonomous peer prerequisite.

## Preservation and outcome
MEC001/003 stay permitted-evidence ports/controls; MEC011 access and MEC012..019/022
retain original reasons/dice/identity/expression/execution corpus/comparator roles.
FND1..6 unchanged: no source, scheduler, state, perception or RNG mutation this turn.
RO008/009/012/013/020 remain conditional; RO019/021 historical closures remain.
No new Campaign3 verdict, debt closure, law victory, reduction or clinical claim.
21 members/15 families/132 clauses and E71/P35/N13/U13 unchanged; accepted families
remain3/15. BRIEF-12.1-6/7 remain N; old reserve/stress/tolerance evidence retains scope.
All original controls and M206 failures remain. The first preservation check failed
because it hashed Windows CRLF checkout bytes against the frozen Git/LF plan hash.
A bounded diagnosis confirmed the exact Git blobs match both recorded hashes and
checkout differences are CRLF only. The corrected check hashes those original Git
blobs and separately verifies the checkout correspondence; no evidence was rewritten.
Corrected source/preservation/research/reference/pin/document/evidence/size checks
PASS. Verification12.706/120 seconds including the retained failed check and hash
diagnosis and final staging checks. Two evidence files below5MiB; no simulation rerun.
This finite reconciliation is complete. Next implementation is sleep-to-control;
strict intoxication execution correspondence stays unresolved until its receiving
contract is settled before code. Family12.1 remains unaccepted.
