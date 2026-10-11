"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-concern-family-comparison-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev278/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={'CONCERN_MODULATION_COMPARISON_REV1': 'Exact A/B component arithmetic distinguishes modulation shape at fixed authored q/residual/geometry/rank operands. A reaches5/3 atq2/3 but canonical tie preserves x; first sampled flip3/4. B maximum3/2 cannot cross this fixture. Fresh rational checks verify12 pools, allocations, weights, score pairs and winners. The recent episode is weakly associated (pull1/10), not literally unassociated as finding1 says. No same-run public source or law selection follows. Historical blocked downstream routing is superseded only by separately scoped later GA evidence; no universal flip threshold.', 'CONCERN_MODULATION_CANDIDATE_C_REV1': 'Fresh rational checks verify18 rows and5 gain profiles. C keeps B encoding and independent retrieval gain; gain3 crosses the declared fixture without annihilating peripheral allocation. A/C first sampled flip3/4 retains1/4 versus4/7 peripheral pool. C6 remains fixture-relative, not arbitrary recency sufficiency. CORRECTED architecturalFinding: B equals C at gain1, but A is not a limit of the defined gain-only C family. E_C(1)=1/2 for every gain while E_A(1)=0; gain changes only retrieval. Retain A as distinct comparator; broader interpolating family was not specified or proven. All seven constraints hold for this C fixture, not psychological correctness or learned calibration. Original receipt remains unchanged; no model/law retired or chosen.'}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CAMPAIGN3_HISTORY_RETRIEVAL_MEMBERSHIP_CORRECTION.md']]
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
 sources.append(dict(**ref(p),role='STORED CONCERN FAMILY FAULT CONTROLS WITH SEPARATE PUBLIC QUALIFICATION',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in v['sources']+([v['baseline']] if 'baseline' in v else []):
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0,0]
ab=load(P/'CONCERN_MODULATION_COMPARISON_REV1.json');abc=load(P/'CONCERN_MODULATION_CANDIDATE_C_REV1.json')
def arms(name,q):return (1-q,q) if name=='candidate-a-linear' else (1/(1+q),(3*q/(1+3*q) if name=='candidate-c-decoupled' else q/(1+q)))
for name,rs in ab['results'].items():
 for row in rs:
  q=F(row['q']);e,r=arms(name,q);omega=1+r;pool=e/5;x=F(1,2)+omega/10;y=F(1,4)+omega/4
  assert F(row['omegaA'])==omega and F(row['residualPool'])==pool and list(map(F,row['peripheralAllocation']))==[pool/2,pool/2]
  assert F(row['retrieval']['scores']['x-recent'])==x and F(row['retrieval']['scores']['y-associated'])==y
  assert row['retrieval']['top']==('y-associated' if y>x else 'x-recent')
for name,rs in abc['results'].items():
 for row in rs:
  q=F(row['q']);e,r=arms(name,q);omega=1+r;pool=e/5
  assert F(row['E'])==e and F(row['R'])==r and F(row['omegaA'])==omega and F(row['residualPool'])==pool
  assert list(map(F,row['peripheralAllocation']))==[pool/2,pool/2]
  assert row['retrievalTop']==('y-associated' if omega>F(5,3) else 'x-recent')
  assert row['omegaAReachesCrossover']==(omega>=F(5,3))
for row in abc['retrievalGainSensitivity']:
 g=F(row['gain']);assert F(row['omegaAAtQ1'])==1+g/(1+g) and F(row['EAtQ1'])==F(1,2)
 hit=next((q for q in abc['declaredDomain']['q'] if 1+g*F(q)/(1+g*F(q))>F(5,3)),None)
 assert row['firstReorderingAtQ']==hit
assert arms('candidate-a-linear',F(1))[0]==0 and arms('candidate-c-decoupled',F(1))[0]==F(1,2)
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
save('unresolved.json',dict(searchScope='Current named files and REV278 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='TWO CONCERN COMPARISONS WITH FAMILY LIMIT CORRECTED RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-002','RO-C3-003','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CONCERN FAMILY HISTORY ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactComparisonRows=30,exactGainProfiles=5,correctedFamilyLimitClaim=True,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
