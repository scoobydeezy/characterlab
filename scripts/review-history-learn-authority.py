from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-learn-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'LEARN_READINESS.md').as_posix():'Historical intake for four scalar lower-bound contrasts through existing observer/SEM/130/140/later50 topology. Established priors acquired by25 precision2 points from empty state. Mean-relative gating,full point-like bound credit and established-prior repetition are explicit approximations;reference lattice retained,not Bayesian truth. No surprise consumer or body ownership change.',
'docs/formal/LEARN_PUBLIC_CONTRACT.md':'Accepted learn-public/0.1-candidate:independent bounded physical trials reset before-level,not persistent body. Safe applied measurement and ceiling-derived Point/LowerBound classification never consult hidden overflow. Missing permission emits nothing. Six stages50/110/120/124/130/140;sole belief owner. Gated strictly compares raw candidate mean before rounding;unknown nonnegative reference0 is not exported known0. Accepted supports only,precision2 per support,max64. Exact and millionth ties-even commit profiles distinct;explicit application892 contains numeric witness despite empty generic quantization trace. No upper bound,decay,correlation,calibrated uncertainty or general physiology claim.',
(P/'CAMPAIGN3_LEARN_QUALIFICATION.md').as_posix():'VER-C3-LEARN-001 bounded lower-bound qualification:6models/24files/39runs/580prefixes,541advance39terminal;44affected328reference historical. Gated preserves compatible and zero leaves;inconsistent27/520,52;fresh repeated then point21/50 gives13/50,4. UnconditionalPrecision manufactures precision;PointOnly safe but insufficient. Hidden truth changes preserve safe results. Established repeated prior grows precision62,not universal deduplication. Lattice51923/1000000 distinct numeric identity. Historical RO018 ACTIVE routing was later closed,not current status;broader inference stays RO010. No all Brief12.4 or EPI qualification.',
(P/'LEARN_IMPLEMENTATION_FINDINGS.md').as_posix():'Failed18/19 first test expected51922 millionths instead of51923 for27/520. Production ties-even/raw math correct;only assertion corrected,old receipt retained. Repeated CaseD fresh prior becomes equal to bound;established below-bound prior may keep accepting. Final21/50 is admitted measurement,not hidden efficacy;reset physical trials do not establish body ownership.',
(P/'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen39 original input/run commitments for3laws times2numeric profiles plus3supplements;exact contract/model hashes. Eight declared gates are scientific obligations,not result labels. Researcher names and serialized identity/input bytes are backing,not character evidence.',
(P/'LEARN_PUBLIC_EXPERIMENT_REV1.json').as_posix():'39 ordered result joins and580prefix counts verified. Typed trajectory mean/precision/applied or unknown/applied distinguishes absent from known zero. Six repeated/hidden pairs match safe output/state hashes and full stored trajectories;missing has one application. PositiveZero retains2/5,50;repeatedEstablished ends37/620,62. Original byte replay is historical,not reexecuted. Run/save/state/output hashes preserve individual commitments.',
(P/'LEARN_VALIDATION_CLOSURE_REV1.json').as_posix():'Original read-only checker reproduces entire closure receipt including6models24files,39runs580prefixes,44affected328reference test hashes and13source/contract/plan/result hashes. Scope explicitly excludes full active suite/general inference. No new runtime or tests;historical failed test separately preserved in canonical audit evidence.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='LEARN AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'LEARN_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/LEARN_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'LEARN_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==39 and v['restores']==sum(r['prefixes'] for r in v['results'])==580
for r in v['results']:
 assert set(r)==set('name law numeric runIdentity prefixes finalSaveSha256 stateSha256 outputsSha256 trajectory'.split())
 for x in r['trajectory']:
  assert set(x) in ({'unknown','applied'},{'mean','precision','applied'}) and isinstance(x['applied'],bool)
  if 'unknown' in x:assert x['unknown'] is True
plan=load(P/'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json')
for r in plan['runs']:assert set(r)==set('name law numeric modelIdentity runIdentity orderedInputs'.split())

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-018','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='SEVEN LEARN SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh39run/580prefix replay or tests.','Gating is mean-relative,not universal duplicate-source rejection.','Accepted bounds receive full point-like precision;no calibrated uncertainty or broader body claim.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=7,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
