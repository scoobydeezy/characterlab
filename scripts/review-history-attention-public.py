"""Reconcile the bounded attention claim, preserved failures and current focused replay."""
from pathlib import Path
import json, hashlib
P=Path('docs/planning'); O=P/'campaign3-history-attention-public-rev1'; B=P/'campaign3-history-universe-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str): yield p,v
specs={}
def add(n,j): specs[(P/n).as_posix()]=j
specs['docs/formal/ATTENTION_SELECTION_COMPONENT.md']='Accepted selection0.1 component: actual SEM derivation, at most three units, exact Actor1 Target9/10 Participant3/5 priorities, K0..2, canonical ties. Missing/multiple/unsupported excluded. Opaque one-shot selected capability, no parent or archive resolver. Trusted component producer is not public authentication. EqualPriority and Unlimited retained controls.'
specs['docs/formal/ATTENTION_PUBLIC_SHAPE_ACCEPTANCE.md']='Symbolic shape acceptance only:26 records89 fields10 stages, explicit observer-only diagnostic subject refinement. Separate CONTENT compiler and dedicated registration compiler; no change to V04 or receiving515. Future character-state attachment still requires PRJ/IDN. Shape acceptance alone is not execution qualification.'
add('CAMPAIGN3_ATTENTION_PUBLIC_QUALIFICATION.md','Bounded public AT2-A..N claim, independently inspected against current tests.32 models224 scenes217 successes7 budget rejections,434 complete prefix restores,58 rollback witnesses247 corruptions. Multi-role/renaming partly component-only; one positive-time original and finite vocabulary. Historical1160 composed tests not a fresh total. No learning, memory, salience reduction, character attachment or whole ATTN/corpus qualification.')
add('ATTENTION_INITIAL_STATE_CORRECTION.md','Correct-forward S0 list-to-set admission failure.32 model commitments and seven input images unchanged; all224 RunIdentities change, old runs invalid and not aliases. Declaration/model review failed to establish actual state restore admissibility. Correction itself passes no AT2 vector.')
add('ATTENTION_COMPONENT_ORDER_CORRECTION.md','Numeric occurrence ordering wrongly rejected valid SEM evidence across9/10 and99/100. Canonical reference-key sorting corrected without law/schema/identity change; regressions8,9,98,99,998,999 and order-removal fault discriminate. Old qualification fingerprints historical; composed1149 coverage was not a new full run.')
add('ATTENTION_PUBLIC_QUALIFICATION_REV1.json','Whole frozen14-vector receipt reconciled with exact recovered historical source bindings and fresh focused current tests. Original verifier rejection remains valid for current hash drift. Historical mutant and regression receipts remain separately scoped; no original receipt rewritten.')
for n,j in {
 'PUBLIC_TESTS_REV1':'Historical failed construction: two canonical-set S0 admission failures, one passing negative test; not qualified runs.',
 'PUBLIC_TESTS_REV2':'Historical three public tests pass after S0 correction; no full boundary closure at this intermediate point.',
 'PUBLIC_TESTS_REV3':'Historical20 passing public/component leaves; current focused replay has23 after later coverage additions, not an overwrite.',
 'ACTIVE_REGRESSION_REV1':'Historical1148 passing active leaves before canonical-order regression; not current suite coverage.',
 'ACTIVE_REGRESSION_REV2':'Preserved unconstrained run:1141 pass17 timeout failures. All17 failure messages inspected as timeouts, not quietly counted as successful tests.',
 'ACTIVE_REGRESSION_REV3':'Historical1159 passing active leaves; separate new concurrency test makes composed1160. Not freshly rerun in this audit.',
 'CONCURRENCY_TESTS_REV1':'One historical concurrency pass and seven skipped leaves. Scheduler quiescence already protected transaction; suspected reset flaw not confirmed, abandoned redundant guard not counted among11 detected mutants.',
 'REFERENCE_REGRESSION_REV1':'Historical328 reference leaves all pass; programmatic config:false bypassed startup configuration failure. Not fresh reference regression.',
 'COMPONENT_TESTS_REV3':'Historical12 component leaves including canonical reference-order boundary. Fresh component suite independently rerun unchanged assertions.'
}.items(): add('ATTENTION_'+n+'.json',j)
add('ATTENTION_RUNTIME_MUTANTS_REV1.json','Eleven historical source substitutions detected: visibility/capacity outcome divergence; reused slot, omitted/repeated/envelope reads, nontracking writes, child carriage, phase and token rejection. Nine rejection faults preserve rollback. Not freshly mutated in this audit; surviving concurrency suspicion excluded.')
add('ATTENTION_COMPONENT_MUTANTS_REV2.json','Five repeated historical component mutants discriminate reversed rank, capacity bypass, multiple-role collapse, full-pool access and capability reuse. Retain actual alternative observations rather than infer universal necessity.')
add('ATTENTION_REFERENCE_ORDER_MUTANT_REV1.json','Historical production-sort removal at first binding9 causes INVALID_EVIDENCE_REFERENCE; exact old selection source recovered, current source adds separate no-detection helper. Mutant not freshly rerun.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev128/index.json')['roleAssignments']}
assert not set(specs)&set(prior)
q=load(P/'ATTENTION_PUBLIC_QUALIFICATION_REV1.json')
assert (q['models'],q['specimenRuns'],q['successfulRuns'],q['workLimitRejections'],q['wholePrefixRestores'])==(32,224,217,7,434)
assert len(q['vectors'])==14 and (q['boundaryRollbackWitnesses'],q['traceFieldCorruptions'])==(58,247)
bindings=load(O/'resolved-bindings.json'); assert bindings['bindings']==762 and bindings['historicalMappings']==3
for a in bindings['evidence']: assert ref(a['path'])['sha256']==a['sha256']
for a in bindings['rows']: assert ref(a['resolvedPath'])['sha256']==a['sha256']
old=load(P/'campaign3-attention-model-rev1/FREEZE.json');new=load(P/'campaign3-attention-model-rev2/FREEZE.json')
assert len(old['models'])==len(new['models'])==32 and len(old['runs'])==len(new['runs'])==224
assert old['seed']==new['seed']
for x,y in zip(old['models'],new['models']):
 assert x['name']==y['name'] and x['modelIdentity']==y['modelIdentity']
 assert [a['sha256'] for a in x['files']]==[a['sha256'] for a in y['files']]
