"""REV102 adds cognitive freeze authority, preserving old roles."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev102'
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
base=P/'campaign3-history-source-roles-rev101/index.json';rp=P/'campaign3-history-craving-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
newPaths={s['path'] for s in r['sourceRoles'] if s['path'] not in roles}
for s in r['sourceRoles']:
 p=s['path'];assert sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 if p not in newPaths:continue
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_CRAVING_AUTHORITY_REVIEWED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len({x['occurrenceId'] for x in r['rows']})==len(r['rows'])
c=load(rp.parent/'check.json');fresh=[x for x in r['rows'] if x['source'] in newPaths]
c['originalBackingOccurrences']=sum(x['role'].startswith('TYPED') for x in fresh)
c['originalNarrativeOccurrences']=sum(x['role'].startswith('NARRATIVE') for x in fresh)
v['version']='campaign3-history-source-roles/0.102';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
v['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences']
v['backingBreakdown']['cravingAuthority']=c['originalBackingOccurrences']
v['rules'].append('REV102 reviews12 craving sources, adds11 new roles; original BODY source role/counters retained without double counting. Historical runtime commitment authenticated from archive separately from fresh current BODY compatibility and component replay. Preserve source-drift rejection, pre-freeze alias assertion failure and urge/access/eligibility/action distinctions.')
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
