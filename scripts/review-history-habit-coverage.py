from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-habit-coverage-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/planning/HABIT_RESISTANCE_READINESS.md': 'Evidence-first intake: existing CONTROL may already meet acquired-habit inhibition/return within one run; separate qualification elsewhere neither automatic closure nor reason to invent new machinery. Preserve control absence, goal retirement and execution failure, not addiction.', 'docs/planning/HABIT_ACQUISITION_COVERAGE_READINESS.md': 'Evidence-first intake: learned scalar insufficient; require observed practice, cue-specific actual free action and expectation correction controls. Broader automaticity debt not necessarily clause blocker. Preserve Residual/Linear/NoHistory, journal/summary and truth-reader distinctions.', 'docs/planning/CAMPAIGN3_HABIT_RESISTANCE_QUALIFICATION.md': 'VER-C3-HABIT-RESIST-001 reconciles stale coverage omission using existing CONTROL0.2 seven models17 runs142 prefixes, no new independent experiments. Main TTTFTFFT; inhibition4/6/7 preserves history, load5 breaks control with goal maintained, retired goal permits return8. FATIGUE20/180 closure only and HABIT23/291 source evidence not added into replay totals. No compulsion/addiction/willpower law.', 'docs/planning/CAMPAIGN3_HABIT_ACQUISITION_QUALIFICATION.md': 'VER-C3-HABIT-ACQUIRE-001 existing12 HABIT models23 runs291 prefixes. Empty history, observed rewarded practice h half/threequarters/seveneighths, information correction knownfalse leaves acquired candidate, actual free target5 at probabilityhalf; unrewarded later h7/16 below threshold. History availability not extra motive die; neutral-choice policy/instructed initial exploration limits retained. Broader automaticity not solved.', 'docs/planning/HABIT_RESISTANCE_REPLAY_REV1.json': 'Historical repeat of17 original CONTROL identities and142 full-prefix restores125 advancing17 terminal. Exact original result hash commitments plus action/inhibition/retained-maintained goal/option/history summaries authenticate. Not new coverage or freshly reexecuted this review; current original checker validates semantic summaries.', 'docs/planning/HABIT_ACQUISITION_REPLAY_REV1.json': 'Historical23 original HABIT runs291 full-prefix checks268 advancing23 terminal; corrected audit records23 distinct runtime identities and actual execution rows. Original results match including prefix hashes/appraisals/probabilities/draws/views; no retroactive explicit RunIdentity field in old plan.', 'docs/planning/HABIT_RESISTANCE_CLOSURE_REV1.json': 'Fresh read-only closure passes CONTROL/FATIGUE exact artifacts and HABIT freeze/source evidence, primary semantic controls and repeated-run scope.1400/0 no production changes; underlying prior tests/build remain historical.', 'docs/planning/HABIT_ACQUISITION_CLOSURE_REV1.json': 'Fresh read-only closure passes resistance dependency, acquisition/failed-wrapper artifacts, original behavior contrasts and executed/chosen equality.75 affected/328 reference tests historical; no new tests/build or new coverage.', 'docs/planning/HABIT_ACQUISITION_AUDIT_FINDING_REV1.json': 'First wrapper compared actual runtime identity to undefined because older plan has no runIdentity field, after first complete-prefix run. Tooling failure not behavioral discrepancy. Exact rejected wrapper preserved; corrected check verifies full old results/input/model/initial/zero-seed scope and records runtime identities without rewriting original plan.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(P/'HABIT_RESISTANCE_CLOSURE_REV1.json'),ref(P/'HABIT_ACQUISITION_CLOSURE_REV1.json'),ref('scripts/audit-habit-resistance.mjs'),ref('scripts/audit-habit-acquisition.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='HABIT COVERAGE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
for n in ['HABIT_RESISTANCE_REPLAY_REV1.json','HABIT_ACQUISITION_REPLAY_REV1.json','HABIT_RESISTANCE_CLOSURE_REV1.json','HABIT_ACQUISITION_CLOSURE_REV1.json','HABIT_ACQUISITION_AUDIT_FINDING_REV1.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
r=load(P/'HABIT_RESISTANCE_REPLAY_REV1.json');assert r['reexecutedRuns']==17 and r['restores']==142 and r['advancing']==125 and r['terminal']==17
assert len({x['runIdentity'] for x in r['summaries']})==17
r=load(P/'HABIT_ACQUISITION_REPLAY_REV1.json');assert r['runs']==23 and r['prefixes']==291 and r['advancing']==268 and r['terminal']==23
assert len({x['runIdentity'] for x in r['actions']})==23
old=load(P/'HABIT_PUBLIC_EXPERIMENT_REV1.json');plan=load(P/'HABIT_PUBLIC_EXPERIMENT_PLAN_REV1.json')
assert all('runIdentity' not in x for x in plan['runs'])
for x in r['actions']:
 o=next(v for v in old['results'] if v['name']==x['name']);assert [v['performed'] for v in x['execution']]==o['chosen']
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/finding','/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='NINE HABIT COVERAGE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh closure/semantic receipt checks, not new17/142 CONTROL or23/291 HABIT runtime replay or tests/build.','Repeated runs not additive coverage; fatigue/source controls keep separate counts.','Old HABIT plan lacks explicit runIdentity; corrected wrapper records actual identity without rewriting historical scope.','Availability after instructed practice and neutral choice not general spontaneous exploration/strong-motive compulsion; journal retained under summary equality.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
