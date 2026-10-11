from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-epi-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'EPI_READINESS.md').as_posix():'Exact19/20 saturation pair needs joined actual learning and encoding:old thin echo and LEARN learning alone insufficient. Accepted SEM130/140 and EAM1/2 precedents,finite consumer roster. Evidence-aware surprise is CONTROL/PORT,not hidden overflow distance. Fixed attention/category/role controlled,not inferred;no body/Need ontology change.',
'docs/formal/EPI_PUBLIC_CONTRACT.md':'Accepted epi-public/0.1-candidate:one observer,two targets,64instants<=128,empty state. Truth912 is excluded only from explicit validated character projection;raw research output intentionally contains truth. Sample900 excludes before/capacity/potential/overflow/provenance. PotentialLeak/OverflowLeak deliberately violate access and are never lawful alternatives. Seven stages50/110/120/124/130/apply140/encode140;both140 owners consume frozen130 prior,not newly updated belief. Six character output types900/907/904/910/905/906. Point absolute distance;bound positive-part distance;unknown numeric reference0 not stored zero. Base/role/attention1,Need0 fixed;EAM raw1+s and strength raw/(1+raw). Encoding exact,belief exact/lattice separate. Latest encoding slot overwrites by explicit bounded retention,not general forgetting. No salience-derived precision or cognition-wide claim.',
(P/'CAMPAIGN3_EPI_QUALIFICATION.md').as_posix():'VER-C3-EPI-001 bounded receiving:6models24files72runs240prefixes168advance72terminal,49affected328reference historical. Potential1/10 vs4/5 at before19/20 yields applied1/20,overflow1/20 vs3/4. Same character evidence/owners,different research truth. Prior1/100 gives surprise1/25,strength26/51,posterior3/100 at4;encoding keeps old prior. Compatible2/5 unchanged. Zero bound may retain encoding1/2 while belief unknown;denied neither. Permitted evidence changes strength11/21 vs9/14 exclude inertness. Leak profiles diagnostic violations,not serious safe sensors;numeric necessity unearned. Historical RO018 active status later closed. Finite roster and reset physical experiments do not imply arbitrary source/memory/Need/general cognition.',
(P/'EPI_IMPLEMENTATION_FINDINGS.md').as_posix():'Before frozen model bytes,read-domain grammar copied LEARN max2 but probe needs4 reads;unfrozen correction to4 reads kept2writes. Interim typecheck lacked not-yet-created manifest. Plan and16first tests rejected two-byte seed at admission;corrected32bytes before plan freeze,no settlement or model change. Failed receipt preserved;not a behavioral counterexample.',
(P/'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen72runs for3projection profiles times2numeric profiles times12cases,with exact contract/allocation/model commitments and seven declared gates.24decoded A/B pairs differ only one potential field1/10 vs4/5 at before19/20;all other structure including time equal. Gates are scientific obligations;names and canonical bytes are backing.',
(P/'EPI_PUBLIC_EXPERIMENT_REV1.json').as_posix():'72ordered stored result/plan joins and240prefix totals verified.24pair comparisons preserve safe character/state equality forSafe or denied observations;leak controls differ when visible. Research output/trace differ for every physical pair. Permitted safe measurement changes retained state. Stored digests do not replace original byte equality or fresh runtime execution;individual original commitments preserved.',
(P/'EPI_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original read-only closure reproduces6models24images,72runs240prefixes,49affected328reference historical test hashes and15source/contract/plan/result/build bindings. Scope explicitly finite roster,no cognition-wide or numeric-law necessity. Earlier LEARN retained;no current test/runtime/prefix replay inferred from this audit.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='EPI AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'EPI_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/EPI_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'EPI_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==72 and v['restores']==sum(r['prefixes'] for r in v['results'])==240
for r in v['results']:assert set(r)==set('name law numeric modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 characterOutputsSha256 researchOutputsSha256 traceSha256'.split())
plan=load(P/'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json')
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
obs=['RO-C3-007','RO-C3-010','RO-C3-018','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='SEVEN EPI SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh72run/240prefix replay or tests.','Finite consumer roster and latest encoding slot do not qualify all cognition or general episodic memory.','Leak profiles are deliberate violations,not lawful alternatives;numeric-law necessity unresolved.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=7,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
