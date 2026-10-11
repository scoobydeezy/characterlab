"""Reconcile preserved procrastination boundary cohort and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-procrastination-freeze-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev290/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
root=P/'campaign3-procrastination-model-rev1'
contract=root/'preserved/docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md'
allocation=root/'preserved/docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json'
frozen=load(root/'FREEZE.json');preservation=load(root/'PRESERVATION.json')
assert frozen['contractSha256']==ref(contract)['sha256'] and frozen['allocationSha256']==ref(allocation)['sha256']
assert len(frozen['models'])==4 and [(m['candidate'],m['law']) for m in frozen['models']]==[(i,1) for i in range(1,5)]
assert len({m['modelIdentity'] for m in frozen['models']})==4
for m in frozen['models']:
 assert len(m['files'])==4
 f=next(x for x in m['files'] if x['path'].endswith('/model-identity.cenc.hex'))
 assert Path(f['path']).read_text().strip()==m['modelIdentity']
a=load(allocation);b=load('docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json')
assert [k for k in a if a[k]!=b[k]]==['version']
assert len(preservation['artifacts'])==11
failure=load(P/'PROCRASTINATION_ADOPTION_FAILURE_REV1.json')
assert failure['success'] is False and (failure['numFailedTests'],failure['numPendingTests'])==(1,8)
old=contract.read_text();current=Path('docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md').read_text()
assert 'adoption at/after deadline6 rejects before execution' not in old
assert 'adoption at/after deadline6 rejects before execution' in current
notes={
(root/'FREEZE.json').as_posix():'Superseded pre-qualification0.1 cohort:four candidate identities under law1,16 artifact hashes and exact identity hex retained. Freeze explicitly does not imply public qualification. Adoption at/after deadline remained admitted; no public qualification used this cohort. Corrected0.2 changes admission and model identity without new allocation or valuation law. Retain all four temporal/motive competitors, not a selected universal discount law.',
(root/'PRESERVATION.json').as_posix():'Eleven exact preserved artifacts retain original contract/allocation/source/tests/harness after static review exposed late-adoption escape. First25 tests/build passed but missed the boundary; targeted failure has one failed test/eight skipped, not nine failures or a runtime qualification. Correct-forward0.2 rejects adoption6/7/8 before execution. Prior pass cannot erase omitted-boundary finding.',
contract.as_posix():'Historical0.1 contract superseded on admission boundary by0.2. It allowed instruction1 adoption without excluding at/after deadline6, bypassing terminality; preserved as rejected executable scope, never a qualified profile. Other distinctions remain: retained desire/access/current feasibility plus positive work ground and actual defer; independent immediate motive; fallible future evidence, next40 after120/140; intended work versus observed progress/physical execution; unknown versus unavailable; cancellation/fulfillment/deadline terminal states. Fixed1/4 candidate is not calibrated temporal value or capacity-aware planning. One later opening does not guarantee three required units can finish. Diagnostics do not create habit inputs. Later qualification is separately scoped.',
allocation.as_posix():'Historical backing allocation1353..1376/schema1 with reused namespace1155. All records/namespace/status match current allocation; version alone moves0.1 to0.2. Semantic field names/domains/roles are declaration backing, not behavioral qualification. Corrected admission uses new model version without new records. Preserve original contract and model identity rather than relabelling.'}
chain=[ref(P/n) for n in ['PROCRASTINATION_IMPLEMENTATION_FINDINGS.md','CAMPAIGN3_PROCRASTINATION_QUALIFICATION.md','PROCRASTINATION_ADOPTION_FAILURE_REV1.json']]+[ref('docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md')]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  else:
   for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):
 if p.endswith('.md'):return 'NARRATIVE'
 if Path(p).name=='PRESERVATION.json' and q in ['/status','/reason']:return 'NARRATIVE'
 if Path(p).name=='FREEZE.json' and q=='/status':return 'NARRATIVE'
 return 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT PROCRASTINATION BOUNDARY SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='SUPERSEDED PROCRASTINATION COHORT; CORRECT-FORWARD ADMISSION',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)
bind((root/'FREEZE.json').as_posix(),dict(path=contract.as_posix(),sha256=frozen['contractSha256']))
bind((root/'FREEZE.json').as_posix(),dict(path=allocation.as_posix(),sha256=frozen['allocationSha256']))

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
save('unresolved.json',dict(searchScope='Current named paths, REV290 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='SUPERSEDED PROCRASTINATION COHORT RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['All preserved references and four identity hex images checked; no runtime rerun.','First25 passing tests did not cover late adoption; targeted failure and corrected0.2 qualification retain distinct scope.','Fixed forecast valuation is not sufficient future capacity, universal discounting or habit. Independent adequacy remains open.'],obligations=['RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SUPERSEDED PROCRASTINATION COHORT ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),frozenModels=4,preservedArtifacts=11,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
