"""Whole developmental plan fields, controlled original inputs and historical source bindings."""
from pathlib import Path
import json,hashlib,re,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-plans-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def hx(s,n=None):assert isinstance(s,str) and re.fullmatch('[0-9a-f]+',s) and len(s)%2==0 and(n is None or len(s)==n)
def original(r,native):
 assert set(r)==set('name profile frames modelIdentity runIdentity'.split())|({'sourceHashes'} if native else set())
 assert isinstance(r['name'],str) and r['name'];hx(r['modelIdentity']);hx(r['runIdentity'])
 p=r['profile'];assert set(p)=={'curve','learning','formation','constitution'} and p['curve'] in ['Step','Ramp'] and type(p['constitution'])==int and p['constitution'] in [-1,0,1]
 assert type(p['learning'])==bool and type(p['formation'])==bool
 assert isinstance(r['frames'],list) and 1<=len(r['frames'])<=24;last=0
 for f in r['frames']:
  assert set(f)==set('phase exercise practice permitted difficulty report choice significance pressure setting seed'.split())
  assert type(f['phase'])==int and last<=f['phase']<=4;last=f['phase']
  assert type(f['difficulty'])==int and 0<=f['difficulty']<=8
  assert all(type(f[k])==bool for k in ['exercise','practice','permitted']) and(f['report'] is None or type(f['report'])==bool)
  assert f['choice'] in ['Learn','Probe','None','Forced'] and f['setting'] in ['Work','Home']
  assert all(type(f[k])==int and f[k] in [0,4] for k in ['significance','pressure'])
  assert type(f['seed'])==int and 0<=f['seed']<=255
 if native:
  assert set(r['sourceHashes'])=={'parameters','registry','initial','ordered'}
  for h in r['sourceHashes'].values():hx(h,64)
canonical=load(O/'canonical-check.json');entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];bindings=0
for rec in canonical['records']:
 path=Path(rec['path']);v=load(path);native='PUBLIC' in path.name
 assert sha(path)==rec['sha256']==entries[path.as_posix()]['sha256']
 assert set(v)=={'status','version','runs','experimentIdentity','comparisonCase','files'} and v['status']=='FROZEN BEFORE QUALIFICATION'
 assert v['version']==('development-public/0.1-candidate' if native else 'development-component/0.1-candidate')
 hx(v['experimentIdentity']);hx(v['comparisonCase']);assert len(v['runs'])==36
 for r in v['runs']:original(r,native)
 assert len({r['name'] for r in v['runs']})==36 and len({r['runIdentity'] for r in v['runs']})==36
 assert len({r['modelIdentity'] for r in v['runs']})==7
 for f in v['files']:assert set(f)=={'path','sha256'} and sha(f['path'])==f['sha256'];bindings+=1
 if not native:parent=P/'DEVELOPMENT_COMPONENT_CHECK_REV1.json'
 elif 'REV3' in path.name:parent=P/'DEVELOPMENT_PUBLIC_CHECK_REV3.json'
 else:parent=P/('DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json' if 'REV1' in path.name else 'DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json')
 assert any(f['path']==path.as_posix() and f['sha256']==sha(path) for f in load(parent)['files'])
 sources[path.as_posix()]=v;roles.append(dict(**ref(path),role='WHOLE DEVELOPMENT PLAN SCHEMA',judgment='Controlled finite inputs and exact source/identity graph. Freeze status is historical declaration supported by preserved successor records, not an independently authenticated timestamp. Candidate curves/flags remain distinct; no general maturation law.',acceptanceChain=[ref(parent),ref(path)]))
component=sources[(P/'DEVELOPMENT_COMPONENT_PLAN_REV1.json').as_posix()]
for p,v in sources.items():
 for a,b in zip(component['runs'],v['runs']):
  for k in ['name','profile','frames']:assert a[k]==b[k]
 if 'PUBLIC' in p:assert v['runs']==sources[(P/'DEVELOPMENT_PUBLIC_PLAN_REV1.json').as_posix()]['runs']
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
allStrings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert allStrings[(u['source'],u['location']['pointer'])]==u['text'] and u['location']['pointer']=='/status'
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='HISTORICAL FREEZE DECLARATION',judgment='Prospective plan declaration, not standalone timestamp evidence or experimental PASS. Separate final qualification and preserved interrupted cohorts determine completion.'))
faults=[]
for name,mut in [('new finding',lambda r:r.update(finding='Needs review')),('age regression',lambda r:r['frames'][1].update(phase=-1)),('collapsed enable',lambda r:r['profile'].update(formation='same as learning')),('truth instead of report',lambda r:r['frames'][0].update(report='actual success'))]:
 r=copy.deepcopy(component['runs'][0]);mut(r)
 try:original(r,False)
 except AssertionError:faults.append(name)
 else:raise AssertionError(name)
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='FOUR DEVELOPMENTAL PLANS WHOLE-SCHEMA RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(allStrings),artifactBindings=bindings,negativeControls=faults,canonical=ref(O/'canonical-check.json'),obligations=obs,limits=['Public plans retain identical36 model/run inputs; component inputs match but native identities differ intentionally.','Canonical coupling names all-prefix obligations; early interrupted cohorts do not satisfy them until final native qualification.','Transitive file hashes establish preservation, not whole-source semantic review. No new simulation or historical timing proof.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=4,originalOccurrences=len(rows),stringLeaves=len(allStrings),artifactBindings=bindings,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))
