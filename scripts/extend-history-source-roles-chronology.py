"""Assign the final frozen census source without claiming scientific adequacy."""
from pathlib import Path
from functools import cache
import json,hashlib
P=Path('docs/planning'); O=P/'campaign3-history-source-roles-rev314'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
base=P/'campaign3-history-source-roles-rev313/index.json'
rp=P/'campaign3-history-chronology-consolidated-rev1/review.json'
v=load(base);prior=load(base);r=load(rp);c=load(rp.parent/'check.json');s=r['sourceRole']
assert ref(base)['sha256']=='26ed294d53dcd52f7fc2627c8812057e5d025e37f23f2106221ab891e43835c5'
assert v['unassignedCandidatePaths']==[s['path']]
assert c['reviewedOccurrences']==1496 and c['omitted']==c['duplicates']==0
assert sha(r['resolvedSource']['path'])==s['sha256']
v['roleAssignments'].append(dict(**s,evidence=[ref(rp)],acceptanceChain=[ref(rp),ref(rp.parent/'check.json')]))
v['roleAssignments'].sort(key=lambda x:x['path'])
v['unassignedCandidatePaths']=[]
v['version']='campaign3-history-source-roles/0.314';v['predecessor']=ref(base)
v['status']='COMPLETE FROZEN CENSUS SOURCE-ROLE ASSIGNMENT; HQ011 ADEQUACY OPEN'
v['reviewedInputs'].append(ref(rp))
v['originalNarrativeOrFindingOccurrences']+=1496
v['rules'].append('REV314 assigns the frozen historical log through47 content reviews covering all1496 exact original occurrences and194 material-distinction entries. Dated routing is historical; repeated checkpoints are not independent trials. All prior assignments and2804 backing resources are unchanged. Earlier partial-index limits describe their dated scope; complete source-role assignment still does not establish independent scientific adequacy, source-gap closure or post-cutoff freshness.')
assert [x for x in v['roleAssignments'] if x['path']!=s['path']]==prior['roleAssignments']
assert v['explicitBackingOutsideProseManifest']==prior['explicitBackingOutsideProseManifest']
assert len(v['roleAssignments'])==11373
assert v['originalNarrativeOrFindingOccurrences']==201195
assert v['originalBackingFieldOccurrences']==212699
assert 201195+212699==413894
O.mkdir(exist_ok=True);save(O/'index.json',v)
save(O/'check.json',dict(status=v['status'],checker=ref(__file__),index=ref(O/'index.json'),candidateFiles=11373,assignedSources=11373,unassignedSources=0,originalNarrativeOccurrences=201195,originalBackingOccurrences=212699,totalOriginalOccurrences=413894,unchangedPriorAssignments=11372,unchangedOutsideBackingResources=2804,chronologyReviews=47,chronologyOccurrences=1496,materialDistinctionEntries=194))
print(json.dumps(load(O/'check.json')))
