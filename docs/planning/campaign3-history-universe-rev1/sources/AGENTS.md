# CharacterLab agent directives

Read this file before planning or implementing work in this repository.

## Campaign 3 local decisions and escalation

Follow `docs/planning/CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md` (user directive,
effective 2026-09-13). Resolve conservative bounded choices locally using accepted
architectural precedent, preserve meaningful comparators and report LOCAL DISPOSITION.
Behavioral differences, finite fixture scope and deterministic representation choices
alone are not owner blockers. Escalate only under that policy's architectural criteria.

Items that **do** meet those criteria are tracked in
`docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md`. **Zero are open.** `OD-C3-001`
(concern -> attention feedback) was RATIFIED WITH SCOPE AMENDMENT on 2026-09-14: the
ratified precedent is a *transient character-state -> attention* seam, `TaskConcern` is
NOT the general Affect representation, `residual x (1-q)` / `omegaA = 1+q` is Candidate A
only. The comparison obligation is discharged by `VER-C3-CONCERN-001/002`;
encoding suppression and retrieval amplification remain distinct, and A/B/C are
retained candidates, not settled laws. No owner ruling is pending.

## Research obligation preservation

Every new or amended Campaign 3 verdict/qualification must create or reference its
material obligations in `docs/planning/RESEARCH_OBLIGATIONS.json`, or record an
explicit none-remaining rationale there. Follow `RESEARCH_OBLIGATIONS.md` in that
directory. Conditional debt is not immediate work or an owner ruling; deferral does
not close it. Before a reduction, check obligations naming the affected distinction.
Run `npm run check:research`; Campaign 3 exit requires zero unaccounted-for material
findings, without waiving mandatory corpus gates.

## Architectural authority

1. `CharacterLab — Ideal Character Architecture North Star.md` defines the required character capabilities, invariants, and research posture.
2. `CHARACTER_ARCHITECTURE.md` is the sole canonical topology: boxes, edges, state ownership, and causal ordering.
3. `CharacterLab — Ideal Character Research Program Brief.md` defines the research method, proof burden, and campaign rules.
4. `docs/formal/` defines versioned executable semantics beneath those conceptual authorities. An implementation must name the seam-contract version it implements.
5. `CharacterLab — Reference Architecture Build & Research Campaign Plan.md` owns active sequence without overriding accepted formal readiness gates.
6. `docs/planning/` records active seam status, phenomena, preservation obligations, and verdict evidence.
7. Phase briefs, historical findings, and implementation plans under `reference/` are hypothesis and control sources only.

When documents conflict, resolve the conflict upward through this hierarchy. Do not silently choose whichever formula or diagram is easiest to implement.

Authority is also scoped by subject. The Research Program Brief outranks formal documents on research method, proof burden, and campaign admissibility; it does **not** override an accepted seam contract's exact mathematics, domains, quantization, ordering, or trace schema. Conversely, a formal seam contract may instantiate the North Star and Architecture Map but may not redefine their required phenomena, causal boxes, or epistemic boundaries. A genuine cross-scope conflict must be resolved by amending the higher conceptual document or the lower formal contract explicitly, never by local implementation choice.

## Active direction

**Current routing (2026-10-03):** VER-C3-AFFECT-REGULATORY-001: bounded body-only regulatory reduction QUALIFIED.
64 fresh component runs/832 original-prefix restores;320 substitutions/640 executions;
4 native public sentinels/48 matching instants/16 Save132 restores;5+328 tests/build.
Identical whole body history/current sensations, different admitted harm belief produce
threat0/270 and later stress0/135. FullAffect/ScalarThreat preserve64/64;Stress56/64,
Pain48/64,RewardDeviation56/64. Preserve scalar successes and unchanged actions.
No new production mechanism or psychological vector-necessity claim. AuditREV111:
132 bounded/0 partial/0 blocked;106 verdicts. Bounded clause coverage complete;Campaign3
NOT EXIT-READY. Counters1508/0;corpus0.29.0/21;wrappers54/57 unchanged. RO019 ACTIVE;
RO021 historical reconciliation unsatisfied;RO022 CLOSED. No owner ruling.
Start CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md;next
CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md.

**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-LOSS-001: bounded valued-contact loss COMPONENT QUALIFIED.
5 models/480 fresh runs/6240 original-prefix restores;5760 advancing/480 terminal;
8 faults;10 focused/328 reference tests/fresh build.160 observer/execution boundary pairs.
Actual acquired relationship, fallible contact belief, maintained goal, affect and later
sampled action/execution remain separate. Loss changes actions5/8;NoAffect5/8;
strong competing motive7/8. Preserve equalities, controlled adoption/reports,
masked action outcomes and prior GRIEF model. No clinical grief/native admission or
affect-dimensionality claim. AuditREV110:131 bounded/1 partial/0 blocked;105 verdicts.
Counters1508/0;corpus0.29.0/21;wrappers54/57 unchanged. No owner ruling.
Start CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md;next
AFFECT_REGULATORY_REDUCTION_READINESS.md. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-HABIT-001: bounded habit/relearning COMPONENT QUALIFIED.
10 models/960 fresh receiver runs/16320 receiver-prefix restores (15360 advancing/960
terminal), over8 authenticated reused native sources/136 prior native prefixes.
Separately4 fresh REV2 joined horizons/68 prefix comparisons/8 joined restores pass.
Practice-specific episode loss preserves habit; rest inhibits; actual observed renewed
practice restores corrected-belief availability8/8. Hidden/unavailable controls do not.
Final free action4/8; four non-actions preserved. Stored/Derived192 pairs and retention480
behavioral pairs match.2 fresh joined tests/build; prior10+16+328 receipts reverified.
Preserve ?raw scanner and wrong fault-oracle findings, original plan and one old joined
receipt; REV2 is authoritative, no production semantics changed. No native admission or
global history erasure/compression. All execution jobs finished; no duplicate workers.
Start CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md. Next LONGITUDINAL_PERSONAL_LOSS_READINESS.md.
AuditREV109:130 bounded/2 partial/0 blocked;104 verdicts;1508/0;corpus0.29.0/21 and
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED. No owner ruling;
Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** Habit/relearning successor IMPLEMENTED; qualification OPEN.
Actual observed practice forms separate episode children; recency pressure removes
those children while HABIT history persists. KeepAll and EraseHistory distinguish
retained episode content from learned availability. Rest inhibition/release, actual
positive renewed practice and corrected-belief free probes are implemented. Hidden
and unavailable renewed practice do not relearn from a positive report alone.
10 new/16 reused memory-owner/328 reference tests and fresh build pass;17 complete
receiver prefixes reproduce immediate successors; atomic owner rollback/publication
checks pass. Zero-standing development controls only: no native biography execution
or new native admission. Original routine/source bytes and comparators remain frozen.
Start LONGITUDINAL_HABIT_IMPLEMENTATION_CHECKPOINT.md. Next prospective native-source
binding, identity freeze and all-seed composition matrix. No owner ruling or verdict.
AuditREV108 remains129 bounded/3 partial/0 blocked,103 verdicts;1508/0;corpus0.29.0/21;
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-ROUTINE-001: bounded routine integration COMPONENT QUALIFIED.
6 models/504 receiver trajectories/8568 receiver prefix reconstructions,8064 advancing/
504 terminal.16 native sources/272 native prefixes reused under frozen authentication;
separately4 fresh joined horizons/68 prefix comparisons/8 joined restores (4 advancing,
4 terminal).12 fresh receiver faults; prior10 focused/328 reference receipts reverified;
fresh build passes. All8 maintained and withdrawn cases resume; opposed cases inhibit.
Maintained/withdrawn probabilities differ8/8, actions5/8. Stored/Derived96 pairs and
retention24 pairs match. Preserve seed0 delayed resumption at15 and negative-outcome
extinction; both development failures remain. No all504-run native admission claim.
Source episode expiry is not forgetting the new practice itself. No law retired.
Start CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md. Next
LONGITUDINAL_HABIT_RELEARNING_READINESS.md. All matrix processes finished.
AuditREV107:129 bounded/3 partial/0 blocked;103 verdicts;1508/0;corpus0.29.0/21 and
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
No owner ruling; Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** Routine integration IMPLEMENTED; prospective qualification OPEN.
Native LONG biography joins actual pre-gap practice, cue history, corrected reward
belief and maintained/withdrawn/opposed goals.10 focused/328 reference tests/build pass.
Native seeds0/1 reach14 after actual episode expiry; seed0 retains availability but
chooses idle under contrary biography, seed1 resumes. Pure receiver covers16 instants
and8-seed Stored/Derived equality. Original-prefix1/8 successors and3 fault sites pass.
Preserve typed-occurrence rejection and failed must-resume assertion in both development
cohorts. No calibration changed to force resumption. No verdict, Brief promotion or
native Save132 admission. Start LONGITUDINAL_ROUTINE_IMPLEMENTATION_CHECKPOINT.md.
Next prospective source-reuse/identity freeze, full native horizon and routine matrix.
AuditREV106 remains128 bounded/4 partial/0 blocked,102 verdicts;1508/0;corpus0.29.0/21;
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED. No owner ruling.
Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-GOAL-001: bounded goal/biography integration COMPONENT QUALIFIED.
5 models/120 runs/2040 original-prefix restores;1920 advancing/120 terminal successors.
Fine/NoFeedback probabilities differ18/24, actions14/24; coarse equals NoFeedback24/24.
All24 retention pairs preserve later choices. Goal withdrawal/replacement changes8/8
sequences each without rewriting native source saves. Zero-standing and stochastic
equalities remain. Existing8 focused/328 reference receipts reverified; fresh build passes.
No new joined native scheduler or Save132 admission. All execution jobs have finished.
Start CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md; next LONGITUDINAL_ROUTINE_READINESS.md.
AuditREV105:128 bounded/4 partial/0 blocked,102 verdicts.1508/0;corpus0.29.0/21 and
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED. No owner ruling;
Campaign3 NOT EXIT-READY. No general calibration selected or comparator retired.

**Prior routing (2026-10-03):** Longitudinal matrix continues in active sessions86267/36191; no duplicate workers.
Interim review binds72 complete trajectories: fine/coarse probabilities differ18/24,
actions14/24; zero-standing seeds4/5 and four stochastic action equalities retained.
All24 KeepAll/expired pairs preserve later choices. Current goal withdrawal/replacement
changes actions8/8 each with identical native biography saves. No verdict/promotion;
all120 runs and2040 restores still required. See LONGITUDINAL_GOAL_INTERIM_REVIEW.md.
Prior8 focused/328 reference/build receipts unchanged; no production edit.1508/0.
AuditREV104 remains127 bounded/5 partial/0 blocked,101 verdicts. No owner ruling.

