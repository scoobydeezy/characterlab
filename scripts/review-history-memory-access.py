"""Whole-source review of affect access, sensory presentation and routine reconstruction."""
from pathlib import Path
import json,hashlib,copy
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-memory-access-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(name,judgment):specs[(P/name).as_posix()]=judgment
specs['docs/formal/AFFECT_RETRIEVAL_COMPONENT_CONTRACT.md']='Accepted affect-retrieval-component0.1: prior completed SplitExposure output changes associative gain only. LastObservation report belief and independent admitted factors; memory/history, encoding, cue and truth distinct. Four candidate receiving laws, controlled graph, no native or general mood-congruence law.'
specs['docs/formal/VIVID_RECOLLECTION_COMPONENT_CONTRACT.md']='Accepted vivid-recollection-component0.1: current published facet values and admitted clarity, acquired from empty state. Non-sensory observed identity preserves nonempty evidence basis; clear-count diagnostic is not confidence, truth or subjective consciousness. Fragment after current recall; preserve KeepRich and other readout laws.'
specs['docs/formal/RECOLLECTION_PUBLIC_CONTRACT.md']='Accepted recollection-public0.1: actual recall40/source110/observe120/consolidate140. Retained episode fragment and category summary separate, one observation credit each. Reconstruction explicitly tagged; no hidden truth except named unsafe TruthRestore comparator, no inferred re-encoding except named unsafe ReencodeGuess. Controlled query address, not general recognition.'
add('CAMPAIGN3_AFFECT_RETRIEVAL_QUALIFICATION.md','VER-C3-AFFECT-RETRIEVAL-001:56 runs280 component prefixes, memory/history/cue held fixed before winner reversal. Same memory afterward, history changes only through publication. Full-control contrast separates candidate receivers, not irreducibility of affect coordinates. Unknown distinct from known zero; current context/report too late for prior-affect recall. Historical24/328 tests/build and prior54/57 wrapper scope; no native admission.')
add('CAMPAIGN3_VIVID_RECOLLECTION_QUALIFICATION.md','VER-C3-VIVID-001:44 runs308 component prefixes. Rich/weak equal recent values, count, rank, selected identity and occurrence but different clarity/presentation. Clear false recollection, actual lost facets and KeepRich retained. Unrelated cue may select through baseline; absent cue is no-publication control. Historical17/328 tests/build; no subjective or native claim.')
add('CAMPAIGN3_RECOLLECTION_QUALIFICATION.md','VER-C3-RECOLLECT-001:5 models20 runs159 native prefixes. Category regularity can reconstruct a lost detail while explicit provenance differs from retained content. No category evidence means no episode, unknown detail differs from known false; no stereotype creates unseen episode. Current recall before same-instant observation/consolidation. Unsafe truth restore and guess reencoding retained. REV1 behavior passed despite build failure; type-only REV2 correction preserves exact rows.')
for stem,label,tests,rev in [('AFFECT_RETRIEVAL','affect access',24,1),('VIVID','sensory presentation',17,2)]:
 add(stem+'_PLAN_REV1.json',f'Frozen {label} source graph and canonical model/run/experiment/comparison identities reconstructed exactly by fresh audit. Original inputs and seed policy preserved; no re-freeze.')
 add(stem+'_RESULT_REV1.json',f'Whole original {label} result freshly reproduced, including every original-prefix save hash, safe view and one actual successor each. Not full tails or native Save132.')
 add(stem+'_CLOSURE_REV1.json',f'Original read-only {label} closure checker passes with exact source/result bindings and historical tests/build. No fresh tests/build claim.')
 add(stem+f'_TESTS_REV{rev}.json',f'Historical{tests} passed assertion leaves, strict ingress/forged saves, every-law restore, publication rollback and overlapping-step rejection. Reads expose prior committed snapshot; no claim of public native in-flight read rejection.')
 add(stem+'_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertion leaves, authenticated here but not freshly rerun.')
 add(stem+'_BUILD_REV1.json','Historical build PASS/exit0 and bound artifacts; evidence is recorded observed process completion, not a preserved raw build log or a fresh build. Earlier failed behavior/preflight remains separate.')
