"""Reconcile prediction declaration review copies and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prediction-packets-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev288/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
pc=load(O/'packet-check.json');assert pc['status']=='PASS READ-ONLY PREDICTION PACKETS'
assert pc['checkerSha256']==ref('scripts/check-history-prediction-packets.mjs')['sha256']
dirs=['campaign2-measurement-prediction-review','campaign2-measurement-prediction-review-rev2','campaign2-measurement-prediction-model']
a,b,c=[load(P/d/'REVIEW_MANIFEST.json') for d in dirs]
assert b==c and b['checks'][:len(a['checks'])]==a['checks'] and len(a['checks'])==70 and len(b['checks'])==73
assert b['checks'][70:]==[dict(name=n,status='PASS') for n in ['legacy368/1 rejects','old memory factory rejects new profile','relabelled new records cannot enter old memory profile']]
assert b['sourceFingerprints'][1:]==a['sourceFingerprints']
assert [k for k in a if a[k]!=b[k]]==['checks','sourceFingerprints']
assert len(a['preservedSources'])==166 and a['controls']==64
assert all(x['status']=='PASS' for x in b['checks'])
for name in ['content.json','parameters.json','registry.json','model-identity.json','CONTROL_COMMITMENTS.json','content.cenc.hex','parameters.cenc.hex','registry.cenc.hex','model-identity.cenc.hex']:
 assert len({ref(P/d/name)['sha256'] for d in dirs})==1
freeze=load(P/dirs[-1]/'FREEZE.json')
assert freeze['sourceFingerprints']==b['sourceFingerprints'] and freeze['preservedSources']==b['preservedSources']
assert freeze['modelDigest']==c['modelDigest'] and freeze['controlCount']==64
assert freeze['runtime']=='IMPLEMENTATION AUTHORIZED; PRED-A..P NOT PASSED'
notes={}
for d in dirs:
 for p in sorted((P/d).glob('*.json')):
  if p.name=='REVIEW_MANIFEST.json':n='Declaration review only:64 boolean control selections, real VAL/CONTENT role and structural ownership checks. Initial70 checks retained; REV2 adds368/1 rejection, old-memory profile rejection and rejection of relabelled prediction declarations. Only checks and materializer fingerprint change; all model and control bytes are equal across three packets.166 preservation entries are not166 behavioral tests. No prediction runtime/application/read/trace/restore executes; later qualified execution is separately scoped. Rules0.1 and component semantics0.2 have distinct owners. Single application/no cross-key public reads cannot prove a live-versus-frozen numeric collision.'
  elif p.name=='FREEZE.json':n='Accepted separate freeze of review-rev2 baseline and64 declared control commitments; ten stored file hashes verified. Implementation authorized, PRED-A..P explicitly not passed at this point. Freeze is not behavioral qualification. Corrected367/2 and368/2 with retired occurrence-rule field; old profile exclusion does not license a global dispatcher relaxation. Later qualification has its own evidence.'
  elif p.name=='CONTROL_COMMITMENTS.json':n='Backing declaration identities: all64 unique combinations of availability, permission, formation, memory-read, application and prediction-read.64 unique stored model and registry digests, identical across copies. All-enabled baseline matches reconstructed identity and registry bytes; other63 model images are not stored in these packets and are not freshly reconstructed here. Selector enumeration and digest uniqueness do not prove runtime behavior.'
  elif p.name=='registry.json':n='Readable six-slot canonical registry backing. Schema/domain/role/phase/ownership strings are declarations, not independently qualified psychological mechanisms. Exactly decoded/re-encoded and matched to rendering and model commitment. Identical across review copies and freeze; no runtime qualification from registry inclusion.'
  elif p.name=='model-identity.json':n='Backing ModelIdentity with separately owned rules/content/parameter/numeric/random/registry versions and commitments. Exact canonical round trip, three manifest commitments and model digest checked. Same identity across three packets, despite review metadata additions; no semantic/version alias or migration implied.'
  else:n='Readable canonical authored content or parameter backing, exactly paired with stored canonical bytes and recomputed commitment. Identical across three packets. Specimen declarations are not world state, learned beliefs, behavioral findings or general parameter laws.'
  notes[p.as_posix()]=n
assert len(notes)==19
chain=[ref(P/n) for n in ['CAMPAIGN2_MEASUREMENT_PREDICTION_PACKAGING_REVIEW.md','CAMPAIGN2_MEASUREMENT_PREDICTION_QUALIFICATION.md']]
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
 if Path(p).name=='REVIEW_MANIFEST.json' and (q=='/status' or q.startswith(('/limitations/','/checks/'))):return 'NARRATIVE'
 if Path(p).name=='FREEZE.json' and q in ['/status','/runtime','/campaign2']:return 'NARRATIVE'
 return 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT PREDICTION DECLARATION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='PREDICTION DECLARATION PACKET OR FREEZE; RUNTIME QUALIFICATION SEPARATE',judgment=n,acceptanceChain=chain))
 v=load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)
 if Path(p).name=='FREEZE.json':
  for f in v['files']:bind(p,dict(path=(Path(p).parent/f['name']).as_posix(),sha256=f['sha256']))
for x in pc['artifacts']:bind((O/'packet-check.json').as_posix(),dict(path=x['path'],sha256=x['sha256']))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV288 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='PREDICTION DECLARATION PACKETS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),packetCheck=ref(O/'packet-check.json'),limits=['All baseline canonical/readable pairs checked; other63 stored control digests are not a fresh reconstruction.','Current codec checks prove stored byte consistency, not historical execution timing or source-exact construction.','Declaration, freeze, generic collisions and public runtime qualification remain separate. Missing source identities remain explicit. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS PREDICTION PACKET ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),canonicalReadablePairs=12,manifestCommitments=9,storedControls=64,initialDeclarationChecks=70,successorDeclarationChecks=73,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