**Prior routing (2026-10-03):** Longitudinal goal matrix FROZEN and EXECUTING:5 models/120 runs/2040 required restored
prefixes. Immutable capture:20 complete trajectories/340 captured hashes/12 native goal
pairs,0 new restores. Counts are historical, not final completion. Two active tool
sessions86267/36191; inspect LONGITUDINAL_GOAL_EXECUTION_PROGRESS.log before launching
anything. Sequential continuation already queues replay and final matrix checks.
Start LONGITUDINAL_GOAL_EXECUTION_CHECKPOINT.md. No verdict/promotion/native admission.
Prior8 focused/328 reference/build receipts reverified, not rerun.1508/0;AuditREV103:
127 bounded/5 partial/0 blocked,101 verdicts;RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
No owner ruling; Campaign3 NOT EXIT-READY.

**Prior routing (2026-10-03):** Longitudinal goal integration IN PROGRESS, no new verdict or clause promotion.
Start LONGITUDINAL_GOAL_IMPLEMENTATION_CHECKPOINT.md. Unchanged native LONG source
joins existing goal adoption/withdrawal and actual later reason-dice choice.16 instants;
8 focused/328 reference tests/build; seed0 and selected restores only. Preserve failed
coarse NoFeedback inequality: acquired -100733/600733 standing had zero effective
coarse modifier. FineStanding is a separate candidate; coarse equality remains.
Next prospective all-seed/all-prefix composition matrix. No native joined admission.
Counters1508/0;AuditREV102 remains127 bounded/5 partial/0 blocked,101 verdicts.
RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED. No owner ruling; NOT EXIT-READY.

**Prior routing (2026-10-03):** bounded enacted coercion COMPONENT QUALIFIED.
VER-C3-ENACTED-COERCION-001:6 models/576 runs/2880 complete prefixes;2304 advancing/
576 terminal successors.12 focused/328 reference tests/build;1508/0. Actual refusal
penalties supply admitted, source-specific knowledge before later choice/qualification.
All8 seeds change probabilities;5 change actions,3 remain equal. Mean/Latest differ2/8;
20 high-pressure expressions excluded by Threshold. Original expression survives failed
execution; same displays/different power preserve target views. All six candidates remain.
Controlled demander, penalty policy, significance and meaning; no native admission or
universal coercion law. Brief12.12-3 bounded;AuditREV101:127 bounded/5 partial/0 blocked;
101 verdicts. Corpus0.29.0/21, wrappers54/57 unchanged. No owner ruling; NOT EXIT-READY.
See CAMPAIGN3_ENACTED_COERCION_QUALIFICATION.md and ENACTED_COERCION_CLOSURE_REV1.json.
Next LONGITUDINAL_INTEGRATION_READINESS.md;RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.

**Prior routing (2026-10-03):** bounded cross-context expression COMPLETE:
VER-C3-CROSS-CONTEXT-001. Start CURRENT.md and CAMPAIGN3_CROSS_CONTEXT_QUALIFICATION.md.
6 enacted-domain models/55 runs/330 prefixes;330 original save hashes preserved.
144 receiving executions/864 prefixes (126 new runs/756 new;18 repeats),6 unchanged
models.14 focused/328 reference tests/build;1508/0. Actual custody/disclosure/attendance
and all-seed receiving close Brief12.12-1 bounded. Preserve local/global cancellation,
publication gap and typing cohort. No natural meaning/acceptance or native admission.
AuditREV100:126/6/0;100 verdicts;wrapper54/57/corpus0.29.0/21 unchanged. Next
ENACTED_COERCION_READINESS.md; no owner ruling; Campaign3 NOT EXIT-READY.


**Current routing (2026-10-02):** controlled common-meaning identity component COMPLETE:
VER-C3-CROSS-CONTEXT-COMPONENT-001. Start CURRENT.md and
CAMPAIGN3_CROSS_CONTEXT_IDENTITY_QUALIFICATION.md.6 models/127 runs/762 prefixes;
12 focused/328 reference tests/build;1508/0. Held-out probabilities differ6/8,
actions4/8;1/7 cancellation retained. No broad context or native closure: generic
execution and authored meanings leave Brief12.12-1 PARTIAL. Seed7 receiving
controls need all-seed successors. Preserve both development cohorts/execution plan.
Next CROSS_CONTEXT_IDENTITY_SOURCE_SUFFICIENCY.md. AuditREV99:125/7/0;99 verdicts;
wrapper54/57/corpus0.29.0/21 unchanged. No owner ruling; NOT EXIT-READY.


**Current routing (2026-10-02):** repeated interference expectation COMPONENT QUALIFIED:
VER-C3-INTERFERENCE-EXPECTATION-001. Start CURRENT.md and
CAMPAIGN3_INTERFERENCE_EXPECTATION_QUALIFICATION.md.12 native sources/108 native prefixes;
4 component models/60 comparisons/540 component prefixes;18 focused/328 reference tests/
build;1508/0. Separate replay surfaces, no new native wrapper. Exact prior intent remains;
prospective expectation feeds appraisal. Preserve missing denied pair and terminal-report
timing successor. Brief12.14-5 bounded;AuditREV98:125/7/0;98 verdicts;wrapper54/57.
Next CROSS_CONTEXT_IDENTITY_READINESS.md; no owner ruling; Campaign3 NOT EXIT-READY.

**Current routing (2026-10-02):** hidden-cause inference COMPONENT QUALIFIED:
VER-C3-LATENT-CAUSE-001. Start CURRENT.md and CAMPAIGN3_LATENT_CAUSE_QUALIFICATION.md.
4 models/56 runs/392 prefixes;16 focused/328 reference tests/build;1508/0. Actual
competing explanations and goal-relative appraisal; hidden/denied/timing and mistaken
controls. No native/general causal-identification claim. Brief12.4-4 bounded;AuditREV97:
124/8/0;97 verdicts;wrapper54/57 unchanged. Next INTERFERENCE_EXPECTATION_READINESS.md.
Affect dimensionality stays partial; no owner ruling; Campaign3 NOT EXIT-READY.

**Current routing (2026-10-02):** affect reduction comparison COMPLETE, no clause promotion.
VER-C3-AFFECT-REDUCTION-001; start CURRENT.md and CAMPAIGN3_AFFECT_REDUCTION_COMPARISON.md.
ScalarUncontrolled matches all14 FullPair receiving cases; Exposure/HistoricalAverage
fail full-control preservation.4 models/56 substitutions/112 receiver executions;
14 original runs/70 restores. No production change; prior24/328/build preserved.
AuditREV96:123/9/0;96 verdicts;1508/0;wrapper54/57. Brief12.5-8 remains PARTIAL.
Next LATENT_CAUSE_READINESS.md under local reordering; no owner ruling; NOT EXIT-READY.

**Current routing (2026-10-02):** affect retrieval COMPONENT QUALIFIED:
VER-C3-AFFECT-RETRIEVAL-001. Start CURRENT.md and CAMPAIGN3_AFFECT_RETRIEVAL_QUALIFICATION.md.
4 models/56 runs/280 prefixes;24 focused/328 reference tests/build. Same prior memory/
history/cue, actual affect changes published recall; NoFeedback removes it. Four laws
retained; no native/encoding/salience/scalar-necessity claim. Preserve harness failure.
AuditREV95:123/9/0;95 verdicts;1508/0;wrapper54/57 unchanged. Next scalar-affect reduction
comparison (work-order item5); no owner ruling. Campaign3 NOT EXIT-READY.

**Current routing (2026-10-02):** recent vivid recollection component QUALIFIED:
VER-C3-VIVID-001. Start CURRENT.md and CAMPAIGN3_VIVID_RECOLLECTION_QUALIFICATION.md.
4 models/44 runs/308 prefixes;17 focused/328 reference tests/build;1508/0.
Same values/rank, different sensory fidelity; false vivid recall and real fragmentation.
Preserve nonempty-basis/unrelated-cue findings. No subjective/native qualification.
AuditREV94:121/11/0;94 verdicts. Next affect-to-salience/retrieval under work-order item4.
No owner ruling; NOT EXIT-READY. Earlier routing is historical.


**Current routing (2026-10-02):** interoceptive uncertainty component QUALIFIED:
VER-C3-UNCERTAINTY-001. Start CURRENT.md and CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md.
5 models/155 runs/775 prefixes;15 focused/328 reference tests/build;1508/0.
Explicit interval quality versus external accuracy;6/8 sequence differences,2 equal.
No native admission, physical execution or calibrated confidence. Five laws retained.
AuditREV93:120/12/0;93 verdicts. Next recent vivid recollection readiness per remaining
work order. No owner ruling; NOT EXIT-READY. Earlier routing is historical.


**Current routing (2026-10-02):** importance/urgency component QUALIFIED:
VER-C3-IMPORTANCE-URGENCY-001. Start CURRENT.md and
CAMPAIGN3_IMPORTANCE_URGENCY_QUALIFICATION.md.5 models/195 runs/1365 prefixes;
14 focused/328 reference tests/build;1508/0. Equal initial products diverge later;
Refold equals cached importance. No native admission or physical execution claim.
AuditREV92:118/14/0;92 verdicts. Next uncertainty readiness under remaining work order.
Preserve development failures/all comparators. No owner ruling; NOT EXIT-READY.
Earlier routing is historical.


**Current routing (2026-10-02):** partial-coverage audit pass COMPLETE. Start CURRENT.md,
CAMPAIGN3_LONGITUDINAL_PARTIAL_COVERAGE_AUDIT.md and
CAMPAIGN3_REMAINING_COVERAGE_WORK_ORDER.md. All20 original clauses audited; five
bounded closures,15 remaining gaps. AuditREV91:117/15/0;91 verdicts;1508/0.
No new behavioral execution. Next same-motive importance/urgency readiness and
comparison; no owner ruling. Campaign3 NOT EXIT-READY. Earlier routing is historical.


**Current routing (2026-10-02):** identity/agency partial audit COMPLETE. Start
CURRENT.md and CAMPAIGN3_IDENTITY_AGENCY_PARTIAL_COVERAGE_AUDIT.md. All three audited
clauses remain partial; no new qualification. AuditREV90:117/15/0;91 verdicts;1508/0.
IntakeREV6:16/20 audited,4 awaiting audit. Historical receipts only, no new simulation.
Next longitudinal routines/goals/habits/loss coverage. No owner ruling; not exit-ready.
Earlier routing below is historical.


