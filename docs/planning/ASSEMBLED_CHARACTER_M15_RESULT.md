# M15 — perceived performance changes the next executed route

The continuing character now tries another available route after repeated perceived
failure, while keeping its goal. Actual execution supplies a permitted report; the
character retains that report and uses it in its existing planning and decision loop.

PASS,2026-10-27.
Before-code card/contract b3969b97; base53b2d0b2. Rules/registry0.15 implements
[performance0.1](../formal/ASSEMBLED_CHARACTER_PERFORMANCE_CONTRACT.md).
[Raw checks](ASSEMBLED_CHARACTER_M15_CHECKS.txt) retain the declared comparisons.

## Connection and ownership

Campaign3 TwoFailures now receives outcomes from this character's own executed action.
The existing planner first considers known route availability, then switches after
at least two consecutive admitted failures on the current visit if the alternative
is known available. Success resets the count; missing feedback neither increments
nor resets it. A changed route starts a new visit. Feedback does not retire the goal.
The selected route feeds existing candidates, reasons, arbitration, intent, protocol
execution and physical action; there is no private performance chooser.

The existing knowledge owner holds the per-task journal1000/3, and the existing plan
owner holds visit996/2. Route availability1000/1, forecast1000/2 and selected plan996/1
remain distinct. All use one authoritative state, scheduler, RNG ledger, trace and save.
Campaign0 ordering/atomicity and the Campaign1/2 perception/cognitive foundation remain
in the same composition with the Campaign3 mechanisms. Production calls no standalone
Campaign3 factory or runtime.

Feedback joins the actual action/outcome/attempt at physical phase110. Only a currently
selected task route matching that action can receive it. Projection120 gates the report,
then evidence130 and common learning140 append it. Later planner40 records actual reads
of journal and visit. Current feedback cannot change that instant's earlier decision.
Generated children bind to full scheduled events and real parents; all owners share
atomic commit/rollback. The display does not establish which motive caused the action
or whether its goal was attained.

TwoFailures is a bounded engineering default from performance-public0.1, locked before
code. No superiority verdict is claimed. OutcomeBlind and AnyFailure remain historical
comparators; TruthOracle remains a boundary-violating diagnostic. No competence belief,
causal-control estimate or general strategy optimization was added.

## Fixed comparison

All16 predeclared runs (seeds0..7, two report conditions) reach terminal10. Both routes
stay available. TaskA has importance1/urgency1; taskB importance0/urgency0. Body100,
zero action fuel, original practice3 and absent forecast are common to both branches.

| Observation / behavior | Reported failure at3/5 | Reported success at3/5 |
|---|---|---|
| Consumed failure count at3/5/7 |0 / 1 / 2 |0 / 0 / 0 |
| Actual actions at3/5/7 |one / one / two |one / one / one |
| Goal at7 |Open |Open |
| Visit start after planning7 |7 |3 |

All eight pairs change the third executed action. Cognition and skill agree through the
first two choices; route availability still agrees at the switch. Protocol output and
physical action both confirm the selected route. Actual feedback at7 is admitted only
after the third choice. There are zero arbitration draws in these settled choices;
common seeds are not presented as matched random-draw coupling.

## Controls

Six groups pass: the exact TwoFailures count/switch/selection kernel against all eight
original frames of main, repeatFailures and gappedFailures, with retained alternative
diagnostics; missing feedback, success reset and unavailable alternatives; false or
denied feedback despite changed physical success, preserving cognition and knowledge;
exact repeat plus restore at5 with every later whole boundary/save equal; no attempt,
unmatched selected route and expired-goal exclusions; source/S0/owner/append admission,
real child forgery/rebinding/duplicate rejection, actual read paths and late140 rollback.

The rollback control has44 events and a43-work limit; the failed instant leaves the
whole pre-instant snapshot intact. Fresh visit counting is compared over the original
repeatFailures horizon; the assembled witness also checks the new visit starts at7.
The hidden-result controls retain equal cognition despite different physical outcomes;
they do not claim the physical state itself is equal. No simulation law, fixture,
seed set or comparison meaning was changed after results. All checks passed on their first execution; no validation correction was needed.

## Completion checks and remaining scope

M14's32-run matrix and six controls pass unchanged, as do all six M12 strategy tests
for the changed planner/plan wiring. M14 retains the same seven choice-difference seeds
and ten later-pursuit seeds. M13 priority source/test/fixtures, the historical105-file
dependency closure, configuration/original fixtures and M1 source guards pass. No
changed historical dependency requires another full frozen-control replay.

TypeScript, repository boundaries and research checks pass. Research remains0 active/
18 conditional/4 closed/0 unowned,103 C3 verdicts/4318 reports. Recorded validation
before final document/index checks totals615.78s; longest command204.10s.
The10min/command and30min total limits hold. Final document/evidence caps and staged
Git size are checked before commit; no additional functional suite is opened.

Ten production/test files and two evidence files; no source copies, verifier framework
or UI. Journal capacity8/task, two governed tasks/routes and controlled identity-bearing
feedback remain bounded domains. Rich recognition, competence beliefs, wider skill and
control mechanisms remain pending. RO010/012/013/014 receiving boundaries are exercised;
broader conditional debt, RO011 and historically closed RO019 are unchanged. No new
Campaign3 verdict or full foundation qualification is claimed. The complete21-member/
219-record,15-family/132-clause reference replay and final assembly acceptance remain open.

M15 is complete. Stop here; final assembly acceptance remains pending.
