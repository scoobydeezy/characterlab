"""Read-only receipt validation; does not rerun the isolated execution assay."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-persist-i-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
v=load(O/'proof.json');assert len(v['results'])==3
for f in v['sourceFingerprints']:assert sha(f['path'])==f['sha256'],f['path']
for index,row in enumerate(v['results']):
 a,b=row['pair'];assert not a['enabled'] and b['enabled']
 assert a['capability']['unavailableVerified'] and b['capability']['actualDraws']>0
 assert b['capability']['oldProfileRejectsSuccessor'] and b['capability']['oldProfileRejectsDeclarations']
 assert a['model']==b['model'] and a['field9']==a['empty'] and a['restored']==a['save']
 if index==0:assert row['status']=='PASS' and a['save']==b['save']==b['restored'] and b['field9']==b['empty']
 else:
  assert row['status']=='DETECTED' and 'restored' not in b
  if index==1:assert a['save']!=b['save'] and b['field9']!=b['empty']
  else:assert a['save']==b['save'] and b['field9']==b['empty']
c=dict(status='BOUNDED ORIGINAL PERSIST-I RECEIPT VERIFIED',isolatedExecutions=6,realConsumerExecutions=3,detectedMutants=2,sourceFiles=len(v['sourceFingerprints']),proofSha256=sha(O/'proof.json'),checkerSha256=sha(__file__))
target=O/'check.json'
if target.exists():assert load(target)==c
else:target.write_text(json.dumps(c,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
