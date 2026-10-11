"""Reconcile main biological plan, stored results and closure without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-main-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev304/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
from fractions import Fraction
import subprocess
names=['BIOLOGICAL_SYSTEM_PLAN_REV1.json','BIOLOGICAL_SYSTEM_RESULT_REV1.json','BIOLOGICAL_SYSTEM_CLOSURE_REV1.json']
plan,result,closure=[load(P/n) for n in names]
assert len(plan['models'])==24 and len(plan['runs'])==len(result['results'])==52
assert result['planSha256']==ref(P/names[0])['sha256']
assert len({r['runIdentity'] for r in plan['runs']})==52
models={m['identity']:m for m in plan['models']};assert len(models)==24
assert sum(len(r['frames']) for r in plan['runs'])==2288
assert (result['componentPrefixes'],result['advancing'],result['terminal'])==(2340,2288,52)
actions=set('drug meal drink sleep relax work alternative withhold'.split());domains=set('pleasure withdrawal hunger thirst sleep pain stress harm'.split())
laws=set('Full Latest NoLearning NoControl NoAdaptation NoRecovery KnownAccess NoReliefLearning CueHabituation BaselinePleasure NoAppraisalImpulse'.split())
assert {m['law'] for m in plan['models']}==laws
beliefCells=0;expressionChecks=0;draws=0;probabilities=0
for p,r in zip(plan['runs'],result['results']):
 for key in ['name','law','seed','modelIdentity','runIdentity']:assert p[key]==r[key]
 assert p['law']==models[p['modelIdentity']]['law']
 assert {k:v for k,v in p['config'].items() if k!='initial'}==models[p['modelIdentity']]['parameters']
 assert len(r['prefixHashes'])==len(p['frames'])+1 and all(re.fullmatch('[0-9a-f]{64}',v) for v in r['prefixHashes'])
 x=r['snapshot'];assert len(x['rows'])==len(x['world'])==x['at']==len(p['frames'])
 assert {k:v for k,v in x.items() if k not in ['state','world']}==r['observerView']
 history=[]
 for j,row in enumerate(x['rows']):
  assert row['at']==j+1 and set(row['beliefs'])==actions
  assert json.loads(row['expression'])=={k:row[k] for k in ['at','intent','choice','grounds']};expressionChecks+=1
  assert row['intent']==row['choice']['chosen']
  assert row['choice']['mode'] in ['Auto','QuietRoll','PlayerFacingRoll','NoActiveReasons']
  assert 0<=Fraction(row['choice']['authorship'])<=1
  ps=row['choice']['probabilities'];assert sum(Fraction(v['probability']) for v in ps)==(1 if ps else 0)
  assert all(v['name'] in actions and 0<=Fraction(v['probability'])<=1 for v in ps);probabilities+=len(ps)
  for d in row['choice']['draws']:
   assert 0<=d['result']<d['span'] and re.fullmatch('[0-9a-f]+',d['address']);draws+=1
  for act,vs in row['beliefs'].items():
   assert set(vs)==domains
   for domain,v in vs.items():
    samples=[h['outcomes'][domain] for h in history if h['action']==act and h['outcomes'][domain] is not None]
    expected=None if not samples else samples[-1] if p['law']=='Latest' else round(Fraction(sum(samples),len(samples)))
    assert v==expected,(p['name'],p['law'],j,act,domain);beliefCells+=1
  if row['receipt'] is not None and p['law']!='NoLearning':
   outcomes=dict(row['receipt'])
   if p['law']=='NoReliefLearning':outcomes['withdrawal']=None
   history.append(dict(at=j+1,action=row['intent'],cue=p['frames'][j]['cue'],outcomes=outcomes))
 assert x['history']==history
get=lambda name,law='Full',seed=7:next(r['snapshot'] for r in result['results'] if (r['name'],r['law'],r['seed'])==(name,law,seed))
returned=[]
for seed in range(8):
 x,y=get('main',seed=seed),get('noLoad',seed=seed)
 assert all(r['protection'] and r['maintained'] for r in x['rows'][24:])
 assert all(r['intent']!='drug' for r in x['rows'][24:32]+x['rows'][40:]+y['rows'][24:])
 if any(r['intent']=='drug' for r in x['rows'][32:40]):returned.append(seed)
assert returned==result['returnedSeeds']==[1,3,4,6]
assert get('falsePleasure')['state']==get('noEffect')['state']
assert all(r['intent']=='drug' for r in get('falsePleasure')['rows'][8:]) and all(r['intent'] is None for r in get('noEffect')['rows'][8:])
assert [r['intent'] for r in get('network')['rows']]==[r['intent'] for r in get('independent')['rows']]
receipt=subprocess.run(['node','scripts/check-biological-system-closure.mjs'],capture_output=True,text=True,check=True)
assert 'PASS biological system:25 models/53 distinct runs/2389 distinct prefixes' in receipt.stdout
notes={
(P/names[0]).as_posix():'Frozen main plan:24 distinct model identities/52 run identities across11 retained laws; all eight seeds in main/noLoad, other finite scenario/seed controls. Constitution/content and initial state/input commitments remain separate. Configuration excluding initial matches each model parameters.16 source fingerprints are exact. Prospective-freeze label remains historical chronology, not proven by byte reconstruction. Fixed instructed practice, goals, cues, empty initial learning, finite horizons and exact-lattice candidate laws do not imply natural exploration, minimal biological domains or clinical calibration.',
(P/names[1]).as_posix():'Stored52-run results:2288 action boundaries,2340 prefix hashes (2288 advancing/52 terminal by horizon). Independently rederive every pre-consequence belief cell from earlier admitted receipts with exact ties-even mean/Latest and NoLearning/NoReliefLearning rules; expressions equal their frozen choice/grounds and observerView omits state/world. Four of eight load seeds return, four do not; matched noLoad and recovery-of-control phases withhold. False sensed pleasure changes pursuit with identical final physical state; coupled-network resource sequence equals independent control. These finite findings preserve uncertainty, no-receipt absence and evidence/truth separation. Stored hashes and checker PASS do not freshly replay saves or prove full tails from every prefix; original harness advances each prefix once and full tail only from initial0.',
(P/names[2]).as_posix():'Bounded18-behavior functional closure combines24/52 main with constitutional pair into25 models/53 distinct runs,54 execution rows,2389 distinct prefixes/2438 checks. Read-only historical closure checker passes now, verifying original artifact commitments, stored learning and selected witnesses plus dated33/328 test/build receipts; those suites were not rerun. Native public admission is separate. Comparator necessity, clinical laws, natural exploration, learned self-regulation, organ physiology and whole Campaign3 are not claimed. Failed exploration artifacts remain separately preserved/reviewed; closure hash membership alone does not accept them as successful experiments.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md','BIOLOGICAL_SYSTEM_BEHAVIOR_COVERAGE.md','BIOLOGICAL_SYSTEM_DOMAIN_FINDINGS.md','BIOLOGICAL_SYSTEM_WORK_ORDER.md','campaign3-history-biology-constitution-rev1/review.json','CAMPAIGN3_FINAL_HISTORY_GATE.md']]

def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'NARRATIVE' if q in ['/status','/scope'] else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FIXTURE GATE SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Routing receipt remains dated planning evidence; no later source bytes substituted for a missing original. Independent adequacy remains separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='BOUNDED FUNCTIONAL BIOLOGY PLAN, STORED TRAJECTORY OR CLOSURE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x if len(x)<=200 else None,textLength=len(x),textSha256=hashlib.sha256(x.encode('utf-8')).hexdigest(),role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

bind((P/names[1]).as_posix(),dict(path=(P/names[0]).as_posix(),sha256=result['planSha256']))

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

save('schema.json',dict(shortStringsIncluded=True,longStringsBoundByExactSourcePointerLengthAndHash=True,leaves=leaves))
save('stored-check.json',dict(command=['node','scripts/check-biological-system-closure.mjs'],exitCode=receipt.returncode,stdout=receipt.stdout,checker=ref('scripts/check-biological-system-closure.mjs'),beliefCells=beliefCells,expressionChecks=expressionChecks,drawRecords=draws,probabilityEntries=probabilities,returnedSeeds=returned,scope='Read-only artifact/trajectory checks; no qualification writer, runtime replay or test suite rerun.'))
save('unresolved.json',dict(searchScope='Current named paths, REV304 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='MAIN FUNCTIONAL BIOLOGICAL EVIDENCE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored rows and source commitments checked; no original writer or runtime replay.','Rejected exploration and public admission remain separately reviewed scopes; canonical model identities are matched, not freshly reconstructed.','No clinical law, minimal-domain necessity or independent historical timing proof.'],obligations=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED BIOLOGICAL MAIN EVIDENCE',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),newBackingResources=len(preserved),recordedPrefixChecks=2340,advancing=2288,terminal=52,beliefCells=beliefCells,expressionChecks=expressionChecks,review=ref(O/'review.json')))

assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
