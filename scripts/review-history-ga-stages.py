"""Reconcile symbolic GA stage proposals without promoting them to runtime proof."""
from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-history-ga-stages-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fps(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fps(x)
 elif isinstance(v,list):
  for x in v:yield from fps(x)
specs={}
def add(names,judgment):
 for n in names:specs[(P/n).as_posix()]=judgment
add(['GA_SOURCE_STAGE_CLOSURE_REV1.md','GA_SOURCE_STAGE_CLOSURE_REV1.json','GA_SOURCE_STAGE_REVIEW_REV1.json'],
 'Historical symbolic source topology: five wrappers and 15 lane registrations, eight events per requested original. Current 10..15/40 and consequence 120..125/130 preserve sensing after lawful physical change. Only sampling receives truth; later stages carry safe actual products. Tracking alone writes perception roots. Requested unavailable views differ from absent requests; one conditional experience is shared rather than reallocated. Exact producer authority is not shape equality. Fresh ten original declaration mutants pass, but named reads/writes are not executable ReadDomains, and the old component source SHA is unavailable. Component execution, whole packaging and later public qualification remain separate evidence.')
add(['GA_ACQUISITION_RECALL_STAGE_CLOSURE_REV1.md','GA_ACQUISITION_RECALL_STAGE_CLOSURE_REV1.json','GA_ACQUISITION_RECALL_STAGE_REVIEW_REV1.json','GA_ACQUISITION_RECALL_STAGE_REVIEW_REV2.json'],
 'Three wrappers and 21 symbolic registrations separate selected encoding, independent cue/rank, actual recollection, acquisition production and terminal owner batches. Empty selectors still allocate one selection, but empty/zero formation allocates no acquisition; actual positive evidence allocates once and owners reuse it. Body formation does not write graph/presentation. Unavailable rank still projects identity but reads no memory. Common-B0 terminal owners emit nothing; private protocol hooks are not cognition. Fifteen plus eight source events is a subtotal, not a whole-model ceiling. Fresh 13+13 original mutants reproduce both receipts. The first encoder-physical-read mutant actually changed writes; a true physical read passes REV1 and fails REV2. Identical labels do not establish identical coverage. No runtime boundary failure is inferred.')
add(['GA_PRIOR_CONCERN_STAGE_CLOSURE_REV1.md','GA_PRIOR_CONCERN_STAGE_CLOSURE_REV1.json','GA_PRIOR_CONCERN_STAGE_REVIEW_REV1.json'],
 'Seven symbolic stages retain TaskWorkspace40/Appraisal50/Concern50 and independently consumed encoding/recall deliveries at a strictly later instant. Actual completed parent and exact input/target/subject checks precede projection/content reads, including disabled and empty branches. Narrow carry cannot forward workspace/forecast; current encoding/rank replace baseline stages rather than execute twice. Three producer events plus at most two delivery events are not a whole-work bound. Thirteen component tests mentioned in prose are historical premises, not freshly executed here or AJB proof. Fresh 14 declaration mutants pass. Old visualFormationEvidence bytes are unavailable; their historical component-content authority is explicitly excluded.')
add(['GA_EVENT_PRESENTATION_STAGE_CLOSURE_REV1.md','GA_EVENT_PRESENTATION_STAGE_CLOSURE_REV1.json'],
 'Explicit immutable plan plus actual nonempty event recollection permits a two-event 130/140 presentation branch. Body recall, cue, rank, baseline, use alone and empty publication are excluded; unpresented recall remains comparator. Only presentation history changes, using validated memory loss descriptors rather than sibling reads. No occurrence allocation or retrospective rank change. Symbolic ownership/phase declarations and cited component capability are not public original/parent authentication, persistence or a new runtime execution.')
add(['GA_GOAL_ATTRIBUTION_STAGE_CLOSURE_REV1.md','GA_GOAL_ATTRIBUTION_STAGE_CLOSURE_REV1.json','GA_GOAL_ATTRIBUTION_STAGE_REVIEW_REV1.json'],
 'Thirteen stages and ten wrappers separate prospective goal lifecycle, recalled body baseline, safe consequence assessment, retained attribution, actual semantic use and later significance. Adoption enqueues deadline before terminal ownership; withdrawn deadline is unchanged. Winning payloads and observed trial contexts supply attribution, never hidden pairing or unselected memory reload. Frozen qualification is not recomputed after goal withdrawal. Validation, use and target are distinct; unavailable attribution may consume partial evidence. Local 3/4/5 event subtotals are not whole-work ceilings. REV1 explicitly leaves wholly absent consequence open; fresh 14 declaration mutants preserve that limitation. Positive/unavailable component examples did not settle absence.')
add(['GA_GOAL_ABSENT_CONSEQUENCE_RESOLUTION_REV1.md','GA_GOAL_ATTRIBUTION_STAGE_CLOSURE_REV2.json','GA_GOAL_ATTRIBUTION_STAGE_REVIEW_REV2.json'],
 'Forward symbolic absence correction: completed sensing without experience allocates no assessment, reads no goal and still sends authenticated explicit absence envelopes with SourceAt. Absent focus produces no attribution/use, while independently requested recall can run. Both actual absence deliveries complete the significance join without an owner operation; mixed absence/presence rejects. Missing/forged delivery remains an error, and real unavailable assessment/result remains an occurrence. Optional Consequence/Result/Join and carrier REV3 optional Carry preserve this distinction without synthetic IDs. Fresh 17 declaration mutants reproduce the corrected receipt; public execution and complete canonical packaging are separate gates, not proved here.')
add(['GA_RETENTION_STAGE_CLOSURE_REV1.md','GA_RETENTION_STAGE_CLOSURE_REV1.json'],
 'Immutable retention definition references existing memory/graph/association calibrations; it carries no desired survivor or hidden operand. Five symbolic events include original, dispatcher and three terminal owners. Memory and graph loss remain independent, same-instant formation/retention fold once against common B0, and presentation cleanup uses validated complete-loss descriptors without appending history. Retention does not enroll selection. The unresolved actual-presentation branch in this earlier packet is separately specified by the two-stage presentation packet. Neither packet itself proves public owner batching, ingress, codecs or persistence.')
prior=load(P/'campaign3-history-source-roles-rev149/index.json')
assert len(specs)==20 and not set(specs)&{r['path'] for r in prior['roleAssignments']}
archives={r['sha256']:r['path'] for r in prior['explicitBackingOutsideProseManifest']}
recovery=load(O/'source-recovery.json');assert not recovery['found'] and len(recovery['unavailable'])==2
chain=[];faults=0
for p in sorted(O.glob('GA_*STAGE_REVIEW_REV*.json')):
 v=load(p);assert v['status']=='PASS; SYMBOLIC DECLARATION REPLAY ONLY'
 original=load(v['original']['path']);assert v['faults']==original['faults'];faults+=len(v['faults'])
 for f in fps(v):assert ref(f['path'])==f
 chain.append(ref(p))
assert len(chain)==6 and faults==81
w=load(O/'read-guard-witness.json');assert [r['rejected'] for r in w['rows']]==[False,True,True,True]
for f in fps(w):assert ref(f['path'])==f
chain += [ref(O/n) for n in ['read-guard-witness.json','bindings.json','source-recovery.json']]
# These are symbolic packet cross-checks, not invented historical fault receipts.
ret=load(P/'GA_RETENTION_STAGE_CLOSURE_REV1.json');pres=load(P/'GA_EVENT_PRESENTATION_STAGE_CLOSURE_REV1.json')
assert [s['phase'] for s in ret['stages']]==[0,130,140,140,140] and ret['sliceEventSubtotal']==5
assert [s['phase'] for s in pres['stages']]==[130,140] and pres['sliceEventSubtotal']==2
for packet in [ret,pres]:
 assert packet['numericAllocations']==packet['newIdentityFamilies']==[]
 for s in packet['stages']:
  assert s['outputs']==[] and s['allocation']=='None'
  if s['phase']==140:assert s['next']==[] and s['reads']==s['writes'] and 'no sibling reads' in s['batch']
  else:assert s['reads']==s['writes']==[]
assert [s['writes'] for s in ret['stages'][2:]]==[['GeneralEpisodeState'],['GeneralAssociationState'],['GeneralPresentationState']]
assert pres['stages'][1]['writes']==['GeneralPresentationState']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SYMBOLIC GA STAGE HISTORY; DECLARATION COVERAGE AND LIMITS',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  if target:assert ref(target)['sha256']==f['sha256']
  else:assert any(x['path']==f['path'] and x['sha256']==f['sha256'] for x in recovery['unavailable'])
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target,status='EXACT' if target else 'EXCLUDED ORIGINAL COMPONENT CONTENT'))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  # Field grammars, stage identifiers/edges/root names and receipt bindings are backing.
  # Allocation, gates, projection, batch and scope prose remain material narrative.
  parts=ptr.split('/');typed=ptr.startswith(('/records/','/sources/','/faults/','/externalTargets/','/definitionKinds/')) or ptr=='/version'
  if len(parts)>3 and parts[1]=='stages':typed=parts[3] in ['name','input','outputs','next','future','reads','writes','route','childInput','consumer']
  narrative=u['source'].endswith('.md') or not typed
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA SYMBOLIC STAGE HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['81 original symbolic fault executions across six historical reviewers, plus four paired read/write outcomes. No new scheduler/component tests or public qualification.','First read fault actually mutated writes; forward validator closes that coverage gap. No runtime vulnerability inferred.','Two exact old component snapshots unavailable after local all-ref Git and newline checks. Current code is not substituted for historical content authority.','Historical presentation/retention component execution and concern test counts remain cited claims, not newly verified tests here. Later component/carrier/whole-package history and final authority adequacy remain open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['resolvedPath'] is not None for x in bindings),unavailableBindings=sum(x['resolvedPath'] is None for x in bindings),freshSymbolicFaultExecutions=faults,freshPairedReadWriteOutcomes=4,newRuntimeExecutions=0,recoveredArtifacts=0,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
