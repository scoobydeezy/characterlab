"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-superseded-model-freezes-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev284/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
notes={
'campaign3-control-model-rev1':'Seven initial identities are preserved, not the qualified public cohort. HABIT typed grammar admits one reason; this two-reason contest failed its list bound. Earlier rollback/admission passes did not reach that contest. CONTROL0.2 introduces an explicit typed successor and refreezes, preserving inhibition versus erasure and goal maintenance distinctions. Never weaken the predecessor codec or promote this freeze to public PASS.',
'campaign3-personstate-model-rev1':'Eight0.1 identities preserve a temporally wrong witness: appraisal50 preceded target intent70, testing future-choice prediction rather than inference about an already formed intention. Initial test passage did not prove the intended phenomenon. Public aggregate interrupted without PASS;0.2 appraises130 after intent and refreezes. No Split psychological failure follows from this construction mistake.',
'campaign3-reason-model-rev1':'Five initial candidates preserve current source20/freeze24 mistake: phase24 unregistered. Eight training rollback tests passed but eleven tests failed, and requested later source/freeze faults were not reached.0.2 corrects source10/freeze14, with separate frozen identities. This freeze proves prospective commitment, not runtime comparison or canonical phase admission.',
'campaign3-reason-model-rev2':'Five0.2 candidates preserve16/19 tests: separate raw1/2 bounds to1/3 below37/100, so it is semantically separate but inactive. The proposed two-active-reason witness is underpowered, not failed grouping. Saved continuing-address projection was also empty despite live RNG/trace draws. REV3 changes matched source calibration and serializes ledger, refreezes under unchanged laws/thresholds. Do not retrofit its qualification to these bytes.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_CONTROL_QUALIFICATION.md','CONTROL_IMPLEMENTATION_FINDINGS.md','CAMPAIGN3_PERSONSTATE_QUALIFICATION.md','PERSONSTATE_DEVELOPMENT_FINDINGS.md','CAMPAIGN3_REASON_QUALIFICATION.md','REASON_IMPLEMENTATION_FINDINGS.md']]
contracts={'campaign3-control-model-rev1':'CONTROL_PUBLIC_CONTRACT.md','campaign3-personstate-model-rev1':'PERSONSTATE_PUBLIC_CONTRACT.md','campaign3-reason-model-rev1':'REASON_PUBLIC_CONTRACT_REV1.md','campaign3-reason-model-rev2':'REASON_PUBLIC_CONTRACT_REV2.md'}
allocations={'campaign3-control-model-rev1':'CONTROL_PUBLIC_ALLOCATION_TABLE.json','campaign3-personstate-model-rev1':'PERSONSTATE_PUBLIC_ALLOCATION_TABLE.json','campaign3-reason-model-rev1':'REASON_PUBLIC_ALLOCATION_TABLE.json','campaign3-reason-model-rev2':'REASON_PUBLIC_ALLOCATION_TABLE.json'}

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith('/models/') or q.endswith('Sha256') else 'NARRATIVE'

sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/name/'FREEZE.json').as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='SUPERSEDED DEVELOPMENT FREEZE; PUBLIC PASS BELONGS TO SUCCESSOR',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in [f for m in v['models'] for f in m['files']]+[dict(path='docs/formal/'+contracts[name],sha256=v['contractSha256']),dict(path='docs/formal/'+allocations[name],sha256=v['allocationSha256'])]:
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0]*4
cohorts=[]
for name in notes:
 v=load(P/name/'FREEZE.json');identities=[]
 for m in v['models']:
  ident=next(f for f in m['files'] if f['path'].endswith('/model-identity.cenc.hex'))
  assert Path(ident['path']).read_text().strip()==m['modelIdentity']
  identities.append(m['modelIdentity'])
  assert len(m['files'])==4
 assert len(set(identities))==len(identities)
 cohorts.append(dict(source=(P/name/'FREEZE.json').as_posix(),models=len(identities),distinctIdentities=len(set(identities))))
assert [c['models'] for c in cohorts]==[7,8,5,5]
a=load(P/'campaign3-reason-model-rev1/FREEZE.json');b=load(P/'campaign3-reason-model-rev2/FREEZE.json')
assert a['allocationSha256']==b['allocationSha256'] and a['contractSha256']!=b['contractSha256']
assert all(x['law']==y['law'] and x['modelIdentity']!=y['modelIdentity'] for x,y in zip(a['models'],b['models']))
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
save('unresolved.json',dict(searchScope='Current named files and REV284 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='SUPERSEDED DEVELOPMENT MODEL FREEZES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-001','RO-C3-012','RO-C3-014','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SUPERSEDED MODEL FREEZE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),cohorts=cohorts,identityImageChecks=25,reasonRevisionIdentityChanges=5,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
