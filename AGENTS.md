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

Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_GRIEF_QUALIFICATION.md. Bounded grief after believed loss COMPLETE
(VER-C3-GRIEF-001, grief-public/0.1-candidate):7 models/31 runs/279 prefixes;
27 new/328 reference tests and build passed. Acquired history, absence, fallible
future-contact belief, practical utility and loss/reunion orientation remain separate.
False corrections preserve prior judgments. Prospective responses only; no universal
grief law or enacted mourning. All ten relationship clauses have separate bounded
witnesses, not joint integration. Next PERFORMANCE_MONITORING_READINESS.md. Prior
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
Counters1291/0;1 active/19 conditional/1 closed/0 unowned obligations. Corpus0.29.0
remains21 members with18 bounded/3 prior/0 partial/0 blocked member scopes; all15
Brief families and132 clauses remain in the denominator (84 bounded/25 partial/23
blocked clauses). Whole Campaign3 remains NOT EXIT-READY. AuditREV34 adds bounded grief clause8; REV33 added bounded betrayal clause6; REV32 added bounded attachment clause5; REV31 added bounded familiarity-without-liking clause4; REV30 added bounded reliance-history clause9; REV29 added bounded relationship attribution clause7; REV28 added bounded relationship-dimension clauses1/2/3; REV27 added bounded hearsay/direct clause8; REV26 added bounded person-goal clause4; REV25 added bounded fear/guilt clause3; REV24 added bounded disposition/current-intent clauses1/2; REV23 added bounded target-belief clauses5/6; REV22 added misunderstood explanation clause7; REV21 added bounded distress/leakage clauses5/6; REV20 added bounded lying clauses3/4; REV19 added chosen communication clauses1/2; REV18 added bounded familiarity clauses6/7; REV17 added bounded memory clauses3/8; REV16 added bounded reappraisal clause8; REV15 added inference correction clauses5/9; REV14 added CONTROL clauses3/4; REV13 added bounded goal/strategy clauses1/3/4; REV12 superseded the
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
Next: performance monitoring under PERFORMANCE_MONITORING_READINESS.md; preserve
admitted own-performance feedback, monitored discrepancy, goal and later strategy.
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
