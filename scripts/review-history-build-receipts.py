"""Reconcile historical build receipts without manufacturing fresh execution."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-build-receipts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','boundary','generatedBuildInfo','trackedBuildInfo'])
ip=P/'campaign3-history-source-roles-rev204/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and ('BUILD' in Path(p).name or 'TYPECHECK' in Path(p).name) and 'METADATA_PROOF' not in p];assert len(paths)==13
archive={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archive.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
for i in [1,2]:
 for p in sorted((P/f'biology-public-development-rev{i}').rglob('*')):
  if p.is_file():archive.setdefault(ref(p)['sha256'],p.as_posix())
bindings=[]
for p in paths:
 v=load(p);assert v['status']=='PASS'
 for q,x in objects(v):
  if 'exitCode' in x:assert x['exitCode']==0
  if 'path' in x and 'sha256' in x:
   actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archive[x['sha256']]
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(owner=p,pointer=q,original=dict(path=x['path'],sha256=x['sha256']),actual=ref(actual)))
assert len(bindings)==88
bio=[{x['path']:x['sha256'] for x in load(P/f'BIOLOGY_PUBLIC_BUILD_REV{i}.json')['artifacts']} for i in [1,2,3]]
assert set(bio[0])==set(bio[1]) and {k for k in bio[0] if bio[0][k]!=bio[1][k]}=={'src/campaign3/biologyPublicFactory.ts','scripts/qualify-biology-public.mjs'}
assert set(bio[2])-set(bio[1])=={'src/campaign3/biologyPublicBytes.ts'}
notes={};sources=[];leaves=[];rows=[];counts=collections.Counter()
for p in paths:
 n=Path(p).name
 common='Recorded historical build/type/boundary result, not raw process output, fresh execution, full active-suite passage or behavioral qualification. Exact file bindings prove bytes, not execution time or complete dependency coverage. '
 if n.startswith('BIOLOGY_PUBLIC'):domain='biology-findings';detail='Public REV1/2 retain earlier save-admission implementation; REV2 changes factory and qualifier only. REV3 adds bytes helper and updates admission-related artifacts. Successful builds do not erase large-save admission failure, duplicate writer rejection, or later wrapper-publication obligations.'
 elif n.startswith('BIOLOGICAL_SYSTEM'):domain='biology-findings';detail='Twelve exact artifact references. Does not erase masked relief/harm sensing, withholding pleasure credit, same-tick adaptation leakage or unconditional positive-belief access development findings; bounded biological qualification requires its separate trajectory evidence.'
 elif n.startswith('BIO_COMPARISON'):domain='biology-comparisons';detail='Brief command/boundary receipt has no artifact hash list or raw compiler log. Source identity must be obtained from separate reviewed cohort commitments, not invented from current files.'
 elif n.startswith('BODY_OWNERSHIP'):domain='body-ownership';detail='Brief command/boundary receipt has no artifact hash list or raw compiler log. Ownership behavior depends on separate experiment evidence; build success alone cannot establish disjoint writers.'
 elif n.startswith('LONGITUDINAL'):domain='long-authority';detail='Final typecheck follows explicit inspection-array annotation correction.328 reference tests are a recorded companion count, not TypeScript test execution or a newly run suite. Earlier semantic0.1 standing failure and later0.2 successor remain separate; type correction is not behavioral repair.'
 else:
  domain=n.split('_')[0].lower()+'-authority';detail='Scoped command summary preserves no-full-active-suite limitation. Restored buildinfo and prior closure names are historical housekeeping assertions, not exact manifests or a fresh integrity replay. Named source hashes, where present, are resolved without substituting current changed code.'
 chain=[ref(P/f'campaign3-history-{domain}-rev1/review.json')]
 assert ref(p)['sha256']==entries[p]['sha256']
 notes[p]=common+detail;sources.append(dict(**ref(p),role='HISTORICAL BUILD / TYPECHECK RECEIPT; BOUNDED SUPPORT ONLY',judgment=notes[p],acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='Every JSON string leaf including short status,command,path and hash values. Numeric fields remain bound by source digest.'))
save('review.json',dict(status='13 HISTORICAL BUILD/TYPECHECK RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],schema=ref(O/'schema.json'),limits=['No build,test,runtime or historical writer rerun.','No full dependency-manifest or timestamp claim from partial artifact references.','No new source gap in this batch; all existing historical identity and adequacy gaps remain open.','No model,law,allocation,verdict,corpus or obligation status changed.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT HISTORICAL BUILD RECEIPT JOINS',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
