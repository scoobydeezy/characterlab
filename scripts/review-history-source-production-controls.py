"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-source-production-controls-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev271/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'MARKER_WINDOW_SOURCE_REVIEW_REV1': 'Five stored mutations cover ambiguous-glyph false continuity, namespace collision, file ceiling, preview alias and source-window commit. Component windows do not establish public state admission, whole-prefix restore, source replay protection or compiled ten-sweep admission. Later GA missing-glyph/position public exclusions remain explicit.', 'TRANSACTIONAL_MARKER_TRACKING_REVIEW_REV1': 'Eight component tests and nine retained tests accompany seven detected mutations. Provisional preview, complete input-prefix reconstruction, manager ownership, committed tracker, single pending proposal and detached caller prefix/input are distinct requirements. Nine prefix/suffix comparisons are component input replay, not authenticated originals or public save equality. Later public adapter must bind actual canonical reads and commit/abort to scheduler outcome. Removed/inserted strings are inert mutation descriptions, including empty insertion; no new persistent root or allocation follows.', 'TRIAL_PANEL_SOURCE_REVIEW_REV1': 'Four detected controls preserve permission, visibility, absence without last-display fallback and observed zero. Controlled display production is not public observation or identity authentication.', 'TRIAL_PANEL_SOURCE_REVIEW_REV2': 'Same four controls bind changed source/reviewer and position-pair baseline. Repeated test names do not merge source versions or add independent phenomena. Denied/absent display is not stale evidence; zero remains an observed value. Public production/identity authentication remains separately required.', 'PANEL_BODY_OPPORTUNITY_REVIEW_REV1': 'Seven controls permit either source without requiring both, preserve absent-body versus support, keep panel support, reserve one shared experience before publication, detach returned context and reject stale candidates. Duplicate-reservation fault consumes an extra shared allocator slot and is detected by exact branch count. Trusted source/lane/allocator is not PRJ/completion/persistence proof.', 'POSITION_DISPLAY_SOURCE_REVIEW_REV1': 'Seven controls distinguish visibility and permission, prohibit stale/live frame aliasing, preserve zero and prevent hidden start/end reconstruction. Two mutations target fixture coordination, not production admission. No public observation/selection/PRJ authentication follows.', 'POSITION_SCENE_SOURCE_REVIEW_REV1': 'Five controls preserve visibility, unresolved roles, truth-marker isolation, observed rather than authored ordering and collision-free world bindings. Actual SEM world materialization and safe multi-item projection still rely on compiled scene-object membership. Observation/detection, public registration and persistence remain separate. Repeated source and test bindings are preserved occurrences, not additional distinct sources.', 'POSITION_SCENE_OPPORTUNITY_REVIEW_REV1': 'Four controls preserve unique batch binding slots, publication after preparation, genuine experience reservation and actual source role. Actual scene/SEM/selection/encoding composition does not qualify enclosing allocator rollback, PRJ, content membership or original-prefix validation. Duplicated source/test bindings do not inflate distinct-source evidence.', 'NINE_SWEEP_MARKER_REVIEW_REV1': 'Four controls retain old horizon while admitting the new ninth sweep, cap three detections and reject replay under the old profile. Nine times three yields a bounded27-file union, contingent on public source closure; no arbitrary preloaded graph is admitted. The successor does not silently expand old profile semantics.', 'TENTH_SOURCE_INTEGRATION_REVIEW_REV1': 'Four controls preserve competitor absence, actual rather than literal competing payload, tenth sweep admission and three-detection bound. Ten times three yields30, distinct from prior27. Actual tenth observation/positive encoding still relies on component world/channel/source-audit declarations; later use remains a supplied comparator, not authenticated public downstream use. Duplicate composition-test binding is one distinct source.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_SPATIAL_BINDING_CHECKPOINT.md','GENERAL_ATTENTION_REQUESTED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_COMBINED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_BOUNDED_PERCEPTION_CHECKPOINT.md','GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/baseline/','/testEvidence/','/preserved/')) or q.endswith(('/from','/to','/removed','/inserted')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v['faults'])
 faults.append(dict(source=p,count=len(v['faults']),controls=v['faults']))
 sources.append(dict(**ref(p),role='STORED SOURCE PRODUCTION FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+[v[k] for k in ['baseline','testEvidence','preserved'] if k in v]:
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[5,7,4,4,7,7,5,4,4,4]
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
save('unresolved.json',dict(searchScope='Current named files and REV271 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='TEN SOURCE PRODUCTION CONTROL RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SOURCE PRODUCTION HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),storedDetectedControlOccurrences=sum(f['count'] for f in faults),exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
