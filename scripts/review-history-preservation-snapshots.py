"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections, subprocess
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-preservation-snapshots-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev269/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'affect-retrieval-development-rev1/PRESERVATION': 'Preflight failure before any plan or result: inherited filename typo caused ENOENT; execution overlapped pending planning and emitted a port warning. Both historical sessions exited1, not live jobs. Later planning-before-execution fixes process order; no failed behavioral matrix case was removed.', 'control-development-rev1/PRESERVATION': 'Failed, never qualified integration reused frozen HABIT one-reason chain for two reasons. Four list-bound failures were not psychological control failures; earlier fifteen rollback/admission checks did not reach the loaded contest. Exact preserved allocation/contract/code remains distinct from control-public0.2 successor with two reasons and at most three draws. No inherited codec weakening or retroactive public PASS.', 'longitudinal-goal-development-rev1/PRESERVATION': 'Original failed NoFeedback inequality is retained with six other passing tests and initial build. Nonzero acquired standing can become zero effective coarse modifier: -100733/600733 to -167/1000 under unit1. Later FineStanding unit1/16 retains the coarse comparator; it earns bounded use, not universal calibration or necessity. Component composition remains separate from later native admission.', 'longitudinal-routine-development-rev1/PRESERVATION': 'Four case-sensitive historical path/hash entries preserve the first cohort, including text-versus-unsigned occurrence adapter rejection. Absolute original paths and uppercase hashes remain in original JSON; verification normalizes only local resolution/hash comparison. Captured bytes are not proof of behavioral success. Later receipt corrects forward without erasing this failure.', 'longitudinal-routine-development-rev2/PRESERVATION': 'Four entries preserve the second cohort after occurrence adapter correction; same test bytes accompany changed source/contract/test-result bytes. The mistaken must-resume-at14 assertion is retained. Full later horizon shows seed0 idle14 then resume15, not permanent non-resumption; no source/calibration change forced that witness. Scheduled availability does not guarantee enactment. Stored/Derived equality retains a cache in both, not cache-free compression.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_AFFECT_RETRIEVAL_QUALIFICATION.md','CAMPAIGN3_CONTROL_QUALIFICATION.md','CONTROL_IMPLEMENTATION_FINDINGS.md','CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md','CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md']]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'NARRATIVE' if q=='/status' or q=='/finding' or q.startswith('/findings/') else 'BACKING'
sources=[]; leaves=[]; bindings=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix();v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='PRESERVED FAILED DEVELOPMENT SNAPSHOT',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 artifacts=v if isinstance(v,list) else v.get('artifacts',v.get('files',[]))
 for x in artifacts:
  if 'Path' in x:
   actual=Path(x['Path']).relative_to(Path.cwd()).as_posix();want=x['Hash'].lower()
  else:actual=x.get('preserved',x.get('path'));want=x['sha256']
  assert ref(actual)['sha256']==want,(p,actual)
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FAILED DEVELOPMENT SOURCE; NO NEW COPY'));back.add(actual)
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
save('review.json',dict(status='FIVE FAILED DEVELOPMENT PRESERVATIONS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),limits=['Hash verification does not rerun historical tests or prove timestamps.','Failed cohorts remain separate from later bounded qualification. No model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DEVELOPMENT PRESERVATION HISTORY',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
