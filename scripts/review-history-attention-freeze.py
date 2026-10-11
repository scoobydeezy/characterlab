"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-attention-freeze-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-attention-freeze.mjs')
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archive=next(a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'] if a['original']==check['correctedFreeze']['path'])
paths=[check['oldFreeze']['path'],check['correctedFreeze']['path'],archive['archive']];sources={};roles=[];bindings=[];pairs={archive['archive']:archive['original']}
def scan(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:assert sha(v['path'])==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256']))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for p in paths:
 assert sha(p)==entries[p]['sha256'];v=load(p);sources[p]=v
 if p!=archive['archive']:scan(v)
 assert len(v['models'])==32 and len(v['runs'])==224 and v['checks']==65 and v['negativeControls']==7 and v['preservedEMBFingerprints']==453
 roles.append(dict(path=p,sha256=sha(p),role='OLD INVALID-S0 FREEZE' if p==paths[0] else 'CORRECTED SET-S0 FREEZE',judgment='32 exact model commitments and224 specimen run commitments retain finite eligibility only. Old list S0 cannot restore;corrected empty set restores. All224 run IDs differ while32 model IDs/seven inputs stay unchanged;neither cohort aliases the other. Work8 remains an admitted negative runtime control,not rejected model.65 review checks/seven negative controls/453 preserved fingerprints are historical report claims,not freshly rerun runtime tests. No public handler,trace,rollback,corpus or whole attention verdict is earned by freeze. Primary internal review is not external review.',acceptanceChain=[ref(O/'canonical-check.json'),ref(v['review']['path']),ref(v['sourceProposal']['path'])]))
assert sha(archive['archive'])==sha(archive['original'])==archive['sha256']
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/reviewer','/scope','/correction')) and not ptr.startswith('/correction/script')
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='CORRECTION / AUTHORITY / LIMIT' if narrative else 'COMMITMENT BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-003','RO-C3-004','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='THREE ATTENTION FREEZE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Commitment and restoration checks only;no runtime work8 or public prefix matrix rerun.','Historical invalid S0 and old identities remain preserved;no retroactive qualification or independent chronology claim.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('CORRECTION') for r in rows),originalBackingOccurrences=sum(r['role']=='COMMITMENT BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
