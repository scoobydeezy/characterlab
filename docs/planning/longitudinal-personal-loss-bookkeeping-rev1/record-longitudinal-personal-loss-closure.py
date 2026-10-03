"""One-time bookkeeping, only after the frozen personal-loss matrix passes."""
from pathlib import Path
import json
p=Path('docs/planning')
m=json.loads((p/'LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json').read_text())
assert m['status']=='COMPONENT MATRIX PASS' and m['runs']==480 and m['prefixes']==6240
assert not (p/'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md').exists()
def write(path,s): Path(path).write_text(s,encoding='utf-8',newline='\n')
different=lambda a,b: sum(x[a]!=x[b] for x in m['behavior'])
loss_changes=different('reported','noLoss')
ablation_changes=different('reported','noAffect')
motive_changes=different('reported','strong')
report=f'''# Longitudinal valued-contact loss qualification — 2026-10-03

**VER-C3-LONGITUDINAL-LOSS-001. QUALIFIED BOUNDED, component composition.**
Stages A–E. LOCAL DISPOSITION — no owner ruling required. Counters **1508 /0**.
Contract longitudinal-personal-loss-component/0.1-candidate. Authoritative frozen
LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json, MATRIX_REV1 and CLOSURE_REV1.

## Qualified phenomenon

The same LONG actor actually participates in two offered joint interactions, admits
their positive evidence into existing relationship history, and then maintains a goal
of continued contact. A later fallible report of lost future contact changes BELIEF,
goal-relative appraisal, and subsequent actual decisions. Physical contact availability
determines execution separately. Loss changes neither earlier positive relationship
history nor goal status. An explicit withdrawal is required to retire the goal.

This adds later sampled action/execution and correction across acquired personal loss
for Brief12.15-11. Earlier VER-C3-GRIEF-001 remains qualified under its own seven-model,
31-public-run scope: meaningful dependence, future-contact belief, loss/reunion/current
utility and prospective distributions. Its richer appraisal is not replaced or reduced.
The present component uses the existing RELATIONSHIP two-participation threshold with
an authored goal-adoption policy and existing AFFECT projections, not a new grief meter.
It is a bounded valued-contact-loss witness, not death, bereavement or clinical grief.

## Prospective evidence and execution

Five models cross12 conditions and all8 seeds: **480 fresh component trajectories**.
Latest, Mean, NoLearning, NoAffect and HistoricalProduct remain distinct candidates.
Conditions: ReportedLoss, HiddenLoss, NoLoss, FalseLoss, Corrected, Recovered,
OneInteraction, MaskedAcquisition, WithdrawnGoal, HighControl, FailedSupport and
StrongContinuity. ModelIdentity, RunIdentity, ExperimentIdentity and ComparisonCase
were frozen with contract, harness, tests, build receipt and transitive source hashes
before any qualification run. Initial relationship and belief are empty; no native
source archives or earlier trajectories are counted as fresh execution.

All **6240 complete original prefixes** restore exact canonical-text component saves:
5760 advancing successors and480 terminal checks. These are actual restore-function
calls, not hashes substituted for execution. Compressed full save archives and prefix
receipts preserve every case. Replay covers the immediate successor, not every tail.
Eight fault checks at acquisition, adoption, loss-report and correction boundaries
preserve all owners and reproduce the successor after retry. Ten focused tests verify
publication/overlap guards, changed-profile rejection, caller isolation and causal
controls. All328 reference tests and a fresh complete build passed. No failed development
or qualification cohort occurred. No public Save132 or new native wrapper is claimed.

## Findings and equalities

- At3 the acquired continuity goal and independent support goal are adopted, active4.
  The positive availability report is learned after appraisal3. The loss report at4
  affects appraisal5; appraisal4 remains at known zero loss. Correction8 affects9.
- Forty HiddenLoss/NoLoss pairs preserve every cognitive row, including actual selected
  actions and random draws, despite different physical availability. No report is not
  negative evidence. Forty FalseLoss/ReportedLoss pairs likewise preserve cognition:
  belief follows admitted evidence rather than truth. Execution may differ.
- Forty Corrected/Recovered pairs preserve cognition while physical recovery histories
  differ. Correction restores Latest availability to1; Mean retains2/3 after the
  positive/negative/positive reports, hence likelihood1/3. NoLearning stays unknown.
- Forty FailedSupport/ReportedLoss pairs preserve decisions and cognitive owners despite
  independently failed support execution. Outcomes are deliberately masked; no learning
  or automatic recovery is inferred from physical completion or noncompletion.
- All acquired positive relationship entries remain byte-identical after time2. Loss
  does not become a rupture event, erase attachment history or rewrite past meaning.
- One admitted interaction or masked participation does not create the continuity goal.
  The same loss report then has severity0, while believed loss remains1. Explicit goal
  withdrawal also removes current severity without changing belief or history.
- High perceived control yields SplitExposure[1,0], versus[1,1] at low control.
  HistoricalProduct retains1/2 under full control. These are declared candidate
  projections; their difference does not select a universal psychological law.
- Across all8 Latest seeds, loss changes the probe5..8 choice probabilities. It changes
  actual action sequences in **{loss_changes}/8**, with **{8-loss_changes} equal sequences** retained.
  NoAffect preserves the exact appraisal but changes **{ablation_changes}/8** action sequences.
  StrongContinuity preserves belief/appraisal and changes **{motive_changes}/8** sequences.
  Full per-seed selected actions remain in the matrix; no monotonic pathwise effect is
  claimed from changing a reason-die distribution.

## Local disposition, transfer and limits

Existing architectural precedent favors observer evidence over truth, goal-relative
appraisal over goals stored inside belief, and separate intent/execution/learning.
The chosen conservative model uses existing state and math; meaningful alternatives
remain executable. The earlier absence-to-goal-retirement control is not adopted.

Initial interaction is a single offered option with a genuine invitation reason. This
earns observed participation history but does not qualify free social exploration or
natural relationship formation. The scenario's adoption threshold, fixed vulnerability,
authored perceived control, reason strengths and fine modifier units remain candidates.
Both goals expire13 outside the12-instant horizon. Later attempts do not append new
relationship evidence because their outcomes are masked. False belief can therefore
persist despite successful contact; natural sensing and error correction are not claimed.
Current contact availability, future-contact report, relationship value and goal status
remain separate. The loss proposition says nothing about physical death or existence.

The support consumer reads only the final affect coordinate. It supplies no evidence
that two coordinates are necessary. No physiological feedback, new world dynamics,
natural recognition, grief stages, permanent recovery, full-lifetime biography or joined
native admission is qualified. No existing representation, source byte, law or comparator
is retired. The North-Star lesson is that admitted loss changes current belief and
meaning while preserving the character's acquired relationship history and independent
goals; actual response remains an arbitration outcome, not an emotion command.

AuditREV110 promotes only Brief12.15-11: **131 bounded /1 partial /0 blocked**,
105 named verdicts;132 clauses unchanged. The remaining partial is affect12.5-8.
Next AFFECT_REGULATORY_REDUCTION_READINESS.md. Corpus0.29.0/21 and native wrapper54/57
unchanged;1508/0. RO009/010/011/012/013/014/016/017/019/020/021 preserve the material
findings and limits; no obligation closes. RO019 ACTIVE;RO021 historical gate unsatisfied;
RO022 CLOSED for existing scope. Campaign3 remains NOT EXIT-READY.
'''
write(p/'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md',report)
summary=f'''VER-C3-LONGITUDINAL-LOSS-001: bounded valued-contact loss COMPONENT QUALIFIED.
5 models/480 fresh runs/6240 original-prefix restores;5760 advancing/480 terminal;
8 faults;10 focused/328 reference tests/fresh build.160 observer/execution boundary pairs.
Actual acquired relationship, fallible contact belief, maintained goal, affect and later
sampled action/execution remain separate. Loss changes actions{loss_changes}/8;NoAffect{ablation_changes}/8;
strong competing motive{motive_changes}/8. Preserve equalities, controlled adoption/reports,
masked action outcomes and prior GRIEF model. No clinical grief/native admission or
affect-dimensionality claim. AuditREV110:131 bounded/1 partial/0 blocked;105 verdicts.
Counters1508/0;corpus0.29.0/21;wrappers54/57 unchanged. No owner ruling.
Start CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md;next
AFFECT_REGULATORY_REDUCTION_READINESS.md. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
Campaign3 NOT EXIT-READY.'''
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## `VER-C3-LONGITUDINAL-LOSS-001` — acquired valued-contact loss and later action (2026-10-03)\n\nQUALIFIED BOUNDED / LOCAL DISPOSITION.\n'+summary+'\nEvidence: LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json and CLOSURE_REV1.\nRO-C3-009/010/011/012/013/014/016/017/019/020/021. Only Brief12.15-11 promoted.\n')
for dest in [p/'SEAM_LEDGER.md',p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md')]:
 with dest.open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## Bounded longitudinal personal loss closure — 2026-10-03\n\n'+summary+'\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+current.read_bytes())
write(current,'''# Current research entry point

**Updated2026-10-03. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded longitudinal personal loss COMPONENT QUALIFIED.**

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1508** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active /19 conditional /0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /105 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **131 bounded /1 partial /0 blocked** |
| Public wrapper inventory | **54 producers /57 factories; unchanged** |

'''+summary+'''

All execution jobs finished. Do not relaunch prior matrices. Affect dimensionality
12.5-8 remains partial; prior ScalarUncontrolled receiving equality must be preserved.
Verbatim-log whitespace limitation remains in MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json.
''')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8');s=s.replace('**Current routing (2026-10-03):** VER-C3-LONGITUDINAL-HABIT-001','**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-HABIT-001',1);s=s.replace('## Active direction\n','## Active direction\n\n**Current routing (2026-10-03):** '+summary+'\n',1);write(a,s)
registry=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(registry.read_text(encoding='utf-8'));obs=['RO-C3-'+str(n).zfill(3) for n in [9,10,11,12,13,14,16,17,19,20,21]];verdict='VER-C3-LONGITUDINAL-LOSS-001';r['verdictReviews'].append({'verdict':verdict,'obligations':obs})
reports=['docs/formal/LONGITUDINAL_PERSONAL_LOSS_COMPONENT_0_1.md']+['docs/planning/'+n for n in ['CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md','LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json','LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json','LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json']]
for name in reports:r['reportReviews'].append({'path':name,'obligations':obs})
nextpath='docs/planning/AFFECT_REGULATORY_REDUCTION_READINESS.md';nextobs=['RO-C3-'+str(n).zfill(3) for n in [2,3,6,7,8,10,11,19,20,21]];r['reportReviews'].append({'path':nextpath,'obligations':nextobs})
for o in r['obligations']:
 if o['id'] in obs:
  if verdict not in o['verdicts']:o['verdicts'].append(verdict)
  for name in reports:
   if name not in o['evidence']:o['evidence'].append(name)
 if o['id'] in nextobs and nextpath not in o['evidence']:o['evidence'].append(nextpath)
 if o['id'] in ['RO-C3-011','RO-C3-016','RO-C3-019']:
  o['established']+=' VER-C3-LONGITUDINAL-LOSS-001 qualifies bounded acquired valued-contact loss with later actual sampled actions/execution:5 models/480 runs/6240 original-prefix restores,160 observer/execution boundary pairs,10+328 tests/build. Only Brief12.15-11 promoted. Earlier GRIEF profile and acquired-value laws remain separate.'
  o['unresolved']+=' Controlled participation/adoption/reports and masked action outcomes limit loss closure;no native admission, clinical grief, natural correction, full-lifetime or affect-dimensionality claim. Preserve all equal action sequences, Mean/Latest/NoLearning/NoAffect/HistoricalProduct and existing scalar receiving equality. RO021 remains mandatory before exit.'
write(registry,json.dumps(r,ensure_ascii=False,indent=2)+'\n')
audit=Path('scripts/check-campaign3-exit-audit.mjs');s=audit.read_text(encoding='utf-8');s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV109.json';","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV110.json';").replace('result.snapshotRevision=109;','result.snapshotRevision=110;')
s=s.replace("result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV108.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV108.json'),disposition:'Habit/relearning implementation;129 bounded/3 partial/0 blocked;103 verdicts;1508/0.'};","result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV109.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV109.json'),disposition:'Bounded habit/relearning closure;130 bounded/2 partial/0 blocked;104 verdicts;1508/0.'};")
addition="""// REV110: bounded acquired personal loss, actual later decisions/execution and correction.
{const c=families[14].clauses[10];c.status=Q;c.evidence.push(p+'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md',p+'LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json');c.obligations=[...new Set([...c.obligations,...[9,10,11,12,13,14,16,17,19,20,21].map(ro)])];c.rationale='REV110 bounded-qualified:5 component models/480 fresh runs/6240 complete original-prefix restores;5760 advancing/480 terminal;8 faults;10+328 tests/build. Two actual admitted interactions earn continuity goal;fallible loss report changes next appraisal and actual later response,not past relationship history.160 hidden/false/correction/execution invariance pairs. All8 probability contrasts;5 action-sequence contrasts and3 equalities. NoAffect and stronger competing motive preserve appraisal while changing response. Mean/Latest/NoLearning and HistoricalProduct retained. Controlled goal adoption/report sources,masked execution outcomes,no native admission,clinical grief or dimensional necessity claim. Earlier GRIEF public profile preserved;affect12.5-8 remains partial.';}
supplemental.push('CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md','LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json','LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json','LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json','LONGITUDINAL_PERSONAL_LOSS_BUILD_REV1.json','AFFECT_REGULATORY_REDUCTION_READINESS.md');
"""
assert 'const inventory=[' in s;s=s.replace('const inventory=[',addition+'const inventory=[',1);write(audit,s)
print(summary)
