from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-social-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'SOCIAL_READINESS.md').as_posix():'Historical intake:two independent observer models of fixed private commitment,fallible claims and selective correction. Snapshot fan-out with disjoint writes and closed observer projection are bounded ORD002/TRC003 implementations,not global resolutions. Visible receipt grouping is controlled correlation,not trust/hearsay inference.',
'docs/formal/SOCIAL_PUBLIC_CONTRACT.md':'Accepted social-public/0.1-candidate:two holders/local targets,one fixed private commitment,max8originals. Source110 alone reads truth;probes40 read prior own belief,observations120/evidence130/update140 use permitted claims. Receipt0 has no update;immutable nonzero kind/serial deduplicates. SourceGroupedMean/LastStatement/NoLearning retained;global copying/private reader/presentation counting are violating controls. Nine fixed occurrence reservations preserve nonrecipient bytes. View excludes private/source modes/other holders/denial/identity hashes;omniscient saves not safe character evidence. Projection is not authentication/security sandbox.',
(P/'CAMPAIGN3_SOCIAL_QUALIFICATION.md').as_posix():'VER-C3-SOCIAL-001:18models/90files/26runs/127prefixes,101advancing/26terminal. Fixed displays hide opposite commitment,selective explanation changes recipient only;false claims remain possible. Duplicate receipt grouping differs from presentation counting. Six order-swaps compare semantic views;private-only/nonrecipient contrasts use exact full bytes.67affected/328reference historical tests. No general trust,recognition,nested beliefs,relationship or private self-knowledge qualification. RO014 preserves scope;old HABIT routing historical.',
(P/'SOCIAL_IMPLEMENTATION_FINDINGS.md').as_posix():'Three retained failures:extra restore runSeed correctly rejected;removing required occurrence field broke evaluator encoding;invalid-time fixture accidentally used invalid receipt. Corrections use exact restore grammar,typed occurrence normalization only for order comparator,valid receipt held fixed for time tests. Full keyed read paths audited. Model/contract/plan unchanged;failed receipts remain failed.',
(P/'SOCIAL_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen26run exact-input plan binds18model freeze and declares truth/nonrecipient/correlation/order/prefix contrasts. Controlled statement receipts provide finite independent-source assumption;not general credibility.',
(P/'SOCIAL_PUBLIC_EXPERIMENT_REV1.json').as_posix():'26stored results/127prefixes with exact views,normalized semantic views and optional mean/count. All original assertions and plan row bindings reproduced. Missing belief null differs from known0;receipt duplicate supports mean1/2 vs overcount2/3. Order-only normalized comparison cannot replace exact nonrecipient/truth comparisons. No fresh runtime replay.',
(P/'SOCIAL_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original closure reproduced:90model files,contract/allocation/plan hashes,stored67affected/328reference and current source commitments. Decoded access/claim/receipt field interventions exact. Fixed commitment/snapshot/receipt scope only;no UI security or general reciprocal interaction claim.',
(P/'SOCIAL_PUBLIC_EXPERIMENT_FAILURE_REV1.json').as_posix():'Preserved evaluator failure:CanonicalEncodingError required Occurrence absent. Empty results indicate no completed published result rows in this receipt,not a zero-run success. Corrected evaluator retains every semantic field while normalizing occurrence to typed zero only for order comparison.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SOCIAL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'SOCIAL_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/SOCIAL_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'SOCIAL_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==26 and v['restores']==sum(len(r['prefixes']) for r in v['results'])==127
for r in v['results']:
 assert set(r)==set('name model prefixes views semanticViews belief'.split());assert len(r['views'])==len(r['semanticViews'])==len(r['belief'])==2
 for x in r['belief']:
  if x is not None:assert set(x)=={'mean','count'}
assert load(P/'SOCIAL_PUBLIC_EXPERIMENT_FAILURE_REV1.json')['results']==[]

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='EIGHT SOCIAL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh26-run replay,rollback or tests.','Semantic order-normalization is not used for private/nonrecipient byte equality.','Receipt correlation is bounded;hidden common sources and self-knowledge remain unqualified.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=8,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
