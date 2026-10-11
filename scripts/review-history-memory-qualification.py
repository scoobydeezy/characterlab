"""Reconcile measurement carriage historical acceptance and distinguish recorded reproduction from fresh integrity."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-qualification-rev1'
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
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limitations','note','preservedOpen','qualification'])
ip=P/'campaign3-history-source-roles-rev217/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
names=['CAMPAIGN2_MEASUREMENT_MEMORY_'+n for n in ['MATERIALIZATION_REVIEW.md','REMATERIALIZATION_REVIEW.md','RUNTIME_REVIEW.md','QUALIFICATION.md']]+['CAMPAIGN2_MEMORY_MODEL_BYTE_A_PROOF.json','CAMPAIGN2_MEMORY_RESTORE_PROOF.json','campaign2-measurement-memory-model/FREEZE.json']
paths=[(P/n).as_posix() for n in names];assert all(p in ix['unassignedCandidatePaths'] for p in paths)
notes={}
notes[paths[0]]='Blocked materialization correctly withheld admission despite reproducible531-check/133-preservation packet. Missing268.Bindings map-key role cannot be supplied by267 CharacterId or203 ObserverId record-field roles. Constructor equality alone missed substrate prerequisite. Proposed addition uses existing schemas and namespace1000, no new allocation, wrapper role or composite-key atom role. Blocked58a491 specimens never admitted/frozen, not migration sources. Later accepted15-role successor resolves this exact defect, without retroactively admitting old bytes.'
notes[paths[1]]='Accepted C2-MEM-PACK-002 amendment changes14 memory RecordField roles to14 plus one independent IDN StateMapKey role. All16 commitments recomputed, not patched; blocked predecessors retained separately.589 component/consistency checks and150 preservation claims did not yet authorize runtime. Existing substrate compiler tested exact IDN fragment with missing/wrong/duplicate/validator negatives while complete successor remained review-only. Later separate FREEZE owns concrete acceptance; unchanged candidate prose remains historical. Commitment sensitivity is not admission, and substrate permutation is not a fabricated nontrivial valid memory row.'
notes[paths[2]]='Bounded runtime consumes genuine337, emits342, inserts345 at346 keyed by Character/Evidence, then content-free delayed351 recalls exact352 through IDN and one authorized episode read. Formation has no episode occupancy semantic read; recall no persistent write. Formation ablation retains evidence/cue but no episode; read ablation retains episode without recall. All16 topology/sentinel controls distinct from universal semantics. Original-S0 whole-instant prefix replay validates complete save before constructing a fresh restored runtime with detached pending associations; no capability serialization or antirollback guarantee. Public later adaptation happens after recall; component D change supplies between-formation/recall history witness. Frozen calibration/permission are exclusions, not mutable public knobs.599 full tests plus2 focused are not601 full tests. Freeze manifest actually binds16 files, directory17 including FREEZE; prose17 fingerprints is corrected by this audit. Later research acceptance is bounded; same-S0 parent intervention is separate.'
notes[paths[3]]='Accepted MEM-PACK A..G/MEMR A..P bounded qualification includes explicit component/public splits. Nontrivial permutation comes from canonical-set substrate, not singleton/empty memory rows. Generic50+1 versus51+0 equality plus public anchor exclusion qualifies B. G combines public later adaptation, component intermediate D change and exclusion of current controls. Initial adaptation-state difference did not meet stronger parent setup; later same-S0 intervention separately qualifies parent. PHEN-MEM search/recency/decay/reinforcement/salience/topK remain outside exact episodic seam; no universal retrieval, reduction or Campaign2 completion.'
notes[paths[4]]='Historical production admission receipt binds16 distinct a/p/F/R model digests and nine named negative groups, with six writable/one read-only family. Complete control labels/digests match frozen commitment rows. Does not exercise create/run/restore behavior; malformed structures having hashes are not admitted models. Current helper also tests copied input/output and forged handles, but receipt is not a complete source manifest or new execution. Later runtime qualification supersedes only the then-unpassed bounded memory scope.'
notes[paths[5]]='Compact historical fresh-process restore receipt has four modes: real, private, formation-ablated and read-ablated. Current helper creates pending cue state, restores and compares complete save before/after continuation; receipt retains no save bytes, hashes or historical source identities. Four mode labels are not16 model restores or universal persistence. No fresh replay or source-time authentication inferred from PASS. Prefix integrity remains distinct from antirollback protection.'
notes[paths[6]]='Separate accepted freeze binds16 existing packet files and all16 control commitments. Directory has17 files including this freeze document, which does not fingerprint itself; runtime prose17-fingerprint claim is a counting error. Historical review-candidate manifest is preserved, not rewritten to imply earlier acceptance. Blocked specimens NEVER ADMITTED/FROZEN and never aliases or migration sources. Freeze authorizes implementation, not behavioral qualification.'
packet=P/'campaign2-measurement-memory-model';freeze=load(paths[6]);bindings=[];preserved=[];known={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
assert freeze['status']=='ACCEPTED AND FROZEN' and len(freeze['files'])==16 and len(list(packet.iterdir()))==17
for x in freeze['files']:
 actual=packet/x['name'];assert ref(actual)['sha256']==x['sha256'];bindings.append(dict(owner=paths[6],original=x,actual=ref(actual)))
 if actual.suffix=='.hex' and actual.as_posix() not in known:preserved.append(dict(**ref(actual),method='Exact frozen memory canonical packet backing outside prose census'))
proof=load(paths[4]);controls=load(packet/'CONTROL_COMMITMENTS.json');assert len(controls)==len(proof['models'])==16
assert len({tuple(x[k] for k in ['a','p','F','R']) for x in controls})==16
assert len({x['digest'] for x in proof['models']})==16
for a,b in zip(proof['models'],controls):
 assert all(a[k]==b[k] for k in ['a','p','F','R']) and a['digest']==b['modelDigest'] and a['status']=='PASS'
assert proof['referenceDigest']==freeze['referenceDigest']=='3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9'
assert len(proof['checks'])==9 and all(x['status']=='PASS' for x in proof['checks'])
assert proof['fullStateFamilies']==dict(writable=6,readOnly=1)
restore=load(paths[5]);assert [x['name'] for x in restore['checks']]==['real','private','formation-ablated','read-ablated'] and all(x['status']=='PASS' for x in restore['checks'])
blocked=P/'campaign2-measurement-memory-blocked-review/REVIEW_MANIFEST.json';assert load(blocked)['modelDigest']=='58a49146718a42ec918787fbce5c5aac86b41b84baeedada7140ee685838ff46'
chain=[ref(P/'CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md'),ref(P/'campaign3-history-adapt-parent-pair-rev1/review.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='HISTORICAL MEMORY BLOCKER, SUCCESSOR FREEZE AND BOUNDED QUALIFICATION',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All three JSON sources including short statuses, control labels, digests and freeze assertions; four Markdown reviews preserve every original occurrence.'))
save('count-finding.json',dict(status='DOCUMENTARY COUNT CORRECTION; NO FROZEN BYTE CHANGE',source=ref(paths[2]),freeze=ref(paths[6]),claimedFingerprints=17,actualListedFingerprints=16,directoryFilesIncludingFreeze=17,disposition='Use16 named frozen-file bindings.17 is directory cardinality including FREEZE.json, not17 fingerprints. Exact16 commitments and scientific scope unchanged; original prose retained.',obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('review.json',dict(status='SEVEN MEMORY QUALIFICATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),countFinding=ref(O/'count-finding.json'),checkerFailure=ref(O/'checker-failure.json'),blockedManifest=ref(blocked),controlCommitments=ref(packet/'CONTROL_COMMITMENTS.json'),currentHelpers=[ref('scripts/prove-campaign2-memory-'+n+'.mjs') for n in ['restore','model-byte-a']],limits=['Fresh frozen-file integrity and stored cohort matching only; no runtime, test, constructor, proof writer or restore rerun.','Compact restore receipt lacks historical save/source bytes; no fresh continuation proof claimed.','Blocked specimens remain never admitted; later exact successor acceptance is separate.','No model, law, allocation, verdict, corpus or obligation status change; prior gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS MEMORY HISTORY AND EXACT FREEZE BINDINGS; COUNT ERRATUM PRESERVED',sources=7,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),newBackingResources=len(preserved),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
