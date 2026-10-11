"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-receiving-freeze-rev1'
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
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-receiving-freeze.mjs') and check['models']==13 and check['checks']==180 and check['componentChecks']==585
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
artifacts=load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'];originals=[check['freeze']['path'],(P/'embodied-receiving-model-review-rev1/REVIEW.json').as_posix()]
sources={};roles=[];bindings=[];pairs={}
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:assert sha(v['path'])==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256']))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for original in originals:
 a=next(a for a in artifacts if a['original']==original);v=load(original);scan(v);assert len(v['models'])==13
 for p in [original,a['archive']]:
  assert sha(p)==entries[p]['sha256']==a['sha256'];sources[p]=v
  if p!=original:pairs[p]=original
  roles.append(dict(path=p,sha256=sha(p),role='RECEIVING PROPOSAL / FREEZE AUTHORITY',judgment='Materialized roundtrips/unique commitments are not complete role/reference/transition admission. Subsequent whole finite review checks exact inherited body rebinding and version changes,unchanged task definitions except explicit0..100 task window,dice thresholds and16 source/read stage declarations.13 variants preserve exact unchanged slots/content;ten single-operand changes,work25 and separate no-coverage control remain distinct.180 fresh structural checks reproduce freeze,including13 model identities.585 component checks are linked historical receipt,not fresh execution. No handler,RNG,graph execution,replay or behavioral qualification follows from freeze. Primary adversarial review is internal,not external.',acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'EMBODIED_RECEIVING_DECLARATION_REVIEW_REV1.json'),ref('scripts/review-freeze-embodied-receiving-models.mjs')]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/reviewer','/limits'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='RECEIVING AUTHORITY / LIMIT' if narrative else 'STRUCTURAL CHECK BACKING',judgment=roles[0]['judgment'])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='FOUR RECEIVING IMAGE AUTHORITY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Original180-check review rerun against immutable inputs;publication replaced by file/report equality.','Referenced585-check component receipt not whole-source reviewed or freshly executed here.','No public runtime qualification or independent chronology claim.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('RECEIVING AUTHORITY') for r in rows),originalBackingOccurrences=sum(r['role']=='STRUCTURAL CHECK BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
