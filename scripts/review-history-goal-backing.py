"""Classify lifecycle labels from one authenticated result schema, never by keyword alone."""
from pathlib import Path
import json, hashlib, re, copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-goal-backing-rev1'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=load(B/'manifest.json');entries={e['path']:e for e in manifest['entries']}
plan=P/'LONGITUDINAL_GOAL_PLAN_REV1.json';pv=load(plan);planHash=sha(plan)
matrix=P/'LONGITUDINAL_GOAL_MATRIX_REV1.json';mv=load(matrix)
assert mv['planSha256']==planHash
artifacts={a['path']:a['sha256'] for a in mv['artifacts']}
files={};bindings=[]
for i,identity in enumerate(pv['runs']):
 p=P/'longitudinal-goal-execution-rev1'/f'{i:03}.json';key=p.as_posix();v=load(p)
 assert sha(p)==entries[key]['sha256']==artifacts[key]
 assert v['planSha256']==planHash
 for k,x in identity.items():assert v[k]==x
 files[key]=v;bindings.append(dict(path=key,sha256=sha(p)))
assert len(files)==120
pattern=re.compile(r'^/state/(?:goals/\d+|rows/\d+/goals(?:Before|After)/\d+)/status$')
rows=[];counts={}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in files or not pattern.fullmatch(u['location'].get('pointer','')):continue
  pointer=u['location']['pointer'];parts=pointer.strip('/').split('/');node=files[u['source']]
  for k in parts[:-1]:node=node[int(k)] if isinstance(node,list) else node[k]
  assert set(node)=={'id','status','adoptedAt','changedAt','activeFrom','expiresAt','desired'}
  assert node['status']==u['text'] and node['status'] in ['Open','Withdrawn','Expired']
  assert node['id'] in ['original','replacement']
  for k in ['adoptedAt','changedAt','activeFrom','expiresAt']:assert re.fullmatch(r'\d+',node[k])
  assert node['desired'] in ['0/1','1/1']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='BACKING_GOAL_LIFECYCLE_VALUE',rationale='Typed MaintenanceGoal status projected by goalView into the authenticated trajectory. Open means live character goal, not unresolved research. Retain as experimental evidence; no new prose finding or exclusion of the trajectory.'))
  counts[u['text']]=counts.get(u['text'],0)+1
assert rows and len({r['occurrenceId'] for r in rows})==len(rows)
sources=['src/campaign3/bodilyMaintenanceGoal.ts','src/campaign3/longitudinalGoal.ts','scripts/qualify-longitudinal-goal.mjs','scripts/check-longitudinal-goal-matrix.mjs']
v=dict(status='SCOPED BACKING-ROLE REVIEW; WIDER HQ011 OPEN',rows=rows,counts=counts,files=bindings,sourceSchema=[dict(path=p,sha256=sha(p)) for p in sources],evidence=[dict(path=p.as_posix(),sha256=sha(p)) for p in [plan,matrix]],obligations=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Only goal lifecycle fields in120 plan-bound trajectory files; other JSON prose and labels remain unclassified by this review.','Missing short strings elsewhere require schema review; this does not alter the frozen extraction or automatically exclude all OPEN tokens.','No production execution or full matrix rerun; file/plan/receipt bindings reverified read-only.'])
def validate(x):
 assert x==v
 for r in x['rows']:assert r['role']=='BACKING_GOAL_LIFECYCLE_VALUE'
faults=[]
for name in ['research-open-confusion','drop-occurrence','widen-scope']:
 x=copy.deepcopy(v)
 if name=='research-open-confusion':x['rows'][0]['role']='UNRESOLVED_RESEARCH'
 elif name=='drop-occurrence':x['rows'].pop()
 else:x['limits']=[]
 try:validate(x)
 except AssertionError:faults.append(name)
 else:raise AssertionError(name)
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],backingOccurrences=len(rows),trajectoryFiles=len(files),valueCounts=counts,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
