from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-actual-formation-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Component qualification only; exact historical source commitments retained or explicitly excluded when unavailable. Current tests/mutations are separate evidence. No scheduler,PRJ,public provenance,canonical codec,committed owner or persistence qualification is inferred.'
selection='Actual local selector validates complete1..9 requested sample/declaration bijection,<=3 signals/3 views,time/observer/producer/bytes before allocation. Missing sample cannot become observed unavailable. Every completed selector owns one1143 even empty/unavailable;one-use selected capability borrows it and exposes only selected safe groups. Cue remains independent. Later positive130 producer alone allocates acquisition;copied audit authorizes neither learning nor memory. Failed allocation preserves source but outer transaction must roll back allocator. Initial all-five-failed fixture omitted/conflated physical mappings;corrected fixture keeps three independent reserves and two declared A views without weakening validation.'
context='Actual panel companion,not caller Before/Motion/After label,provides retained stage. Experience,event,observer,time,support,version and exact plain-data shape must match before selection allocation;necessary structural join is not authenticity. Detached context shares the one-use capability without new identity/full experience/unselected content. No panel means no stage;standalone73 remains null. Empty selection can carry context but forms no child. Four complete retained context groups are required before focal lookup;initial empty-set fall-through wrongly produced FocusUnavailable,corrected to GroupingUnavailable. Loss of stage does not undo lawful visual acquisition.'
body='Producer consumes actual contextual selected capability;positive groups allocate exactly one acquisition,regardless of views. Header retains actual selector provenance and source time/observer;only selected sample bytes/context survive. Empty selection forms nothing but remains independently enrolled source. Output is provisional,not committed memory;140 owner must reuse admitted identity and settle its batch. Allocation failure consumes capability and publishes nothing;whole-instant retry rebuilds from prefix and rolls back allocator. No persistent owner/protocol mutation in this component.'
visual='Preparation binds actual context,owns1143 and transfers selected-only spatial operands;encoding consumes one capability and produces a separate one-use positive candidate. Producer allocates one acquisition iff positive units,not per child. Claims,observations and full experience stop before encoding;no role rederivation. Empty/zero/unavailable produce no owner work but selector still exists. Current tests separate actual capacity-zero,known-zero and unresolved role from supplied missing-coordinate projection,which first complete-position scene cannot generate. Earlier concern affects peripheral encoding while focal/selection/identity counts remain;unavailable feedback stays explicit,current feedback rejects. This arithmetic does not authenticate delivered producer/subject. Encoding suppression is not retrieval amplification or a settled law.'
use='Actual-read discriminating witness chooses earlier admitted stroke endpoint3,qualified at4 with active goal. Actual attribution at71 consumes16 recalled body/position children including later endpoint63;only focal3 gets frozen directional significance72. Withdrawal70 does not revise assessment. New acquisition73 has no invented use credit. Identical actual-used memory/capacities:significance-first retains3;shared-protection or disabled/nonqualifying significance retains63 by recency. Focal-last actual-read control is nondiscriminating;old supplied-use experiment remains an explicitly ineligible public-use sensitivity comparator. No fifth episode/new consumer or significance transfer needed. Frozen old qualification64 belongs to its focal-last schedule,not an alias for4.'
notes={
'docs/formal/BODY_SELECTION_OCCURRENCE_COMPONENT.md':selection,
'docs/formal/CONTEXTUAL_BODY_SELECTION_COMPONENT.md':context,
'docs/formal/BODY_FORMATION_EVIDENCE_COMPONENT.md':body,
'docs/formal/VISUAL_FORMATION_EVIDENCE_COMPONENT.md':visual,
'docs/planning/GA_ACTUAL_BODY_SELECTION_REV1.md':selection+' Eight positive body acquisitions plus one empty cue selector and nine visual audits account for18 sources;no fixture-source fallback.34 focused tests did not refresh earlier149 affected suite.',
'docs/planning/GA_ACTUAL_CONTEXT_CARRIAGE_REV1.md':context+' Original28-test receipt is27pass/1fail,then28pass after boundary correction;test serialization is not public retained codecs.',
'docs/planning/GA_ACTUAL_FORMATION_EVIDENCE_REV1.md':body+' '+visual+' Historical169/25-file affected suite and16 faults have their original source scope. Outer selected-map deletion alone was defended by consumed inner capability and explicitly excluded from detected-fault count.',
'docs/planning/GA_ACTUAL_USE_RETENTION_RESOLUTION_REV1.md':use,
}
replay=load(O/'replay.json');assert len(replay['rows'])==17 and len(replay['inapplicable'])==2
for f in replay['inputs']+[replay['tests'],replay['reused'],replay['originalReviewer'],replay['defended']['report']]:assert ref(f['path'])==f
for row in replay['rows']:
 for k in ['file','test','report']:assert ref(row[k]['path'])==row[k]
