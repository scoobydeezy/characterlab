from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-reserve-bridge-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Historical component evidence and symbolic direction only; current tests/mutants are separately identified,not exact execution of unavailable old implementations. Source availability and authority adequacy remain explicit;no public runtime promotion.'
notes={
'docs/formal/LOCAL_RESERVE_SAMPLE_BRIDGE_COMPONENT.md':'Actual opaque three-reserve source, trusted observer/instant,explicit dense unique known nonempty <=9 channels and transaction allocator produce one actual461/463 per requested channel in canonical order. Validate complete request before allocation;reuse exact462 bins. Samples own1115 observations,not experience/selection identities. Exact new producer version differs from singleton. Safe channel/signal companion contains no physical key,amount,anchor,permission cause or resolver. Separately named gates admit only exact version,not caller whitelist;cue independent of encoding capacity. Matching codec/version does not authenticate public original/PRJ/completion. Outer transaction owns allocator rollback;registration,canonical state and complete-prefix proof remain separate.',
'docs/planning/GA_PHYSICAL_SOURCE_SCHEDULE_REV1.md':'Correct-forward finding:old fixture prepared body immediately before current observation using hidden materialized amount;host sequence was not lawful public schedule or declared controller. Revised fixed preparations7@20,17@40,17@60 at110 precede current21/41/61 phase10. Initial21@0 rate1 yields20@1 without zero preparation;zero-delivery control remains separate. Outcome13/3/3/13 at4/24/44/64 phase110 precedes consequence120. Inputs stay fixed under concern/significance/hidden-delivery and rate/initial interventions;never silently recompute to force20. Four Before bins remain[20,21]. SC-V explicitly checks literal deliveries/baselines. Direct component result is not scheduler admission or public owner/patch/trace qualification.',
'docs/planning/LOCAL_RESERVE_SOURCE_COMPONENT_CHECKPOINT.md':'Seven-test baseline followed by eighth inventory/domain test and six physical-source fault reports. Actual qualified arithmetic is reused with three independently keyed detached states,one-target new-source replenishment and safe observations;truth inspection is not cognitive access. Synthetic fixture,not general independent human Needs. Historical source implementation hash is unavailable,so original six fault outcomes remain report-only;current eight baseline tests were separately run in prior batch. No new root,number,public factory,corpus or whole attention qualification follows.',
'docs/planning/LOCAL_RESERVE_PUBLIC_SOURCE_DRAFT_REV1.md':'Initial symbolic draft,not whole-shape/allocation authority. Separate physical/safe identities and character-qualified anchors;immutable model kinetics,read-only sensing,only named replenishment writer,no implicit body creation. Safe channel mapping excludes physical keys/accessors and permission causes;equal values do not merge signals. Explicit new source admission cannot impersonate old singleton. One experience per actual opportunity and distinct same-time/current-consequence opportunities;support IDs grant no sample lookup. Selected-only peer ordinary episodic memory cannot become visual continuant or hidden body sidecar.1143 acquisition reuse was only a candidate requiring role audit. One family writer/common-B0 reconciles multiple formations. Exact paths,bounds,retention/persistence/budgets remained open;later direction corrects ambiguous permission wording.',
'docs/planning/LOCAL_RESERVE_PUBLIC_SOURCE_DIRECTION_ACCEPTANCE.md':'Accepts direction with clarifications,not whole shape or runtime/allocation. Physical address is(CharacterId,LocalReserveId);fixture bijection does not equate safe signal with physical identity. Corrects draft permission wording:experience iff actual admitted/present sample,not permission alone. Multiple views share one experience;different equal-time and consequence opportunities stay distinct. Shared identity cannot invent fallible causal relation. Support227 may include unselected observations but grants no numeric lookup;consequence still traverses269/270. Body acquisition must participate in ordinary memory lifecycle,not sidecar;1143 reuse remained unresolved then and was subsequently distinguished by reviewed acquisition carrier. Same-instant one-writer/common-B0 required. Hidden-key/within-bin downstream invariance is an end-to-end obligation,not discharged by source equality. No new owner ruling arises from historical unresolved wording.',
}
replay=load(O/'replay.json');assert len(replay['rows'])==10 and sum(x['count'] for x in replay['historicalMatches'])==152
for row in replay['rows']:
 for k in ['script','file','report']:assert ref(row[k]['path'])==row[k]
for f in replay['inputs']+replay['reused']+[replay['tests']]:assert ref(f['path'])==f
for x in replay['historicalMatches']:
 p=x['path'];assert ref(p)=={k:x[k] for k in ['path','sha256']}
 notes[p]=f"Historical passing test receipt with{x['count']} assertions;all exact names match separately identified current or previously executed suites. Six receipts contain152 occurrences but only53 distinct names,not152 independent behaviors. Source baseline grows7 to8;bridgeREV1/REV2 both37 with identical names;opportunity adds four branch cases for41;physical schedule has22 composition cases includingSC-V. No old source-version execution inferred from name equality. The prior31 source/recall/panel and42 goal/composition suites are reused;only13 cue/selection baseline tests freshly run here."
for n,judgment in {
'LOCAL_RESERVE_SOURCE_REVIEW_REV1.json':'Six historical physical-source substitutions:prior-source mutation,first-reserve alias,permission bypass,physical-key leak,skipped zero reanchor and mutable rational. Original source hash42bad04835eb28d05af97054092f6210f698751eeac03e5754743928d258c695 is unavailable. Preserve exact fault definitions/witnesses/reported failures;no fresh six-fault execution claimed. Imported math/test/contract/script bindings exact.',
'LOCAL_RESERVE_SAMPLE_BRIDGE_REVIEW_REV1.json':'Five original mutations freshly applied to explicitly hashed current sources:unrequested sensing,old producer claim,reused observation,observer alias and cue foreign-producer acceptance. Each fails original designated witness. Five cited intermediate source/test versions unavailable,so current mutation detection is not reproduction of old implementation. Exact reviewer script retained. Trusted allocation and exact producer checks remain component scope,not authentic public original/completion/subject or scheduler rollback.',
'LOCAL_RESERVE_OPPORTUNITY_REVIEW_REV1.json':'Five original mutations freshly applied to current sources:reserve for absence,erase support,force Current lane,select without experience,cue without experience. Each fails designated witness. Old bridge151130c093228f197e25846e1a9c8b5db2f146bbe9c23f63267c0d4437cba7e5 unavailable;other five cited dependencies exact. Real SEM reserve/freeze at component scope does not qualify combined-source coordinator or public ingress/settlement. Missing source bytes explicitly exclude exact old implementation reproduction.'
}.items():notes['docs/planning/'+n]=judgment
recovery=load(O/'source-recovery.json');resolved={x['original']['sha256']:x for x in recovery['rows']};assert sum(x['status']=='UNAVAILABLE' for x in recovery['rows'])==7
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev161/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=n;assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='RESERVE BRIDGE/SCHEDULE HISTORY; HISTORICAL SOURCE LIMITS EXPLICIT',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json'),ref(P/'campaign3-history-ga-body-carriers-rev1/review.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v.get('sources',[])+([v['baseline']] if 'baseline' in v else []):
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
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler','pending','fullName','title','failed'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RESERVE BRIDGE/SCHEDULE HISTORY RECONCILED WITH EXPLICIT MISSING IMPLEMENTATIONS; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']=='UNAVAILABLE' for x in bindings),freshCurrentMutationFaults=10,historicalReportOnlyFaults=6,freshTests=13,historicalTestOccurrences=152,distinctHistoricalTestNames=53,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
