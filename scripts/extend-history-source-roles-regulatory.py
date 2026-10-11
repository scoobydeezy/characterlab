"""Successor role index:68 fully inspected regulatory backing sources."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev4'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=p.as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
base=P/'campaign3-history-source-roles-rev3/index.json';rp=P/'campaign3-history-regulatory-backing-rev1/review.json';r=load(rp);v=load(base)
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']};roles={x['path']:x for x in v['roleAssignments']}
assert not r['originalOccurrenceIds'] and r['originalBackingOccurrences']==0
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and entries[p]['sha256']==s['sha256']==sha(p)
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_CLOSED_SCHEMA_TRAJECTORY_ROLE_REVIEWED',role=s['role'],evidence=[ref(rp)],scope=r['disposition']+' '+r['limits'][0])
v['version']='campaign3-history-source-roles/0.4';v['predecessor']=ref(base);v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['rules'].append('REV4 accounts all20200 strings in68 regulatory source/native receipts, including1536 exact serialized expression records omitted by extraction. Original narrative/backing occurrence totals unchanged; new role completeness is not a new scientific verdict.')
v['limits'].append('Regulatory metadata plans/results/closures are not silently included by this source-role extension. Their separate narrative/metadata reconciliation remains open.')
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],addedSources=len(r['sourceRoles']),newOriginalOccurrences=0,indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
