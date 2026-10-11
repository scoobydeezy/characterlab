from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-memory-decisions-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Historical accepted decisions preserve their scoped obligations and comparators. Later component/owner receipts are linked,not silently promoted to public source,Save132,whole memory or campaign qualification. No old OPEN label creates a current owner ruling. Counts and tests do not prove final source adequacy.'
association='Accepted independent bounded event/continuant graph supersedes draft graph=retained-files equality. All four graph/episode membership states legal. Graph stores declared structure/identity,no payload,encoding factors or resolver;node does not prove recallable episode,causal knowledge or familiarity. Lawful same-barrier learning not cancelled by episode loss;failed instant commits neither,episodic owner cannot write graph. Coupled graph-to-survivors remains comparator under graph authority. RA4/15 influence changes ranking of two surviving topK2 targets,not exclusion or action. Missing bytes stay missing;empty episodes give no target despite activation. Resource/orphan/priority closure separate;graph-only adapter preserves strict old ranker.'
direct='Accepted direct cue path independent of persistent graph. Earlier zero-edge cue witness changes old-cued score3/2 versus recent1;zero-cue equality preserved. Adapter supplying local graph zeros alone does not implement raw direct cue. Exact zero-hop counted once,learned spread separate;no adding entire solve beside direct. Actual current cue required,not retained evidence/trace/hidden truth. Temporary union vertices create no identity,state,history or graph-capacity use;separate work bounds apply. Graph-only cues may propagate without target manufacture. Membership-gated direct cue remains named coupled control;isolated-node removal cannot disable independently retained direct matching. Later direct-access component qualifies its exact arithmetic,not all public obligations by this ruling.'
scope='Accepted nonborrowing per-kind retention under one ordinary-memory authority,not separate hidden memory universes. Shared identity/read/history does not imply shared importance scale. Shared cross-kind competition remains future explicit accounting/survival comparator;two-entry shared FIFO example is illustrative,not executed or accepted law. Genuine within-kind pressure must cause loss,not retain-all or workload rejection. Current accessibility excluded from first eviction;retained inaccessible memory possible. Consolidation requires bounded owned class,no background archive or silent cross-kind escape. Historical initial output immutable but inaccessible as forgotten-content resolver. Seven public witnesses in ruling are requirements,not passed append-only scheduler fixtures;later receipts support only their scoped gates.'
loss='Accepted complete semantic-child fragmentation counts one per child,including all bounded views of a signal;full acquisition/child identity distinguishes repeated signals. Bytes,records,views and presentations are not cognitive costs. Aliases/serialization cannot inflate capacity;equal values do not merge legitimate signals. Partial remainder preserves ID,original time,exact bytes;no fragment identity,new presentation,merging or rewrite. Contradictory views remain together;within-unit degradation is deferred. Last child removes recall target,not historical occurrence;no identity reuse or trace/source recovery. Whole-acquisition retirement remains simpler comparator with different cost;not retired. Six public witnesses remain obligations,not prior append-only results.'
priority='Recency accepted first bounded baseline,not final importance:original acquisition time only,canonical ties mechanical,complete prior+fresh batch once. Reads,presentation,consolidation processing and survival cannot refresh age. Zero cognitive capacity causes actual loss;work bounds distinct. Pure policy cannot establish committed acquisition success. Mandatory richer comparisons old-used/new-unused,self-rehearsal and old-rarely-retrieved/outcome-significant remain separate;baseline alone cannot close GA. Presentation count,Supported,TaskConcern or encoding strength cannot stand for acquired protection. Earlier fragmentation8/seven faults prove loss mechanics only;later retention and credit receipts retain their limits.'
protection='Binary child-local actual-use protection selected first,graded bounded reinforcement retained candidate. Completed cognitive consumer beyond retrieval bookkeeping must bind actual retained operands and result. Recall,rank,diagnostic,query or presentation alone do not earn it. false-to-true is idempotent;no count/age refresh. Protected tiers still lose under pressure/zero capacity;lost children cannot resurrect. Equal bytes supplied detached versus actually consumed are distinct. Governance history not psychological use. Same-barrier timing and consumer authentication require separate contracts. This alone does not explain rarely retrieved significant memory;surprise/outcome assessment remains separate. Old packet points to accepted use ruling,not a current blocker.'
retrieval='Accepted independent per-kind recall slots,no borrowing/cross-score operand transfer,under one ordinary-memory service. Body direct-only first,not copied event score,pressure/intensity/sample-count strength or body graph. Both kinds must face contention;opposite-kind additions preserve fixed branch result,not denial of distraction or later shared workspace. Typed result union not simultaneous consciousness. Shared mixed retrieval remains serious calibrated comparator. Supplied actual-ranker .6 event versus .4/.2 body becomes body winner at .8/.4 while within-body order unchanged. This is scale noninvariance under mixedK1,not physiology or psychological calibration. No common scale follows from identity or within-kind order.'
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==16
for f in replay['inputs']+replay['reused']+[replay['tests'],replay['checker']]:assert ref(f['path'])==f
fresh=load(replay['tests']['path']);assert fresh['numPassedTests']==fresh['numTotalTests']==6 and fresh['numFailedTests']==0
names={a['fullName'] for t in fresh['testResults'] for a in t['assertionResults']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev170/index.json')['roleAssignments']};roles=[];strings={};historical=[];failures=[]
for p in replay['sourcePaths']:
 n=Path(p).name;note=association if 'ASSOCIATION_RETENTION' in n or 'ASSOCIATION_BOUNDARY' in n else direct if 'DIRECT_CUE_MEMBERSHIP' in n else scope if 'RETENTION_SCOPE' in n else loss if 'RETENTION_LOSS_UNIT' in n else priority if 'RETENTION_PRIORITY' in n else protection if 'ACQUIRED_PROTECTION' in n else retrieval
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  if 'testResults' in v:
   tests=[a for t in v['testResults'] for a in t['assertionResults']];matched=sum(a['fullName'] in names for a in tests)
   for a in tests:
    if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
   historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],failed=v['numFailedTests'],freshNameMatches=matched,reportOnly=len(tests)-matched))
   note+=f" Historical{v['numPassedTests']}/{v['numTotalTests']};{matched} names match current cases,{len(tests)-matched} report-only. Overlapping reports are not independent cases and name equality does not authenticate old implementation."
 roles.append(dict(**ref(p),role='MEMORY RESOURCE DECISION HISTORY; COST,LOSS,RETENTION AND RETRIEVAL DISTINCT',judgment=note+' '+common,acceptanceChain=[ref(O/'replay.json'),*replay['reused']]))
assert len(failures)==0
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or any(k in ptr.split('/') for k in ['fullName','title','failureMessages'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='MEMORY RESOURCE DECISION HISTORY RECONCILED;HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],historicalTests=historical,developmentFailures=failures,limits=[common,*replay['limits']])
c=dict(status='PASS;HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),freshTests=6,historicalTestOccurrences=sum(x['total'] for x in historical),historicalTestReports=len(historical),preservedFailedAssertions=0,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
