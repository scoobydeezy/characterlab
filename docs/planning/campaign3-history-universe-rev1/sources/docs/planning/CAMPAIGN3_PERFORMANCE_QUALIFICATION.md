# Performance monitoring and strategy switching - 2026-09-25

**QUALIFIED / LOCAL DISPOSITION. Bounded monitoring profile COMPLETE.**
**Stage E: VER-C3-PERFORMANCE-001. No owner ruling required.**
Contract performance-public/0.1-candidate; records1292..1310/schema1, namespace1183.

| Counter | Value |
|---|---|
| Highest allocated record type | **1310** |
| Allocated since last verdict/corpus member | **0** (19 this increment) |

## What this qualifies

Own admitted performance feedback changes a later ordinary strategy while the
adopted goal and perceived route availability remain fixed. The active goal,
selected route, actual attempt/execution, received feedback and monitoring
diagnostic remain separately traceable. A failed attempt is not itself evidence
of incompetence, route impossibility or the superiority of an alternative.

The candidate counts consecutive admitted failures during the current route visit.
Two failures prompt a switch if another route is known available. An admitted
success resets the count; missing feedback neither increments nor resets it.
VisitStartedAt prevents stale failures from triggering a later visit's switch.
The threshold is a bounded candidate, not a universal control law.

## Evidence and Stage C competitors

Four frozen models and22 canonical public runs pass198 exact whole-prefix restores:
176 advancing continuations and22 terminal checks. PERFORMANCE_PUBLIC_PLAN_REV1.json
binds source, original inputs and model/run/experiment/comparison identities.
PERFORMANCE_PUBLIC_RESULT_REV1.json records the results;
PERFORMANCE_PUBLIC_VIEWS_REV1.json retains complete outputs and observer views.

PERFORMANCE_TESTS_REV1.json records19 passing tests, including all8 stages plus
commit rollback during the first actual monitoring-triggered switch. Actual phase
producers, immutable prefixes, malformed source, foreign writer, forged handle and
tampered save/original rejection pass. PERFORMANCE_REFERENCE_TESTS_REV1.json records
328 passing reference tests; PERFORMANCE_BUILD_REV1.json binds the successful build.
No full active-suite rerun or new RNG-law qualification is claimed.

- Baseline routes are none,A,A,B,B,B,B,B. The goal record and both known-available
  route diagnostics stay fixed during the switch. Route B is actually attempted
  and successfully executed at instant4, not merely assigned a better score.
- At the same physical outcomes, positive feedback prevents the switch. A single
  failure followed by positive feedback does not trigger the two-failure model.
  AnyFailure switches sooner; OutcomeBlind keeps A despite retaining feedback and
  computing the same kind of monitoring diagnostic. Both comparisons remain.
- Missing feedback cannot count the same failed sample twice. Separated admitted
  failures can still trigger switching across intervening unknown outcomes.
  Repeated failure on both routes produces A,A,B,B,A,A,B; returning to A starts a
  fresh visit rather than immediately recycling its old failures.
- Without a known alternative, the usable route and goal remain. No adoption
  produces no attempt and no performance observation. Desired-state attainment is
  separately observed: external fulfillment can retire the goal, while reported
  performance success alone cannot do so.
- False failure displays can cause switching after physically successful attempts.
  Entire later lawful views match under hidden obstruction versus incompetence,
  successful execution behind false failure displays, denied-feedback world
  changes and denied versus absent route displays through later common receipt.
  TruthOracle intentionally violates the feedback boundary and fails the hidden-
  outcome comparison.
- Monitoring40 consumes earlier learning140. Plan90 reaches attempt100 and
  execution110; observation120/evidence130 precede separate goal/knowledge140.
  Later feedback never rewrites an earlier plan or attempt. Ordinary planning
  makes no new Decision, intent or frozen-expression claim.

## North Star transfer, preservation and limits

**Monitoring admitted performance can change how a character pursues a goal without
changing what it wants or granting knowledge of why execution failed.**
The witness supplies Brief12.6 clause5. It does not establish optimal switching or
better efficacy of route B: the main apparatus removes its blocker at instant4,
when either open route could succeed. The intervention proves feedback sensitivity
and a real downstream consumer, not causal superiority of the new strategy.

PERFORMANCE_IMPLEMENTATION_FINDINGS.md and PERFORMANCE_PRESERVATION_REV1.json
preserve visit-local counting, source assumptions and this causal limitation.
The first scientific test/build/public cohorts pass; no failed cohort is overwritten.
GOAL's unchanged availability component is explicitly reused. Earlier GOAL, CONTROL,
SKILL and AGENCY qualifications retain their distinct scopes and frozen identities.
MEC-004/019/020/022 and EXP-013 provide controlled evidence, attempt/outcome,
lifecycle and historical meaning; MEC-012..018 remain separate mandatory controls.

Natural feedback recognition, general causal diagnosis, learning relative strategy
efficacy, calibrated thresholds, multi-goal planning, fatigue, rumination, effort
and broader privacy/integration remain unqualified. RO-C3-010/012/013/020 remain
CONDITIONAL and019 ACTIVE. None closes;021 historical reconciliation remains
mandatory and unsatisfied. No architectural distinction is retired.

AuditREV35 advances only Brief12.6 clause5 from BLOCKED to QUALIFIED BOUNDED:
85 bounded/25 partial/22 blocked across132 clauses/15 families. Corpus0.29.0 remains
21 members,18 bounded/3 prior. Campaign3 is NOT EXIT-READY.

Next gate: RUMINATION_READINESS.md, preserving recurrent cognitive use, original
evidence, workspace occupancy and control opportunity as separate mechanisms.
