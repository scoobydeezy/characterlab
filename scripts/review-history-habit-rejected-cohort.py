"""Reconcile longitudinal habit rejected qualification cohort and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-habit-rejected-cohort-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev300/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['LONGITUDINAL_HABIT_PLAN_REV1.json','longitudinal-habit-execution-rev1/joined-0.json'];a,j=[load(P/n) for n in names]
b=load(P/'LONGITUDINAL_HABIT_PLAN_REV2.json');k=load(P/'longitudinal-habit-execution-rev2/joined-0.json')
assert len(a['models'])==10 and len(a['runs'])==960 and len(a['sources'])==8
assert len({x['modelIdentity'] for x in a['models']})==10 and len({x['runIdentity'] for x in a['runs']})==960
keys=['law','keepEpisodes','relearning','alternateCue','visible','seed']
expected=set(itertools.product(['Derived','Stored','ExplicitBeliefOnly','ScheduledOnly','EraseHistory'],[False,True],['Observed','Hidden','Unavailable'],[False,True],[False,True],range(8)))
assert {tuple(r['profile'][x] for x in keys) for r in a['runs']}==expected
assert all(r['modelIdentity'] in {m['modelIdentity'] for m in a['models']} for r in a['runs'])
assert a['sources']==b['sources'] and all(s['keepEpisodes'] is False for s in a['sources'])
assert [r['profile'] for r in a['runs']]==[r['profile'] for r in b['runs']]
assert all(x['runIdentity']!=y['runIdentity'] and x['modelIdentity']!=y['modelIdentity'] for x,y in zip(a['runs'],b['runs']))
assert a['required']==b['required']==dict(models=10,runs=960,receiverPrefixes=16320,receiverAdvancing=15360,receiverTerminal=960,reusedNativeSources=8,reusedNativePrefixes=136,freshJoinedRuns=4,freshJoinedPrefixComparisons=68,freshJoinedRestores=8)
assert a['required']['receiverPrefixes']==960*17 and a['required']['receiverAdvancing']==960*16
assert j['planSha256']==ref(P/names[0])['sha256'] and j['runIdentity']==a['runs'][0]['runIdentity'] and j['profile']==a['runs'][0]['profile']
assert [r['prefix'] for r in j['prefixes']]==list(range(17))
assert [r['prefix'] for r in j['restored']]==[8,16] and [r['advanced'] for r in j['restored']]==[True,False]
assert j['restored'][1]['saveHash']==j['restored'][1]['successorHash']
assert [x for x in j if j[x]!=k[x]]==['planSha256','runIdentity']
old={r['path']:r['sha256'] for r in a['artifacts']};new={r['path']:r['sha256'] for r in b['artifacts']}
assert len(a['artifacts'])==250 and len(old)==139 and len(new)==140
assert len(new.keys()-old.keys())==3 and len(old.keys()-new.keys())==2 and len(old.keys()&new.keys())==137
for plan in [a,b]:
 assert all(len({r['sha256'] for r in plan['artifacts'] if r['path']==p})==1 for p in {r['path'] for r in plan['artifacts']})
assert all(old[x]==new[x] for x in old.keys()&new.keys())
notes={
(P/names[0]).as_posix():'Superseded qualification plan froze10 model configurations/960 full-factorial runs,8 default-retention native sources,16320 receiver prefixes,136 reused native prefixes and four fresh joined sentinels/eight restores. Requirements are not evidence of completion. REV1 receiver fault oracle expected ROUTINE_INJECTED instead of validLH_INJECTED and failed before first receiver receipt; original joined seed0 survived. REV2 retains profiles/source rows/required counts and shared137-path subset (250 old artifact occurrences name139 unique paths), changes harness/protocol commitments and all model/run execution identities; no production semantics changed. Reused native restoration, component receiving restoration and fresh joined sentinels remain different scopes.',
(P/names[1]).as_posix():'Only preserved complete joined seed0/default receipt from interruptedREV1:17 prefix comparisons and two joined restores at8/16, one advancing/one terminal. Matches first old planned identity. Every prefix/save/successor/profile field equals REV2 joined0; plan hash and run identity differ. Historical corroboration is excluded from new four-run/eight-restore completion counts. Receipt is not a960-run matrix, all-tail replay or new native scheduler admission. Hash rows do not independently reconstruct full save bytes.'}
chain=[ref(P/'campaign3-history-habit-rejected-cohort-development-rev1/finding.json')]+[ref(P/n) for n in ['LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json','LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json','LONGITUDINAL_HABIT_PLAN_REV2.json','longitudinal-habit-execution-rev2/joined-0.json','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md']]
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
def kind(p,q):return 'NARRATIVE' if q=='/status' else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT HABIT COHORT SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='SUPERSEDED HABIT EXPERIMENT COHORT; PARTIAL EXECUTION PRESERVED',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

bind((P/names[1]).as_posix(),dict(path=(P/names[0]).as_posix(),sha256=j['planSha256']))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV300 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='REJECTED HABIT COHORT RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Exact plan product and stored joined hash equality checked; no runtime or historical harness rerun.','Old plan and sole joined receipt remain historical, not counted into corrected qualification matrix.','Component episode loss is not global erasure or new native memory admission; full-tail/lifetime claims remain outside scope. Independent adequacy open.'],obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS REJECTED HABIT COHORT ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),plannedRuns=960,completedOldJoinedRuns=1,oldJoinedPrefixComparisons=17,oldJoinedRestores=2,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