**Current routing (2026-10-02):** Affect partial-coverage audit COMPLETE (2026-10-02), LOCAL DISPOSITION.
Brief12.5-3 fear without flight closes in bounded AFFECT threat/continuation scope:
positive threat, same affect, competing commitment changes actual response (seeds4/7).
No literal locomotor flight or general fear syndrome claimed. Salience/retrieval
feedback12.5-6 and non-scalar regulatory affect12.5-8 remain PARTIAL. Start
CAMPAIGN3_AFFECT_PARTIAL_COVERAGE_AUDIT.md and AFFECT_PARTIAL_COVERAGE_CHECK_REV1.json.
Thirteen of20 starting clauses audited; seven await audit in intakeREV5. Prior
receipts/source hashes reverified; no new simulation/tests/build, verdict or allocation.
AuditREV89:117 bounded/15 partial/0 blocked;91 verdicts;1508/0; wrapper54/57 unchanged.
Next identity/agency: cross-context expression, coercion exclusion, repeated interference.
RO019 ACTIVE; RO021 unsatisfied; no owner ruling; Campaign3 NOT EXIT-READY.

Earlier routing below is historical.


**Current routing (2026-10-02):** Belief partial-coverage audit COMPLETE (2026-10-02), LOCAL DISPOSITION.
Brief12.4-6 repeated prediction error is QUALIFIED BOUNDED using existing reinforcement
component evidence: prior expectations differ from admitted outcomes, repeated updates
change later choice, withholding breaks the route. Residuals are audit readouts, not
new surprise state. Uncertain-but-correct belief12.4-1 and hidden cause12.4-4 remain
PARTIAL. Start CAMPAIGN3_BELIEF_PARTIAL_COVERAGE_AUDIT.md and
BELIEF_PARTIAL_COVERAGE_CHECK_REV1.json. IntakeREV4: ten of20 clauses audited, ten
await audit. No new verdict, simulation/tests/build, production change or allocation.
AuditREV88:116 bounded/16 partial/0 blocked;91 verdicts;1508/0; wrapper54/57 unchanged.
Next affect: fear without flight, salience/retrieval feedback, regulatory dimensionality.
RO019 ACTIVE; RO021 unsatisfied; no owner ruling; Campaign3 NOT EXIT-READY.

Earlier routing below is historical.


**Current routing (2026-10-02):** Memory partial-coverage audit COMPLETE (2026-10-02), LOCAL DISPOSITION.
Brief12.3-10 consolidation without episode/summary double-counting is QUALIFIED
BOUNDED using VER-C3-RECOLLECT-001. Recent vivid recollection12.3-1 and affect-biased
retrieval12.3-9 remain PARTIAL with explicit comparison/integration gaps. TaskConcern
is not general Affect. Start CAMPAIGN3_MEMORY_PARTIAL_COVERAGE_AUDIT.md and
MEMORY_PARTIAL_COVERAGE_CHECK_REV1.json. Seven of20 starting clauses audited;
thirteen await audit in intakeREV3. Prior receipts reverified, no new simulation,
tests/build, verdict, production change or allocation.115 bounded/17 partial/0 blocked;
91 verdicts;1508/0; wrapper54/57 unchanged. Next belief: uncertain correct estimate,
hidden cause, repeated prediction error. RO019 ACTIVE; RO021 unsatisfied; no owner
ruling. Campaign3 NOT EXIT-READY.

Earlier routing below is historical.


**Current routing (2026-10-02):** Motive partial-coverage audit COMPLETE (2026-10-02), LOCAL DISPOSITION.
Brief12.2-6 multiple actions per motive is QUALIFIED BOUNDED using the existing
SUBSTITUTION component and separate native GOAL/strategy corroboration. Brief12.2-2
importance/urgency remains PARTIAL pending independent same-motive interventions.
Start CAMPAIGN3_MOTIVE_PARTIAL_COVERAGE_AUDIT.md and MOTIVE_PARTIAL_COVERAGE_CHECK_REV1.json.
Four of20 starting partial clauses audited; sixteen await audit in intakeREV2.
No new verdict, run, simulation/tests/build, production change or allocation.
AuditREV86:114 bounded/18 partial/0 blocked;91 verdicts;1508/0; wrapper54/57 unchanged.
Next memory: vivid recollection, affect-biased retrieval, consolidation/double-counting.
RO019 ACTIVE; RO021 unsatisfied; no owner ruling; Campaign3 NOT EXIT-READY.

Earlier routing below is historical.


**Current routing (2026-10-02):** Partial coverage audit —2026-10-02: Brief12.1-8 tolerance branch is QUALIFIED BOUNDED
from VER-C3-TOLERANCE-001, VER-C3-BIOLOGY-001 and VER-C3-BIOLOGY-PUBLIC-001, with
current publication-repair evidence preserved. Brief12.1-4 interoceptive uncertainty
remains PARTIAL: scalar fallibility/missingness does not yet discriminate an
uncertainty-sensitive consumer. See CAMPAIGN3_BODY_PARTIAL_COVERAGE_AUDIT.md and
BODY_PARTIAL_COVERAGE_CHECK_REV1.json. Only these two of the initial20 clauses were
audited; PARTIAL_COVERAGE_INTAKE_REV1.json queues the other18. No new verdict,
model/run, production change or allocation. Existing receipts reverified, no fresh
simulation/tests/build. Preserve historical-checker rejection and proper source mapping.
AuditREV85:113 bounded/19 partial/0 blocked;91 verdicts;1508/0; wrapper54/57 unchanged.
Next Brief12.2-2 importance/urgency and12.2-6 multiple actions per motive. RO019 ACTIVE;
RO021 unsatisfied; RO022 CLOSED. LOCAL DISPOSITION; Campaign3 NOT EXIT-READY.

Earlier routing below is historical.


**Current routing (2026-10-01):** VER-C3-DEVELOPMENT-PUBLIC-001 qualifies development-public/0.1-candidate:
7 models/36 public programs/668 actual Save132 prefixes,632 advancing/36 terminal;
8216 committed native stages;21 focused/328 reference tests/typecheck/build;1508/0.
Independent learning and event-time personality weighting retain exact component
trajectories, original eligibility and immutable constitution under13 native stages.
Step/Ramp/gain controls, all seeds, both test cohorts and all harness revisions preserved;113 earlier
restore receipts retained without double counting. Wrapper54/57; prior scopes intact.
Brief12.15-1 bounded; AuditREV84:112 bounded/20 partial/0 blocked;91 verdicts.
No universal gain/calendar-age claim. RO008/009/010/013/017/019/020/021/022.
Evidence CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md and DEVELOPMENT_PUBLIC_CLOSURE_REV1.json.
Next CAMPAIGN3_PARTIAL_COVERAGE_READINESS.md; no owner ruling; Campaign3 NOT EXIT-READY.

Earlier harness routing below is historical; the native matrix is complete.


**Harness routing update:** continue DEVELOPMENT_PUBLIC_PLAN_REV3.json with
qualify-development-public-rev3.mjs,12 partitions and Vite watch:null. Preserve
113 distinct prior restores and the watcher-backlog REV3 finding. Preserve original4 complete
programs/94 native prefixes and DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json.
Only final trusted-trace audit parsing changed; all identities/production frozen.
Native qualification remains OPEN; counters1508/16. CURRENT.md lists live sessions.


**Prior routing (2026-10-01):** Native development implementation VERIFIED; full matrix RUNNING.13 actual stages,
primary18 exact component rows/bundles and234 traces;21 focused/328 reference tests/
typecheck/build.1508/16. Typed originals, disjoint owners, Save132/original replay,
all reached stage faults and both publication barriers pass. Wrapper54/57 checked;
prior53/52/51/50/49 scopes intact. Preserve first test-only read-only mutation error.
Next finish36 public programs/668 native prefixes; earlier component restores do not
satisfy this gate. No new verdict/Brief promotion;111/20/1;90 verdicts; AuditREV83.
Start DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md; no owner ruling.


**Prior routing (2026-10-01):** development COMPONENT QUALIFIED, VER-C3-DEVELOPMENT-001.
Start CURRENT.md and CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md.7 models/36 runs/668
component prefixes;13 focused/328 reference tests/build;1492/0. Younger learning
and greater event-time personality weight are independently qualified; eligibility
and old event weights preserved. All8 early sampled pairs equal; all8 full probe
sequences differ. Step/Ramp/gain controls and timeout cohort retained. Native gate
OPEN: next DEVELOPMENT_PUBLIC_READINESS.md; no owner ruling. AuditREV82 stays
111/20/1;90 verdicts. Wrapper53/56 unchanged. Campaign3 NOT EXIT-READY.

**Owner amendment (2026-10-01):** DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md
supersedes the prior developmental intake scope. Younger learning plasticity AND
greater early personality-forming event weight are required, independently. Preserve
eligibility, original constitution and event-time provenance; no retroactive reweighting.
Exact laws remain candidates; no owner ruling.1492/0; AuditREV81 keeps111/20/1.

**Current routing (2026-10-01):** development-history coverage audit COMPLETE;
independent developmental-state implementation remains OPEN. Start CURRENT.md and
DEVELOPMENT_HISTORY_CHECKPOINT.md.2 reused models/3 runs/51 public restores, all
original hashes/views/executions preserved. Early practice changes later execution;
identity/relationship/person projections remain equal. No production change/new
verdict/allocation/Brief promotion.1492/0; wrapper53/56. AuditREV80:111/20/1,89 verdicts.
Development is distinct from acquired skill/adaptation; next DEVELOPMENT_STATE_READINESS.md.
Preserve import-query preflight failure. No owner ruling; Campaign3 NOT EXIT-READY.


**Prior routing (2026-09-29):** defining memory NATIVE PUBLIC QUALIFIED:
VER-C3-DEFINING-PUBLIC-001. Start CURRENT.md and CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md.
68 public programs/68 models/1680 restored prefixes;1612 advancing/68 terminal
successors;376 exact native stages;17 focused/328 reference tests/build.1492/0.
Brief12.3-2 bounded. One successor per prefix, not full tails; carried cue, empty
graph, scheduled baseline and diagnostic worldAfter remain controls. No law selected
or comparator retired. Wrapper53/56. AuditREV79:111/20/1;89 verdicts. Next
DEVELOPMENT_COVERAGE_READINESS.md; no owner ruling. Campaign3 NOT EXIT-READY.

**Prior routing (2026-09-28):** defining public implementation VERIFIED, full matrix OPEN.
Start CURRENT.md and DEFINING_PUBLIC_IMPLEMENTATION_CHECKPOINT.md. Closed recipe,
empty-S0 originals, successor identity, actual Save132 and original-prefix replay;
both runtime/factory publication guards.1 profile/27 instants/8 native stage matches/
9 saves; successful restore0/39/4000; rollback38/39/42/43/4000.17 new/328 reference
tests/typecheck/build pass. Native handler body unchanged; first test-only Node
hashing typecheck rejection preserved.1492/8; no verdict or Brief promotion.
Wrapper53/56; predecessor52/51/50/49 frozen; RO022 closed for current publication scope.
Next all68 public programs/1680 prefix restores and controls. Earlier68 internal
runs do not satisfy that public matrix. AuditREV78:110/20/2;88 verdicts; no owner ruling.

