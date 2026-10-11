from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-graph-decisions-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Historical decision routing is superseded only by the named accepted resolution and scoped later evidence. Component tests do not establish public timing,read authority,Save132 or general psychological necessity. No new owner ruling,law selection or comparator retirement.'
orphan='Current shape has semantic keys,lattice weights and graph timestamp,no node-local learned payload. Remove only nodes with both incoming and outgoing exactly zero after the complete graph-owner batch. Either positive direction preserves endpoints;no epsilon,weak-edge pruning,survivor redistribution,timestamp refresh,read-time maintenance or new cognitive occurrence. Direct episodic cueing remains independent. Future familiarity/exposure/confidence/prior payload explicitly reopens emptiness predicate;dormant-node inventory is a retained alternative requiring its own lifecycle,not first model. Positive-edge scarcity is separate. Later lawful key admission may zero-initialize graph membership,not recover forgotten evidence.'
loss='Accepted directed positive edge is elementary loss unit;one per positive entry and one per incident node with independent capacities. Complete plan must satisfy both,then normalize;no separate node-deletion primitive,reverse loss or mass redistribution. No edge occurrence identity introduced;later learning at same semantic address is new state. Weight cost does not imply survival priority. Whole-node eviction remains named coarser comparator. Three actual boundary witnesses show asymmetric .67/.80 from symmetric coactivation,equal node/different edge counts and equal edge/different node counts,and retained4/15 influence after directed loss versus zero after whole-node loss. Supplied losses do not implement a victim-selection law.'
priority='Accepted strength-priority baseline ranks resolved exact positive weights then canonical addresses,removes fixed prefix until both capacities hold. Not node-release optimization,minimum deletion,bridge protection,new-edge grace or universal importance. Weak useful bridge can lose before redundant strong edge. Edge learning-recency remains serious comparator with independently governed timestamp/refresh rules,not graph timestamp or borrowed episode age. Proposed .8old/.1new example is not executed recency model. Supplied .6-to-.3 versus .4 reversal tests selector only;uniform EAM cannot selectively reverse numeric order. Quantization ties are not the requested nontie witness;combined learning changes causal intervention. Later weakening scope resolution retains conditional future producer comparison without blocking accepted component.'
storage='A directional presence set was proposed then accepted separately from survival policy. Closer/Farther/both retain distinct history without magnitude,count,current concern,affective valence or extra use. Repeated credits idempotent;lost child removes state,fresh same-semantic child starts empty. Absence is not known zero or absence of all historical assessments. Shared-bit reduction preserves no direction locally;trace recovery would require explicit authorized read. Proposed rollback,replay,withdrawal and authentic target vectors are not automatically executed by this packet. Later component tests and owner work supply only their named scopes;DS-H time passage is not actual withdrawal.'
retention='A subsequently accepted three-tier significance/use/neither candidate preserves original recency/canonical ties,unit cost,independent budgets and zero loss. Any qualifying small consequence can outrank repeated use because storage lacks magnitude/count;this is an explicit coarse hypothesis,not implied by tags. Shared protected OR tier remains serious comparator. Old significant used alpha1 versus newer used beta8 discriminates;direction/cardinality/additional use confer no bonus. Prior committed metadata only,current credit cannot rescue same-instant formation. Supplied policy tests do not authenticate causal target or public outcome,or qualify old defining memory by themselves.'
zero=orphan+' Actual EAM zero-learning/decay/elapsed operator validates and detaches lattice graph without a learned update. Preserve input key order and exact induced submatrix. Seven current GZ tests include1/100000 positive edge,empty/all-zero,idempotence,invalid weights and direct-cue equality. GZ-F compares supplied intermediate/final graphs,not executed sibling scheduling. Five original mutations detect row-only,both-direction,epsilon,empty-membership and reweighting faults.'
cue='Two older tests expose graph-gated activation composition:isolated cued a contributes zero-hop activation1 and changes selected old-cued versus recent-other;zero cue is score-equivalent. This is a genuine counterexample to deleting membership while also deleting direct cue influence in that composition. It does not require dormant nodes after the later direct/learned split preserves direct cue independently. Fresh rerun retains original counterexample,not a current graph-normalization defect.'
lifecycle='Four lifecycle tests compare retained-target contributions,not full graph rows/state hashes. Removing a fully isolated node preserves direct episodic contribution;graph-only isolated key creates no target/influence. Zero row alone is insufficient because incoming edge still contributes1/2. Explicit supplied zero-padding before actual learning matches retaining zero-state node,only arithmetic feasibility;later public source must independently admit key. Eight direct/spread cases additionally preserve graph-only cue seeding of existing targets,one zero-hop count,exact residual and combined rounding,without inventing episodes.'
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==15 and len(replay['rows'])==5
for f in replay['bindings']+replay['inputs']+replay['reused']+[replay['tests'],replay['checker'],replay['originalReviewer'],replay['originalReport']]:assert ref(f['path'])==f
for r in replay['rows']:assert r['detected'] and ref(r['report']['path'])==r['report']
fresh=load(replay['tests']['path']);assert fresh['numPassedTests']==fresh['numTotalTests']==24 and fresh['numFailedTests']==0
names={a['fullName'] for t in fresh['testResults'] for a in t['assertionResults']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev167/index.json')['roleAssignments']};roles=[];strings={};bindings=[];historical=[]
for p in replay['sourcePaths']:
 n=Path(p).name
 note=zero if 'GRAPH_ZERO_STATE' in n else cue if 'ORPHAN_CUE_TESTS' in n else lifecycle if 'ORPHAN_LIFECYCLE' in n else orphan if 'GRAPH_ORPHAN' in n else priority if 'GRAPH_PRIORITY' in n else storage if 'SIGNIFICANCE_STORAGE' in n else retention if 'SIGNIFICANCE_RETENTION' in n else loss
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  for f in v.get('sources',[]):assert ref(f['path'])==f;bindings.append(dict(source=p,**f,status='EXACT'))
  if 'testResults' in v:
   tests=[a for t in v['testResults'] for a in t['assertionResults']];assert v['numFailedTests']==0
   matched=sum(a['fullName'] in names for a in tests);historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],freshNameMatches=matched,reportOnly=len(tests)-matched))
   note+=f" Historical{v['numPassedTests']}/{v['numTotalTests']};{matched} exact names match current tests,{len(tests)-matched} report-only. Overlapping reports are not independent behavior and matching names do not authenticate old dependencies."
 roles.append(dict(**ref(p),role='GRAPH DECISION AND NORMALIZATION HISTORY; ACCEPTED SCOPE DISTINCT FROM SUPERSEDED ROUTING',judgment=note+' '+common,acceptanceChain=[ref(O/'replay.json'),*replay['reused']]))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['fullName','title','failureMessages','invariants','limits'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GRAPH DECISION HISTORY RECONCILED;HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],historicalTests=historical,limits=[common,*replay['limits']])
c=dict(status='PASS;HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshTests=24,freshOriginalMutations=5,historicalTestOccurrences=sum(x['total'] for x in historical),historicalTestReports=len(historical),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
