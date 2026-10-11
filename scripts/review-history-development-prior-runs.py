"""Exact same-context transport of final schema review to eight earlier run records."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-prior-runs-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def normalize(v):
 x=copy.deepcopy(v);x.pop('planSha256')
 for r in x['prefixes']:r.pop('planSha256');r.pop('preservedPrefix',None)
 return x
def strings(v):
 if isinstance(v,dict):return sum(strings(x) for x in v.values())
 if isinstance(v,list):return sum(strings(x) for x in v)
 return int(isinstance(v,str))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};finalReview=P/'campaign3-history-development-runs-rev1/review.json';reviewed={r['path']:r for r in load(finalReview)['sourceRoles']};roles=[];count=0
for rev in [1,2]:
 finding=P/f'DEVELOPMENT_PUBLIC_HARNESS_REV{rev+1}_FINDING.json';evidence={f['path']:f['sha256'] for f in load(finding)['files']}
 plan=P/f'DEVELOPMENT_PUBLIC_PLAN_REV{rev}.json';roster=load(plan)['runs']
 for i in range(4):
  path=P/f'DEVELOPMENT_PUBLIC_RUN_{i}_REV{rev}.json';final=P/f'DEVELOPMENT_PUBLIC_RUN_{i}_REV3.json';v=load(path);f=load(final)
  assert sha(path)==entries[path.as_posix()]['sha256']==evidence[path.as_posix()]
  assert sha(final)==reviewed[final.as_posix()]['sha256'];assert v['planSha256']==sha(plan)
  for k in ['name','modelIdentity','runIdentity']:assert v[k]==roster[i][k]
  assert set(v)==set(f) and normalize(v)==normalize(f)
  assert len(v['prefixes'])==19
  for at,prefix in enumerate(v['prefixes']):assert prefix==load(P/f'development-public-prefixes-rev{rev}/{i}-{at}.json')
  count+=strings(v)
  roles.append(dict(**ref(path),role='WHOLE EARLIER RUN; SAME-CONTEXT SCHEMA TRANSPORT',judgment='Exact final row/trace/address/identity equality; only plan commitment and already-reviewed prefix provenance differ. Earlier four-program receipt is not full36-program qualification or added coverage.',acceptanceChain=[ref(finding),ref(path)],schemaEvidence=[ref(finalReview),ref(final)]))
selected={r['path'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in selected:rows.append(u)
assert not rows
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
v=dict(status='EIGHT EARLIER DEVELOPMENT RUNS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=[],stringLeaves=count,obligations=obs,limits=['Four programs per old harness, not complete old36-run cohorts.','Exact contextual equality permits shared schema analysis while preserving every original source identity.','No fresh execution, no retrospective pre-execution claim, no new unique behavioral coverage.'])
save(O/'review.json',v);save(O/'check.json',dict(status=v['status'],sources=8,stringLeaves=count,originalOccurrences=0,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__)))
base=P/'campaign3-history-source-roles-rev12/index.json';index=load(base);existing={r['path']:r for r in index['roleAssignments']}
for r in roles:assert r['path'] not in existing;existing[r['path']]=dict(**r,category='WHOLE_PRIOR_DEVELOPMENT_RUN_SCHEMA_REVIEWED',evidence=[ref(O/'review.json')])
index['version']='campaign3-history-source-roles/0.13';index['predecessor']=ref(base);index['roleAssignments']=[existing[p] for p in sorted(existing)];index['unassignedCandidatePaths']=sorted(set(entries)-set(existing));index['reviewedInputs'].append(ref(O/'review.json'))
index['rules'].append('REV13 adds eight earlier development runs through exact same-context row/trace/address equality with reviewed final runs; distinct plan/prefix provenance retained. No extra qualification coverage.')
out=P/'campaign3-history-source-roles-rev13';out.mkdir(exist_ok=True);save(out/'index.json',index);save(out/'check.json',dict(status=index['status'],assignedSources=len(existing),unassignedWithinThisIndex=len(index['unassignedCandidatePaths']),originalNarrativeOrFindingOccurrences=index['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=index['originalBackingFieldOccurrences'],indexSha256=sha(out/'index.json'),checkerSha256=sha(__file__)))
print(json.dumps(load(O/'check.json')));print(json.dumps(load(out/'check.json')))
