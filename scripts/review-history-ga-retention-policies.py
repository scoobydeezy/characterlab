from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-retention-policies-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Bounded component/internal scheduler evidence,not public source admission,read authorization,Save132 or complete-prefix replay. Historical OPEN decisions must be read with the later accepted resolutions and current qualified gates;this audit opens no owner ruling and selects no universal law.'
notes={
'RETENTION_FRAGMENTATION':'Explicit whole-child loss plan,not victim selection. One child costs one regardless of views/bytes;event/body pools never borrow. Partial loss preserves exact surviving bytes and acquisition identity;last child removes acquisition. No removed-payload archive,mask or resolver is returned. Input immutability does not authorize owners to retain hidden old content. Dense bounded inputs,unique identities/keys and valid loss addresses required;insufficient plan rejects rather than silently choosing further victims. Work bounds are not public cognitive parameters.',
'RECENCY_RETENTION':'Complete barrier combines prior and fresh candidates once. Original acquisition time descending,then canonical encoded acquisition/child address ascending;ordinal magnitude and locale are not chronology. Rank independently per kind,then actual fragmentation. Zero capacity loses all;scarcity is actual loss rather than admission failure. Survivors retain original time,never rejuvenate. No importance,retrieval,presentation or access input. Initial test-capacity spelling error was fixed before passing receipt;no semantic defect inferred. Old same-barrier protection question is superseded by later owner timing,not reopened.',
'USE_PROTECTION':'Accepted bounded binary child-local false-to-true protection is idempotent,not count,decay or age reset. Successful use requires independent cognitive consumer committed result,not objective success,reward,choice or attribution alone. Cue/rank/recall/presentation/logging alone insufficient;no sibling credit. Pure supplied-target validation does not authenticate use. Protected tier precedes unprotected,then original recency/canonical ties;all tiers can lose,zero loses all. Lost protection cannot rescue or transfer to fresh acquisition. Graded alternative remains distinct from accessibility,encoding and relevance. Prior-read/actual owner timing is a separate qualification.',
'DIRECTIONAL_SIGNIFICANCE':'Four exact states:empty,Closer,Farther,both,canonical unique order;no magnitude,count,confidence,time or concern stored. Qualified child-target credit validates observer/character and all inputs before detached update;repeats idempotent,use/time/bytes independent. Loss removes metadata with child,partial survivors preserve it,no reconstruction or inheritance. Shared nonempty bit is a read-only reduction,not intact directional state. Absence is not complete history or known zero importance;both earns no extra strength. DS-F tests pure input atomicity,not scheduler rollback;DS-H changes time,not actual goal withdrawal. Historical validator refactor preserves no-dummy-context boundary but two exact intermediate implementations remain unavailable.',
'SIGNIFICANCE_FIRST_RETENTION':'Accepted three tiers:any significance,use-only,neither;shared-OR protection remains comparator. Direction,cardinality and additional use add no within-tier bonus. Original recency/canonical ties,unit costs,independent pools and zero loss preserved. Fresh protected candidates reject;policy consumes prior committed metadata. Compact old state has no credit timestamp and cannot authenticate prior timing by itself. Current-credit-after-retention owner integration is reviewed separately. REV1 and REV2 each24 overlapping tests,before/after shared-validator extraction,not48 independent behaviors. No whole defining-memory or universal importance claim.',
'GRAPH_EDGE_LOSS':'Explicit positive directed edge addresses,no independent EdgeId. Separate incident-node/positive-edge capacities;each positive edge costs one,not its weight. Duplicate,absent,zero,self addresses reject. Zero only selected directed weights,normalize orphans,preserve exact reverse/unrelated survivors;no redistribution,lost-weight archive or fallback node. Node pressure may require coordinated multiple edge removals. Insufficient plan rejects;reapplying old loss rejects,so owner transaction must handle replay. This is loss application,not a selection law.',
'STRENGTH_GRAPH_RETENTION':'Order actual positive edges by exact current weight then canonical directed address. Remove shortest prefix of that fixed order satisfying node and edge capacity;incident degrees release orphan nodes. Not globally minimum deletions,bridge protection,new-edge grace or easiest-node optimization. Apply complete plan atomically through edge-loss component. Current-strength survival is a bounded candidate;edge-learning recency remains meaningful with timestamp semantics unaccepted. SR-E supplied resolved operands reverse a victim,not an actual selective weakening producer. Existing uniform EAM without learning preserves exact strict order;quantization can collapse ties/zeros but cannot numerically reverse it. Future selective producer witness remains conditional and mechanism-dependent;no per-edge override/new mechanism authorized.',
'STRENGTH_GRAPH_SETTLEMENT':'Actual EAM coactivation/learning precedes strength retention within one terminal owner. Two participants read common B0,one final graph and peer state commit. Reversed participant order preserves final state,not necessarily trace identity. Zero graph capacity still allows successful peer work. Late failure rolls back state,queue,clock,allocator,outputs and trace;failed scheduler remains terminal. Active quiescent trusted snapshot continuation matches later committed surfaces,not canonical Save132/public restart. Fixture key zero-padding is not forgotten-content reacquisition. SS-E135 ordered pair/weakening cases check actual uniform EAM nonreversal;selector supplied reversal is separate. Earlier coupled memory/graph/history membership declarations are superseded by independently owned state,not grounds to resurrect lost content.'
}
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==34 and len(replay['rows'])==36
for row in replay['rows']:
 assert row['status']=='DETECTED ON CURRENT INPUTS'
 for key in ['source','test','reviewer','report']:assert ref(row[key]['path'])==row[key]
