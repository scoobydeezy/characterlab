from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-recall-contracts-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
common='Trusted bounded composition only;supplied cue/survivor/graph inputs do not authenticate public source,subject,PRJ/IDN or allowed reads. No occurrence allocation,presentation,use/significance,graph/memory write or Save132 follows. Current tests and original commitments are identified separately from overlapping old receipts.'
direct='Exact a=(I-beta W)^-1 b on independent graph domain;learned spread a-b,direct cue only on surviving episodic keys. Unit coefficients are a bounded reference,not final weighting theory. Positive-length cycles are learned spread,zero-hop counted once. Subtract exact operands then round sum once;never subtract exact cue from rounded a or clip negative residual. Quarter plus quarter at scale2 yields half;fifth cue with zero graph yields zero learned spread despite total rounding down. Graph-only seeds may mediate actual targets,not manufacture episodes;outside-union cues validated but no rows.32-key union is workload bound,not graph cognitive capacity. Detached canonical rows are diagnostics,not persistent nodes or occurrence identities.'
independent='Copy supplied graph activation and insert local exact zeros for episodic-only keys;keep full distinct retained-key averaging denominator. Zero is no contribution from this graph,not absent observation,negative evidence or zero importance. Empty graph permits base ranking;empty episode inventory yields no target. Mixed a,b with activation3/5 only for a gives pull3/10,not3/5. Original ranker still rejects unknown keys without explicit adapter;no kernel relaxation,graph mutation,source lookup or reinforcement. Graph-only membership cannot supply missing episode content.'
body='Direct signal/acquisition-recency baseline uses binary any-surviving-group match,then original time and canonical unsigned identity ties,independent body slot prefix. Group/view count and numeric sample intensity confer no weight;zero retained bytes remain evidence. Return all surviving co-acquired groups including noncued ones,not current-physiology assertions. Missing groups never reconstructed,reads never refresh time or reinforce. Absent pure component validates supplied memory but returns no candidate;public facade must independently enforce no-read behavior. Component validation is not a public read grant. No body graph,presentation history,importance or cross-kind score.'
canonical='Present canonical cue contributes seed1 through exact direct/learned composition and actual event ranking;no body scalar,use or significance rank input. At most32 acquisitions/1..3children each,canonical key/identity adapters preserve ordering without leaking temporary labels. Actual history used;missing history becomes empty,never synthesized from acquiredAt. Absent validates static calibration then reads neither memory,graph nor history and returns UnavailableCue,distinct from Evaluated with zero winners. Present zero scores retain existing topK behavior,no invented positivity threshold. Graph-only membership never creates acquisition. Detached recalled survivors omit retention metadata. Decimal-identity mutant fails closed at inverse translation,not silent wrong-identity return. REV1 preserved CER-B failed expected-false assertion19/20;REV2 passes20/20. Reports alone do not identify exact intervening change;do not infer production defect or fix from result labels.'
partitions='Two independently ranked supplied identity lists and independent0..32slot bounds;prefix only,no borrowing,merged sorting,score exchange or feedback. Preserve supplied order,not ordinal magnitude. Global duplicate IDs reject. Zero slots is modeled exclusion;separate input work bound overflow rejects. Detached typed identities are not remembered payload,workspace admission,conscious presentation or retrieval-success occurrences. Six current partition tests;older eight also include two mixed-budget boundary cases,not eight partition cases.'
projection='Validate complete significant owner memory before filtering,including other partition;only strictly earlier acquisitions accepted. Project admitted kind,id,time and actual surviving child evidence;omit use and directional significance before ranker. Changing protection alone leaves actual body ranking unchanged. Detached bytes prevent mutation;missing children stay missing. No new persistent partition or provenance system. Invalid sibling state cannot be hidden by filtering first. Trusted validation of supplied owner value does not authorize a public sibling read;producer available-cue callback gate is separately reviewed.'
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==17 and len(replay['rows'])==15
for f in replay['inputs']+replay['reused']+[replay['tests'],replay['checker']]:assert ref(f['path'])==f
for f in replay['bindings']:assert ref(f['path'])==dict(path=f['path'],sha256=f['sha256']);assert ref(f['report']['path'])==f['report']
for row in replay['rows']:
 for k in ['reviewer','source','test','report']:assert ref(row[k]['path'])==row[k]
fresh=load(replay['tests']['path']);assert fresh['numPassedTests']==fresh['numTotalTests']==29 and fresh['numFailedTests']==0
names=lambda v:{a['fullName'] for t in v['testResults'] for a in t['assertionResults'] if a['status']=='passed'}
current=names(fresh);prior=names(load(replay['reused'][0]['path']));entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev168/index.json')['roleAssignments']};roles=[];strings={};bindings=[];historical=[];failures=[]
for p in replay['sourcePaths']:
 n=Path(p).name
 note=direct if 'DIRECT_ASSOCIATIVE' in n else independent if 'INDEPENDENT_ASSOCIATION' in n else body if 'BODY_RECALL' in n else canonical if 'CANONICAL_EVENT_RECALL' in n else projection if 'PARTITION_PROJECTION' in n or 'GA_RECALL_PARTITION' in n else partitions
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  for f in v.get('sources',[]):assert ref(f['path'])==f;bindings.append(dict(source=p,**f,status='EXACT'))
  if 'testResults' in v:
   tests=[a for t in v['testResults'] for a in t['assertionResults']];counts={'freshNameMatches':0,'reusedNameMatches':0,'reportOnly':0}
   for a in tests:
    counts['freshNameMatches' if a['fullName'] in current else 'reusedNameMatches' if a['fullName'] in prior else 'reportOnly']+=1
    if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
   historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],failed=v['numFailedTests'],**counts))
   note+=f" Historical{v['numPassedTests']}/{v['numTotalTests']};{counts['freshNameMatches']} fresh names,{counts['reusedNameMatches']} prior names,{counts['reportOnly']} report-only. Name overlap does not authenticate old dependencies or create independent behaviors."
 roles.append(dict(**ref(p),role='RECALL CONTRACT HISTORY; RETAINED CONTENT,GRAPH INFLUENCE AND PUBLIC READ AUTHORITY DISTINCT',judgment=note+' '+common,acceptanceChain=[ref(O/'replay.json'),*replay['reused']]))
assert len(failures)==1
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['fullName','title','failureMessages','invariants','limits'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RECALL CONTRACT HISTORY RECONCILED;HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],historicalTests=historical,developmentFailures=failures,limits=[common,*replay['limits']])
c=dict(status='PASS;HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshTests=29,freshOriginalMutations=15,historicalTestOccurrences=sum(x['total'] for x in historical),historicalTestReports=len(historical),preservedFailedAssertions=len(failures),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
