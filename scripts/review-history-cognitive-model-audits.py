"""Bind construction receipts to exact source versions and later frozen identities."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-cognitive-model-audits-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev183/index.json';ix=load(ip)
names=['COGNITIVE_DECLARATION_JOIN_REVIEW_REV1.json','COGNITIVE_DEFINITION_CLOSURE_REVIEW_REV1.json','COGNITIVE_RECIPE_DIFFERENCE_REVIEW_REV1.json','COGNITIVE_MODEL_ADMISSION_REV1.json']
paths=[(P/n).as_posix() for n in names];join,definition,difference,admission=[load(p) for p in paths]
freeze=load(P/'campaign2-task-cognitive-model/FREEZE.json')
assert len(join['recipes'])==len(difference['results'])==len(admission['models'])==len(freeze['models'])==21
recipes=[x['recipe'] for x in freeze['models']]
assert all([x['recipe'] for x in v]==recipes for v in [join['recipes'],difference['results'],admission['models']])
assert all(x['stages']==16 and x['stateFamilies']==11 for x in join['recipes'])
assert [(x['recipe'],x['modelDigest']) for x in admission['models']]==[(x['recipe'],x['modelDigest']) for x in freeze['models']]
assert all(x['status']=='PASS' for x in admission['models'])
assert (definition['models'],definition['definitionRowsPerModel'],definition['checkedFields'],definition['checkedReferences'])==(21,13,2047,233)
assert len(join['negativeControls'])==2 and len(definition['rejectedMutations'])==3
assert next(x for x in difference['results'] if x['recipe']=='history-boundary')['changedRegistryRows']==['definition/protocol-execution','definition/task-a','definition/task-b']
assert difference['results'][0]['changedRegistryRows']==[]
script=Path('scripts/review-cognitive-definition-closure.mjs').read_text()
assert script.index('let checkedFields=0,checkedReferences=0;')<script.index('function review(source)')<script.index('for(const recipe of t.recipes)review(t.source(recipe));')<script.index('assert.throws(()=>review(mutate(')<script.index('fs.writeFileSync(output,')
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];leaves=[]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
entries={x['path']:x for x in load(B/'manifest.json')['entries']}
for p in paths:
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 v=load(p)
 for f in v['sourceFingerprints']:
  actual=f['path'] if ref(f['path'])==f else archives.get(f['sha256']);assert actual and ref(actual)['sha256']==f['sha256']
  bindings.append(dict(owner=p,original=f,actual=ref(actual)))
 leaves.extend(dict(source=p,pointer=q,value=s) for q,s in walk(v))
notes=[
 '16 joins and11 state families across21 recipes; exactly scoped200/9 replacement. Two ownership construction rejections. Predecessor content context is inherited IDN construction only, not runtime value evidence. Exact older taskDeclarations archive retained.',
 '13 receiving definition rows/model.2047 checked fields233 references are cumulative traversal counters, including traversal before rejected mutations; not2047 tests. Three wrong-kind/producer/registry controls. Primitive/reference/controller grammar is not live source authentication or behavioral qualification.',
 'Exact declared recipe row-difference sets; shared content/parameters/slots1..5 and base/gain/K. History-boundary changes three rows and deadline-overlap two; neither is silently labeled single-factor. Literal differences do not establish causal behavioral effects or select a law.',
 '21 admitted model digests exactly match frozen cohort. Declaration/ownership admission explicitly excludes public runs, live source authenticity, RNG and persistence. Later public runtime receipt separately exists; no retroactive widening of this receipt. Different taskDeclarations historical version remains separately bound.'
]
chain=[ref(P/'campaign2-task-cognitive-model/FREEZE.json'),ref(P/'campaign3-history-cognitive-qualification-rev1/review.json')]
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in paths:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  category='NARRATIVE' if u['location']['pointer'].split('/')[1] in ['status','negativeControls','scope','remaining','rejectedMutations','checks','runtime','limits'] else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=notes[paths.index(u['source'])]))
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,stringLeaves=leaves))
save('review.json',dict(status='FOUR CONSTRUCTION AUDITS RECONCILED; NOT FRESH EXECUTION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**ref(p),role='HISTORICAL MODEL CONSTRUCTION WITH BOUNDED EVIDENCE',judgment=n,acceptanceChain=chain) for p,n in zip(paths,notes)],exactBindings=bindings,rows=rows,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['No historical writer/runtime/build rerun; negative controls remain historical receipts. Counters are not scientific adequacy.','Read-only exploratory summarizer initially assumed models was a list; definition receipt stores integer21. Corrected schema-aware inspection; no report/checker/scientific result affected.','80 exit-inventory gaps and one scheduler identity, formula provenance, legacy log, Values90/15 and independent adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED MODEL AUDIT RECONCILIATION',sources=4,models=21,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),archivedBindings=sum(x['actual']['path']!=x['original']['path'] for x in bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
