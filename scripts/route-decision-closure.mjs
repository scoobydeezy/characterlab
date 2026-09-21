// Run after recording the evidence-gated verdict; preserve all dated old receipts.
import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/';assert(fs.existsSync(p+'CAMPAIGN3_DECISION_QUALIFICATION.md'));
const read=f=>fs.readFileSync(f,'utf8');
let s=read('AGENTS.md'),start=s.indexOf('Campaign 3 is active: start at docs/planning/CURRENT.md and'),end=s.indexOf('No architecture distinction is deleted;',start);assert(start>=0&&end>start);
s=s.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_DECISION_QUALIFICATION.md. Bounded DECISION is COMPLETE
(VER-C3-DECISION-001):6 models,174 public runs,360 exact prefix continuations.
Counters951/0;4 active/17 conditional/0 unowned obligations. Current coverage is
15 bounded,3 prior,3 partial,0 blocked in unchanged21-member corpus0.29.0;
whole Campaign3 remains NOT EXIT-READY. All15 Brief families stay in the denominator.
RO-C3-018's bounded LEARN/EPI/REASON/DECISION debts are discharged; COMMIT remains
active, as do BODY ownership, BIO and broader family coverage. RO-C3-010 preserves
scalar inference limits, including repeated established-below-bound precision credit.
RO-C3-021 requires canonical historical reconciliation before final exit and does
not block admitted implementation. Next: exact joined COMMIT lifecycle, strong
fixed identity, retirement, new-ID recurrence and selective positive-witness matrix.
DECISION significance/grammar/control/multi-option limits remain RO-C3-020.
REASON source, direction and calibration limits remain RO-C3-001/020.
Additional EPI consumers/sources/horizons reopen under RO-C3-007.
`+s.slice(end);fs.writeFileSync('AGENTS.md',s);
const seam=p+'SEAM_LEDGER.md';s=read(seam);const historical=s.indexOf('## Historical checkpoint summaries through');assert(historical>0);
fs.writeFileSync(seam,`# Seam Ledger

**Current routing,2026-09-21:** [CURRENT](CURRENT.md), [DECISION qualification](CAMPAIGN3_DECISION_QUALIFICATION.md), [verdicts](VERDICT_LEDGER.md). Bounded DECISION and earlier qualified domains COMPLETE; whole Campaign3 NOT EXIT-READY. Corpus0.29.0 unchanged21 members. Counters951/0;4 active/17 conditional/0 unowned. Zero owner rulings.

VER-C3-DECISION-001 joins the three arbitration regimes, five named alternatives,
frozen intent/expression and admitted post-attempt history.6 models,174 runs,
360 exact prefix continuations. Component/public failed test receipts survive.
RO-C3-018 retains COMMIT; RO-C3-020 preserves general significance/grammar/control
and representation limits. Next: exact joined COMMIT lifecycle/identity/witness
matrix. REV6 records15 bounded/3 prior/3 partial/0 blocked. Final historical
reconciliation remains unsatisfied under RO-C3-021. Prior snapshots survive.

`+s.slice(historical));
const entry=p+'CAMPAIGN3_ENTRY_READINESS.md';s=read(entry);s=s.replace('forward REV5 register retains14 bounded','forward REV6 register retains15 bounded').replace('3 accepted prior scopes,4 partial members','3 accepted prior scopes,3 partial members').replace("Bounded LEARN/EPI/REASON are qualified by their C3 verdicts. Next: DECISION's exact\nalways/never/decorative/opaque comparator matrix. No owner decision is pending.","Bounded LEARN/EPI/REASON/DECISION are qualified by their C3 verdicts. Next: COMMIT's\njoined lifecycle/strong-identity/recurrence/selective-witness matrix. No owner decision is pending.");fs.writeFileSync(entry,s);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';s=read(campaign);const marker='Whole Campaign3 PASS remains unavailable until its full declared obligations are';assert(s.includes(marker));s=s.replace(marker,`Forward update2026-09-21: VER-C3-DECISION-001 qualifies the three exact arbitration
regimes and five named alternatives through intent, frozen expression, execution,
admitted consequence and historical recording:6 models,174 runs,360 prefix
continuations. See docs/planning/CAMPAIGN3_DECISION_QUALIFICATION.md and audit REV6:
15 bounded/3 prior/3 partial/0 blocked; counters951/0. Next COMMIT's exact joined
lifecycle/strong-identity/retirement/recurrence/selective-witness matrix. General
significance, grammar, control and historical reconciliation remain open.

`+marker);fs.writeFileSync(campaign,s);
console.log('Routed active documentation to bounded DECISION closure and COMMIT.');
