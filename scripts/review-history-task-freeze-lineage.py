"""Reconcile task declaration review copies and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-task-freeze-lineage-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev289/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
dirs=['campaign2-task-commitment-review','campaign2-task-commitment-review-rev2','campaign2-task-commitment-model']
a,b,c=[load(P/d/'REVIEW_MANIFEST.json') for d in dirs]
assert b==c and [k for k in a if a[k]!=b[k]]==['sourceFingerprints']
changed=[x['path'] for x,y in zip(a['sourceFingerprints'],b['sourceFingerprints']) if x!=y]
assert changed==['src/campaign2/taskDeclarations.ts','src/test/campaign2TaskDeclarations.test.ts']
assert len(b['preservedSources'])==193 and len(b['checks'])==8
assert b['counts']['specimens']==3 and b['counts']['controlCombinations']==192
budget=b['eventBudget'];assert budget['status']=='DERIVED, NOT TASK RUNTIME EXECUTED'
assert budget['priorConsecutiveProbeEvents']+budget['taskMeasurementSlots']+budget['maxDeadlineSlots']==budget['derivedMaxProbeEvents']==17
assert budget['ceiling']==100
freeze=load(P/dirs[-1]/'FREEZE.json')
assert freeze['modelDigest']==b['normalModelDigest'] and freeze['profiles']==b['profiles'] and freeze['semanticBundle']==b['semanticBundle']
assert freeze['sourceFingerprints']+freeze['constructionEvidenceFingerprints']!=b['sourceFingerprints']
assert {tuple(x.items()) for x in freeze['sourceFingerprints']+freeze['constructionEvidenceFingerprints']}=={tuple(x.items()) for x in b['sourceFingerprints']}
assert freeze['runtime']=='IMPLEMENTATION AUTHORIZED; TC-A..L FROZEN NOT PASSED'
for name in ['content.cenc.hex','parameters.cenc.hex','registry.cenc.hex','model-identity.cenc.hex','CONTROLS.json']:
 assert len({ref(P/d/name)['sha256'] for d in dirs})==1
controls=load(P/dirs[-1]/'CONTROLS.json');assert len(controls)==192 and len({x['modelDigest'] for x in controls})==192
specimens={x['specimen'] for x in controls};assert len(specimens)==3
for specimen in specimens:
 subset=[x for x in controls if x['specimen']==specimen]
 assert len(subset)==64 and {tuple(x['flags']) for x in subset}=={tuple(bool(i&(1<<j)) for j in range(6)) for i in range(64)}
 assert len({x['contentDigest'] for x in subset})==1
assert any(x['modelDigest']==freeze['modelDigest'] and all(x['flags']) for x in controls)
notes={}
for d in dirs:
 p=P/d/'REVIEW_MANIFEST.json'
 notes[p.as_posix()]='Historical lifecycle declaration audit:three specimens x64 inherited boolean controls give192 distinct stored model identities. Eight check descriptions summarize construction, not eight runtime scenarios. Review2 changes only taskDeclarations and its test fingerprint; model/control files match across copies.193 preservation entries are not behavioral runs. Derived17-event budget equals14+1+2 under ceiling100, not observed runtime accounting. TC-A..L not passed at declaration time; no workspace/appraisal/motive/option activation. Shared-criterion correction has new construction evidence without changing frozen model bytes.'
notes[(P/dirs[-1]/'FREEZE.json').as_posix()]='Accepted lifecycle-only freeze: model digest, bundle/profiles and six file hashes match review2. Canonical source builders and construction-evidence identities remain separately named; later corrections must preserve history. Implementation authorization is not TC-A..L qualification. Empty output closures, separate task/character kinds, no added StateMapKey roles, and counted private deadlines remain boundaries. Derived event budget and192 construction commitments cannot substitute for runtime/restore/rollback evidence. Later lifecycle qualification separately scoped.'
chain=[ref(P/n) for n in ['CAMPAIGN2_TASK_PACKAGING_ACCEPTANCE.md','CAMPAIGN2_TASK_LIFECYCLE_QUALIFICATION.md']]
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
 if Path(p).name=='REVIEW_MANIFEST.json' and (q=='/status' or q.startswith(('/limitations/','/checks/','/eventBudget/'))):return 'NARRATIVE'
 if Path(p).name=='FREEZE.json' and q in ['/status','/runtime','/scope','/preservation','/acceptance']:return 'NARRATIVE'
 return 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT TASK DECLARATION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='TASK DECLARATION PACKET OR FREEZE; RUNTIME QUALIFICATION SEPARATE',judgment=n,acceptanceChain=chain))
 v=load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)
 if Path(p).name=='FREEZE.json':
  for f in v['files']:bind(p,dict(path=(Path(p).parent/f['name']).as_posix(),sha256=f['sha256']))

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV289 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='TASK DECLARATION PACKETS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Five model/control files match across three copies;192 stored control identities are not a fresh reconstruction.','Stored file hashes and declaration metadata checked; no codec/runtime/historical construction rerun or timing claim.','Declaration, freeze, generic collisions and public runtime qualification remain separate. Missing source identities remain explicit. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS TASK FREEZE LINEAGE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),storedControls=192,specimens=3,derivedEventBudget=17,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
