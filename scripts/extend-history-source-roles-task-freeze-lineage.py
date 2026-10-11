"""Preserve prior assignments while adding four task freeze lineage sources."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning'); O=P/'campaign3-history-source-roles-rev290'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
base=P/'campaign3-history-source-roles-rev289/index.json'; rp=P/'campaign3-history-task-freeze-lineage-rev1/review.json'
v=load(base); r=load(rp); c=load(rp.parent/'check.json'); roles={x['path']:x for x in v['roleAssignments']}
for s in r['sourceRoles']:
 assert s['path'] in v['unassignedCandidatePaths'] and ref(s['path'])['sha256']==s['sha256']
 for a in s['acceptanceChain']: assert ref(a['path'])==a
 roles[s['path']]=dict(path=s['path'],sha256=s['sha256'],category='TASK_FREEZE_LINEAGE_HISTORY_RECONCILED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
v['version']='campaign3-history-source-roles/0.290';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)]
v['unassignedCandidatePaths']=[p for p in v['unassignedCandidatePaths'] if p not in roles]
v['reviewedInputs'].append(ref(rp));v['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences']
v['backingBreakdown']['taskFreezeLineageHistory']=c['originalBackingOccurrences']
v['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
manifestPaths={e['path'] for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for a in r['preservedArtifacts']:
 assert a['path'] not in manifestPaths
 assert ref(a['path'])['sha256']==a['sha256']
 assert not any(x['path']==a['path'] for x in v['explicitBackingOutsideProseManifest'])
 v['explicitBackingOutsideProseManifest'].append(dict(path=a['path'],sha256=a['sha256'],role=a['method'],evidence=ref(rp)))
v['rules'].append('REV290 preserves four task declaration/freeze sources:192 stored construction identities, derived17-event budget and five identical model/control files across three copies.623 exact bindings/two missing historical construction sources; lifecycle qualification separately scoped.')
O.mkdir(exist_ok=True)
def save(n,value):
 p=O/n
 if p.exists(): assert load(p)==value,p
 else:p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
save('index.json',v)
c=dict(status=v['status'],candidateFiles=len(roles)+len(v['unassignedCandidatePaths']),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=ref(O/'index.json')['sha256'],checkerSha256=ref(__file__)['sha256'])
save('check.json',c); print(json.dumps({k:v for k,v in c.items() if k!='byCategory'}))
