"""Reconcile stored first/trace model packets and historical materialization/continuation receipts."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-first-trace-packets-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev239/index.json';ix=load(ip);entries={r['path']:r for r in load(B/'manifest.json')['entries']}
pc=load(O/'packet-check.json');assert pc['status']=='PASS READ-ONLY FIRST/TRACE STORED PACKETS'
assert pc['checkerSha256']==ref('scripts/check-history-first-trace-packets.mjs')['sha256']
notes={};bindings=[];preserved=[];binary=[]
for d in ['campaign2-first-model','campaign2-trace-model']:
 root=P/d;manifest=load(root/'REVIEW_MANIFEST.json')
 for p in sorted(root.glob('*.json')):
  if p.name=='REVIEW_MANIFEST.json':
   n=('Accepted old0.1 packet: seven binary artifacts/six independent version fields,24-entry compatibility bundle, fixed input/persistence profiles,175schema descriptors82semantic entries,five grammars58roles and committed100worklimit. No run/S0/input/seed/execution frozen; byte acceptance only unblocks FCT5.' if d=='campaign2-first-model' else 'Accepted replacement0.2 packet: same manifests/component identities,RulesVersion-only ModelIdentity delta,new trace profileand two appended bundle entries. Fifteen old packet files exact preservation checked. Permanent seam members didnot add registry rows. Oldmodel/no-savealias and Mmaterialization-only limits explicit.')
  elif p.name=='registry.json':n='Readable rendering of six-slot committed registry, not free-standing research prose. Schema names, semantic members, domains, role/phase/ownership declarations and short scalar strings are model data. Current shared codec round trip matches every stored value;14-pair check separately recomputes commitments. Both packets have identical registry. No claim supported schemas all execute or every declaration is behaviorally qualified.'
  elif p.name=='content.json':n='Readable canonical singleton authored character definition:1038 StableId/1004character kind, remaining required lists explicitly empty. Backing model content, not a psychologically interpreted character or runtime state. Full stored bytes/rendering match; same content across packets.'
  elif p.name=='parameters.json':n='Readable canonical one-item parameter list:133 worklimit100 unsigned. Versioned specimen input, not universal capacity or inferred host default; unchanged across packets and exactly committed.'
  else:n='Readable complete identity record with exact independent schema/version/digest operands, checked against canonical bytes and recomputed manifest/model commitments. Typed strings/digests are backing identifiers, not findings. Only model RulesVersion field1 changes between packets; no old/new model equality or automatic migration.'
  notes[p.as_posix()]=n
 for f in manifest['files']:
  p=root/f['path'];raw=bytes.fromhex(p.read_text().strip());assert len(raw)==f['bytes'] and hashlib.sha256(raw).hexdigest()==f['sha256']
  binary.append(dict(receipt=ref(root/'REVIEW_MANIFEST.json'),file=ref(p),decodedByteLength=len(raw),decodedSha256=hashlib.sha256(raw).hexdigest(),scope='Manifest hash commits decoded canonical bytes, distinct from text-file SHA-256.'))
  assert not any(r['path']==p.as_posix() for r in ix['explicitBackingOutsideProseManifest'])
  preserved.append(dict(**ref(p),method='Existing frozen canonical hex backing indexed explicitly; decoded byte hash and readable pairing verified, no archive copy or runtime execution'))
def bind(receipt,p,h):
 assert ref(p)['sha256']==h
 bindings.append(dict(receipt=receipt,original=dict(path=Path(p).as_posix(),sha256=h),actual=ref(p)))
for n,d in [('CAMPAIGN2_MODEL_BYTE_A.json','campaign2-first-model'),('CAMPAIGN2_TRACE_MODEL_BYTE_A.json','campaign2-trace-model')]:
 p=P/n;v=load(p);assert v['freshProcess'] is True and v['status']=='PASS'
 assert len(v['deletedArtifacts'])==len(v['comparisons'])==15
 assert set(v['deletedArtifacts'])=={r['name'] for r in v['comparisons']}
 for r in v['comparisons']:assert r['result']=='byte-identical';bind(p.as_posix(),P/d/r['name'],r['sha256'])
 notes[p.as_posix()]='Historical destructive-delete/fresh-process reconstruction receipt:15 filenames are seven binary-text/readable pairs plusmanifest, not15models or15experiments. All15 text-file hashes match currently preserved artifacts. Source-only child construction declared; old packet comparison inputs for replacement are not replacement identity inputs. No original writer fingerprint or raw process log in this receipt; stored artifact equality is freshly checked, original process/rematerialization not rerun. Byte acceptance/materialization doesnot establish runtime activation.'
for r in load(P/'campaign2-trace-model/REVIEW_MANIFEST.json')['preservedOldPacket']:bind('docs/planning/campaign2-trace-model/REVIEW_MANIFEST.json',P/'campaign2-first-model'/r['name'],r['sha256'])
p=P/'CAMPAIGN2_TRACE_CONTINUATION_PROOF.json';v=load(p)
assert v['processes']==2 and v['committedTraceRecords']==18 and v['originalInitialStateTransferred'] is False and v['finalSaveBytes']==39786
assert v['checkpointRoundTrip']==v['continuedFullSave']=='byte-identical'
notes[p.as_posix()]='Historical two-process TRACE-C2-H receipt:18committed records,39786bytesfinalsave, exact checkpoint/fullsave continuation,no original S0handoff. Current writer inspection explains model/input/checkpoint handoff and temporary expected/actual save comparison followed by cleanup, but receipt has no writer fingerprint or fullsave payload; current script is not asserted historical byte revision. Digest alone cannot independently reconstruct/replay the trace; no fresh continuation or independent FCT6/wholequalification here. Distinct from later original-prefix restore contracts.'
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(source,p):
 if Path(source).name=='REVIEW_MANIFEST.json':return p=='/status' or p.startswith('/limitations/') or p.endswith('/comparison')
 if Path(source).name in ['CAMPAIGN2_MODEL_BYTE_A.json','CAMPAIGN2_TRACE_MODEL_BYTE_A.json']:return p in ['/control','/status','/childInputs'] or p.endswith('/result')
 if Path(source).name=='CAMPAIGN2_TRACE_CONTINUATION_PROOF.json':return p in ['/status','/control','/checkpointRoundTrip','/continuedFullSave','/scope']
 return False
chain=[ref(P/'campaign3-history-trace-packaging-authority-rev1/review.json'),ref(P/'CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md')]
sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='FROZEN MODEL PACKET / READABLE BACKING / BOUNDED HISTORICAL RECEIPT',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(p,q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['source'],u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='NINETEEN FIRST/TRACE PACKET SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,canonicalByteBindings=binary,packetCheck=ref(O/'packet-check.json'),schema=ref(O/'schema.json'),preservedArtifacts=preserved,currentInspectionSources=[ref('scripts/prove-campaign2-trace-continuation.mjs'),ref('src/campaign2/codecs.ts'),ref('src/substrate/canonicalEncoding.ts'),ref('src/substrate/identity.ts')],limits=['Fourteen canonical/readable pairs,two model identities,six manifest commitments checked with current codecs; original writers and runtime not rerun.','45 text-file hash bindings and14decoded canonical hashes differ in representation; no hash conflation.','Continuation is scoped historical summary, not retained full trace/save or exact historical writer snapshot.','Fourteen existing hex backing resources newly indexed, no new archive copies/source gap/law/model/allocation/verdict/corpus/obligation status change. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED FIRST/TRACE PACKET CONSISTENCY',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),canonicalByteBindings=len(binary),newBackingResources=len(preserved),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