recovery=load(O/'source-recovery.json');resolved={x['original']['sha256']:x for x in recovery['rows']};assert sum(x['status']=='UNAVAILABLE' for x in recovery['rows'])==16
prior=load(P/'campaign3-history-source-roles-rev162/index.json');entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in prior['roleAssignments']}
keys=['BODY_SELECTION','ACTUAL_CONTEXT','ACTUAL_USE_RETENTION','ACTUAL_BODY_SELECTION','FORMATION_EVIDENCE','BODY_FORMATION','VISUAL_FORMATION'];paths=[p for p in prior['unassignedCandidatePaths'] if any(k in p for k in keys)];assert len(paths)==26
fresh={a['fullName'] for t in load(replay['tests']['path'])['testResults'] for a in t['assertionResults'] if a['status']=='passed'};reused={a['fullName'] for t in load(replay['reused']['path'])['testResults'] for a in t['assertionResults'] if a['status']=='passed'}
testRows=[];failures=[]
for p in paths:
 if not p.endswith('.json'):continue
 v=load(p);n=Path(p).name
 if 'testResults' in v:
  tests=[a for t in v['testResults'] for a in t['assertionResults']];counts={'freshNameMatches':0,'reusedNameMatches':0,'reportOnly':0}
  for a in tests:
   which='freshNameMatches' if a['fullName'] in fresh else 'reusedNameMatches' if a['fullName'] in reused else 'reportOnly';counts[which]+=1
   if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
  testRows.append(dict(source=ref(p),reportedTotal=v['numTotalTests'],reportedPassed=v['numPassedTests'],reportedFailed=v['numFailedTests'],**counts))
  j=f"Historical receipt: {v['numPassedTests']}/{v['numTotalTests']} passed,{v['numFailedTests']} failed. Exact current-name matches:{counts['freshNameMatches']} fresh,{counts['reusedNameMatches']} prior goal/composition,{counts['reportOnly']} report-only. Name matching is not historical byte execution. Full169 affected regression not rerun. "
  if 'CONTEXT_RETENTION' in n:j+=context
  elif 'BODY_SELECTION' in n:j+=selection
  elif 'USE_RETENTION' in n:j+=use
  elif 'CALIBRATED' in n:j+='REV1 preserves VF-I rational equality failure50/51;REV2 reports51/51. Current VF-I explicitly asserts sparse/dense small-floor shared contrast,unit-floor null,independent3/13,retired-flat1 and hybrid over-unit sum. Exact failed-version implementation is unavailable;do not infer what source edit caused correction or select a law from subsequent PASS.'
  else:j+=body+' '+visual
  notes[p]=j
 else:
  j=f"Historical{len(v['faults'])} fault outcomes retained,not independent fresh executions of each repeated report. "
  if n=='ACTUAL_USE_RETENTION_REVIEW_REV1.json':j+=use+' Three old mutations target invented newer credit,discarded actual use and discarded focal significance;their source fixture versions are unavailable and these three were not rerun.'
  else:j+=selection+' '+body+' '+visual+' Seventeen originalREV3 mutation definitions freshly detect designated witnesses on current sources. Context-alias and skip-prior-concern substitutions no longer match and are not executed/counts. Historical16/19-fault reports exclude defended outer-selected-map deletion;fresh base-encode-only VF-C removal still rejects replay via inner consumption,not a detected fault. Older context validation lived in another file;do not equate matching fault labels with identical historical source.'
  notes[p]=j
assert len(failures)==7 and len(testRows)==13
roles=[];strings={};bindings=[]
for p in paths:
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256'];j=notes[p]
 roles.append(dict(**ref(p),role='ACTUAL SELECTION/CONTEXT/FORMATION/USE HISTORY; PROVISIONAL AND COMMITTED DISTINCT',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  for f in v.get('sources',[]):
   x=resolved[f['sha256']]
   if x['status']=='UNAVAILABLE':bindings.append(dict(source=p,**f,status='UNAVAILABLE',disposition=x['disposition']));continue
   assert ref(x['resolved']['path'])==x['resolved'];bindings.append(dict(source=p,**f,status='EXACT',resolved=x['resolved']))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['limits','fullName','title','failureMessages','defendedSubstitution'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='ACTUAL FORMATION/USE HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],historicalTests=testRows,developmentFailures=failures,limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']=='UNAVAILABLE' for x in bindings),uniqueUnavailableVersions=len({(x['path'],x['sha256']) for x in bindings if x['status']=='UNAVAILABLE'}),freshTests=24,freshCurrentMutationFaults=17,inapplicableOriginalMutations=2,defendedCurrentControl=1,preservedFailedAssertions=len(failures),historicalTestOccurrences=sum(x['reportedTotal'] for x in testRows),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
