"""Reconcile exact canonical packet backing and historical materialization limits."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-packets-rev1'
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
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','amendment','blocker','checks'])
ip=P/'campaign3-history-source-roles-rev218/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
dirs=['campaign2-measurement-memory-model','campaign2-measurement-memory-blocked-review'];paths=[p for p in ix['unassignedCandidatePaths'] if any(p.startswith((P/d).as_posix()+'/') for d in dirs)];assert len(paths)==18
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']};known={x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];preserved=[]
for d in dirs:
 m=load(P/d/'REVIEW_MANIFEST.json')
 for source in m['preservedSources']:
  actual=source['path'] if ref(source['path'])['sha256']==source['sha256'] else archives[source['sha256']];assert ref(actual)['sha256']==source['sha256'];bindings.append(dict(owner=(P/d/'REVIEW_MANIFEST.json').as_posix(),original=source,actual=ref(actual)))
 for f in (P/d).iterdir():
  if f.suffix not in ['.json','.md'] and f.as_posix() not in known:preserved.append(dict(**ref(f),method='Exact rejected memory packet/source backing outside prose census; preservation does not confer admission'))
assert len(bindings)==283 and len(preserved)==8
notes={}
for p in paths:
 blocked='blocked-review' in p;prefix='Never-admitted blocked specimen. ' if blocked else 'Corrected successor subsequently accepted through separate FREEZE. '
 if Path(p).name=='REVIEW_MANIFEST.json':notes[p]=prefix+'Historical531 versus589 check sets and133 versus150 preserved-file lists retain separate scopes. Missing IDN map-key role is not supplied by RecordField roles or constructor equality. Blocked manifest proposes exact role but applied=false; corrected manifest accepts14 memory RecordField plus1 IDN StateMapKey role. All16 paired registries freshly differ by precisely this one added role and no removals, with other slots identical. Hashable blocked bytes never become admitted via later acceptance. Pre-freeze NOT FROZEN/NOT PASSED labels are historical and later bounded runtime qualification is a separate evidence chain. Sparse ownership, wrapper-derived F/R, exact profile, component permutation and bounded input compiler witnesses do not imply general memory/search/admission language. Check labels including inherited bare row undefined are diagnostic labels, not new semantic objects or individually unique controls.283 historical preservation references resolve now, not proof of timestamps or original process execution.'
 elif Path(p).name=='CONTROL_COMMITMENTS.json':notes[p]=prefix+'Sixteen explicit a/p/F/R registry and model-identity byte pairs, not just Boolean labels. Fresh shared-codec verification re-encodes all stored registries/identities, recomputes32 combined model digests and registry commitments, and checks corresponding manifest rows. Each corrected pair adds exactly the rejected manifest proposed IDN role; every model digest changes. Commitment validity is distinct from factory admission and behavior. No constructors, negative controls or runtime rerun; blocked models remain nonadmitted.'
 else:notes[p]=prefix+'Readable backing for one canonical artifact, freshly decoded/re-encoded and compared with paired bytes. Labels, record versions, scalar values, identity fields and descriptions are serialized data, not independent scientific findings or accepted ontology.14 artifact pairs across both packets pass exact comparison and six manifest commitments bind the stored positive packets. Content/parameter bytes retain carriage-parent equality; registry/model identities differ. No blocked source migration, compatibility alias or generic memory qualification inferred.'
chain=[ref(P/'campaign3-history-memory-qualification-rev1/review.json'),ref(P/'CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md'),ref(P/'campaign2-measurement-memory-model/FREEZE.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='BLOCKED OR CORRECTED MEMORY PACKET: EXPLICIT ACCEPTANCE STATUS AND EXACT BACKING',judgment=n,acceptanceChain=chain));leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('stored-check.json',dict(status='PASS READ-ONLY BLOCKED/SUCCESSOR PACKET COMPARISON',checker=ref('scripts/check-history-memory-packets.mjs'),command='node scripts/check-history-memory-packets.mjs',exitCode=0,canonicalReadablePairs=14,modelCommitments=32,pairedRegistryAmendments=16,addedRolesPerPair=1,removedRolesPerPair=0,scope='Current shared codec and identity recomputation of stored bytes only. Blocked specimens remain never admitted; no factory, constructor, runtime or historical negative-control execution.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All18 packet JSON sources, including complete serialized bytes/values, short labels and all manifest checks/blocker/amendment/limitation prose. Data fields are backing, not scientific findings.'))
save('review.json',dict(status='EIGHTEEN BLOCKED/CORRECTED MEMORY PACKET SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),checkerFailure=ref(O/'checker-failure.json'),limits=['Fresh read-only stored bytes and identity comparison; no historical constructor, factory, runtime, negative control, restore or materializer rerun.','All283 preservation references resolve. Eight rejected-packet/source resources newly indexed; no timestamp or original execution inference.','Rejected specimen commitments remain never admitted, frozen or migration aliases. Later successor qualification remains bounded.','No model, law, allocation, verdict, corpus or obligation status change; prior source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT PACKET ROLES AND REJECTED/SUCCESSOR COMPARISON',sources=18,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newBackingResources=len(preserved),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
