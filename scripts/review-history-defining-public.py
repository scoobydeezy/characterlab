"""Defining public claims and closed receipt schemas; no new replay."""
from pathlib import Path
import json,hashlib,re,subprocess,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';D=P/'defining-public-matrix-rev1';O=P/'campaign3-history-defining-public-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
cache={}
def sha(p):
 p=str(p)
 if p not in cache:cache[p]=hashlib.sha256(Path(p).read_bytes()).hexdigest()
 return cache[p]
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split()),set(v)^set(s.split())
def digest(x):assert isinstance(x,str) and re.fullmatch('[0-9a-f]{64}',x)
def uint(x):assert type(x)==int and x>=0
def spec(s):
 keys(s,'law goal rehearsals capacity now cue report worldAfter')
 for k,domain in dict(law=['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'],goal=['High','Low','Wide','Absent'],rehearsals=[0,3],capacity=[0,1,8],now=[50,400,4000],cue=['matching','absent'],report=['original','contrary','missing'],worldAfter=[20,30]).items():assert s[k] in domain
def files(v):
 for a in v:keys(a,'path sha256');assert sha(a['path'])==a['sha256']
docs={
 'docs/planning/CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md':'Bounded68 selected public programs/models/runs across four laws,1680 prefixes with1612 advancing/68 terminal,376 native comparisons and8 diagnostic pairs. No extra coverage from reverified17/328 tests. One successor per prefix; focused39 separately reaches4000. Post-execution comparison derivation is explicit. Goal/current/history/retention/publication distinct; no law selected, all four comparators retained. Historical1492/0,53/56 and AuditREV79 are not current counters.',
 'docs/planning/DEFINING_PUBLIC_IMPLEMENTATION_CHECKPOINT.md':'Historical implementation-only gate: primary CASE14,27 instants,8 stages,9 saves and only3 successful restored prefixes0/39/4000, not all28. Reached rollback38/39/42/43/4000 and both publication guards distinct from matrix. Test-only Node hashing typecheck failure precedes execution; corrected17 tests and328 reference/build. BLOCKED and next68-program work superseded only by final qualification. Source/handler bytes unchanged; public identities intentionally successor.',
 'docs/planning/DEFINING_NATIVE_COHORT_CHECKPOINT.md':'Internal68 selected cases/1612 instants/376 stages are not public restores. Component correspondence stops before explicitly additional exactly-once final presentation settlement. Opposite nonneutral goals, neutral/absent and indeterminate overlap remain distinct; contrary/missing evidence cannot rewrite old credit or recreate lost content. Retained35 can lose selection to139. No cue means no final rank reads/publication; no publication means no final presentation. Native53/56 successor gate was still open; historical52/55 and tests were reverified only.',
 'docs/planning/DEFINING_PUBLIC_FINDINGS.md':'Cumulative observer history is a conformance projection, not accessible memory; cognition cannot bypass memory with it. Diagnostic worldAfter equality is not enacted physical sensing or truth/evidence dissociation. Carried cue, fixed rehearsal, empty graph and scheduled current baseline retained. Sparse horizons are not active ageing. Identities derived after execution; context-loss completion checked untouched receipts without rerunning workers. Warnings do not override actual per-case outcomes. No new theory or comparator retirement.',
 'docs/formal/DEFINING_PUBLIC_CONTRACT.md':'Closed copied canonical recipe, fixed zero32 seed, exact original empty S0 and opaque handles. Successor identities preserve native ownership/order. Actual Save132 and both promise-tail guards; replay from S0, at most27 instants, whole-byte match rather than state injection. Cumulative590 recollections and1489/1490 judgments only, not whole perception or current-access store. No new owner/record/law, arbitrary seed, general biography or learned rehearsal.',
 'docs/planning/DEFINING_PUBLIC_SAVE_GATE.md':'Work order requires public admission distinct from68 internal native cases; later matrix closes bounded gate. No arbitrary learned state/source injection, no borrowed <=100 calendar assumption, zero seed scope, sparse deadlines preserved. Fault/publication and all selected restore controls separate from count claims. Four laws and retained-but-unselected/absence/loss controls stay. No ruling, autobiographical identity or full Cartesian-domain claim.'
}
O.mkdir(exist_ok=True);cp=O/'commands.json'
if not cp.exists():
 commands=[]
 for script in ['check-defining-native-cohort.mjs','check-defining-public-matrix.mjs','identify-defining-public-matrix.mjs']:
  script='scripts/'+script;r=subprocess.run(['node',script],capture_output=True,text=True,encoding='utf-8');assert r.returncode==0,(r.stdout,r.stderr)
  commands.append(dict(command='node '+script,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(script)))
 save(cp,dict(commands=commands,scope='Read-only checks of stored receipts and identities; no fresh simulation, build or tests.'))
