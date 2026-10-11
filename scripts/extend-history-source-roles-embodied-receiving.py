"""REV133 reconciles bounded receiving behavior, failure evidence and exact predecessor sources."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev133'
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
base=P/'campaign3-history-source-roles-rev132/index.json';rp=P/'campaign3-history-embodied-receiving-rev1/review.json'
v=load(base);r=load(rp);roles={x['path']:x for x in v['roleAssignments']}
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']}
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and sha(p)==s['sha256']==entries[p]['sha256']
 for a in s['acceptanceChain']:assert sha(a['path'])==a['sha256']
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_EMBODIED_RECEIVING_BEHAVIOR_REVIEWED',role=s['role'],scope=s['judgment'],evidence=[ref(rp)],acceptanceChain=s['acceptanceChain'])
assert len({x['occurrenceId'] for x in r['rows']})==len(r['rows'])
c=load(rp.parent/'check.json')
v['version']='campaign3-history-source-roles/0.133';v['predecessor']=ref(base)
v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs'].append(ref(rp))
v['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
v['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences']
v['backingBreakdown']['embodiedReceivingBehavior']=c['originalBackingOccurrences']
for a in r['preservedArtifacts']:
 assert sha(a['path'])==a['sha256']
 if a['path'] not in entries and not any(x['path']==a['path'] for x in v['explicitBackingOutsideProseManifest']):
  v['explicitBackingOutsideProseManifest'].append(dict(**a,role='EXACT PRESERVED FAILED AUTO COHORT OR HISTORICAL HELPER SOURCE; SEE REVIEW FOR PROVENANCE',evidence=ref(rp)))
v['rules'].append('REV133 reconciles receiving claim spine with fresh28 runs/196 artifacts/86 full-tail prefix restores,27 tests,20 mutants and59 association checks. Failed Auto cohort preserved;3 Git source recoveries and2 exact SHA reconstructions are distinct. Historical1137/328 test composition is not fresh. Inherited body and later MULTISOURCE/GA audits remain open.')

O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