**Prior routing (2026-09-28):** all68 selected native defining-memory cases PASS.
Start CURRENT.md and DEFINING_NATIVE_COHORT_CHECKPOINT.md.68 committed native model/run
identities across four retention laws;1612 instants/376 selected stage hashes.
Empty-S0 acquisition, historical/current meaning, retained memory, rehearsal, exact
rank scores and child content match the component; final presentation settles once.
No production change. Prior27 repeated prefixes/54 affected/328 reference tests/build
receipts reverified, not freshly rerun.1492/8; no verdict or Brief promotion.
Next DEFINING_PUBLIC_SAVE_GATE.md: typed public admission/Save132/original replay,
restore/fault/publication and wrapper extension. Carried cue, empty graph, scheduled
baseline and diagnostic worldAfter limits remain. No full closure or owner ruling.
AuditREV77:110/20/2;88 verdicts; wrapper52/55 unchanged.

**Prior routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md. Actual carried query37
feeds three16-publication rehearsals, supported attribution/use/presentation and
final k1 recall with actual presentation settlement.3 native profiles/27 repeated
primary prefixes;68 owner continuations;10 new/54 affected/328 reference tests/build.
Retained35 can remain unselected; absent cue/lost events yield no publication.1492/8.
Preserve test-only ScheduledEvent171/130 failure. Carried query is not fresh perception
or learned rehearsal intent; empty graph is a retained comparator. Next68 complete
native cases/public Save132/restore/fault/wrapper gate. No full closure or owner ruling.
AuditREV76:110/20/2;88 verdicts; wrapper52/55 unchanged.

**Prior routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_CURRENT_CHECKPOINT.md. Actual meaning38 delivery
joins owned report43 in read-only current assessment43/130.2 native profiles;24 primary
prefixes freshly repeated;68 current owner comparisons;9 new/50 affected/328 reference
tests/build. Contrary/missing evidence preserves historical credit; lost events stay
lost. In-flight baseline is not recall. Preserve StatePatch144/145 test-only finding.
1490/6; wrapper52/55 unchanged. Next rehearsal, final recall/presentation,68 complete
native cases and public Save132 gate. No full closure or owner ruling.
AuditREV75:110/20/2;88 verdicts. Rehearsal3/absent final cue remain unsupported.

**Prior routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT.md. Actual attribution37
feeds goal-relative meaning/credit38 and retention42 through original memory/history/
protocol owners.2 native profiles;25 primary prefixes freshly repeated;48 owner cases;
13 new/49 affected/328 reference tests/build. High retains35; absent interpretation goal
retains139 despite live training goal. Atomic retention rollback.1489/5; wrapper52/55.
Preserve all five development cohorts and successor trace codec. Next actual rehearsal,
current assessment, final recall/presentation,68-case coverage and public Save132 gate.
No full closure; prior attribution reuse bounded to unchanged intervening memory.
AuditREV74:110/20/2;88 verdicts. No owner ruling.

**Prior routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_LIFECYCLE_CHECKPOINT.md. One scheduler now acquires
GA37, adopts distinct interpretation goal37/140, receives report43/120 and settles inherited
goal/task deadlines100.1 profile/22 instants/23 repeated prefixes;8 new/44 affected/328
reference tests/build. Actual owner traces and post-terminal rollback. Records1485..1487;
1487/3. Preserve both development cohorts and corrected registry/budget commitment.
Next full successor meaning/attribution/credit, rehearsal/use, retention/protocol/history,
current/final recall, public admission/Save132 gate. Lifecycle profile does not qualify
missing memory behavior. Wrapper52/55 unchanged. AuditREV73:110/20/2;88 verdicts.
No owner ruling.

**Prior routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_CONTINUATION_INPUTS_CHECKPOINT.md. Typed source plan and
pure interpretation owner:68 matching qualification projections,8 new/36 affected/328
reference tests/build. LOCAL DISPOSITION adoption37/140 active38; inherited100 deadlines
preserved within horizon. Final native recall must settle presentation history. No new
verdict/allocation/native qualification;1484/0; wrapper52/55. Acquisition evidence unchanged.
Next same-scheduler registered handlers/roots, actual evidence and terminal memory owners,
trace, public admission/Save132 and native prefix/fault gate. AuditREV72:110/20/2;88 verdicts.
No owner ruling. Pure transitions are not registered native ownership.

**Prior routing (2026-09-27):** native defining-memory implementation IN PROGRESS.
No new verdict. Start CURRENT.md and DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md.
Actual native empty-S0 acquisition through37 implemented:19 instants/20 freshly repeated
complete prefixes; exact GA37 state/outputs;6 development/328 reference tests/build.
Preserve test-only instant/dueAt failure.1484/0; wrapper52/55 unchanged and rechecked.
Next same-scheduler continuation handlers, typed goal/report/owners, inherited lifecycle,
Save132 and public wrapper gate in DEFINING_MEMORY_PUBLIC_READINESS.md. Do not declare
native closure from the prelude. AuditREV71:110 bounded/20 partial/2 blocked;88 verdicts.
No owner ruling.

**Prior routing (2026-09-27):** defining meaning/use COMPONENT COMPLETE:
VER-C3-DEFINING-MEANING-001. Start CURRENT.md and CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md.
4 models/68 cases/308 repeated component stages;15 new/28 affected/328 reference tests/
build;1484/0. Same acquired evidence, different goals; actual counted rehearsal; later
report preserves old event/credit. Preserve uncertain-interval equality test failure.
Native continuation OPEN; full defining-memory closure waits for that gate. Wrapper52/55
unchanged; no Brief promotion. AuditREV70:110 bounded/20 partial/2 blocked. Next
DEFINING_MEMORY_PUBLIC_READINESS.md; no owner ruling.

**Prior routing (2026-09-27):** defining-memory bridge QUALIFIED:
VER-C3-DEFINING-MEMORY-BRIDGE-001. Full old-defining-memory frontier OPEN. Start
CURRENT.md and CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md.4 models/288 component
cases/864 repeated stages;13 focused/328 reference tests/build;1484/0. Actual GA37/38
history; significance-first protects and recalls old event under pressure, capacity8
retains it without selecting. Preserve Set/List adapter failure and unrelated-cue
ranking limit. No new native admission or clause promotion; wrapper52/55 unchanged.
AuditREV69:110 bounded/20 partial/2 blocked. Next DEFINING_MEMORY_INTEGRATION_READINESS.md;
no owner ruling.

**Prior routing (2026-09-27):** native embarrassment COMPLETE:
VER-C3-EMBARRASSMENT-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md.6 models/69 runs/483 native prefixes;
22 native/328 reference tests/build;1484/0. Three owners, twelve scheduled stages,
exact component rows/RNG/physical presence. Native0.2 uses parent-ordered complete110/
display110; preserve rejected115 cohort and summary-string erratum (no frame state).
Wrapper inventory52/55; prior sources unchanged. AuditREV68:110 bounded/20 partial/
2 blocked. Next DEFINING_MEMORY_READINESS.md; no owner ruling.

**Prior routing (2026-09-27):** embarrassment without avoidance COMPONENT QUALIFIED:
VER-C3-EMBARRASSMENT-001. Start CURRENT.md and CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md.
6 models/69 distinct runs/483 component prefixes;15 new/328 reference tests/build;1467/0.
Five of eight fine-calibration seeds participate despite positive social affect and an
avoidance base. Goal-only, failed execution, cue and evidence controls remain separate.
Preserve initial coarse-unit equality and decoder-test failure. AuditREV67:110 bounded/
20 partial/2 blocked. Native admission OPEN: next EMBARRASSMENT_PUBLIC_READINESS.md.
No owner ruling; native wrapper inventory51/54 unchanged.

**Prior routing (2026-09-27):** native chosen reappraisal COMPLETE:
VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md.4 models/43 runs/387 native prefixes;
21 new/328 reference tests/build;1467/0. Twelve actual stages reproduce all component
rows/RNG with separate goal/learning/frame owners. Wrapper inventory51/54; predecessor
sources unchanged. Preserve first test-helper failure. No physical protection, general
planning or Task join. AuditREV66:109 bounded/20 partial/3 blocked. Next
EMBARRASSMENT_READINESS.md; no owner ruling.

**Prior routing (2026-09-27):** chosen reappraisal COMPONENT QUALIFIED:
VER-C3-CHOSEN-REAPPRAISAL-001. Start CURRENT.md and
CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md.4 models/43 runs/387 component prefixes;
13 new/328 reference tests/build;1458/0. Actual strategy choice, independent attempted
completion and later conditional affect preserve evidence. BenefitRelative/KnowledgeOnly/
NoReappraisal and two projections retained. Native admission remains OPEN: next
CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md. AuditREV65:109 bounded/20 partial/3 blocked.
No owner ruling; existing50/53 native wrapper scope unchanged. No physical protection.

**Prior routing (2026-09-27):** bounded intoxication/control COMPLETE:
VER-C3-INTOXICATION-CONTROL-001. Start CURRENT.md and
CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md.5 models/20 runs/55 selected prefixes;
12 new/328 reference tests/build;1458/0. Identical exposure, different constitutional
clearance; control and execution recover separately without rewriting identity/goals.
Preserve masked-sensation and exact-boundary limits. No clinical law or Task join.
AuditREV64:108 bounded/20 partial/4 blocked. Next CHOSEN_REAPPRAISAL_READINESS.md;
no owner ruling. Existing wrapper inventory50/53 unchanged.

**Prior routing (2026-09-27):** bounded sleep/control COMPLETE:
VER-C3-SLEEP-CONTROL-001. Start CURRENT.md and CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md.
2 native models/20 runs/52 selected prefixes;13 new/328 reference tests/build;1458/0.
Prior wake history changes control/access; later recovery preserves original acquired
identity, learned outcomes, goals and fixed competence/constitution. Preserve first
empty-identity/sleep-relief-confounded fixture. No new production law, general sleep
model or Task join. AuditREV63:107 bounded/20 partial/5 blocked. Next
INTOXICATION_CONTROL_READINESS.md; no owner ruling. Wrapper inventory50/53 unchanged.

**Prior routing (2026-09-27):** native disposition admission COMPLETE:
VER-C3-DISPOSITION-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md.9 models/15 runs/285 native prefixes;
44 affected/328 reference tests/build;1458/0. Separate immutable constitution/plastic/
standing operands and original lineage; ten actual phases, no constitution writer.
Refold has no plastic leaf; no general fusion/ageing/scaling claim. Wrapper inventory
now50 producers/53 factories; check-disposition-wrapper-extension.mjs checks current
inventory and original49 scope without changing predecessor sources. AuditREV62:
106 bounded/20 partial/6 blocked. Next SLEEP_CONTROL_READINESS.md; no owner ruling.

