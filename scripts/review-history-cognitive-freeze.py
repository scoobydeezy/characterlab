"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-cognitive-freeze-rev1'
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
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-cognitive-freeze.mjs') and check['models']==21 and check['semanticBundle']==78
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archive=next(a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'] if a['original']==check['freeze']['path'])
root=P/'campaign2-task-cognitive-model';proposal=P/'campaign2-cognitive-declaration-review'
paths=[archive['original'],archive['archive'],(proposal/'REVIEW_MANIFEST.json').as_posix(),(root/'REVIEW_MANIFEST.json').as_posix(),(proposal/'CONTROLS.json').as_posix(),(root/'CONTROLS.json').as_posix()];sources={};roles=[];bindings=[];pairs={archive['archive']:archive['original'],(root/'REVIEW_MANIFEST.json').as_posix():(proposal/'REVIEW_MANIFEST.json').as_posix(),(root/'CONTROLS.json').as_posix():(proposal/'CONTROLS.json').as_posix()}
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:assert sha(v['path'])==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256']))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for p in paths:
 assert sha(p)==entries[p]['sha256'];v=load(p);sources[p]=v
 if p not in pairs:scan(v)
 if p.endswith('/CONTROLS.json'):assert v==check['rows']
 elif p.endswith('/REVIEW_MANIFEST.json'):assert v['controlModels']==check['rows'] and len(v['semanticBundle'])==78
 else:
  assert v['models']==check['rows'] and len(v['semanticBundle'])==78
  for f in v['files']:assert sha(root/f['name'])==f['sha256']
 if p in pairs:assert sha(p)==sha(pairs[p])
 roles.append(dict(path=p,sha256=sha(p),role='COGNITIVE CONSTRUCTION / CONTROL ROSTER / FREEZE',judgment='21 finite recipes have distinct exact model/registry commitments and148 definition rows/297 descriptors each;78 semantic component identifiers and three profiles remain explicit. Original six-file packet copied unchanged. Initial materialization excludes complete role/reference/ownership/runtime admission;later finite freeze authorizes implementation but historical runtime vectors remain NOT PASSED. Fresh current declaration admission verifies all21 recipes and original baseline bytes without retroactive runtime qualification. Exact source recovery authenticates historical taskDeclarations fingerprint,not historical runtime execution. Recipe names denote controls,not measured behavioral success.',acceptanceChain=[ref(O/'canonical-check.json'),ref(O/'source-recovery.json')]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/acceptance','/runtime','/campaign2','/preservation','/limits'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='COGNITIVE AUTHORITY / LIMIT' if narrative else 'COMMITMENT / CHECK BACKING',judgment=roles[0]['judgment'])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='SIX COGNITIVE CONSTRUCTION/FREEZE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Current declaration admission does not execute historical runtime vectors,live source,RNG or persistence.','Initial construction claims remain scoped;no whole Campaign2/3 closure.','Independent internal review is not external review or independently authenticated chronology.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('COGNITIVE AUTHORITY') for r in rows),originalBackingOccurrences=sum(r['role']=='COMMITMENT / CHECK BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
