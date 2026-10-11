"""Reconcile all three native development prefix cohorts and their two findings."""
from pathlib import Path
import json,hashlib,re,copy,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-prefixes-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def hx(v):assert isinstance(v,str) and re.fullmatch('[0-9a-f]{64}',v)
plans={i:load(P/f'DEVELOPMENT_PUBLIC_PLAN_REV{i}.json') for i in [1,2,3]};planHashes={i:sha(P/f'DEVELOPMENT_PUBLIC_PLAN_REV{i}.json') for i in plans}
assert plans[1]['runs']==plans[2]['runs']==plans[3]['runs']
def validate(v,rev):
 base=set('status planSha256 index at save view next advanced'.split());assert set(v) in [base,base|{'preservedPrefix'}]
 assert v['status']=='PASS' and v['planSha256']==planHashes[rev]
 assert type(v['index'])==int and 0<=v['index']<36
 length=len(plans[rev]['runs'][v['index']]['frames']);assert type(v['at'])==int and 0<=v['at']<=length
 assert type(v['advanced'])==bool and v['advanced']==(v['at']<length)
 for k in ['save','view','next']:hx(v[k])
 if not v['advanced']:assert v['next']==v['save']
 if 'preservedPrefix' in v:
  a=v['preservedPrefix'];assert set(a)=={'path','sha256'};hx(a['sha256'])
  assert a['path']==(P/f"development-public-prefixes-rev{rev-1}/{v['index']}-{v['at']}.json").as_posix() or rev==3 and a['path']==(P/f"development-public-prefixes-rev1/{v['index']}-{v['at']}.json").as_posix()
  assert sha(a['path'])==a['sha256'];old=load(a['path']);oldrev=int(re.search('prefixes-rev(\d)',a['path'])[1]);validate(old,oldrev)
  drop=lambda x:{k:y for k,y in x.items() if k not in ['planSha256','preservedPrefix']}
  assert drop(old)==drop(v)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};allSources={};roles=[];cohorts={};strings=0
checkPath=P/'DEVELOPMENT_PUBLIC_CHECK_REV3.json';check=load(checkPath);checkFiles={f['path']:f['sha256'] for f in check['files']}
closure=P/'DEVELOPMENT_PUBLIC_CLOSURE_REV1.json';assert any(x['path']==checkPath.as_posix() and x['sha256']==sha(checkPath) for x in load(closure)['files'])
for rev in [1,2,3]:
 group={}
 for path in sorted((P/f'development-public-prefixes-rev{rev}').glob('*.json')):
  v=load(path);validate(v,rev);assert path.name==f"{v['index']}-{v['at']}.json";assert sha(path)==entries[path.as_posix()]['sha256']
  group[(v['index'],v['at'])]=path;allSources[path.as_posix()]=v
 cohorts[rev]=group
assert [len(cohorts[i]) for i in [1,2,3]]==[94,99,668]
assert len(set(cohorts[1])|set(cohorts[2]))==113
assert set(cohorts[1])|set(cohorts[2])<=set(cohorts[3])
for i in range(36):
 path=P/f'DEVELOPMENT_PUBLIC_RUN_{i}_REV3.json';r=load(path);assert sha(path)==checkFiles[path.as_posix()]
 assert len(r['prefixes'])==len(plans[3]['runs'][i]['frames'])+1
 for v in r['prefixes']:
  p=cohorts[3][(i,v['at'])];assert load(p)==v;assert v['next']==r['prefixes'][min(v['at']+1,len(r['prefixes'])-1)]['save']
for rev in [1,2,3]:
 for key,path in cohorts[rev].items():
  final=load(cohorts[3][key]);old=load(path);drop=lambda x:{k:y for k,y in x.items() if k not in ['planSha256','preservedPrefix']};assert drop(final)==drop(old)
  chain=[ref(closure),ref(checkPath),ref(P/f'DEVELOPMENT_PUBLIC_RUN_{key[0]}_REV3.json'),ref(cohorts[3][key])]
  if rev<3:chain.append(ref(path))
  roles.append(dict(**ref(path),role='CLOSED-SCHEMA ORIGINAL NATIVE PREFIX RECEIPT',judgment='Exact source/plan/coordinate binding, save/view/next equality and successor-or-terminal status. Historical actual-restore provenance persists; copies add no unique coverage. Hash receipts are not fresh replay.',acceptanceChain=chain))
judgments={2:'Four full programs and94 original prefixes preserved. Audit-only trusted-trace refinement replaced for performance; earlier successful actual restores reused only with exact replayed save/view/next equality. Intentional stop exits are not failed behavioral assertions.',3:'Watcher backlog diagnosis and3.209-second no-watch probe justify batch watcher removal, not general scaling.94 earlier plus99 second-harness files represent113 unique restored prefixes, not193.555 final prefixes newly restored at original qualification; historical reports do not claim fresh execution now.'}
for rev in [2,3]:
 path=P/f'DEVELOPMENT_PUBLIC_HARNESS_REV{rev}_FINDING.json';v=load(path)
 allowed={2:'status preservedPrograms preservedPrefixes intentionalWorkerStopExitCodes finding successor files',3:'status originalPrefixes secondHarnessPrefixes uniquePreservedRestores completedPrograms intentionalWorkerStops finding successor files'}[rev]
 assert set(v)==set(allowed.split()) and sha(path)==checkFiles[path.as_posix()]==entries[path.as_posix()]['sha256']
 for f in v['files']:assert set(f)=={'path','sha256'} and sha(f['path'])==f['sha256']
 allSources[path.as_posix()]=v;roles.append(dict(**ref(path),role='WHOLE PRESERVED HARNESS FINDING',judgment=judgments[rev],acceptanceChain=[ref(closure),ref(checkPath),ref(path)]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
allStrings={(p,ptr):s for p,v in allSources.items() for ptr,s in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in allSources:continue
  assert allStrings[(u['source'],u['location']['pointer'])]==u['text']
  assert 'HARNESS' in u['source'] and u['location']['pointer'] in ['/status','/finding','/successor']
  rev=int(re.search('HARNESS_REV(\d)',u['source'])[1]);rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],judgment=judgments[rev],role='PRESERVED HARNESS FINDING'))
faults=[]
for name,mut in [('extra finding',lambda v:v.update(finding='Needs review')),('bad next',lambda v:v.update(next='x')),('wrong plan',lambda v:v.update(planSha256='0'*64)),('false advance',lambda v:v.update(advanced=False))]:
 v=copy.deepcopy(load(cohorts[3][(0,0)]));mut(v)
 try:validate(v,3)
 except AssertionError:faults.append(name)
 else:raise AssertionError(name)
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
v=dict(status='ALL861 PREFIX RECEIPTS AND TWO HARNESS FINDINGS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(allStrings),cohortFiles=[94,99,668],uniqueFinalPrefixes=668,uniqueEarlierRestores=113,newAtFinalQualification=555,negativeControls=faults,obligations=obs,limits=['No fresh simulation or restore; source/receipt reconciliation only.','Parent run rows and plans are not whole-reviewed by prefix linkage.','Operational memory failures and other development sources remain separately preserved; no low-memory/long-horizon claim.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=len(roles),originalOccurrences=len(rows),stringLeaves=len(allStrings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))
