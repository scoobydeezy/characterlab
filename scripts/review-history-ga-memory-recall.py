from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-memory-recall-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Bounded component and symbolic evidence only. Current inputs/tests are separately hashed;exact old integration versions are excluded when missing. No public source/PRJ/read domain,committed owner,Save132 or complete-prefix qualification follows.'
ordinary='One complete subject-owned batch reads originalB0 acquisitions strictly before now. Independently validate use/significance against B0;duplicates within one use result reject,separate real results remain binary. Fresh targets cannot gain same-instant credit. Retention sees old metadata plus uncredited fresh content,then current validated credit overlays only actual survivors. Credit cannot rescue same-instant loss or resurrect content;committed next-instant credit participates normally. Preserve original bytes/time/identity. Protocol loss comes from actual survivor result. Snapshot inputs and one-use session result;no mutation authority supplied.'
controls='Default significance-first and named shared/use-only/age-only preparations differ only in fixed retention kernel,not caller callback. SameB0/fresh/protocol validation and independent per-kind caps. Ignored use/significance remains on survivors,so comparison does not secretly erase future state. Old significant1,newer used2,fresh unprotected3 with one slot yields1 for significance,2 shared/use,3 age. All preserve full metadata at full capacity and reject current-credit rescue. Actual complete fresh loss still records success.'
formation='Prior live protocol successes biject memory with original kind/time;fresh memory bijects new formations. Validate prior before incoming,replay and occurrence uniqueness. Fresh use/significance injection rejects;initialize false/empty directions. Sole significance owner preserves prior metadata and runs independent per-kind retention;recency-only owner remains control. Immediate complete fresh loss still consumes source/acquisition identity. Private one-use result derives actual loss;foreign/copied/repeated/closed rejects. Pure evaluation is provisional,not committed state or public evidence authentication.'
recollection='Actual body/event rank preparation consumes trusted subject projection;absent cue invokes no state-reader callback. Available cue reads only admitted partition and snapshots actual winners. Publication consumes private capability once and allocates distinct recollection per winner,none for zero winners;preserves original acquisition/time and surviving content,including co-acquired noncued body groups. Mutable returned evaluation cannot alter publication. Failed allocation consumes capability;outer scheduler owns allocator rollback. Recollection is not new acquisition,use,significance,graph or presentation write. Exact event publication can be consumed once for narrow observer/subject/time/recollection-acquisition pairs;copied/changed/body publication cannot forge event handoff. Public provenance remains upstream.'
presentation='Event-only independently owned history seeds once at actual event formation;body never seeds. Prior history bijects event acquisitions,starts at original time and stays strictly before now. Actual distinct presentation occurrences may share instant;duplicate occurrence in batch rejects. Body,fresh,unknown targets and sparse/getter inputs reject before loss.32-acquisition/32-instants bounds reject even if affected acquisition is lost;no truncation. After validation,actual total memory loss removes history,partial loss preserves it;graph state unaffected. Recall/cue/rank/baseline does not automatically present or alter current ranking/use/significance. Cross-instant occurrence replay and source binding remain upstream.'
carrier='REV3 replaces old selection-addressed insert-only encoding/two-winner wrapper. Recalled evidence projects only current surviving positive event/body content;no initial-formation archive or protection/significance metadata. Event winner has score,body has none:do not invent numeric strength/graph/physical estimate. Body alpha cue recalls all surviving groups in winning acquisition,including beta;group-local comparator remains deferred. One new recollection per winner,acquisition unchanged;actual PRJ subject checked before reads. Max32 per-kind recall capped by total32 retained,independent budgets/no borrowing,not guaranteed32 grants. Four-trial witness needs8event+8body. Event-only history is separate from use/significance and graph;direct cue does not require graph membership. Only completed actual recollections feed downstream consumer,not full diagnostics or caller lists.'
observed='Four actual visual opportunities form A,B,A+B from observed roles/positions with zero peripheral pool;fourth actualA cue forms no selection/acquisition. Actual homogeneous base3/10 yields dense strengths3/13 and27/127;gain5,zero decay,scale1000 yield245 off-diagonal lattice mass. Sparse formations leave no graph nodes,third gives two nodes/two directed edges without rewriting episodes. With identical retained memory/protocol/presentations,joint acquisition ranks first;learned spread recallsB@2 second while disabled/direct recallsA@1. Complete graph loss restores direct result without deleting memory;absent current cue blocks recall despite graph/episodes;hidden world rename leaves outputs equal. Gain3 nondiscriminating,gain4 also discriminates,so no universal gain or rank law. Initial base1 expectation failed graph and rank3/5;corrected actual calibration6/6 without arithmetic/validator changes. Current seventh control explicitly presents only actual winners after ranking.'
focal='Remove source-loop target handoff. Reconstruct complete trial groups from admitted surviving views;exactly one After experience matches carried actual focal consequence,then fixed first-profile end-position child is bound before contrastive attribution. No final-row/newest/global/ordinal/source-array target. Start child may earn actual use but no sibling outcome credit;both-target model not implicit. Consequence identity does not assert causality/success/current concern/survival. Missing complete recalled group means unavailable/no target,not hidden schedule recovery. Forged public target is rejection;ordinary forgetting is not corrupt input. Earlier supplied-target loss fixture rejection does not prescribe public forgetting behavior. Either admitted stroke can be designated with same recalled evidence;public output/carry authentication remains separate.'
notes={
'ORDINARY_MEMORY_BATCH_COMPONENT.md':ordinary,
'ORDINARY_MEMORY_BATCH_CONTROLS_COMPONENT.md':ordinary+' '+controls,
'SIGNIFICANT_FORMATION_SETTLEMENT_COMPONENT.md':formation,
'RECOLLECTION_PRODUCTION_COMPONENT.md':recollection,
'EVENT_PRESENTATION_SETTLEMENT_COMPONENT.md':presentation,
'GA_RECOLLECTION_CARRIER_REV3.md':carrier+' '+presentation,
'GA_RECOLLECTION_CARRIER_REV3.json':carrier,
'GA_RECOLLECTION_CARRIER_REVIEW_REV3.json':carrier+' Ten original field/reachability faults reproduce exactly;shape checks do not prove actual winner/header equality,kind binding or authenticated producer.',
'GA_OBSERVED_ASSOCIATION_RECALL_REV1.md':observed,
'GA_RETAINED_FOCAL_BINDING_REV1.md':focal,
'GA_RECOLLECTION_PRODUCTION_REVIEW_REV1.json':recollection+' Eight original source substitutions detect identity reuse,replay,mutable evaluation,absent-body/event reads,repeated presentation,body presentation and observer-as-subject. Original publication source/test bytes match;two older integration-test references are unavailable,so entire old cohort is not reproduced.',
'OBSERVED_ASSOCIATION_RECALL_REVIEW_REV1.json':observed+' Four historical mutations disabling learning,forging cue from old file,ignoring graph loss and requiring graph membership for direct cue remain report-only. Old integration test1e8483fcece8c2bb9a4712ba30e61b474e72d15f4904712d1b65c59f1a6e6bc2 unavailable;current behavioral suite is independent evidence,not that old fault run.'
}
replay=load(O/'replay.json');assert len(replay['rows'])==8 and len(replay['sourcePaths'])==26
for row in replay['symbolic']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
for row in replay['rows']:
 for k in ['file','test','report']:assert ref(row[k]['path'])==row[k]