entries={x['path']:x for x in load(B/'manifest.json')['entries']};sources={};roles=[];closure=P/'DEFINING_PUBLIC_CLOSURE_REV1.json';files(load(closure)['files'])
for p,j in docs.items():
 assert sha(p)==entries[p]['sha256'];sources[p]=None
 roles.append(dict(**ref(p),role='WHOLE DEFINING PUBLIC CLAIM / CONTRACT / ROUTING',judgment=j,acceptanceChain=[ref(closure),ref(cp)]))
manifest=D/'MANIFEST.json';m=load(manifest);keys(m,'version contract scope cases expectedPrefixes files');assert m['version']==1 and m['contract']=='defining-public/0.1-candidate' and m['expectedPrefixes']==1680 and len(m['cases'])==68;files(m['files']);assert len(m['files'])==1200
for s in m['cases']:spec(s)
receiptPaths=[manifest];sizeMax=0
for i in range(68):
 d=D/f'CASE_{i:02}';b=load(d/'BASELINE.json');r=load(d/'RESULT.json')
 keys(b,'index spec manifestHash modelIdentity runIdentity source initialState orderedInputs rows');keys(r,'status index spec manifestHash prefixes nativeStageComparisons elapsedMs files');files(r['files'])
 assert b['index']==r['index']==i and b['spec']==r['spec']==m['cases'][i];assert b['manifestHash']==r['manifestHash']==sha(manifest);assert r['status']=='PASS';uint(r['elapsedMs'])
 for k in ['source','initialState','orderedInputs']:digest(b[k])
 for k in ['modelIdentity','runIdentity']:assert re.fullmatch('(?:[0-9a-f]{2})+',b[k])
 assert len(b['rows'])==r['prefixes'];uint(r['nativeStageComparisons']);receiptPaths.extend([d/'BASELINE.json',d/'RESULT.json'])
 for j,row in enumerate(b['rows']):
  keys(row,'clock save saveBytes observer nativeStageCompared');assert re.fullmatch('0|[1-9][0-9]*',row['clock']);digest(row['save']);digest(row['observer']);uint(row['saveBytes']);assert type(row['nativeStageCompared'])==bool;sizeMax=max(sizeMax,row['saveBytes'])
  path=d/f'PREFIX_{j:02}.json';x=load(path);keys(x,'status index prefix clock manifestHash baselineHash save observer nextSave nextObserver exhausted elapsedMs');assert x['status']=='PASS' and x['index']==i and x['prefix']==j;uint(x['elapsedMs']);assert type(x['exhausted'])==bool
  assert x['manifestHash']==sha(manifest) and x['baselineHash']==sha(d/'BASELINE.json');n=b['rows'][min(j+1,len(b['rows'])-1)]
  for k in ['clock','save','observer']:assert x[k]==row[k]
  assert x['nextSave']==n['save'] and x['nextObserver']==n['observer'] and x['exhausted']==(j==len(b['rows'])-1);receiptPaths.append(path)
assert len(receiptPaths)==1817 and sizeMax==3446860
for p in receiptPaths:
 s=p.as_posix();assert sha(p)==entries[s]['sha256'];sources[s]=load(p)
 roles.append(dict(**ref(p),role='WHOLE DEFINING MATRIX RECEIPT SCHEMA',judgment='Closed recipe, identity/digest references, typed baseline/prefix/result fields and exact predecessor/successor links. ElapsedMs is operational metadata, not simulation time or performance guarantee. Model/run canonical identities verified separately. Native stage checks are historical harness assertions; no saved images or fresh restores inferred from hashes alone.',acceptanceChain=[ref(P/'DEFINING_PUBLIC_MATRIX_CHECK_REV1.json'),ref(P/'DEFINING_PUBLIC_IDENTITIES_REV1.json'),ref(cp)]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):x for p,v in sources.items() if v is not None for ptr,x in walk(v)};rows=[];rolemap={x['path']:x for x in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources:continue
  assert u['sourceSha256']==entries[p]['sha256']
  if sources[p] is not None:assert strings[p,u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE CLAIM / LIMIT' if p in docs or u['location'].get('pointer')=='/scope' else 'TYPED RECEIPT BACKING',judgment=rolemap[p]['judgment']))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='DEFINING PUBLIC NARRATIVE AND MATRIX SCHEMAS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Hashes establish frozen identities, not fresh execution. Original harness capture explicitly compares native state/output hashes before recording nativeStageCompared.','1680 historical restore receipts include68 terminal; no full tails or full domain Cartesian product.','Other referenced component/native sources retain their own review obligations; no blanket transitive acceptance.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),narrativeSources=len(docs),matrixSources=len(receiptPaths),originalNarrativeOccurrences=sum(x['role']=='NARRATIVE CLAIM / LIMIT' for x in rows),originalBackingOccurrences=sum(x['role']=='TYPED RECEIPT BACKING' for x in rows),stringLeaves=len(strings),largestSaveBytes=sizeMax,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
