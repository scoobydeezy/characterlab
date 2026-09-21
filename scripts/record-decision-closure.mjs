// Single use. No closure records may be written until the evidence checker passes.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-decision-closure.mjs'],{stdio:'inherit'});
const p='docs/planning/',read=f=>fs.readFileSync(f,'utf8'),verdict='VER-C3-DECISION-001',report=p+'CAMPAIGN3_DECISION_QUALIFICATION.md';assert(!read(p+'VERDICT_LEDGER.md').includes('## `'+verdict+'`'));
fs.writeFileSync(report,`# Public DECISION checkpoint —2026-09-21

**Disposition: QUALIFIED / LOCAL DISPOSITION. Bounded DECISION COMPLETE.**
**Stage: E, verdict VER-C3-DECISION-001. Owner decision pending: no.**
Implements decision-public/0.1-candidate,930..951/schema1,namespace1161.

| Counter | Value |
|---|---|
| Highest allocated record type |951|
| Allocated since this verdict |0 (22 this increment)|

## What changed
PHEN-DECISION-001/1.0.0-draft now has the exact three-regime public comparison,
including all five required alternatives and a post-attempt historical horizon.
Six frozen models share controlled two-task grounds and admitted contextual
observations. Current10/14 SEM supports the actual Situation evidence; raw51 and
reasons52 compile complete independent distributions. Choice60 precedes intent70,
expression80,plan90,attempt100 and execution110. Admitted consequence120/124 enters
the sole historical writer140. All13 stages execute in the public scheduler.

The two commitment grounds each contribute1/10 raw base. Current context supplies
0 or3 Situation strength, compiling to d4 or d4+3 under the retained bounded
transform and unit1/4. Thresholds are thetaRoll1/2 and thetaPlayer3/4. No standing
state, identity update, unknown future outcome or hidden random word is a reason.
The world adapter alone receives permission after intent; the history consumer
receives admitted outcome evidence, never that permission or the world outcome.

## Exact findings and comparison models

| Regime | Exact probabilities | Contest / stake / authorship | Baseline |
|---|---|---|---|
| d4+3 versus d4 |31/32,1/32|1/16;5/7;5/112|Auto, no draw|
| d4 versus d4 |1/2,1/2|1;5/7;5/7|QuietRoll|
| d4+3 versus d4+3 |1/2,1/2|1;11/13;11/13|PlayerFacingRoll|

Low/high significance has identical authoritative draw transcripts and selected
options at each registered seed. Player presentation projects actual reason faces
and contributions from that same decision; it draws nothing again. Baseline intent
and frozen expression are byte-identical across allowed/prevented execution.
Actual outcomes and admitted consequence observations differ. Historical expression
survives either outcome, and later decisions do not recompute old entries.

AlwaysRoll draws in the settled regime. NeverRoll suppresses the unresolved roll.
DecorativeDice consumes exactly the baseline reason/tie transcript but chooses the
analytical leader, yielding witnessed disagreements. OpaqueWeightedChoice samples
the correct1/2 marginal with one addressed draw but has no independent reason-face
presentation. IntentEqualsOutcome is the historical-collapse control: it omits the
historical expression after admitted failure while retaining the observed outcome.
Prospective intent still drives its attempt; diagnostic records remain preserved.
This isolates the historical intent/outcome distinction without giving the control
access to hidden execution truth.

No model can use a raw RNG word as character evidence. A closed character projection
retains sources, reasons, analytical quantities, selected intent and safe history;
it excludes original hidden inputs, raw draw records, world outcomes and player
presentation. The raw research trace/save is explicitly not that character view.
Hidden scalar changes preserve all psychological outputs/state. With consequence
visibility removed, allowed/prevented worlds yield identical character views and
history, including in the historical-collapse comparator. Missing current evidence
is retained as absence, distinct from an observed zero even where the choice agrees.

## Evidence and preservation
DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json was frozen before public execution.
The6 models/24 image files are in campaign3-decision-model-rev1. The experiment
records174 public runs and360 exact whole-prefix restores/next continuations:
186 advancing and174 terminal. The main matrix is three regimes, four seeds and
two execution permissions per model. Hidden, unavailable-current, two invisible
consequence cases and three-instant continued history complete the29 cases/model.
Committed RNG addresses are serialized and rebuilt through replay; exact whole-save
comparison includes the queue, allocations, trace, state and output projections.

72 affected tests and328 historical reference tests pass. The affected set includes
22 public DECISION tests, the component comparisons, inherited cognitive math and
arbitration, and joined REASON. All13 reached stages plus final commit have injected
rollback checks after existing history. Foreign codecs, authored initial state,
changed recipes, unrelated history writers, modified originals and edited RNG
ledgers reject. TypeScript and production build pass; reference boundaries hold.
Prior LEARN/EPI/REASON closure integrity checks pass unchanged. No full active-suite
rerun is claimed. DECISION_VALIDATION_CLOSURE_REV1.json binds final source and receipts.

DECISION_IMPLEMENTATION_FINDINGS.md preserves the earlier component tie-extraction
mistake and the public rollback-test mistake. Public REV1 passed8/22:14 rollback
tests incorrectly tried to create continuation saves after failure, which the
substrate correctly refused. The corrected tests inspect the diagnostic committed
ledger and require failed-save rejection; public REV2 passes22/22. No model or
contract correction was needed. All failed receipts remain intact.

## Scope, North Star transfer and obligations
A settled choice needs no roll. An unresolved choice can require genuine stochastic
resolution, and significance can change its presentation without replacing that
authoritative resolution. An attempted action may fail while the choice and its
contextual meaning remain part of the character's history. Available reasons,
resolution, presentation, intent, execution and admitted consequence remain distinct.

This qualifies the bounded three-regime corpus member, not all decision theory.
Significance remains a reason-mass proxy. Multi-option conflicts, broader importance,
uncertainty/control dissociation, alternative dice grammars and general weighted
sampling remain open. OpaqueWeightedChoice is exact on the registered balanced
unresolved domain only. The finite append-only history is not a general memory,
retrieval or identity-learning law, and controlled context is not general perception
or causal attribution. No architecture box is deleted and no universal law selected.

RO-C3-018 discharges bounded DECISION and retains COMMIT. RO-C3-020 conditionally
preserves significance/calibration/control/grammar/representation limits and the
failed-test findings. BODY ownership, BIO and broader Brief coverage remain active;
RO-C3-021 final historical reconciliation remains unsatisfied. Counts remain4 active,
17 conditional,0 unowned. Corpus0.29.0 membership and digest are unchanged.

Forward audit REV6 changes DECISION coverage to bounded-qualified:15 bounded,
3 accepted prior,3 partial,0 blocked. All15 Brief families stay in the denominator.
The revision-cap unchanged-disposition condition does not apply to this coverage
change. Whole Campaign3 remains NOT EXIT-READY. Next: exact joined COMMIT lifecycle,
strong fixed identity, retirement, recurrence identity and selective witness gates.
`,{flag:'wx'});
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Authoritative unresolved choice survives failed execution

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded DECISION COMPLETE.
- **Contract:**decision-public/0.1-candidate;930..951/schema1;namespace1161.
- **Corpus:**PHEN-DECISION-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_DECISION_QUALIFICATION.md;6 frozen models,174 public runs,
  360 exact prefix continuations;72 affected/328 reference tests.
