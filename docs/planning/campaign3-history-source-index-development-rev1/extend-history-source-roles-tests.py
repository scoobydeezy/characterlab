"""Successor source index: typed test receipts and complete goal-trajectory schemas."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-source-roles-rev2'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=p.as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
basePath=P/'campaign3-history-source-roles-rev1/index.json';v=load(basePath)
testPath=P/'campaign3-history-late-tests-rev1/review.json';tests=load(testPath)
goalPath=P/'campaign3-history-goal-trajectory-schema-rev1/review.json';goals=load(goalPath)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles={r['path']:r for r in v['roleAssignments']}
for r in tests['sourceRoles']:
 assert r['path'] not in roles and entries[r['path']]['sha256']==r['sha256']
 roles[r['path']]=dict(path=r['path'],sha256=r['sha256'],category='WHOLE_TYPED_TEST_BACKING_ROLE_REVIEWED',role=r['role'],evidence=[ref(testPath)],scope=r['acceptance']+' '+r['limits'])
upgrades=[]
for r in goals['sourceRoles']:
 old=roles[r['path']];assert old['sha256']==r['sha256']==entries[r['path']]['sha256']
 assert old['category']=='PARTIAL_FIELD_ROLE_REVIEWED'
 upgrades.append(dict(path=r['path'],priorCategory=old['category'],priorScope=old['scope']))
 roles[r['path']]=dict(path=r['path'],sha256=r['sha256'],category='WHOLE_CLOSED_SCHEMA_TRAJECTORY_ROLE_REVIEWED',role=r['role'],evidence=old['evidence']+[ref(goalPath)],scope=r['disposition']+' '+r['limits'])
oldIds=set(goals['originalOccurrenceIds']);newIds={r['occurrenceId'] for r in tests['rows']};assert not oldIds&newIds
seen=set()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['id'] in oldIds|newIds:seen.add(u['id'])
assert seen==oldIds|newIds
unassigned=sorted(set(entries)-set(roles));assert len(roles)+len(unassigned)==len(entries)
v['version']='campaign3-history-source-roles/0.2';v['predecessor']=ref(basePath);v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=unassigned
v['upgradedPartialSources']=upgrades;v['reviewedInputs']+= [ref(testPath),ref(goalPath)]
v['originalBackingFieldOccurrences']=len(seen)
v['backingBreakdown']=dict(goalLifecycle=len(oldIds),testReceipts=len(newIds),note='Original goal lifecycle IDs reused once; test titles/diagnostics are backing, not added to narrative/finding counts.')
v['rules'].append('REV2 upgrades only the120 explicitly reviewed parent schemas and adds19 typed test-receipt sources; failed aliases retain original identities and do not count as independent failures.')
v['limits'].append('No partial parent source remains within the assigned set, but unassigned candidates and wider adequacy are still open. Removing PARTIAL here does not qualify a scientific or native scope.')
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),byCategory=dict(collections.Counter(r['category'] for r in roles.values())),unassignedWithinThisIndex=len(unassigned),explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=len(seen),upgradedPartialSources=len(upgrades),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