for x,y in zip(old['runs'],new['runs']):assert (x['model'],x['scene'])==(y['model'],y['scene']) and x['runIdentity']!=y['runIdentity']
failed=load(O/'discovery-failure-tests.json')
assert not failed['success'] and (failed['numPassedTests'],failed['numFailedTests'])==(36,10)
for f in failed['testResults']:
 for a in f['assertionResults']:
  if a['status']=='failed':assert '/docs/planning/public-wrapper-quiescence-rev1/' in f['name'].replace('\\','/') and 'trim' in ' '.join(a['failureMessages'])
expected={'PUBLIC_TESTS_REV1':(1,2,0),'PUBLIC_TESTS_REV2':(3,0,0),'PUBLIC_TESTS_REV3':(20,0,0),'ACTIVE_REGRESSION_REV1':(1148,0,0),'ACTIVE_REGRESSION_REV2':(1141,17,0),'ACTIVE_REGRESSION_REV3':(1159,0,0),'CONCURRENCY_TESTS_REV1':(1,0,7),'REFERENCE_REGRESSION_REV1':(328,0,0),'COMPONENT_TESTS_REV3':(12,0,0)}
for n,counts in expected.items():
 t=load(P/('ATTENTION_'+n+'.json')); a=[a for f in t['testResults'] for a in f['assertionResults']]
 assert (t['numPassedTests'],t['numFailedTests'],t['numPendingTests'])==counts
 assert len(a)==sum(counts) and sum(x['status']=='passed' for x in a)==counts[0]
 failed=[x for x in a if x['status']=='failed']; assert len(failed)==counts[1]
 if n=='ACTIVE_REGRESSION_REV2': assert all('Test timed out' in ' '.join(x['failureMessages']) for x in failed)
 if n=='PUBLIC_TESTS_REV1': assert all('canonical set of StateLeaf records' in ' '.join(x['failureMessages']) for x in failed)
for n,count in [('RUNTIME_MUTANTS_REV1',11),('COMPONENT_MUTANTS_REV2',5)]:
 t=load(P/('ATTENTION_'+n+'.json')); assert len(t['results'])==count and all(x['detected'] for x in t['results'])
assert load(P/'ATTENTION_REFERENCE_ORDER_MUTANT_REV1.json')['failure']=='INVALID_EVIDENCE_REFERENCE'
t=load(O/'current-tests.json');a=[a for f in t['testResults'] for a in f['assertionResults']]
assert t['success'] and t['numPassedTests']==len(a)==23 and t['numFailedTests']==t['numPendingTests']==0
assert all(x['status']=='passed' and not x['failureMessages'] for x in a)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};strings={};roles=[]
chain=[ref(O/n) for n in ['initial-verifier-rejection.json','source-recovery.json','resolved-bindings.json','discovery-failure-tests.json','current-tests.json']]+[ref('src/test/'+n+'.ts') for n in ['attentionSelection.test','attentionPublic.test','attentionBoundaries.test']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='BOUNDED ATTENTION PUBLIC AUTHORITY / FAILURE / QUALIFICATION',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/limits','/vectors','/correction','/execution')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BOUNDED ATTENTION PUBLIC SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[ref(O/'attentionSelection.original.ts')],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh23 scoped tests:224 public combinations217 successful434 prefix restores,58 rollback witnesses247 corruptions and12 component tests. No fresh full active/reference suite or mutants.','First audit runner positional filters also discovered archived copies:36 pass10 archived fixture failures. Preserved separately; corrected include restricts discovery without changing assertions or timeouts.','Original current-source verifier still rejects; exact historical source recovery is separate from current behavior checks.','No residual salience, learning, memory, retrieval, character attachment, arbitrary models or whole ATTN claim. Later GA qualification remains distinct.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
