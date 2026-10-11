"""Reconcile task lifecycle comparison, mutation and preservation receipts."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-task-runtime-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/TASK_LIFECYCLE_HISTORICAL_COMPARISON_REV1.json': 'Five quiescent checkpoints0/2/3/4/7 with live lists[]/[0]/[0]/[1]/[]. External comparison selects eligible Open within activeFrom<=clock<deadline and passes that live list into actual reference commitmentSignals; reference does not implement automatic lifecycle. Same holder still two distinct obligation referents, not synthetic Need or stakeholder identity. Fixed authored1/10 pressure and control/action are controls, not earned motive/efficacy/canonical workspace. Original comparison script and reference component inspected, not rerun. Source taskExecution recovered exactly; no new full identity-rich lifecycle or social-choice qualification.', 'docs/planning/TASK_LIFECYCLE_RUNTIME_PROOF_REV1.json': 'Stored24-test baseline pass; seven named substitutions detected with failed-test counts3/1/1/1/1/1/1. Tests separate inclusive reading bounds, half-open task lifetime, immutable terminal statuses, before-read source/time/collision guards and seven whole-instant rollback sites. Baseline excludes64fixed-slot combinations; mutation-selected tests are not seven full-suite reruns. Public and synthetic duplicate-clock component targets distinguished. REV2 has identical results and only writer fingerprint changes; original writer exact bytes missing, so current writer inspection is not old execution verification. Scheduler old bytes also unresolved; no later motive/arbitration/RNG claim.', 'docs/planning/TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json': 'Same24-test baseline and seven source-substitution results asREV1, different writer fingerprint. Exact current writer rejects unhandled errors, requires exactly one transform and at least one named failing test, preserves source fingerprints and resets expected mutation exit status. It excludes64fixed-slot test names; public replay boundary and synthetic target collision remain separate. Three original production sources recovered exactly, scheduler group remains unresolved. Stored mutation evidence is bounded and not newly executed or complete TC/cognition qualification.', 'docs/planning/TASK_LIFECYCLE_RUNTIME_AUDIT_REV1.json': '212preserved artifacts and fixed model digest are byte-preservation evidence. Stored974pre-hardening baseline,24focused runtime/boundary plus5preservation and328reference counts have separate scopes; reference config-loader rejection preserved with explicit-config success. Eighteen inherited packet currency rows include five changed-source packets, not blanket current qualification. Exact5test preservation source hash remains unresolved. Source currency is not scientific sufficiency, full logs or timestamps.', 'docs/planning/TASK_LIFECYCLE_RUNTIME_AUDIT_REV2.json': 'Same212preserved bytes/model/reports asREV1. Only preservation-test hash, post-correction5->9count and five inherited packet replacements change; all18currency rows then record empty changedSources. Not nine additional tests on top of five or a fresh974fullsuite afterhardening.24focused tests and328reference remain separate. Later report identities do not alter old receipts; current hash match provesbytes not retrospective execution. No cognitive/RNG/latermechanism qualification.'}
ip=P/'campaign3-history-source-roles-rev237/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
O=P/'campaign3-history-task-runtime-rev1';O.mkdir(exist_ok=True)
import subprocess,collections
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];missing={};preserved=[]
for p in notes:
 v=load(p)
 for r in sum([v.get(k,[]) for k in ['sourceFingerprints','preserved','reports','tests']],[]):
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
   else:missing[key]=dict(**r,gitRevisions=revs,newlineVariants=['raw','LF','CRLF'],workspaceCandidates=[ref(x) for x in copies],scope='Current named path, indexed1221backing hashes, path-specific all-Git revisions and planning copies sharing basename; not global absence.')
  if actual is not None:
   assert ref(actual)['sha256']==r['sha256'];bindings.append(dict(receipt=p,original=r,actual=ref(actual)))
a=load(P/'TASK_LIFECYCLE_RUNTIME_PROOF_REV1.json');b=load(P/'TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json')
assert {k:v for k,v in a.items() if k!='sourceFingerprints'}=={k:v for k,v in b.items() if k!='sourceFingerprints'}
assert len(a['baseline']['tests'])==24 and all(x['state']=='pass' for x in a['baseline']['tests'])
assert [sum(t['state']=='fail' for t in m['tests']) for m in a['mutants']]==[3,1,1,1,1,1,1]
assert len(a['mutants'])==7 and all(m['status']=='DETECTED' for m in a['mutants'])
assert sum(x!=y for x,y in zip(a['sourceFingerprints'],b['sourceFingerprints']))==1
c=load(P/'TASK_LIFECYCLE_RUNTIME_AUDIT_REV1.json');d=load(P/'TASK_LIFECYCLE_RUNTIME_AUDIT_REV2.json')
assert [k for k in c if c[k]!=d.get(k)]==['tests','checks','inheritedPacketCurrency']
assert c['preserved']==d['preserved'] and len(c['preserved'])==c['preservedCount']==d['preservedCount']==212
assert c['modelDigest']==d['modelDigest'] and c['reports']==d['reports']
assert len(c['inheritedPacketCurrency'])==len(d['inheritedPacketCurrency'])==18
assert sum(x!=y for x,y in zip(c['inheritedPacketCurrency'],d['inheritedPacketCurrency']))==5
assert sum(bool(x['changedSources']) for x in c['inheritedPacketCurrency'])==5 and all(not x['changedSources'] for x in d['inheritedPacketCurrency'])
assert sum(x!=y for x,y in zip(c['tests'],d['tests']))==1
assert [k for k in c['checks'] if c['checks'][k]!=d['checks'][k]]==['postCorrection']
h=load(P/'TASK_LIFECYCLE_HISTORICAL_COMPARISON_REV1.json')
assert [x['instant'] for x in h['history']]==['0','2','3','4','7']
assert [x['liveInstances'] for x in h['history']]==[[],[0],[0],[1],[]]
for x in h['history']:assert x['referenceSignals']==[dict(referent=f'task-{i}',role='MotiveGenerating',strength='1/10') for i in x['liveInstances']]
assert h['sameHolderDistinctInstances'] is True
save('unresolved.json',dict(status='THREE EXACT SOURCE GROUPS UNRESOLVED; SCHEDULER PREVIOUSLY RECORDED',sources=list(missing.values()),limits='Scheduler repeated from earlier audits; original task mutation writer and five-test preservation source remain missing after bounded search. Recover bytes or explicitly disposition dependent claims during independent adequacy; no global absence claim.'))

def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','name','checks','errors','scope'])
chain=[ref(P/'campaign3-history-task-lifecycle-rev1/review.json'),ref(P/'campaign3-history-task-packaging-rev1/review.json')];sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL TASK LIFECYCLE COMPARISON / MUTATION / PRESERVATION RECEIPT',judgment=n,acceptanceChain=chain))
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
save('review.json',dict(status='FIVE TASK RUNTIME RECEIPTS RECONCILED; SOURCE ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=preserved,unresolved=ref(O/'unresolved.json'),limits=['External live-list comparison calls actual reference signal component but supplies lifecycle eligibility externally; no canonical cognition join.', 'Proof result rows are identical across revisions; original writer identity differs and stays unresolved.', 'Three production sources recovered exactly; original preservation-test/writer and repeated scheduler source remain unresolved after bounded search.', 'Stored24test/7mutant and974/328/5or9 counts retain separate scopes; no runtime/test/build rerun.', 'No model/law/allocation/verdict/corpus/obligation status change; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED RUNTIME RECEIPT CONSISTENCY; SOURCE GAPS OPEN',sources=5,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newArchives=len(preserved),unresolvedGroups=len(missing),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
