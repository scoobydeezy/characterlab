from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-affect-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
specs={
(P/'CAMPAIGN3_AFFECT_READINESS.md').as_posix():'Historical intake;public source debt discharged by affect-public contract and VER-C3-AFFECT-001,not still current routing. Four independent factor interventions,competing motive and later feedback required. Arithmetic collision does not establish receiver necessity. Uncertain factors,calibrated confidence and general causal learning remain RO010/011.',
(P/'AFFECT_MITIGATION_SOURCE_DRAFT.md').as_posix():'Superseded proposal,not implementation authority. Current/baseline/treated estimates require separate admitted context/action support;availability is not efficacy. Relative and absolute contrasts have distinct units;unknown baseline or baseline0 is unavailable,known ineffective is zero. Controlled source debt discharged by public contract;causal identification/confounders/unguided segmentation not earned.',
'docs/formal/AFFECT_FACTOR_COMPARISON.md':'Accepted exact component operands/projections only. E=p*s*(1+v)/2,U=E*(1-c),H=E*(2-c)/2;three retained candidates. Unknown unavailable,known zero numeric,no observer admission.243 evaluations freshly reproduce;no persistence/reasons/public affect claim.',
'docs/formal/AFFECT_PUBLIC_CONTRACT.md':'Accepted bounded successor:observed event-file continuity/action/opportunity conditions;sole belief owner140,next50 reads completed context. Fallible reserve display,goal-relative severity,unknown vs ineffective vs empty catalogue retained. Derived affect later readiness z+(1-z)*a/2 cannot mutate belief or create a Fear ground. Phase60..110 decision/execution separated;complete-prefix validation. One character/15frames/17instants,controlled segmentation and fixed plans;not general uncertainty,causality or physiology.',
(P/'CAMPAIGN3_AFFECT_QUALIFICATION.md').as_posix():'VER-C3-AFFECT-001 bounded public qualification.18models/91mainruns/1236prefixes;14supplementary executions not additional distinct main runs.48factorialcells;independent factors,hidden-truth invariance,unknown/negative distinctions,grounded choices and later feedback. Three negative oracles preserve fear-not-command/not-extra-die/relief-not-evidence.82affected/328reference receipts and90images audited,not fresh simulations. Scalar receiving maps do not prove representation necessity;RO011 conditional with uncertainty/social/causal/physiology reopens. Historical counters/routing not current.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='AFFECT AUTHORITY / INTAKE / BOUNDED QUALIFICATION',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'AFFECT_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/AFFECT_PUBLIC_CONTRACT.md')]))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in specs:
   assert u['sourceSha256']==entries[u['source']]['sha256'];rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING',judgment=specs[u['source']]))
v=dict(status='FIVE AFFECT AUTHORITY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,obligations=['RO-C3-010','RO-C3-011','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Whole metadata/runtime result sources are not assigned by this narrative review.','Fresh arithmetic/closure receipt equality is not fresh public replay.','Historical active/conditional counts and next-work routing remain historical.'])
for name,value in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=5,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,checker=ref(__file__)) )]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print('sources',5,'occurrences',len(rows))
