"""Reconcile public biology plan and closure lineage without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-public-lineage-rev2'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev306/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
import subprocess,os
for x in load(P/'BIOLOGY_PUBLIC_BOOKKEEPING_REV1.json')['artifacts']:
 assert ref(x['preserved'])['sha256']==x['sha256']
 archives[x['sha256']]=x['preserved']
names=[f'BIOLOGY_PUBLIC_PLAN_REV{i}.json' for i in [1,2,3]]+[f'BIOLOGY_PUBLIC_CLOSURE_REV{i}.json' for i in [1,2]]+['BIOLOGY_PUBLIC_RESULT_PART0_REV2.json','BIOLOGY_PUBLIC_RESULT_PART2_REV2.json']
values=[load(P/n) for n in names];plans=values[:3];closures=values[3:5]
assert all([k for k in plans[0] if plans[0][k]!=p[k]]==['artifacts'] for p in plans[1:])
assert all(len(p['models'])==len(set(p['models']))==28 and len(p['runs'])==58 for p in plans)
assert len({r['runIdentity'] for r in plans[0]['runs']})==58
sourceDeltas=[]
for old,new in zip(plans,plans[1:]):
 a={r['path']:r['sha256'] for r in old['artifacts']};b={r['path']:r['sha256'] for r in new['artifacts']}
 sourceDeltas.append(dict(added=sorted(b.keys()-a.keys()),removed=sorted(a.keys()-b.keys()),changed=sorted(p for p in a.keys()&b.keys() if a[p]!=b[p])))
assert [len(d['changed']) for d in sourceDeltas]==[2,5]
assert sourceDeltas[1]['added']==['src/campaign3/biologyPublicBytes.ts']
plan=plans[2];assert sum(len(r['prefixes']) for r in plan['runs'])==270
assert sum(sum(i<len(r['frames']) for i in r['prefixes']) for r in plan['runs'])==212
for r in plan['runs']:
 assert r['modelIdentity'] in plan['models']
 full=(r['name'],r['law'],r['seed'])==('main','Full',7) or r['baseline'] is None
 assert r['prefixes']==(list(range(len(r['frames'])+1)) if full else [0,8,len(r['frames'])])
for part,v in zip([0,2],values[5:]):
 assert v['planSha256']==ref(P/names[1])['sha256'] and v['part']==part
 assert [r['index'] for r in v['results']]==list(range(part,58,4))
 assert v['results']==load(P/f'BIOLOGY_PUBLIC_RESULT_PART{part}_REV3.json')['results']
assert [k for k in closures[0] if closures[0][k]!=closures[1][k]]==['artifacts']
a,b=[{r['path']:r['sha256'] for r in c['artifacts']} for c in closures]
assert set(b)-set(a)=={'docs/planning/BIOLOGY_PUBLIC_CLOSURE_REV1.json','docs/planning/BIOLOGY_PUBLIC_BOOKKEEPING_REV1.json'}
assert {p for p in a.keys()&b.keys() if a[p]!=b[p]}=={'scripts/check-biology-public-closure.mjs','docs/planning/CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md'}
receipt=subprocess.run(['node','--import=./scripts/public-wrapper-preserved-source-loader.mjs','scripts/check-biology-public-closure.mjs'],env=dict(os.environ,CHARACTERLAB_HISTORICAL_WRAPPER_CHECK='1'),capture_output=True,text=True,check=True)
assert 'PASS biological public integration:28 models/58 runs/270 complete prefixes' in receipt.stdout
notes={}
for i,n in enumerate(names[:3],1):
 notes[(P/n).as_posix()]=f'Public plan REV{i}:same28 model identities/58 complete original run recipes,frames,configs,baseline links,seeds,prefixes and experiment identity across allthree revisions; only source commitments change. REV1 interrupted for excessive serialization before completed qualification rows; REV2 optimizes serialization/harness and later exposes actual large-save enumeration failure; REV3 adds intrinsic-byte adapter and regression. Scientific run identities unchanged does not erase implementation/version provenance. Selected native270 prefixes (212 advancing/58 terminal) are not component2389 all-prefix coverage. Full main seed7 and five supplements check every prefix; other runs initial/acquisition8/terminal plus initial full continuation. Late first ComparisonCase is disclosed; final wrapper remains separately bound. Hash equality cannot prove publication timing.'
for i,n in enumerate(names[3:5],1):
 notes[(P/n).as_posix()]=f'Closure REV{i}:bounded native28 models/58 runs/270 unique prefixes,59 executions/273 checks due duplicate row35,53 component-equivalent trajectories and five supplemental controls. REV2 changes only artifact bindings for preserved line-ending bookkeeping; original result/model/count fields agree exactly. Dated56 scoped/328 reference tests and build are receipts,not freshly rerun suites. Historical-source loader rechecks old closure against explicit preserved graph; current publication-barrier repair is separately qualified under RO022 and is not substituted into old commitments. No general forecasting,clinical model,identity update,whole campaign or all-component-prefix native proof.'
for n in names[5:]:
 notes[(P/n).as_posix()]='Completed old REV2 partition receipt,not the failed whole REV2 matrix. Original plan hash remains bound; its15 or14 complete rows exactly equal corresponding final REV3 partition rows. These29 rows corroborate content but add no unique final runs/prefixes and do not erase the interrupted large-save failure in another worker. All seeds and original run identities retained; no fresh runtime or replay.'
chain=[ref(P/'campaign3-history-biology-public-lineage-rev1/source-recovery.json')]+[ref(P/n) for n in ['BIOLOGY_PUBLIC_DEVELOPMENT_FINDINGS.md','BIOLOGY_PUBLIC_BOOKKEEPING_REV1.json','CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md','BIOLOGY_PUBLIC_SCOPE_AND_FINDINGS.md','campaign3-history-biology-run-schema-rev1/review.json','campaign3-history-biology-comparisons-rev1/review.json','CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md','public-wrapper-quiescence-rev1/PRESERVATION.json']]

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
 sources.append(dict(**ref(p),role='PUBLIC BIOLOGY PLAN/CLOSURE LINEAGE; EXACT HISTORICAL IMPLEMENTATION SCOPE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x if len(x)<=200 else None,textLength=len(x),textSha256=hashlib.sha256(x.encode('utf-8')).hexdigest(),role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

for n,v in zip(names[5:],values[5:]):bind((P/n).as_posix(),dict(path=(P/names[1]).as_posix(),sha256=v['planSha256']))

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
save('stored-check.json',dict(status='PASS PUBLIC BIOLOGY HISTORICAL SOURCE LINEAGE',sourceDeltas=sourceDeltas,models=28,runs=58,selectedPrefixes=270,advancing=212,terminal=58,matchingOldRows=29,command=['node','--import=./scripts/public-wrapper-preserved-source-loader.mjs','scripts/check-biology-public-closure.mjs'],requiredEnvironment={'CHARACTERLAB_HISTORICAL_WRAPPER_CHECK':'1'},exitCode=receipt.returncode,stdout=receipt.stdout,loader=ref('scripts/public-wrapper-preserved-source-loader.mjs'),checker=ref('scripts/check-biology-public-closure.mjs'),scope='Historical artifact checks against preserved source mapping; no current-runtime replay or fresh test execution.'))
save('unresolved.json',dict(searchScope='Current named paths, REV306 backing, all census/role hashes and explicit bookkeeping archives; no global absence claim.',gaps=gaps))
save('review.json',dict(status='PUBLIC BIOLOGY PLAN AND CLOSURE LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored rows and source commitments checked; no original writer or runtime replay.','Current publication repair is separate from historical source mapping; matching result content adds no runs or timing proof.','No clinical law, minimal-domain necessity or independent historical timing proof.'],obligations=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']))
save('check.json',dict(status='PASS PUBLIC BIOLOGY HISTORICAL LINEAGE',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),newBackingResources=len(preserved),plans=3,closures=2,oldCompletedPartitions=2,matchingOldRows=29,review=ref(O/'review.json')))

assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
