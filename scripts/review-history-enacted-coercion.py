"""Whole historical enacted-coercion authority and independent consequence/credit audit."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-enacted-coercion-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
specs['docs/formal/ENACTED_COERCION_COMPONENT_CONTRACT.md']='Accepted enacted-coercion-component0.1: actual biological-choice target, two recognized controlled demanders, prior holder/demander refusal-cost evidence, actual choice/expression, separate qualification, permitted execution then conditional world loss and admitted learning. Six candidates; four opportunities; K1 millionth ties-even identity fold. No native scheduler, universal coercion law or injury feedback.'
add('ENACTED_COERCION_READINESS.md','Prospective missing enacted chain: entered pressure and later obstruction cannot establish earlier pressured choice. Requires actual refusal consequence, admitted knowledge, later choice and independent eligibility; retain hidden power, false/withheld evidence, execution and candidate controls. No general threat-strategy learner required.')
add('CAMPAIGN3_ENACTED_COERCION_QUALIFICATION.md','VER-C3-ENACTED-COERCION-001 bounded component:6 models576 runs2880 prefixes freshly reproduced. Evidence changes probabilities8/8 and sequences5/8; equal0/3/4 retained. Twenty high-pressure expressions lose Threshold credit without changing actual choice. Mean/Latest differ1/5; compliance2/7 can prevent correcting observations. No native coercer policy learning, legal voluntariness, body feedback or identity-to-choice claim.')
add('ENACTED_COERCION_PLAN_REV1.json','Whole canonical six-model576 distinct-run/experiment/comparison identity plan freshly reconstructed with exact original transitive artifacts. Twelve declared cases cross every law and seed0..7; no retrospective trajectory selection or new plan publication.')
add('ENACTED_COERCION_RESULT_REV1.json','Whole original result freshly reproduced:576 cases2880 original-input prefixes2304 advancing576 terminal. Independent2304 prior-evidence, expectation, expression, qualification, quantized-fold, execution, cost and learning rows. Actual RNG/choice bytes come from runtime replay, not independent dice reconstruction.')
add('ENACTED_COERCION_CLOSURE_REV1.json','Original read-only closure freshly passes artifact hashes, complete identity/result bindings, causal counts and historical tests/build. Historical1508/0 and54/57 wrapper scope are dated counters, not current accounting or new public admission.')
add('ENACTED_COERCION_BUILD_REV1.json','Historical npm build exit0 with captured boundary/TypeScript/Vite output and exact original plan hash; authenticated, not freshly run. No failed build cohort claimed.')
add('ENACTED_COERCION_TESTS_REV1.json','Historical12 passing assertions cover prior evidence, all seeds, hidden power, known zero, missing opportunity, separate pressure/credit, instruction, holder/demander, competitors, originals, publication and three rollback faults. Authenticated; fresh matrix does not itself rerun fault tests.')
add('ENACTED_COERCION_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertion leaves; authenticated not freshly rerun.')
add('ENACTED_COERCION_DEVELOPMENT_TESTS_REV1.json','Initial12 passing development assertions preserved. Qualification records a duplicate fixture alias removed before model freeze, not a failed behavioral cohort. This receipt does not preserve independently reconstructable bytes of the deleted alias; current12-case plan is exact and fresh identity reconstruction preserves its scope.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev123/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-enacted-coercion.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-enacted-coercion-closure.mjs'],text=True).strip()
plan=load(P/'ENACTED_COERCION_PLAN_REV1.json');result=load(P/'ENACTED_COERCION_RESULT_REV1.json')
for a in plan['artifacts']+load(P/'ENACTED_COERCION_CLOSURE_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for name,n in [('TESTS',12),('DEVELOPMENT_TESTS',12),('REFERENCE_TESTS',328)]:
 t=load(P/f'ENACTED_COERCION_{name}_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
build=load(P/'ENACTED_COERCION_BUILD_REV1.json');assert build['exitCode']==0 and build['planSha256']==ref(P/'ENACTED_COERCION_PLAN_REV1.json')['sha256'] and 'Reference boundary check passed.' in build['output']
fmt=lambda x:f'{x.numerator}/{x.denominator}'
actors={row['expression']['actor'] for res in result['results'] for row in res['state']['rows']};assert len(actors)==1;actor=next(iter(actors))
demanders={}
for case,res in zip(plan['runs'],result['results']):
 for frame,row in zip(case['frames'],res['state']['rows']):
  if frame['demander'] in demanders:assert demanders[frame['demander']]==row['demander']
  demanders[frame['demander']]=row['demander']
assert len(set(demanders.values()))==2 and actor not in demanders.values()
count=0
for case,res in zip(plan['runs'],result['results']):
 evidence=[];support=opposition=F(0);resources=4000;law=case['law'];rows=[]
 for frame,row in zip(case['frames'],res['state']['rows']):
  demander=demanders[frame['demander']];prior=[e for e in evidence if e['holder']==actor and e['demander']==demander]
  cost=None if not prior else prior[-1]['cost'] if law=='Latest' else sum(e['cost'] for e in prior)//len(prior)
  pressure=(cost or 0) if frame['demand'] and law!='NoPressure' else 0
  chosen=row['choice']['chosen'];assert chosen in ['refuse','comply'] if frame['demand'] else chosen is None
  alignment=F(1,2) if chosen=='refuse' else F(-1,2) if chosen=='comply' else F(0)
  expression=dict(at=frame['at'],actor=actor,action=chosen,authorship=row['choice']['authorship'],alignment=fmt(alignment))
  value=F(row['choice']['authorship'])*alignment;status='Accepted'
  if chosen is None:status='NoChoice';value=F(0)
  elif law=='Graded':value*=F(1000-pressure,1000)
  elif law!='IgnorePressure' and pressure>=500:status='Constrained';value=F(0)
  if status=='Accepted' and not value:status='ZeroContribution'
  support=F(round((support+max(F(0),value))*1000000),1000000);opposition=F(round((opposition+max(F(0),-value))*1000000),1000000)
  strength=(support-opposition)/(1+support+opposition)
  executed=chosen if frame['permitted'] else None;attempt=executed=='refuse';loss=frame['penalty'] if attempt and frame['power'] else 0;resources-=loss
  observed=dict(at=frame['at'],holder=actor,demander=demander,cost=loss if frame['display'] is None else frame['display']) if attempt and frame['access'] else None
  expected=dict(at=frame['at'],demander=demander,prior=prior,anticipatedCost=cost,pressure=pressure,choice=row['choice'],expression=expression,qualification=dict(status=status,contribution=fmt(value)),strength=fmt(strength),executed=executed,penaltyAttempt=attempt,loss=loss,evidence=observed)
  assert row==expected;rows.append(expected)
  if observed is not None and law!='NoLearning':evidence.append(observed)
  count+=1
 assert res['state']==dict(prefix=4,resources=resources,evidence=evidence,rows=rows)
 target=dict(prefix=4,evidence=evidence,rows=[{k:v for k,v in row.items() if k not in ['executed','penaltyAttempt','loss']} for row in rows])
 assert hashlib.sha256(json.dumps(target,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()==res['targetHash']
assert count==2304
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/(n+'.json')) for n in ['identities','replay']]+[ref(p) for p in ['scripts/replay-history-enacted-coercion.mjs','scripts/check-enacted-coercion-closure.mjs','src/campaign3/enactedCoercion.ts','src/campaign3/biologicalChoice.ts','src/campaign2/cognitiveMath.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='ENACTED COERCION AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/output')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [9,10,13,14,17,19,20,21]]
r=dict(status='ENACTED COERCION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh576 component cases2880 prefixes2304 advancing576 terminal; whole canonical plans and results match. No native scheduler or full-tail claim.','Independent consequence/evidence/qualification/fold arithmetic uses recorded actual choices; RNG and reason-dice bytes are freshly replayed, not independently derived here.','Actual refusal precedes learned pressure; original choice/expression precedes execution and qualification never reads later world loss.','All seeds retained:8 probability differences5 action differences; equal0/3/4, mean/latest differences1/5 and compliance-prevented correction2/7 preserved.','NoLearning retains row receipts but no learned evidence; unknown and known zero may produce equal choices while evidence remains distinct.','Threshold/Graded/IgnorePressure are candidate credit laws, not universal definitions of coercion; fixed meaning, significance, recognition and conditional external policies remain controls.','No native public admission, natural threat strategy, injury/stress feedback, general trust/attribution or identity-to-choice feedback earned.','Historical12 focused328 reference and initial12 development assertions/build authenticated, not rerun. Removed prefreeze duplicate fixture alias is reported history, not independently reconstructed archived source.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
