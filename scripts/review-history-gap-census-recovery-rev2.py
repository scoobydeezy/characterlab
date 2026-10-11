from pathlib import Path
import json,hashlib,collections
from functools import cache
P=Path('docs/planning');O=P/'campaign3-history-gap-census-recovery-rev2'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
index=P/'campaign3-history-source-roles-rev314/index.json';ix=load(index)
manifest=P/'campaign3-history-universe-rev1/manifest.json';entries=load(manifest)['entries']
byhash=collections.defaultdict(list)
for x in ix['explicitBackingOutsideProseManifest']+entries:
 byhash[x['sha256']].append(x['path'])
files=sorted(P.glob('campaign3-history-*/unresolved*.json'));assert len(files)==63
occ=[];invent=[]
for p in files:
 v=load(p);keys=[]
 if 'gaps' in v:keys=['gaps']
 elif 'rows' in v:keys=['rows']
 elif 'entries' in v:keys=['entries']
 elif 'sources' in v:keys=['sources']
 elif 'references' in v:keys=['references']
 elif 'groups' in v:keys=[k for k in ['groups','additionalGroups','occurrences'] if k in v]
 elif p.parent.name=='campaign3-history-values-development-rev1':keys=['search']
 else:raise AssertionError(p)
 invent.append(dict(**ref(p),targetArrays=keys,targetEntries=sum(len(v[k]) for k in keys)))
 for k in keys:
  for i,x in enumerate(v[k]):
   target=x.get('original',x);assert 'path' in target and 'sha256' in target
   original=dict(path=target['path'],sha256=target['sha256'])
   pointer=f'/{k}/{i}';oid=hashlib.sha256(json.dumps([p.as_posix(),ref(p)['sha256'],pointer,x],sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
   occ.append(dict(id=oid,report=ref(p),pointer=pointer,originalEntry=x,target=original))
groups=collections.defaultdict(list)
for x in occ:groups[(x['target']['path'],x['target']['sha256'])].append(x['id'])
results=[]
for (path,h),ids in sorted(groups.items()):
 candidates=[path]+byhash[h]
 # Census stores an immutable source mirror even when the live path later changed.
 candidates += [(P/'campaign3-history-universe-rev1/sources'/x).as_posix() for x in byhash[h] if x.startswith('docs/')]
 found=[]
 for candidate in dict.fromkeys(candidates):
  p=Path(candidate)
  if p.is_file() and ref(p)['sha256']==h:found.append(ref(p))
 results.append(dict(target=dict(path=path,sha256=h),occurrences=ids,exactMatches=found,status='EXACT BYTES AVAILABLE' if found else 'UNRESOLVED IN DECLARED SEARCH',claimDisposition='Exact content identity recovered; this alone does not prove original execution time, authenticity of a reported result, scientific adequacy or current qualification.' if found else 'Preserve original gap and dependent-claim limits. No global absence or replacement by current bytes. Broader source recovery and adequacy still required.'))
assert len({x['id'] for x in occ})==len(occ)
prior=load(P/'campaign3-history-gap-census-recovery-rev1/inventory.json')
assert {x['id'] for x in prior['occurrences']} <= {x['id'] for x in occ}
O.mkdir(exist_ok=True)
save('inventory.json',dict(status='DECLARED 63 GAP REPORTS; NOT ALL HISTORICAL REFERENCES',inputs=invent,occurrences=occ,selection='Existing campaign3-history-*/unresolved*.json at this checkpoint. Typed target arrays only; Git search candidates excluded. Values development uses its explicit search targets. Duplicate predecessor/current reports retained by pointer.',sourceIndex=ref(index),sourceManifest=ref(manifest)))
save('review.json',dict(status='CENSUS AND BACKING EXACT-BYTE GAP RECOVERY',checker=ref(__file__),inventory=ref(O/'inventory.json'),groups=results,limits=['Only byte identity is recovered, not scientific acceptance or historical execution.','Search includes current named paths, census and backing hash candidates and census mirrors; no new Git/global search.','Original gap reports remain unchanged; repeated entries are not independent evidence.','Missing manifest, legacy log and formula provenance without target hashes are outside this bounded pass.','Frozen census roles are assigned; final independent universe/claim adequacy and post-cutoff joins remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DECLARED GAP RECOVERY ACCOUNTING',reports=len(invent),targetOccurrences=len(occ),distinctPairs=len(results),recoveredPairs=sum(bool(x['exactMatches']) for x in results),unresolvedPairs=sum(not x['exactMatches'] for x in results),recoveredOccurrences=sum(len(x['occurrences']) for x in results if x['exactMatches']),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
print(json.dumps([dict(target=x['target'],firstMatch=x['exactMatches'][0],occurrences=len(x['occurrences'])) for x in results if x['exactMatches']]))
