"""Reconcile biological constitutional comparison without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-constitution-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev303/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
a=load(P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json');b=load(P/'BIOLOGICAL_CONSTITUTION_RESULT_REV1.json')
base=load(P/'BIOLOGICAL_SYSTEM_PLAN_REV1.json');result=load(P/'BIOLOGICAL_SYSTEM_RESULT_REV1.json')
assert a['basePlanSha256']==ref(P/'BIOLOGICAL_SYSTEM_PLAN_REV1.json')['sha256']
assert a['harnessSha256']==ref('scripts/qualify-biological-constitution.mjs')['sha256']
assert b['planSha256']==ref(P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json')['sha256']
original=next(r for r in base['runs'] if (r['name'],r['law'],r['seed'])==('main','Full',7))
originalResult=next(r for r in result['results'] if r['runIdentity']==original['runIdentity'])
assert len(a['rows'])==len(b['results'])==2
assert [r['gain'] for r in a['rows']]==[250,125]
import copy
c=copy.deepcopy(a['rows'][0]['config']);c['constitution']['channels']['reward']['toleranceGain']=125
assert c==a['rows'][1]['config']
assert a['rows'][0]['frames']==a['rows'][1]['frames']==original['frames'] and len(original['frames'])==48
for key in ['config','modelIdentity','runIdentity']:assert a['rows'][0][key]==original[key]
for p,r in zip(a['rows'],b['results']):
 for key in ['gain','modelIdentity','runIdentity']:assert p[key]==r[key]
 assert len(r['prefixHashes'])==49 and all(re.fullmatch('[0-9a-f]{64}',x) for x in r['prefixHashes'])
 assert r['snapshot']['at']==len(r['snapshot']['rows'])==len(r['snapshot']['world'])==48
assert b['results'][0]['snapshot']==originalResult['snapshot']
assert b['results'][0]['prefixHashes']==originalResult['prefixHashes']
x,y=[r['snapshot'] for r in b['results']]
assert x['rows'][0]==y['rows'][0]
assert [r['intent'] for r in x['rows'][:8]]==[r['intent'] for r in y['rows'][:8]]
assert [r['world'][0]['state']['channels']['reward']['tolerance']['drug'] for r in [x,y]]==[150,75]
assert x['rows'][1]['after']['reward']==910 and y['rows'][1]['after']['reward']==940
assert x['rows'][1]['after']['pleasure']==500 and y['rows'][1]['after']['pleasure']==540
assert (b['models'],b['newModels'],b['runs'],b['newRuns'],b['prefixChecks'],b['newDistinctPrefixes'])==(2,1,2,1,98,49)
assert len({r['modelIdentity'] for r in a['rows']}|{r['modelIdentity'] for r in base['runs']})==25
assert len({r['runIdentity'] for r in a['rows']}|{r['runIdentity'] for r in base['runs']})==53
notes={
(P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json').as_posix():'Constitutional comparison plan binds the original biological system plan and exact historical harness. Two48-frame rows differ only in reward tolerance acquisition gain250 versus125; initial body, frames and other configuration agree. First model/run/config exactly reuses Full/main/seed7; the second adds one model/run. Model/run identities are not conflated with source timing: FROZEN BEFORE QUALIFICATION remains historical chronology claim, not proven by deterministic byte equality. Acquisition gain is not clearance, personality, goal, learned preference or a calibrated dopamine law.',
(P/'BIOLOGICAL_CONSTITUTION_RESULT_REV1.json').as_posix():'Two recorded49-prefix histories give98 checks but49 new distinct tuples because gain250 exactly reuses the main run, including full snapshot and prefix hashes. First complete sensory/cognitive row and first eight instructed intents match; hidden first tolerance differs150/75. At next row reward910/940 and pleasure500/540 differ. This supports isolated constitutional acquisition under the fixed admitted-practice setup, not spontaneous behavioral acquisition, independent policy necessity, clinical calibration or native scheduler proof. Prefix hashes do not reconstruct full save bytes or prove fresh restores. Combined25-model/53-run counting is checked without claiming whole main trajectory/source adequacy.'}
chain=[ref(P/n) for n in ['BIOLOGICAL_SYSTEM_PLAN_REV1.json','BIOLOGICAL_SYSTEM_RESULT_REV1.json','BIOLOGICAL_SYSTEM_CLOSURE_REV1.json','CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md','BIOLOGICAL_SYSTEM_DOMAIN_FINDINGS.md','CAMPAIGN3_FINAL_HISTORY_GATE.md']]

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
def kind(p,q):return 'NARRATIVE' if q=='/status' else 'BACKING'
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
 sources.append(dict(**ref(p),role='BOUNDED BIOLOGICAL CONSTITUTION COMPARISON; ONE REUSED RUN',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

for owner,target,digest in [(P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json',P/'BIOLOGICAL_SYSTEM_PLAN_REV1.json',a['basePlanSha256']),(P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json',Path('scripts/qualify-biological-constitution.mjs'),a['harnessSha256']),(P/'BIOLOGICAL_CONSTITUTION_RESULT_REV1.json',P/'BIOLOGICAL_CONSTITUTION_PLAN_REV1.json',b['planSha256'])]:bind(owner.as_posix(),dict(path=target.as_posix(),sha256=digest))

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV303 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='BIOLOGICAL CONSTITUTION PAIR RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored rows and source commitments checked; no original writer or runtime replay.','Full primary biological plan/results, rejected exploration and public admission remain separately reviewed scopes.','No clinical law, minimal-domain necessity or independent historical timing proof.'],obligations=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED CONSTITUTION COMPARISON',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),newBackingResources=len(preserved),recordedPrefixChecks=98,newDistinctPrefixes=49,reusedRuns=1,newRuns=1,review=ref(O/'review.json')))

assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
