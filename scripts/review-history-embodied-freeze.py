"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-embodied-freeze-rev1'
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
check=load(O/'full-freeze-check.json');assert check['checkerSha256']==sha('scripts/check-history-embodied-freeze.mjs') and check['models']==7 and check['runs']==7 and check['preservedChecks']==439
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archive=next(a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'] if a['original']==check['freeze']['path'])
paths=[archive['original'],archive['archive'],(P/'campaign3-embodied-model-review-rev2/REVIEW_MANIFEST.json').as_posix()];sources={};roles=[];bindings=[];pairs={archive['archive']:archive['original']}
resolved={(x['originalPath'],x['sha256']):x['path'] for x in check['historicalSources']}
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:
   p=v['path'];actual=p if sha(p)==v['sha256'] else resolved[p,v['sha256']];assert sha(actual)==v['sha256'];bindings.append(dict(path=p,sha256=v['sha256'],resolvedPath=actual))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for p in paths:
 assert sha(p)==entries[p]['sha256'];v=load(p);sources[p]=v
 if p!=archive['archive']:scan(v)
 assert len(v['models'])==7 and len(v['runs'])==7 and v['preservedChecks']==439
 roles.append(dict(path=p,sha256=sha(p),role='EMBODIED DECLARATION / FREEZE AUTHORITY',judgment='Seven model commitments include baseline,five exact single-registry-operand variants and work7 parameter control. Seven run commitments include hidden89 reusing baseline;work7 is not a successful behavioral run. Common zero32 seed and exact nine-input459/478 timeline are commitments,not runtime execution. Complete freeze receipt reproduced under current compatible modules with exact historical fingerprint resolution.439 predecessor entries,not hardcoded console446,are supported.49 images preserved. Historical proposal24-check/adversarial fields remain scoped construction evidence;no live-source/initial-state/public/runtime76-obligation qualification or external review implied.',acceptanceChain=[ref(O/'full-freeze-check.json'),ref(O/'projection-reconstruction.json'),ref(O/'predecessor-exact-check.json')]))
assert sha(archive['archive'])==archive['sha256']==sha(archive['original'])
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/acceptance','/limits'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='EMBODIED AUTHORITY / LIMIT' if narrative else 'COMMITMENT / CHECK BACKING',judgment=roles[0]['judgment'])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='THREE EMBODIED FREEZE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Projection bytes are digest-verified reconstruction,not recovered Git blob.','Current compatible compiler execution does not claim original historical runtime execution.','Console446 erratum preserved;receipt439 controls. No runtime qualification or independent date claim.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('EMBODIED AUTHORITY') for r in rows),originalBackingOccurrences=sum(r['role']=='COMMITMENT / CHECK BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
