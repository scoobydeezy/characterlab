"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-body-multisource-freezes-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev286/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']}
notes={
'campaign3-embodied-model-review/REVIEW_MANIFEST.json':'Declaration review only, not frozen or runtime-qualified. Seven model commitments, seven run commitments and24 declaration checks include wrong phases/owners/rosters, channel/schema/kind mismatches, forbidden routes and detached caller bytes. Structural S0 specimens and constructed ordered inputs do not establish public admission. Hidden89 shares baseline ModelIdentity but differs in RunIdentity.446 preserved fingerprints are consistency checks, not new tests; work7 runtime failure remained owed.',
'campaign3-embodied-model/FREEZE.json':'Separate on-disk freeze preserves exactly the reviewed seven model/run metadata lists and49 image hashes; acceptance is primary-agent local review, not external. Six semantic models plus work7 negative control; baseline/hidden89 share model, while work7 is not one of seven listed successful-run recipes. Public state/source/work admission and76 runtime obligations remained unqualified at freeze. Later embodied qualification supplies separately scoped execution, not retrospective evidence from commitment alone.',
'campaign3-multisource-model-rev1/FREEZE.json':'Superseded construction cohort contains55 named model/S0/input recipes but43 distinct ModelIdentities. Thirteen case names/five receiver alternatives; DescriptionDice appears only in three contrast cases. Initial registry body instruction named a different action; REV1 images remain intact and inadmissible. REV2 corrects registry copy and separately qualifies62 runs/227 prefixes. Known-zero/no-task/no-body are initial-state interventions, not new model identities. Allocation correction and codec open-slot repair do not authorize admitting this rejected cohort or selecting a universal receiving law.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_EMBODIED_QUALIFICATION.md','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md','MULTISOURCE_CONSTRUCTION_FINDING_REV1.json','MULTISOURCE_COHORT_COUNT_CLARIFICATION_REV1.json']]
def target_refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  else:
   for x in v.values():yield from target_refs(x)
 elif isinstance(v,list):
  for x in v:yield from target_refs(x)

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith('/models/') or q.endswith('Sha256') else 'NARRATIVE'

sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/name).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='BODY DECLARATION/FREEZE OR REJECTED MULTISOURCE COHORT; EXECUTION SCOPE SEPARATE',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in list(target_refs(v))+([dict(path='docs/formal/MULTISOURCE_PUBLIC_CONTRACT.md',sha256=v['contractSha256']),dict(path='docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json',sha256=v['allocationSha256'])] if 'contractSha256' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0]*3
review=load(P/'campaign3-embodied-model-review/REVIEW_MANIFEST.json');freeze=load(P/'campaign3-embodied-model/FREEZE.json')
for k in ['versions','models','runs','preservedChecks']:assert review[k]==freeze[k]
assert len(review['checks'])==review['adversarialChecks']==24 and review['preservedChecks']==446
assert len(review['models'])==len(review['runs'])==7 and len(review['artifacts'])==len(freeze['artifacts'])==49
for a,b in zip(review['artifacts'],freeze['artifacts']):assert a['sha256']==b['sha256'] and ref(a['path'])['sha256']==ref(b['path'])['sha256']
base,hidden=review['runs'][:2];assert base['modelDigest']==hidden['modelDigest'] and base['runDigest']!=hidden['runDigest']
assert len({m['modelDigest'] for m in review['models']})==7 and len({r['runDigest'] for r in review['runs']})==7
assert review['models'][-1]['name']=='work7' and all(r['model']!='work7' for r in review['runs'])
multi=load(P/'campaign3-multisource-model-rev1/FREEZE.json')
assert len(multi['models'])==55 and len({m['modelIdentity'] for m in multi['models']})==43
for m in multi['models']:
 assert len(m['files'])==6
 f=next(f for f in m['files'] if f['path'].endswith('/model-identity.cenc.hex'))
 assert Path(f['path']).read_text().strip()==m['modelIdentity']
assert len({m['caseName'] for m in multi['models']})==13 and len({m['law'] for m in multi['models']})==5
assert {m['caseName'] for m in multi['models'] if m['law']=='DescriptionDice'}=={'orphan-removed','duplicate','aggregate'}
rows=[]; selected={s['path'] for s in sources}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named files and REV286 indexed backing plus census role hashes; not a claim of global absence. REV1 limited search is preserved; its three gaps resolve to exact already-classified development copies.',gaps=gaps))
save('review.json',dict(status='BODY AND MULTISOURCE MODEL FREEZE SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS BODY MULTISOURCE FREEZE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),embodiedImagePairs=49,embodiedModels=7,embodiedRuns=7,multisourceRecipes=55,multisourceDistinctModels=43,identityImageChecks=55,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
