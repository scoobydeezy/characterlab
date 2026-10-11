"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-salience-arithmetic-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev279/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'SALIENCE_LAW_COMPARISON_REV1': 'Four laws remain distinguishable over the declared finite arithmetic domain; no psychological winner or native admission is established. Exact allocation, role, quantized edge and row-mass checks are independently repeated. Conserved shared allocation differs between no incidental member and positive membership, then is invariant across positive footprints; unconserved positive footprints dilute it. Allocation invariance does not imply edge invariance. D100 independent zero edges are a quantization floor, not a law equivalence. The massConserved flag means nonsaturation and spread <=2% of peak, not exact conservation; independent spread is1/93. Evidence-proportional is bounded evidence sensitivity, not a verified general linear scaling law; one focal vector plus a role intervention cannot prove that. Flat stays a retired negative control; independent/shared/hybrid remain candidates. Empty prior, eta1, no decay and finite footprints do not qualify arbitrary graphs or public source ownership. Historical blocked routing is superseded only by separately scoped later qualification. Receipt has two source fingerprints, not the four paths in the writer candidate list; do not regenerate original receipt.'}
chain=[ref(P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),ref('docs/formal/ENCODING_ACCESS_MATH.md')]

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
 sources.append(dict(**ref(p),role='FINITE SALIENCE ARITHMETIC WITH EXPLICIT TOLERANCE AND SCOPE',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0]
v=load(P/'SALIENCE_LAW_COMPARISON_REV1.json')
def encode(law,n,regime,role=F(1)):
 raw=[F(9,20)*role]+[F(3,250)/(n if regime=='conserved' and n else 1)]*n
 if law=='independent':return [x/(1+x) for x in raw]
 if law=='retired-flat':return [F(1)]*len(raw)
 if law=='historical-shared':return [x/max(F(1,5),sum(raw)) for x in raw]
 assert law=='historical-hybrid'
 important=[x>=F(1,5) for x in raw]
 left=max(F(0),F(1,5)-sum(x/(1+x) for x,k in zip(raw,important) if k))
 denom=max(left,sum(x for x,k in zip(raw,important) if not k))
 return [x/(1+x) if k else x/denom if denom else F(0) for x,k in zip(raw,important)]
def associate(law,n,d):
 z=encode(law,n,'conserved');q=round(d*z[0]*z[1]);total=n*q
 mass=[q]*n
 if total>d:
  mass=[d//n+(i<d%n) for i in range(n)]
 return z[1],F(mass[0],d),sum(mass),total>d
checks=0
for regime,laws in v['level1_allocation'].items():
 for law,item in laws.items():
  values=[]
  for row in item['series']:
   z=encode(law,row['n'],regime)[0];assert F(row['zFocal'])==z;values.append(z);checks+=1
  assert item['focalInvariantUnderFootprint']==(len(set(values))==1)
for law,item in v['level1b_roleResponse'].items():
 values=[]
 for row in item['series']:
  z=encode(law,2,'conserved',F(row['roleFactor']))[0];assert F(row['zFocal'])==z;values.append(z);checks+=1
 assert item['distinctOutcomes']==len(set(values)) and item['roleSensitive']==(len(set(values))==len(values))
for scale,laws in v['level2_associationEdge'].items():
 for law,item in laws.items():
  values=[]
  for row in item['series']:
   z,e,m,o=associate(law,row['n'],int(scale));assert F(row['focalEdge'])==e;values.append(e);checks+=1
  assert item['allZero']==all(x==0 for x in values) and item['invariant']==(len(set(values))==1)
for law,item in v['level3_totalMassAndSaturation'].items():
 values=[];overflow=[];d=1000000
 for row in item['series']:
  z,e,m,o=associate(law,row['n'],d)
  assert F(row['zIrrelevant'])==z and F(row['focalEdge'])==e and int(row['rowMass'])==m and F(row['rowMassOfScale'])==F(m,d) and row['overflowed']==o
  values.append(m)
  if o:overflow.append(row['n'])
  checks+=1
 peak=max(values);spread=peak-min(values)
 assert F(item['peakMassOfScale'])==F(peak,d) and F(item['spreadOverPeak'])==F(spread,peak)
 assert item['saturatesBudget']==all(x==d for x in values)
 assert item['overflowsFromFootprint']==(overflow[0] if overflow else None)
 assert item['massConservedAcrossFootprint']==(all(x!=d for x in values) and spread*50<=peak)
def signature(law):return [v['level1_allocation'][r][law] for r in ['conserved','unconserved']]+[v['level1b_roleResponse'][law]]+[v['level2_associationEdge'][d][law] for d in ['100','10000','1000000']]+[v['level3_totalMassAndSaturation'][law]]
for pair in v['pairwiseDistinguishability']:assert pair['distinguishable']==(signature(pair['a'])!=signature(pair['b']))
assert checks==116
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
save('unresolved.json',dict(searchScope='Current named files and REV279 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='SALIENCE COMPARISON ARITHMETIC AND CLAIM LIMITS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-004','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SALIENCE ARITHMETIC HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactArithmeticRows=checks,pairwiseComparisons=6,conservationToleranceExplicit=True,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
