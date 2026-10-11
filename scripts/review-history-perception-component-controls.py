"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-perception-component-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev268/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'BOUNDED_PERCEPTION_SOURCE_REVIEW_REV1': 'Eleven stored mutations cover ambiguous-glyph continuity, namespace collisions, file/event ceilings, preview aliasing, source-window commit, panel closure, unsampled context, publication and pre-binding experience reservation. Source/window controls do not authenticate public state or full-prefix restoration. Runtime and compiled schedule retain replay protection and ten-sweep admission. Later GA still excludes public missing-glyph/position cases; component tests do not close those exclusions.', 'BOUNDED_PERCEPTION_SOURCE_REVIEW_REV2': 'The same eleven controls bind changed panel implementation/test and reviewer bytes; unchanged controls are not eleven additional independent phenomena. Single-window ownership, closure and pre-binding reservation remain explicit. Later GA public qualification is bounded; missing glyph/position remain public exclusions, not automatically discharged by these controls.', 'CANONICAL_CHILD_KEY_REVIEW_REV1': 'Five controls preserve canonical ordering, remove survivor/loss temporary labels, detach decoded keys and retain work bounds. Input roles, subject and actual producer remain upstream obligations. No new canonical namespace or psychological retention law is established by a key adapter.', 'CANONICAL_VISUAL_SELECTION_REVIEW_REV1': 'Four controls preserve a single view occurrence, retain ineligible selection audit, detach audit/view and prohibit acquisition identity as selection source. The source list repeats the same composition-test path/hash: five binding occurrences are only four distinct path/hash pairs. Actual component production and fixture linkage do not establish registered public completion, body audit, PRJ/IDN or formation-hook admission.', 'COMBINED_OBSERVATION_REVIEW_REV1': 'Seven controls preserve all-source reservation, visual-only events, unavailable visual evidence, independent actor roles, freeze-before-publication and distinct panel/body tags. Actor cannot be inferred from position. Trusted lane/source/allocator and explicit all-three sampling do not qualify PRJ, completion, persistence, public requests or actual role channels.', 'GENERAL_SOURCE_OPPORTUNITY_REVIEW_REV1': 'Six controls reject unrequested panel/scene sampling, extra body experience, slot reuse, early perception publication and erased observed roles. Actual multimodal composition is not public registration, allocator rollback or whole-source qualification.', 'GENERAL_SOURCE_ROLES_REVIEW_REV1': 'Four controls prevent reservation on unresolved role, placeholder reuse, assumed contiguous slots and duplicate allocation. Actual SEM-G outputs do not prove public producer matching. No new role mathematics, identity family or state authority follows.', 'GENERAL_SOURCE_SCHEDULE_REVIEW_REV1': 'Four controls preserve separate selector slots, cue independence from encoding, prior rather than current goal assessment and nonoverlapping lifecycle assessment. Compiled schedule controls do not qualify actual source coverage, work ceilings, identities or runtime completion.', 'REQUESTED_SOURCE_SAMPLING_REVIEW_REV1': 'Five controls prevent unrequested panel/visual sampling, erased unavailable observation, cross-modality duplicates and omitted body in combined sampling. Unrequested is not observed unavailable. Pure explicit-request checks do not qualify enclosing allocator rollback or public model/registration.', 'SELECTED_BODY_CONTEXT_REVIEW_REV1': 'Seven controls preserve empty selector occurrence, reject missing required sample rather than invent unavailable evidence, keep view/experience/acquisition identities separate, require proper panel support, detach context and exclude undeclared fields. Trusted fixture memory/PRJ and selected capability do not qualify unallocated codecs or public gates.', 'SELECTED_BODY_CONTEXT_REVIEW_REV2': 'Eight controls retain the earlier seven and add rejection of an unfrozen experience producer. Updated context source/test and reviewer bytes are distinct. This correct-forward extra check cannot be credited to REV1. Canonical fixture payload and PRJ remain trusted component boundaries until separate public qualification.', 'SELECTED_SPATIAL_CAPABILITY_REVIEW_REV1': 'Four controls enforce one use and closure, discard source resolver after preparation and prevent unselected witness transport. Trusted preparation remains distinct from selected-only downstream capability; no public authentication, codec, projection, scheduler or save qualification follows.', 'SELECTED_SPATIAL_ENCODING_REVIEW_REV1': 'Nine controls reject index-based joins, missing event detection/current support, unbound tracks, role-as-spatial-attention, unknown-as-zero, ignored experience or selected-binding bytes and reusable failed joins. Structural SEM linkage and actual selected capability do not authenticate source completion or public owner registration. Unknown spatial evidence remains distinct from numeric zero.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_SPATIAL_BINDING_CHECKPOINT.md','GENERAL_ATTENTION_REQUESTED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_COMBINED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_BOUNDED_PERCEPTION_CHECKPOINT.md','GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/baseline/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v['faults'])
 faults.append(dict(source=p,count=len(v['faults']),controls=v['faults']))
 sources.append(dict(**ref(p),role='STORED PERCEPTION COMPONENT FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[11,11,5,4,7,6,4,4,5,7,8,4,9]
rows=[]; selected={s['path'] for s in sources}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named files and REV268 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='THIRTEEN PERCEPTION COMPONENT CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS PERCEPTION COMPONENT HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
