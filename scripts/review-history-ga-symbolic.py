"""GA symbolic/numeric/member/write-policy scopes with original archive joins."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-symbolic-rev1';O.mkdir(exist_ok=True)
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
specs={
'GA_COHORT_SOURCE_RECONCILIATION_REV1':'32 corrected recipe proposals,not public ModelIdentities. Probe/active/concern/receivers/deadline shift strictly after initial0. Authored R0=50,retained D and effective point remain distinct;missing glyph/position remain excluded component controls.31 comparison labels carry predecessor metadata:five list unchanged axes,and two retain removed regReference path;computed actual diffs are authoritative for this audit. No frozen recipe changed.',
'GA_COMPOSED_LOGICAL_TOPOLOGY_REV2':'67 stage templates and18 conditional edges,not work bound. Same-instant graph acyclic and nonbackward;future delivery separate.140 owners emit no outputs/children. Physical replenishment110 retains exact composite key,no learning route. Goal-baseline recall is not ordinary recall/presentation;graph retention and episode retention stay independent. Conditional last-parent joins/publication gates require later runtime qualification.',
'GA_OUTPUT_DECLARATIONS_REV3':'67 stage output/identity templates distinguish FreshOwned,ReservedOwned and borrowed references with nested slot reservations. Limits are per invocation,not whole-instant ceiling. Authenticate admission/parents,validate schema/roles,branch cardinality,transaction slots,then child binding. No new namespace or second allocator. Historical draft status is not runtime authority.',
'GA_REGISTRY_MEMBER_SHAPE_REV1':'218 symbolic names,67 stages,eight read projections and six owner scopes. Read projections preserve CharacterId/ObserverId and event/body partitions;missing leaf rejects rather than inventing empty. Protocol hook noncognitive;physical reserve owner separate;perception requires explicit root extension. Symbolic shape acceptance precedes permanent numeric members/exact model instances and grants no access itself.'}
recipe=load(P/'GA_COHORT_SOURCE_RECONCILIATION_REV1.json');prior=load(P/'ATTENTION_MEMORY_COHORT_RECIPE_REV1.json');assert len(recipe['recipes'])==32 and recipe['comparisons']==prior['comparisons']
for old,new in zip(prior['models'],recipe['recipes']):
 assert old['name']==new['name'];params=json.loads(json.dumps(old['parameters']));source=params['source'];reg=source.pop('regReference');source.update(probeAuthoredReference=50,initialDisplacement=reg-50,effectiveProbeNumerator=reg);schedule=params['schedule'];schedule.update(initialClock=0,probe=schedule['probe']+1,activeFrom=schedule['activeFrom']+1,concern=schedule['concern']+1,receivers=[t+1 for t in schedule['receivers']],deadline=schedule['deadline']+1);assert params==new['parameters']
def flatten(v,p=''):
 if isinstance(v,dict):return {a:b for k,x in v.items() for a,b in flatten(x,p+'.'+k if p else k).items()}
 if isinstance(v,list):return {a:b for k,x in enumerate(v) for a,b in flatten(x,p+'.'+str(k)).items()}
 return {p:v}
models={r['name']:flatten(r['parameters']) for r in recipe['recipes']};deltas=[]
for c in recipe['comparisons']:
 a,b=models[c['control']],models[c['candidate']];actual=[k for k in sorted(set(a)|set(b)) if a.get(k)!=b.get(k)];deltas.append(dict(**c,actualChanged=actual,missingDeclaredPaths=[k for k in c['changed'] if k not in a or k not in b],overdeclaredUnchanged=[k for k in c['changed'] if k in a and k in b and a[k]==b[k]]))
assert sum(bool(d['missingDeclaredPaths']) for d in deltas)==2 and sum(bool(d['overdeclaredUnchanged']) for d in deltas)==5
save(O/'comparison-correction.json',dict(status='CORRECT-FORWARD METADATA AUDIT; FROZEN SOURCE UNCHANGED',source=ref(P/'GA_COHORT_SOURCE_RECONCILIATION_REV1.json'),rows=deltas,scope='31 declared comparisons remain historical;actual scalar diffs expose stale source.regReference in two rows and redundant unchanged axes in five. Does not change model behavior or select a law. Actual producer consumes probeAuthoredReference and initialDisplacement in generalInheritedSource.ts.',producer=ref('src/campaign3/generalInheritedSource.ts')))
top=load(P/'GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json');output=load(P/'GA_OUTPUT_DECLARATIONS_REV3.json');members=load(P/'GA_REGISTRY_MEMBER_SHAPE_REV1.json');allocated=load(F/'GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE.json')
assert [s['name'] for s in top['stages']]==[s['name'] for s in output['stages']]==[s['name'] for s in members['stages']]
assert [(m['family'],m['member']) for m in members['members']]==[(m['family'],m['payload']) for m in allocated['members']]
check=load(O/'canonical-check.json');assert check['checkerSha256']==sha('scripts/check-history-ga-symbolic.mjs') and [r['faults'] for r in check['rows']]==[12,14]
artifacts={a['original']:a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];pairs={};bindings=[]
for stem,judgment in specs.items():
 p=(P/(stem+'.json')).as_posix();v=load(p);a=artifacts[p]
 for f in v['sources']:
  actual=f['path']
  if sha(actual)!=f['sha256']:
   actual=(P/'campaign3-history-embodied-freeze-rev1/historical'/f['path']).as_posix()
  assert sha(actual)==f['sha256'];bindings.append(dict(**f,resolvedPath=actual))
 for q in [p,a['archive']]:
  assert sha(q)==entries[q]['sha256']==a['sha256'];sources[q]=v
  if q!=p:pairs[q]=p
  roles.append(dict(path=q,sha256=sha(q),role='WHOLE SYMBOLIC GA SOURCE / ARCHIVE',judgment=judgment,acceptanceChain=[ref(O/'canonical-check.json'),ref(O/'comparison-correction.json'),ref('docs/formal/GENERAL_ATTENTION_REGISTRY_MEMBER_SHAPE_ACCEPTANCE.md'),ref('docs/formal/GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE.json')]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/invariants','/open','/limits','/pending','/reused','/allocationPolicy','/validationOrder')) or ptr.endswith(('/scope','/limit','/branch','/gate','/missingLeaf','/meaning','/condition')) or '/sourceObligations/'in ptr
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SYMBOLIC AUTHORITY / LIMIT' if narrative else 'TYPED SYMBOLIC BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='EIGHT SYMBOLIC GA SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['26 topology/output static faults freshly reject;12 member-shape controls remain historical referenced evidence.','Template cardinality is not runtime work/admission/public qualification.','Two stale comparison paths/five overdeclared unchanged axes preserved;no frozen-byte correction.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('SYMBOLIC AUTHORITY') for r in rows),originalBackingOccurrences=sum(r['role']=='TYPED SYMBOLIC BACKING' for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