for f in replay['inputs']+[replay['tests'],replay['checker']]:assert ref(f['path'])==f
fresh=load(replay['tests']['path']);assert fresh['numPassedTests']==fresh['numTotalTests']==60 and fresh['numFailedTests']==0
freshNames={a['fullName'] for t in fresh['testResults'] for a in t['assertionResults']}
recovery=load(O/'source-recovery.json');resolved={r['original']['sha256']:r for r in recovery['rows']};assert sum(r['status']=='UNAVAILABLE' for r in recovery['rows'])==2
entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev166/index.json')['roleAssignments']};roles=[];strings={};bindings=[];historical=[]
for p in replay['sourcePaths']:
 name=Path(p).name;normalized=name.replace('USE_PROTECTED_RETENTION','USE_PROTECTION')
 key=next((k for k in notes if k in normalized),None)
 if name=='GENERAL_ATTENTION_SIGNIFICANCE_STORAGE_RESOLUTION.md':key='DIRECTIONAL_SIGNIFICANCE'
 if name=='GENERAL_ATTENTION_SIGNIFICANCE_RETENTION_RESOLUTION.md':key='SIGNIFICANCE_FIRST_RETENTION'
 if name=='GENERAL_ATTENTION_GRAPH_WEAKENING_SCOPE_RESOLUTION.md':key='STRENGTH_GRAPH_RETENTION'
 assert key,name
 judgment=notes[key]+' '+common
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  for f in v.get('sources',[]):
   r=resolved.get(f['sha256']);assert r
   if r['status']=='EXACT':assert ref(r['resolved']['path'])==r['resolved']
   bindings.append(dict(source=p,**f,status=r['status']))
  if 'testResults' in v:
   tests=[a for t in v['testResults'] for a in t['assertionResults']];assert v['numFailedTests']==0
   matched=sum(a['fullName'] in freshNames for a in tests)
   historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],freshNameMatches=matched,reportOnly=len(tests)-matched))
   judgment+=f" Historical{v['numPassedTests']}/{v['numTotalTests']};{matched} names match current tests,{len(tests)-matched} report-only. Name equality does not authenticate exact old implementation;overlapping reports are not independent behaviors."
  elif 'REVIEW' in name:judgment+=' All36 original substitutions detected on current source/test/dependencies;exact historical source commitments checked separately,not a claim to reproduce missing old implementation.'
 roles.append(dict(**ref(p),role='RETENTION POLICY AND OWNER HISTORY; LOSS,USE,SIGNIFICANCE AND GRAPH PRESSURE DISTINCT',judgment=judgment,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json')]))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['fullName','title','failureMessages','invariants','limits'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RETENTION POLICY HISTORY RECONCILED;HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],historicalTests=historical,limits=[common,*replay['limits']])
c=dict(status='PASS;HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']=='UNAVAILABLE' for x in bindings),freshTests=60,freshOriginalMutations=36,historicalTestOccurrences=sum(x['total'] for x in historical),historicalTestReports=len(historical),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
