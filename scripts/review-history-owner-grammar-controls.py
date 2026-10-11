"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-owner-grammar-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev274/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'GA_ATTRIBUTION_PRODUCTION_REVIEW_REV1': 'Eight controls reject allocation without consequence, reused consequence identity, dropped partial consumption when unavailable, treating every consumed item as target, leaked operand memory, result replay, observer-as-subject and current focal input. Actual use, focal target and supported attribution differ. PRJ/IDN and recalled/focal membership remain upstream; component owns neither memory state nor public codec.', 'GA_CANONICAL_PRODUCTION_REVIEW_REV1': 'Eight controls preserve prior recall, unique acquisition, correct observer/partition, erasure of retention wrapper metadata, one acquisition allocation, distinct selection/acquisition and safe context. Actual record relations, compiled identity roles and public authentication/activation are not established by structural acceptance.', 'GA_PRIMITIVE_GRAMMAR_REVIEW_REV1': 'Four controls reject noncanonical rationals, floating-point unit comparison, version self-admission and nonexistent phase150. Primitive legality is separate from record relations, identity roles, compiled context and public admission. No owned memory state or public codec is introduced.', 'GA_ROLE_EMPTY_SOURCE_REVIEW_REV1': 'Five controls preserve absent role channel, no-detection and no-eligible source execution, exclusion of world referents and positive-versus-no-detection distinction. Actual SEM-B role projection still relies on fixture world/channel declarations. Selection audit identity, PRJ/owner joins and public governance remain separate. Repeated test source binding is not independent evidence.', 'GA_SOURCE_OWNER_INTEGRATION_REVIEW_REV1': 'Nine controls forbid bridging missing cues, ignoring new before/glyph changes or after-end, repeated observation, reset of old significance, skipped owner retention and fresh injected credit. Baseline-cache mutation targets fixture integration, not a qualified public baseline reader. Three baseline reports remain exact independent bindings; controlled owners do not establish public persistence.', 'GA_WRITE_SCOPE_COMPONENT_REVIEW_REV1': 'Four controls reject sibling-root writes, wrong authority, learning-family substitution and read-only writer. Exact-model gate remains separate: structural codec and local scope enforcement do not prove actual source authentication, compiled context or model activation.', 'GA_PRIOR_FEEDBACK_CARRIER_REVIEW_REV1': 'Eight symbolic controls reject nested forecast carry, goal-as-concern, invented unavailable occurrence, new delivery identity, source reaching encoder, implicit cache, known-zero collapse and inferred persistent affect. Eight-record structural carrier review is not actual same-run parent/subject/output authentication.', 'GA_PRIOR_FEEDBACK_CARRIER_REV1': 'Symbolic eight-record candidate uses existing concern1130, character1002, observer1000 and TaskConcernResponse386. ActualConcernCarry and NoConcernAvailable are distinct union arms; no concern occurrence is invented for no selected task. Delivery targets an original address but must come from completed same-run parent, never original ingress. Strict prior time, selected-only encoder inputs and separate status/branch survive equal multipliers. No storage or new identity families. Feedback stays trace-side; durable children retain historical encoding, not later concern/goal/persistent affect. Declared invariants await separate runtime authentication; Candidate A bounds0..1 and1..2 do not settle a general law.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_SPATIAL_BINDING_CHECKPOINT.md','GENERAL_ATTENTION_REQUESTED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_COMBINED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_BOUNDED_PERCEPTION_CHECKPOINT.md','GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/baseline/','/baselines/','/records/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='STORED OWNER GRAMMAR FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else [])+v.get('baselines',[]):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[8,8,4,5,9,4,8,0]
carrier=load(P/'GA_PRIOR_FEEDBACK_CARRIER_REV1.json')
assert len(carrier['records'])==8 and carrier['storage']==[] and carrier['newIdentityFamilies']==[]
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
save('unresolved.json',dict(searchScope='Current named files and REV274 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='EIGHT OWNER/GRAMMAR/CARRIER SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS OWNER GRAMMAR HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
