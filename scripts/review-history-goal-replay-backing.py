"""Classify exact replay-receipt schemas and their non-prose save archives."""
from pathlib import Path
import json,hashlib,gzip,base64,re,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-goal-replay-backing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=load(B/'manifest.json');entries={e['path']:e for e in manifest['entries']}
planPath=P/'LONGITUDINAL_GOAL_PLAN_REV1.json';plan=load(planPath);planHash=sha(planPath)
matrixPath=P/'LONGITUDINAL_GOAL_MATRIX_REV1.json';matrix=load(matrixPath);assert matrix['planSha256']==planHash
assert matrix['status']=='COMPLETE MATRIX PASS' and matrix['runs']==120 and matrix['prefixesVerified']==2040
artifacts={a['path']:a['sha256'] for a in matrix['artifacts']}
for a in plan['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
assert len(plan['runs'])==120 and len({r['runIdentity'] for r in plan['runs']})==120
assert sha('scripts/check-longitudinal-goal-matrix.mjs')==artifacts['scripts/check-longitudinal-goal-matrix.mjs']
files=[];archives=[];parents=[];expected={};advanced=0
def validate_receipt(v,want):
 assert v==want
 assert set(v)=={'planSha256','runIdentity','prefix','saveHash','successorHash','advanced'}
 for key in ['planSha256','saveHash','successorHash']:assert re.fullmatch('[0-9a-f]{64}',v[key])
 assert re.fullmatch('(?:[0-9a-f]{2})+',v['runIdentity'])
 assert type(v['prefix']) is int and 0<=v['prefix']<=16
 assert type(v['advanced']) is bool and v['advanced']==(v['prefix']<16)
for i,identity in enumerate(plan['runs']):
 root=P/'longitudinal-goal-execution-rev1'/f'{i:03}'
 p=Path(str(root)+'.json');r=load(p);key=p.as_posix()
 assert sha(p)==entries[key]['sha256']==artifacts[key]
 assert r['planSha256']==planHash
 for k,v in identity.items():assert r[k]==v
 assert len(r['prefixHashes'])==17
 parents.append(dict(path=key,sha256=sha(p),role='AUTHENTICATED PARENT TRAJECTORY; ONLY REPLAY BINDING REVIEWED HERE'))
 archive=Path(str(root)+'.saves.gz');ah=sha(archive)
 assert ah==r['saveArchiveSha256']==artifacts[archive.as_posix()]
 saves=json.loads(gzip.decompress(archive.read_bytes()))
 assert isinstance(saves,list) and len(saves)==17 and all(isinstance(x,str) for x in saves)
 saveHashes=[hashlib.sha256(base64.b64decode(s,validate=True)).hexdigest() for s in saves]
 assert saveHashes==r['prefixHashes']
 archives.append(dict(path=archive.as_posix(),sha256=ah,saveHashes=saveHashes,role='NON-PROSE BINARY SAVE BACKING',
  rationale='Gzip JSON transports17 base64-encoded original component saves; exact decoded bytes authenticate against the trajectory. The prose census excludes this suffix, not its scientific evidence role. This is not an independent native Save132 admission.'))
 for prefix in range(17):
  p=Path(str(root)+f'.prefix{prefix}.json');key=p.as_posix();v=load(p)
  want=dict(planSha256=planHash,runIdentity=r['runIdentity'],prefix=prefix,saveHash=saveHashes[prefix],successorHash=saveHashes[min(prefix+1,16)],advanced=prefix<16)
  validate_receipt(v,want);assert sha(p)==entries[key]['sha256']==artifacts[key]
  files.append(dict(path=key,sha256=sha(p),prefix=prefix,runIdentity=r['runIdentity'],role='EXACT ORIGINAL-PREFIX REPLAY RECEIPT',
   rationale='Closed six-field schema: plan/run identities, prefix integer, save/successor hashes and actual advancement Boolean. Producer writes after restoring original saved bytes and checking one immediate successor; no free-text finding field. Retained as backing evidence, not excluded for lacking a prose marker.'))
  expected[key]=want;advanced+=v['advanced']
selected={f['path'] for f in files};occurrences=[]
with (B/'units.jsonl').open(encoding='utf-8') as stream:
 for line in stream:
  u=json.loads(line)
  if u['source'] in selected:occurrences.append(u)
assert not occurrences,'A prose occurrence needs its own disposition'
assert len(files)==2040 and advanced==1920
faults=[];original=next(iter(expected.values()))
for mode in ['added-prose-field','changed-successor','false-terminal','changed-identity']:
 x=copy.deepcopy(original)
 if mode=='added-prose-field':x['finding']='UNRESOLVED behavior'
 elif mode=='changed-successor':x['successorHash']='0'*64
 elif mode=='false-terminal':x['advanced']=False
 else:x['runIdentity']='00'
 try:validate_receipt(x,original)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
v=dict(status='REPLAY RECEIPT/ARCHIVE BACKING ROLES VERIFIED; HQ011 OPEN',files=files,archives=archives,parentBindings=parents,
 evidence=[dict(path=p.as_posix() if isinstance(p,Path) else p,sha256=sha(p)) for p in [planPath,matrixPath,'scripts/qualify-longitudinal-goal.mjs','scripts/check-longitudinal-goal-matrix.mjs','docs/planning/campaign3-history-ledger-residual-rev1/review.json','docs/planning/campaign3-history-goal-backing-rev1/review.json']],
 obligations=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'],
 extractionDisposition='All2040 selected original JSON files contribute zero prose units under the frozen predicate. Full closed-schema inspection confirms their strings are identity/hash encodings, with integer/Boolean data rather than omitted short material findings. Their120 gzip save archives remain explicit scientific backing outside the MD/JSON prose census.',
 limits=['No fresh simulation/replay, psychological validation or native admission. This audit authenticates existing receipts and all2040 original saved byte sequences against the original plan/matrix.','Each prefix receipt proves its originally asserted immediate successor, not a complete restored future tail.','Parent trajectory fields beyond the replay binding and the separately reviewed goal lifecycle fields remain outside this schema classification.','Absence of free-text fields in this closed schema cannot justify blanket exclusion of other JSON schemas.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],receiptFiles=2040,advancing=1920,terminal=120,archives=120,decodedSaves=2040,originalProseOccurrences=0,supplementalMaterialProse=0,rejectedSchemaMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
