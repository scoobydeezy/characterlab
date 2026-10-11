"""Reconcile historical build receipts without manufacturing fresh execution."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-declaration-dependencies-rev1'
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
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limitations','name','expected','actual','errorClass'])
ip=P/'campaign3-history-source-roles-rev212/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if any(n in Path(p).name for n in ['DECLARATION_COVERAGE','FORBIDDEN_DEPENDENCY'])];assert len(paths)==4
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archives.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
bindings=[];notes={};receipts=[]
contexts=['empty','kind','validator','both'];roles=['qualified','namespace-only','wrong-namespace','unknown-validator'];positions=['constraint','projection','occurrence'];wrappers=['root','list','set','map-key','map-value','record-field','typed-payload'];dimensions=['roster','candidateDomain','recognition','body','state','activity','clock','rng','presentation','trace']
for p in paths:
 v=load(p);declaration='DECLARATION' in p;assert v['status']=='COMPONENT PASS'
 harness='src/test/fixtures/'+('campaign2DeclarationComparison.ts' if declaration else 'campaign2ForbiddenDependencies.ts')
 for x in [v['sourceFingerprint'],dict(path=harness,sha256=v['harnessSha256'])]:
  actual=x['path'] if ref(x['path'])['sha256']==x['sha256'] else archives[x['sha256']];assert ref(actual)['sha256']==x['sha256'];bindings.append(dict(owner=p,original=x,actual=ref(actual)))
 base=v['baseline'];assert base['status']=='PASS';cases=base['cases'];assert len({x['name'] for x in cases})==len(cases)
 assert all(x['actual']==x['expected'] and x['agrees'] for x in cases)
 if declaration:
  expected={f'declaration/{c}/{r}/{q}/{w}' for c in contexts for r in roles for q in positions for w in wrappers}|{f'record/{i}/{w}' for i in ['authored','runtime','observer'] for w in wrappers}|{'shared-three-positions','duplicate-position'}
  assert {x['name'] for x in cases}==expected and len(cases)==base['casesChecked']==359
  assert len(v['mutations'])==11 and [len(m['differences']) for m in v['mutations']]==[42,42,42,21,21,21,1,66,2,2,4]
  for m in v['mutations']:
   assert m['status']=='DETECTED' and m['casesChecked']==359
   assert all(not x['agrees'] and x['actual']!=x['expected'] and x['name'] in expected for x in m['differences'])
  notes[p]='Finite construction-labelled declaration matrix:336=4contexts x4roles x3positions x7wrappers,plus two sharing/duplicate controls and21 runtime record-role controls. Exact359 baseline names/verdicts checked. Eleven mutations preserve discrepancy sets42/42/42/21/21/21/1/66/2/2/4;sets overlap and are not independent behavior counts. Typed-identifier payload is opaque to declaration traversal;map keys/values,list/set and record fields are separate. Expected labels derive from corpus construction,not independent general compiler. Earlier wrong-schema/wrapper/orphan-validator harness failures remain in qualification history,not successful reports. Original/refresh payloads match except validator source identity;old body and harness resolve exactly. No whole model/restore/PRJ/runtime qualification.'
 else:
  expected={d+'/'+state for d in dimensions for state in ['absent','present']};assert {x['name'] for x in cases}==expected and len(cases)==20
  assert all(x['ambientReads']==0 and x['actual']=='ACCEPT' for x in cases)
  assert len(v['mutations'])==10 and {m['name'] for m in v['mutations']}==set(dimensions)
  for m in v['mutations']:
   assert m['status']=='DETECTED' and len(m['cases'])==20 and {x['name'] for x in m['cases']}==expected
   for x in m['cases']:
    assert x['expected']=='ACCEPT' and x['ambientReads']==1 and not x['agrees']
    assert x['actual']==('ContentValidationError' if x['name']==m['name']+'/absent' else 'ACCEPT')
  notes[p]='Twenty fixed-character qualification controls toggle ten test-only Boolean ambient stand-ins,all baseline accepts with zero proxy reads. Each added-dependency mutation records all20 rows:only its named absent case rejects;other19 accept but all20 are disagreements because each reads ambient state. Admission equality therefore does not imply dependency invariance. Stand-ins are not real body,roster,recognition or stochastic semantics and are restored after the harness. One admitted character/fixed declarations does not prove exhaustive host isolation or allVAL-U. Original/refresh rows match except exact validator fingerprint;no arbitrary failing-test detection or new runtime evidence.'
 receipts.append(dict(**ref(p),baselineCases=len(cases),mutations=len(v['mutations']),recordedMutationRows=sum(len(m.get('differences',m.get('cases',[]))) for m in v['mutations'])))
for stem in ['DECLARATION_COVERAGE','FORBIDDEN_DEPENDENCY']:
 vs=[load(P/f'CAMPAIGN2_{stem}_{suffix}.json') for suffix in ['PROOF','VAL_REFRESH']];assert {k:v for k,v in vs[0].items() if k!='sourceFingerprint'}=={k:v for k,v in vs[1].items() if k!='sourceFingerprint'}
chain=[ref(P/'campaign3-history-factory-qualification-history-rev1/review.json'),ref(P/'campaign3-history-independent-content-roles-rev1/review.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='HISTORICAL DECLARATION COVERAGE / NAMED AMBIENT DEPENDENCY CONTROLS',judgment=n,acceptanceChain=chain));leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All four JSON exports,including short verdicts,errors,case names,mutation code and hashes.'))
save('review.json',dict(status='FOUR DECLARATION/DEPENDENCY RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,recordedReceipts=receipts,exactBindings=bindings,preservedArtifacts=[],schema=ref(O/'schema.json'),limits=['Fresh stored-row/name-matrix checks only;no historical writer,production,oracle,mutant,test or build rerun.','Named ambient reads can distinguish an accepting mutant;do not reduce scope to reject/accept equality.','All exact referenced bodies resolve;prior source gaps and independent adequacy remain open.','No model,law,allocation,verdict,corpus or obligation status change.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT DECLARATION AND DEPENDENCY ROWS',sources=4,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
