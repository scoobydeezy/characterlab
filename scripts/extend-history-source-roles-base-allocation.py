"""REV37 adds base allocation policies, preserving old roles."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev37'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
base=P/'campaign3-history-source-roles-rev36/index.json';rp=P/'campaign3-history-base-allocation-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_BASE_ALLOCATION_POLICY_REVIEWED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len({x['occurrenceId'] for x in r['rows']})==30
v['version']='campaign3-history-source-roles/0.37';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=4
v['originalNarrativeOrFindingOccurrences']+=26
v['backingBreakdown']['baseAllocationPolicies']=4
v['rules'].append('REV37 adds8 base/VAL/probe/multisource policy originals/archives:26 narrative,4 backing,2850 strings,24 bindings,15 archive joins.100 base/VAL and240 historical probe specification checks;no runtime qualification. Exact probe authority digest recovered separately from Git provenance.')
v['explicitBackingOutsideProseManifest'].append(dict(**ref(P/'campaign3-history-base-allocation-rev1/REGULATORY_DIAGNOSTIC_PROBE.historical.md'),role='EXACT HISTORICAL PROBE AUTHORITY DEPENDENCY; DIGEST-VERIFIED RECONSTRUCTION, NOT WHOLE SEMANTIC REVIEW',evidence=ref(rp)))
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
