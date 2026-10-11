"""Chosen reappraisal component authority and independent arithmetic review."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chosen-reappraisal-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
from fractions import Fraction as F
specs={}
specs['docs/formal/CHOSEN_REAPPRAISAL_CONTRACT.md']='Accepted component0.1 under existing Control-to-Appraisal authority, not native ownership proof. Eight instants, one opportunity4; separate prior learned conditional means, adopted regulation/work goals and later frame. BenefitRelative importance/4 times positive conditional difference, KnowledgeOnly omits benefit, NoReappraisal removes frame installation. Exact original reason/dice/intent/expression/attempt and independent completion. Fixed severity1/vulnerability1/control0; no physical protection or relief evidence.'
specs['docs/planning/CHOSEN_REAPPRAISAL_READINESS.md']='Prospective chosen-strategy intake distinguishes older instructed framing from actual goal-relative contest. Requires failed completion, harmful/ineffective/unknown knowledge, all-seed probabilities and later effects. Component qualification discharges bounded composition only; source authority remains separate native gate.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md']='Prospective native admission obligation, not evidence. Explicit typed sources cannot supply chosen action/frame/affect. Twelve real phases, separate owners, source lineage, original replay, authority/fault/publication proofs required. Historical50/53 extension is dated; later native verdict separately discharges immediate gate without making component proof native.'
specs['docs/planning/CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md']='VER-C3-CHOSEN-REAPPRAISAL-001:4 models43 runs387 component prefixes344 advancing43 terminal. All eight seeds balanced probabilities1/2;1/4/5/6 reframe,0/2/3/7 work. Successful4 changes later5, not4; failed completion and ablation retain choice. Regulation goal distinct from fixed threat concern. Known harmful frame can worsen affect; hidden truth/denied catalogue whole views equal. Historical13/328 tests/build, native debt was then open and later separately closed.'
specs['docs/planning/CHOSEN_REAPPRAISAL_FINDINGS.md']='Old instructed operation insufficient for chosen-strategy claim. instructionId names catalogue definition, not received command. safety is regulation-goal importance, not removal of fixed threat concern. Completion is internal fixture, not danger evidence; work has no external outcome. No first failed component cohort;13 focused passed. Component retry/busy atomicity is not native Failed/publication authority. Prior override/false-relief credit counterexamples remain binding.'
specs['docs/planning/CHOSEN_REAPPRAISAL_PLAN_REV1.json']='Frozen four model and43 distinct original run commitments, complete dependency graph, eight-seed roster and explicit experiment/comparison identities. Fresh replay reconstructs all identities and compares artifacts/inputs; no refreeze, discarded seed or altered original.'
specs['docs/planning/CHOSEN_REAPPRAISAL_RESULT_REV1.json']='Exact aggregate and all43 workers joined to frozen inputs; original behavioral cross-case checker passes. Fresh387 component restores reproduce whole original result. No native Save132 claim from component prefix equality.'
specs['docs/planning/CHOSEN_REAPPRAISAL_CLOSURE_REV1.json']='Original closure equality and source/test/build bindings pass with independently authenticated historical predecessor wrapper50/53 scope. Native and current55/58 inventory remain separate. Historical tests/build not rerun.'
specs['docs/planning/CHOSEN_REAPPRAISAL_TESTS_REV1.json']='Historical13 individual passing assertions: actual dice/goals/later frame/failed completion, unknown and opportunity controls, harmful/ineffective frame, hidden views/two projection, atomic four fault sites/busy/retry, all-prefix and malformed restore. Not a fresh test run; native authority absent.'
specs['docs/planning/CHOSEN_REAPPRAISAL_REFERENCE_TESTS_REV1.json']='Historical328 individual reference passes authenticated; not a new test run or wider model qualification.'
specs['docs/planning/CHOSEN_REAPPRAISAL_BUILD_REV1.json']='Historical successful build/exit0 with log hash; no fresh build.'
for i in range(43):specs[(P/f'CHOSEN_REAPPRAISAL_RUN_{i}_REV1.json').as_posix()]=f'Frozen component worker{i}: eight rows, nine original-prefix saves and one successor each freshly executed; complete snapshot, safe-view and prefix hashes equal original. Retain RNG addresses, independent world diagnostic and typed reasons/expression lineage. No native proof.'
plan=load(P/'CHOSEN_REAPPRAISAL_PLAN_REV1.json');assert len(plan['models'])==4 and len(plan['runs'])==43 and plan['prefixes']==387
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
replay=load(O/'replay-check.json');assert replay['status']=='PASS' and (replay['cases'],replay['prefixes'])==(43,387)
assert [x['index'] for x in replay['checks']]==list(range(43))
for x in replay['checks']:assert x['resultSha256']==ref(P/f'CHOSEN_REAPPRAISAL_RUN_{x["index"]}_REV1.json')['sha256']
for name,n in [('TESTS',13),('REFERENCE_TESTS',328)]:
 t=load(P/f'CHOSEN_REAPPRAISAL_{name}_REV1.json');assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
build=load(P/'CHOSEN_REAPPRAISAL_BUILD_REV1.json');assert build['status']=='PASS' and build['exitCode']==0 and ref(build['log'])['sha256']==build['logSha256']
# Independent exact arithmetic from original observations and prior frame, not stored means.
fmt=lambda x:f'{x.numerator}/{x.denominator}'
count=0
for case in plan['runs']:
 result=load(P/f'CHOSEN_REAPPRAISAL_RUN_{case["index"]}_REV1.json');samples={1:[],2:[]};catalogue=0;frame=False;goals=None
 for source,row in zip(case['input'],result['snapshot']['rows']):
  at=source['at'];goals=[source['safety'],source['work']] if at==1 else goals
  means=[F(sum(samples[i]),len(samples[i])) if samples[i] else None for i in [1,2]]
  eligible=catalogue==2 and all(x is not None for x in means)
  assert row['eligible']==eligible and row['goals']==goals and row['means']==[None if x is None else fmt(x) for x in means]
  benefit=max(F(0),means[0]-means[1]) if eligible else F(0)
  values=[F(goals[0],4)*(F(1) if case['law']=='KnowledgeOnly' else benefit),F(goals[1],4)]
  assert row['values']==list(map(fmt,values))
  likelihood=means[1 if frame else 0];expected=[] if likelihood is None else [fmt(likelihood)]*case['projection'];assert row['affect']==expected
  options=[i for i in [0,1] if source['opportunity'] and values[i]>0 and (i==1 or eligible)]
  assert (row['chosen'] in options) if options else row['chosen']==-1
  assert row['completion']==(row['chosen']>=0 and source['complete'])
  assert (row['frameBefore'] is not None)==frame
  if row['chosen']==0 and row['completion'] and case['law']!='NoReappraisal':frame=True
  assert (row['frameAfter'] is not None)==frame
  if source['condition'] and source['observed']:samples[source['condition']].append(int(source['display']))
  if source['catalogueObserved'] and source['catalogue']>0:catalogue=source['catalogue']
  count+=1
assert count==344
preserved=[]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','replay-check.json']]+[ref('scripts/'+n+'.mjs') for n in ['check-history-chosen-reappraisal-closure','replay-history-chosen-reappraisal','check-chosen-reappraisal','qualify-chosen-reappraisal']]+[ref('src/campaign3/chosenReappraisal.ts'),ref('src/campaign3/reappraisalMath.ts')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='CHOSEN REAPPRAISAL COMPONENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/scope','/finding'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='CHOSEN REAPPRAISAL COMPONENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=count,limits=['Fresh43 cases387 component prefixes344 advancing43 terminal; no native Save132 or scheduler claim.','Historical13/328 tests/build authenticated, not rerun. Component native-debt wording is historical; later public verdict separately discharges it.','Fixed severity1/vulnerability1/control0 makes two affect coordinates coincide; retaining two coordinates does not independently discriminate projection necessity here.','One externally admitted opportunity, fixed conditional labels, goal instruction and completion fixture do not prove spontaneous discovery, learned efficacy, physical protection or external work.','Successful operation can worsen affect; relief is not evidence, regulation goal distinct from fixed threat concern. All eight seeds and three laws preserved.'])

check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))
