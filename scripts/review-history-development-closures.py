"""Whole closure/profile schemas and context-preserving archived contract joins."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-closures-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'DEVELOPMENT_COMPONENT_CHECK_REV1.json':('status scope models runs prefixes advancing terminal seedComparisons tests referenceTests counters files','Reconstructed historical component check; controlled training feedback and phase/report sources. Early probability differences coexist with equal early actions; later four-probe sequences differ in all eight retained seeds. No native claim.'),
 'DEVELOPMENT_COMPONENT_CLOSURE_REV1.json':('status scope verdict models runs prefixes advancing terminal workerExitCodes counters files','Component qualification only; native OPEN here was subsequently discharged by a separate bounded public verdict. Four worker exits are operational receipts, not four extra programs.'),
 'DEVELOPMENT_PUBLIC_CHECK_REV3.json':('status scope models runs prefixes advancing terminal nativeStages tests referenceTests counters preservedOriginalPrefixes files','Exact component rows, inherited RNG and one successor per restored original prefix. 113 preserved originals are included in668, not additional coverage. Not full continuation tails.'),
 'DEVELOPMENT_PUBLIC_CLOSURE_REV1.json':('status verdict scope models programs prefixes advancing terminal nativeStages counters files','Bounded two-effect public integration, no general lifespan law. Historical qualification counts1508/0 remain historical, not current counters.'),
 'DEVELOPMENT_WRAPPER_EXTENSION_REV1.json':('status scope producers factories additions evidence','Historical54/57 publication inventory; source guards and focused tests are separate from36-program matrix. Later55/58 inventory does not retroactively change this receipt.'),
 'DEVELOPMENT_HARNESS_STARTUP_PROFILE.json':('nodes startTime endTime samples timeDeltas','Operational CPU profiler backing;4677 idle and2 program samples support the recorded idle startup observation, not a behavioral result or general performance diagnosis. Node hitCount and samples are distinct profiler fields.')
}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];sources={};bindings=[]
prior=P/'campaign3-history-development-sources-rev1/review.json';priorRows=load(prior)['rows']
for name,(keys,judgment) in specs.items():
 p=P/name;v=load(p);assert set(v)==set(keys.split());assert sha(p)==entries[p.as_posix()]['sha256'];sources[p.as_posix()]=v
 for key in ['files','additions','evidence']:
  for a in v.get(key,[]):
   assert set(a)=={'path','sha256'} and sha(a['path'])==a['sha256'];bindings.append(a)
 if 'counters' in v:
  assert v['models']==7 and v.get('runs',v.get('programs'))==36 and v['prefixes']==668 and v['advancing']==632 and v['terminal']==36
  assert v['counters']==dict(highestAllocated=1492 if 'COMPONENT' in name else 1508,sinceVerdict=0)
 if 'seedComparisons' in v:
  assert len(v['seedComparisons'])==8
  for i,s in enumerate(v['seedComparisons']):assert s==dict(seed=i,probabilityDifference=True,earlyChoiceDifference=False,choiceDifference=True,young=['A']*4,mature=['A','A','B','B'])
 if 'workerExitCodes' in v:assert v['workerExitCodes']==[0]*4
 if 'nativeStages' in v:assert v['nativeStages']==8216==632*13
 if 'preservedOriginalPrefixes' in v:assert v['preservedOriginalPrefixes']==113
 if 'tests' in v:assert v['tests']==(13 if 'COMPONENT' in name else 21) and v['referenceTests']==328
 if 'producers' in v:assert v['producers']==54 and v['factories']==57
 if 'nodes' in v:
  assert len(v['nodes'])==3 and len(v['samples'])==len(v['timeDeltas'])==4679
  assert collections.Counter(v['samples'])=={2:2,3:4677} and v['endTime']>v['startTime'] and all(isinstance(x,int) and x>0 for x in v['timeDeltas'])
  for i,n in enumerate(v['nodes']):
   assert set(n)==({'id','callFrame','hitCount','children'} if i==0 else {'id','callFrame','hitCount'})
   assert n['id']==i+1 and n['hitCount']==[0,1,4677][i]
   assert n['callFrame']==dict(functionName=['(root)','(program)','(idle)'][i],scriptId='0',url='',lineNumber=-1,columnNumber=-1)
  assert v['nodes'][0]['children']==[2,3]
  finding=P/'DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json';assert ref(p) in load(finding)['files']
 roles.append(dict(**ref(p),role='WHOLE CLOSURE / OPERATIONAL SCHEMA REVIEWED',judgment=judgment,acceptanceChain=[ref(prior),ref(p)]))
aliases={}
for lane in ['component','public']:
 target=f'docs/formal/DEVELOPMENT_{lane.upper()}_CONTRACT.md'
 assert any(x['source']==target for x in priorRows)
 for cohort in [1,2]:
  p=P/f'development-{lane}-dev{cohort}'/Path(target).name;assert p.read_bytes()==Path(target).read_bytes();assert sha(p)==entries[p.as_posix()]['sha256']
  manifest=p.parent/'MANIFEST.json';assert any(x['path']==target and x['sha256']==sha(p) for x in load(manifest)['files'])
  aliases[p.as_posix()]=target
  roles.append(dict(**ref(p),role='ARCHIVED CONTRACT WITH EXACT SEMANTIC JOIN',judgment='Same bounded contract text in preserved development cohort; earlier whole-contract review applies to content. Archive context preserves the original attempted cohort, not independent successful qualification. No added model/run coverage.',acceptanceChain=[ref(manifest),ref(target),ref(prior)]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources and p not in aliases:continue
  assert u['sourceSha256']==entries[p]['sha256']
  if p in sources:
   ptr=u['location']['pointer'];assert strings[p,ptr]==u['text'];role='SCOPED CLAIM' if ptr=='/scope' else 'TYPED BACKING FIELD'
   detail=specs[Path(p).name][1];links=[]
  else:
   matched=[x for x in priorRows if x['source']==aliases[p] and x['text']==u['text'] and x['location']==u['location']];assert len(matched)==1
   role='ARCHIVED CONTRACT OCCURRENCE';detail=next(x['judgment'] for x in roles if x['path']==p);links=[matched[0]['occurrenceId']]
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=role,judgment=detail,priorOccurrenceIds=links))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='TEN DEVELOPMENT CLOSURE/ARCHIVE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,bindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['No new tests, build, simulation or replay. Prior read-only component/public reconstruction receipts remain unchanged.','Hash binding does not accept every referenced source wholesale. Four exact archive joins retain source occurrence identities and failed-development context.','Two exploratory inspection commands failed on incorrect collection assumptions; read-only, no research data changed.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalOccurrences=len(rows),originalNarrativeOccurrences=sum(x['role']!='TYPED BACKING FIELD' for x in rows),originalBackingOccurrences=sum(x['role']=='TYPED BACKING FIELD' for x in rows),stringLeaves=len(strings),bindings=len(bindings),exactContractAliases=len(aliases),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