- **Verdict:**RETAINED conditional authoritative arbitration, independent reason
  dice, separate player presentation, frozen intent/expression and post-attempt
  observation/history. AlwaysRoll, NeverRoll, DecorativeDice, OpaqueWeightedChoice
  and historical IntentEqualsOutcome each lose a required bounded obligation.
- **Limits:**two options, reason-mass significance, balanced opaque marginal;
  no universal grammar, significance, control/uncertainty or memory theory.
- **Obligations:**RO-C3-018 DECISION discharged, COMMIT remains; RO-C3-020 retains
  wider calibration/representation limits and preserved test failures.
- **Reopen:**significance changes authoritative math; more options; control versus
  uncertainty; another grammar meeting all requirements; wider history consumers.
- **Counters:**951/0 (22 allocated this increment). No owner ruling.
`);
const registry=JSON.parse(read(p+'RESEARCH_OBLIGATIONS.json')),ids=['RO-C3-018','RO-C3-020'];
for(const id of ids){const o=registry.obligations.find(o=>o.id===id);o.verdicts.push(verdict);o.evidence.push(report,p+'DECISION_IMPLEMENTATION_FINDINGS.md',p+'DECISION_PUBLIC_EXPERIMENT_REV1.json',p+'DECISION_VALIDATION_CLOSURE_REV1.json');}
const debt=registry.obligations.find(o=>o.id==='RO-C3-018');debt.established+=' VER-C3-DECISION-001 completes the exact public DECISION comparator and historical horizon:6 models/174 runs/360 prefix continuations.';debt.unresolved='Joined COMMIT clause-complete comparisons remain unqualified. Bounded LEARN/EPI/REASON/DECISION are complete; broader receiving and calibration laws remain RO-C3-001/020; whole BIO remains RO-C3-009.';debt.owner='COMMIT lifecycle/social owner for the remaining exact clauses';debt.closureRequirement='LEARN, bounded EPI, joined REASON and bounded DECISION are discharged by their C3 verdicts. Freeze and execute exact COMMIT comparisons including strong identity, retirement, recurrence and positive selective witnessing; preserve public/component distinctions.';
const limits=registry.obligations.find(o=>o.id==='RO-C3-020');limits.established+=' DECISION joins conditional dice, same-authoritative-roll presentation and observer-safe historical preservation, keeping both failed test receipts.';limits.unresolved+=' DECISION significance is a reason-mass proxy; multi-option metrics, control/uncertainty dissociation, alternative grammars, general weighted sampling and wider historical consumers remain unqualified.';
registry.verdictReviews.push({verdict,obligations:ids});registry.reportReviews.push({path:report,obligations:ids});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before public DECISION closure —2026-09-21\n\n'+read(p+'CURRENT.md'));
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded DECISION COMPLETE / QUALIFIED. Campaign3 remains NOT EXIT-READY.**
Start at [DECISION qualification](CAMPAIGN3_DECISION_QUALIFICATION.md),
VER-C3-DECISION-001 and [forward coverage register](CAMPAIGN3_EXIT_AUDIT_REV6.json).

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **951** |
| Allocated since last verdict/corpus member | **0** (22 this increment) |
| Research obligations | **4 active / 17 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 28 verdicts** |
| Coverage dispositions | **15 bounded / 3 accepted prior / 3 partial / 0 blocked** |
| Frozen models / public runs / prefix continuations | **6 / 174 / 360** |
| Affected / reference tests | **72 / 328** |

The three exact regimes and five named competitors execute through actual intent,
frozen expression, world outcome, admitted consequence and safe historical recording.
Low/high significance preserves the authoritative roll; prevention preserves intent.
Missing observations remain distinct from negative evidence. Failed tests survive.

RO-C3-018 retains COMMIT; BODY ownership, BIO and broader Brief coverage remain
active. RO-C3-020 preserves wider significance/grammar/control/calibration limits.
Final-history RO-C3-021 remains unsatisfied. No owner ruling or full-suite claim.

**Next:** exact joined COMMIT lifecycle/strong-identity/retirement/recurrence and
selective positive-witness matrix under the escalation policy. Corpus digest:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## Public DECISION port/control disposition —2026-09-21

VER-C3-DECISION-001 retains MEC-015 authoritative dice/arbitration, MEC-017 frozen
contextual expression, MEC-019 intent/attempt/outcome separation and MEC-022 exact
historical calibration. SUB-004/005/008/009 preserve addressed draws, exact finite
probabilities, rollback and whole-prefix replay. EXP-010 retains multiple independent
reasons and presentation of the actual authoritative draw. RET-013 stays prohibited:
later history does not rewrite earlier expressions. All five required alternatives
are public controls, including exact balanced opaque marginal sampling and historical
intent-equals-outcome. The broader identity loop remains the existing control, not
new DECISION learning. RO-C3-020 retains general significance/grammar/multi-option
limits; RO-C3-018 retains COMMIT. No reference edits or imports. Counters951/0.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\nVER-C3-DECISION-001 qualifies the bounded public successor and resets counters951/0.\n');
console.log('Recorded bounded public DECISION closure.');
