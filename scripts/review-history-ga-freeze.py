"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-freeze-rev1'
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
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-ga-freeze.mjs') and check['models']==43 and check['negativeControls']==129
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archive=next(a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'] if a['original']==check['freeze']['path'])
paths=[archive['original'],archive['archive'],(P/'GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19.json').as_posix(),(P/'general-attention-model-review-rev3/REVIEW.json').as_posix()];sources={};roles=[];bindings=[];pairs={archive['archive']:archive['original']}
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:assert sha(v['path'])==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256']))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for p in paths:
 assert sha(p)==entries[p]['sha256'];v=load(p);sources[p]=v
 if p!=archive['archive']:scan(v)
 budget=v['budget']
 for lane in ['baseline','feedback']:
  b=budget[lane];assert len(b['stages'])==67 and b['work']==sum(s['invocations'] for s in b['stages']) and b['outputs']==sum(s['invocations']*s['outputMaximum'] for s in b['stages']) and b['slots']==sum(s['invocations']*s['slotMaximum'] for s in b['stages'])
 for key in ['work','outputs','slots']:assert int(budget[key])==max(budget['baseline'][key],budget['feedback'][key])+budget['inherited'][key]
 assert [int(budget[k]) for k in ['work','outputs','slots']]==[92,239,228]
 roles.append(dict(path=p,sha256=sha(p),role='GA PROPOSAL / IMAGE REVIEW / FREEZE AUTHORITY',judgment='Materialized candidate,independent primary image review and accepted finite freeze are distinct gates.43 distinct model/run images reconstruct;129 missing-definition/role/registration controls reject.35 prior frozen models/247 image files remain exact.67 stage bounds per lane yield80 work/229 outputs/221 slots plus inherited12/10/7 yields92/239/228;conservative branch sum is not measured runtime consumption. Role-calibrated/disabled/spatial remain competitors. Rejected review-rev1 refers to unfrozen aliased proposal with wrong allocation encoder,uncommitted required S0 and empty Windows inventory,not accepted frozen predecessor35. No public runtime/corpus closure or independent chronology follows from image approval.',acceptanceChain=[ref(O/'canonical-check.json'),ref(O/'source-recovery.json'),ref(P/'general-attention-model-review-rev1/DISPOSITION.md')]))
assert sha(archive['archive'])==archive['sha256']==sha(archive['original'])
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/scope'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='GA IMAGE AUTHORITY / LIMIT' if narrative else 'COMMITMENT BACKING',judgment=roles[0]['judgment'])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='FOUR GA IMAGE AUTHORITY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Predecessor35 model/run/image preservation is verified,but three predecessor implementation-source hashes do not match current bytes and exact-path reachable Git search did not recover them;old freeze remains unassigned pending provenance disposition.','No current dependency was substituted for a mismatching old hash.','Current43 cohort full image receipt reproduces;public runtime replay not executed.','Rejected unfrozen revision1 disposition referenced,not whole-source reviewed here.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('GA IMAGE') for r in rows),originalBackingOccurrences=sum(r['role']=='COMMITMENT BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
