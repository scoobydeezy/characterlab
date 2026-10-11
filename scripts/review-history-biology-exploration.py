"""Reconcile biological exploratory cohort lineage without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-exploration-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev305/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=[f'BIOLOGICAL_INTEGRATION_EXPLORATION_REV{i}.json' for i in [1,2,3]]+['BIOLOGICAL_DOMAIN_EXPLORATION_REV1.json']
cohorts=[load(P/n) for n in names];main=load(P/'BIOLOGICAL_SYSTEM_RESULT_REV1.json');closure=load(P/'BIOLOGICAL_SYSTEM_CLOSURE_REV1.json')
assert all(v['status']=='EXPLORATION ONLY' and set(v)=={'status','results'} for v in cohorts)
assert [len(v['results']) for v in cohorts]==[10,10,11,32]
for v in cohorts[:3]:
 assert len({r['law'] for r in v['results']})==len(v['results'])
 for r in v['results']:
  assert set(r)=={'law','rows'} and len(r['rows'])==48
  assert [q['at'] for q in r['rows']]==list(range(1,49))
  assert all(set(q)==set('at intent executed body before beliefs grounds control inhibited affect'.split()) for q in r['rows'])
assert [r['law'] for r in cohorts[0]['results']]==[r['law'] for r in cohorts[1]['results']]
for r in cohorts[2]['results']:
 x=next(z['snapshot'] for z in main['results'] if (z['name'],z['law'],z['seed'])==('main',r['law'],7))
 projection=[dict(at=q['at'],intent=q['intent'],executed=x['world'][i]['executed'],body=x['world'][i]['state']['channels']['reward'],before=q['before'],beliefs=q['beliefs']['drug'],grounds=q['grounds'],control=q['control'],inhibited=q['inhibited'],affect=q['affect']) for i,q in enumerate(x['rows'])]
 assert projection==r['rows']
for r in cohorts[3]['results']:
 assert set(r)==set('name seed sequence freeDrug loadedDrug snapshot'.split())
 assert r['snapshot']==next(z['snapshot'] for z in main['results'] if (z['name'],z['law'],z['seed'])==(r['name'],'Full',r['seed']))
 assert r['sequence']==[q['intent'] for q in r['snapshot']['rows']]
 assert r['freeDrug']==r['sequence'][8:].count('drug') and r['loadedDrug']==r['sequence'][32:40].count('drug')
first=[v['results'][0]['rows'] for v in cohorts[:3]]
assert first[0][32]['control']==400 and first[0][32]['inhibited'] is True
assert first[0][23]['beliefs']['withdrawal']==first[0][23]['beliefs']['harm']==0
assert first[1][23]['beliefs']['harm']==100 and first[1][23]['beliefs']['withdrawal']==258
assert first[1][32]['control']==200 and first[1][32]['inhibited'] is False
assert first[2][8]['beliefs']['pleasure']==201 and first[2][23]['beliefs']['pleasure']==70
notes={
(P/names[0]).as_posix():'Rejected first exploration:10 laws/480 projected rows,not qualified model/run identities or replay. Combined passive decay/action sensing masked maintenance relief and simultaneous healing hid harm; residual pleasure was assigned to withholding. At24 drug withdrawal/harm estimates are0; load600 leaves control400/inhibition active at33,not an inhibition-failure witness. Archived development sources and exact findings preserve defects; no biological or addiction law is refuted by a malformed causal construction.',
(P/names[1]).as_posix():'Second pre-freeze exploration:10 laws/480 projected rows. Separating elapsed/action physics produces harm100 and withdrawal258 by24; load800 yields control200 with inhibition off at33. Still rejected as final qualification: consequence sensing included newly updated adaptation before its lawful140 boundary,and positive expectation bypassed cue history. Revisions change causal source construction,not evidence that a favored comparator was proven necessary. Preserve source archives and original rows.',
(P/names[2]).as_posix():'Third exploration:11 laws/528 projected rows including NoAppraisalImpulse; every stored projection equals the matching later Full/main-seed7 or comparator snapshot projection. This corroborates content only,not prospective model/run identity publication or independent execution counts. Safe before/learned belief and diagnostic body/executed fields remain distinct. Historical writer summaries and omitted complete saves do not prove native scheduler/replay or full causal closure.',
(P/names[3]).as_posix():'Domain exploration:32 Full snapshots,all eight main/noLoad seeds plus16 other controls. Every full snapshot equals its named later qualified result; sequence,free-drug and loaded-drug counts recompute exactly. Equality does not create32 extra qualified runs or historical identity commitments. Seed7 is used for these controls; later added control probes and altered seed choices belong to the52-run frozen matrix. Coupling,resource,injury and recovery results retain bounded domain findings,not nine irreducible meters or population relapse probabilities.'}
chain=[ref(P/n) for n in ['BIOLOGICAL_DEVELOPMENT_FINDING_REV1.json','BIOLOGICAL_DEVELOPMENT_FINDING_REV2.json','BIOLOGICAL_SYSTEM_DOMAIN_FINDINGS.md','CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md','campaign3-history-biology-main-rev1/review.json','BIOLOGICAL_SYSTEM_CLOSURE_REV1.json']]

def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'NARRATIVE' if q in ['/status','/scope'] else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FIXTURE GATE SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Routing receipt remains dated planning evidence; no later source bytes substituted for a missing original. Independent adequacy remains separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='EXPLORATORY BIOLOGY COHORT; FAILED CONSTRUCTION OR PRE-FREEZE CORROBORATION',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x if len(x)<=200 else None,textLength=len(x),textSha256=hashlib.sha256(x.encode('utf-8')).hexdigest(),role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

for finding in ['BIOLOGICAL_DEVELOPMENT_FINDING_REV1.json','BIOLOGICAL_DEVELOPMENT_FINDING_REV2.json']:
 for x in load(P/finding)['artifacts']:bind((P/finding).as_posix(),dict(path=x['preserved'],sha256=x['sha256']))
for x in closure['artifacts']:
 if x['path'] in notes:bind((P/'BIOLOGICAL_SYSTEM_CLOSURE_REV1.json').as_posix(),x)

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

save('schema.json',dict(shortStringsIncluded=True,longStringsBoundByExactSourcePointerLengthAndHash=True,leaves=leaves))
save('stored-check.json',dict(status='PASS STORED EXPLORATION LINEAGE',lawCounts=[10,10,11],projectedRows=[480,480,528],matchingFinalProjections=11,matchingFinalSnapshots=32,scope='Exact stored-content joins; no exploratory writer, runtime replay or prospective identity/timing proof.'))
save('unresolved.json',dict(searchScope='Current named paths, REV305 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='BIOLOGICAL EXPLORATORY LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored rows and source commitments checked; no original writer or runtime replay.','Rejected cohorts retain their original causal defects; matching later content is not an additional qualified run or timing proof.','No clinical law, minimal-domain necessity or independent historical timing proof.'],obligations=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS STORED BIOLOGICAL EXPLORATION LINEAGE',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),newBackingResources=len(preserved),projectedRows=1488,matchingFinalProjections=11,matchingFinalSnapshots=32,review=ref(O/'review.json')))

assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
