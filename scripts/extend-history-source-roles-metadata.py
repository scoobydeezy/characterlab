"""REV5: whole accepted metadata roles with exact closure-to-source acceptance paths."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev5';M=P/'campaign3-history-late-metadata-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
base=P/'campaign3-history-source-roles-rev4/index.json';rp=M/'review.json';r=load(rp);v=load(base)
entries={e['path']:e for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']};roles={x['path']:x for x in v['roleAssignments']}
selected={s['path'] for s in r['sourceRoles']};roots=sorted(p for p in selected if '_CLOSURE_REV' in p)
# The reviewed accepted qualification names these five closure chains. Bind each
# selected metadata source directly through its accepted closure and plan artifacts.
parents={};bound={}
for root in roots:
 bound[root]=[root]
 for a in load(root)['artifacts']:
  assert sha(a['path'])==a['sha256'];parents[a['path']]=root;bound[a['path']]=[root,a['path']]
for path in sorted(selected):
 if '_PLAN_REV' not in path:continue
 assert path in bound
 for a in load(path)['artifacts']:
  assert sha(a['path'])==a['sha256']
  if a['path'] not in bound:bound[a['path']]=bound[path]+[a['path']]
assert selected<=set(bound),'missing accepted path'
acceptance=dict(status='ALL23 METADATA SOURCES HAVE EXACT ACCEPTED CLOSURE CHAINS',qualificationReview=ref(P/'campaign3-history-late-qualifications-rev1/review.json'),metadataReview=ref(rp),paths=[dict(source=p,chain=[ref(x) for x in bound[p]]) for p in sorted(selected)],limits='Chains establish source acceptance only within the separately reviewed bounded qualification. Transitive source existence does not automatically review every other referenced document.',obligations=r['obligations'])
save(M/'acceptance.json',acceptance)
for s in r['sourceRoles']:
 p=s['path'];assert p not in roles and entries[p]['sha256']==s['sha256']==sha(p)
 roles[p]=dict(path=p,sha256=s['sha256'],category='WHOLE_ACCEPTED_METADATA_ROLE_REVIEWED',role=s['role'],evidence=[ref(rp),ref(M/'acceptance.json')],scope=s['acceptance']+' '+s['limits'])
ids={x['occurrenceId'] for x in r['rows']};assert len(ids)==len(r['rows']);seen=set()
with (P/'campaign3-history-universe-rev1/units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in selected:assert u['id'] in ids;seen.add(u['id'])
assert seen==ids
v['version']='campaign3-history-source-roles/0.5';v['predecessor']=ref(base);v['roleAssignments']=[roles[p] for p in sorted(roles)];v['unassignedCandidatePaths']=sorted(set(entries)-set(roles));v['reviewedInputs']+=[ref(rp),ref(M/'acceptance.json')]
v['originalNarrativeOrFindingOccurrences']+=r['originalNarrativeOccurrences'];v['originalBackingFieldOccurrences']+=r['originalBackingOccurrences'];v['backingBreakdown']['lateMetadata']=r['originalBackingOccurrences']
v['rules'].append('REV5 adds23 accepted metadata sources, seven original bounded scope statements and359 typed original backing occurrences. Exact closure chains establish acceptance; PASS filenames alone do not. FreshBuild labels remain historical.')
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),byCategory=dict(collections.Counter(x['category'] for x in roles.values())),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],addedSources=len(selected),addedOriginalOccurrences=len(ids),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
