from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-reason-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'REASON_READINESS.md').as_posix():'Joined key/role/sign/collective redundancy/zero-base/weak-rescue/die comparisons required beyond earlier separate C2/MULTISOURCE evidence. Symbolic panel/task mappings identity-establishing controls,not free recognition. Actual training qualification earns standing;K calibration receiving only. Pairwise serious cheaper candidate;pooled/per-fact/identity-die diagnostic controls. Larger aggregate subset residual/source-key ties unresolved.',
'docs/formal/REASON_PUBLIC_CONTRACT_REV1.md':'Preserved rejected reason-public/0.1:current source20/freeze24 mistaken analogy to consequence120/124;phase24 unregistered. Contract not behavioral qualification;training rollback passed but probe rejected. Superseded by0.2 phase10/14 correction,not scheduler or conceptual authority change. Other governed mapping/compiler candidates remain historical definitions.',
'docs/formal/REASON_PUBLIC_CONTRACT_REV2.md':'Preserved unqualified reason-public/0.2 corrects only version/source20-to10/freeze24-to14 vs0.1. Fixed threshold37/100 exposed weak fixture second raw1/2 ->bounded1/3 inactive. Explicit saved RNG projection still empty despite live/trace draws. Superseded by0.3 fixture and save adapter corrections,no evidence-law/threshold change.',
'docs/formal/REASON_PUBLIC_CONTRACT.md':'Accepted reason-public/0.3:governed observer/two options/two motives/two referents,two panels,16instants<=64,empty identity. Current10/14 observations support51raw then52compile;training40/51/52/60/80/130/140 owns identity. Probe does not write it. Role/sign weighted-Jaccard aggregate union retains even zero-effective raw bases;bound signed net once. Base0 rejects,otherwise relevance>=37/100. One die per option/motive/referent/resolved direction;standing/situation/context truncate units1/4 cap3. Base sign applies whole distribution. Canonical ID ties and larger-union subset residual remain;no arbitrary renaming invariance. Five profiles distinct,standing-only die diagnostic. Actual committed RNG ledger required. Third revision alters model fixture content,not input rows or compiler thresholds.',
(P/'CAMPAIGN3_REASON_QUALIFICATION.md').as_posix():'VER-C3-REASON-001:5models20files115runs350prefixes235advance115terminal. Actual SEM evidence reused by aggregate descriptions,no extra fact. Raw/history matched across5compilers;standing earned through choice/qualification,probe read-only. Aggregate same17/29d6;collective last0 versusPairwise1/8 gives37/61d8. Key changes split;zero base excludes;weak1/11 needs modifier;avoid sign entire lawful expression. Standing68027/146054 withK1/100 controlled calibration,not real learning speed.67preservation is66+1retry,not single run;328reference historical. Failed cohorts retained,old models rejected. General recognition/correlation/cross-role/direction identity/renaming remain unresolved;historical ACTIVE statuses not current.',
(P/'REASON_IMPLEMENTATION_FINDINGS.md').as_posix():'REV1 8/19:unregistered phase causes9settlement/admission failures and2reached-fault assertions;training rollback8pass not probe qualification. REV2 16/19:2inactive separation/per-fact fixtures andempty saved RNG address assertion. REV3 raises second source2/3 andsingleton3/4 model content with threshold unchanged;serializes existing ledger,no RNG algorithm change. Representation TypeScript repairs not psychological laws. Concurrent66/67 timeout plus targeted1pass with30000ms limit forms composite;old timeout retained.',
(P/'REASON_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen115input/model/run commitments for rejected0.1;declared gates not satisfied by8training rollback tests. Preserved exact initial model and input identity;no result qualification inferred.',
(P/'REASON_PUBLIC_EXPERIMENT_PLAN_REV2.json').as_posix():'Frozen115rows for0.2 phase correction. Same original input/name/law rows asREV1,all115model/run identities different. Failed threshold/save cohort remains unqualified;no retrospective acceptance.',
(P/'REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json').as_posix():'Frozen115rows for0.3. Same original input/name/law bytes asREV2;all115model/run identities change because model fixture/adapter commitment changes.23cases each5profiles;gates scientific obligations. No rewriting old plans or activation law.',
(P/'REASON_PUBLIC_EXPERIMENT_REV3.json').as_posix():'115stored joins350prefixes verified;typed nuclei/coverage preserve exact keys,base,roles,dice and effective evidence.5hidden safe-output/state hash pairs equal;denied/untrained inactive. AvoidStanding laws1..3 negative-1/3;law4empty;law5positive68027/146054 standing-only. New audit overgeneralization preserved separately,not historical flaw. Stored result lacks full distributions/traces;those qualified claims depend on original tests/source,not fabricated current replay.',
(P/'REASON_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original read-only closure reproduces all3frozen5model cohorts/contracts/images plus accepted115runs350prefixes,67composite328reference evidence andsource bindings. No fresh simulation/tests or arbitrary cognition claim. Failed cohorts remain exact distinct identities.',
(P/'REASON_PRESERVATION_TESTS_REV2.json').as_posix():'Composite explicitly66concurrent passes plus1targeted save test retry,not single67/67. Original timeout receipt and retry hashes linked;only test timeout changed. Current audit verifies counts/failure identity and full original closure;no fresh67tests.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='REASON AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'REASON_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/REASON_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'REASON_PUBLIC_EXPERIMENT_REV3.json');assert v['runs']==len(v['results'])==115 and v['restores']==sum(r['prefixes'] for r in v['results'])==350
for r in v['results']:
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputsSha256 nuclei rawSignals rejectedSources coverage trainingApplications'.split())
 for n in r['nuclei']:assert set(n)==set('key base standing situation context die standingModifier'.split())
 for c in r['coverage']:assert set(c)==set('description overlap effective role'.split())
plans=[load(P/f'REASON_PUBLIC_EXPERIMENT_PLAN_REV{i}.json') for i in [1,2,3]]
for plan in plans:
 assert len(plan['runs'])==115
 for r in plan['runs']:assert set(r)==set('law name modelIdentity runIdentity orderedInputs'.split())
for a,b in zip(plans,plans[1:]):
 for x,y in zip(a['runs'],b['runs']):
  for k in ['name','law','orderedInputs']:assert x[k]==y[k]
  for k in ['modelIdentity','runIdentity']:assert x[k]!=y[k]

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/retried'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-001','RO-C3-009','RO-C3-018','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='TWELVE REASON SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh115run/350prefix replay or tests.','Symbolic mapping andK calibration do not establish recognition or general identity learning.','Avoidance claim is lawful Aggregate scope,not every diagnostic comparator.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=12,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
