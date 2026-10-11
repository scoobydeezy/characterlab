"""REV151 reconciles goal carriers and narrow qualification projection."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev151'
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
base=P/'campaign3-history-source-roles-rev150/index.json';rp=P/'campaign3-history-ga-goal-carriers-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_GA_GOAL_CARRIER_HISTORY_REVIEWED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len({x['occurrenceId'] for x in r['rows']})==len(r['rows'])
c=load(rp.parent/'check.json')
v['version']='campaign3-history-source-roles/0.151';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
v['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences']
v['backingBreakdown']['gaGoalCarrierHistory']=c['originalBackingOccurrences']
for a in r['preservedArtifacts']:
 assert sha(a['path'])==a['sha256']
 assert not any(x['path']==a['path'] for x in v['explicitBackingOutsideProseManifest'])
 v['explicitBackingOutsideProseManifest'].append(dict(path=a['path'],sha256=a['sha256'],role=a['method']+'; original goal component commitment, not later public qualification',evidence=ref(rp)))
v['rules'].append('REV151 reviews14 goal carrier/projection sources. Two exact inventory reconstructions,24 structural faults,four projection mutants,42 current assertions containing all19 historical named assertions,and a point-versus-positive-width interval witness. One SHA-exact pre-deadline goal source reconstruction;29 exact bindings,no new unavailable source. Delayed qualification excludes numerical assessment; original index is not authority; REV3 absence differs from unavailable. No new public qualification or obligation closure; complete GA packaging and final HQ011 adequacy remain open.')

O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
