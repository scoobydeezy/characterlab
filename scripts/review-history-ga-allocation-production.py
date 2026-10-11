"""Actual component witnesses remain distinct from public registration proof."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-allocation-production-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
common='Component evidence only. Native phase110 registration, exact physical-key authority, public allocation slots, canonical patches, trace exclusion and persistence/rollback require their separate public evidence. No new psychological mechanism or allocation.'
specs={}
def add(path,note):specs[path]=note+' '+common
for i in [1,2]:
 add(f'docs/planning/GA_OUTPUT_ALLOCATION_TESTS_REV{i}.json',('Both initial GOA fixtures fail source construction with invalid source symbol before exercising allocation; no allocation behavior qualified by REV1. ' if i==1 else 'Corrected fixtures pass both witnesses. ')+ 'GOA-A uses nine actual channels/three visible items:23 source ordinals,three derived role claims,two selectors,two acquisitions,total30;11 observations share one experience,body3x3 views and visual3 children. GOA-B same unavailable requests:15 source ordinals plus two empty selectors,total17;no experience/acquisition. Current and exact historical local-source versions freshly pass both assertions with remaining imports current. A single test allocator is not public transactional ordinal admission.')
 add(f'docs/planning/GA_REPLENISHMENT_PRODUCTION_TESTS_REV{i}.json',('Initial52 assertions:49 pass and three new LRP tests fail at setup because three real mapped reserves are required. This is fixture rejection,not evidence of broken replenishment mathematics. ' if i==1 else 'Corrected52 assertions all pass historically; same52 names retained,not a weakened source admission. ')+ 'LRP-A distinguishes stored80@0 from materialized70@10,delivery40 gives applied30/overflow10/new100@10;old source and sibling leaves unchanged. LRP-B zero delivery reanchors70@10 and detached result cannot mutate source; safe sample contains channel/kind/lower/signal/upper only. LRP-C rejects unknown target,negative time/delivery without changing source. Fresh five focused tests pass on current and exact old local-source versions; full historical52 dependency environment not replayed.')
add('docs/planning/GA_REPLENISHMENT_PRODUCTION_REVIEW_REV1.json','Original three mutation bodies replayed against exact Git-recovered source SHA. Stored-anchor substitution and prior-source mutation fail LRP-A; skipped zero reanchor fails LRP-B. The old module differs from current extraction into replenishLocalReserveDefinition; exact old and current focused results both pass,without aliasing their hashes.')
add('docs/planning/GA_LOCAL_REPLENISHMENT_STAGE_REV1.md','Corrects omitted world-side authored replenishment already in accepted calendar. One terminal physical110 stage,composite reserve key,no observer projection,children,occurrence or learning route. 67 templates still exclude inherited registrations and are not work ceiling. Failed/corrected fixture history preserved; physical prior/materialized/new anchor remain distinct and excluded from safe observations.')
add('docs/formal/LOCAL_RESERVE_REPLENISHMENT_PRODUCTION_COMPONENT.md','Version local-reserve-replenishment-production/0.1-candidate. Existing materialization/replenishReserve law,including zero reanchor and exact numeric result; old source immutable,result detached,no runtime identity. Canonical454/479 reuse is proposed adapter binding,not established by trusted physical component. Fresh exact-old/current focused and original mutation controls support the component scope.')
entries={e['path']:e for e in load(B/'manifest.json')['entries']};prior=load(P/'campaign3-history-source-roles-rev153/index.json');assigned={r['path'] for r in prior['roleAssignments']}
replay=load(O/'replay.json');archive=replay['archive'];assert ref(archive['path'])['sha256']==archive['sha256']
for f in replay['inputs']:assert ref(f['path'])==f
assert [(r['passed'],r['failed']) for r in replay['rows'][:2]]==[(5,0),(5,0)]
assert len(replay['rows'])==5 and all(r['failed']>0 for r in replay['rows'][2:])
for r in replay['rows']:assert ref(r['report']['path'])==r['report']
def assertions(v):return [a for t in v['testResults'] for a in t['assertionResults']]
current=load(O/'current.json');currentNames={a['fullName'] for a in assertions(current)}
cohorts=[]
for prefix,expected in [('GA_OUTPUT_ALLOCATION_TESTS',[(2,0,2),(2,2,0)]),('GA_REPLENISHMENT_PRODUCTION_TESTS',[(52,49,3),(52,52,0)])]:
 previous=None
 for i,w in enumerate(expected,1):
  path=P/f'{prefix}_REV{i}.json';v=load(path);aa=assertions(v)
  assert (v['numTotalTests'],v['numPassedTests'],v['numFailedTests'])==w and len(aa)==w[0]
  names={a['fullName'] for a in aa};assert len(names)==len(aa)
  if previous is not None:assert previous==names
  previous=names
  failed=[dict(name=a['fullName'],messages=a['failureMessages']) for a in aa if a['status']=='failed']
  if i==1:
   reason='invalid source symbol' if prefix.startswith('GA_OUTPUT') else 'three real mapped reserves required'
   assert all(any(reason in s for s in a['messages']) for a in failed)
  cohorts.append(dict(**ref(path),total=w[0],passed=w[1],failed=w[2],failures=failed))
  focused={n for n in names if n.startswith(('GOA-','LRP-'))};assert focused<=currentNames
roles=[];strings={};bindings=[]
for p,j in specs.items():
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='ACTUAL GA ALLOCATION/PHYSICAL COMPONENT HISTORY; PUBLIC GATES SEPARATE',judgment=j,acceptanceChain=[ref(O/'replay.json')]))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in v.get('sources',[]):
  actual=ref(f['path'])
  if actual!=f:
   assert f['path']==archive['originalPath'] and f['sha256']==archive['sha256'];actual=ref(archive['path'])
  bindings.append(dict(source=p,original=f,resolved=actual))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or ptr.startswith('/limits/')
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA ALLOCATION AND REPLENISHMENT COMPONENT HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,cohorts=cohorts,preservedArtifacts=[dict(**ref(archive['path']),method=archive['method']+'; commit '+archive['commit'])],limits=[common,'Five focused assertions per source version,three old mutation bodies. Historical source pinned,other modules current; no full old dependency environment claim.','Failed setup fixtures preserved and not recast as failed runtime laws. Accessor/registration/history authority adequacy remains open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshPassingAssertions=10,originalMutantsDetected=3,recoveredArtifacts=1,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
