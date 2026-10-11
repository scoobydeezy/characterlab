"""Historical wrapper claim spine and closed repair-result schemas."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-wrapper-repair-rev1';R=P/'public-wrapper-quiescence-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split()),set(v)
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/PUBLIC_WRAPPER_QUIESCENCE_CONTRACT.md':'Whole-operation barrier includes scheduler settlement, continuation commit and cleanup; second caller must reject before mutation and cannot release the first barrier. Failure permits diagnostics, not failed-scheduler saves. Independent live-ledger guards and scheduler-only constant metadata remain valid. No cognitive state/identity/schema/law changes; serial equality alone does not prove boundary protection.',
'docs/planning/PUBLIC_WRAPPER_QUIESCENCE_READINESS.md':'Historical immediate RO022 gate after a deterministic nonmutating precommit microtask exposed a scheduler-to-wrapper tear. Serial receipts remain valid within serial scope. Classify reachable mutable publication rather than infer failure from similar code. Later bounded repair closes this declared gate; no blanket native/cognitive failure or redesign.',
'docs/planning/IDENTITY_PUBLIC_QUIESCENCE_ADDENDUM.md':'Explicitly narrows unrestricted concurrency inference from prior serial identity qualification without rewriting original evidence. Raw save window is an implementation defect, not psychological law or identity-definition change. RO022 then owned correction; later bounded repair and separate identity-belief closure supersede immediate routing.',
'docs/planning/PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md':'Three raw-ledger tears, biological draws beginning9 rather than1, and distinct embodied overlap/cleanup failure. Existing cognitive/multisource ledger guards are retained controls; scheduler-only snapshots need not read pending ledger. Personstate/PersonState export error is harness-only. Initial4pass/2fail tests assumed wrong first draw; corrected fixture preserves nonempty ledger requirement.149/747 repeated old cases, not new phenomena; archived graph authenticates old receipts only.',
'docs/planning/CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md':'Bounded protocol verdict:49 historical producers=4 repaired+30 independently guarded+15 inapplicable to split publication; latter are not stateless. Same50 models/149 cases/747 one-successor prefix restores,74 affected/328 reference tests/build. Full arbitrary tails and current55-producer inventory are not established. Pre-repair1108-artifact graph retained as control. RO022 closure is conditional on unchanged scope; RO021 ACTIVE prose was historically inaccurate relative to registry CONDITIONAL, but mandatory exit obligation remains unsatisfied. No psychological clause promotion.'}
commands=load(O/'commands.json')
for c in commands['commands']:assert c['exitCode']==0 and sha(c['checker']['path'])==c['checker']['sha256']
closure=P/'PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json';cv=load(closure);keys(cv,'status verdict contract scope producers repaired independentlyGuarded inapplicable runs models prefixes tests referenceTests counters files')
assert (cv['producers'],cv['repaired'],cv['independentlyGuarded'],cv['inapplicable'],cv['runs'],cv['models'],cv['prefixes'])==(49,4,30,15,149,50,747)
for a in cv['files']:keys(a,'path sha256');assert sha(a['path'])==a['sha256']
specs[closure.as_posix()]='Exact frozen closure reconstructed after excluding obsolete live-directory inventory assertions.212 source bindings match. Counts describe stored historical evidence, not fresh tests or current inventory coverage. Plans/probes/inventory/failure schemas remain separate whole-source review work.'
identity=load(P/'IDENTITY_PUBLIC_PLAN_REV1.json');biology=load(P/'BIOLOGY_PUBLIC_PLAN_REV3.json');oldbio={r['index']:r for i in range(4) for r in load(P/f'BIOLOGY_PUBLIC_RESULT_PART{i}_REV3.json')['results']};total=0
for i in range(142):
 p=R/f'REPAIR_RUN_{i}.json';v=load(p);keys(v,'status kind index priorIndex modelIdentity runIdentity prefixes observerHash stateHash traceHash elapsedMs planSha256');assert v['status']=='PASS' and v['index']==i and v['elapsedMs']>=0 and v['planSha256']==sha(R/'REPAIR_PLAN.json')
 j=i if i<84 else i-84;isid=i<84;plan=(identity if isid else biology)['runs'][j];old=load(P/f'IDENTITY_PUBLIC_RUN_{j}_REV1.json') if isid else oldbio[j]
 assert v['kind']==('identity' if isid else 'biology') and v['priorIndex']==j and v['runIdentity']==plan['runIdentity']
 assert v['modelIdentity']==(identity['models'][plan['model']]['modelIdentity'] if isid else plan['modelIdentity'])
 assert [q['at'] for q in v['prefixes']]==plan['prefixes']
 for q in v['prefixes']:
  keys(q,'at sha256 nextSha256');assert all(re.fullmatch('[0-9a-f]{64}',q[k]) for k in ['sha256','nextSha256'])
  if isid:assert q==next(x for x in old['prefixes'] if x['at']==q['at'])
  else:assert q['sha256']==old['prefixHashes'][q['at']] and q['nextSha256']==old['prefixHashes'][min(q['at']+1,len(plan['frames']))]
 total+=len(v['prefixes'])
 for k in ['observerHash','stateHash','traceHash']:assert re.fullmatch('[0-9a-f]{64}',v[k])
 assert v['observerHash']==old['observerSha256' if isid else 'observerHash'] and v['stateHash']==old['stateSha256' if isid else 'stateHash']
 if not isid:assert v['traceHash']==old['traceHash']
 specs[p.as_posix()]='Closed repeated prior-run receipt: exact old model/run identities, selected prefix Save132 hashes and one-successor/terminal continuations; observer/state match prior cohort. Biology also has explicit prior trace hash; identity trace hash is supplemental, while complete saves carry the trace commitment. elapsedMs is diagnostic duration, not behavioral evidence. No new phenomenon or arbitrary-tail claim.'
assert total==698
for i in range(4):
 p=R/f'REPAIR_PART_{i}.json';v=load(p);assert v==dict(status='PASS',part=i,planSha256=sha(R/'REPAIR_PLAN.json'));specs[p.as_posix()]='Partition completion marker bound to the repair plan, backed by142 individual receipts. Not additional runs or prefixes.'
p=R/'EMBODIED_REPAIR_RESULT.json';v=load(p);keys(v,'status rows planSha256');assert v['status']=='PASS' and v['planSha256']==sha(R/'EMBODIED_REPAIR_PLAN.json');assert len(v['rows'])==7
for r in v['rows']:
 keys(r,'name prefixes runIdentitySha256');root=P/'campaign3-embodied-model-rev2/runs'/r['name'];original=bytes.fromhex((root/'run-identity.cenc.hex').read_text().strip());assert hashlib.sha256(original).hexdigest()==r['runIdentitySha256'];assert [q['at'] for q in r['prefixes']]==list(range(7))
 for q in r['prefixes']:keys(q,'at sha256 nextSha256');assert q['nextSha256']==r['prefixes'][min(q['at']+1,6)]['sha256']
 final=bytes.fromhex((P/'embodied-execution-rev3'/r['name']/'final-save.cenc.hex').read_text().strip());assert hashlib.sha256(final).hexdigest()==r['prefixes'][-1]['sha256']
specs[p.as_posix()]='Seven original embodied cases/49 prefixes, six models: hidden89 reuses baseline model. Original run-identity hashes and final Save132 hashes match frozen bytes; consecutive/terminal links checked. Original qualifier compared repaired/preserved runtime at every prefix and original output/trace/final bytes. Stored receipt reconstruction is not fresh runtime replay.'
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert sha(p)==entries[p]['sha256'];roles.append(dict(**ref(p),role='WHOLE HISTORICAL REPAIR CLAIM OR RESULT',judgment=j,acceptanceChain=[ref(closure),ref(O/'commands.json')]))
 if p.endswith('.json'):strings.update({(p,ptr):t for ptr,t in walk(load(p))})
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];narrative=u['source'].endswith('.md') or u['location'].get('pointer')=='/scope'
  if u['source'].endswith('.json'):assert strings[u['source'],u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='CLAIM / CONTRACT / FINDING / ROUTING' if narrative else 'TYPED REPAIR BACKING',judgment=specs[u['source']]))
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='HISTORICAL WRAPPER CLAIM AND MATRIX SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh tests/replay/build.','Inventory, plans, probes, test/development schemas and preserved archive roles remain separate reviews.','49-producer historic coverage is not current55-producer proof.','RO021 mandatory obligation remains open despite incorrect historical ACTIVE prose.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role']!='TYPED REPAIR BACKING' for r in rows),originalBackingOccurrences=sum(r['role']=='TYPED REPAIR BACKING' for r in rows),stringLeaves=len(strings),closureBindings=len(cv['files']),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
