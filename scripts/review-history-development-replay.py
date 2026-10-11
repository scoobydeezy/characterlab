"""Join replay schemas to every original occurrence, including omitted strings."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-replay-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
canonical=O/'canonical-check.json';check=load(canonical);assert check['checkerSha256']==sha('scripts/check-history-development-replay.mjs')
entries={x['path']:x for x in load(B/'manifest.json')['entries']};sources={};roles=[]
for a in check['sources']:
 p=a['path'];assert sha(p)==a['sha256']==entries[p]['sha256'];sources[p]=load(p)
 roles.append(dict(**a,role='WHOLE REPLAY PLAN / RESULT SCHEMA',judgment='Exact experiment/comparison identities, original-source digests and zero32 seed reconstructed; typed result fields retain historical hashes and observations. Same-model early practice changes only kinds3/5, distinct rust law preserved. Reused known trajectories, one successor per prefix, no maturation or unseen replication. Freeze status is a declaration, not independent timestamp proof.',acceptanceChain=[ref(P/'DEVELOPMENT_HISTORY_CLOSURE_REV1.json'),ref(canonical),ref(P/'campaign3-history-development-routing-rev1/review.json')]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];assert strings[u['source'],u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='FREEZE DECLARATION' if u['location']['pointer']=='/status' else 'TYPED REPLAY BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source'])))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='TWO REPLAY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),obligations=obs,limits=check['limits']))
c=dict(status='PASS; HQ011 OPEN',sources=2,originalNarrativeOccurrences=sum(x['role']=='FREEZE DECLARATION' for x in rows),originalBackingOccurrences=sum(x['role']!='FREEZE DECLARATION' for x in rows),stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
