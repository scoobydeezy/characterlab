"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prediction-design-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={}
for kind in ['PROOF','AUDIT']:
 for rev in [1,2]:
  n=f'MEASUREMENT_PREDICTION_RUNTIME_{kind}_REV{rev}.json'
  notes[n]=('Five passing component baseline tests and five named source substitutions with failed-test counts1/2/1/1/1. Repeat-observation freshness, mean-vs-last,65thlimit, phasebackedge and extraoutput detected in named scopes only. Public and component test paths distinct. Proof revisions identical except source fingerprints; no independent-target freeze witness or whole qualification. Current writer performs one exact transform and rejects unhandled errors, but its old source hash is unresolved; inspection is not historical-source verification.' if kind=='PROOF' else 'Byte/fingerprint audit with190preserved count and18inherited receipt references, not raw full test output or timestamp. Model digest same across revisions. REV1 records1124combined=796fresh+328reference plus separate8stage/1forgery; REV2 records974pre-final-task-hardening,328reference and24post-correction-task tests separately. Five inherited report identities advance; neither revisions nor counts are additive unique qualification. Source gaps explicitly limit adequacy; exact inherited report matches do not recover those missing source bytes.')
notes={(P/k).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev228/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
O=P/'campaign3-history-prediction-runtime-rev1';O.mkdir(exist_ok=True)
import subprocess,collections
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];missing={};preserved=[]
for p in notes:
 v=load(p)
 for r in v['sourceFingerprints']+v.get('inheritedReports',[]):
  actual=Path(r['path']) if ref(r['path'])['sha256']==r['sha256'] else Path(archives[r['sha256']]) if r['sha256'] in archives else None
  key=(r['path'],r['sha256'])
  if actual is None and key not in missing:
   revs=subprocess.check_output(['git','log','--all','--format=%H','--',r['path']],text=True).split();found=None
   for rev in revs:
    raw=subprocess.check_output(['git','show',rev+':'+r['path']]);lf=raw.replace(b'\r\n',b'\n')
    for mode,data in [('raw',raw),('LF',lf),('CRLF',lf.replace(b'\n',b'\r\n'))]:
     if hashlib.sha256(data).hexdigest()==r['sha256'] and found is None:found=(rev,mode,data)
   copies=list(P.rglob(Path(r['path']).name));hits=[x for x in copies if ref(x)['sha256']==r['sha256']]
   if found:
    rev,mode,data=found;actual=O/('historical-'+r['sha256'][:12]+'-'+Path(r['path']).name)
    if actual.exists():assert actual.read_bytes()==data
    else:actual.write_bytes(data)
    archives[r['sha256']]=actual.as_posix();preserved.append(dict(**ref(actual),method='Exact Git '+rev+' '+r['path']+' '+mode))
   elif hits:actual=hits[0]
   else:missing[key]=dict(**r,gitRevisions=revs,newlineVariants=['raw','LF','CRLF'],workspaceCandidates=[ref(x) for x in copies],scope='Current named path, indexed1220backing hashes, path-specific all-Git revisions and planning copies sharing basename; not global absence.')
  if actual is not None:
   assert ref(actual)['sha256']==r['sha256'];bindings.append(dict(receipt=p,original=r,actual=ref(actual)))
a=load(P/'MEASUREMENT_PREDICTION_RUNTIME_PROOF_REV1.json');b=load(P/'MEASUREMENT_PREDICTION_RUNTIME_PROOF_REV2.json')
assert {k:v for k,v in a.items() if k!='sourceFingerprints'}=={k:v for k,v in b.items() if k!='sourceFingerprints'}
assert len(a['baseline']['tests'])==5 and all(x['state']=='pass' for x in a['baseline']['tests'])
assert [sum(t['state']=='fail' for t in m['tests']) for m in a['mutants']]==[1,2,1,1,1]
assert all(m['status']=='DETECTED' and m['test'].endswith(('campaign2PredictionComponent.test.ts','campaign2Prediction.test.ts')) for m in a['mutants'])
c=load(P/'MEASUREMENT_PREDICTION_RUNTIME_AUDIT_REV1.json');d=load(P/'MEASUREMENT_PREDICTION_RUNTIME_AUDIT_REV2.json')
assert [k for k in c if c[k]!=d.get(k)]==['sourceFingerprints','inheritedReports','reportedExecutedRuns']
assert c['modelDigest']==d['modelDigest'] and c['preservedArtifactCount']==d['preservedArtifactCount']==190
assert len(c['inheritedReports'])==len(d['inheritedReports'])==18
assert sum(x!=y for x,y in zip(c['inheritedReports'],d['inheritedReports']))==5
assert [r['tests'] for r in c['reportedExecutedRuns']]==[1124,8,1] and [r['tests'] for r in d['reportedExecutedRuns']]==[974,328,24]
assert c['reportedExecutedRuns'][0]['fresh']['tests']+c['reportedExecutedRuns'][0]['reference']['tests']==1124
save('unresolved.json',dict(status='SIX EXACT SOURCE GROUPS UNRESOLVED; THREE ALREADY RECORDED',sources=list(missing.values()),limits='Three repeated scheduler/adaptation groups plus prediction execution, original proof writer and earlier trace binding; no global deduplication or absence claim. Resolve bytes or dependent claims in independent adequacy.'))
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','name','checks','errors','scope'])
chain=[ref(P/'campaign3-history-prediction-qualification-rev1/review.json')];sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL EXPLORATION / DERIVED STAGE ACCOUNTING',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({x['occurrenceId'] for x in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='FOUR PREDICTION RUNTIME RECEIPTS RECONCILED; SOURCE ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=preserved,unresolved=ref(O/'unresolved.json'),limits=['Proof revisions share all result rows but different source bindings; not two independent behavioral findings.','Audit counters record separate test runs, not raw execution logs or newly rerun tests.','Six exact source groups unresolved after bounded search, including three previously known; one trace source recovered.','No runtime/model/law/allocation/verdict/corpus/obligation status change; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED RUNTIME RECEIPT CONSISTENCY; SOURCE GAPS OPEN',sources=4,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newArchives=len(preserved),unresolvedGroups=len(missing),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