**Prior routing (2026-09-27):** bounded dispositional adaptation component COMPLETE:
VER-C3-DISPOSITION-001. Start CURRENT.md and
CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION.md.9 models/15 runs/285 component prefixes;
35 affected/328 reference tests/build;1450/0. Constitution/plastic/standing remain
separate; Step/Leaky and Refold retained. JointMax equals StandingOnly here; JointAdd
can amplify shared history. Independent necessity unresolved. No native admission.
AuditREV61:106 bounded/20 partial/6 blocked. Next DISPOSITION_PUBLIC_READINESS.md.
Preserve first unexecuted manifest and trace-equality correction; no owner ruling.

**Prior routing (2026-09-27):** bounded identity recovery COMPLETE:
VER-C3-IDENTITY-RECOVERY-001. Start CURRENT.md and
CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md.5 reused models/13 runs/78 native prefixes;
8 affected/328 reference tests/build,1450/0. Standing, self/observer belief and later
appraisal stay separate; no production law changed. Brief12.12-8 bounded; auditREV60,
105 bounded/20 partial/7 blocked. Next DISPOSITIONAL_ADAPTATION_READINESS.md.
RO019 ACTIVE; RO021 CONDITIONAL and mandatory before exit; older ACTIVE prose for
RO021 was inaccurate. RO022 remains CLOSED. No owner ruling pending.

**Prior routing (2026-09-26):** bounded public-wrapper publication COMPLETE:
VER-C3-PUBLIC-QUIESCENCE-001. Start CURRENT.md and
CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md.49 producers accounted,4 repaired;
same149 cases/747 prefix restores,74 affected/328 reference tests and build pass.
RO22 CLOSED; RO21 historical gate remains ACTIVE. Counters1450/0; no clause promotion.
Next IDENTITY_RECOVERY_READINESS.md under the same escalation policy.

**Prior routing (2026-09-26):** bounded native represented identity belief COMPLETE:
VER-C3-IDENTITY-BELIEF-PUBLIC-001, identity-belief-public/0.1-candidate. Start CURRENT.md
and CAMPAIGN3_IDENTITY_BELIEF_PUBLIC_QUALIFICATION.md.5 models/37 runs/222 native
prefixes;69 affected/328 reference tests/build. Independent holder authority and
next50 after prior140 preserve source/component distinctions. Counters1450/0;
104 bounded/21 partial/7 blocked clauses;76 verdicts. No owner ruling. RO-C3-022 is ACTIVE. Next
PUBLIC_WRAPPER_QUIESCENCE_READINESS.md before identity recovery. Controlled reports only; wider identity remains open.

**Prior routing (2026-09-26):** bounded represented identity belief COMPLETE:
VER-C3-IDENTITY-BELIEF-001, identity-belief/0.1-candidate, composed component only.
Start docs/planning/CURRENT.md and CAMPAIGN3_IDENTITY_BELIEF_QUALIFICATION.md;
authoritative IDENTITY_BELIEF_CLOSURE_REV1.json.5 models/37 runs/222 prefixes;
34 affected (16 new)/328 reference tests/build.1442/0, no allocation. Self belief,
observer belief and source standing differ under independent evidence. Mean persists
positive after the known A/A/A/B contradiction; Latest becomes negative.7/8 final
estimates differ; seed6 equality retained. Preserve the validation-timeout cohort;
REV2 matches every earlier row/save/view. No native public admission or social-action
claim. Brief12.12-4/6 bounded;104 bounded/21 partial/7 blocked,75 verdicts; auditREV57.
Next IDENTITY_BELIEF_PUBLIC_READINESS.md. No owner ruling pending.


**Prior native identity routing (2026-09-26):** bounded native identity admission COMPLETE:
VER-C3-IDENTITY-PUBLIC-001, identity-public/0.1-candidate. Start docs/planning/CURRENT.md
and CAMPAIGN3_IDENTITY_PUBLIC_QUALIFICATION.md; authoritative IDENTITY_PUBLIC_CLOSURE_REV1.json.
16 models/84 runs/428 selected native prefixes;119 affected (36 new)/328 reference
tests/build.1442/0. Separate task/biological channels; no goal channel means no identity
evidence. Fine standing changes biological probabilities in3/8 seeds;8/8 sampled
sequences remain equal. Preserve coarse-unit/development findings and comparators.
No Brief promotion:102 bounded/22 partial/8 blocked,74 verdicts; auditREV56. Next
IDENTITY_BELIEF_READINESS.md. No represented self-belief, enacted coercion or64-instant
scaling claim. No owner ruling pending.


**Work order (2026-09-14, owner-directed correction pass):**
`docs/planning/CAMPAIGN3_WORK_ORDER_2026_09_14.md` governs the next increment. It
reorders GA work only; it reopens no contract, allocation, model byte or digest.
Sequence: (1) run the salience-law comparison as pure arithmetic and record a verdict;
(2) publish corpus `0.28.0` from the prepared successor manifest; (3) write the owed
EMB and ATTN verdict entries; (4) adopt `CHECKPOINT_TEMPLATE.md`; (5) resolve the concern-feedback owner ruling; (6) resume GA registration and model
closure. Items 1–6 are COMPLETE. The bounded GA implementation and qualification
closed on 2026-09-20; see `docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md`
and `VER-C3-GA-001`. The subsequent large bounded public BODY/MULTISOURCE checkpoint
is also COMPLETE: `docs/planning/CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md` and
`VER-C3-MULTI-002`. It has43 distinct models,62 public runs and227 prefix restores.
Records707..733/namespace1149 implement that contract; its closure counters were733/0.
RO-C3-001 is CONDITIONAL after discharging its immediate public-source debt; general
receiving laws remain unresolved. Preserve the rejected construction cohort and codec
regression receipts. No whole MULTISOURCE, general Need or Campaign3 PASS is implied.
The 2026-09-14 preflight/bookkeeping pass does
not start or split that implementation pass.
The "Resume here" sequence in `GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md` and the
ordering in `GENERAL_ATTENTION_CLOSURE_PLAN.md` are superseded on ordering only; their
technical content stands.

`docs/planning/CURRENT.md` is now a one-page state index that is **replaced, never
appended**; its prior chronology is preserved verbatim in `CAMPAIGN3_LOG.md`.
Report the two program counters (highest allocated record type; record types allocated
since the last verdict or corpus member) at every checkpoint. Past 50 on the second, the
next work item must be an experiment or a corpus promotion, not another allocation.

Campaign 3 current frontier: bounded identity eligibility component COMPLETE
(VER-C3-IDENTITY-ELIGIBILITY-001);6 models/52 runs/312 prefixes;60 affected/328 reference
tests/build.1426/0. Start CURRENT.md and CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md.
IDENTITY_ELIGIBILITY_FINDINGS.md preserves the rejected development wrapper.
Next IDENTITY_PUBLIC_ADMISSION_READINESS.md. No public/biological source eligibility,
represented self-belief or enacted coercion claim. AuditREV55:102 bounded/22 partial/
8 blocked. No owner ruling. Prior biological closure follows:

Campaign 3 current frontier: bounded native biological integration COMPLETE
(VER-C3-BIOLOGY-PUBLIC-001, biology-public/0.1-candidate). Start CURRENT.md and
CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md.28 models/58 distinct runs/270 unique public
prefixes;59 row executions/273 checks include one redundant writer.56 scoped tests
(23 native+33 preserved biology),328 reference tests/build pass. Records1401..1426,
namespace1156;1426/0. All53 prior trajectories match through the native runtime.
Typed biological sources and disjoint owners preserve intent70/expression80,
consequence sensing120 before adaptation140. Preserve both public development cohorts,
large-save byte-admission failure and duplicate-writer receipts. No new forecasting,
identity update, organ-level or whole Campaign3 claim. No owner ruling pending.
Next IDENTITY_EVIDENCE_READINESS.md. Prior biological component checkpoint follows:

Campaign 3 current frontier: owner-directed functional biological integration COMPLETE
for the18 behaviors in BIOLOGICAL_SYSTEM_WORK_ORDER.md (VER-C3-BIOLOGY-001).
Start CURRENT.md and CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md.25 models/53 distinct
runs/2389 distinct prefixes (2438 checks);33+328 tests/build;1400/0. Continuous body,
safe sensing, pleasure/relief/harm learning, cue access, goals/control, reason dice,
actual action effects and delayed appraisal-to-stress are integrated. Dopamine and
other analog names are permitted without 1:1 biological fidelity. Preserve domain
findings and both failed causal-development cohorts; distinct domains are not proven
irreducible meters. No public scheduler, clinical, organ-level or whole Campaign3 PASS.
AuditREV51 keeps101 bounded/22 partial/9 blocked;71 verdicts. No owner ruling pending.
Next biological coverage/public-integration review; do not automatically resume identity.
Prior checkpoint/routing below is historical:

Campaign 3 current frontier: acquired costly reward-seeking COMPLETE
(VER-C3-COSTLY-REWARD-001, costly-reward-component/0.1-candidate):6 component models/
50 runs/650 prefixes;17+328 tests/build. Start CURRENT.md and
CAMPAIGN3_COSTLY_REWARD_QUALIFICATION.md. Benefit/harm beliefs, acquired cue history,
maintained protective goal, control, actual choice and feedback stay separate.
Seven of eight seeds repeat costly choices under load; all restore withholding.
Feedback is not pathwise harm-reducing. Preserve COSTLY_REWARD_FINDINGS.md/all99
exploratory trajectories. No full addiction, physiological or public scheduler claim.
AuditREV50:101 bounded/22 partial/9 blocked;1400/0. Next IDENTITY_EVIDENCE_READINESS.md.
Preserve COSTLY_REWARD_AUDIT_RECOVERY_REV1.json: prior snapshot reconstructed after
bookkeeping overwrite; no independent pre-overwrite digest claim. Experiments unaffected.
No owner ruling pending;021 historical reconciliation remains mandatory. Prior:

Campaign 3 current frontier: bounded relapse after goal-supported adjustment COMPLETE
(VER-C3-RELAPSE-001, relapse-experiment/0.1-candidate):7 reused models/31 new public
runs/279 prefixes;5+328 tests/build. Start CURRENT.md and CAMPAIGN3_RELAPSE_QUALIFICATION.md.
Three actual withholding opportunities, then load-triggered return in seeds1/7 while
goal maintained; all eight seeds retained and withholding returns after load clears.
AuditREV49:100 bounded/22 partial/10 blocked;1400/0. Next ADDICTION_INTEGRATION_READINESS.md.
Preserve RELAPSE_FINDINGS.md Buffer rejection and REV2 same-identity wrapper correction.
No physiological recovery, learned abstinence, sustained relapse or joint addiction claim.
The craving routing below is historical; its then-next relapse is closed.

