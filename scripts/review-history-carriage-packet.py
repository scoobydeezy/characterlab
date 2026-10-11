"""Reconcile exact canonical packet backing and historical materialization limits."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-carriage-packet-rev1'
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
def narrative(p):return any(k in p.split('/') for k in ['status','limitations','packagingEvidence','checks'])
ip=P/'campaign3-history-source-roles-rev216/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
packet=P/'campaign2-measurement-evidence-model';paths=[p for p in ix['unassignedCandidatePaths'] if p.startswith(packet.as_posix()+'/')];assert len(paths)==8
m=load(packet/'REVIEW_MANIFEST.json');archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']}
bindings=[]
for source in m['preservedSources']:
 actual=source['path'] if ref(source['path'])['sha256']==source['sha256'] else archives[source['sha256']];assert ref(actual)['sha256']==source['sha256'];bindings.append(dict(original=source,actual=ref(actual)))
assert len(bindings)==87
notes={}
for p in paths:
 if Path(p).name=='REVIEW_MANIFEST.json':notes[p]='Accepted historical concrete packet, not runtime acceptance. Seven artifact commitments and31-entry ordered bundle fix exact profile. Four availability/permission variant identity representations are not four full directories. Registry slot0 nine additions/one singleton replacement and slot5 eight role additions preserve other slots; model identity fields1/6 change.102 historical checks include351 missing-entry negatives grouped as two rows, not102 runtime behaviors.87 preserved-source fingerprints resolve exactly now, without temporal provenance inference. PACK A..I limitations and EVC NOT PASSED are pre-runtime findings scoped by later accepted carriage qualification; they do not reopen whole historical implementation or become universal V07 proof. Empty/single/reordered source inputs are finite examples; fixed exact specimen comparison does not qualify an arbitrary registration language. Fresh checker confirms canonical/readable parity, commitment digests and exact predecessor delta only; original constructor, negative controls, variant reconstruction and runtime not rerun.'
 else:notes[p]='Readable serialization of one frozen canonical measurement-carriage artifact. The fresh shared-codec checker decodes/re-encodes the paired canonical bytes and verifies exact readable structure; values, schema labels, versions, names and IDs are backing data, not independent scientific findings or newly accepted ontology. Content/parameters and their identities equal probe successor; registry and its identity plus model identity change under explicit successor versions. This concrete identity packet authorizes only its accepted bounded profile; runtime and generic-language claims require separate evidence.'
chain=[ref(P/'campaign3-history-measurement-carriage-rev1/review.json'),ref(P/'CAMPAIGN2_MEASUREMENT_EVIDENCE_MATERIALIZATION.md'),ref(P/'CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='FROZEN CARRIAGE PACKET: SCOPED MANIFEST OR EXACT READABLE BACKING',judgment=n,acceptanceChain=chain));leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('stored-check.json',dict(status='PASS READ-ONLY STORED PACKET',checker=ref('scripts/check-history-carriage-packet.mjs'),command='node scripts/check-history-carriage-packet.mjs',exitCode=0,canonicalReadablePairs=7,manifestCommitments=3,exactRegistrySlots=6,changedModelFields=['1','6'],variantRepresentations=4,scope='Stored positive packet decoded/re-encoded and identities recomputed with current shared codecs; original constructor, runtime and negative controls not rerun. Other variant digests retained as historical representations, not reconstructed.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All eight packet JSON sources, including short labels, status/limitation prose, variant identities and full serialized artifact content. Manifest statuses/check labels are historical narrative; canonical data fields are backing.'))
save('review.json',dict(status='EIGHT CARRIAGE PACKET SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),limits=['Fresh read-only canonical/readable, digest and registry-delta check; historical constructor, rematerializer, runtime and negative controls not rerun.','All87 prior-file commitments resolve; no new archive or source gap. Exact bytes are not proof of historical timestamp.','Seven artifact pairs are backing; four variants remain historical representations except the positive packet identity freshly checked.','No model, law, allocation, verdict, corpus or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED PACKET ROLES AND READ-ONLY VERIFICATION',sources=8,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
