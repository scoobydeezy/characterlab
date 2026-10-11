"""Review attention correction and distinct old/new run commitments."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-multisource-freeze-rev1'
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
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-multisource-freeze.mjs') and check['models']==43 and check['scenarios']==55
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archive=next(a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts'] if a['original']==check['freeze']['path'])
paths=[archive['original'],archive['archive']];sources={};roles=[];bindings=[];pairs={archive['archive']:archive['original']}
for p in paths:
 assert sha(p)==entries[p]['sha256']==archive['sha256'];v=load(p);sources[p]=v
 assert v['status']=='ACCEPTED AND FROZEN FINITE MODEL COHORT; RUNTIME QUALIFICATION NOT IMPLIED' and v['allocationCorrection']=='MS-ALLOC-CORR-001'
 if p==archive['original']:
  assert sha(v['contract'])==v['contractSha256'];bindings.append(ref(v['contract']))
  assert sha('docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json')==v['allocationSha256'];bindings.append(ref('docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json'))
  for m in v['models']:
   for f in m['files']:assert sha(f['path'])==f['sha256'];bindings.append(f)
 roles.append(dict(path=p,sha256=sha(p),role='MULTISOURCE FINITE SCENARIO FREEZE',judgment='55 named model/S0/input scenarios contain43 distinct model identities. Four laws each share baseline identity with known-zero/no-task/no-body controls,which vary initial state. All330 files and55 recipe entries reconstruct exactly and initial states admit;no runtime or matched DescriptionDice intervention reexecuted. Primary local review is not external review. MS-ALLOC-CORR-001 remains pre-admission allocation correction,distinct from rejected revision1 body-instruction/action construction mismatch. FamilyNormalized negative candidate and three Base-only DescriptionDice recipes remain separate.',acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),ref(P/'MULTISOURCE_CONSTRUCTION_FINDING_REV1.json'),ref(P/'MULTISOURCE_CODEC_BOUNDARY_FINDING_REV1.json')]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr in ['/status','/reviewer']
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='FREEZE AUTHORITY LIMIT' if narrative else 'COMMITMENT BACKING',judgment=roles[0]['judgment'])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-001','RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='TWO MULTISOURCE FREEZE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Identity/scenario distinction is verified,not a new behavioral finding.','Construction and codec failures referenced but not whole-source reviewed by this batch.','No runtime qualification,independent freeze chronology or Campaign3 closure implied.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role']=='FREEZE AUTHORITY LIMIT' for r in rows),originalBackingOccurrences=sum(r['role']=='COMMITMENT BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
