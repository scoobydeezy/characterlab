"""Preserve a successful scalar reduction without broadening its scope."""
from pathlib import Path
import json,hashlib,subprocess,copy
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-affect-reduction-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/AFFECT_REDUCTION_AUDIT_CONTRACT.md':'Accepted affect-reduction-audit0.1 receiving substitution only. Four declared projections, original14 producers70 restores and56 receiving trials repeated twice. Only projected packet plus current retained memory/history and safe cue/graph; no discarded coordinates. FullPair baseline and scalar equality valid outcomes. No new runtime persistence or recursive substituted feedback.',
'docs/planning/CAMPAIGN3_AFFECT_REDUCTION_COMPARISON.md':'VER-C3-AFFECT-REDUCTION-001: ScalarUncontrolled exactly preserves all14 qualified retrieval cases. ScalarExposure and HistoricalAverage fail declared receiver equivalence at full control; that does not prove psychological wrongness or vector necessity. Preserve exposure/source factors/other consumers. No build/test rerun at original comparison or this audit. Then-partial clause later qualified only for body-only reduction by distinct evidence.',
'docs/planning/AFFECT_REDUCTION_PLAN_REV1.json':'Frozen four canonical model identities and56 distinct substitution RunIdentities, original source manifests, ExperimentIdentity and ComparisonCase freshly reconstructed byte-for-byte. These identities describe substitutions, not56 independent new runtime trajectories.',
'docs/planning/AFFECT_REDUCTION_RESULT_REV1.json':'Whole original aggregate freshly reproduced:14 actual unchanged producers70 original-prefix restores56 advancing14 terminal;56 trials112 repeated receivers with argument immutability and exact outputs. Independent rational gain/rank/content/history checks on all56 trials preserve scalar equalities and named divergences.',
'docs/planning/AFFECT_REDUCTION_CHECK_REV1.json':'Original read-only structural/result checker freshly passes and matches frozen receipt. Prior affect-retrieval tests/build remain historical; no current wrapper completeness or native admission claim.',
'docs/planning/AFFECT_REGULATORY_REDUCTION_READINESS.md':'Prospective bounded body-only versus psychological-scalar distinction. Do not invent an E-sensitive receiver to force vector necessity. Later already-reviewed regulatory contract/qualification earns only body-history collision with differing admitted harm/goals and delayed stress, preserving ScalarThreat success and earlier ScalarUncontrolled retrieval equality. Readiness itself earns no new experiment.'}
prior=load(P/'campaign3-history-source-roles-rev117/index.json');roles0={x['path']:x for x in prior['roleAssignments']};assert not set(specs)&set(roles0)
backing=[roles0[p] for p in ['docs/formal/AFFECT_REGULATORY_REDUCTION_CONTRACT.md','docs/planning/CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md']]
for r in backing:assert ref(r['path'])['sha256']==r['sha256']
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-affect-reduction.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-affect-reduction.mjs'],text=True).strip()
plan=load(P/'AFFECT_REDUCTION_PLAN_REV1.json');v=load(P/'AFFECT_REDUCTION_RESULT_REV1.json');assert len(plan['trials'])==len(v['results'])==56
for a in plan['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
fmt=lambda x:f'{x.numerator}/{x.denominator}'
matches={law:0 for law in ['FullPair','ScalarUncontrolled','ScalarExposure','HistoricalAverage']}
for trial,row in zip(plan['trials'],v['results']):
 source=next(x for x in v['producers'] if x['name']==trial['name']);a=source['before']['affect'];law=trial['law'];packet=dict(at=a['at'],status=a['status'])
 if a['status']=='Known':
  e,u=F(a['exposure']),F(a['uncontrolled'])
  if law=='FullPair':packet.update(E=fmt(e),U=fmt(u))
  else:packet['value']=fmt(u if law=='ScalarUncontrolled' else e if law=='ScalarExposure' else (e+u)/2)
 assert packet==row['packet'];assert packet['at']<4
 gain=F(1)+(F(0) if packet['status']=='Unavailable' else F(packet['U'] if law=='FullPair' else packet['value']))
 scores=[];x=trial['inputs'][3];memory=source['before']['memory'];history=copy.deepcopy(source['before']['history'])
 if x['cue']:
  for e,h in zip(memory,history):
   base=sum((F(1,5-t) for t in h['times']),F(0));pull=F(1,8) if e['id']==1 and x['graph'] else F(0)
   scores.append(dict(id=e['id'],base=fmt(base),pull=fmt(pull),score=fmt(base+gain*pull)))
 winner=max(scores,key=lambda s:(F(s['score']),-s['id']))['id'] if scores else None
 if winner:history[winner-1]['times'].append(4)
 out=dict(gain=fmt(gain),scores=scores,selected=winner,detail=memory[winner-1]['display'] if winner else None,history=history)
 assert row['out']==out
 baseline=source['after']['rows'][3];base={k:baseline[k] for k in ['gain','scores','selected','detail']};base['history']=source['after']['history']
 assert row['matchesBaseline']==(out==base);matches[law]+=int(out==base)
assert matches['FullPair']==matches['ScalarUncontrolled']==14
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['identities.json','replay.json']]+[ref(p) for p in ['scripts/replay-history-affect-reduction.mjs','scripts/compare-affect-reduction.mjs','scripts/check-affect-reduction.mjs','docs/planning/campaign3-history-memory-access-rev1/review.json']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='AFFECT RECEIVING REDUCTION AUTHORITY / EQUALITY / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/disposition','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [2,3,6,7,8,10,11,19,20,21]]
r=dict(status='AFFECT REDUCTION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],priorAssignedBacking=backing,obligations=obs,independentArithmeticRows=56,exactMatches=matches,originalCheckerOutput=output,limits=['ScalarUncontrolled preserves all14 retrieval cases; keep exposure and source factor owners for other consumers.','ScalarExposure/HistoricalAverage divergence is declared receiver mismatch, not evidence against every scalar or psychological law.','56 receiving substitutions112 executions are not56 new whole-runtime replay qualifications;14 original producers70 prefixes, no recursive substitution or native persistence.','No new production/tests/build; prior focused/reference/build remain historical.','Later already-reviewed body-only reduction failure does not negate successful psychological ScalarThreat or ScalarUncontrolled reductions.','No failed execution cohort for this comparison; predecessor affect path/launch failure stays preserved.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c));print(json.dumps(matches))
