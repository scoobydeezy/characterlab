"""Reconcile stored first/trace model packets and historical materialization/continuation receipts."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-probe-packets-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev248/index.json';ix=load(ip);entries={r['path']:r for r in load(B/'manifest.json')['entries']}
pc=load(O/'packet-check.json');assert pc['status']=='PASS READ-ONLY PROBE/SUCCESSOR STORED PACKETS'
assert pc['checkerSha256']==ref('scripts/check-history-probe-packets.mjs')['sha256']
notes={};bindings=[];preserved=[];binary=[]
for d in ['campaign2-probe-model','campaign2-probe-successor-model']:
 root=P/d;manifest=load(root/'REVIEW_MANIFEST.json')
 for p in sorted(root.glob('*.json')):
  if p.name=='REVIEW_MANIFEST.json':
   n=('Accepted original probe.1 packet: seven canonical artifacts, six version fields, complete whole-profile bindings. Relative bounded trace model registry0 adds five descriptors/three union entries/one definition,slot5 eleven roles,other slots unchanged; ModelIdentity1/6 differ. Materialization authorizes implementation, not A..P.' if d=='campaign2-probe-model' else 'Accepted accessor successor.2: only ModelIdentity1 differs, all manifests/component identities unchanged. Trace bundle/profile changes exactly; no old-model alias. Forty-five original files preserved; canonical checks are not fresh runtime qualification.')
  elif p.name=='registry.json':n='Readable rendering of six-slot committed registry, not free-standing research prose. Schema names, semantic members, domains, role/phase/ownership declarations and short scalar strings are model data. Current shared codec round trip matches every stored value;14-pair check separately recomputes commitments. Both probe packets have identical registry; original probe additions to prior bounded model checked separately. No claim supported schemas all execute or every declaration is behaviorally qualified.'
  elif p.name=='content.json':n='Readable canonical singleton authored character definition:1038 StableId/1004character kind, remaining required lists explicitly empty. Backing model content, not a psychologically interpreted character or runtime state. Full stored bytes/rendering match; same content across packets.'
  elif p.name=='parameters.json':n='Readable canonical one-item parameter list:133 worklimit100 unsigned. Versioned specimen input, not universal capacity or inferred host default; unchanged across packets and exactly committed.'
  else:n='Readable complete identity record with exact independent schema/version/digest operands, checked against canonical bytes and recomputed manifest/model commitments. Typed strings/digests are backing identifiers, not findings. Only model RulesVersion field1 changes between packets; no old/new model equality or automatic migration.'
  notes[p.as_posix()]=n
 for f in manifest['files']:
  p=root/(f['name']+'.cenc.hex');raw=bytes.fromhex(p.read_text().strip());assert len(raw)==f['bytes'] and hashlib.sha256(raw).hexdigest()==f['sha256']
  binary.append(dict(receipt=ref(root/'REVIEW_MANIFEST.json'),file=ref(p),decodedByteLength=len(raw),decodedSha256=hashlib.sha256(raw).hexdigest(),scope='Manifest hash commits decoded canonical bytes, distinct from text-file SHA-256.'))
  assert not any(r['path']==p.as_posix() for r in ix['explicitBackingOutsideProseManifest'])
  preserved.append(dict(**ref(p),method='Existing frozen canonical hex backing indexed explicitly; decoded byte hash and readable pairing verified, no archive copy or runtime execution'))
gaps=[]
def bind(receipt,p,h):
 h=h.lower()
 if ref(p)['sha256']==h:bindings.append(dict(receipt=receipt,original=dict(path=Path(p).as_posix(),sha256=h),actual=ref(p)))
 else:
  assert Path(p).name=='REVIEW_MANIFEST.json'
  gaps.append(dict(receipt=receipt,path=Path(p).as_posix(),sha256=h,current=ref(p),disposition='Pre-freeze review metadata hash unresolved; fourteen canonical/readable files match. No assertion of byte-identical historical manifest or timestamp.'))
for n,d in [('CAMPAIGN2_PROBE_REMATERIALIZATION_PROOF.json','campaign2-probe-model'),('CAMPAIGN2_PROBE_SUCCESSOR_REMATERIALIZATION_PROOF.json','campaign2-probe-successor-model')]:
 p=P/n;v=load(p);assert v['status']=='PASS' and len(v['files'])==15
 for name,h in v['files'].items():bind(p.as_posix(),P/d/name,h)
 notes[p.as_posix()]='Historical delete/regenerate/fresh-process verification receipt with15file hashes. Fourteen canonical/readable file hashes match; pre-freeze REVIEW_MANIFEST metadata hash differs from accepted current manifest and is unresolved after indexed backing, all path Git revisions(raw/LF/CRLF) and17planning manifest copies. Scope is not a failed model round trip: actual model bytes verified independently. Original destructive writer not rerun. No original writer fingerprint/raw process log; metadata explanation in materialization narrative is not exact old-byte recovery.'
for d in ['campaign2-probe-model','campaign2-probe-successor-model']:
 for r in load(P/d/'REVIEW_MANIFEST.json')['preservedOldArtifacts']:bind((P/d/'REVIEW_MANIFEST.json').as_posix(),r['path'],r['sha256'])
assert len(gaps)==2
p=P/'CAMPAIGN2_PROBE_CONTINUATION_PROOF.json';v=load(p)
assert v['processes']==2 and v['committedTraceRecords']==26 and v['originalInitialStateTransferred'] is False and v['finalSaveBytes']==55782
assert v['checkpointRoundTrip']==v['continuedFullSave']=='byte-identical'
notes[p.as_posix()]='Historical two-process probe.2 continuation receipt:26trace records/55782bytes, exact checkpoint/fullsave, no originalS0handoff. Current writer shows model/input/checkpoint transfer and temporary expected/actual saves removed after exact comparison. Receipt lacks full save and historical writer fingerprint; digest cannot independently reconstruct execution. Current script inspection not claimed exact old source revision. No fresh continuation, full prefix replay, allPROBE or parentqualification supplied.'

def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(source,p):
 if Path(source).name=='REVIEW_MANIFEST.json':return p=='/status' or p.startswith('/limitations/') or p.endswith('/comparison')
 if Path(source).name in ['CAMPAIGN2_PROBE_REMATERIALIZATION_PROOF.json','CAMPAIGN2_PROBE_SUCCESSOR_REMATERIALIZATION_PROOF.json']:return p in ['/operation','/status'] or p.endswith('/result')
 if Path(source).name=='CAMPAIGN2_PROBE_CONTINUATION_PROOF.json':return p in ['/status','/control','/checkpointRoundTrip','/continuedFullSave','/scope']
 return False
chain=[ref(P/'campaign3-history-probe-packaging-history-rev1/review.json'),ref(P/'CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md')]
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
save('unresolved.json',dict(status='TWO PRE-FREEZE REVIEW METADATA HASH GAPS',references=gaps,searchScope='Current/indexed backing; one available Git revision per path with raw/LF/CRLF;17 planning REVIEW_MANIFEST copies; no global absence claim.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='NINETEEN PROBE PACKET SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,canonicalByteBindings=binary,packetCheck=ref(O/'packet-check.json'),schema=ref(O/'schema.json'),preservedArtifacts=preserved,currentInspectionSources=[ref('scripts/prove-campaign2-probe-continuation.mjs'),ref('src/campaign2/probeCodecs.ts'),ref('src/substrate/canonicalEncoding.ts'),ref('src/substrate/identity.ts')],unresolved=ref(O/'unresolved.json'),development=[ref(p) for p in sorted((P/'campaign3-history-probe-packets-development-rev1').iterdir())],limits=['Fourteen canonical/readable pairs,two model identities,six commitments and exact base/probe/successor deltas checked; no writer/runtime rerun.','103 matching text-file hashes and14decoded byte hashes differ in representation; two pre-freeze metadata hashes unresolved.','Preserve checker missing removed-field assumption, corrected diagnosis and phase-slot record-versus-collection failure; no original packet altered.','Fourteen existing hex resources indexed; source/metadata gaps remain distinct from independently verified model bytes. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED PROBE PACKET CONSISTENCY',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),canonicalByteBindings=len(binary),newBackingResources=len(preserved),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
