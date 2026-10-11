"""Closed historical wrapper inventory and boundary-probe schema review."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';R=P/'public-wrapper-quiescence-rev1';O=P/'campaign3-history-wrapper-inventory-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def keys(v,s):assert set(v)==set(s.split()),set(v)
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
save(O/'commands.json',dict(command='node scripts/check-history-wrapper-inventory.mjs',exitCode=0,result='PASS49 historical producers:15 inapplicable/30 guarded/4 repaired;52 original factory routes. Current directory completeness not asserted.',checker=ref('scripts/check-history-wrapper-inventory.mjs'),originalCheckers=[ref('scripts/check-public-wrapper-inventory.mjs'),ref('scripts/check-public-wrapper-routing.mjs')],scope='Read-only original-source/probe reconstruction, no fresh boundary execution. Archived graph determines47 native candidates; saved52 factories determine route scope.'))
archive={a['original']:a for a in load(R/'PRESERVATION.json')['artifacts']};specs={};sources={}
for n in ['INVENTORY.json','INVENTORY_DISPOSITIONS.json','FACTORY_ROUTING.json']:
 p=R/n;v=load(p);sources[p.as_posix()]=v
 if n=='INVENTORY.json':
  keys(v,'scope inventory');assert len(v['inventory'])==47
  for r in v['inventory']:
   keys(r,'path sha256 ledgerAfterScheduler serializedLedger alreadyGuarded settlement publication');a=archive[r['path']];assert r['sha256']==a['sha256']==sha(a['archive']);text=Path(a['archive']).read_bytes().decode();assert r['settlement'] in text and all(s in text for s in r['publication'])
   assert all(type(r[k]) is bool for k in ['ledgerAfterScheduler','serializedLedger','alreadyGuarded'])
  j='47 archived native candidates; exact extracted source snippets and hashes match archived bytes. Heuristic flags are investigation leads, not semantic guard verdicts. GA manual and Campaign2 shared producer are added separately; current-directory completeness is not claimed.'
 elif n=='INVENTORY_DISPOSITIONS.json':
  keys(v,'status scope dispositions counts');assert len(v['dispositions'])==49
  assert v['counts']=={'INAPPLICABLE_TO_SPLIT_PUBLICATION':15,'INDEPENDENTLY_GUARDED':30,'EXPOSED_REPAIRED':4}
  for r in v['dispositions']:
   assert set(r) in [set('path classification reason sourceSha256 preservedSha256 probe'.split()),set('path classification reason sourceSha256 preservedSha256'.split()),set('path classification reason sourceSha256'.split())];assert sha(r['path'])==r['sourceSha256']
  j='49 classifications reconstructed by original source-based checker with archived candidate scope:4 narrow repairs,30 independent defenses,15 scheduler-only/constant-continuation cases. Inapplicable does not mean no psychology/state. Existing random-session denial and whole-wrapper guard are distinct defenses; no general synchronization redesign.'
 else:
  keys(v,'status scope factories');assert len(v['factories'])==52
  for r in v['factories']:keys(r,'factory sha256 routes');assert sha(r['factory'])==r['sha256'];assert all(route[0]==r['factory'] for route in r['routes'])
  j='52 original factory import routes reproduced against source hashes and declared49 producers. A route establishes reachability, not protection; original semantic classifications and probes are required. Later factories excluded explicitly, not silently certified.'
 specs[p.as_posix()]=j
paths=sorted(list(R.glob('*-probe-rev*.json'))+list(R.glob('*-concurrent-rev*.json')));assert len(paths)==38;observations=0;torn=0
for p in paths:
 v=load(p);sources[p.as_posix()]=v
 if 'rows' in v:
  assert set(v) in [set('name status rows torn'.split()),set('name status rows torn modelIdentitySha256 runIdentitySha256'.split())];assert v['status']=='PROBED' and type(v['torn']) is bool
  assert [r['at'] for r in v['rows']]==list(range(1,len(v['rows'])+1))
  for r in v['rows']:
   keys(r,'at observed final partialSave');o=r['observed'];assert set(o) in [set('accepted error snapshotAccepted'.split()),set('accepted saveSha256 snapshotAccepted'.split()),set('accepted error ledgerAccepted snapshotAccepted'.split())]
   assert type(o['accepted']) is bool and type(o['snapshotAccepted']) is bool;assert re.fullmatch('[0-9a-f]{64}',r['final']);assert r['partialSave']==(o['accepted'] and o['saveSha256']!=r['final']);torn+=int(r['partialSave'])
  assert v['torn']==any(r['partialSave'] for r in v['rows']);observations+=len(v['rows'])
  j='Deterministic nonmutating before-commit microtask observations, not arbitrary-concurrency completeness. Stored accepted-save hash compared with ordinary completed prefix; snapshot acceptance and optional ledger acceptance remain separate. Probe counts are sampled instants, not new model phenomena.'
 elif 'result' in v:
  keys(v,'result status clock');keys(v['result'],'accepted error');assert v['clock']=='10' and v['result']['accepted'] is False
  assert v['status']==('Failed' if 'rev1' in p.name else 'Active')
  j='Embodied second-call adversary:both calls reject, but before repair cleanup interference leaves Failed with undefined abort; after repair rejection preserves first operation Active. This is lifecycle isolation, distinct from accepted torn-save publication.'
 else:
  keys(v,'name status error');assert v['name']=='personstate' and v['status']=='HARNESS_ERROR'
  j='Wrong Personstate export name prevented runtime construction; harness-only error, not evidence of a runtime quiescence defect. Corrected PersonState probe retained separately.'
 specs[p.as_posix()]=j
assert (observations,torn)==(217,12)
for n in ['identityTask','identityBiology','biologyPublic']:
 a=load(R/(n+'-probe-rev1.json'));b=load(R/(n+'-probe-rev2.json'));assert a['torn'] and not b['torn'];assert all(a[k]==b[k] for k in ['name','modelIdentitySha256','runIdentitySha256']);assert [r['final'] for r in a['rows']]==[r['final'] for r in b['rows']]
 assert all(not r['observed']['accepted'] and not r['observed']['snapshotAccepted'] for r in b['rows'])
 if n!='identityTask':assert [r['at'] for r in a['rows'] if r['partialSave']]==[9,10,11,12]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};closure=P/'PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json';bindings={a['path']:a['sha256'] for a in load(closure)['files']};roles=[]
for p,j in specs.items():
 assert sha(p)==entries[p]['sha256']==bindings[p];roles.append(dict(**ref(p),role='WHOLE HISTORICAL INVENTORY OR PROBE',judgment=j,acceptanceChain=[ref(closure),ref(O/'commands.json'),ref(P/'campaign3-history-wrapper-repair-rev1/review.json')]))
strings={(p,ptr):t for p,v in sources.items() for ptr,t in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text']
  pointer=u['location']['pointer'];narrative=pointer=='/scope' or pointer.endswith('/reason') or pointer=='/error' or pointer=='/result/error'
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPED CLAIM / REASON / FINDING' if narrative else 'TYPED PROBE OR SOURCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='41 INVENTORY/PROBE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),observations=217,tornBeforeRepair=12,obligations=obs,limits=['Historical49/52 scope, not current55/58 proof.','No fresh probe/test/simulation; plans and test/archive schemas remain separate.','Audit LF-only locator failure preserved in development.json; corrected declaration boundary retains all old classification/routing assertions.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('SCOPED') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