Prior frontier: bounded represented craving COMPLETE
(VER-C3-CRAVING-001, craving-component/0.1-candidate):4 models/56 unique runs/
60 comparisons/300 component prefix checks (280 distinct),5 public BODY runs/
15 prefixes;7+328 tests/build. Start CURRENT.md and CAMPAIGN3_CRAVING_QUALIFICATION.md.
AuditREV48:99 bounded/22 partial/11 blocked;1400/0. Next RELAPSE_READINESS.md.
Preserve CRAVING_FINDINGS.md and pre-freeze identity-alias assertion failure.
Urge differs from access/eligibility/action; fixed cue and restraint are controls,
not learned recognition or earned control. No enacted relapse or new public consumer.
The absence routing below is historical; its then-next craving is closed.

Prior frontier: bounded absence deficit COMPLETE
(VER-C3-ABSENCE-001, absence-deficit-component/0.1-candidate):3 component models/
27 runs/135 prefix comparisons from four public ADAPT conditions;4+328 tests/build.
Start CURRENT.md and CAMPAIGN3_ABSENCE_DEFICIT_QUALIFICATION.md. AuditREV47:
98 bounded/22 partial/12 blocked;1400/0. Next CRAVING_READINESS.md. Preserve
ABSENCE_FINDINGS.md and both source-reference/build-typing correction cohorts.
Reference, acquired displacement and current physical condition remain separate.
No new public consumer, subjective distress, recovery or craving qualification.
The tolerance routing below is historical; its then-next absence deficit is closed.

Prior frontier: bounded physical tolerance COMPLETE
(VER-C3-TOLERANCE-001, tolerance-effect-component/0.1-candidate):3 component models/
18 runs/90 prefix comparisons from four public ADAPT conditions;4+328 tests/build.
Start CURRENT.md and CAMPAIGN3_TOLERANCE_QUALIFICATION.md. AuditREV46:97 bounded/
22 partial/13 blocked.1400/0. Next ABSENCE_DEFICIT_READINESS.md. Preserve
TOLERANCE_FINDINGS.md: prior tolerance state updates and R0+D probe did not prove
attenuated effect. No new public consumer, recovery or perceived tolerance claim.
The reinforcement routing below is historical; its then-next tolerance is closed.

Prior checkpoint: bounded reinforcement feedback COMPLETE
(VER-C3-REINFORCEMENT-001, reinforcement-feedback-experiment/0.1-candidate):5 reused
models/31 runs/279 component prefixes;8 new/328 reference tests and build pass.
Start docs/planning/CURRENT.md and CAMPAIGN3_REINFORCEMENT_QUALIFICATION.md.
Chosen admitted outcomes change mean expectation, later reasons and actual action;
withheld receipts break the route despite physical relief. All eight seeds retained:
six sequence divergences, two equal. LatestHistory remains; no general reinforcement
law or objective reward escalation. No production model/source/allocation changes.
Counters1400/0. AuditREV45 advances only Brief12.9 clause6:96 bounded/23 partial/13 blocked.
Next TOLERANCE_READINESS.md; no physiological withdrawal or general addiction claim.
No owner ruling; Campaign3 NOT EXIT-READY.

Prior checkpoint: bounded dependence/substitution COMPLETE
(VER-C3-SUBSTITUTION-001, dependence-substitutes-component/0.2-candidate):5 models/
29 runs/261 exact component prefixes;15 scoped/328 reference tests and build pass.
Start docs/planning/CURRENT.md and CAMPAIGN3_SUBSTITUTION_QUALIFICATION.md.
Equal training success with different repertoire supports actual learned substitution.
ExpectationOnly explains primary behavior; history effects after zero correction are
candidate-only under NoActiveReasons. Preserve HABIT neutral-choice policy and both
failed development cohorts (assumed chosen idle; three-option contract violation).
Counters1400/0; no allocation or public scheduler admission. AuditREV44 advances only
Brief12.9 clauses4/5:95 bounded/23 partial/14 blocked. No physiological withdrawal or
whole addiction claim. Next REINFORCEMENT_ESCALATION_READINESS.md. No owner ruling;
Campaign3 NOT EXIT-READY.

Prior checkpoint: bounded habit acquisition COMPLETE
(VER-C3-HABIT-ACQUIRE-001):12 existing HABIT models/23 replayed runs/291 exact prefixes;
all original result rows unchanged. No new model/run/production code/allocation.
Start docs/planning/CURRENT.md and CAMPAIGN3_HABIT_ACQUISITION_QUALIFICATION.md.
Admitted practice produces actual free cue response after expectation correction.
Preserve HABIT_ACQUISITION_AUDIT_FINDING_REV1.json: absent legacy RunIdentity field
caused wrapper assertion failure; no old commitment or result was rewritten.
Counters1400/0. AuditREV43 advances only Brief12.9 clause1:93 bounded/23 partial/16 blocked.
Next DEPENDENCE_SUBSTITUTES_READINESS.md; no general automaticity or addiction claim.
No owner ruling; Campaign3 NOT EXIT-READY.

Prior checkpoint: bounded habit resistance COMPLETE
(VER-C3-HABIT-RESIST-001):7 existing CONTROL models/17 replayed runs/142 prefixes,
all frozen hashes unchanged; no new model, run, production code or allocation.
Start docs/planning/CURRENT.md and CAMPAIGN3_HABIT_RESISTANCE_QUALIFICATION.md.
Acquired history survives inhibition and goal retirement exposes it again. Counters1400/0.
AuditREV42 advances only Brief12.9 clause3:92 bounded/24 partial/16 blocked.
Next HABIT_ACQUISITION_COVERAGE_READINESS.md; no addiction or general control law.
No owner ruling. Campaign3 remains NOT EXIT-READY.

Prior checkpoint: bounded temporal goal conflict COMPLETE
(VER-C3-TEMPORAL-001, temporal-goal-conflict-component/0.1-candidate):4 models/
27 distinct runs/243 exact component prefixes;16 new/328 reference tests/build.
Counters1400/0, no allocation. Start CURRENT.md and CAMPAIGN3_TEMPORAL_QUALIFICATION.md.
Independent adopted goals retain reasons/progress/lifecycle after actual contest;
losing goal can be pursued later. NoTemporalBias retained. DropLoser/SharedRetirement
fail the primary witness and coincide there. Component scope, no new public scheduler.
AuditREV41:91 bounded/24 partial/17 blocked. All eight prospection clauses have separate
bounded witnesses, not joint integration. Next HABIT_RESISTANCE_READINESS.md: audit
existing CONTROL/HABIT/FATIGUE evidence before adding machinery. No owner ruling;
Campaign3 NOT EXIT-READY.

Prior checkpoint: bounded intention forgetting COMPLETE
(VER-C3-INTENTION-001, intention-forgetting-component/0.1-candidate):3 models/
54 distinct runs/486 component prefixes;15 new/328 reference tests and build passed.
Counters1400/0, no new allocation. Start CURRENT.md and CAMPAIGN3_INTENTION_QUALIFICATION.md.
Retained future-action instruction versus access versus actual loss stays separate
from goal adoption/cancellation/expiry and execution. NoLoss/PersistentAccess retained.
Preserve zero-score recall and superseded identity-binding findings. Component scope,
not new public scheduler/source/save admission. AuditREV40:90 bounded/24 partial/
18 blocked clauses. Its then-next temporal goal intake is qualified above. No owner ruling;
Campaign3 NOT EXIT-READY.

Prior checkpoint: bounded delayed gratification COMPLETE
(VER-C3-DELAYED-001, delayed-public/0.1-candidate):3 models/26 distinct public runs/
234 prefixes;27 new/328 reference tests and build passed. Counters1400/0.
Start CURRENT.md and CAMPAIGN3_DELAYED_QUALIFICATION.md. Prediction, anticipation,
actual same-benefit now/later choice, waiting, world delivery and learned receipt
remain separate. Hyperbolic/NoDiscount/Exponential remain candidates. Missing receipt
is not known zero; repeated ticket adds no evidence. Preserve schema rejection.
AuditREV39:89 bounded/25 partial/18 blocked clauses;132 clauses/15 families.
No universal temporal law, learned forecast trust, general planner or new Need.
Its then-next intention forgetting intake is qualified above. No owner ruling; Campaign3 NOT EXIT-READY.
The following cumulative entries are preserved earlier checkpoints; CURRENT.md wins
on routing and current counters.

