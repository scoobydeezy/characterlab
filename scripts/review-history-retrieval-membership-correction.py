"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-retrieval-membership-correction-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev276/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'CONCERN_RETRIEVAL_CEILING_REV1': 'CORRECTED CLAIM: finding4 asserts K2 selected SET changes, but all30 stored rows select exactly c-old and d-oldest; only their order changes. Original S5 assertion compares arrays, not sets. Independent exact recomputation confirms every wide row and all30 crossover cells, preserving ceiling2 and fixture-relative C6. At crossover2 Candidate A ties; canonical x-before-y prevents replacement in this declared fixture, not every possible tie policy. For omega in[1,2], both selected episodes outrank a/b, so membership is unchanged across the full range, not just sampled q. Broader membership claim is unsupported by this receipt; require a new actual membership witness. No original receipt/script rewritten or verdict/law changed.', 'ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1': 'Three-candidate search found a hypothetical component witness at instant8 with weights1 and7/5. Independent exact recomputation checks all8 base/pull/score rows and both K2 rankings from stored histories/activation. Histories are identical across interventions and membership remains episodes4/5; only order changes. Graph/positive encoding/presentation histories are supplied hypothetical operands, not public source, selected capability, IDN or actual writers. Arithmetic consistency does not authenticate graph acquisition or confer public qualification.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_SPATIAL_BINDING_CHECKPOINT.md','GENERAL_ATTENTION_REQUESTED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_COMBINED_SOURCE_CHECKPOINT.md','GENERAL_ATTENTION_BOUNDED_PERCEPTION_CHECKPOINT.md','GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/baseline/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='STORED RETRIEVAL MEMBERSHIP FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v.get('sources',[])+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0]
ceiling=load(P/'CONCERN_RETRIEVAL_CEILING_REV1.json');w=load(P/'ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1.json')['witness']
laws={'A-linear':lambda q:1+q}
for name,g in [('B (= C g=1)',1),('C g=3',3),('C g=10',10),('C g=100',100)]:laws[name]=lambda q,g=g:1+g*q/(1+g*q)
qs=[F(q) for q in ceiling['declaredDomain']['q']]
for name,law in laws.items():assert law(F(1))==F(ceiling['structuralCeiling']['omegaAAtQ1'][name])
for row in ceiling['fixtureSweep']:
 target=F(row['crossover']);assert F(row['pullY'])==F(1,10)+F(1,4)/target
 for name,law in laws.items():
  hit=next((str(q.numerator)+'/'+str(q.denominator) for q in qs if law(q)>target),None)
  assert hit==row['reordersAtQ'][name]
base={'a-newest':F(1,2),'b-newish':F(1,3),'c-old':F(1,6),'d-oldest':F(1,9)}
pull=dict(zip(base,[F(1,20),F(1,10),F(2,5),F(9,20)]))
for name,rows0 in ceiling['wideSelection']['byLaw'].items():
 for row in rows0:
  omega=laws[name](F(row['q']));rank=sorted(base,key=lambda k:(-(base[k]+omega*pull[k]),k))[:2]
  assert rank==row['selected'] and set(rank)=={'c-old','d-oldest'}
for selected in ['c-old','d-oldest']:
 for excluded in ['a-newest','b-newish']:
  assert all(base[selected]+omega*pull[selected]>base[excluded]+omega*pull[excluded] for omega in [F(1),F(2)])
assert w['histories'][0]==w['histories'][1]
activation=dict(zip(['a','b','c','d','e'],map(F,w['activation'])))
for weight,hist,result in zip(map(F,w['weights']),w['histories'],w['results']):
 scores={}
 for h,r in zip(hist,result['scores']):
  b=sum((F(1,1+w['instant']-int(t)) for t in h['presentations']),F(0));p=sum((activation[k] for k in h['retainedKeys']),F(0))/len(h['retainedKeys'])
  assert r['key']==h['key'] and b==F(r['base']) and p==F(r['pull']) and b+weight*p==F(r['score']);scores[r['key']]=b+weight*p
 assert sorted(scores,key=lambda k:(-scores[k],k))[:2]==result['selected']
assert set(w['results'][0]['selected'])==set(w['results'][1]['selected'])
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
save('unresolved.json',dict(searchScope='Current named files and REV276 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='TWO RETRIEVAL RECEIPTS WITH MEMBERSHIP CLAIM CORRECTED RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-002','RO-C3-003','RO-C3-006','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS RETRIEVAL MEMBERSHIP HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactCrossoverChecks=30,exactWideRankChecks=30,exactWitnessScoreChecks=8,correctedMembershipClaim=True,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
