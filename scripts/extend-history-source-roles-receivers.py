"""Immutable REV3 source-role index: authenticated routine/habit/loss backing."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-source-roles-rev3'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=p.as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
base=P/'campaign3-history-source-roles-rev2/index.json';review=P/'campaign3-history-receiver-schemas-rev1/review.json'
v=load(base);r=load(review);entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles={x['path']:x for x in v['roleAssignments']}
newIds=set(r['originalOccurrenceIds']);assert len(newIds)==r['originalBackingOccurrences']
seen=set();counts=collections.Counter()
selected={s['path'] for s in r['sourceRoles']}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in selected:
   assert u['id'] in newIds;seen.add(u['id']);counts[u['source']]+=1
assert seen==newIds
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and entries[p]['sha256']==s['sha256']==sha(p)
 assert counts[p]==s['originalBackingOccurrences']
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_CLOSED_SCHEMA_TRAJECTORY_ROLE_REVIEWED',role=s['role'],evidence=[ref(review)],scope=r['disposition']+' '+r['limits'][0])
outside={a['path'] for a in v['explicitBackingOutsideProseManifest']}
for a in r['archives']:
 assert a['path'] not in entries and a['path'] not in outside and sha(a['path'])==a['sha256']
 v['explicitBackingOutsideProseManifest'].append(dict(path=a['path'],sha256=a['sha256'],role=a['role'],evidence=ref(review)))
v['version']='campaign3-history-source-roles/0.3';v['predecessor']=ref(base);v['roleAssignments']=[roles[p] for p in sorted(roles)]
v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(review))
v['originalBackingFieldOccurrences']+=len(newIds);v['backingBreakdown']['receiverSchemas']=len(newIds)
v['backingBreakdown']['note']='Distinct original lifecycle, comparator-label and test receipt occurrences; none counted as narrative findings or new experiments.'
v['upgradedPartialSources']=[]
v['rules'].append('REV3 adds only1952 frozen receiver/joined sources with explicit producer schemas, exact census/plan/matrix identity and original occurrence accounting;480 personal-loss archives stay outside the prose census.')
v['limits'].append('Schema classification does not exclude inconvenient scientific findings: accepted qualifications, failure cohorts and contract limitations remain separate reviewed narrative evidence. Wider source adequacy and provenance remain OPEN.')
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],addedSources=len(selected),addedOriginalBackingOccurrences=len(newIds),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
