"""Reconcile historical build receipts without manufacturing fresh execution."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-independent-content-roles-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','control','limitations','name','expected','actual','result','reason','errorClass'])
ip=P/'campaign3-history-source-roles-rev211/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if any(n in Path(p).name for n in ['INDEPENDENT_CONTENT','INDEPENDENT_ROLE'])];assert len(paths)==4
O.mkdir(exist_ok=True)
historical='src/campaign2/valDeclarations.ts';h='89e6e65afb8b8b640add46fc6413610d5802f0cf22d665b206128158157cf7c0';commit='42c2713ce044a04d53c294032462dd6ac25446e0'
data=subprocess.check_output(['git','show',commit+':'+historical]);assert hashlib.sha256(data).hexdigest()==h
saved=O/('recovered-'+h+'.ts')
if saved.exists():assert saved.read_bytes()==data
else:saved.write_bytes(data)
recovered=[dict(**ref(saved),method='Exact raw Git source recovery; bytes match historical commitment,not timestamp proof',origin=dict(path=historical,commit=commit))]
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']});archives[h]=saved.as_posix()
bindings=[];notes={};receipts=[]
for p in paths:
 v=load(p);assert v['status']=='COMPONENT PASS';content='CONTENT' in p
 req=v['sourceFingerprints'] if content else [v['sourceFingerprint']]
 oracle='src/test/fixtures/independentCampaign2'+('Content' if content else 'Roles')+'.ts';req=req+[dict(path=oracle,sha256=v['oracleSha256'])]
 for x in req:
  actual=x['path'] if ref(x['path'])['sha256']==x['sha256'] else archives[x['sha256']];assert ref(actual)['sha256']==x['sha256'];bindings.append(dict(owner=p,original=x,actual=ref(actual)))
 base=v['baseline'];assert base['status']=='PASS';cases=base['cases'];assert len({x['name'] for x in cases})==len(cases)
 if content:
  assert len(cases)==572 and sum(x['expected']=='accept' for x in cases)==44
  assert all(x['exactAgreement'] and x['actual']==x['expected'] for x in cases)
  assert all(x['expectedSha256']==x['actualSha256'] for x in cases if x['expected']=='accept')
  graphs=[x for x in cases if x['name'].startswith('graph/')];assert len(graphs)==531
  assert {x['name'] for x in graphs}=={f'graph/{n}/{m}' for n in range(4) for m in range(2**(n*n))}
  for x in graphs:
   _,ns,ms=x['name'].split('/');n=int(ns);mask=int(ms);edges=[(a,b) for a in range(n) for b in range(n) if mask&(1<<(a*n+b))];remaining=set(range(n))
   while remaining:
    ready={a for a in remaining if not any(b==a and c in remaining for c,b in edges)}
    if not ready:break
    remaining-=ready
   assert x['expected']==('reject' if remaining else 'accept')
  assert sum(x['expected']=='accept' for x in graphs)==30
  assert len(v['supersededMutationAttempts'])==1 and v['supersededMutationAttempts'][0]['result']=='not distinguished by accept/reject comparison'
  for m in v['mutations']:
   assert m['status']=='DETECTED' and m['registrySha256']==base['registrySha256'] and len(m['cases'])==1
   for x in m['cases']:
    assert not x['exactAgreement'];assert x['actual']!=x['expected'] or x.get('actualSha256')!=x.get('expectedSha256')
  notes[p]='Finite independent content semantics with shared canonical transport.572 cases include complete531 directed graphs through three nodes;fresh topological-elimination check agrees with all stored cycle verdicts.44 accepted/528 rejected;30 graph cases accept. Accepted canonical hashes agree;rejection precedence is outside this claim. Seven mutations each store one selected disagreement,not572 mutated rows. Two are byte-only divergences with both sides accepting. Original one-site missing-reference omission remains not distinguished by later DFS rejection;two-site mutation is separate. Valid fixed VAL setup and arbitrary authoritative data remain controls;not arbitrary large graphs,independent codec or general character truth. Original/refresh differ in validator fingerprint only;exact original source recovered from Git.'
 else:
  assert len(cases)==base['casesChecked']==234 and base['differences']==[]
  assert all(x['agrees'] and x['actual']==x['expected'] for x in cases)
  for m in v['mutations']:
   assert m['status']=='DETECTED' and m['casesChecked']==234 and m['declarationHashes']==base['declarationHashes'] and m['differences']
   assert all(not x['agrees'] and x['actual']!=x['expected'] for x in m['differences'])
  assert [len(m['differences']) for m in v['mutations']]==[12,2,11,72,64,12,24]
  notes[p]='Finite234 atom/list role comparisons across empty/populated content and direct qualification/qualified-role/namespace-only-role boundaries. Exact carriers intentionally differ for structural admission versus direct qualification. Seven mutants run234 cases each and retain disagreement counts12/2/11/72/64/12/24;these overlap and are not independent behavior counts. Full typed identity equality differs from stable payload;namespace-only roles do not silently acquire character qualification. No recursive record/map-key traversal or general independent decoder claim. Original/refresh payloads match except validator source identity;oracle bytes match. Source hash proves bytes,not historical execution time.'
 assert len(v['mutations'])==7
 receipts.append(dict(**ref(p),baselineCases=len(cases),mutations=7,selectedMutationRows=sum(len(m.get('cases',m.get('differences',[]))) for m in v['mutations']),completeGraphClassifications=531 if content else 0))
for stem in ['CONTENT','ROLE']:
 vs=[load(P/f'CAMPAIGN2_INDEPENDENT_{stem}_{suffix}.json') for suffix in ['PROOF','VAL_REFRESH']]
 assert {k:v for k,v in vs[0].items() if k not in ['sourceFingerprints','sourceFingerprint']}=={k:v for k,v in vs[1].items() if k not in ['sourceFingerprints','sourceFingerprint']}
chain=[ref(P/'campaign3-history-factory-qualification-history-rev1/review.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL INDEPENDENT CONTENT / ROLE CORPUS AND SOURCE REFRESH',judgment=n,acceptanceChain=chain));leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All four JSON exports,including short verdict/error values,case labels,mutation strings and canonical hashes.'))
save('review.json',dict(status='FOUR INDEPENDENT CONTENT/ROLE RECEIPTS RECONCILED; ORIGINAL VALIDATOR RECOVERED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=recovered,schema=ref(O/'schema.json'),limits=['Fresh graph-label classification and recorded-row consistency checks only;no production/oracle/mutation runtime rerun.','Original and refresh cohorts are distinct source commitments,not independent mechanisms. Survived first attempt remains preserved.','No new missing source identity in this batch;all prior gaps and independent adequacy remain open.','No model,law,allocation,verdict,corpus or obligation status change.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT ROWS AND GRAPH CLASSIFICATIONS',sources=4,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recoveredSources=1,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
