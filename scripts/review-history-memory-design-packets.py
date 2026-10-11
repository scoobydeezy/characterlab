"""Bind historical memory packets and independently check their bounded arithmetic/deltas."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-design-packets-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev195/index.json';ix=load(ip)
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if p.endswith('.json') and Path(p).name.startswith(('ATTENTION_MEMORY_','ATTENTION_ACQUISITION_'))]
assert len(paths)==21
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def nodes(v,p=''):
 yield p,v
 if isinstance(v,dict):
  for k,x in v.items():yield from nodes(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from nodes(x,p+'/'+str(i))
bindings=[];faults=[];leaves=[];writers={}
for p in paths:
 for q,x in nodes(load(p)):
  if isinstance(x,str):leaves.append(dict(source=p,pointer=q,text=x))
  if isinstance(x,dict) and 'path' in x and 'sha256' in x:
   actual=x['path'] if ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
   assert actual and ref(actual)['sha256']==x['sha256'],(p,q,x)
   bindings.append(dict(owner=p,pointer=q,original=x,actual=ref(actual)))
   if x['path'].startswith('scripts/review-'):writers[x['path']]=actual
  if q.endswith('/faults') and isinstance(x,list):
   for f in x:assert f['detected'];faults.append(dict(owner=p,pointer=q,**f))
assert len(bindings)==78
for original,actual in writers.items():
 code=Path(actual).read_text(encoding='utf-8-sig')
 assert 'structuredClone(' in code and ('assert.throws(' in code or "assert(reason," in code),original
def diff(a,b,p=''):
 if type(a)!=type(b):return [(p,a,b)]
 if isinstance(a,dict):
  out=[]
  for k in sorted(a.keys()|b.keys()):
   if k not in a or k not in b:out.append((p+'/'+k,a.get(k),b.get(k)))
   else:out.extend(diff(a[k],b[k],p+'/'+k))
  return out
 if isinstance(a,list):
  out=[]
  if len(a)!=len(b):out.append((p+'/length',len(a),len(b)))
  for i,(x,y) in enumerate(zip(a,b)):out.extend(diff(x,y,p+'/'+str(i)))
  return out
 return [] if a==b else [(p,a,b)]
wrapper1=load(P/'ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json');wrapper2=load(P/'ATTENTION_MEMORY_WRAPPER_INVENTORY_REV2.json')
role1=load(P/'ATTENTION_MEMORY_IDENTITY_ROLES_REV1.json');role2=load(P/'ATTENTION_MEMORY_IDENTITY_ROLES_REV2.json')
wd=diff(wrapper1['records'],wrapper2['records']);rd=diff(role1['fields'],role2['fields'])
assert len(wd)==3 and all(a=='GovernedContentDefinitionId' and b=='DefinitionId' for _,a,b in wd)
assert len(rd)==6 and all((a,b) in [('GovernedContentDefinitionId','DefinitionId'),('existing GovernedContentDefinitionId role unchanged','existing DefinitionId role unchanged')] for _,a,b in rd)
calibrations=[]
for a,b in zip(wrapper1['records'],wrapper2['records']):
 for f,g in zip(a['fields'],b['fields']):
  if f!=g:assert f['name']=='Calibration';calibrations.append(a['name']+'.'+f['name'])
assert set(calibrations)=={'EncodingEvaluation.Calibration','RetainedEncoding.Calibration','SpatialPreparation.Calibration'}
for a,b in [(wrapper1,wrapper2),(role1,role2)]:
 assert all(a[k]==b[k] for k in a.keys()&b.keys() if k not in ['records','fields','status','version','supersedesDraftFields'])
assert wrapper2['supersedesDraftFields'][:len(wrapper1['supersedesDraftFields'])]==wrapper1['supersedesDraftFields']
cohort=load(P/'ATTENTION_MEMORY_COHORT_RECIPE_REV1.json');models={x['name']:x['parameters'] for x in cohort['models']}
assert len(models)==32 and len(cohort['comparisons'])==31 and len(cohort['bindings'])==22
comparisons=[]
for c in cohort['comparisons']:
 actual=[q.strip('/').replace('/','.') for q,_,_ in diff(models[c['control']],models[c['candidate']])]
 assert set(actual)<=set(c['changed']) and actual,c
 comparisons.append(dict(**c,actualChanged=actual,declaredButUnchanged=sorted(set(c['changed'])-set(actual))))
 if c['candidate'] in ['feedback-encoding','feedback-retrieval','feedback-both']:
  assert models[c['control']]['source']==models[c['candidate']]['source'] and models[c['control']]['schedule']==models[c['candidate']]['schedule']
out=load(P/'ATTENTION_MEMORY_OUTPUT_INVENTORY_REV1.json');receipt=load(P/'ATTENTION_MEMORY_OUTPUT_REVIEW_REV1.json')
assert len(out['stages'])==22
cases=[];maxima={}
for purpose in ['formation','cue']:
 for n in range(4):
  for q in range(n+1):
   for nt in range(n+1):
    for retains in range(2 if purpose=='formation' and q>0 else 1):
     for w in range(3 if purpose=='cue' and n>0 else 1):
      operands=dict(n=n,q=q,newTracks=nt,positive=int(n>0),retains=retains,w=w)
      conditions=dict(always=True,positive=n>0,positiveFormation=purpose=='formation' and n>0,emptyFormation=purpose=='formation' and n==0,formation=purpose=='formation',retainedFormation=purpose=='formation' and retains==1,cue=purpose=='cue',winningCue=purpose=='cue' and w>0)
      def value(v):return v if isinstance(v,int) else operands[v]
      selected=[s for s in out['stages'] if conditions[s['when']]]
      totals=dict(events=len(selected),outputs=sum(value(x) for s in selected for x in s['outputs'].values()),runtimeSlots=sum(value(x) for s in selected for x in s['slots'].values()))
      assert sum(value(s['fileCounters'].get('ObserverTrackSequence',0)) for s in selected)==nt
      assert sum(value(s['fileCounters'].get('ObserverEventSequence',0)) for s in selected)==int(n>0)
      expected=(dict(events=13+3*retains,outputs=10+2*n+q+retains,runtimeSlots=8+2*n+q) if n else dict(events=7,outputs=7,runtimeSlots=6)) if purpose=='formation' else (dict(events=13+int(w>0),outputs=9+2*n+q+w,runtimeSlots=7+2*n+q+w) if n else dict(events=7,outputs=6,runtimeSlots=5))
      assert totals==expected
      key=('positive' if n else 'empty')+purpose.title();prior=maxima.setdefault(key,dict(events=0,outputs=0,runtimeSlots=0))
      for k,x in totals.items():prior[k]=max(prior[k],x)
      cases.append(dict(purpose=purpose,operands=operands,**totals))
assert len(cases)==receipt['cases']==138 and maxima==receipt['maxima']==out['maxima']
barrier=load(P/'ATTENTION_MEMORY_BARRIER_WORK_REVIEW_REV1.json');counts=barrier['counts']
for k in ['events','outputs','slots']:
 total=sum(counts[n][k] for n in ['source0','source1','deadline'])+4*counts['formation'][k]+4*counts['cue'][k]
 assert total==barrier['totals'][k]==barrier['expected'][k]
bt=load(P/'ATTENTION_MEMORY_BARRIER_TESTS_REV1.json');assert bt['success'] and (bt['numTotalTests'],bt['numPassedTests'],bt['numFailedTests'])==(4,4,0)
assert all(a['status']=='passed' for t in bt['testResults'] for a in t['assertionResults'])
notes={}
for p in paths:
 n=Path(p).name
 note='Historical symbolic packet/static receipt. All string leaves, exact source identities and original occurrence IDs retained. No canonical allocation, runtime qualification, final law or corpus promotion follows from structural checks. '
 if 'IDENTITY_PROPAGATION' in n:note+='Four planned edits preserve selection provenance but move durable target references to acquisition; conditional successful commit, one-per-source profile only, no extra identity/measurement migration. Later carrier owns header once, not duplicate nested header. Ten plan corruptions do not prove producer/rollback behavior.'
 elif 'BARRIER_TESTS' in n:note='Four historical actual-scheduler fixture assertions pass chain rejection/whole rollback, common B0/shared parent, reversed sibling order and post-evaluation failure. Integer leaves/trusted fixture adapter and test allocations, not production owner/PRJ/source qualification. No fresh test execution.'
 elif 'BARRIER_WORK' in n:note+='Corrected terminal siblings replace chained140 children. Independently recomputed139 events172 outputs152 slots under four formation/four cue draft, including future reads/padding/deadline. Six static corruptions separate from four scheduler tests; final integrated profile differs.'
 elif 'COHORT' in n:note+='32 recipes/31 declared comparisons/22 stage bindings, no ModelIdentity/RunIdentity or executed specimens. Actual parameter differences lie within declared axes; unchanged declared values retained. Feedback-only pairs preserve complete source/schedule. Floor-null Independent/RetiredFlat controls not sensitivity evidence. Later public scene excludes missing glyph/position; source anchor and activation corrected separately. Need/surprise disabled.'
 elif 'IDENTITY_ROLES' in n:note+='139 fields/four map-key roles; scalar/composite/collection/domain distinctions, scheduler structural address not new occurrence. REV2 corrects exactly three calibration role families/requirements; removes prior receipt metadata rather than transferring old tests as fresh. Character-content domain and actual source authentication remain separate.'
 elif 'OUTPUT' in n:note+='138 symbolic branch combinations independently recomputed with exact maxima16/20/17,7/7/6,14/20/18,7/6/5. File counters differ from shared slots; copied selections/reservations not duplicate production; zero-winner stage executes.10505 check counter is repeated static assertions, not test cases. Old counts predate acquisition identity/successor model.'
 elif 'PROFILE' in n:note+='Eight definitions/41 fields,16 static configurations and ten malformed specimens. Denial suppresses channels, feature Unknown not zero; Need/surprise explicitly disabled. Encoding spatial modulation requires compatible target, retrieval arm separate. No source execution or canonical rational codec from config review; draft0/1/2..9/20 scope not final chronology.'
 elif 'REGISTRATION' in n:note+='Eight proposed records22 rows/two explicit unions. Exact alternative direct parent and additional completed delivery distinct; required projection before reads, own write authority and terminal barrier. Output freshness/allocation separate; no configurable omission of whole-choice descendants. Eight static corruptions do not qualify runtime admission.'
 elif 'ADMISSION' in n:note+='22 rows/five exclusive batches; authenticated exact expected-event/parent/target before projection then B0 reads. Reject mixed/incomplete/duplicate members, validate separate owned patches and combined state. Copied subject/time/role alone insufficient. Ten packet corruptions not public admission mutants.'
 elif 'STATE_SUCCESSOR' in n:note+='Corrects episode/graph/presentation coupled presence: graph-only not target, episode-only still target, absent presentations no history contribution. Payload-free governance not sample resolver. High-water counterexample {2}/{1,2} retained; bounded admitted-source history later accepted. Five static faults not persistence proof; names/empty timestamp/public bounds provisional.'
 elif 'STATE_DECLARATIONS' in n:note+='Four roots/accessors plus four reused perception accessors, character versus observer keys and immutable PRJ. Old all-three-presence invariant superseded by REV2 independent reads; its nine static checks retain historical meaning, not current rule. No authored learned state/generic iterator or public codec.'
 elif 'STAGE' in n:note+='22-stage original chained140 draft is superseded by sibling barrier, not byte-identical causal graph.16/14 local counts exclude upstream concern. Read-only ranking/recollection, available-cue memory gate and distinct sole writers; exact source/roles/output/restore still open. Ten static graph/authority faults not executed semantic transitions.'
 elif 'SYMBOLIC' in n:note+='26 domain records84 fields, positive-only exact child closure excludes full selected/evaluation/feedback reachability. Zero versus unavailable remains evaluation distinction, neither stored. Selection-addressed append-only max4/12/5/graph-union assumptions superseded by acquisition/survivor authority. Nine static reference/reachability faults not codec/math/owner proof.'
 elif 'WRAPPER' in n:note+='48 records139 fields22 inputs correct actual event detection and spatial witness attachment. Exact winner content only, no ledger or nested forecast in memory. REV2 changes three calibration types GovernedContentDefinitionId->DefinitionId and adds correction descriptions; no new identity/translation or rewrite of old receipt. Thirteen old static faults do not prove corrected public compiler.'
 else:raise AssertionError(n)
 notes[p]=note
md=P/'ATTENTION_CALIBRATION_REFERENCE_CORRECTION.md'
notes[md.as_posix()]='Correct-forward draft distinction: EncodingEvaluation.Calibration,RetainedEncoding.Calibration,SpatialPreparation.Calibration reference actual registry DefinitionId, not GovernedContentDefinitionId. Exactly three wrapper types and paired scalar role family/requirements corrected; no alias/translation/new identity or allocated record rewrite. Definition namespace alone does not prove purpose/schema/membership in executing model. Original reviewed packets remain historical.'
chain=[ref(P/'campaign3-history-memory-design-authority-rev1/review.json'),ref(P/'campaign3-history-concern-source-designs-rev1/review.json'),ref(P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),ref(md)]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL MEMORY SYMBOLIC PACKET/RECEIPT WITH EXACT SUCCESSOR SCOPE',judgment=n,acceptanceChain=chain))
rows=[];counts=collections.Counter()
def category(p):
 top=p.split('/')[1]
 return 'NARRATIVE' if top in ['status','pending','unresolved','limits','invariants','retention','accounting','identityRules','controls','constraints','boundaries','reads','lifecycle','replacements','preflight','batchRules','prohibited','bindingRules','outputRules','supersedesDraftFields'] or any(k in p for k in ['/reason','/failureMessages','/fullName','/title','/frontierCounterexample']) else 'BACKING'
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  c='NARRATIVE' if u['source'].endswith('.md') else category(u['location']['pointer']);counts[c]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=c,judgment=notes[u['source']]))
assert len(rows)==len({x['occurrenceId'] for x in rows})
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='Every JSON string leaf preserved, including short type/role/enum/path/hash labels; original thresholded prose occurrences classified separately.'))
save('verification.json',dict(calibrationFields=calibrations,wrapperFieldDelta=wd,roleFieldDelta=rd,comparisons=comparisons,branchCases=cases,maxima=maxima,wholeRunDraft=barrier['totals'],scope='Fresh read-only arithmetic and exact JSON delta verification; no old writer or runtime execution.'))
save('review.json',dict(status='22 MEMORY PACKET/CORRECTION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,recordedStaticFaults=faults,historicalSchedulerTests=ref(P/'ATTENTION_MEMORY_BARRIER_TESTS_REV1.json'),inspectionWriters=[dict(original=k,actual=ref(v)) for k,v in sorted(writers.items())],schema=ref(O/'schema.json'),verification=ref(O/'verification.json'),preservedArtifacts=[],limits=['78 exact reference occurrences, not78 unique artifacts. All resolve; no new source gap.','32 recipes are not executed models;138 arithmetic cases are not runtime trajectories. Static fault counts and four historical scheduler assertions remain separate.','No runtime,test,build,model,allocation,verdict,corpus or obligation status change. Existing source gaps and independent adequacy remain open.'],obligations=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED PACKET RECONCILIATION',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),recordedStaticFaults=len(faults),historicalSchedulerTests=4,branchCases=138,recipes=32,comparisons=31,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