add('VIVID_TESTS_REV1.json','Preserved15 pass2 fail first cohort: empty sensory views violated nonempty evidence basis; unrelated cue unexpectedly selected sole episode through baseline. Corrected using observed non-sensory identity and preserving unrelated selection, not invented relevance filter.')
add('vivid-development-rev1/PRESERVATION.json','Five immutable artifacts preserve first contract, source, fixture, test and duplicate15-pass2-fail receipt. First build success did not make behavioral cohort pass.')
add('vivid-development-rev1/VIVID_RECOLLECTION_COMPONENT_CONTRACT.md','Superseded first contract: empty sensory evidence and presumed unrelated-cue no-selection not accepted final behavior. Exact pre-correction identity retained; current non-sensory observed identity and baseline selection explicitly replace those assumptions.')
add('vivid-development-rev1/VIVID_TESTS_REV1.json','Exact duplicate first15-pass2-fail receipt; preserved failure, not additional tests or independent evidence.')
add('RECOLLECTION_BUILD_FAILURE_REV1.json','Preserved successful20-run159-prefix behavior followed by TS4104 mutable/readonly annotations at recollectionMath lines8/11. Two original source archives authenticate old plan. Type annotations corrected without changing contract/model/behavior; never silently replace REV1.')
for rev in [1,2]:
 add(f'RECOLLECTION_PUBLIC_PLAN_REV{rev}.json',f'Frozen REV{rev} original model/run/input identities. Old source hashes resolve through preserved archives; REV2 whole plan identities freshly reconstruct. Same model/input/experiment/comparison despite corrected harness/source artifact commitments.')
 add(f'RECOLLECTION_PUBLIC_RESULT_REV{rev}.json',f'Native REV{rev}20 results159 prefixes139 advancing20 terminal. Entire results array equals other revision; REV2 freshly replayed. Two revisions are not40 distinct cases.')
 add(f'RECOLLECTION_TESTS_REV{rev}.json','Historical15 passed assertions, including typed public ingress, restore, phase/fault and epistemic/reconstruction controls. REV1 passing behavior did not waive subsequent build rejection; no fresh test suite claim.')
add('RECOLLECTION_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertions, not freshly rerun.')
add('RECOLLECTION_BUILD_REV2.json','Historical PASS/exit0 boundary/typescript/Vite receipt, not raw log or fresh build. Source-only readonly correction compared explicitly.')
add('RECOLLECTION_CLOSURE_REV1.json','Read-only original closure verifies old and new source commitments via archives, exact result-row equality,5 model files,15 allocated records1040..1054 namespace1166,15/328 historical tests/build. No general recognition or downstream behavior.')
# Previously assigned preflight preservation stays backing; never overwrite its role.
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev116/index.json')['roleAssignments']}
assert not set(specs)&set(prior)
preserved=[]
for name in ['affect-retrieval-development-rev1/PRESERVATION.json','vivid-development-rev1/PRESERVATION.json','RECOLLECTION_BUILD_FAILURE_REV1.json']:
 v=load(P/name)
 for a in v['artifacts']:
  path=a.get('archived',a['path']);assert ref(path)['sha256']==a['sha256'];preserved.append(ref(path))