Prior CAMPAIGN3_PROCRASTINATION_QUALIFICATION.md. Bounded retained-goal postponement COMPLETE
(VER-C3-PROCRASTINATION-001, procrastination-public/0.2-candidate):4 models/20 runs/
180 prefixes;26 new/328 reference tests and build passed. Positive work reasons
persist during actual defer choice with an accessible feasible goal. NoTemporalBias/
PresentFocused/NoImmediateMotive retained. Preserve0.1 cohort and late-adoption failure;
0.2 admits adoption only before deadline6. Future availability is not sufficient
completion capacity. No universal discount, clinical or optimal scheduling law.
Its then-next delayed gratification intake is qualified above. Prior
CAMPAIGN3_FATIGUE_QUALIFICATION.md. Bounded experienced fatigue COMPLETE
(VER-C3-FATIGUE-001, fatigue-public/0.1-candidate):4 models/20 distinct runs/180 prefixes;
25 new/328 reference tests and build passed. Physical condition, admitted experience,
workload, goal/habit and actual control/motor execution stay separate.
NoFatigue/MotorOnly/AnyFatigue retained. No endogenous fatigue or universal law.
All nine Brief12.6 clauses have separate bounded witnesses, not joint integration.
Its then-next procrastination intake is qualified above. Prior
CAMPAIGN3_RUMINATION_QUALIFICATION.md. Bounded recurrent concern COMPLETE
(VER-C3-RUMINATION-001, rumination-public/0.1-candidate):4 models/22 distinct runs/
198 distinct prefixes;25 new/328 reference tests and build passed.23 executions/
207 checks include one preserved duplicate, excluded from unique coverage.
Earlier unresolved content consumes cognition and changes actual inhibition;
interruption/rebound and admitted resolution never manufacture evidence.
NoRecurrence/StaticLoad/Alternating retained. No universal recurrence or fatigue law.
Its then-next fatigue intake is qualified above. Prior
CAMPAIGN3_PERFORMANCE_QUALIFICATION.md. Bounded performance monitoring COMPLETE
(VER-C3-PERFORMANCE-001, performance-public/0.1-candidate):4 models/22 runs/198 prefixes;
19 new/328 reference tests and build passed. Own admitted performance changes later
ordinary strategy at fixed goal/availability and reaches actual attempt/execution.
Visit-local counts, false/denied feedback and OutcomeBlind/AnyFailure controls remain.
No general threshold or causal superiority claim; preserve PERFORMANCE_IMPLEMENTATION_FINDINGS.md.
Its then-next rumination intake is qualified above. Prior
CAMPAIGN3_GRIEF_QUALIFICATION.md. Bounded grief after believed loss COMPLETE
(VER-C3-GRIEF-001, grief-public/0.1-candidate):7 models/31 runs/279 prefixes;
27 new/328 reference tests and build passed. Acquired history, absence, fallible
future-contact belief, practical utility and loss/reunion orientation remain separate.
False corrections preserve prior judgments. Prospective responses only; no universal
grief law or enacted mourning. All ten relationship clauses have separate bounded
witnesses, not joint integration. Its then-next performance intake is qualified above. Prior
CAMPAIGN3_BETRAYAL_QUALIFICATION.md. Bounded betrayal versus failed commitment COMPLETE
(VER-C3-BETRAYAL-001, betrayal-public/0.1-candidate):6 models/32 runs/288 prefixes;
27 new/328 reference tests and build passed. Prior admitted promise, observed failure,
incident intent/control and present willingness remain separate. False explanations
can change appraisal without rewriting history or automatically restoring cooperation.
Prospective response only; no general moral law or enacted response.
Its then-next grief intake is qualified above. Prior
CAMPAIGN3_ATTACHMENT_QUALIFICATION.md. Bounded perceived-dependence attachment COMPLETE
(VER-C3-ATTACHMENT-001, attachment-public/0.1-candidate):6 models/25 runs/200 prefixes;
23 new/328 reference tests and build passed. Own history, expected relief, current
utility and missing-contact appraisal remain separate. EXP-001 controls preserved.
Prospective reconnection only; no universal attachment law, enacted search or grief.
Its then-next betrayal intake is qualified above. Prior
CAMPAIGN3_FAMILIAR_VALENCE_QUALIFICATION.md. Bounded familiarity without liking COMPLETE
(VER-C3-FAMILIAR-VALENCE-001, familiar-valence-public/0.1-candidate):7 models/27 runs/
216 prefixes;23 new/328 reference tests and build passed. Feature familiarity and
signed own-outcome appraisal remain independent. Familiarity transfers neither
identity nor another target history. Prospective contact only, no attachment claim.
Its then-next attachment intake is qualified above. Prior
CAMPAIGN3_RELIANCE_HISTORY_QUALIFICATION.md. Bounded reliance history COMPLETE
(VER-C3-RELIANCE-001, reliance-history-experiment/0.1-candidate):6 reused models/
22 runs/176 prefixes;7 new/328 reference tests and build passed. No new allocation,
model or production law. Own commitment outcomes change prospective entrust distributions;
unknown/mixed/negative evidence stay distinct. No enacted delegation claim.
Its then-next familiarity/valence intake is qualified above. Prior
CAMPAIGN3_REL_ATTRIBUTION_QUALIFICATION.md. Bounded relationship attribution COMPLETE
(VER-C3-REL-ATTRIBUTION-001, rel-attribution-public/0.1-candidate):6 models/25 runs/
225 prefixes;23 new/328 reference tests and build passed. Event-linked evidence
revises current caution while preserving harm, historical judgment and current
willingness. Prospective distributions only; no enacted behavior or repair claim.
Its then-next reliance intake is qualified above. Prior
CAMPAIGN3_REL_DIMENSIONS_QUALIFICATION.md. Bounded relationship dimensions COMPLETE
(VER-C3-REL-DIMENSIONS-001, rel-dimensions-public/0.1-candidate):6 models/23 runs/
161 prefixes;23 new/328 reference tests. Affection/respect/trust/comfort proxies have
independent evidence and selective inherited reason/dice response-distribution effects.
No sampled/executed behavior claim. Preserve REL_DIMENSIONS_IMPLEMENTATION_FINDINGS.md
and REL_DIMENSIONS_PRESERVATION_REV1.json for initial test-assumption failures.
Its then-next attribution intake is qualified above. Prior
CAMPAIGN3_HEARSAY_QUALIFICATION.md. Bounded hearsay/direct evidence COMPLETE
(VER-C3-HEARSAY-001, hearsay-public/0.1-candidate):5 models/23 runs/138 prefixes;
23 new/328 reference tests. Named testimony/direct evidence remain separate; visible
ticket deduplication, sincere mistake and later direct revision are bounded. Preserve
HEARSAY_IMPLEMENTATION_FINDINGS.md: direct evidence can be wrong; no learned trust,
independent corroboration or new chosen speech policy.
Its then-next relationship-dimensions intake is qualified above. Prior
CAMPAIGN3_PERSON_GOAL_QUALIFICATION.md. Bounded person-goal inference COMPLETE
(VER-C3-PERSON-GOAL-001, person-goal-public/0.1-candidate):5 models/21 runs/126
prefixes;24 new/328 reference tests. Adopted goal, ordinary plan, attempted motion,
achieved outcome, evidence and inferred desired state remain separate. Preserve
PERSON_GOAL_IMPLEMENTATION_FINDINGS.md: known catalogue and correlated action/outcome
factors do not qualify calibrated inverse planning. No observer-action claim.
Its then-next hearsay intake is qualified above. Prior
CAMPAIGN3_FEAR_GUILT_QUALIFICATION.md. Bounded fear/guilt attribution COMPLETE
(VER-C3-FEAR-GUILT-001, fear-guilt-public/0.1-candidate):5 models/19 runs/95 prefixes;
21 new/328 reference tests. Private appraisal, produced nervousness, safe evidence,
attributed wrongdoing and goal-relative appraisal remain separate. Weights are candidate
controls, not calibrated probabilities; no downstream action or moral identity claim.
Its then-next person-goal intake is qualified above. Prior
CAMPAIGN3_PERSONSTATE_QUALIFICATION.md. Corrected bounded disposition/current-intent
dissociation COMPLETE (VER-C3-PERSONSTATE-001, personstate-public/0.2-candidate):
8 models,28 runs,168 prefixes;35 new/328 reference tests. Appraisal130 follows
actual intent70 and precedes conduct learning140. Preserve personstate-rev1 and
PERSONSTATE_DEVELOPMENT_FINDINGS.md: the first cohort appraised before intent and
the first fixture lacked later observation after hidden changes. Default policy is
a research control, not earned personality; no downstream observer action claim.
Its then-next fear/guilt intake is qualified above. Prior
CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md. Bounded target-belief attribution COMPLETE
(VER-C3-ATTRIBUTED-001):6 models,30 runs,120 prefixes;34 new/328 reference tests.
Own belief, target actual belief and observer-attributed belief remain separate; actual
communication choice consumes attribution. Successful receipt does not automatically
update the speaker. Preserve ATTRIBUTED_DEVELOPMENT_FINDINGS.md and archived cohorts.
Its then-next PERSON_STATE_DISSOCIATION_READINESS.md intake is qualified above;
that attributed profile makes no general mentalizing or trust claim.
Prior CAMPAIGN3_INTERPRETATION_QUALIFICATION.md. Bounded misunderstood explanation COMPLETE
(VER-C3-INTERPRET-001):8 models,29 runs,116 prefixes;33 new/328 reference tests.
Intended assertion, received glyph/context, interpretation and recipient belief remain
separate. Fixed conventions are controls, not learned vocabulary. Its then-next
ATTRIBUTED_KNOWLEDGE_READINESS.md intake is now qualified above; that interpretation
profile makes no general language or listener mentalizing claim.
Prior CAMPAIGN3_EMOTIONAL_DISPLAY_QUALIFICATION.md. Bounded private distress/leakage COMPLETE
(VER-C3-DISPLAY-001):10 models,32 runs,160 prefixes;32 new/328 reference tests.
Private SplitExposure affect, chosen assertion, produced cue and recipient-owned learning
remain separate. Graded/threshold display rules remain competitors. Preserve the
confounded calm fixture and helper/timeout receipts; final likelihood-only comparison
holds control evidence fixed. No physiological/learned display or trust/fusion claim.
Prior CAMPAIGN3_LYING_QUALIFICATION.md bounded deliberate/failed lying COMPLETE
(VER-C3-LYING-001):8 models,30 runs,143 prefixes;31 new/328 reference tests.
Speaker belief/purpose, intended assertion, delivery and recipient belief remain separate.
A lie can accidentally be true; execution failure, denied receipt, NoLearning and prior
history can defeat its target belief. Whole later safe views and contested draws replay.
Prior CAMPAIGN3_COMMUNICATION_QUALIFICATION.md bounded chosen disclosure/concealment
COMPLETE (VER-C3-COMM-001):8 models,27 runs,130 prefixes;31 new/328 reference tests.
Actual reasons/dice, intent, expression, delivery and recipient-owned learning remain
separate; balanced choice draws replay exactly. Serial execution packaging is preserved;
successor completes all cases in four workers. That prior COMM scope makes no deliberate lying claim. Bounded feature familiarity COMPLETE
(VER-C3-FAMILIAR-001):5 models,24 runs,94 prefixes;16 new/328 reference tests.
Surviving signatures support familiarity after detail loss and familiar-but-different
comparison; no instance identity, reward or downstream action claim. Bounded routine recollection COMPLETE
(VER-C3-RECOLLECT-001):5 models,20 runs,159 prefixes;15 new/328 reference tests.
Original observation, surviving fragment, category summary and reconstructed recall
remain distinct. Type annotation build failure/source are preserved; REV2 public
results match REV1 exactly. No general recognition claim. Bounded instructed reappraisal COMPLETE
(VER-C3-REAPPRAISAL-001):5 models,20 runs,103 prefixes;15 new/328 reference tests.
It changes a hypothetical conditional frame, preserving learned belief and evidence;
no physical protection or downstream action claim. Bounded report-supported correction
COMPLETE (VER-C3-INFER-001):5 reused models,15 runs,120 prefixes;7 new/328 reference
tests; no new allocation or model identity. Bounded public CONTROL COMPLETE
(VER-C3-CONTROL-001, control-public/0.2-candidate):7 models,17 runs,142 prefixes;
22 affected/328 reference tests. Bounded public goal/strategy COMPLETE
(VER-C3-GOAL-001):4 models,19 runs,94 prefixes;26 affected/328 reference tests. Corrected bounded agency/interference COMPLETE
(VER-C3-AGENCY-001, agency-public/0.3-candidate):5 models,19 public runs,71 exact
prefix continuations (52 advancing/19 terminal),38 agency and328 reference tests.
Counters1400/0;1 active/19 conditional/1 closed/0 unowned obligations. Corpus0.29.0
remains21 members with18 bounded/3 prior/0 partial/0 blocked member scopes; all15
Brief families and132 clauses remain in the denominator (101 bounded/22 partial/9
blocked clauses). Whole Campaign3 remains NOT EXIT-READY. AuditREV45 adds bounded reinforcement feedback clause6; REV44 added bounded dependence/substitution clauses4/5; REV43 added bounded habit acquisition clause1; REV42 added bounded habit resistance clause3; REV41 added bounded temporal goal conflict clause8; REV40 added bounded intention forgetting clause7; REV39 added bounded delayed gratification clause6; REV38 added bounded procrastination clause5; REV37 added bounded fatigue clause7; REV36 added bounded rumination clause6; REV35 added bounded monitoring clause5; REV34 added bounded grief clause8; REV33 added bounded betrayal clause6; REV32 added bounded attachment clause5; REV31 added bounded familiarity-without-liking clause4; REV30 added bounded reliance-history clause9; REV29 added bounded relationship attribution clause7; REV28 added bounded relationship-dimension clauses1/2/3; REV27 added bounded hearsay/direct clause8; REV26 added bounded person-goal clause4; REV25 added bounded fear/guilt clause3; REV24 added bounded disposition/current-intent clauses1/2; REV23 added bounded target-belief clauses5/6; REV22 added misunderstood explanation clause7; REV21 added bounded distress/leakage clauses5/6; REV20 added bounded lying clauses3/4; REV19 added chosen communication clauses1/2; REV18 added bounded familiarity clauses6/7; REV17 added bounded memory clauses3/8; REV16 added bounded reappraisal clause8; REV15 added inference correction clauses5/9; REV14 added CONTROL clauses3/4; REV13 added bounded goal/strategy clauses1/3/4; REV12 superseded the
first drafted agency coverage after correction; no owner ruling is pending.
The first agency cohort missed later nonrecipient occurrence leakage. Preserve
AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json and agency-rev1/PRESERVATION.json.
Fixed empty source/observer reservations pass the expanded comparison. The second
cohort also inherited intent/expression co-location at80 despite required intent70;
0.3 separates them and verifies actual trace phases. Preserve agency-rev2 and
AGENCY_PHASE_FAILURE_REV1.json. Final closure receipt is AGENCY_CLOSURE_REV2.json.
Equal belief
values alone do not prove observer-safe public provenance. RO-C3-014/020 retain that
receiving-horizon obligation. Repeated-interference cross-episode expectation,
coercion, blame, efficacy and general recognition remain outside bounded closure.
RO-C3-019 broader Brief coverage stays ACTIVE. Goal/strategy separates adopted desired state, mutable plan and admitted evidence.
CONTROL retains habit during inhibition and exposes it after goal retirement.
Preserve CONTROL_IMPLEMENTATION_FINDINGS.md and its failed schema cohort.
Report-supported event-local correction is now bounded-qualified; general causal
discovery, alternative diagnosis and calibrated trust remain unresolved.
Next: habit resistance under HABIT_RESISTANCE_READINESS.md; audit existing public
CONTROL/HABIT/FATIGUE evidence before adding new machinery.
Remaining memory clauses stay in the denominator. CAMPAIGN3_BRIEF_FRONTIER_INTAKE.md is a dated REV9
snapshot, not current qualification counts. Prior BODY/BIO/COMMIT closures stand;
RO-C3-018 is closed,008/009 broader scope conditional. RO-C3-021 final historical
reconciliation remains unsatisfied and mandatory before exit. No state root or
architectural distinction is retired. LONG's actual-competence inspection remains
a research diagnostic, not character evidence.
`GENERAL_ATTENTION_RESUME_BRIEF.md`
preserves the completed pass's instructions. `CAMPAIGN3_ENTRY_READINESS.md`
preserves the dated entry audit with current routing; the seam ledger labels its
current bounded coverage separately from historical summaries. Missing phenomena are BLOCKED
or PARTIAL, not passed by Campaign2 completion. ATTN-001 and EMB-001 own newly explicit
debts. PHEN-BIO-001 means biography and keeps its immutable ID. Corpus `0.29.0` has
21 members; PHEN-ATTN-001 1.1.0 adds the qualified bounded GA fixture, preserving
the other twenty members. Corpus0.28.0's eleven additions entered as three PARTIAL
and eight BLOCKED. Membership is not qualification. Broad source/feedback extensions still
require accepted contracts; do not implement them from the external review alone.
`CAMPAIGN3_BODY_RESEARCH_FRONTIER.md` opened that investigation and its BODY scope is
now bounded-qualified; the work order above supersedes it as the current entry point.
Missing coverage blocks affected verdicts, not all bounded research.

