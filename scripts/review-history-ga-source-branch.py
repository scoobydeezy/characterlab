from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-source-branch-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Historical component and symbolic-carrier evidence only; public admission,combined-source reservation,physical-root persistence and branch-vector execution require separate evidence. No new production law,allocation or psychological reduction.'
notes={
'docs/planning/GA_BODY_SOURCE_BRANCH_CLOSURE_REV2.md':'BS-A through BS-J are frozen vectors,not passed public experiments. One completed source independently feeds selection and cue;zero encoding capacity need not prevent old recall. Experience=P or V or B;event detection=P or V;body cue=B,where operands are actual present observations. Multiple body views share one experience;empty selector still owns1143. Unrequested panel is not sampled unavailable or continuity closure. Visual fallback without panel cannot invent context. Consequence baseline must be an actually recalled retained matching Before;missing,lost,ambiguous,unrecalled or foreign context stays unavailable. New After cannot self-baseline. No host cache,trace resolver,newest-value fallback or automatic use credit. Phase130 cannot dispatch backwards40 or read provisional sibling output. SC-H capacity0 preserves supported attribution but has no qualified change/significance;the21 narrower tests do not pass the BS public matrix.',
'docs/planning/GA_LOCAL_RESERVE_PUBLIC_CARRIER_REV1.md':'Preserve singleton455;new physical root holds three454 anchors keyed by qualifiedCharacter plus distinct physicalReserve,not safe signal or occurrence allocator. Composite key has no scalar StateMapKey role. Reuse453 parameters/479 arithmetic and1039 units without pooling,transfer,coupling or cross-domain conversion. Exact3 reserve/signal bijection,1..3 views each. Nonempty requested channels emit actual present/unavailable;unrequested emit nothing. Replenishment truth contains actual prior/next and numeric result,never cognitive sample or cue;zero delivery reanchors. New owner authority has three exact leaves,not widened old authority. Sampler reads without mutation;restore must preserve all anchors/keys/model prefix. Root inventory omission repaired conceptually,not a qualified compiler or persistence result.',
'docs/formal/LOCAL_RESERVE_SOURCE_COMPONENT.md':'Synthetic local-reserve-source-component/0.1-candidate uses exact existing reserve arithmetic,three compartments and a declared3-to3 safe mapping with up to3 views each.1..9 channel syntax does not waive actual bijection. Stable physical labels differ from safe signal labels;this finite mapping is not a universal law. Query does not reanchor;targeted delivery returns new detached opaque source,leaves original and siblings unchanged;zero delivery still reanchors. Uniform unavailable payload exposes neither denial cause nor physical key/anchor/rate/amount/applied/overflow. Hidden within-bin changes and physical renaming leave safe output equal. Rational inputs and zero outputs are detached/frozen. Kinetics changes require a comparison model,not in-run parameter editing. No Need/ranking or time approximation;public IDs,root,compiler,SEM,trace,fault and restore remain separate.',
'docs/formal/LOCAL_RESERVE_OPPORTUNITY_COMPONENT.md':'Body-only actual461/463 observations reserve one experience iff at least one is present;all-unavailable owns no fake experience and no event detection. Present observations require actual nonnull opportunity even if cue permission denied. Null opportunity permits an empty selector and absent cue;old singleton consumers retain their version/domain. Two gates share the same source and algorithm without a law change. Combined-source coordinator must not invoke body-only adapter as a second reservation. Trusted staged lane is a component boundary,not completed public time/phase/commit admission;no formation,memory or projection claim.',
'docs/planning/GA_LOCAL_RESERVE_PUBLIC_CARRIER_REV1.json':'Nine symbolic records preserve physical key/safe signal,three owned anchors,existing arithmetic and separate owner authority. Three cited dependencies match exactly;old localReserveSource e75a4987d153a532a5de42daee85cb146e0b5afcfdec83930dda3c3a01fa29b5 remains unavailable after directed local/all-ref Git/prior-archive search. Exact historical implementation-content and full builder/reviewer replay claims are excluded;current source is separately tested,never substituted as old bytes.',
'docs/planning/GA_LOCAL_RESERVE_PUBLIC_CARRIER_REVIEW_REV1.json':'Original executable validator prefix freshly reproduces all nine faults:physical-as-safe-signal,runtime allocator,premature namespace,merged anchors,scalar composite key,physical-as-memory,cognitive physical read,parallel numeric result,widened old owner. All validator/fault assertions unchanged;execution stops before unavailable historical source-hash loop. This bounded prefix check is not a complete replay of the historical reviewer. Bijection/actual parameter/channel/observer compiler bindings and physical persistence remain outside these symbolic checks.',
'docs/planning/CONSEQUENCE_BASELINE_RECALL_COMPOSITION_TESTS_REV1.json':'Historical21 passing assertions comprise8bodyRecall,8source composition and5trial panel cases. All exact test names remain present:13 freshly executed recall/panel cases plus8 in the previously executed31-case composition suite;that prior receipt is reused,not rerun. Current31 fresh tests also include8reserve-source/10observation cases. Recall is capacity-gated actual retained content,not all retained content;binary matching is not view-count weighting,fragmentation cannot rejuvenate,canonical time ties/detachment remain. Panel continuity derives from actual observations;absence,glyph/repeated Before,foreign observer,replay,malformed input or missing stage cannot be repaired by schedule. Hidden-independent delivery leaves attribution equal;goal-relative focal qualification and loss/cue access stay distinct. Current tests do not prove the exact old implementation or public BS vectors.'
}
replay=load(O/'replay.json');assert len(replay['validator']['faults'])==9 and len(replay['matchedHistoricalNames'])==21
for k in ['tests','reused','historicalTestReceipt']:assert ref(replay[k]['path'])==replay[k]
for f in replay['inputs']:assert ref(f['path'])==f
recovery=load(O/'source-recovery.json');resolved={x['original']['sha256']:x for x in recovery['rows']};assert sum(x['status']=='UNAVAILABLE' for x in recovery['rows'])==1
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev160/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=n;assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='BODY SOURCE BRANCH/PHYSICAL OWNERSHIP HISTORY; HISTORICAL SOURCE LIMIT EXPLICIT',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
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
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler','pending','fullName','title'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BODY SOURCE/RESERVE HISTORY RECONCILED WITH EXPLICIT MISSING IMPLEMENTATION; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']=='UNAVAILABLE' for x in bindings),freshSymbolicFaults=9,freshTests=31,reusedHistoricalTestNames=8,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
