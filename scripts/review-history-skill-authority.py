from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-skill-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'SKILL_READINESS.md').as_posix():'Historical intake preserves procedural truth/adaptation versus observed performance belief. Baseline linear practice/multiplicative impairment and serious residual/additive comparators remain;single option does not qualify workspace or confidence-sensitive choice. Later bounded verdict discharges intake,not broader skill laws.',
'docs/formal/SKILL_PUBLIC_CONTRACT.md':'Accepted skill-public/0.1-candidate:one skill/exercise/adopted task,at most8opportunities. Effective k*(1-i) vs max(0,k-i),engaged success e>=d. Linear min(1,k+1/4),Residual k+(1-k)/2,NoPractice inert. Only actual engaged practice updates skill;visible engaged result updates belief under separate owner. Unknown differs from mean0;misleading display can cause false belief. Phase140 affects later40/110 only. Three violating conflation controls explicitly not baselines. No latent-k inference,calibrated confidence,execution noise or general skill claim.',
(P/'CAMPAIGN3_SKILL_QUALIFICATION.md').as_posix():'VER-C3-SKILL-001:27models/135files/52runs/279prefixes,227advancing/52terminal. Skill,performance belief,impairment,intent/attempt/outcome separately intervene.52stored results and original assertions checked,not rerun.60affected/328reference historical tests;practice can outpace stale belief and recovery preserves skill. Belief means observed performance expectation,not inferred latent competence. Auto sole-option choice is controlled,not confidence-sensitive action. RO013 keeps transfer,rust,automaticity,attribution and integration open;old next-SOCIAL routing historical.',
(P/'SKILL_IMPLEMENTATION_FINDINGS.md').as_posix():'SKILL-IMPL-001:zero roll threshold violated inherited domain;first receipt has7failed tests. Positive1 threshold preserves single-option contest0 Auto result. Mechanical scheduler option rename corrected to existing12-stage bound. Neither failure erased or psychological law chosen;test success later does not retroactively qualify initial implementation.',
(P/'SKILL_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen52run plan references exact27model freeze and data-only inputs. Independent physical-skill/impairment/report/practice controls,unknown/zero/saturation/thresholds and serious competitors declared before qualification. Names are researcher labels,not character inference.',
(P/'SKILL_PUBLIC_EXPERIMENT_REV1.json').as_posix():'52stored typed results with279prefix hashes/continuations. Cognitive/intent/expression/plan commitments separate from outcome skill/impairment/effective result and adaptation prior/next/count/applied and learning. Exact plan joins and all original scientific assertions pass. Null belief is unknown;failed outcome can still practice if engaged. No fresh runtime replay.',
(P/'SKILL_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact historical closure receipt reproduces contract/allocation/135model files/current implementation references and stored60affected/328reference tests. Decoded impairment/report single-field contrasts and hidden-skill fixed-report cognition equality hold. One instruction-bound Auto exercise,not latent competence inference or universal confidence. No fresh rollback/test execution.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SKILL AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'SKILL_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/SKILL_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'SKILL_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==52 and v['restores']==sum(r['restores'] for r in v['results'])==279
for r in v['results']:
 assert set(r)==set('name model restores continuations prefixSaveSha256 finalSaveSha256 cognitiveSha256 intentSha256 expressionSha256 planSha256 belief outcomes adaptation learning'.split());assert len(r['prefixSaveSha256'])==r['restores']
 for x in r['outcomes']:assert set(x)==set('skill impairment difficulty engaged success effective'.split())
 for x in r['adaptation']:assert set(x)==set('prior next count applied priorBytes nextBytes'.split())
 for x in r['learning']:assert set(x)=={'applied','next'}

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='SEVEN SKILL SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh52-run replay,rollback or tests.','Practice/impairment laws unresolved;performance mean is not latent competence inference.','First seven failed tests retained;Auto single-option result does not prove confidence-sensitive choice.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=7,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
