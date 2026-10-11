from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-relapse-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/RELAPSE_EXPERIMENT_CONTRACT.md': 'Accepted0.1 experiment reuses control-public0.2 seven exact models. Three actual idle opportunities4/5/6 after trainedtarget1..3 then load7, remove8. Goal retained/maintained and belief/history unchanged; neutral load no motive. All8seeds mandatory, returning not inevitable. No physiological recovery or learned inhibition.', 'docs/planning/RELAPSE_READINESS.md': 'Prospective enacted temporal history required, not craving eligibility or physical adaptation. Separate retained acquired habit, belief, goal/control, access and motor outcome. Existing two-option/NoActiveReasons scopes; no generic relapse switch or hidden deficit consumer.', 'docs/planning/RELAPSE_REPORT_DRAFT.md': 'Superseded intermediate pending report, explicitly not verdict. Five tests/build did not qualify31runs279prefixes before completed execution. Final qualification supersedes pending routing without erasing preserved failure.', 'docs/planning/CAMPAIGN3_RELAPSE_QUALIFICATION.md': 'VER-C3-RELAPSE-001:7 reused models31newpublicruns279prefixes248advancing31terminal. Seeds1/7return at7,0/2/3/4/5/6do not, allwithhold4/5/6/8. NoLoadwithholds4..8. Actualexecution1024 not merely restored candidate. Full appraisal/goals same at7 despite different available inhibition. Finite seeds not calibrated rate.', 'docs/planning/RELAPSE_FINDINGS.md': 'Earlier one-idle CONTROL witness extended to three actual withholdings, not new law. Buffer boundary rejects initial harness before settlement; Uint8Array.from conversion only, REV2same model/run/source/seed values. No unfavorable scientific run discarded. Lostmaintenance/retirement/beliefcorrection/cue/deniedload separate causes.', 'docs/planning/RELAPSE_HARNESS_FAILURE_REV1.json': 'BELIEF_DATA_BYTES before firstpublicsettlement; exact plainUint8Array boundary worked. Six archived artifacts preserve original wrapper and plan dependencies. Correction wrapper only; original scientific inputs/model/runIDs unchanged.', 'docs/planning/RELAPSE_PLAN_REV1.json': 'Initial frozenplan unexecuted due Buffer rejection; all31runs and7models exactly equal REV2. Do not count as second scientific cohort.', 'docs/planning/RELAPSE_PLAN_REV2.json': 'Corrected harness refrozen before execution;31distinct newRunIDs, seven exactoriginalCONTROL modelIDs. Exact seed0..7pairedmain/noLoad and all15othercandidate/controlrows retained. No production source/model change.', 'docs/planning/RELAPSE_RESULT_REV2.json': '31 complete rows9prefixes each, original fullstate/output/trace/safe hashes and exact summaries. Fresh replay compares entire result not favorable action subset. Original31runIDmatches, returned1/7, fullrestores plusone successor each not arbitrary fulltail claim.', 'docs/planning/RELAPSE_CLOSURE_REV1.json': 'Fresh original closure authenticates unchanged CONTROL sourcegraph, old/newplansameIDs, six failurearchives, originalscientificassertions and historical5/328tests/build. No fresh test/build execution.', 'docs/planning/RELAPSE_TESTS_REV1.json': 'Five individually passing historical tests including all8seeds, comparator and control contrasts. Passing scientific tests preceded rejected public wrapper; not proof initial harness passed.', 'docs/planning/RELAPSE_REFERENCE_TESTS_REV1.json': 'Historical328 individually passing reference tests; not new fullactive-suite claim or sustainedrelapse evidence.', 'docs/planning/RELAPSE_BUILD_REV1.json': 'HistoricalbuildPASS exit0 bound exact sourceartifacts. No fresh build or production change.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'replay-check.json'),ref('scripts/check-history-relapse.mjs'),ref(P/'RELAPSE_CLOSURE_REV1.json'),ref('scripts/qualify-relapse.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RELAPSE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'RELAPSE_RESULT_REV2.json');plan=load(P/'RELAPSE_PLAN_REV2.json');old=load(P/'RELAPSE_PLAN_REV1.json')
assert v['planSha256']==ref(P/'RELAPSE_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==31 and sum(len(r['prefixHashes']) for r in v['results'])==279
assert plan['runs']==old['runs'] and plan['models']==old['models'] and v['returnedSeeds']==[1,7]
for r,p in zip(v['results'],plan['runs']):
 for k in ['candidate','law','name','seed','runIdentity','modelIdentity']:assert r[k]==p[k]
for n,count in [('RELAPSE_TESTS_REV1.json',5),('RELAPSE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'RELAPSE_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
preserved=[]
for a in load(P/'RELAPSE_HARNESS_FAILURE_REV1.json')['artifacts']:
 assert ref(a['preserved'])['sha256']==a['sha256'];preserved.append(ref(a['preserved']))
for a in old['artifacts']:
 assert any(x['path'].endswith('/'+a['path']) and x['sha256']==a['sha256'] for x in preserved),a['path']
r=load(O/'replay-check.json');assert r['status']=='PASS' and r['prefixes']==279 and r['runs']==31 and r['returnedSeeds']==[1,7]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/finding','/cause','/correction'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='THIRTEEN RELAPSE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh31 original public runs279prefix restorations with one successor each; historical5/328tests/build not rerun.','All8seeds retained:2return6nonreturn, finite witness not calibratedrate.','Goal-supported instructed adjustment not learned abstinence or physiological recovery; no craving or bodyintegration.','Restored candidate not forced choice; neutral load no new motive; retirement/lostmaintenance/belief/cue causes remain separate.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