old=(P/'recollection-rev1/recollectionMath.ts').read_text();new=Path('src/campaign3/recollectionMath.ts').read_text()
assert old.replace('category:CanonicalValue[]','category:readonly CanonicalValue[]').replace('detail:CanonicalValue[]','detail:readonly CanonicalValue[]').replace('episodeRefs:CanonicalValue[]','episodeRefs:readonly CanonicalValue[]').replace('summaryRefs:CanonicalValue[]','summaryRefs:readonly CanonicalValue[]')==new
for stem,rev,n in [('AFFECT_RETRIEVAL',1,24),('VIVID',2,17),('RECOLLECTION',1,15),('RECOLLECTION',2,15)]:
 t=load(P/f'{stem}_TESTS_REV{rev}.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert t['success'] and len(leaves)==t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for stem in ['AFFECT_RETRIEVAL','VIVID','RECOLLECTION']:
 t=load(P/f'{stem}_REFERENCE_TESTS_REV1.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert t['success'] and t['numPassedTests']==len(leaves)==328 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
 b=load(P/f'{stem}_BUILD_REV{2 if stem=="RECOLLECTION" else 1}.json');assert b['status']=='PASS' and b['exitCode']==0
t=load(P/'VIVID_TESTS_REV1.json');assert not t['success'] and (t['numPassedTests'],t['numFailedTests'])==(15,2)
assert t==load(P/'vivid-development-rev1/VIVID_TESTS_REV1.json')
assert load(P/'RECOLLECTION_PUBLIC_RESULT_REV1.json')['results']==load(P/'RECOLLECTION_PUBLIC_RESULT_REV2.json')['results']
for name,cases,prefixes in [('affect-retrieval',56,280),('vivid-recollection',44,308),('recollection',20,159)]:
 r=load(O/(name+'-replay.json'));assert r['status']=='PASS' and (r['cases'],r['prefixes'])==(cases,prefixes)
 script='scripts/replay-history-'+('recollection-public' if name=='recollection' else name)+'.mjs';assert ref(script)['sha256']==r['checkerSha256']
assert load(O/'recollection-identities.json')['status']==load(O/'closures.json')['status']=='PASS'
# Independent exact rational readout, timing, acquired content and presentation history.
fmt=lambda x:f'{x.numerator}/{x.denominator}'
arows=vrows=0
plan=load(P/'AFFECT_RETRIEVAL_PLAN_REV1.json');result=load(P/'AFFECT_RETRIEVAL_RESULT_REV1.json')
for case,res in zip(plan['runs'],result['results']):
 belief=None;affect=None;memory=[];history=[];law=case['law']
 for x,row in zip(case['inputs'],res['safe']['rows']):
  at=x['at'];gain=F(1)
  if affect and affect['status']=='Known' and law!='NoFeedback':gain+=F(affect['exposure'] if law=='ExposureGain' else affect['uncontrolled'])/(2 if law=='HalfGain' else 1)
  assert (row['priorAffect'],row['beliefBefore'],row['gain'],row['memoryBefore'],row['historyBefore'])==(affect,belief,fmt(gain),memory,history)
  scores=[]
  if at>1 and x['cue']:
   for e,h in zip(memory,history):
    base=sum((F(1,at-t+1) for t in h['times']),F(0));pull=F(1) if (at,e['id']) in [(2,1),(3,2)] else F(1,8) if at==4 and e['id']==1 and x['graph'] else F(0)
    scores.append(dict(id=e['id'],base=fmt(base),pull=fmt(pull),score=fmt(base+gain*pull)))
  assert scores==row['scores']
  winner=max(scores,key=lambda s:(F(s['score']),-s['id']))['id'] if scores else None
  assert row['selected']==winner and row['detail']==(memory[winner-1]['display'] if winner else None)
  history=copy.deepcopy(history)
  if winner:history[winner-1]['times'].append(at)
  if at>=3:
   known=belief is not None and x['contextVisible'] and all(x[k] is not None for k in ['severity','vulnerability','control'])
   e=F(belief,1000)*F(x['severity'],1000)*(1+F(x['vulnerability'],1000))/2 if known else None
   affect=dict(at=at,status='Known' if known else 'Unavailable',exposure=fmt(e) if known else None,uncontrolled=fmt(e*(1-F(x['control'],1000))) if known else None)
  if x['reportVisible'] and x['report'] is not None:belief=x['report']
  assert row['affectAfter']==affect and row['beliefAfter']==belief
  if at<=2:memory=memory+[dict(id=at,at=at,display=x['display'])];history.append(dict(id=at,times=[]))
  arows+=1
 assert res['safe']==dict(prefix=4,belief=belief,affect=affect,memory=memory,history=history,rows=res['safe']['rows'])
plan=load(P/'VIVID_PLAN_REV1.json');result=load(P/'VIVID_RESULT_REV1.json')
for case,res in zip(plan['runs'],result['results']):
 imprint=None;history=[];law=case['law']
 for x,row in zip(case['inputs'],res['safe']['rows']):
  at=x['at'];selected=imprint is not None and x['cue']!='absent';facets=copy.deepcopy(imprint['facets']) if selected else []
  clear=sum(f['clarity']==2 for f in facets)
  band='Unavailable' if not selected else 'Vivid' if law=='AccessOnly' or (len(facets)>=2 if law=='DetailCount' else clear>=2) else 'Weak' if len(facets)>=2 else 'Fragmentary' if facets else 'Empty'
  assert (row['selected'],row['facets'],row['band'],row['historyBefore'],row['acquisition'],row['occurrence'])==(selected,facets,band,history,1 if selected else None,at*10+1 if selected else None)
  rank=json.loads(row['rank']);assert len(rank)==int(selected)
  if selected:
   base=sum((F(1,at-t+1) for t in history),F(0));pull=F(int(x['cue']=='target'))
   q=lambda k:F(int(rank[0][k]['numerator']),int(rank[0][k]['denominator']))
   assert (q('base'),q('pull'),q('score'))==(base,pull,base+pull);history=history+[at]
  if at==1 and x['visible']:imprint=dict(at=1,facets=[dict(kind=k,value=v,clarity=c) for k,v,c in zip(['visual','auditory','spatial'],x['display'],x['clarity']) if c>0])
  if imprint and at-imprint['at']>=3 and law!='KeepRich':imprint=dict(at=1,facets=[f for f in imprint['facets'] if f['kind']=='visual'])
  vrows+=1
 assert res['safe']['imprint']==imprint and res['safe']['presentations']==history
assert (arows,vrows)==(224,264)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['affect-retrieval-replay.json','vivid-recollection-replay.json','recollection-replay.json','recollection-identities.json','closures.json']]+[ref('scripts/'+n+'.mjs') for n in ['replay-history-affect-retrieval','replay-history-vivid-recollection','replay-history-recollection-public','check-history-recollection-identities','check-history-memory-access-closures']]+[ref('src/campaign3/'+n+'.ts') for n in ['affectRetrieval','vividRecollection','recollectionMath','recollectionRuntime']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='MEMORY ACCESS / PRESENTATION / RECONSTRUCTION AUTHORITY AND EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/scope','/finding','/disposition','/errors','/evidence','/correction'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [2,3,4,5,6,7,10,11,17,19,20,21]]
limits=['Fresh100 component cases588 prefixes and20 native cases159 prefixes; one successor each, not full tails. Historical tests/build not rerun.','Gain scale, clarity readout, age threshold and strict category majority are candidates, not universal laws. No new law selection or retired competitor.','Fixed graph/reports/query identities and no RNG draws; no natural recognition, calibrated confidence, subjective experience or physical action claim.','Lost memory cannot be repaired from research rows or truth; reconstruction and reencoded guess are not retained evidence.','Affect retrieval and vividness remain components; native routine reconstruction does not qualify their public admission.','Preserve preflight path/overlap failure, vivid15-pass2-fail cohort and readonly build failure after passing native behavior; no silent old source rewrite.','Build receipts are observed process reports, not raw logs. Old wrapper54/57 and allocation1054 or1508 counters are historical; current55/58 and1519/0 unchanged.']
v=dict(status='MEMORY ACCESS SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,priorAssignedBacking=[ref(P/'affect-retrieval-development-rev1/PRESERVATION.json')],obligations=obs,independentArithmeticRows=arows+vrows,limits=limits)
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
