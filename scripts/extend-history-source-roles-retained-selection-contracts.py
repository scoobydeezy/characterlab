"""REV178 reconciles cognitive contracts and packaging requirements."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev187'
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
base=P/'campaign3-history-source-roles-rev186/index.json';rp=P/'campaign3-history-retained-selection-contracts-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 roles[p]=dict(path=p,sha256=s['sha256'],category='HISTORICAL_COGNITIVE_CONTRACT_SCOPE_RECONCILED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len(r['sourceRoles'])==9
c=load(rp.parent/'check.json')
v['version']='campaign3-history-source-roles/0.187';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
v['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences']
v['backingBreakdown']['retainedSelectionContracts']=c['originalBackingOccurrences']
for a in r['preservedArtifacts']:
 assert sha(a['path'])==a['sha256']
 assert not any(x['path']==a['path'] for x in v['explicitBackingOutsideProseManifest'])
 v['explicitBackingOutsideProseManifest'].append(dict(path=a['path'],sha256=a['sha256'],role=a['method']+'; exact historical source binding, not fresh execution or historical timestamp proof',evidence=ref(rp)))
v['rules'].append('REV187 reconciles nine selection/retained-attribution/grouping/association-settlement contracts:63 original narrative occurrences. Prior independent-association review rebound with exact evidence, not counted twice; duplicate-scope checker guard preserved. Validation is not semantic use; incomplete/unsupported is not negative causation; temporary context/order and graph clock invariants retained. Public qualification scope remains separate; no source/runtime/obligation change.')

O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps({k:v for k,v in c.items() if k!='byCategory'}))