Preserved Campaign 2 checkpoint (2026-09-09): Campaign 2 is complete in the bounded thin-scaffold
scope of `docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md`. The cognitive pipeline and
complete-prefix RNG persistence are qualified under their exact frozen versions.
Campaign 3's expanded corpus is now admitted, not already passed. The Campaign 1 narrative
below is historical; current seam/decision dispositions are in the formal register
and the latest planning receipts. Preserve their public/component limits and all
unresolved broader decisions. Do not restart old Campaign 1 or Phase 3 plans.

CharacterLab is undergoing a ground-zero architectural refoundation.

The active implementation belongs in `src/`. It begins only after the relevant deterministic substrate and seam contracts exist. The first implementation target is the North-Star Reference Scaffold: a thin, deterministic, end-to-end causal topology whose candidate distinctions can be ablated, substituted, merged, derived, compressed, or retracted.

Campaign 0 passed on 2026-09-01. Its immutable candidate-era identifiers remain accepted contracts. Campaign 1 is active. Exact bounded measurement under `observation/0.1-candidate` passed its vectors and closed `MATH-006`, but its concept-token path is only a restricted identity-establishing-channel control. Amended `SEM-001A` is accepted: `PerceptualReferentId` is an observer-relative continuant-file for perceived people, discrete objects, places, or spatial regions; continuity may be objectively wrong, allocation is independent per observer, and ordinals are opaque. `SEM-001B` and `CV-SEM-023..030` fix truth binding occurrences, governed roles, event-specific cardinality/narrowing, and role-evidence precision. `SEM-001C` and `CV-SEM-031..040` fix separate fallible event-files and event-grouped perceived bindings. `SEM-001D` and `CV-SEM-041..050` fix six independent continuant appearance facets, optional exact booleans, feature missing/false, sole facet authority, provenance, rollback, and output boundaries. Accepted `SEM-001E` and `CV-SEM-051..060` fix separate event-pattern facets, scoped typed event-feature evidence, a definitionally necessary rope-skipping-pattern conjunction, sole facet authority, append-only historical classification, typed Action-role projection asymmetry, and replacement of historical direct truth-action projection. Accepted `SEM-001F` and `CV-SEM-061..070` fix observer-owned recognition candidates, mapped identity claims, typed cues, exact unique-uncontradicted support, immutable evaluations, append-only assert/replace/withdraw resolution chains, false-tracking preservation, and recognition output boundaries. Accepted `SEM-001G` and `CV-SEM-071..080` fix closed schema/version-admitted character evidence references, consumer-specific typed `ReadDomain` admissibility, same-observer safe linkability, occurrence opacity, separate omniscient/character provenance graphs, proposition-local future evidence quality, and nonrecursive multi-role character-relative causal-role evidence. Accepted `SEM-001H` and `CV-SEM-081..090` fix strict current/consequence truth cutoffs, conditional bijective experience reservation, immutable experience/recognition-input staging, canonical independent classification, perceived-outcome learning, adaptation separation, `ORD-001` isolation, and exact two-lane phases under `ordering-phases/2-candidate`, with phase 150 non-schedulable. Accepted `SEM-001I.1` fixes the canonical schema inventory, including exact occurrence keys, recognition-knowledge character-state ownership, trace-only recognition evaluations, self-sufficient resolution state, typed occurrence allocation, revision-topology history, and explicit transition result identities. Accepted `SEM-001I.2` freezes record types `210..259`, the reviewed typed-ID namespaces and occurrence namespaces through `1115`, finite values, and manifest-governed union layouts; namespace `1004` remains genuinely available and absent from the registry. Perceived event pattern remains distinct from learned action-schema recognition. The parent `SEM-001` remains the P0 blocker: `SEM-001I.3` codecs/persistence proof and the `SEM-001J` integrated gate remain unresolved. Implement the permanent allocation only through its accepted table; do not implement downstream learning until the parent closes. Visibility never implies recognition; classification, tracking, recognition, and appraisal remain separate; truth handles and unobserved truth facets stay trace-side. `ONT-001` owns later ontology/inheritance/affordance semantics.

Do not automatically resume the former Phase 3A → 3B → 3C plan.

## Historical implementation boundary

The complete pre-refoundation implementation is preserved under `reference/src/`.

- Treat `reference/` as read-only historical evidence and a source of control implementations.
- Do not import any module from `reference/` into `src/`.
- Do not copy a historical mechanism into `src/` merely because it already exists.
- Reuse requires an explicit architectural reason and must preserve the new seam contract rather than the historical module shape.
- Do not modify `reference/` unless the task explicitly concerns historical reproducibility or a reference-only correction.
- Run `npm run test:reference` when validating the preserved implementation.

Git history and `reference/` preserve the past. New work must not make the historical tree canonical by accident.

## Fresh-source rules

- `npm test` targets only tests under the new `src/` tree.
- No character-model primitive is authoritative merely because it existed before refoundation.
- Keep truth, evidence, memory, recognition, belief, appraisal, affect, motivation, reasons, decision, intent, expression, execution, and consolidation separately traceable until experiments earn a reduction.
- Prefer explicit competing implementations over compatibility flags threaded through the historical model.
- Record reduction verdicts with their tested phenomenon corpus.
- Treat `../vivarium/Docs/CharacterLabMathematicalReference.md` as a formula inventory, not authority. Import only through the formula-intake ledger and a versioned formal seam contract.
- Preserve the Phase 2.9–2.97 unresolved-Decision dice grammar and reinforcing identity loop as mandatory initial reference implementations and controls. Port them through new seam contracts; do not omit, replace with opaque weighted randomness, or discard their regression experiments without an explicit reduction experiment and verdict.
- Before designing or implementing any seam, consult `docs/planning/REFERENCE_MECHANISM_LEDGER.md`. Every applicable historical mechanism or finding must receive an explicit port, control, corpus, candidate, supersession, or retirement decision. Do not silently drop it merely because active source started clean.
