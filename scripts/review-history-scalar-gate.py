"""Reconcile independent scalar gate proof and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,re,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-scalar-gate-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev295/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
name='CAMPAIGN2_INDEPENDENT_GATE_PROOF.json';v=load(P/name);later=load(P/'CAMPAIGN2_INDEPENDENT_GATE_PROOF_REV2.json')
assert v['baseline']==later['baseline'] and v['harnessSha256']==later['harnessSha256']
assert len(v['baseline']['cases'])==v['baseline']['casesChecked']==72
expectedNames={f'step={s}/prior={p}/gate={g}/count={n}' for s,p,g,n in itertools.product([1,-1],[0,1,9,10],[0,1,8],[0,1,2])}
assert {x['name'] for x in v['baseline']['cases']}==expectedNames
arithmetic=[]
for x in v['baseline']['cases']+[x for m in v['mutations'] for x in m['differences']]:
 s,p,g,n=map(int,re.fullmatch(r'step=(-?\d+)/prior=(\d+)/gate=(\d+)/count=(\d+)',x['name']).groups())
 target=p+(n*s if g==0 else 0)
 expected=dict(accept=0<=target<=10,magnitudes=[target,g+n,n,n],ops=0 if n==0 else 3+int(target!=p))
 assert x['expected']==expected
 if x in v['baseline']['cases']:
  assert x['accepted']==expected['accept'] and x['agrees'] is True
  o=x['observed']
  if x['accepted']:assert o['magnitudes']==expected['magnitudes'] and o['ops']==o['diffs']==expected['ops'] and o['reads']==5 and o['removeCount']==int(p>0 and target==0)
  else:assert o==dict(error='ADAPTATION_MAGNITUDE_OUT_OF_RANGE',rollback=True)
 arithmetic.append(dict(name=x['name'],expected=expected))
assert [len(m['differences']) for m in v['mutations']]==[32,48,20,8,1,46]
assert all(m['status']=='DETECTED' and m['casesChecked']==72 and all(x['agrees'] is False for x in m['differences']) for m in v['mutations'])
changed=[x['name'] for x,y in zip(v['mutations'],later['mutations']) if x!=y];assert changed==['use-target-as-gate']
notes={(P/name).as_posix():'Independent integer scalar expectations rederived for72 complete factorial baseline cases and155 reported mutant differences. Gate uses frozen pre-event sensitization; signed count*step changes tolerance only atgate0, bounds0..10; other leaves gate+count/count/count, sparse zero removes rather than sets. Baseline exact magnitudes/ops/diffs/five reads/removal counts agree, rejected magnitudes report rollback. Six mutants differ in32/48/20/8/1/46 cases; differences are not a new sample size. Independent arithmetic shares canonical transport and production factory, not a general REG interpreter. LaterREV2 preserves baseline/harness and five mutant results, but use-target-as-gate changes under a new evaluator fingerprint; earlier behavior remains distinct. No full REG/persistence/FCT6/PHEN-ADAPT closure from this assay.'}
chain=[ref(P/n) for n in ['CAMPAIGN2_INDEPENDENT_GATE_PROOF_REV2.json','CAMPAIGN2_AUTONOMOUS_ADVERSARIAL_REVIEW.md','CAMPAIGN2_INHERITED_CURRENT_REVIEW.md']]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'BACKING' if q.startswith('/sourceFingerprint/') or q=='/harnessSha256' or q.endswith(('/source','/from','/to')) else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT SCALAR GATE SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='INDEPENDENT SCALAR EXPECTATION WITH SHARED EXECUTION HARNESS',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

bind((P/name).as_posix(),dict(path='src/test/fixtures/campaign2GateComparison.ts',sha256=v['harnessSha256']))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('arithmetic.json',dict(rows=arithmetic,scope='Integer expectations independently recomputed; no runtime replay.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV295 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='SCALAR GATE RECEIPT RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),arithmetic=ref(O/'arithmetic.json'),currentInspectionSources=[ref(p) for p in ['scripts/prove-campaign2-independent-gates.mjs','src/test/fixtures/campaign2GateComparison.ts']],limits=['Independent scalar arithmetic rederived; canonical transport and production setup remain shared.','Stored rejection rollback checks cover state/outputs/trace/clock; stronger full queue/allocator rollback has separate evidence.','Exact historical sources checked where available; no historical writer or runtime rerun. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCALAR GATE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),baselineCases=72,mutantDifferences=155,arithmeticRows=len(arithmetic),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
