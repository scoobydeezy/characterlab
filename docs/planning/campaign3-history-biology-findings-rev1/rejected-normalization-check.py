"""Whole-field preservation review for six biological failure/scheduling records."""
from pathlib import Path
import json,hashlib,collections,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-findings-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'BIOLOGICAL_DEVELOPMENT_FINDING_REV1.json':('status findings artifacts exploration buildErrors','Combined elapsed/action sensing masked maintenance relief and harm; residual pleasure was wrongly credited to withholding. Load600 still permitted inhibition, so load800 is a distinct declared control. Preserve failed construction, not evidence against biology.'),
 'BIOLOGICAL_DEVELOPMENT_FINDING_REV2.json':('status findings artifacts exploration','Reward/relief shift did not cure same-tick adaptation leakage or unconditional positive-belief access. Pre-adaptation consequence sensing and drug cue-history gating correct different defects. Existing appraisal edge permits delayed impulse; no final qualification in this cohort.'),
 'BIOLOGICAL_TEST_TYPING_FINDING_REV1.json':('status diagnostic source preserved sha256 correction','Behavioral pass and TypeScript build failure are different receipts. Nullable stress matcher required a test assertion only; no production law change.'),
 'BIOLOGY_PUBLIC_DISPATCH_DUPLICATE_REV1.json':('status error runIndex run cause disposition distinctRuns rowExecutions distinctPrefixChecks executedPrefixChecks','Overlapping row35 writers both checked the same run; exclusive create protected original. Preserve58 unique runs/270 unique prefixes versus59 executions/273 checks. Duplicate is neither extra coverage nor failed biology.'),
 'BIOLOGY_PUBLIC_DISPATCH_REV1.json':('status parent parentSha256 planSha256 dispatcherSha256 generated generatedSha256 indices explanation','Dispatcher changes only Vite resolution, output destination and reverse subset scheduling. Frozen rows55/51/47/43/39/35/31 are not post-outcome cohort selection; all final partitions remain required.'),
 'BIOLOGY_PUBLIC_BOOKKEEPING_REV1.json':('status finding disposition predecessorClosure artifacts','Line-ending corruption required readable successor report and closure, preserving old report/checker. Scientific run receipts are unchanged; normalize only documented formatting, not source evidence or numerical results.')
}
obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};rows=[];leaves=[];roles=[];bindings=[]
def walk(x,p=''):
 if isinstance(x,dict):
  for k,v in x.items():yield from walk(v,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from walk(v,p+'/'+str(i))
 else:yield p,x
for name,(keys,judgment) in specs.items():
 path=P/name;v=load(path);assert set(v)==set(keys.split())
 assert sha(path)==entries[path.as_posix()]['sha256']
 closure=P/('BIOLOGICAL_SYSTEM_CLOSURE_REV1.json' if name.startswith('BIOLOGICAL_') else 'BIOLOGY_PUBLIC_CLOSURE_REV2.json')
 assert any(a['path']==path.as_posix() and a['sha256']==sha(path) for a in load(closure)['artifacts'])
 for a in v.get('artifacts',[]):
  assert set(a)==({'source','preserved','sha256'} if name.startswith('BIOLOGICAL_') else {'path','preserved','sha256'})
  assert sha(a['preserved'])==a['sha256'];bindings.append(ref(a['preserved']))
 if 'preserved' in v:assert sha(v['preserved'])==v['sha256'];bindings.append(ref(v['preserved']))
 if 'exploration' in v:bindings.append(ref(v['exploration']))
 for pointer,value in walk(v):
  root=pointer.split('/')[1]
  role='NARRATIVE FINDING' if root in ['status','findings','buildErrors','diagnostic','correction','error','cause','disposition','explanation','finding'] else 'TYPED PRESERVATION / ACCOUNTING FIELD'
  if isinstance(value,str):assert value
  else:assert type(value)==int and value>=0
  leaves.append(dict(source=path.as_posix(),pointer=pointer,value=value,role=role,judgment=judgment if role=='NARRATIVE FINDING' else 'Exact archive/source identity, declared cohort coordinate or duplicate-aware count; not a psychological inference.'))
 roles.append(dict(**ref(path),role='WHOLE PRESERVED FINDING / SCHEDULING RECORD',judgment=judgment,acceptanceChain=[ref(closure),ref(path)]))
# Compare the generated source after the three documented literal substitutions;
# never import the dispatcher, which would execute the historical workload.
d=load(P/'BIOLOGY_PUBLIC_DISPATCH_REV1.json')
for key,file in [('parentSha256',d['parent']),('generatedSha256',d['generated']),('dispatcherSha256','scripts/dispatch-biology-public-tail.mjs'),('planSha256',P/'BIOLOGY_PUBLIC_PLAN_REV3.json')]:assert sha(file)==d[key]
parent=Path(d['parent']).read_bytes().decode();generated=Path(d['generated']).read_bytes().decode()
m=re.search(r"from (\"file:[^\"]+vite[^\"]+\")",generated);assert m
edits=[("from 'vite'",'from '+m[1]),('outfile=p+`BIOLOGY_PUBLIC_RESULT_PART${part}_REV3.json`',"outfile=p+'BIOLOGY_PUBLIC_AUX_TAIL_REV3.json'"),('for(const [index,row] of runs.entries())if(index%parts===part){','for(const [index,row] of [...runs.entries()].reverse())if(index%parts===3&&index>=31){')]
for a,b in edits:assert parent.count(a)==1;parent=parent.replace(a,b)
assert parent==generated
assert d['indices']==[55,51,47,43,39,35,31]
dup=load(P/'BIOLOGY_PUBLIC_DISPATCH_DUPLICATE_REV1.json');assert (dup['rowExecutions']-dup['distinctRuns'],dup['executedPrefixChecks']-dup['distinctPrefixChecks'])==(1,3)
old=P/'biology-public-bookkeeping-rev1/docs/planning/CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md';new=P/'CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md'
assert old.read_bytes().replace(b'\r\r\n',b'\n').replace(b'\r\n',b'\n')==new.read_bytes().replace(b'\r\n',b'\n')
by={(x['source'],x['pointer']):x for x in leaves}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in {r['path'] for r in roles}:continue
  a=by[(u['source'],u['location']['pointer'])];assert a['value']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=a['role'],judgment=a['judgment']))
O.mkdir(exist_ok=True)
v=dict(status='SIX BIOLOGICAL FINDING RECORDS WHOLE-FIELD REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,allLeaves=leaves,artifactBindings=bindings,obligations=obs,checks=['Exact original hashes and closure acceptance','All scalar leaves classified; closed top-level/artifact schemas','Preserved artifact hashes match','Dispatcher exactly three literal edits; no execution','Duplicate adds one row and three checks, no unique coverage','Old qualification equals successor after documented newline normalization'],limits=['Archive binding is not whole-content review of every archived source or trajectory.','Previously verified closures remain historical; no fresh simulation, test suite or build.','ComparisonCase canonical records and wider backing metadata still need separate review.'])
save(O/'review.json',v)
n=sum(r['role']=='NARRATIVE FINDING' for r in rows)
c=dict(status=v['status'],sources=len(roles),scalarLeaves=len(leaves),stringLeaves=sum(isinstance(x['value'],str) for x in leaves),originalOccurrences=len(rows),originalNarrativeOccurrences=n,originalBackingOccurrences=len(rows)-n,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