for f in replay['inputs']+replay['reused']+[replay['tests'],replay['originalReviewer']]:assert ref(f['path'])==f
recovery=load(O/'source-recovery.json');resolved={x['original']['sha256']:x for x in recovery['rows']};assert sum(x['status']=='UNAVAILABLE' for x in recovery['rows'])==3
names=lambda v:{a['fullName'] for t in v['testResults'] for a in t['assertionResults'] if a['status']=='passed'}
fresh=names(load(replay['tests']['path']));prior=set().union(*(names(load(f['path'])) for f in replay['reused']));historical=[];failures=[]
for p in replay['sourcePaths']:
 if not p.endswith('.json'):continue
 v=load(p)
 if 'testResults' not in v:continue
 tests=[a for t in v['testResults'] for a in t['assertionResults']];counts={'freshNameMatches':0,'reusedNameMatches':0,'reportOnly':0}
 for a in tests:
  counts['freshNameMatches' if a['fullName'] in fresh else 'reusedNameMatches' if a['fullName'] in prior else 'reportOnly']+=1
  if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
 historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],failed=v['numFailedTests'],**counts));n=Path(p).name
 j=f"Historical{v['numPassedTests']}/{v['numTotalTests']} passed,{v['numFailedTests']} failed. Exact names:{counts['freshNameMatches']} fresh,{counts['reusedNameMatches']} prior,{counts['reportOnly']} report-only. Overlapping reports are not independent behaviors;matching names do not prove exact old implementation. "
 if 'RETAINED_FOCAL' in n:j+=focal
 elif 'OBSERVED_ASSOCIATION' in n:j+=observed
 elif 'PRESENTATION' in n:j+=presentation+' REV1 composition30+owner8=38;REV2 adds observed-association6=44,not44owner cases.'
 elif 'RECOLLECTION' in n:j+=recollection+' Successive7/8/15/45 reports add explicit presentation and source integrations;current component remains8publication cases.'
 elif 'ORDINARY_MEMORY' in n:j+=ordinary+' '+controls+' Baseline6ordinary+5formation grows to9ordinary+5formation;three comparator cases are later coverage.'
 else:j+=formation+' Earlier source composition includes supplied-use sensitivity premise;later actual-use witness is separately reviewed and cannot retroactively qualify old public use. Current source/protocol suites reused,remaining directional/tier test rows report-only here.'
 notes[n]=j
assert len(historical)==14 and len(failures)==2
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev165/index.json')['roleAssignments']};roles=[];strings={};bindings=[]
for p in replay['sourcePaths']:
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='ORDINARY MEMORY/RECOLLECTION/PRESENTATION HISTORY; CURRENT CREDIT AND READ EFFECTS DISTINCT',judgment=notes[Path(p).name]+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  for f in v.get('sources',[]):
   x=resolved.get(f['sha256'])
   if x and x['status']=='UNAVAILABLE':bindings.append(dict(source=p,**f,status='UNAVAILABLE',disposition=x['disposition']));continue
   assert ref(f['path'])==f;bindings.append(dict(source=p,**f,status='EXACT'))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['fullName','title','failureMessages','invariants','limits'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='MEMORY/RECALL/PRESENTATION HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],historicalTests=historical,developmentFailures=failures,limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']=='UNAVAILABLE' for x in bindings),freshTests=37,freshOriginalMutations=8,freshSymbolicFaults=10,historicalReportOnlyMutations=4,preservedFailedAssertions=len(failures),historicalTestOccurrences=sum(x['total'] for x in historical),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
