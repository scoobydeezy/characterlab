"""REV48 adds cognitive freeze authority, preserving old roles."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev48'
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
base=P/'campaign3-history-source-roles-rev47/index.json';rp=P/'campaign3-history-ga-predecessor-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_GA_PREDECESSOR_AUTHORITY_REVIEWED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len({x['occurrenceId'] for x in r['rows']})==27
v['version']='campaign3-history-source-roles/0.48';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=4
v['originalNarrativeOrFindingOccurrences']+=23
v['backingBreakdown']['gaPredecessor']=4
v['rules'].append('REV48 adds6 predecessor/correction sources:23 narrative,4 backing,3480 string leaves.35 accepted identities/247 images preserved;rejected aliases and required-S0 correction verified. Two historical implementation source hashes remain explicitly unresolved,not substituted.')
for name in ['materialize-general-attention-models.mjs','freeze-general-attention-models.mjs']:
 v['explicitBackingOutsideProseManifest'].append(dict(**ref(P/'campaign3-history-ga-predecessor-rev1'/name),role='EXACT DIGEST-CONSTRAINED HISTORICAL SCRIPT; NOT GIT PROVENANCE',evidence=ref(P/'campaign3-history-ga-predecessor-rev1/predecessor-image-check.json')))
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
